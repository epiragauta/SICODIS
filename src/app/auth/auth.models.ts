/**
 * Modelos de la sesión de usuario.
 *
 * No confundir con el token de servicio de `auth.service.ts` (`app.public.read`),
 * que autoriza el consumo del API público de datos y no identifica a una persona.
 */

/**
 * Resultado del control de acceso por pantalla, equivalente al SP legado
 * `Consulta_AccesoPaginas` (ver `Dnp.Web.Page.OnInit` del proyecto .NET).
 *
 * - `OK`   → la pantalla se muestra
 * - `NOK`  → acceso limitado (el usuario existe pero no tiene el rol)
 * - `UNOK` → acceso no autorizado
 */
export type ResultadoAcceso = 'OK' | 'NOK' | 'UNOK';

/** Sesión activa, tal como se persiste en `sessionStorage`. */
export interface SesionUsuario {
  /** Login de red (equivale a `User.Identity.Name` en el legado). */
  usuario: string;
  /** Nombre para mostrar (el `CN` de Active Directory). */
  nombre: string;
  roles: string[];
  /** Token opaco (legado) o JWT (apiws). El cliente nunca lo interpreta. */
  token: string;
  /** Momento de expiración en milisegundos desde época. */
  expiraEn: number;
}

/** Respuesta normalizada del login, independiente del proveedor. */
export interface RespuestaLogin {
  usuario: string;
  nombre: string;
  roles: string[];
  token: string;
  expiraEnSegundos: number;
}

/** Respuesta normalizada de la renovación del token. */
export interface RespuestaRenovacion {
  token: string;
  expiraEnSegundos: number;
}

export type CodigoErrorAutenticacion =
  | 'credenciales_invalidas'
  | 'usuario_inactivo'
  | 'servicio_no_disponible';

/**
 * Error de autenticación con un mensaje ya apto para mostrar al usuario.
 *
 * A diferencia del legado —que exponía `ex.Message` de Active Directory en
 * `lblError`— aquí el detalle técnico no viaja al navegador.
 */
export class ErrorAutenticacion extends Error {
  constructor(
    public readonly codigo: CodigoErrorAutenticacion,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorAutenticacion';
  }
}
