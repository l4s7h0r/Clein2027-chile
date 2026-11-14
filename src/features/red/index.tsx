import type { Modulo } from '../../shell/tipos';
import RedPage from './RedPage';

export const modulo: Modulo = {
  id: 'red',
  rutas: [{ path: '/red', element: <RedPage />, acceso: 'sesion', area: 'si' }],
  menu: [{ label: 'Red de participantes', to: '/red', orden: 3.5 }],
};
