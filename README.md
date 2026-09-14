# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.15 Visual Cards + Player Cutout Recovery — LIVE`  
**V0.16 release candidate:** `Current-Shirt Art + IF Reuse + Identity Coverage — DEV QA PASSED`  
**V0.16 final QA dev commit:** `3e7ba7b1c49b447c0313492349f626c3c54cf5b4`  
**V0.16 full validation:** run #46 (`34829818936`) — **SUCCESS**  
**Next target after release:** expand verified current-shirt cutouts team-by-team and close remaining deterministic club/league asset gaps  

### Branch truth

V0.16 is complete and QA-passed on `dev`; `main` remains V0.15 until the release PR is merged. V0.16 was not accepted on the first green-looking attempt: the full audit found and fixed three separate issues before release — a historical V0.15 cache assertion that blocked legitimate later versions, five special-only IF cards without a reusable base card, and responsive rerenders that could lose the final V0.16 cutout geometry. Run #46 passed only after all three were resolved.

---

## 🎨 V0.16 CARD ASSET RULES

Visual priority is now explicit:

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

Provider metadata alone is not enough for high-risk recent transfers because a player's team can update before the provider cutout does. Those players are guarded: if a current-shirt transparent image is not verified, the game deliberately shows a silhouette.

### Livaković regression — fixed and visually verified

Dominik Livaković is an FC Barcelona player in the current dataset. V0.16 pins a verified current Barça transparent cutout and purges stale/provider artwork for him. A dedicated real-Chromium test fails if his rendered URL stops being the FC Barcelona official asset, contains `Girona`, loses `object-fit: contain`, or his club stops being Barcelona.

Human review of the final mobile screenshot confirmed Livaković in the current orange Barça goalkeeper shirt, correctly cut out inside the card, with Barça crest and league identity visible and no circular plate behind either icon.

### Verified current FC Barcelona cutout registry

V0.16 currently pins eight high-confidence current transparent Barça assets:

- Dominik Livaković;
- Joan García;
- Karim Adeyemi;
- Anthony Gordon;
- Gabriel Jesus;
- Xavi Espart;
- Rodri;
- João Cancelo.

This registry is intentionally conservative. Do not add generic portraits or old-shirt images merely to increase coverage.

---

## ⚫ IF / TOTW ARTWORK — 11/11 BASE-CARD REUSE

Every current IF/TOTW card now resolves to a normal base card. The special inherits the base card's current club, league, nation/search identity and uses **the exact same resolved player-image URL**. If the normal card is a silhouette, the IF is also a silhouette; no duplicate independent photo search exists.

Five historical special-only identities were given real-player base versions so this rule can be complete rather than partial: Roberto Fernández, Yassir Zabiri, Zian Flemming, Igor Jesus and Leif Davis. Their ratings/stats are PackVerse launch estimates. Current-club metadata was reconciled where needed, including Yassir Zabiri → Racing Santander and Zian Flemming → Ipswich Town.

Final machine audit: **11 / 11 special cards bound to a base card**.

---

## 🪪 CLUB / LEAGUE IDENTITY COVERAGE

V0.15 removed the circular fallback discs; V0.16 expands actual asset discovery instead of decorating missing assets.

- all visible club/league slots are eligible for hydration;
- broader club aliases cover common current naming differences;
- league resolvers cover 11 of the 14 league families currently represented in the dataset: LaLiga, LALIGA HYPERMOTION, Premier League, Bundesliga, Serie A, Ligue 1, Liga Portugal, Süper Lig, MLS, Scottish Premiership and Belgian Pro League;
- a successfully loaded crest/logo suppresses fallback initials completely;
- unresolved assets remain understated plain text — never a circle, pill or fake badge background;
- mobile and desktop Chromium audits verify real identity slots have `border-radius: 0`, transparent background and no background image.

This is **not** a claim of 100% icon coverage. The remaining club/competition gaps are the next P0.

---

## 🛡️ PLAYER-ART LAW — DO NOT REGRESS

- ordinary provider art requires exact player + exact current club + transparent cutout;
- recent-transfer players can require manual current-shirt verification;
- `strThumb`, `strRender`, generic rectangular portraits and web-photo crops are forbidden;
- cached art is club-aware and policy-versioned;
- CE Sabadell players without a correct transparent current-team cutout stay silhouettes;
- every IF reuses its base-card art;
- missing image is preferable to incorrect image.

---

## 📦 CURRENT PLAYER POOL AFTER V0.16

Machine-readable clean-build report:

- **307 total cards**;
- **296 base-player cards**;
- **11 special/TOTW cards**;
- **64 clubs** represented;
- **14 leagues** represented;
- **8 manually verified official current Barça cutouts**;
- **11 league resolver specs**;
- **11 / 11 IF cards bound to base cards**.

The five added normal cards exist primarily to remove special-only identity debt and make IF image reuse correct. Ratings/stats remain PackVerse estimates, not official EA ratings.

---

## ✅ FINAL V0.16 ANALYSIS / QA SNAPSHOT

Final dev run #46 passed every layer:

- legacy regression checks;
- V0.12 systems regression;
- V0.13 seven-material canonical card audit;
- V0.14 player-integrity/pool audit;
- V0.15 visual asset guarantees;
- V0.16 current-shirt + IF/base static audit;
- V0.14 and V0.16 machine-readable asset reports;
- real Chromium mobile + desktop Companion smoke;
- Draft field smoke;
- seven-rarity browser card matrix;
- dedicated V0.16 current-shirt / identity-slot / IF-reuse browser audit;
- browser artifact upload.

### Human screenshot review performed after run #46

Reviewed `mobile-visual-audit-v16.png`, `mobile-livakovic-v16.png`, `desktop-visual-audit-v16.png`, normal mobile/desktop Club and Draft screenshots.

Observed final state:

- Livaković clearly renders the current orange FC Barcelona goalkeeper cutout; no Girona shirt remains;
- Rodri, Joan García, Anthony Gordon, Gabriel Jesus, João Cancelo, Adeyemi and Xavi Espart render as clean transparent current Barça cutouts in the curated audit;
- club and league icons no longer sit on circular plates;
- player cutouts remain inside the portrait zone and do not collide with name/stats;
- the same cutout geometry survives mobile → desktop responsive rerenders;
- Mbappé IF and base use the same resolved player image;
- deliberate silhouettes remain visually clean where no safe cutout exists;
- Draft still fits 11/11 cards with readable field geometry;
- no regression was observed in gold/silver/bronze/TOTW card material hierarchy.

V0.16 is therefore cleared for a `dev → main` production release.

---

## 🧱 CARD VISUAL STACK

- `v13/card-ui.js` — canonical full Card + FieldCard renderer;
- `v13/cards.css` — seven material families and core composition;
- `v15/visuals.css` — clean identity slots and provider-cutout visual layer;
- `v16/visuals.css` — final verified-cutout geometry and identity spacing;
- `v16/content.js` — complete IF/base identity binding and base versions for historical special-only cards;
- `v16/assets.js` — official current-cutout registry, recent-transfer stale-shirt guard, IF/base art reuse and broader club/league hydration.

Do not introduce another competing card renderer.

---

## 🔴 NEXT WORK AFTER V0.16

### P0 — Verified player-art coverage

Expand current-shirt transparent assets team-by-team. Prioritise high-OVR/high-frequency pack cards first, then complete coherent league/club groups. Maintain a measurable list of PNG / silhouette / stale-blocked status.

### P0 — Deterministic club / competition identity

Close remaining club and competition logo gaps, especially LALIGA HYPERMOTION and clubs heavily represented in SBC fodder. Prefer a correct flat text fallback over a wrong crest.

### P1 — Current-roster audit

Continue league-by-league transfer verification; any club move must invalidate stale art.

### P1 — Card presentation polish

After integrity, continue per-player crop overrides, small-screen typography/spacing and rarity-specific frame/material detailing.

---

## 🧪 RELEASE RULE — MANDATORY

Every visual release must pass engine/static, real Chromium and human screenshot review. V0.16 adds `scripts/smoke-v16.mjs`, `scripts/report-assets-v16.mjs` and `scripts/browser-visual-audit-v16.mjs`. Do not call an update stable from green unit checks alone.

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

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

1. Open this README on `dev` first.
2. Inspect `main`, `dev`, open PRs and the newest validation run.
3. Preserve current-shirt/silhouette law, recent-transfer guard and 11/11 IF/base reuse.
4. Do not trust provider team metadata alone for recent-transfer artwork.
5. Review browser screenshots before accepting card work.
6. Update this README after every meaningful visual/asset change.

**This README is the canonical handoff for PackVerse.**
