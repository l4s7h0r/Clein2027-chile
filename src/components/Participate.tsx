import React, { useCallback, useState } from 'react';
import './Participate.css';
import { GraduationCap, Building2, Store, Users, ArrowRight } from 'lucide-react';
import ParticiparModal, { type Tipo } from './ParticiparModal';

const profiles: {
  tipo: Tipo;
  icon: React.ReactNode;
  title: string;
  lead: string;
  perks: string[];
  cta: string;
}[] = [
  {
    tipo: 'gestionador',
    icon: <GraduationCap size={28} />,
    title: 'Universidades',
    lead: 'Súmate como casa de estudios y lleva a tu comunidad al congreso más grande de la región.',
    perks: [
      'Tarifa convenio para tus estudiantes',
      'Packs por grupo y kit de difusión para tu centro de estudiantes',
      'Participación en el Comité Académico y en las competencias',
    ],
    cta: 'Ver beneficios y participar',
  },
  {
    tipo: 'sponsor',
    icon: <Building2 size={28} />,
    title: 'Empresas',
    lead: 'Conecta tu marca con el talento joven de ingeniería de toda Latinoamérica.',
    perks: [
      'Stand, pitch y presencia de marca en el programa',
      'Visitas técnicas y desafío de innovación con retos reales',
      'Acceso directo a estudiantes y profesionales de 15+ países',
    ],
    cta: 'Ver niveles y patrocinar',
  },
  {
    tipo: 'pyme',
    icon: <Store size={28} />,
    title: 'Pymes',
    lead: 'Apoyo con niveles accesibles para empresas pequeñas que quieren sumarse al congreso.',
    perks: [
      'Niveles desde $500.000 CLP (propuesta)',
      'Presencia de marca en el sitio y material digital',
      'Visibilidad ante estudiantes y profesionales de la región',
    ],
    cta: 'Ver niveles para pymes',
  },
  {
    tipo: 'asistente',
    icon: <Users size={28} />,
    title: 'Estudiantes y profesionales',
    lead: 'Seis días de conferencias, talleres certificados, visitas técnicas y networking regional.',
    perks: [
      'Talleres con certificado válido en la región',
      'Concursos de ponencias, e-posters y olimpiadas',
      'Red de contactos con delegaciones de toda Latinoamérica',
    ],
    cta: 'Ver beneficios y preinscribirme',
  },
];

const Participate: React.FC = () => {
  const [abierto, setAbierto] = useState<Tipo | null>(null);
  const cerrar = useCallback(() => setAbierto(null), []);
  const contacto = useCallback((tipo: Tipo) => {
    window.dispatchEvent(new CustomEvent('clein:tipo', { detail: tipo === 'pyme' ? 'sponsor' : tipo }));
  }, []);

  return (
    <section id="participate" className="participate py-24">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Participa en el CLEIN 2027</h2>
          <div className="title-underline mx-auto"></div>
          <p className="participate-intro">Elige cómo quieres ser parte.</p>
        </div>

        <div className="participate-grid">
          {profiles.map((p) => (
            <article key={p.tipo} className="participate-card">
              <div className="participate-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p className="participate-lead">{p.lead}</p>
              <ul>
                {p.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <button type="button" className="btn btn-accent" onClick={() => setAbierto(p.tipo)}>
                {p.cta} <ArrowRight size={18} />
              </button>
            </article>
          ))}
        </div>
      </div>
      {abierto && <ParticiparModal tipo={abierto} onClose={cerrar} onContacto={contacto} />}
    </section>
  );
};

export default Participate;
