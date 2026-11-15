# PR #39 — Google Docs / Drive link audit (2026-11-15)

This is a **public GitHub repository**. The \`docs/\` folder is not private storage; do not put tokens, passwords, service-account credentials, or private access links here.

## Restored published reading routes

| Library entry | Original source identifier | Public destination in \`dist/content.js\` | Verification |
|---|---|---|---|
| \`book-birth\` — The English Language and the Birth of the Prophet | Google Docs document \`1wxkg-dX3eOgYQDnyqh_a8OEo7oDWibR3WJ5pgtoEuSQ\` | \`https://docs.google.com/document/d/1wxkg-dX3eOgYQDnyqh_a8OEo7oDWibR3WJ5pgtoEuSQ/view\` | Google Drive metadata returned \`anyone:reader\`; the old editable-looking \`/edit\` URL was removed; local \`assets/books/prophet-english.pdf\` also remains for reading |
| \`book-shiel\` — Carrying Water on Water | Google Drive PDF \`1_fp3ny_JwPubgkgLR68ST07cB_gW67WD\` | \`https://drive.google.com/file/d/1_fp3ny_JwPubgkgLR68ST07cB_gW67WD/view\` | Google Drive metadata returned \`anyone:reader\`; existing /view route retained |
| \`book-english-origins\` — How Was English Born? | Google Drive PDF \`1xmYhXEfadZ0cczB2nZs7liWKz62K4Grl\` | \`https://drive.google.com/file/d/1xmYhXEfadZ0cczB2nZs7liWKz62K4Grl/view\` | Google Drive metadata returned \`anyone:reader\`; existing /view route retained |

## Additional checks

- Parsed the full \`window.KARIM_LIBRARY\` object in \`dist/content.js\`; **40 source links** had nonempty destinations, **0 blank**, and **0** javascript/data/about links.
- The originally blocked \`book-birth\` document's /edit link had been incorrectly replaced by a duplicate local-PDF URL in PR #39. Restored an explicitly labelled view-only URL after checking its reader permissions. The first independent PDF button remains local.
- The Google Drive metadata check confirms link-reader sharing settings; anonymous browser playback, geo-restrictions, and future permission changes are outside this static CI check.
- Do not infer that placing document IDs inside a public \`docs/\` directory makes them secret. Public reader IDs appearing in public-view URLs are intentional.

No Drive sharing settings were modified.
