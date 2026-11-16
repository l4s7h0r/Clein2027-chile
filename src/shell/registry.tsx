import type { ReactNode } from 'react';
import { useAuth } from '../core/auth/AuthContext';
import ErrorBoundary from '../core/ui/ErrorBoundary';
import { modulo as auth } from '../features/auth';
import { modulo as perfil } from '../features/perfil';
import { modulo as inscripcion } from '../features/inscripcion';
import { modulo as admin } from '../features/admin';
import { modulo as red } from '../features/red';
import { modulo as llegar } from '../features/llegar';
import { modulo as turismo } from '../features/turismo';
import { modulo as tarjeta } from '../features/tarjeta';
import { modulo as legal } from '../features/legal';
import Acceso from './Acceso';
import AreaCuenta from './AreaCuenta';
import type { ItemMenu, Modulo, RutaModulo } from './tipos';

/** Lista de módulos del sitio. Para quitar uno basta con comentar su línea. */
const modulos: Modulo[] = [auth, perfil, red, inscripcion, admin, llegar, turismo, tarjeta, legal];

const menu: ItemMenu[] = modulos.flatMap((m) => m.menu ?? []);

// eslint-disable-next-line react-refresh/only-export-components
function Marco({ ruta, nombre }: { ruta: RutaModulo; nombre: string }) {
  const { user } = useAuth();
  const conArea = ruta.area === 'si' || (ruta.area === 'conSesion' && user !== null);
  const pagina = conArea ? <AreaCuenta items={menu}>{ruta.element}</AreaCuenta> : ruta.element;
  return (
    <main className="cuenta-pagina">
      <ErrorBoundary nombre={nombre}>
        <Acceso nivel={ruta.acceso}>{pagina}</Acceso>
      </ErrorBoundary>
    </main>
  );
}

/** Mapa ruta → página para el router del sitio. */
export function construirRutas(): Record<string, ReactNode> {
  const rutas: Record<string, ReactNode> = {};
  for (const m of modulos) for (const r of m.rutas) rutas[r.path] = <Marco ruta={r} nombre={m.id} />;
  return rutas;
}
