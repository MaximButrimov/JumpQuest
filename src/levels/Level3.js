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

    // ── Tramos de suelo (y=752). Los huecos entre ellos son mortales ──
    platforms: [
        { x: 0,    y: 752, width: 1120, texture: 'stone' }, // G1  0..1120
        // AGUJERO 1: 1120..1264 (salto)
        { x: 1264, y: 752, width: 800,  texture: 'stone' }, // G2  1264..2064
        // PUENTE 1 (vacío): 2064..2360
        { x: 2360, y: 752, width: 640,  texture: 'stone' }, // G3  2360..3000
        // AGUJERO 2: 3000..3220 (con piedra intermedia)
        { x: 3220, y: 752, width: 896,  texture: 'stone' }, // G4  3220..4116
        // PUENTE 2 (vacío): 4116..4420
        { x: 4420, y: 752, width: 512,  texture: 'stone' }, // G5  4420..4932
        // AGUJERO 3: 4932..5080 (salto)
        { x: 5080, y: 752, width: 520,  texture: 'stone' }, // G6  5080..5600

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
    movingPlatforms: [
        { x: 4030, y: 600, width: 64, config: { axis: 'y', range: 90,  speed: 55 } },
        { x: 2050, y: 660, width: 64, config: { axis: 'x', range: 80,  speed: 70 } },
    ],

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

    // ── Decoraciones (ruinas) ────────────────────────────────
    decorations: [
        { texture: 'broken_pillar', x: 150  },
        { texture: 'broken_pillar', x: 900  },
        { texture: 'broken_pillar', x: 2700 },
        { texture: 'broken_pillar', x: 3520 },
        { texture: 'broken_pillar', x: 4720 },
        { texture: 'broken_pillar', x: 5300 },
        { texture: 'bush', x: 340  },
        { texture: 'bush', x: 1420 },
        { texture: 'bush', x: 2520 },
        { texture: 'bush', x: 3320 },
        { texture: 'bush', x: 4520 },
        { texture: 'bush', x: 5220 },
    ],

    // ── Portal de salida (sobre la plataforma final 5440..5600, top 540) ──
    exit: { x: 5520, y: 508 },
};
