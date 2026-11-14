import type { Modulo } from '../../shell/tipos';
import AuthPage from './AuthPage';
import NuevaClavePage from './NuevaClavePage';

export const modulo: Modulo = {
  id: 'auth',
  rutas: [
    { path: '/cuenta', element: <AuthPage />, acceso: 'publico' },
    { path: '/cuenta/nueva-clave', element: <NuevaClavePage />, acceso: 'sesion' },
  ],
};
