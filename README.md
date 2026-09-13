# PackVerse 27

Mobile-first PWA inspirada en los simuladores de colección de fútbol: pack opener, club, química, Squad Builder, Draft, SBC, Market Lab y Academy.

**Live:** https://papimatcoding.github.io/pack-opener-EAFC27/

## v0.5 — Card & Walkout Polish

- Cartas rehechas para que **GRL, posición y seis estadísticas sean legibles también dentro de Tu Club**.
- Marcos y materiales claramente distintos para Bronce/Plata/Oro común y premium.
- TOTW rediseñado con estética **carbón/negro + diagonales y doble marco dorado**, inspirado en el lenguaje visual reciente de Ultimate Team.
- Progresión TOTW simulada más realista: las cartas base altas reciben normalmente `+1 OVR` en su primer IF y un IF posterior parte del IF previo; los jugadores de media baja usan una ruta de salto inicial mayor.
- Los boosts de stats TOTW preservan mejor la identidad/posición del jugador en vez de sumar lo mismo a todos los atributos.
- Daily Gold Pack nerfeado mediante bandas explícitas: aproximadamente `3%` de probabilidad de ver al menos un 85+ y menos de `0,5%` para 87+.
- Odds diferentes por tipo de pack y visibles en la descripción del Pack Store.
- Pulls <85 casi instantáneos; 85+ pasan a una cinemática sobria de bandera → posición → club → media → carta.
- 87+, 90+ y TOTW reciben progresivamente más tiempo de reveal; el acelerado solo se activa después del primer tramo de animación.
- Se eliminan textos y sonidos exagerados del walkout anterior.
- Capa `v5/` no destructiva encima de V0.4 para poder iterar diseño/odds sin tocar Draft, SBC o química.
- CI ampliado: comprueba sintaxis, bandas del Daily y que los TOTW de estrellas no reciban saltos de GRL incorrectos.

## Sistemas base

- Química estilo FUT: club `2/4/7`, nación `2/5/8`, liga `3/5/8`, máximo 3 puntos por jugador.
- Química 0–33 normalizada a **0–100**.
- Valoración **0–199 = hasta 99 GRL + 100 química**.
- Draft gratuito con recompensas según valoración.
- SBC de **solo duplicados**: la última copia queda protegida.
- Sobre Básico gratis e ilimitado y cadena de upgrades para progresar sin gastar coins.
- `TOTW Lab`: especiales simuladas; no se presentan como cartas oficiales de EA.

## Estructura

```text
.
├── index.html
├── js/data.js
├── v4/                    # sistemas principales
│   ├── base.css
│   ├── cards.css
│   ├── app.css
│   ├── content.js
│   ├── core.js
│   ├── ui.js
│   ├── game.js
│   └── main.js
├── v5/                    # capa de balance/polish
│   ├── rules.js           # odds + progresión TOTW
│   ├── card-ui.js         # nuevo markup de cartas
│   ├── game-polish.js     # reveal 85+
│   └── polish.css         # marcos, stats y cinemática
├── assets/icon.svg
├── manifest.json
├── sw.js
└── .github/workflows/
```

## Contenido simulado

PackVerse no está afiliado a EA. La base de desarrollo es una muestra curada. Algunas cartas de cantera y todas las cartas `TOTW Lab` son contenido simulado. Precios, probabilidades y stats especiales no son datos oficiales.

## Local

```bash
python run_local_server.py
```

Abre `http://127.0.0.1:8080`.
