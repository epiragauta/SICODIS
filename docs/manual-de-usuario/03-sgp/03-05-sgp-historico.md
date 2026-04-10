# 3.5. SGP Histórico

## Información del Documento
- **Módulo**: SGP Histórico
- **Ruta de acceso**: `/sgp-historico`
- **Componente Angular**: `sgp-historico`
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

El módulo **SGP Histórico** permite consultar la **serie histórica completa** de asignaciones del Sistema General de Participaciones desde 2002 hasta la vigencia más reciente (2026), facilitando análisis de tendencias, evolución temporal y cálculos de variación en precios corrientes y constantes.

### Objetivos
- Mostrar **serie histórica completa** (2002-2026, 24 años de datos)
- Permitir análisis en **precios corrientes** y **precios constantes**
- Calcular **variaciones anuales** y **tasas de crecimiento**
- Visualizar **tendencias** mediante gráficos de evolución temporal
- Facilitar **proyecciones** basadas en datos históricos

### Usuarios Objetivo
- Analistas económicos y fiscales
- Investigadores en finanzas públicas territoriales
- Funcionarios de planeación en análisis de tendencias
- Académicos en estudios longitudinales
- Periodistas en reportes de transparencia

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API**: `/api/sgp/historico`

**Método**: `GET /api/sgp/historico`

**Parámetros**:
```typescript
{
  codigoDepto?: string,      // Opcional: filtro por departamento
  codigoMunicipio?: string,  // Opcional: filtro por municipio
  vigenciaInicio?: number,   // Opcional: año inicial (default: 2002)
  vigenciaFin?: number,      // Opcional: año final (default: vigencia actual)
  tipoPrecios: 'corrientes' | 'constantes' // Obligatorio
}
```

### Estructura de Datos

Cada registro contiene datos anuales:

```json
{
  "vigencia": 2025,
  "entidad": "Medellín",
  "codigoDane": "05001",
  "preciosCorrientes": {
    "totalSGP": 1234567890,
    "educacion": 722222222,
    "salud": 302469135,
    "agua": 66666666,
    "propositoGeneral": 143209867
  },
  "preciosConstantes": {
    "añoBase": 2018,
    "deflactor": 1.32,
    "totalSGP": 935278704,
    "educacion": 547137289,
    "salud": 229143890,
    "agua": 50505050,
    "propositoGeneral": 108492475
  },
  "variacionAnual": {
    "totalSGP": 3.5,        // % respecto a 2024
    "educacion": 3.2,
    "salud": 4.1,
    "agua": 3.0,
    "propositoGeneral": 3.8
  }
}
```

### Serie Histórica Disponible

**Rango temporal**: 2002 - 2026 (24 vigencias)

**Cobertura por vigencia**:

| Período | Vigencias | Disponibilidad | Observaciones |
|---------|-----------|----------------|---------------|
| 2002-2009 | 8 años | Datos consolidados | Serie histórica básica |
| 2010-2014 | 5 años | Datos + variables certificadas | Mayor detalle |
| 2015-2026 | 12 años | Datos completos + doceavas | Detalle máximo |

### Ajuste por Inflación

**Año base para precios constantes**: 2018

**Deflactores aplicados**: IPC (Índice de Precios al Consumidor) certificado por el DANE

**Ejemplo de deflactor**:
```
Año 2025:
  IPC base 2018 = 100
  IPC 2025 = 132.5
  Deflactor = 132.5 / 100 = 1.325

Conversión a precios constantes 2018:
  Valor corriente 2025: $1,234,567,890
  Valor constante 2018: $1,234,567,890 / 1.325 = $931,749,993
```

---

## Controles y Filtros

![Filtros Histórico](../assets/sgp-historico-filtros.png)
*Placeholder: Captura de pantalla del panel de filtros con selectores de entidad y rango temporal*

### Panel de Filtros

#### 1. Selector de Entidad Territorial

**Controles**:
- **Departamento**: Dropdown (opcional)
- **Municipio**: Dropdown dependiente (opcional)

**Opciones especiales**:
- **"Nacional"**: Muestra total SGP del país
- **"Departamento consolidado"**: Suma de todos los municipios del departamento
- **Municipio específico**: Serie histórica del municipio

**Comportamiento**:
- Si no se selecciona nada, muestra serie nacional
- Permite análisis multinivel (Nación → Departamento → Municipio)

#### 2. Selector de Rango Temporal

**Controles**:
- **Año inicio**: Dropdown (2002-2025)
- **Año fin**: Dropdown (2003-2026)

**Validaciones**:
- Año fin debe ser mayor que año inicio
- Rango máximo: 24 años (serie completa)
- Rango mínimo: 2 años

**Valores por defecto**:
- Inicio: 2002 (primer año disponible)
- Fin: 2026 (vigencia más reciente)

#### 3. Tipo de Precios

**Control**: Radio buttons

**Opciones**:
- ⚫ **Precios corrientes** (valor nominal del año)
- ⚪ **Precios constantes** (ajustados a año base 2018)

**Comportamiento**:
- Al cambiar, recalcula y regrafica automáticamente
- Muestra nota explicativa del año base
- Afecta tabla y gráficos simultáneamente

#### 4. Conceptos a Visualizar

**Control**: Checkboxes múltiples

**Opciones**:
- ☑ Total SGP
- ☑ Educación
- ☑ Salud
- ☑ Agua Potable
- ☑ Propósito General

**Comportamiento**:
- Al menos uno debe estar seleccionado
- Cada concepto se representa con una línea en el gráfico
- Colores distintivos por concepto

#### 5. Tipo de Visualización

**Control**: Tabs (pestañas)

**Opciones**:
- **Tabla**: Vista tabular de la serie
- **Gráfico de Líneas**: Evolución temporal
- **Gráfico de Barras**: Comparación anual
- **Tabla de Variaciones**: Tasas de crecimiento

---

## Visualizaciones

### 1. Tabla Histórica

**Componente**: PrimeNG Table con scroll y paginación

![Tabla Histórica](../assets/sgp-historico-tabla.png)
*Placeholder: Tabla mostrando serie histórica 2002-2026 con todas las columnas*

**Estructura (Precios Corrientes)**:

| Vigencia | Total SGP | Educación | Salud | Agua | Propósito General | Variación Anual |
|----------|-----------|-----------|-------|------|-------------------|-----------------|
| 2026 | $1,300,000,000 | $761,000,000 | $318,500,000 | $70,200,000 | $150,300,000 | +5.3% |
| 2025 | $1,234,567,890 | $722,222,222 | $302,469,135 | $66,666,666 | $143,209,867 | +3.5% |
| 2024 | $1,192,000,000 | $697,320,000 | $292,040,000 | $64,368,000 | $138,272,000 | +4.1% |
| ... | ... | ... | ... | ... | ... | ... |
| 2003 | $280,000,000 | $163,800,000 | $68,600,000 | $15,120,000 | $32,480,000 | +8.5% |
| 2002 | $258,000,000 | $150,930,000 | $63,210,000 | $13,932,000 | $29,928,000 | - |

**Características**:
- **Ordenamiento**: Por defecto descendente (más reciente arriba)
- **Formato numérico**: Separador de miles, sin decimales
- **Variación**: Color verde (+) o rojo (-) según incremento/decremento
- **Totales**: Fila de totales al final (suma de toda la serie)
- **Exportable**: A Excel, CSV y PDF

**Funcionalidades adicionales**:
- Filtro por columna
- Ordenamiento por cualquier columna
- Resaltado de fila al pasar el mouse
- Tooltip con valor en precios constantes (si está en precios corrientes)

### 2. Gráfico de Evolución Temporal (Líneas)

**Tipo**: Gráfico de líneas múltiples

**Librería**: Chart.js

![Gráfico Evolución](../assets/sgp-historico-grafico-lineas.png)
*Placeholder: Gráfico de líneas mostrando evolución de SGP 2002-2026*

**Configuración**:
```javascript
{
  type: 'line',
  data: {
    labels: ['2002', '2003', ..., '2025', '2026'],
    datasets: [
      {
        label: 'Total SGP',
        data: [258000000, 280000000, ..., 1234567890, 1300000000],
        borderColor: '#000000',
        borderWidth: 3,
        tension: 0.1
      },
      {
        label: 'Educación',
        data: [...],
        borderColor: '#4CAF50',
        borderWidth: 2
      },
      {
        label: 'Salud',
        data: [...],
        borderColor: '#2196F3',
        borderWidth: 2
      },
      {
        label: 'Agua Potable',
        data: [...],
        borderColor: '#00BCD4',
        borderWidth: 2
      },
      {
        label: 'Propósito General',
        data: [...],
        borderColor: '#FF9800',
        borderWidth: 2
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '$' + (value / 1000000000).toFixed(1) + 'B'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.dataset.label + ': $' +
                   context.parsed.y.toLocaleString('es-CO');
          }
        }
      },
      annotation: {
        annotations: {
          line2007: {
            type: 'line',
            xMin: '2007',
            xMax: '2007',
            borderColor: 'red',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: 'Acto Legislativo 04/2007',
              enabled: true,
              position: 'top'
            }
          }
        }
      }
    }
  }
}
```

**Anotaciones especiales**:
- **2007**: Línea vertical indicando Acto Legislativo 04 (reforma constitucional)
- **2012**: Cambio en metodología de cálculo (si aplica)
- **2020**: COVID-19 (si hay impacto visible)

### 3. Gráfico de Barras Apiladas

**Tipo**: Barras apiladas verticales

![Gráfico Barras](../assets/sgp-historico-grafico-barras.png)
*Placeholder: Gráfico de barras apiladas mostrando composición del SGP por año*

**Configuración**:
```javascript
{
  type: 'bar',
  data: {
    labels: ['2002', '2003', ..., '2025', '2026'],
    datasets: [
      {
        label: 'Educación',
        data: [...],
        backgroundColor: '#4CAF50'
      },
      {
        label: 'Salud',
        data: [...],
        backgroundColor: '#2196F3'
      },
      {
        label: 'Agua Potable',
        data: [...],
        backgroundColor: '#00BCD4'
      },
      {
        label: 'Propósito General',
        data: [...],
        backgroundColor: '#FF9800'
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true,
        ticks: {
          callback: (value) => '$' + (value / 1000000000).toFixed(0) + 'B'
        }
      }
    }
  }
}
```

**Ventaja**:
- Muestra la **composición** del SGP por sectores
- Permite ver cómo varía la proporción de cada sector a lo largo del tiempo
- Útil para identificar cambios normativos que afectan distribución sectorial

### 4. Tabla de Variaciones Anuales

![Tabla Variaciones](../assets/sgp-historico-variaciones.png)
*Placeholder: Tabla mostrando tasas de crecimiento año a año*

**Estructura**:

| Vigencia | Variación Total | Var. Educación | Var. Salud | Var. Agua | Var. PG | Inflación | Var. Real |
|----------|-----------------|----------------|------------|-----------|---------|-----------|-----------|
| 2026 | +5.3% | +5.4% | +5.3% | +5.3% | +4.9% | 3.5% | +1.7% |
| 2025 | +3.5% | +3.6% | +3.6% | +3.6% | +3.6% | 3.2% | +0.3% |
| 2024 | +4.1% | +4.0% | +4.2% | +4.0% | +4.3% | 5.6% | -1.4% |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Columnas**:
- **Variación Total**: Crecimiento del Total SGP respecto a año anterior
- **Variaciones sectoriales**: Por Educación, Salud, Agua, PG
- **Inflación**: IPC del año (DANE)
- **Variación Real**: Crecimiento descontando inflación

**Fórmulas**:
```
Variación Nominal = ((Año N - Año N-1) / Año N-1) × 100

Variación Real = ((1 + Var. Nominal) / (1 + Inflación)) - 1) × 100
```

**Código de colores**:
- **Verde**: Variación real positiva (crecimiento por encima de inflación)
- **Amarillo**: Variación real cercana a 0 (-1% a +1%)
- **Rojo**: Variación real negativa (crecimiento por debajo de inflación)

### 5. Indicadores Estadísticos

![Indicadores Estadísticos](../assets/sgp-historico-estadisticas.png)
*Placeholder: Panel con estadísticas descriptivas de la serie*

**Indicadores mostrados**:

#### Card 1: Tasa de Crecimiento Promedio Anual
```
┌──────────────────────────────────┐
│  📈 TCPA (2002-2026)             │
│                                  │
│  7.2% anual                      │
│  Precios corrientes              │
└──────────────────────────────────┘
```

**Fórmula TCPA**:
```
TCPA = ((Valor Final / Valor Inicial)^(1/n) - 1) × 100

Donde n = número de períodos
```

#### Card 2: Crecimiento Total Acumulado
```
┌──────────────────────────────────┐
│  📊 Crecimiento Total            │
│                                  │
│  +403.9%                         │
│  De $258 B a $1,300 B (24 años)  │
└──────────────────────────────────┘
```

#### Card 3: Volatilidad (Desviación Estándar)
```
┌──────────────────────────────────┐
│  📉 Volatilidad                  │
│                                  │
│  ±2.1%                           │
│  Baja volatilidad (estable)     │
└──────────────────────────────────┘
```

#### Card 4: Año de Mayor Crecimiento
```
┌──────────────────────────────────┐
│  🏆 Mayor Crecimiento            │
│                                  │
│  2008: +12.5%                    │
│  Post-reforma Acto Leg. 04/2007  │
└──────────────────────────────────┘
```

---

## Funcionalidades de Exportación

### 1. Exportar Serie Completa a Excel

**Botón**: "Descargar Serie Histórica (Excel)"

**Contenido del archivo**:

**Hoja 1: "Precios Corrientes"**
```
SERIE HISTÓRICA SGP - PRECIOS CORRIENTES
Entidad: Medellín (05001)
Período: 2002 - 2026

Vigencia | Total SGP | Educación | Salud | Agua | Propósito General
---------|-----------|-----------|-------|------|-------------------
2026 | 1,300,000,000 | ... | ... | ... | ...
...
2002 | 258,000,000 | ... | ... | ... | ...
```

**Hoja 2: "Precios Constantes 2018"**
- Misma estructura, valores ajustados por inflación
- Incluye columna de deflactor

**Hoja 3: "Variaciones Anuales"**
- Tasas de crecimiento año a año
- Variaciones nominales y reales

**Hoja 4: "Estadísticas Descriptivas"**
```
Estadística | Valor
------------|--------
TCPA | 7.2%
Crecimiento total | 403.9%
Promedio serie | $756,234,567
Mediana | $720,000,000
Desviación estándar | ±$320,000,000
Coeficiente de variación | 42.3%
```

**Hoja 5: "Deflactores IPC"**
```
Año | IPC Base 2018 | Deflactor
----|---------------|----------
2026 | 135.2 | 1.352
2025 | 132.5 | 1.325
...
2002 | 58.3 | 0.583
```

**Hoja 6: "Metadatos"**
- Fuente de datos
- Fecha de consulta
- Observaciones metodológicas

### 2. Exportar Gráfico a Imagen

**Botón**: "Descargar Gráfico (PNG)"

**Funcionalidad**:
- Exporta el gráfico visible en formato PNG de alta resolución
- Tamaño: 1920x1080 px (Full HD)
- Incluye leyenda y etiquetas

**Nombre de archivo**:
```
SGP_Historico_Medellin_2002-2026.png
```

### 3. Generar Reporte PDF Completo

**Botón**: "Generar Reporte PDF"

**Contenido**:
- **Portada**: Logo DNP, título, entidad, período
- **Resumen ejecutivo**: Estadísticas clave
- **Tabla completa**: Serie histórica
- **Gráficos**: Evolución temporal (líneas) + Composición (barras apiladas)
- **Análisis de variaciones**: Tabla de tasas de crecimiento
- **Interpretación**: Texto explicativo de tendencias
- **Anexos**: Metodología y deflactores

**Orientación**: Vertical para tabla, horizontal para gráficos

---

## Interpretación Técnica

### Precios Corrientes vs. Precios Constantes

**Precios Corrientes**:
- Valor **nominal** del año
- Incluye efecto de la inflación
- Útil para comparar montos absolutos

**Ejemplo**:
```
SGP 2002: $258,000,000 (pesos de 2002)
SGP 2026: $1,300,000,000 (pesos de 2026)

Crecimiento nominal: 403.9%
```

**Precios Constantes (Año base 2018)**:
- Valor **real**, ajustado por inflación
- Elimina efecto de variación de precios
- Útil para medir crecimiento real del SGP

**Ejemplo**:
```
SGP 2002: $258,000,000 / 0.583 = $442,715,259 (pesos de 2018)
SGP 2026: $1,300,000,000 / 1.352 = $961,538,462 (pesos de 2018)

Crecimiento real: 117.2% (muy inferior al nominal de 403.9%)
```

**Conclusión**: La diferencia entre crecimiento nominal y real se debe a la inflación acumulada de 24 años.

### Tasa de Crecimiento Promedio Anual (TCPA)

**Fórmula**:
```
TCPA = ((Valor Final / Valor Inicial)^(1/n) - 1) × 100

Ejemplo:
Valor 2002: $258,000,000
Valor 2026: $1,300,000,000
n = 24 años

TCPA = (($1,300M / $258M)^(1/24) - 1) × 100
     = ((5.039)^(1/24) - 1) × 100
     = (1.0719 - 1) × 100
     = 7.19%

Interpretación: El SGP creció en promedio 7.2% anual durante 24 años
```

**TCPA en precios constantes**:
```
TCPA real = ((961,538,462 / 442,715,259)^(1/24) - 1) × 100
          = 3.3% anual

Interpretación: Descontando inflación, el crecimiento real fue de 3.3% anual
```

### Análisis de Tendencias

**Identificación de períodos**:

1. **2002-2007** (Pre-reforma):
   - Crecimiento: 8.5% anual promedio
   - Estable, según Ley 715/2001

2. **2008-2014** (Post-Acto Legislativo 04/2007):
   - Crecimiento: 9.2% anual promedio
   - Incremento por reforma constitucional

3. **2015-2019** (Ajuste):
   - Crecimiento: 6.5% anual promedio
   - Normalización post-reforma

4. **2020-2021** (COVID-19):
   - Crecimiento: 2.1% anual promedio
   - Desaceleración por crisis sanitaria

5. **2022-2026** (Recuperación):
   - Crecimiento: 4.8% anual promedio
   - Recuperación gradual

### Proyecciones

**Método de proyección lineal**:
```
Proyección 2027 = Valor 2026 × (1 + TCPA últimos 5 años)

Ejemplo:
TCPA 2022-2026 = 4.8%
Valor 2026 = $1,300,000,000

Proyección 2027 = $1,300M × 1.048 = $1,362,400,000
```

**Nota**: Las proyecciones son estimativas y dependen de políticas fiscales futuras.

---

## Casos de Uso

### Caso 1: Investigador Analiza Impacto de Reforma 2007
**Escenario**: Investigador académico estudia el impacto del Acto Legislativo 04 de 2007.

**Pasos**:
1. Accede a SGP Histórico
2. Selecciona serie completa 2002-2026
3. Activa visualización de precios constantes
4. Divide la serie en dos períodos:
   - Pre-reforma: 2002-2007
   - Post-reforma: 2008-2014
5. Calcula TCPA de cada período:
   - TCPA pre: 8.5%
   - TCPA post: 9.2%
6. Descarga serie a Excel
7. Aplica prueba estadística (t-test) para validar diferencia significativa
8. Genera gráfico de líneas con anotación en 2007
9. Redacta hallazgo en paper académico

**Resultado**: Evidencia cuantitativa del impacto de la reforma

### Caso 2: Planeador Municipal Proyecta Ingresos 2027-2030
**Escenario**: Director de planeación proyecta SGP para plan de desarrollo.

**Pasos**:
1. Filtra su municipio
2. Selecciona últimos 5 años (2022-2026)
3. Calcula TCPA de ese período: 4.8%
4. Descarga serie a Excel
5. Aplica TCPA a proyecciones:
   - 2027: $1,362,400,000
   - 2028: $1,427,875,200
   - 2029: $1,496,413,209
   - 2030: $1,568,240,647
6. Ajusta por inflación esperada (Banco de la República)
7. Genera flujo de caja proyectado 2027-2030
8. Valida con DNP si hay reformas normativas previstas

**Resultado**: Proyección fundamentada para plan de desarrollo

### Caso 3: Periodista Reporta Evolución de SGP
**Escenario**: Periodista escribe artículo sobre inversión social en su región.

**Pasos**:
1. Selecciona su departamento
2. Serie completa 2002-2026
3. Visualiza gráfico de evolución
4. Identifica:
   - Crecimiento total: +403.9%
   - Crecimiento real (precios constantes): +117.2%
   - TCPA: 7.2%
5. Compara con crecimiento del PIB departamental
6. Descarga gráfico de líneas (PNG)
7. Genera reporte PDF
8. Redacta artículo con datos y gráfico
9. Publica con referencia a SICODIS como fuente

**Resultado**: Reportaje periodístico con datos verificables

### Caso 4: Analista DNP Evalúa Equidad Histórica
**Escenario**: Funcionario del DNP evalúa si la distribución SGP ha reducido brechas territoriales.

**Pasos**:
1. Compara series históricas de:
   - Municipios ricos (alto PIB per cápita)
   - Municipios pobres (alto NBI)
2. Calcula SGP per cápita de cada grupo por año
3. Mide convergencia:
   - Brecha 2002: $X
   - Brecha 2026: $Y
   - ¿Se redujo la brecha?
4. Genera gráfico de convergencia
5. Descarga series a Excel
6. Aplica índice de Gini temporal
7. Redacta informe de equidad territorial
8. Presenta en reunión de política pública

**Resultado**: Evidencia para política de equidad territorial

---

## Ver También

### Documentación Relacionada
- [03-01. SGP Resumen](./03-01-sgp-resumen.md) - Datos de una vigencia específica
- [03-04. SGP Comparativo](./03-04-sgp-comparativo.md) - Comparación entre entidades
- [07-01. Metodologías de Cálculo](../07-apendices/07-01-metodologias-calculo.md) - Fórmulas de distribución

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-historico/`
- **Servicio API**: `sicodisApiService.getSgpHistorico()`
- **Interfaces**: `SerieHistorica`, `DatoAnual`, `Variacion`

### Normatividad
- **Ley 715 de 2001**: Creación del SGP
- **Acto Legislativo 04 de 2007**: Reforma al SGP
- **Ley 1176 de 2007**: Reglamentación de la reforma
- [07-03. Normatividad](../07-apendices/07-03-normatividad.md)

### Fuentes de Datos Externas
- **DANE**: Deflactores IPC (https://www.dane.gov.co/)
- **Contraloría General**: Certificación ICN
- **DNP**: Decretos de distribución históricos

### Glosario
- **TCPA**: Tasa de Crecimiento Promedio Anual
- **Precios constantes**: Valores ajustados por inflación
- **Deflactor**: Factor de conversión entre precios corrientes y constantes
- **IPC**: Índice de Precios al Consumidor

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
