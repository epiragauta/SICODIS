# 4.1. Recaudo Mensual SGR

**Ruta de acceso**: `/sgr-recaudo-mensual`

## 4.1.1. Propósito del Módulo

El módulo **Recaudo Mensual SGR** permite realizar el seguimiento detallado del recaudo de regalías mes a mes durante un bienio específico. Este módulo es fundamental para:

- Monitorear la evolución temporal del recaudo de regalías
- Identificar tendencias y estacionalidad en la producción de recursos naturales
- Comparar el comportamiento del recaudo entre minería e hidrocarburos
- Detectar variaciones significativas que puedan afectar la planeación presupuestal
- Evaluar el cumplimiento de las proyecciones del Plan Bienal de Caja
- Realizar análisis de sensibilidad ante fluctuaciones de precios internacionales

Este módulo es especialmente útil para la **planeación financiera de corto plazo** y el **ajuste de expectativas presupuestales** durante la ejecución del bienio.

## 4.1.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Recaudo Mensual Agregado
- **Recaudo total por mes**: Suma de todos los ingresos por regalías en cada mes del bienio
- **Recaudo acumulado**: Suma progresiva del recaudo desde el inicio del bienio
- **Promedio mensual**: Recaudo promedio durante el periodo consultado
- **Variación intermensual**: Cambio porcentual entre meses consecutivos

### B. Recaudo por Tipo de Recurso
- **Hidrocarburos**: Regalías provenientes de petróleo y gas natural
- **Minería**: Regalías provenientes de carbón, oro, níquel, esmeraldas y otros minerales
- **Proporción hidrocarburos/minería**: Distribución porcentual del recaudo

### C. Desagregación Temporal
- **Serie histórica mensual**: Evolución del recaudo durante los 24 meses del bienio
- **Comparación año 1 vs año 2 del bienio**: Análisis del comportamiento entre los dos años
- **Identificación de meses pico**: Meses con mayor recaudo
- **Identificación de meses valle**: Meses con menor recaudo

### D. Ingresos Corrientes vs No Corrientes
- **Ingresos Corrientes (IAC)**: Regalías de producción regular
- **Ingresos No Corrientes**: Recursos extraordinarios, rendimientos financieros, recuperación de cartera
- **Diferenciación en visualizaciones**: Permite entender la composición del recaudo

### E. Recaudo Aforado vs No Aforado
- **Aforado**: Recaudo proyectado en el Plan Bienal de Caja
- **No Aforado**: Recaudo adicional no proyectado
- **Desviaciones**: Diferencias entre lo proyectado y lo ejecutado

## 4.1.3. Controles y Filtros

### A. Selector de Vigencia Bienal
Permite seleccionar el bienio a consultar:
- 2023-2024
- 2024-2025
- 2025-2026

**Comportamiento**: Al cambiar el bienio, todas las visualizaciones se actualizan automáticamente para mostrar los 24 meses correspondientes.

### B. Filtro de Tipo de Recurso
Permite filtrar la información por:
- **Todos**: Muestra el recaudo total (hidrocarburos + minería)
- **Hidrocarburos**: Solo regalías de petróleo y gas
- **Minería**: Solo regalías de explotación minera

**Uso recomendado**: Seleccionar "Todos" para análisis agregado, o tipos específicos para estudios sectoriales.

### C. Filtro de Tipo de Ingreso (opcional en algunos componentes)
- **Corrientes**: Solo ingresos de producción regular
- **No Corrientes**: Solo ingresos extraordinarios
- **Todos**: Ambos tipos de ingresos

### D. Selector de Periodo de Análisis
Permite definir el rango de meses a visualizar:
- **Todo el bienio**: 24 meses completos
- **Año 1**: Primeros 12 meses
- **Año 2**: Últimos 12 meses
- **Personalizado**: Selección de mes inicial y mes final

## 4.1.4. Visualizaciones

### A. Gráfico de Serie Temporal - Recaudo Mensual

**Tipo**: Gráfico de líneas con barras combinadas

**Descripción**: Muestra la evolución mes a mes del recaudo de regalías durante el bienio.

**Elementos visuales**:
- **Barras apiladas**: Representan el recaudo mensual, diferenciando hidrocarburos (azul) y minería (verde)
- **Línea de tendencia**: Muestra la tendencia general del recaudo (promedio móvil de 3 meses)
- **Eje X**: Meses del bienio (Ene 2023, Feb 2023, ..., Dic 2024)
- **Eje Y**: Valores en millones de pesos (COP)
- **Etiquetas**: Valores exactos de recaudo en cada mes

**Interactividad**:
- Hover sobre barras muestra detalle: "Marzo 2023: $456,789 millones (Hidrocarburos: $345,678 M | Minería: $111,111 M)"
- Clic en leyenda oculta/muestra hidrocarburos o minería
- Zoom mediante selección de área

**Interpretación**:
- Barras altas indican meses de alto recaudo (típicamente relacionados con mayor producción o precios internacionales elevados)
- Barras bajas pueden indicar caídas en producción, precios o paradas técnicas
- La línea de tendencia permite identificar si el recaudo está creciendo, decreciendo o estable

![Gráfico de Recaudo Mensual SGR](../assets/screenshots/sgr-recaudo-mensual-grafico.png)
*Gráfico de serie temporal del recaudo mensual con diferenciación por tipo de recurso*

### B. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **Recaudo Total del Bienio**
   - Valor: Suma total del recaudo en los 24 meses
   - Formato: "$X.XXX.XXX millones"
   - Comparación: Variación % respecto al bienio anterior

2. **Promedio Mensual**
   - Valor: Recaudo total / 24 meses
   - Formato: "$XXX.XXX millones/mes"
   - Indicador: Tendencia (↑ creciente, ↓ decreciente, → estable)

3. **Mes de Mayor Recaudo**
   - Valor: Mes y año del recaudo máximo
   - Formato: "Marzo 2024: $XXX.XXX millones"
   - Porcentaje: % que representa del promedio

4. **Mes de Menor Recaudo**
   - Valor: Mes y año del recaudo mínimo
   - Formato: "Julio 2023: $XXX.XXX millones"
   - Porcentaje: % que representa del promedio

5. **Participación Hidrocarburos**
   - Valor: Porcentaje del recaudo total
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge

6. **Participación Minería**
   - Valor: Porcentaje del recaudo total
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge

**Diseño**: Tarjetas con íconos, colores diferenciados y tendencias visuales (flechas o gráficos sparkline)

![Indicadores Clave de Recaudo](../assets/screenshots/sgr-recaudo-mensual-kpis.png)
*Indicadores clave de recaudo mensual*

### C. Gráfico Comparativo - Hidrocarburos vs Minería

**Tipo**: Gráfico de áreas apiladas

**Descripción**: Visualiza la composición del recaudo y la evolución de cada tipo de recurso.

**Elementos visuales**:
- **Área inferior (azul)**: Recaudo de hidrocarburos
- **Área superior (verde)**: Recaudo de minería
- **Altura total**: Recaudo mensual total
- **Eje X**: Meses del bienio
- **Eje Y**: Valores en millones de pesos

**Interpretación**:
- Permite ver visualmente la predominancia de hidrocarburos o minería en cada mes
- Identifica cambios en la composición del recaudo
- Útil para entender dependencia del SGR respecto a cada sector

![Gráfico Comparativo Hidrocarburos vs Minería](../assets/screenshots/sgr-recaudo-hidrocarburos-mineria.png)
*Composición del recaudo por tipo de recurso natural*

### D. Tabla de Recaudo Mensual Detallado

**Tipo**: TreeTable de PrimeNG con capacidad de expansión

**Descripción**: Presenta el detalle numérico del recaudo mes a mes con desagregaciones.

**Columnas**:
1. **Mes**: Nombre del mes y año (expandible)
2. **Recaudo Total**: Suma de hidrocarburos + minería
3. **Hidrocarburos**: Recaudo de petróleo y gas
4. **Minería**: Recaudo de explotación minera
5. **% Hidrocarburos**: Participación porcentual
6. **% Minería**: Participación porcentual
7. **Variación Mensual**: % de cambio respecto al mes anterior
8. **Acumulado**: Suma acumulada desde el inicio del bienio

**Estructura jerárquica (al expandir mes)**:
- **Nivel 1**: Mes (ej. "Marzo 2023")
  - **Nivel 2**: Tipo de ingreso (Corriente / No Corriente)
    - **Nivel 3**: Tipo de recurso (Hidrocarburos / Minería)
      - **Nivel 4**: Aforado / No Aforado

**Funcionalidades**:
- **Ordenamiento**: Clic en encabezados para ordenar por cualquier columna
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Búsqueda**: Filtro rápido por mes
- **Exportación**: Botón para descargar tabla en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones con separador de miles
- Porcentajes: "XX.X%" con un decimal
- Resaltado condicional: Meses con recaudo superior al promedio en verde claro

![Tabla de Recaudo Mensual Detallado](../assets/screenshots/sgr-recaudo-mensual-tabla.png)
*Tabla detallada de recaudo mensual con estructura jerárquica*

### E. Gráfico de Acumulado

**Tipo**: Gráfico de líneas con área bajo la curva

**Descripción**: Muestra la evolución del recaudo acumulado desde el inicio del bienio.

**Elementos visuales**:
- **Línea principal**: Recaudo acumulado total
- **Área sombreada**: Resalta el crecimiento acumulado
- **Línea de referencia**: Meta de recaudo proyectada (si disponible)
- **Eje X**: Meses del bienio
- **Eje Y**: Valores acumulados en millones de pesos

**Interpretación**:
- Pendiente pronunciada indica meses de alto recaudo
- Pendiente suave indica meses de bajo recaudo
- Comparación con línea de referencia muestra si se está cumpliendo la meta

![Gráfico de Recaudo Acumulado](../assets/screenshots/sgr-recaudo-acumulado.png)
*Evolución del recaudo acumulado durante el bienio*

## 4.1.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF (para inclusión en informes)

**Contenido**: Gráfico seleccionado con título, leyenda y metadatos (fecha de generación, bienio, fuente)

### B. Descarga de Datos en Excel
**Botón**: "Exportar a Excel"
**Contenido del archivo**:

**Hoja 1: Recaudo Mensual**
- Todas las columnas de la tabla detallada
- Formato de valores monetarios
- Fórmulas para totales y promedios

**Hoja 2: Resumen Ejecutivo**
- Indicadores clave del bienio
- Recaudo total, promedio, máximo, mínimo
- Participación por tipo de recurso

**Hoja 3: Serie Temporal**
- Datos preparados para gráficos
- Mes, Hidrocarburos, Minería, Total, Acumulado

**Hoja 4: Metadatos**
- Fecha de generación del reporte
- Bienio consultado
- Filtros aplicados
- Fuente de datos

**Formato del archivo**:
- Nombre: "SGR_Recaudo_Mensual_[Bienio]_[Fecha].xlsx"
- Encabezados en negrilla
- Filtros automáticos habilitados
- Formato de miles y moneda colombiana

### C. Descarga de Informe Completo (PDF)
**Botón**: "Generar Informe PDF"
**Contenido**:
1. Portada con título, bienio y fecha
2. Resumen ejecutivo (KPIs)
3. Gráfico de serie temporal
4. Gráfico comparativo hidrocarburos vs minería
5. Tabla de recaudo mensual
6. Gráfico de acumulado
7. Conclusiones automáticas (análisis de tendencias)
8. Fuente de datos y fecha de generación

**Formato**: Documento de 8-12 páginas, formato carta, con marca de agua de SICODIS

## 4.1.6. Interpretación Técnica

### A. Comportamiento del Recaudo Mensual

**Factores que influyen en el recaudo**:

1. **Producción de recursos naturales**:
   - Mayor producción → Mayor recaudo
   - Paradas técnicas o mantenimiento → Menor recaudo
   - Nuevos pozos o minas en operación → Incremento gradual

2. **Precios internacionales**:
   - Petróleo: Precio Brent o WTI
   - Gas: Precio Henry Hub
   - Carbón: Precio internacional de referencia
   - Oro: Precio internacional del oro

3. **Tasa de cambio**:
   - Depreciación del peso → Mayor recaudo en pesos colombianos
   - Apreciación del peso → Menor recaudo en pesos colombianos

4. **Calendario de liquidación y pago**:
   - Regalías se liquidan con rezago de 1-2 meses
   - Pagos extraordinarios pueden concentrarse en ciertos meses

### B. Estacionalidad

**Patrones típicos observados**:

- **Primer trimestre**: Suele tener recaudo alto por cierre fiscal del año anterior
- **Segundo trimestre**: Recaudo estable, típicamente cercano al promedio
- **Tercer trimestre**: Puede presentar variaciones por mantenimientos programados
- **Cuarto trimestre**: Recaudo variable, puede incluir ajustes y regularizaciones

**Nota**: La estacionalidad puede variar significativamente entre bienios según condiciones del mercado.

### C. Análisis de Variaciones

**Variaciones esperadas vs inesperadas**:

**Variaciones Esperadas**:
- Fluctuaciones del 5-10% entre meses consecutivos son normales
- Diferencias entre año 1 y año 2 del bienio relacionadas con tendencias del mercado
- Picos en meses con mayor producción estacional

**Variaciones Inesperadas (requieren análisis)**:
- Caídas superiores al 20% en un mes sin explicación aparente
- Incrementos súbitos no relacionados con cambios en precios o producción
- Comportamiento atípico de un tipo de recurso respecto al histórico

**Acciones ante variaciones inesperadas**:
1. Verificar datos de producción certificada
2. Revisar precios internacionales del periodo
3. Consultar con el Ministerio de Minas y Energía
4. Evaluar impacto en el Plan Bienal de Caja
5. Considerar ajustes presupuestales si la variación es estructural

### D. Uso de Ingresos Corrientes vs No Corrientes

**Ingresos Corrientes (IAC)**:
- Fuente primaria para la planeación presupuestal
- Base de cálculo para la asignación de CTI (10%)
- Permite proyecciones más confiables
- Asociados a producción sostenida

**Ingresos No Corrientes**:
- Complementan recursos disponibles
- No deben usarse para compromisos de largo plazo
- Útiles para financiar proyectos específicos o cubrir déficits temporales
- Requieren identificación clara de su origen

**Recomendación**: Diferenciar siempre entre tipos de ingreso para evitar sobreestimación de recursos permanentes.

## 4.1.7. Casos de Uso

### Caso de Uso 1: Seguimiento Mensual del Recaudo
**Actor**: Secretaría de Hacienda Departamental

**Objetivo**: Monitorear el cumplimiento del recaudo mensual respecto a las proyecciones.

**Pasos**:
1. Acceder al módulo "Recaudo Mensual SGR"
2. Seleccionar el bienio en curso (ej. 2025-2026)
3. Observar los indicadores clave (recaudo total, promedio mensual)
4. Revisar el gráfico de serie temporal para identificar tendencias
5. Comparar el recaudo acumulado con la meta proyectada
6. Exportar datos a Excel para análisis interno
7. Si hay desviaciones significativas, alertar a la oficina de planeación

**Resultado**: Detección temprana de desviaciones y toma de decisiones informadas.

---

### Caso de Uso 2: Análisis Sectorial (Hidrocarburos vs Minería)
**Actor**: Analista de Recursos Naturales del DNP

**Objetivo**: Evaluar la contribución relativa de hidrocarburos y minería al recaudo.

**Pasos**:
1. Acceder al módulo "Recaudo Mensual SGR"
2. Seleccionar el bienio de interés
3. Observar los indicadores de participación porcentual
4. Revisar el gráfico de áreas apiladas (hidrocarburos vs minería)
5. Aplicar filtro "Solo Hidrocarburos" y analizar tendencias
6. Aplicar filtro "Solo Minería" y analizar tendencias
7. Expandir la tabla detallada para ver desagregación por tipo de ingreso
8. Generar informe PDF con conclusiones

**Resultado**: Comprensión de la composición del recaudo y dependencia sectorial.

---

### Caso de Uso 3: Identificación de Meses Atípicos
**Actor**: Auditor de Contraloría

**Objetivo**: Identificar meses con recaudo anormalmente alto o bajo para investigación.

**Pasos**:
1. Acceder al módulo "Recaudo Mensual SGR"
2. Seleccionar varios bienios para comparación histórica
3. Revisar el gráfico de serie temporal en cada bienio
4. Identificar picos y valles significativos
5. Expandir la tabla para ver detalle del mes atípico
6. Verificar si el recaudo es aforado o no aforado
7. Descargar datos para análisis comparativo externo
8. Solicitar explicaciones al Ministerio de Minas si es necesario

**Resultado**: Verificación de la consistencia del recaudo y detección de posibles irregularidades.

---

### Caso de Uso 4: Proyección de Recaudo Futuro
**Actor**: Oficina de Planeación Municipal

**Objetivo**: Estimar el recaudo esperado en los meses restantes del bienio.

**Pasos**:
1. Acceder al módulo "Recaudo Mensual SGR"
2. Seleccionar el bienio en curso
3. Revisar el comportamiento del recaudo en los meses transcurridos
4. Calcular el promedio mensual hasta la fecha
5. Observar tendencias (creciente, decreciente, estable)
6. Considerar factores externos (precios, producción proyectada)
7. Exportar datos a Excel para realizar proyecciones
8. Ajustar expectativas presupuestales según proyección

**Resultado**: Estimación más precisa de recursos disponibles para el resto del bienio.

---

### Caso de Uso 5: Informe para Consejo Territorial de Planeación
**Actor**: Secretaría Técnica de OCAD Departamental

**Objetivo**: Preparar informe de recaudo para presentación a consejeros.

**Pasos**:
1. Acceder al módulo "Recaudo Mensual SGR"
2. Seleccionar el bienio a reportar
3. Generar informe PDF completo
4. Descargar gráficos en alta resolución (PNG 300 DPI)
5. Exportar datos a Excel para preparar diapositivas
6. Incluir análisis de tendencias y variaciones
7. Resaltar meses de mayor y menor recaudo
8. Presentar conclusiones y recomendaciones

**Resultado**: Informe ejecutivo claro y fundamentado para la toma de decisiones.

---

## 4.1.8. Preguntas Frecuentes

**P1: ¿Por qué el recaudo de un mes puede ser cero o muy bajo?**

R: Puede deberse a:
- Rezago en la liquidación de regalías (se liquidan 1-2 meses después de la producción)
- Paradas técnicas o mantenimiento programado de pozos o minas
- Problemas operacionales o de transporte
- Ajustes contables o reclasificaciones
- Mes de cierre con regularizaciones pendientes

**P2: ¿Qué significa "recaudo aforado" y "no aforado"?**

R:
- **Aforado**: Recaudo que fue proyectado en el Plan Bienal de Caja, basado en estimaciones de producción y precios.
- **No Aforado**: Recaudo adicional no proyectado, generalmente por mayor producción o precios superiores a los estimados.

**P3: ¿Cómo se calcula la variación intermensual?**

R: Variación % = [(Recaudo Mes Actual - Recaudo Mes Anterior) / Recaudo Mes Anterior] × 100

Ejemplo: Si marzo tuvo $500,000 M y abril $550,000 M, la variación de abril es: [(550,000 - 500,000) / 500,000] × 100 = 10%

**P4: ¿Los datos de recaudo son definitivos o pueden cambiar?**

R: Los datos pueden tener ajustes menores en los meses siguientes debido a:
- Regularizaciones contables
- Corrección de errores de liquidación
- Reclasificaciones entre tipos de ingreso
- Resolución de diferencias en certificación de producción

Por esto, el último mes disponible puede tener carácter provisional.

**P5: ¿Cómo interpretar un recaudo acumulado inferior a la meta?**

R: Puede indicar:
- Menor producción respecto a lo proyectado
- Precios internacionales más bajos de lo estimado
- Apreciación del peso colombiano
- Rezagos temporales en liquidación (se pueden recuperar en meses siguientes)

Acción recomendada: Analizar la causa específica y evaluar si es temporal o estructural para decidir sobre ajustes al Plan Bienal de Caja.

---

## 4.1.9. Relación con Otros Módulos

- **Presupuesto y Recaudo**: Compara el recaudo mensual con el Plan Bienal de Caja proyectado
- **Plan Bienal de Caja**: Proporciona el contexto de planeación para el recaudo mensual
- **Recaudo Asignaciones Directas**: Detalla la distribución específica del 20% y 5% del recaudo
- **Comparativo SGR**: Permite comparar el recaudo mensual entre diferentes territorios

---

**Anterior**: [4. Introducción al SGR](04-00-sgr-introduccion.md) | **Siguiente**: [4.2. Recaudo Asignaciones Directas](04-02-sgr-recaudo-directas.md)
