import { useState } from 'react';
import { useAuth } from '../../core/auth/AuthContext';
import '../../core/ui/ui.css';

export default function DatosPrivacidadPage() {
  const { user, api } = useAuth();
  const [confirmar, setConfirmar] = useState('');
  if (!user) return null;

  async function descargar() {
    if (!user) return;
    const datos = await api.perfil.exportarDatos(user.id);
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'mis-datos-clein.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function borrar() {
    if (user && confirmar === 'ELIMINAR') await api.auth.borrarCuenta(user.id);
  }

  return (
    <section className="cuenta-card cuenta-ancha">
      <h1>Privacidad y datos</h1>
      <div className="cuenta-bloque">
        <p><a href="/privacidad" className="cuenta-enlace">Política de privacidad</a></p>
        <div><button type="button" className="btn cuenta-btn-sec" onClick={descargar}>Descargar mis datos (JSON)</button></div>
        <details className="cuenta-peligro">
          <summary>Eliminar mi cuenta</summary>
          <p>Se borrarán tu perfil y tu inscripción. No se puede deshacer. Escribe <strong>ELIMINAR</strong> para confirmar.</p>
          <input value={confirmar} onChange={(e) => setConfirmar(e.target.value)} aria-label="Escribe ELIMINAR" />
          <button type="button" className="btn cuenta-btn-peligro" disabled={confirmar !== 'ELIMINAR'} onClick={borrar}>Eliminar definitivamente</button>
        </details>
      </div>
    </section>
  );
}
