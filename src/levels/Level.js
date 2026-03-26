import BackgroundSystem from "../systems/BackgroundSystem.js";
import TextureSystem from "../systems/TextureSystem.js";

export default class Level {
    constructor(scene, platformManager, data) {
        this.scene = scene;
        this.platformManager = platformManager;
        this.data = data;

        this.coins = null;
        this.enemies = null;
        this.portal = null;

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
        this._buildCollectibles();
        this._buildEnemies();
        this._buildPortal();
    }

    // ─────────────────────────────
    // PLATAFORMAS
    // ─────────────────────────────
    _buildPlatforms() {
        const pm = this.platformManager;

        this.data.platforms.forEach(p => {
            pm.createStatic(p.x, p.y, p.width, p.texture);
        });

        this.data.movingPlatforms.forEach(p => {
            pm.createMoving(p.x, p.y, p.width, p.config);
        });
    }

    // ─────────────────────────────
    // COLECCIONABLES
    // ─────────────────────────────
    _buildCollectibles() {
        const scene = this.scene;

        this.coins = scene.physics.add.staticGroup();

        this.data.coins.forEach(([x, y]) => {
            const coin = this.coins.create(x, y, 'coin').setDepth(6);

            scene.tweens.add({
                targets: coin,
                y: y - 8,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        });
    }

    // ─────────────────────────────
    // ENEMIGOS
    // ─────────────────────────────
    _buildEnemies() {
        const scene = this.scene;

        this.enemies = scene.physics.add.group({
            bounceX: 1,
            collideWorldBounds: true
        });

        this.data.enemies.forEach(e => {
            const enemy = this.enemies.create(e.x, e.y, 'enemy_slime').setDepth(7);
            enemy.setVelocityX(e.speed);
        });

        this.platformManager.addEnemyColliders(this.enemies);
    }

    // ─────────────────────────────
    // PORTAL
    // ─────────────────────────────
    _buildPortal() {
        this.portal = this.scene.add.image(
            this.data.exit.x,
            this.data.exit.y,
            'portal'
        ).setDepth(6);
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
            px,
            py,
            this.portal.x,
            this.portal.y
        ) < 60;
    }
}