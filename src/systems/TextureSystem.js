export default class TextureSystem {
    constructor(scene) {
        this.scene = scene;
    }

    build() {
        this._buildCoin();
        this._buildEnemy();
        this._buildBat();
        this._buildPortal();
        this._buildPowerStar();
        this._buildDecorations();
        this._buildCaveDecorations();
        this._buildBridgeParts();
        this._buildSnowDecorations();
        this._buildForestScenery();
    }

    // ── Vegetación de bosque (nivel 1-1) ─────────────────────────
    // Set de props naturales: árboles, helechos, flores, rocas, troncos,
    // setas, matas de hierba y helecho de primer plano. Todas con origin
    // inferior (0.5, 1) salvo indicación, listas para el sistema de
    // decoraciones data-driven de Level.
    _buildForestScenery() {
        const scene = this.scene;
        const make = (key, w, h, draw) => {
            if (scene.textures.exists(key)) return;
            const g = scene.make.graphics({ add: false });
            draw(g);
            g.generateTexture(key, w, h);
            g.destroy();
        };

        // Roble grande (copa frondosa en varias capas)
        make('tree_oak', 148, 184, (g) => {
            // Tronco con vuelo de raíces
            g.fillStyle(0x6b4a2a); g.fillRect(62, 96, 24, 88);
            g.fillStyle(0x7d5836); g.fillRect(62, 96, 6, 88);            // luz izq.
            g.fillStyle(0x54381f); g.fillRect(80, 96, 6, 88);            // sombra der.
            g.fillTriangle(62, 168, 44, 184, 64, 184);                  // raíz izq.
            g.fillStyle(0x6b4a2a); g.fillTriangle(86, 168, 84, 184, 104, 184); // raíz der.
            g.fillStyle(0x4a3018); g.fillRect(69, 120, 2, 54); g.fillRect(77, 108, 2, 62); // corteza
            // Copa: capas oscura → media → luz
            g.fillStyle(0x276b36);
            g.fillCircle(74, 62, 56); g.fillCircle(34, 84, 36); g.fillCircle(112, 82, 36); g.fillCircle(74, 104, 44);
            g.fillStyle(0x379149);
            g.fillCircle(62, 56, 42); g.fillCircle(98, 68, 30); g.fillCircle(46, 74, 26); g.fillCircle(86, 96, 26);
            g.fillStyle(0x54bd5f);
            g.fillCircle(56, 44, 22); g.fillCircle(90, 56, 14); g.fillCircle(70, 78, 14);
            g.fillStyle(0x74d97a, 0.7);
            g.fillCircle(52, 40, 9); g.fillCircle(86, 52, 6);
        });

        // Árbol de fondo (más oscuro/plano, da profundidad)
        make('tree_bg', 108, 148, (g) => {
            g.fillStyle(0x3f2d1a); g.fillRect(48, 78, 12, 70);          // tronco
            g.fillStyle(0x1f5330);
            g.fillCircle(54, 52, 44); g.fillCircle(26, 70, 28); g.fillCircle(82, 70, 28); g.fillCircle(54, 88, 34);
            g.fillStyle(0x27653b);
            g.fillCircle(48, 46, 28); g.fillCircle(74, 60, 18);
        });

        // Arbusto frondoso (mejor que el 'bush' plano)
        make('bush_lush', 56, 40, (g) => {
            g.fillStyle(0x276b36); g.fillEllipse(28, 26, 54, 28);
            g.fillStyle(0x379149); g.fillEllipse(18, 18, 26, 18); g.fillEllipse(40, 20, 24, 18); g.fillEllipse(28, 14, 24, 16);
            g.fillStyle(0x54bd5f, 0.8); g.fillEllipse(16, 14, 12, 8); g.fillEllipse(34, 12, 10, 7);
            g.fillStyle(0xe8556d); g.fillCircle(12, 22, 2); g.fillCircle(44, 24, 2); // florecillas
            g.fillStyle(0xf6c945); g.fillCircle(30, 26, 2);
        });

        // Helecho
        make('fern', 46, 40, (g) => {
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
            g.fillStyle(0x2a6b34); g.fillRect(22, 14, 2, 26); // nervio
        });

        // Flor roja y flor amarilla
        const flower = (key, petal, center) => make(key, 16, 22, (g) => {
            g.fillStyle(0x3d9440); g.fillRect(7, 9, 2, 13);            // tallo
            g.fillStyle(0x4caf50); g.fillTriangle(9, 15, 15, 12, 9, 18); // hoja
            g.fillStyle(petal);
            g.fillCircle(8, 6, 3); g.fillCircle(4, 7, 2.6); g.fillCircle(12, 7, 2.6);
            g.fillCircle(6, 10, 2.6); g.fillCircle(10, 10, 2.6); g.fillCircle(8, 3, 2.6);
            g.fillStyle(center); g.fillCircle(8, 7, 2.2);
        });
        flower('flower_red', 0xe8556d, 0xffd93b);
        flower('flower_yellow', 0xf6c945, 0xe8822a);

        // Roca con musgo
        make('rock_moss', 50, 34, (g) => {
            g.fillStyle(0x8a8f98); g.fillEllipse(25, 22, 46, 26);
            g.fillStyle(0x6f747d); g.fillEllipse(25, 28, 46, 14);
            g.fillStyle(0xaab0b8); g.fillEllipse(17, 15, 20, 10);
            g.fillStyle(0x379149); g.fillEllipse(25, 11, 36, 10);      // musgo
            g.fillStyle(0x54bd5f); g.fillEllipse(18, 9, 10, 5);
        });

        // Tronco caído con musgo
        make('log_moss', 68, 30, (g) => {
            g.fillStyle(0x6b4a2a); g.fillRect(4, 10, 62, 18);
            g.fillStyle(0x54381f); g.fillRect(4, 22, 62, 6);
            g.fillStyle(0x8a5f38); g.fillEllipse(8, 19, 12, 18);       // anillo del extremo
            g.fillStyle(0x6b4a2a); g.fillEllipse(8, 19, 7, 11);
            g.fillStyle(0x4a3018); g.fillRect(24, 13, 1, 12); g.fillRect(40, 13, 1, 12); g.fillRect(54, 13, 1, 12);
            g.fillStyle(0x379149); g.fillRect(14, 8, 48, 5);           // musgo superior
            g.fillStyle(0x54bd5f); g.fillRect(20, 8, 6, 3); g.fillRect(42, 8, 8, 3);
        });

        // Raíces expuestas en el suelo
        make('roots', 56, 20, (g) => {
            g.fillStyle(0x6b4a2a);
            g.fillTriangle(28, 0, 4, 20, 16, 20);
            g.fillTriangle(28, 0, 40, 20, 52, 20);
            g.fillTriangle(28, 0, 24, 20, 32, 20);
            g.fillStyle(0x54381f);
            g.fillRect(9, 14, 3, 6); g.fillRect(27, 12, 3, 8); g.fillRect(45, 14, 3, 6);
        });

        // Mata de hierba (para bordes de plataforma)
        make('grass_tuft', 26, 15, (g) => {
            g.fillStyle(0x2f7d3f);
            g.fillTriangle(13, 15, 3, 1, 9, 15);
            g.fillTriangle(13, 15, 23, 2, 17, 15);
            g.fillStyle(0x46a555);
            g.fillTriangle(13, 15, 8, 0, 13, 15);
            g.fillTriangle(13, 15, 18, 1, 14, 15);
            g.fillStyle(0x54bd5f); g.fillRect(12, 1, 1, 13);
        });

        // Par de setas
        make('mushroom_pair', 24, 18, (g) => {
            g.fillStyle(0xf0e6d2); g.fillRect(5, 9, 3, 9); g.fillRect(15, 11, 3, 7);
            g.fillStyle(0xd23b3b); g.fillEllipse(6, 8, 13, 8);
            g.fillStyle(0xd23b3b); g.fillEllipse(16, 10, 11, 7);
            g.fillStyle(0xffffff); g.fillCircle(4, 7, 1.4); g.fillCircle(8, 8, 1.4); g.fillCircle(16, 9, 1.2);
        });

        // Helecho de PRIMER PLANO (grande, para enmarcar; se usa semitransp.)
        make('fg_fern', 128, 132, (g) => {
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
    }

    _buildCoin() {
        const scene = this.scene;
        if (scene.textures.exists('coin')) return;
        const g = scene.make.graphics({ add: false });
        g.fillStyle(0xf7c948); g.fillCircle(10, 10, 10);
        g.fillStyle(0xffd700); g.fillCircle(10, 8,  7);
        g.fillStyle(0xffec6e); g.fillCircle(7,  6,  3);
        g.fillStyle(0xb8860b); g.fillCircle(10, 10, 2);
        g.fillStyle(0xffffff, 0.4); g.fillEllipse(7, 7, 4, 3);
        g.generateTexture('coin', 20, 20);
        g.destroy();
    }

    _buildEnemy() {
        const scene = this.scene;
        if (scene.textures.exists('enemy_slime')) return;
        const g = scene.make.graphics({ add: false });
        // Cuerpo
        g.fillStyle(0xe84393); g.fillEllipse(16, 18, 32, 24);
        g.fillStyle(0xff66b2); g.fillEllipse(12, 14, 14, 10);
        // Ojos blancos
        g.fillStyle(0xffffff); g.fillCircle(9,  12, 4);
        g.fillStyle(0xffffff); g.fillCircle(23, 12, 4);
        // Pupilas
        g.fillStyle(0x1a1a2e); g.fillCircle(10, 12, 2);
        g.fillStyle(0x1a1a2e); g.fillCircle(24, 12, 2);
        // Brillo en ojos
        g.fillStyle(0xffffff); g.fillCircle(9,  10, 1);
        g.fillStyle(0xffffff); g.fillCircle(23, 10, 1);
        // Boca
        g.fillStyle(0x1a1a2e); g.fillRect(11, 19, 10, 2);
        g.generateTexture('enemy_slime', 32, 28);
        g.destroy();
    }

    _buildBat() {
        const scene = this.scene;
        if (scene.textures.exists('enemy_bat')) return;
        const g = scene.make.graphics({ add: false });

        // Alas (dibujadas primero para quedar detrás del cuerpo)
        g.fillStyle(0x5a00a0);
        g.fillTriangle(14, 9,  1, 1, 9, 14);   // ala izquierda
        g.fillTriangle(14, 9, 27, 1, 19, 14);  // ala derecha
        // Membrana de ala (más clara, semitransparente)
        g.fillStyle(0x8833dd);
        g.fillTriangle(14, 9,  2, 2, 9, 13);
        g.fillTriangle(14, 9, 26, 2, 19, 13);
        // Puntas de ala
        g.fillStyle(0x3a0070);
        g.fillCircle(2,  2, 3);
        g.fillCircle(26, 2, 3);

        // Cuerpo central
        g.fillStyle(0x4a0080); g.fillEllipse(14, 11, 14, 12);
        g.fillStyle(0x6a20a0); g.fillEllipse(12,  9,  6,  5); // brillo

        // Orejas
        g.fillStyle(0x5a00a0);
        g.fillTriangle(10, 5, 8,  0, 13, 6);
        g.fillTriangle(18, 5, 20, 0, 15, 6);

        // Ojos
        g.fillStyle(0xff2200); g.fillCircle(11, 11, 2);
        g.fillStyle(0xff2200); g.fillCircle(17, 11, 2);
        g.fillStyle(0xff9988); g.fillCircle(12, 10, 1);
        g.fillStyle(0xff9988); g.fillCircle(18, 10, 1);

        // Colmillos
        g.fillStyle(0xffffff);
        g.fillRect(12, 15, 2, 3);
        g.fillRect(15, 15, 2, 3);

        g.generateTexture('enemy_bat', 28, 18);
        g.destroy();
    }

    _buildPortal() {
        const scene = this.scene;
        if (scene.textures.exists('portal')) return;
        const g = scene.make.graphics({ add: false });
        // Relleno oscuro
        g.fillStyle(0x0a2a4a, 0.8); g.fillEllipse(20, 32, 36, 60);
        // Brillo interior
        g.fillStyle(0x39d0ff, 0.3); g.fillEllipse(20, 32, 20, 38);
        // Anillos de borde
        g.lineStyle(4, 0x39d0ff); g.strokeEllipse(20, 32, 40, 64);
        g.lineStyle(2, 0x7af5ff); g.strokeEllipse(20, 32, 28, 50);
        // Destello
        g.fillStyle(0xffffff, 0.6); g.fillEllipse(14, 20, 6, 10);
        g.generateTexture('portal', 40, 64);
        g.destroy();
    }

    _buildPowerStar() {
        const scene = this.scene;
        if (scene.textures.exists('powerstar')) return;
        const g = scene.make.graphics({ add: false });
        const cx = 14, cy = 14, r1 = 14, r2 = 6;
        const pts = [];
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const r     = i % 2 === 0 ? r1 : r2;
            pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
        }
        g.fillStyle(0xf7c948); g.fillPoints(pts, true);
        const pts2 = pts.map(p => ({ x: p.x * 0.7 + cx * 0.3, y: p.y * 0.7 + cy * 0.3 }));
        g.fillStyle(0xffd700); g.fillPoints(pts2, true);
        g.generateTexture('powerstar', 28, 28);
        g.destroy();
    }

    _buildDecorations() {
        const scene = this.scene;

        // Arbusto
        if (!scene.textures.exists('bush')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x2ab866); g.fillEllipse(20, 16, 40, 28);
            g.fillStyle(0x3ddc84); g.fillEllipse(20, 12, 32, 20);
            g.fillStyle(0x5af5a0, 0.5); g.fillEllipse(14, 10, 12, 8);
            g.generateTexture('bush', 40, 28);
            g.destroy();
        }

        // Totem
        if (!scene.textures.exists('totem')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x8b5e3c); g.fillRect(6, 0,  20, 48);
            g.fillStyle(0xe84393); g.fillRect(4, 0,  24, 14);
            g.fillStyle(0x1a1a2e); g.fillRect(9, 3,  6,  6);
            g.fillStyle(0x1a1a2e); g.fillRect(17, 3, 6,  6);
            g.fillStyle(0xf7c948); g.fillRect(2, 14, 28, 4);
            g.generateTexture('totem', 32, 48);
            g.destroy();
        }

        // Píxel de partícula para portal
        if (!scene.textures.exists('glow_px')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x39d0ff); g.fillCircle(3, 3, 3);
            g.generateTexture('glow_px', 6, 6);
            g.destroy();
        }
    }

    // ── Decoraciones de cueva (nivel 1-2) ────────────────────────
    _buildCaveDecorations() {
        const scene = this.scene;

        // Estalactita — cuelga del techo, punta hacia abajo (origin 0.5, 0)
        if (!scene.textures.exists('stalactite')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x3f3a55); g.fillTriangle(12, 64, 0,  0, 24, 0);
            g.fillStyle(0x565073); g.fillTriangle(12, 50, 4,  0, 13, 0);  // brillo izq.
            g.fillStyle(0x2c2840); g.fillTriangle(12, 64, 15, 0, 24, 0);  // sombra der.
            g.fillStyle(0x6a6488, 0.6); g.fillRect(8, 2, 3, 20);
            g.generateTexture('stalactite', 24, 64);
            g.destroy();
        }

        // Estalagmita — sube del suelo, punta hacia arriba (origin 0.5, 1)
        if (!scene.textures.exists('stalagmite')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x3f3a55); g.fillTriangle(12, 0, 0,  44, 24, 44);
            g.fillStyle(0x565073); g.fillTriangle(12, 6, 3,  44, 11, 44);
            g.fillStyle(0x2c2840); g.fillTriangle(12, 8, 16, 44, 24, 44);
            g.generateTexture('stalagmite', 24, 44);
            g.destroy();
        }

        // Cristal — gema brillante para adornar el suelo (origin 0.5, 1)
        if (!scene.textures.exists('cave_crystal')) {
            const g = scene.make.graphics({ add: false });
            // Cristal grande central
            g.fillStyle(0x39d0ff);
            g.fillTriangle(11, 0,  4, 15, 18, 15);
            g.fillTriangle(4, 15, 18, 15, 11, 30);
            g.fillStyle(0x7af5ff, 0.7); g.fillTriangle(11, 3, 6, 14, 11, 14); // brillo
            // Cristal lateral pequeño
            g.fillStyle(0x2ab0e0);
            g.fillTriangle(19, 12, 15, 21, 23, 21);
            g.fillTriangle(15, 21, 23, 21, 19, 30);
            g.generateTexture('cave_crystal', 24, 30);
            g.destroy();
        }
    }

    // ── Piezas para puentes rotos (nivel 1-3) ────────────────────
    _buildBridgeParts() {
        const scene = this.scene;

        // Tablón de madera del puente (24×12)
        if (!scene.textures.exists('bridge_plank')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x6b4a2a); g.fillRect(0, 1, 24, 10);   // cuerpo
            g.fillStyle(0x8a643c); g.fillRect(0, 1, 24, 2);    // brillo superior
            g.fillStyle(0x452c15); g.fillRect(0, 9, 24, 2);    // sombra inferior
            g.fillStyle(0x5a3d22); g.fillRect(11, 1, 2, 10);   // junta central
            g.fillStyle(0x3a2614); g.fillRect(3, 4, 1, 4); g.fillRect(20, 4, 1, 4); // clavos
            g.generateTexture('bridge_plank', 24, 12);
            g.destroy();
        }

        // Pilar de piedra roto (28×80, origin 0.5,1)
        if (!scene.textures.exists('broken_pillar')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x6a6478); g.fillRect(4, 18, 20, 62);        // fuste
            g.fillStyle(0x847e96); g.fillRect(4, 18, 4, 62);         // brillo izq.
            g.fillStyle(0x484356); g.fillRect(20, 18, 4, 62);        // sombra der.
            // Cima rota (irregular)
            g.fillStyle(0x6a6478);
            g.fillTriangle(4, 20, 10, 6, 15, 20);
            g.fillTriangle(14, 20, 20, 11, 24, 20);
            // Grietas
            g.fillStyle(0x373345); g.fillRect(12, 30, 1, 22); g.fillRect(9, 52, 1, 16);
            // Base ancha
            g.fillStyle(0x565266); g.fillRect(1, 74, 26, 6);
            g.generateTexture('broken_pillar', 28, 80);
            g.destroy();
        }
    }

    // ── Decoraciones nevadas (nivel 1-4) ─────────────────────────
    _buildSnowDecorations() {
        const scene = this.scene;

        // Pino nevado (36×60, origin 0.5,1)
        if (!scene.textures.exists('snow_pine')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x6b4a2a); g.fillRect(15, 50, 6, 10);        // tronco
            g.fillStyle(0x2f6b45);                                   // follaje
            g.fillTriangle(18, 4,  4, 26, 32, 26);
            g.fillTriangle(18, 18, 1, 42, 35, 42);
            g.fillTriangle(18, 32, 3, 54, 33, 54);
            g.fillStyle(0xffffff);                                   // nieve
            g.fillTriangle(18, 4,  10, 16, 26, 16);
            g.fillTriangle(18, 18, 8,  31, 28, 31);
            g.fillTriangle(18, 32, 9,  45, 27, 45);
            g.generateTexture('snow_pine', 36, 60);
            g.destroy();
        }

        // Muñeco de nieve (26×34, origin 0.5,1)
        if (!scene.textures.exists('snowman')) {
            const g = scene.make.graphics({ add: false });
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
            g.generateTexture('snowman', 26, 34);
            g.destroy();
        }
    }
}