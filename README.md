# PackVerse 27

Mobile-first football card-collection PWA inspired by Ultimate Team / MADFUT loops: packs, club, chemistry, Squad Builder, Draft, SBC/DCP and progression. PackVerse is its own fan project and is not affiliated with EA.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 CURRENT PROJECT STATE — READ THIS FIRST

**Last handoff update:** 2026-09-14  
**Production branch:** `main`  
**Integration branch:** `dev`  
**Production version:** `V0.16 Current-Shirt Cards + IF/Base Art Reuse — LIVE`  
**Production commit:** `4d772a092b74d534643e7c44b6cb474121f6f053`  
**Release PR:** `#37` — merged  
**Production validation:** run #48 (`34878341895`) — **SUCCESS**  
**GitHub Pages deploy:** run #23 (`34878444071`) — **SUCCESS**  
**Next P0:** expand verified player cutouts and deterministic club/league identity coverage team-by-team.

### Branch truth

V0.16 is live on `main`. The exact QA-passed dev tree was snapshotted cleanly on top of the previous production commit because `dev` and `main` had diverged release history. Product contents were preserved exactly. Future feature work should start from `dev`; before the next release, reconcile the product tree with `main` using the same clean-release approach if branch history is still divergent.

---

## 🎨 V0.16 CARD / ASSET RULES

> **Correct current-shirt transparent cutout > silhouette > stale/wrong-shirt/badly cropped image.**

- ordinary provider art requires exact player + exact current club + transparent cutout;
- recent-transfer players can require manual current-shirt verification;
- `strThumb`, `strRender`, generic rectangular portraits and web-photo crops are forbidden;
- cached art is club-aware and policy-versioned;
- missing image is preferable to incorrect image;
- real crest/league assets never sit on fake circular plates;
- unresolved identities use quiet text fallback rather than a fake badge.

### Livaković regression — fixed

Dominik Livaković is stored as an FC Barcelona player and now uses a verified current FC Barcelona transparent cutout. The dedicated browser audit fails if his rendered image stops being the Barça asset, contains `Girona`, loses `object-fit: contain`, or his club changes away from Barcelona.

### Verified current Barça cutouts

Current manually pinned high-confidence assets: Dominik Livaković, Joan García, Karim Adeyemi, Anthony Gordon, Gabriel Jesus, Xavi Espart, Rodri and João Cancelo.

---

## ⚫ IF / TOTW — 11/11 BASE-CARD REUSE

Every current IF/TOTW resolves to a normal base card and inherits its current club, league, nation/search identity and resolved player-image URL. No special card performs an independent image search.

Five historical special-only players now also have normal base versions so reuse is complete: Roberto Fernández, Yassir Zabiri, Zian Flemming, Igor Jesus and Leif Davis. Current metadata was reconciled where required, including Yassir Zabiri → Racing Santander and Zian Flemming → Ipswich Town.

**Machine audit: 11 / 11 specials bound to base cards.**

---

## 📦 CURRENT POOL

- **307 total cards**
- **296 base-player cards**
- **11 IF/TOTW cards**
- **64 clubs**
- **14 leagues**
- **8 manually verified current Barça cutouts**
- **11 league resolver specs**

Ratings/stats are PackVerse launch estimates, not official EA ratings.

---

## ✅ V0.16 QA — COMPLETE

Final production release validation run #48 passed:

- legacy regression suite;
- V0.12 systems smoke;
- V0.13 seven-rarity card audit;
- V0.14 player-integrity/pool audit;
- V0.15 visual-asset guarantees;
- V0.16 current-shirt + IF/base static audit;
- machine-readable V0.14 and V0.16 asset reports;
- real Chromium mobile + desktop Companion smoke;
- Draft field smoke;
- seven-rarity browser card matrix;
- dedicated V0.16 mobile/desktop current-shirt + identity + IF/base audit;
- artifact upload.

Human screenshot review was also performed before production. Livaković rendered in the current Barça goalkeeper shirt, the curated Barça cutouts stayed inside the portrait zone, club/league logos had no circular plates, IF/base artwork stayed consistent, Draft still fit 11/11 field cards and all seven rarity materials remained visually distinct.

GitHub Pages deployment run #23 succeeded after merge.

---

## 🧱 CARD VISUAL STACK

- `v13/card-ui.js` — canonical full Card + FieldCard renderer
- `v13/cards.css` — seven card-material families and core composition
- `v15/visuals.css` — clean identity slots + provider cutout layer
- `v16/visuals.css` — verified-cutout geometry + identity spacing
- `v16/content.js` — complete IF/base identity binding
- `v16/assets.js` — verified current cutouts, recent-transfer guard, IF/base art reuse, broader club/league hydration

Do not introduce another competing card renderer.

---

## 🔴 NEXT WORK

### P0 — Player-art coverage

Expand current-shirt transparent assets team-by-team, prioritising high-OVR/high-frequency pack cards first. Maintain measurable status for verified cutout / provider-safe cutout / silhouette / stale-blocked.

### P0 — Club / competition identity

Close deterministic crest and competition-logo gaps, especially LALIGA HYPERMOTION and heavily represented SBC clubs. Correct text fallback is preferable to the wrong logo.

### P1 — Current-roster audit

Continue league-by-league transfer verification. Any club move must invalidate stale art.

### P1 — Card presentation polish

After integrity, continue per-player crop overrides, small-screen typography/spacing and rarity-specific detailing.

---

## 🌿 WORKFLOW

1. `main` = stable deployed Pages.
2. `dev` = canonical integration state.
3. Feature/fix branch from `dev`.
4. Merge to `dev` first.
5. Run engine + Chromium QA.
6. Inspect screenshots manually.
7. **Update this README after every meaningful improvement.**
8. Release to `main` only after QA.
9. Confirm Pages before calling the version live.

---

## 🔁 HOW TO RESUME FROM ANOTHER CHAT

Open this README on `dev` first, then inspect `main`, `dev`, open PRs and the latest validation run. Preserve the current-shirt/silhouette law, recent-transfer guard, no-circle identity rule and 11/11 IF/base reuse. Never accept green unit tests without browser screenshots for visual work.

**This README is the canonical PackVerse handoff.**
