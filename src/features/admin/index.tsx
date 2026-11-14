import type { Modulo } from '../../shell/tipos';
import AdminPage from './AdminPage';

export const modulo: Modulo = {
  id: 'admin',
  rutas: [{ path: '/admin', element: <AdminPage />, acceso: 'admin', area: 'si' }],
  menu: [{ label: 'Administración', to: '/admin', orden: 6, rol: 'admin' }],
};
