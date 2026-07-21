/**
 * ============================================================
 *  JumpQuest – Platform.js
 *  Gestión de plataformas estáticas y móviles.
 *
 *  Uso:
 *    const platforms = new PlatformManager(scene);
 *    platforms.createStatic(x, y, width);
 *    platforms.createMoving(x, y, width, { range, speed, axis });
 *
 *  Las texturas de terreno viven en textures/TerrainTextures.js.
 * ============================================================
 */

import TerrainTextures from '../textures/TerrainTextures.js';

class PlatformManager {
  // Mapeo tipo de superficie (dato del nivel) → clave de textura de tile.
  // Lo usan las plataformas (createStatic):  grass · stone · ice · volcanic.
  static SURFACE_TEX = { stone: 'platform_stone', ice: 'platform_ice', grass: 'platform_tile', volcanic: 'platform_volcanic' };

  // Mapeo tipo de terreno → textura de BLOQUE de suelo (superficie + cuerpo
  // macizo). Lo usa createGround(). Añadir un bioma = añadir una entrada aquí
  // (y su textura ground_X en TerrainTextures). Totalmente escalable.
  static GROUND_TEX = { grass: 'ground_grass', stone: 'ground_stone', ice: 'ground_ice', volcanic: 'ground_volcanic' };

  // Mapeo TEMA del nivel → textura de plataforma MÓVIL (acorde a cada bioma).
  // Lo usa createMoving(). Fallback a la dorada genérica 'platform_moving'.
  static MOVING_TEX = { forest: 'moving_forest', cave: 'moving_cave', ruins: 'moving_ruins', snow: 'moving_snow', volcano: 'moving_volcano' };

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
   * Genera las texturas de plataforma. Delega en el módulo de terreno
   * (textures/TerrainTextures.js). Estático → reutilizable desde cualquier
   * escena (p. ej. el menú) sin instanciar el manager.
   */
  static buildTextures(scene) {
    TerrainTextures.build(scene);
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
    const texKey  = PlatformManager.SURFACE_TEX[type] || 'platform_tile';
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
   * @param {string}  [theme]     – Tema del nivel (elige la textura, ver MOVING_TEX)
   */
  createMoving(x, y, width, { range = 100, speed = 60, axis = 'x' } = {}, theme = null) {
    const tileW = 32;
    const count = Math.max(1, Math.floor(width / tileW));
    const texKey = PlatformManager.MOVING_TEX[theme] || 'platform_moving';

    // Contenedor vacío para mover todos los tiles juntos
    const sprites = [];

    for (let i = 0; i < count; i++) {
      const tile = this.movingGroup.create(
        x + i * tileW + tileW / 2,
        y,
        texKey
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

  // ─────────────────────────────────────────────────────────
  //  SUELO (bloques sólidos, no sucesión de tiles)
  // ─────────────────────────────────────────────────────────

  /**
   * Construye el SUELO del nivel como BLOQUES sólidos, uno por tramo, en vez de
   * una sucesión de tiles. Cada tramo = 1 TileSprite visual (superficie arriba +
   * cuerpo macizo hacia abajo, sin franjas repetidas) + 1 cuerpo estático de
   * colisión. La textura se atribuye por nivel y es totalmente escalable: basta
   * cambiar `type` (ver GROUND_TEX) para cambiar todo el bloque. Los espacios
   * entre tramos quedan vacíos → agujeros mortales.
   *
   * @param {Array<{x:number,width:number}>} segments – tramos de suelo sólido
   * @param {string} [type]     – 'grass' | 'stone' | 'ice'
   * @param {number} [surfaceY] – Y del centro del tile de superficie (p. ej. 752)
   */
  createGround(segments, type = 'grass', surfaceY = 752) {
    const texKey  = PlatformManager.GROUND_TEX[type] || 'ground_grass';
    // Tipo de superficie para la física (fricción). 'ice' → deslizante.
    const surface = (type === 'ice') ? 'ice' : 'normal';

    const top    = surfaceY - 8;                                  // superficie visible del suelo
    const bottom = this.scene.physics.world.bounds.height + 16;   // hasta pasar el borde del mundo
    const height = bottom - top;

    // Textura 1×1 para los cuerpos de colisión (invisibles: el visual lo pone
    // el TileSprite). Un único cuerpo por tramo en lugar de cientos de tiles.
    if (!this.scene.textures.exists('ground_body_px')) {
      const g = this.scene.make.graphics({ add: false });
      g.fillStyle(0xffffff); g.fillRect(0, 0, 1, 1);
      g.generateTexture('ground_body_px', 1, 1);
      g.destroy();
    }

    for (const seg of segments) {
      // Visual: bloque único tileado (la textura ground_X no repite en vertical
      // dentro de la altura del bloque → superficie arriba, cuerpo macizo abajo).
      this.scene.add.tileSprite(seg.x, top, seg.width, height, texKey)
        .setOrigin(0, 0).setDepth(5);

      // Colisión: un solo cuerpo estático que cubre el tramo.
      const body = this.staticGroup.create(seg.x, top, 'ground_body_px')
        .setOrigin(0, 0).setVisible(false);
      body.setDisplaySize(seg.width, height);
      body.refreshBody();
      body.surface = surface;   // consultado por la detección de superficie (hielo)
    }
  }
}
export default PlatformManager;