# Third-party minicart enhancement: development history

This is a **public-safe engineering history** of a storefront maintenance task completed on 21 October 2026. It records the reasoning and sequence of changes without publishing employer-owned theme source, store or theme identifiers, live promotion thresholds, product names, private app configuration, credentials, screenshots, or customer data.

The original task began as an investigation into a minicart that did not behave like the theme's native cart. The production implementation involved a third-party subscription/cart app; this portfolio history keeps the vendor- and store-specific details out and focuses on the engineering pattern.

## 1. Identify who actually owns the cart

The first step was not to edit the visible HTML. The important question was: **is this the theme's cart, or is an app rendering its own cart?**

Inspection showed that the visible drawer was app-owned rather than the theme's native cart. That changed the implementation strategy immediately:

- do not replace the app's cart logic;
- do not assume a Liquid section owns the visible markup;
- keep quantity changes, subscriptions, cart totals, checkout submission, and other transactional behaviour under the app's control;
- treat theme code as an enhancement layer only.

This avoided a common failure mode: editing theme cart code that is not responsible for the cart customers actually see.

## 2. Confirm the Shadow DOM boundary

The cart could render inside an **open ShadowRoot**. Document-level CSS therefore could not be assumed to reach it.

The enhancement strategy became:

1. search the document for the drawer;
2. if it is not found, traverse nested **open** shadow roots;
3. once the drawer is found, identify its owning root;
4. load the enhancement stylesheet into that same root;
5. never attempt to bypass a **closed** ShadowRoot.

A closed root is treated as a hard integration boundary. If the app ever switches to one, the correct response is to use a vendor-supported extension or customisation surface.

## 3. Design for hydration and rerenders

A third-party cart can replace its DOM after initial page load, quantity changes, subscription changes, or drawer reopening.

The enhancement therefore could not be a one-time DOM patch. The runtime was designed around repeated discovery and reattachment:

- observe the drawer for relevant mutations;
- observe the owning root where appropriate;
- respond to interactions that cross the Shadow DOM boundary;
- rediscover and reapply hooks after app rerenders;
- keep DOM changes narrow and idempotent.

The engineering goal was to survive app hydration without taking over the app lifecycle.

## 4. Add stable hooks instead of styling fragile utility classes

The app-generated markup included utility classes and inline styles. Those are useful during inspection but are poor long-term integration contracts.

After the cart renders, the enhancement adds narrow `data-*` hooks to important elements such as:

- cart title;
- subtotal row;
- visible total value.

CSS can then target those stable hooks rather than depending on an item count, transient utility-class combination, or exact inline style string.

This also made later visual refinements much safer: a spacing change could be scoped to one row instead of changing a global heading or utility class.

## 5. Establish the typography hierarchy

Once stable hooks existed, the title and subtotal were treated as separate hierarchy levels.

The work included:

- making the cart title the primary heading;
- applying a consistent brand-font treatment;
- giving the subtotal row a strong but secondary emphasis;
- keeping the visible monetary total visually aligned with the subtotal label;
- avoiding global changes to site-wide heading or font utility classes.

The important pattern was **local scope**: cart typography changes were attached to the cart, not the entire storefront.

## 6. Refine header, footer, subtotal, and cart-link spacing independently

Spacing was tuned in small, isolated changes rather than with one broad footer rule.

The sequence included:

- reducing the cart header's vertical padding while preserving its horizontal drawer spacing;
- tightening the cart-link block without changing the link behaviour;
- normalising the outer cart footer's vertical padding;
- removing the remaining bottom padding from the subtotal row through its stable hook;
- keeping checkout-button spacing separate from subtotal and cart-link spacing.

Each refinement had one purpose. This mattered because the app rendered inline padding values that could otherwise win over ordinary stylesheet rules.

Where an inline value had to be overridden, specificity and `!important` were used narrowly, only at the integration point that required them.

## 7. Add a configuration-driven rewards progress component

The cart enhancement also needed to explain progressive promotional qualification.

The architecture separated **offer data** from **runtime behaviour**:

- thresholds are configuration-driven;
- reward labels are configuration-driven;
- the runtime reads the current cart subtotal;
- the runtime determines which milestone is next;
- the runtime calculates progress between milestones;
- campaign values and reward names are not hardcoded into the cart logic.

The public example in this repository uses fictional configuration for exactly this reason.

## 8. Keep the progress rail visual, but qualification exact

The progress rail was designed as three visual stages. The monetary distance between the stages did not have to be equal.

The runtime therefore separates:

- **qualification**, which uses the actual configured thresholds; and
- **visual interpolation**, which distributes progress across equal visual segments.

That lets the UI remain balanced while still marking a milestone complete only when its real threshold has been reached.

## 9. Make reward copy state-driven

The reward message changes with the current subtotal state.

The internal implementation evolved from generic wording such as an "unlocked gift" message to a dynamic pattern that inserts the current configured reward label.

A separate copy rule was also documented for shipping language:

- the primary next-step message may use an emphasised shipping label;
- the already-unlocked secondary line uses normal sentence-case wording.

The important maintenance rule is that the runtime interpolates configuration values. Changing the active reward should not require rewriting JavaScript.

## 10. Preserve the app-native fallback

The custom rewards UI is an enhancement, not a single point of failure.

The fallback rule is:

- keep the app's native promotional/shipping UI available by default;
- hide it only after the custom component renders successfully;
- if configuration is invalid, cart loading fails, or the enhancement cannot attach, remove the custom component and leave the native UI visible.

This makes failure graceful: customers still retain the app's original cart experience.

## 11. Keep fulfilment responsibility outside the minicart

The cart UI communicates qualification. It does not need to turn every promotional reward into an extra cart line.

In the production architecture, post-checkout automation handled fulfilment separately. The portfolio deliberately leaves that implementation out.

The general lesson is to separate:

- cart presentation;
- qualification calculation;
- checkout ownership; and
- post-checkout fulfilment automation.

That reduces coupling between the third-party cart and the promotion workflow.

## 12. Document every integration decision

The work used a read-first, change-log-driven maintenance process.

Before edits:

- read the current integration code;
- read existing inline maintenance notes;
- read the active project change log;
- confirm the target environment was a development/unpublished theme.

After edits:

- update inline maintenance documentation;
- update the dedicated integration guide;
- append a dated change-log entry explaining scope, reason, and validation;
- read the saved files back rather than assuming the write succeeded.

This was especially useful because several visual changes were only a few pixels. Small changes still received the same audit trail as larger ones.

## 13. Boundary-focused QA

Testing focused on state boundaries and app rerender behaviour rather than a single happy-path screenshot.

The QA checklist covered patterns such as:

- empty cart;
- below the first reward;
- exactly at each configured milestone;
- just below and just above milestone boundaries;
- quantity increase and decrease;
- item removal;
- drawer close and reopen;
- subscription controls;
- excluded cart types where applicable;
- mobile and desktop;
- promotion disabled;
- custom UI failure with native fallback retained.

For public code, [example 48](./examples/48-open-shadow-cart-enhancer.js) keeps only the generalisable parts: open-root discovery, stable hooks, configuration-driven reward states, and fallback behaviour.

## 14. What changed during the work

The development sequence can be summarised as:

1. identified the visible minicart as app-owned rather than theme-owned;
2. confirmed an open Shadow DOM integration boundary;
3. built root discovery and stylesheet injection;
4. added observers for app rerenders;
5. added stable cart hooks;
6. scoped title and subtotal typography;
7. introduced the rewards-progress component;
8. preserved the native fallback path;
9. refined header and cart-link spacing;
10. removed vertical spacing from the rewards container while keeping horizontal alignment;
11. replaced generic unlocked-reward wording with dynamic configuration-driven copy;
12. documented copy-state and boundary rules;
13. normalised footer spacing;
14. removed residual subtotal-row bottom padding;
15. verified saved source and documentation after every change.

## Key lessons

- **Identify ownership before editing.** Visible HTML does not tell you which system owns a component.
- **Treat Shadow DOM as an integration boundary.** Open roots can be enhanced; closed roots should be respected.
- **Do not replace app behaviour just to change presentation.**
- **Prefer stable hooks over transient utility classes.**
- **Keep offer configuration out of runtime logic.**
- **Make fallbacks deliberate.**
- **Test boundaries, not only representative states.**
- **Document tiny production-facing changes with the same discipline as large ones.**

## Publication boundary

This file is a narrative of the engineering process, not a source-code export. The associated public example is independently authored and synthetic. Employer-owned source, exact production selectors, live offer values, reward/product names, theme identifiers, private workflow exports, credentials, and internal operational data are intentionally excluded.
