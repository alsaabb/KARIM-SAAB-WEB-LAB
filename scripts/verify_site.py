#!/usr/bin/env python3
"""Read-only release checks for KARIM SAAB GitHub Pages V10."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
BASE = "https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist"
OLD = "karimsaab.tangylily8193.chatgpt.site"


class HeadLinks(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.alternates = {}
        self.og_urls = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link":
            if a.get("rel") == "canonical":
                self.canonical.append(a.get("href"))
            if a.get("rel") == "alternate" and a.get("hreflang"):
                self.alternates[a["hreflang"]] = a.get("href")
        if tag == "meta" and a.get("property") == "og:url":
            self.og_urls.append(a.get("content"))


def run():
    issues = []
    site_root = (ROOT / "index.html").read_text(encoding="utf-8")
    app = (DIST / "index.html").read_text(encoding="utf-8")
    if "/KARIM-SAAB-WEB-LAB/dist/index.html" not in site_root:
        issues.append("Root entry does not redirect to /dist/index.html")
    if "https://karim-ai-virtual-assistant.ai.studio" not in app:
        issues.append("Published app has no KARIM AI external link")

    sitemap_path = DIST / "sitemap.xml"
    sitemap = ET.parse(sitemap_path)
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [node.text.strip() for node in sitemap.findall(".//sm:url/sm:loc", ns) if node.text]
    urlset = set(urls)
    if not urls or len(urls) != len(urlset):
        issues.append("Sitemap is empty or has duplicate URLs")

    pages = sorted((DIST / "share").glob("*/*.html"))
    # Retired URLs remain functional redirect aliases for existing external links.
    # They are noindex and intentionally omitted from the active XML sitemap.
    expected = {
        BASE + "/" + p.relative_to(DIST).as_posix()
        for p in pages
        if '<meta name="robots" content="noindex,follow">' not in p.read_text(encoding="utf-8")
    }
    for missing in sorted(expected - urlset):
        issues.append("Not in sitemap: " + missing)
    for extra in sorted(urlset - expected):
        issues.append("Unexpected sitemap URL: " + extra)

    for page in pages:
        value = page.read_text(encoding="utf-8")
        url = BASE + "/" + page.relative_to(DIST).as_posix()
        if OLD in value:
            issues.append(f"Old site domain: {page.relative_to(ROOT)}")
        meta = HeadLinks()
        meta.feed(value)
        if meta.canonical != [url]:
            issues.append(f"Incorrect canonical: {page.relative_to(ROOT)}")
        if meta.og_urls and meta.og_urls != [url]:
            issues.append(f"Incorrect og:url: {page.relative_to(ROOT)}")
        for lang in ("ar", "en"):
            counterpart = page.parent.parent / lang / page.name
            if counterpart.exists():
                matching = BASE + "/" + counterpart.relative_to(DIST).as_posix()
                if meta.alternates.get(lang) != matching:
                    issues.append(f"Incorrect hreflang {lang}: {page.relative_to(ROOT)}")

    pdf_files = sorted(DIST.rglob("*.pdf"))
    print(f"Sitemap URLs: {len(urls)} | Share pages: {len(pages)} | Public PDF assets: {len(pdf_files)}")
    if issues:
        for issue in issues[:40]:
            print("FAIL:", issue)
        if len(issues) > 40:
            print(f"... plus {len(issues)-40} additional issues")
        raise SystemExit(1)
    print("PASS: routing, sitemap, canonical, hreflang, OG URLs, and KARIM AI link.")


if __name__ == "__main__":
    run()
