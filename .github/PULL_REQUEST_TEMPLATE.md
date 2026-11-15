## KARIM SAAB — Owner approval and quality review

**This PR does not authorize a merge or production publication. Keep it unmerged until the owner explicitly authorizes this specific PR.**

### Change scope
- Describe the source material, approved page/route and exact change:
- Content/media rights, original archive location and any affected Drive links:
- Existing routes and sections preserved (especially Life After Sixty):

### Security / performance / bilingual release checklist
- [ ] All modifications are on a review branch; no direct push to `main`, no changes to `alsaabprojects/alsaab`.
- [ ] Local vendor libraries are verified with SHA-256; CSP, sandbox and external anchor safeguards remain correct.
- [ ] No public Google Docs `/edit`, Drive SDK links or exposed secrets; any `/view` destination is permission-verified.
- [ ] New/changed images are WebP <=250 KiB (hero preferably <=150 KiB); originals preserved.
- [ ] Every video uses click-to-load facade; image sizes and lazy loading are appropriate.
- [ ] CSS source changes were followed by `python3 scripts/build_css_bundle.py --write`, preserving order.
- [ ] Arabic / English content and share pages are paired; sitemap, canonical/hreflang and registries updated.
- [ ] `python3 scripts/build_css_bundle.py --check` passed (exit 0).
- [ ] `python3 scripts/qa_gate.py` passed (exit 0).
- [ ] `python3 scripts/verify_site.py` passed (exit 0).
- [ ] `python3 scripts/build_site_master_registry.py --check` passed (exit 0).
- [ ] `python3 -m unittest discover -s tests -p 'test_*.py' -v` passed (exit 0).
- [ ] `python3 scripts/verify_identity.py` and all JavaScript syntax checks passed.
- [ ] All required GitHub Actions checks are green; any manual/browser testing gaps disclosed.

### Approval / deployment
- **Explicit owner instruction authorizing this exact PR merge:** _not yet provided_
- **Merge/release status:** awaiting explicit owner instruction
- After separately authorized release: owner to verify maps, videos, book links and CSP/404 errors in incognito.
- Additional policy: [docs/ENGINEERING_GOVERNANCE.md](../docs/ENGINEERING_GOVERNANCE.md).
