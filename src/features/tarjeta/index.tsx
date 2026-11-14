import type { Modulo } from '../../shell/tipos';
import TarjetaPage from './TarjetaPage';

export const modulo: Modulo = {
  id: 'tarjeta',
  rutas: [{ path: '/tarjeta', element: <TarjetaPage />, acceso: 'publico' }],
};
