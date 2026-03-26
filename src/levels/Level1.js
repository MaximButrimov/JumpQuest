export default {
    platforms: [
        // ── Suelo principal ──────────────────────────────
        { x: 0,    y: 752, width: 3200, texture: 'grass' },

        // ── Sección 1 ────────────────────────────────────
        { x: 100,  y: 650, width: 160,  texture: 'grass' },
        { x: 350,  y: 520, width: 128,  texture: 'stone' },
        { x: 550,  y: 440, width: 96,   texture: 'grass' },
        { x: 750,  y: 360, width: 160,  texture: 'stone' },

        // ── Sección 2 ────────────────────────────────────
        { x: 1000, y: 640, width: 192,  texture: 'grass' },
        { x: 1250, y: 560, width: 96,   texture: 'stone' },
        { x: 1400, y: 480, width: 128,  texture: 'grass' },
        { x: 1600, y: 400, width: 96,   texture: 'stone' },

        // ── Sección 3 (final) ────────────────────────────
        { x: 2400, y: 620, width: 160,  texture: 'stone' },
        { x: 2600, y: 540, width: 128,  texture: 'grass' },
        { x: 2800, y: 460, width: 192,  texture: 'stone' },
        { x: 3000, y: 560, width: 160,  texture: 'grass' },

        // ── Plataforma del portal ─────────────────────────
        { x: 3050, y: 480, width: 160,  texture: 'grass' }
    ],

    movingPlatforms: [
        { x: 1800, y: 500, width: 128, config: { axis: 'x', range: 120, speed: 55 } },
        { x: 2050, y: 420, width: 96,  config: { axis: 'y', range: 80,  speed: 45 } },
        { x: 2200, y: 540, width: 96,  config: { axis: 'x', range: 100, speed: 70 } }
    ],

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
        // Sección 3
        [2420, 590], [2450, 590],
        [2630, 510], [2660, 510], [2690, 510],
        [2830, 430], [2860, 430],
        // Final
        [3070, 450], [3100, 450], [3130, 450]
    ],

    // Estrellas de poder (valen 500 pts)
    stars: [
        [680, 310],
        [1750, 350],
        [2350, 570]
    ],

    enemies: [
        { x: 200,  y: 736, speed:  60 },
        { x: 500,  y: 424, speed:  50 },
        { x: 900,  y: 744, speed:  70 },
        { x: 1100, y: 624, speed:  55 },
        { x: 1500, y: 464, speed:  65 },
        { x: 2000, y: 736, speed:  80 },
        { x: 2500, y: 604, speed:  60 },
        { x: 2700, y: 444, speed:  75 },
        { x: 3000, y: 736, speed:  90 }
    ],

    exit: { x: 3120, y: 448 }
};