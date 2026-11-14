import { useMemo, useState, type FormEvent } from 'react';
import QrCard from '../../core/qr/QrCard';
import { urlsTarjeta } from '../../core/qr/tarjeta';
import type { Perfil } from '../../core/types';
import { usePerfil } from './usePerfil';
import '../../core/ui/ui.css';

const esUrlHttps = (v: string) => v === '' || /^https:\/\/\S+$/i.test(v);
const esHandle = (v: string) => v === '' || /^@?[A-Za-z0-9._-]{1,40}$/.test(v.trim());

export default function RedesPage() {
  const { perfil, setPerfil, estado, guardar } = usePerfil();
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);
  const opcionesQr = useMemo(() => (perfil ? urlsTarjeta(perfil, window.location.origin) : []), [perfil]);

  if (estado === 'cargando') return <section className="cuenta-card"><p>Cargando…</p></section>;
  if (estado === 'error' || !perfil) return <section className="cuenta-card"><p>No pudimos cargar tu perfil.</p></section>;

  const set = <K extends keyof Perfil>(k: K, v: Perfil[K]) => setPerfil({ ...perfil, [k]: v });

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!perfil) return;
    for (const u of [perfil.linkedin_url, perfil.portfolio_url, perfil.cv_url]) {
      if (!esUrlHttps(u.trim())) { setMensaje({ tipo: 'error', texto: 'Los enlaces deben comenzar con https://' }); return; }
    }
    for (const h of [perfil.instagram, perfil.x_handle, perfil.github_handle]) {
      if (!esHandle(h)) { setMensaje({ tipo: 'error', texto: 'Los usuarios de redes solo pueden tener letras, números, punto, guion y guion bajo.' }); return; }
    }
    const t = (s: string) => s.trim();
    const quitarArroba = (s: string) => t(s).replace(/^@/, '');
    setGuardando(true); setMensaje(null);
    const err = await guardar({
      ...perfil,
      linkedin_url: t(perfil.linkedin_url), portfolio_url: t(perfil.portfolio_url), cv_url: t(perfil.cv_url),
      instagram: quitarArroba(perfil.instagram), x_handle: quitarArroba(perfil.x_handle), github_handle: quitarArroba(perfil.github_handle),
    });
    setGuardando(false);
    setMensaje(err ? { tipo: 'error', texto: err } : { tipo: 'ok', texto: 'Redes guardadas. Tu QR se actualizó.' });
  }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Redes y QR</h1>
      <form onSubmit={enviar} className="cuenta-form">
        <label>LinkedIn<input type="url" placeholder="https://www.linkedin.com/in/…" value={perfil.linkedin_url} onChange={(e) => set('linkedin_url', e.target.value)} /></label>
        <div className="cuenta-fila">
          <label>Instagram<input placeholder="@usuario" value={perfil.instagram} onChange={(e) => set('instagram', e.target.value)} maxLength={41} /></label>
          <label>X (Twitter)<input placeholder="@usuario" value={perfil.x_handle} onChange={(e) => set('x_handle', e.target.value)} maxLength={41} /></label>
        </div>
        <label>GitHub<input placeholder="@usuario" value={perfil.github_handle} onChange={(e) => set('github_handle', e.target.value)} maxLength={41} /></label>
        <label>Portafolio o sitio web<input type="url" placeholder="https://…" value={perfil.portfolio_url} onChange={(e) => set('portfolio_url', e.target.value)} /></label>
        <label>Enlace a tu CV<input type="url" placeholder="https://…" value={perfil.cv_url} onChange={(e) => set('cv_url', e.target.value)} /></label>
        {mensaje && <p className={mensaje.tipo === 'ok' ? 'cuenta-aviso' : 'cuenta-error'} role="status">{mensaje.texto}</p>}
        <button className="btn btn-accent" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar redes'}</button>
      </form>

      <div className="cuenta-bloque cuenta-qr">
        <h2>Mi QR</h2>
        <p className="cuenta-sub">Quien lo escanee verá tu nombre y tus redes. Guarda los cambios para actualizarlo.</p>
        <QrCard opciones={opcionesQr} />
      </div>
    </section>
  );
}
