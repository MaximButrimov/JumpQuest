import BackgroundSystem from "../systems/BackgroundSystem.js";
import TextureSystem from "../systems/TextureSystem.js";

export default class Level {
    constructor(scene, platformManager, data) {
        this.scene = scene;
        this.platformManager = platformManager;
        this.data = data;

        this.coins   = null;
        this.stars   = null;   // estrellas de poder
        this.enemies = null;
        this.portal  = null;

        // Sistemas
        this.backgroundSystem = new BackgroundSystem(scene);
        this.textureSystem = new TextureSystem(scene);

        this._init();
    }

    _init() {
        // 1. Visuals globales — el fondo depende del tema del nivel
        this.backgroundSystem.build(this.data.theme || 'forest');
        this.textureSystem.build();

        // 2. Construcción del nivel (depende de data)
        this._buildPlatforms();
        this._buildBridges();
        this._buildDecorations();
        this._buildCollectibles();
        this._buildEnemies();
        this._buildPortal();
    }

    // ─────────────────────────────
    // PLATAFORMAS
    // ─────────────────────────────
    _buildPlatforms() {
        const pm = this.platformManager;

        if (!this.data) throw new Error('[Level] Falta "data". ¿Pasaste Level1Data al constructor?');

        this.data.platforms.forEach(p => {
            pm.createStatic(p.x, p.y, p.width, p.texture);
        });

        this.data.movingPlatforms.forEach(p => {
            pm.createMoving(p.x, p.y, p.width, p.config);
        });

        // Rellena visualmente el hueco entre el suelo y el límite inferior del
        // mundo. Solo rellena bajo los tramos de suelo reales (misma Y que la
        // plataforma más ancha), dejando vacíos los agujeros mortales del nivel.
        const groundPlatform = this.data.platforms.reduce((a, b) => a.width > b.width ? a : b);
        const groundSegments = this.data.platforms.filter(p => p.y === groundPlatform.y);
        pm.fillGroundBottom(groundPlatform.y, groundSegments);
    }

    // ─────────────────────────────
    // PUENTES SUSPENDIDOS (temporizados)
    // ─────────────────────────────
    // data.bridges: [{ x, y, width, fuse?, breakTime? }]
    //   · fuse      – ms sobre el puente antes de que empiece a romperse (def. 1400)
    //   · breakTime – ms de "rotura" antes del derrumbe total (def. 350)
    // Al pisarlo (colisión desde GameScene) arranca el temporizador; si el
    // jugador tarda demasiado, los tablones se sueltan y caen al vacío.
    _buildBridges() {
        this.bridges = [];
        const scene = this.scene;

        (this.data.bridges || []).forEach(def => {
            const group  = scene.physics.add.staticGroup();
            const bridge = { def, group, tiles: [], debris: [], triggered: false, collapsed: false, tween: null, timers: [] };

            // Pilares rotos en los extremos (decorativos, apoyados en el suelo)
            scene.add.image(def.x,             def.y + 2, 'broken_pillar').setOrigin(0.5, 1).setDepth(4);
            scene.add.image(def.x + def.width, def.y + 2, 'broken_pillar').setOrigin(0.5, 1).setDepth(4);

            // Cuerda superior decorativa
            const rope = scene.add.graphics().setDepth(4);
            rope.lineStyle(2, 0x3a2614, 1);
            rope.lineBetween(def.x, def.y - 20, def.x + def.width, def.y - 20);

            this._populateBridge(bridge);
            this.bridges.push(bridge);
        });
    }

    /** Crea (o recrea) los tablones de un puente dentro de su grupo. */
    _populateBridge(bridge) {
        const { x, y, width } = bridge.def;
        const tileW = 24;
        const count = Math.max(1, Math.round(width / tileW));
        bridge.tiles = [];
        for (let i = 0; i < count; i++) {
            const t = bridge.group.create(x + i * tileW + tileW / 2, y, 'bridge_plank');
            t.refreshBody();
            t.setDepth(5);
            bridge.tiles.push(t);
        }
    }

    /** Arranca el temporizador de un puente (llamado al pisarlo). */
    triggerBridge(bridge) {
        if (bridge.triggered || bridge.collapsed) return;
        bridge.triggered = true;
        const scene = this.scene;

        // Temblor de aviso suave mientras corre la mecha
        bridge.tween = scene.tweens.add({
            targets: bridge.tiles, y: '+=1.5', duration: 70, yoyo: true, repeat: -1
        });

        const fuse = bridge.def.fuse ?? 1400;
        bridge.timers.push(scene.time.delayedCall(fuse, () => this._breakBridge(bridge)));
    }

    /** Fase de rotura: temblor fuerte antes del derrumbe. */
    _breakBridge(bridge) {
        if (bridge.collapsed) return;
        const scene = this.scene;

        if (bridge.tween) bridge.tween.stop();
        bridge.tween = scene.tweens.add({
            targets: bridge.tiles, y: '+=3', duration: 45, yoyo: true, repeat: -1
        });
        if (scene.sound.get('sfx_hit')) scene.sound.play('sfx_hit', { volume: 0.25, detune: -500 });

        const breakTime = bridge.def.breakTime ?? 350;
        bridge.timers.push(scene.time.delayedCall(breakTime, () => this._collapseBridge(bridge)));
    }

    /** Derrumbe: los tablones dejan de colisionar y caen al vacío. */
    _collapseBridge(bridge) {
        if (bridge.collapsed) return;
        bridge.collapsed = true;
        const scene = this.scene;

        if (bridge.tween) { bridge.tween.stop(); bridge.tween = null; }

        const tiles = bridge.tiles;
        bridge.tiles = [];
        tiles.forEach((t, i) => {
            // Deja de colisionar de inmediato → quien esté encima cae
            bridge.group.remove(t);
            scene.physics.world.disable(t);
            bridge.debris.push(t);
            t.setDepth(4);
            scene.tweens.add({
                targets: t, y: t.y + 460, angle: Phaser.Math.Between(-140, 140), alpha: 0,
                delay: i * 25, duration: 650, ease: 'Quad.easeIn',
                onComplete: () => t.destroy()
            });
        });
        if (scene.sound.get('sfx_hit')) scene.sound.play('sfx_hit', { volume: 0.45, detune: -750 });
    }

    /** Reconstruye todos los puentes (al reaparecer el jugador). */
    resetBridges() {
        if (!this.bridges) return;
        this.bridges.forEach(bridge => {
            bridge.timers.forEach(t => t.remove(false));
            bridge.timers = [];
            if (bridge.tween) { bridge.tween.stop(); bridge.tween = null; }
            bridge.group.clear(true, true);          // destruye tablones activos
            bridge.debris.forEach(d => { this.scene.tweens.killTweensOf(d); if (d.active) d.destroy(); });
            bridge.debris = [];
            bridge.tiles = [];
            bridge.triggered = false;
            bridge.collapsed = false;
            this._populateBridge(bridge);
        });
    }

    // ─────────────────────────────
    // DECORACIONES (data-driven)
    // ─────────────────────────────
    // Cada nivel declara sus propias decoraciones en data.decorations como
    // una lista de descriptores. Defaults pensados para adornos sobre el suelo:
    //   { texture, x, y=GROUND_Y, originX=0.5, originY=1, depth=4,
    //     flipX?, scale?, alpha?, tint? }
    // Para adornos colgados del techo usa y: 0, originY: 0 (ej. estalactitas).
    _buildDecorations() {
        const scene   = this.scene;
        const GROUND_Y = 752;

        const decorations = this.data.decorations || [];
        for (const d of decorations) {
            const img = scene.add.image(d.x, d.y ?? GROUND_Y, d.texture)
                .setOrigin(d.originX ?? 0.5, d.originY ?? 1)
                .setDepth(d.depth ?? 4);

            if (d.flipX)          img.setFlipX(true);
            if (d.scale != null)  img.setScale(d.scale);
            if (d.alpha != null)  img.setAlpha(d.alpha);
            if (d.tint != null)   img.setTint(d.tint);
        }
    }

    // ─────────────────────────────
    // COLECCIONABLES
    // ─────────────────────────────
    _buildCollectibles() {
        const scene = this.scene;

        // ── Monedas ──────────────────────────────────────
        this.coins = scene.physics.add.staticGroup();

        this.data.coins.forEach(([x, y]) => {
            const coin = this.coins.create(x, y, 'coin').setDepth(6);

            // Flotación con timing aleatorio para que no vayan al unísono
            scene.tweens.add({
                targets:  coin,
                y:        y - 8,
                duration: Phaser.Math.Between(700, 1200),
                yoyo:     true,
                repeat:   -1,
                ease:     'Sine.easeInOut',
                delay:    Phaser.Math.Between(0, 600)
            });

            // Giro (efecto "coin flip" comprimiendo scaleX)
            scene.tweens.add({
                targets:  coin,
                scaleX:   0.1,
                duration: 800,
                yoyo:     true,
                repeat:   -1,
                delay:    Phaser.Math.Between(0, 800)
            });
        });

        // ── Estrellas de poder ────────────────────────────
        this.stars = scene.physics.add.staticGroup();

        const starPositions = this.data.stars || [];
        for (const [sx, sy] of starPositions) {
            const star = this.stars.create(sx, sy, 'powerstar').setDepth(6);
            scene.tweens.add({
                targets: star, angle: 360,
                duration: 2000, repeat: -1, ease: 'Linear'
            });
            scene.tweens.add({
                targets: star, y: sy - 12,
                duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }
    }

    // ─────────────────────────────
    // ENEMIGOS
    // ─────────────────────────────
    _buildEnemies() {
        const scene = this.scene;

        this.enemies = scene.physics.add.group({
            allowGravity:       true,
            bounceX:            1,
            collideWorldBounds: true
        });

        this.data.enemies.forEach(e => {
            if (e.type === 'bat') {
                this._createBat(e);
            } else {
                this._createSlime(e);
            }
        });

        this.platformManager.addEnemyColliders(this.enemies);
    }

    _createSlime(e) {
        const scene = this.scene;
        const slime = this.enemies.create(e.x, e.y, 'enemy_slime').setDepth(7);
        slime.setVelocityX(e.speed);
        slime.setCollideWorldBounds(true);
        slime.setBounceX(1);

        // Hitbox ajustada: textura 32×28 → body 22×16 alineado con el pie visual
        slime.body.setSize(22, 16);
        slime.body.setOffset(5, 12);

        // Gravedad propia (la global del mundo es 0)
        slime.body.setGravityY(700);

        slime.isBat = false;

        scene.tweens.add({
            targets:  slime,
            scaleY:   0.85,
            scaleX:   1.1,
            duration: 400,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut',
            delay:    Phaser.Math.Between(0, 400)
        });
    }

    _createBat(e) {
        const scene = this.scene;
        const bat = this.enemies.create(e.x, e.y, 'enemy_bat').setDepth(7);
        bat.setVelocityX(e.speed);
        bat.setCollideWorldBounds(true);
        bat.setBounceX(1);

        // Hitbox compacta centrada en el cuerpo del murciélago (textura 28×18)
        bat.body.setSize(18, 10);
        bat.body.setOffset(5, 4);

        // Sin gravedad: flota
        bat.body.setAllowGravity(false);

        bat.isBat          = true;
        bat.floatOriginY   = e.y;
        bat.floatPhase     = Phaser.Math.FloatBetween(0, Math.PI * 2);
        bat.floatSpeed     = e.floatSpeed    || 2.5;
        bat.floatAmplitude = e.floatAmplitude || 38;

        // Aleteo animado
        scene.tweens.add({
            targets:  bat,
            scaleY:   0.65,
            scaleX:   1.2,
            duration: 180,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut',
            delay:    Phaser.Math.Between(0, 180)
        });
    }

    // ─────────────────────────────
    // PORTAL
    // ─────────────────────────────
    _buildPortal() {
        const scene = this.scene;

        this.portal = scene.add.image(
            this.data.exit.x,
            this.data.exit.y,
            'portal'
        ).setDepth(6);

        // Pulso
        scene.tweens.add({
            targets:  this.portal,
            scaleX:   1.15,
            scaleY:   1.1,
            alpha:    0.7,
            duration: 900,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut'
        });

        // Partículas del portal (requiere 'glow_px' generada en TextureSystem)
        this.portalEmitter = scene.add.particles(
            this.data.exit.x, this.data.exit.y,
            'glow_px',
            {
                speed:     { min: 10, max: 50 },
                angle:     { min: 0,  max: 360 },
                scale:     { start: 0.8, end: 0 },
                lifespan:  800,
                quantity:  1,
                frequency: 80,
                tint:      [0x39d0ff, 0x7af5ff, 0xffffff],
                blendMode: 'ADD'
            }
        );
        this.portalEmitter.setDepth(7);
    }

    // ─────────────────────────────
    // UPDATE
    // ─────────────────────────────
    update(time) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.isBat) {
                // Flotación sinusoidal en Y
                const targetY = enemy.floatOriginY +
                    Math.sin(time * 0.001 * enemy.floatSpeed + enemy.floatPhase) * enemy.floatAmplitude;
                // Mover hacia el objetivo vía velocidad (no altera la velocidad X)
                enemy.body.setVelocityY((targetY - enemy.y) * 10);
            }

            // Rebote horizontal (sirve tanto para slimes como murciélagos)
            if (enemy.body.blocked.left) {
                enemy.setVelocityX(Math.abs(enemy.body.velocity.x));
                enemy.setFlipX(false);
            }
            if (enemy.body.blocked.right) {
                enemy.setVelocityX(-Math.abs(enemy.body.velocity.x));
                enemy.setFlipX(true);
            }
        });
    }

    // ─────────────────────────────
    // CHECK PORTAL
    // ─────────────────────────────
    checkPortal(px, py) {
        return Phaser.Math.Distance.Between(
            px, py,
            this.portal.x, this.portal.y
        ) < 60;
    }
}