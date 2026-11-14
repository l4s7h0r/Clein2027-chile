import { apiDemo } from './demo';
import type { Api } from './apiTypes';

/** Único punto donde se elige el backend. Al conectar Supabase, se cambia aquí (ver supabase/pendiente). */
export const api: Api = apiDemo;
