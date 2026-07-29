# Informe de sesión — 2026-07-28

## Observaciones al reporte "Plan de Recursos" (`sgr-plan-bienal-recursos`)

Se recibieron 5 observaciones de negocio. Resumen de qué se implementó y qué queda
pendiente (backend).

### Contexto de arquitectura

- **Plan de Recursos (PR)** = componente `sgr-plan-bienal-recursos`, ruta `sgr-plan-recursos`.
- **Plan Bienal de Caja (PBC)** = componente `sgr-plan-bienal-caja`, ruta `sgr-plan-bienal-de-caja`.
  Son **reportes independientes** (rutas y componentes distintos); no existe una página
  que combine "resumen + programación + PR + PBC".
- `sgr-programacion` es una **maqueta antigua con datos simulados** (no consume API); no
  se usa en este flujo.
- Datos del PR: `GET /apiws/ApiSicodisNew/sgrplanrecursos/*`
  (`vigencias`, `departamentos`, `municipios_departamentos/{depto}`,
  `detalle_planrecursos/{idVigencia}/{codEntidad}/{codMunicipio}`).

---

### Obs. 1 — Duplicidad del menú "Programación" ✅ IMPLEMENTADO

El menú SGR tenía un submenú **"Programación"** con dos ramas ("Plan de Recursos" y
"Plan Bienal de Caja"), cada una con sub-ítems por bienio que **descargaban Excel**.
Esto duplicaba los ítems directos "Plan de Recursos" y "Plan Bienal de Caja" que abren
los reportes. Además el submenú estaba **incompleto** (PR: solo 2021-2030, 2023-2032,
2025-2034; PBC: solo 2021-2022, 2023-2024, 2025-2026).

**Acción:** se eliminó el submenú "Programación" completo en
`header.component.ts`. Quedan los accesos directos a los reportes PR y PBC.

---

### Obs. 2 — Filtro y fechas 🟡 PARCIAL / AJUSTADO

- **Fechas de actualización y corte:** se **eliminaron** del encabezado
  (`info-strip-left` en `sgr-plan-bienal-recursos.component.html`). Mostraban fechas
  actuales incluso para bienios cerrados.
- **"Gobernación" vs. departamento:** la observación resultó ambigua. Eliminar el
  selector de Departamentos impediría elegir el departamento a consultar. Se acordó,
  por ahora, **seleccionar la opción "Todos" por defecto** en el selector de
  Departamentos (el API ya la devuelve como `{codigo:"0", nombre:"Todos"}`), para que
  no quede en blanco y se estandarice con los demás reportes.

---

### Obs. 3 — Asignaciones/fondos que no aplican en la leyenda ✅ IMPLEMENTADO

La leyenda de la gráfica se armaba con **todos** los sub-ítems del API, sin importar su
valor. Verificado contra el API real:

- Municipio (Leticia, vig. 2025-2034): solo "Asignación para la Inversión Local" trae
  recursos; Paz, Directas, Regional, CTeI, Ambiental y Río Magdalena vienen en **0**.
- PR 2013-2022: "ASIGNACION PAZ" viene con valor **0** (no existía ese bienio) pero se
  graficaba.

**Acción** (`actualizarGrafico`): se grafican únicamente las asignaciones/fondos con
recursos en **algún año** (`some(y) !== 0`) y se excluye explícitamente la fila de
**Total** (`IdConcepto === '99'`). Con esto, en municipios desaparecen FAE/CTeI y en el
PR 2013-2022 desaparece la Asignación para la Paz.

> Nota de alcance: en vigencias antiguas (≤ 2019) el API entrega una estructura de
> conceptos distinta (sin `IdConcepto` 1000/2000). El filtro por valor cubre el caso de
> Paz reportado, pero la selección de barras para esas vigencias podría requerir una
> revisión adicional si se detectan otros conceptos fuera de lugar (p. ej. FAE/FONPET
> como barras). No estaba dentro de las observaciones; validar si aplica.

---

### Obs. 4 — Nombres de asignaciones/fondos 📄 PENDIENTE (BACKEND)

Los nombres se toman del campo `Concepto` de
`detalle_planrecursos`. En las **vigencias antiguas** el API devuelve nombres largos que
deben homogeneizarse/acortarse como ya se hizo en otros reportes. Ejemplos reales
(PR 2013-2022):

- `+ Fondo de Compensación Regional (FCR) ->40% (Especificas)`
- `+ Monto que podrá destinarse a compensar asignaciones directas`
- `+ Fondo de Compensación Regional (FCR) ->60%`
- `+ Monto para inversión regional`

**Requerimiento:** el ajuste debe hacerse en el **backend** (endpoint
`sgrplanrecursos/detalle_planrecursos`) para que entregue los nombres ya recortados y
consistentes entre reportes. No se agregó mapa de renombrado en el front para no
duplicar la lógica de nomenclatura.

---

### Obs. 5 — ANM en el filtro de municipios ✅ IMPLEMENTADO

Amazonas, Guainía y Vaupés mostraban en el filtro sus **Áreas No Municipalizadas (ANM)**,
que no son beneficiarias del SGR. Verificado en el API: llegan como
`{codigo:"91ANM", nombre:"Amazonas - Areas No Municipalizadas"}` (y equivalentes
`94ANM`, `97ANM`).

**Acción** (`sortMunicipios`): se excluyen los registros cuyo `codigo` contiene `ANM`
(`/ANM/i`). Aplica a todos los departamentos y vigencias.

---

## Archivos modificados

- `src/app/components/header/header.component.ts` — obs. 1 (menú).
- `src/app/components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component.html` — obs. 2 (fechas).
- `src/app/components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component.ts` — obs. 2 (default "Todos"), obs. 3 (gráfica), obs. 5 (ANM).

## Pendientes (Plan de Recursos)

- **Obs. 4:** ajuste de nombres en backend (`detalle_planrecursos`).
- **Obs. 3 (nota):** validar leyenda en vigencias ≤ 2019 por estructura de conceptos distinta.

---

## Observaciones al reporte "Plan Bienal de Caja" (`sgr-plan-bienal-caja`)

### Obs. 1 — La gráfica no era clara ni consistente con la tabla ✅ IMPLEMENTADO

La gráfica graficaba **solo la fila INVERSIÓN** (`IdConcepto === '1000'`), aunque el
título dice "Totales plan bienal de caja (PBC)" y la tabla muestra inversión + ahorro +
administración. Al pasar el cursor solo se veía el valor de inversión del mes.

Verificado contra el API: la fila **Total** (`IdConcepto === '99'`) trae los 24 valores
mensuales y equivale a inversión + ahorro + otros.

**Acción** (`actualizarGrafico`): la gráfica ahora usa la fila **Total** → muestra el
total mensual del PBC por año (una serie por año). El desglose por concepto queda en la
tabla inferior. Además el tooltip se etiqueta como `Total {año}: {valor}` para dejar
claro qué se muestra.

> Alternativa no aplicada: graficar tres series apiladas (inversión/ahorro/administración)
> por mes. Se optó por el total según la sugerencia (detalle en la tabla). Fácil de
> cambiar si se prefiere el apilado.

### Obs. 2 — Botón de descarga 📄 PENDIENTE (BACKEND)

`exportarExcel()` era un stub (`console.log`), por eso "no descargaba". Se verificó en el
Swagger que **no existe endpoint de descarga** para `sgrplanbienal` ni `sgrplanrecursos`
(solo hay descargas para SGP y PGN), y el proyecto no tiene librería de Excel/CSV.

**Decisión:** la descarga la proveerá el **backend** (endpoint análogo a los de SGP/PGN).
Mientras tanto, el botón "Exportar Excel" quedó **deshabilitado** en PBC y PR para no dar
la falsa impresión de que funciona.

### Obs. 3 — Nombres de asignaciones extensos 📄 PENDIENTE (BACKEND)

Igual que la obs. 4 del PR: los nombres largos vienen del campo `Concepto` del API
(`detalle_planbienal`), especialmente en vigencias antiguas. El recorte debe hacerse en
backend para mantener consistencia entre reportes.

### Obs. 4 — Referencia a "Informes de recaudo" ✅ IMPLEMENTADO

Se eliminó el botón/split-button **"Informes de recaudo"** al final de los reportes de
programación (PBC y PR), por no considerarse necesario. En el PBC se removió también el
código muerto asociado (`SplitButtonModule`, `menuItems`, `initializeMenuItems`) y en el
PR el método `verInformesRecaudo`.

### Obs. 5 — Vigencia 2012 sin datos y años de la gráfica desactualizados ✅ IMPLEMENTADO

- El filtro permitía elegir **2012** (id 1), que **no tiene** datos de PBC (el API
  devuelve conceptos sin campos mensuales). Se excluye del filtro (`cargarVigencias`
  filtra vigencias sin ` - `, es decir, no-bienios) y se agregó la nota (3) en el reporte.
- La gráfica no actualizaba los años: `actualizarGrafico` hacía `return` temprano cuando
  no encontraba la fila de inversión, dejando las etiquetas 2025/2026 por defecto. Ahora
  **siempre** actualiza las etiquetas de año según la vigencia (con ceros si no hay datos).

## Archivos modificados (PBC/PR)

- `src/app/components/sgr-plan-bienal-caja/sgr-plan-bienal-caja.component.ts` — obs. 1, 4, 5.
- `src/app/components/sgr-plan-bienal-caja/sgr-plan-bienal-caja.component.html` — obs. 2 (botón deshabilitado), 4, 5 (nota).
- `src/app/components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component.html` — obs. 2 (botón deshabilitado), 4.
- `src/app/components/sgr-plan-bienal-recursos/sgr-plan-bienal-recursos.component.ts` — obs. 4 (método removido).

## Pendientes (Plan Bienal de Caja)

- **Obs. 2:** endpoint de descarga en backend para plan bienal/recursos.
- **Obs. 3:** ajuste de nombres en backend (`detalle_planbienal`).
