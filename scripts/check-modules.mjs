// Verifica los límites entre módulos. Uso: npm run check:modules
//  - features/<a> no puede importar de features/<b>
//  - core no puede importar de features, shell ni components
//  - components (portada) no puede importar de features ni shell
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';

const raiz = resolve('src');
const errores = [];

function archivos(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? archivos(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
  });
}

const parte = (ruta) => relative(raiz, ruta).split(sep);

for (const f of archivos(raiz)) {
  const [zona, sub] = parte(f);
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?:from|import)\s+['"](\.[^'"]*)['"]/g)) {
    const destino = resolve(dirname(f), m[1]);
    const [dzona, dsub] = parte(destino);
    if (zona === 'features' && dzona === 'features' && dsub !== sub)
      errores.push(`${relative(raiz, f)}: el módulo «${sub}» importa del módulo «${dsub}» (${m[1]})`);
    if (zona === 'core' && ['features', 'shell', 'components'].includes(dzona))
      errores.push(`${relative(raiz, f)}: core no puede depender de ${dzona} (${m[1]})`);
    if (zona === 'components' && ['features', 'shell'].includes(dzona))
      errores.push(`${relative(raiz, f)}: la portada no puede depender de ${dzona} (${m[1]})`);
  }
}

if (errores.length) {
  console.error('Límites de módulos rotos:\n- ' + errores.join('\n- '));
  process.exit(1);
}
console.log('Módulos OK: sin dependencias cruzadas.');
