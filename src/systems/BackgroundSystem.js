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
 *    · 'cave'   → cueva subterránea: oscuridad, muro rocoso orgánico,
 *                 cristales luminiscentes, motas de polvo flotante.
 *    · 'ruins'  → ciudad desértica postapocalíptica: cielo polvoriento,
 *                 skyline de rascacielos rotos, dunas, arena arrastrada.
 *    · 'snow'   → escenario nevado: cielo frío, montañas, nevada.
 *    · 'volcano'→ volcán activo: cielo de lava, volcanes en erupción,
 *                 ríos de lava en los pozos, ceniza, brasas y humo.
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
        } else if (theme === 'volcano') {
            this._buildVolcano(W, H, VW, VH);
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

        // ── Cielo de gran altitud (azul frío arriba → blanco helado) ─
        this._gradientSky('bg_sky_snow', VW, VH, [
            [0,    0x3f6790],
            [0.35, 0x6b93bd],
            [0.68, 0xa8c8e2],
            [1.0,  0xe4eef7],
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

        // ── Cordillera LEJANA de picos nevados (calima) — scroll 0.12 ─
        if (!scene.textures.exists('snow_range_far')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['snow-range-far']);
            const peaks = [];
            let x = -20;
            while (x < 820) { const pw = rnd.between(90, 170), ph = rnd.between(120, 220); peaks.push([x, pw, ph]); x += pw * 0.7; }
            g.fillStyle(0x9fb6cf, 1);
            for (const [px, pw, ph] of peaks) g.fillTriangle(px, 240, px + pw, 240, px + pw / 2, 240 - ph);
            g.fillStyle(0xffffff, 1);   // cimas nevadas
            for (const [px, pw, ph] of peaks) {
                const ax = px + pw / 2, ay = 240 - ph;
                g.fillTriangle(ax, ay, ax - pw * 0.16, ay + ph * 0.22, ax + pw * 0.16, ay + ph * 0.22);
            }
            g.generateTexture('snow_range_far', 800, 240);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'snow_range_far')
                .setOrigin(0, 1).setScrollFactor(0.12).setDepth(1).setAlpha(0.75);
        }

        // ── Glaciar/picos MEDIOS con grietas (crevasses) — scroll 0.26 ─
        if (!scene.textures.exists('snow_glacier_mid')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['snow-glacier']);
            const peaks = [];
            let x = -20;
            while (x < 820) { const pw = rnd.between(130, 220), ph = rnd.between(160, 280); peaks.push([x, pw, ph]); x += pw * 0.62; }
            g.fillStyle(0x7f9bbd, 1);
            for (const [px, pw, ph] of peaks) g.fillTriangle(px, 290, px + pw, 290, px + pw / 2, 290 - ph);
            g.fillStyle(0xeaf3fb, 1);   // mantos de nieve amplios
            for (const [px, pw, ph] of peaks) {
                const ax = px + pw / 2, ay = 290 - ph;
                g.fillTriangle(ax, ay, ax - pw * 0.24, ay + ph * 0.3, ax + pw * 0.24, ay + ph * 0.3);
            }
            g.fillStyle(0x5f7ea6, 0.55);   // grietas / sombras azul hielo
            for (const [px, pw, ph] of peaks) {
                const ax = px + pw / 2;
                g.fillRect(ax + rnd.between(-8, 4), 290 - ph + ph * 0.32, 2, ph * 0.42);
                g.fillRect(ax + rnd.between(4, 14), 290 - ph + ph * 0.45, 2, ph * 0.34);
            }
            g.generateTexture('snow_glacier_mid', 800, 290);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'snow_glacier_mid')
                .setOrigin(0, 1).setScrollFactor(0.26).setDepth(1).setAlpha(0.9);
        }

        // ── Colinas de nieve cercanas — scroll 0.45 ───────────
        if (!scene.textures.exists('snow_hills_near')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0xeaf3fb, 1);
            g.fillEllipse(180, 210, 460, 220); g.fillEllipse(560, 210, 500, 240);
            g.fillStyle(0xffffff, 0.9);   // crestas iluminadas
            g.fillEllipse(150, 200, 260, 120); g.fillEllipse(540, 198, 300, 140);
            g.fillStyle(0xcfe0f0, 0.55);  // sombras frías
            g.fillEllipse(320, 232, 260, 130);
            g.generateTexture('snow_hills_near', 800, 210);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'snow_hills_near')
                .setOrigin(0, 1).setScrollFactor(0.45).setDepth(2).setAlpha(0.95);
        }

        // ── Niebla helada baja (ambiente, a la deriva) ────────
        this._pixel('frost_fog_px', 0xffffff, 8);
        const fog = scene.add.particles(0, 0, 'frost_fog_px', {
            x: { min: 0, max: VW },
            y: { min: VH * 0.55, max: VH },
            speedX: { min: 8, max: 24 },
            scale:  { min: 3, max: 7 },
            lifespan: 8000,
            frequency: 480,
            alpha: { min: 0.04, max: 0.12 },
            tint: [0xdfeefc, 0xffffff, 0xc8dcf0],
        });
        fog.setScrollFactor(0).setDepth(2);

        // ── Copos de nieve cayendo (ambiente suave) ───────────
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

        // ── Ventisca: nieve arrastrada por el viento (rachas rápidas) ─
        this._pixel('blizzard_px', 0xffffff, 3);
        const blizzard = scene.add.particles(-10, 0, 'blizzard_px', {
            x: { min: -10, max: VW * 0.3 },
            y: { min: 0, max: VH },
            speedX: { min: 180, max: 330 },   // viento fuerte hacia la derecha
            speedY: { min: 20, max: 70 },
            scale:  { min: 0.4, max: 1.0 },
            lifespan: 2600,
            frequency: 55,
            alpha: { min: 0.2, max: 0.6 },
            tint: [0xffffff, 0xeaf4ff],
        });
        blizzard.setScrollFactor(0).setDepth(3);
    }

    // ══════════════════════════════════════════════════════════
    //  TEMA: RUINAS (puentes rotos, atardecer)
    // ══════════════════════════════════════════════════════════

    _buildRuins(W, H, VW, VH) {
        const scene = this.scene;

        // ── Cielo árido y polvoriento (tormenta de polvo lejana) ─
        this._gradientSky('bg_sky_ruins', VW, VH, [
            [0,    0x4e4636],   // cenit: polvo oscuro
            [0.38, 0x8a7a58],   // calima media
            [0.66, 0xb89a6e],   // horizonte polvoriento
            [0.85, 0xd0b585],
            [1.0,  0xc2a877],
        ]);

        // ── Sol pálido velado por el polvo (fijo en pantalla) ──
        if (!scene.textures.exists('sun_ruins_dust')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 78; r > 0; r -= 4) {
                g.fillStyle(0xe8cf9a, 0.04 + 0.06 * (1 - r / 78));
                g.fillCircle(78, 78, r);
            }
            g.fillStyle(0xf0dcae, 0.85); g.fillCircle(78, 78, 34);   // disco tenue
            g.generateTexture('sun_ruins_dust', 156, 156);
            g.destroy();
        }
        const sun = scene.add.image(VW * 0.7, VH * 0.28, 'sun_ruins_dust')
            .setScrollFactor(0).setDepth(1).setAlpha(0.85);
        scene.tweens.add({ targets: sun, alpha: 0.7, duration: 5000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Skyline LEJANO: rascacielos rotos (perspectiva de calima) ─
        if (!scene.textures.exists('ruins_city_far')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['ruins-far']);
            g.fillStyle(0x8f8068, 1);
            let x = 0;
            while (x < 800) {
                const bw = rnd.between(30, 70), bh = rnd.between(60, 200);
                g.fillRect(x, 220 - bh, bw, bh);
                // antenas / cimas rotas
                for (let k = 0; k < 3; k++) if (rnd.frac() < 0.5) g.fillRect(x + k * (bw / 3), 220 - bh - rnd.between(3, 12), 3, rnd.between(3, 12));
                x += bw + rnd.between(2, 12);
            }
            g.generateTexture('ruins_city_far', 800, 220);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'ruins_city_far')
                .setOrigin(0, 1).setScrollFactor(0.16).setDepth(1).setAlpha(0.55);
        }

        // ── Skyline MEDIO: edificios derruidos + puente colapsado ─
        if (!scene.textures.exists('ruins_city_mid')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['ruins-mid']);
            // Edificios
            let x = 0;
            while (x < 540) {
                const bw = rnd.between(44, 88), bh = rnd.between(80, 230);
                g.fillStyle(0x6b5f4a); g.fillRect(x, 260 - bh, bw, bh);
                for (let k = 0; k < 3; k++) if (rnd.frac() < 0.5) g.fillRect(x + k * (bw / 3), 260 - bh - rnd.between(4, 14), bw / 3 - 2, rnd.between(4, 14));
                g.fillStyle(0x554b3a);                                 // ventanas
                for (let wy = 260 - bh + 12; wy < 252; wy += 20) for (let wx = x + 6; wx < x + bw - 8; wx += 14) if (rnd.frac() < 0.7) g.fillRect(wx, wy, 7, 9);
                x += bw + rnd.between(10, 34);
            }
            // Puente colapsado (dos pilonas + tablero roto que cuelga)
            g.fillStyle(0x6b5f4a);
            g.fillRect(560, 118, 12, 142); g.fillRect(700, 118, 12, 142); // pilonas
            g.fillRect(560, 150, 62, 8);  g.fillRect(650, 150, 62, 8);    // tramos
            g.fillTriangle(622, 150, 650, 150, 636, 214);                 // tramo central caído
            g.fillRect(566, 120, 1, 30); g.fillRect(706, 120, 1, 30);     // cables rotos
            g.generateTexture('ruins_city_mid', 800, 260);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'ruins_city_mid')
                .setOrigin(0, 1).setScrollFactor(0.32).setDepth(1).setAlpha(0.82);
        }

        // ── Dunas / campo de escombros cercano ────────────────
        if (!scene.textures.exists('ruins_dunes')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['ruins-dunes']);
            g.fillStyle(0xb89a6a, 1);
            g.fillEllipse(120, 130, 360, 130); g.fillEllipse(430, 130, 460, 150); g.fillEllipse(720, 130, 380, 120);
            g.fillStyle(0xccb082, 0.7);                                // crestas iluminadas
            g.fillEllipse(120, 118, 240, 70); g.fillEllipse(430, 116, 300, 84);
            g.fillStyle(0x6b5f4a, 0.8);                                // escombro lejano disperso
            for (let i = 0; i < 10; i++) g.fillRect(rnd.between(20, 780), rnd.between(96, 116), rnd.between(4, 12), rnd.between(4, 9));
            g.generateTexture('ruins_dunes', 800, 130);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'ruins_dunes')
                .setOrigin(0, 1).setScrollFactor(0.5).setDepth(2).setAlpha(0.95);
        }

        // ── Polvo / arena arrastrada por el viento (ambiente) ──
        this._pixel('sand_px', 0xffffff, 4);
        const sand = scene.add.particles(0, 0, 'sand_px', {
            x: { min: -10, max: VW },
            y: { min: 0, max: VH },
            speedX: { min: 30, max: 90 },       // viento hacia la derecha
            speedY: { min: -6, max: 10 },
            scale:  { min: 0.4, max: 1.4 },
            lifespan: 6000,
            frequency: 120,
            alpha: { min: 0.05, max: 0.2 },
            tint: [0xc2a878, 0xd8bd8e, 0xa8895c],
        });
        sand.setScrollFactor(0).setDepth(3);

        // ── Velo de calima cálido cerca del horizonte (sutil) ──
        this._pixel('haze_px', 0xffffff, 8);
        const haze = scene.add.particles(0, 0, 'haze_px', {
            x: { min: 0, max: VW },
            y: { min: VH * 0.5, max: VH },
            speedX: { min: 6, max: 20 },
            scale:  { min: 3, max: 7 },
            lifespan: 8000,
            frequency: 500,
            alpha: { min: 0.03, max: 0.09 },
            tint: [0xd8bd8e, 0xc2a878],
        });
        haze.setScrollFactor(0).setDepth(2);
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

        // ── Silueta de caverna MUY lejana (suelo y techo) ─────
        // Da la sensación de un gran vacío rocoso a nuestro alrededor.
        if (!scene.textures.exists('cave_far')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x0a0714, 1);
            g.fillEllipse(120, 240, 380, 210);   // montículos de roca inferiores
            g.fillEllipse(430, 240, 460, 250);
            g.fillEllipse(720, 240, 400, 210);
            g.generateTexture('cave_far', 800, 240);
            g.destroy();
        }
        if (!scene.textures.exists('cave_ceiling')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x0a0714, 1);
            g.fillEllipse(160, 0, 340, 180);      // roca descendiendo del techo
            g.fillEllipse(470, 0, 420, 210);
            g.fillEllipse(760, 0, 360, 160);
            g.generateTexture('cave_ceiling', 800, 180);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'cave_far')
                .setOrigin(0, 1).setScrollFactor(0.15).setDepth(0).setAlpha(0.9);
            scene.add.image(i * 800, 0, 'cave_ceiling')
                .setOrigin(0, 0).setScrollFactor(0.15).setDepth(0).setAlpha(0.9);
        }

        // ── Muro de roca ORGÁNICA tileado (parallax leve) ─────
        // 3 variantes irregulares repartidas al azar por tile → nada de rejilla
        // de ladrillos: bultos de roca, fisuras angulares y motas minerales.
        const WALL_VARIANTS = 3;
        if (!scene.textures.exists('cave_wall_0')) {
            for (let v = 0; v < WALL_VARIANTS; v++) {
                const g = scene.make.graphics({ add: false });
                const rnd = new Phaser.Math.RandomDataGenerator(['cave-rock-' + v]);
                g.fillStyle(0x160f28); g.fillRect(0, 0, 128, 128);
                // Bultos de roca irregulares (tonos oscuros variados)
                for (let i = 0; i < 16; i++) {
                    g.fillStyle(rnd.pick([0x1d1436, 0x231843, 0x1a1030, 0x271a4a]), 1);
                    g.fillEllipse(rnd.between(0, 128), rnd.between(0, 128), rnd.between(26, 58), rnd.between(20, 46));
                }
                // Realces tenues (relieve superior)
                for (let i = 0; i < 9; i++) {
                    g.fillStyle(0x2c1e52, 0.4);
                    g.fillEllipse(rnd.between(0, 128), rnd.between(0, 128), rnd.between(14, 32), rnd.between(10, 22));
                }
                // Fisuras angulares (trazos escalonados)
                g.fillStyle(0x0b0716, 0.85);
                for (let i = 0; i < 6; i++) {
                    let x = rnd.between(12, 116), y = rnd.between(2, 40);
                    const seg = rnd.between(3, 6);
                    for (let s = 0; s < seg; s++) {
                        g.fillRect(x, y, 2, rnd.between(7, 13));
                        x += rnd.between(-5, 5); y += rnd.between(9, 15);
                    }
                }
                // Motas minerales y bioluminiscencia tenue
                for (let i = 0; i < 46; i++) {
                    g.fillStyle(rnd.pick([0x2c1e52, 0x0c081a, 0x39d0ff, 0x50f5c0]), rnd.pick([0.5, 0.3, 0.14]));
                    g.fillRect(rnd.between(0, 127), rnd.between(0, 127), 1, 1);
                }
                g.generateTexture('cave_wall_' + v, 128, 128);
                g.destroy();
            }
        }
        const wallRnd = new Phaser.Math.RandomDataGenerator(['cave-wall-layout']);
        for (let cy = 0; cy < H; cy += 128) {
            for (let cx = 0; cx < W; cx += 128) {
                scene.add.image(cx, cy, 'cave_wall_' + wallRnd.between(0, WALL_VARIANTS - 1))
                    .setOrigin(0, 0).setScrollFactor(0.35).setDepth(0).setAlpha(0.8);
            }
        }

        // ── Agujas de roca de plano medio (parallax) ──────────
        if (!scene.textures.exists('cave_spires')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['cave-spires']);
            g.fillStyle(0x140d24, 1);
            g.fillRect(0, 200, 800, 60);   // base sólida (rellena la franja del suelo, sin huecos)
            for (const sx of [70, 210, 360, 510, 660, 790]) {
                g.fillTriangle(sx - 34, 200, sx + 34, 200, sx, 200 - rnd.between(120, 210));
            }
            g.generateTexture('cave_spires', 800, 260);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'cave_spires')
                .setOrigin(0, 1).setScrollFactor(0.28).setDepth(1).setAlpha(0.85);
        }

        // ── Charcos de luz bioluminiscente (ambiente, ADD) ────
        // Manchas de color que "iluminan" el fondo cerca de vetas de cristal.
        if (!scene.textures.exists('cave_glow')) {
            const g = scene.make.graphics({ add: false });
            for (let r = 64; r > 0; r -= 3) {
                g.fillStyle(0xffffff, 0.006 + 0.014 * (1 - r / 64));
                g.fillCircle(64, 64, r);
            }
            g.generateTexture('cave_glow', 128, 128);
            g.destroy();
        }
        for (let i = 0; i < 9; i++) {
            const gx   = (i + 0.5) * (W / 9) + Phaser.Math.Between(-120, 120);
            const gy   = Phaser.Math.Between(H * 0.35, H * 0.8);
            const tint = Phaser.Math.RND.pick([0x2a80c0, 0x6030a0, 0x209070]);
            const pool = scene.add.image(gx, gy, 'cave_glow')
                .setScrollFactor(0.4).setDepth(1).setBlendMode(Phaser.BlendModes.ADD)
                .setTint(tint).setScale(Phaser.Math.FloatBetween(1.4, 2.6)).setAlpha(0.5);
            scene.tweens.add({
                targets: pool, alpha: 0.28,
                duration: Phaser.Math.Between(2200, 4200),
                yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000),
                ease: 'Sine.easeInOut'
            });
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

        // ── Rayos de luz tenues desde el techo (god rays, ADD) ─
        if (!scene.textures.exists('cave_shaft')) {
            const g = scene.make.graphics({ add: false });
            for (const sx of [VW * 0.22, VW * 0.56, VW * 0.82]) {
                g.fillStyle(0x9fd8ff, 0.05);
                g.fillTriangle(sx - 7, 0, sx + 7, 0, sx - 55, VH);
                g.fillTriangle(sx + 7, 0, sx - 55, VH, sx + 55, VH);
            }
            g.generateTexture('cave_shaft', VW, VH);
            g.destroy();
        }
        const shafts = scene.add.image(VW / 2, VH / 2, 'cave_shaft')
            .setScrollFactor(0).setDepth(1).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.5);
        scene.tweens.add({ targets: shafts, alpha: 0.85, duration: 5000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Niebla baja húmeda (ambiente, a la deriva) ────────
        this._pixel('cave_fog_px', 0xffffff, 6);
        const fog = scene.add.particles(0, 0, 'cave_fog_px', {
            x: { min: 0, max: VW },
            y: { min: VH * 0.55, max: VH },
            speedX: { min: 3, max: 14 },
            speedY: { min: -3, max: 3 },
            scale:  { min: 2, max: 5 },
            lifespan: 9000,
            frequency: 600,
            alpha: { min: 0.03, max: 0.10 },
            tint: [0x2a4a6a, 0x3a5a7a, 0x203040],
        });
        fog.setScrollFactor(0).setDepth(3);

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

        // ── Goteo de agua desde el techo (ambiente) ───────────
        this._pixel('drip_px', 0xffffff, 3);
        const drips = scene.add.particles(0, -6, 'drip_px', {
            x: { min: 0, max: VW },
            speedY: { min: 60, max: 120 },
            speedX: { min: -2, max: 2 },
            gravityY: 140,
            scale:  { min: 0.6, max: 1.2 },
            lifespan: 3600,
            frequency: 850,
            alpha: { min: 0.3, max: 0.7 },
            tint: [0x7fc8e8, 0xbff4ff],
        });
        drips.setScrollFactor(0).setDepth(3);

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

    // ══════════════════════════════════════════════════════════
    //  TEMA: VOLCÁN (volcán en actividad — nivel final)
    // ══════════════════════════════════════════════════════════

    _buildVolcano(W, H, VW, VH) {
        const scene = this.scene;

        // ── Cielo de lava (maroon oscuro arriba → naranja abajo) ─
        this._gradientSky('bg_sky_volcano', VW, VH, [
            [0,    0x1a0d0a],
            [0.35, 0x3a1410],
            [0.6,  0x6e2410],
            [0.82, 0xa83c14],
            [1.0,  0xd85a1e],
        ]);

        // ── Volcanes LEJANOS en erupción (cráter + coladas) — scroll 0.14 ─
        if (!scene.textures.exists('volcano_far')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0x2a1610, 1);
            g.fillTriangle(260, 280, 540, 280, 400, 56);    // cono principal
            g.fillTriangle(0, 280, 190, 280, 95, 150);
            g.fillTriangle(560, 280, 780, 280, 680, 120);
            g.fillTriangle(700, 280, 800, 280, 800, 172);
            // Cráter incandescente
            g.fillStyle(0xff5a1e); g.fillTriangle(400, 56, 382, 92, 418, 92);
            g.fillStyle(0xffb020); g.fillTriangle(400, 64, 392, 86, 408, 86);
            // Coladas de lava bajando el cono
            g.fillStyle(0xff5a1e); g.fillRect(398, 90, 3, 80); g.fillRect(401, 152, 3, 88);
            g.fillStyle(0xd83010); g.fillRect(388, 100, 2, 90); g.fillRect(412, 112, 2, 100);
            g.generateTexture('volcano_far', 800, 280);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'volcano_far')
                .setOrigin(0, 1).setScrollFactor(0.14).setDepth(1).setAlpha(0.9);
        }

        // ── Picos volcánicos MEDIOS + ruinas quemadas — scroll 0.3 ─
        if (!scene.textures.exists('volcano_mid')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['volcano-mid']);
            g.fillStyle(0x1a0d0a, 1);
            let x = -20;
            while (x < 820) {
                const pw = rnd.between(80, 160), ph = rnd.between(90, 200);
                g.fillTriangle(x, 240, x + pw, 240, x + pw / 2, 240 - ph);
                x += pw * 0.7;
            }
            g.fillRect(200, 100, 30, 140); g.fillRect(560, 130, 26, 110);   // torres calcinadas
            g.fillStyle(0xff5a1e, 0.5);                                      // grietas ardientes
            for (const cx of [120, 340, 500, 700]) g.fillRect(cx, 190, 2, 46);
            g.generateTexture('volcano_mid', 800, 240);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 800) + 1; i++) {
            scene.add.image(i * 800, H, 'volcano_mid')
                .setOrigin(0, 1).setScrollFactor(0.3).setDepth(1).setAlpha(0.92);
        }

        // ── Resplandor rojizo desde abajo (luz de lava, ADD) ──
        if (!scene.textures.exists('volcano_horizon')) {
            const g = scene.make.graphics({ add: false });
            for (let y = VH; y > VH * 0.45; y -= 4) {
                const t = (y - VH * 0.45) / (VH * 0.55);   // 0 arriba → 1 abajo
                g.fillStyle(0xff5a1e, 0.02 + 0.06 * t);
                g.fillRect(0, y, VW, 4);
            }
            g.generateTexture('volcano_horizon', VW, VH);
            g.destroy();
        }
        const horizon = scene.add.image(VW / 2, VH / 2, 'volcano_horizon')
            .setScrollFactor(0).setDepth(1).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.7);
        scene.tweens.add({ targets: horizon, alpha: 1.0, duration: 3800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Ríos de lava en el fondo de los POZOS (mundo, se ven en los huecos) ─
        // scrollFactor 1 y depth 2: bajo el suelo (depth 5) queda oculto, pero en
        // los huecos entre tramos se ve el río de lava del fondo.
        if (!scene.textures.exists('volcano_chasm_lava')) {
            const g = scene.make.graphics({ add: false });
            const rnd = new Phaser.Math.RandomDataGenerator(['volcano-chasm']);
            g.fillStyle(0x1a0d0a); g.fillRect(0, 0, 64, 72);           // pared oscura del pozo (arriba)
            g.fillStyle(0xd83010); g.fillRect(0, 10, 64, 62);          // lava
            g.fillStyle(0x8a1f0a); g.fillRect(0, 46, 64, 26);
            g.fillStyle(0xff5a1e); for (let i = 0; i < 10; i++) g.fillEllipse(rnd.between(0, 64), rnd.between(14, 44), rnd.between(10, 22), rnd.between(4, 8)); // coladas
            g.fillStyle(0xffb020); for (let i = 0; i < 8; i++) g.fillCircle(rnd.between(2, 62), rnd.between(14, 40), rnd.between(2, 4)); // puntos calientes
            g.fillStyle(0x2e2622); for (let i = 0; i < 6; i++) g.fillEllipse(rnd.between(0, 64), rnd.between(16, 60), rnd.between(6, 14), rnd.between(3, 6)); // costra
            g.fillStyle(0xffcf5a, 0.7); g.fillRect(0, 10, 64, 2);      // brillo superior
            g.generateTexture('volcano_chasm_lava', 64, 72);
            g.destroy();
        }
        scene.add.tileSprite(0, 744, W, 72, 'volcano_chasm_lava')
            .setOrigin(0, 0).setScrollFactor(1).setDepth(2);

        // ── Columnas de humo negro (ambiente) ─────────────────
        this._pixel('vsmoke_px', 0xffffff, 10);
        const smoke = scene.add.particles(0, VH, 'vsmoke_px', {
            x: { min: 0, max: VW },
            speedY: { min: -25, max: -10 },
            speedX: { min: -8, max: 14 },
            scale:  { min: 3, max: 8 },
            lifespan: 9000,
            frequency: 380,
            alpha: { min: 0.05, max: 0.16 },
            tint: [0x2a2724, 0x3a3632, 0x1a1512],
        });
        smoke.setScrollFactor(0).setDepth(2);

        // ── Ceniza cayendo (ambiente) ─────────────────────────
        this._pixel('ash_px', 0xffffff, 4);
        const ash = scene.add.particles(0, -10, 'ash_px', {
            x: { min: 0, max: VW },
            speedY: { min: 20, max: 50 },
            speedX: { min: -15, max: 15 },
            scale:  { min: 0.3, max: 1.0 },
            lifespan: 9000,
            frequency: 150,
            alpha: { min: 0.15, max: 0.5 },
            tint: [0x3a3632, 0x555049, 0x2a2724],
        });
        ash.setScrollFactor(0).setDepth(3);

        // ── Brasas ascendentes incandescentes (ambiente, ADD) ─
        this._pixel('ember_px', 0xffffff, 4);
        const embers = scene.add.particles(0, VH + 10, 'ember_px', {
            x: { min: 0, max: VW },
            speedY: { min: -55, max: -18 },
            speedX: { min: -12, max: 12 },
            scale:  { min: 0.3, max: 1.0 },
            lifespan: 5000,
            frequency: 110,
            alpha: { min: 0.3, max: 0.8 },
            tint: [0xff6a20, 0xffb020, 0xff5a1e],
            blendMode: 'ADD',
        });
        embers.setScrollFactor(0).setDepth(3);
    }
}
