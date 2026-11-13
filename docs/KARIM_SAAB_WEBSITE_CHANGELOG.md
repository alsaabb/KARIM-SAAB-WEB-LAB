# KARIM SAAB — WEBSITE MASTER CHANGELOG / سجل الماستر

## 2026-11-13 — «مواجهة في الظلام… الخنزير البري في اليونان» (source-approved publishing request)

- **Author-approved sources:** the existing Arabic and English Google Docs in the
  Google Drive `🔴 03 - مغامراتي / 🟢 02 - حكايات من الطريق / 01 - مواجهة في الظلام - الخنزير البري في اليونان`
  project folder (source document names: "01 - مواجهة في الظلام — المقال العربي (معتمد)"
  and "02 - Encounter in the Dark — English Article (Approved)").
- **Video:** owner-document confirmed YouTube Shorts ID `SVdg9IxoS4k`,
  https://www.youtube.com/shorts/SVdg9IxoS4k — portrait 9:16.
- **Browser routes:** `#/ar/story/wild-boar-greece` and `#/en/story/wild-boar-greece`;
  story appears in both languages' `stories-road` index.
- **Article source in website:** `dist/data/stories-road-v1.json`, with the original full
  Arabic and English approved paragraphs and hashtags, not AI rewrites.
- **Public video UI:** YouTube embed activated only by click, direct YouTube fallback;
  YouTube thumbnail with an editorial fallback design where thumbnail servers are blocked.
- **Original owner poster:** remains untouched in the selected Drive folder. It is not
  embedded via an unverified public Drive URL and should not be described as a
  documentary photograph of the incident.
- **Share/SEO:** bilingual static `dist/share/{ar,en}/story-wild-boar-greece.html` pages,
  structured metadata and sitemap. No existing share URL deleted.
- **Master inventory:** auto-generated Page Registry and Media Registry record the new route
  and `youtube:SVdg9IxoS4k` without leaking original Google Drive IDs.
- **Publishing consent and release:** owner explicitly requested public publication.
  GitHub PR #33 merged as commit `4c9da45dcef9722ee77dc85a9ea9c5baca25fad4`.
  Site validation passed (Actions 43433583023), and both GitHub Pages deployment
  and Pages build succeeded (Actions 43433583026 and 43433582054).
  Independent third-party browser streaming of the YouTube video remains unverified.
- **Drive archive:** this GitHub site publication is *not* a new archival upload.
  Owner's separate Google Drive archive selection is still required for any new ZIP/DOCX.
- **Rollback:** revert the story feature merge commit; do not delete approved originals.


## 2026-11-13 — Unified site-wide media protocol, V1.0 (APPROVED AND RELEASED)

- Starting point: public GitHub repository main at SHA 7a72f5e1f297230cc67d8c33a6a0219f4d42b336.
- Source reference: historical KARIM_SAAB_WEBSITE_MASTER_REFERENCE_2026-10-30.docx (not overwritten).
- Audit found 80 records in dist/content.js; dist/data/about-master-v2.json has 23 About entries.
- dist/sitemap.xml contains 418 URLs spanning AR and EN (sitemap presence is not live testing).
- New inventory generator scans the existing share pages, content library, About data,
  After Sixty and Happiness video modules, and local public site assets.
- New master documents the standardized image/video/article intake, independent
  authorization for publication and Drive archive, privacy rules, and resumption procedure.
- New test and review-only GitHub workflow keep registers reproducible.
- **Actual completed inventory:** 218 distinct routes; 424 share HTML files; 418 sitemap URLs;
  45 local public assets; 3 structured video IDs. No missing scanned local assets.
  The repository validation will now check registry freshness on subsequent PR/main runs.
- Verification: https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/actions/runs/43405870494
- **Approved and merged:** GitHub PR #31, release commit `316ca69c395e9e9be9596a19194faf6cecac3ea1`.
- **GitHub Actions confirmed successful:** site validation run 43407360142; GitHub Pages deployment run 43407360255; Pages build run 43407360192.
- No changes to rendered site files or original media. Public URL browser reachability and real-video playback have not been independently confirmed by this audit.
- **Not archived separately in Google Drive:** optional master DOCX archival requires separate owner consent and choice of actual folder. No Drive file was uploaded or sharing permission changed by this release.

## Verified previous historical milestones

- 2026-10-30: original master reference recorded an earlier hosting URL and Drive-tree
  conventions, and cautioned that site/links needed independent verification.
- 2026-11-12: After Sixty V1.2 approved; archive ZIP uploaded and verified at
  https://drive.google.com/file/d/1zFzFYqxTAi7EXVztM93bF38PWYrcua5n/view
  in owner-selected folder 1k0I1UUm9v5ugrBwEkBdJmEudx8zkgq6R.
- After Sixty PR #14 was merged and the GitHub Pages deployment at SHA
  b6d3949f2596c9a54c87addbe264789b78986f07 passed its Actions deployment jobs.
  That is not proof of real-device YouTube playback.
- 2026-11-13: About V2 source master exists, with more recent canonical folder information;
  its metadata supersedes historical assumptions for the About editorial process, without
  moving or modifying any historical folder or Drive file.

## Template for every future owner-approved change

Date | page_id / route / language | requested content | source/rights confirmation |
GitHub PR and commit | preview/test results | explicit publish approval and deployment SHA |
real-site verification | archive consent / chosen folder / verified Drive file URL |
outstanding limitations / rollback.

Keep this file chronological. Do not mark a draft as published.
