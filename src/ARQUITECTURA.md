# Arquitectura del sitio

El sitio se divide en piezas que no se conocen entre sí, para poder cambiar una sin romper las demás.

```
src/
  components/   Portada (Hero, Agenda, Faq…). Cada sección es independiente.
  core/         Base compartida: tipos, api (contratos y demo), sesión, router, geografía, tarifas, QR, estilos.
  features/     Un módulo por carpeta: auth, perfil, inscripcion, admin, tarjeta, legal.
  shell/        Une los módulos: registry.tsx (lista de módulos), menú lateral y control de acceso.
```

## Reglas
1. Un módulo de `features/` **nunca** importa de otro módulo. Lo que comparten vive en `core/`.
2. `core/` no importa de `features/`, `shell/` ni `components/`.
3. La portada (`components/`) no importa de `features/` ni `shell/`.
4. Se verifica con `npm run check:modules`.

## Cómo agregar un módulo
1. Crear `features/mi-modulo/` con sus páginas y un `index.tsx` que exporte `modulo` (rutas y entradas de menú).
2. Agregarlo a la lista de `shell/registry.tsx`.

## Cómo quitar o apagar un módulo
Comentar su línea en `shell/registry.tsx`. Las demás páginas siguen funcionando.

## Fallos aislados
Cada página se muestra dentro de un `ErrorBoundary`: si un módulo falla, el resto del sitio sigue.

## Backend
Los módulos hablan con `core/api.ts` (contratos en `core/apiTypes.ts`). Hoy responde la demostración (`core/demo/`, datos en el navegador). Para conectar Supabase se implementa el mismo contrato y se cambia una línea en `core/api.ts`.
