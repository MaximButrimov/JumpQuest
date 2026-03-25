# 🎮 JumpQuest – Pixel Adventure

Un juego de plataformas 2D estilo retro arcade construido con **Phaser 3** y JavaScript puro.  
Sin dependencias de backend, sin build system — abre el `index.html` y juega.

---

## 🕹️ Controles

| Acción       | Teclas                         |
|--------------|--------------------------------|
| Mover        | `←` `→`  /  `A` `D`           |
| Saltar       | `↑`  /  `W`  /  `Espacio`     |
| Salto largo  | Mantén la tecla de salto       |
| Pausa        | `ESC`                          |

---

## 🧩 Características

- ✅ Movimiento con aceleración y fricción realistas  
- ✅ Salto variable (corto / largo según cuánto mantienes)  
- ✅ Coyote Time + Jump Buffer para control preciso  
- ✅ Plataformas estáticas y móviles (horizontal / vertical)  
- ✅ Enemigos con IA básica (patrulla, rebota en paredes)  
- ✅ Matar enemigos saltando sobre ellos  
- ✅ Monedas 🪙 (100 pts) y Estrellas ⭐ (500 pts)  
- ✅ Portal de salida al final del nivel  
- ✅ Sistema de vidas + invencibilidad tras golpe  
- ✅ Cámara con follow suave y deadzone  
- ✅ Partículas: polvo al saltar/aterrizar, destellos al recoger  
- ✅ HUD: puntuación, vidas, monedas, número de nivel  
- ✅ Menú principal animado  
- ✅ Pantalla de pausa  
- ✅ Game Over y pantalla de victoria con puntuación  
- ✅ Fondo parallax multicapa (cielo → montañas → nubes)  
- ✅ Sonidos sintetizados con Web Audio API (sin archivos externos)  
- ✅ Estética pixel art retro con efecto CRT scanlines  

---

## 📁 Estructura del Proyecto

```
jumpquest/
├── index.html          # Punto de entrada
├── style.css           # Estilos globales + efecto CRT
├── js/
│   ├── main.js         # Config Phaser + todas las escenas
│   ├── Player.js       # Lógica del jugador
│   ├── Platform.js     # Plataformas estáticas y móviles
│   └── Level.js        # Diseño del nivel, enemigos, coleccionables
└── assets/             # (reservado para futuros assets externos)
```

---

## 🚀 Cómo Jugar

### Opción A – Abrir directamente
1. Descarga o clona el repositorio  
2. Abre `index.html` en cualquier navegador moderno  
   > ⚠️ Chrome/Edge pueden bloquear scripts locales. Si no funciona, usa la Opción B.

### Opción B – Servidor local
```bash
# Con Python:
python3 -m http.server 8080

# Con Node.js (npx):
npx serve .

# Con VS Code:
# Instala la extensión "Live Server" y haz clic en "Go Live"
```
Luego abre `http://localhost:8080` en tu navegador.

---

## 🎨 Diseño Técnico

### Gráficos
Todos los assets son **generados proceduralmente** con la API `Graphics` de Phaser 3 — no hay archivos de imagen externos.  
Esto hace el proyecto autocontenido y fácil de modificar.

### Física
- Motor **Arcade Physics** de Phaser 3  
- Gravedad variable: más fuerte al caer, más suave al subir  
- Hitboxes ajustadas independientemente del sprite visual  

### Audio
Todos los sonidos se sintetizan en tiempo de ejecución con la **Web Audio API**:
- `sfx_jump` – tono ascendente con envelope exponencial  
- `sfx_land` – ruido blanco con decay rápido  
- `sfx_collect` – dos notas ascendentes  
- `sfx_hit` – onda cuadrada con ruido  
- `sfx_portal` – sweep ascendente  

---

## 🔧 Configuración / Debug

En `js/main.js`, en la sección de configuración de Phaser:

```javascript
physics: {
  arcade: {
    debug: true  // ← activa hitboxes visibles
  }
}
```

En `js/Player.js` puedes ajustar las constantes de movimiento:

```javascript
this.SPEED        = 180;   // velocidad máxima horizontal
this.JUMP_VELOCITY = -520; // impulso de salto
this.COYOTE_TIME  = 100;   // ms de gracia tras el borde
this.JUMP_BUFFER  = 120;   // ms de buffer de salto
```

---

## 📦 Dependencias

| Librería  | Versión | Carga       |
|-----------|---------|-------------|
| Phaser 3  | 3.60.0  | CDN (jsDelivr) |
| Press Start 2P | – | Google Fonts |

No hay dependencias de build (webpack, vite, etc.).

---

## 📝 Licencia

MIT – Libre para usar, modificar y distribuir.

---

*Hecho con ❤️ y muchos píxeles.*