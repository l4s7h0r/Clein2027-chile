import { useState, type FormEvent } from 'react';
import { PAISES } from '../../core/geo';
import type { Perfil } from '../../core/types';
import { usePerfil } from './usePerfil';
import '../../core/ui/ui.css';

export default function DatosPage() {
  const { perfil, setPerfil, estado, guardar } = usePerfil();
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [guardando, setGuardando] = useState(false);

  if (estado === 'cargando') return <section className="cuenta-card"><p>Cargando…</p></section>;
  if (estado === 'error' || !perfil) return <section className="cuenta-card"><p>No pudimos cargar tu perfil.</p></section>;

  const set = <K extends keyof Perfil>(k: K, v: Perfil[K]) => setPerfil({ ...perfil, [k]: v });

  async function enviar(e: FormEvent) {
    e.preventDefault();
    if (!perfil) return;
    const t = (s: string) => s.trim();
    setGuardando(true); setMensaje(null);
    const err = await guardar({
      ...perfil,
      display_name: t(perfil.display_name), university_name: t(perfil.university_name), career: t(perfil.career),
      headline: t(perfil.headline), bio: t(perfil.bio),
    });
    setGuardando(false);
    setMensaje(err ? { tipo: 'error', texto: err } : { tipo: 'ok', texto: 'Datos guardados.' });
  }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Datos personales</h1>
      <form onSubmit={enviar} className="cuenta-form">
        <label>Nombre público<input value={perfil.display_name} onChange={(e) => set('display_name', e.target.value)} required maxLength={80} /></label>
        <label>Titular (ej. Estudiante de Ingeniería Civil Industrial)<input value={perfil.headline} onChange={(e) => set('headline', e.target.value)} maxLength={80} /></label>
        <div className="cuenta-fila">
          <label>País
            <select value={perfil.country_code} onChange={(e) => set('country_code', e.target.value)}>
              {PAISES.map((p) => <option key={p.code} value={p.code}>{p.flag} {p.name}</option>)}
            </select>
          </label>
          <label>Universidad<input value={perfil.university_name} onChange={(e) => set('university_name', e.target.value)} maxLength={140} /></label>
        </div>
        <label>Carrera<input value={perfil.career} onChange={(e) => set('career', e.target.value)} maxLength={140} /></label>
        <label>Sobre mí<textarea value={perfil.bio} onChange={(e) => set('bio', e.target.value)} maxLength={450} rows={4} /></label>
        <label className="cuenta-check">
          <input type="checkbox" checked={perfil.is_public} onChange={(e) => set('is_public', e.target.checked)} />
          Mostrar mi tarjeta en la red de participantes (otros miembros con sesión iniciada podrán verla).
        </label>
        {mensaje && <p className={mensaje.tipo === 'ok' ? 'cuenta-aviso' : 'cuenta-error'} role="status">{mensaje.texto}</p>}
        <button className="btn btn-accent" type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
      </form>
    </section>
  );
}
