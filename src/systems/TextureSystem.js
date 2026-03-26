export default class TextureSystem {
    constructor(scene) {
        this.scene = scene;
    }

    build() {
        this._buildCoin();
        this._buildEnemy();
        this._buildPortal();
    }

    _buildCoin() {
        const scene = this.scene;
        if (scene.textures.exists('coin')) return;

        const g = scene.make.graphics({ add: false });
        g.fillStyle(0xf7c948);
        g.fillCircle(10, 10, 10);
        g.generateTexture('coin', 20, 20);
        g.destroy();
    }

    _buildEnemy() {
        const scene = this.scene;
        if (scene.textures.exists('enemy_slime')) return;

        const g = scene.make.graphics({ add: false });
        g.fillStyle(0xe84393);
        g.fillEllipse(16, 18, 32, 24);
        g.generateTexture('enemy_slime', 32, 28);
        g.destroy();
    }

    _buildPortal() {
        const scene = this.scene;
        if (scene.textures.exists('portal')) return;

        const g = scene.make.graphics({ add: false });
        g.lineStyle(4, 0x39d0ff);
        g.strokeEllipse(20, 32, 40, 64);
        g.generateTexture('portal', 40, 64);
        g.destroy();
    }
}