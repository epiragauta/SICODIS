import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { firstValueFrom } from 'rxjs';

import { ResultadoAcceso } from '../auth/auth.models';
import { USER_AUTH_PROVIDER } from '../auth/user-auth.provider';
import { UserAuthService } from '../auth/user-auth.service';
import { paginaGuard } from './pagina.guard';

class ProveedorConAcceso {
  constructor(private resultado: ResultadoAcceso) {}

  login() {
    return of({
      usuario: 'jperez',
      nombre: 'Juan Pérez',
      roles: [],
      token: 'token-1',
      expiraEnSegundos: 1800,
    });
  }
  verificarAcceso(): Observable<ResultadoAcceso> {
    return of(this.resultado);
  }
  renovar(token: string) {
    return of({ token, expiraEnSegundos: 1800 });
  }
  logout() {
    return of(void 0);
  }
}

/** Ejecuta el guard con sesión iniciada y devuelve la URL resultante o `true`. */
async function ejecutarGuard(
  resultado: ResultadoAcceso,
  data: Record<string, unknown> = { paginaLegado: 'AdminConfig.aspx' },
): Promise<string | boolean> {
  sessionStorage.clear();
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: USER_AUTH_PROVIDER, useValue: new ProveedorConAcceso(resultado) },
    ],
  });

  await firstValueFrom(TestBed.inject(UserAuthService).login('jperez', 'clave'));

  const salida = TestBed.runInInjectionContext(() =>
    paginaGuard({ data } as unknown as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );

  const valor = salida instanceof Observable ? await firstValueFrom(salida) : salida;
  return valor instanceof UrlTree ? TestBed.inject(Router).serializeUrl(valor) : (valor as boolean);
}

describe('paginaGuard', () => {
  afterEach(() => sessionStorage.clear());

  it('OK deja ver la pantalla', async () => {
    expect(await ejecutarGuard('OK')).toBeTrue();
  });

  it('NOK redirige a /acceso-limitado', async () => {
    expect(await ejecutarGuard('NOK')).toBe('/acceso-limitado');
  });

  it('UNOK redirige a /acceso-no-autorizado', async () => {
    expect(await ejecutarGuard('UNOK')).toBe('/acceso-no-autorizado');
  });

  it('no restringe cuando la ruta no declara paginaLegado', async () => {
    expect(await ejecutarGuard('UNOK', {})).toBeTrue();
  });
});
