// Synthetic navigation timing for a locally built JRV portfolio.
// Runs only inside GitHub Actions against its own Next.js server. It does not
// navigate to Vercel production, send personal data, or opt in to analytics.
// The unthrottled single-load lab samples are NOT real-user Core Web Vitals,
// a PageSpeed/Lighthouse audit, or evidence of Vercel CDN latency.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.JRV_LAB_BASE_URL || 'http://127.0.0.1:3100';
const outputDir = 'artifacts/performance-lab';
const routes = [
  { name: 'home', path: '/' },
  { name: 'cartoncloud', path: '/cartoncloud-integration' },
  { name: 'python', path: '/analytics-lab' },
  { name: 'b2b', path: '/b2b-modernisation' },
  { name: 'spend-save', path: '/projects/spend-and-save' },
  { name: 'logistics-studio', path: '/projects/commerce-integration-engineering' },
];
const viewports = [
  { name: 'desktop', width: 1366, height: 768 },
  { name: 'mobile', width: 390, height: 844 },
];
const report = {
  generatedAtUTC: new Date().toISOString(),
  gitCommit: process.env.GITHUB_SHA || null,
  target: 'locally built Next.js on the GitHub Actions runner',
  conditions: {
    samplesPerRouteAndViewport: 1,
    network: 'unthrottled runner loopback; not a visitor network or Vercel CDN',
    motion: 'reduced; no analytics consent granted',
    limitations: 'Navigation, FCP, observed LCP, and layout-shift are provisional lab readings. Do not present them as field Core Web Vitals, INP, or a Lighthouse score.',
  },
  samples: [],
};

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const size of viewports) {
    for (const route of routes) {
      const context = await browser.newContext({
        viewport: { width: size.width, height: size.height },
        reducedMotion: 'reduce',
        locale: 'en-AU',
      });
      try {
        await context.addInitScript(() => {
          // Observe after navigation starts, not after page JS has already loaded.
          window.__jrvLab = { lcpMs: null, cls: 0 };
          try {
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                window.__jrvLab.lcpMs = entry.startTime;
              }
            }).observe({ type: 'largest-contentful-paint', buffered: true });
          } catch { /* Some browser versions may not support this entry type. */ }
          try {
            new PerformanceObserver(list => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) window.__jrvLab.cls += entry.value;
              }
            }).observe({ type: 'layout-shift', buffered: true });
          } catch { /* An absent observer is reported as unavailable below. */ }
        });
        const page = await context.newPage();
        let runtimeErrorCount = 0;
        let unconsentedTrackingRequestCount = 0;
        page.on('pageerror', () => { runtimeErrorCount += 1; });
        page.on('request', request => {
          // Count only. Never persist URL query strings or other visitor data.
          if (/googletagmanager\.com|clarity\.ms|vercel-insights\.com|\/_vercel\/insights/i.test(request.url())) {
            unconsentedTrackingRequestCount += 1;
          }
        });
        const response = await page.goto(baseURL + route.path, {
          waitUntil: 'load',
          timeout: 45000,
        });
        assert.equal(response?.status(), 200, route.path + ' must respond HTTP 200');
        // Give buffered paint and layout-shift observers a deterministic window.
        await page.waitForTimeout(1100);
        const timings = await page.evaluate(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const fcp = performance.getEntriesByName('first-contentful-paint')[0];
          const resources = performance.getEntriesByType('resource');
          const sameOriginEncodedBytes = resources
            .filter(item => item.name.startsWith(window.location.origin + '/'))
            .reduce((total, item) => total + (item.encodedBodySize || 0), 0);
          const round = n => Number.isFinite(n) ? Math.round(n * 10) / 10 : null;
          const observer = window.__jrvLab || {};
          return {
            ttfbMs: navigation ? round(navigation.responseStart - navigation.requestStart) : null,
            domContentLoadedMs: navigation ? round(navigation.domContentLoadedEventEnd - navigation.startTime) : null,
            loadEventMs: navigation ? round(navigation.loadEventEnd - navigation.startTime) : null,
            fcpMs: fcp ? round(fcp.startTime) : null,
            observedLcpMs: typeof observer.lcpMs === 'number' ? round(observer.lcpMs) : null,
            observedCls: typeof observer.cls === 'number' ? Math.round(observer.cls * 10000) / 10000 : null,
            sameOriginEncodedBytes,
            hasH1: !!document.querySelector('h1'),
            horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 3,
          };
        });
        assert.ok(timings.hasH1, route.path + ' must have one visible H1');
        assert.equal(timings.horizontalOverflow, false, route.path + ' has horizontal overflow');
        assert.equal(runtimeErrorCount, 0, route.path + ' emitted a JS page error');
        assert.equal(unconsentedTrackingRequestCount, 0,
          route.path + ' requested optional analytics before consent');
        report.samples.push({
          route: route.path,
          viewport: size.name,
          width: size.width,
          height: size.height,
          ...timings,
          runtimeErrorCount,
          unconsentedTrackingRequestCount,
        });
        console.log('Local lab sample: ' + JSON.stringify(report.samples.at(-1)));
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  // A partial report is still useful if a later navigation fails.
  await writeFile(outputDir + '/report.json', JSON.stringify(report, null, 2) + '\n');
}
assert.equal(report.samples.length, routes.length * viewports.length,
  'All planned local performance samples should be collected');
console.log('Saved synthetic navigation sample report: ' + outputDir + '/report.json');
