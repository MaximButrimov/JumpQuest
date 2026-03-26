export default class BackgroundSystem {
    constructor(scene) {
        this.scene = scene;
    }

    build() {
        const scene = this.scene;
        const W = scene.physics.world.bounds.width;
        const H = scene.physics.world.bounds.height;

        // Cielo degradado
        if (!scene.textures.exists('bg_sky')) {
            const g = scene.make.graphics({ add: false });
            g.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x223399, 0x223399, 1);
            g.fillRect(0, 0, W, H);
            g.generateTexture('bg_sky', W, H);
            g.destroy();
        }

        scene.add.image(W / 2, H / 2, 'bg_sky')
            .setScrollFactor(0)
            .setDepth(0);

        this._addStars(W, H);
        this._addMountains(W, H);
        this._addClouds(W, H);
    }

    _addStars(W, H) {
        if (!this.scene.textures.exists('star_px')) {
            const g = this.scene.make.graphics({ add: false });
            g.fillStyle(0xffffff); g.fillRect(0, 0, 2, 2);
            g.generateTexture('star_px', 2, 2);
            g.destroy();
        }
        for (let i = 0; i < 80; i++) {
            const s = this.scene.add.image(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H * 0.6), 'star_px');
            s.setAlpha(Phaser.Math.FloatBetween(0.3, 1)).setScrollFactor(0.05).setDepth(1);
            this.scene.tweens.add({
                targets: s, alpha: 0.1, duration: Phaser.Math.Between(800, 2500),
                yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000)
            });
        }
    }

    _addMountains(W, H) {
        if (!this.scene.textures.exists('mountain_bg')) {
            const g = this.scene.make.graphics({ add: false });
            g.fillStyle(0x1e2d6b);
            g.fillTriangle(0, 200, 200, 40, 400, 200);
            g.fillTriangle(400, 200, 550, 60, 700, 200);
            g.generateTexture('mountain_bg', 700, 200);
            g.destroy();
        }
        for (let i = 0; i < Math.ceil(W / 700) + 1; i++) {
            const m = this.scene.add.image(i * 700, H - 150, 'mountain_bg').setOrigin(0, 1).setScrollFactor(0.15).setDepth(2).setAlpha(0.7);
        }
    }

    _addClouds(W, H) {
        if (!this.scene.textures.exists('cloud_spr')) {
            const g = this.scene.make.graphics({ add: false });
            g.fillStyle(0x7090cc, 0.6);
            g.fillEllipse(40, 30, 80, 40);
            g.generateTexture('cloud_spr', 140, 60);
            g.destroy();
        }
        for (let i = 0; i < 12; i++) {
            this.scene.add.image(Phaser.Math.Between(0, W), Phaser.Math.Between(50, H * 0.35), 'cloud_spr')
                .setScrollFactor(Phaser.Math.FloatBetween(0.2, 0.4)).setDepth(3).setAlpha(Phaser.Math.FloatBetween(0.4, 0.8));
        }
    }
}