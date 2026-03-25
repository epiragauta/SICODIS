// auth.interceptor.ts - VERSIÓN ACTUALIZADA
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { MessageService } from 'primeng/api';
import { catchError, switchMap, throwError } from 'rxjs';

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.status === 0)   return 'Error de conexión. Verifique su conexión a internet e intente nuevamente.';
  if (error.status === 403) return 'No tiene permisos para acceder a esta información.';
  if (error.status === 404) return 'El recurso solicitado no fue encontrado.';
  if (error.status >= 500)  return 'Error en el servidor. Intente nuevamente en unos momentos.';
  return 'No fue posible obtener la información. Intente nuevamente.';
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService    = inject(AuthService);
  const messageService = inject(MessageService);

  // ❌ NO agregar token a la petición de login
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  // ✅ Si no hay token válido, obtener uno primero
  if (!authService.hasValidToken()) {
    return authService.autoLogin().pipe(
      switchMap(() => {
        // Después de obtener el token, agregar y enviar la petición
        const token = authService.getToken();
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error al obtener token en interceptor:', error);
        messageService.add({
          severity: 'error',
          summary: 'Error de autenticación',
          detail: 'No fue posible establecer la sesión. Intente recargar la página.',
        });
        return throwError(() => error);
      })
    );
  }

  // ✅ Si hay token, agregarlo a la petición
  const token = authService.getToken();
  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  // Manejar errores 401 (token expirado)
  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('⚠️ Error 401 - Renovando token...');

        // Obtener nuevo token y reintentar
        return authService.autoLogin().pipe(
          switchMap(() => {
            const newToken = authService.getToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${newToken}`
              }
            });
            return next(retryReq);
          })
        );
      }

      // CC28 — Mostrar mensaje de error visible al usuario para errores no-401
      console.error(`❌ Error HTTP ${error.status}:`, error.url);
      messageService.add({
        severity: 'error',
        summary: 'Error al cargar datos',
        detail: getErrorMessage(error),
      });

      return throwError(() => error);
    })
  );
};