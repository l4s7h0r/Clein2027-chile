import React from 'react';
import './Pillars.css';
import { Leaf, BrainCircuit, Pickaxe } from 'lucide-react';

const Pillars: React.FC = () => {
  const pillars = [
    {
      id: 1,
      title: "Green Shift",
      subtitle: "Energías Renovables — Economía Circular — Sostenibilidad",
      description: "El mercado de renovables en Chile va a crecer cerca de 15% anual hasta 2035, empujado en gran parte por la minería, que sola va a subir su consumo de energía limpia más de 20% al año. En abril se aprobó un proyecto de baterías de 300 MW en Tarapacá, uno de los más grandes de la región. Ahí entran temas como hidrógeno verde (Chile y Brasil a la cabeza en Latinoamérica), almacenamiento en baterías, y economía circular en minería — relaves, reciclaje industrial, segunda vida de materiales.",
      icon: <Leaf size={32} />,
      color: "green"
    },
    {
      id: 2,
      title: "Intelligent Decisions",
      subtitle: "Data Analytics — Inteligencia Artificial — Machine Learning",
      description: "Latinoamérica está en pleno boom de data centers por la expansión de la IA, y Chile es uno de los países donde más se nota la presión sobre la matriz eléctrica. Eso conecta directo con temas como mantenimiento predictivo en minería (Codelco, BHP), forecasting de demanda en cadenas de suministro, y quién le vende energía a los data centers y bajo qué condiciones.",
      icon: <BrainCircuit size={32} />,
      color: "blue"
    },
    {
      id: 3,
      title: "Smart Mining",
      subtitle: "Automatización — Cobre y Litio — Sustentabilidad",
      description: "Chile es el mayor productor mundial de cobre —cerca de 5,3 millones de toneladas al año, casi un cuarto de la oferta global— y concentra más del 33% de las reservas mundiales de litio. La alianza entre Codelco y Microsoft busca llevar IA, automatización y ciberseguridad a la operación minera: flotas de camiones autónomos, perforación remota y salas de control centralizadas ya son parte del día a día. A esto se suma la presión por una minería más sustentable, con más del 70% del agua proyectada para 2033 proveniente de agua de mar desalada, y faenas que operan cada vez más con energía renovable.",
      icon: <Pickaxe size={32} />,
      color: "orange"
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
              <p className="pillar-subtitle">{pillar.subtitle}</p>
              <p className="pillar-description">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
