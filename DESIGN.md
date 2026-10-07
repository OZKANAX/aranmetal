---
name: Aran Metal
description: Copper and aluminium, certified by the lot. A serif trading-house review set on cream and espresso, with one copper per view and gold for emphasis.
colors:
  copper: "#b4532a"
  copper-deep: "#8f3e1d"
  copper-line: "#c9783f"
  copper-light: "#e09a6a"
  copper-tint: "#f3e3d6"
  gold: "#d2ae5a"
  gold-deep: "#8a6a1f"
  graphite: "#17110e"
  graphite-2: "#201713"
  graphite-3: "#2b201b"
  graphite-rule: "#3a2d26"
  steel: "#a89a8e"
  alu: "#d8ccbf"
  bone: "#f3ece2"
  on-navy: "#f1ebe3"
  on-navy-2: "#b5a99d"
  paper: "#f8f4ee"
  paper-2: "#efe8dd"
  paper-3: "#e4dacb"
  ink: "#1d1612"
  ink-2: "#4d433c"
  ink-3: "#6b5f56"
  rule: "#ddd3c5"
  rule-strong: "#b9ac9b"
  success: "#2f7a55"
  error: "#b3261e"
  error-on-dark: "#f08b7e"
typography:
  display:
    fontFamily: "EB Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.75rem, 1.2rem + 5.6vw, 6.25rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.012em"
    fontFeature: "'lnum' 1"
  title:
    fontFamily: "EB Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(2.125rem, 1.35rem + 2.9vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.012em"
    fontFeature: "'lnum' 1"
  heading:
    fontFamily: "EB Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "clamp(1.75rem, 1.3rem + 1.6vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.012em"
    fontFeature: "'lnum' 1"
  subheading:
    fontFamily: "EB Garamond, Iowan Old Style, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.012em"
  lead:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    fontVariation: "'wdth' 100"
  small:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  button-label:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.55
    letterSpacing: "0.12em"
  caption:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.45
  data:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 92"
rounded:
  none: "0px"
spacing:
  gutter-sm: "16px"
  gutter-md: "32px"
  gutter-lg: "48px"
  section: "80px"
  section-lg: "128px"
  container: "1440px"
  nav: "72px"
  nav-xl: "80px"
  ticker: "44px"
components:
  button-copper:
    backgroundColor: "{colors.copper}"
    textColor: "#ffffff"
    typography: "{typography.button-label}"
    rounded: "{rounded.none}"
    padding: "0 32px"
    height: "56px"
  button-copper-hover:
    backgroundColor: "{colors.copper-deep}"
    textColor: "#ffffff"
  button-copper-compact:
    backgroundColor: "{colors.copper}"
    textColor: "#ffffff"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-on-dark:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-outline-on-dark:
    backgroundColor: "transparent"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "0 24px"
    height: "48px"
  button-outline-on-dark-hover:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
  lot-tag:
    backgroundColor: "{colors.graphite}"
    textColor: "#ffffff"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  field-light:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  field-dark:
    backgroundColor: "transparent"
    textColor: "{colors.on-navy}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "4px 0 12px"
  rq-option:
    backgroundColor: "{colors.graphite-2}"
    textColor: "{colors.on-navy-2}"
    rounded: "{rounded.none}"
    padding: "16px"
  rq-option-selected:
    backgroundColor: "{colors.graphite-3}"
    textColor: "#ffffff"
  segmented-light-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.small}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "40px"
  nav-link:
    textColor: "{colors.on-navy-2}"
    typography: "{typography.small}"
  nav-link-active:
    textColor: "#ffffff"
  market-ticker:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-navy-2}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    height: "{spacing.ticker}"
  market-ticker-label:
    textColor: "{colors.gold}"
    typography: "{typography.data}"
---

# Design System: Aran Metal

## Overview

**Creative North Star: "The Trading House Review"**

The site reads like the annual review of an old metal trading house: a classical serif headline set large on cream paper or on warm espresso, the material photographed close beneath a burgundy-espresso veil, and the lot documentation (codes, purities, standards) printed beside it in a narrow mono. Espresso chapters carry material (the hero, the lot rail, the supply route, the procurement request, the footer); cream chapters carry specification (the LME pricing mechanism, the specification ledger, the company story). A fixed market strip along the bottom edge keeps the trading floor in view on every page, labelled as a delayed reference rather than a price.

The system is square, flat and composed. Depth comes from the photograph and from tonal steps of espresso, not from shadows or cards. EB Garamond at a single book weight (500) is the heading voice everywhere; Archivo at normal width carries reading text, buttons and navigation; Martian Mono is reserved for lot data. Copper, the colour of the logo and the product, appears once per view as the call to act or as the LME curve. Gold is the editorial emphasis: the last line of the hero headline, the market strip's label, the scroll cue and Türkiye on the supply map. Motion is cinematic but bounded: one opening sequence on the hero, scroll-bound handoffs between chapters, and a complete reduced-motion path.

This world is modelled on the look of an international trading-group site (inspiration, not a copy). It replaces the earlier "Stamped Lot" world of graphite, bone and expanded Archivo display. It refuses the left-text/right-stock-photo hero, card grids, glowing "foundry" gradients, SaaS and crypto styling, neon and glass effects, and any cool grey or blue.

**Key Characteristics:**
- Warm espresso material chapters alternating with cream specification chapters.
- EB Garamond 500 for every headline; Archivo for reading and UI; Martian Mono only for lot data.
- One copper per view (button or LME curve); gold only for emphasis words, the ticker label, the scroll cue and Türkiye on the map.
- Centered hero: large serif headline with its last line in gold, uppercase tracked copper button beside a quiet text link.
- A fixed 44px market strip at the bottom: gold label, delayed reference quotes, live Istanbul clock.
- The lot tag (mono code / element and purity / grade, 1px seams, espresso at 80%) stamped onto photographs.
- Square corners everywhere (0px), 1px hairline seams, tabular lining figures.
- No offer prices; the strip is labelled reference, delayed, not LME; the LME line is illustrative.

## Colors

A warm, low-chroma palette: espresso and cream at the extremes, warm taupes between them, copper-orange as the action hue and an old gold as the editorial accent.

### Primary
- **Copper Orange** (copper): the filled call-to-action button (Request a Quote, Request this lot, Send request) and the LME market line when copper is selected; text selection ground.
- **Pressed Copper** (copper-deep): the hover and focus fill that sweeps left to right across the copper button; hover on text links.
- **Copper Wire** (copper-line): hairline uses only. Focus outline, the nav underline on hover and current page, route arcs on the supply map, the chain fill and reached chain nodes, the focus line under procurement fields.
- **Annealed Copper** (copper-light): copper text on espresso (the selected material code in the request form, the success stamp, current page in the mobile menu). Never a fill.
- **Copper Tint** (copper-tint): reserved pale wash; defined but not used on the home page.

### Secondary
- **Ledger Gold** (gold): emphasis only. The last line of the hero headline, the market strip label and its square mark, the scroll cue line, the Türkiye outline on the supply map. Never a fill behind text, never a button.
- **Deep Gold** (gold-deep): defined for gold emphasis on cream grounds, where light gold would fail contrast; not yet used on the home page.

### Neutral
- **Espresso** (graphite): the ground of the body, hero, lot rail, supply route, header, footer and market strip (at 95%). Also the 80% ground of the lot tag.
- **Espresso Plate** (graphite-2): the procurement request chapter, dropdown panels, unselected form options.
- **Espresso Lift** (graphite-3): photograph placeholder, selected form option, dropdown hover row.
- **Espresso Seam** (graphite-rule): all 1px rules, borders and dividers on dark, including the market strip's top rule and its internal seams.
- **Warm Taupe** (steel): mono labels, the strip's delayed-reference note, clock date and zone, inactive tabs on dark.
- **Oat** (alu): grade values in the lot tag, region labels on the map, the selected quantity unit chip.
- **Bone** (bone): the active-tab rule on the lot rail and the on-dark solid button.
- **On-espresso Text** (on-navy) and **On-espresso Secondary** (on-navy-2): body and secondary text on dark chapters; the hero lead at 85%.
- **Cream** (paper), **Cream 2** (paper-2), **Cream 3** (paper-3): the specification chapters and their tonal steps (paper-3 is the photo placeholder on light).
- **Ink** (ink), **Ink 2** (ink-2), **Ink 3** (ink-3): warm-brown headline, body and tertiary text on cream. Ink also draws the heavy 1px and 2px rules that open ledgers and price terms.
- **Rule** (rule) and **Rule Strong** (rule-strong): hairlines and input borders on cream.
- **Success** (success), **Error** (error), **Error on Dark** (error-on-dark): status only.

The supply map is drawn in the same family as fixed artwork: ground #1c1511, land #2e231d with #1c1511 borders, Türkiye #45342a stroked in gold.

### Named Rules
**The One Copper Rule.** Each view carries one copper statement: the copper button, or the LME curve. Gold is not a second statement; it marks emphasis words (the gold last line of the hero), the market strip label, the scroll cue and Türkiye on the map, and nothing else. Copper-line hairlines that answer state (hover underline, focus ring, field focus line) are transient feedback.

**The Kept Names Rule.** The legacy token names (paper, ink, navy, on-navy, navy-rule, graphite, steel, alu, copper) are kept and re-valued so inner pages inherit the world without rewrites. "navy" and "graphite" now both mean warm espresso (navy = graphite = #17110e family). Do not reintroduce a blue or a cool grey.

**The No Price Rule.** No offer price, live or sample, appears in content. The market strip carries third-party broker CFD and FX quotes, always labelled as a delayed reference that is not LME. The LME line is a seeded illustrative walk and its caption says so.

## Typography

**Display Font:** EB Garamond, variable, weight 500 (with Iowan Old Style, Georgia)
**Body Font:** Archivo at wdth 100 (with Helvetica Neue, Arial)
**Label/Mono Font:** Martian Mono at wdth 92, tabular figures (with ui-monospace, SFMono-Regular, Menlo)

**Character:** An old-style book serif with real contrast, the voice of a printed trading-house review, paired with a plain grotesque for reading and controls and a narrow instrument mono for the data on a strapping tag.

### Hierarchy
- **Display** (500, clamp 2.75rem to 6.25rem, 1.02): the centered hero headline, max 16ch, rising line by line out of masks; its last line is gold. The footer closing statement uses the same voice at clamp 2.5rem to 5.5rem.
- **Title** (500, clamp 2.125rem to 4rem, 1.02): chapter headlines (lot rail, LME, supply route, ledger, story, request).
- **Heading** (500, clamp 1.75rem to 2.75rem, 1.08): product names in the lot frame, the pinned rail headline, the request success message.
- **Subheading** (500, 1.375rem, 1.25): price-term and chain-step terms.
- **Lead** (400, 1.1875rem, 1.6): hero lead from sm up, first paragraph of the story.
- **Body** (400, 1rem, 1.65): reading text, capped at 52-60ch.
- **Button label** (600, 0.9375rem, +0.12em, uppercase): the copper call to act.
- **Small** (400, 0.9375rem, 1.55) and **Caption** (400, 0.8125rem, 1.45): spec rows, nav, hints, legal.
- **Data** (400, 0.75rem, 1.5, +0.01em, tabular): Martian Mono for lot data; the market strip uses it at 0.625rem (label), 0.5625rem (note) and 0.6875rem (clock).

Purity and ledger figures are oversized serif numerals with lining, tabular figures, the % or unit set at 0.4em, top-aligned, in steel or ink-3. On Turkish pages the % precedes the number. Headings use `text-wrap: balance` and no synthesized weights.

### Named Rules
**The Lot Data Rule.** Martian Mono is only for lot data and instrument readouts: product codes, element and purity lines, standards (ASTM B115, EN 1978, LME Grade A, P1020), coordinates, contract names, chart captions, field labels, the market strip label and clock. It never decorates, never sets a headline, never sets a sentence of prose.

**The No Eyebrow Rule.** No eyebrows or kickers above headings. A chapter opens with its headline. The product code lives in the purity data line under the figure (`Cu · minimum · CU-CAT-A`) and in the lot tag, not above the name.

**The Tabular Rule.** Every figure (purity, quantity, phone, ledger numbers, rail counter, the Istanbul clock) is set with tabular lining numerals.

## Layout

One 12-column grid inside a 1440px container with 16px / 32px / 48px side gutters (mobile / sm / lg) and an 8 / 32px column gap. Chapters stack at 80px vertical padding, 128px from lg. Headline and intro split the grid asymmetrically: headline across columns 1-6 or 1-7, intro in columns 8-12 or 9-12. The fixed header is the nav bar only (72px, 80px from 1280px); anchored sections scroll to nav height plus 1.5rem. The body reserves 44px of bottom padding for the fixed market strip.

The hero is a full-bleed 100svh espresso plate (min 620px, max 1100px) pulled up under the header. Its copy is centered on both axes, padded by the nav height on top and the strip height plus 3rem below, and the scroll cue sits centered just above the strip (hidden under 640px). The lot rail pins on desktop (min-width 1024px, motion allowed): N x 100vh tall, a sticky inner frame, each lot a full-viewport frame (photograph across 7 columns, lot data across 5). On mobile and under reduced motion it becomes a user-scrolled horizontal list with mandatory snap. On short desktop screens (max-height 820px) optional lot rows withdraw.

The story photograph bleeds off the left edge of the container; the ledger title is sticky beside an 8-column ledger. The supply map takes 9 columns with the region list in 3. Content is dense and documentary, never carded.

## Elevation & Depth

Flat. Depth is conveyed by the photograph and by tonal steps of espresso (graphite, graphite-2, graphite-3) separated by 1px graphite-rule seams. Legibility over the hero photograph comes from a warm burgundy multiply wash (#3a160c at 45%), a radial espresso veil (rgba(23,17,14) at 0.55 centre, 0.25 mid, 0.7 edge) and a bottom-third fade into espresso; lot frames keep their bottom veil. The market strip is espresso at 95% with a 1px top seam, not a shadowed bar. The only shadow is the desktop navigation dropdown.

### Shadow Vocabulary
- **Dropdown drop** (`box-shadow: 0 24px 48px -16px rgba(0,0,0,0.6)`): the desktop nav dropdown panel only.

### Named Rules
**The Flat Seam Rule.** Surfaces separate by tone and 1px seams, never by shadow or card. Light reflections (the warm hero light band, the lot cursor light) are overlay-blended highlights on the metal, not elevation.

## Shapes

Every corner is square (0px): buttons, inputs, chips, tags, map markers, chain nodes, the hub mark, the market strip and its 6px gold label mark. Rules are 1px; a 2px ink rule opens a ledger and marks the result term of the price equation. Seams are expressed as dividing lines inside tags, segmented controls and the market strip (label | quotes | clock). Markers on maps and chains are small squares, never dots. The scroll cue is a 1px by 32px line fading from gold to transparent.

## Components

### Buttons
Square and direct, with a printed, tracked label.
- **Shape:** square (0px).
- **Primary (copper):** copper fill, white semibold uppercase label tracked +0.12em, trailing arrow. Hero: 56px tall, 32px side padding. Other sizes in use: 48px with 20px (lot frame), 64px (form submit, label and arrow justified apart), 40px with 16px (header).
- **Hover / Focus:** a copper-deep fill sweeps in from the left (scaleX 0 to 1, 420ms ease-out-quint); the arrow nudges 4px forward (200ms ease-out-quart); active presses down 1px. Focus shows the 2px copper-line outline at 3px offset.
- **Quiet link:** white or ink semibold text, sentence case, with a 1px copper-line underline that grows from the left on hover and retreats to the right on leave; used for every secondary action beside a copper button.
- **Secondary (light):** 1px ink/30 border, ink text; fills ink with cream text on hover.
- **On dark:** bone fill with ink text (hover white), or outline-on-dark (white/30 border, fills white on hover).

### Hero (signature)
Centered composition on the espresso plate: photograph (or optional muted looping background video, with the image as poster and reduced-motion fallback) under the burgundy and espresso veils; serif Display headline in white with its final line in gold; Archivo lead in on-espresso at 85%; the copper button and quiet link on one centered row; a small mono scroll cue with a gold line at the foot.

### Market Strip (signature)
A fixed 44px bar on the bottom edge of every page, above content (z-40), espresso at 95% with a 1px seam on top.
- **Left (md and up):** a 6px gold square and the label "Aran Markets / Aran Piyasalar" in gold Martian Mono, with the note "Reference · delayed · not LME / Referans · gecikmeli · LME değil" beneath in taupe. Separated by a 1px seam.
- **Centre:** a TradingView ticker tape, compact, transparent, dark theme, no logos: copper, aluminium and nickel broker CFD quotes plus USD/TRY, EUR/TRY, EUR/USD. Loaded when the browser is idle.
- **Right (sm and up):** live Istanbul clock in Martian Mono, date and "IST" in taupe, time in white tabular figures, updated every second.

### Lot Tag (signature)
The recurring identity mark stamped onto product and story photographs at bottom-left (products) or bottom-right (story), 16px / 24px inset.
- **Structure:** a mono code row, then a row of element and purity and grade separated by vertical 1px seams; the story variant stacks place, coordinates and years.
- **Style:** 1px white/45 outer border, white/25 inner seams, espresso at 80% ground, Martian Mono data size, white text, grade in oat, tabular figures.

### Lot Frame
One material per frame: photograph plate (graphite-3 placeholder) with the lot tag; name in serif Heading; oversized serif purity figure with the data line beneath; spec rows (Material, Form, Unit, Stock) as 8.5rem/1fr grids on graphite-rule hairlines; copper request button and quiet details link. On hover a cursor-tracked warm light rises on the metal, the photograph drifts up to 6px against the cursor, spec values brighten to white.

### Inputs / Fields
- **Dark (procurement):** transparent, bottom border only in graphite-rule, on-espresso text, taupe placeholder; hover border taupe; a copper-line line draws in from the left on focus (420ms). Labels are Martian Mono data in taupe. The quantity input is a large serif tabular numeral.
- **Light (inner pages):** cream ground, 1px rule-strong border, 12px / 14px padding; hover border ink-3; focus border copper with a 3px copper/15 ring.
- **Error:** aria-invalid border in error (light) or error-on-dark (dark), message in caption below.

### Chips / Options
- **Material option cards:** a seamed grid of square cells on graphite-2 (hover and selected graphite-3), mono code top-left, square check top-right, material name below; the selected state draws a copper-line base line.
- **Segmented control:** adjacent square buttons; on light the active one fills ink with cream text, on dark the active unit chip fills oat with ink text.

### Navigation
- **Header:** fixed nav bar only; transparent over the home hero with a faint black/45 top veil, switching to espresso/95 with a graphite-rule base after 24px of scroll, at which point it lifts 10px and the logo scales to 0.88. Links are Small, on-espresso secondary, white on hover and current, with the copper-line underline. Dropdowns are graphite-2 panels with a 1px seam.
- **Language switcher:** Martian Mono uppercase locale codes separated by a 1px seam; current in white.
- **Mobile:** two 1px lines that cross on open; a full-height espresso panel clips down from the top, links in 1.5rem serif, current page in annealed copper, copper quote button, contact and language at the foot.

### Charts and Maps
- **LME line:** a 2px non-scaling stroke on three rule hairlines, copper for copper and ink-2 for aluminium; it opens left to right by clip reveal (2.4s) and then ticks one step left every 2.4s while visible. Caption and contract name in Martian Mono. The price build-up below is an equation of serif terms separated by light operators (+, =).
- **Supply route:** warm land silhouette on an espresso ground with Türkiye outlined in gold; copper-line quadratic arcs from the Istanbul hub draw by dash offset, staggered; small light-copper squares travel each arc; hovering a region dims the others to 28%. The chain beneath fills a copper-line rail as it scrolls, stamping each square node copper when reached.

### Motion
One opening sequence on the hero only: espresso surface, a warm light band sweeps the plate, the photograph resolves from dark (1.8s from 0.15s), headline lines rise from masks (1.05s, from 0.7s, +0.12s per line), the lead wipes in (from 1.15s), actions settle (from 1.4s), and the scroll cue stamps in last (2.2s). The plate then drifts slowly (26s alternate) and pauses, with the video, when off-screen. On scroll the hero plate insets into a frame and the copy lifts away as the lot rail rises. The pinned rail translates one frame per viewport of scroll and snaps to the nearest frame 180ms after scrolling stops.

Easing tokens: ease-out-expo, ease-out-quart, ease-out-quint (the default), ease-in-out-sine (drift and sweep). Durations: 200ms fast, 420ms normal, 900ms cinematic.

**The Rest State Rule.** All content is visible by default; motion is decoration on top. Under prefers-reduced-motion every keyframe is removed, the hero sweep is hidden, the video is replaced by the image, the plate and copy do not inset, the rail becomes a free horizontal list, the LME line and route arcs are drawn at rest, the chain is full, and transitions collapse to 1ms.

## Do's and Don'ts

### Do:
- **Do** alternate espresso material chapters with cream specification chapters.
- **Do** set every headline in EB Garamond at 500; leave weight and tracking to the display voice.
- **Do** keep one copper statement per view: the copper button or the LME curve.
- **Do** keep gold to emphasis words, the market strip label, the scroll cue and Türkiye on the map.
- **Do** label the market strip as a delayed reference that is not LME, in both languages.
- **Do** stamp the lot tag (mono code / element and purity / grade, 1px seams, espresso at 80%) onto product and story photographs.
- **Do** set every code, purity, standard, coordinate, field label and instrument readout in Martian Mono, and nothing else.
- **Do** keep all corners square (0px) and separate surfaces with 1px seams.
- **Do** use tabular lining figures for every number.
- **Do** reserve 44px at the bottom of every page for the market strip.
- **Do** use the kept token names (paper, ink, navy, graphite, on-navy, copper) on inner pages so they inherit this world.
- **Do** ship a reduced-motion path where everything is visible at rest.

### Don't:
- **Don't** publish an offer price, live or sample, or present the strip's quotes as LME prices.
- **Don't** put eyebrows or kickers above headings; the product code belongs in the purity data line and the lot tag.
- **Don't** use Martian Mono for decoration, headlines or prose.
- **Don't** use gold as a fill, a button or a second call to act; don't add a second copper statement to a view.
- **Don't** return to expanded heavy Archivo for headlines; the heading voice is the serif.
- **Don't** use rounded corners, cards with shadows, glass, glow, neon or gradient text.
- **Don't** reintroduce navy, blue or cool grey; the navy and graphite token names now hold warm espresso.
- **Don't** build a left-text/right-stock-photo hero or a card grid of products.
- **Don't** invent certificates, client references or volume figures to fill a ledger.
