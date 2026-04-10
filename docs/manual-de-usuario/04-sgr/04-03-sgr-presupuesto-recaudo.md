# 4.3. Presupuesto y Recaudo

**Ruta de acceso**: `/sgr-presupuesto-y-recaudo`

## 4.3.1. Propósito del Módulo

El módulo **Presupuesto y Recaudo** permite comparar el **Plan Bienal de Caja (PBC)** proyectado al inicio del bienio con el **recaudo efectivo** mes a mes. Esta comparación es fundamental para:

- Evaluar el cumplimiento de las proyecciones de ingresos del SGR
- Identificar desviaciones entre lo planeado y lo ejecutado
- Detectar recaudo aforado (proyectado) vs no aforado (adicional)
- Ajustar expectativas presupuestales durante el bienio
- Tomar decisiones sobre modificaciones al Plan Bienal de Caja
- Analizar la precisión de las estimaciones de producción y precios
- Informar a los OCAD sobre la disponibilidad real de recursos

Este módulo es esencial para la **gestión financiera del SGR**, permitiendo un seguimiento riguroso de los recursos disponibles para aprobar y ejecutar proyectos.

## 4.3.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Plan Bienal de Caja (PBC) - Presupuesto Proyectado
- **PBC Total del bienio**: Monto total proyectado para los 24 meses
- **PBC mensual**: Presupuesto proyectado para cada mes
- **PBC por asignación**: Distribución del presupuesto entre asignaciones (Directas, Regional, Local, CTI, etc.)
- **PBC por tipo de recurso**: Proyección de ingresos por hidrocarburos vs minería
- **PBC acumulado**: Suma acumulada del presupuesto proyectado

### B. Recaudo Efectivo - Ejecución Real
- **Recaudo total del bienio**: Monto efectivamente recaudado en los meses transcurridos
- **Recaudo mensual**: Ingresos reales de cada mes
- **Recaudo por asignación**: Distribución real entre asignaciones
- **Recaudo por tipo de recurso**: Ingresos reales por hidrocarburos vs minería
- **Recaudo acumulado**: Suma acumulada del recaudo efectivo

### C. Análisis de Desviaciones
- **Desviación mensual**: Diferencia entre PBC y recaudo en cada mes (pesos y porcentaje)
- **Desviación acumulada**: Diferencia acumulada desde el inicio del bienio
- **Cumplimiento del PBC**: Porcentaje de ejecución respecto a lo proyectado
- **Identificación de meses con sobrerecaudo**: Recaudo > PBC
- **Identificación de meses con déficit**: Recaudo < PBC

### D. Recaudo Aforado vs No Aforado
- **Recaudo aforado**: Monto proyectado en el PBC que efectivamente se recaudó
- **Recaudo no aforado**: Monto recaudado adicional no proyectado en el PBC
- **Proporción aforado/no aforado**: Distribución porcentual

### E. Desagregación por Asignaciones
- **Asignaciones Directas (20% + 5%)**: Comparación PBC vs Recaudo
- **Asignación para el Desarrollo Regional (17%)**: Comparación PBC vs Recaudo
- **Inversión Local y Regional (55%)**: Comparación PBC vs Recaudo
- **CTI (10%)**: Comparación PBC vs Recaudo
- **Otras asignaciones**: Paz, FONPET, Administración, Fiscalización

## 4.3.3. Controles y Filtros

### A. Selector de Vigencia Bienal
Permite seleccionar el bienio a consultar:
- 2023-2024
- 2024-2025
- 2025-2026

**Comportamiento**: Al cambiar el bienio, se carga el PBC correspondiente y el recaudo efectivo disponible hasta la fecha.

### B. Selector de Periodo de Análisis
Permite definir el rango temporal a visualizar:
- **Todo el bienio**: 24 meses completos (muestra PBC completo y recaudo disponible)
- **Año 1**: Primeros 12 meses del bienio
- **Año 2**: Últimos 12 meses del bienio
- **Meses transcurridos**: Solo los meses con recaudo efectivo (útil para bienios en curso)
- **Personalizado**: Selección de mes inicial y mes final

**Uso recomendado**: Seleccionar "Meses transcurridos" para bienios en ejecución, "Todo el bienio" para bienios completados.

### C. Filtro de Asignación
Permite filtrar por tipo de asignación del SGR:
- **Todas las asignaciones**: Visualiza PBC y recaudo total del SGR
- **Asignaciones Directas**: Solo AD 20% + AD 5%
- **Desarrollo Regional**: Solo la asignación del 17%
- **Inversión Local y Regional**: Solo el 55%
- **CTI**: Solo el 10%
- **Paz y Medio Ambiente**: Solo el 3%
- **Otras**: FONPET, Administración, Fiscalización

**Comportamiento**: Al seleccionar una asignación específica, todos los gráficos y tablas se filtran para mostrar solo esa asignación.

### D. Filtro de Tipo de Recurso
- **Todos**: PBC y recaudo de hidrocarburos + minería
- **Hidrocarburos**: Solo petróleo y gas
- **Minería**: Solo explotación minera

### E. Filtro de Tipo de Ingreso
- **Corrientes**: Solo ingresos de producción regular
- **No Corrientes**: Solo ingresos extraordinarios
- **Todos**: Ambos tipos

### F. Toggle de Visualización
- **Valores absolutos**: Montos en millones de pesos
- **Valores porcentuales**: Desviaciones como porcentaje del PBC
- **Combinado**: Muestra ambos (valores y porcentajes)

## 4.3.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **PBC Total del Bienio**
   - Valor: Monto total proyectado en el Plan Bienal de Caja
   - Formato: "$X.XXX.XXX millones"
   - Desglose: Por año 1 y año 2 del bienio

2. **Recaudo Total Ejecutado**
   - Valor: Monto efectivamente recaudado (meses disponibles)
   - Formato: "$X.XXX.XXX millones"
   - Desglose: Por tipo de recurso

3. **Cumplimiento del PBC**
   - Valor: Porcentaje de ejecución (Recaudo / PBC Proyectado × 100)
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge con rangos:
     - Verde: ≥95% (cumplimiento alto)
     - Amarillo: 85-94% (cumplimiento medio)
     - Naranja: 75-84% (cumplimiento bajo)
     - Rojo: <75% (incumplimiento significativo)
     - Azul: >105% (sobrerecaudo)

4. **Desviación Acumulada**
   - Valor: Diferencia total entre Recaudo y PBC (pesos y %)
   - Formato: "+$XXX.XXX millones (+XX.X%)" o "-$XXX.XXX millones (-XX.X%)"
   - Indicador: Positivo en verde (sobrerecaudo), negativo en rojo (déficit)

5. **Recaudo Aforado vs No Aforado**
   - Valores: "Aforado: XX.X% | No Aforado: XX.X%"
   - Visualización: Gráfico de gauge dual

6. **Meses con Mayor Desviación**
   - Valor: Mes con mayor déficit y mes con mayor sobrerecaudo
   - Formato: "Déficit: Marzo -$XXX M | Sobrerecaudo: Julio +$XXX M"

![Indicadores Clave de Presupuesto y Recaudo](../assets/screenshots/sgr-presupuesto-recaudo-kpis.png)
*Indicadores clave de comparación entre PBC y recaudo efectivo*

### B. Gráfico Comparativo - PBC vs Recaudo Mensual

**Tipo**: Gráfico de barras agrupadas con línea de cumplimiento

**Descripción**: Compara mes a mes el presupuesto proyectado (PBC) con el recaudo efectivo.

**Elementos visuales**:
- **Barras azules**: Plan Bienal de Caja (PBC) proyectado para cada mes
- **Barras verdes**: Recaudo efectivo de cada mes
- **Línea roja**: Línea de cumplimiento del 100% (referencia)
- **Área sombreada**: Zona de desviación aceptable (±5%)
- **Eje X**: Meses del bienio (Ene 2023, Feb 2023, ..., Dic 2024)
- **Eje Y**: Valores en millones de pesos (COP)
- **Etiquetas**: Valores exactos sobre cada barra

**Interactividad**:
- Hover sobre barra de PBC muestra: "PBC Marzo 2023: $450,000 M"
- Hover sobre barra de Recaudo muestra: "Recaudo Marzo 2023: $478,500 M (+6.3% vs PBC)"
- Clic en mes muestra detalle por asignación en panel lateral
- Zoom mediante selección de área

**Interpretación**:
- Barras verdes más altas que azules → Sobrerecaudo respecto al PBC
- Barras verdes más bajas que azules → Déficit respecto al PBC
- Proximidad entre barras → Alta precisión de las proyecciones del PBC

![Gráfico Comparativo PBC vs Recaudo Mensual](../assets/screenshots/sgr-presupuesto-recaudo-mensual.png)
*Comparación mensual entre Plan Bienal de Caja y recaudo efectivo*

### C. Gráfico de Desviaciones Mensuales

**Tipo**: Gráfico de barras horizontales (waterfall modificado)

**Descripción**: Visualiza las desviaciones (positivas o negativas) de cada mes respecto al PBC.

**Elementos visuales**:
- **Barras verdes**: Meses con sobrerecaudo (Recaudo > PBC)
- **Barras rojas**: Meses con déficit (Recaudo < PBC)
- **Línea central**: Línea de cero (cumplimiento exacto del PBC)
- **Eje X**: Desviación en millones de pesos (+/-)
- **Eje Y**: Meses del bienio
- **Etiquetas**: Desviación en pesos y porcentaje

**Interactividad**:
- Hover muestra: "Marzo 2023: +$28,500 M (+6.3% vs PBC)"
- Ordenamiento por magnitud de desviación (ascendente/descendente)
- Filtro para mostrar solo meses con desviación >±5%

**Interpretación**:
- Barras largas (verdes o rojas) indican desviaciones significativas
- Concentración de barras rojas → Tendencia de déficit estructural
- Concentración de barras verdes → Tendencia de sobrerecaudo
- Alternancia balanceada → Desviaciones aleatorias dentro de lo esperado

![Gráfico de Desviaciones Mensuales](../assets/screenshots/sgr-desviaciones-mensuales.png)
*Desviaciones mensuales entre PBC y recaudo efectivo*

### D. Gráfico de Acumulados - PBC vs Recaudo

**Tipo**: Gráfico de líneas dobles con área entre líneas

**Descripción**: Muestra la evolución del PBC acumulado y el recaudo acumulado desde el inicio del bienio.

**Elementos visuales**:
- **Línea azul continua**: PBC acumulado proyectado
- **Línea verde continua**: Recaudo acumulado efectivo
- **Área sombreada verde**: Área de sobrerecaudo (cuando recaudo > PBC)
- **Área sombreada roja**: Área de déficit (cuando recaudo < PBC)
- **Eje X**: Meses del bienio
- **Eje Y**: Valores acumulados en millones de pesos
- **Línea de referencia**: Meta del 100% de cumplimiento

**Interactividad**:
- Hover muestra valores acumulados y desviación acumulada
- Clic en punto específico muestra detalle del mes
- Selector de rango temporal para zoom

**Interpretación**:
- Línea verde por encima de línea azul → Sobrerecaudo acumulado
- Línea verde por debajo de línea azul → Déficit acumulado
- Pendientes similares → Ejecución consistente con proyección
- Divergencia de pendientes → Cambio en tendencia de recaudo

![Gráfico de Acumulados PBC vs Recaudo](../assets/screenshots/sgr-acumulados-pbc-recaudo.png)
*Evolución de PBC y recaudo acumulados durante el bienio*

### E. Tabla Detallada - Comparación Mensual

**Tipo**: TreeTable de PrimeNG con estructura jerárquica

**Descripción**: Presenta el detalle numérico de la comparación entre PBC y recaudo mes a mes con desagregaciones.

**Columnas**:
1. **Mes**: Nombre del mes y año (expandible)
2. **PBC Proyectado**: Presupuesto del Plan Bienal de Caja
3. **Recaudo Efectivo**: Ingresos reales del mes
4. **Desviación (Pesos)**: Diferencia en millones de pesos
5. **Desviación (%)**: Porcentaje de desviación respecto al PBC
6. **Cumplimiento**: % de ejecución (Recaudo / PBC × 100)
7. **PBC Acumulado**: Suma acumulada del PBC hasta el mes
8. **Recaudo Acumulado**: Suma acumulada del recaudo hasta el mes
9. **Desviación Acumulada**: Diferencia acumulada (pesos y %)
10. **Estado**: Indicador visual (✓ cumplimiento, ⚠ desviación leve, ✗ desviación alta)

**Estructura jerárquica (al expandir mes)**:
- **Nivel 1**: Mes (ej. "Marzo 2023")
  - **Nivel 2**: Asignación (Directas, Regional, Local, CTI, etc.)
    - **Nivel 3**: Tipo de recurso (Hidrocarburos / Minería)
      - **Nivel 4**: Tipo de ingreso (Corriente / No Corriente)
        - **Nivel 5**: Aforado / No Aforado

**Funcionalidades**:
- **Ordenamiento**: Clic en encabezados para ordenar
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Búsqueda**: Filtro rápido por mes
- **Resaltado condicional**:
  - Cumplimiento ≥95%: Fondo verde claro
  - Cumplimiento 85-94%: Fondo amarillo claro
  - Cumplimiento <85%: Fondo naranja claro
  - Sobrerecaudo >105%: Fondo azul claro
- **Exportación**: Botón para descargar tabla en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones con separador de miles
- Porcentajes: "+XX.X%" o "-XX.X%" con signo y color
- Estado: Íconos con tooltip explicativo

**Fila de totales**:
- Total PBC del Bienio
- Total Recaudo Ejecutado (hasta la fecha)
- Desviación Total (pesos y %)
- Cumplimiento Global del Bienio

![Tabla Detallada de Comparación Mensual](../assets/screenshots/sgr-presupuesto-recaudo-tabla.png)
*Tabla detallada de comparación mensual entre PBC y recaudo efectivo*

### F. Gráfico de Composición por Asignaciones

**Tipo**: Gráfico de barras apiladas al 100%

**Descripción**: Compara la composición del PBC vs la composición del recaudo efectivo por tipo de asignación.

**Elementos visuales**:
- **Eje X**: PBC Proyectado | Recaudo Efectivo
- **Eje Y**: Porcentaje (0-100%)
- **Segmentos apilados**: Cada asignación con color diferenciado
  - Asignaciones Directas (azul)
  - Desarrollo Regional (verde)
  - Inversión Local (naranja)
  - CTI (morado)
  - Paz (amarillo)
  - Otras (gris)
- **Leyenda**: Con valores absolutos y porcentuales

**Interactividad**:
- Hover sobre segmento muestra: "Asignaciones Directas: $1,234,567 M (25.3% del total)"
- Clic en leyenda oculta/muestra la asignación en el gráfico

**Interpretación**:
- Permite ver si la distribución real (recaudo) coincide con la planificada (PBC)
- Identifica asignaciones con mayor o menor ejecución respecto a lo proyectado
- Útil para evaluar si ciertas asignaciones están recibiendo más o menos recursos de lo esperado

![Gráfico de Composición por Asignaciones](../assets/screenshots/sgr-composicion-asignaciones.png)
*Comparación de composición entre PBC y recaudo por tipo de asignación*

### G. Mapa de Calor - Cumplimiento Mensual

**Tipo**: Heatmap de cumplimiento del PBC

**Descripción**: Matriz que visualiza el porcentaje de cumplimiento del PBC en cada mes, con codificación de color.

**Elementos visuales**:
- **Eje X**: Meses del bienio
- **Eje Y**: Asignaciones del SGR
- **Celdas coloreadas**: Escala de color según cumplimiento
  - Rojo intenso: <75%
  - Naranja: 75-85%
  - Amarillo: 85-95%
  - Verde claro: 95-105%
  - Azul: >105%
- **Valores en celdas**: Porcentaje de cumplimiento

**Interactividad**:
- Hover muestra detalle: "Asignaciones Directas - Marzo 2023: 103.2% (PBC: $450,000 M | Recaudo: $464,400 M)"
- Clic en celda navega al detalle de ese mes y asignación

**Interpretación**:
- Filas con predominancia de verde → Asignación con buen cumplimiento general
- Filas con predominancia de rojo/naranja → Asignación con déficit recurrente
- Columnas con predominancia de verde → Meses con buen cumplimiento general
- Patrones de color permiten identificar tendencias estacionales

![Mapa de Calor de Cumplimiento Mensual](../assets/screenshots/sgr-heatmap-cumplimiento.png)
*Mapa de calor de cumplimiento del PBC por mes y asignación*

## 4.3.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, bienio, periodo y fuente.

### B. Descarga de Datos en Excel
**Botón**: "Exportar a Excel"
**Contenido del archivo**:

**Hoja 1: Comparación Mensual**
- Todas las columnas de la tabla detallada (PBC, Recaudo, Desviaciones, Cumplimiento, Acumulados)
- Formato de valores monetarios y porcentuales
- Formato condicional según nivel de cumplimiento

**Hoja 2: Desagregación por Asignaciones**
- Detalle de PBC y Recaudo para cada asignación, mes a mes
- Subtotales por asignación
- Total general del bienio

**Hoja 3: Análisis de Desviaciones**
- Listado de meses ordenados por magnitud de desviación
- Meses con sobrerecaudo (top 5)
- Meses con déficit (top 5)
- Estadísticas: Desviación promedio, desviación estándar, rango

**Hoja 4: Recaudo Aforado vs No Aforado**
- Detalle mensual de recaudo aforado y no aforado
- Comparación con PBC proyectado
- Análisis de precisión del PBC

**Hoja 5: Resumen Ejecutivo**
- Indicadores clave del bienio
- PBC total, Recaudo total, Cumplimiento global
- Desviación acumulada
- Gráficos automáticos (barras, líneas)

**Hoja 6: Metadatos**
- Fecha de generación del reporte
- Bienio consultado
- Periodo analizado
- Filtros aplicados
- Fuente de datos

**Formato del archivo**:
- Nombre: "SGR_Presupuesto_Recaudo_[Bienio]_[Periodo]_[Fecha].xlsx"
- Encabezados en negrilla, fondo azul
- Filtros automáticos habilitados
- Tablas dinámicas preparadas para análisis
- Gráficos incrustados en hojas relevantes

### C. Descarga de Informe Completo (PDF)
**Botón**: "Generar Informe PDF"
**Contenido**:
1. Portada con título, bienio, periodo y fecha de generación
2. Resumen ejecutivo con indicadores clave
3. Gráfico comparativo PBC vs Recaudo mensual
4. Gráfico de desviaciones mensuales
5. Gráfico de acumulados PBC vs Recaudo
6. Tabla de comparación mensual (resumida)
7. Gráfico de composición por asignaciones
8. Mapa de calor de cumplimiento mensual
9. Análisis de causas de desviaciones (texto automático)
10. Conclusiones y recomendaciones
11. Anexos: Tabla detallada completa
12. Fuente de datos y fecha de corte

**Formato**: Documento de 15-20 páginas, formato carta, con marca de agua de SICODIS.

## 4.3.6. Interpretación Técnica

### A. Elaboración del Plan Bienal de Caja (PBC)

**Responsable**: Dirección General del Sistema General de Regalías (DNP) en coordinación con el Ministerio de Hacienda.

**Proceso de elaboración**:
1. **Proyección de producción**: Estimación de volúmenes de hidrocarburos y minería para los próximos 24 meses (basado en información del Ministerio de Minas y empresas explotadoras)
2. **Proyección de precios**: Estimación de precios internacionales (Brent, gas, carbón, oro, etc.)
3. **Proyección de tasa de cambio**: Estimación del tipo de cambio peso/dólar
4. **Cálculo de regalías**: Aplicación de tarifas vigentes según tipo de recurso
5. **Distribución por asignaciones**: Aplicación de porcentajes según normativa (20%, 5%, 17%, 55%, 10%, etc.)
6. **Programación mensual**: Distribución de recursos mes a mes según expectativas de liquidación
7. **Aprobación**: Validación por la Comisión Rectora del SGR

**Momento de elaboración**: Antes del inicio del bienio (generalmente en el último trimestre del año anterior).

**Actualización**: El PBC puede ajustarse durante el bienio ante cambios significativos en producción, precios o normativa.

### B. Causas de Desviaciones entre PBC y Recaudo

**Desviaciones Positivas (Sobrerecaudo)**:
1. **Precios internacionales superiores a lo proyectado**:
   - Aumento inesperado del precio del petróleo (Brent, WTI)
   - Aumento del precio del gas, carbón, oro
2. **Mayor producción de lo estimado**:
   - Nuevos pozos o minas en operación no considerados
   - Mayor productividad de pozos existentes
   - Reactivación de operaciones suspendidas
3. **Depreciación del peso colombiano**:
   - Regalías en USD convertidas a COP resultan en mayor valor
4. **Regularizaciones de periodos anteriores**:
   - Ajustes contables de bienios previos
   - Pago de regalías atrasadas

**Desviaciones Negativas (Déficit)**:
1. **Precios internacionales inferiores a lo proyectado**:
   - Caída del precio del petróleo, gas, carbón, oro
2. **Menor producción de lo estimado**:
   - Paradas técnicas no programadas
   - Problemas operacionales en campos o minas
   - Cierre de operaciones
   - Menor productividad de pozos por agotamiento
3. **Apreciación del peso colombiano**:
   - Regalías en USD convertidas a COP resultan en menor valor
4. **Rezagos en liquidación y pago**:
   - Retrasos en certificación de producción
   - Diferencias en tiempos de liquidación
   - Procesos administrativos demorados

### C. Interpretación de Niveles de Cumplimiento

**Rango de Cumplimiento Aceptable**: 95-105%
- Indica que las proyecciones del PBC fueron razonablemente precisas
- Desviaciones dentro de la incertidumbre esperada
- No requiere ajustes significativos al PBC

**Cumplimiento Alto (≥105%)**:
- Sobrerecaudo significativo
- Oportunidad para:
  - Aprobar proyectos adicionales en OCAD
  - Ajustar al alza el PBC para el resto del bienio
  - Incrementar asignaciones a territorios
- Requiere análisis: ¿Es una tendencia sostenible o un pico temporal?

**Cumplimiento Medio (85-94%)**:
- Déficit moderado respecto al PBC
- Requiere monitoreo continuo
- Evaluar si es temporal (rezago en liquidación) o estructural (menor producción)
- Prudencia en aprobación de nuevos proyectos

**Cumplimiento Bajo (<85%)**:
- Déficit significativo
- Acciones necesarias:
  - Ajustar a la baja el PBC para el resto del bienio
  - Revisar proyectos aprobados y priorizar los más críticos
  - Comunicar a OCAD sobre menor disponibilidad de recursos
  - Investigar causas estructurales del déficit

### D. Impacto de Desviaciones en la Gestión del SGR

**Impacto en OCAD**:
- **Sobrerecaudo**: Mayor capacidad de aprobar proyectos
- **Déficit**: Restricción en aprobación de nuevos proyectos, posible necesidad de priorización

**Impacto en Entidades Territoriales**:
- **Sobrerecaudo**: Oportunidad de financiar proyectos adicionales
- **Déficit**: Ajuste de expectativas de inversión, posible retraso en proyectos

**Impacto Fiscal Nacional**:
- Desviaciones significativas afectan las proyecciones del Marco Fiscal de Mediano Plazo
- Recaudo del SGR puede influir en equilibrio fiscal general

### E. Ajustes al Plan Bienal de Caja

**Cuándo ajustar el PBC**:
- Desviaciones acumuladas >±10% persistentes durante 3 meses o más
- Cambios estructurales en producción (nuevos campos, cierres definitivos)
- Cambios regulatorios en tarifas de regalías
- Revisiones significativas de proyecciones de precios internacionales

**Proceso de ajuste**:
1. Análisis técnico de causas de desviación
2. Elaboración de nueva proyección fundamentada
3. Aprobación por Comisión Rectora del SGR
4. Comunicación a OCAD y entidades territoriales
5. Actualización en sistemas (SIPRO, SSEC)

**Frecuencia de ajustes**:
- Generalmente semestral o anual dentro del bienio
- Ajustes extraordinarios en caso de cambios drásticos

## 4.3.7. Casos de Uso

### Caso de Uso 1: Seguimiento Mensual del Cumplimiento del PBC
**Actor**: Dirección de Regalías del DNP

**Objetivo**: Monitorear mensualmente si el recaudo está cumpliendo las proyecciones del PBC.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar el bienio en curso (ej. 2025-2026)
3. Seleccionar "Meses transcurridos" en periodo de análisis
4. Revisar el indicador de "Cumplimiento del PBC"
5. Analizar el gráfico comparativo PBC vs Recaudo mensual
6. Identificar meses con desviaciones >±5%
7. Expandir la tabla para ver detalle por asignación en meses con desviación
8. Revisar el gráfico de acumulados para ver tendencia general
9. Exportar datos a Excel para presentación a Comisión Rectora
10. Si el cumplimiento acumulado es <90%, preparar análisis de causas y propuesta de ajuste al PBC

**Resultado**: Detección temprana de desviaciones y toma de decisiones sobre ajustes al PBC.

---

### Caso de Uso 2: Evaluación de Disponibilidad de Recursos para OCAD
**Actor**: Secretaría Técnica de OCAD Departamental

**Objetivo**: Determinar si hay recursos suficientes para aprobar nuevos proyectos según el recaudo real.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar el bienio correspondiente al OCAD
3. Filtrar por "Inversión Local y Regional" en tipo de asignación
4. Revisar el indicador de cumplimiento de esa asignación
5. Comparar PBC acumulado vs Recaudo acumulado
6. Verificar si hay sobrerecaudo o déficit acumulado
7. Expandir la tabla para ver detalle mensual
8. Proyectar recaudo esperado en meses restantes del bienio
9. Calcular margen disponible para nuevos proyectos
10. Comunicar al OCAD la disponibilidad real de recursos

**Resultado**: Decisión informada sobre capacidad de aprobación de proyectos.

---

### Caso de Uso 3: Análisis de Precisión del PBC (Bienio Completado)
**Actor**: Analista de Presupuesto del Ministerio de Hacienda

**Objetivo**: Evaluar qué tan precisas fueron las proyecciones del PBC al finalizar el bienio.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar un bienio completado (ej. 2023-2024)
3. Seleccionar "Todo el bienio" en periodo de análisis
4. Revisar el indicador de "Cumplimiento del PBC" final
5. Analizar el gráfico de desviaciones mensuales
6. Identificar meses con mayor desviación (positiva y negativa)
7. Expandir la tabla para ver detalle por asignación y tipo de recurso
8. Revisar el mapa de calor de cumplimiento mensual
9. Exportar datos a Excel para análisis estadístico
10. Calcular métricas:
    - Desviación promedio mensual
    - Desviación estándar
    - Error absoluto medio (MAE)
    - Error porcentual absoluto medio (MAPE)
11. Identificar factores que causaron las mayores desviaciones
12. Generar informe PDF con recomendaciones para mejorar proyecciones futuras

**Resultado**: Evaluación de la precisión del PBC y lecciones aprendidas para futuros bienios.

---

### Caso de Uso 4: Identificación de Recaudo No Aforado
**Actor**: Oficina de Planeación de Departamento Productor

**Objetivo**: Identificar recaudo adicional (no aforado) que puede generar recursos extras para el departamento.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar el bienio en curso
3. Filtrar por "Asignaciones Directas" (si es departamento productor)
4. Revisar el indicador de "Recaudo Aforado vs No Aforado"
5. Identificar meses con sobrerecaudo significativo
6. Expandir la tabla para ver detalle de recaudo aforado vs no aforado
7. Calcular el monto adicional (no aforado) que correspondería al departamento según su participación
8. Exportar datos a Excel para documentación
9. Consultar con la Dirección de Regalías del DNP sobre distribución del recaudo no aforado
10. Planear uso de recursos adicionales (si se confirma distribución)

**Resultado**: Identificación de recursos adicionales disponibles para inversión.

---

### Caso de Uso 5: Alerta Temprana de Déficit Presupuestal
**Actor**: Secretaría de Hacienda de Municipio Productor

**Objetivo**: Detectar tempranamente si el recaudo está por debajo del PBC y ajustar expectativas de inversión.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar el bienio en curso
3. Filtrar por "Asignaciones Directas" (municipio productor)
4. Revisar el indicador de "Cumplimiento del PBC"
5. Si el cumplimiento es <90%, analizar causas:
   - Revisar gráfico de desviaciones mensuales
   - Verificar si el déficit es en hidrocarburos o minería
   - Consultar el módulo "Recaudo Mensual SGR" para ver tendencia de producción
6. Proyectar recaudo esperado en meses restantes
7. Calcular déficit estimado al final del bienio
8. Exportar datos a Excel para análisis interno
9. Ajustar expectativas de aprobación de proyectos en OCAD
10. Priorizar proyectos críticos sobre proyectos de menor urgencia
11. Comunicar al alcalde y consejo municipal sobre menor disponibilidad de recursos

**Resultado**: Ajuste proactivo de planeación de inversión ante déficit proyectado.

---

### Caso de Uso 6: Auditoría de Cumplimiento del PBC
**Actor**: Contraloría General de la República

**Objetivo**: Verificar que el recaudo efectivo corresponda a la producción certificada y que las desviaciones estén justificadas.

**Pasos**:
1. Acceder al módulo "Presupuesto y Recaudo"
2. Seleccionar el bienio a auditar
3. Revisar el cumplimiento general del PBC
4. Identificar meses con desviaciones significativas (>±10%)
5. Expandir la tabla para ver detalle por asignación y tipo de recurso
6. Exportar datos completos a Excel
7. Solicitar al Ministerio de Minas certificados de producción de los meses con desviación
8. Verificar que el recaudo corresponda a la producción certificada × tarifas vigentes
9. Solicitar al DNP justificación de desviaciones estructurales
10. Verificar si se realizaron ajustes al PBC y si estuvieron debidamente aprobados
11. Generar hallazgos si hay inconsistencias entre producción certificada y recaudo
12. Emitir informe de auditoría con recomendaciones

**Resultado**: Verificación de la transparencia y consistencia del recaudo del SGR.

---

## 4.3.8. Preguntas Frecuentes

**P1: ¿Qué es el Plan Bienal de Caja (PBC)?**

R: El PBC es el instrumento de programación financiera del SGR que proyecta los ingresos esperados para los 24 meses del bienio. Se elabora antes del inicio del bienio y sirve como marco de referencia para la aprobación de proyectos en los OCAD. El PBC se basa en estimaciones de producción de recursos naturales, precios internacionales y tasa de cambio.

**P2: ¿Por qué el recaudo puede ser diferente al PBC?**

R: El recaudo puede diferir del PBC por múltiples factores:
- Cambios en los precios internacionales (petróleo, gas, carbón, oro)
- Mayor o menor producción de lo estimado
- Variaciones en la tasa de cambio peso/dólar
- Paradas técnicas o nuevas operaciones no proyectadas
- Rezagos en liquidación y pago de regalías
- Regularizaciones de periodos anteriores

**P3: ¿Qué significa un cumplimiento del 95%?**

R: Significa que el recaudo efectivo alcanzó el 95% de lo proyectado en el PBC. Por ejemplo, si el PBC proyectó $1,000,000 millones y el recaudo fue $950,000 millones, el cumplimiento es 95%. Esto indica un déficit del 5% respecto a las proyecciones.

**P4: ¿Qué es recaudo "aforado" y "no aforado"?**

R:
- **Aforado**: Recaudo que fue proyectado en el PBC original. Es el recaudo "esperado".
- **No Aforado**: Recaudo adicional que no estaba proyectado en el PBC. Puede deberse a mayor producción o precios superiores a los estimados.

El recaudo no aforado es positivo (recursos adicionales), pero requiere análisis para determinar si es temporal o estructural.

**P5: ¿Qué pasa si hay déficit en el recaudo?**

R: Si hay déficit significativo (<90% de cumplimiento):
1. Se limita la aprobación de nuevos proyectos en OCAD
2. Puede requerirse ajuste a la baja del PBC
3. Se priorizan proyectos ya aprobados y en ejecución
4. Se analiza si el déficit es temporal o estructural
5. Se comunica a entidades territoriales para ajustar expectativas

**P6: ¿Se puede ajustar el PBC durante el bienio?**

R: Sí, el PBC puede ajustarse durante el bienio si hay cambios significativos en las condiciones que justifican una revisión:
- Desviaciones acumuladas >±10% persistentes
- Cambios estructurales en producción (nuevos campos, cierres)
- Cambios en tarifas de regalías
- Revisiones de proyecciones de precios

Los ajustes deben ser aprobados por la Comisión Rectora del SGR.

**P7: ¿Cómo afecta el cumplimiento del PBC a los territorios?**

R:
- **Cumplimiento alto o sobrerecaudo**: Los territorios pueden tener más recursos disponibles para proyectos de inversión. Es oportunidad para aprobar proyectos adicionales.
- **Cumplimiento bajo o déficit**: Los territorios tendrán menos recursos de lo esperado. Deben priorizar proyectos críticos y ajustar sus planes de inversión.

Los territorios productores (con Asignaciones Directas) son más sensibles a las variaciones en el recaudo.

---

## 4.3.9. Relación con Otros Módulos

- **Recaudo Mensual SGR**: Proporciona el detalle del recaudo efectivo que se compara con el PBC
- **Plan Bienal de Caja**: Muestra el detalle completo del PBC proyectado para el bienio
- **Recaudo Asignaciones Directas**: Detalla el recaudo específico de las asignaciones directas comparado con el PBC
- **Plan de Recursos**: Proporciona el marco de proyección de largo plazo (10 años) que alimenta el PBC

---

**Anterior**: [4.2. Recaudo Asignaciones Directas](04-02-sgr-recaudo-directas.md) | **Siguiente**: [4.4. Funcionamiento SSEC](04-04-sgr-funcionamiento-ssec.md)
