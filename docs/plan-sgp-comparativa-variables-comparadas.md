# Plan: subsección "Variables Comparadas" — Tablero comparativo SGP

- **Componente:** `src/app/components/sgp-comparativa/`
- **Mockup:** `2. Variables-Comparadas–propuesta.pdf` (raíz del repo)
- **Fecha:** 2026-10-26

## Solicitud

Agregar al Tablero Comparativo del SGP la pestaña **Variables Comparadas**, al lado de la pestaña **Recursos** que ya existe. Tendrá seis subpestañas:

1. Variables Generales
2. Educación
3. Salud
4. Agua Potable
5. Propósito General
6. Asignaciones Especiales

Cada subpestaña muestra una comparación dual de las entidades seleccionadas, con la vigencia anterior, la vigencia seleccionada y la variación porcentual en semáforo. La depuración de las variables sigue pendiente, pero se puede publicar con la información que ya está construida.

## Estado previo

- En el componente había un tab oculto `detalle-recaudo`, sin botón visible, con un accordion de variables para cinco secciones. No tenía Salud y usaba datos de ejemplo escritos en el código.
- También había un tab oculto `informe-trimestral` con datos aleatorios. No aparece en el mockup.
- No existe un endpoint de "variables comparadas". El de Eficiencias (`/api/eficiencias/resumen/{dane}`, mediante `EficienciasService` con respaldo mock) trae población, NBI, indicadores de eficiencia, ingresos tributarios y datos de Ley 617.

## Decisiones

| Tema | Decisión |
|---|---|
| Fuente de datos | **Mixta.** Endpoint de Eficiencias para las variables que cubre; datos de ejemplo (marcados como preliminares) para el resto. |
| Salud | Subpestaña visible con el mensaje "Información en proceso de depuración". |
| Número de entidades | La vista funciona con 1 o 2 entidades. Con una sola, la columna ocupa todo el ancho. |
| Íconos | Se usan los PNG de `src/assets/img/sgp/comparativo/` como `mask-image`, para pintarlos con el color del tema. |
| Tabs ocultos | Se eliminan `detalle-recaudo` e `informe-trimestral` y su código de ejemplo. |

## Diseño

### 1. Pestañas principales
- Dos botones grandes, **Recursos** y **Variables Comparadas**, entre el banner y el panel de filtros. La activa va en azul y la inactiva en gris.
- `activeTab: 'recursos' | 'variables'`. Al volver a Recursos se redibujan los gráficos con Chart.js, porque sus canvas se destruyen con `*ngIf`.
- El panel de filtros es el mismo para las dos pestañas.

### 2. Subpestañas
- Fila de seis botones, visible solo en la pestaña Variables. Por defecto queda activa *Variables Generales*.

### 3. Vista comparativa
- Tarjeta con encabezado: ícono de la participación + `VARIABLES <SECCIÓN> ENTIDAD TERRITORIAL` + botón para colapsar.
- Una columna por entidad:
  - pin y nombre "Municipio, Departamento", con badge *Entidad 1* (azul) o *Entidad 2* (verde);
  - tabla `VARIABLE | <vigencia anterior> | <vigencia> | VAR.`.
- La columna VAR. es un semáforo: ▲ verde si aumenta, ▼ rojo si disminuye y — gris si es 0,00 % o no aplica.
- Pie con la leyenda de entidades y del semáforo.
- En pantallas de menos de 992 px las columnas se apilan.

### 4. Datos (`src/app/data/sgp-variables-comparadas.ts`)
- `SECCIONES_VARIABLES` define, por subpestaña, la etiqueta, el título, el ícono y las variables.
- Cada variable tiene `nombre`, `formato` y, según su origen, `eficiencias` (cómo se calcula desde el resumen de Eficiencias) o `ejemplo` (valores provisionales por entidad).
- Cuando termine la depuración, solo hay que editar este archivo.

Variables que salen de Eficiencias, con la vigencia `V` seleccionada:

| Variable | Origen | Año |
|---|---|---|
| Población total | `poblacion[].poblacion` | V |
| NBI | `nbi[].valor` | V |
| Ingresos tributarios refrendados | `ingresos_tributarios[].valor` | V − 2 |
| Ingresos tributarios per cápita | ingresos ÷ población | V − 2 |
| Indicador crecimiento ingresos per cápita (eficiencia fiscal) | `eficiencia_fiscal[].valor` | V |
| Eficiencia administrativa | `eficiencia_administrativa[].valor` | V |
| ICLD, Gastos de funcionamiento, Razón, Holgura (Ley 617) | `ley_617_*[].valor` | V − 2 |

- Para la vigencia anterior se usa el mismo cálculo con `V − 1`.
- Si el endpoint falla o no tiene la entidad (por ejemplo, una gobernación), esas filas muestran "—".
- Las filas con datos de ejemplo llevan un asterisco y la nota "(*) Dato preliminar en proceso de depuración".

### 5. Carga
- **Aplicar** recarga Recursos y Variables.
- Al entrar a Variables, se cargan los datos si aún no están.
- Las peticiones se combinan con `forkJoin` y `catchError`, y hay un indicador de carga propio.
- **Limpiar** vacía la vista.

## Archivos

- `src/app/components/sgp-comparativa/sgp-comparativa.component.{html,ts,scss}`
- `src/app/data/sgp-variables-comparadas.ts` (nuevo)
- `src/assets/img/sgp/comparativo/*.png` (ya existen)

## Pendientes con el área funcional

1. Lista definitiva de variables por subpestaña, después de la depuración.
2. Variables de Salud.
3. Fuente de *Categorización Ley 617/00*, población rural/urbana, área geográfica y ribera del Magdalena, que hoy son datos de ejemplo.
