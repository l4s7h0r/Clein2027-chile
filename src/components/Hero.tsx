import React from 'react';
import './Hero.css';
import heroBg from '../assets/hero-bg.png';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg">
        <img src={heroBg} alt="Santiago de Chile background" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text glass animate-fade-up">
          <p className="hero-subtitle">Postulación Oficial</p>
          <h1 className="hero-title">
            CLEIN <br />
            <span className="text-highlight">Santiago 2027</span>
          </h1>
          <p className="hero-description">
            Ingeniería en Transformación: Impulsando un futuro sostenible, tecnológico y eficiente desde el fin del mundo.
          </p>
          <div className="hero-actions">
            <a href="#about" className="btn btn-primary">
              Descubre la propuesta <ChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
