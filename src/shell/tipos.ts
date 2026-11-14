import type { ReactNode } from 'react';
import type { Rol } from '../core/types';

/** Cómo un módulo se "enchufa" al sitio. Agregar un módulo = crear su carpeta en features/ y registrarlo en registry.tsx. */
export interface RutaModulo {
  path: string;
  element: ReactNode;
  acceso: 'publico' | 'sesion' | 'admin';
  /** 'si': dentro del área de cuenta (menú lateral). 'conSesion': solo si hay sesión iniciada. */
  area?: 'si' | 'conSesion';
}

export interface ItemMenu {
  label: string;
  to: string;
  /** Posición en el menú lateral (menor = más arriba). */
  orden: number;
  /** Si se indica, solo lo ve ese rol. */
  rol?: Rol;
}

export interface Modulo {
  id: string;
  rutas: RutaModulo[];
  menu?: ItemMenu[];
}
