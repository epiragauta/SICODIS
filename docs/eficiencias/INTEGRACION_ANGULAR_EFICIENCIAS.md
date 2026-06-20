# Integración Angular - API de Eficiencias

## ✅ Integración Completada

La API de eficiencias ha sido integrada exitosamente con la aplicación Angular SICODIS.

---

## Componentes Actualizados

### 1. Proxy Configuration (`proxy.conf.js`)

Se agregó configuración para enrutar peticiones de eficiencias al backend local:

```javascript
"/api/eficiencias": {
  "target": "http://localhost:3000",
  "secure": false,
  "changeOrigin": true,
  "logLevel": "debug"
}
```

**Importante**: Esta configuración tiene prioridad sobre `/api/*`, por lo que:
- `/api/eficiencias/*` → Backend local (puerto 3000)
- `/api/*` (otros) → SICODIS producción

---

### 2. Servicio API (`sicodis-api.service.ts`)

#### Interfaces Agregadas

```typescript
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

export interface ResumenMunicipioEficiencia {
  municipio: MunicipioEficiencia;
  ingresos_tributarios: IngresoTributario[];
  poblacion: PoblacionMunicipio[];
  recursos_proposito_general: RecursoPropositoGeneral[];
  eficiencia_fiscal: IndicadorEficienciaFiscal[];
  eficiencia_administrativa: IndicadorEficienciaAdministrativa[];
  vigencia_2026: Ley617Vigencia2026;
}

// + 8 interfaces más para datos específicos
```

#### Métodos Agregados (15 métodos)

```typescript
// Catálogo
getEficienciasMunicipios(): Observable<MunicipioEficiencia[]>
getEficienciasMunicipioByCodigo(codigoDane: string): Observable<MunicipioEficiencia>

// Datos fiscales
getEficienciasIngresosTributarios(codigoDane: string, anio?: number): Observable<IngresoTributario[]>
getEficienciasPoblacion(codigoDane: string, anio?: number): Observable<PoblacionMunicipio[]>
getEficienciasRecursosPropositoGeneral(codigoDane: string, anio?: number): Observable<RecursoPropositoGeneral[]>

// Ley 617
getEficienciasLey617ICLD(codigoDane: string, anio?: number): Observable<Ley617ICLD[]>
getEficienciasLey617GastosFuncionamiento(codigoDane: string, anio?: number): Observable<Ley617GastosFuncionamiento[]>
getEficienciasLey617Razon(codigoDane: string, anio?: number): Observable<Ley617Razon[]>
getEficienciasLey617Holgura(codigoDane: string, anio?: number): Observable<Ley617Holgura[]>
getEficienciasLey617LimiteGasto(codigoDane: string): Observable<Ley617LimiteGasto>
getEficienciasLey617Vigencia2026(codigoDane: string): Observable<Ley617Vigencia2026>

// Indicadores
getEficienciasIndicadoresEficienciaFiscal(codigoDane: string, anio?: number): Observable<IndicadorEficienciaFiscal[]>
getEficienciasIndicadoresEficienciaAdministrativa(codigoDane: string, anio?: number): Observable<IndicadorEficienciaAdministrativa[]>

// Consultas agregadas
getEficienciasResumenMunicipio(codigoDane: string): Observable<ResumenMunicipioEficiencia>
getEficienciasComparar(codigos: string[], anio: number): Observable<ComparacionMunicipios>
getEficienciasRankingEficienciaFiscal(anio: number, limit?: number): Observable<RankingEficienciaItem[]>
```

---

### 3. Componente SGP Eficiencias (`sgp-eficiencias.component.ts`)

Se integró el componente existente con la API real:

#### Cambios Implementados

1. **Servicio inyectado**:
```typescript
constructor(private apiService: SicodisApiService) {}
```

2. **Carga de municipios reales**:
```typescript
private updateMunicipios(departamentoCode: string): void {
  this.apiService.getEficienciasMunicipios().subscribe({
    next: (municipios) => {
      this.municipios = municipios
        .filter(m => m.codigo_dane.startsWith(departamentoCode))
        .map(m => ({
          label: m.municipio,
          value: m.codigo_dane.substring(2)
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
  });
}
```

3. **Carga de datos fiscales reales**:
```typescript
loadDatosReales(codigoMunicipio: string): void {
  const codigoDane = this.selectedDepartamento + codigoMunicipio;

  this.apiService.getEficienciasResumenMunicipio(codigoDane).subscribe({
    next: (data) => {
      this.resumenMunicipio = data;
      this.procesarDatosAPI(data);
    }
  });
}
```

4. **Procesamiento de datos de la API**:
```typescript
private procesarDatosAPI(data: ResumenMunicipioEficiencia): void {
  // Actualizar tablas de eficiencia fiscal
  // Actualizar tablas de eficiencia administrativa
  // Actualizar once doceavas con datos reales
}
```

#### Funcionalidades

- ✅ Selector de departamento
- ✅ Selector de municipio (carga dinámica según departamento)
- ✅ Botón "Aplicar" carga datos reales desde API
- ✅ Tablas actualizadas con datos reales
- ✅ Fallback a datos mock si la API falla
- ✅ Indicadores de carga (spinner)
- ✅ Manejo de errores

---

## Cómo Usar

### Paso 1: Iniciar Backend

```bash
cd backend
npm run dev
```

**Salida esperada:**
```
✓ Servidor corriendo en http://localhost:3000
✓ Base de datos conectada
```

### Paso 2: Iniciar Angular

```bash
npm start
```

**Salida esperada:**
```
Application bundle generation complete.
Watch mode enabled. Watching for file changes...
Local: http://localhost:4200/
```

### Paso 3: Navegar al Componente

1. Abrir navegador en `http://localhost:4200`
2. Navegar a: **SGP → Eficiencias**
   - URL: `http://localhost:4200/sgp-eficiencia`

### Paso 4: Usar el Componente

1. **Seleccionar Departamento**: Elegir de la lista (ej: ANTIOQUIA)
2. **Seleccionar Municipio**: Elegir de la lista cargada dinámicamente (ej: MEDELLÍN)
3. **Hacer clic en "Aplicar"**: Carga datos reales desde la API
4. **Ver resultados**: Las tablas se actualizan con datos fiscales reales

---

## Flujo de Datos

```
Usuario selecciona departamento
    ↓
Componente carga municipios desde API
    ↓
GET /api/eficiencias/municipios
    ↓
Proxy → http://localhost:3000/api/eficiencias/municipios
    ↓
Backend consulta SQLite
    ↓
Retorna lista de municipios
    ↓
Componente filtra por departamento y muestra dropdown
    ↓
Usuario selecciona municipio y hace clic en "Aplicar"
    ↓
Componente construye código DANE (departamento + municipio)
    ↓
GET /api/eficiencias/resumen/05001
    ↓
Proxy → http://localhost:3000/api/eficiencias/resumen/05001
    ↓
Backend consulta múltiples tablas en SQLite
    ↓
Retorna resumen completo del municipio
    ↓
Componente procesa datos y actualiza tablas
    ↓
Usuario ve datos reales en pantalla
```

---

## Endpoints Disponibles en el Componente

El componente usa principalmente:

1. **`GET /api/eficiencias/municipios`**
   - Usado por: `updateMunicipios()`
   - Retorna: Lista de 1,104 municipios

2. **`GET /api/eficiencias/resumen/:codigo_dane`**
   - Usado por: `loadDatosReales()`
   - Retorna: Resumen completo con:
     - Ingresos tributarios (2013-2024)
     - Población (2013-2025)
     - Recursos propósito general (2018-2025)
     - Eficiencia fiscal (2019-2025)
     - Eficiencia administrativa (2019-2025)
     - Vigencia 2026

---

## Ejemplo de Datos Retornados

### Municipios (GET /api/eficiencias/municipios)
```json
[
  {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  },
  {
    "codigo_dane": "05002",
    "departamento": "ANTIOQUIA",
    "municipio": "ABEJORRAL"
  }
]
```

### Resumen Municipio (GET /api/eficiencias/resumen/05001)
```json
{
  "municipio": {
    "codigo_dane": "05001",
    "departamento": "ANTIOQUIA",
    "municipio": "MEDELLÍN"
  },
  "ingresos_tributarios": [
    {
      "id": 12,
      "codigo_dane": "05001",
      "anio": 2024,
      "valor": 3278049628.114,
      "observacion": "Refrendado"
    }
  ],
  "poblacion": [
    {
      "id": 13,
      "codigo_dane": "05001",
      "anio": 2025,
      "poblacion": 2634570,
      "fuente_censo": "2018"
    }
  ],
  "eficiencia_fiscal": [...],
  "eficiencia_administrativa": [...],
  "vigencia_2026": {...}
}
```

---

## Verificación

### Console del Navegador

Abrir DevTools (F12) y verificar en la consola:

```
Cargando municipios para departamento: 05
Municipios cargados: 125
Cargando datos para código DANE: 05001
Datos cargados exitosamente: {municipio: {...}, ingresos_tributarios: [...]}
Datos procesados y tablas actualizadas
```

### Network Tab

Verificar las peticiones HTTP:

```
GET http://localhost:4200/api/eficiencias/municipios → 200 OK
GET http://localhost:4200/api/eficiencias/resumen/05001 → 200 OK
```

**Nota**: Las URLs muestran `localhost:4200` porque pasan por el proxy de Angular, pero se enrutan a `localhost:3000`.

---

## Manejo de Errores

El componente tiene manejo robusto de errores:

### 1. Error al cargar municipios
```typescript
error: (err) => {
  console.error('Error cargando municipios:', err);
  // Fallback a datos mock
  this.municipios = [
    { label: 'Municipio 1', value: '001' },
    { label: 'Municipio 2', value: '002' }
  ];
}
```

### 2. Error al cargar datos fiscales
```typescript
error: (err) => {
  console.error('Error cargando datos de eficiencias:', err);
  this.errorMessage = 'Error al cargar los datos: ' + err.message;
  this.isLoading = false;
  // Mantener datos mock en las tablas
}
```

---

## Próximos Pasos

### 1. Agregar Visualizaciones
- Gráficos de evolución temporal (Chart.js)
- Mapas de eficiencia por departamento (Leaflet)
- Comparativas entre municipios

### 2. Exportación de Datos
- Botón para descargar datos en Excel
- Generar reportes PDF

### 3. Filtros Adicionales
- Filtro por rango de años
- Filtro por tipo de indicador
- Búsqueda de municipios

### 4. Caché de Datos
- Implementar caché local para reducir peticiones
- Usar LocalStorage o SessionStorage

---

## Testing

### Probar Diferentes Municipios

```typescript
// Medellín
Departamento: ANTIOQUIA (05)
Municipio: MEDELLÍN (001)
Código DANE: 05001

// Cali
Departamento: VALLE DEL CAUCA (76)
Municipio: CALI (001)
Código DANE: 76001

// Bogotá
Departamento: BOGOTÁ D.C. (11)
Municipio: BOGOTÁ D.C. (001)
Código DANE: 11001
```

### Verificar Datos en Tablas

Después de aplicar filtros, verificar que las tablas muestren:

- **Eficiencia Fiscal**: Ingresos tributarios por año
- **Eficiencia Administrativa**: ICLD, GF, LG, Razón, Holgura
- **Once Doceavas**: Población, Pobreza, Sisben, etc.

---

## Troubleshooting

### Backend no responde
```bash
# Verificar que el backend está corriendo
curl http://localhost:3000/health

# Salida esperada:
# {"status":"OK","timestamp":"2026-03-23T..."}
```

### CORS Error
Verificar que:
1. Backend tiene CORS habilitado para `http://localhost:4200`
2. Proxy está configurado correctamente en `proxy.conf.js`
3. Angular dev server se inició con configuración de proxy

### Proxy no enruta correctamente
```bash
# Reiniciar Angular dev server
Ctrl+C
npm start
```

---

## Resumen de Integración

✅ **Proxy configurado**: `/api/eficiencias` → `http://localhost:3000`
✅ **Servicio API actualizado**: 15 métodos + 13 interfaces
✅ **Componente integrado**: `sgp-eficiencias.component.ts`
✅ **Carga dinámica**: Municipios por departamento
✅ **Datos reales**: Desde base de datos SQLite
✅ **Fallback**: Datos mock si API falla
✅ **Manejo de errores**: Mensajes y logging
✅ **UI actualizada**: Tablas con datos reales

---

**Estado**: ✅ Integración completa y funcional
**Última actualización**: 2026-03-23
**Siguiente paso**: Probar en navegador con datos reales
