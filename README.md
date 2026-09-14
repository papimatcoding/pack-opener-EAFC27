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
**V0.18 status:** implementation on `feat/v018-spanish-identity`; full dev CI + browser screenshot review required before release.

---

## 🇪🇸 V0.18 SPANISH IDENTITY EXPANSION

V0.18 attacks the biggest remaining identity gap without weakening the correctness rules. `v18/assets.js` pins deterministic football-data crest URLs for 21 Spanish clubs where the current/verified provider identity is known, including the highest-priority LALIGA HYPERMOTION clubs.

### Newly pinned in V0.18

- CE Sabadell FC → `8921`
- Racing Santander → `5335`
- R. Oviedo → `1048`
- R. Valladolid CF → `250`
- Burgos CF → `9298`
- AD Ceuta FC → `7445`
- Real Sociedad B → `9381`
- Granada CF → `83`
- Albacete BP → `237`
- RCD Mallorca → `89`
- CD Tenerife → `254`
- CD Eldense → `9677`
- SD Eibar → `278`
- UD Las Palmas → `275`
- Girona FC → `298`
- Athletic Club → `77`
- Espanyol → `80`
- Rayo Vallecano → `87`
- Real Sociedad → `92`
- CD Leganés → `745`
- FC Andorra → provider's deterministic `andorra.svg`

Do **not** add Cádiz, Almería, Córdoba, Castellón, Sporting or any other unresolved club by guessing an ID merely to increase the percentage. A correct text fallback is still preferable to the wrong badge.

### V0.18 QA additions

- `scripts/smoke-v18.mjs` guards the verified registry, PWA wiring and no-guess policy.
- `scripts/report-assets-v18.mjs` measures total deterministic coverage and Spanish-only deterministic coverage, and outputs the remaining Spanish gaps.
- `scripts/browser-spanish-assets-v18.mjs` seeds real Spanish cards in Chromium, verifies the exact crest URL used by the rendered card and captures `mobile-spanish-identities-v18.png`.
- Service worker cache is bumped to `packverse27-v18-spanish-identity`.

---

## 🖼️ V0.17 PERSISTENCE BASE — PRESERVE

The missing-image problem was not only coverage. Historical V9/V10/V11/V12/V14/V15 asset migrations could erase newer verified photos on reload. V0.17 made the entire migration chain monotonic and restored viewport-lazy player hydration. Those guarantees remain mandatory under V0.18.

- verified current-club transparent cutouts survive reloads;
- unresolved players are queried only near the viewport;
- provider lookup remains throttled/sequential;
- old negative lookup cache gets one controlled retry;
- verified positive cache is preserved.

---

## 🎨 CARD / ASSET LAW — DO NOT REGRESS

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

- exact player + exact current club remains mandatory for ordinary provider art;
- recent transfers may require manually verified current-shirt art;
- `strThumb`, `strRender`, generic portraits and arbitrary web crops remain forbidden;
- Livaković remains pinned to his verified current FC Barcelona cutout;
- all 11/11 IF/TOTW cards reuse their normal base-card art and current identity;
- real crest/league assets have no fake circular plate;
- unresolved identity remains quiet text rather than a fake badge;
- deterministic club mappings must be verified, never inferred from a nearby name or placeholder ID.

---

## 📦 CURRENT POOL

- **307 total cards**
- **296 base players**
- **11 IF/TOTW**
- **64 clubs**
- **14 leagues**
- **8 manually verified current Barça cutouts**
- **11/11 IF cards bound to base cards**
- V0.17 production baseline: **24/64 deterministic club crests**
- V0.18 adds **21 verified Spanish deterministic mappings**; final represented-club percentage comes from `asset-coverage-v18.json` after CI.

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## ✅ LAST STABLE QA

V0.17 dev run #55 and production PR run #57 both passed legacy, V0.12–V0.17 static checks, all machine-readable reports, mobile/desktop Chromium Club + Draft smoke, seven-rarity matrix, current-shirt audit, reload-persistence audit and browser artifacts. GitHub Pages run #25 succeeded.

V0.18 must pass all of those unchanged **plus** its new Spanish static/report/browser checks. Human review of `mobile-spanish-identities-v18.png` is mandatory before release.

---

## 🧱 CURRENT VISUAL / ASSET STACK

- `v13/card-ui.js` — canonical Card + FieldCard renderer
- `v13/cards.css` — seven rarity/material families
- `v15/visuals.css` — clean identity slots
- `v16/content.js` — IF/base binding
- `v16/assets.js` — current-shirt guard + verified Barça assets + IF reuse
- `v16/visuals.css` — final cutout geometry
- `v17/assets.js` — final lazy hydrator + reload persistence recovery + first deterministic expansion
- `v18/assets.js` — verified Spanish deterministic crest overlay

Do not add another competing card renderer.

---

## 🔴 NEXT AFTER V0.18

First close only the remaining Spanish identity gaps that can be independently verified (expected candidates include Cádiz CF, UD Almería, Córdoba CF, CD Castellón, Sporting Gijón and Celta Fortuna). Then move to verified current-shirt player-art coverage team-by-team, prioritising high-OVR/high-frequency cards. Keep measurable states for manually verified cutout / provider-safe cutout / silhouette / stale-blocked.

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

Open this README on `dev`, inspect `main`, `dev`, open PRs and latest Actions. V0.17 is live. If V0.18 has not yet passed full CI and human screenshot review, finish that before release. Preserve monotonic migrations, viewport-lazy lookup, current-shirt/silhouette law, no-circle identity rule, verified-only deterministic crest registry and 11/11 IF/base reuse.

**This README is the canonical PackVerse handoff.**
