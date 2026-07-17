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

        // ══════════════════════════════════════════════════════
        //  AMPLIACIÓN DE AMBIENTE (cueva húmeda y bioluminiscente)
        //  Nuevas piezas reutilizables por cualquier bioma rocoso.
        // ══════════════════════════════════════════════════════

        // Roca/pedrusco redondeado con musgo (origin 0.5, 1) — versátil,
        // sirve de relleno de suelo, fondo (tenue) y primer plano (oscurecido).
        defineTexture(scene, 'cave_boulder', 56, 40, (g) => {
            g.fillStyle(0x0d0a1a, 0.5); g.fillEllipse(28, 38, 52, 8);   // sombra suelo
            g.fillStyle(0x2a2540); g.fillEllipse(28, 24, 52, 30);       // cuerpo
            g.fillStyle(0x413a58); g.fillEllipse(28, 22, 46, 26);
            g.fillStyle(0x554c70); g.fillEllipse(22, 16, 30, 14);       // cara iluminada
            g.fillStyle(0x6b6088, 0.6); g.fillEllipse(18, 13, 14, 6);   // brillo
            g.fillStyle(0x241f36); g.fillRect(31, 10, 2, 18); g.fillRect(31, 26, 12, 2); // grietas
            g.fillStyle(0x2f5a3a, 0.85); g.fillEllipse(40, 12, 14, 6);  // musgo húmedo
            g.fillStyle(0x3f7a4a, 0.6);  g.fillEllipse(42, 11, 8, 3);
        });

        // Racimo de cristales luminiscentes con halo horneado (origin 0.5, 1).
        defineTexture(scene, 'crystal_cluster', 60, 64, (g) => {
            for (let r = 30; r > 0; r -= 3) {                            // halo (glow)
                g.fillStyle(0x39d0ff, 0.03 + 0.03 * (1 - r / 30));
                g.fillCircle(30, 42, r);
            }
            g.fillStyle(0x2a2540); g.fillEllipse(30, 61, 42, 10);        // base rocosa
            const shard = (cx, top, w, c1, c2) => {
                g.fillStyle(c1);      g.fillTriangle(cx, top, cx - w, 60, cx + w, 60);
                g.fillStyle(c2, 0.75); g.fillTriangle(cx, top + 3, cx - w * 0.45, 60, cx, 60);
            };
            shard(30, 14, 9, 0x39d0ff, 0x9af0ff);   // central alto
            shard(17, 30, 7, 0x2ab0e0, 0x7af5ff);
            shard(43, 26, 7, 0x5ae0ff, 0xbff4ff);
            shard(23, 40, 5, 0x2ab0e0, 0x7af5ff);
            shard(39, 42, 5, 0x39d0ff, 0x9af0ff);
        });

        // Hongos bioluminiscentes en grupo (origin 0.5, 1).
        defineTexture(scene, 'glow_mushroom', 32, 28, (g) => {
            for (let r = 15; r > 0; r -= 3) {                            // halo (glow)
                g.fillStyle(0x50f5c0, 0.04 + 0.04 * (1 - r / 15));
                g.fillCircle(13, 18, r);
            }
            const mush = (bx, by, s, cap) => {
                const stemH = 9 * s, capW = 15 * s, capH = 9 * s, capY = by - stemH;
                g.fillStyle(0xe8f0e0);        g.fillRect(bx - 1.5 * s, capY, 3 * s, stemH); // tallo
                g.fillStyle(cap);             g.fillEllipse(bx, capY, capW, capH);          // sombrero
                g.fillStyle(0xbff4ff, 0.75);  g.fillEllipse(bx - 2 * s, capY - 1, 5 * s, 3 * s); // brillo
                g.fillStyle(0xffffff, 0.6);   g.fillCircle(bx + 3 * s, capY + 1, 1);        // punto
            };
            mush(13, 26, 1.0, 0x39d0ff);
            mush(24, 27, 0.7, 0x50f5c0);
        });

        // Liana/raíces colgando del techo (origin 0.5, 0) — vegetación subterránea.
        defineTexture(scene, 'cave_vine', 20, 76, (g) => {
            g.fillStyle(0x274d30);
            for (let y = 0; y < 76; y += 4) {                            // tallo ondulado
                const x = 10 + Math.sin(y * 0.18) * 3;
                g.fillRect(x - 1.5, y, 3, 4);
            }
            g.fillStyle(0x336b3f);
            for (let y = 12; y < 72; y += 15) {                          // hojas alternas
                const x = 10 + Math.sin(y * 0.18) * 3;
                g.fillEllipse(x - 5, y, 9, 4);
                g.fillEllipse(x + 5, y + 7, 9, 4);
            }
            g.fillStyle(0x7af5ff, 0.55);                                 // brotes luminosos
            for (let y = 20; y < 72; y += 24) {
                const x = 10 + Math.sin(y * 0.18) * 3;
                g.fillCircle(x, y, 1.5);
            }
        });

        // Columna rota antigua con musgo (origin 0.5, 1) — ruinas subterráneas.
        defineTexture(scene, 'cave_pillar', 44, 130, (g) => {
            g.fillStyle(0x3a3550); g.fillRect(4, 118, 36, 12);          // base
            g.fillStyle(0x2a2540); g.fillRect(4, 126, 36, 4);
            g.fillStyle(0x4a4463); g.fillRect(11, 18, 22, 102);         // fuste
            g.fillStyle(0x5a5478); g.fillRect(13, 18, 4, 102);         // luz izq.
            g.fillStyle(0x322c46); g.fillRect(28, 18, 5, 102);         // sombra der.
            g.fillStyle(0x2a2540); g.fillRect(19, 20, 1, 96); g.fillRect(25, 20, 1, 96); // estrías
            g.fillStyle(0x4a4463); g.fillTriangle(11, 20, 33, 20, 13, 4); // capitel roto
            g.fillStyle(0x241f36); g.fillRect(21, 40, 2, 30); g.fillRect(16, 72, 8, 2);  // grietas
            g.fillStyle(0x2f5a3a, 0.85); g.fillEllipse(15, 116, 16, 8); g.fillEllipse(33, 120, 12, 6); // musgo
            g.fillStyle(0x3f7a4a, 0.55);  g.fillEllipse(15, 114, 9, 4);
        });

        // Charco de agua reflectante (origin 0.5, 1) — humedad de cueva.
        defineTexture(scene, 'cave_puddle', 72, 18, (g) => {
            g.fillStyle(0x0e1826, 0.85); g.fillEllipse(36, 14, 70, 12);
            g.fillStyle(0x1a3550, 0.8);  g.fillEllipse(36, 13, 60, 9);
            g.fillStyle(0x2f6a8a, 0.5);  g.fillEllipse(36, 12, 44, 5);   // reflejo
            g.fillStyle(0x7fc8e8, 0.5);  g.fillRect(16, 11, 18, 1);      // brillo especular
            g.fillStyle(0x7fc8e8, 0.3);  g.fillRect(46, 13, 12, 1);
        });

        // Mata de musgo con motas bioluminiscentes (origin 0.5, 1) — dispersión de suelo.
        defineTexture(scene, 'moss_patch', 26, 12, (g) => {
            g.fillStyle(0x274d30); g.fillEllipse(13, 10, 24, 8);
            g.fillStyle(0x336b3f); g.fillEllipse(10, 8, 12, 6); g.fillEllipse(17, 9, 12, 6);
            g.fillStyle(0x4f8a55, 0.8);
            for (let i = 3; i < 24; i += 4) g.fillRect(i, 4, 1, 4);      // briznas
            g.fillStyle(0x7af5ff, 0.8); g.fillCircle(8, 6, 1); g.fillCircle(19, 7, 1);
        });
    }
}
