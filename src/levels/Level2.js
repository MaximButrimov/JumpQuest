export default {
    // ── Dimensiones del mundo ─────────────────────────────
    worldWidth: 5600,

    platforms: [
        // ── Suelo principal (piedra de cueva) ────────────
        { x: 0,    y: 752, width: 5600, texture: 'stone' },

        // ── Sección 1 — Entrada a la cueva (x: 0–900) ───
        { x: 80,   y: 680, width: 128,  texture: 'stone' },
        { x: 280,  y: 600, width: 96,   texture: 'stone' },
        { x: 450,  y: 520, width: 128,  texture: 'stone' },
        { x: 660,  y: 440, width: 96,   texture: 'stone' },
        { x: 820,  y: 360, width: 128,  texture: 'stone' },

        // ── Sección 2 — Túnel ascendente (x: 900–1800) ──
        { x: 980,  y: 660, width: 96,   texture: 'stone' },
        { x: 1140, y: 560, width: 128,  texture: 'stone' },
        { x: 1320, y: 460, width: 96,   texture: 'stone' },
        { x: 1480, y: 380, width: 128,  texture: 'stone' },
        { x: 1650, y: 300, width: 96,   texture: 'stone' },

        // ── Sección 3 — Plataformas móviles (x: 1800–2500)
        // (definidas en movingPlatforms)

        // ── Sección 4 — Laberinto de estalactitas (x: 2500–3300)
        { x: 2520, y: 660, width: 96,   texture: 'stone' },
        { x: 2680, y: 560, width: 64,   texture: 'stone' },
        { x: 2820, y: 460, width: 96,   texture: 'stone' },
        { x: 2960, y: 560, width: 64,   texture: 'stone' },
        { x: 3080, y: 440, width: 128,  texture: 'stone' },
        { x: 3260, y: 340, width: 96,   texture: 'stone' },

        // ── Sección 5 — Puente de cristal roto (x: 3300–4100)
        { x: 3340, y: 680, width: 64,   texture: 'stone' },
        { x: 3470, y: 580, width: 64,   texture: 'stone' },
        { x: 3600, y: 500, width: 64,   texture: 'stone' },
        { x: 3720, y: 600, width: 64,   texture: 'stone' },
        { x: 3840, y: 500, width: 64,   texture: 'stone' },
        { x: 3960, y: 600, width: 64,   texture: 'stone' },
        { x: 4060, y: 480, width: 96,   texture: 'stone' },

        // ── Sección 6 — Ascenso final (x: 4100–4900) ────
        { x: 4160, y: 680, width: 128,  texture: 'stone' },
        { x: 4340, y: 560, width: 96,   texture: 'stone' },
        { x: 4490, y: 440, width: 128,  texture: 'stone' },
        { x: 4660, y: 340, width: 96,   texture: 'stone' },
        { x: 4800, y: 240, width: 128,  texture: 'stone' },

        // ── Sección 7 — Tramo final (x: 4900–5600) ──────
        { x: 4970, y: 480, width: 128,  texture: 'stone' },
        { x: 5140, y: 380, width: 96,   texture: 'stone' },
        { x: 5290, y: 460, width: 128,  texture: 'stone' },
        { x: 5430, y: 340, width: 96,   texture: 'stone' },

        // ── Plataforma del portal ─────────────────────────
        { x: 5420, y: 260, width: 192,  texture: 'stone' },
    ],

    movingPlatforms: [
        // Sección 3 — núcleo de la cueva (x: 1800–2500)
        { x: 1830, y: 540, width: 96,  config: { axis: 'x', range: 110, speed: 60 } },
        { x: 2010, y: 440, width: 96,  config: { axis: 'y', range:  90, speed: 50 } },
        { x: 2200, y: 560, width: 64,  config: { axis: 'x', range:  95, speed: 75 } },
        { x: 2370, y: 440, width: 96,  config: { axis: 'y', range: 100, speed: 55 } },

        // Sección 5 — apoyo entre los puentes rotos
        { x: 3690, y: 700, width: 64,  config: { axis: 'x', range:  70, speed: 70 } },

        // Sección 6 — ascensor de cueva
        { x: 4430, y: 520, width: 96,  config: { axis: 'y', range: 130, speed: 55 } },

        // Sección 7 — plataformas rápidas finales
        { x: 5060, y: 320, width: 64,  config: { axis: 'x', range: 105, speed: 90 } },
        { x: 5230, y: 260, width: 64,  config: { axis: 'y', range:  95, speed: 80 } },
    ],

    coins: [
        // Sección 1
        [110, 640], [140, 640], [170, 640],
        [310, 560], [340, 560],
        [480, 480], [510, 480], [540, 480],
        [690, 400], [720, 400],
        [850, 320], [880, 320], [910, 320],

        // Sección 2
        [1010, 620], [1040, 620],
        [1170, 520], [1200, 520], [1230, 520],
        [1350, 420], [1380, 420],
        [1510, 340], [1540, 340], [1570, 340],
        [1680, 260], [1710, 260],

        // Sección 3 (sobre plataformas móviles)
        [1860, 500], [1890, 500],
        [2040, 400], [2070, 400],
        [2230, 520], [2260, 520],
        [2400, 400], [2430, 400],

        // Sección 4
        [2550, 620], [2580, 620],
        [2705, 520], [2735, 520],
        [2850, 420], [2880, 420],
        [3105, 400], [3135, 400], [3165, 400],
        [3285, 300], [3315, 300],

        // Sección 5 — encima de cada piedra
        [3365, 640], [3495, 540],
        [3625, 460], [3745, 560],
        [3865, 460], [3985, 560],
        [4085, 440], [4110, 440],

        // Sección 6
        [4190, 640], [4220, 640],
        [4370, 520], [4400, 520],
        [4520, 400], [4550, 400], [4580, 400],
        [4690, 300], [4720, 300],
        [4830, 200], [4860, 200], [4890, 200],

        // Sección 7
        [5000, 440], [5030, 440],
        [5170, 340], [5200, 340],
        [5320, 420], [5350, 420],
        [5460, 300], [5490, 300],

        // Portal — recompensa final
        [5450, 220], [5480, 220], [5510, 220],
    ],

    // Estrellas de poder (valen 500 pts)
    stars: [
        [884,  315],    // cima sección 1 (plataforma y=360)
        [1900, 395],    // sección 3 (sobre moving platform)
        [3260, 295],    // cima sección 4 (plataforma y=340)
        [4800, 195],    // cima sección 6 (plataforma y=240)
        [5516, 215],    // junto al portal (recompensa final)
    ],

    enemies: [
        // ── Slimes ───────────────────────────────────────────
        // y = platform.y - 22  (body bottom sobre la superficie)

        // Sección 1
        { x: 130,  y: 658, speed:  65 },   // platform y=680
        { x: 480,  y: 498, speed:  55 },   // platform y=520
        { x: 850,  y: 338, speed:  75 },   // platform y=360

        // Sección 2
        { x: 1010, y: 638, speed:  75 },   // platform y=660
        { x: 1200, y: 538, speed:  80 },   // platform y=560
        { x: 1490, y: 358, speed:  90 },   // platform y=380

        // Sección 3–4
        { x: 1900, y: 730, speed:  90 },   // suelo y=752
        { x: 2540, y: 638, speed:  80 },   // platform y=660
        { x: 2840, y: 438, speed:  90 },   // platform y=460
        { x: 3100, y: 418, speed:  95 },   // platform y=440
        { x: 3270, y: 318, speed: 100 },   // platform y=340

        // Sección 5
        { x: 3360, y: 658, speed:  90 },   // platform y=680
        { x: 3620, y: 478, speed:  95 },   // platform y=500
        { x: 4070, y: 458, speed: 100 },   // platform y=480

        // Sección 6
        { x: 4180, y: 658, speed: 105 },   // platform y=680
        { x: 4360, y: 538, speed: 110 },   // platform y=560
        { x: 4510, y: 418, speed: 110 },   // platform y=440
        { x: 4670, y: 318, speed: 115 },   // platform y=340

        // Sección 7
        { x: 4990, y: 458, speed: 115 },   // platform y=480
        { x: 5160, y: 358, speed: 120 },   // platform y=380
        { x: 5310, y: 438, speed: 115 },   // platform y=460
        { x: 5440, y: 318, speed: 120 },   // platform y=340

        // ── Murciélagos — protagonistas de la cueva ───────────
        // Sección 1-2: introducción, amplitud moderada
        { x: 350,  y: 380, speed:  60, type: 'bat', floatAmplitude: 32 },
        { x: 730,  y: 300, speed:  65, type: 'bat', floatAmplitude: 36 },
        { x: 1250, y: 340, speed:  70, type: 'bat', floatAmplitude: 38 },
        { x: 1680, y: 200, speed:  72, type: 'bat', floatAmplitude: 40 },

        // Sección 3-4: más agresivos
        { x: 2060, y: 300, speed:  75, type: 'bat', floatAmplitude: 42 },
        { x: 2380, y: 240, speed:  80, type: 'bat', floatAmplitude: 44 },
        { x: 2720, y: 320, speed:  82, type: 'bat', floatAmplitude: 45 },
        { x: 3010, y: 260, speed:  85, type: 'bat', floatAmplitude: 46 },

        // Sección 5: guardianes del puente roto
        { x: 3500, y: 340, speed:  87, type: 'bat', floatAmplitude: 48 },
        { x: 3820, y: 280, speed:  90, type: 'bat', floatAmplitude: 50 },

        // Sección 6-7: élite de la cueva
        { x: 4280, y: 240, speed:  92, type: 'bat', floatAmplitude: 50 },
        { x: 4620, y: 200, speed:  96, type: 'bat', floatAmplitude: 52 },
        { x: 4890, y: 260, speed: 100, type: 'bat', floatAmplitude: 50 },
        { x: 5100, y: 200, speed: 105, type: 'bat', floatAmplitude: 52 },
        { x: 5360, y: 180, speed: 110, type: 'bat', floatAmplitude: 48 },
    ],

    exit: { x: 5516, y: 228 },
};
