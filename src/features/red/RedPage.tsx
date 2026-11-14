import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import { PAISES, nombrePais, regionDe } from '../../core/geo';
import type { TarjetaRed } from '../../core/types';
import '../../core/ui/ui.css';

const enlaces = (t: TarjetaRed): { etiqueta: string; url: string }[] => {
  const l: { etiqueta: string; url: string }[] = [];
  if (/^https:\/\/\S+$/i.test(t.linkedin_url)) l.push({ etiqueta: 'LinkedIn', url: t.linkedin_url });
  if (/^[A-Za-z0-9._-]{1,40}$/.test(t.instagram)) l.push({ etiqueta: 'Instagram', url: `https://www.instagram.com/${t.instagram}` });
  if (/^[A-Za-z0-9._-]{1,40}$/.test(t.x_handle)) l.push({ etiqueta: 'X', url: `https://x.com/${t.x_handle}` });
  if (/^[A-Za-z0-9._-]{1,40}$/.test(t.github_handle)) l.push({ etiqueta: 'GitHub', url: `https://github.com/${t.github_handle}` });
  if (/^https:\/\/\S+$/i.test(t.portfolio_url)) l.push({ etiqueta: 'Portafolio', url: t.portfolio_url });
  return l;
};

export default function RedPage() {
  const { user, api } = useAuth();
  const [personas, setPersonas] = useState<TarjetaRed[] | null>(null);
  const [sigo, setSigo] = useState<string[]>([]);
  const [texto, setTexto] = useState('');
  const [region, setRegion] = useState('');
  const [pais, setPais] = useState('');
  const [soloSigo, setSoloSigo] = useState(false);

  useEffect(() => {
    if (!user) return;
    void api.red.directorio(user.id).then(setPersonas);
    void api.red.siguiendo(user.id).then(setSigo);
  }, [user, api]);

  const regiones = useMemo(() => [...new Set(PAISES.map((p) => p.region))], []);
  const paisesFiltro = PAISES.filter((p) => !region || p.region === region);

  const visibles = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return (personas ?? []).filter((p) =>
      (!region || regionDe(p.country_code) === region) &&
      (!pais || p.country_code === pais) &&
      (!soloSigo || sigo.includes(p.id)) &&
      (!q || [p.display_name, p.university_name, p.career, p.headline].some((v) => v.toLowerCase().includes(q))));
  }, [personas, texto, region, pais, soloSigo, sigo]);

  if (!user) return null;

  async function alternar(id: string) {
    if (!user) return;
    if (sigo.includes(id)) await api.red.dejarDeSeguir(user.id, id); else await api.red.seguir(user.id, id);
    setSigo(await api.red.siguiendo(user.id));
  }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Red de participantes</h1>
      <p className="cuenta-sub">Personas que activaron su tarjeta. Tú apareces aquí solo si lo activas en «Datos personales».</p>

      <div className="red-filtros">
        <input placeholder="Buscar por nombre, universidad o carrera" value={texto} onChange={(e) => setTexto(e.target.value)} aria-label="Buscar" />
        <select value={region} onChange={(e) => { setRegion(e.target.value); setPais(''); }} aria-label="Región">
          <option value="">Todas las regiones</option>
          {regiones.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={pais} onChange={(e) => setPais(e.target.value)} aria-label="País">
          <option value="">Todos los países</option>
          {paisesFiltro.map((p) => <option key={p.code} value={p.code}>{p.flag} {p.name}</option>)}
        </select>
        <label className="cuenta-check"><input type="checkbox" checked={soloSigo} onChange={(e) => setSoloSigo(e.target.checked)} /> Solo a quienes sigo</label>
      </div>

      {personas === null && <p>Cargando…</p>}
      {personas !== null && visibles.length === 0 && <p className="cuenta-sub">No hay personas con esos filtros todavía.</p>}

      <ul className="red-lista">
        {visibles.map((p) => {
          const iniciales = p.display_name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
          const sigue = sigo.includes(p.id);
          return (
            <li key={p.id} className="red-tarjeta">
              <div className="cuenta-avatar red-avatar" aria-hidden="true">
                {p.avatar_url ? <img src={p.avatar_url} alt="" /> : <span>{iniciales}</span>}
              </div>
              <div className="red-datos">
                <strong>{p.display_name}</strong>{p.es_profesional && <span className="cuenta-chip cuenta-chip-approved">Profesional</span>}
                <p className="cuenta-sub">{p.headline || p.career}</p>
                <p className="cuenta-sub">{nombrePais(p.country_code)} · {regionDe(p.country_code)}{p.university_name ? ` · ${p.university_name}` : ''}</p>
                <div className="red-enlaces">
                  {enlaces(p).map((e) => <a key={e.etiqueta} href={e.url} target="_blank" rel="noopener noreferrer" className="cuenta-enlace">{e.etiqueta}</a>)}
                </div>
              </div>
              <button type="button" className={sigue ? 'btn cuenta-btn-sec' : 'btn btn-accent'} onClick={() => alternar(p.id)}>{sigue ? 'Siguiendo' : '+ Seguir'}</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
