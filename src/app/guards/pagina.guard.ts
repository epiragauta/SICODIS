import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserAuthService } from '../auth/user-auth.service';

/**
 * Control de acceso por pantalla según el permiso que la ruta exige.
 *
 * La ruta declara el código de permiso requerido en `data.permiso`
 * (formato `RECURSO:ACCION` que devuelve el login de apiws, p. ej.
 * `ADMIN_CONFIGURACION:VER`). Con el proveedor `apiws` el permiso se contrasta
 * en cliente contra los `permisos[]` de la sesión; con `mock`/`legacy` se
 * resuelve como antes a través del proveedor.
 *
 *   OK   → se muestra la pantalla
 *   NOK  → /acceso-limitado        (solo mock/legacy; apiws no usa este matiz)
 *   UNOK → /acceso-no-autorizado
 *
 * Si la ruta no declara `data.permiso`, el guard no restringe nada (basta con
 * `authGuard`). Debe usarse después de `authGuard`, que garantiza que hay sesión.
 */
export const paginaGuard: CanActivateFn = route => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;

  const permiso = route.data?.['permiso'] as string | undefined;
  if (!permiso) return true;

  const auth = inject(UserAuthService);
  const router = inject(Router);

  return auth.verificarAcceso(permiso).pipe(
    map(resultado => {
      if (resultado === 'OK') return true;
      return router.createUrlTree([
        resultado === 'NOK' ? '/acceso-limitado' : '/acceso-no-autorizado',
      ]);
    }),
  );
};
