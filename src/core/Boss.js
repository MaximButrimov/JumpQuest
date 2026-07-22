// ══════════════════════════════════════════════════════════════
//  Boss.js — Jefe final (esqueleto con armadura)
//
//  IA por PATRONES ALEATORIOS. Cuando está apoyado y termina el enfriamiento,
//  elige al azar uno de estos movimientos:
//    · SALTO      — salto alto en dirección aleatoria.            (salta → invierte)
//    · CAÍDA      — salto parabólico APUNTANDO al jugador.        (salta → invierte)
//    · EMBESTIDA  — carga a ras de suelo hacia el jugador.        (no salta → no invierte)
//    · RÁFAGA     — 3 saltitos rápidos persiguiendo al jugador.   (cuenta como UN salto)
//  Los ataques dirigidos se TELEGRAFÍAN (tinte rojo + llamarada) para que sean
//  esquivables. Con la vida baja entra en FURIA: telegrafías más cortas,
//  enfriamientos menores y embestidas más rápidas.
//
//  DESACOPLE: cada patrón que implica saltar invoca el callback `onJump` (una
//  vez por patrón) y nada más; quien lo instancia decide el efecto (p. ej.
//  alternar la inversión de controles). `target` es solo un proveedor de
//  posición (el sprite del jugador); el jefe no conoce nada más de él.
//
//  Vida: se le daña saltándole encima (hit()). Al llegar a 0 → onDefeated().
// ══════════════════════════════════════════════════════════════

export default class Boss {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {Object} opts  { hp, target, onJump, onHpChange, onDefeated }
     */
    constructor(scene, x, y, opts = {}) {
        this.scene  = scene;
        this.maxHp  = opts.hp || 5;
        this.hp     = this.maxHp;
        this.target     = opts.target     || null;    // sprite del jugador (solo posición)
        this.onJump     = opts.onJump     || (() => {});
        this.onHpChange = opts.onHpChange || (() => {});
        this.onDefeated = opts.onDefeated || (() => {});

        this.isAlive      = true;
        this.isInvincible = false;

        this._buildSprite(x, y);
        this._buildFire(x, y);
        this._scheduleNextMove(1400);   // primer patrón tras la intro
    }

    /** Fase de furia (vida baja): más rápido y agresivo. */
    get enraged() { return this.hp <= 2; }

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

    // ─────────────────────────────────────────────────────────
    //  SELECTOR ALEATORIO DE PATRONES
    // ─────────────────────────────────────────────────────────

    _onGround() {
        return this.sprite.body.blocked.down || this.sprite.body.touching.down;
    }

    /** Dirección hacia el jugador (o aleatoria si no hay objetivo). */
    _dirToTarget() {
        if (!this.target || !this.target.active) return Phaser.Math.RND.pick([-1, 1]);
        return (this.target.x >= this.sprite.x) ? 1 : -1;
    }

    _scheduleNextMove(delayOverride) {
        if (!this.isAlive) return;
        const delay = delayOverride ?? (this.enraged
            ? Phaser.Math.Between(450, 1000)
            : Phaser.Math.Between(800, 1600));
        this.moveTimer = this.scene.time.delayedCall(delay, () => this._doRandomMove());
    }

    _doRandomMove() {
        if (!this.isAlive) return;
        if (!this._onGround()) { this._scheduleNextMove(250); return; }   // espera a aterrizar

        const roll = Math.random();
        if      (roll < 0.28) this._moveJump();
        else if (roll < 0.54) this._movePounce();
        else if (roll < 0.80) this._moveCharge();
        else                  this._moveHops();
    }

    // 1) SALTO alto en dirección aleatoria  (salta → onJump)
    _moveJump() {
        const dir = Phaser.Math.RND.pick([-1, 1]);
        this.sprite.setVelocityX(dir * Phaser.Math.Between(100, 210));
        this.sprite.setVelocityY(-Phaser.Math.Between(470, 600));
        this.sprite.setFlipX(dir < 0);
        this.onJump();
        this._scheduleNextMove();
    }

    // 2) CAÍDA dirigida: salto parabólico apuntando al jugador  (salta → onJump)
    _movePounce() {
        this._telegraph(this.enraged ? 280 : 400, () => {
            const vy = Phaser.Math.Between(520, 620);
            const t  = (2 * vy) / 900;                                  // tiempo de vuelo aprox.
            const dx = (this.target && this.target.active) ? (this.target.x - this.sprite.x) : 0;
            const vx = Phaser.Math.Clamp(dx / t, -280, 280);
            this.sprite.setVelocityX(vx);
            this.sprite.setVelocityY(-vy);
            this.sprite.setFlipX(vx < 0);
            this.onJump();
            this._scheduleNextMove();
        });
    }

    // 3) EMBESTIDA a ras de suelo hacia el jugador  (no salta → no invierte)
    _moveCharge() {
        this._telegraph(this.enraged ? 300 : 430, () => {
            const dir   = this._dirToTarget();
            const speed = this.enraged ? Phaser.Math.Between(350, 440) : Phaser.Math.Between(290, 370);
            this.sprite.setFlipX(dir < 0);
            this.sprite.setDragX(0);                                    // sin freno durante la carga
            this.sprite.setVelocityX(dir * speed);
            this.scene.time.delayedCall(Phaser.Math.Between(550, 750), () => {
                if (!this.isAlive || !this.sprite.active) return;
                this.sprite.setDragX(500);                              // recupera el freno
                this._scheduleNextMove();
            });
        });
    }

    // 4) RÁFAGA: 3 saltitos rápidos persiguiendo al jugador  (UN salto → onJump una vez)
    _moveHops() {
        this.onJump();
        const hop = (i) => {
            if (!this.isAlive || !this.sprite.active) return;
            if (i >= 3) { this._scheduleNextMove(); return; }
            if (this._onGround()) {
                const dir = this._dirToTarget();
                this.sprite.setVelocityX(dir * Phaser.Math.Between(150, 215));
                this.sprite.setVelocityY(-Phaser.Math.Between(300, 370));
                this.sprite.setFlipX(dir < 0);
                this.scene.time.delayedCall(400, () => hop(i + 1));
            } else {
                this.scene.time.delayedCall(140, () => hop(i));         // espera a aterrizar
            }
        };
        hop(0);
    }

    /** Aviso previo de ataque (tinte rojo + llamarada): lo hace esquivable. */
    _telegraph(ms, action) {
        this.sprite.setTint(0xff7a5a);
        if (this.fire) this.fire.setFrequency(16);
        this.scene.time.delayedCall(ms, () => {
            if (!this.sprite.active) return;
            this.sprite.clearTint();
            if (this.fire) this.fire.setFrequency(45);
            if (this.isAlive) action();
        });
    }

    // ─────────────────────────────────────────────────────────
    //  DAÑO / DERROTA
    // ─────────────────────────────────────────────────────────

    /** Pisotón del jugador. */
    hit() {
        if (!this.isAlive || this.isInvincible) return false;
        this.hp--;
        this.onHpChange(this.hp, this.maxHp);
        if (this.hp <= 0) { this.defeat(); return true; }

        // Al entrar en FURIA: aviso claro (flash + llama más intensa)
        if (this.enraged) {
            this.scene.cameras.main.flash(250, 255, 60, 20);
            if (this.fire) this.fire.setFrequency(30);
        }

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
        if (this.moveTimer) this.moveTimer.remove();
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
