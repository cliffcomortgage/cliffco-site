# Cliffco Loan Officer Roster

Active LOs from `loan-officer-disclosures.csv` (last NMLS audit 2025-07-23). Roster of 80+ active loan officers. Sortable references — for the rebuilt site each LO gets a bio page at `/loan-officers/{firstname-lastname-nmlsid}/` with full Person schema and NMLS Consumer Access verification link.

## Leadership / Multi-state senior LOs

| Name | NMLS # | Title | States | Branch |
|---|---|---|---|---|
| Christopher Clifford | 65234 | President | 29 states (AK, AL, AZ, CA, CT, DC, DE, FL, GA, IL, IN, KS, KY, LA, MD, MI, MN, NC, NJ, NM, NY, OH, PA, SC, TN, TX, VA, VT, WA) | Uniondale, NY (HQ) |
| Adam Turkewitz | 32900 | Senior VP of Sales | 24 states | Uniondale, NY (HQ) |
| Ryan Dennis Riddle | 1730872 | Loan Officer | 27 states | Uniondale, NY (HQ) |
| James Chen | 17991 | Senior Vice President of Sales | CT, FL, GA, MD, NC, NJ, NY, OR, PA, SC, VA, AZ, TX | Uniondale, NY (HQ) |
| David Fallarino | 673167 | Senior Vice President | AZ, CA, CT, FL, MD, NC, NJ, NY, PA, SC, TX, VA, WA | Uniondale, NY (HQ) |
| David Mizrahi | 40925 | Vice President of Sales | CT, FL, NJ, NY, PA | Uniondale, NY (HQ) |
| Steve Wei | 1231095 | Vice President of Sales | AZ, CA, TX, WA | Uniondale, NY (HQ) |
| Adam Broder | 167538 | Vice President | CT, DE, FL, MD, NJ, NY, PA, TX, VA | Uniondale, NY (HQ) |
| Gary Johansen | 339278 | Regional Sales Manager | NY, NJ | Newark, NJ |
| Joseph Cordeira | 1492298 | Sales Manager | CT, FL, NJ, NY, PA, TX | Uniondale, NY (HQ) |
| George Diamantakis | 1367963 | Sales Manager | CT, FL, KY, NJ, NY, PA, SC, VA | Uniondale, NY (HQ) |
| Dick Lee | 13202 | VP of Business Development | MA | Uniondale, NY (HQ) |

## Branch Managers

| Name | NMLS # | Title | States | Branch |
|---|---|---|---|---|
| Angelique Street | 1146282 | Branch Manager / Loan Officer | NY | Jamaica, NY |
| Daphne Feliciano | 1227421 | Producing Branch Manager | FL, NJ, MD, PA | Newark, NJ |
| Edward (Eddie) Morais | 243926 | Branch Manager | FL, NC, NJ, NY, PA | Newark, NJ |
| Francisco Veras | 170512 | Branch Manager | NY, FL | Orlando, FL |
| Julian Giaquinto | 56473 | Branch Manager | AZ, CA, CT, FL, NC, NY, PA, SC, TX, VA | Wantagh, NY |

## By branch

### Uniondale, NY (HQ) — corporate

Adam Broder, Adam Turkewitz, Anastasios Zervas, Brandon Kenney, Brendan McClarnon, Christian H. Nguyen, Christopher Clifford, Daniel Ebbecke, David Fallarino, David Illouz, David Mizrahi, Dick Lee, Donna Hemberger, Emily Nicole Cordeira, Emmanuel Estinvil, Eric Mueller, Fabrizio Alosa, Frances Ortiz, Gary Lai, George Diamantakis, James Chen, James P. Perrone, Jeannette Zucker, Johana Amaya, Joseph Cordeira, Joshua Miguel Borrero, Justin Hu, Katherine Chiang, Kathie Adler, Kendra Daniel, Kevan Scott, Khadijah Muwwakkil, Lee Horen, Leah Silvestri, Lisa A. Hartman, Logan Reese Levy, Mario Argenzio, Michael Aziz, Michael Bisbee, Michael Chang, Moses Youssef, Paul J. Montesano, Queeny Duong, Rafael Rojas, Raymond Garcia, Renald Appo, Richard Alvarez, Ryan Dennis Riddle, Steve Wei, Steven Rivera, Tamara Williamson, Thomas Whalen

### Newark, NJ

Christian Soto · Daphne Feliciano (Branch Mgr) · Edward (Eddie) Morais (Branch Mgr) · Gary Johansen

### Jamaica, NY

Angelique Street (Branch Mgr) · Shahraj Kabir Khan

### Wantagh, NY

Julian Giaquinto (Branch Mgr) · Syed Hasib

### Bay Shore, NY

Larisa Ann Zambelli · Lauren Zambelli · Lisa Zambelli-Martorana

### Orlando, FL — operates as Swish Capital, Inc.

Francisco Veras (Branch Mgr) · Julia Jorge-Delcarmen · Keyla Cruz · Nadia Geyer Castro · Samantha Roach · Wenceslao Hernandez Romero · Yaisha Romero

### Scottsdale, AZ

Mayra Hernandez (Senior LO) · Derek Liu

### Excelsior, MN

Mitchell Patterson

### No branch listed in CSV (operating remote / TBD)

Andrea Carver (NJ) · Joshua Brenner (CA, NJ, NY) · Steve Lazo (NY)

## By licensed state — counts of LOs

(Useful for prioritizing per-state LO bio publishing order and for state landing-page LO sections.)

| State | # of LOs licensed |
|---|---|
| NY | 60+ (the dominant state) |
| FL | ~30 |
| NJ | ~25 |
| CT | ~15 |
| PA | ~15 |
| TX | ~12 |
| CA | ~10 |
| AZ | ~9 |
| MD | ~7 |
| NC | ~6 |
| GA | ~5 |
| MN | 3 (Christopher Clifford, Logan Reese Levy, Mario Argenzio, Mitchell Patterson) — confirms MN is fully active |
| All others | 1-4 each |

(Approximate counts; reconcile via a script over the CSV before launch.)

## What to build for each LO bio page (per the YMYL doc §3)

For each LO listed above:
1. Real professional photo
2. NMLS Consumer Access verification link: `https://nmlsconsumeraccess.org/EntityDetails.aspx/INDIVIDUAL/{NMLS#}`
3. State licenses listed individually
4. Years in industry / years at Cliffco (LO to provide)
5. Specialties (LO to provide; align to Cliffco's 4 priority products)
6. Languages spoken (LO to provide)
7. LinkedIn URL (LO to provide)
8. Direct email + direct phone + Calendly link
9. Personal narrative (200-400 words, LO's voice)
10. 2025 closed-volume stats (if shareable)
11. 3-5 anonymized closing scenarios with rate / loan amount / scenario type
12. 5-10 testimonials in "Marcus T., Babylon NY" format
13. JSON-LD `Person` schema with sameAs to NMLS + LinkedIn

## Phased LO bio publish order (recommendation)

1. **Wave 1 (week 1):** Christopher Clifford (President) + Adam Turkewitz + James Chen + David Fallarino + David Mizrahi — establishes leadership E-E-A-T anchors.
2. **Wave 2 (week 2-3):** All 5 Branch Managers — locks in local-pack credibility for each branch.
3. **Wave 3 (week 4-6):** Top 10-15 LOs by 2025 volume (LO to identify).
4. **Wave 4 (week 7-12):** Remaining active LOs in alphabetical order, prioritized by state-coverage relevance to Cliffco's growth-territory map.
5. **Spanish-language bios** (parallel track for bilingual LOs in Orlando, Newark, Scottsdale, Uniondale).
