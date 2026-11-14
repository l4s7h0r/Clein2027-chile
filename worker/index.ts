import { EmailMessage } from 'cloudflare:email';
import { createMimeMessage, Mailbox } from 'mimetext';

interface Env {
  SEND_EMAIL: SendEmail;
  /** Remitente: debe ser una dirección de un dominio con Email Routing activo. */
  CONTACT_FROM: string;
  /** Destinatario: debe estar verificado como destination address en Email Routing. */
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
    const msg = createMimeMessage();
    msg.setSender({ name: 'CLEIN Santiago 2027 — Formulario', addr: env.CONTACT_FROM });
    msg.setRecipient(env.CONTACT_TO);
    const safeNombre = payload.nombre.replace(/[<>"\r\n]/g, '');
    const safeEmail = payload.email.replace(/[<>\s]/g, '');
    msg.setHeader('Reply-To', new Mailbox({ name: safeNombre, addr: safeEmail }));
    msg.setSubject(`Nuevo interesado (${TIPO_LABEL[payload.tipo]}) — ${payload.nombre}`);
    msg.addMessage({
      contentType: 'text/plain',
      data: [
        `Nombre: ${payload.nombre}`,
        `Email: ${payload.email}`,
        `Tipo de participación: ${TIPO_LABEL[payload.tipo]}`,
        `Empresa / Organización: ${payload.empresa || '—'}`,
        '',
        'Mensaje:',
        payload.mensaje || '(sin mensaje)',
      ].join('\n'),
    });

    await env.SEND_EMAIL.send(new EmailMessage(env.CONTACT_FROM, env.CONTACT_TO, msg.asRaw()));

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
