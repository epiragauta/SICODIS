# Informe de sesión — 8 de septiembre de 2026

**Proyecto:** SICODIS_WebII
**Rama:** `feat/sgr-iac-transaccional` (publicada en `origin`)
**Base:** `afa6b7f` en `main`
**Alcance:** 60 archivos · +6.637 / −452 líneas · 4 commits

---

## 1. Resumen

Se migró el proceso transaccional de la **Instrucción de Abono a Cuenta (IAC)**
desde `IAC/IACAutomatica4.aspx` del sistema anterior, en modo simulado. Por el
camino se extrajeron las piezas que ya estaban duplicadas en otras pantallas del
SGR y se reparó la suite de pruebas, que llevaba tiempo sin poder ejecutarse.

| Entregable | Estado |
|---|---|
| Módulo IAC transaccional (listado, wizard de 5 pasos, cálculo, envío) | Funcional contra mocks |
| Extracciones compartidas (descarga, estado, selector de archivo, parámetros) | Adoptadas en 4 pantallas |
| Validador de plantillas Excel + 17 pruebas | Verificado contra archivo real |
| Suite de Karma | De **no arrancar** a **223/223 en verde** |

---

## 2. Actividades realizadas

### 2.1 Análisis del sistema anterior

Se revisó `D:\ws\SICODIS_Obsolete\SICODIS\IAC\` (272 KB de marcado y ~3.100
líneas de code-behind sobre `ClasesNegocio/ValidacionIAC.cs`) para reconstruir:

- La máquina de estados de la IAC (borrador → calculada → enviada a validación).
- Los cinco participantes del proceso y sus identificadores reales.
- Las reglas de validación de las plantillas de determinaciones.
- Los ~30 procedimientos almacenados `sp_SGR_IAC_CA_*` que sostienen el flujo.

Resultado: `docs/planes/PLAN_SGR_IAC_TRANSACCIONAL.md`, con el contrato REST
propuesto, el análisis de afinidad con `sgr-carga-insumos`,
`sgr-parametros-distribucion` y `sgr-ejecucion-distribucion`, y el plan por fases.

### 2.2 Implementación del módulo IAC

| Componente | Función |
|---|---|
| `sgr-iac` | Listado con filtros y diálogo de creación (cascada vigencia → periodo) |
| `sgr-iac-detalle/:id` | Ruta propia en lugar del modal del legado; pestañas de insumos, cálculo, parámetros aplicados y resumen |
| `pasos/paso-mhcp` | Formulario con patrón de radicado, total calculado y soporte |
| `pasos/paso-determinaciones` | Parametrizado para ANH, ANM, MME y Fun&Fis (cuatro bloques idénticos en el legado) |
| `pasos/paso-funfis` | El Sí/No opcional, con borrado de determinaciones al declarar «No» |

Apoyado en `models/sgr-iac.models.ts`, `services/sgr-iac.service.ts`
(bandera `simularIac`, rutas REST ya declaradas) y
`utils/plantilla-excel.validator.ts`.

Ubicación: **Administración › SGR - Cálculo › Instrucción de Abono a Cuenta**,
siguiendo la agrupación introducida en `afa6b7f`. Las rutas conservan
`paginaLegado: 'IACAutomatica4.aspx'` para que `Consulta_AccesoPaginas` resuelva
el permiso sin tocar la tabla.

### 2.3 Extracciones compartidas

| Pieza | Adoptada en |
|---|---|
| `utils/descarga-archivo.ts` | `sgr-carga-insumos`, `sgr-ejecucion-distribucion`, IAC |
| `utils/estado-carga.ts` | `sgr-carga-insumos` |
| `components/shared/selector-archivo/` | `sgr-carga-insumos`, `paso-determinaciones`, `paso-mhcp` |
| `services/sgr-parametros.service.ts` | `sgr-parametros-distribucion`, `sgr-ejecucion-distribucion`, `sgr-iac-detalle` |

Dos decisiones que se apartan del plan inicial y quedaron documentadas:

- **No se extrajo la `tarjeta-insumo` prevista.** En `sgr-carga-insumos` un
  insumo es una fila de tabla y en la IAC es un panel con totales: unificarlos
  habría sido una abstracción falsa. Lo que sí estaba triplicado era la mecánica
  del `<input type="file">`, y eso es `selector-archivo`.
- **`estado-carga` no aplica a `sgr-ejecucion-distribucion`**: su estado es
  `EstadoCorrida`, que comparte la firma pero no el significado.

El conjunto de parámetros simulado estaba duplicado en dos pantallas; ahora hay
una sola fuente con tres consumidores.

### 2.4 Validador de plantillas y pruebas

`plantilla-excel.validator.ts` reproduce en el navegador las reglas de
`ValidacionIAC.LeerHojasExcel*`, con ExcelJS en importación diferida (queda en
un *chunk* aparte de 1,64 MB, fuera del bundle inicial).

Se contrastó contra el archivo real
`IAC/ArchivosIAC/638930033582872581ANH-DNP ADJUNTO_268_20250904082239.xlsx`
(hoja `AD_ANH`, 1.163 beneficiarios): **0 hallazgos** y totales idénticos a los
que calcula el propio Excel en su fila de sumas.

Ese contraste produjo dos correcciones al plan:

1. **El redondeo del legado no se puede transcribir literalmente.** La secuencia
   `Round(x,2)` → `Truncate(x*100)/100` → `Round(x,2)` opera sobre `decimal`,
   aritmética exacta en base 10, donde el truncamiento intermedio es un no-op.
   En `number` sí muerde: `1114598868.55 * 100` da `111459886854.99998` y se
   pierde un centavo por registro. El total daba `103.316.233.771,77` frente a
   los `...,86` reales. Se implementa la **equivalencia** (centavos enteros y
   redondeo bancario), no la transcripción.
2. **No todos los beneficiarios tienen código DANE.** La plantilla incluye las
   Corporaciones Autónomas Regionales (`C0000`–`C0009`) y la bolsa
   «Otros por Distribuir» (`F0000`). Exigir cinco dígitos marcaba 11 registros
   válidos como error y dejaba fuera **$466.544.412,01**.

Pruebas: 17 casos que construyen un `.xlsx` en memoria y lo pasan como `File`,
ejercitando la misma ruta que un archivo elegido por el usuario.

### 2.5 Reparación de la suite de pruebas

`npm test` no arrancaba: siete specs generados por `ng generate` habían quedado
desfasados de sus componentes y no compilaban, y un solo error de tipos aborta
la corrida entera. Al sanearlos afloraron **58 fallos** en 25 suites que ese
error venía tapando.

Causas, por si reaparecen al generar specs nuevos:

1. **Proveedores ausentes** — los stubs no declaran `provideHttpClient()`,
   `provideRouter()` ni `provideUserAuth()`.
2. **Animaciones** — sin `NoopAnimationsModule`, PrimeNG falla con `NG05105`.
3. **Deriva de aserciones** — pruebas que comprobaban valores antes fijos en
   código y hoy traídos de la API, o API del componente que ya no existe.
4. **Contaminación entre suites** — `config.service.spec` sustituía
   `window.localStorage` por un doble y no lo restauraba.

Resultado: **223 pruebas, 223 en verde**, estable en corridas consecutivas.

### 2.6 Corrección de interfaz

Los tres filtros del listado mostraban etiqueta y placeholder superpuestos: con
`p-floatlabel variant="on"` la etiqueta ocupa el lugar del placeholder mientras
el campo está vacío. En el resto del proyecto el patrón no da problema porque
sus selects siempre llevan valor; los de la IAC arrancan en `null` y son
limpiables. Se retiró el `placeholder` y se fijó el ancho desde el SCSS.

---

## 3. Hallazgos ajenos al encargo

Tres cosas que aparecieron al trabajar y que conviene decidir aparte:

### 3.1 `ConfigService` reventaba con `localStorage` bloqueado — **corregido**

`initializeDefaultConfigs()` llamaba a `localStorage.getItem` fuera del `try`.
En ventana privada o con los datos de sitio bloqueados eso *lanza*, revienta el
constructor del servicio y con él el arranque de la aplicación. Es el único
cambio de código de producción de la sesión.

### 3.2 `AppComponent` recarga la página — **sin tocar**

`ngOnInit()` fuerza un `window.location.reload()` la primera vez de cada sesión,
controlado por un centinela en `sessionStorage`. En Karma recargaba el propio
runner. El spec lo esquiva marcando el centinela por adelantado, pero **la
lógica sigue ahí** y merece revisión: implica que cada visitante carga la
aplicación dos veces.

### 3.3 Tipo incorrecto en `getSgpResumenParticipaciones` — **sin tocar**

Está declarado como `Observable<ResumenParticipaciones>` (en singular) pero el
endpoint devuelve una colección; `HomeComponent` lo sabe y comprueba
`Array.isArray(response)` antes de procesarlo. Tiene tres consumidores, así que
corregir la firma es un cambio con alcance propio.

---

## 4. Evaluación: ¿se está usando Tailwind?

**Respuesta corta: el framework de utilidades no; el *reset* sí, y es
load-bearing. Suprimirlo del todo cambiaría el aspecto de toda la aplicación.**

### 4.1 Qué se comprobó

| Evidencia | Resultado |
|---|---|
| Aviso del build | `No utility classes were detected in your source files` en cada compilación |
| `content` en `tailwind.config.js` | `['./components/**', './doc/**', './pages/**', './index.html']` |
| ¿Existen esas rutas? | **No.** El código vive en `./src/app/components/**` |
| Capa `tailwind-utilities` en `styles.css` | `@layer tailwind-utilities { }` — **vacía** |
| Capa `tailwind-base` en `styles.css` | 6.235 bytes: **Preflight completo** |
| Plugin `tailwindcss-primeui` | No emite nada (sus utilidades dependen del `content`) |
| Clases tipo Tailwind en plantillas | **~275 usos** (`w-full` ×96, `md:w-56` ×68, `grid` ×28, `mb-2` ×14…) |

El `content` es el de la plantilla de demos de PrimeNG, copiado tal cual y nunca
adaptado a la estructura de este proyecto. Por eso Tailwind no encuentra ni una
clase que generar.

### 4.2 Consecuencias hoy

- **Las ~275 clases de utilidad de las plantillas no hacen nada.** Mienten: quien
  lea `class="w-full md:w-56"` asumirá que dimensiona algo. Ya causó el defecto
  de anchura de los filtros de la IAC descrito en §2.6.
- **El Preflight sí se aplica** y es la base sobre la que se escribió todo el
  CSS del proyecto: `box-sizing: border-box` global, `margin: 0` en encabezados,
  párrafos y listas, `border-width: 0`, supresión de viñetas, etc.
- **`CLAUDE.md` documenta unos breakpoints de Tailwind** (§«Responsive
  Breakpoints») que no están operativos.
- Coste real en el bundle: 6,2 KB sobre 152 KB de `styles.css` (~4 %), y solo
  del reset. Tailwind es dependencia de desarrollo: no viaja al navegador.

### 4.3 Opciones

| # | Opción | Riesgo | Beneficio |
|---|---|---|---|
| A | **Dejarlo como está** | Ninguno | Ninguno; el equívoco persiste |
| B | **Arreglar el `content`** para que Tailwind funcione | **Alto** — 275 clases inertes pasarían a aplicarse de golpe en ~48 componentes | Se recupera el framework |
| C | **Suprimir Tailwind conservando el reset** | **Bajo** si el Preflight se copia literal | Se va una dependencia, el aviso del build y 275 clases que engañan |

### 4.4 Recomendación

**Opción C.** Es la que responde a la intención de la pregunta sin arriesgar el
aspecto de la aplicación:

1. Copiar el Preflight ya generado (los 6,2 KB de la capa `tailwind-base` de
   `styles.css`) a un `src/assets/styles/reset.css` versionado, e importarlo
   donde hoy está `@tailwind base`. Al ser literal, el CSS resultante es
   idéntico byte a byte: **riesgo visual nulo**.
2. Retirar `tailwindcss` y `tailwindcss-primeui` de `package.json`, y borrar
   `tailwind.config.js`.
3. Limpiar las ~275 clases muertas de las plantillas. Es cosmético y se puede
   hacer por tandas; ninguna afecta al render.
4. Actualizar `CLAUDE.md`: quitar Tailwind de la lista de librerías de UI, la
   sección de breakpoints y la nota de conflictos de estilos.

**No recomiendo la opción B.** Activar el framework haría que 275 clases
empezaran a aplicarse simultáneamente en pantallas que hoy se ven correctas
porque no hacen nada; exigiría una revisión visual componente por componente,
que es mucho más trabajo y más riesgo que retirarlo.

**Antes de ejecutar C conviene confirmar dos cosas** con quien decida:

- Que no hay intención de adoptar Tailwind de verdad más adelante. Si la hay, lo
  coherente es B, pero planificada como tarea propia con revisión visual.
- Que `tailwindcss-primeui` no se piensa usar para las utilidades de color
  semántico de PrimeNG (`text-primary`, `bg-surface-*`). Hoy no aporta nada,
  pero es la única razón defendible para mantener la cadena.

Queda pendiente de tu decisión: **no ejecuté ninguna de las tres opciones.**

---

## 5. Estado de la rama

```
b153cad  fix(sgr-iac): corrige el solapamiento y el ancho de los filtros del listado
4644642  test: repara la suite de Karma y añade pruebas del validador de plantillas
8c3da9d  feat(sgr-iac): Instrucción de Abono a Cuenta transaccional (modo mock)
2f5b9dd  refactor(sgr): extrae utilidades compartidas de descarga, estado y cargue
```

- `npm run build` — correcto
- `npm test` — 223/223
- PR: https://github.com/andpac/SICODIS_WebII/pull/new/feat/sgr-iac-transaccional

No se incluyeron en la rama los cambios previos del árbol de trabajo que no
corresponden a este encargo: `.gitignore`, `.claude/settings.local.json`,
`src/src.zip` y los `.xlsx` y `.md` sueltos de la raíz.

---

## 6. Pendientes del módulo IAC

| Pendiente | Nota |
|---|---|
| Cerrar el contrato REST con backend | Bloquea poner `simularIac = false` |
| Descargas de Excel y XML SPGR | Interfaz lista y deshabilitada; requieren backend |
| Confirmar plantillas de ANM, MME y Fun&Fis | Derivadas de la de ANH; solo se dispone del archivo real de la ANH |
| Trasladar el HTTP a `sicodis-api.service.ts` | Hoy en `sgr-iac.service.ts` para no añadir 20 métodos especulativos al servicio único |
| Pruebas del paso MHCP y de la completitud | El validador ya está cubierto |
| Migrar `IACAutomatica.aspx` e `IACAutomatica2.aspx` | Son parametrización; su sitio es `sgr-parametros-distribucion` |
