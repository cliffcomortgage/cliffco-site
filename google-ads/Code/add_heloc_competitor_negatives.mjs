/**
 * add_heloc_competitor_negatives.mjs
 *
 * Adds competitor and other-brand negatives to the existing shared list
 * "HELOC & Cash-Out — Research and Wrong-Product Negatives v1", which is already attached
 * to Minnesota — HELOC & Cash-Out Refinance.
 *
 * Why: $121.66 of the campaign's last 30 days went to four clicks on other companies'
 * products, at $12-39 each.
 *
 *   rocket home equity loan        $38.79
 *   aven competitors               $37.04
 *   point home equity investment   $33.66
 *   point home equity              $12.17
 *
 * Someone searching a competitor by name is researching that company, not looking for a
 * lender. At this campaign's $23 average cost per click, each one is expensive.
 *
 * Match types matter here. Several of these brand names are ordinary English words -
 * point, figure, better, discover, achieve, prosper - and a BROAD negative on a single
 * common word would block legitimate searches too. Those are added as PHRASE negatives
 * paired with a product word. Distinctive names (rocket, aven, sofi) are safe as BROAD.
 *
 * Run:  node Code/add_heloc_competitor_negatives.mjs            (dry run)
 *       node Code/add_heloc_competitor_negatives.mjs --apply
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APPLY = process.argv.includes("--apply");
const LIST_NAME = "HELOC & Cash-Out — Research and Wrong-Product Negatives v1";

const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;
const BASE = `https://googleads.googleapis.com/v24/customers/${CID}`;

/** Distinctive brand names - safe to block as BROAD, no ordinary meaning in this context. */
const BROAD_BRANDS = [
  "rocket mortgage", "rocket loans", "rocket home", "rocketmortgage",
  "aven", "sofi", "lendingtree", "nerdwallet", "bankrate", "pennymac",
  "loandepot", "newrez", "caliber home", "freedom mortgage", "mr cooper",
  "guaranteed rate", "quicken loans", "navy federal", "penfed", "third federal",
  "spring eq", "springeq", "hitch", "unlock technologies", "hometap", "unison",
  "lightstream", "upstart", "happy money",
];

/**
 * Brand names that are also ordinary words. Phrase-matched with a product word so a
 * genuine query is not caught. "point" alone would block "what's the point of a heloc";
 * "figure" alone would block "figure out a heloc payment".
 */
const PHRASE_BRANDS = [
  '"point home equity"', '"point heloc"', '"point com"',
  '"figure home equity"', '"figure heloc"', '"figure lending"',
  '"better mortgage"', '"better com"', '"better heloc"',
  '"discover home loans"', '"discover heloc"', '"discover home equity"',
  '"achieve loans"', '"achieve home equity"', '"prosper home equity"',
  '"chase heloc"', '"chase home equity"',
  '"wells fargo"', '"bank of america"', '"us bank"', '"citizens bank"',
  '"truist"', '"pnc heloc"', '"pnc home equity"',
];

/** Comparison shopping: researching the market, not choosing a lender. */
const COMPARISON = [
  "competitors", "competitor", "alternative", "alternatives",
  "reviews", "review", "rating", "ratings", "better business bureau", "bbb",
  "who has the best", "best company", "top lenders", "top 10", "ranked",
];

const RAW = [...BROAD_BRANDS, ...PHRASE_BRANDS, ...COMPARISON];
const NEGATIVES = [...new Set(RAW)];

const matchType = (t) => {
  if (t.startsWith("[") && t.endsWith("]")) return { text: t.slice(1, -1), matchType: "EXACT" };
  if (t.startsWith('"') && t.endsWith('"')) return { text: t.slice(1, -1), matchType: "PHRASE" };
  return { text: t, matchType: "BROAD" };
};
const hdrs = (token) => ({
  Authorization: `Bearer ${token}`, "developer-token": DEV,
  "login-customer-id": LOGIN_CID, "Content-Type": "application/json",
});

async function auth() {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
  });
  const j = await r.json();
  if (!r.ok || !j.access_token) throw new Error(`OAuth ${r.status}: ${j.error ?? ""}`);
  return j.access_token;
}
async function search(token, query) {
  const r = await fetch(`${BASE}/googleAds:search`, { method: "POST", headers: hdrs(token), body: JSON.stringify({ query }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`search ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}
async function mutate(token, service, operations) {
  const r = await fetch(`${BASE}/${service}:mutate`, { method: "POST", headers: hdrs(token), body: JSON.stringify({ operations }) });
  const d = await r.json();
  if (!r.ok) throw new Error(`${service} ${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d;
}

const main = async () => {
  const token = await auth();

  const sets = await search(token, `SELECT shared_set.resource_name, shared_set.name FROM shared_set WHERE shared_set.name = "${LIST_NAME}"`);
  if (!sets.length) throw new Error(`shared list not found: ${LIST_NAME}`);
  const sharedSet = sets[0].sharedSet.resourceName;

  // Don't re-add what's already there; the API rejects duplicates.
  const existing = await search(token, `SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion WHERE shared_set.resource_name = "${sharedSet}"`);
  const have = new Set(existing.map((e) => `${e.sharedCriterion.keyword.text}|${e.sharedCriterion.keyword.matchType}`));

  const toAdd = NEGATIVES.map(matchType).filter((k) => !have.has(`${k.text}|${k.matchType}`));

  console.log(`List     : "${LIST_NAME}"`);
  console.log(`Already  : ${existing.length} negatives`);
  console.log(`Proposed : ${NEGATIVES.length}, of which ${toAdd.length} are new`);
  const counts = toAdd.reduce((a, k) => { a[k.matchType] = (a[k.matchType] ?? 0) + 1; return a; }, {});
  console.log(`New      : ${JSON.stringify(counts)}`);

  if (!APPLY) {
    console.log("\nDRY RUN. Nothing changed. Re-run with --apply.\n");
    toAdd.forEach((k) => console.log(`  [${k.matchType}] ${k.text}`));
    return;
  }
  if (!toAdd.length) { console.log("\nNothing to add."); return; }

  const ops = toAdd.map((keyword) => ({ create: { sharedSet, keyword } }));
  const CHUNK = 500;
  for (let i = 0; i < ops.length; i += CHUNK) {
    await mutate(token, "sharedCriteria", ops.slice(i, i + CHUNK));
    console.log(`  · ${Math.min(i + CHUNK, ops.length)}/${ops.length}`);
  }
  console.log(`\n✓ Added ${toAdd.length} negatives. The list is already attached to the campaign, so they are live now.`);
};

main().catch((e) => { console.error("\n✗", e.message); process.exit(1); });
