# grid.techwebster.com

Build a city. Master CSS Grid. Write real CSS — the city judges you.

An interactive, dependency-free game that teaches CSS Grid through 8 progressive
puzzles. Each level gives you a mission, a dashed blueprint of the target layout,
and a live CSS editor. Write actual grid CSS; the game checks your layout
pixel-by-pixel in real time and shows which zones match.

## Play

Open `index.html` for the landing page, or `play/index.html` for the game, in any browser (works from `file://`, no server or build step).

| # | Level | Teaches |
|---|-------|---------|
| 1 | Main Street | `display: grid` + `grid-template-columns`, `repeat()`, `fr` |
| 2 | Two by Two | `grid-template-rows` + auto-placement order |
| 3 | The Heights | `fr` weights (2fr 1fr) + spanning rows |
| 4 | Alley Ways | `gap` (and why it beats margins) |
| 5 | The Grand Hotel | `grid-column: span 2` |
| 6 | Skyline Lines | line numbers + negative lines (`1 / -1`) |
| 7 | City Blocks | `grid-template-areas` + `.` empty cells |
| 8 | Town Square (Boss) | the full app-shell layout |

Complete a level to earn stars (fewer failed checks = more stars) and a lesson
card with a real-world use case and a pro tip. Progress saves automatically.

## The oracle

Your layout is validated geometrically: the game computes the expected pixel
rectangle of every zone from the level's template, then compares it to where the
browser actually rendered your items — so *any* valid grid technique that
produces the right layout passes (`grid-template-areas`, line numbers, `span`,
whatever you like). Positioning hacks (`position: absolute`) are rejected.

## Development checks (unlazy gates)

```sh
node verify/verify.cjs levels    # level data + geometry integrity
node verify/verify.cjs engine    # layout-oracle math unit tests
node verify/verify.cjs html      # page wiring, file:// safety
node verify/verify.cjs syntax    # JS parses
node verify/verify.cjs selftest  # end-to-end: real Chrome headless solves all 8 levels
```

Gate ledger: `GATES.md` (see `.agents/skills/unlazy/`).

## Website regression checks

`npm install` installs development-only Playwright. No build or runtime dependency is required.
Run `npm test` for the original checks. Serve the repository root with `python3 -m http.server 4173`, then run `npm run test:site` for navigation, all puzzle solutions, save/reload, keyboard access, animation synchronization, pause, reduced motion, local assets, metadata and mobile overflow. The browser suite uses local Google Chrome on macOS; set `CHROME_PATH` for another installed browser. Screenshots are written to the system temporary directory under `grid-qa`.

See [brand research and production follow-up](BRAND-AND-DELIVERY.md).
