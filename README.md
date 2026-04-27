# Cliffco Site & Brand Repository

Single source of truth for Cliffco Mortgage Bankers brand assets and the codebase
for the eventual rebuild of [cliffcomortgage.com](https://cliffcomortgage.com/).

## Repository structure

```
.
├── brand/
│   ├── mission-vision-values.md   ← canonical, plain-text version
│   ├── mission-vision-values.docx ← original Word doc
│   ├── brand-guide.pdf            ← full brand guide (typography, color, usage)
│   ├── fonts/                     ← Graphik (Regular, Medium) — trial OTFs
│   └── logos/
│       ├── full/                  ← horizontal lockup, PNG (black + white)
│       ├── icon/                  ← icon-only, PNG (black + white)
│       ├── favicon/               ← SVG + PNG
│       └── source-ai/             ← Adobe Illustrator source files
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

Primary typeface is **Graphik** (Regular + Medium). The OTFs in `brand/fonts/`
are the trial cuts that ship with the brand guide; production licensing for
web/app use will need to come from
[Commercial Type](https://commercialtype.com/catalog/graphik) before the site
goes live.

## Current website

The current production site is at <https://cliffcomortgage.com/> and is
slated for a full rebuild. New site code will live in `website/`.
