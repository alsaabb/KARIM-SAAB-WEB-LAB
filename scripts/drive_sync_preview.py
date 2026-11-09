#!/usr/bin/env python3
"""Read-only Drive -> offline HTML preview (never changes the published site).

Use --mode fixture for tests; --mode drive needs a service account shared on the
specific content folders. No Drive secrets, draft content, or Google IDs are
written to the generated public preview pages.
"""
import argparse
import hashlib
import html
import json
import os
import re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "tests" / "fixtures" / "drive-content"
DEFAULT_AR_FOLDER = "1kKfWm-YT6DvJNuYb9U3RwJ4tE2XrTJVX"
DEFAULT_EN_FOLDER = "19HLnIs-Bza3NQMSff_EddfCY9gf8xB2p"
ALLOWED_KEYS = {
    "id", "status", "title", "publisher", "published_date", "source_url",
    "logo_url", "image_url", "hashtags", "summary", "rights_cleared"
}
ID_RE = re.compile(r"^[A-Z][A-Z0-9_-]{2,60}$")


def safe_url(value):
    if not value:
        return ""
    p = urlsplit(value)
    if p.scheme != "https" or not p.hostname or p.username or p.password:
        raise ValueError("Only absolute public HTTPS URLs are allowed")
    if p.hostname in {"localhost", "127.0.0.1", "::1"} or p.hostname.endswith(".local"):
        raise ValueError("Local or private URLs are not allowed")
    return value


def parse_document(text, lang):
    """One editable plain-text Google Doc per content item.

    Header uses key: value lines; body begins after a line exactly ---BODY---.
    Only approved items can be exported to staging.
    """
    text = text.lstrip("\ufeff").replace("\r\n", "\n")
    if "\n---BODY---\n" not in "\n" + text:
        raise ValueError("Missing ---BODY--- separator")
    header, body = text.split("---BODY---", 1)
    attrs = {}
    for line in header.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if ":" not in line:
            raise ValueError("Malformed metadata line")
        key, value = line.split(":", 1)
        key = key.strip().lower()
        if key not in ALLOWED_KEYS:
            raise ValueError("Unknown metadata field: " + key)
        if key in attrs:
            raise ValueError("Duplicate metadata field: " + key)
        attrs[key] = value.strip()

    if attrs.get("status", "").lower() != "approved":
        return None
    item_id = attrs.get("id", "")
    if not ID_RE.fullmatch(item_id):
        raise ValueError("Invalid article ID; use A-Z, 0-9, '-' or '_'")
    title = attrs.get("title", "")
    if len(title) < 3 or len(title) > 180:
        raise ValueError("Title missing or too long")
    body = body.strip()
    if len(body) < 15 or len(body) > 80000:
        raise ValueError("Article body missing or too long")
    date = attrs.get("published_date", "")
    if date and not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date):
        raise ValueError("Date must use YYYY-MM-DD")
    publisher = attrs.get("publisher", "")
    if not publisher:
        raise ValueError("Publisher/source label is required")
    for field in ("source_url", "logo_url", "image_url"):
        safe_url(attrs.get(field, ""))
    if (attrs.get("logo_url") or attrs.get("image_url")) and attrs.get("rights_cleared") != "yes":
        raise ValueError("For public media, rights_cleared: yes is required")
    return {"id": item_id, "lang": lang, "title": title, "body": body,
            "publisher": publisher, "published_date": date,
            "summary": attrs.get("summary", ""),
            "source_url": attrs.get("source_url", ""),
            "logo_url": attrs.get("logo_url", ""),
            "image_url": attrs.get("image_url", ""),
            "hashtags": attrs.get("hashtags", "")}


def render(item):
    e = lambda s: html.escape(s, quote=True)
    lang = item["lang"]
    direction = "rtl" if lang == "ar" else "ltr"
    subtitle = "نموذج تجريبي غير منشور" if lang == "ar" else "Unpublished staging preview"
    publisher = e(item["publisher"])
    parts = [f'<p class="publisher">{publisher}</p>']
    if item["logo_url"]:
        parts.append('<img class="logo" alt="Publisher logo" src="' + e(item["logo_url"]) + '">')
    parts.append('<h1>' + e(item["title"]) + '</h1>')
    if item["published_date"]:
        parts.append('<p class="date">' + e(item["published_date"]) + '</p>')
    if item["image_url"]:
        parts.append('<img class="scan" alt="Press article image" src="' + e(item["image_url"]) + '">')
    parts.extend('<p>' + e(p).replace("\n", "<br>") + '</p>'
                 for p in re.split(r"\n\s*\n", item["body"]) if p.strip())
    if item["source_url"]:
        label = "مصدر المقال الأصلي" if lang == "ar" else "Original article source"
        parts.append('<p><a href="' + e(item["source_url"]) +
                     '" rel="noopener noreferrer" target="_blank">' + label + '</a></p>')
    if item["hashtags"]:
        parts.append('<p class="tags">' + e(item["hashtags"]) + '</p>')
    title = e(item["title"]) + " | KARIM SAAB"
    description = e(item["summary"][:160] or item["body"][:160])
    return ('<!doctype html><html lang="' + lang + '" dir="' + direction + '">'
            '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<meta name="robots" content="noindex,nofollow"><title>' + title + '</title>'
            '<meta name="description" content="' + description + '">'
            '<style>body{font-family:system-ui,Arial,sans-serif;background:#f9f6f1;color:#183044;'
            'margin:0 auto;max-width:820px;padding:36px 18px;line-height:1.9}'
            'h1{font-size:clamp(26px,5vw,39px)}.stage{background:#f7e9d4;padding:9px 14px;'
            'border-radius:8px;color:#604421}.publisher{font-weight:bold;font-size:22px}'
            '.logo{max-width:230px;max-height:95px;object-fit:contain}'
            '.scan{width:100%;max-height:800px;object-fit:contain}'
            '.date,.tags{color:#667}a{color:#8b622d}</style></head><body>'
            '<aside class="stage">' + subtitle + '</aside><main>' + "".join(parts) +
            '</main></body></html>')


def load_fixture():
    for lang in ("ar", "en"):
        for path in sorted((FIXTURES / lang).glob("*.txt")):
            yield lang, path.read_text(encoding="utf-8"), path.name


def load_drive():
    """Read only approved Google Docs/text files inside two explicit folders."""
    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
    except ImportError as ex:
        raise RuntimeError("Live Drive requires google-auth and requests") from ex
    secret = os.environ.get("GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON", "")
    if not secret:
        raise RuntimeError("Missing GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON GitHub secret")
    cred = service_account.Credentials.from_service_account_info(
        json.loads(secret), scopes=["https://www.googleapis.com/auth/drive.readonly"])
    session = AuthorizedSession(cred)
    base = "https://www.googleapis.com/drive/v3/files"
    folders = {"ar": os.getenv("DRIVE_AR_INTERVIEWS_FOLDER", DEFAULT_AR_FOLDER),
               "en": os.getenv("DRIVE_EN_INTERVIEWS_FOLDER", DEFAULT_EN_FOLDER)}
    for lang, folder_id in folders.items():
        # Folder IDs are private configuration, not echoed in generated pages.
        token = None
        counter = 0
        while True:
            params = {"q": f"'{folder_id}' in parents and trashed = false",
                      "fields": "nextPageToken,files(id,name,mimeType)",
                      "pageSize": 100}
            if token:
                params["pageToken"] = token
            resp = session.get(base, params=params, timeout=25)
            resp.raise_for_status()
            payload = resp.json()
            for file in payload.get("files", []):
                typ = file.get("mimeType")
                if typ == "application/vnd.google-apps.document":
                    url = base + "/" + file["id"] + "/export"
                    result = session.get(url, params={"mimeType": "text/plain"}, timeout=25)
                elif typ == "text/plain":
                    url = base + "/" + file["id"]
                    result = session.get(url, params={"alt": "media"}, timeout=25)
                else:
                    continue  # Word, PDFs and images need separately approved import.
                result.raise_for_status()
                counter += 1
                if counter > 100:
                    raise RuntimeError("Safety limit: more than 100 documents in " + lang)
                yield lang, result.content.decode("utf-8-sig"), file["name"]
            token = payload.get("nextPageToken")
            if not token:
                break


def generate(documents, output):
    output = Path(output).resolve()
    # Staging output only; never write to the live dist/ tree.
    dist = (ROOT / "dist").resolve()
    if output == dist or dist in output.parents:
        raise ValueError("Refusing to write to published dist/")
    manifest, seen = [], set()
    for lang, raw, origin in documents:
        try:
            item = parse_document(raw, lang)
        except ValueError as ex:
            raise ValueError("Invalid item in " + lang + " / " + origin + ": " + str(ex)) from ex
        if item is None:
            continue
        key = (lang, item["id"])
        if key in seen:
            raise ValueError("Duplicate ID in same language: " + item["id"])
        seen.add(key)
        target = output / lang / (item["id"].lower() + ".html")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(render(item), encoding="utf-8")
        manifest.append({"id": item["id"], "lang": lang, "title": item["title"],
                         "file": target.relative_to(output).as_posix(),
                         "content_sha256": hashlib.sha256(raw.encode("utf-8")).hexdigest()})
    output.mkdir(parents=True, exist_ok=True)
    (output / "manifest.json").write_text(
        json.dumps({"staging_only": True, "count": len(manifest), "items": manifest},
                   ensure_ascii=False, indent=2), encoding="utf-8")
    print("Staging preview generated:", len(manifest), "approved item(s); no website changes")
    return manifest


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--mode", choices=("fixture", "drive"), default="fixture")
    p.add_argument("--out", default=str(ROOT / "staging" / "drive-preview"))
    args = p.parse_args()
    generate(load_fixture() if args.mode == "fixture" else load_drive(), args.out)


if __name__ == "__main__":
    main()
