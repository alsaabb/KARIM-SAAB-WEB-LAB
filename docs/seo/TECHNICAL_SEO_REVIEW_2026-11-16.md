# KARIM SAAB — Technical SEO Verification Memo (2026-11-16)

**Repository:** `alsaabb/KARIM-SAAB-WEB-LAB`  
**Reference production SHA:** `c26edff15af22f9a783f2fb79d5249f2d7b67265`  
**Scope:** `dist/index.html`, `dist/sitemap.xml`, `dist/robots.txt`.  
**Change policy:** Review branch only; no changes to production files unless a specific defect is confirmed.

## Findings

| Check | Observed result | Action |
| --- | --- | --- |
| `dist/index.html` canonical link in `<head>` | Present: `https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/` | Preserve. |
| `hreflang=ar` | Present: `dist/share/ar/home.html` as an absolute public URL; matching file exists. | Preserve. |
| `hreflang=en` | Present: `dist/share/en/home.html` as an absolute public URL; matching file exists. | Preserve. |
| `hreflang=x-default` | Present: canonical `dist/` homepage URL. | Preserve. |
| `dist/sitemap.xml` | XML parses successfully; **425** distinct HTTPS `<loc>` entries; first URL is canonical `dist/`. | Preserve. |
| `dist/robots.txt` | `User-agent: *`, `Allow: /`, and absolute sitemap URL are present. | Preserve content. |

### Requested `dist/index.html` versus existing `dist/` canonical

The request included putting `https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/index.html` **first** in the sitemap. This path and `dist/` resolve to the same homepage, but the existing canonical and first sitemap URL are consistently `dist/`. Adding the `index.html` alias as a second preferred URL, or changing only the sitemap first entry, would create inconsistent canonical signals. **Decision: retain the canonical `dist/` as the first sitemap entry and do not add the index alias.** The actual HTML file remains `dist/index.html`, unchanged.

### Robots path caveat

`dist/robots.txt` is correct as a file, but robots directives are normally discovered at the **origin root** (`https://alsaabb.github.io/robots.txt`), not automatically from a project's `/KARIM-SAAB-WEB-LAB/dist/` subpath. A project-site repository cannot assume control over the origin-wide robots file. Accordingly, this verification **does not certify** that crawlers use the nested robots file. Do not overwrite or change any other site on that shared origin to work around this. The sitemap is still directly accessible by its documented URL.

## Automated validation on the reference checkout

- XML parser: **PASS** (425 sitemap URLs, no duplicates).
- `python3 scripts/verify_site.py`: **PASS**.
- `python3 scripts/verify_identity.py`: **PASS**.
- `python3 scripts/build_site_master_registry.py --check`: **PASS**.
- `python3 scripts/build_seo_share.py --check`: **PASS**.
- `python3 scripts/verify_seo_gsc_001.py`: **PASS**.
- `python3 scripts/qa_gate.py`: **PASS**.
- `python3 scripts/build_css_bundle.py --check`: *not run successfully in the independent local environment because optional pinned `csscompressor==0.9.5` was not installed*. This is not evidence of a repository build failure; the GitHub `qa` job installs it and will be checked on the PR.

**Existing editorial backlog:** `verify_seo_gsc_001.py` reports **411** short indexable bilingual share pages requiring editorial source review. This is a content-quality backlog, not missing sitemap, canonical or hreflang markup. No mass page rewrite or unapproved indexing changes are included in this PR.

## Verification limits

A structurally valid sitemap, metadata and robots content **do not guarantee** search-index inclusion, Google ranking, site ownership, or absence of canonicalization issues in a live crawler. Those require Search Console inspection and external validation. The PR checks validate code/structure only.

**No changes to the public site** are proposed by this memo.
