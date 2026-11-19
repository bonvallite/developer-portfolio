import type { Metadata } from 'next';
import ServicePage, { type ServiceContent } from '../components/ServicePage';

// Search intent and canonical URL are unique to this service route.
// Do not add personal identity schema or claim externally published App Store apps.
export const metadata: Metadata = {
  title: "Custom Shopify Apps & API Integration Developer",
  description: "Custom Shopify app and API integration engineering with GraphQL, REST, OAuth, webhooks, Cloudflare Workers, fulfilment automation and serverless workflows.",
  alternates: { canonical: '/shopify-app-development' },
  openGraph: { title: "Custom Shopify Apps & API Integration Developer", description: "Custom Shopify app and API integration engineering with GraphQL, REST, OAuth, webhooks, Cloudflare Workers, fulfilment automation and serverless workflows.", url: 'https://www.jrvallite.com/shopify-app-development' },
};

const content: ServiceContent = {
  // Keep this path aligned with this route's canonical metadata.
  path: '/shopify-app-development',
  "label": "SHOPIFY APPS / API INTEGRATIONS",
  "heading": "Custom Shopify Apps and API Integrations",
  "lead": "Connect Shopify to external systems using custom application logic, authenticated APIs, webhooks, and serverless infrastructure designed around reliable ecommerce operations.",
  "audience": "For Shopify merchants and engineering teams needing a custom integration or automation, rather than an off-the-shelf app.",
  "areas": [
    {
      "title": "Shopify APIs and authentication",
      "description": "REST and GraphQL workflows, OAuth concepts, authenticated requests, and responsible credential handling."
    },
    {
      "title": "Webhooks and event processing",
      "description": "Webhook verification, event deduplication, retries, state transitions, and fulfilment status synchronisation patterns."
    },
    {
      "title": "Serverless custom applications",
      "description": "Cloudflare Worker-based application logic and API endpoints to connect Shopify with third-party systems."
    },
    {
      "title": "Operational integration",
      "description": "Shipping estimates, warehouse tracking, customer notifications, and maintainable cross-system data flows."
    }
  ],
  "process": [
    {
      "title": "Define the contract",
      "description": "Identify the systems, events, permissions, data mappings, and failure conditions."
    },
    {
      "title": "Build and document",
      "description": "Implement the relevant API flows and business rules with change tracking and security safeguards."
    },
    {
      "title": "Test edge cases",
      "description": "Check authentication, duplicate events, retries, unexpected responses, and deployment behaviour."
    }
  ],
  "evidence": [
    {
      "title": "Shopify–CartonCloud integration",
      "description": "Case study documenting a custom delivery application, serverless Worker, and fulfilment tracking integration.",
      "href": "/cartoncloud-integration"
    },
    {
      "title": "Delivery calculator demonstration",
      "description": "An independently authored postcode and dispatch-date rules demonstration.",
      "href": "/chilled-delivery-demo"
    },
    {
      "title": "Shopify Flow automation",
      "description": "Examples of rule-based operations automation and workflow design.",
      "href": "/shopify-flow"
    }
  ]
};

export default function Page() {
  return <ServicePage content={content} />;
}
