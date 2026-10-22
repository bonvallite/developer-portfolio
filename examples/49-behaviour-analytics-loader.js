// Privacy-first loader for behaviour analytics (Microsoft Clarity and Hotjar).
// Illustrative, independently written. Project IDs are placeholders.
//
// 1. Wait for the visitor's analytics consent through Shopify's Customer
//    Privacy API, and load nothing before it.
// 2. Mask customer details so heatmaps and recordings never capture them.
// 3. Inject each tool's script once, from its official host.
//
// In a theme, call startBehaviourAnalytics(window, document, { clarityId, hotjarId })
// from a deferred script. window and document are passed in so it can be tested.

const SENSITIVE = 'input[type="email"], input[type="tel"], input[type="password"], [autocomplete*="address"], [autocomplete*="name"], [data-customer-detail]';

// Clarity masks elements marked data-clarity-mask; Hotjar suppresses data-hj-suppress.
export function maskSensitive(root) {
  const elements = root?.querySelectorAll?.(SENSITIVE) ?? [];
  for (const element of elements) {
    element.setAttribute("data-clarity-mask", "true");
    element.setAttribute("data-hj-suppress", "");
  }
  return elements.length;
}

// Calls onAllowed once analytics are allowed, now or after the visitor answers the banner.
export function whenAnalyticsAllowed(win, doc, onAllowed) {
  let done = false;
  const allow = () => { if (!done) { done = true; onAllowed(); } };
  const check = () => { if (win.Shopify?.customerPrivacy?.analyticsProcessingAllowed?.()) allow(); };
  doc.addEventListener("visitorConsentCollected", event => { if (event?.detail?.analyticsAllowed) allow(); });
  if (win.Shopify?.customerPrivacy) check();
  else win.Shopify?.loadFeatures?.([{ name: "consent-tracking-api", version: "0.1" }], error => { if (!error) check(); });
}

function addScript(doc, src) {
  if (doc.querySelector(`script[src="${src}"]`)) return false;
  const script = doc.createElement("script");
  script.async = true;
  script.src = src;
  doc.head.appendChild(script);
  return true;
}

export function loadClarity(win, doc, projectId) {
  if (!/^[a-z0-9]{6,16}$/i.test(String(projectId ?? ""))) return false;
  win.clarity = win.clarity || function (...args) { (win.clarity.q = win.clarity.q || []).push(args); };
  return addScript(doc, `https://www.clarity.ms/tag/${projectId}`);
}

export function loadHotjar(win, doc, siteId) {
  if (!/^\d{4,10}$/.test(String(siteId ?? ""))) return false;
  win.hj = win.hj || function (...args) { (win.hj.q = win.hj.q || []).push(args); };
  win._hjSettings = { hjid: Number(siteId), hjsv: 6 };
  return addScript(doc, `https://static.hotjar.com/c/hotjar-${siteId}.js?sv=6`);
}

export function startBehaviourAnalytics(win, doc, { clarityId, hotjarId } = {}) {
  whenAnalyticsAllowed(win, doc, () => {
    maskSensitive(doc);
    loadClarity(win, doc, clarityId);
    loadHotjar(win, doc, hotjarId);
  });
}
