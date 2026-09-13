# PackVerse 27

Mobile-first PWA inspirada en la sensación de los antiguos simuladores tipo MADFUT: pack opener, colección, Squad Builder, Draft, SBC, Market Lab y Academy para aprender las cartas de FC 27.

**Live:** https://papimatcoding.github.io/pack-opener-EAFC27/

## v0.3

- UI móvil a pantalla completa con navegación inferior `Inicio · Packs · Club · XI · Más`.
- Pack Store con economía, Daily Pack, tokens y odds simuladas.
- Opening cinematográfico por fases: GRL → posición → país → club → carta.
- Fotos de jugadores bajo demanda mediante TheSportsDB, con fallback si una imagen no existe.
- Club persistente con duplicados, filtros y ficha detallada.
- Squad Builder 4-3-3 conectado al inventario real del usuario.
- Draft funcional: 5 opciones por posición, coste y recompensa.
- SBC Lab funcional: consume cartas reales del club y entrega packs como tokens.
- Market Lab con precio simulado, META score, buy target y watchlist.
- Academy con quiz de medias, rachas, XP y coins.
- Objetivos, nivel, estadísticas y progreso persistente con `localStorage`.
- PWA instalable y caché offline del app shell.
- Deploy automático a GitHub Pages mediante Actions.

## Estructura

```text
.
├── index.html
├── css/
│   └── app.css
├── js/
│   ├── app.js
│   └── data.js
├── assets/
│   └── icon.svg
├── manifest.json
├── sw.js
├── .nojekyll
├── .github/workflows/pages.yml
└── run_local_server.py
```

## Probar en local

```bash
python run_local_server.py
```

Después abre `http://127.0.0.1:8080`.

## Datos

`js/data.js` contiene por ahora una muestra curada de cartas base para desarrollar y equilibrar la experiencia. La arquitectura es data-driven: ampliar la base de jugadores no requiere rehacer la interfaz, packs, Draft, SBC o Market Lab.

Los precios y probabilidades del simulador son estimaciones educativas, no odds ni precios oficiales de EA.

## Estado del proyecto

Esta es una versión de desarrollo. El objetivo es evolucionarla hacia una app de colección/simulación completa: más cartas, promos, Icons/Heroes, SBCs complejos, Draft con química, logros, temporadas y mercado dinámico.
