import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RespuestaLogin, ResultadoAcceso, SesionUsuario } from './auth.models';
import { USER_AUTH_PROVIDER } from './user-auth.provider';
import { UserSessionStorage } from './user-session.storage';

/**
 * Sesión de la persona autenticada contra el directorio activo del DNP.
 *
 * Es independiente de `AuthService`, que administra el token de servicio
 * (`app.public.read`) usado para consumir el API público de datos. Un visitante
 * anónimo tiene token de servicio y no tiene sesión de usuario.
 */
@Injectable({ providedIn: 'root' })
export class UserAuthService {
  private proveedor = inject(USER_AUTH_PROVIDER);
  private almacenamiento = inject(UserSessionStorage);

  private readonly _sesion = signal<SesionUsuario | null>(null);

  /** Sesión activa, o `null` si no hay usuario autenticado. */
  readonly sesion = this._sesion.asReadonly();
  readonly estaAutenticado = computed(() => this._sesion() !== null);
  readonly nombre = computed(() => this._sesion()?.nombre ?? '');
  readonly usuario = computed(() => this._sesion()?.usuario ?? '');
  readonly roles = computed(() => this._sesion()?.roles ?? []);

  /**
   * Resultados de `Consulta_AccesoPaginas` ya resueltos en esta sesión.
   * Evita una llamada al servidor en cada navegación a la misma pantalla.
   */
  private accesos = new Map<string, ResultadoAcceso>();

  constructor() {
    this.restaurar();
  }

  /** Recupera la sesión de `sessionStorage` y descarta la que ya expiró. */
  private restaurar(): void {
    const sesion = this.almacenamiento.leer();
    if (!sesion) return;

    if (sesion.expiraEn <= Date.now()) {
      this.almacenamiento.limpiar();
      return;
    }
    this._sesion.set(sesion);
  }

  login(usuario: string, password: string): Observable<SesionUsuario> {
    return this.proveedor.login(usuario.trim(), password).pipe(
      map((respuesta: RespuestaLogin) => this.aSesion(respuesta)),
      tap(sesion => this.establecerSesion(sesion)),
    );
  }

  /**
   * Cierra la sesión local y notifica al servidor. El estado local se limpia
   * siempre, incluso si el servidor no responde.
   */
  logout(): Observable<void> {
    const token = this._sesion()?.token;
    this.limpiarSesion();

    if (!token) return of(void 0);
    return this.proveedor.logout(token).pipe(catchError(() => of(void 0)));
  }

  /**
   * Verifica si el usuario puede ver una pantalla, replicando el contrato del
   * SP legado `Consulta_AccesoPaginas`.
   *
   * @param pagina Identificador registrado en la tabla `Paginas`
   *               (por ejemplo `CargaInsumos.aspx`).
   */
  verificarAcceso(pagina: string): Observable<ResultadoAcceso> {
    const sesion = this._sesion();
    if (!sesion) return of<ResultadoAcceso>('UNOK');

    const enCache = this.accesos.get(pagina);
    if (enCache) return of(enCache);

    return this.renovarSiEsNecesario().pipe(
      switchMap(() => this.proveedor.verificarAcceso(this._sesion()!.token, pagina)),
      tap(resultado => this.accesos.set(pagina, resultado)),
      catchError((error: unknown) => {
        // Token rechazado por el servidor: la sesión ya no sirve.
        if (error instanceof HttpErrorResponse && error.status === 401) {
          this.limpiarSesion();
          return of<ResultadoAcceso>('UNOK');
        }
        // Ante un fallo de red no se concede acceso, pero tampoco se cachea.
        return of<ResultadoAcceso>('NOK');
      }),
    );
  }

  /**
   * Renueva el token cuando le quedan menos minutos que el umbral configurado.
   * Si la renovación falla, la sesión se mantiene hasta su expiración natural.
   */
  renovarSiEsNecesario(): Observable<void> {
    const sesion = this._sesion();
    if (!sesion) return of(void 0);

    const umbralMs = environment.auth.minutosUmbralRenovacion * 60_000;
    if (sesion.expiraEn - Date.now() > umbralMs) return of(void 0);

    return this.proveedor.renovar(sesion.token).pipe(
      tap(respuesta =>
        this.establecerSesion({
          ...sesion,
          token: respuesta.token,
          expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000,
        }),
      ),
      map(() => void 0),
      catchError(() => of(void 0)),
    );
  }

  /** Minutos restantes de la sesión (0 si no hay o ya expiró). */
  minutosRestantes(): number {
    const sesion = this._sesion();
    if (!sesion) return 0;
    return Math.max(0, Math.floor((sesion.expiraEn - Date.now()) / 60_000));
  }

  /**
   * Descarta la sesión sin llamar al servidor. La usa el interceptor cuando
   * el backend responde 401 sobre un recurso de usuario.
   */
  limpiarSesion(): void {
    this._sesion.set(null);
    this.accesos.clear();
    this.almacenamiento.limpiar();
  }

  private aSesion(respuesta: RespuestaLogin): SesionUsuario {
    return {
      usuario: respuesta.usuario,
      nombre: respuesta.nombre,
      roles: respuesta.roles,
      token: respuesta.token,
      expiraEn: Date.now() + respuesta.expiraEnSegundos * 1000,
    };
  }

  private establecerSesion(sesion: SesionUsuario): void {
    this._sesion.set(sesion);
    this.almacenamiento.guardar(sesion);
  }
}
