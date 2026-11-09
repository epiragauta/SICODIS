/**
 * Configuración de desarrollo local (`ng serve`).
 *
 * La sesión de usuario se valida contra el endpoint real de `apiws`
 * (`/apiws/auth/usuario/*`), a través del proxy (`/api` → sicodis.dnp.gov.co).
 * El control de acceso por pantalla se deriva de los `permisos[]` del login.
 *
 * Para volver al proveedor simulado (usuarios de prueba admin/limitado/
 * noautorizado) basta con cambiar `provider` a 'mock'; para el puente .NET
 * legado, a 'legacy'. Ningún componente ni guard depende de la implementación.
 */
export const environment = {
  production: false,

  auth: {
    provider: 'apiws' as 'legacy' | 'apiws' | 'mock',

    legacyUrl: '/api/APIProxy/AuthApi.ashx',
    // URL absoluta (igual que auth.service.ts y sicodis-api.service.ts): el
    // servidor permite CORS desde localhost. La ruta del proxy `/api/...` no
    // reenvía estos endpoints (devuelve 404).
    apiwsUrl: 'https://sicodis.dnp.gov.co/apiws/auth/usuario',

    minutosSesion: 30,
    minutosUmbralRenovacion: 5,

    // Inactivos mientras `provider` sea 'apiws'; se conservan para rollback a 'mock'.
    usuariosMock: [
      {
        usuario: 'admin',
        password: 'admin',
        nombre: 'Administrador de pruebas',
        roles: ['ADMIN_SGR', 'CONSULTA'],
        acceso: 'OK' as const,
      },
      {
        usuario: 'limitado',
        password: 'limitado',
        nombre: 'Usuario sin permiso de pantalla',
        roles: ['CONSULTA'],
        acceso: 'NOK' as const,
      },
      {
        usuario: 'noautorizado',
        password: 'noautorizado',
        nombre: 'Usuario no autorizado',
        roles: [],
        acceso: 'UNOK' as const,
      },
    ],
  },
};
