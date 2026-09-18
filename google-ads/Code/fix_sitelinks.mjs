/**
 * fix_sitelinks.mjs
 * Removes all old cliffcomortgage.com sitelinks from the campaign.
 * Creates and attaches correct microsite sitelinks:
 *   Meet Julian       → /meet-julian/
 *   How a HECM Works  → /how-hecm-works/  (may already exist)
 *   Client Reviews    → /client-reviews/
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const env = readFileSync(join(ROOT, ".env"), "utf8");
const vars = {};
for (const line of env.split("\n")) {
  const m = line.match(/^([^#=]+)=(.*)/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CID,
        GOOGLE_ADS_CLIENT_SECRET: CS, GOOGLE_ADS_REFRESH_TOKEN: RT,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LCID, GOOGLE_ADS_CUSTOMER_ID: CUID } = vars;

const CAMPAIGN_ID = "23946171105";
const BASE_URL    = "https://cliffco-reverse-microsite.vercel.app";

const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CID, client_secret: CS, refresh_token: RT, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();
const h = { Authorization: "Bearer " + access_token, "developer-token": DEV, "login-customer-id": LCID, "Content-Type": "application/json" };

async function gads(path, body) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CUID}/${path}`, { method: "POST", headers: h, body: JSON.stringify(body) });
  const d = await r.json();
  if (d.error) throw new Error(path + ": " + (d.error.message ?? JSON.stringify(d.error)));
  return d;
}

// ── Step 1: Get all current campaign sitelinks with resource names ────────────
console.log("\n── Step 1: Fetch current sitelinks ──────────────────────────────");
const current = await gads("googleAds:search", {
  query: `SELECT campaign_asset.resource_name, asset.id, asset.sitelink_asset.link_text, asset.final_urls FROM campaign_asset WHERE campaign_asset.campaign = 'customers/${CUID}/campaigns/${CAMPAIGN_ID}' AND campaign_asset.field_type = 'SITELINK' AND campaign_asset.status != 'REMOVED'`,
});
const allSitelinks = current.results ?? [];
console.log(`  Found ${allSitelinks.length} sitelink(s) attached`);
allSitelinks.forEach(r => console.log(`    "${r.asset.sitelinkAsset?.linkText}" → ${(r.asset.finalUrls ?? []).join(", ")}`));

// ── Step 2: Remove sitelinks pointing to wrong domain ────────────────────────
console.log("\n── Step 2: Remove wrong-URL sitelinks ───────────────────────────");
const toRemove = allSitelinks.filter(r => {
  const urls = r.asset.finalUrls ?? [];
  return urls.some(u => !u.includes("cliffco-reverse-microsite.vercel.app"));
});

if (toRemove.length > 0) {
  const removeOps = toRemove.map(r => ({ remove: r.campaignAsset.resourceName }));
  await gads("campaignAssets:mutate", { operations: removeOps });
  console.log(`  ✓ Removed ${toRemove.length} wrong-URL sitelink(s)`);
} else {
  console.log("  Nothing to remove");
}

// ── Step 3: Check which correct sitelinks still need to be created ────────────
console.log("\n── Step 3: Create missing sitelink assets ────────────────────────");
const WANTED = [
  { linkText: "Meet Julian",      d1: "Your Local HECM Specialist",    d2: "Serving Long Island Seniors 25+ Yrs", url: BASE_URL + "/meet-julian/" },
  { linkText: "How a HECM Works", d1: "Understand Your Reverse Mortgage", d2: "Simple Step-by-Step Explanation",     url: BASE_URL + "/how-hecm-works/" },
  { linkText: "Client Reviews",   d1: "Real Stories From Local Seniors", d2: "See What Our Clients Are Saying",     url: BASE_URL + "/client-reviews/" },
];

// Re-fetch what's now attached (after removals)
const remaining = await gads("googleAds:search", {
  query: `SELECT campaign_asset.resource_name, asset.sitelink_asset.link_text, asset.final_urls FROM campaign_asset WHERE campaign_asset.campaign = 'customers/${CUID}/campaigns/${CAMPAIGN_ID}' AND campaign_asset.field_type = 'SITELINK' AND campaign_asset.status != 'REMOVED'`,
});
const attachedTexts = new Set((remaining.results ?? []).map(r => r.asset.sitelinkAsset?.linkText));
console.log(`  Already attached: ${[...attachedTexts].join(", ") || "none"}`);

const missing = WANTED.filter(w => !attachedTexts.has(w.linkText));
console.log(`  Need to create+attach: ${missing.map(w => w.linkText).join(", ") || "none"}`);

if (missing.length > 0) {
  const assetOps = missing.map(s => ({
    create: {
      finalUrls: [s.url],
      sitelinkAsset: { linkText: s.linkText, description1: s.d1, description2: s.d2 },
    },
  }));
  const assetResult = await gads("assets:mutate", { operations: assetOps });
  console.log(`  ✓ Created ${assetResult.results?.length ?? 0} asset(s)`);

  // ── Step 4: Attach new sitelinks to campaign ──────────────────────────────
  console.log("\n── Step 4: Attach to campaign ───────────────────────────────────");
  const attachOps = assetResult.results.map(r => ({
    create: {
      campaign: `customers/${CUID}/campaigns/${CAMPAIGN_ID}`,
      asset: r.resourceName,
      fieldType: "SITELINK",
    },
  }));
  const attachResult = await gads("campaignAssets:mutate", { operations: attachOps });
  console.log(`  ✓ Attached ${attachResult.results?.length ?? 0} sitelink(s)`);
}

// ── Final state ───────────────────────────────────────────────────────────────
const final = await gads("googleAds:search", {
  query: `SELECT asset.sitelink_asset.link_text, asset.final_urls FROM campaign_asset WHERE campaign_asset.campaign = 'customers/${CUID}/campaigns/${CAMPAIGN_ID}' AND campaign_asset.field_type = 'SITELINK' AND campaign_asset.status != 'REMOVED'`,
});
console.log("\n── Final sitelinks on campaign ──────────────────────────────────");
(final.results ?? []).forEach(r => {
  console.log(`  ✓ "${r.asset.sitelinkAsset?.linkText}" → ${(r.asset.finalUrls ?? []).join(", ")}`);
});
