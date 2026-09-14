# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, club, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production:** `V0.16 Current-Shirt Cards + IF/Base Art Reuse — LIVE`  
**Production commit:** `4d772a092b74d534643e7c44b6cb474121f6f053`  
**Production QA:** run #48 — SUCCESS · Pages run #23 — SUCCESS  
**Integration branch:** `dev`  
**V0.17 candidate:** `Asset Persistence + Lazy Player Hydration + Deterministic Crest Expansion`  
**V0.17 status:** implementation complete on `feat/v017-identity-coverage`; merge to `dev`, full CI and screenshot review still required before release.

### Why V0.17 exists

While investigating why many player images could still appear missing, a deeper persistence bug was found: V14 and V15 used exact policy-version comparisons. Once V16 had stored `assetPolicyVersion = 16`, the older layers interpreted `16 !== 14/15` as a migration trigger on every later reload. That could wipe otherwise valid cached cutouts before V16 loaded again.

V0.17 makes those migrations **monotonic** (`currentPolicy < layerVersion`). A newer policy can no longer make an older layer erase verified artwork. This is expected to improve real-world image retention considerably without relaxing any validation rule.

---

## 🖼️ V0.17 ASSET CHANGES

### Persistent verified player art

- V14 and V15 migrations no longer rerun after a later policy version has been reached.
- Existing verified current-club transparent cutouts survive a full page reload.
- V0.17 performs one clean reset of old V15 negative lookup cache so cards that may have failed during previous request bursts get another chance.
- Verified photos are never deleted merely to force that retry.

### Player lookup is viewport-lazy again

V16's final hydrator unintentionally requested every `[data-photo]` in the Club DOM at once, even though V15 already had lazy IntersectionObserver behaviour. With a large collection this could generate a burst of provider requests and make valid assets look unavailable.

`v17/assets.js` is now the final hydrator. Cached safe cutouts paint immediately; unresolved players are queried only when their cards approach the viewport, with a small sequential delay. Club/league requests also use bounded concurrency.

### Deterministic crest expansion

V0.17 adds conservative football-data.org crest mappings for verified IDs beyond the original V13 registry, including Aston Villa, Everton, Burnley, Brentford, Brighton, Crystal Palace, West Ham, Wolverhampton and Leeds United plus naming aliases. Missing/uncertain clubs still fall back to the verified resolver/text path rather than receiving a guessed crest.

---

## 🎨 CARD / ASSET LAW — DO NOT REGRESS

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

- exact player + exact current club remains mandatory for ordinary provider art;
- recent transfers may require manually verified current-shirt art;
- `strThumb`, `strRender`, generic portraits and arbitrary web crops remain forbidden;
- Livaković remains pinned to his verified current FC Barcelona cutout;
- all 11/11 IF/TOTW cards reuse their normal base-card art and current identity;
- real crest/league assets have no fake circular plate;
- unresolved identity remains quiet text rather than a fake badge.

---

## 📦 CURRENT POOL

- **307 total cards**
- **296 base players**
- **11 IF/TOTW**
- **64 clubs**
- **14 leagues**
- **8 manually verified current Barça cutouts**
- **11/11 IF cards bound to base cards**

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## 🧪 V0.17 QA / ANALYSIS REQUIREMENTS

V0.17 adds three explicit safeguards:

1. `scripts/smoke-v17.mjs` checks monotonic migrations, the final lazy hydrator, the one-time retry recovery, V17 cache wiring and deterministic crest mappings.
2. `scripts/report-assets-v17.mjs` outputs the exact deterministic-crest coverage and the remaining club gaps instead of pretending coverage is complete.
3. `scripts/browser-assets-v17.mjs` performs a real Chromium full-reload test: it plants a verified provider-cutout sentinel, reloads the app and fails if an older migration wipes it. It also renders cards from newly deterministic clubs and captures `mobile-assets-v17.png`.

The existing V0.12–V0.16 engine/browser tests, Draft smoke, seven-rarity matrix and current-shirt audit must still pass. **Green CI is not enough: inspect the generated screenshots before release.**

---

## 🧱 CURRENT VISUAL / ASSET STACK

- `v13/card-ui.js` — canonical Card + FieldCard renderer
- `v13/cards.css` — seven rarity/material families
- `v15/visuals.css` — clean identity slots
- `v16/content.js` — IF/base binding
- `v16/assets.js` — current-shirt guard + verified Barça assets + IF reuse
- `v16/visuals.css` — final cutout geometry
- `v17/assets.js` — final hydrator, reload persistence recovery and deterministic crest expansion

Do not add another competing card renderer or weaken image verification.

---

## 🔴 NEXT AFTER V0.17

P0 remains asset coverage, but now on a stable persistence base: use the V17 report to work through the unresolved clubs and then expand verified current-shirt player cutouts league-by-league. Prioritise LALIGA HYPERMOTION / Spanish clubs, then LaLiga, Premier League, Bundesliga, Serie A and Ligue 1. Any current-roster change must invalidate stale art.

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
9. Confirm Pages before calling a version live.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

Open this README on `dev`, inspect `main`, `dev`, open PRs and latest Actions. Preserve monotonic asset migrations, viewport-lazy lookup, current-shirt/silhouette law, recent-transfer guard, no-circle identity rule and 11/11 IF/base reuse. If V0.17 has not passed its browser reload test and screenshot review, do not call it stable.

**This README is the canonical PackVerse handoff.**
