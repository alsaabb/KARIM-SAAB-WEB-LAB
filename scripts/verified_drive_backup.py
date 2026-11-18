#!/usr/bin/env python3
"""Safely retain one verified GitHub main archive in a dedicated Drive folder."""
import hashlib
import io
import json
import os
import re
import sys
import zipfile
from urllib.request import Request, urlopen

from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload

REPO = "alsaabb/KARIM-SAAB-WEB-LAB"
FOLDER = "1_QfWuAoHdnS0M4EqhZ3RX6xzICL_vF8t"
PREFIX = "KARIM_SAAB_GITHUB_MAIN_"
NAME_PATTERN = re.compile(r"^KARIM_SAAB_GITHUB_MAIN_\d{4}-\d{2}-\d{2}_[0-9a-f]{12}_ACTIONS_ARTIFACT\.zip$")
INNER_PATTERN = re.compile(r"^KARIM_SAAB_GITHUB_MAIN_\d{4}-\d{2}-\d{2}_[0-9a-f]{12}\.zip$")


def require(condition, message):
    if not condition:
        raise RuntimeError(message)


def github(path):
    req = Request("https://api.github.com/" + path, headers={
        "Authorization": "Bearer " + os.environ["GITHUB_TOKEN"],
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    with urlopen(req, timeout=120) as response:
        return response.read()


def check_archive(data, expected_sha):
    with zipfile.ZipFile(io.BytesIO(data)) as outer:
        require(outer.testzip() is None, "Outer ZIP corruption")
        entries = outer.namelist()
        require(len(entries) == len(set(entries)), "Duplicate outer ZIP entries")
        inner_names = [n for n in entries if INNER_PATTERN.fullmatch(n)]
        require(len(inner_names) == 1, "Expected exactly one source ZIP")
        require(all(n in entries for n in ("SOURCE_COMMIT_SHA.txt", "SOURCE_FILE_COUNT.txt", "SHA256SUMS.txt")), "Missing manifest")
        source_sha = outer.read("SOURCE_COMMIT_SHA.txt").decode().strip()
        require(source_sha == expected_sha, "Archive SHA does not match workflow head SHA")
        source_zip = outer.read(inner_names[0])
        digest = hashlib.sha256(source_zip).hexdigest()
        checksum = outer.read("SHA256SUMS.txt").decode().strip().split()
        require(len(checksum) == 2 and checksum[0] == digest and checksum[1] == inner_names[0], "SHA256 mismatch")
        expected_count = int(outer.read("SOURCE_FILE_COUNT.txt").decode().strip())
        with zipfile.ZipFile(io.BytesIO(source_zip)) as inner:
            require(inner.testzip() is None, "Inner ZIP corruption")
            paths = [n for n in inner.namelist() if not n.endswith("/")]
            require(len(paths) == expected_count, "Source file count mismatch")
            require(any(n.startswith("dist/") for n in paths), "Published dist directory missing")
            require("dist/index.html" in paths, "Published index missing")
    return len(source_zip), expected_count


def main():
    run_id = int(os.environ["ARCHIVE_RUN_ID"])
    meta = json.loads(github(f"repos/{REPO}/actions/runs/{run_id}"))
    require(meta["name"] == "Archive KARIM SAAB source and published site (no deploy)", "Unexpected workflow")
    require(meta["conclusion"] == "success" and meta["head_branch"] == "main", "Run not successful on main")
    sha = meta["head_sha"]
    current_main = json.loads(github(f"repos/{REPO}/commits/main"))["sha"]
    require(sha == current_main, "Archive run is not current main; skip older run")
    artifacts = json.loads(github(f"repos/{REPO}/actions/runs/{run_id}/artifacts?per_page=100"))["artifacts"]
    valid = [a for a in artifacts if a["name"].startswith(PREFIX) and not a["expired"]]
    require(len(valid) == 1 and valid[0]["name"].endswith(sha[:12]), "Expected exactly one matching artifact")
    artifact = valid[0]
    blob = github(f"repos/{REPO}/actions/artifacts/{artifact['id']}/zip")
    require(len(blob) == artifact["size_in_bytes"], "Downloaded size mismatch")
    if artifact.get("digest"):
        require(artifact["digest"] == "sha256:" + hashlib.sha256(blob).hexdigest(), "Artifact digest mismatch")
    inner_size, count = check_archive(blob, sha)
    print(f"Validated SHA {sha}, {count} tracked files, inner ZIP {inner_size} bytes")

    key = json.loads(os.environ["GDRIVE_SERVICE_ACCOUNT_KEY"])
    credentials = service_account.Credentials.from_service_account_info(
        key, scopes=["https://www.googleapis.com/auth/drive"])
    drive = build("drive", "v3", credentials=credentials, cache_discovery=False)
    folder = drive.files().get(fileId=FOLDER, fields="id,mimeType").execute()
    require(folder["mimeType"] == "application/vnd.google-apps.folder", "Invalid destination folder")

    filename = artifact["name"] + "_ACTIONS_ARTIFACT.zip"
    require(NAME_PATTERN.fullmatch(filename), "Unexpected archive filename")
    listing = drive.files().list(q=f"'{FOLDER}' in parents and trashed = false",
        fields="nextPageToken,files(id,name,mimeType,size,parents)", page_size=1000).execute()
    existing = listing["files"]
    while listing.get("nextPageToken"):
        listing = drive.files().list(q=f"'{FOLDER}' in parents and trashed = false",
            fields="nextPageToken,files(id,name,mimeType,size,parents)", page_size=1000,
            pageToken=listing["nextPageToken"]).execute()
        existing.extend(listing["files"])

    matches = [f for f in existing if f["name"] == filename and f.get("mimeType") == "application/zip"]
    if matches:
        require(len(matches) == 1 and int(matches[0].get("size", -1)) == len(blob),
            "Existing current backup has unexpected size or duplicates")
        new_id = matches[0]["id"]
        print("Current archive already exists; preserving verified file")
    else:
        media = MediaIoBaseUpload(io.BytesIO(blob), mimetype="application/zip", resumable=True)
        created = drive.files().create(body={"name": filename, "parents": [FOLDER]},
            media_body=media, fields="id,name,size,parents,mimeType").execute()
        new_id = created["id"]
    checked = drive.files().get(fileId=new_id, fields="id,name,size,parents,mimeType").execute()
    require(checked["name"] == filename and checked["parents"] == [FOLDER] and
        checked["mimeType"] == "application/zip" and int(checked["size"]) == len(blob),
        "Drive readback mismatch; no cleanup")
    # Verify actual stored bytes, not just metadata, before deleting older copies.
    downloaded = drive.files().get_media(fileId=new_id).execute()
    require(hashlib.sha256(downloaded).digest() == hashlib.sha256(blob).digest(),
        "Drive byte-level verification failed; no cleanup")
    print(f"Verified Drive file: {new_id}")

    # Only this exact repository archive naming scheme in this one folder is eligible.
    for old in existing:
        if old["id"] == new_id:
            continue
        if old.get("mimeType") != "application/zip":
            continue
        if not NAME_PATTERN.fullmatch(old["name"]):
            continue
        require(FOLDER in old.get("parents", []), "Unexpected old file parent")
        drive.files().delete(fileId=old["id"]).execute()
        print(f"Removed verified obsolete archive: {old['name']}")
    print(f"SUCCESS: one current verified archive, SHA {sha}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"::error::{exc}", file=sys.stderr)
        sys.exit(1)
