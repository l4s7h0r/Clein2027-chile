import { useMemo } from 'react';
import { qrMatrix } from './qr';

/** Dibuja el primer texto de la lista que quepa en el QR. */
export default function QrCard({ opciones, tam = 220 }: { opciones: string[]; tam?: number }) {
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const matriz = useMemo(() => {
    for (const t of opciones) {
      try { return qrMatrix(t); } catch { /* demasiado largo: prueba la siguiente */ }
    }
    return null;
  }, [opciones]);

  if (!matriz) return <p className="cuenta-error">No se pudo generar el QR.</p>;
  const n = matriz.length, q = 4, total = n + q * 2;
  let d = '';
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (matriz[y][x]) {
        let w = 1;
        while (x + w < n && matriz[y][x + w]) w++;
        d += `M${x + q} ${y + q}h${w}v1h-${w}z`;
        x += w;
      } else x++;
    }
  }
  return (
    <svg viewBox={`0 0 ${total} ${total}`} width={tam} height={tam} shapeRendering="crispEdges" role="img" aria-label="Código QR con tus redes">
      <rect width={total} height={total} fill="#fff" />
      <path d={d} fill="#1D2F5A" />
    </svg>
  );
}
