# Pre-launch checklist: cliffcomortgage.com rebuild

Open items to clear before the new site replaces the live cliffcomortgage.com. Check items off here as they're done. Started 2026-10-07.

## Confirm product facts and credit minimums

- [ ] **FHA credit minimum.** Does Cliffco lend at 500–579 with 10% down? The FHA page describes FHA's 500 program floor, and its FAQ says Cliffco requires 580 for 3.5% down. (`website/src/pages/loans/fha/index.astro`)
- [ ] **Conventional and FHA page figures.** These are standard agency rules, not yet checked against Cliffco's guidelines. Pages: `loans/conventional/`, `loans/fha/`, and the shared comparison table in `website/src/components/asym/LoanCompare.astro`.
  - PMI estimate (Freddie Mac's $30–$70 a month per $100K borrowed) and the $400K / 3% down example
  - FHA annual MIP of 0.50–0.55%, and the $350K / 3.5% down example ($5,911 upfront, about $155 a month)
  - Seller credits: conventional 3–9%, FHA up to 6%
  - Debt-to-income: conventional up to 50% with automated approval, FHA up to about 57%
  - Down payments: second home 10%, investment property 15–25%; best conventional pricing at 780+
  - 2026 loan limits: $832,750 conforming, $1,249,125 high-cost ceiling, $541,287 FHA floor
- [ ] **Mortgage Rates page ranges:** Non-QM 0.5–2% over conventional, bank statement 0.75–1.5%, VA "at or below conventional." (`/mortgage-rates/`)
- [ ] **Non-QM rate table** on `/loans/non-qm-self-employed/` is labeled "as of mid-2026." Refresh or remove it so it isn't stale at launch.
- [ ] **Glossary ARM entry** describes a 5/1 ARM that adjusts annually. Current conventional ARMs adjust every six months (5/6).
- [ ] **Leadership titles** on the About and team pages confirmed with Rafe (standing rule in `CLAUDE.md`).

## Accessibility (WCAG 2.2 AA)

Audit on 2026-10-07: axe-core on all 197 pages, plus keyboard, phone-menu, and 320px-width checks. Everything passes except the items below.

- [ ] **NJ grant lander** (`/nj-22k-grant/`, locked page). The office phone link is nearly invisible (dark gray on black, 1.3:1), and two light-gray footer lines fall short (3.8:1 and 2.6:1; 4.5:1 is required). Needs a go-ahead to edit.
- [ ] **Get-started qualifier** (locked form). The red required-field asterisks (about 2.8:1) and red error text (about 3.8:1) are below 4.5:1. The fix is the same darker red used on the contact form. Needs a go-ahead to edit.
- [ ] **Manual screen-reader pass** with NVDA on Windows and VoiceOver on iPhone: the get-started qualifier, contact form submit and error, one calculator, and the phone menu.
- [ ] **Third-party widgets.** Get accessibility reports (VPAT/ACR) for the Elfsight reviews widget and HubSpot. The Encompass report is already requested, per the accessibility statement.
- [ ] **Accessibility inbox.** Confirm accessibility@cliffcomortgage.com exists and someone monitors it. It's the contact listed on `/legal/accessibility/`.
- [ ] **Custom cursor decision.** The brand arrow cursor doesn't follow visitors' enlarged-pointer settings in Windows or macOS. That isn't a WCAG failure, but some low-vision users rely on large pointers.

## Launch steps

- [ ] **IndexNow.** Set `INDEXNOW_SUBMIT=true` for the production build once the site is live on cliffcomortgage.com (see `website/astro.config.mjs`).
- [ ] **Redirects.** Spot-check that the legacy WordPress redirects in `website/astro.config.mjs` resolve on the live domain.
- [ ] **Elfsight widget.** Set the widget's Accent and Read More colors to black, and delete its Custom CSS. That CSS targets old class names, so it does nothing.
- [ ] **Research checklists.** Work through the trust-signal checklist (`seo-aeo-dtc-research/03-ymyl-eeat-trust.md`, section 12) and the technical SEO final pass (`seo-aeo-dtc-research/01-technical-seo.md`, Days 61–90).

## Not launch-blocking

- [ ] **Christopher Clifford's NH license.** Once he's licensed, remove the NH filter (`PRESIDENT_STATES` in `website/src/data/loan-officers.ts`).
- [ ] **OneDrive values doc.** `Mission, Vision, Values.docx` in OneDrive still has the old vision, mission, and values.
