import React, { useEffect, useState } from 'react';
import './Countdown.css';

// Fecha tentativa de inicio del congreso (hora de Chile, UTC-3 en octubre)
const EVENT_START = new Date('2027-10-24T09:00:00-03:00').getTime();

const stats = [
  { value: '500', label: 'Asistentes' },
  { value: '15+', label: 'Países' },
  { value: '6', label: 'Días de congreso' },
  { value: '3', label: 'Pilares temáticos' },
];

function getRemaining() {
  const diff = Math.max(EVENT_START - Date.now(), 0);
  const s = Math.floor(diff / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

const Countdown: React.FC = () => {
  const [t, setT] = useState(getRemaining);

  useEffect(() => {
    const id = window.setInterval(() => setT(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: 'Días', value: t.days },
    { label: 'Horas', value: t.hours },
    { label: 'Minutos', value: t.minutes },
    { label: 'Segundos', value: t.seconds },
  ];

  return (
    <section className="countdown" aria-label="Cuenta regresiva y cifras del congreso">
      <div className="container countdown-inner">
        <div className="countdown-block">
          <p className="countdown-kicker">Faltan para el CLEIN · 24 al 29 de octubre de 2027</p>
          <div className="countdown-units" role="timer">
            {units.map((u) => (
              <div key={u.label} className="countdown-unit">
                <span className="countdown-value">{String(u.value).padStart(2, '0')}</span>
                <span className="countdown-label">{u.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="stats">
          {stats.map((s) => (
            <li key={s.label} className="stat">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Countdown;
