#!/usr/bin/env python3
"""SEO-GSC-001: read-only public HTTPS sitemap diagnostic.

Run manually (preferably from an external runner):
    python3 scripts/diagnose_sitemap_seo_gsc_001.py --sample 12

This script NEVER changes files, GitHub Pages, or Search Console.
It verifies public HTTP responses and XML structure. It cannot prove what
Googlebot sees or why Search Console says "Couldn't fetch".
"""
from __future__ import annotations

import argparse
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

ORIGIN = "https://alsaabb.github.io"
PREFIX = "/KARIM-SAAB-WEB-LAB/dist/"
SITEMAP = ORIGIN + PREFIX + "sitemap.xml"
HOME = ORIGIN + PREFIX
NAMESPACE = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
USER_AGENT = "KARIM-SAAB-SEO-GSC-001-Diagnostic/1.0"
MAX_SITEMAP_BYTES = 5_000_000


def fetch(url: str, timeout: int, limit: int = 8192):
    """GET with redirect, status, MIME type, headers; never change server state."""
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "application/xml,text/xml,text/plain,text/html,*/*",
            "Cache-Control": "no-cache",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            data = response.read(limit + 1)
            if len(data) > limit:
                return None, "Response exceeded diagnostic size limit"
            return {
                "status": response.status,
                "url": response.geturl(),
                "type": response.headers.get("Content-Type", ""),
                "robots": response.headers.get("X-Robots-Tag", ""),
                "length": len(data),
                "body": data,
            }, None
    except urllib.error.HTTPError as exc:
        return {"status": exc.code, "url": exc.geturl(), "type": exc.headers.get("Content-Type", "")}, None
    except (urllib.error.URLError, TimeoutError, OSError, ValueError) as exc:
        return None, f"{type(exc).__name__}: {exc}"


def details(label: str, response, error):
    if error:
        print(f"ERROR {label}: {error}")
        return
    print(f"{label}: HTTP {response['status']} | {response['url']} | Content-Type: {response['type'] or '(none)'}")
    if response.get("robots"):
        print(f"  X-Robots-Tag: {response['robots']}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sample", type=int, default=12, help="Number of evenly spaced URLs to probe (0-420).")
    parser.add_argument("--timeout", type=int, default=20, help="Seconds per request.")
    args = parser.parse_args()
    if args.sample < 0 or args.sample > 420 or args.timeout < 1 or args.timeout > 120:
        parser.error("--sample must be 0..420 and --timeout must be 1..120")

    failures = 0
    sitemap, error = fetch(SITEMAP, args.timeout, MAX_SITEMAP_BYTES)
    details("PUBLIC SITEMAP", sitemap, error)
    if error or not sitemap or sitemap["status"] != 200:
        print("FAIL: Could not download public sitemap over HTTPS.")
        return 1
    if sitemap["url"] != SITEMAP:
        print("WARN: Public sitemap redirected; inspect the final URL.")
    if not any(value in sitemap["type"].lower() for value in ("xml", "text/plain")):
        print("WARN: Unusual Content-Type for an XML sitemap (not necessarily fatal).")

    try:
        root = ET.fromstring(sitemap["body"])
    except ET.ParseError as exc:
        print(f"FAIL: Invalid XML: {exc}")
        return 1

    if root.tag != NAMESPACE + "urlset":
        print(f"FAIL: Unexpected XML root tag: {root.tag!r}")
        return 1

    elements = root.findall(NAMESPACE + "url")
    urls = []
    lastmods = 0
    for number, entry in enumerate(elements, 1):
        loc = entry.find(NAMESPACE + "loc")
        if loc is None or not (loc.text or "").strip():
            print(f"FAIL: <url> #{number} has no <loc>.")
            failures += 1
            continue
        url = loc.text.strip()
        urls.append(url)
        parsed = urlsplit(url)
        if parsed.scheme != "https" or parsed.netloc != "alsaabb.github.io" or not parsed.path.startswith(PREFIX):
            print(f"FAIL: Unexpected sitemap URL #{number}: {url}")
            failures += 1
        if parsed.fragment:
            print(f"FAIL: URL fragment present in <loc> #{number}: {url}")
            failures += 1
        if entry.find(NAMESPACE + "lastmod") is not None:
            lastmods += 1

    print(f"XML: valid urlset | entries={len(elements)} | unique={len(set(urls))} | lastmod={lastmods}")
    if len(set(urls)) != len(urls):
        print("FAIL: Duplicate sitemap URLs detected.")
        failures += 1
    print(f"NOTE: Canonical homepage {HOME} listed: {HOME in urls}")
    print(f"NOTE: /dist/index.html listed: {HOME + 'index.html' in urls}")

    # A robots.txt in /dist/ is not the robots.txt authority for this host.
    for url, label in (
        (ORIGIN + "/robots.txt", "HOST-ROOT ROBOTS (informational)"),
        (HOME + "robots.txt", "PROJECT ROBOTS (informational)"),
        (HOME, "CANONICAL HOMEPAGE"),
    ):
        response, err = fetch(url, args.timeout)
        details(label, response, err)
        if label == "CANONICAL HOMEPAGE" and (err or not response or response["status"] != 200):
            print("FAIL: Canonical homepage is not serving HTTP 200.")
            failures += 1

    # Sample across the entire XML, not just the first Arabic pages.
    sample_count = min(args.sample, len(urls))
    sample_indices = (
        sorted({(k * (len(urls) - 1)) // (sample_count - 1) for k in range(sample_count)})
        if sample_count > 1 else ([0] if sample_count == 1 else [])
    )
    for i in sample_indices:
        url = urls[i]
        response, err = fetch(url, args.timeout)
        details(f"LINK {i+1}/{len(urls)}", response, err)
        if err or not response or response["status"] != 200:
            failures += 1
            print("  FAIL: Link could not be fetched as HTTP 200.")
        elif response["url"] != url:
            print("  WARN: Link redirects to a different URL.")

    print(f"SUMMARY: {len(urls)} sitemap URLs; {len(sample_indices)} live URL probes; {failures} detected failures.")
    print("LIMITATION: Google Search Console processing and Googlebot-specific fetching are not checked by this script.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
