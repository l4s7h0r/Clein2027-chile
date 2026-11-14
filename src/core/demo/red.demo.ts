import type { RedApi } from '../apiTypes';
import { escribir, leer, usuarios } from './db';

const K_SIGUE = 'clein_demo_sigue';
type Mapa = Record<string, string[]>;

export function crearRedDemo(): RedApi {
  return {
    async directorio(yo) {
      return usuarios()
        .filter((u) => u.id !== yo && u.perfil.is_public)
        .map((u) => ({
          id: u.id, display_name: u.perfil.display_name, headline: u.perfil.headline, country_code: u.perfil.country_code,
          university_name: u.perfil.university_name, career: u.perfil.career, avatar_url: u.perfil.avatar_url,
          es_profesional: u.perfil.account_type === 'professional' && u.perfil.pro_status === 'approved',
          linkedin_url: u.perfil.linkedin_url, instagram: u.perfil.instagram, x_handle: u.perfil.x_handle,
          github_handle: u.perfil.github_handle, portfolio_url: u.perfil.portfolio_url,
        }));
    },
    async siguiendo(yo) { return leer<Mapa>(K_SIGUE, {})[yo] ?? []; },
    async seguir(yo, otro) {
      const m = leer<Mapa>(K_SIGUE, {});
      m[yo] = [...new Set([...(m[yo] ?? []), otro])];
      escribir(K_SIGUE, m);
      return null;
    },
    async dejarDeSeguir(yo, otro) {
      const m = leer<Mapa>(K_SIGUE, {});
      m[yo] = (m[yo] ?? []).filter((x) => x !== otro);
      escribir(K_SIGUE, m);
      return null;
    },
  };
}
