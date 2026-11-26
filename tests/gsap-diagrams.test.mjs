// Contract tests for explanatory animation on existing project diagrams.
// Business rules are still tested in the independent CartonCloud/Shopify labs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const hook = read('app/components/useDiagramStageMotion.ts');
const shipping = read('app/shipping-integration/ShippingFlowMotion.tsx');
const shippingPage = read('app/shipping-integration/page.tsx');
const shippingCss = read('app/shipping-integration/shipping-case-study.css');
const commerce = read('app/projects/commerce-integration-engineering/SystemsLab.tsx');
const commerceCss = read('app/projects/commerce-integration-engineering/engineering-lab.css');
const carton = read('app/cartoncloud-integration/IntegrationLab.tsx');
const cartonCss = read('app/cartoncloud-integration/integration-lab.css');
const spend = read('app/projects/spend-and-save/SpendSaveSystemMap.tsx');
const guide = read('docs/GSAP_INTEGRATION.md');

test('GSAP focus follows selected React stage and reverts for reduced motion', () => {
  assert.match(hook, /^'use client';/);
  assert.match(hook, /useDiagramStageMotion\(stageKey: string\)/);
  assert.match(hook, /\[data-gsap-focus="true"\]/);
  assert.match(hook, /\[data-gsap-detail\]/);
  assert.match(hook, /prefers-reduced-motion: no-preference/);
  assert.match(hook, /revertOnUpdate: true/);
  assert.match(hook, /return \(\) => media\.revert\(\)/);
  assert.doesNotMatch(hook, /opacity:\s*0|visibility:\s*'hidden'|fetch\(|sendBeacon|dataLayer|localStorage/);
});
test('shipping responsibility map is readable without GSAP and replay is optional', () => {
  assert.match(shipping, /gsap\.registerPlugin\(useGSAP, ScrollTrigger\)/);
  assert.match(shipping, /ScrollTrigger\.create\(/);
  assert.match(shipping, /once: true/);
  assert.match(shipping, /sequence\.restart\(\)/);
  assert.match(shipping, /prefers-reduced-motion: no-preference/);
  assert.match(shippingPage, /<ShippingFlowMotion>/);
  assert.match(shippingPage, /<\/ShippingFlowMotion>/);
  assert.match(shippingPage, /Conceptual responsibility map, not a live integration/);
  assert.match(shippingCss, /\.shipping-story-replay\{display:none\}/);
  assert.doesNotMatch(shipping, /fetch\(|sendBeacon|dataLayer|localStorage|opacity:\s*0/);
});
test('engineering and CartonCloud timelines cannot play beyond their stage gates', () => {
  assert.match(commerce, /useDiagramStageMotion\(flowIndex/);
  assert.match(commerce, /Play flow/);
  assert.match(commerce, /Pause flow/);
  assert.match(commerce, /step>=flow\.steps\.length-1/);
  assert.match(commerce, /setPlaying\(false\);setFlowIndex\(index\)/);
  assert.match(commerce, /data-gsap-focus=/);
  assert.match(commerceCss, /\.cie-play-button\{display:none!important\}/);
  assert.match(carton, /useDiagramStageMotion\(scenario \+ ':' \+ step\)/);
  assert.match(carton, /Play trace/);
  assert.match(carton, /Pause trace/);
  assert.match(carton, /const last = stopAt \?\? stages\.length - 1/);
  assert.match(carton, /Math\.min\(index \+ 1, last\)/);
  assert.match(carton, /disabled=\{futureBlocked\}/);
  assert.match(cartonCss, /button\.is-play\{display:none!important\}/);
});
test('Spend and Save animated inspector is still controlled by manual selection', () => {
  assert.match(spend, /useDiagramStageMotion\(selected\)/);
  assert.match(spend, /aria-pressed=\{selected === item\.key\}/);
  assert.match(spend, /data-gsap-focus=\{selected === item\.key/);
  assert.match(spend, /data-gsap-detail/);
  assert.match(spend, /No real email has been sent/);
  assert.match(guide, /four existing diagrams/i);
  assert.match(guide, /fictional/i);
});
