import React, { useState } from 'react';
import './Agenda.css';

type Kind = 'academico' | 'networking' | 'social' | 'pausa';

interface Block {
  time: string;
  title: string;
  kind: Kind;
  parallel?: string[];
}

interface Day {
  key: string;
  short: string;
  date: string;
  theme?: string;
  blocks: Block[];
}

type Mode = 'presencial' | 'online';

const kindLabel: Record<Kind, string> = {
  academico: 'Académico',
  networking: 'Networking',
  social: 'Social',
  pausa: 'Pausa',
};

// Mismo programa de los tres días temáticos (martes a jueves)
const themedDay = (social: string): Block[] => [
  { time: '9:00 – 9:45', title: 'Ponencias estudiantiles', kind: 'academico' },
  { time: '9:45 – 10:45', title: 'Paneles y ponencia magistral', kind: 'academico' },
  { time: '10:45 – 11:00', title: 'Coffee break', kind: 'pausa' },
  { time: '11:00 – 13:00', title: 'Talleres', kind: 'academico', parallel: ['Taller 1', 'Taller 2', 'Taller 3'] },
  { time: '13:00 – 14:00', title: 'Almuerzo', kind: 'pausa' },
  { time: '14:00 – 15:00', title: 'Tech Talks', kind: 'academico' },
  { time: '15:00 – 15:45', title: 'Voces que inspiran y foro debate profesional', kind: 'academico' },
  { time: '15:45 – 16:00', title: 'Coffee break', kind: 'pausa' },
  { time: '16:00 – 16:30', title: 'Olimpiadas académicas', kind: 'academico' },
  {
    time: '16:30 – 18:00',
    title: 'Actividades en paralelo',
    kind: 'networking',
    parallel: ['Global Experience', 'Feria de innovación tecnológica', 'Mesa redonda'],
  },
  { time: '18:00 – 19:00', title: 'Concurso de pósteres', kind: 'academico' },
  { time: '21:00 – 23:00', title: social, kind: 'social' },
];

// Horarios leídos de los cronogramas del equipo; son referenciales hasta confirmar el programa final.
const presencial: Day[] = [
  {
    key: 'dom',
    short: 'Dom 24',
    date: 'Domingo 24 de octubre',
    blocks: [
      { time: '10:45 – 15:45', title: 'Acreditación y feria', kind: 'networking' },
      { time: '19:00 – 22:00', title: 'Pre CLEIN', kind: 'social' },
    ],
  },
  {
    key: 'lun',
    short: 'Lun 25',
    date: 'Lunes 25 de octubre',
    blocks: [
      { time: '9:00 – 13:00', title: 'CLEIN Games', kind: 'networking' },
      { time: '14:00 – 16:00', title: 'CLEIN Conecta', kind: 'networking' },
      { time: '20:00 – 21:00', title: 'Cóctel de apertura', kind: 'social' },
      { time: '21:00 – 23:00', title: 'Future Party', kind: 'social' },
    ],
  },
  { key: 'mar', short: 'Mar 26', date: 'Martes 26 de octubre', theme: 'Green Shift', blocks: themedDay('Peña folclórica') },
  { key: 'mie', short: 'Mié 27', date: 'Miércoles 27 de octubre', theme: 'Intelligent Decisions', blocks: themedDay('Fiesta años 20s') },
  { key: 'jue', short: 'Jue 28', date: 'Jueves 28 de octubre', theme: 'Smart Mining', blocks: themedDay('Festival de las Naciones') },
  {
    key: 'vie',
    short: 'Vie 29',
    date: 'Viernes 29 de octubre',
    blocks: [
      { time: '9:00 – 13:00', title: 'Visitas técnicas', kind: 'networking' },
      { time: '14:00 – 16:30', title: 'Recorrido turístico', kind: 'networking' },
      { time: '20:00 – 21:00', title: 'Cena de clausura', kind: 'social' },
      { time: '21:00 – 23:00', title: 'Gala bajo las estrellas', kind: 'social' },
    ],
  },
];

const onlineDay = (): Block[] => [
  { time: '9:00 – 9:45', title: 'Ponencias estudiantiles', kind: 'academico' },
  { time: '9:45 – 10:45', title: 'Paneles (experiencias personales)', kind: 'academico' },
  { time: '10:45 – 11:00', title: 'Receso', kind: 'pausa' },
  { time: '11:00 – 13:00', title: 'Workshops', kind: 'academico', parallel: ['Workshop 1', 'Workshop 2', 'Workshop 3'] },
  { time: '13:00 – 14:00', title: 'Almuerzo', kind: 'pausa' },
  { time: '14:00 – 15:00', title: 'Workshops', kind: 'academico', parallel: ['Workshop 1', 'Workshop 2', 'Workshop 3'] },
  { time: '15:00 – 15:45', title: 'Foro debate profesional', kind: 'academico' },
  { time: '15:45 – 16:00', title: 'Receso', kind: 'pausa' },
  { time: '16:00 – 16:30', title: 'Olimpiadas académicas', kind: 'academico' },
];

const online: Day[] = [
  {
    key: 'dom',
    short: 'Dom 24',
    date: 'Domingo 24 de octubre',
    blocks: [{ time: 'Todo el día', title: 'Acreditación online', kind: 'networking' }],
  },
  {
    key: 'lun',
    short: 'Lun 25',
    date: 'Lunes 25 de octubre',
    blocks: [
      { time: '11:00 – 14:00', title: 'Proyección social', kind: 'networking' },
      { time: '15:00 – 16:00', title: 'Inauguración online', kind: 'academico' },
      { time: '20:00 – 21:00', title: 'Cóctel de apertura', kind: 'social' },
    ],
  },
  { key: 'mar', short: 'Mar 26', date: 'Martes 26 de octubre', theme: 'Productividad 4.0', blocks: onlineDay() },
  { key: 'mie', short: 'Mié 27', date: 'Miércoles 27 de octubre', theme: 'Sostenibilidad', blocks: onlineDay() },
  { key: 'jue', short: 'Jue 28', date: 'Jueves 28 de octubre', theme: 'Competitividad', blocks: onlineDay() },
  {
    key: 'vie',
    short: 'Vie 29',
    date: 'Viernes 29 de octubre',
    blocks: [
      { time: '10:45 – 11:00', title: 'Charla', kind: 'academico' },
      { time: '20:00 – 21:00', title: 'Clausura en streaming', kind: 'social' },
    ],
  },
];

const programs: Record<Mode, { label: string; days: Day[] }> = {
  presencial: { label: 'Presencial', days: presencial },
  online: { label: 'Online', days: online },
};

const Agenda: React.FC = () => {
  const [mode, setMode] = useState<Mode>('presencial');
  const [active, setActive] = useState('dom');
  const days = programs[mode].days;
  const day = days.find((d) => d.key === active) ?? days[0];

  return (
    <section id="agenda" className="agenda py-24">
      <div className="container">
        <div className="text-center mb-8">
          <h2 className="section-title">Seis días, un programa</h2>
          <div className="title-underline mx-auto"></div>
          <p className="agenda-intro">
            Martes, miércoles y jueves cada día se dedica a un pilar temático. El viernes cierra con visitas técnicas y
            recorrido turístico. Horarios referenciales, sujetos a ajustes.
          </p>
        </div>

        <div className="agenda-modes" role="group" aria-label="Modalidad">
          {(Object.keys(programs) as Mode[]).map((m) => (
            <button
              key={m}
              className={`agenda-mode ${m === mode ? 'active' : ''}`}
              aria-pressed={m === mode}
              onClick={() => setMode(m)}
            >
              {programs[m].label}
            </button>
          ))}
        </div>

        <div className="agenda-tabs" role="tablist" aria-label="Días del congreso">
          {days.map((d) => (
            <button
              key={d.key}
              role="tab"
              id={`tab-${d.key}`}
              aria-selected={d.key === day.key}
              aria-controls="agenda-panel"
              className={`agenda-tab ${d.key === day.key ? 'active' : ''}`}
              onClick={() => setActive(d.key)}
            >
              {d.short}
            </button>
          ))}
        </div>

        <div className="agenda-panel" id="agenda-panel" role="tabpanel" aria-labelledby={`tab-${day.key}`}>
          <div className="agenda-day-head">
            <h3>{day.date}</h3>
            {day.theme && <span className="agenda-theme">{day.theme}</span>}
          </div>
          <ol className="agenda-blocks">
            {day.blocks.map((b) => (
              <li key={`${b.time}-${b.title}`} className={`agenda-block kind-${b.kind}`}>
                <span className="agenda-time">{b.time}</span>
                <div>
                  <h4>
                    {b.title} <span className="agenda-kind">{kindLabel[b.kind]}</span>
                  </h4>
                  {b.parallel && (
                    <ul className="agenda-parallel">
                      {b.parallel.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
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
