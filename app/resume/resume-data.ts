// Public résumé content approved for publication by its owner on 2026-11-20.
// Both layouts and all downloadable versions consume this single source of truth.
// Date and contact changes must be made here to prevent divergent documents.
export type Entry = { employer: string; role: string; dates: string; bullets: string[] };
export const contact = {
  name: 'Jomar Rhandy C. Vallite',
  title: 'Senior Shopify Developer & Ecommerce Manager',
  focus: 'Systems Architecture | Integrations | CRO',
  email: 'hello@jrvallite.com',
  phone: '+63 907 548 0000',
  portfolio: 'jrvallite.com',
  linkedin: 'linkedin.com/in/bonvallite',
  github: 'github.com/bonvallite'
};
export const summary = 'Shopify developer and ecommerce systems specialist combining storefront engineering, day-to-day ecommerce operations, B2B workflows, third-party integrations, and conversion optimization. Experience across Australian and international Shopify businesses, with an emphasis on accessible storefronts, practical automation, and maintainable solutions.';
export const skills = [
 'Shopify 2.0, Liquid, JavaScript, HTML and CSS','Shopify Flow, B2B and catalog rules',
 'REST, GraphQL, webhooks and Cloudflare Workers','Checkout funnel optimization and technical SEO',
 'GA4, Google Tag Manager and Search Console','Klaviyo, Recharge, Zapiet, GitHub and Vercel'
];
export const experience: Entry[] = [
 {employer:'Peter Augustus',role:'Shopify Development & Ecommerce Operations',dates:'February 2026 - Present',bullets:[
  'Maintain responsive Shopify product pages, collections, campaign landing pages, theme quality, and navigation.',
  'Support B2B catalog configuration, promotional logic, shipping rules, and subscription operations.',
  'Develop and troubleshoot Shopify-to-fulfillment workflows using Cloudflare Workers, webhooks, delivery estimates, and tracking updates.',
  'Investigate GA4 and Shopify conversion funnels, JavaScript errors, attribution, and technical SEO.',
  'Document implementations, maintain source-control backups, and validate releases.'
 ]},
 {employer:'Independent / Remote',role:'Senior Shopify Developer & Ecommerce Architect',dates:'January 2019 - February 2026',bullets:[
  'Jace Industries: Shopify storefront development, procurement, logistics, product data, and operational pricing.',
  'Eve Curls (Netherlands): Multi-market configuration for pricing, currencies, localization, and storefront UX.',
  'Colossal Diamond Tools (USA): Shopify catalog migration and Zoho Books ERP and inventory integration.',
  'Rene Ruiz Collection (USA): Ecommerce storefront and conversion journey development.',
  'Poseidon Animal Health (Australia): Product bundles, tiered promotions, and international customer journeys.',
  'Nudel.shop: Shopify theme customization, performance optimization, and backend improvements.'
 ]},
 {employer:'Atomic Growth (Israel)',role:'Ecommerce Specialist, Shopify & Amazon',dates:'April 2017 - December 2018',bullets:['Supported ecommerce marketplace operations, pricing, and growth workflows across Shopify and Amazon.']},
 {employer:'AT&T Fiber',role:'Billing Specialist / Customer Finance',dates:'January 2016 - April 2017',bullets:['Resolved complex billing inquiries and assisted with account and technical-process investigations.']},
 {employer:'UP Manila National Telehealth Center',role:'Systems & Mobile App Developer',dates:'January 2014 - November 2015',bullets:['Worked on electronic medical record solutions supporting the rCHITS health information initiative.']},
 {employer:'Provincial Government of Bukidnon',role:'Administrative Aide, Procurement',dates:'June 2012 - December 2013',bullets:['Supported supplier coordination, quotations, purchasing processes, and procurement documentation.']}
];
export const projects = [
 {name:'Shopify to Fulfillment Integration',stack:'Cloudflare Workers / Webhooks',detail:'Delivery estimates, tracking updates, retry handling, and Shopify order synchronization.'},
 {name:'Gift-With-Purchase Reward Journeys',stack:'Shopify Flow / Customer Experience',detail:'Cart progress interfaces with rewards enforced by post-checkout automation.'},
 {name:'Analytics & Conversion Investigation',stack:'Shopify Analytics / GA4 / GTM',detail:'Checkout funnels, device and channel discrepancies, tracking quality, and storefront errors.'}
];
export const education = [
 {name:'University of Southern Mindanao',detail:'Bachelor of Science in Computer Science | 2005-2010'}
];
