# Cliffco Branch Locations

Six physical branch offices (Jamaica NY, Wantagh NY, and Orlando FL closed July 2026; rows kept below for historical reference). Each is a **Google Business Profile claim opportunity** and a candidate location landing page.

**Last verified: 2026-05-20 — addresses and NMLS IDs confirmed from NMLS Consumer Access branch lookup. Branch closures recorded 2026-07-15 per Rafe.**

| # | Branch | Street Address | City | State | ZIP | Branch NMLS | LO count | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | **Uniondale, NY (HQ)** | 70 Charles Lindbergh Blvd, Suite 200 | Uniondale | NY | 11553 | (see corporate) | 50+ | Corporate HQ · (516) 408-7300 |
| 2 | **Branchburg, NJ** | 3121 Route 22 East, 3rd Floor, Office 313 | Branchburg | NJ | 08876-3559 | 2671359 | 4 | NJ market anchor |
| ~~3~~ | ~~**Jamaica, NY** (closed 2026-07)~~ | 142-62 Rockaway Boulevard | Jamaica | NY | 11436-1419 | 2565193 | 2 | Queens / NYC presence |
| ~~4~~ | ~~**Wantagh, NY** (closed 2026-07)~~ | 3265 Merrick Road | Wantagh | NY | 11793 | 988006 | 2 | Nassau County — Long Island |
| 5 | **Bay Shore, NY** | 50 Park Avenue, 2nd Floor, Suite 1 | Bay Shore | NY | 11706-7309 | 2733073 | 3 | Suffolk County — Long Island |
| ~~6~~ | ~~**Orlando, FL** (closed 2026-07)~~ | 3801 Avalon Park East Blvd, 2nd Floor, Office 229 | Orlando | FL | 32828 | 2526419 | 7 | Swish Capital DBA · bilingual team |
| 7 | **Ft. Lauderdale, FL** | 300 SE 2nd Street, Suite 600, Office 50 | Fort Lauderdale | FL | 33301-1950 | 2829876 | TBD | Swish Capital DBA · South Florida |
| 8 | **Scottsdale, AZ** | 15955 Dial Boulevard, Suite 5 | Scottsdale | AZ | 85260 | 2476150 | 2 | Phoenix metro |
| 9 | **Excelsior, MN** | 276 Water Street | Excelsior | MN | 55331-1874 | 2763960 | 1 | Twin Cities |

## Corporate NMLS

Cliffco, Inc. corporate NMLS: **#65328**. All branch NMLS IDs above are in addition to the corporate number and must be disclosed appropriately per state requirements.

## Implications for the website rebuild

- **6 GBP claim/optimization passes needed** — each open branch is its own local-pack opportunity. Any existing GBP listings for Jamaica, Wantagh, or Orlando should be closed/marked permanently closed.
- **9 branch landing pages** at `/locations/{state}/{metro}/{branch-slug}/`, e.g.:
  - `/locations/new-york/long-island/uniondale-headquarters/`
  - `/locations/new-jersey/branchburg/`
  - `/locations/new-york/queens/jamaica/`
  - `/locations/new-york/long-island/wantagh/`
  - `/locations/new-york/long-island/bay-shore/`
  - `/locations/florida/orlando/`
  - `/locations/florida/fort-lauderdale/`
  - `/locations/arizona/scottsdale/`
  - `/locations/minnesota/excelsior/`
- Each branch landing page = LocalBusiness JSON-LD (mortgage subtype) + branch NMLS + branch manager bio + LO list + photos + map.

## Branch-specific compliance notes

- **Florida branches (Orlando and Ft. Lauderdale)** must display the **"Swish Capital, Inc." DBA** on all marketing: landing pages, GBP descriptions, business cards, signage.
- **Arizona (Scottsdale)**: AZ license discrepancy noted — most disclosures show AZ #1045708 (corporate); Julian Giaquinto's disclosure shows AZ #0949291. Verify with Rafe before publishing AZ-licensed-state lists.
- **All branches** display corporate NMLS #65328 plus the branch-level NMLS ID where required by state law.

## Languages spoken

- **Branchburg, NJ**: Christian Soto, Daphne Feliciano — bilingual (English/Spanish)
- **Orlando, FL**: Keyla Cruz, Nadia Geyer Castro, Wenceslao Hernandez Romero, Yaisha Romero, Julia Jorge-Delcarmen — strong bilingual cluster
- **Scottsdale, AZ**: Mayra Hernandez — bilingual
- **Uniondale, NY**: Several bilingual LOs (confirm with roster)
