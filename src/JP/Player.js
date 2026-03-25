/**
 * ============================================================
 *  JumpQuest – Player.js
 *  Lógica completa del jugador:
 *    · Movimiento horizontal con aceleración / fricción
 *    · Salto con gravedad variable (corto / largo)
 *    · Coyote time & jump buffer para control preciso
 *    · Sistema de vidas e invencibilidad tras golpe
 *    · Callbacks de colisión con enemigos y coleccionables
 * ============================================================
 */

class Player {
  /**
   * @param {Phaser.Scene} scene  – Escena propietaria
   * @param {number}       x     – Posición inicial X
   * @param {number}       y     – Posición inicial Y
   */
  constructor(scene, x, y) {
    this.scene = scene;

    // ── Constantes de movimiento ──────────────────────────
    this.SPEED         = 180;   // px/s velocidad máxima horizontal
    this.ACCELERATION  = 900;   // px/s² aceleración en suelo
    this.DRAG          = 800;   // px/s² fricción en suelo
    this.AIR_DRAG      = 200;   // fricción en el aire
    this.JUMP_VELOCITY = -520;  // impulso inicial de salto
    this.GRAVITY_UP    = 900;   // gravedad subiendo (sensación de vuelo)
    this.GRAVITY_DOWN  = 1600;  // gravedad cayendo (peso)
    this.COYOTE_TIME   = 100;   // ms tras salir del borde para poder saltar
    this.JUMP_BUFFER   = 120;   // ms antes de tocar suelo para pre-saltar

    // ── Estado ────────────────────────────────────────────
    this.lives          = 3;
    this.score          = 0;
    this.isAlive        = true;
    this.isInvincible   = false;
    this.coyoteTimer    = 0;
    this.jumpBufferTimer = 0;
    this.wasOnGround    = false;
    this.isJumping      = false;  // para salto variable

    // ── Sprite (generado por código) ──────────────────────
    this._buildSprite(x, y);

    // ── Partículas de aterrizaje ──────────────────────────
    this._buildParticles();

    // ── Input ─────────────────────────────────────────────
    this.cursors  = scene.input.keyboard.createCursorKeys();
    this.wasdKeys = scene.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump:  Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  // ─────────────────────────────────────────────────────────
  //  CONSTRUCCIÓN VISUAL
  // ─────────────────────────────────────────────────────────

  /** Crea el sprite del jugador con gráfico procedural */
  _buildSprite(x, y) {
    const scene = this.scene;

    // Dibujamos el personaje píxel a píxel en una textura
    if (!scene.textures.exists('player_tex')) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      // Cuerpo
      g.fillStyle(0xe84393); g.fillRect(4, 8, 16, 14);
      // Cabeza
      g.fillStyle(0xf7c948); g.fillRect(6, 0, 12, 10);
      // Ojos
      g.fillStyle(0x0a0a1a); g.fillRect(8, 3, 3, 3);
      g.fillStyle(0x0a0a1a); g.fillRect(13, 3, 3, 3);
      // Overol
      g.fillStyle(0x3d7af5); g.fillRect(4, 16, 16, 6);
      // Botones overol
      g.fillStyle(0xf7c948); g.fillRect(7, 17, 2, 2);
      g.fillStyle(0xf7c948); g.fillRect(15, 17, 2, 2);
      // Piernas
      g.fillStyle(0x3d7af5); g.fillRect(4, 22, 6, 6);
      g.fillStyle(0x3d7af5); g.fillRect(14, 22, 6, 6);
      // Zapatos
      g.fillStyle(0x1a1a2e); g.fillRect(2, 26, 8, 4);
      g.fillStyle(0x1a1a2e); g.fillRect(14, 26, 8, 4);
      // Sombrero
      g.fillStyle(0xe84393); g.fillRect(4, 0, 16, 4);
      g.fillStyle(0xf7c948); g.fillRect(0, 4, 24, 2);

      g.generateTexture('player_tex', 24, 30);
      g.destroy();
    }

    this.sprite = scene.physics.add.sprite(x, y, 'player_tex');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDragX(this.DRAG);
    this.sprite.body.setGravityY(0); // controlamos gravedad manualmente
    this.sprite.setDepth(10);

    // Hitbox más pequeña que el sprite visual
    this.sprite.body.setSize(18, 26);
    this.sprite.body.setOffset(3, 4);
  }

  /** Emitter de polvo al aterrizar */
  _buildParticles() {
    const scene = this.scene;

    if (!scene.textures.exists('particle_px')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0xffffff); g.fillRect(0, 0, 4, 4);
      g.generateTexture('particle_px', 4, 4);
      g.destroy();
    }

    this.dustEmitter = scene.add.particles(0, 0, 'particle_px', {
      speed:     { min: 40, max: 90 },
      angle:     { min: 220, max: 320 },
      scale:     { start: 1, end: 0 },
      lifespan:  260,
      quantity:  0,       // emitimos manualmente
      tint:      [0xf7c948, 0xffffff, 0xe0e0e0],
      gravityY:  200,
      blendMode: 'NORMAL'
    });
    this.dustEmitter.setDepth(9);
  }

  // ─────────────────────────────────────────────────────────
  //  UPDATE (llamado cada frame)
  // ─────────────────────────────────────────────────────────

  /** @param {number} delta – ms desde el frame anterior */
  update(delta) {
    if (!this.isAlive) return;

    const body    = this.sprite.body;
    const onGround = body.blocked.down;

    // ── Timers ───────────────────────────────────────────
    // Coyote time: aún podemos saltar un momento tras caer del borde
    if (onGround) {
      this.coyoteTimer = this.COYOTE_TIME;
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - delta);
    }

    // Jump buffer: registramos salto pulsado antes de tocar suelo
    const jumpPressed = this._jumpJustPressed();
    if (jumpPressed) {
      this.jumpBufferTimer = this.JUMP_BUFFER;
    } else {
      this.jumpBufferTimer = Math.max(0, this.jumpBufferTimer - delta);
    }

    // ── Aterrizaje ───────────────────────────────────────
    if (onGround && !this.wasOnGround) {
      this._onLand();
    }
    this.wasOnGround = onGround;

    // ── Movimiento horizontal ────────────────────────────
    const leftDown  = this.cursors.left.isDown  || this.wasdKeys.left.isDown;
    const rightDown = this.cursors.right.isDown || this.wasdKeys.right.isDown;

    if (leftDown) {
      body.setAccelerationX(-this.ACCELERATION);
      this.sprite.setFlipX(true);
    } else if (rightDown) {
      body.setAccelerationX(this.ACCELERATION);
      this.sprite.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      // Drag extra en el aire para que no resbale tanto
      body.setDragX(onGround ? this.DRAG : this.AIR_DRAG);
    }

    // Clampeamos velocidad horizontal
    body.velocity.x = Phaser.Math.Clamp(body.velocity.x, -this.SPEED, this.SPEED);

    // ── Salto ────────────────────────────────────────────
    const canJump = this.coyoteTimer > 0;

    if (this.jumpBufferTimer > 0 && canJump) {
      this._doJump();
    }

    // Salto variable: soltar tecla corta el salto
    if (this.isJumping && body.velocity.y < 0 && !this._jumpHeld()) {
      body.velocity.y *= 0.55; // frena la subida al soltar
      this.isJumping = false;
    }
    if (body.velocity.y >= 0) {
      this.isJumping = false;
    }

    // ── Gravedad variable ────────────────────────────────
    // Más gravedad bajando → sensación de peso sin ser lento subiendo
    const extraGrav = body.velocity.y < 0
      ? this.GRAVITY_UP
      : this.GRAVITY_DOWN;
    body.setGravityY(extraGrav);

    // ── Animación de sprite (rotación/escala simulada) ───
    this._animateSprite(onGround, leftDown || rightDown);

    // ── Muere al caer fuera del mundo ────────────────────
    if (this.sprite.y > this.scene.physics.world.bounds.height + 100) {
      this.loseLife();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  SALTO
  // ─────────────────────────────────────────────────────────

  _doJump() {
    this.sprite.body.setVelocityY(this.JUMP_VELOCITY);
    this.coyoteTimer    = 0;
    this.jumpBufferTimer = 0;
    this.isJumping       = true;

    // Efecto squish al saltar
    this.scene.tweens.add({
      targets:  this.sprite,
      scaleX:   0.8,
      scaleY:   1.25,
      duration: 80,
      yoyo:     true,
      ease:     'Quad.easeOut'
    });

    // Partículas de polvo
    this.dustEmitter.setPosition(this.sprite.x, this.sprite.y + 12);
    this.dustEmitter.explode(6);

    // Sonido de salto
    if (this.scene.sound.get('sfx_jump')) {
      this.scene.sound.play('sfx_jump', { volume: 0.5 });
    }
  }

  _jumpJustPressed() {
    return Phaser.Input.Keyboard.JustDown(this.cursors.up)      ||
           Phaser.Input.Keyboard.JustDown(this.wasdKeys.up)     ||
           Phaser.Input.Keyboard.JustDown(this.wasdKeys.jump)   ||
           Phaser.Input.Keyboard.JustDown(this.cursors.space);
  }

  _jumpHeld() {
    return this.cursors.up.isDown    ||
           this.wasdKeys.up.isDown   ||
           this.wasdKeys.jump.isDown ||
           this.cursors.space?.isDown;
  }

  // ─────────────────────────────────────────────────────────
  //  EVENTOS
  // ─────────────────────────────────────────────────────────

  /** Se llama al tocar el suelo tras estar en el aire */
  _onLand() {
    // Squish de aterrizaje
    this.scene.tweens.add({
      targets:  this.sprite,
      scaleX:   1.3,
      scaleY:   0.75,
      duration: 60,
      yoyo:     true,
      ease:     'Bounce.easeOut'
    });

    // Polvo de aterrizaje
    this.dustEmitter.setPosition(this.sprite.x, this.sprite.y + 12);
    this.dustEmitter.explode(8);

    if (this.scene.sound.get('sfx_land')) {
      this.scene.sound.play('sfx_land', { volume: 0.3 });
    }
  }

  /** El jugador recoge un ítem */
  collectItem(points = 100) {
    this.score += points;
    this.scene.events.emit('scoreChanged', this.score);

    if (this.scene.sound.get('sfx_collect')) {
      this.scene.sound.play('sfx_collect', { volume: 0.6 });
    }
  }

  /** El jugador pierde una vida */
  loseLife() {
    if (this.isInvincible || !this.isAlive) return;

    this.lives--;
    this.scene.events.emit('livesChanged', this.lives);

    if (this.lives <= 0) {
      this.die();
      return;
    }

    // Efecto de daño + invencibilidad temporal
    this.isInvincible = true;
    this.scene.cameras.main.shake(250, 0.015);

    if (this.scene.sound.get('sfx_hit')) {
      this.scene.sound.play('sfx_hit', { volume: 0.5 });
    }

    // Parpadeo de invencibilidad (1.5 s)
    this.scene.tweens.add({
      targets:  this.sprite,
      alpha:    0,
      duration: 100,
      yoyo:     true,
      repeat:   7,
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.isInvincible = false;
      }
    });

    // Rebote al recibir golpe
    const dir = this.sprite.flipX ? 1 : -1;
    this.sprite.body.setVelocity(dir * 200, -300);
  }

  /** Muerte definitiva */
  die() {
    this.isAlive = false;

    this.scene.tweens.add({
      targets:  this.sprite,
      y:        this.sprite.y - 60,
      alpha:    0,
      angle:    180,
      duration: 600,
      ease:     'Power2',
      onComplete: () => {
        this.scene.events.emit('playerDied');
      }
    });
  }

  // ─────────────────────────────────────────────────────────
  //  ANIMACIÓN VISUAL (sin spritesheets, solo tweens)
  // ─────────────────────────────────────────────────────────

  _animateSprite(onGround, moving) {
    // Inclinación leve al moverse
    if (!onGround) {
      this.sprite.angle = 0;
    } else if (moving) {
      const bob = Math.sin(this.scene.time.now * 0.015) * 3;
      this.sprite.angle = bob;
    } else {
      this.sprite.angle = 0;
    }
  }

  // ─────────────────────────────────────────────────────────
  //  GETTERS DE CONVENIENCIA
  // ─────────────────────────────────────────────────────────

  get x()      { return this.sprite.x; }
  get y()      { return this.sprite.y; }
  get body()   { return this.sprite.body; }
  get gameObject() { return this.sprite; }
}