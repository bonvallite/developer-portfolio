# Documentation is part of delivery

This is my working standard for building and maintaining commerce systems. A change is complete when its behaviour, inline documentation, change history and validation evidence agree.

Clear records help the next developer understand a decision, help an operator manage the system, and help me investigate a regression. They are essential engineering work throughout a project.

## Read before editing

Read the target's current changelog, any linked archives, the relevant source and all existing inline comments before making a change. Confirm the exact environment, theme or project and its current release status. Preserve useful documentation and the established conventions.

For Shopify theme work, the authoritative history is `pa-theme-changelog` and its linked archives. Develop on an unpublished duplicate of the current live theme. A theme's role and available rollback versions must be checked again at release time.

## Keep the explanation beside the code

Update the affected comments whenever behaviour, purpose, dependencies or constraints change. Explain why a rule exists, what owns the data, which callers depend on it and how failures are handled. Correct or remove superseded notes.

- **Liquid:** use valid LiquidDoc or Liquid comment tags so maintainer notes stay out of storefront output.
- **JavaScript, TypeScript, React and Python:** use the language's valid comments or docstrings close to the relevant logic. Document lifecycle, input contracts and ownership where they affect maintenance.
- **CSS:** document the scope and reason for overrides, including dependencies on app markup or stable hooks.
- **JSON and exported configuration:** preserve the format accepted by its consumer. Record the affected setting or block in the changelog and nearest relevant source documentation when comments are unsupported or editor saves may remove them.
- **Workflows and integrations:** document the trigger, source of truth, conditions, actions, dependencies, failure behaviour and ownership boundary in the maintained workflow notes.

Useful comments explain a decision. Comment counts alone do not demonstrate documentation quality.

## Record every change

Log each change, fix, addition and rule update with:

| Field | Required detail |
| --- | --- |
| Date | Actual date of the change or retrospective audit |
| Target | Theme ID, project/environment or workflow version |
| Affected files | Exact paths and changed settings or blocks |
| What changed | The resulting behaviour and relevant scope |
| Why | The problem, requirement or maintenance reason |
| Validation | Checks actually performed, results and evidence reference |
| Open checks | Pending browser, mobile, integration or operational checks |
| Release and recovery | Current release status and a verified recovery reference when applicable |

Keep historical entries intact. Append a correction when later evidence changes an earlier statement. Retrospective documentation must identify itself and must not invent an implementation date, test result or deployment event.

### Reusable change record

```text
Date:
Target / environment / version:
Affected files and settings:
Change:
Reason:
Inline documentation updated:
Validation performed and results:
Evidence reference:
Pending checks / limitations:
Release status / recovery reference:
```

## Validate the result and record the limits

Check syntax, types, schemas, relevant tests and builds as appropriate to the change. For remote edits, re-read the saved files and compare them with the intended result. Exercise affected browser interactions and responsive layouts where required. For integrations, verify the relevant dependency and failure paths.

A passing build establishes build validity. A successful upload establishes that files were accepted. Record browser, mobile and end-to-end checks separately, and keep any missing check visibly pending. Checklists describe required work; completed evidence records what happened.

For example, cart progress copy can be driven by a metaobject while gift fulfilment and shipping eligibility are enforced by separate systems. Documentation must make those boundaries clear so editing presentation data is not mistaken for updating every backend rule.

## Definition of done

- The change works within its stated scope.
- Affected inline documentation describes the current behaviour, purpose and dependencies.
- The changelog includes the date, target, files, change, reason and validation performed.
- Saved files and documentation have been verified against the intended result.
- Pending QA, known limitations and release status are explicit.
- Release-specific checks pass before the change is described as ready for that release.

This standard applies across Liquid, CSS, JavaScript, TypeScript, React, Python, Shopify Flow and API integrations. It is a maintained practice and review requirement. The repository's CI checks syntax, tests, types, builds and common sensitive-content patterns; it does not automatically certify that every comment or historical entry is complete and accurate.

## Public examples and private records

The portfolio explains the practice with independently authored examples. Keep production theme IDs, private changelogs, workflow exports, customer records, credentials and employer-owned source in their appropriate private systems. The public example on `/engineering-standards` uses fictional paths and a fictional theme label.

See [contribution guidance](CONTRIBUTING.md), the [pull-request template](.github/pull_request_template.md) and [portfolio change history](CHANGELOG.md).
