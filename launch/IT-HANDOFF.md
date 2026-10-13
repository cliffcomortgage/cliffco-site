# Website Cutover — IT Handoff

**Site:** cliffcomortgage.com
**From:** WordPress on `167.172.234.163` (nginx)
**To:** Vercel (Astro, server-rendered)
**Prepared:** 2026-10-13

---

## 1. What you actually need to do

Short version: **change two DNS records.** Everything else is already configured in the
application or in Vercel.

The 144 old-URL redirects are **built into the application**, not into nginx, Apache or a
DNS service. You do not need to build a redirect map, import a CSV, or configure rules
anywhere. `launch/redirects.csv` is included only so you can verify them after cutover.

| Thing | Who handles it |
|---|---|
| DNS A / CNAME records | **You** |
| TTL lowering before cutover | **You** |
| TLS certificate | Vercel, automatic |
| 301 redirects (144) | Already in the app |
| Security headers (HSTS, CSP, etc.) | Already in `website/vercel.json` |
| `robots.txt` and sitemaps | Generated at build |
| Environment variables | Marketing, in Vercel (see §4) |

---

## 2. DNS changes

**Registrar / DNS host:** Network Solutions (`ns93.worldnic.com`, `ns94.worldnic.com`)

### Current

| Host | Type | Value | TTL |
|---|---|---|---|
| `cliffcomortgage.com` | A | `167.172.234.163` | 3600 |
| `www.cliffcomortgage.com` | A | `167.172.234.163` | 3600 |

`www` currently returns a 301 to the apex. Keep that behaviour.

### Target

Use the exact values Vercel shows under **Project → Settings → Domains** after the domain
is added there. As of writing Vercel's published targets are:

| Host | Type | Value |
|---|---|---|
| `cliffcomortgage.com` | A | `76.76.21.21` |
| `www.cliffcomortgage.com` | CNAME | `cname.vercel-dns.com` |

**Confirm against the Vercel dashboard before entering them** — Vercel has changed these in
the past, and the dashboard is authoritative.

### Do this first, 24–48h ahead

Lower both records' TTL from 3600 to **300**. This is the single thing that makes a rollback
fast. At TTL 3600 a bad cutover takes an hour to undo; at 300 it takes five minutes.

---

## 3. ⚠️ Records that must NOT change

This domain carries live company email and marketing email. Changing the web records is
safe. Changing or removing anything below will break mail delivery company-wide.

**Leave exactly as-is:**

- **MX** — `d354483a.ess.barracudanetworks.com` and `d354483b.ess.barracudanetworks.com`
  (Barracuda Email Security, in front of Microsoft 365)
- **SPF TXT** — currently:
  ```
  v=spf1 include:spf.protection.outlook.com include:spf.exclaimer.net
  include:spf.ess.barracudanetworks.com include:servers.mcsv.net
  include:sendgrid.net include:21616430.spf02.hubspotemail.net
  ip4:52.249.26.186 ~all
  ```
  That single line authorises Microsoft 365, Exclaimer signatures, Barracuda, Mailchimp,
  SendGrid and HubSpot. Dropping it silently sends company and marketing mail to spam.
- **DKIM / DMARC** — any `_domainkey` or `_dmarc` records
- **`google-site-verification=zXRHoNKBUPwjTM5rXe_1LiQVVatGnMQzgez3YA0vnNw`** — this is the
  Search Console verification. Removing it drops the property and all its history.
- **`sophos-domain-verification=…`**
- Any other subdomain records not listed in §2

If the plan is to move nameservers rather than edit records, every record above has to be
recreated at the new provider first. Editing the two A records in place is lower risk, and
is what this document assumes.

---

## 4. Environment variables (Vercel)

Set in **Project → Settings → Environment Variables**, ticked for **Production, Preview and
Development**. Marketing holds the values; IT does not need them unless asked to enter them.

| Variable | Purpose | Secret |
|---|---|---|
| `SMTP2GO_API_KEY` | Sends lead notification email | Yes |
| `EMAIL_FROM` | From address on notifications | No |
| `HUBSPOT_PORTAL_ID` | HubSpot portal | No |
| `HUBSPOT_FORM_GUID` | Lead intake form | No |
| `HUBSPOT_TOKEN` | Dashboard CRM reads | Yes |
| `DASHBOARD_PASSWORD` | Gate on `/dashboard/` | Yes |
| `PUBLIC_POSTHOG_KEY` | Product analytics | No |
| `PUBLIC_POSTHOG_HOST` | Product analytics | No |
| `GOOGLE_ADS_DEVELOPER_TOKEN` | Dashboard ad reporting | Yes |
| `GOOGLE_ADS_CLIENT_ID` | " | No |
| `GOOGLE_ADS_CLIENT_SECRET` | " | Yes |
| `GOOGLE_ADS_REFRESH_TOKEN` | " | Yes |
| `GOOGLE_ADS_LOGIN_CUSTOMER_ID` | " | No |
| `GOOGLE_ADS_CUSTOMER_ID` | " | No |
| `INDEXNOW_SUBMIT` | Set to `true` for production only | No |

**If a variable is missing at build time, the related feature fails silently** — forms stop
sending, or `/dashboard/` opens with no password. Confirm all are present before cutover.

---

## 5. Cutover sequence

1. **48h before** — lower TTL on both A records to 300.
2. **Day of** — add `cliffcomortgage.com` and `www.cliffcomortgage.com` in Vercel under
   Project → Settings → Domains. Vercel will show "Invalid Configuration" until DNS points
   at it; that is expected.
3. Change the two DNS records to the values from §2.
4. Wait for propagation (5–15 min at TTL 300). Check with
   `nslookup cliffcomortgage.com 8.8.8.8`.
5. Vercel issues the TLS certificate automatically once DNS resolves — usually under a
   minute. No CSR, no manual certificate.
6. Run the checks in §6.
7. **Leave the old WordPress server running for 7 days.** It costs nothing and it is the
   rollback.
8. After 7 clean days, restore TTL to 3600.

---

## 6. Post-cutover checks

```bash
# 1. Apex and www both resolve to Vercel and serve 200 / 301
curl -sI https://cliffcomortgage.com/      | head -1     # expect 200
curl -sI https://www.cliffcomortgage.com/  | head -1     # expect 301 to apex

# 2. TLS is valid and issued by Vercel
curl -sI https://cliffcomortgage.com/ | grep -i strict-transport-security

# 3. Spot-check redirects (full list in launch/redirects.csv)
curl -sI https://cliffcomortgage.com/loans/fix-and-flip/ | grep -i location
curl -sI https://cliffcomortgage.com/loan-officers/ralvarez/ | grep -i location

# 4. Sitemap and robots resolve
curl -s https://cliffcomortgage.com/sitemap-index.xml | head -2
curl -s https://cliffcomortgage.com/robots.txt | head -3

# 5. Email still flows — send a test to and from a @cliffcomortgage.com address
```

Marketing will separately submit a live form and confirm the lead reaches HubSpot and the
notification email arrives.

---

## 7. Rollback

Change the two A records back to `167.172.234.163`. At TTL 300 the old site is serving again
within ~5 minutes. Nothing else needs undoing — the WordPress install is untouched by any of
the above.

---

## 8. Files in this handoff

| File | What it is |
|---|---|
| `IT-HANDOFF.md` | This document |
| `redirects.csv` | All 144 old → new paths, all 301. For verification only — already built into the app |
| `sitemap-urls.txt` | All 196 live URLs, one per line. For bulk crawling / link checking |

Live sitemap after cutover: `https://cliffcomortgage.com/sitemap-index.xml`

---

## 9. Marketing's side (not IT)

Listed so nothing falls between the two teams:

- Submit the new sitemap in Google Search Console (the existing property stays valid, since
  the verification TXT is unchanged)
- Confirm a live test lead reaches HubSpot and triggers the notification email
- Turn on Enhanced Conversions in Google Ads
- Point any ad campaigns at the new URLs if they target pages that moved
