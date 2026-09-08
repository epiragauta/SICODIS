import { isPlatformServer } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserAuthService } from '../auth/user-auth.service';

/**
 * Control de acceso por pantalla, equivalente a `Dnp.Web.Page.OnInit` del
 * proyecto legado: consulta `Consulta_AccesoPaginas(usuario, pagina)` y
 * redirige igual que allí.
 *
 *   OK   → se muestra la pantalla
 *   NOK  → /acceso-limitado        (antes AccesoLimitado.aspx)
 *   UNOK → /acceso-no-autorizado   (antes AccesoNoAutorizado.html)
 *
 * La ruta declara el identificador de pantalla en `data.paginaLegado`; si no lo
 * declara, el guard no restringe nada (basta con `authGuard`).
 *
 * Debe usarse después de `authGuard`, que garantiza que hay sesión.
 */
export const paginaGuard: CanActivateFn = route => {
  if (isPlatformServer(inject(PLATFORM_ID))) return true;

  const pagina = route.data?.['paginaLegado'] as string | undefined;
  if (!pagina) return true;

  const auth = inject(UserAuthService);
  const router = inject(Router);

  return auth.verificarAcceso(pagina).pipe(
    map(resultado => {
      if (resultado === 'OK') return true;
      return router.createUrlTree([
        resultado === 'NOK' ? '/acceso-limitado' : '/acceso-no-autorizado',
      ]);
    }),
  );
};
