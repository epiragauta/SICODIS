/**
 * Vista previa desplegable (Vercel, Netlify, Azure Static Web Apps…).
 *
 * Se compila optimizada, igual que producción —eso lo decide la configuración
 * `preview` de angular.json, no este archivo—, pero la sesión de usuario se
 * resuelve con el proveedor simulado, para poder mostrar la pantalla de
 * autenticación y los tres flujos de acceso antes de que exista el puente
 * `AuthApi.ashx` del SICODIS .NET.
 *
 * `production` queda en false a propósito: este NO es el entorno real, así que
 * cualquier comprobación de `environment.production` debe tratarlo como tal.
 *
 * ⚠️ Las credenciales de abajo quedan incluidas en el bundle publicado. Úsese
 * solo para despliegues de demostración, nunca para el sitio definitivo, que se
 * compila con la configuración `production` (proveedor `legacy`).
 */
export const environment = {
  production: false,

  auth: {
    provider: 'mock' as 'legacy' | 'apiws' | 'mock',

    legacyUrl: 'https://sicodis.dnp.gov.co/APIProxy/AuthApi.ashx',
    apiwsUrl: 'https://sicodis.dnp.gov.co/apiws/auth/usuario',

    minutosSesion: 30,
    minutosUmbralRenovacion: 5,

    usuariosMock: [
      {
        usuario: 'admin',
        password: 'admin',
        nombre: 'Administrador de demostración',
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
