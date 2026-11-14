import { ETAPAS, etapaActual } from '../precios';
import { fechaLarga, formatoMoneda } from '../tarifas';

/** Tabla de precios por etapa, modalidad y categoría. Compartida por la inscripción y el pop-up. */
export default function TablaPrecios({ modalidad }: { modalidad: 'presencial' | 'online' }) {
  const vigente = etapaActual().id;
  return (
    <table className="cuenta-tabla">
      <thead><tr><th>Etapa</th><th>Fechas de pago</th><th>Estudiantes</th><th>Profesionales</th></tr></thead>
      <tbody>
        {ETAPAS.map((e) => (
          <tr key={e.id} className={e.id === vigente ? 'cuenta-fila-propia' : ''}>
            <td>{e.nombre}{e.id === vigente ? ' (vigente)' : ''}</td>
            <td>{fechaLarga(e.desde)} al {fechaLarga(e.hasta)}</td>
            <td>{formatoMoneda(e[modalidad].student)}</td>
            <td>{formatoMoneda(e[modalidad].professional)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
