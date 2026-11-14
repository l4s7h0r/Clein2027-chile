import { useState, type FormEvent } from 'react';
import { useNavigate } from '../../core/router';
import { useAuth } from '../../core/auth/AuthContext';
import AvisoDemo from '../../core/ui/AvisoDemo';
import '../../core/ui/ui.css';

export default function NuevaClavePage() {
  const { api } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p = String(f.get('password') ?? '');
    if (p !== String(f.get('password2') ?? '')) { setError('Las contraseñas no coinciden.'); return; }
    const err = await api.auth.cambiarClave(p);
    if (err) setError(err); else navigate('/perfil');
  }

  return (
    <section className="cuenta-card">
      <h1>Nueva contraseña</h1>
      <AvisoDemo />
      <form onSubmit={enviar} className="cuenta-form">
        <label>Nueva contraseña<input type="password" name="password" required minLength={8} autoComplete="new-password" /></label>
        <label>Repítela<input type="password" name="password2" required minLength={8} autoComplete="new-password" /></label>
        {error && <p className="cuenta-error" role="alert">{error}</p>}
        <button className="btn btn-accent" type="submit">Guardar</button>
      </form>
    </section>
  );
}
