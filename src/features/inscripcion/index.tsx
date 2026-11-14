import type { Modulo } from '../../shell/tipos';
import InscripcionPage from './InscripcionPage';

export const modulo: Modulo = {
  id: 'inscripcion',
  rutas: [{ path: '/inscripcion', element: <InscripcionPage />, acceso: 'publico', area: 'conSesion' }],
  menu: [{ label: 'Mi inscripción', to: '/inscripcion', orden: 4 }],
};
