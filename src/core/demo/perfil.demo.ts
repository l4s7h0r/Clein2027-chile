import type { PerfilApi } from '../apiTypes';
import { buscar, cambiar } from './db';

export function crearPerfilDemo(): PerfilApi {
  return {
    async cargar(id) { return buscar(id)?.perfil ?? null; },
    async guardar(id, p) {
      // Igual que en el servidor: la persona no puede cambiar su tipo de cuenta ni su estado de aprobación desde aquí.
      cambiar(id, (u) => ({ ...u, perfil: { ...p, account_type: u.perfil.account_type, pro_status: u.perfil.pro_status } }));
      return null;
    },
    async solicitarProfesional(id) {
      cambiar(id, (u) => ({
        ...u,
        perfil: { ...u.perfil, account_type: 'professional', pro_status: u.perfil.pro_status === 'approved' ? 'approved' : 'pending' },
      }));
      return null;
    },
    async volverAEstudiante(id) {
      if (buscar(id)?.inscripcion) return 'Cancela tu inscripción antes de cambiar el tipo de cuenta.';
      cambiar(id, (u) => ({ ...u, perfil: { ...u.perfil, account_type: 'student', pro_status: 'none' } }));
      return null;
    },
    async exportarDatos(id) {
      const r = buscar(id);
      if (!r) return null;
      return { id: r.id, email: r.email, rol: r.rol, perfil: r.perfil, inscripcion: r.inscripcion, exportado: new Date().toISOString() };
    },
  };
}
