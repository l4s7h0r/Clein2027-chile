import React from 'react';
import './Supporters.css';

const universities = [
  { name: 'Universidad de Antofagasta', src: '/universidades/ua.png' },
  { name: 'Universidad Austral de Chile', src: '/universidades/uach.png' },
  { name: 'Universidad de Concepción', src: '/universidades/udec.png' },
  { name: 'Universidad Finis Terrae', src: '/universidades/uft.png' },
  { name: 'Universidad Andrés Bello', src: '/universidades/unab.png' },
];

const Supporters: React.FC = () => {
  return (
    <section id="supporters" className="supporters py-24">
      <div className="container">
        <div className="supporters-header animate-fade-up">
          <h2 className="section-title">Universidades que respaldan la propuesta</h2>
          <div className="title-underline"></div>
          <p className="supporters-text">
            Casas de estudio que enviaron su carta de respaldo a la postulación de Chile.
          </p>
        </div>
      </div>

      <div className="carousel" aria-label="Universidades con carta de respaldo">
        <ul className="carousel-track">
          {[...universities, ...universities].map((u, i) => (
            <li
              key={`${u.name}-${i}`}
              className="supporter-card"
              aria-hidden={i >= universities.length}
            >
              <img src={u.src} alt={i < universities.length ? u.name : ''} loading="lazy" />
            </li>
          ))}
        </ul>
      </div>

    </section>
  );
};

export default Supporters;
