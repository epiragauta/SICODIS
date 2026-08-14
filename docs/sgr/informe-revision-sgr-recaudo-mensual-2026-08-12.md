# Informe de revisión — Componente `sgr-recaudo-mensual`

**Fecha:** 12 de agosto de 2026
**Componente:** `src/app/components/sgr-recaudo-mensual/`
**Motivo:** Reporte del usuario — "el selector de meses no está funcionando".
**Resultado:** Confirmado. Se identificaron 2 defectos que rompían el filtro de meses y 4 hallazgos adicionales. Todos corregidos.

---

## 1. Alcance de la revisión

| Archivo | Líneas | Revisado |
|---|---|---|
| `sgr-recaudo-mensual.component.ts` | 1.282 | Sí |
| `sgr-recaudo-mensual.component.html` | 460 | Sí |
| `sgr-recaudo-mensual.component.scss` | 742 | Sí |
| `services/sicodis-api.service.ts` (endpoints usados) | — | Parcial |

Endpoints consultados contra el API en producción para validar contratos de datos:

- `POST /apiws/auth/login`
- `GET /apiws/ApiSicodisNew/sgr/vigenciaspbc`
- `GET /apiws/ApiSicodisNew/sgr/resumen_pbc_recaudo_mensual/{idvigencia}`

---

## 2. Defectos que rompían el selector de meses

### 2.1 CRÍTICO — `applyFilters()` descartaba la selección del usuario

**Ubicación:** `sgr-recaudo-mensual.component.ts:226-227` (código original)

```ts
applyFilters(): void {
  ...
  this.loadSgrData();                                  // asíncrono (HTTP)
  this.setPeriodsFromVigencia(this.selectedVigencia);  // síncrono → resetea desde/hasta AHORA
  ...
}
```

**Análisis de la falla**

`setPeriodsFromVigencia()` reescribe `selectedPeriodoDesde` y `selectedPeriodoHasta` con el rango completo del bienio. Al ser una llamada síncrona, se ejecuta **antes** de que llegue la respuesta HTTP de `loadSgrData()`.

Secuencia real:

1. Usuario elige *Junio 2025* → *Diciembre 2025* y pulsa **Aplicar filtros**.
2. `loadSgrData()` emite la petición y retorna de inmediato.
3. `setPeriodsFromVigencia()` sobrescribe el rango a *Enero 2025* → *Julio 2026*.
4. Llega la respuesta; el `subscribe` ejecuta `updateTableData()` y `updateDetailedTableData()`, que filtran contra el rango **ya reescrito**.

**Impacto:** el filtro de meses nunca surtía efecto — las tablas mostraban siempre el bienio completo y, además, los inputs del datepicker "saltaban" visualmente de vuelta al rango por defecto. Reproducible el 100 % de las veces.

**Corrección:** se eliminó la llamada a `setPeriodsFromVigencia()` dentro de `applyFilters()`. El rango solo debe reiniciarse cuando cambia el bienio, cosa que ya hace `onVigenciaChange()` en el momento de la selección.

---

### 2.2 CRÍTICO — Flechas de navegación de año deshabilitadas de forma permanente

**Ubicación:** `sgr-recaudo-mensual.component.scss:737-741` (código original)

```scss
::ng-deep .p-datepicker-prev-button,
::ng-deep .p-datepicker-next-button {
  pointer-events: none !important;
  opacity: 0.3 !important;
}
```

**Análisis de la falla**

La regla no estaba condicionada por ninguna clase: aplicaba a **ambos** datepickers, siempre. Con `view="month"`, esos botones son la navegación de año del panel, de modo que el usuario quedaba encerrado en el año que el calendario mostrara al abrirse y no podía seleccionar meses de la otra vigencia del bienio.

**Hallazgo asociado — código muerto:** el HTML aplica las clases `hide-prev` / `hide-next` (`sgr-recaudo-mensual.component.html:76-79` y `97-100`), pero **no existía ninguna regla CSS para esas clases en todo el proyecto**. La intención original —restringir la navegación a los dos años del bienio— nunca llegó a implementarse; en su lugar quedó la regla incondicional de arriba.

**Hallazgo asociado — estado sin inicializar:** `currentYearDesde` y `currentYearHasta` arrancan en `0` y solo se actualizan en `(onYearChange)`, evento que PrimeNG dispara **únicamente al navegar**, no al abrir el panel. Con valor `0`, la condición `currentYearHasta <= startYear` era verdadera y habría ocultado la flecha "año anterior" del campo *Período hasta* incluso mostrando el segundo año del bienio.

**Corrección:**

- Se reemplazó la regla incondicional por reglas ancladas a las clases reales:

  ```scss
  :host ::ng-deep {
    p-datepicker.hide-prev .p-datepicker-prev-button { visibility: hidden; pointer-events: none; }
    p-datepicker.hide-next .p-datepicker-next-button { visibility: hidden; pointer-events: none; }
  }
  ```

- Se añadió `syncCurrentYears()`, que siembra `currentYearDesde` / `currentYearHasta` desde las fechas seleccionadas. Se invoca desde `setPeriodsFromVigencia()`, `onPeriodoDesdeChange()` y `onPeriodoHastaChange()`.

**Verificación del selector CSS:** se confirmó en `node_modules/primeng/fesm2022/primeng-datepicker.mjs` que (a) el selector del componente es `p-datePicker, p-datepicker, p-date-picker`, por lo que `[ngClass]` deposita las clases en el elemento host; y (b) al no declararse `appendTo` en la plantilla, el panel del overlay permanece como descendiente del host (`if (this.appendTo)` en la línea 3904). El selector descendente alcanza correctamente los botones.

---

## 3. Hallazgos adicionales

### 3.1 Las gráficas ignoraban el rango de meses

`initializeMiningChart()` e `initializeHydrocarbonChart()` construían sus series desde `tableDataBase` (dataset completo del API) en lugar de `tableData` (dataset ya filtrado). En consecuencia, las dos gráficas de barras mostraban siempre los 13 períodos del bienio, sin importar el filtro — mientras que `initializeTrendChart()` sí usaba `detailedTableData` filtrado. Comportamiento incoherente entre gráficas de la misma pantalla.

Cabe notar que el pie de ambas tarjetas afirma *"Por defecto, se muestran los últimos 5 meses"*, lo cual tampoco se cumplía.

**Corrección:** ambas gráficas pasan a leer `tableData`. El orden de ejecución dentro del `subscribe` ya era correcto (`updateTableData()` se ejecuta antes que la inicialización de gráficas).

### 3.2 `clearFilters()` operaba sobre el rango anterior

```ts
this.cargarVigencias();   // async, no esperado
this.updateChartsData();  // se ejecuta con las fechas viejas
```

`cargarVigencias()` es `async` y no se esperaba, de modo que `updateChartsData()` refiltraba contra el estado previo. Además la llamada era redundante: `cargarVigencias()` ya reestablece bienio y rango, y dispara `loadSgrData()`.

**Corrección:** `await this.cargarVigencias();` como única acción.

### 3.3 `maxDate` podía quedar por debajo de `minDate`

En `setPeriodsFromVigencia()`, la rama `endYear >= currentYear` calculaba el tope como `new Date(currentYear, currentMonth - 1, 1)` (mes anterior al actual). Para un bienio que aún no ha comenzado —por ejemplo, el bienio 2027-2028 consultado en enero de 2027— el resultado es diciembre de 2026, anterior al `minDate` de enero de 2027, lo que dejaría el calendario sin ningún mes seleccionable.

**Corrección:** se acota el tope con `minDate`.

### 3.4 Deuda técnica observada (no intervenida)

Se deja constancia sin modificar, por estar fuera del alcance del reporte:

- `console.log` de depuración numerados (`'1. idVigencia:'` … `'8. detailedTableData…'`) en `loadSgrData()` y en las gráficas, activos en producción.
- Métodos muertos: `initializeCharts()`, `initializeDetailedTable()`, `descargarDatosPBCRecaudoMensualOld()`, `setDefaultPeriods()` (su efecto lo sobrescribe `cargarVigencias()`), y ahora también `updateChartsData()`.
- Import `Breadcrumb` declarado pero no usado en la plantilla (advertencia del compilador de Angular).
- Bloques grandes de datos mock comentados en las cuatro funciones de inicialización de gráficas.
- `detailedTableColumns` se puebla solo desde `initializeDetailedTable()`, que nunca se llama; la tabla detallada define sus columnas directamente en el HTML.

---

## 4. Validación del contrato de datos

Se consultó el endpoint real para el bienio vigente (`id_vigencia = 8`, "2025 - 2026"):

- **Formato de `periodo`:** `"Enero 2025"`, `"Febrero 2025"`, … — sin la partícula `"de"`. El parseo de `updateTableData()` / `updateDetailedTableData()` (`split(' ')`, primer token = mes, último token = año) es **correcto** para este formato. El comentario en el código que lo advierte es exacto.
- **Cobertura de datos:** `detallesector` llega hasta *Enero 2026* (13 registros); `detalle` hasta *Febrero 2026* (14 registros).
- **Vigencias disponibles:** ids 2 a 8, de "2013 - 2014" a "2025 - 2026". `cargarVigencias()` selecciona `vigencias[0]`, que es la más reciente ("2025 - 2026"). Correcto.
- **Nota:** `resumen_pbc_recaudo_mensual/1` devuelve objetos vacíos (`{}`) en los campos numéricos del resumen y arreglos vacíos en detalle. No afecta a la aplicación porque el id 1 no está en la lista de vigencias, pero conviene tenerlo presente.

---

## 5. Cambios aplicados

| Archivo | Cambio |
|---|---|
| `.component.ts` | `applyFilters()`: se elimina el reset de períodos |
| `.component.ts` | Nuevo `syncCurrentYears()` + invocaciones en `setPeriodsFromVigencia()`, `onPeriodoDesdeChange()`, `onPeriodoHastaChange()` |
| `.component.ts` | Gráficas de minería e hidrocarburos leen `tableData` (filtrada) |
| `.component.ts` | `clearFilters()`: `await cargarVigencias()`, sin `updateChartsData()` |
| `.component.ts` | `setPeriodsFromVigencia()`: `maxDate` acotado por `minDate` |
| `.component.scss` | Regla incondicional sobre las flechas reemplazada por reglas `hide-prev` / `hide-next` |

Total: 61 inserciones, 22 eliminaciones en 2 archivos.

---

## 6. Estado de la validación

**Realizado**

- Compilación: `ng build --configuration development` finaliza sin errores. Las advertencias restantes (declaraciones sin uso, `toPromise()` obsoleto) son preexistentes.
- Verificación del contrato del API contra producción (sección 4).
- Verificación del comportamiento de PrimeNG 18 DatePicker en el código fuente del paquete: selector del host y ubicación del panel del overlay.

**Pendiente**

- **No se ejecutó validación visual en navegador.** La extensión Claude in Chrome no quedó instalada durante la sesión, de modo que no se comprobó de forma interactiva ni la navegación de año en el panel del datepicker ni el refiltrado de tablas y gráficas.

### Pruebas manuales sugeridas

1. Abrir *Período desde* y *Período hasta*: las flechas de año deben responder; la flecha del extremo del bienio debe quedar oculta (2025 sin "anterior", 2026 sin "siguiente").
2. Fijar *desde* = Junio 2025 y *hasta* = Septiembre 2025 → **Aplicar filtros**. Los inputs deben conservar esos valores y la tabla debe mostrar 4 filas.
3. En la vista **Sector**, confirmar que las gráficas de minería e hidrocarburos muestran únicamente los meses filtrados.
4. En la vista **Recaudo**, confirmar el mismo comportamiento en la tabla detallada y en la gráfica de tendencia.
5. Cambiar de bienio: el rango debe reiniciarse al bienio completo (comportamiento esperado).
6. **Limpiar filtros**: debe volver al bienio más reciente con su rango completo.
7. Elegir un *desde* posterior al *hasta*: debe aparecer el toast de advertencia y corregirse el valor.
