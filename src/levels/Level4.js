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

    // ── Suelo de HIELO por TRAMOS (bloques sólidos; huecos = vacío mortal) ──
    ground: {
        texture: 'ice',
        segments: [
            { x: 0,    width: 1500 }, // G1  0..1500
            { x: 1650, width: 950  }, // G2  1650..2600   (AGUJERO 1: 1500..1650)
            { x: 2750, width: 1150 }, // G3  2750..3900   (AGUJERO 2: 2600..2750)
            { x: 4050, width: 1550 }, // G4  4050..5600   (AGUJERO 3: 3900..4050)
        ],
    },

    // ── Plataformas elevadas (hielo deslizante / piedra de agarre) ──
    platforms: [
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

    // ── Decoraciones (cumbre helada, por capas de profundidad) ──
    //  depth 3  → rocas nevadas, bloques de glaciar y pinos de fondo (atenuados)
    //  depth 6  → suelo: hielo, lagos congelados, carámbanos, dunas, muñecos…
    //  depth 12 → primer plano que enmarca (pinos nevados, racimos de hielo)
    //  IMPORTANTE: todo se coloca sobre los TRAMOS DE SUELO sólidos
    //  (0-1500, 1650-2600, 2750-3900, 4050-5600), nunca sobre los agujeros.
    decorations: [
        // ══ FONDO (depth 3) — rocas nevadas, glaciar y pinos, atenuados ══
        { texture: 'snow_rock',   x: 250,  depth: 3, scale: 1.2,  tint: 0xd2e2f0 },
        { texture: 'ice_boulder', x: 850,  depth: 3, scale: 1.15, tint: 0xd2e2f0 },
        { texture: 'snow_pine',   x: 1150, depth: 3, scale: 1.3,  tint: 0xd2e2f0 },
        { texture: 'snow_rock',   x: 1850, depth: 3, scale: 1.2,  tint: 0xd2e2f0, flipX: true },
        { texture: 'ice_boulder', x: 2350, depth: 3, scale: 1.2,  tint: 0xd2e2f0 },
        { texture: 'snow_pine',   x: 2900, depth: 3, scale: 1.4,  tint: 0xd2e2f0 },
        { texture: 'snow_rock',   x: 3400, depth: 3, scale: 1.2,  tint: 0xd2e2f0, flipX: true },
        { texture: 'ice_boulder', x: 4300, depth: 3, scale: 1.15, tint: 0xd2e2f0 },
        { texture: 'snow_pine',   x: 4900, depth: 3, scale: 1.35, tint: 0xd2e2f0 },
        { texture: 'snow_rock',   x: 5250, depth: 3, scale: 1.2,  tint: 0xd2e2f0, flipX: true },

        // ══ SUELO (depth 6) — hielo, lagos, carámbanos, dunas, figuras ══
        // Tramo 1 (0-1500)
        { texture: 'snow_mound',  x: 150,  depth: 6, scale: 1.2 },
        { texture: 'snow_pine',   x: 340,  depth: 6 },
        { texture: 'frozen_lake', x: 560,  depth: 6, scale: 1.1 },
        { texture: 'ice_cluster', x: 640,  depth: 6 },
        { texture: 'snowman',     x: 900,  depth: 6 },
        { texture: 'ice_spike',   x: 1080, depth: 6 },
        { texture: 'snow_rock',   x: 1300, depth: 6 },
        { texture: 'icicles',     x: 440,  y: 668,  originY: 0, depth: 6 },   // bajo plataforma 400/660
        { texture: 'icicles',     x: 1290, y: 568,  originY: 0, depth: 6 },   // bajo plataforma 1250/560
        // Tramo 2 (1650-2600)
        { texture: 'snow_mound',  x: 1720, depth: 6, scale: 1.1 },
        { texture: 'frozen_lake', x: 1900, depth: 6, scale: 1.2 },
        { texture: 'ice_cluster', x: 2000, depth: 6 },
        { texture: 'snowman',     x: 2300, depth: 6 },
        { texture: 'ice_spike',   x: 2480, depth: 6 },
        { texture: 'ice_boulder', x: 2540, depth: 6 },
        { texture: 'icicles',     x: 2000, y: 568,  originY: 0, depth: 6 },   // bajo plataforma 1960/560
        // Tramo 3 (2750-3900)
        { texture: 'snow_mound',  x: 2820, depth: 6, scale: 1.1 },
        { texture: 'ice_cluster', x: 3050, depth: 6 },
        { texture: 'snow_pine',   x: 3200, depth: 6 },
        { texture: 'frozen_lake', x: 3400, depth: 6, scale: 1.2 },
        { texture: 'ice_spike',   x: 3600, depth: 6 },
        { texture: 'snowman',     x: 3800, depth: 6 },
        { texture: 'icicles',     x: 3100, y: 568,  originY: 0, depth: 6 },   // bajo plataforma 3060/560
        { texture: 'icicles',     x: 3740, y: 478,  originY: 0, depth: 6 },   // bajo plataforma 3700/470
        // Tramo 4 (4050-5600)
        { texture: 'snow_mound',  x: 4120, depth: 6, scale: 1.2 },
        { texture: 'frozen_lake', x: 4300, depth: 6, scale: 1.3 },
        { texture: 'ice_cluster', x: 4500, depth: 6 },
        { texture: 'snow_pine',   x: 4750, depth: 6 },
        { texture: 'ice_spike',   x: 4950, depth: 6 },
        { texture: 'snow_rock',   x: 5100, depth: 6 },
        { texture: 'snowman',     x: 5300, depth: 6 },
        { texture: 'ice_cluster', x: 5480, depth: 6 },
        { texture: 'icicles',     x: 4870, y: 608,  originY: 0, depth: 6 },   // bajo plataforma 4830/600

        // ══ PRIMER PLANO (depth 12) — enmarca (silueta fría / hielo) ══
        { texture: 'snow_pine',   x: 520,  depth: 12, scale: 1.7, alpha: 0.8,  tint: 0x8fa8c0 },
        { texture: 'ice_cluster', x: 1420, depth: 12, scale: 1.5, alpha: 0.85 },
        { texture: 'snow_pine',   x: 2500, depth: 12, scale: 1.7, alpha: 0.8,  tint: 0x8fa8c0, flipX: true },
        { texture: 'ice_cluster', x: 3350, depth: 12, scale: 1.6, alpha: 0.85 },
        { texture: 'snow_pine',   x: 4750, depth: 12, scale: 1.7, alpha: 0.8,  tint: 0x8fa8c0 },
        { texture: 'ice_cluster', x: 5280, depth: 12, scale: 1.5, alpha: 0.85 },
    ],

    // ── Portal de salida (sobre la plataforma de piedra final) ──
    exit: { x: 5450, y: 356 },
};
