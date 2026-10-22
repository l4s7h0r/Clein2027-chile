import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-text">CLEIN <span className="logo-accent">Santiago 2027</span></span>
            <p className="footer-tagline">Ingeniería en Transformación</p>
          </div>
          
          <div className="footer-links">
            <a href="#about">El Evento</a>
            <a href="#pillars">Pilares</a>
            <a href="#agenda">Agenda</a>
            <a href="#visits">Visitas técnicas</a>
            <a href="#supporters">Respaldo</a>
            <a href="#faq">Preguntas</a>
            <a href="#contact">Contacto</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Propuesta CLEIN Santiago. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
