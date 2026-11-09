# Landing Page Spec: Cliffco Homebuyer Advantage Program

This spec is for Claude Code, working inside the new Cliffco website codebase. Build **one generic program page** for the Cliffco Homebuyer Advantage Program. It is a single static page with no partner-specific versions, co-branding, or dynamic routing. Cliffco will send every partner company, and their employees, to this same page.

Follow the existing site's framework, components, and conventions. Where this spec conflicts with how the codebase already does something technically, follow the codebase and note the difference. Where it conflicts on content or compliance, follow this spec.

---

## 1. What the program is

The Cliffco Homebuyer Advantage Program is an employee benefit that Cliffco Mortgage Bankers offers through partner employers and union locals. It is not offered to the general public. Only employees (or union members) of partner organizations are eligible.

What eligible employees get:

- **A $10,000 lender credit toward closing costs** when they buy a home with a Cliffco mortgage. It works on any Cliffco loan program and applies to a home purchase or a relocation for work, in any of the 37 states where Cliffco is licensed.
- **Quarterly homebuyer education webinars**, open to every employee.
- **A dedicated team and phone line** for partner employees.
- **Homebuyer Concierge**: access to Cliffco's referral network of Realtors, attorneys, insurance agents, title companies and more. It also includes a team employees can call with questions whether or not they get their mortgage with Cliffco.
- **Homebuyer Certified**: pre-approval, then an initial commitment, then a fully underwritten written commitment that employees can bring to every offer.
- **Annual Mortgage Review** after closing.

The partner organization pays nothing, receives nothing, and employees are never required to use Cliffco.

**Terminology rule:** always call it a **credit** or **lender credit toward closing costs**. Never use the word "grant" anywhere, including the page title, meta tags, URL, alt text, button labels, or anything else that renders.

---

## 2. Page basics

- **URL:** `/homebuyer-advantage` (confirm with Sivon).
- **Indexing:** default to `noindex`. The program isn't public, so the page shouldn't rank in search where non-eligible people could find it and assume they qualify. Confirm with Sivon.
- **Who visits:** two groups arrive on this page.
  1. **Employees and members of partner organizations**, who come from flyers, QR codes and internal emails. They are the primary audience, and most will be on phones.
  2. **HR and union leaders** at organizations Cliffco is pitching, who need to understand the program from the employer side.

  The page speaks mainly to employees and includes one dedicated section for employers (section 3.11).
- **Navigation:** keep the regular site nav minimal or hidden, because this is a conversion page. Add one header CTA, "Get started", that scrolls to the form.

---

## 3. Page structure and draft copy

**All copy below needs compliance review before launch.** Keep it as written unless Sivon edits it. Don't rewrite it into shorter, punchier sentences: the house style is fluid, conversational sentences that connect to each other. Avoid fragment cascades, "not X but Y" constructions, rhetorical questions, and openings that assume something negative about the reader.

### 3.1 Hero

- **Eyebrow:** `An employee benefit through participating employers`
- **H1:** `$10,000 toward your closing costs when you buy a home with Cliffco`
- **Subhead:** `If your employer or union partners with Cliffco, you have access to the Homebuyer Advantage Program, which includes a $10,000 lender credit at closing, free homebuyer education, and a dedicated team to help you from your first call to the closing table.`
- **Primary CTA:** `See where I stand`, which scrolls to the employee form
- **Secondary CTA:** `Call the program team`, a tel: link to the program phone number (from site config, placeholder until assigned)
- **Footnote under the CTAs:** a "See disclaimer" link that anchors to the disclaimer block.

### 3.2 How the credit works

Show one large "$10,000" in a Sky #BDE8F1 band. Supporting copy:

`The credit is applied at closing and lowers the cash you need to bring to the table. It works with any Cliffco loan program, so you and your loan officer choose the right loan first and the $10,000 is applied on top of it.`

### 3.3 Two ways to use it

Use two cards.

- **Buying a home:** `Whether it's your first home or your next one, eligible employees receive $10,000 toward closing costs when they finance the purchase with Cliffco.`
- **Relocating for work:** `If your employer moves you to a new area, the credit applies to the home you buy there, which makes the move easier and more affordable.`

Under the cards: `Available in any of the 37 states where Cliffco is licensed.`

### 3.4 What's included

Use a four-card grid with icons.

1. **The $10,000 credit**: `A lender credit toward closing costs on your home purchase, on any Cliffco loan program.`
2. **Quarterly homebuyer education**: `Live webinars four times a year, open to every employee whether you plan to buy this year or a few years from now.`
3. **A dedicated team and phone line**: `One number that reaches a Cliffco team set up specifically for program members.`
4. **Homebuyer Concierge**: `Our referral network of Realtors, attorneys, insurance agents, title companies and more, plus a team you can call with questions whether or not you get your mortgage with Cliffco.`

### 3.5 Your path from first call to closing

Show six numbered steps, horizontal on desktop and stacked on mobile.

1. **Learn about the program**: `Through your employer's communications, this page, or one of our quarterly webinars.`
2. **Financial Discovery Call**: `A Cliffco loan officer walks through where you stand and your full financial picture for buying.`
3. **Meet the Homebuyer Concierge**: `Review our network of partners, including attorneys, insurance agents and Realtors.`
4. **Get Homebuyer Certified**: `Pre-approval and an initial commitment, followed by a fully underwritten commitment.`
5. **Close with $10,000**: `The credit is applied toward your closing costs at the closing table.`
6. **Annual Mortgage Review**: `A yearly check-in on your rate, insurance, taxes and equity after you move in.`

### 3.6 Homebuyer Certified

- **Headline:** `A written commitment before you make an offer`
- **Body:** `After your initial commitment, your file is fully underwritten and you receive a written commitment, so sellers see a buyer whose financing is already in place, which helps your offers get accepted faster.`
- **Visual:** three stages connected by arrows: Pre-approval, Initial commitment, then Homebuyer Certified, with the last stage highlighted in Sky.
- **Disclaimer directly below**, in small text: the commitment disclaimer from section 6.2.

The claim "helps your offers get accepted faster" needs compliance review.

### 3.7 Annual Mortgage Review

- **Headline:** `We keep checking in after you move in`
- **Four items:** Rate check (`your current rate compared with today's market`), Insurance check (`your homeowners insurance compared with current market pricing`), Taxes and escrow (`whether your property taxes or insurance costs have gone up`), and Home equity (`whether you're able to tap into your equity, and whether it makes sense to`).

### 3.8 Homebuyer education

- **Headline:** `Free quarterly webinars for program members`
- **Body:** `Four live sessions a year, open to every employee at a participating organization, covering the parts of buying a home that people ask us about most.`
- **Topic list:**
  - Getting mortgage-ready
  - Loan programs explained
  - Finding the right deals
  - How to get your offer accepted
  - The hottest towns right now
  - Building your homebuying team
  - Contract to closing
  - Your first year as a homeowner
- **Upcoming sessions:** make this list data-driven from a simple data file or the CMS. If no dates are set, hide the dates block and show `Upcoming dates are shared through your employer and posted here.`

### 3.9 FAQ

Use an accordion.

- **Who is eligible?** `Employees and members of organizations that partner with Cliffco on the Homebuyer Advantage Program, whether they're buying a home or relocating for work.` (Eligibility details need compliance review.)
- **How do I know if my employer participates?** `Your employer or union will share the program with you directly. If you're not sure, fill out the form below with your employer's name and we'll confirm.`
- **Do I have to use Cliffco?** `No. The program is voluntary and you're free to work with any lender. The $10,000 credit applies only to loans that close with Cliffco.`
- **Can I use the Homebuyer Concierge if I don't get my mortgage with Cliffco?** `Yes. The Concierge team is a resource for every program member, and you can call with questions at any point.`
- **Will my employer see my financial information?** `No. Your application and loan details stay between you and Cliffco.`
- **Does the credit have a cash value?** `No. It's applied toward closing costs at closing and can't be taken as cash.`
- **Can I combine it with other offers?** `The credit can't be combined with other offers.`
- **How do I get started?** `Fill out the form on this page or call the program team, and a loan officer will set up your Financial Discovery Call.`

### 3.10 About Cliffco

- **Body:** `Cliffco Mortgage Bankers is a direct mortgage lender headquartered in Uniondale and licensed in 37 states. We've been helping families buy homes since 1989, and our team knows the Long Island market and the local closing process.`
- **Stats row:** Since 1989 · Licensed in 37 states · NMLS #65328
- **Reviews block:** 4.9 / 5 average across 4,636+ reviews, broken out as Experience.com 4.9 (3,617+), Zillow 5.0 (1,000+), Google 4.9, Facebook 5.0, BBB A+. Pull these from the site's existing reviews data source if there is one. If they're hard-coded, flag them for periodic updates.

### 3.11 For employers (HR and union leaders)

Show this as a visually distinct band, for example on a black background.

- **Headline:** `Offer the Homebuyer Advantage Program to your team`
- **Body:** `The program costs your organization nothing to offer. Cliffco funds the $10,000 credit and provides the flyers, the webinars, the dedicated team and phone line, and everything your HR team needs to share it with employees. Participation is voluntary for employees, and organizations can also offer the program under their own name and branding.`
- **Three short points:** $0 cost to your organization · Light lift for HR · White-label option available
- **CTA:** `Talk to us about partnering`, which opens or scrolls to the employer inquiry form (section 4.2)

### 3.12 Lead forms

See section 4.

### 3.13 Disclaimer block

This holds the lender credit disclaimer (section 6.1), followed by the standard site legal footer: NMLS #65328, NMLS Consumer Access link, Equal Housing Opportunity logo and text, the licensing page link, and the privacy policy.

---

## 4. Forms

### 4.1 Employee form (primary)

| Field | Type | Required |
|---|---|---|
| First name | text | yes |
| Last name | text | yes |
| Email | email | yes |
| Mobile phone | tel | yes |
| Employer or union | text | yes |
| What are you looking to do? | select: Buy my first home · Buy my next home · Relocating for work · Just learning for now | yes |
| When are you hoping to buy? | select: Within 3 months · 3 to 6 months · 6 to 12 months · Over a year · Not sure yet | yes |
| Where are you looking to buy? | text | no |
| Contact consent | checkbox | yes |

**Hidden fields:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `landing_url`, `referrer`. Partner companies will be sent links with UTM tags (for example `?utm_campaign=homebuyer-advantage&utm_content=leviton`), so preserve UTMs through to submission. That's how leads get attributed to a company without separate pages.

### 4.2 Employer inquiry form (secondary)

Fields: name, title, organization, email, phone, approximate number of employees, and an optional message. Submissions route to the partnership contact. Confirm with Sivon whether Ryan Riddle's contact info (COO, 516-330-6289, rriddle@cliffcomortgage.com) should display on the page or only receive submissions internally.

### 4.3 Rules for both forms

- **No sensitive data.** Never collect SSN, date of birth, income, credit score, or account numbers.
- **Consent language** must be reviewed by compliance before launch. Use placeholder text marked `[CONSENT LANGUAGE — needs compliance review]` until it's provided.
- **Submission:** send to HubSpot through the site's existing integration or the Forms API, using separate forms or a form-type property for employee versus employer leads. Confirm the target forms and pipelines with Sivon.
- **Success state:** an inline confirmation. Don't promise a specific response time unless Sivon confirms one.
- **Spam and errors:** add a honeypot field plus the site's existing bot protection, and show inline field errors with real labels.

---

## 5. Design

Use the 2026 Cliffco brand system.

- **Colors:**
  - White (#FFFFFF) is the primary background, and Black (#0D0D0D) is used for contrast sections.
  - Sky (#BDE8F1) is the only accent, used sparingly for the $10,000 band, the highlighted step, and small tags. Never put Sky text on white.
  - Graphite (#3D4040) is for body text, Soft Gray (#B3B2B4) for secondary text on dark backgrounds, and Airy Gray (#F0EEF1) for card backgrounds.
- **Type:** Archivo for headlines and body, Instrument Serif for large statement lines, IBM Plex Mono for eyebrows, labels and small legal text.
- **Logo:** use the site's real CLIFFCO wordmark asset.
- **Layout:** mobile first, since most employee traffic will come from QR codes and internal emails opened on phones. Add a sticky bottom bar on mobile with "Call" and "Get started".
- **Accessibility:** WCAG 2.1 AA contrast, logical heading order, labeled form fields, and visible focus states.
- **Performance:** keep the page light and lazy-load anything below the fold.

---

## 6. Compliance requirements (non-negotiable)

### 6.1 Lender credit disclaimer

The approved disclaimer was written for named partners. For this generic page, use the version below and mark it **needs compliance review** before launch:

> Lender credit towards closing costs is available to employees and members of participating partner organizations. May not be available in all states. No cash value. Not valid in combination with any other offers. Offer available for loan applications taken by Cliffco Mortgage Bankers; the lender credit towards closing costs will be applied at closing and the loan must close through Cliffco Mortgage Bankers. Certain restrictions apply. For qualified borrowers. All borrowers subject to credit and underwriting approval. Rates, term, and loan program may be subject to change without notice.

Show it in the disclaimer block, and link to it from the hero and the $10,000 section.

### 6.2 Commitment disclaimer

Show this verbatim under the Homebuyer Certified section:

> This is not a commitment to lend or extend credit. Restrictions may apply. All loans are subject to credit and underwriting approval. Not all loan products are available in all states. Rates may not be available at time of application. Information and/or data are subject to change without notice.

### 6.3 Other rules

- **Credit, never grant.**
- **No rates, APRs, or payment examples** anywhere on the page.
- **No partner names or logos** on the page, and no implication that any employer recommends Cliffco or receives anything. The page should make clear the program is voluntary.
- **Equal Housing Opportunity** logo and text, plus NMLS #65328 with the NMLS Consumer Access link, must appear.
- **Approval names:** don't name who at Cliffco approves anything in on-page copy.
- **Pre-launch review:** leave a `<!-- COMPLIANCE REVIEW -->` marker in the source next to all draft copy, the consent language, and the generic disclaimer, and list them in the PR description.

---

## 7. Tracking

Fire analytics events for `advantage_cta_click` (with location), `advantage_call_click`, `advantage_form_start`, `advantage_form_submit`, and `advantage_employer_inquiry_submit`. Include UTM values with each event so traffic can be reported by partner company.

---

## 8. Acceptance checklist

- [ ] One page at the confirmed URL, with no partner-specific variants.
- [ ] The word "grant" appears nowhere in rendered output, metadata, or the URL.
- [ ] Both disclaimers render as written above.
- [ ] Both forms submit to HubSpot with UTMs attached, and the employee form captures the employer name.
- [ ] Mobile layout has a reachable call button and form, and passes AA contrast.
- [ ] No rates or payment examples, and no partner names or logos.
- [ ] Compliance review markers are in place, and the PR lists everything needing review.

---

## 9. Open questions to confirm with Sivon before building

1. Final URL path. `/homebuyer-advantage` is assumed.
2. Whether the page should be `noindex` (assumed) or indexable.
3. Which HubSpot forms and pipelines to use for employee and employer leads.
4. The program phone number, or a fallback until it's assigned.
5. Whether Ryan Riddle's contact info displays on the page.
6. Whether webinar dates come from the CMS or a data file.
