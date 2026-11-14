/**
 * Contenido de «Cómo llegar a Chile». Se edita solo aquí.
 * Lo marcado como «por confirmar» se reemplaza cuando el comité lo defina.
 * Revisar los datos de transporte y visas antes de publicar (pueden cambiar).
 */
export interface Bloque { titulo: string; items: string[] }

export const SEDE = {
  ciudad: 'Santiago de Chile',
  fechas: 'Fechas por confirmar',
  hotel: 'Hotel sede por confirmar (Le Méridien o Marriott Santiago)',
  direccion: 'Dirección por confirmar',
};

export const BLOQUES: Bloque[] = [
  {
    titulo: 'Aeropuerto',
    items: [
      'Llegarás al Aeropuerto Internacional Arturo Merino Benítez (SCL), en Pudahuel, a unos 15 km del centro de Santiago.',
      'Aun con vuelos conectados, la migración y el retiro de maletas pueden tomar entre 1 y 2 horas en horas punta.',
    ],
  },
  {
    titulo: 'Del aeropuerto a Santiago',
    items: [
      'Buses directos al centro y a estaciones de Metro (por ejemplo, a la estación Pajaritos de la Línea 1): son la opción más económica.',
      'Taxis y transfers con tarifa informada en los mostradores oficiales del aeropuerto.',
      'Aplicaciones de transporte (Uber, Cabify, DiDi): revisa los puntos de encuentro indicados en el aeropuerto.',
      'Transfer coordinado por el congreso: por confirmar.',
    ],
  },
  {
    titulo: 'Moverse en la ciudad',
    items: [
      'Metro de Santiago: rápido y seguro; se paga con la tarjeta Bip! (recargable en estaciones).',
      'Buses del transporte público (Red), también con tarjeta Bip!.',
      'Taxis y aplicaciones de transporte para trayectos nocturnos.',
    ],
  },
  {
    titulo: 'Ingreso al país',
    items: [
      'Necesitas pasaporte o documento de viaje válido. Algunos países requieren visa: consúltalo con el consulado de Chile más cercano antes de comprar pasajes.',
      'Declara correctamente alimentos, plantas o productos de origen animal: el SAG controla el ingreso.',
      'Si necesitas una carta de invitación para tu visa, escríbenos desde la sección de contacto.',
    ],
  },
  {
    titulo: 'Clima y qué llevar',
    items: [
      'El evento sería en invierno en Chile: las mañanas y noches son frías (entre 2 °C y 15 °C aproximadamente). Lleva abrigo.',
      'Enchufes tipo C y L, 220 V. Un adaptador universal ayuda.',
    ],
  },
  {
    titulo: 'Dinero y conectividad',
    items: [
      'Moneda: peso chileno (CLP). Se aceptan tarjetas de crédito y débito en la mayoría de los lugares.',
      'Conviene tener algo de efectivo para transporte y compras pequeñas.',
      'Datos móviles: puedes usar eSIM o comprar una SIM local; el hotel sede tendrá wifi (por confirmar).',
    ],
  },
  {
    titulo: 'Emergencias',
    items: ['Ambulancia (SAMU): 131 · Bomberos: 132 · Carabineros: 133. Son gratuitos.'],
  },
];
