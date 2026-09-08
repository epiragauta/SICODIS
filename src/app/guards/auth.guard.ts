import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserAuthService } from '../auth/user-auth.service';

/**
 * Exige sesión de usuario. Sin ella redirige a la ventana de autenticación
 * conservando el destino en `returnUrl`.
 *
 * En renderizado del servidor (SSR) no hay `sessionStorage`, así que el guard
 * deja pasar y la verificación real ocurre en el navegador tras la hidratación.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;

  const auth = inject(UserAuthService);
  const router = inject(Router);

  if (auth.estaAutenticado()) return true;

  return router.createUrlTree(['/autenticacion'], {
    queryParams: { returnUrl: state.url },
  });
};
