/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

/** Router mínimo basado en History API (sin dependencias externas). */
interface RouterValue { pathname: string; ir: (to: string, reemplazar?: boolean) => void }
const Ctx = createContext<RouterValue>({ pathname: '/', ir: () => {} });

export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const ir = useCallback((to: string, reemplazar = false) => {
    if (reemplazar) window.history.replaceState(null, '', to); else window.history.pushState(null, '', to);
    setPathname(new URL(to, window.location.origin).pathname);
    window.scrollTo(0, 0);
  }, []);

  const value = useMemo(() => ({ pathname, ir }), [pathname, ir]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useLocation = () => ({ pathname: useContext(Ctx).pathname });
export const useNavigate = () => useContext(Ctx).ir;

export function Link({ to, onClick, ...resto }: { to: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { ir } = useContext(Ctx);
  return (
    <a
      {...resto}
      href={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        ir(to);
      }}
    />
  );
}

export function Navigate({ to }: { to: string; replace?: boolean }) {
  const ir = useNavigate();
  useEffect(() => { ir(to, true); }, [ir, to]);
  return null;
}

export function Routes({ rutas, fallback }: { rutas: Record<string, ReactNode>; fallback: ReactNode }) {
  const { pathname } = useContext(Ctx);
  const limpio = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return <>{rutas[limpio] ?? fallback}</>;
}
