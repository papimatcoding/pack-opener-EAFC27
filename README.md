# PackVerse 27

Mobile-first football card-collection PWA inspired by the game loop of Ultimate Team / MADFUT: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.12 Stabilized`  
**Next update target:** `player photos + club/competition assets`  

### Branch truth

`main` is the stable branch deployed to GitHub Pages. **V0.12 Stabilization is now merged and live** through PR `#11`.

`dev` is the canonical integration branch for future work. New product changes should land on `dev` first, pass QA there, and only then move to `main`.

The old branch `v0.12-madfut-draft-smoke` and closed PR `#10` are historical/source work only. Do not merge them. Their useful pieces were selectively reconciled into `dev` before V0.12 Stabilization was merged.

### What V0.12 Stabilized contains

- full V0.12 content layer and deeper real male bronze pool;
- explicit Club `All / Specials / 84+ / Gold / Silver / Bronze` filters;
- free Basic Pack progression;
- slower 85+ walkout implementation;
- Draft Cup flow with four knockout rounds;
- manual SBC systems and existing duplicate-only rules;
- strict player-photo resolver: official first, otherwise exact player + current club + football cutout only;
- separate portrait treatment for official rectangular photos vs transparent cutouts;
- V0.12 card / Draft / Club styles;
- Node integration smoke;
- real Chromium smoke at mobile + desktop Companion sizes;
- screenshots generated on CI for mandatory human review.

### Latest QA snapshot

Automated smoke passed on 2026-09-14:

- **262 cards** loaded;
- **39 bronze cards**;
- Basic Pack simulated hundreds of times with **~81.7% bronze**;
- all advertised pack item counts validated;
- no duplicate card inside a normal reward pack;
- Club `Specials` and `84+` visibility validated;
- six formations / chemistry / `/199` limits validated;
- Draft Cup curve + rewards validated;
- bronze duplicate bank + starter SBC feasibility validated;
- Chromium mobile `390×844` passed;
- Chromium desktop `1440×900` passed;
- Draft rendered **11/11** cards without vertical overflow;
- card geometry showed positive gaps between photo → name → stats → identity row;
- no browser runtime exceptions.

### Latest human smoke

Screenshots from the Chromium run were manually reviewed.

Good:

- mobile shell is stable and readable;
- desktop Companion layout is stable and uses the width correctly;
- Draft field no longer has the original broken mini-card layout;
- rarity/material is preserved on field cards;
- Club filters render correctly;
- no obvious photo/name/stat overlap in the smoke fixtures.

Still weak / next target:

- **player art and identity assets are the weakest user-facing area**;
- too many silhouettes for important players;
- some available photos still have inconsistent crop / scale;
- club badges and competition logos need deterministic verified coverage instead of runtime guesswork;
- card identity row is still visually less polished than the rest of the app.

**NEXT UPDATE SHOULD ATTACK ASSETS / PLAYER PHOTOS FIRST. Do not add a new game mode before this improves.**

---

## 🎯 PRODUCT RULES ALREADY DECIDED

- Male football only for now; women’s content comes later.
- No Academy mode. The user learns cards by playing.
- There must always be a free progression route: **Basic Packs → duplicates → SBC → better rewards**.
- Draft is free.
- Draft target loop: formation → 11 picks → Round of 16 / QF / SF / Final → modest placement-based reward.
- SBC/DCP are manually built and currently consume **duplicates only**.
- The last copy of a card is protected.
- The same footballer cannot appear twice in one SBC squad, even if the club owns many copies.
- Chemistry is inspired by modern FUT: club / nation / league, maximum 3 chemistry per player.
- Team chemistry is normalized to **0–100**.
- Team score maximum is **199 = 99 OVR + 100 chemistry**.
- Card rarity/material must remain identical in Club, XI, Draft and SBC.
- TOTW Lab and future fictional promos are PackVerse simulated content, clearly separated from official base data.
- High-rated repeat TOTW cards normally receive restrained OVR growth; low-rated first IFs may jump more.
- A correct silhouette is always preferable to a wrong player shirt / wrong identity image.

---

## 🔴 CURRENT WEAKNESSES, IN PRIORITY ORDER

### P0 — Player photos / asset integrity

Goal: every visible identity asset is either **verified and correct** or intentionally neutral.

Required direction:

1. canonical player / club / competition IDs;
2. verified player photo table;
3. verified badge / competition-logo table;
4. external search becomes a development helper, not the final authority shown to users;
5. exact player + current club for any remote fallback;
6. no `strThumb`-style inconsistent generic portraits;
7. standardized crop profiles: `officialPortrait`, `cutout`, `silhouette`;
8. optional per-player crop override only for true outliers;
9. asset coverage report: photos %, badges %, league logos %, flags %.

### P0 — Canonical card component

The app still contains historical CSS/JS layers from `v4` through `v12`. That was useful for speed but creates visual regressions.

Target after the asset pass:

- one canonical full `Card` geometry;
- one canonical `FieldCard` geometry;
- one source of truth for rarity materials;
- fixed zones for OVR/position, player art, name, six stats, nation, competition and club;
- identical rarity in packs / Club / XI / Draft / SBC;
- gradually retire old overrides instead of adding endless new patch layers.

### P1 — Walkout / pack opening

Normal pulls should remain fast but still have a short physical pack animation.

85+ should use deliberate suspense:

`nation → position → club → OVR → card`

Target feel:

- 85–86: ~5–6s;
- 87–89: ~6.5–8s;
- 90+: ~8–10s;
- strong special: ~9–11s;
- skip locked for the opening section;
- no cheesy copy / beeps / unnecessary text.

### P1 — Player pool

Expand systematically, not randomly:

1. complete **LALIGA HYPERMOTION** properly;
2. complete LaLiga;
3. Premier League;
4. Bundesliga / Serie A / Ligue 1;
5. other relevant men’s leagues.

Enough real bronzes by position must always exist for bronze SBC progression.

### P1 — Draft polish

The V0.12 mechanics exist. Future polish should show generated opponent squads, match score/result presentation and clearer tournament progression without inflating rewards.

### P1 — SBC polish

Manual builder is the core. Future improvements: clearer live requirements, filters, groups, repeatable upgrades and player/promotional SBCs.

---

## 🧪 RELEASE / SMOKE RULE — MANDATORY

No version is considered finished because it “compiles”.

Every release must pass:

### 1. AI / engine smoke

- load all runtime files;
- dataset IDs / card metadata;
- pack simulations and odds sanity;
- no same card twice inside a normal pack;
- Club filters including special + 84+;
- XI / formations / chemistry / 199 cap;
- Draft Cup opponent curve and realistic rewards;
- SBC duplicate rules and starter-SBC feasibility;
- asset-policy regression checks.

### 2. Real browser smoke

Run Chromium on at least:

- mobile `390×844`;
- desktop `1440×900`.

Check:

- JS runtime exceptions;
- horizontal/vertical overflow;
- card bounding boxes;
- photo/name/stats/id-row overlap;
- Club special / 84+ UI;
- Draft 11/11 field cards;
- desktop sidebar / Companion layout.

CI stores screenshots as `packverse-browser-smoke` workflow artifacts.

### 3. Human smoke

The screenshots must actually be inspected. Review at minimum:

- bronze common / bronze rare;
- silver common / silver rare;
- gold common / gold rare;
- TOTW;
- verified portrait;
- transparent cutout;
- silhouette fallback;
- mobile Club;
- desktop Club;
- Draft field;
- any visually changed screen in the release.

If a screenshot looks wrong, green tests are not enough.

---

## 🌿 BRANCH WORKFLOW

Use this unless there is a specific reason not to:

1. `main` = stable, deployed Pages.
2. `dev` = integration branch and current project state.
3. Larger changes may use `feat/...` or `fix/...` branches from `dev`.
4. Merge work into `dev` first.
5. Run AI + Chromium + human smoke.
6. Update this README handoff.
7. PR `dev → main` only when the update is considered stable.
8. Confirm Pages after merge and share the live link.

Do **not** make direct product commits to `main` during normal development.

---

## 🧱 CURRENT STRUCTURE

```text
.
├── index.html
├── js/data.js
├── v4/ ... v11/          # historical/runtime layers
├── v12/
│   ├── assets.js         # strict player art policy
│   ├── content.js        # V0.12 content + bronze progression
│   ├── game.js           # Club, packs, Draft Cup, V0.12 flows
│   ├── portraits.css     # portrait/cutout normalization
│   ├── runtime.js        # deterministic/testable runtime helpers
│   └── styles.css        # V0.12 visual layer
├── scripts/
│   ├── validate-v4.mjs
│   ├── smoke-v12.mjs
│   └── browser-smoke-v12.mjs
├── .github/workflows/
├── manifest.json
└── sw.js
```

Long-term technical direction: keep vanilla JS/PWA for now, but move toward clear `data/`, `core/`, `components/` and `features/` ownership instead of indefinitely adding versioned override layers.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

If context is lost, do this before making changes:

1. open this README on `dev`;
2. inspect `main` and `dev` HEADs;
3. inspect open PRs;
4. read the **CURRENT PROJECT STATE** and **NEXT UPDATE** above;
5. do not assume an old V0.x branch is production;
6. make changes from `dev`;
7. run the mandatory smoke before merging anything to `main`.

This README is the canonical handoff for PackVerse.
