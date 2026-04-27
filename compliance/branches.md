# Cliffco Branch Locations

Eight physical branch offices identified from `loan-officer-disclosures.csv`. Each is a **Google Business Profile claim opportunity** and a candidate location landing page.

| # | Branch | LO count (in roster) | Notes |
|---|---|---|---|
| 1 | **Uniondale, NY (HQ)** — 70 Charles Lindbergh Blvd, Suite 200, Uniondale, NY 11553 · (516) 408-7300 | 50+ | Corporate HQ; majority of LOs route here |
| 2 | **Newark, NJ** | 4+ (Daphne Feliciano [Branch Mgr], Christian Soto, Edward "Eddie" Morais [Branch Mgr], Gary Johansen) | NJ market anchor |
| 3 | **Jamaica, NY** | 2 (Angelique Street [Branch Mgr], Shahraj Kabir Khan) | Queens / NYC presence |
| 4 | **Wantagh, NY** | 2 (Julian Giaquinto [Branch Mgr], Syed Hasib) | Nassau County — Long Island secondary |
| 5 | **Bay Shore, NY** | 3 (Larisa Ann Zambelli, Lauren Zambelli, Lisa Zambelli-Martorana) | Suffolk County — Long Island |
| 6 | **Orlando, FL** | 7 (Francisco Veras [Branch Mgr], Julia Jorge-Delcarmen, Keyla Cruz, Nadia Geyer Castro, Samantha Roach, Wenceslao Hernandez Romero, Yaisha Romero) | Florida growth-territory anchor; multiple bilingual LOs |
| 7 | **Scottsdale, AZ** | 2 (Mayra Hernandez [bilingual], Derek Liu) | Arizona presence; small but real |
| 8 | **Excelsior, MN** | 1 (Mitchell Patterson) | Minnesota anchor — confirms MN is fully active |

## Implications for the website rebuild

- **8 GBP claim/optimization passes needed**, not 1. Each is its own local-pack opportunity.
- **8 branch landing pages** at `/locations/{state}/{metro}/{branch-slug}/` minimum, e.g.:
  - `/locations/new-york/long-island/uniondale-headquarters/`
  - `/locations/new-jersey/newark/`
  - `/locations/new-york/queens/jamaica/`
  - `/locations/new-york/long-island/nassau-county/wantagh/`
  - `/locations/new-york/long-island/suffolk-county/bay-shore/`
  - `/locations/florida/orlando/branch/`
  - `/locations/arizona/phoenix-metro/scottsdale/`
  - `/locations/minnesota/twin-cities/excelsior/`
- Each branch landing page = LocalBusiness JSON-LD (mortgage subtype) + branch manager bio + LO list working out of that branch + photos + map.

## Address gaps to fill before launch

The CSV only carries the **corporate Uniondale address** in the disclosure language. Specific street addresses for the other 7 branches need to be collected from the company's facilities or HR records. Required per branch:

- Street address with suite/unit
- ZIP
- Direct phone number for that branch
- Photo of exterior + interior
- Branch hours
- Branch manager + email + direct line

Without these, GBPs can't be claimed and branch landing pages can't pass the doorway-page test.

## Branch-specific compliance notes

- **Florida (Orlando) branch** must operate under and display the **"Swish Capital, Inc." DBA**. All Orlando-branch marketing — landing page, GBP description, business cards, signage — must include the FL DBA disclosure.
- **Arizona (Scottsdale) branch** discrepancy noted — see `state-licenses.md` re: Julian Giaquinto's disclosure showing a different AZ license number (0949291 vs. corporate 1045708). Verify which is current.
- **All branches** display the corporate NMLS #65328 + appropriate state-license language.

## Languages spoken (preliminary inference from LO names)

For Spanish-language site planning:
- **Newark, NJ**: Christian Soto, Daphne Feliciano — likely bilingual
- **Orlando, FL**: Keyla Cruz, Nadia Geyer Castro, Wenceslao Hernandez Romero, Yaisha Romero, Julia Jorge-Delcarmen — strong bilingual cluster
- **Scottsdale, AZ**: Mayra Hernandez — bilingual
- **Uniondale, NY**: Frances Ortiz, Emmanuel Estinvil, Johana Amaya, Rafael Rojas, Raymond Garcia, Richard Alvarez, Joshua Borrero, Jeannette Zucker, Steven Rivera, Mario Argenzio — likely several bilingual

This needs LO confirmation but is a strong signal that Cliffco can credibly stand up Spanish-language landing pages and route Spanish-speaking inquiries to bilingual LOs in every priority market.
