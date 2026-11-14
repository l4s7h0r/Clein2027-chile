import type { AuthApi } from '../apiTypes';
import { perfilInicial, type Usuario } from '../types';
import {
  CORREO_ADMIN_DEMO, buscar, cambiar, fijarSesion, guardarUsuarios, idSesion, usuarioActual, usuarios,
  type RegistroDemo,
} from './db';

export function crearAuthDemo(): AuthApi {
  const oyentes = new Set<(u: Usuario | null) => void>();
  const avisar = () => oyentes.forEach((cb) => cb(usuarioActual()));
  const iniciar = (id: string) => { fijarSesion(id); avisar(); };

  return {
    async sesion() { return usuarioActual(); },
    alCambiar(cb) { oyentes.add(cb); return () => { oyentes.delete(cb); }; },
    async entrar(email, password) {
      const r = usuarios().find((u) => u.email === email.toLowerCase() && u.password === password);
      if (!r) return 'Correo o contraseña incorrectos.';
      iniciar(r.id); return null;
    },
    async registrar(email, password, d) {
      const mail = email.toLowerCase();
      if (usuarios().some((u) => u.email === mail)) return { error: 'Ese correo ya tiene una cuenta.', requiereConfirmar: false };
      const reg: RegistroDemo = {
        id: crypto.randomUUID(), email: mail, password,
        rol: mail === CORREO_ADMIN_DEMO ? 'admin' : 'participante',
        perfil: perfilInicial(`${d.nombre.trim()} ${d.apellido.trim()}`.trim(), d.pais, d.tipo),
        inscripcion: null,
      };
      guardarUsuarios([...usuarios(), reg]);
      iniciar(reg.id);
      return { error: null, requiereConfirmar: false };
    },
    async proveedor(p) {
      const mail = `participante.${p === 'google' ? 'google' : 'linkedin'}@demo.local`;
      let r = usuarios().find((u) => u.email === mail);
      if (!r) {
        r = { id: crypto.randomUUID(), email: mail, password: '', rol: 'participante', perfil: perfilInicial('Participante de prueba', 'CL'), inscripcion: null };
        guardarUsuarios([...usuarios(), r]);
      }
      iniciar(r.id); return null;
    },
    async recuperar() { return null; },
    async cambiarClave(password) {
      const id = idSesion();
      if (!buscar(id)) return 'Sesión no válida.';
      cambiar(id, (u) => ({ ...u, password }));
      return null;
    },
    async salir() { fijarSesion(null); avisar(); },
    async borrarCuenta(id) {
      guardarUsuarios(usuarios().filter((u) => u.id !== id));
      fijarSesion(null);
      avisar();
    },
  };
}
