import React from 'react';
import './Faq.css';

const faqs = [
  {
    q: '¿Qué es el CLEIN?',
    a: 'El Congreso Latinoamericano de Estudiantes de Ingeniería Industrial y Afines, el encuentro académico, social y cultural más grande de su campo en la región.',
  },
  {
    q: '¿Cuándo y dónde será el CLEIN 2027?',
    a: 'Del 24 al 29 de octubre de 2027 en Santiago de Chile, con el Hotel Le Méridien como sede. Las fechas son tentativas y las confirmaremos con ALEIIAF.',
  },
  {
    q: '¿Cuántas personas participarán?',
    a: 'Estimamos 500 asistentes de Chile y de más de 15 países de la región.',
  },
  {
    q: '¿Cuáles son los ejes del congreso?',
    a: 'Green Shift (energías renovables y economía circular), Smart Mining (automatización, cobre y litio) e Intelligent Decisions (datos e inteligencia artificial).',
  },
  {
    q: '¿Cómo llegan los asistentes extranjeros?',
    a: 'Casi todos por el aeropuerto de Santiago (SCL). Habrá recepción de delegaciones, guía de llegada por país y carta de invitación oficial para quienes necesiten visa.',
  },
  {
    q: '¿Cómo puede mi universidad o empresa ser parte?',
    a: 'Completa el formulario de contacto y elige tu perfil. Nuestro equipo te escribirá con las opciones de participación y patrocinio.',
  },
];

const Faq: React.FC = () => {
  return (
    <section id="faq" className="faq py-24">
      <div className="container faq-container">
        <div className="text-center mb-8">
          <h2 className="section-title">Preguntas frecuentes</h2>
          <div className="title-underline mx-auto"></div>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q} className="faq-item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
