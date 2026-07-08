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
}