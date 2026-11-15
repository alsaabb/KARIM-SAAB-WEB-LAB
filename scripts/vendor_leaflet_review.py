#!/usr/bin/env python3
"""One-time, branch-scoped, verified installation of Leaflet 1.9.4 assets.

Sources: official Leaflet 1.9 installation page and npm package CDN.
Never edits main or any repository other than this checkout.
"""
from __future__ import annotations

import base64
import hashlib
import re
import subprocess
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
DEST = DIST / "assets/vendor/leaflet"
EXPECTED_BRANCH = "fix/qa-security-seo-perf-2026-11-15"
PACKAGE_BASE = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/"
SRI = {
    "leaflet.css": "p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
    "leaflet.js": "20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=",
}
ASSETS = (
    "dist/leaflet.css", "dist/leaflet.js",
    "dist/images/marker-icon.png", "dist/images/marker-icon-2x.png",
    "dist/images/marker-shadow.png", "dist/images/layers.png",
    "dist/images/layers-2x.png", "LICENSE",
)


def download(relative: str) -> bytes:
    url = PACKAGE_BASE + relative
    req = urllib.request.Request(url, headers={"User-Agent": "KARIM-SAAB-QA-Leaflet-Vendor/1.0"})
    with urllib.request.urlopen(req, timeout=25) as response:
        if response.geturl().split("?")[0] != url:
            # Refuse a redirect to a different package or version.
            raise RuntimeError(f"Unexpected redirect: {relative}")
        data = response.read()
    if not data:
        raise RuntimeError(f"Empty upstream file: {relative}")
    basename = relative.split("/")[-1]
    if basename in SRI:
        actual = base64.b64encode(hashlib.sha256(data).digest()).decode("ascii")
        if actual != SRI[basename]:
            raise RuntimeError(f"Official SHA-256 mismatch: {relative}; got sha256-{actual}")
        print(f"Verified {relative} sha256-{actual}")
    return data


def main() -> None:
    branch = subprocess.check_output(["git", "branch", "--show-current"], cwd=ROOT, text=True).strip()
    if branch != EXPECTED_BRANCH:
        raise SystemExit(f"Refusing to modify non-review branch {branch}")
    DEST.mkdir(parents=True, exist_ok=True)
    for remote in ASSETS:
        relative = remote.removeprefix("dist/")
        target = DEST / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        data = download(remote)
        target.write_bytes(data)
        print(f"Vendored {target.relative_to(ROOT)}: {len(data)} bytes")
    index = DIST / "index.html"
    source = index.read_text(encoding="utf-8")
    # Avoid silently re-vendoring an unexpected Leaflet version.
    css_old = re.compile(r'<link rel="stylesheet" href="https://unpkg.com/leaflet@1\.9\.4/dist/leaflet\.css"[^>]*>')
    js_old = re.compile(r'<script src="https://unpkg.com/leaflet@1\.9\.4/dist/leaflet\.js"[^>]*></script>')
    css_new = '<link rel="stylesheet" href="assets/vendor/leaflet/leaflet.css">'
    js_new = '<script src="assets/vendor/leaflet/leaflet.js" defer></script>'
    if css_old.search(source):
        source = css_old.sub(css_new, source)
    elif css_new not in source:
        raise RuntimeError("Expected Leaflet 1.9.4 stylesheet tag not found")
    if js_old.search(source):
        source = js_old.sub(js_new, source)
    elif js_new not in source:
        raise RuntimeError("Expected Leaflet 1.9.4 script tag not found")
    source = source.replace("script-src 'self' https://unpkg.com;", "script-src 'self';")
    source = source.replace("style-src 'self' 'unsafe-inline' https://unpkg.com;", "style-src 'self' 'unsafe-inline';")
    source = source.replace("https://drive.google.com; font-src", "https://drive.google.com https://*.googleusercontent.com; font-src")
    if "https://*.googleusercontent.com;" not in source:
        raise RuntimeError("Missing new permitted Drive thumbnail image origin")
    index.write_text(source, encoding="utf-8")

    print("Leaflet 1.9.4 vendored with official checksums, icons and license; CSP updated.")


if __name__ == "__main__":
    main()
