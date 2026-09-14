# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.15 Visual Cards + Player Cutout Recovery — LIVE`  
**Production commit:** `1505f4f0dbe9b990a3b5e0e689a9d21d3205dcc9`  
**V0.16 candidate:** `Current-Shirt Art + IF Reuse + Identity Coverage`  
**V0.16 status:** implementation complete on feature branch; full dev CI + human screenshot review required before production  
**Next target after V0.16:** expand manually verified current-shirt cutout registry league-by-league and close remaining badge/logo gaps  

### Branch truth

V0.15 is the current production baseline. V0.16 is a visual/asset integrity pass and must not be treated as released until it has been merged to `dev`, passed the complete engine + Chromium suite, had its screenshots manually inspected, and then passed the production release PR.

---

## 🎨 V0.16 CARD ASSET RULES

The visual priority remains:

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

V0.16 adds an extra protection for recent transfers because provider metadata can update a player's team before the provider image itself changes. High-risk recent transfers are therefore blocked from provider artwork unless a current-shirt cutout has been manually verified.

### Livaković regression

Dominik Livaković is stored as an FC Barcelona player in the dataset. V0.16 pins a manually verified current FC Barcelona transparent player asset and purges stale cached/provider artwork for him. A Girona-shirt image is now considered an explicit regression and is checked by both static and real-browser QA.

### Current FC Barcelona cutout registry

V0.16 introduces a small high-confidence registry of current official transparent FC Barcelona player assets for recently transferred/current players where stale provider art was especially likely. The registry currently covers:

- Dominik Livaković;
- Joan García;
- Karim Adeyemi;
- Anthony Gordon;
- Gabriel Jesus;
- Xavi Espart;
- Rodri;
- João Cancelo.

Do not turn this registry into a collection of generic portraits. Entries must remain transparent/current-shirt assets.

### IF / TOTW artwork rule

IF/TOTW cards no longer need their own player-image search. When a special card has a corresponding base card, V0.16 syncs its current club, league, nation and search identity to that base card and reuses **exactly the same resolved player image URL**. This avoids duplicate asset debt and prevents an IF from showing a different or older shirt than its normal card.

---

## 🪪 CLUB / LEAGUE IDENTITY COVERAGE

V0.15 removed the circular fallback discs. V0.16 keeps that law and expands actual asset discovery instead of decorating missing assets.

- all visible club/league slots are now eligible for hydration rather than only the small historical first-page slice;
- club lookup has a broader current alias set;
- league lookup covers LaLiga, LALIGA HYPERMOTION, Premier League, Bundesliga, Serie A, Ligue 1, Liga Portugal, Süper Lig, MLS, Scottish Premiership and Belgian Pro League where the provider exposes a valid football identity asset;
- a successful crest/logo suppresses fallback initials completely;
- an unresolved identity stays quiet plain text — **never a fake circle/pill/badge background**.

This is still not a claim of 100% deterministic icon coverage. The remaining gaps should be filled systematically rather than with wrong logos.

---

## 🛡️ PLAYER-ART LAW — DO NOT REGRESS

- exact player + exact current club remains mandatory for ordinary provider cutouts;
- recent-transfer players can be stricter: manually verified current-shirt cutout or silhouette;
- `strThumb`, `strRender`, generic rectangular portraits and web-photo crops remain forbidden;
- cached player art is club-aware and policy-versioned;
- CE Sabadell players without a correct transparent current-team cutout remain silhouettes;
- special cards reuse their base-card art;
- missing image is preferable to an incorrect image.

---

## 📦 CURRENT PLAYER POOL

V0.16 does not reduce the V0.14/V0.15 real-player pool baseline:

- **302 total cards**;
- **291 base players**;
- **49 bronze**;
- **109 silver**;
- **133 gold**;
- **11 special/TOTW**.

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## 🧱 CARD VISUAL STACK

- `v13/card-ui.js` remains the canonical full Card + FieldCard renderer;
- `v13/cards.css` owns the seven material families;
- `v15/visuals.css` removes identity discs and cleans visual layering;
- `v16/visuals.css` refines current cutout scale and identity spacing;
- `v16/content.js` binds special cards to their base-card identity;
- `v16/assets.js` owns the recent-transfer guard, verified current-shirt registry, IF/base art reuse and expanded club/league hydration.

Do not reintroduce independent competing card renderers.

---

## 🧪 V0.16 RELEASE / ANALYSIS RULE — MANDATORY

The user explicitly requires a complete analysis before an update is called good. V0.16 therefore must pass all previous regression layers plus its own dedicated checks.

### Engine/static

Run:

1. `scripts/validate-v4.mjs`
2. `scripts/smoke-v12.mjs`
3. `scripts/smoke-v13.mjs`
4. `scripts/smoke-v14.mjs`
5. `scripts/smoke-v15.mjs`
6. `scripts/smoke-v16.mjs`
7. `scripts/report-assets-v14.mjs`

V0.16 static smoke explicitly asserts Livaković is pinned to FC Barcelona official artwork, no Girona regression is encoded, recent-transfer guarding exists, IF/base sharing exists, unsafe portrait sources are still banned, major league resolvers exist and no circular identity UI can return.

### Real Chromium

Run all existing browser smoke plus `scripts/browser-visual-audit-v16.mjs` at mobile and desktop sizes. The dedicated V0.16 browser audit seeds a curated FC Barcelona card group and verifies:

- Livaković's card is FC Barcelona and renders the current official Barça cutout;
- the rendered URL does not contain Girona;
- current cutouts use the V0.16 art profile;
- identity slots with real images do not regain circular backgrounds;
- a special/base pair reuses the same artwork when a matching IF exists;
- screenshots are saved as `mobile-visual-audit-v16.png` and `desktop-visual-audit-v16.png`.

### Human visual review

Before `main`, manually inspect:

- V0.16 curated mobile screenshot;
- V0.16 curated desktop screenshot;
- normal Club mobile + desktop smoke;
- Draft XI field cards;
- seven-rarity matrix;
- Livaković shirt/current-team appearance;
- badge/league-logo scale and missing-asset fallbacks;
- player cutout crop/scale;
- IF/base image consistency.

**Green CI alone is not enough.**

---

## 🔴 NEXT WORK AFTER V0.16

### P0 — Verified player-art coverage

Expand current-shirt transparent assets team-by-team, prioritising cards users actually see often. Do not accept stale provider images merely to raise coverage.

### P0 — Deterministic club / competition identity

Keep filling remaining club and league assets, especially LALIGA HYPERMOTION and any teams represented heavily in the SBC pool.

### P1 — Current-roster audit

Continue league-by-league transfer verification. Any player moved between clubs must invalidate stale art.

### P1 — Card material/presentation polish

Continue spacing, crop overrides and rarity-specific detailing only after asset integrity is maintained.

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

---

## 🧱 CURRENT STRUCTURE

```text
.
├── index.html
├── js/data.js
├── v4/ ... v12/               # historical/runtime compatibility
├── v13/                       # canonical card visual renderer/materials
├── v14/                       # player integrity + real pool
├── v15/                       # clean identity slots + improved provider matching
├── v16/
│   ├── content.js             # IF/base current identity binding
│   ├── assets.js              # current-shirt registry + transfer guard + coverage
│   └── visuals.css            # final V0.16 visual refinements
├── scripts/
│   ├── validate-v4.mjs
│   ├── smoke-v12.mjs
│   ├── smoke-v13.mjs
│   ├── smoke-v14.mjs
│   ├── smoke-v15.mjs
│   ├── smoke-v16.mjs
│   ├── browser-smoke-v12.mjs
│   ├── browser-card-matrix-v13.mjs
│   └── browser-visual-audit-v16.mjs
├── .github/workflows/
├── manifest.json
└── sw.js
```

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

1. Open this README on `dev` first.
2. Check `main`, `dev`, open PRs and the latest validation run.
3. Preserve the current-shirt/silhouette law and IF/base art reuse.
4. Do not trust provider team metadata alone for recent-transfer artwork.
5. Review screenshots before calling card visuals stable.
6. Update this README after every meaningful visual/asset change.

**This README is the canonical handoff for PackVerse.**
