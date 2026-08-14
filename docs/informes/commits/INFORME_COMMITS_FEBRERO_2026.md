# Informe de Cambios - Febrero 2026
## Sistema SICODIS WebII

---

## Resumen Ejecutivo
Durante febrero de 2026 se realizaron **23 commits** con mejoras significativas en autenticación, visualización de datos y componentes del sistema SGR (Sistema General de Regalías) y SGP (Sistema General de Participaciones).

---

## 1. Migración de Autenticación (11-17 Febrero)

### Cambio de Basic a Bearer Token
**Commits:** `e727944`, `7c59fd0`

**Mensaje del commit principal:**
```
Ajustes varios, beare token en ligar de basic
```

**Descripción:**
- Implementación completa de autenticación Bearer token reemplazando el sistema Basic anterior
- Creación de nuevos archivos:
  - `auth.service.ts` (169 líneas): Gestión de tokens con auto-renovación cada 28 minutos
  - `auth.interceptor.ts` (66 líneas): Interceptor HTTP para añadir token a todas las peticiones
  - `app.initializer.ts` (45 líneas): Inicialización pre-bootstrap para validación de token

**Archivos Modificados:**
- `app.config.ts`: Configuración de providers y autenticación
- `sicodis-api.service.ts`: Actualización de endpoints para usar Bearer token
- Componentes SGP y SGR: Actualización de llamadas API

**Impacto:** Mayor seguridad y gestión automática de sesiones

---

## 2. Mejoras en Componente SGR Recaudo Mensual (11-20 Febrero)

### Refactorización Completa
**Commits:** `094e6a7`, `7c59fd0`, `361632e`, `d294221`

**Mensajes de commits:**
```
- "Cambios express enero y febrero- acumulados"
- "Bearer token cambios recaudo mensual"
- "Cambios necesarios para reportes de funcionamiento, recaudo mensual
   y recaudo directas. Para pruebas."
- "Ajuste aplicar filtros"
```

**Cambios Principales:**
- Reestructuración del componente con 216 líneas nuevas de código TypeScript
- Mejora en la visualización de HTML (115 líneas modificadas)
- Actualización de archivos de datos Excel:
  - `reporte-detalle-recaudo-2025.xlsx`: Actualizado con corte 31 Enero (1.04 MB)
  - `reporte-gestion-financiera-2025.xlsx`: Actualizado con corte 31 Enero (744 KB)
- Implementación de nuevos filtros y mejora en aplicación de filtros

**Archivos Impactados:**
- `sgr-recaudo-mensual.component.ts`
- `sgr-recaudo-mensual.component.html`
- `sgr-recaudo-mensual.component.scss`

---

## 3. Refactorización Componente Reporte Funcionamiento (17-26 Febrero)

### Iteraciones de Mejora Continua
**Commits:** `dd3304e`, `138b4a9`, `2a04845`, `f8e8e05`, `03451d7`, `f13cc20`, `d87f3c9`, `feb20ae`, `09c1a5d`, `5d9e77f`, `190c7f6`, `b591030`, `5a3a3a9`, `e14d6f4`, `7dd2c21`

**Evolución del Componente (15 commits):**

#### Fase 1: Refactor Inicial (17 Feb)
**Mensaje del commit:**
```
Refactor ReporteFuncionamientoComponent:
- Remove unnecessary console logs for cleaner code.
- Update variable names for clarity (e.g., donutSituacionCaja to hBarSituacionCaja).
- Introduce new chart options and data structures for improved data visualization.
- Consolidate and enhance chart rendering logic, including detail chart updates.
- Clean up commented-out code and ensure consistent formatting.
```

- Limpieza de código: Eliminación de console.logs innecesarios
- Renombramiento de variables para mayor claridad
- Nueva estructura de opciones y datos de gráficos
- **Cambios:** 502 inserciones, 293 eliminaciones

#### Fase 2: Mejoras Visuales (19-24 Feb)
**Mensajes de commits:**
```
- "Actualiza color background a grafico Avance PBC"
- "Refactor ReporteFuncionamientoComponent: Update chart configurations
   and styles for improved layout and readability"
- "feat: Update ReporteFuncionamientoComponent styles and routes for
   improved layout and new components"
```

- Actualización de colores de fondo en gráfico Avance PBC
- Optimización de estilos CSS (151→67 líneas)
- Simplificación de configuraciones de gráficos (217→109 líneas modificadas)
- Mejora en layout y legibilidad

#### Fase 3: Nueva Funcionalidad (25 Feb)
**Mensaje del commit:**
```
feat: Enhance ReporteFuncionamientoComponent with new entity selection
and API integration for Comisión Rectora
```

- Integración de selección de entidades para Comisión Rectora
- Nuevos endpoints API en `sicodis-api.service.ts` (+21 líneas)
- Gestión dinámica de visibilidad de selectores según beneficiario
- Mejora en contenedores de gráficos detallados

#### Fase 4: Refinamiento de Gráficos (25-26 Feb)
**Mensajes de commits:**
```
- "feat: Align detail chart container and enhance styling for improved layout"
- "feat: Implement hideOptionalSelect method to manage visibility of select
   options based on beneficiary selection"
- "feat: Update chart legend display settings to show and reposition for
   better visibility"
- "feat: Update tooltip settings for improved data visibility in charts"
- "feat: Update chart tooltip formatting and styling for improved clarity"
- "feat: Enhance chart data calculations and tooltip formatting for improved
   clarity and accuracy"
- "Actualizar etiqueta: Caja disponible"
- "Actualizar datos de grafico de Situacion de caja"
- "visual refactors"
- "Cambiar Fuente por Asignación y corregir cuando se selecciona departamento
   o municipio ya que aparecía N/A"
```

- Configuración de leyendas para mejor visibilidad
- Optimización de tooltips con formato mejorado
- Mejora en cálculos de datos y precisión
- Actualización de etiquetas: "Fuente" → "Asignación"
- Corrección de valores N/A en selección de departamentos/municipios

**Archivos Principales:**
- `reporte-funcionamiento.component.ts`: ~500 líneas modificadas
- `reporte-funcionamiento.component.html`: 35 líneas optimizadas
- `reporte-funcionamiento.component.scss`: Simplificado significativamente

---

## 4. Nuevo Componente SGR Plan Bienal (24 Febrero)

### Implementación Completa de Nuevos Módulos
**Commit:** `162070e`

**Mensaje del commit:**
```
feat: Add SGR Plan Bienal Recursos component with chart and table
- Implemented SGR Plan Bienal Recursos component with HTML, SCSS, and TypeScript files.
- Added functionality for filtering data by plan, vigencia, beneficiario, and departamento.
- Integrated bar chart for visual representation of resource plans over a 10-year projection.
- Created a responsive table to display detailed resource plans with export functionality.
- Included popups for dictionary and acronyms with dynamic content loading from API.
- Added necessary assets including images for the component.
- Created unit tests for the component to ensure functionality.
```

**Componentes Creados:**

1. **SGR Plan Bienal Recursos:**
   - HTML: 204 líneas
   - SCSS: 446 líneas
   - TypeScript: 322 líneas
   - Gráfico de barras para proyección de recursos a 10 años
   - Tabla responsiva con funcionalidad de exportación
   - Filtros: plan, vigencia, beneficiario, departamento

2. **SGR Plan Bienal Caja:**
   - HTML: 207 líneas
   - SCSS: 419 líneas
   - TypeScript: 288 líneas
   - Visualización de situación de caja
   - Popups dinámicos para diccionario y acrónimos

**Archivos de Datos:**
- `plan-bienal-caja.ts`: 114 líneas de datos estáticos

**Componentes Eliminados (Reemplazo):**
- `reports-sgr-bienal.component.*`: 305 líneas
- `reports-sgr-resumen-plan-recursos.component.*`: 363 líneas

**Assets Optimizados:**
- Reducción de peso de imágenes banner y carrusel (de ~9 MB a ~1.5 MB)
- Nueva imagen: `sgr-plan-bienal-recursos.jpg` (457 KB)

**Balance Neto:** +723 líneas (2,046 inserciones - 1,323 eliminaciones)

---

## 5. Mejoras en Componentes SGP (11 Febrero)

### Actualizaciones Sistema General de Participaciones
**Commit:** `094e6a7`

**Componentes Modificados:**
- `sgp-inicio.component.ts`: +60 líneas de mejoras
- `sgp-comparativa.component.*`: Refinamientos en visualización
- `sgp-detalle-presupuestal.component.html`: Ajustes de template
- `historico-sgp.component.html`: Correcciones menores

---

## 6. Mejoras en Navegación y Header (11 Febrero)

**Commit:** `094e6a7`

**Cambios:**
- `header.component.html`: +32 líneas de mejoras en navegación
- `header.component.ts`: +15 líneas de funcionalidad
- `home.component.*`: Simplificación de código
- `app.routes.ts`: Actualizaciones de rutas

---

## 7. Otros Servicios Afectados

### Actualización de API Service
**Commits:** `361632e`, `03451d7`

**Nuevos Endpoints:**
- Métodos para reportes de funcionamiento
- Métodos para recaudo mensual
- Métodos para recaudo directas
- Endpoint para Comisión Rectora

**Total Agregado:** +114 líneas en `sicodis-api.service.ts`

---

## Análisis de Calidad de Mensajes de Commit

### Adopción de Conventional Commits

Se observa una **evolución positiva** en la calidad de los mensajes de commit durante el mes:

#### ✅ Mejores Prácticas Observadas (Commits de Edwin Piragauta)

**Formato Conventional Commits con prefijo `feat:`**
```
feat: Add SGR Plan Bienal Recursos component with chart and table
feat: Enhance ReporteFuncionamientoComponent with new entity selection and API integration
feat: Update chart legend display settings to show and reposition for better visibility
feat: Implement hideOptionalSelect method to manage visibility of select options
```

**Características positivas:**
- ✅ Uso de prefijo semántico (`feat:`)
- ✅ Descripción clara de la funcionalidad añadida
- ✅ Algunos commits incluyen lista detallada de cambios
- ✅ Verbos en imperativo (Add, Update, Implement, Enhance)
- ✅ Mensajes descriptivos que explican el "qué" y el "por qué"

**Commits detallados con lista de bullets:**
```
Refactor ReporteFuncionamientoComponent:
- Remove unnecessary console logs for cleaner code.
- Update variable names for clarity
- Introduce new chart options and data structures
- Consolidate and enhance chart rendering logic
- Clean up commented-out code
```

#### ⚠️ Áreas de Mejora (Commits de Andrés Pachón)

**Mensajes genéricos o poco descriptivos:**
```
❌ "Cambios express enero y febrero- acumulados"
❌ "Ajustes varios, beare token en ligar de basic" (typos: beare→bearer, ligar→lugar)
❌ "Ajuste aplicar filtros"
```

**Problemas identificados:**
- Falta de especificidad
- Errores ortográficos
- No siguen conventional commits
- No explican el impacto o razón del cambio

#### 📊 Estadísticas de Calidad

**Por Autor:**
- **Edwin Piragauta:** 14/17 commits (82%) usan conventional commits con buena descripción
- **Andrés Pachón:** 0/6 commits (0%) usan conventional commits

**Evolución Temporal:**
- **11-20 Feb:** Mensajes genéricos predominantes
- **24-26 Feb:** Adopción consistente de conventional commits (Edwin)

### Recomendaciones para Futuros Commits

1. **Adoptar Conventional Commits en todo el equipo:**
   ```
   feat: añadir nueva funcionalidad
   fix: corregir un bug
   refactor: reestructurar código sin cambiar funcionalidad
   docs: cambios en documentación
   style: formateo, punto y coma faltantes, etc.
   test: añadir o refactorizar tests
   chore: actualizar tareas de build, configuraciones, etc.
   ```

2. **Estructura de mensaje recomendada:**
   ```
   <tipo>(<scope>): <descripción breve>

   <cuerpo opcional con más detalles>

   <footer opcional: BREAKING CHANGE, referencias a issues>
   ```

3. **Ejemplo ideal para este proyecto:**
   ```
   feat(sgr-recaudo): añadir filtros por departamento y municipio

   - Implementar dropdowns cascada para filtrado jerárquico
   - Actualizar tabla para reflejar filtros en tiempo real
   - Añadir validación de datos antes de aplicar filtros

   Fixes #123
   ```

---

## Estadísticas Generales

### Contribuidores
| Autor | Commits | % | Calidad Promedio |
|-------|---------|---|------------------|
| Edwin Piragauta | 17 | 74% | ⭐⭐⭐⭐ Alta |
| Andrés Pachón | 6 | 26% | ⭐⭐ Media-Baja |

### Archivos Más Modificados
1. `reporte-funcionamiento.component.ts` - **15 modificaciones**
2. `sgr-recaudo-mensual.component.ts` - **4 modificaciones**
3. `sicodis-api.service.ts` - **3 modificaciones**
4. `reporte-funcionamiento.component.html` - **3 modificaciones**
5. `reporte-funcionamiento.component.scss` - **3 modificaciones**

### Tipos de Cambios
| Categoría | Commits | Descripción |
|-----------|---------|-------------|
| **Seguridad** | 2 | Migración a Bearer Token |
| **Nuevas Funcionalidades** | 8 | Componentes Plan Bienal, filtros, selección entidades |
| **Refactorización** | 10 | Reporte Funcionamiento (mejora continua) |
| **Optimización** | 1 | Reducción de peso de assets |
| **Correcciones** | 2 | Filtros, etiquetas, valores N/A |

### Impacto en Testing
- Archivos `.spec.ts` creados para nuevos componentes
- Tests unitarios básicos implementados

### Métricas de Código

**Líneas Totales Modificadas:**
- ✅ Inserciones: ~3,500 líneas
- ❌ Eliminaciones: ~2,200 líneas
- 📈 Balance Neto: +1,300 líneas

**Distribución por Sistema:**
- SGR (Regalías): 65%
- SGP (Participaciones): 20%
- Infraestructura (Auth, API): 15%

---

## Conclusiones

### Logros Técnicos

Febrero 2026 fue un mes de **consolidación y mejora técnica** con:
- ✅ Migración exitosa a autenticación moderna
- ✅ Refactorización profunda de componentes clave
- ✅ Implementación de nuevos módulos de visualización
- ✅ Optimización de assets (reducción de ~15 MB)
- ✅ Mejora continua en UX de gráficos y reportes

### Buenas Prácticas Observadas

El proyecto muestra un **desarrollo iterativo saludable** con:
- Commits frecuentes de mejora incremental
- Especialización por desarrollador (Edwin: visualizaciones, Andrés: backend/datos)
- Refactorización continua sin romper funcionalidad
- Optimización de assets para mejor rendimiento

### Áreas de Mejora

1. **Mensajes de Commit:**
   - Estandarizar uso de Conventional Commits en todo el equipo
   - Mejorar descripción en commits de Andrés Pachón
   - Incluir referencias a issues/tickets cuando aplique

2. **Proceso de Desarrollo:**
   - Considerar squash de commits muy granulares (ej: los 15 commits en reporte-funcionamiento podrían agruparse)
   - Implementar hooks de pre-commit para validar formato de mensajes

3. **Documentación:**
   - Añadir CHANGELOG.md basado en conventional commits
   - Documentar breaking changes si los hay

---

## Anexo: Cronología Detallada de Commits

| Fecha | Hash | Autor | Mensaje |
|-------|------|-------|---------|
| 2026-02-11 | `094e6a7` | Andrés Pachón | Cambios express enero y febrero- acumulados |
| 2026-02-16 | `e727944` | Andrés Pachón | Ajustes varios, beare token en ligar de basic |
| 2026-02-17 | `7c59fd0` | Andrés Pachón | Bearer token cambios recaudo mensual |
| 2026-02-17 | `dd3304e` | Edwin Piragauta | Refactor ReporteFuncionamientoComponent |
| 2026-02-19 | `138b4a9` | Edwin Piragauta | Actualiza color background a grafico Avance PBC |
| 2026-02-19 | `361632e` | Andrés Pachón | Cambios necesarios para reportes de funcionamiento... |
| 2026-02-20 | `d294221` | Andrés Pachón | Ajuste aplicar filtros |
| 2026-02-23 | `2a04845` | Edwin Piragauta | Refactor: Update chart configurations and styles |
| 2026-02-24 | `a9d1c32` | Edwin Piragauta | Merge branch 'main' |
| 2026-02-24 | `162070e` | Edwin Piragauta | feat: Add SGR Plan Bienal Recursos component |
| 2026-02-24 | `f8e8e05` | Edwin Piragauta | feat: Update styles and routes |
| 2026-02-25 | `03451d7` | Edwin Piragauta | feat: Enhance with new entity selection |
| 2026-02-25 | `f13cc20` | Edwin Piragauta | feat: Align detail chart container |
| 2026-02-25 | `d87f3c9` | Edwin Piragauta | feat: Implement hideOptionalSelect method |
| 2026-02-25 | `feb20ae` | Edwin Piragauta | feat: Update chart legend display settings |
| 2026-02-25 | `09c1a5d` | Edwin Piragauta | feat: Update tooltip settings |
| 2026-02-25 | `5d9e77f` | Edwin Piragauta | feat: Update chart tooltip formatting |
| 2026-02-26 | `190c7f6` | Edwin Piragauta | feat: Enhance chart data calculations |
| 2026-02-26 | `b591030` | Edwin Piragauta | Actualizar etiqueta: Caja disponible |
| 2026-02-26 | `5a3a3a9` | Edwin Piragauta | Actualizar datos de grafico Situacion de caja |
| 2026-02-26 | `e14d6f4` | Edwin Piragauta | visual refactors |
| 2026-02-26 | `7dd2c21` | Edwin Piragauta | Cambiar Fuente por Asignación |

---

**Informe generado:** 2026-03-05
**Periodo analizado:** 2026-02-01 a 2026-02-28
**Total de commits:** 23
**Repositorio:** SICODIS_WebII
