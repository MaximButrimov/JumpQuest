/**
 * ============================================================
 *  JumpQuest – Platform.js
 *  Gestión de plataformas estáticas y móviles.
 *
 *  Uso:
 *    const platforms = new PlatformManager(scene);
 *    platforms.createStatic(x, y, width);
 *    platforms.createMoving(x, y, width, { range, speed, axis });
 * ============================================================
 */

class PlatformManager {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
    this.scene = scene;

    // Grupo estático para colisiones eficientes
    this.staticGroup = scene.physics.add.staticGroup();

    // Grupo dinámico para plataformas móviles
    this.movingGroup = scene.physics.add.group({
      allowGravity: false,
      immovable:    true
    });

    this._buildTextures();
    this.movingPlatforms = []; // {sprite, config, origin}
  }

  // ─────────────────────────────────────────────────────────
  //  TEXTURAS PROCEDURALES
  // ─────────────────────────────────────────────────────────

  _buildTextures() {
    const scene = this.scene;

    // ── Tile de plataforma estándar (32×16) ────────────────
    if (!scene.textures.exists('platform_tile')) {
      const g = scene.make.graphics({ add: false });

      // Base verde hierba
      g.fillStyle(0x3ddc84); g.fillRect(0,  0, 32, 8);
      // Cuerpo tierra
      g.fillStyle(0x8b5e3c); g.fillRect(0,  8, 32, 8);
      // Brillo superior
      g.fillStyle(0x5af5a0); g.fillRect(0,  0, 32, 2);
      // Pixel detail superior
      g.fillStyle(0x2ab866);
      for (let i = 0; i < 32; i += 8) {
        g.fillRect(i + 2, 2, 4, 4);
      }
      // Sombra tierra
      g.fillStyle(0x6b4020); g.fillRect(0, 14, 32, 2);
      // Textura tierra
      g.fillStyle(0x7a4e2d);
      for (let i = 4; i < 32; i += 10) {
        g.fillRect(i, 9, 3, 3);
      }

      g.generateTexture('platform_tile', 32, 16);
      g.destroy();
    }

    // ── Tile de plataforma de piedra (32×16) ──────────────
    if (!scene.textures.exists('platform_stone')) {
      const g = scene.make.graphics({ add: false });

      g.fillStyle(0x8899aa); g.fillRect(0, 0, 32, 16);
      g.fillStyle(0xaabbcc); g.fillRect(0, 0, 32, 3);
      g.fillStyle(0x6677aa); g.fillRect(0, 13, 32, 3);
      // Grietas
      g.fillStyle(0x445566);
      g.fillRect(8, 5, 1, 6);
      g.fillRect(20, 3, 1, 8);
      // Brillo
      g.fillStyle(0xccddee); g.fillRect(2, 1, 4, 1);

      g.generateTexture('platform_stone', 32, 16);
      g.destroy();
    }

    // ── Tile de plataforma móvil (dorada) (32×12) ─────────
    if (!scene.textures.exists('platform_moving')) {
      const g = scene.make.graphics({ add: false });

      g.fillStyle(0xc8820a); g.fillRect(0, 0, 32, 12);
      g.fillStyle(0xf7c948); g.fillRect(0, 0, 32, 4);
      g.fillStyle(0xffd700); g.fillRect(0, 0, 32, 2);
      g.fillStyle(0x8b5800); g.fillRect(0, 10, 32, 2);
      // Tachuelas decorativas
      g.fillStyle(0xfff0a0);
      for (let i = 4; i < 32; i += 10) {
        g.fillRect(i, 5, 3, 3);
      }
      // Flechas indicadoras
      g.fillStyle(0x1a1a2e);
      g.fillTriangle(3, 6, 7, 4, 7, 8);

      g.generateTexture('platform_moving', 32, 12);
      g.destroy();
    }
  }

  // ─────────────────────────────────────────────────────────
  //  CREACIÓN DE PLATAFORMAS
  // ─────────────────────────────────────────────────────────

  /**
   * Plataforma estática compuesta de tiles.
   * @param {number} x        – Borde izquierdo
   * @param {number} y        – Posición Y
   * @param {number} width    – Ancho total en píxeles
   * @param {string} [type]   – 'grass' | 'stone'
   * @returns {Phaser.GameObjects.Image[]}
   */
  createStatic(x, y, width, type = 'grass') {
    const texKey = type === 'stone' ? 'platform_stone' : 'platform_tile';
    const tileW  = 32;
    const count  = Math.max(1, Math.floor(width / tileW));
    const created = [];

    for (let i = 0; i < count; i++) {
      const tile = this.staticGroup.create(
        x + i * tileW + tileW / 2,
        y,
        texKey
      );
      tile.refreshBody();
      tile.setDepth(5);
      created.push(tile);
    }
    return created;
  }

  /**
   * Plataforma móvil que oscila entre dos puntos.
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {Object} opts
   * @param {number}  opts.range  – Distancia de desplazamiento (px)
   * @param {number}  opts.speed  – px/s
   * @param {string}  opts.axis   – 'x' | 'y'
   */
  createMoving(x, y, width, { range = 100, speed = 60, axis = 'x' } = {}) {
    const tileW = 32;
    const count = Math.max(1, Math.floor(width / tileW));

    // Contenedor vacío para mover todos los tiles juntos
    const sprites = [];

    for (let i = 0; i < count; i++) {
      const tile = this.movingGroup.create(
        x + i * tileW + tileW / 2,
        y,
        'platform_moving'
      );
      tile.setImmovable(true);
      tile.setDepth(5);
      tile.body.allowGravity = false;
      sprites.push(tile);
    }

    // Guardamos metadata para el update
    this.movingPlatforms.push({
      sprites,
      originX:   x + (count * tileW) / 2,
      originY:   y,
      range,
      speed,
      axis,
      phase:     Math.random() * Math.PI * 2  // fase aleatoria para variedad
    });

    return sprites;
  }

  // ─────────────────────────────────────────────────────────
  //  UPDATE (plataformas móviles)
  // ─────────────────────────────────────────────────────────

  /** @param {number} time – scene.time.now */
  update(time) {
    for (const mp of this.movingPlatforms) {
      const t       = time * 0.001;
      const offset  = Math.sin(t * mp.speed * 0.03 + mp.phase) * mp.range;
      const tileW   = 32;
      const count   = mp.sprites.length;

      for (let i = 0; i < count; i++) {
        const baseX = mp.originX - (count * tileW) / 2 + i * tileW + tileW / 2;
        const baseY = mp.originY;

        const newX  = mp.axis === 'x' ? baseX + offset : baseX;
        const newY  = mp.axis === 'y' ? baseY + offset : baseY;

        // Usamos MoveToXY para que la física actualice velocidad
        // (necesario para que el jugador se mueva con la plataforma)
        mp.sprites[i].body.reset(newX, newY);
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  //  COLISORES (deben configurarse en la escena)
  // ─────────────────────────────────────────────────────────

  /**
   * Añade colisores entre el jugador y las plataformas.
   * @param {Phaser.Physics.Arcade.Sprite} playerSprite
   */
  addColliders(playerSprite) {
    this.scene.physics.add.collider(playerSprite, this.staticGroup);
    this.scene.physics.add.collider(playerSprite, this.movingGroup);
  }

  /**
   * Añade colisores entre un grupo de enemigos y las plataformas.
   * @param {Phaser.GameObjects.Group} enemyGroup
   */
  addEnemyColliders(enemyGroup) {
    this.scene.physics.add.collider(enemyGroup, this.staticGroup);
    this.scene.physics.add.collider(enemyGroup, this.movingGroup);
  }

  /**
   * Rellena visualmente con tiles de piedra desde groundY+1 tile
   * hasta el límite inferior del mundo, eliminando el hueco vacío.
   * Los tiles se añaden al staticGroup → hereda todos los colisionadores.
   * @param {number} groundY – Y del tile de suelo superior (centro del tile)
   */
  fillGroundBottom(groundY) {
    const bounds = this.scene.physics.world.bounds;
    const tileW  = 32;
    const tileH  = 16;
    const cols   = Math.ceil(bounds.width / tileW);

    // Primera fila debajo del suelo principal hasta un tile más allá del mundo
    for (let row = 1; groundY + row * tileH <= bounds.height + tileH; row++) {
      const y = groundY + row * tileH;
      for (let col = 0; col < cols; col++) {
        const tile = this.staticGroup.create(col * tileW + tileW / 2, y, 'platform_stone');
        tile.refreshBody();
        tile.setDepth(5);
      }
    }
  }
}
export default PlatformManager;