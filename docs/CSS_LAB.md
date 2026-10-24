# HTML and CSS: interactive advanced foundations lab

## Purpose

A portfolio educational demonstration covering CSS specificity, selectors, layout, positioning, the box model, typography, responsive rules and visibility. The page **does not publish or reproduce the assessment's actual questions or answers** and is not presented as an employer application or professional qualification. Concepts are illustrated using independently written examples and a new eight-item self-test.

## Architecture

- \`app/css-lab/page.tsx\`: client-side interactive guide with category filters, sliders for padding/box-sizing, element visibility comparison, and a quiz with immediate result feedback.
- \`app/css-lab/css-lab.module.css\`: responsive, locally scoped visual styles and demos.
- \`lib/css-lab.mjs\`: topic text, code examples, original quiz data and pure quiz grading.
- \`tests/css-lab.test.mjs\`: uniqueness, input validation and deterministic score checks.
- \`README.md\`, \`CHANGELOG.md\`, \`app/page.tsx\`: discovery and change history.

## Important technical distinctions

- CSS declarations resolve through the cascade, not only specificity. Importance, layers, origins, and source order may matter.
- Modern \`:has()\` permits parent-matching patterns; it is not accurate to say parent selection is inherently impossible.
- The ordinary sizing values are \`content-box\` and \`border-box\`. Non-standard historical \`padding-box\` is intentionally omitted from the demonstration.
- \`z-index\` also applies to flex and grid items, even without positioned layout. Stacking contexts determine where it can take effect.
- Browser local-font preference requires an explicit \`local()\` source within an \`@font-face\` declaration.
- The visibility comparison differentiates painted visibility, layout occupancy and pointer interaction.
- The quiz is educational practice, not proof of a test score or certification.

## Validation

Run the standard repository commands:

\`\`\`sh
npm test
npm run check:safety
npx tsc --noEmit
npm run build
\`\`\`

Check the page at desktop and mobile widths; exercise slider, sizing switch, visibility controls, quiz answers and reset. GitHub Actions and Vercel preview results must be inspected before production publication. Record actual status in \`CHANGELOG.md\`, never claim tests that have not run.

## Security

No server requests, external data collection, private files, user identifiers, credentials, customer data, or company source code are required. All interaction state remains within the browser.
