// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: NIEVE (nivel nevado / hielo)
//  pino nevado y muñeco de nieve.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class SnowTextures {
    static build(scene) {
        // Pino nevado (36×60, origin 0.5,1)
        defineTexture(scene, 'snow_pine', 36, 60, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(15, 50, 6, 10);        // tronco
            g.fillStyle(0x2f6b45);                                   // follaje
            g.fillTriangle(18, 4,  4, 26, 32, 26);
            g.fillTriangle(18, 18, 1, 42, 35, 42);
            g.fillTriangle(18, 32, 3, 54, 33, 54);
            g.fillStyle(0xffffff);                                   // nieve
            g.fillTriangle(18, 4,  10, 16, 26, 16);
            g.fillTriangle(18, 18, 8,  31, 28, 31);
            g.fillTriangle(18, 32, 9,  45, 27, 45);
        });

        // Muñeco de nieve (26×34, origin 0.5,1)
        defineTexture(scene, 'snowman', 26, 34, (g) => {
            g.fillStyle(0xffffff);
            g.fillCircle(13, 26, 11);                 // base
            g.fillCircle(13, 12, 8);                  // cabeza
            g.fillStyle(0xd7e6f2);
            g.fillEllipse(13, 27, 18, 8);             // sombra base
            g.fillStyle(0x1a1a2e);
            g.fillRect(10, 10, 2, 2); g.fillRect(15, 10, 2, 2); // ojos
            g.fillRect(9, 22, 2, 2); g.fillRect(13, 24, 2, 2);  // botones
            g.fillStyle(0xe8822a);
            g.fillTriangle(13, 13, 20, 14, 13, 15);   // nariz zanahoria
        });
    }
}
