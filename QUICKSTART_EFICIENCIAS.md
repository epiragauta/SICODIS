# Quick Start Guide - Eficiencias API

## Status: ✅ Migration Completed Successfully

The data migration from JSON to SQLite has been completed successfully. Here's what's ready:

### Database Created
- **Location**: `src/assets/db/eficiencias.db`
- **Size**: 5.7 MB
- **Municipios**: 1,104 Colombian municipalities
- **Total Records**: 89,376 data records
- **Tables**: 12 normalized tables

### Migration Results
```
✓ Municipios: 1,104 registros
✓ Ingresos Tributarios: 13,248 registros (2013-2024)
✓ Población: 14,352 registros (2013-2025)
✓ Recursos Propósito General: 8,832 registros (2018-2025)
✓ Ley 617 ICLD: 8,824 registros (2016-2023)
✓ Ley 617 Gastos Funcionamiento: 8,824 registros (2016-2023)
✓ Ley 617 Razón: 8,824 registros (2016-2023)
✓ Ley 617 Holgura: 8,824 registros (2016-2023)
✓ Ley 617 Límite Gasto: 1,103 registros (vigencia 2025)
✓ Ley 617 Vigencia 2026: 1,103 registros
✓ Eficiencia Fiscal: 7,721 registros (2019-2025)
✓ Eficiencia Administrativa: 7,721 registros (2019-2025)
```

### Validation Results
- ✅ **Errors**: 0
- ✅ **Warnings**: 0
- ✅ **Referential Integrity**: Perfect
- ✅ **Duplicates**: None
- ✅ **Year Ranges**: All correct
- ✅ **Indexes**: All created

## Quick Start Commands

### 1. Query the Database (SQLite CLI)

```bash
# Open database
sqlite3 src/assets/db/eficiencias.db

# List all tables
.tables

# Count municipalities
SELECT COUNT(*) FROM municipios;

# Get data for Medellín (code 05001)
SELECT * FROM municipios WHERE codigo_dane = '05001';
SELECT * FROM ingresos_tributarios WHERE codigo_dane = '05001' ORDER BY anio DESC LIMIT 5;
SELECT * FROM poblacion WHERE codigo_dane = '05001' ORDER BY anio DESC LIMIT 5;

# Exit
.quit
```

### 2. Start Backend API

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# Create environment file (first time only)
cp .env.example .env

# Start server
npm run dev
```

**Expected output:**
```
================================================================================
SICODIS - API de Eficiencias Fiscales y Administrativas
================================================================================
✓ Servidor corriendo en http://localhost:3000
✓ Base de datos conectada: ../src/assets/db/eficiencias.db
```

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Get all municipalities
curl http://localhost:3000/api/eficiencias/municipios | json_pp

# Get Medellín data
curl http://localhost:3000/api/eficiencias/municipios/05001 | json_pp

# Get income tax data for Medellín
curl http://localhost:3000/api/eficiencias/ingresos-tributarios/05001 | json_pp

# Get complete summary for Medellín
curl http://localhost:3000/api/eficiencias/resumen/05001 | json_pp

# Compare Medellín (05001) and Cali (76001) in 2023
curl "http://localhost:3000/api/eficiencias/comparar?codigos=05001,76001&anio=2023" | json_pp

# Get efficiency ranking for 2023 (top 10)
curl "http://localhost:3000/api/eficiencias/ranking/eficiencia-fiscal/2023?limit=10" | json_pp
```

## API Endpoints Reference

### Core Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `GET /health` | Server health check | `/health` |
| `GET /api/eficiencias/municipios` | All municipalities | `/api/eficiencias/municipios` |
| `GET /api/eficiencias/municipios/:codigo` | Specific municipality | `/api/eficiencias/municipios/05001` |

### Data Endpoints

| Category | Endpoint | Example |
|----------|----------|---------|
| **Ingresos** | `/api/eficiencias/ingresos-tributarios/:codigo` | `/api/eficiencias/ingresos-tributarios/05001` |
| **Población** | `/api/eficiencias/poblacion/:codigo` | `/api/eficiencias/poblacion/05001` |
| **Recursos** | `/api/eficiencias/recursos-proposito-general/:codigo` | `/api/eficiencias/recursos-proposito-general/05001` |
| **Ley 617 ICLD** | `/api/eficiencias/ley-617/icld/:codigo` | `/api/eficiencias/ley-617/icld/05001` |
| **Ley 617 GF** | `/api/eficiencias/ley-617/gastos-funcionamiento/:codigo` | `/api/eficiencias/ley-617/gastos-funcionamiento/05001` |
| **Ley 617 Razón** | `/api/eficiencias/ley-617/razon/:codigo` | `/api/eficiencias/ley-617/razon/05001` |
| **Ley 617 Holgura** | `/api/eficiencias/ley-617/holgura/:codigo` | `/api/eficiencias/ley-617/holgura/05001` |
| **Límite Gasto** | `/api/eficiencias/ley-617/limite-gasto/:codigo` | `/api/eficiencias/ley-617/limite-gasto/05001` |
| **Vigencia 2026** | `/api/eficiencias/ley-617/vigencia-2026/:codigo` | `/api/eficiencias/ley-617/vigencia-2026/05001` |
| **Ef. Fiscal** | `/api/eficiencias/indicadores/eficiencia-fiscal/:codigo` | `/api/eficiencias/indicadores/eficiencia-fiscal/05001` |
| **Ef. Admin** | `/api/eficiencias/indicadores/eficiencia-administrativa/:codigo` | `/api/eficiencias/indicadores/eficiencia-administrativa/05001` |

### Aggregate Endpoints

| Endpoint | Description | Example |
|----------|-------------|---------|
| `/api/eficiencias/resumen/:codigo` | Complete summary for municipality | `/api/eficiencias/resumen/05001` |
| `/api/eficiencias/comparar` | Compare municipalities | `/api/eficiencias/comparar?codigos=05001,76001&anio=2023` |
| `/api/eficiencias/ranking/eficiencia-fiscal/:anio` | Ranking by fiscal efficiency | `/api/eficiencias/ranking/eficiencia-fiscal/2023?limit=10` |

## Sample Municipality Codes

| Code | Municipality | Department |
|------|-------------|------------|
| `05001` | MEDELLÍN | ANTIOQUIA |
| `76001` | CALI | VALLE DEL CAUCA |
| `11001` | BOGOTÁ D.C. | BOGOTÁ D.C. |
| `08001` | BARRANQUILLA | ATLÁNTICO |
| `13001` | CARTAGENA | BOLÍVAR |

## Example API Responses

### Get Municipality
```json
{
  "codigo_dane": "05001",
  "departamento": "ANTIOQUIA",
  "municipio": "MEDELLÍN"
}
```

### Get Income Tax Data
```json
[
  {
    "id": 1,
    "codigo_dane": "05001",
    "anio": 2024,
    "valor": 1234567.89,
    "observacion": "Fuente CGN"
  }
]
```

### Get Complete Summary
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

## Integration with Angular

### Add to `proxy.conf.js`
```javascript
"/api/eficiencias": {
  "target": "http://localhost:3000",
  "secure": false,
  "changeOrigin": true
}
```

### Add to `sicodis-api.service.ts`
```typescript
// Interface
export interface MunicipioEficiencia {
  codigo_dane: string;
  departamento: string;
  municipio: string;
}

// Method
getEficienciasMunicipios(): Observable<MunicipioEficiencia[]> {
  return this.http.get<MunicipioEficiencia[]>('/api/eficiencias/municipios');
}
```

## File Structure

```
SICODIS_WebII/
├── scripts/db/                  # Migration scripts
│   ├── migrate_data.py          # ✅ Run migration
│   ├── verify_data.py           # ✅ Validate data
│   └── README.md                # Detailed docs
│
├── backend/                     # REST API
│   ├── src/                     # Source code
│   ├── package.json             # Dependencies
│   └── README.md                # API documentation
│
├── src/assets/
│   ├── data/Eficiencias_hojas/  # Source JSON files
│   └── db/
│       ├── eficiencias.db       # ✅ SQLite database (5.7 MB)
│       └── eficiencias_validation_report.txt  # ✅ Validation report
│
├── MIGRACION_EFICIENCIAS_README.md  # Complete documentation
└── QUICKSTART_EFICIENCIAS.md        # This file
```

## Next Steps

1. **Explore the Database**: Use SQLite CLI to query data
2. **Start the API**: Run `npm run dev` in backend directory
3. **Test Endpoints**: Use curl or Postman to test API
4. **Integrate with Angular**: Add service methods and create components
5. **Build Visualizations**: Use the API to create charts and tables

## Documentation

- **Complete Guide**: `MIGRACION_EFICIENCIAS_README.md`
- **Scripts Documentation**: `scripts/db/README.md`
- **Backend Documentation**: `backend/README.md`

## Troubleshooting

### Database not found
```bash
# Re-run migration
cd scripts/db
python migrate_data.py
```

### Backend can't connect
```bash
# Check database exists
ls src/assets/db/eficiencias.db

# Check .env configuration
cat backend/.env
```

### Port already in use
```bash
# Change port in backend/.env
PORT=3001
```

---

**Status**: ✅ Ready for Production
**Last Updated**: 2026-03-22
**Total Implementation Time**: Completed in single session
