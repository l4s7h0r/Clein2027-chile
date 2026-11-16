import type { Modulo } from '../../shell/tipos';
import TurismoPage from './TurismoPage';

export const modulo: Modulo = {
  id: 'turismo',
  rutas: [{ path: '/turismo', element: <TurismoPage />, acceso: 'publico' }],
};
