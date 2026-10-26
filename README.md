# Cliffco Site & Brand Repository

Single source of truth for Cliffco Mortgage Bankers brand assets and the codebase
for the eventual rebuild of [cliffcomortgage.com](https://cliffcomortgage.com/).

## Repository structure

```
.
├── brand/
│   ├── mission-vision-values.md   ← canonical, plain-text version
│   ├── mission-vision-values.docx ← original Word doc
│   ├── Cliffco_Brand_Guidelines_2026.pdf  ← the brand guide (colour, type, logo, voice)
│   ├── fonts/                     ← Archivo, IBM Plex Mono, Instrument Serif (gitignored)
│   └── logos/                     ← wordmark, plate, three lockups, CMB icon, favicons
│                                     SVG + PNG, each in a Black and a White version.
│                                     _Black = black plate (use on white)
│                                     _White = white plate (use on black)
└── website/                       ← future: code for the rebuilt site
```

## Source of truth

The brand assets in this repo are copies. Originals live in OneDrive:

```
~/Library/CloudStorage/OneDrive-CliffcoMortgageBank/Creative/2. Cliffco New Brand/Assets & Logos/
```

If you update an asset, update both places (or update OneDrive and re-sync into
this repo).

## Brand at a glance

- **Vision:** To be the lender every family wishes they'd called first.
- **Mission:** We get families home. Especially the ones other banks turned away.
  And we grow their net worth and self-worth along the way.
- **Values:** Family · Integrity · Care · Possibility

Full text in [`brand/mission-vision-values.md`](brand/mission-vision-values.md).

## Fonts

Three typefaces, all OFL and all on Google Fonts, so nothing needs licensing:

- **Archivo** — the logo and everything you read: headlines, captions, body, labels, buttons.
- **IBM Plex Mono** — the data voice only: rates, payments, figures, name tags, footers.
- **Instrument Serif** — the display accent, and the brand's only italic.

The `.ttf` files are kept in `brand/fonts/` for design work but that folder is
**gitignored**, so each machine needs its own copy. The website loads all three from
Google Fonts, never from `brand/fonts/`.

Graphik was the pre-2026 primary face and Outfit/Montserrat the 2026-10 pairing. Both are
retired; see `CLAUDE.md` for the full brand rules.

## Current website

The current production site is at <https://cliffcomortgage.com/> and is
slated for a full rebuild. New site code will live in `website/`.
