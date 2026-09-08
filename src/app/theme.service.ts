import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { updatePrimaryPalette } from '@primeng/themes';

/**
 * Temas de imagen institucional disponibles.
 *  - 'clasico': imagen actual de SICODIS (Work Sans + azul).
 *  - 'pnd':     nueva imagen PND 2026–2030 (Poppins + azul petróleo).
 */
export type Tema = 'clasico' | 'pnd';

const STORAGE_KEY = 'sicodis-tema';
const TEMA_DEFECTO: Tema = 'clasico';

// Rampa primaria clásica (azul GOV.CO, contraste WCAG AA con blanco).
const PALETA_CLASICA = {
  50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
  500: '#1d4ed8', 600: '#1e40af', 700: '#1e3a8a', 800: '#172554', 900: '#172554', 950: '#172554',
};

// Rampa primaria PND — azul petróleo institucional (#015787).
const PALETA_PND = {
  50: '#e9f2f7', 100: '#cfe2ec', 200: '#9ec4d9', 300: '#6ea7c6', 400: '#3d89b3',
  500: '#015787', 600: '#014b73', 700: '#013e60', 800: '#01324c', 900: '#012639', 950: '#001a28',
};

/**
 * Gestiona el tema visual de la app. Se resuelve por parámetro de URL
 * (`?tema=pnd` | `?tema=clasico`) y se recuerda en localStorage para que
 * sobreviva a la navegación interna (los enlaces del router no arrastran el
 * query param). Aplica dos cosas:
 *   1. Atributo `data-tema` en <html> → activa los tokens CSS (tipografía, etc.).
 *   2. Paleta primaria de PrimeNG en runtime (sin recompilar).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private _tema = signal<Tema>(TEMA_DEFECTO);

  /** Tema activo, como signal para que la UI reaccione a los cambios. */
  readonly tema = this._tema.asReadonly();

  /** Resuelve el tema (URL → localStorage → por defecto) y lo aplica. */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const raw = (new URLSearchParams(window.location.search).get('tema') || '').toLowerCase();
    let tema: Tema;

    if (raw === 'pnd' || raw === 'clasico') {
      tema = raw;
      localStorage.setItem(STORAGE_KEY, tema); // el parámetro manda y se recuerda
    } else {
      tema = (localStorage.getItem(STORAGE_KEY) as Tema) || TEMA_DEFECTO;
    }

    this.apply(tema);
  }

  /** Cambia el tema en caliente (sin recargar) y lo recuerda. */
  set(tema: Tema): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(STORAGE_KEY, tema);
    this.apply(tema);
  }

  private apply(tema: Tema): void {
    this._tema.set(tema);
    document.documentElement.setAttribute('data-tema', tema);
    updatePrimaryPalette(tema === 'pnd' ? PALETA_PND : PALETA_CLASICA);
  }
}
