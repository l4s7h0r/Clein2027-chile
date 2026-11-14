import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import type { Perfil } from '../../core/types';

/** Carga y guarda el perfil de la persona con sesión. Lo comparten las pantallas del módulo perfil. */
export function usePerfil() {
  const { user, api } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');

  const recargar = useCallback(async () => {
    if (!user) return;
    const p = await api.perfil.cargar(user.id);
    if (!p) { setEstado('error'); return; }
    setPerfil(p); setEstado('listo');
  }, [user, api]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
  useEffect(() => { void recargar(); }, [recargar]);

  /** Guarda y devuelve un mensaje de error, o null si salió bien. */
  const guardar = useCallback(async (nuevo: Perfil): Promise<string | null> => {
    if (!user) return 'Sesión no válida.';
    const err = await api.perfil.guardar(user.id, nuevo);
    if (!err) setPerfil(nuevo);
    return err;
  }, [user, api]);

  return { user, api, perfil, setPerfil, estado, recargar, guardar };
}
