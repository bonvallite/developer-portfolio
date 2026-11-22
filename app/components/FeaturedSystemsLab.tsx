import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Cloud, Database, ShieldCheck, ShoppingBag, Truck, Workflow } from 'lucide-react';
import './featured-systems-lab.css';

/**
 * 22 Nov 2026: Self-contained, preview-only homepage entry for the independent
 * serverless commerce engineering lab. The original integration case study
 * and all four studio modes remain in place for side-by-side review.
 *
 * Architecture is deliberately conceptual: the Cloudflare Worker hosts the
 * Shopify app backend, Workers KV stores OAuth state/token data, CartonCloud
 * supplies carrier events, and the Worker uses Shopify Admin API access to
 * write back tracking, fulfilment events and order metafields. Customer email
 * is Shopify-native and not guaranteed merely by a notification request.
 * Order-created ETA metafields and later tracking calls are verified Worker
 * paths. Merchant reports Shopify sends email when available and SMS only
 * if no email address is present (but a mobile number is). The five-minute
 * notification delay is store-configured, not a Worker sending function.
 * No provider network requests, customer records or production data.
 */
export default function FeaturedSystemsLab() {
  return (
    <section className="jrv2-section jrv2-flagship" id="systems-lab" aria-labelledby="jrv2-flagship-title">
      <div className="jrv2-wrap">
        <div className="jrv2-flagship-shell">
          <div className="jrv2-flagship-copy">
            <span className="jrv2-overline">FEATURED ENGINEERING / CUSTOM SHOPIFY APP</span>
            <h2 id="jrv2-flagship-title">Beyond the storefront.<br/><em>Into the systems.</em></h2>
            <p className="jrv2-flagship-lead">A custom Shopify app, a Cloudflare Workers backend and an event-driven delivery workflow, connecting orders, fulfilment and customer updates.</p>
            <p className="jrv2-flagship-support">Explore the architecture, location-aware last-mile rules, Workers KV authentication, order ETA metafields, and the reported five-minute Shopify email-to-SMS fallback before later tracking updates.</p>
            <div className="jrv2-flagship-tech" aria-label="Featured project technologies">
              <span>SHOPIFY APP</span><span>WORKERS KV</span><span>REST + GRAPHQL</span><span>ETA &amp; NOTIFICATIONS</span>
            </div>
            <div className="jrv2-flagship-actions">
              <Link href="/projects/commerce-integration-engineering"
                className="jrv2-flagship-primary" data-jrv-track="case" data-jrv-case="integration">
                Explore the interactive case study <ArrowUpRight size={17} aria-hidden="true"/>
              </Link>
              <Link href="/cartoncloud-integration" className="jrv2-flagship-secondary">
                Earlier integration case study <ArrowRight size={16} aria-hidden="true"/>
              </Link>
            </div>
            <p className="jrv2-flagship-note"><ShieldCheck size={15} aria-hidden="true"/>
              Fictional demonstration data. No customer records, secrets or live provider calls.
            </p>
          </div>
          <div className="jrv2-flagship-visual" role="img"
            aria-label="Conceptual event flow: Shopify order webhook reaches Cloudflare Workers, which uses Workers KV and Shopify app authorisation. The Worker sends consignments to CartonCloud, receives tracking callbacks, and updates Shopify fulfilment tracking, events and order metafields through the Admin API. Shopify may send a native customer notification.">
            <div className="jrv2-flagship-windowbar">
              <span className="jrv2-flagship-dots" aria-hidden="true"><i/><i/><i/></span>
              <strong>JRV / SYSTEMS ARCHITECTURE</strong><small>SIMULATED</small>
            </div>
            <div className="jrv2-flagship-diagram">
              <div className="jrv2-flagship-flow">
                <div className="jrv2-flagship-node">
                  <ShoppingBag size={24} aria-hidden="true"/><strong>Shopify</strong>
                  <small>Order + fulfilment events</small>
                </div>
                <div className="jrv2-flagship-wire"><span>WEBHOOK</span><i/></div>
                <div className="jrv2-flagship-node jrv2-flagship-node-core">
                  <Cloud size={27} aria-hidden="true"/><strong>Cloudflare Worker</strong>
                  <small>Custom app backend</small>
                  <span className="jrv2-flagship-node-kv"><Database size={13} aria-hidden="true"/> KV · OAuth</span>
                </div>
                <div className="jrv2-flagship-wire"><span>REST</span><i/></div>
                <div className="jrv2-flagship-node">
                  <Truck size={24} aria-hidden="true"/><strong>CartonCloud</strong>
                  <small>Carrier + tracking updates</small>
                </div>
              </div>
              <div className="jrv2-flagship-return">
                <Workflow size={18} aria-hidden="true"/>
                <span>Tracking callback → Worker → Shopify Admin API → tracking, events &amp; order metafields</span>
              </div>
              <div className="jrv2-flagship-notify">
                <span className="jrv2-flagship-dot" aria-hidden="true"/>
                SHOPIFY NATIVE NOTIFICATION MAY BE REQUESTED
              </div>
            </div>
            <div className="jrv2-flagship-windowfoot">
              <span>AUTHENTICATED API WRITE-BACK</span><span>PUBLIC-SAFE DEMO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
