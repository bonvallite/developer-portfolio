'use client';

import { useState } from 'react';
import {
  ArrowRight, Building2, CheckCircle2, Code2, KeyRound,
  Layers3, ShieldCheck, ShoppingCart,
} from 'lucide-react';

/**
 * Public-safe B2B architectural explainer, 21 November 2026.
 *
 * Uses the exact fictional selection and eligibility state of the existing
 * catalogue price laboratory. It illustrates responsibility boundaries;
 * it cannot authenticate a customer, validate an actual company location,
 * assign Shopify markets/catalogues, or set checkout prices.
 *
 * All code is expressly illustrative pseudocode rather than merchant Liquid,
 * Admin API source, or a copied production configuration. No network calls,
 * credentials, identities, or real catalogue prices are involved.
 */
type MarketSummary = { name: string; catalogue: string; price: number };
type Props = {
  marketIndex: number;
  requested: MarketSummary;
  applied: MarketSummary;
  eligible: boolean;
  quantity: number;
  retailUnitPrice: number;
  onEligibilityChange: (eligible: boolean) => void;
};

const stages = [
  {
    key: 'application',
    tag: '01 / ACCESS REQUEST',
    title: 'An application is not an approval.',
    short: 'Apply',
    icon: KeyRound,
    detail: 'A prospective wholesale buyer can submit a Shopify Form. The review and access decision belong to the merchant team. Submitting a form must not automatically grant company catalogue pricing.',
    boundary: 'Shopify Forms collects the request. Approval and account configuration are separate responsibilities.',
    code: [
      '// Illustrative workflow boundary',
      'if (application.submitted) {',
      '  queueForManualReview();',
      '}',
      '// Do not assign company pricing here.',
    ],
  },
  {
    key: 'company',
    tag: '02 / COMPANY ENTITLEMENT',
    title: 'Identity and purchasing context come first.',
    short: 'Verify',
    icon: Building2,
    detail: 'After approval, a valid company location and authorised purchasing role establish which company context is available. A visitor selecting a market name in a browser cannot grant that entitlement.',
    boundary: 'The toggle below is a fictional scenario selector, not Shopify authentication or a real approval status.',
    code: [
      '// Illustrative server-side responsibility',
      'const company = getAuthorisedCompanyLocation();',
      'if (!company?.approved) {',
      '  denyCompanyPurchaseContext();',
      '}',
    ],
  },
  {
    key: 'catalogue',
    tag: '03 / NATIVE PRICE SOURCE',
    title: 'The assigned catalogue supplies the price.',
    short: 'Price',
    icon: Layers3,
    detail: 'A qualifying company purchasing context resolves the applicable B2B market and catalogue. The storefront should show the price returned for that authorised context, not independently substitute a client-side discount.',
    boundary: 'This demonstration deliberately displays a retail-price fallback when entitlement is switched off. Actual Shopify access and price visibility may behave differently.',
    code: [
      '// Illustrative catalogue resolution',
      'const context = getAuthorisedBuyingContext();',
      'const catalogue = resolveAssignedCatalogue(context);',
      'const price = readPlatformPrice(catalogue);',
      '// UI displays the resolved value only.',
    ],
  },
  {
    key: 'checkout',
    tag: '04 / CHECKOUT AUTHORITY',
    title: 'Checkout must confirm the final amount.',
    short: 'Checkout',
    icon: ShoppingCart,
    detail: 'The simulated quantity and unit price explain a possible buyer-facing total. The real checkout must independently enforce catalogue eligibility, pricing, stock, shipping, tax, and payment rules.',
    boundary: 'No basket is modified here. The example subtotal is not a quote or a verified Shopify checkout result.',
    code: [
      '// Illustrative authorisation check',
      'const context = verifyCompanyCheckoutContext();',
      'const pricedCart = platformPriceCart(context);',
      'assertEligibleCatalogues(pricedCart);',
      '// Confirm actual totals in Shopify checkout.',
    ],
  },
] as const;

type StepKey = typeof stages[number]['key'];
const money = (n: number) =>
  'A$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function B2BEntitlementInspector({
  marketIndex, requested, applied, eligible, quantity, retailUnitPrice, onEligibilityChange,
}: Props) {
  const [step, setStep] = useState<StepKey>('catalogue');
  const current = stages.find(stage => stage.key === step) ?? stages[2];
  const chosen = marketIndex > 0;
  const entitled = chosen && eligible;
  const context = !chosen ? 'Retail shopper' : eligible ? 'Illustratively entitled buyer' : 'Buyer without approved company access';
  const total = applied.price * quantity;
  const saving = (retailUnitPrice - applied.price) * quantity;

  const status = !chosen
    ? 'Retail selected. The fictional demo uses the retail catalogue.'
    : entitled
      ? requested.name + ' selected with fictional company entitlement. ' + applied.catalogue + ' provides the example price.'
      : requested.name + ' requested, but no company entitlement selected. The demo shows retail pricing instead.';

  return (
    <div className="cb2b-system" aria-label="Interactive Shopify B2B architecture inspector">
      <div className="cb2b-system-chrome">
        <span className="cb2b-system-dots" aria-hidden="true"><i/><i/><i/></span>
        <strong>JRV / B2B ENTITLEMENT STUDIO</strong>
        <span>EXPLANATORY DEMO · NO LIVE SHOPIFY ACCESS</span>
      </div>

      <div className="cb2b-system-intro">
        <div>
          <span>FOLLOW THE PRICE TO ITS SOURCE</span>
          <h3>Who gets the price, and who enforces it?</h3>
          <p>Explore the boundary between wholesale application, company entitlement, catalogue assignment and checkout. Your selections are connected to the price laboratory below.</p>
        </div>
        <div className="cb2b-system-context" aria-label="Selected demonstration buying context" aria-live="polite">
          <small>ACTIVE FICTIONAL CONTEXT</small>
          <strong>{context}</strong>
          <span>{requested.name} · {applied.catalogue}</span>
        </div>
      </div>

      <div className="cb2b-system-stages" role="group" aria-label="B2B system stages">
        {stages.map((item, index) => {
          const Icon = item.icon;
          return (
            <button type="button" key={item.key}
              className={step === item.key ? 'is-selected' : ''}
              aria-pressed={step === item.key} onClick={() => setStep(item.key)}>
              <span className="cb2b-system-stage-index">{String(index + 1).padStart(2, '0')}</span>
              <Icon size={22} strokeWidth={1.7} aria-hidden="true"/>
              <strong>{item.short}</strong>
              <small>{item.tag.slice(5)}</small>
              {index < stages.length - 1 && <ArrowRight className="cb2b-system-stage-arrow" size={17} aria-hidden="true"/>}
            </button>
          );
        })}
      </div>

      <div className="cb2b-system-grid">
        <div className="cb2b-system-explainer">
          <span>{current.tag}</span>
          <h4 aria-live="polite" aria-atomic="true">{current.title}</h4>
          <p>{current.detail}</p>
          <div className="cb2b-system-boundary"><ShieldCheck size={19} aria-hidden="true"/>
            <p><strong>Engineering boundary</strong>{current.boundary}</p>
          </div>
          <div className="cb2b-system-eligibility" role="group" aria-label="Fictional company entitlement">
            <span>TEST THE BUYER CONTEXT</span>
            <div>
              <button type="button" aria-pressed={eligible} className={eligible ? 'is-active' : ''}
                onClick={() => onEligibilityChange(true)}>Approved location (demo)</button>
              <button type="button" aria-pressed={!eligible} className={!eligible ? 'is-active' : ''}
                onClick={() => onEligibilityChange(false)}>No company access (demo)</button>
            </div>
          </div>
          <p className="cb2b-system-current" aria-live="polite"><CheckCircle2 size={18} aria-hidden="true"/>{status}</p>
        </div>
        <div className="cb2b-system-code">
          <div className="cb2b-system-code-title"><span><Code2 size={16} aria-hidden="true"/>{current.short.toUpperCase()} / LOGIC VIEW</span><span>ILLUSTRATIVE</span></div>
          <pre tabIndex={0} aria-label={current.short + ' pseudocode'}><code>{current.code.join('\n')}</code></pre>
          <div className="cb2b-system-price-proof">
            <small>FICTIONAL STOREFRONT PRICE PREVIEW</small>
            <div><span>Price source</span><strong>{applied.catalogue}</strong></div>
            <div><span>Unit price</span><strong>{money(applied.price)}</strong></div>
            <div><span>{quantity} sample units</span><strong>{money(total)}</strong></div>
            <div className="cb2b-system-price-saving"><span>Illustrative saving versus retail</span><strong>{money(saving)}</strong></div>
          </div>
          <p className="cb2b-system-code-note">The code is pseudocode, not a real Liquid snippet, app configuration, or server-side price entitlement check. No checkout occurs.</p>
        </div>
      </div>
      <div className="cb2b-system-footer">
        <span>ONE STOREFRONT · EXPLICIT COMPANY ACCESS · CATALOGUE-GOVERNED PRICES</span>
        <a href="#price-lab">Adjust sample quantity in the price lab <ArrowRight size={16} aria-hidden="true"/></a>
      </div>
    </div>
  );
}
