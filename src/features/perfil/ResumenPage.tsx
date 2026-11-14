import { useEffect, useState, type ChangeEvent } from 'react';
import { Link } from '../../core/router';
import { CATEGORIAS, type Inscripcion } from '../../core/types';
import { nombrePais, regionDe } from '../../core/geo';
import AvisoDemo from '../../core/ui/AvisoDemo';
import { usePerfil } from './usePerfil';
import '../../core/ui/ui.css';

/** Reduce la foto a 256 px (JPEG) para guardarla ligera. */
function reducirFoto(archivo: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(archivo);
    img.onload = () => {
      const lado = Math.min(img.width, img.height), tam = 256;
      const c = document.createElement('canvas');
      c.width = tam; c.height = tam;
      const ctx = c.getContext('2d');
      if (!ctx) { reject(new Error('sin canvas')); return; }
      ctx.drawImage(img, (img.width - lado) / 2, (img.height - lado) / 2, lado, lado, 0, 0, tam, tam);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagen no válida')); };
    img.src = url;
  });
}

const ETIQUETA_PRO = { none: '', pending: 'Pendiente de aprobación', approved: 'Profesional aprobado', rejected: 'Solicitud rechazada' } as const;

export default function ResumenPage() {
  const { user, api, perfil, estado, recargar, guardar } = usePerfil();
  const [ins, setIns] = useState<Inscripcion | null>(null);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  useEffect(() => {
    if (user) void api.inscripcion.mia(user.id).then(setIns);
  }, [user, api]);

  if (estado === 'cargando') return <section className="cuenta-card"><p>Cargando tu perfil…</p></section>;
  if (estado === 'error' || !perfil || !user) return <section className="cuenta-card"><p>No pudimos cargar tu perfil. Inténtalo más tarde.</p></section>;

  async function subirFoto(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f || !perfil) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type) || f.size > 5 * 1024 * 1024) {
      setMensaje({ tipo: 'error', texto: 'La foto debe ser JPG, PNG o WebP de hasta 5 MB.' }); return;
    }
    try {
      const err = await guardar({ ...perfil, avatar_url: await reducirFoto(f) });
      setMensaje(err ? { tipo: 'error', texto: err } : { tipo: 'ok', texto: 'Foto actualizada.' });
    } catch {
      setMensaje({ tipo: 'error', texto: 'No se pudo procesar la imagen.' });
    }
  }

  async function solicitarPro() { if (user) { await api.perfil.solicitarProfesional(user.id); await recargar(); } }
  async function volverEstudiante() {
    if (!user) return;
    const err = await api.perfil.volverAEstudiante(user.id);
    if (err) setMensaje({ tipo: 'error', texto: err }); else await recargar();
  }

  const iniciales = perfil.display_name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Resumen</h1>
      <AvisoDemo />
      <div className="cuenta-identidad">
        <div className="cuenta-avatar" aria-hidden={!perfil.avatar_url}>
          {perfil.avatar_url ? <img src={perfil.avatar_url} alt="Tu foto de perfil" /> : <span>{iniciales || '?'}</span>}
        </div>
        <div>
          <p className="cuenta-nombre">{perfil.display_name}</p>
          <p className="cuenta-sub">{perfil.headline || 'Agrega un titular en «Datos personales»'}</p>
          <p className="cuenta-sub">{nombrePais(perfil.country_code)} · {regionDe(perfil.country_code)}</p>
          <div className="cuenta-fila-botones">
            <label className="btn cuenta-btn-sec cuenta-subir">
              Cambiar foto<input type="file" accept="image/jpeg,image/png,image/webp" onChange={subirFoto} hidden />
            </label>
            {perfil.avatar_url && <button type="button" className="btn cuenta-btn-sec" onClick={() => guardar({ ...perfil, avatar_url: '' })}>Quitar foto</button>}
          </div>
        </div>
      </div>
      {mensaje && <p className={mensaje.tipo === 'ok' ? 'cuenta-aviso' : 'cuenta-error'} role="status">{mensaje.texto}</p>}

      <div className="cuenta-bloque">
        <h2>Tipo de cuenta</h2>
        {perfil.account_type === 'student' && (
          <>
            <p>Estás registrado como <strong>estudiante</strong>.</p>
            <div><button type="button" className="btn cuenta-btn-sec" onClick={solicitarPro}>Solicitar cuenta de profesional</button></div>
          </>
        )}
        {perfil.account_type === 'professional' && (
          <>
            <p>Cuenta <strong>profesional</strong>: <span className={`cuenta-chip cuenta-chip-${perfil.pro_status}`}>{ETIQUETA_PRO[perfil.pro_status]}</span></p>
            {perfil.pro_status === 'pending' && (
              <p className="cuenta-nota">La activa el equipo organizador después de revisar tu solicitud. Hasta entonces no puedes inscribirte como profesional.</p>
            )}
            {perfil.pro_status === 'rejected' && (
              <p className="cuenta-nota">Tu solicitud no fue aprobada. Puedes seguir como estudiante o escribirnos desde la sección de contacto.</p>
            )}
            {perfil.pro_status !== 'approved' && (
              <div><button type="button" className="btn cuenta-btn-sec" onClick={volverEstudiante}>Volver a cuenta de estudiante</button></div>
            )}
          </>
        )}
      </div>

      <div className="cuenta-bloque">
        <h2>Mi inscripción</h2>
        {ins ? (
          <p>
            {CATEGORIAS[ins.categoria]} ·{' '}
            <span className="cuenta-chip cuenta-chip-approved">{ins.estado === 'preinscrito' ? 'Preinscrito' : ins.estado === 'pagado' ? 'Pagado' : 'Inscrito (pago pendiente)'}</span>
          </p>
        ) : (
          <p>Aún no te has {api.inscripcion.preinscripcionAbierta() ? 'preinscrito' : 'inscrito'}.</p>
        )}
        <p><Link to="/inscripcion" className="cuenta-enlace">Ir a inscripción y tarifas →</Link></p>
      </div>
    </section>
  );
}
