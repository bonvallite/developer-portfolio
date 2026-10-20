// Pre-publication guard for this public repository. Scans every tracked file
// for credential formats, store identifiers and personal contact details.
// A pass does not prove a file is safe to publish: ownership and
// confidentiality still need a human review (see README security policy).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const RULES = [
  ["Shopify access token", /shp(at|ss|ca|pa)_[a-f0-9]{16,}/i],
  ["Stripe-style secret key", /\bsk_(live|test)_[A-Za-z0-9]{8,}/],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
  ["GitHub token", /\b(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})/],
  ["Slack token or webhook", /\bxox[abprs]-[A-Za-z0-9-]{10,}|hooks\.slack\.com\/services/],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/],
  ["Private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ["Bearer token", /Bearer\s+[A-Za-z0-9._~+/-]{24,}/],
  ["Hardcoded secret assignment", /(secret|password|api[_-]?key|token)\s*[:=]\s*["'][^"'\s]{8,}["']/i],
  ["Real myshopify domain", /\b[a-z0-9][a-z0-9-]*\.myshopify\.com\b/i],
  ["Shopify global ID with a numeric id", /gid:\/\/shopify\/[A-Za-z]+\/\d{3,}/],
  ["GA4 or GTM container ID", /\b(G-[A-Z0-9]{8,}|GTM-[A-Z0-9]{5,}|UA-\d{4,}-\d+)\b/],
  ["Email address", /[A-Za-z0-9._%+-]+@(?!example\.(com|org|net|invalid)\b)[A-Za-z0-9.-]+\.[a-z]{2,}/],
  ["Australian mobile number", /(\+?61\s?|0)4\d{2}\s?\d{3}\s?\d{3}\b/],
  ["Workers subdomain", /\b[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev\b/i],
];
// Deliberately public values (for example the contact email on the site) are
// listed in public-safety-allowlist.json and removed before matching.
const ALLOW = JSON.parse(readFileSync(new URL("./public-safety-allowlist.json", import.meta.url), "utf8")).allow;
const SKIP = [/^scripts\/check-public-safety\.mjs$/, /^scripts\/public-safety-allowlist\.json$/, /\.(png|jpe?g|gif|ico|woff2?)$/i, /^package-lock\.json$/];

const files = execFileSync("git", ["ls-files"], { encoding: "utf8" }).split("\n").filter(f => f && !SKIP.some(r => r.test(f)));
const findings = [];
for (const file of files) {
  readFileSync(file, "utf8").split("\n").forEach((raw, i) => {
    const line = ALLOW.reduce((text, value) => text.split(value).join(""), raw);
    for (const [label, pattern] of RULES) if (pattern.test(line)) findings.push(`${file}:${i + 1} ${label}`);
  });
}
if (findings.length) {
  console.error(`Publication safety check failed (${findings.length}):\n` + findings.join("\n"));
  process.exit(1);
}
console.log(`Publication safety check passed for ${files.length} tracked files.`);
