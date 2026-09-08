import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { ErrorAutenticacion, RespuestaLogin, ResultadoAcceso } from '../../auth/auth.models';
import { USER_AUTH_PROVIDER } from '../../auth/user-auth.provider';
import { LoginComponent } from './login.component';

class ProveedorFalso {
  fallaLogin = false;
  credenciales: { usuario: string; password: string } | null = null;

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    this.credenciales = { usuario, password };
    if (this.fallaLogin) {
      return throwError(
        () => new ErrorAutenticacion('credenciales_invalidas', 'Usuario o contraseña incorrectos.'),
      );
    }
    return of({
      usuario,
      nombre: 'Juan Pérez',
      roles: [],
      token: 'token-1',
      expiraEnSegundos: 1800,
    });
  }
  verificarAcceso(): Observable<ResultadoAcceso> {
    return of('OK');
  }
  renovar(token: string) {
    return of({ token, expiraEnSegundos: 1800 });
  }
  logout() {
    return of(void 0);
  }
}

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let componente: LoginComponent;
  let proveedor: ProveedorFalso;

  beforeEach(async () => {
    sessionStorage.clear();
    proveedor = new ProveedorFalso();

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([]), { provide: USER_AUTH_PROVIDER, useValue: proveedor }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => sessionStorage.clear());

  it('no llama al backend con el formulario vacío', () => {
    componente.ingresar();

    expect(proveedor.credenciales).toBeNull();
    expect(componente.error()).toBe('Diligencie el usuario y la contraseña para continuar.');
  });

  it('navega al destino solicitado tras autenticarse', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');

    componente.formulario.setValue({ usuario: ' jperez ', password: 'clave' });
    componente.ingresar();

    // El usuario se envía sin espacios sobrantes.
    expect(proveedor.credenciales).toEqual({ usuario: 'jperez', password: 'clave' });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(componente.estaAutenticado()).toBeTrue();
  });

  it('muestra un mensaje genérico y limpia la contraseña cuando falla', () => {
    proveedor.fallaLogin = true;

    componente.formulario.setValue({ usuario: 'jperez', password: 'mala' });
    componente.ingresar();
    fixture.detectChanges();

    expect(componente.error()).toBe('Usuario o contraseña incorrectos.');
    expect(componente.campoPassword.value).toBe('');
    expect(componente.estaAutenticado()).toBeFalse();

    const alerta: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alerta.textContent).toContain('Usuario o contraseña incorrectos.');
  });
});
