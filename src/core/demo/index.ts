import type { Api } from '../apiTypes';
import { crearAdminDemo } from './admin.demo';
import { crearAuthDemo } from './auth.demo';
import { crearInscripcionDemo } from './inscripcion.demo';
import { crearPerfilDemo } from './perfil.demo';
import { crearRedDemo } from './red.demo';

export const apiDemo: Api = {
  demo: true,
  auth: crearAuthDemo(),
  perfil: crearPerfilDemo(),
  inscripcion: crearInscripcionDemo(),
  red: crearRedDemo(),
  admin: crearAdminDemo(),
};
