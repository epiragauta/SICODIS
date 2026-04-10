# 5.3 Regionalización - Seguimiento

## 5.3.1 Descripción General

El módulo **Regionalización - Seguimiento** permite monitorear la ejecución presupuestal del Presupuesto General de la Nación regionalizado en los diferentes departamentos del país. A diferencia del módulo de Programación que muestra la asignación inicial, este módulo presenta la materialización efectiva del presupuesto a través de las diferentes etapas del ciclo de ejecución.

**Ruta de acceso:** `/pgn-seguimiento`

**Propósito principal:**
Realizar seguimiento a la ejecución presupuestal regionalizada del PGN, monitoreando el avance de compromisos, obligaciones y pagos en cada departamento, permitiendo evaluar la eficiencia en la gestión de los recursos públicos y el cumplimiento de las metas de inversión territorial.

**Información presentada:**
- Apropiación vigente regionalizada
- Compromisos adquiridos (contratos firmados)
- Obligaciones reconocidas (servicios/bienes recibidos)
- Pagos realizados (desembolsos efectivos)
- Distribución departamental de la ejecución
- Indicadores de gestión presupuestal

## 5.3.2 Datos y Métricas Principales

### Apropiación Vigente (AP)

**Definición:** Monto máximo de recursos autorizados para gastar durante la vigencia fiscal en inversión regionalizada.

**Características:**
- Corresponde al presupuesto regionalizado disponible para el departamento
- Incluye apropiación inicial más modificaciones (adiciones, reducciones, traslados)
- Se expresa en pesos colombianos corrientes
- Varía durante la vigencia por ajustes presupuestales
- Es el techo de gasto autorizado

**Origen:**
- Apropiación inicial de la Ley de Presupuesto
- Adiciones presupuestales durante la vigencia
- Ajustes por traslados entre rubros
- Reducciones por recortes o cancelaciones

**Importancia:**
- Define el potencial máximo de inversión en el territorio
- Base para calcular indicadores de ejecución
- Referente para evaluar cumplimiento de metas

### Compromisos (COM)

**Definición:** Acuerdos contractuales firmados que afectan la apropiación presupuestal, generando obligaciones futuras para el Estado.

**Ejemplos de compromisos:**
- Contratos de obra pública
- Convenios de asociación
- Órdenes de compra de bienes y servicios
- Contratos de consultoría
- Acuerdos interadministrativos

**Características:**
- Representa la capacidad de contratación de las entidades
- No implica desembolso inmediato de recursos
- "Reserva" o "congela" parte del presupuesto
- Genera obligaciones contractuales exigibles
- Pueden abarcar una o varias vigencias fiscales

**Indicador clave:**
```
Nivel de Compromisos = (Compromisos / Apropiación Vigente) × 100
```

**Interpretación:**
- Alto nivel (>80%): Buena capacidad de contratación
- Nivel medio (50-80%): Ejecución moderada
- Bajo nivel (<50%): Dificultades en contratación o inicio tardío

**Consideraciones:**
- Los compromisos no ejecutados pueden generar rezagos presupuestales
- Compromisos tardíos (últimos meses) pueden dificultar la ejecución completa
- Alto nivel de compromisos no garantiza pagos efectivos

### Obligaciones (OBL)

**Definición:** Reconocimiento de obligaciones adquiridas por el cumplimiento de los términos contractuales, constituyendo deudas exigibles del Estado.

**Cuándo se genera una obligación:**
- El contratista entrega los bienes o servicios pactados
- Se cumplen los hitos contractuales establecidos
- Se verifica y aprueba el cumplimiento
- Se reconoce formalmente la deuda en el sistema presupuestal

**Características:**
- Representa el avance físico/técnico de los proyectos
- Constituye deuda cierta del Estado
- Puede generar cuentas por pagar si no hay pago inmediato
- Refleja la materialización de los contratos
- Base para programación de pagos

**Indicador clave:**
```
Nivel de Obligaciones sobre Compromisos = (Obligaciones / Compromisos) × 100
```

**Interpretación:**
- Alto nivel (>70%): Buen avance contractual
- Nivel medio (40-70%): Ejecución en curso
- Bajo nivel (<40%): Posibles retrasos en ejecución o contratos recién firmados

**Diferencia con compromisos:**
| Aspecto | Compromisos | Obligaciones |
|---------|-------------|--------------|
| Momento | Al firmar el contrato | Al recibir bienes/servicios |
| Naturaleza | Intención de gasto | Deuda reconocida |
| Exigibilidad | Potencial | Inmediata |
| Avance físico | No refleja | Sí refleja |

### Pagos (PAG)

**Definición:** Desembolso efectivo de recursos del Tesoro Público a los contratistas o beneficiarios, materializando el gasto público.

**Características:**
- Representa la ejecución financiera efectiva
- Impacto económico real en los territorios
- Transferencias bancarias o mecanismos de pago autorizados
- Definitivos e irreversibles
- Afectan directamente el flujo de caja del Tesoro

**Proceso de pago:**
1. Obligación reconocida y aprobada
2. Verificación de requisitos (certificados, impuestos, etc.)
3. Programación de pago en tesorería
4. Autorización de giro
5. Transferencia bancaria al beneficiario

**Indicador clave:**
```
Nivel de Pagos sobre Obligaciones = (Pagos / Obligaciones) × 100
```

**Interpretación:**
- Alto nivel (>90%): Excelente ejecución financiera
- Nivel medio (70-90%): Ejecución normal (plazos de pago estándar)
- Bajo nivel (<70%): Posibles restricciones de liquidez o demoras en trámites

**Ejecución presupuestal total:**
```
Ejecución Total = (Pagos / Apropiación Vigente) × 100
```

Este es el indicador más importante, pues refleja la materialización efectiva del presupuesto aprobado.

### Distribución Departamental de la Ejecución

El módulo presenta la ejecución presupuestal desagregada por cada uno de los 32 departamentos y el Distrito Capital.

**Métricas por departamento:**

1. **Apropiación Vigente Departamental**
   - Presupuesto regionalizado autorizado para el departamento
   - Techo de gasto del departamento en la vigencia

2. **Compromisos Departamentales**
   - Total de contratos y acuerdos firmados en el departamento
   - Indica capacidad de contratación territorial

3. **Obligaciones Departamentales**
   - Total de obligaciones reconocidas por cumplimiento contractual
   - Refleja avance físico de proyectos en el departamento

4. **Pagos Departamentales**
   - Total de recursos efectivamente desembolsados en el departamento
   - Impacto económico real territorial

5. **Indicadores de Gestión Departamental**
   - % de Compromisos: (COM/AP) × 100
   - % de Obligaciones: (OBL/COM) × 100
   - % de Pagos: (PAG/OBL) × 100
   - % de Ejecución Total: (PAG/AP) × 100

**Utilidad de la distribución departamental:**
- Identificar territorios con buen desempeño en ejecución
- Detectar departamentos con rezagos o dificultades
- Focalizar asistencia técnica en gestión presupuestal
- Evaluar comparativamente la gestión territorial
- Apoyar decisiones de reasignación de recursos

## 5.3.3 Controles y Filtros

El módulo ofrece controles específicos para consultar y analizar la ejecución presupuestal:

### Vigencia (Año Fiscal)

**Función:** Seleccionar el año fiscal para consultar la ejecución presupuestal.

**Opciones disponibles:**
- Años desde 2020 hasta la vigencia actual
- Selector tipo dropdown
- Por defecto: vigencia actual

**Consideraciones:**
- Cada vigencia tiene su propio ciclo de ejecución
- Comparar vigencias permite análisis de tendencias
- Vigencias cerradas muestran ejecución definitiva

### Período (Mes)

**Función:** Seleccionar el mes hasta el cual consultar la ejecución acumulada.

**Opciones disponibles:**
- Meses de Enero a Diciembre
- Ejecución acumulada desde enero hasta el mes seleccionado
- Por defecto: último mes con información disponible

**Interpretación:**
- Seleccionar "Marzo" muestra ejecución de enero-marzo (acumulada)
- Seleccionar "Diciembre" muestra ejecución anual completa
- Permite analizar evolución mensual de la ejecución

**Importancia:**
- Primeros meses (enero-marzo): ejecución baja es normal
- Meses intermedios (abril-agosto): debe haber avance significativo
- Últimos meses (septiembre-diciembre): cierre de vigencia, alta ejecución

### Región (Filtro Único en Seguimiento)

**Función:** Agrupar departamentos por región geográfica para análisis regional agregado.

**Opciones disponibles (regiones de Colombia):**
- Todas las regiones (opción predeterminada)
- **Región Andina:** Antioquia, Boyacá, Caldas, Cundinamarca, Huila, Norte de Santander, Quindío, Risaralda, Santander, Tolima
- **Región Caribe:** Atlántico, Bolívar, Cesar, Córdoba, La Guajira, Magdalena, Sucre, San Andrés y Providencia
- **Región Pacífica:** Cauca, Chocó, Nariño, Valle del Cauca
- **Región Orinoquía:** Arauca, Casanare, Meta, Vichada
- **Región Amazonía:** Amazonas, Caquetá, Guainía, Guaviare, Putumayo, Vaupés

**Características únicas:**
- Filtro exclusivo del módulo de Seguimiento (no está en Programación)
- Permite análisis de ejecución por grandes regiones
- Facilita identificación de patrones regionales de ejecución
- Útil para políticas de desarrollo regional

**Comportamiento del filtro:**

**Al seleccionar "Todas las regiones":**
- Muestra agregados nacionales
- Tabla departamental incluye todos los departamentos
- Gráfica de gauge refleja totales nacionales

**Al seleccionar una región específica:**
- Datos agregados de la región seleccionada
- Tabla departamental filtra solo departamentos de esa región
- Permite comparación intra-regional

### Departamento (Dependiente de Región)

**Función:** Filtrar para visualizar un departamento específico dentro de la región seleccionada.

**Opciones disponibles:**
- "Todos" (dentro de la región seleccionada)
- Departamentos correspondientes a la región filtrada
- 33 departamentos totales (incluyendo Bogotá D.C.)

**Interacción con filtro Región:**

**Ejemplo de cascada de filtros:**
```
1. Región: "Todas" → Departamento: [Todos los 33 departamentos]
2. Región: "Andina" → Departamento: [Solo 10 departamentos andinos]
3. Región: "Andina", Departamento: "Antioquia" → [Solo Antioquia]
```

**Utilidad de la combinación:**
- Análisis regional agregado (Región + Departamento "Todos")
- Análisis departamental específico (Región + Departamento específico)
- Comparación intra-regional facilitada

### Fuente de Financiación

**Función:** Filtrar la ejecución por origen de los recursos presupuestales.

**Opciones disponibles:**
- "Todas" (opción predeterminada)
- Sistema General de Participaciones (SGP)
- Sistema General de Regalías (SGR)
- Nación (Recursos Ordinarios)
- Recursos de Capital
- Recursos Propios
- Cooperación Internacional
- Otras fuentes específicas

**Utilidad:**
- Analizar ejecución por fuente de financiación
- Identificar fuentes con mejor/peor desempeño
- Evaluar restricciones específicas por fuente
- Apoyar gestión diferenciada según origen de recursos

**Ejemplo de análisis:**
Comparar ejecución de recursos SGP vs. Recursos Ordinarios permite identificar si existen diferencias en capacidad de ejecución según la fuente, lo que puede orientar decisiones de asignación futura.

### Botones de Acción

#### Botón "Actualizar"

**Función:** Aplicar los filtros seleccionados y refrescar las visualizaciones con la ejecución presupuestal según los criterios establecidos.

**Comportamiento:**
- Ejecuta consulta con todos los parámetros seleccionados
- Actualiza gráfica de gauge
- Recalcula tabla resumen
- Actualiza tabla departamental con indicadores
- Puede mostrar indicador de carga durante el proceso

**Cuándo usar:**
- Después de modificar cualquier filtro
- Para refrescar datos si hay actualizaciones recientes
- Al cambiar combinaciones de filtros (Región + Departamento + Fuente)

#### Botón "Limpiar"

**Función:** Restablecer todos los filtros a valores predeterminados.

**Valores predeterminados:**
- Vigencia: año actual
- Período: último mes disponible
- Región: "Todas"
- Departamento: "Todos"
- Fuente: "Todas"

**Utilidad:**
- Volver rápidamente a vista nacional completa
- Reiniciar consultas complejas
- Eliminar filtros múltiples de una sola acción

## 5.3.4 Visualizaciones y Tablas

### Gráfica de Gauge (Medidor Circular de Ejecución)

El módulo presenta un gauge tipo doughnut que visualiza el ciclo de ejecución presupuestal.

**Estructura de la gráfica:**

```
┌─────────────────────────────────────────┐
│   EJECUCIÓN PRESUPUESTAL REGIONALIZADA  │
│                                         │
│        ╭─────────────────╮             │
│       ╱   APROPIACIÓN     ╲            │
│      │   $ XX Billones    │           │
│       ╲     VIGENTE       ╱            │
│        ╰─────────────────╯             │
│                                         │
│   ■ Compromisos    XX% ($XX.XX B)      │
│   ■ Obligaciones   XX% ($XX.XX B)      │
│   ■ Pagos          XX% ($XX.XX B)      │
└─────────────────────────────────────────┘
```

**Segmentos del gauge:**

1. **Segmento Azul - Compromisos**
   - Porcentaje de la apropiación comprometida: (COM/AP) × 100
   - Representa capacidad de contratación
   - Valor absoluto y porcentaje

2. **Segmento Amarillo - Obligaciones**
   - Porcentaje de la apropiación con obligaciones: (OBL/AP) × 100
   - Representa avance contractual
   - Valor absoluto y porcentaje

3. **Segmento Verde - Pagos**
   - Porcentaje de la apropiación pagada: (PAG/AP) × 100
   - Representa ejecución financiera efectiva
   - Valor absoluto y porcentaje

**Información en el centro del gauge:**
- Valor de la Apropiación Vigente total
- Expresado en pesos colombianos (billones)
- Etiqueta: "Apropiación Vigente"

**Interpretación visual:**

**Gauge saludable (buena ejecución):**
```
      Compromisos:  85% (azul, segmento grande)
      Obligaciones: 65% (amarillo, segmento mediano)
      Pagos:        55% (verde, segmento más pequeño pero significativo)
```
Interpretación: Alta contratación, buen avance, pagos progresivos.

**Gauge con problemas:**
```
      Compromisos:  40% (azul, segmento pequeño)
      Obligaciones: 20% (amarillo, segmento muy pequeño)
      Pagos:        10% (verde, segmento mínimo)
```
Interpretación: Rezago en contratación, baja ejecución, riesgo de incumplimiento.

**Cascada lógica:**
- Compromisos ≥ Obligaciones ≥ Pagos (siempre)
- Si Compromisos > Obligaciones en gran margen: contratos sin avance
- Si Obligaciones > Pagos en gran margen: deuda acumulada (cuentas por pagar)

### Tabla Resumen de Ejecución

Presenta en formato tabular las cuatro métricas principales con sus indicadores de gestión.

**Estructura:**

| Concepto | Valor ($) | % de Apropiación | % del Anterior |
|----------|-----------|------------------|----------------|
| Apropiación Vigente | $XX,XXX,XXX,XXX | 100.0% | - |
| Compromisos | $XX,XXX,XXX,XXX | XX.X% | - |
| Obligaciones | $XX,XXX,XXX,XXX | XX.X% | XX.X% |
| Pagos | $XX,XXX,XXX,XXX | XX.X% | XX.X% |

**Columnas detalladas:**

1. **Concepto:**
   - Apropiación Vigente
   - Compromisos
   - Obligaciones
   - Pagos

2. **Valor ($):**
   - Monto absoluto en pesos colombianos
   - Formato con separadores de miles
   - Precisión: pesos enteros

3. **% de Apropiación:**
   - Cada concepto como porcentaje de la apropiación vigente
   - Apropiación = 100%
   - Compromisos/AP, Obligaciones/AP, Pagos/AP

4. **% del Anterior:**
   - Compromisos: N/A (base)
   - Obligaciones: % de los Compromisos (OBL/COM × 100)
   - Pagos: % de las Obligaciones (PAG/OBL × 100)

**Ejemplo numérico:**

| Concepto | Valor ($) | % Apropiación | % del Anterior |
|----------|-----------|---------------|----------------|
| Apropiación Vigente | $10.000.000.000.000 | 100,0% | - |
| Compromisos | $8.500.000.000.000 | 85,0% | - |
| Obligaciones | $6.500.000.000.000 | 65,0% | 76,5% |
| Pagos | $5.500.000.000.000 | 55,0% | 84,6% |

**Interpretación:**
- 85% de contratación (muy bueno)
- 76,5% de avance contractual (bueno)
- 84,6% de pagos sobre obligaciones (excelente)
- 55% de ejecución total (aceptable para período intermedio)

### Tabla Departamental de Ejecución (5 Columnas)

Presenta el detalle de la ejecución presupuestal por departamento con todas las métricas del ciclo.

**Columnas de la tabla:**

1. **Departamento**
   - Nombre oficial del departamento
   - 33 entradas (32 departamentos + Bogotá D.C.)
   - Ordenamiento configurable

2. **Apropiación Vigente ($)**
   - Presupuesto regionalizado autorizado
   - Expresado en pesos colombianos
   - Formato: $X.XXX.XXX.XXX

3. **Compromisos ($)**
   - Total de contratos firmados en el departamento
   - Formato monetario
   - Puede incluir % sobre apropiación

4. **Obligaciones ($)**
   - Total de obligaciones reconocidas
   - Formato monetario
   - Puede incluir % sobre compromisos

5. **Pagos ($)**
   - Total de pagos realizados
   - Formato monetario
   - Puede incluir % sobre obligaciones

**Columnas adicionales opcionales:**

6. **% Ejecución (PAG/AP)**
   - Indicador principal de ejecución efectiva
   - (Pagos / Apropiación Vigente) × 100

7. **Indicadores de gestión:**
   - % Compromisos (COM/AP)
   - % Obligaciones (OBL/COM)
   - % Pagos (PAG/OBL)

**Ejemplo de estructura completa:**

| Depto | Apropiación | Compromisos | Obligaciones | Pagos | % Ejec | % COM | % OBL | % PAG |
|-------|-------------|-------------|--------------|-------|--------|-------|-------|-------|
| Antioquia | $500.000 M | $425.000 M | $350.000 M | $300.000 M | 60% | 85% | 82% | 86% |
| Bogotá | $450.000 M | $400.000 M | $320.000 M | $280.000 M | 62% | 89% | 80% | 88% |
| Valle | $300.000 M | $240.000 M | $180.000 M | $150.000 M | 50% | 80% | 75% | 83% |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | **$10.000 B** | **$8.500 B** | **$6.500 B** | **$5.500 B** | **55%** | **85%** | **76,5%** | **84,6%** |

**Funcionalidades de la tabla:**

1. **Ordenamiento múltiple:**
   - Clic en cualquier encabezado para ordenar
   - Orden ascendente/descendente
   - Identificar extremos: mejor/peor ejecución

2. **Búsqueda rápida:**
   - Campo de búsqueda para localizar departamento
   - Filtrado en tiempo real

3. **Resaltado condicional:**
   - Colores según nivel de ejecución:
     - Verde: ejecución alta (>70%)
     - Amarillo: ejecución media (50-70%)
     - Rojo: ejecución baja (<50%)

4. **Fila de totales:**
   - Última fila con totales nacionales
   - Destacada visualmente
   - Permite verificar consistencia

**Interpretación de la tabla:**

**Departamento con buena ejecución:**
```
Departamento A:
  Apropiación:  $100.000 M
  Compromisos:  $90.000 M  (90% - excelente contratación)
  Obligaciones: $75.000 M  (83% de COM - buen avance)
  Pagos:        $65.000 M  (87% de OBL - excelente)
  Ejecución:    65% (muy bueno)
```

**Departamento con problemas:**
```
Departamento B:
  Apropiación:  $100.000 M
  Compromisos:  $45.000 M  (45% - baja contratación)
  Obligaciones: $20.000 M  (44% de COM - rezago)
  Pagos:        $10.000 M  (50% de OBL - morosidad)
  Ejecución:    10% (crítico)
```

Análisis: Departamento B requiere intervención urgente. Problemas desde la contratación, posibles causas: capacidad institucional, dificultades técnicas, problemas de viabilidad de proyectos.

## 5.3.5 Funcionalidad de Descarga

### Descarga en Excel

El módulo permite exportar toda la información de ejecución presupuestal en formato Excel.

**Botón de descarga:**
- Ubicación: Parte superior derecha o junto a las tablas
- Icono: Excel o símbolo de descarga
- Etiqueta: "Descargar Excel" o "Exportar Ejecución"

**Contenido del archivo descargado:**

**Hoja 1: "Resumen Ejecutivo"**
- Parámetros de consulta (Vigencia, Período, Región, Departamento, Fuente)
- Tabla resumen de ejecución nacional o filtrada
- Indicadores agregados de gestión
- Fecha y hora de generación

**Hoja 2: "Ejecución Departamental"**
- Tabla completa de todos los departamentos (o filtrados)
- Todas las columnas: Apropiación, Compromisos, Obligaciones, Pagos
- Indicadores calculados: % Ejecución, % COM, % OBL, % PAG
- Fila de totales

**Hoja 3: "Indicadores de Gestión"**
- Ranking de departamentos por ejecución
- Comparación con vigencia anterior (si disponible)
- Identificación de mejores y peores desempeños
- Alertas de rezagos críticos

**Hoja 4: "Metadatos"**
- Fuente de información (SIIF)
- Definiciones de conceptos (Apropiación, Compromisos, etc.)
- Notas metodológicas
- Contactos para consultas

**Formato del archivo:**
- Extensión: .xlsx
- Nombre: "PGN_Seguimiento_AAAA_MM_[Región]_[Departamento].xlsx"
- Encabezados formateados y fijados
- Números con formato de moneda y separadores
- Porcentajes con 1-2 decimales
- Gráficos embebidos (opcional)

**Usos del archivo:**
- Análisis de tendencias con datos históricos
- Elaboración de informes de gestión
- Presentaciones a órganos de control
- Cruces con otras bases de datos (SICEP, SGR, etc.)
- Respaldo para auditorías
- Cálculos de proyecciones de cierre

## 5.3.6 Interpretación Técnica de los Datos

### El Ciclo de Ejecución Presupuestal

El presupuesto regionalizado pasa por un ciclo secuencial que refleja el grado de materialización del gasto:

```
CICLO DE EJECUCIÓN PRESUPUESTAL - VISTA DETALLADA

Apropiación Vigente ($10.000 M)
        │
        │ 100% autorizado
        ↓
┌──────────────────────────────────────────────────────┐
│ FASE 1: COMPROMISOS ($8.500 M = 85% AP)             │
│ ───────────────────────────────────────────────────  │
│ - Firma de contratos                                 │
│ - Convenios interadministrativos                     │
│ - Órdenes de compra                                  │
│ - Afectación presupuestal                           │
│ Indicador: Capacidad de contratación                │
└──────────────────────────────────────────────────────┘
        ↓
        │ Avance de 76,5%
        ↓
┌──────────────────────────────────────────────────────┐
│ FASE 2: OBLIGACIONES ($6.500 M = 65% AP)            │
│ ───────────────────────────────────────────────────  │
│ - Entrega de bienes/servicios                       │
│ - Cumplimiento de hitos contractuales               │
│ - Verificación y aprobación                         │
│ - Reconocimiento de deuda                           │
│ Indicador: Avance físico/técnico de proyectos       │
└──────────────────────────────────────────────────────┘
        ↓
        │ Pago de 84,6%
        ↓
┌──────────────────────────────────────────────────────┐
│ FASE 3: PAGOS ($5.500 M = 55% AP)                   │
│ ───────────────────────────────────────────────────  │
│ - Programación de pago                              │
│ - Autorización de giro                              │
│ - Transferencia bancaria                            │
│ - Desembolso efectivo                               │
│ Indicador: Materialización del gasto público        │
└──────────────────────────────────────────────────────┘
        ↓
   IMPACTO TERRITORIAL
```

### Indicadores Clave de Ejecución

**1. Nivel de Compromisos (COM/AP × 100)**

**Fórmula:**
```
% Compromisos = (Compromisos / Apropiación Vigente) × 100
```

**Interpretación por rangos:**

| Rango | Calificación | Interpretación |
|-------|--------------|----------------|
| > 90% | Excelente | Alta capacidad de contratación |
| 75-90% | Muy bueno | Buena gestión contractual |
| 60-75% | Bueno | Nivel aceptable de contratación |
| 40-60% | Regular | Rezagos en contratación |
| < 40% | Crítico | Problemas graves de gestión |

**Factores que afectan:**
- Capacidad técnica de las entidades ejecutoras
- Procesos de contratación (licitaciones, invitaciones)
- Disponibilidad de estudios previos y diseños
- Viabilidad de proyectos
- Tiempos de trámites internos

**2. Nivel de Obligaciones sobre Compromisos (OBL/COM × 100)**

**Fórmula:**
```
% Avance Contractual = (Obligaciones / Compromisos) × 100
```

**Interpretación por rangos:**

| Rango | Calificación | Interpretación |
|-------|--------------|----------------|
| > 80% | Excelente | Contratos en avanzada ejecución |
| 65-80% | Muy bueno | Buen ritmo de cumplimiento |
| 50-65% | Bueno | Ejecución en curso normal |
| 35-50% | Regular | Posibles demoras en ejecución |
| < 35% | Crítico | Contratos sin avance significativo |

**Factores que afectan:**
- Complejidad técnica de los proyectos
- Plazos de ejecución contractual
- Capacidad de supervisión e interventoría
- Condiciones climáticas (proyectos de infraestructura)
- Disponibilidad de insumos y materiales
- Momento del año (contratos recientes vs. antiguos)

**3. Nivel de Pagos sobre Obligaciones (PAG/OBL × 100)**

**Fórmula:**
```
% Ejecución Financiera = (Pagos / Obligaciones) × 100
```

**Interpretación por rangos:**

| Rango | Calificación | Interpretación |
|-------|--------------|----------------|
| > 95% | Excelente | Pagos al día, sin morosidad |
| 85-95% | Muy bueno | Plazos de pago normales |
| 70-85% | Bueno | Algunos atrasos menores |
| 50-70% | Regular | Acumulación de cuentas por pagar |
| < 50% | Crítico | Crisis de liquidez o restricciones |

**Factores que afectan:**
- Disponibilidad de caja del Tesoro
- Programación de giros
- Trámites administrativos de pago
- Verificación de requisitos (tributarios, contractuales)
- Plazos contractuales de pago

**4. Ejecución Presupuestal Total (PAG/AP × 100)**

**Fórmula:**
```
% Ejecución Total = (Pagos / Apropiación Vigente) × 100
```

**Este es el indicador más importante para evaluar el cumplimiento de metas.**

**Interpretación por período del año:**

**Primer trimestre (enero-marzo):**
| Rango | Calificación |
|-------|--------------|
| > 15% | Excelente inicio |
| 8-15% | Buen inicio |
| 5-8% | Inicio lento |
| < 5% | Inicio crítico |

**Segundo trimestre (enero-junio):**
| Rango | Calificación |
|-------|--------------|
| > 40% | Muy bueno |
| 30-40% | Bueno |
| 20-30% | Regular |
| < 20% | Rezago significativo |

**Tercer trimestre (enero-septiembre):**
| Rango | Calificación |
|-------|--------------|
| > 65% | Muy bueno |
| 55-65% | Bueno |
| 40-55% | Regular, requiere aceleración |
| < 40% | Crítico, difícil cumplir meta anual |

**Cierre de vigencia (enero-diciembre):**
| Rango | Calificación |
|-------|--------------|
| > 90% | Excelente gestión |
| 80-90% | Muy buena gestión |
| 70-80% | Buena gestión |
| 60-70% | Gestión aceptable |
| < 60% | Gestión deficiente |

**Meta nacional típica:** 80-85% de ejecución al cierre de vigencia.

### Análisis del Ciclo Completo

**Cascada ideal de ejecución (vigencia completa):**
```
Apropiación:  100% ($10.000 M)
Compromisos:   90% ($9.000 M)   → 10% sin comprometer (normal)
Obligaciones:  75% ($7.500 M)   → 83% de COM (buen avance)
Pagos:         65% ($6.500 M)   → 87% de OBL (excelente pago)
```

**Ejecución total: 65% - Buena gestión**

**Problemas típicos identificables:**

**Problema 1: Baja contratación**
```
Compromisos: 40% → ALERTA: Rezago en contratación
Obligaciones: 30%
Pagos: 25%
```
Causa raíz: Problemas en la etapa inicial (contratación).
Solución: Acelerar procesos de contratación, simplificar trámites.

**Problema 2: Contratos sin avance**
```
Compromisos: 85% → Bien
Obligaciones: 35% → ALERTA: Contratos sin ejecución
Pagos: 30%
```
Causa raíz: Contratos firmados pero sin avance físico.
Solución: Fortalecer supervisión, revisar cronogramas, resolver problemas técnicos.

**Problema 3: Morosidad en pagos**
```
Compromisos: 85% → Bien
Obligaciones: 70% → Bien
Pagos: 30% → ALERTA: Obligaciones sin pagar
```
Causa raíz: Restricciones de liquidez o problemas en trámites de pago.
Solución: Mejorar programación de caja, agilizar trámites administrativos.

### Comparación Regional

El filtro de región permite análisis comparativo entre grandes regiones del país.

**Ejemplo de análisis regional:**

| Región | Apropiación | % Ejecución | % COM | % OBL | % PAG |
|--------|-------------|-------------|-------|-------|-------|
| Andina | $4.500 M | 62% | 88% | 78% | 90% |
| Caribe | $2.000 M | 48% | 75% | 70% | 88% |
| Pacífica | $1.500 M | 45% | 70% | 68% | 85% |
| Orinoquía | $800 M | 55% | 82% | 72% | 89% |
| Amazonía | $600 M | 40% | 65% | 65% | 87% |

**Interpretación:**
- **Región Andina:** Mejor desempeño (mayor capacidad institucional, mejor infraestructura)
- **Región Caribe:** Ejecución media (desafíos de capacidad institucional)
- **Región Pacífica:** Ejecución baja (dificultades de acceso, capacidad limitada)
- **Orinoquía:** Ejecución aceptable (mejora en los últimos años)
- **Amazonía:** Rezago significativo (lejanía, capacidad institucional limitada, proyectos complejos)

**Factores regionales:**
- Capacidad institucional de las entidades territoriales
- Accesibilidad y condiciones geográficas
- Complejidad de proyectos (zonas remotas)
- Disponibilidad de mano de obra calificada
- Infraestructura de apoyo (vías, servicios)

## 5.3.7 Casos de Uso y Ejemplos Prácticos

### Caso de Uso 1: Monitoreo Trimestral de Ejecución Nacional

**Objetivo:** Director de inversión pública del DNP monitorea el avance trimestral de la ejecución presupuestal regionalizada.

**Pasos:**

1. **Consulta trimestre 1 (marzo):**
   - Vigencia: 2025
   - Período: Marzo
   - Región: Todas
   - Departamento: Todos
   - Fuente: Todas

2. **Registrar indicadores:**
   ```
   Marzo:
   - Compromisos: 45% de AP
   - Obligaciones: 25% de AP
   - Pagos: 18% de AP
   ```

3. **Consulta trimestre 2 (junio):**
   - Cambiar Período a: Junio
   - Registrar nuevos indicadores

   ```
   Junio:
   - Compromisos: 72% de AP (↑ 27 pp)
   - Obligaciones: 48% de AP (↑ 23 pp)
   - Pagos: 38% de AP (↑ 20 pp)
   ```

4. **Consulta trimestre 3 (septiembre):**
   ```
   Septiembre:
   - Compromisos: 85% de AP (↑ 13 pp)
   - Obligaciones: 65% de AP (↑ 17 pp)
   - Pagos: 55% de AP (↑ 17 pp)
   ```

5. **Consulta cierre (diciembre):**
   ```
   Diciembre:
   - Compromisos: 92% de AP (↑ 7 pp)
   - Obligaciones: 78% de AP (↑ 13 pp)
   - Pagos: 70% de AP (↑ 15 pp)
   ```

**Análisis:**
- Ejecución final: 70% (aceptable, por debajo de meta de 80%)
- Patrón normal: aceleración en segundo semestre
- Diagnóstico: Inicio lento (marzo 18%), requiere mejorar primer semestre en próxima vigencia

**Decisiones:**
- Emitir directriz para acelerar contratación en primer trimestre
- Analizar causas de inicio lento por sectores
- Establecer metas trimestrales más exigentes

### Caso de Uso 2: Identificación de Departamentos con Rezago Crítico

**Objetivo:** Identificar departamentos con ejecución crítica para focalizar asistencia técnica.

**Pasos:**

1. **Consultar ejecución nacional al tercer trimestre:**
   - Vigencia: 2025
   - Período: Septiembre
   - Región: Todas
   - Departamento: Todos
   - Fuente: Todas

2. **Descargar tabla departamental a Excel**

3. **Ordenar por "% Ejecución" (PAG/AP) ascendente**

4. **Identificar departamentos con ejecución < 40%:**
   ```
   Departamentos críticos (septiembre):
   - Departamento X: 28% ejecución
   - Departamento Y: 32% ejecución
   - Departamento Z: 35% ejecución
   ```

5. **Analizar causas consultando indicadores desagregados:**

   **Departamento X:**
   ```
   Apropiación: $150.000 M
   Compromisos: $60.000 M (40% - PROBLEMA EN CONTRATACIÓN)
   Obligaciones: $42.000 M (70% de COM - aceptable)
   Pagos: $42.000 M (100% de OBL - excelente)
   ```
   Diagnóstico: Problema en fase de contratación.
   Causa probable: Capacidad de contratación limitada, estudios previos insuficientes.

   **Departamento Y:**
   ```
   Apropiación: $200.000 M
   Compromisos: $160.000 M (80% - bien)
   Obligaciones: $80.000 M (50% - PROBLEMA EN EJECUCIÓN)
   Pagos: $64.000 M (80% de OBL - bien)
   ```
   Diagnóstico: Contratos firmados pero sin avance.
   Causa probable: Problemas técnicos en ejecución, supervisión deficiente.

6. **Acciones diferenciadas:**
   - Departamento X: Asistencia en procesos de contratación
   - Departamento Y: Fortalecimiento de supervisión técnica

### Caso de Uso 3: Evaluación de Ejecución por Fuente de Financiación

**Objetivo:** Comparar desempeño de ejecución según fuente de recursos para identificar restricciones específicas.

**Pasos:**

1. **Consultar ejecución con recursos SGP:**
   - Vigencia: 2025
   - Período: Diciembre
   - Región: Todas
   - Departamento: Todos
   - Fuente: SGP

   Resultado:
   ```
   SGP:
   - Apropiación: $3.500 M
   - Ejecución (Pagos/AP): 75%
   ```

2. **Consultar ejecución con recursos Nación:**
   - Cambiar Fuente a: Nación

   Resultado:
   ```
   Nación:
   - Apropiación: $4.000 M
   - Ejecución (Pagos/AP): 68%
   ```

3. **Consultar ejecución con recursos SGR:**
   - Cambiar Fuente a: SGR

   Resultado:
   ```
   SGR:
   - Apropiación: $2.000 M
   - Ejecución (Pagos/AP): 55%
   ```

4. **Comparación:**
   ```
   Fuente      | Apropiación | Ejecución
   ──────────────────────────────────────
   SGP         | $3.500 M    | 75% (mejor)
   Nación      | $4.000 M    | 68% (media)
   SGR         | $2.000 M    | 55% (peor)
   ```

**Interpretación:**
- **SGP:** Mejor ejecución (transferencias regulares, gestión descentralizada consolidada)
- **Nación:** Ejecución media (proyectos más complejos, gestión centralizada)
- **SGR:** Menor ejecución (requisitos OCAD, cofinanciación, proyectos complejos)

**Decisiones:**
- Revisar procesos de aprobación OCAD para agilizar SGR
- Fortalecer asistencia técnica en formulación de proyectos SGR
- Analizar buenas prácticas de SGP para replicar en otras fuentes

### Caso de Uso 4: Análisis Comparativo Regional

**Objetivo:** Analizar desempeño de ejecución por regiones para identificar patrones geográficos.

**Pasos:**

1. **Consultar ejecución Región Andina:**
   - Vigencia: 2025
   - Período: Diciembre
   - Región: Andina
   - Departamento: Todos
   - Fuente: Todas

   Resultado:
   ```
   Región Andina:
   - Apropiación: $4.500 M
   - Ejecución: 72%
   - Promedio departamental: 70-75%
   ```

2. **Consultar ejecución Región Pacífica:**
   - Cambiar Región a: Pacífica

   Resultado:
   ```
   Región Pacífica:
   - Apropiación: $1.500 M
   - Ejecución: 52%
   - Promedio departamental: 48-58%
   ```

3. **Consultar ejecución Región Caribe:**
   - Cambiar Región a: Caribe

   Resultado:
   ```
   Región Caribe:
   - Apropiación: $2.000 M
   - Ejecución: 62%
   - Promedio departamental: 58-68%
   ```

4. **Análisis de brechas:**
   ```
   Brecha Andina-Pacífica: 20 puntos porcentuales
   Brecha Andina-Caribe: 10 puntos porcentuales
   ```

5. **Identificar departamentos de menor desempeño en cada región:**
   - Región Pacífica: Chocó (45%), Cauca (50%)
   - Región Caribe: La Guajira (48%), Sucre (52%)

**Interpretación:**
- Regiones con menor desarrollo institucional tienen menor ejecución
- Factores: capacidad técnica, accesibilidad, complejidad de proyectos
- Necesidad de políticas diferenciadas de apoyo técnico

**Decisiones:**
- Programa especial de asistencia técnica para Región Pacífica
- Fortalecimiento de capacidades institucionales en departamentos rezagados
- Considerar proyectos mejor adaptados a capacidades locales

### Caso de Uso 5: Proyección de Cierre de Vigencia

**Objetivo:** En septiembre, proyectar la ejecución al cierre de vigencia para tomar decisiones preventivas.

**Pasos:**

1. **Consultar ejecución acumulada a septiembre:**
   - Vigencia: 2025
   - Período: Septiembre
   - Departamento: Antioquia

   Resultado:
   ```
   Antioquia (septiembre):
   - Apropiación: $500.000 M
   - Compromisos: $450.000 M (90%)
   - Obligaciones: $325.000 M (72% de COM)
   - Pagos: $275.000 M (85% de OBL, 55% de AP)
   ```

2. **Analizar tendencia histórica:**
   - Consultar septiembre y diciembre de vigencia anterior (2024):

   ```
   Antioquia 2024:
   - Septiembre: 58% ejecución
   - Diciembre: 78% ejecución
   - Incremento últimos 3 meses: 20 puntos
   ```

3. **Proyectar cierre 2025:**
   ```
   Proyección conservadora:
   - Ejecución septiembre 2025: 55%
   - Incremento esperado (histórico): +20 pp
   - Proyección diciembre 2025: 75%
   ```

4. **Evaluar cumplimiento de meta:**
   ```
   Meta departamental: 80%
   Proyección: 75%
   Brecha: -5 puntos porcentuales
   ```

5. **Acciones preventivas (septiembre-diciembre):**
   - Identificar obligaciones pendientes de pago (acelerar trámites)
   - Acelerar aprobación de hitos en contratos en curso
   - Priorizar contratos con mayor avance para cierre rápido
   - Comunicar a entidades ejecutoras necesidad de aceleración

**Resultado esperado:**
Con acciones preventivas, lograr 78-80% de ejecución, cumpliendo meta.

## 5.3.8 Recomendaciones para el Análisis

### Buenas Prácticas en el Seguimiento

1. **Establecer periodicidad de seguimiento:**
   - Consultas mensuales para seguimiento regular
   - Análisis trimestrales para evaluaciones formales
   - Comparaciones anuales para tendencias de largo plazo

2. **Usar múltiples indicadores:**
   - No enfocarse solo en % de ejecución (PAG/AP)
   - Analizar toda la cascada: COM → OBL → PAG
   - Identificar en qué fase están los problemas

3. **Contextualizar los datos:**
   - Considerar momento del año (inicio lento es normal)
   - Comparar con vigencias anteriores (series históricas)
   - Considerar factores externos (crisis, reformas, elecciones)

4. **Desagregar el análisis:**
   - No quedarse solo en agregados nacionales
   - Analizar por departamento, región, fuente
   - Complementar con análisis sectorial (módulo "Inversión por Sector")

5. **Identificar causas raíz:**
   - Bajo nivel de compromisos → problema de contratación
   - Baja relación OBL/COM → problema de ejecución física
   - Baja relación PAG/OBL → problema de liquidez o trámites

### Alertas y Señales de Riesgo

**Alertas por período:**

**Primer trimestre (marzo):**
- Ejecución < 10%: Inicio muy lento, requiere acción
- Compromisos < 30%: Riesgo de incumplimiento anual

**Segundo trimestre (junio):**
- Ejecución < 30%: Rezago significativo
- Compromisos < 60%: Difícil alcanzar meta anual

**Tercer trimestre (septiembre):**
- Ejecución < 50%: Alto riesgo de incumplimiento
- Compromisos < 80%: Imposible alcanzar meta si no hay aceleración

**Cuarto trimestre (diciembre):**
- Ejecución < 70%: Incumplimiento de meta estándar (80%)

**Alertas por indicador:**

- **Compromisos/AP < 50% en septiembre:** Problema grave de contratación
- **Obligaciones/Compromisos < 40%:** Contratos sin avance, riesgo de incumplimiento
- **Pagos/Obligaciones < 60%:** Problemas de liquidez o morosidad crítica
- **Brecha COM-OBL > 30 pp:** Contratos firmados sin materialización

### Limitaciones y Consideraciones

1. **Rezagos presupuestales:**
   - Algunos compromisos de años anteriores se pagan en vigencia actual
   - Pueden distorsionar la relación PAG/AP
   - Considerar análisis de vigencias expiradas

2. **Modificaciones presupuestales:**
   - Adiciones durante la vigencia aumentan la apropiación
   - Pueden hacer que la ejecución (PAG/AP) aparezca más baja
   - Comparar con apropiación inicial vs. apropiación vigente

3. **Estacionalidad de la ejecución:**
   - Normal que primer semestre tenga ejecución baja
   - Aceleración típica en último trimestre
   - No alarmar innecesariamente por ejecución baja en marzo

4. **Proyectos plurianuales:**
   - Algunos proyectos abarcan varias vigencias
   - La ejecución anual puede ser baja por diseño
   - Analizar en contexto de cronograma total del proyecto

5. **Diferencias regionales estructurales:**
   - Regiones con menor capacidad institucional tendrán menor ejecución
   - No siempre es ineficiencia, puede ser limitación estructural
   - Requiere políticas de fortalecimiento institucional de largo plazo

### Complementariedad con Otros Módulos

**1. Regionalización - Programación:**
- Ver programación inicial vs. ejecución real
- Identificar brechas entre planeación y ejecución
- Analizar cambios en regionalización durante la vigencia

**2. Inversión por Sector:**
- Desagregar ejecución por sector temático
- Identificar sectores con mejor/peor desempeño
- Analizar proyectos específicos (BPIN)
- Evaluar ejecución por entidad responsable

**3. Módulos SGP y SGR:**
- Comparar ejecución de PGN con transferencias SGP
- Analizar complementariedad PGN-SGR
- Visión integral de inversión pública nacional y territorial

### Preguntas Clave para el Análisis de Seguimiento

Al analizar la ejecución presupuestal, considere:

1. **Sobre el nivel de ejecución:**
   - ¿La ejecución es adecuada para el período del año consultado?
   - ¿Cómo se compara con la vigencia anterior en el mismo período?
   - ¿Se cumplirá la meta de ejecución al cierre de vigencia?

2. **Sobre las fases del ciclo:**
   - ¿En qué fase hay problemas (contratación, ejecución, pago)?
   - ¿Los compromisos son suficientes para alcanzar la meta?
   - ¿Hay morosidad significativa (brecha OBL-PAG)?

3. **Sobre la distribución territorial:**
   - ¿Qué departamentos tienen rezagos críticos?
   - ¿Existen patrones regionales identificables?
   - ¿Qué factores explican las diferencias entre departamentos?

4. **Sobre las fuentes de financiación:**
   - ¿Hay diferencias de ejecución por fuente?
   - ¿Alguna fuente presenta restricciones específicas?
   - ¿Cómo mejorar la ejecución de fuentes con rezago?

5. **Sobre acciones correctivas:**
   - ¿Qué acciones se requieren para mejorar la ejecución?
   - ¿Dónde focalizar asistencia técnica?
   - ¿Qué entidades requieren intervención urgente?

---

**Conclusión:**

El módulo de Regionalización - Seguimiento es una herramienta esencial para monitorear la materialización efectiva de la inversión pública nacional en los territorios. Su uso eficaz requiere análisis sistemático, identificación de causas raíz de rezagos, y toma de decisiones oportunas para garantizar el cumplimiento de las metas de inversión y el impacto territorial del gasto público.

Para profundizar en el análisis o resolver dudas específicas, se recomienda:
- Complementar con el módulo "Inversión por Sector" para análisis desagregado
- Consultar directamente a las entidades ejecutoras de proyectos
- Contactar al Departamento Nacional de Planeación para orientación técnica
- Acceder a informes de ejecución presupuestal del Ministerio de Hacienda
