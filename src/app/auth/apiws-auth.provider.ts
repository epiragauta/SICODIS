import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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
import { UserSessionStorage } from './user-session.storage';

/** Ítem del menú dinámico del usuario (contrato `MenuItemDto` del Swagger). */
interface MenuItemApiws {
  codigo?: string;
  label?: string;
  icon?: string;
  routerLink?: string;
  items?: MenuItemApiws[];
}

/**
 * Respuesta de `/auth/usuario/login` y `/auth/usuario/renovar`
 * (`LoginUsuarioResponse` del Swagger de apiws).
 */
interface RespuestaLoginApiws {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: {
    login: string;
    nombre: string;
    correo?: string;
    cargo?: string;
    dependencia?: string;
  };
  roles: string[];
  permisos: string[];
  menu: MenuItemApiws[];
}

/**
 * Proveedor definitivo (Fase 3): endpoint propio de `apiws`
 * (`/apiws/auth/usuario/*`).
 *
 * Implementado contra el Swagger real (`LoginUsuarioRequest { login, clave }`,
 * `LoginUsuarioResponse { access_token, usuario, roles, permisos, menu }`).
 * Queda inactivo hasta que `environment.auth.provider` pase a 'apiws'.
 */
@Injectable()
export class ApiwsAuthProvider implements UserAuthProvider {
  private http = inject(HttpClient);
  private almacenamiento = inject(UserSessionStorage);
  private baseUrl = environment.auth.apiwsUrl;

  login(usuario: string, password: string): Observable<RespuestaLogin> {
    // El contrato de apiws nombra los campos `login` y `clave`.
    return this.http
      .post<RespuestaLoginApiws>(`${this.baseUrl}/login`, { login: usuario, clave: password })
      .pipe(
        map(resp => this.aRespuestaLogin(resp, usuario)),
        catchError(error => throwError(() => this.traducirError(error))),
      );
  }

  verificarAcceso(_token: string, permisoRequerido: string): Observable<ResultadoAcceso> {
    // El Swagger de apiws no expone `/acceso`: la autorización por pantalla se
    // resuelve en cliente a partir de los `permisos[]` (formato `RECURSO:ACCION`)
    // que el login devolvió y que quedaron persistidos en la sesión. Si el
    // permiso que la ruta exige está entre los del usuario → acceso; si no → no
    // autorizado.
    const permisos = this.almacenamiento.leer()?.permisos ?? [];
    return of<ResultadoAcceso>(permisos.includes(permisoRequerido) ? 'OK' : 'UNOK');
  }

  renovar(token: string): Observable<RespuestaRenovacion> {
    // `/renovar` devuelve el mismo `LoginUsuarioResponse`; solo se usan token y vigencia.
    return this.http
      .post<RespuestaLoginApiws>(
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

  private aRespuestaLogin(resp: RespuestaLoginApiws, usuarioIngresado: string): RespuestaLogin {
    return {
      usuario: resp.usuario?.login ?? usuarioIngresado,
      nombre: resp.usuario?.nombre?.trim() || usuarioIngresado,
      roles: resp.roles ?? [],
      permisos: resp.permisos ?? [],
      token: resp.access_token,
      expiraEnSegundos: resp.expires_in ?? environment.auth.minutosSesion * 60,
    };
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
