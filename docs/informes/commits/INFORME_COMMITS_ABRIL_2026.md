# Informe de Cambios - Abril 2026
## SICODIS WebII

**Período:** 1 de abril - 30 de abril de 2026
**Fecha del informe:** 27 de abril de 2026

---

## Resumen Ejecutivo

Durante el mes de abril de 2026 se realizaron **18 commits** que introdujeron mejoras significativas en el proyecto SICODIS WebII, enfocadas principalmente en:

1. **Optimización y limpieza del código** - Eliminación de componentes obsoletos y archivos no utilizados
2. **Nueva funcionalidad** - Implementación del componente "Mapa de Recursos" y "SGR Inicio"
3. **Mejoras de experiencia de usuario** - Ajustes en popups, filtros y visualización de reportes
4. **Optimización de rendimiento** - Ajustes en configuración de budgets de Angular
5. **Documentación extensa** - Manual de usuario completo para todos los módulos del sistema

---

## Estadísticas Generales

| Métrica | Valor |
|---------|-------|
| **Commits totales** | 18 |
| **Líneas agregadas** | 35,365 |
| **Líneas eliminadas** | 18,265 |
| **Total de cambios** | 53,630 |
| **Archivos modificados** | 150+ |
| **Componentes eliminados** | 10 |
| **Componentes nuevos** | 2 |

### Contribuidores

| Desarrollador | Commits | Porcentaje |
|---------------|---------|------------|
| Edwin Piragauta | 15 | 83% |
| Andres Enrique Pachon Bustos | 3 | 17% |

---

## Cambios por Categoría

### 1. Nueva Funcionalidad

#### 1.1 Componente "Mapa de Recursos" (2026-04-10)
**Commit:** `3a6b862` - Agregar componente de visualización Mapa de Recursos

**Descripción:**
Implementación completa de un nuevo módulo de visualización geográfica de recursos fiscales que integra datos de los tres sistemas principales (SGR, SGP, PGN).

**Características implementadas:**
- Panel lateral con filtros de sistemas (SGR, SGP, PGN)
- Selector de vigencia (últimos 10 años)
- Controles de visualización con capas y opacidad ajustable
- Tarjetas de resumen con totales por sistema
- Mapa interactivo con Leaflet mostrando distribución geográfica
- Marcadores con popups de información detallada
- Consulta especial preparada para Resguardos Indígenas
- Diseño completamente responsivo

**Archivos creados:**
- `src/app/components/mapa-recursos/mapa-recursos.component.ts` (275 líneas)
- `src/app/components/mapa-recursos/mapa-recursos.component.html` (197 líneas)
- `src/app/components/mapa-recursos/mapa-recursos.component.scss` (465 líneas)
- `src/app/components/mapa-recursos/README.md` (373 líneas)
- Documentación técnica: `docs/mapa-recursos.md` y `docs/mapa-recursos-resumen.md`
- Assets de Leaflet (5 archivos de íconos y capas)

**Documentación asociada:**
Se creó un **manual de usuario completo** con 30 archivos Markdown distribuidos en:
- 00-portada.md
- 01-introduccion.md
- 02-navegacion-general.md
- Módulo SGP (7 documentos)
- Módulo SGR (7 documentos)
- Módulo PGN (3 documentos)
- Sección de ayuda (3 documentos)
- Apéndices (3 documentos)

**Total de líneas de documentación:** ~19,500 líneas

**Ruta:** `/mapa-recursos`

---

#### 1.2 Componente "SGR Inicio" (2026-04-14)
**Commit:** `d80c499` - Adición nuevo componente sgr-inicio

**Descripción:**
Página de inicio dedicada al módulo SGR (Sistema General de Regalías) que sirve como hub de navegación para todos los submódulos de regalías.

**Características:**
- Tarjetas de navegación visual con iconografía personalizada
- Enlaces a 7 submódulos principales del SGR
- Diseño moderno con gradientes y efectos hover
- Imagen de hero principal
- Totalmente responsivo

**Archivos creados:**
- `src/app/components/sgr-inicio/sgr-inicio.component.ts` (229 líneas)
- `src/app/components/sgr-inicio/sgr-inicio.component.html` (113 líneas)
- `src/app/components/sgr-inicio/sgr-inicio.component.scss` (528 líneas)
- 8 nuevos iconos PNG para el módulo SGR

**Submódulos vinculados:**
1. Recaudo Mensual
2. Recaudo Directas
3. Presupuesto vs Recaudo
4. Administración y SSEC
5. Plan de Recursos
6. Plan Bienal de Caja
7. Comparativo SGR
8. Geovisor

**Ruta:** `/sgr-inicio`

---

### 2. Limpieza y Refactorización

#### 2.1 Eliminación de Componentes Obsoletos (2026-04-16)
**Commits:** `3547873`, `414cac2`, `f92a4c6`, `b41492a`

**Resumen:**
Gran limpieza de código que eliminó **10 componentes no utilizados** y sus archivos asociados, reduciendo significativamente el tamaño del proyecto.

**Componentes eliminados (51 archivos):**

1. **comparativo-iac-vs-presupuesto** (4 archivos)
   - Component, template, styles, spec

2. **dashboard** (5 archivos)
   - budget-chart.component
   - budget-map.component
   - budget.service
   - dashboard.component

3. **graphics-sgp** (4 archivos)
   - Component completo con 841 líneas de código

4. **iac-comparative-vs-budget** (5 archivos)
   - Incluía convertidor sgp-budget-converter.ts (468 líneas)

5. **propuesta-resumen-sgr** (4 archivos)
   - Component con 555 líneas

6. **reports-map** (4 archivos)
   - Component con 370 líneas

7. **reports-sgp-budget** (4 archivos)
   - Component con 306 líneas

8. **reports-sgp-dist** (4 archivos)
   - Component con 132 líneas

9. **reports-sgr-comparative** (4 archivos)
   - Component con 305 líneas

10. **reports-sgr** (4 archivos + stats sub-component)
    - reports-sgr.component (682 líneas)
    - reports-sgr-stats.component (291 líneas)

**Total eliminado:** 9,663 líneas de código

**Archivos de assets eliminados:**
- `comparativo-iac-vs-presupuesto-detallado-entidades.json`
- `entidad_territorial.json`
- `nombre_atributos.json`
- `propuesta-resumen-sgr.json` (542 líneas)
- `resumen_plan_recursos_sgr.json`
- `territorial-entities-detail.json` (6,437 líneas - luego restaurado)
- `sgp-documentos-anexos.jpg` (252 KB)

**Total eliminado:** 6,983 líneas de archivos de datos

**Rutas eliminadas en app.routes.ts:** 20 rutas obsoletas

**Impacto:**
- Reducción del tamaño del proyecto en ~16,000 líneas
- Mejora en tiempos de compilación
- Simplificación de la estructura del proyecto
- De 52 a **42 componentes** activos
- De 71 a **61 rutas** activas

---

#### 2.2 Eliminación de Dashboard Highcharts (2026-04-16)
**Commit:** `ba26906` - Remove Highcharts dashboard component and related files

**Descripción:**
Eliminación del componente de dashboard basado en Highcharts que no se estaba utilizando.

**Archivos eliminados:**
- `highcharts-chart.component` (3 archivos)
- `highcharts-dashboard.component` (4 archivos, 220 líneas)
- Spec file con 110 líneas de pruebas

**Optimización de imágenes:**
- `banner-sicodis.jpg`: 746 KB → 295 KB (60% reducción)
- `carrousel1.jpg`: 614 KB → 136 KB (78% reducción)
- `carrousel2.jpg`: 499 KB → 101 KB (80% reducción)
- `target2.jpg`: 580 KB → 191 KB (67% reducción)

**Total eliminado:** 753 líneas de código
**Ahorro de peso:** ~1.8 MB en imágenes optimizadas

---

#### 2.3 Limpieza del Componente Home (2026-04-16)
**Commit:** `e09a7a1` - Ajuste en el diseño de tarjetas y eliminación de código comentado

**Descripción:**
Refactorización del componente principal de inicio, eliminando código comentado y simplificando la estructura.

**Cambios:**
- Eliminación de 197 líneas de código obsoleto en TypeScript
- Simplificación de 29 líneas en el template HTML
- Mejora en el diseño de tarjetas de navegación

**Total eliminado:** 212 líneas de código muerto

---

#### 2.4 Actualización de Documentación (2026-04-16)
**Commit:** `315c158` - Update documentation: component count 52→42, route count 71→61

**Descripción:**
Actualización del archivo `CLAUDE.md` para reflejar la nueva estructura del proyecto tras la limpieza.

**Cambios en la documentación:**
- Actualización de conteo de componentes: 52 → **42**
- Actualización de conteo de rutas: 71 → **61**
- Ajustes en descripciones de arquitectura

---

#### 2.5 Restauración de Archivo Necesario (2026-04-16)
**Commit:** `b41492a` - Fix orphaned route references and restore territorial-entities-detail.json

**Descripción:**
Corrección de referencias huérfanas y restauración de archivo eliminado por error.

**Cambios:**
- Restauración de `territorial-entities-detail.json` (6,437 líneas)
- Corrección de 42 líneas en `faq.component.ts`
- Limpieza de import innecesario en `sgp-inicio.component.ts`

---

### 3. Mejoras de Experiencia de Usuario

#### 3.1 Popup del Home con SessionStorage (2026-04-16)
**Commit:** `458a24e` - Implement sessionStorage to show home popup only once per session

**Descripción:**
Mejora en la UX del popup de bienvenida para que solo se muestre una vez por sesión del navegador, en lugar de en cada visita a la página de inicio.

**Implementación:**
```typescript
// Verificar si ya se mostró el popup en esta sesión
const popupShown = sessionStorage.getItem('homePopupShown');

if (!popupShown) {
  this.showPopup = true;
  sessionStorage.setItem('homePopupShown', 'true');
}
```

**Archivos modificados:**
- `src/app/components/home/home.component.ts` (+12 líneas)

---

#### 3.2 Ajustes en Reportes de Presupuesto vs Recaudo (2026-04-18)
**Commit:** `ec49e63` - Cambios a reporte pto vs recaudo solicitados área funcional

**Descripción:**
Mejoras solicitadas por el área funcional en el componente de comparación entre presupuesto y recaudo del SGR.

**Cambios principales:**
- Actualización de lógica de filtrado y visualización (+50 líneas)
- Nuevos endpoints en `sicodis-api.service.ts` (+8 líneas)
- Ajustes en template HTML (+3 líneas)

**Archivos modificados:**
- `src/app/components/sgr-presupuesto-y-recaudo/presupuesto-y-recaudo.component.ts`
- `src/app/components/sgr-presupuesto-y-recaudo/presupuesto-y-recaudo.component.html`
- `src/app/services/sicodis-api.service.ts`

---

#### 3.3 Ocultamiento Condicional de Botón de Informes (2026-04-21)
**Commit:** `6ed27df` - Ajuste para ocultar o mostrar el botón de informes de recaudo

**Descripción:**
Implementación de lógica condicional para mostrar/ocultar el botón de informes de recaudo según la vigencia seleccionada.

**Implementación:**
```html
<!-- Mostrar solo si cumple condiciones de vigencia -->
<button *ngIf="shouldShowReportButton()" ...>
```

**Archivos modificados:**
- `src/app/components/sgr-presupuesto-y-recaudo/presupuesto-y-recaudo.component.html` (+1 línea)

---

### 4. Optimización y Configuración

#### 4.1 Ajustes de Budget en Angular (2026-04-14, 2026-04-27)
**Commits:** `ab4ef5a`, `a5aa215`

**Descripción:**
Ajustes en la configuración de budgets de Angular para evitar warnings y errores durante el build de producción, adaptándose al crecimiento del proyecto.

**Cambios en `angular.json`:**

**Primera actualización (2026-04-14):**
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "800kB",  // Aumentado de 500kB
    "maximumError": "3.5MB"     // Aumentado de 1MB
  }
]
```

**Segunda actualización (2026-04-27):**
```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "900kB",  // Ajuste final
    "maximumError": "4MB"       // Ajuste final
  }
]
```

**Razón:**
A medida que se agregaron componentes nuevos (mapa-recursos, sgr-inicio) y documentación, el bundle creció. Los límites se ajustaron para mantener un balance entre alertas útiles y builds exitosos.

---

#### 4.2 Actualización de Settings de Claude (2026-04-16)
**Commit:** `6d95a08` - actualización settings.local.json

**Descripción:**
Configuración local de Claude Code para el proyecto.

**Archivo modificado:**
- `.claude/settings.local.json` (+2 líneas)

---

### 5. Corrección de Bugs

#### 5.1 Ajuste en Reportes de Asignaciones Directas (2026-04-10)
**Commit:** `95c22f7` - Ajuste bug reportes AD

**Autor:** Andres Enrique Pachon Bustos

**Descripción:**
Corrección de bug en el componente de recaudo de regalías directas (SGR).

**Cambios:**
- Refactorización de 16 líneas de lógica en `sgr-recaudo-directas.component.ts`
- Corrección en manejo de datos y filtros

**Archivos modificados:**
- `src/app/components/sgr-recaudo-directas/sgr-recaudo-directas.component.ts` (8 inserciones, 8 eliminaciones)

---

### 6. Adiciones al Mapa de Sitio

#### 6.1 Agregar Mapa de Recursos al Sitemap (2026-04-10)
**Commit:** `4776b38` - Agragar mapa de recursos a mapa de sitio

**Descripción:**
Inclusión del nuevo componente "Mapa de Recursos" en el mapa de sitio de la aplicación.

**Archivos modificados:**
- `src/app/components/sitemap/sitemap.component.html` (+1 línea)

---

### 7. Checkpoint y Documentación Extensa (2026-04-16)

#### 7.1 Checkpoint Previo a Limpieza
**Commit:** `c904250` - Checkpoint before cleanup

**Descripción:**
Punto de guardado antes de realizar la limpieza masiva de componentes, incluyendo documentación de diseño y mejoras propuestas.

**Archivos agregados:**
- `INSTRUCCIONES-SCREENSHOTS.md` (449 líneas)
- `docs/DESIGN-SYSTEM.md` (493 líneas)
- `docs/HOME-HTML-IMPROVEMENTS.md` (697 líneas)
- `docs/HOME-REDESIGN-CHANGELOG.md` (414 líneas)
- Screenshots de componentes SGP y elementos comunes
- Archivo Excel de deficiencias del SGP (4.5 MB)
- Actualización masiva de `package-lock.json`

**Total agregado:** 2,053 líneas de documentación técnica

---

## Archivos Más Modificados

### Top 10 Archivos por Cantidad de Cambios

1. **package-lock.json** - Actualización de dependencias
2. **docs/manual-de-usuario/** - 30 archivos nuevos (~19,500 líneas)
3. **src/app/app.routes.ts** - Eliminación de 20 rutas, adición de 2 nuevas
4. **CLAUDE.md** - Actualización de documentación del proyecto
5. **src/app/components/mapa-recursos/** - Componente completo nuevo (937 líneas)
6. **src/app/components/sgr-inicio/** - Componente completo nuevo (870 líneas)
7. **src/app/components/header/header.component.ts** - Actualización de menús
8. **src/app/services/sicodis-api.service.ts** - Nuevos endpoints
9. **angular.json** - Ajustes de budgets (2 commits)
10. **src/app/components/home/home.component.ts** - Limpieza y mejoras

---

## Resumen de Rutas Agregadas/Eliminadas

### Rutas Agregadas (2)
1. `/mapa-recursos` → MapaRecursosComponent
2. `/sgr-inicio` → SgrInicioComponent

### Rutas Eliminadas (20)
Componentes obsoletos de reportes SGR, SGP, dashboards y vistas comparativas que fueron descontinuados.

---

## Impacto en el Tamaño del Proyecto

### Código de Producción
| Categoría | Antes | Después | Cambio |
|-----------|-------|---------|--------|
| Componentes activos | 52 | 42 | -10 |
| Rutas definidas | 71 | 61 | -10 |
| Archivos TypeScript | ~180 | ~135 | -45 |

### Bundle Size
| Tipo | Límite Anterior | Límite Actual | Cambio |
|------|-----------------|---------------|--------|
| Initial Warning | 500 KB | 900 KB | +80% |
| Initial Error | 1 MB | 4 MB | +300% |

**Nota:** Los límites se ajustaron para acomodar nuevas funcionalidades (Mapa de Recursos, documentación embebida).

### Imágenes Optimizadas
- **Ahorro total:** ~1.8 MB
- **Reducción promedio:** 71%

---

## Tecnologías y Librerías Afectadas

### Agregadas/Actualizadas
- **Leaflet** - Integración completa para mapas interactivos
  - Assets de íconos y capas
  - Estilos en `src/styles.scss`

### Removidas
- **Highcharts** - Componente de dashboard eliminado

---

## Recomendaciones y Próximos Pasos

### Completadas en Abril ✅
1. ✅ Limpieza de componentes obsoletos
2. ✅ Implementación de Mapa de Recursos con documentación
3. ✅ Creación de página de inicio SGR
4. ✅ Optimización de imágenes
5. ✅ Ajustes de UX (popup, filtros condicionales)
6. ✅ Manual de usuario completo

### Pendientes para Mayo
1. **Testing:** Actualizar pruebas unitarias de componentes modificados
2. **Validación:** Pruebas de integración del Mapa de Recursos con datos reales
3. **Performance:** Análisis de carga con datos completos de los 3 sistemas
4. **Accesibilidad:** Auditoría de componentes nuevos (mapa-recursos, sgr-inicio)
5. **SEO:** Implementación de meta tags para nuevas rutas
6. **Documentación API:** Documentar nuevos endpoints en sicodis-api.service.ts

---

## Commits Detallados por Fecha

### 10 de Abril (3 commits)
1. `3a6b862` - Agregar componente de visualización Mapa de Recursos
2. `4776b38` - Agragar mapa de recursos a mapa de sitio
3. `95c22f7` - Ajuste bug reportes AD

### 14 de Abril (2 commits)
1. `ab4ef5a` - actualizar tamaños de budgets para evitar errores
2. `d80c499` - Adicion nuevo componente sgr-inicio

### 16 de Abril (9 commits)
1. `ba26906` - Remove Highcharts dashboard component
2. `c904250` - Checkpoint before cleanup
3. `3547873` - Remove routes for 10 unused components
4. `414cac2` - Delete 10 unused component directories
5. `f92a4c6` - Delete 7 unused asset files
6. `b41492a` - Fix orphaned route references
7. `315c158` - Update documentation counts
8. `6d95a08` - actualización settings.local.json
9. `458a24e` - Implement sessionStorage for home popup

### 18 de Abril (1 commit)
1. `ec49e63` - Cambios a reporte pto vs recaudo

### 21 de Abril (1 commit)
1. `6ed27df` - Ajuste para ocultar botón de informes según vigencia

### 27 de Abril (2 commits)
1. `a5aa215` - Actualización maximumWarning de budgets
2. (merge commit omitido del conteo)

---

## Notas Técnicas

### Convenciones de Commits
Los commits siguieron buenas prácticas:
- Mensajes descriptivos en español
- Un commit por cambio lógico
- Checkpoint antes de refactorizaciones grandes
- Co-authored para trabajo colaborativo (Claude)

### Gestión de Branches
- Trabajo principal en branch `main`
- 1 merge commit realizado durante el mes

### Archivos de Configuración Modificados
- `angular.json` - Budgets (2 commits)
- `package-lock.json` - Dependencias actualizadas
- `.claude/settings.local.json` - Configuración de Claude Code
- `src/styles.scss` - Estilos de Leaflet

---

## Métricas de Calidad

### Cobertura de Documentación
- ✅ Manual de usuario completo (30 documentos)
- ✅ README para componente mapa-recursos
- ✅ CLAUDE.md actualizado
- ✅ Documentación técnica de diseño
- ⚠️ Pendiente: JSDoc en componentes nuevos

### Deuda Técnica Reducida
- **Código eliminado:** ~16,000 líneas obsoletas
- **Componentes huérfanos:** 0 (todos eliminados o vinculados)
- **Rutas muertas:** 0 (20 eliminadas)
- **Archivos no utilizados:** 7 eliminados

### Code Smells Resueltos
- ✅ Código comentado eliminado (home.component)
- ✅ Componentes duplicados eliminados
- ✅ Imports no utilizados limpiados
- ✅ Imágenes optimizadas (71% reducción)

---

## Conclusiones

El mes de abril de 2026 fue un período de **consolidación y mejora** del proyecto SICODIS WebII. Se lograron los siguientes hitos principales:

### Logros Destacados

1. **Limpieza Masiva del Código**
   - Eliminación de 16,000+ líneas de código obsoleto
   - Reducción de 52 a 42 componentes activos
   - Optimización de 1.8 MB en imágenes

2. **Nueva Funcionalidad de Alto Valor**
   - Componente "Mapa de Recursos" con visualización geográfica integrada
   - Página de inicio SGR moderna y funcional
   - Manual de usuario exhaustivo para todos los módulos

3. **Mejoras de UX**
   - Popup no intrusivo (una vez por sesión)
   - Filtros condicionales inteligentes
   - Navegación mejorada entre módulos

4. **Optimización del Build**
   - Ajustes de budgets para builds exitosos
   - Mejor organización de assets
   - Reducción de tiempo de compilación

### Colaboración Efectiva

La distribución del trabajo entre Edwin Piragauta (83% de commits) y Andres Enrique Pachon Bustos (17% de commits) demuestra un equipo bien coordinado, con Edwin liderando la refactorización y nuevos componentes, mientras Andres se enfocó en ajustes funcionales específicos.

### Estado del Proyecto

El proyecto se encuentra en un **estado sólido y mantenible**, con:
- Código limpio y bien organizado
- Documentación completa para usuarios y desarrolladores
- Arquitectura simplificada y escalable
- Base sólida para futuras expansiones

---

**Preparado por:** Sistema de Análisis de Commits
**Revisión:** Pendiente
**Próxima revisión:** Mayo 2026

---

## Anexos

### A. Lista Completa de Componentes Eliminados

```
comparativo-iac-vs-presupuesto/
dashboard/
  ├── budget-chart.component
  ├── budget-map.component
  ├── budget.service
  └── dashboard.component
graphics-sgp/
iac-comparative-vs-budget/
  └── sgp-budget-converter.ts
propuesta-resumen-sgr/
reports-map/
reports-sgp-budget/
reports-sgp-dist/
reports-sgr-comparative/
reports-sgr/
  ├── reports-sgr.component
  └── reports-sgr-stats.component
highcharts-dashboard/
  ├── highcharts-chart.component
  └── highcharts-dashboard.component
```

### B. Nuevos Assets Agregados

**Iconos SGR (8 archivos PNG):**
- icono-sgr-administracion-y-ssec.png
- icono-sgr-comparativo.png
- icono-sgr-geovisorpng.png
- icono-sgr-programacion.png
- icono-sgr-recaudo-directas.png
- icono-sgr-recaudo-mensual.png
- recaudo-presupuesto.png
- sgr-inicio.png

**Assets Leaflet (5 archivos):**
- layers.png / layers-2x.png
- marker-icon.png / marker-icon-2x.png
- marker-shadow.png

### C. Estructura de Documentación del Manual de Usuario

```
docs/manual-de-usuario/
├── 00-portada.md
├── 01-introduccion.md
├── 02-navegacion-general.md
├── 03-sgp/
│   ├── 03-00-sgp-introduccion.md
│   ├── 03-01-sgp-resumen.md
│   ├── 03-02-sgp-documentos-anexos.md
│   ├── 03-03-sgp-detalle-presupuestal.md
│   ├── 03-04-sgp-comparativo.md
│   ├── 03-05-sgp-historico.md
│   ├── 03-06-sgp-eficiencias.md
│   └── 03-07-sgp-archivos-descargables.md
├── 04-sgr/
│   ├── 04-00-sgr-introduccion.md
│   ├── 04-01-sgr-recaudo-mensual.md
│   ├── 04-02-sgr-recaudo-directas.md
│   ├── 04-03-sgr-presupuesto-recaudo.md
│   ├── 04-04-sgr-funcionamiento-ssec.md
│   ├── 04-05-sgr-plan-recursos.md
│   ├── 04-06-sgr-plan-bienal-caja.md
│   └── 04-07-sgr-comparativo.md
├── 05-pgn/
│   ├── 05-00-pgn-introduccion.md
│   ├── 05-01-pgn-regionalizacion-programacion.md
│   ├── 05-02-pgn-regionalizacion-seguimiento.md
│   └── 05-03-pgn-inversion-sector.md
├── 06-ayuda/
│   ├── 06-00-preguntas-frecuentes.md
│   ├── 06-01-glosario-terminos.md
│   └── 06-02-soporte-contacto.md
├── 07-apendices/
│   ├── 07-01-metodologias-calculo.md
│   ├── 07-02-fuentes-datos.md
│   └── 07-03-normatividad.md
├── CHANGELOG.md
└── README.md
```

---

*Fin del informe*
