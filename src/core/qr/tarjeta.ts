import type { Perfil } from '../types';

/** Datos compactos que viajan dentro del QR (sin servidor): nombre, titular y redes. */
export interface TarjetaDatos { n: string; h?: string; l?: string; i?: string; x?: string; g?: string; w?: string }

const HANDLE = /^[A-Za-z0-9._-]{1,40}$/;
const LINKEDIN = /^[A-Za-z0-9\-_%]{1,100}$/;

const limpiarHandle = (v: string): string => {
  const h = v.trim().replace(/^@/, '');
  return HANDLE.test(h) ? h : '';
};
const linkedinDe = (url: string): string => {
  const m = url.match(/linkedin\.com\/in\/([A-Za-z0-9\-_%]{1,100})/i);
  return m ? m[1] : '';
};
const webDe = (url: string): string => url.trim().replace(/^https:\/\//i, '').replace(/\/$/, '');

const enc = (s: string): string => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const dec = (s: string): string => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

export function datosDesdePerfil(p: Perfil): TarjetaDatos {
  const d: TarjetaDatos = { n: p.display_name.slice(0, 60) };
  if (p.headline.trim()) d.h = p.headline.trim().slice(0, 80);
  const l = linkedinDe(p.linkedin_url); if (l) d.l = l;
  const i = limpiarHandle(p.instagram); if (i) d.i = i;
  const x = limpiarHandle(p.x_handle); if (x) d.x = x;
  const g = limpiarHandle(p.github_handle); if (g) d.g = g;
  const w = webDe(p.portfolio_url); if (w) d.w = w;
  return d;
}

/** Variantes de la URL del QR, de la más completa a la más corta (el QR tiene capacidad limitada). */
export function urlsTarjeta(p: Perfil, origen: string): string[] {
  const full = datosDesdePerfil(p);
  const sinTitular: TarjetaDatos = { ...full }; delete sinTitular.h;
  const sinWeb: TarjetaDatos = { ...sinTitular }; delete sinWeb.w;
  const minimo: TarjetaDatos = { n: full.n, ...(full.l ? { l: full.l } : {}) };
  return [full, sinTitular, sinWeb, minimo].map((d) => `${origen}/tarjeta#${enc(JSON.stringify(d))}`);
}

export interface EnlaceTarjeta { etiqueta: string; url: string }
export interface TarjetaVista { nombre: string; titular: string; enlaces: EnlaceTarjeta[] }

/** Decodifica y valida lo que viene en el QR; construye las URL solo desde datos saneados. */
export function leerTarjeta(hash: string): TarjetaVista | null {
  try {
    const raw = JSON.parse(dec(hash.replace(/^#/, ''))) as Record<string, unknown>;
    const s = (k: string, max: number) => (typeof raw[k] === 'string' ? (raw[k] as string).slice(0, max) : '');
    const nombre = s('n', 60);
    if (!nombre) return null;
    const enlaces: EnlaceTarjeta[] = [];
    const l = s('l', 100); if (LINKEDIN.test(l)) enlaces.push({ etiqueta: 'LinkedIn', url: `https://www.linkedin.com/in/${l}` });
    const i = s('i', 40); if (HANDLE.test(i)) enlaces.push({ etiqueta: 'Instagram', url: `https://www.instagram.com/${i}` });
    const x = s('x', 40); if (HANDLE.test(x)) enlaces.push({ etiqueta: 'X', url: `https://x.com/${x}` });
    const g = s('g', 40); if (HANDLE.test(g)) enlaces.push({ etiqueta: 'GitHub', url: `https://github.com/${g}` });
    const w = s('w', 150);
    if (w) {
      try {
        const u = new URL(`https://${w}`);
        if (u.protocol === 'https:' && u.hostname.includes('.')) enlaces.push({ etiqueta: 'Portafolio', url: u.toString() });
      } catch { /* ignora */ }
    }
    return { nombre, titular: s('h', 80), enlaces };
  } catch {
    return null;
  }
}
