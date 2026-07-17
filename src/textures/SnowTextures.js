// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: NIEVE (cumbre helada de alta montaña)
//  Pino nevado, muñeco de nieve, formaciones de hielo, carámbanos,
//  rocas nevadas, dunas de nieve, lago congelado y bloques de glaciar.
//  Paleta gélida: blanco, azul hielo y gris roca fría.
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

        // ══════════════════════════════════════════════════════
        //  FORMACIONES DE HIELO Y NIEVE (alta montaña)
        // ══════════════════════════════════════════════════════

        // Aguja de hielo (18×40, origin 0.5,1)
        defineTexture(scene, 'ice_spike', 18, 40, (g) => {
            g.fillStyle(0x8fc4dc); g.fillTriangle(9, 0, 2, 40, 16, 40);      // cuerpo
            g.fillStyle(0xcfeaf7); g.fillTriangle(9, 3, 4, 40, 9, 40);       // cara clara
            g.fillStyle(0x6ba0c0); g.fillTriangle(9, 6, 12, 40, 16, 40);     // cara sombra
            g.fillStyle(0xffffff, 0.6); g.fillRect(7, 8, 2, 16);            // reflejo
        });

        // Racimo de agujas de hielo (46×48, origin 0.5,1)
        defineTexture(scene, 'ice_cluster', 46, 48, (g) => {
            g.fillStyle(0x0d1a24, 0.25); g.fillEllipse(23, 46, 42, 6);       // sombra
            const spike = (cx, top, w) => {
                g.fillStyle(0x8fc4dc); g.fillTriangle(cx, top, cx - w, 48, cx + w, 48);
                g.fillStyle(0xcfeaf7); g.fillTriangle(cx, top + 2, cx - w * 0.4, 48, cx, 48);
                g.fillStyle(0x6ba0c0); g.fillTriangle(cx, top + 4, cx + w * 0.5, 48, cx + w, 48);
            };
            spike(23, 6, 9); spike(12, 20, 7); spike(34, 16, 7); spike(18, 30, 5); spike(30, 32, 5);
            g.fillStyle(0xffffff, 0.5); g.fillRect(21, 10, 2, 20);          // reflejo central
        });

        // Carámbanos colgando de una repisa (40×34, origin 0.5,0)
        defineTexture(scene, 'icicles', 40, 34, (g) => {
            g.fillStyle(0xdcebf5); g.fillRect(0, 0, 40, 5);                  // repisa helada
            g.fillStyle(0xffffff, 0.7); g.fillRect(0, 0, 40, 2);
            const icicle = (x, len, w) => {
                g.fillStyle(0xbfe0f2); g.fillTriangle(x - w, 4, x + w, 4, x, len);
                g.fillStyle(0xe8f7ff, 0.8); g.fillTriangle(x - w * 0.5, 4, x, 4, x, len);
            };
            icicle(6, 26, 3); icicle(14, 18, 2.5); icicle(21, 32, 3.5); icicle(29, 20, 2.5); icicle(35, 14, 2);
        });

        // Roca parcialmente cubierta de nieve (52×34, origin 0.5,1)
        defineTexture(scene, 'snow_rock', 52, 34, (g) => {
            g.fillStyle(0x0d1a24, 0.3); g.fillEllipse(26, 33, 48, 6);        // sombra
            g.fillStyle(0x66707a); g.fillEllipse(26, 22, 48, 22);           // roca
            g.fillStyle(0x525b64); g.fillEllipse(34, 26, 30, 14);           // sombra roca
            g.fillStyle(0x7d8790); g.fillEllipse(18, 18, 22, 10);          // cara clara
            g.fillStyle(0xffffff); g.fillEllipse(24, 12, 44, 12);          // manto de nieve
            g.fillStyle(0xdcebf5); g.fillEllipse(30, 15, 30, 8);           // sombra de nieve
            g.fillStyle(0x4a4e54); g.fillRect(30, 22, 1, 8);              // grieta
        });

        // Acumulación / duna de nieve (86×24, origin 0.5,1)
        defineTexture(scene, 'snow_mound', 86, 24, (g) => {
            g.fillStyle(0xeef6fd); g.fillEllipse(43, 22, 84, 20);
            g.fillStyle(0xffffff); g.fillEllipse(34, 17, 54, 12);           // cresta
            g.fillStyle(0xcfe0f0, 0.7); g.fillEllipse(58, 22, 40, 10);      // sombra
        });

        // Lago/placa congelada con grietas (120×22, origin 0.5,1)
        defineTexture(scene, 'frozen_lake', 120, 22, (g) => {
            g.fillStyle(0x8fbdd8, 0.92); g.fillEllipse(60, 18, 116, 16);    // lámina de hielo
            g.fillStyle(0xbfe0f2, 0.85); g.fillEllipse(52, 15, 82, 9);      // zona clara
            g.fillStyle(0xffffff, 0.5); g.fillRect(22, 13, 38, 1);          // reflejo especular
            g.fillStyle(0x6fa8c8, 0.85);                                    // grietas
            g.fillRect(44, 12, 1, 8); g.fillRect(45, 16, 16, 1);
            g.fillRect(74, 12, 1, 7); g.fillRect(62, 15, 14, 1); g.fillRect(92, 13, 1, 6);
        });

        // Bloque de hielo/glaciar facetado (48×40, origin 0.5,1)
        defineTexture(scene, 'ice_boulder', 48, 40, (g) => {
            g.fillStyle(0x0d1a24, 0.3); g.fillEllipse(24, 38, 44, 6);        // sombra
            g.fillStyle(0x7fb4d0); g.fillRect(6, 14, 36, 24);              // cuerpo
            g.fillStyle(0xbfe6f5); g.fillTriangle(6, 14, 42, 14, 24, 4);   // cara superior (luz)
            g.fillStyle(0x9fd0e6); g.fillRect(6, 14, 18, 24);             // cara izq. clara
            g.fillStyle(0x6299ba); g.fillRect(24, 14, 18, 24);           // cara der. sombra
            g.fillStyle(0xffffff, 0.5); g.fillRect(10, 18, 3, 14);       // reflejo
            g.fillStyle(0x5f8fb0); g.fillRect(24, 16, 1, 20);          // arista
        });

        // ── Piezas pequeñas para dispersión de bordes ─────────
        // Mata de nieve (18×10, origin 0.5,1)
        defineTexture(scene, 'snow_tuft', 18, 10, (g) => {
            g.fillStyle(0xeef6fd); g.fillEllipse(9, 9, 16, 8);
            g.fillStyle(0xffffff); g.fillEllipse(7, 7, 9, 5);
            g.fillStyle(0xcfe0f0, 0.7); g.fillEllipse(12, 9, 8, 4);
        });

        // Esquirla de hielo (14×12, origin 0.5,1)
        defineTexture(scene, 'ice_bit', 14, 12, (g) => {
            g.fillStyle(0x8fc4dc); g.fillTriangle(7, 1, 3, 12, 11, 12);
            g.fillStyle(0xcfeaf7); g.fillTriangle(7, 3, 5, 12, 7, 12);
            g.fillStyle(0x6ba0c0); g.fillRect(8, 5, 2, 7);
        });
    }
}
