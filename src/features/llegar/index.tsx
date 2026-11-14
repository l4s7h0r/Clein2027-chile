import type { Modulo } from '../../shell/tipos';
import LlegarPage from './LlegarPage';

export const modulo: Modulo = {
  id: 'llegar',
  rutas: [{ path: '/como-llegar', element: <LlegarPage />, acceso: 'publico' }],
};
