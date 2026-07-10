// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: VEGETACIÓN y elementos naturales (bosque)
//  árboles, arbustos, helechos, flores, setas, matas de hierba,
//  rocas, troncos y raíces. Origin inferior (0.5,1) salvo aviso.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class VegetationTextures {
    static build(scene) {
        const t = (key, w, h, draw) => defineTexture(scene, key, w, h, draw);

        // Arbusto simple
        t('bush', 40, 28, (g) => {
            g.fillStyle(0x2ab866); g.fillEllipse(20, 16, 40, 28);
            g.fillStyle(0x3ddc84); g.fillEllipse(20, 12, 32, 20);
            g.fillStyle(0x5af5a0, 0.5); g.fillEllipse(14, 10, 12, 8);
        });

        // Arbusto frondoso
        t('bush_lush', 56, 40, (g) => {
            g.fillStyle(0x276b36); g.fillEllipse(28, 26, 54, 28);
            g.fillStyle(0x379149); g.fillEllipse(18, 18, 26, 18); g.fillEllipse(40, 20, 24, 18); g.fillEllipse(28, 14, 24, 16);
            g.fillStyle(0x54bd5f, 0.8); g.fillEllipse(16, 14, 12, 8); g.fillEllipse(34, 12, 10, 7);
            g.fillStyle(0xe8556d); g.fillCircle(12, 22, 2); g.fillCircle(44, 24, 2); // florecillas
            g.fillStyle(0xf6c945); g.fillCircle(30, 26, 2);
        });

        // Roble grande (copa en varias capas)
        t('tree_oak', 148, 184, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(62, 96, 24, 88);          // tronco
            g.fillStyle(0x7d5836); g.fillRect(62, 96, 6, 88);
            g.fillStyle(0x54381f); g.fillRect(80, 96, 6, 88);
            g.fillTriangle(62, 168, 44, 184, 64, 184);                  // raíces
            g.fillStyle(0x6b4a2a); g.fillTriangle(86, 168, 84, 184, 104, 184);
            g.fillStyle(0x4a3018); g.fillRect(69, 120, 2, 54); g.fillRect(77, 108, 2, 62);
            g.fillStyle(0x276b36);                                      // copa oscura
            g.fillCircle(74, 62, 56); g.fillCircle(34, 84, 36); g.fillCircle(112, 82, 36); g.fillCircle(74, 104, 44);
            g.fillStyle(0x379149);                                      // media
            g.fillCircle(62, 56, 42); g.fillCircle(98, 68, 30); g.fillCircle(46, 74, 26); g.fillCircle(86, 96, 26);
            g.fillStyle(0x54bd5f);                                      // luz
            g.fillCircle(56, 44, 22); g.fillCircle(90, 56, 14); g.fillCircle(70, 78, 14);
            g.fillStyle(0x74d97a, 0.7);
            g.fillCircle(52, 40, 9); g.fillCircle(86, 52, 6);
        });

        // Árbol de fondo (oscuro/plano, da profundidad)
        t('tree_bg', 108, 148, (g) => {
            g.fillStyle(0x3f2d1a); g.fillRect(48, 78, 12, 70);          // tronco
            g.fillStyle(0x1f5330);
            g.fillCircle(54, 52, 44); g.fillCircle(26, 70, 28); g.fillCircle(82, 70, 28); g.fillCircle(54, 88, 34);
            g.fillStyle(0x27653b);
            g.fillCircle(48, 46, 28); g.fillCircle(74, 60, 18);
        });

        // Helecho
        t('fern', 46, 40, (g) => {
            const b = { x: 23, y: 40 };
            g.fillStyle(0x2f7d3f);
            g.fillTriangle(b.x, b.y, 2, 12, 12, 22);
            g.fillTriangle(b.x, b.y, 44, 12, 34, 22);
            g.fillTriangle(b.x, b.y, 8, 4, 18, 18);
            g.fillTriangle(b.x, b.y, 38, 4, 28, 18);
            g.fillStyle(0x46a555);
            g.fillTriangle(b.x, b.y, 23, 0, 17, 18);
            g.fillTriangle(b.x, b.y, 15, 8, 21, 22);
            g.fillTriangle(b.x, b.y, 31, 8, 25, 22);
            g.fillStyle(0x2a6b34); g.fillRect(22, 14, 2, 26);          // nervio
        });

        // Helecho de PRIMER PLANO (grande; se usa semitransparente)
        t('fg_fern', 128, 132, (g) => {
            const b = { x: 64, y: 132 };
            g.fillStyle(0x1f5330);
            g.fillTriangle(b.x, b.y, 4, 44, 34, 78);
            g.fillTriangle(b.x, b.y, 124, 44, 94, 78);
            g.fillTriangle(b.x, b.y, 18, 18, 50, 62);
            g.fillTriangle(b.x, b.y, 110, 18, 78, 62);
            g.fillTriangle(b.x, b.y, 64, 4, 44, 56);
            g.fillStyle(0x2a6b34);
            g.fillTriangle(b.x, b.y, 30, 52, 52, 80);
            g.fillTriangle(b.x, b.y, 98, 52, 76, 80);
            g.fillTriangle(b.x, b.y, 64, 20, 50, 66);
        });

        // Mata de hierba (bordes de plataforma)
        t('grass_tuft', 26, 15, (g) => {
            g.fillStyle(0x2f7d3f);
            g.fillTriangle(13, 15, 3, 1, 9, 15);
            g.fillTriangle(13, 15, 23, 2, 17, 15);
            g.fillStyle(0x46a555);
            g.fillTriangle(13, 15, 8, 0, 13, 15);
            g.fillTriangle(13, 15, 18, 1, 14, 15);
            g.fillStyle(0x54bd5f); g.fillRect(12, 1, 1, 13);
        });

        // Flores (roja / amarilla)
        const flower = (key, petal, center) => t(key, 16, 22, (g) => {
            g.fillStyle(0x3d9440); g.fillRect(7, 9, 2, 13);            // tallo
            g.fillStyle(0x4caf50); g.fillTriangle(9, 15, 15, 12, 9, 18); // hoja
            g.fillStyle(petal);
            g.fillCircle(8, 6, 3); g.fillCircle(4, 7, 2.6); g.fillCircle(12, 7, 2.6);
            g.fillCircle(6, 10, 2.6); g.fillCircle(10, 10, 2.6); g.fillCircle(8, 3, 2.6);
            g.fillStyle(center); g.fillCircle(8, 7, 2.2);
        });
        flower('flower_red', 0xe8556d, 0xffd93b);
        flower('flower_yellow', 0xf6c945, 0xe8822a);

        // Par de setas
        t('mushroom_pair', 24, 18, (g) => {
            g.fillStyle(0xf0e6d2); g.fillRect(5, 9, 3, 9); g.fillRect(15, 11, 3, 7);
            g.fillStyle(0xd23b3b); g.fillEllipse(6, 8, 13, 8);
            g.fillStyle(0xd23b3b); g.fillEllipse(16, 10, 11, 7);
            g.fillStyle(0xffffff); g.fillCircle(4, 7, 1.4); g.fillCircle(8, 8, 1.4); g.fillCircle(16, 9, 1.2);
        });

        // Roca con musgo
        t('rock_moss', 50, 34, (g) => {
            g.fillStyle(0x8a8f98); g.fillEllipse(25, 22, 46, 26);
            g.fillStyle(0x6f747d); g.fillEllipse(25, 28, 46, 14);
            g.fillStyle(0xaab0b8); g.fillEllipse(17, 15, 20, 10);
            g.fillStyle(0x379149); g.fillEllipse(25, 11, 36, 10);      // musgo
            g.fillStyle(0x54bd5f); g.fillEllipse(18, 9, 10, 5);
        });

        // Tronco caído con musgo
        t('log_moss', 68, 30, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(4, 10, 62, 18);
            g.fillStyle(0x54381f); g.fillRect(4, 22, 62, 6);
            g.fillStyle(0x8a5f38); g.fillEllipse(8, 19, 12, 18);       // anillo del extremo
            g.fillStyle(0x6b4a2a); g.fillEllipse(8, 19, 7, 11);
            g.fillStyle(0x4a3018); g.fillRect(24, 13, 1, 12); g.fillRect(40, 13, 1, 12); g.fillRect(54, 13, 1, 12);
            g.fillStyle(0x379149); g.fillRect(14, 8, 48, 5);           // musgo superior
            g.fillStyle(0x54bd5f); g.fillRect(20, 8, 6, 3); g.fillRect(42, 8, 8, 3);
        });

        // Raíces expuestas
        t('roots', 56, 20, (g) => {
            g.fillStyle(0x6b4a2a);
            g.fillTriangle(28, 0, 4, 20, 16, 20);
            g.fillTriangle(28, 0, 40, 20, 52, 20);
            g.fillTriangle(28, 0, 24, 20, 32, 20);
            g.fillStyle(0x54381f);
            g.fillRect(9, 14, 3, 6); g.fillRect(27, 12, 3, 8); g.fillRect(45, 14, 3, 6);
        });
    }
}
