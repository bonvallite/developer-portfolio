import type { Metadata } from 'next';
import ServicePage, { type ServiceContent } from '../components/ServicePage';

// Search intent and canonical URL are unique to this service route.
// Do not add personal identity schema or claim externally published App Store apps.
export const metadata: Metadata = {
  title: "Shopify CRO Specialist | Conversion Optimisation",
  description: "Conversion rate optimisation for Shopify stores: GA4 funnel analysis, Shopify Analytics, behaviour insights, UX diagnosis, and tested improvement opportunities.",
  alternates: { canonical: '/shopify-cro' },
  openGraph: { title: "Shopify CRO Specialist | Conversion Optimisation", description: "Conversion rate optimisation for Shopify stores: GA4 funnel analysis, Shopify Analytics, behaviour insights, UX diagnosis, and tested improvement opportunities.", url: 'https://www.jrvallite.com/shopify-cro' },
};

const content: ServiceContent = {
  "label": "SHOPIFY CRO / CONVERSION RATE OPTIMISATION",
  "heading": "Shopify CRO Specialist for better customer journeys",
  "lead": "Understand where customers drop out, investigate the underlying experience, and prioritise changes that make Shopify storefronts clearer and easier to use.",
  "audience": "For ecommerce teams looking for conversion-focused analysis and implementable Shopify UX and technical improvements.",
  "areas": [
    {
      "title": "Conversion funnel analysis",
      "description": "Assess product views, add-to-cart events, checkout starts, purchase reporting, and data discrepancies between systems."
    },
    {
      "title": "Behaviour and usability",
      "description": "Review session recordings, heatmaps, mobile journeys, navigation, calls to action, and page-level friction where data is available."
    },
    {
      "title": "Storefront improvements",
      "description": "Evaluate product page hierarchy, collection discovery, cart interactions, performance, and customer reassurance."
    },
    {
      "title": "Measurement and validation",
      "description": "Review instrumentation, compare results over suitable periods, and distinguish observed outcomes from hypotheses."
    }
  ],
  "process": [
    {
      "title": "Measure",
      "description": "Review conversion reporting and analytics reliability before drawing conclusions."
    },
    {
      "title": "Diagnose",
      "description": "Identify specific friction points and formulate prioritised hypotheses for improvements."
    },
    {
      "title": "Validate",
      "description": "Implement or specify changes, check events and UX, and assess results without overstating causality."
    }
  ],
  "evidence": [
    {
      "title": "Conversion audit case study",
      "description": "A documented Shopify journey analysis with GA4, Shopify Analytics, and behavioural insights.",
      "href": "/conversion-audit"
    },
    {
      "title": "Custom Shopify homepage",
      "description": "A modular, mobile-oriented storefront demonstration focused on product discovery.",
      "href": "/editorial-homepage-demo"
    },
    {
      "title": "Technical experience",
      "description": "Examples of analytics diagnostics and practical commerce engineering responsibilities.",
      "href": "/experience"
    }
  ]
};

export default function Page() {
  return <ServicePage content={content} />;
}
