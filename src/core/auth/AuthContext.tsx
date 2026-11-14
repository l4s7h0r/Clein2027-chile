/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from '../api';
import type { Api } from '../apiTypes';
import type { Usuario } from '../types';

interface AuthValue { user: Usuario | null; cargando: boolean; demo: boolean; api: Api }

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let vigente = true;
    api.auth.sesion().then((u) => { if (vigente) { setUser(u); setCargando(false); } });
    const baja = api.auth.alCambiar(setUser);
    return () => { vigente = false; baja(); };
  }, []);

  const value = useMemo<AuthValue>(() => ({ user, cargando, demo: api.demo, api }), [user, cargando]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return v;
}
