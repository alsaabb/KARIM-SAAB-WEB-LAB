# KARIM SAAB — Engineering, Security & Release Governance
**Owner-approved policy: 2026-11-15**  
**Repository:** `alsaabb/KARIM-SAAB-WEB-LAB`  
**Public site:** https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/  
**Related operational master:** [KARIM_SAAB_WEBSITE_MASTER.md](KARIM_SAAB_WEBSITE_MASTER.md)

> This is a repository governance policy for **future changes**. The policy itself is a proposed change until its PR is explicitly approved and merged. It does not authorize any merge, publication, Drive permissions change, or action on any other repository.

## 1. GitHub governance — mandatory
- Never commit, push, force-push, or merge **directly** to `main`. Create a separate review branch, use an ordinary Pull Request to `main`, and require the owner's **explicit authorization for the exact merge/release**. A reviewer verdict such as `APPROVE`, or approval of technical recommendations, is **not** sufficient permission to merge.
- Preserve approved existing pages, links, source documents and release history. No silent deletion, overwrite, reset or scope expansion. **Do not modify `alsaabprojects/alsaab`**.
- PR #39 (`fix/qa-security-seo-perf-2026-11-15`) and future PRs remain unmerged until the owner specifically authorizes merging.
- Only owner-approved work reaches the release branch. Verify both deployment and actual live-site results afterward. A successful test or merge alone is not proof of a successful live publication.
- Human GitHub repository administrators should configure branch protection/rulesets to require PR reviews and passing checks and to restrict bypass and direct pushes. **This document cannot enforce GitHub server-side branch protection by itself.**

## 2. Client-side security
- Prefer verified local copies of critical third-party browser libraries under `dist/assets/vendor/`. Verify bytes with official SHA-256 digests. If an external CDN is essential, pin a version and use matching SRI plus `crossorigin="anonymous"`; verify it really loads.
- Maintain an explicit CSP in `dist/index.html`, including `object-src 'none'`, restricted `script-src`, `frame-src`, and the least broad image origins necessary for approved media. Test embedded videos, maps, thumbnails and browser Console; avoid broad `unsafe-eval` or new wildcard script origins.
- Every video iframe **created after a user click** must have `sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"`. Every anchor with `target="_blank"` needs `rel="noopener noreferrer"`. Preserve ordinary navigation and popup functionality. Review risks of same-origin/same-scripts if changing iframe destinations.
- No `docs.google.com/.../edit` URLs, `?usp=drivesdk`, or credentials inside published `dist/`. Use a locally authorized public PDF in `dist/assets/` or a `/view` link whose **Anyone with the link — Reader** permission has been verified. Keep archival provenance and owner-controlled originals separate. Public GitHub `docs/` is **not private or secret storage**.
- Do not invent Drive sharing permissions, publish private originals, or alter Drive permissions without owner authorization.

## 3. Performance and media
- Convert every new or updated public image to **WebP <=250 KiB**, preferably **<=150 KiB for hero images**, without unnecessary quality loss. Preserve the original image under `docs/qa-source-assets/` on this repository's review branch, or in another explicitly approved archive. Do not delete prior versions.
- Add meaningful `width`, `height` and `alt` to images. For below-the-fold images use `loading="lazy"` and `decoding="async"`. Prioritize true above-the-fold LCP media instead of lazily loading them.
- Use **Lite Embed / click-to-load facades** for YouTube and Google Drive video. No remote iframe on initial page load. Include accessible playback controls and a verified external watch link.
- Any change to an existing CSS source must regenerate **`dist/styles.bundle.min.css`** in the approved source order with `python3 scripts/build_css_bundle.py --write`. Run `--check` before PR submission. Keep original CSS files; changing only the minified bundle is not an acceptable source edit.

## 4. Arabic / English and SEO
- Every published new or changed Arabic article/section needs a **fully reviewed English equivalent**, including `title_en` and `body_en` where those schema fields apply. No untranslated Arabic fragments inside English-only fields. Keep Arabic/English sharing pages structurally paired under `dist/share/ar/` and `dist/share/en/`.
- Maintain production-only canonical URLs, `hreflang="ar"`, `"en"`, `"x-default"`, OpenGraph, robots and sitemap. Refresh `dist/sitemap.xml` and derived registries for new routes. Do not silently break old links or existing 301/noindex aliases.

## 5. Quality gate required for every PR
Run from the repository root with a clean checkout of the proposed branch:

```sh
python3 scripts/build_css_bundle.py --check
python3 scripts/qa_gate.py
python3 scripts/verify_site.py
python3 scripts/build_site_master_registry.py --check
python3 -m unittest discover -s tests -p 'test_*.py' -v
python3 scripts/verify_identity.py
```

Also perform `node --check` on the site's JavaScript sources and inspect the GitHub Actions results. All required commands must exit with **code 0** before declaring a PR QA-ready. Static asset scanning checks literal paths and cannot certify all JS-generated/dynamically loaded paths, real-device LCP, iframe playback or media rights.

**No merge** until the owner explicitly authorizes that particular PR's merge and deployment.

## 6. Post-release owner checklist
After an **authorized** PR merge and successful GitHub Pages deployment, remind the owner to open the published site in an **Incognito / Private** window on phone and desktop and verify:
- Leaflet maps / tiles / markers operate correctly.
- Video facades launch approved YouTube / Drive playback after click.
- Book PDF and verified public `/view` links open without owner authentication.
- Browser Console/Network shows no CSP violations, 404 broken assets, blocked fonts or unexpected missing CSS.
- Bilingual navigation and share metadata are accurate.

If the release creates a final approved report or other approved file, ask the owner whether to archive a copy to Google Drive; choose an existing or new folder **before** uploading, never overwrite, and confirm the direct file URL only after verifying the upload.

## 7. Review evidence and references
- Historic remediation and verification: [PR #39](https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/pull/39)
- Latest approved technical test baseline at policy creation: commit `1d99fd9a53de474307d6862a89d9165c64fe7a3f` ([Actions](https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/actions/runs/43677974867)).
- These are **historical** references, not claims that a future commit has already passed.
