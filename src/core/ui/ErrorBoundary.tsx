import { Component, type ErrorInfo, type ReactNode } from 'react';

/** Aísla fallos: si una sección falla, el resto del sitio sigue funcionando. */
export default class ErrorBoundary extends Component<{ nombre: string; children: ReactNode }, { fallo: boolean }> {
  state = { fallo: false };
  static getDerivedStateFromError() { return { fallo: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(`Error en el módulo «${this.props.nombre}»`, error, info.componentStack); }
  render() {
    if (this.state.fallo) {
      return (
        <section className="cuenta-card">
          <h1>Algo salió mal</h1>
          <p>Esta sección tuvo un problema. Recarga la página o vuelve al <a href="/">inicio</a>.</p>
        </section>
      );
    }
    return this.props.children;
  }
}
