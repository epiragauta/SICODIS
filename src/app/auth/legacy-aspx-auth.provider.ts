import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

/**
 * Respuestas del puente `APIProxy/AuthApi.ashx` del proyecto .NET legado.
 * El handler reutiliza `LdapAuthentication` y `usuarios` sin modificarlas.
 */
interface RespuestaLoginLegado {
  ok: boolean;
  usuario?: string;
  nombre?: string;
  roles?: string[];
  token?: string;
  expiraEn?: number;
  error?: string;
}

interface RespuestaAccesoLegado {
  resultado: ResultadoAcceso;
}

/**
 * Proveedor transitorio (Fase 1): consume el puente JSON del SICODIS .NET.
 *
 * El token es el ticket de `FormsAuthentication` cifrado por el propio
 * servidor legado: para el cliente es una cadena opaca que solo se reenvía.
 */
@Injectable()
export class LegacyAspxAuthProvider implements UserAuthProvider {
  private http = inject(HttpClient);
  private baseUrl = environment.auth.legacyUrl;

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    return this.http
      .post<RespuestaLoginLegado>(`${this.baseUrl}?metodo=login`, { usuario, password })
      .pipe(
        map(resp => {
          if (!resp.ok || !resp.token) {
            throw new ErrorAutenticacion(
              resp.error === 'usuario_inactivo' ? 'usuario_inactivo' : 'credenciales_invalidas',
              resp.error === 'usuario_inactivo'
                ? 'El usuario no está activo en el sistema.'
                : 'Usuario o contraseña incorrectos.',
            );
          }
          return {
            usuario: resp.usuario ?? usuario,
            nombre: resp.nombre?.trim() || usuario,
            roles: resp.roles ?? [],
            token: resp.token,
            expiraEnSegundos: resp.expiraEn ?? environment.auth.minutosSesion * 60,
          };
        }),
        catchError(error => throwError(() => this.traducirError(error))),
      );
  }

  verificarAcceso(token: string, pagina: string): Observable<ResultadoAcceso> {
    return this.http
      .post<RespuestaAccesoLegado>(`${this.baseUrl}?metodo=acceso`, { token, pagina })
      .pipe(map(resp => resp.resultado));
  }

  renovar(token: string): Observable<RespuestaRenovacion> {
    return this.http
      .post<{ token: string; expiraEn: number }>(`${this.baseUrl}?metodo=renovar`, { token })
      .pipe(
        map(resp => ({
          token: resp.token,
          expiraEnSegundos: resp.expiraEn ?? environment.auth.minutosSesion * 60,
        })),
      );
  }

  logout(token: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}?metodo=logout`, { token }).pipe(
      // El cierre local no depende de que el servidor responda.
      catchError(() => of(void 0)),
      map(() => void 0),
    );
  }

  /** Convierte cualquier fallo en un error con mensaje apto para el usuario. */
  private traducirError(error: unknown): ErrorAutenticacion {
    if (error instanceof ErrorAutenticacion) {
      return error;
    }
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
