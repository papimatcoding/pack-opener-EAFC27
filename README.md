# PackVerse 27

Mobile-first football card-collection PWA inspired by the game loop of Ultimate Team / MADFUT: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Current feature branch:** `feat/v013-card-visual-system`  
**Production version:** `V0.12 Stabilized`  
**Integration candidate:** `V0.13 Canonical Card Visual System`  
**Next target after V0.13:** `finish deterministic photo / club / competition asset coverage + per-player crop outliers`  

### Branch truth

`main` is stable and deployed to GitHub Pages. It currently contains **V0.12 Stabilized**.

`dev` is the canonical integration branch. Product work must reach `dev`, pass automated Chromium + engine smoke and human screenshot review, then move `dev → main`.

`feat/v013-card-visual-system` was created from `dev` specifically for the card overhaul requested after the 2026-09-14 mobile Club screenshot. Do not bypass QA by copying individual V0.13 files directly to `main`.

### Why V0.13 exists

The V0.12 screenshot showed that “no overlap” was not enough. Cards were technically valid but visually weak:

- player art was too large / inconsistently cropped;
- the 2×3 stat block looked cramped and unlike the current FC-era card language;
- nation / league / club identity was tiny and visually unbalanced;
- runtime badge fallback could leave initials such as `P` instead of a crest;
- common vs rare cards did not feel different enough at a glance;
- historical `v4 → v12` overrides still owned pieces of the same card.

### What V0.13 changes

V0.13 is a **card-system pass, not a new game-mode update**.

- introduces `v13/card-ui.js` as the final canonical renderer for full cards and field cards;
- keeps compatibility classes so Club / packs / XI / Draft / SBC continue working;
- explicitly audits all seven current materials: `bronze-common`, `bronze-rare`, `silver-common`, `silver-rare`, `gold-common`, `gold-rare`, `totw`;
- moves base cards to a cleaner FC-era composition: OVR/position → portrait → name → six horizontal stats → nation/competition/club;
- rare bronze/silver/gold use a stronger radial/sunburst treatment rather than only a small marker;
- TOTW gets its own black/gold material and trim;
- reduces transparent-cutout zoom substantially so shirts/torso no longer swallow the card;
- preserves a separate crop profile for official rectangular portraits;
- makes identity assets similar in visual weight instead of letting the league mark dominate;
- guarantees two readable Club cards per row on phone widths;
- applies the same material identity to compact XI / Draft / SBC field cards;
- pins deterministic core club crests and major-league emblems before runtime fallback;
- bumps the PWA cache so old card CSS cannot survive the release;
- adds `scripts/smoke-v13.mjs` and makes CI explicitly check 7/7 materials and V0.13 loading.

### V0.12 baseline that must not regress

- **262 cards** loaded; **39 bronze cards** in the last stable QA snapshot;
- free Basic Pack progression, mostly bronze;
- Club `All / Specials / 84+ / Gold / Silver / Bronze` filters;
- 85+ walkout pacing;
- Draft Cup with four knockout rounds;
- manual duplicate-only SBC systems;
- strict player-photo resolver: official first, otherwise exact player + current club + football cutout only;
- six formations, modern chemistry and `/199` cap;
- Chromium mobile `390×844` and desktop `1440×900` smoke;
- Draft 11/11 field-card rendering without vertical overflow.

### V0.13 QA status

At this handoff point the feature implementation is complete on `feat/v013-card-visual-system`, but it is **not production until the branch is merged to `dev` and CI/human smoke are reviewed**.

Mandatory V0.13 human review must inspect, not merely assert geometry:

- bronze common;
- bronze rare;
- silver common;
- silver rare;
- gold common;
- gold rare;
- TOTW;
- transparent cutout;
- official rectangular portrait;
- silhouette fallback;
- mobile Club;
- desktop Club;
- XI/Draft field card.

If one of these looks visually wrong, V0.13 is not done even if CI is green.

---

## 🎯 PRODUCT RULES ALREADY DECIDED

- Male football only for now; women’s content comes later.
- No Academy mode. The user learns cards by playing.
- There must always be a free progression route: **Basic Packs → duplicates → SBC → better rewards**.
- Draft is free: formation → 11 picks → Round of 16 / QF / SF / Final → modest placement reward.
- SBC/DCP are manually built and currently consume **duplicates only**; the last copy is protected.
- The same footballer cannot appear twice in one SBC squad.
- Chemistry is club / nation / league inspired, maximum 3 per player; team chemistry is 0–100.
- Team score maximum is **199 = 99 OVR + 100 chemistry**.
- Card rarity/material must remain identical in packs, Club, XI, Draft and SBC.
- TOTW Lab and future fictional promos are PackVerse simulated content and must remain clearly separate from official base data.
- A correct silhouette is always preferable to a wrong player, wrong shirt or wrong club image.
- Visual quality is a release requirement: green tests alone do not make a visual release acceptable.

---

## 🔴 CURRENT WEAKNESSES / NEXT WORK

### P0 — Finish asset integrity

V0.13 pins core identity assets, but coverage is not complete. Required direction:

1. canonical player / club / competition IDs;
2. verified player-photo registry for important cards;
3. deterministic badge / competition-logo coverage across the active dataset;
4. runtime external search becomes a development helper, not final authority;
5. exact player + current club for any remote fallback;
6. standardized `officialPortrait`, `cutout`, `silhouette` crop profiles;
7. per-player crop overrides only for real outliers;
8. produce an asset coverage report: photos %, club badges %, league logos %, flags %.

### P0 — Retire historical card ownership

V0.13 is now the final renderer, but old CSS/JS layers still load for compatibility. Gradually move card ownership into one component instead of adding `!important` patches forever. Do not delete old layers until pack/Club/XI/Draft/SBC regression tests prove they are unused.

### P1 — Walkout / pack opening

Normal pulls should stay fast. 85+ suspense target remains `nation → position → club → OVR → card`, roughly 5–11 seconds depending on strength, without cheesy copy/beeps.

### P1 — Player pool

Expand systematically: complete **LALIGA HYPERMOTION**, then LaLiga, Premier League, Bundesliga / Serie A / Ligue 1, then other relevant men’s leagues. Keep enough real bronzes by position for SBC progression.

### P1 — Draft / SBC polish

Draft: generated opponent squads, clearer match/result presentation and tournament progression. SBC: clearer live requirements, filters, groups, repeatable upgrades and promotional/player SBCs.

---

## 🧪 RELEASE / SMOKE RULE — MANDATORY

Every release must pass all three layers.

### 1. Engine / AI smoke

- load runtime files and validate dataset IDs/card metadata;
- pack simulations, odds sanity and item counts;
- no duplicate card inside a normal pack;
- Club special + 84+ filters;
- XI / formations / chemistry / 199 cap;
- Draft Cup curve/rewards;
- SBC duplicate laws and starter feasibility;
- asset-policy regression checks;
- V0.13: all seven rarity materials and both canonical renderers must exist.

### 2. Real browser smoke

Chromium minimum: mobile `390×844` and desktop `1440×900`.

Check JS exceptions, horizontal/vertical overflow, card geometry, photo/name/stats/id-row gaps, Club filters, Draft 11/11 cards and desktop Companion layout. CI stores screenshots in `packverse-browser-smoke`.

### 3. Human smoke

Actually inspect the screenshots. For a card release, review all seven materials plus official portrait, transparent cutout, silhouette, mobile Club, desktop Club and field cards. If screenshots look wrong, fix them before `main`.

---

## 🌿 BRANCH WORKFLOW

1. `main` = stable deployed Pages.
2. `dev` = canonical integration/current project state.
3. Larger changes use `feat/...` or `fix/...` from `dev`.
4. Merge feature work into `dev` first.
5. Run engine + Chromium smoke.
6. Inspect screenshots manually.
7. Update this README after every meaningful improvement.
8. PR `dev → main` only when stable.
9. Confirm Pages and share the live link.

Do **not** make normal product commits directly to `main`.

---

## 🧱 CURRENT STRUCTURE

```text
.
├── index.html
├── js/data.js
├── v4/ ... v11/          # historical/runtime layers
├── v12/
│   ├── assets.js         # strict player-art policy
│   ├── content.js        # V0.12 content + bronze progression
│   ├── game.js           # Club, packs, Draft Cup, V0.12 flows
│   ├── portraits.css     # source-specific portrait normalization
│   ├── runtime.js        # deterministic/testable helpers
│   └── styles.css
├── v13/
│   ├── assets.js         # deterministic core identity registry
│   ├── card-ui.js        # canonical Card + FieldCard renderer
│   └── cards.css         # seven rarity materials + responsive geometry
├── scripts/
│   ├── validate-v4.mjs
│   ├── smoke-v12.mjs
│   ├── smoke-v13.mjs
│   └── browser-smoke-v12.mjs
├── .github/workflows/
├── manifest.json
└── sw.js
```

Long-term direction: keep vanilla JS/PWA for now, but move toward explicit `data/`, `core/`, `components/` and `features/` ownership rather than indefinite versioned overrides.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

1. Open this README on `dev` first.
2. Inspect `main` and `dev` HEADs plus open PRs.
3. Read **CURRENT PROJECT STATE**, **V0.13 QA status** and **CURRENT WEAKNESSES**.
4. Never assume an old V0.x feature branch is production.
5. Continue from `dev` unless an active feature branch is explicitly named here.
6. Run mandatory smoke before moving anything to `main`.
7. Update this README after the next meaningful improvement.

**This README is the canonical handoff for PackVerse.**
