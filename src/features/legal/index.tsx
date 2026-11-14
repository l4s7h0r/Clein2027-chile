import type { Modulo } from '../../shell/tipos';
import PrivacidadPage from './PrivacidadPage';

export const modulo: Modulo = {
  id: 'legal',
  rutas: [{ path: '/privacidad', element: <PrivacidadPage />, acceso: 'publico' }],
};
