import type { ReactNode } from 'react';
import { Navigate } from '../core/router';
import { useAuth } from '../core/auth/AuthContext';
import type { RutaModulo } from './tipos';

/** Protección de rutas en un solo lugar: las páginas no repiten esta lógica. */
export default function Acceso({ nivel, children }: { nivel: RutaModulo['acceso']; children: ReactNode }) {
  const { user, cargando } = useAuth();
  if (nivel === 'publico') return <>{children}</>;
  if (cargando) return <section className="cuenta-card"><p>Cargando…</p></section>;
  if (!user) return <Navigate to="/cuenta" replace />;
  if (nivel === 'admin' && user.rol !== 'admin') {
    return <section className="cuenta-card"><h1>Sin acceso</h1><p>Esta sección es solo para el equipo organizador.</p></section>;
  }
  return <>{children}</>;
}
