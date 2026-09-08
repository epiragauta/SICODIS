import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { of } from 'rxjs';

import { USER_AUTH_PROVIDER } from '../auth/user-auth.provider';
import { UserAuthService } from '../auth/user-auth.service';
import { authGuard } from './auth.guard';

const proveedorFalso = {
  login: () =>
    of({
      usuario: 'jperez',
      nombre: 'Juan Pérez',
      roles: [],
      token: 'token-1',
      expiraEnSegundos: 1800,
    }),
  verificarAcceso: () => of('OK' as const),
  renovar: (token: string) => of({ token, expiraEnSegundos: 1800 }),
  logout: () => of(void 0),
};

describe('authGuard', () => {
  const estado = { url: '/admin-config' } as RouterStateSnapshot;
  const ruta = {} as ActivatedRouteSnapshot;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: USER_AUTH_PROVIDER, useValue: proveedorFalso }],
    });
  });

  afterEach(() => sessionStorage.clear());

  it('redirige a /autenticacion conservando returnUrl cuando no hay sesión', () => {
    const resultado = TestBed.runInInjectionContext(() => authGuard(ruta, estado));
    const router = TestBed.inject(Router);

    expect(resultado instanceof UrlTree).toBeTrue();
    expect(router.serializeUrl(resultado as UrlTree)).toBe(
      '/autenticacion?returnUrl=%2Fadmin-config',
    );
  });

  it('deja pasar cuando hay sesión activa', done => {
    TestBed.inject(UserAuthService)
      .login('jperez', 'clave')
      .subscribe(() => {
        expect(TestBed.runInInjectionContext(() => authGuard(ruta, estado))).toBeTrue();
        done();
      });
  });
});
