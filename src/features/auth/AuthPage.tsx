import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from '../../core/router';
import { useAuth } from '../../core/auth/AuthContext';
import AvisoDemo from '../../core/ui/AvisoDemo';
import { PAISES } from '../../core/geo';
import type { Proveedor, TipoCuenta } from '../../core/types';
import '../../core/ui/ui.css';

type Modo = 'entrar' | 'registro' | 'recuperar';

export default function AuthPage() {
  const { user, cargando, api } = useAuth();
  const navigate = useNavigate();
  const [modo, setModo] = useState<Modo>('entrar');
  const [tipo, setTipo] = useState<TipoCuenta>('student');
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!cargando && user) return <Navigate to="/perfil" replace />;

  const cambiar = (m: Modo) => { setModo(m); setError(null); setAviso(null); };

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get('email') ?? '').trim();
    const password = String(f.get('password') ?? '');
    setError(null); setAviso(null); setEnviando(true);
    try {
      if (modo === 'entrar') {
        const err = await api.auth.entrar(email, password);
        if (err) setError(err); else navigate('/perfil');
      } else if (modo === 'registro') {
        if (password !== String(f.get('password2') ?? '')) { setError('Las contraseñas no coinciden.'); return; }
        if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
        const r = await api.auth.registrar(email, password, {
          nombre: String(f.get('nombre') ?? ''),
          apellido: String(f.get('apellido') ?? ''),
          pais: String(f.get('pais') ?? 'CL'),
          tipo,
        });
        if (r.error) setError(r.error);
        else if (r.requiereConfirmar) setAviso('Te enviamos un correo para confirmar tu cuenta. Ábrelo y vuelve aquí.');
        else navigate('/perfil');
      } else {
        const err = await api.auth.recuperar(email);
        if (err) setError(err); else setAviso('Si el correo existe, te enviamos un enlace para crear una nueva contraseña.');
      }
    } finally {
      setEnviando(false);
    }
  }

  async function conProveedor(p: Proveedor) {
    setError(null);
    const err = await api.auth.proveedor(p);
    if (err) setError(err);
  }

  const titulo = modo === 'entrar' ? 'Iniciar sesión' : modo === 'registro' ? 'Crear cuenta' : 'Recuperar contraseña';

  return (
    <section className="cuenta-card">
      <h1>{titulo}</h1>
      <AvisoDemo />
      <form onSubmit={enviar} className="cuenta-form">
        {modo === 'registro' && (
          <>
            <div className="cuenta-fila">
              <label>Nombre<input name="nombre" required maxLength={60} autoComplete="given-name" /></label>
              <label>Apellido<input name="apellido" required maxLength={60} autoComplete="family-name" /></label>
            </div>
            <label>País
              <select name="pais" defaultValue="CL" required>
                {PAISES.map((p) => <option key={p.code} value={p.code}>{p.flag} {p.name}</option>)}
              </select>
            </label>
            <fieldset className="cuenta-tipo">
              <legend>¿Cómo vas a participar?</legend>
              <label className="cuenta-check">
                <input type="radio" name="tipo" checked={tipo === 'student'} onChange={() => setTipo('student')} /> Estudiante
              </label>
              <label className="cuenta-check">
                <input type="radio" name="tipo" checked={tipo === 'professional'} onChange={() => setTipo('professional')} /> Profesional
              </label>
              {tipo === 'professional' && (
                <p className="cuenta-nota">
                  La cuenta de profesional la activa el equipo organizador después de revisar tu solicitud. Mientras tanto
                  tu perfil queda «pendiente de aprobación» y podrás completar tus datos, pero no inscribirte como profesional hasta que te la aprueben.
                </p>
              )}
            </fieldset>
          </>
        )}
        <label>Correo<input type="email" name="email" required autoComplete="email" /></label>
        {modo !== 'recuperar' && (
          <label>Contraseña
            <input type="password" name="password" required minLength={8} autoComplete={modo === 'entrar' ? 'current-password' : 'new-password'} />
          </label>
        )}
        {modo === 'registro' && (
          <>
            <label>Repite la contraseña<input type="password" name="password2" required minLength={8} autoComplete="new-password" /></label>
            <label className="cuenta-check">
              <input type="checkbox" required /> Acepto la <a href="/privacidad" target="_blank" rel="noreferrer">política de privacidad</a> y el tratamiento de mis datos para gestionar mi participación en el congreso.
            </label>
          </>
        )}
        {error && <p className="cuenta-error" role="alert">{error}</p>}
        {aviso && <p className="cuenta-aviso" role="status">{aviso}</p>}
        <button className="btn btn-accent" type="submit" disabled={enviando}>
          {enviando ? 'Enviando…' : titulo}
        </button>
      </form>

      {modo !== 'recuperar' && (
        <div className="cuenta-proveedores">
          <span>o continúa con</span>
          <button type="button" className="btn cuenta-btn-sec" onClick={() => conProveedor('google')}>Google</button>
          <button type="button" className="btn cuenta-btn-sec" onClick={() => conProveedor('linkedin_oidc')}>LinkedIn</button>
        </div>
      )}

      <p className="cuenta-enlaces">
        {modo === 'entrar' && (<>
          <button type="button" onClick={() => cambiar('recuperar')}>¿Olvidaste tu contraseña?</button>
          <button type="button" onClick={() => cambiar('registro')}>¿No tienes cuenta? Crear cuenta</button>
        </>)}
        {modo !== 'entrar' && <button type="button" onClick={() => cambiar('entrar')}>Volver a iniciar sesión</button>}
      </p>
    </section>
  );
}
