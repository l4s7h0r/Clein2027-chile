import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import AvisoDemo from '../../core/ui/AvisoDemo';
import { nombrePais, regionDe } from '../../core/geo';
import { CATEGORIAS, type UsuarioAdmin } from '../../core/types';
import '../../core/ui/ui.css';

const contar = <T,>(items: T[], clave: (t: T) => string): [string, number][] => {
  const m = new Map<string, number>();
  items.forEach((i) => m.set(clave(i), (m.get(clave(i)) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export default function AdminPage() {
  const { api, demo } = useAuth();
  const [lista, setLista] = useState<UsuarioAdmin[]>([]);
  const [, forzar] = useState(0);

  const recargar = useCallback(async () => { setLista(await api.admin.listarUsuarios()); }, [api]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
  useEffect(() => { void recargar(); }, [recargar]);

  const pendientes = lista.filter((u) => u.perfil.account_type === 'professional' && u.perfil.pro_status === 'pending');
  const inscritos = lista.filter((u) => u.inscripcion);

  async function decidir(id: string, ok: boolean) { await api.admin.decidirProfesional(id, ok); await recargar(); }
  async function sembrar() { await api.admin.sembrarEjemplos?.(); await recargar(); }
  function simular(cerrada: boolean) { api.admin.simularCierre(cerrada); forzar((n) => n + 1); }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Administración</h1>
      <AvisoDemo />

      <div className="cuenta-bloque">
        <h2>Solicitudes de cuenta profesional ({pendientes.length})</h2>
        {pendientes.length === 0 && <p className="cuenta-sub">No hay solicitudes pendientes.</p>}
        <ul className="cuenta-lista">
          {pendientes.map((u) => (
            <li key={u.id}>
              <div>
                <strong>{u.perfil.display_name}</strong> · {u.email}
                <br /><span className="cuenta-sub">{nombrePais(u.perfil.country_code)} · {u.perfil.university_name || 'sin universidad'} · {u.perfil.career || 'sin carrera'}</span>
              </div>
              <div className="cuenta-fila-botones">
                <button className="btn btn-accent" type="button" onClick={() => decidir(u.id, true)}>Aprobar</button>
                <button className="btn cuenta-btn-sec" type="button" onClick={() => decidir(u.id, false)}>Rechazar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="cuenta-bloque">
        <h2>Participantes por región y país</h2>
        <p className="cuenta-sub">{lista.length} cuentas · {inscritos.length} con preinscripción o inscripción</p>
        <table className="cuenta-tabla">
          <thead><tr><th>Región</th><th>Cuentas</th><th>Inscripciones</th></tr></thead>
          <tbody>
            {contar(lista, (u) => regionDe(u.perfil.country_code)).map(([r, n]) => (
              <tr key={r}><td>{r}</td><td>{n}</td><td>{inscritos.filter((u) => regionDe(u.perfil.country_code) === r).length}</td></tr>
            ))}
          </tbody>
        </table>
        <table className="cuenta-tabla">
          <thead><tr><th>País</th><th>Cuentas</th></tr></thead>
          <tbody>
            {contar(lista, (u) => nombrePais(u.perfil.country_code)).map(([p, n]) => <tr key={p}><td>{p}</td><td>{n}</td></tr>)}
          </tbody>
        </table>
      </div>

      <div className="cuenta-bloque">
        <h2>Inscripciones</h2>
        {inscritos.length === 0 && <p className="cuenta-sub">Aún no hay inscripciones.</p>}
        <table className="cuenta-tabla">
          <thead><tr><th>Persona</th><th>País</th><th>Categoría</th><th>Estado</th><th>Dto.</th></tr></thead>
          <tbody>
            {inscritos.map((u) => (
              <tr key={u.id}>
                <td>{u.perfil.display_name}</td><td>{nombrePais(u.inscripcion!.pais)}</td>
                <td>{CATEGORIAS[u.inscripcion!.categoria]}</td>
                <td>{u.inscripcion!.estado === 'preinscrito' ? 'Preinscrito' : u.inscripcion!.estado === 'pagado' ? 'Pagado' : 'Inscrito'}</td>
                <td>{u.inscripcion!.descuento ? '10%' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {demo && (
        <div className="cuenta-bloque">
          <h2>Simulación (solo demostración)</h2>
          <p className="cuenta-sub">Para ver cómo se ve el sitio con la preinscripción abierta o ya cerrada.</p>
          <p>Hoy: <strong>{api.inscripcion.preinscripcionAbierta() ? 'preinscripción abierta' : 'preinscripción cerrada'}</strong></p>
          <div className="cuenta-fila-botones">
            <button className="btn cuenta-btn-sec" type="button" onClick={() => simular(false)}>Usar fecha real</button>
            <button className="btn cuenta-btn-sec" type="button" onClick={() => simular(true)}>Simular cierre</button>
            <button className="btn cuenta-btn-sec" type="button" onClick={sembrar}>Crear participantes de ejemplo</button>
          </div>
        </div>
      )}
    </section>
  );
}
