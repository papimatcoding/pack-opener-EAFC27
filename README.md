# PackVerse 27

Mobile-first PWA inspirada en los simuladores de colección de fútbol: pack opener, club, química, Squad Builder, Draft, SBC, Market Lab y Academy.

**Live:** https://papimatcoding.github.io/pack-opener-EAFC27/

## v0.4 — Chemistry & Progression

- Rediseño visual de cartas con **Bronce común / Bronce premium / Plata común / Plata premium / Oro común / Oro premium / TOTW**.
- Club ordenado a 2 columnas en móvil y filtros por GRL, calidad, posición, liga, duplicados y orden.
- Química inspirada en FUT moderno: club `2/4/7`, nación `2/5/8`, liga `3/5/8`, máximo 3 puntos por jugador.
- El 0–33 de química se normaliza a **0–100**.
- Valoración de plantilla **0–199 = hasta 99 GRL + 100 química**.
- Draft gratuito, 5 opciones por posición y recompensas según la valoración final.
- SBC de **solo duplicados**: la última copia de una carta nunca puede entregarse.
- Cadena de progresión gratuita: Sobre Básico → upgrades de bronce/plata/oro → 80+/82+/84+.
- Sobre Básico gratis e ilimitado + Daily Gold Pack diario.
- Más objetivos de Draft, química, duplicados y SBC.
- Walkout lento y escalonado para 85+; pulls normales saltan la cinemática larga.
- `TOTW Lab 01`: 12 especiales simuladas. Parte de la selección está inspirada en actuaciones reales recientes; las medias y stats especiales son contenido ficticio de PackVerse.
- Arquitectura V0.4 modular en `v4/` para poder añadir promociones y temporadas sin rehacer el motor.
- PWA/cache actualizado a v4.

## Economía

La progresión base no exige coins:

1. Abres sobres básicos gratis.
2. Acumulas duplicados.
3. Reciclas los duplicados en SBC.
4. Obtienes packs mejores.
5. Mejoras club, química y Draft.
6. Cobras objetivos y especiales.

Las coins sirven para acelerar la progresión, no para bloquearla.

## Contenido simulado

PackVerse no está afiliado a EA. La base de desarrollo es una muestra curada. Algunas cartas de cantera y todas las cartas `TOTW Lab` son contenido simulado. Precios, probabilidades y stats especiales no son datos oficiales.

## Estructura

```text
.
├── index.html
├── js/data.js              # muestra base existente
├── v4/
│   ├── base.css            # design system móvil
│   ├── cards.css           # rarezas y cartas
│   ├── app.css             # pantallas / pitch / opening
│   ├── content.js          # ligas, cantera, packs, TOTW
│   ├── core.js             # estado, química, economía, SBC
│   ├── ui.js               # renders
│   ├── game.js             # gameplay y openings
│   └── main.js             # navegación / eventos
├── assets/icon.svg
├── manifest.json
├── sw.js
└── .github/workflows/pages.yml
```

## Local

```bash
python run_local_server.py
```

Abre `http://127.0.0.1:8080`.
