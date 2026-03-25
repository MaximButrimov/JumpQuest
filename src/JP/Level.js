/**
 * ============================================================
 *  JumpQuest – Level.js
 *  Definición del nivel: layout, enemigos, coleccionables,
 *  fondo parallax y portal de salida.
 *
 *  Exporta la clase Level que se instancia desde GameScene.
 * ============================================================
 */

class Level {
  /**
   * @param {Phaser.Scene}    scene
   * @param {PlatformManager} platformManager
   */
  constructor(scene, platformManager) {
    this.scene           = scene;
    this.platformManager = platformManager;

    this.coins   = null;  // Grupo de monedas
    this.enemies = null;  // Grupo de enemigos
    this.portal  = null;  // Sprite de salida

    this._buildBackground();
    this._buildTextures();
    this._buildLayout();
    this._buildCollectibles();
    this._buildEnemies();
    this._buildPortal();
  }

  // ─────────────────────────────────────────────────────────
  //  FONDO PARALLAX
  // ─────────────────────────────────────────────────────────

  _buildBackground() {
    const scene = this.scene;
    const W = scene.physics.world.bounds.width;
    const H = scene.physics.world.bounds.height;

    // Capa 1 – cielo degradado (estático)
    if (!scene.textures.exists('bg_sky')) {
      const g = scene.make.graphics({ add: false });
      // Degradado manual por franjas
      const stops = [
        [0,    0x0a0a2e],
        [0.25, 0x0d1b4b],
        [0.5,  0x112266],
        [0.75, 0x1a3380],
        [1.0,  0x223399]
      ];
      for (let i = 0; i < stops.length - 1; i++) {
        const [t0, c0] = stops[i];
        const [t1]     = stops[i + 1];
        const y0 = Math.floor(t0 * H);
        const y1 = Math.floor(t1 * H);
        g.fillStyle(c0);
        g.fillRect(0, y0, W, y1 - y0);
      }
      g.generateTexture('bg_sky', W, H);
      g.destroy();
    }
    scene.add.image(W / 2, H / 2, 'bg_sky').setScrollFactor(0).setDepth(0);

    // Capa 2 – estrellas/nubes lejanas
    this._addStars(W, H);

    // Capa 3 – montañas lejanas (parallax 0.2)
    this._addMountains(W, H);

    // Capa 4 – nubes medias (parallax 0.4)
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
      const s = this.scene.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H * 0.6),
        'star_px'
      );
      s.setAlpha(Phaser.Math.FloatBetween(0.3, 1));
      s.setScrollFactor(0.05);
      s.setDepth(1);

      // Parpadeo suave
      this.scene.tweens.add({
        targets:  s,
        alpha:    0.1,
        duration: Phaser.Math.Between(800, 2500),
        yoyo:     true,
        repeat:   -1,
        delay:    Phaser.Math.Between(0, 2000)
      });
    }
  }

  _addMountains(W, H) {
    if (!this.scene.textures.exists('mountain_bg')) {
      const g = this.scene.make.graphics({ add: false });
      // Picos de montañas en silueta
      g.fillStyle(0x1e2d6b);
      // Montaña grande
      g.fillTriangle(0, 200, 200, 40, 400, 200);
      g.fillTriangle(150, 200, 350, 20, 550, 200);
      g.fillTriangle(400, 200, 550, 60, 700, 200);
      g.fillStyle(0x253377);
      g.fillTriangle(50, 200, 180, 80, 320, 200);
      g.fillTriangle(300, 200, 480, 50, 660, 200);
      // Nieve
      g.fillStyle(0xddeeff);
      g.fillTriangle(200, 40, 220, 80, 180, 80);
      g.fillTriangle(350, 20, 370, 55, 335, 60);
      g.generateTexture('mountain_bg', 700, 200);
      g.destroy();
    }

    for (let i = 0; i < Math.ceil(W / 700) + 1; i++) {
      const m = this.scene.add.image(i * 700, H - 200, 'mountain_bg');
      m.setOrigin(0, 1);
      m.setScrollFactor(0.15);
      m.setDepth(2);
      m.setAlpha(0.7);
    }
  }

  _addClouds(W, H) {
    if (!this.scene.textures.exists('cloud_spr')) {
      const g = this.scene.make.graphics({ add: false });
      g.fillStyle(0x7090cc, 0.6);
      g.fillEllipse(40, 30, 80, 40);
      g.fillEllipse(65, 20, 60, 35);
      g.fillEllipse(90, 28, 70, 38);
      g.fillStyle(0x8aabdd, 0.4);
      g.fillEllipse(60, 22, 50, 28);
      g.generateTexture('cloud_spr', 140, 60);
      g.destroy();
    }

    for (let i = 0; i < 12; i++) {
      const c = this.scene.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(50, H * 0.35),
        'cloud_spr'
      );
      c.setScrollFactor(Phaser.Math.FloatBetween(0.2, 0.4));
      c.setDepth(3);
      c.setAlpha(Phaser.Math.FloatBetween(0.4, 0.8));
      c.setScale(Phaser.Math.FloatBetween(0.7, 1.4));
    }
  }

  // ─────────────────────────────────────────────────────────
  //  TEXTURAS DE GAMEPLAY
  // ─────────────────────────────────────────────────────────

  _buildTextures() {
    const scene = this.scene;

    // Moneda
    if (!scene.textures.exists('coin')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0xf7c948); g.fillCircle(10, 10, 10);
      g.fillStyle(0xffd700); g.fillCircle(10, 8, 7);
      g.fillStyle(0xffec6e); g.fillCircle(7, 6, 3);
      g.fillStyle(0xb8860b); g.fillCircle(10, 10, 2);
      g.fillStyle(0xffffff, 0.4); g.fillEllipse(7, 7, 4, 3);
      g.generateTexture('coin', 20, 20);
      g.destroy();
    }

    // Enemigo tipo slime
    if (!scene.textures.exists('enemy_slime')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0xe84393); g.fillEllipse(16, 18, 32, 24);
      g.fillStyle(0xff66b2); g.fillEllipse(12, 14, 14, 10);
      // Ojos
      g.fillStyle(0xffffff); g.fillCircle(9, 12, 4);
      g.fillStyle(0xffffff); g.fillCircle(23, 12, 4);
      g.fillStyle(0x1a1a2e); g.fillCircle(10, 12, 2);
      g.fillStyle(0x1a1a2e); g.fillCircle(24, 12, 2);
      // Reflejo
      g.fillStyle(0xffffff); g.fillCircle(9, 10, 1);
      g.fillStyle(0xffffff); g.fillCircle(23, 10, 1);
      // Boca
      g.fillStyle(0x1a1a2e);
      g.fillRect(11, 19, 10, 2);
      g.generateTexture('enemy_slime', 32, 28);
      g.destroy();
    }

    // Estrella de poder
    if (!scene.textures.exists('powerstar')) {
      const g = scene.make.graphics({ add: false });
      // Estrella de 5 puntas manual
      g.fillStyle(0xf7c948);
      const cx = 14, cy = 14, r1 = 14, r2 = 6;
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const r     = i % 2 === 0 ? r1 : r2;
        pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
      }
      g.fillPoints(pts, true);
      g.fillStyle(0xffd700);
      const pts2 = pts.map(p => ({ x: p.x * 0.7 + cx * 0.3, y: p.y * 0.7 + cy * 0.3 }));
      g.fillPoints(pts2, true);
      g.generateTexture('powerstar', 28, 28);
      g.destroy();
    }

    // Portal de salida
    if (!scene.textures.exists('portal')) {
      const g = scene.make.graphics({ add: false });
      g.lineStyle(4, 0x39d0ff);
      g.strokeEllipse(20, 32, 40, 64);
      g.lineStyle(2, 0x7af5ff);
      g.strokeEllipse(20, 32, 28, 50);
      g.fillStyle(0x0a2a4a, 0.8);
      g.fillEllipse(20, 32, 36, 60);
      g.fillStyle(0x39d0ff, 0.3);
      g.fillEllipse(20, 32, 20, 38);
      g.fillStyle(0xffffff, 0.6);
      g.fillEllipse(14, 20, 6, 10);
      g.generateTexture('portal', 40, 64);
      g.destroy();
    }

    // Suelo invisible decorativo
    if (!scene.textures.exists('ground_deco')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0x1a3a1a); g.fillRect(0, 0, 32, 8);
      g.fillStyle(0x0f2a0f); g.fillRect(0, 4, 32, 4);
      g.generateTexture('ground_deco', 32, 8);
      g.destroy();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  DISEÑO DEL NIVEL
  // ─────────────────────────────────────────────────────────

  /**
   * Layout del nivel 1. Coordenadas en píxeles.
   * El mundo mide 3200 × 800 px.
   */
  _buildLayout() {
    const pm = this.platformManager;

    // ── Suelo principal ──────────────────────────────────
    pm.createStatic(0,    752, 3200, 'grass');

    // ── Plataformas sección 1 ────────────────────────────
    pm.createStatic(100, 600, 160, 'grass');
    pm.createStatic(350, 520, 128, 'stone');
    pm.createStatic(550, 440, 96,  'grass');
    pm.createStatic(750, 360, 160, 'stone');

    // ── Sección 2 (más elevada) ──────────────────────────
    pm.createStatic(1000, 640, 192, 'grass');
    pm.createStatic(1250, 560, 96,  'stone');
    pm.createStatic(1400, 480, 128, 'grass');
    pm.createStatic(1600, 400, 96,  'stone');

    // ── Plataformas móviles ──────────────────────────────
    pm.createMoving(1800, 500, 128, { axis: 'x', range: 120, speed: 55 });
    pm.createMoving(2050, 420, 96,  { axis: 'y', range: 80,  speed: 45 });
    pm.createMoving(2200, 540, 96,  { axis: 'x', range: 100, speed: 70 });

    // ── Sección 3 (final) ────────────────────────────────
    pm.createStatic(2400, 620, 160, 'stone');
    pm.createStatic(2600, 540, 128, 'grass');
    pm.createStatic(2800, 460, 192, 'stone');
    pm.createStatic(3000, 560, 160, 'grass');

    // ── Plataforma del portal ────────────────────────────
    pm.createStatic(3050, 480, 160, 'grass');

    // ── Pilares decorativos (visuals) ────────────────────
    this._addDecorations();
  }

  _addDecorations() {
    const scene = this.scene;
    const W     = scene.physics.world.bounds.width;

    // Arbustos
    if (!scene.textures.exists('bush')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0x2ab866); g.fillEllipse(20, 16, 40, 28);
      g.fillStyle(0x3ddc84); g.fillEllipse(20, 12, 32, 20);
      g.fillStyle(0x5af5a0, 0.5); g.fillEllipse(14, 10, 12, 8);
      g.generateTexture('bush', 40, 28);
      g.destroy();
    }

    const bushPositions = [80, 280, 560, 860, 1100, 1500, 1900, 2500, 2900];
    for (const bx of bushPositions) {
      scene.add.image(bx, 750, 'bush').setOrigin(0.5, 1).setDepth(4);
    }

    // Totems decorativos
    if (!scene.textures.exists('totem')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0x8b5e3c); g.fillRect(6, 0, 20, 48);
      g.fillStyle(0xe84393); g.fillRect(4, 0, 24, 14);
      g.fillStyle(0x1a1a2e); g.fillRect(9, 3, 6, 6);
      g.fillStyle(0x1a1a2e); g.fillRect(17, 3, 6, 6);
      g.fillStyle(0xf7c948); g.fillRect(2, 14, 28, 4);
      g.generateTexture('totem', 32, 48);
      g.destroy();
    }

    const totemPositions = [200, 900, 1700, 2700];
    for (const tx of totemPositions) {
      scene.add.image(tx, 752, 'totem').setOrigin(0.5, 1).setDepth(4);
    }
  }

  // ─────────────────────────────────────────────────────────
  //  COLECCIONABLES
  // ─────────────────────────────────────────────────────────

  _buildCollectibles() {
    const scene = this.scene;

    this.coins = scene.physics.add.staticGroup();

    // Posiciones de monedas
    const coinPos = [
      // Sección 1
      [130, 570], [160, 570], [190, 570],
      [380, 490], [410, 490], [440, 490],
      [570, 410], [600, 410],
      [780, 330], [810, 330], [840, 330],
      // Sección 2
      [1030, 610], [1060, 610], [1090, 610],
      [1420, 450], [1450, 450], [1480, 450],
      [1620, 370], [1650, 370],
      // Sección 3
      [2420, 590], [2450, 590],
      [2630, 510], [2660, 510], [2690, 510],
      [2830, 430], [2860, 430],
      // Final
      [3070, 450], [3100, 450], [3130, 450],
    ];

    for (const [cx, cy] of coinPos) {
      const coin = this.coins.create(cx, cy, 'coin');
      coin.setDepth(6);

      // Animación de flotación
      scene.tweens.add({
        targets:  coin,
        y:        cy - 8,
        duration: Phaser.Math.Between(700, 1200),
        yoyo:     true,
        repeat:   -1,
        ease:     'Sine.easeInOut',
        delay:    Phaser.Math.Between(0, 600)
      });

      // Brillo rotativo
      scene.tweens.add({
        targets:  coin,
        scaleX:   0.1,
        duration: 800,
        yoyo:     true,
        repeat:   -1,
        delay:    Phaser.Math.Between(0, 800)
      });
    }

    // Estrellas de poder (valen más puntos)
    this.stars = scene.physics.add.staticGroup();

    const starPos = [[680, 310], [1750, 350], [2350, 570]];
    for (const [sx, sy] of starPos) {
      const star = this.stars.create(sx, sy, 'powerstar');
      star.setDepth(6);
      scene.tweens.add({
        targets:  star,
        angle:    360,
        duration: 2000,
        repeat:   -1,
        ease:     'Linear'
      });
      scene.tweens.add({
        targets:  star,
        y:        sy - 12,
        duration: 1000,
        yoyo:     true,
        repeat:   -1,
        ease:     'Sine.easeInOut'
      });
    }
  }

  // ─────────────────────────────────────────────────────────
  //  ENEMIGOS
  // ─────────────────────────────────────────────────────────

  _buildEnemies() {
    const scene = this.scene;

    this.enemies = scene.physics.add.group({
      allowGravity: true,
      bounceX:      1,   // rebota en paredes
      collideWorldBounds: true
    });

    // Posiciones: [x, y, velocidad horizontal]
    const enemyData = [
      [200,  736, 60],
      [500,  424, 50],
      [900,  744, 70],
      [1100, 624, 55],
      [1500, 464, 65],
      [2000, 736, 80],
      [2500, 604, 60],
      [2700, 444, 75],
      [3000, 736, 90],
    ];

    for (const [ex, ey, spd] of enemyData) {
      const slime = this.enemies.create(ex, ey, 'enemy_slime');
      slime.setDepth(7);
      slime.setVelocityX(Phaser.Math.Between(0, 1) === 0 ? spd : -spd);
      slime.setCollideWorldBounds(true);
      slime.setBounceX(1);

      // Animación idle (squish suave)
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

    // Añadir colisores con plataformas
    this.platformManager.addEnemyColliders(this.enemies);
  }

  // ─────────────────────────────────────────────────────────
  //  PORTAL DE SALIDA
  // ─────────────────────────────────────────────────────────

  _buildPortal() {
    const scene = this.scene;

    this.portal = scene.add.image(3120, 448, 'portal');
    this.portal.setDepth(6);

    // Pulso luminoso
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

    // Partículas del portal
    if (!scene.textures.exists('glow_px')) {
      const g = scene.make.graphics({ add: false });
      g.fillStyle(0x39d0ff); g.fillCircle(3, 3, 3);
      g.generateTexture('glow_px', 6, 6);
      g.destroy();
    }

    this.portalEmitter = scene.add.particles(3120, 440, 'glow_px', {
      speed:     { min: 10, max: 50 },
      angle:     { min: 0, max: 360 },
      scale:     { start: 0.8, end: 0 },
      lifespan:  800,
      quantity:  1,
      frequency: 80,
      tint:      [0x39d0ff, 0x7af5ff, 0xffffff],
      blendMode: 'ADD'
    });
    this.portalEmitter.setDepth(7);
  }

  // ─────────────────────────────────────────────────────────
  //  UPDATE
  // ─────────────────────────────────────────────────────────

  /** @param {number} time */
  update(time) {
    // Los enemigos que llegan al borde de una plataforma dan la vuelta
    this.enemies.getChildren().forEach(enemy => {
      if (enemy.body.blocked.left)  enemy.setVelocityX( Math.abs(enemy.body.velocity.x));
      if (enemy.body.blocked.right) enemy.setVelocityX(-Math.abs(enemy.body.velocity.x));
    });
  }

  /**
   * Verifica si el jugador tocó el portal.
   * @param {number} px
   * @param {number} py
   * @returns {boolean}
   */
  checkPortal(px, py) {
    return Phaser.Math.Distance.Between(px, py, this.portal.x, this.portal.y) < 40;
  }
}