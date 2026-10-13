# Website Cutover — IT Handoff

**Site:** cliffcomortgage.com
**From:** WordPress on `167.172.234.163` (nginx)
**To:** Vercel (Astro, server-rendered)
**Prepared:** 2026-10-13

---

## 1. What you actually need to do

Short version: **change two DNS records**, after marketing has added the domain in Vercel.
Everything else is already configured in the application or in Vercel. §5 says who does what,
in order.

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

| Host | Type | Value |
|---|---|---|
| `cliffcomortgage.com` | A | `216.198.79.1` |
| `www.cliffcomortgage.com` | CNAME | project-specific — read it from the Vercel dashboard |

The apex A record above is verified: it is what cliffcomn.com, already live on Vercel in
this same account, resolves to today. Older Vercel documentation says `76.76.21.21` and
many third-party guides still repeat it; that is not what this account is issued.

**The www CNAME cannot be looked up or guessed.** Vercel issues a different one per project
— cliffcomn.com's is `e9df9d2cb823d9d2.vercel-dns-017.com`, and cliffcomortgage.com will get
its own distinct hostname. Add the domain in **Project → Settings → Domains** first and copy
the CNAME value Vercel displays there. Using another project's CNAME will serve the wrong
site.

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

Two people are involved. **Marketing** holds the Vercel account; **IT** holds DNS at Network
Solutions. The order matters: the domain goes into Vercel *before* DNS is repointed, because
the www CNAME value does not exist until Vercel has been told about the domain, and because
DNS pointed at a project that has not claimed the domain yet serves a Vercel error page
instead of either site.

| # | Who | Step |
|---|---|---|
| 1 | **IT** | 48h before: lower TTL on both records from 3600 to **300**. Nothing else changes yet, and the site stays on WordPress. |
| 2 | **Marketing** | Add `cliffcomortgage.com` and `www.cliffcomortgage.com` in Vercel, under Project → Settings → Domains. Vercel shows "Invalid Configuration" — expected, DNS has not moved yet. |
| 3 | **Marketing** | Copy the **www CNAME value** Vercel now displays and send it to IT. This is the only place that value exists. IT is blocked until they have it. |
| 4 | **IT** | Change `cliffcomortgage.com` A to `216.198.79.1`. |
| 5 | **IT** | Change `www.cliffcomortgage.com` from an A record to a **CNAME** pointing at the value from step 3. Note this changes the record *type*. |
| 6 | **IT** | Wait 5–15 min at TTL 300, then confirm: `nslookup cliffcomortgage.com 8.8.8.8`. |
| 7 | — | Vercel issues the TLS certificate by itself once DNS resolves, usually within a minute. No CSR, no manual certificate, nothing to install. |
| 8 | **Both** | Run the checks in §6. Marketing separately submits a test lead. |
| 9 | **IT** | Leave the old WordPress server running for **7 days**. It costs nothing and it is the rollback. |
| 10 | **IT** | After 7 clean days, restore TTL to 3600. |

If Vercel still reads "Invalid Configuration" more than 20 minutes after step 6 shows the new
IP, the most likely cause is the www CNAME: either it is still an A record, or it carries
another project's hostname.

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
