import { leerTarjeta } from '../../core/qr/tarjeta';
import '../../core/ui/ui.css';

/** Página que abre el QR: muestra nombre y redes leídos desde el propio enlace (no usa servidor). */
export default function TarjetaPage() {
  const t = leerTarjeta(window.location.hash);
  if (!t) {
    return (
      <section className="cuenta-card">
        <h1>Tarjeta no válida</h1>
        <p>No pudimos leer este código. Pide a la persona que genere uno nuevo desde su perfil.</p>
      </section>
    );
  }
  const iniciales = t.nombre.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
  return (
    <section className="cuenta-card cuenta-tarjeta">
      <div className="cuenta-avatar cuenta-avatar-grande" aria-hidden="true"><span>{iniciales}</span></div>
      <h1>{t.nombre}</h1>
      {t.titular && <p className="cuenta-sub">{t.titular}</p>}
      <ul className="cuenta-redes">
        {t.enlaces.map((e) => (
          <li key={e.etiqueta}>
            <a className="btn cuenta-btn-sec" href={e.url} target="_blank" rel="noopener noreferrer">{e.etiqueta}</a>
          </li>
        ))}
      </ul>
      {t.enlaces.length === 0 && <p className="cuenta-sub">Esta persona aún no agregó redes.</p>}
      <p className="cuenta-sub">CLEIN Chile 2027</p>
    </section>
  );
}
