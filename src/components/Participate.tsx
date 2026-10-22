import React from 'react';
import './Participate.css';
import { GraduationCap, Building2, Users, ArrowRight } from 'lucide-react';

type Tipo = 'sponsor' | 'asistente' | 'gestionador';

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
    cta: 'Quiero sumar mi universidad',
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
    cta: 'Quiero patrocinar',
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
    cta: 'Quiero asistir',
  },
];

const Participate: React.FC = () => {
  const choose = (tipo: Tipo) => {
    window.dispatchEvent(new CustomEvent('clein:tipo', { detail: tipo }));
  };

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
              <a href="#contact" className="btn btn-accent" onClick={() => choose(p.tipo)}>
                {p.cta} <ArrowRight size={18} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Participate;
