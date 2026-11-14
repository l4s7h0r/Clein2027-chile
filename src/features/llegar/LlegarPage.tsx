import { BLOQUES, SEDE } from './contenido';
import '../../core/ui/ui.css';

export default function LlegarPage() {
  return (
    <section className="cuenta-card cuenta-ancha cuenta-texto">
      <h1>Cómo llegar a Chile</h1>
      <p className="cuenta-demo">Información referencial. Los datos marcados «por confirmar» se actualizarán cuando el comité los defina.</p>

      <div className="llegar-sede">
        <p><strong>{SEDE.ciudad}</strong></p>
        <p>{SEDE.fechas}</p>
        <p>{SEDE.hotel}</p>
        <p>{SEDE.direccion}</p>
      </div>

      {BLOQUES.map((b) => (
        <div key={b.titulo}>
          <h2>{b.titulo}</h2>
          <ul>{b.items.map((i) => <li key={i}>{i}</li>)}</ul>
        </div>
      ))}
    </section>
  );
}
