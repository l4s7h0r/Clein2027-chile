import { useAuth } from '../auth/AuthContext';

export default function AvisoDemo() {
  const { demo } = useAuth();
  if (!demo) return null;
  return <p className="cuenta-demo">Modo demostración: tus datos se guardan solo en este navegador y no se envían a ningún servidor.</p>;
}
