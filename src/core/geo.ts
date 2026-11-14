import paises from './paises.json';

export interface Pais { code: string; name: string; flag: string; region: string }

export const PAISES: Pais[] = paises;

export const regionDe = (pais: string): string => PAISES.find((p) => p.code === pais)?.region ?? 'Sin región';
export const nombrePais = (pais: string): string => PAISES.find((p) => p.code === pais)?.name ?? pais;
