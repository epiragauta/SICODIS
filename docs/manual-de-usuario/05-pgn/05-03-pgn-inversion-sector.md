# 5.4 Inversión por Sector

## 5.4.1 Descripción General

El módulo **Inversión por Sector** permite consultar la inversión del Presupuesto General de la Nación desagregada por sectores temáticos, entidades ejecutoras, proyectos específicos (BPIN) y fuentes de financiación. Este módulo ofrece el mayor nivel de detalle disponible en SICODIS para el análisis de la inversión pública nacional.

**Ruta de acceso:** `/pgn-inversion-por-sector`

**Propósito principal:**
Realizar seguimiento detallado a la inversión sectorial del PGN, permitiendo analizar desde el nivel más agregado (sector temático) hasta el proyecto individual (código BPIN), identificando la distribución territorial, la entidad responsable, y la ejecución presupuestal en cada etapa del ciclo.

**Información presentada:**
- Inversión por sector temático (Salud, Educación, Transporte, etc.)
- Inversión por entidad ejecutora (Ministerios, INVIAS, etc.)
- Inversión por proyecto específico (código BPIN)
- Distribución departamental de la inversión sectorial
- Ejecución presupuestal: Apropiación, Compromisos, Obligaciones, Pagos
- Fuentes de financiación por proyecto

## 5.4.2 Datos y Métricas Principales

### Apropiación Vigente por Sector

**Definición:** Monto total de recursos autorizados para inversión en un sector temático específico durante la vigencia fiscal.

**Características:**
- Suma de apropiaciones de todos los proyectos del sector
- Incluye todas las entidades que ejecutan inversión en el sector
- Puede incluir proyectos nacionales y regionalizados
- Expresado en pesos colombianos corrientes

**Ejemplo:**
```
Sector: TRANSPORTE
  ├─ INVIAS (Instituto Nacional de Vías): $2.000.000 M
  ├─ ANI (Agencia Nacional de Infraestructura): $1.500.000 M
  ├─ Ministerio de Transporte: $300.000 M
  └─ TOTAL SECTOR TRANSPORTE: $3.800.000 M
```

### Inversión por Entidad Ejecutora

**Definición:** Recursos asignados a cada entidad del orden nacional responsable de ejecutar proyectos de inversión.

**Principales entidades ejecutoras por sector:**

**Transporte:**
- INVIAS (Instituto Nacional de Vías)
- ANI (Agencia Nacional de Infraestructura)
- Ministerio de Transporte
- Aeronáutica Civil

**Salud:**
- Ministerio de Salud y Protección Social
- Instituto Nacional de Salud
- INVIMA

**Educación:**
- Ministerio de Educación Nacional
- ICETEX
- SENA

**Agua Potable:**
- Ministerio de Vivienda, Ciudad y Territorio
- Viceministerio de Agua

**Agropecuario:**
- Ministerio de Agricultura
- INCODER / ANT (Agencia Nacional de Tierras)
- ICA

**Características:**
- Cada entidad puede ejecutar proyectos en uno o varios sectores
- Las entidades son responsables de la contratación y ejecución
- Permite evaluar gestión por entidad

### Inversión por Proyecto (BPIN)

**Definición:** Recursos asignados a proyectos individuales de inversión registrados en el Banco de Programas y Proyectos de Inversión Nacional (BPIN).

**¿Qué es el BPIN?**

El Banco de Programas y Proyectos de Inversión Nacional (BPIN) es el sistema oficial de registro de los proyectos de inversión pública del orden nacional en Colombia.

**Características del BPIN:**
- Registro único nacional de proyectos de inversión
- Administrado por el Departamento Nacional de Planeación (DNP)
- Todo proyecto de inversión debe estar registrado en BPIN para recibir recursos
- Código único identificador por proyecto
- Información técnica, financiera y de localización

**Estructura de un registro BPIN:**
```
Código BPIN: 2021011234567
  │
  ├─ Nombre del proyecto
  ├─ Sector: Transporte
  ├─ Entidad ejecutora: INVIAS
  ├─ Localización: Departamento Antioquia, Municipio Medellín
  ├─ Objetivo y descripción
  ├─ Metas e indicadores
  ├─ Duración: 2021-2025 (plurianual)
  ├─ Costo total: $50.000 M
  ├─ Apropiación vigencia actual: $15.000 M
  └─ Fuentes de financiación: Nación (70%), SGR (30%)
```

**Nivel de detalle:**
Este es el máximo nivel de desagregación disponible. Permite analizar:
- Ejecución de proyectos específicos
- Avance físico y financiero por proyecto
- Localización exacta de la inversión
- Responsables de ejecución
- Fuentes de financiación del proyecto

### Compromisos, Obligaciones y Pagos por Sector/Entidad/Proyecto

Al igual que en el módulo de Seguimiento, se presentan las cuatro métricas del ciclo de ejecución, pero ahora desagregadas por sector, entidad y proyecto.

**Métricas:**

1. **Apropiación Vigente (AP):** Presupuesto autorizado
2. **Compromisos (COM):** Contratos y acuerdos firmados
3. **Obligaciones (OBL):** Entregas recibidas y reconocidas
4. **Pagos (PAG):** Desembolsos efectivos

**Indicadores de ejecución:**
```
% Ejecución del Sector = (Pagos Sector / Apropiación Sector) × 100
% Ejecución de Entidad = (Pagos Entidad / Apropiación Entidad) × 100
% Ejecución de Proyecto = (Pagos Proyecto / Apropiación Proyecto) × 100
```

**Utilidad del análisis desagregado:**
- Identificar sectores con rezagos de ejecución
- Evaluar gestión de entidades específicas
- Monitorear avance de proyectos estratégicos
- Focalizar asistencia técnica en sectores/entidades con problemas

### Distribución Departamental por Sector

Presenta cómo se distribuye la inversión de cada sector entre los diferentes departamentos del país.

**Ejemplo de distribución sectorial:**

```
SECTOR: SALUD
Apropiación Total Nacional: $800.000 M
  │
  ├─ Regionalizado: $600.000 M
  │   ├─ Antioquia: $80.000 M (Hospital Universitario)
  │   ├─ Valle: $70.000 M (Infraestructura hospitalaria)
  │   ├─ Atlántico: $60.000 M (Centro de salud)
  │   ├─ ... otros departamentos
  │   └─ Total departamental: $600.000 M
  │
  └─ Nacional: $200.000 M (Sistemas de información, programas nacionales)
```

**Análisis posible:**
- Concentración de inversión sectorial en ciertos departamentos
- Inversión per cápita sectorial por departamento
- Priorización territorial por sector
- Complementariedad con inversión territorial (SGP Salud, por ejemplo)

## 5.4.3 Controles y Filtros

El módulo ofrece un sistema de filtros en cascada que permite navegar desde el nivel más agregado (sector) hasta el más específico (proyecto BPIN).

### Sistema de Filtros en Cascada

**Característica principal:** Los filtros están interrelacionados, cada filtro depende de la selección anterior.

```
CASCADA DE FILTROS (7 niveles):

1. Vigencia (Año)
     ↓
2. Período (Mes)
     ↓
3. Sector (Temático) → Define opciones de Entidad
     ↓
4. Entidad (Ejecutora) → Define opciones de Proyecto
     ↓
5. Proyecto (BPIN) → Define opciones disponibles
     ↓
6. Fuente de Financiación
     ↓
7. Departamento (para distribución territorial)
```

### Vigencia (Año Fiscal)

**Función:** Seleccionar el año fiscal para consultar la inversión sectorial.

**Opciones disponibles:**
- Años desde 2020 hasta la vigencia actual
- Selector tipo dropdown
- Por defecto: vigencia actual

**Consideraciones:**
- La clasificación sectorial puede variar entre vigencias
- Algunas entidades cambian de nombre o se fusionan/dividen
- Proyectos plurianuales aparecen en varias vigencias

### Período (Mes)

**Función:** Seleccionar el mes hasta el cual consultar la ejecución acumulada.

**Opciones disponibles:**
- Meses de Enero a Diciembre
- Datos acumulados desde enero hasta el mes seleccionado
- Por defecto: último mes con información disponible

**Impacto en los datos:**
- Apropiación vigente: puede variar por modificaciones presupuestales
- Compromisos, Obligaciones, Pagos: acumulados del año
- Permite seguimiento mensual de proyectos estratégicos

### Sector (Clasificación Temática)

**Función:** Seleccionar el sector temático para focalizar el análisis.

**Opciones disponibles (sectores principales):**

1. **Agropecuario**
   - Desarrollo rural
   - Agricultura y ganadería
   - Pesca y acuicultura
   - Seguridad alimentaria

2. **Agua Potable y Saneamiento Básico**
   - Acueducto
   - Alcantarillado
   - Aseo y manejo de residuos
   - Plantas de tratamiento

3. **Ambiente y Desarrollo Sostenible**
   - Conservación ambiental
   - Cambio climático
   - Biodiversidad
   - Gestión de riesgos ambientales

4. **Ciencia, Tecnología e Innovación**
   - Investigación científica
   - Desarrollo tecnológico
   - Innovación
   - Transferencia de conocimiento

5. **Comercio, Industria y Turismo**
   - Desarrollo empresarial
   - Promoción de exportaciones
   - Infraestructura turística
   - Competitividad

6. **Comunicaciones**
   - Telecomunicaciones
   - Conectividad digital
   - Infraestructura TIC
   - Inclusión digital

7. **Cultura**
   - Patrimonio cultural
   - Artes y expresiones culturales
   - Bibliotecas y museos
   - Infraestructura cultural

8. **Deporte y Recreación**
   - Infraestructura deportiva
   - Promoción del deporte
   - Actividad física
   - Juegos deportivos

9. **Educación**
   - Infraestructura educativa
   - Calidad educativa
   - Cobertura educativa
   - Educación superior

10. **Equipamiento Municipal**
    - Infraestructura institucional
    - Espacios públicos
    - Plazas de mercado
    - Mataderos municipales

11. **Fortalecimiento Institucional**
    - Capacidad institucional
    - Modernización del Estado
    - Sistemas de información
    - Transparencia y rendición de cuentas

12. **Inclusión Social y Reconciliación**
    - Atención a víctimas
    - Reintegración
    - Equidad de género
    - Grupos étnicos

13. **Justicia y Seguridad**
    - Infraestructura judicial
    - Seguridad ciudadana
    - Acceso a la justicia
    - Sistema penitenciario

14. **Minas y Energía**
    - Energía eléctrica
    - Hidrocarburos
    - Minería
    - Fuentes no convencionales de energía

15. **Salud**
    - Infraestructura hospitalaria
    - Salud pública
    - Atención en salud
    - Prevención y promoción

16. **Transporte**
    - Vías (primarias, secundarias, terciarias)
    - Puentes
    - Aeropuertos
    - Puertos marítimos y fluviales
    - Movilidad urbana

17. **Vivienda**
    - Vivienda de interés social
    - Mejoramiento habitacional
    - Titulación de predios
    - Reasentamientos

18. **Otros sectores**
    - Sectores no clasificados en categorías anteriores

**Comportamiento del filtro:**
- Al seleccionar un sector, el filtro "Entidad" se actualiza mostrando solo las entidades que ejecutan inversión en ese sector
- Permite análisis sectorial agregado (todas las entidades del sector)
- O análisis específico (sector → entidad → proyecto)

**Opción "Todos los sectores":**
- Muestra inversión agregada de todos los sectores
- Útil para visión general antes de desagregar

### Entidad Ejecutora (Dependiente de Sector)

**Función:** Seleccionar la entidad responsable de ejecutar los proyectos de inversión dentro del sector seleccionado.

**Características:**
- Opciones disponibles dependen del sector seleccionado previamente
- Una entidad puede aparecer en varios sectores
- Incluye Ministerios, Departamentos Administrativos, Agencias, Institutos

**Ejemplos de entidades por sector:**

**Sector: TRANSPORTE**
- Instituto Nacional de Vías (INVIAS)
- Agencia Nacional de Infraestructura (ANI)
- Ministerio de Transporte
- Unidad Administrativa Especial de Aeronáutica Civil
- CORMAGDALENA

**Sector: SALUD**
- Ministerio de Salud y Protección Social
- Instituto Nacional de Salud (INS)
- INVIMA
- Instituto Nacional de Cancerología

**Sector: EDUCACIÓN**
- Ministerio de Educación Nacional
- ICETEX
- SENA
- Universidades públicas

**Sector: AGUA POTABLE**
- Ministerio de Vivienda, Ciudad y Territorio
- Viceministerio de Agua y Saneamiento Básico

**Comportamiento del filtro:**
- Al seleccionar una entidad, el filtro "Proyecto" se actualiza mostrando los proyectos BPIN de esa entidad
- Permite evaluar gestión de entidades específicas
- Comparar desempeño entre entidades del mismo sector

**Opción "Todas las entidades":**
- Muestra agregado del sector completo
- Útil para análisis sectorial sin desagregar por entidad

### Proyecto (Código BPIN - Dependiente de Entidad)

**Función:** Seleccionar un proyecto específico de inversión para seguimiento detallado.

**Características:**
- Opciones disponibles dependen de la entidad seleccionada previamente
- Cada proyecto tiene código BPIN único
- Nombre descriptivo del proyecto
- Puede incluir localización en el nombre

**Formato de presentación:**
```
[Código BPIN] - [Nombre del Proyecto] - [Localización]

Ejemplo:
2021011234567 - CONSTRUCCIÓN VÍA TERCIARIA MUNICIPIO X - Antioquia
```

**Información disponible al seleccionar un proyecto:**
- Apropiación vigente del proyecto
- Ejecución presupuestal (COM, OBL, PAG)
- Distribución territorial (departamentos beneficiados)
- Fuentes de financiación del proyecto
- Indicadores de gestión específicos del proyecto

**Proyectos de alcance nacional vs. regional:**

**Proyecto regionalizado (departamental):**
```
Código: 2022010045678
Nombre: Construcción Hospital Nivel II - Municipio X
Localización: Departamento Y
Apropiación: $20.000 M
Beneficiarios: Municipio específico
```

**Proyecto de alcance nacional:**
```
Código: 2022010099999
Nombre: Sistema Nacional de Información de Salud Pública
Localización: Nacional
Apropiación: $50.000 M
Beneficiarios: Todo el país
```

**Utilidad:**
- Seguimiento a proyectos estratégicos específicos
- Rendición de cuentas sobre proyectos emblemáticos
- Control ciudadano a proyectos locales
- Evaluación de avance físico-financiero

**Opción "Todos los proyectos":**
- Muestra agregado de la entidad completa
- Útil para análisis por entidad sin desagregar por proyecto

### Fuente de Financiación

**Función:** Filtrar por origen de los recursos que financian el sector/entidad/proyecto.

**Opciones disponibles:**
- "Todas" (opción predeterminada)
- Sistema General de Participaciones (SGP)
- Sistema General de Regalías (SGR)
- Nación (Recursos Ordinarios)
- Recursos de Capital (crédito)
- Recursos Propios de Entidades
- Cooperación Internacional
- Otras fuentes específicas

**Comportamiento con filtros previos:**
- Puede aplicarse a cualquier nivel: sector, entidad o proyecto
- Algunos proyectos tienen una sola fuente
- Otros proyectos tienen cofinanciación (múltiples fuentes)

**Ejemplo de proyecto con cofinanciación:**
```
Proyecto: Construcción Acueducto Regional
Apropiación Total: $100.000 M
  ├─ Nación: $40.000 M (40%)
  ├─ SGR: $35.000 M (35%)
  ├─ SGP: $20.000 M (20%)
  └─ Departamento: $5.000 M (5%)
```

Al filtrar por fuente "SGR", se mostraría solo la parte del proyecto financiada con regalías ($35.000 M).

**Utilidad del análisis por fuente:**
- Identificar dependencia de financiación externa
- Evaluar ejecución por fuente (algunas fuentes tienen mejores indicadores)
- Analizar sostenibilidad de proyectos
- Identificar oportunidades de cofinanciación

### Departamento (Distribución Territorial)

**Función:** Filtrar para visualizar la distribución territorial de la inversión sectorial/entidad/proyecto.

**Opciones disponibles:**
- "Todos" (vista nacional)
- 32 departamentos
- Distrito Capital (Bogotá)

**Interacción con filtros previos:**
- Muestra qué parte de la inversión del sector/entidad/proyecto se localiza en el departamento
- Proyectos nacionales no aparecen en filtros departamentales específicos
- Proyectos regionalizados se asignan a departamentos

**Ejemplo de análisis:**
```
Filtros seleccionados:
- Sector: SALUD
- Entidad: Todas
- Proyecto: Todos
- Fuente: Todas
- Departamento: ANTIOQUIA

Resultado:
Muestra todos los proyectos de salud (todas las entidades, todas las fuentes) que se ejecutan en Antioquia.
```

**Utilidad:**
- Análisis territorial de inversión sectorial
- Identificar departamentos priorizados por sector
- Evaluar inversión sectorial per cápita departamental
- Planificación territorial coordinada

### Botones de Acción

#### Botón "Actualizar"

**Función:** Aplicar todos los filtros seleccionados y refrescar las visualizaciones.

**Proceso:**
1. Validar combinación de filtros
2. Consultar base de datos con filtros aplicados
3. Calcular agregados e indicadores
4. Actualizar gráfica de gauge
5. Actualizar tabla resumen
6. Actualizar tabla departamental

**Comportamiento:**
- Puede mostrar indicador de carga (spinner) durante procesamiento
- Si no hay datos para la combinación seleccionada, muestra mensaje informativo
- Recalcula todos los porcentajes con los nuevos datos filtrados

**Cuándo usar:**
- Después de cambiar cualquier filtro en la cascada
- Para refrescar datos si hay actualizaciones
- Al realizar análisis con múltiples combinaciones de filtros

#### Botón "Limpiar"

**Función:** Restablecer todos los filtros a valores predeterminados.

**Valores predeterminados:**
- Vigencia: año actual
- Período: último mes disponible
- Sector: Todos los sectores
- Entidad: Todas las entidades
- Proyecto: Todos los proyectos
- Fuente: Todas las fuentes
- Departamento: Todos

**Utilidad:**
- Volver rápidamente a vista general nacional
- Reiniciar análisis complejos con múltiples filtros
- Eliminar selecciones previas de una sola acción

**Nota:** Después de "Limpiar", es necesario presionar "Actualizar" para aplicar el cambio.

## 5.4.4 Visualizaciones y Tablas

### Gráfica de Gauge (Medidor de Ejecución Sectorial)

Similar a los otros módulos PGN, presenta un gauge tipo doughnut con la ejecución presupuestal, pero ahora filtrado por sector/entidad/proyecto según los filtros aplicados.

**Estructura:**

```
┌─────────────────────────────────────────┐
│   EJECUCIÓN: [SECTOR] - [ENTIDAD]      │
│            [PROYECTO]                   │
│                                         │
│        ╭─────────────────╮             │
│       ╱   APROPIACIÓN     ╲            │
│      │   $ XXX.XXX M      │           │
│       ╲     VIGENTE       ╱            │
│        ╰─────────────────╯             │
│                                         │
│   ■ Compromisos    XX% ($XX M)         │
│   ■ Obligaciones   XX% ($XX M)         │
│   ■ Pagos          XX% ($XX M)         │
└─────────────────────────────────────────┘
```

**Título dinámico:**
Se ajusta según filtros aplicados:

**Ejemplo 1: Solo sector seleccionado**
```
EJECUCIÓN SECTOR: TRANSPORTE
Apropiación: $3.800.000 M
```

**Ejemplo 2: Sector + Entidad**
```
EJECUCIÓN: TRANSPORTE - INVIAS
Apropiación: $2.000.000 M
```

**Ejemplo 3: Sector + Entidad + Proyecto**
```
EJECUCIÓN: TRANSPORTE - INVIAS
Proyecto: Construcción Vía Terciaria Municipio X
Apropiación: $50.000 M
```

**Segmentos del gauge:**
1. **Compromisos:** % de apropiación comprometida
2. **Obligaciones:** % de apropiación con obligaciones
3. **Pagos:** % de apropiación pagada (ejecución efectiva)

**Interpretación específica por nivel:**

**Nivel Sector:**
- Permite comparar ejecución entre sectores
- Identificar sectores con rezagos estructurales
- Evaluar capacidad de gestión sectorial agregada

**Nivel Entidad:**
- Evaluar gestión de entidades específicas
- Comparar entidades dentro del mismo sector
- Identificar mejores prácticas

**Nivel Proyecto:**
- Seguimiento detallado a proyectos estratégicos
- Evaluar avance físico-financiero
- Control ciudadano y rendición de cuentas

### Tabla Resumen de Ejecución

Presenta las métricas del ciclo de ejecución para el nivel de desagregación seleccionado.

**Estructura:**

| Concepto | Valor ($) | % de Apropiación | % del Anterior |
|----------|-----------|------------------|----------------|
| Apropiación Vigente | $XXX,XXX,XXX | 100,0% | - |
| Compromisos | $XXX,XXX,XXX | XX.X% | - |
| Obligaciones | $XXX,XXX,XXX | XX.X% | XX.X% |
| Pagos | $XXX,XXX,XXX | XX.X% | XX.X% |

**Información adicional en la tabla (opcional):**
- Nombre del sector/entidad/proyecto
- Código BPIN (si es proyecto específico)
- Fuente de financiación (si está filtrado)
- Departamento (si está filtrado)

**Ejemplo de tabla para proyecto específico:**

| Concepto | Valor ($) | % Apropiación | % del Anterior |
|----------|-----------|---------------|----------------|
| **Proyecto:** Construcción Vía Terciaria Municipio X | | | |
| **Código BPIN:** 2022010045678 | | | |
| **Sector:** Transporte | **Entidad:** INVIAS | **Depto:** Antioquia | |
| Apropiación Vigente | $50.000.000.000 | 100,0% | - |
| Compromisos | $45.000.000.000 | 90,0% | - |
| Obligaciones | $30.000.000.000 | 60,0% | 66,7% |
| Pagos | $25.000.000.000 | 50,0% | 83,3% |

**Interpretación:**
- 90% de contratación (excelente)
- 66,7% de avance contractual (aceptable)
- 83,3% de pagos sobre obligaciones (muy bueno)
- 50% de ejecución total (bueno para proyecto en curso)

### Tabla Departamental (5 Columnas + Indicadores)

Presenta la distribución territorial de la inversión del sector/entidad/proyecto seleccionado.

**Columnas principales:**

1. **Departamento**
   - Nombre del departamento
   - Solo departamentos con inversión en el sector/entidad/proyecto filtrado
   - Puede ser menos de 33 si el sector no tiene presencia en todos los departamentos

2. **Apropiación Vigente ($)**
   - Presupuesto asignado al departamento en el sector/entidad/proyecto
   - Formato monetario con separadores

3. **Compromisos ($)**
   - Contratos firmados en el departamento
   - Formato monetario

4. **Obligaciones ($)**
   - Obligaciones reconocidas
   - Formato monetario

5. **Pagos ($)**
   - Desembolsos efectivos en el departamento
   - Formato monetario

**Columnas de indicadores (opcionales):**

6. **% Ejecución (PAG/AP)**
   - Indicador principal de ejecución
   - Permite comparar ejecución entre departamentos

7. **% Participación**
   - Participación del departamento en el total del sector/entidad
   - (Apropiación Depto / Total Apropiación) × 100

**Ejemplo de tabla sectorial (SECTOR: SALUD):**

| Depto | Apropiación | Compromisos | Obligaciones | Pagos | % Ejec | % Part |
|-------|-------------|-------------|--------------|-------|--------|--------|
| Antioquia | $80.000 M | $72.000 M | $60.000 M | $55.000 M | 68,8% | 13,3% |
| Valle | $70.000 M | $63.000 M | $50.000 M | $45.000 M | 64,3% | 11,7% |
| Atlántico | $60.000 M | $54.000 M | $42.000 M | $38.000 M | 63,3% | 10,0% |
| Bogotá | $90.000 M | $85.000 M | $72.000 M | $68.000 M | 75,6% | 15,0% |
| Cundinamarca | $40.000 M | $35.000 M | $28.000 M | $24.000 M | 60,0% | 6,7% |
| ... | ... | ... | ... | ... | ... | ... |
| **TOTAL** | **$600.000 M** | **$540.000 M** | **$450.000 M** | **$400.000 M** | **66,7%** | **100%** |

**Análisis posible:**
- Bogotá tiene mayor inversión absoluta en salud ($90.000 M) y mejor ejecución (75,6%)
- Antioquia tiene segunda mayor inversión pero ejecución menor
- Cundinamarca tiene la menor ejecución del grupo (60%), requiere atención

**Funcionalidades de la tabla:**

1. **Ordenamiento:**
   - Clic en encabezados para ordenar
   - Identificar departamentos con mayor/menor inversión sectorial
   - Identificar mejores/peores ejecutores sectoriales

2. **Búsqueda:**
   - Localizar departamento específico rápidamente
   - Útil en sectores con presencia en muchos departamentos

3. **Resaltado condicional:**
   - Colores según nivel de ejecución:
     - Verde: > 70%
     - Amarillo: 50-70%
     - Rojo: < 50%

4. **Exportación:**
   - Datos listos para copiar o exportar
   - Facilita análisis externos

## 5.4.5 Funcionalidad de Descarga

### Descarga en Excel

El módulo permite exportar información detallada en formato Excel, con mayor nivel de detalle que otros módulos.

**Botón de descarga:**
- Ubicación: Generalmente junto a las tablas o en la parte superior
- Icono: Excel o descarga
- Etiqueta: "Descargar Excel" o "Exportar Datos"

**Contenido del archivo descargado:**

**Hoja 1: "Parámetros de Consulta"**
- Vigencia seleccionada
- Período consultado
- Sector seleccionado (o "Todos")
- Entidad seleccionada (o "Todas")
- Proyecto seleccionado (o "Todos")
- Fuente seleccionada (o "Todas")
- Departamento seleccionado (o "Todos")
- Fecha y hora de generación del reporte

**Hoja 2: "Resumen Ejecutivo"**
- Tabla resumen con AP, COM, OBL, PAG
- Indicadores de gestión agregados
- Nombre del sector/entidad/proyecto
- Código BPIN (si aplica)

**Hoja 3: "Distribución Departamental"**
- Tabla completa de distribución territorial
- Todas las columnas: Depto, AP, COM, OBL, PAG
- Indicadores: % Ejecución, % Participación
- Fila de totales

**Hoja 4: "Detalle de Proyectos" (si aplicable)**
- Listado de proyectos BPIN incluidos en el sector/entidad consultado
- Código BPIN
- Nombre del proyecto
- Entidad ejecutora
- Localización
- Apropiación y ejecución por proyecto

**Hoja 5: "Fuentes de Financiación" (si aplicable)**
- Distribución por fuentes de financiación
- Monto y porcentaje de cada fuente
- Ejecución por fuente

**Hoja 6: "Comparativo Vigencias" (opcional)**
- Comparación con vigencia(s) anterior(es)
- Variación absoluta y porcentual
- Tendencia de inversión sectorial

**Hoja 7: "Metadatos y Definiciones"**
- Definiciones de conceptos (BPIN, sectores, fuentes)
- Metodología de cálculo de indicadores
- Fuentes de información (SIIF, BPIN)
- Notas aclaratorias
- Contactos para consultas

**Formato del archivo:**
- Extensión: .xlsx
- Nombre: "PGN_InversionSectorial_[Sector]_[Entidad]_AAAA_MM.xlsx"
- Encabezados formateados y fijados
- Formatos numéricos con separadores
- Gráficos embebidos (opcional)
- Tablas dinámicas (opcional)

**Usos del archivo descargado:**
- Análisis detallado de inversión sectorial
- Informes de gestión por entidad
- Seguimiento a proyectos estratégicos
- Evaluación de impacto territorial sectorial
- Auditorías y control fiscal
- Investigación académica
- Planificación de cofinanciación sectorial

## 5.4.6 Interpretación Técnica de los Datos

### El BPIN: Banco de Programas y Proyectos de Inversión Nacional

**Marco normativo:**
- Ley 152 de 1994 (Ley Orgánica del Plan de Desarrollo)
- Ley 38 de 1989 (Presupuesto General de la Nación)
- Decreto 1082 de 2015 (Sector Administrativo de Planeación Nacional)

**Función del BPIN:**
- Registro único de proyectos de inversión pública nacional
- Control de duplicidades
- Información técnica y financiera estandarizada
- Viabilización y priorización de proyectos
- Seguimiento y evaluación

**Ciclo de vida de un proyecto en BPIN:**

```
1. FORMULACIÓN
   ├─ Identificación de problema o necesidad
   ├─ Diseño de alternativas
   ├─ Estudios de factibilidad
   └─ Registro en BPIN

2. VIABILIZACIÓN
   ├─ Evaluación técnica
   ├─ Evaluación financiera
   ├─ Evaluación ambiental
   └─ Concepto de viabilidad DNP

3. PRIORIZACIÓN E INCORPORACIÓN AL PRESUPUESTO
   ├─ Inclusión en Plan de Inversiones
   ├─ Asignación presupuestal
   └─ Apropiación en Ley de Presupuesto

4. EJECUCIÓN
   ├─ Contratación (Compromisos)
   ├─ Desarrollo del proyecto (Obligaciones)
   ├─ Pagos
   └─ Seguimiento a metas e indicadores

5. OPERACIÓN Y EVALUACIÓN
   ├─ Puesta en servicio
   ├─ Evaluación de impacto
   └─ Lecciones aprendidas
```

**Estructura de información BPIN:**

**Información general:**
- Código único BPIN
- Nombre del proyecto
- Sector y subsector
- Entidad ejecutora
- Tipo de proyecto (Creación, Ampliación, Mejoramiento, etc.)

**Localización:**
- Departamento(s)
- Municipio(s)
- Zona: Urbana/Rural
- Georeferenciación (coordenadas)

**Información técnica:**
- Problema o necesidad identificada
- Objetivo general y específicos
- Alternativas evaluadas
- Alternativa seleccionada
- Descripción técnica
- Metas e indicadores de producto
- Beneficiarios directos e indirectos
- Duración del proyecto (plurianual o anual)

**Información financiera:**
- Costo total del proyecto
- Fuentes de financiación (Nación, SGR, SGP, Cofinanciación, etc.)
- Distribución por vigencias (proyectos plurianuales)
- Apropiación vigencia actual
- Ejecución presupuestal (COM, OBL, PAG)

**Información de ejecución física:**
- Avance físico (%)
- Cumplimiento de metas
- Desembolsos vs. avance
- Modificaciones al proyecto

**Utilidad del BPIN para análisis en SICODIS:**
- Permite seguimiento granular (proyecto por proyecto)
- Identifica beneficiarios específicos
- Facilita control ciudadano
- Apoya rendición de cuentas
- Permite evaluación de impacto

### Clasificación Sectorial de la Inversión

La clasificación sectorial organiza los proyectos según el área temática de intervención.

**Criterios de clasificación:**
- Objetivo principal del proyecto
- Sector beneficiado
- Tipo de infraestructura
- Alineación con políticas sectoriales

**Ejemplo de proyecto multisectorial:**
```
Proyecto: Centro de Servicios Rurales Integrales

Clasificación posible:
- Sector primario: EQUIPAMIENTO MUNICIPAL (infraestructura institucional)
- Componentes:
  ├─ Salud (puesto de salud rural)
  ├─ Educación (biblioteca comunitaria)
  ├─ Agropecuario (centro de acopio)
  └─ Fortalecimiento institucional (oficinas municipales)

Asignación en BPIN: Se clasifica en el sector que representa el mayor componente presupuestal o el objetivo principal.
```

**Análisis sectorial en SICODIS permite:**
- Identificar prioridades de inversión pública (sectores con mayor apropiación)
- Evaluar coherencia con Plan Nacional de Desarrollo
- Comparar inversión sectorial entre vigencias
- Analizar ejecución por sector (sectores con mejores indicadores)
- Identificar brechas sectoriales (sectores desatendidos)

### Entidades Ejecutoras y Capacidad de Gestión

Las entidades ejecutoras son responsables de la contratación, ejecución y seguimiento de los proyectos.

**Categorías de entidades:**

**1. Ministerios y Departamentos Administrativos**
- Formulan política sectorial
- Ejecutan proyectos directamente o a través de entidades adscritas
- Ejemplos: MinTransporte, MinSalud, MinEducación

**2. Agencias e Institutos Especializados**
- Entidades técnicas con autonomía administrativa
- Especializadas en ejecución de proyectos
- Ejemplos: INVIAS, ANI, ICBF, SENA

**3. Unidades Administrativas Especiales**
- Entidades con régimen especial
- Funciones específicas de alta especialización
- Ejemplos: Aeronáutica Civil, ANLA

**4. Establecimientos Públicos**
- Personería jurídica propia
- Ejecutan funciones administrativas y técnicas
- Ejemplos: Universidades públicas, hospitales

**Capacidad de gestión de entidades:**

**Indicadores de capacidad:**
```
1. Capacidad de Contratación = % Compromisos / Apropiación
   Alto: > 85%
   Medio: 70-85%
   Bajo: < 70%

2. Capacidad de Ejecución = % Obligaciones / Compromisos
   Alto: > 75%
   Medio: 60-75%
   Bajo: < 60%

3. Capacidad de Pago = % Pagos / Obligaciones
   Alto: > 90%
   Medio: 80-90%
   Bajo: < 80%
```

**Factores que afectan capacidad de gestión:**
- Dotación de personal técnico calificado
- Sistemas de información y herramientas de gestión
- Experiencia en ejecución de proyectos similares
- Procesos internos de contratación y supervisión
- Autonomía administrativa y financiera
- Coordinación con entidades territoriales (proyectos descentralizados)

**Análisis comparativo de entidades:**

| Entidad | Apropiación | % COM | % OBL | % PAG | % Ejec Total |
|---------|-------------|-------|-------|-------|--------------|
| Entidad A | $500.000 M | 90% | 80% | 88% | 63,4% |
| Entidad B | $300.000 M | 75% | 65% | 85% | 41,4% |
| Entidad C | $200.000 M | 95% | 85% | 92% | 74,3% |

**Interpretación:**
- **Entidad C:** Mejor desempeño integral (74,3% ejecución)
- **Entidad A:** Alta contratación pero rezago en obligaciones
- **Entidad B:** Rezago desde la contratación, requiere fortalecimiento

### Fuentes de Financiación por Proyecto

Los proyectos pueden tener una o varias fuentes de financiación.

**Tipos de proyectos según fuentes:**

**1. Proyectos con fuente única:**
```
Proyecto: Sistema de Información Sectorial
Fuente única: Nación (100%)
Apropiación: $10.000 M

Ventajas:
- Simplicidad administrativa
- Una sola entidad financiadora
- Trámites ágiles

Desventajas:
- Dependencia de una sola fuente
- Menor sostenibilidad si hay recortes
```

**2. Proyectos con cofinanciación:**
```
Proyecto: Acueducto Regional Multimunicipal
Fuentes múltiples:
- Nación: $40.000 M (40%)
- SGR: $30.000 M (30%)
- SGP Agua Potable: $20.000 M (20%)
- Departamento: $10.000 M (10%)
Total: $100.000 M

Ventajas:
- Mayor monto de inversión
- Riesgo compartido
- Compromiso multinivel

Desventajas:
- Coordinación compleja
- Múltiples aprobaciones
- Riesgo de demoras por descoordinación
```

**Análisis de sostenibilidad por fuente:**

**Recursos Ordinarios (Nación):**
- Mayor flexibilidad
- Dependiente de disponibilidad fiscal
- Susceptible a ajustes fiscales

**SGP (Sistema General de Participaciones):**
- Transferencias constitucionales (más estables)
- Destinación específica
- Menos susceptible a recortes

**SGR (Sistema General de Regalías):**
- Dependiente de producción de recursos naturales (volátil)
- Requiere aprobación OCAD
- Cofinanciación obligatoria

**Recursos de Capital (Crédito):**
- Grandes montos para infraestructura
- Genera deuda futura
- Requiere viabilidad fiscal

**Cooperación Internacional:**
- Condicionada a objetivos del cooperante
- Generalmente no recurrente
- Requiere contrapartida nacional

### Análisis de Concentración Sectorial y Territorial

**Concentración sectorial:**

Algunos sectores concentran mayor inversión que otros.

**Ejemplo de distribución sectorial nacional:**
```
DISTRIBUCIÓN PRESUPUESTAL POR SECTOR (Vigencia 2025)

Transporte:        $3.800.000 M (38,0%) ████████████████████
Educación:         $1.500.000 M (15,0%) ████████
Salud:             $1.200.000 M (12,0%) ██████
Agua Potable:        $900.000 M ( 9,0%) █████
Agropecuario:        $700.000 M ( 7,0%) ████
Vivienda:            $600.000 M ( 6,0%) ███
Otros sectores:    $1.300.000 M (13,0%) ███████
──────────────────────────────────────────────────
TOTAL:            $10.000.000 M (100%)
```

**Interpretación:**
- Alta concentración en Transporte (38%) refleja prioridad en infraestructura vial
- Sectores sociales (Educación + Salud) = 27%
- Sectores rurales (Agropecuario + Agua) = 16%

**Concentración territorial sectorial:**

Algunos departamentos concentran la inversión de ciertos sectores.

**Ejemplo: Sector TRANSPORTE**
```
Top 5 departamentos en Transporte:
1. Antioquia:     $600.000 M (15,8%)
2. Valle:         $500.000 M (13,2%)
3. Cundinamarca:  $450.000 M (11,8%)
4. Santander:     $400.000 M (10,5%)
5. Boyacá:        $350.000 M ( 9,2%)
──────────────────────────────────────
   Top 5:       $2.300.000 M (60,5%)
   Otros 28:    $1.500.000 M (39,5%)
```

**Interpretación:**
- Alta concentración: Top 5 departamentos = 60,5% del sector
- Posibles causas: mayor extensión vial, proyectos grandes (vías 4G), población

**Análisis de equidad territorial sectorial:**

Calcular inversión sectorial per cápita permite identificar inequidades.

**Ejemplo: Sector SALUD - Inversión per cápita**

| Departamento | Inversión Salud | Población | Per Cápita |
|--------------|-----------------|-----------|------------|
| Guainía | $15.000 M | 50.000 hab | $300.000/hab |
| Vaupés | $12.000 M | 45.000 hab | $267.000/hab |
| Bogotá | $90.000 M | 8.181.000 hab | $11.000/hab |
| Antioquia | $80.000 M | 6.677.000 hab | $12.000/hab |

**Interpretación:**
- Departamentos amazónicos tienen altísima inversión per cápita
- Justificación: dispersión poblacional, costos de acceso, proyectos especiales
- Departamentos poblados tienen baja inversión per cápita pero mayor cobertura

## 5.4.7 Casos de Uso y Ejemplos Prácticos

### Caso de Uso 1: Seguimiento a Proyecto Estratégico Específico

**Objetivo:** Gobernador desea monitorear mensualmente el avance del proyecto de construcción de un hospital departamental.

**Pasos:**

1. **Identificar el proyecto:**
   - Nombre: "Construcción Hospital de II Nivel - Municipio X"
   - Código BPIN: 2021010067890
   - Sector: Salud
   - Entidad: Ministerio de Salud y Protección Social

2. **Configurar filtros:**
   - Vigencia: 2025
   - Período: Marzo (primer seguimiento)
   - Sector: Salud
   - Entidad: Ministerio de Salud y Protección Social
   - Proyecto: [Seleccionar código BPIN 2021010067890]
   - Fuente: Todas
   - Departamento: [Departamento específico]

3. **Registrar indicadores (marzo):**
   ```
   Apropiación Vigente: $50.000 M
   Compromisos: $45.000 M (90% - contrato firmado)
   Obligaciones: $10.000 M (22% de COM - inicio obras)
   Pagos: $8.000 M (80% de OBL - anticipo pagado)
   Ejecución Total: 16% (normal para inicio)
   ```

4. **Seguimiento mensual:**

   **Junio:**
   ```
   Compromisos: $45.000 M (90% - sin cambio)
   Obligaciones: $25.000 M (56% de COM - avance 50%)
   Pagos: $22.000 M (88% de OBL - pagos al día)
   Ejecución Total: 44%
   ```

   **Septiembre:**
   ```
   Compromisos: $48.000 M (96% - adición al contrato)
   Obligaciones: $40.000 M (83% de COM - avance 75%)
   Pagos: $36.000 M (90% de OBL - excelente)
   Ejecución Total: 72%
   ```

   **Diciembre:**
   ```
   Compromisos: $50.000 M (100% - contrato completo)
   Obligaciones: $48.000 M (96% de COM - obra terminada)
   Pagos: $46.000 M (96% de OBL - saldo pendiente)
   Ejecución Total: 92% (excelente)
   ```

5. **Análisis de avance:**
   - Ejecución superior a meta (80%)
   - Obra terminada según cronograma
   - Saldo por pagar corresponde a retención de garantía
   - Proyecto exitoso

**Decisiones:**
- Programar inauguración
- Autorizar pago de saldo final tras recibo a satisfacción
- Documentar buenas prácticas para replicar

### Caso de Uso 2: Análisis de Ejecución Sectorial Comparada

**Objetivo:** Director de Inversión Pública del DNP compara desempeño de ejecución entre sectores para identificar rezagos.

**Pasos:**

1. **Consultar ejecución Sector TRANSPORTE:**
   - Vigencia: 2025
   - Período: Septiembre
   - Sector: Transporte
   - Entidad: Todas
   - Proyecto: Todos
   - Fuente: Todas
   - Departamento: Todos

   Resultado:
   ```
   TRANSPORTE:
   - Apropiación: $3.800.000 M
   - Ejecución: 65%
   - % COM: 88%
   - % OBL/COM: 78%
   - % PAG/OBL: 94%
   ```

2. **Consultar ejecución Sector SALUD:**
   - Cambiar Sector a: Salud

   Resultado:
   ```
   SALUD:
   - Apropiación: $1.200.000 M
   - Ejecución: 70%
   - % COM: 90%
   - % OBL/COM: 82%
   - % PAG/OBL: 95%
   ```

3. **Consultar ejecución Sector EDUCACIÓN:**
   - Cambiar Sector a: Educación

   Resultado:
   ```
   EDUCACIÓN:
   - Apropiación: $1.500.000 M
   - Ejecución: 58%
   - % COM: 75%
   - % OBL/COM: 70%
   - % PAG/OBL: 88%
   ```

4. **Consultar ejecución Sector AGUA POTABLE:**
   - Cambiar Sector a: Agua Potable y Saneamiento Básico

   Resultado:
   ```
   AGUA POTABLE:
   - Apropiación: $900.000 M
   - Ejecución: 52%
   - % COM: 70%
   - % OBL/COM: 68%
   - % PAG/OBL: 90%
   ```

5. **Comparación sectorial:**

   | Sector | Apropiación | Ejec % | COM% | OBL/COM% | PAG/OBL% | Diagnóstico |
   |--------|-------------|--------|------|----------|----------|-------------|
   | Salud | $1.200 M | 70% | 90% | 82% | 95% | Excelente |
   | Transporte | $3.800 M | 65% | 88% | 78% | 94% | Muy bueno |
   | Educación | $1.500 M | 58% | 75% | 70% | 88% | Regular - Rezago desde contratación |
   | Agua Potable | $900 M | 52% | 70% | 68% | 90% | Rezago crítico |

**Interpretación:**
- **Salud:** Mejor desempeño integral
- **Transporte:** Bueno, pero debe mejorar en últimos meses
- **Educación:** Problema en contratación (75% COM), requiere aceleración
- **Agua Potable:** Rezago crítico, problemas estructurales

6. **Profundizar en Agua Potable:**
   - Mantener filtro Sector: Agua Potable
   - Analizar por entidades

   Filtrar por entidades del sector:
   ```
   Ministerio de Vivienda:
   - Apropiación: $700.000 M
   - Ejecución: 48% (crítico)
   - Problema: Baja contratación (65% COM)

   Otras entidades:
   - Apropiación: $200.000 M
   - Ejecución: 60% (aceptable)
   ```

**Decisiones:**
- Reunión urgente con Ministerio de Vivienda para acelerar contratación
- Asistencia técnica en procesos de contratación de proyectos de agua
- Evaluar reasignación de recursos si no hay mejora en octubre
- Reconocer buenas prácticas del Sector Salud para replicar

### Caso de Uso 3: Análisis de Inversión Territorial en un Sector

**Objetivo:** Asociación de Departamentos Productores de Café analiza inversión del Sector Agropecuario en sus departamentos.

**Pasos:**

1. **Consultar inversión Sector Agropecuario - Nacional:**
   - Vigencia: 2025
   - Período: Diciembre
   - Sector: Agropecuario
   - Entidad: Todas
   - Proyecto: Todos
   - Fuente: Todas
   - Departamento: Todos

   Resultado nacional:
   ```
   AGROPECUARIO - NACIONAL:
   - Apropiación Total: $700.000 M
   - Regionalizado: $550.000 M
   - Nacional: $150.000 M
   ```

2. **Descargar tabla departamental y filtrar departamentos cafeteros:**

   Departamentos cafeteros: Caldas, Quindío, Risaralda, Antioquia, Tolima, Huila, Cauca, Nariño

   | Departamento | Inversión Agropecuaria | Población | Per Cápita |
   |--------------|------------------------|-----------|------------|
   | Antioquia | $80.000 M | 6.677.000 | $12.000 |
   | Huila | $55.000 M | 1.200.000 | $46.000 |
   | Cauca | $45.000 M | 1.500.000 | $30.000 |
   | Tolima | $40.000 M | 1.400.000 | $29.000 |
   | Nariño | $38.000 M | 1.800.000 | $21.000 |
   | Caldas | $25.000 M | 1.000.000 | $25.000 |
   | Risaralda | $20.000 M | 950.000 | $21.000 |
   | Quindío | $15.000 M | 550.000 | $27.000 |
   | **Total Cafetero** | **$318.000 M** | **15.077.000** | **$21.000** |

3. **Análisis:**
   ```
   Inversión en región cafetera: $318.000 M
   % del total nacional agropecuario: 57,8%
   Inversión per cápita promedio: $21.000/hab

   Comparación:
   - Total nacional per cápita: $11.000/hab
   - Región cafetera per cápita: $21.000/hab
   → Región cafetera tiene casi el doble de inversión per cápita
   ```

4. **Profundizar en proyectos específicos (Huila - mayor per cápita):**
   - Cambiar Departamento a: Huila
   - Descargar detalle de proyectos

   Proyectos principales en Huila:
   ```
   1. Programa de Renovación Cafetera: $20.000 M
   2. Infraestructura de Riego: $15.000 M
   3. Cadenas Productivas Panela: $10.000 M
   4. Asistencia Técnica Rural: $5.000 M
   5. Otros proyectos: $5.000 M
   ```

**Conclusiones:**
- La región cafetera recibe priorización en inversión agropecuaria (57,8% del total)
- Inversión per cápita significativamente superior al promedio nacional
- Huila lidera en per cápita por proyectos grandes de renovación cafetera
- La inversión se alinea con la política de fortalecimiento del sector cafetero

**Decisiones de la Asociación:**
- Gestionar ante Ministerio de Agricultura continuidad de programas exitosos
- Solicitar ampliación de cobertura de renovación cafetera
- Coordinar cofinanciación departamental para proyectos complementarios

### Caso de Uso 4: Evaluación de Gestión de Entidad Ejecutora

**Objetivo:** Contraloría General evalúa la gestión de INVIAS en la ejecución de proyectos viales.

**Pasos:**

1. **Consultar agregado INVIAS:**
   - Vigencia: 2025
   - Período: Diciembre
   - Sector: Transporte
   - Entidad: INVIAS
   - Proyecto: Todos
   - Fuente: Todas
   - Departamento: Todos

   Resultado:
   ```
   INVIAS - AGREGADO:
   - Apropiación: $2.000.000 M
   - Compromisos: $1.750.000 M (87,5%)
   - Obligaciones: $1.400.000 M (80% de COM)
   - Pagos: $1.260.000 M (90% de OBL)
   - Ejecución Total: 63%
   ```

2. **Comparar con ANI (otra entidad del sector transporte):**
   - Cambiar Entidad a: ANI

   Resultado ANI:
   ```
   ANI - AGREGADO:
   - Apropiación: $1.500.000 M
   - Compromisos: $1.425.000 M (95%)
   - Obligaciones: $1.200.000 M (84% de COM)
   - Pagos: $1.080.000 M (90% de OBL)
   - Ejecución Total: 72%
   ```

   **Comparación:**
   | Entidad | Apropiación | % COM | % OBL/COM | % PAG/OBL | % Ejec |
   |---------|-------------|-------|-----------|-----------|--------|
   | INVIAS | $2.000 M | 87,5% | 80% | 90% | 63% |
   | ANI | $1.500 M | 95% | 84% | 90% | 72% |

   **Interpretación:**
   - ANI tiene mejor desempeño en todas las fases
   - INVIAS tiene rezago relativo en contratación (87,5% vs 95%)
   - Ambas tienen excelente gestión de pagos (90%)

3. **Analizar distribución territorial de INVIAS:**
   - Volver a filtro Entidad: INVIAS
   - Descargar tabla departamental

   Identificar departamentos con baja ejecución de INVIAS:
   ```
   Departamentos críticos (ejecución < 50%):
   - Departamento X: 42% ejecución
   - Departamento Y: 45% ejecución
   - Departamento Z: 48% ejecución
   ```

4. **Profundizar en Departamento X:**
   - Cambiar Departamento a: Departamento X
   - Descargar detalle de proyectos

   Proyectos INVIAS en Departamento X:
   ```
   Proyecto A: Vía terciaria 30 km
   - Apropiación: $15.000 M
   - Ejecución: 65% (bueno)

   Proyecto B: Puente sobre río XYZ
   - Apropiación: $25.000 M
   - Ejecución: 25% (CRÍTICO)
   - Problema identificado: Compromisos solo 35%

   Proyecto C: Mantenimiento vial
   - Apropiación: $10.000 M
   - Ejecución: 80% (excelente)
   ```

   **Diagnóstico:**
   - El rezago del Departamento X se debe principalmente al Proyecto B (puente)
   - Problema en la fase de contratación del puente

5. **Solicitar información adicional a INVIAS sobre Proyecto B:**
   - Motivo del rezago en contratación
   - Cronograma de recuperación
   - Riesgos de no ejecución

**Conclusiones de Contraloría:**
- INVIAS tiene gestión aceptable pero mejorable (63% vs. meta 80%)
- Comparado con ANI, tiene margen de mejora en contratación
- Rezagos focalizados en proyectos complejos (puentes)
- No hay problemas sistémicos de pago (90% PAG/OBL)

**Recomendaciones:**
- INVIAS debe acelerar procesos de contratación en proyectos complejos
- Asistencia técnica en estructuración de proyectos de puentes
- Seguimiento especial a Proyecto B (puente Departamento X)
- Analizar buenas prácticas de ANI para replicar en INVIAS

### Caso de Uso 5: Análisis de Fuentes de Financiación de un Proyecto

**Objetivo:** Analista financiero evalúa las fuentes de financiación de un proyecto estratégico de acueducto regional.

**Pasos:**

1. **Identificar el proyecto:**
   - Nombre: "Acueducto Regional Valle de Aburrá"
   - Código BPIN: 2020010078901
   - Sector: Agua Potable y Saneamiento Básico
   - Entidad: Ministerio de Vivienda, Ciudad y Territorio

2. **Consultar proyecto con todas las fuentes:**
   - Vigencia: 2025
   - Período: Septiembre
   - Sector: Agua Potable
   - Entidad: Ministerio de Vivienda
   - Proyecto: Acueducto Regional Valle de Aburrá (BPIN 2020010078901)
   - Fuente: Todas
   - Departamento: Antioquia

   Resultado:
   ```
   ACUEDUCTO REGIONAL - TODAS LAS FUENTES:
   - Apropiación Total: $150.000 M
   - Compromisos: $140.000 M (93%)
   - Obligaciones: $105.000 M (75% de COM)
   - Pagos: $90.000 M (86% de OBL)
   - Ejecución Total: 60%
   ```

3. **Desagregar por fuente de financiación:**

   **Fuente: Nación**
   - Cambiar Fuente a: Nación

   Resultado:
   ```
   Apropiación: $60.000 M (40% del total)
   Ejecución: 65%
   ```

   **Fuente: SGR**
   - Cambiar Fuente a: SGR

   Resultado:
   ```
   Apropiación: $45.000 M (30% del total)
   Ejecución: 50%
   ```

   **Fuente: SGP Agua Potable**
   - Cambiar Fuente a: SGP

   Resultado:
   ```
   Apropiación: $30.000 M (20% del total)
   Ejecución: 68%
   ```

   **Fuente: Departamento Antioquia**
   - Cambiar Fuente a: Recursos Propios

   Resultado:
   ```
   Apropiación: $15.000 M (10% del total)
   Ejecución: 70%
   ```

4. **Tabla comparativa de fuentes:**

   | Fuente | Monto | % del Total | Ejecución | Diagnóstico |
   |--------|-------|-------------|-----------|-------------|
   | Nación | $60.000 M | 40% | 65% | Buena |
   | SGR | $45.000 M | 30% | 50% | Rezago |
   | SGP | $30.000 M | 20% | 68% | Buena |
   | Departamento | $15.000 M | 10% | 70% | Muy buena |
   | **TOTAL** | **$150.000 M** | **100%** | **60%** | **Aceptable** |

**Análisis:**
- El proyecto tiene buena diversificación de fuentes (4 fuentes diferentes)
- SGR tiene la menor ejecución (50%), arrastra el promedio hacia abajo
- Recursos departamentales tienen la mejor ejecución (70%)
- SGP tiene buena ejecución (68%)

5. **Profundizar en rezago de SGR:**
   - Consultar detalle de ejecución SGR por fases

   ```
   SGR:
   - Apropiación: $45.000 M
   - Compromisos: $38.000 M (84% - problema leve)
   - Obligaciones: $26.000 M (68% de COM - rezago)
   - Pagos: $22.500 M (87% de OBL - bien)
   - Ejecución: 50%
   ```

   **Diagnóstico SGR:**
   - Problema principal en fase de obligaciones (contratos sin avance)
   - Posibles causas: complejidad de proyectos SGR, requisitos OCAD

6. **Proyección de cierre:**
   ```
   Si cada fuente mantiene su ritmo:
   - Nación: 65% → proyección diciembre 75%
   - SGR: 50% → proyección diciembre 60%
   - SGP: 68% → proyección diciembre 80%
   - Departamento: 70% → proyección diciembre 85%
   - TOTAL proyectado: 72%
   ```

**Conclusiones:**
- Proyecto con buena estructura de cofinanciación
- Diversificación reduce riesgo de falta de liquidez
- SGR es la fuente crítica, requiere atención
- Recursos propios y SGP tienen mejor desempeño

**Recomendaciones:**
- Acelerar ejecución de componentes financiados con SGR
- Coordinar con OCAD para agilizar aprobaciones de modificaciones si hay
- Considerar solicitar redistribución de actividades entre fuentes
- Meta realista de cierre: 72% (aceptable para proyecto complejo)

## 5.4.8 Recomendaciones para el Análisis

### Buenas Prácticas

1. **Usar la cascada de filtros estratégicamente:**
   - Iniciar con vista agregada (sector, todas las entidades)
   - Desagregar progresivamente según hallazgos
   - Llegar al nivel de proyecto solo cuando sea necesario

2. **Combinar análisis sectorial y territorial:**
   - No analizar sectores aisladamente
   - Cruzar con distribución territorial
   - Identificar concentraciones y brechas

3. **Comparar entidades dentro del mismo sector:**
   - Permite identificar mejores y peores prácticas
   - Focalizar asistencia técnica
   - Reconocer buenas gestiones

4. **Monitorear proyectos estratégicos sistemáticamente:**
   - Establecer periodicidad de seguimiento (mensual/trimestral)
   - Identificar alertas tempranas
   - Documentar avances y dificultades

5. **Analizar fuentes de financiación:**
   - Evaluar sostenibilidad de proyectos
   - Identificar fuentes con mejores indicadores de ejecución
   - Gestionar riesgos de dependencia

6. **Complementar con información externa:**
   - Contrastar con avance físico de proyectos (visitas, reportes)
   - Validar con beneficiarios
   - Cruzar con otros sistemas (SICEP, SPI, etc.)

### Alertas y Señales de Riesgo

**Alertas a nivel sectorial:**
- Sector con ejecución < 60% en diciembre: Rezago sectorial crítico
- Brecha grande entre sectores (> 30 pp): Inequidad sectorial
- Disminución de apropiación sectorial entre vigencias: Posible despriorizacion

**Alertas a nivel entidad:**
- Entidad con % COM < 70% en septiembre: Problemas de contratación
- Brecha OBL/COM < 60%: Contratos sin avance
- Diferencia > 20 pp con otras entidades del sector: Rezago relativo

**Alertas a nivel proyecto:**
- Proyecto plurianual con ejecución < 30% en segundo año: Riesgo alto
- Compromisos muy tardíos (último trimestre): Riesgo de no ejecución
- Brecha grande PAG/OBL (< 70%): Problemas de liquidez

### Limitaciones y Consideraciones

1. **Proyectos plurianuales:**
   - La ejecución anual puede ser baja por diseño
   - Analizar en contexto del cronograma total del proyecto
   - Algunos proyectos tienen picos de inversión en ciertos años

2. **Clasificación sectorial:**
   - Proyectos multisectoriales se asignan a un solo sector principal
   - Puede subestimar inversión en sectores secundarios
   - Algunos sectores tienen fronteras difusas

3. **Regionalización de proyectos nacionales:**
   - Proyectos de alcance nacional benefician a todos pero no se regionalizan
   - No implica menor beneficio para territorios
   - Ejemplos: sistemas de información, programas nacionales

4. **Modificaciones presupuestales durante la vigencia:**
   - Adiciones aumentan apropiación y pueden bajar % ejecución
   - Comparar apropiación inicial vs. vigente para contexto
   - Traslados entre proyectos pueden cambiar estructura sectorial

5. **Rezagos presupuestales:**
   - Obligaciones de vigencias anteriores se pagan en vigencia actual
   - Pueden inflar la ejecución aparente
   - Considerar análisis de vigencias futuras

### Integración con Otros Módulos

**1. Regionalización - Programación:**
- Comparar programación inicial con ejecución final
- Identificar cambios en priorización sectorial
- Evaluar acierto en la planificación

**2. Regionalización - Seguimiento:**
- Vista agregada territorial vs. vista sectorial
- Cruzar ejecución departamental con sectores
- Identificar si rezagos departamentales son sectoriales o generales

**3. Módulos SGP:**
- Complementar inversión PGN sectorial con transferencias SGP
- Ejemplo: Sector Salud PGN + SGP Salud = Inversión total nacional en salud
- Evaluar complementariedad y coordinación

**4. Módulos SGR:**
- Analizar proyectos cofinanciados PGN-SGR
- Evaluar coordinación nacional-territorial
- Identificar oportunidades de cofinanciación

### Preguntas Clave para el Análisis

**Nivel sectorial:**
1. ¿Qué sectores tienen mayor apropiación? ¿Se alinea con prioridades del Plan Nacional de Desarrollo?
2. ¿Qué sectores tienen mejor/peor ejecución? ¿Por qué?
3. ¿Cómo ha evolucionado la inversión sectorial en los últimos años?
4. ¿Hay sectores desatendidos o subfinanciados?

**Nivel entidad:**
1. ¿Qué entidades tienen mejor capacidad de gestión?
2. ¿Hay diferencias significativas entre entidades del mismo sector?
3. ¿Qué factores explican el buen/mal desempeño de una entidad?
4. ¿Se requiere fortalecimiento institucional de alguna entidad?

**Nivel proyecto:**
1. ¿El proyecto avanza según cronograma?
2. ¿En qué fase del ciclo están los problemas (contratación, ejecución, pago)?
3. ¿Las fuentes de financiación son sostenibles?
4. ¿El proyecto está generando los beneficios esperados?

**Nivel territorial:**
1. ¿Cómo se distribuye la inversión sectorial entre departamentos?
2. ¿Hay concentración excesiva en pocos departamentos?
3. ¿La distribución responde a necesidades territoriales?
4. ¿Hay complementariedad con inversión territorial propia?

---

**Conclusión:**

El módulo de Inversión por Sector es la herramienta más detallada de SICODIS para analizar la inversión pública nacional. Permite navegar desde el nivel macro (sectores) hasta el micro (proyectos BPIN específicos), facilitando análisis multidimensionales de la inversión pública, evaluación de gestión de entidades, seguimiento a proyectos estratégicos, y planificación territorial coordinada.

Su uso efectivo requiere comprensión de la estructura BPIN, dominio de la cascada de filtros, y capacidad de análisis multinivel. La complementariedad con otros módulos de SICODIS permite una visión integral de la inversión pública en Colombia.

Para consultas específicas, información adicional sobre proyectos, o asistencia técnica:
- Departamento Nacional de Planeación - Dirección de Inversiones y Finanzas Públicas
- Sistema BPIN: https://spi.dnp.gov.co/
- SICODIS: https://sicodis.dnp.gov.co/
- Líneas de atención de entidades ejecutoras sectoriales
