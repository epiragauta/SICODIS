# Backend API REST - Eficiencias Fiscales y Administrativas

API REST construida con Node.js/Express para consultar datos de eficiencias fiscales y administrativas de municipios colombianos almacenados en SQLite.

## Requisitos

- **Node.js**: 16.x o superior
- **npm**: 8.x o superior
- **Base de datos SQLite**: `src/assets/db/eficiencias.db` (debe existir)

## Instalación

```bash
cd backend
npm install
```

## Configuración

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita `.env` según tus necesidades:

```env
PORT=3000
DB_PATH=../src/assets/db/eficiencias.db
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

## Uso

### Desarrollo (con auto-reload)

```bash
npm run dev
```

### Producción

```bash
npm start
```

El servidor iniciará en `http://localhost:3000` (o el puerto especificado en `.env`).

## Endpoints Disponibles

### Catálogo de Municipios

```
GET /api/eficiencias/municipios
```
Retorna todos los municipios.

**Respuesta:**
```json
[
  {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  }
]
```

---

```
GET /api/eficiencias/municipios/:codigo_dane
```
Retorna un municipio específico.

**Ejemplo:** `/api/eficiencias/municipios/05001`

---

### Ingresos Tributarios

```
GET /api/eficiencias/ingresos-tributarios
GET /api/eficiencias/ingresos-tributarios/:codigo_dane
GET /api/eficiencias/ingresos-tributarios/:codigo_dane/:anio
```

**Query params:**
- `limit`: Número de registros (default: 100)
- `offset`: Offset para paginación (default: 0)

**Ejemplo:** `/api/eficiencias/ingresos-tributarios/05001/2023`

**Respuesta:**
```json
[
  {
    "id": 123,
    "codigo_dane": "05001",
    "anio": 2023,
    "valor": 1234567.89,
    "observacion": "Fuente CGN"
  }
]
```

---

### Población

```
GET /api/eficiencias/poblacion
GET /api/eficiencias/poblacion/:codigo_dane
GET /api/eficiencias/poblacion/:codigo_dane/:anio
```

**Query params:** `limit`, `offset`

**Ejemplo:** `/api/eficiencias/poblacion/05001/2023`

**Respuesta:**
```json
[
  {
    "id": 456,
    "codigo_dane": "05001",
    "anio": 2023,
    "poblacion": 2653729,
    "fuente_censo": "2018"
  }
]
```

---

### Recursos Propósito General

```
GET /api/eficiencias/recursos-proposito-general
GET /api/eficiencias/recursos-proposito-general/:codigo_dane
GET /api/eficiencias/recursos-proposito-general/:codigo_dane/:anio
```

**Query params:** `limit`, `offset`

**Respuesta:**
```json
[
  {
    "id": 789,
    "codigo_dane": "05001",
    "anio": 2023,
    "poblacion_m": 1234.56,
    "pobreza_m": 789.12,
    "poblacion": 5678.90,
    "pobreza": 234.56,
    "eficiencia_fiscal": 0.85,
    "eficiencia_administrativa": 0.78,
    "sisben": 3456.78
  }
]
```

---

### Ley 617 - ICLD

```
GET /api/eficiencias/ley-617/icld/:codigo_dane
GET /api/eficiencias/ley-617/icld/:codigo_dane/:anio
```

**Ejemplo:** `/api/eficiencias/ley-617/icld/05001`

---

### Ley 617 - Gastos de Funcionamiento

```
GET /api/eficiencias/ley-617/gastos-funcionamiento/:codigo_dane
GET /api/eficiencias/ley-617/gastos-funcionamiento/:codigo_dane/:anio
```

---

### Ley 617 - Razón

```
GET /api/eficiencias/ley-617/razon/:codigo_dane
GET /api/eficiencias/ley-617/razon/:codigo_dane/:anio
```

---

### Ley 617 - Holgura

```
GET /api/eficiencias/ley-617/holgura/:codigo_dane
GET /api/eficiencias/ley-617/holgura/:codigo_dane/:anio
```

---

### Ley 617 - Límite de Gasto (vigencia 2025)

```
GET /api/eficiencias/ley-617/limite-gasto/:codigo_dane
```

**Ejemplo:** `/api/eficiencias/ley-617/limite-gasto/05001`

**Respuesta:**
```json
{
  "codigo_dane": "05001",
  "limite_gasto": 123456789.00
}
```

---

### Ley 617 - Vigencia 2026

```
GET /api/eficiencias/ley-617/vigencia-2026/:codigo_dane
```

**Ejemplo:** `/api/eficiencias/ley-617/vigencia-2026/05001`

**Respuesta:**
```json
{
  "codigo_dane": "05001",
  "icld": 1234567.89,
  "gf": 987654.32,
  "lg": 1111111.11,
  "razon": 0.75,
  "holgura": 0.25
}
```

---

### Indicadores Ley 550 - Eficiencia Fiscal

```
GET /api/eficiencias/indicadores/eficiencia-fiscal/:codigo_dane
GET /api/eficiencias/indicadores/eficiencia-fiscal/:codigo_dane/:anio
```

**Ejemplo:** `/api/eficiencias/indicadores/eficiencia-fiscal/05001`

---

### Indicadores Ley 550 - Eficiencia Administrativa

```
GET /api/eficiencias/indicadores/eficiencia-administrativa/:codigo_dane
GET /api/eficiencias/indicadores/eficiencia-administrativa/:codigo_dane/:anio
```

---

### Consultas Agregadas

#### Resumen Completo de Municipio

```
GET /api/eficiencias/resumen/:codigo_dane
```

Retorna un resumen completo con todos los datos más recientes del municipio.

**Ejemplo:** `/api/eficiencias/resumen/05001`

**Respuesta:**
```json
{
  "municipio": {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  },
  "ingresos_tributarios": [...],
  "poblacion": [...],
  "recursos_proposito_general": [...],
  "eficiencia_fiscal": [...],
  "eficiencia_administrativa": [...],
  "vigencia_2026": {...}
}
```

---

#### Comparar Municipios

```
GET /api/eficiencias/comparar?codigos=05001,05002&anio=2023
```

Compara múltiples municipios en un año específico.

**Query params:**
- `codigos`: Códigos DANE separados por comas (requerido)
- `anio`: Año a comparar (requerido)

**Respuesta:**
```json
{
  "municipios": [...],
  "anio": 2023,
  "ingresos_tributarios": [...],
  "poblacion": [...],
  "eficiencia_fiscal": [...]
}
```

---

#### Ranking por Eficiencia Fiscal

```
GET /api/eficiencias/ranking/eficiencia-fiscal/:anio?limit=50
```

Retorna un ranking de municipios por eficiencia fiscal en un año dado.

**Query params:**
- `limit`: Número de municipios (default: 50)

**Ejemplo:** `/api/eficiencias/ranking/eficiencia-fiscal/2023?limit=10`

**Respuesta:**
```json
[
  {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN",
    "anio": 2023,
    "valor": 0.95
  }
]
```

---

## Estructura del Proyecto

```
backend/
├── src/
│   ├── app.js                      # Configuración Express
│   ├── config/
│   │   └── database.config.js      # Configuración de SQLite
│   ├── services/
│   │   └── database.service.js     # Servicio de acceso a BD
│   ├── controllers/
│   │   └── eficiencias.controller.js  # Lógica de negocio
│   └── routes/
│       └── eficiencias.routes.js   # Definición de rutas
├── server.js                       # Punto de entrada
├── package.json
├── .env.example
└── README.md
```

## Tecnologías

- **Express**: Framework web minimalista
- **better-sqlite3**: Driver SQLite síncrono de alto rendimiento
- **CORS**: Middleware para habilitar CORS
- **dotenv**: Carga variables de entorno desde `.env`

## Desarrollo

### Agregar Nuevo Endpoint

1. Agregar método en `src/controllers/eficiencias.controller.js`:

```javascript
exports.miNuevoEndpoint = (req, res) => {
  try {
    const { param } = req.params;
    const results = db.all('SELECT * FROM mi_tabla WHERE campo = ?', [param]);
    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
```

2. Agregar ruta en `src/routes/eficiencias.routes.js`:

```javascript
router.get('/mi-ruta/:param', controller.miNuevoEndpoint);
```

### Verificar Salud del Servidor

```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "status": "OK",
  "timestamp": "2026-03-22T10:30:00.000Z",
  "environment": "development"
}
```

## Optimización de Rendimiento

- **SQLite WAL mode**: Habilitado para mejor concurrencia
- **Índices**: Creados en columnas de búsqueda frecuente
- **Paginación**: Disponible en endpoints de listas grandes
- **Queries optimizados**: Uso de prepared statements

## Solución de Problemas

### Error: "Database does not exist"

Asegúrate de haber ejecutado el script de migración:

```bash
cd ../scripts/db
python migrate_data.py
```

### Error: "EADDRINUSE"

El puerto 3000 ya está en uso. Cambia el puerto en `.env`:

```env
PORT=3001
```

### CORS Error desde Angular

Verifica que `CORS_ORIGIN` en `.env` coincida con la URL de Angular:

```env
CORS_ORIGIN=http://localhost:4200
```

## Integración con Angular

### Actualizar proxy.conf.js

Agrega la configuración de proxy en Angular:

```javascript
{
  "/api/eficiencias": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Actualizar sicodis-api.service.ts

Agrega interfaces y métodos en el servicio de Angular:

```typescript
export interface MunicipioEficiencia {
  codigo_dane: string;
  departamento: string;
  municipio: string;
}

getEficienciasMunicipios(): Observable<MunicipioEficiencia[]> {
  return this.http.get<MunicipioEficiencia[]>('/api/eficiencias/municipios');
}
```

## Mantenimiento

### Actualizar Base de Datos

Si los datos JSON cambian, ejecuta nuevamente la migración:

```bash
cd ../scripts/db
python migrate_data.py
```

El backend detectará automáticamente la BD actualizada en el siguiente reinicio.

## Licencia

ISC
