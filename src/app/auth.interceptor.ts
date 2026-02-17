// auth.interceptor.ts - VERSIÓN ACTUALIZADA
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

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
      catchError(error => {
        console.error('❌ Error al obtener token en interceptor:', error);
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
      
      return throwError(() => error);
    })
  );
};