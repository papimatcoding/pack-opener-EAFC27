# PackVerse 27

Mobile-first PWA de colección de fútbol: pack opener, club, química, Squad Builder, Draft, SBC y Market Lab.

**Live:** https://papimatcoding.github.io/pack-opener-EAFC27/

## v0.6 — Squad, SBC & Card Depth

- Squad Builder rehecho con **cartas de campo compactas y legibles**: media, posición, cara, nombre y química sin intentar encajar una carta completa en 60 px.
- Selector de formación con `4-3-3`, `4-2-3-1`, `4-4-2`, `4-3-2-1`, `4-2-2-2` y `3-5-2`.
- Cambio de formación intenta conservar automáticamente los jugadores compatibles del XI.
- Cartas base más cercanas a Ultimate Team: silueta, marco, jugador centrado, nombre y las seis stats `RIT/TIR/PAS/REG/DEF/FÍS`, con nación/liga/club abajo.
- Búsqueda de fotos reforzada con alias y nombres normalizados antes de usar iniciales como fallback.
- Pool activo temporalmente **solo masculino**, ampliado con más cartas oficiales de lanzamiento.
- Todos los sobres tienen ahora una **animación física de pack**; los 85+ continúan después con reveal cinematográfico.
- SBC/DCP rehechos como **plantillas manuales**: eliges posición por posición desde tus duplicados y debes cumplir media, química, ligas, naciones o cartas altas.
- La última copia de una carta sigue protegida; los SBC solo consumen duplicados.
- Academy eliminado: el aprendizaje de cartas queda integrado en packs, Draft, Club, SBC y Squad Builder.
- PWA cache v6 y CI ampliado para validar pool masculino, formaciones, recompensas, odds y sintaxis.

## Sistemas base

- Química estilo FUT: club `2/4/7`, nación `2/5/8`, liga `3/5/8`, máximo 3 puntos por jugador.
- Química 0–33 normalizada a **0–100**.
- Valoración **0–199 = hasta 99 GRL + 100 química**.
- Draft gratuito con recompensas según valoración.
- Sobre Básico gratis e ilimitado y cadena de upgrades para progresar sin gastar coins.
- Daily Gold Pack balanceado con bandas de probabilidad propias.
- `TOTW Lab`: especiales simuladas; los jugadores de media alta siguen normalmente una progresión inicial de `+1 OVR`.

## Estructura

```text
.
├── index.html
├── js/data.js
├── v4/                    # sistemas base
├── v5/                    # balance, TOTW y walkout
├── v6/                    # cartas, formaciones, SBC manual y pack animation
│   ├── content.js
│   ├── card-ui.js
│   ├── game.js
│   ├── systems.js
│   ├── cleanup.js
│   └── styles.css
├── assets/icon.svg
├── manifest.json
├── sw.js
└── .github/workflows/
```

## Contenido y datos

PackVerse no está afiliado a EA. La base de desarrollo es una muestra curada y se irá ampliando. Los ratings base que añadimos desde la base oficial de FC 27 se mantienen separados del contenido ficticio. Algunas cartas de progresión y todas las cartas `TOTW Lab` son contenido simulado; precios, probabilidades y stats especiales no son datos oficiales.

## Local

```bash
python run_local_server.py
```

Abre `http://127.0.0.1:8080`.
