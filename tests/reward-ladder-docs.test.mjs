import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(join(root, file), "utf8");
const DOCS = ["REWARD_LADDER_DEMO.md", "REWARD_LADDER_PLAN.md"];
const ROUTES = ["reward-ladder-demo", "reward-ladder-plan"];

test("every relative link in the reward ladder docs points at a file that exists", () => {
  for (const doc of DOCS) {
    for (const [, target] of read(doc).matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#|mailto:)/.test(target)) continue;
      const file = target.split("#")[0];
      assert.ok(existsSync(join(root, file)), `${doc} links to missing ${file}`);
    }
  }
});

test("each documented route has a page, and the homepage links to both", () => {
  const home = read("app/page.tsx");
  for (const route of ROUTES) {
    assert.ok(existsSync(join(root, "app", route, "page.tsx")), `missing route ${route}`);
    assert.ok(home.includes(`/${route}`), `homepage does not link to /${route}`);
  }
});

test("the case study anchor used in the docs matches a real heading", () => {
  const headings = read("CASE_STUDIES.md");
  assert.match(headings, /^## 19\. Planning a reward ladder before building it$/m);
  for (const file of ["README.md", "PORTFOLIO_INDEX.md", "REWARD_LADDER_PLAN.md"]) {
    const text = read(file);
    if (text.includes("planning-a-reward-ladder")) {
      assert.ok(text.includes("#19-planning-a-reward-ladder-before-building-it"), `${file} has a stale case study anchor`);
    }
  }
});

test("the plan page derives its examples from the engine and the demo offer, not literals", () => {
  const plan = read("app/reward-ladder-plan/page.tsx");
  assert.match(plan, /rewardLadderView/);
  assert.match(plan, /DEMO_OFFER_FIELDS/);
});
