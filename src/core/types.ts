export type Rol = 'participante' | 'admin';
export type TipoCuenta = 'student' | 'professional';
export type EstadoPro = 'none' | 'pending' | 'approved' | 'rejected';
export type EstadoInscripcion = 'preinscrito' | 'inscrito' | 'pagado';
export type MetodoPago = 'webpay' | 'paypal';
export type Categoria = 'student' | 'professional';
export type Proveedor = 'google' | 'linkedin_oidc';

export const CATEGORIAS: Record<Categoria, string> = { student: 'Estudiante', professional: 'Profesional' };

export interface Usuario { id: string; email: string; rol: Rol }

export interface Perfil {
  display_name: string;
  country_code: string;
  university_name: string;
  career: string;
  headline: string;
  bio: string;
  linkedin_url: string;
  portfolio_url: string;
  cv_url: string;
  instagram: string;
  x_handle: string;
  github_handle: string;
  avatar_url: string;
  is_public: boolean;
  /** Lo que la persona declara ser. Solo la administración activa la cuenta profesional. */
  account_type: TipoCuenta;
  pro_status: EstadoPro;
}

export interface Inscripcion {
  estado: EstadoInscripcion;
  categoria: Categoria;
  descuento: boolean;
  pais: string;
  region: string;
  creada: string;
}

/** Lo que otras personas ven de alguien que activó su tarjeta en la red. */
export interface TarjetaRed {
  id: string;
  display_name: string;
  headline: string;
  country_code: string;
  university_name: string;
  career: string;
  avatar_url: string;
  es_profesional: boolean;
  linkedin_url: string;
  instagram: string;
  x_handle: string;
  github_handle: string;
  portfolio_url: string;
}

export interface UsuarioAdmin { id: string; email: string; rol: Rol; perfil: Perfil; inscripcion: Inscripcion | null }

export interface DatosRegistro { nombre: string; apellido: string; pais: string; tipo: TipoCuenta }

export const perfilInicial = (nombre: string, pais: string, tipo: TipoCuenta = 'student'): Perfil => ({
  display_name: nombre, country_code: pais, university_name: '', career: '', headline: '', bio: '',
  linkedin_url: '', portfolio_url: '', cv_url: '', instagram: '', x_handle: '', github_handle: '', avatar_url: '',
  is_public: false, account_type: tipo, pro_status: tipo === 'professional' ? 'pending' : 'none',
});
