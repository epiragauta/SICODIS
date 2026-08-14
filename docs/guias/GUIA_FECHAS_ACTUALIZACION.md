# Guía de Fechas de Actualización y Corte de Recaudo

## Resumen

Se han agregado configuraciones para gestionar centralmente las **fechas de actualización** y **fechas de corte de recaudo** que antes estaban hardcodeadas en múltiples componentes del sistema SICODIS.

## Fechas Agregadas al ConfigService

### SGR (Sistema General de Regalías)

#### 1. Fechas de Vigencia Actual (2025-2026)
- **Clave**: `sgr_fecha_actualizacion_vigencia_2025_2026`
- **Fecha de actualización**: mayo 30 de 2025
- **Fecha de corte de recaudo**: junio 30 de 2025
- **Componentes afectados**:
  - `sgr-comparativo`
  - `sgr-montos-corrientes-constantes`
  - `sgr-programacion`

#### 2. Fechas de Plan Bienal (2025-2026)
- **Clave**: `sgr_fecha_plan_bienal_2025_2026`
- **Fecha de actualización**: febrero 12 de 2026
- **Fecha de corte de recaudo**: enero 31 de 2026
- **Componentes afectados**:
  - `sgr-plan-bienal-caja`
  - `sgr-plan-bienal-recursos`

#### 3. Diccionario de Fechas por Vigencia (Reporte Funcionamiento)
- **Clave**: `sgr_fechas_reporte_funcionamiento`
- **Vigencias incluidas**: 2012-2013, 2014-2015, 2016-2017, 2018-2019, 2020-2021, 2022-2023, 2024-2025, 2026-2027
- **Componente afectado**: `reporte-funcionamiento`

### SGP (Sistema General de Participaciones)

#### 1. Fechas de Eficiencias
- **Clave**: `sgp_fecha_eficiencias`
- **Fecha de actualización**: octubre 01 de 2025
- **Fecha de corte de recaudo**: 31 de agosto de 2024
- **Componente afectado**: `sgp-eficiencias`

#### 2. Fecha de Resguardos
- **Clave**: `sgp_fecha_resguardos`
- **Fecha de actualización**: mayo 28 de 2026
- **Componente afectado**: `sgp-resguardos`

## Interfaces TypeScript

### FechaActualizacion
```typescript
export interface FechaActualizacion {
  fecha_actualizacion: string; // Formato: "mes día de año"
  fecha_corte_recaudo?: string; // Opcional - solo para componentes de recaudo
  fecha_iso_actualizacion?: string; // Formato ISO para comparaciones
  fecha_iso_corte?: string; // Formato ISO para comparaciones
}
```

### FechasReporteFuncionamiento
```typescript
export interface FechasReporteFuncionamiento {
  vigencia: string;
  fecha_actualizacion: string;
  fecha_corte_recaudo: string;
  fecha_iso_actualizacion: string;
  fecha_iso_corte: string;
}
```

## Métodos Disponibles en ConfigService

### SGR

#### Fechas de Vigencia Actual
```typescript
// Observable
getSgrFechasActualizacion(vigencia: string = '2025-2026'): Observable<FechaActualizacion | null>

// Síncrono
getSgrFechasActualizacionSync(vigencia: string = '2025-2026'): FechaActualizacion | null
```

#### Fechas de Plan Bienal
```typescript
// Observable
getSgrFechasPlanBienal(vigencia: string = '2025-2026'): Observable<FechaActualizacion | null>

// Síncrono
getSgrFechasPlanBienalSync(vigencia: string = '2025-2026'): FechaActualizacion | null
```

#### Diccionario Completo (Reporte Funcionamiento)
```typescript
// Observable - todas las vigencias
getSgrFechasReporteFuncionamiento(): Observable<FechasReporteFuncionamiento[] | null>

// Síncrono - todas las vigencias
getSgrFechasReporteFuncionamientoSync(): FechasReporteFuncionamiento[]

// Síncrono - vigencia específica
getSgrFechasReporteFuncionamientoPorVigencia(vigencia: string): FechasReporteFuncionamiento | null
```

### SGP

#### Fechas de Eficiencias
```typescript
// Observable
getSgpFechasEficiencias(): Observable<FechaActualizacion | null>

// Síncrono
getSgpFechasEficienciasSync(): FechaActualizacion | null
```

#### Fecha de Resguardos
```typescript
// Observable
getSgpFechaResguardos(): Observable<FechaActualizacion | null>

// Síncrono
getSgpFechaResguardosSync(): FechaActualizacion | null
```

## Ejemplos de Migración

### Ejemplo 1: sgr-comparativo.component.ts

**ANTES** (hardcodeado):
```html
<!-- sgr-comparativo.component.html -->
<p class="text-xs text-gray-500 mt-1">
  Fecha de actualización: junio 30 de 2025
</p>
<p class="text-xs text-gray-500">
  Fecha de corte de recaudo: mayo 30 de 2025
</p>
```

**DESPUÉS** (usando ConfigService):
```typescript
// sgr-comparativo.component.ts
import { ConfigService, FechaActualizacion } from '../../services/config.service';

export class SgrComparativoComponent implements OnInit {
  fechas: FechaActualizacion | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.fechas = this.configService.getSgrFechasActualizacionSync();
  }
}
```

```html
<!-- sgr-comparativo.component.html -->
<p class="text-xs text-gray-500 mt-1" *ngIf="fechas">
  Fecha de actualización: {{ fechas.fecha_actualizacion }}
</p>
<p class="text-xs text-gray-500" *ngIf="fechas">
  Fecha de corte de recaudo: {{ fechas.fecha_corte_recaudo }}
</p>
```

### Ejemplo 2: sgr-plan-bienal-caja.component.ts

**ANTES** (hardcodeado):
```html
<p class="text-xs text-gray-500">
  Fecha de actualización: febrero 12 de 2026
</p>
<p class="text-xs text-gray-500">
  Fecha de corte: enero 31 de 2026
</p>
```

**DESPUÉS** (usando ConfigService):
```typescript
// sgr-plan-bienal-caja.component.ts
export class SgrPlanBienalCajaComponent implements OnInit {
  fechas: FechaActualizacion | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.fechas = this.configService.getSgrFechasPlanBienalSync();
  }
}
```

```html
<p class="text-xs text-gray-500" *ngIf="fechas">
  Fecha de actualización: {{ fechas.fecha_actualizacion }}
</p>
<p class="text-xs text-gray-500" *ngIf="fechas">
  Fecha de corte: {{ fechas.fecha_corte_recaudo }}
</p>
```

### Ejemplo 3: sgp-eficiencias.component.ts

**ANTES** (hardcodeado):
```html
<p class="text-xs text-gray-500">
  Fecha de actualización: octubre 01 de 2025
</p>
<p class="text-xs text-gray-500">
  Corte: 31 de agosto de 2024
</p>
```

**DESPUÉS** (usando ConfigService):
```typescript
// sgp-eficiencias.component.ts
export class SgpEficienciasComponent implements OnInit {
  fechas: FechaActualizacion | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    this.fechas = this.configService.getSgpFechasEficienciasSync();
  }
}
```

```html
<p class="text-xs text-gray-500" *ngIf="fechas">
  Fecha de actualización: {{ fechas.fecha_actualizacion }}
</p>
<p class="text-xs text-gray-500" *ngIf="fechas">
  Corte: {{ fechas.fecha_corte_recaudo }}
</p>
```

### Ejemplo 4: sgp-resguardos.component.ts

**ANTES** (hardcodeado):
```html
<p class="text-sm text-muted-foreground">
  Fecha de actualización: mayo 28 de 2026
</p>
```

**DESPUÉS** (usando ConfigService):
```typescript
// sgp-resguardos.component.ts
export class SgpResguardosComponent implements OnInit {
  fechaActualizacion: string = '';

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    const fechas = this.configService.getSgpFechaResguardosSync();
    if (fechas) {
      this.fechaActualizacion = fechas.fecha_actualizacion;
    }
  }
}
```

```html
<p class="text-sm text-muted-foreground" *ngIf="fechaActualizacion">
  Fecha de actualización: {{ fechaActualizacion }}
</p>
```

### Ejemplo 5: reporte-funcionamiento.component.ts (Diccionario por Vigencia)

**ANTES** (hardcodeado):
```typescript
const dictionary = {
  '2012-2013': { fecha_actualizacion: 'diciembre 31 de 2013', fecha_corte: 'diciembre 31 de 2013' },
  '2014-2015': { fecha_actualizacion: 'diciembre 31 de 2015', fecha_corte: 'diciembre 31 de 2015' },
  // ... más vigencias
};
```

**DESPUÉS** (usando ConfigService):
```typescript
// reporte-funcionamiento.component.ts
export class ReporteFuncionamientoComponent implements OnInit {
  fechasPorVigencia: FechasReporteFuncionamiento[] = [];
  fechasVigenciaActual: FechasReporteFuncionamiento | null = null;

  constructor(private configService: ConfigService) {}

  ngOnInit(): void {
    // Obtener todas las fechas
    this.fechasPorVigencia = this.configService.getSgrFechasReporteFuncionamientoSync();

    // O bien, obtener fechas de una vigencia específica
    const vigenciaActual = '2025-2026';
    this.fechasVigenciaActual = this.configService.getSgrFechasReporteFuncionamientoPorVigencia(vigenciaActual);
  }
}
```

## Gestión desde Panel de Administración

Las fechas podrán ser editadas desde el **Panel de Administración** (`/admin-config`) en el tab de **"Fechas y Vigencias"**.

### Formulario de Edición

El formulario permitirá:
1. Seleccionar el sistema (SGR/SGP/PGN)
2. Seleccionar el tipo de fecha (Vigencia actual, Plan bienal, Eficiencias, etc.)
3. Editar la fecha de actualización (formato texto y fecha ISO)
4. Editar la fecha de corte de recaudo (si aplica)
5. Ver una vista previa del formato de fecha

### Validaciones

- Las fechas ISO deben coincidir con las fechas en texto
- Las fechas de corte deben ser posteriores o iguales a las de actualización
- Las fechas deben estar en el formato correcto: "mes día de año"

## Componentes Pendientes de Migración

### SGR (6 componentes)
- [ ] `sgr-comparativo` - Usar `getSgrFechasActualizacionSync()`
- [ ] `sgr-montos-corrientes-constantes` - Usar `getSgrFechasActualizacionSync()`
- [ ] `sgr-programacion` - Usar `getSgrFechasActualizacionSync()`
- [ ] `sgr-plan-bienal-caja` - Usar `getSgrFechasPlanBienalSync()`
- [ ] `sgr-plan-bienal-recursos` - Usar `getSgrFechasPlanBienalSync()`
- [ ] `reporte-funcionamiento` - Usar `getSgrFechasReporteFuncionamientoSync()`

### SGP (2 componentes)
- [ ] `sgp-eficiencias` - Usar `getSgpFechasEficienciasSync()`
- [ ] `sgp-resguardos` - Usar `getSgpFechaResguardosSync()`

## Beneficios de la Migración

1. **Gestión centralizada**: Las fechas se actualizan desde un único lugar
2. **Sin re-deploy**: Cambios se aplican instantáneamente sin necesidad de recompilar
3. **Consistencia**: Todas las instancias muestran las mismas fechas
4. **Auditoría**: Se registra quién y cuándo cambió cada fecha
5. **Rollback**: Se puede revertir a versiones anteriores si es necesario
6. **Validación**: El formulario valida formatos y coherencia de fechas

## Próximos Pasos

1. ✅ **Extender ConfigService** - COMPLETADO
2. ⏳ **Crear formulario de edición de fechas** - Pendiente (Sprint 3)
3. ⏳ **Migrar componentes SGR** - Pendiente (Sprint 5-6)
4. ⏳ **Migrar componentes SGP** - Pendiente (Sprint 6)
5. ⏳ **Tests de integración** - Pendiente (Sprint 8)

## Notas Técnicas

### Formato de Fechas

Se mantienen **dos formatos** para cada fecha:
- **Formato texto**: Para mostrar al usuario (ej: "mayo 30 de 2025")
- **Formato ISO**: Para comparaciones y validaciones (ej: "2025-05-30")

Esto permite:
- Mantener la presentación en español tal como está actualmente
- Facilitar validaciones y comparaciones programáticas
- Permitir futuras funcionalidades como alertas de fechas próximas a vencer

### Fallbacks

Todos los métodos sincrónicos (`*Sync()`) incluyen valores por defecto, garantizando que:
- El sitio NUNCA se rompe si falta una configuración
- Siempre hay fechas para mostrar al usuario
- Los componentes pueden funcionar independientemente del estado del ConfigService

### Extensibilidad

La estructura es fácilmente extensible para:
- Agregar más vigencias (solo crear nuevas configuraciones)
- Agregar más sistemas (PGN también puede usar este patrón)
- Agregar más tipos de fechas (plazos de entrega, fechas de publicación, etc.)
