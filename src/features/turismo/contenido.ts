/**
 * Contenido de «Turismo en Chile». Se edita solo aquí.
 * Datos referenciales (tiempos de viaje aproximados desde Santiago); conviene revisarlos antes de publicar.
 */
export interface Destino { nombre: string; detalle: string }
export interface Grupo { titulo: string; intro?: string; destinos: Destino[] }

export const INTRO =
  'Chile se extiende por más de 4.000 km, entre el desierto más árido del mundo y los glaciares del sur. Si te quedas unos días más, aquí van ideas para aprovechar el viaje.';

export const GRUPOS: Grupo[] = [
  {
    titulo: 'En Santiago',
    intro: 'Lugares que se pueden recorrer en pocas horas, en Metro o a pie.',
    destinos: [
      { nombre: 'Cerro San Cristóbal', detalle: 'Mirador, parque y funicular con vista a toda la ciudad y a la cordillera.' },
      { nombre: 'Cerro Santa Lucía y centro histórico', detalle: 'Plaza de Armas, Catedral, Palacio de La Moneda y el Museo Histórico Nacional, todo cerca.' },
      { nombre: 'Barrio Bellavista y La Chascona', detalle: 'Casa de Pablo Neruda, cafés, murales y vida nocturna.' },
      { nombre: 'Museo de la Memoria y los Derechos Humanos', detalle: 'Imperdible para entender la historia reciente del país.' },
      { nombre: 'Barrio Lastarria y Bellas Artes', detalle: 'Museos, librerías, restaurantes y terrazas para caminar con calma.' },
    ],
  },
  {
    titulo: 'Escapadas desde Santiago (1 día)',
    destinos: [
      { nombre: 'Valparaíso y Viña del Mar', detalle: 'A unas 1,5 horas. Cerros coloridos, ascensores históricos, puerto y borde costero (Patrimonio de la Humanidad).' },
      { nombre: 'Cajón del Maipo', detalle: 'A cerca de 1 hora. Montaña, termas y caminatas cortas.' },
      { nombre: 'Valles vitivinícolas', detalle: 'Casablanca, Maipo y Colchagua: viñas con degustación; Chile es famoso por su Carmenere.' },
      { nombre: 'Centros de ski', detalle: 'Valle Nevado, La Parva y El Colorado, a cerca de 1 a 1,5 horas. Atractivo si el evento cae en invierno.' },
    ],
  },
  {
    titulo: 'Para extender el viaje',
    intro: 'Requieren vuelo o más días; conviene reservar con anticipación.',
    destinos: [
      { nombre: 'San Pedro de Atacama', detalle: 'Desierto, salares, géiseres del Tatio y cielos de los más limpios del mundo para ver estrellas.' },
      { nombre: 'Torres del Paine', detalle: 'Parque nacional en la Patagonia, con glaciares, lagos y senderos famosos.' },
      { nombre: 'Rapa Nui (Isla de Pascua)', detalle: 'Moáis y cultura polinesia, a unas 5 horas de vuelo desde Santiago.' },
      { nombre: 'Lagos y volcanes (Pucón, Puerto Varas)', detalle: 'Bosques, volcanes, termas y, en invierno, ski y nieve.' },
      { nombre: 'Chiloé', detalle: 'Iglesias de madera patrimoniales, palafitos y gastronomía de mar.' },
    ],
  },
];

export const COMIDA: string[] = [
  'Empanada de pino (horneada) y pastel de choclo.',
  'Completo (el hot dog chileno) y sándwich de lomito o churrasco.',
  'Cazuela, porotos granados y, en la costa, mariscos y pescado fresco (ceviche, caldillo de congrio).',
  'Para beber: pisco sour, vino chileno, mote con huesillo y terremoto (con moderación).',
  'Dulces: sopaipillas, alfajores y calzones rotos.',
];

export const CONSEJOS: string[] = [
  'Propina: en restaurantes se acostumbra dejar un 10 % del total (se pide al pagar).',
  'En el centro y en los barrios turísticos, cuida tus pertenencias como en cualquier gran ciudad; evita sacar el celular en lugares muy llenos.',
  'Usa protector solar y lentes: la radiación es alta, incluso en invierno y en la cordillera.',
  'Chile es un país sísmico: si sientes un temblor, mantén la calma y sigue las indicaciones del lugar.',
  'Reserva con anticipación los tours y vuelos internos, sobre todo a Rapa Nui, Atacama y la Patagonia.',
  'Revisa el clima y el estado de los caminos antes de ir a la montaña o a centros de ski.',
  'El español chileno tiene muchas palabras propias; si no entiendes algo, pregunta con confianza.',
];
