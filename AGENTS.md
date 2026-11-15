# Instructions for coding agents — KARIM SAAB
Repository: `alsaabb/KARIM-SAAB-WEB-LAB`.

**Read [docs/ENGINEERING_GOVERNANCE.md](docs/ENGINEERING_GOVERNANCE.md) and [docs/KARIM_SAAB_WEBSITE_MASTER.md](docs/KARIM_SAAB_WEBSITE_MASTER.md) before editing.** These are owner-approved development/release rules; do not confuse them with authorization for a specific publication.

1. No direct write to `main`. Branch + PR only; remain in Draft/review until the owner explicitly authorizes **the merge**. Do not modify `alsaabprojects/alsaab`.
2. Preserve every published section (including `dist/after-sixty-v1.js` and `dist/data/after-sixty.json`), AR/EN share pages, URLs, galleries and originals.
3. Restrict CSP; verify pinned local third-party browser libraries and hashes. No Google Docs edit links or Drive SDK tracking in `dist/`. Verify public reader links before publishing. Video iframes: click-to-load and use the specified sandbox; external links use `noopener noreferrer`.
4. Public images: WebP <=250 KiB (hero preferably <=150 KiB), preserve originals at `docs/qa-source-assets/`, add image sizes and lazy loading for non-LCP media.
5. Maintain full bilingual content, canonical/hreflang and sitemap parity. Update registries when assets/routes change.
6. Rebuild CSS when any source stylesheet changes: `python3 scripts/build_css_bundle.py --write`, then `--check`. Keep original source CSS.
7. Required pre-review checks: `python3 scripts/qa_gate.py`; `python3 scripts/verify_site.py`; `python3 scripts/build_site_master_registry.py --check`; `python3 -m unittest discover -s tests -p 'test_*.py' -v`; `python3 scripts/verify_identity.py`; JavaScript syntax; and CSS bundle freshness. Require exit code 0.
8. After separately authorized deployment, remind the owner to test maps, video, books, CSP and 404s in an incognito browser.
9. GitHub repository documents are public. Do not put credentials or presumed-private archival IDs or files in the repo. A passing static CI run is not proof of live-browser behavior.
