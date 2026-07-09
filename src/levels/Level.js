import BackgroundSystem from "../systems/BackgroundSystem.js";
import TextureSystem from "../systems/TextureSystem.js";
import BridgeSystem from "../mechanics/BridgeSystem.js";

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
        // Mecánica de puentes: módulo independiente (mechanics/BridgeSystem.js)
        this.bridgeSystem = new BridgeSystem(this.scene).build(this.data.bridges);
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

        // ── Estrellas de poder (con validación de posición) ──
        this.stars = scene.physics.add.staticGroup();

        // Posiciones a evitar: todas las monedas + estrellas ya colocadas
        const avoid = (this.data.coins || []).map(([x, y]) => ({ x, y }));

        for (const [sx, sy] of (this.data.stars || [])) {
            const pos = this._findValidStarPosition(sx, sy, avoid);
            if (!pos) continue; // ninguna posición válida → se descarta la estrella

            const star = this.stars.create(pos.x, pos.y, 'powerstar').setDepth(6);
            avoid.push({ x: pos.x, y: pos.y }); // las siguientes estrellas también la evitan

            scene.tweens.add({
                targets: star, angle: 360,
                duration: 2000, repeat: -1, ease: 'Linear'
            });
            scene.tweens.add({
                targets: star, y: pos.y - 12,
                duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }
    }

    // ─────────────────────────────
    // VALIDACIÓN DE POSICIÓN DE ESTRELLAS
    // ─────────────────────────────
    // Reglas:
    //   1. Nunca detrás del portal de salida (deben cogerse antes de terminar).
    //   2. Distancia mínima a cualquier moneda/estrella (sin solaparse ni pegarse).
    // Si la posición propuesta no cumple, se busca una válida cercana en espiral;
    // si no se encuentra ninguna, se devuelve null (la estrella se descarta).
    _findValidStarPosition(x, y, avoid) {
        const MIN_DIST       = 44;  // px centro a centro con otros coleccionables
        const PORTAL_MARGIN  = 48;  // px por delante del portal (lado de aproximación)

        const worldW = this.scene.physics.world.bounds.width;
        const maxX   = (this.data.exit ? this.data.exit.x : worldW) - PORTAL_MARGIN;

        const clampX = (px) => Phaser.Math.Clamp(px, 40, Math.min(maxX, worldW - 40));
        const clampY = (py) => Phaser.Math.Clamp(py, 60, 700);
        const farFromAll = (px, py) =>
            avoid.every(c => Phaser.Math.Distance.Between(px, py, c.x, c.y) >= MIN_DIST);

        // 1) Posición original, ya restringida al límite del portal
        let cx = clampX(x), cy = clampY(y);
        if (farFromAll(cx, cy)) return { x: cx, y: cy };

        // 2) Búsqueda en espiral (radios crecientes, varios ángulos)
        for (let r = 24; r <= 180; r += 16) {
            for (let a = 0; a < 360; a += 30) {
                const rad = Phaser.Math.DegToRad(a);
                const px  = clampX(x + Math.cos(rad) * r);
                const py  = clampY(y + Math.sin(rad) * r);
                if (px <= maxX && farFromAll(px, py)) return { x: px, y: py };
            }
        }
        return null; // sin posición válida
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