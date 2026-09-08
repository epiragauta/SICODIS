import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaLogin, RespuestaRenovacion, ResultadoAcceso } from './auth.models';

/**
 * Contrato que aísla a la aplicación del backend de autenticación concreto.
 *
 * Implementaciones:
 *  - `MockAuthProvider`       → desarrollo local, sin backend
 *  - `LegacyAspxAuthProvider` → puente JSON del SICODIS .NET (Fase 1)
 *  - `ApiwsAuthProvider`      → endpoint definitivo de apiws (Fase 3)
 *
 * Cambiar de uno a otro es cambiar `environment.auth.provider`; ningún
 * componente ni guard depende de la implementación.
 */
export interface UserAuthProvider {
  /**
   * Valida credenciales contra el directorio activo del DNP.
   * Rechaza con `ErrorAutenticacion` cuando las credenciales no son válidas
   * o el usuario está inactivo en la base de datos.
   */
  login(usuario: string, password: string): Observable<RespuestaLogin>;

  /**
   * Consulta si el usuario de la sesión puede ver una pantalla.
   * Equivale al SP `Consulta_AccesoPaginas(usuario, pagina)` del legado.
   *
   * @param pagina Identificador de pantalla registrado en la tabla `Paginas`.
   */
  verificarAcceso(token: string, pagina: string): Observable<ResultadoAcceso>;

  /** Extiende la vigencia del token mientras el usuario siga activo. */
  renovar(token: string): Observable<RespuestaRenovacion>;

  /** Cierra la sesión en el servidor. Nunca falla de cara al usuario. */
  logout(token: string): Observable<void>;
}

export const USER_AUTH_PROVIDER = new InjectionToken<UserAuthProvider>('USER_AUTH_PROVIDER');
