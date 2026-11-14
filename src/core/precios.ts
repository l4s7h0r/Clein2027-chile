/**
 * Precios, beneficios y niveles de la propuesta presentada (Propuesta CLEIN Chile 2027).
 * Es la ÚNICA fuente: el pop-up «Participa» y la página de Inscripción leen de aquí.
 * Valores sujetos a confirmación del comité.
 */
export interface Etapa {
  id: 1 | 2 | 3;
  nombre: string;
  desde: Date;
  hasta: Date;
  presencial: { student: number; professional: number };
  online: { student: number; professional: number };
}

const d = (iso: string) => new Date(`${iso}T12:00:00-03:00`);
const fin = (iso: string) => new Date(`${iso}T23:59:59-03:00`);

export const ETAPAS: Etapa[] = [
  { id: 1, nombre: 'Primera etapa', desde: d('2027-03-01'), hasta: fin('2027-04-30'), presencial: { student: 230, professional: 250 }, online: { student: 25, professional: 35 } },
  { id: 2, nombre: 'Segunda etapa', desde: d('2027-05-01'), hasta: fin('2027-07-15'), presencial: { student: 240, professional: 260 }, online: { student: 35, professional: 45 } },
  { id: 3, nombre: 'Tercera etapa', desde: d('2027-07-16'), hasta: fin('2027-09-30'), presencial: { student: 255, professional: 275 }, online: { student: 45, professional: 55 } },
];

/** Etapa vigente; antes de la primera se muestra la primera, después de la última, la última. */
export function etapaActual(ahora: Date = new Date()): Etapa {
  return ETAPAS.find((e) => ahora <= e.hasta) ?? ETAPAS[ETAPAS.length - 1];
}

export const INCLUYE_PRESENCIAL = [
  'Acceso a todas las actividades académicas',
  'Workshops certificados',
  'Visitas técnicas',
  'Proyección social',
  'Cóctel de apertura y evento inaugural',
  'Team building',
  '6 coffee breaks',
  '3 almuerzos',
  'Cena de clausura',
  'Pre-CLEIN',
  'Noche cultural chilena',
  'Noche de Naciones',
  'Certificado de participación CLEIN Chile 2027',
];

export const INCLUYE_ONLINE = [
  'Acceso a todas las actividades académicas online',
  'Workshop certificado',
  'Conexión al evento presencial vía streaming',
  'Integración online',
  'Certificado digital de participación',
];

export const NOTA_PRECIOS =
  'Valores en dólares por persona. Se contemplan convenios con universidades (packs 10+1) y tarifas especiales para delegaciones.';
export const NOTA_PAGO =
  'Pago en el sitio oficial con proveedor local de baja comisión (p. ej., Webpay, Flow o Khipu), transferencia bancaria para instituciones y empresas, y alternativa internacional para asistentes del exterior.';

export interface NivelEmpresa { nivel: 'Oro' | 'Platino' | 'Diamante'; aporte: string; beneficios: string[] }
export const NIVELES_EMPRESA: NivelEmpresa[] = [
  { nivel: 'Oro', aporte: '$3.500.000 CLP', beneficios: [
    'Mención de marca', 'Logo en el sitio web y en el material del congreso',
    'Espacio de acercamiento en Expo Innovation', 'Pitch corto' ] },
  { nivel: 'Platino', aporte: '$6.000.000 CLP', beneficios: [
    'Todos los beneficios del nivel Oro', 'Participación en panel o Tech Talk',
    'Posibilidad de ser destino de visita técnica' ] },
  { nivel: 'Diamante', aporte: '$10.000.000 CLP', beneficios: [
    'Todos los beneficios del nivel Platino', 'Liderazgo de un desafío del Reto CLEIN',
    'Presencia destacada en la ceremonia de apertura o clausura' ] },
];
export const NOTA_EMPRESAS =
  'Los beneficios detallados de cada nivel se formalizan en un dossier comercial. Puedes complementar tu aporte con auspicios en especie (por ejemplo merchandising y alimentación).';

export const UNIVERSIDAD_PARTNER = {
  aporte: '$3.000.000 CLP',
  beneficios: [
    'Difusión del congreso en tu comunidad',
    'Envío de delegaciones con tarifa convenio y tarifas especiales para delegaciones',
    'Packs 10+1 para tus estudiantes',
    'Participación en comités y en actividades académicas',
    'Logo en el sitio web como universidad partner',
  ],
  nota: 'El aporte está sujeto a la confirmación formal de cada institución.',
};
