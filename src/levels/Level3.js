// ══════════════════════════════════════════════════════════════
//  Nivel 1-3 — "Puentes Rotos"
//
//  Zona en ruinas atravesada por estructuras destruidas. Enfatiza el
//  plataformeo (cambios de altura constantes) e introduce dos mecánicas:
//    · AGUJEROS mortales en el suelo (huecos entre tramos de suelo; caer
//      en ellos = muerte y reaparición en el último checkpoint).
//    · PUENTES suspendidos temporizados: al pisarlos arranca una mecha;
//      si te entretienes, se rompen y se derrumban dejando solo vacío.
//
//  Nota de diseño: los tramos de suelo (misma Y) definen dónde HAY suelo;
//  los espacios entre ellos son agujeros/vacío. Los puentes solapan un
//  poco los bordes de suelo para que el paso sea continuo, pero bajo su
//  parte central NO hay suelo (solo vacío mortal).
// ══════════════════════════════════════════════════════════════

export default {
    worldWidth: 5600,
    theme: 'ruins',

    // ── Suelo por TRAMOS (bloques sólidos; los huecos son mortales) ──
    ground: {
        texture: 'stone',
        segments: [
            { x: 0,    width: 1120 }, // G1  0..1120
            { x: 1264, width: 800  }, // G2  1264..2064   (AGUJERO 1: 1120..1264)
            { x: 2360, width: 640  }, // G3  2360..3000   (PUENTE 1: 2064..2360)
            { x: 3220, width: 896  }, // G4  3220..4116   (AGUJERO 2: 3000..3220)
            { x: 4420, width: 512  }, // G5  4420..4932   (PUENTE 2: 4116..4420)
            { x: 5080, width: 520  }, // G6  5080..5600   (AGUJERO 3: 4932..5080)
        ],
    },

    // ── Plataformas elevadas ──────────────────────────────────
    platforms: [
        // ── Sección 1 — escalera de introducción (0..1120) ──
        { x: 260,  y: 672, width: 96,  texture: 'stone' },
        { x: 430,  y: 592, width: 96,  texture: 'stone' },
        { x: 600,  y: 520, width: 96,  texture: 'stone' },
        { x: 780,  y: 600, width: 128, texture: 'stone' },
        { x: 960,  y: 528, width: 96,  texture: 'stone' },

        // ── Sección 2 — dientes de sierra hacia el puente 1 (1264..2064) ──
        { x: 1360, y: 660, width: 96,  texture: 'stone' },
        { x: 1520, y: 560, width: 96,  texture: 'stone' },
        { x: 1690, y: 640, width: 96,  texture: 'stone' },
        { x: 1850, y: 540, width: 96,  texture: 'stone' },
        { x: 2150, y: 560, width: 96,  texture: 'stone' }, // ruta alta sobre el puente 1

        // ── Sección 3 — ascenso tras el puente 1 (2360..3000) ──
        { x: 2440, y: 660, width: 96,  texture: 'stone' },
        { x: 2600, y: 560, width: 96,  texture: 'stone' },
        { x: 2760, y: 476, width: 96,  texture: 'stone' },
        { x: 2900, y: 584, width: 96,  texture: 'stone' },

        // ── Agujero 2 — piedra intermedia para cruzar en dos saltos ──
        { x: 3072, y: 688, width: 64,  texture: 'stone' },

        // ── Sección 4 — plataformeo alto y dinámico (3220..4116) ──
        { x: 3300, y: 650, width: 96,  texture: 'stone' },
        { x: 3460, y: 556, width: 96,  texture: 'stone' },
        { x: 3620, y: 468, width: 96,  texture: 'stone' },
        { x: 3780, y: 556, width: 96,  texture: 'stone' },
        { x: 3940, y: 468, width: 96,  texture: 'stone' },
        { x: 4200, y: 540, width: 96,  texture: 'stone' }, // ruta alta sobre el puente 2

        // ── Sección 5 — descenso tras el puente 2 (4420..4932) ──
        { x: 4500, y: 650, width: 96,  texture: 'stone' },
        { x: 4660, y: 560, width: 96,  texture: 'stone' },
        { x: 4800, y: 476, width: 96,  texture: 'stone' },

        // ── Sección 6 — ascenso final al portal (5080..5600) ──
        // Peldaños holgados (subidas ~72 px) hasta una plataforma final amplia.
        { x: 5170, y: 680, width: 96,  texture: 'stone' }, // top 672 (sube 72 desde el suelo)
        { x: 5310, y: 612, width: 96,  texture: 'stone' }, // top 604 (sube 68)
        { x: 5440, y: 548, width: 160, texture: 'stone' }, // top 540 — plataforma del portal (ancha, sube 64)
    ],

    // ── Plataformas móviles ──────────────────────────────────
    // Ninguna: los cruces del nivel son puentes temporizados, saltos sobre
    // agujeros y la piedra intermedia. Las móviles anteriores eran evitables
    // (una incluso estaba sobre suelo sólido), así que se quitaron.
    movingPlatforms: [],

    // ── Puentes suspendidos temporizados (sobre vacío mortal) ──
    bridges: [
        { x: 2040, y: 750, width: 344, fuse: 1800, breakTime: 400 }, // sobre 2064..2360
        { x: 4092, y: 750, width: 352, fuse: 1900, breakTime: 400 }, // sobre 4116..4420
    ],

    // ── Checkpoints de reaparición (tras cada obstáculo mortal) ──
    checkpoints: [
        { x: 1320, y: 700 }, // tras el agujero 1
        { x: 2420, y: 700 }, // tras el puente 1
        { x: 3300, y: 700 }, // tras el agujero 2
        { x: 4480, y: 700 }, // tras el puente 2
        { x: 5140, y: 700 }, // tras el agujero 3
    ],

    // ── Monedas (guían los saltos) ───────────────────────────
    coins: [
        // Sección 1
        [280, 632], [310, 632],
        [450, 552], [620, 480],
        [800, 560], [830, 560],
        [980, 488],
        // Salto sobre el agujero 1
        [1160, 620], [1200, 640], [1240, 620],
        // Sección 2
        [1380, 620], [1540, 520], [1710, 600], [1870, 500],
        // Ruta alta sobre el puente 1
        [2150, 520], [2180, 520],
        // Sobre el puente 1 (recompensa por cruzar rápido)
        [2120, 700], [2200, 700], [2280, 700],
        // Sección 3
        [2460, 620], [2620, 520], [2780, 436], [2920, 544],
        // Agujero 2
        [3040, 640], [3080, 648], [3160, 640],
        // Sección 4
        [3320, 610], [3480, 516], [3640, 428], [3800, 516], [3960, 428],
        // Sobre el puente 2
        [4160, 700], [4240, 700], [4320, 700], [4400, 700],
        // Sección 5
        [4520, 610], [4680, 520], [4820, 436],
        // Agujero 3
        [4970, 620], [5010, 640], [5050, 620],
        // Sección 6
        [5210, 640], [5350, 572], [5500, 508],
    ],

    // ── Estrellas de poder (rutas arriesgadas) ───────────────
    stars: [
        [2150, 516], // ruta alta sobre el puente 1
        [3620, 428], // cima de la sección 4
        [5560, 502], // junto al portal
    ],

    // ── Enemigos ─────────────────────────────────────────────
    enemies: [
        // Slimes en el suelo y plataformas
        { x: 400,  y: 730, speed: 60 },
        { x: 700,  y: 730, speed: 70 },
        { x: 1520, y: 538, speed: 65 },
        { x: 1600, y: 730, speed: 75 },
        { x: 2600, y: 538, speed: 80 },
        { x: 2820, y: 730, speed: 85 },
        { x: 3460, y: 534, speed: 85 },
        { x: 3860, y: 730, speed: 90 },
        { x: 4660, y: 538, speed: 90 },
        { x: 5200, y: 730, speed: 95 },

        // Murciélagos sobre agujeros y puentes (presión aérea)
        { x: 1190, y: 560, speed: 70, type: 'bat', floatAmplitude: 36 },
        { x: 2210, y: 520, speed: 80, type: 'bat', floatAmplitude: 44 },
        { x: 3110, y: 560, speed: 82, type: 'bat', floatAmplitude: 42 },
        { x: 4260, y: 500, speed: 90, type: 'bat', floatAmplitude: 48 },
        { x: 5000, y: 560, speed: 95, type: 'bat', floatAmplitude: 42 },
    ],

    // ── Decoraciones (ciudad desértica en ruinas, por capas) ──
    //  depth 3  → edificios/muros derruidos de fondo (apoyados en el suelo)
    //  depth 6  → props de suelo: vehículos, escombros, barriles, dunas…
    //  depth 12 → primer plano que enmarca (farolas, árboles secos, columna)
    //  IMPORTANTE: todo se coloca sobre los TRAMOS DE SUELO sólidos
    //  (0-1120, 1264-2064, 2360-3000, 3220-4116, 4420-4932, 5080-5600),
    //  nunca sobre agujeros ni vacíos de puente. Puramente visual.
    decorations: [
        // ══ FONDO (depth 3) — edificios y muros derruidos, atenuados ══
        { texture: 'ruin_building_a', x: 140,  depth: 3, scale: 1.3,  tint: 0xd0c6a8 },
        { texture: 'ruin_building_b', x: 520,  depth: 3, scale: 1.2,  tint: 0xd0c6a8, flipX: true },
        { texture: 'broken_wall',     x: 960,  depth: 3, scale: 1.5,  tint: 0xd0c6a8 },
        { texture: 'ruin_building_a', x: 1520, depth: 3, scale: 1.15, tint: 0xd0c6a8, flipX: true },
        { texture: 'ruin_building_b', x: 2600, depth: 3, scale: 1.2,  tint: 0xd0c6a8 },
        { texture: 'ruin_building_a', x: 3480, depth: 3, scale: 1.3,  tint: 0xd0c6a8, flipX: true },
        { texture: 'broken_wall',     x: 3900, depth: 3, scale: 1.4,  tint: 0xd0c6a8 },
        { texture: 'ruin_building_b', x: 4620, depth: 3, scale: 1.15, tint: 0xd0c6a8 },
        { texture: 'ruin_building_a', x: 5320, depth: 3, scale: 1.25, tint: 0xd0c6a8 },

        // ══ SUELO (depth 6) — vehículos, escombros, barriles, dunas, secos ══
        // Tramo 1 (0-1120)
        { texture: 'sand_drift',  x: 180,  depth: 6, scale: 1.2 },
        { texture: 'car_wreck',   x: 380,  depth: 6 },
        { texture: 'rubble_pile', x: 680,  depth: 6 },
        { texture: 'barrel',      x: 742,  depth: 6 },
        { texture: 'dead_tree',   x: 980,  depth: 6 },
        // Tramo 2 (1264-2064)
        { texture: 'ruin_column', x: 1360, depth: 6 },
        { texture: 'sand_drift',  x: 1600, depth: 6, scale: 1.1 },
        { texture: 'car_wreck',   x: 1760, depth: 6, flipX: true },
        { texture: 'rubble_pile', x: 1950, depth: 6 },
        // Tramo 3 (2360-3000)
        { texture: 'sand_drift',  x: 2620, depth: 6 },
        { texture: 'debris_slab', x: 2440, depth: 6 },
        { texture: 'barrel',      x: 2492, depth: 6 },
        { texture: 'rubble_pile', x: 2720, depth: 6 },
        { texture: 'dead_tree',   x: 2880, depth: 6 },
        // Tramo 4 (3220-4116)
        { texture: 'sand_drift',  x: 3420, depth: 6, scale: 1.2 },
        { texture: 'car_wreck',   x: 3340, depth: 6 },
        { texture: 'rubble_pile', x: 3560, depth: 6 },
        { texture: 'ruin_column', x: 3760, depth: 6 },
        { texture: 'barrel',      x: 3980, depth: 6 },
        // Tramo 5 (4420-4932)
        { texture: 'debris_slab', x: 4520, depth: 6 },
        { texture: 'dead_tree',   x: 4700, depth: 6 },
        { texture: 'rubble_pile', x: 4860, depth: 6 },
        // Tramo 6 (5080-5600)
        { texture: 'sand_drift',  x: 5140, depth: 6, scale: 1.1 },
        { texture: 'car_wreck',   x: 5210, depth: 6, flipX: true },
        { texture: 'barrel',      x: 5268, depth: 6 },
        { texture: 'rubble_pile', x: 5390, depth: 6 },

        // ══ PRIMER PLANO (depth 12) — enmarca (semitransparente/silueta) ══
        { texture: 'lamp_post',   x: 280,  depth: 12, scale: 1.3, alpha: 0.85 },
        { texture: 'dead_tree',   x: 1400, depth: 12, scale: 1.5, alpha: 0.8, tint: 0x6a5c40 },
        { texture: 'ruin_column', x: 2440, depth: 12, scale: 1.6, alpha: 0.8, tint: 0x6a5c40 },
        { texture: 'lamp_post',   x: 3300, depth: 12, scale: 1.3, alpha: 0.85, flipX: true },
        { texture: 'lamp_post',   x: 4520, depth: 12, scale: 1.4, alpha: 0.85 },
        { texture: 'dead_tree',   x: 5250, depth: 12, scale: 1.5, alpha: 0.8, tint: 0x6a5c40 },
    ],

    // ── Portal de salida (sobre la plataforma final 5440..5600, top 540) ──
    exit: { x: 5520, y: 508 },
};
