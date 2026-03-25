# Migración de Datos de Eficiencias a Base de Datos SQLite

Este documento describe la implementación completa de la migración de datos fiscales de archivos JSON a una base de datos SQLite relacional, junto con un backend API REST para consultar los datos.

## Tabla de Contenidos

1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Componentes Implementados](#componentes-implementados)
4. [Guía de Uso](#guía-de-uso)
5. [Modelo de Datos](#modelo-de-datos)
6. [API REST](#api-rest)
7. [Integración con Angular](#integración-con-angular)

---

## Visión General

### Objetivo

Convertir 5 archivos JSON (~3MB total) con datos fiscales y administrativos de 1,122 municipios colombianos a una base de datos SQLite normalizada (3NF) con ~90,000 registros.

### Archivos Fuente

Ubicados en `src/assets/data/Eficiencias_hojas/`:

1. **Datos_Ingresos_Tributarios.json** (~306KB) - Ingresos tributarios 2013-2024
2. **Datos_Poblacion.json** (~101KB) - Proyecciones de población 2013-2025
3. **Recursos.json** (~1MB) - Once Doceavas de Propósito General 2018-2025
4. **Ef_Admin.json** (~917KB) - Datos Ley 617 de 2000
5. **Indicadores_Ley_550.json** (~424KB) - Eficiencia Fiscal y Administrativa 2019-2025

### Base de Datos Resultante

- **Ubicación**: `src/assets/db/eficiencias.db`
- **Tamaño**: ~20-25 MB
- **Tablas**: 12 tablas principales + metadatos
- **Registros**: ~90,000 registros de datos
- **Municipios**: 1,122 municipios colombianos

---

## Estructura del Proyecto

```
SICODIS_WebII/
├── scripts/db/                              # Scripts de migración
│   ├── create_schema.sql                    # Esquema de base de datos
│   ├── migrate_data.py                      # Script principal de migración
│   ├── verify_data.py                       # Validación post-migración
│   ├── config.py                            # Configuración de rutas
│   └── README.md                            # Documentación de scripts
│
├── backend/                                  # Backend API REST
│   ├── src/
│   │   ├── app.js                           # Configuración Express
│   │   ├── server.js                        # Punto de entrada
│   │   ├── config/
│   │   │   └── database.config.js           # Config SQLite
│   │   ├── services/
│   │   │   └── database.service.js          # Servicio de BD
│   │   ├── controllers/
│   │   │   └── eficiencias.controller.js    # Lógica de negocio
│   │   └── routes/
│   │       └── eficiencias.routes.js        # Rutas REST
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md                            # Documentación de backend
│
├── src/assets/
│   ├── data/Eficiencias_hojas/              # Datos JSON originales
│   │   ├── Datos_Ingresos_Tributarios.json
│   │   ├── Datos_Poblacion.json
│   │   ├── Recursos.json
│   │   ├── Ef_Admin.json
│   │   └── Indicadores_Ley_550.json
│   └── db/
│       └── eficiencias.db                   # Base de datos SQLite (generada)
│
└── MIGRACION_EFICIENCIAS_README.md          # Este archivo
```

---

## Componentes Implementados

### 1. Scripts de Migración (Python)

#### `create_schema.sql`
- Define 12 tablas normalizadas (3NF)
- Constraints: PKs, FKs, UNIQUE
- Índices para optimización de queries
- Tabla de metadatos

#### `migrate_data.py`
- Clase `DataMigrator` con métodos modulares
- Parseo de archivos JSON con estructura compleja
- Validación contextual de valores NULL
- Logging detallado de progreso
- Manejo de transacciones para integridad

#### `verify_data.py`
- Validación de conteos de registros
- Verificación de integridad referencial
- Validación de rangos de años
- Detección de duplicados
- Generación de reporte de validación

#### `config.py`
- Configuración centralizada de rutas
- Paths absolutos a archivos JSON y BD

### 2. Backend API REST (Node.js/Express)

#### Tecnologías
- **Express**: Framework web
- **better-sqlite3**: Driver SQLite de alto rendimiento
- **CORS**: Habilitado para Angular
- **dotenv**: Variables de entorno

#### Características
- 20+ endpoints RESTful
- Paginación en endpoints de listas
- Queries optimizados con prepared statements
- Manejo robusto de errores
- Logging de requests
- Graceful shutdown

#### Endpoints Principales
- `/api/eficiencias/municipios` - Catálogo de municipios
- `/api/eficiencias/ingresos-tributarios/:codigo_dane` - Ingresos
- `/api/eficiencias/poblacion/:codigo_dane` - Población
- `/api/eficiencias/resumen/:codigo_dane` - Resumen completo
- `/api/eficiencias/comparar` - Comparar municipios
- `/api/eficiencias/ranking/eficiencia-fiscal/:anio` - Rankings

---

## Guía de Uso

### Paso 1: Migrar Datos a SQLite

```bash
# Navegar al directorio de scripts
cd scripts/db

# Ejecutar migración
python migrate_data.py
```

**Salida esperada:**
```
================================================================================
INICIANDO MIGRACIÓN DE DATOS JSON A SQLITE
================================================================================
INFO: Creando base de datos en: ...\src\assets\db\eficiencias.db
INFO: Creando esquema de base de datos...
INFO: Esquema creado exitosamente
INFO: Migrando ingresos_tributarios...
INFO: Insertados 13464 registros en ingresos_tributarios
INFO: Migrando poblacion...
INFO: Insertados 14586 registros en poblacion
...
INFO: Metadatos actualizados. Total municipios: 1122
================================================================================
MIGRACIÓN COMPLETADA EXITOSAMENTE
================================================================================
```

### Paso 2: Validar Migración

```bash
# En el mismo directorio scripts/db
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
...
INFO: Reporte generado en: ...\src\assets\db\eficiencias_validation_report.txt
================================================================================
VALIDACIÓN COMPLETADA EXITOSAMENTE ✓
================================================================================
```

### Paso 3: Iniciar Backend API

```bash
# Navegar al directorio backend
cd ../../backend

# Instalar dependencias (primera vez)
npm install

# Copiar y configurar variables de entorno
cp .env.example .env

# Iniciar servidor en modo desarrollo
npm run dev
```

**Salida esperada:**
```
================================================================================
SICODIS - API de Eficiencias Fiscales y Administrativas
================================================================================
✓ Servidor corriendo en http://localhost:3000
✓ Entorno: development
✓ CORS habilitado para: http://localhost:4200
================================================================================

Endpoints disponibles:
  - GET  http://localhost:3000/health
  - GET  http://localhost:3000/api/eficiencias/municipios
  - GET  http://localhost:3000/api/eficiencias/resumen/:codigo_dane

✓ Presiona Ctrl+C para detener el servidor
```

### Paso 4: Probar API

```bash
# Verificar salud del servidor
curl http://localhost:3000/health

# Obtener todos los municipios
curl http://localhost:3000/api/eficiencias/municipios

# Obtener ingresos tributarios de Medellín
curl http://localhost:3000/api/eficiencias/ingresos-tributarios/05001

# Obtener resumen completo de Medellín
curl http://localhost:3000/api/eficiencias/resumen/05001

# Comparar Medellín (05001) y Cali (76001) en 2023
curl "http://localhost:3000/api/eficiencias/comparar?codigos=05001,76001&anio=2023"

# Obtener ranking de eficiencia fiscal 2023 (top 10)
curl "http://localhost:3000/api/eficiencias/ranking/eficiencia-fiscal/2023?limit=10"
```

---

## Modelo de Datos

### Diagrama Entidad-Relación

```
municipios (1,122 registros)
  ├── codigo_dane (PK)
  ├── departamento
  └── municipio
      │
      ├─── ingresos_tributarios (13,464 registros)
      │      ├── id (PK)
      │      ├── codigo_dane (FK) ──┐
      │      ├── anio                │
      │      ├── valor                │
      │      └── observacion           │
      │                                │
      ├─── poblacion (14,586 registros)│
      │      ├── id (PK)                │
      │      ├── codigo_dane (FK) ──────┤
      │      ├── anio                   │
      │      ├── poblacion               │
      │      └── fuente_censo            │
      │                                  │
      ├─── recursos_proposito_general (8,976 registros)
      │      ├── id (PK)                │
      │      ├── codigo_dane (FK) ──────┤
      │      ├── anio                   │
      │      ├── poblacion_m             │
      │      ├── pobreza_m               │
      │      └── ... (7 métricas)        │
      │                                  │
      ├─── ley_617_icld (8,976)          │
      ├─── ley_617_gastos_funcionamiento (8,976)
      ├─── ley_617_razon (8,976)         │
      ├─── ley_617_holgura (8,976)       │
      ├─── ley_617_limite_gasto (1,122)  │
      ├─── ley_617_vigencia_2026 (1,122) │
      ├─── indicadores_eficiencia_fiscal (7,854)
      └─── indicadores_eficiencia_administrativa (7,854)
             ├── id (PK)
             ├── codigo_dane (FK) ──────┘
             ├── anio
             └── valor
```

### Tablas Principales

#### 1. `municipios` - Catálogo Maestro
```sql
CREATE TABLE municipios (
  codigo_dane TEXT PRIMARY KEY,
  departamento TEXT NOT NULL,
  municipio TEXT NOT NULL
);
```
**Registros**: 1,122 municipios

#### 2. `ingresos_tributarios` - Serie Temporal
```sql
CREATE TABLE ingresos_tributarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  valor REAL,
  observacion TEXT,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);
```
**Registros**: 13,464 (1,122 municipios × 12 años: 2013-2024)

#### 3. `poblacion` - Serie Temporal
```sql
CREATE TABLE poblacion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  poblacion INTEGER,
  fuente_censo TEXT CHECK(fuente_censo IN ('2005', '2018')),
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);
```
**Registros**: 14,586 (1,122 municipios × 13 años: 2013-2025)

#### 4. `recursos_proposito_general` - Multi-Métrica
```sql
CREATE TABLE recursos_proposito_general (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_dane TEXT NOT NULL,
  anio INTEGER NOT NULL,
  poblacion_m REAL,
  pobreza_m REAL,
  poblacion REAL,
  pobreza REAL,
  eficiencia_fiscal REAL,
  eficiencia_administrativa REAL,
  sisben REAL,
  FOREIGN KEY (codigo_dane) REFERENCES municipios(codigo_dane),
  UNIQUE(codigo_dane, anio)
);
```
**Registros**: 8,976 (1,122 municipios × 8 años: 2018-2025)

#### 5-8. Tablas Ley 617 (Series Temporales)
- `ley_617_icld`: Ingresos Corrientes Libre Destinación
- `ley_617_gastos_funcionamiento`: Gastos de Funcionamiento
- `ley_617_razon`: Razón
- `ley_617_holgura`: Holgura

**Registros cada una**: 8,976 (2016-2023)

#### 9-10. Tablas Ley 617 (Datos Puntuales)
- `ley_617_limite_gasto`: Límite de Gasto vigencia 2025
- `ley_617_vigencia_2026`: Proyecciones 2026

**Registros cada una**: 1,122 (un registro por municipio)

#### 11-12. Tablas Indicadores Ley 550
- `indicadores_eficiencia_fiscal`: Eficiencia Fiscal
- `indicadores_eficiencia_administrativa`: Eficiencia Administrativa

**Registros cada una**: 7,854 (2019-2025)

### Índices para Optimización

```sql
-- Índices por año
CREATE INDEX idx_ingresos_anio ON ingresos_tributarios(anio);
CREATE INDEX idx_poblacion_anio ON poblacion(anio);
CREATE INDEX idx_recursos_anio ON recursos_proposito_general(anio);

-- Índices compuestos (municipio + año)
CREATE INDEX idx_ingresos_dane_anio ON ingresos_tributarios(codigo_dane, anio);
CREATE INDEX idx_poblacion_dane_anio ON poblacion(codigo_dane, anio);
```

---

## API REST

### Arquitectura

```
Cliente (Angular/Browser)
    ↓
Express Middleware (CORS, JSON Parser)
    ↓
Routes (eficiencias.routes.js)
    ↓
Controllers (eficiencias.controller.js)
    ↓
Database Service (database.service.js)
    ↓
SQLite (eficiencias.db)
```

### Ejemplos de Uso

#### Obtener Municipios

**Request:**
```bash
GET http://localhost:3000/api/eficiencias/municipios
```

**Response:**
```json
[
  {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  },
  {
    "codigo_dane": "76001",
    "departamento": "VALLE DEL CAUCA",
    "municipio": "CALI"
  }
]
```

#### Obtener Resumen de Municipio

**Request:**
```bash
GET http://localhost:3000/api/eficiencias/resumen/05001
```

**Response:**
```json
{
  "municipio": {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  },
  "ingresos_tributarios": [
    {"anio": 2024, "valor": 1234567.89, "observacion": "CGN"},
    {"anio": 2023, "valor": 1134567.89, "observacion": "CGN"}
  ],
  "poblacion": [
    {"anio": 2025, "poblacion": 2653729, "fuente_censo": "2018"},
    {"anio": 2024, "poblacion": 2643123, "fuente_censo": "2018"}
  ],
  "recursos_proposito_general": [...],
  "eficiencia_fiscal": [...],
  "eficiencia_administrativa": [...],
  "vigencia_2026": {
    "icld": 1234567.89,
    "gf": 987654.32,
    "lg": 1111111.11,
    "razon": 0.75,
    "holgura": 0.25
  }
}
```

#### Comparar Municipios

**Request:**
```bash
GET http://localhost:3000/api/eficiencias/comparar?codigos=05001,76001,11001&anio=2023
```

**Response:**
```json
{
  "municipios": [
    {"codigo_dane": "05001", "municipio": "MEDELLÍN"},
    {"codigo_dane": "76001", "municipio": "CALI"},
    {"codigo_dane": "11001", "municipio": "BOGOTÁ D.C."}
  ],
  "anio": 2023,
  "ingresos_tributarios": [...],
  "poblacion": [...],
  "eficiencia_fiscal": [...]
}
```

---

## Integración con Angular

### Paso 1: Configurar Proxy

Editar `proxy.conf.js`:

```javascript
module.exports = {
  "/api": {
    "target": "https://sicodis.dnp.gov.co",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  },
  "/api/eficiencias": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
};
```

### Paso 2: Agregar Interfaces en `sicodis-api.service.ts`

```typescript
// Interfaces
export interface MunicipioEficiencia {
  codigo_dane: string;
  departamento: string;
  municipio: string;
}

export interface IngresoTributario {
  id: number;
  codigo_dane: string;
  anio: number;
  valor: number;
  observacion: string;
}

export interface PoblacionMunicipio {
  id: number;
  codigo_dane: string;
  anio: number;
  poblacion: number;
  fuente_censo: string;
}

export interface ResumenMunicipio {
  municipio: MunicipioEficiencia;
  ingresos_tributarios: IngresoTributario[];
  poblacion: PoblacionMunicipio[];
  recursos_proposito_general: any[];
  eficiencia_fiscal: any[];
  eficiencia_administrativa: any[];
  vigencia_2026: any;
}
```

### Paso 3: Agregar Métodos en `sicodis-api.service.ts`

```typescript
// Catálogo
getEficienciasMunicipios(): Observable<MunicipioEficiencia[]> {
  return this.http.get<MunicipioEficiencia[]>('/api/eficiencias/municipios');
}

// Ingresos Tributarios
getEficienciasIngresosTributarios(codigoDane: string): Observable<IngresoTributario[]> {
  return this.http.get<IngresoTributario[]>(`/api/eficiencias/ingresos-tributarios/${codigoDane}`);
}

// Población
getEficienciasPoblacion(codigoDane: string, anio?: number): Observable<PoblacionMunicipio[]> {
  const url = anio
    ? `/api/eficiencias/poblacion/${codigoDane}/${anio}`
    : `/api/eficiencias/poblacion/${codigoDane}`;
  return this.http.get<PoblacionMunicipio[]>(url);
}

// Resumen Completo
getEficienciasResumenMunicipio(codigoDane: string): Observable<ResumenMunicipio> {
  return this.http.get<ResumenMunicipio>(`/api/eficiencias/resumen/${codigoDane}`);
}

// Comparar Municipios
getEficienciasComparar(codigos: string[], anio: number): Observable<any> {
  const params = new HttpParams()
    .set('codigos', codigos.join(','))
    .set('anio', anio.toString());
  return this.http.get('/api/eficiencias/comparar', { params });
}

// Ranking
getEficienciasRanking(anio: number, limit: number = 50): Observable<any[]> {
  return this.http.get<any[]>(`/api/eficiencias/ranking/eficiencia-fiscal/${anio}?limit=${limit}`);
}
```

### Paso 4: Usar en Componente

```typescript
import { Component, OnInit } from '@angular/core';
import { SicodisApiService, ResumenMunicipio } from '../../services/sicodis-api.service';

@Component({
  selector: 'app-eficiencias-municipio',
  templateUrl: './eficiencias-municipio.component.html'
})
export class EficienciasMunicipioComponent implements OnInit {
  resumen: ResumenMunicipio | null = null;
  isLoading = false;

  constructor(private api: SicodisApiService) {}

  ngOnInit() {
    this.loadResumen('05001'); // Medellín
  }

  loadResumen(codigoDane: string) {
    this.isLoading = true;
    this.api.getEficienciasResumenMunicipio(codigoDane).subscribe({
      next: (data) => {
        this.resumen = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando resumen:', error);
        this.isLoading = false;
      }
    });
  }
}
```

---

## Características Técnicas

### Normalización de Datos

- **3NF (Tercera Forma Normal)**: Eliminación de redundancia
- **Integridad Referencial**: Foreign Keys validadas
- **Constraints**: UNIQUE en combinaciones (codigo_dane, anio)

### Manejo de Valores NULL

Lógica contextual implementada en `migrate_data.py`:

- **Valores monetarios**: `0` se mantiene (sin ingresos es válido)
- **Población**: `0` → `NULL` (error de datos)
- **Indicadores**: `0.0` → `NULL` (dato no disponible)

### Optimizaciones de Rendimiento

**SQLite:**
- WAL (Write-Ahead Logging) habilitado
- Índices en columnas de búsqueda frecuente
- Prepared statements en todos los queries

**Backend:**
- Paginación en endpoints de listas grandes
- Cierre graceful con limpieza de conexiones
- Cache de conexión SQLite (singleton)

### Seguridad

- **SQL Injection**: Prevención con prepared statements
- **CORS**: Configurado solo para orígenes permitidos
- **Error Handling**: No expone detalles internos en producción

---

## Mantenimiento y Actualización

### Actualizar Datos

Si los archivos JSON cambian:

```bash
# 1. Reemplazar archivos JSON en src/assets/data/Eficiencias_hojas/

# 2. Re-ejecutar migración (elimina y recrea BD)
cd scripts/db
python migrate_data.py

# 3. Validar nuevos datos
python verify_data.py

# 4. Reiniciar backend
cd ../../backend
npm run dev
```

### Agregar Nuevo Endpoint

1. Agregar método en `backend/src/controllers/eficiencias.controller.js`
2. Agregar ruta en `backend/src/routes/eficiencias.routes.js`
3. Actualizar interfaz en `src/app/services/sicodis-api.service.ts`
4. Agregar método en servicio Angular

### Backup de Base de Datos

```bash
# Copiar archivo SQLite
cp src/assets/db/eficiencias.db src/assets/db/eficiencias_backup_$(date +%Y%m%d).db
```

---

## Solución de Problemas

### Migración falla con "Archivo no encontrado"

Verificar que los archivos JSON existan:
```bash
ls src/assets/data/Eficiencias_hojas/
```

### Backend no puede conectar a BD

Verificar que `eficiencias.db` exista:
```bash
ls src/assets/db/eficiencias.db
```

Si no existe, ejecutar migración primero.

### CORS Error en Angular

Verificar que:
1. Backend esté corriendo en puerto 3000
2. `.env` tenga `CORS_ORIGIN=http://localhost:4200`
3. `proxy.conf.js` tenga configuración correcta

### Query muy lento

Verificar índices:
```sql
.indices  -- En sqlite3
```

Agregar índice si es necesario en `create_schema.sql`.

---

## Comandos de Referencia Rápida

```bash
# === MIGRACIÓN ===
cd scripts/db
python migrate_data.py          # Migrar datos
python verify_data.py           # Validar migración

# === BACKEND ===
cd backend
npm install                     # Instalar dependencias (primera vez)
cp .env.example .env            # Configurar entorno (primera vez)
npm run dev                     # Iniciar en modo desarrollo
npm start                       # Iniciar en modo producción

# === ANGULAR ===
npm start                       # Iniciar dev server (puerto 4200)

# === CONSULTAS SQLite ===
sqlite3 src/assets/db/eficiencias.db
.tables                         # Listar tablas
.schema municipios              # Ver esquema
SELECT COUNT(*) FROM municipios;  # Contar registros
.quit                           # Salir
```

---

## Contacto y Soporte

Para preguntas o problemas:

1. Revisar logs de migración y backend
2. Consultar reportes de validación en `src/assets/db/`
3. Verificar documentación específica en `scripts/db/README.md` y `backend/README.md`

---

**Última actualización**: 2026-03-22
**Versión**: 1.0.0
**Autor**: DNP - SICODIS
