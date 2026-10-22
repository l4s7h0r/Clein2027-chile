import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Header.css';

const links = [
  { href: '#about', label: 'El Evento' },
  { href: '#pillars', label: 'Pilares' },
  { href: '#activities', label: 'Actividades' },
  { href: '#agenda', label: 'Agenda' },
  { href: '#visits', label: 'Visitas técnicas' },
  { href: '#participate', label: 'Participa' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
          <img src="/logo.png" alt="CLEIN Santiago 2027" className="logo-img" />
          <span className="logo-text">CLEIN <span className="logo-accent">Santiago 2027</span></span>
        </div>
        
        <nav className="nav-desktop">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-accent nav-cta">Apoya la propuesta</a>
        </nav>

        <button
          className="nav-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="nav-mobile">
          <ul>
            {links.map((l) => (
              <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}</a></li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-accent" onClick={() => setOpen(false)}>Apoya la propuesta</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
