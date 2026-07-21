import React from 'react';
import './About.css';
import { Target, Users, Globe2 } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="about py-24">
      <div className="container">
        <div className="about-grid">
          <div className="about-content animate-fade-up">
            <h2 className="section-title">El Evento Más Grande de Latinoamérica</h2>
            <div className="title-underline"></div>
            <p className="about-text">
              El <strong>CLEIN</strong> (Congreso Latinoamericano de Estudiantes de Ingeniería Industrial y Afines) es el evento académico, social y cultural de mayor envergadura en su campo.
            </p>
            <p className="about-text">
              Nuestra misión es formar ingenieros integrales, potenciar líderes y fomentar el intercambio de conocimientos en la industria, abordando los desafíos tecnológicos, sostenibles y de gestión del mañana.
            </p>
            
            <div className="about-features mt-8">
              <div className="feature">
                <div className="feature-icon"><Target size={24} /></div>
                <div>
                  <h3>Objetivo</h3>
                  <p>Desarrollar competencias y potenciar el liderazgo.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon"><Users size={24} /></div>
                <div>
                  <h3>Networking</h3>
                  <p>Intercambio con profesionales de toda la región.</p>
                </div>
              </div>
              <div className="feature">
                <div className="feature-icon"><Globe2 size={24} /></div>
                <div>
                  <h3>Sede 2027</h3>
                  <p>Santiago de Chile: Hub tecnológico y sustentable.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="about-visual animate-fade-up delay-200">
            <div className="visual-card glass-dark">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">+15</span>
                  <span className="stat-label">Países</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">+600</span>
                  <span className="stat-label">Asistentes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Días de Inmersión</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">+30</span>
                  <span className="stat-label">Conferencistas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
