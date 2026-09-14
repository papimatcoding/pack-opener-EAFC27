# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.14 Player Integrity + Real Pool Audit — LIVE`  
**Production commit:** `80498752833a0c30d841c56b15f9607c692d334e`  
**Release PR:** `#25`  
**Production deploy:** GitHub Pages run `#21` — SUCCESS  
**Final pre-release validation:** run `#39` — SUCCESS  
**Next target:** `deterministic club/league badge coverage + league-by-league current-roster audit`  

### Branch truth

V0.14 is merged to `main` and deployed successfully. `dev` contains the same product state plus this handoff update. Finished V0.14 work was PR #21 (integrity + transfers + pool), #22 (current CE Sabadell depth), #23 (browser-smoke hardening), #24 (handoff) and #25 (production release). Future work starts from `dev`.

---

## 🛡️ V0.14 PLAYER-ART LAW — DO NOT REGRESS THIS

The user prefers a silhouette over a wrong player, old shirt, bad crop or rectangular web photo.

> **Show a player image only if it is a transparent football cutout for the exact player AND their current club. Otherwise show the neutral silhouette.**

Implementation rules:

- only `strCutout` is accepted from runtime fallback;
- `strThumb`, `strRender`, generic portraits and rectangular internet photos are forbidden;
- cached art is valid only while its metadata still matches the player's current club;
- a transfer automatically invalidates stale cached player art;
- the V0.14 migration clears all old player-photo caches;
- legacy V11/V12 official/rectangular portrait hydration is disabled;
- old rectangular CE Sabadell internet photos cannot reappear;
- missing cutout = intentional silhouette, not a visual failure.

`v14/assets.js` owns this policy and exposes `PV.assetCoverage()` / `PV14_ASSET_AUDIT`.

---

## 🔄 CURRENT-CLUB AUDIT COMPLETED IN V0.14

Explicit 2026 summer corrections include:

- Karim Adeyemi → FC Barcelona;
- João Cancelo → FC Barcelona;
- Rodri → FC Barcelona;
- Anthony Gordon → FC Barcelona;
- Gabriel Jesus → FC Barcelona;
- Ferran Torres → PSG;
- Marc Casadó → Deportivo de La Coruña;
- Héctor Fort → Real Sociedad.

V0.14 also adds/updates real 2026/27 FC Barcelona depth including Joan García, Szczęsny, Livaković, Balde, Koundé, Christensen, Eric García, Gerard Martín, Gavi, Fermín López, Dani Olmo, Marc Bernal, Roony Bardghji and younger real squad players.

This is **not** a claim that every base player has been manually current-club-verified. Future work must continue league-by-league with current reliable sources. Never assume an old club assignment is still current.

---

## 🔵 CE SABADELL 2026/27 AUDIT

The current CE Sabadell first team was cross-checked and expanded as useful bronze/silver SBC depth. Real current identities added/updated include Diego Fuoli, Nil Ruiz, Genar Fornés, Carlos Garcia, Arthur Bonaldo, Ton Ripoll, David Astals, Jan Molina, Jordi Ortega, Urri, Quadri Liameed, Rodrigo Escudero, Rubén Martínez, Alan Godoy, Javi López-Pinto and Joel Priego, alongside current existing records such as José Ortega, Carlos Alemán, Kaiser, Eneko Aguilar, Miguelete and Agustín Coscia.

Being a verified current Sabadell player does **not** grant a rectangular web photo. If no exact current-Sabadell transparent cutout exists, the card must remain a silhouette.

---

## 📦 V0.14 PLAYER POOL / SBC DEPTH

Final release dataset:

- **302 total cards**;
- **291 base players**;
- **49 bronze**;
- **109 silver**;
- **133 gold**;
- **11 special/TOTW**;
- **36 CE Sabadell cards** after reconciliation of existing + current additions.

Extra real-player depth includes players such as Mikel Oyarzabal, Martín Zubimendi, Moisés Caicedo, Alexander Isak, Morgan Rogers, Jarrad Branthwaite, Milos Kerkez, Ethan Nwaneri, Kobbie Mainoo, Jorrel Hato, Lewis Miley and Archie Gray.

Ratings/stats are **PackVerse launch estimates**. Do not present them as official EA ratings.

---

## 📊 ASSET COVERAGE AUDIT — CURRENT HONEST STATE

Every validation run now writes `.smoke-artifacts/asset-coverage-v14.json`.

Current clean-build snapshot:

- static/rectangular player portraits: **0 intentionally**;
- verified player cutouts at clean build: **0 intentionally** — they are admitted at runtime only after exact player + current-club verification;
- deterministic club badges: **21 / 60 (~35%)**;
- deterministic competition logos: **7 / 14 (50%)**.

This is now the clearest P0: **finish deterministic club and competition identity coverage**, starting with LALIGA HYPERMOTION. Do not weaken the player-photo law to inflate coverage numbers.

---

## 🎨 V0.13 CARD SYSTEM — VISUAL BASELINE

V0.13 remains the canonical renderer under V0.14:

- `v13/card-ui.js` owns full Card + compact FieldCard rendering;
- seven materials: bronze common/rare, silver common/rare, gold common/rare, TOTW;
- OVR/position → art → name → six horizontal stats → nation / competition / club;
- two readable Club cards per row on phone;
- rarity/material identity is preserved in packs, Club, XI, Draft and SBC;
- TOTW remains black/gold.

V0.14 changes data and asset integrity, not the successful V0.13 card geometry.

---

## 🎯 PRODUCT RULES ALREADY DECIDED

- Male football only for now; women’s content comes later.
- No Academy mode.
- Always keep a free route: **Basic Packs → duplicates → SBC → better rewards**.
- Draft is free: formation → 11 picks → R16 / QF / SF / Final → modest placement reward.
- SBC/DCP currently consume duplicates only; the last copy is protected.
- Same footballer cannot appear twice in one SBC squad.
- Chemistry is club / nation / league inspired, max 3 per player; team chemistry is 0–100.
- Team score max is **199 = 99 OVR + 100 chemistry**.
- Card rarity/material must remain identical in packs, Club, XI, Draft and SBC.
- TOTW Lab/future fictional promos are simulated PackVerse content, separate from official base data.
- **Correct silhouette > wrong player / wrong shirt / wrong club / badly cropped portrait.**
- Visual quality and data integrity are release requirements.

---

## 🔴 NEXT WORK, IN PRIORITY ORDER

### P0 — Deterministic club / competition assets

Coverage is only 21/60 clubs and 7/14 competitions at clean build. Complete LALIGA HYPERMOTION first, then LaLiga / Premier League / Bundesliga / Serie A / Ligue 1. Every unresolved badge must keep a readable local fallback.

### P0 — Systematic current-roster audit

Audit players league-by-league with current reliable sources. Any transfer correction must update club + league and invalidate stale player art. Add regression assertions for high-profile transfers.

### P1 — Expand real pool further

302 cards is healthier but still small for a long-term pack opener. Expand with **real players** in balanced bronze/silver/gold bands and enough positional coverage for SBCs. Prefer completing real squads/leagues over random isolated names.

### P1 — Retire historical runtime ownership

V0.13/V0.14 are canonical for cards/assets, but old `v4 → v12` layers still load for compatibility. Gradually prove and remove obsolete ownership instead of piling on overrides.

### P1 — Walkout / Draft / SBC polish

Keep normal pulls fast. 85+ suspense remains `nation → position → club → OVR → card`. Draft later needs clearer generated opponents/results. SBC needs clearer live requirements, filters/groups and repeatable upgrades.

---

## 🧪 RELEASE / SMOKE RULE — MANDATORY

Every release must pass:

1. `scripts/validate-v4.mjs`
2. `scripts/smoke-v12.mjs`
3. `scripts/smoke-v13.mjs`
4. `scripts/smoke-v14.mjs`
5. `scripts/report-assets-v14.mjs`
6. Chromium mobile `390×844` + desktop `1440×900`
7. Draft 11/11 field-card smoke
8. seven-rarity browser matrix
9. human screenshot review

V0.14 smoke specifically checks transfer corrections, Barça/Sabadell identities, bronze/silver/gold depth, cutout-only art, no `strThumb`/`strRender`, current-club-tied caches and silhouette-first behavior.

Browser launchers have a longer CDP startup window and one retry because run #36 exposed a runner startup flake before the page loaded. Run #37 and release run #39 passed afterward.

Human review for asset work must look for old-team shirts, rectangular portraits, stale transfer photos, broken identity slots and clean silhouettes.

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
├── v4/ ... v11/              # historical/runtime compatibility
├── v12/                      # stabilized systems
├── v13/                      # canonical card visuals
├── v14/
│   ├── content.js            # current-club corrections + real pool
│   └── assets.js             # exact-current-club cutout-only art law
├── scripts/
│   ├── validate-v4.mjs
│   ├── smoke-v12.mjs
│   ├── smoke-v13.mjs
│   ├── smoke-v14.mjs
│   ├── report-assets-v14.mjs
│   ├── browser-smoke-v12.mjs
│   └── browser-card-matrix-v13.mjs
├── .github/workflows/
├── manifest.json
└── sw.js
```

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

1. Open this README on `dev` first.
2. Inspect `main` and `dev` HEADs plus open PRs.
3. Read **V0.14 PLAYER-ART LAW**, **ASSET COVERAGE AUDIT** and **NEXT WORK** before touching cards/assets.
4. Never re-enable rectangular internet player photos merely to increase coverage.
5. Continue from `dev`.
6. Run mandatory V0.14 integrity + browser smoke before production.
7. Update this README after the next meaningful improvement.

**This README is the canonical handoff for PackVerse.**
