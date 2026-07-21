// ══════════════════════════════════════════════════════════════
//  Nivel 1-5 — "Corazón del Volcán" (nivel final)
//
//  Volcán en plena actividad: la zona más peligrosa del juego. Ríos de
//  lava en el fondo de los pozos, roca volcánica, ruinas calcinadas y una
//  puerta que da acceso a la sala del JEFE al final del recorrido.
//
//  NOTA: este paso cubre SOLO la ambientación y el layout. Las mecánicas
//  exclusivas del nivel (lava letal, esqueletos en llamas, bolas de fuego,
//  puerta→sala del jefe, combate e inversión de controles) se implementan
//  en pasos posteriores. Por ahora los pozos son huecos mortales normales,
//  los enemigos son de tipo existente (marcadores) y la salida es un portal.
// ══════════════════════════════════════════════════════════════

export default {
    worldWidth: 5600,
    theme: 'volcano',

    // ── Suelo de ROCA VOLCÁNICA por tramos; los huecos son POZOS DE LAVA ──
    ground: {
        texture: 'volcanic',
        segments: [
            { x: 0,    width: 900 }, // G1  0..900
            { x: 1080, width: 820 }, // G2  1080..1900   (POZO 1: 900..1080)
            { x: 2100, width: 800 }, // G3  2100..2900   (POZO 2: 1900..2100)
            { x: 3120, width: 780 }, // G4  3120..3900   (POZO 3: 2900..3120)
            { x: 4100, width: 800 }, // G5  4100..4900   (POZO 4: 3900..4100)
            { x: 5080, width: 520 }, // G6  5080..5600   (POZO 5: 4900..5080)
        ],
    },

    // ── Plataformas elevadas (roca volcánica) ─────────────────
    platforms: [
        // Sección 1 (0..900)
        { x: 200,  y: 660, width: 128, texture: 'volcanic' },
        { x: 420,  y: 580, width: 96,  texture: 'volcanic' },
        { x: 620,  y: 640, width: 128, texture: 'volcanic' },
        { x: 780,  y: 560, width: 96,  texture: 'volcanic' },
        // Pozo 1 (900..1080)
        { x: 940,  y: 640, width: 80,  texture: 'volcanic' },
        // Sección 2 (1080..1900)
        { x: 1150, y: 660, width: 128, texture: 'volcanic' },
        { x: 1350, y: 580, width: 96,  texture: 'volcanic' },
        { x: 1520, y: 500, width: 128, texture: 'volcanic' },
        { x: 1720, y: 580, width: 96,  texture: 'volcanic' },
        // Pozo 2 (1900..2100)
        { x: 1950, y: 620, width: 80,  texture: 'volcanic' },
        { x: 2040, y: 560, width: 80,  texture: 'volcanic' },
        // Sección 3 (2100..2900)
        { x: 2180, y: 640, width: 128, texture: 'volcanic' },
        { x: 2380, y: 560, width: 96,  texture: 'volcanic' },
        { x: 2560, y: 480, width: 128, texture: 'volcanic' },
        { x: 2760, y: 560, width: 96,  texture: 'volcanic' },
        // Pozo 3 (2900..3120) — cruce con plataforma móvil
        { x: 2940, y: 640, width: 64,  texture: 'volcanic' },
        { x: 3060, y: 640, width: 64,  texture: 'volcanic' },
        // Sección 4 (3120..3900)
        { x: 3200, y: 620, width: 128, texture: 'volcanic' },
        { x: 3400, y: 520, width: 96,  texture: 'volcanic' },
        { x: 3580, y: 440, width: 128, texture: 'volcanic' },
        { x: 3760, y: 540, width: 96,  texture: 'volcanic' },
        // Pozo 4 (3900..4100)
        { x: 3950, y: 620, width: 80,  texture: 'volcanic' },
        { x: 4040, y: 560, width: 80,  texture: 'volcanic' },
        // Sección 5 (4100..4900)
        { x: 4180, y: 640, width: 128, texture: 'volcanic' },
        { x: 4380, y: 540, width: 96,  texture: 'volcanic' },
        { x: 4560, y: 460, width: 128, texture: 'volcanic' },
        { x: 4740, y: 560, width: 96,  texture: 'volcanic' },
        // Pozo 5 (4900..5080) — ascensor vertical
        { x: 4930, y: 640, width: 80,  texture: 'volcanic' },
        // Sección 6 — ascenso final a la puerta del jefe (5080..5600)
        { x: 5160, y: 660, width: 96,  texture: 'volcanic' },
        { x: 5320, y: 600, width: 96,  texture: 'volcanic' },
    ],

    // ── Plataformas móviles (sobre los pozos) ─────────────────
    movingPlatforms: [
        { x: 1000, y: 600, width: 80, config: { axis: 'x', range: 70, speed: 70 } }, // pozo 1
        { x: 3000, y: 600, width: 96, config: { axis: 'x', range: 90, speed: 65 } }, // pozo 3
        { x: 5000, y: 560, width: 64, config: { axis: 'y', range: 80, speed: 55 } }, // pozo 5
    ],

    // ── Checkpoints (tras cada pozo de lava) ─────────────────
    checkpoints: [
        { x: 1140, y: 700 }, // tras pozo 1
        { x: 2160, y: 700 }, // tras pozo 2
        { x: 3180, y: 700 }, // tras pozo 3
        { x: 4160, y: 700 }, // tras pozo 4
        { x: 5140, y: 700 }, // tras pozo 5
    ],

    // ── Monedas (guían los saltos) ───────────────────────────
    coins: [
        // Sección 1
        [230, 620], [440, 540], [650, 600], [800, 520],
        // Pozo 1
        [930, 600], [980, 620], [1030, 600],
        // Sección 2
        [1180, 620], [1370, 540], [1550, 460], [1740, 540],
        // Pozo 2
        [1940, 580], [2030, 520],
        // Sección 3
        [2210, 600], [2400, 520], [2590, 440], [2780, 520],
        // Pozo 3
        [2960, 600], [3010, 560], [3080, 600],
        // Sección 4
        [3230, 580], [3420, 480], [3610, 400], [3780, 500],
        // Pozo 4
        [3940, 580], [4030, 520],
        // Sección 5
        [4210, 600], [4400, 500], [4590, 420], [4760, 520],
        // Pozo 5
        [4930, 600], [5000, 520], [5060, 600],
        // Sección 6 — hacia la puerta
        [5180, 620], [5340, 560], [5460, 660], [5500, 660],
    ],

    // ── Estrellas de poder (rutas arriesgadas) ───────────────
    stars: [
        [1520, 452], // cima de la sección 2
        [2560, 432], // cima de la sección 3
        [3580, 392], // cima de la sección 4
    ],

    // ── Enemigos ─────────────────────────────────────────────
    enemies: [
        // Esqueletos en llamas (exclusivos del volcán) en suelo y plataformas
        { x: 350,  y: 730, speed: 65, type: 'skeleton' },
        { x: 700,  y: 730, speed: 75, type: 'skeleton' },
        { x: 1350, y: 552, speed: 70, type: 'skeleton' },
        { x: 1500, y: 730, speed: 80, type: 'skeleton' },
        { x: 2380, y: 532, speed: 75, type: 'skeleton' },
        { x: 2500, y: 730, speed: 85, type: 'skeleton' },
        { x: 3400, y: 492, speed: 80, type: 'skeleton' },
        { x: 3400, y: 730, speed: 90, type: 'skeleton' },
        { x: 4380, y: 512, speed: 85, type: 'skeleton' },
        { x: 4500, y: 730, speed: 90, type: 'skeleton' },
        { x: 5200, y: 730, speed: 95, type: 'skeleton' },

        // Murciélagos (presión aérea sobre los pozos de lava)
        { x: 990,  y: 560, speed: 75, type: 'bat', floatAmplitude: 40 },
        { x: 1990, y: 520, speed: 82, type: 'bat', floatAmplitude: 44 },
        { x: 3010, y: 540, speed: 88, type: 'bat', floatAmplitude: 46 },
        { x: 3990, y: 520, speed: 92, type: 'bat', floatAmplitude: 48 },
        { x: 4990, y: 520, speed: 96, type: 'bat', floatAmplitude: 46 },
    ],

    // ── LAVA LETAL — el contacto pierde las 3 vidas (Game Over inmediato) ──
    // Una zona en el fondo de cada pozo: caer dentro = muerte instantánea.
    lava: [
        { x: 900,  y: 764, width: 180, height: 48 }, // pozo 1
        { x: 1900, y: 764, width: 200, height: 48 }, // pozo 2
        { x: 2900, y: 764, width: 220, height: 48 }, // pozo 3
        { x: 3900, y: 764, width: 200, height: 48 }, // pozo 4
        { x: 4900, y: 764, width: 180, height: 48 }, // pozo 5
    ],

    // ── Decoraciones (volcán, por capas de profundidad) ──────
    //  depth 3  → ruinas calcinadas y rocas de fondo (atenuadas)
    //  depth 6  → suelo: roca volcánica, lava, obsidiana, fumarolas, secos
    //  depth 4  → puerta del jefe (gran estructura al final)
    //  depth 12 → primer plano que enmarca (obsidiana / árboles quemados)
    //  Todo sobre los tramos de suelo sólidos, nunca sobre los pozos.
    decorations: [
        // ══ FONDO (depth 3) — ruinas calcinadas y rocas, atenuadas ══
        { texture: 'ruin_burnt',  x: 140,  depth: 3, scale: 1.2,  tint: 0x8f6650 },
        { texture: 'volcano_rock', x: 560, depth: 3, scale: 1.25, tint: 0x8f6650 },
        { texture: 'ruin_burnt',  x: 1300, depth: 3, scale: 1.15, tint: 0x8f6650, flipX: true },
        { texture: 'volcano_rock', x: 1750, depth: 3, scale: 1.15, tint: 0x8f6650 },
        { texture: 'ruin_burnt',  x: 2400, depth: 3, scale: 1.25, tint: 0x8f6650 },
        { texture: 'volcano_rock', x: 2750, depth: 3, scale: 1.2, tint: 0x8f6650, flipX: true },
        { texture: 'volcano_rock', x: 3300, depth: 3, scale: 1.15, tint: 0x8f6650 },
        { texture: 'ruin_burnt',  x: 3560, depth: 3, scale: 1.2,  tint: 0x8f6650, flipX: true },
        { texture: 'ruin_burnt',  x: 4300, depth: 3, scale: 1.2,  tint: 0x8f6650 },
        { texture: 'volcano_rock', x: 4650, depth: 3, scale: 1.2, tint: 0x8f6650, flipX: true },
        { texture: 'volcano_rock', x: 5200, depth: 3, scale: 1.15, tint: 0x8f6650 },

        // ══ SUELO (depth 6) — roca, lava, obsidiana, fumarolas, secos ══
        // Tramo 1
        { texture: 'volcano_rock',  x: 300, depth: 6, scale: 0.9 },
        { texture: 'smoke_vent',    x: 480, depth: 6 },
        { texture: 'obsidian_spike', x: 680, depth: 6 },
        { texture: 'burnt_tree',    x: 830, depth: 6 },
        // Tramo 2
        { texture: 'burnt_tree',    x: 1130, depth: 6 },
        { texture: 'lava_pool',     x: 1250, depth: 6 },
        { texture: 'volcano_rock',  x: 1450, depth: 6 },
        { texture: 'smoke_vent',    x: 1650, depth: 6 },
        { texture: 'obsidian_spike', x: 1830, depth: 6, flipX: true },
        // Tramo 3
        { texture: 'volcano_rock',  x: 2200, depth: 6 },
        { texture: 'lava_pool',     x: 2500, depth: 6 },
        { texture: 'obsidian_spike', x: 2700, depth: 6 },
        { texture: 'smoke_vent',    x: 2850, depth: 6 },
        // Tramo 4
        { texture: 'burnt_tree',    x: 3160, depth: 6 },
        { texture: 'volcano_rock',  x: 3680, depth: 6, flipX: true },  // reubicada (evita duplicar con la de fondo en 3300)
        { texture: 'smoke_vent',    x: 3480, depth: 6 },
        { texture: 'lava_pool',     x: 3820, depth: 6 },
        // Tramo 5
        { texture: 'volcano_rock',  x: 4160, depth: 6 },
        { texture: 'lava_pool',     x: 4480, depth: 6 },
        { texture: 'obsidian_spike', x: 4700, depth: 6 },
        { texture: 'smoke_vent',    x: 4850, depth: 6 },
        // Tramo 6 — aproximación a la puerta del jefe
        { texture: 'volcano_rock',  x: 5140, depth: 6, flipX: true },
        { texture: 'obsidian_spike', x: 5300, depth: 6 },
        { texture: 'smoke_vent',    x: 5420, depth: 6 },

        // ══ PUERTA DEL JEFE (depth 4) — gran portón al final ══
        { texture: 'boss_gate', x: 5500, depth: 4, scale: 1.15 },

        // ══ PRIMER PLANO (depth 12) — enmarca (silueta oscura) ══
        { texture: 'obsidian_spike', x: 520,  depth: 12, scale: 1.9, alpha: 0.8, tint: 0x3a2018 },
        { texture: 'burnt_tree',    x: 1500,  depth: 12, scale: 1.6, alpha: 0.8, tint: 0x3a2018 },
        { texture: 'obsidian_spike', x: 2450, depth: 12, scale: 2.0, alpha: 0.8, tint: 0x3a2018 },
        { texture: 'burnt_tree',    x: 3650,  depth: 12, scale: 1.6, alpha: 0.8, tint: 0x3a2018, flipX: true },
        { texture: 'obsidian_spike', x: 4550, depth: 12, scale: 1.9, alpha: 0.8, tint: 0x3a2018 },
        { texture: 'burnt_tree',    x: 5250,  depth: 12, scale: 1.6, alpha: 0.8, tint: 0x3a2018 },
    ],

    // ── Salida — puerta de acceso al jefe (por ahora, portal normal) ──
    exit: { x: 5500, y: 700 },
};
