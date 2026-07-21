// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: VOLCÁN (nivel final, volcán en actividad)
//  Roca volcánica (basalto), obsidiana, ruinas calcinadas, árboles
//  quemados, charcos de lava, fumarolas y la puerta del jefe.
//  Paleta: basalto oscuro, lava incandescente (naranja/rojo) y ceniza.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class VolcanoTextures {
    static build(scene) {
        // Roca volcánica (basalto) con vetas de lava (56×40, origin 0.5,1)
        defineTexture(scene, 'volcano_rock', 56, 40, (g) => {
            g.fillStyle(0x0d0806, 0.5); g.fillEllipse(28, 38, 52, 8);    // sombra
            g.fillStyle(0x241d18); g.fillEllipse(28, 24, 52, 30);       // cuerpo
            g.fillStyle(0x362b24); g.fillEllipse(28, 22, 46, 26);
            g.fillStyle(0x483a30); g.fillEllipse(22, 16, 30, 14);       // cara iluminada
            g.fillStyle(0x14100c); g.fillEllipse(35, 28, 22, 12);       // cara en sombra
            g.fillStyle(0xff6a20); g.fillRect(18, 14, 1, 12); g.fillRect(19, 20, 8, 1); g.fillRect(30, 10, 1, 14); // grietas de lava
            g.fillStyle(0xffb020); g.fillRect(18, 18, 1, 4); g.fillRect(30, 16, 1, 5);   // núcleo incandescente
        });

        // Aguja de obsidiana (cristal negro) (20×44, origin 0.5,1)
        defineTexture(scene, 'obsidian_spike', 20, 44, (g) => {
            g.fillStyle(0x16131c); g.fillTriangle(10, 0, 2, 44, 18, 44);   // cuerpo
            g.fillStyle(0x2a2436); g.fillTriangle(10, 4, 4, 44, 10, 44);   // cara clara
            g.fillStyle(0x0a080e); g.fillTriangle(10, 6, 13, 44, 18, 44);  // cara oscura
            g.fillStyle(0x8a2f3a, 0.6); g.fillRect(8, 20, 1, 18);          // destello rojo
            g.fillStyle(0xffffff, 0.3); g.fillRect(7, 8, 1, 10);          // brillo vítreo
        });

        // Árbol calcinado con brasas (48×64, origin 0.5,1)
        defineTexture(scene, 'burnt_tree', 48, 64, (g) => {
            g.fillStyle(0x140f0c); g.fillRect(21, 18, 6, 46);              // tronco
            g.fillStyle(0x241a14);
            g.fillRect(24, 22, 12, 3); g.fillRect(34, 14, 3, 12);          // ramas
            g.fillRect(12, 28, 12, 3); g.fillRect(12, 20, 3, 10);
            g.fillRect(26, 34, 10, 3); g.fillRect(14, 40, 8, 3); g.fillRect(20, 12, 3, 10);
            g.fillStyle(0x0d0908); g.fillRect(36, 8, 2, 8); g.fillRect(10, 14, 2, 8); // ramitas
            g.fillStyle(0xff6a20); g.fillCircle(35, 15, 1); g.fillCircle(13, 21, 1); g.fillCircle(30, 33, 1); // brasas
            g.fillStyle(0xffb020); g.fillCircle(22, 26, 1);
            g.fillStyle(0x3a1a0a, 0.6); g.fillEllipse(24, 63, 22, 6);      // suelo chamuscado
        });

        // Ruina calcinada (torre quemada con ventanas de fuego) (72×124, origin 0.5,1)
        defineTexture(scene, 'ruin_burnt', 72, 124, (g) => {
            g.fillStyle(0x241d18); g.fillRect(8, 14, 56, 110);            // cuerpo
            g.fillStyle(0x30271f); g.fillRect(8, 14, 7, 110);            // cara iluminada
            g.fillStyle(0x140f0c); g.fillRect(57, 14, 7, 110);          // cara en sombra
            g.fillStyle(0x241d18);                                       // coronación rota
            g.fillRect(8, 6, 12, 10); g.fillRect(26, 2, 10, 14); g.fillRect(44, 10, 8, 6); g.fillRect(56, 4, 8, 12);
            let n = 0;                                                   // ventanas ardiendo
            for (let wy = 26; wy < 112; wy += 18) {
                for (let wx = 16; wx < 58; wx += 15) {
                    n = (n + 1) % 6;
                    if (n === 0 || n === 3) continue;
                    g.fillStyle(n % 2 ? 0xff6a20 : 0x8a1f0a); g.fillRect(wx, wy, 9, 11);
                    g.fillStyle(0xffb020, 0.5); g.fillRect(wx + 2, wy + 2, 4, 4);
                }
            }
            g.fillStyle(0xff5a1e); g.fillRect(30, 40, 1, 24); g.fillRect(31, 64, 1, 20); // grietas de lava
            g.fillStyle(0x0d0908); g.fillRect(2, 116, 68, 8);           // escombros base
        });

        // Charco de lava incandescente (84×22, origin 0.5,1)
        defineTexture(scene, 'lava_pool', 84, 22, (g) => {
            g.fillStyle(0x8a1f0a); g.fillEllipse(42, 18, 82, 16);        // lava profunda
            g.fillStyle(0xd83010); g.fillEllipse(42, 16, 70, 12);
            g.fillStyle(0xff5a1e); g.fillEllipse(40, 14, 54, 8);        // lava brillante
            g.fillStyle(0xffb020); g.fillEllipse(36, 13, 30, 4);       // núcleo caliente
            g.fillStyle(0x2e2622); g.fillEllipse(20, 15, 12, 4); g.fillEllipse(60, 16, 14, 5); // costra
            g.fillStyle(0xffcf5a, 0.6); g.fillRect(30, 12, 16, 1);     // brillo
        });

        // Fumarola / respiradero de roca (40×26, origin 0.5,1)
        defineTexture(scene, 'smoke_vent', 40, 26, (g) => {
            g.fillStyle(0x0d0806, 0.4); g.fillEllipse(20, 25, 36, 5);
            g.fillStyle(0x241d18); g.fillEllipse(20, 18, 38, 16);       // montículo
            g.fillStyle(0x362b24); g.fillEllipse(14, 14, 20, 8);
            g.fillStyle(0x0a0806); g.fillEllipse(22, 14, 14, 7);        // boca del respiradero
            g.fillStyle(0xff6a20); g.fillEllipse(22, 15, 8, 4);        // brillo interior
            g.fillStyle(0xffb020, 0.7); g.fillEllipse(22, 15, 4, 2);
        });

        // Puerta del jefe (portón siniestro con lava) (104×144, origin 0.5,1)
        defineTexture(scene, 'boss_gate', 104, 144, (g) => {
            g.fillStyle(0x1f1a17); g.fillRect(4, 10, 20, 134); g.fillRect(80, 10, 20, 134); // pilastras
            g.fillStyle(0x2e2622); g.fillRect(4, 10, 6, 134); g.fillRect(80, 10, 6, 134);   // aristas iluminadas
            g.fillStyle(0x1f1a17); g.fillRect(0, 0, 104, 20);          // dintel
            g.fillStyle(0x0d0908); g.fillRect(46, 4, 12, 12);          // ornamento (calavera)
            g.fillStyle(0xff5a1e); g.fillRect(49, 7, 2, 2); g.fillRect(54, 7, 2, 2);        // ojos incandescentes
            g.fillStyle(0x0a0806); g.fillRect(24, 20, 56, 124);       // vano oscuro
            g.fillStyle(0x8a1f0a, 0.85); g.fillRect(24, 108, 56, 36); // resplandor de lava al fondo
            g.fillStyle(0xff5a1e, 0.6);  g.fillRect(30, 122, 44, 22);
            g.fillStyle(0xffb020, 0.5);  g.fillRect(38, 132, 28, 12);
            g.fillStyle(0xff6a20); g.fillRect(12, 40, 4, 2); g.fillRect(12, 60, 4, 2); g.fillRect(88, 40, 4, 2); g.fillRect(88, 60, 4, 2); // runas
            g.fillStyle(0xff5a1e, 0.5); g.fillRect(14, 20, 1, 40); g.fillRect(90, 30, 1, 40); // grietas
        });

        // ── Piezas pequeñas para dispersión de bordes ─────────
        // Roca chamuscada (16×10, origin 0.5,1)
        defineTexture(scene, 'char_rock', 16, 10, (g) => {
            g.fillStyle(0x241d18); g.fillRect(2, 4, 7, 6); g.fillRect(8, 5, 6, 5);
            g.fillStyle(0x362b24); g.fillRect(2, 4, 7, 2); g.fillRect(8, 5, 6, 2);
            g.fillStyle(0xff6a20, 0.7); g.fillRect(5, 8, 4, 1);         // brasa
        });

        // Brasa / llamita (12×12, origin 0.5,1)
        defineTexture(scene, 'ember_bit', 12, 12, (g) => {
            for (let r = 6; r > 0; r--) { g.fillStyle(0xff6a20, 0.05 + 0.05 * (1 - r / 6)); g.fillCircle(6, 7, r); }
            g.fillStyle(0xff5a1e); g.fillTriangle(6, 1, 3, 11, 9, 11);
            g.fillStyle(0xffb020); g.fillTriangle(6, 4, 4, 11, 8, 11);
            g.fillStyle(0xffcf5a); g.fillTriangle(6, 7, 5, 11, 7, 11);
        });
    }
}
