// ══════════════════════════════════════════════════════════════
//  MapScene – Mapa interactivo de selección de niveles
//
//  Para añadir un nivel nuevo:
//    1. Agrega una entrada en LEVEL_DEFS con su id, name, label,
//       posición (x, y) y el objeto levelData importado.
//    2. Si levelData es null, el nodo muestra "Próximamente".
// ══════════════════════════════════════════════════════════════

import Level1Data from '../levels/Level1.js';

// ── Definición de niveles ────────────────────────────────────
//  id        : clave única para localStorage
//  name      : texto corto mostrado en el nodo (ej. "1-1")
//  label     : nombre largo (2 líneas), mostrado bajo el nodo
//  x, y      : posición del nodo en pantalla (800 × 480)
//  levelData : objeto de datos del nivel; null → "Próximamente"
//  isBoss    : muestra corona 👑 y color especial

const LEVEL_DEFS = [
  { id: 'level_1', name: '1-1', label: 'Bosque\nInicial',  x: 120, y: 330, levelData: Level1Data, isBoss: false },
  { id: 'level_2', name: '1-2', label: 'Cuevas\nOscuras',  x: 265, y: 205, levelData: null,       isBoss: false },
  { id: 'level_3', name: '1-3', label: 'Puentes\nRotos',   x: 415, y: 305, levelData: null,       isBoss: false },
  { id: 'level_4', name: '1-4', label: 'Torres\nHeladas',  x: 570, y: 190, levelData: null,       isBoss: false },
  { id: 'level_5', name: '1-5', label: '¡JEFE!',           x: 700, y: 310, levelData: null,       isBoss: true  },
];

const STORAGE_KEY = 'jumpquest_progress';

export default class MapScene extends Phaser.Scene {
  constructor() { super({ key: 'MapScene' }); }

  create() {
    const { width: W, height: H } = this.scale;

    this.levelDefs = LEVEL_DEFS;

    this._loadProgress();
    this._buildBackground(W, H);
    this._buildPath();
    this._buildNodes(W, H);
    this._buildTitle(W);
    this._buildBackBtn(H);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  // ── Persistencia ────────────────────────────────────────────

  _loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      this.progress = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.progress = {};
    }
    if (!this.progress['level_1']) {
      this.progress['level_1'] = { unlocked: true, stars: 0 };
    }
  }

  _isUnlocked(id) { return !!this.progress[id]?.unlocked; }
  _getStars(id)   { return this.progress[id]?.stars || 0; }

  // ── Fondo ───────────────────────────────────────────────────

  _buildBackground(W, H) {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1b4332, 0x1b4332, 0x081c15, 0x081c15, 1);
    bg.fillRect(0, 0, W, H);

    const hills = this.add.graphics();
    hills.fillStyle(0x1a4a1a, 0.9);
    hills.fillEllipse(130, H + 10, 320, 130);
    hills.fillEllipse(410, H + 20, 400, 110);
    hills.fillEllipse(690, H + 10, 340, 120);

    const clouds = this.add.graphics();
    clouds.fillStyle(0xffffff, 0.12);
    [[110, 60], [330, 85], [540, 50], [720, 75]].forEach(([cx, cy]) => {
      clouds.fillEllipse(cx,      cy,      90, 34);
      clouds.fillEllipse(cx + 28, cy - 10, 58, 24);
      clouds.fillEllipse(cx - 24, cy - 4,  54, 22);
    });

    const grid = this.add.graphics();
    grid.lineStyle(1, 0x2d6a4f, 0.18);
    for (let x = 0; x <= W; x += 40) grid.lineBetween(x, 0, x, H);
    for (let y = 0; y <= H; y += 40) grid.lineBetween(0, y, W, y);

    const trees = this.add.graphics();
    trees.fillStyle(0x2d6a4f, 1);
    [[50, 390], [190, 400], [350, 380], [500, 395], [650, 385], [760, 400]].forEach(([tx, ty]) => {
      trees.fillTriangle(tx, ty - 28, tx - 14, ty, tx + 14, ty);
      trees.fillTriangle(tx, ty - 46, tx - 10, ty - 22, tx + 10, ty - 22);
      trees.fillStyle(0x1b4332, 1);
      trees.fillRect(tx - 4, ty, 8, 14);
      trees.fillStyle(0x2d6a4f, 1);
    });
  }

  // ── Camino entre nodos ──────────────────────────────────────

  _buildPath() {
    const nodes = this.levelDefs;

    const shadow = this.add.graphics();
    shadow.lineStyle(10, 0x000000, 0.25);
    for (let i = 0; i < nodes.length - 1; i++) {
      shadow.lineBetween(nodes[i].x + 2, nodes[i].y + 3, nodes[i + 1].x + 2, nodes[i + 1].y + 3);
    }

    const path = this.add.graphics();
    for (let i = 0; i < nodes.length - 1; i++) {
      const from     = nodes[i];
      const to       = nodes[i + 1];
      const dx       = to.x - from.x;
      const dy       = to.y - from.y;
      const steps    = Math.floor(Math.hypot(dx, dy) / 18);
      const unlocked = this._isUnlocked(nodes[i + 1].id);

      for (let s = 0; s < steps; s++) {
        if (s % 2 !== 0) continue;
        const t0 = s / steps;
        const t1 = (s + 1) / steps;
        path.lineStyle(7, unlocked ? 0xd4a017 : 0x4a5568, unlocked ? 0.9 : 0.45);
        path.lineBetween(
          from.x + dx * t0, from.y + dy * t0,
          from.x + dx * t1, from.y + dy * t1
        );
      }
    }
  }

  // ── Nodos de nivel ──────────────────────────────────────────

  _buildNodes(W, H) {
    this.levelDefs.forEach((def, i) => {
      const unlocked = this._isUnlocked(def.id);
      const stars    = this._getStars(def.id);

      const container = this.add.container(def.x, def.y);

      // Sombra
      const nodeShadow = this.add.graphics();
      nodeShadow.fillStyle(0x000000, 0.35);
      nodeShadow.fillCircle(4, 5, 30);
      container.add(nodeShadow);

      // Círculo
      const circle = this.add.graphics();
      if (!unlocked) {
        circle.fillStyle(0x2d3748, 1);
        circle.lineStyle(4, 0x4a5568, 1);
      } else if (def.isBoss) {
        circle.fillStyle(0x9b2335, 1);
        circle.lineStyle(4, 0xff6b8a, 1);
      } else if (stars > 0) {
        circle.fillStyle(0x276749, 1);
        circle.lineStyle(4, 0x48bb78, 1);
      } else {
        circle.fillStyle(0x2b6cb0, 1);
        circle.lineStyle(4, 0x63b3ed, 1);
      }
      circle.fillCircle(0, 0, 30);
      circle.strokeCircle(0, 0, 30);
      container.add(circle);

      // Texto central
      if (unlocked) {
        container.add(this.add.text(0, 0, def.name, {
          fontFamily: "'Press Start 2P'",
          fontSize:   '10px',
          color:      '#ffffff',
          stroke:     '#000000',
          strokeThickness: 2
        }).setOrigin(0.5));
      } else {
        container.add(this.add.text(0, 0, '🔒', { fontSize: '18px' }).setOrigin(0.5));
      }

      // Corona de jefe
      if (def.isBoss && unlocked) {
        container.add(this.add.text(0, -42, '👑', { fontSize: '16px' }).setOrigin(0.5));
      }

      // Etiqueta
      container.add(this.add.text(0, 44, def.label, {
        fontFamily: "'Press Start 2P'",
        fontSize:   '7px',
        color:      unlocked ? '#f7c948' : '#4a5568',
        align:      'center'
      }).setOrigin(0.5, 0));

      // Estrellas
      if (unlocked) {
        container.add(this.add.text(
          0, 64,
          '★'.repeat(stars) + '☆'.repeat(3 - stars),
          { fontSize: '15px', color: stars > 0 ? '#f7c948' : '#4a5568' }
        ).setOrigin(0.5, 0));
      }

      // Interactividad
      if (unlocked) {
        const hitZone = this.add.circle(0, 0, 32).setInteractive({ useHandCursor: true });
        container.add(hitZone);

        hitZone.on('pointerover', () => {
          this.tweens.add({ targets: container, scaleX: 1.13, scaleY: 1.13, duration: 100 });
        });
        hitZone.on('pointerout', () => {
          this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 100 });
        });
        hitZone.on('pointerup', () => {
          if (def.levelData) {
            this.cameras.main.fade(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
              this.scene.stop();
              this.scene.start('GameScene', {
                levelData: def.levelData,
                levelName: def.name,
                levelId:   def.id
              });
              this.scene.start('HUDScene');
            });
          } else {
            this._showComingSoon(W, H);
          }
        });

        // Pulso en nivel disponible sin completar
        if (stars === 0) {
          this.tweens.add({
            targets:  container,
            scaleX:   1.1, scaleY: 1.1,
            duration: 850,
            yoyo: true, repeat: -1,
            ease: 'Sine.easeInOut'
          });
        }
      }
    });
  }

  // ── Título ──────────────────────────────────────────────────

  _buildTitle(W) {
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.55);
    panel.fillRoundedRect(W / 2 - 180, 8, 360, 42, 8);

    this.add.text(W / 2, 29, 'SELECCIONAR NIVEL', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '13px',
      color:      '#f7c948',
      stroke:     '#7b5e00',
      strokeThickness: 4
    }).setOrigin(0.5);
  }

  // ── Botón volver ────────────────────────────────────────────

  _buildBackBtn(H) {
    const btn = this.add.text(20, H - 20, '◀ MENÚ', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '10px',
      color:      '#000000',
      backgroundColor: '#39d0ff',
      padding:    { x: 10, y: 6 }
    }).setOrigin(0, 1).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setAlpha(0.8));
    btn.on('pointerout',  () => btn.setAlpha(1));
    btn.on('pointerup',   () => {
      this.cameras.main.fade(300, 0, 0, 0);
      this.time.delayedCall(300, () => {
        this.scene.stop();
        this.scene.start('MenuScene');
      });
    });
  }

  // ── Popup "próximamente" ─────────────────────────────────────

  _showComingSoon(W, H) {
    const panel = this.add.graphics();
    panel.fillStyle(0x000000, 0.75);
    panel.fillRoundedRect(W / 2 - 155, H / 2 - 44, 310, 88, 10);

    const t1 = this.add.text(W / 2, H / 2 - 14, 'PRÓXIMAMENTE...', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '12px',
      color:      '#f7c948'
    }).setOrigin(0.5);

    const t2 = this.add.text(W / 2, H / 2 + 12, '¡Nivel en desarrollo!', {
      fontFamily: "'Press Start 2P'",
      fontSize:   '8px',
      color:      '#aaaaaa'
    }).setOrigin(0.5);

    this.time.delayedCall(1800, () => { panel.destroy(); t1.destroy(); t2.destroy(); });
  }
}
