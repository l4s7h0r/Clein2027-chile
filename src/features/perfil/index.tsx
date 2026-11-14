import type { Modulo } from '../../shell/tipos';
import DatosPage from './DatosPage';
import DatosPrivacidadPage from './DatosPrivacidadPage';
import RedesPage from './RedesPage';
import ResumenPage from './ResumenPage';

export const modulo: Modulo = {
  id: 'perfil',
  rutas: [
    { path: '/perfil', element: <ResumenPage />, acceso: 'sesion', area: 'si' },
    { path: '/perfil/datos', element: <DatosPage />, acceso: 'sesion', area: 'si' },
    { path: '/perfil/redes', element: <RedesPage />, acceso: 'sesion', area: 'si' },
    { path: '/perfil/privacidad', element: <DatosPrivacidadPage />, acceso: 'sesion', area: 'si' },
  ],
  menu: [
    { label: 'Resumen', to: '/perfil', orden: 1 },
    { label: 'Datos personales', to: '/perfil/datos', orden: 2 },
    { label: 'Redes y QR', to: '/perfil/redes', orden: 3 },
    { label: 'Privacidad y datos', to: '/perfil/privacidad', orden: 5 },
  ],
};
