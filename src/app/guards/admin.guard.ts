import { type CanActivateFn } from '@angular/router';
import { authGuard } from './auth.guard';

/**
 * @deprecated Usar `authGuard` (sesión) junto con `paginaGuard` (permiso por
 * pantalla, vía `data.paginaLegado`). Se conserva como alias para no romper
 * rutas que aún lo referencien.
 *
 * La versión anterior solo comprobaba la existencia del token de servicio
 * (`app.public.read`), que cualquier visitante anónimo tiene: no identificaba
 * a una persona ni verificaba rol alguno.
 */
export const adminGuard: CanActivateFn = authGuard;
