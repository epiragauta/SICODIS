// app.initializer.ts - NUEVO ARCHIVO
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Factory que obtiene el token antes de arrancar la app
 */
export function initializeAuth(authService: AuthService) {
  return (): Observable<boolean> => {
    
    // Si ya hay un token válido, no hacer nada
    if (authService.hasValidToken()) {
      return of(true);
    }

    // Si no hay token, obtener uno automáticamente
    return authService.autoLogin().pipe(
      map(() => {
        return true;
      }),
      catchError((error) => {
        console.error('❌ Error al inicializar token:', error);
        // Continuar de todas formas, el interceptor lo manejará después
        return of(true);
      })
    );
  };
}

/**
 * Provider para el APP_INITIALIZER
 * Agregar esto en app.config.ts
 */
export const AUTH_INITIALIZER = {
  provide: APP_INITIALIZER,
  useFactory: initializeAuth,
  deps: [AuthService],
  multi: true
};