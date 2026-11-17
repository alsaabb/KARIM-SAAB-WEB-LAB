#!/usr/bin/env python3
"""KARIM SAAB V3: repeatable PREVIEW-ONLY preparation, generation and QA.

Never merges a PR, publishes to YouTube, deploys Pages or writes Google Drive.
Prepare runs only on a non-main review branch and reuses the existing SEO and
registry generators; no secrets or owner Drive folder identifiers are stored.
"""
from __future__ import annotations

import argparse
from datetime import date
import hashlib
from html import escape
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys
from urllib.parse import parse_qs, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
INDEX = "dist/data/story-publisher-v3-index.json"
REQUIRED = (
    "title_ar", "title_en", "seo_title_ar", "seo_title_en",
    "description_ar", "description_en", "article_ar", "article_en",
    "poster_asset_ar", "poster_asset_en", "poster_sha256_ar",
    "poster_sha256_en", "poster_width", "poster_height", "tags",
)
PUBLIC_FIELDS = REQUIRED + (
    "schema_version", "version", "route", "youtube_id", "youtube_url",
    "poster_kind", "poster_note_ar", "poster_note_en", "editorial_approved",
)
ID_RE = re.compile(r"^[a-zA-Z0-9_-]{11}$")
SHA_RE = re.compile(r"^[a-f0-9]{64}$")
ROUTE_RE = re.compile(r"^story/([a-z0-9]+(?:-[a-z0-9]+)*)$")
VERSION_RE = re.compile(r"^V[0-9]{2,3}$")
SCHEMA = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


class PreflightError(ValueError):
    """Fail-closed owner content, safety, or duplicate validation."""


def read_json(path: Path) -> dict:
    try:
        obj = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise PreflightError("Cannot load JSON: " + str(path)) from exc
    if not isinstance(obj, dict):
        raise PreflightError("Content manifest must be a JSON object")
    return obj


def extract_youtube_id(url: str) -> str | None:
    try:
        p = urlsplit(url)
    except ValueError:
        return None
    host = (p.hostname or "").lower()
    if p.scheme != "https" or p.username or p.password or p.port:
        return None
    if host == "youtu.be":
        result = p.path.strip("/")
    elif host in ("youtube.com", "www.youtube.com", "m.youtube.com"):
        if p.path == "/watch":
            result = (parse_qs(p.query).get("v") or [""])[0]
        elif p.path.startswith("/shorts/") or p.path.startswith("/embed/"):
            result = p.path.split("/")[2] if len(p.path.split("/")) == 3 else ""
        else:
            return None
    else:
        return None
    return result if ID_RE.fullmatch(result or "") else None


def public_image_path(value: object) -> str:
    if not isinstance(value, str) or not value.startswith("assets/"):
        raise PreflightError("Poster path must be a local assets/... WebP file")
    path = PurePosixPath(value)
    if path.is_absolute() or ".." in path.parts or path.suffix.lower() != ".webp":
        raise PreflightError("Poster path escapes assets/ or is not WebP")
    if "\\" in value or "?" in value or "#" in value or value.startswith("assets//"):
        raise PreflightError("Invalid poster path syntax")
    return str(path)


def content_fingerprint(data: dict) -> str:
    # Fingerprint is over only the public editorial fields, never Drive data.
    public = {k: data.get(k) for k in PUBLIC_FIELDS if k != "editorial_approved"}
    return hashlib.sha256(json.dumps(public, sort_keys=True, ensure_ascii=False,
                                     separators=(",", ":")).encode("utf-8")).hexdigest()


def source_path(data: dict) -> str:
    slug = ROUTE_RE.fullmatch(data["route"]).group(1)
    return "dist/data/story-v3-" + slug + "-" + data["version"].lower() + ".json"


def share_stem(data: dict) -> str:
    return "story-" + ROUTE_RE.fullmatch(data["route"]).group(1) + ".html"


def validate(data: dict, root: Path, *, existing_index: dict | None = None) -> list[str]:
    errors = []
    if data.get("schema_version") != "3.0":
        errors.append("schema_version must be 3.0")
    if data.get("editorial_approved") is not True:
        errors.append("editorial_approved must be true (owner-approved full AR and EN)")
    if not ROUTE_RE.fullmatch(str(data.get("route") or "")):
        errors.append("route must match story/[safe-latin-slug]")
    if not VERSION_RE.fullmatch(str(data.get("version") or "")):
        errors.append("version must be V01, V02, etc.")
    if not ID_RE.fullmatch(str(data.get("youtube_id") or "")):
        errors.append("youtube_id must contain exactly 11 characters")
    if extract_youtube_id(str(data.get("youtube_url") or "")) != data.get("youtube_id"):
        errors.append("youtube_url must be an HTTPS YouTube URL matching youtube_id")
    if data.get("poster_kind") not in ("original_photo", "ai_illustration", "verified_youtube_still"):
        errors.append("poster_kind must be original_photo, ai_illustration or verified_youtube_still")
    for field in REQUIRED:
        if field not in data or data[field] is None or data[field] == "":
            errors.append("Missing required field: " + field)
    for field in ("poster_width", "poster_height"):
        if not isinstance(data.get(field), int) or isinstance(data.get(field), bool) or not 1 <= data.get(field, 0) <= 8000:
            errors.append(field + " must be a positive integer up to 8000")
    for lang in ("ar", "en"):
        title = data.get("title_" + lang)
        article = data.get("article_" + lang)
        if not isinstance(title, str) or not title.strip():
            errors.append("Missing article title for " + lang)
        if not isinstance(article, str) or len(article.split()) < 55:
            errors.append("Article too short or absent for " + lang)
        if isinstance(title, str) and isinstance(article, str) and not article.startswith(title + "\n"):
            errors.append("Article heading must exactly match title_" + lang)
        if not isinstance(data.get("description_" + lang), str) or len(str(data.get("description_" + lang))) < 40:
            errors.append("Missing substantive SEO description for " + lang)
        if data.get("poster_kind") == "ai_illustration" and not str(data.get("poster_note_" + lang) or "").strip():
            errors.append("Illustrative cover requires honest disclosure in " + lang)
        asset = data.get("poster_asset_" + lang)
        expected_hash = data.get("poster_sha256_" + lang)
        try:
            relative = public_image_path(asset)
        except PreflightError as exc:
            errors.append(lang + " " + str(exc))
            continue
        file_path = root / "dist" / relative
        if not file_path.is_file():
            errors.append("Missing " + lang + " poster: dist/" + relative)
            continue
        payload = file_path.read_bytes()
        if len(payload) > 250 * 1024:
            errors.append("Poster exceeds site image budget: " + relative)
        if payload[:4] != b"RIFF" or payload[8:12] != b"WEBP":
            errors.append("Not a WebP image: " + relative)
        if not SHA_RE.fullmatch(str(expected_hash or "")):
            errors.append("poster_sha256_" + lang + " must be SHA-256 hex")
        elif hashlib.sha256(payload).hexdigest() != expected_hash:
            errors.append("Cover hash mismatch: " + relative)
    if data.get("poster_asset_ar") == data.get("poster_asset_en"):
        errors.append("Arabic and English cover assets must be distinct")
    if not isinstance(data.get("tags"), str) or not str(data.get("tags")).strip().startswith("#"):
        errors.append("tags must contain owner-approved hashtags")
    if "drive_destinations" in data or any(k.lower().startswith("archive_folder") for k in data):
        errors.append("Private archive destination IDs belong in the external archive handoff, not in public content")

    if not ROUTE_RE.fullmatch(str(data.get("route") or "")) or not VERSION_RE.fullmatch(str(data.get("version") or "")):
        return errors
    if existing_index is None:
        index_file = root / INDEX
        existing_index = read_json(index_file) if index_file.exists() else {"entries": []}
    entries = existing_index.get("entries", [])
    if not isinstance(entries, list):
        errors.append("Invalid V3 entries index")
        entries = []
    own_source = source_path(data)
    for entry in entries:
        if entry.get("route") == data["route"]:
            if entry.get("source") != own_source.removeprefix("dist/") or entry.get("source_fingerprint") != content_fingerprint(data):
                errors.append("Existing V3 route differs: use a distinct version and owner-reviewed update procedure")
        elif entry.get("youtube_id") == data.get("youtube_id"):
            errors.append("YouTube ID already registered on another V3 route")
    # Block duplicates already published through older handwritten templates.
    for file in (root / "dist/data").glob("*.json"):
        try:
            saved = json.loads(file.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        if not isinstance(saved, dict) or file == root / INDEX:
            continue
        if file == root / own_source:
            continue
        if saved.get("youtube_id") == data.get("youtube_id") or saved.get("route") == data.get("route"):
            errors.append("Existing story already owns ID or route: " + file.name)
    return errors


def report(data: dict, root: Path) -> dict:
    problems = validate(data, root)
    return {
        "ready": not problems,
        "state": "READY" if not problems else "BLOCKED",
        "youtube_id": data.get("youtube_id"),
        "route": data.get("route"),
        "source_file": source_path(data) if ROUTE_RE.fullmatch(str(data.get("route") or "")) and
                       VERSION_RE.fullmatch(str(data.get("version") or "")) else None,
        "issues": problems,
        "public_release": False,
        "drive_archive": False,
    }


def assert_review_branch(root: Path):
    try:
        x = subprocess.run(["git", "branch", "--show-current"], cwd=root,
                           capture_output=True, text=True, check=True)
    except (OSError, subprocess.CalledProcessError) as exc:
        raise PreflightError("prepare requires a local Git review branch") from exc
    branch = x.stdout.strip()
    if not branch or branch in ("main", "master", "HEAD"):
        raise PreflightError("Refusing to write on main/master or detached HEAD")
    return branch


def record(data: dict) -> dict:
    result = {k: data[k] for k in PUBLIC_FIELDS if k in data and k != "editorial_approved"}
    result["source_fingerprint"] = content_fingerprint(data)
    result["record_status"] = "APPROVED_REVIEW_NOT_LIVE"
    return result


def short_entry(data: dict) -> dict:
    result = {k: data[k] for k in (
        "route", "youtube_id", "title_ar", "title_en",
        "description_ar", "description_en",
        "poster_asset_ar", "poster_asset_en",
        "poster_width", "poster_height",
    )}
    result["source"] = source_path(data).removeprefix("dist/")
    result["source_fingerprint"] = content_fingerprint(data)
    return result


def static_share(data: dict, lang: str) -> str:
    h = lambda s: escape(str(s), quote=True)
    stem = share_stem(data)
    url = SITE + "share/" + lang + "/" + stem
    ar_url = SITE + "share/ar/" + stem
    en_url = SITE + "share/en/" + stem
    target = SITE + "index.html#/" + lang + "/" + data["route"]
    poster = SITE + data["poster_asset_" + lang]
    title = data["title_" + lang]
    seo = data["seo_title_" + lang]
    desc = data["description_" + lang]
    note = data.get("poster_note_" + lang) or ""
    direction = "rtl" if lang == "ar" else "ltr"
    paragraphs = "\n".join("<p>" + h(line) + "</p>" for line in data["article_" + lang].splitlines() if line.strip())
    articles_title = "النص الكامل المعتمد" if lang == "ar" else "Full approved article"
    back = "العودة للموقع" if lang == "ar" else "Open interactive site"
    watch = "مشاهدة الفيديو على YouTube" if lang == "ar" else "Watch on YouTube"
    return (
        '<!doctype html><html lang="' + lang + '" dir="' + direction + '"><head>\n'
        '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
        '<title>' + h(seo) + '</title>\n'
        '<meta name="description" content="' + h(desc) + '">\n'
        '<meta name="robots" content="index,follow">\n'
        '<meta property="og:type" content="article"><meta property="og:site_name" content="KARIM SAAB">\n'
        '<meta property="og:title" content="' + h(seo) + '"><meta property="og:description" content="' + h(desc) + '">\n'
        '<meta property="og:image" content="' + h(poster) + '"><meta property="og:url" content="' + h(url) + '">\n'
        '<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="' + h(seo) + '">\n'
        '<meta name="twitter:description" content="' + h(desc) + '"><meta name="twitter:image" content="' + h(poster) + '">\n'
        '<meta name="keywords" content="' + h(data["tags"].replace("#", "").strip()) + '">\n'
        '<link rel="canonical" href="' + h(url) + '">\n'
        '<link rel="alternate" hreflang="ar" href="' + h(ar_url) + '">\n'
        '<link rel="alternate" hreflang="en" href="' + h(en_url) + '">\n'
        '<link rel="alternate" hreflang="x-default" href="' + h(en_url) + '">\n'
        '<style>body{font:16px/1.95 system-ui,Tahoma,Arial,sans-serif;background:#141414;color:#f8f1e5;margin:0}'
        'main{max-width:850px;margin:auto;padding:20px}h1,h2{color:#d4af37}p{overflow-wrap:anywhere}'
        'img{display:block;width:min(100%,430px);height:auto;object-fit:contain;margin:20px 0}'
        'a{color:#f4d690}.note{font-size:.85rem;color:#b9b1a3}</style></head><body><main>\n'
        '<nav><a href="' + h(target) + '">' + back + '</a></nav>\n'
        '<header><small>KARIM SAAB · DOCUMENTARY</small><h1>' + h(title) + '</h1></header>\n'
        '<img src="../../' + h(data["poster_asset_" + lang]) + '" width="' + str(data["poster_width"]) +
        '" height="' + str(data["poster_height"]) + '" alt="' + h(title) + '">\n'
        + ('<p class="note">' + h(note) + '</p>' if note else '') +
        '<section id="ks-seo-source-content"><h2>' + articles_title + '</h2>' + paragraphs + '</section>\n'
        '<p><a href="' + h(data["youtube_url"]) + '" target="_blank" rel="noopener noreferrer">' + watch + '</a></p>\n'
        '</main><footer><a href="' + h(target) + '">KARIM SAAB</a></footer></body></html>\n'
    )


def write_new(path: Path, contents: str):
    # Explicit fail-closed idempotency: no silent overwrites of existing published work.
    if path.exists():
        if path.read_text(encoding="utf-8") == contents:
            return False
        raise PreflightError("Refusing to overwrite existing file: " + str(path))
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(contents, encoding="utf-8")
    return True


def add_sitemap(root: Path, data: dict):
    path = root / "dist/sitemap.xml"
    before = path.read_text(encoding="utf-8")
    root_xml = ET.fromstring(before)
    urls = {el.text for el in root_xml.iter(SCHEMA + "loc") if el.text}
    links = [SITE + "share/" + lang + "/" + share_stem(data) for lang in ("ar", "en")]
    if all(link in urls for link in links):
        return False
    if any(link in urls for link in links):
        raise PreflightError("Sitemap is partially generated; investigate before retrying")
    if not before.endswith("</urlset>\n"):
        raise PreflightError("Unexpected sitemap structure; refuse in-place edit")
    today = date.today().isoformat()
    new_entries = "".join("  <url>\n    <loc>" + escape(link) +
                          "</loc>\n    <lastmod>" + today + "</lastmod>\n  </url>\n" for link in links)
    path.write_text(before.replace("</urlset>\n", new_entries + "</urlset>\n"), encoding="utf-8")
    return True


def prepare(data: dict, root: Path, *, regenerate=True) -> dict:
    issues = validate(data, root)
    if issues:
        raise PreflightError("; ".join(issues))
    index_path = root / INDEX
    index = read_json(index_path)
    entries = index.get("entries", [])
    match = next((e for e in entries if e.get("route") == data["route"]), None)
    if match:
        if match.get("source_fingerprint") != content_fingerprint(data):
            raise PreflightError("V3 route registered with different content")
        return {"state": "ALREADY_PREPARED", "changed": [], "regenerated": False}

    paths = [root / source_path(data)]
    paths += [root / "dist/share" / lang / share_stem(data) for lang in ("ar", "en")]
    for path in paths:
        if path.exists():
            raise PreflightError("Refusing existing unregistered file: " + str(path))
    sm = (root / "dist/sitemap.xml").read_text(encoding="utf-8")
    if any("share/" + lang + "/" + share_stem(data) in sm for lang in ("ar", "en")):
        raise PreflightError("Sitemap already has a conflicting story URL")

    changed = []
    payload = json.dumps(record(data), ensure_ascii=False, indent=2, sort_keys=True) + "\n"
    if write_new(paths[0], payload):
        changed.append(str(paths[0].relative_to(root)))
    for lang, path in zip(("ar", "en"), paths[1:]):
        if write_new(path, static_share(data, lang)):
            changed.append(str(path.relative_to(root)))
    if add_sitemap(root, data):
        changed.append("dist/sitemap.xml")
    index["entries"].append(short_entry(data))
    index["entries"].sort(key=lambda x: x["route"])
    index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    changed.append(INDEX)
    if regenerate:
        for script in ("scripts/build_seo_share.py", "scripts/build_site_master_registry.py"):
            subprocess.run([sys.executable, script, "--write"], cwd=root, check=True)
    return {"state": "BUILDING_REVIEW_ONLY", "changed": changed, "regenerated": regenerate}


def check(root: Path, *, fast=False):
    cmds = [
        [sys.executable, "scripts/build_seo_share.py", "--check"],
        [sys.executable, "scripts/build_site_master_registry.py", "--check"],
        [sys.executable, "scripts/verify_site.py"],
        [sys.executable, "scripts/qa_gate.py"],
    ]
    if not fast:
        cmds += [
            [sys.executable, "scripts/build_css_bundle.py", "--check"],
            [sys.executable, "scripts/verify_identity.py"],
            [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-p", "test_*.py", "-v"],
            ["node", "--check", "dist/story-publisher-v3.js"],
        ]
    for cmd in cmds:
        print("V3 CHECK:", " ".join(cmd), flush=True)
        subprocess.run(cmd, cwd=root, check=True)
    return {"state": "TESTING_PASSED", "checks": len(cmds),
            "published": False, "archived": False}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("command", choices=("plan", "prepare", "check"))
    parser.add_argument("--manifest", type=Path, help="Approved owner content JSON; required for plan/prepare")
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--fast", action="store_true", help="check only the four core gates")
    args = parser.parse_args(argv)
    root = args.root.resolve()
    try:
        if args.command == "check":
            result = check(root, fast=args.fast)
        else:
            if args.manifest is None:
                parser.error("--manifest is required for plan/prepare")
            data = read_json(args.manifest)
            if args.command == "plan":
                result = report(data, root)
            else:
                assert_review_branch(root)
                result = prepare(data, root)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0 if result.get("state") != "BLOCKED" else 2
    except (PreflightError, OSError, ValueError, subprocess.CalledProcessError) as exc:
        print(json.dumps({"state": "BLOCKED", "error": str(exc),
                          "published": False, "archived": False}, ensure_ascii=False), file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
