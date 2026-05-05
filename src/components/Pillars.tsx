import React from 'react';
import './Pillars.css';
import { Leaf, Mountain, Cpu } from 'lucide-react';

const Pillars: React.FC = () => {
  const pillars = [
    {
      id: 1,
      title: "Energías Limpias",
      description: "Chile es líder mundial en transición energética. Exploraremos cómo la ingeniería industrial optimiza la generación, distribución y el uso de energías renovables no convencionales.",
      icon: <Leaf size={32} />,
      color: "green"
    },
    {
      id: 2,
      title: "Minería del Futuro",
      description: "La evolución hacia una minería sustentable, eficiente y responsable. Abordaremos procesos innovadores, data science aplicado y la reducción de la huella de carbono.",
      icon: <Mountain size={32} />,
      color: "orange"
    },
    {
      id: 3,
      title: "Automatización",
      description: "Industria 4.0 en acción. Desde la robótica hasta el diseño de sistemas complejos, analizaremos cómo la automatización está transformando la matriz productiva.",
      icon: <Cpu size={32} />,
      color: "blue"
    }
  ];

  return (
    <section id="pillars" className="pillars py-24">
      <div className="container">
        <div className="text-center mb-8 animate-fade-up">
          <h2 className="section-title">Nuestros Pilares</h2>
          <div className="title-underline mx-auto"></div>
          <p className="pillars-intro">
            La propuesta para Santiago 2027 se fundamenta en las fortalezas estratégicas de Chile, 
            proyectando la ingeniería industrial hacia los desafíos globales.
          </p>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar, index) => (
            <div 
              key={pillar.id} 
              className={`pillar-card animate-fade-up delay-${(index + 1) * 100}`}
            >
              <div className={`pillar-icon-wrapper ${pillar.color}`}>
                {pillar.icon}
              </div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-description">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
