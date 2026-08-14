# Informe de revisión — Componente `sgr-plan-bienal-recursos`

**Fecha:** 12 de agosto de 2026
**Componente:** `src/app/components/sgr-plan-bienal-recursos/` (Programación plan de recursos — PR)
**Motivo:** Reporte del usuario — "hubo un cambio en backend y los datos de la gráfica no aparecen y algunas filas en la tabla en cero". Observación funcional adicional: *"Hay un tema con las otras asignaciones que no se distribuyen en cabeza de las entidades territoriales como Paz, Ambiental, étnicos, funcionamiento, fiscalización. Estos recursos no están siendo incluidos en el PR o en el PBC"*, con la solicitud de ocultar las filas cuyos valores sean cero en todos los años.
**Resultado:** Confirmado. El backend modificó el contrato del campo `Orden`, lo que dejaba la gráfica vacía. Se corrigió, se atendió la solicitud de ocultar filas en cero y se identificaron 3 defectos adicionales del componente. **Durante la sesión el backend fue corregido**, lo que cambió parte del diagnóstico inicial (ver sección 3).

---

## 1. Alcance de la revisión

| Archivo | Líneas | Revisado |
|---|---|---|
| `sgr-plan-bienal-recursos.component.ts` | 536 | Sí |
| `sgr-plan-bienal-recursos.component.html` | 209 | Sí |
| `sgr-plan-bienal-recursos.component.scss` | 419 | Parcial |
| `utils/hierarchicalDataStructureV2.ts` | 169 | Sí |
| `services/sicodis-api.service.ts` (endpoints usados) | — | Parcial |

Endpoints consultados contra el API en producción para validar contratos de datos:

- `POST /apiws/auth/login`
- `GET /apiws/ApiSicodisNew/sgrplanrecursos/vigencias`
- `GET /apiws/ApiSicodisNew/sgrplanrecursos/departamentos`
- `GET /apiws/ApiSicodisNew/sgrplanrecursos/municipios_departamentos/{codigoDepto}`
- `GET /apiws/ApiSicodisNew/sgrplanrecursos/detalle_planrecursos/{idVigencia}/{codigoEntidad}/{codigoMunicipio}`
- `GET /apiws/ApiSicodisNew/sgrplanbienal/detalle_planbienal/{idVigencia}/{codigoEntidad}/{codigoMunicipio}` (para descartar afectación del PBC)

---

## 2. Defecto que dejaba la gráfica vacía

### 2.1 CRÍTICO — Cambio de tipo en el campo `Orden` del backend

**Ubicación:** `sgr-plan-bienal-recursos.component.ts:300-305` (código original)

```ts
private actualizarGrafico(data: DetallePlanRecursos[]): void {
  // Los sub-ítems del gráfico son los que tienen Orden entero entre INVERSIÓN y AHORRO
  const inversionOrd = data.find(d => d.IdConcepto === '1000')?.Orden ?? 1;
  const ahorroOrd    = data.find(d => d.IdConcepto === '2000')?.Orden ?? Infinity;

  const subItems = data.filter(item =>
    Number.isInteger(item.Orden) &&        // ← siempre false si Orden es string
    item.Orden > inversionOrd &&
    item.Orden < ahorroOrd &&
    item.IdConcepto !== '99'
  );
```

**Análisis de la falla**

El backend cambió el campo `Orden` de número a string con la ruta jerárquica completa:

| Contrato | Ejemplo de `Orden` en el JSON |
|---|---|
| Anterior | `1`, `2`, `3`, `3.1`, `5.09`, `14.1` (número, esquema plano) |
| Actual | `"1"`, `"1.2"`, `"1.2.1"`, `"1.4.2.1.1"` (string, ruta jerárquica) |

`Number.isInteger()` devuelve `false` para **cualquier** string, incluido `"1"`. En consecuencia `subItems` quedaba vacío, `datasets` quedaba vacío y la gráfica se renderizaba en blanco. La comparación `item.Orden > inversionOrd` tampoco es válida entre strings.

**Impacto:** gráfica sin series. Al momento de cerrar la revisión el backend entrega el contrato nuevo en **las siete vigencias**, de modo que el defecto afecta a todas y no solo a 2025‑2034 como se reportó inicialmente.

**Corrección:** se sustituye el criterio numérico por uno posicional dentro del árbol. Las series del gráfico son los **componentes directos de INVERSIÓN**, identificados por prefijo y profundidad de la ruta:

```ts
private componentesInversionJerarquico(data: FilaPlanRecursos[]): FilaPlanRecursos[] {
  const inversion = data.find(fila => fila.IdConcepto === '1000');
  if (!inversion) return [];

  const nivelHijo = inversion.Orden.split('.').length + 1;
  return data.filter(fila =>
    fila.Orden.startsWith(`${inversion.Orden}.`) &&
    fila.Orden.split('.').length === nivelHijo
  );
}
```

Se conserva la ruta del esquema plano (`componentesInversionPlano()`) como respaldo por si el backend revierte el contrato, seleccionada mediante `esEsquemaJerarquico()`.

**Corrección asociada en la interfaz:** `DetallePlanRecursos.Orden` pasa de `number` a `number | string` en `sicodis-api.service.ts:286`, documentando ambos esquemas. El tipo declarado no correspondía al dato recibido, lo que impedía que el compilador señalara el uso incorrecto.

---

## 3. Corrección del backend durante la sesión

El diagnóstico inicial se realizó sobre un backend que presentaba, **solo en la vigencia 2025‑2034 (`id_vigencia = 20`)**, los siguientes defectos:

| Defecto observado al inicio | Estado al cierre |
|---|---|
| `Orden` como string solo en la vigencia 20; numérico en el resto | Corregido — string jerárquico en todas las vigencias |
| Jerarquía a medias: NARP y Rrom en `5.49`–`5.8`, descolgados de Comunidades Étnicas | Corregido — hoy en `1.4.2.2` y `1.4.2.3` |
| CTeI, Ambiental, Cormagdalena, Ahorro y Administración como nodos raíz sueltos | Corregido — anidados bajo `1.5`–`1.8`, `2` y `3` |
| Fila INVERSIÓN mal sumada (nacional: solo CTeI + Ambiental + Cormagdalena; departamental: cero) | Corregido — cuadra con la suma de sus componentes |
| Contraloría / Procuraduría / DNP con cifra **nacional** en consultas departamentales | Corregido — ya no se envían a nivel territorial |
| Filas en cero enviadas en consultas territoriales | Corregido — el backend ya las omite |

**Contraste de la fila INVERSIÓN (año 2025, vigencia 2025‑2034):**

| Entidad | Valor al inicio de la sesión | Valor al cierre |
|---|---|---|
| Nacional | 1.458.463.376.437 | 11.731.118.462.647 |
| Antioquia | 0 | 415.646.906.732 |

Los valores actuales coinciden exactamente con los que arrojaba el recálculo implementado en el front, lo que confirma tanto el diagnóstico como la corrección del servicio.

**Consecuencia para la implementación:** se había construido un mapa `IdConcepto → Orden` para reconstruir la jerarquía rota. Una vez corregido el backend, ese mapa pasó a **contradecirlo** —por ejemplo, Asignación Paz: backend `1.6`, mapa `1.1`— por lo que **se eliminó**. La jerarquía se toma tal como la envía el servicio.

**Recomendación:** confirmar con el equipo de servicios si se trató de un despliegue intencional del día o si existen instancias con versiones distintas detrás del balanceador. En el segundo caso los defectos reaparecerían de forma intermitente.

---

## 4. Solicitud funcional atendida — filas en cero

**Observación del usuario:** las otras asignaciones (Paz, Ambiental, étnicos, CTeI, funcionamiento, fiscalización) no se distribuyen en cabeza de las entidades territoriales, por lo que en consultas por departamento o municipio llegaban en cero y solo agregaban ruido.

**Estado previo:** el filtro existía pero solo se activaba al seleccionar un **municipio específico** (`sgr-plan-bienal-recursos.component.ts:284`):

```ts
const municipioEspecifico = this.selectedMunicipio?.codigo && this.selectedMunicipio.codigo !== '0';
```

**Corrección:** el filtro pasa a aplicarse en **toda consulta territorial** —departamento o municipio— mediante un criterio único:

```ts
private get esConsultaTerritorial(): boolean {
  return !!this.selectedDepartamento && this.selectedDepartamento.codigo !== '0';
}
```

La fila de Total (`IdConcepto = '99'`) se preserva siempre. A nivel nacional se conservan todas las filas, para no perder la vista completa del plan de recursos.

**Nota:** el backend ya omite estas filas por su cuenta. El filtro del front es hoy redundante pero idempotente, y cubre cualquier fila en cero que siga llegando.

---

## 5. Hallazgos adicionales

### 5.1 Gráfica y tabla partían de datos distintos

`applyFilters()` entregaba la respuesta cruda del API a `procesarDatosTabla()` y a `actualizarGrafico()` por separado, y cada uno aplicaba sus propias transformaciones. Como `categoryMap` —que vincula la serie del gráfico con la fila de la tabla para el resaltado sincronizado— se construía desde los datos del gráfico, cualquier divergencia entre ambos procesamientos rompía el resaltado.

**Corrección:** se introduce `normalizarDatos()` como paso único y previo. Tabla y gráfico consumen el mismo arreglo ya normalizado.

### 5.2 Filas duplicadas en la tabla por `Orden` repetido

`organizeCategoryData()` (`hierarchicalDataStructureV2.ts:45`) indexa los nodos en un `Map` con la categoría como clave:

```ts
nodeMap.set(item.categoria, node);
```

En el esquema plano el backend repetía el mismo `Orden` en varias filas —cinco conceptos con `Orden = 10` en la vigencia 2013‑2022: Funcionamiento, Fiscalización, SMSCE, Asignación Paz y Municipios Río Magdalena—. Al compartir clave, las cinco colapsaban en un único nodo y `rootNodes` recibía cinco veces **el mismo** objeto, de modo que la tabla mostraba la misma fila repetida y perdía cuatro conceptos.

**Corrección:** `asignarOrdenUnico()` genera `OrdenUnico` añadiendo un sufijo `#n` a las repeticiones. El sufijo no introduce puntos, por lo que no altera el nivel del nodo, y `parseInt()` conserva la posición de ordenamiento. `Orden` se mantiene intacto para la lógica del gráfico.

### 5.3 El esquema plano excluía del gráfico la mayor bolsa de recursos

La condición original `item.Orden > inversionOrd` usaba comparación estricta. En las vigencias sin cabecera de sección (2013‑2022 y anteriores), `inversionOrd` tomaba el valor por defecto `1`, de modo que quedaba fuera del gráfico la fila con `Orden = 1`: Asignaciones Directas, el concepto de mayor cuantía del período (2.100.554.168.405 en 2013, frente a 1.245.464.528.285 del FDR, que sí se graficaba).

**Corrección:** en `componentesInversionPlano()` la comparación pasa a `orden >= ordenInversion` y las cabeceras se excluyen explícitamente por `IdConcepto` (`ID_CABECERAS = ['1000', '2000', '3000', '99']`).

### 5.4 Salvaguardas incorporadas

Se conservan tres defensas ante lo que el backend llegó a enviar. Hoy son inocuas —verificado: producen el mismo resultado que los datos actuales— y así está documentado en el código:

- `recalcularInversion()` — recompone INVERSIÓN como la suma de sus componentes directos.
- `ID_DETALLE_SSEC` — excluye Contraloría, Procuraduría y DNP en consultas territoriales.
- `asignarOrdenUnico()` — garantiza claves de árbol únicas.

### 5.5 Deuda técnica observada (no intervenida)

Se deja constancia sin modificar, por estar fuera del alcance del reporte:

- `exportarExcel()` es un `console.log`; el botón "Exportar excel" está deshabilitado en la plantilla a la espera del endpoint de backend.
- `cargarSiglasDiccionario()` usa `toPromise()`, obsoleto en RxJS 7.
- Las suscripciones a `SicodisApiService` no aplican `takeUntilDestroyed()`, contrario a la convención del proyecto (CLAUDE.md, sección "Observable Cleanup").
- `@ViewChild('planRecursosTable')` está tipado como `any`.
- La nota al pie de la tabla fija la fuente en *"Ley 2441 de 2024"* de forma estática, sin depender de la vigencia seleccionada.
- `clearFilters()` deja `selectedDepartamento` en `null`, mientras que `cargarDepartamentos()` lo inicializa en "Todos"; el estado tras limpiar no equivale al estado inicial.

---

## 6. Validación del contrato de datos

Se consultaron las siete vigencias contra producción. Estructura vigente al cierre de la revisión:

```
"1"          1000  INVERSION
"1.2"        300   Asignaciones Directas
"1.2.1"      56    A. Directas
"1.2.2"      57    A. Directas anticipadas
"1.3"        400   Asignación para la Inversión Regional
"1.4"        500   Asignación para la Inversión Local
"1.4.2"      521   Comunidades Étnicas
"1.4.2.1"    502   Comunidades Indígenas
"1.4.2.2"    503   Comunidades NARP
"1.4.2.3"    504   Comunidades Rrom
"1.5"        600   Asignación para Ciencia, Tecnología e Innovación
"1.6"        80    Asignación Paz
"1.7"        74    A. Ambiental
"1.8"        79    Cormagdalena
"2"          2000  AHORRO
"3"          3000  ADMINISTRACIÓN
"99"         99    Total
```

Observaciones:

- **Sin nodos huérfanos ni `Orden` duplicados** en ninguna de las siete vigencias.
- **`INVERSIÓN + AHORRO + ADMINISTRACIÓN = Total`** se cumple en todas las combinaciones verificadas.
- **La numeración jerárquica no es estable entre vigencias.** Asignación Paz (`IdConcepto 80`) ocupa `1.6` en 2023‑2032 y 2025‑2034, pero en otras vigencias el conjunto de conceptos difiere. Por eso la lógica del componente se apoya en la **posición relativa dentro del árbol** y en `IdConcepto`, nunca en valores de `Orden` codificados.
- **Vigencias 2013‑2022 a 2019‑2028** conservan un catálogo de conceptos distinto (FDR, FCR, FCTI, Cormagdalena) con `IdConcepto` del 1 al 13.
- **El módulo PBC no está afectado.** `sgrplanbienal/detalle_planbienal` sigue entregando `Orden` numérico plano (`"Orden":1`) y sin huérfanos, por lo que el componente `sgr-plan-bienal` no requirió cambios.

---

## 7. Cambios aplicados

| Archivo | Cambio |
|---|---|
| `services/sicodis-api.service.ts` | `DetallePlanRecursos.Orden` pasa a `number \| string`, con documentación de ambos esquemas |
| `.component.ts` | Nueva interfaz `FilaPlanRecursos` (`Orden` string + `OrdenUnico`) |
| `.component.ts` | Nuevo `normalizarDatos()` como paso único previo a tabla y gráfico |
| `.component.ts` | Nuevo `asignarOrdenUnico()` — evita el colapso de filas con `Orden` repetido |
| `.component.ts` | Nuevo `recalcularInversion()` — salvaguarda sobre el total de INVERSIÓN |
| `.component.ts` | Nuevo getter `esConsultaTerritorial` — criterio único para departamento y municipio |
| `.component.ts` | `actualizarGrafico()`: selección de series por posición en el árbol en lugar de `Number.isInteger` |
| `.component.ts` | Nuevos `componentesInversionJerarquico()` y `componentesInversionPlano()` |
| `.component.ts` | `procesarDatosTabla()`: filtro de filas en cero extendido a toda consulta territorial |
| `.component.ts` | Constantes `ID_DETALLE_SSEC` e `ID_CABECERAS` |

Total: 157 inserciones, 20 eliminaciones en 2 archivos. Plantilla y hoja de estilos sin cambios.

---

## 8. Estado de la validación

**Realizado**

- Compilación: `npx tsc --noEmit -p tsconfig.app.json` sin errores.
- Build: `ng build --configuration production` finaliza correctamente. Las advertencias restantes (presupuestos de bundle, SCSS de otros componentes, `leaflet` como CommonJS) son preexistentes y ajenas a este componente.
- **Verificación automatizada contra el API en producción**: script que replica la lógica de normalización y de armado del árbol sobre **7 vigencias × 3 entidades** (Nacional, Antioquia y Tunja) — 21 combinaciones. Invariantes comprobadas en todas:
  1. La gráfica produce al menos una serie con datos.
  2. `INVERSIÓN + AHORRO + ADMINISTRACIÓN = Total`.
  3. No hay categorías duplicadas tras el filtrado.
  4. Ninguna fila se pierde al construir el árbol (conteo recursivo de nodos = filas visibles).
- Verificación del contrato del PBC para descartar afectación (sección 6).

**Pendiente**

- **No se ejecutó validación visual en navegador.** La verificación fue sobre datos y compilación; no se comprobó de forma interactiva el render de la gráfica, la expansión del TreeTable ni el resaltado sincronizado gráfica↔tabla.

### Pruebas manuales sugeridas

1. Abrir el reporte con la vigencia por defecto (2025‑2034) y **Departamentos → Todos**: la gráfica debe mostrar 7 series (Directas, Regional, Local, CTeI, Paz, Ambiental, Cormagdalena) y la tabla 37 filas bajo tres raíces (INVERSIÓN, AHORRO, ADMINISTRACIÓN) más el Total.
2. Seleccionar **Antioquia**: la tabla debe reducirse a 14 filas, sin Paz, Ambiental, CTeI, Cormagdalena, étnicos ni ADMINISTRACIÓN. INVERSIÓN debe mostrar 415.646.906.732 en 2025 y el Total 476.697.577.086.
3. Recorrer las siete vigencias con **Todos**: en ninguna la gráfica debe quedar vacía. En 2013‑2022 debe aparecer Asignaciones Directas entre las series.
4. Seleccionar **Municipios** → un departamento → un municipio (p. ej. Tunja): verificar que solo se listan las asignaciones con recursos y que el Total permanece visible.
5. Pasar el cursor sobre una barra de la gráfica: la fila correspondiente de la tabla debe expandirse, resaltarse y quedar a la vista (resaltado sincronizado).
6. Expandir y contraer los nodos del TreeTable: los subtotales de cada nivel deben cuadrar con la suma de sus hijos.
7. **Limpiar filtros**: la tabla y la gráfica deben vaciarse y la vigencia volver a la más reciente.
