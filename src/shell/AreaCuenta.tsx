import type { ReactNode } from 'react';
import { Link, useLocation } from '../core/router';
import { useAuth } from '../core/auth/AuthContext';
import type { ItemMenu } from './tipos';

/** Marco con menú lateral. El menú lo arma el registro con lo que declara cada módulo. */
export default function AreaCuenta({ items, children }: { items: ItemMenu[]; children: ReactNode }) {
  const { user, api } = useAuth();
  const { pathname } = useLocation();
  const visibles = items.filter((i) => !i.rol || i.rol === user?.rol).sort((a, b) => a.orden - b.orden);

  return (
    <div className="area">
      <aside className="area-menu" aria-label="Menú de mi cuenta">
        <p className="area-usuario">{user?.email}</p>
        <nav>
          <ul>
            {visibles.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className={pathname === i.to ? 'activo' : ''} aria-current={pathname === i.to ? 'page' : undefined}>{i.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <button type="button" className="area-salir" onClick={() => api.auth.salir()}>Cerrar sesión</button>
      </aside>
      <div className="area-contenido">{children}</div>
    </div>
  );
}
