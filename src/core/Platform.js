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
  // Mapeo tipo de superficie (dato del nivel) → clave de textura procedimental.
  // Centralizado para que la superficie del suelo y su relleno inferior
  // compartan la misma temática:  forest→grass · cave/ruins→stone · snow→ice.
  static SURFACE_TEX = { stone: 'platform_stone', ice: 'platform_ice', grass: 'platform_tile' };

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
   * Rellena visualmente el hueco entre la superficie del suelo y el límite
   * inferior del mundo. La textura del relleno se toma de CADA tramo de suelo
   * (`segment.texture`), de modo que el sub-suelo hereda la temática del nivel
   * (forest→grass · cave/ruins→stone · snow→ice) en lugar de ser siempre piedra.
   * Si se pasan `segments`, SOLO rellena bajo ellos (deja vacíos los agujeros
   * mortales); sin `segments` rellena todo el ancho con piedra (respaldo clásico).
   * @param {number} groundY – Y del tile de suelo superior (centro del tile)
   * @param {Array<{x:number,width:number,texture?:string}>} [segments] – tramos de suelo sólido
   */
  fillGroundBottom(groundY, segments = null) {
    const bounds = this.scene.physics.world.bounds;
    const tileW  = 32;
    const tileH  = 16;

    // Rellena una columna vertical de tiles bajo un tramo, tileando desde
    // `leftX` igual que createStatic → las filas inferiores quedan alineadas
    // con la fila superior del suelo (sin píxeles desalineados).
    const fillUnder = (leftX, count, texKey) => {
      for (let row = 1; groundY + row * tileH <= bounds.height + tileH; row++) {
        const y = groundY + row * tileH;
        for (let i = 0; i < count; i++) {
          const tile = this.staticGroup.create(leftX + i * tileW + tileW / 2, y, texKey);
          tile.refreshBody();
          tile.setDepth(5);
        }
      }
    };

    if (segments) {
      // Bajo cada tramo real, con SU textura → deja el vacío bajo los agujeros
      for (const s of segments) {
        const texKey = PlatformManager.SURFACE_TEX[s.texture] || 'platform_tile';
        fillUnder(s.x, Math.max(1, Math.floor(s.width / tileW)), texKey);
      }
    } else {
      // Todo el ancho, piedra (comportamiento clásico de respaldo)
      fillUnder(0, Math.ceil(bounds.width / tileW), 'platform_stone');
    }
  }
}
export default PlatformManager;