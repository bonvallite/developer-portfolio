# Contributing

Read [ENGINEERING_STANDARDS.md](ENGINEERING_STANDARDS.md), the current [CHANGELOG.md](CHANGELOG.md), relevant source and existing comments before editing. Follow the repository's publication policy in [README.md](README.md#security-and-publication-policy).

For each change:

1. Confirm the target and keep the change scoped.
2. Update affected inline comments and documentation to describe the resulting behaviour, purpose and dependencies.
3. Add a dated changelog entry listing affected files, the change, reason and actual validation. Identify pending checks explicitly.
4. Run the checks appropriate to the change and the required CI checks. The commands are in [README.md](README.md#validation).
5. Use the pull-request template to give the reviewer a clear account of the resulting behaviour, evidence and open checks.

The documentation standard is a review requirement. CI does not automatically verify the accuracy of comments or change records.

For private Shopify theme work, read `pa-theme-changelog`, its linked archives and existing inline documentation on the exact target before editing. Update and verify both the affected inline documentation and changelog after every change, using Australian English. Record the theme ID privately. Keep private theme records and source out of this public repository.
