// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: CUEVA (nivel de cuevas oscuras)
//  estalactitas, estalagmitas y cristales.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class CaveTextures {
    static build(scene) {
        // Estalactita — cuelga del techo (origin 0.5, 0)
        defineTexture(scene, 'stalactite', 24, 64, (g) => {
            g.fillStyle(0x3f3a55); g.fillTriangle(12, 64, 0,  0, 24, 0);
            g.fillStyle(0x565073); g.fillTriangle(12, 50, 4,  0, 13, 0);   // brillo izq.
            g.fillStyle(0x2c2840); g.fillTriangle(12, 64, 15, 0, 24, 0);   // sombra der.
            g.fillStyle(0x6a6488, 0.6); g.fillRect(8, 2, 3, 20);
        });

        // Estalagmita — sube del suelo (origin 0.5, 1)
        defineTexture(scene, 'stalagmite', 24, 44, (g) => {
            g.fillStyle(0x3f3a55); g.fillTriangle(12, 0, 0,  44, 24, 44);
            g.fillStyle(0x565073); g.fillTriangle(12, 6, 3,  44, 11, 44);
            g.fillStyle(0x2c2840); g.fillTriangle(12, 8, 16, 44, 24, 44);
        });

        // Cristal brillante (origin 0.5, 1)
        defineTexture(scene, 'cave_crystal', 24, 30, (g) => {
            g.fillStyle(0x39d0ff);
            g.fillTriangle(11, 0,  4, 15, 18, 15);
            g.fillTriangle(4, 15, 18, 15, 11, 30);
            g.fillStyle(0x7af5ff, 0.7); g.fillTriangle(11, 3, 6, 14, 11, 14);  // brillo
            g.fillStyle(0x2ab0e0);                                             // cristal lateral
            g.fillTriangle(19, 12, 15, 21, 23, 21);
            g.fillTriangle(15, 21, 23, 21, 19, 30);
        });
    }
}
