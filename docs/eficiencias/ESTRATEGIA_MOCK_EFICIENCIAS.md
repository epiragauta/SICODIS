# Estrategia de Datos Mock para Eficiencias

## Resumen

Se ha implementado una estrategia flexible que permite usar **datos estáticos (mock)** o **API real** para el módulo de eficiencias, controlada mediante un simple flag de configuración.

## Arquitectura Implementada

```
┌─────────────────────────────────────────────────────────────┐
│                    EficienciasService                       │
│                  (Servicio Unificado)                       │
│                                                             │
│  if (USE_MOCK_EFICIENCIAS) → EficienciasMockService        │
│  else                       → SicodisApiService             │
└─────────────────────────────────────────────────────────────┘
         │                              │
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────┐
│ EficienciasMockService│    │   SicodisApiService      │
│                      │    │                          │
│ • Lee JSON estático  │    │ • Llama API backend      │
│ • Caché en memoria   │    │   (Node.js o .NET)       │
│ • Datos de prueba    │    │ • Datos reales           │
└──────────────────────┘    └──────────────────────────┘
         │                              │
         ▼                              ▼
┌──────────────────────┐    ┌──────────────────────────┐
│  resumen-municipios  │    │   Backend API            │
│      .json           │    │   (localhost:3000        │
│                      │    │    o producción)         │
└──────────────────────┘    └──────────────────────────┘
```

## Archivos Creados

### 1. Datos Mock
**`src/assets/data/eficiencias/resumen-municipios.json`**
- Contiene datos completos de 2 municipios (Medellín y Bogotá)
- Estructura: `{ "05001": {...}, "11001": {...} }`
- Fácil de expandir agregando más municipios

### 2. Servicio Mock
**`src/app/services/eficiencias-mock.service.ts`**
- Lee datos desde el archivo JSON
- Caché en memoria (carga una sola vez)
- Logging detallado para debugging
- Métodos:
  - `getMunicipios()`: Retorna todos los municipios disponibles
  - `getResumenMunicipio(codigoDane)`: Retorna datos completos de un municipio
  - `getMunicipioByCodigo(codigoDane)`: Retorna solo info básica del municipio

### 3. Servicio Unificado
**`src/app/services/sicodis-api.service.ts`** (modificado)
- Nueva clase: `EficienciasService`
- Constante de configuración: `USE_MOCK_EFICIENCIAS`
- Decide automáticamente qué servicio usar
- Misma interfaz para ambos modos

### 4. Componente Actualizado
**`src/app/components/sgp-eficiencias/sgp-eficiencias.component.ts`** (modificado)
- Ahora inyecta `EficienciasService` en lugar de `SicodisApiService`
- Usa métodos simplificados: `getMunicipios()`, `getResumenMunicipio()`
- No requiere cambios cuando se cambia entre mock/API

## Cómo Usar

### Modo Actual: MOCK (Datos Estáticos)

Por defecto, la aplicación usa datos estáticos.

**Estado actual en `sicodis-api.service.ts` línea ~1848:**
```typescript
export const USE_MOCK_EFICIENCIAS = true;  // ← USANDO MOCK
```

**Ventajas:**
✅ No requiere backend corriendo
✅ Datos siempre disponibles
✅ Ideal para desarrollo y demos
✅ Respuestas instantáneas
✅ **Todos los municipios disponibles** (1,104)
✅ Datos completos para vigencias 2021-2025

**Limitaciones:**
❌ Datos estáticos (snapshot de la BD)
❌ Archivo de 6 MB (puede tardar en cargar la primera vez)
❌ No se actualizan automáticamente (requiere regenerar)

### Cambiar a API Real

Cuando el backend Node.js o .NET esté disponible:

**1. Cambiar el flag en `sicodis-api.service.ts`:**
```typescript
export const USE_MOCK_EFICIENCIAS = false;  // ← USAR API REAL
```

**2. Verificar que el backend esté corriendo:**
- Node.js local: `http://localhost:3000`
- .NET producción: configurar en `proxy.conf.js`

**3. Guardar y Angular recompilará automáticamente**

## Regenerar Datos Mock Desde Base de Datos

Los datos mock incluyen **todos los municipios** (1,104). Si necesitas regenerarlos:

```bash
# Ejecutar script de exportación
cd scripts/db
python export_all_municipios.py
```

Este script:
- Lee todos los municipios de `src/assets/db/eficiencias.db`
- Exporta datos completos de cada municipio
- Genera archivo JSON de ~6 MB
- Reemplaza el archivo existente en `src/assets/data/eficiencias/resumen-municipios.json`

**Cuándo regenerar:**
- Después de actualizar la base de datos SQLite
- Si se agregan nuevos municipios a la BD
- Si cambian los datos en la BD

## Verificar Modo Actual

Abrir DevTools del navegador (F12) → Console:

**Modo MOCK:**
```
📁 EficienciasMockService inicializado - usando datos estáticos
🔧 EficienciasService inicializado en modo: MOCK (datos estáticos)
📥 Cargando datos desde: /assets/data/eficiencias/resumen-municipios.json
✅ Datos cargados y cacheados: 2 municipios
```

**Modo API:**
```
🔧 EficienciasService inicializado en modo: API REAL
```

## Testing

### Probar Modo MOCK

1. Asegurar `USE_MOCK_EFICIENCIAS = true`
2. Abrir `http://localhost:4200/sgp-eficiencia`
3. Seleccionar:
   - Departamento: ANTIOQUIA
   - Municipio: MEDELLÍN
   - Vigencia: 2025
4. Hacer clic en "Aplicar"
5. Verificar que muestre datos correctos de Medellín

### Probar Modo API

1. Iniciar backend: `cd backend && npm run dev`
2. Cambiar `USE_MOCK_EFICIENCIAS = false`
3. Repetir pasos anteriores
4. Debería mostrar los mismos datos (ahora desde API)

## Datos de Referencia Mock

### Municipios Disponibles

**Total: 1,104 municipios** (todos los municipios de Colombia)

Códigos DANE desde **05001** (Medellín) hasta **99773** (Amazonas)

Ejemplos:
| Código DANE | Departamento | Municipio | Vigencias Disponibles |
|-------------|--------------|-----------|----------------------|
| 05001 | ANTIOQUIA | MEDELLÍN | 2021-2025 |
| 11001 | BOGOTA | BOGOTÁ, D.C. | 2021-2025 |
| 76001 | VALLE DEL CAUCA | CALI | 2021-2025 |
| ... | ... | ... | ... |

**Tamaño del archivo:** ~6.1 MB

### Valores Esperados - Medellín (05001) Vigencia 2025

**Eficiencia Fiscal:**
- Per Cápita 2025: $1,034.51
- Per Cápita 2026: $1,252.92
- Crecimiento: +21.12%

**Once Doceavas:**
- Total: $142,560,987,516

**Restricción 50%:**
- $70,394,679,256

**Eficiencia Administrativa:**
- Año Certificado: 2023
- Razón: 0.1192 (11.92%)

## Migración a .NET API

Cuando el API .NET esté disponible:

### 1. Actualizar URL del API

**`proxy.conf.js`:**
```javascript
"/api/eficiencias": {
  "target": "https://api.dnp.gov.co",  // Nueva URL .NET
  "secure": true,
  "changeOrigin": true
}
```

### 2. Cambiar flag

```typescript
export const USE_MOCK_EFICIENCIAS = false;
```

### 3. Verificar interfaces

Si el API .NET tiene estructura diferente, actualizar interfaces en `sicodis-api.service.ts`:

```typescript
export interface ResumenMunicipioEficiencia {
  // Ajustar según respuesta del API .NET
}
```

## Ventajas de esta Estrategia

✅ **Zero-downtime**: Aplicación funciona sin backend
✅ **Fácil migración**: Un solo cambio de flag
✅ **Mismo código**: Componentes no cambian
✅ **Testing**: Probar con mock sin API
✅ **Performance**: Caché automático en modo mock
✅ **Debugging**: Logs claros de qué modo usa
✅ **Expandible**: Agregar municipios sin código

## Notas de Rendimiento

### Tamaño del Archivo

El archivo `resumen-municipios.json` tiene **6.1 MB** con todos los municipios (1,104).

**Impacto:**
- **Primera carga:** El archivo se descarga una sola vez y se cachea en memoria
- **Carga subsecuente:** Instantánea (usa caché)
- **Build de producción:** El archivo se incluye en `/assets` (no afecta bundle principal)
- **Lazy loading:** Angular solo carga el JSON cuando el usuario accede al módulo de eficiencias

**Optimizaciones implementadas:**
- Caché en memoria (una sola lectura HTTP)
- `ensure_ascii=False` reduce tamaño del JSON
- Compresión gzip automática del servidor (reduce a ~800 KB en transmisión)

### Angular Build

El archivo JSON **NO aumenta el tamaño del bundle principal** (`main.js`), porque:
- Está en `/assets`, no en el código TypeScript
- Se carga bajo demanda mediante `HttpClient`
- Solo se descarga cuando el usuario selecciona el módulo de eficiencias

## Soporte

Si encuentras problemas:

1. Verificar consola del navegador (logging detallado)
2. Revisar que el JSON sea válido (validar con `python -m json.tool`)
3. Verificar que el flag `USE_MOCK_EFICIENCIAS` esté correcto
4. Si usa API, verificar que el backend esté corriendo
5. Si el archivo es muy grande, verificar que la red no lo bloquee

### Problemas Comunes

**"Error cargando datos mock"**
- Verificar que el archivo existe en `/assets/data/eficiencias/`
- Revisar DevTools → Network → ¿Falló la petición al JSON?
- Verificar encoding UTF-8 del archivo

**"Municipio XXXXX no encontrado"**
- Regenerar el JSON con `export_all_municipios.py`
- Verificar que el municipio existe en la BD SQLite

---

**Implementado:** 2026-03-23
**Estado:** ✅ Funcionando correctamente
**Municipios:** 1,104 (todos los municipios de Colombia)
**Tamaño:** 6.1 MB (JSON) / ~800 KB (gzipped)
