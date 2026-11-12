# KARIM SAAB — Arabic/English Article Publication Policy
## سياسة النشر الثنائي اللغة — 12 November 2026

**Owner instruction (adopted):** Every article or update published in the Arabic section must receive a complete, polished, editorially faithful English version in its matching English route. This applies to all future article sections on the personal KARIM SAAB website. It does **not** mix the separate AL SAAB PROJECTS GROUP or WASHI GROUP repositories.

### Authoring and review
1. Keep Arabic as the source of truth; do not silently rewrite its meaning or add claims in translation.
2. For every Arabic article creation or edit, prepare or update the English **in the same change**. Translate the title, summary, all body paragraphs, pull quotes, chapter headings, bullets, conclusion, closing text, and SEO fields.
3. English must be idiomatic, polished and culturally sensitive. Preserve quotations, religious references, names, dates, measurements and linked sources accurately.
4. The `/ar/` page displays Arabic with `lang=ar dir=rtl`. The `/en/` page displays English with `lang=en dir=ltr`. Never substitute Arabic body text into the English route.
5. Ensure changes pass automated language-completeness checks and browser/layout tests on a **review branch**. The checks prevent incomplete publication but do **not** machine-translate content by themselves.
6. The owner reviews and approves the English rendering. No automatic merge or publication without approval.
7. When approved, change `english_translation_status` to `approved` for Drive-imported `APPROVED` articles, run tests, and merge only with owner authorization.

### Life After Sixty implementation (current review branch)
- Record: `dist/data/after-sixty.json`.
- Arabic body remains in `intro`, `pull_quote`, `chapters[].paragraphs`, `chapters[].bullets`, `conclusion.paragraphs`, `closing_message`.
- English companion fields: `intro_en`, `pull_quote_en`, `chapters[].paragraphs_en`, `chapters[].bullets_en`, `conclusion.paragraphs_en`, `closing_message_en`; translated titles and summaries use existing `*_en` fields.
- `english_translation_source_checksum` is an editorial *freshness* checksum, not a security hash. It is computed from all Arabic article text using `arabic_source_checksum()` in `scripts/after_sixty_drive_sync.py`. An Arabic text edit invalidates the checksum until English is reviewed and updated.
- Validation: `tests/test_after_sixty.py` and `scripts/after_sixty_drive_sync.py`; English browser view: `dist/after-sixty-v1.js`. Browser visual test: `scripts/after_sixty_visual_check.py`.
- The current English translation for `sixty-is-not-a-waiting-room` is a **draft awaiting the owner's editorial review**, not an already-approved translation.
- When English text is absent or incomplete, the public English route must display an English-language unavailability notice rather than the Arabic body.

### Future automation — not yet enabled
Real automatic English **draft generation** from new Google Drive Arabic content requires a configured translation/AI provider, appropriate permissions, quality checks, and a review workflow. GitHub Actions currently checks/parses content but does not provide an authenticated translation model. Do not claim that this pipeline generates English automatically until it is deployed and verified. Do not expose credentials in the repository.

### Verification after owner approval
- `python -m unittest discover -s tests -p 'test_after_sixty.py' -v`
- `node --check dist/after-sixty-v1.js`
- `python scripts/verify_site.py`
- Visual check in `/dist/index.html#/en/about/after-sixty/sixty-is-not-a-waiting-room`, including LTR and full English body.
- Verify production URL separately after an approved deploy.

**Scope:** personal site `alsaabb/KARIM-SAAB-WEB-LAB`, not group site `alsaabprojects/alsaab`.
