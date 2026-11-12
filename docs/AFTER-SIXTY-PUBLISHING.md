# KARIM SAAB — الحياة بعد الستين / Life After Sixty

## Scope
This is an additive, bilingual **review-branch** implementation, not a production release.
The official section is inside the existing hash-router:
- Arabic: `/dist/index.html#/ar/about/after-sixty`
- Episode: `/dist/index.html#/ar/about/after-sixty/sixty-is-not-a-waiting-room`
- English: `/dist/index.html#/en/about/after-sixty`

The data source is `dist/data/after-sixty.json`. Every new episode is a JSON entry; no per-episode UI code is needed. The index derives its episode count directly from this file.

The UI is isolated under `.ks60`, with a 40/60 video/article desktop layout, mobile video/article tabs, search, category filters, timestamps that scroll to article sections, article play buttons that seek the YouTube player, and a Drive video switch **only after verified public viewing access**.

Static Open Graph/Twitter/Article + VideoObject pages are created in `dist/share/ar` and `dist/share/en`, and included in `dist/sitemap.xml`. Share the **static share URL**, not a hash URL, for reliable social previews.

## Episode 01 — important editorial hold
The user-provided full article was **truncated** at "السعادة قرار". The site data sets `article_complete: false` and retains this exact fragment; the site visibly labels it as incomplete. The first episode metadata, video ID, excerpt and three timestamps are present, but **do not approve merging to main as a final publication until the full ending is supplied and reviewed**.

The Arabic full article is author-supplied; no invented remainder or English full translation has been inserted. The English list excerpt is provisional summary copy requiring editorial approval. Verify the YouTube video and actual timestamps before release.

## Google Drive — editorial directory policy

There are several similarly named Drive folders. The existing site's `about-drive-source-v1.js` references a section folder **1GWkqEfxvWEBG4vZ1HVnbz7h9tGa2BG3I**. Do not assume that is the desired publishing destination without owner confirmation. We have **not** created or moved Drive files.

Proposed folder contents (after owner selects destination):

```text
After Sixty (owner-confirmed Drive folder)
└── 01 - الستين ليست محطة انتظار
    ├── المقال المعتمد   [native Google Doc]
    ├── episode.json    [approved structured metadata + full article]
    └── backup.mp4      [the verified matching video]
```

Every `episode.json` must include:
- `approval_status: "APPROVED"`
- `metadata_approved: true`
- `article_complete: true`
- required fields corresponding to the central `after-sixty.json` episode record
- matching Arabic title, first article paragraph and chapter headings in the native Google Doc
- a backup video file in that same folder.

The Drive sync reads only, never edits the original Drive folder, never downloads original videos into the public repository, and does not publish unapproved content.

The backup player requires `fallback_same_video_approved: true` after the owner confirms the Drive file is the same recording, plus `anyone` reading permission. Automatic video matching is not claimed. If private, it is retained in Drive but the backup button stays disabled; do **not** make private footage public automatically.

## Review-first sync procedure
1. Owner confirms the intended Drive folder and populates the approved episode folders.
2. Repository administrator configures GitHub Actions secrets:
   - `GDRIVE_SERVICE_ACCOUNT_KEY`: JSON credential for a read-only Drive service account
   - `AFTER_SIXTY_DRIVE_FOLDER_ID`: *owner-confirmed* section folder ID.
   Share only that folder with the service account for read access.
3. After this workflow itself has been approved and merged, run **Actions → After Sixty — preview approved Drive episodes → Run workflow** manually.
4. The action calls `scripts/after_sixty_drive_sync.py --write` and `scripts/build_after_sixty_share.py`, then site + identity + unit tests. It pushes a **unique `sync/after-sixty-drive-<run_id>` branch**, and opens a Pull Request to `main` only if there are changes.
5. Review the PR and approve merging/publishing separately. Main deployments already run on pushes to `main`.

**Important:** The repository also has an unrelated six-hour `drive-sync.yml` job that can publish other approved Drive content directly to `main`. Do not put a generic `github_path: dist/data/after-sixty.json` approval on Drive files managed by this review-only system, or that general job could bypass review. A safety guard is implemented in `scripts/sync_drive_to_github.py` on this review branch so this collection cannot bypass manual review via the general scheduled publisher.

## Validation and maintenance
- `node --check dist/after-sixty-v1.js`
- `python -m unittest discover -s tests -p 'test_after_sixty.py' -v`
- `python scripts/verify_site.py`
- `python scripts/verify_identity.py`
- `python scripts/build_after_sixty_share.py` (updates only this collection's static share pages and adds missing sitemap links; run on a review branch)

No existing GitHub or Drive content is deleted by this feature. No automatic public deployment is triggered by the manual preview sync action.
