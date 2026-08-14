import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si hay token válido
  const token = authService.getToken();

  if (!token) {
    console.warn('Admin access denied: No valid token');
    router.navigate(['/']);
    return false;
  }

  // TODO: Cuando el backend esté listo, verificar rol de admin en el JWT
  // Por ahora, solo verificamos que haya un token válido
  // const decodedToken = jwt_decode(token);
  // if (decodedToken.role !== 'admin') {
  //   console.warn('Admin access denied: User is not admin');
  //   router.navigate(['/']);
  //   return false;
  // }

  return true;
};
