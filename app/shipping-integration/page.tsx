import Link from 'next/link';
import {
  ArrowLeft, ArrowUpRight, CreditCard, MapPin, Repeat2, ShieldCheck,
  ShoppingCart, Workflow,
} from 'lucide-react';
import CaseStudyContext from '../components/CaseStudyContext';
import ShippingFlowMotion from './ShippingFlowMotion';
import './shipping-case-study.css';

// Public case study, 22 November 2026: the old unstyled route was difficult to
// read on desktop and mobile. A scoped layout now explains each system and the
// validation sequence without exposing client configuration or inventing rates.
// Keep the original sample-only evidence boundary and SEO canonical intact.
export const metadata = {
  title: 'Shopify Cold-Chain Shipping & Subscriptions',
  description: 'Shopify shipping integration case study covering Recharge subscriptions, Zapiet delivery zones, mixed carts and checkout rate validation.',
  alternates: { canonical: '/shipping-integration' },
};

const systems = [
  { name: 'Recharge', role: 'Subscription eligibility, order type and recurrence', Icon: Repeat2 },
  { name: 'Zapiet', role: 'Delivery-zone and geographic rate rules', Icon: MapPin },
  { name: 'Shopify checkout', role: 'Shipping profiles, discounts and charged totals', Icon: ShoppingCart },
];

const steps = [
  ['Trace responsibilities', 'Map each system\'s role in rate selection and checkout before changing configurations.'],
  ['Reconcile eligibility', 'Compare below-threshold, qualifying, first-time subscription, recurring and mixed-cart conditions.'],
  ['Align the rules', 'Coordinate shipping profiles, discounts and zone restrictions without bypassing cold-chain requirements.'],
  ['Verify final charges', 'Compare original, discounted and final charged rates against sampled completed orders.'],
];

const scenarios = [
  ['Below threshold', 'Check eligible paid delivery rather than the displayed original rate alone.'],
  ['Qualifying orders', 'Confirm the discount and the final shipping charge match the entitlement.'],
  ['Subscription orders', 'Review first and recurring cycles separately, including zone eligibility.'],
  ['Mixed carts', 'Check subscription and one-time items together for conflicting calculations.'],
];

export default function ShippingIntegrationCaseStudy() {
  return <main className="shipping-story">
    <div className="shipping-story-wrap">
      <Link href="/" className="shipping-story-back"><ArrowLeft size={16} aria-hidden="true"/> Back to portfolio</Link>

      <header className="shipping-story-hero">
        <span className="shipping-story-eyebrow">ENGINEERING CASE STUDY / SHOPIFY INTEGRATIONS</span>
        <h1>Making cold-chain shipping <em>work across checkout.</em></h1>
        <p className="shipping-story-lead">Subscriptions, delivery zones and Shopify shipping profiles can affect the same checkout. The engineering challenge is to keep eligibility, discounts and final charges consistent, especially for mixed carts.</p>
        <div className="shipping-story-actions">
          <Link href="/#contact" className="shipping-story-action-primary">Discuss an integration <ArrowUpRight size={17} aria-hidden="true"/></Link>
          <Link href="/shopify-app-development" className="shipping-story-action-secondary">Explore app development <ArrowUpRight size={17} aria-hidden="true"/></Link>
        </div>
        <div className="shipping-story-highlights" aria-label="Project focus">
          <span><MapPin size={15} aria-hidden="true"/> Delivery zones</span>
          <span><Repeat2 size={15} aria-hidden="true"/> Subscription carts</span>
          <span><CreditCard size={15} aria-hidden="true"/> Charged rates</span>
        </div>
      </header>

      <section className="shipping-story-section" aria-labelledby="shipping-architecture-title">
        <div className="shipping-story-section-heading">
          <span className="shipping-story-eyebrow">01 / SYSTEM ARCHITECTURE</span>
          <h2 id="shipping-architecture-title">Three services. <em>One checkout decision.</em></h2>
          <p>Each system had a different responsibility. Overlapping rules could cause duplicate charges, unexpected fees or unavailable delivery options for subscription and one-time combinations.</p>
        </div>
        {/* Server-rendered responsibilities remain readable without motion;
            the client wrapper only animates flow highlights on view/replay. */}
        <ShippingFlowMotion>
          <div className="shipping-story-system-grid">
            {systems.map(({ name, role, Icon }, index) => <article className="shipping-story-system" key={name}>
              <span className="shipping-story-system-number">SYSTEM {String(index + 1).padStart(2, '0')}</span>
              <Icon size={26} aria-hidden="true"/>
              <h3>{name}</h3>
              <p>{role}</p>
            </article>)}
          </div>
          <div className="shipping-story-flow-line" aria-hidden="true"><span/><span/><span/></div>
          <div className="shipping-story-result">
            <ShieldCheck size={23} aria-hidden="true"/>
            <div><strong>Customer-facing shipping outcome</strong><span>Eligible rate → applied discount → final charged amount</span></div>
          </div>
          <p className="shipping-story-diagram-note">Conceptual responsibility map, not a live integration, checkout simulation or proprietary configuration.</p>
        </ShippingFlowMotion>
      </section>

      <section className="shipping-story-section shipping-story-approach" aria-labelledby="shipping-approach-title">
        <div className="shipping-story-section-heading">
          <span className="shipping-story-eyebrow">02 / DEVELOPER APPROACH</span>
          <h2 id="shipping-approach-title">Diagnose the rules <em>before the symptoms.</em></h2>
          <p>Rather than patching a displayed shipping price in isolation, the investigation traced how the connected apps influenced rate selection and the amount ultimately charged.</p>
        </div>
        <ol className="shipping-story-steps">
          {steps.map(([title, description], index) => <li key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h3>{title}</h3><p>{description}</p></div>
          </li>)}
        </ol>
      </section>

      <section className="shipping-story-section" aria-labelledby="shipping-validation-title">
        <div className="shipping-story-section-heading">
          <span className="shipping-story-eyebrow">03 / CHECKOUT SCENARIOS</span>
          <h2 id="shipping-validation-title">A practical <em>validation matrix.</em></h2>
          <p>These are scenario types to review, not asserted pass rates, undisclosed prices or claims that every historical order was tested.</p>
        </div>
        <div className="shipping-story-scenarios">
          {scenarios.map(([title, description]) => <article key={title}>
            <Workflow size={18} aria-hidden="true"/>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>)}
        </div>
      </section>

      <section className="shipping-story-section shipping-story-outcome" aria-labelledby="shipping-outcome-title">
        <div>
          <span className="shipping-story-eyebrow">04 / OBSERVED EVIDENCE</span>
          <h2 id="shipping-outcome-title">What the sampled <em>orders showed.</em></h2>
          <p>After configuration work, sampled orders showed expected outcomes for paid below-threshold delivery, qualifying free delivery, first subscription orders and recurring subscription orders.</p>
          <p>An apparent exception was explained by Shopify retaining the original shipping rate while applying a full shipping discount. No repeat of the original duplicate-charge issue was confirmed in the examined sample.</p>
        </div>
        <aside className="shipping-story-evidence">
          <ShieldCheck size={24} aria-hidden="true"/>
          <h3>Evidence boundary</h3>
          <p>This was not an exhaustive audit of historical orders, support tickets or all mixed-cart combinations. No measured financial uplift or guaranteed zero recurrence is claimed.</p>
        </aside>
      </section>

      <p className="shipping-story-public-note">This public-safe account contains no customer information, internal rate tables, production configuration or proprietary source code. The reusable lesson is to document system responsibilities and distinguish displayed rates from the final amount charged.</p>
    </div>
    <CaseStudyContext
      summary="Cross-app diagnosis of delivery-zone rates and subscription order eligibility, including distinctions between displayed rates, discounts and final charges."
      evidenceLimit="The reviewed orders were a sample, not an exhaustive audit, so no zero-recurrence or measured uplift is claimed."
      services={[
        { title: 'Ecommerce management', href: '/ecommerce-management', description: 'Shipping operations, customer journey reliability and coordination across commerce apps.' },
        { title: 'Custom Shopify apps and APIs', href: '/shopify-app-development', description: 'Understanding system boundaries when delivery and subscription services exchange data.' },
      ]}
    />
  </main>;
}
