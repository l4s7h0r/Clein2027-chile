import React, { useState } from 'react';
import './Agenda.css';

interface Block {
  time: string;
  title: string;
  detail: string;
}

interface Day {
  key: string;
  short: string;
  date: string;
  theme: string;
  blocks: Block[];
}

// Programa tentativo, construido con los ejes y actividades de la propuesta.
const days: Day[] = [
  {
    key: 'dom',
    short: 'Dom 24',
    date: 'Domingo 24 de octubre',
    theme: 'Bienvenida',
    blocks: [
      { time: 'Todo el día', title: 'Acreditación y recepción', detail: 'Entrega de credencial QR y kit de bienvenida en el hotel sede.' },
      { time: 'Tarde', title: 'Ceremonia de inauguración', detail: 'Autoridades, comité organizador y presentación de las delegaciones.' },
      { time: 'Noche', title: 'Cóctel de bienvenida', detail: 'Primer espacio de networking entre delegaciones.' },
    ],
  },
  {
    key: 'lun',
    short: 'Lun 25',
    date: 'Lunes 25 de octubre',
    theme: 'Green Shift',
    blocks: [
      { time: 'Mañana', title: 'Conferencia magistral y panel de energía', detail: 'Transición energética, economía circular y descarbonización.' },
      { time: 'Mañana', title: 'Talleres certificados', detail: 'Formación práctica con herramientas de vanguardia.' },
      { time: 'Tarde', title: 'Visita técnica del eje', detail: 'Recorrido por una operación real de energía en Santiago.' },
    ],
  },
  {
    key: 'mar',
    short: 'Mar 26',
    date: 'Martes 26 de octubre',
    theme: 'Smart Mining',
    blocks: [
      { time: 'Mañana', title: 'Conferencia magistral y panel de minería', detail: 'Automatización, cobre y litio, teleoperación y gemelos digitales.' },
      { time: 'Mañana', title: 'Tech Talks', detail: 'Charlas cortas sobre innovación y tendencias.' },
      { time: 'Tarde', title: 'Visita técnica del eje', detail: 'Centro de operaciones remotas de minería.' },
    ],
  },
  {
    key: 'mie',
    short: 'Mié 27',
    date: 'Miércoles 27 de octubre',
    theme: 'Intelligent Decisions',
    blocks: [
      { time: 'Mañana', title: 'Conferencia magistral y panel de datos e IA', detail: 'Analítica, modelos predictivos y decisiones basadas en datos.' },
      { time: 'Mañana', title: 'Paneles empresariales', detail: 'Líderes de la industria chilena y latinoamericana.' },
      { time: 'Tarde', title: 'Visita técnica del eje', detail: 'Logística y operaciones con analítica a gran escala.' },
    ],
  },
  {
    key: 'jue',
    short: 'Jue 28',
    date: 'Jueves 28 de octubre',
    theme: 'Competencia e innovación',
    blocks: [
      { time: 'Mañana', title: 'Ponencias estudiantiles y e-posters', detail: 'Presentación de las investigaciones finalistas.' },
      { time: 'Tarde', title: 'Desafío de innovación y olimpiadas académicas', detail: 'Retos reales de empresas y competencia entre delegaciones.' },
      { time: 'Tarde', title: 'Feria de posgrados e innovación', detail: 'Stands de universidades y empresas.' },
    ],
  },
  {
    key: 'vie',
    short: 'Vie 29',
    date: 'Viernes 29 de octubre',
    theme: 'Cierre',
    blocks: [
      { time: 'Mañana', title: 'Conferencia de cierre', detail: 'Conclusiones del congreso y mirada a la siguiente sede.' },
      { time: 'Tarde', title: 'Premiación', detail: 'Reconocimiento a ponencias, e-posters, olimpiadas y desafío de innovación.' },
      { time: 'Noche', title: 'Gala de clausura', detail: 'Cierre social y cultural del CLEIN Chile 2027.' },
    ],
  },
];

const Agenda: React.FC = () => {
  const [active, setActive] = useState(days[0].key);
  const day = days.find((d) => d.key === active) ?? days[0];

  return (
    <section id="agenda" className="agenda py-24">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Seis días, un programa</h2>
          <div className="title-underline mx-auto"></div>
          <p className="agenda-intro">
            Un día por eje temático, visitas técnicas por la tarde y dos jornadas de competencia e innovación.
            Programa tentativo, sujeto a ajustes.
          </p>
        </div>

        <div className="agenda-tabs" role="tablist" aria-label="Días del congreso">
          {days.map((d) => (
            <button
              key={d.key}
              role="tab"
              id={`tab-${d.key}`}
              aria-selected={d.key === active}
              aria-controls="agenda-panel"
              className={`agenda-tab ${d.key === active ? 'active' : ''}`}
              onClick={() => setActive(d.key)}
            >
              {d.short}
            </button>
          ))}
        </div>

        <div className="agenda-panel" id="agenda-panel" role="tabpanel" aria-labelledby={`tab-${day.key}`}>
          <div className="agenda-day-head">
            <h3>{day.date}</h3>
            <span className="agenda-theme">{day.theme}</span>
          </div>
          <ol className="agenda-blocks">
            {day.blocks.map((b) => (
              <li key={b.title} className="agenda-block">
                <span className="agenda-time">{b.time}</span>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
