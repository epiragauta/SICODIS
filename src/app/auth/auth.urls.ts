import { environment } from '../../environments/environment';

/**
 * Indica si una URL pertenece al backend de autenticación de usuario.
 *
 * El interceptor global usa esta comprobación para no adjuntar el token de
 * servicio (`app.public.read`) a estas peticiones: llevan —o establecen— el
 * token de la persona, y sus errores los traduce el proveedor, no el toast
 * genérico de la aplicación.
 */
export function esUrlDeAutenticacionUsuario(url: string): boolean {
  const { legacyUrl, apiwsUrl } = environment.auth;
  return url.includes(legacyUrl) || url.includes(apiwsUrl);
}
