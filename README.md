# 🎮 JumpQuest – Pixel Adventure

Un juego de plataformas 2D estilo retro arcade construido con **Phaser 3** y JavaScript puro (ES Modules). Sin dependencias de backend, sin build system — sirve el proyecto con un servidor local y juega.

---

## 🕹️ Controles

| Acción | Teclas |
|---|---|
| Mover | `←` `→` / `A` `D` |
| Saltar | `↑` / `W` / `Espacio` |
| Salto largo | Mantén la tecla de salto |
| Pausa | `ESC` |

---

## 🧩 Características

- ✅ Movimiento con aceleración y fricción realistas
- ✅ **Personaje animado**: frames de idle, caminar (2 fotogramas), salto y caída generados por código
- ✅ Salto variable (corto / largo según cuánto mantienes)
- ✅ Coyote Time + Jump Buffer para control preciso
- ✅ Plataformas estáticas (`grass` / `stone`) y móviles (horizontal / vertical)
- ✅ Enemigos con IA básica: **slimes** 🟢 (patrullan y rebotan) y **murciélagos** 🦇 (flotan con movimiento sinusoidal)
- ✅ Matar enemigos saltando sobre ellos
- ✅ **Agujeros mortales** en el suelo (caer al vacío = muerte)
- ✅ **Puentes suspendidos temporizados** que se rompen y derrumban si te entretienes sobre ellos
- ✅ **Deslizamiento sobre hielo**: en superficies heladas el personaje conserva la inercia y sigue resbalando al soltar el mando
- ✅ **Checkpoints** de reaparición por nivel (data-driven)
- ✅ Monedas 🪙 (100 pts) y Estrellas ⭐ (500 pts)
- ✅ Portal de salida al final del nivel
- ✅ Sistema de vidas (3) + invencibilidad tras golpe
- ✅ **Mapa de selección de niveles** interactivo con camino, nodos y candados
- ✅ **Progreso persistente** (localStorage): niveles desbloqueados y estrellas por nivel
- ✅ **Calificación de 1–3 estrellas** por nivel según la puntuación final
- ✅ Cámara con follow suave y deadzone
- ✅ Partículas: polvo al saltar/aterrizar, destellos al recoger ítems
- ✅ HUD con **marcador de puntuación** en la esquina superior izquierda (actualización en tiempo real), vidas y monedas
- ✅ **Menú con cutscene cíclica estilo Super Mario**: el personaje entra por un lateral, recorre unas plataformas, derrota a un slime de un pisotón y sale de escena; se repite en bucle detrás de la UI, sobre un fondo de colinas parallax, nubes a la deriva y luna con halo
- ✅ Pantalla de controles desde el menú
- ✅ Menú de pausa (ESC): Reanudar / Reiniciar nivel / Volver al mapa, navegable con teclado (↑↓/Enter) y ratón
- ✅ Game Over y pantalla de victoria con puntuación final
- ✅ **Fondos temáticos por nivel** con parallax: bosque diurno (sol, colinas, nubes, hojas) vs. cueva subterránea (muro rocoso, cristales, viñeta, motas de polvo)
- ✅ Sonidos sintetizados con Web Audio API (sin archivos externos)
- ✅ Estética pixel art retro con efecto CRT scanlines

---

## 📁 Estructura del Proyecto

```
JumpQuest/
├── index.html                  # Punto de entrada
├── style.css                   # Estilos globales + efecto CRT scanlines
└── src/
    ├── main.js                 # Config de Phaser + escenas (Boot, Menu, HUD, Pause, Game, GameOver, Win)
    ├── core/
    │   ├── Player.js           # Lógica del jugador (movimiento, vidas, saltos)
    │   └── Platform.js         # Plataformas estáticas/móviles + detección de superficie
    ├── textures/               # Módulos de textura por categoría (procedurales)
    │   ├── textureUtil.js      # Helper compartido: defineTexture(scene, key, w, h, draw)
    │   ├── index.js            # Registro + buildAllTextures(scene) + re-exports
    │   ├── TerrainTextures.js  # Tiles de plataforma (césped, piedra, móvil, hielo)
    │   ├── CollectibleTextures.js # Moneda, estrella
    │   ├── EnemyTextures.js    # Slime, murciélago
    │   ├── StructureTextures.js   # Portal (+partícula), puente, pilar, tótem
    │   ├── VegetationTextures.js  # Árboles, arbustos, helechos, flores, rocas, troncos…
    │   ├── CaveTextures.js     # Estalactitas, estalagmitas, cristales
    │   └── SnowTextures.js     # Pino nevado, muñeco de nieve
    ├── mechanics/              # Mecánicas modulares, reutilizables por cualquier nivel
    │   ├── BridgeSystem.js     # Puentes suspendidos temporizados que se derrumban
    │   └── SurfacePhysics.js   # Reglas de fricción por superficie (hielo, normal, …)
    ├── map/
    │   └── MapScene.js         # Mapa de selección de niveles + progreso (localStorage)
    ├── levels/
    │   ├── Level.js            # Constructor del nivel (plataformas, puentes, enemigos, ítems)
    │   ├── Level1.js           # Datos del nivel 1-1 "Bosque Inicial" (5600 px, 7 secciones, slimes)
    │   ├── Level2.js           # Datos del nivel 1-2 "Cuevas Oscuras" (5600 px, slimes + murciélagos)
    │   ├── Level3.js           # Datos del nivel 1-3 "Puentes Rotos" (agujeros mortales + puentes temporizados)
    │   └── Level4.js           # Datos del nivel 1-4 "Cumbre Helada" (deslizamiento sobre hielo)
    └── systems/
        └── BackgroundSystem.js # Fondos parallax por tema ('forest' / 'cave' / 'ruins' / 'snow')
```

---

## 🎬 Escenas

| Escena | Descripción |
|---|---|
| `BootScene` | Precarga y síntesis de sonidos con Web Audio API |
| `MenuScene` | Menú principal: cutscene cíclica (el personaje recorre plataformas y derrota a un slime) tras la UI + botones |
| `MapScene` | Mapa de selección de niveles con progreso persistente |
| `GameScene` | Gameplay principal (recibe `levelData`, `levelName`, `levelId`) |
| `HUDScene` | UI superpuesta: puntuación (esquina superior izquierda), vidas y monedas, en tiempo real |
| `PauseScene` | Menú de pausa (ESC): Reanudar / Reiniciar nivel / Volver al mapa, con navegación por teclado y ratón |
| `GameOverScene` | Game over con puntuación final y partículas |
| `WinScene` | Victoria con lluvia de estrellas, estrellas ganadas y guardado de progreso |

**Flujo de escenas:** `Menú → Mapa → Juego → Victoria → Mapa` (o `Game Over → reintentar`).

---

## 🚀 Cómo Jugar

> ⚠️ El proyecto usa **ES Modules** (`type="module"`), por lo que **no funciona abriéndolo directamente como archivo local** en Chrome/Edge. Necesitas un servidor local.

**Con Python:**
```bash
python3 -m http.server 8080
```

**Con Node.js:**
```bash
npx serve .
```

**Con VS Code:**
Instala la extensión **Live Server** y haz clic en "Go Live".

Luego abre `http://localhost:8080` en tu navegador.

---

## 🎨 Diseño Técnico

### Gráficos
Todos los assets son **generados proceduralmente** con la API `Graphics` de Phaser 3 — no hay archivos de imagen externos. Las texturas se crean una sola vez con `generateTexture()` y se reutilizan desde la caché de Phaser.

**Arquitectura modular** (`src/textures/`): las texturas se dividen en **módulos por categoría** (`TerrainTextures`, `CollectibleTextures`, `EnemyTextures`, `StructureTextures`, `VegetationTextures`, `CaveTextures`, `SnowTextures`), cada uno con `static build(scene)` y apoyado en el helper compartido `defineTexture()` (sin duplicar boilerplate). El índice `textures/index.js` expone `buildAllTextures(scene)` (construir todo) y re-exporta cada módulo para importarlo suelto donde haga falta. **Añadir una categoría nueva** = crear su archivo `*Textures.js` y sumarlo al registro; no hay que tocar el resto de la arquitectura. Así la gestión de recursos gráficos queda desacoplada de la lógica de cada nivel.

Assets generados: `platform_tile`, `platform_stone`, `platform_moving`, `player_idle` / `player_walk_a` / `player_walk_b` / `player_jump` / `player_fall`, `coin`, `enemy_slime`, `enemy_bat`, `portal`, `powerstar`, `bush`, `totem`, `stalactite`, `stalagmite`, `cave_crystal`, `bridge_plank`, `broken_pillar`, `glow_px`, `particle_px`, y las texturas de fondo por tema (`bg_sky_forest`, `sun_forest`, `hills_far`, `hills_near`, `cloud_forest`, `leaf_px`, `bg_sky_cave`, `cave_wall`, `bg_crystal`, `mote_px`, `cave_vignette`, `bg_sky_ruins`, `sun_ruins`, `ruins_far`, `ruins_near`, `mist_px`, `platform_ice`, `snow_pine`, `snowman`, `bg_sky_snow`, `sun_snow`, `snow_mtn_far`, `snow_hills`, `snow_px`, y la vegetación de bosque (`tree_oak`, `tree_bg`, `bush_lush`, `fern`, `flower_red`, `flower_yellow`, `rock_moss`, `log_moss`, `roots`, `grass_tuft`, `mushroom_pair`, `fg_fern`, `sun_rays`, `forest_farline`, `forest_mid`, `pollen_px`)).

### Física
- Motor **Arcade Physics** de Phaser 3
- Gravedad variable: más fuerte al caer (`GRAVITY_DOWN = 1600`), más suave al subir (`GRAVITY_UP = 900`)
- Hitboxes ajustadas independientemente del sprite visual
- Plataformas móviles actualizadas vía `body.reset()` cada frame

### Personaje
El jugador se dibuja por código como **5 frames de 24×30 px** (`player_idle`, `player_walk_a`, `player_walk_b`, `player_jump`, `player_fall`) que comparten cabeza y torso y varían brazos y piernas por pose. `Player._animateSprite()` elige el frame cada tick según el estado:

- En el aire → `jump` (subiendo) o `fall` (cayendo).
- En el suelo moviéndose → alterna `walk_a` / `walk_b` con una cadencia proporcional a la velocidad.
- Quieto → `idle`.

Encima se aplican tweens de *squash & stretch* al saltar/aterrizar y una leve inclinación al correr, sin necesidad de spritesheets externos.

### Temas visuales (fondo por nivel)
Cada nivel declara un `theme` en sus datos y `BackgroundSystem.build(theme)` pinta un fondo **completamente distinto**. Es la razón por la que el nivel 1 y el 2 ya no se parecen. Cada tema genera sus propias texturas con claves únicas (p. ej. `bg_sky_forest` vs `bg_sky_cave`) para que un nivel no herede el fondo de otro desde la caché de Phaser.

| Tema | Aspecto | Capas |
|---|---|---|
| `forest` (1-1) | Bosque diurno | Cielo degradado · sol con halo y **rayos de luz** · **línea de árboles lejana** · **bosque intermedio** · colinas · nubes · hojas cayendo · **polen** flotante |
| `cave` (1-2) | Cueva subterránea | Oscuridad · muro rocoso tileado · cristales luminiscentes (blend ADD, pulsantes) · viñeta (blend MULTIPLY) · motas de polvo flotante |
| `ruins` (1-3) | Ruinas al atardecer | Cielo crepuscular · sol bajo en el horizonte · siluetas de torres y puentes rotos (dos capas parallax) · neblina a la deriva |
| `snow` (1-4) | Escenario nevado | Cielo invernal frío · sol pálido · montañas nevadas y colinas (parallax) · copos de nieve cayendo |

Cada capa usa un `scrollFactor` distinto para el efecto **parallax**. Para añadir un tema nuevo, crea un método `_buildX()` en `BackgroundSystem.js`, regístralo en el `switch` de `build()` y referencia el tema desde el `theme` del nivel.

### Enemigos
- **Slime** 🟢 — patrulla horizontalmente sobre plataformas, rebota al chocar con paredes y tiene su propia gravedad.
- **Murciélago** 🦇 — enemigo de cueva; flota sin gravedad describiendo un movimiento sinusoidal en Y (`floatAmplitude` / `floatSpeed`) mientras patrulla en X.
- Ambos se eliminan saltándoles encima (+200 pts): el criterio de "stomp" está basado en **posición** (el jugador desciende y sus pies venían por encima de la cabeza del enemigo), por lo que coincide con lo que se ve en pantalla a cualquier velocidad.

### Decoraciones (por nivel)
Las decoraciones son **data-driven**: cada nivel declara las suyas en `data.decorations` y `Level.js` las dibuja de forma genérica, sin lógica específica por tema. Cada entrada es un descriptor:

```js
decorations: [
  { texture: 'bush', x: 80 },                              // sobre el suelo (default)
  { texture: 'stalactite', x: 160, y: 0, originY: 0, scale: 1.1 }, // colgando del techo
]
```

| Campo | Default | Descripción |
|---|---|---|
| `texture` | — | Clave de la textura (obligatorio) |
| `x` | — | Posición horizontal en el mundo (obligatorio) |
| `y` | `752` (suelo) | Posición vertical |
| `originX` / `originY` | `0.5` / `1` | Origen del sprite (por defecto se apoya en el suelo) |
| `depth` | `4` | Profundidad de render |
| `flipX`, `scale`, `alpha`, `tint` | — | Modificadores opcionales |

Así, `Level1.js` usa vegetación de bosque en **tres capas** (árboles de fondo en `depth 3`, vegetación de suelo en `depth 6`, helechos de primer plano semitransparentes en `depth 12`) y `Level2.js` usa `stalactite` / `stalagmite` / `cave_crystal` (cueva) sin tocar el código del motor. Para un tema nuevo, basta con añadir la textura al módulo de `src/textures/` que corresponda (o crear uno) y referenciarla en el `decorations` del nivel.

Además, `Level._buildPlatformFoliage()` siembra automáticamente **matas de hierba, flores y setas** en el borde superior de las plataformas de `grass` (solo visual, sin física), integrándolas con el entorno. Al depender del `texture` de cada plataforma, cualquier nivel con césped lo obtiene gratis.

### Mecánicas modulares (`src/mechanics/`)
Cada mecánica del juego se implementa como un **módulo independiente** en `src/mechanics/`, encapsulando solo su lógica. Ni los niveles ni el controlador del jugador contienen la lógica de una mecánica concreta: la **importan** y **la invocan**. Esto mantiene una separación clara de responsabilidades y permite reutilizar cualquier mecánica en varios niveles sin duplicar código.

| Módulo | Mecánica | API principal |
|---|---|---|
| [`BridgeSystem.js`](src/mechanics/BridgeSystem.js) | Puentes temporizados que se derrumban | `build(defs)` · `addColliders(player, enemies)` · `reset()` |
| [`SurfacePhysics.js`](src/mechanics/SurfacePhysics.js) | Fricción por superficie (hielo, …) | `surfacePhysics(surface)` → `{ accel, drag }` |

**Patrón para una mecánica nueva:** crea `src/mechanics/MiMecanica.js` con una clase (que reciba la `scene`) o funciones puras; expón métodos claros; instánciala/refréncala desde el nivel o la escena que la necesite. Ejemplo de uso (puentes, en `Level.js`):

```js
import BridgeSystem from '../mechanics/BridgeSystem.js';
this.bridgeSystem = new BridgeSystem(scene).build(data.bridges);
// y desde GameScene:  bridgeSystem.addColliders(player, enemies)
```

### Superficies y deslizamiento (nivel 1-4)
La física de movimiento en suelo depende del **tipo de superficie** que pisa el jugador, definido de forma **reutilizable** (no acoplado a ningún nivel):

- Cada plataforma declara su material vía `texture` en los datos: `'grass'` / `'stone'` (agarre normal) o `'ice'` (deslizante). `PlatformManager` genera la textura y etiqueta cada tile con su `surface`.
- `PlatformManager.addColliders(sprite, onSurface)` detecta genéricamente el tile bajo los pies del jugador y reporta su superficie cada frame.
- Las **reglas** de cada superficie (aceleración + fricción) viven en el módulo [`mechanics/SurfacePhysics.js`](src/mechanics/SurfacePhysics.js). `Player` solo las consulta con `surfacePhysics(surface)` y las aplica en `update()` — no contiene lógica de hielo. En hielo la fricción es baja → al soltar el mando el personaje **sigue deslizándose**, y la aceleración es menor → cuesta arrancar y cambiar de dirección.

Añadir un material nuevo (p. ej. barro, arena) = añadir una clave a `SurfacePhysics.js` y su textura. **Cualquier nivel** que use ese `texture` lo obtiene automáticamente, sin tocar `Player` ni el nivel.

### Mecánicas de peligro (nivel 1-3)
El nivel "Puentes Rotos" introduce dos obstáculos y un sistema de reaparición, todos **data-driven**:

- **Agujeros mortales** — El suelo se define como varios **tramos** (`platforms` con la misma Y); los espacios entre ellos son huecos. `PlatformManager.fillGroundBottom()` solo rellena bajo los tramos reales, así que bajo los huecos hay vacío. El borde inferior del mundo se desactiva (`setBoundsCollision(…, false)`) para que el jugador caiga; al cruzar la línea de muerte, pierde una vida.
- **Puentes suspendidos temporizados** (`data.bridges: [{ x, y, width, fuse, breakTime }]`) — Mecánica encapsulada en el módulo [`mechanics/BridgeSystem.js`](src/mechanics/BridgeSystem.js). Al pisarlos arranca la mecha (`fuse` ms). Al agotarse, tiemblan fuerte (`breakTime` ms) y se **derrumban**: los tablones dejan de colisionar y caen, así que quien esté encima cae al vacío. Bajo ellos no hay suelo. El tiempo basta para cruzar corriendo, no para entretenerse.
- **Checkpoints** (`data.checkpoints: [{ x, y }]`) — Al morir por caída (si quedan vidas), el jugador reaparece en el último checkpoint superado y los puentes derrumbados se **reconstruyen** (`bridgeSystem.reset()`).

### Mapa y Progreso
La `MapScene` es un mapa del mundo con nodos de nivel conectados por un camino. Cada nodo puede estar **bloqueado** (🔒), **disponible** o **completado** (con 1–3 estrellas), y el nivel jefe se marca con 👑.

El progreso se guarda en `localStorage` bajo la clave `jumpquest_progress`:

```json
{
  "level_1": { "unlocked": true, "stars": 3 },
  "level_2": { "unlocked": true, "stars": 0 }
}
```

- Completar un nivel **desbloquea el siguiente** y guarda las estrellas ganadas (solo se sube el récord, nunca baja).
- Las **estrellas** se otorgan según la puntuación final: `≥700 → ★★★`, `≥300 → ★★☆`, resto `★☆☆`.
- El nivel `level_1` siempre está desbloqueado por defecto.

> ℹ️ Los niveles `1-1` (Bosque Inicial), `1-2` (Cuevas Oscuras), `1-3` (Puentes Rotos) y `1-4` (Cumbre Helada) son jugables. Solo el nodo `1-5` (jefe) del mapa aún apunta a `levelData: null` y muestra un aviso de **"Próximamente"** hasta que se cree y enlace en `LEVEL_DEFS` dentro de `MapScene.js`.

### Nivel 1
El nivel tiene **5600 px de ancho** y está dividido en 7 secciones de dificultad creciente:

| Sección | Rango X | Descripción |
|---|---|---|
| 1 | 0 – 1000 | Introducción, saltos sencillos |
| 2 | 1000 – 1800 | Plataformas de piedra escalonadas |
| 3 | 1800 – 2400 | Plataformas móviles (horizontal y vertical) |
| 4 | 2400 – 3300 | Combinación de tipos |
| 5 | 3300 – 4000 | Puente roto, saltos precisos |
| 6 | 4000 – 4700 | Torre ascendente en zigzag |
| 7 | 4700 – 5600 | Tramo final de alta dificultad + portal |

### Audio
Todos los sonidos se sintetizan en tiempo de ejecución con la **Web Audio API** en `BootScene`:

| Clave | Descripción |
|---|---|
| `sfx_jump` | Tono ascendente con envelope exponencial |
| `sfx_land` | Ruido blanco con decay rápido |
| `sfx_collect` | Dos notas ascendentes |
| `sfx_hit` | Onda cuadrada con ruido |
| `sfx_portal` | Sweep ascendente |

---

## 🔧 Configuración / Debug

En `src/main.js`, en la configuración de Phaser:

```js
physics: {
  arcade: {
    debug: true  // ← activa hitboxes visibles
  }
}
```

En `src/core/Player.js` puedes ajustar las constantes de movimiento:

```js
this.SPEED         = 180;   // velocidad máxima horizontal (px/s)
this.ACCELERATION  = 900;   // aceleración en suelo (px/s²)
this.JUMP_VELOCITY = -520;  // impulso inicial de salto
this.GRAVITY_UP    = 900;   // gravedad al subir
this.GRAVITY_DOWN  = 1600;  // gravedad al caer
this.COYOTE_TIME   = 100;   // ms de gracia tras salir del borde
this.JUMP_BUFFER   = 120;   // ms de buffer de salto anticipado
```

Para añadir nuevos niveles:

1. Crea un archivo en `src/levels/` siguiendo la estructura de `Level1.js` / `Level2.js` (con `worldWidth`, `platforms`, `movingPlatforms`, `coins`, `stars`, `enemies` y `exit`). Para añadir un murciélago, marca el enemigo con `type: 'bat'` y opcionalmente `floatAmplitude` / `floatSpeed`.
2. Impórtalo en `src/map/MapScene.js` y enlázalo en la entrada correspondiente de `LEVEL_DEFS` (`levelData: TuNivelData`). Al hacer clic en su nodo, `MapScene` inicia `GameScene` pasándole `{ levelData, levelName, levelId }`.

El `levelId` (ej. `level_2`) es la clave usada para guardar su progreso y estrellas en `localStorage`.

**Colocación de estrellas:** al construir el nivel, `Level._findValidStarPosition()` valida cada estrella de `stars`: nunca se colocan **detrás del portal de salida** (deben cogerse antes de terminar) ni **pegadas a una moneda u otra estrella** (distancia mínima de 44 px). Si la posición propuesta no cumple, se busca una válida cercana en espiral; si no hay ninguna, la estrella se descarta. Así, aunque los datos tengan una estrella mal colocada, el juego la corrige automáticamente.

---

## 📦 Dependencias

| Librería | Versión | Carga |
|---|---|---|
| Phaser 3 | 3.60.0 | CDN (jsDelivr) |
| Press Start 2P | – | Google Fonts (via `style.css`) |

No hay dependencias de build (webpack, vite, etc.).

---

## 📝 Licencia

MIT – Libre para usar, modificar y distribuir.

Hecho con ❤️ y muchos píxeles.
