import React, { useState, useEffect } from 'react';
import { Link, useLocation } from '../core/router';
import { useAuth } from '../core/auth/AuthContext';
import { Menu, X } from 'lucide-react';
import './Header.css';

const links = [
  { href: '/#about', label: 'El Evento' },
  { href: '/#pillars', label: 'Pilares' },
  { href: '/#activities', label: 'Actividades' },
  { href: '/#agenda', label: 'Agenda' },
  { href: '/#visits', label: 'Visitas técnicas' },
  { href: '/#participate', label: 'Participa' },
];

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { user } = useAuth();
  const solid = pathname !== '/';
  const cuentaLabel = user ? 'Mi perfil' : 'Ingresar';
  const cuentaTo = user ? '/perfil' : '/cuenta';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled || solid ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="logo">
          <img src="/logo-claro.png" alt="CLEIN Chile 2027" className="logo-img" />
        </div>
        
        <nav className="nav-desktop">
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.href}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>
          <Link to="/como-llegar" className="nav-links-cuenta">Cómo llegar</Link>
          <Link to="/turismo" className="nav-links-cuenta">Turismo</Link>
          <Link to="/inscripcion" className="nav-links-cuenta">Inscripción</Link>
          {user?.rol === 'admin' && <Link to="/admin" className="nav-links-cuenta">Admin</Link>}
          <Link to={cuentaTo} className="nav-links-cuenta">{cuentaLabel}</Link>
          <a href="/#contact" className="btn btn-accent nav-cta">Apoya la propuesta</a>
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
          <Link to="/como-llegar" className="btn" onClick={() => setOpen(false)}>Cómo llegar</Link>
          <Link to="/turismo" className="btn" onClick={() => setOpen(false)}>Turismo</Link>
          <Link to="/inscripcion" className="btn" onClick={() => setOpen(false)}>Inscripción</Link>
          {user?.rol === 'admin' && <Link to="/admin" className="btn" onClick={() => setOpen(false)}>Admin</Link>}
          <Link to={cuentaTo} className="btn" onClick={() => setOpen(false)}>{cuentaLabel}</Link>
          <a href="/#contact" className="btn btn-accent" onClick={() => setOpen(false)}>Apoya la propuesta</a>
        </nav>
      )}
    </header>
  );
};

export default Header;
