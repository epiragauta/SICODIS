# 3.6. SGP Eficiencias

## Información del Documento
- **Módulo**: SGP Eficiencias
- **Ruta de acceso**: `/sgp-eficiencias`
- **Componente Angular**: `sgp-eficiencias`
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

El módulo **SGP Eficiencias** permite consultar los indicadores de **eficiencia fiscal** y **eficiencia administrativa** que determinan parte de la distribución del componente de Propósito General del SGP. También proporciona acceso a las **variables censales** utilizadas en los cálculos y a las **restricciones presupuestales** establecidas por la Ley 617 de 2000.

### Objetivos
- Mostrar **indicadores de eficiencia fiscal** de las entidades territoriales
- Visualizar **indicadores de eficiencia administrativa** (Ley 617/2000)
- Proporcionar acceso a **variables censales** (población, NBI, etc.)
- Explicar la **metodología de cálculo** de eficiencias
- Facilitar el **seguimiento de restricciones** presupuestales

### Usuarios Objetivo
- Secretarías de Hacienda municipales y departamentales
- Contadores públicos y auditores fiscales
- Funcionarios de control interno
- Contralorías municipales y departamentales
- Analistas del DNP y Ministerio de Hacienda

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API Principal**: `/api/sgp/eficiencias`

**Método**: `GET /api/sgp/eficiencias/{vigencia}/{codigoDepto}/{codigoMunicipio}`

**Parámetros**:
```typescript
{
  vigencia: number,         // Año (2020-2025)
  codigoDepto: string,      // Código DANE departamento
  codigoMunicipio: string   // Código DANE municipio
}
```

### Estructura de Datos

```json
{
  "vigencia": 2025,
  "entidad": "Medellín",
  "codigoDane": "05001",
  "categoria": "Especial",

  "eficienciaFiscal": {
    "indicador": 85.5,
    "categoria": "Alta",
    "ranking": 15,
    "totalMunicipios": 1122,
    "percentil": 98.7,
    "componentesICLD": {
      "ingresosLibreDestinacion": 1500000000000,
      "transferencias": 800000000000,
      "regalias": 50000000000,
      "otros": 100000000000
    },
    "componentesGastoTotal": {
      "gastoFuncionamiento": 600000000000,
      "gastoInversion": 900000000000
    },
    "formulaAplicada": "(ICLD - Gastos Funcionamiento) / ICLD"
  },

  "eficienciaAdministrativa": {
    "cumpleLey617": true,
    "porcentajeGastoFuncionamiento": 42.5,
    "limitePermitido": 50.0,
    "margen": 7.5,
    "categoria": "Municipio",
    "restriccionAplicable": "Art. 6 Ley 617/2000",
    "gastosPersonal": 380000000000,
    "gastosGenerales": 150000000000,
    "transferenciasPagadas": 70000000000
  },

  "variablesCensales": {
    "poblacionTotal": 2569007,
    "poblacionCabecera": 2450000,
    "poblacionResto": 119007,
    "nbi": {
      "total": 128450,
      "porcentaje": 5.0,
      "vivienda": 25690,
      "servicios": 38535,
      "hacinamiento": 30000,
      "inasistenciaEscolar": 15425,
      "dependenciaEconomica": 18800
    },
    "fuente": "DANE - Censo 2018 (proyecciones 2025)"
  },

  "distribucionPropositoGeneral": {
    "totalAsignado": 143209867,
    "distribucionPorCriterio": {
      "poblacion": 57283946.8,      // 40%
      "pobreza": 57283946.8,         // 40%
      "eficienciaFiscal": 14320986.7, // 10%
      "eficienciaAdministrativa": 14320986.7 // 10%
    }
  }
}
```

### Datos de Eficiencia Disponibles

**Vigencias**: 2020-2025 (6 años disponibles)

**Nota**: Vigencia 2026 aún no disponible (se calcula con datos del año anterior).

---

## Controles y Filtros

![Filtros Eficiencias](../assets/sgp-eficiencias-filtros.png)
*Placeholder: Captura de pantalla de los filtros de vigencia y entidad*

### Panel de Filtros

#### 1. Selector de Vigencia
**Control**: Dropdown

**Valores**: 2020, 2021, 2022, 2023, 2024, 2025

**Comportamiento**:
- Valor por defecto: Vigencia más reciente (2025)
- Al cambiar, recarga indicadores de esa vigencia
- Muestra advertencia si datos son preliminares

#### 2. Selector de Departamento
**Control**: Dropdown con búsqueda

**Valores**: 33 departamentos (incluye Bogotá D.C.)

**Comportamiento**:
- Ordena alfabéticamente
- Al seleccionar, carga municipios del departamento
- Permite consulta a nivel departamental (código municipio = 000)

#### 3. Selector de Municipio
**Control**: Dropdown filtrable

**Valores**: Municipios del departamento seleccionado

**Comportamiento**:
- Deshabilitado hasta seleccionar departamento
- Búsqueda incremental
- Muestra código DANE + nombre

#### 4. Selector de Vista

**Control**: Tabs (pestañas)

**Opciones**:
- **Eficiencia Fiscal**: Indicador de eficiencia fiscal
- **Ley 617/2000**: Restricciones de gasto de funcionamiento
- **Variables Censales**: Población, NBI y otras variables
- **Distribución PG**: Cómo se calculó el Propósito General

---

## Visualizaciones

### 1. Vista Eficiencia Fiscal

![Vista Eficiencia Fiscal](../assets/sgp-eficiencias-fiscal.png)
*Placeholder: Captura de pantalla de la vista de eficiencia fiscal*

#### Card Principal: Indicador de Eficiencia
```
┌────────────────────────────────────────────────┐
│  EFICIENCIA FISCAL 2025                        │
│  Medellín (05001)                              │
│                                                │
│         🎯 85.5%                               │
│                                                │
│  Categoría: ALTA EFICIENCIA                    │
│  Ranking: 15 de 1,122 municipios               │
│  Percentil: 98.7% (Top 1.3%)                   │
└────────────────────────────────────────────────┘
```

#### Gauge Chart (Medidor)

**Tipo**: Gráfico de velocímetro semicircular

![Gauge Eficiencia](../assets/sgp-eficiencias-gauge.png)
*Placeholder: Gauge semicircular mostrando nivel de eficiencia*

**Configuración**:
```javascript
{
  type: 'doughnut',
  data: {
    datasets: [{
      data: [85.5, 14.5], // Valor + complemento a 100
      backgroundColor: ['#4CAF50', '#E0E0E0'],
      circumference: 180,
      rotation: 270
    }]
  },
  options: {
    plugins: {
      tooltip: { enabled: false },
      datalabels: {
        formatter: () => '85.5%',
        font: { size: 32, weight: 'bold' }
      }
    }
  }
}
```

**Rangos de color**:
- **0-50%**: Rojo (Baja eficiencia)
- **50-70%**: Amarillo (Eficiencia media)
- **70-85%**: Verde claro (Buena eficiencia)
- **85-100%**: Verde oscuro (Alta eficiencia)

#### Tabla de Componentes del Cálculo

| Componente | Valor | Descripción |
|------------|-------|-------------|
| **ICLD** (Ingresos Corrientes de Libre Destinación) | $1,500,000,000,000 | Ingresos sin destinación específica |
| Gastos de Funcionamiento | $600,000,000,000 | Gastos administrativos y de personal |
| **Ahorro Corriente** | $900,000,000,000 | ICLD - Gastos Funcionamiento |
| **Indicador de Eficiencia Fiscal** | **85.5%** | (Ahorro / ICLD) × 100 |

**Fórmula visible**:
```
Eficiencia Fiscal = ((ICLD - Gastos Funcionamiento) / ICLD) × 100

Cálculo para Medellín 2025:
  ICLD: $1,500,000,000,000
  Gastos Func.: $600,000,000,000
  Ahorro: $900,000,000,000

  Eficiencia = ($900 B / $1,500 B) × 100 = 60%

  (Nota: Ejemplo simplificado. Fórmula oficial puede tener ajustes adicionales)
```

#### Comparación con Promedio Nacional

![Comparación Nacional](../assets/sgp-eficiencias-comparacion.png)
*Placeholder: Gráfico comparando la entidad con promedios nacionales*

**Gráfico de barras**:
```
┌─────────────────────────────────────────┐
│                                         │
│  Medellín        ███████████████  85.5% │
│  Prom. Nacional  ████████         65.2% │
│  Prom. Antioquia ██████████       72.8% │
│                                         │
└─────────────────────────────────────────┘
```

### 2. Vista Ley 617/2000 (Eficiencia Administrativa)

![Vista Ley 617](../assets/sgp-eficiencias-ley617.png)
*Placeholder: Captura de pantalla de restricciones Ley 617*

#### Card de Cumplimiento
```
┌────────────────────────────────────────────────┐
│  CUMPLIMIENTO LEY 617 DE 2000                  │
│  Medellín (05001) - Categoría Especial         │
│                                                │
│         ✅ CUMPLE                              │
│                                                │
│  Gasto Funcionamiento: 42.5%                   │
│  Límite permitido: 50.0%                       │
│  Margen disponible: 7.5 pp                     │
└────────────────────────────────────────────────┘
```

#### Gráfico de Cumplimiento (Barra de Progreso)

![Barra Progreso 617](../assets/sgp-eficiencias-barra617.png)
*Placeholder: Barra de progreso mostrando gasto vs límite*

```
Gasto de Funcionamiento / ICLD:

0%   10%   20%   30%   40%   50%   60%   70%   80%   90%   100%
├────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
                               █████████         │
                               42.5%          Límite 50%

        ✅ CUMPLE (margen de 7.5 pp)
```

**Código de colores**:
- **Verde**: Cumple con margen (< 90% del límite)
- **Amarillo**: Cerca del límite (90-100% del límite)
- **Rojo**: Excede el límite (> 100%)

#### Tabla de Límites por Categoría

| Categoría Municipal | Población | Límite Gasto Func. / ICLD | Medellín |
|---------------------|-----------|----------------------------|----------|
| Especial | > 500,000 hab | 50% | ✅ 42.5% |
| Primera | 100,001 - 500,000 | 65% | N/A |
| Segunda | 50,001 - 100,000 | 70% | N/A |
| Tercera | 30,001 - 50,000 | 80% | N/A |
| Cuarta | 20,001 - 30,000 | 80% | N/A |
| Quinta | 10,001 - 20,000 | 80% | N/A |
| Sexta | < 10,000 | 80% | N/A |

**Nota**: Los límites departamentales son diferentes (Art. 5 Ley 617/2000).

#### Desglose de Gastos de Funcionamiento

**Gráfico de dona**:

![Desglose Gastos](../assets/sgp-eficiencias-desglose.png)
*Placeholder: Gráfico circular del desglose de gastos de funcionamiento*

| Concepto | Valor | % del Total Gasto Func. |
|----------|-------|-------------------------|
| Gastos de Personal | $380,000,000,000 | 63.3% |
| Gastos Generales | $150,000,000,000 | 25.0% |
| Transferencias Pagadas | $70,000,000,000 | 11.7% |
| **TOTAL Gasto Func.** | **$600,000,000,000** | **100%** |

### 3. Vista Variables Censales

![Vista Variables Censales](../assets/sgp-eficiencias-censales.png)
*Placeholder: Captura de pantalla de variables censales*

#### Tabla de Variables de Población

| Variable | Valor | Fuente |
|----------|-------|--------|
| **Población Total** | 2,569,007 | DANE - Proyección 2025 |
| Población Cabecera | 2,450,000 | DANE |
| Población Rural | 119,007 | DANE |
| % Población Rural | 4.6% | Calculado |

#### Necesidades Básicas Insatisfechas (NBI)

**Card resumen**:
```
┌────────────────────────────────────────────────┐
│  NECESIDADES BÁSICAS INSATISFECHAS (NBI)       │
│                                                │
│  Población en NBI: 128,450 habitantes          │
│  Porcentaje NBI: 5.0%                          │
│                                                │
│  Categoría: BAJA POBREZA                       │
│  (Promedio nacional: 14.1%)                    │
└────────────────────────────────────────────────┘
```

**Tabla de componentes NBI**:

| Componente NBI | Población Afectada | % del Total Población |
|----------------|--------------------|-----------------------|
| Vivienda inadecuada | 25,690 | 1.0% |
| Vivienda sin servicios | 38,535 | 1.5% |
| Hacinamiento crítico | 30,000 | 1.2% |
| Inasistencia escolar | 15,425 | 0.6% |
| Alta dependencia económica | 18,800 | 0.7% |
| **Total NBI** | **128,450** | **5.0%** |

**Nota**: Un hogar está en NBI si presenta AL MENOS UNO de estos componentes.

#### Gráfico de Comparación NBI

**Gráfico de barras horizontales**:

```
NBI por Departamento (Comparación):

Medellín (Antioquia)     █  5.0%
Promedio Antioquia       ███ 12.3%
Promedio Nacional        ████ 14.1%
Chocó (mayor NBI)        ███████████ 45.1%
Bogotá D.C. (menor NBI)  █ 4.2%
```

### 4. Vista Distribución Propósito General

![Vista Distribución PG](../assets/sgp-eficiencias-distribucion.png)
*Placeholder: Captura de pantalla de cómo se distribuyó el Propósito General*

#### Card Total Asignado
```
┌────────────────────────────────────────────────┐
│  PROPÓSITO GENERAL 2025                        │
│  Medellín (05001)                              │
│                                                │
│  Total Asignado: $143,209,867                  │
│                                                │
│  Distribución por criterio:                    │
└────────────────────────────────────────────────┘
```

#### Tabla de Distribución por Criterio

| Criterio | Ponderación | Monto Asignado | Cálculo Base |
|----------|-------------|----------------|--------------|
| **Población** | 40% | $57,283,946.80 | 2,569,007 hab × Factor |
| **Pobreza (NBI)** | 40% | $57,283,946.80 | 128,450 pob. NBI × Factor |
| **Eficiencia Fiscal** | 10% | $14,320,986.70 | Indicador 85.5% × Factor |
| **Eficiencia Administrativa** | 10% | $14,320,986.70 | Cumple Ley 617 × Factor |
| **TOTAL** | **100%** | **$143,209,867** | |

#### Gráfico de Torta (Distribución)

![Torta Distribución](../assets/sgp-eficiencias-torta.png)
*Placeholder: Gráfico circular mostrando distribución del PG*

**Segmentos**:
- 40% Población (azul)
- 40% Pobreza (verde)
- 10% Eficiencia Fiscal (naranja)
- 10% Eficiencia Administrativa (amarillo)

#### Comparación "Qué Pasaría Si..."

**Simulador interactivo**:

```
🧮 SIMULADOR DE EFICIENCIA

Escenario Actual:
  Eficiencia Fiscal: 85.5%
  Propósito General: $143,209,867

Escenario Simulado (si eficiencia fuera 75%):
  Eficiencia Fiscal: 75.0%
  Propósito General: $141,850,234
  Diferencia: -$1,359,633 (-0.95%)

CONCLUSIÓN: Mantener alta eficiencia fiscal genera $1.36 millones
adicionales en Propósito General.
```

---

## Funcionalidades de Exportación

### 1. Descargar Informe de Eficiencias (Excel)

**Botón**: "Descargar Informe Completo (Excel)"

**Contenido del archivo**:

**Hoja 1: "Eficiencia Fiscal"**
```
INDICADORES DE EFICIENCIA FISCAL
Entidad: Medellín (05001)
Vigencia: 2025

Concepto | Valor
---------|--------
ICLD | 1,500,000,000,000
Gastos Funcionamiento | 600,000,000,000
Ahorro Corriente | 900,000,000,000
Eficiencia Fiscal | 85.5%
Ranking Nacional | 15 / 1,122
Percentil | 98.7%
```

**Hoja 2: "Ley 617/2000"**
```
Categoría Municipal | Especial
Población | 2,569,007
Límite Gasto Func. / ICLD | 50.0%
Gasto Func. Real / ICLD | 42.5%
Cumplimiento | SÍ
Margen | 7.5 pp
```

**Hoja 3: "Variables Censales"**
- Población total, cabecera, rural
- NBI total y por componente
- Fuentes de datos

**Hoja 4: "Distribución PG"**
- Monto total Propósito General
- Distribución por criterio (40-40-10-10)
- Cálculo detallado

**Hoja 5: "Serie Histórica Eficiencias"**
```
Vigencia | Eficiencia Fiscal | Cumple 617 | NBI
---------|-------------------|------------|-----
2025 | 85.5% | SÍ | 5.0%
2024 | 84.2% | SÍ | 5.1%
2023 | 83.8% | SÍ | 5.3%
2022 | 82.5% | SÍ | 5.4%
2021 | 81.2% | SÍ | 5.6%
2020 | 80.1% | SÍ | 5.8%
```

### 2. Descargar Archivo de Propósito General (Excel)

**Botón**: "Descargar Archivo PG 2025" (en vista de Distribución PG)

**Funcionalidad**:
- Descarga archivo Excel oficial del DNP
- Contiene distribución de Propósito General para TODOS los municipios
- Permite comparación con otros municipios

**Nombre de archivo**:
```
Eficiencias Propósito General_2026.xlsx
```

**Nota**: Este es el mismo archivo disponible en módulo [SGP Archivos Descargables](./03-07-sgp-archivos-descargables.md).

### 3. Generar Certificado de Cumplimiento Ley 617

**Botón**: "Generar Certificado PDF" (solo si cumple Ley 617)

**Contenido**:
- Membrete institucional (DNP)
- Texto certificando cumplimiento de Ley 617/2000
- Datos de la entidad (nombre, código DANE, categoría)
- Indicadores (% gasto funcionamiento, límite)
- Vigencia certificada
- Fecha de generación
- Firma digital (si aplica)

**Uso**: Soporte para trámites ante entidades financieras o de control.

---

## Interpretación Técnica

### Eficiencia Fiscal - Fórmula Oficial

**Definición**: Capacidad de la entidad territorial de generar ahorro corriente.

**Fórmula**:
```
Eficiencia Fiscal = ((ICLD - Gastos de Funcionamiento) / ICLD) × 100

Donde:
  ICLD = Ingresos Corrientes de Libre Destinación

  ICLD incluye:
    - Impuestos (predial, industria y comercio, etc.)
    - Tasas y multas
    - Rentas contractuales
    - Transferencias para libre inversión
    - Otros ingresos corrientes sin destinación específica

  ICLD NO incluye:
    - Recursos del SGP con destinación específica
    - Regalías
    - Cofinanciación con destinación
    - Recursos de crédito
```

**Interpretación**:
- **EF > 80%**: Alta eficiencia (el municipio ahorra más del 80% de sus ingresos)
- **EF 60-80%**: Buena eficiencia
- **EF 40-60%**: Eficiencia media
- **EF < 40%**: Baja eficiencia (pocos recursos para inversión)

**Impacto en Propósito General**:
```
La eficiencia fiscal determina el 10% del Propósito General.

Municipio con EF = 85% recibe MAYOR asignación que uno con EF = 40%.

Diferencia estimada:
  Si municipios son idénticos en otros aspectos (población, NBI):

  Municipio A (EF 85%): Recibe $100 en PG
  Municipio B (EF 40%): Recibe $90 en PG (aprox.)

  Ventaja de eficiencia: +$10 (10% más recursos)
```

### Ley 617 de 2000 - Restricciones Presupuestales

**Objetivo**: Limitar el gasto de funcionamiento para garantizar recursos para inversión.

**Límites por Categoría Municipal**:

| Categoría | Población | Límite % (Gasto Func. / ICLD) |
|-----------|-----------|--------------------------------|
| Especial | > 500,000 | 50% |
| Primera | 100,001 - 500,000 | 65% |
| Segunda | 50,001 - 100,000 | 70% |
| Tercera a Sexta | < 50,000 | 80% |

**Límites Departamentos** (Art. 5 Ley 617):

| Categoría | ICLD Anual (SMLMV) | Límite |
|-----------|---------------------|--------|
| Especial | > 600,000 | 50% |
| Primera | 170,001 - 600,000 | 55% |
| Segunda | 122,001 - 170,000 | 60% |
| Tercera | 100,001 - 122,000 | 70% |
| Cuarta | < 100,000 | 80% |

**Consecuencias del Incumplimiento**:
1. Reducción automática de gastos al límite
2. Eliminación de cargos de planta
3. Restricción en contratación de personal
4. Supervisión de la Contraloría General
5. Sanciones al ordenador del gasto

### Variables Censales - Fuentes y Actualización

**Población**:
- **Fuente**: DANE (Departamento Administrativo Nacional de Estadística)
- **Base**: Censo Nacional de Población y Vivienda 2018
- **Actualización**: Proyecciones anuales por el DANE
- **Certificación**: Anual (publicada en marzo de cada año)

**NBI (Necesidades Básicas Insatisfechas)**:
- **Fuente**: DANE (basado en Censo 2018)
- **Metodología**: Hogar con AL MENOS UNA de estas carencias:
  1. Vivienda inadecuada (materiales precarios)
  2. Vivienda sin servicios (sin acueducto o alcantarillado)
  3. Hacinamiento crítico (> 3 personas por cuarto)
  4. Inasistencia escolar (niños 7-11 años sin escolarizar)
  5. Alta dependencia económica (> 3 personas por ocupado + baja escolaridad)

**Actualización de NBI**:
- Se actualiza solo con nuevos censos (cada 10-15 años)
- Entre censos, se usan las cifras del último censo
- Última actualización: Censo 2018
- Próximo censo programado: 2028 (estimado)

---

## Casos de Uso

### Caso 1: Secretario de Hacienda Valida Cumplimiento Ley 617
**Escenario**: Secretario verifica que el municipio cumple Ley 617 antes de cierre fiscal.

**Pasos**:
1. Accede a SGP Eficiencias
2. Selecciona vigencia actual (2025)
3. Selecciona su municipio
4. Va a pestaña "Ley 617/2000"
5. Verifica:
   - Gasto Func. / ICLD = 42.5%
   - Límite = 50%
   - Estado: ✅ CUMPLE
6. Genera certificado PDF
7. Anexa certificado a informe de gestión
8. Presenta en consejo de gobierno

**Resultado**: Validación de cumplimiento normativo

### Caso 2: Alcalde Mejora Eficiencia Fiscal para Obtener Más Recursos
**Escenario**: Alcalde quiere incrementar Propósito General mejorando eficiencia.

**Pasos**:
1. Consulta eficiencia fiscal actual: 65%
2. Consulta Propósito General actual: $120,000,000
3. Usa simulador "Qué pasaría si":
   - Simula eficiencia 75%
   - Proyección PG: $125,500,000
   - Ganancia: +$5,500,000
4. Analiza cómo mejorar eficiencia:
   - Reducir gastos de funcionamiento
   - Incrementar ICLD (mejorar recaudo tributario)
5. Diseña plan de austeridad:
   - Meta: Reducir gasto func. en 10%
   - Estrategia: Optimizar planta de personal
6. Implementa plan durante el año
7. Monitorea trimestralmente en SICODIS

**Resultado**: Incremento de recursos por mejora de eficiencia

### Caso 3: Contralor Audita Categorización Municipal
**Escenario**: Contralor verifica que la categoría del municipio sea correcta según población.

**Pasos**:
1. Accede a vista Variables Censales
2. Verifica población: 2,569,007 habitantes
3. Verifica categoría aplicada: Especial (correcto para > 500,000)
4. Verifica límite Ley 617: 50% (correcto para Especial)
5. Compara con certificación DANE (descarga de anexos)
6. Valida que no haya cambio de categoría pendiente
7. Si población hubiera bajado de 500,000:
   - Alertar sobre necesidad de recategorización
   - Nuevo límite sería 65% (categoría Primera)
8. Documenta hallazgo en papeles de trabajo

**Resultado**: Validación de correcta aplicación normativa

### Caso 4: Investigador Estudia Relación NBI-Eficiencia Fiscal
**Escenario**: Investigador analiza si municipios con menor NBI tienen mayor eficiencia.

**Pasos**:
1. Descarga archivo de eficiencias de múltiples municipios
2. Consolida datos en base de datos:
   - Código DANE
   - Población
   - NBI
   - Eficiencia Fiscal
   - Propósito General
3. Calcula correlación entre NBI y Eficiencia Fiscal
4. Genera gráfico de dispersión:
   - Eje X: % NBI
   - Eje Y: % Eficiencia Fiscal
5. Aplica regresión lineal
6. Identifica outliers (municipios atípicos)
7. Analiza casos especiales
8. Redacta conclusiones para paper académico

**Resultado**: Análisis empírico de la relación NBI-Eficiencia

---

## Ver También

### Documentación Relacionada
- [03-01. SGP Resumen](./03-01-sgp-resumen.md) - Asignación de Propósito General
- [03-07. SGP Archivos Descargables](./03-07-sgp-archivos-descargables.md) - Archivo Excel de eficiencias
- [07-01. Metodologías de Cálculo](../07-apendices/07-01-metodologias-calculo.md) - Fórmulas oficiales

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-eficiencias/`
- **Servicio API**: `sicodisApiService.getSgpEficiencias()`
- **Interfaces**: `EficienciaFiscal`, `EficienciaAdministrativa`, `VariablesCensales`

### Normatividad
- **Ley 617 de 2000**: Límites de gasto de funcionamiento
- **Ley 715 de 2001**: Artículo sobre distribución de Propósito General
- **Ley 1176 de 2007**: Criterios de eficiencia fiscal y administrativa
- [07-03. Normatividad](../07-apendices/07-03-normatividad.md)

### Fuentes de Datos Externas
- **DANE**: Población y NBI (https://www.dane.gov.co/)
- **Contaduría General de la Nación**: ICLD y gastos de funcionamiento
- **DNP**: Cálculos de eficiencia y distribución PG

### Glosario
- **ICLD**: Ingresos Corrientes de Libre Destinación
- **NBI**: Necesidades Básicas Insatisfechas
- **Ley 617**: Normativa de límites de gasto de funcionamiento
- **Eficiencia Fiscal**: Capacidad de ahorro corriente
- **Categoría Municipal**: Clasificación según población (Especial a Sexta)

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
