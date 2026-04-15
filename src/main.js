import PlatformManager from './core/Platform.js';
import Player from './core/Player.js';
import Level from './levels/Level.js';
import Level1Data from './levels/Level1.js';
import MapScene from './map/MapScene.js';

/**
 * ============================================================
 *  JumpQuest – main.js
 *  Punto de entrada de Phaser 3.
 *
 *  Escenas:
 *    · BootScene    – Pantalla de carga y precarga de assets
 *    · MenuScene    – Menú principal animado
 *    · GameScene    – Gameplay principal
 *    · HUDScene     – UI superpuesta (puntuación, vidas)
 *    · PauseScene   – Pantalla de pausa
 *    · GameOverScene – Game over
 *    · WinScene     – Victoria
 * ============================================================
 */

// ══════════════════════════════════════════════════════════════
//  ESCENA: BOOT / CARGA
// ══════════════════════════════════════════════════════════════

class BootScene extends Phaser.Scene {
  constructor() { super({ key: 'BootScene' }); }

  preload() {
    // No hay assets externos; todos son procedurales.
    // Creamos sonidos sintéticos con Web Audio API.
  }

  create() {
    // Genera los sonidos proceduralmente antes de iniciar el juego
    this._generateSounds();
    this.scene.start('MenuScene');
  }

  /** Sintetiza sonidos con Web Audio API y los añade a la caché de Phaser */
  _generateSounds() {
    const ctx     = this.sound.context;
    const sampleRate = ctx.sampleRate;

    const addSound = (key, fn) => {
      const { buffer, duration } = fn(ctx, sampleRate);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      // Registramos el buffer en la caché de Phaser como un audio HTML5
      if (!this.cache.audio.exists(key)) {
        this.cache.audio.add(key, buffer);
      }
    };

    // ── Salto ──────────────────────────────────────────────
    this._synth('sfx_jump', ctx, sampleRate, (ctx, sr) => {
      const buf = ctx.createBuffer(1, sr * 0.22, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t   = i / sr;
        const env = Math.exp(-t * 18);
        const freq = 380 + 600 * Math.exp(-t * 25);
        data[i] = env * 0.55 * Math.sin(2 * Math.PI * freq * t);
      }
      return buf;
    });

    // ── Aterrizaje ─────────────────────────────────────────
    this._synth('sfx_land', ctx, sampleRate, (ctx, sr) => {
      const buf = ctx.createBuffer(1, sr * 0.12, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t   = i / sr;
        const env = Math.exp(-t * 35);
        data[i]   = env * 0.45 * (Math.random() * 2 - 1);
      }
      return buf;
    });

    // ── Colectar moneda ────────────────────────────────────
    this._synth('sfx_collect', ctx, sampleRate, (ctx, sr) => {
      const buf  = ctx.createBuffer(1, sr * 0.3, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t    = i / sr;
        const env  = Math.exp(-t * 12);
        const note = t < 0.1 ? 880 : 1320;
        data[i]    = env * 0.4 * Math.sin(2 * Math.PI * note * t);
      }
      return buf;
    });

    // ── Golpe ──────────────────────────────────────────────
    this._synth('sfx_hit', ctx, sampleRate, (ctx, sr) => {
      const buf  = ctx.createBuffer(1, sr * 0.25, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t   = i / sr;
        const env = Math.exp(-t * 20);
        const sq  = Math.sign(Math.sin(2 * Math.PI * 160 * t));
        data[i]   = env * 0.5 * sq + env * 0.2 * (Math.random() * 2 - 1);
      }
      return buf;
    });

    // ── Portal / victoria ──────────────────────────────────
    this._synth('sfx_portal', ctx, sampleRate, (ctx, sr) => {
      const buf  = ctx.createBuffer(1, sr * 0.6, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        const t    = i / sr;
        const env  = t < 0.05 ? t / 0.05 : Math.exp(-(t - 0.05) * 5);
        const freq = 440 + 440 * t;
        data[i]    = env * 0.5 * Math.sin(2 * Math.PI * freq * t);
      }
      return buf;
    });
  }

  /**
   * Sintetiza y registra un sonido usando Web Audio API.
   * @param {string}   key
   * @param {AudioContext} ctx
   * @param {number}   sr   – Sample rate
   * @param {Function} buildFn – (ctx, sr) → AudioBuffer
   */
  _synth(key, ctx, sr, buildFn) {
    try {
      const buffer = buildFn(ctx, sr);
      // decodeAudio() espera un ArrayBuffer crudo, no un AudioBuffer ya decodificado.
      // Como ya tenemos el AudioBuffer construido proceduralmente, lo registramos
      // directamente en la caché de Phaser sin pasar por decodeAudio().
      if (!this.cache.audio.exists(key)) {
        this.cache.audio.add(key, buffer);
      }
    } catch (e) {
      console.warn('[JumpQuest] _synth: no se pudo registrar el sonido "' + key + '":', e);
    }
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA: MENÚ PRINCIPAL
// ══════════════════════════════════════════════════════════════

class MenuScene extends Phaser.Scene {
  constructor() { super({ key: 'MenuScene' }); }

  create() {
    const { width: W, height: H } = this.scale;

    // ── Fondo degradado ──────────────────────────────────
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a2e, 0x0a0a2e, 0x112266, 0x112266, 1);
    bg.fillRect(0, 0, W, H);

    // Estrellas decorativas
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.7);
      const s = this.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff,
                Phaser.Math.FloatBetween(0.3, 1));
      this.tweens.add({
        targets:  s,
        alpha:    0.1,
        duration: Phaser.Math.Between(600, 2000),
        yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    // ── Logo / Título ────────────────────────────────────
    // Sombra del título
    this.add.text(W / 2 + 4, H * 0.18 + 4, 'JUMP', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '54px',
      color:      '#000000'
    }).setOrigin(0.5).setAlpha(0.5);

    const titleTop = this.add.text(W / 2, H * 0.18, 'JUMP', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '54px',
      color:      '#f7c948',
      stroke:     '#c8820a',
      strokeThickness: 6
    }).setOrigin(0.5).setScale(0).setAlpha(0);

    const titleBot = this.add.text(W / 2, H * 0.32, 'QUEST', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '54px',
      color:      '#e84393',
      stroke:     '#8b0042',
      strokeThickness: 6
    }).setOrigin(0.5).setScale(0).setAlpha(0);

    // Animación de entrada del título
    this.tweens.add({ targets: titleTop, scaleX: 1, scaleY: 1, alpha: 1, duration: 600, ease: 'Back.easeOut' });
    this.tweens.add({ targets: titleBot, scaleX: 1, scaleY: 1, alpha: 1, duration: 600, ease: 'Back.easeOut', delay: 200 });

    // Subtítulo
    this.add.text(W / 2, H * 0.44, '— Pixel Adventure —', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '11px',
      color:      '#39d0ff'
    }).setOrigin(0.5).setAlpha(0.8);

    // ── Mini personaje animado ────────────────────────────
    this._buildMenuChar(W / 2 - 160, H * 0.56);

    // ── Botones ──────────────────────────────────────────
    this._buildButton(W / 2, H * 0.62, '▶  JUGAR', 0x3ddc84, 0x2ab866, () => {
      this.cameras.main.fade(400, 0, 0, 0);
      this.time.delayedCall(400, () => this.scene.start('MapScene'));
    });

    this._buildButton(W / 2, H * 0.74, '?  CONTROLES', 0x39d0ff, 0x2a9aCC, () => {
      this._showControls(W, H);
    });

    // ── Créditos ─────────────────────────────────────────
    this.add.text(W / 2, H - 24, 'JumpQuest v1.0  |  Made with Phaser 3', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '7px',
      color:      '#445577'
    }).setOrigin(0.5);

    // Efecto fade-in inicial
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  _buildMenuChar(x, y) {
    const g = this.add.graphics();
    g.fillStyle(0xf7c948); g.fillRect(x - 6, y, 12, 10);
    g.fillStyle(0xe84393); g.fillRect(x - 8, y + 10, 16, 14);
    g.fillStyle(0x3d7af5); g.fillRect(x - 8, y + 18, 16, 6);
    g.fillStyle(0x1a1a2e); g.fillRect(x - 4, y + 3, 3, 3);
    g.fillStyle(0x1a1a2e); g.fillRect(x + 1, y + 3, 3, 3);

    this.tweens.add({
      targets:  g,
      y:        '-=10',
      duration: 600,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut'
    });
  }

  _buildButton(x, y, label, color, hoverColor, callback) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "'Press Start 2P'",
      fontSize:   '14px',
      color:      '#000000',
      backgroundColor: '#' + color.toString(16).padStart(6, '0'),
      padding:    { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => { btn.setStyle({ backgroundColor: '#' + hoverColor.toString(16).padStart(6, '0') }); this.tweens.add({ targets: btn, scaleX: 1.05, scaleY: 1.05, duration: 80 }); });
    btn.on('pointerout',   () => { btn.setStyle({ backgroundColor: '#' + color.toString(16).padStart(6, '0') });      this.tweens.add({ targets: btn, scaleX: 1,    scaleY: 1,    duration: 80 }); });
    btn.on('pointerdown',  () => { this.tweens.add({ targets: btn, scaleX: 0.95, scaleY: 0.95, duration: 60 }); });
    btn.on('pointerup',    () => callback());

    return btn;
  }

  _showControls(W, H) {
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.85);
    overlay.fillRoundedRect(W * 0.1, H * 0.15, W * 0.8, H * 0.7, 12);

    const lines = [
      '── CONTROLES ──',
      '',
      '←  →  /  A  D   Mover',
      '↑  /  W  /  SPACE  Saltar',
      '',
      'Mantén JUMP para saltar más alto',
      '',
      '🪙  Monedas  =  100 pts',
      '⭐  Estrella  =  500 pts',
      '🔵  Portal   =  Siguiente nivel',
      '',
      '❤  Tienes 3 vidas',
      '',
      '── ESC para pausar ──'
    ];

    const textObjs = [];
    lines.forEach((line, i) => {
      const t = this.add.text(W / 2, H * 0.22 + i * 26, line, {
        fontFamily: "'Press Start 2P'",
        fontSize:   '9px',
        color:      i === 0 ? '#f7c948' : '#ffffff'
      }).setOrigin(0.5);
      textObjs.push(t);
    });

    const closeBtn = this._buildButton(W / 2, H * 0.82, 'CERRAR', 0xe84393, 0xb8006a, () => {
      overlay.destroy();
      textObjs.forEach(t => t.destroy());
      closeBtn.destroy();
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA: HUD
// ══════════════════════════════════════════════════════════════

class HUDScene extends Phaser.Scene {
  constructor() { super({ key: 'HUDScene' }); }

  create() {
    const { width: W } = this.scale;

    // Panel superior semi-transparente
    this.panelBg = this.add.graphics();
    this.panelBg.fillStyle(0x000000, 0.55);
    this.panelBg.fillRoundedRect(6, 6, W - 12, 42, 8);

    // ── Vidas ───────────────────────────────────────────
    this.add.text(14, 14, '❤', { fontSize: '14px' });
    this.livesText = this.add.text(32, 14, '3', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#ff4444'
    });

    // ── Puntuación ──────────────────────────────────────
    this.add.text(80, 14, 'SCORE', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '9px',
      color:      '#aaaaaa'
    });
    this.scoreText = this.add.text(80, 27, '000000', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#f7c948'
    });

    // ── Monedas ─────────────────────────────────────────
    this.add.text(220, 14, '🪙', { fontSize: '13px' });
    this.coinText = this.add.text(238, 14, '×0', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#f7c948'
    });

    // ── Nivel ───────────────────────────────────────────
    this.add.text(W - 100, 14, 'NIVEL', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '9px',
      color:      '#aaaaaa'
    });
    this.add.text(W - 100, 27, '1-1', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#39d0ff'
    });

    // ── ESC – Pausa ──────────────────────────────────────
    this.add.text(W - 14, 14, 'ESC', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '7px',
      color:      '#555577'
    }).setOrigin(1, 0);

    // ── Escuchar eventos de GameScene ───────────────────
    this.coinsCollected = 0;

    this.scene.get('GameScene').events.on('scoreChanged', (score) => {
      this.scoreText.setText(String(score).padStart(6, '0'));
      this.tweens.add({ targets: this.scoreText, scaleX: 1.2, scaleY: 1.2, duration: 80, yoyo: true });
    });

    this.scene.get('GameScene').events.on('livesChanged', (lives) => {
      this.livesText.setText(String(lives));
      this.tweens.add({
        targets:  this.livesText,
        color:    '#ffffff',
        duration: 100,
        yoyo:     true,
        onComplete: () => this.livesText.setColor('#ff4444')
      });
    });

    this.scene.get('GameScene').events.on('coinCollected', () => {
      this.coinsCollected++;
      this.coinText.setText('×' + this.coinsCollected);
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA: PAUSA
// ══════════════════════════════════════════════════════════════

class PauseScene extends Phaser.Scene {
  constructor() { super({ key: 'PauseScene' }); }

  create() {
    const { width: W, height: H } = this.scale;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, W, H);

    this.add.text(W / 2, H * 0.3, '⏸ PAUSA', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '32px',
      color:      '#f7c948',
      stroke:     '#c8820a',
      strokeThickness: 4
    }).setOrigin(0.5);

    this._buildBtn(W / 2, H * 0.5,  '▶  CONTINUAR', 0x3ddc84, () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });

    this._buildBtn(W / 2, H * 0.64, '⟲  REINICIAR', 0x39d0ff, () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.stop();
      this.scene.start('GameScene');
      this.scene.start('HUDScene');
    });

    this._buildBtn(W / 2, H * 0.78, '⌂  MENÚ', 0xe84393, () => {
      this.scene.stop('GameScene');
      this.scene.stop('HUDScene');
      this.scene.stop();
      this.scene.start('MenuScene');
    });

    // ESC para cerrar pausa
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.resume('GameScene');
      this.scene.stop();
    });
  }

  _buildBtn(x, y, label, color, cb) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#000000',
      backgroundColor: '#' + color.toString(16).padStart(6, '0'),
      padding:    { x: 18, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setAlpha(0.85));
    btn.on('pointerout',   () => btn.setAlpha(1));
    btn.on('pointerup',    cb);
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA: GAME OVER
// ══════════════════════════════════════════════════════════════

class GameOverScene extends Phaser.Scene {
  constructor() { super({ key: 'GameOverScene' }); }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width: W, height: H } = this.scale;

    // Fondo oscuro
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0000, 0x1a0000, 0x3a0010, 0x3a0010, 1);
    bg.fillRect(0, 0, W, H);

    // Partículas de "muerte"
    if (!this.textures.exists('dead_px')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xff4444); g.fillRect(0, 0, 4, 4);
      g.generateTexture('dead_px', 4, 4);
      g.destroy();
    }
    const em = this.add.particles(W / 2, H / 2, 'dead_px', {
      speed:    { min: 80, max: 250 },
      angle:    { min: 0, max: 360 },
      scale:    { start: 1.2, end: 0 },
      lifespan: 1200,
      quantity: 40,
      tint:     [0xff4444, 0xff8800, 0xffcc00]
    });
    em.explode(40);

    // Título
    const goText = this.add.text(W / 2, H * 0.25, 'GAME OVER', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '40px',
      color:      '#ff4444',
      stroke:     '#880000',
      strokeThickness: 6
    }).setOrigin(0.5).setScale(0).setAlpha(0);

    this.tweens.add({
      targets:  goText,
      scaleX:   1, scaleY: 1, alpha: 1,
      duration: 700,
      ease:     'Back.easeOut'
    });

    // Puntuación final
    this.time.delayedCall(500, () => {
      this.add.text(W / 2, H * 0.44, `PUNTUACIÓN FINAL`, {
        fontFamily: "'Press Start 2P'",
        fontSize:   '10px',
        color:      '#aaaaaa'
      }).setOrigin(0.5);

      this.add.text(W / 2, H * 0.52, String(this.finalScore).padStart(6, '0'), {
        fontFamily: "'Press Start 2P'",
        fontSize:   '28px',
        color:      '#f7c948',
        stroke:     '#c8820a',
        strokeThickness: 4
      }).setOrigin(0.5);
    });

    // Botones
    this.time.delayedCall(900, () => {
      this._buildBtn(W / 2, H * 0.67, '▶  INTENTAR DE NUEVO', 0x3ddc84, () => {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.stop('HUDScene');
          this.scene.stop();
          this.scene.start('GameScene');
          this.scene.start('HUDScene');
        });
      });
      this._buildBtn(W / 2, H * 0.8, '⌂  MENÚ PRINCIPAL', 0x39d0ff, () => {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.stop('HUDScene');
          this.scene.stop();
          this.scene.start('MenuScene');
        });
      });
    });

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  _buildBtn(x, y, label, color, cb) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "'Press Start 2P'",
      fontSize:   '11px',
      color:      '#000000',
      backgroundColor: '#' + color.toString(16).padStart(6, '0'),
      padding:    { x: 16, y: 9 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => { btn.setAlpha(0.85); this.tweens.add({ targets: btn, scaleX: 1.05, scaleY: 1.05, duration: 70 }); });
    btn.on('pointerout',   () => { btn.setAlpha(1);    this.tweens.add({ targets: btn, scaleX: 1, scaleY: 1, duration: 70 }); });
    btn.on('pointerup',    cb);
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA: VICTORIA
// ══════════════════════════════════════════════════════════════

class WinScene extends Phaser.Scene {
  constructor() { super({ key: 'WinScene' }); }

  init(data) {
    this.finalScore = data.score   || 0;
    this.levelId    = data.levelId || 'level_1';
  }

  create() {
    const { width: W, height: H } = this.scale;

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x001a3a, 0x001a3a, 0x002266, 0x002266, 1);
    bg.fillRect(0, 0, W, H);

    // Lluvia de estrellas
    if (!this.textures.exists('win_star')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xf7c948); g.fillCircle(3, 3, 3);
      g.generateTexture('win_star', 6, 6);
      g.destroy();
    }

    this.add.particles(W / 2, 0, 'win_star', {
      speedY:   { min: 100, max: 300 },
      speedX:   { min: -80, max: 80 },
      scale:    { start: 1, end: 0 },
      lifespan: 2500,
      quantity: 2,
      frequency: 50,
      tint:     [0xf7c948, 0x39d0ff, 0xe84393, 0x3ddc84]
    });

    // Título
    const winText = this.add.text(W / 2, H * 0.22, '¡NIVEL\nCOMPLETO!', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '32px',
      color:      '#f7c948',
      stroke:     '#c8820a',
      strokeThickness: 6,
      align:      'center'
    }).setOrigin(0.5).setScale(0).setAlpha(0);

    this.tweens.add({ targets: winText, scaleX: 1, scaleY: 1, alpha: 1, duration: 700, ease: 'Back.easeOut' });

    // ── Guardar progreso ──────────────────────────────────────
    const earnedStars = this.finalScore >= 700 ? 3 : this.finalScore >= 300 ? 2 : 1;
    this._saveProgress(this.levelId, earnedStars);

    this.time.delayedCall(600, () => {
      this.add.text(W / 2, H * 0.46, 'PUNTUACIÓN', {
        fontFamily: "'Press Start 2P'",
        fontSize:   '10px',
        color:      '#aaaaaa'
      }).setOrigin(0.5);

      this.add.text(W / 2, H * 0.54, String(this.finalScore).padStart(6, '0'), {
        fontFamily: "'Press Start 2P'",
        fontSize:   '28px',
        color:      '#f7c948',
        stroke:     '#c8820a',
        strokeThickness: 4
      }).setOrigin(0.5);

      // Estrellas ganadas
      const starStr = '★'.repeat(earnedStars) + '☆'.repeat(3 - earnedStars);
      const starText = this.add.text(W / 2, H * 0.63, starStr, {
        fontSize: '28px',
        color:    '#f7c948'
      }).setOrigin(0.5).setScale(0);
      this.tweens.add({ targets: starText, scaleX: 1, scaleY: 1, duration: 500, ease: 'Back.easeOut' });

      this._buildBtn(W / 2, H * 0.75, '▶  MAPA', 0x3ddc84, () => {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.stop('HUDScene');
          this.scene.stop();
          this.scene.start('MapScene');
        });
      });
      this._buildBtn(W / 2, H * 0.88, '⟲  REINTENTAR', 0x39d0ff, () => {
        this.cameras.main.fade(300, 0, 0, 0);
        this.time.delayedCall(300, () => {
          this.scene.stop('HUDScene');
          this.scene.stop();
          this.scene.start('GameScene', { levelId: this.levelId });
          this.scene.start('HUDScene');
        });
      });
    });

    this.cameras.main.fadeIn(600, 0, 0, 0);
  }

  _saveProgress(levelId, stars) {
    try {
      const ALL_IDS = ['level_1', 'level_2', 'level_3', 'level_4', 'level_5'];
      const raw      = localStorage.getItem('jumpquest_progress');
      const progress = raw ? JSON.parse(raw) : {};

      // Mejorar estrellas si se hizo mejor puntuación
      if (!progress[levelId] || progress[levelId].stars < stars) {
        progress[levelId] = { unlocked: true, stars };
      }

      // Desbloquear el siguiente nivel
      const idx  = ALL_IDS.indexOf(levelId);
      const next = ALL_IDS[idx + 1];
      if (next && !progress[next]) {
        progress[next] = { unlocked: true, stars: 0 };
      }

      localStorage.setItem('jumpquest_progress', JSON.stringify(progress));
    } catch (e) {
      // localStorage no disponible (modo privado, etc.)
    }
  }

  _buildBtn(x, y, label, color, cb) {
    const btn = this.add.text(x, y, label, {
      fontFamily: "'Press Start 2P'",
      fontSize:   '11px',
      color:      '#000000',
      backgroundColor: '#' + color.toString(16).padStart(6, '0'),
      padding:    { x: 16, y: 9 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover',  () => btn.setAlpha(0.85));
    btn.on('pointerout',   () => btn.setAlpha(1));
    btn.on('pointerup',    cb);
  }
}

// ══════════════════════════════════════════════════════════════
//  ESCENA PRINCIPAL DE JUEGO
// ══════════════════════════════════════════════════════════════

class GameScene extends Phaser.Scene {
  constructor() { super({ key: 'GameScene' }); }

  init(data) {
    // Recibe datos desde MapScene o usa Level1 como fallback directo
    this._levelData = data.levelData || Level1Data;
    this._levelName = data.levelName || '1-1';
    this._levelId   = data.levelId   || 'level_1';
  }

  create() {
    const WORLD_W = this._levelData.worldWidth || 3200;
    const WORLD_H = 800;

    // Límites del mundo físico
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H);
    this.physics.world.gravity.y = 0; // cada entidad maneja su propia gravedad

    // ── Plataformas ───────────────────────────────────────
    this.platformManager = new PlatformManager(this);

    // ── Nivel ─────────────────────────────────────────────
    this.level = new Level(this, this.platformManager, this._levelData);

    // ── Jugador ───────────────────────────────────────────
    this.player = new Player(this, 80, 680);

    // Colisores jugador ↔ plataformas
    this.platformManager.addColliders(this.player.gameObject);

    // ── Colisiones: jugador ↔ monedas ────────────────────
    this.physics.add.overlap(
      this.player.gameObject,
      this.level.coins,
      (playerSprite, coin) => {
        coin.destroy();
        this.player.collectItem(100);
        this.events.emit('coinCollected');
        this._spawnCollectFX(coin.x, coin.y, 0xf7c948);
      }
    );

    // ── Colisiones: jugador ↔ estrellas ──────────────────
    this.physics.add.overlap(
      this.player.gameObject,
      this.level.stars,
      (playerSprite, star) => {
        star.destroy();
        this.player.collectItem(500);
        this.events.emit('coinCollected');
        this._spawnCollectFX(star.x, star.y, 0xf7c948);
        this._spawnCollectFX(star.x, star.y, 0x39d0ff);
      }
    );

    // ── Colisiones: jugador ↔ enemigos ───────────────────
    this.physics.add.overlap(
      this.player.gameObject,
      this.level.enemies,
      (playerSprite, enemy) => {
        // Ignorar si el jugador está en invencibilidad
        if (this.player.isInvincible) return;

        const vy = playerSprite.body.velocity.y;
        const vx = Math.abs(playerSprite.body.velocity.x);

        // Stompeado: la velocidad vertical domina la horizontal.
        // Este criterio es independiente de posición y funciona a
        // cualquier velocidad de caída o framerate.
        //   vy > 80     → mínimo impulso hacia abajo (evita rozar de pie)
        //   vy > vx*0.6 → componente vertical claramente mayor que la horizontal
        if (vy > 80 && vy > vx * 0.6) {
          this._killEnemy(enemy);
          playerSprite.body.setVelocityY(-320); // rebote
        } else {
          // Golpe lateral
          this.player.loseLife();
        }
      }
    );

    // ── Eventos de estado ─────────────────────────────────
    this.events.on('playerDied', () => {
      this.cameras.main.fade(600, 80, 0, 0);
      this.time.delayedCall(650, () => {
        this.scene.stop('HUDScene');
        this.scene.stop();
        this.scene.start('GameOverScene', { score: this.player.score });
      });
    });

    // ── Cámara ────────────────────────────────────────────
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H);
    this.cameras.main.startFollow(this.player.gameObject, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(120, 80);

    // ── Tecla ESC → pausa ─────────────────────────────────
    this.input.keyboard.on('keydown-ESC', () => {
      if (!this.scene.isPaused('GameScene')) {
        this.scene.pause('GameScene');
        this.scene.launch('PauseScene');
      }
    });

    // ── Texto de inicio de nivel ──────────────────────────
    this._showLevelIntro();

    // ── HUD paralelo ──────────────────────────────────────
    this.scene.launch('HUDScene');

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  // ─────────────────────────────────────────────────────────
  //  UPDATE
  // ─────────────────────────────────────────────────────────

  update(time, delta) {
    if (!this.player.isAlive) return;

    this.player.update(delta);
    this.level.update(time);
    this.platformManager.update(time);

    // Comprobación de portal
    if (this.level.checkPortal(this.player.x, this.player.y)) {
      this._reachPortal();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────────────────────

  _killEnemy(enemy) {
    this._spawnCollectFX(enemy.x, enemy.y, 0xe84393);
    this.player.collectItem(200);

    this.tweens.add({
      targets:  enemy,
      scaleY:   0,
      alpha:    0,
      duration: 200,
      onComplete: () => enemy.destroy()
    });

    if (this.sound.get('sfx_hit')) {
      this.sound.play('sfx_hit', { volume: 0.35, detune: -300 });
    }
  }

  /** Explosión de partículas al recoger algo */
  _spawnCollectFX(x, y, tint) {
    if (!this.textures.exists('colfx_px')) {
      const g = this.make.graphics({ add: false });
      g.fillStyle(0xffffff); g.fillRect(0, 0, 4, 4);
      g.generateTexture('colfx_px', 4, 4);
      g.destroy();
    }

    const em = this.add.particles(x, y, 'colfx_px', {
      speed:    { min: 60, max: 160 },
      angle:    { min: 0, max: 360 },
      scale:    { start: 1, end: 0 },
      lifespan: 400,
      quantity: 10,
      tint
    });
    em.setDepth(15);
    em.explode(10);
    this.time.delayedCall(500, () => em.destroy());
  }

  _reachPortal() {
    if (this._portalUsed) return;
    this._portalUsed = true;

    if (this.sound.get('sfx_portal')) {
      this.sound.play('sfx_portal', { volume: 0.7 });
    }

    this.cameras.main.flash(300, 100, 200, 255);
    this.time.delayedCall(600, () => {
      this.cameras.main.fade(500, 0, 0, 50);
      this.time.delayedCall(550, () => {
        this.scene.stop('HUDScene');
        this.scene.stop();
        this.scene.start('WinScene', { score: this.player.score });
      });
    });
  }

  _showLevelIntro() {
    const { width: W, height: H } = this.scale;

    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.7);
    panel.fillRoundedRect(W / 2 - 180, H / 2 - 40, 360, 80, 10);
    panel.setScrollFactor(0);

    const txt = this.add.text(W / 2, H / 2, 'NIVEL 1-1\n¡Encuentra el portal!', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#f7c948',
      align:      'center'
    }).setOrigin(0.5).setScrollFactor(0);

    this.tweens.add({
      targets:  [panel, txt],
      alpha:    0,
      duration: 500,
      delay:    2200,
      onComplete: () => { panel.destroy(); txt.destroy(); }
    });
  }
}

// ══════════════════════════════════════════════════════════════
//  CONFIGURACIÓN PHASER
// ══════════════════════════════════════════════════════════════

const config = {
  type:            Phaser.AUTO,
  width:           800,
  height:          480,
  backgroundColor: '#0a0a1a',
  parent:          'game-frame',
  pixelArt:        true,       // render pixel art sin antialiasing
  roundPixels:     true,
  antialias:       false,

  physics: {
    default: 'arcade',
    arcade:  {
      gravity: { y: 0 }, // cada sprite controla su gravedad
      debug:   false      // cambiar a true para ver hitboxes
    }
  },

  audio: {
    disableWebAudio: false,
    noAudio:         false
  },

  scene: [
    BootScene,
    MenuScene,
    MapScene,
    HUDScene,
    PauseScene,
    GameScene,
    GameOverScene,
    WinScene
  ]
};

// Arrancar el juego
const game = new Phaser.Game(config);

// Gestión de resize responsive
window.addEventListener('resize', () => {
  const minDim = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.95);
  const scale  = Math.min(minDim / 480, (window.innerWidth * 0.95) / 800);
  const canvas = document.querySelector('#game-frame canvas');
  if (canvas) {
    canvas.style.width  = Math.floor(800 * scale) + 'px';
    canvas.style.height = Math.floor(480 * scale) + 'px';
  }
});
window.dispatchEvent(new Event('resize'));