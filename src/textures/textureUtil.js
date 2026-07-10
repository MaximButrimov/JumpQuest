// ══════════════════════════════════════════════════════════════
//  Utilidad compartida por los módulos de textura.
//  Encapsula el patrón "graphics → generateTexture → destroy" y el
//  guardado idempotente (no regenera si la textura ya existe), evitando
//  duplicar ese boilerplate en cada módulo.
// ══════════════════════════════════════════════════════════════

/**
 * Crea una textura procedural en la caché de la escena (si no existe).
 * @param {Phaser.Scene} scene
 * @param {string} key                       clave de la textura
 * @param {number} w                         ancho
 * @param {number} h                         alto
 * @param {(g:Phaser.GameObjects.Graphics)=>void} draw  rutina de dibujo
 */
export function defineTexture(scene, key, w, h, draw) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ add: false });
    draw(g);
    g.generateTexture(key, w, h);
    g.destroy();
}
