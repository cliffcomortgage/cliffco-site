# Calculator verification

Every calculator on the site, checked two ways: that it cannot print nonsense, and that its
arithmetic matches an implementation written independently of its source.

## Running it

```bash
cd website && npm run build     # the suites drive the built site, not the dev server
cd ../scripts/calculator-tests && node run-all.cjs
```

Needs Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe` and
`puppeteer-core`, which `website/node_modules` already provides. Nothing else to install.

### Do not trust the summary alone

`run-all.cjs` decides PASS by regex-matching each sub-suite's output, so a suite that
exercised **nothing** still prints PASS. Twice now the edge sweep has passed over zero
combinations because a Windows path broke and every URL 404'd. After any run that matters,
confirm the work actually happened:

```bash
node 01-edge-sweep.cjs | tail -3            # expect ~1370 combinations over 61 calculators
node 02-differential-embedded.cjs | tail -3 # expect a non-zero case/field count
```

A count of 0 means the suite is broken, not that the calculators are clean.

## Why this exists

The calculators were audited five times between 2026-11-03 and 2026-11-05, and each pass
found more, because each pass had drawn its own boundary:

| Pass | Scope it assumed | What it missed |
|---|---|---|
| 1 | the 11 under `/calculators/` | 50 copies embedded in blog posts |
| 2 | + 3 blog copies it tripped over | the other 47 |
| 3 | the maths | the prose stating different figures |
| 4 | all 61, edge cases | the maths of the 50 |
| 5 | all 61, maths and edges | — |

The fix was never a better pair of eyes. It was deriving the inventory from the codebase
instead of from memory, and keeping the suites in the repo instead of a scratchpad.

**Before auditing calculators, run this. Do not start a fresh search.**

## What each suite does

| File | Covers | Checks |
|---|---|---|
| `01-edge-sweep.cjs` | all 61 | Pushes blank, zero, negative, tiny and huge values through every input. Flags NaN, Infinity, `$-`, absurd magnitudes, JS errors. |
| `02-differential-embedded.cjs` | the 50 embedded | Reimplements each archetype from its stated inputs and outputs, then compares against the shipped page across a grid. |
| `03-differential-main.cjs` | the 11 main | The same, for the standalone calculators. |
| `04-regression-main.cjs` | the 11 main | Pins the specific defects found in review so they cannot come back. |
| `05-known-values.cjs` | the blog copies that were corrected | Checks against externally known values: HUD's principal limit factor, the VA funding fee tiers. |

## Adding a calculator

`01-edge-sweep.cjs` finds calculators by walking `website/src/pages` for number inputs plus a
compute script, so a new one is picked up with no edit. The differential suites need a model:
add an entry to `MODELS` in `02-differential-embedded.cjs` keyed on the input prefix.

If the sweep reports a page with **no inputs found**, that is a broken test, not a clean one —
it says so loudly because an earlier version silently tested nothing and reported a pass.

## The 21 implementations behind 61 pages

The 50 embedded calculators are copies of 10 archetypes, keyed by input prefix:

| Prefix | Copies | What it is |
|---|---|---|
| `art-se` | 14 | Self-employed income, tax return vs bank statement |
| `art-mr` | 8 | Mortgage readiness |
| `art-pe` | 8 | Payment estimator |
| `art-rc` | 5 | Refinance checkup |
| `art-rm` | 5 | Reverse mortgage |
| `art-va` | 5 | VA payment and funding fee |
| `art-dscr` | 3 | DSCR ratio (two near-identical variants) |
| `art-af` | 1 | Affordability |
| `art-rvb` | 1 | Rent vs buy |

Copies share code, so a figure corrected in one of the 11 main calculators **does not reach
them**. That is how the invented reverse mortgage factor and the pre-2023 VA funding fee
schedule survived on live pages after both had been fixed on the main calculators. When a
product figure changes, grep the `art-` prefix for it.
