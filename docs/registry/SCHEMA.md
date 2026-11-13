# Page and Media Registry contract

These JSON files are **generated source inventories**, not a website CMS or an authorization to publish.

- page_registry.json: one record per distinct discovered hash route, including Arabic and English share URLs, source files, canonical share-page mapping (when present), route-based stable cross-reference ID, editorial status and aliases.
- media_registry.json: public repository media files plus YouTube IDs from current structured episode sources. Each file/video has a media ID and known usage routes, not an assumption of authorship or approval.
- INVENTORY_REPORT.md: generated totals, known missing local asset references and explicit limitations.

Regenerate with:

    python3 scripts/build_site_master_registry.py --write
    python3 scripts/build_site_master_registry.py --check

Do not hand-edit the generated files. Add/adjust actual content sources, run generator, inspect diff, update the living master change log, then open a review PR.

Page identity: stable 16-character SHA256 prefix of "route:" plus hash route. This is a technical cross-reference, not a replacement for existing Drive/editorial IDs. No source IDs or URLs are silently deleted.

Metadata policy: "file_present" means a file exists in public assets, not that its image depicts an authentic event or its rights are cleared. "source present" does not mean translated or published. "not_verified" fields are deliberate.

The audit captures all share HTML in dist/share/ar and dist/share/en (including noindex aliases), all content.js library keys, About V2 routes, two documented article-video modules, and all media files physically under dist/assets. It does not promise exhaustive discovery of dynamic route patterns, CSS background images, external videos mentioned only in JavaScript strings, or real-browser URL health. Review those manually and extend the source scanners safely as new formats are added.
