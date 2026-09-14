# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, club, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production:** `V0.17 Asset Persistence + Lazy Player Hydration + Deterministic Crest Expansion — LIVE`  
**Production commit:** `43f289f054321aec2f120f96d7da732309016443`  
**Release PR:** `#46` — merged  
**Production validation:** run #57 (`34885544112`) — **SUCCESS**  
**GitHub Pages deploy:** run #25 (`34885637265`) — **SUCCESS**  
**Integration branch:** `dev`  
**Next P0:** deterministic Spanish club/competition coverage, then verified current-shirt player-art expansion.

### Why V0.17 exists

The missing-image problem was not only a coverage issue. Several historical asset layers used exact-version migration guards, so newer saved versions could make old code wipe valid photos again during reload. The full audit found this pattern in V9/V10/V11/V12/V14/V15.

V0.17 makes the complete legacy migration chain monotonic. A newer cache/policy version can no longer trigger an older destructive migration. Run #55 proved a verified current-club cutout survives a real Chromium full reload; production run #57 repeated the full suite successfully.

---

## 🖼️ V0.17 ASSET CHANGES

### Persistent verified player art

- V9/V10 asset-match migrations and V11/V12/V14/V15 asset-policy migrations are monotonic.
- Existing verified current-club transparent cutouts survive full reloads.
- V0.17 clears only the old negative V15 lookup cache once so previous false misses get another chance.
- Verified positive photo cache is preserved.

### Player lookup is viewport-lazy again

V16's final hydrator could trigger a large whole-Club request burst. `v17/assets.js` is now the final hydrator: safe cached cutouts paint immediately, unresolved players are resolved only near the viewport through IntersectionObserver, and remote photo requests remain sequential/throttled. Club/league hydration is bounded as well.

### Deterministic crest expansion

The machine report records **24 / 64 clubs with deterministic crest mappings (37.5%)**. V0.17 adds verified football-data IDs for Aston Villa, Everton, Burnley, Brentford, Brighton, Crystal Palace, West Ham, Wolverhampton and Leeds United on top of the existing core registry.

This is deliberately not claimed as complete. The report lists 40 remaining deterministic club gaps; Spanish / LALIGA HYPERMOTION identities are the next P0.

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
- **24/64 deterministic club crests**

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## ✅ V0.17 QA — LIVE

Dev run #55 and production PR run #57 both passed every validation layer:

- legacy regression checks;
- V0.12 systems regression;
- V0.13 seven-rarity card audit;
- V0.14 player-integrity/pool audit;
- V0.15 visual-asset guarantees;
- V0.16 current-shirt + IF/base audit;
- V0.17 migration/persistence/lazy-hydration smoke;
- V0.14, V0.16 and V0.17 machine-readable reports;
- real Chromium mobile + desktop Companion smoke;
- Draft field smoke;
- seven-rarity browser card matrix;
- V0.16 current-shirt visual audit;
- V0.17 real-browser reload-persistence + deterministic-crest audit;
- browser artifact upload.

### Human artifact review after run #55

Reviewed `mobile-assets-v17.png`, `mobile-club.png`, `mobile-visual-audit-v16.png`, desktop Club/current-shirt screenshots, Draft and both seven-rarity matrices.

Observed:

- new Aston Villa / Everton / Brighton / Crystal Palace crests render correctly in the card identity row;
- cards stay within the mobile two-column layout with no new overlap or clipping;
- the V0.16 curated current-shirt players still render correctly after the V0.17 hydrator changes;
- rarity materials and horizontal stats remain intact;
- silhouettes remain deliberate where no safe cutout exists;
- the persistence sentinel remains present after full reload with its current-club metadata intact;
- no regression was seen in Draft geometry or desktop Club rendering.

GitHub Pages run #25 succeeded after the production merge. V0.17 is live.

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

### P0 — deterministic Spanish identity coverage

Use `asset-coverage-v17.json` as the checklist. Prioritise LALIGA HYPERMOTION / Spanish clubs with high representation: CE Sabadell FC, Racing Santander, Sporting Gijón, R. Oviedo, R. Valladolid CF, UD Almería, Cádiz CF, SD Eibar, Albacete BP, Burgos CF, CD Castellón, Córdoba CF and the remaining Spanish top-flight clubs.

### P0 — verified player-art coverage

Expand current-shirt transparent cutouts team-by-team, prioritising high-OVR and frequently packed players. Keep a measurable split between manually verified cutout, provider-safe cutout, silhouette and stale-blocked.

### P1 — current-roster audit + visual crop polish

Any transfer must invalidate stale art. After integrity, continue per-player crop overrides and small-screen typography/frame polish.

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

Open this README on `dev`, inspect `main`, `dev`, open PRs and latest Actions. Preserve the full monotonic migration chain, viewport-lazy lookup, current-shirt/silhouette law, recent-transfer guard, no-circle identity rule and 11/11 IF/base reuse. V0.17 is live; the next work is deterministic Spanish identity coverage, followed by verified player-art expansion.

**This README is the canonical PackVerse handoff.**
