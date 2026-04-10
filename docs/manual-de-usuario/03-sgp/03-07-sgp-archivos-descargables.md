# 3.7. SGP Archivos Descargables

## Información del Documento
- **Módulo**: SGP Archivos Descargables
- **Ruta de acceso**: Disponible desde múltiples módulos SGP
- **Componente Angular**: Integrado en varios componentes SGP
- **Última actualización**: Ver [CHANGELOG.md](../CHANGELOG.md)
- **Versión**: 1.0.0

## Tabla de Contenidos
- [Propósito del Módulo](#propósito-del-módulo)
- [Archivos Disponibles](#archivos-disponibles)
- [Acceso a los Archivos](#acceso-a-los-archivos)
- [Descripción de Archivos](#descripción-de-archivos)
- [Estructura de los Archivos Excel](#estructura-de-los-archivos-excel)
- [Casos de Uso](#casos-de-uso)
- [Ver También](#ver-también)

---

## Propósito del Módulo

Esta sección documenta los **archivos descargables** disponibles en el sistema SICODIS para el módulo SGP. Estos archivos proporcionan acceso a datos completos y oficiales que no están disponibles en la interfaz web o que requieren análisis offline.

### Objetivos
- Proporcionar **acceso a datasets completos** de SGP
- Facilitar **análisis offline** en Excel u otras herramientas
- Garantizar **trazabilidad** mediante archivos oficiales
- Permitir **integración** con sistemas de información locales

### Usuarios Objetivo
- Analistas que requieren datos completos para análisis estadístico
- Funcionarios que necesitan importar datos a sistemas locales
- Investigadores en estudios cuantitativos
- Desarrolladores integrando SICODIS con otros sistemas

---

## Archivos Disponibles

### 1. Resguardos Indígenas

**Archivo**: `Resguardos Indigenas_[Vigencia].xlsx`

**Contenido**: Asignaciones directas a resguardos indígenas constituidos

**Vigencias disponibles**: 2015-2026

**Tamaño aproximado**: 800 KB - 1.2 MB

**Periodicidad de actualización**: Anual

---

### 2. Variables Certificadas

**Archivo**: `Variables Censales_[Vigencia].xlsx`

**Contenido**: Variables utilizadas en la distribución del SGP (población, NBI, matrícula, SISBEN, etc.)

**Vigencias disponibles**: 2010-2026

**Tamaño aproximado**: 2-3 MB

**Periodicidad de actualización**: Anual (marzo-abril de cada año)

---

### 3. Eficiencias Propósito General

**Archivo**: `Eficiencias Propósito General_[Vigencia].xlsx`

**Contenido**: Indicadores de eficiencia fiscal y administrativa, distribución de Propósito General

**Vigencias disponibles**: 2020-2025

**Tamaño aproximado**: 1.5-2 MB

**Periodicidad de actualización**: Anual (mayo-junio)

---

### 4. Distribuciones Completas por Sector

**Archivos**:
- `Distribucion_Educacion_[Vigencia].xlsx`
- `Distribucion_Salud_[Vigencia].xlsx`
- `Distribucion_Agua_[Vigencia].xlsx`
- `Distribucion_Proposito_General_[Vigencia].xlsx`

**Contenido**: Distribución detallada por entidad territorial de cada sector

**Vigencias disponibles**: 2015-2026

**Tamaño aproximado**: 3-5 MB cada uno

**Periodicidad de actualización**: Anual (publicados junto con decretos de distribución)

---

### 5. Serie Histórica Completa

**Archivo**: `SGP_Serie_Historica_2002-2026.xlsx`

**Contenido**: Serie histórica completa de SGP para todos los municipios (precios corrientes y constantes)

**Vigencias**: 2002-2026 (24 años)

**Tamaño aproximado**: 15-20 MB

**Periodicidad de actualización**: Anual (enero del año siguiente)

---

## Acceso a los Archivos

### Ubicaciones de Descarga

Los archivos están disponibles en varias ubicaciones del sistema:

#### 1. Desde Módulo SGP Documentos Anexos
**Ruta**: `/sgp-documentos-anexos`

**Proceso**:
1. Acceder al módulo
2. Filtrar por vigencia deseada
3. Buscar archivos de tipo "Excel"
4. Clic en botón de descarga (icono Excel)

#### 2. Desde Módulo SGP Eficiencias
**Ruta**: `/sgp-eficiencias`

**Proceso**:
1. Seleccionar vigencia
2. Ir a pestaña "Distribución PG"
3. Clic en botón "Descargar Archivo PG [Año]"

#### 3. Desde Módulo SGP Resumen
**Ruta**: `/sgp-inicio`

**Proceso**:
1. Consultar datos de una entidad
2. Clic en "Exportar a Excel" genera archivo individual
3. Link "Archivos completos" en pie de página

#### 4. Desde Sección de Ayuda
**Ruta**: Menú principal → Ayuda → Archivos Descargables

**Proceso**:
- Lista completa de archivos disponibles
- Organizado por categoría y vigencia
- Descarga directa

---

## Descripción de Archivos

### 1. Resguardos Indígenas

![Vista Previa Resguardos](../assets/sgp-archivos-resguardos.png)
*Placeholder: Captura de pantalla del archivo Excel de resguardos*

**Propósito**: Transferencias directas del SGP a resguardos indígenas constituidos legalmente.

**Base normativa**:
- Ley 715 de 2001, Artículo 83
- Decreto 1953 de 2014 (Régimen Especial Indígena)

**Contenido del archivo**:

**Hoja 1: "Resguardos 2025"**

| Código Resguardo | Departamento | Municipio | Nombre Resguardo | Población Indígena | Total SGP | Educación | Salud | Agua | Propósito General |
|------------------|--------------|-----------|------------------|--------------------|-----------|-----------| ------|------|-------------------|
| RG001 | Guainía | Inírida | Alto Río Guainía | 3,245 | 156,250,000 | 91,406,250 | 38,281,250 | 8,437,500 | 18,125,000 |
| RG002 | Vaupés | Mitú | Vaupés | 8,120 | 390,720,000 | 228,571,200 | 95,726,400 | 21,098,880 | 45,323,520 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Columnas**:
- **Código Resguardo**: Identificador único del resguardo
- **Departamento**: Departamento donde se ubica
- **Municipio**: Municipio(s) de ubicación
- **Nombre Resguardo**: Denominación oficial
- **Población Indígena**: Censo indígena
- **Total SGP**: Suma de todos los sectores
- **Educación, Salud, Agua, PG**: Asignación por sector

**Hoja 2: "Metadatos"**
```
Vigencia: 2025
Número de resguardos: 742
Población total indígena: 1,905,617
Total SGP resguardos: $1,234,567,890,000
Fuente: Ministerio del Interior - Censo Indígena
Fecha de publicación: 15-Mayo-2025
```

**Hoja 3: "Normatividad"**
- Lista de normas aplicables
- Criterios de distribución
- Contactos de entidades responsables

**Casos de uso**:
- Consejos de resguardos planificando presupuesto
- Autoridades indígenas validando transferencias
- Investigadores en estudios de equidad territorial indígena

---

### 2. Variables Certificadas

![Vista Previa Variables](../assets/sgp-archivos-variables.png)
*Placeholder: Captura de pantalla del archivo de variables certificadas*

**Propósito**: Variables oficiales utilizadas para calcular las distribuciones del SGP.

**Entidades certificadoras**:
- DANE (población, NBI)
- Ministerio de Educación (matrícula)
- Ministerio de Salud (SISBEN, afiliados)

**Contenido del archivo**:

**Hoja 1: "Población"**

| Código DANE | Departamento | Municipio | Población Total | Población Cabecera | Población Rural | % Rural |
|-------------|--------------|-----------|-----------------|--------------------|-----------------| --------|
| 05001 | Antioquia | Medellín | 2,569,007 | 2,450,000 | 119,007 | 4.6% |
| 05002 | Antioquia | Abejorral | 18,762 | 5,628 | 13,134 | 70.0% |
| ... | ... | ... | ... | ... | ... | ... |

**Hoja 2: "NBI (Necesidades Básicas Insatisfechas)"**

| Código DANE | Municipio | Población Total | Población NBI | % NBI | Vivienda | Servicios | Hacinamiento | Inasistencia | Dependencia |
|-------------|-----------|-----------------|---------------|-------|----------|-----------|--------------|--------------|-------------|
| 05001 | Medellín | 2,569,007 | 128,450 | 5.0% | 25,690 | 38,535 | 30,000 | 15,425 | 18,800 |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Hoja 3: "Matrícula Oficial"**

| Código DANE | Municipio | Matrícula Total | Preescolar | Primaria | Secundaria | Media | Adultos |
|-------------|-----------|-----------------|------------|----------|------------|-------|---------|
| 05001 | Medellín | 400,000 | 45,000 | 180,000 | 135,000 | 35,000 | 5,000 |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Hoja 4: "SISBEN y Salud"**

| Código DANE | Municipio | Población SISBEN | Afiliados Régimen Subsidiado | Cobertura | Población Salud Pública |
|-------------|-----------|------------------|------------------------------|-----------|-------------------------|
| 05001 | Medellín | 500,000 | 450,000 | 90.0% | 2,569,007 |
| ... | ... | ... | ... | ... | ... |

**Hoja 5: "Déficit Agua Potable"**

| Código DANE | Municipio | Población sin Acueducto | % sin Acueducto | Población sin Alcantarillado | % sin Alcantarillado |
|-------------|-----------|-------------------------|-----------------|------------------------------|----------------------|
| 05001 | Medellín | 25,690 | 1.0% | 38,535 | 1.5% |
| ... | ... | ... | ... | ... | ... |

**Hoja 6: "Fuentes y Metodología"**
```
FUENTES DE DATOS:

Población:
  Fuente: DANE - Proyecciones de Población
  Base: Censo Nacional 2018
  Certificación: Resolución DANE XXX de 2025
  Fecha: 31-Marzo-2025

NBI:
  Fuente: DANE - Censo 2018
  Metodología: NBI tradicional (5 componentes)
  Actualización: Solo con nuevo censo

Matrícula:
  Fuente: Ministerio de Educación Nacional
  Base: SIMAT (Sistema de Matrícula)
  Corte: 31-Octubre-2024
  Certificación: Resolución MEN XXX de 2025

SISBEN y Salud:
  Fuente: Ministerio de Salud y Protección Social
  Base: BDUA (Base de Datos Única de Afiliados)
  Corte: 31-Diciembre-2024
  Certificación: Resolución MSPS XXX de 2025
```

**Casos de uso**:
- Validar cifras usadas en distribución
- Análisis estadístico y correlaciones
- Proyecciones de población
- Estudios de cobertura en servicios

---

### 3. Eficiencias Propósito General

![Vista Previa Eficiencias](../assets/sgp-archivos-eficiencias.png)
*Placeholder: Captura de pantalla del archivo de eficiencias*

**Propósito**: Indicadores de eficiencia fiscal y administrativa que determinan el 20% del Propósito General.

**Contenido del archivo**:

**Hoja 1: "Eficiencias 2025"**

| Código DANE | Municipio | Categoría | ICLD | Gastos Func. | Eficiencia Fiscal | Cumple Ley 617 | % Gasto/ICLD | Límite 617 | Margen |
|-------------|-----------|-----------|------|--------------|-------------------|----------------|--------------|------------|--------|
| 05001 | Medellín | Especial | 1,500 B | 600 B | 85.5% | SÍ | 42.5% | 50.0% | 7.5 pp |
| 05002 | Abejorral | Sexta | 5 B | 3.8 B | 76.0% | SÍ | 76.0% | 80.0% | 4.0 pp |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Hoja 2: "Distribución Propósito General"**

| Código DANE | Municipio | Total PG | Por Población (40%) | Por Pobreza (40%) | Por Ef. Fiscal (10%) | Por Ef. Admin (10%) |
|-------------|-----------|----------|---------------------|-------------------|----------------------|---------------------|
| 05001 | Medellín | 143,209,867 | 57,283,947 | 57,283,947 | 14,320,987 | 14,320,987 |
| ... | ... | ... | ... | ... | ... | ... |

**Hoja 3: "Ranking Nacional"**

| Ranking | Código DANE | Municipio | Eficiencia Fiscal | Percentil |
|---------|-------------|-----------|-------------------|-----------|
| 1 | 11001 | Bogotá D.C. | 92.3% | 100% |
| 2 | 05001 | Medellín | 85.5% | 99.9% |
| ... | ... | ... | ... | ... |
| 1122 | XXXXX | Municipio X | 25.4% | 0.1% |

**Hoja 4: "Metodología de Cálculo"**
```
EFICIENCIA FISCAL:

Fórmula:
  EF = ((ICLD - Gastos Funcionamiento) / ICLD) × 100

Componentes ICLD:
  - Impuestos (predial, ICA, etc.)
  - Tasas y multas
  - Rentas contractuales
  - Transferencias libre inversión
  - Otros ingresos corrientes sin destinación

Gastos de Funcionamiento:
  - Gastos de personal
  - Gastos generales
  - Transferencias pagadas

LEY 617 DE 2000:

Límites por Categoría:
  Especial (> 500,000 hab): 50%
  Primera (100,001-500,000): 65%
  Segunda (50,001-100,000): 70%
  Tercera a Sexta (< 50,000): 80%

Cálculo:
  % Gasto Func. = (Gastos Funcionamiento / ICLD) × 100
  Cumple si: % Gasto Func. ≤ Límite categoría
```

**Casos de uso**:
- Secretarías de Hacienda validando cumplimiento Ley 617
- Análisis de eficiencia comparada entre municipios
- Investigación sobre factores de eficiencia fiscal
- Auditorías de control fiscal

---

### 4. Distribuciones Completas por Sector

**Ejemplo: Distribución Educación**

![Vista Previa Distribución](../assets/sgp-archivos-distribucion.png)
*Placeholder: Captura de pantalla del archivo de distribución de educación*

**Hoja 1: "Distribución Educación 2025"**

| Código DANE | Departamento | Municipio | Total Educación | Prestación Servicio | Calidad - Gratuidad | Calidad - Matrícula | Primera Infancia |
|-------------|--------------|-----------|-----------------|---------------------|---------------------|---------------------|------------------|
| 05001 | Antioquia | Medellín | 722,222,222 | 600,000,000 | 100,000,000 | 22,222,222 | 0 |
| 05002 | Antioquia | Abejorral | 5,432,100 | 4,526,750 | 754,458 | 150,892 | 0 |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Hoja 2: "Matrícula por Municipio"**

| Código DANE | Municipio | Matrícula Total | Preescolar | Primaria | Secundaria | Media | Costo por Estudiante |
|-------------|-----------|-----------------|------------|----------|------------|-------|----------------------|
| 05001 | Medellín | 400,000 | 45,000 | 180,000 | 135,000 | 35,000 | 1,500,000 |
| ... | ... | ... | ... | ... | ... | ... | ... |

**Hoja 3: "Municipios Certificados"**

Lista de municipios certificados en educación (población > 100,000 o certificados por ley).

**Hoja 4: "Metodología"**

Explicación de la fórmula de distribución de educación.

---

### 5. Serie Histórica Completa

**Propósito**: Dataset completo de 24 años de SGP para todos los municipios.

**Contenido del archivo** (estructura):

**Hoja 1: "Serie Histórica - Precios Corrientes"**

| Código DANE | Municipio | 2002 | 2003 | ... | 2025 | 2026 |
|-------------|-----------|------|------|-----|------|------|
| 05001 | Medellín | 258,000,000 | 280,000,000 | ... | 1,234,567,890 | 1,300,000,000 |
| ... | ... | ... | ... | ... | ... | ... |

**Hoja 2: "Serie Histórica - Precios Constantes 2018"**

Misma estructura, valores ajustados por inflación.

**Hoja 3: "Deflactores IPC"**

| Año | IPC Base 2018 | Deflactor |
|-----|---------------|-----------|
| 2026 | 135.2 | 1.352 |
| 2025 | 132.5 | 1.325 |
| ... | ... | ... |
| 2002 | 58.3 | 0.583 |

**Hoja 4: "Tasas de Crecimiento Anual"**

Variaciones año a año para cada municipio.

**Tamaño**: ~20 MB (archivo grande, uso para análisis avanzado)

**Casos de uso**:
- Análisis econométrico
- Proyecciones estadísticas
- Estudios de convergencia regional
- Machine learning y modelado

---

## Estructura de los Archivos Excel

### Estándares de Formato

Todos los archivos Excel del SGP siguen estos estándares:

#### 1. Encabezados
- **Fila 1**: Título del archivo
- **Fila 2**: Vigencia
- **Fila 3**: Fecha de generación
- **Fila 4**: (vacía)
- **Fila 5**: Encabezados de columnas

#### 2. Formato de Datos
- **Números**: Sin separador de miles en Excel (para facilitar importación)
- **Fechas**: Formato ISO (YYYY-MM-DD)
- **Códigos DANE**: Formato texto (con ceros a la izquierda)
- **Porcentajes**: Formato decimal (0.05 = 5%)

#### 3. Colores y Estilos
- **Encabezados**: Fondo gris, texto blanco, negrita
- **Totales**: Fondo amarillo claro, negrita
- **Datos**: Sin formato especial (facilita análisis)

#### 4. Validaciones
- Todos los archivos incluyen validación de sumas
- Filas de totales al final de cada sección
- Notas al pie explicando particularidades

### Metadatos Incluidos

Todos los archivos incluyen una hoja "Metadatos" con:

```
METADATOS DEL ARCHIVO

Nombre archivo: Distribucion_Educacion_2025.xlsx
Vigencia: 2025
Fecha de generación: 2025-12-20
Sistema origen: SICODIS (Sistema de Consultas y Distribuciones)
Entidad responsable: Departamento Nacional de Planeación (DNP)
Contacto: sicodis@dnp.gov.co
URL: https://sicodis.dnp.gov.co

DESCRIPCIÓN:
Este archivo contiene la distribución oficial del componente de
Educación del Sistema General de Participaciones (SGP) para la
vigencia 2025, conforme al Decreto XXXX de 2025.

ESTRUCTURA:
- Hoja 1: Distribución por municipio
- Hoja 2: Matrícula certificada
- Hoja 3: Municipios certificados
- Hoja 4: Metodología de cálculo
- Hoja 5: Metadatos (esta hoja)

FUENTE DE DATOS:
- Ministerio de Educación Nacional (Matrícula SIMAT)
- Decreto XXXX de 2025 (Distribución oficial)

ADVERTENCIAS:
- Los datos son preliminares hasta publicación en Diario Oficial
- Cifras sujetas a ajuste por rectificaciones de matrícula
- Para uso oficial, validar con documentos normativos

LICENCIA:
Datos abiertos del Estado Colombiano.
Libre uso con atribución a la fuente.
```

---

## Casos de Uso

### Caso 1: Funcionario Importa Datos a Sistema Local
**Escenario**: Secretaría de Planeación importa distribución SGP a su sistema ERP.

**Pasos**:
1. Descarga archivo `Distribucion_Educacion_2025.xlsx`
2. Abre archivo en Excel
3. Filtra por código DANE del municipio
4. Copia datos relevantes
5. Importa a sistema ERP local (SAP, Predis, etc.)
6. Valida que cifras coincidan
7. Genera presupuesto de ingresos del municipio

**Resultado**: Integración de datos SICODIS con sistema local

---

### Caso 2: Investigador Analiza Resguardos Indígenas
**Escenario**: Investigador estudia asignaciones a pueblos indígenas.

**Pasos**:
1. Descarga archivo `Resguardos_Indigenas_2025.xlsx`
2. Importa a software estadístico (R, SPSS, Stata)
3. Calcula estadísticas:
   - SGP promedio por resguardo
   - SGP per cápita indígena
   - Distribución geográfica
4. Compara con años anteriores (descarga serie histórica)
5. Genera mapas de asignaciones
6. Analiza equidad territorial indígena
7. Redacta paper académico

**Resultado**: Estudio cuantitativo de política pública indígena

---

### Caso 3: Auditor Valida Variables Certificadas
**Escenario**: Auditor de Contraloría valida que variables usadas sean oficiales.

**Pasos**:
1. Descarga archivo `Variables_Censales_2025.xlsx`
2. Extrae población del municipio auditado
3. Compara con:
   - Certificación del DANE (fuente primaria)
   - Resolución de certificación (Diario Oficial)
4. Valida que coincidan
5. Si hay diferencia:
   - Revisa fecha de corte
   - Verifica versión del archivo
   - Consulta con DNP
6. Documenta validación en papeles de trabajo
7. Genera hallazgo si hay inconsistencia

**Resultado**: Validación de variables con fuentes oficiales

---

### Caso 4: Desarrollador Integra API con SICODIS
**Escenario**: Desarrollador construye aplicación que consume datos de SICODIS.

**Pasos**:
1. Descarga archivos Excel de muestra
2. Analiza estructura de datos
3. Diseña modelo de base de datos local
4. Desarrolla ETL (Extract-Transform-Load):
   - Parsea Excel
   - Limpia datos
   - Importa a base de datos
5. Desarrolla API REST local
6. Frontend consume API local (más rápido que SICODIS)
7. Actualización periódica (mensual) desde SICODIS

**Resultado**: Aplicación local con datos de SICODIS

---

## Ver También

### Documentación Relacionada
- [03-02. SGP Documentos Anexos](./03-02-sgp-documentos-anexos.md) - Documentos oficiales y archivos
- [03-06. SGP Eficiencias](./03-06-sgp-eficiencias.md) - Módulo de eficiencias
- [07-04. API Reference](../07-apendices/07-04-api-reference.md) - Endpoints de descarga

### Recursos Técnicos
- **Endpoint de descarga**: `/api/sgp/descargar-archivo/{idArchivo}`
- **Método**: GET (devuelve archivo binario)
- **Response**: `HttpResponse<Blob>`

### Normatividad
- **Ley 1712 de 2014**: Transparencia y acceso a información pública
- **Decreto 103 de 2015**: Publicación de datos abiertos del Estado
- [07-03. Normatividad](../07-apendices/07-03-normatividad.md)

### Fuentes de Datos Externas
- **DANE**: https://www.dane.gov.co/ (Población, NBI)
- **Ministerio de Educación**: https://www.mineducacion.gov.co/ (Matrícula)
- **Ministerio de Salud**: https://www.minsalud.gov.co/ (SISBEN, afiliados)
- **Contaduría General**: https://www.contaduria.gov.co/ (ICLD)

### Soporte
- **Problemas de descarga**: sicodis@dnp.gov.co
- **Inconsistencias en datos**: reportar con evidencia (captura, número de fila)
- **Solicitudes especiales**: Formatos personalizados bajo solicitud

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
