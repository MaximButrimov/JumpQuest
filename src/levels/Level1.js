export default {
    platforms: [
        // Suelo
        { x: 0, y: 752, width: 1200, texture: 'grass' },

        // Plataformas básicas
        { x: 200, y: 600, width: 120, texture: 'grass' },
        { x: 400, y: 500, width: 120, texture: 'stone' },
        { x: 650, y: 400, width: 120, texture: 'grass' },
        { x: 900, y: 300, width: 120, texture: 'stone' }
    ],

    movingPlatforms: [
        {
            x: 1100,
            y: 500,
            width: 120,
            config: { axis: 'x', range: 100, speed: 60 }
        }
    ],

    coins: [
        [220, 550],
        [250, 550],
        [420, 450],
        [680, 350],
        [930, 250]
    ],

    enemies: [
        { x: 300, y: 720, speed: 50 },
        { x: 700, y: 380, speed: 60 }
    ],

    exit: { x: 1150, y: 250 }
};