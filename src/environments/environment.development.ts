/**
 * Configuración de desarrollo local (`ng serve`).
 *
 * Mientras no exista el puente `AuthApi.ashx` en el proyecto .NET legado, la
 * sesión de usuario se resuelve con el proveedor simulado. Los tres usuarios
 * de prueba cubren los tres resultados de `Consulta_AccesoPaginas`.
 *
 * Para probar contra el legado ya desplegado basta con cambiar `provider` a
 * 'legacy' y ajustar `legacyUrl` (o dejar la ruta relativa /api… del proxy).
 */
export const environment = {
  production: false,

  auth: {
    provider: 'mock' as 'legacy' | 'apiws' | 'mock',

    legacyUrl: '/api/APIProxy/AuthApi.ashx',
    apiwsUrl: '/api/apiws/auth/usuario',

    minutosSesion: 30,
    minutosUmbralRenovacion: 5,

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
