---
description: Build a closed-loop Google Ads + HubSpot attribution dashboard on an Astro/Vercel site — shows campaign metrics, keyword CPL, deal pipeline funnel, and leads table
---

# /create-ads-dashboard

Builds a complete performance dashboard that closes the attribution loop between Google Ads and HubSpot. Fetches all data at build time (Astro static generation), deployed on Vercel.

## What it produces

A single `dashboard.astro` page with five sections:
1. **Google Ads summary bar** — 30-day spend, ROAS, conversions, recoverable dollars
2. **ROAS by Campaign** — card per campaign with spend, conv., avg CPC, impression share
3. **Top Opportunities** — auto-generated recommendations ranked by dollars recoverable (budget cap, ROAS gap, ad rank, tracking gaps)
4. **Deal Pipeline Funnel** — HubSpot pipeline stages with deal counts and values
5. **Keyword Attribution Table** — every keyword with clicks, spend, avg CPC, HubSpot lead count, cost-per-lead
6. **Leads from Google Ads** — table of every HubSpot contact that arrived via Google Ads, showing keyword, campaign, gclid status

## Prerequisites

### Google Ads
- Google Ads API developer token (Basic Access or higher)
- OAuth2 credentials: client ID, client secret, refresh token
- MCC (manager) account ID and client account ID
- Campaign must have auto-tagging enabled (default)

### HubSpot
- HubSpot Service Key (Settings → Development → Legacy Apps → Create Legacy App → Private → Use Service Keys instead)
- Scopes needed: `crm.objects.contacts.read`, `crm.objects.deals.read`
- Contact properties set up: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `hs_google_click_id`
- Landing page must capture UTMs into HubSpot hidden form fields + MutationObserver JS to populate them from URL params

### Vercel env vars (set in project Settings → Environment Variables → Production)
```
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=   ← MCC account ID (numbers only, no dashes)
GOOGLE_ADS_CUSTOMER_ID=         ← Client/advertiser account ID
HUBSPOT_TOKEN=                  ← pat-na1-... service key
```

## How to build it

### Step 1 — Discover HubSpot pipeline IDs

Run a diagnostic script first to find pipeline and stage IDs:
```js
// GET https://api.hubapi.com/crm/v3/pipelines/deals
// Returns pipeline IDs and stage IDs — you need these to label the funnel correctly
```

### Step 2 — Build dashboard.astro

The page has three API fetch blocks in the frontmatter (all at build time):

**Block 1 — Google Ads OAuth token**
```
POST https://oauth2.googleapis.com/token
```

**Block 2 — Google Ads campaign metrics (GAQL)**
```sql
SELECT campaign.id, campaign.name, campaign.status,
  metrics.cost_micros, metrics.conversions_value, metrics.conversions,
  metrics.impressions, metrics.clicks, metrics.ctr, metrics.average_cpc,
  metrics.search_budget_lost_impression_share,
  metrics.search_rank_lost_impression_share,
  metrics.search_impression_share
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.status != 'REMOVED'
ORDER BY metrics.cost_micros DESC
```

**Block 3 — Google Ads keyword performance (GAQL)**
```sql
SELECT ad_group_criterion.keyword.text,
  metrics.cost_micros, metrics.clicks, metrics.impressions,
  metrics.conversions, metrics.ctr, metrics.average_cpc
FROM keyword_view
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.id = [YOUR_CAMPAIGN_ID]
  AND ad_group_criterion.status != 'REMOVED'
  AND metrics.impressions > 0
ORDER BY metrics.cost_micros DESC
LIMIT 50
```

**Block 4 — HubSpot contacts (Google Ads leads only)**
```
POST https://api.hubapi.com/crm/v3/objects/contacts/search
filterGroups: utm_source = "google" OR hs_google_click_id HAS_PROPERTY
properties: firstname, lastname, email, createdate, utm_term, utm_campaign, hs_google_click_id, hs_lead_status
sorts: createdate DESC
limit: 50
```

**Block 5 — HubSpot deals**
```
GET https://api.hubapi.com/crm/v3/objects/deals?limit=100&properties=dealname,dealstage,pipeline,amount,closedate
```

**Keyword enrichment** — after fetching both, join keyword rows with HubSpot contact counts by `utm_term`:
```js
const leadsByTerm = new Map()
hsLeads.forEach(l => { if (l.utmTerm) leadsByTerm.set(l.utmTerm.toLowerCase(), (leadsByTerm.get(...) ?? 0) + 1) })
kwRows = kwRows.map(kw => ({ ...kw, leads: leadsByTerm.get(kw.text.toLowerCase()) ?? 0 }))
```

### Step 3 — Landing page UTM capture

Add to the landing page — captures URL params into HubSpot hidden form fields when the async HubSpot form renders:
```js
const PARAM_MAP = {
  gclid: 'hs_google_click_id',
  utm_source: 'utm_source',
  utm_medium: 'utm_medium',
  utm_campaign: 'utm_campaign',
  utm_content: 'utm_content',
  utm_term: 'utm_term',
}
// Persist to sessionStorage, then MutationObserver on .hs-form-frame to fill inputs
```

**Critical:** HubSpot's form is async — DOMContentLoaded fires before the form exists. Must use MutationObserver on `.hs-form-frame`, not getElementById.

## Common errors and fixes

| Error | Cause | Fix |
|---|---|---|
| `INVALID_CUSTOMER_ID 'GOOGLE_ADS_CUSTOMER_ID'` | Env var value set to the variable name instead of the number | Go to Vercel → env vars, fix the value |
| `INVALID_LOGIN_CUSTOMER_ID` | LOGIN_CUSTOMER_ID set to OAuth Client ID instead of MCC number | Set to MCC account ID (9 digits, no dashes) |
| `REQUESTED_METRICS_FOR_MANAGER` | CUSTOMER_ID set to MCC account instead of client account | Set CUSTOMER_ID to the advertiser account, not the MCC |
| Leads table always empty | UTM capture JS not working (looking for `#lp-form` instead of `.hs-form-frame`) | Use MutationObserver on `.hs-form-frame` |
| HubSpot 401 | Token expired or wrong scope | Create new Service Key with correct scopes |

## Cliffco-specific IDs (for reference)
- MCC: 9417169776
- Client account: 9494725743
- Reverse Mortgage LI campaign: 23946171105
- HubSpot portal: 21616430
- Pylon Pipeline ID: 695188531
- Encompass Pipeline ID: 836863053
- Dashboard URL: cliffco-reverse-microsite.vercel.app/dashboard/
- Source files: `C:\Users\spichoto\cliffco-site\microsites\reverse\src\pages\dashboard.astro`
