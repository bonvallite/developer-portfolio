'use client';
/**
 * Public-safe, hand-authored engineering code inspector.
 * Examples are educational reconstructions, not production Worker source.
 * The ETA metafield names/types are backed by the inspected Worker; five-minute
 * email timing and SMS are user-reported store configuration, not Worker sends.
 */
import { useState } from 'react';
import { Check, ClipboardCopy, Code2, Database, LockKeyhole, Mail, MessageSquareText, Truck, Workflow } from 'lucide-react';

const SNIPPETS = [
 { title:'Webhook router', tag:'JAVASCRIPT', icon:Workflow,
   context:'A Worker fetch handler sends different events to their own functions. Real routes separately validate incoming requests.',
   code:[
    '// Example route names are deliberately fictional.',
    'export default {',
    '  async fetch(request, env) {',
    '    const path = new URL(request.url).pathname;',
    '    if (request.method !== "POST")',
    '      return new Response("Method not allowed", {status:405});',
    '    if (path === "/demo/order") return handleOrder(request, env);',
    '    if (path === "/demo/fulfilment") return handleFulfilment(request, env);',
    '    if (path === "/demo/tracking") return handleTracking(request, env);',
    '    return new Response("Not found", {status:404});',
    '  }',
    '};',
    '// Handler definitions omitted.'
   ].join('\n')
 },
 { title:'HMAC verification', tag:'SECURITY', icon:LockKeyhole,
   context:'Shopify signs raw webhook bodies. The real Worker uses Web Crypto HMAC-SHA256 and compares signatures. This excerpt demonstrates signing, not the full verification flow.',
   code:[
    '// A signing step from a conceptual HMAC verifier.',
    'async function signWebhookBody(rawBody, secret) {',
    '  const key = await crypto.subtle.importKey(',
    '    "raw", new TextEncoder().encode(secret),',
    '    {name:"HMAC",hash:"SHA-256"}, false, ["sign"]',
    '  );',
    '  return crypto.subtle.sign(',
    '    "HMAC", key, new TextEncoder().encode(rawBody)',
    '  );',
    '}',
    '// Verification also requires a supplied signature',
    '// and a timing-safe comparison. Reject missing secrets.'
   ].join('\n')
 },
 { title:'Workers KV', tag:'PERSISTENCE', icon:Database,
   context:'Workers KV allows the app backend to persist short-lived OAuth state and offline authorisation records across requests.',
   code:[
    '// Illustrative binding. No real OAuth state or token.',
    'async function saveOAuthState(env, state, shop) {',
    '  await env.TOKEN_STORE.put(',
    '    "oauth_state:" + state, JSON.stringify({shop}),',
    '    {expirationTtl:600}',
    '  );',
    '}',
    'async function loadOAuthState(env, state) {',
    '  const record = await env.TOKEN_STORE.get("oauth_state:" + state);',
    '  return record ? JSON.parse(record) : null;',
    '}',
    '// The live auth flow also checks cookie and query HMAC.'
   ].join('\n')
 },
 { title:'Delivery rules', tag:'DATE ENGINE', icon:Code2,
   context:'State-specific dispatch schedules and destination business days determine a delivery estimate. The public demo has a limited fictional dataset.',
   code:[
    '// UTC calendar for a deterministic educational example.',
    'function addBusinessDays(dispatch, count, isClosed) {',
    '  const result = new Date(dispatch);',
    '  let remaining = count;',
    '  while (remaining > 0) {',
    '    result.setUTCDate(result.getUTCDate()+1);',
    '    const day = result.getUTCDay();',
    '    if (day !== 0 && day !== 6 && !isClosed(result))',
    '      remaining--;',
    '  }',
    '  return result;',
    '}'
   ].join('\n')
 },
 { title:'CartonCloud REST', tag:'API ORCHESTRATION', icon:Truck,
   context:'The integration converts eligible Shopify fulfilments into an authenticated carrier consignment request and validates the response.',
   code:[
    '// This domain is invalid by design; no live API calls.',
    'async function submitFictionalConsignment(token, payload) {',
    '  const response = await fetch(',
    '    "https://example.invalid/fictional-consignments",',
    '    {method:"POST", headers:{',
    '      Authorization:"Bearer " + token,',
    '      "Content-Type":"application/json"',
    '    },body:JSON.stringify(payload)}',
    '  );',
    '  if (!response.ok) throw new Error("API rejected the request");',
    '  return response.json();',
    '}'
   ].join('\n')
 },
 { title:'Shopify GraphQL', tag:'WRITE-BACK', icon:Code2,
   context:'The app’s authorised Shopify connection writes metafields, tracking details and fulfilment events. This example contains a harmless fictional variable structure.',
   code:[
    '// Public-only representation; no real order IDs.',
    'const variables = {',
    '  fields: [{',
    '    ownerId: "EXAMPLE_ORDER_ID",',
    '    namespace: "custom",',
    '    key: "estimated_delivery_date",',
    '    type: "single_line_text_field",',
    '    value: "Example only"',
    '  }]',
    '};',
    '// Passed to a metafieldsSet GraphQL mutation,',
    '// which must check userErrors before reporting success.'
   ].join('\n')
 },
 // 22 Nov 2026: new separate order-created ETA -> customer notice examples.
 // Real Worker field names/types were reviewed; these are fabricated values,
 // not extracted customer data or working notification templates.
 { title:'ETA order metafields', tag:'ORDER DATA', icon:Database,
   context:'The Worker writes typed custom order metafields through the app’s authenticated Admin GraphQL call. These are metafields on the order, not metaobjects. Values and the email view below are fictional.',
   code:[
    '// Educational field set. Real order and postcode omitted.',
    'const fields = [',
    '  {namespace:"custom", key:"estimated_delivery_date",',
    '   type:"single_line_text_field", value:"Wed, 25 Nov 2026"},',
    '  {namespace:"custom", key:"estimated_delivery_date_iso",',
    '   type:"date", value:"2026-11-25"},',
    '  {namespace:"custom", key:"delivery_zone",',
    '   type:"single_line_text_field", value:"EXAMPLE WEDNESDAY ZONE"},',
    '  {namespace:"custom", key:"delivery_postcode",',
    '   type:"single_line_text_field", value:"DEMO-W"}',
    '];',
    '// Add a valid Shopify order ownerId to each item,',
    '// then call metafieldsSet and inspect userErrors.',
    '// Saving data does not itself send a customer email.'
   ].join('\n')
 },
 { title:'Customer message gating', tag:'REPORTED NOTIFICATIONS', icon:MessageSquareText,
   context:'A reported five-minute store notification uses ETA fields from the Worker; fulfilment and carrier tracking are later events. Email/SMS scheduling and delivery are separate store/provider responsibilities, not code verified in the Worker.',
   code:[
    '// Conceptual policy only: NO email, SMS or external calls.',
    'function chooseDemoMessage({minutes, etaSaved, fulfilled, hasTracking}) {',
    '  if (fulfilled) return {',
    '    type:"shipping_confirmation",',
    '    includeTracking:Boolean(hasTracking)',
    '  };',
    '  if (minutes >= 5 && etaSaved) return {',
    '    type:"estimated_delivery_email", includeTracking:false',
    '  };',
    '  return {type:"waiting"};',
    '}',
    '// Actual Shopify notification templates and SMS provider',
    '// require a separate audit; none was read or copied.'
   ].join('\n')
 },
 { title:'Status mapping', tag:'NORMALISATION', icon:Workflow,
   context:'Raw logistics states must be translated to the correct Shopify fulfilment status. Confirmed is not the same as collected or delivered.',
   code:[
    'const carrierMap = {',
    '  AWAITING_DROPOFF: "CONFIRMED",',
    '  COLLECTED: "CARRIER_PICKED_UP",',
    '  WITH_ON_FORWARDER: "IN_TRANSIT",',
    '  IN_TRANSIT_WAREHOUSE_DELIVERY: "OUT_FOR_DELIVERY",',
    '  DELIVERED: "DELIVERED"',
    '};',
    'function mapStatus(raw) {',
    '  const code = String(raw).trim().toUpperCase();',
    '  return carrierMap[code] || null;',
    '}'
   ].join('\n')
 }
] as const;

export default function CodeExplorer() {
  const [selected,setSelected]=useState(0);
  const [copied,setCopied]=useState(false);
  const active=SNIPPETS[selected];
  const copy=()=>{
    if (typeof navigator==='undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(active.code).then(()=>setCopied(true)).catch(()=>setCopied(false));
  };
  return <div className="cie-code-explorer">
    <div className="cie-code-tabs" role="group" aria-label="Select an engineering code example">
      {SNIPPETS.map(({title,icon:Icon},index)=><button key={title} type="button" className={selected===index?'is-active':''} aria-pressed={selected===index} onClick={()=>{setSelected(index);setCopied(false);}}><Icon size={16}/>{title}</button>)}
    </div>
    <div className="cie-editor">
      <div className="cie-editor-top">
        <div><span className="cie-window-dots" aria-hidden="true"><i/><i/><i/></span><span>jrv / educational-worker.js</span></div>
        <div><span>{active.tag}</span><button type="button" onClick={copy} aria-label="Copy displayed code">{copied?<Check size={15}/>:<ClipboardCopy size={15}/>} {copied?'Copied':'Copy'}</button></div>
      </div>
      <div className="cie-editor-body">
        <div className="cie-editor-lines" aria-hidden="true">{active.code.split('\n').map((_,i)=><span key={i}>{String(i+1).padStart(2,'0')}</span>)}</div>
        <pre><code>{active.code}</code></pre>
      </div>
      <div className="cie-editor-caption">
        <div><span>WHY THIS EXISTS</span><h3>{active.title}</h3><p>{active.context}</p></div>
        <div className="cie-editor-trust"><LockKeyhole size={17}/><span>Independently authored teaching example<br/>No production code or credentials</span></div>
      </div>
    </div>
  </div>;
}
