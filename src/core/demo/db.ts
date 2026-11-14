import { perfilInicial, type Inscripcion, type Perfil, type Rol, type Usuario } from '../types';

/** "Base de datos" de la demostración: localStorage del navegador. Solo la usan los archivos de core/demo. */
export interface RegistroDemo { id: string; email: string; password: string; rol: Rol; perfil: Perfil; inscripcion: Inscripcion | null }

const K_USERS = 'clein_demo_users';
const K_SESION = 'clein_demo_sesion';
export const K_SIM_CIERRE = 'clein_demo_preinscripcion_cerrada';
/** En la demostración, registrarse con este correo crea una cuenta de administración. */
export const CORREO_ADMIN_DEMO = 'admin@demo.local';

export const leer = <T,>(k: string, defecto: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : defecto; } catch { return defecto; }
};
export const escribir = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

export const usuarios = (): RegistroDemo[] =>
  leer<RegistroDemo[]>(K_USERS, []).map((r) => ({
    ...r, rol: r.rol ?? 'participante', inscripcion: r.inscripcion ?? null,
    perfil: { ...perfilInicial(r.perfil.display_name, r.perfil.country_code), ...r.perfil },
  }));
export const guardarUsuarios = (l: RegistroDemo[]) => escribir(K_USERS, l);
export const buscar = (id: string) => usuarios().find((u) => u.id === id);
export const cambiar = (id: string, f: (r: RegistroDemo) => RegistroDemo) =>
  guardarUsuarios(usuarios().map((u) => (u.id === id ? f(u) : u)));

export const idSesion = (): string => leer<string | null>(K_SESION, null) ?? '';
export const fijarSesion = (id: string | null) => escribir(K_SESION, id);
export const aUsuario = (r: RegistroDemo): Usuario => ({ id: r.id, email: r.email, rol: r.rol });
export const usuarioActual = (): Usuario | null => {
  const r = buscar(idSesion());
  return r ? aUsuario(r) : null;
};
