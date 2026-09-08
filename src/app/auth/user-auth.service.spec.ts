import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';

import {
  ErrorAutenticacion,
  RespuestaLogin,
  RespuestaRenovacion,
  ResultadoAcceso,
} from './auth.models';
import { USER_AUTH_PROVIDER, UserAuthProvider } from './user-auth.provider';
import { UserAuthService } from './user-auth.service';

class ProveedorFalso implements UserAuthProvider {
  respuesta: RespuestaLogin = {
    usuario: 'jperez',
    nombre: 'Juan Pérez',
    roles: ['ADMIN_SGR'],
    token: 'token-1',
    expiraEnSegundos: 1800,
  };
  acceso: ResultadoAcceso = 'OK';
  fallaLogin = false;
  llamadasVerificar = 0;
  logoutLlamado = false;

  login(): Observable<RespuestaLogin> {
    if (this.fallaLogin) {
      return throwError(
        () => new ErrorAutenticacion('credenciales_invalidas', 'Usuario o contraseña incorrectos.'),
      );
    }
    return of(this.respuesta);
  }

  verificarAcceso(): Observable<ResultadoAcceso> {
    this.llamadasVerificar++;
    return of(this.acceso);
  }

  renovar(token: string): Observable<RespuestaRenovacion> {
    return of({ token, expiraEnSegundos: 1800 });
  }

  logout(): Observable<void> {
    this.logoutLlamado = true;
    return of(void 0);
  }
}

describe('UserAuthService', () => {
  let servicio: UserAuthService;
  let proveedor: ProveedorFalso;

  beforeEach(() => {
    sessionStorage.clear();
    proveedor = new ProveedorFalso();

    TestBed.configureTestingModule({
      providers: [{ provide: USER_AUTH_PROVIDER, useValue: proveedor }],
    });

    servicio = TestBed.inject(UserAuthService);
  });

  afterEach(() => sessionStorage.clear());

  it('empieza sin sesión', () => {
    expect(servicio.estaAutenticado()).toBeFalse();
    expect(servicio.nombre()).toBe('');
  });

  it('establece y persiste la sesión al autenticarse', done => {
    servicio.login('jperez', 'clave').subscribe(() => {
      expect(servicio.estaAutenticado()).toBeTrue();
      expect(servicio.nombre()).toBe('Juan Pérez');
      expect(servicio.roles()).toEqual(['ADMIN_SGR']);
      expect(sessionStorage.getItem('sicodis_sesion_usuario')).toContain('token-1');
      done();
    });
  });

  it('no deja sesión cuando las credenciales son inválidas', done => {
    proveedor.fallaLogin = true;

    servicio.login('jperez', 'mala').subscribe({
      error: (error: unknown) => {
        expect(error instanceof ErrorAutenticacion).toBeTrue();
        expect(servicio.estaAutenticado()).toBeFalse();
        done();
      },
    });
  });

  it('devuelve UNOK sin consultar al servidor si no hay sesión', done => {
    servicio.verificarAcceso('AdminConfig.aspx').subscribe(resultado => {
      expect(resultado).toBe('UNOK');
      expect(proveedor.llamadasVerificar).toBe(0);
      done();
    });
  });

  it('cachea el resultado de acceso por pantalla', done => {
    servicio.login('jperez', 'clave').subscribe(() => {
      servicio.verificarAcceso('AdminConfig.aspx').subscribe(() => {
        servicio.verificarAcceso('AdminConfig.aspx').subscribe(resultado => {
          expect(resultado).toBe('OK');
          expect(proveedor.llamadasVerificar).toBe(1);
          done();
        });
      });
    });
  });

  it('limpia la sesión y su caché al cerrar sesión', done => {
    servicio.login('jperez', 'clave').subscribe(() => {
      servicio.logout().subscribe(() => {
        expect(proveedor.logoutLlamado).toBeTrue();
        expect(servicio.estaAutenticado()).toBeFalse();
        expect(sessionStorage.getItem('sicodis_sesion_usuario')).toBeNull();
        done();
      });
    });
  });

  it('descarta una sesión almacenada que ya expiró', () => {
    sessionStorage.setItem(
      'sicodis_sesion_usuario',
      JSON.stringify({
        usuario: 'jperez',
        nombre: 'Juan Pérez',
        roles: [],
        token: 'viejo',
        expiraEn: Date.now() - 1000,
      }),
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [{ provide: USER_AUTH_PROVIDER, useValue: proveedor }],
    });

    expect(TestBed.inject(UserAuthService).estaAutenticado()).toBeFalse();
    expect(sessionStorage.getItem('sicodis_sesion_usuario')).toBeNull();
  });
});
