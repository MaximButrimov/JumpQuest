// ══════════════════════════════════════════════════════════════
//  Boss.js — Jefe final (esqueleto con armadura)
//
//  Comportamiento: PATRONES ALEATORIOS DE SALTOS. Cada cierto tiempo (aleatorio)
//  salta en una dirección y con una fuerza aleatorias, rebotando en las paredes.
//
//  Está DESACOPLADO de sus efectos: en cada salto invoca el callback `onJump`
//  (nada más). Quien lo instancia decide qué hace ese salto (p. ej. alternar la
//  inversión de controles). Así el disparador vive fuera del jefe y la mecánica
//  disparada no sabe nada del jefe.
//
//  Vida: se le daña saltándole encima (hit()). Al llegar a 0 → onDefeated().
// ══════════════════════════════════════════════════════════════

export default class Boss {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {Object} opts  { hp, onJump, onHpChange, onDefeated }
     */
    constructor(scene, x, y, opts = {}) {
        this.scene   = scene;
        this.maxHp   = opts.hp || 6;
        this.hp      = this.maxHp;
        this.onJump      = opts.onJump      || (() => {});
        this.onHpChange  = opts.onHpChange  || (() => {});
        this.onDefeated  = opts.onDefeated  || (() => {});

        this.isAlive      = true;
        this.isInvincible = false;

        this._buildSprite(x, y);
        this._buildFire(x, y);
        this._scheduleNextJump();
    }

    _buildSprite(x, y) {
        const scene = this.scene;
        this.sprite = scene.physics.add.sprite(x, y, 'enemy_boss').setDepth(8);
        this.sprite.setCollideWorldBounds(true);
        this.sprite.setBounceX(1);                 // rebota en las paredes de la sala
        this.sprite.setDragX(500);                 // frena tras aterrizar (no desliza sin fin)
        this.sprite.body.setSize(24, 34);
        this.sprite.body.setOffset(8, 12);
        this.sprite.body.setGravityY(900);
        // "Respiración" de llama
        scene.tweens.add({
            targets: this.sprite, scaleY: 1.05, scaleX: 0.97,
            duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
    }

    _buildFire(x, y) {
        const scene = this.scene;
        if (!scene.textures.exists('skel_fire_px')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0xffffff); g.fillCircle(3, 3, 3);
            g.generateTexture('skel_fire_px', 6, 6);
            g.destroy();
        }
        this.fire = scene.add.particles(x, y, 'skel_fire_px', {
            speed:    { min: 12, max: 44 },
            angle:    { min: 235, max: 305 },
            scale:    { start: 1.1, end: 0 },
            lifespan: 520,
            frequency: 45,
            alpha:    { min: 0.35, max: 0.8 },
            tint:     [0xff6a20, 0xffb020, 0xff5a1e],
            blendMode: 'ADD',
        });
        this.fire.setDepth(8).startFollow(this.sprite, 0, -6);
    }

    // ── Patrón de salto aleatorio ─────────────────────────────
    _scheduleNextJump() {
        if (!this.isAlive) return;
        const delay = Phaser.Math.Between(900, 2100);   // intervalo aleatorio
        this.jumpTimer = this.scene.time.delayedCall(delay, () => this._jump());
    }

    _jump() {
        if (!this.isAlive) return;
        // Solo salta si está apoyado (evita saltos en el aire)
        if (this.sprite.body.blocked.down || this.sprite.body.touching.down) {
            const dir = Phaser.Math.RND.pick([-1, 1]);
            this.sprite.setVelocityX(dir * Phaser.Math.Between(70, 190));
            this.sprite.setVelocityY(-Phaser.Math.Between(430, 580));   // altura aleatoria
            this.sprite.setFlipX(dir < 0);
            this.onJump();   // ← DISPARADOR DESACOPLADO (p. ej. invertir controles)
        }
        this._scheduleNextJump();
    }

    // ── Daño (pisotón del jugador) ────────────────────────────
    hit() {
        if (!this.isAlive || this.isInvincible) return false;
        this.hp--;
        this.onHpChange(this.hp, this.maxHp);
        if (this.hp <= 0) { this.defeat(); return true; }

        // Parpadeo + invencibilidad breve (evita multi-hit en un rebote)
        this.isInvincible = true;
        this.scene.cameras.main.shake(120, 0.008);
        this.scene.tweens.add({
            targets: this.sprite, alpha: 0.3, duration: 70, yoyo: true, repeat: 3,
            onComplete: () => { this.sprite.setAlpha(1); this.isInvincible = false; }
        });
        return true;
    }

    defeat() {
        this.isAlive = false;
        if (this.jumpTimer) this.jumpTimer.remove();
        this.sprite.setVelocity(0, 0);
        this.sprite.body.setAllowGravity(false);
        if (this.fire) this.fire.stop();
        this.scene.cameras.main.shake(400, 0.02);
        this.scene.tweens.add({
            targets: this.sprite, alpha: 0, scaleY: 0.1, angle: 200, y: this.sprite.y + 20,
            duration: 700, ease: 'Power2',
            onComplete: () => {
                if (this.fire) this.fire.destroy();
                this.sprite.destroy();
                this.onDefeated();
            }
        });
    }

    get x() { return this.sprite.x; }
    get y() { return this.sprite.y; }
    get body() { return this.sprite.body; }
}
