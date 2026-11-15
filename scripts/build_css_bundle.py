#!/usr/bin/env python3
"""Rebuild/check the published CSS bundle in the original document cascade order.

Keep Leaflet 1.9.4 separately self-hosted in dist/assets/vendor/leaflet/.
Usage:
    python3 -m pip install csscompressor==0.9.5
    python3 scripts/build_css_bundle.py --write
    python3 scripts/build_css_bundle.py --check
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from csscompressor import compress as compress_css
except ImportError:
    sys.exit("Install required CSS builder: python3 -m pip install csscompressor==0.9.5")

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
OUTPUT = DIST / "styles.bundle.min.css"

# Source order is from dist/index.html on release main before bundling, Nov 2026.
# Preserve order as it controls CSS specificity and page appearance.
CSS_SOURCES = (
    "styles.css",
    "enhancements.css",
    "ready-release.css",
    "master-update.css",
    "ks-ai-link-v10.css",
    "identity-2026.css",
    "hiking-gallery.css",
    "karim-products.css",
    "shared-shell-v2.css",
    "karim-health.css",
    "about-drive-layout-v2.css",
    "after-sixty-v1.css",
    "happiness-stories-v1.css",
    "bilingual-share-v1.css",
    "about-unified-shell-happiness-hub-v2.css",
    "wild-boar-story-v1.css",
)


def render() -> str:
    parts = []
    for name in CSS_SOURCES:
        path = DIST / name
        if not path.is_file():
            raise FileNotFoundError(f"Missing CSS source: {path}")
        parts.append(f"\n/* {path.name} */\n" + path.read_text(encoding="utf-8"))
    return compress_css("\n".join(parts))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true", help="Refresh the published bundle")
    group.add_argument("--check", action="store_true", help="Fail if the bundle is missing/stale")
    args = parser.parse_args()
    bundled = render()
    if args.write:
        OUTPUT.write_text(bundled, encoding="utf-8")
        print(f"CSS bundle updated: {len(CSS_SOURCES)} ordered sources, {OUTPUT.stat().st_size} bytes")
        return 0
    if not OUTPUT.is_file() or OUTPUT.read_text(encoding="utf-8") != bundled:
        print("FAIL: CSS bundle is missing or stale. Run python3 scripts/build_css_bundle.py --write")
        return 1
    print(f"PASS: CSS bundle matches {len(CSS_SOURCES)} ordered source files")
    return 0


if __name__ == "__main__":
    sys.exit(main())
