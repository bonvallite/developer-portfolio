import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const dir=path.join(process.cwd(),'app','b2b-modernisation');
const view=fs.readFileSync(path.join(dir,'CinematicB2B.tsx'),'utf8');
const css=fs.readFileSync(path.join(dir,'cinematic.css'),'utf8');
const route=fs.readFileSync(path.join(dir,'page.tsx'),'utf8');

test('five chapters, interactive price catalogue, six-step journey, and impact tabs render',()=>{
  for(const id of ['challenge','transformation','price-lab','buying-journey','business-impact']) {
    assert.ok(view.includes('id="'+id+'"'),'Missing chapter '+id);
  }
  assert.equal((view.match(/label:'(Apply|Review|Assign|Notify|Sign in|Purchase)'/g)||[]).length,6);
  for(const item of ['Catalogue 1','Catalogue 2','Catalogue 3','Catalogue 4']) assert.ok(view.includes(item));
  for(const key of ['setMarketIndex','setEligible','setJourneyStep','setHistoryMode','setSelectedMonth']) assert.ok(view.includes(key));
});

test('historical native and tagged series remain separate, scenario always labelled',()=>{
  assert.match(view,/native:6552\.75/);
  assert.match(view,/legacy:6114\.69/);
  assert.match(view,/broader:5747\.16/);
  assert.match(view,/native:3984\.25/);
  assert.match(view,/i<=6\?m\.native:monthly\[6\]\.native\+\(i-6\)\*10000/);
  assert.match(view,/not actual Shopify sales result/i);
  assert.match(view,/must not be added together/i);
  assert.match(view,/exact launch date/i);
});

test('public safety, semantics, and reduced-motion support',()=>{
  assert.ok(!/Peter_Augustus_All_Reports_Master/i.test(view),'Private reporting filename must not appear');
  assert.ok(!/customer_id|company_id|shopify_offline_access_token/i.test(view),'No identifiers or credentials');
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(view,/aria-pressed/);
  assert.match(view,/aria-live="polite"/);
  assert.match(route,/metadata: Metadata/);
  assert.match(route,/alternates: \{ canonical: '\/b2b-modernisation' \}/);
});
