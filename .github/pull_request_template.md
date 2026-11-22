## Change and reason

Describe the problem and resulting behaviour, including affected files or settings.

## Documentation

- [ ] Read the current changelog, linked archives where relevant, affected source and existing comments before editing.
- [ ] Updated affected inline documentation for current behaviour, purpose and dependencies; corrected outdated notes.
- [ ] Updated the changelog with date, target/environment, affected files, change, reason and actual validation.
- [ ] For formats without reliable comment support, documented settings in the changelog and nearest relevant source documentation.
- [ ] Verified the saved result and documentation.

For private Shopify theme work, use `pa-theme-changelog` and record the exact theme ID privately. Public portfolio examples must remain independently authored and fictional.

## JRV colour and visual consistency (when UI, CSS, components or favicon change)

- [ ] Reviewed [the maintained JRV Design System](../docs/JRV_DESIGN_SYSTEM.md) before editing; inspected relevant CSS and existing comments.
- [ ] Reused canonical `--jrv-*` tokens or justified a scoped exception. Kept site-wide Obsidian, Teal and Ember roles consistent.
- [ ] Updated `docs/JRV_DESIGN_SYSTEM.md` and its dated decision history **if** palette values, usage rules, exceptions or source locations changed.
- [ ] Updated affected inline comments and `CHANGELOG.md`. Kept any light editorial/print résumé context readable.
- [ ] Verified `npm test` design-system synchronisation plus relevant mobile, desktop, hover, focus and contrast checks; listed any missing QA.

This is a living guide requirement, not a one-off release note. For nonvisual changes, mark these checks not applicable instead of changing the palette unnecessarily.

## Validation and open checks

List commands or scenarios actually run, their results and evidence references. State which browser, mobile, integration or release checks remain pending. A checklist or successful build alone does not prove all runtime checks passed.

## Release and recovery

State whether this is proposed, staged or published and identify the recovery reference when applicable. Verify the target again before release.
