import type { Metadata } from 'next';
import ServicePage, { type ServiceContent } from '../components/ServicePage';

// Search intent and canonical URL are unique to this service route.
// Do not add personal identity schema or claim externally published App Store apps.
export const metadata: Metadata = {
  title: "Shopify Developer | Liquid, Themes & B2B",
  description: "Shopify theme development, Liquid, custom storefront sections, product pages, B2B workflows and technical troubleshooting, supported by practical project examples.",
  alternates: { canonical: '/shopify-developer' },
  openGraph: { title: "Shopify Developer | Liquid, Themes & B2B", description: "Shopify theme development, Liquid, custom storefront sections, product pages, B2B workflows and technical troubleshooting, supported by practical project examples.", url: 'https://www.jrvallite.com/shopify-developer' },
};

const content: ServiceContent = {
  // Keep this path aligned with this route's canonical metadata.
  path: '/shopify-developer',
  "label": "SHOPIFY DEVELOPER / THEME ENGINEERING",
  "heading": "Shopify Developer for custom storefronts and B2B commerce",
  "lead": "Build and maintain Shopify storefronts with Liquid, Online Store 2.0 theme architecture, responsive customer journeys, and disciplined change management.",
  "audience": "For ecommerce teams looking to hire a Shopify developer or commission improvements to an existing Shopify store.",
  "areas": [
    {
      "title": "Shopify theme development",
      "description": "Custom sections, blocks, templates, product detail pages, and mobile-first layouts built around maintainable Liquid, HTML, CSS, and JavaScript."
    },
    {
      "title": "Product data and B2B",
      "description": "Metafields, product attributes, wholesale purchasing concepts, and Shopify B2B catalogue experiences."
    },
    {
      "title": "Storefront troubleshooting",
      "description": "Investigating broken interfaces, script conflicts, delivery components, accessibility problems, and performance regressions."
    },
    {
      "title": "Integration-aware development",
      "description": "Storefront experiences that work with the wider ecommerce stack, including fulfilment systems, subscriptions, and checkout constraints."
    }
  ],
  "process": [
    {
      "title": "Assess",
      "description": "Review store requirements, affected templates, dependencies, and measurable customer pain points."
    },
    {
      "title": "Implement",
      "description": "Develop focused changes with readable comments, version control, and compatibility checks."
    },
    {
      "title": "Verify",
      "description": "Test critical pages, responsive states, and relevant journeys; document limitations and follow-up work."
    }
  ],
  "evidence": [
    {
      "title": "Custom homepage architecture",
      "description": "A modular Shopify homepage case study with responsive sections and theme-editor considerations.",
      "href": "/editorial-homepage-demo"
    },
    {
      "title": "B2B pricing simulator",
      "description": "An independent fictional wholesale calculator demonstrating weight-based purchasing logic.",
      "href": "/b2b-demo"
    },
    {
      "title": "Shopify experience",
      "description": "A broader overview of storefront development, product data, and ecommerce engineering work.",
      "href": "/experience"
    }
  ]
};

export default function Page() {
  return <ServicePage content={content} />;
}
