import React, { useState } from 'react';
import './Supporters.css';

const universities = [
  { name: 'Universidad de Antofagasta', src: '/universidades/ua.png' },
  { name: 'Universidad Austral de Chile', src: '/universidades/uach.png' },
  { name: 'Universidad de Concepción', src: '/universidades/udec.png' },
  { name: 'Universidad Finis Terrae', src: '/universidades/uft.png' },
  { name: 'Universidad Andrés Bello', src: '/universidades/unab.png' },
];

// Los logos van en public/empresas/. Mientras no exista el archivo se muestra el nombre.
const companies = [
  { name: 'Enel', area: 'Energía', logo: '/empresas/enel.png' },
  { name: 'Centro Remoto Minero', area: 'Minería', logo: '/empresas/centro-remoto-minero.png' },
  { name: 'Mercado Libre', area: 'Logística y retail', logo: '/empresas/mercado-libre.png' },
  { name: 'Falabella', area: 'Logística y retail', logo: '/empresas/falabella.png' },
  { name: 'Coca-Cola', area: 'Manufactura', logo: '/empresas/coca-cola.png' },
];

const CompanyLogo: React.FC<{ name: string; logo: string }> = ({ name, logo }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="company-name">{name}</span>;
  return (
    <img
      className="company-logo"
      src={logo}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

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

      <div className="container companies">
        <h3 className="companies-title">Empresas en conversaciones</h3>
        <p className="supporters-text">
          Visitas técnicas y alianzas que estamos conversando. Aún no hay ninguna confirmada.
        </p>
        <ul className="companies-grid">
          {companies.map((c) => (
            <li key={c.name} className="company-card">
              <div className="company-logo-box">
                <CompanyLogo name={c.name} logo={c.logo} />
              </div>
              <span className="company-area">{c.area}</span>
              <span className="company-badge">En conversaciones</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Supporters;
