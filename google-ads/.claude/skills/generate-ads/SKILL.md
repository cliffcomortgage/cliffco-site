---
description: Generate complete, policy-compliant Google Ads RSAs and supporting assets for any Cliffco Mortgage Bankers ad campaign
---

# /generate-ads

Generates high-performing Responsive Search Ads (RSAs) and all supporting assets (callouts, structured snippets, negative keywords) for a Cliffco ad campaign, following the specs in `anatomy-of-a-good-ad.md` and `ad-assets-best-practices.md`.

**Default voice is the company**, not an individual loan officer: "Cliffco Mortgage Bankers," not a named LO. Only switch to an LO-specific angle when the operator explicitly asks for one for a particular ad set.

## Step 1 — Ask before generating anything

This skill has no hardcoded campaign. Ask the operator:

1. **Product / campaign focus** — what is this campaign for? Offer these as options, plus "other":
   - Reverse Mortgage (HECM)
   - DSCR / Real Estate Investor
   - Self-Employed / Non-QM
   - VA Loans
   - FHA Loans
   - Conventional
   - HELOC
   - General brand / company awareness

2. **New campaign or refreshing an existing one?**
   - **Existing**: ask for the campaign name, or run `Code/list_campaigns.mjs` and let the operator pick from the live list. Use its current ad group ID for any asset push.
   - **New**: campaign ID and ad group ID do not exist yet — Google Ads assigns them at creation, via the API or the UI. Never invent placeholder numbers. Also ask: campaign name, daily budget, bidding strategy, geographic targeting, and any audience restriction (e.g. reverse mortgage is 62+).

3. **Landing page URL.** Ask directly; never assume. Offer likely candidates based on the product chosen, then confirm the exact URL before using it:
   - Reverse Mortgage → `https://cliffco-reverse-microsite.vercel.app/long-island/` (Long Island-specific) or `https://cliffcomortgage.com/reverse-mortgage/` (national persona page)
   - DSCR / Investor → `https://cliffcomortgage.com/real-estate-investor-mortgage/` or `https://cliffcomortgage.com/loans/dscr/`
   - Self-Employed / Non-QM → `https://cliffcomortgage.com/self-employed-mortgage/`
   - VA → `https://cliffcomortgage.com/loans/va/`
   - FHA → `https://cliffcomortgage.com/loans/fha/`
   - HELOC → `https://cliffcomortgage.com/loans/heloc/`
   - General / brand → `https://cliffcomortgage.com/`

4. **Company voice or a specific LO?** Default: company voice. If the operator wants an LO featured, ask for that LO's name, NMLS number, licensed states, and phone/email exactly as published on their live bio at `cliffcomortgage.com/loan-officers/{slug}/`. Never reuse a retired LO's details (e.g. Julian Giaquinto, offboarded July 2026 — do not reference him or his old phone number (516) 884-6696 in any new ad copy).

5. **Keyword / angle focus**, if the operator has one (e.g. `angle="trust"` or a target keyword). Otherwise generate one set covering 3 angles: trust, speed/ease, financial benefit.

## Step 2 — Company defaults (used unless Step 1 says otherwise)

**Universal Cliffco USPs** — verified facts, safe to use without asking:
- Independent, family-run mortgage lender, lending since 1989
- Corporate NMLS #65328 (verify at nmlsconsumeraccess.org)
- Every borrower works directly with a licensed loan officer — not a call center
- Second-chance lending: works with borrowers other banks have declined
- Licensed in 32 states — confirm the current count against `compliance/state-licenses.md` in the main site repo before quoting a specific number, since it changes

**Product-specific facts** — confirm with the operator before using in copy, since these are compliance-sensitive and change over time:
- Reverse Mortgage: HUD-approved lender, FHA-insured HECM program (confirmed with the operator as of July 2026 — reconfirm before reuse if this file is old)
- Any other product's specific facts (DSCR ratio minimums, Non-QM documentation types, down payment minimums, etc.): ask, do not assume

## Step 3 — Domain-specific copy rules

Apply Google's standard editorial rules always. Layer on product-specific rules:

**Reverse Mortgage (HECM):**
- Never say "free money" — it's a loan, not a grant
- Never imply the home will be taken — frame as "stay in your home"
- Never use "no payments" alone — say "no monthly mortgage payments required" (borrower still owes taxes, insurance, maintenance)
- Preferred terms: "tax-free proceeds", "stay in your home", "FHA-insured", "HECM", "home equity", "financial flexibility", "supplement retirement income"
- Avoid: "cash out", "cash back", "get paid", "liquidate", "debt-free" (it's a loan)
- Age hook: "Homeowners 62+" or "If You're 62 or Older" — lead with eligibility, not the product

**All other products — general mortgage-advertising compliance:**
- Never state a specific rate or APR in ad copy without full Reg Z disclosures — rates change; quoting one in a headline goes stale and can mislead
- Never guarantee approval, a specific loan amount, or a specific outcome
- Never word copy in a way that could read as steering based on a protected class (fair lending / ECOA) — this applies especially carefully given Cliffco's second-chance-lending positioning
- Equal Housing Lender positioning belongs on the landing page; not required in character-limited headline text
- If the operator hasn't confirmed a specific product claim (DSCR minimums, Non-QM doc types, LTV caps), ask before putting a number in ad copy

## Step 4 — Generate

1. **Read both spec files** before generating anything:
   - `anatomy-of-a-good-ad.md` — RSA structure, 6 headline patterns, description rules, pinning, character limits, rejection rules
   - `ad-assets-best-practices.md` — callouts, structured snippets, sitelinks, CTR lift data

2. **Generate 3 complete RSAs** covering the 3 angles (or the operator's specified angle). Each RSA must have:
   - **15 headlines** — 3 pinned to slot 1 (keyword variants), 12 unpinned covering ≥5 of the 6 patterns (offer, trust, urgency, CTA, brand, guarantee)
   - **4 descriptions** — each ≤90 chars, covering: service+ease, trust+credentials, differentiator, direct CTA
   - **Final URL**: the landing page confirmed in Step 1
   - **path1 / path2**: short slugs matching the product and campaign (e.g. `reverse-mortgage` / `long-island`, or `self-employed` / `mortgage`)

3. **Generate callouts** — 10 callouts, each ≤25 chars, covering speed + trust + value + guarantee. No repetition with headline content.

4. **Generate structured snippets** — headers and values matched to the product (e.g. reverse mortgage: `Services` → HECM types/benefits, `Types` → eligibility/process stages).

5. **Sitelinks (optional)** — if the operator wants sitelink suggestions, ask what pages exist on the landing site (FAQ, reviews, how-it-works, etc.) and generate short (≤25 char) sitelink text for real, currently-live pages only. Never suggest a page that doesn't exist (e.g. a named-LO bio page, unless that LO is confirmed still active).

6. **Run self-review checklist** on every headline and description before presenting output:
   - ≤30 chars (headlines), ≤90 chars (descriptions)
   - No ALL CAPS words
   - No exclamation marks in headlines
   - No phone numbers in copy
   - No unsubstantiated superlatives (#1, best, top) unless Cliffco has verifiable proof (NMLS record, years in business, actual review count/rating)
   - No emoji beyond one `★` if used for social proof
   - Max 1 exclamation mark total across all descriptions in each RSA
   - Flag any violations and auto-correct before showing output

7. **Output format** — present each RSA as a clean table:

```
RSA 1 — [Angle name]
══════════════════════════════════════════════
HEADLINES (pinned to slot 1 marked with [P1])
 1. [headline]  [P1] — [pattern type]
 2. [headline]  [P1] — [pattern type]
 3. [headline]  [P1] — [pattern type]
 4. [headline]       — [pattern type]
 ...
15. [headline]       — [pattern type]

DESCRIPTIONS
 1. [description] (XX chars)
 2. [description] (XX chars)
 3. [description] (XX chars)
 4. [description] (XX chars)

Final URL: [confirmed landing page]
Display path: [path1] / [path2]
Checklist: ✓ all clear  OR  ⚠ [list any issues]
```

Then after all 3 RSAs:

```
CALLOUTS (10)
 1. [callout] (XX chars)
 ...

STRUCTURED SNIPPETS
 [Header 1]: [val1] · [val2] · [val3] · [val4] · [val5]
 [Header 2]: [val1] · [val2] · [val3] · [val4] · [val5]
```

## Step 5 — Negative keywords

Always include a negative keyword list. Start from the account-level list in `universal-negative-keywords.md` (jobs/career, training, generic bad-intent terms apply to any Cliffco campaign) and layer on product-specific negatives:

```
NEGATIVE KEYWORDS (phrase match)
 Jobs/Career:       jobs, job openings, career, careers, salary, hiring
 Training:          training, certification, license exam, how to become, school, classes, course
 Bad intent:        scam, fraud, lawsuit, class action, predatory, dangers of, risks of, problems with, complaints, warning
 Wrong product:     [ask the operator — varies by campaign, e.g. reverse mortgage excludes "commercial, investment property, rental property, bankruptcy, grant, free money, government assistance"; a DSCR campaign would exclude "owner occupied, primary residence, first time buyer"]
 Exit intent:       [product-dependent — e.g. reverse mortgage: "get out of, cancel my, foreclose, foreclosure"; may not apply to other products]
```

## Step 6 — After presenting the output

Ask:
> "Ready to push these to Google Ads?
> - **New campaign**: I'll write a config JSON (see `Code/example-new-campaign-config.json`) from everything above and run `node Code/create_campaign.mjs <config>.json`. It creates the budget, campaign, ad group, keyword(s), and RSA(s) — everything PAUSED for your review before it goes live.
> - **Existing campaign**: I'll write a config JSON (see `Code/example-update-campaign-config.json`) and run `node Code/update_ads_and_assets.mjs <config>.json`. It replaces the ad group's RSAs and adds any new sitelinks/callouts/snippets, PAUSED for review.
> - Or you can enter everything in the Google Ads UI manually.
>
> (`Code/build_reverse_mortgage_li.mjs` and `Code/add_rsa_and_assets.mjs` are historical records of the original reverse mortgage campaign only — don't run or reuse either one; they hardcode Julian Giaquinto's retired details and a stale URL.)"
