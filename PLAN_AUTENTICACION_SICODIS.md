# Plan de trabajo — Ventana de autenticación e integración con la autenticación legada

**Proyecto:** SICODIS WebII (Angular 18)
**Referencia legada:** `D:\ws\SICODIS_Obsolete\SICODIS\Autenticacion.aspx` (+ `ClasesNegocio/LdapAuthentication.cs`, `ClasesNegocio/usuarios.cs`, `ClasesNegocio/Page.cs`, `Global.asax.cs`, `Web.config`)
**Fecha:** 2026-09-08

---

## 1. Decisiones acordadas

| Punto | Decisión |
|---|---|
| Backend de credenciales | Se construirá un endpoint propio en `apiws`. **Mientras tanto** se consume el .NET legado a través de un puente JSON. |
| Alcance de la protección | El portal sigue siendo **público**; la sesión solo habilita **secciones restringidas** (administración, cargas de insumos, parámetros, etc.). |
| Autorización por pantalla | Se replica el modelo legado: **`Consulta_AccesoPaginas(usuario, pagina)` → `OK` / `NOK` / `UNOK`**, conservando las tablas `Usuarios` / `Paginas` / `RolesAsociados`. |
| Formulario | **Solo DNP** (usuario de red + contraseña). Sin selector de entidad ni usuarios externos. |

---

## 2. Cómo funciona hoy el legado (lo que hay que preservar)

```
Autenticacion.aspx  ──►  LdapAuthentication.IsAuthenticated("DNP", usuario, pwd)
                            ├─ usuarios.ConsultarDatosUsuario(usuario)   → nombre (col 1), activo (col 10)
                            │     └─ si !activo → UnauthorizedAccessException
                            └─ DirectoryEntry("LDAP://VCURRIPACO", "DNP\usuario", pwd) → bind
                         ──►  FormsAuthenticationTicket(v1, nombre=usuario, 20 min, UserData = CN)
                         ──►  cookie cifrada `adAuthCookie`  +  usuarios.registrarvisita(ip, host, usuario)
                         ──►  Response.Redirect(FormsAuthentication.GetRedirectUrl(...))  → Index.aspx

Global.asax.Application_AuthenticateRequest → descifra el ticket → GenericPrincipal (UserData split por '|' = roles)

Dnp.Web.Page.OnInit  ──►  usuarios.Consulta_AccesoPagina(User.Identity.Name, "Pagina.aspx")
                            OK   → renderiza
                            NOK  → AccesoLimitado.aspx
                            UNOK → AccesoNoAutorizado.html
                          (whitelist de páginas públicas embebida en el código + <location> en Web.config)
```

Detalles relevantes:

- **Timeouts inconsistentes** en el legado: ticket 20 min (`Autenticacion.aspx.cs`), cookie `forms timeout="5"`, `sessionState timeout="5"`, `Session.Timeout = 200` en `Global.asax`. Hay que fijar **un solo valor** en el nuevo diseño (propuesta: 30 min con renovación por actividad).
- **Mensajes de error**: hoy se muestra `ex.Message` de Active Directory al usuario. No se replicará (fuga de información); se usará un mensaje genérico.
- **Tarea `?verificar=1`**: recorre AD (`accountExpires`, `userAccountControl`) y desactiva usuarios en BD. Es un *batch* colgado del `Page_Load`; en el diseño nuevo pasa a ser un job programado en backend, **fuera del flujo de login**.
- **No existe** bloqueo por intentos fallidos ni límite de tasa.

---

## 3. Estado actual del Angular

- `auth.service.ts` — token **de servicio** (`app.public.read`, credenciales embebidas), guardado en `localStorage`, renovación a los 28 min. **No es sesión de usuario**; se conserva tal cual.
- `auth.interceptor.ts` — agrega `Bearer` a todo lo que no sea `/auth/login`; maneja 401 y notifica errores por `MessageService`.
- `guards/admin.guard.ts` — solo verifica que exista token de servicio; el chequeo de rol está en `TODO`.
- `sicodis-api.service.ts:2540` — método `login(usuario, password)` huérfano, que además espera `{ token }` mientras `AuthService` espera `{ access_token }`. **Se elimina** (queda reemplazado por el nuevo servicio).
- **No existe** `src/environments/`; hay SSR activo (`provideClientHydration`, `serve:ssr:SICODIS`), así que todo acceso a `localStorage`/`sessionStorage` debe estar protegido con `isPlatformBrowser`.

---

## 4. Arquitectura propuesta

Dos conceptos separados que hoy se confunden:

| | Token de servicio (existente) | Sesión de usuario (nuevo) |
|---|---|---|
| Quién | `app.public.read` | Persona DNP autenticada en AD |
| Para qué | Consumo del API público de datos | Acceso a secciones restringidas |
| Dónde | `AuthService` + `localStorage` | `UserAuthService` + `sessionStorage` |
| Vida | 30 min, autorrenovable | 30 min, renovable por actividad, se pierde al cerrar la pestaña |

La sesión de usuario se resuelve detrás de una **interfaz de proveedor**, para que el cambio del legado al `apiws` definitivo sea una sola línea de configuración:

```
UserAuthService
   └─ UserAuthProvider (interfaz)
        ├─ LegacyAspxAuthProvider   ← Fase 1 (puente .NET legado)
        └─ ApiwsAuthProvider        ← Fase 3 (endpoint definitivo)
   seleccionado por environment.authProvider: 'legacy' | 'apiws'
```

---

## 5. Fase 1 — Puente JSON en el proyecto .NET legado

Nuevo handler `APIProxy/AuthApi.ashx` (mismo patrón de `SICODISProxy.aspx`, pero como `IHttpHandler` para evitar ViewState). Reutiliza las clases existentes sin modificarlas.

**Habilitación anónima** (el `Web.config` tiene `<deny users="?"/>` global):

```xml
<location path="APIProxy/AuthApi.ashx">
  <system.web><authorization><allow users="*"/></authorization></system.web>
</location>
```

**Operaciones** (`?metodo=`):

| Método | Entrada | Proceso | Salida |
|---|---|---|---|
| `login` | `{ usuario, password }` | `LdapAuthentication(AppSettings["ConexionAD"]).IsAuthenticated("DNP", usuario, pwd)` → `usuarios.ConsultarPerfilesUsuario(usuario)` → `usuarios.RegistrarVisita(usuario, ip, host)` | `{ ok, usuario, nombre, roles[], token, expiraEn }` |
| `acceso` | `{ token, pagina }` | descifra el token → `usuarios.Consulta_AccesoPagina(usuario, pagina)` | `{ resultado: "OK" \| "NOK" \| "UNOK" }` |
| `renovar` | `{ token }` | si el ticket sigue vigente, emite uno nuevo | `{ token, expiraEn }` |
| `logout` | `{ token }` | registro de cierre (opcional) | `{ ok: true }` |

**Token = `FormsAuthentication.Encrypt(ticket)`** — opaco para Angular, descifrable por el mismo handler. Evita introducir criptografía nueva en un proyecto .NET 4.0 y reutiliza el `machineKey` existente.

**Endurecimiento del handler (obligatorio antes de publicar):**

- `Access-Control-Allow-Origin` **explícito** con la lista de orígenes del nuevo front (no `*`), `Allow-Methods: POST, OPTIONS`, `Allow-Headers: Content-Type`, y respuesta a `OPTIONS`.
- Rechazar peticiones no-HTTPS.
- Mensaje de error **genérico** (“Usuario o contraseña incorrectos”); el detalle de la excepción va al log del servidor, nunca a la respuesta.
- Contador de intentos fallidos por usuario/IP con retardo progresivo (mitiga lo que el legado no tiene).
- Nunca escribir contraseña ni token en logs.

**Mapeo de pantallas.** El SP espera nombres como `CargaInsumos.aspx`. Cada ruta protegida de Angular declara su equivalente:

```ts
{ path: 'sgr-carga-insumos', component: SgrCargaInsumosComponent,
  canActivate: [authGuard, paginaGuard],
  data: { paginaLegado: 'CargaInsumos.aspx', breadcrumb: 'SGR — Carga de Insumos' } }
```

Pantallas restringidas y su identificador (estado actual de `app.routes.ts`):

| Ruta Angular | `paginaLegado` | ¿Existe en `Paginas`? |
|---|---|---|
| `/admin-config` | `AdminConfig.aspx` | No — insertar |
| `/sgr-carga-insumos` | `SgrCargaInsumos.aspx` | No — insertar |
| `/sgr-ejecucion-distribucion` | `SgrEjecucionDistribucion.aspx` | No — insertar |
| `/sgr-parametros-distribucion` | `SgrParametrosDistribucion.aspx` | No — insertar |

Las cuatro son pantallas nuevas del módulo de distribución SGR, sin equivalente
en el legado, así que requieren **filas nuevas** en la tabla `Paginas` con sus
`RolesAsociados`. El script de inserción y la matriz rol↔pantalla son
entregables de esta fase. El resto del portal permanece público.

---

## 6. Fase 2 — Frontend Angular

### 6.1 Archivos nuevos

```
src/environments/
  environment.ts                    # authProvider, urls, timeout de sesión
  environment.development.ts
src/app/auth/
  user-auth.provider.ts             # interfaz UserAuthProvider + InjectionToken
  legacy-aspx-auth.provider.ts      # implementación contra AuthApi.ashx
  apiws-auth.provider.ts            # implementación contra el endpoint definitivo (Fase 3)
  user-auth.service.ts              # estado de sesión con signals
  user-session.storage.ts           # wrapper de sessionStorage seguro para SSR
  auth.models.ts                    # SesionUsuario, ResultadoAcceso, RespuestaLogin
src/app/guards/
  auth.guard.ts                     # exige sesión; redirige a /autenticacion?returnUrl=
  pagina.guard.ts                   # Consulta_AccesoPaginas → OK / NOK / UNOK
src/app/components/login/
  login.component.ts | .html | .scss
src/app/components/acceso-limitado/
src/app/components/acceso-no-autorizado/
```

### 6.2 Archivos modificados

| Archivo | Cambio |
|---|---|
| `angular.json` | `fileReplacements` de `environment.ts` en la configuración de producción |
| `app.config.ts` | Provider del `UserAuthProvider` según `environment.authProvider` |
| `app.routes.ts` | Rutas `/autenticacion`, `/acceso-limitado`, `/acceso-no-autorizado`; `canActivate` + `data.paginaLegado` en rutas restringidas |
| `guards/admin.guard.ts` | Se reemplaza por la composición `authGuard` + `paginaGuard` |
| `auth.interceptor.ts` | Excluir del `Bearer` de servicio las URLs del proveedor de usuario; adjuntar el token de usuario donde corresponda; ante 401 de usuario cerrar sesión y redirigir al login |
| `auth.service.ts` | Quitar el `console.log` que imprime el token |
| `sicodis-api.service.ts` | Eliminar el método `login()` huérfano (línea ~2540) |
| `components/header/*` | Botón “Iniciar sesión” / menú de usuario con nombre y “Cerrar sesión”; ocultar del menú las entradas restringidas si no hay sesión |
| `app.component.ts` | Ocultar breadcrumb en `/autenticacion` (mismo mecanismo de `ocultarHeader`) |

### 6.3 Ventana de autenticación (`/autenticacion`)

Diseño alineado al portal nuevo (PrimeNG + tema Lara + paleta WCAG AA ya definida en `app.config.ts`), no una copia visual del WebForms:

- Tarjeta centrada con logo DNP/SICODIS y el texto institucional que ya trae `Autenticacion.aspx`.
- Campos: **Usuario** (`p-inputtext`, `autocomplete="username"`) y **Contraseña** (`p-password` con `feedback=false`, `toggleMask`, `autocomplete="current-password"`).
- Botón **Ingresar** con estado de carga (“Ingresando, un momento por favor…”, equivalente al `UpdateProgress` legado).
- Enlace **Volver al inicio** → `/`.
- Errores en `p-message` con `role="alert"` / `aria-live="assertive"`; el foco se mueve al mensaje.
- Reactive Forms con validación (requeridos, longitud máxima 128 en contraseña como el legado).
- Accesibilidad (coherente con `PLAN_TRABAJO_USABILIDAD_ACCESIBILIDAD_SICODIS.md`): `<label>` reales asociados, orden de tabulación, envío con Enter, contraste AA, `<h1>` “Inicio de sesión”, sin depender del color para señalar el error.
- Soporta `?returnUrl=` para volver a la pantalla solicitada tras autenticarse.

### 6.4 Manejo de sesión

- Token en **`sessionStorage`** (se pierde al cerrar la pestaña) + marca de expiración; acceso encapsulado y no-op en SSR.
- Renovación por actividad: si quedan menos de 5 min y el usuario interactúa, se llama a `renovar`; a los 30 min de inactividad se cierra la sesión con aviso.
- `UserAuthService` expone signals `sesion()`, `estaAutenticado()`, `nombre()`, `roles()` para que el header y los guards reaccionen sin suscripciones manuales.
- Caché en memoria de los resultados de `Consulta_AccesoPaginas` por pantalla, invalidada al cerrar sesión (evita una llamada por navegación).
- Restauración de sesión al recargar: `restore()` valida el token contra `acceso`/`renovar` antes de darla por buena.

---

## 7. Fase 3 — Endpoint definitivo en `apiws` (contrato a implementar por backend)

```
POST /apiws/auth/usuario/login
  body   { "usuario": "jperez", "password": "…" }
  200    { "access_token": "<JWT>", "token_type": "Bearer", "expires_in": 1800,
           "usuario": { "login": "jperez", "nombre": "Juan Pérez", "correo": "…", "entidad": "DNP" },
           "roles": ["ADMIN_SGR", "CONSULTA"] }
  401    { "error": "credenciales_invalidas", "mensaje": "Usuario o contraseña incorrectos" }
  403    { "error": "usuario_inactivo",       "mensaje": "El usuario no está activo en el sistema" }

GET  /apiws/auth/usuario/acceso?pagina=CargaInsumos.aspx     → { "resultado": "OK" | "NOK" | "UNOK" }
POST /apiws/auth/usuario/renovar                             → { "access_token", "expires_in" }
POST /apiws/auth/usuario/logout                              → 204
```

Lado servidor:

- Validación LDAP con `PrincipalContext.ValidateCredentials` (reemplazo moderno del `DirectoryEntry.NativeObject` del legado).
- Verificación de estado activo en BD (equivalente a `ConsultarDatosUsuario`, columna `Estado`).
- `sp_RegistrarAcceso` con IP real (respetando `X-Forwarded-For` si hay proxy).
- JWT firmado, claims `sub`, `name`, `roles`, `exp`; clave en configuración, no en código.
- La verificación de vencimiento en AD (`?verificar=1` del legado) pasa a **job programado**.

**Corte de migración:** cambiar `environment.authProvider` de `'legacy'` a `'apiws'` y retirar `AuthApi.ashx`. No se toca ningún componente.

---

## 8. Riesgos y consideraciones

| Riesgo | Mitigación |
|---|---|
| El nuevo front vive en otro origen que el servidor legado | CORS explícito en `AuthApi.ashx` + entrada en `proxy.conf.js` para desarrollo local |
| `<identity impersonate="true"/>` en el legado puede afectar el bind LDAP del handler | Probar el handler en el servidor real antes de liberar; si falla, hacer el bind con credenciales de servicio |
| SSR ejecuta guards en el servidor sin acceso a `sessionStorage` | Los guards devuelven `true` en servidor y revalidan en cliente; storage encapsulado con `isPlatformBrowser` |
| El token opaco de `FormsAuthentication` no permite leer roles en el cliente | Los roles se devuelven en el cuerpo del `login`; la autorización real la decide el servidor vía `acceso` |
| Fuerza bruta (ausente en el legado) | Contador de intentos + retardo en el handler; obligatorio también en el endpoint definitivo |
| Tabla `Paginas` sin filas para las pantallas nuevas | Entregable explícito de la Fase 1: script de inserción y matriz rol↔pantalla |

---

## 9. Pruebas

- **Unitarias:** `UserAuthService` y ambos proveedores con `HttpTestingController`; `authGuard` y `paginaGuard` (OK/NOK/UNOK, sin sesión, token expirado); `LoginComponent` (validación, estado de carga, mensaje de error).
- **Integración manual:** usuario válido; contraseña incorrecta; usuario inactivo en BD; usuario sin permiso sobre la pantalla (`NOK`) y no autorizado (`UNOK`); expiración durante la navegación; deep-link a ruta protegida con `returnUrl`; recarga con sesión activa; cierre de sesión.
- **Accesibilidad:** recorrido completo con teclado, lector de pantalla sobre el mensaje de error, contraste, zoom 200 %.
- **Seguridad:** verificar que no se registran credenciales ni tokens en consola ni en logs; comprobar que las secciones públicas siguen accesibles sin sesión.

---

## 10. Entregables por fase

| Fase | Entregable | Estimación |
|---|---|---|
| 1 | `AuthApi.ashx` + `<location>` en `Web.config` + script de filas en `Paginas` + matriz rol↔pantalla | 1.5 d |
| 2 | Ventana de autenticación, `UserAuthService`, proveedores, guards, rutas y páginas de acceso limitado/no autorizado, header con sesión | 3 d |
| 2 | Pruebas unitarias y checklist de accesibilidad | 1 d |
| 3 | Especificación del endpoint `apiws` + `ApiwsAuthProvider` + conmutación por environment | 1 d (front) |

---

## 11. Pendientes por confirmar

1. ~~Lista definitiva de pantallas restringidas~~ — **definida**: `admin-config`,
   `sgr-carga-insumos`, `sgr-ejecucion-distribucion` y `sgr-parametros-distribucion`
   (ver la tabla de la sección 5). Falta acordar qué roles habilitan cada una.
2. **Conectividad**: ¿el servidor del nuevo front puede alcanzar el servidor legado y el controlador de dominio `VCURRIPACO`?
3. **Duración de sesión** deseada (el legado tiene tres valores contradictorios: 5, 20 y 200 min).
4. **Orígenes autorizados** para CORS (dominios de desarrollo, pruebas y producción).
5. ¿Se requiere **segundo factor** o basta el bind contra AD, como hoy?
