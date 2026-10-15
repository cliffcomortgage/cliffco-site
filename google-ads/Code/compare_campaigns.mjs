/**
 * compare_campaigns.mjs
 *
 * Side-by-side audit of two campaigns across every setting that can explain a performance
 * gap. Read-only.
 *
 * Built to answer "the NJ campaign works and the MN one doesn't - what else is different?"
 * so it deliberately covers the boring settings that rarely get looked at: networks, geo
 * targeting, ad schedule, device performance, impression share and what is losing it, ad
 * strength, and which assets exist.
 *
 * Usage: node Code/compare_campaigns.mjs "NJ" "Minnesota — HELOC"
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const A = process.argv[2] ?? "NJ";
const B = process.argv[3] ?? "Minnesota — HELOC";
const RANGE = "LAST_30_DAYS";

const vars = {};
for (const l of readFileSync(join(ROOT, ".env"), "utf8").split("\n")) {
  const m = l.match(/^([^#=]+)=(.*)$/);
  if (m) vars[m[1].trim()] = m[2].trim();
}
const { GOOGLE_ADS_DEVELOPER_TOKEN: DEV, GOOGLE_ADS_CLIENT_ID: CLIENT_ID,
        GOOGLE_ADS_CLIENT_SECRET: CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN: REFRESH,
        GOOGLE_ADS_LOGIN_CUSTOMER_ID: LOGIN_CID, GOOGLE_ADS_CUSTOMER_ID: CID } = vars;

const tr = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: REFRESH, grant_type: "refresh_token" }),
});
const { access_token } = await tr.json();

async function q(gaql) {
  const r = await fetch(`https://googleads.googleapis.com/v24/customers/${CID}/googleAds:search`, {
    method: "POST",
    headers: { Authorization: `Bearer ${access_token}`, "developer-token": DEV, "login-customer-id": LOGIN_CID, "Content-Type": "application/json" },
    body: JSON.stringify({ query: gaql }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`${r.status}: ${JSON.stringify(d.error?.details?.[0]?.errors ?? d.error?.message)}`);
  return d.results ?? [];
}

const usd = (m) => "$" + (Number(m ?? 0) / 1e6).toFixed(2);
const pct = (n) => (n === undefined || n === null) ? "-" : (Number(n) * 100).toFixed(1) + "%";
const hr = (t) => console.log("\n" + "=".repeat(86) + "\n" + t + "\n" + "=".repeat(86));
const row = (label, a, b) => console.log("  " + String(label).padEnd(26) + String(a ?? "-").padEnd(30) + String(b ?? "-"));

// Resolve both campaigns.
const camps = await q(`SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
  campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros,
  campaign.network_settings.target_google_search, campaign.network_settings.target_search_network,
  campaign.network_settings.target_content_network,
  campaign_budget.amount_micros, campaign_budget.delivery_method
  FROM campaign WHERE campaign.status != 'REMOVED'`);
const find = (needle) => camps.find((c) => c.campaign.name.toLowerCase().includes(needle.toLowerCase()));
const ca = find(A), cb = find(B);
if (!ca || !cb) throw new Error(`could not match both campaigns (${A} / ${B})`);
const ids = [ca.campaign.id, cb.campaign.id];

hr("1. CAMPAIGN SETTINGS");
console.log("  " + "".padEnd(26) + ca.campaign.name.slice(0, 28).padEnd(30) + cb.campaign.name.slice(0, 28));
console.log("  " + "-".repeat(84));
row("status", ca.campaign.status, cb.campaign.status);
row("channel", ca.campaign.advertisingChannelType, cb.campaign.advertisingChannelType);
row("bidding", ca.campaign.biddingStrategyType, cb.campaign.biddingStrategyType);
row("cpc ceiling", ca.campaign.targetSpend?.cpcBidCeilingMicros ? usd(ca.campaign.targetSpend.cpcBidCeilingMicros) : "none",
                   cb.campaign.targetSpend?.cpcBidCeilingMicros ? usd(cb.campaign.targetSpend.cpcBidCeilingMicros) : "none");
row("daily budget", usd(ca.campaignBudget?.amountMicros), usd(cb.campaignBudget?.amountMicros));

row("google search", ca.campaign.networkSettings?.targetGoogleSearch, cb.campaign.networkSettings?.targetGoogleSearch);
row("search partners", ca.campaign.networkSettings?.targetSearchNetwork, cb.campaign.networkSettings?.targetSearchNetwork);
row("display network", ca.campaign.networkSettings?.targetContentNetwork, cb.campaign.networkSettings?.targetContentNetwork);

hr(`2. PERFORMANCE (${RANGE})`);
const perf = await q(`SELECT campaign.id, metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc,
  metrics.cost_micros, metrics.conversions, metrics.search_impression_share,
  metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share
  FROM campaign WHERE segments.date DURING ${RANGE} AND campaign.id IN (${ids.join(",")})`);
const pm = (id) => perf.find((p) => p.campaign.id === id)?.metrics ?? {};
const ma = pm(ca.campaign.id), mb = pm(cb.campaign.id);
row("impressions", ma.impressions ?? 0, mb.impressions ?? 0);
row("clicks", ma.clicks ?? 0, mb.clicks ?? 0);
row("CTR", pct(ma.ctr), pct(mb.ctr));
row("avg CPC", usd(ma.averageCpc), usd(mb.averageCpc));
row("spend", usd(ma.costMicros), usd(mb.costMicros));
row("conversions", Number(ma.conversions ?? 0).toFixed(1), Number(mb.conversions ?? 0).toFixed(1));
row("impression share", pct(ma.searchImpressionShare), pct(mb.searchImpressionShare));
row("IS lost to budget", pct(ma.searchBudgetLostImpressionShare), pct(mb.searchBudgetLostImpressionShare));
row("IS lost to rank", pct(ma.searchRankLostImpressionShare), pct(mb.searchRankLostImpressionShare));

hr("3. STRUCTURE");
for (const [label, id] of [["A", ca.campaign.id], ["B", cb.campaign.id]]) { void label; void id; }
const ags = await q(`SELECT campaign.id, ad_group.id, ad_group.status FROM ad_group WHERE campaign.id IN (${ids.join(",")}) AND ad_group.status != 'REMOVED'`);
const kws = await q(`SELECT campaign.id, ad_group_criterion.keyword.match_type, ad_group_criterion.status
  FROM ad_group_criterion WHERE campaign.id IN (${ids.join(",")}) AND ad_group_criterion.type = KEYWORD AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status != 'REMOVED'`);
const ads = await q(`SELECT campaign.id, ad_group_ad.ad.type, ad_group_ad.status, ad_group_ad.ad_strength
  FROM ad_group_ad WHERE campaign.id IN (${ids.join(",")}) AND ad_group_ad.status != 'REMOVED'`);
const cnt = (arr, id, f = () => true) => arr.filter((x) => x.campaign.id === id && f(x)).length;
row("ad groups (enabled)", cnt(ags, ca.campaign.id, (x) => x.adGroup.status === "ENABLED"), cnt(ags, cb.campaign.id, (x) => x.adGroup.status === "ENABLED"));
row("keywords (enabled)", cnt(kws, ca.campaign.id, (x) => x.adGroupCriterion.status === "ENABLED"), cnt(kws, cb.campaign.id, (x) => x.adGroupCriterion.status === "ENABLED"));
row("  phrase", cnt(kws, ca.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "PHRASE" && x.adGroupCriterion.status === "ENABLED"), cnt(kws, cb.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "PHRASE" && x.adGroupCriterion.status === "ENABLED"));
row("  exact", cnt(kws, ca.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "EXACT" && x.adGroupCriterion.status === "ENABLED"), cnt(kws, cb.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "EXACT" && x.adGroupCriterion.status === "ENABLED"));
row("  broad", cnt(kws, ca.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "BROAD" && x.adGroupCriterion.status === "ENABLED"), cnt(kws, cb.campaign.id, (x) => x.adGroupCriterion.keyword.matchType === "BROAD" && x.adGroupCriterion.status === "ENABLED"));
row("ads (enabled)", cnt(ads, ca.campaign.id, (x) => x.adGroupAd.status === "ENABLED"), cnt(ads, cb.campaign.id, (x) => x.adGroupAd.status === "ENABLED"));
const strength = (id) => [...new Set(ads.filter((x) => x.campaign.id === id && x.adGroupAd.status === "ENABLED").map((x) => x.adGroupAd.adStrength ?? "?"))].join(",");
row("ad strength", strength(ca.campaign.id), strength(cb.campaign.id));

hr("4. ASSETS / EXTENSIONS");
const assets = await q(`SELECT campaign.id, campaign_asset.field_type, campaign_asset.status
  FROM campaign_asset WHERE campaign.id IN (${ids.join(",")}) AND campaign_asset.status != 'REMOVED'`);
const types = [...new Set(assets.map((a) => a.campaignAsset.fieldType))].sort();
if (!types.length) console.log("  (no campaign-level assets on either)");
for (const t of types) row(t, cnt(assets, ca.campaign.id, (x) => x.campaignAsset.fieldType === t), cnt(assets, cb.campaign.id, (x) => x.campaignAsset.fieldType === t));

hr("5. GEO TARGETING");
for (const [name, id] of [[ca.campaign.name, ca.campaign.id], [cb.campaign.name, cb.campaign.id]]) {
  const geo = await q(`SELECT campaign_criterion.location.geo_target_constant, campaign_criterion.negative, campaign_criterion.proximity.radius
    FROM campaign_criterion WHERE campaign.id = ${id} AND campaign_criterion.type IN (LOCATION, PROXIMITY)`);
  console.log(`  ${name}: ${geo.length} location criteria` + (geo.length ? ` (${geo.filter((g) => g.campaignCriterion.negative).length} excluded)` : ""));
  const consts = geo.filter((g) => !g.campaignCriterion.negative).map((g) => g.campaignCriterion.location?.geoTargetConstant).filter(Boolean);
  if (consts.length) {
    const names = await q(`SELECT geo_target_constant.name, geo_target_constant.canonical_name, geo_target_constant.resource_name
      FROM geo_target_constant WHERE geo_target_constant.resource_name IN (${consts.slice(0, 20).map((c) => `"${c}"`).join(",")})`);
    names.slice(0, 8).forEach((n) => console.log(`      ${n.geoTargetConstant.canonicalName}`));
    if (consts.length > 8) console.log(`      ... and ${consts.length - 8} more`);
  }
}

hr(`6. DEVICE SPLIT (${RANGE})`);
const dev = await q(`SELECT campaign.id, segments.device, metrics.clicks, metrics.cost_micros, metrics.conversions
  FROM campaign WHERE segments.date DURING ${RANGE} AND campaign.id IN (${ids.join(",")})`);
console.log("  " + "device".padEnd(14) + ca.campaign.name.slice(0, 22).padEnd(32) + cb.campaign.name.slice(0, 22));
for (const d of ["MOBILE", "DESKTOP", "TABLET"]) {
  const g = (id) => { const r = dev.find((x) => x.campaign.id === id && x.segments.device === d); return r ? `${r.metrics.clicks ?? 0} clk ${usd(r.metrics.costMicros)} ${Number(r.metrics.conversions ?? 0).toFixed(1)} conv` : "-"; };
  console.log("  " + d.padEnd(14) + g(ca.campaign.id).padEnd(32) + g(cb.campaign.id));
}

hr("7. AD SCHEDULE");
for (const [name, id] of [[ca.campaign.name, ca.campaign.id], [cb.campaign.name, cb.campaign.id]]) {
  const sched = await q(`SELECT campaign_criterion.ad_schedule.day_of_week FROM campaign_criterion WHERE campaign.id = ${id} AND campaign_criterion.type = AD_SCHEDULE`);
  console.log(`  ${name}: ${sched.length ? sched.length + " day-parts set" : "running all hours (no schedule)"}`);
}

hr("8. CONVERSION ACTIONS THIS CAMPAIGN COUNTS");
for (const [name, id] of [[ca.campaign.name, ca.campaign.id], [cb.campaign.name, cb.campaign.id]]) {
  const cg = await q(`SELECT campaign.id, campaign_conversion_goal.category, campaign_conversion_goal.origin, campaign_conversion_goal.biddable
    FROM campaign_conversion_goal WHERE campaign.id = ${id}`);
  const biddable = cg.filter((x) => x.campaignConversionGoal.biddable);
  console.log(`  ${name}: ${biddable.length} biddable goal(s)` + (biddable.length ? " - " + [...new Set(biddable.map((x) => x.campaignConversionGoal.category))].join(", ") : ""));
}

console.log();
