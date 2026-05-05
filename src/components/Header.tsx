import React, { useState, useEffect } from 'react';
import './Header.css';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          {/* Logo placeholder - Ideally an img tag here */}
          <span className="logo-text">CLEIN <span className="logo-accent">Santiago 2027</span></span>
        </div>
        
        <nav className="nav-desktop">
          <ul className="nav-links">
            <li><a href="#hero">Inicio</a></li>
            <li><a href="#about">El Evento</a></li>
            <li><a href="#pillars">Pilares</a></li>
            <li><a href="#activities">Actividades</a></li>
          </ul>
          <a href="#contact" className="btn btn-accent nav-cta">Apoya la propuesta</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
