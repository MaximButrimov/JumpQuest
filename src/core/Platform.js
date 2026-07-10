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

    PlatformManager.buildTextures(this.scene);
    this.movingPlatforms = []; // {sprite, config, origin}
  }

  // ─────────────────────────────────────────────────────────
  //  TEXTURAS PROCEDURALES
  // ─────────────────────────────────────────────────────────

  /**
   * Genera las texturas de plataforma en la caché de la escena. Estático →
   * reutilizable desde cualquier escena (p. ej. el menú) sin instanciar el
   * manager ni sus grupos de física.
   */
  static buildTextures(scene) {
    // ── Tile de césped sobre tierra (32×16) ────────────────
    if (!scene.textures.exists('platform_tile')) {
      const g = scene.make.graphics({ add: false });

      // Cuerpo de tierra
      g.fillStyle(0x7a5230); g.fillRect(0, 0, 32, 16);
      g.fillStyle(0x5f3f22); g.fillRect(0, 11, 32, 5);          // tierra baja (sombra)
      g.fillStyle(0x8a5f38); g.fillRect(0, 7, 32, 2);           // luz bajo el césped
      // Guijarros / motas de tierra
      g.fillStyle(0x9a7048); g.fillRect(4, 11, 3, 2); g.fillRect(16, 12, 2, 2); g.fillRect(25, 11, 3, 2);
      g.fillStyle(0x4a3018); g.fillRect(10, 13, 2, 1); g.fillRect(21, 13, 2, 1);
      // Franja de césped con borde inferior irregular (tileable cada 8px)
      g.fillStyle(0x3fa24f); g.fillRect(0, 0, 32, 6);
      for (let i = 0; i < 32; i += 8) g.fillRect(i, 6, 4, 2);   // dientes hacia la tierra
      // Brillo y briznas del césped
      g.fillStyle(0x5fc76a); g.fillRect(0, 0, 32, 2);
      g.fillStyle(0x2f7d3f);
      for (let i = 2; i < 32; i += 6) g.fillRect(i, 0, 1, 3);   // briznas oscuras

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

    // ── Tile de hielo (32×16) — superficie deslizante ─────
    if (!scene.textures.exists('platform_ice')) {
      const g = scene.make.graphics({ add: false });

      g.fillStyle(0x9ad8ee); g.fillRect(0, 0, 32, 16);       // cuerpo de hielo
      g.fillStyle(0xd6f2ff); g.fillRect(0, 0, 32, 4);        // brillo superior
      g.fillStyle(0x6fb2d0); g.fillRect(0, 13, 32, 3);       // sombra inferior
      // Reflejos / brillos glaseados
      g.fillStyle(0xffffff, 0.75); g.fillRect(3, 1, 9, 1);
      g.fillStyle(0xffffff, 0.4);  g.fillRect(18, 2, 7, 1);
      // Grietas sutiles del hielo
      g.fillStyle(0x8ac6de);
      g.fillRect(11, 5, 1, 7);
      g.fillRect(23, 4, 1, 8);
      g.fillRect(6, 9, 4, 1);

      g.generateTexture('platform_ice', 32, 16);
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
   * @param {string} [type]   – 'grass' | 'stone' | 'ice'
   * @returns {Phaser.GameObjects.Image[]}
   */
  createStatic(x, y, width, type = 'grass') {
    const TEX = { stone: 'platform_stone', ice: 'platform_ice', grass: 'platform_tile' };
    const texKey  = TEX[type] || 'platform_tile';
    // Tipo de superficie para la física (fricción). 'ice' → deslizante.
    const surface = (type === 'ice') ? 'ice' : 'normal';
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
      tile.surface = surface;   // consultado por la detección de superficie
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
   *
   * Si se pasa `onSurface`, se invoca cada frame con el tipo de superficie
   * ('ice' | 'normal') del tile sobre el que está apoyado el jugador. Esto
   * mantiene la detección de superficie genérica y reutilizable: cualquier
   * nivel con plataformas de hielo activa el deslizamiento sin código propio.
   *
   * @param {Phaser.Physics.Arcade.Sprite} playerSprite
   * @param {(surface:string)=>void} [onSurface]
   */
  addColliders(playerSprite, onSurface = null) {
    const detect = (sprite, tile) => {
      // El tile está bajo los pies del jugador (no es una pared lateral)
      if (tile.body && tile.body.top >= sprite.body.bottom - 6) {
        onSurface(tile.surface || 'normal');
      }
    };
    const cb = onSurface ? detect : undefined;

    this.scene.physics.add.collider(playerSprite, this.staticGroup, cb);
    this.scene.physics.add.collider(playerSprite, this.movingGroup, cb);
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
   * Rellena visualmente con tiles de piedra desde groundY+1 tile hasta el
   * límite inferior del mundo. Si se pasan `segments` (los tramos de suelo),
   * SOLO rellena bajo ellos, dejando vacíos los huecos/agujeros del nivel.
   * Sin `segments` rellena todo el ancho (comportamiento clásico).
   * @param {number} groundY – Y del tile de suelo superior (centro del tile)
   * @param {Array<{x:number,width:number}>} [segments] – tramos de suelo sólido
   */
  fillGroundBottom(groundY, segments = null) {
    const bounds = this.scene.physics.world.bounds;
    const tileW  = 32;
    const tileH  = 16;

    // Rellena una columna vertical de tiles bajo un tramo, tileando desde
    // `leftX` igual que createStatic → las filas inferiores quedan alineadas
    // con la fila superior del suelo (sin píxeles desalineados).
    const fillUnder = (leftX, count) => {
      for (let row = 1; groundY + row * tileH <= bounds.height + tileH; row++) {
        const y = groundY + row * tileH;
        for (let i = 0; i < count; i++) {
          const tile = this.staticGroup.create(leftX + i * tileW + tileW / 2, y, 'platform_stone');
          tile.refreshBody();
          tile.setDepth(5);
        }
      }
    };

    if (segments) {
      // Solo bajo los tramos reales → deja el vacío bajo los agujeros
      for (const s of segments) fillUnder(s.x, Math.max(1, Math.floor(s.width / tileW)));
    } else {
      // Todo el ancho (comportamiento clásico)
      fillUnder(0, Math.ceil(bounds.width / tileW));
    }
  }
}
export default PlatformManager;