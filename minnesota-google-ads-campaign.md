# Minnesota Google Ads Campaign — Reference

Full ad copy and parameters for the Minnesota paid-search campaign.
Source of truth: `microsites/reverse/google-ads/Code/minnesota-fast-approval-config.json`
(initial build) and `minnesota-add-rsas-config.json` (live campaign/ad-group IDs).

## Campaign parameters

| Setting | Value |
|---|---|
| Google Ads account (CID) | 7324255239 |
| Campaign name | Minnesota — Fast Mortgage Approval |
| Campaign ID | 24055195846 |
| Campaign type | Search |
| Daily budget | $50.00/day (50,000,000 micros) |
| Geo targeting | Minnesota |
| Language | English |
| Ad schedule | None (runs all hours) |
| Ad group name | minnesota mortgage lender |
| Ad group ID | 201240361129 |
| Landing page (final URL) | https://cliffcomn.com/ |
| Display path | /minnesota/mortgage |

## Keywords

Ad group: **minnesota mortgage lender**

| Keyword | Match type |
|---|---|
| minnesota mortgage lender | Phrase |

## Negative keywords

```
jobs, job openings, career, careers, salary, hiring,
training, certification, license exam, how to become, school, classes, course,
scam, fraud, lawsuit, class action, predatory, complaints,
commercial mortgage, business loan, auto loan, personal loan, apartment for rent, mortgage calculator
```

## Responsive search ads

Three RSAs are live in the ad group. Google Ads limits: headlines ≤ 30 characters,
descriptions ≤ 90 characters. In each ad the three "Minnesota" headlines are all
pinned to Headline position 1, so one of them always shows first; the rest rotate.

### RSA 1 — Fast approval / low friction

**Headlines**
- Minnesota Mortgage Lender *(pinned: Headline 1)*
- Fast Mortgage Approval MN *(pinned: Headline 1)*
- Minnesota Home Loan Approval *(pinned: Headline 1)*
- 5 Minutes To Get Started
- No Credit Pull Required
- No Commitment Required
- Free Rate Quote Today
- Apply Online In Minutes
- Quick Mortgage Pre-Approval
- Simple Online Application
- See Your Options Today
- Licensed Minnesota Lender
- Straightforward Process
- Get Started Today
- Cliffco Mortgage Bankers

**Descriptions**
- Get pre-approved in minutes. No credit pull, no commitment, no pressure.
- Cliffco Mortgage Bankers, a licensed Minnesota lender since 1989.
- We find financing options other lenders miss. Straightforward, no jargon.
- See your mortgage options today. Free, no-obligation quote in 5 minutes.

### RSA 2 — Mitch / personal loan officer

**Headlines**
- Minnesota Mortgage Lender *(pinned: Headline 1)*
- Fast Mortgage Approval MN *(pinned: Headline 1)*
- Minnesota Home Loan Approval *(pinned: Headline 1)*
- Speak With Mitch Directly
- Your Minnesota Loan Officer
- Licensed MN Loan Officer
- Local Minnesota Expertise
- No Confusing Loan Terms
- Guidance Past Closing Day
- Built Around Your Goals
- Cliffco Mortgage Bankers
- Free Consultation Today
- Call Mitch Today
- Financing Solutions For You
- Trusted MN Homebuying Guide

**Descriptions**
- Talk directly with Mitch Patterson, your Minnesota loan officer. NMLS #2560483.
- Mitch explains every option clearly: no confusing terms, no surprises, ever.
- Cliffco Mortgage Bankers has helped Minnesota families since 1989.
- Get a free consultation with Mitch. No obligation, no pressure, no rush.

### RSA 3 — Complex situations / second-chance borrowers

**Headlines**
- Minnesota Mortgage Lender *(pinned: Headline 1)*
- Fast Mortgage Approval MN *(pinned: Headline 1)*
- Minnesota Home Loan Approval *(pinned: Headline 1)*
- Cliffco Mortgage Bankers
- Flexible Financing Options
- Complex Situations Welcome
- Denied Elsewhere? Ask Us
- Self-Employed? We Can Help
- Licensed Minnesota Lender
- Family-Run Since 1989
- No Cookie-Cutter Loans
- A Person, Not A Call Center
- Free Quote In Minutes
- See What You Qualify For
- Get Started Today

**Descriptions**
- Cliffco Mortgage Bankers helps Minnesota borrowers other lenders turn away.
- Self-employed, complex income, denied elsewhere? We build loans around you.
- A licensed Minnesota lender since 1989. Real loan officers, not a call center.
- See what you qualify for. Free quote, no obligation, takes just minutes.

## Ad extensions (assets)

No Minnesota-specific sitelink, callout, or structured-snippet config is stored in
the repo (unlike the NJ grant campaign, which has `nj-grant-sitelinks-config.json`).
If extensions are running on this campaign, they were added directly in the Google
Ads UI. Verify and document them there if needed.

## Conversion tracking

No conversion tag (Google `gtag`/`AW-` snippet) is present in the `cliffcomn`
landing-page source in this repo. Confirm in the Google Ads UI whether a conversion
action is attached to this campaign and how the landing page reports it before
relying on conversion data.

## How to update this campaign

RSAs and assets can be refreshed from a config file with the bundled script:

```
node microsites/reverse/google-ads/Code/update_ads_and_assets.mjs \
  microsites/reverse/google-ads/Code/minnesota-add-rsas-config.json
```

(Requires a valid `.env` with the Google Ads API credentials in
`microsites/reverse/google-ads/`. The refresh token expires periodically; re-run
`get_refresh_token.mjs` if calls fail with `invalid_grant`.)
