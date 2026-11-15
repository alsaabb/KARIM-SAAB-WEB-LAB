#!/usr/bin/env python3
"""Owner-requested ONE-TIME QA remediation; only run on the dedicated review branch.

This script intentionally preserves originals under docs/qa-source-assets/ rather
than destroying them. No release branch or Google Drive objects are modified.
"""
from __future__ import annotations

import os
import re
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageOps
from csscompressor import compress as compress_css

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ASSETS = DIST / "assets"
ARCHIVE = ROOT / "docs" / "qa-source-assets"
BRANCH = "fix/qa-security-seo-perf-2026-11-15"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
TARGET = 250 * 1024
HERO_TARGET = 145 * 1024
EXPLICIT = {
    "about-approved.png", "adventures-approved.jpg",
    "australia-original.png", "japan-tile-approved.png",
    "hero-ar-approved.png", "hero-en-approved.png",
    "ks-approved-original.png",
}
TEXT_EXTS = {".js", ".html", ".json", ".css", ".xml", ".txt", ".csv"}

def on_review_branch():
    name = subprocess.check_output(["git", "branch", "--show-current"], cwd=ROOT, text=True).strip()
    if name != BRANCH or os.environ.get("GITHUB_REF_NAME") not in (None, "", BRANCH):
        raise RuntimeError(f"Refusing edits on branch {name!r}, expected {BRANCH!r}")

def make_webp(path: Path, target: int) -> tuple[Path, tuple[int, int]]:
    out = path.with_suffix(".webp")
    with Image.open(path) as image:
        image = ImageOps.exif_transpose(image)
        image.load()
        if image.mode not in ("RGB", "RGBA"):
            image = image.convert("RGBA" if "A" in image.getbands() or image.info.get("transparency") is not None else "RGB")
        if image.mode == "RGBA":
            # Preserve transparent design assets and visual composition.
            pass
        for factor in [1.0, .92, .84, .76, .68, .60, .52, .45]:
            size = (max(1, int(image.width * factor)), max(1, int(image.height * factor)))
            scaled = image if factor == 1.0 else image.resize(size, Image.Resampling.LANCZOS)
            for quality in [86, 80, 74, 68, 62, 55, 48, 40, 34]:
                scaled.save(out, format="WEBP", quality=quality, method=6)
                if out.stat().st_size <= target:
                    return out, size
    raise RuntimeError(f"Unable to optimize within limit: {path.relative_to(ROOT)}")

def optimize_images():
    replacements = {}
    dimensions = {}
    for path in sorted(ASSETS.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        if path.stat().st_size <= TARGET and path.name not in EXPLICIT:
            continue
        old_size = path.stat().st_size
        new, size = make_webp(path, HERO_TARGET if path.name in ("hero-ar-approved.png","hero-en-approved.png") else TARGET)
        replacements[path.name] = new.name
        dimensions[new.name] = size
        archived = ARCHIVE / path.relative_to(ASSETS)
        archived.parent.mkdir(parents=True, exist_ok=True)
        if archived.exists():
            raise RuntimeError(f"Archive target already exists; will not overwrite: {archived}")
        shutil.move(str(path), str(archived))
        print(f"ASSET {path.relative_to(DIST)}: {old_size//1024} KiB => {new.stat().st_size//1024} KiB ({new.name})")
    return replacements, dimensions

EDIT_DOC = re.compile(r"https?://docs\.google\.com/(?:document|spreadsheets|presentation)/d/[A-Za-z0-9_-]+/edit(?:\?[^\"'\s<>]*)?", re.I)
IFRAME = re.compile(r"<iframe\b[^>]*>", re.I)
LINK = re.compile(r"<a\b[^>]*>", re.I)
IMG = re.compile(r"<img\b[^>]*>", re.I)
SANDBOX = "allow-scripts allow-same-origin allow-presentation allow-popups"

def scrub_document_links(text: str, path: Path) -> str:
    # A locally archived public PDF already exists for this book. Do not expose
    # the editable Drive source URL or claim undocumented public permissions.
    if path.name == "content.js":
        text = EDIT_DOC.sub("assets/books/prophet-english.pdf", text)
    else:
        # Unverified Google Docs URLs must not be published in client assets.
        # The previously recorded provenance is recoverable from Git history.
        text = EDIT_DOC.sub("", text)
    text = re.sub(r"([?&])usp=drivesdk(?=[\"'\s<>]|$)", "", text, flags=re.I)
    return text

def secure_embeds(text: str) -> str:
    def iframe_tag(match):
        tag = match.group(0)
        if "sandbox=" not in tag.lower():
            tag = tag[:-1] + ' sandbox="' + SANDBOX + '">'
        return tag
    text = IFRAME.sub(iframe_tag, text)
    # Tighten preexisting noopener-only links, without changing destinations.
    text = re.sub(r'rel="noopener"', 'rel="noopener noreferrer"', text, flags=re.I)
    text = re.sub(r"rel='noopener'", "rel='noopener noreferrer'", text, flags=re.I)
    def safe_anchor(match):
        tag = match.group(0)
        if re.search(r'target=["\x27]_blank["\x27]',tag,re.I) and not re.search(r'\brel=',tag,re.I):
            return tag[:-1] + ' rel="noopener noreferrer">'
        return tag
    return LINK.sub(safe_anchor, text)

def img_fallback_dimensions(text: str, dimensions: dict[str, tuple[int, int]]) -> str:
    def transform(m):
        tag = m.group(0)
        src = re.search(r'\bsrc="(?:[^"]*/)?([^"/]+)"', tag, re.I)
        if src and src.group(1) in dimensions:
            width, height = dimensions[src.group(1)]
            if not re.search(r'\bwidth=', tag):
                tag = tag[:-1] + f' width="{width}">'
            if not re.search(r'\bheight=', tag):
                tag = tag[:-1] + f' height="{height}">'
        if not re.search(r'\bdecoding=', tag):
            tag = tag[:-1] + ' decoding="async">'
        if "hero-approved-image" not in tag and "fetchpriority=" not in tag.lower() and not re.search(r'\bloading=', tag):
            tag = tag[:-1] + ' loading="lazy">'
        return tag
    return IMG.sub(transform, text)

def edit_dist_text(replacements: dict, dimensions: dict):
    changed = []
    for path in sorted(DIST.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in TEXT_EXTS:
            continue
        original = path.read_text(encoding="utf-8")
        text = original
        for old, new in replacements.items():
            text = text.replace(old, new)
        text = scrub_document_links(text, path)
        if path.suffix.lower() in {".html", ".js"}:
            text = secure_embeds(text)
            text = img_fallback_dimensions(text, dimensions)
        if path.name == "happiness-stories-v1.js":
            # This existing Lite/Façade player creates the iframe only on click.
            text = text.replace("var iframe=document.createElement('iframe');",
                                "var iframe=document.createElement('iframe');\n"
                                "        iframe.setAttribute('sandbox', '" + SANDBOX + "');")
        if text != original:
            path.write_text(text, encoding="utf-8")
            changed.append(path.relative_to(ROOT).as_posix())
    return changed

def bundle_and_harden_index():
    path = DIST / "index.html"
    html = path.read_text(encoding="utf-8")
    local = []
    # Preserve the exact original cascade and avoid breaking RTL/responsive layers.
    regex = re.compile(r'<link\s+rel="stylesheet"\s+href="([^"]+\.css(?:\?[^"]*)?)"\s*/?>', re.I)
    for m in regex.finditer(html):
        href = m.group(1)
        if not href.startswith("http"):
            sheet = DIST / href.split("?",1)[0]
            if not sheet.is_file():
                raise RuntimeError(f"Missing referenced stylesheet: {href}")
            local.append((m.group(0),sheet))
    if not local:
        raise RuntimeError("No local stylesheets found for CSS bundling")
    combined = "\n".join(f"\n/* {p.name} */\n"+p.read_text(encoding="utf-8") for _,p in local)
    bundle = DIST / "styles.bundle.min.css"
    bundle.write_text(compress_css(combined),encoding="utf-8")
    first = True
    for tag, _ in local:
        html = html.replace(tag,'<link rel="stylesheet" href="styles.bundle.min.css">' if first else "",1)
        first = False

    # Leaflet 1.9.4 hashes come from the library's official release instructions.
    html = html.replace(
        '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">',
        '<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzxN1JkQ0T7KcY2L+1wGQwX7YAA=" crossorigin="anonymous">')
    html = html.replace(
        '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" defer></script>',
        '<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous" defer></script>')

    if 'http-equiv="Content-Security-Policy"' not in html:
        csp = ("default-src 'self'; script-src 'self' https://unpkg.com; "
            "style-src 'self' 'unsafe-inline' https://unpkg.com; "
            "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com "
            "https://*.tile.openstreetmap.org https://*.basemaps.cartocdn.com https://drive.google.com; "
            "font-src 'self' data:; connect-src 'self'; "
            "frame-src https://www.youtube-nocookie.com https://www.youtube.com https://drive.google.com; "
            "object-src 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests")
        html = html.replace("<meta charset=\"utf-8\">",'<meta charset="utf-8">\n'
          '<meta http-equiv="Content-Security-Policy" content="'+csp+'">',1)
    if 'rel="preload" as="image"' not in html:
        html = html.replace("</head>",'<link rel="preload" as="image" href="assets/hero-ar-approved.webp" fetchpriority="high">\n</head>',1)
    if 'property="og:title"' not in html:
        tags = "\n".join([
            '<meta property="og:type" content="website">',
            '<meta property="og:title" content="KARIM SAAB | عبدالكريم الصعب">',
            '<meta property="og:description" content="رحلات ومغامرات ومحتوى وثائقي وكتب ومشاريع عبدالكريم الصعب | Journeys, documentary stories, books and projects.">',
            '<meta property="og:url" content="'+BASE+'index.html">',
            '<meta property="og:image" content="'+BASE+'assets/hero-ar-approved.webp">',
            '<meta name="twitter:card" content="summary_large_image">',
            '<meta name="twitter:title" content="KARIM SAAB | عبدالكريم الصعب">',
            '<meta name="twitter:description" content="Journeys, stories, books, and projects.">',
            '<meta name="twitter:image" content="'+BASE+'assets/hero-ar-approved.webp">'
        ])
        html = html.replace("</head>",tags+"\n</head>",1)
    path.write_text(html, encoding="utf-8")
    print(f"CSS BUNDLE: {len(local)} files to {bundle.stat().st_size//1024} KiB")

def main():
    on_review_branch()
    replacements,dimensions = optimize_images()
    changed = edit_dist_text(replacements, dimensions)
    bundle_and_harden_index()
    # This index is generated; modifying only its sources would stale the checks.
    subprocess.run(["python3","scripts/build_site_master_registry.py","--write"], cwd=ROOT, check=True)
    print(f"Updated {len(changed)} published text sources (including share metadata).")
    print("No old media destroyed: originals moved to docs/qa-source-assets/.")

if __name__ == "__main__":
    main()
