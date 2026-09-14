# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, collection, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.13 Canonical Card Visual System — LIVE`  
**Dev release candidate:** `V0.14 Player Integrity + Real Pool Audit — QA PASSED`  
**Dev head at final QA:** `6ec259e9bc61531dcf7ed910914de95943f02a58`  
**Next target after release:** `deterministic club/league badge coverage + league-by-league current-roster audit`  

### Branch truth

`main` is still V0.13 until the V0.14 release PR is merged. `dev` contains the complete V0.14 integrity pass: PR #21 (current-club corrections + strict player-art policy + pool expansion), PR #22 (verified CE Sabadell 2026/27 roster depth) and PR #23 (Chromium smoke startup hardening). Continue future product work from `dev`, not those finished feature branches.

V0.14 final dev CI is **run #37 — SUCCESS**. It passed engine regression, V0.14 integrity assertions, machine-readable asset coverage reporting, real Chromium mobile/desktop smoke, Draft 11/11 and the seven-rarity browser card matrix.

---

## 🛡️ V0.14 PLAYER-ART LAW — DO NOT REGRESS THIS

The user explicitly prefers a silhouette over a wrong or badly cropped photo. V0.14 therefore changes player art from “best effort” to a strict integrity rule:

> **A player image is shown only when it is a transparent football cutout for the exact player AND their current club. Otherwise show the neutral silhouette.**

Consequences:

- only `strCutout` is accepted from the runtime fallback;
- `strThumb`, `strRender`, generic portraits and rectangular internet photos are forbidden;
- cached art is valid only while metadata still matches the player's current club;
- changing club invalidates the cached cutout automatically;
- the V0.14 migration clears all previous player-photo caches;
- legacy V11/V12 “official portrait” hydration is disabled completely;
- therefore old rectangular CE Sabadell internet photos cannot reappear;
- a missing PNG/cutout is an intentional **silhouette**, not an asset failure.

`v14/assets.js` owns this policy and exposes `PV.assetCoverage()` / `PV14_ASSET_AUDIT`.

---

## 🔄 CURRENT-CLUB AUDIT COMPLETED IN V0.14

The dataset had become stale after the 2026 summer market. V0.14 explicitly corrects current-club records including:

- Karim Adeyemi → FC Barcelona;
- João Cancelo → FC Barcelona;
- Rodri → FC Barcelona;
- Anthony Gordon → FC Barcelona;
- Gabriel Jesus → FC Barcelona;
- Ferran Torres → PSG;
- Marc Casadó → Deportivo de La Coruña;
- Héctor Fort → Real Sociedad.

It also adds/updates real 2026/27 FC Barcelona squad depth such as Joan García, Szczęsny, Livaković, Balde, Koundé, Christensen, Eric García, Gerard Martín, Gavi, Fermín, Dani Olmo, Marc Bernal, Roony Bardghji and real younger squad players.

This is not yet a claim that every one of the 291 base-player records has been manually current-club-verified. V0.14 creates the machinery and begins the systematic audit; future roster work must continue league-by-league instead of assuming historical data is current.

---

## 🔵 CE SABADELL 2026/27 AUDIT

V0.14 cross-checks the current CE Sabadell first team and expands the club as useful bronze/silver SBC depth. Current real first-team identities added/updated include Diego Fuoli, Nil Ruiz, Genar Fornés, Carlos Garcia, Arthur Bonaldo, Ton Ripoll, David Astals, Jan Molina, Jordi Ortega, Urri, Quadri Liameed, Rodrigo Escudero, Rubén Martínez, Alan Godoy, Javi López-Pinto and Joel Priego, alongside existing current Sabadell records such as José Ortega, Carlos Alemán, Kaiser, Eneko Aguilar, Miguelete and Agustín Coscia.

Important: **being in the verified Sabadell roster does not give a player a rectangular web photo.** If no exact current-Sabadell transparent cutout exists, the card stays as a silhouette by design.

---

## 📦 V0.14 PLAYER POOL / SBC DEPTH

Final clean-build dataset after the audit:

- **302 total cards**;
- **291 base players**;
- **49 bronze**;
- **109 silver**;
- **133 gold**;
- **11 special/TOTW**;
- **36 CE Sabadell cards** in the overall dataset after reconciliation of existing + current additions.

V0.14 also adds real players across useful rating bands rather than padding with invented identities, including additional Barça squad members and players such as Mikel Oyarzabal, Martín Zubimendi, Moisés Caicedo, Alexander Isak, Morgan Rogers, Jarrad Branthwaite, Milos Kerkez, Ethan Nwaneri, Kobbie Mainoo, Jorrel Hato, Lewis Miley and Archie Gray.

Ratings/stats remain **PackVerse launch estimates**; player identities and audited current-club assignments are the factual layer. Do not present PackVerse ratings as official EA ratings.

---

## 📊 ASSET COVERAGE AUDIT — CURRENT HONEST STATE

CI now writes `.smoke-artifacts/asset-coverage-v14.json` on every validation run. This makes asset debt measurable instead of visual guesswork.

Final V0.14 clean-build snapshot:

- player static/rectangular portraits: **0 intentionally**;
- verified cutouts at clean build: **0 intentionally** — runtime admits them only after exact player + current-club verification;
- deterministic club badges: **21 / 60 clubs (~35%)**;
- deterministic competition logos: **7 / 14 leagues (50%)**.

This means the next P0 is very clear: **club and competition identity coverage**, especially LALIGA HYPERMOTION, then LaLiga / Premier League / Bundesliga / Serie A / Ligue 1. Do not weaken the player-photo law merely to make coverage percentages look higher.

---

## 🎨 V0.13 CARD SYSTEM — STILL THE VISUAL BASELINE

V0.13 remains the canonical visual renderer underneath V0.14:

- `v13/card-ui.js` owns full `Card` + compact `FieldCard` rendering;
- seven materials: `bronze-common`, `bronze-rare`, `silver-common`, `silver-rare`, `gold-common`, `gold-rare`, `totw`;
- OVR/position → art → name → six horizontal stats → nation / competition / club;
- two readable Club cards per row on phone;
- rarity/material identity is preserved in packs, Club, XI, Draft and SBC;
- TOTW remains black/gold and visually separate.

V0.14 changes **data and asset integrity**, not the successful V0.13 card geometry.

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
- TOTW Lab/future fictional promos are simulated PackVerse content, clearly separate from official base data.
- **Correct silhouette > wrong player / wrong shirt / wrong club / badly cropped portrait.**
- Visual quality and data integrity are release requirements; green tests alone are insufficient.

---

## 🔴 NEXT WORK, IN PRIORITY ORDER

### P0 — Deterministic club / competition assets

The coverage report shows only 21/60 clubs and 7/14 competitions are deterministic at clean build. Complete LALIGA HYPERMOTION first, especially all clubs represented by SBC fodder, then the major first divisions. Every unresolved badge should keep a readable local fallback rather than a broken image.

### P0 — Systematic current-roster audit

Continue what V0.14 started. Audit clubs/players league-by-league with current reliable sources. Any transfer correction must update both club/league metadata and invalidate stale player art. Add tests for high-profile transfer corrections so stale clubs cannot silently return.

### P1 — Expand real pool further

302 cards is much healthier but still small for a long-term pack opener. Expand with **real players** in balanced bronze/silver/gold bands and enough positional coverage for SBCs. Prefer completing real squads/leagues over random isolated names.

### P1 — Retire historical runtime ownership

V0.13/V0.14 are canonical for cards/assets, but old `v4 → v12` layers still load for compatibility. Gradually prove and remove obsolete ownership instead of creating endless override layers.

### P1 — Walkout / Draft / SBC polish

Keep normal pulls fast. 85+ suspense remains `nation → position → club → OVR → card`. Draft later needs clearer generated opponents/results. SBC needs clearer live requirements, filters/groups and repeatable upgrades.

---

## 🧪 RELEASE / SMOKE RULE — MANDATORY

Every release must pass all three layers.

### 1. Engine / integrity smoke

Run:

- `scripts/validate-v4.mjs`;
- `scripts/smoke-v12.mjs`;
- `scripts/smoke-v13.mjs`;
- `scripts/smoke-v14.mjs`;
- `scripts/report-assets-v14.mjs`.

V0.14 smoke specifically checks current-club transfer corrections, real Barça/Sabadell pool entries, bronze/silver/gold depth, cutout-only art, no `strThumb`/`strRender`, current-club-tied caches and the silhouette-first policy.

### 2. Real browser smoke

Minimum Chromium sizes: mobile `390×844`, desktop `1440×900`. Check runtime exceptions, overflow, card geometry, Club filters, Draft 11/11 and desktop Companion layout. Also run the seven-rarity matrix. Browser launchers now have a longer CDP startup window and one retry because run #36 exposed a runner startup flake before the page even loaded.

### 3. Human smoke

Actually inspect screenshots. For asset changes, specifically look for:

- wrong old-team shirts;
- rectangular/pasted portraits;
- stale player images after a transfer;
- empty/broken club or league identity slots;
- silhouettes rendering cleanly when a cutout is unavailable;
- mobile Club and Draft field readability.

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
├── v4/ ... v11/              # historical/runtime compatibility layers
├── v12/                      # stabilized systems
├── v13/                      # canonical card visual system
├── v14/
│   ├── content.js            # current-club corrections + real pool expansion
│   └── assets.js             # cutout-only exact-current-club art law + coverage API
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
6. Run the mandatory V0.14 integrity + browser suite before moving anything to `main`.
7. Update this README after the next meaningful improvement.

**This README is the canonical handoff for PackVerse.**
