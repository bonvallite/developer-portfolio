# Instructions for future contributors and code assistants

This repository is the **public JRV developer portfolio**, not a Peter Augustus Shopify theme.

For every portfolio UI, visual, CSS, diagram, component styling, favicon, or branding change:

1. **Before editing**, read [the maintained JRV Design System](docs/JRV_DESIGN_SYSTEM.md), `CHANGELOG.md`, relevant source, and existing inline comments. Confirm the target branch and publication status.
2. Use the `:root` palette in `app/globals.css`; the site's Obsidian, Electric Teal, and Ember colours and the permitted light-paper/editorial exceptions are documented in the guide.
3. In the **same change**, update `docs/JRV_DESIGN_SYSTEM.md` when tokens, usage, route exceptions, or brand rules change. Add a dated design-system history entry and update relevant source comments plus `CHANGELOG.md`.
4. Validate with project tests, public safety scan, TypeScript/build checks, and desktop/mobile browser QA for visual work. The palette unit test catches undocumented root token changes.
5. Keep PR #96 draft and production unchanged without explicit release approval. Do not restore retired original résumé files, introduce private client code, or disable consent protections.

Other work follows [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md) and [CONTRIBUTING.md](CONTRIBUTING.md). Peter Augustus Shopify theme changes instead follow the private `pa-theme-changelog`, exact theme ID, source documentation, and private GitHub backup process.

Use Australian English.
