// ══════════════════════════════════════════════════════════════
//  Nivel 1-4 — "Cumbre Helada"
//
//  Escenario nevado inspirado en los niveles de hielo clásicos.
//  Mecánica principal: DESLIZAMIENTO SOBRE HIELO. Las plataformas con
//  `texture: 'ice'` son deslizantes; el jugador conserva la inercia y
//  sigue resbalando al soltar el mando (baja fricción). La lógica NO vive
//  aquí: la aplica el propio Player según la superficie que pisa (ver
//  SURFACE_PHYSICS en Player.js y la detección en Platform.addColliders).
//  Las plataformas `stone` mantienen agarre normal (puntos de descanso).
// ══════════════════════════════════════════════════════════════

export default {
    worldWidth: 5600,
    theme: 'snow',

    // ── Tramos de suelo (y=752). Casi todo HIELO; huecos = vacío mortal ──
    platforms: [
        { x: 0,    y: 752, width: 1500, texture: 'ice' },   // G1  0..1500
        // AGUJERO 1: 1500..1650
        { x: 1650, y: 752, width: 950,  texture: 'ice' },   // G2  1650..2600
        // AGUJERO 2: 2600..2750
        { x: 2750, y: 752, width: 1150, texture: 'ice' },   // G3  2750..3900
        // AGUJERO 3: 3900..4050
        { x: 4050, y: 752, width: 1550, texture: 'ice' },   // G4  4050..5600

        // ── Sección 1 — pista de hielo introductoria (0..1500) ──
        { x: 400,  y: 660, width: 128, texture: 'ice'   },
        { x: 700,  y: 580, width: 128, texture: 'ice'   },
        { x: 1000, y: 640, width: 96,  texture: 'stone' },  // agarre
        { x: 1250, y: 560, width: 128, texture: 'ice'   },

        // ── Sección 2 (1650..2600) ──
        { x: 1760, y: 660, width: 96,  texture: 'ice'   },
        { x: 1960, y: 560, width: 128, texture: 'ice'   },
        { x: 2200, y: 600, width: 96,  texture: 'stone' },  // agarre
        { x: 2420, y: 520, width: 128, texture: 'ice'   },

        // ── Sección 3 (2750..3900) ──
        { x: 2860, y: 650, width: 96,  texture: 'ice'   },
        { x: 3060, y: 560, width: 128, texture: 'ice'   },
        { x: 3290, y: 470, width: 96,  texture: 'stone' },  // agarre
        { x: 3500, y: 560, width: 96,  texture: 'ice'   },
        { x: 3700, y: 470, width: 128, texture: 'ice'   },

        // ── Sección 4 — ascenso final al portal (4050..5600) ──
        { x: 4650, y: 672, width: 112, texture: 'ice'   },
        { x: 4830, y: 600, width: 96,  texture: 'ice'   },
        { x: 5000, y: 528, width: 96,  texture: 'stone' },  // agarre
        { x: 5180, y: 468, width: 96,  texture: 'ice'   },
        { x: 5360, y: 408, width: 180, texture: 'stone' },  // plataforma del portal (con agarre)
    ],

    // ── Plataforma móvil (agarre normal) ─────────────────────
    movingPlatforms: [
        { x: 3960, y: 620, width: 64, config: { axis: 'y', range: 90, speed: 55 } },
    ],

    // ── Checkpoints (tras cada agujero) ──────────────────────
    checkpoints: [
        { x: 1700, y: 700 }, // tras el agujero 1
        { x: 2800, y: 700 }, // tras el agujero 2
        { x: 4110, y: 700 }, // tras el agujero 3
    ],

    // ── Monedas ──────────────────────────────────────────────
    coins: [
        // Sección 1
        [430, 620], [730, 540], [1030, 600], [1280, 520],
        [1200, 700], [1350, 700],
        // Salto sobre el agujero 1
        [1540, 620], [1575, 640], [1610, 620],
        // Sección 2
        [1790, 620], [1990, 520], [2230, 560], [2450, 480],
        // Agujero 2
        [2640, 620], [2675, 640], [2710, 620],
        // Sección 3
        [2890, 610], [3090, 520], [3320, 430], [3530, 520], [3730, 430],
        // Agujero 3
        [3940, 620], [3975, 640], [4010, 620],
        // Sección 4 (ascenso)
        [4700, 632], [4870, 560], [5040, 488], [5220, 428], [5420, 368],
    ],

    // ── Estrellas de poder ───────────────────────────────────
    stars: [
        [1250, 512], // sobre la plataforma alta de la sección 1
        [3290, 430], // cima de la sección 3
        [5450, 360], // junto al portal
    ],

    // ── Enemigos ─────────────────────────────────────────────
    enemies: [
        { x: 500,  y: 730, speed: 60 },
        { x: 1100, y: 730, speed: 70 },
        { x: 1960, y: 538, speed: 65 },
        { x: 2050, y: 730, speed: 75 },
        { x: 3060, y: 538, speed: 80 },
        { x: 3300, y: 730, speed: 85 },
        { x: 4830, y: 578, speed: 80 },
        { x: 4400, y: 730, speed: 90 },

        // Murciélagos sobre los agujeros
        { x: 1575, y: 600, speed: 70, type: 'bat', floatAmplitude: 38 },
        { x: 2675, y: 600, speed: 78, type: 'bat', floatAmplitude: 42 },
        { x: 3975, y: 600, speed: 85, type: 'bat', floatAmplitude: 44 },
    ],

    // ── Decoraciones (nieve) ─────────────────────────────────
    decorations: [
        { texture: 'snow_pine', x: 180  },
        { texture: 'snow_pine', x: 640  },
        { texture: 'snowman',   x: 900  },
        { texture: 'snow_pine', x: 2000 },
        { texture: 'snowman',   x: 2500 },
        { texture: 'snow_pine', x: 3050 },
        { texture: 'snow_pine', x: 3800 },
        { texture: 'snowman',   x: 4300 },
        { texture: 'snow_pine', x: 5000 },
    ],

    // ── Portal de salida (sobre la plataforma de piedra final) ──
    exit: { x: 5450, y: 356 },
};
