import React, { useEffect, useState } from 'react';
import './Countdown.css';

// Fecha tentativa de inicio del congreso (hora de Chile, UTC-3 en octubre)
const EVENT_START = new Date('2027-10-24T09:00:00-03:00').getTime();

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

export const CountdownTimer: React.FC = () => {
  const [t, setT] = useState(getRemaining);

  useEffect(() => {
    const id = window.setInterval(() => setT(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: 'Días', value: t.days },
    { label: 'Horas', value: t.hours },
    { label: 'Min', value: t.minutes },
    { label: 'Seg', value: t.seconds },
  ];

  return (
    <div className="countdown-block">
      <p className="countdown-kicker">Faltan para el CLEIN</p>
      <div className="countdown-units" role="timer">
        {units.map((u) => (
          <div key={u.label} className="countdown-unit">
            <span className="countdown-value">{String(u.value).padStart(2, '0')}</span>
            <span className="countdown-label">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
