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
        // 1. Visuals globales (NO dependen del nivel)
        this.backgroundSystem.build();
        this.textureSystem.build();

        // 2. Construcción del nivel (depende de data)
        this._buildPlatforms();
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
    }

    // ─────────────────────────────
    // DECORACIONES
    // ─────────────────────────────
    _buildDecorations() {
        const scene = this.scene;
        const W     = scene.physics.world.bounds.width;
        const groundY = 752;

        // Arbustos sobre el suelo
        const bushX = [80, 280, 560, 860, 1100, 1500, 1900, 2500, 2900];
        for (const bx of bushX) {
            scene.add.image(bx, groundY, 'bush').setOrigin(0.5, 1).setDepth(4);
        }

        // Totems decorativos
        const totemX = [200, 900, 1700, 2700];
        for (const tx of totemX) {
            scene.add.image(tx, groundY, 'totem').setOrigin(0.5, 1).setDepth(4);
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
            const slime = this.enemies.create(e.x, e.y, 'enemy_slime').setDepth(7);
            slime.setVelocityX(e.speed);
            slime.setCollideWorldBounds(true);
            slime.setBounceX(1);

            // Squish idle animado
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
        });

        this.platformManager.addEnemyColliders(this.enemies);
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
    update() {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.body.blocked.left) {
                enemy.setVelocityX(Math.abs(enemy.body.velocity.x));
            }
            if (enemy.body.blocked.right) {
                enemy.setVelocityX(-Math.abs(enemy.body.velocity.x));
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