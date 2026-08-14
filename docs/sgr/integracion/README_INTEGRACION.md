# Integración de Datos SGR - Presupuesto vs Recaudo Bienio 2025-2026

## ✅ Archivos Integrados

Los siguientes archivos JSON han sido copiados a este directorio:

- ✅ `entidades.json` (529 KB) - Catálogo de 1,238 entidades
- ✅ `presupuesto_detalle.json` (7.0 MB) - 6,963 registros de presupuesto
- ✅ `jerarquias.json` (21 KB) - 1,120 relaciones jerárquicas
- ✅ `resumen_agregado.json` (13 KB) - Totales pre-calculados

## 📊 Datos Disponibles

### Totales Nacionales (Bienio 2025-2026)
- **Presupuesto Total**: $67,292,719,995,246 COP
- **Caja Total**: $54,950,286,224,102 COP
- **Avance Promedio**: 74.92%
- **Total Entidades**: 1,238

### Distribución por Tipo
| Tipo | Cantidad |
|------|----------|
| Municipio | 1,103 |
| Gobernación | 32 |
| Otros | 76 |
| Corporación | 9 |
| Región | 6 |
| Étnicos | 3 |
| Agrupadores | 9 |

## 🔧 Componentes Creados

### 1. Modelos TypeScript
**Ubicación**: `src/app/models/sgr-presupuesto.models.ts`

Contiene interfaces para:
- `Entidad` - Información de entidades (municipios, departamentos, etc.)
- `RegistroPresupuesto` - Datos de presupuesto y recaudo
- `ComponentesPresupuesto` - 13 componentes de presupuesto
- `ComponentesRecaudo` - Componentes de recaudo
- `DatosAgregados` - Datos calculados y agregados
- `PresupuestoUtils` - Clase con funciones de cálculo y formato

### 2. Servicio
**Ubicación**: `src/app/services/sgr-presupuesto.service.ts`

Métodos principales:
```typescript
// Obtener datos base
getEntidades(): Observable<Entidad[]>
getPresupuesto(): Observable<RegistroPresupuesto[]>
getResumen(): Observable<ResumenAgregadoResponse>
getJerarquias(): Observable<any>

// Obtener datos procesados
getDatosAgregados(filtros?: FiltrosSGR): Observable<DatosAgregados>
getPresupuestoAgregadoPorEntidad(filtros?: FiltrosSGR): Observable<any[]>
getSerieTemporalAvance(filtros?: FiltrosSGR): Observable<any>

// Búsqueda y filtros
buscarEntidades(termino: string): Observable<Entidad[]>
getEntidadesPorTipo(tipo: string): Observable<Entidad[]>
getMunicipiosPorDepartamento(codigoDepartamento: string): Observable<Entidad[]>
```

### 3. Componente Actualizado
**Ubicación**: `src/app/components/sgr-informacion-general/`

El componente ha sido actualizado para:
- ✅ Cargar datos reales desde los archivos JSON
- ✅ Aplicar filtros dinámicamente
- ✅ Calcular métricas agregadas
- ✅ Actualizar gráficas con datos reales
- ✅ Manejar estados de carga y errores

## 🚀 Uso del Servicio

### Ejemplo 1: Obtener Datos Generales
```typescript
import { SgrPresupuestoService } from '../../services/sgr-presupuesto.service';

constructor(private sgrService: SgrPresupuestoService) {}

ngOnInit() {
  // Obtener datos agregados sin filtros
  this.sgrService.getDatosAgregados().subscribe(datos => {
    console.log('Presupuesto Total:', datos.presupuestoTotal);
    console.log('Recaudo Total:', datos.recaudoTotal);
    console.log('Avance:', datos.avancePromedio);
  });
}
```

### Ejemplo 2: Aplicar Filtros
```typescript
// Filtrar solo municipios PDET
const filtros: FiltrosSGR = {
  tipoEntidad: 'Municipio',
  pdet: true
};

this.sgrService.getDatosAgregados(filtros).subscribe(datos => {
  console.log('Municipios PDET:', datos.entidadesCount.beneficiarias);
  console.log('Presupuesto PDET:', datos.presupuestoTotal);
});
```

### Ejemplo 3: Buscar Entidades
```typescript
// Buscar por nombre o código
this.sgrService.buscarEntidades('Medellín').subscribe(entidades => {
  entidades.forEach(e => {
    console.log(`${e.nombre} (${e.codigo}) - ${e.tipo}`);
  });
});
```

### Ejemplo 4: Usar Funciones de Formato
```typescript
import { PresupuestoUtils } from '../models/sgr-presupuesto.models';

// Formatear moneda
const monto = 67292719995246;
const formateado = PresupuestoUtils.formatearMoneda(monto);
// Result: "$67.292.719.995.246"

// Formatear porcentaje
const avance = 0.7492;
const porcentaje = PresupuestoUtils.formatearPorcentaje(avance);
// Result: "74,92%"

// Calcular totales
const presupuestoTotal = PresupuestoUtils.calcularPresupuestoTotal(registro.presupuesto);
const cajaTotal = PresupuestoUtils.calcularCajaTotal(registro.recaudo);
const avanceTotal = PresupuestoUtils.calcularAvanceTotal(registro.presupuesto, registro.recaudo);
```

## 🔍 Filtros Disponibles

```typescript
interface FiltrosSGR {
  periodicidad?: string;      // 'Bienal', 'Anual'
  tipoEntidad?: string;        // 'Municipio', 'Gobernación', etc.
  region?: string;             // 'Región Caribe', etc.
  productor?: boolean | null;  // true, false, null (sin filtro)
  pdet?: boolean | null;
  zomac?: boolean | null;
  conceptoGasto?: string;      // 'Inversión', 'Ahorro', 'Administración'
}
```

## 📈 Estructura de Datos Derivados

Los datos derivados NO están almacenados en los JSON (para evitar inconsistencias). Se calculan usando:

```typescript
// En TypeScript (Angular)
PresupuestoUtils.calcularPresupuestoTotal(componentes)
PresupuestoUtils.calcularCajaTotal(recaudo)
PresupuestoUtils.calcularAvanceTotal(presupuesto, recaudo)

// O directamente en el servicio
sgrService.getDatosAgregados(filtros) // Ya retorna datos calculados
```

### Fórmulas
```typescript
presupuesto_total = suma de 13 componentes (corriente + disponibilidad_inicial + ...)
caja_total = recaudo_corriente + recaudo_otros
avance_total = caja_total / presupuesto_total
avance_recaudo_corriente = recaudo_corriente / presupuesto_corriente
```

## ⚙️ Configuración Requerida

### 1. Verificar HttpClientModule

Asegurarse de que `HttpClientModule` esté configurado en `app.config.ts`:

```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    // ... otros providers
  ]
};
```

O si usas módulos tradicionales en `app.module.ts`:

```typescript
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule,
    // ... otros módulos
  ]
})
export class AppModule { }
```

### 2. Verificar que los archivos JSON sean accesibles

Los archivos JSON deben estar en:
```
src/assets/data/sgr/
├── entidades.json
├── presupuesto_detalle.json
├── jerarquias.json
└── resumen_agregado.json
```

Al compilar, Angular copiará estos archivos a `dist/assets/data/sgr/`

## 🧪 Testing

El servicio incluye manejo de errores:

```typescript
this.sgrService.getEntidades().subscribe({
  next: (entidades) => {
    // Datos cargados exitosamente
  },
  error: (error) => {
    console.error('Error al cargar entidades:', error);
    // El servicio retorna un array vacío en caso de error
  }
});
```

## 🔄 Actualización Mensual

Para actualizar los datos mensualmente:

1. Ejecutar proceso de normalización en el proyecto Python
2. Copiar nuevos archivos JSON a `src/assets/data/sgr/`
3. Recompilar la aplicación Angular

```bash
# Desde el directorio Python
python ejecutar_normalizacion_completa.py

# Copiar archivos actualizados
cp json_output/*.json <proyecto-angular>/src/assets/data/sgr/

# Recompilar Angular
ng build
```

## 📝 Notas Importantes

1. **Tamaño de archivos**: `presupuesto_detalle.json` es ~7 MB. Considerar implementar paginación o lazy loading si el rendimiento es un problema.

2. **Cache**: El servicio implementa cache con `shareReplay(1)` para evitar múltiples peticiones HTTP a los mismos archivos.

3. **Filtros reactivos**: El servicio incluye un `BehaviorSubject` para manejar filtros de forma reactiva.

4. **Datos temporales**: La serie temporal de avance se genera de forma simulada. Para datos reales mensuales, se requiere integración con backend.

5. **Formato de fechas**: El campo `mesActualizacion` en registros tiene formato `YYYY-MM`.

## 🐛 Solución de Problemas

### Error: "Cannot find module 'assets/data/sgr/entidades.json'"
- Verificar que los archivos existan en `src/assets/data/sgr/`
- Ejecutar `ng build` o `ng serve` nuevamente

### Error: "NullInjectorError: No provider for HttpClient"
- Agregar `provideHttpClient()` en `app.config.ts`

### Los datos no se cargan
- Abrir DevTools → Network → verificar que las peticiones HTTP a los JSON sean exitosas
- Verificar la consola del navegador por errores

### Filtros no funcionan
- Verificar que los valores de filtro coincidan exactamente con los valores en JSON
- Ejemplo: usar `'Municipio'` no `'municipio'` (case-sensitive)

## 📚 Documentación Adicional

Para más información sobre el proceso de normalización y estructura de datos:
- `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\README_NORMALIZACION.md`
- `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\RESUMEN_NORMALIZACION_COMPLETADA.md`
- `C:\ws\dnp\ws\data\sgr-presupuesto-recaudo\EJEMPLOS_ANGULAR.md`

---

**Integración completada el**: 2026-06-02
**Versión de datos**: 1.0 (Bienio 2025-2026)
