# 5.2 Regionalización - Programación

## 5.2.1 Descripción General

El módulo **Regionalización - Programación** permite consultar la distribución territorial del Presupuesto General de la Nación en su fase de programación inicial. Este módulo presenta cómo se planea distribuir la inversión pública nacional entre los diferentes departamentos del país al inicio de cada vigencia fiscal.

**Ruta de acceso:** `/pgn-regionalizacion`

**Propósito principal:**
Visualizar la asignación territorial planeada de recursos del PGN de inversión, identificando qué parte del presupuesto se regionaliza en departamentos específicos, qué parte tiene alcance nacional, y qué recursos están pendientes de regionalizar.

**Información presentada:**
- Presupuesto total de inversión del PGN
- Inversión regionalizada (asignada a departamentos específicos)
- Inversión de alcance nacional (no regionalizable)
- Inversión por regionalizar (aún sin asignación territorial)
- Distribución departamental del presupuesto regionalizado
- Inversión per cápita por departamento

## 5.2.2 Datos y Métricas Principales

### Presupuesto Total de Inversión PGN

Representa el monto total de recursos destinados a inversión en el Presupuesto General de la Nación para la vigencia seleccionada.

**Composición:**
```
Presupuesto Total PGN = Regionalizado + Nacional + Por Regionalizar
```

**Características:**
- Corresponde a la apropiación inicial de inversión
- Excluye gastos de funcionamiento y servicio de la deuda
- Se expresa en pesos colombianos corrientes
- Puede modificarse durante la vigencia mediante adiciones o reducciones

### Presupuesto Regionalizado

**Definición:** Recursos de inversión del PGN que se han asignado a departamentos o municipios específicos porque los proyectos se ejecutarán físicamente en esos territorios.

**Ejemplos de inversión regionalizada:**
- Construcción de vías terciarias en un municipio específico
- Obras de acueducto en un departamento determinado
- Infraestructura educativa en localidades identificadas
- Proyectos de electrificación rural en zonas específicas

**Importancia:**
- Permite conocer la inversión directa del Gobierno Nacional en cada territorio
- Facilita análisis de equidad regional
- Apoya la planificación territorial coordinada
- Mejora la transparencia sobre el destino de los recursos

### Presupuesto Nacional

**Definición:** Recursos de inversión cuyo beneficio se extiende a todo el país o que por su naturaleza no pueden asignarse a un territorio específico.

**Ejemplos de inversión nacional:**
- Sistemas de información nacionales
- Defensa y seguridad con alcance nacional
- Relaciones internacionales
- Programas de investigación de cobertura nacional
- Infraestructura de telecomunicaciones de alcance nacional
- Fortalecimiento institucional del nivel central

**Características:**
- No implica menor beneficio para los territorios
- Sus efectos se distribuyen en todo el país
- Incluye bienes públicos de alcance nacional
- Puede incluir gastos de administración de programas nacionales

### Presupuesto Por Regionalizar

**Definición:** Recursos de inversión que al momento de la programación inicial no tienen asignación territorial específica, pero que potencialmente se regionalizarán durante la ejecución.

**Razones para presupuesto por regionalizar:**
- Proyectos en fase de estructuración o viabilización
- Programas con asignación territorial definida en ejecución
- Recursos de convocatorias competitivas aún sin adjudicar
- Inversiones cuya localización depende de procesos participativos

**Comportamiento esperado:**
- Disminuye durante la vigencia a medida que se definen localizaciones
- Puede reclasificarse como regionalizado o nacional
- Requiere seguimiento para garantizar su ejecución

### Distribución Departamental

El módulo presenta la distribución del presupuesto regionalizado entre los 32 departamentos de Colombia y el Distrito Capital.

**Métricas por departamento:**

1. **Presupuesto Total Departamental**
   - Suma de todos los recursos regionalizados en el departamento
   - Incluye proyectos de alcance departamental y municipal
   - Expresado en pesos corrientes

2. **Presupuesto Per Cápita**
   - Inversión regionalizada por habitante del departamento
   - Cálculo: Presupuesto Departamental / Población Departamental
   - Permite comparaciones de equidad considerando tamaño poblacional
   - Expresado en pesos por habitante

**Fórmula:**
```
Inversión Per Cápita = Presupuesto Regionalizado Departamento / Población Departamento
```

**Utilidad del indicador per cápita:**
- Compara departamentos de diferentes tamaños poblacionales
- Identifica inequidades regionales en la asignación de recursos
- Considera la densidad poblacional en el análisis
- Apoya criterios de equidad territorial

## 5.2.3 Controles y Filtros

El módulo ofrece diversos controles para personalizar la consulta de información:

### Vigencia (Año Fiscal)

**Función:** Seleccionar el año fiscal para consultar el presupuesto.

**Opciones disponibles:**
- Años desde 2020 hasta la vigencia más reciente disponible
- Selector tipo dropdown
- Por defecto: vigencia actual o más reciente

**Consideraciones:**
- Cada vigencia tiene su propia Ley de Presupuesto
- La distribución territorial puede variar significativamente entre años
- Permite análisis de series históricas

### Período (Mes)

**Función:** Seleccionar el mes hasta el cual consultar la información acumulada.

**Opciones disponibles:**
- Meses de Enero a Diciembre
- La apropiación puede variar por mes debido a modificaciones presupuestales
- Por defecto: último mes con información disponible

**Nota importante:**
En el módulo de Programación, el período permite visualizar el presupuesto vigente al cierre del mes seleccionado, incluyendo modificaciones (adiciones, reducciones, traslados) realizadas hasta ese momento.

### Departamento

**Función:** Filtrar la información para visualizar un departamento específico o todos los departamentos.

**Opciones disponibles:**
- "Todos" (opción predeterminada): Muestra la información agregada nacional
- 32 departamentos de Colombia
- Distrito Capital de Bogotá

**Comportamiento del filtro:**

**Cuando se selecciona "Todos":**
- La gráfica de gauge muestra la distribución total: Regionalizado, Nacional, Por Regionalizar
- La tabla resumen presenta los tres totales nacionales
- La tabla departamental muestra todos los departamentos con sus respectivas asignaciones
- Los datos se presentan a nivel nacional agregado

**Cuando se selecciona un departamento específico:**
- La gráfica de gauge se enfoca en la inversión regionalizada del departamento seleccionado
- La tabla resumen muestra únicamente la inversión para ese departamento
- La tabla departamental puede resaltar o filtrar el departamento seleccionado
- Permite análisis detallado territorial

### Fuente de Financiación

**Función:** Filtrar por origen de los recursos presupuestales.

**Opciones disponibles:**
- "Todas" (opción predeterminada): Incluye todos los recursos sin distinción de fuente
- Sistema General de Participaciones (SGP)
- Sistema General de Regalías (SGR)
- Nación (Recursos Ordinarios)
- Recursos de Capital
- Recursos Propios
- Cooperación Internacional
- Otras fuentes específicas

**Utilidad del filtro:**
- Identificar el origen de los recursos por departamento
- Analizar dependencia de fuentes específicas
- Evaluar recursos condicionados vs. recursos de libre destinación
- Apoyar gestión de cofinanciación

**Ejemplo de uso:**
Seleccionar "SGP" permite visualizar únicamente los recursos del Sistema General de Participaciones regionalizados en cada departamento, facilitando el análisis de transferencias constitucionales.

### Botones de Acción

#### Botón "Actualizar"

**Función:** Aplicar los filtros seleccionados y refrescar las visualizaciones con los nuevos criterios.

**Comportamiento:**
- Ejecuta la consulta con los parámetros seleccionados
- Actualiza todas las visualizaciones (gráfica, tablas)
- Recalcula los totales y porcentajes
- Puede mostrar indicador de carga mientras procesa

**Cuándo usar:**
- Después de modificar uno o varios filtros
- Para refrescar datos si se sospecha desactualización
- Al inicio de la consulta con parámetros personalizados

#### Botón "Limpiar"

**Función:** Restablecer todos los filtros a sus valores predeterminados.

**Valores predeterminados:**
- Vigencia: año actual o más reciente
- Período: último mes disponible
- Departamento: "Todos"
- Fuente: "Todas"

**Utilidad:**
- Volver rápidamente a la vista general
- Reiniciar consultas complejas
- Eliminar filtros aplicados anteriormente

## 5.2.4 Visualizaciones y Tablas

### Gráfica de Gauge (Medidor Circular)

El módulo presenta una gráfica tipo "gauge" o medidor circular tipo doughnut que visualiza la composición del Presupuesto Total de Inversión PGN.

**Estructura de la gráfica:**

```
┌─────────────────────────────────────────┐
│   PRESUPUESTO TOTAL PGN INVERSIÓN       │
│                                         │
│        ╭─────────────────╮             │
│       ╱   TOTAL PGN       ╲            │
│      │   $ XX Billones    │           │
│       ╲    Inversión      ╱            │
│        ╰─────────────────╯             │
│                                         │
│   ■ Regionalizado    XX%               │
│   ■ Nacional         XX%               │
│   ■ Por Regionalizar XX%               │
└─────────────────────────────────────────┘
```

**Segmentos del gauge:**

1. **Segmento Verde - Presupuesto Regionalizado**
   - Representa el porcentaje del presupuesto asignado territorialmente
   - Color distintivo para identificación rápida
   - Muestra valor absoluto y porcentaje del total

2. **Segmento Azul - Presupuesto Nacional**
   - Representa recursos de alcance nacional
   - Diferente tonalidad para distinción visual
   - Incluye valor y proporción del total

3. **Segmento Gris/Naranja - Por Regionalizar**
   - Representa recursos pendientes de asignación territorial
   - Color diferenciado para alertar sobre pendientes
   - Muestra monto y porcentaje

**Información en el centro del gauge:**
- Valor total del Presupuesto de Inversión PGN
- Expresado en pesos colombianos (billones o miles de millones)
- Etiqueta descriptiva: "Total PGN Inversión"

**Interpretación visual:**
- Un gauge con alto porcentaje en "Regionalizado" (verde) indica buena focalización territorial
- Alto porcentaje en "Nacional" (azul) sugiere inversiones de cobertura nacional
- Alto "Por Regionalizar" (gris) puede indicar proyectos en estructuración

### Tabla Resumen (3 Columnas)

Presenta en formato tabular los tres componentes principales del presupuesto.

**Estructura:**

| Concepto | Valor ($) | Porcentaje (%) |
|----------|-----------|----------------|
| Presupuesto Regionalizado | $XX,XXX,XXX,XXX | XX.X% |
| Presupuesto Nacional | $XX,XXX,XXX,XXX | XX.X% |
| Por Regionalizar | $XX,XXX,XXX,XXX | XX.X% |
| **TOTAL INVERSIÓN PGN** | **$XX,XXX,XXX,XXX** | **100%** |

**Características:**
- Valores expresados en pesos colombianos con separadores de miles
- Porcentajes con un decimal
- Fila de totales destacada (negrita o color diferente)
- Ordenamiento lógico: Regionalizado → Nacional → Por Regionalizar

**Utilidad:**
- Lectura precisa de valores (vs. visual del gauge)
- Copia de datos para análisis externos
- Referencia para cálculos adicionales

### Tabla Departamental (Distribución Territorial)

Presenta el detalle de la inversión regionalizada en cada departamento.

**Columnas de la tabla:**

1. **Departamento**
   - Nombre oficial del departamento
   - Incluye Distrito Capital (Bogotá D.C.)
   - Ordenamiento: alfabético o por monto (configurable)
   - Total de 33 filas (32 departamentos + Bogotá)

2. **Presupuesto Total ($)**
   - Monto total regionalizado en el departamento
   - Expresado en pesos colombianos
   - Formato con separadores de miles: $X.XXX.XXX.XXX
   - Suma de todos los proyectos localizados en el departamento

3. **Presupuesto Per Cápita ($)**
   - Inversión por habitante del departamento
   - Cálculo: Total Departamental / Población Departamental
   - Expresado en pesos por habitante
   - Permite comparación equitativa entre departamentos

4. **Porcentaje del Total Regionalizado (%)**
   - Participación del departamento en el total regionalizado
   - Cálculo: (Presupuesto Depto / Total Regionalizado) × 100
   - Permite identificar concentración de recursos
   - Suma total: 100%

5. **Población (habitantes)** (opcional)
   - Población proyectada del departamento para la vigencia
   - Fuente: DANE (Departamento Administrativo Nacional de Estadística)
   - Utilizada para el cálculo per cápita

**Ejemplo de estructura:**

| Departamento | Presupuesto Total | Per Cápita | % del Total | Población |
|--------------|-------------------|------------|-------------|-----------|
| Antioquia | $500.000.000.000 | $75.000 | 15.0% | 6.677.000 |
| Bogotá D.C. | $450.000.000.000 | $55.000 | 13.5% | 8.181.000 |
| Valle del Cauca | $300.000.000.000 | $65.000 | 9.0% | 4.618.000 |
| ... | ... | ... | ... | ... |
| **TOTAL** | **$3.333.333.333.333** | **$65.000** | **100%** | **51.300.000** |

**Funcionalidades de la tabla:**

1. **Ordenamiento:**
   - Clic en encabezados de columna para ordenar
   - Ascendente/descendente
   - Útil para identificar extremos (mayor/menor inversión)

2. **Búsqueda/Filtro:**
   - Campo de búsqueda para localizar departamento específico
   - Filtrado dinámico de resultados

3. **Paginación:**
   - Si hay muchos registros, navegación por páginas
   - Opción de mostrar todos los departamentos

4. **Fila de totales:**
   - Última fila con totales nacionales
   - Permite verificación de consistencia
   - Resalta visualmente (color o formato diferente)

**Interpretación de la tabla:**

- **Presupuesto Total alto:** Departamentos con mayor inversión absoluta (generalmente los más poblados o con grandes proyectos de infraestructura)
- **Per Cápita alto:** Departamentos con mayor inversión relativa por habitante (puede incluir regiones menos pobladas con proyectos significativos)
- **Porcentaje alto:** Concentración de recursos en pocos departamentos
- **Análisis comparativo:** Permite identificar inequidades o priorización regional

## 5.2.5 Funcionalidad de Descarga

### Descarga en Excel

El módulo permite descargar la información presentada en formato Excel para análisis offline.

**Botón de descarga:**
- Ubicación: Generalmente en la parte superior derecha o junto a las tablas
- Icono: Símbolo de Excel o descarga
- Etiqueta: "Descargar Excel" o "Exportar a Excel"

**Contenido del archivo descargado:**

El archivo Excel generalmente incluye múltiples hojas:

1. **Hoja "Resumen Nacional":**
   - Información de los filtros aplicados (Vigencia, Período, Fuente)
   - Tabla resumen con los tres componentes del presupuesto
   - Totales y porcentajes

2. **Hoja "Distribución Departamental":**
   - Tabla completa de distribución por departamento
   - Todas las columnas: Departamento, Presupuesto Total, Per Cápita, Porcentaje, Población
   - Fila de totales

3. **Hoja "Metadatos":**
   - Fecha y hora de generación del reporte
   - Filtros aplicados
   - Fuente de los datos
   - Notas metodológicas

**Formato del archivo:**
- Extensión: .xlsx (Excel moderno)
- Nombre del archivo: "PGN_Regionalizacion_Programacion_AAAA_MM.xlsx"
- Encabezados formateados
- Números con formato de miles y separadores
- Columnas ajustadas al contenido

**Usos del archivo descargado:**
- Análisis detallado en Excel (tablas dinámicas, gráficos adicionales)
- Elaboración de informes personalizados
- Comparaciones históricas (descargando varias vigencias)
- Respaldo de información para auditorías
- Compartir información con otros usuarios sin acceso al sistema

## 5.2.6 Interpretación Técnica de los Datos

### Concepto de Regionalización

**Criterios para regionalizar inversión:**

1. **Localización física del proyecto:**
   - El proyecto se ejecuta en un lugar específico identificable
   - Ejemplo: Construcción de puente en municipio X

2. **Beneficiarios directos localizados:**
   - Los beneficiarios principales residen en un territorio determinado
   - Ejemplo: Programa de vivienda rural en departamento Y

3. **Infraestructura territorial:**
   - La infraestructura queda radicada en un lugar específico
   - Ejemplo: Centro de salud en municipio Z

**Inversión NO regionalizable (Nacional):**

1. **Alcance nacional:**
   - Beneficio distribuido en todo el país
   - Ejemplo: Sistema de información meteorológica nacional

2. **Defensa y seguridad:**
   - Beneficio colectivo no atribuible a un territorio
   - Ejemplo: Adquisición de equipos militares

3. **Administración central:**
   - Funcionamiento de entidades de cobertura nacional
   - Ejemplo: Sistemas administrativos del Gobierno Nacional

4. **Relaciones internacionales:**
   - Misiones diplomáticas, cooperación internacional

### Cálculo del Presupuesto Per Cápita

El indicador de inversión per cápita es fundamental para análisis de equidad territorial.

**Fórmula:**
```
Presupuesto Per Cápita = Presupuesto Regionalizado Departamento ($) / Población Departamento (habitantes)
```

**Ejemplo de cálculo:**

| Departamento | Presupuesto Regionalizado | Población | Per Cápita |
|--------------|---------------------------|-----------|------------|
| Departamento A | $100.000.000.000 | 1.000.000 hab | $100.000/hab |
| Departamento B | $50.000.000.000 | 500.000 hab | $100.000/hab |
| Departamento C | $80.000.000.000 | 2.000.000 hab | $40.000/hab |

**Interpretación:**
- Departamentos A y B tienen la misma inversión per cápita ($100.000/hab) aunque A tiene el doble de presupuesto total
- Departamento C, pese a tener alto presupuesto total, tiene menor inversión per cápita por su mayor población
- El per cápita permite comparaciones equitativas considerando tamaño poblacional

**Consideraciones metodológicas:**

1. **Fuente de población:**
   - Proyecciones poblacionales oficiales del DANE
   - Población a mitad de año (junio 30)
   - Actualizadas para cada vigencia

2. **Limitaciones del indicador:**
   - No considera necesidades específicas de cada territorio
   - No refleja costos diferenciales (zonas remotas, clima, topografía)
   - No incluye beneficios indirectos de inversión nacional
   - Puede sobrestimar inversión en departamentos con grandes proyectos de infraestructura

3. **Complementariedad:**
   - Debe analizarse junto con otros indicadores (NBI, pobreza, ruralidad)
   - Considerar contexto de desarrollo territorial
   - Evaluar inversiones multisectoriales

### Análisis de Fuentes de Financiación

Las fuentes de financiación determinan las condiciones y restricciones de los recursos.

**Características por fuente:**

**1. Sistema General de Participaciones (SGP):**
- Transferencias constitucionales (Artículos 356 y 357 CP)
- Destinación específica por sectores: educación, salud, agua potable, propósito general
- Distribución con criterios poblacionales, pobreza, etc.
- Ejecutadas principalmente por entidades territoriales
- Representa generalmente el mayor componente de inversión territorial

**2. Sistema General de Regalías (SGR):**
- Recursos de explotación de recursos naturales no renovables
- Asignación mediante proyectos aprobados en OCAD
- Requiere cofinanciación territorial en algunos casos
- Distribución regional con criterios de producción y población

**3. Recursos Ordinarios (Nación):**
- Recursos propios del Presupuesto Nacional
- Mayor flexibilidad de destinación
- Financian proyectos estratégicos nacionales y regionales
- No tienen destinación específica preestablecida

**4. Recursos de Capital:**
- Principalmente crédito público (endeudamiento)
- Destinados generalmente a grandes obras de infraestructura
- Requieren viabilidad fiscal y capacidad de pago
- Condiciones de plazo y costo financiero

**Análisis recomendado:**
- Comparar proporción de fuentes entre departamentos
- Identificar dependencia de fuentes específicas
- Evaluar sostenibilidad de la inversión territorial
- Analizar complementariedad de fuentes

### Modificaciones Presupuestales

Durante la vigencia, el presupuesto inicial puede modificarse, afectando la distribución territorial.

**Tipos de modificaciones:**

1. **Adiciones presupuestales:**
   - Aumentan el presupuesto total
   - Provienen de nuevos recursos (excedentes, crédito, etc.)
   - Pueden crear nuevas regionalizaciones

2. **Reducciones presupuestales:**
   - Disminuyen el presupuesto
   - Por cancelación de proyectos o recortes fiscales
   - Pueden afectar regionalización planeada

3. **Traslados presupuestales:**
   - Reasignación entre rubros sin cambiar el total
   - Pueden cambiar la distribución territorial
   - Requieren justificación técnica

**Impacto en regionalización:**
- El presupuesto regionalizado puede aumentar durante la vigencia conforme se definen localizaciones
- Recursos "Por Regionalizar" tienden a disminuir
- Algunas asignaciones iniciales pueden cambiar por modificaciones de proyectos

## 5.2.7 Casos de Uso y Ejemplos Prácticos

### Caso de Uso 1: Análisis de Equidad Territorial

**Objetivo:** Evaluar si la distribución del presupuesto regionalizado es equitativa entre departamentos considerando su población.

**Pasos:**

1. **Configurar filtros:**
   - Vigencia: 2025
   - Período: Diciembre (apropiación definitiva)
   - Departamento: Todos
   - Fuente: Todas

2. **Analizar la tabla departamental:**
   - Ordenar por columna "Presupuesto Per Cápita" (descendente)
   - Identificar los 5 departamentos con mayor inversión per cápita
   - Identificar los 5 con menor inversión per cápita

3. **Descargar datos a Excel:**
   - Generar gráficos comparativos
   - Calcular coeficiente de variación
   - Identificar brechas regionales

4. **Interpretación:**
   - Alta dispersión en per cápita sugiere inequidad territorial
   - Correlacionar con indicadores de necesidades (NBI, pobreza)
   - Considerar justificaciones (proyectos grandes, zonas especiales)

**Ejemplo de hallazgos:**
- Departamento Amazónico: $500.000 per cápita (población pequeña, proyectos grandes)
- Departamento Andino: $80.000 per cápita (población alta, inversión distribuida)
- Diferencia: 6,25 veces
- Conclusión: Analizar si la diferencia se justifica por necesidades o es inequidad

### Caso de Uso 2: Planificación de Cofinanciación Departamental

**Objetivo:** Gobernación departamental identifica recursos nacionales disponibles para planificar contrapartida o complementariedad.

**Pasos:**

1. **Filtrar para el departamento específico:**
   - Vigencia: 2026 (vigencia a planear)
   - Período: Enero (apropiación inicial)
   - Departamento: [Nombre del departamento]
   - Fuente: Todas (inicialmente)

2. **Analizar el monto total regionalizado:**
   - Identificar el presupuesto total del PGN para el departamento
   - Comparar con vigencias anteriores (cambiar vigencia y comparar)

3. **Analizar por fuentes de financiación:**
   - Cambiar filtro Fuente a "SGP" → Anotar monto
   - Cambiar a "SGR" → Anotar monto
   - Cambiar a "Nación" → Anotar monto
   - Identificar potencial de cofinanciación (principalmente con Nación)

4. **Descargar información para planificación:**
   - Exportar a Excel
   - Complementar con información sectorial del módulo "Inversión por Sector"
   - Preparar plan de cofinanciación o complementariedad

**Resultado esperado:**
- Plan de inversión departamental armonizado con inversión nacional
- Identificación de oportunidades de cofinanciación
- Evitar duplicidades en la inversión territorial

### Caso de Uso 3: Seguimiento a Regionalización de Recursos

**Objetivo:** Monitorear cómo evoluciona la regionalización de recursos inicialmente clasificados como "Por Regionalizar".

**Pasos:**

1. **Consulta inicial (apropiación inicial):**
   - Vigencia: 2025
   - Período: Enero
   - Departamento: Todos
   - Fuente: Todas
   - Anotar monto "Por Regionalizar"

2. **Consultas periódicas:**
   - Cambiar Período a: Marzo, Junio, Septiembre, Diciembre
   - En cada período, verificar evolución de "Por Regionalizar"
   - Registrar incremento en "Regionalizado" y "Nacional"

3. **Análisis de tendencia:**
   ```
   Enero:     Por Regionalizar = $500.000 M
   Marzo:     Por Regionalizar = $450.000 M (↓ 10%)
   Junio:     Por Regionalizar = $350.000 M (↓ 30%)
   Diciembre: Por Regionalizar = $100.000 M (↓ 80%)
   ```

4. **Interpretación:**
   - Reducción esperada indica definición progresiva de localizaciones
   - Permanencia alta al final de vigencia puede indicar problemas en estructuración de proyectos
   - Permite alertas tempranas sobre riesgos de ejecución

### Caso de Uso 4: Análisis de Concentración Regional

**Objetivo:** Identificar si existe concentración de inversión en pocos departamentos.

**Pasos:**

1. **Consultar distribución departamental:**
   - Vigencia: 2025
   - Departamento: Todos
   - Fuente: Todas

2. **Descargar tabla departamental a Excel**

3. **Ordenar por "Presupuesto Total" descendente**

4. **Calcular concentración acumulada:**
   ```
   Top 3 departamentos: XX% del total regionalizado
   Top 5 departamentos: XX% del total regionalizado
   Top 10 departamentos: XX% del total regionalizado
   ```

5. **Generar curva de Lorenz o índice de Gini:**
   - Mide desigualdad en la distribución
   - Gini cercano a 0 = distribución equitativa
   - Gini cercano a 1 = concentración extrema

**Ejemplo de interpretación:**
- Si top 5 departamentos concentran > 60% del presupuesto regionalizado, hay alta concentración
- Analizar causas: población, proyectos grandes de infraestructura, desarrollo económico
- Evaluar políticas de redistribución regional

### Caso de Uso 5: Comparación Histórica de Asignación Territorial

**Objetivo:** Analizar cómo ha evolucionado la inversión en un departamento a lo largo de varios años.

**Pasos:**

1. **Seleccionar departamento específico:**
   - Departamento: [Nombre específico]
   - Fuente: Todas

2. **Consultar vigencias sucesivas:**
   - Vigencia: 2020, Período: Diciembre → Anotar presupuesto total
   - Vigencia: 2021, Período: Diciembre → Anotar presupuesto total
   - Vigencia: 2022, Período: Diciembre → Anotar presupuesto total
   - Vigencia: 2023, Período: Diciembre → Anotar presupuesto total
   - Vigencia: 2024, Período: Diciembre → Anotar presupuesto total

3. **Ajustar por inflación:**
   - Deflactar a pesos constantes (año base: 2024)
   - Calcular variación real año a año

4. **Graficar serie histórica:**
   ```
   Inversión Regionalizada Departamento X ($ Constantes 2024)

   $500M │                           ╱─╲
   $400M │                   ╱─╲   ╱
   $300M │         ╱─╲     ╱
   $200M │  ╱─╲  ╱
   $100M │╱
        └────────────────────────────────
         2020  2021  2022  2023  2024
   ```

5. **Interpretación:**
   - Tendencia creciente: mayor priorización del departamento
   - Tendencia decreciente: reducción de inversión (analizar causas)
   - Volatilidad: inversiones puntuales (megaproyectos)

## 5.2.8 Recomendaciones para el Análisis

### Buenas Prácticas

1. **Contextualizar los datos:**
   - No analizar cifras aisladas
   - Considerar contexto económico, social y geográfico
   - Complementar con indicadores de necesidades (NBI, pobreza, ruralidad)

2. **Usar indicadores relativos:**
   - Priorizar análisis per cápita sobre valores absolutos
   - Considerar otras variables de normalización (área, densidad, índices de necesidad)

3. **Analizar series históricas:**
   - No basar conclusiones en una sola vigencia
   - Identificar tendencias de mediano plazo
   - Ajustar por inflación para comparaciones interanuales

4. **Desagregar por fuentes:**
   - Analizar cada fuente por separado
   - Identificar dependencias y complementariedades
   - Evaluar sostenibilidad de la inversión

5. **Complementar con otros módulos:**
   - Usar "Regionalización - Seguimiento" para ver ejecución real
   - Consultar "Inversión por Sector" para entender composición temática
   - Cruzar con información de SGP y SGR para visión integral

### Limitaciones y Consideraciones

1. **Limitaciones del indicador per cápita:**
   - No refleja costos diferenciales (zonas remotas más costosas)
   - No considera economías de escala
   - Puede distorsionarse por megaproyectos puntuales

2. **Inversión nacional beneficia a todos:**
   - El presupuesto "Nacional" no es inversión "perdida" para los territorios
   - Sus beneficios se distribuyen en todo el país
   - Ejemplos: sistemas de información, seguridad, ciencia y tecnología

3. **Programación vs. Ejecución:**
   - La programación es una intención, no garantiza ejecución
   - Consultar módulo de Seguimiento para conocer realización efectiva
   - Diferencias entre programado y ejecutado son comunes

4. **Datos agregados:**
   - La regionalización departamental suma proyectos municipales
   - Para análisis municipal específico, usar filtros o datos desagregados
   - Pueden existir concentraciones intra-departamentales

5. **Actualización de datos:**
   - Verificar fecha de última actualización
   - Modificaciones presupuestales cambian las cifras durante la vigencia
   - Usar siempre período Diciembre para apropiación definitiva

### Preguntas Clave para el Análisis

Al analizar la información de regionalización en programación, considere:

1. **Equidad territorial:**
   - ¿La distribución per cápita es equitativa?
   - ¿Existen brechas significativas entre departamentos?
   - ¿Se correlaciona la inversión con las necesidades territoriales?

2. **Composición del presupuesto:**
   - ¿Qué porcentaje está regionalizado vs. nacional?
   - ¿Es alto el componente "Por Regionalizar"?
   - ¿Qué implica esta composición para la inversión territorial?

3. **Fuentes de financiación:**
   - ¿Cuáles son las principales fuentes en cada departamento?
   - ¿Existe dependencia excesiva de una fuente?
   - ¿Hay oportunidades de diversificación?

4. **Tendencias históricas:**
   - ¿Cómo ha evolucionado la inversión en el departamento?
   - ¿Existen patrones o ciclos identificables?
   - ¿Qué eventos explican cambios significativos?

5. **Coherencia con política pública:**
   - ¿La distribución refleja prioridades del Plan Nacional de Desarrollo?
   - ¿Se alinea con estrategias de desarrollo regional?
   - ¿Responde a compromisos o acuerdos específicos?

---

**Conclusión:**

El módulo de Regionalización - Programación es una herramienta fundamental para comprender la planificación territorial de la inversión pública nacional. Su uso efectivo requiere análisis crítico, contextualización apropiada y complementariedad con otros módulos del sistema SICODIS.

Para consultas específicas o profundización en temas particulares, se recomienda:
- Contactar al Departamento Nacional de Planeación
- Consultar la Ley de Presupuesto de la vigencia correspondiente
- Revisar los documentos de política pública sectorial
- Acceder a los módulos complementarios de seguimiento e inversión sectorial
