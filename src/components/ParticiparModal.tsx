import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { Link } from '../core/router';
import TablaPrecios from '../core/ui/TablaPrecios';
import {
  INCLUYE_ONLINE, INCLUYE_PRESENCIAL, NIVELES_EMPRESA, NOTA_EMPRESAS, NOTA_PAGO, NOTA_PRECIOS, UNIVERSIDAD_PARTNER,
} from '../core/precios';
import '../core/ui/ui.css';
import './ParticiparModal.css';

export type Tipo = 'sponsor' | 'asistente' | 'gestionador';

const TITULOS: Record<Tipo, string> = {
  asistente: 'Precios y beneficios para participantes',
  sponsor: 'Niveles de patrocinio para empresas',
  gestionador: 'Participa como universidad partner',
};

function Asistente() {
  const [mod, setMod] = useState<'presencial' | 'online'>('presencial');
  return (
    <>
      <div className="pm-tabs" role="tablist" aria-label="Modalidad">
        {(['presencial', 'online'] as const).map((m) => (
          <button key={m} type="button" role="tab" aria-selected={mod === m} className={mod === m ? 'pm-tab pm-tab-on' : 'pm-tab'} onClick={() => setMod(m)}>
            {m === 'presencial' ? 'Presencial' : 'Online'}
          </button>
        ))}
      </div>
      <TablaPrecios modalidad={mod} />
      <p className="pm-nota">{NOTA_PRECIOS}</p>
      <h3>La inscripción {mod === 'presencial' ? 'presencial' : 'online'} incluye</h3>
      <ul className="pm-lista">{(mod === 'presencial' ? INCLUYE_PRESENCIAL : INCLUYE_ONLINE).map((i) => <li key={i}>{i}</li>)}</ul>
      <p className="pm-nota">{NOTA_PAGO}</p>
    </>
  );
}

function Empresas() {
  return (
    <>
      <div className="pm-niveles">
        {NIVELES_EMPRESA.map((n) => (
          <article key={n.nivel} className={`pm-nivel pm-${n.nivel.toLowerCase()}`}>
            <h3>{n.nivel}</h3>
            <p className="pm-aporte">{n.aporte}</p>
            <ul className="pm-lista">{n.beneficios.map((b) => <li key={b}>{b}</li>)}</ul>
          </article>
        ))}
      </div>
      <p className="pm-nota">{NOTA_EMPRESAS}</p>
    </>
  );
}

function Universidades() {
  return (
    <>
      <p className="pm-aporte">Nivel partner académico · {UNIVERSIDAD_PARTNER.aporte}</p>
      <ul className="pm-lista">{UNIVERSIDAD_PARTNER.beneficios.map((b) => <li key={b}>{b}</li>)}</ul>
      <p className="pm-nota">{UNIVERSIDAD_PARTNER.nota}</p>
    </>
  );
}

export default function ParticiparModal({ tipo, onClose, onContacto }: { tipo: Tipo; onClose: () => void; onContacto: (t: Tipo) => void }) {
  const cerrar = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    cerrar.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previo?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="pm-fondo" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="pm-caja" role="dialog" aria-modal="true" aria-labelledby="pm-titulo">
        <button ref={cerrar} type="button" className="pm-cerrar" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
        <h2 id="pm-titulo">{TITULOS[tipo]}</h2>
        <p className="pm-demo">Información de la propuesta presentada; valores sujetos a confirmación del comité.</p>
        {tipo === 'asistente' && <Asistente />}
        {tipo === 'sponsor' && <Empresas />}
        {tipo === 'gestionador' && <Universidades />}
        <div className="pm-acciones">
          {tipo === 'asistente' ? (
            <Link to="/inscripcion" className="btn btn-accent" onClick={onClose}>Crear cuenta e inscribirme</Link>
          ) : (
            <a href="#contact" className="btn btn-accent" onClick={() => { onContacto(tipo); onClose(); }}>
              {tipo === 'sponsor' ? 'Quiero patrocinar' : 'Quiero sumar mi universidad'}
            </a>
          )}
          <button type="button" className="btn btn-outline" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
