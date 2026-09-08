/**
 * Configuración por defecto (producción / pruebas contra el servidor real).
 *
 * `authProvider` decide contra qué backend se autentican los usuarios:
 *   - 'legacy' → puente JSON del SICODIS .NET (Fase 1: APIProxy/AuthApi.ashx)
 *   - 'apiws'  → endpoint definitivo de apiws (Fase 3)
 *   - 'mock'   → proveedor simulado, solo para desarrollo local
 *
 * Ver PLAN_AUTENTICACION_SICODIS.md
 */
export const environment = {
  production: true,

  auth: {
    /** Proveedor activo de sesión de usuario. */
    provider: 'legacy' as 'legacy' | 'apiws' | 'mock',

    /** Puente JSON del proyecto .NET legado (Fase 1). */
    legacyUrl: 'https://sicodis.dnp.gov.co/APIProxy/AuthApi.ashx',

    /** Endpoint definitivo, cuando exista (Fase 3). */
    apiwsUrl: 'https://sicodis.dnp.gov.co/apiws/auth/usuario',

    /** Minutos de inactividad tras los cuales se cierra la sesión. */
    minutosSesion: 30,

    /** Minutos restantes por debajo de los cuales se intenta renovar el token. */
    minutosUmbralRenovacion: 5,

    /** Usuarios del proveedor simulado. Vacío fuera de desarrollo. */
    usuariosMock: [] as {
      usuario: string;
      password: string;
      nombre: string;
      roles: string[];
      /** Resultado que devuelve la verificación de acceso por pantalla. */
      acceso: 'OK' | 'NOK' | 'UNOK';
    }[],
  },
};
