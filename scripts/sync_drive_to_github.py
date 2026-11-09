#!/usr/bin/env python3
"""Publish only explicitly APPROVED Google Drive files under dist/.

Share the configured Drive folder with the service account (Viewer access).
To approve a stored HTML/CSS/JS/image file, set its Drive description to:
    status: APPROVED
    github_path: dist/<path/to/file>

For a native Google Doc, put this at the top of its content:
    status: APPROVED
    lang: ar
    title: Article title
    ---BODY---
    The approved article text...

Approved Docs are rendered as escaped, standalone HTML pages under
dist/drive-content/. All other documents and unapproved files are ignored.
No Drive files are deleted, and no GitHub files are deleted.
"""
from __future__ import annotations

import hashlib
import html
import io
import json
import logging
import os
import re
from collections import deque
from pathlib import Path, PurePosixPath

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

ROOT = Path(__file__).resolve().parents[1]
DIST = (ROOT / "dist").resolve()
DOC_MIME = "application/vnd.google-apps.document"
FOLDER_MIME = "application/vnd.google-apps.folder"
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
MAX_FILES = 2500
MAX_BYTES = 12 * 1024 * 1024
ALLOWED_EXTENSIONS = {
    ".html", ".css", ".js", ".json", ".txt", ".xml", ".svg",
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".pdf",
}
META_RE = re.compile(
    r"(?im)^\s*(status|approval_status|github_path|repo_path|target_path|lang|title)"
    r"\s*:\s*(.*?)\s*$"
)
BODY_RE = re.compile(r"(?m)^---BODY---\s*$")
LOG = logging.getLogger("drive-sync")


def parse_metadata(text: str) -> dict[str, str]:
    return {key.lower(): value.strip() for key, value in META_RE.findall(text)}


def file_metadata(item: dict) -> dict[str, str]:
    result = parse_metadata(item.get("description") or "")
    for field in ("properties", "appProperties"):
        for key, value in (item.get(field) or {}).items():
            result[str(key).lower()] = str(value).strip()
    return result


def approved(*sources: dict[str, str]) -> bool:
    states = [
        source[key].upper() for source in sources
        for key in ("status", "approval_status") if source.get(key)
    ]
    return bool(states) and all(state == "APPROVED" for state in states)


def safe_target(name: str) -> Path:
    if not name or "\\" in name:
        raise ValueError("Missing or invalid github_path")
    path = PurePosixPath(name)
    if path.is_absolute() or ".." in path.parts or "." in path.parts:
        raise ValueError("Unsafe github_path")
    if len(path.parts) < 2 or path.parts[0] != "dist":
        raise ValueError("Only dist/ files may be changed")
    if path.suffix.lower() not in ALLOWED_EXTENSIONS:
        raise ValueError("Unsupported extension for approved site file")
    dest = ROOT.joinpath(*path.parts)
    if not dest.resolve().is_relative_to(DIST):
        raise ValueError("Target escapes published dist/")
    return dest


def save_file(name: str, content: bytes) -> bool:
    if len(content) > MAX_BYTES:
        raise ValueError("File exceeds the 12 MB safety limit")
    path = safe_target(name)
    if path.exists() and path.read_bytes() == content:
        LOG.info("UNCHANGED %s", name)
        return False
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    LOG.info("UPDATED %s (%s bytes)", name, len(content))
    return True


def iter_tree(service, folder_id: str):
    """Walk all children, including paginated subfolders."""
    folders = deque([folder_id])
    visited = set()
    seen_files = 0
    while folders:
        parent = folders.popleft()
        if parent in visited:
            continue
        visited.add(parent)
        token = None
        while True:
            page = service.files().list(
                q=f"'{parent}' in parents and trashed = false",
                fields=("nextPageToken,files(id,name,mimeType,description,"
                        "properties,appProperties,size,modifiedTime)"),
                pageSize=1000,
                pageToken=token,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
            ).execute()
            for item in page.get("files", []):
                if item.get("mimeType") == FOLDER_MIME:
                    folders.append(item["id"])
                    continue
                seen_files += 1
                if seen_files > MAX_FILES:
                    raise RuntimeError("Folder has too many files; review the sync scope")
                yield item
            token = page.get("nextPageToken")
            if not token:
                break


def download_bytes(service, item: dict) -> bytes:
    size = int(item.get("size") or 0)
    if size > MAX_BYTES:
        raise ValueError("Approved file exceeds 12 MB")
    stream = io.BytesIO()
    request = service.files().get_media(fileId=item["id"], supportsAllDrives=True)
    downloader = MediaIoBaseDownload(stream, request, chunksize=512 * 1024)
    finished = False
    while not finished:
        _, finished = downloader.next_chunk()
        if stream.tell() > MAX_BYTES:
            raise ValueError("Approved file exceeds 12 MB")
    return stream.getvalue()


def export_doc(service, item: dict) -> str:
    data = service.files().export(
        fileId=item["id"], mimeType="text/plain"
    ).execute()
    if len(data) > MAX_BYTES:
        raise ValueError("Approved document exceeds 12 MB")
    return data.decode("utf-8-sig")


def doc_parts(text: str):
    match = BODY_RE.search(text)
    if not match or match.start() > 3000:
        return {}, None
    return parse_metadata(text[:match.start()]), text[match.end():].strip()


def doc_target(item: dict, meta: dict, head: dict) -> str:
    explicit = next(
        (source[key] for source in (meta, head)
         for key in ("github_path", "repo_path", "target_path")
         if source.get(key)), ""
    )
    if explicit:
        if not explicit.startswith("dist/drive-content/") or not explicit.endswith(".html"):
            raise ValueError("Google Docs may only create dist/drive-content/*.html")
        return explicit
    digest = hashlib.sha256(item["id"].encode()).hexdigest()[:12]
    return f"dist/drive-content/article-{digest}.html"


def render_doc(title: str, content: str, lang: str) -> bytes:
    if lang not in ("ar", "en"):
        raise ValueError("Document lang must be ar or en")
    direction = "rtl" if lang == "ar" else "ltr"
    paragraphs = [
        "<p>" + html.escape(part, quote=True).replace("\n", "<br>") + "</p>"
        for part in re.split(r"\n\s*\n", content) if part.strip()
    ]
    if not paragraphs:
        raise ValueError("Approved article has no body")
    name = html.escape(title[:180], quote=True)
    markup = (
        '<!doctype html>\n<html lang="' + lang + '" dir="' + direction + '">\n'
        '<head><meta charset="utf-8"><meta name="viewport" '
        'content="width=device-width,initial-scale=1"><title>' + name +
        ' | KARIM SAAB</title><style>'
        'body{background:#141414;color:#f7f5ef;font:1.1rem/1.9 system-ui,Arial;'
        'max-width:850px;margin:2rem auto;padding:1rem}'
        'a{color:#D4AF37}h1{color:#D4AF37}</style></head><body>'
        '<nav><a href="../index.html">KARIM SAAB — Articles</a></nav>'
        '<main><h1>' + name + '</h1>' + "".join(paragraphs) +
        '</main></body></html>\n'
    )
    return markup.encode("utf-8")


def render_article_index(items: list[tuple[str, str, str]]) -> bytes:
    entries = []
    for title, target, lang in sorted(items, key=lambda x: (x[2], x[0])):
        name = html.escape(title, quote=True)
        href = html.escape(PurePosixPath(target).name, quote=True)
        entries.append('<li><a href="' + href + '">' + name + '</a> '
                       '<small>(' + lang + ')</small></li>')
    page = (
        '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<title>المقالات المعتمدة | KARIM SAAB</title><style>'
        'body{background:#141414;color:#f7f5ef;font:1.1rem/1.9 system-ui,Arial;'
        'max-width:850px;margin:2rem auto;padding:1rem}'
        'a{color:#D4AF37}h1{color:#D4AF37}</style></head><body>'
        '<nav><a href="../index.html">KARIM SAAB</a></nav>'
        '<h1>المقالات المعتمدة | Approved Articles</h1><ul>' +
        "".join(entries) + '</ul></body></html>\n'
    )
    return page.encode("utf-8")


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    secret = os.environ.get("GDRIVE_SERVICE_ACCOUNT_KEY", "").strip()
    folder_id = os.environ.get("GDRIVE_FOLDER_ID", "").strip()
    if not secret or not folder_id:
        raise RuntimeError("Set GDRIVE_SERVICE_ACCOUNT_KEY and GDRIVE_FOLDER_ID secrets")
    if not re.fullmatch(r"[A-Za-z0-9_-]{10,}", folder_id):
        raise ValueError("Invalid GDRIVE_FOLDER_ID")
    try:
        credentials = service_account.Credentials.from_service_account_info(
            json.loads(secret), scopes=SCOPES
        )
    except (ValueError, KeyError, TypeError) as exc:
        raise RuntimeError("Invalid service account JSON secret") from exc
    service = build("drive", "v3", credentials=credentials, cache_discovery=False)
    folder = service.files().get(
        fileId=folder_id, fields="id,mimeType", supportsAllDrives=True
    ).execute()
    if folder.get("mimeType") != FOLDER_MIME:
        raise RuntimeError("Configured Drive ID is not a folder")

    scanned, approved_count, changed = 0, 0, 0
    articles: list[tuple[str, str, str]] = []
    used_targets = set()
    for item in iter_tree(service, folder_id):
        scanned += 1
        ref = hashlib.sha256(item["id"].encode()).hexdigest()[:10]
        typ = item.get("mimeType", "")
        meta = file_metadata(item)
        LOG.info("SCANNED file=%s mime=%s", ref, typ)
        if typ == DOC_MIME:
            # Inspect a Doc's explicit approval header. Other Google-native formats
            # are never copied automatically.
            raw = export_doc(service, item)
            head, body = doc_parts(raw)
            if not approved(meta, head) or body is None:
                continue
            title = head.get("title") or meta.get("title") or item["name"]
            lang = head.get("lang") or meta.get("lang") or "ar"
            target = doc_target(item, meta, head)
            content = render_doc(title, body, lang)
            articles.append((title, target, lang))
        else:
            if not approved(meta):
                continue
            if typ.startswith("application/vnd.google-apps."):
                LOG.warning("SKIP approved native unsupported type %s", typ)
                continue
            target = next(
                (meta[k] for k in ("github_path", "repo_path", "target_path")
                 if meta.get(k)), ""
            )
            if not target:
                LOG.warning("SKIP approved file=%s: missing github_path", ref)
                continue
            content = download_bytes(service, item)

        # Detect conflicting approved files before performing a write.
        if target in used_targets:
            raise RuntimeError("Duplicate approved target: " + target)
        used_targets.add(target)
        approved_count += 1
        if save_file(target, content):
            changed += 1

    if articles:
        index_path = "dist/drive-content/index.html"
        if index_path in used_targets:
            raise RuntimeError("Approved source conflicts with article index")
        if save_file(index_path, render_article_index(articles)):
            changed += 1
    LOG.info("FINISHED scanned=%d approved=%d changed=%d",
             scanned, approved_count, changed)


if __name__ == "__main__":
    main()
