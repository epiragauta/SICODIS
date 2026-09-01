# Propuesta · Componente de ejecución y versionado de la distribución del SGR

**Fecha:** 31 de agosto de 2026
**Autor:** Equipo SICODIS
**Relacionado con:** componente `sgr-carga-insumos` · Manual M-CA-04 (v12) · Plan de implementación del motor de distribución

---

## 1. Objetivo

Ofrecer un componente visual donde, **una vez cargados los insumos**, el usuario pueda:

1. **Ejecutar el cálculo** de la distribución del SGR para un bienio.
2. **Guardar el resultado versionado por fecha/hora de ejecución** (cada corrida es una versión inmutable).
3. **Consultar el historial** de corridas dentro del mismo componente, con su detalle, reporte de verificación y descargas (Excel oficial, XML SPGR, reporte).

Es la continuación natural del flujo del Manual M-CA-04: **Ingesta de insumos → Motor de cálculo → Verificación → Salidas**, con **trazabilidad y bitácora** de cada corrida (fecha, usuario, versión de insumos, versión de parámetros, hash de resultados).

---

## 2. Ubicación en la aplicación

- **Nombre del componente:** `sgr-ejecucion-distribucion`
- **Ruta:** `/sgr-ejecucion-distribucion` (breadcrumb `SGR — Ejecución de la Distribución`)
- **Relación con `sgr-carga-insumos`:**
  - La carga de insumos es el **paso previo**. El nuevo componente lee el **estado de insumos** del mismo bienio (endpoint `sgrdistribucion/insumos/estado/{idBienio}`) y **habilita el botón "Ejecutar cálculo" solo cuando los insumos requeridos están cargados**.
  - Se propone un **acceso cruzado**: un botón "Ir a ejecución" en `sgr-carga-insumos` cuando el avance llega al 100%, y un panel de precondiciones en el nuevo componente con enlace de vuelta a "Cargar insumos".

---

## 3. Interfaz propuesta

Misma línea visual que `sgr-carga-insumos` / `sgr-programacion` (banner gradient, filtro de **Bienio**, `p-card` + `p-table`, botones Diccionario/Siglas). Tres zonas:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  BANNER · "Ejecución de la Distribución SGR"                               │
├──────────────────────────────────────────────────────────────────────────┤
│  [ Bienio: 2027-2028 ▼ ]                          [Diccionario] [Siglas]   │
│  ┌─ Ejecución ─┬─ Parámetros ─┐   (pestañas)                               │
├──┴─────────────┴──────────────┴────────────────────────────────────────────┤
│  PESTAÑA "EJECUCIÓN"                                                        │
│  ZONA 1 · PRECONDICIONES (estado de insumos del bienio)                    │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  ✅ Insumos requeridos: 11 / 11 cargados     [Ver / cargar insumos →] │ │
│  │  Sección I completa · Sección III: 2/2                                │ │
│  │  ──────────────────────────────────────────────────────────────────  │ │
│  │                        [ ▶  Ejecutar cálculo ]                        │ │
│  │   (deshabilitado si faltan insumos; muestra qué falta)                │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│  ZONA 2 · EJECUCIÓN EN CURSO (solo visible durante una corrida)            │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │  ⏳ Ejecutando… tabla 2 → AIL → AIR → FAE → FONPET → SSEC              │ │
│  │  [████████████░░░░░░]  fase 4/7   ·   iniciada 16:44 · usuario jperez │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────────────────┤
│  ZONA 3 · HISTORIAL DE CORRIDAS (versionado por fecha de ejecución)        │
│  ┌──────────────────────────────────────────────────────────────────────┐ │
│  │ Ver.│ Fecha/hora        │ Usuario │ Verif.   │ Estado   │ Acciones    │ │
│  │─────┼───────────────────┼─────────┼──────────┼──────────┼─────────────│ │
│  │ v4 ★│ 31/08/26 16:44    │ jperez  │ ✔ 100%   │ Oficial  │ 👁 ⬇ ⇄ ★    │ │
│  │ v3  │ 30/08/26 09:12    │ mruiz   │ ⚠ dif.   │ Borrador │ 👁 ⬇ ⇄      │ │
│  │ v2  │ 28/08/26 15:03    │ jperez  │ ✔ 100%   │ Borrador │ 👁 ⬇ ⇄      │ │
│  │ v1  │ 26/08/26 11:20    │ jperez  │ ✖ error  │ Fallida  │ 👁          │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│   ★ = versión marcada como oficial   👁 detalle  ⬇ descargas  ⇄ comparar   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Pestaña "Parámetros"** (solo lectura en este componente; edición en pantalla de administración — ver §12):

```
┌──────────────────────────────────────────────────────────────────────────┐
│  PESTAÑA "PARÁMETROS"                                                       │
│  Versión vigente: P-v2 · vigencia 2027-2028 · autor admin · 12/08/26       │
│  [ Ver histórico de parámetros → ]                                          │
│  ┌── A. Porcentajes ────────────┐  ┌── B. Ponderadores ──────────────────┐ │
│  │ Inversión ........... 92,50% │  │ AIL: NBI 0,60 · población 0,40      │ │
│  │  AD (20+5) .......... 25,00% │  │ AIR: NBI 0,50 · pob 0,40 · desemp.  │ │
│  │  AIL (12,68+2,32) ... 15,00% │  │      0,10 · partición 60/40         │ │
│  │  AIR (20,4/13,6) .... 34,00% │  │ FONPET: PPNC 0,80·NBI 0,10·pob 0,10 │ │
│  │ Ahorro / Admón ... 4,5% / 3% │  │ Étnico: urbano 0,40 · rural 0,60    │ │
│  └──────────────────────────────┘  └─────────────────────────────────────┘ │
│  ┌── C. Umbrales y banderas ────┐  ┌── D. Redondeo por salida ───────────┐ │
│  │ Compensación AIL ...... 75%  │  │ PR / FAE / mayor recaudo / multas / │ │
│  │ Piso FAE (del ahorro).. 50%  │  │ étnicas ........ 0 dec · redondeo   │ │
│  │ Bloqueo étnico ........ 20%  │  │ PBC / IAC ...... 2 dec · redondeo   │ │
│  │ Mín. ambiental ..... 2 p.p.  │  │                                     │ │
│  │ No aforados ...... 75% / 25%  │  │ (truncamiento configurable donde    │ │
│  │ ☑ excluir CAR ☑ indeterm.    │  │  la norma lo indica)                │ │
│  └──────────────────────────────┘  └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

**Detalle de una corrida** (al pulsar 👁, se despliega debajo de la fila o en `p-dialog`):

- **Resumen de trazabilidad:** versión, fecha/hora, usuario, versión de insumos, versión de parámetros, **hash de resultados**.
- **Reporte de verificación** (listas de chequeo del manual, nums. 3.3 / 4.2): cuadratura del 100 % por año, revisión por beneficiario y asignación, marcaciones ambientales/étnicas, régimen de redondeo. Cada chequeo con ✔/⚠/✖ y mensaje.
- **Resumen de resultados:** totales por concepto/asignación (Inversión 92,5 % → AIL/AIR/AD/bolsas, Ahorro 4,5 %, Administración 3 %), reutilizando el formato de tablas de `sgr-programacion`.
- **Descargas:** Excel oficial (PR · PBC · IAC), XML SPGR (validado vs XSD) y reporte de verificación.
- **Marcar como oficial:** promueve la versión (una sola oficial por bienio).

---

## 4. Flujo de usuario

1. Selecciona **bienio**.
2. El componente consulta el **estado de insumos** → muestra precondiciones.
3. Si están completos, habilita **"Ejecutar cálculo"**. Si no, indica qué falta y enlaza a `sgr-carga-insumos`.
4. Al ejecutar: se crea una **corrida** (POST). La ejecución es **asíncrona** → la Zona 2 muestra progreso mediante *polling* del estado.
5. Al terminar: la corrida aparece como **nueva versión** en el historial (Zona 3), con su estado de verificación.
6. El usuario abre el **detalle**, revisa el reporte, **descarga** las salidas y, cuando corresponde, **marca la versión como oficial**.

---

## 5. Modelo de datos (interfaces TS propuestas)

```typescript
export interface CorridaDistribucion {
  idCorrida: number;
  version: number;              // v1, v2, … por bienio
  idBienio: number;
  bienio: string;
  fechaEjecucion: string;       // ISO — fecha/hora que versiona la corrida
  usuario: string;
  versionInsumos: string;       // huella del conjunto de insumos usado
  versionParametros: string;    // porcentajes normativos versionados
  hashResultados: string;       // reproducibilidad
  estado: 'en_proceso' | 'exitosa' | 'con_diferencias' | 'fallida';
  esOficial: boolean;
  resumenVerificacion?: ResumenVerificacion;
  mensaje?: string;
}

export interface ResumenVerificacion {
  cuadraturaOk: boolean;        // 100 % de los recursos cuadra
  chequeosTotales: number;
  chequeosOk: number;
  chequeos: ChequeoItem[];
}

export interface ChequeoItem {
  codigo: string;               // p. ej. "3.3.a"
  descripcion: string;
  resultado: 'ok' | 'advertencia' | 'error';
  detalle?: string;
}

export interface EjecucionEstado {
  idCorrida: number;
  estado: CorridaDistribucion['estado'];
  faseActual?: string;          // "AIR", "FAE", …
  progreso?: number;            // 0–100
}
```

---

## 6. Servicio API (endpoints nuevos, bajo `sgrdistribucion/`)

Coherente con lo ya agregado para la carga de insumos:

| Método servicio | Endpoint | Uso |
|---|---|---|
| `ejecutarDistribucionSgr(idBienio)` | `POST sgrdistribucion/ejecutar/{idBienio}` | Inicia la corrida; devuelve `idCorrida` |
| `getEstadoEjecucionSgr(idCorrida)` | `GET sgrdistribucion/corridas/estado/{idCorrida}` | *Polling* del progreso |
| `getCorridasDistribucionSgr(idBienio)` | `GET sgrdistribucion/corridas/{idBienio}` | Historial versionado |
| `getDetalleCorridaSgr(idCorrida)` | `GET sgrdistribucion/corridas/detalle/{idCorrida}` | Reporte + totales |
| `descargarSalidaCorridaSgr(idCorrida, tipo)` | `GET sgrdistribucion/corridas/descarga/{idCorrida}/{tipo}` | `tipo` = `excel` \| `xml` \| `reporte` (Blob) |
| `marcarCorridaOficialSgr(idCorrida)` | `POST sgrdistribucion/corridas/marcar-oficial/{idCorrida}` | Promueve versión oficial |
| `getParametrosVigentesSgr(idBienio)` | `GET sgrdistribucion/parametros/vigente/{idBienio}` | Conjunto de parámetros vigente (ver §12) |
| `getHistoricoParametrosSgr(idBienio)` | `GET sgrdistribucion/parametros/{idBienio}` | Histórico de versiones de parámetros |
| `guardarParametrosSgr(conjunto)` | `POST sgrdistribucion/parametros` | Crea una nueva versión (perfil admin) |

> Igual que en `sgr-carga-insumos`, mientras el backend (motor Python) no exponga estos endpoints, el componente opera con banderas **`simularEjecucion`** y **`simularParametros`** que generan corridas y conjuntos de parámetros simulados (progreso con `setTimeout`, valores de la tabla 2, reporte de ejemplo) para validar el flujo de UI.

---

## 7. Estados, validaciones y reglas de negocio

- **Habilitación de "Ejecutar":** solo con insumos requeridos completos para el bienio (Sección I obligatoria; Sección III requerida para el cálculo indicativo étnico — se puede permitir ejecutar Sección I sin III y avisarlo).
- **Inmutabilidad:** una corrida guardada no se modifica; recalcular genera **una nueva versión**. Esto materializa "guardar el resultado versionado por fecha de ejecución".
- **Una sola versión oficial** por bienio; marcar una nueva desmarca la anterior (con confirmación).
- **Estados de verificación:** `exitosa` (cuadra al 100 %), `con_diferencias` (advertencias del reporte), `fallida` (error del motor).
- **Concurrencia:** bloquear una segunda ejecución del mismo bienio mientras haya una `en_proceso`.

---

## 8. Versionado y trazabilidad (núcleo de la solicitud)

Cada corrida queda registrada con **fecha/hora de ejecución como identidad de la versión**, además de usuario, versión de insumos, versión de parámetros y **hash de resultados** — exactamente la bitácora que el Manual M-CA-04 exige para "reproducir cualquier distribución comunicada". El historial de la Zona 3 hace visible ese versionado dentro del propio componente, con posibilidad de **comparar dos versiones** (diferencias por asignación/beneficiario) en una iteración posterior.

---

## 9. Consideraciones técnicas

- **Ejecución larga / asíncrona:** el motor puede tardar; se usa patrón *iniciar → polling de estado → refrescar historial*. La UI muestra progreso por fase (tabla 2 → AIL → AIR → FAE → FONPET → SSEC → bolsas).
- **Reutilización:** tablas y estilos de `sgr-programacion`/`sgr-carga-insumos`; `NumberFormatPipe` para cifras; `p-tag` para estados; `p-dialog` para el detalle.
- **Descargas:** patrón `HttpResponse<Blob>` ya usado en el servicio (p. ej. `getSgrPlanRecursosDescargarDetalle`).
- **Manejo de errores:** fallback y mensajes accionables, según convención del proyecto.

---

## 10. Plan de implementación por incrementos

Incluye el eje de **parametrización** (ver §12) entrelazado con la ejecución:

1. **Incremento 1 — Ejecución + historial (mock):** precondiciones desde estado de insumos, botón ejecutar, progreso simulado, historial versionado con estados. (Demostrable sin backend.)
2. **Incremento 1.5 — Parámetros de cálculo versionados (solo lectura, mock):** pestaña **"Parámetros"** con el **conjunto vigente** del bienio en sus 4 grupos (porcentajes, ponderadores, umbrales/banderas, redondeo); **anclaje** de cada corrida a `versionParametros`; y visualización de esa versión en el detalle de la corrida. Datos simulados con los valores de la tabla 2 y del plan.
3. **Incremento 2 — Detalle y descargas:** reporte de verificación, totales por asignación, descargas Excel/XML/reporte; el detalle expande los **parámetros usados** en la corrida.
4. **Incremento 3 — Oficialización y API real:** marcar oficial y cableado de endpoints reales de ejecución **y de parámetros** (quitar `simularEjecucion` / `simularParametros`).
5. **Incremento 4 — Administración de parámetros (`sgr-parametros-distribucion`):** pantalla aparte, solo para perfil administrador, para **crear/versionar** conjuntos de parámetros por vigencia, con **validaciones duras** (suma 100 %, sub-repartos cuadran, rangos, decimales ∈ {0,2}), **auditoría** (autor, fecha, motivo) y vigencia. El componente de ejecución permanece de solo lectura.
6. **Incremento 5 — Comparación de versiones:** diff entre corridas por beneficiario/asignación y, opcionalmente, diff entre **versiones de parámetros** para explicar diferencias entre corridas.

---

## 11. Decisiones abiertas para confirmar

1. **Nombre/ruta:** ¿`sgr-ejecucion-distribucion` o preferencia distinta?
2. **Alcance del primer incremento:** ¿arrancamos con la versión mock (recomendado, como se hizo con la carga de insumos) o esperamos endpoints del motor?
3. **Reglas de oficialización:** ¿quién puede marcar "oficial" (perfil/rol) y con qué confirmación?
4. **Ejecución parcial:** ¿permitir ejecutar solo Sección I cuando falten insumos de Sección III?
5. **¿Unificar en un solo componente con pestañas** (Insumos | Ejecución) o mantener dos componentes enlazados?

---

## 12. Reglas críticas como elementos parametrizables

El plan lista 8 reglas críticas (sección 3) y, en "Riesgos y mitigaciones", recomienda **parámetros versionados por vigencia separados del código** y una **función única de redondeo parametrizada**. Evaluación de cuáles conviene exponer como parámetros y cuáles deben permanecer como lógica.

### Principio rector

- **Parametrizable = valores, umbrales, ponderadores, flags y configuración de redondeo.** Cambian por reforma normativa o comunicación de otra entidad; no deben requerir tocar código.
- **No parametrizable = algoritmos.** La *mecánica* (iteración de la compensación, encadenamiento del FAE, particularidades de AD, normalización de códigos) vive en el motor con pruebas. Solo sus **umbrales/catálogos** se parametrizan.
- **Reproducibilidad:** todo parámetro se **versiona por vigencia** (autor, fecha, vigencia) y cada corrida queda **anclada a una versión de parámetros** (campo `versionParametros` ya previsto). Cambiar un valor nunca altera corridas pasadas: genera una versión nueva.

### Evaluación por regla

| # | Regla crítica | ¿Parametrizable? | Qué se parametriza | Qué queda como lógica |
|---|---|---|---|---|
| — | **Porcentajes tabla 2** | ✅ Alto | Todos los % y desagregaciones (Inversión 92,5 / Ahorro 4,5 / Admón 3; AD 20+5; AIL 12,68+2,32; AIR 20,4/13,6; ACTI 10; Paz 7; Ambiental 1; Cormagdalena 0,5; SSEC sub-reparto CGR/PGN/DNP) | Orden de aplicación |
| 1 | **Compensación AIL iterativa** | ⚠️ Parcial | Umbral de garantía **75 %**, máx. iteraciones, flag "permitir compensación parcial" | El algoritmo iterativo y la anualización |
| 2 | **Redondeos (dos regímenes)** | ✅ Alto | Tabla decimales+modo por tipo de salida: PR decenal / desahorro FAE / mayor recaudo / multas / étnicas → **0 dec** (redondeo o truncamiento); PBC / IAC → **2 dec** | La función única de redondeo (implementación) |
| 3 | **PBC por año del PR** | ❌ No | — (flag opcional de granularidad, pero por norma es "por año") | Regla de cálculo |
| 4 | **FAE encadenado** | ⚠️ Parcial | Piso **"nunca < 50 % del ahorro"**; componentes de la base (AIR 100 % + AIL CD + AD) como flags de inclusión | El encadenamiento y la dependencia aguas arriba |
| 5 | **AD con particularidades** | ⚠️ Bajo | Tope = % del presupuesto corriente; flags: "descuentos no generan IAC negativa", "recaudos vigencias anteriores con reglas del bienio" | Obras por regalías, nuevos beneficiarios SPGR |
| 6 | **Régimen de no aforados** | ⚠️ Parcial | Reparto de la bolsa **75 % / 25 %**; disparador = alcanzar presupuesto corriente (activable) | El cambio de forma de comunicar |
| 7 | **Étnicas: factor K y bloqueo 20 %** | ✅ Alto | Bloqueo **20 %** (activable + valor); ponderadores **urbano 0,4 / rural 0,6**; base 4,5 % mpios / 2 % dptos; flags "excluir CAR" e "excluir indeterminados" | Fórmula con factor K, los 3 momentos de recálculo |
| 8 | **Higiene de códigos DANE** | ❌ No (es catálogo) | Catálogo de excepciones (ceros iniciales Antioquia/Atlántico) como **dato**, no parámetro de cálculo | Normalización de 5 dígitos y separadores |
| — | **Ponderadores de fórmula** | ✅ Alto | AIL (NBI 0,6 / pob 0,4); AIR (NBI 0,5 / pob 0,4 / desempleo 0,1 y partición 60/40); FONPET (PPNC 0,8 / NBI 0,1 / pob 0,1) | — |
| — | **Marca ambiental** | ✅ Medio | Mínimo **2 p.p. del SGR** con marca ambiental | Qué asignaciones la portan |

**Nota sobre FAE/FONPET (2,25 % / 2,25 %):** ese reparto **no es un parámetro fijo** — lo comunica el MHCP a más tardar el 8 de agosto. Se trata como **insumo** (ya está en `sgr-carga-insumos`) que *sobrescribe* el valor de referencia parametrizado.

### Recomendación

1. **Sí incluir un conjunto de "Parámetros de cálculo" versionado**, con tres grupos: **(A) Porcentajes normativos**, **(B) Ponderadores de fórmula**, **(C) Umbrales y banderas** (75 %, 50 % FAE, 20 % étnico, 2 p.p. ambiental, 75/25 no aforados, exclusiones de base étnica) y **(D) Configuración de redondeo** por tipo de salida.
2. **No parametrizar la lógica** (iteraciones, encadenamiento, particularidades AD, normalización DANE); solo sus umbrales/catálogos.
3. **Gobernanza estricta** (mitiga los riesgos que el propio plan señala):
   - Editable **solo por un perfil administrador**, en una pantalla de parametrización aparte; **de solo lectura** dentro del componente de ejecución.
   - **Validaciones duras:** Inversión+Ahorro+Administración = 100 %; cada sub-reparto cuadra; rangos válidos; decimales ∈ {0,2}.
   - **Versionado con vigencia + auditoría** (autor, fecha, motivo). Cada corrida referencia la versión exacta → reproducibilidad y trazabilidad legal.

### Impacto en la interfaz

- Añadir una **pestaña / tarjeta "Parámetros"** (solo lectura) en `sgr-ejecucion-distribucion`, mostrando la **versión de parámetros vigente** que se usará en la corrida y un enlace "Ver histórico de parámetros".
- En el **detalle de cada corrida**, mostrar la versión de parámetros aplicada (con posibilidad de expandir los valores usados) — así el reporte de verificación es autoexplicativo.
- (Iteración posterior) Pantalla de administración `sgr-parametros-distribucion` para crear/versionar conjuntos de parámetros por vigencia.

### Modelo de datos (adición)

```typescript
export interface ConjuntoParametros {
  idVersion: number;
  vigencia: string;              // p. ej. "2027-2028"
  fecha: string;                 // ISO
  autor: string;
  motivo?: string;
  porcentajes: ParametroValor[]; // grupo A (tabla 2)
  ponderadores: ParametroValor[];// grupo B
  umbrales: ParametroValor[];    // grupo C (incluye flags)
  redondeo: ConfigRedondeo[];    // grupo D
}

export interface ParametroValor {
  clave: string;                 // "AIL.pct", "AIR.pond.nbi", "AIL.compensacion.umbral"
  etiqueta: string;
  valor: number | boolean;
  unidad?: '%' | 'factor' | 'pp' | 'flag';
  referenciaNormativa?: string;  // "Art. 48 Ley 2056"
}

export interface ConfigRedondeo {
  tipoSalida: 'PR' | 'PBC' | 'IAC' | 'desahorroFAE' | 'mayorRecaudo' | 'multas' | 'etnicas';
  decimales: 0 | 2;
  modo: 'redondeo' | 'truncamiento';
}
```
