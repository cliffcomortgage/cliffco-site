# Power Up Your Prompts — Cliffco internal training deck

A 17-slide training deck that teaches the team how to write photo prompts for
ChatGPT using the 10-block template, with seven real examples and Cliffco-specific
guidance.

## Files

- `deck.html` — the slideshow (16:9, 1280×720 per slide)
- `styles.css` — all Cliffco brand styling (colors, type, layouts)
- `images/` — 7 example photos (01–07)
- The deck references Graphik fonts from `../../brand/fonts/` and Cliffco logos
  from `../../brand/logos/`. Both are gitignored / safe to reference locally.

## View it on screen

```bash
open /Users/rtangorra/cliffco-site/presentations/chatgpt-photo-prompts/deck.html
```

Each slide is a fixed 1280×720 frame. Use Cmd+ / Cmd– in the browser to zoom
the whole stack if your monitor is smaller.

## Export to PDF (headless Chrome)

The cleanest way to get a polished 16:9 PDF:

```bash
cd /Users/rtangorra/cliffco-site/presentations/chatgpt-photo-prompts

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf=power-up-your-prompts.pdf \
  --virtual-time-budget=10000 \
  "file://$PWD/deck.html"
```

That produces `power-up-your-prompts.pdf` in this directory — one 1280×720
page per slide, no headers/footers, fonts and images embedded.

If you'd rather use a regular Chrome window: open `deck.html`, press Cmd+P,
choose **Save as PDF**, set **Margins: None**, set **Paper size: 1280 × 720
custom** (Chrome will offer this size automatically if the `@page` rule fires).

## Fonts — heads up

The deck loads the **trial** Graphik OTFs from `brand/fonts/`. Per the project
CLAUDE.md, those are local-only and gitignored — fine for an internal training
deck, **not** fine for anything that gets published outside Cliffco. Before this
deck is ever distributed externally, swap to the licensed Commercial Type WOFF2
kit.

The trial kit doesn't include Graphik Bold, so headlines use Graphik Medium
(font-weight 500/700 both map to the Medium file). If you want true Bold
headlines, drop `Graphik-Bold-Trial.otf` (or the licensed Bold WOFF2) into
`brand/fonts/` and add a third `@font-face` block in `styles.css`.

## Editing the deck

Each slide is a `<section class="slide ...">` block in `deck.html`. To add,
remove, or reorder slides, edit that file directly — there's no build step.
The slide-number indicators in the corners are written by hand; if you reorder
slides, update them so the numbering stays right.

Slide layouts available (set on the `<section>` element):

| Class | When to use |
|---|---|
| `slide cover` | Title slide. Black with plum gradient bleed. |
| `slide section` | Big section-divider slide. Black with vertical rotated label. |
| `slide content` | Standard text/bullets slide. White background. |
| `slide quote` | Big pull-quote slide. Airy gray background. |
| `slide anatomy` | Image-on-left, annotated prompt-on-right (slide 10). |
| `slide gallery` | Image grid (slide 11). |
| `slide cta` | Closing dark slide with centered headline. |
