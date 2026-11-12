#!/usr/bin/env python3
"""Safely synchronize *approved* Life After Sixty episode JSON from Drive to a review branch.

Drive layout (under an explicitly configured folder ID):
  01 - عنوان الحلقة/
    episode.json           (application/json, approval_status: APPROVED)
    المقال المعتمد         (native Google Doc, must match key JSON passages)
    backup.mp4             (video file; public fallback only if anyone/reader)

The central JSON manifest is updated locally; this script does NOT push or publish.
GitHub Actions commits changes to a REVIEW branch only, never directly to main.
No removals, no automatic sharing changes, and no uploads of original videos.
"""
from __future__ import annotations

import argparse
import json
import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "data" / "after-sixty.json"
FOLDER_MIME = "application/vnd.google-apps.folder"
DOC_MIME = "application/vnd.google-apps.document"
MAX_JSON_BYTES = 2 * 1024 * 1024
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ID_RE = re.compile(r"^after-sixty-[0-9]{2,3}$")
YT_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
EPISODE_DIR_RE = re.compile(r"^([0-9]{2,3})\s+-\s+.+$")
NEEDED = ("id", "number", "slug", "category_id", "title_ar", "title_en",
          "youtube_id", "duration_seconds", "reading_minutes",
          "excerpt_ar", "excerpt_en", "pull_quote", "intro", "chapters")


def canonical_text(text):
    return re.sub(r"\s+", " ", str(text or "").strip()).strip(" «»")


def validate_episode(episode, categories):
    if not isinstance(episode, dict):
        raise ValueError("Episode must be an object")
    if episode.get("approval_status") != "APPROVED":
        return False
    if episode.get("metadata_approved") is not True or episode.get("article_complete") is not True:
        raise ValueError("APPROVED episode must include approved metadata and full article")
    for key in NEEDED:
        if key not in episode:
            raise ValueError("Missing " + key)
    if not ID_RE.fullmatch(episode["id"]) or not SLUG_RE.fullmatch(episode["slug"]):
        raise ValueError("Invalid id or slug")
    if episode["category_id"] not in categories:
        raise ValueError("Invalid category")
    if int(episode["number"]) < 1 or int(episode["duration_seconds"]) < 1 or int(episode["reading_minutes"]) < 1:
        raise ValueError("Invalid duration, number, or reading time")
    if not YT_RE.fullmatch(episode["youtube_id"]):
        raise ValueError("Invalid YouTube ID")
    if not isinstance(episode["intro"], list) or not episode["intro"]:
        raise ValueError("Missing approved article paragraphs")
    if not isinstance(episode["chapters"], list) or not episode["chapters"]:
        raise ValueError("Missing approved chapters")
    for chapter in episode["chapters"]:
        if not isinstance(chapter, dict) or not all(k in chapter for k in ("id", "time_seconds", "title_ar", "paragraphs")):
            raise ValueError("Invalid chapter data")
        if not SLUG_RE.fullmatch(chapter["id"]) or not 0 <= int(chapter["time_seconds"]) <= int(episode["duration_seconds"]):
            raise ValueError("Invalid chapter timestamp")
        if not chapter["paragraphs"] or not isinstance(chapter["paragraphs"], list):
            raise ValueError("Empty chapter")
    return True


def validate_document(episode, document_text):
    """Guard against attaching an unrelated editorial document to a video."""
    source = canonical_text(document_text)
    probes = [episode["title_ar"], episode["intro"][0][:45]]
    probes += [chapter["title_ar"] for chapter in episode["chapters"]]
    missing = [p for p in probes if canonical_text(p) not in source]
    if missing:
        raise ValueError("Google Doc and episode.json disagree: " + repr(missing))
    return True


def list_children(drive, parent_id):
    files = []
    token = None
    while True:
        page = drive.files().list(
            q="'" + parent_id.replace("'", "\\'") + "' in parents and trashed = false",
            fields="nextPageToken,files(id,name,mimeType,size)",
            pageSize=1000, pageToken=token,
            supportsAllDrives=True, includeItemsFromAllDrives=True,
        ).execute()
        files.extend(page.get("files", []))
        token = page.get("nextPageToken")
        if not token:
            return files


def public_reader(drive, file_id):
    try:
        perms = drive.permissions().list(
            fileId=file_id, fields="permissions(type,role)",
            supportsAllDrives=True,
        ).execute().get("permissions", [])
    except Exception:
        return False
    return any(p.get("type") == "anyone" and p.get("role") in ("reader", "commenter", "writer") for p in perms)


def load_drive_client():
    from google.oauth2 import service_account
    from googleapiclient.discovery import build
    raw = os.getenv("GDRIVE_SERVICE_ACCOUNT_KEY", "")
    if not raw:
        raise RuntimeError("GDRIVE_SERVICE_ACCOUNT_KEY is not set")
    credentials = service_account.Credentials.from_service_account_info(
        json.loads(raw), scopes=["https://www.googleapis.com/auth/drive.readonly"]
    )
    return build("drive", "v3", credentials=credentials, cache_discovery=False)


def scan_drive(drive, folder_id, manifest):
    categories = {c["id"] for c in manifest["categories"]}
    episodes = {e["id"]: dict(e) for e in manifest["episodes"]}
    discovered = 0
    for folder in sorted(list_children(drive, folder_id), key=lambda i: i["name"]):
        folder_match = EPISODE_DIR_RE.fullmatch(folder["name"])
        if folder["mimeType"] != FOLDER_MIME or not folder_match:
            continue
        children = list_children(drive, folder["id"])
        data_files = [c for c in children if c["name"] == "episode.json"]
        if not data_files:
            continue
        if len(data_files) != 1:
            raise ValueError("Duplicate episode.json in " + folder["name"])
        meta = data_files[0]
        if int(meta.get("size") or 0) > MAX_JSON_BYTES:
            raise ValueError("Oversized JSON in " + folder["name"])
        raw = drive.files().get_media(fileId=meta["id"]).execute()
        if len(raw) > MAX_JSON_BYTES:
            raise ValueError("Oversized JSON in " + folder["name"])
        episode = json.loads(raw.decode("utf-8"))
        if not validate_episode(episode, categories):
            print("SKIP (not approved):", folder["name"])
            continue
        if int(folder_match.group(1)) != int(episode["number"]):
            raise ValueError("Folder number mismatch for " + episode["id"])
        docs = [c for c in children if c["mimeType"] == DOC_MIME]
        backup = [c for c in children if c["mimeType"].startswith("video/")]
        if len(docs) != 1 or len(backup) != 1:
            raise ValueError("APPROVED folder needs exactly one Google Doc and one backup video: " + folder["name"])
        doc_bytes = drive.files().export(fileId=docs[0]["id"], mimeType="text/plain").execute()
        validate_document(episode, doc_bytes.decode("utf-8-sig"))
        video = backup[0]
        # The mere presence of a Drive video is not permission to embed it publicly.
        verified = episode.get("fallback_same_video_approved") is True and public_reader(drive, video["id"])
        episode["drive_fallback_verified"] = bool(verified)
        episode["drive_video_file_id"] = video["id"] if verified else None
        episode.pop("approval_status", None)
        episode.pop("trailing_fragment", None)
        episode.pop("editorial_note_ar", None)
        episode.pop("editorial_note_en", None)
        episode["youtube_url"] = "https://www.youtube.com/watch?v=" + episode["youtube_id"]
        episode["thumbnail_url"] = "https://i.ytimg.com/vi/" + episode["youtube_id"] + "/hqdefault.jpg"
        episodes[episode["id"]] = episode
        discovered += 1
        print("APPROVED:", episode["id"], "| Drive fallback public:", verified)
    unique_slugs = [ep["slug"] for ep in episodes.values()]
    unique_numbers = [ep["number"] for ep in episodes.values()]
    if len(unique_slugs) != len(set(unique_slugs)) or len(unique_numbers) != len(set(unique_numbers)):
        raise ValueError("Duplicate episode slug or number")
    result = dict(manifest)
    result["episodes"] = sorted(episodes.values(), key=lambda e: int(e["number"]))
    return result, discovered


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--write", action="store_true", help="Update dist/data/after-sixty.json")
    args = parser.parse_args()
    root_id = os.getenv("AFTER_SIXTY_DRIVE_FOLDER_ID", "").strip()
    if not root_id:
        raise SystemExit("Set AFTER_SIXTY_DRIVE_FOLDER_ID to the confirmed editorial folder ID")
    manifest = json.loads(OUTPUT.read_text(encoding="utf-8"))
    updated, discovered = scan_drive(load_drive_client(), root_id, manifest)
    new_content = json.dumps(updated, ensure_ascii=False, indent=2) + "\n"
    old_content = OUTPUT.read_text(encoding="utf-8")
    print("Approved Drive episodes:", discovered, " | Total indexed:", len(updated["episodes"]))
    if new_content == old_content:
        print("No changes")
    elif args.write:
        # Fail closed: only explicitly approved files change the manifest.
        OUTPUT.write_text(new_content, encoding="utf-8")
        print("Updated preview manifest. GitHub Pages remains untouched until merge.")
    else:
        print("Changes available: use --write in an isolated review branch.")


if __name__ == "__main__":
    main()
