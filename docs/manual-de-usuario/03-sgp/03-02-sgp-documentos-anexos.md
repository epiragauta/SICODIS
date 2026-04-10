# 3.2. SGP Documentos Anexos

## Información del Documento
- **Módulo**: SGP Documentos Anexos
- **Ruta de acceso**: `/sgp-documentos-anexos`
- **Componente Angular**: `sgp-documentos-anexos`
- **Última actualización**: Ver [CHANGELOG.md](../CHANGELOG.md)
- **Versión**: 1.0.0

## Tabla de Contenidos
- [Propósito del Módulo](#propósito-del-módulo)
- [Datos que Visualiza](#datos-que-visualiza)
- [Controles y Filtros](#controles-y-filtros)
- [Visualizaciones](#visualizaciones)
- [Funcionalidades de Exportación](#funcionalidades-de-exportación)
- [Interpretación Técnica](#interpretación-técnica)
- [Casos de Uso](#casos-de-uso)
- [Ver También](#ver-también)

---

## Propósito del Módulo

El módulo **SGP Documentos Anexos** permite consultar las distribuciones oficiales del Sistema General de Participaciones acompañadas de los **documentos fuente** que las respaldan (decretos, resoluciones, certificaciones y archivos Excel con el detalle completo de la distribución).

### Objetivos
- Proporcionar acceso a **documentos oficiales** de distribución SGP
- Permitir la **descarga de archivos Excel** con distribuciones detalladas
- Facilitar la **trazabilidad normativa** de las asignaciones
- Garantizar **transparencia** mediante acceso a fuentes primarias

### Usuarios Objetivo
- Funcionarios de planeación y presupuesto de entidades territoriales
- Auditores y controladores fiscales
- Investigadores que requieren datos oficiales con respaldo documental
- Abogados y asesores jurídicos

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API**: `/api/sgp/documentos-anexos`

**Método**: `GET /api/sgp/documentos-anexos`

**Parámetros de consulta**:
- `vigencia`: Año fiscal (2015-2026)
- `tipoDocumento`: Tipo de documento (opcional)
- `concepto`: Filtro por concepto SGP (opcional)

### Estructura de Datos

Cada registro representa un **documento oficial** asociado a una distribución:

```json
{
  "idDocumento": 1234,
  "vigencia": 2025,
  "tipoDocumento": "Decreto",
  "numeroDocumento": "1809",
  "fechaDocumento": "2025-12-20",
  "descripcion": "Distribución de Recursos SGP 2025 - Educación",
  "concepto": "Educación",
  "entidadEmisora": "Ministerio de Educación Nacional",
  "nombreArchivo": "Decreto_1809_2025_Educacion.pdf",
  "archivoExcel": "Distribucion_Educacion_2025.xlsx",
  "urlDescarga": "/api/sgp/descargar-archivo/1234",
  "urlExcel": "/api/sgp/descargar-archivo/1235"
}
```

### Tipos de Documentos Disponibles

| Tipo | Descripción | Emisor Típico |
|------|-------------|---------------|
| **Decreto** | Decreto de distribución oficial | Presidencia de la República |
| **Resolución** | Resolución de distribución | Ministerios sectoriales |
| **Certificación** | Certificación de variables | DANE, Ministerios |
| **Conpes** | Documento Conpes de distribución | DNP |
| **Excel** | Archivo con datos detallados | DNP, Ministerios |

### Conceptos Cubiertos

Los documentos se agrupan por concepto SGP:
- Educación
- Salud (Régimen Subsidiado, Salud Pública)
- Agua Potable y Saneamiento Básico
- Propósito General
- Asignaciones Especiales (Resguardos, Ribereños)

---

## Controles y Filtros

![Filtros Documentos Anexos](../assets/sgp-documentos-filtros.png)
*Placeholder: Captura de pantalla mostrando los filtros de Vigencia, Tipo de Documento y Concepto*

### Panel de Filtros

#### 1. Selector de Vigencia
**Control**: Dropdown (select)

**Valores disponibles**: 2015, 2016, 2017, ..., 2026

**Comportamiento**:
- Valor por defecto: Vigencia más reciente (2026)
- Al cambiar, filtra documentos de esa vigencia
- Actualiza contador de documentos disponibles

#### 2. Selector de Tipo de Documento
**Control**: Multi-select dropdown (PrimeNG p-multiSelect)

**Valores**:
- Decreto
- Resolución
- Certificación
- Conpes
- Excel

**Comportamiento**:
- Permite selección múltiple
- Opción "Seleccionar todos"
- Filtrado en tiempo real (sin recargar página)

#### 3. Selector de Concepto
**Control**: Dropdown con búsqueda

**Valores**:
- Todos los conceptos
- Educación
- Salud
- Agua Potable
- Propósito General
- Asignaciones Especiales

**Comportamiento**:
- Filtra documentos por concepto
- Opción "Todos" muestra todos los documentos

#### 4. Búsqueda de Texto
**Control**: Input de búsqueda (con icono de lupa)

**Funcionalidad**:
- Búsqueda en tiempo real por:
  - Número de documento
  - Descripción
  - Entidad emisora
- Búsqueda insensible a mayúsculas/minúsculas
- Botón "Limpiar" para resetear búsqueda

**Ejemplo de búsqueda**:
```
"1809" → Encuentra "Decreto 1809"
"educación" → Encuentra todos los documentos de educación
"DANE" → Encuentra certificaciones del DANE
```

---

## Visualizaciones

### 1. Tabla de Documentos

**Componente**: PrimeNG Table (p-table)

![Tabla Documentos](../assets/sgp-documentos-tabla.png)
*Placeholder: Captura de pantalla de la tabla de documentos con columnas y acciones*

**Configuración de tabla**:
- **Paginación**: 20 documentos por página
- **Ordenamiento**: Por columna (clic en encabezado)
- **Filtros por columna**: Disponibles
- **Selección**: Checkboxes para selección múltiple

**Columnas**:

| Columna | Descripción | Ancho | Ordenable | Filtrable |
|---------|-------------|-------|-----------|-----------|
| **Vigencia** | Año fiscal | 80px | Sí | Sí |
| **Tipo** | Tipo de documento | 100px | Sí | Sí |
| **N° Documento** | Número oficial | 120px | Sí | Sí |
| **Fecha** | Fecha de emisión | 100px | Sí | Sí |
| **Concepto** | Concepto SGP | 150px | Sí | Sí |
| **Descripción** | Descripción breve | Auto | No | Sí |
| **Acciones** | Botones de descarga | 150px | No | No |

**Ejemplo de datos visualizados**:

```
┌──────┬───────────┬─────────┬────────────┬───────────┬──────────────────────────────┬──────────┐
│ Vig. │ Tipo      │ N° Doc  │ Fecha      │ Concepto  │ Descripción                  │ Acciones │
├──────┼───────────┼─────────┼────────────┼───────────┼──────────────────────────────┼──────────┤
│ 2025 │ Decreto   │ 1809    │ 2025-12-20 │ Educación │ Distribución SGP Educación   │ [PDF] [XLS] │
│ 2025 │ Resolución│ 2456    │ 2025-11-15 │ Salud     │ Régimen Subsidiado 2025      │ [PDF] [XLS] │
│ 2025 │ Certificac│ 345     │ 2025-03-10 │ Todos     │ Población DANE 2025          │ [PDF]       │
│ 2024 │ Decreto   │ 2227    │ 2024-12-18 │ Educación │ Distribución SGP Educación   │ [PDF] [XLS] │
└──────┴───────────┴─────────┴────────────┴───────────┴──────────────────────────────┴──────────┘
```

### 2. Indicadores de Resumen

**Ubicación**: Encima de la tabla

![Indicadores Documentos](../assets/sgp-documentos-indicadores.png)
*Placeholder: Tarjetas con estadísticas de documentos*

**Indicadores mostrados**:

#### Card 1: Total Documentos
```
┌──────────────────────────────────┐
│  📄 Total Documentos             │
│                                  │
│  1,245 documentos                │
│  Vigencias 2015-2026             │
└──────────────────────────────────┘
```

#### Card 2: Documentos de la Vigencia Seleccionada
```
┌──────────────────────────────────┐
│  📅 Vigencia 2025                │
│                                  │
│  128 documentos                  │
│  Última actualización: 15-Ene    │
└──────────────────────────────────┘
```

#### Card 3: Archivos Excel Disponibles
```
┌──────────────────────────────────┐
│  📊 Archivos Excel               │
│                                  │
│  64 archivos .xlsx               │
│  Descargas disponibles           │
└──────────────────────────────────┘
```

### 3. Vista Detalle de Documento (Modal)

**Activación**: Clic en descripción del documento

![Modal Detalle](../assets/sgp-documentos-modal.png)
*Placeholder: Ventana modal mostrando información detallada del documento*

**Información mostrada**:
- **Encabezado**:
  - Tipo y número de documento
  - Fecha de emisión
  - Entidad emisora
- **Contenido**:
  - Descripción completa
  - Concepto asociado
  - Vigencia aplicable
  - Extracto del documento (si disponible)
- **Acciones**:
  - Botón "Descargar PDF"
  - Botón "Descargar Excel" (si aplica)
  - Botón "Ver en línea" (si es PDF)
  - Botón "Cerrar"

---

## Funcionalidades de Exportación

### 1. Descargar Documento PDF

**Botón**: Icono de PDF en columna "Acciones"

**Funcionalidad**:
- Descarga el documento oficial en formato PDF
- Abre en nueva pestaña (opción de visualización en línea)
- Nombre de archivo descriptivo

**Implementación técnica**:
```typescript
downloadPDF(idDocumento: number) {
  this.sicodisApiService.getSgpDescargarArchivo(idDocumento).subscribe({
    next: (response: HttpResponse<Blob>) => {
      const blob = response.body;
      const filename = this.extractFilename(response.headers) ||
                       `Documento_${idDocumento}.pdf`;

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    },
    error: (error) => {
      console.error('Error al descargar:', error);
      this.mostrarMensajeError('No se pudo descargar el documento');
    }
  });
}
```

**Nombre de archivo generado**:
```
Decreto_1809_2025_Educacion.pdf
Resolucion_2456_2025_Salud_Regimen_Subsidiado.pdf
Certificacion_DANE_Poblacion_2025.pdf
```

### 2. Descargar Archivo Excel

**Botón**: Icono de Excel en columna "Acciones" (si disponible)

**Funcionalidad**:
- Descarga archivo `.xlsx` con distribución detallada
- Contiene datos a nivel de entidad territorial
- Incluye metadatos (fecha, fuente, vigencia)

**Contenido típico del Excel**:

**Hoja 1: "Distribución"**
| Código DANE | Departamento | Municipio | Concepto | Valor Asignado |
|-------------|--------------|-----------|----------|----------------|
| 05001 | Antioquia | Medellín | Educación - Prestación | 722,222,222 |
| 05002 | Antioquia | Abejorral | Educación - Prestación | 12,345,678 |

**Hoja 2: "Metadatos"**
```
Vigencia: 2025
Tipo de documento: Decreto
Número: 1809
Fecha de emisión: 2025-12-20
Entidad emisora: Ministerio de Educación Nacional
Fecha de descarga: 2026-04-09 14:30:00
Usuario: Anónimo
```

### 3. Exportar Listado de Documentos

**Botón**: "Exportar Listado" (esquina superior derecha)

**Opciones**:
- **CSV**: Lista de documentos en formato CSV
- **Excel**: Tabla de documentos con formato
- **PDF**: Reporte imprimible

**Contenido exportado**:
- Todos los documentos visibles según filtros aplicados
- Columnas: Vigencia, Tipo, N° Documento, Fecha, Concepto, Descripción
- Totales por tipo de documento

### 4. Descarga Múltiple

**Funcionalidad**: Seleccionar múltiples documentos y descargar en lote

**Proceso**:
1. Usuario marca checkboxes de documentos deseados
2. Clic en botón "Descargar seleccionados"
3. Sistema crea archivo ZIP con todos los documentos
4. Se descarga archivo `Documentos_SGP_[Fecha].zip`

**Limitaciones**:
- Máximo 50 documentos por descarga
- Tamaño máximo: 500 MB

---

## Interpretación Técnica

### Jerarquía Normativa de Documentos

Los documentos tienen un orden jerárquico legal:

1. **Constitución Política** (no descargable, referencia)
2. **Actos Legislativos** (reformas constitucionales)
3. **Leyes** (715/01, 1176/07, etc.)
4. **Decretos** - **MAYOR AUTORIDAD** para distribuciones anuales
5. **Resoluciones** - Detallan distribuciones sectoriales
6. **Certificaciones** - Variables técnicas (población, NBI, etc.)

**Ejemplo de jerarquía para Educación 2025**:
```
Constitución Art. 356
  ↓
Ley 715 de 2001
  ↓
Decreto 1809 de 2025 → DOCUMENTO OFICIAL DE DISTRIBUCIÓN
  ↓
Resolución MEN 2345 de 2025 → Detalle de asignación por municipio
  ↓
Excel: Distribucion_Educacion_2025.xlsx → Datos tabulados
```

### Trazabilidad de Distribuciones

Para validar una distribución:

1. **Consultar Decreto oficial**: Contiene cifras totales por sector
2. **Descargar Excel asociado**: Detalle por entidad territorial
3. **Cruzar con módulo SGP Resumen**: Validar cifras en SICODIS
4. **Revisar certificaciones**: Validar variables usadas (población, NBI, etc.)

### Fechas de Publicación

**Cronograma típico de publicación anual**:

| Mes | Documento | Responsable |
|-----|-----------|-------------|
| Enero-Febrero | Certificaciones de variables (población, SISBEN) | DANE, MSPS |
| Marzo | Documento Conpes de distribución | DNP |
| Abril | Decreto de distribución SGP | Presidencia |
| Mayo-Junio | Resoluciones sectoriales (detalle) | Ministerios |
| Diciembre | Decreto de última doceava | Presidencia |

### Validación de Archivos

**Checksums**: Los archivos PDF y Excel incluyen metadatos de validación.

**Verificación de autenticidad**:
1. Comparar número de documento con Diario Oficial (para decretos)
2. Validar firma digital (si aplica)
3. Contrastar con fuente oficial (sitio web del ministerio emisor)

---

## Casos de Uso

### Caso 1: Auditor Valida Distribución
**Escenario**: Un auditor de la Contraloría necesita validar la distribución de Educación 2025 para un municipio.

**Pasos**:
1. Accede al módulo SGP Documentos Anexos
2. Filtra:
   - Vigencia: 2025
   - Concepto: Educación
   - Tipo: Decreto
3. Identifica el Decreto 1809 de 2025
4. Descarga el PDF del decreto
5. Descarga el Excel asociado
6. Busca el municipio en el Excel
7. Compara cifra con reporte del municipio
8. Si hay diferencia, reporta hallazgo de auditoría

**Resultado**: Validación documentada con respaldo normativo

### Caso 2: Investigador Analiza Serie Histórica de Normatividad
**Escenario**: Un investigador estudia la evolución de criterios de distribución del SGP.

**Pasos**:
1. Filtra tipo de documento: "Decreto"
2. Selecciona vigencias: 2015-2025 (todas)
3. Exporta listado a Excel
4. Descarga decretos de cada año
5. Analiza cambios en fórmulas de distribución
6. Documenta evolución normativa

**Resultado**: Serie histórica de normatividad para análisis académico

### Caso 3: Funcionario Descarga Datos para Presupuesto
**Escenario**: Funcionario de planeación municipal necesita datos oficiales para elaborar presupuesto.

**Pasos**:
1. Filtra vigencia actual (2026)
2. Descarga todos los archivos Excel disponibles:
   - Educación
   - Salud
   - Agua Potable
   - Propósito General
3. Busca su municipio en cada Excel
4. Consolida cifras en plantilla presupuestal
5. Valida que coincidan con módulo SGP Resumen
6. Genera documento de soporte para presupuesto

**Resultado**: Presupuesto municipal respaldado por fuentes oficiales

### Caso 4: Abogado Consulta Normatividad para Demanda
**Escenario**: Un abogado necesita documentos oficiales para una acción legal sobre distribución de recursos.

**Pasos**:
1. Filtra vigencia del conflicto (ej: 2024)
2. Descarga decreto de distribución
3. Descarga resolución del ministerio sectorial
4. Descarga certificaciones de variables (DANE)
5. Revisa modal de detalle para extractos relevantes
6. Imprime documentos para anexar a demanda

**Resultado**: Documentación oficial para proceso judicial

---

## Ver También

### Documentación Relacionada
- [03-01. SGP Resumen](./03-01-sgp-resumen.md) - Validar cifras de distribución
- [03-03. SGP Detalle Presupuestal](./03-03-sgp-detalle-presupuestal.md) - Detalle de doceavas mensuales
- [03-07. SGP Archivos Descargables](./03-07-sgp-archivos-descargables.md) - Otros archivos de consulta

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-documentos-anexos/`
- **Servicio API**: `sicodisApiService.getSgpDocumentosAnexos()`
- **Descarga**: `sicodisApiService.getSgpDescargarArchivo(idDocumento)`

### Normatividad
- [07-03. Normatividad](../07-apendices/07-03-normatividad.md) - Listado completo de leyes y decretos
- Diario Oficial: https://diariooficial.imprenta.gov.co/
- DNP - Distribuciones SGP: https://www.dnp.gov.co/

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
