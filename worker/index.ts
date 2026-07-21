import { WorkerMailer } from 'worker-mailer';

interface Env {
  SMTP_HOST: string;
  SMTP_PORT: string;
  SMTP_USER: string;
  SMTP_PASS: string;
  CONTACT_TO: string;
}

type TipoParticipacion = 'sponsor' | 'asistente' | 'gestionador';

interface ContactPayload {
  nombre: string;
  email: string;
  tipo: TipoParticipacion;
  empresa?: string;
  mensaje?: string;
}

const TIPO_LABEL: Record<TipoParticipacion, string> = {
  sponsor: 'Sponsor',
  asistente: 'Asistente',
  gestionador: 'Gestionador / Organizador',
};

function parsePayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  if (typeof b.nombre !== 'string' || b.nombre.trim().length === 0) return null;
  if (typeof b.email !== 'string' || !b.email.includes('@')) return null;
  if (typeof b.tipo !== 'string' || !(b.tipo in TIPO_LABEL)) return null;

  return {
    nombre: b.nombre.trim(),
    email: b.email.trim(),
    tipo: b.tipo as TipoParticipacion,
    empresa: typeof b.empresa === 'string' ? b.empresa.trim() : undefined,
    mensaje: typeof b.mensaje === 'string' ? b.mensaje.trim() : undefined,
  };
}

async function handleContact(request: Request, env: Env): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return Response.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const payload = parsePayload(rawBody);
  if (!payload) {
    return Response.json({ error: 'Faltan campos requeridos' }, { status: 400 });
  }

  try {
    const port = Number(env.SMTP_PORT) || 587;
    const secure = port === 465;

    await WorkerMailer.send(
      {
        host: env.SMTP_HOST,
        port,
        secure,
        startTls: !secure,
        credentials: {
          username: env.SMTP_USER,
          password: env.SMTP_PASS,
        },
        authType: 'plain',
      },
      {
        from: { name: 'CLEIN Santiago 2027 — Formulario', email: env.SMTP_USER },
        to: { email: env.CONTACT_TO },
        reply: { name: payload.nombre, email: payload.email },
        subject: `Nuevo interesado (${TIPO_LABEL[payload.tipo]}) — ${payload.nombre}`,
        text: [
          `Nombre: ${payload.nombre}`,
          `Email: ${payload.email}`,
          `Tipo de participación: ${TIPO_LABEL[payload.tipo]}`,
          `Empresa / Organización: ${payload.empresa || '—'}`,
          '',
          'Mensaje:',
          payload.mensaje || '(sin mensaje)',
        ].join('\n'),
      },
    );

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Error enviando correo de contacto:', err);
    return Response.json({ error: 'No se pudo enviar el correo' }, { status: 502 });
  }
}

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/contact' && request.method === 'POST') {
      return handleContact(request, env);
    }

    return new Response('Not found', { status: 404 });
  },
} satisfies ExportedHandler<Env>;
