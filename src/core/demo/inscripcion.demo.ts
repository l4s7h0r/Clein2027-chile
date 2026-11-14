import type { InscripcionApi } from '../apiTypes';
import { regionDe } from '../geo';
import { PREINSCRIPCION_HASTA } from '../tarifas';
import type { Categoria, Inscripcion } from '../types';
import { K_SIM_CIERRE, buscar, cambiar, leer } from './db';

export const preinscripcionAbierta = (ahora: number = Date.now()): boolean =>
  !leer<boolean>(K_SIM_CIERRE, false) && ahora <= PREINSCRIPCION_HASTA.getTime();

export function crearInscripcionDemo(): InscripcionApi {
  return {
    preinscripcionAbierta: () => preinscripcionAbierta(),
    async mia(id) { return buscar(id)?.inscripcion ?? null; },
    async inscribir(id, estado) {
      const r = buscar(id);
      if (!r) return 'Sesión no válida.';
      if (r.inscripcion) return 'Ya tienes una inscripción.';
      const categoria: Categoria = r.perfil.account_type === 'professional' ? 'professional' : 'student';
      if (categoria === 'professional' && r.perfil.pro_status !== 'approved') return 'Tu cuenta de profesional aún no está aprobada.';
      const abierta = preinscripcionAbierta();
      if (estado === 'preinscrito' && !abierta) return 'La preinscripción ya cerró.';
      const ins: Inscripcion = {
        estado, categoria, descuento: estado === 'preinscrito' && abierta,
        pais: r.perfil.country_code, region: regionDe(r.perfil.country_code), creada: new Date().toISOString(),
      };
      cambiar(id, (u) => ({ ...u, inscripcion: ins }));
      return null;
    },
    async confirmar(id) {
      if (!buscar(id)?.inscripcion) return 'No tienes una preinscripción.';
      // El descuento se mantiene: quedó fijado al preinscribirse.
      cambiar(id, (u) => ({ ...u, inscripcion: u.inscripcion && { ...u.inscripcion, estado: 'inscrito' } }));
      return null;
    },
    async pagar(id, metodo) {
      const ins = buscar(id)?.inscripcion;
      if (!ins) return 'No tienes una inscripción.';
      if (ins.estado === 'pagado') return 'Tu inscripción ya está pagada.';
      if (metodo === 'webpay' && ins.pais !== 'CL') return 'Webpay solo está disponible para Chile.';
      cambiar(id, (u) => ({ ...u, inscripcion: u.inscripcion && { ...u.inscripcion, estado: 'pagado' } }));
      return null;
    },
    async cancelar(id) { cambiar(id, (u) => ({ ...u, inscripcion: null })); return null; },
  };
}
