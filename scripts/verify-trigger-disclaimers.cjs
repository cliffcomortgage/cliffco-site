/*
 * Trigger-term disclaimer verification.
 *
 *   cd website && npm run build
 *   node scripts/verify-trigger-disclaimers.cjs           # check
 *   node scripts/verify-trigger-disclaimers.cjs --write   # update the route map
 *
 * Stating a down payment in advertising is a trigger term: the page carrying it has to show
 * the worked example behind the figure. The eight examples live in
 * `compliance/Trigger Terms Disclaimers (2).xlsx` and are reproduced verbatim in
 * `website/src/data/trigger-disclaimers.ts`.
 *
 * This script rederives, from the BUILT html, which pages state which figures, and fails if
 * that disagrees with the committed map or if any page is missing a disclaimer it owes.
 * Scanning the build rather than the source is deliberate: figures reach pages through
 * shared data modules and components, so the source does not tell you which pages display
 * them, and several affected routes are dynamic.
 *
 * Exits non-zero on any disagreement, so it can gate a release.
 */
const fs = require("fs");
const path = require("path");

const REPO = path.join(__dirname, "..");
const ROOT = path.join(REPO, "website/dist/client");
const DATA = path.join(REPO, "website/src/data/trigger-disclaimers.ts");
const WRITE = process.argv.includes("--write");

if (!fs.existsSync(ROOT)) {
  console.error("No build found at website/dist/client. Run `npm run build` in website/ first.");
  process.exit(2);
}

/** Every scenario in the sheet, as (loan type, percentage, key). */
const SCENARIOS = [
  ["VA", "0", "VA_0"], ["USDA", "0", "USDA_0"],
  ["CONV", "3", "CONV_3"], ["CONV", "5", "CONV_5"], ["CONV", "10", "CONV_10"], ["CONV", "20", "CONV_20"],
  ["FHA", "3.5", "FHA_3_5"], ["FHA", "10", "FHA_10"],
];
const LABELS = {
  VA_0: "VA, 0% down", USDA_0: "USDA, 0% down", FHA_3_5: "FHA, 3.5% down", FHA_10: "FHA, 10% down",
  CONV_3: "Conventional, 3% down", CONV_5: "Conventional, 5% down",
  CONV_10: "Conventional, 10% down", CONV_20: "Conventional, 20% down",
};
const ORDER = ["VA_0", "USDA_0", "FHA_3_5", "FHA_10", "CONV_3", "CONV_5", "CONV_10", "CONV_20"];

/*
 * A mention earns a disclaimer when BOTH its percentage and its loan type match a scenario.
 * With no loan type beside the figure, every scenario at that percentage applies — on a
 * disclosure, one too many is safe and one too few is not. Where a type IS named and no
 * scenario pairs with it, the figure is not one of the eight: a VA page quoting the
 * funding-fee tiers at "5% or 10% down" is not describing Conventional 5% down.
 */
function match(pct, types) {
  const cands = SCENARIOS.filter(([, p]) => p === pct);
  if (!cands.length) return [];
  if (!types.length) return cands.map((c) => c[2]);
  return cands.filter(([t]) => types.includes(t)).map((c) => c[2]);
}

const NUM = /(\d{1,2}(?:\.\d)?)\s*%\s*(?:or more\s+)?(?:down\s*payment|down)\b/gi;
const ZERO = /\b(?:no|zero)\s+(?:money\s+)?down\b|\bno\s+down\s*payment\b|\bzero[- ]down\b|\$0\s+down\b|\b0\s*%\s*down\b/gi;
const VA_RE = /\bVA\b|veteran|service member|active.duty|surviving spouse/i;
const USDA_RE = /\bUSDA\b|\brural\b/i;
const FHA_RE = /\bFHA\b|203\(?k\)?/i;
const CONV_RE = /\bconventional\b|\bconforming\b|HomeReady|HomeStyle|\bPMI\b/i;
const near = (t, i, re, span = 220) => re.test(t.slice(Math.max(0, i - span), i + span));

function text(html) {
  return html
    // The disclaimers themselves quote down payments. Strip the block before scanning or
    // every disclosed page re-triggers on its own disclosure.
    .replace(/<section[^>]*aria-label="Mortgage example disclosures"[\s\S]*?<\/section>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ").replace(/&[nm]dash;/g, "-")
    .replace(/\s+/g, " ");
}

const pages = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name === "index.html") pages.push(p);
  }
})(ROOT);

const rootFwd = ROOT.replace(/\\/g, "/");
const derived = {}, rendered = {};
for (const p of pages) {
  // Normalise separators BEFORE stripping the prefix: on Windows, path.join yields
  // backslashes and a forward-slash replace silently leaves the absolute path behind.
  const dir = path.dirname(p).replace(/\\/g, "/");
  const route = (dir.replace(rootFwd, "") || "") + "/";
  const html = fs.readFileSync(p, "utf8");
  rendered[route] = ORDER.filter((k) => html.includes(LABELS[k]));

  const t = text(html);
  const found = new Set();
  const typesNear = (i) => {
    const o = [];
    if (near(t, i, VA_RE)) o.push("VA");
    if (near(t, i, USDA_RE)) o.push("USDA");
    if (near(t, i, FHA_RE)) o.push("FHA");
    if (near(t, i, CONV_RE)) o.push("CONV");
    return o;
  };
  for (const m of t.matchAll(NUM)) {
    for (const h of match(m[1].replace(/\.0$/, ""), typesNear(m.index))) found.add(h);
  }
  for (const m of t.matchAll(ZERO)) {
    for (const h of match("0", typesNear(m.index))) found.add(h);
  }
  if (found.size) derived[route] = ORDER.filter((s) => found.has(s));
}

/* ── committed map ─────────────────────────────────────────────────────── */
const src = fs.readFileSync(DATA, "utf8");
const block = src.match(/export const TRIGGER_ROUTES[^{]*\{([\s\S]*?)\n\};/);
if (!block) { console.error("Could not read TRIGGER_ROUTES from trigger-disclaimers.ts"); process.exit(2); }
const committed = {};
for (const m of block[1].matchAll(/"([^"]+)":\s*\[([^\]]*)\]/g)) {
  committed[m[1]] = (m[2].match(/"[A-Z0-9_]+"/g) || []).map((s) => s.slice(1, -1));
}

/* ── compare ───────────────────────────────────────────────────────────── */
const problems = [];
const routes = [...new Set([...Object.keys(derived), ...Object.keys(committed)])].sort();
for (const r of routes) {
  // Compare as sets. The committed map and this scan may list the same scenarios in
  // different orders, and a disclosure is not wrong because it is sorted differently.
  const d = derived[r] || [], c = committed[r] || [];
  if ([...d].sort().join(",") !== [...c].sort().join(",")) {
    problems.push(`MAP DRIFT   ${r}\n    page states: ${d.join(", ") || "(none)"}\n    map says   : ${c.join(", ") || "(none)"}`);
  }
}
for (const [r, owed] of Object.entries(committed)) {
  const shown = rendered[r];
  if (shown === undefined) { problems.push(`NOT BUILT   ${r}`); continue; }
  const absent = owed.filter((s) => !shown.includes(s));
  if (absent.length) problems.push(`NOT SHOWN   ${r}  missing: ${absent.join(", ")}`);
}

if (WRITE && problems.some((p) => p.startsWith("MAP DRIFT"))) {
  const lines = Object.entries(derived).sort().map(([r, v]) => `  "${r}": [${v.map((s) => `"${s}"`).join(", ")}],`).join("\n");
  fs.writeFileSync(DATA, src.replace(/(export const TRIGGER_ROUTES[^{]*\{)[\s\S]*?(\n\};)/, `$1\n${lines}$2`));
  console.log(`Rewrote TRIGGER_ROUTES: ${Object.keys(derived).length} routes. Rebuild and re-run to confirm.`);
  process.exit(0);
}

console.log(`${pages.length} rendered pages scanned`);
console.log(`${Object.keys(derived).length} state a down-payment figure covered by the eight scenarios`);
if (!problems.length) {
  console.log("\nEvery page that states one of the eight figures shows its disclaimer, and the map matches the build.");
  process.exit(0);
}
console.log(`\n${problems.length} problem(s):\n`);
for (const p of problems) console.log("  " + p);
console.log("\nIf a page legitimately gained or lost a figure, re-run with --write, rebuild, then re-run to confirm.");
process.exit(1);
