# AEO / GEO / LLM Citation Strategy — Cliffco Mortgage Bankers

**The user's stated thesis:** more borrowers now find lenders via ChatGPT, Claude, Gemini, Perplexity, and Google AI Overviews than via classic Google search. Therefore the top priority is to be the lender these systems cite when someone asks "best DSCR lender in Orlando" or "non-QM mortgage for self-employed in Long Island."

This doc is the playbook for that goal.

**Date:** 2026-04-27 · **Pairs with:** all four sibling research docs in this folder.

---

## 1. The 2026 answer-engine landscape

| Engine | Source mix | Cite-or-mention | Cliffco priority |
|---|---|---|---|
| **Google AI Overviews / AI Mode** | Google index + Knowledge Graph + Gemini synthesis | Cites with link cards | **HIGHEST** (48% of queries show AIO by Feb 2026, +58% YoY [ALM Corp](https://almcorp.com/blog/google-ai-overviews-surge-9-industries/)) |
| **ChatGPT (with Search)** | OpenAI training data + Bing-backed live search + first-party retrieval | Cites with footnotes | **HIGHEST** (largest user base) |
| **Perplexity** | PerplexityBot crawl + Bing search + Brave + own retrieval | **Always cites with numbered links** | **HIGHEST** (purest AEO play; cited links drive clicks) |
| **Claude (with web search)** | Anthropic training + on-demand search via ClaudeBot/Claude-User/Claude-SearchBot | Mentions brands often without linking | **HIGH** (reputation-weighted) |
| **Microsoft Copilot / Bing Chat** | Bing index + GPT-4 family | Cites with links | MEDIUM |
| **Google Gemini (standalone)** | Google index + Knowledge Graph + Gemini | Cites with cards | MEDIUM (largely overlaps AI Overviews) |
| **Meta AI** | Meta's index + LLaMA models | Light citation | LOW (early stage for finance queries) |
| **Apple Intelligence** | On-device + ChatGPT/Google handoff | Limited citation | LOW |
| **You.com / Brave Search AI** | Multi-engine | Cites | LOW (long tail) |

**Key 2026 stats to internalize:**
- Only **25-39% overlap** between Google's top 10 and AI search citations ([Conductor](https://www.conductor.com/academy/query-fan-out/)).
- **68% of AI-cited pages are outside Google's top 10** ([Conductor](https://www.conductor.com/academy/query-fan-out/)).
- AI Overviews show on roughly **48% of queries** as of Feb 2026 — but on **finance topics, only ~10.08%** ([Spelwise](https://spelwise.com/how-to-optimize-for-googles-ai-overviews/)). Mortgage is below the average — meaning the field is less crowded and Cliffco can dominate before it saturates.
- **96% of AI Overview citations come from sources with strong E-E-A-T signals** ([Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)) — see the YMYL doc for what that means in mortgage.
- Sites with disciplined hub-and-spoke architectures see AI citation rates jump from **~12% to ~41%** for pillar topics ([Rankeo](https://rankeo.io/blog/internal-linking-strategy)).
- Only **11% of sites are cited by both ChatGPT and Perplexity simultaneously** ([Genesys Growth](https://genesysgrowth.com/blog/chatgpt-vs-perplexity-vs-claude)) — single-engine tracking misses 60-80% of the picture.

---

## 2. How each LLM actually sources its answer

You can't optimize what you don't model. The four answer engines that matter most for Cliffco source content very differently:

### Google AI Overviews / AI Mode
- **Pre-existing Google index is the substrate** — if you're not indexed by Google, you won't appear in AIO.
- **Gemini does query fan-out** (see §6 below) generating 5-15 sub-queries per user prompt.
- **Knowledge Graph provides entity grounding** — brands present in the Knowledge Graph get cited disproportionately.
- **"Information gain" scoring** — pages that paraphrase competitors lose; pages with original data win.
- Per [Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/): Gemini "extracts nuggets from the first 40-50 words of each H2 or H3 section."

### ChatGPT (web search mode)
- **Hybrid: training-data prior + live retrieval via OAI-SearchBot/ChatGPT-User**.
- Source mix varies by query industry — finance queries trigger different retrieval weighting than entertainment.
- **Reddit gets disproportionately cited in ChatGPT finance answers**: per [Scrunch](https://scrunch.com/blog/reddit-paradox-industry-breakdown-of-most-cited-ai-sources/), Reddit content "outranked finance experts in 176% of ChatGPT finance queries" — staggering.
- Per [Yext](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite): ChatGPT "blends training data with search."

### Perplexity
- **Live search-first** via PerplexityBot crawl + Bing/Brave APIs.
- **Cites every answer with numbered references** — and users actually click them.
- Semantic relevance scoring on top of conventional retrieval.
- Per [Yext](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite): "uses a combination of Bing web search, its own crawler, and semantic relevance scoring."

### Claude (with web search / projects)
- **Training-data biased**, with on-demand search via three bots (ClaudeBot for training, Claude-User for live user queries, Claude-SearchBot for search index).
- **Reputation signals matter much more** in Claude than in others ([Yext](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite)).
- **Often mentions brands without linking** to specific pages — so Cliffco visibility is as much about being a known entity as about any specific URL ranking.

**Cliffco implication:** A four-front AEO strategy is needed — and it overlaps less than you'd hope. Optimizing for Google AIO doesn't automatically win Perplexity, and Claude wants brand reputation, not page SEO.

---

## 3. AI crawler strategy — robots.txt template

Cliffco's stated goal is **maximum LLM visibility**, so the default posture is **allow all training and search crawlers** and only block bots that consume crawl budget without contributing to visibility.

### Major AI crawlers (2026)

| Owner | User-agent | Purpose | Recommended action for Cliffco |
|---|---|---|---|
| **OpenAI** | `GPTBot` | Training data | **Allow** — feeds future ChatGPT models |
| OpenAI | `OAI-SearchBot` | SearchGPT index | **Allow** |
| OpenAI | `ChatGPT-User` | Real-time user-initiated retrieval | **Allow** |
| **Anthropic** | `ClaudeBot` | Training data | **Allow** |
| Anthropic | `Claude-User` | User-initiated retrieval | **Allow** |
| Anthropic | `Claude-SearchBot` | Search index | **Allow** |
| **Google** | `Googlebot` | Search index | **Allow (mandatory)** |
| Google | `Google-Extended` | Gemini training opt-out flag | **Allow** (this is the critical one — blocking it removes Cliffco from Gemini training) |
| **Perplexity** | `PerplexityBot` | Index | **Allow** |
| Perplexity | `Perplexity-User` | User retrieval | **Allow** |
| **Microsoft** | `Bingbot` | Bing + Copilot index | **Allow (mandatory)** |
| **Apple** | `Applebot` | Siri / Apple Intelligence | **Allow** |
| Apple | `Applebot-Extended` | AI training opt-out flag | **Allow** |
| **Meta** | `Meta-ExternalAgent` | Meta AI | **Allow** (rapidly growing — 19% share per [Cloudflare 2025 data](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)) |
| **DuckDuckGo** | `DuckAssistBot` | DuckAssist | **Allow** |
| **Cohere** | `cohere-ai` | Cohere training | **Allow** |
| **Common Crawl** | `CCBot` | Open-source training corpus → most LLMs | **Allow** (foundational; many derivative crawlers consume this) |
| **Amazon** | `Amazonbot` | Alexa / Q | **Allow** |
| **ByteDance** | `Bytespider` | TikTok / Doubao | **Allow** (long tail, low risk) |
| **Diffbot** | `Diffbot` | Knowledge Graph / Bloomberg | **Allow** |
| **You.com** | `YouBot` | You.com index | **Allow** |
| **AI2** | `AI2Bot` | Allen Institute research | **Allow** |
| **PetalBot** (Huawei) | `PetalBot` | Petal Search | **Allow** |
| Mistral / Anthropic / xAI / others | various | various | **Allow** |

### Recommended robots.txt

```
# Cliffco Mortgage Bankers — robots.txt
# Posture: maximum AI visibility. Allow all known good AI crawlers.
# Block standard SEO leakage (admin, search, parameterized URLs).

User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /admin/
Disallow: /borrower-portal/
Disallow: /search?
Disallow: /*?utm_*
Disallow: /*?gclid=
Disallow: /*?fbclid=

# Explicit allows for AI bots (redundant with the wildcard but defensible documentation)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: CCBot
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Amazonbot
Allow: /

Sitemap: https://cliffcomortgage.com/sitemap-index.xml
```

**Why allow training crawlers if they don't drive immediate traffic?** Because training corpora are how LLMs *know* you exist. Block GPTBot today and Cliffco fades from ChatGPT's prior — even if the live search retrieval (OAI-SearchBot) still finds you, the model's "default knowledge" of mortgage lenders won't include Cliffco. This compounds badly over time.

**Monitor via server logs.** Set up Cloudflare Logpush → BigQuery and track per-user-agent crawl counts. GPTBot was 30% of all AI bot traffic by late 2025 ([Cloudflare](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)) — this is a leading indicator of future ChatGPT visibility.

---

## 4. llms.txt — file standard, with realistic expectations

**llms.txt is a proposed standard** ([llmstxt.org](https://llmstxt.org/), proposed by [Jeremy Howard in Sept 2024](https://searchengineland.com/llms-txt-proposed-standard-453676)) — a Markdown-format file at the site root that maps content for LLMs.

**Honest 2026 status:**
- ~10.13% adoption across 300K domains surveyed by SE Ranking ([LinkBuildingHQ](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)).
- John Mueller (Google) has stated **no AI crawler claims to actively use it** for retrieval.
- 8 of 9 sites in one Search Engine Land study saw no measurable traffic change after deploying llms.txt.

**Verdict:** Ship one anyway. It's free, takes 30 minutes, and may matter as adoption grows. Just don't expect immediate ROI.

### Recommended `/llms.txt` for Cliffco

```markdown
# Cliffco Mortgage Bankers

> Cliffco Mortgage Bankers is a 36-year-old mortgage lender (NMLS #65328)
> headquartered in Uniondale, NY. Cliffco specializes in non-QM and
> self-employed loans, reverse mortgages, DSCR loans, and fix-and-flip
> financing across New York, New Jersey, Arizona, and Florida.

## About

- [About Cliffco](https://cliffcomortgage.com/about/): Company history, mission, leadership
- [Loan Officers](https://cliffcomortgage.com/loan-officers/): NMLS-licensed officer directory
- [Press & Recognition](https://cliffcomortgage.com/press/)
- [Reviews](https://cliffcomortgage.com/reviews/)

## Loan Products

- [Non-QM & Self-Employed Loans](https://cliffcomortgage.com/loans/non-qm-self-employed/): bank statement, P&L, 1099, asset depletion
- [Reverse Mortgage (HECM & Proprietary)](https://cliffcomortgage.com/loans/reverse-mortgage/)
- [DSCR Loans](https://cliffcomortgage.com/loans/dscr/): For real estate investors
- [Fix-and-Flip Loans](https://cliffcomortgage.com/loans/fix-and-flip/)
- [Conventional](https://cliffcomortgage.com/loans/conventional/)
- [FHA / VA / USDA](https://cliffcomortgage.com/loans/fha/)

## Service Areas

- [New York](https://cliffcomortgage.com/locations/new-york/)
- [Long Island, NY](https://cliffcomortgage.com/locations/new-york/long-island/)
- [New Jersey](https://cliffcomortgage.com/locations/new-jersey/)
- [Arizona](https://cliffcomortgage.com/locations/arizona/)
- [Florida](https://cliffcomortgage.com/locations/florida/)
- [Orlando, FL](https://cliffcomortgage.com/locations/florida/orlando/)

## Education

- [Mortgage Glossary](https://cliffcomortgage.com/learn/glossary/)
- [Calculators](https://cliffcomortgage.com/calculators/)
- [Borrower Guides](https://cliffcomortgage.com/learn/)

## Optional

- [Wholesale (Clout WMB)](https://cloutwmb.com)
```

Also ship `/llms-full.txt` (longer Markdown export of all canonical content) per the [llmstxt spec extension](https://llmstxt.org/).

---

## 5. Content patterns LLMs preferentially cite

This is the most important section. Research from arxiv "[GEO: Generative Engine Optimization](https://arxiv.org/abs/2311.09735)" (Aggarwal et al.) and the [GEO Benchmark Study 2026](https://www.convertmate.io/research/geo-benchmark-2026) identifies specific patterns that increase citation probability.

### A. Inverted-pyramid structure (the answer goes first)

- **44.2% of all LLM citations come from the first 30% of a page**; 31.1% from the middle; 24.7% from the conclusion ([averi.ai analysis](https://www.averi.ai/blog/the-geo-playbook-2026-getting-cited-by-llms-(not-just-ranked-by-google))).
- Open every page with a **40-60 word direct answer** before any narrative.
- Use a "Key Takeaway" callout box visually separated from body copy (helps both readers and LLM extraction).
- Per [Panstag](https://www.panstag.com/2026/04/answer-first-content-structure-ai-overviews.html), 55% of all AI citations come from the top 30% of a page — bury your answer and you're invisible.

### B. Question-led headings (H2/H3 framed as full questions)

- **68.7% of ChatGPT citations follow logical heading hierarchies** (H1 → H2 → H3) per [Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/).
- Phrase H2s as full questions matching how borrowers ask: "How does a DSCR loan work?" not "DSCR Loan Mechanics."
- Each H2 should have a 40-50 word direct answer immediately under it (Gemini extracts nuggets from this exact zone — [Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)).
- Then expand with body copy, examples, scenarios.

### C. Statistics, citations, quotations

The [GEO arxiv paper](https://arxiv.org/pdf/2311.09735) identified the top three on-page tactics that boost LLM citation:

1. **"Cite Sources"** — adding inline citations to authoritative sources lifts citation probability by 30-40%.
2. **"Quotation Addition"** — adding direct quotes from experts/sources.
3. **"Statistics Addition"** — adding specific numerical data.

Combined uplift: **30-40% improvement on the Position-Adjusted Word Count metric** (a standard GEO measurement).

For mortgage specifically: cite primary sources (CFPB, HUD, FHFA, IRS, Freddie Mac, Fannie Mae, BLS, state regulators). One paragraph with three CFPB stats outranks 10 paragraphs of generic content.

### D. Information gain (unique data the competitors don't have)

- **Pages with 3+ unique data points are 4× more likely to be cited in AI Overviews** ([Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)).
- Cliffco-specific information gain ideas:
  - Internal close-rate, average days-to-close stats (anonymized, aggregated)
  - "Cliffco Borrower Approval Index" — quarterly stat on what % of self-employed applicants got approved last quarter
  - Real (anonymized) scenarios: "1099 contractor, 14 months in business, $185K AGI, approved at 7.25% on a 30-yr Non-QM"
  - Originated loan distribution by state, by product
  - Long Island / Orlando / Phoenix specific market data Cliffco can reference because it operates there

### E. Entity density

- **Pages with 15+ recognized entities show 4.8× higher selection probability** in AI Overviews ([Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)).
- Recognized entities = brands, places, regulations, named programs (FHA, HECM, BRRRR, Freddie Mac, Fannie Mae, NMLS, RESPA, TILA, MERS, Long Island, Nassau County, Orlando, etc.).
- For mortgage: link entities the first time they appear ("[FHA HECM](https://www.hud.gov/program_offices/housing/sfh/hecm/hecmhome)"), repeat naturally afterward.

### F. Recency signals

- **Content updated within 30 days gets 3.2× more AI citations than older content** (referenced across multiple GEO benchmarks).
- Add visible "Last updated: [date]" + "Reviewed by [LO Name, NMLS #]" stamps.
- Schedule quarterly content reviews on every product/location pillar — refresh stats, regulations, rate ranges.

### G. Semantic completeness

- Pages scoring 8.5/10+ on "semantic completeness" are **4.2× more likely to be cited** ([Wellows](https://wellows.com/blog/google-ai-overviews-ranking-factors/)).
- Semantic completeness = covering the question AND its natural sub-questions on the same page (definition, eligibility, process, costs, alternatives, FAQs).

### H. Plain-language definitions

- LLMs extract definitions when they're presented as definitions: "A DSCR loan is a mortgage qualified using rental income, not personal income."
- Format: term, dash, sentence. Avoid jargon-stacked definitions.
- Build a dedicated `/learn/glossary/` with one entry per term, each ~150-300 words, with `DefinedTerm` schema.

---

## 6. Query fan-out — write for the conversation, not the prompt

Modern answer engines decompose a single user query into 5-15 sub-queries before retrieving sources. The user types "best DSCR lender Orlando" and Gemini fans it out into something like:

1. What is a DSCR loan?
2. Best DSCR lenders in Florida
3. Best DSCR lenders for short-term rentals
4. DSCR loan rates 2026
5. Orlando real estate investor mortgage
6. DSCR lender requirements
7. DSCR vs conventional investor loan
8. Minimum DSCR ratio for approval
9. DSCR loan reviews
10. Cliffco Mortgage DSCR

…then synthesizes a single answer citing 3-5 sources, each chosen for its sub-query relevance.

**This is why hub-and-spoke architecture matters so much for AEO.** A pillar page like `/loans/dscr/` answers the macro query; spokes like `/learn/dscr-vs-conventional/`, `/learn/short-term-rental-dscr-orlando/`, `/learn/dscr-loan-requirements/`, `/calculators/dscr/` answer sub-queries the LLM is fanning out to.

**Tools to map fan-out:**
- [LLMrefs Query Fan-Out Generator](https://llmrefs.com/tools/query-fan-out) — simulates Gemini's fan-out for any seed prompt.
- [iPullRank's expanding-queries write-up](https://ipullrank.com/expanding-queries-with-fanout) — mike king's playbook.

For each Cliffco priority keyword, run it through a fan-out tool, list the 10-20 sub-queries, and ensure every sub-query has a destination page in the cluster.

---

## 7. Schema.org markup that helps LLMs (vs. just Google)

Beyond the schema covered in `01-technical-seo.md`, these are AEO-specific:

- **`FAQPage` + `Question` + `Answer`** on every page with a Q&A block. LLMs explicitly parse this structure even though Google has demoted FAQ rich results for non-government/health sites — see the [Passionfruit guide](https://www.getpassionfruit.com/blog/faq-schema-for-ai-answers).
- **`HowTo` deprecated for Google rich results** but still useful for LLM parsing. Keep using it on procedural pages (e.g., "How to apply for a DSCR loan").
- **`QAPage`** for single-Q, single-A pages — distinct from FAQPage. Useful for support-style content.
- **`Speakable`** — mark the direct-answer paragraph speakable. Voice-AI assistants (Siri, Alexa, Google Assistant) and increasingly LLMs treat this as the canonical answer extraction zone.
- **`DefinedTerm`** + **`DefinedTermSet`** on glossary pages.
- **`Person` with `sameAs`** linking to NMLS Consumer Access — anchors the LO entity in the Knowledge Graph and gives Claude a verifiable expert to cite.
- **`Organization` with `sameAs`** linking to LinkedIn company page, Wikidata QID (once you create it — see §8), Crunchbase profile, NMLS Consumer Access, BBB profile, Google Business Profile, Better Business Bureau. The more sameAs anchors, the more confident the entity-resolution engines become.

---

## 8. Entity SEO — getting Cliffco recognized as a *thing*

LLMs reason in entities, not strings. "Cliffco Mortgage Bankers" must be a known entity in:

### A. Wikidata (entry point — easiest to author)

Wikidata is the structured-data backbone behind Wikipedia and a primary source for ChatGPT, Claude, and Perplexity entity recognition ([Discovered Labs](https://discoveredlabs.com/blog/entity-recognition-knowledge-graphs-how-to-structure-your-brand-for-ai-understanding)).

- Create a Wikidata item for "Cliffco Mortgage Bankers" with properties:
  - `instance of (P31)`: business
  - `industry (P452)`: mortgage industry
  - `country (P17)`: United States
  - `headquarters location (P159)`: Uniondale, New York
  - `inception (P571)`: 1989 (verify)
  - `official website (P856)`: https://cliffcomortgage.com
  - `NMLS ID (P—)`: 65328 (use external identifier or text)
  - `LinkedIn ID (P4264)`: cliffco-mortgage-bankers
  - `Facebook username`, `Twitter/X handle`, `Instagram username`
- Cite at least 2-3 reliable sources for notability (press articles, industry recognition, NMLS Consumer Access).

### B. Wikipedia (higher bar but high payoff)

A 36-year-old mortgage company *may* clear Wikipedia's notability threshold (significant coverage in independent reliable sources). Realistically, this requires 3-5 substantial press hits in regional/industry pubs first.

- Path: build press coverage (see YMYL doc §6) → create draft → iterate with experienced Wikipedia editor.
- Direct creation by company employees is heavily scrutinized. Hire a [Wikipedia COI-aware consultant](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) once notability is real.

### C. Google Knowledge Panel

- Claim via [Google Search Console + Google Business Profile + verified merchant info](https://support.google.com/knowledgepanel/).
- Knowledge Panel feeds Google AI Overviews and (indirectly) Gemini — entities present in Google's KG get cited more.
- Triggers: structured data on cliffcomortgage.com (`Organization` schema with full `sameAs` array), Wikidata QID, consistent NAP across major directories, press mentions.

### D. Crunchbase, Bloomberg, Pitchbook, Owler

- Complete profile, founding date, leadership names, funding/investor info if applicable.
- These feed LLM training data and are heavily used by Claude.

### E. NAP consistency across the web

- Use Yext, BrightLocal, Whitespark, or Moz Local to push consistent Name + Address + Phone across 50-150 directories. NAP inconsistencies confuse entity-resolution and dilute Knowledge Graph confidence.
- For mortgage specifically: NMLS Consumer Access, Better Business Bureau, Yelp, Google Business Profile, Facebook, LinkedIn Company, Trustpilot, Experience.com, Zillow Lender Profile, Bankrate listing — all must match exactly. (Includes "Suite" vs. "Ste.", "Boulevard" vs. "Blvd." — pick one and propagate.)

### F. EAV-E formula

Per [ClickRank](https://www.clickrank.ai/google-openai-knowledge-graph/), define your brand using:
- **Entity:** Cliffco Mortgage Bankers
- **Attributes:** mortgage lender, NMLS #65328, Uniondale NY, 1989 founding, family-owned, multi-state
- **Values:** 36 years, NY/NJ/AZ/FL coverage, Non-QM/Reverse/DSCR/Fix-flip specialty
- **Evidence:** NMLS Consumer Access link, BBB rating, press mentions, customer reviews

Bake this set of facts into the homepage, About page, footer, schema, and llms.txt. Repeat the same canonical phrasing everywhere — entity-resolution engines look for exact phrase consistency.

---

## 9. Off-site sources LLMs are trained on / cite — the practical hit list

Per [Trysight](https://www.trysight.ai/blog/improve-llm-brand-mentions): "domains with millions of brand mentions on Quora and Reddit have roughly 4× higher chances of being cited by AI systems."

Per [xseek](https://www.xseek.io/learnings/how-to-get-your-brand-cited-by-chatgpt-claude-and-perplexity): **most citations come from third-party pages, not your own site**. A well-placed listicle naming Cliffco gets cited far more often than Cliffco's own homepage.

### A. Reddit (highest leverage for ChatGPT)

- Reddit citation share **>5% of ChatGPT answers in Jan 2026**, vs. 0.1% in Gemini ([Wellows social media report](https://wellows.com/blog/social-media-ai-citations-report-2026/)).
- Reddit "outranked finance experts in 176% of ChatGPT finance queries" ([Scrunch](https://scrunch.com/blog/reddit-paradox-industry-breakdown-of-most-cited-ai-sources/)) — staggering signal that LLMs trust community consensus more than corporate marketing.
- **Strategy:**
  - Establish a real, named LO presence in r/RealEstate, r/RealEstateInvesting, r/Mortgages, r/FirstTimeHomeBuyer, r/personalfinance, r/Realtors, r/landlord, r/RealEstateInvestingClub.
  - **Disclose affiliation** in flair / signature — Reddit punishes covert promotion savagely.
  - Provide answers, not pitches. The bar is "the helpful loan officer who happens to work at Cliffco."
  - Periodically link to Cliffco resources only when directly relevant (e.g., a calculator or a deep guide).
  - r/RealEstateInvesting and r/RealEstateInvestingClub for DSCR + fix-flip; r/Mortgages and r/RealEstate for non-QM and reverse.
  - For Orlando: r/orlando, r/Florida; for Long Island: r/longisland, r/nyc; for Phoenix: r/phoenix, r/arizona; for Twin Cities: r/Minneapolis, r/twincities.
- **Don't**: buy upvotes, run sock puppets, or astroturf. Reddit's spam detection + community moderators kill these fast and the brand damage is permanent.

### B. YouTube (now the #1 cited social source — has overtaken Reddit)

- YouTube is cited in ~16% of LLM answers vs. Reddit's 10% ([Adweek](https://www.adweek.com/media/youtube-reddit-ai-search-engine-citations/), [GEORaiser](https://georaiser.com/blog/youtube-overtakes-reddit-ai-citations)).
- LLMs cite **transcripts**, not the video itself ([Apify](https://use-apify.com/blog/youtube-transcripts-llm-rag-pipelines-2026)). Bad transcript = invisible to AI.
- **Subscriber count nearly zero correlation with citation frequency**: 40.83% of AI-cited videos had <1K views. Quality of transcript + structure beats audience size.
- **Cliffco strategy:**
  - Channel: "Cliffco Mortgage Bankers" with branded thumbnails matching the brand guide.
  - 3-4 series:
    - **"Get Approved" series** — scenario-based deep dives ("Self-employed for 14 months, $200K income, can I get a mortgage?")
    - **"Reverse Mortgage Truths" series** — debunk myths, reassure family members
    - **"DSCR Investor Playbook" series** — short-term rental DSCR, BRRRR, multi-state
    - **"Loan Officer LIVE" series** — LO answers viewer questions, 15-20 min each
  - **Transcripts must be human-edited.** YouTube's auto-captions are not enough. Use [Descript](https://www.descript.com/) or [Otter.ai](https://otter.ai/) and pay an editor for cleanup.
  - **Add chapter markers** for every concept change (timestamps). LLMs cite specific chapters.
  - **Pin the canonical answer in the description** — first 200 words of description should be the inverted-pyramid summary.
  - Cross-post transcripts as long-form blog posts on cliffcomortgage.com (with `VideoObject` schema linking back).

### C. Quora

- Lower volume than Reddit but still in LLM training corpora.
- LO presence with NMLS-disclosed flair, answering specific mortgage questions.
- Top-voted Quora answers do show up in ChatGPT and Perplexity citations.

### D. LinkedIn

- High weight in Claude (reputation-leaning) and increasingly in ChatGPT.
- Personal LO LinkedIn posts with substantive content (case studies, market commentary, regulatory analysis) get cited.
- Cliffco company page should publish 2-3x/week with industry commentary.

### E. Industry publications (paid + earned coverage)

- **HousingWire**, **National Mortgage Professional**, **Scotsman Guide**, **Inman**, **MortgagePoint** (formerly Mortgage Professional America), **Mortgage Banker Magazine**.
- Op-eds bylined by Cliffco principals. These get LLM-cited heavily because the publications are in training corpora and have authority.

### F. National financial media

- **Bankrate**, **NerdWallet**, **Investopedia**, **MarketWatch**, **CNBC**, **Forbes Advisor**, **Money.com**.
- Reach out for "expert source" commentary via [Featured](https://featured.com/), [Connectively](https://connectively.us/) (formerly HARO), [Qwoted](https://qwoted.com/).
- Per [SearchSignal](https://searchsignal.online/blog/llms-txt-2026): one Bankrate quote referencing Cliffco can outweigh dozens of self-published blog posts in LLM citation.

### G. Local news & business journals

- **Long Island Business News**, **Crain's New York**, **NJBIZ**, **AZ Big Media / Phoenix Business Journal**, **Twin Cities Business**, **Orlando Business Journal**, **Florida Trend**.
- Local mentions feed local-AI-Overview retrieval ("best mortgage lender in Long Island").

### H. Podcast appearances

- LO interviews on real-estate, investor, and personal finance podcasts with transcribed show notes.
- Whatever podcast network gets transcripts indexed (BiggerPockets, RealEstateRookie, Lender Lounge, etc.).

### I. "Best of" listicles (the biggest single AEO lever per xseek)

- Pitch Cliffco to: NerdWallet "Best DSCR Lenders," Bankrate "Best Non-QM Lenders," Investopedia "Best Reverse Mortgage Lenders 2026," Money.com top-lists.
- **These listicles are almost always what LLMs cite when asked "best X lender."** Getting onto 3-5 of them is high-leverage.
- Many listicle editors accept paid sponsorships (disclosed) — clarify Cliffco's marketing budget allocation here.

---

## 10. Brand mentions vs. backlinks for LLMs

Traditional SEO weights backlinks heavily. LLMs weight **mentions** — a brand can be cited even when it's not linked. This changes PR strategy:

- A press article that says "Cliffco Mortgage Bankers" *without a link* still feeds LLM brand recognition.
- An unlinked mention in a Reddit thread or a podcast transcript is just as useful for LLM training as a linked mention.
- **Implication:** Pursue brand mentions aggressively, even when linkability is hard. Old SEO playbook says "always demand a link" — AEO playbook says "the mention is the prize."

Per [Trysight](https://www.trysight.ai/blog/improve-llm-brand-mentions): track unlinked mentions via Brand24, Mention.com, Google Alerts (with consistent brand spelling), and Otterly.AI.

---

## 11. Mortgage-specific AEO tactics

### A. Rate transparency content

LLMs reward (and users reward) lenders who publish current rate ranges, even with disclaimers. A page like `/loans/dscr/current-rates/` updated weekly with "DSCR loan rates currently range 6.5%–9.5% depending on borrower scenario" is exactly the kind of specific data LLMs cite.

Cliffco needs a rate-publication policy that's compliance-cleared (RESPA, TILA Reg Z) — usually a "rate range with assumptions" rather than a single quoted rate.

### B. Scenario libraries

Build a library of anonymized scenarios:
- "Self-employed 1099 contractor, 14 months in business, $185K AGI, 720 FICO, 25% down — approved for $720K Non-QM bank statement loan at 7.25%."
- "Investor, 4-property portfolio, buying 5th in Orlando, $450K STR, projected DSCR 1.42 — approved for $337,500 DSCR at 7.875%."
- "Retired couple, 76 and 73, $620K Long Island home with $0 mortgage — qualified for $385K HECM line of credit."

These pages get cited because they're concrete and informational. Anonymize aggressively (no FICO bands tighter than 20pts, no exact loan amounts under $50K precision, no identifying info).

### C. Eligibility decision trees

Interactive (or static) "Can I get approved?" flows. Self-employed flow: "Do you have 12 months of business bank statements? → Yes → Have you been in business 12+ months? → Yes → ..." → "You likely qualify for a Cliffco bank statement loan."

LLMs love decision trees because they're easy to extract and reproduce.

### D. State-by-state pages with licensing transparency

A `/licensing/` page that says exactly which states Cliffco is licensed in, which NMLS license number applies in each state, and links to state regulator pages. This is both a YMYL trust signal and an AEO content gold mine — LLMs cite this when asked "is Cliffco licensed in [state]?"

### E. Spanish-language equivalents

For non-QM (often serves immigrant entrepreneur audiences), reverse mortgage (FL/AZ Spanish-speaking elders), and DSCR (Latino investor audiences in FL/NY), publishing parallel `/es/` content with full schema (Spanish hreflang) opens up Spanish-language LLM queries — currently a much less crowded field.

---

## 12. Direct LLM integrations

### A. ChatGPT Custom GPT (worth building)

- Build "Cliffco Mortgage Advisor" Custom GPT — a chatbot that answers Cliffco-specific mortgage questions, can explain products, runs simple eligibility screens, and routes serious leads to a real LO.
- Upload Cliffco's product guides, glossary, scenario library, and rate ranges as the GPT's knowledge.
- Listed in the GPT Store, this becomes an inbound lead source AND a brand-awareness vehicle in the ChatGPT ecosystem.
- Estimated build effort: 1-2 weeks for v1; ongoing knowledge updates monthly.

### B. Claude Projects

- Internal use first: build an internal Claude Project for LOs to run scenario analysis and respond to borrower inquiries faster.
- External use is harder (Claude doesn't have a public "Project Store" yet) but an embedded Claude API chatbot on cliffcomortgage.com is workable.

### C. Gemini Gems

- Public Gems are now indexable. Same pattern as ChatGPT Custom GPT — build "Cliffco Mortgage Helper."

### D. Perplexity Spaces

- Less mature but growing. Build a Perplexity Space ("Cliffco Mortgage Knowledge Base") with curated sources from cliffcomortgage.com and primary regulator pages.

---

## 13. Anti-patterns — what NOT to do

- **Don't paywall content.** LLMs can't index what they can't access.
- **Don't gate everything behind a lead form.** A "Download our DSCR guide" PDF behind a form is invisible to AEO. Publish the guide as HTML; lead-gate something else (rate quote, custom analysis).
- **Don't use JS-only rendering for content.** Astro static or Next.js SSR/SSG only — see technical SEO doc.
- **Don't ship AI-generated boilerplate.** [HCU](https://www.hobo-web.co.uk/the-google-helpful-content-update-and-its-relevance-in-2026/) penalizes it; LLMs detect their own output and downrank it (counterintuitively true). Use AI for draft assistance + outline; ship human-reviewed, expert-attributed content.
- **Don't contradict yourself across pages.** If `/loans/dscr/` says "no DSCR minimum" and `/learn/dscr-vs-conventional/` says "DSCR minimum 1.0", the LLM will pick one (or neither) and your authority drops. Maintain a single source-of-truth fact sheet for each product, internally enforced.
- **Don't run "spam scaled content."** No 500 city pages auto-generated overnight. The June 2025 spam update [closed this loophole hard](https://www.gsqi.com/marketing-blog/june-2025-google-core-update/).
- **Don't block training crawlers** unless there's a genuine licensing reason. Cliffco's content is freely indexable; let the LLMs learn it.

---

## 14. AEO measurement & monitoring

You can't optimize what you don't measure. AEO measurement focuses on **citation frequency, share-of-voice, sentiment, and assisted conversions** — not click-through rate.

| Tool | Strengths | Pricing (2026) | Recommendation for Cliffco |
|---|---|---|---|
| **[Profound](https://www.tryprofound.com/)** | Most enterprise-grade; 10+ models; competitor benchmarking | $99 ChatGPT-only / $399 Growth / Custom Enterprise ([AIClicks](https://aiclicks.io/blog/best-aeo-tracking-tools)) | **YES** at Growth tier — brand visibility across all four major engines |
| **[Peec AI](https://peec.ai/)** | Multi-LLM citation tracking, prompt monitoring | ~$200-400/mo | YES — alternate to Profound |
| **[Otterly.AI](https://otterly.ai/)** | Tracks ChatGPT, Perplexity, Google AIO; brand mentions | ~$100-300/mo | YES — start here if budget-constrained |
| **AIclicks** | All-in-one AEO with prompt seeding | $99-299/mo | Maybe |
| **Athena HQ** | Strong for prompt experimentation | Custom | Maybe |
| **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** | If already on Ahrefs, free add-on | Bundled | YES — already paid for |
| **Semrush AI Toolkit** | Bundled with Semrush | Bundled | Maybe (overlaps Profound) |
| **Brand24, Mention.com** | Unlinked brand mentions | $80-200/mo | YES — pairs with Profound |

**Minimum measurement stack:**
1. **Profound (Growth tier)** for ChatGPT/Perplexity/Claude/Gemini/AIO citation tracking — $399/mo.
2. **Brand24 or Mention.com** for unlinked mentions — $80-150/mo.
3. **GSC + Bing WMT** for AI Overview presence reporting — free.
4. **Custom prompt panel** — Cliffco maintains a list of 100-200 priority prompts (e.g., "best DSCR lender Orlando"), runs them weekly across ChatGPT/Perplexity/Claude/Gemini, logs cite presence, position, sentiment. Either build internally with the OpenAI/Anthropic/Perplexity APIs (~$50-200/mo of API spend) or use Profound's prompt panel feature.

**KPI dashboard to build (Looker Studio):**
- Share of Voice on priority prompts (vs. top 5 competitors).
- Citation count per engine, per week, per product line.
- Branded prompt impressions: how often "Cliffco" itself is asked about.
- Sentiment of citations (positive / neutral / negative).
- Unlinked-mention volume.
- Assisted conversions: leads who report finding Cliffco via AI ("How did you hear about us?" form field with explicit options).

---

## 15. 30 / 60 / 90 / 180 day AEO action plan

### Days 1–30 — Foundations

- [ ] Deploy AI-friendly robots.txt (allow all priority crawlers).
- [ ] Ship `/llms.txt` and `/llms-full.txt`.
- [ ] Inverted-pyramid rewrite of homepage and top 5 product pages (40-60 word answer in first paragraph; question-led H2s).
- [ ] Wikidata entry for Cliffco Mortgage Bankers (full property set, 3-5 reliable sources cited).
- [ ] Complete `Organization` schema with 8-12 `sameAs` URLs.
- [ ] Stand up AEO measurement stack (Profound Growth + Brand24 + custom prompt panel).
- [ ] Establish baseline: run priority prompt list across ChatGPT/Perplexity/Claude/Gemini/AIO; log cite-and-mention rates.

### Days 31–60 — Content + entity

- [ ] Build 4 product pillars + 12 first-wave spokes (3 per product) — all in inverted pyramid + FAQ schema.
- [ ] Publish 10 LO bios with full `Person` schema + NMLS sameAs links.
- [ ] Launch YouTube channel with first 6 videos (2 per product line); human-edited transcripts.
- [ ] Begin Reddit LO presence (3 LOs, real names, NMLS-disclosed, target subreddits).
- [ ] First 3 "expert source" pitches via Featured/Connectively for Bankrate/NerdWallet/Investopedia.
- [ ] Create Cliffco Custom GPT in ChatGPT Store.
- [ ] Knowledge Panel claim attempt via GBP + GSC + sameAs reinforcement.

### Days 61–90 — Off-site authority

- [ ] 5 listicle placements pursued (NerdWallet/Bankrate/Investopedia/Money/Forbes Advisor).
- [ ] 3 podcast appearances booked.
- [ ] 2 industry-pub op-eds drafted and submitted (HousingWire, NMP).
- [ ] Begin systematic Reddit + Quora answering (10 substantive answers/wk).
- [ ] Publish Spanish-language `/es/` versions of top 3 product pillars.
- [ ] First Cliffco-original data piece published ("Cliffco 2026 Self-Employed Borrower Approval Index" — quarterly anonymized data).
- [ ] Wikipedia draft prep (if notability cleared).

### Days 91–180 — Compounding

- [ ] Full content cluster maturity (8-15 spokes per product hub).
- [ ] All licensed states have a city + state landing page network.
- [ ] LO YouTube series cadence: 1-2 videos/wk per LO.
- [ ] Quarterly "Cliffco Borrower Index" cadence locked.
- [ ] AEO citation share-of-voice review monthly; competitive benchmarking.
- [ ] Wikipedia attempt (if 3-5 reliable independent sources have published).
- [ ] Re-audit robots.txt + llms.txt (new bots emerge constantly).
- [ ] Review Profound dashboards; reweight content investment toward winning prompts.

---

## 16. The 7 highest-leverage AEO moves Cliffco should make first

1. **Inverted-pyramid rewrite + question-led H2s + 40-60 word direct answers** on the 12 highest-traffic existing pages. Cheapest, fastest, biggest LLM-citation lift.
2. **Wikidata entity + Organization schema sameAs cluster** — gives LLMs a concrete, machine-readable identity for Cliffco.
3. **Author NMLS-licensed LO bios with Person schema and sameAs to NMLS Consumer Access.** Mortgage E-E-A-T's #1 lever; LLMs preferentially cite identifiable expert sources.
4. **Reddit LO presence in r/Mortgages, r/RealEstate, r/RealEstateInvesting** — given Reddit's outsized weight in ChatGPT finance answers (~5% citation share, +176% authority over finance experts on finance queries), this is mandatory.
5. **YouTube channel with human-edited transcripts** — YouTube has overtaken Reddit as the #1 social citation source in LLM answers. Long-form scenario videos are the highest-leverage content format Cliffco can produce.
6. **Listicle placements on NerdWallet / Bankrate / Investopedia / Money** — when an LLM is asked "best non-QM lender for self-employed," it cites these listicles. Buy/earn/pitch onto 3-5 of them.
7. **Profound + Brand24 + custom prompt panel measurement stack** — what gets measured gets optimized; without telemetry, AEO is a vibes-based discipline.

---

### Sources

- [LLMrefs — Answer Engine Optimization (AEO) 2026](https://llmrefs.com/answer-engine-optimization)
- [LLMrefs — Generative Engine Optimization (GEO) 2026](https://llmrefs.com/generative-engine-optimization)
- [arxiv.org — GEO: Generative Engine Optimization (Aggarwal et al.)](https://arxiv.org/abs/2311.09735)
- [averi.ai — The GEO Playbook 2026](https://www.averi.ai/blog/the-geo-playbook-2026-getting-cited-by-llms-(not-just-ranked-by-google))
- [ConvertMate — GEO Benchmark Study 2026](https://www.convertmate.io/research/geo-benchmark-2026)
- [Wellows — Google AI Overviews Ranking Factors 2026](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [Wellows — Social Media in AI Citations 2026](https://wellows.com/blog/social-media-ai-citations-report-2026/)
- [Spelwise — How to Optimize for Google AI Overviews 2026](https://spelwise.com/how-to-optimize-for-googles-ai-overviews/)
- [ALM Corp — Google AI Overviews Surge 58% Across 9 Industries](https://almcorp.com/blog/google-ai-overviews-surge-9-industries/)
- [Conductor — Understanding Query Fan-Out](https://www.conductor.com/academy/query-fan-out/)
- [iPullRank — Expanding Queries with Fan-Out](https://ipullrank.com/expanding-queries-with-fanout)
- [ALM Corp — Anthropic Claude Bots robots.txt Strategy](https://almcorp.com/blog/anthropic-claude-bots-robots-txt-strategy/)
- [Cloudflare — From Googlebot to GPTBot 2025](https://blog.cloudflare.com/from-googlebot-to-gptbot-whos-crawling-your-site-in-2025/)
- [Momentic — Top AI Search Crawlers + User Agents Winter 2025](https://momenticmarketing.com/blog/ai-search-crawlers-bots)
- [Yext — How ChatGPT, Perplexity, Gemini, Claude Decide What to Cite](https://www.yext.com/blog/how-chatgpt-perplexity-gemini-claude-decide-what-to-cite)
- [xseek — How to Get Your Brand Cited by ChatGPT, Claude, and Perplexity](https://www.xseek.io/learnings/how-to-get-your-brand-cited-by-chatgpt-claude-and-perplexity)
- [Trysight — Improve LLM Brand Mentions Complete Guide 2026](https://www.trysight.ai/blog/improve-llm-brand-mentions)
- [Genesys Growth — ChatGPT vs Perplexity vs Claude 2026](https://genesysgrowth.com/blog/chatgpt-vs-perplexity-vs-claude)
- [llmstxt.org](https://llmstxt.org/)
- [Search Engine Land — Meet llms.txt proposed standard](https://searchengineland.com/llms-txt-proposed-standard-453676)
- [LinkBuildingHQ — Should Websites Implement llms.txt in 2026](https://www.linkbuildinghq.com/blog/should-websites-implement-llms-txt-in-2026/)
- [Webflow — Understanding llms.txt limitations and alternatives](https://webflow.com/blog/llms-txt)
- [Adweek — YouTube overtakes Reddit as go-to citation source](https://www.adweek.com/media/youtube-reddit-ai-search-engine-citations/)
- [GEORaiser — YouTube overtakes Reddit as #1 AI citation source 2026](https://georaiser.com/blog/youtube-overtakes-reddit-ai-citations)
- [Apify — YouTube Transcripts for LLM and RAG Pipelines 2026](https://use-apify.com/blog/youtube-transcripts-llm-rag-pipelines-2026)
- [Scrunch — The Reddit Paradox: most-cited AI sources](https://scrunch.com/blog/reddit-paradox-industry-breakdown-of-most-cited-ai-sources/)
- [Perrill — Why Reddit is Frequently Cited by LLMs](https://www.perrill.com/why-is-reddit-cited-in-llms/)
- [Discovered Labs — Entity Recognition & Knowledge Graphs](https://discoveredlabs.com/blog/entity-recognition-knowledge-graphs-how-to-structure-your-brand-for-ai-understanding)
- [SALT.agency — Entity SEO: The visibility layer most brands are missing](https://salt.agency/blog/entity-seo-visibility-ai-search/)
- [ClickRank — Get Your Brand into Google & OpenAI Knowledge Graph 2026](https://www.clickrank.ai/google-openai-knowledge-graph/)
- [AIclicks — 11 Best AEO Tools 2026](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Conductor — 2026 AEO/GEO Benchmarks Report](https://www.conductor.com/academy/aeo-geo-benchmarks-report/)
- [Panstag — Answer-First Content Structure for Google AI Overviews](https://www.panstag.com/2026/04/answer-first-content-structure-ai-overviews.html)
- [Search Engine Land — How to write for AI search: A playbook for machine-readable content](https://searchengineland.com/ai-search-playbook-machine-readable-content-472412)
- [Passionfruit — FAQ Schema for AI Answers](https://www.getpassionfruit.com/blog/faq-schema-for-ai-answers)
