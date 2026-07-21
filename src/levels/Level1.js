export default {
    // ── Dimensiones del mundo ─────────────────────────────
    // IMPORTANTE: actualizar WORLD_W en GameScene.create() a 5600
    worldWidth: 5600,

    // ── Tema visual (fondo) ───────────────────────────────
    theme: 'forest',

    // ── Decoraciones (bosque, por capas de profundidad) ───────
    //  depth 3 → árboles de FONDO (detrás del gameplay)
    //  depth 6 → vegetación de SUELO (delante del terreno)
    //  depth 12 → helechos de PRIMER PLANO (enmarcan, semitransparentes)
    //  Todo es puramente visual: no afecta a plataformas ni colisiones.
    decorations: [
        // ── Árboles de fondo (depth 3) ────────────────────────
        { texture: 'tree_bg',  x: 60,   depth: 3, scale: 0.80 },
        { texture: 'tree_oak', x: 150,  depth: 3, scale: 1.15 },
        { texture: 'tree_bg',  x: 430,  depth: 3, scale: 0.70, flipX: true },
        { texture: 'tree_oak', x: 650,  depth: 3, scale: 0.95, flipX: true },
        { texture: 'tree_bg',  x: 930,  depth: 3, scale: 0.85 },
        { texture: 'tree_oak', x: 1190, depth: 3, scale: 1.25 },
        { texture: 'tree_bg',  x: 1520, depth: 3, scale: 0.75, flipX: true },
        { texture: 'tree_oak', x: 1790, depth: 3, scale: 1.00 },
        { texture: 'tree_bg',  x: 2130, depth: 3, scale: 0.80 },
        { texture: 'tree_oak', x: 2390, depth: 3, scale: 1.20, flipX: true },
        { texture: 'tree_bg',  x: 2770, depth: 3, scale: 0.72 },
        { texture: 'tree_oak', x: 3060, depth: 3, scale: 1.05 },
        { texture: 'tree_bg',  x: 3450, depth: 3, scale: 0.85, flipX: true },
        { texture: 'tree_oak', x: 3760, depth: 3, scale: 1.15 },
        { texture: 'tree_bg',  x: 4160, depth: 3, scale: 0.75 },
        { texture: 'tree_oak', x: 4480, depth: 3, scale: 1.10, flipX: true },
        { texture: 'tree_bg',  x: 4860, depth: 3, scale: 0.80 },
        { texture: 'tree_oak', x: 5160, depth: 3, scale: 1.22 },
        { texture: 'tree_bg',  x: 5490, depth: 3, scale: 0.85, flipX: true },

        // ── Vegetación de suelo (depth 6) ─────────────────────
        { texture: 'bush_lush',     x: 40,   depth: 6 },
        { texture: 'fern',          x: 120,  depth: 6 },
        { texture: 'rock_moss',     x: 210,  depth: 6 },
        { texture: 'flower_red',    x: 300,  depth: 6 },
        { texture: 'mushroom_pair', x: 360,  depth: 6 },
        { texture: 'log_moss',      x: 470,  depth: 6, flipX: true },
        { texture: 'fern',          x: 600,  depth: 6 },
        { texture: 'flower_yellow', x: 680,  depth: 6 },
        { texture: 'bush_lush',     x: 790,  depth: 6 },
        { texture: 'rock_moss',     x: 880,  depth: 6, flipX: true },
        { texture: 'fern',          x: 1010, depth: 6 },
        { texture: 'roots',         x: 1120, depth: 6 },
        { texture: 'flower_red',    x: 1230, depth: 6 },
        { texture: 'mushroom_pair', x: 1340, depth: 6 },
        { texture: 'log_moss',      x: 1490, depth: 6 },
        { texture: 'bush_lush',     x: 1610, depth: 6 },
        { texture: 'fern',          x: 1730, depth: 6, flipX: true },
        { texture: 'rock_moss',     x: 1870, depth: 6 },
        { texture: 'flower_yellow', x: 2010, depth: 6 },
        { texture: 'fern',          x: 2160, depth: 6 },
        { texture: 'roots',         x: 2300, depth: 6, flipX: true },
        { texture: 'bush_lush',     x: 2460, depth: 6 },
        { texture: 'flower_red',    x: 2610, depth: 6 },
        { texture: 'log_moss',      x: 2770, depth: 6, flipX: true },
        { texture: 'fern',          x: 2930, depth: 6 },
        { texture: 'rock_moss',     x: 3090, depth: 6 },
        { texture: 'mushroom_pair', x: 3260, depth: 6 },
        { texture: 'bush_lush',     x: 3460, depth: 6 },
        { texture: 'fern',          x: 3660, depth: 6, flipX: true },
        { texture: 'flower_yellow', x: 3860, depth: 6 },
        { texture: 'rock_moss',     x: 4060, depth: 6, flipX: true },
        { texture: 'fern',          x: 4260, depth: 6 },
        { texture: 'log_moss',      x: 4510, depth: 6 },
        { texture: 'flower_red',    x: 4710, depth: 6 },
        { texture: 'bush_lush',     x: 4910, depth: 6 },
        { texture: 'fern',          x: 5110, depth: 6 },
        { texture: 'rock_moss',     x: 5310, depth: 6 },
        { texture: 'flower_yellow', x: 5490, depth: 6 },
        { texture: 'mushroom_pair', x: 5560, depth: 6 },

        // ── Primer plano (depth 12, semitransparente, enmarca) ─
        { texture: 'fg_fern', x: 240,  depth: 12, alpha: 0.82 },
        { texture: 'fg_fern', x: 1150, depth: 12, alpha: 0.82, flipX: true },
        { texture: 'fg_fern', x: 2450, depth: 12, alpha: 0.82 },
        { texture: 'fg_fern', x: 4930, depth: 12, alpha: 0.82, flipX: true },
    ],

    // ── Suelo (bloque sólido; ver PlatformManager.createGround) ──
    ground: { texture: 'grass', segments: [{ x: 0, width: 5600 }] },

    platforms: [
        // ── Sección 1 (x: 0–1000) ────────────────────────
        { x: 100,  y: 650, width: 160,  texture: 'grass' },
        { x: 350,  y: 520, width: 128,  texture: 'grass' },
        { x: 550,  y: 440, width: 96,   texture: 'grass' },
        { x: 750,  y: 360, width: 160,  texture: 'grass' },

        // ── Sección 2 (x: 1000–1800) ─────────────────────
        { x: 1000, y: 640, width: 192,  texture: 'grass' },
        { x: 1250, y: 560, width: 96,   texture: 'grass' },
        { x: 1400, y: 480, width: 128,  texture: 'grass' },
        { x: 1600, y: 400, width: 96,   texture: 'grass' },

        // ── Sección 3 — ruta elevada de plataformas (x: 1800–2400) ─
        { x: 1800, y: 500, width: 128,  texture: 'grass' },
        { x: 2050, y: 420, width: 96,   texture: 'grass' },
        { x: 2200, y: 540, width: 96,   texture: 'grass' },

        // ── Sección 4 (x: 2400–3300) ─────────────────────
        { x: 2400, y: 620, width: 160,  texture: 'grass' },
        { x: 2600, y: 540, width: 128,  texture: 'grass' },
        { x: 2800, y: 460, width: 192,  texture: 'grass' },
        { x: 3000, y: 560, width: 160,  texture: 'grass' },

        // ── Sección 5 — puente roto (x: 3300–4000) ───────
        // Plataformas pequeñas y separadas, obliga saltos precisos
        { x: 3300, y: 680, width: 64,   texture: 'grass' },
        { x: 3430, y: 600, width: 64,   texture: 'grass' },
        { x: 3560, y: 520, width: 64,   texture: 'grass' },
        { x: 3680, y: 460, width: 64,   texture: 'grass' },
        { x: 3780, y: 540, width: 64,   texture: 'grass' },
        { x: 3880, y: 620, width: 96,   texture: 'grass' },
        { x: 3950, y: 500, width: 96,   texture: 'grass' },

        // ── Sección 6 — torre ascendente (x: 4000–4700) ──
        // Plataformas en zigzag que suben hasta y=200
        { x: 4050, y: 680, width: 128,  texture: 'grass' },
        { x: 4200, y: 580, width: 96,   texture: 'grass' },
        { x: 4100, y: 480, width: 96,   texture: 'grass' },
        { x: 4280, y: 380, width: 128,  texture: 'grass' },
        { x: 4150, y: 280, width: 96,   texture: 'grass' },
        { x: 4350, y: 200, width: 160,  texture: 'grass' },
        { x: 4520, y: 280, width: 96,   texture: 'grass' },
        { x: 4600, y: 380, width: 128,  texture: 'grass' },

        // ── Sección 7 — tramo final (x: 4700–5600) ───────
        { x: 4750, y: 480, width: 192,  texture: 'grass' },
        { x: 4980, y: 560, width: 128,  texture: 'grass' },
        { x: 5150, y: 460, width: 160,  texture: 'grass' },
        { x: 5330, y: 380, width: 128,  texture: 'grass' },

        // ── Plataforma del portal ─────────────────────────
        { x: 5400, y: 300, width: 192,  texture: 'grass' },
    ],

    // ── Plataformas móviles ───────────────────────────────────
    // Ninguna: con suelo continuo, una móvil siempre es evitable (no aporta).
    // La antigua Sección 3 pasó a ser una ruta de plataformas ESTÁTICAS.
    movingPlatforms: [],

    coins: [
        // Sección 1
        [130, 610], [160, 610], [190, 610],
        [380, 490], [410, 490], [440, 490],
        [570, 410], [600, 410],
        [780, 330], [810, 330], [840, 330],

        // Sección 2
        [1030, 610], [1060, 610], [1090, 610],
        [1420, 450], [1450, 450], [1480, 450],
        [1620, 370], [1650, 370],

        // Sección 3 (sobre plataformas móviles)
        [1840, 460], [1870, 460],
        [2070, 380], [2100, 380],
        [2220, 500], [2250, 500],

        // Sección 4
        [2420, 590], [2450, 590],
        [2630, 510], [2660, 510], [2690, 510],
        [2830, 430], [2860, 430],

        // Sección 5 — puente roto (encima de cada piedra)
        [3315, 550], [3445, 560], [3575, 480],
        [3695, 420], [3795, 500], [3900, 580],
        [3970, 460], [3995, 460],

        // Sección 6 — torre (zigzag, recoge subiendo)
        [4070, 640], [4100, 640],
        [4215, 540], [4245, 540],
        [4115, 440], [4145, 440],
        [4295, 340], [4325, 340],
        [4165, 240], [4195, 240],
        [4370, 160], [4400, 160],   // recompensa en la cima
        [4535, 240], [4565, 240],
        [4615, 340], [4645, 340],

        // Sección 7 — tramo final
        [4770, 440], [4800, 440], [4830, 440],
        [5000, 520], [5030, 520],
        [5170, 420], [5200, 420], [5230, 420],
        [5350, 340], [5380, 340],

        // Portal — recompensa final
        [5420, 260], [5450, 260], [5480, 260],
    ],

    // Estrellas de poder (valen 500 pts)
    stars: [
        // Original
        [680,  310],
        [1750, 350],
        [2350, 570],
        // Nuevas — en posiciones de riesgo alto / recompensa alta
        [4370, 155],   // cima de la torre (difícil de alcanzar)
        [5490, 255],   // junto al portal (última recompensa)
    ],

    enemies: [
        // ── Slimes (suelo y plataformas) ─────────────────────
        // Y = platform.y - 22  (body bottom se alinea con la superficie)
        // Sección 1
        { x: 200,  y: 730, speed:  60 },   // suelo y=752
        { x: 500,  y: 730, speed:  50 },   // sin plataforma en x=500 → cae al suelo
        { x: 900,  y: 730, speed:  70 },   // suelo y=752

        // Sección 2
        { x: 1100, y: 618, speed:  55 },   // plataforma y=640
        { x: 1500, y: 458, speed:  65 },   // plataforma y=480

        // Sección 3–4
        { x: 2000, y: 730, speed:  80 },   // suelo y=752
        { x: 2500, y: 598, speed:  60 },   // plataforma y=620
        { x: 2700, y: 518, speed:  75 },   // plataforma y=540
        { x: 3000, y: 730, speed:  90 },   // suelo y=752

        // Sección 5 — puente roto
        { x: 3350, y: 658, speed:  85 },   // plataforma y=680
        { x: 3580, y: 498, speed:  90 },   // plataforma y=520
        { x: 3960, y: 478, speed:  80 },   // plataforma y=500

        // Sección 6 — torre
        { x: 4060, y: 730, speed: 100 },   // suelo y=752
        { x: 4210, y: 558, speed:  90 },   // plataforma y=580
        { x: 4290, y: 358, speed:  95 },   // plataforma y=380
        { x: 4610, y: 358, speed:  85 },   // plataforma y=380

        // Sección 7 — tramo final
        { x: 4760, y: 730, speed: 110 },   // suelo y=752
        { x: 4990, y: 538, speed: 100 },   // plataforma y=560
        { x: 5160, y: 438, speed: 115 },   // plataforma y=460
        { x: 5340, y: 358, speed: 105 },   // plataforma y=380

        // ── Murciélagos flotantes ─────────────────────────────
        // Sección 1-2: introducción suave, amplitud pequeña
        { x: 420,  y: 390, speed: 55, type: 'bat', floatAmplitude: 28 },
        { x: 1280, y: 330, speed: 65, type: 'bat', floatAmplitude: 32 },

        // Sección 3-4: altura media
        { x: 1950, y: 310, speed: 70, type: 'bat', floatAmplitude: 40 },
        { x: 2650, y: 260, speed: 75, type: 'bat', floatAmplitude: 38 },

        // Sección 5: patrulla los huecos del puente roto
        { x: 3480, y: 360, speed: 80, type: 'bat', floatAmplitude: 45 },
        { x: 3820, y: 320, speed: 85, type: 'bat', floatAmplitude: 42 },

        // Sección 6-7: más agresivos, alta amplitud
        { x: 4180, y: 250, speed: 90, type: 'bat', floatAmplitude: 50 },
        { x: 4800, y: 280, speed: 95, type: 'bat', floatAmplitude: 48 },
        { x: 5200, y: 240, speed: 100, type: 'bat', floatAmplitude: 50 },
    ],

    exit: { x: 5490, y: 268 },
};