# KARIM SAAB — Website V10

Live website: https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/

This repository contains the public bilingual KARIM SAAB site and its GitHub Pages deployment. The `main` branch is the release source. The root `index.html` redirects visitors to `dist/index.html`. The `dist/` directory contains the published app, share/SEO pages, styling and public assets.

**Owner-approved engineering governance:** [docs/ENGINEERING_GOVERNANCE.md](docs/ENGINEERING_GOVERNANCE.md) — all security, bilingual SEO, performance, QA and PR/release decisions. Coding agents also follow [AGENTS.md](AGENTS.md). Changes must be proposed on a review branch and only merged after an **explicit owner instruction for that PR**. Static PR approvals are not permission to deploy.

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

## Universal website master — all URLs and media

- **Operational master:** [docs/KARIM_SAAB_WEBSITE_MASTER.md](docs/KARIM_SAAB_WEBSITE_MASTER.md)
- **Page Registry:** [docs/registry/page_registry.json](docs/registry/page_registry.json)
- **Media Registry:** [docs/registry/media_registry.json](docs/registry/media_registry.json)
- **Audit report:** [docs/registry/INVENTORY_REPORT.md](docs/registry/INVENTORY_REPORT.md)
- **Owner-approved decisions:** [docs/KARIM_SAAB_WEBSITE_CHANGELOG.md](docs/KARIM_SAAB_WEBSITE_CHANGELOG.md)

The registry inventories all discovered AR/EN public share links, existing library
routes and referenced local assets. It does **not** certify live playback,
owner rights, public Drive permissions, or translation approval.

Update content sources on a review branch and then run:
```sh
python3 scripts/build_site_master_registry.py --write
python3 scripts/build_site_master_registry.py --check
python3 -m unittest discover -s tests -p 'test_site_master_registry.py' -v
```

The main/PR validation workflow enforces registry freshness before publishing.
Publication and Drive archival require separate owner approval and destination
selection; do not publish private Drive originals or overwrite old archives.


## Development tools and external service attribution

For the **current GitHub Pages site**, see the [development tools and automation register](docs/TECH_STACK_AND_AUTOMATION_REGISTER_V01_2026-11-16.md) and [technical SEO verification memo](docs/seo/TECHNICAL_SEO_REVIEW_2026-11-16.md). These documents explicitly distinguish proven integrations, owner-described contributions, and historical platforms.

- **Google Gemini:** owner-reported technical/SEO consultation and implementation-instruction drafting; not independently established as a GitHub editor or a site runtime dependency.
- **Windsor.ai:** connected Google Search Console property `https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/` verified from the authorized Windsor.ai integration; search-performance metrics have not been audited in this documentation update.
- **Google Vids:** owner-reported support for creating/organizing video materials; individual source-video provenance remains unverified.

This register supplements — and does not replace — the documented GitHub Actions, Google Drive staging, GitHub Pages, YouTube, map, testing, and deployment services. It does not grant any service additional account access. The canonical homepage and first sitemap URL remain `https://alsaabb.github.io/KARIM-SAAB-WEB-LAB/dist/`; the alternate `dist/index.html` URL is not introduced as a duplicate preferred sitemap entry.

**Do not merge or deploy this branch without the owner's explicit approval for this specific PR.**
