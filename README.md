# Handoff: Wedding Planning Suite (planner board + guest site + digital invitation)

## Live prototype
**https://xenaja.github.io/wedding-planner-suite/** — the current design (v2), fully interactive.
The previous palette is at [`/v1.html`](https://xenaja.github.io/wedding-planner-suite/v1.html)
(still on grey photo placeholders; only v2 carries imagery).

The guest site's four photo slots are filled from `assets/` — see [CREDITS.md](CREDITS.md).
All of it is demo content; a real wedding replaces it with the couple's photographer.

The `.dc.html` files are the canonical sources; `index.html` and `v1.html` are copies of them
produced by `build.sh`, because GitHub Pages needs an `index.html` and space-free URLs.
`support.js` is the runtime that renders the `<x-dc>` template — the prototypes are blank
without it, and it pulls React and Babel from unpkg at load time, so the page needs a network
connection and takes a moment on first paint. None of this belongs in the production build;
it is only what makes the reference viewable in a browser.

## Motion and responsiveness

Both live in the one `<style>` block in `<helmet>`, and both are CSS-only on purpose:
the runtime compiles this template to React, so a `<script>` in the document would
never run and an IntersectionObserver would have nowhere to live. Rebuild them with
whatever your framework offers — the point is the behaviour, not the technique.

**Motion.** Restrained: a slow 5.5% zoom-out on the cover, a five-step stagger on the
hero copy (55–110 ms apart), a fade-and-rise reveal on each section as it scrolls in,
a 2% lift on the photo tiles under the cursor, and a 2 px lift on primary buttons.
Reveals ride `animation-timeline: view()` inside an `@supports` guard — where that is
unsupported nothing animates and nothing is hidden, which is the correct fallback.
`prefers-reduced-motion: reduce` collapses all of it, including smooth scrolling.

**Narrow screens.** The layout was already fluid — `auto-fit` grids, `clamp()` type,
wrapping pill rows — so the media queries only fix what actually broke: the three nav
tabs overflowed the viewport below ~400 px (they now shrink and scroll inside their
own pill), the planner board's two fixed columns collapse to one under 860 px, and
vertical rhythm tightens under 640 px. Those overrides need `!important` because the
markup is inline-styled; they are confined to media queries, so desktop is untouched.

## Overview
A white-label wedding product for a **European wedding planner**. It has three parts, all driven by one data model:

1. **Planning board** — the planner's template for each couple. Blocks (Timeline, Payments & invoices, Vendors, Budget, Next steps, Guests, Documents, Guest site status) can be reordered, hidden, and re-added from a block library, per wedding, with no code changes.
2. **Guest site** — the couple's public page: cover, story, programme of the day, travel, accommodation, dress code, working RSVP, gifts, FAQ.
3. **Digital invitation** — an envelope that opens to a card personalised per guest, in three finishes (Sage / Ivory / Nocturne), plus delivery stats.

Two commercial requirements drive the data layer:
- **Money is stored in EUR** and displayed in the couple's currency (EUR / GBP / CHF / PLN) at a stated rate.
- **Invoicing is first-class**: an invoice ledger with statuses (draft → sent → overdue → paid), amounts, due dates, and totals; paid invoices roll into the budget.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype of the intended look and behaviour, not production code to copy verbatim. The task is to **recreate these designs in the target codebase's existing environment** (React, Vue, Next.js, Rails views, native, etc.) using its established routing, component library, state management and styling conventions. If there is no codebase yet, pick the framework best suited to the product (a React/Next app with a small API and a database is the natural fit here) and implement the designs there.

`Wedding Suite v2.dc.html` is a single-file prototype: markup + a logic class in one document. In a real app, split it into routes/components and move the data out of the component into an API.

## Visual direction
The styling is tuned to the commissioning agency's own brand language — warm greige ground, a single saturated brand red, a high-contrast didone display serif with a geometric sans for UI, small uppercase letterspaced button labels, and unusually generous corner radii. It is an **adaptation**, not a reproduction: no logotype, photography, illustration or page layout from their site is reused. If the target codebase already has a brand system, map these tokens onto it rather than adding a parallel palette.

## Fidelity
**High-fidelity.** Colours, typography, spacing, radii, shadows, copy and interaction behaviour are final and should be matched closely. Content (names, amounts, vendors, dates) is demo data and is expected to come from the backend.

---

## Design Tokens

The palette, type and radii are tuned to the client's own brand (warm greige ground, one saturated brand red, high-contrast serif display, generously rounded cards). It is an adaptation, not a copy of their site: no logotype, illustration or layout is reproduced.

### Colour
| Token | Hex | Use |
|---|---|---|
| ground | `#EFE7E0` | page background |
| ground-deep | `#EAE0D8` | RSVP band, tinted sections |
| paper | `#FFFFFF` | cards, inputs on white |
| ink | `#33231F` | primary text |
| ink-soft | `#6B5850` | secondary text, settled statuses |
| ink-mute | `#98857C` | labels, eyebrows, meta, drafts |
| red | `#C9302A` | brand: logotype, primary buttons, active tabs, eyebrows, links, progress, overdue, wax seal |
| red-deep | `#A0231E` | gradient end, pressed/hover |
| red-mid | `#D9564C` | gradient start |
| clay | `#B9635A` | secondary accent: ampersand, due dates, timeline rule, accordion signs |
| clay-ink | `#A0453D` | text on clay-tint (Sent, Contract sent) |
| clay-tint | `#F5E9E4` | Sent pill, rate card |
| clay-border | `#EBD8D2` | border on clay-tint |
| rose-tint | `#F7E7E3` | soft fills, icon tiles, hero wash mid |
| rose-border | `#E8D3CC` | border on rose-tint |
| blush-wash | `#F5E4DC` | hero radial wash |
| neutral-tint | `#F0EAE2` | Draft pill |
| line | `#DED2C8` | all hairline borders and row dividers |
| blush | `#C48F84` | tertiary accent dot |

Status colours are deliberately differentiated inside this one-accent palette — this matters because invoicing is the client's core requirement:
- **Paid** — white, 1px `#DED2C8`, text `#6B5850`, prefixed `✓` (settled, quiet)
- **Sent** — bg `#F5E9E4`, text `#A0453D`
- **Overdue** — solid `#C9302A`, text `#FFFFFF` (the only loud state)
- **Draft** — bg `#F0EAE2`, text `#98857C`
- Vendors follow the same logic: `✓ Booked` in `#6B5850`, `Contract sent` in `#A0453D`, `Not booked` in `#C9302A`.

Progress fills: budget bar `linear-gradient(90deg,#D9564C,#A0231E)`; category mini-bars solid `#C9302A`; checkbox checked `#C9302A`.

Invitation finishes (card only):
- **Terracotta** — bg `linear-gradient(170deg,#FBF3EF,#F5E4DC)`, ink `#33231F`, soft `#6B5850`, rule `#B9635A`, button `#C9302A` on `#fff`
- **Ivory** — bg `linear-gradient(170deg,#FFFDF8,#F3EADA)`, ink `#33231F`, soft `#6B5850`, rule `#B9635A`, button `#A0453D` on `#fff`
- **Nocturne** — bg `linear-gradient(170deg,#2E2320,#1E1614)`, ink `#F5EEE8`, soft `#C2ADA4`, rule `#E0BFB6`, button `#E0BFB6` on `#241A17`

Dress-code palette swatches (44px circles, border `rgba(35,40,35,.08)`): Terracotta `#C9302A`, Clay `#B9635A`, Oat `#EFE7E0`, Blush `#E8CFC7`, Ink `#33231F`.

Decorative gradients (photo/map placeholders — replace with real imagery):
`linear-gradient(#E9DCD3,#F7E7E3 60%,#F5E9E4)` (hero cover), `linear-gradient(#F7E7E3,#E9DCD3)`, `linear-gradient(#F5E9E4,#EBDDD2)`, `linear-gradient(#F6E8E4,#EBD5CF)`, `linear-gradient(140deg,#E9DCD3,#F7E7E3 45%,#E4D6CD)` (map). Placeholder captions in `#A8918A`.

Hero wash (planner board): `radial-gradient(1100px 420px at 50% -210px, #F5E4DC, transparent 72%)` over the ground colour.

### Typography
- **Display / headings:** `Bodoni Moda` — high-contrast didone. Weight 500 for headings, **700 for the logotype**, italic 500 for couple names.
- **UI / body:** `Jost` — geometric sans. 300 body default, 400/500 for UI.
- Google Fonts: `family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Jost:wght@300..600`. Self-host for production.
- Body: 300, `line-height:1.55`, `-webkit-font-smoothing:antialiased`, `text-wrap:pretty`.

| Role | Spec |
|---|---|
| Logotype (header) | Bodoni Moda 700, 23px, `letter-spacing:-.015em`, `#C9302A` |
| Board hero names | Bodoni italic 500, `clamp(42px,7vw,70px)`, line-height 1.05 |
| Guest hero names | Bodoni italic 500, `clamp(46px,9vw,88px)`, line-height 1 |
| Guest section heading | Bodoni 500, 25–30px, **uppercase**, `letter-spacing:.05em` |
| Block title (board) | Bodoni 500, 23px, sentence case |
| Milestone / programme title | Bodoni 500, 19–20px |
| Big number (stat, budget total) | Bodoni 500, 26–33px |
| Invitation card names | Bodoni italic 500, 44px |
| Eyebrow | Jost 500, 11px, `letter-spacing:.22em–.24em`, uppercase |
| Micro label | Jost 500, 10–12px, `letter-spacing:.12em–.18em`, uppercase, `#98857C` |
| Button / tab label | Jost 500, **11–11.5px, uppercase, `letter-spacing:.14em–.18em`, `white-space:nowrap`** |
| Body | Jost 300, 14–15px; `#6B5850` secondary |
| Status pill | Jost 500, 11px, `letter-spacing:.08em`, uppercase |
| Pull quote (our story) | Bodoni 400, `clamp(20px,2.6vw,26px)`, line-height 1.5, `#4A342E` |
| Amounts | `font-variant-numeric: tabular-nums` |

All CTAs and tabs are small uppercase letterspaced labels in pills — never sentence-case button text.

### Spacing, radii, shadows
- Page gutter 24px; content max-widths: 1180 / 1000 / 900 / 820 / 720 / 640px (RSVP form column 640).
- Card padding: header `20px 22px 0`, body `14px 22px 22px`; guest cards 22–24px; invitation card `44px 34px 34px`.
- Board grid: `repeat(2, minmax(0,1fr))`, `gap:20px`, `align-items:start`; wide blocks `grid-column: 1 / -1`.
- Radii (larger than a standard UI scale — this is the client's signature): cards and large surfaces **20px**, tiles **16px**, inputs/selects **12px**, icon buttons **10px**, checkbox **6px**, pills and CTAs **999px**.
- Button padding: primary/secondary pills `11px 20px`; hero CTAs `14px 30px`; submit `15px` full width; tabs `9px 18px`; finish pills `9px 18px`.
- Card shadow: `0 1px 2px rgba(35,40,35,.04), 0 10px 30px -18px rgba(35,40,35,.18)`.
- Envelope / invitation card shadow: `0 1px 2px rgba(35,40,35,.04), 0 26px 50px -30px rgba(35,40,35,.3–.35)`.
- Wax seal (`#C9302A` circle) shadow: `0 6px 14px -6px rgba(35,40,35,.5)`.
- Hairlines: `1px solid #DED2C8` everywhere.
- Focus ring: `2px solid #C9302A`, `outline-offset:3px`, `border-radius:4px`.
- Animation: `@keyframes riseIn { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:none } }`, used `riseIn .4–.45s ease both` on the invitation card and the RSVP thank-you card. `html { scroll-behavior:smooth }` for in-page anchors.

---

## Global chrome

**Header** — sticky, `top:0`, `z-index:30`, `background: rgba(250,248,243,.92)`, `backdrop-filter: blur(10px)`, `border-bottom: 1px solid #DED2C8`, inner `max-width:1180px; padding:12px 24px`, flex, wraps.
- Left: planner name in Cormorant italic 20px + eyebrow `WEDDING SUITE` (10px, `.2em`, `#98857C`). `margin-right:auto`.
- Centre: view tabs in a pill group (`#fff`, 1px `#DED2C8`, radius 999, padding 4px). Active tab: `#C9302A` bg, `#fff` text, 500. Inactive: transparent, `#6B5850`, 400. Padding `8px 18px`, 13px.
- Right: currency group — same pill container, label `CURRENCY` (10px `.18em` `#98857C`) then 4 buttons EUR/GBP/CHF/PLN. Active: bg `#F5E9E4`, border `#B9635A`, text `#A0453D`, 500. Inactive: transparent, no visible border, `#98857C`.

---

## Screen 1 — Planning board

**Purpose:** the planner's working view for one wedding, and the template she clones per couple.

### Hero
`padding:52px 24px 38px`, centred, `border-bottom:1px solid #DED2C8`, background `radial-gradient(1100px 380px at 50% -190px, #F7E7E3, transparent 70%)`.
- Eyebrow "THE WEDDING OF" (`#C9302A`), margin-bottom 16px.
- Names "Amélie & Jonas"; ampersand `#B9635A`, `font-size:.55em`, `vertical-align:.12em`, `padding: 0 .18em`.
- Meta line 15px `#6B5850`: `12 June 2027 · Villa Regina, Lake Como · 92 guests`, separators `·` in `#B9635A` with `padding: 0 10px`.
- Three stat pills (flex, gap 10, wrap, `margin-top:28px`): white, 1px `#DED2C8`, radius 999, `padding:9px 18px`, 13px `#6B5850`, each with an 8px dot — sage `#C9302A` for "**N** days to go" (countdown to 2027-06-12), gold `#B9635A` for "**58%** of budget committed", blush `#C48F84` for "**€3,500** invoices outstanding" (live from the ledger, in the selected currency).

### Toolbar
`max-width:1180px; padding:22px 24px 0`, space-between, wraps.
- Left: eyebrow `PLANNING BOARD · TEMPLATE` in `#98857C`.
- Right: hint text (edit mode only) "Drag a block to reorder · hide it · or add one from the library", 12px `#6B5850`; then the **Customise blocks** toggle — off: white bg, 1px `#DED2C8`, `#C9302A` text, 30×16 track `#DED2C8` with a 12px white knob at left; on: label "Editing layout", bg + border `#C9302A`, white text, track `rgba(255,255,255,.35)`, knob at right (translate 14px). `padding:8px 16px`, 13px/500, radius 999.

### Block library (edit mode only)
Panel: bg `#F7E7E3`, border `1px solid #E8D3CC`, radius 20, `padding:16px 20px`, `margin-top:14px`, flex wrap gap 12. Eyebrow "BLOCK LIBRARY" (`#C9302A`), then one chip per hidden block: `+ <Title>`, white bg, **dashed** 1px `#C9958B`, `#C9302A`, radius 999, `padding:7px 15px`, 13px. If nothing is hidden: "Every block is on the board. Hide one to put it back in the library."

### Block shell
Card as tokens above. Header row (flex, gap 12): in edit mode a grab handle `⋮⋮` (`#CDBCB1`, 13px, `letter-spacing:-2px`, `cursor:grab`); block title; tag pill pushed right (`margin-left:auto`, 11px `.14em` uppercase, `#C9302A` on `#F7E7E3`, `padding:4px 10px`, radius 999); in edit mode three 27×27 icon buttons `↑ ↓ ×` (radius 8, 1px `#DED2C8`, bg `#EFE7E0`, `#6B5850`).

Edit-mode behaviour: card `cursor:grab`; the dragged block drops to `opacity:.5`; while a drag is active, other cards' borders shift to `#E8D3CC`. `↑`/`↓` swap with the previous/next **visible** block; `×` hides the block and returns it to the library. HTML5 drag-and-drop (`dragstart`/`dragover`/`drop`) reorders by moving the dragged key to the drop target's index.

### Blocks

**Timeline** (wide, tag "On track") — two columns, `repeat(auto-fit, minmax(300px,1fr))`, `gap: 6px 44px`. Each column: `position:relative; padding-left:26px` with a vertical rule `left:8px; top:6px; bottom:6px; width:1px; background: linear-gradient(#B9635A,#DED2C8)`. Milestones: `padding:0 0 20px 18px`; dot 11px at `left:-22px; top:5px` — done: fill `#C9302A`, border `#C9302A`; next: white fill, border `#B9635A`, `box-shadow:0 0 0 4px #F5E9E4`; future: white fill, border `#DED2C8`. `when` label 11px `.16em` uppercase (`#98857C`, next = `#B9635A`); title Cormorant 500 19px (done = `#98857C`); text 14px `#6B5850`, `max-width:50ch`.

Content: Oct 2026 *Venue confirmed* (done) · Dec 2026 *Photographer & celebrant booked* (done) · **Next · March 2027** *Menu tasting in Como* · April 2027 *Invitations out & RSVPs open* · May 2027 *Final numbers & seating plan* · 11–12 June 2027 *Rehearsal & the day itself*. (Full copy in the prototype.)

**Payments & invoices** (wide, tag "2 to chase") — the commercially important block.
- Four summary tiles, `repeat(auto-fit, minmax(150px,1fr))`, gap 10, `margin-bottom:18px`; tiles `#EFE7E0` + 1px `#DED2C8`, radius 16, `padding:13px 15px`; micro-label + Cormorant 26px value. Paid (`#C9302A`), Outstanding (`#B9635A`), Drafts (`#6B5850`), and "Rate today" (`#F5E9E4` / border `#EBD8D2` / text `#A0453D`, 14px) reading `Base currency · EUR` or `1 EUR = 0.842 GBP`.
- Ledger rows: flex, `gap:14px`, `padding:12px 0`, divider `1px #DED2C8`, wrap. Columns: invoice id (66px, 12px `.04em` `#98857C`, tabular) · vendor + description (`flex:1; min-width:190px`; name 14.5px/500, line 12.5px `#6B5850`) · amount right-aligned (min-width 110px, 500, tabular; when currency ≠ EUR a second line "invoiced €8,400" in 12px `#98857C`) · due date (min-width 96px, 12.5px `#6B5850`, right) · status pill (min-width 92px, centred) · action button or a 104px spacer.
- Status pills (see Design Tokens): Paid — white + 1px `#DED2C8`, `#6B5850`, prefixed `✓`; Sent — `#F5E9E4`/`#A0453D`; Overdue — solid `#C9302A`, white text; Draft — `#F0EAE2`/`#98857C`. Only Overdue is loud.
- Action button: white, 1px `#DED2C8`, `#C9302A`, radius 999, `padding:6px 14px`, 12.5px. Label "Send" on drafts, "Mark paid" on sent/overdue; none on paid.
- Footnote 13px `#6B5850`: invoices are issued in **EUR** (VAT line, IBAN, payment terms) and mirrored in the couple's currency at the ECB rate on the issue date; paid invoices post into the budget block.

Seed ledger: INV-2041 Villa Regina, venue deposit 2 of 3, €8,400, due 15 Mar 2027, paid · INV-2042 Studio Lumen, photography final balance, €2,300, due 1 Apr 2027, sent · INV-2043 Fiori di Lina, florals deposit, €1,200, due 28 Feb 2027, overdue · INV-2044 Trio Belvedere, ceremony music in full, €950, due 10 Feb 2027, paid · INV-2045 Amélie & Jonas, planning fee stage 2 of 4, €1,500, due 1 Mar 2027, draft.

**Vendors** (tag "6 / 9 booked") — rows with a 34×34 `#F7E7E3` radius-12 icon tile, name 15px/500 + role 13px `#6B5850`, and a right column: fee (13.5px, tabular) over a status word in 11px `.08em` uppercase — `✓ Booked` `#6B5850`, `Contract sent` `#A0453D`, `Not booked` `#C9302A`. Rows: Villa Regina €14,200 booked · Studio Lumen €4,600 booked · Fiori di Lina €3,900 contract sent · Catering (tasting March) €9,800 shortlist · Trio Belvedere €950 booked · Guest transfers €1,400 shortlist.

**Budget** (tag "58% committed") — Cormorant 33px committed total + "of €47,000 committed" (14px `#6B5850`); progress bar 8px, track `#F7E7E3`, fill `linear-gradient(90deg,#D9564C,#A0231E)`, radius 999, `margin:8px 0 18px`; then category rows (14px, `padding:7px 0`): name, a 70×4 mini bar (track `#F7E7E3`, fill `#C9302A`, width = spent/cap), amount right (min-width 80px, tabular). Categories (spent / cap): Venue & catering 16,800/23,000 · Photo & film 4,600/4,600 · Florals & décor 2,400/6,000 · Music 1,900/2,100 · Attire & rings 1,700/5,600. Footnote 12.5px `#98857C`: "Stored in EUR · displayed in GBP".

**Next steps** (tag "This month") — rows `padding:9px 0` with divider: a 19px checkbox button (unchecked white + 1.5px `#DED2C8`; checked `#C9302A` fill, white ✓ 11px), label (done: `#98857C` + line-through in `#D3C4B9`), due date right in 12px `#B9635A`. Tasks: engagement shoot location (done) · sign florals contract & pay deposit 28 Feb · chase INV-2043 with Fiori di Lina 1 Mar · book flights for the tasting 5 Mar · send invitation finish for approval 20 Mar.

**Guests** (tag "RSVP open") — three tiles (`repeat(3,1fr)`, gap 12): `#EFE7E0`, 1px `#DED2C8`, radius 16, `padding:14px 6px`, centred; Cormorant 27px number over an 11px `.14em` uppercase caption — 92 Invited, 34 Confirmed (`#C9302A`), 58 Awaiting (`#B9635A`). Note 13px: 7 guests need the shuttle, 4 dietary notes, "every RSVP from the guest site lands here and syncs to the caterer". Confirmed/Awaiting/dietary counts update when the guest-site RSVP is submitted.

**Documents** (tag "All in one place") — rows with a 32×32 `#F5E9E4` radius-12 icon tile, name 14px/500, meta 12px `#6B5850`: venue contract (signed 14 Oct 2026), photography agreement (signed 2 Dec 2026), florals contract (awaiting signature), day-of schedule v2 (draft, live for vendors).

**Guest site & invitations** (wide, tag "Live") — two-part flex: left, copy ("The couple's public page and the digital invitation run off this same board — change a time here and the guest site updates") plus buttons "Open guest site" (`#C9302A`, white) and "Open invitation" (white, 1px `#DED2C8`, `#C9302A`), both radius 999 `padding:9px 18px` 13px/500; right, a `#EFE7E0` stats card (border `#DED2C8`, radius 16, `padding:14px 16px`) with label/value rows 13px: Invitations delivered 92 · Opened 71 · Responded 34 · Languages live EN · IT · DE (last row separated by a top border).

**Library blocks** (generic, two-column list: bold label left, 13px `#6B5850` right):
- *Seating plan* — "9 tables": Top table 8 seats confirmed · Tables 1–7 8 per table, draft 3 · Kids table 4 seats to confirm.
- *Accommodation* — "Rooms held": Hotel Belvedere 22 rooms to 1 May · Villa annexe 6 rooms family · B&B La Riva 8 rooms on the shuttle route.
- *Honeymoon* — "Draft": Puglia 14–24 June, flights on hold · Masseria Trulli, quote requested · Transfer Brindisi, to book.
- *Weather & rain plan* — "Plan B ready": Ceremony loggia if rain risk > 40% · Dinner orangery seats 100 · Decision called 24h before.

### Footer
Top border, `padding:32px 24px 46px`, centred, 13px `#6B5850`. Cormorant italic 18px "A planning template by **Cherii**" then "Each couple gets their own board from this template — blocks reordered, hidden or added per wedding." + "Demo data. Custom code, no site builder."

---

## Screen 2 — Guest site

**Purpose:** what the couple's invitees see; the RSVP is the conversion point.

- **Context strip** (prototype only, drop in production): `#C9302A` bg, `#F7E7E3` 12px centred — "Guest-facing page · amelie-and-jonas.com".
- **Cover:** full-width band `height: clamp(220px,34vw,380px)`, hero gradient, centred placeholder caption in `#A8918A` ("Cover photograph · Villa Regina at golden hour · 2400 × 1200"). Replace with a real 2400×1200 image.
- **Hero text** (max-width 820, `padding:44px 24px 52px`, centred): eyebrow "SATURDAY · 12 JUNE 2027"; names `clamp(46px,9vw,88px)` with gold ampersand (`.5em`, `vertical-align:.16em`); Cormorant 20px "Villa Regina, Lake Como — Italy"; three info pills (white, 1px `#DED2C8`, radius 999, `padding:9px 20px`, 13px): days to go, "Ceremony 15:00", "RSVP by 15 May"; CTAs "RSVP" (`#C9302A`/white, `padding:12px 26px`, radius 999) → `#gs-rsvp` and "The day" (white/`#C9302A`) → `#gs-day`; language row "READ IN" + EN/IT/DE pills (active `#F5E9E4`/`#B9635A`/`#A0453D`, inactive white/`#DED2C8`/`#98857C`) — in production these switch locale.
- **Gallery:** three 240px-tall radius-14 blocks, `repeat(auto-fit, minmax(240px,1fr))`, gap 20, each a decorative gradient with an uppercase "PHOTO" label. Replace with real photography.
- **Our story:** max-width 720, centred; eyebrow "OUR STORY, BRIEFLY" + pull quote (see typography). Copy in the prototype.
- **The day** (`id="gs-day"`): centred eyebrow "THE DAY" + Cormorant 34px "Saturday, 12 June"; two-column timeline (same rule/dot pattern as the board, dots always white with `#B9635A` border, `left:-21px`, 9px). Items: 14:15 Gates open · 15:30 Ceremony · 16:15 Aperitivo · 18:30 Dinner · 21:30 First dance · 01:00 Shuttles home. **Note:** the hero pill says "Ceremony 15:00" while the programme says 15:30 — align these to one value when wiring real data.
- **Getting there:** white band with top/bottom border; two columns (`minmax(280px,1fr)`, gap 34, centred). Left: eyebrow, Cormorant 32px "Villa Regina", address line, then three label/value rows separated by top borders (Milan Malpensa · Milan Centrale · Wedding shuttle). Right: 300px map placeholder, radius 20, map gradient, 1px `#DED2C8`, uppercase caption "MAP · BELLAGIO" — replace with a real map embed/static tile.
- **Where to stay / Dress code:** two columns (`minmax(260px,1fr)`, gap 28). Stay: eyebrow + Cormorant 28px "Rooms held until 1 May", three hotel rows (name 500 + meta 12.5px `#6B5850`, price right, tabular) — Hotel Belvedere €180, Albergo Silvio €140, B&B La Riva €95 per night; footnote 12.5px `#98857C`. Dress code: eyebrow + "Garden formal", 14.5px body, then the five palette swatches with 11px captions.
- **RSVP** (`id="gs-rsvp"`): section bg `#F7E7E3`, top border `#E8D3CC`, inner max-width 640, `padding:60px 24px`.
  - Heading block: eyebrow "RSVP", Cormorant 34px "Will you join us?", 14px "Please reply by 15 May. One form per invitation."
  - Form card: white, 1px `#DED2C8`, radius 20, `padding:24px`. Field labels 12px `.12em` uppercase `#98857C`, margin-bottom 6–8px. Inputs/selects/textarea: full width, 1px `#DED2C8`, radius 10, `padding:11px 13px`, 15px, bg `#EFE7E0`.
  - Fields: **Invitation** (text, prefilled with the guest's name from their link) · **Attending** segmented pair "Joyfully yes" / "Sadly no" (flex, gap 8; active `#C9302A`/white/500, inactive `#EFE7E0` + 1px `#DED2C8`/`#6B5850`; radius 10, `padding:11px`) · then, only when attending: **Guests** select 1–4 and **Main course** select (Lake fish / Veal / Vegetarian / Vegan) in a `minmax(150px,1fr)` grid gap 14, plus a full-width shuttle toggle row (`#EFE7E0`, 1px `#DED2C8`, radius 10, `padding:12px 13px`, 19px checkbox as on the board) "We'll take the shuttle from Como, 13:45" · **Anything we should know** textarea (3 rows, placeholder "Allergies, a song you need to hear, arrival time…").
  - Submit: full-width `#C9302A` pill, white, `padding:14px`, 15px/500, "Send our reply"; footnote 12.5px `#98857C` centred "Goes straight to the planning board — no email chains."
  - **Sent state** (replaces the form, `riseIn .4s`): white card `padding:34px 26px` centred — 46px `#F7E7E3` circle with `#C9302A` ✓; Cormorant 30px "Thank you, {name}"; summary line ("2 seats · Lake fish · shuttle from Como 13:45", or the regrets line when not attending); a `#EFE7E0` receipt card (radius 16, `padding:14px 16px`, 13px, left-aligned) with three confirmed rows (recorded on the board / caterer notified / shuttle list updated); buttons "Change our reply" (white) and "See it on the board" (`#C9302A`).
- **Gifts / Questions:** max-width 900, two columns gap 32. Gifts: eyebrow + Cormorant 28px "Your presence, mostly" + 14.5px copy. Questions: FAQ accordion — each item a full-width text-left button (`padding:12px 0`, 14.5px) with a `#B9635A` `+`/`–` sign on the right and a bottom border; open answer 14px `#6B5850`, `max-width:52ch`, `margin-bottom:14px`. Only one item open at a time (first open by default). Items: children · parking · rain · photographs.
- **Footer:** top border, centred, `padding:34px 24px 50px`; Cormorant italic 19px "Amélie & Jonas · 12.06.2027" + planner contact line — email plus Telegram and WhatsApp, each a live link (`mailto:`, `t.me`, `wa.me`).

---

## Screen 3 — Digital invitation

**Purpose:** show the planner what each guest receives, and how she controls it.

- **Intro** (centred, max-width 1040): eyebrow "DIGITAL INVITATION"; Cormorant `clamp(30px,4.4vw,40px)` "One personal link per guest"; 14.5px body (`max-width:56ch`); finish selector — three pills Terracotta / Ivory / Nocturne (active `#C9302A`/white/500, inactive white + 1px `#DED2C8`/`#6B5850`, `padding:8px 18px`, 13px).
- **Layout:** `repeat(auto-fit, minmax(300px,1fr))`, gap 26, `align-items:start`. Left column is a `min-height:520px` centred stage for the envelope/card; right column is a 16px-gap stack of two info cards.
- **Envelope (closed):** button, `max-width:420px`, `aspect-ratio:1.5`, radius 20, bg `linear-gradient(160deg,#FDF9F5,#F2E7DF)`, 1px `#DED2C8`, envelope shadow. Flap: absolutely positioned top band, `height:56%`, `linear-gradient(#F5EBE3,#EDE0D7)`, `clip-path: polygon(0 0,100% 0,50% 100%)`, bottom border `#DED2C8`. Centre: 64px `#C9302A` circle, white Cormorant italic 22px "A&J", wax-seal shadow. Bottom caption 11px `.22em` uppercase `#98857C` "TAP TO OPEN".
- **Card (open)**, `riseIn .45s`: `max-width:420px`, radius 20, `padding:44px 34px 34px`, centred, finish gradient + 1px `rgba(35,40,35,.1)` + envelope shadow. Stack: eyebrow 10.5px `.24em` "Together with their families" · names Cormorant italic 500 44px with finish-rule ampersand · 44×1px rule in the finish accent, `margin:18px auto` · 13.5px "request the pleasure of the company of" · guest name Cormorant 23px · "at their marriage" · Cormorant 19px "Saturday 12 June 2027 · half past three" · "Villa Regina, Bellagio · Lake Como" · 12.5px `.04em` "Garden formal · dinner and dancing to follow" · full-width pill button "RSVP by 15 May" (finish button colours) → guest site RSVP · underlined text button "Close the envelope".
- **Sending card:** white, 1px `#DED2C8`, radius 20, `padding:22px`; Cormorant 22px "Sending"; label/value rows — Delivered 92 of 92 (WhatsApp & email) · Opened 71, reminder queued · Responded N guests (live) · Languages English · Italiano · Deutsch; footnote 12.5px `#98857C` about the print-ready PDF at 148 × 210 mm with 3 mm bleed.
- **What the planner controls card:** Cormorant 22px heading, 14px copy ("Wording, finish, languages and the reply deadline are fields on the board — no developer needed per wedding"), buttons "Back to the board" (`#C9302A`) and "Guest site" (white).

---

## Interactions & Behaviour
- **Label convention:** every button, tab and CTA is an uppercase letterspaced pill label at 11–11.5px with `white-space:nowrap`; the nowrap matters — at these letter-spacings labels like "Planning board" wrap and break the pill.
- **View switching:** three views in the header; also cross-linked from the Guest site block, the invitation card CTA (→ guest RSVP) and the thank-you card (→ board). In production these are routes: `/board`, `/{couple-slug}` (public), `/{couple-slug}/invite/{guestToken}`.
- **Currency switch:** recomputes every amount on the board and the guest-site hotel prices from EUR base; invoice rows gain an "invoiced €X" sub-line when the display currency isn't EUR; the rate card and the budget footnote update. Rounded to whole units, `en-GB` grouping.
- **Edit mode:** toggle reveals grab handles, per-block `↑ ↓ ×` controls, the hint line and the block library. Order and visibility are per-couple settings and must persist server-side.
- **Drag and drop:** HTML5 DnD on the block wrapper; dragged block at `opacity:.5`; drop moves it to the target's position. Keep the arrow buttons as the accessible/touch path.
- **Invoice actions:** draft → sent → paid, one click each, optimistic UI; totals and the hero "invoices outstanding" pill recompute. In production: POST to the invoicing service, send the PDF by email, log the transition.
- **Checklist:** optimistic toggle, done rows mute + strike.
- **RSVP:** controlled fields; conditional block only when attending; submit swaps the card for the thank-you state; "Change our reply" returns to the form with values intact. On submit the board's Confirmed count rises by the party size, Awaiting falls, dietary count +1 when a note was left, and invitation "Responded" rises.
- **FAQ:** single-open accordion; clicking the open item closes it.
- **Anchors:** smooth scroll to `#gs-day` / `#gs-rsvp`.
- **Responsive:** the board grid collapses to one column below ~820px (wide blocks then span the single column); all inner grids use `auto-fit`/`minmax`, so no extra breakpoints are needed. Guest-site type is fluid via `clamp()`. Touch targets on mobile must be ≥44px — the 27px icon buttons and 19px checkboxes need enlarging on small screens.
- **Not yet designed (ask before building):** loading and empty states, form validation and error states, auth, the planner's multi-wedding index, hover states beyond colour changes, and `prefers-reduced-motion` (suppress `riseIn` and smooth scroll).

## State Management
Prototype-local state that maps to real persistence:

| State | Shape | Persistence |
|---|---|---|
| `view` | 'board' \| 'guest' \| 'invite' | route |
| `currency` | 'EUR' \| 'GBP' \| 'CHF' \| 'PLN' | couple setting; rates from an FX/ECB feed, cached daily |
| `editing` | boolean | UI only |
| `order` | array of block keys | couple setting |
| `hidden` | map of block key → true | couple setting |
| `done` | map of task id → boolean | tasks table |
| `invStatus` | map of invoice id → status | invoices table (authoritative) |
| `drag` | block key or null | UI only |
| `rsvp` | `{ name, going, seats, menu, shuttle, note }` | rsvps table, keyed by guest token |
| `sent` | boolean | derived from the guest's RSVP record |
| `faq`, `lang`, `opened`, `design` | index / locale / boolean / finish id | UI; `lang` and `design` are couple settings |

Data the backend should own: couple profile (names, date, venue, guest count), milestones, vendors (with fees), budget categories (spent/cap), tasks, invoices, documents, guests + invitation tokens, RSVPs, guest-site content blocks, block layout, FX rates.

Money rules: store amounts as integer minor units in **EUR**; convert only for display; freeze the rate on an invoice at issue time and store it with the invoice so the mirrored amount never drifts.

## Assets
No binary assets ship with this design. Placeholders to replace:
- Guest-site cover photograph (2400 × 1200), three gallery images, one venue map (static tile or embed).
- Vendor and document row icons are emoji in the prototype (🏛 📷 🌸 🍽 🎻 🚐 📄 ✍️ 🗓) — swap for the codebase's icon set.
- The "A&J" wax seal is CSS type, not an image; a real monogram SVG would be better.
- Fonts: Bodoni Moda and Jost from Google Fonts — self-host for production.

## Files
- `Wedding Suite v2.dc.html` — **the design to build.** Full prototype of all three views with live interactions: the header switches views, "Customise blocks" enables layout editing (drag, arrows, hide, block library), the currency group converts all money, invoice actions advance statuses, and the RSVP form submits and writes back to the board. Open it directly in a browser.
- `Wedding Suite.dc.html` — the earlier version in a sage/gold palette. Reference only, for structure; **v2 is the visual source of truth**.
- `README.md` — this document.
