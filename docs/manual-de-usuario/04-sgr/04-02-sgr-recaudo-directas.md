# 4.2. Recaudo Asignaciones Directas

**Ruta de acceso**: `/sgr-recaudo-directas`

## 4.2.1. Propósito del Módulo

El módulo **Recaudo Asignaciones Directas** permite consultar la distribución específica de los recursos del SGR destinados a las **Asignaciones Directas** (20% + 5%) que reciben los departamentos, municipios y distritos productores de recursos naturales no renovables.

Este módulo es fundamental para:

- Conocer el monto específico que recibe cada territorio productor
- Diferenciar entre la Asignación Directa del 20% y la Adicional del 5%
- Identificar qué territorios son los principales beneficiarios de asignaciones directas
- Analizar la distribución territorial del recaudo por producción
- Verificar los recursos disponibles para proyectos en territorios productores
- Realizar análisis de equidad y redistribución territorial
- Planear la inversión de recursos de asignaciones directas

Las asignaciones directas son recursos que reciben los territorios productores en función de la producción certificada en su jurisdicción, diferenciándose de otras asignaciones del SGR que se distribuyen mediante OCAD.

## 4.2.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Asignaciones Directas por Territorio
- **Departamentos productores**: Recursos del 20% asignados a cada departamento
- **Municipios productores**: Recursos del 20% asignados a cada municipio
- **Municipios portuarios**: Recursos por transporte de hidrocarburos
- **Asignación Adicional del 5%**: Recursos adicionales para municipios productores

### B. Distribución por Tipo de Recurso
- **Asignaciones por hidrocarburos**: Departamentos y municipios con producción de petróleo y gas
- **Asignaciones por minería**: Departamentos y municipios con producción minera
- **Proporción hidrocarburos/minería**: Composición del origen de las asignaciones directas

### C. Evolución Temporal
- **Asignaciones por vigencia bienal**: Recursos asignados en cada bienio
- **Comparación entre bienios**: Evolución de las asignaciones directas a cada territorio
- **Tendencias de crecimiento o decrecimiento**: Cambios en la producción certificada

### D. Rankings y Concentración
- **Top 10 departamentos**: Departamentos con mayores asignaciones directas
- **Top 20 municipios**: Municipios con mayores asignaciones directas
- **Índice de concentración**: Cuánto del total de asignaciones directas reciben los principales territorios
- **Nuevos territorios productores**: Departamentos o municipios que inician producción

### E. Detalle de Producción Certificada
- **Producción de hidrocarburos**: Barriles de petróleo, metros cúbicos de gas
- **Producción minera**: Toneladas de carbón, oro, níquel, otros minerales
- **Cálculo de regalías**: Aplicación de tarifas según producción y tipo de recurso
- **Distribución 20%-5%**: Asignación del 20% general y el 5% adicional municipal

## 4.2.3. Controles y Filtros

### A. Selector de Vigencia Bienal
Permite seleccionar el bienio a consultar:
- 2023-2024
- 2024-2025
- 2025-2026

**Comportamiento**: Al cambiar el bienio, se actualizan las asignaciones directas correspondientes al periodo seleccionado.

### B. Selector de Nivel Territorial
Permite definir el nivel de consulta:
- **Departamentos**: Visualiza asignaciones directas a nivel departamental
- **Municipios**: Visualiza asignaciones directas a nivel municipal
- **Ambos**: Muestra departamentos y municipios en vistas separadas

**Uso recomendado**: Seleccionar "Departamentos" para análisis macro, "Municipios" para detalle local.

### C. Filtro de Departamento
Cuando se selecciona "Municipios" en el nivel territorial, este filtro permite:
- **Todos los departamentos**: Muestra municipios de todo el país
- **Departamento específico**: Filtra solo los municipios de un departamento

**Funcionalidad en cascada**: Al seleccionar un departamento, la lista de municipios se actualiza automáticamente.

### D. Filtro de Tipo de Recurso
Permite filtrar las asignaciones según el origen:
- **Todos**: Asignaciones por hidrocarburos + minería
- **Hidrocarburos**: Solo asignaciones por producción de petróleo y gas
- **Minería**: Solo asignaciones por producción minera

### E. Filtro de Tipo de Asignación
Permite diferenciar entre:
- **Ambas (20% + 5%)**: Muestra el total de asignaciones directas
- **Solo Asignación Directa 20%**: Asignación base para departamentos y municipios productores
- **Solo Asignación Adicional 5%**: Asignación adicional exclusiva para municipios productores

**Nota**: La asignación del 5% solo aplica a municipios, no a departamentos.

### F. Buscador de Territorio
Campo de búsqueda rápida para localizar un departamento o municipio específico por nombre o código DANE.

**Comportamiento**: Búsqueda incremental que filtra la tabla mientras se escribe.

## 4.2.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **Total Asignaciones Directas del Bienio**
   - Valor: Suma de todas las asignaciones directas (20% + 5%)
   - Formato: "$X.XXX.XXX millones"
   - Comparación: Variación % respecto al bienio anterior

2. **Asignación Directa 20%**
   - Valor: Total de la asignación del 20%
   - Formato: "$X.XXX.XXX millones"
   - Participación: % del total de asignaciones directas

3. **Asignación Adicional 5%**
   - Valor: Total de la asignación del 5% (solo municipios)
   - Formato: "$XXX.XXX millones"
   - Participación: % del total de asignaciones directas

4. **Número de Territorios Beneficiarios**
   - Valor: Cantidad de departamentos + municipios que reciben asignaciones directas
   - Desglose: "X departamentos | Y municipios"

5. **Concentración en Top 5**
   - Valor: % del total de asignaciones que reciben los 5 principales territorios
   - Indicador: Nivel de concentración (alto >60%, medio 40-60%, bajo <40%)

6. **Participación Hidrocarburos vs Minería**
   - Valores: % hidrocarburos | % minería
   - Visualización: Gráfico de gauge dual

![Indicadores Clave de Asignaciones Directas](../assets/screenshots/sgr-directas-kpis.png)
*Indicadores clave de asignaciones directas*

### B. Gráfico de Barras - Top 10 Departamentos

**Tipo**: Gráfico de barras horizontales

**Descripción**: Muestra los 10 departamentos con mayores asignaciones directas en el bienio seleccionado.

**Elementos visuales**:
- **Eje Y**: Nombres de departamentos (ej. Meta, Casanare, Santander)
- **Eje X**: Valores en millones de pesos (COP)
- **Barras**: Diferenciadas por color según participación (mayor participación = color más intenso)
- **Etiquetas**: Valores exactos al final de cada barra

**Interactividad**:
- Hover sobre barra muestra: "Meta: $1,234,567 M (45.2% del total)"
- Clic en barra filtra las visualizaciones para ese departamento específico

**Interpretación**:
- Identifica los departamentos más dependientes de regalías
- Permite ver la concentración territorial de la producción
- Útil para análisis de equidad distributiva

![Gráfico Top 10 Departamentos](../assets/screenshots/sgr-directas-top-departamentos.png)
*Los 10 departamentos con mayores asignaciones directas*

### C. Gráfico de Barras - Top 20 Municipios

**Tipo**: Gráfico de barras horizontales con scroll

**Descripción**: Muestra los 20 municipios con mayores asignaciones directas (20% + 5%).

**Elementos visuales**:
- **Eje Y**: Nombres de municipios con departamento entre paréntesis (ej. "Barrancabermeja (Santander)")
- **Eje X**: Valores en millones de pesos
- **Barras apiladas**: Diferenciación visual entre Asignación 20% (azul oscuro) y 5% (azul claro)
- **Etiquetas**: Valores totales al final de cada barra

**Interactividad**:
- Hover muestra detalle: "Barrancabermeja: $456,789 M (AD 20%: $365,431 M | AD 5%: $91,358 M)"
- Clic en municipio muestra producción certificada y proyectos financiados

**Interpretación**:
- Identifica municipios con mayor producción certificada
- Permite ver la distribución entre asignación base (20%) y adicional (5%)
- Útil para análisis de capacidad de inversión municipal

![Gráfico Top 20 Municipios](../assets/screenshots/sgr-directas-top-municipios.png)
*Los 20 municipios con mayores asignaciones directas (20% + 5%)*

### D. Mapa de Calor - Asignaciones Directas por Departamento

**Tipo**: Mapa coroplético de Colombia con Leaflet

**Descripción**: Visualización geográfica de las asignaciones directas a nivel departamental.

**Elementos visuales**:
- **Escala de color**: Gradiente de azul claro (bajas asignaciones) a azul oscuro (altas asignaciones)
- **Rangos de valores**: Divididos en quintiles para mejor diferenciación
- **Etiquetas geográficas**: Nombres de departamentos sobre el mapa

**Interactividad**:
- Hover sobre departamento muestra tooltip: "Meta: $1,234,567 M | Producción: 45% hidrocarburos, 55% minería"
- Clic en departamento abre panel lateral con detalle de municipios productores
- Zoom y pan para explorar regiones específicas

**Leyenda**:
- Rangos de asignaciones con colores correspondientes
- Departamentos sin producción certificada en gris claro

**Interpretación**:
- Identifica visualmente las regiones productoras
- Permite ver concentración geográfica de la producción
- Útil para análisis de desarrollo territorial

![Mapa de Calor de Asignaciones Directas](../assets/screenshots/sgr-directas-mapa.png)
*Distribución geográfica de asignaciones directas por departamento*

### E. Tabla Detallada - Asignaciones Directas por Territorio

**Tipo**: TreeTable de PrimeNG con estructura jerárquica

**Descripción**: Presenta el detalle completo de las asignaciones directas con capacidad de expansión por departamento y municipio.

**Columnas (Nivel Departamento)**:
1. **Departamento**: Nombre del departamento (expandible)
2. **Total Asignaciones**: Suma de AD 20% departamental + AD de municipios
3. **AD 20% Departamento**: Asignación directa del 20% al departamento
4. **Total AD Municipios**: Suma de asignaciones (20% + 5%) de municipios en el departamento
5. **Hidrocarburos**: Asignaciones por producción de petróleo y gas
6. **Minería**: Asignaciones por producción minera
7. **% del Total Nacional**: Participación porcentual en el total de asignaciones directas
8. **Variación vs Bienio Anterior**: Cambio porcentual respecto al bienio previo

**Columnas (Nivel Municipio - al expandir departamento)**:
1. **Municipio**: Nombre del municipio
2. **Código DANE**: Código identificador del municipio
3. **AD 20%**: Asignación directa del 20% al municipio
4. **AD 5%**: Asignación adicional del 5% al municipio
5. **Total AD Municipio**: Suma de AD 20% + AD 5%
6. **Hidrocarburos**: Monto por producción de hidrocarburos
7. **Minería**: Monto por producción minera
8. **% del Departamento**: Participación en las asignaciones directas del departamento
9. **Tipo de Territorio**: Productor / Portuario / Ambos

**Estructura jerárquica**:
- **Nivel 1**: Departamento (32 filas - departamentos productores)
  - **Nivel 2**: Municipio (varía según departamento)
    - **Nivel 3**: Tipo de recurso (Hidrocarburos / Minería)

**Funcionalidades**:
- **Ordenamiento**: Clic en encabezados para ordenar (mantiene jerarquía)
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Búsqueda rápida**: Filtro por nombre de departamento o municipio
- **Resaltado condicional**:
  - Top 5 departamentos con fondo verde claro
  - Nuevos territorios productores con ícono de estrella
  - Variación positiva >10% en verde, negativa >10% en rojo
- **Paginación**: 20 departamentos por página
- **Exportación**: Botón para descargar tabla completa en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones con separador de miles
- Porcentajes: "XX.X%" con un decimal
- Variaciones: "+XX.X%" o "-XX.X%" con color según signo

**Fila de totales**:
Al final de la tabla, fila resumen con:
- Total Nacional de Asignaciones Directas
- Suma de AD 20% y AD 5%
- Total Hidrocarburos y Minería
- 100% como porcentaje total

![Tabla Detallada de Asignaciones Directas](../assets/screenshots/sgr-directas-tabla.png)
*Tabla detallada de asignaciones directas por departamento y municipio*

### F. Gráfico de Composición - Hidrocarburos vs Minería

**Tipo**: Gráfico de dona (doughnut) con centro informativo

**Descripción**: Muestra la distribución porcentual de las asignaciones directas según el tipo de recurso.

**Elementos visuales**:
- **Segmento azul**: Asignaciones por hidrocarburos
- **Segmento verde**: Asignaciones por minería
- **Centro del gráfico**: Porcentaje dominante y valor total
- **Leyenda**: Tipo de recurso, valor y porcentaje

**Interactividad**:
- Hover sobre segmento muestra: "Hidrocarburos: $2,345,678 M (67.3%)"
- Clic en segmento filtra la tabla para mostrar solo territorios con ese tipo de producción

**Interpretación**:
- Identifica la dependencia del SGR respecto a hidrocarburos o minería
- Permite evaluar diversificación de fuentes de regalías
- Útil para análisis de riesgos por volatilidad de precios de un solo sector

![Gráfico de Composición Hidrocarburos vs Minería](../assets/screenshots/sgr-directas-composicion.png)
*Distribución de asignaciones directas por tipo de recurso*

### G. Gráfico de Evolución - Asignaciones Directas por Bienio

**Tipo**: Gráfico de barras agrupadas (múltiples bienios)

**Descripción**: Compara las asignaciones directas entre diferentes bienios para un territorio seleccionado.

**Elementos visuales**:
- **Eje X**: Bienios disponibles (2023-2024, 2024-2025, 2025-2026)
- **Eje Y**: Valores en millones de pesos
- **Barras agrupadas**: AD 20% (azul), AD 5% (verde), Total (gris)
- **Línea de tendencia**: Muestra la evolución del total

**Interactividad**:
- Selector de territorio: Permite elegir departamento o municipio a analizar
- Hover muestra valores exactos y variación porcentual respecto al bienio anterior
- Clic en barra navega a ese bienio específico

**Interpretación**:
- Identifica tendencias de crecimiento o decrecimiento en la producción
- Permite evaluar impacto de nuevos proyectos o cierre de operaciones
- Útil para proyecciones de recursos futuros

![Gráfico de Evolución de Asignaciones Directas](../assets/screenshots/sgr-directas-evolucion.png)
*Evolución de asignaciones directas por bienio en territorio seleccionado*

## 4.2.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, bienio y fuente de datos.

### B. Descarga de Datos en Excel
**Botón**: "Exportar a Excel"
**Contenido del archivo**:

**Hoja 1: Asignaciones por Departamento**
- Todas las columnas de nivel departamental
- Totales y participaciones porcentuales
- Formato condicional para Top 5

**Hoja 2: Asignaciones por Municipio**
- Detalle completo de todos los municipios productores
- Columna adicional: Departamento al que pertenece
- Ordenado por monto de asignación (descendente)

**Hoja 3: Resumen Ejecutivo**
- Total de asignaciones directas del bienio
- Top 10 departamentos y Top 20 municipios
- Distribución hidrocarburos vs minería
- Indicadores de concentración

**Hoja 4: Evolución Temporal**
- Comparación entre bienios disponibles
- Tasas de crecimiento por territorio
- Identificación de nuevos territorios productores

**Hoja 5: Metadatos**
- Fecha de generación del reporte
- Bienio consultado
- Filtros aplicados
- Fuente de datos (SIPRO, Ministerio de Minas)

**Formato del archivo**:
- Nombre: "SGR_Asignaciones_Directas_[Bienio]_[Fecha].xlsx"
- Encabezados en negrilla, fondo azul
- Filtros automáticos habilitados
- Formato de miles y moneda colombiana
- Tablas dinámicas preparadas para análisis

### C. Descarga de Informe Completo (PDF)
**Botón**: "Generar Informe PDF"
**Contenido**:
1. Portada con título, bienio y fecha de generación
2. Resumen ejecutivo con indicadores clave
3. Gráfico de Top 10 departamentos
4. Gráfico de Top 20 municipios
5. Mapa de calor de asignaciones directas
6. Tabla detallada por departamento (resumida, sin municipios)
7. Gráfico de composición hidrocarburos vs minería
8. Análisis de concentración territorial
9. Conclusiones y observaciones automáticas
10. Fuente de datos y fecha de corte

**Formato**: Documento de 12-15 páginas, formato carta, con marca de agua de SICODIS.

## 4.2.6. Interpretación Técnica

### A. Cálculo de Asignaciones Directas

**Base legal**: Decreto Ley 1949 de 2023, artículos relacionados con distribución de regalías.

**Fórmula de la Asignación Directa del 20%**:

Para **departamentos productores**:
```
AD 20% Depto = (Producción Certificada Depto / Producción Nacional Total) × 20% × Recaudo Total SGR
```

Para **municipios productores**:
```
AD 20% Mpio = (Producción Certificada Mpio / Producción Nacional Total) × 20% × Recaudo Total SGR
```

Para **municipios portuarios**:
```
AD 20% Mpio Portuario = (Volumen Transportado / Volumen Nacional Total) × 20% × Recaudo Total SGR × Factor Portuario
```

**Fórmula de la Asignación Adicional del 5%**:

Solo aplica a **municipios productores**:
```
AD 5% Mpio = (Producción Certificada Mpio / Producción Nacional Total) × 5% × Ingresos Corrientes SGR
```

**Nota importante**: El 5% se calcula sobre **ingresos corrientes**, no sobre recaudo total.

### B. Certificación de Producción

**Responsable**: Ministerio de Minas y Energía

**Proceso**:
1. Las empresas explotadoras reportan producción mensual
2. El Ministerio verifica y certifica los volúmenes
3. Se determina el territorio de origen (departamento y municipio)
4. Se calcula la regalía según tarifas vigentes
5. Se distribuye según fórmulas de asignaciones directas

**Frecuencia**: Mensual, con cierre y ajustes al final del bienio.

**Documentos fuente**:
- Certificados de producción de hidrocarburos (barriles/día, m³/día)
- Certificados de producción minera (toneladas/mes)
- Certificados de transporte portuario

### C. Tarifas de Regalías

**Hidrocarburos (Petróleo)**:
- Producción < 5,000 barriles/día: 8%
- Producción 5,000 - 125,000 barriles/día: Escala progresiva 8% - 20%
- Producción > 125,000 barriles/día: 20%
- Campos marginales: Tarifas especiales reducidas

**Gas Natural**:
- 5% sobre el valor de producción

**Minería**:
- Carbón: 10% (puede variar según tipo y ubicación)
- Oro: 4% (puede aumentar según producción)
- Níquel: 12%
- Esmeraldas: Regalías específicas
- Otros minerales: Tarifas diferenciadas según mineral

**Nota**: Las tarifas pueden cambiar según normativa vigente. Consultar siempre la resolución del Ministerio de Minas aplicable.

### D. Diferencias entre AD 20% y AD 5%

| Aspecto | Asignación Directa 20% | Asignación Adicional 5% |
|---------|------------------------|-------------------------|
| **Beneficiarios** | Departamentos y municipios productores + municipios portuarios | Solo municipios productores |
| **Base de cálculo** | Recaudo total del SGR | Ingresos corrientes del SGR |
| **Finalidad** | Compensación por explotación y afectaciones ambientales | Fortalecimiento adicional a municipios productores |
| **Marco legal** | Constitución art. 361, Ley 1530/2012 | Decreto Ley 1949/2023 |
| **Uso de recursos** | Inversión en desarrollo territorial | Inversión en desarrollo territorial |
| **Aprobación de proyectos** | Mediante OCAD | Mediante OCAD |

### E. Uso de Recursos de Asignaciones Directas

**Destino de los recursos**:
- Proyectos de inversión en desarrollo económico y social
- Infraestructura (vías, acueductos, alcantarillado, energía)
- Educación y salud
- Vivienda y saneamiento básico
- Medio ambiente y gestión del riesgo
- Fortalecimiento institucional

**Restricciones**:
- **NO se pueden** usar para gastos de funcionamiento
- **NO se pueden** usar para pago de salarios permanentes
- **Deben aprobarse** mediante proyectos en OCAD
- **Deben ejecutarse** en el bienio o siguiente (con justificación)

**Excepciones**:
- Hasta el 10% puede destinarse a proyectos de menor cuantía sin OCAD (bajo condiciones específicas)
- Proyectos de urgencia por desastres naturales pueden tener trámite acelerado

### F. Análisis de Concentración Territorial

**Índice de Concentración**:
Mide qué porcentaje del total de asignaciones directas reciben los principales territorios.

**Interpretación**:
- **Alta concentración (>60% en Top 5)**: Pocos territorios reciben la mayoría de recursos. Común en países con producción concentrada geográficamente.
- **Concentración media (40-60% en Top 5)**: Distribución moderadamente dispersa.
- **Baja concentración (<40% en Top 5)**: Producción muy distribuida entre múltiples territorios.

**Implicaciones**:
- Alta concentración → Mayor dependencia de pocos territorios → Mayor riesgo fiscal si cae producción
- Baja concentración → Mayor redistribución territorial → Recursos más dispersos para inversión

## 4.2.7. Casos de Uso

### Caso de Uso 1: Verificación de Asignaciones Directas Municipales
**Actor**: Secretaría de Hacienda de Municipio Productor

**Objetivo**: Verificar el monto de asignaciones directas (20% + 5%) que recibirá el municipio en el bienio.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar el bienio en curso o próximo bienio
3. En "Nivel Territorial" seleccionar "Municipios"
4. En "Filtro de Departamento" seleccionar el departamento del municipio
5. Buscar el municipio en la tabla detallada
6. Expandir la fila para ver desagregación por tipo de recurso
7. Verificar AD 20%, AD 5% y Total
8. Comparar con bienio anterior para ver tendencias
9. Exportar datos a Excel para documentación interna

**Resultado**: Confirmación del monto disponible para planeación de proyectos de inversión.

---

### Caso de Uso 2: Análisis Comparativo de Municipios Productores
**Actor**: Analista de Desarrollo Regional del DNP

**Objetivo**: Comparar las asignaciones directas entre municipios de un mismo departamento.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar bienio de análisis
3. Seleccionar "Municipios" en nivel territorial
4. Filtrar por el departamento específico (ej. Meta)
5. Revisar el gráfico de Top 20 municipios (filtrado automáticamente)
6. Expandir la tabla para ver detalle de cada municipio
7. Ordenar por columna "Total AD Municipio" (descendente)
8. Comparar proporciones de AD 20% vs AD 5%
9. Identificar municipios con mayor dependencia de hidrocarburos vs minería
10. Exportar tabla para análisis estadístico externo

**Resultado**: Comprensión de la distribución intra-departamental de asignaciones directas.

---

### Caso de Uso 3: Identificación de Nuevos Territorios Productores
**Actor**: Dirección de Regalías del DNP

**Objetivo**: Identificar departamentos o municipios que comienzan a recibir asignaciones directas en el bienio actual.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar el bienio actual (ej. 2025-2026)
3. Revisar la tabla detallada de departamentos
4. Identificar territorios con ícono de estrella (nuevos productores)
5. Expandir el departamento para ver municipios nuevos
6. Cambiar al bienio anterior (2024-2025)
7. Verificar que el territorio no aparecía o tenía asignación $0
8. Regresar al bienio actual y exportar lista de nuevos productores
9. Solicitar información al Ministerio de Minas sobre nuevos proyectos

**Resultado**: Lista de nuevos territorios productores que requieren acompañamiento técnico para gestión de recursos.

---

### Caso de Uso 4: Análisis de Concentración Geográfica
**Actor**: Investigador Académico

**Objetivo**: Evaluar la concentración geográfica de la producción de recursos naturales mediante asignaciones directas.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar el bienio más reciente
3. Revisar el indicador "Concentración en Top 5"
4. Analizar el gráfico de Top 10 departamentos
5. Verificar qué porcentaje del total nacional representa el primer departamento
6. Descargar el mapa de calor para inclusión en paper académico
7. Exportar datos completos a Excel
8. Calcular índice de Gini o Herfindahl-Hirschman para concentración
9. Comparar con bienios anteriores para identificar tendencias
10. Generar informe PDF para presentación

**Resultado**: Análisis cuantitativo de concentración territorial de regalías para investigación.

---

### Caso de Uso 5: Planeación de Recursos para OCAD Municipal
**Actor**: Secretaría Técnica de OCAD Municipal

**Objetivo**: Determinar el techo presupuestal disponible para aprobar proyectos del municipio.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar el bienio correspondiente al OCAD
3. Filtrar por el municipio específico
4. Anotar el monto de AD 20% y AD 5%
5. Sumar ambas asignaciones para obtener el techo total
6. Revisar la evolución en el gráfico de bienios para proyectar bienios futuros
7. Exportar datos a Excel para elaborar acta de OCAD
8. Compartir información con alcalde y consejeros del OCAD
9. Usar el techo para priorizar proyectos a aprobar

**Resultado**: Determinación precisa del presupuesto disponible para inversión mediante OCAD.

---

### Caso de Uso 6: Auditoría de Asignaciones Directas
**Actor**: Contraloría Departamental

**Objetivo**: Verificar que las asignaciones directas del departamento y sus municipios corresponden a la producción certificada.

**Pasos**:
1. Acceder al módulo "Recaudo Asignaciones Directas"
2. Seleccionar el bienio a auditar
3. Revisar el monto de AD 20% del departamento
4. Expandir la tabla para ver municipios del departamento
5. Sumar las asignaciones de todos los municipios
6. Exportar datos a Excel para verificación detallada
7. Solicitar al Ministerio de Minas certificados de producción del bienio
8. Verificar que los porcentajes de asignación correspondan a la producción certificada
9. Identificar discrepancias o inconsistencias
10. Generar informe de hallazgos si es necesario

**Resultado**: Verificación de la correcta distribución de asignaciones directas según producción certificada.

---

## 4.2.8. Preguntas Frecuentes

**P1: ¿Por qué algunos municipios reciben AD 20% pero no AD 5%?**

R: La Asignación Adicional del 5% solo aplica a municipios productores, no a municipios portuarios. Si un municipio solo aparece con AD 20%, es probable que sea un municipio portuario (transporte de hidrocarburos) sin producción certificada en su territorio.

**P2: ¿Cómo se calcula el porcentaje que recibe cada territorio?**

R: Se basa en la **producción certificada** del territorio dividida entre la producción nacional total. Por ejemplo, si un municipio produce 10,000 barriles/día de petróleo y la producción nacional es 1,000,000 barriles/día, el municipio recibirá (10,000 / 1,000,000) × 20% del recaudo total = 0.2% del recaudo total.

**P3: ¿Las asignaciones directas pueden variar durante el bienio?**

R: Sí, las asignaciones se actualizan mensualmente según la producción certificada. Si un municipio aumenta su producción, recibirá más recursos. Si disminuye (por cierre de pozos o minas), recibirá menos. Las cifras del bienio completo son la suma de las asignaciones mensuales.

**P4: ¿Un departamento puede tener producción pero ninguno de sus municipios tener asignaciones directas?**

R: No. Si un departamento recibe asignaciones directas, significa que hay producción certificada en su territorio, lo cual implica que al menos un municipio también debe recibir asignaciones. La suma de las asignaciones municipales debe relacionarse con la asignación departamental (aunque no son iguales, ya que se calculan independientemente sobre bases distintas).

**P5: ¿Qué pasa si un territorio no ejecuta sus asignaciones directas en el bienio?**

R: Los recursos no ejecutados pueden:
1. Trasladarse al siguiente bienio con justificación válida
2. Revertirse al Sistema General de Regalías si no se ejecutan en plazo establecido
3. Generar observaciones de control fiscal por deficiente gestión

Por esto es importante planear adecuadamente y aprobar proyectos viables en los OCAD.

**P6: ¿Cómo afecta el precio del petróleo a las asignaciones directas?**

R: Los precios internacionales afectan directamente el valor de las regalías y, por tanto, las asignaciones directas:
- **Precio alto** → Mayor valor de regalías → Mayores asignaciones directas
- **Precio bajo** → Menor valor de regalías → Menores asignaciones directas

El volumen de producción también es clave: mayor producción × precio alto = asignaciones máximas.

**P7: ¿Se pueden usar asignaciones directas para gastos de funcionamiento?**

R: **NO**. Las asignaciones directas son exclusivamente para **inversión**. No se pueden destinar a:
- Salarios de planta permanente
- Gastos administrativos recurrentes
- Pago de deudas operacionales
- Funcionamiento de la administración

Solo pueden financiar **proyectos de inversión** aprobados por OCAD.

---

## 4.2.9. Relación con Otros Módulos

- **Recaudo Mensual SGR**: Muestra el recaudo total del cual se calculan las asignaciones directas (20% + 5%)
- **Plan Bienal de Caja**: Incluye la programación de asignaciones directas para los 24 meses del bienio
- **Presupuesto y Recaudo**: Compara las asignaciones directas proyectadas vs ejecutadas
- **Comparativo SGR**: Permite comparar asignaciones directas entre diferentes territorios

---

**Anterior**: [4.1. Recaudo Mensual SGR](04-01-sgr-recaudo-mensual.md) | **Siguiente**: [4.3. Presupuesto y Recaudo](04-03-sgr-presupuesto-recaudo.md)
