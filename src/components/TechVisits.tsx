import React, { useState } from 'react';
import './TechVisits.css';

type Pillar = 'Todos' | 'Green Shift' | 'Smart Mining' | 'Intelligent Decisions' | 'Procesos industriales';

interface Visit {
  pillar: Exclude<Pillar, 'Todos'>;
  company: string;
  logos: { src: string; alt: string }[];
  see: string;
}

// Logos en public/empresas/. Si un archivo no existe se muestra el nombre de la empresa.
const visits: Visit[] = [
  {
    pillar: 'Green Shift',
    company: 'Enel',
    logos: [{ src: '/empresas/enel.png', alt: 'Enel' }],
    see: 'Generación limpia, matriz renovable y gestión de operaciones a gran escala.',
  },
  {
    pillar: 'Smart Mining',
    company: 'Centro Remoto Minero',
    logos: [{ src: '/empresas/centro-remoto-minero.png', alt: 'Centro Remoto Minero' }],
    see: 'Teleoperación de maquinaria, gemelos digitales, analítica predictiva e IIoT.',
  },
  {
    pillar: 'Intelligent Decisions',
    company: 'Mercado Libre o Falabella',
    logos: [
      { src: '/empresas/mercado-libre.png', alt: 'Mercado Libre' },
      { src: '/empresas/falabella.png', alt: 'Falabella' },
    ],
    see: 'Logística robotizada, ruteo con algoritmos y gestión de inventarios.',
  },
  {
    pillar: 'Procesos industriales',
    company: 'Coca-Cola',
    logos: [{ src: '/empresas/coca-cola.svg', alt: 'Coca-Cola' }],
    see: 'Líneas automatizadas, control de calidad en tiempo real y Lean Manufacturing.',
  },
];

const filters: Pillar[] = ['Todos', 'Green Shift', 'Smart Mining', 'Intelligent Decisions', 'Procesos industriales'];

const Logo: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return <img className="visit-logo" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
};

const TechVisits: React.FC = () => {
  const [filter, setFilter] = useState<Pillar>('Todos');
  const shown = visits.filter((v) => filter === 'Todos' || v.pillar === filter);

  return (
    <section id="visits" className="visits py-24">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Visitas técnicas</h2>
          <div className="title-underline mx-auto"></div>
          <p className="visits-intro">
            Cada pilar incluye al menos una visita a una operación real en Santiago, en grupos de 40 a 50 personas.
            Estas son las empresas con las que estamos conversando; aún no hay ninguna confirmada.
          </p>
        </div>

        <div className="visits-filters" role="group" aria-label="Filtrar por pilar">
          {filters.map((f) => (
            <button
              key={f}
              className={`visits-filter ${f === filter ? 'active' : ''}`}
              aria-pressed={f === filter}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="visits-grid">
          {shown.map((v) => (
            <li key={v.company} className="visit-card">
              <span className="visit-pillar">{v.pillar}</span>
              <div className="visit-logos">
                {v.logos.map((l) => (
                  <Logo key={l.src} src={l.src} alt={l.alt} />
                ))}
              </div>
              <h3>{v.company}</h3>
              <p>{v.see}</p>
              <span className="visit-badge">En conversaciones</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TechVisits;
