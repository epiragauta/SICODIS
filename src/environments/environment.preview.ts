/**
 * Vista previa desplegable (Vercel, Netlify, Azure Static Web Apps…).
 *
 * Se compila optimizada, igual que producción —eso lo decide la configuración
 * `preview` de angular.json, no este archivo—. La sesión de usuario se valida
 * contra el endpoint real de `apiws` (`/apiws/auth/usuario/*`), igual que en
 * desarrollo, para probar la autenticación real de funcionarios DNP en el
 * despliegue de Vercel.
 *
 * `production` queda en false a propósito: este NO es el entorno real, así que
 * cualquier comprobación de `environment.production` debe tratarlo como tal.
 *
 * ⚠️ CORS: el backend debe permitir el origen del despliegue (dominio
 * *.vercel.app o el dominio del preview). Si no, el login fallará con error de
 * red aunque el endpoint responda. Coordinar con el equipo backend.
 *
 * Para volver al proveedor simulado (demo sin backend) cambiar `provider` a
 * 'mock'; los `usuariosMock` de abajo quedan inactivos mientras sea 'apiws'.
 */
export const environment = {
  production: false,

  auth: {
    provider: 'apiws' as 'legacy' | 'apiws' | 'mock',

    legacyUrl: 'https://sicodis.dnp.gov.co/APIProxy/AuthApi.ashx',
    apiwsUrl: 'https://sicodis.dnp.gov.co/apiws/auth/usuario',

    minutosSesion: 30,
    minutosUmbralRenovacion: 5,

    // Inactivos mientras `provider` sea 'apiws'; se conservan para rollback a 'mock'.
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
