// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: ENEMIGOS (slime, murciélago, esqueleto en llamas)
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class EnemyTextures {
    static build(scene) {
        // Esqueleto en llamas (exclusivo del volcán) (26×34)
        defineTexture(scene, 'enemy_skeleton', 26, 34, (g) => {
            // Llama sobre el cráneo
            g.fillStyle(0xffb020); g.fillTriangle(13, 0, 9, 8, 17, 8);
            g.fillStyle(0xffcf5a); g.fillTriangle(13, 3, 11, 8, 15, 8);
            // Cráneo
            g.fillStyle(0xe8e4d8); g.fillEllipse(13, 11, 15, 13);
            g.fillStyle(0xcfcabb); g.fillRect(9, 15, 8, 3);            // mandíbula
            g.fillStyle(0x140f0c); g.fillCircle(9, 11, 2); g.fillCircle(17, 11, 2);   // cuencas
            g.fillStyle(0xff6a20); g.fillCircle(9, 11, 1); g.fillCircle(17, 11, 1);   // ojos ardientes
            g.fillStyle(0x140f0c); g.fillRect(10, 16, 1, 2); g.fillRect(13, 16, 1, 2); g.fillRect(16, 16, 1, 2); // dientes
            // Caja torácica
            g.fillStyle(0xe8e4d8); g.fillRect(8, 19, 10, 9);
            g.fillStyle(0x140f0c); g.fillRect(8, 21, 10, 1); g.fillRect(8, 24, 10, 1); // costillas
            g.fillStyle(0xcfcabb); g.fillRect(12, 19, 2, 9);          // columna
            // Piernas
            g.fillStyle(0xe8e4d8); g.fillRect(9, 28, 3, 6); g.fillRect(14, 28, 3, 6);
            g.fillStyle(0xcfcabb); g.fillRect(9, 28, 1, 6); g.fillRect(14, 28, 1, 6);
        });

        // Jefe — esqueleto con ARMADURA (casco con cuernos, coraza, hombreras) (40×48)
        defineTexture(scene, 'enemy_boss', 40, 48, (g) => {
            // Aura de fuego (detrás)
            g.fillStyle(0xff5a1e, 0.4);  g.fillTriangle(20, 2, 5, 26, 35, 26);
            g.fillStyle(0xff8a2a, 0.35); g.fillTriangle(8, 10, 3, 28, 14, 28);
            g.fillStyle(0xff8a2a, 0.35); g.fillTriangle(32, 10, 26, 28, 37, 28);
            // Cuernos del casco
            g.fillStyle(0x3a3e46); g.fillTriangle(9, 8, 4, 0, 12, 8); g.fillTriangle(31, 8, 36, 0, 28, 8);
            // Casco
            g.fillStyle(0x4a4e58); g.fillRect(9, 6, 22, 14);
            g.fillStyle(0x5e626c); g.fillRect(9, 6, 22, 3);          // brillo
            g.fillStyle(0x2e323a); g.fillRect(9, 17, 22, 3);         // sombra
            // Visera oscura + ojos ardientes
            g.fillStyle(0x140f0c); g.fillRect(12, 11, 16, 6);
            g.fillStyle(0xff6a20); g.fillCircle(16, 14, 2); g.fillCircle(24, 14, 2);
            g.fillStyle(0xffb020); g.fillCircle(16, 14, 1); g.fillCircle(24, 14, 1);
            // Hombreras
            g.fillStyle(0x3a3e46); g.fillEllipse(8, 24, 12, 9); g.fillEllipse(32, 24, 12, 9);
            g.fillStyle(0x51555f); g.fillEllipse(7, 22, 7, 4); g.fillEllipse(31, 22, 7, 4);
            // Coraza
            g.fillStyle(0x4a4e58); g.fillRect(10, 21, 20, 17);
            g.fillStyle(0x5e626c); g.fillRect(10, 21, 20, 3);
            g.fillStyle(0x2e323a); g.fillRect(10, 35, 20, 3);
            g.fillStyle(0xe8e4d8); g.fillRect(15, 25, 10, 2); g.fillRect(15, 29, 10, 2); // costillas expuestas
            // Grieta incandescente en la coraza
            g.fillStyle(0xff5a1e); g.fillRect(19, 21, 2, 15);
            g.fillStyle(0xffb020); g.fillRect(19, 25, 2, 5);
            // Piernas (hueso + botas de armadura)
            g.fillStyle(0xe8e4d8); g.fillRect(14, 38, 4, 8); g.fillRect(22, 38, 4, 8);
            g.fillStyle(0x3a3e46); g.fillRect(12, 44, 7, 4); g.fillRect(21, 44, 7, 4);
        });


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
