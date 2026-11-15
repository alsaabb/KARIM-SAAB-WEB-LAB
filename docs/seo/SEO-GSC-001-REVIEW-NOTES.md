# SEO-GSC-001 — Release and Search Console handoff

This change is **review only**: owner approval is required before merging or publishing.

## Verified on 2026-11-15
- The five currently published URLs were HTTP 200 without redirects from a GitHub-hosted public HTTPS runner. XML Content-Type: application/xml; pages: text/html; charset=utf-8.
- Proposed /dist/ canonical and proposed sitemap: 421 unique URLs and 0 fragments.
- 426 generated bilingual share HTML pages, 8 source-expanded articles, 6 intentional noindex aliases.
- 411 short indexable documents still require authentic owner-approved prose; see SEO-GSC-001-SOURCE-AUDIT.md.
- VideoObject structured data exists but no verified upload dates are included. Google's video rich result eligibility is not guaranteed.
- The host root /robots.txt is outside the project repository's control.
- Previous Search Console results showed “Couldn't fetch” the sitemap; no claim of repair without post-deployment evidence.

## Only after explicit approval, merge, and successful GitHub Pages deployment
1. Select the Search Console URL-prefix property: https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/
2. Inspect https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/ using Live Test; if eligible, request indexing once, then monitor Google's chosen canonical after another crawl.
3. Inspect https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/share/ar/home.html using Live Test; request indexing once if appropriate.
4. In Sitemaps, submit the existing https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/sitemap.xml exactly once after deployment; do not re-submit it repeatedly. Check the exact status, last read, and discovered page counts after processing.
5. Do not equate URL inspection eligibility, sitemap submission success, or a valid XML file with confirmed indexing.

Protected main branch and published site must not be changed by this draft PR.
