import BackgroundSystem from "../systems/BackgroundSystem.js";
import { buildAllTextures } from "../textures/index.js";
import BridgeSystem from "../mechanics/BridgeSystem.js";

export default class Level {
    // ─────────────────────────────────────────────────────────
    //  DISPERSIÓN DE SUPERFICIE (config por TEMA de nivel)
    // ─────────────────────────────────────────────────────────
    // Cada bioma declara sobre qué texturas de terreno siembra y qué "matas"
    // reparte en el borde superior de esas plataformas. Indexado por tema (no
    // por textura) para que un mismo terreno (p. ej. 'stone') disperse cosas
    // distintas según el bioma. 100% visual: sin física ni colisiones.
    // Añadir un bioma = añadir una entrada aquí (sin tocar la lógica).
    static SCATTER = {
        // Bosque: matas de hierba con alguna flor/seta sobre el césped.
        forest: {
            textures: ['grass'], seed: 'forest-foliage', step: [28, 46], scale: [0.85, 1.15], depth: 6,
            pick: (rnd) => {
                const roll = rnd.frac();
                if (roll < 0.09) return rnd.pick(['flower_red', 'flower_yellow']);
                if (roll < 0.14) return 'mushroom_pair';
                return 'grass_tuft';
            },
        },
        // Cueva: musgo con motas, algún hongo luminoso y cristal sobre la roca.
        cave: {
            textures: ['stone'], seed: 'cave-scatter', step: [40, 74], scale: [0.7, 1.05], depth: 6,
            pick: (rnd) => {
                const roll = rnd.frac();
                if (roll < 0.12) return 'glow_mushroom';
                if (roll < 0.22) return 'cave_crystal';
                return 'moss_patch';
            },
        },
        // Ruinas: escombros, chatarra y hierba seca sobre la piedra árida.
        ruins: {
            textures: ['stone'], seed: 'ruins-scatter', step: [46, 90], scale: [0.7, 1.1], depth: 6,
            pick: (rnd) => {
                const roll = rnd.frac();
                if (roll < 0.14) return 'dry_tuft';
                if (roll < 0.24) return 'scrap_bit';
                return 'rubble_bit';
            },
        },
        // Nieve: matas de nieve con alguna esquirla de hielo sobre hielo y piedra.
        snow: {
            textures: ['ice', 'stone'], seed: 'snow-scatter', step: [38, 72], scale: [0.7, 1.05], depth: 6,
            pick: (rnd) => {
                const roll = rnd.frac();
                if (roll < 0.16) return 'ice_bit';
                return 'snow_tuft';
            },
        },
        // Volcán: roca chamuscada con alguna brasa sobre la roca volcánica.
        volcano: {
            textures: ['volcanic'], seed: 'volcano-scatter', step: [42, 80], scale: [0.7, 1.05], depth: 6,
            pick: (rnd) => {
                const roll = rnd.frac();
                if (roll < 0.16) return 'ember_bit';
                return 'char_rock';
            },
        },
    };

    constructor(scene, platformManager, data) {
        this.scene = scene;
        this.platformManager = platformManager;
        this.data = data;

        this.coins   = null;
        this.stars   = null;   // estrellas de poder
        this.enemies = null;
        this.portal  = null;
        this.lava    = null;   // zonas de lava letal (grupo de overlap)

        // Sistemas
        this.backgroundSystem = new BackgroundSystem(scene);

        this._init();
    }

    _init() {
        // 1. Visuals globales — el fondo depende del tema del nivel
        this.backgroundSystem.build(this.data.theme || 'forest');
        buildAllTextures(this.scene);   // módulos de textura (src/textures/)

        // 2. Construcción del nivel (depende de data)
        this._buildGround();             // suelo como bloques sólidos (por nivel)
        this._buildPlatforms();          // plataformas elevadas y móviles
        this._buildSurfaceScatter();     // matas en bordes de plataforma según bioma (solo visual)
        // Mecánica de puentes: módulo independiente (mechanics/BridgeSystem.js)
        this.bridgeSystem = new BridgeSystem(this.scene).build(this.data.bridges);
        this._buildDecorations();
        this._buildCollectibles();
        this._buildEnemies();
        this._buildLava();          // zonas de lava letal (data.lava)
        this._buildPortal();
    }

    // ─────────────────────────────
    // DISPERSIÓN DE BORDES (solo visual)
    // ─────────────────────────────
    // Siembra matas sobre el borde superior de cada plataforma según su tipo
    // de terreno (ver Level.SCATTER). Genérico y reutilizable por cualquier
    // bioma. 100% decorativo: no crea cuerpos de física ni altera colisiones.
    _buildSurfaceScatter() {
        const cfg = Level.SCATTER[this.data.theme];
        if (!cfg) return;   // bioma sin dispersión definida

        const scene = this.scene;

        // Fuente: tramos de suelo (como pseudo-plataformas) + plataformas elevadas.
        // El suelo va primero, para que el borde del suelo se siembre igual que antes.
        const gd = this.data.ground;
        const groundSurfaces = gd
            ? gd.segments.map(s => ({ x: s.x, width: s.width, y: gd.y ?? 752, texture: gd.texture }))
            : [];
        const all = groundSurfaces.concat(this.data.platforms || []);

        const surfaces = all.filter(p => cfg.textures.includes(p.texture));
        const rnd = new Phaser.Math.RandomDataGenerator([cfg.seed]);

        for (const p of surfaces) {
            const top = p.y - 8;   // superficie del tile (16px, centrado en p.y)
            for (let x = p.x + 8; x < p.x + p.width - 6; x += rnd.between(cfg.step[0], cfg.step[1])) {
                const img = scene.add.image(x, top + 2, cfg.pick(rnd))
                    .setOrigin(0.5, 1).setDepth(cfg.depth)
                    .setScale(rnd.realInRange(cfg.scale[0], cfg.scale[1]));
                if (rnd.frac() < 0.5) img.setFlipX(true);
            }
        }
    }

    // ─────────────────────────────
    // SUELO (bloques sólidos, por nivel)
    // ─────────────────────────────
    // El suelo se declara aparte de las plataformas en data.ground:
    //   { texture: 'grass'|'stone'|'ice', y?: 752, segments: [{x, width}, …] }
    // Cada tramo se construye como un bloque macizo (ver PlatformManager.createGround).
    // Los espacios entre tramos son agujeros mortales.
    _buildGround() {
        const gd = this.data.ground;
        if (!gd) return;   // nivel sin suelo definido
        this.platformManager.createGround(gd.segments, gd.texture, gd.y ?? 752);
    }

    // ─────────────────────────────
    // PLATAFORMAS (elevadas y móviles)
    // ─────────────────────────────
    _buildPlatforms() {
        const pm = this.platformManager;

        if (!this.data) throw new Error('[Level] Falta "data". ¿Pasaste Level1Data al constructor?');

        (this.data.platforms || []).forEach(p => {
            pm.createStatic(p.x, p.y, p.width, p.texture);
        });

        const theme = this.data.theme;
        (this.data.movingPlatforms || []).forEach(p => {
            pm.createMoving(p.x, p.y, p.width, p.config, theme);
        });
    }

    // ─────────────────────────────
    // DECORACIONES (data-driven)
    // ─────────────────────────────
    // Cada nivel declara sus propias decoraciones en data.decorations como
    // una lista de descriptores. Defaults pensados para adornos sobre el suelo:
    //   { texture, x, y=GROUND_Y, originX=0.5, originY=1, depth=4,
    //     flipX?, scale?, alpha?, tint? }
    // Para adornos colgados del techo usa y: 0, originY: 0 (ej. estalactitas).
    // Extras opcionales: blendMode ('ADD' para glow) y pulse (latido de luz).
    _buildDecorations() {
        const scene   = this.scene;
        const GROUND_Y = 744;   // superficie del suelo (tile de 16px centrado en 752)

        const decorations = this.data.decorations || [];
        for (const d of decorations) {
            const img = scene.add.image(d.x, d.y ?? GROUND_Y, d.texture)
                .setOrigin(d.originX ?? 0.5, d.originY ?? 1)
                .setDepth(d.depth ?? 4);

            if (d.flipX)          img.setFlipX(true);
            if (d.scale != null)  img.setScale(d.scale);
            if (d.alpha != null)  img.setAlpha(d.alpha);
            if (d.tint != null)   img.setTint(d.tint);
            if (d.blendMode)      img.setBlendMode(Phaser.BlendModes[d.blendMode] ?? d.blendMode);

            // Latido suave para elementos luminosos (cristales, hongos).
            if (d.pulse) {
                scene.tweens.add({
                    targets:  img,
                    alpha:    (d.alpha ?? 1) * 0.55,
                    duration: Phaser.Math.Between(1600, 2800),
                    yoyo:     true,
                    repeat:   -1,
                    delay:    Phaser.Math.Between(0, 1500),
                    ease:     'Sine.easeInOut'
                });
            }
        }
    }

    // ─────────────────────────────
    // COLECCIONABLES
    // ─────────────────────────────
    _buildCollectibles() {
        const scene = this.scene;

        // ── Monedas ──────────────────────────────────────
        this.coins = scene.physics.add.staticGroup();

        this.data.coins.forEach(([x, y]) => {
            const coin = this.coins.create(x, y, 'coin').setDepth(6);

            // Flotación con timing aleatorio para que no vayan al unísono
            scene.tweens.add({
                targets:  coin,
                y:        y - 8,
                duration: Phaser.Math.Between(700, 1200),
                yoyo:     true,
                repeat:   -1,
                ease:     'Sine.easeInOut',
                delay:    Phaser.Math.Between(0, 600)
            });

            // Giro (efecto "coin flip" comprimiendo scaleX)
            scene.tweens.add({
                targets:  coin,
                scaleX:   0.1,
                duration: 800,
                yoyo:     true,
                repeat:   -1,
                delay:    Phaser.Math.Between(0, 800)
            });
        });

        // ── Estrellas de poder (con validación de posición) ──
        this.stars = scene.physics.add.staticGroup();

        // Posiciones a evitar: todas las monedas + estrellas ya colocadas
        const avoid = (this.data.coins || []).map(([x, y]) => ({ x, y }));

        for (const [sx, sy] of (this.data.stars || [])) {
            const pos = this._findValidStarPosition(sx, sy, avoid);
            if (!pos) continue; // ninguna posición válida → se descarta la estrella

            const star = this.stars.create(pos.x, pos.y, 'powerstar').setDepth(6);
            avoid.push({ x: pos.x, y: pos.y }); // las siguientes estrellas también la evitan

            scene.tweens.add({
                targets: star, angle: 360,
                duration: 2000, repeat: -1, ease: 'Linear'
            });
            scene.tweens.add({
                targets: star, y: pos.y - 12,
                duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }
    }

    // ─────────────────────────────
    // VALIDACIÓN DE POSICIÓN DE ESTRELLAS
    // ─────────────────────────────
    // Reglas:
    //   1. Nunca detrás del portal de salida (deben cogerse antes de terminar).
    //   2. Distancia mínima a cualquier moneda/estrella (sin solaparse ni pegarse).
    // Si la posición propuesta no cumple, se busca una válida cercana en espiral;
    // si no se encuentra ninguna, se devuelve null (la estrella se descarta).
    _findValidStarPosition(x, y, avoid) {
        const MIN_DIST       = 44;  // px centro a centro con otros coleccionables
        const PORTAL_MARGIN  = 48;  // px por delante del portal (lado de aproximación)

        const worldW = this.scene.physics.world.bounds.width;
        const maxX   = (this.data.exit ? this.data.exit.x : worldW) - PORTAL_MARGIN;

        const clampX = (px) => Phaser.Math.Clamp(px, 40, Math.min(maxX, worldW - 40));
        const clampY = (py) => Phaser.Math.Clamp(py, 60, 700);
        const farFromAll = (px, py) =>
            avoid.every(c => Phaser.Math.Distance.Between(px, py, c.x, c.y) >= MIN_DIST);

        // 1) Posición original, ya restringida al límite del portal
        let cx = clampX(x), cy = clampY(y);
        if (farFromAll(cx, cy)) return { x: cx, y: cy };

        // 2) Búsqueda en espiral (radios crecientes, varios ángulos)
        for (let r = 24; r <= 180; r += 16) {
            for (let a = 0; a < 360; a += 30) {
                const rad = Phaser.Math.DegToRad(a);
                const px  = clampX(x + Math.cos(rad) * r);
                const py  = clampY(y + Math.sin(rad) * r);
                if (px <= maxX && farFromAll(px, py)) return { x: px, y: py };
            }
        }
        return null; // sin posición válida
    }

    // ─────────────────────────────
    // ENEMIGOS
    // ─────────────────────────────
    _buildEnemies() {
        const scene = this.scene;

        this.enemies = scene.physics.add.group({
            allowGravity:       true,
            bounceX:            1,
            collideWorldBounds: true
        });

        this.data.enemies.forEach(e => {
            if      (e.type === 'bat')      this._createBat(e);
            else if (e.type === 'skeleton') this._createSkeleton(e);
            else                            this._createSlime(e);
        });

        this.platformManager.addEnemyColliders(this.enemies);
    }

    _createSlime(e) {
        const scene = this.scene;
        const slime = this.enemies.create(e.x, e.y, 'enemy_slime').setDepth(7);
        slime.setVelocityX(e.speed);
        slime.setCollideWorldBounds(true);
        slime.setBounceX(1);

        // Hitbox ajustada: textura 32×28 → body 22×16 alineado con el pie visual
        slime.body.setSize(22, 16);
        slime.body.setOffset(5, 12);

        // Gravedad propia (la global del mundo es 0)
        slime.body.setGravityY(700);

        slime.isBat = false;

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

    _createBat(e) {
        const scene = this.scene;
        const bat = this.enemies.create(e.x, e.y, 'enemy_bat').setDepth(7);
        bat.setVelocityX(e.speed);
        bat.setCollideWorldBounds(true);
        bat.setBounceX(1);

        // Hitbox compacta centrada en el cuerpo del murciélago (textura 28×18)
        bat.body.setSize(18, 10);
        bat.body.setOffset(5, 4);

        // Sin gravedad: flota
        bat.body.setAllowGravity(false);

        bat.isBat          = true;
        bat.floatOriginY   = e.y;
        bat.floatPhase     = Phaser.Math.FloatBetween(0, Math.PI * 2);
        bat.floatSpeed     = e.floatSpeed    || 2.5;
        bat.floatAmplitude = e.floatAmplitude || 38;

        // Aleteo animado
        scene.tweens.add({
            targets:  bat,
            scaleY:   0.65,
            scaleX:   1.2,
            duration: 180,
            yoyo:     true,
            repeat:   -1,
            ease:     'Sine.easeInOut',
            delay:    Phaser.Math.Between(0, 180)
        });
    }

    // Esqueleto en llamas: camina como el slime (gravedad + rebote en paredes),
    // con textura de hueso ardiente y un aura de fuego que lo sigue.
    _createSkeleton(e) {
        const scene = this.scene;
        const skel = this.enemies.create(e.x, e.y, 'enemy_skeleton').setDepth(7);
        skel.setVelocityX(e.speed);
        skel.setCollideWorldBounds(true);
        skel.setBounceX(1);

        // Hitbox ajustada al esqueleto (textura 26×34)
        skel.body.setSize(14, 22);
        skel.body.setOffset(6, 10);
        skel.body.setGravityY(700);   // gravedad propia (la global es 0)
        skel.isBat = false;

        // Aura de fuego que sigue al esqueleto (partículas ADD)
        if (!scene.textures.exists('skel_fire_px')) {
            const g = scene.make.graphics({ add: false });
            g.fillStyle(0xffffff); g.fillCircle(3, 3, 3);
            g.generateTexture('skel_fire_px', 6, 6);
            g.destroy();
        }
        const fire = scene.add.particles(e.x, e.y, 'skel_fire_px', {
            speed:    { min: 8, max: 34 },
            angle:    { min: 240, max: 300 },
            scale:    { start: 0.9, end: 0 },
            lifespan: 480,
            frequency: 55,
            alpha:    { min: 0.35, max: 0.75 },
            tint:     [0xff6a20, 0xffb020, 0xff5a1e],
            blendMode: 'ADD',
        });
        fire.setDepth(7).startFollow(skel, 0, -4);
        skel.fireEmitter = fire;   // GameScene lo destruye al morir el enemigo

        // Parpadeo de llama
        scene.tweens.add({
            targets:  skel,
            scaleY:   1.08, scaleX: 0.94,
            duration: 300, yoyo: true, repeat: -1,
            ease:     'Sine.easeInOut', delay: Phaser.Math.Between(0, 300)
        });
    }

    // ─────────────────────────────
    // LAVA LETAL (zonas de muerte instantánea)
    // ─────────────────────────────
    // Data-driven y desacoplado: data.lava = [{ x, y, width, height }]. Crea
    // cuerpos estáticos invisibles; el overlap con el jugador (en GameScene)
    // dispara player.instantDeath(). El grupo existe siempre (vacío si no hay
    // lava) para que la escena pueda solaparlo sin comprobaciones.
    _buildLava() {
        this.lava = this.scene.physics.add.staticGroup();
        const zones = this.data.lava || [];
        if (zones.length === 0) return;

        if (!this.scene.textures.exists('hazard_px')) {
            const g = this.scene.make.graphics({ add: false });
            g.fillStyle(0xffffff); g.fillRect(0, 0, 1, 1);
            g.generateTexture('hazard_px', 1, 1);
            g.destroy();
        }

        for (const z of zones) {
            const body = this.lava.create(z.x, z.y, 'hazard_px')
                .setOrigin(0, 0).setVisible(false);
            body.setDisplaySize(z.width, z.height);
            body.refreshBody();
        }
    }

    // ─────────────────────────────
    // PORTAL
    // ─────────────────────────────
    _buildPortal() {
        const scene = this.scene;

        this.portal = scene.add.image(
            this.data.exit.x,
            this.data.exit.y,
            'portal'
        ).setDepth(6);

        // Puerta del jefe: el visual es la decoración `boss_gate`; el portal azul
        // queda invisible y solo actúa de disparador (checkPortal → BossScene).
        if (this.data.exit && this.data.exit.boss) {
            this.portal.setVisible(false);
            return;
        }

        // Pulso
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

        // Partículas del portal (requiere 'glow_px' generada en StructureTextures)
        this.portalEmitter = scene.add.particles(
            this.data.exit.x, this.data.exit.y,
            'glow_px',
            {
                speed:     { min: 10, max: 50 },
                angle:     { min: 0,  max: 360 },
                scale:     { start: 0.8, end: 0 },
                lifespan:  800,
                quantity:  1,
                frequency: 80,
                tint:      [0x39d0ff, 0x7af5ff, 0xffffff],
                blendMode: 'ADD'
            }
        );
        this.portalEmitter.setDepth(7);
    }

    // ─────────────────────────────
    // UPDATE
    // ─────────────────────────────
    update(time) {
        this.enemies.getChildren().forEach(enemy => {
            if (enemy.isBat) {
                // Flotación sinusoidal en Y
                const targetY = enemy.floatOriginY +
                    Math.sin(time * 0.001 * enemy.floatSpeed + enemy.floatPhase) * enemy.floatAmplitude;
                // Mover hacia el objetivo vía velocidad (no altera la velocidad X)
                enemy.body.setVelocityY((targetY - enemy.y) * 10);
            }

            // Rebote horizontal (sirve tanto para slimes como murciélagos)
            if (enemy.body.blocked.left) {
                enemy.setVelocityX(Math.abs(enemy.body.velocity.x));
                enemy.setFlipX(false);
            }
            if (enemy.body.blocked.right) {
                enemy.setVelocityX(-Math.abs(enemy.body.velocity.x));
                enemy.setFlipX(true);
            }
        });
    }

    // ─────────────────────────────
    // CHECK PORTAL
    // ─────────────────────────────
    checkPortal(px, py) {
        return Phaser.Math.Distance.Between(
            px, py,
            this.portal.x, this.portal.y
        ) < 60;
    }
}