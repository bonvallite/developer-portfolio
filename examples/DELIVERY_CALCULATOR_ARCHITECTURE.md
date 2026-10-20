# Shared delivery calculator architecture (public-safe case study)

This is an architectural case study, **not** a copy of the merchant's production code, zones, delivery schedules, checkout rates or customer data.

## Problem
Displaying delivery eligibility and estimated dates across product pages, collection landing pages and informational pages can create drift if each UI component maintains its own rules.

## Approach
- Keep calculation rules in one shared module, with a small public API for postcode eligibility and estimated delivery information.
- Initialise the module once using store/theme settings rather than embedding different values per page.
- Hydrate reusable `data-delivery-checker` mount points; a lightweight section enables these on CMS-driven pages.
- Load assets only when needed, guard against multiple initialisations and handle unavailable data gracefully.
- Treat checkout shipping rates as a separate authority: an informational estimate must not be presented as the amount Shopify will charge.

## Surfaces and constraints
- **CMS pages:** Include the shared loader in the page template and mount a postcode checker in content.
- **Product and collection landing pages:** Render the shared checker component; avoid copying fee or calendar rules into each section.
- **Cart:** A preview/estimate can appear, but must be labelled as an estimate and checked against configured shipping rates.
- **Hosted checkout:** Theme Liquid and arbitrary storefront JavaScript are not a supported deployment surface. Evaluate supported Checkout UI Extensions separately, subject to platform and plan capabilities; keep rate calculation in the actual configured checkout system.
- **Order confirmation or customer account:** Review the supported extension and notification surfaces independently rather than assuming a global theme loader will run.

## Testing checklist
1. Confirm a single shared source is initialised once per page.
2. Check valid, unsupported and malformed postcodes.
3. Compare displayed estimates against actual checkout charges in controlled tests.
4. Test dispatch cut-offs, weekends, holidays and different delivery frequencies using **fictional test fixtures**.
5. Verify keyboard input, accessible announcements, loading and error states.
6. Review desktop, mobile, delayed-network and repeat navigation behaviour.
7. Re-test any change to configured delivery zones and rate rules.

## Confidentiality
No client code, private postcodes, carrier arrangements, rate sheets, store identifiers, customer data or proprietary configuration is published here.
