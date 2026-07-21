// ══════════════════════════════════════════════════════════════
//  Mecánica: INVERSIÓN DE CONTROLES  (desacoplada y reutilizable)
//
//  Esta mecánica NO sabe QUÉ la dispara. Cualquier evento del juego puede
//  invertir/restaurar los controles llamando a toggle()/set() sin tocar esta
//  implementación:  el salto de un jefe, un temporizador, una zona del mapa,
//  un ataque, un objeto, una habilidad, etc. El disparador (p. ej. el salto
//  del jefe en la sala del jefe) vive FUERA, en quien la usa.
//
//  El Player consulta el estado (`inverted`) para intercambiar izquierda↔derecha.
// ══════════════════════════════════════════════════════════════

export default class ControlInversion {
    constructor(inverted = false) {
        this.inverted = !!inverted;
        this._listeners = [];
    }

    /** Alterna el estado. Devuelve el nuevo valor. */
    toggle() { return this.set(!this.inverted); }

    /** Fija el estado y notifica a los suscriptores. Devuelve el nuevo valor. */
    set(value) {
        this.inverted = !!value;
        for (const fn of this._listeners) fn(this.inverted);
        return this.inverted;
    }

    /** Restaura los controles normales. */
    reset() { return this.set(false); }

    /** Suscribe un callback (p. ej. feedback visual) al cambio de estado. */
    onChange(fn) { this._listeners.push(fn); return this; }

    /**
     * Aplica la inversión a un par de inputs horizontales.
     * @returns {[boolean, boolean]} [left, right] (intercambiados si está invertido)
     */
    apply(left, right) { return this.inverted ? [right, left] : [left, right]; }
}
