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
- ✅ Salto variable (corto / largo según cuánto mantienes)
- ✅ Coyote Time + Jump Buffer para control preciso
- ✅ Plataformas estáticas (`grass` / `stone`) y móviles (horizontal / vertical)
- ✅ Enemigos con IA básica (patrulla, rebota en paredes)
- ✅ Matar enemigos saltando sobre ellos
- ✅ Monedas 🪙 (100 pts) y Estrellas ⭐ (500 pts)
- ✅ Portal de salida al final del nivel
- ✅ Sistema de vidas (3) + invencibilidad tras golpe
- ✅ Cámara con follow suave y deadzone
- ✅ Partículas: polvo al saltar/aterrizar, destellos al recoger ítems
- ✅ HUD: puntuación, vidas, monedas, número de nivel
- ✅ Menú principal animado con mini personaje
- ✅ Pantalla de controles desde el menú
- ✅ Pantalla de pausa (ESC)
- ✅ Game Over y pantalla de victoria con puntuación final
- ✅ Fondo parallax multicapa (cielo → estrellas → montañas → nubes)
- ✅ Sonidos sintetizados con Web Audio API (sin archivos externos)
- ✅ Estética pixel art retro con efecto CRT scanlines

---

## 📁 Estructura del Proyecto

```
JumpQuest/
├── index.html                  # Punto de entrada
├── style.css                   # Estilos globales + efecto CRT scanlines
└── src/
    ├── main.js                 # Config de Phaser + todas las escenas
    ├── core/
    │   ├── Player.js           # Lógica del jugador (movimiento, vidas, física)
    │   └── Platform.js         # Plataformas estáticas y móviles
    ├── levels/
    │   ├── Level.js            # Constructor del nivel (plataformas, enemigos, ítems)
    │   └── Level1.js           # Datos del nivel 1 (5600 px de ancho, 7 secciones)
    └── systems/
        ├── BackgroundSystem.js # Fondo parallax (cielo, estrellas, montañas, nubes)
        └── TextureSystem.js    # Texturas procedurales (moneda, enemigo, portal, estrella, decoraciones)
```

---

## 🎬 Escenas

| Escena | Descripción |
|---|---|
| `BootScene` | Precarga y síntesis de sonidos con Web Audio API |
| `MenuScene` | Menú principal animado con botones y mini personaje |
| `GameScene` | Gameplay principal |
| `HUDScene` | UI superpuesta en paralelo (puntuación, vidas, monedas) |
| `PauseScene` | Pantalla de pausa (lanzada sobre GameScene) |
| `GameOverScene` | Game over con puntuación final y partículas |
| `WinScene` | Victoria con lluvia de estrellas y puntuación |

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

Assets generados: `platform_tile`, `platform_stone`, `platform_moving`, `player_tex`, `coin`, `enemy_slime`, `portal`, `powerstar`, `bush`, `totem`, `glow_px`, `particle_px`, `bg_sky`, `mountain_bg`, `cloud_spr`, `star_px`.

### Física
- Motor **Arcade Physics** de Phaser 3
- Gravedad variable: más fuerte al caer (`GRAVITY_DOWN = 1600`), más suave al subir (`GRAVITY_UP = 900`)
- Hitboxes ajustadas independientemente del sprite visual
- Plataformas móviles actualizadas vía `body.reset()` cada frame

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

Para añadir nuevos niveles, crea un archivo en `src/levels/` siguiendo la estructura de `Level1.js` (con `platforms`, `movingPlatforms`, `coins`, `stars`, `enemies` y `exit`) y pásalo como `levelData` al iniciar `GameScene`.

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
