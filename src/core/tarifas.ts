import { etapaActual } from './precios';
import type { Categoria } from './types';

/**
 * Fechas de inscripción. Los precios viven en `precios.ts` (propuesta presentada).
 * La preinscripción termina el día anterior a la primera etapa.
 */
export const PRECIOS_DE_EJEMPLO = true;
export const DESCUENTO_PREINSCRIPCION = 0.1;
export const PREINSCRIPCION_HASTA = new Date('2027-02-28T23:59:59-03:00');

export type Moneda = 'USD';

export const aplicarDescuento = (monto: number, conDescuento: boolean): number =>
  conDescuento ? Math.round(monto * (1 - DESCUENTO_PREINSCRIPCION)) : monto;

/** Precio presencial de la etapa vigente según categoría y descuento. */
export function precioDe(_pais: string, cat: Categoria, descuento: boolean) {
  const base = etapaActual().presencial[cat];
  return { base, final: aplicarDescuento(base, descuento), moneda: 'USD' as Moneda };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const formatoMoneda = (monto: number, _moneda: Moneda = 'USD'): string =>
  `US$ ${monto.toLocaleString('es-CL')}`;

export const fechaLarga = (d: Date): string =>
  d.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Santiago' });
