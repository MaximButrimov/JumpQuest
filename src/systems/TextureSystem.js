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
}