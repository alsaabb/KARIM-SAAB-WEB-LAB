#!/usr/bin/env python3
"""Fail-closed, read-only quality gate for KARIM SAAB's published /dist tree."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
MAX_IMAGE_BYTES = 250 * 1024
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".bmp"}
TEXT_EXTS = {".js", ".html", ".json", ".css", ".xml", ".txt", ".csv"}
YOUTUBE_ID = re.compile(r"^[A-Za-z0-9_-]{11}$")
DOC_EDIT = re.compile(r"https?://docs\.google\.com/(?:document|spreadsheets|presentation)/d/[^\s\"'<>]+?/edit(?:[?#][^\s\"'<>]*)?", re.I)
SECRET_RULES = {
    "private key": re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    "Google API key": re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b"),
    "GitHub token": re.compile(r"\b(?:gh[pousr]_[0-9A-Za-z]{20,}|github_pat_[A-Za-z0-9_]{20,})\b"),
    "AWS access key": re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
    "OpenAI secret": re.compile(r"\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b"),
    "Slack token": re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{24,}\b"),
    "password literal": re.compile(r"""(?i)\b(?:api_secret|client_secret|password|private_key)\b\s*[:=]\s*["'][A-Za-z0-9+/=_-]{24,}["']"""),
}


def run() -> int:
    problems: list[str] = []
    if not DIST.is_dir():
        print("FAIL: missing dist/")
        return 1

    def bad(path: Path | str, message: str) -> None:
        name = path.relative_to(ROOT).as_posix() if isinstance(path, Path) else str(path)
        problems.append(f"{name}: {message}")

    for f in sorted(DIST.rglob("*")):
        if not f.is_file():
            continue
        if f.suffix.lower() in IMAGE_EXTS and f.stat().st_size > MAX_IMAGE_BYTES:
            bad(f, f"image {f.stat().st_size:,} bytes > 250 KiB")
        if f.suffix.lower() not in TEXT_EXTS:
            continue
        data = f.read_text(encoding="utf-8", errors="replace")
        decoded = data.replace("\\/", "/")
        for name, pat in SECRET_RULES.items():
            if pat.search(decoded):
                bad(f, f"possible exposed {name} (inspect privately)")
        if DOC_EDIT.search(decoded):
            bad(f, "Google Docs edit link exposed")
        if "?usp=drivesdk" in decoded.lower() or "&usp=drivesdk" in decoded.lower():
            bad(f, "Drive SDK tracking/edit link exposed")

    ar = DIST / "share" / "ar"
    en = DIST / "share" / "en"
    ar_files = {p.name for p in ar.glob("*.html")} if ar.is_dir() else set()
    en_files = {p.name for p in en.glob("*.html")} if en.is_dir() else set()
    if not ar_files or not en_files or ar_files != en_files:
        bad("dist/share", f"AR/EN page mismatch: ar={len(ar_files)}, en={len(en_files)}; differences={sorted(ar_files ^ en_files)[:10]}")
    for lang, directory in (("ar", ar), ("en", en)):
        for page in sorted(directory.glob("*.html")):
            markup = page.read_text(encoding="utf-8")
            if f'<html lang="{lang}"' not in markup:
                bad(page, "wrong or missing html lang")
            if not re.search(r'<link\s+rel="canonical"\s+href="' + re.escape(BASE), markup):
                bad(page, "canonical outside production domain")

    def inspect_json(obj: object, path: Path, loc: str = "$") -> None:
        if isinstance(obj, list):
            for i, value in enumerate(obj):
                inspect_json(value, path, f"{loc}[{i}]")
        elif isinstance(obj, dict):
            for source, translation in (("title_ar", "title_en"), ("body_ar", "body_en")):
                if source in obj and obj[source] not in (None, "", []) and (
                    translation not in obj or obj[translation] in (None, "", [])
                    or isinstance(obj[translation], str) and not obj[translation].strip()
                ):
                    bad(path, f"{loc}: missing {translation}")
            for key, val in obj.items():
                if key == "youtube_id" and val not in (None, "") and (
                    not isinstance(val, str) or not YOUTUBE_ID.fullmatch(val)
                ):
                    bad(path, f"{loc}: malformed YouTube ID")
                if isinstance(val, (dict, list)):
                    inspect_json(val, path, f"{loc}.{key}")

    for f in sorted((DIST / "data").glob("*.json")):
        try:
            inspect_json(json.loads(f.read_text(encoding="utf-8")), f)
        except json.JSONDecodeError as e:
            bad(f, f"invalid JSON: {e}")

    index_path = DIST / "index.html"
    if not index_path.is_file():
        bad("dist/index.html", "missing main HTML")
    else:
        html = index_path.read_text(encoding="utf-8")
        required = {
            "canonical": r'<link\s+rel="canonical"\s+href="' + re.escape(BASE + "index.html"),
            "Arabic hreflang": r'<link\s+rel="alternate"\s+hreflang="ar"\s+href="' + re.escape(BASE + "share/ar/home.html"),
            "English hreflang": r'<link\s+rel="alternate"\s+hreflang="en"\s+href="' + re.escape(BASE + "share/en/home.html"),
            "default hreflang": r'<link\s+rel="alternate"\s+hreflang="x-default"',
            "CSP": r'<meta\s+http-equiv="Content-Security-Policy"',
            "CSP scripts restricted": r"script-src\s+[^;]+;",
            "CSP frames restricted": r"frame-src\s+[^;]+;",
            "CSP object blocked": r"object-src\s+'none'",
            "OG title": r'<meta\s+property="og:title"',
            "OG description": r'<meta\s+property="og:description"',
            "OG URL": r'<meta\s+property="og:url"',
            "OG image": r'<meta\s+property="og:image"',
            "Twitter Card": r'<meta\s+name="twitter:card"',
            "preloaded optimized hero": r'<link\s+rel="preload"\s+as="image"\s+href="assets/hero-ar-approved.webp"',
        }
        for label, pattern in required.items():
            if not re.search(pattern, html, re.I):
                bad(index_path, f"missing {label}")
        if "leaflet.css" in html and not re.search(r'leaflet\.css"[^>]*integrity="sha256-', html):
            bad(index_path, "Leaflet CSS requires SRI")
        if "leaflet.js" in html and not re.search(r'leaflet\.js"[^>]*integrity="sha256-', html):
            bad(index_path, "Leaflet JS requires SRI")
    sitemap_path = DIST / "sitemap.xml"
    try:
        doc = ET.parse(sitemap_path)
        ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        locations = [n.text.strip() for n in doc.findall("sm:url/sm:loc", ns) if n.text]
        if not locations or locations[0] != BASE + "index.html":
            bad(sitemap_path, "dist/index.html must be first sitemap URL")
        for location in locations:
            if not location.startswith(BASE):
                bad(sitemap_path, "non-production sitemap URL")
                break
    except (OSError, ET.ParseError) as e:
        bad("dist/sitemap.xml", f"unreadable sitemap: {e}")
    robots = (DIST / "robots.txt")
    if not robots.is_file() or "Sitemap: " + BASE + "sitemap.xml" not in robots.read_text(encoding="utf-8"):
        bad("dist/robots.txt", "missing canonical sitemap URL")

    if problems:
        for p in problems[:80]:
            print("FAIL:", p)
        if len(problems) > 80:
            print(f"... {len(problems)-80} more failures")
        print(f"QA FAILED: {len(problems)} issue(s)")
        return 1
    print(f"QA PASSED: {len(ar_files)} AR + {len(en_files)} EN share pages; metadata, security, media limits, localizations, and sitemap validated.")
    return 0


if __name__ == "__main__":
    sys.exit(run())
