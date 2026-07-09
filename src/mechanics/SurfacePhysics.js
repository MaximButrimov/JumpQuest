// ══════════════════════════════════════════════════════════════
//  Mecánica: FÍSICA DE MOVIMIENTO POR SUPERFICIE (deslizamiento)
//
//  Define, en un único lugar, cómo se comporta el movimiento en suelo según
//  el TIPO de superficie que pisa el jugador. Es la "regla" de la mecánica;
//  el Player solo la consulta y la aplica (sin lógica específica de superficie),
//  y PlatformManager detecta la superficie bajo los pies. Así:
//    · Añadir un material nuevo (barro, arena, hielo negro...) = añadir una
//      entrada aquí + su textura en PlatformManager. Nada más.
//    · Ningún nivel ni el controlador del jugador contienen lógica de hielo.
//
//  Campos por superficie:
//    · accel → aceleración horizontal en suelo (px/s²)
//    · drag  → fricción al soltar el mando (px/s²); baja = sigue deslizando
// ══════════════════════════════════════════════════════════════

export const SURFACE_PHYSICS = {
    normal: { accel: 900, drag: 800 },   // agarre normal: frena rápido
    ice:    { accel: 320, drag: 80  },   // hielo: cuesta arrancar/girar y desliza
};

/**
 * Devuelve los parámetros de física para una superficie dada.
 * Si la superficie no existe, cae a 'normal'.
 * @param {string} surface
 * @returns {{accel:number, drag:number}}
 */
export function surfacePhysics(surface) {
    return SURFACE_PHYSICS[surface] || SURFACE_PHYSICS.normal;
}

export default SURFACE_PHYSICS;
