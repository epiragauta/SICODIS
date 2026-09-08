import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ErrorAutenticacion,
  RespuestaLogin,
  RespuestaRenovacion,
  ResultadoAcceso,
} from './auth.models';
import { UserAuthProvider } from './user-auth.provider';

/**
 * Proveedor simulado para desarrollo local, mientras no exista el puente
 * `AuthApi.ashx` ni el endpoint de `apiws`.
 *
 * Los usuarios de prueba se declaran en `environment.development.ts` y cubren
 * los tres resultados de `Consulta_AccesoPaginas` (OK / NOK / UNOK).
 * En producción la lista está vacía, así que cualquier intento falla.
 */
@Injectable()
export class MockAuthProvider implements UserAuthProvider {
  /** Tokens emitidos en esta pestaña: token → login del usuario. */
  private emitidos = new Map<string, string>();

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    const encontrado = environment.auth.usuariosMock.find(
      u => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.password === password,
    );

    if (!encontrado) {
      return throwError(
        () =>
          new ErrorAutenticacion('credenciales_invalidas', 'Usuario o contraseña incorrectos.'),
      ).pipe(delay(400));
    }

    const token = `mock.${encontrado.usuario}.${Date.now()}`;
    this.emitidos.set(token, encontrado.usuario);

    return of<RespuestaLogin>({
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      roles: encontrado.roles,
      token,
      expiraEnSegundos: environment.auth.minutosSesion * 60,
    }).pipe(delay(400));
  }

  verificarAcceso(token: string, _pagina: string): Observable<ResultadoAcceso> {
    // Tras recargar la página el mapa está vacío, así que el login también se
    // deduce del propio token (`mock.<usuario>.<timestamp>`).
    const login = this.emitidos.get(token) ?? token.split('.')[1];
    const usuario = environment.auth.usuariosMock.find(u => u.usuario === login);
    return of<ResultadoAcceso>(usuario?.acceso ?? 'UNOK').pipe(delay(150));
  }

  renovar(token: string): Observable<RespuestaRenovacion> {
    return of({ token, expiraEnSegundos: environment.auth.minutosSesion * 60 });
  }

  logout(token: string): Observable<void> {
    this.emitidos.delete(token);
    return of(void 0);
  }
}
