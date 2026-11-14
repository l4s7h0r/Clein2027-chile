import React, { useState } from 'react';
import './Supporters.css';

interface Universidad { name: string; sigla: string; src: string }

/** Para mostrar el logo, copia el archivo en public/universidades con el nombre indicado en `src`. */
const organizadora: Universidad = { name: 'Universidad de Santiago de Chile', sigla: 'USACH', src: '/universidades/usach.png' };
const coorganizadora: Universidad = { name: 'Universidad Tecnológica Metropolitana', sigla: 'UTEM', src: '/universidades/utem.png' };

const partners: Universidad[] = [
  { name: 'Universidad de Antofagasta', sigla: 'UA', src: '/universidades/ua.png' },
  { name: 'Universidad Austral de Chile', sigla: 'UACh', src: '/universidades/uach.png' },
  { name: 'Universidad de Concepción', sigla: 'UdeC', src: '/universidades/udec.png' },
  { name: 'Universidad Finis Terrae', sigla: 'UFT', src: '/universidades/uft.png' },
  { name: 'Universidad Andrés Bello', sigla: 'UNAB', src: '/universidades/unab.png' },
];

/** Muestra el logo; si el archivo aún no existe, muestra la sigla. */
const Logo: React.FC<{ u: Universidad; oculto?: boolean }> = ({ u, oculto }) => {
  const [falla, setFalla] = useState(false);
  if (falla) return <span className="uni-sigla" aria-hidden={oculto}>{u.sigla}</span>;
  return <img src={u.src} alt={oculto ? '' : u.name} loading="lazy" onError={() => setFalla(true)} />;
};

const Supporters: React.FC = () => {
  return (
    <section id="supporters" className="supporters py-24">
      <div className="container">
        <div className="supporters-header animate-fade-up">
          <h2 className="section-title">Universidades participantes</h2>
          <div className="title-underline"></div>
          <p className="supporters-text">
            Las universidades que organizan CLEIN Santiago 2027 y las casas de estudio que se suman como partner.
          </p>
        </div>

        <div className="uni-organizadoras">
          <article className="uni-organizadora uni-principal">
            <span className="uni-rol">Organizadora</span>
            <div className="uni-logo"><Logo u={organizadora} /></div>
            <h3>{organizadora.name}</h3>
          </article>
          <article className="uni-organizadora">
            <span className="uni-rol uni-rol-co">Coorganizadora</span>
            <div className="uni-logo"><Logo u={coorganizadora} /></div>
            <h3>{coorganizadora.name}</h3>
          </article>
        </div>

        <h3 className="uni-subtitulo">Universidades partner</h3>
      </div>

      <div className="carousel" aria-label="Universidades partner">
        <ul className="carousel-track">
          {[...partners, ...partners].map((u, i) => (
            <li
              key={`${u.name}-${i}`}
              className="supporter-card"
              aria-hidden={i >= partners.length}
            >
              <Logo u={u} oculto={i >= partners.length} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Supporters;
