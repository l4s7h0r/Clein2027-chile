import React from 'react';
import './Contact.css';
import { Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact py-24">
      <div className="container">
        <div className="contact-box glass-dark animate-fade-up">
          <div className="contact-content">
            <h2 className="contact-title">Apoya nuestra propuesta</h2>
            <p className="contact-description">
              Súmate al equipo y ayúdanos a traer el congreso de ingeniería más grande de Latinoamérica a Santiago de Chile en 2027.
            </p>
            
            <div className="contact-buttons">
              <a 
                href="mailto:benitezhsebastian@gmail.com,fmanzor@bymingenieria.cl?subject=Apoyo%20Propuesta%20CLEIN%20Santiago%202027" 
                className="btn btn-accent btn-large"
              >
                <Mail size={20} />
                Contáctanos ahora
              </a>
            </div>
            
            <div className="contact-emails mt-4">
              <p>También puedes escribirnos directamente a:</p>
              <ul>
                <li><a href="mailto:benitezhsebastian@gmail.com">benitezhsebastian@gmail.com</a></li>
                <li><a href="mailto:fmanzor@bymingenieria.cl">fmanzor@bymingenieria.cl</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
