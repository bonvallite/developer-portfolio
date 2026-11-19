import type { Metadata } from 'next';
import ServicePage, { type ServiceContent } from '../components/ServicePage';

// Search intent and canonical URL are unique to this service route.
// Do not add personal identity schema or claim externally published App Store apps.
export const metadata: Metadata = {
  title: "Ecommerce Manager | Shopify Store Operations",
  description: "Shopify ecommerce management covering product catalogues, promotions, reporting, technical operations, B2B workflows, and customer journey improvements.",
  alternates: { canonical: '/ecommerce-management' },
  openGraph: { title: "Ecommerce Manager | Shopify Store Operations", description: "Shopify ecommerce management covering product catalogues, promotions, reporting, technical operations, B2B workflows, and customer journey improvements.", url: 'https://www.jrvallite.com/ecommerce-management' },
};

const content: ServiceContent = {
  // Keep this path aligned with this route's canonical metadata.
  path: '/ecommerce-management',
  "label": "ECOMMERCE MANAGER / SHOPIFY OPERATIONS",
  "heading": "Ecommerce Management for Shopify operations and growth",
  "lead": "Hands-on ecommerce operations with the technical depth to diagnose storefront problems, maintain product information, review performance, and coordinate improvements.",
  "audience": "For retailers and hiring teams seeking an ecommerce manager who can connect commercial priorities with Shopify execution.",
  "areas": [
    {
      "title": "Catalogue and merchandising",
      "description": "Product information, collections, metafields, promotional landing pages, and consistent customer-facing content."
    },
    {
      "title": "Promotions and operations",
      "description": "Discount logic, fulfilment constraints, shipping considerations, B2B purchasing flows, and workflow coordination."
    },
    {
      "title": "Reporting and prioritisation",
      "description": "Shopify Analytics, GA4, Klaviyo reporting, funnel analysis, and practical analysis of sales and conversion issues."
    },
    {
      "title": "Technical ownership",
      "description": "Coordinating fixes, maintaining Shopify themes, documenting changes, and communicating requirements to stakeholders."
    }
  ],
  "process": [
    {
      "title": "Review the operation",
      "description": "Examine catalogue quality, campaigns, technical blockers, reporting and purchase journeys."
    },
    {
      "title": "Prioritise",
      "description": "Rank work by customer impact, operational risk, evidence, and implementation effort."
    },
    {
      "title": "Deliver and report",
      "description": "Coordinate execution, verify changes, and report the results with clear caveats."
    }
  ],
  "evidence": [
    {
      "title": "Professional experience",
      "description": "Examples of ecommerce operations, technical project ownership, and Shopify maintenance.",
      "href": "/experience"
    },
    {
      "title": "Shopify Flow automation",
      "description": "Generalised examples for operations reporting, loyalty, and promotional processing.",
      "href": "/shopify-flow"
    },
    {
      "title": "Shipping integrations",
      "description": "A case study on resolving conflicts between delivery zones, subscriptions, and checkout rules.",
      "href": "/shipping-integration"
    }
  ]
};

export default function Page() {
  return <ServicePage content={content} />;
}
