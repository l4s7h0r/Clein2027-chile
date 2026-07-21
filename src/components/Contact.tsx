import React, { useState } from 'react';
import './Contact.css';
import { Mail, Loader2, CheckCircle2, XCircle } from 'lucide-react';

type Tipo = 'sponsor' | 'asistente' | 'gestionador';
type Status = 'idle' | 'sending' | 'success' | 'error';

interface FormState {
  nombre: string;
  email: string;
  tipo: Tipo;
  empresa: string;
  mensaje: string;
}

const initialForm: FormState = {
  nombre: '',
  email: '',
  tipo: 'asistente',
  empresa: '',
  mensaje: '',
};

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('request failed');

      setStatus('success');
      setForm(initialForm);
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="contact py-24">
      <div className="container">
        <div className="contact-box glass-dark animate-fade-up">
          <div className="contact-content">
            <h2 className="contact-title">Apoya nuestra propuesta</h2>
            <p className="contact-description">
              Súmate al equipo y ayúdanos a traer el congreso de ingeniería más grande de Latinoamérica a Santiago de Chile en 2027.
              Como sponsor, asistente o gestionador, cuéntanos cómo quieres participar.
            </p>

            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="email">Correo *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="tipo">Quiero participar como *</label>
                  <select id="tipo" name="tipo" required value={form.tipo} onChange={handleChange}>
                    <option value="asistente">Asistente</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="gestionador">Gestionador / Organizador</option>
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="empresa">Empresa u organización</label>
                  <input
                    id="empresa"
                    name="empresa"
                    type="text"
                    value={form.empresa}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="mensaje">Mensaje</label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  value={form.mensaje}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-accent btn-large" disabled={status === 'sending'}>
                {status === 'sending' ? <Loader2 size={20} className="spin" /> : <Mail size={20} />}
                {status === 'sending' ? 'Enviando...' : 'Enviar'}
              </button>

              {status === 'success' && (
                <p className="form-status form-status-success">
                  <CheckCircle2 size={18} /> ¡Gracias! Recibimos tu mensaje y te contactaremos pronto.
                </p>
              )}
              {status === 'error' && (
                <p className="form-status form-status-error">
                  <XCircle size={18} /> No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos directamente.
                </p>
              )}
            </form>

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
