# 3.3. SGP Detalle Presupuestal

## Información del Documento
- **Módulo**: SGP Detalle Presupuestal
- **Ruta de acceso**: `/sgp-detalle-presupuestal`
- **Componente Angular**: `sgp-detalle-presupuestal`
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

El módulo **SGP Detalle Presupuestal** permite consultar el **detalle mensual de las transferencias** del Sistema General de Participaciones, mostrando la distribución en **doceavas** (cuotas mensuales de 1/12 del total anual) y permitiendo el seguimiento de la ejecución presupuestal mes a mes.

### Objetivos
- Mostrar el **desglose mensual** de transferencias SGP (doceavas)
- Facilitar el **seguimiento de giros** recibidos durante el año
- Permitir **comparación entre vigencias** en detalle mensual
- Proporcionar **trazabilidad de ajustes** y última doceava

### Usuarios Objetivo
- Tesoreros y funcionarios de presupuesto de entidades territoriales
- Contadores públicos y auditores
- Secretarías de Hacienda municipales y departamentales
- Interventores de proyectos financiados con SGP

---

## Datos que Visualiza

### Origen de Datos
**Endpoint API**: `/api/sgp/detalle-presupuestal`

**Método**: `GET /api/sgp/detalle-presupuestal`

**Parámetros**:
```typescript
{
  anio: number,           // Vigencia (2015-2026)
  codigoDepto: string,    // Código DANE departamento
  codigoMunicipio: string // Código DANE municipio
}
```

### Estructura de Datos

Cada registro contiene el detalle de una doceava:

```json
{
  "vigencia": 2025,
  "entidad": "Medellín",
  "codigoDane": "05001",
  "concepto": "Educación - Prestación del Servicio",
  "totalAnual": 722222222,
  "doceavas": [
    {
      "mes": "Enero",
      "numeroDoceava": 1,
      "valorDoceava": 60185185,
      "fechaGiro": "2025-01-10",
      "acumulado": 60185185,
      "porcentajeAcumulado": 8.33
    },
    // ... 11 doceavas más
    {
      "mes": "Diciembre",
      "numeroDoceava": 12,
      "valorDoceava": 60185185,
      "esUltimaDoceava": true,
      "vigenciaUltimaDoceava": 2024,
      "fechaGiro": "2025-12-15",
      "acumulado": 722222220,
      "porcentajeAcumulado": 100
    }
  ]
}
```

### Conceptos Disponibles

El detalle presupuestal se muestra para cada concepto SGP:

**Educación**:
- Prestación del Servicio
- Calidad - Gratuidad
- Calidad - Matrícula Oficial

**Salud**:
- Régimen Subsidiado - Continuidad
- Régimen Subsidiado - Ampliación
- Salud Pública

**Agua Potable y Saneamiento Básico**:
- Agua Potable
- Saneamiento Básico

**Propósito General**:
- Libre Inversión
- Forzosa Inversión (Deporte, Cultura, etc.)

---

## Controles y Filtros

![Filtros Detalle Presupuestal](../assets/sgp-detalle-filtros.png)
*Placeholder: Captura de pantalla de los controles de filtrado*

### Panel de Filtros

#### 1. Selector de Vigencia
**Control**: Dropdown

**Valores**: 2015, 2016, ..., 2026

**Comportamiento**:
- Valor por defecto: Año actual (2026)
- Al cambiar, recarga doceavas de esa vigencia
- Habilita comparación de vigencias

#### 2. Selector de Departamento
**Control**: Dropdown con búsqueda

**Valores**: 33 departamentos (incluye Bogotá D.C.)

**Comportamiento**:
- Ordena alfabéticamente
- Al seleccionar, carga municipios del departamento
- Opción "Consolidado departamental" (código 000)

#### 3. Selector de Municipio
**Control**: Dropdown filtrable

**Valores**: Municipios del departamento seleccionado

**Comportamiento**:
- Deshabilitado hasta seleccionar departamento
- Búsqueda incremental
- Muestra código DANE + nombre

#### 4. Selector de Concepto SGP
**Control**: Multi-select dropdown

**Valores**:
- Todos los conceptos
- Educación (con sub-conceptos)
- Salud (con sub-conceptos)
- Agua Potable
- Propósito General (con sub-conceptos)

**Comportamiento**:
- Permite selección múltiple
- Opción "Seleccionar todos"
- Cada concepto seleccionado genera una fila en la tabla

#### 5. Comparador de Vigencias
**Control**: Checkbox + Dropdown adicional

**Funcionalidad**:
- Checkbox "Comparar con otra vigencia"
- Al activar, habilita segundo selector de año
- Muestra columnas adicionales con diferencias

**Ejemplo de comparación**:
```
Concepto: Educación
Vigencia 1: 2025 → $722,222,222
Vigencia 2: 2024 → $700,000,000
Diferencia: +$22,222,222 (+3.17%)
```

---

## Visualizaciones

### 1. Tabla de Doceavas Mensuales

**Componente**: PrimeNG Table con scroll horizontal

![Tabla Doceavas](../assets/sgp-detalle-tabla.png)
*Placeholder: Tabla mostrando las 12 doceavas con valores mensuales*

**Estructura de columnas**:

| Concepto | Total Anual | Ene | Feb | Mar | Abr | May | Jun | Jul | Ago | Sep | Oct | Nov | Dic (Última) | Total |
|----------|-------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|--------------|-------|
| Educación - Prestación | $722M | $60M | $60M | $60M | ... | $60M | $60M* | $722M |

**Formato de celdas**:
- **Valor regular**: Color negro, formato `$60,185,185`
- **Última doceava**: Color azul, formato `$60,185,185*`
- **Ajuste**: Color naranja (si hay diferencia con 1/12)
- **Total anual**: Negrita, fondo gris claro

**Indicadores visuales**:
- **Asterisco (*)**: Última doceava (corresponde a vigencia anterior)
- **Celda destacada**: Mes actual (borde verde)
- **Tooltip**: Al pasar el mouse, muestra:
  - Fecha de giro
  - Porcentaje del total anual
  - Acumulado hasta ese mes

**Ejemplo de tooltip**:
```
┌──────────────────────────────┐
│ Enero 2025                   │
│ Valor: $60,185,185           │
│ Fecha giro: 10-Ene-2025      │
│ % del total: 8.33%           │
│ Acumulado: $60,185,185       │
└──────────────────────────────┘
```

### 2. Gráfico de Evolución Mensual

**Tipo**: Gráfico de líneas (Line Chart)

**Librería**: Chart.js

![Gráfico Evolución](../assets/sgp-detalle-grafico.png)
*Placeholder: Gráfico de líneas mostrando la evolución mensual de las doceavas*

**Configuración**:
```javascript
{
  type: 'line',
  data: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
             'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Doceavas 2025',
        data: [60185185, 60185185, 60185185, ...],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.1
      },
      {
        label: 'Acumulado 2025',
        data: [60185185, 120370370, 180555555, ...],
        borderColor: '#2196F3',
        borderDash: [5, 5],
        fill: false
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        ticks: {
          callback: (value) => '$' + value.toLocaleString('es-CO')
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            return context.dataset.label + ': $' +
                   context.parsed.y.toLocaleString('es-CO');
          }
        }
      }
    }
  }
}
```

**Características**:
- **Línea sólida**: Valor de cada doceava
- **Línea punteada**: Acumulado progresivo
- **Marcador especial**: Última doceava (punto rojo)
- **Área sombreada**: Bajo la línea de doceavas

### 3. Indicadores Resumen

![Indicadores Presupuesto](../assets/sgp-detalle-indicadores.png)
*Placeholder: Tarjetas con indicadores de ejecución presupuestal*

#### Card 1: Total Anual Asignado
```
┌──────────────────────────────────┐
│  💰 Total Anual                  │
│                                  │
│  $722,222,222                    │
│  Educación - Prestación          │
└──────────────────────────────────┘
```

#### Card 2: Doceavas Giradas (Acumulado)
```
┌──────────────────────────────────┐
│  📊 Acumulado Girado             │
│                                  │
│  $481,481,480 (66.67%)           │
│  8 doceavas a Agosto 2026        │
└──────────────────────────────────┘
```

#### Card 3: Promedio Mensual
```
┌──────────────────────────────────┐
│  📈 Promedio Mensual             │
│                                  │
│  $60,185,185                     │
│  (1/12 del total anual)          │
└──────────────────────────────────┘
```

#### Card 4: Próxima Doceava
```
┌──────────────────────────────────┐
│  📅 Próxima Doceava              │
│                                  │
│  Septiembre 2026                 │
│  Giro estimado: 10-Sep-2026      │
└──────────────────────────────────┘
```

### 4. Vista de Comparación de Vigencias

**Activación**: Al marcar "Comparar con otra vigencia"

![Comparación Vigencias](../assets/sgp-detalle-comparacion.png)
*Placeholder: Tabla comparativa entre dos vigencias*

**Tabla extendida**:

| Mes | 2025 | 2024 | Diferencia | Δ% |
|-----|------|------|------------|-----|
| Ene | $60,185,185 | $58,333,333 | +$1,851,852 | +3.17% |
| Feb | $60,185,185 | $58,333,333 | +$1,851,852 | +3.17% |
| ... | ... | ... | ... | ... |
| Dic | $60,185,185* | $58,333,333* | +$1,851,852 | +3.17% |
| **TOTAL** | **$722,222,222** | **$700,000,000** | **+$22,222,222** | **+3.17%** |

**Código de colores**:
- **Verde**: Incremento respecto a año anterior
- **Rojo**: Disminución respecto a año anterior
- **Gris**: Sin cambio

---

## Funcionalidades de Exportación

### 1. Exportar a Excel (Detallado)

**Botón**: "Descargar Excel Detallado"

**Contenido del archivo**:

**Hoja 1: "Doceavas Mensuales"**
```
Entidad: Medellín (05001)
Vigencia: 2025
Concepto: Educación - Prestación del Servicio

Mes | N° Doceava | Valor | Fecha Giro | Acumulado | % Acum | Observaciones
----|------------|-------|------------|-----------|--------|---------------
Ene | 1 | 60,185,185 | 10-Ene-25 | 60,185,185 | 8.33% | -
Feb | 2 | 60,185,185 | 10-Feb-25 | 120,370,370 | 16.67% | -
...
Dic | 12* | 60,185,185 | 15-Dic-25 | 722,222,220 | 100% | Última doceava (vigencia 2024)
```

**Hoja 2: "Resumen por Concepto"**
- Total anual por concepto
- Promedio mensual
- Doceavas giradas vs pendientes

**Hoja 3: "Metadatos"**
- Vigencia, entidad, fecha de consulta
- Fuente de datos
- Usuario que generó el reporte

### 2. Exportar a PDF (Reporte Oficial)

**Botón**: "Generar Reporte PDF"

**Contenido**:
- **Encabezado**: Logo DNP, título, vigencia
- **Datos de entidad**: Nombre, código DANE
- **Tabla de doceavas**: Formato de impresión
- **Gráfico**: Evolución mensual
- **Firmas**: Espacio para firma del funcionario

**Orientación**: Horizontal (landscape) para mejor visualización de tabla

### 3. Copiar al Portapapeles

**Botón**: "Copiar Tabla"

**Formato**: TSV (Tab-Separated Values)

**Uso típico**: Pegar en Excel para análisis rápido

---

## Interpretación Técnica

### Sistema de Doceavas

El SGP se transfiere en **12 cuotas mensuales** llamadas "doceavas":

**Cálculo de una doceava regular**:
```
Doceava = Total Anual / 12

Ejemplo:
Total Educación 2025: $722,222,222
Doceava mensual = $722,222,222 / 12 = $60,185,185.17
```

**Nota**: Debido a redondeos, las doceavas pueden tener pequeñas variaciones.

### Última Doceava (12ª doceava)

La **última doceava** tiene características especiales:

**Características**:
1. Se gira en **diciembre** del año en curso
2. Corresponde a la **última doceava del año ANTERIOR**
3. Es un **ajuste** de la vigencia anterior

**Ejemplo práctico**:
```
Diciembre 2025:
  Se gira la 12ª doceava de 2024 (año anterior)
  NO la 12ª doceava de 2025

Diciembre 2026:
  Se girará la 12ª doceava de 2025
```

**Razón técnica**:
- Permite ajustes finales de la distribución del año
- Compensa diferencias de redondeo
- Garantiza que se transfiera el 100% del SGP certificado

### Fechas de Giro

**Calendario típico de giros**:

| Doceava | Mes de Giro | Fecha Típica |
|---------|-------------|--------------|
| 1 | Enero | 10 de enero |
| 2 | Febrero | 10 de febrero |
| 3 | Marzo | 10 de marzo |
| ... | ... | ... |
| 11 | Noviembre | 10 de noviembre |
| 12* | Diciembre | 15 de diciembre |

**Nota**: Las fechas pueden variar según disponibilidad presupuestal de la Nación.

### Ajustes y Variaciones

**Causas de variación en doceavas**:

1. **Redondeo**: Diferencias de centavos entre doceavas
2. **Ajustes normativos**: Cambios en medio de la vigencia
3. **Certificaciones corregidas**: Variables actualizadas (ej: matrícula)
4. **Reintegros**: Devoluciones de vigencias anteriores

**Ejemplo de ajuste**:
```
Doceavas 1-11: $60,185,185 cada una
Doceava 12: $60,185,187 (ajuste de $2 por redondeo)

Total: $722,222,222 (exacto)
```

### Validación de Sumas

**Fórmula de validación**:
```
Σ (11 doceavas regulares) + Última doceava = Total Anual
```

Si la suma no cuadra, revisar:
- Ajustes normativos en medio del año
- Reintegros o adiciones presupuestales
- Errores de registro (reportar a soporte)

---

## Casos de Uso

### Caso 1: Tesorero Valida Giros Mensuales
**Escenario**: Tesorero municipal verifica que se hayan recibido todas las doceavas del año.

**Pasos**:
1. Accede al módulo SGP Detalle Presupuestal
2. Selecciona:
   - Vigencia: 2026 (año actual)
   - Municipio: Su municipio
   - Concepto: Todos
3. Revisa tabla de doceavas
4. Verifica que cada mes tenga:
   - Valor de doceava
   - Fecha de giro
   - Estado: "Girado"
5. Compara con extractos bancarios
6. Identifica doceavas pendientes o atrasadas
7. Genera reporte PDF como soporte

**Resultado**: Control de flujo de caja mensual

### Caso 2: Contador Concilia Ingresos Anuales
**Escenario**: Contador público concilia ingresos SGP al cierre del año.

**Pasos**:
1. Selecciona vigencia a conciliar (ej: 2025)
2. Descarga Excel detallado
3. Suma todas las doceavas recibidas
4. Compara con:
   - Total anual certificado en módulo SGP Resumen
   - Ingresos registrados en contabilidad
5. Identifica diferencias:
   - ¿Falta alguna doceava?
   - ¿Hay ajustes no registrados?
6. Ajusta contabilidad si es necesario
7. Genera reporte de conciliación

**Resultado**: Cierre contable validado

### Caso 3: Planeador Proyecta Ingresos Mensuales
**Escenario**: Director de planeación proyecta ingresos SGP para el año siguiente.

**Pasos**:
1. Activa comparador de vigencias
2. Selecciona:
   - Vigencia 1: 2026 (actual)
   - Vigencia 2: 2025 (anterior)
3. Analiza variaciones mensuales
4. Calcula incremento promedio: +3.17%
5. Proyecta doceavas 2027:
   - Aplica incremento esperado
   - Ajusta por inflación proyectada
6. Descarga comparación a Excel
7. Genera flujo de caja proyectado 2027

**Resultado**: Proyección presupuestal fundamentada

### Caso 4: Auditor Revisa Última Doceava
**Escenario**: Auditor externo valida que la última doceava se haya contabilizado correctamente.

**Pasos**:
1. Filtra vigencia auditada (ej: 2024)
2. Ubica la doceava 12 (última)
3. Verifica:
   - Fecha de giro: Diciembre 2024
   - Valor: Completa el total anual
   - Observación: "Última doceava"
4. Valida que se contabilizó en 2024, NO en 2025
5. Revisa extracto bancario de diciembre 2024
6. Confirma que el valor girado coincide con lo reportado
7. Documenta hallazgo en papeles de trabajo

**Resultado**: Validación de registro contable correcto

---

## Ver También

### Documentación Relacionada
- [03-01. SGP Resumen](./03-01-sgp-resumen.md) - Total anual por concepto
- [03-02. SGP Documentos Anexos](./03-02-sgp-documentos-anexos.md) - Decretos de distribución
- [03-04. SGP Comparativo](./03-04-sgp-comparativo.md) - Comparación entre municipios

### Recursos Técnicos
- **Componente**: `src/app/components/sgp-detalle-presupuestal/`
- **Servicio API**: `sicodisApiService.getSgpDetallePresupuestal()`
- **Interfaces**: `DetallePresupuestal`, `Doceava`

### Normatividad
- **Ley 715 de 2001**: Artículo 87 - Transferencia de recursos
- **Decretos de giro**: Publicados anualmente en Diario Oficial
- [07-03. Normatividad](../07-apendices/07-03-normatividad.md)

### Glosario
- **Doceava**: Cuota mensual de 1/12 del total anual
- **Última doceava**: 12ª cuota que corresponde al año anterior
- **Giro**: Transferencia efectiva de recursos a la entidad territorial

### Soporte
- **Preguntas frecuentes**: [06-02-preguntas-frecuentes.md](../06-ayuda/06-02-preguntas-frecuentes.md)
- **Reportar problemas**: sicodis@dnp.gov.co

---

*Última actualización: 2026-04-09*
*Para reportar errores o sugerencias sobre este documento, contacte a sicodis@dnp.gov.co*
