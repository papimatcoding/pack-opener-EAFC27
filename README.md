# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, club, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production:** `V0.17 Asset Persistence + Lazy Player Hydration + Deterministic Crest Expansion — LIVE`  
**Production commit:** `43f289f054321aec2f120f96d7da732309016443`  
**Production validation:** run #57 (`34885544112`) — **SUCCESS**  
**GitHub Pages deploy:** run #25 (`34885637265`) — **SUCCESS**  
**Integration branch:** `dev`  
**V0.18 candidate:** `Spanish Deterministic Identity Expansion`  
**V0.18 QA commit before docs:** `122eaef08b96a69903bd36998d9ae62c5a2d0db4`  
**V0.18 full dev validation:** run #64 (`34887620715`) — **SUCCESS**  
**Release state:** V0.18 is QA-cleared on `dev`; after this README sync, run one final full dev validation and then release the exact dev tree to `main`.

---

## 🇪🇸 V0.18 SPANISH IDENTITY EXPANSION

V0.18 closes most of the remaining Spanish badge debt without weakening the correctness rules. `v18/assets.js` adds a conservative deterministic overlay: an identity is pinned only when the football-data crest is verified and usable by the game. Historical URLs that no longer load are rejected rather than counted as coverage.

### Final measured coverage after run #64

- **48 / 64 represented clubs deterministic — 75.0%**
- **27 / 30 represented Spanish clubs deterministic — 90.0%**
- **24 explicit V0.18 Spanish mappings**
- remaining Spanish deterministic gaps: **CD Castellón, Celta Fortuna, Córdoba CF**

V0.17's baseline was 24/64 deterministic clubs, so V0.18 doubles deterministic represented-club coverage while leaving unresolved identities on quiet fallback.

### V0.18 verified Spanish overlay

CE Sabadell FC, Racing Santander, R. Oviedo, R. Valladolid CF, Burgos CF, AD Ceuta FC, Real Sociedad B, Granada CF, Albacete BP, RCD Mallorca, CD Tenerife, CD Eldense, SD Eibar, UD Las Palmas, Girona FC, Athletic Club, Espanyol, Rayo Vallecano, Real Sociedad, CD Leganés, FC Andorra, UD Almería, Cádiz CF and Sporting Gijón now have deterministic provider assets in the V0.18 overlay.

Córdoba deserves an explicit warning: archived football-data references identify team 259, but both `259.png` and `259.svg` failed to load in real Chromium during runs #62/#63. V0.18 therefore removes that mapping and purges any pre-release cached 259 URL. Do not re-add it unless a currently loadable verified asset is found.

### V0.18 QA additions

- `scripts/smoke-v18.mjs` guards the verified registry, PWA wiring, no-guess policy and rejects the dead Córdoba mapping.
- `scripts/report-assets-v18.mjs` measures total and Spanish-only deterministic coverage and lists remaining gaps.
- `scripts/browser-spanish-assets-v18.mjs` seeds real Spanish cards, checks exact rendered URLs **and `naturalWidth`**, then captures `mobile-spanish-identities-v18.png`.
- Service worker cache is `packverse27-v18-spanish-identity`.

---

## ✅ V0.18 FINAL QA — PASSED ON DEV

Run #64 passed every validation layer:

- legacy regression checks;
- V0.12 systems regression;
- V0.13 seven-rarity card audit;
- V0.14 player-integrity/pool audit;
- V0.15 visual-asset guarantees;
- V0.16 current-shirt + IF/base audit;
- V0.17 migration/persistence/lazy-hydration audit;
- V0.18 Spanish deterministic identity audit;
- V0.14/V0.16/V0.17/V0.18 machine-readable reports;
- real Chromium mobile + desktop Club smoke;
- Draft field smoke;
- seven-rarity browser card matrix;
- current-shirt visual audit;
- reload-persistence browser audit;
- Spanish crest real-load browser audit;
- browser artifact upload.

### Human artifact review after run #64

Reviewed `mobile-spanish-identities-v18.png` plus the existing mobile/desktop Club, Draft, rarity matrix and current-shirt artifacts.

Observed:

- Almería, Cádiz and Sporting Gijón pass exact-URL and real-load checks in Chromium;
- Sabadell and Racing control cards also load their deterministic crests correctly;
- Spanish club marks remain flat/transparent with no fake circular plate;
- mobile Club remains two columns with no new overlap or clipping;
- rarity styling, horizontal stats, Draft geometry and V0.16 current-shirt cutouts remain intact;
- Córdoba correctly falls back instead of rendering a dead provider image.

V0.18 is cleared for production release after the README-sync validation.

---

## 🖼️ PERSISTENCE / PLAYER-ART LAW — PRESERVE

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

- V9/V10/V11/V12/V14/V15 migrations remain monotonic;
- verified cutouts survive reloads;
- player lookup remains viewport-lazy and throttled;
- exact player + exact current club remains mandatory for ordinary provider art;
- recent transfers may require manually verified current-shirt art;
- `strThumb`, `strRender`, generic portraits and arbitrary web crops remain forbidden;
- Livaković stays pinned to the verified current FC Barcelona cutout;
- all 11/11 IF/TOTW cards reuse their base-card art and current identity;
- unresolved club identity uses quiet fallback rather than a guessed or broken crest.

---

## 📦 CURRENT POOL

- **307 total cards**
- **296 base players**
- **11 IF/TOTW**
- **64 clubs**
- **14 leagues**
- **8 manually verified current Barça cutouts**
- **11/11 IF cards bound to base cards**
- **48/64 deterministic represented club crests**
- **27/30 deterministic represented Spanish clubs**

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## 🧱 CURRENT VISUAL / ASSET STACK

- `v13/card-ui.js` — canonical Card + FieldCard renderer
- `v13/cards.css` — seven rarity/material families
- `v15/visuals.css` — clean identity slots
- `v16/content.js` — IF/base binding
- `v16/assets.js` — current-shirt guard + verified Barça assets + IF reuse
- `v16/visuals.css` — final cutout geometry
- `v17/assets.js` — final lazy hydrator + reload persistence recovery + first deterministic expansion
- `v18/assets.js` — verified/loadable Spanish deterministic crest overlay

Do not add another competing card renderer.

---

## 🔴 NEXT AFTER V0.18

The remaining Spanish deterministic gaps are **CD Castellón, Celta Fortuna and Córdoba CF**. Only close them if a current, independently verified and actually loadable asset is found. Do not spend endless time forcing 100% if the provider data is absent.

The next major P0 is then **verified current-shirt player-art coverage team-by-team**, prioritising high-OVR/high-frequency cards. Maintain measurable states for manually verified cutout / provider-safe cutout / silhouette / stale-blocked.

---

## 🌿 WORKFLOW

1. `main` = stable deployed Pages.
2. `dev` = canonical integration state.
3. Feature/fix branch from `dev`.
4. Merge to `dev` first.
5. Run complete engine + Chromium QA.
6. Inspect screenshots manually.
7. **Update this README after every meaningful improvement.**
8. Release to `main` only after QA.
9. Confirm Pages before calling the version live.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

Open this README on `dev`, inspect `main`, `dev`, open PRs and latest Actions. V0.17 remains live until the V0.18 release PR is merged. V0.18 passed run #64 before this README sync; run the full suite again after docs merge, then release the exact dev tree. Preserve monotonic migrations, viewport-lazy lookup, current-shirt/silhouette law, no-circle identity rule, loadable-only deterministic crest registry and 11/11 IF/base reuse.

**This README is the canonical PackVerse handoff.**
