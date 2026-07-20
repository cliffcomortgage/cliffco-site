---
description: Generate complete, policy-compliant Google Ads RSAs and supporting assets for the Cliffco Reverse Mortgage campaign
---

# /generate-ads

Generates high-performing Responsive Search Ads (RSAs) and all supporting assets (callouts, structured snippets, sitelink review) following the specs in `anatomy-of-a-good-ad.md` and `ad-assets-best-practices.md`.

## Context (already known — do not ask)

- **Campaign**: Reverse Mortgage Long Island (ID 23946171105)
- **Ad group ID**: 197659213877
- **Landing URL**: `https://cliffco-reverse-microsite.vercel.app/long-island/`
- **Loan officer**: Julian Giordano, 25+ years experience, Long Island specialist
- **Phone**: (516) 884-6696
- **Product**: HECM (Home Equity Conversion Mortgage) — FHA-insured reverse mortgage
- **Target**: Homeowners 62+, Long Island NY
- **Existing sitelinks**: Free Quote, Do I Qualify?, Our Process, Meet Julian, How a HECM Works, Client Reviews

## When invoked

1. **Read both spec files** before generating anything:
   - `anatomy-of-a-good-ad.md` — RSA structure, 6 headline patterns, description rules, pinning, character limits, rejection rules
   - `ad-assets-best-practices.md` — callouts, structured snippets, sitelinks, CTR lift data

2. **If the user provided an angle or focus** (e.g. `/generate-ads angle="trust"` or `/generate-ads keyword="hecm loan long island"`), incorporate it. Otherwise use the primary keyword "reverse mortgage long island" and generate one set covering all 3 RSA angles: **trust**, **speed/ease**, and **financial benefit**.

3. **Generate 3 complete RSAs**. Each RSA must have:
   - **15 headlines** — 3 pinned to slot 1 (keyword variants), 12 unpinned covering ≥5 of the 6 patterns (offer, trust, urgency, CTA, brand, guarantee)
   - **4 descriptions** — each ≤90 chars, covering: service+ease, trust+credentials, differentiator, direct CTA
   - **Final URL**: `https://cliffco-reverse-microsite.vercel.app/long-island/`
   - **path1**: `reverse-mortgage` | **path2**: `long-island`

4. **Generate callouts** — 10 callouts, each ≤25 chars, covering speed + trust + value + guarantee. No repetition with headline content.

5. **Generate structured snippets**:
   - Header: `Services` — values covering HECM types/benefits (e.g. "HECM Loans", "No Monthly Payments", "Tax-Free Proceeds")
   - Header: `Types` — values covering eligibility/process stages (e.g. "Free Consultation", "FHA-Insured", "No Credit Check")

6. **Run self-review checklist** on every headline and description before presenting output:
   - ≤30 chars (headlines), ≤90 chars (descriptions)
   - No ALL CAPS words
   - No exclamation marks in headlines
   - No phone numbers in copy
   - No unsubstantiated superlatives (#1, best, top) unless Julian has verifiable proof
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

Final URL: https://cliffco-reverse-microsite.vercel.app/long-island/
Display path: reverse-mortgage / long-island
Checklist: ✓ all clear  OR  ⚠ [list any issues]
```

Then after all 3 RSAs:

```
CALLOUTS (10)
 1. [callout] (XX chars)
 ...

STRUCTURED SNIPPETS
 Services: [val1] · [val2] · [val3] · [val4] · [val5]
 Types:    [val1] · [val2] · [val3] · [val4] · [val5]
```

8. **Generate negative keywords** — always include a negative keyword list as part of every new campaign build. Group by category and present alongside the ad copy:

```
NEGATIVE KEYWORDS (phrase match)
 Jobs/Career:       jobs, job openings, career, careers, salary, hiring
 Training:          training, certification, license exam, how to become, school, classes, course
 Bad intent:        scam, fraud, lawsuit, class action, predatory, dangers of, risks of, problems with, complaints, warning
 Exit intent:       get out of, cancel my, foreclose, foreclosure
 Wrong product:     commercial, investment property, rental property, bankruptcy, grant, free money, government assistance
```

9. **After presenting the output**, ask:
   > "Ready to push these to Google Ads? I can write a Node.js script that creates these RSAs, assets, and negative keywords via the API, or you can copy them into the Google Ads UI manually."

## Reverse mortgage copy rules (domain-specific)

These apply on top of Google's standard editorial rules:

- **Never say "free money"** — HECM is a loan, not a grant
- **Never imply the home will be taken** — frame as "stay in your home"
- **Never use "no payments"** alone — say "no monthly mortgage payments required" (borrower still owes taxes, insurance, maintenance)
- **Preferred terms**: "tax-free proceeds", "stay in your home", "FHA-insured", "HECM", "home equity", "financial flexibility", "supplement retirement income"
- **Avoid**: "cash out", "cash back", "get paid", "liquidate", "debt-free" (it's a loan)
- **Julian's verified USPs**: 25+ years experience, Long Island specialist, FHA-approved lender, NMLS licensed
- **Age hook**: "Homeowners 62+" or "If You're 62 or Older" — always leads with eligibility, not the product
