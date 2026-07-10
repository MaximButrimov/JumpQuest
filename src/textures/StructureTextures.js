// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: ESTRUCTURAS y elementos artificiales
//  portal (+ su partícula), tablón de puente, pilar roto, tótem.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class StructureTextures {
    static build(scene) {
        // Portal de salida
        defineTexture(scene, 'portal', 40, 64, (g) => {
            g.fillStyle(0x0a2a4a, 0.8); g.fillEllipse(20, 32, 36, 60);    // relleno oscuro
            g.fillStyle(0x39d0ff, 0.3); g.fillEllipse(20, 32, 20, 38);    // brillo interior
            g.lineStyle(4, 0x39d0ff); g.strokeEllipse(20, 32, 40, 64);    // anillos
            g.lineStyle(2, 0x7af5ff); g.strokeEllipse(20, 32, 28, 50);
            g.fillStyle(0xffffff, 0.6); g.fillEllipse(14, 20, 6, 10);     // destello
        });

        // Partícula del portal
        defineTexture(scene, 'glow_px', 6, 6, (g) => {
            g.fillStyle(0x39d0ff); g.fillCircle(3, 3, 3);
        });

        // Tablón de madera del puente (24×12)
        defineTexture(scene, 'bridge_plank', 24, 12, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(0, 1, 24, 10);   // cuerpo
            g.fillStyle(0x8a643c); g.fillRect(0, 1, 24, 2);    // brillo superior
            g.fillStyle(0x452c15); g.fillRect(0, 9, 24, 2);    // sombra inferior
            g.fillStyle(0x5a3d22); g.fillRect(11, 1, 2, 10);   // junta central
            g.fillStyle(0x3a2614); g.fillRect(3, 4, 1, 4); g.fillRect(20, 4, 1, 4); // clavos
        });

        // Pilar de piedra roto (28×80, origin 0.5,1)
        defineTexture(scene, 'broken_pillar', 28, 80, (g) => {
            g.fillStyle(0x6a6478); g.fillRect(4, 18, 20, 62);        // fuste
            g.fillStyle(0x847e96); g.fillRect(4, 18, 4, 62);         // brillo izq.
            g.fillStyle(0x484356); g.fillRect(20, 18, 4, 62);        // sombra der.
            g.fillStyle(0x6a6478);                                   // cima rota
            g.fillTriangle(4, 20, 10, 6, 15, 20);
            g.fillTriangle(14, 20, 20, 11, 24, 20);
            g.fillStyle(0x373345); g.fillRect(12, 30, 1, 22); g.fillRect(9, 52, 1, 16); // grietas
            g.fillStyle(0x565266); g.fillRect(1, 74, 26, 6);         // base ancha
        });

        // Tótem tallado (32×48, origin 0.5,1)
        defineTexture(scene, 'totem', 32, 48, (g) => {
            g.fillStyle(0x8b5e3c); g.fillRect(6, 0,  20, 48);
            g.fillStyle(0xe84393); g.fillRect(4, 0,  24, 14);
            g.fillStyle(0x1a1a2e); g.fillRect(9, 3,  6,  6);
            g.fillStyle(0x1a1a2e); g.fillRect(17, 3, 6,  6);
            g.fillStyle(0xf7c948); g.fillRect(2, 14, 28, 4);
        });
    }
}
