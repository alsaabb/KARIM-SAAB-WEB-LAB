# KARIM SAAB — WEBSITE MASTER | الماستر التشغيلي للموقع

**Master version:** 1.0 — review draft, 2026-11-13  
**Scope:** ALL current and future pages, images, videos, stories, articles, documents and product galleries.  
**Owner:** عبدالكريم بن إبراهيم الصعب — KARIM SAAB  
**Repository:** https://github.com/alsaabb/KARIM-SAAB-WEB-LAB  
**Production:** https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/index.html  
**Release branch:** main  
**Status of THIS revision:** staged on a REVIEW branch. Not merged/deployed until the owner approves.

> This is the operational master alongside — not a deletion or replacement of — the historical
> `KARIM_SAAB_WEBSITE_MASTER_REFERENCE_2026-10-30.docx`. That historical source cites a
> former domain and 2026-10-30 workflow and must not override the current GitHub repository.

## 1. Source of truth and precedence

1. **Owner-approved original documents / media**: editorial authority; never invent trips, dates, videos, images or quotes.
2. **GitHub review branch and approved commit**: technical implementation and change history.
3. **GitHub Pages live site**: observable public result, separately verified after deployment.
4. **Google Drive**: owner-selected source/archive folders. A stored file alone does not establish publication or public access.
5. **This living master and registries**: pointers and current operational decisions, not a substitute for source files.

The actual repository on 2026-11-13 has a root redirect, `dist/index.html` hash-router,
`dist/app.js`, `dist/content.js`, `dist/share/ar` and `dist/share/en` previews,
`dist/sitemap.xml`, and independent About/After Sixty/Happiness module files.
There are also existing staged Drive-sync mechanisms. **Do not connect those to production implicitly.**

## 2. Site-wide indexing — mandatory

- **Page registry:** [registry/page_registry.json](registry/page_registry.json)
- **Media registry:** [registry/media_registry.json](registry/media_registry.json)
- **Inventory report:** [registry/INVENTORY_REPORT.md](registry/INVENTORY_REPORT.md)
- **Regenerator:** [../scripts/build_site_master_registry.py](../scripts/build_site_master_registry.py)
- **Registry contract:** [registry/SCHEMA.md](registry/SCHEMA.md)

Run from repository root:
```sh
python3 scripts/build_site_master_registry.py --write
python3 scripts/build_site_master_registry.py --check
python3 -m unittest discover -s tests -p 'test_site_master_registry.py' -v
python3 scripts/verify_site.py
```

The generator scans ALL static share pages in both languages, links to their
actual hash routes, existing 80-item legacy content library, About master
records, structured happiness/after-sixty video metadata, local public assets,
and sitemap. It includes historic aliases and marks untested live links accurately.

IDs in this index are **deterministic route fingerprints**; do not replace any
existing editorial/Drive IDs in primary source documents. A recorded HTML page
or sitemap URL DOES NOT prove a route loads successfully in a browser. Full
dynamic JS/CSS image references and media rights need separate review.

Each addition or change must update the generator/sources as appropriate,
regenerate inventory, and pass check. Never hand-edit generated inventory files.

### Reproducible baseline audit — 2026-11-13

The generator completed successfully on the review branch with these verified
repository counts (not live browser confirmation):
- **218** distinct discovered hash routes;
- **424** static Arabic/English share pages including noindex/alias pages;
- **418** sitemap URLs;
- **80** content library entries; **23** About master records;
- **45** local public image/video assets;
- **3** YouTube IDs in structured After Sixty/Happiness episode metadata;
- **0** missing local public asset files in the share/library reference scan.

These figures may grow as pages are added, and the exact current numbers
are generated automatically in the inventory report rather than hand-maintained.

## 3. Generalized content intake (every URL)

### Determine destination before any mutation

1. Read the *specific* page from page registry, hash route and source file.
2. Identify whether it is a gallery, single video, documentary article, book,
   business page, product collection, press item or another documented type.
3. Read existing material and exact owner's sources before altering anything.
4. Record editorial status and provenance. If missing, mark as pending review.
5. Reuse existing media IDs and source data; do not create duplicate pages or
   parallel file trees unless the architecture warrants it.
6. Preserve all other sections, header/footer, language menu, socials, old URLs and aliases.

### Images (photo, cover, gallery)

- Require owner/source/rights provenance; do not substitute fictional photographs.
- Keep a high-quality original in explicitly authorized storage; use optimized
  public site assets (`dist/assets`) for browser display.
- Preserve aspect ratio, prepare descriptive alt text, use responsive dimensions,
  lazy loading outside the first fold, and verify desktop/mobile rendering.
- A Drive **preview** URL is not automatically a reliable public `img src` URL.
- Register every file and routes using it, distinguishing real, generated,
  altered and unknown-origin images.

### Video and optional story/article

- YouTube: only use a genuine 11-character ID from the authorized source.
- Portrait shorts: `9:16`; landscape: `16:9`. Preserve original framing.
- Start with available thumbnail and prominent gold play button; create iframe
  on user interaction, provide a direct YouTube watch fallback.
- **Iframe creation is not proof of successful streaming.**
- Google Drive backup is **disabled** until matching recording, authorization,
  privacy and public-reader access are independently verified.
- Do NOT upload raw/private video files into public GitHub by default.
- If a story has a full approved article, show it visibly under the player on
  mobile (not hidden behind watch/read tabs); on desktop use a comfortable,
  section-appropriate adjacent reader. Link approved chapter timestamps.
- Only claim translations actually approved. A translated menu does not mean
  the article is translated.

### Article, story, book, research and business copy

- Keep owner-approved editorial source and factual citations.
- Preserve original language and source text unless the owner requests editing.
- Metadata, captions, share cards, SEO, original image credits and route slugs
  must agree with the actual content. Avoid sensational or unverified claims.
- For commerce/business do not invent costs, stock, hotels, availability or legal claims.

## 4. Review → publication → verification

1. Fetch the current HEAD of `main`.
2. Create an isolated `feature/...` review branch.
3. Modify only necessary component(s) and data, preserving existing routes.
4. Add targeted automated tests for the content type and language states.
5. Run `scripts/verify_site.py`, registry check, JS syntax, and desktop/mobile
   browser checks where available.
6. Show preview and diff; request owner approval.
7. Only when **publication is explicitly authorized**, merge PR to `main`.
8. Check both deployment and Pages build results against the merged SHA.
9. Open the *actual* public route when browser is available; report what was
   tested vs unverified, never claim a file is live from a successful merge alone.
10. Update release ledger/master and registries to the approved state.

Known reference: **Life After Sixty V1.2**, implemented via PR
https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/pull/14,
then deployed in commit `b6d3949f2596c9a54c87addbe264789b78986f07`.
This is a **pattern**, not a template to paste into unrelated layouts.

## 5. Independent archive permission — mandatory

After final content approval, ask exactly:
**«هل تود نسخ النسخة النهائية المعتمدة إلى Google Drive؟»**

If **yes**, inspect actual folders in the connected owner account and let the
owner explicitly choose destination. If **no**, do not upload. Never replace,
rename, move, delete, change sharing or publish private Drive files silently.

After destination is chosen:
- Package correct source documents/media references (and originals *only* when
  explicitly authorized and included), implementation, final screenshots,
  test report, release commit and manifest with version + checksums.
- Upload a new uniquely named archive, preserving existing files.
- Read the chosen folder again and confirm exact file ID, name, MIME type,
  file size and destination. Only then say archived and give direct Drive URL.

Historical **verified example only**, NOT default future destination:
`KARIM_AFTER_SIXTY_V1.2_APPROVED_2026-11-12.zip` in the owner-selected
`انجليزي / 02 - About Me / 02 - Life After Sixty` folder
(`1k0I1UUm9v5ugrBwEkBdJmEudx8zkgq6R`).
Original videos were NOT represented as included in that ZIP.

Existing About V2 additionally records an owner-selected canonical source
folder for About Me in `dist/data/about-master-v2.json`. Do not merge the
historical folder and this newer authoritative source folder or relocate
either without an owner-approved archival migration.

## 6. Master change / decision ledger

Every approved site change records:
- date, section, page ID, language and before/after URLs;
- exact source docs and media IDs, their approval/rights status;
- altered code/data files, GitHub branch, commit, PR, tests;
- publication approval, deploy SHA and live verification outcome;
- archive consent, chosen folder, final file URL and readback confirmation;
- unresolved issues and rollback route.

Human-readable ledger: [KARIM_SAAB_WEBSITE_CHANGELOG.md](KARIM_SAAB_WEBSITE_CHANGELOG.md).
The registries track source/route/media state automatically, but **approval,
real-world footage truth, live playback and archival verification are human
review records**, not values to infer from filenames.

Update this master when workflow, source architecture, domain, link map,
security requirements or important owner decisions change. Do not append
a full new Word copy for every minor editorial tweak.

## 7. Security and limitations

- No GitHub repository or workflow should receive Drive credentials in source.
  Use secrets only within strictly approved read-only staging pipelines.
- Do not publish archives with private originals, customer information, account
  tokens or private Google Docs contents.
- Do not turn a Drive item into public-reader access automatically.
- No continuous automatic Drive-to-Pages publishing is authorized by this document.
- No automatic overwrite/delete on Drive. No main-branch merges without permission.
- No fabricated translation, trip experience, video approval, public performance
  result or archival status.

## 8. HOW TO RESUME KARIM SAAB WEBSITE DEVELOPMENT

For a new assistant, developer or future chat:
1. Read THIS file, source reference `KARIM_SAAB_WEBSITE_MASTER_REFERENCE_2026-10-30.docx`,
   registry report and latest changelog.
2. Fetch current `main` and open PRs. Compare against the master version;
   GitHub may have advanced since the document was saved.
3. Inspect the exact requested URL in [page_registry.json](registry/page_registry.json),
   its source files, connected media from [media_registry.json](registry/media_registry.json),
   and rights/translation status.
4. Read actual original content/owner approvals and verify live conditions where
   possible. Ask only about essential missing or conflicting information.
5. Implement on review branch → run tests → preview → receive explicit publish
   authorization → deploy/verify → request separate archive permission/destination.
6. Rebuild registries, update changelog and master for any accepted architectural
   change. If a Google Drive master snapshot is requested, create a new numbered
   DOCX only after approval, then verify upload to owner-selected folder.
7. Do not start from scratch, overwrite historic master, or confuse a Google Drive
   file's existence with authorization to embed it publicly.

**KARIM AI — Think • Explore • Create • Share**
