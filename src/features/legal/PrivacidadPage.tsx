import '../../core/ui/ui.css';

/** BORRADOR: debe revisarlo asesoría legal antes de publicarse (Ley 19.628 y Ley 21.719 de Chile). */
export default function PrivacidadPage() {
  return (
    <section className="cuenta-card cuenta-ancha cuenta-texto">
      <h1>Política de privacidad</h1>
      <p className="cuenta-demo">Borrador sujeto a revisión legal antes de publicarse.</p>

      <h2>Quién trata tus datos</h2>
      <p>El comité organizador de CLEIN Chile 2027 (en adelante, «el comité»). Contacto para temas de datos: por definir.</p>

      <h2>Qué datos recopilamos</h2>
      <ul>
        <li>Cuenta: correo, nombre, país y tipo de cuenta (estudiante o profesional).</li>
        <li>Perfil que tú completas: universidad, carrera, titular, texto «sobre mí», foto, enlaces a redes, portafolio y CV.</li>
        <li>Inscripción: categoría, país, estado y descuento aplicado.</li>
        <li>No guardamos contraseñas en texto legible ni datos de tarjetas.</li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Gestionar tu cuenta, tu preinscripción e inscripción y calcular la tarifa que te corresponde.</li>
        <li>Verificar solicitudes de cuenta profesional.</li>
        <li>Comunicarte información del congreso.</li>
        <li>Mostrar tu tarjeta a otros participantes, solo si tú lo activas en tu perfil.</li>
      </ul>

      <h2>Quién puede ver tus datos</h2>
      <p>Tu perfil es privado por defecto. Tu QR solo contiene el nombre, titular y redes que tú guardas en tu perfil; cualquiera que escanee ese QR podrá verlos. El equipo organizador accede a los datos necesarios para administrar el congreso.</p>

      <h2>Cuánto tiempo los guardamos</h2>
      <p>Mientras tu cuenta exista y por el plazo necesario para obligaciones legales y de cierre del evento. Plazo exacto por definir.</p>

      <h2>Tus derechos</h2>
      <p>Puedes acceder a tus datos, rectificarlos, pedir su eliminación, oponerte a su tratamiento y retirar tu consentimiento. Desde tu perfil puedes descargar tus datos y eliminar tu cuenta.</p>
    </section>
  );
}
