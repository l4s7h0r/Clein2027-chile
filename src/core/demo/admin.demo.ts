import type { AdminApi } from '../apiTypes';
import { perfilInicial } from '../types';
import { K_SIM_CIERRE, cambiar, escribir, guardarUsuarios, leer, usuarioActual, usuarios } from './db';

const EJEMPLOS: [string, string, string, string, string, 'student' | 'professional'][] = [
  ['Valentina Rojas', 'CL', 'Universidad de Santiago de Chile', 'Ingeniería Civil Industrial', 'Estudiante de Ingeniería Civil Industrial', 'student'],
  ['Matías Soto', 'CL', 'UTEM', 'Ingeniería en Informática', 'Estudiante e investigador en logística', 'student'],
  ['Camila Herrera', 'PE', 'Pontificia Universidad Católica del Perú', 'Ingeniería Industrial', 'Analista de cadena de suministro', 'professional'],
  ['Diego Fernández', 'AR', 'Universidad de Buenos Aires', 'Ingeniería Electrónica', 'Estudiante de Ingeniería Electrónica', 'student'],
  ['Lucía Gómez', 'CO', 'Universidad Nacional de Colombia', 'Ingeniería Mecánica', 'Ingeniera de procesos', 'professional'],
  ['Andrés Morales', 'MX', 'UNAM', 'Ingeniería en Computación', 'Desarrollador y docente', 'professional'],
  ['Sofía Castillo', 'EC', 'Escuela Politécnica Nacional', 'Ingeniería Química', 'Estudiante de Ingeniería Química', 'student'],
  ['Javier Pérez', 'DO', 'INTEC', 'Ingeniería Industrial', 'Estudiante de último año', 'student'],
];

export function crearAdminDemo(): AdminApi {
  return {
    async listarUsuarios() {
      if (usuarioActual()?.rol !== 'admin') return [];
      return usuarios().map((u) => ({ id: u.id, email: u.email, rol: u.rol, perfil: u.perfil, inscripcion: u.inscripcion }));
    },
    async decidirProfesional(id, aprobar) {
      if (usuarioActual()?.rol !== 'admin') return 'No tienes permisos.';
      cambiar(id, (u) => ({ ...u, perfil: { ...u.perfil, pro_status: aprobar ? 'approved' : 'rejected' } }));
      return null;
    },
    async sembrarEjemplos() {
      if (usuarioActual()?.rol !== 'admin') return 0;
      const existentes = new Set(usuarios().map((u) => u.email));
      const nuevos = EJEMPLOS.map((e, i) => ({ e, mail: `ejemplo${i + 1}@demo.local` })).filter((x) => !existentes.has(x.mail)).map(({ e, mail }) => {
        const perfil = { ...perfilInicial(e[0], e[1], e[5]), university_name: e[2], career: e[3], headline: e[4], is_public: true,
          pro_status: e[5] === 'professional' ? ('approved' as const) : ('none' as const),
          linkedin_url: `https://www.linkedin.com/in/${e[0].toLowerCase().replace(/[^a-z]+/g, '-')}`, instagram: e[0].split(' ')[0].toLowerCase() };
        return { id: crypto.randomUUID(), email: mail, password: '', rol: 'participante' as const, perfil, inscripcion: null };
      });
      guardarUsuarios([...usuarios(), ...nuevos]);
      return nuevos.length;
    },
    cierreSimulado: () => leer<boolean>(K_SIM_CIERRE, false),
    simularCierre(cerrada) { escribir(K_SIM_CIERRE, cerrada); },
  };
}
