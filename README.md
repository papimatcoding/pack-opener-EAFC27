# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version before release merge:** `V0.12 Stabilized`  
**Dev release candidate:** `V0.13 Canonical Card Visual System — QA PASSED`  
**Next target:** `asset coverage report + deterministic player/club/competition coverage + crop outliers`  

### Branch truth

`dev` is the canonical integration state and now contains the complete V0.13 card overhaul plus the fixes found during human screenshot review. V0.13 is ready for `dev → main`; after that merge, `main`/Pages becomes the production truth.

Historical V0.13 working branches/PRs are finished: initial card system PR #13, human-smoke fixes #14, browser-regression fix #15 and official-portrait vignette #16. Continue future product work from `dev`, not those branches.

### Why V0.13 exists

The user-provided mobile Club screenshot exposed that V0.12 cards were technically non-overlapping but still visually poor: oversized art, cramped 2×3 stats, weak nation/league/club hierarchy, tiny/fragile identity assets and insufficient common-vs-rare differentiation.

### What V0.13 contains

- `v13/card-ui.js` is the final canonical renderer for full `Card` and compact `FieldCard` output while compatibility classes keep existing features alive.
- All seven active materials are explicit: `bronze-common`, `bronze-rare`, `silver-common`, `silver-rare`, `gold-common`, `gold-rare`, `totw`.
- FC-era composition: OVR/position → portrait → name → **six horizontal stats** → nation / competition / club.
- Common bronze/silver/gold are calmer; rare versions use a stronger radial/sunburst material; TOTW has its own black/gold skin.
- Transparent cutouts are substantially less zoomed than V0.12.
- Verified rectangular club photos use a smaller shaped portrait vignette with bottom fade instead of appearing as a raw pasted rectangle.
- Club/competition/flag identity slots have fixed visual weight.
- Core major club crests and league emblems are pinned deterministically; a local text badge sits under the remote image so a failed crest never leaves a blank slot.
- Mobile Club guarantees two readable cards per row; desktop keeps a denser Companion gallery.
- XI / Draft / SBC field cards retain the same rarity/material identity.
- PWA cache is bumped so stale card CSS cannot survive the release.

### Final V0.13 QA snapshot

Latest green CI run: **run #30**, dev commit `2406e2a5a3fa3135b0f2035a22033e9baba23bb1`.

Passed:

- legacy regression suite;
- V0.12 systems smoke;
- V0.13 static audit for **7/7 card materials**;
- Chromium mobile + desktop Club smoke;
- Chromium Draft field smoke with 11/11 cards;
- dedicated Chromium **7-card matrix** on mobile and desktop;
- screenshot artifact upload;
- no browser runtime exception in the final run.

Human screenshot review was performed, not just geometry assertions. It caught two real issues during development: official rectangular photos looked pasted onto the card, and the first global image-error fallback caused a browser regression. Both were fixed and the complete suite was rerun successfully.

Final matrix visually reviewed:

- TOTW: distinct black/gold and readable;
- gold rare: high-energy rare material;
- gold common: deliberately calmer;
- silver rare/common: clearly distinguishable;
- bronze rare/common: clearly distinguishable;
- transparent cutout: correctly integrated;
- official rectangular portrait: now intentionally vignetted;
- silhouette fallback: remains neutral and readable;
- identity row: nation + competition + club remain inside reserved space.

### Stable baseline that must not regress

- ~262-card male pool and enough real bronzes for starter SBC progression;
- free Basic Pack progression;
- Club `All / Specials / 84+ / Gold / Silver / Bronze` filters;
- 85+ walkout pacing;
- four-round Draft Cup;
- duplicate-only manual SBCs with last-copy protection;
- strict player-photo fallback: exact player + current club + football cutout only;
- six formations, modern chemistry and `199 = 99 OVR + 100 chemistry` cap.

---

## 🎯 PRODUCT RULES ALREADY DECIDED

- Male football only for now; women’s content comes later.
- No Academy mode.
- Always keep a free route: **Basic Packs → duplicates → SBC → better rewards**.
- Draft is free: formation → 11 picks → R16 / QF / SF / Final → modest placement reward.
- SBC/DCP are manually built and currently consume duplicates only; last copy is protected.
- Same footballer cannot appear twice in one SBC squad.
- Chemistry is club / nation / league inspired, max 3 per player; team chemistry is 0–100.
- Team score max is **199**.
- Card rarity/material must remain identical in packs, Club, XI, Draft and SBC.
- TOTW Lab/future fictional promos are simulated PackVerse content, clearly separated from official base data.
- Correct silhouette > wrong player / wrong shirt / wrong club image.
- Visual quality is a release requirement; green tests alone are insufficient.

---

## 🔴 NEXT WORK, IN PRIORITY ORDER

### P0 — Asset integrity / coverage

V0.13 fixes the card container; the next weakest point is **coverage**, not another card redesign.

1. Build an asset coverage report: player photos %, club badges %, competition logos %, flags %.
2. Add canonical player / club / competition IDs.
3. Expand deterministic verified photo and badge registries across the active dataset.
4. Keep exact player + current club for any remote fallback.
5. Preserve the three art profiles: `cutout`, `officialPortrait`, `silhouette`.
6. Add per-player crop overrides only for true outliers.
7. Complete LALIGA HYPERMOTION identity first, then LaLiga / Premier League / Bundesliga / Serie A / Ligue 1.

### P0 — Retire historical card ownership

V0.13 is the final renderer, but historical `v4 → v12` layers still load for compatibility. Gradually prove and remove obsolete card overrides instead of adding endless `!important` patches.

### P1 — Walkout / player pool / Draft / SBC polish

Keep normal pulls fast. 85+ suspense remains `nation → position → club → OVR → card`. Expand the real player pool league-by-league. Draft should later show generated opponent squads/results more clearly. SBC needs clearer live requirements, filters/groups and repeatable upgrades.

---

## 🧪 RELEASE / SMOKE RULE — MANDATORY

Every release must pass all three layers.

### 1. Engine / AI smoke

Validate runtime loading, dataset IDs, pack simulations/odds/item counts, no duplicate card in a normal pack, Club filters, formations/chemistry/199 cap, Draft curve/rewards, SBC duplicate laws, starter feasibility and asset-policy regressions.

For card work, `scripts/smoke-v13.mjs` must confirm all seven materials and both canonical renderers.

### 2. Real browser smoke

Minimum Chromium sizes: mobile `390×844`, desktop `1440×900`. Check runtime exceptions, overflow, card geometry, photo/name/stats/id-row gaps, Club filters, Draft 11/11 field cards and desktop Companion layout.

For card work, also run `scripts/browser-card-matrix-v13.mjs`; it must render all seven rarities in real Chromium. CI stores screenshots in `packverse-browser-smoke`.

### 3. Human smoke

Actually inspect screenshots. For card changes, review all seven materials plus cutout, official portrait, silhouette, mobile Club, desktop Club and field cards. If screenshots look wrong, fix them before `main` even if CI is green.

---

## 🌿 BRANCH WORKFLOW

1. `main` = stable deployed Pages.
2. `dev` = canonical integration/current project state.
3. Larger changes use `feat/...` or `fix/...` from `dev`.
4. Merge feature work into `dev` first.
5. Run engine + Chromium smoke.
6. Inspect screenshots manually.
7. **Update this README after every meaningful improvement.**
8. PR `dev → main` only when stable.
9. Confirm Pages and share the live link.

Do not make normal product commits directly to `main`.

---

## 🧱 CURRENT STRUCTURE

```text
.
├── index.html
├── js/data.js
├── v4/ ... v11/          # historical/runtime layers
├── v12/                  # stabilized systems + strict art resolver
├── v13/
│   ├── assets.js         # deterministic core identity registry
│   ├── card-ui.js        # canonical Card + FieldCard renderer
│   ├── cards.css         # seven rarity materials + geometry
│   └── audit-fixes.css   # fixes discovered by human screenshot review
├── scripts/
│   ├── validate-v4.mjs
│   ├── smoke-v12.mjs
│   ├── smoke-v13.mjs
│   ├── browser-smoke-v12.mjs
│   └── browser-card-matrix-v13.mjs
├── .github/workflows/
├── manifest.json
└── sw.js
```

Long-term direction: keep vanilla JS/PWA for now, but move toward explicit `data/`, `core/`, `components/` and `features/` ownership rather than indefinite versioned overrides.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

1. Open this README on `dev` first.
2. Inspect `main` and `dev` HEADs plus open PRs.
3. Read **CURRENT PROJECT STATE**, **Final V0.13 QA snapshot** and **NEXT WORK**.
4. Never assume an old V0.x feature branch is production.
5. Continue from `dev`.
6. Run mandatory smoke before moving anything to `main`.
7. Update this README after the next meaningful improvement.

**This README is the canonical handoff for PackVerse.**
