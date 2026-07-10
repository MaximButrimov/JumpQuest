/**
 * ============================================================
 *  JumpQuest – BackgroundSystem.js
 *  Fondo parallax multicapa, seleccionable por TEMA.
 *
 *  build(theme) elige el aspecto del nivel. Cada tema genera
 *  sus propias texturas (con claves únicas) para que un nivel
 *  NO herede el fondo de otro a través de la caché de Phaser.
 *
 *  Temas disponibles:
 *    · 'forest' → bosque diurno: cielo azul, sol, colinas, nubes,
 *                 hojas cayendo.
 *    · 'cave'   → cueva subterránea: oscuridad, muro rocoso,
 *                 cristales luminiscentes, motas de polvo flotante.
 *
 *  Para añadir un tema nuevo: crea un _buildX() y regístralo en
 *  el switch de build(). Usa claves de textura con sufijo propio.
 * ============================================================
 */

export default class BackgroundSystem {
    constructor(scene) {
        this.scene = scene;
    }

    build(theme = 'forest') {
        this.theme = theme;
        const scene = this.scene;
        const W  = scene.physics.world.bounds.width;
        const H  = scene.physics.world.bounds.height;
        const VW = scene.scale.width;
        const VH = scene.scale.height;

        if (theme === 'cave') {
            this._buildCave(W, H, VW, VH);
        } else if (theme === 'ruins') {
            this._buildRuins(W, H, VW, VH);
        } else if (theme === 'snow') {
            this._buildSnow(W, H, VW, VH);
        } else {
            this._buildForest(W, H, VW, VH);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  UTILIDADES
    // ══════════════════════════════════════════════════════════

    /** Cielo de degradado vertical por franjas (fijo en pantalla). */
    _gradientSky(key, VW, VH, stops) {
        const scene = this.scene;
        if (!scene.textures.exists(key)) {
            const g = scene.make.graphics({ add: false });
            for (let i = 0; i < stops.length - 1; i++) {
                const [t0, c0] = stops[i];
                const [t1]     = stops[i + 1];
                g.fillStyle(c0);
                g.fillRect(0, Math.floor(t0 * VH), VW, Math.ceil((t1 - t0) * VH) + 1);
            }
            g.generateTexture(key, VW, VH);
            g.destroy();
        }
        scene.add.image(VW / 2, VH / 2, key).setScrollFactor(0).setDepth(0);
    }

    _pixel(key, color, size = 2) {
        const scene = this.scene;
        if (!scene.textures.exists(key)) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(color);
            g.fillCircle(size / 2, size / 2, size / 2);
            g.generateTexture(key, size, size);
            g.destroy();
        }
    }

    // ══════════════════════════════════════════════════════════
    //  TEMA: BOSQUE (diurno)
    // ══════════════════════════════════════════════════════════

    _buildForest(W, H, VW, VH) {
        const scene = this.scene;

        // ── Cielo diurno ──────────────────────────────────────
        this._gradientSky('bg_sky_forest', VW, VH, [
            [0,    0x2f6fb0],
            [0.30, 0x4f9fd8],
            [0.55, 0x8fc9ec],
            [0.78, 0xc9e9f2],
            [1.0,  0xe8f4d8],
        ]);

        // ── Sol con halo (fijo en pantalla) ───────────────────
        if (!scene.textures.exists('sun_forest')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 60; r > 0; r -= 4) {
                const a = 0.06 + 0.10 * (1 - r / 60);
                g.fillStyle(0xfff3b0, a);
                g.fillCircle(60, 60, r);
            }
            g.fillStyle(0xfff8d0, 1); g.fillCircle(60, 60, 20);
            g.fillStyle(0xffffff, 0.9); g.fillCircle(54, 54, 8);
            g.generateTexture('sun_forest', 120, 120);
            g.destroy();
        }
        const sun = scene.add.image(VW - 130, 100, 'sun_forest')
            .setScrollFactor(0).setDepth(1);
        scene.tweens.add({
            targets: sun, scale: 1.06, alpha: 0.92,
            duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // ── Rayos de luz (god rays) desde el sol ──────────────
        if (!scene.textures.exists('sun_rays')) {
            const g = scene.make.graphics({ add: false });
            const ox = VW - 130, oy = 100;
            g.fillStyle(0xfff3c0, 0.10);
            for (let a = 20; a <= 150; a += 16) {
                const r = Phaser.Math.DegToRad(a);
                const w = 26;
                g.fillTriangle(
                    ox, oy,
                    ox - Math.cos(r) * 900 - w, oy + Math.sin(r) * 900,
                    ox - Math.cos(r) * 900 + w, oy + Math.sin(r) * 900
                );
            }
            g.generateTexture('sun_rays', VW, VH);
            g.destroy();
        }
        const rays = scene.add.image(VW / 2, VH / 2, 'sun_rays')
            .setScrollFactor(0).setDepth(1).setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({ targets: rays, alpha: 0.55, duration: 4200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Línea de árboles muy lejana (bruma) ───────────────
        if (!scene.textures.exists('forest_farline')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x86bd94, 1);
            for (let x = -20; x < 820; x += 34) {
                g.fillCircle(x, 66, Phaser.Math.Between(22, 34));
            }
            g.fillRect(0, 64, 800, 110);
            g.generateTexture('forest_farline', 800, 176);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'forest_farline')
                .setOrigin(0, 1).setScrollFactor(0.12).setDepth(1).setAlpha(0.6);
        }

        // ── Colinas lejanas ───────────────────────────────────
        if (!scene.textures.exists('hills_far')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x6fb37a, 1);
            g.fillEllipse(120, 220, 340, 200);
            g.fillEllipse(420, 220, 400, 230);
            g.fillEllipse(720, 220, 360, 190);
            g.fillStyle(0x82c48c, 0.5);
            g.fillEllipse(120, 210, 200, 120);
            g.fillEllipse(420, 205, 240, 140);
            g.generateTexture('hills_far', 800, 240);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'hills_far')
                .setOrigin(0, 1).setScrollFactor(0.2).setDepth(1).setAlpha(0.85);
        }

        // ── Bosque intermedio (siluetas de árboles) ───────────
        if (!scene.textures.exists('forest_mid')) {
            const g = scene.make.graphics({ add: false });
            const trees = [70, 190, 330, 470, 610, 740];
            for (const tx of trees) {
                g.fillStyle(0x2f6b3e, 1);
                g.fillRect(tx - 5, 120, 10, 70);                  // tronco
                g.fillCircle(tx, 110, 40);                         // copa
                g.fillCircle(tx - 28, 128, 26);
                g.fillCircle(tx + 28, 128, 26);
                g.fillStyle(0x387a48, 0.7);
                g.fillCircle(tx - 8, 100, 20);
            }
            g.generateTexture('forest_mid', 800, 190);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'forest_mid')
                .setOrigin(0, 1).setScrollFactor(0.32).setDepth(2).setAlpha(0.92);
        }

        // ── Colinas cercanas + árboles ────────────────────────
        if (!scene.textures.exists('hills_near')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x3f8a4f, 1);
            g.fillEllipse(160, 200, 420, 220);
            g.fillEllipse(560, 200, 460, 240);
            // Árboles silueta
            g.fillStyle(0x2e6b3c, 1);
            const treeXs = [90, 250, 400, 560, 700];
            for (const tx of treeXs) {
                g.fillRect(tx - 4, 150, 8, 40);              // tronco
                g.fillCircle(tx, 140, 26);                    // copa
                g.fillCircle(tx - 18, 152, 18);
                g.fillCircle(tx + 18, 152, 18);
            }
            g.generateTexture('hills_near', 800, 210);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'hills_near')
                .setOrigin(0, 1).setScrollFactor(0.45).setDepth(2).setAlpha(0.95);
        }

        // ── Nubes blancas ─────────────────────────────────────
        if (!scene.textures.exists('cloud_forest')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0xffffff, 0.85);
            g.fillEllipse(40, 34, 84, 40);
            g.fillEllipse(70, 24, 64, 36);
            g.fillEllipse(98, 32, 74, 40);
            g.fillStyle(0xdfeefc, 0.9);
            g.fillEllipse(60, 40, 120, 20);
            g.generateTexture('cloud_forest', 150, 60);
            g.destroy();
        }
        for (let i = 0; i < 10; i++) {
            const cloud = scene.add.image(
                Phaser.Math.Between(0, W),
                Phaser.Math.Between(40, H * 0.32),
                'cloud_forest'
            )
                .setScrollFactor(Phaser.Math.FloatBetween(0.25, 0.45))
                .setDepth(2)
                .setAlpha(Phaser.Math.FloatBetween(0.5, 0.9))
                .setScale(Phaser.Math.FloatBetween(0.7, 1.4));
            scene.tweens.add({
                targets: cloud, x: cloud.x + Phaser.Math.Between(40, 90),
                duration: Phaser.Math.Between(8000, 16000),
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }

        // ── Hojas cayendo (ambiente, fijo a la cámara) ────────
        this._pixel('leaf_px', 0xffffff, 5);
        const leaves = scene.add.particles(0, -10, 'leaf_px', {
            x: { min: 0, max: VW },
            speedY: { min: 15, max: 45 },
            speedX: { min: -30, max: 10 },
            scale:  { min: 0.5, max: 1.1 },
            rotate: { min: 0, max: 360 },
            lifespan: 9000,
            frequency: 600,
            alpha: { min: 0.5, max: 0.9 },
            tint: [0x8fd46a, 0xf7c948, 0xe88b3a, 0x6fb37a],
        });
        leaves.setScrollFactor(0).setDepth(3);

        // ── Polen / motas de luz flotando (ambiente cálido) ───
        this._pixel('pollen_px', 0xfff3c0, 4);
        const pollen = scene.add.particles(0, 0, 'pollen_px', {
            x: { min: 0, max: VW },
            y: { min: 0, max: VH },
            speedY: { min: -8, max: 6 },
            speedX: { min: -10, max: 10 },
            scale:  { min: 0.4, max: 1.0 },
            lifespan: 6000,
            frequency: 320,
            alpha: { min: 0.1, max: 0.4 },
            tint: [0xfff3c0, 0xffffff, 0xd8f0b0],
            blendMode: 'ADD',
        });
        pollen.setScrollFactor(0).setDepth(8);
    }

    // ══════════════════════════════════════════════════════════
    //  TEMA: NIEVE (escenario nevado / hielo)
    // ══════════════════════════════════════════════════════════

    _buildSnow(W, H, VW, VH) {
        const scene = this.scene;

        // ── Cielo invernal frío ───────────────────────────────
        this._gradientSky('bg_sky_snow', VW, VH, [
            [0,    0x5a7ba8],
            [0.4,  0x8fb0d4],
            [0.72, 0xc4d8ea],
            [1.0,  0xe9f1f9],
        ]);

        // ── Sol pálido con halo (fijo en pantalla) ────────────
        if (!scene.textures.exists('sun_snow')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 56; r > 0; r -= 4) {
                g.fillStyle(0xffffff, 0.05 + 0.07 * (1 - r / 56));
                g.fillCircle(56, 56, r);
            }
            g.fillStyle(0xf4faff, 1); g.fillCircle(56, 56, 24);
            g.generateTexture('sun_snow', 112, 112);
            g.destroy();
        }
        scene.add.image(VW - 120, 96, 'sun_snow').setScrollFactor(0).setDepth(1).setAlpha(0.9);

        // ── Montañas nevadas lejanas ──────────────────────────
        if (!scene.textures.exists('snow_mtn_far')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x9fb6cf, 1);
            g.fillTriangle(0, 220, 180, 60, 360, 220);
            g.fillTriangle(220, 220, 420, 40, 620, 220);
            g.fillTriangle(500, 220, 680, 80, 800, 220);
            // Cimas nevadas
            g.fillStyle(0xffffff, 1);
            g.fillTriangle(180, 60, 210, 104, 150, 104);
            g.fillTriangle(420, 40, 456, 92, 384, 92);
            g.fillTriangle(680, 80, 706, 116, 654, 116);
            g.generateTexture('snow_mtn_far', 800, 220);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'snow_mtn_far')
                .setOrigin(0, 1).setScrollFactor(0.2).setDepth(1).setAlpha(0.8);
        }

        // ── Colinas nevadas cercanas ──────────────────────────
        if (!scene.textures.exists('snow_hills')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0xeaf3fb, 1);
            g.fillEllipse(180, 210, 460, 220);
            g.fillEllipse(560, 210, 500, 240);
            g.fillStyle(0xcfe0f0, 0.6);
            g.fillEllipse(180, 230, 300, 140);
            g.generateTexture('snow_hills', 800, 210);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'snow_hills')
                .setOrigin(0, 1).setScrollFactor(0.42).setDepth(2).setAlpha(0.95);
        }

        // ── Copos de nieve cayendo (ambiente) ─────────────────
        this._pixel('snow_px', 0xffffff, 5);
        const snow = scene.add.particles(0, -10, 'snow_px', {
            x: { min: 0, max: VW },
            speedY: { min: 25, max: 60 },
            speedX: { min: -20, max: 20 },
            scale:  { min: 0.4, max: 1.1 },
            lifespan: 8000,
            frequency: 180,
            alpha: { min: 0.5, max: 0.95 },
            tint: [0xffffff, 0xeaf4ff],
        });
        snow.setScrollFactor(0).setDepth(3);
    }

    // ══════════════════════════════════════════════════════════
    //  TEMA: RUINAS (puentes rotos, atardecer)
    // ══════════════════════════════════════════════════════════

    _buildRuins(W, H, VW, VH) {
        const scene = this.scene;

        // ── Cielo de atardecer ────────────────────────────────
        this._gradientSky('bg_sky_ruins', VW, VH, [
            [0,    0x241a3a],
            [0.35, 0x503057],
            [0.6,  0x9a4a52],
            [0.82, 0xd07a4a],
            [1.0,  0xecab5e],
        ]);

        // ── Sol bajo en el horizonte (fijo en pantalla) ───────
        if (!scene.textures.exists('sun_ruins')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 70; r > 0; r -= 4) {
                g.fillStyle(0xffd07a, 0.05 + 0.09 * (1 - r / 70));
                g.fillCircle(70, 70, r);
            }
            g.fillStyle(0xffe4a0, 1); g.fillCircle(70, 70, 34);
            g.generateTexture('sun_ruins', 140, 140);
            g.destroy();
        }
        const sun = scene.add.image(VW * 0.28, VH * 0.72, 'sun_ruins')
            .setScrollFactor(0).setDepth(1);
        scene.tweens.add({ targets: sun, scale: 1.05, alpha: 0.9, duration: 4000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Siluetas lejanas: torres y puentes rotos ──────────
        if (!scene.textures.exists('ruins_far')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x3a2440, 1);
            // Torres desmoronadas de distintas alturas
            const towers = [[40, 120], [110, 80], [230, 150], [300, 100], [470, 135], [560, 90], [700, 160]];
            for (const [tx, th] of towers) {
                g.fillRect(tx, 220 - th, 40, th);
                // cima rota (dientes)
                for (let k = 0; k < 4; k++) if (k % 2 === 0) g.fillRect(tx + k * 10, 220 - th - 8, 10, 8);
            }
            // Arcos de puente roto entre torres
            g.lineStyle(6, 0x3a2440, 1);
            g.beginPath(); g.arc(175, 130, 55, Math.PI, 0, false); g.strokePath();
            g.beginPath(); g.arc(520, 150, 60, Math.PI, 0, false); g.strokePath();
            g.generateTexture('ruins_far', 760, 230);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 760) + 1; i++) {
            scene.add.image(i * 760, H, 'ruins_far')
                .setOrigin(0, 1).setScrollFactor(0.25).setDepth(1).setAlpha(0.55);
        }

        // ── Siluetas cercanas más oscuras ─────────────────────
        if (!scene.textures.exists('ruins_near')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x1f1329, 1);
            const towers = [[60, 180], [180, 130], [360, 200], [520, 150], [660, 190]];
            for (const [tx, th] of towers) {
                g.fillRect(tx, 210 - th, 54, th);
                for (let k = 0; k < 5; k++) if (k % 2 === 0) g.fillRect(tx + k * 11, 210 - th - 9, 11, 9);
            }
            g.generateTexture('ruins_near', 760, 210);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 760) + 1; i++) {
            scene.add.image(i * 760, H, 'ruins_near')
                .setOrigin(0, 1).setScrollFactor(0.45).setDepth(2).setAlpha(0.85);
        }

        // ── Neblina / polvo a la deriva (ambiente) ────────────
        this._pixel('mist_px', 0xffffff, 6);
        const mist = scene.add.particles(0, 0, 'mist_px', {
            x: { min: 0, max: VW },
            y: { min: VH * 0.4, max: VH },
            speedX: { min: 4, max: 18 },
            speedY: { min: -4, max: 4 },
            scale:  { min: 1, max: 3 },
            lifespan: 9000,
            frequency: 500,
            alpha: { min: 0.04, max: 0.14 },
            tint: [0xd8b0a0, 0xc0a0c0, 0xffffff],
        });
        mist.setScrollFactor(0).setDepth(3);
    }

    // ══════════════════════════════════════════════════════════
    //  TEMA: CUEVA (subterráneo)
    // ══════════════════════════════════════════════════════════

    _buildCave(W, H, VW, VH) {
        const scene = this.scene;

        // ── Oscuridad de fondo ────────────────────────────────
        this._gradientSky('bg_sky_cave', VW, VH, [
            [0,    0x05030c],
            [0.4,  0x0d0820],
            [0.7,  0x140a26],
            [1.0,  0x1c1030],
        ]);

        // ── Muro rocoso tileado (parallax leve) ───────────────
        if (!scene.textures.exists('cave_wall')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x160f28); g.fillRect(0, 0, 128, 128);
            // Bloques de roca con relieve (RNG local para no reseedear el global)
            const rnd = new Phaser.Math.RandomDataGenerator(['cave']);
            for (let by = 0; by < 128; by += 32) {
                for (let bx = 0; bx < 128; bx += 32) {
                    const off = (by / 32) % 2 === 0 ? 0 : 16;
                    const x = (bx + off) % 128;
                    const shade = rnd.pick([0x1d1436, 0x231843, 0x120c22]);
                    g.fillStyle(shade); g.fillRect(x + 1, by + 1, 30, 30);
                    g.fillStyle(0x2c1e52, 0.6); g.fillRect(x + 1, by + 1, 30, 2);
                    g.fillStyle(0x0c081a, 0.7); g.fillRect(x + 1, by + 29, 30, 2);
                }
            }
            g.generateTexture('cave_wall', 128, 128);
            g.destroy();
        }
        for (let cy = 0; cy < H; cy += 128) {
            for (let cx = 0; cx < W; cx += 128) {
                scene.add.image(cx, cy, 'cave_wall')
                    .setOrigin(0, 0).setScrollFactor(0.35).setDepth(0).setAlpha(0.9);
            }
        }

        // ── Cristales luminiscentes de fondo ──────────────────
        if (!scene.textures.exists('bg_crystal')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 22; r > 0; r -= 3) {
                g.fillStyle(0x39d0ff, 0.05 + 0.06 * (1 - r / 22));
                g.fillCircle(22, 26, r);
            }
            g.fillStyle(0x5ae0ff, 0.9);
            g.fillTriangle(22, 4, 14, 30, 30, 30);
            g.fillStyle(0xbff4ff, 0.8);
            g.fillTriangle(22, 10, 18, 30, 24, 30);
            g.generateTexture('bg_crystal', 44, 52);
            g.destroy();
        }
        for (let i = 0; i < 14; i++) {
            const cr = scene.add.image(
                Phaser.Math.Between(60, W - 60),
                Phaser.Math.Between(H * 0.15, H * 0.85),
                'bg_crystal'
            )
                .setScrollFactor(Phaser.Math.FloatBetween(0.3, 0.55))
                .setDepth(1)
                .setBlendMode(Phaser.BlendModes.ADD)
                .setScale(Phaser.Math.FloatBetween(0.6, 1.5))
                .setTint(Phaser.Math.RND.pick([0x39d0ff, 0xa060ff, 0x50f5c0]));
            scene.tweens.add({
                targets: cr, alpha: 0.35,
                duration: Phaser.Math.Between(1400, 3200),
                yoyo: true, repeat: -1,
                delay: Phaser.Math.Between(0, 2000), ease: 'Sine.easeInOut'
            });
        }

        // ── Motas de polvo flotante (ambiente) ────────────────
        this._pixel('mote_px', 0xffffff, 4);
        const motes = scene.add.particles(0, VH + 10, 'mote_px', {
            x: { min: 0, max: VW },
            speedY: { min: -18, max: -6 },
            speedX: { min: -8, max: 8 },
            scale:  { min: 0.4, max: 1.0 },
            lifespan: 11000,
            frequency: 450,
            alpha: { min: 0.15, max: 0.5 },
            tint: [0x7ad0ff, 0xa060ff, 0xffffff],
            blendMode: 'ADD',
        });
        motes.setScrollFactor(0).setDepth(3);

        // ── Viñeta oscura en los bordes (profundidad de cueva) ─
        // Textura MULTIPLY: centro claro (sin cambio), bordes oscuros.
        if (!scene.textures.exists('cave_vignette')) {
            const g = scene.make.graphics({ add: false });
            const maxR = Math.hypot(VW / 2, VH / 2);
            g.fillStyle(0x000000, 1); g.fillRect(0, 0, VW, VH); // esquinas negras
            for (let r = maxR; r > 0; r -= 6) {
                const t    = r / maxR;                 // 1 borde → 0 centro
                const gray = Math.round(255 - 150 * t); // borde ~105, centro 255
                const c    = (gray << 16) | (gray << 8) | gray;
                g.fillStyle(c, 1);
                g.fillCircle(VW / 2, VH / 2, r);
            }
            g.generateTexture('cave_vignette', VW, VH);
            g.destroy();
        }
        scene.add.image(VW / 2, VH / 2, 'cave_vignette')
            .setScrollFactor(0).setDepth(4).setBlendMode(Phaser.BlendModes.MULTIPLY);
    }
}
