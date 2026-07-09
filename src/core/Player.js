/**
 * ============================================================
 *  JumpQuest – Player.js
 *  Lógica completa del jugador:
 *    · Movimiento horizontal con aceleración / fricción
 *    · Salto con gravedad variable (corto / largo)
 *    · Coyote time & jump buffer para control preciso
 *    · Sistema de vidas e invencibilidad tras golpe
 *    · Callbacks de colisión con enemigos y coleccionables
 *
 *  La física por superficie (deslizamiento en hielo, etc.) NO vive aquí:
 *  las reglas están en mechanics/SurfacePhysics.js. El Player solo consulta
 *  y aplica la superficie que pisa (detectada por PlatformManager).
 * ============================================================
 */

import { surfacePhysics } from '../mechanics/SurfacePhysics.js';

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
    this.spawn          = { x, y };   // punto de aparición inicial
    this.checkpoints    = [];         // {x, y} ordenados por x
    this._respawning    = false;      // evita muertes múltiples por caída
    this.coyoteTimer    = 0;
    this.jumpBufferTimer = 0;
    this.wasOnGround    = false;
    this.isJumping      = false;  // para salto variable
    this.groundSurface  = 'normal'; // superficie bajo los pies (detección genérica)
    this.walkTimer      = 0;      // ciclo de caminado
    this.walkFrame      = 0;      // 0 → walk_a, 1 → walk_b
    this.currentFrame   = '';     // textura activa (evita setTexture redundante)

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

  /** Crea el sprite del jugador y sus frames de animación procedurales */
  _buildSprite(x, y) {
    const scene = this.scene;

    Player.buildFrames(scene);

    this.sprite = scene.physics.add.sprite(x, y, 'player_idle');
    this.currentFrame = 'player_idle';
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setDragX(this.DRAG);
    this.sprite.body.setGravityY(0); // controlamos gravedad manualmente
    this.sprite.setDepth(10);

    // Hitbox más pequeña que el sprite visual (todos los frames son 24×30)
    this.sprite.body.setSize(18, 26);
    this.sprite.body.setOffset(3, 4);
  }

  /**
   * Genera los 5 frames del personaje como texturas 24×30 independientes:
   * idle, walk_a, walk_b, jump y fall. Comparten cabeza/torso y varían
   * brazos y piernas según la pose. Estático → reutilizable desde cualquier
   * escena (p. ej. el menú) sin instanciar un Player.
   */
  static buildFrames(scene) {
    if (scene.textures.exists('player_idle')) return;

    const poses = {
      player_idle:   'idle',
      player_walk_a: 'walk_a',
      player_walk_b: 'walk_b',
      player_jump:   'jump',
      player_fall:   'fall',
    };

    for (const [key, pose] of Object.entries(poses)) {
      const g = scene.make.graphics({ x: 0, y: 0, add: false });
      Player._drawCharacter(g, pose);
      g.generateTexture(key, 24, 30);
      g.destroy();
    }
  }

  /** Cabeza + torso compartidos por todas las poses (lienzo 24×30). */
  static _drawCharacter(g, pose) {
    // ── Piernas / botas (detrás del torso), según pose ──
    Player._drawLegs(g, pose);
    // ── Brazo trasero (se dibuja antes del torso) ──
    Player._drawArms(g, pose, true);

    // ── Gorra ──
    g.fillStyle(0xe84393); g.fillRect(6, 1, 12, 4); g.fillRect(5, 3, 14, 2); g.fillRect(8, 0, 8, 1);
    g.fillStyle(0xff7bb5); g.fillRect(8, 1, 4, 1);                     // brillo gorra
    // ── Cara ──
    g.fillStyle(0xffcf9e); g.fillRect(6, 7, 12, 6);                   // piel
    g.fillStyle(0xe0a878); g.fillRect(15, 8, 3, 4);                   // sombra mejilla
    // ── Banda dorada de la gorra ──
    g.fillStyle(0xf7c948); g.fillRect(4, 5, 16, 2);
    // ── Ojos ──
    g.fillStyle(0xffffff); g.fillRect(8, 8, 3, 3); g.fillRect(13, 8, 3, 3);
    g.fillStyle(0x1a1a2e); g.fillRect(9, 9, 2, 2); g.fillRect(14, 9, 2, 2);
    g.fillStyle(0xffffff); g.fillRect(9, 9, 1, 1); g.fillRect(14, 9, 1, 1); // brillo
    // ── Mejillas + boca ──
    g.fillStyle(0xff9ec4); g.fillRect(7, 11, 1, 1); g.fillRect(16, 11, 1, 1);
    g.fillStyle(0xb82d6e); g.fillRect(11, 12, 2, 1);

    // ── Torso (túnica) ──
    g.fillStyle(0xe84393); g.fillRect(6, 13, 12, 5);
    g.fillStyle(0xb82d6e); g.fillRect(6, 17, 12, 1);                  // sombra inferior
    // ── Peto azul ──
    g.fillStyle(0x3d7af5); g.fillRect(8, 14, 8, 4); g.fillRect(8, 13, 2, 2); g.fillRect(14, 13, 2, 2);
    g.fillStyle(0xf7c948); g.fillRect(9, 15, 1, 1); g.fillRect(14, 15, 1, 1); // botones

    // ── Brazo delantero (encima del torso) ──
    Player._drawArms(g, pose, false);
  }

  /** Dibuja las piernas y botas según la pose. */
  static _drawLegs(g, pose) {
    const pants = 0x3d7af5, pantsSh = 0x2a5bd0, boot = 0x5a3921, sole = 0x1a1a2e;
    const leg  = (x, y, h) => { g.fillStyle(pants); g.fillRect(x, y, 4, h); g.fillStyle(pantsSh); g.fillRect(x, y, 1, h); };
    const foot = (x, y, w) => { g.fillStyle(boot);  g.fillRect(x, y, w, 3); g.fillStyle(sole); g.fillRect(x, y + 3, w, 1); };

    if (pose === 'walk_a') {
      leg(8, 18, 6);  foot(9, 24, 6);   // pierna delantera
      leg(12, 18, 7); foot(12, 25, 5);  // pierna trasera
    } else if (pose === 'walk_b') {
      leg(12, 18, 6); foot(11, 24, 6);
      leg(8, 18, 7);  foot(7, 25, 5);
    } else if (pose === 'jump') {
      leg(7, 17, 5);  foot(6, 21, 5);   // recogidas
      leg(13, 17, 5); foot(13, 21, 5);
    } else if (pose === 'fall') {
      leg(6, 18, 7);  foot(4, 25, 5);   // abiertas
      leg(14, 18, 7); foot(15, 25, 5);
    } else { // idle
      leg(7, 18, 7);  foot(6, 25, 5);
      leg(13, 18, 7); foot(13, 25, 5);
    }
  }

  /** Dibuja un brazo (skin). back=true para el brazo trasero. */
  static _drawArms(g, pose, back) {
    const skin = 0xffcf9e, skinSh = 0xe0a878;
    const arm = (x, y, w, h) => { g.fillStyle(skin); g.fillRect(x, y, w, h); g.fillStyle(skinSh); g.fillRect(x + w - 1, y, 1, h); };

    if (pose === 'jump') {
      if (back) arm(4, 10, 2, 5); else arm(18, 10, 2, 5);      // brazos arriba
    } else if (pose === 'fall') {
      if (back) arm(2, 13, 3, 2); else arm(19, 13, 3, 2);      // brazos extendidos
    } else if (pose === 'walk_a') {
      if (back) arm(5, 15, 2, 5); else arm(17, 13, 2, 5);      // balanceo
    } else if (pose === 'walk_b') {
      if (back) arm(17, 15, 2, 5); else arm(5, 13, 2, 5);
    } else { // idle
      if (back) arm(4, 14, 2, 5); else arm(18, 14, 2, 5);
    }
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

    // ── Movimiento horizontal (según la superficie pisada) ──
    // En suelo, la aceleración y la fricción dependen del tipo de superficie
    // (normal / hielo). En el aire se usan siempre los valores estándar.
    const surf  = surfacePhysics(this.groundSurface);
    const accel = onGround ? surf.accel : this.ACCELERATION;

    const leftDown  = this.cursors.left.isDown  || this.wasdKeys.left.isDown;
    const rightDown = this.cursors.right.isDown || this.wasdKeys.right.isDown;

    if (leftDown) {
      body.setAccelerationX(-accel);
      this.sprite.setFlipX(true);
    } else if (rightDown) {
      body.setAccelerationX(accel);
      this.sprite.setFlipX(false);
    } else {
      body.setAccelerationX(0);
      // Fricción: en hielo es baja → el personaje sigue deslizándose.
      body.setDragX(onGround ? surf.drag : this.AIR_DRAG);
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

    // ── Animación de sprite (frame + inclinación) ────────
    this._animateSprite(onGround, leftDown || rightDown, delta);

    // ── Muere al caer al vacío (agujeros / puentes derrumbados) ──
    if (this.sprite.y > this.scene.physics.world.bounds.height + 40) {
      this._fallDeath();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  CHECKPOINTS / MUERTE POR CAÍDA
  // ─────────────────────────────────────────────────────────

  /** Registra los checkpoints del nivel (para reaparecer tras caer). */
  setCheckpoints(list) {
    this.checkpoints = (list || []).map(c => ({ x: c.x, y: c.y })).sort((a, b) => a.x - b.x);
  }

  /** Último checkpoint superado (o el punto de aparición inicial). */
  _respawnPoint() {
    let pt = this.spawn;
    for (const c of this.checkpoints) {
      if (this.sprite.x >= c.x) pt = c; else break;
    }
    return pt;
  }

  /** Caída mortal al vacío: pierde una vida y reaparece en el checkpoint. */
  _fallDeath() {
    if (!this.isAlive || this._respawning) return;

    this.lives--;
    this.scene.events.emit('livesChanged', this.lives);

    if (this.scene.sound.get('sfx_hit')) {
      this.scene.sound.play('sfx_hit', { volume: 0.5, detune: -400 });
    }

    if (this.lives <= 0) {
      this.die();
      return;
    }

    // Reaparece en el último checkpoint
    this._respawning  = true;
    this.isInvincible = true;

    const pt = this._respawnPoint();
    this.scene.cameras.main.flash(220, 60, 0, 0);
    this.sprite.body.stop();
    this.sprite.setVelocity(0, 0);
    this.sprite.setPosition(pt.x, pt.y);
    this.sprite.setAngle(0);
    this.sprite.setAlpha(1);

    // Avisa a la escena (p. ej. para reconstruir los puentes derrumbados)
    this.scene.events.emit('playerRespawned', pt);

    this.scene.tweens.add({
      targets:  this.sprite,
      alpha:    0,
      duration: 90,
      yoyo:     true,
      repeat:   6,
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.isInvincible = false;
        this._respawning  = false;
      }
    });
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

  _animateSprite(onGround, moving, delta) {
    const body    = this.sprite.body;
    const running = moving && Math.abs(body.velocity.x) > 15;

    // ── Selección de frame ───────────────────────────────
    let frame;
    if (!onGround) {
      frame = body.velocity.y < -20 ? 'player_jump' : 'player_fall';
    } else if (running) {
      // Cadencia del ciclo de caminado proporcional a la velocidad
      const speedRatio = Phaser.Math.Clamp(Math.abs(body.velocity.x) / this.SPEED, 0.3, 1);
      this.walkTimer += delta * speedRatio;
      if (this.walkTimer >= 110) {
        this.walkTimer = 0;
        this.walkFrame ^= 1;
      }
      frame = this.walkFrame ? 'player_walk_a' : 'player_walk_b';
    } else {
      frame = 'player_idle';
    }

    if (frame !== this.currentFrame) {
      this.sprite.setTexture(frame);
      this.currentFrame = frame;
    }

    // ── Inclinación leve al correr ───────────────────────
    if (onGround && running) {
      this.sprite.angle = Math.sin(this.scene.time.now * 0.018) * 2.5;
    } else {
      this.sprite.angle = 0;
    }
  }

  /**
   * Registra el tipo de superficie que el jugador está pisando ('ice' |
   * 'normal'). Lo llama el colisionador de plataformas cada frame. La física
   * de movimiento se ajusta a esa superficie en update().
   */
  setGroundSurface(surface) {
    this.groundSurface = surface || 'normal';
  }

  // ─────────────────────────────────────────────────────────
  //  GETTERS DE CONVENIENCIA
  // ─────────────────────────────────────────────────────────

  get x()      { return this.sprite.x; }
  get y()      { return this.sprite.y; }
  get body()   { return this.sprite.body; }
  get gameObject() { return this.sprite; }
}
export default Player;