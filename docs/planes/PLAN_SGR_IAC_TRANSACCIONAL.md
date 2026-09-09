# Plan de Implementación · IAC Transaccional (Instrucción de Abono a Cuenta)

**Fecha:** 8 de septiembre de 2026
**Origen:** `D:\ws\SICODIS_Obsolete\SICODIS\IAC\IACAutomatica4.aspx` (+ `ClasesNegocio/ValidacionIAC.cs`)
**Destino:** `SICODIS_WebII` (Angular 18 standalone + PrimeNG 18)
**Relacionado con:** `sgr-carga-insumos` · `sgr-parametros-distribucion` · `sgr-ejecucion-distribucion` · `docs/propuesta-sgr-ejecucion-distribucion-2026-08-31.md`

---

## 0. Decisiones tomadas

| Tema | Decisión |
|---|---|
| **Alcance** | Solo el flujo transaccional de `IACAutomatica4`: listado, creación, 5 pasos de insumos, cargue/validación de plantillas, cálculo y envío a validación. |
| **Backend** | No existe. El plan define el contrato REST `/apiws/sgr/iac/*` y el front arranca *mock-first* con bandera `simularIac`, igual que los tres componentes de distribución ya existentes. |
| **UI** | Dos componentes: `sgr-iac` (listado + creación) y `sgr-iac-detalle/:id` (wizard de 5 pasos + cálculo). Sin el modal gigante del legado; con deep-link y `paginaGuard`. |
| **Validación Excel** | Prevalidación en el navegador (ExcelJS, ya en `package.json`) para feedback inmediato + validación autoritativa en backend. |

Quedan **fuera de este plan** (candidatos a fases posteriores): `IACAutomatica.aspx` e `IACAutomatica2.aspx` (participaciones porcentuales por asignación y aplicabilidad por tipo de beneficiario) y la fase de validación/confirmación posterior (`sp_SGR_CargarIACValidadas`, `EliminarIAC`, cambio de `EstadoIAC`).

---

## 1. Qué es la IAC transaccional en el legado

La **Instrucción de Abono a Cuenta** es el acto por el cual el DNP instruye el abono de los recursos del SGR a las cuentas de los beneficiarios para un periodo. En el legado, la pantalla `IACAutomatica4.aspx` (272 KB de markup, ~3.100 líneas de code-behind) concentra todo el proceso transaccional: **recibir los insumos de cinco participantes, validarlos, calcular la IAC y enviarla a validación**.

Las otras páginas de la carpeta `IAC/` son parametrización: `IACAutomatica.aspx` (participaciones porcentuales por asignación), `IACAutomatica2.aspx` (aplicabilidad por tipo de beneficiario) e `IACAutomatica3.aspx` (variante de la primera sin edición libre). `IACAutomatica5.aspx` está vacía.

### 1.1 Modelo de datos del legado

| Concepto | Tabla / origen |
|---|---|
| Cabecera de la IAC | `SGR_DistribucionesValidacion` (`IdCargaDistribuciones`, `idVigencia`, `PeriodoRecaudo`, `IdTipoDistribucion`, `Descripcion`, `IngresosHidrocarburos`, `IngresosMineria`, `EstadoIAC`) |
| Parametrización de plantillas Excel | `SGR_DIST_DetallePlantillaCargue` (`IdPlantilla`, `TipoRegistro` 1=encabezado / 2=detalle, `NombreCampo`, `CodCampo`, `Columna`, `Fila`, `TipoDatos`) |
| Insumos por participante | maestro de validación (`IdValidacionMaestro`) + detalle de determinaciones + archivo soporte + log de validación |
| Archivos | `IAC/ArchivosIAC/` en disco **y** BLOB en base de datos (`ConsultarArchivoSoporteInsumoIAC` devuelve nombre, extensión, tamaño, mimeType, datos y log de validación) |

### 1.2 Los cinco participantes

| Paso | Participante | `IdParticipanteProceso` | `IdPlantilla` | Hoja Excel | Insumo |
|---|---|---|---|---|---|
| 1 | **MHCP** — Ministerio de Hacienda y Crédito Público | 2 | — | — | Formulario + soporte del radicado |
| 2 | **ANH** — Agencia Nacional de Hidrocarburos | 3 | 3 | `AD_ANH$` | Determinaciones AD por beneficiario |
| 3 | **ANM** — Agencia Nacional de Minería | 4 | 4 | `AD_ANM$` | Determinaciones AD por beneficiario |
| 4 | **MME** — Ministerio de Minas y Energía | 5 | 5 | `AD_MME$` | Determinaciones |
| 5 | **Fun&Fis** — Funcionamiento y Fiscalización (DNP) | 1 | 6 | `FUN_FIS_Determinaciones$` | Determinaciones (**opcional**) |

> ⚠️ **Trampa del legado:** el `enum EntidadesInsumoProcesoIAC` de `ValidacionIAC.cs:31` declara `MHCP=1, ANH=2, ANM=3, MME=4, DNP=5`, pero **el código nunca lo usa**: `IACAutomatica4.aspx.cs` pasa los literales `2, 3, 4, 5, 1`. Los identificadores reales son los de la tabla anterior. El enum está desalineado y no debe copiarse.

### 1.3 Máquina de estados y flujo

```
                    ┌──────────────────────────────────────────────┐
 [Nueva IAC]───────▶│  BORRADOR   (EstadoIAC = 1)                  │
 vigencia+periodo   │                                              │
 +tipo+nombre       │  Paso 1 MHCP    ○ Pendiente / ● Completo     │
                    │  Paso 2 ANH     ○ / ●                        │
                    │  Paso 3 ANM     ○ / ●                        │
                    │  Paso 4 MME     ○ / ●                        │
                    │  Paso 5 Fun&Fis ○ / ● (opcional)             │
                    └───────────────┬──────────────────────────────┘
                                    │ MHCP ∧ ANH ∧ ANM ∧ MME completos
                                    ▼
                            [ Validar y Calcular IAC ]
                                    │  sp_SGR_IAC_CA_CalcularIAC
                                    ▼
                    ┌──────────────────────────────────────────────┐
                    │  CALCULADA                                   │
                    │  · Resumen por entidad                       │
                    │  · Archivos IAC calculada (Excel / XML SPGR) │
                    │  · Avance vs. presupuesto                    │
                    └───────────────┬──────────────────────────────┘
                                    │ [ Enviar a Validación ]  (una sola vez)
                                    ▼
                          ENVIADA A VALIDACIÓN  →  (fase fuera de alcance)
```

La completitud se lee del servidor (`sp_SGR_IAC_CA_ConsultarDatosRegistroIACInformacionActiva` devuelve cinco tablas, una por participante, con el literal `"Completo"`), no se infiere en el cliente. **Fun&Fis no participa en la validación de completitud**: `validarCargueInformacion()` solo exige MHCP, ANH, ANM y MME.

### 1.4 Detalle del paso MHCP

Formulario, no cargue de plantilla:

| Campo | Validación (`validarPanelMHCP`) |
|---|---|
| No. Radicado | Obligatorio + patrón `[0-9]{1}-[0-9]{4}-[0-9]{6}` (p. ej. `1-2026-000123`) |
| Fecha de radicado | Obligatoria |
| Ingresos a distribuir ANH | Obligatorio, decimal |
| Ingresos a distribuir ANM | Obligatorio, decimal |
| **Total (ANH + ANM)** | **Calculado**, solo lectura |
| Soporte del radicado | Archivo obligatorio si aún no hay uno cargado |

> El legado guarda los valores quitando los separadores de miles con `Replace(".", "")` antes de `decimal.Parse` — un parche de formato que en Angular se resuelve con un input numérico tipado.

### 1.5 Detalle de los pasos ANH / ANM / MME / Fun&Fis

Los cuatro siguen el mismo ciclo (en el legado son tres bloques copiados y pegados con los nombres cambiados):

1. **Seleccionar archivo** Excel de determinaciones.
2. **Validar** contra la parametrización de la plantilla (`ConsultarEncabezadosPlantilla` + `ConsultarDetallePlantilla`) leyendo la hoja correspondiente. Reglas por fila:
   - el código DANE debe existir (`Entidades.ValidarCodigoEntidad`);
   - cada valor mapeado debe ser decimal;
   - se redondea a 2 decimales y se trunca: `Math.Round(x,2)` → `Math.Truncate(x*100)/100` → `Math.Round(x,2)` (ver la corrección de §5.2);
   - no se admiten negativos;
   - se acumula un **log línea a línea** con marca de tiempo, descargable como `.txt`.
3. **Mostrar el resumen de validación** en grilla:

   | Descripción de datos | Resumen validación | Total AD20 | Total AD5 | AD20 OxR SFF | AD5 OxR SFF | Descuentos | Total a distribuir | Total registros | Fecha validación | Descargas |
   |---|---|---|---|---|---|---|---|---|---|---|

   `Resumen validación` es el literal `"Sin Errores"` / `"Con Errores"`.
4. Si hay errores → se persiste el intento (archivo + log) pero **no** se activan los datos.
5. Si no hay errores y **ya existía un cargue activo** → se pregunta al usuario si reemplaza (`mostrarNotificacionSiNoANH/ANM/MME/FunFis`); al confirmar se desactiva el anterior y se activa el nuevo (`ActivarDesactivarDatosDeterminacionesAgencia`).
6. Fun&Fis añade un **Sí/No** ("¿aplica funcionamiento y fiscalización?"): en `No` se borran las determinaciones (`GuardarActivarDesactivarFunFisCalculo`), y dispone de un **histórico de intentos de cargue** paginado.

### 1.6 Panel de cálculo

- **Resumen por entidad:** Entidad · Valor a distribuir · Ingresos ANH · Ingresos ANM · Determinación AD 20 % · AD 5 % · AD 20 % no aforados · AD 5 % no aforados · AD 20 % OxR SFF · AD 5 % OxR SFF · Descuentos.
- **Archivos de la IAC calculada:** Id IAC · Fecha de cálculo · descarga Excel. Existe además un botón **Generar XML** (interfaz SPGR).
- **Avance:** Concepto · Presupuesto · IAC · Avance (%) · IAC nuevo acumulado · Avance nuevo acumulado.
- **Enviar a Validación:** se deshabilita y cambia su rótulo a "Enviada a Validación" una vez ejecutado.

---

## 2. Afinidad con los componentes existentes

Los tres componentes que el encargo menciona ya establecen el vocabulario visual y de código que la IAC debe heredar. El grado de afinidad es muy distinto en cada caso.

### 2.1 `sgr-carga-insumos` — afinidad **alta**, reutilización directa

Es, literalmente, el mismo problema resuelto un nivel más arriba: agrupar insumos por **entidad fuente**, subir un Excel por insumo, mostrar estado y avance.

| Elemento de `sgr-carga-insumos` | Aplicación en IAC |
|---|---|
| `type EstadoCarga = 'pendiente' \| 'cargando' \| 'cargado' \| 'error'` | Idéntico para el estado de cada participante. |
| `estadoLabel()` / `estadoSeverity()` → `p-tag` | Idéntico. |
| `triggerFileInput()` / `onFileSelected()` / `accept` (`.xlsx,.xls`) | Idéntico, incluido el `input.value = ''` para poder reseleccionar el mismo archivo. |
| Cabecera de avance (`totalInsumos`, `insumosCargados`, `porcentajeAvance`) | Se convierte en "3 de 4 pasos obligatorios completos". |
| Agrupación por `FuenteInsumos` (sigla, nombre, icono) | Los cinco participantes MHCP / ANH / ANM / MME / Fun&Fis. |
| `descargarPlantilla(fuente, insumo)` | Descarga de la plantilla oficial por participante (`IdPlantilla` 3–6). |
| `InfoPopupComponent` + Diccionario / Siglas | Se reutiliza; el diccionario IAC añade AD 20/5 %, OxR SFF, no aforados, SPGR. |
| Bandera `simularCarga` | Se replica como `simularIac`. |
| `.scss` del componente | Base directa para el nuevo. |

**Diferencias que impiden reutilizarlo tal cual:** `sgr-carga-insumos` es por **bienio** y sin entidad maestra; la IAC es por **instancia** (una IAC identificada, con periodo, estado y ciclo de vida), exige **orden y navegación entre pasos**, valida el **contenido** del archivo (no solo la extensión) y admite **reemplazo con confirmación** e **histórico de intentos**.

### 2.2 `sgr-ejecucion-distribucion` — afinidad **alta en patrones**, proceso **distinto**

| Elemento | Aplicación en IAC |
|---|---|
| Bloque de **precondiciones** con botón deshabilitado y motivo visible | "Faltan insumos de ANM" → deshabilita *Validar y Calcular IAC*. |
| Barra de **progreso por fases** durante la ejecución | Progreso del cálculo de la IAC. |
| **Historial versionado** con `p-table` + `p-tag` de estado | Historial de cálculos y de intentos de cargue por participante. |
| **Diálogo de detalle** con chequeos y totales | Resumen de validación del participante y resumen por entidad. |
| `descargarSalida()` + `dispararDescarga()` | Descargas Excel / XML SPGR / log `.txt`. |
| `marcarOficial()` con `ConfirmationService` | *Enviar a Validación* (acción irreversible, exige confirmación). |
| Pestaña **Parámetros** en solo lectura | La IAC muestra la versión de parámetros aplicada; el mock ya incluye `red('IAC', 'IAC (límite SPGR)', 2)`. |

**Por qué NO conviene meter la IAC como pestaña de este componente:** son procesos de periodicidad y entidad distintas — la distribución es **bienal** y produce el Plan de Recursos; la IAC es **por periodo de recaudo** y produce una instrucción de abono. Comparten lenguaje visual, no dominio. Fusionarlos obliga a un selector de bienio y otro de periodo conviviendo, y a un historial que mezcla dos tipos de objeto.

### 2.3 `sgr-parametros-distribucion` — afinidad **media**, dos vínculos concretos

1. **Vínculo funcional directo (fuera del alcance elegido):** `IACAutomatica.aspx` (participaciones porcentuales por asignación, con la regla "el total debe sumar 100 %" y una casilla de *edición libre* que salta la validación) e `IACAutomatica2.aspx` (matriz de aplicabilidad por tipo de beneficiario: departamentos, municipios, CAR, regiones, otros, bolsas) son **exactamente** pantallas de parámetros. Su hogar natural es `sgr-parametros-distribucion`, cuyo motor `recalcular()` / `Validacion[]` ya implementa el patrón "regla dura con esperado vs. actual". Cuando se aborden, deben ir allí y no en un componente nuevo.
2. **Vínculo de consumo (dentro del alcance):** el detalle de una IAC debe mostrar, en solo lectura, **qué versión de parámetros se aplicó** en el cálculo (`getParametrosVigentesSgr`), igual que hace `sgr-ejecucion-distribucion`.

### 2.4 Extracciones compartidas propuestas

Estas piezas ya están duplicadas o lo estarán en cuanto se agregue la IAC. Se proponen como parte del trabajo, no como refactor aparte:

| Nuevo archivo | Contenido | Duplicación que resuelve |
|---|---|---|
| `src/app/utils/descarga-archivo.ts` | `dispararDescarga(blob, filename)`, `extraerNombreArchivo(headers)`, `descargarTexto()` | 18 componentes usan hoy `createObjectURL` con su propia variante |
| `src/app/utils/estado-carga.ts` | `EstadoCarga`, `estadoCargaLabel()`, `estadoCargaSeverity()` | `sgr-carga-insumos` y el nuevo `sgr-iac-detalle` |
| `src/app/components/shared/selector-archivo/` | Botón + `<input type="file">` oculto, con validación de extensión y tamaño | `sgr-carga-insumos`, `paso-determinaciones` y `paso-mhcp` |
| `src/app/services/sgr-parametros.service.ts` | Acceso a los parámetros de cálculo (bandera `simularParametros`, conjunto de referencia y helpers de formato) | `sgr-parametros-distribucion`, `sgr-ejecucion-distribucion` y `sgr-iac-detalle` tenían —o iban a tener— su propia copia del mismo conjunto simulado |
| `src/app/utils/plantilla-excel.validator.ts` | Prevalidación con ExcelJS parametrizada por `DefinicionPlantilla` (hoja, fila inicial, columnas por `CodCampo`) | Nuevo; espejo cliente de `ValidacionIAC.LeerHojasExcel*` |

> **Dos ajustes al implementar la extracción.**
> 1. *No hay una `tarjeta-insumo` común.* La propuesta inicial era unificar la presentación del cargue, pero en `sgr-carga-insumos` un insumo es una **fila de `p-table`** y en `paso-determinaciones` es un **panel con totales y log de validación**. Forzar un componente sobre ambas formas habría sido una abstracción falsa. Lo que sí estaba triplicado era la mecánica del `<input type="file">` (disparar el diálogo, validar extensión y tamaño, limpiar `value` para poder reelegir el mismo archivo), y eso es lo que se extrajo como `selector-archivo`.
> 2. *`estado-carga.ts` no aplica a `sgr-ejecucion-distribucion`.* Su `estadoLabel`/`estadoSeverity` operan sobre `EstadoCorrida` (`en_proceso` · `exitosa` · `con_diferencias` · `fallida`), que es otro dominio: comparten la firma, no el significado. De ese componente solo se migró `dispararDescarga`.

> `exceljs@^4.4.0` ya es dependencia del proyecto (se usa en `sgr-informacion-general`), así que la prevalidación no agrega peso nuevo al bundle más allá del *import* diferido.

---

## 3. Arquitectura propuesta

### 3.1 Archivos

```
src/app/
├── models/
│   └── sgr-iac.models.ts                 # modelo de dominio IAC
├── services/
│   └── sicodis-api.service.ts            # + sección "SGR · IAC" (~20 métodos)
├── utils/
│   ├── descarga-archivo.ts               # (extracción compartida)
│   ├── estado-carga.ts                   # (extracción compartida)
│   └── plantilla-excel.validator.ts      # prevalidación ExcelJS
├── components/
│   ├── shared/tarjeta-insumo/            # (extracción compartida)
│   ├── sgr-iac/                          # listado + creación
│   │   └── sgr-iac.component.ts|html|scss
│   └── sgr-iac-detalle/                  # wizard 5 pasos + cálculo
│       ├── sgr-iac-detalle.component.ts|html|scss
│       └── pasos/
│           ├── paso-mhcp.component.ts            # formulario + soporte
│           ├── paso-determinaciones.component.ts # ANH | ANM | MME (parametrizado)
│           └── paso-funfis.component.ts          # Sí/No + histórico
└── app.routes.ts                         # + 2 rutas
```

Un único `paso-determinaciones` parametrizado por participante cubre ANH, ANM y MME: en el legado, `BtnGuardarDatosANH`, `...ANM` y `...MME` son funcionalmente idénticos. Fun&Fis se separa porque añade el Sí/No y el histórico.

### 3.2 Rutas

```ts
{ path: 'sgr-iac',     component: SgrIacComponent,        canActivate: [authGuard, paginaGuard],
  data: { breadcrumb: 'SGR — Instrucción de Abono a Cuenta', paginaLegado: 'IACAutomatica4.aspx' } },
{ path: 'sgr-iac/:id', component: SgrIacDetalleComponent, canActivate: [authGuard, paginaGuard],
  data: { breadcrumb: 'SGR — IAC · Detalle',                 paginaLegado: 'IACAutomatica4.aspx' } },
```

`paginaLegado` reutiliza el nombre real de la página del legado para que `Consulta_AccesoPaginas` resuelva el permiso sin tocar la tabla de permisos.

### 3.3 Menú

Nueva entrada en `itemAdministracion()` de `header.component.ts`, agrupada con las de distribución:

```
Administración
 ├─ Configuración
 ├─ SGR — Carga de Insumos
 ├─ SGR — Instrucción de Abono a Cuenta      ← nueva
 ├─ SGR — Ejecución de la Distribución
 └─ SGR — Parámetros de la Distribución
```

### 3.4 Modelo de dominio (`sgr-iac.models.ts`)

```ts
export type EstadoIac       = 'borrador' | 'calculada' | 'enviada' | 'anulada';
export type ParticipanteIac = 'MHCP' | 'ANH' | 'ANM' | 'MME' | 'FUNFIS';
export type EstadoPaso      = 'pendiente' | 'cargando' | 'completo' | 'error';

/** Identificadores del legado, fijados en un solo lugar (ver §1.2). */
export const ID_PARTICIPANTE: Record<ParticipanteIac, number> =
  { FUNFIS: 1, MHCP: 2, ANH: 3, ANM: 4, MME: 5 };
export const ID_PLANTILLA: Partial<Record<ParticipanteIac, number>> =
  { ANH: 3, ANM: 4, MME: 5, FUNFIS: 6 };

export interface IacResumen {              // fila del listado
  id: number; descripcion: string;
  bienio: string; idVigencia: number;
  periodo: string; idPeriodo: number;
  ingresosHidrocarburos: number; ingresosMineria: number; totalIngresos: number;
  fase: string; estado: EstadoIac;
  fechaCreacion: string; usuarioCreacion: string;
}

export interface NuevaIacRequest {
  nombre: string; idVigencia: number; idPeriodo: number; idTipoIac: number;
}

export interface EstadoInsumosIac {         // avance de los 5 pasos
  idIac: number;
  pasos: Array<{
    participante: ParticipanteIac; estado: EstadoPaso; obligatorio: boolean;
    fechaActualizacion?: string; idValidacionMaestro?: number;
  }>;
  completo: boolean;                        // MHCP ∧ ANH ∧ ANM ∧ MME
}

export interface InsumoMhcp {
  noRadicado: string; fechaRadicado: string;
  ingresosAnh: number; ingresosAnm: number; totalIngresos: number;
  idArchivoSoporte?: number; nombreArchivoSoporte?: string;
}

export interface ResumenValidacionDeterminaciones {
  descripcionDatos: string;                 // "Hoja" en el legado
  validacion: 'Sin Errores' | 'Con Errores';
  totalAd20: number; totalAd5: number;
  totalAd20OxrSff: number; totalAd5OxrSff: number;
  totalDescuentos: number; totalADistribuir: number;
  totalRegistros: number; fechaValidacion: string;
  idArchivo: number;                        // para descargar Excel y log
  errores: string[];                        // log parseado, para mostrarlo en pantalla
}

export interface DefinicionPlantilla {      // de SGR_DIST_DetallePlantillaCargue
  idPlantilla: number; hoja: string; filaInicial: number;
  campos: Array<{ codCampo: string; nombreCampo: string; columna: number; tipoDatos: string }>;
}

export interface ResultadoCalculoIac {
  idIac: number; fechaCalculo: string;
  resumenPorEntidad: ResumenEntidadIac[];
  archivos: Array<{ idArchivo: number; tipo: 'excel' | 'xml'; fechaCalculo: string }>;
  avance: AvanceIac[];
  enviadaAValidacion: boolean;
  versionParametros?: string;
}
```

### 3.5 Contrato REST propuesto

Un endpoint por operación del legado, siguiendo la convención ya usada en `sgrdistribucion/*`.

| Método | Endpoint | Origen legado |
|---|---|---|
| `GET` | `/sgr/iac/listado` | `sp_SGR_IAC_CA_ListadoDistribucionesValidacion` |
| `GET` | `/sgr/iac/vigencias` | `sp_SGR_IAC_CA_ListadoVigenciasActual` |
| `GET` | `/sgr/iac/periodos/{idVigencia}` | `sp_SGR_IAC_CA_ListadoPeriodosVigenciaActual` |
| `GET` | `/sgr/iac/tipos` | `sp_SGR_IAC_CA_ListadoTiposDistribucionSGR` |
| `POST` | `/sgr/iac` | `sp_SGR_IAC_CA_GuardarNuevoRegistroIAC` |
| `GET` | `/sgr/iac/{id}/estado-insumos` | `sp_SGR_IAC_CA_ConsultarDatosRegistroIACInformacionActiva` |
| `GET` | `/sgr/iac/{id}/mhcp` | `sp_SGR_IAC_CA_ConsultarDatosRegistroIACInformacionMHCP` |
| `POST` | `/sgr/iac/{id}/mhcp` *(multipart)* | `sp_SGR_IAC_CA_GuardarRegistroIACInformacionMHCP` + `CargarArchivoSoporte` |
| `GET` | `/sgr/iac/{id}/determinaciones/{participante}` | `...ConsultarDatosRegistroIACInformacion{ANH\|ANM\|MME\|FunFis}Activa` |
| `POST` | `/sgr/iac/{id}/determinaciones/{participante}` *(multipart)* | `GuardarInsumoParticipantesDistribucionesValidacionMaestro` + `CargarDistribucionesDeterminaciones*` |
| `POST` | `/sgr/iac/{id}/determinaciones/{participante}/activar` | `sp_SGR_IAC_CA_ActivarDesactivarDatosDeterminacionesAgencia` |
| `DELETE` | `/sgr/iac/{id}/determinaciones/{participante}` | `sp_SGR_IAC_CA_DesactivarDatosDeterminacionesAgencia` |
| `PUT` | `/sgr/iac/{id}/funfis/aplica` | `sp_SGR_IAC_CA_GuardarActivarDesactivarFunFisCalculo` |
| `GET` | `/sgr/iac/{id}/funfis/historico` | `sp_SGR_IAC_CA_ConsultarDatosArchivosIntentosCarguesFunFis` |
| `POST` | `/sgr/iac/{id}/calcular` | `sp_SGR_IAC_CA_CalcularIAC` |
| `GET` | `/sgr/iac/{id}/resultado` | `...ConsultarDatosRegistroIACInformacionGeneral` + `...ConsultarDatosCalculoIACAvance` |
| `POST` | `/sgr/iac/{id}/enviar-validacion` | `sp_SGR_IAC_CA_EnviarIACAValidacion` |
| `GET` | `/sgr/iac/archivo/{idArchivo}` | `ConsultarArchivoSoporteInsumoIAC` (Excel / soporte) |
| `GET` | `/sgr/iac/archivo/{idArchivo}/log` | mismo SP, columna de log de validación |
| `GET` | `/sgr/iac/plantilla/{idPlantilla}` | `SGR_DIST_DetallePlantillaCargue` (definición + descarga del `.xlsx`) |

**Convención de respuesta.** El legado devuelve `DataSet` con `Tables[0]` = `"OK"`/`"NOK"` y `Tables[1]` = mensaje. Se propone normalizarlo en el backend a:

```json
{ "ok": true, "mensaje": "…", "datos": { } }
```

y que el front trate `ok === false` como error de negocio (`p-toast` severidad `error`), reservando el `catchError` de HTTP para fallos de transporte. **Debe acordarse con quien construya el backend antes de la fase 3.**

---

## 4. Diseño de interfaz

### 4.1 `sgr-iac` — listado

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  BANNER · "Instrucción de Abono a Cuenta"                    [Dicc.] [Siglas] │
├───────────────────────────────────────────────────────────────────────────────┤
│  [ Vigencia ▼ ]  [ Periodo ▼ ]  [ Estado ▼ ]          [ + Nueva IAC ]  [ ↻ ]  │
├───────────────────────────────────────────────────────────────────────────────┤
│  Id │ Descripción      │ Bienio    │ Periodo │ Ing. Hidroc. │ Ing. Min. │ …    │
│ ────┼──────────────────┼───────────┼─────────┼──────────────┼───────────┼──────│
│  42 │ IAC agosto 2026  │ 2025-2026 │ 2026-08 │  1.234.567…  │  456.789… │      │
│     │ Fase: Calculada · creada 04/09/26 por jperez        [ 👁 ] [ ⬆ ] [ ▶ ]  │
└───────────────────────────────────────────────────────────────────────────────┘
   👁 Ver detalle    ⬆ Cargar insumos    ▶ Calcular      (los tres → /sgr-iac/:id)
```

Las tres acciones del legado (Ver / Cargar insumos / Calcular) navegan a la misma ruta de detalle, posicionando la pestaña correspondiente; se conserva el icono para que el usuario del legado reconozca la acción.

**Nueva IAC** (`p-dialog`): Vigencia → Periodo (cascada) → Tipo de IAC → Nombre sugerido. Es el patrón de cascada ya documentado en `CLAUDE.md`.

### 4.2 `sgr-iac-detalle` — wizard

```
┌───────────────────────────────────────────────────────────────────────────────┐
│  ‹ Volver al listado     IAC #42 · "IAC agosto 2026" · 2025-2026 · 2026-08     │
│  Estado: Borrador                                    [ Enviar a Validación ]  │
├───────────────────────────────────────────────────────────────────────────────┤
│  ●━━━━━●━━━━━●━━━━━○━━━━━◍                                                     │
│  MHCP  ANH   ANM   MME   Fun&Fis(opc.)          3 de 4 pasos obligatorios      │
├───────────────────────────────────────────────────────────────────────────────┤
│  [ Insumos ]  [ Cálculo ]  [ Parámetros aplicados ]                            │
├───────────────────────────────────────────────────────────────────────────────┤
│  PASO ACTIVO                                                                   │
│  … formulario MHCP  /  cargue + resumen de validación  /  Sí-No Fun&Fis …      │
├───────────────────────────────────────────────────────────────────────────────┤
│                                  [ ‹ Anterior ]  [ Guardar ]  [ Siguiente › ]  │
└───────────────────────────────────────────────────────────────────────────────┘
```

- El indicador de pasos reemplaza `ItemAvancePanel*` + `IndicadorMHCPCompletado` del legado (clase `checked-linea-avance-govco`). Se implementa con `p-steps` en modo interactivo, o con marcado propio si `p-steps` no permite representar el estado "opcional".
- Anterior / Siguiente replican `btnAnterior_Click` / `btnSiguiente_Click`, incluida la ocultación del botón en los extremos.
- Se **puede navegar libremente** entre pasos (como en el legado, que expone los cinco botones de pestaña); el bloqueo está en el botón *Calcular*, no en la navegación.

### 4.3 Paso de determinaciones (ANH / ANM / MME)

```
┌── Agencia Nacional de Hidrocarburos ───────────────────────────────────────────┐
│  Plantilla: AD_ANH  ·  hoja "AD_ANH"           [ ⬇ Descargar plantilla oficial ]│
│                                                                                 │
│  ┌ Cargue activo ────────────────────────────────────────────────────────────┐ │
│  │ ANH-DNP ADJUNTO_268.xlsx · validado 04/09/26 08:24 · Sin errores           │ │
│  │ 1.148 registros · $ 812.345.678.901 a distribuir      [ ⬇ Excel ] [ ⬇ Log ]│ │
│  │                                                              [ 🗑 Eliminar ]│ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  [ Seleccionar archivo… ]   ⓘ Se validará antes de enviarlo al servidor         │
│                                                                                 │
│  ┌ Resultado de la validación (archivo nuevo) ───────────────────────────────┐ │
│  │ ⚠ Con errores · 3 hallazgos                                               │ │
│  │  · Línea 47: código de entidad 99999 no existe en la base de datos        │ │
│  │  · Línea 112: valor no numérico en "AD 20 % no aforados"                  │ │
│  │  · Línea 803: valor negativo no permitido                                 │ │
│  │  AD20 $… │ AD5 $… │ AD20 OxR SFF $… │ AD5 OxR SFF $… │ Descuentos $…      │ │
│  └───────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Mejora deliberada sobre el legado:** hoy hay que descargar un `.txt` para leer los errores. Aquí los primeros ~20 hallazgos se muestran en pantalla y el `.txt` completo queda como descarga.

**Reemplazo de un cargue activo:** `p-confirmDialog` — "Ya existe un cargue activo de la ANH validado el 04/09/26. ¿Desea reemplazarlo? El anterior quedará inactivo pero se conservará en el histórico." Equivale a `mostrarNotificacionSiNoANH()` + `ActivarDesactivarDatosDeterminacionesAgencia`.

### 4.4 Pestaña Cálculo

Reproduce el `PanelCalcular`: resumen por entidad (`p-table` con `scrollable` y las once columnas monetarias), archivos de la IAC calculada con descarga Excel y XML, y la tabla de avance con `percentFormat`. El botón *Validar y Calcular IAC* queda deshabilitado con tooltip explícito mientras falte algún participante obligatorio — el legado solo mostraba una notificación *después* de pulsar.

---

## 5. Validación de plantillas Excel

### 5.1 Reparto de responsabilidades

| Capa | Responsabilidad |
|---|---|
| **Cliente** (`plantilla-excel.validator.ts`) | Verifica que exista la hoja esperada, que el encabezado coincida con la definición de plantilla, que las columnas mapeadas sean numéricas, que no haya negativos y que los códigos DANE tengan forma válida. Muestra los hallazgos al instante, sin subir el archivo. |
| **Servidor** | Repite todo lo anterior **y** valida lo que el cliente no puede: existencia real del código de entidad (`ValidarCodigoEntidad`), duplicados por clave `codigoDane-codCampo`, redondeo/truncamiento normativo y la persistencia atómica de maestro + detalle + archivo + log. |

El cliente **nunca decide** si un cargue es válido: solo evita viajes inútiles. La bandera `esValidacionExitosa` que se persiste es siempre la del servidor.

### 5.2 Reglas espejo (equivalencia legado → cliente)

| Regla en `ValidacionIAC.cs` | Equivalente cliente |
|---|---|
| `LeerHojaArchivo(path, "AD_ANH$")` | `workbook.getWorksheet('AD_ANH')` — el sufijo `$` es sintaxis OleDb, no parte del nombre de la hoja |
| `PosicionCodigo` / `FilaInicial` desde `SGR_DIST_DetallePlantillaCargue` | `DefinicionPlantilla.campos[].columna` y `filaInicial`, obtenidos de `/sgr/iac/plantilla/{id}` |
| `decimal.TryParse(valor)` | conversión numérica cuidando el separador decimal `,` que Excel entrega en `es-CO` |
| `Math.Round(x,2)` → `Math.Truncate(x*100)/100` → `Math.Round(x,2)` sobre `decimal` | **un solo** redondeo bancario a 2 decimales, acumulando en centavos enteros (ver aviso) |
| `Entidades.ValidarCodigoEntidad(codigo)` | comprobación de **forma**, no de existencia (ver aviso) |
| `valorFinal >= 0` | idéntico |
| Clave `codigoDane + "-" + CodCampo` como PK del detalle | `Set<string>` para detectar duplicados |

> ⚠️ **Corrección sobre el redondeo (verificada contra la plantilla real de la ANH).**
> La secuencia del legado opera sobre `decimal`, que es aritmética exacta en base 10: ahí el truncamiento intermedio nunca altera un valor que ya tiene dos decimales, así que las tres operaciones equivalen a un único redondeo bancario (`MidpointRounding.ToEven`).
> Transcribirla literalmente con `number` **sí cambia el resultado**: `1114598868.55 * 100` da `111459886854.99998` en punto flotante y `Math.trunc` pierde un centavo por registro. Con la transcripción literal, el total de la plantilla `ANH-DNP ADJUNTO_268` daba `103.316.233.771,77` frente a los `103.316.233.771,86` que el propio Excel calcula en su fila de sumas.
> `plantilla-excel.validator.ts` implementa la **equivalencia** (escalado a centavos con `toPrecision(15)`, redondeo al par, acumulación en enteros) y reproduce los totales del archivo al centavo.

> ⚠️ **No todos los beneficiarios tienen código DANE.**
> La plantilla real de la ANH incluye las Corporaciones Autónomas Regionales con códigos `C0000`–`C0009` y la bolsa «Otros por Distribuir» con código `F0000`. Exigir cinco dígitos marcaba 11 registros válidos como error y dejaba fuera $466.544.412,01 del total.
> El cliente valida la **forma** (`^(\d{5}|[A-Za-z]\d{4})$`); la **existencia** la sigue verificando el servidor contra la base de datos, como en el legado.

---

## 6. Plan de trabajo por fases

### Fase 1 · Cimientos compartidos — **hecha**

- [x] `src/app/utils/descarga-archivo.ts` con `dispararDescarga()`, `extraerNombreArchivo()` y `descargarTexto()`.
- [x] `src/app/utils/estado-carga.ts` con `EstadoCarga`, `estadoCargaLabel()`, `estadoCargaSeverity()`.
- [x] `sgr-carga-insumos` migrado a ambos utilitarios; `sgr-ejecucion-distribucion` migrado a `descarga-archivo` (su estado es de otro dominio, ver §2.4).
- [x] `src/app/models/sgr-iac.models.ts` con el modelo de dominio de §3.4.

### Fase 2 · Listado y creación (`sgr-iac`) — **hecha**

- [x] Componente `sgr-iac` con banner, filtros (vigencia / periodo / estado), `p-table` y las tres acciones por fila.
- [x] Diálogo *Nueva IAC* con cascada vigencia → periodo, nombre sugerido y validación de campos obligatorios.
- [x] Datos mock (`simularIac = true`) con tres IAC en distintos estados (borrador, calculada, enviada).
- [x] Rutas (`/sgr-iac`, `/sgr-iac/:id`) y entrada de menú bajo **Administración › SGR - Cálculo**.

### Fase 3 · Contrato de servicio — **hecha (provisional)**

- [x] `src/app/services/sgr-iac.service.ts` con los ~20 métodos de §3.5 tipados y las rutas declaradas en `RUTAS`.
- [ ] Acordar con backend la envoltura `{ ok, mensaje, datos }` y el manejo de `multipart/form-data`.
- [ ] Trasladar las llamadas HTTP a `sicodis-api.service.ts` (servicio único de API) cuando el contrato esté cerrado.
- [ ] Documentar el contrato en `docs/sgr/integracion/`.

### Fase 4 · Wizard: paso MHCP — **hecha**

- [x] `sgr-iac-detalle` con cabecera, indicador de cinco pasos, pestañas y navegación Anterior / Siguiente.
- [x] `paso-mhcp`: formulario con las validaciones de §1.4 (patrón de radicado incluido), total calculado y cargue del soporte.
- [x] Estado de completitud leído del servicio, no inferido en el cliente.

### Fase 5 · Wizard: determinaciones — **hecha**

- [x] `plantilla-excel.validator.ts` con ExcelJS (import diferido, va a un *chunk* aparte de 1,64 MB) y las reglas de §5.2.
- [x] `shared/selector-archivo` adoptado en `sgr-carga-insumos`, `paso-determinaciones` y `paso-mhcp` (ver §2.4 sobre por qué no fue `tarjeta-insumo`).
- [x] `paso-determinaciones` parametrizado (ANH / ANM / MME / Fun&Fis): plantilla, selección, prevalidación, resumen, confirmación de reemplazo, descarga de log, eliminación e histórico.
- [x] `paso-funfis`: Sí/No, borrado de determinaciones al pasar a No, histórico de intentos.

### Fase 6 · Cálculo y envío — **hecha**

- [x] Pestaña *Cálculo*: precondiciones, botón deshabilitado con el motivo visible, resumen por entidad, archivos y avance.
- [x] *Enviar a Validación* con `p-confirmDialog` y bloqueo posterior (la IAC enviada queda en solo lectura).
- [x] Pestaña *Parámetros aplicados* (solo lectura), con la versión aplicada frente a la vigente y aviso cuando difieren.
- [ ] Descargas Excel y XML SPGR: la interfaz está lista y deshabilitada; requieren backend.

### Fase 7 · Integración y cierre — **pendiente**

- [ ] `simularIac = false`; ajustes de contrato contra el backend real.
- [x] Pruebas unitarias del validador de plantillas: 17 casos en `plantilla-excel.validator.spec.ts` (redondeo bancario, hoja ausente, códigos CAR y bolsas, cero inicial, código inválido, no numérico, negativo, duplicados, coma decimal, filas sin código, log, Fun&Fis, acumulación de mil registros).
- [ ] Pruebas del total del paso MHCP y de la lógica de completitud.
- [x] Sanear los specs obsoletos que impedían correr `npm test` (ver abajo).
- [ ] Revisión de accesibilidad completa según `PLAN_TRABAJO_USABILIDAD_ACCESIBILIDAD_SICODIS.md`.
- [ ] Registro de la pantalla en la tabla de permisos (`paginaLegado: 'IACAutomatica4.aspx'`).
- [ ] Documentar en `docs/manual-de-usuario/`.

### `npm test` volvió a funcionar

Antes de este trabajo la corrida de Karma no arrancaba: siete specs generados
por `ng generate` habían quedado desfasados de sus componentes y no compilaban,
y un solo error de tipos aborta la corrida entera. Una vez saneados aparecieron
58 fallos en tiempo de ejecución que ese error tapaba. Todos corregidos:

**Ahora: 223 pruebas, 223 en verde**, estable en corridas consecutivas.

Las causas fueron cuatro, y merece la pena recordarlas porque volverán a
aparecer cada vez que se genere un spec nuevo:

1. **Proveedores ausentes.** Los stubs de `ng generate` no declaran
   `provideHttpClient()`, `provideRouter()` ni `provideUserAuth()`, y los
   componentes standalone inyectan `SicodisApiService` o `UserAuthService`.
2. **Animaciones.** PrimeNG usa propiedades sintéticas; sin
   `NoopAnimationsModule` el `detectChanges()` falla con `NG05105`.
3. **Deriva de aserciones.** Varias pruebas comprobaban valores que antes
   estaban en código y hoy llegan de la API, o API del componente que
   desapareció. Se reescribieron contra el contrato actual.
4. **Contaminación entre suites.** `config.service.spec` sustituía
   `window.localStorage` por un doble y no lo restauraba, lo que hacía fallar a
   las suites posteriores.

Dos hallazgos que el saneamiento sacó a la luz y que **son de producción**, no
de las pruebas:

- `ConfigService.initializeDefaultConfigs()` llamaba a `localStorage.getItem`
  fuera del `try`. En una ventana privada o con los datos de sitio bloqueados
  eso lanza y revienta el constructor del servicio —y con él el arranque de la
  aplicación—. **Corregido.**
- `AppComponent.ngOnInit()` fuerza un `window.location.reload()` la primera vez
  de cada sesión. En Karma recarga el propio runner; el spec lo esquiva
  marcando el centinela, pero **la lógica en sí sigue ahí y conviene revisarla**.

### Verificación realizada

El validador de plantillas se contrastó contra el archivo real
`IAC/ArchivosIAC/638930033582872581ANH-DNP ADJUNTO_268_20250904082239.xlsx`
(hoja `AD_ANH`, 1.163 beneficiarios): **0 hallazgos** y totales idénticos a los
que el propio Excel calcula en su fila de sumas — AD 20 % `103.316.233.771,86`
y AD 5 % `25.829.058.442,97`. Ese contraste produjo las dos correcciones
documentadas en §5.2.

---

## 7. Riesgos y puntos de atención

| # | Riesgo | Mitigación |
|---|---|---|
| 1 | **El backend no existe.** Todo el plan depende de un servicio por construir. | Contrato cerrado en la fase 3 antes de invertir en las fases 4–6; mocks fieles al contrato para que la integración sea sustitución, no reescritura. |
| 2 | **Los identificadores de participante y plantilla están "mágicos" en el legado** y su enum está desalineado (§1.2). | Fijarlos en `sgr-iac.models.ts` como constante única documentada; que el backend los confirme contra la base antes de cerrar el contrato. |
| 3 | **El redondeo de valores** difiere entre .NET y JavaScript. | Toda decisión monetaria la toma el servidor; el cliente solo previsualiza. Prueba unitaria con los mismos casos del legado. |
| 4 | **Archivos duplicados en disco y en BD.** `IAC/ArchivosIAC/` contiene 17 copias del mismo `.xlsx` con distinto prefijo de timestamp. | El nuevo backend debe persistir solo en base de datos (como ya hace en paralelo) y exponerlos por `idArchivo`. Confirmar antes de migrar. |
| 5 | **Tamaño de las plantillas** (~260 KB, más de 1.000 filas) leídas en el navegador. | ExcelJS con import diferido y lectura únicamente de la hoja objetivo; si el perfilado lo pide, mover a Web Worker. |
| 6 | **La pantalla del legado sigue en producción.** | El `paginaLegado` compartido permite convivencia; definir con negocio la fecha de corte para que no se creen IAC por ambos caminos. |
| 7 | **`sgr-carga-insumos` y `sgr-iac` pueden confundirse** en el menú (ambos "cargan insumos del SGR"). | Rótulos explícitos: "Carga de insumos (distribución bienal)" frente a "Instrucción de Abono a Cuenta", y una nota en el diccionario de cada uno. |

---

## 8. Trabajo derivado (fuera de alcance, recomendado)

1. **Migrar `IACAutomatica.aspx` e `IACAutomatica2.aspx` a `sgr-parametros-distribucion`** como dos nuevas secciones ("Participaciones por asignación" y "Aplicabilidad por tipo de beneficiario"), aprovechando el motor de reglas duras que ya existe allí. Incluye la casilla *edición libre* que permite saltar la validación del 100 % — decidir con negocio si se conserva.
2. **Fase de validación / confirmación de la IAC** (`sp_SGR_CargarIACValidadas`, `EliminarIAC`, transición `EstadoIAC 1 → 2`), que en el legado vive fuera de estas pantallas.
3. **Comparador de IAC** entre periodos, aprovechando el patrón de `sgr-comparativo` y los datos de `comparativo-iac-vs-presupuesto.ts` que ya existen en el proyecto.
