// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: RUINAS (ciudad desértica postapocalíptica)
//  Edificios derruidos, muros rotos, columnas de arenisca, vehículos
//  abandonados, escombros, barriles, farolas dobladas, árboles secos y
//  dunas. Paleta árida: hormigón grisáceo, arenisca ocre y óxido.
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class RuinsTextures {
    static build(scene) {
        // ── Edificio derruido ALTO (torre) — origin 0.5,1 ─────
        defineTexture(scene, 'ruin_building_a', 72, 150, (g) => {
            g.fillStyle(0x847d70); g.fillRect(8, 14, 56, 136);       // cuerpo hormigón
            g.fillStyle(0x948d80); g.fillRect(8, 14, 7, 136);        // cara iluminada
            g.fillStyle(0x655f54); g.fillRect(57, 14, 7, 136);       // cara en sombra
            // Coronación rota (dientes irregulares)
            g.fillStyle(0x847d70);
            g.fillRect(8, 6, 12, 10); g.fillRect(26, 2, 10, 14); g.fillRect(44, 10, 8, 6); g.fillRect(56, 4, 8, 12);
            // Ventanas (huecos oscuros; algunas derrumbadas = ausentes)
            g.fillStyle(0x2b2720);
            let n = 0;
            for (let wy = 26; wy < 138; wy += 18) {
                for (let wx = 16; wx < 58; wx += 15) {
                    n = (n + 1) % 7;
                    if (n === 0 || n === 4) continue;               // huecos derrumbados
                    g.fillRect(wx, wy, 9, 11);
                }
            }
            // Grieta descendente y deterioro
            g.fillStyle(0x4a4438); g.fillRect(30, 40, 2, 30); g.fillRect(32, 68, 2, 24); g.fillRect(34, 90, 2, 30);
            g.fillStyle(0x5f594e, 0.55); g.fillRect(40, 100, 18, 40);
            g.fillStyle(0x6f695e); g.fillRect(2, 142, 68, 8);        // base de escombros
        });

        // ── Edificio derruido ANCHO (bloque escalonado) — origin 0.5,1 ─
        defineTexture(scene, 'ruin_building_b', 100, 104, (g) => {
            // Silueta escalonada: izquierda alta → derecha colapsada
            g.fillStyle(0x7c7566);
            g.fillRect(6, 24, 40, 80);
            g.fillRect(46, 44, 30, 60);
            g.fillRect(76, 60, 18, 44);
            g.fillStyle(0x8b8474); g.fillRect(6, 24, 7, 80);         // luz
            g.fillStyle(0x5e584c); g.fillRect(40, 24, 6, 80); g.fillRect(70, 60, 6, 44); // sombras
            // Coronaciones rotas
            g.fillStyle(0x7c7566);
            g.fillRect(10, 18, 10, 6); g.fillRect(28, 16, 8, 8); g.fillRect(50, 38, 8, 6); g.fillRect(80, 54, 8, 6);
            // Ventanas dentro de la silueta escalonada
            g.fillStyle(0x2a2620);
            for (let wy = 34; wy < 100; wy += 16) {
                for (let wx = 12; wx < 90; wx += 14) {
                    const topAt = wx < 46 ? 24 : wx < 76 ? 44 : 60;
                    if (wy < topAt + 6) continue;
                    if ((wx + wy) % 3 === 0) continue;              // algunas rotas
                    g.fillRect(wx, wy, 8, 9);
                }
            }
            g.fillStyle(0x6a645a); g.fillRect(2, 96, 96, 8);        // escombros base
        });

        // ── Muro roto (hormigón/ladrillo) — origin 0.5,1 ──────
        defineTexture(scene, 'broken_wall', 58, 42, (g) => {
            g.fillStyle(0x847d70);
            g.fillRect(2, 16, 54, 26);
            g.fillRect(4, 8, 16, 8); g.fillRect(26, 4, 14, 12); g.fillRect(44, 12, 10, 4); // borde roto
            g.fillStyle(0x948d80); g.fillRect(2, 16, 5, 26);
            g.fillStyle(0x655f54); g.fillRect(51, 16, 5, 26);
            g.fillStyle(0x6a645a);                                   // hiladas insinuadas
            g.fillRect(2, 24, 54, 1); g.fillRect(2, 32, 54, 1); g.fillRect(18, 16, 1, 8); g.fillRect(36, 25, 1, 7);
            g.fillStyle(0x2a2620); g.fillRect(30, 28, 8, 6);        // agujero
            g.fillStyle(0x6f695e); g.fillRect(0, 38, 58, 4);        // escombro base
        });

        // ── Columna de arenisca rota — origin 0.5,1 ───────────
        defineTexture(scene, 'ruin_column', 26, 72, (g) => {
            g.fillStyle(0xb0966a); g.fillRect(4, 12, 18, 60);       // fuste
            g.fillStyle(0xc6ac80); g.fillRect(4, 12, 4, 60);        // luz
            g.fillStyle(0x8c744c); g.fillRect(18, 12, 4, 60);       // sombra
            g.fillStyle(0xb0966a);                                   // cima rota
            g.fillTriangle(4, 14, 9, 4, 13, 14); g.fillTriangle(13, 14, 18, 7, 22, 14);
            g.fillStyle(0x6f5836); g.fillRect(11, 22, 1, 20); g.fillRect(8, 44, 1, 16); // grietas
            g.fillStyle(0x8c744c, 0.5); g.fillRect(4, 34, 18, 2);   // junta de tambor
            g.fillStyle(0x9a8258); g.fillRect(0, 66, 26, 6);        // base
        });

        // ── Coche abandonado y oxidado — origin 0.5,1 ─────────
        defineTexture(scene, 'car_wreck', 74, 38, (g) => {
            g.fillStyle(0x0d0a08, 0.4); g.fillEllipse(37, 37, 70, 6);   // sombra
            g.fillStyle(0x7a4020); g.fillRect(20, 6, 34, 14);           // cabina
            g.fillStyle(0x8a4a2a); g.fillRect(4, 18, 66, 14);           // carrocería
            g.fillStyle(0xa8623a); g.fillRect(4, 18, 66, 3);            // brillo óxido
            g.fillStyle(0x2a2622); g.fillRect(24, 9, 12, 9); g.fillRect(40, 9, 12, 9); // ventanas rotas
            g.fillStyle(0x1e1c1a); g.fillEllipse(20, 32, 18, 10); g.fillEllipse(56, 32, 18, 10); // ruedas
            g.fillStyle(0x3a3632); g.fillEllipse(20, 32, 8, 5); g.fillEllipse(56, 32, 8, 5);
            g.fillStyle(0x5a3018); g.fillRect(10, 24, 6, 4); g.fillRect(48, 22, 8, 5);  // óxido
            g.fillStyle(0x6a3a1e); g.fillRect(30, 26, 10, 3);
        });

        // ── Montón de escombros — origin 0.5,1 ────────────────
        defineTexture(scene, 'rubble_pile', 66, 30, (g) => {
            g.fillStyle(0x0d0a08, 0.35); g.fillEllipse(33, 28, 62, 6);
            g.fillStyle(0x736c60); g.fillEllipse(33, 24, 60, 16);       // montón
            g.fillStyle(0x8a8276); g.fillRect(8, 14, 14, 9); g.fillRect(40, 12, 16, 10);
            g.fillStyle(0x655e52); g.fillRect(22, 18, 12, 8); g.fillRect(30, 8, 10, 8);
            g.fillStyle(0x948c80); g.fillRect(10, 16, 6, 4); g.fillRect(44, 14, 7, 4); // caras claras
            g.fillStyle(0x4a4038); g.fillRect(16, 6, 1, 10); g.fillRect(38, 4, 1, 9); g.fillRect(50, 7, 1, 8); // rebar
        });

        // ── Losa de hormigón caída con rebar — origin 0.5,1 ───
        defineTexture(scene, 'debris_slab', 40, 28, (g) => {
            g.fillStyle(0x0d0a08, 0.3); g.fillEllipse(20, 26, 36, 5);
            g.fillStyle(0x7f786c); g.fillTriangle(2, 24, 38, 12, 38, 24);   // losa inclinada
            g.fillStyle(0x938b7e); g.fillTriangle(2, 24, 38, 12, 20, 18);   // cara superior
            g.fillStyle(0x5f584c); g.fillRect(2, 22, 36, 4);
            g.fillStyle(0x4a4038); g.fillRect(30, 4, 1, 10); g.fillRect(34, 6, 1, 8);  // rebar
            g.fillStyle(0x2a2620); g.fillRect(8, 18, 6, 2);
        });

        // ── Árbol seco — origin 0.5,1 ─────────────────────────
        defineTexture(scene, 'dead_tree', 48, 66, (g) => {
            g.fillStyle(0x5a4a30); g.fillRect(21, 20, 6, 46);              // tronco
            g.fillStyle(0x6b5a3a);
            g.fillRect(24, 24, 12, 3); g.fillRect(34, 16, 3, 12);          // rama der.
            g.fillRect(12, 30, 12, 3); g.fillRect(12, 22, 3, 10);          // rama izq.
            g.fillRect(26, 34, 10, 3); g.fillRect(14, 40, 8, 3);
            g.fillRect(20, 12, 3, 10);                                     // copa
            g.fillStyle(0x4a3c26);                                         // ramitas
            g.fillRect(36, 10, 2, 8); g.fillRect(10, 16, 2, 8); g.fillRect(30, 8, 2, 8);
            g.fillStyle(0x7a6642, 0.55); g.fillEllipse(24, 64, 22, 6);     // base seca
        });

        // ── Farola doblada — origin 0.5,1 ─────────────────────
        defineTexture(scene, 'lamp_post', 22, 92, (g) => {
            g.fillStyle(0x4a4e52); g.fillRect(8, 14, 4, 78);              // poste
            g.fillStyle(0x5e6266); g.fillRect(8, 14, 2, 78);             // luz
            g.fillStyle(0x4a4e52); g.fillRect(10, 14, 10, 3); g.fillRect(18, 14, 3, 8); // brazo doblado
            g.fillStyle(0x3a3e42); g.fillRect(15, 20, 9, 5);            // luminaria rota
            g.fillStyle(0x2a2c2e); g.fillRect(16, 22, 6, 2);
            g.fillStyle(0x3a3e42); g.fillRect(4, 88, 14, 4);            // base
            g.fillStyle(0x6a3a1e, 0.6); g.fillRect(9, 50, 3, 14);      // óxido
        });

        // ── Barril oxidado — origin 0.5,1 ─────────────────────
        defineTexture(scene, 'barrel', 18, 26, (g) => {
            g.fillStyle(0x0d0a08, 0.3); g.fillEllipse(9, 25, 16, 4);
            g.fillStyle(0x7a5a3a); g.fillRect(2, 2, 14, 23);            // cuerpo
            g.fillStyle(0x8f6a44); g.fillRect(2, 2, 4, 23);            // luz
            g.fillStyle(0x5a3f26); g.fillRect(12, 2, 4, 23);          // sombra
            g.fillStyle(0x4a3320); g.fillRect(2, 8, 14, 2); g.fillRect(2, 16, 14, 2); // aros
            g.fillStyle(0x3a2a1a); g.fillRect(6, 12, 4, 3);           // óxido/agujero
            g.fillStyle(0x9a7a50); g.fillEllipse(9, 3, 14, 4);        // tapa
        });

        // ── Duna/acumulación de arena — origin 0.5,1 ──────────
        defineTexture(scene, 'sand_drift', 92, 26, (g) => {
            g.fillStyle(0xc2a878); g.fillEllipse(46, 24, 90, 22);
            g.fillStyle(0xd2ba8c); g.fillEllipse(38, 20, 60, 12);      // cresta iluminada
            g.fillStyle(0xa8895c, 0.6); g.fillEllipse(64, 24, 44, 10); // sombra
            g.fillStyle(0xb69a68); g.fillRect(20, 18, 20, 1); g.fillRect(50, 20, 24, 1); // ondulaciones
        });

        // ── Piezas pequeñas para dispersión de bordes ─────────
        // Escombro pequeño (origin 0.5,1)
        defineTexture(scene, 'rubble_bit', 16, 10, (g) => {
            g.fillStyle(0x736c60); g.fillRect(2, 4, 7, 6); g.fillRect(8, 5, 6, 5);
            g.fillStyle(0x8a8276); g.fillRect(2, 4, 7, 2); g.fillRect(8, 5, 6, 2);
            g.fillStyle(0x5f584c); g.fillRect(4, 8, 9, 2);
        });

        // Mata de hierba seca (origin 0.5,1)
        defineTexture(scene, 'dry_tuft', 18, 14, (g) => {
            const blade = (x, h, c) => { g.fillStyle(c); g.fillRect(x, 14 - h, 1, h); };
            blade(4, 9, 0x8a7448); blade(6, 12, 0xa89058); blade(8, 8, 0x6b5a34);
            blade(10, 11, 0x8a7448); blade(12, 7, 0xa89058); blade(14, 10, 0x6b5a34);
            g.fillStyle(0x6b5a34); g.fillRect(6, 2, 2, 1); g.fillRect(10, 3, 2, 1);
        });

        // Chatarra metálica (origin 0.5,1)
        defineTexture(scene, 'scrap_bit', 16, 10, (g) => {
            g.fillStyle(0x5a5e62); g.fillRect(2, 5, 12, 4);
            g.fillStyle(0x72767a); g.fillRect(2, 5, 12, 1);
            g.fillStyle(0x8a4a2a); g.fillRect(5, 6, 5, 2);            // óxido
            g.fillStyle(0x4a4e52); g.fillRect(3, 3, 1, 4); g.fillRect(11, 2, 1, 6); // varilla doblada
        });
    }
}
