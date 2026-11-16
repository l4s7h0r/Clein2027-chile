import { Link } from '../../core/router';
import { COMIDA, CONSEJOS, GRUPOS, INTRO } from './contenido';
import '../../core/ui/ui.css';

export default function TurismoPage() {
  return (
    <section className="cuenta-card cuenta-ancha cuenta-texto">
      <h1>Turismo en Chile</h1>
      <p className="cuenta-demo">Información referencial. Revisa horarios, tiempos de viaje y requisitos antes de salir.</p>
      <p>{INTRO}</p>

      {GRUPOS.map((g) => (
        <div key={g.titulo}>
          <h2>{g.titulo}</h2>
          {g.intro && <p>{g.intro}</p>}
          <ul>
            {g.destinos.map((d) => (
              <li key={d.nombre}><strong>{d.nombre}.</strong> {d.detalle}</li>
            ))}
          </ul>
        </div>
      ))}

      <h2>Qué probar</h2>
      <ul>{COMIDA.map((i) => <li key={i}>{i}</li>)}</ul>

      <h2>Consejos para el viaje</h2>
      <ul>{CONSEJOS.map((i) => <li key={i}>{i}</li>)}</ul>

      <p>¿Dudas sobre vuelos, visas o transporte? Revisa <Link to="/como-llegar" className="cuenta-enlace">Cómo llegar a Chile →</Link></p>
    </section>
  );
}
