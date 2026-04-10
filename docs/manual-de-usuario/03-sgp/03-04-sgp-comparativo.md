# 3.4. SGP Comparativo

## Información del Documento
- **Módulo**: SGP Comparativo
- **Ruta de acceso**: `/sgp-comparativa`
- **Componente Angular**: `sgp-comparativa`
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

El módulo **SGP Comparativo** permite realizar **comparaciones lado a lado** entre dos municipios o departamentos, mostrando sus asignaciones SGP, variables certificadas, indicadores per cápita y análisis de diferencias. Incluye también acceso al **Informe Trimestral de Seguimiento SGP**.

### Objetivos
- **Comparar asignaciones SGP** entre dos entidades territoriales
- Analizar **variables certificadas** que determinan las distribuciones
- Calcular **indicadores per cápita** para comparaciones equitativas
- Proporcionar acceso al **Informe Trimestral** de seguimiento
- Facilitar **benchmarking** entre municipios similares

### Usuarios Objetivo
- Analistas de planeación que comparan municipios
- Investigadores académicos en estudios comparativos
- Funcionarios de DNP en análisis territorial
- Alcaldes y gobernadores en procesos de benchmarking

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API Principal**: `/api/sgp/comparativa`

**Método**: `GET /api/sgp/comparativa`

**Parámetros**:
```typescript
{
  vigencia: number,
  entidad1: {
    codigoDepto: string,
    codigoMunicipio: string
  },
  entidad2: {
    codigoDepto: string,
    codigoMunicipio: string
  }
}
```

### Datos Comparados

#### 1. Asignaciones SGP
- Total SGP
- Educación (desglosado)
- Salud (desglosado)
- Agua Potable
- Propósito General (desglosado)

#### 2. Variables Certificadas
- **Población total** (DANE)
- **Población NBI** (Necesidades Básicas Insatisfechas)
- **Matrícula oficial** (Educación)
- **Población SISBEN** (Salud)
- **Afiliados régimen subsidiado**
- **Déficit de cobertura en agua**

#### 3. Indicadores Calculados
- **SGP per cápita** (Total SGP / Población)
- **Educación per cápita**
- **Salud per cápita**
- **% de población en NBI**
- **Cobertura educativa**
- **Cobertura en salud**

### Informe Trimestral

**Endpoint adicional**: `/api/sgp/informe-trimestral`

**Método**: `GET /api/sgp/informe-trimestral/{vigencia}/{trimestre}`

**Datos del informe**:
- Giros efectuados en el trimestre
- Acumulado de la vigencia
- Comparación con trimestre anterior
- Análisis por sector (Educación, Salud, Agua, PG)

---

## Controles y Filtros

![Filtros Comparativo](../assets/sgp-comparativo-filtros.png)
*Placeholder: Captura de pantalla del panel de comparación con dos columnas de selección*

### Panel de Filtros

#### 1. Selector de Vigencia
**Control**: Dropdown

**Valores**: 2015-2026

**Comportamiento**:
- Valor por defecto: Año más reciente (2026)
- Aplica a ambas entidades comparadas
- Al cambiar, recarga datos de ambas

#### 2. Entidad 1 (Columna Izquierda)

**Controles**:
- **Departamento 1**: Dropdown
- **Municipio 1**: Dropdown (depende de Departamento 1)

**Etiqueta**: "Entidad de referencia"

**Color identificador**: Azul (#2196F3)

#### 3. Entidad 2 (Columna Derecha)

**Controles**:
- **Departamento 2**: Dropdown
- **Municipio 2**: Dropdown (depende de Departamento 2)

**Etiqueta**: "Entidad a comparar"

**Color identificador**: Verde (#4CAF50)

#### 4. Botón "Comparar"

**Ubicación**: Centro, entre las dos columnas

**Funcionalidad**:
- Valida que se hayan seleccionado ambas entidades
- Carga datos de comparación
- Renderiza visualizaciones

**Validaciones**:
- No permite comparar la misma entidad consigo misma
- Muestra alerta si faltan selecciones

#### 5. Selector de Informe Trimestral

**Ubicación**: Panel desplegable inferior

**Controles**:
- **Vigencia**: Dropdown (2015-2026)
- **Trimestre**: Radio buttons (T1, T2, T3, T4)

**Botón**: "Descargar Informe Trimestral"

### Flujo de Interacción

```
1. Usuario selecciona Vigencia (ej: 2025)
   ↓
2. Usuario selecciona Entidad 1:
   - Departamento: 05 - Antioquia
   - Municipio: 05001 - Medellín
   ↓
3. Usuario selecciona Entidad 2:
   - Departamento: 76 - Valle del Cauca
   - Municipio: 76001 - Cali
   ↓
4. Usuario hace clic en "Comparar"
   ↓
5. Sistema carga datos y renderiza:
   - Tabla comparativa
   - Gráficos de barras
   - Indicadores per cápita
   - Análisis de diferencias
```

---

## Visualizaciones

### 1. Tabla Comparativa de Asignaciones

**Componente**: PrimeNG Table con formato de dos columnas

![Tabla Comparativa](../assets/sgp-comparativo-tabla.png)
*Placeholder: Tabla mostrando lado a lado las asignaciones de dos municipios*

**Estructura**:

| Concepto | Medellín (05001) | Cali (76001) | Diferencia | Δ% |
|----------|------------------|--------------|------------|-----|
| **TOTAL SGP** | **$1,234,567,890** | **$1,100,000,000** | **+$134,567,890** | **+12.2%** |
| Educación | $722,222,222 | $650,000,000 | +$72,222,222 | +11.1% |
| ├─ Prestación | $600,000,000 | $540,000,000 | +$60,000,000 | +11.1% |
| ├─ Calidad | $122,222,222 | $110,000,000 | +$12,222,222 | +11.1% |
| Salud | $302,469,135 | $270,000,000 | +$32,469,135 | +12.0% |
| ├─ Régimen Sub. | $250,000,000 | $220,000,000 | +$30,000,000 | +13.6% |
| ├─ Salud Pública | $52,469,135 | $50,000,000 | +$2,469,135 | +4.9% |
| Agua Potable | $66,666,666 | $60,000,000 | +$6,666,666 | +11.1% |
| Propósito General | $143,209,867 | $120,000,000 | +$23,209,867 | +19.3% |

**Formato de celdas**:
- **Columna Entidad 1**: Fondo azul claro
- **Columna Entidad 2**: Fondo verde claro
- **Diferencia positiva**: Texto verde con ícono ↑
- **Diferencia negativa**: Texto rojo con ícono ↓
- **Sin diferencia**: Texto gris con ícono →

**Iconografía**:
- ↑ : Mayor valor
- ↓ : Menor valor
- → : Igual valor
- ⚠️ : Diferencia significativa (>50%)

### 2. Tabla de Variables Certificadas

![Tabla Variables](../assets/sgp-comparativo-variables.png)
*Placeholder: Tabla comparando variables certificadas entre las dos entidades*

**Estructura**:

| Variable | Medellín | Cali | Diferencia | Δ% |
|----------|----------|------|------------|-----|
| **Población total** | 2,569,007 | 2,258,539 | +310,468 | +13.7% |
| Población NBI | 128,450 | 180,683 | -52,233 | -28.9% |
| % NBI | 5.0% | 8.0% | -3.0 pp | -37.5% |
| Matrícula oficial | 400,000 | 380,000 | +20,000 | +5.3% |
| Población SISBEN | 500,000 | 600,000 | -100,000 | -16.7% |
| Afiliados Rég. Sub. | 450,000 | 550,000 | -100,000 | -18.2% |

**Nota**: "pp" = puntos porcentuales

### 3. Gráficos de Comparación

#### Gráfico 1: Comparación por Sector (Barras Agrupadas)

**Tipo**: Gráfico de barras horizontales agrupadas

**Librería**: Chart.js

![Gráfico Sectores](../assets/sgp-comparativo-grafico-sectores.png)
*Placeholder: Gráfico de barras comparando Educación, Salud, Agua y PG*

**Configuración**:
```javascript
{
  type: 'bar',
  data: {
    labels: ['Educación', 'Salud', 'Agua Potable', 'Propósito General'],
    datasets: [
      {
        label: 'Medellín',
        data: [722222222, 302469135, 66666666, 143209867],
        backgroundColor: '#2196F3' // Azul
      },
      {
        label: 'Cali',
        data: [650000000, 270000000, 60000000, 120000000],
        backgroundColor: '#4CAF50' // Verde
      }
    ]
  },
  options: {
    indexAxis: 'y', // Barras horizontales
    scales: {
      x: {
        ticks: {
          callback: (value) => '$' + (value / 1000000).toFixed(0) + 'M'
        }
      }
    }
  }
}
```

#### Gráfico 2: SGP Per Cápita (Barras Comparativas)

**Tipo**: Gráfico de barras verticales

![Gráfico Per Cápita](../assets/sgp-comparativo-percapita.png)
*Placeholder: Gráfico comparando indicadores per cápita*

**Indicadores mostrados**:
- Total SGP per cápita
- Educación per cápita
- Salud per cápita
- Agua per cápita
- Propósito General per cápita

**Ejemplo de valores**:
```
Medellín:
  Total SGP per cápita: $480,596
  Educación per cápita: $281,115
  Salud per cápita: $117,738

Cali:
  Total SGP per cápita: $487,125
  Educación per cápita: $287,861
  Salud per cápita: $119,548
```

#### Gráfico 3: Distribución Porcentual (Donuts)

**Tipo**: Dos gráficos de dona lado a lado

![Gráficos Dona](../assets/sgp-comparativo-donut.png)
*Placeholder: Dos gráficos circulares mostrando distribución porcentual*

**Configuración**:
- Gráfico izquierdo: Medellín (colores azules)
- Gráfico derecho: Cali (colores verdes)
- Segmentos: Educación, Salud, Agua, PG

### 4. Indicadores Resumen

![Cards Comparativos](../assets/sgp-comparativo-cards.png)
*Placeholder: Tarjetas con indicadores clave de la comparación*

#### Card 1: Entidad con Mayor SGP
```
┌──────────────────────────────────┐
│  🏆 Mayor Asignación SGP         │
│                                  │
│  Medellín                        │
│  $1,234,567,890                  │
│  +12.2% más que Cali             │
└──────────────────────────────────┘
```

#### Card 2: Mayor SGP Per Cápita
```
┌──────────────────────────────────┐
│  👤 Mayor Per Cápita             │
│                                  │
│  Cali                            │
│  $487,125 por habitante          │
│  +1.4% más que Medellín          │
└──────────────────────────────────┘
```

#### Card 3: Mayor Inversión en Educación
```
┌──────────────────────────────────┐
│  🎓 Mayor Inversión Educación    │
│                                  │
│  Medellín                        │
│  $722,222,222                    │
│  11.1% más que Cali              │
└──────────────────────────────────┘
```

#### Card 4: Mayor Cobertura en Salud
```
┌──────────────────────────────────┐
│  🏥 Mayor Cobertura Salud        │
│                                  │
│  Cali                            │
│  88.5% de población cubierta     │
│  vs. 85.2% en Medellín           │
└──────────────────────────────────┘
```

### 5. Análisis de Diferencias (Texto Interpretativo)

**Ubicación**: Panel inferior de la comparación

![Análisis Diferencias](../assets/sgp-comparativo-analisis.png)
*Placeholder: Panel con análisis textual automático*

**Contenido generado automáticamente**:

```
📊 ANÁLISIS COMPARATIVO: Medellín vs. Cali (Vigencia 2025)

RESUMEN GENERAL:
• Medellín recibe $134,567,890 MÁS en SGP que Cali (+12.2%)
• Sin embargo, Cali tiene un SGP per cápita MAYOR ($487,125 vs. $480,596)
• La diferencia se explica por la mayor población de Medellín (+13.7%)

EDUCACIÓN:
• Medellín: $722,222,222 (58.5% del total SGP)
• Cali: $650,000,000 (59.1% del total SGP)
• Cali destina MAYOR porcentaje de su SGP a educación

SALUD:
• Medellín tiene MENOR población SISBEN (500,000 vs. 600,000)
• Esto resulta en menor asignación de régimen subsidiado
• Sin embargo, salud per cápita es similar en ambas ciudades

PROPÓSITO GENERAL:
• Medellín recibe +19.3% más que Cali en este rubro
• Explicación: Mayor eficiencia fiscal de Medellín
• Ver módulo SGP Eficiencias para detalle

CONCLUSIÓN:
Aunque Medellín recibe mayor monto absoluto, Cali tiene mejor indicador
per cápita, lo que sugiere mayor eficiencia en la asignación de recursos
considerando el tamaño poblacional.
```

---

## Funcionalidades de Exportación

### 1. Descargar Comparación en Excel

**Botón**: "Exportar Comparación a Excel"

**Contenido del archivo**:

**Hoja 1: "Comparación SGP"**
```
COMPARACIÓN SISTEMA GENERAL DE PARTICIPACIONES
Vigencia: 2025

Concepto | Medellín (05001) | Cali (76001) | Diferencia | Δ%
---------|------------------|--------------|------------|----
TOTAL SGP | 1,234,567,890 | 1,100,000,000 | 134,567,890 | 12.2%
...
```

**Hoja 2: "Variables Certificadas"**
- Población, NBI, Matrícula, SISBEN, etc.

**Hoja 3: "Indicadores Per Cápita"**
- SGP total per cápita
- Por sector per cápita

**Hoja 4: "Análisis Textual"**
- Resumen interpretativo
- Conclusiones

### 2. Descargar Informe Trimestral

**Botón**: "Descargar Informe Trimestral" (en panel inferior)

**Formato**: PDF oficial del DNP

**Contenido**:
- Portada con vigencia y trimestre
- Resumen ejecutivo
- Giros por sector (tablas)
- Gráficos de evolución trimestral
- Comparación con trimestre anterior
- Acumulado de la vigencia
- Anexos técnicos

**Nombre de archivo**:
```
Informe_Trimestral_SGP_2025_T3.pdf
```

### 3. Generar Reporte PDF Comparativo

**Botón**: "Generar Reporte PDF"

**Contenido**:
- Encabezado: Logo DNP, título "Comparación SGP"
- Datos de entidades comparadas
- Tabla comparativa
- Gráficos (barras y donuts)
- Análisis textual
- Pie de página con fecha y fuente

**Orientación**: Horizontal (landscape)

---

## Interpretación Técnica

### Cálculo de Indicadores Per Cápita

**Fórmula general**:
```
Indicador Per Cápita = Monto Asignado / Población Total

Ejemplo:
SGP Total Medellín: $1,234,567,890
Población Medellín: 2,569,007 habitantes

SGP per cápita = $1,234,567,890 / 2,569,007 = $480,596 por habitante
```

**Interpretación**:
- Un **mayor SGP per cápita** indica mayor disponibilidad de recursos por habitante
- Permite comparaciones equitativas entre entidades de diferente tamaño
- Útil para benchmarking entre ciudades

### Análisis de Diferencias Porcentuales

**Fórmula de variación**:
```
Δ% = ((Entidad1 - Entidad2) / Entidad2) × 100

Ejemplo:
Medellín: $1,234,567,890
Cali: $1,100,000,000

Δ% = ((1,234,567,890 - 1,100,000,000) / 1,100,000,000) × 100
   = (134,567,890 / 1,100,000,000) × 100
   = 12.2%

Interpretación: Medellín recibe 12.2% MÁS que Cali
```

**Código de colores**:
- **Verde positivo**: Ventaja para Entidad 1
- **Rojo negativo**: Desventaja para Entidad 1
- **Gris neutro**: Sin diferencia significativa (<2%)

### Comparación de Variables Certificadas

**Variables clave y su impacto**:

| Variable | Impacto en | Fórmula |
|----------|-----------|---------|
| **Población** | Propósito General, Salud Pública | 40% PG, 100% SP |
| **NBI (pobreza)** | Propósito General, Agua | 40% PG, ponderación Agua |
| **Matrícula oficial** | Educación | Base de asignación |
| **SISBEN** | Salud (Régimen Subsidiado) | Número de afiliables |

**Ejemplo de análisis**:
```
Si Municipio A tiene:
  - MAYOR población que B → Mayor PG y Salud Pública
  - MENOR NBI que B → Menor peso en criterios de equidad
  - MAYOR matrícula que B → Mayor asignación educación

Resultado: Mayor SGP total, pero distribución diferente por sectores
```

### Informe Trimestral - Interpretación

**Estructura del trimestre**:
- **T1**: Enero - Marzo (Doceavas 1, 2, 3)
- **T2**: Abril - Junio (Doceavas 4, 5, 6)
- **T3**: Julio - Septiembre (Doceavas 7, 8, 9)
- **T4**: Octubre - Diciembre (Doceavas 10, 11, 12)

**Análisis de ejecución trimestral**:
```
Ejecución trimestral esperada = 25% del total anual (3 doceavas de 12)

Si acumulado T1 = 24.8%:
  → Ejecución normal (diferencia por redondeo)

Si acumulado T1 = 22.5%:
  → Retraso en giros (investigar causas)
```

---

## Casos de Uso

### Caso 1: Alcalde Compara su Municipio con Similares
**Escenario**: Alcalde de municipio de tamaño medio quiere compararse con otro de similar población.

**Pasos**:
1. Accede a SGP Comparativo
2. Selecciona su municipio en Entidad 1
3. Busca municipio comparable (población similar) para Entidad 2
4. Clic en "Comparar"
5. Analiza:
   - SGP per cápita (¿Quién recibe más por habitante?)
   - Distribución por sectores (¿Destinos similares?)
   - Variables certificadas (¿Por qué hay diferencias?)
6. Identifica áreas de mejora:
   - ¿Menor eficiencia fiscal? → Ver SGP Eficiencias
   - ¿Menor cobertura educativa? → Gestionar incremento de matrícula
7. Descarga reporte PDF para presentar en consejo de gobierno

**Resultado**: Benchmarking para toma de decisiones

### Caso 2: Investigador Estudia Equidad Territorial
**Escenario**: Investigador académico analiza equidad en distribución SGP entre departamentos.

**Pasos**:
1. Compara capitales departamentales (ej: Manizales vs. Pereira)
2. Exporta comparación a Excel
3. Repite para múltiples pares de ciudades
4. Consolida datos en base de datos propia
5. Calcula:
   - Coeficiente de Gini de distribución
   - Correlación entre NBI y SGP per cápita
   - Índice de equidad territorial
6. Genera visualizaciones para paper académico

**Resultado**: Análisis cuantitativo de equidad

### Caso 3: Analista DNP Genera Informe Trimestral
**Escenario**: Funcionario del DNP prepara informe trimestral para directivas.

**Pasos**:
1. Accede al panel de Informe Trimestral
2. Selecciona:
   - Vigencia: 2026
   - Trimestre: T2 (Abril-Junio)
3. Descarga PDF del informe
4. Revisa contenido:
   - Giros efectuados en T2
   - Comparación T2 vs. T1
   - Acumulado semestral
5. Identifica:
   - Sectores con retrasos en giros
   - Entidades con diferencias significativas
6. Complementa con análisis propio
7. Presenta en reunión de seguimiento

**Resultado**: Informe de seguimiento trimestral

### Caso 4: Auditor Valida Distribución Equitativa
**Escenario**: Auditor verifica que distribución SGP sea equitativa según criterios legales.

**Pasos**:
1. Compara dos municipios con población similar
2. Revisa tabla de variables certificadas
3. Valida que diferencias en SGP se expliquen por:
   - Diferencias en NBI (criterio legal)
   - Diferencias en matrícula (criterio legal)
   - Diferencias en eficiencia (criterio legal)
4. Si hay diferencia NO explicada por variables:
   - Revisa decretos en SGP Documentos Anexos
   - Valida cálculos manualmente
   - Documenta hallazgo si persiste anomalía
5. Genera reporte de auditoría con evidencia

**Resultado**: Validación de cumplimiento normativo

---

## Ver También

### Documentación Relacionada
- [03-01. SGP Resumen](./03-01-sgp-resumen.md) - Datos individuales de cada entidad
- [03-05. SGP Histórico](./03-05-sgp-historico.md) - Serie histórica para análisis temporal
- [03-06. SGP Eficiencias](./03-06-sgp-eficiencias.md) - Variables de eficiencia fiscal y administrativa

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-comparativa/`
- **Servicio API**:
  - `sicodisApiService.getSgpComparativa()`
  - `sicodisApiService.getSgpInformeTrimestral()`
- **Interfaces**: `ComparativaEntidades`, `InformeTrimestral`

### Normatividad
- **Ley 715 de 2001**: Criterios de distribución
- **Ley 1176 de 2007**: Ajustes a distribución
- [07-01. Metodologías de Cálculo](../07-apendices/07-01-metodologias-calculo.md)

### Glosario
- **Per cápita**: Por cada habitante
- **Benchmarking**: Comparación con referentes
- **Variable certificada**: Dato oficial usado para distribución
- **Puntos porcentuales (pp)**: Diferencia entre porcentajes

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
