// ══════════════════════════════════════════════════════════════
//  Mecánica: PUENTES SUSPENDIDOS TEMPORIZADOS
//
//  Módulo autónomo y reutilizable. Encapsula toda la lógica de los puentes
//  que se rompen al pisarlos: creación de tablones, temporizador (mecha),
//  fase de rotura, derrumbe y reconstrucción. No depende de ningún nivel
//  concreto: se instancia con la escena y se alimenta con las definiciones
//  de `data.bridges`.
//
//  Uso desde un nivel / escena:
//     const bridges = new BridgeSystem(scene);
//     bridges.build(data.bridges);                       // crea los puentes
//     bridges.addColliders(playerSprite, enemyGroup);    // colisiones
//     // al reaparecer el jugador:
//     bridges.reset();
//
//  Definición de cada puente (data.bridges):
//     { x, y, width, fuse?, breakTime? }
//       · fuse      – ms sobre el puente antes de empezar a romperse (def. 1400)
//       · breakTime – ms de "rotura" antes del derrumbe total (def. 350)
//
//  Requisitos de texturas: 'bridge_plank' y 'broken_pillar' (StructureTextures).
// ══════════════════════════════════════════════════════════════

export default class BridgeSystem {
    constructor(scene) {
        this.scene   = scene;
        this.bridges = [];
    }

    /**
     * Crea los puentes a partir de sus definiciones.
     * @param {Array<{x:number,y:number,width:number,fuse?:number,breakTime?:number}>} defs
     * @returns {BridgeSystem} this (encadenable)
     */
    build(defs) {
        const scene = this.scene;

        (defs || []).forEach(def => {
            const group  = scene.physics.add.staticGroup();
            const bridge = { def, group, tiles: [], debris: [], triggered: false, collapsed: false, tween: null, timers: [] };

            // Pilares rotos en los extremos (decorativos, apoyados en el suelo)
            scene.add.image(def.x,             def.y + 2, 'broken_pillar').setOrigin(0.5, 1).setDepth(4);
            scene.add.image(def.x + def.width, def.y + 2, 'broken_pillar').setOrigin(0.5, 1).setDepth(4);

            // Cuerda superior decorativa
            const rope = scene.add.graphics().setDepth(4);
            rope.lineStyle(2, 0x3a2614, 1);
            rope.lineBetween(def.x, def.y - 20, def.x + def.width, def.y - 20);

            this._populate(bridge);
            this.bridges.push(bridge);
        });

        return this;
    }

    /**
     * Añade las colisiones: al pisar un puente arranca su temporizador; los
     * enemigos también se apoyan en los tablones (y caen al derrumbarse).
     * @param {Phaser.Physics.Arcade.Sprite} playerSprite
     * @param {Phaser.GameObjects.Group} [enemyGroup]
     */
    addColliders(playerSprite, enemyGroup = null) {
        this.bridges.forEach(bridge => {
            this.scene.physics.add.collider(playerSprite, bridge.group, () => this.trigger(bridge));
            if (enemyGroup) this.scene.physics.add.collider(enemyGroup, bridge.group);
        });
    }

    /** Arranca el temporizador de un puente (al pisarlo). */
    trigger(bridge) {
        if (bridge.triggered || bridge.collapsed) return;
        bridge.triggered = true;
        const scene = this.scene;

        // Temblor de aviso suave mientras corre la mecha
        bridge.tween = scene.tweens.add({
            targets: bridge.tiles, y: '+=1.5', duration: 70, yoyo: true, repeat: -1
        });

        const fuse = bridge.def.fuse ?? 1400;
        bridge.timers.push(scene.time.delayedCall(fuse, () => this._break(bridge)));
    }

    /** Fase de rotura: temblor fuerte antes del derrumbe. */
    _break(bridge) {
        if (bridge.collapsed) return;
        const scene = this.scene;

        if (bridge.tween) bridge.tween.stop();
        bridge.tween = scene.tweens.add({
            targets: bridge.tiles, y: '+=3', duration: 45, yoyo: true, repeat: -1
        });
        if (scene.sound.get('sfx_hit')) scene.sound.play('sfx_hit', { volume: 0.25, detune: -500 });

        const breakTime = bridge.def.breakTime ?? 350;
        bridge.timers.push(scene.time.delayedCall(breakTime, () => this._collapse(bridge)));
    }

    /** Derrumbe: los tablones dejan de colisionar y caen al vacío. */
    _collapse(bridge) {
        if (bridge.collapsed) return;
        bridge.collapsed = true;
        const scene = this.scene;

        if (bridge.tween) { bridge.tween.stop(); bridge.tween = null; }

        const tiles = bridge.tiles;
        bridge.tiles = [];
        tiles.forEach((t, i) => {
            // Deja de colisionar de inmediato → quien esté encima cae
            bridge.group.remove(t);
            scene.physics.world.disable(t);
            bridge.debris.push(t);
            t.setDepth(4);
            scene.tweens.add({
                targets: t, y: t.y + 460, angle: Phaser.Math.Between(-140, 140), alpha: 0,
                delay: i * 25, duration: 650, ease: 'Quad.easeIn',
                onComplete: () => t.destroy()
            });
        });
        if (scene.sound.get('sfx_hit')) scene.sound.play('sfx_hit', { volume: 0.45, detune: -750 });
    }

    /** Reconstruye todos los puentes (p. ej. al reaparecer el jugador). */
    reset() {
        this.bridges.forEach(bridge => {
            bridge.timers.forEach(t => t.remove(false));
            bridge.timers = [];
            if (bridge.tween) { bridge.tween.stop(); bridge.tween = null; }
            bridge.group.clear(true, true);              // destruye tablones activos
            bridge.debris.forEach(d => { this.scene.tweens.killTweensOf(d); if (d.active) d.destroy(); });
            bridge.debris = [];
            bridge.tiles = [];
            bridge.triggered = false;
            bridge.collapsed = false;
            this._populate(bridge);
        });
    }

    /** Crea (o recrea) los tablones de un puente dentro de su grupo. */
    _populate(bridge) {
        const { x, y, width } = bridge.def;
        const tileW = 24;
        const count = Math.max(1, Math.round(width / tileW));
        bridge.tiles = [];
        for (let i = 0; i < count; i++) {
            const t = bridge.group.create(x + i * tileW + tileW / 2, y, 'bridge_plank');
            t.refreshBody();
            t.setDepth(5);
            bridge.tiles.push(t);
        }
    }
}
