#!/usr/bin/env python3
"""Read-only SEO-GSC-001 release gate for sitemap, canonical, hreflang, JSON-LD."""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import sys
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class Meta(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.canonical, self.alternates, self.robots, self.og = [], {}, "", []
        self.title, self.description = "", ""
        self.in_title, self.h1, self.jsonld = False, 0, []
        self.in_jsonld = False
        self.json_buffer = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "title":
            self.in_title = True
        if tag == "h1":
            self.h1 += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.in_jsonld = True
            self.json_buffer = ""
        if tag == "link":
            if a.get("rel") == "canonical":
                self.canonical.append(a.get("href"))
            if a.get("rel") == "alternate" and a.get("hreflang"):
                self.alternates[a["hreflang"]] = a.get("href")
        if tag == "meta":
            if a.get("name") == "robots":
                self.robots = a.get("content", "")
            if a.get("name") == "description":
                self.description = a.get("content", "")
            if a.get("property") == "og:url":
                self.og.append(a.get("content"))

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_jsonld:
            self.json_buffer += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.in_jsonld:
            self.jsonld.append(json.loads(self.json_buffer))
            self.in_jsonld = False


def verify():
    errors = []
    def fail(message):
        errors.append(message)
    sitemap = ET.parse(DIST / "sitemap.xml")
    entries = sitemap.findall(".//sm:url", NS)
    urls = []
    for node in entries:
        loc = node.find("sm:loc", NS)
        if loc is None or not loc.text:
            fail("missing loc")
            continue
        url = loc.text.strip()
        urls.append(url)
        if "#" in url or urlsplit(url).scheme != "https" or not url.startswith(BASE):
            fail("invalid URL: " + url)
        date = node.find("sm:lastmod", NS)
        if date is not None and (not date.text or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", date.text)):
            fail("invalid lastmod: " + url)
        if url != BASE:
            rel = url[len(BASE):]
            if not (DIST / rel).is_file():
                fail("missing target: " + url)
    if not urls or urls[0] != BASE or len(urls) != len(set(urls)):
        fail("homepage missing from first loc / duplicates")
    if BASE + "index.html" in urls:
        fail("duplicate homepage index.html included")
    titles, descriptions = Counter(), Counter()
    short_pages = []
    total, noindex_count, blog_count, video_count = 0, 0, 0, 0
    for page in sorted((DIST / "share").glob("*/*.html")):
        total += 1
        lang = page.parent.name
        url = BASE + page.relative_to(DIST).as_posix()
        content = page.read_text(encoding="utf-8")
        head = content.split("</head>", 1)[0]
        if "window.location.replace(" in content or re.search(r'<meta[^>]*http-equiv=["\']refresh', head, re.I):
            fail("automatic redirect: " + str(page))
        if not re.search(r'<meta\s+charset=["\']utf-8', head, re.I):
            fail("missing UTF-8: " + str(page))
        m = Meta()
        try:
            m.feed(content)
        except (ValueError, json.JSONDecodeError) as exc:
            fail("malformed JSON-LD: " + str(page) + " " + str(exc))
            continue
        if m.canonical != [url] or m.og != [url]:
            fail("canonical/og mismatch: " + str(page))
        counterparts = {
            "ar": BASE + "share/ar/" + page.name,
            "en": BASE + "share/en/" + page.name,
            "x-default": BASE if page.stem == "home" else BASE + "share/en/" + page.name,
        }
        if any(m.alternates.get(k) != v for k, v in counterparts.items()):
            fail("incomplete hreflang: " + str(page))
        if m.h1 < 1 or not m.title.strip() or not m.description.strip():
            fail("missing title/description/h1: " + str(page))
        for value in [*m.canonical, *m.alternates.values()]:
            if "#" in value:
                fail("fragment in SEO URL: " + str(page))
        if not m.jsonld:
            fail("missing JSON-LD: " + str(page))
        graph = []
        for item in m.jsonld:
            graph.extend(item.get("@graph", [item]))
        types = {item.get("@type") for item in graph}
        if "BlogPosting" in types or "Article" in types:
            blog_count += 1
            if "BreadcrumbList" not in types:
                fail("article missing breadcrumb: " + str(page))
        if "VideoObject" in types:
            video_count += 1
            if "<iframe" not in content:
                fail("VideoObject without visible video iframe: " + str(page))
        noindex = "noindex" in m.robots.lower()
        if noindex:
            noindex_count += 1
        if (url in urls) == noindex:
            fail("sitemap/indexability conflict: " + str(page))
        titles[(lang, m.title)] += 1
        descriptions[(lang, m.description)] += 1
        body = content.split("</head>", 1)[-1].split("</body>", 1)[0]
        body = re.sub(r"<(?:style|script)\b.*?</(?:style|script)>", "", body, flags=re.I | re.S)
        words = re.sub(r"<[^>]*>", " ", body).split()
        if len(words) < 80 and not noindex:
            short_pages.append(page.relative_to(ROOT).as_posix())
    for (lang, value), n in titles.items():
        if n > 1:
            fail(f"duplicate title in {lang}: {value} x{n}")
    for (lang, value), n in descriptions.items():
        if n > 1:
            fail(f"duplicate description in {lang}: {value[:40]} x{n}")
    landing = (DIST / "index.html").read_text(encoding="utf-8")
    if landing.count('<link rel="canonical" href="' + BASE + '"') != 1:
        fail("incorrect directory homepage canonical")
    if '<meta property="og:url" content="' + BASE + '">' not in landing:
        fail("incorrect directory homepage OG url")
    if '"WebSite"' not in landing or '"Person"' not in landing:
        fail("missing WebSite/Person homepage schema")
    print("SITEMAP_URLS=", len(urls), "UNIQUE=", len(set(urls)))
    print("SHARE_PAGES=", total, "INTENTIONAL_NOINDEX=", noindex_count)
    print("ARTICLE_SCHEMA=", blog_count, "VIDEO_SCHEMA=", video_count)
    print("SHORT_INDEXABLE_REQUIRING_EDITORIAL=", len(short_pages), "REPORTED_IN=docs/seo/SEO-GSC-001-SOURCE-AUDIT.md")
    if errors:
        for problem in errors[:30]:
            print("FAIL:", problem)
        if len(errors) > 30:
            print("... and", len(errors) - 30, "more")
        return 1
    print("PASS: sitemap, page canonical, hreflang, JSON-LD and redirect checks")
    return 0


if __name__ == "__main__":
    sys.exit(verify())
