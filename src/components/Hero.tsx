import React from 'react';
import './Hero.css';
import heroBg from '../assets/hero-bg.png';
import { ChevronRight } from 'lucide-react';
import { CountdownTimer } from './Countdown';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        <img src={heroBg} alt="Santiago de Chile background" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text glass animate-fade-up">
          <img src="/logo-claro.png" alt="CLEIN Chile 2027" className="hero-logo" />
          <p className="hero-subtitle">Postulación Oficial</p>
          <h1 className="hero-title">
            CLEIN <br />
            <span className="text-highlight">Santiago 2027</span>
          </h1>
          <p className="hero-description">
            Ingeniería en Transformación: Impulsando un futuro sostenible, tecnológico y eficiente desde el fin del mundo.
          </p>
          <CountdownTimer />
          <div className="hero-actions">
            <a href="#about" className="btn btn-primary">
              Descubre la propuesta <ChevronRight size={20} />
            </a>
          </div>
        </div>

        <img src="/logo-claro.png" alt="" aria-hidden="true" className="hero-brand" />
      </div>
    </section>
  );
};

export default Hero;
