# PackVerse 27

Mobile-first PWA de colección de fútbol inspirada en el loop de Ultimate Team / MADFUT: sobres, colección, química, Squad Builder, Draft, SBC/DCP y progresión. La intención es construir un juego propio, no clonar la interfaz o los assets de otro producto.

**Live / GitHub Pages:** https://papimatcoding.github.io/pack-opener-EAFC27/

---

## 🚦 ESTADO ACTUAL — LEER ESTO ANTES DE TOCAR EL PROYECTO

**Última auditoría:** 2026-09-14  
**Branch desplegada:** `main`  
**HEAD de `main` en la auditoría:** `ba64c84` (`chore(v0.12): bump PWA cache`)  
**Estado real:** V0.12 **parcial** en producción, no V0.12 completa.

### Importante: qué pasó con V0.12

No existe actualmente una rama `dev` en el repositorio.

La rama `main` recibió directamente varios commits V0.12 centrados en **assets, cartas, estilos e invalidación de caché**, por lo que el live ya enseña parte del polish de V0.12.

La implementación V0.12 más completa sigue en:

- branch: `v0.12-madfut-draft-smoke`
- PR: `#10 PackVerse 27 v0.12 — MADFUT polish, Draft Cup, deep bronze pool & QA smoke`
- estado del PR en esta auditoría: **OPEN**
- la rama y `main` han divergido; **NO hacer merge ciego**.

La rama V0.12 completa contiene trabajo que el `main` actual no carga todavía: expansión del pool de bronces, Free Pack progression, Club 84+/especiales, Draft Cup de 4 rondas, pacing de walkout nuevo, `smoke-v12.mjs`, `browser-smoke-v12.mjs`, `v12/content.js`, `v12/game.js`, `v12/runtime.js` y `v12/portraits.css`.

El `main` actual solo carga de V0.12:

- `v12/assets.js`
- `v12/styles.css`

Por tanto, **no asumir que todo lo descrito en el PR #10 está en producción**.

### Siguiente movimiento correcto

Antes de añadir features grandes:

1. reconciliar los 4 commits directos que existen en `main` con la rama `v0.12-madfut-draft-smoke`;
2. conservar lo mejor de ambos lados, no sobrescribir uno con el otro;
3. ejecutar smoke de motor + Chromium + revisión humana;
4. solo entonces cerrar V0.12 y plantear una rama de integración estable (`dev`) o iniciar V0.13.

---

## 🎯 DIRECCIÓN DE PRODUCTO

PackVerse debe sentirse como un juego de colección de fútbol que apetece abrir cada día: abrir sobres, completar colección, usar duplicados en SBC, montar XI, hacer Draft y progresar. El aprendizaje de cartas ocurre **jugando**, no mediante un modo Academy.

### Decisiones de producto ya tomadas

- De momento, **solo fútbol masculino**. La liga femenina llegará más adelante.
- Academy no forma parte del flujo vivo.
- Debe haber una ruta de progreso **gratis**: Basic Packs gratuitos → duplicados → SBC → mejores sobres.
- Los Draft son **gratis**.
- El Draft objetivo es un pequeño torneo de 4 rondas contra rivales progresivamente más duros; el puesto define una recompensa moderada.
- Los SBC/DCP son manuales y solo pueden consumir **duplicados**.
- La última copia de una carta nunca se consume en SBC.
- El mismo futbolista no puede aparecer dos veces en la misma plantilla SBC aunque existan varias copias repetidas.
- Química inspirada en FUT moderno: club / nación / liga, hasta 3 puntos por jugador.
- Química global normalizada a 0–100.
- Valoración máxima de plantilla: **199 = 99 GRL + 100 química**.
- Las cartas dentro de XI, Draft y SBC deben conservar exactamente su material/rareza real: un bronce no puede verse plata, un TOTW debe seguir siendo TOTW, etc.
- TOTW Lab es contenido simulado de PackVerse. Para jugadores ya altos, el primer IF suele plantearse como +1 GRL; jugadores bajos pueden recibir un salto inicial mayor.
- Odds, precios y especiales simulados deben quedar claramente separados de los datos oficiales de EA.

---

## ✅ LO QUE YA FUNCIONA BIEN / BASE ESTABLE

- PWA mobile-first con GitHub Pages.
- Vista desktop tipo Companion añadida a partir de V0.11.
- Navegación principal clara: Inicio / Packs / Club / XI / Más.
- Colección persistente en `localStorage`.
- Duplicados y economía conectados al inventario.
- Basic Pack gratuito.
- Daily / Premium / packs de recompensa con odds separadas.
- Squad Builder con varias formaciones.
- Química y valoración /199.
- SBC manual con duplicados y protección de última copia.
- Regla anti-mismo-jugador en SBC.
- Draft base funcional.
- Distinción de materiales: bronce/plata/oro común y premium + TOTW.
- Mobile es actualmente la presentación más sólida del producto.

---

## 🚨 PROBLEMAS PRINCIPALES ACTUALES

### P0 — Integridad de datos y assets

Este es el mayor problema del producto ahora mismo.

Todavía pueden aparecer:

- jugadores con foto/camiseta que no corresponde al club de la carta;
- escudos de equipos homónimos o incorrectos;
- logos de liga ausentes;
- imágenes de jugador con recortes inconsistentes;
- siluetas donde debería existir una imagen verificable;
- assets remotos que dependen demasiado de matching flexible.

**Regla de oro:** es preferible una silueta correcta que una foto equivocada.

El resolver actual de `main` sigue siendo demasiado permisivo: si no encuentra un match exacto de nombre, puede terminar aceptando otro jugador del mismo equipo, y además acepta `strThumb`, que produce recortes visualmente muy dispares. Esto debe endurecerse.

### P0 — Cartas: falta una implementación canónica

El aspecto ha mejorado mucho, pero técnicamente seguimos acumulando overrides de `v4` → `v12`. El resultado es difícil de razonar y pequeñas reglas antiguas pueden reaparecer en Club, XI, Draft o SBC.

Objetivo de la próxima gran pasada:

- **una única geometría de carta**;
- una única geometría de field-card;
- slots fijos para GRL/posición, jugador, nombre, 6 stats, país, competición y club;
- mismos materiales en todas las pantallas;
- proporciones escalables por container units;
- ninguna vista debe tener su propia interpretación visual de una rareza.

### P0 — Fotos de jugadores

Es la pieza que más hace que PackVerse se sienta producto real o prototipo.

Política deseada:

1. foto oficial / asset verificado del club o proveedor fiable;
2. si no existe, cutout solo con **nombre exacto + club actual exacto/verificado**;
3. nunca aceptar una foto solo porque el futbolista o el equipo “se parecen”;
4. nunca usar una camiseta antigua si la carta representa al club actual;
5. si no pasa la verificación → silueta;
6. distinguir en CSS entre foto rectangular oficial y cutout transparente para normalizar ambos a un busto similar.

### P1 — Logos de club, liga y banderas

Hace falta una tabla canónica de identidad por club/competición/nación. No depender únicamente de búsquedas remotas cada vez que se pinta una carta.

Objetivo:

- pin de logos oficiales/validados para equipos y ligas prioritarias;
- aliases controlados;
- validación de deporte + país + liga para cualquier fallback externo;
- flags siempre con el mismo wrapper SVG y mismas proporciones;
- fallback visual neutro, nunca un logo incorrecto.

### P1 — Walkout / opening

El opening normal puede ser rápido, pero debe existir una pequeña animación de pack para que abrir incluso basura tenga feedback.

Para 85+/86+ el walkout debe ser bastante más elegante y deliberado:

- oscuridad / escenario sobrio;
- reveal progresivo;
- bandera → posición → club → GRL → carta;
- pausas reales que permitan reconocer la información;
- 87+, 90+ y especiales escalan el suspense;
- bloqueo de skip al principio;
- nada de textos/beeps cursis;
- debe sentirse premium, no lento porque sí.

### P1 — Club

Hay que garantizar en browser real:

- `Todos` nunca oculta cartas;
- `Especiales` muestra todos los especiales;
- `84+` muestra todo 84+;
- filtros de posición/liga/rareza/duplicados combinables;
- grids y scroll sin recortes;
- cards iguales a las del resto del juego.

El bug reportado de no ver especiales/84+ está resuelto en la rama V0.12 completa, pero **no se debe dar por arreglado en `main` hasta reconciliarla**.

### P1 — Draft

El Draft base existe, pero el objetivo final es:

1. elegir formación;
2. 5 candidatos por posición;
3. completar XI;
4. mostrar el mismo diseño de field-card que Mi XI;
5. simular OCTAVOS → CUARTOS → SEMIFINAL → FINAL;
6. rival progresivamente más duro;
7. probabilidad basada en GRL + química;
8. recompensa según victorias, sin romper la economía.

La rama V0.12 ya contiene una primera implementación y smoke de este loop; aún no está reconciliada con producción.

### P1 — Pool de jugadores

Necesitamos mucha más profundidad real.

Prioridad de expansión:

1. terminar bien **LALIGA HYPERMOTION**;
2. LaLiga;
3. Premier League;
4. Bundesliga / Serie A / Ligue 1;
5. resto de ligas masculinas relevantes.

Además hacen falta suficientes bronces reales por posición para que el camino Basic Pack → SBC de bronce sea viable.

El dataset de producción anterior a la expansión completa rondaba 223 cartas masculinas y 119 HYPERMOTION; la rama V0.12 completa ya expande esto y añade más bronces, pero todavía no está integrada con `main`.

### P2 — SBC/DCP

La base manual está bien. Próxima capa:

- UX más parecida a construir una plantilla real;
- requisitos muy visibles;
- feedback al cumplir cada requisito;
- grupos de desafíos;
- SBC de mejora repetibles;
- SBC de jugadores/promos en el futuro;
- streamlined SBC para upgrades simples como sistema secundario, no sustituto del builder clásico.

---

## 🧱 DEUDA TÉCNICA QUE NO DEBEMOS SEGUIR ACUMULANDO

El proyecto nació iterando muy rápido y actualmente `index.html` carga capas sucesivas (`v4`, `v5`, `v6`… `v12`) que parchean funciones y estilos anteriores.

Eso ha sido útil para prototipar, pero ya empieza a producir efectos secundarios:

- resolvers viejos y nuevos se envuelven entre sí;
- CSS antiguo puede volver a ganar por especificidad/cascade;
- una vista puede seguir usando una clase antigua aunque otra ya use la nueva;
- es difícil saber cuál es la implementación canónica de card / asset / draft.

**Antes de seguir metiendo modos grandes**, conviene que V0.13 sea parcialmente una versión de consolidación:

- `data/` para jugadores, clubes, ligas, packs y promos;
- `core/` para estado/economía/química;
- `components/` para Card, FieldCard, Badge, Flag, Pack;
- `features/` para Club, Squad, Draft, SBC;
- un único asset resolver;
- una única hoja de estilos por componente.

No hace falta migrar a React todavía; la app puede seguir en vanilla JS mientras la arquitectura sea clara.

---

## 🧪 REGLA DE RELEASE — SMOKE IA + HUMANO OBLIGATORIO

Una release no se considera terminada solo porque compile.

### 1. Smoke de motor / IA

Debe validar como mínimo:

- sintaxis de todo el runtime;
- IDs únicos y metadata completa;
- todos los tipos de carta;
- cientos de Basic Packs;
- todos los otros packs repetidamente;
- nunca repetir la misma carta dos veces dentro del mismo pack salvo una regla explícita;
- distribución razonable de bronces;
- Club: All / Especial / 84+;
- las 6+ formaciones;
- química ≤100, GRL ≤99 y total ≤199;
- Draft completo + derrota temprana;
- dificultad progresiva y rewards acotadas;
- SBC inicial matemáticamente viable;
- última copia protegida;
- un futbolista máximo una vez por SBC;
- asset/card regression tests.

### 2. Smoke de Chromium real

Debe ejecutarse en al menos:

- móvil ~390×844;
- desktop Companion ~1440×900.

Comprobar físicamente:

- foto no pisa nombre;
- nombre no pisa stats;
- stats no pisan identidad;
- no hay overflow horizontal;
- Club renderiza especiales y 84+;
- XI/Draft muestran 11 cartas con la rareza correcta;
- desktop usa sidebar y no layout de móvil estirado;
- cero excepciones JS.

Guardar screenshots del smoke como artifacts del workflow para auditoría humana.

**Nota:** `scripts/browser-smoke-v12.mjs` ya existe en la rama V0.12, pero todavía no está conectado al workflow de esa rama ni integrado en `main`.

### 3. Revisión humana

Antes del merge revisar manualmente como mínimo:

- 1 bronce común;
- 1 bronce premium;
- 1 plata;
- 1 oro;
- 1 TOTW;
- 1 carta con foto oficial rectangular;
- 1 carta con cutout transparente;
- 1 carta con silueta;
- Club móvil + desktop;
- XI;
- Draft;
- SBC;
- Basic Pack;
- pack con walkout;
- scroll / safe area / clicks / selección de jugadores.

Solo después: merge → esperar Pages → abrir URL pública → smoke corto de producción.

---

## 🌿 ESTRATEGIA DE BRANCHES RECOMENDADA

Estado actual: **no existe `dev` todavía**.

Cuando se reconcilie V0.12:

- `main` = versión estable que publica GitHub Pages;
- `dev` = integración de la próxima release;
- `feature/...` = cambios aislados;
- PR a `dev` para features grandes;
- PR `dev` → `main` solo después del smoke completo.

No crear/mover `dev` hasta resolver la divergencia actual entre `main` y `v0.12-madfut-draft-smoke`.

---

## 🧭 HANDOFF PARA OTRO CHAT / OTRA SESIÓN

Si se retoma PackVerse desde un chat nuevo:

1. **Leer este README completo.**
2. Consultar las ramas y los últimos commits reales de GitHub; no confiar solo en memoria de conversación.
3. Comprobar `main`, `v0.12-madfut-draft-smoke` y PR #10 antes de programar.
4. No asumir que “V0.12” significa lo mismo en live y en la rama V0.12 mientras el PR siga abierto.
5. Mantener las decisiones de producto de este README.
6. Antes de cada release: smoke IA + Chromium + humano.
7. Tras cada actualización desplegada, pasar siempre al usuario el enlace de Pages.
8. Actualizar esta sección `ESTADO ACTUAL` y `Siguiente movimiento correcto` cuando cambie la versión/branch/PR.

**Siguiente tarea recomendada en este momento:** reconciliar V0.12 completa con los commits V0.12 que entraron directamente en `main`, y convertir esa reconciliación en una base estable antes de seguir ampliando contenido.

---

## 📁 ARQUITECTURA ACTUAL

La arquitectura real todavía es incremental:

```text
.
├── index.html
├── js/data.js
├── v4/ … v12/             # capas históricas de features / overrides
├── scripts/
│   ├── validate-v4.mjs
│   └── (en la rama V0.12) smoke-v12.mjs + browser-smoke-v12.mjs
├── assets/
├── manifest.json
├── sw.js
└── .github/workflows/
```

Esto debe consolidarse gradualmente en lugar de seguir creando capas infinitas.

---

## 📌 CONTENIDO Y FUENTES

PackVerse no está afiliado a EA.

- Ratings base: cuando se indica que son oficiales, deben venir de la base oficial vigente de EA FC 27.
- TOTW Lab / promos inventadas / odds / precios: simulados por PackVerse.
- Assets de jugador/club/liga: priorizar fuentes oficiales o coincidencias verificadas; no sacrificar exactitud por “tener una foto”.
- Si un asset no es fiable, usar fallback neutro.

---

## ▶️ LOCAL

```bash
python run_local_server.py
```

Abrir `http://127.0.0.1:8080`.
