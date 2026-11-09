# KARIM SAAB — Google Drive content sync (staging only)

**Status: staging prototype, NOT connected to production and NOT yet authorized to publish.**

The user-approved goal is to edit approved Arabic/English content in Google Drive and later deploy it automatically to GitHub Pages without using ChatGPT each time. This branch **does not publish** anything and **does not update the main branch**.

## Real Drive folder map (account: alsaabb@gmail.com)

| Type | Arabic (folder ID) | English (folder ID) |
| --- | --- | --- |
| Press interviews | 1kKfWm-YT6DvJNuYb9U3RwJ4tE2XrTJVX | 19HLnIs-Bza3NQMSff_EddfCY9gf8xB2p |
| Articles (future) | 1Y-z9WdJqsMeF2oJqq1I3zP2UY7k0mCo9 | 19n_1m_L5c6qQdfNgCPwh-KJoPDLDVzEt |
| Videos (future) | 1E2-qO4bp-eecnAYgLuyy0bprppP-CDhS | 1hA2scdLvQFxnZa5gb02i6ec6i4H7H_ZN |

These are **working copies** of the organizational structure; they are not currently a live CMS. Current press content folders may be empty.

## One article = one editable Google Doc

Create a native Google Doc in the Arabic or English press-interviews folder. The document should contain header lines, an exact line containing ---BODY---, then the whole article:

    id: PRESS-2009-001
    status: draft
    title: [verified original headline]
    publisher: [verified publication name]
    published_date: YYYY-MM-DD
    source_url: https://[original-public-article-link]
    logo_url: https://[publicly-authorized-image-url]
    image_url: https://[publicly-authorized-scan-url]
    rights_cleared: no
    summary: [confirmed 160-character summary]
    hashtags: #عبدالكريم_الصعب #KARIM_SAAB
    ---BODY---
    [verified full text, without invented material]

**Do not use the example values as an actual published press article.** Replace with verified original material. Use the same stable ID for the Arabic and English versions; translate only when a checked translation is approved. A missing English version does not authorize auto-translation.

Set status to approved **only when content, factual accuracy, publication rights and image usage are authorized**. Draft documents are excluded automatically. If either logo_url or image_url is present, rights_cleared must be yes. Private Drive links are not appropriate as public image URLs.

## Testing offline, no credentials

    python3 -m unittest discover -s tests -p 'test_drive_sync_preview.py' -v
    python3 scripts/drive_sync_preview.py --mode fixture --out staging/drive-preview

This outputs **staging/drive-preview/ar/demo-001.html**, **staging/drive-preview/en/demo-001.html** and a JSON manifest. Pages are marked noindex and clearly labeled *unpublished staging*. The push-only GitHub Action on this branch uploads them as an artifact. The example is fictitious, not a real newspaper interview.

## Live read-only Drive test: security prerequisites

1. Create or identify a **dedicated, least-privilege Google Cloud service account**, enable Google Drive API and share **only** the intended content folders with its email as Viewer. Do not share the entire Drive.
2. Store its JSON **only** in GitHub Actions Secret GOOGLE_DRIVE_SERVICE_ACCOUNT_JSON (never commit, paste into chat or expose in logs). Prefer Workload Identity Federation/OIDC over static JSON service-account keys for the production setup, where feasible.
3. Install dependencies in a **trusted staging job** only: pip install google-auth requests.
4. Run the script with environment credentials and --mode drive; review generated HTML and manifest. It **reads** Google Docs/plain text only, skips DOCX/PDF/images, limits to 100 records per language, and writes only under staging/.
5. Use a single harmless approved test Doc in one folder as a first connection test; verify the preview artifact and ensure drafts were ignored. **Do not enable scheduled publishing yet.**

    python3 scripts/drive_sync_preview.py --mode drive --out staging/drive-preview

## Before any production publishing

- Require a successful authenticated read-only test, with rights and source verification.
- Replace test-only pages with reviewed AR/EN templates and SEO/canonical/hreflang/sitemap updates.
- Decide how to safely publish images/video (size caps, licenses, no private Drive URLs).
- Run the existing site verifier and an isolated preview with a rollback plan.
- Add a separate, least-privilege deployment workflow, GitHub Environments and scheduled trigger (for example hourly), with explicit safeguards, logging, idempotency and no deletion of previous assets. **This is not yet implemented.**
- A complete PR must pass checks and receive owner approval before changing main. Do not expose service account credentials in any public repository file.

## Expected boundaries

Google Drive has content; GitHub Pages has the public site. A copy or folder shortcut **does not** sync content automatically. A GitHub backup to Drive is a separate one-way operation. This prototype prepares the reading/conversion side only and intentionally cannot modify the live website.
