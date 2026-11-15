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
    if "/KARIM-SAAB-WEB-LAB/dist/" not in site_root:
        issues.append("Root entry does not redirect to /dist/")
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
    # The canonical homepage is a first-class sitemap entry alongside share pages.
    homepage = BASE + "/"
    expected.add(homepage)
    if not urls or urls[0] != homepage:
        issues.append("Canonical homepage must be the first sitemap URL")
    homepage_head = HeadLinks()
    homepage_head.feed(app)
    if homepage_head.canonical != [homepage]:
        issues.append("Incorrect homepage canonical")
    if homepage_head.og_urls != [homepage]:
        issues.append("Incorrect homepage og:url")
    for lang in ("ar", "en"):
        alternate = BASE + "/share/" + lang + "/home.html"
        if homepage_head.alternates.get(lang) != alternate:
            issues.append(f"Incorrect homepage hreflang {lang}")
    if homepage_head.alternates.get("x-default") != homepage:
        issues.append("Incorrect homepage x-default hreflang")

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
        if '#/' in ''.join(meta.canonical + list(meta.alternates.values())):
            issues.append(f"Fragment canonical/hreflang: {page.relative_to(ROOT)}")
        expected_default = homepage if page.name == "home.html" else BASE + "/share/en/" + page.name
        if meta.alternates.get("x-default") != expected_default:
            issues.append(f"Incorrect x-default: {page.relative_to(ROOT)}")
        if "window.location.replace(" in value or '<meta http-equiv="refresh"' in value.lower():
            issues.append(f"Unexpected automatic redirect: {page.relative_to(ROOT)}")
        if '<h1' not in value.lower():
            issues.append(f"Missing visible h1: {page.relative_to(ROOT)}")
        for lang in ("ar", "en"):
            counterpart = page.parent.parent / lang / page.name
            if counterpart.exists():
                matching = BASE + "/" + counterpart.relative_to(DIST).as_posix()
                if meta.alternates.get(lang) != matching:
                    issues.append(f"Incorrect hreflang {lang}: {page.relative_to(ROOT)}")

    import re
    import json
    homepage_title = app.split("<title>", 1)[-1].split("</title>", 1)[0]
    if not homepage_title.strip():
        issues.append("Empty homepage title")
    if '"/dist/index.html"' in homepage_head.canonical:
        issues.append("Homepage canonical should be /dist/")
    for xmlurl in urls:
        if '#' in xmlurl or not xmlurl.startswith(BASE + "/"):
            issues.append("Fragment/host issue in sitemap: " + xmlurl)
    for element in sitemap.findall(".//sm:url", ns):
        lastmod = element.find("sm:lastmod", ns)
        if lastmod is not None and (not lastmod.text or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", lastmod.text)):
            issues.append("Invalid sitemap lastmod date")
    if "https://schema.org" not in app or '"WebSite"' not in app or '"Person"' not in app:
        issues.append("Homepage JSON-LD Person/WebSite missing")
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
