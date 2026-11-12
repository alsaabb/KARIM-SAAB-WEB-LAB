#!/usr/bin/env python3
"""Independent production HTTP smoke test from a GitHub-hosted runner, not localhost."""
import sys
import urllib.error
import urllib.request

BASE="https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/"
CHECKS=[
    ("homepage redirect",BASE, "عبدالكريم"),
    ("published app",BASE+"dist/index.html", 'id="app"'),
    ("core JavaScript",BASE+"dist/app.js", "function"),
    ("sharing JavaScript",BASE+"dist/bilingual-share-v1.js", "ks-share-v1"),
    ("after-sixty episodes",BASE+"dist/data/after-sixty.json", "episodes"),
    ("real article share page",BASE+"dist/share/ar/journey-legacy-5.html", "<html"),
]
failed=[]
for name,url,needle in CHECKS:
    req=urllib.request.Request(url, headers={"User-Agent":"KARIM-SAAB-site-availability-probe/1.0","Cache-Control":"no-cache"})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            body=r.read(250000).decode("utf-8","replace")
            ok=r.status==200 and needle in body
            print(("OK" if ok else "FAIL"),name,"HTTP",r.status,"URL",r.url,"bytes",len(body),flush=True)
            if not ok:
                print("  Check failed: content mismatch",flush=True)
                failed.append(name)
    except Exception as e:
        failed.append(name)
        print("FAIL",name,str(e),flush=True)
# Observational checks: these domains do not necessarily serve this repo.
for domain in ("https://www.karimsaab.com/","https://www.alsaab.net/"):
    try:
        with urllib.request.urlopen(urllib.request.Request(domain,headers={"User-Agent":"KARIM-SAAB-site-availability-probe/1.0"}),timeout=15) as r:
            print("DOMAIN",domain,"HTTP",r.status,"final",r.url,flush=True)
    except Exception as e:
        print("DOMAIN",domain,"UNVERIFIED",str(e),flush=True)
if failed:
    print("FAILED production URLs:",", ".join(failed),file=sys.stderr)
    sys.exit(1)
print("PASS: Primary GitHub Pages URLs accessible from runner.",flush=True)
