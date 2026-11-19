#!/usr/bin/env node
/**
 * Capture publicly accessible homepage screenshots at reproducible viewports.
 * Screenshots show observed output, not site ownership, design attribution,
 * commercial performance or consent to republish third-party brand assets.
 * An unsuccessful capture must never be represented by a generated mock-up.
 */
import { chromium } from 'playwright';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const stores = [
  ['peter-augustus', 'Peter Augustus', 'https://www.peteraugustus.com.au/'],
  ['poseidon-animal-health', 'Poseidon Animal Health', 'https://poseidonanimalhealth.com.au/'],
  ['eve-curls', 'Eve Curls', 'https://www.evecurls.com/'],
  ['jace-industries', 'Jace Industries', 'https://jaceindustries.com/'],
  ['colossal-diamond-tools', 'Colossal Diamond Tools', 'https://colossaldiamondtools.com/'],
  ['rene-ruiz-collection', 'Rene Ruiz Collection', 'https://reneruizcollection.com/'],
  ['urban-august', 'Urban August', 'https://urbanaugust.com/'],
  ['warehouse-lighting', 'Warehouse-Lighting', 'https://www.warehouse-lighting.com/'],
  ['skull-seeker', 'Skull Seeker', 'https://www.skullseeker.com/'],
  ['osoyoo', 'OSOYOO', 'https://osoyoo.com/'],
  ['axlrodd', 'Axlrodd', 'https://axlrodd.com/'],
  ['tronus-footwear', 'Tronus Footwear', 'https://tronusfootwear.com/'],
];

const output = path.resolve(process.env.CAPTURE_OUTPUT || 'capture-output');
const selected = process.env.CAPTURE_STORE || 'all';
const targets = selected === 'all' ? stores : stores.filter(([slug]) => slug === selected);
if (!targets.length) throw new Error('Unknown CAPTURE_STORE. Use all or a listed store slug.');
await mkdir(output, { recursive: true });
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const [slug, name, url] of targets) {
    for (const device of ['desktop', 'mobile']) {
      const viewport = device === 'desktop' ? { width: 1280, height: 800 } : { width: 390, height: 844 };
      const context = await browser.newContext({
        viewport, deviceScaleFactor: 1,
        ...(device === 'mobile' ? { isMobile: true, hasTouch: true } : {}),
        locale: 'en-AU', reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      const record = { slug, name, url, device, viewport, capturedAt: new Date().toISOString(), status: 'failed' };
      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 35000 });
        if (!response || response.status() >= 400) throw new Error('Homepage HTTP ' + (response?.status() ?? 'no response'));
        await page.waitForTimeout(1800);
        await page.evaluate(() => document.fonts.ready);
        const filename = `${slug}-${device}.png`;
        await page.screenshot({ path: path.join(output, filename), fullPage: false, animations: 'disabled', timeout: 15000 });
        const info = await stat(path.join(output, filename));
        if (info.size < 3000) throw new Error('Screenshot suspiciously small');
        Object.assign(record, { status: 'captured', filename, bytes: info.size, pageTitle: await page.title(), finalUrl: page.url(), httpStatus: response.status() });
      } catch (error) {
        record.error = String(error instanceof Error ? error.message : error).slice(0, 300);
      } finally {
        await context.close();
        results.push(record);
        console.log(`${record.status.padEnd(8)} ${slug} ${device}${record.error ? ': ' + record.error : ''}`);
      }
    }
  }
} finally { await browser.close(); }
await writeFile(path.join(output, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), source: 'playwright-chromium', results }, null, 2) + '\n');
const failed = results.filter((r) => r.status !== 'captured').length;
console.log(`${results.length - failed}/${results.length} captured. Manually inspect every screenshot before publication.`);
if (failed) process.exitCode = 1;
