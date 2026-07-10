// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: ENEMIGOS (slime, murciélago)
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class EnemyTextures {
    static build(scene) {
        // Slime
        defineTexture(scene, 'enemy_slime', 32, 28, (g) => {
            g.fillStyle(0xe84393); g.fillEllipse(16, 18, 32, 24);     // cuerpo
            g.fillStyle(0xff66b2); g.fillEllipse(12, 14, 14, 10);
            g.fillStyle(0xffffff); g.fillCircle(9,  12, 4);           // ojos
            g.fillStyle(0xffffff); g.fillCircle(23, 12, 4);
            g.fillStyle(0x1a1a2e); g.fillCircle(10, 12, 2);           // pupilas
            g.fillStyle(0x1a1a2e); g.fillCircle(24, 12, 2);
            g.fillStyle(0xffffff); g.fillCircle(9,  10, 1);           // brillo
            g.fillStyle(0xffffff); g.fillCircle(23, 10, 1);
            g.fillStyle(0x1a1a2e); g.fillRect(11, 19, 10, 2);         // boca
        });

        // Murciélago
        defineTexture(scene, 'enemy_bat', 28, 18, (g) => {
            // Alas (detrás del cuerpo)
            g.fillStyle(0x5a00a0);
            g.fillTriangle(14, 9,  1, 1, 9, 14);
            g.fillTriangle(14, 9, 27, 1, 19, 14);
            g.fillStyle(0x8833dd);
            g.fillTriangle(14, 9,  2, 2, 9, 13);
            g.fillTriangle(14, 9, 26, 2, 19, 13);
            g.fillStyle(0x3a0070); g.fillCircle(2, 2, 3); g.fillCircle(26, 2, 3);
            // Cuerpo
            g.fillStyle(0x4a0080); g.fillEllipse(14, 11, 14, 12);
            g.fillStyle(0x6a20a0); g.fillEllipse(12, 9, 6, 5);
            // Orejas
            g.fillStyle(0x5a00a0);
            g.fillTriangle(10, 5, 8, 0, 13, 6);
            g.fillTriangle(18, 5, 20, 0, 15, 6);
            // Ojos
            g.fillStyle(0xff2200); g.fillCircle(11, 11, 2); g.fillCircle(17, 11, 2);
            g.fillStyle(0xff9988); g.fillCircle(12, 10, 1); g.fillCircle(18, 10, 1);
            // Colmillos
            g.fillStyle(0xffffff); g.fillRect(12, 15, 2, 3); g.fillRect(15, 15, 2, 3);
        });
    }
}
