# KARIM SAAB — Development Tools, Service Attribution & Automation Register

**Audit date:** 2026-11-16  
**Target:** `alsaabb/KARIM-SAAB-WEB-LAB` (current GitHub Pages website only)  
**Reference release:** `c26edff15af22f9a783f2fb79d5249f2d7b67265`  
**Status:** Proposed documentation on review branch; no production change or deployment authorization.

## Newly identified services / الخدمات الثلاث

| Service | Owner-described contribution | Evidence level and limitations |
| --- | --- | --- |
| **Google Gemini** | Technical consultation, SEO review of sitemap / robots / canonical / hreflang, and drafting implementation instructions for ChatGPT and GitHub. | **Owner-reported.** Repository history does not independently establish which Gemini sessions or outputs were used. Not a runtime dependency; not proven to hold repository credentials or direct write permissions. |
| **Windsor.ai** | Monitoring Google Search Console search visibility and clicks for the live site. | **Connected integration verified:** Windsor.ai's connected `searchconsole` source lists property `https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/`. Actual metrics, reporting configuration and the historical scope of use were not audited here. This is an analytics/monitoring integration, not part of the site's publishing pipeline. |
| **Google Vids** | Supporting preparation and organization of videos later embedded in website articles/pages. | **Owner-reported.** No verifiable Google Vids editing history or public embed provenance was established from this repository. Do not claim all hosted videos were created in Google Vids. |

The entries above describe **contribution or integration**, not installed GitHub Apps. Record owner-reported activity separately from technically verified connections.

## Confirmed current-site development, hosting and oversight

| Service/tool | Verified role |
| --- | --- |
| ChatGPT and **ChatGPT Codex Connector** | Assisted development and content; GitHub App authorization used for branch/PR operations. GitHub access is governed by the owner's approvals and the active `main` ruleset. |
| **GitHub** and **GitHub Pages** | Source control and public site hosting, respectively. |
| **GitHub Actions** and `github-actions[bot]` | Validation, QA, review artifacts, code generation in workflow-specific contexts, archive generation, and deployment after a permitted `main` update. |
| **Google Drive** and **Google Docs** | Content reference library, approved input folder and separately approved archives (not public live-site dependencies by default). |
| **Google Cloud service account / Google Drive API / google-auth** | Read approved content into a **review-only** GitHub branch; a successful scan alone does not prove approved files were published or staged. |
| **Google AI Studio** | Separately hosted KARIM AI assistant linked from the website. |
| **YouTube** | Media links and click-to-play video presentation; verify specific content rights and playback independently. |
| **Google Search Console** | Search ownership/indexing service, with connected Windsor.ai search-console property as noted above. |
| **Leaflet, OpenStreetMap, CARTO** | Local map library and geographic tiles in the website. |
| **HTML / CSS / JavaScript**, **Python**, **Node.js / npm** | Main frontend and automated build/test scripts. |
| **Playwright / Chromium / jsdom / Python unittest / csscompressor** | Browser layout tests, DOM tests, unit tests and CSS bundle checks, as configured in GitHub Actions. |
| **GitHub Actions Artifacts** | Temporary QA screenshots and source archives; retention applies and is not permanent external backup. |

**Source evidence:** `README.md`, `.github/workflows/`, `scripts/`, `tests/`, and `dist/` in this repository, plus the authorized GitHub and Windsor.ai connection checks performed on 2026-11-16.

## Connected accounts and historic platforms — not automatically development contributors

- **GitHub Android** and **Visual Studio Code** appeared as authorized OAuth applications. Authorization alone does **not** prove that either built or changed the current site.
- **Google Sites** and a prior **ChatGPT Sites** website are historical references, not the current GitHub Pages deployment.
- **GoDaddy** is referenced in older owner documents, but current DNS/domain registration ownership is not independently verified.
- Social media, Google Flow and other creative tools may source media or promotion; do not assert direct code changes without provenance.
- The published source repository is public. Do not commit passwords, access tokens, service-account JSON, or non-public Google Drive folder links.

## Operational restrictions

1. Never push directly to, bypass, or auto-merge `main`; only propose a branch and PR. An explicit owner instruction is required for **each** merge.
2. The active GitHub ruleset `27353025` requires PR workflow and checks `site-sanity` and `qa`.
3. Do not alter the bilingual `#/ar/` and `#/en/` navigation or production appearance while updating this inventory.
4. Archival to Google Drive is a separate owner-approved action, with the destination selected in advance. Do not silently upload, overwrite or delete files.
5. Keep actual account permissions, data-flow configuration and integrations under periodic review; this register is not proof that every third-party service was accessed.

## SEO and synchronization companion records

- [SEO verification memo](seo/TECHNICAL_SEO_REVIEW_2026-11-16.md)
- [Original Drive staging issue #13](https://github.com/alsaabb/KARIM-SAAB-WEB-LAB/issues/13)
