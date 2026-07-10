// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: TERRENO (tiles de plataforma)
//  césped, piedra, plataforma móvil y hielo.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class TerrainTextures {
    static build(scene) {
        // ── Tile de césped sobre tierra (32×16) ────────────
        defineTexture(scene, 'platform_tile', 32, 16, (g) => {
            // Cuerpo de tierra
            g.fillStyle(0x7a5230); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0x5f3f22); g.fillRect(0, 11, 32, 5);          // tierra baja (sombra)
            g.fillStyle(0x8a5f38); g.fillRect(0, 7, 32, 2);           // luz bajo el césped
            // Guijarros / motas de tierra
            g.fillStyle(0x9a7048); g.fillRect(4, 11, 3, 2); g.fillRect(16, 12, 2, 2); g.fillRect(25, 11, 3, 2);
            g.fillStyle(0x4a3018); g.fillRect(10, 13, 2, 1); g.fillRect(21, 13, 2, 1);
            // Franja de césped con borde inferior irregular (tileable cada 8px)
            g.fillStyle(0x3fa24f); g.fillRect(0, 0, 32, 6);
            for (let i = 0; i < 32; i += 8) g.fillRect(i, 6, 4, 2);   // dientes hacia la tierra
            // Brillo y briznas del césped
            g.fillStyle(0x5fc76a); g.fillRect(0, 0, 32, 2);
            g.fillStyle(0x2f7d3f);
            for (let i = 2; i < 32; i += 6) g.fillRect(i, 0, 1, 3);   // briznas oscuras
        });

        // ── Tile de piedra (32×16) ─────────────────────────
        defineTexture(scene, 'platform_stone', 32, 16, (g) => {
            g.fillStyle(0x8899aa); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0xaabbcc); g.fillRect(0, 0, 32, 3);
            g.fillStyle(0x6677aa); g.fillRect(0, 13, 32, 3);
            g.fillStyle(0x445566);                                    // grietas
            g.fillRect(8, 5, 1, 6);
            g.fillRect(20, 3, 1, 8);
            g.fillStyle(0xccddee); g.fillRect(2, 1, 4, 1);            // brillo
        });

        // ── Tile de plataforma móvil (dorada) (32×12) ──────
        defineTexture(scene, 'platform_moving', 32, 12, (g) => {
            g.fillStyle(0xc8820a); g.fillRect(0, 0, 32, 12);
            g.fillStyle(0xf7c948); g.fillRect(0, 0, 32, 4);
            g.fillStyle(0xffd700); g.fillRect(0, 0, 32, 2);
            g.fillStyle(0x8b5800); g.fillRect(0, 10, 32, 2);
            g.fillStyle(0xfff0a0);                                    // tachuelas
            for (let i = 4; i < 32; i += 10) g.fillRect(i, 5, 3, 3);
            g.fillStyle(0x1a1a2e); g.fillTriangle(3, 6, 7, 4, 7, 8);  // flecha
        });

        // ── Tile de hielo (32×16) — superficie deslizante ──
        defineTexture(scene, 'platform_ice', 32, 16, (g) => {
            g.fillStyle(0x9ad8ee); g.fillRect(0, 0, 32, 16);          // cuerpo de hielo
            g.fillStyle(0xd6f2ff); g.fillRect(0, 0, 32, 4);           // brillo superior
            g.fillStyle(0x6fb2d0); g.fillRect(0, 13, 32, 3);          // sombra inferior
            g.fillStyle(0xffffff, 0.75); g.fillRect(3, 1, 9, 1);      // reflejos glaseados
            g.fillStyle(0xffffff, 0.4);  g.fillRect(18, 2, 7, 1);
            g.fillStyle(0x8ac6de);                                    // grietas sutiles
            g.fillRect(11, 5, 1, 7);
            g.fillRect(23, 4, 1, 8);
            g.fillRect(6, 9, 4, 1);
        });
    }
}
