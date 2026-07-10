// ══════════════════════════════════════════════════════════════
//  Registro de módulos de textura.
//
//  Cada categoría de recursos gráficos vive en su propio módulo
//  (`src/textures/*Textures.js`) y expone `static build(scene)`.
//  Este índice los agrupa para:
//    · construir TODO de una vez con `buildAllTextures(scene)`, y
//    · re-exportar cada módulo para importarlo suelto donde haga falta:
//        import { VegetationTextures } from '../textures/index.js';
//        VegetationTextures.build(scene);
//
//  Añadir una categoría nueva = crear su módulo y sumarlo a la lista.
//  No hay que tocar nada más de la arquitectura.
// ══════════════════════════════════════════════════════════════

import TerrainTextures     from './TerrainTextures.js';
import CollectibleTextures from './CollectibleTextures.js';
import EnemyTextures       from './EnemyTextures.js';
import StructureTextures   from './StructureTextures.js';
import VegetationTextures  from './VegetationTextures.js';
import CaveTextures        from './CaveTextures.js';
import SnowTextures        from './SnowTextures.js';

/** Todos los módulos de textura, en orden de construcción. */
export const TEXTURE_MODULES = [
    TerrainTextures,
    CollectibleTextures,
    EnemyTextures,
    StructureTextures,
    VegetationTextures,
    CaveTextures,
    SnowTextures,
];

/** Construye todas las texturas del juego (idempotente). */
export function buildAllTextures(scene) {
    for (const mod of TEXTURE_MODULES) mod.build(scene);
}

export {
    TerrainTextures,
    CollectibleTextures,
    EnemyTextures,
    StructureTextures,
    VegetationTextures,
    CaveTextures,
    SnowTextures,
};
