import React from 'react';
import './Activities.css';
import { Presentation, Award, MessageSquare, Briefcase, Map, GraduationCap } from 'lucide-react';

const Activities: React.FC = () => {
  const activities = [
    { icon: <Presentation size={24} />, title: "Conferencias Magistrales", desc: "Expertos internacionales en tecnología e industria." },
    { icon: <Award size={24} />, title: "Talleres Certificados", desc: "Formación práctica con herramientas de vanguardia." },
    { icon: <GraduationCap size={24} />, title: "Ponencias Estudiantiles", desc: "Concursos y presentación de investigaciones." },
    { icon: <Briefcase size={24} />, title: "Paneles Empresariales", desc: "Debates con líderes de la industria chilena y latinoamericana." },
    { icon: <MessageSquare size={24} />, title: "Tech Talks", desc: "Charlas cortas sobre innovación y tendencias." },
    { icon: <Map size={24} />, title: "Visitas Técnicas y Turismo", desc: "Recorridos por la industria minera, plantas solares y los atractivos de Santiago." }
  ];

  return (
    <section id="activities" className="activities py-24">
      <div className="container">
        <div className="text-center mb-8 animate-fade-up">
          <h2 className="section-title">Actividades del Evento</h2>
          <div className="title-underline mx-auto"></div>
          <p className="activities-intro">
            Un programa integral diseñado para transformar tu visión profesional y conectarte con el futuro de la ingeniería.
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity, index) => (
            <div key={index} className={`activity-card animate-fade-up delay-${(index % 3 + 1) * 100}`}>
              <div className="activity-icon">
                {activity.icon}
              </div>
              <div className="activity-content">
                <h3>{activity.title}</h3>
                <p>{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
