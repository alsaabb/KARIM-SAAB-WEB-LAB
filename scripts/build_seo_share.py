#!/usr/bin/env python3
"""SEO-GSC-001: generate truthful, crawlable static share HTML from approved sources.

Does not modify the SPA's hash navigation. Does not fabricate missing prose.
Run: python3 scripts/build_seo_share.py --write
     python3 scripts/build_seo_share.py --check
The --check mode is read-only and detects generated-source drift.
"""
from __future__ import annotations

import argparse
from collections import Counter
from datetime import date
from html import escape, unescape
from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
SHARE = DIST / "share"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
SCHEMA = "http://www.sitemaps.org/schemas/sitemap/0.9"
ET.register_namespace("", SCHEMA)
TODAY = "2026-11-17"
OWNER = {"ar": "عبدالكريم بن إبراهيم الصعب", "en": "KARIM SAAB"}
PLACEHOLDERS = ("المحتوى قيد المراجعة", "Content under review")
REDIRECT_SCRIPT = re.compile(
    r"<script\b(?![^>]*type\s*=\s*['\"]application/ld\+json)[^>]*>"
    r"(?:(?!</script>).)*?window\.location\.(?:replace|assign)\s*\("
    r"(?:(?!</script>).)*?</script>",
    re.I | re.S,
)
META_REFRESH = re.compile(r"<meta\b[^>]*http-equiv\s*=\s*['\"]refresh['\"][^>]*>", re.I)
LD_JSON = re.compile(r"<script\b[^>]*type\s*=\s*['\"]application/ld\+json['\"][^>]*>.*?</script>", re.I | re.S)
CANONICAL_ALTERNATES = re.compile(r"<link\b[^>]*(?:rel\s*=\s*['\"](?:canonical|alternate)['\"])[^>]*>", re.I)
TITLE = re.compile(r"<title>.*?</title>", re.I | re.S)
DESCRIPTION = re.compile(r"<meta\b[^>]*name\s*=\s*['\"]description['\"][^>]*>", re.I)
OG_URL = re.compile(r"<meta\b[^>]*property\s*=\s*['\"]og:url['\"][^>]*>", re.I)
ROBOTS = re.compile(r"<meta\b[^>]*name\s*=\s*['\"]robots['\"][^>]*>", re.I)
CONTENT_VALUE = re.compile(r"content\s*=\s*['\"]([^'\"]*)['\"]", re.I)


def load_json(path: str):
    return json.loads((DIST / path).read_text(encoding="utf-8"))


def get_meta(source: str, pattern: re.Pattern) -> str:
    match = pattern.search(source.split("</head>", 1)[0])
    if not match:
        return ""
    value = CONTENT_VALUE.search(match.group())
    return unescape(value.group(1)) if value else ""


def visible_text(source: str) -> str:
    body = source.split("</head>", 1)[-1].split("</body>", 1)[0]
    body = re.sub(r"<(?:style|script)\b[^>]*>.*?</(?:style|script)>", "", body, flags=re.I | re.S)
    body = re.sub(r"<[^>]+>", " ", body)
    return " ".join(unescape(body).split())


def paragraphs(strings) -> str:
    return "".join("<p>" + escape(value) + "</p>" for value in strings if isinstance(value, str) and value.strip())


def approved_markdown_html(source: str) -> str:
    """Render the owner-approved Markdown without changing the stored original."""
    result = []
    for line in source.splitlines():
        if not line.strip():
            continue
        tag = "p"
        if line.startswith("### "):
            tag, line = "h2", line[4:]
        elif line.startswith("# "):
            tag, line = "h1", line[2:]
        elif line.startswith("> "):
            tag, line = "blockquote", line[2:]
        safe = escape(line)
        safe = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", safe)
        result.append("<" + tag + ">" + safe + "</" + tag + ">")
    return "\n".join(result)


def original_sections(path: Path, lang: str, data: dict) -> tuple[str, str, str | None]:
    """Return approved, longer form body content, article kind, and video ID."""
    name = path.stem
    article = ""
    kind = ""
    video_id = None
    if name == "destination-mount-athos-greece":
        source = data["athos"]["langs"][lang]["full_text"]
        article = '<div class="ks-seo-full-article" style="white-space:pre-wrap">' + escape(source) + '</div>'
        kind = "Article"
    if name == "story-wild-boar-greece":
        src = data["story"]
        sections = src["langs"][lang]["sections"]
        article = "".join(
            ("<h2>" if item.get("type") == "heading" else "<p>")
            + escape(item.get("text", ""))
            + ("</h2>" if item.get("type") == "heading" else "</p>")
            for item in sections if item.get("text")
        )
        kind = "BlogPosting"
        video_id = src.get("youtube_id")
    if name.startswith("happiness-"):
        suffix = name[len("happiness-"):]
        mode = "article" if suffix.endswith("-article") else "video" if suffix.endswith("-video") else ""
        slug = suffix[:-(len(mode) + 1)] if mode else suffix
        entry = data["happiness"].get(slug)
        if entry:
            video_id = entry.get("youtube_id")
            if mode == "article":
                article = "".join(
                    "<h2>" + escape(sec.get("heading_" + lang, "")) + "</h2>"
                    + paragraphs(sec.get("paragraphs_" + lang, []))
                    for sec in entry.get("sections", [])
                )
                kind = "BlogPosting"
    episode = data["after"]
    ep_slug = "after-sixty-" + episode["slug"]
    if name in (ep_slug, ep_slug + "-article", ep_slug + "-video"):
        video_id = episode.get("youtube_id")
        if name.endswith("-article"):
            introduction = episode.get("intro" if lang == "ar" else "intro_en", [])
            article = paragraphs(introduction)
            for chapter in episode.get("chapters", []):
                article += "<h2>" + escape(chapter.get("title_" + lang, "")) + "</h2>"
                article += paragraphs(chapter.get("paragraphs" if lang == "ar" else "paragraphs_en", []))
            ending = episode.get("conclusion", {})
            article += "<h2>" + escape(ending.get("title_" + lang, "")) + "</h2>"
            article += paragraphs(ending.get("paragraphs" if lang == "ar" else "paragraphs_en", []))
            kind = "BlogPosting"
    if name == "story-arctic-survival-norway":
        article = approved_markdown_html(data["arctic"]["article_" + lang])
        kind = "BlogPosting"
        video_id = data["arctic"]["youtube_id"]
    if name == "story-reindeer-close-call-norway":
        article = approved_markdown_html(data["reindeer"]["article_" + lang])
        kind = "BlogPosting"
        video_id = data["reindeer"]["youtube_id"]
    if name == "about-health-from-150kg-to-cycling-europe":
        article = approved_markdown_html(data["health_sleeve"]["article_" + lang])
        kind = "BlogPosting"
        video_id = data["health_sleeve"]["youtube_id"]
    return article, kind, video_id


def append_inside_page(source: str, fragment: str) -> str:
    if not fragment or 'id="ks-seo-source-content"' in source:
        return source
    if "</main>" in source:
        return source.replace("</main>", fragment + "</main>", 1)
    return source.replace("</body>", fragment + "</body>", 1)


def enrich_home(path: Path, lang: str, source: str) -> str:
    if path.stem != "home":
        return source
    heading = "استكشف أقسام الموقع" if lang == "ar" else "Explore the site"
    nodes = ["about", "journeys", "books", "content-cycling"]
    lines = []
    for stem in nodes:
        other = SHARE / lang / (stem + ".html")
        if not other.is_file():
            continue
        text = other.read_text(encoding="utf-8")
        title = unescape((TITLE.search(text).group() if TITLE.search(text) else stem))
        title = re.sub(r"</?title>", "", title, flags=re.I).split("|")[0].strip()
        excerpt = get_meta(text, DESCRIPTION)
        href = BASE + "share/" + lang + "/" + stem + ".html"
        lines.append("<li><a href=\"" + escape(href, quote=True) + "\">" + escape(title) +
                     "</a> — " + escape(excerpt) + "</li>")
    fragment = '<section id="ks-seo-source-content"><h2>' + heading + '</h2><ul>' + "".join(lines) + "</ul></section>"
    return append_inside_page(source, fragment)


def make_share(path: Path, raw: str, data: dict, title_counts: Counter,
               description_counts: Counter):
    lang = path.parent.name
    assert lang in ("ar", "en")
    url = BASE + path.relative_to(DIST).as_posix()
    paired_ar = BASE + "share/ar/" + path.name
    paired_en = BASE + "share/en/" + path.name
    if not (SHARE / "ar" / path.name).exists() or not (SHARE / "en" / path.name).exists():
        raise ValueError("Unpaired share page: " + str(path))
    x_default = BASE if path.stem == "home" else paired_en

    original_robots = get_meta(raw, ROBOTS)
    original_desc = get_meta(raw, DESCRIPTION)
    old_title_match = TITLE.search(raw)
    original_title = unescape(re.sub(r"</?title>", "", old_title_match.group(), flags=re.I)).strip() if old_title_match else path.stem
    title = original_title
    if path.stem == "home":
        title = ("الرحلات والمغامرات والكتب | KARIM SAAB" if lang == "ar"
                 else "Journeys, Adventures and Books | KARIM SAAB")
    if title_counts[(lang, title)]:
        title = title + " — " + path.stem.replace("-", " ")
    title_counts[(lang, title)] += 1
    description = (original_desc or visible_text(raw)[:180])[:190]
    if description_counts[(lang, description)]:
        description = (description.rstrip(". ")[:125] + " — " + title[:55]).strip()
    description_counts[(lang, description)] += 1

    out = REDIRECT_SCRIPT.sub("", raw)
    out = META_REFRESH.sub("", out)
    out = LD_JSON.sub("", out)
    # Keep manual interactive hash links; never emit them as canonical or alternate.
    out = enrich_home(path, lang, out)
    long_content, kind, video_id = original_sections(path, lang, data)
    if long_content:
        fragment = ('<section id="ks-seo-source-content"><h2>' +
                    ("النص الكامل المعتمد" if lang == "ar" else "Full approved article") +
                    "</h2>" + long_content + "</section>")
        out = append_inside_page(out, fragment)
    else:
        # Extend verified, linked content-library sections without inventing prose.
        if path.stem.startswith("content-"):
            library_entry = data["library"].get(path.stem[len("content-"):])
            if library_entry:
                refs = []
                for identifier in library_entry.get("items", []):
                    ref = data["library"].get(identifier) if isinstance(identifier, str) else None
                    other = SHARE / lang / ("content-" + str(identifier) + ".html")
                    if ref and other.is_file():
                        label = ref.get("ar" if lang == "ar" else "en", identifier)
                        refs.append('<li><a href="' + BASE + 'share/' + lang + '/' + other.name + '">' +
                                    escape(str(label)) + '</a></li>')
                if refs:
                    out = append_inside_page(out, '<section id="ks-seo-source-content"><h2>' +
                        ("موضوعات مرتبطة" if lang == "ar" else "Related topics") +
                        '</h2><ul>' + ''.join(refs) + '</ul></section>')
    if video_id and (path.stem.endswith("-video") or path.stem in ("story-wild-boar-greece", "story-arctic-survival-norway", "story-reindeer-close-call-norway")):
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
            raise ValueError("Invalid video ID: " + video_id)
        if "youtube-nocookie.com/embed/" + video_id not in out.split("</head>", 1)[-1]:
            frame = ('<section id="ks-seo-video"><h2>' +
                     ("شاهد الفيديو" if lang == "ar" else "Watch the video") + '</h2>' +
                     '<iframe title="' + escape(title, quote=True) +
                     '" width="560" height="315" style="max-width:100%;border:0" loading="lazy"'
                     ' allowfullscreen referrerpolicy="strict-origin-when-cross-origin"'
                     ' src="https://www.youtube-nocookie.com/embed/' + video_id + '"></iframe></section>')
            if path.stem in ("story-arctic-survival-norway", "story-reindeer-close-call-norway"):
                # Full article has already been inserted. Keep the video after it.
                out = out.replace("</main>", frame + "</main>", 1)
            else:
                out = append_inside_page(out, frame)

    # Explicit review placeholders are not useful indexable documents.
    placeholder = any(p in description for p in PLACEHOLDERS) and not long_content
    deliberate_noindex = "noindex" in original_robots.lower() or placeholder
    head, tail = out.split("</head>", 1)
    head = CANONICAL_ALTERNATES.sub("", head)
    head = ROBOTS.sub("", head)
    head = TITLE.sub("", head, count=1)
    head = DESCRIPTION.sub("", head, count=1)
    head = OG_URL.sub("", head)
    # Prevent accumulating whitespace when regenerating the same page.
    head = re.sub(r"[ \t]*\n(?:[ \t]*\n)+", "\n", head).rstrip()
    metadata = [
        "<title>" + escape(title) + "</title>",
        '<meta name="description" content="' + escape(description[:190], quote=True) + '">',
        '<meta name="robots" content="' + ("noindex,follow" if deliberate_noindex else "index,follow") + '">',
        '<link rel="canonical" href="' + url + '">',
        '<link rel="alternate" hreflang="ar" href="' + paired_ar + '">',
        '<link rel="alternate" hreflang="en" href="' + paired_en + '">',
        '<link rel="alternate" hreflang="x-default" href="' + x_default + '">',
        '<meta property="og:url" content="' + url + '">',
    ]
    # Structured data must reflect visible page content; avoid Product/LocalBusiness.
    graph = []
    has_long_article = bool(long_content)
    if has_long_article:
        graph.append({"@type": kind or "Article", "headline": title,
                      "description": description, "inLanguage": lang,
                      "author": {"@type": "Person", "name": OWNER[lang]},
                      "mainEntityOfPage": url})
    else:
        graph.append({"@type": "WebPage", "name": title,
                      "description": description, "inLanguage": lang, "url": url})
    if has_long_article or video_id:
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1,
             "name": "الرئيسية" if lang == "ar" else "Home",
             "item": BASE + "share/" + lang + "/home.html"},
            {"@type": "ListItem", "position": 2, "name": title, "item": url},
        ]})
    if video_id and '<iframe' in tail + out:
        poster_match = re.search(r'<meta\b[^>]*property=["\']og:image["\'][^>]*>', head, re.I)
        poster_val = CONTENT_VALUE.search(poster_match.group()) if poster_match else None
        thumb = unescape(poster_val.group(1)) if poster_val else "https://i.ytimg.com/vi/" + video_id + "/hqdefault.jpg"
        # A verified upload date is not available in the manifest; do not make one up.
        graph.append({"@type": "VideoObject", "name": title,
                      "description": description, "thumbnailUrl": thumb,
                      "embedUrl": "https://www.youtube-nocookie.com/embed/" + video_id,
                      "inLanguage": lang})
    metadata.append('<script type="application/ld+json">' +
                    json.dumps({"@context": "https://schema.org", "@graph": graph},
                               ensure_ascii=False, separators=(",", ":")).replace("<", "\\u003c") +
                    "</script>")
    out = head + "\n" + "\n".join(metadata) + "\n</head>" + tail
    return out, deliberate_noindex, has_long_article


def make_sitemap(original: str, excluded: set[str], changed: set[str]) -> str:
    root = ET.fromstring(original)
    if root.tag != "{" + SCHEMA + "}urlset":
        raise ValueError("Unexpected sitemap root")
    visited = set()
    for node in list(root):
        loc = node.find("{" + SCHEMA + "}loc")
        if loc is None or not loc.text:
            raise ValueError("Missing <loc>")
        url = loc.text.strip()
        if "#" in url or url in visited:
            raise ValueError("Duplicate or fragment URL " + url)
        visited.add(url)
        if url in excluded:
            root.remove(node)
            continue
        if url.endswith("/dist/index.html"):
            loc.text = BASE
            url = BASE
        if url in changed or url == BASE:
            lastmod = node.find("{" + SCHEMA + "}lastmod")
            if lastmod is None:
                lastmod = ET.SubElement(node, "{" + SCHEMA + "}lastmod")
            lastmod.text = TODAY
    entries = [e.text.strip() for e in root.findall(".//{" + SCHEMA + "}loc") if e.text]
    if not entries or entries[0] != BASE or len(entries) != len(set(entries)):
        raise ValueError("Sitemap homepage, duplication, or order error")
    ET.indent(root, space="  ")
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(root, encoding="unicode") + "\n"


def generate(write: bool):
    data = {
        "story": load_json("data/stories-road-v1.json"),
        "athos": load_json("data/destination-mount-athos-greece.json"),
        "happiness": {x["slug"]: x for x in load_json("data/happiness-stories-v1.json")["entries"]},
        "after": load_json("data/after-sixty.json")["episodes"][0],
        "health_sleeve": load_json("data/health-sleeve-v1.json"),
        "arctic": load_json("data/arctic-survival-v1.json"),
        "reindeer": load_json("data/reindeer-norway-v1.json"),
        "library": json.loads(re.sub(r";\s*$", "", re.sub(r"^\s*window\.KARIM_LIBRARY\s*=\s*",
                                  "", (DIST / "content.js").read_text(encoding="utf-8")).strip())),
    }
    files = sorted(SHARE.glob("*/*.html"))
    expected_pairs = {p.name for p in files if p.parent.name == "ar"}
    assert expected_pairs == {p.name for p in files if p.parent.name == "en"}, "Unpaired language paths"
    titles, descriptions = Counter(), Counter()
    changes, excluded = {}, set()
    enriched = 0
    thin = []
    for page in files:
        raw = page.read_text(encoding="utf-8")
        built, noindex, article = make_share(page, raw, data, titles, descriptions)
        url = BASE + page.relative_to(DIST).as_posix()
        if noindex:
            excluded.add(url)
        if article:
            enriched += 1
        if len(visible_text(built).split()) < 80 and not noindex:
            thin.append(page.relative_to(ROOT).as_posix())
        if built != raw:
            changes[page] = built
    sitemap_path = DIST / "sitemap.xml"
    old_map = sitemap_path.read_text(encoding="utf-8")
    new_map = make_sitemap(old_map, excluded, {BASE + p.relative_to(DIST).as_posix() for p in changes})
    report = [
        "# SEO-GSC-001: verified-source publishing audit",
        "",
        "Generated from approved repository manifests on " + TODAY + ".",
        "This output is a draft; no Google indexing is guaranteed.",
        "",
        "- Share pages inspected: " + str(len(files)),
        "- Static share HTML pages covered by generator: " + str(len(files)),
        "- Pages with expanded approved article text: " + str(enriched),
        "- Intentionally noindex pages: " + str(len(excluded)),
        "- Still short indexable pages requiring approved editorial text: " + str(len(thin)),
        "- Sitemap URLs after filtering: " + str(len(re.findall(r"<loc>", new_map))),
        "",
        "## Editorial source gaps — do not invent prose",
        "",
    ] + ["- " + p for p in thin] + [""]
    report_file = ROOT / "docs/seo/SEO-GSC-001-SOURCE-AUDIT.md"
    report_text = "\n".join(report)
    all_changes = {**changes, sitemap_path: new_map, report_file: report_text}
    pending = [p for p, new in all_changes.items()
               if not p.exists() or p.read_text(encoding="utf-8") != new]
    if write:
        for p in pending:
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_text(all_changes[p], encoding="utf-8")
    print("Share total:", len(files), "| expansions:", enriched,
          "| intentional noindex:", len(excluded), "| source gaps:", len(thin))
    print("Sitemap target count:", new_map.count("<loc>"), "| pending files:", len(pending))
    if not write and pending:
        import difflib
        first = pending[0]
        before = first.read_text(encoding="utf-8") if first.exists() else ""
        difference = list(difflib.unified_diff(
            before.splitlines(True), all_changes[first].splitlines(True),
            fromfile="current/" + str(first.relative_to(ROOT)),
            tofile="generated/" + str(first.relative_to(ROOT))))
        for line in difference[:50]:
            print(line.rstrip())
        raise SystemExit("Generated pages stale: run --write in review branch")
    return 0


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--write", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()
    raise SystemExit(generate(args.write))
