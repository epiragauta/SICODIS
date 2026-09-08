import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ErrorAutenticacion,
  RespuestaLogin,
  RespuestaRenovacion,
  ResultadoAcceso,
} from './auth.models';
import { UserAuthProvider } from './user-auth.provider';

interface RespuestaLoginApiws {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: { login: string; nombre: string; correo?: string; entidad?: string };
  roles: string[];
}

/**
 * Proveedor definitivo (Fase 3): endpoint propio de `apiws`.
 *
 * Implementado contra el contrato acordado en PLAN_AUTENTICACION_SICODIS.md.
 * Queda inactivo hasta que `environment.auth.provider` pase a 'apiws'.
 */
@Injectable()
export class ApiwsAuthProvider implements UserAuthProvider {
  private http = inject(HttpClient);
  private baseUrl = environment.auth.apiwsUrl;

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLoginApiws>(`${this.baseUrl}/login`, { usuario, password })
      .pipe(
        map(resp => ({
          usuario: resp.usuario?.login ?? usuario,
          nombre: resp.usuario?.nombre?.trim() || usuario,
          roles: resp.roles ?? [],
          token: resp.access_token,
          expiraEnSegundos: resp.expires_in ?? environment.auth.minutosSesion * 60,
        })),
        catchError(error => throwError(() => this.traducirError(error))),
      );
  }

  verificarAcceso(token: string, pagina: string): Observable<ResultadoAcceso> {
    return this.http
      .get<{ resultado: ResultadoAcceso }>(`${this.baseUrl}/acceso`, {
        headers: this.autorizacion(token),
        params: new HttpParams().set('pagina', pagina),
      })
      .pipe(map(resp => resp.resultado));
  }

  renovar(token: string): Observable<RespuestaRenovacion> {
    return this.http
      .post<{ access_token: string; expires_in: number }>(
        `${this.baseUrl}/renovar`,
        {},
        { headers: this.autorizacion(token) },
      )
      .pipe(
        map(resp => ({
          token: resp.access_token,
          expiraEnSegundos: resp.expires_in ?? environment.auth.minutosSesion * 60,
        })),
      );
  }

  logout(token: string): Observable<void> {
    return this.http
      .post<void>(`${this.baseUrl}/logout`, {}, { headers: this.autorizacion(token) })
      .pipe(
        catchError(() => of(void 0)),
        map(() => void 0),
      );
  }

  private autorizacion(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private traducirError(error: unknown): ErrorAutenticacion {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) {
        return new ErrorAutenticacion(
          'credenciales_invalidas',
          'Usuario o contraseña incorrectos.',
        );
      }
      if (error.status === 403) {
        return new ErrorAutenticacion(
          'usuario_inactivo',
          'El usuario no está activo en el sistema.',
        );
      }
    }
    return new ErrorAutenticacion(
      'servicio_no_disponible',
      'No fue posible validar sus credenciales en este momento. Intente nuevamente más tarde.',
    );
  }
}
