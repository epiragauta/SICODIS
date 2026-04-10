# 3.1. SGP Resumen

## Información del Documento
- **Módulo**: SGP Resumen
- **Ruta de acceso**: `/sgp-inicio`
- **Componente Angular**: `sgp-inicio`
- **Última actualización**: Ver [CHANGELOG.md](../CHANGELOG.md)
- **Versión**: 1.0.0

## Tabla de Contenidos
- [Propósito del Módulo](#propósito-del-módulo)
- [Datos que Visualiza](#datos-que-visualiza)
- [Controles y Filtros](#controles-y-filtros)
- [Visualizaciones](#visualizaciones)
- [Funcionalidades de Exportación](#funcionalidades-de-exportación)
- [Interpretación Técnica](#interpretación-técnica)
- [Casos de Uso](#casos-de-uso)
- [Ver También](#ver-también)

---

## Propósito del Módulo

El módulo **SGP Resumen** es la vista principal de entrada al sistema de consultas del Sistema General de Participaciones. Proporciona una visión general consolidada de las participaciones transferidas a una entidad territorial específica durante una vigencia determinada.

### Objetivos
- Presentar el **resumen global** de recursos SGP por entidad territorial
- Mostrar la **estructura jerárquica** de conceptos (Educación, Salud, Agua, Propósito General)
- Permitir consultas rápidas por **año, departamento y municipio**
- Facilitar la **descarga de datos** para análisis offline

### Usuarios Objetivo
- Funcionarios de entidades territoriales (alcaldías, gobernaciones)
- Analistas del DNP
- Investigadores y académicos
- Ciudadanía en general (transparencia)

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API**: `/api/sgp/resumen-participaciones`

**Método**: `GET /api/sgp/resumen-participaciones/{anio}/{codigoDepto}/{codigoMunicipio}`

**Parámetros**:
- `anio`: Vigencia fiscal (2021-2026)
- `codigoDepto`: Código DANE del departamento (2 dígitos)
- `codigoMunicipio`: Código DANE del municipio (5 dígitos)

### Estructura de Datos

El módulo muestra datos organizados jerárquicamente:

```
SGP TOTAL
├── EDUCACIÓN
│   ├── Prestación del Servicio
│   ├── Calidad - Gratuidad
│   ├── Calidad - Matrícula Oficial
│   └── Primera Infancia (si aplica)
├── SALUD
│   ├── Régimen Subsidiado - Continuidad
│   ├── Régimen Subsidiado - Ampliación
│   ├── Salud Pública Colectiva
│   └── Prestación de Servicios (si aplica)
├── AGUA POTABLE Y SANEAMIENTO BÁSICO
│   ├── Agua Potable
│   ├── Saneamiento Básico
│   └── Preinversión
└── PROPÓSITO GENERAL
    ├── Libre Inversión
    ├── Forzosa Inversión - Deporte
    ├── Forzosa Inversión - Cultura
    ├── Forzosa Inversión - Alimentación Escolar
    ├── Forzosa Inversión - Ribereños
    ├── Forzosa Inversión - Resguardos Indígenas
    └── Fonpet
```

### Campos Visualizados

Cada concepto muestra:
- **Concepto**: Nombre del rubro (jerárquico con numeración 1, 1.1, 1.1.1)
- **Valor Asignado**: Monto en pesos colombianos ($)
- **Porcentaje del Total**: Participación relativa respecto al total SGP

---

## Controles y Filtros

![Filtros SGP Resumen](../assets/sgp-resumen-filtros.png)
*Placeholder: Captura de pantalla mostrando los selectores de Año, Departamento y Municipio*

### Panel de Filtros

#### 1. Selector de Vigencia
**Control**: Dropdown (select)

**Valores disponibles**: 2021, 2022, 2023, 2024, 2025, 2026

**Comportamiento**:
- Valor por defecto: Vigencia más reciente disponible (2026)
- Al cambiar, recarga datos automáticamente
- Actualiza el título del reporte

#### 2. Selector de Departamento
**Control**: Dropdown con búsqueda (PrimeNG p-dropdown)

**Valores**:
- Lista completa de 32 departamentos + Bogotá D.C.
- Ordenados alfabéticamente
- Incluye código DANE (2 dígitos)

**Comportamiento**:
- Al seleccionar, carga municipios del departamento
- Resetea la selección de municipio
- Si selecciona "Nacional" o código "0", muestra consolidado nacional

**Ejemplo de valores**:
```
05 - Antioquia
08 - Atlántico
11 - Bogotá D.C.
13 - Bolívar
...
```

#### 3. Selector de Municipio
**Control**: Dropdown con búsqueda (filtrable)

**Valores**:
- Lista de municipios del departamento seleccionado
- Ordenados alfabéticamente
- Incluye código DANE (5 dígitos)

**Comportamiento**:
- Deshabilitado hasta que se seleccione departamento
- Búsqueda incremental (filtro local)
- Al seleccionar, recarga datos del municipio

**Opción especial**:
- **"Todos los municipios" (código 000 o -1)**: Muestra consolidado departamental

**Ejemplo de valores** (para Antioquia):
```
05001 - Medellín
05002 - Abejorral
05004 - Abriaquí
...
```

### Flujo de Interacción

```
1. Usuario selecciona Año (ej: 2025)
   ↓
2. Usuario selecciona Departamento (ej: 05 - Antioquia)
   → Sistema carga municipios de Antioquia
   ↓
3. Usuario selecciona Municipio (ej: 05001 - Medellín)
   → Sistema carga datos de Medellín para 2025
   ↓
4. Se renderiza tabla jerárquica con resumen
```

---

## Visualizaciones

### 1. Tabla Jerárquica (TreeTable)

**Componente**: PrimeNG TreeTable

![Tabla Jerárquica SGP](../assets/sgp-resumen-tabla.png)
*Placeholder: Captura de pantalla de la tabla jerárquica expandida mostrando todos los niveles*

**Características**:
- **Niveles jerárquicos**: Hasta 3 niveles de profundidad
- **Expansión/Colapso**: Icono de flecha para expandir nodos
- **Totales automáticos**: Suma de hijos en nodos padre
- **Formato numérico**: Separador de miles (punto), sin decimales

**Columnas**:

| Columna | Descripción | Formato | Ancho |
|---------|-------------|---------|-------|
| **Concepto** | Nombre del rubro | Texto indentado | 60% |
| **Valor Asignado** | Monto en pesos | `$123.456.789` | 30% |
| **% del Total** | Porcentaje | `12.5%` | 10% |

**Ejemplo de datos visualizados**:

```
┌─────────────────────────────────────────────┬──────────────────┬──────────┐
│ Concepto                                    │ Valor Asignado   │ % Total  │
├─────────────────────────────────────────────┼──────────────────┼──────────┤
│ ▼ 1. TOTAL SGP                              │ $1.234.567.890   │ 100.0%   │
│   ▼ 1.1. EDUCACIÓN                          │ $722.222.222     │  58.5%   │
│     • 1.1.1. Prestación del Servicio        │ $600.000.000     │  48.6%   │
│     • 1.1.2. Calidad - Gratuidad            │ $100.000.000     │   8.1%   │
│     • 1.1.3. Calidad - Matrícula Oficial    │  $22.222.222     │   1.8%   │
│   ▼ 1.2. SALUD                              │ $302.469.135     │  24.5%   │
│     • 1.2.1. Régimen Subsidiado - Cont.     │ $250.000.000     │  20.2%   │
│     • 1.2.2. Salud Pública                  │  $52.469.135     │   4.3%   │
│   ▶ 1.3. AGUA POTABLE                       │  $66.666.666     │   5.4%   │
│   ▶ 1.4. PROPÓSITO GENERAL                  │ $143.209.867     │  11.6%   │
└─────────────────────────────────────────────┴──────────────────┴──────────┘
```

**Iconografía**:
- **▼**: Nodo expandido (tiene hijos visibles)
- **▶**: Nodo colapsado (tiene hijos ocultos)
- **•**: Nodo hoja (sin hijos)

### 2. Indicadores Resumen (Cards)

**Ubicación**: Encima de la tabla

![Cards Resumen](../assets/sgp-resumen-cards.png)
*Placeholder: Tarjetas informativas con indicadores clave*

**Indicadores mostrados**:

#### Card 1: Total SGP Asignado
```
┌──────────────────────────────────┐
│  💰 Total SGP                    │
│                                  │
│  $1.234.567.890                  │
│  Vigencia 2025                   │
└──────────────────────────────────┘
```

#### Card 2: Mayor Asignación Sectorial
```
┌──────────────────────────────────┐
│  📊 Mayor Asignación             │
│                                  │
│  EDUCACIÓN                       │
│  $722.222.222 (58.5%)            │
└──────────────────────────────────┘
```

#### Card 3: Entidad Consultada
```
┌──────────────────────────────────┐
│  📍 Entidad                      │
│                                  │
│  Medellín                        │
│  05001 - Antioquia               │
└──────────────────────────────────┘
```

### 3. Gráfico de Distribución por Componente

**Tipo de gráfico**: Gráfico de torta (Pie Chart)

**Librería**: Chart.js

![Gráfico Distribución SGP](../assets/sgp-resumen-grafico.png)
*Placeholder: Gráfico circular mostrando los 4 componentes del SGP con porcentajes*

**Configuración**:
```javascript
{
  type: 'pie',
  data: {
    labels: ['Educación', 'Salud', 'Agua Potable', 'Propósito General'],
    datasets: [{
      data: [58.5, 24.5, 5.4, 11.6],
      backgroundColor: [
        '#4CAF50',  // Verde - Educación
        '#2196F3',  // Azul - Salud
        '#00BCD4',  // Cyan - Agua
        '#FF9800'   // Naranja - Propósito General
      ]
    }]
  },
  options: {
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  }
}
```

**Interactividad**:
- Hover muestra valor exacto y porcentaje
- Click en leyenda oculta/muestra segmento
- Responsive (se ajusta al ancho del contenedor)

---

## Funcionalidades de Exportación

### 1. Exportar a Excel

**Botón**: "Descargar Excel" (icono de archivo .xlsx)

**Ubicación**: Esquina superior derecha de la tabla

**Funcionalidad**:
- Genera archivo `.xlsx` con todos los datos de la tabla
- Incluye formato de moneda y porcentajes
- Preserva jerarquía mediante indentación

**Nombre del archivo generado**:
```
SGP_Resumen_{Municipio}_{Año}.xlsx
Ejemplo: SGP_Resumen_Medellin_2025.xlsx
```

**Contenido del Excel**:
- **Hoja 1**: "Resumen SGP"
  - Columnas: Concepto | Valor Asignado | % del Total
  - Formato de moneda: `$#,##0`
  - Formato de porcentaje: `0.0%`
- **Hoja 2**: "Metadatos"
  - Vigencia consultada
  - Departamento y municipio
  - Fecha de generación
  - Fuente de datos

### 2. Copiar al Portapapeles

**Botón**: "Copiar" (icono de clipboard)

**Funcionalidad**:
- Copia la tabla en formato texto plano (TSV)
- Separador: Tabulador (`\t`)
- Útil para pegar en Excel, Word, correos

**Formato copiado**:
```
Concepto	Valor Asignado	% del Total
1. TOTAL SGP	1234567890	100.0%
1.1. EDUCACIÓN	722222222	58.5%
...
```

### 3. Imprimir Reporte

**Botón**: "Imprimir" (icono de impresora)

**Funcionalidad**:
- Abre diálogo de impresión del navegador
- Aplica CSS de impresión (oculta elementos de navegación)
- Incluye encabezado con:
  - Logo del DNP
  - Título: "Sistema General de Participaciones - Resumen"
  - Vigencia, departamento y municipio consultados
  - Fecha de generación

**Orientación recomendada**: Vertical (portrait)

---

## Interpretación Técnica

### Cálculo de Porcentajes

Los porcentajes mostrados se calculan respecto al **Total SGP** de la entidad:

```
% del Total = (Valor del Concepto / Total SGP) × 100
```

**Ejemplo**:
```
Total SGP Medellín 2025: $1.234.567.890
Educación: $722.222.222

% Educación = (722.222.222 / 1.234.567.890) × 100 = 58.5%
```

### Validaciones de Suma

El sistema valida que:
```
Σ (Educación + Salud + Agua + Propósito General) = Total SGP
```

Si hay diferencias (por redondeos o ajustes), se muestran en un renglón "Otros" o "Ajustes".

### Interpretación de Valores Cero

**Casos donde un concepto puede ser $0**:

1. **Municipio no certificado en educación**: `Educación = $0`
   - Solo municipios con más de 100,000 habitantes están certificados
   - Los demás reciben educación del departamento

2. **Sin asignación especial**:
   - `Ribereños = $0` (si el municipio no está en la ribera del Magdalena)
   - `Resguardos = $0` (si no hay resguardos indígenas)

3. **Primera infancia**: Depende de si el municipio tiene Primera Infancia asignada

### Diferencias Departamento vs. Municipio

**Consulta de Departamento** (código municipio = 000):
- Muestra **recursos del departamento**, NO la suma de todos sus municipios
- Incluye recursos que el departamento maneja directamente (ej: educación no certificada)

**Suma de todos los municipios**:
- Para obtener el total SGP del departamento incluyendo municipios, debe sumarse manualmente

---

## Casos de Uso

### Caso 1: Alcalde Consulta Presupuesto Anual
**Escenario**: El alcalde de Medellín necesita conocer el total de SGP para 2025.

**Pasos**:
1. Accede al módulo SGP Resumen
2. Selecciona:
   - Año: 2025
   - Departamento: 05 - Antioquia
   - Municipio: 05001 - Medellín
3. Visualiza el total en el card "Total SGP"
4. Revisa distribución por sectores en la tabla
5. Descarga el Excel para análisis detallado

**Resultado esperado**:
```
Total SGP Medellín 2025: $1.234.567.890
  - Educación: $722.222.222 (58.5%)
  - Salud: $302.469.135 (24.5%)
  - Agua: $66.666.666 (5.4%)
  - Propósito General: $143.209.867 (11.6%)
```

### Caso 2: Investigador Compara Asignaciones
**Escenario**: Un investigador quiere comparar asignaciones de SGP entre dos municipios.

**Pasos**:
1. Consulta Municipio A (ej: Medellín)
2. Descarga Excel de Medellín
3. Cambia filtro a Municipio B (ej: Bello)
4. Descarga Excel de Bello
5. Compara ambos archivos en Excel

**Alternativa más eficiente**:
- Usar módulo **SGP Comparativo** ([03-04-sgp-comparativo.md](./03-04-sgp-comparativo.md))

### Caso 3: Secretaría de Educación Valida Recursos
**Escenario**: Secretaría de Educación de Antioquia valida recursos asignados para el departamento.

**Pasos**:
1. Selecciona:
   - Año: 2025
   - Departamento: 05 - Antioquia
   - Municipio: 000 - Todos (consolidado departamental)
2. Expande el nodo "1.1. EDUCACIÓN"
3. Verifica desglose:
   - Prestación del Servicio (nómina docente)
   - Calidad - Gratuidad
   - Calidad - Matrícula Oficial
4. Compara con presupuesto interno
5. Si hay diferencias, revisa [SGP Documentos Anexos](./03-02-sgp-documentos-anexos.md) para validar con documentos oficiales

### Caso 4: Ciudadano Consulta Transparencia
**Escenario**: Un ciudadano quiere saber cuánto recibe su municipio en educación.

**Pasos**:
1. Accede al módulo (acceso público)
2. Selecciona su municipio
3. Expande "1.1. EDUCACIÓN"
4. Visualiza el total asignado
5. Descarga el reporte en Excel para compartir

**Beneficio**: Transparencia y acceso a información pública

---

## Ver También

### Documentación Relacionada
- [03-00. Introducción al SGP](./03-00-sgp-introduccion.md) - Contexto general del SGP
- [03-02. SGP Documentos Anexos](./03-02-sgp-documentos-anexos.md) - Documentos oficiales de distribución
- [03-03. SGP Detalle Presupuestal](./03-03-sgp-detalle-presupuestal.md) - Detalle de doceavas mensuales
- [03-04. SGP Comparativo](./03-04-sgp-comparativo.md) - Comparación entre municipios

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-inicio/`
- **Servicio API**: `sicodis-api.service.ts` → `getSgpResumenParticipaciones()`
- **Interfaces TypeScript**: `ResumenParticipaciones`, `ConceptoSGP`

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Glosario de términos**: [06-01-glosario-terminos.md](../06-ayuda/06-01-glosario-terminos.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
