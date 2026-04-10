# 4.7. Comparativo SGR

**Ruta de acceso**: `/sgr-comparativo`

## 4.7.1. Propósito del Módulo

El módulo **Comparativo SGR** permite realizar comparaciones entre diferentes territorios, periodos temporales y asignaciones del Sistema General de Regalías. Es una herramienta de análisis comparado fundamental para:

- Comparar el desempeño de diferentes departamentos y municipios en el SGR
- Analizar la evolución temporal de recursos de regalías en un territorio
- Realizar benchmarking entre territorios similares (productores, no productores)
- Identificar brechas y oportunidades de mejora en gestión de recursos
- Apoyar la toma de decisiones basada en datos comparativos
- Evaluar el impacto de cambios en producción o normativa
- Facilitar análisis académicos y de política pública sobre el SGR

Este módulo integra información de múltiples fuentes (recaudo, PBC, asignaciones directas, proyectos) para ofrecer una visión comparativa integral del SGR.

## 4.7.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Comparación de Recaudo entre Territorios
- **Recaudo total por territorio**: Comparación de ingresos de regalías entre departamentos o municipios
- **Recaudo per cápita**: Regalías por habitante (normaliza por tamaño poblacional)
- **Composición del recaudo**: Hidrocarburos vs minería por territorio
- **Tendencias temporales**: Evolución del recaudo en cada territorio

### B. Comparación de Asignaciones del SGR
- **Asignaciones Directas**: Comparación del 20% y 5% entre territorios productores
- **Inversión Local y Regional**: Comparación de recursos disponibles entre territorios
- **Otras asignaciones**: CTI, Desarrollo Regional, Paz (cuando aplica comparación territorial)

### C. Comparación Temporal
- **Evolución bienal**: Comparación del mismo territorio entre diferentes bienios
- **Tasas de crecimiento**: Variación porcentual entre periodos
- **Identificación de tendencias**: Crecimiento, estabilidad, declive

### D. Comparación de Indicadores de Gestión
- **Proyectos aprobados**: Número y monto de proyectos por territorio
- **Ejecución presupuestal**: % de recursos efectivamente ejecutados
- **Recursos per cápita**: Regalías disponibles por habitante
- **Concentración de recursos**: Índices de distribución territorial

### E. Rankings y Posicionamiento
- **Top territorios**: Clasificación de departamentos y municipios según diferentes criterios
- **Posición relativa**: Ubicación de un territorio en el contexto nacional
- **Comparación con similares**: Benchmarking con territorios de características similares

### F. Análisis de Brechas
- **Brecha respecto al promedio**: Diferencia entre un territorio y el promedio nacional
- **Brecha respecto al líder**: Diferencia entre un territorio y el que más recursos recibe
- **Evolución de brechas**: Cambios en las diferencias a lo largo del tiempo

## 4.7.3. Controles y Filtros

### A. Selector de Tipo de Comparación
Define el eje principal de comparación:
- **Territorial**: Comparar diferentes territorios en un mismo periodo
- **Temporal**: Comparar el mismo territorio en diferentes periodos
- **Mixta**: Combinar comparación territorial y temporal (matriz)

### B. Selector de Territorios a Comparar

**Modo de selección**:
- **Selección manual**: Elegir hasta 10 departamentos o municipios específicos
- **Top N**: Automáticamente selecciona los N territorios con mayor valor en el criterio elegido (ej. Top 5 por recaudo)
- **Grupo predefinido**: Grupos como "Departamentos productores de petróleo", "Municipios de frontera", etc.
- **Todos**: Incluir todos los territorios (limita algunas visualizaciones)

**Filtros de territorio**:
- Departamento específico o todos
- Municipio específico o todos (si se selecciona departamento)
- Región geográfica (Caribe, Pacífica, Andina, Orinoquía, Amazonía)

### C. Selector de Periodos a Comparar

**Modo de selección**:
- **Selección manual**: Elegir hasta 5 bienios o años específicos
- **Últimos N bienios**: Automáticamente selecciona los N bienios más recientes
- **Rango temporal**: Desde bienio X hasta bienio Y

**Periodos disponibles**:
- Bienios: 2023-2024, 2024-2025, 2025-2026
- Años (si aplica): 2023, 2024, 2025, 2026

### D. Selector de Variable de Comparación
Define qué aspecto del SGR se está comparando:
- **Recaudo total**: Ingresos de regalías
- **Asignaciones Directas**: AD 20% + AD 5%
- **Inversión Local**: Recursos de la asignación del 55%
- **PBC total**: Plan Bienal de Caja
- **Proyectos aprobados**: Número y monto
- **Ejecución presupuestal**: % ejecutado
- **Recursos per cápita**: Normalizado por población

### E. Filtro de Tipo de Recurso
- **Todos**: Hidrocarburos + minería + otros
- **Hidrocarburos**: Solo petróleo y gas
- **Minería**: Solo explotación minera

### F. Selector de Métrica de Comparación
- **Valores absolutos**: Montos en millones de pesos
- **Valores per cápita**: Pesos por habitante
- **Índices (base 100)**: Normalización respecto a un periodo o territorio base
- **Variación porcentual**: Cambio porcentual respecto a referencia

### G. Toggle de Normalización
- **Sin normalizar**: Valores brutos (favorece territorios grandes)
- **Por población**: Valores per cápita (permite comparar territorios de diferente tamaño)
- **Por área**: Valores por km² (útil para análisis de densidad de producción)
- **Por NBI**: Valores por nivel de pobreza (análisis de equidad)

## 4.7.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas comparativas destacadas

**Métricas incluidas**:

1. **Territorio Líder**
   - Valor: Territorio con mayor valor en la variable seleccionada
   - Formato: "Meta: $1,234,567 M" o "Barrancabermeja: $456,789 M"
   - Contexto: % del total nacional

2. **Promedio de Territorios Comparados**
   - Valor: Promedio aritmético de los territorios seleccionados
   - Formato: "$XXX.XXX millones" o "$XXX,XXX per cápita"
   - Desviación estándar: Nivel de dispersión

3. **Brecha Líder - Último**
   - Valor: Diferencia entre el territorio con mayor y menor valor
   - Formato: Ratio "X.X veces" o diferencia absoluta "$XXX.XXX M"
   - Indicador: Nivel de desigualdad (alta, media, baja)

4. **Tendencia General**
   - Valor: Dirección de cambio en los territorios comparados
   - Formato: "Crecimiento promedio: +XX.X%" o "Decrecimiento promedio: -XX.X%"
   - Visualización: Flecha ascendente/descendente

5. **Número de Territorios en Comparación**
   - Valor: Cantidad de territorios seleccionados
   - Contexto: "X de Y totales" (ej. "10 de 32 departamentos")

6. **Índice de Concentración** (si aplica)
   - Valor: Índice de Herfindahl-Hirschman o Gini
   - Interpretación: Nivel de concentración de recursos

![Indicadores Clave del Comparativo SGR](../assets/screenshots/sgr-comparativo-kpis.png)
*Indicadores clave de comparación territorial y temporal*

### B. Gráfico de Barras - Comparación entre Territorios

**Tipo**: Gráfico de barras horizontales o verticales (según cantidad de territorios)

**Descripción**: Compara la variable seleccionada entre los territorios elegidos.

**Elementos visuales**:
- **Eje X (horizontal) o Y (vertical)**: Territorios
- **Eje Y (horizontal) o X (vertical)**: Valores en millones de pesos o métrica seleccionada
- **Barras**: Color diferenciado por nivel de valor (gradiente o categorías)
- **Línea de referencia**: Promedio de los territorios comparados
- **Etiquetas**: Valores exactos sobre/al final de cada barra

**Variantes según tipo de comparación**:
- **Barras simples**: Un solo periodo, múltiples territorios
- **Barras agrupadas**: Múltiples periodos, múltiples territorios (barras agrupadas por territorio)
- **Barras apiladas**: Composición de la variable (ej. hidrocarburos vs minería por territorio)

**Interactividad**:
- Hover muestra: "Meta - 2025-2026: $1,234,567 M (15.2% del total)"
- Clic en barra filtra las demás visualizaciones para ese territorio
- Ordenamiento: Ascendente, descendente, alfabético

**Interpretación**:
- Barras altas → Territorios con mayor valor en la variable
- Barras sobre la línea de promedio → Sobre el promedio
- Barras bajo la línea de promedio → Bajo el promedio

![Gráfico de Comparación entre Territorios](../assets/screenshots/sgr-comparativo-territorios.png)
*Comparación de variable seleccionada entre territorios*

### C. Gráfico de Líneas - Evolución Temporal por Territorio

**Tipo**: Gráfico de líneas múltiples

**Descripción**: Muestra la evolución de la variable en el tiempo para cada territorio seleccionado.

**Elementos visuales**:
- **Eje X**: Periodos temporales (bienios o años)
- **Eje Y**: Valores en millones de pesos o métrica seleccionada
- **Líneas**: Una línea por territorio, color diferenciado
- **Marcadores**: Puntos en cada periodo
- **Leyenda**: Territorios con color correspondiente

**Interactividad**:
- Hover sobre línea muestra: "Meta - 2024-2025: $1,100,456 M (+8.5% vs bienio anterior)"
- Clic en leyenda oculta/muestra ese territorio
- Zoom mediante selección de área

**Interpretación**:
- Líneas ascendentes → Crecimiento en el tiempo
- Líneas descendentes → Decrecimiento
- Líneas paralelas → Territorios con tendencias similares
- Líneas divergentes → Territorios con evoluciones diferentes

![Gráfico de Evolución Temporal](../assets/screenshots/sgr-comparativo-evolucion.png)
*Evolución temporal de la variable en territorios seleccionados*

### D. Tabla Comparativa Detallada

**Tipo**: Tabla estática con filas de territorios y columnas de métricas

**Descripción**: Presenta la comparación en formato tabular con múltiples métricas simultáneas.

**Columnas**:
1. **Territorio**: Nombre del departamento o municipio
2. **Variable Principal**: Valor de la variable seleccionada (ej. Recaudo Total)
3. **Ranking**: Posición relativa (1, 2, 3, ...)
4. **% del Total**: Participación porcentual en el total
5. **Per Cápita**: Valor normalizado por población
6. **Variación vs Anterior**: Cambio porcentual respecto al periodo anterior
7. **Brecha vs Promedio**: Diferencia respecto al promedio (absoluta y %)
8. **Tendencia**: Indicador visual de tendencia (↑ creciente, → estable, ↓ decreciente)

**Funcionalidades**:
- **Ordenamiento**: Clic en cualquier columna para ordenar
- **Filtro**: Búsqueda rápida por territorio
- **Resaltado condicional**:
  - Top 3: Fondo dorado
  - Sobre el promedio: Fondo verde claro
  - Bajo el promedio: Fondo naranja claro
  - Último: Fondo rojo claro
- **Exportación**: Descarga completa en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones
- Per cápita: "$XXX,XXX" por habitante
- Porcentajes: "+XX.X%" o "-XX.X%"
- Ranking: "#X"

**Fila de totales/promedios**:
- Total agregado (si aplica)
- Promedio de todos los territorios
- Mediana
- Desviación estándar

![Tabla Comparativa Detallada](../assets/screenshots/sgr-comparativo-tabla.png)
*Tabla comparativa con múltiples métricas por territorio*

### E. Mapa Comparativo de Colombia

**Tipo**: Mapa coroplético (de calor) con Leaflet

**Descripción**: Visualización geográfica de la variable comparada a nivel departamental o municipal.

**Elementos visuales**:
- **Mapa de Colombia**: Departamentos o municipios
- **Escala de color**: Gradiente según valor de la variable
  - Azul claro → Valores bajos
  - Azul intermedio → Valores medios
  - Azul oscuro → Valores altos
- **Rangos de valores**: Divididos en quintiles o cuartiles
- **Etiquetas geográficas**: Nombres de territorios

**Interactividad**:
- Hover muestra tooltip: "Meta: $1,234,567 M | Ranking: #1 | Per cápita: $1,250,000"
- Clic en territorio abre panel lateral con detalle comparativo
- Zoom y pan para explorar regiones
- Toggle para cambiar entre valores absolutos y per cápita (actualiza colores)

**Leyenda**:
- Rangos de valores con colores correspondientes
- Territorios sin datos (si aplica) en gris

**Interpretación**:
- Regiones azul oscuro → Territorios con mayor valor en la variable
- Regiones azul claro → Territorios con menor valor
- Patrones geográficos: Concentración regional, dispersión

![Mapa Comparativo de Colombia](../assets/screenshots/sgr-comparativo-mapa.png)
*Mapa de calor comparativo de la variable seleccionada*

### F. Gráfico de Dispersión - Comparación Bivariada

**Tipo**: Gráfico de dispersión (scatter plot)

**Descripción**: Permite comparar dos variables simultáneamente para identificar correlaciones.

**Elementos visuales**:
- **Eje X**: Variable 1 (ej. Recaudo Total)
- **Eje Y**: Variable 2 (ej. Proyectos Aprobados)
- **Puntos**: Cada territorio es un punto
- **Tamaño de puntos**: Puede representar una tercera variable (ej. población)
- **Color de puntos**: Puede representar región geográfica o tipo de territorio
- **Línea de tendencia**: Regresión lineal (si hay correlación)
- **Cuadrantes**: Divisiones por promedio de X y Y

**Interactividad**:
- Hover muestra: "Meta: Recaudo $1,234 M | Proyectos $890 M | Población 1.2M"
- Clic en punto resalta ese territorio en todas las visualizaciones
- Selector de variables X e Y (dinámico)

**Interpretación**:
- Puntos en cuadrante superior derecho → Alto en ambas variables
- Puntos en cuadrante inferior izquierdo → Bajo en ambas variables
- Línea de tendencia ascendente → Correlación positiva
- Puntos dispersos → No hay correlación clara

**Ejemplo de análisis**:
- X: Recaudo de regalías | Y: Ejecución presupuestal
- ¿Los territorios con más recursos ejecutan mejor? (esperado: correlación positiva)
- Territorios sobre la línea de tendencia → Ejecutan mejor de lo esperado
- Territorios bajo la línea → Ejecutan peor de lo esperado

![Gráfico de Dispersión Bivariada](../assets/screenshots/sgr-comparativo-dispersion.png)
*Comparación bivariada de dos variables del SGR*

### G. Gráfico de Radar - Perfil Multidimensional

**Tipo**: Gráfico de radar (spider chart)

**Descripción**: Compara múltiples dimensiones del SGR simultáneamente para hasta 5 territorios.

**Elementos visuales**:
- **Ejes radiales**: Cada eje representa una dimensión (normalizada 0-100)
  - Recaudo Total
  - Asignaciones Directas
  - Proyectos Aprobados
  - Ejecución Presupuestal
  - Recursos per Cápita
  - Dependencia de Regalías (% del presupuesto territorial)
- **Polígonos**: Un polígono por territorio, color diferenciado
- **Leyenda**: Territorios con color correspondiente

**Interactividad**:
- Hover sobre vértice muestra: "Meta - Recaudo Total: 95/100 (superior)"
- Clic en leyenda oculta/muestra ese territorio

**Interpretación**:
- Polígonos grandes → Territorios con buen desempeño general
- Polígonos irregulares → Fortalezas y debilidades específicas
- Comparación visual de perfiles entre territorios

**Útil para**: Identificar territorios con perfiles similares o complementarios (benchmarking).

![Gráfico de Radar Multidimensional](../assets/screenshots/sgr-comparativo-radar.png)
*Perfil multidimensional de territorios seleccionados*

### H. Matriz de Comparación - Heatmap

**Tipo**: Mapa de calor de doble entrada (heatmap)

**Descripción**: Matriz que muestra la variable comparada para múltiples territorios y periodos simultáneamente.

**Elementos visuales**:
- **Filas**: Territorios
- **Columnas**: Periodos temporales (bienios o años)
- **Celdas coloreadas**: Escala de color según valor
  - Verde claro → Valores bajos
  - Verde intermedio → Valores medios
  - Verde oscuro → Valores altos
- **Valores en celdas**: Montos o métricas (opcional, se puede ocultar para claridad visual)

**Interactividad**:
- Hover muestra: "Meta - 2025-2026: $1,234,567 M | Variación vs anterior: +8.5%"
- Clic en celda navega al detalle de ese territorio y periodo

**Interpretación**:
- Filas con predominancia de verde oscuro → Territorios con valores altos consistentes
- Columnas con predominancia de verde oscuro → Periodos de alto desempeño general
- Patrones de color permiten identificar tendencias temporales y territoriales

![Heatmap de Comparación Territorial-Temporal](../assets/screenshots/sgr-comparativo-heatmap.png)
*Matriz de calor de comparación territorial y temporal*

### I. Gráfico de Cascada - Descomposición de Brechas

**Tipo**: Gráfico de cascada (waterfall)

**Descripción**: Descompone la diferencia entre dos territorios (ej. líder vs último) en factores explicativos.

**Elementos visuales**:
- **Barra inicial**: Valor del territorio de referencia (ej. líder)
- **Barras intermedias**: Factores que explican la diferencia
  - Diferencia en hidrocarburos
  - Diferencia en minería
  - Diferencia en otros ingresos
- **Barra final**: Valor del territorio comparado (ej. último)
- **Conexiones**: Líneas que muestran el flujo de diferencias

**Interactividad**:
- Hover muestra: "Diferencia en hidrocarburos: +$450,000 M"
- Selector de territorios a comparar

**Interpretación**:
- Identifica qué factores explican las brechas entre territorios
- Útil para entender por qué un territorio recibe más/menos recursos

![Gráfico de Cascada de Brechas](../assets/screenshots/sgr-comparativo-cascada.png)
*Descomposición de diferencias entre territorios*

## 4.7.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, territorios, periodos y fuente.

### B. Descarga de Datos Comparativos en Excel
**Botón**: "Exportar Comparación a Excel"
**Contenido del archivo**:

**Hoja 1: Comparación Territorial**
- Tabla con todos los territorios y métricas comparadas
- Valores absolutos, per cápita, rankings, brechas
- Formato condicional

**Hoja 2: Evolución Temporal**
- Serie temporal de cada territorio seleccionado
- Variaciones anuales/bienales
- Tasas de crecimiento

**Hoja 3: Matriz Comparativa**
- Matriz de doble entrada (territorios × periodos)
- Valores de la variable seleccionada

**Hoja 4: Rankings**
- Clasificación de territorios por la variable seleccionada
- Rankings históricos (evolución de posiciones)

**Hoja 5: Estadísticas Descriptivas**
- Promedios, medianas, desviación estándar
- Máximos, mínimos, rangos
- Índices de concentración (Gini, Herfindahl)

**Hoja 6: Gráficos**
- Gráficos automáticos listos para usar en presentaciones
- Barras comparativas, líneas de evolución

**Hoja 7: Metadatos**
- Fecha de generación
- Territorios comparados
- Periodos comparados
- Variable de comparación
- Filtros aplicados
- Fuente de datos

**Formato del archivo**:
- Nombre: "SGR_Comparativo_[Variable]_[Territorios]_[Fecha].xlsx"
- Encabezados en negrilla
- Filtros automáticos
- Tablas dinámicas preparadas

### C. Descarga de Informe Comparativo (PDF)
**Botón**: "Generar Informe Comparativo PDF"
**Contenido**:
1. Portada con título, territorios y periodos comparados
2. Resumen ejecutivo (1 página)
3. Indicadores clave de comparación
4. Gráfico de barras comparativo entre territorios
5. Gráfico de evolución temporal
6. Mapa comparativo de Colombia
7. Tabla comparativa detallada (resumida)
8. Gráfico de dispersión bivariada (si aplica)
9. Análisis de brechas y tendencias
10. Conclusiones automáticas (basadas en datos)
11. Metodología de comparación
12. Fuentes de datos

**Formato**: Documento de 12-18 páginas, formato carta.

## 4.7.6. Interpretación Técnica

### A. Metodología de Comparación

**Normalización de valores**:
- **Per cápita**: Permite comparar territorios de diferente tamaño poblacional. Útil para identificar intensidad de recursos por habitante.
- **Índices base 100**: Normalización respecto a un periodo o territorio de referencia. Facilita visualización de cambios relativos.
- **Z-scores**: Estandarización estadística para identificar valores atípicos (outliers).

**Selección de territorios comparables**:
- **Similares**: Comparar territorios con características similares (tamaño, nivel de desarrollo, tipo de producción)
- **Benchmark**: Comparar con el "mejor en clase" para identificar brechas de mejora
- **Regional**: Comparar dentro de una misma región geográfica

### B. Interpretación de Rankings

**Ranking absoluto**: Posición según el valor bruto de la variable.
- Útil para identificar líderes y rezagados
- Puede estar sesgado por tamaño del territorio

**Ranking per cápita**: Posición según el valor normalizado por población.
- Más justo para comparar territorios de diferente tamaño
- Refleja intensidad de recursos por habitante

**Cambio de posición en ranking**:
- Territorio que sube posiciones → Mejora relativa (crece más que otros)
- Territorio que baja posiciones → Deterioro relativo (crece menos o decrece)

### C. Análisis de Brechas

**Brecha absoluta**: Diferencia en millones de pesos entre territorios.
- Magnitud real de la diferencia
- Útil para dimensionar el tamaño de la desigualdad

**Brecha relativa**: Ratio o diferencia porcentual.
- Proporciona contexto: ¿Cuántas veces mayor es el líder?
- Útil para comparaciones dinámicas en el tiempo

**Evolución de brechas**:
- Brechas crecientes → Aumento de desigualdad (divergencia)
- Brechas decrecientes → Reducción de desigualdad (convergencia)

### D. Correlaciones y Causalidad

**Importante**: Una correlación (relación estadística) **NO implica causalidad** (relación causa-efecto).

**Ejemplo**:
- Correlación observada: Territorios con mayor recaudo tienen mayor ejecución presupuestal
- Posible interpretación causal: Mayor disponibilidad de recursos facilita mejor ejecución
- Interpretación alternativa: Territorios con mejor capacidad institucional atraen más producción Y ejecutan mejor (factor común)

**Recomendación**: Usar correlaciones para generar hipótesis, pero validar con análisis más profundos.

### E. Consideraciones de Equidad

**Equidad horizontal**: Territorios similares deben recibir recursos similares.
- En el SGR, territorios productores reciben Asignaciones Directas proporcionales a producción (equidad por contribución)
- Territorios no productores reciben Inversión Local según fórmula (equidad por necesidad)

**Equidad vertical**: Territorios con mayores necesidades deben recibir más apoyo.
- La fórmula de Inversión Local incluye NBI (necesidades básicas insatisfechas) con ponderación del 20%

**Trade-off**: Equidad por contribución (productores) vs equidad por necesidad (no productores).

## 4.7.7. Casos de Uso

### Caso de Uso 1: Benchmarking entre Municipios Productores
**Actor**: Alcalde de Municipio Productor

**Objetivo**: Comparar el desempeño del municipio con otros municipios productores similares para identificar brechas y oportunidades.

**Pasos**:
1. Acceder al módulo "Comparativo SGR"
2. Seleccionar "Comparación Territorial"
3. En variable de comparación seleccionar "Asignaciones Directas"
4. Seleccionar el municipio propio
5. En "Grupo predefinido" seleccionar "Municipios productores de petróleo" (o minería)
6. El sistema muestra los 10 municipios productores con mayor AD
7. Revisar el gráfico de barras comparativo
8. Verificar la posición del municipio propio en el ranking
9. Revisar la tabla comparativa:
   - Comparar AD total, AD per cápita, % del departamento
   - Identificar municipios con mayor AD per cápita (mejor desempeño relativo)
10. Revisar el gráfico de dispersión: AD Total vs Proyectos Aprobados
   - ¿Municipios con más AD aprueban más proyectos?
   - ¿El municipio propio ejecuta proporcionalmente a su AD?
11. Exportar comparación a Excel
12. Identificar brechas: ¿Por qué otros municipios reciben más AD per cápita?
13. Preparar plan de acción para mejorar (si aplica: atraer más producción, mejorar certificación)

**Resultado**: Identificación de brechas respecto a municipios comparables y plan de mejora.

---

### Caso de Uso 2: Análisis de Evolución Temporal de un Departamento
**Actor**: Secretaría de Planeación Departamental

**Objetivo**: Analizar cómo han evolucionado los recursos del SGR en el departamento durante los últimos bienios.

**Pasos**:
1. Acceder al módulo "Comparativo SGR"
2. Seleccionar "Comparación Temporal"
3. Seleccionar el departamento propio
4. En variable de comparación seleccionar "PBC Total"
5. Seleccionar "Últimos 3 bienios" (ej. 2023-2024, 2024-2025, 2025-2026)
6. Revisar el gráfico de líneas de evolución temporal
7. Identificar tendencia: ¿Crecimiento, estabilidad o decrecimiento?
8. Revisar la tabla comparativa:
   - PBC de cada bienio
   - Variación porcentual bienio a bienio
   - Tasa de crecimiento anual compuesta (CAGR)
9. Cambiar variable a "Asignaciones Directas" (si es productor)
10. Verificar si la tendencia es similar o diferente
11. Cambiar variable a "Inversión Local"
12. Analizar evolución de recursos no dependientes de producción
13. Exportar datos a Excel
14. Elaborar proyecciones para bienios futuros basadas en tendencia histórica
15. Ajustar planeación de inversión según tendencia identificada

**Resultado**: Comprensión de la tendencia temporal de recursos del SGR en el departamento.

---

### Caso de Uso 3: Comparación Regional de Recursos del SGR
**Actor**: Analista de Política Regional del DNP

**Objetivo**: Comparar cómo se distribuyen los recursos del SGR entre las diferentes regiones geográficas de Colombia.

**Pasos**:
1. Acceder al módulo "Comparativo SGR"
2. Seleccionar "Comparación Territorial"
3. En variable seleccionar "Recaudo Total"
4. En territorios seleccionar "Grupo predefinido: Regiones geográficas"
5. El sistema agrupa departamentos por región: Caribe, Pacífica, Andina, Orinoquía, Amazonía
6. Revisar el gráfico de barras comparativo entre regiones
7. Identificar qué región recibe más recursos del SGR
8. Cambiar métrica a "Recursos per cápita"
9. Verificar si el ranking cambia (normalización por población)
10. Revisar el gráfico de composición (hidrocarburos vs minería) por región
11. Identificar dependencia relativa de cada región
12. Revisar el mapa de Colombia para visualización geográfica
13. Exportar comparación a Excel
14. Calcular índices de concentración regional (Gini, Herfindahl)
15. Elaborar análisis de equidad regional:
   - ¿Hay concentración excesiva en una región?
   - ¿Las regiones con mayor pobreza reciben más recursos? (cruzar con NBI)
16. Generar informe PDF para presentación al Consejo de Ministros

**Resultado**: Análisis de distribución regional de recursos del SGR y evaluación de equidad.

---

### Caso de Uso 4: Identificación de Mejores Prácticas en Ejecución Presupuestal
**Actor**: Consultor de Fortalecimiento Institucional

**Objetivo**: Identificar territorios con mejor desempeño en ejecución presupuestal para documentar mejores prácticas.

**Pasos**:
1. Acceder al módulo "Comparativo SGR"
2. Seleccionar "Comparación Territorial"
3. En variable seleccionar "Ejecución Presupuestal" (% ejecutado)
4. Seleccionar "Top 10" territorios con mayor ejecución
5. Revisar el gráfico de barras comparativo
6. Identificar los 3 municipios/departamentos con mayor % de ejecución
7. Cambiar a gráfico de dispersión:
   - X: Recursos disponibles (PBC)
   - Y: Ejecución presupuestal (%)
8. Identificar territorios sobre la línea de tendencia (ejecutan mejor de lo esperado)
9. Revisar el gráfico de radar para estos 3 territorios:
   - ¿Tienen buen desempeño en múltiples dimensiones?
10. Exportar lista de Top 10 a Excel
11. Realizar visitas de campo a los 3 mejores territorios
12. Documentar factores de éxito:
   - Capacidad técnica del equipo
   - Procesos de planeación y seguimiento
   - Articulación con ejecutores
   - Herramientas tecnológicas utilizadas
13. Elaborar guía de mejores prácticas
14. Socializar con otros territorios para replicación

**Resultado**: Identificación y documentación de mejores prácticas en gestión del SGR.

---

### Caso de Uso 5: Análisis de Impacto de Cambio Normativo
**Actor**: Investigador Académico

**Objetivo**: Evaluar cómo un cambio normativo (ej. nueva fórmula de distribución) afectó a diferentes territorios.

**Pasos**:
1. Acceder al módulo "Comparativo SGR"
2. Seleccionar "Comparación Mixta" (territorial + temporal)
3. Seleccionar múltiples departamentos (ej. 10 departamentos representativos)
4. Seleccionar 2 bienios: uno antes y uno después del cambio normativo
5. En variable seleccionar "Inversión Local y Regional"
6. Revisar la matriz de heatmap (departamentos × bienios)
7. Identificar departamentos con cambios significativos de color (aumento o reducción)
8. Revisar el gráfico de líneas de evolución por departamento
9. Identificar departamentos "ganadores" (incremento de recursos) y "perdedores" (reducción)
10. Calcular para cada departamento:
   - Variación absoluta (pesos)
   - Variación relativa (%)
11. Exportar datos a Excel
12. Realizar análisis estadístico:
   - ¿Qué características tienen los departamentos ganadores vs perdedores?
   - ¿La nueva fórmula favorece a departamentos con mayor NBI? ¿Mayor población? ¿Mejor desempeño fiscal?
13. Correlacionar variación con características de departamentos
14. Elaborar paper académico sobre impacto redistributivo del cambio normativo
15. Presentar hallazgos en conferencia académica

**Resultado**: Evaluación empírica del impacto de cambio normativo en distribución territorial de recursos.

---

## 4.7.8. Preguntas Frecuentes

**P1: ¿Qué significa "per cápita" en el contexto del SGR?**

R: "Per cápita" significa "por habitante". Se calcula dividiendo el total de recursos del SGR que recibe un territorio entre su población. Por ejemplo, si un municipio de 100,000 habitantes recibe $10,000 millones, el SGR per cápita es $100,000 por habitante. Esta métrica permite comparar territorios de diferente tamaño de manera más justa.

**P2: ¿Por qué un territorio puede tener ranking alto en valores absolutos pero bajo en per cápita?**

R: Porque tiene gran población. Un departamento grande puede recibir muchos recursos en términos absolutos, pero al dividirlos entre su población, el valor per cápita puede ser bajo. Por ejemplo:
- Departamento A: $1,000 millones / 1,000,000 habitantes = $1,000 per cápita
- Departamento B: $500 millones / 100,000 habitantes = $5,000 per cápita

Departamento A tiene más recursos absolutos (ranking alto), pero B tiene más recursos por habitante (mejor ranking per cápita).

**P3: ¿Cómo interpretar el gráfico de dispersión?**

R: El gráfico de dispersión muestra la relación entre dos variables. Cada punto representa un territorio. Si los puntos forman una línea ascendente, hay correlación positiva (cuando X aumenta, Y también). Si forman línea descendente, hay correlación negativa. Si están dispersos sin patrón, no hay correlación. La línea de tendencia ayuda a identificar territorios que están por encima (mejor desempeño relativo) o por debajo (peor desempeño relativo) de lo esperado.

**P4: ¿Qué es el índice de concentración y cómo se interpreta?**

R: El índice de concentración (Gini o Herfindahl-Hirschman) mide qué tan concentrados están los recursos en pocos territorios:
- **Valor bajo (0.0-0.3)**: Baja concentración, recursos distribuidos de manera relativamente equitativa
- **Valor medio (0.3-0.6)**: Concentración moderada
- **Valor alto (0.6-1.0)**: Alta concentración, pocos territorios reciben la mayoría de recursos

En el SGR, es común tener concentración moderada-alta en Asignaciones Directas (pocos territorios productores) y baja concentración en Inversión Local (distribuida entre todos).

**P5: ¿Es malo que haya brechas grandes entre territorios?**

R: Depende del contexto:
- En **Asignaciones Directas**: Brechas grandes son esperables porque reflejan diferencias en producción de recursos naturales (equidad por contribución).
- En **Inversión Local**: Brechas muy grandes pueden indicar inequidad, ya que esta asignación busca distribuir recursos a todos los territorios según necesidades y desempeño.

Lo importante es que las brechas estén justificadas por criterios objetivos (producción, población, NBI, etc.), no por discrecionalidad.

**P6: ¿Cómo puedo saber si mi territorio está mejorando o empeorando respecto a otros?**

R: Hay dos formas de evaluar:
1. **Mejora absoluta**: Comparar el valor actual de tu territorio con su valor en periodos anteriores. Si crece, hay mejora absoluta.
2. **Mejora relativa**: Comparar el ranking de tu territorio en diferentes periodos. Si sube posiciones, hay mejora relativa (creces más rápido que otros). Si bajas posiciones, hay deterioro relativo (otros crecen más rápido que tú).

Puede haber mejora absoluta con deterioro relativo (tu territorio crece, pero otros crecen más).

**P7: ¿Qué territorios debo seleccionar para una comparación justa?**

R: Depende del objetivo:
- **Benchmarking**: Seleccionar territorios similares en características (tamaño, nivel de desarrollo, tipo de producción)
- **Aspiracional**: Seleccionar el "mejor en clase" para identificar brechas y aprender
- **Grupo de referencia**: Seleccionar territorios de la misma región geográfica
- **Representativo**: Seleccionar una muestra diversa que represente diferentes tipos de territorios

Evitar comparar "peras con manzanas" (ej. municipio pequeño productor vs departamento grande no productor).

---

## 4.7.9. Relación con Otros Módulos

El módulo Comparativo SGR integra información de todos los demás módulos:
- **Recaudo Mensual SGR**: Datos de recaudo para comparaciones
- **Recaudo Asignaciones Directas**: Datos de AD para comparar territorios productores
- **Presupuesto y Recaudo**: Datos de ejecución del PBC
- **Plan Bienal de Caja**: Datos de disponibilidad de recursos
- **Plan de Recursos**: Proyecciones de largo plazo para comparaciones temporales
- **Funcionamiento SSEC**: Datos de eficiencia administrativa

Es un módulo **transversal** que permite análisis comparado de cualquier aspecto del SGR.

---

**Anterior**: [4.6. Plan Bienal de Caja](04-06-sgr-plan-bienal-caja.md) | **Siguiente**: [5. Presupuesto General de la Nación (PGN)](../05-pgn/05-00-pgn-introduccion.md)

---

## 4.8. Conclusión del Capítulo SGR

El Sistema General de Regalías es un instrumento fundamental para el desarrollo territorial de Colombia, redistribuyendo los recursos provenientes de la explotación de recursos naturales no renovables. Los módulos del SGR en SICODIS proporcionan información detallada, transparente y oportuna sobre:

- El recaudo mensual de regalías por tipo de recurso (hidrocarburos y minería)
- La distribución de Asignaciones Directas a territorios productores
- La comparación entre el Plan Bienal de Caja proyectado y el recaudo efectivo
- Los recursos destinados al funcionamiento y seguimiento del sistema (SSEC)
- La proyección de largo plazo de ingresos del SGR (Plan de Recursos de 10 años)
- La programación financiera mensual del bienio (Plan Bienal de Caja)
- El análisis comparativo entre territorios y periodos (Comparativo SGR)

Estos módulos son herramientas esenciales para:
- **Entidades territoriales**: Planear la inversión de recursos de regalías
- **OCAD**: Aprobar proyectos con base en disponibilidad real de recursos
- **Órganos de control**: Verificar la transparencia y correcta distribución de recursos
- **Ciudadanía**: Ejercer veeduría y participación informada
- **Investigadores**: Analizar el impacto del SGR en el desarrollo territorial

La comprensión integral de estos módulos permite maximizar el impacto de las regalías en el desarrollo sostenible, la reducción de desigualdades y la mejora de la calidad de vida de los colombianos.

---

**Continúa en**: [Capítulo 5: Presupuesto General de la Nación (PGN)](../05-pgn/05-00-pgn-introduccion.md)
