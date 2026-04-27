# Cliffco Compliance Reference

Single source of truth for state licensing, DBAs, branch addresses, and loan officer rosters used to populate the marketing site, GBP profiles, schema markup, and any compliance-required disclosures.

**Last verified against:** `loan-officer-disclosures.csv` — Last NMLS audit 2025-07-23.

## Files in this folder

- **`loan-officer-disclosures.csv`** — raw export of the full LO compliance roster (all active LOs, states licensed, full disclosure language, branch). This is the canonical source.
- **`state-licenses.md`** — normalized table of every state license held by Cliffco corporate (NMLS #65328), with the state regulator name and license number.
- **`branches.md`** — list of physical branch offices (8 locations as of last audit) — the GBP claim list.
- **`loan-officers.md`** — clean roster of LOs with NMLS IDs, titles, states, branches.
- **`disclosures.md`** — canonical disclosure language by scope (corporate, FL-only, multi-state).
- **`README.md`** (this file).

## Critical facts

- **Corporate entity:** Cliffco, Inc. — NMLS #65328
- **Florida DBA:** "Swish Capital, Inc." — every FL marketing piece must include the DBA disclosure
- **Headquarters:** 70 Charles Lindbergh Blvd, Suite 200, Uniondale, NY 11553 · (516) 408-7300
- **President:** Christopher Clifford — NMLS #65234
- **Total branches:** 8 (NY HQ + Newark NJ + Jamaica NY + Wantagh NY + Bay Shore NY + Orlando FL + Scottsdale AZ + Excelsior MN)
- **Active LOs in roster:** 80+
- **Last NMLS audit:** 2025-07-23

## Maintenance

- Re-export `loan-officer-disclosures.csv` from the SharePoint master after every NMLS audit (target: quarterly).
- After re-export, regenerate `state-licenses.md`, `loan-officers.md`, `branches.md` and review for changes.
- Any state-license addition or removal changes the disclosure language, footer state list, GBP service areas, hreflang/locale exposure, AND any product-page schema. Treat licensing changes as a coordinated content release, not a one-line update.
