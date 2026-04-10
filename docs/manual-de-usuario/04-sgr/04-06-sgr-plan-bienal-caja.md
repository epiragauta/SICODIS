# 4.6. Plan Bienal de Caja

**Ruta de acceso**: `/sgr-plan-bienal-de-caja`

## 4.6.1. Propósito del Módulo

El módulo **Plan Bienal de Caja (PBC)** permite consultar la programación financiera detallada del Sistema General de Regalías para los **24 meses del bienio**. Este es el instrumento operativo fundamental para la gestión de recursos del SGR.

Este módulo es esencial para:

- Conocer la disponibilidad mensual de recursos del SGR durante el bienio
- Planear la aprobación de proyectos en los OCAD según recursos disponibles
- Verificar el techo presupuestal disponible para cada asignación y territorio
- Realizar seguimiento a la ejecución del PBC mes a mes
- Identificar meses con mayor o menor disponibilidad de recursos
- Apoyar la programación de sesiones de OCAD
- Garantizar que los proyectos aprobados tengan respaldo financiero
- Facilitar la transparencia en la distribución de recursos del SGR

El PBC es **vinculante** para la aprobación de proyectos: solo se pueden aprobar proyectos por el monto disponible en el PBC para cada asignación, territorio y periodo.

## 4.6.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Programación Financiera Mensual del Bienio
- **PBC total del bienio**: Recursos totales programados para los 24 meses
- **PBC mensual**: Recursos disponibles en cada mes del bienio
- **PBC acumulado**: Suma acumulada de recursos desde el inicio del bienio
- **Distribución año 1 vs año 2**: Recursos asignados en cada año del bienio

### B. Desagregación por Asignaciones
- **Asignaciones Directas (20% + 5%)**: PBC por departamento y municipio productor
- **Desarrollo Regional (17%)**: PBC por región
- **Inversión Local y Regional (55%)**: PBC por departamento y municipio
- **CTI (10%)**: PBC para ciencia, tecnología e innovación
- **Paz y Medio Ambiente (3%)**: PBC para proyectos de paz
- **Otras asignaciones**: FONPET, Administración/SSEC, Fiscalización

### C. Desagregación Territorial
- **PBC por departamento**: Recursos asignados a cada departamento en cada asignación
- **PBC por municipio**: Recursos asignados a cada municipio (Asignaciones Directas e Inversión Local)
- **Ranking territorial**: Departamentos y municipios con mayor PBC

### D. Desagregación por Tipo de Recurso
- **Hidrocarburos**: PBC proveniente de regalías de petróleo y gas
- **Minería**: PBC proveniente de regalías de explotación minera
- **Otros ingresos**: Rendimientos financieros, saldos, recuperaciones

### E. Programación Mensual Detallada
- **Flujo de caja mensual**: Tabla de doble entrada con meses (columnas) y asignaciones/territorios (filas)
- **Meses de alta disponibilidad**: Identificación de meses con mayor PBC
- **Meses de baja disponibilidad**: Identificación de meses con menor PBC
- **Distribución intra-anual**: Estacionalidad de la disponibilidad de recursos

### F. Estado de Ejecución del PBC (si aplica)
- **PBC programado vs comprometido**: Comparación entre recursos disponibles y proyectos aprobados
- **Saldo disponible**: Recursos aún no comprometidos en proyectos
- **% de compromiso**: Porcentaje del PBC ya comprometido en proyectos aprobados

## 4.6.3. Controles y Filtros

### A. Selector de Vigencia Bienal
Permite seleccionar el bienio a consultar:
- 2023-2024
- 2024-2025
- 2025-2026

**Comportamiento**: Al cambiar el bienio, se carga el PBC correspondiente (24 meses de ese bienio).

### B. Selector de Asignación
Permite filtrar por tipo de asignación del SGR:
- **Todas las asignaciones**: PBC total del SGR
- **Asignaciones Directas (20% + 5%)**: PBC para productores
- **Desarrollo Regional (17%)**
- **Inversión Local y Regional (55%)**
- **CTI (10%)**
- **Paz y Medio Ambiente (3%)**
- **Otras asignaciones**

**Comportamiento**: Al seleccionar una asignación, todas las visualizaciones se filtran para mostrar solo el PBC de esa asignación.

### C. Filtro de Departamento
Permite seleccionar un departamento específico o todos:
- **Todos los departamentos**: PBC agregado nacional
- **Departamento específico**: PBC solo de ese departamento (en asignaciones que aplican territorialmente)

**Funcionalidad en cascada**: Al seleccionar un departamento, se habilita el filtro de municipios.

### D. Filtro de Municipio
Permite seleccionar un municipio específico dentro del departamento filtrado:
- **Todos los municipios**: PBC de todos los municipios del departamento
- **Municipio específico**: PBC solo de ese municipio

**Nota**: Solo aplica para asignaciones con distribución municipal (Asignaciones Directas, Inversión Local).

### E. Filtro de Tipo de Recurso
- **Todos**: PBC de hidrocarburos + minería + otros
- **Hidrocarburos**: Solo PBC proveniente de regalías de petróleo y gas
- **Minería**: Solo PBC proveniente de regalías mineras

### F. Selector de Periodo de Visualización
Permite definir el rango de meses a visualizar:
- **Todo el bienio**: 24 meses completos
- **Año 1**: Primeros 12 meses (ej. 2025)
- **Año 2**: Últimos 12 meses (ej. 2026)
- **Semestre 1**: Meses 1-6
- **Semestre 2**: Meses 7-12
- **Semestre 3**: Meses 13-18
- **Semestre 4**: Meses 19-24
- **Personalizado**: Selección de mes inicial y mes final

### G. Toggle de Valores
- **Valores absolutos**: Montos en millones de pesos
- **Valores acumulados**: Suma acumulada desde el mes 1
- **Participación porcentual**: % de cada asignación o territorio en el total

## 4.6.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **PBC Total del Bienio**
   - Valor: Suma total de recursos programados para 24 meses
   - Formato: "$X.XXX.XXX millones"
   - Comparación: Variación % vs PBC del bienio anterior

2. **PBC Año 1 vs Año 2**
   - Valores: PBC del primer año | PBC del segundo año
   - Formato: "Año 1: $X.XXX.XXX M | Año 2: $X.XXX.XXX M"
   - Visualización: Comparación con barras

3. **Promedio Mensual**
   - Valor: PBC Total / 24 meses
   - Formato: "$XXX.XXX millones/mes"
   - Indicador: Desviación estándar (alta/baja variabilidad mensual)

4. **Mes de Mayor PBC**
   - Valor: Mes con mayor disponibilidad de recursos
   - Formato: "Marzo 2025: $XXX.XXX millones"
   - Contexto: % sobre el promedio mensual

5. **Mes de Menor PBC**
   - Valor: Mes con menor disponibilidad de recursos
   - Formato: "Agosto 2025: $XXX.XXX millones"
   - Contexto: % bajo el promedio mensual

6. **Participación por Tipo de Recurso**
   - Valores: "Hidrocarburos: XX.X% | Minería: XX.X%"
   - Visualización: Gráfico de gauge dual

7. **Principal Asignación** (si no hay filtro)
   - Valor: Asignación con mayor PBC del bienio
   - Formato: "Inversión Local y Regional: $X.XXX.XXX M (55%)"

![Indicadores Clave del PBC](../assets/screenshots/sgr-pbc-kpis.png)
*Indicadores clave del Plan Bienal de Caja*

### B. Gráfico de Barras - PBC Mensual

**Tipo**: Gráfico de barras verticales apiladas

**Descripción**: Muestra la distribución mensual del PBC durante los 24 meses del bienio.

**Elementos visuales**:
- **Eje X**: Meses del bienio (Ene 2025, Feb 2025, ..., Dic 2026)
- **Eje Y**: Valores en millones de pesos
- **Barras apiladas**: Segmentos por asignación (si no hay filtro) o por tipo de recurso (si hay filtro)
  - Asignaciones Directas (azul)
  - Desarrollo Regional (verde)
  - Inversión Local (naranja)
  - CTI (morado)
  - Paz (amarillo)
  - Otras (gris)
- **Línea horizontal**: Promedio mensual (referencia)
- **Etiquetas**: Valores totales sobre cada barra

**Interactividad**:
- Hover muestra detalle: "Marzo 2025: Total $567,890 M (AD: $141,972 M | DR: $96,541 M | IL: $312,340 M | CTI: $11,357 M | Paz: $5,679 M)"
- Clic en barra muestra detalle en panel lateral
- Clic en leyenda oculta/muestra asignación específica

**Interpretación**:
- Barras altas indican meses con mayor disponibilidad de recursos para aprobar proyectos
- Barras bajas indican meses con menor disponibilidad
- Permite identificar estacionalidad del PBC (si hay meses con sistemáticamente más o menos recursos)

![Gráfico de PBC Mensual](../assets/screenshots/sgr-pbc-mensual.png)
*Distribución mensual del Plan Bienal de Caja por asignación*

### C. Gráfico de Línea - PBC Acumulado

**Tipo**: Gráfico de líneas con área bajo la curva

**Descripción**: Muestra la evolución del PBC acumulado desde el inicio del bienio.

**Elementos visuales**:
- **Línea principal**: PBC acumulado mes a mes
- **Área sombreada**: Resalta el crecimiento acumulado
- **Línea punteada**: Proyección lineal (para comparar si el PBC es uniforme o variable)
- **Eje X**: Meses del bienio (1 a 24)
- **Eje Y**: Valores acumulados en millones de pesos
- **Etiquetas**: Valores acumulados en meses clave (mes 6, 12, 18, 24)

**Interactividad**:
- Hover muestra: "Mes 12 (Dic 2025): Acumulado $6,789,012 M (56.5% del total bienal)"
- Clic en punto muestra distribución por asignación hasta ese mes

**Interpretación**:
- Pendiente pronunciada → Meses de alta disponibilidad de recursos
- Pendiente suave → Meses de baja disponibilidad
- Comparación con línea punteada muestra si el PBC es constante (líneas paralelas) o variable (desviaciones)

![Gráfico de PBC Acumulado](../assets/screenshots/sgr-pbc-acumulado.png)
*Evolución del PBC acumulado durante el bienio*

### D. Tabla de Flujo de Caja Mensual (Matriz)

**Tipo**: Tabla de doble entrada (matriz) con filas de asignaciones/territorios y columnas de meses

**Descripción**: Presenta la programación financiera mensual en formato de matriz para visualización integral.

**Estructura de la tabla**:

**Columnas (Meses del bienio)**:
- Ene 2025, Feb 2025, ..., Dic 2026 (24 columnas)
- Columna final: **Total Bienio**

**Filas (Asignaciones o Territorios según filtro)**:

**Si NO hay filtro territorial** (vista por asignaciones):
1. Asignaciones Directas 20%
2. Asignación Adicional 5%
3. Desarrollo Regional 17%
4. Inversión Local y Regional 55%
5. CTI 10%
6. Paz y Medio Ambiente 3%
7. FONPET
8. Administración y SSEC
9. Fiscalización
10. **TOTAL MENSUAL** (fila de totales)

**Si hay filtro de asignación y departamento** (vista territorial):
- Municipios del departamento con PBC en esa asignación
- Fila de **Total Departamento**

**Celdas**:
- Valores en millones de pesos
- Formato: "$XXX.XXX"
- Formato condicional:
  - Valores altos (top 25%): Fondo verde claro
  - Valores medios (25-75%): Fondo blanco
  - Valores bajos (bottom 25%): Fondo naranja claro
  - Ceros: Fondo gris claro

**Funcionalidades**:
- **Scroll horizontal**: Para visualizar los 24 meses
- **Filas fijas**: Encabezados de asignaciones se mantienen visibles al hacer scroll
- **Ordenamiento**: Clic en columna "Total Bienio" ordena filas por monto
- **Exportación**: Botón para descargar matriz completa en Excel
- **Suma de filas y columnas**: Totales automáticos

**Interpretación**:
- Vista integral de la programación financiera mensual
- Permite identificar rápidamente meses y asignaciones con mayor/menor PBC
- Útil para planeación de sesiones de OCAD y aprobación de proyectos

![Tabla de Flujo de Caja Mensual](../assets/screenshots/sgr-pbc-matriz.png)
*Matriz de programación financiera mensual del PBC*

### E. TreeTable Detallada - PBC por Asignación y Territorio

**Tipo**: TreeTable de PrimeNG con estructura jerárquica expandible

**Descripción**: Presenta el PBC con máximo detalle, permitiendo expansión por asignación, departamento, municipio y mes.

**Columnas**:
1. **Asignación/Territorio**: Nombre (expandible)
2. **PBC Año 1**: Recursos del primer año (12 meses)
3. **PBC Año 2**: Recursos del segundo año (12 meses)
4. **PBC Total Bienio**: Suma de año 1 + año 2
5. **Hidrocarburos**: PBC proveniente de hidrocarburos
6. **Minería**: PBC proveniente de minería
7. **% del Total**: Participación en el PBC total del SGR
8. **Promedio Mensual**: PBC Total / 24

**Estructura jerárquica**:

**Nivel 1: Asignación** (ej. "Asignaciones Directas 20%")
- **Nivel 2: Departamento** (ej. "Meta")
  - **Nivel 3: Municipio** (ej. "Acacías") [si aplica]
    - **Nivel 4: Mes** (ej. "Enero 2025") [expandible para ver detalle mensual]
      - **Nivel 5: Tipo de recurso** (Hidrocarburos / Minería)

**Funcionalidades**:
- **Ordenamiento**: Por cualquier columna, manteniendo jerarquía
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Búsqueda**: Filtro rápido por nombre de asignación, departamento o municipio
- **Resaltado condicional**:
  - Top 10 territorios: Fondo verde claro
  - Nuevos territorios con PBC (no tenían en bienio anterior): Ícono de estrella
  - Territorios con PBC reducido >20% vs bienio anterior: Fondo naranja claro
- **Paginación**: 20 filas de nivel 1 por página
- **Exportación**: Descarga completa con toda la jerarquía en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones
- Porcentajes: "XX.X%"
- Promedio mensual: "$XX.XXX" millones/mes

**Filas de totales**:
- Total PBC Nacional (suma de todas las asignaciones)
- Subtotales por asignación

![TreeTable Detallada del PBC](../assets/screenshots/sgr-pbc-treetable.png)
*TreeTable jerárquica del PBC por asignación, departamento y municipio*

### F. Gráfico de Barras - Top 10 Departamentos por PBC

**Tipo**: Gráfico de barras horizontales

**Descripción**: Muestra los 10 departamentos con mayor PBC del bienio (suma de todas las asignaciones que reciben).

**Elementos visuales**:
- **Eje Y**: Nombres de departamentos
- **Eje X**: Valores en millones de pesos
- **Barras**: Color diferenciado por magnitud (gradiente)
- **Etiquetas**: Valores exactos al final de cada barra

**Interactividad**:
- Hover muestra: "Meta: $1,234,567 M (15.2% del total nacional)"
- Clic en departamento filtra el resto de visualizaciones para ese departamento

**Interpretación**:
- Identifica departamentos con mayor disponibilidad de recursos del SGR
- Útil para análisis de distribución territorial de recursos
- Permite comparar capacidad de inversión entre departamentos

![Gráfico Top 10 Departamentos por PBC](../assets/screenshots/sgr-pbc-top-departamentos.png)
*Los 10 departamentos con mayor PBC del bienio*

### G. Gráfico de Torta - Distribución del PBC por Asignaciones

**Tipo**: Gráfico de torta (pie chart)

**Descripción**: Muestra la distribución porcentual del PBC total entre las asignaciones del SGR.

**Elementos visuales**:
- **Segmentos**: Cada asignación con color diferenciado
  - Inversión Local y Regional (naranja, 55%)
  - Asignaciones Directas (azul, ~25%)
  - Desarrollo Regional (verde, 17%)
  - CTI (morado, ~10%)
  - Paz (amarillo, 3%)
  - Otras (gris, ~5%)
- **Etiquetas**: Nombre de asignación y porcentaje
- **Leyenda**: Con valores absolutos y porcentuales

**Interactividad**:
- Hover muestra: "Inversión Local y Regional: $6,617,250 M (55%)"
- Clic en segmento filtra las visualizaciones para esa asignación

**Interpretación**:
- Visualiza la distribución normativa del SGR (55%, 20%, 17%, 10%, etc.)
- Permite verificar que el PBC respete los porcentajes de ley
- Útil para comunicar la estructura del SGR a audiencias no técnicas

![Gráfico de Distribución por Asignaciones](../assets/screenshots/sgr-pbc-torta-asignaciones.png)
*Distribución del PBC por asignaciones del SGR*

### H. Mapa de Calor - PBC Mensual por Asignación

**Tipo**: Heatmap (mapa de calor) de doble entrada

**Descripción**: Matriz que visualiza la magnitud del PBC en cada mes para cada asignación mediante colores.

**Elementos visuales**:
- **Eje X**: Meses del bienio (24 columnas)
- **Eje Y**: Asignaciones del SGR (filas)
- **Celdas coloreadas**: Escala de color según monto del PBC
  - Azul claro: PBC bajo
  - Azul intermedio: PBC medio
  - Azul oscuro: PBC alto
- **Valores en celdas**: Montos en millones de pesos (opcional, se puede ocultar para claridad visual)

**Interactividad**:
- Hover muestra: "Asignaciones Directas - Marzo 2025: $145,890 M"
- Clic en celda navega al detalle de ese mes y asignación

**Interpretación**:
- Visualización rápida de patrones de disponibilidad mensual
- Columnas azul oscuro → Meses con alto PBC general (buena oportunidad para aprobar proyectos)
- Filas con predominancia de azul oscuro → Asignaciones con mayor PBC en general
- Permite identificar estacionalidad o patrones específicos

![Mapa de Calor de PBC Mensual](../assets/screenshots/sgr-pbc-heatmap.png)
*Mapa de calor de PBC mensual por asignación*

## 4.6.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, bienio y fuente.

### B. Descarga de Matriz de PBC en Excel
**Botón**: "Exportar Matriz de PBC"
**Contenido del archivo**:

**Hoja 1: Matriz PBC Mensual**
- Tabla de doble entrada completa (asignaciones × meses)
- 24 columnas de meses + columna de total
- Filas de asignaciones con totales
- Formato condicional (verde para valores altos, naranja para bajos)
- Fórmulas para totales mensuales y por asignación

**Hoja 2: PBC por Departamento**
- Detalle del PBC por departamento en cada asignación
- Solo asignaciones con distribución territorial
- Subtotales por departamento

**Hoja 3: PBC por Municipio**
- Detalle del PBC por municipio (Asignaciones Directas e Inversión Local)
- Columna adicional: Departamento al que pertenece
- Ordenado por monto de PBC (descendente)

**Hoja 4: Resumen Ejecutivo**
- Indicadores clave del PBC
- PBC total, promedio mensual, año 1 vs año 2
- Distribución por asignación
- Gráficos automáticos (barras, torta)

**Hoja 5: PBC Acumulado**
- Mes a mes con valores acumulados
- Permite visualizar progresión del PBC durante el bienio

**Hoja 6: Comparación con Bienio Anterior**
- PBC del bienio actual vs anterior (si hay datos)
- Variaciones absolutas y porcentuales

**Hoja 7: Metadatos**
- Fecha de aprobación del PBC
- Fecha de generación del reporte
- Bienio
- Filtros aplicados
- Fuente de datos (DNP, SIPRO)

**Formato del archivo**:
- Nombre: "SGR_Plan_Bienal_Caja_[Bienio]_[Fecha].xlsx"
- Encabezados en negrilla, fondo azul
- Filtros automáticos habilitados
- Tablas dinámicas preparadas para análisis
- Formato de miles y moneda colombiana

### C. Descarga de Reporte por Territorio (Excel)
**Botón**: "Exportar Reporte de [Departamento/Municipio]"
**Requisito**: Haber seleccionado un departamento o municipio en los filtros

**Contenido**:
- PBC mensual del territorio en cada asignación
- Comparación con otros territorios (ranking)
- Comparación con bienio anterior
- Proyectos aprobados vs PBC (si hay información de ejecución)

**Útil para**: Entidades territoriales que necesitan documentar su PBC para planeación interna.

### D. Descarga de Informe Completo (PDF)
**Botón**: "Generar Informe PDF del PBC"
**Contenido**:
1. Portada con título, bienio y fecha
2. Resumen ejecutivo con indicadores clave
3. Gráfico de PBC mensual
4. Gráfico de PBC acumulado
5. Tabla de matriz de PBC (resumida, sin detalle mensual completo)
6. Gráfico de distribución por asignaciones
7. Gráfico de Top 10 departamentos
8. Mapa de calor de PBC mensual
9. Tabla de supuestos del PBC (producción, precios)
10. Comparación con Plan de Recursos (validación de consistencia)
11. Comparación con PBC del bienio anterior
12. Conclusiones
13. Anexo: Normativa de referencia (Decreto Ley 1949/2023, etc.)
14. Fuente de datos y fecha de aprobación

**Formato**: Documento de 20-25 páginas, formato carta, con marca de agua de SICODIS/DNP.

## 4.6.6. Interpretación Técnica

### A. Elaboración del Plan Bienal de Caja

**Responsable**: Dirección General del Sistema General de Regalías (DNP) en coordinación con el Ministerio de Hacienda.

**Base**: Plan de Recursos de 10 años (marco de referencia de largo plazo).

**Proceso de elaboración**:
1. **Proyección de recaudo bienal**: Estimación de ingresos para los próximos 24 meses basada en:
   - Producción certificada actual y proyectada (MME)
   - Precios internacionales esperados (actualizados respecto al Plan de Recursos)
   - Tasa de cambio proyectada
   - Ingresos no corrientes esperados (saldos, rendimientos)

2. **Distribución por asignaciones**: Aplicación de porcentajes según normativa:
   - Asignaciones Directas: 20% + 5%
   - Desarrollo Regional: 17%
   - Inversión Local y Regional: 55%
   - CTI: 10% de ingresos corrientes
   - Paz: 3%
   - FONPET, Administración/SSEC, Fiscalización: Según normativa

3. **Distribución territorial** (para asignaciones aplicables):
   - Asignaciones Directas: Según producción certificada por departamento y municipio
   - Inversión Local: Según fórmula de distribución (población, NBI, desempeño fiscal, etc.)

4. **Programación mensual**: Distribución de recursos mes a mes según:
   - Expectativas de liquidación de regalías (rezago de 1-2 meses respecto a producción)
   - Estacionalidad histórica del recaudo
   - Compromisos de pago (proyectos ya aprobados en ejecución)

5. **Validación y aprobación**:
   - Revisión técnica por DNP, MHCP, MME
   - Presentación a la Comisión Rectora del SGR
   - Aprobación oficial mediante acuerdo

**Momento de elaboración**: Antes del inicio del bienio (generalmente 2-3 meses antes).

**Carácter vinculante**: El PBC es **vinculante** para los OCAD. Solo se pueden aprobar proyectos hasta el monto disponible en el PBC.

### B. Ajustes al PBC durante el Bienio

**Causas de ajuste**:
- Recaudo efectivo significativamente diferente al proyectado (>±10%)
- Nuevos campos o minas en operación no considerados
- Cambios en precios internacionales
- Cambios normativos en tarifas o distribución
- Ingresos extraordinarios no proyectados

**Proceso de ajuste**:
1. Análisis técnico de desviaciones entre PBC y recaudo real
2. Elaboración de PBC ajustado con nuevas proyecciones
3. Aprobación por Comisión Rectora del SGR
4. Comunicación a OCAD y entidades territoriales
5. Actualización en sistemas (SIPRO)

**Frecuencia**: Generalmente 1-2 ajustes durante el bienio (si son necesarios).

### C. Uso del PBC para Aprobación de Proyectos en OCAD

**Regla fundamental**: Los proyectos aprobados en OCAD no pueden superar el PBC disponible para esa asignación y territorio.

**Proceso**:
1. **Consulta del PBC**: Secretaría Técnica verifica el saldo disponible en el PBC
2. **Presentación de proyectos**: Entidades territoriales o ejecutores presentan proyectos
3. **Viabilización**: Secretaría Técnica verifica que hay recursos en el PBC
4. **Aprobación**: OCAD aprueba proyectos hasta agotar el PBC disponible
5. **Registro**: Proyectos aprobados se descuentan del PBC, reduciendo el saldo disponible

**Saldo PBC**: PBC Programado - Proyectos Aprobados = Saldo Disponible

**Ejemplo**:
- PBC Asignaciones Directas Municipio X en 2025: $1,000 millones
- Proyectos aprobados en enero-marzo: $400 millones
- Saldo disponible para nuevos proyectos: $600 millones

El OCAD solo puede aprobar hasta $600 millones adicionales.

### D. Diferencias entre PBC y Ejecución

El PBC es una **programación financiera** (recursos disponibles), no una ejecución.

**Conceptos diferenciados**:
- **PBC Programado**: Recursos disponibles para comprometer
- **Proyectos Aprobados**: Recursos comprometidos en proyectos aprobados por OCAD
- **Giros**: Recursos efectivamente desembolsados a los proyectos
- **Ejecución**: Recursos efectivamente gastados por los proyectos

**Flujo**:
```
PBC → Aprobación OCAD → Giros → Ejecución
```

**Importante**: El módulo muestra el **PBC (disponibilidad)**, no la ejecución de proyectos. Para ejecución, consultar el SSEC.

### E. Transparencia y Rendición de Cuentas

El PBC es un instrumento de **transparencia**:
- Publicado oficialmente antes del inicio del bienio
- Accesible a todas las entidades territoriales y ciudadanía
- Base objetiva para aprobación de proyectos (no discrecional)
- Permite a órganos de control verificar que no se aprueben proyectos sin respaldo presupuestal

**Acceso público**: Los OCAD deben publicar el PBC y actualizaciones en sus sitios web.

## 4.6.7. Casos de Uso

### Caso de Uso 1: Planeación de Sesiones de OCAD Municipal
**Actor**: Secretaría Técnica de OCAD Municipal

**Objetivo**: Planear las sesiones del OCAD durante el bienio según la disponibilidad de recursos del PBC.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio correspondiente (ej. 2025-2026)
3. Filtrar por asignación "Inversión Local y Regional"
4. Filtrar por el departamento y municipio específico
5. Revisar la tabla de PBC mensual del municipio
6. Identificar meses con mayor PBC disponible
7. Exportar matriz de PBC a Excel
8. Planear calendario de sesiones:
   - Meses con alto PBC → Sesiones ordinarias para aprobar proyectos nuevos
   - Meses con bajo PBC → Sesiones de seguimiento o extraordinarias solo si es necesario
9. Comunicar calendario a miembros del OCAD
10. Preparar convocatorias según disponibilidad de recursos

**Resultado**: Calendario eficiente de sesiones de OCAD alineado con disponibilidad de recursos.

---

### Caso de Uso 2: Verificación de Techo Presupuestal para Proyecto
**Actor**: Alcalde Municipal

**Objetivo**: Verificar si el municipio tiene PBC suficiente para financiar un proyecto de acueducto de $500 millones.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio en curso (ej. 2025-2026)
3. Filtrar por "Inversión Local y Regional" (asignación para proyectos locales)
4. Filtrar por el departamento y municipio
5. Revisar el indicador "PBC Total Bienio" del municipio
6. Verificar si el PBC es ≥$500 millones
7. Si el PBC total es suficiente:
   - Revisar el estado de compromiso (si hay visualización de saldo disponible)
   - Calcular: Saldo Disponible = PBC - Proyectos ya aprobados
   - Verificar que el saldo sea ≥$500 millones
8. Si no hay suficiente PBC:
   - Considerar cofinanciación con otras fuentes
   - Dividir el proyecto en fases (ejecutar en bienios sucesivos)
   - Replantear el alcance del proyecto
9. Exportar datos para presentación al consejo municipal

**Resultado**: Determinación de viabilidad financiera del proyecto con recursos del PBC.

---

### Caso de Uso 3: Análisis de Distribución Territorial del PBC
**Actor**: Analista de Política Territorial del DNP

**Objetivo**: Evaluar cómo se distribuye el PBC entre departamentos y municipios.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio más reciente
3. No aplicar filtros (vista agregada)
4. Revisar el gráfico de Top 10 departamentos por PBC
5. Expandir la TreeTable para ver todos los departamentos
6. Exportar datos completos a Excel
7. Calcular métricas de distribución:
   - % del PBC que reciben los 5 departamentos con mayor PBC
   - % del PBC que reciben los 10 municipios con mayor PBC
   - Índice de Gini o Herfindahl para medir concentración
8. Analizar equidad territorial:
   - ¿Departamentos con mayor población reciben proporcionalmente más?
   - ¿Municipios productores reciben asignaciones adecuadas?
   - ¿Hay departamentos/municipios con PBC muy bajo?
9. Generar informe PDF con análisis
10. Presentar a la Comisión Rectora del SGR

**Resultado**: Evaluación de equidad y concentración territorial del PBC.

---

### Caso de Uso 4: Comparación de PBC entre Bienios
**Actor**: Secretaría de Planeación Departamental

**Objetivo**: Comparar el PBC del departamento entre el bienio actual y el anterior para planear inversión.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio actual (ej. 2025-2026)
3. Filtrar por el departamento específico
4. Anotar el PBC total del departamento (suma de todas las asignaciones)
5. Cambiar al bienio anterior (ej. 2024-2025)
6. Filtrar por el mismo departamento
7. Anotar el PBC del bienio anterior
8. Calcular la variación:
   - Variación absoluta (pesos)
   - Variación porcentual
9. Analizar las causas de la variación:
   - ¿Cambio en producción certificada (si es productor)?
   - ¿Cambio en población o NBI (para Inversión Local)?
   - ¿Cambios normativos en distribución?
10. Exportar datos de ambos bienios a Excel para comparación
11. Ajustar expectativas de inversión según disponibilidad de recursos
12. Si hay incremento significativo → Oportunidad de proyectos nuevos
13. Si hay reducción → Priorización de proyectos críticos

**Resultado**: Ajuste de planeación de inversión según cambios en el PBC.

---

### Caso de Uso 5: Identificación de Meses Óptimos para Aprobación de Proyectos
**Actor**: Director de Proyectos de Gobernación

**Objetivo**: Identificar los mejores meses para presentar proyectos al OCAD según disponibilidad de recursos.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio en curso
3. Filtrar por el departamento
4. Revisar el gráfico de PBC mensual
5. Identificar meses con "picos" de PBC (barras altas)
6. Revisar el mapa de calor de PBC mensual
7. Identificar patrones:
   - ¿Hay meses con sistemáticamente más PBC (ej. primer trimestre del año)?
   - ¿Hay meses con bajo PBC (ej. mitad del año)?
8. Exportar matriz de PBC mensual a Excel
9. Planear presentación de proyectos:
   - Proyectos de mayor valor → Meses de alto PBC
   - Proyectos menores → Cualquier mes
   - Evitar presentar proyectos grandes en meses de bajo PBC (menor probabilidad de aprobación)
10. Coordinar con Secretaría Técnica de OCAD

**Resultado**: Estrategia de presentación de proyectos optimizada según disponibilidad mensual de recursos.

---

### Caso de Uso 6: Auditoría de Consistencia del PBC
**Actor**: Auditor de Contraloría

**Objetivo**: Verificar que el PBC respete los porcentajes de distribución establecidos por ley.

**Pasos**:
1. Acceder al módulo "Plan Bienal de Caja"
2. Seleccionar el bienio a auditar
3. Revisar el gráfico de torta de distribución por asignaciones
4. Verificar porcentajes:
   - Inversión Local y Regional ≈ 55%
   - Asignaciones Directas ≈ 25% (20% + 5%)
   - Desarrollo Regional ≈ 17%
   - CTI ≈ 10% (de ingresos corrientes)
   - Paz ≈ 3%
5. Exportar datos completos a Excel
6. Calcular porcentajes exactos y compararlos con lo establecido por ley
7. Verificar que el PBC total sea consistente con el Plan de Recursos
8. Revisar que la distribución territorial (Asignaciones Directas) corresponda a producción certificada
9. Solicitar al DNP documentación soporte:
   - Acta de aprobación del PBC por Comisión Rectora
   - Certificados de producción del MME
   - Supuestos de recaudo utilizados
10. Si hay inconsistencias, generar hallazgo y solicitar corrección

**Resultado**: Verificación de la legalidad y consistencia del PBC.

---

## 4.6.8. Preguntas Frecuentes

**P1: ¿Qué es el Plan Bienal de Caja (PBC)?**

R: El PBC es la programación financiera operativa del SGR para los 24 meses del bienio. Establece cuántos recursos están disponibles cada mes para aprobar proyectos en cada asignación y territorio. Es el instrumento **vinculante** que determina el techo presupuestal de los OCAD.

**P2: ¿En qué se diferencia el PBC del Plan de Recursos?**

R:
- **PBC**: 24 meses, detalle mensual y territorial, vinculante para aprobación de proyectos, mayor certidumbre.
- **Plan de Recursos**: 10 años, detalle anual agregado, indicativo para planeación estratégica, mayor incertidumbre.

El PBC es el instrumento operativo, el Plan de Recursos es el marco estratégico.

**P3: ¿El PBC puede cambiar durante el bienio?**

R: Sí, el PBC puede ajustarse si hay cambios significativos en el recaudo respecto a lo proyectado. Los ajustes deben ser aprobados por la Comisión Rectora del SGR y comunicados a los OCAD. Típicamente hay 1-2 ajustes por bienio si son necesarios.

**P4: ¿Qué pasa si el recaudo efectivo es menor al PBC?**

R: Si el recaudo es sistemáticamente menor al PBC:
- Se debe ajustar el PBC a la baja para reflejar la menor disponibilidad de recursos
- Los OCAD deben ser más selectivos y aprobar solo proyectos prioritarios
- Puede requerirse reprogramación o cancelación de proyectos aprobados si no se pueden financiar

**P5: ¿Por qué algunos meses tienen más PBC que otros?**

R: El PBC refleja la expectativa de **liquidación** de regalías, que tiene rezago respecto a la producción:
- Meses con mayor producción esperada (1-2 meses antes) → Mayor PBC
- Meses con menor producción o paradas técnicas → Menor PBC
- Estacionalidad del recaudo se traslada al PBC

Además, puede haber programación estratégica para distribuir recursos de manera balanceada.

**P6: ¿Un proyecto puede usar PBC de varios meses?**

R: Sí. Un proyecto multinanual aprobado puede usar recursos del PBC de varios meses o incluso de varios bienios. Lo importante es que al momento de aprobación, haya PBC disponible suficiente para el compromiso total del proyecto.

**P7: ¿Cómo se calcula el PBC de un municipio en Inversión Local?**

R: El PBC de Inversión Local se distribuye entre municipios según una **fórmula** que considera:
- Población (40%)
- Necesidades Básicas Insatisfechas - NBI (20%)
- Desempeño fiscal (10%)
- Eficiencia administrativa (10%)
- Avance en ejecución de proyectos (20%)

La fórmula está establecida en la normativa del SGR (Decreto Ley 1949/2023).

**P8: ¿El PBC incluye recursos de proyectos ya aprobados en ejecución?**

R: El PBC es el total de recursos **disponibles** para el bienio. Incluye tanto recursos para proyectos nuevos como compromisos de proyectos ya aprobados que continúan en ejecución. El "saldo disponible" se calcula restando los proyectos ya aprobados del PBC total.

---

## 4.6.9. Relación con Otros Módulos

- **Plan de Recursos**: El PBC se elabora consistentemente con el marco de largo plazo del Plan de Recursos
- **Presupuesto y Recaudo**: Compara el PBC proyectado con el recaudo efectivo mes a mes
- **Recaudo Mensual SGR**: Muestra el recaudo real que debe ajustarse al PBC
- **Recaudo Asignaciones Directas**: El PBC de Asignaciones Directas se basa en producción certificada proyectada
- **Todos los módulos SGR**: El PBC es el instrumento operativo que determina la disponibilidad de recursos para todas las asignaciones

---

**Anterior**: [4.5. Plan de Recursos](04-05-sgr-plan-recursos.md) | **Siguiente**: [4.7. Comparativo SGR](04-07-sgr-comparativo.md)
