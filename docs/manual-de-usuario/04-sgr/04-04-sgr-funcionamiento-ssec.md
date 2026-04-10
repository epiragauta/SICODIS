# 4.4. Funcionamiento SSEC

**Ruta de acceso**: `/reporte-funcionamiento`

## 4.4.1. Propósito del Módulo

El módulo **Funcionamiento SSEC** permite consultar los recursos del Sistema General de Regalías destinados a la **administración del sistema** y al **Sistema de Seguimiento, Evaluación y Control (SSEC)**. Estos recursos financian el funcionamiento operativo del SGR y los instrumentos de monitoreo, evaluación y control de los proyectos de inversión.

Este módulo es fundamental para:

- Conocer los recursos destinados al funcionamiento del SGR
- Verificar la distribución entre entidades administradoras
- Monitorear el uso de recursos para el SSEC
- Evaluar la eficiencia administrativa del sistema
- Garantizar transparencia en el uso de recursos de funcionamiento
- Analizar la evolución del gasto administrativo entre bienios
- Cumplir con requisitos de rendición de cuentas

El SSEC es clave para la gestión del SGR, ya que permite hacer seguimiento a la ejecución de más de 10,000 proyectos de inversión financiados con regalías en todo el país.

## 4.4.2. Datos que Visualiza

El módulo presenta información sobre:

### A. Recursos de Administración del SGR
- **Presupuesto total de administración**: Recursos asignados para el funcionamiento operativo del SGR
- **Distribución por entidad administradora**:
  - Departamento Nacional de Planeación (DNP)
  - Ministerio de Hacienda y Crédito Público (MHCP)
  - Ministerio de Minas y Energía (MME)
  - Secretarías Técnicas de OCAD
  - Otras entidades del sistema
- **Ejecución presupuestal**: Presupuesto asignado vs ejecutado por entidad
- **Conceptos de gasto**: Personal, contratación, inversión en sistemas, infraestructura

### B. Recursos del SSEC
- **Presupuesto total del SSEC**: Recursos destinados al Sistema de Seguimiento, Evaluación y Control
- **Distribución por componente**:
  - Seguimiento a proyectos de inversión
  - Evaluación de impacto y resultados
  - Control y fiscalización
  - Plataformas tecnológicas (SIPRO, SSEC, SMSCE)
  - Capacitación y asistencia técnica
- **Ejecución del SSEC**: Avance en la ejecución de recursos
- **Número de proyectos monitoreados**: Cantidad de proyectos bajo seguimiento

### C. Evolución Temporal
- **Comparación entre bienios**: Recursos de funcionamiento y SSEC en diferentes bienios
- **Tendencias de crecimiento**: Evolución del presupuesto de administración
- **Eficiencia administrativa**: Relación entre recursos de funcionamiento y recursos totales del SGR

### D. Indicadores de Eficiencia
- **% de Funcionamiento sobre Total SGR**: Proporción de recursos del SGR destinados a administración
- **Costo promedio de seguimiento por proyecto**: Recursos del SSEC / número de proyectos monitoreados
- **Ejecución de recursos de funcionamiento**: % de ejecución presupuestal
- **Relación funcionamiento/inversión**: Comparación entre recursos administrativos y recursos de inversión

### E. Detalle de Siglas y Diccionario
- **Siglas del SGR**: Listado de acrónimos utilizados (OCAD, SSEC, SIPRO, etc.)
- **Diccionario de términos**: Definiciones técnicas del sistema
- **Entidades del sistema**: Descripción de roles y funciones

## 4.4.3. Controles y Filtros

### A. Selector de Vigencia Bienal
Permite seleccionar el bienio a consultar:
- 2023-2024
- 2024-2025
- 2025-2026

**Comportamiento**: Al cambiar el bienio, se actualizan los recursos de funcionamiento y SSEC correspondientes.

### B. Selector de Tipo de Recurso
Permite filtrar por:
- **Administración**: Solo recursos de funcionamiento operativo del SGR
- **SSEC**: Solo recursos del Sistema de Seguimiento, Evaluación y Control
- **Ambos**: Visualiza administración + SSEC

**Uso recomendado**: Seleccionar "Ambos" para análisis integral, o tipos específicos para detalle.

### C. Filtro de Entidad
Permite seleccionar una entidad administradora específica:
- Todas las entidades
- Departamento Nacional de Planeación (DNP)
- Ministerio de Hacienda y Crédito Público
- Ministerio de Minas y Energía
- Secretarías Técnicas de OCAD
- Otras entidades

**Funcionalidad**: Al seleccionar una entidad, las visualizaciones se filtran para mostrar solo los recursos asignados a esa entidad.

### D. Filtro de Estado de Ejecución
- **Todos**: Presupuesto asignado (independiente de ejecución)
- **Ejecutado**: Solo recursos efectivamente ejecutados
- **Pendiente**: Recursos asignados pero no ejecutados

### E. Toggle de Visualización
- **Valores absolutos**: Montos en millones de pesos
- **Valores porcentuales**: Distribución porcentual entre entidades o componentes
- **Por proyecto**: Costo promedio de seguimiento por proyecto (solo para SSEC)

## 4.4.4. Visualizaciones

### A. Indicadores Clave (KPIs)

**Presentación**: Tarjetas de métricas destacadas en la parte superior del módulo

**Métricas incluidas**:

1. **Total Funcionamiento y SSEC del Bienio**
   - Valor: Suma de administración + SSEC
   - Formato: "$XXX.XXX millones"
   - Comparación: Variación % respecto al bienio anterior

2. **Recursos de Administración**
   - Valor: Total asignado para funcionamiento del SGR
   - Formato: "$XXX.XXX millones"
   - Participación: % del total de funcionamiento

3. **Recursos del SSEC**
   - Valor: Total asignado para seguimiento, evaluación y control
   - Formato: "$XXX.XXX millones"
   - Participación: % del total de funcionamiento

4. **% sobre Total SGR**
   - Valor: (Funcionamiento + SSEC) / Total Recaudo SGR × 100
   - Formato: "X.XX%"
   - Indicador: Nivel de eficiencia administrativa
   - Benchmark: Generalmente <3% del total SGR

5. **Ejecución Presupuestal**
   - Valor: % de ejecución de recursos de funcionamiento
   - Formato: "XX.X%"
   - Visualización: Medidor tipo gauge

6. **Proyectos Monitoreados (SSEC)**
   - Valor: Número de proyectos bajo seguimiento
   - Formato: "X,XXX proyectos"
   - Métrica derivada: Costo promedio de seguimiento por proyecto

![Indicadores Clave de Funcionamiento SSEC](../assets/screenshots/sgr-funcionamiento-kpis.png)
*Indicadores clave de recursos de funcionamiento y SSEC*

### B. Gráfico de Barras - Distribución por Entidad

**Tipo**: Gráfico de barras horizontales agrupadas

**Descripción**: Muestra la distribución de recursos de funcionamiento entre las principales entidades administradoras.

**Elementos visuales**:
- **Eje Y**: Nombres de entidades (DNP, MHCP, MME, Secretarías Técnicas, Otras)
- **Eje X**: Valores en millones de pesos
- **Barras agrupadas**: Administración (azul) y SSEC (verde) por entidad
- **Etiquetas**: Valores exactos al final de cada barra

**Interactividad**:
- Hover muestra detalle: "DNP: Administración $45,678 M | SSEC $23,456 M | Total $69,134 M"
- Clic en entidad muestra desagregación por concepto de gasto

**Interpretación**:
- Identifica qué entidades reciben más recursos para funcionamiento
- Permite comparar la distribución entre administración operativa y SSEC
- Útil para análisis de eficiencia por entidad

![Gráfico de Distribución por Entidad](../assets/screenshots/sgr-funcionamiento-entidades.png)
*Distribución de recursos de funcionamiento por entidad administradora*

### C. Gráfico de Dona - Composición de Recursos de Funcionamiento

**Tipo**: Gráfico de dona (doughnut) con centro informativo

**Descripción**: Muestra la distribución porcentual entre Administración y SSEC.

**Elementos visuales**:
- **Segmento azul**: Recursos de Administración
- **Segmento verde**: Recursos del SSEC
- **Centro del gráfico**: Total de funcionamiento y % del SGR
- **Leyenda**: Tipo de recurso, valor y porcentaje

**Interactividad**:
- Hover muestra: "Administración: $123,456 M (60.5%)"
- Clic en segmento filtra las demás visualizaciones para ese tipo

**Interpretación**:
- Identifica la proporción relativa entre administración y control
- Permite evaluar si los recursos de seguimiento son adecuados
- Útil para análisis de balance entre operación y monitoreo

![Gráfico de Composición de Recursos](../assets/screenshots/sgr-funcionamiento-composicion.png)
*Composición de recursos entre Administración y SSEC*

### D. Tabla Detallada - Recursos de Funcionamiento por Entidad

**Tipo**: TreeTable de PrimeNG con estructura jerárquica

**Descripción**: Presenta el detalle completo de los recursos de funcionamiento con capacidad de expansión por entidad y concepto de gasto.

**Columnas (Nivel Entidad)**:
1. **Entidad**: Nombre de la entidad administradora (expandible)
2. **Administración**: Recursos para funcionamiento operativo
3. **SSEC**: Recursos para seguimiento, evaluación y control
4. **Total Funcionamiento**: Suma de Administración + SSEC
5. **Presupuesto Asignado**: Presupuesto inicial aprobado
6. **Presupuesto Ejecutado**: Monto efectivamente ejecutado
7. **% Ejecución**: Porcentaje de ejecución presupuestal
8. **% del Total**: Participación en el total de funcionamiento del SGR

**Estructura jerárquica (al expandir entidad)**:
- **Nivel 1**: Entidad (ej. "Departamento Nacional de Planeación")
  - **Nivel 2**: Tipo de recurso (Administración / SSEC)
    - **Nivel 3**: Concepto de gasto
      - Personal (salarios, prestaciones)
      - Contratación (servicios profesionales, consultoría)
      - Inversión en sistemas (plataformas SIPRO, SSEC, SMSCE)
      - Infraestructura y equipos
      - Capacitación y asistencia técnica
      - Otros gastos operacionales

**Funcionalidades**:
- **Ordenamiento**: Clic en encabezados para ordenar
- **Expansión/Colapso**: Botones para expandir/colapsar todos los niveles
- **Búsqueda**: Filtro rápido por entidad
- **Resaltado condicional**:
  - Ejecución ≥90%: Fondo verde claro
  - Ejecución 70-89%: Fondo amarillo claro
  - Ejecución <70%: Fondo naranja claro (baja ejecución)
- **Exportación**: Botón para descargar tabla en Excel

**Formato de valores**:
- Valores monetarios: "$XXX.XXX" millones con separador de miles
- Porcentajes: "XX.X%" con un decimal
- Estado de ejecución: Barra de progreso visual

**Fila de totales**:
- Total Nacional de Funcionamiento y SSEC
- Total Asignado, Total Ejecutado
- % Ejecución Global
- 100% como porcentaje total

![Tabla Detallada de Funcionamiento](../assets/screenshots/sgr-funcionamiento-tabla.png)
*Tabla detallada de recursos de funcionamiento por entidad*

### E. Gráfico de Evolución - Funcionamiento por Bienio

**Tipo**: Gráfico de barras apiladas (múltiples bienios)

**Descripción**: Compara los recursos de funcionamiento entre diferentes bienios.

**Elementos visuales**:
- **Eje X**: Bienios disponibles (2023-2024, 2024-2025, 2025-2026)
- **Eje Y**: Valores en millones de pesos
- **Barras apiladas**: Administración (azul) + SSEC (verde)
- **Línea**: % sobre Total SGR (eje Y secundario)

**Interactividad**:
- Hover muestra valores absolutos y porcentuales
- Clic en bienio navega a ese periodo específico

**Interpretación**:
- Identifica tendencias de crecimiento o reducción del gasto administrativo
- Permite evaluar si el % sobre total SGR se mantiene estable o crece
- Útil para análisis de eficiencia administrativa en el tiempo

![Gráfico de Evolución de Funcionamiento](../assets/screenshots/sgr-funcionamiento-evolucion.png)
*Evolución de recursos de funcionamiento por bienio*

### F. Tabla de Proyectos Monitoreados (SSEC)

**Tipo**: Tabla estática con métricas de seguimiento

**Descripción**: Presenta estadísticas sobre los proyectos bajo seguimiento del SSEC.

**Columnas**:
1. **Tipo de Proyecto**: Categoría de proyecto según asignación
2. **Número de Proyectos**: Cantidad de proyectos activos bajo seguimiento
3. **Recursos Invertidos**: Monto total de inversión en los proyectos
4. **Estado de Avance**: % promedio de avance físico
5. **Costo de Seguimiento**: Recursos del SSEC asignados para monitoreo
6. **Costo Promedio por Proyecto**: Costo SSEC / Número de proyectos

**Categorías de proyectos**:
- Proyectos de Asignaciones Directas
- Proyectos de Desarrollo Regional
- Proyectos de Inversión Local
- Proyectos de CTI
- Proyectos de Paz y Medio Ambiente
- **Total General**

**Funcionalidades**:
- Ordenamiento por cualquier columna
- Filtro por tipo de proyecto
- Exportación a Excel

**Interpretación**:
- Identifica la carga de trabajo del SSEC (número de proyectos)
- Permite evaluar si el costo de seguimiento es proporcional
- Útil para análisis de eficiencia del SSEC

![Tabla de Proyectos Monitoreados](../assets/screenshots/sgr-funcionamiento-proyectos.png)
*Estadísticas de proyectos bajo seguimiento del SSEC*

### G. Sección: Siglas y Diccionario del SGR

**Tipo**: Acordeón expandible con listado de términos

**Descripción**: Glosario de siglas y términos técnicos utilizados en el SGR.

**Organización**:
- **Siglas (orden alfabético)**: Acrónimo | Significado | Descripción breve
- **Diccionario de términos**: Término | Definición técnica

**Ejemplos de siglas incluidas**:
- **OCAD**: Órgano Colegiado de Administración y Decisión
- **SSEC**: Sistema de Seguimiento, Evaluación y Control
- **SIPRO**: Sistema de Información Presupuestal
- **SMSCE**: Sistema de Monitoreo, Seguimiento, Control y Evaluación
- **PBC**: Plan Bienal de Caja
- **IAC**: Ingresos de la Anualidad Corriente
- **CTI**: Ciencia, Tecnología e Innovación
- **FONPET**: Fondo Nacional de Pensiones de las Entidades Territoriales
- **DNP**: Departamento Nacional de Planeación
- **MHCP**: Ministerio de Hacienda y Crédito Público
- **MME**: Ministerio de Minas y Energía

**Funcionalidades**:
- Búsqueda rápida de siglas o términos
- Exportación del diccionario completo en PDF
- Vínculos a normativa relacionada cuando aplica

**Utilidad**:
- Facilita la comprensión de documentos técnicos del SGR
- Apoya a nuevos usuarios del sistema
- Referencia rápida para elaboración de informes

![Sección de Siglas y Diccionario](../assets/screenshots/sgr-funcionamiento-diccionario.png)
*Diccionario de siglas y términos del SGR*

## 4.4.5. Funcionalidad de Descarga

### A. Descarga de Gráficos
**Botón**: "Descargar Gráfico"
**Formatos disponibles**:
- PNG (alta resolución, 300 DPI)
- JPEG
- PDF

**Contenido**: Gráfico seleccionado con título, leyenda, bienio y fuente.

### B. Descarga de Datos en Excel
**Botón**: "Exportar a Excel"
**Contenido del archivo**:

**Hoja 1: Recursos por Entidad**
- Detalle de administración y SSEC por entidad
- Presupuesto asignado vs ejecutado
- % de ejecución y participación

**Hoja 2: Conceptos de Gasto**
- Desagregación detallada por concepto (personal, contratación, sistemas, etc.)
- Subtotales por entidad
- Total general

**Hoja 3: Proyectos Monitoreados**
- Estadísticas de proyectos bajo seguimiento del SSEC
- Costo de seguimiento por tipo de proyecto
- Indicadores de eficiencia

**Hoja 4: Evolución Temporal**
- Comparación de funcionamiento entre bienios
- Tendencias de crecimiento
- % sobre total SGR por bienio

**Hoja 5: Resumen Ejecutivo**
- Indicadores clave del bienio
- Total funcionamiento, % sobre SGR, ejecución presupuestal
- Gráficos automáticos

**Hoja 6: Siglas y Diccionario**
- Listado completo de siglas del SGR
- Definiciones técnicas
- Referencia normativa

**Hoja 7: Metadatos**
- Fecha de generación del reporte
- Bienio consultado
- Filtros aplicados
- Fuente de datos

**Formato del archivo**:
- Nombre: "SGR_Funcionamiento_SSEC_[Bienio]_[Fecha].xlsx"
- Encabezados en negrilla, fondo azul
- Filtros automáticos habilitados
- Formato de miles y moneda colombiana

### C. Descarga de Diccionario (PDF)
**Botón**: "Descargar Diccionario SGR"
**Contenido**:
1. Portada: "Diccionario de Siglas y Términos del SGR"
2. Índice alfabético
3. Listado completo de siglas con significado y descripción
4. Glosario de términos técnicos
5. Referencias normativas
6. Diagrama organizacional del SGR
7. Fecha de actualización

**Formato**: Documento de 15-20 páginas, formato carta, con marca de agua de SICODIS.

### D. Descarga de Informe Completo (PDF)
**Botón**: "Generar Informe PDF"
**Contenido**:
1. Portada con título, bienio y fecha
2. Resumen ejecutivo con indicadores clave
3. Gráfico de distribución por entidad
4. Gráfico de composición administración vs SSEC
5. Tabla de recursos por entidad (resumida)
6. Gráfico de evolución por bienio
7. Tabla de proyectos monitoreados
8. Análisis de eficiencia administrativa
9. Conclusiones
10. Anexo: Diccionario de siglas
11. Fuente de datos y fecha de corte

**Formato**: Documento de 12-15 páginas, formato carta.

## 4.4.6. Interpretación Técnica

### A. Origen de los Recursos de Funcionamiento

**Base legal**: Decreto Ley 1949 de 2023 y normativa complementaria.

**Financiación**: Los recursos de funcionamiento provienen de un porcentaje del recaudo total del SGR destinado específicamente a:
1. **Administración del sistema**: Operación de entidades responsables (DNP, MHCP, MME)
2. **SSEC**: Seguimiento, evaluación y control de proyectos

**Límite máximo**: La normativa establece un tope máximo de recursos que pueden destinarse a funcionamiento (generalmente alrededor del 3% del total del SGR).

### B. Componentes del SSEC

**Sistema de Seguimiento, Evaluación y Control (SSEC)** comprende:

1. **Seguimiento a proyectos**:
   - Monitoreo del avance físico y financiero
   - Verificación de cumplimiento de cronogramas
   - Identificación de riesgos y alertas tempranas

2. **Evaluación de impacto**:
   - Evaluación de resultados de proyectos terminados
   - Medición de impacto socioeconómico
   - Lecciones aprendidas y buenas prácticas

3. **Control y fiscalización**:
   - Verificación de uso adecuado de recursos
   - Detección de irregularidades
   - Apoyo a órganos de control

4. **Plataformas tecnológicas**:
   - **SIPRO**: Sistema de Información Presupuestal del SGR
   - **SSEC**: Plataforma de seguimiento a proyectos
   - **SMSCE**: Sistema de Monitoreo, Seguimiento, Control y Evaluación
   - **MapaRegalías**: Visualización geográfica de proyectos

5. **Capacitación y asistencia técnica**:
   - Capacitación a entidades territoriales en formulación y ejecución de proyectos
   - Asistencia técnica para fortalecimiento institucional
   - Manuales, guías y herramientas metodológicas

### C. Entidades Administradoras y sus Roles

**Departamento Nacional de Planeación (DNP)**:
- Dirección General del Sistema General de Regalías
- Coordinación de OCAD nacionales (CTI, Paz)
- Administración de plataformas tecnológicas (SIPRO, SSEC)
- Elaboración del Plan Bienal de Caja
- Capacitación y asistencia técnica
- Mayor receptor de recursos de funcionamiento

**Ministerio de Hacienda y Crédito Público (MHCP)**:
- Gestión financiera del SGR
- Distribución de recursos a entidades territoriales
- Control presupuestal
- Participación en Comisión Rectora

**Ministerio de Minas y Energía (MME)**:
- Certificación de producción de recursos naturales
- Liquidación de regalías
- Fiscalización de la explotación
- Participación en Comisión Rectora

**Secretarías Técnicas de OCAD**:
- Apoyo técnico a OCAD (Departamentales, Municipales, Regionales)
- Viabilización de proyectos
- Seguimiento a proyectos aprobados en cada OCAD
- Secretaría de sesiones y actas

**Otras entidades**:
- Contraloría General de la República (fiscalización)
- Procuraduría General de la Nación (control disciplinario)
- Auditoría General de la República (auditoría)

### D. Indicadores de Eficiencia Administrativa

**% de Funcionamiento sobre Total SGR**:
- Fórmula: (Administración + SSEC) / Recaudo Total SGR × 100
- Interpretación:
  - <2%: Alta eficiencia administrativa
  - 2-3%: Eficiencia adecuada
  - >3%: Requiere revisión de costos administrativos

**Benchmark**: En sistemas de regalías internacionales, el gasto administrativo suele estar entre 1-3% del total.

**Costo de Seguimiento por Proyecto**:
- Fórmula: Recursos del SSEC / Número de Proyectos Monitoreados
- Interpretación: Menor costo por proyecto indica mayor eficiencia del SSEC
- Varía según complejidad de proyectos (grandes proyectos requieren más seguimiento)

**Ejecución Presupuestal de Funcionamiento**:
- Fórmula: Presupuesto Ejecutado / Presupuesto Asignado × 100
- Interpretación:
  - ≥90%: Buena ejecución, recursos utilizados adecuadamente
  - 70-89%: Ejecución moderada, puede indicar subejecución
  - <70%: Baja ejecución, requiere análisis de causas

### E. Importancia del SSEC para la Transparencia

El SSEC es fundamental para garantizar:
- **Transparencia**: Información pública sobre ejecución de proyectos
- **Rendición de cuentas**: Seguimiento detallado de uso de recursos
- **Eficiencia**: Detección temprana de problemas en ejecución
- **Evaluación**: Medición de impacto de proyectos de regalías
- **Aprendizaje**: Mejora continua basada en lecciones aprendidas

**Plataformas públicas**:
- MapaRegalías: https://maparegalias.sgr.gov.co
- Permite a ciudadanos consultar proyectos de regalías en su territorio
- Información sobre montos, avances, beneficiarios

## 4.4.7. Casos de Uso

### Caso de Uso 1: Verificación de Recursos de Funcionamiento del DNP
**Actor**: Oficina de Planeación del DNP

**Objetivo**: Verificar los recursos asignados al DNP para administración del SGR y operación del SSEC.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Seleccionar el bienio en curso (ej. 2025-2026)
3. En "Filtro de Entidad" seleccionar "Departamento Nacional de Planeación"
4. Revisar los indicadores de Administración y SSEC asignados al DNP
5. Expandir la tabla para ver desagregación por concepto de gasto
6. Verificar presupuesto asignado vs ejecutado
7. Revisar % de ejecución presupuestal
8. Exportar datos a Excel para planeación interna
9. Comparar con bienio anterior para identificar cambios

**Resultado**: Confirmación del presupuesto disponible para operación del DNP en el SGR.

---

### Caso de Uso 2: Análisis de Eficiencia Administrativa del SGR
**Actor**: Analista de Eficiencia del Gasto Público (Ministerio de Hacienda)

**Objetivo**: Evaluar si los recursos de funcionamiento del SGR están dentro de parámetros de eficiencia.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Seleccionar múltiples bienios para análisis comparativo
3. Revisar el indicador "% sobre Total SGR" en cada bienio
4. Verificar si el porcentaje es ≤3% (límite recomendado)
5. Analizar la evolución de recursos de funcionamiento (gráfico de evolución)
6. Comparar con el crecimiento del recaudo total del SGR
7. Calcular la relación funcionamiento/inversión
8. Exportar datos a Excel para análisis econométrico
9. Generar informe PDF con conclusiones
10. Si el % sobre total SGR es >3%, recomendar revisión de costos

**Resultado**: Evaluación de eficiencia administrativa y recomendaciones para optimización.

---

### Caso de Uso 3: Consulta de Siglas para Elaboración de Informe
**Actor**: Consultor Externo de Evaluación de Proyectos SGR

**Objetivo**: Consultar el significado de siglas del SGR para elaborar informe técnico.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Navegar a la sección "Siglas y Diccionario del SGR"
3. Buscar siglas específicas (ej. "OCAD", "PBC", "IAC")
4. Leer definiciones técnicas
5. Copiar definiciones para incluir en glosario del informe
6. Descargar el diccionario completo en PDF para referencia
7. Utilizar definiciones oficiales para garantizar precisión técnica

**Resultado**: Clarificación de terminología técnica del SGR para informe.

---

### Caso de Uso 4: Evaluación de Cobertura del SSEC
**Actor**: Dirección del SSEC (DNP)

**Objetivo**: Evaluar si los recursos del SSEC son suficientes para el número de proyectos a monitorear.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Seleccionar el bienio en curso
3. Filtrar por "SSEC" en tipo de recurso
4. Revisar el indicador "Proyectos Monitoreados"
5. Revisar la tabla de proyectos monitoreados por tipo
6. Calcular el "Costo Promedio de Seguimiento por Proyecto"
7. Comparar con bienios anteriores
8. Si el número de proyectos aumenta significativamente pero los recursos no, identificar déficit
9. Exportar datos a Excel para presentación a la Comisión Rectora
10. Proponer ajuste de recursos del SSEC si es necesario

**Resultado**: Evaluación de suficiencia de recursos del SSEC para cumplir su función.

---

### Caso de Uso 5: Auditoría de Uso de Recursos de Funcionamiento
**Actor**: Contraloría General de la República

**Objetivo**: Verificar que los recursos de funcionamiento se están ejecutando adecuadamente.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Seleccionar el bienio a auditar
3. Revisar el % de ejecución presupuestal general
4. Expandir la tabla para ver ejecución por entidad
5. Identificar entidades con ejecución <70%
6. Exportar datos completos a Excel
7. Solicitar a las entidades con baja ejecución justificación y documentación soporte
8. Verificar que los conceptos de gasto estén dentro de lo autorizado
9. Revisar si hay recursos de funcionamiento destinados a fines no autorizados
10. Generar hallazgos si se detectan irregularidades
11. Emitir informe de auditoría con recomendaciones

**Resultado**: Verificación del uso adecuado de recursos de funcionamiento del SGR.

---

### Caso de Uso 6: Transparencia para Ciudadanía
**Actor**: Ciudadano Interesado en Rendición de Cuentas

**Objetivo**: Conocer cuánto del recaudo del SGR se destina a funcionamiento administrativo.

**Pasos**:
1. Acceder al módulo "Funcionamiento SSEC"
2. Seleccionar el bienio más reciente
3. Revisar el indicador "% sobre Total SGR"
4. Entender que este porcentaje representa la proporción destinada a administración vs inversión
5. Revisar el gráfico de composición (Administración vs SSEC)
6. Descargar el diccionario de siglas para entender términos técnicos
7. Generar informe PDF para compartir con organización social
8. Usar la información en veedurías ciudadanas o espacios de participación

**Resultado**: Comprensión ciudadana del uso de recursos del SGR y participación informada.

---

## 4.4.8. Preguntas Frecuentes

**P1: ¿Qué es el SSEC?**

R: El **Sistema de Seguimiento, Evaluación y Control (SSEC)** es el conjunto de herramientas, procedimientos y recursos destinados a monitorear la ejecución de proyectos financiados con regalías, evaluar su impacto y controlar el uso adecuado de los recursos. Incluye plataformas tecnológicas como SIPRO, SSEC y MapaRegalías.

**P2: ¿Qué porcentaje del SGR se destina a funcionamiento?**

R: Generalmente entre el 2-3% del total del recaudo del SGR se destina a funcionamiento (administración + SSEC). Este porcentaje está regulado por normativa para garantizar que la mayoría de recursos se destinen a inversión, no a gastos administrativos.

**P3: ¿Qué entidad recibe más recursos de funcionamiento?**

R: Típicamente, el **Departamento Nacional de Planeación (DNP)** recibe la mayor parte de recursos de funcionamiento, ya que:
- Dirige el Sistema General de Regalías
- Administra plataformas tecnológicas (SIPRO, SSEC)
- Coordina OCAD nacionales
- Brinda capacitación y asistencia técnica a nivel nacional

**P4: ¿Los recursos del SSEC son suficientes para monitorear todos los proyectos?**

R: Depende del número de proyectos activos y su complejidad. El módulo permite calcular el "Costo Promedio de Seguimiento por Proyecto". Si este costo es muy bajo, puede indicar que el SSEC tiene recursos limitados para realizar un seguimiento profundo. Si es muy alto, puede indicar ineficiencias. El DNP evalúa periódicamente la suficiencia de estos recursos.

**P5: ¿Se pueden usar recursos de funcionamiento para proyectos de inversión?**

R: **NO**. Los recursos de funcionamiento están destinados exclusivamente a la operación del sistema (salarios, contratación, sistemas, capacitación). No pueden transferirse a proyectos de inversión. Son asignaciones con destinación específica.

**P6: ¿Qué pasa si una entidad no ejecuta sus recursos de funcionamiento?**

R: Los recursos no ejecutados pueden:
- Revertirse al SGR para redistribución
- Trasladarse al siguiente periodo con justificación
- Generar observaciones de control fiscal por deficiente gestión

Es importante que las entidades ejecuten eficientemente sus recursos de funcionamiento para cumplir con sus responsabilidades en el SGR.

**P7: ¿Cómo puedo acceder a las plataformas del SSEC?**

R: Las principales plataformas del SSEC son:
- **MapaRegalías** (pública): https://maparegalias.sgr.gov.co - Cualquier ciudadano puede consultar proyectos
- **SIPRO y SSEC** (restringidas): Requieren usuario y contraseña, se otorgan a funcionarios de entidades territoriales, OCAD y entidades ejecutoras

Para solicitar acceso a plataformas restringidas, contactar al DNP.

---

## 4.4.9. Relación con Otros Módulos

- **Presupuesto y Recaudo**: Los recursos de funcionamiento se calculan como porcentaje del recaudo total del SGR
- **Plan Bienal de Caja**: Incluye la asignación de recursos para funcionamiento y SSEC
- **Todos los módulos SGR**: El SSEC monitorea los proyectos financiados con todas las asignaciones del SGR

---

**Anterior**: [4.3. Presupuesto y Recaudo](04-03-sgr-presupuesto-recaudo.md) | **Siguiente**: [4.5. Plan de Recursos](04-05-sgr-plan-recursos.md)
