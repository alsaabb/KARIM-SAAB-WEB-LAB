#!/usr/bin/env python3
"""Live public HTTP probe for SEO-GSC-001 (read-only, from GitHub runner)."""
from __future__ import annotations
import urllib.request
import urllib.error
import sys

ORIGIN = "https://alsaabb.github.io"
BASE = ORIGIN + "/KARIM-SAAB-WEB-LAB/dist/"
URLS = (
    BASE,
    BASE + "index.html",
    BASE + "sitemap.xml",
    BASE + "share/ar/home.html",
    BASE + "share/en/home.html",
)

def main() -> int:
    failures = 0
    for link in URLS:
        request = urllib.request.Request(
            link, headers={"User-Agent":"KARIM-SAAB-SEO-GSC-001-AUDIT/1.0",
                           "Cache-Control":"no-cache"})
        try:
            with urllib.request.urlopen(request, timeout=25) as response:
                body = response.read(2_000_000)
                status = response.status
                final = response.geturl()
                content_type = response.headers.get("Content-Type", "(missing)")
                redirected = final != link
                print(f"URL={link}")
                print(f"HTTP={status} TYPE={content_type} REDIRECT={redirected} FINAL={final} BYTES={len(body)}")
                if status != 200 or not body:
                    failures += 1
                if link.endswith(".xml") and not body.lstrip().startswith(b"<?xml"):
                    failures += 1
                    print("FAIL: XML declaration missing")
        except Exception as exc:
            failures += 1
            print(f"URL={link} ERROR={type(exc).__name__}: {exc}")
    print(f"PUBLIC_HTTP_CHECKS={len(URLS)} ERRORS={failures}")
    return 1 if failures else 0

if __name__ == "__main__":
    sys.exit(main())
