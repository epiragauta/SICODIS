# SGR - Información General

**Módulo**: `sgr-informacion-general`  
**Sistema**: SICODIS Web II  
**Última actualización**: 2026-06-22

---

## 📋 Tabla de Contenidos

1. [¿Qué es este módulo?](#qué-es-este-módulo)
2. [Origen de los Datos](#origen-de-los-datos)
3. [Funcionalidades Principales](#funcionalidades-principales)
4. [Arquitectura Técnica](#arquitectura-técnica)
5. [Mejoras Planificadas](#mejoras-planificadas)
6. [Guía de Uso](#guía-de-uso)

---

## 🎯 ¿Qué es este módulo?

El módulo **Información General del SGR** es un componente interactivo de consulta y visualización que permite a los usuarios del SICODIS explorar datos consolidados del **Sistema General de Regalías (SGR)** para el bienio 2025-2026.

### Propósito

Responder preguntas clave sobre la distribución y ejecución de recursos del SGR:

- **¿Cuánto presupuesto se ha asignado?** Por concepto, región, tipo de entidad
- **¿Cuánto se ha recaudado?** Avance de recaudo corriente vs otros componentes
- **¿Qué entidades se benefician?** Municipios, gobernaciones, corporaciones, comunidades étnicas
- **¿Cuál es el avance de ejecución?** Porcentaje de recaudo vs presupuesto
- **¿Cómo se distribuye geográficamente?** Por región, departamento, tipo de territorio

### Usuarios Objetivo

- **Funcionarios del DNP**: Seguimiento y monitoreo de regalías
- **Gobiernos Territoriales**: Alcaldías, gobernaciones consultando su asignación
- **Ciudadanía**: Transparencia en la distribución de recursos del SGR
- **Investigadores**: Análisis de datos de regalías

---

## 📊 Origen de los Datos

### Fuente Original

Los datos provienen del archivo Excel oficial:
```
PresupuestovsRecaudo_bienio_2025-2026.xlsx
```

**Contenido del archivo:**
- **6,963 registros** de presupuesto y recaudo
- **33 columnas** incluyendo 13 componentes de presupuesto y 2 de recaudo
- **Vigencia**: Bienio 2025-2026
- **Actualización**: Mensual

### Proceso de Normalización

El archivo Excel fue procesado mediante un pipeline de normalización ubicado en:
```
C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\
```

**Scripts ejecutados:**
1. `01_crear_base_sqlite.py` - Creó estructura de base de datos
2. `02_cargar_datos_sqlite.py` - ETL Excel → SQLite (normalización)
3. `03_generar_json_prototipo.py` - SQLite → JSON para Angular
4. `04_validar_datos.py` - Validación de integridad (100% exactitud)

**Salidas generadas:**
```
json_output/
├── entidades.json (529 KB)           - 1,238 entidades
├── presupuesto_detalle.json (7.0 MB) - 6,963 registros
├── jerarquias.json (21 KB)           - 1,120 relaciones
└── resumen_agregado.json (13 KB)     - Totales pre-calculados
```

### Totales Nacionales (Bienio 2025-2026)

| Métrica | Valor |
|---------|-------|
| **Presupuesto Total** | $67.3 billones COP |
| **Caja Total (Recaudo)** | $54.9 billones COP |
| **Avance Promedio** | 74.92% |
| **Entidades Beneficiarias** | 1,238 |

### Distribución de Entidades

| Tipo | Cantidad |
|------|----------|
| Municipios | 1,103 |
| Gobernaciones | 32 |
| Otros | 76 |
| Corporaciones | 9 |
| Regiones | 6 |
| Étnicos | 3 |
| Agrupadores | 9 |

### Decisiones de Diseño en la Normalización

**Datos Almacenados (Base):**
- ✅ 13 componentes de presupuesto (corriente, disponibilidad inicial, rendimientos, etc.)
- ✅ 2 componentes de recaudo (corriente, otros)
- ✅ Atributos de entidad (productor, PDET, ZOMAC, capital)

**Datos Calculados (Derivados):**
- ⚙️ Presupuesto Total = Suma de 13 componentes
- ⚙️ Caja Total = Recaudo Corriente + Recaudo Otros
- ⚙️ Avance Total = Caja / Presupuesto
- ⚙️ Avance Recaudo Corriente = Recaudo Corriente / Presupuesto Corriente

**Razón**: Los datos derivados se calculan en tiempo real (frontend con TypeScript) para evitar inconsistencias y redundancia.

---

## 🚀 Funcionalidades Principales

### 1. KPIs Principales (Tarjetas Superiores)

Tres indicadores clave que se actualizan dinámicamente según los filtros aplicados:

#### KPI 1: Presupuesto
- **Opciones**: Total, Corriente, Otros
- **Cálculo**:
  - Total = Suma de 13 componentes de presupuesto
  - Corriente = Componente de presupuesto corriente
  - Otros = Total - Corriente

#### KPI 2: Recaudo
- **Opciones**: Total, Corriente, Otros
- **Cálculo**:
  - Total = Recaudo Corriente + Recaudo Otros
  - Corriente = Componente de recaudo corriente
  - Otros = Componente de recaudo otros

#### KPI 3: Avance de Recaudo
- **Fórmula**: `(Recaudo seleccionado / Presupuesto seleccionado) × 100`
- **Ejemplo**:
  - Si Presupuesto = "Corriente" y Recaudo = "Corriente"
  - Avance = (Recaudo Corriente / Presupuesto Corriente) × 100

### 2. Conteo de Entidades (5 Tarjetas)

Muestra el número de entidades que cumplen con los filtros aplicados:

1. **Beneficiarias**: Total de entidades filtradas
2. **Productoras**: Entidades productoras de hidrocarburos
3. **ZOMAC**: Zonas Más Afectadas por el Conflicto
4. **PDET**: Programas de Desarrollo con Enfoque Territorial
5. **Entidades con Destinación Étnica**: Proyectos dirigidos a comunidades étnicas

### 3. Sistema de Filtros

#### 3.1 Periodicidad
- **Opciones**: Mensual, Anual, Bienal
- **Selectores dinámicos**:
  - Bienal: Dropdown con bienios (2025-2026, 2023-2024, ..., 2013-2014)
  - Anual: Dropdown con años (2025-2014)
  - Mensual: Dos dropdowns (Año + Mes)

#### 3.2 Caracterización de la Consulta

**Columna Izquierda** (Tipo de caracterización):
- Concepto de Gasto
- Regional
- Asignación
- Grupo de Interés

**Selector de valores** (actualmente `p-dropdown`, planificado `p-multiselect`):

##### Concepto de Gasto
- Todos
- Inversión
- Ahorro
- Administración

##### Regional
- Todos
- Región Eje Cafetero
- Región Caribe
- Región Centro - Oriente
- Región Centro - Sur
- Región Pacífico
- Región del Llano

##### Asignación (14 opciones)
- Asignación Paz
- Asignaciones Directas (20% del SGR)
- Asignación para la Inversión Regional - Departamentos
- Asignación para la Ciencia, Tecnología e Innovación
- Fondo de Ahorro y Estabilización (FAE)
- Fondo Nacional de Pensiones (FONPET)
- Funcionamiento y administración del sistema
- Y 7 más...

##### Grupo de Interés (5 opciones)
- Otros
- Productores
- PDET
- ZOMAC
- Municipios Categoría 4, 5, y 6

**Columna Derecha** (Filtros de entidad - radio buttons):
- Beneficiario
- Productoras
- PDET
- ZOMAC
- Étnica
- Capital

#### 3.3 Presupuesto y Recaudo Seleccionados

Radio buttons para cambiar la métrica visualizada en los KPIs:

**Presupuesto**:
- Total (predeterminado)
- Corriente
- Otros

**Recaudo**:
- Total (predeterminado)
- Corriente
- Otros

---

## 🏗️ Arquitectura Técnica

### Componentes del Sistema

```
┌─────────────────────────────────────────────────────────┐
│  USUARIO                                                │
│  └─> Selecciona filtros en UI                          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  COMPONENTE: sgr-informacion-general.component.ts       │
│  - Gestiona estado de filtros                          │
│  - Aplica filtros vía servicio                         │
│  - Calcula KPIs dinámicos (getters)                    │
│  - Actualiza visualización                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  SERVICIO: SgrPresupuestoService                        │
│  - Carga datos desde JSON (HttpClient)                 │
│  - Aplica filtros (FiltrosSGR)                         │
│  - Retorna datos agregados (DatosAgregados)            │
│  - Cache con shareReplay()                             │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│  ARCHIVOS JSON (src/assets/data/sgr/)                  │
│  - entidades.json (1,238 entidades)                    │
│  - presupuesto_detalle.json (6,963 registros)          │
│  - jerarquias.json (1,120 relaciones)                  │
│  - resumen_agregado.json (totales pre-calculados)      │
└─────────────────────────────────────────────────────────┘
```

### Archivos Clave

#### 1. Modelos TypeScript
**Ubicación**: `src/app/models/sgr-presupuesto.models.ts`

```typescript
// Interfaces principales
export interface Entidad { ... }
export interface RegistroPresupuesto { ... }
export interface FiltrosSGR { ... }
export interface DatosAgregados { ... }

// Clase de utilidades
export class PresupuestoUtils {
  static calcularPresupuestoTotal(componentes): number
  static calcularCajaTotal(recaudo): number
  static calcularAvanceTotal(presupuesto, recaudo): number
  static formatearMoneda(valor): string
  static formatearPorcentaje(decimal): string
}
```

#### 2. Servicio
**Ubicación**: `src/app/services/sgr-presupuesto.service.ts`

**Métodos principales:**
- `getEntidades()` - Carga catálogo de entidades
- `getPresupuesto()` - Carga datos de presupuesto/recaudo
- `getResumen()` - Carga totales agregados
- `getDatosAgregados(filtros?: FiltrosSGR)` - Aplica filtros y retorna datos procesados

#### 3. Componente
**Ubicación**: `src/app/components/sgr-informacion-general/`

**Archivos:**
- `sgr-informacion-general.component.ts` - Lógica del componente
- `sgr-informacion-general.component.html` - Template
- `sgr-informacion-general.component.scss` - Estilos

**Propiedades clave:**
```typescript
// Filtros
periodicidad: string = 'Bienal'
caracterizacionSeleccionada: string = 'grupoInteres'
valorCaracterizacionSeleccionado: string = 'Otros'
entidadSeleccionada: string = 'beneficiario'
presupuestoSeleccionado: string = 'total'
recaudoSeleccionado: string = 'total'

// Datos
entidadesCount: EntidadCount
presupuestoMetricas: PresupuestoMetricas
recaudoMetricas: RecaudoMetricas

// Getters dinámicos
get presupuestoKPI(): number
get recaudoKPI(): number
get avanceRecaudoKPI(): number
```

### Flujo de Datos

1. **Inicialización** (`ngOnInit`):
   ```typescript
   loadData() // Carga datos con filtros iniciales
   ```

2. **Usuario cambia filtro**:
   ```typescript
   onCaracterizacionChange() → loadData() → sgrPresupuestoService.getDatosAgregados(filtros)
   ```

3. **Servicio procesa**:
   ```typescript
   - Lee JSON cacheado
   - Filtra registros por caracterización y entidad
   - Calcula agregados (suma presupuesto, recaudo, conteo de entidades)
   - Retorna DatosAgregados
   ```

4. **Componente actualiza**:
   ```typescript
   - Actualiza entidadesCount
   - Actualiza presupuestoMetricas
   - Actualiza recaudoMetricas
   - Los getters recalculan KPIs automáticamente
   ```

---

## ✅ Mejoras Implementadas

### 1. Filtros de Caracterización No Excluyentes

**Estado**: ✅ **IMPLEMENTADO** (2026-06-19)

**Funcionalidad**:
- ✅ Cambio de `p-dropdown` a `p-multiselect` de PrimeNG
- ✅ Permite selección múltiple de valores dentro de cada caracterización
- ✅ Los valores seleccionados se muestran como chips dentro del multiselect
- ✅ Filtro con búsqueda para listas largas (>10 opciones)
- ✅ Botón de limpiar para remover todas las selecciones

**Ejemplo de uso**:
Usuario puede seleccionar múltiples opciones:
- **Concepto de Gasto**: "Inversión" + "Ahorro" (2 valores)
- **Regional**: "Región Caribe" + "Región Pacífico" (2 valores)
- **Grupo de Interés**: "Municipio" + "Gobernación" (2 valores)

**Características del MultiSelect**:
- Modo de visualización: `display="comma"` (valores separados por comas - más compacto)
- Máximo de etiquetas visibles: 2 (después muestra "X seleccionados")
- Ancho responsivo: full-width en móvil, 320px fijo en desktop (`w-full md:w-80`)
- `displaySelectedLabel="false"` para ocultar etiqueta redundante
- Filtro integrado para búsqueda rápida (solo en listas largas como Asignación)
- Botón de limpiar integrado

**Beneficio**: Consultas más granulares y análisis cruzados entre múltiples dimensiones

### 2. Trazabilidad de Filtros

**Estado**: ✅ **IMPLEMENTADO** (2026-06-19)

**Funcionalidad**:
- ✅ Área dedicada "Filtros aplicados" con chips visuales
- ✅ Cada filtro activo se muestra como un chip con:
  - Icono identificador del tipo de filtro
  - Tipo de filtro (ej: "Concepto de Gasto")
  - Valor del filtro (ej: "Inversión")
  - Botón × para remover individualmente
- ✅ Botón "Limpiar todos" para resetear todos los filtros
- ✅ Filtros permanentes (Periodicidad) sin botón de remover
- ✅ Actualización automática de datos al remover filtros

**Ejemplo visual real implementado**:
```
┌─────────────────────────────────────────────────────┐
│ 🎯 Filtros aplicados              [Limpiar todos]  │
├─────────────────────────────────────────────────────┤
│ [📅 Periodicidad: Bienal: 2025-2026]               │
│ [🔍 Concepto de Gasto: Inversión] [×]              │
│ [🗺️ Regional: Región Caribe] [×]                   │
│ [👥 Entidad: PDET] [×]                             │
│ [💵 Presupuesto: Corriente] [×]                    │
└─────────────────────────────────────────────────────┘
```

**Estilos visuales**:
- Chips con gradiente magenta-púrpura para filtros aplicados
- Chip con gradiente teal-cyan para periodicidad (no removible)
- Efecto hover con elevación y sombra
- Botones de remover con fondo semi-transparente

**Métodos implementados**:
```typescript
// Getter que retorna array de filtros activos
get filtrosActivos(): Array<{tipo: string, valor: string, icono: string}>

// Remover filtro individual
removerFiltro(filtro: {tipo: string, valor: string}): void

// Limpiar todos los filtros (excepto periodicidad)
limpiarTodosFiltros(): void
```

**Beneficio**: Mejor UX - usuario ve claramente qué filtros están activos y puede removerlos fácilmente

### 3. Sistema de Diseño Cívico (Civic Design)

**Estado**: ✅ **IMPLEMENTADO** (2026-06-20)

**Contexto y Motivación**:
Los datos fiscales gubernamentales requieren un lenguaje visual autoritativo y confiable. El sistema de diseño anterior utilizaba una paleta vibrante (magenta/púrpura) más apropiada para aplicaciones comerciales. Se implementó un sistema de diseño cívico que transmite profesionalismo institucional.

**Paleta de Colores Cívicos**:
```scss
$civic-navy: #1e3a5f;      // Principal - autoridad institucional
$civic-navy-dark: #14293f; // Navy oscuro para hover/active
$civic-gold: #d4a655;      // Acento - riqueza mineral colombiana
$civic-slate: #64748b;     // Texto/bordes secundarios
$civic-steel: #4a5f7a;     // Texto secundario
$civic-cloud: #f1f5f9;     // Fondo alternativo
$alert-amber: #f59e0b;     // Acciones de remoción
```

**Cambios Visuales**:

**Chips de Filtros - Estilo Ledger/Libro Contable**:
- Fondo blanco con borde izquierdo de acento (en lugar de gradientes vibrantes)
- Borde dorado (#d4a655) para filtros removibles
- Borde navy (#1e3a5f) para filtros permanentes (Periodicidad)
- Border-radius mínimo (2px) para estética de contabilidad/ledger
- Tipografía estructurada: labels en uppercase, formato tipo:valor
- Botón remover: borde amber outlined con fill en hover

**Tarjetas KPI y Entidades**:
- Borde superior dorado en lugar de gradientes
- Colores navy para títulos y texto principal
- Sombras sutiles (0 2px 8px rgba(0, 0, 0, 0.08))

**Botones**:
- "Limpiar todos" → "Remover todos los filtros" (texto más explícito)
- Icono cambiado: pi-times-circle → ⟲ (símbolo de reset)
- Estilo: outlined transparent con borde civic-slate
- Hover: acento amber para affordance clara

**Layout Reorganizado**:
- Grid de filtros: 4 columnas → 3 columnas
- "Presupuesto de consulta" y "Recaudo" combinados en un solo panel vertical
- Más ancho para sección "Caracterización de la consulta"
- Etiqueta del slider dividida en dos líneas para display más compacto

**Clases CSS Nuevas**:
- `.presupuesto-recaudo-box` - Panel combinado de presupuesto y recaudo
- `.seccion-separador` - Separador visual entre secciones
- `.slider-label-multiline` - Label del slider en dos líneas
- Variables SCSS semánticas para toda la paleta

**Beneficio**: Lenguaje visual coherente con la naturaleza institucional de SICODIS. Mayor confianza y profesionalismo percibido por usuarios gubernamentales.

### 4. Mejoras de Responsividad y UX del MultiSelect

**Estado**: ✅ **IMPLEMENTADO** (2026-06-21)

**Contexto**:
Complementa el sistema de diseño cívico con mejoras técnicas en los componentes p-multiselect para prevenir problemas de expansión de ancho y mejorar la experiencia en dispositivos móviles.

**Cambios Implementados**:

**Modo de Display**:
- Cambio de `display="chip"` → `display="comma"` en los 4 multiselects
- Display separado por comas es más compacto y eficiente en espacio
- Previene expansión horizontal causada por renderizado de chips

**Ancho Responsivo**:
- Clases Tailwind: `w-full md:w-80`
- Móvil: ancho completo (w-full)
- Desktop: ancho fijo 320px (md:w-80)
- Consistencia de tamaño en todos los breakpoints

**Mejoras UX**:
- `[displaySelectedLabel]="false"` - Oculta etiqueta redundante
- `selectedItemsLabel="{0} seleccionados"` - Muestra conteo de items
- `[maxSelectedLabels]="2"` - Muestra primeros 2 items antes de mostrar conteo
- Prevención de expansión de width en selección de items

**Multiselects Afectados**:
1. Concepto de Gasto
2. Regional
3. Asignación
4. Grupo de Interés

**Beneficio**: Comportamiento más predecible y compacto del multiselect. Mejor experiencia en mobile y prevención de problemas de layout causados por expansión dinámica.

### 5. Campos Relacionados con el Procesamiento de Datos

Los filtros actuales están basados en los campos del archivo Excel normalizado:

**Campos de Caracterización** (columnas en `presupuesto_detalle.json`):
- `conceptoGasto` - Inversión, Ahorro, Administración
- `concepto` - Asignación específica (14 opciones)
- Campo calculado `region` - De la tabla entidades
- `destinacionEtnica` - Boolean (true/false)

**Campos de Entidad** (atributos en `entidades.json`):
- `atributos.esProductor` - Boolean
- `atributos.esPdet` - Boolean
- `atributos.esZomac` - Boolean
- `atributos.esCapital` - Boolean
- `tipo` - Municipio, Gobernación, Corporación, Étnicos, Otros, Región

**Relación con FiltrosSGR:**
```typescript
interface FiltrosSGR {
  periodicidad?: string;
  tipoEntidad?: string;        // Tipo de entidad
  region?: string;              // Regional
  productor?: boolean | null;   // Productoras
  pdet?: boolean | null;        // PDET
  zomac?: boolean | null;       // ZOMAC
  conceptoGasto?: string;       // Concepto de Gasto
  destinacionEtnica?: boolean;  // Étnica
}
```

---

## 📖 Guía de Uso

### Para Usuarios Finales

#### Caso de Uso 1: Consultar presupuesto de municipios PDET

1. **Periodicidad**: Seleccionar "Bienal" → "2025-2026"
2. **Caracterización**: Seleccionar "Grupo de Interés" → "PDET"
3. **Entidad**: Seleccionar "PDET"
4. **Presupuesto**: Mantener "Total" (o cambiar a "Corriente")
5. **Resultado**: Los KPIs mostrarán datos solo de municipios PDET

#### Caso de Uso 2: Analizar recaudo en la Región Caribe

1. **Periodicidad**: Seleccionar "Bienal" → "2025-2026"
2. **Caracterización**: Seleccionar "Regional" → "Región Caribe"
3. **Recaudo**: Seleccionar "Corriente"
4. **Resultado**: KPI de recaudo mostrará solo recaudo corriente de la Región Caribe

#### Caso de Uso 3: Comparar presupuesto corriente vs otros

1. **Periodicidad**: "Bienal" → "2025-2026"
2. **Presupuesto**: Seleccionar "Corriente"
3. **Observar**: KPI de Presupuesto muestra presupuesto corriente
4. **Cambiar a**: "Otros"
5. **Observar**: Diferencia entre componentes

### Para Desarrolladores

#### Agregar un nuevo filtro

1. **Agregar opción en template**:
   ```html
   <div class="radio-item">
     <p-radiobutton name="caracterizacion" value="nuevoFiltro" />
     <label>Nuevo Filtro</label>
   </div>
   ```

2. **Agregar opciones del filtro**:
   ```typescript
   nuevoFiltroOpciones = [
     { label: 'Opción 1', value: 'valor1' },
     { label: 'Opción 2', value: 'valor2' }
   ];
   ```

3. **Actualizar método loadData()**:
   ```typescript
   if (this.caracterizacionSeleccionada === 'nuevoFiltro') {
     filtros.nuevoCampo = this.valorCaracterizacionSeleccionado;
   }
   ```

4. **Actualizar interfaz FiltrosSGR**:
   ```typescript
   export interface FiltrosSGR {
     // ... filtros existentes
     nuevoCampo?: string;
   }
   ```

5. **Actualizar servicio** (`sgr-presupuesto.service.ts`):
   ```typescript
   if (filtros.nuevoCampo) {
     registrosFiltrados = registrosFiltrados.filter(
       r => r.nuevoCampo === filtros.nuevoCampo
     );
   }
   ```

#### Calcular nueva métrica

1. **Agregar getter en componente**:
   ```typescript
   get nuevaMetricaKPI(): number {
     // Lógica de cálculo
     return this.presupuestoMetricas.presupuestoTotal / 1000000;
   }
   ```

2. **Usar en template**:
   ```html
   <div class="kpi-card">
     <h3>Nueva Métrica</h3>
     <p class="kpi-value">{{ nuevaMetricaKPI | numberFormat }}</p>
   </div>
   ```

---

## 📚 Referencias

### Documentación Relacionada

- **Integración de Datos**: [docs/sgr/integracion/INTEGRACION_SGR_COMPLETADA.md](./integracion/INTEGRACION_SGR_COMPLETADA.md)
- **Destinación Étnica**: [docs/sgr/integracion/DESTINACION_ETNICA.md](./integracion/DESTINACION_ETNICA.md)
- **Uso del Servicio**: [docs/sgr/integracion/README_INTEGRACION.md](./integracion/README_INTEGRACION.md)

### Procesamiento de Datos

- **Plan de Normalización**: `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\PLAN_NORMALIZACION_BIENIO_2025-2026.md`
- **Resumen Normalización**: `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\RESUMEN_NORMALIZACION_COMPLETADA.md`
- **Decisiones de Diseño**: `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\DECISIONES_NORMALIZACION.md`

### Código Fuente

- **Componente**: `src/app/components/sgr-informacion-general/`
- **Servicio**: `src/app/services/sgr-presupuesto.service.ts`
- **Modelos**: `src/app/models/sgr-presupuesto.models.ts`
- **Datos**: `src/assets/data/sgr/*.json`

---

**Creado**: 2026-06-19  
**Última actualización**: 2026-06-22  
**Autor**: Equipo SICODIS  
**Versión**: 1.2

**Historial de Cambios**:
- **v1.2** (2026-06-22): Documentación de mejoras de responsividad en multiselect
- **v1.1** (2026-06-20): Documentación del sistema de diseño cívico y reorganización de layout
- **v1.0** (2026-06-19): Versión inicial - filtros multiselect y trazabilidad
