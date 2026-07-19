// app.config.ts - VERSIÓN ACTUALIZADA
import {
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeng/themes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AUTH_INITIALIZER } from './app.initializer'; // 👈 NUEVO
import { MessageService } from 'primeng/api';

// Paleta ajustada para cumplir contraste WCAG AA (≥ 4.5:1) con texto blanco.
// blue.500 (#3b82f6) tiene ratio 3.4:1 — insuficiente.
// blue.700 (#1d4ed8) tiene ratio 6.0:1 — cumple (referencia paleta GOV.CO).
const MyPreset = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.700}',   // ratio 6.0:1 con blanco ✓ (era blue.500 = 3.4:1 ✗)
      600: '{blue.800}',   // ratio 7.8:1 con blanco ✓
      700: '{blue.900}',
      800: '{blue.950}',
      900: '{blue.950}',
      950: '{blue.950}'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),

    // 🔐 HTTP Client con interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    // 💬 Notificaciones globales (p-toast en app.component.html)
    MessageService,

    // 🆕 Inicializador - Obtiene el token ANTES de arrancar la app
    AUTH_INITIALIZER,

    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'none',
          cssLayer: false,
        }
      }
    })
  ],
};