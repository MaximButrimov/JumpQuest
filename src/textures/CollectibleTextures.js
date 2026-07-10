// ══════════════════════════════════════════════════════════════
//  Módulo de texturas: COLECCIONABLES (moneda, estrella de poder)
// ══════════════════════════════════════════════════════════════

import { defineTexture } from './textureUtil.js';

export default class CollectibleTextures {
    static build(scene) {
        // Moneda
        defineTexture(scene, 'coin', 20, 20, (g) => {
            g.fillStyle(0xf7c948); g.fillCircle(10, 10, 10);
            g.fillStyle(0xffd700); g.fillCircle(10, 8,  7);
            g.fillStyle(0xffec6e); g.fillCircle(7,  6,  3);
            g.fillStyle(0xb8860b); g.fillCircle(10, 10, 2);
            g.fillStyle(0xffffff, 0.4); g.fillEllipse(7, 7, 4, 3);
        });

        // Estrella de poder (dos capas)
        defineTexture(scene, 'powerstar', 28, 28, (g) => {
            const cx = 14, cy = 14, r1 = 14, r2 = 6;
            const pts = [];
            for (let i = 0; i < 10; i++) {
                const angle = (i * Math.PI) / 5 - Math.PI / 2;
                const r     = i % 2 === 0 ? r1 : r2;
                pts.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
            }
            g.fillStyle(0xf7c948); g.fillPoints(pts, true);
            const pts2 = pts.map(p => ({ x: p.x * 0.7 + cx * 0.3, y: p.y * 0.7 + cy * 0.3 }));
            g.fillStyle(0xffd700); g.fillPoints(pts2, true);
        });
    }
}
