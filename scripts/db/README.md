# Scripts de Migración de Datos JSON a SQLite

Este directorio contiene los scripts para migrar los datos fiscales de archivos JSON a una base de datos SQLite normalizada.

## Archivos

- **`create_schema.sql`**: Esquema de base de datos (12 tablas + índices)
- **`migrate_data.py`**: Script principal de migración
- **`verify_data.py`**: Script de validación post-migración
- **`export_all_municipios.py`**: Exportar todos los municipios a JSON para modo mock
- **`config.py`**: Configuración de rutas y parámetros

## Requisitos

- Python 3.8 o superior
- Módulos estándar: `sqlite3`, `json`, `logging` (incluidos en Python)

## Uso

### 1. Migrar Datos

Ejecuta el script de migración para convertir los archivos JSON a SQLite:

```bash
cd scripts/db
python migrate_data.py
```

**Salida esperada:**
```
================================================================================
INICIANDO MIGRACIÓN DE DATOS JSON A SQLITE
================================================================================
INFO: Creando base de datos en: C:\ws\dnp\ws\SICODIS_WebII\src\assets\db\eficiencias.db
INFO: Creando esquema de base de datos...
INFO: Esquema creado exitosamente
INFO: Migrando ingresos_tributarios...
INFO: Leyendo archivo: C:\ws\dnp\ws\SICODIS_WebII\src\assets\data\Eficiencias_hojas\Datos_Ingresos_Tributarios.json
INFO: Archivo parseado: 1122 filas
INFO: Insertados 13464 registros en ingresos_tributarios
INFO: Migrando poblacion...
...
INFO: Metadatos actualizados. Total municipios: 1122
================================================================================
MIGRACIÓN COMPLETADA EXITOSAMENTE
Base de datos creada en: C:\ws\dnp\ws\SICODIS_WebII\src\assets\db\eficiencias.db
================================================================================
```

### 2. Validar Migración

Ejecuta el script de validación para verificar la integridad de los datos:

```bash
python verify_data.py
```

**Salida esperada:**
```
================================================================================
INICIANDO VALIDACIÓN DE DATOS MIGRADOS
================================================================================
INFO: Validando conteo de registros...
✓ Municipios: 1122 registros (OK)
✓ Ingresos tributarios: 13464 registros (OK)
✓ Población: 14586 registros (OK)
...
INFO: Validando integridad referencial...
✓ ingresos_tributarios: Integridad referencial OK
...
INFO: Generando reporte de validación...
INFO: Reporte generado en: C:\ws\dnp\ws\SICODIS_WebII\src\assets\db\eficiencias_validation_report.txt
================================================================================
VALIDACIÓN COMPLETADA EXITOSAMENTE ✓
================================================================================
```

El reporte de validación se guarda en `src/assets/db/eficiencias_validation_report.txt`.

### 3. Consultar Base de Datos (Manual)

Puedes abrir la base de datos con cualquier cliente SQLite:

```bash
# Con sqlite3 (línea de comandos)
sqlite3 ../../src/assets/db/eficiencias.db

# Comandos útiles
.tables                                  # Listar tablas
.schema municipios                       # Ver esquema de tabla
SELECT COUNT(*) FROM municipios;         # Contar municipios
SELECT * FROM municipios LIMIT 5;        # Ver primeros 5 municipios
.quit                                    # Salir
```

## Estructura de Base de Datos

### Tabla Maestra
- **`municipios`**: Catálogo de 1,122 municipios colombianos

### Series Temporales
- **`ingresos_tributarios`**: Ingresos tributarios por municipio (2013-2024)
- **`poblacion`**: Proyecciones de población (2013-2025)
- **`recursos_proposito_general`**: Once Doceavas con métricas múltiples (2018-2025)

### Ley 617 de 2000
- **`ley_617_icld`**: Ingresos Corrientes Libre Destinación (2016-2023)
- **`ley_617_gastos_funcionamiento`**: Gastos de Funcionamiento (2016-2023)
- **`ley_617_razon`**: Razón (2016-2023)
- **`ley_617_holgura`**: Holgura (2016-2023)
- **`ley_617_limite_gasto`**: Límite de Gasto vigencia 2025
- **`ley_617_vigencia_2026`**: Proyecciones para 2026

### Indicadores Ley 550
- **`indicadores_eficiencia_fiscal`**: Eficiencia Fiscal (2019-2025)
- **`indicadores_eficiencia_administrativa`**: Eficiencia Administrativa (2019-2025)

### Metadatos
- **`_metadata`**: Información de versión y fecha de migración

## Archivos Fuente

Los datos se leen desde `src/assets/data/Eficiencias_hojas/`:

1. `Datos_Ingresos_Tributarios.json` (~306KB)
2. `Datos_Poblacion.json` (~101KB)
3. `Recursos.json` (~1MB)
4. `Ef_Admin.json` (~917KB)
5. `Indicadores_Ley_550.json` (~424KB)

## Validaciones Implementadas

El script de validación verifica:

- ✓ Conteo de registros por tabla (rangos esperados)
- ✓ Integridad referencial (todas las FKs válidas)
- ✓ Rangos de años válidos por tabla
- ✓ Constraints de unicidad (sin duplicados)
- ✓ Patrones de valores NULL
- ✓ Completitud de datos por municipio
- ✓ Existencia de índices

## Manejo de Valores NULL

El script aplica lógica contextual para valores NULL:

- **Valores monetarios**: `0` se mantiene (sin ingresos/gastos es válido)
- **Población**: `0` se convierte a `NULL` (error de datos)
- **Indicadores y razones**: `0.0` se convierte a `NULL` (dato no disponible)

## Tamaño de Base de Datos

- **Registros totales**: ~90,000
- **Tamaño del archivo**: ~20-25 MB
- **Municipios**: 1,122

## Notas Importantes

- El script de migración es **destructivo**: elimina la BD existente antes de crear una nueva
- La migración es **idempotente**: puede ejecutarse múltiples veces sin problemas
- Todos los scripts incluyen **logging detallado** para debugging
- Los datos están **normalizados en 3NF** para evitar redundancia

## Solución de Problemas

### Error: "Archivo no encontrado"

Verifica que los archivos JSON existan en `src/assets/data/Eficiencias_hojas/`.

### Error: "No module named 'config'"

Asegúrate de estar en el directorio `scripts/db/` al ejecutar los scripts.

### Base de datos muy grande

El tamaño esperado es 20-25 MB. Si es mucho mayor, puede haber duplicados o datos incorrectos.

### Muchos valores NULL

Revisa el reporte de validación para identificar si los NULL son esperados o indican problemas en los datos fuente.

## Exportar Datos a JSON para Modo Mock

### 3. Exportar Todos los Municipios

Después de migrar los datos a SQLite, puedes exportarlos a JSON para usar en modo mock (sin backend):

```bash
cd scripts/db
python export_all_municipios.py
```

**Salida esperada:**
```
================================================================================
EXPORTACION DE TODOS LOS MUNICIPIOS A JSON
================================================================================

[DB] Base de datos: C:\ws\dnp\ws\SICODIS_WebII\src\assets\db\eficiencias.db
[OUTPUT] Archivo de salida: C:\ws\dnp\ws\SICODIS_WebII\src\assets\data\eficiencias\resumen-municipios.json

[INFO] Total de municipios a exportar: 1104

[EXPORT] Exportando municipios...
  Progreso: 100/1104 (9.1%)
  Progreso: 200/1104 (18.1%)
  ...
  Progreso: 1100/1104 (99.6%)

[SAVE] Guardando JSON...

================================================================================
[SUCCESS] EXPORTACION COMPLETADA
================================================================================

[STATS] Estadisticas:
  - Municipios exportados: 1104
  - Municipios sin datos:  0
  - Tamanio del archivo:   6.01 MB

[FILE] Archivo generado:
  C:\ws\dnp\ws\SICODIS_WebII\src\assets\data\eficiencias\resumen-municipios.json
```

**Resultado:**
- Archivo JSON: `../../src/assets/data/eficiencias/resumen-municipios.json`
- Tamaño: ~6 MB
- Contiene: Todos los 1,104 municipios con datos completos
- Compatible con: `EficienciasMockService` en Angular

**Cuándo ejecutar:**
- Después de migrar o actualizar la base de datos SQLite
- Cuando se agregan nuevos datos
- Para regenerar datos mock actualizados

**Nota:** Este JSON permite que la aplicación Angular funcione sin backend, usando datos estáticos. Ver `ESTRATEGIA_MOCK_EFICIENCIAS.md` para más detalles.

## Siguientes Pasos

Después de la migración exitosa:

1. Exportar datos a JSON para modo mock (`python export_all_municipios.py`)
2. Iniciar el backend API REST (ver `backend/README.md`) - OPCIONAL
3. Integrar con Angular (actualizar `sicodis-api.service.ts`)
4. Crear componentes de visualización
