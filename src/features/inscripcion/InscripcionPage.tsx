import { useCallback, useEffect, useState } from 'react';
import { Link } from '../../core/router';
import { useAuth } from '../../core/auth/AuthContext';
import AvisoDemo from '../../core/ui/AvisoDemo';
import { nombrePais } from '../../core/geo';
import {
  DESCUENTO_PREINSCRIPCION, PRECIOS_DE_EJEMPLO, PREINSCRIPCION_HASTA,
  fechaLarga, formatoMoneda, precioDe,
} from '../../core/tarifas';
import TablaPrecios from '../../core/ui/TablaPrecios';
import { NOTA_PRECIOS } from '../../core/precios';
import { CATEGORIAS, type Categoria, type Inscripcion, type MetodoPago, type Perfil } from '../../core/types';
import '../../core/ui/ui.css';

const pct = Math.round(DESCUENTO_PREINSCRIPCION * 100);
const ESTADOS = { preinscrito: 'Preinscrito', inscrito: 'Inscrito (pago pendiente)', pagado: 'Pagado' } as const;

export default function InscripcionPage() {
  const { user, cargando, api } = useAuth();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [ins, setIns] = useState<Inscripcion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pagando, setPagando] = useState(false);
  const abierta = api.inscripcion.preinscripcionAbierta();

  const recargar = useCallback(async () => {
    if (!user) { setPerfil(null); setIns(null); return; }
    setPerfil(await api.perfil.cargar(user.id));
    setIns(await api.inscripcion.mia(user.id));
  }, [user, api]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- carga inicial de datos
  useEffect(() => { void recargar(); }, [recargar]);

  async function pagar(metodo: MetodoPago) {
    if (!user) return;
    setPagando(false);
    await accion(() => api.inscripcion.pagar(user.id, metodo));
  }

  async function accion(f: () => Promise<string | null>) {
    setError(null);
    const e = await f();
    if (e) setError(e);
    await recargar();
  }

  const banner = abierta ? (
    <div className="cuenta-banner cuenta-banner-ok">
      <strong>Preinscripción abierta hasta el {fechaLarga(PREINSCRIPCION_HASTA)}.</strong> Quienes se preinscriban obtienen un <strong>{pct}% de descuento</strong> en su inscripción.
    </div>
  ) : (
    <div className="cuenta-banner">
      <strong>La preinscripción cerró.</strong> Ahora solo está disponible la inscripción general, sin descuento de preinscripción.
    </div>
  );

  function bloqueAccion() {
    if (cargando) return <p>Cargando…</p>;
    if (!user || !perfil) {
      return <p>Para {abierta ? 'preinscribirte' : 'inscribirte'} necesitas una cuenta. <Link to="/cuenta" className="cuenta-enlace">Iniciar sesión o crear cuenta →</Link></p>;
    }
    const cat: Categoria = perfil.account_type === 'professional' ? 'professional' : 'student';
    const bloqueadoPro = cat === 'professional' && perfil.pro_status !== 'approved';

    const resumen = (
      <p className="cuenta-sub">
        {nombrePais(perfil.country_code)} · Categoría {CATEGORIAS[cat]}
      </p>
    );

    if (ins) {
      const p = precioDe(ins.pais, ins.categoria, ins.descuento);
      return (
        <div className="cuenta-bloque">
          <h2>Tu {ins.estado === 'preinscrito' ? 'preinscripción' : 'inscripción'}</h2>
          <p>
            Estado: <span className="cuenta-chip cuenta-chip-approved">{ESTADOS[ins.estado]}</span>
          </p>
          <p>
            Categoría {CATEGORIAS[ins.categoria]} · {nombrePais(ins.pais)}.{' '}
            {ins.descuento && <><s>{formatoMoneda(p.base, p.moneda)}</s>{' '}</>}
            <strong>{formatoMoneda(p.final, p.moneda)}</strong>
            {ins.descuento && ` (${pct}% de descuento de preinscripción)`}
          </p>
          {ins.estado === 'pagado' ? (
            <p className="cuenta-aviso">Pago registrado. ¡Nos vemos en Santiago!</p>
          ) : (
            <>
              <p className="cuenta-nota">El pago real aún no está habilitado. Puedes probar el flujo con un pago de demostración, que no cobra nada.</p>
              {error && <p className="cuenta-error" role="alert">{error}</p>}
              {pagando ? (
                <div className="cuenta-fila-botones">
                  {ins.pais === 'CL'
                    ? <button className="btn btn-accent" type="button" onClick={() => pagar('webpay')}>Pagar con Webpay (demostración)</button>
                    : <button className="btn btn-accent" type="button" onClick={() => pagar('paypal')}>Pagar con PayPal (demostración)</button>}
                  <button className="btn cuenta-btn-sec" type="button" onClick={() => setPagando(false)}>Volver</button>
                </div>
              ) : (
                <div className="cuenta-fila-botones">
                  <button className="btn btn-accent" type="button" onClick={() => setPagando(true)}>Ir a pagar</button>
                  {ins.estado === 'preinscrito' && (
                    <button className="btn cuenta-btn-sec" type="button" onClick={() => accion(() => api.inscripcion.confirmar(user.id))}>Confirmar inscripción</button>
                  )}
                  <button className="btn cuenta-btn-sec" type="button" onClick={() => accion(() => api.inscripcion.cancelar(user.id))}>Cancelar</button>
                </div>
              )}
            </>
          )}
        </div>
      );
    }

    if (bloqueadoPro) {
      return (
        <div className="cuenta-bloque">
          {resumen}
          <p className="cuenta-nota">
            {perfil.pro_status === 'rejected'
              ? 'Tu solicitud de cuenta profesional no fue aprobada.'
              : 'Tu cuenta de profesional está pendiente de aprobación por el equipo organizador.'}{' '}
            Podrás inscribirte cuando esté aprobada. <Link to="/perfil" className="cuenta-enlace">Ver mi perfil →</Link>
          </p>
        </div>
      );
    }

    const p = precioDe(perfil.country_code, cat, abierta);
    return (
      <div className="cuenta-bloque">
        {resumen}
        <p className="cuenta-precio">
          {abierta && <s>{formatoMoneda(p.base, p.moneda)}</s>} <strong>{formatoMoneda(p.final, p.moneda)}</strong>
          {abierta && <span className="cuenta-chip cuenta-chip-approved">−{pct}% preinscripción</span>}
        </p>
        {error && <p className="cuenta-error" role="alert">{error}</p>}
        {abierta ? (
          <button className="btn btn-accent" type="button" onClick={() => accion(() => api.inscripcion.inscribir(user.id, 'preinscrito'))}>Preinscribirme con {pct}% de descuento</button>
        ) : (
          <button className="btn btn-accent" type="button" onClick={() => accion(() => api.inscripcion.inscribir(user.id, 'inscrito'))}>Inscribirme</button>
        )}
      </div>
    );
  }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Inscripción</h1>
      <AvisoDemo />
      {PRECIOS_DE_EJEMPLO && <p className="cuenta-demo">Precios y fechas de la propuesta presentada; el comité puede ajustarlos.</p>}
      {banner}
      {bloqueAccion()}
      <h2>Tarifas presenciales</h2>
      <p className="cuenta-sub">{NOTA_PRECIOS}</p>
      <TablaPrecios modalidad="presencial" />
      <h2>Tarifas online</h2>
      <TablaPrecios modalidad="online" />
    </section>
  );
}
