# 4.5. Plan de Recursos

**Ruta de acceso**: `/sgr-plan-recursos`

## 4.5.1. Propósito del Módulo

El módulo **Plan de Recursos** permite consultar la proyección de ingresos del Sistema General de Regalías para un horizonte de **10 años**. Este instrumento de planeación financiera de largo plazo es fundamental para:

- Conocer las proyecciones de recaudo del SGR para la próxima década
- Planear la inversión de recursos de regalías en el mediano y largo plazo
- Evaluar la sostenibilidad fiscal de proyectos multianuales
- Apoyar la toma de decisiones sobre proyectos estratégicos de gran envergadura
- Identificar tendencias de producción de recursos naturales
- Analizar el impacto de cambios en precios internacionales y producción
- Servir como marco de referencia para la elaboración de Planes Bienales de Caja

El Plan de Recursos es el instrumento de más largo alcance del SGR, diferenciándose del Plan Bienal de Caja (24 meses) por su visión estratégica de largo plazo.

## 4.5.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Proyección de Recaudo Total del SGR (10 años)
- **Recaudo proyectado anual**: Estimación de ingresos del SGR para cada uno de los próximos 10 años
- **Recaudo proyectado acumulado**: Suma acumulada de ingresos proyectados desde el año actual
- **Total decenal**: Suma total de ingresos proyectados para los 10 años

### B. Proyección por Tipo de Recurso
- **Hidrocarburos**: Proyección de regalías por petróleo y gas natural
  - Proyección de producción (barriles/día, millones de pies cúbicos)
  - Proyección de precios internacionales (Brent, WTI, Henry Hub)
  - Regalías estimadas por hidrocarburos
- **Minería**: Proyección de regalías por explotación minera
  - Carbón, oro, níquel, esmeraldas, otros minerales
  - Proyección de producción (toneladas, onzas)
  - Proyección de precios internacionales
  - Regalías estimadas por minería

### C. Proyección por Asignaciones del SGR
- **Asignaciones Directas (20% + 5%)**: Proyección de recursos para territorios productores
- **Desarrollo Regional (17%)**: Proyección para asignación regional
- **Inversión Local y Regional (55%)**: Proyección para asignación municipal y departamental
- **CTI (10%)**: Proyección para ciencia, tecnología e innovación
- **Paz y Medio Ambiente (3%)**: Proyección para asignación de paz
- **Otras asignaciones**: FONPET, Administración, Fiscalización

### D. Supuestos de Proyección
- **Supuestos de producción**:
  - Producción esperada de hidrocarburos (barriles/día)
  - Producción esperada de minería (toneladas/año)
  - Nuevos campos o minas en operación proyectados
  - Declive de campos maduros
- **Supuestos de precios**:
  - Proyección de precio del petróleo (USD/barril)
  - Proyección de precio del gas (USD/MBTU)
  - Proyección de precio del carbón (USD/tonelada)
  - Proyección de precio del oro (USD/onza)
  - Proyección de precios de otros minerales
- **Supuestos macroeconómicos**:
  - Proyección de tasa de cambio (COP/USD)
  - Proyección de inflación
  - Crecimiento económico esperado

### E. Escenarios de Proyección
- **Escenario Base**: Proyección con supuestos más probables
- **Escenario Optimista**: Proyección con precios altos y mayor producción
- **Escenario Pesimista**: Proyección con precios bajos y menor producción
- **Análisis de sensibilidad**: Impacto de cambios en variables clave

### F. Comparación con Planes Anteriores
- **Plan de Recursos actual vs anterior**: Comparación con la proyección del Plan de Recursos previo
- **Variaciones en estimaciones**: Cambios en supuestos y proyecciones entre versiones del Plan
- **Desviación histórica**: Comparación entre lo proyectado en planes anteriores y el recaudo efectivo

## 4.5.3. Controles y Filtros

### A. Selector de Año Base del Plan de Recursos
Permite seleccionar la versión del Plan de Recursos a consultar:
- Plan de Recursos 2025-2034
- Plan de Recursos 2024-2033
- Plan de Recursos 2023-2032

**Comportamiento**: Cada Plan tiene supuestos diferentes según el momento de elaboración. Al cambiar el plan, se actualizan todas las proyecciones.

### B. Selector de Escenario
Permite visualizar diferentes escenarios de proyección:
- **Escenario Base**: Supuestos más probables (por defecto)
- **Escenario Optimista**: Precios altos y mayor producción (+20-30% vs base)
- **Escenario Pesimista**: Precios bajos y menor producción (-20-30% vs base)

**Uso recomendado**: Escenario base para planeación estándar, escenarios extremos para análisis de riesgo.

### C. Filtro de Tipo de Recurso
- **Todos**: Proyección de hidrocarburos + minería
- **Hidrocarburos**: Solo regalías de petróleo y gas
- **Minería**: Solo regalías de explotación minera

### D. Filtro de Asignación
Permite visualizar la proyección específica de una asignación:
- **Todas las asignaciones**: Recaudo total del SGR
- **Asignaciones Directas**
- **Desarrollo Regional**
- **Inversión Local y Regional**
- **CTI**
- **Paz y Medio Ambiente**
- **Otras**

### E. Toggle de Visualización
- **Valores absolutos**: Montos proyectados en millones de pesos (o USD)
- **Valores acumulados**: Suma acumulada desde el año 1
- **Valores per cápita**: Proyección por habitante (útil para análisis territorial)
- **Variación anual**: Cambio porcentual año a año

### F. Selector de Moneda
- **Pesos colombianos (COP)**: Valores en millones de pesos
- **Dólares estadounidenses (USD)**: Valores en millones de dólares (elimina efecto de tasa de cambio)

## 4.5.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **Total Proyectado 10 Años**
   - Valor: Suma total de ingresos proyectados para la década
   - Formato: "$XX,XXX,XXX millones" (COP) o "$XX,XXX millones" (USD)
   - Comparación: Variación vs Plan de Recursos anterior

2. **Promedio Anual**
   - Valor: Total 10 años / 10
   - Formato: "$X,XXX,XXX millones/año"
   - Indicador: Tendencia (creciente, estable, decreciente)

3. **Año de Mayor Recaudo Proyectado**
   - Valor: Año y monto del pico de recaudo
   - Formato: "2028: $X,XXX,XXX millones"
   - Contexto: % sobre el promedio

4. **Año de Menor Recaudo Proyectado**
   - Valor: Año y monto del valle de recaudo
   - Formato: "2033: $X,XXX,XXX millones"
   - Contexto: % bajo el promedio

5. **Participación Hidrocarburos (promedio 10 años)**
   - Valor: % promedio de hidrocarburos en el recaudo decenal
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge

6. **Participación Minería (promedio 10 años)**
   - Valor: % promedio de minería en el recaudo decenal
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge

7. **Tasa de Crecimiento Anual Compuesta (CAGR)**
   - Valor: Tasa de crecimiento promedio anual del recaudo en 10 años
   - Fórmula: [(Recaudo Año 10 / Recaudo Año 1)^(1/10) - 1] × 100
   - Formato: "+X.X%" o "-X.X%"
   - Indicador: Positivo (crecimiento), negativo (decrecimiento)

![Indicadores Clave del Plan de Recursos](../assets/screenshots/sgr-plan-recursos-kpis.png)
*Indicadores clave de proyección decenal del SGR*

### B. Gráfico de Serie Temporal - Proyección Decenal

**Tipo**: Gráfico de líneas con área apilada

**Descripción**: Muestra la evolución proyectada del recaudo del SGR durante los 10 años.

**Elementos visuales**:
- **Área inferior (azul)**: Proyección de hidrocarburos
- **Área superior (verde)**: Proyección de minería
- **Línea de tendencia**: Tendencia general del recaudo (línea punteada)
- **Eje X**: Años (2025, 2026, ..., 2034)
- **Eje Y**: Valores en millones de pesos o dólares
- **Etiquetas**: Valores anuales exactos

**Interactividad**:
- Hover muestra detalle: "2028: Total $2,345,678 M (Hidrocarburos: $1,567,890 M | Minería: $777,788 M)"
- Clic en leyenda oculta/muestra hidrocarburos o minería
- Zoom mediante selección de área
- Selector de escenarios (base, optimista, pesimista) cambia las líneas

**Interpretación**:
- Pendiente ascendente → Crecimiento proyectado del recaudo
- Pendiente descendente → Decrecimiento proyectado (puede indicar agotamiento de recursos)
- Áreas amplias de hidrocarburos vs minería muestran dependencia relativa

![Gráfico de Proyección Decenal](../assets/screenshots/sgr-plan-recursos-proyeccion.png)
*Proyección de recaudo del SGR para 10 años (hidrocarburos vs minería)*

### C. Gráfico Comparativo de Escenarios

**Tipo**: Gráfico de líneas múltiples

**Descripción**: Compara los tres escenarios de proyección (base, optimista, pesimista) para visualizar el rango de posibilidades.

**Elementos visuales**:
- **Línea verde**: Escenario optimista (superior)
- **Línea azul**: Escenario base (medio)
- **Línea roja**: Escenario pesimista (inferior)
- **Área sombreada**: Rango de incertidumbre entre escenarios extremos
- **Eje X**: Años (2025-2034)
- **Eje Y**: Valores en millones de pesos

**Interactividad**:
- Hover muestra valores de los tres escenarios en cada año
- Toggle para mostrar/ocultar escenarios específicos

**Interpretación**:
- Área sombreada amplia → Alta incertidumbre en proyecciones
- Área sombreada estrecha → Baja incertidumbre, proyecciones más confiables
- Útil para análisis de riesgo y planeación bajo incertidumbre

![Gráfico Comparativo de Escenarios](../assets/screenshots/sgr-plan-recursos-escenarios.png)
*Comparación de escenarios de proyección (optimista, base, pesimista)*

### D. Tabla Detallada - Proyección Anual

**Tipo**: TreeTable de PrimeNG con estructura jerárquica

**Descripción**: Presenta el detalle numérico de la proyección año a año con desagregaciones.

**Columnas**:
1. **Año**: Año de proyección (expandible)
2. **Hidrocarburos**: Proyección de regalías por hidrocarburos
3. **Minería**: Proyección de regalías por minería
4. **Total Recaudo**: Suma de hidrocarburos + minería
5. **Variación vs Año Anterior**: Cambio porcentual respecto al año previo
6. **Recaudo Acumulado**: Suma acumulada desde el año 1
7. **% del Total Decenal**: Participación del año en el total de 10 años
8. **Escenario**: Base / Optimista / Pesimista (si se aplica filtro)

**Estructura jerárquica (al expandir año)**:
- **Nivel 1**: Año (ej. "2028")
  - **Nivel 2**: Tipo de recurso (Hidrocarburos / Minería)
    - **Nivel 3**: Subtipo
      - Hidrocarburos: Petróleo / Gas
      - Minería: Carbón / Oro / Níquel / Otros
    - **Nivel 4**: Supuestos
      - Producción proyectada (barriles, toneladas)
      - Precio internacional proyectado (USD)
      - Tasa de cambio (COP/USD)
      - Regalía calculada (COP)

**Funcionalidades**:
- **Ordenamiento**: Clic en encabezados para ordenar
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Filtro**: Por año, tipo de recurso, escenario
- **Resaltado condicional**:
  - Años con crecimiento >5%: Fondo verde claro
  - Años con decrecimiento >5%: Fondo naranja claro
  - Año pico: Fondo azul claro
- **Exportación**: Botón para descargar tabla completa en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones con separador de miles
- Porcentajes: "+XX.X%" o "-XX.X%" con signo y color
- Producción: "XXX,XXX barriles/día" o "X,XXX toneladas/año"
- Precios: "$XXX.XX USD/barril" o "$X,XXX USD/onza"

**Fila de totales**:
- Total Decenal por Hidrocarburos, Minería y Total
- Promedio Anual
- CAGR (Tasa de crecimiento anual compuesta)

![Tabla Detallada de Proyección Anual](../assets/screenshots/sgr-plan-recursos-tabla.png)
*Tabla detallada de proyección anual con supuestos de producción y precios*

### E. Gráfico de Barras - Proyección por Asignaciones

**Tipo**: Gráfico de barras apiladas

**Descripción**: Muestra la proyección del recaudo distribuida por asignaciones del SGR a lo largo de los 10 años.

**Elementos visuales**:
- **Eje X**: Años (2025-2034)
- **Eje Y**: Valores en millones de pesos
- **Segmentos apilados**: Cada asignación con color diferenciado
  - Asignaciones Directas (azul)
  - Desarrollo Regional (verde)
  - Inversión Local (naranja)
  - CTI (morado)
  - Paz (amarillo)
  - Otras (gris)
- **Leyenda**: Con valores totales por asignación (suma 10 años)

**Interactividad**:
- Hover muestra: "2028 - Asignaciones Directas: $586,419 M (25% del total del año)"
- Clic en leyenda oculta/muestra la asignación en el gráfico
- Toggle para cambiar entre valores absolutos y porcentuales

**Interpretación**:
- Permite ver la distribución proyectada de recursos entre asignaciones
- Identifica asignaciones con mayor crecimiento proyectado
- Útil para planeación sectorial (CTI, inversión local, etc.)

![Gráfico de Proyección por Asignaciones](../assets/screenshots/sgr-plan-recursos-asignaciones.png)
*Proyección de recaudo por asignaciones del SGR (10 años)*

### F. Gráfico de Análisis de Sensibilidad

**Tipo**: Gráfico de tornado (barras horizontales de sensibilidad)

**Descripción**: Muestra el impacto de cambios en variables clave sobre el total proyectado a 10 años.

**Variables analizadas**:
1. Precio del petróleo (±20%)
2. Producción de petróleo (±15%)
3. Tasa de cambio (±10%)
4. Precio del carbón (±20%)
5. Producción de carbón (±15%)
6. Precio del oro (±25%)

**Elementos visuales**:
- **Eje X**: Variación en total decenal (millones de pesos)
- **Eje Y**: Variables analizadas
- **Barras hacia la izquierda (rojas)**: Impacto negativo (-X%)
- **Barras hacia la derecha (verdes)**: Impacto positivo (+X%)
- **Longitud de barra**: Magnitud del impacto

**Interactividad**:
- Hover muestra: "Precio del petróleo +20%: +$4,567,890 M (+18.5% total decenal)"
- Ordenamiento por magnitud de impacto

**Interpretación**:
- Variables con barras largas tienen mayor impacto en proyecciones
- Típicamente, precio y producción de petróleo son las variables más sensibles
- Útil para identificar riesgos principales y factores críticos de éxito

![Gráfico de Análisis de Sensibilidad](../assets/screenshots/sgr-plan-recursos-sensibilidad.png)
*Análisis de sensibilidad de proyecciones a cambios en variables clave*

### G. Gráfico Comparativo - Plan Actual vs Anterior

**Tipo**: Gráfico de líneas dobles con área de desviación

**Descripción**: Compara la proyección del Plan de Recursos actual con el plan anterior para el mismo horizonte temporal.

**Elementos visuales**:
- **Línea azul continua**: Plan de Recursos actual (ej. 2025-2034)
- **Línea gris punteada**: Plan de Recursos anterior (ej. 2024-2033) para años coincidentes
- **Área sombreada verde**: Área donde el plan actual proyecta más que el anterior (revisión al alza)
- **Área sombreada roja**: Área donde el plan actual proyecta menos (revisión a la baja)
- **Eje X**: Años
- **Eje Y**: Valores en millones de pesos

**Interactividad**:
- Hover muestra valores de ambos planes y diferencia
- Toggle para mostrar diferencia en valores absolutos o porcentuales

**Interpretación**:
- Permite ver cómo han cambiado las expectativas de recaudo entre versiones del plan
- Identifica si las revisiones son sistemáticas (todo al alza/baja) o puntuales
- Útil para evaluar volatilidad de proyecciones y aprender de desviaciones pasadas

![Gráfico Comparativo de Planes](../assets/screenshots/sgr-plan-recursos-comparativo.png)
*Comparación entre Plan de Recursos actual y anterior*

### H. Tabla de Supuestos Macroeconómicos

**Tipo**: Tabla estática con supuestos clave

**Descripción**: Presenta los supuestos macroeconómicos y de mercado utilizados en las proyecciones.

**Columnas**:
1. **Variable**: Nombre de la variable
2. **Años 1-3**: Valores proyectados para años 1, 2 y 3
3. **Años 4-6**: Valores proyectados para años 4, 5 y 6
4. **Años 7-10**: Valores proyectados para años 7, 8, 9 y 10
5. **Fuente**: Origen del supuesto (EIA, Banco Mundial, MME, etc.)

**Variables incluidas**:
- **Precio del petróleo Brent** (USD/barril)
- **Precio del gas Henry Hub** (USD/MBTU)
- **Precio del carbón** (USD/tonelada)
- **Precio del oro** (USD/onza)
- **Tasa de cambio COP/USD**
- **Inflación Colombia** (%)
- **Crecimiento PIB Colombia** (%)
- **Producción de petróleo** (miles de barriles/día)
- **Producción de carbón** (millones de toneladas/año)

**Funcionalidades**:
- Exportación de tabla de supuestos en Excel
- Descarga de documentación completa de supuestos (PDF)

**Interpretación**:
- Transparenta los supuestos utilizados en proyecciones
- Permite a usuarios evaluar si los supuestos son razonables
- Facilita análisis de sensibilidad personalizado

![Tabla de Supuestos Macroeconómicos](../assets/screenshots/sgr-plan-recursos-supuestos.png)
*Supuestos macroeconómicos y de mercado del Plan de Recursos*

## 4.5.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, años, escenario y fuente.

### B. Descarga de Datos en Excel
**Botón**: "Exportar a Excel"
**Contenido del archivo**:

**Hoja 1: Proyección Anual**
- Proyección año a año de hidrocarburos, minería y total
- Variaciones anuales, recaudo acumulado
- Los tres escenarios (base, optimista, pesimista)

**Hoja 2: Proyección por Asignaciones**
- Proyección decenal desagregada por asignaciones del SGR
- Totales por asignación
- Distribución porcentual

**Hoja 3: Supuestos de Proyección**
- Tabla completa de supuestos macroeconómicos
- Precios internacionales proyectados
- Producción proyectada
- Tasa de cambio e inflación

**Hoja 4: Análisis de Sensibilidad**
- Impacto de cambios en variables clave
- Escenarios extremos
- Rangos de proyección

**Hoja 5: Comparación con Plan Anterior**
- Proyecciones del plan actual vs anterior
- Desviaciones entre planes
- Análisis de cambios en supuestos

**Hoja 6: Resumen Ejecutivo**
- Indicadores clave del Plan de Recursos
- Total decenal, promedio anual, CAGR
- Gráficos automáticos (proyección, escenarios)

**Hoja 7: Metadatos**
- Fecha de elaboración del Plan de Recursos
- Fecha de generación del reporte
- Escenario consultado
- Fuentes de datos (EIA, MME, Banco Mundial, etc.)

**Formato del archivo**:
- Nombre: "SGR_Plan_Recursos_[Periodo]_[Escenario]_[Fecha].xlsx"
- Encabezados en negrilla, fondo azul
- Tablas dinámicas preparadas para análisis
- Gráficos incrustados en hojas relevantes
- Formato de miles, moneda y porcentajes

### C. Descarga de Documento Técnico del Plan de Recursos (PDF)
**Botón**: "Descargar Documento Técnico"
**Contenido**:
1. Portada: "Plan de Recursos del SGR [Periodo]"
2. Índice
3. Introducción y objetivo del Plan de Recursos
4. Metodología de proyección
5. Supuestos macroeconómicos y de mercado
6. Proyección de producción de recursos naturales
7. Proyección de precios internacionales
8. Proyección de recaudo total del SGR (10 años)
9. Proyección por tipo de recurso (hidrocarburos vs minería)
10. Proyección por asignaciones del SGR
11. Escenarios alternativos (optimista, pesimista)
12. Análisis de sensibilidad
13. Comparación con Plan de Recursos anterior
14. Conclusiones y recomendaciones
15. Anexos: Tablas detalladas, gráficos, referencias

**Formato**: Documento técnico de 40-60 páginas, formato carta, con marca de agua de SICODIS/DNP.

### D. Descarga de Informe Ejecutivo (PDF)
**Botón**: "Generar Informe Ejecutivo PDF"
**Contenido**:
1. Portada con título, periodo y fecha
2. Resumen ejecutivo (1 página)
3. Indicadores clave del Plan de Recursos
4. Gráfico de proyección decenal
5. Gráfico comparativo de escenarios
6. Tabla de proyección anual (resumida)
7. Gráfico de proyección por asignaciones
8. Análisis de sensibilidad (gráfico de tornado)
9. Tabla de supuestos clave
10. Conclusiones (máximo 5 puntos)
11. Fuentes y fecha de elaboración

**Formato**: Documento ejecutivo de 10-12 páginas, formato carta.

## 4.5.6. Interpretación Técnica

### A. Elaboración del Plan de Recursos

**Responsable**: Dirección General del Sistema General de Regalías (DNP) en coordinación con el Ministerio de Hacienda y el Ministerio de Minas y Energía.

**Frecuencia**: Se elabora anualmente, actualizando las proyecciones para los próximos 10 años.

**Proceso de elaboración**:
1. **Recopilación de información**:
   - Certificación de producción actual de hidrocarburos y minería (MME)
   - Proyecciones de empresas explotadoras sobre nuevos proyectos
   - Información sobre campos y minas en operación, desarrollo y exploración

2. **Supuestos macroeconómicos**:
   - Revisión de proyecciones internacionales de precios (EIA, Banco Mundial, IEA)
   - Proyección de tasa de cambio (Banco de la República)
   - Proyección de inflación y crecimiento (MHCP, Banco de la República)

3. **Modelación de producción**:
   - Modelación de curvas de declinación de campos existentes
   - Incorporación de nuevos campos o minas proyectados
   - Estimación de producción incremental

4. **Cálculo de regalías**:
   - Aplicación de tarifas vigentes según normativa
   - Conversión de precios internacionales a pesos colombianos
   - Cálculo de regalías anuales

5. **Distribución por asignaciones**:
   - Aplicación de porcentajes según normativa del SGR
   - Proyección por asignación (Directas, Regional, Local, CTI, etc.)

6. **Construcción de escenarios**:
   - Escenario base con supuestos más probables
   - Escenarios optimista y pesimista (variaciones de ±20-30%)

7. **Validación y aprobación**:
   - Revisión técnica por DNP, MHCP, MME
   - Presentación a la Comisión Rectora del SGR
   - Publicación oficial

**Momento de publicación**: Generalmente en el último trimestre del año para proyectar los siguientes 10 años.

### B. Diferencia entre Plan de Recursos y Plan Bienal de Caja

| Aspecto | Plan de Recursos | Plan Bienal de Caja (PBC) |
|---------|------------------|---------------------------|
| **Horizonte temporal** | 10 años | 24 meses |
| **Nivel de detalle** | Proyección anual agregada | Proyección mensual detallada |
| **Propósito** | Planeación estratégica de largo plazo | Programación financiera operativa |
| **Actualización** | Anual | Cada bienio (con posibles ajustes) |
| **Base para decisión** | Proyectos estratégicos, políticas de largo plazo | Aprobación de proyectos en OCAD |
| **Nivel de certidumbre** | Menor (especialmente años lejanos) | Mayor (horizonte corto) |
| **Desagregación territorial** | No incluye (agregado nacional) | Sí (por departamento y municipio) |
| **Vinculación presupuestal** | Indicativa, no vinculante | Vinculante para aprobación de proyectos |

**Relación**: El Plan de Recursos sirve como marco de referencia para la elaboración de cada PBC. El PBC es consistente con el Plan de Recursos, pero más ajustado a las condiciones actuales.

### C. Incertidumbre en Proyecciones de Largo Plazo

**Factores de incertidumbre**:

1. **Volatilidad de precios internacionales**:
   - Precios de petróleo, gas, carbón, oro son altamente volátiles
   - Dependen de geopolítica, oferta/demanda global, transición energética
   - Proyecciones a 10 años tienen margen de error amplio

2. **Cambios en producción**:
   - Nuevos descubrimientos de yacimientos (no predecibles)
   - Cierre de operaciones por agotamiento o baja rentabilidad
   - Cambios en políticas de explotación (ambientales, regulatorias)

3. **Cambios en tasa de cambio**:
   - Depreciación o apreciación del peso colombiano
   - Afecta directamente el valor en pesos de regalías (liquidadas en USD)

4. **Cambios regulatorios**:
   - Modificaciones en tarifas de regalías
   - Cambios en distribución por asignaciones
   - Nuevas reglas para el SGR

5. **Transición energética**:
   - Reducción de demanda de hidrocarburos a largo plazo
   - Impacto en precios y producción
   - Diversificación hacia energías renovables (no generan regalías tradicionales)

**Recomendaciones de uso**:
- **Años 1-3**: Proyecciones más confiables, útiles para planeación operativa
- **Años 4-7**: Proyecciones intermedias, útiles para proyectos estratégicos
- **Años 8-10**: Proyecciones indicativas, útiles para visión de largo plazo pero con alta incertidumbre

**Uso de escenarios**: Siempre evaluar escenarios optimista y pesimista para análisis de riesgo, no solo el escenario base.

### D. Uso del Plan de Recursos para Planeación

**Planeación de proyectos multianuales**:
- Proyectos de infraestructura de largo plazo (vías, acueductos) requieren financiación sostenida
- El Plan de Recursos permite evaluar si habrá recursos suficientes en el horizonte del proyecto
- Si el Plan proyecta crecimiento, mayor confianza para proyectos ambiciosos
- Si el Plan proyecta decrecimiento, prudencia y priorización de proyectos críticos

**Sostenibilidad fiscal territorial**:
- Territorios productores pueden evaluar si sus ingresos por Asignaciones Directas serán sostenibles
- Identificar si hay "picos" de recaudo que no se mantendrán (por agotamiento de recursos)
- Planear transición económica en territorios con producción declinante

**Planeación sectorial**:
- Sector de CTI puede planear inversiones de largo plazo según la proyección de su asignación (10%)
- Proyectos de paz pueden evaluar recursos disponibles en el horizonte

### E. Análisis de Sensibilidad y Gestión de Riesgo

**Análisis de sensibilidad** identifica qué variables tienen mayor impacto en las proyecciones.

**Variables típicamente más sensibles**:
1. **Precio del petróleo**: Cambios de ±10 USD/barril pueden variar el recaudo en ±15-20%
2. **Producción de petróleo**: Cambios de ±100,000 barriles/día impactan significativamente
3. **Tasa de cambio**: Depreciación del peso aumenta recaudo en pesos, apreciación lo reduce

**Gestión de riesgo**:
- Planear con escenario base, pero tener planes de contingencia para escenarios extremos
- Diversificar proyectos: no depender solo de proyectos de larga duración si proyecciones son inciertas
- Establecer reservas o fondos de estabilización para mitigar volatilidad (ej. FONPET)

## 4.5.7. Casos de Uso

### Caso de Uso 1: Evaluación de Viabilidad de Proyecto de Infraestructura de Largo Plazo
**Actor**: Secretaría de Infraestructura Departamental

**Objetivo**: Evaluar si habrá recursos suficientes del SGR para financiar un proyecto vial de 8 años.

**Pasos**:
1. Acceder al módulo "Plan de Recursos"
2. Seleccionar el Plan de Recursos más reciente (ej. 2025-2034)
3. Filtrar por "Inversión Local y Regional" (asignación que correspondería al departamento)
4. Revisar la proyección anual para los próximos 8 años
5. Sumar los recursos proyectados para los 8 años del proyecto
6. Comparar con el costo estimado del proyecto vial
7. Revisar los escenarios optimista y pesimista para evaluar riesgo
8. Si el escenario pesimista cubre el costo del proyecto → Alta viabilidad
9. Si solo el escenario optimista cubre el costo → Alto riesgo, replantear proyecto
10. Exportar datos a Excel para documento de viabilidad
11. Presentar análisis al gobernador y consejo de planeación

**Resultado**: Decisión informada sobre viabilidad financiera del proyecto con recursos del SGR.

---

### Caso de Uso 2: Planeación Estratégica de Inversión en CTI
**Actor**: Dirección de CTI del DNP (MinCiencias)

**Objetivo**: Planear la inversión en ciencia, tecnología e innovación para la próxima década según recursos disponibles del SGR.

**Pasos**:
1. Acceder al módulo "Plan de Recursos"
2. Seleccionar el Plan más reciente
3. Filtrar por asignación "CTI" (10% de ingresos corrientes)
4. Revisar la proyección de recursos de CTI para 10 años
5. Calcular el total decenal disponible para CTI
6. Analizar la tendencia: ¿Crecimiento, estabilidad o decrecimiento?
7. Revisar escenarios para evaluar rango de recursos posible
8. Exportar proyección a Excel
9. Elaborar plan estratégico de inversión en CTI:
   - Definir líneas de investigación prioritarias
   - Establecer metas de inversión por año
   - Identificar proyectos emblemáticos de largo plazo
   - Asignar recursos de manera consistente con proyección
10. Presentar plan estratégico a la Comisión Rectora del SGR

**Resultado**: Plan estratégico decenal de inversión en CTI alineado con recursos proyectados del SGR.

---

### Caso de Uso 3: Análisis de Riesgo Fiscal para Municipio Productor
**Actor**: Secretaría de Hacienda de Municipio Productor

**Objetivo**: Evaluar si los ingresos por Asignaciones Directas serán sostenibles o si hay riesgo de caída significativa.

**Pasos**:
1. Acceder al módulo "Plan de Recursos"
2. Seleccionar el Plan más reciente
3. Filtrar por "Asignaciones Directas"
4. Revisar la proyección para 10 años
5. Identificar si hay tendencia de crecimiento, estabilidad o decrecimiento
6. Si hay decrecimiento proyectado (por agotamiento de campos):
   - Calcular el año de "pico" de ingresos y el año de "valle"
   - Estimar la reducción porcentual respecto al nivel actual
7. Revisar el análisis de sensibilidad:
   - ¿Qué tan sensible es el municipio a cambios en precio del petróleo?
   - ¿La producción local está proyectada en declive?
8. Exportar proyección a Excel
9. Elaborar plan de sostenibilidad fiscal:
   - Priorizar proyectos de alto impacto en años de mayor ingreso
   - Planear diversificación económica si hay declive proyectado
   - Establecer fondo de ahorro para suavizar transición
10. Presentar análisis al alcalde y consejo municipal

**Resultado**: Estrategia de sostenibilidad fiscal ante variaciones proyectadas en ingresos de regalías.

---

### Caso de Uso 4: Comparación de Proyecciones entre Planes Sucesivos
**Actor**: Analista de Presupuesto del Ministerio de Hacienda

**Objetivo**: Evaluar cómo han cambiado las proyecciones del SGR entre el Plan actual y el Plan anterior.

**Pasos**:
1. Acceder al módulo "Plan de Recursos"
2. Seleccionar el Plan más reciente (ej. 2025-2034)
3. Revisar la proyección total decenal
4. Cambiar al Plan anterior (ej. 2024-2033)
5. Anotar la proyección del Plan anterior para los años coincidentes (2025-2033)
6. Regresar al Plan actual
7. Revisar el gráfico comparativo "Plan Actual vs Anterior"
8. Identificar si las proyecciones han sido revisadas al alza o a la baja
9. Analizar las causas de las revisiones:
   - ¿Cambios en precios internacionales esperados?
   - ¿Cambios en producción proyectada?
   - ¿Nuevos campos o cierres de operaciones?
10. Exportar comparación a Excel para análisis cuantitativo
11. Calcular la desviación promedio entre planes
12. Evaluar implicaciones para el Marco Fiscal de Mediano Plazo
13. Generar informe para el Comité de Regla Fiscal

**Resultado**: Comprensión de volatilidad de proyecciones y ajuste de expectativas fiscales.

---

### Caso de Uso 5: Evaluación de Impacto de Transición Energética
**Actor**: Analista de Política Energética del MME

**Objetivo**: Evaluar cómo la transición energética puede afectar los ingresos del SGR en el largo plazo.

**Pasos**:
1. Acceder al módulo "Plan de Recursos"
2. Seleccionar el Plan más reciente
3. Revisar la proyección de hidrocarburos para 10 años
4. Identificar si hay declive proyectado en años lejanos (años 7-10)
5. Revisar los supuestos de precio del petróleo y gas:
   - ¿Incluyen impacto de transición energética (menor demanda)?
   - ¿Son consistentes con políticas climáticas internacionales?
6. Revisar la proyección de minería:
   - ¿Incluye minerales críticos para transición energética (cobre, litio, níquel)?
7. Analizar el análisis de sensibilidad:
   - Escenario pesimista con precios bajos de petróleo y gas
   - ¿Cuánto caería el recaudo del SGR?
8. Exportar proyección a Excel
9. Elaborar escenarios alternativos:
   - Escenario de "transición acelerada" (precios hidro muy bajos, minería crítica alta)
   - Escenario de "transición lenta" (precios hidro estables por más tiempo)
10. Evaluar necesidad de diversificar fuentes de financiación del desarrollo territorial
11. Presentar análisis en foros de política energética

**Resultado**: Comprensión del impacto potencial de la transición energética en el SGR y recomendaciones de política.

---

## 4.5.8. Preguntas Frecuentes

**P1: ¿Qué tan confiables son las proyecciones a 10 años?**

R: La confiabilidad disminuye con el horizonte temporal:
- **Años 1-3**: Alta confiabilidad (basadas en producción actual y contratos vigentes)
- **Años 4-7**: Confiabilidad moderada (mayor incertidumbre en precios y producción)
- **Años 8-10**: Baja confiabilidad (alta incertidumbre, carácter indicativo)

Por eso se presentan escenarios (optimista, base, pesimista) y análisis de sensibilidad. Se recomienda usar rangos, no valores puntuales.

**P2: ¿El Plan de Recursos es vinculante para aprobar proyectos?**

R: No. El Plan de Recursos es un instrumento **indicativo** de planeación estratégica. El instrumento **vinculante** para aprobar proyectos es el **Plan Bienal de Caja (PBC)**, que se elabora cada bienio con mayor precisión.

El Plan de Recursos sirve como marco de referencia para la elaboración de PBC y para planeación de proyectos multianuales.

**P3: ¿Cuál es la diferencia entre el escenario "base", "optimista" y "pesimista"?**

R:
- **Escenario Base**: Supuestos más probables según proyecciones de organismos internacionales (EIA, Banco Mundial) y nacionales (MME, Banco de la República). Refleja la expectativa central.
- **Escenario Optimista**: Supone precios internacionales altos (+20-30% vs base) y mayor producción (+15-20% vs base). Representa el "mejor caso".
- **Escenario Pesimista**: Supone precios internacionales bajos (-20-30% vs base) y menor producción (-15-20% vs base). Representa el "peor caso".

Los escenarios extremos sirven para análisis de riesgo y planeación bajo incertidumbre.

**P4: ¿Por qué las proyecciones cambian de un Plan de Recursos a otro?**

R: Las proyecciones se actualizan anualmente con nueva información:
- Cambios en precios internacionales esperados (por nuevas proyecciones de organismos internacionales)
- Nuevos descubrimientos de yacimientos o cambios en producción
- Cambios en políticas de explotación o regulación
- Revisión de supuestos macroeconómicos (tasa de cambio, inflación)
- Aprendizaje de desviaciones pasadas entre lo proyectado y lo ejecutado

Es normal que haya revisiones, especialmente en años lejanos.

**P5: ¿El Plan de Recursos incluye proyección por departamento o municipio?**

R: No. El Plan de Recursos es una proyección **agregada a nivel nacional**. No incluye desagregación territorial.

La distribución territorial se realiza en el **Plan Bienal de Caja**, que sí detalla cuánto corresponde a cada departamento y municipio (especialmente en Asignaciones Directas).

**P6: ¿Qué pasa si el recaudo efectivo es muy diferente al Plan de Recursos?**

R: El Plan de Recursos se actualiza anualmente, incorporando las desviaciones observadas. Si hay diferencias estructurales (no temporales), se revisan los supuestos para el siguiente Plan.

El Plan Bienal de Caja, al ser más cercano en el tiempo, suele ajustarse más a la realidad. El Plan de Recursos es de largo plazo y por tanto más incierto.

**P7: ¿Incluye el Plan de Recursos el impacto de nuevas políticas ambientales o de fracking?**

R: Sí, en la medida en que esas políticas afecten la producción proyectada. Por ejemplo:
- Restricciones a fracking → Menor producción de hidrocarburos proyectada
- Moratoria a minería en ciertas zonas → Menor producción minera proyectada
- Nuevos proyectos aprobados → Mayor producción proyectada

Los supuestos deben reflejar las políticas vigentes y esperadas al momento de elaboración del Plan.

---

## 4.5.9. Relación con Otros Módulos

- **Plan Bienal de Caja**: El PBC se elabora consistentemente con el Plan de Recursos, pero con mayor precisión para el horizonte de 24 meses
- **Presupuesto y Recaudo**: Permite comparar el recaudo efectivo con lo proyectado en el Plan de Recursos de años anteriores
- **Recaudo Mensual SGR**: Muestra el recaudo real que puede compararse con proyecciones anuales del Plan de Recursos
- **Recaudo Asignaciones Directas**: La proyección de Asignaciones Directas del Plan de Recursos sirve como marco de referencia para territorios productores

---

**Anterior**: [4.4. Funcionamiento SSEC](04-04-sgr-funcionamiento-ssec.md) | **Siguiente**: [4.6. Plan Bienal de Caja](04-06-sgr-plan-bienal-caja.md)
