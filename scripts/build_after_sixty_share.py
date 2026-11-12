#!/usr/bin/env python3
"""Generate static social-preview pages for the approved After Sixty manifest.

Creates/updates only share pages owned by this collection; never deletes other pages,
and only appends missing sitemap URLs. Run on a review branch before merging.
"""
from __future__ import annotations

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
MANIFEST = DIST / "data" / "after-sixty.json"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
SAFE_SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def share_html(ep: dict, lang: str) -> str:
    ar = lang == "ar"
    slug = ep["slug"]
    title = ep["title_ar" if ar else "title_en"]
    description = ep["excerpt_ar" if ar else "excerpt_en"]
    link = BASE + "share/" + lang + "/after-sixty-" + slug + ".html"
    link_ar = BASE + "share/ar/after-sixty-" + slug + ".html"
    link_en = BASE + "share/en/after-sixty-" + slug + ".html"
    app = BASE + "index.html#/" + lang + "/about/after-sixty/" + slug
    image = "https://i.ytimg.com/vi/" + ep["youtube_id"] + "/hqdefault.jpg"
    person = "عبد الكريم بن ابراهيم الصعب" if ar else "KARIM SAAB"
    structured = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "inLanguage": lang,
        "author": {"@type": "Person", "name": person},
        "mainEntityOfPage": link,
        "image": [image],
        "video": {
            "@type": "VideoObject",
            "name": title,
            "description": description,
            "thumbnailUrl": [image],
            "embedUrl": "https://www.youtube-nocookie.com/embed/" + ep["youtube_id"],
            "contentUrl": "https://www.youtube.com/watch?v=" + ep["youtube_id"],
            "duration": "PT" + str(int(ep["duration_seconds"])) + "S",
        },
    }
    esc = lambda v: html.escape(str(v), quote=True)
    site = "KARIM SAAB"
    call = "مشاهدة الفيديو وقراءة المقال" if ar else "Watch video and read article"
    doc = (
        '<!doctype html><html lang="' + lang + '" dir="' + ("rtl" if ar else "ltr") + '">'
        '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        '<meta name="theme-color" content="#141414"><meta name="robots" content="index,follow">'
        '<title>' + esc(title) + ' | KARIM SAAB</title>'
        '<meta name="description" content="' + esc(description) + '">'
        '<link rel="canonical" href="' + link + '">'
        '<link rel="alternate" hreflang="ar" href="' + link_ar + '">'
        '<link rel="alternate" hreflang="en" href="' + link_en + '">'
        '<meta property="og:type" content="article">'
        '<meta property="og:site_name" content="' + site + '">'
        '<meta property="og:title" content="' + esc(title) + '">'
        '<meta property="og:description" content="' + esc(description) + '">'
        '<meta property="og:image" content="' + image + '">'
        '<meta property="og:url" content="' + link + '">'
        '<meta name="twitter:card" content="summary_large_image">'
        '<meta name="twitter:title" content="' + esc(title) + '">'
        '<meta name="twitter:description" content="' + esc(description) + '">'
        '<meta name="twitter:image" content="' + image + '">'
        '<script type="application/ld+json">' + json.dumps(structured, ensure_ascii=False).replace("<", "\\u003C") + '</script>'
        '<style>body{margin:0;background:#141414;color:#f1eadc;font:18px/1.85 system-ui,Tahoma,Arial,sans-serif}'
        'main{max-width:850px;margin:5vh auto;padding:30px}h1{color:#D4AF37}'
        'img{width:min(100%,640px);aspect-ratio:16/9;object-fit:cover;border:1px solid #D4AF37;border-radius:12px}'
        'a{display:inline-block;padding:12px 22px;background:#D4AF37;color:#141414;text-decoration:none;border-radius:7px;font-weight:700}</style>'
        '</head><body><main><small>' + esc(person) + ' | KARIM SAAB</small>'
        '<h1>' + esc(title) + '</h1><img src="' + image + '" alt="' + esc(title) + '">'
        '<p>' + esc(description) + '</p><a href="' + app + '">' + call + '</a></main>'
        '<script>if(!/bot|crawler|spider|facebookexternalhit|twitterbot|pinterest|whatsapp|linkedinbot|slackbot|googlebot/i.test(navigator.userAgent)){window.location.replace('
        + json.dumps(app) + ');}</script></body></html>\n'
    )
    return doc


def build():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sitemap = DIST / "sitemap.xml"
    xml = sitemap.read_text(encoding="utf-8")
    additions = []
    for ep in manifest["episodes"]:
        if not SAFE_SLUG.fullmatch(ep["slug"]) or not re.fullmatch(r"[A-Za-z0-9_-]{11}", ep["youtube_id"]):
            raise ValueError("Unsafe episode slug / video id")
        for lang in ("ar", "en"):
            rel = "share/" + lang + "/after-sixty-" + ep["slug"] + ".html"
            dest = DIST / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            page = share_html(ep, lang)
            if not dest.exists() or dest.read_text(encoding="utf-8") != page:
                dest.write_text(page, encoding="utf-8")
                print("Updated preview:", rel)
            url = BASE + rel
            if url not in xml:
                additions.append("<url><loc>" + url + "</loc></url>")
    if additions:
        if "</urlset>" not in xml:
            raise ValueError("Invalid sitemap")
        sitemap.write_text(xml.replace("</urlset>", "".join(additions) + "</urlset>"), encoding="utf-8")
    print("Prepared share pages:", 2 * len(manifest["episodes"]))


if __name__ == "__main__":
    build()
