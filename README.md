# KARIM SAAB — Website V10

Live website: https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/

This repository contains the public bilingual KARIM SAAB site and its GitHub Pages deployment. The `main` branch is the release source. The root `index.html` redirects visitors to `dist/index.html`. The `dist/` directory contains the published app, share/SEO pages, styling and public assets.

## Release and safe development

1. Work on a new branch, not directly on `main`.
2. Review the changed file list and check that existing V10 content is preserved.
3. Run `python3 scripts/verify_site.py` to check routing, the sitemap, bilingual share pages, and the KARIM AI link.
4. Merge a pull request after reviewing the changes; verify GitHub Pages deployment succeeded.
5. Git history and previous merge commits allow recovery. Do not force-push or delete old versions without approval.

## Search indexing and KARIM AI

- Published sitemap: https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/sitemap.xml
- The sitemap contains public Arabic/English share pages; search indexing still depends on crawlers and any Search Console submission.
- KARIM AI is a separately hosted application: https://karim-ai-virtual-assistant.ai.studio
- The website's floating assistant link is styled in `dist/ks-ai-link-v10.css`. Its AR/EN accessibility labels are managed in `dist/ks-ai-link-v10.js`.

## Visibility and privacy

**This repository is public.** Files under `dist/assets/books/` are publicly reachable, including existing PDF book assets. Repository privacy changes can affect the website. Obtain an explicit owner decision before removing, restricting, or replacing any published book or asset.

The automated checks are read-only. They do not test every visual interaction, media playback, or search-indexing result. Review mobile layouts and videos manually after release.
