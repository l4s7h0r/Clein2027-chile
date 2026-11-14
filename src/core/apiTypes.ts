import type {
  DatosRegistro, EstadoInscripcion, Inscripcion, MetodoPago, Perfil, Proveedor, TarjetaRed, Usuario, UsuarioAdmin,
} from './types';

/** Contratos del "backend". Hoy los implementa la demostración (navegador); luego, Supabase. Cada módulo usa solo su parte. */

export interface AuthApi {
  sesion(): Promise<Usuario | null>;
  alCambiar(cb: (u: Usuario | null) => void): () => void;
  entrar(email: string, password: string): Promise<string | null>;
  registrar(email: string, password: string, d: DatosRegistro): Promise<{ error: string | null; requiereConfirmar: boolean }>;
  proveedor(p: Proveedor): Promise<string | null>;
  recuperar(email: string): Promise<string | null>;
  cambiarClave(password: string): Promise<string | null>;
  salir(): Promise<void>;
  borrarCuenta(id: string): Promise<void>;
}

export interface PerfilApi {
  cargar(id: string): Promise<Perfil | null>;
  guardar(id: string, p: Perfil): Promise<string | null>;
  solicitarProfesional(id: string): Promise<string | null>;
  volverAEstudiante(id: string): Promise<string | null>;
  exportarDatos(id: string): Promise<unknown>;
}

export interface InscripcionApi {
  mia(id: string): Promise<Inscripcion | null>;
  inscribir(id: string, estado: EstadoInscripcion): Promise<string | null>;
  confirmar(id: string): Promise<string | null>;
  cancelar(id: string): Promise<string | null>;
  /** Hoy simulado: no cobra nada. Con pasarela real, devolverá la URL de pago. */
  pagar(id: string, metodo: MetodoPago): Promise<string | null>;
  preinscripcionAbierta(): boolean;
}

export interface RedApi {
  /** Personas con tarjeta pública, sin incluirte a ti. */
  directorio(yo: string): Promise<TarjetaRed[]>;
  siguiendo(yo: string): Promise<string[]>;
  seguir(yo: string, otro: string): Promise<string | null>;
  dejarDeSeguir(yo: string, otro: string): Promise<string | null>;
}

export interface AdminApi {
  listarUsuarios(): Promise<UsuarioAdmin[]>;
  decidirProfesional(id: string, aprobar: boolean): Promise<string | null>;
  /** Solo demostración: simular que la preinscripción ya cerró. */
  cierreSimulado(): boolean;
  simularCierre(cerrada: boolean): void;
  /** Solo demostración: crea participantes de ejemplo para ver la red. */
  sembrarEjemplos?(): Promise<number>;
}

export interface Api {
  /** true cuando no hay base de datos: todo se guarda solo en este navegador. */
  demo: boolean;
  auth: AuthApi;
  perfil: PerfilApi;
  inscripcion: InscripcionApi;
  red: RedApi;
  admin: AdminApi;
}
