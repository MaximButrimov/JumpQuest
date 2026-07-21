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

        // ── Tile de piedra natural (32×16) ─────────────────
        // Roca rugosa MOTEADA (sin patrón de ladrillo/mampostería): cuerpo con
        // manchas irregulares, borde superior iluminado roto, grietas angulares
        // y motas minerales. Borde superior/inferior definen la superficie.
        defineTexture(scene, 'platform_stone', 32, 16, (g) => {
            g.fillStyle(0x6f7184); g.fillRect(0, 0, 32, 16);                 // cuerpo de roca
            g.fillStyle(0x616376); g.fillRect(0, 7, 15, 6); g.fillRect(17, 9, 15, 5); // manchas oscuras
            g.fillStyle(0x7d7f92); g.fillRect(5, 2, 13, 4); g.fillRect(21, 1, 9, 3);  // manchas claras
            // Borde superior iluminado, irregular (no una banda limpia)
            g.fillStyle(0x8d8fa2); g.fillRect(0, 0, 32, 2);
            g.fillStyle(0x9fa1b4); g.fillRect(2, 0, 7, 1); g.fillRect(15, 0, 6, 1); g.fillRect(26, 0, 4, 1);
            // Sombra inferior irregular
            g.fillStyle(0x40425a); g.fillRect(0, 13, 32, 3);
            g.fillStyle(0x4c4e66); g.fillRect(3, 12, 9, 1); g.fillRect(19, 13, 9, 1);
            // Grietas angulares (en L, no verticales rectas)
            g.fillStyle(0x3a3c50);
            g.fillRect(9, 3, 1, 4); g.fillRect(10, 6, 3, 1);
            g.fillRect(24, 4, 1, 5); g.fillRect(21, 9, 4, 1);
            // Motas minerales (oscuras y claras)
            g.fillStyle(0x33354a); g.fillRect(6, 9, 1, 1); g.fillRect(14, 11, 1, 1); g.fillRect(28, 8, 1, 1);
            g.fillStyle(0xb0b2c4); g.fillRect(12, 5, 1, 1); g.fillRect(19, 4, 1, 1); g.fillRect(29, 10, 1, 1);
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

        // ══════════════════════════════════════════════════════
        //  BLOQUES DE SUELO (32×80) — superficie arriba + cuerpo
        //  MACIZO abajo (sin franjas repetidas). Los usa
        //  PlatformManager.createGround() como TileSprite: se tilean
        //  en horizontal y el cuerpo sólido rellena hacia abajo.
        // ══════════════════════════════════════════════════════

        // Suelo de CÉSPED (césped arriba + tierra maciza)
        defineTexture(scene, 'ground_grass', 32, 80, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(0, 0, 32, 80);              // cuerpo de tierra
            g.fillStyle(0x5f3f22); g.fillRect(0, 44, 32, 36);            // tierra más oscura abajo
            g.fillStyle(0x7a5636); g.fillRect(3, 22, 10, 8); g.fillRect(18, 34, 9, 7); g.fillRect(6, 56, 8, 6); g.fillRect(20, 62, 8, 6);
            g.fillStyle(0x4a3018); g.fillRect(10, 30, 3, 2); g.fillRect(22, 48, 3, 2); g.fillRect(5, 68, 3, 2); g.fillRect(24, 24, 2, 2); // guijarros
            g.fillStyle(0x8a6038); g.fillRect(14, 40, 2, 2); g.fillRect(26, 58, 2, 2); g.fillRect(8, 50, 2, 2);   // motas claras
            // Superficie de césped (calcada de platform_tile)
            g.fillStyle(0x7a5230); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0x8a5f38); g.fillRect(0, 7, 32, 2);
            g.fillStyle(0x9a7048); g.fillRect(4, 11, 3, 2); g.fillRect(16, 12, 2, 2); g.fillRect(25, 11, 3, 2);
            g.fillStyle(0x3fa24f); g.fillRect(0, 0, 32, 6);
            for (let i = 0; i < 32; i += 8) g.fillRect(i, 6, 4, 2);
            g.fillStyle(0x5fc76a); g.fillRect(0, 0, 32, 2);
            g.fillStyle(0x2f7d3f); for (let i = 2; i < 32; i += 6) g.fillRect(i, 0, 1, 3);
        });

        // Suelo de PIEDRA (roca arriba + roca maciza)
        defineTexture(scene, 'ground_stone', 32, 80, (g) => {
            g.fillStyle(0x565863); g.fillRect(0, 0, 32, 80);              // cuerpo de roca
            g.fillStyle(0x484a54); g.fillRect(0, 44, 32, 36);           // roca más oscura abajo
            g.fillStyle(0x63656f); g.fillRect(4, 22, 11, 9); g.fillRect(19, 34, 9, 8); g.fillRect(7, 54, 9, 7); g.fillRect(21, 60, 8, 7);
            g.fillStyle(0x3a3c46); g.fillRect(12, 30, 1, 12); g.fillRect(24, 46, 1, 14); g.fillRect(8, 64, 1, 10); // grietas
            g.fillStyle(0x2f313a); g.fillRect(6, 44, 2, 2); g.fillRect(26, 52, 2, 2);   // motas oscuras
            // Superficie de piedra (calcada de platform_stone)
            g.fillStyle(0x6f7184); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0x616376); g.fillRect(0, 7, 15, 6); g.fillRect(17, 9, 15, 5);
            g.fillStyle(0x7d7f92); g.fillRect(5, 2, 13, 4); g.fillRect(21, 1, 9, 3);
            g.fillStyle(0x8d8fa2); g.fillRect(0, 0, 32, 2);
            g.fillStyle(0x9fa1b4); g.fillRect(2, 0, 7, 1); g.fillRect(15, 0, 6, 1); g.fillRect(26, 0, 4, 1);
            g.fillStyle(0x3a3c50); g.fillRect(9, 3, 1, 4); g.fillRect(10, 6, 3, 1); g.fillRect(24, 4, 1, 5); g.fillRect(21, 9, 4, 1);
        });

        // Suelo de HIELO (hielo arriba + hielo compacto)
        defineTexture(scene, 'ground_ice', 32, 80, (g) => {
            g.fillStyle(0x8ec4dc); g.fillRect(0, 0, 32, 80);              // cuerpo de hielo
            g.fillStyle(0x74aecb); g.fillRect(0, 44, 32, 36);           // hielo más denso abajo
            g.fillStyle(0xa6d6ea); g.fillRect(4, 24, 12, 9); g.fillRect(18, 40, 10, 8); g.fillRect(6, 58, 10, 7);
            g.fillStyle(0x5f97b8); g.fillRect(12, 28, 1, 14); g.fillRect(24, 48, 1, 16); g.fillRect(8, 64, 1, 10); // grietas
            g.fillStyle(0xffffff, 0.4); g.fillRect(6, 30, 4, 1); g.fillRect(20, 50, 5, 1);   // brillos internos
            // Superficie de hielo (calcada de platform_ice)
            g.fillStyle(0x9ad8ee); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0xd6f2ff); g.fillRect(0, 0, 32, 4);
            g.fillStyle(0x6fb2d0); g.fillRect(0, 13, 32, 3);
            g.fillStyle(0xffffff, 0.75); g.fillRect(3, 1, 9, 1);
            g.fillStyle(0xffffff, 0.4);  g.fillRect(18, 2, 7, 1);
            g.fillStyle(0x8ac6de); g.fillRect(11, 5, 1, 7); g.fillRect(23, 4, 1, 8); g.fillRect(6, 9, 4, 1);
        });

        // ── Tile de roca volcánica (32×16) — grietas ardientes ──
        defineTexture(scene, 'platform_volcanic', 32, 16, (g) => {
            g.fillStyle(0x2e2622); g.fillRect(0, 0, 32, 16);             // cuerpo de basalto
            g.fillStyle(0x1a1512); g.fillRect(0, 11, 32, 5);           // más oscuro abajo
            g.fillStyle(0x3a2f28); g.fillRect(4, 2, 12, 4); g.fillRect(20, 3, 9, 3); // manchas claras
            g.fillStyle(0x453931); g.fillRect(0, 0, 32, 2);            // borde iluminado
            g.fillStyle(0xff5a1e); g.fillRect(8, 4, 1, 8); g.fillRect(9, 9, 6, 1); g.fillRect(22, 3, 1, 9); // grietas de lava
            g.fillStyle(0xffb020); g.fillRect(8, 6, 1, 3); g.fillRect(22, 6, 1, 3);  // núcleo caliente
            g.fillStyle(0x140f0c); g.fillRect(0, 14, 32, 2);          // sombra inferior
        });

        // Suelo VOLCÁNICO (basalto arriba + roca maciza con vetas de lava)
        defineTexture(scene, 'ground_volcanic', 32, 80, (g) => {
            g.fillStyle(0x241d18); g.fillRect(0, 0, 32, 80);              // cuerpo de basalto
            g.fillStyle(0x1a1512); g.fillRect(0, 44, 32, 36);           // más oscuro abajo
            g.fillStyle(0x2e2622); g.fillRect(4, 22, 11, 9); g.fillRect(19, 34, 9, 8); g.fillRect(7, 56, 9, 7);
            g.fillStyle(0x14100c); g.fillRect(12, 30, 1, 14); g.fillRect(24, 48, 1, 16); // fisuras
            g.fillStyle(0x8a1f0a); g.fillRect(6, 40, 2, 20); g.fillRect(20, 54, 2, 22);  // vetas de lava profundas
            g.fillStyle(0xff5a1e); g.fillRect(6, 44, 1, 12); g.fillRect(20, 58, 1, 14);
            // Superficie de basalto con grietas ardientes
            g.fillStyle(0x2e2622); g.fillRect(0, 0, 32, 16);
            g.fillStyle(0x3a2f28); g.fillRect(4, 2, 12, 4); g.fillRect(20, 3, 9, 3);
            g.fillStyle(0x453931); g.fillRect(0, 0, 32, 2);            // borde superior
            g.fillStyle(0xff5a1e); g.fillRect(8, 4, 1, 9); g.fillRect(9, 10, 6, 1); g.fillRect(23, 3, 1, 10); // grietas
            g.fillStyle(0xffb020); g.fillRect(8, 6, 1, 3); g.fillRect(23, 7, 1, 3);
            g.fillStyle(0x140f0c); g.fillRect(0, 15, 32, 1);
        });
    }
}
