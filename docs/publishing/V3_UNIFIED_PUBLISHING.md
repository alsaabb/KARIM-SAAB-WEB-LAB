# KARIM SAAB — Unified Publishing V3.0

**Status: implemented on a review branch — not yet merged or deployed.**  
Scope: bilingual documentary video-and-article stories in *Stories from the Road*. Other content types retain their existing approved templates.

## Purpose
V2.0 involved repeated hand-built scripts and repair rounds. V3.0 uses **one manifest and one command interface** for content preflight, paired language-page generation, SEO and registry updates, and checks. Reuses existing site templates and nine-platform sharing.

## Commands and behavior
- **plan** — read-only: validates owner approval, full Arabic and English texts, YouTube ID and URL, distinct approved WebP posters and SHA-256 hashes, image size limits, honest illustration disclosure, duplicate routes and IDs.
- **prepare** — review branch only: generates a public story record, Arabic and English static article/share pages, sitemap entries, and public registry entry. Then runs the existing SEO share and site master registry generators once. Repeated identical input is a no-op. Changes to previously created versions are blocked.
- **check --fast** — validates SEO, master registry, site route/metadata, and QA.
- **check** — additionally runs CSS, identity, full Python tests and JavaScript syntax.
- The generic browser renderer at dist/story-publisher-v3.js uses approved text, language-specific poster, click-to-load vertical YouTube player, story card and existing nine-network share toolbar.

**Security boundary:** The command does NOT create or merge a Pull Request, deploy Pages, upload to YouTube, change Drive permissions, or archive to Drive. These actions require the documented release permissions and live verification. No owner Drive folder IDs, private sources, or secrets belong in publicly versioned files.

## Required manifest fields
Supply JSON outside the public repository:
- schema_version = "3.0"; editorial_approved = true (only after actual approval); version = "V01", "V02" etc.
- route = "story/<safe-slug>"; youtube_id (11 characters); matching HTTPS youtube_url
- title_ar and title_en; seo_title_ar and seo_title_en; description_ar and description_en
- article_ar and article_en: full original texts starting with their exact titles
- poster_asset_ar and poster_asset_en: different WebP files within dist/assets; poster_sha256_ar/en; actual poster_width/height
- poster_kind: original_photo, ai_illustration or verified_youtube_still
- poster_note_ar and poster_note_en: disclose AI illustration clearly if used
- tags: approved tags

Keep originals in authorized private archival storage. Every public WebP must be <=250KiB; filenames and previous versions must be preserved.

## Runbook

    # Run inside a review branch, not main
    git switch -c review/<new-story-slug>
    python3 scripts/publish_v3.py plan --manifest /private/approved-story.json
    python3 scripts/publish_v3.py prepare --manifest /private/approved-story.json
    python3 scripts/publish_v3.py check --fast
    python3 scripts/publish_v3.py check

Inspect the generated diff, then open a **Draft PR** to main. Require passing GitHub Actions and browser testing of **Arabic and English at 390px and 1440px**: complete verbatim article, proper image, no duplicate share panels, nine platform controls, fallback link, language switch, and click-to-load 9:16 iframe.

Only after the owner explicitly authorizes the exact PR merge may it be published. Verify **actual public HTTP pages**. After success, use owner-approved Drive destinations externally, archive both full articles and approved original/optimized covers without overwriting older files, save commit and PR identifiers, verify uploaded files and send direct links.

## Time and error savings
- Validate image availability, source accuracy and duplicate video ID before a PR.
- Regenerate Sitemap, SEO, registry files before CI, not as repeated patches after failure.
- Compare approved article text dynamically, never hard-code a previous story closing sentence.
- Replay identical preparation safely, and retry only failed stages.
- Run independent tests in parallel, but always run the full release gate.
- Do not falsely equate a YouTube link, lazy iframe, actual playback, public HTTP, or Google indexing.
- Preserve accurate states READY, BUILDING, TESTING, PUBLISHED, ARCHIVING, COMPLETE and BLOCKED.

## Known limitations
- The tool needs approved local public WebP assets; it does not fetch originals, transcode images or edit Drive.
- The generic renderer does not eliminate the requirement for browser checks of each new story.
- Automated PR creation, release handoff and Drive archival are not enabled. They require separately authorized least-privilege integration.
- This initial implementation covers documentary video/articles, not books or arbitrary site pages.

**KARIM AI — Think • Explore • Create • Share**
