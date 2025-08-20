# SicodisApiService

Servicio transversal para el acceso a la API de SICODIS (`https://sicodis.dnp.gov.co/apiws/ApiSicodisNew`).

## Instalación e Importación

```typescript
import { SicodisApiService } from '../services/sicodis-api.service';
```

## Uso en Componentes

```typescript
constructor(private sicodisApiService: SicodisApiService) {}
```

## Métodos Disponibles

### SGR Funcionamiento

#### `funcionamientoSiglasDiccionario(): Observable<FuncionamientoSiglasDiccionario>`
Obtiene siglas y diccionario en una sola llamada (optimizado para componentes existentes).

```typescript
this.sicodisApiService.funcionamientoSiglasDiccionario().subscribe(data => {
  console.log('Diccionario:', data.diccionario.data);
  console.log('Siglas:', data.siglas.data);
});
```

#### `getFuentesAsignaciones(): Observable<FuenteAsignacion[]>`
Obtiene las fuentes de asignaciones del SGR Funcionamiento.

#### `getConceptosFuentes(idsFuentes: string): Observable<ConceptoFuente[]>`
Obtiene conceptos para fuentes específicas.

```typescript
this.sicodisApiService.getConceptosFuentes('1,2,3').subscribe(conceptos => {
  console.log('Conceptos:', conceptos);
});
```

#### `getDistribucionTotal(params?: DistribucionTotalParams): Observable<DistribucionTotal[]>`
Obtiene distribución total con filtros opcionales.

```typescript
const params = {
  idVigencia: 2025,
  idsFuente: '1,2',
  idsConcepto: '1,2,3'
};
this.sicodisApiService.getDistribucionTotal(params).subscribe(data => {
  console.log('Distribución:', data);
});
```

### SGR General

#### `getSgrVigencias(): Observable<Vigencia[]>`
Obtiene las vigencias registradas del SGR.

### SGP (Sistema General de Participaciones)

#### `getSgpResumenGeneral(anio: number): Observable<ResumenGeneral>`
Resumen general del SGP para un año específico.

```typescript
this.sicodisApiService.getSgpResumenGeneral(2025).subscribe(resumen => {
  console.log('Resumen SGP 2025:', resumen);
});
```

#### `getSgpResumenParticipaciones(anio: number, codigoDepto: string, codigoMunicipio: string): Observable<ResumenParticipaciones>`
Resumen de participaciones por departamento y municipio.

#### `getSgpResumenDistribuciones(anio: number): Observable<ResumenDistribuciones[]>`
Resumen de distribuciones para un año específico.

#### `getSgpResumenHistorico(): Observable<ResumenHistorico[]>`
Datos históricos de precios corrientes y constantes.

```typescript
this.sicodisApiService.getSgpResumenHistorico().subscribe(historico => {
  console.log('Datos históricos:', historico);
});
```

## Interfaces Disponibles

Todas las interfaces están exportadas desde el servicio:

- `DiccionarioItem`
- `SiglasItem`
- `FuenteAsignacion`
- `ConceptoFuente`
- `DistribucionTotal`
- `Vigencia`
- `ResumenGeneral`
- `ResumenParticipaciones`
- `ResumenDistribuciones`
- `ResumenHistorico`
- `DistribucionTotalParams`
- `FuncionamientoSiglasDiccionario`

## Ejemplo Completo

```typescript
import { Component, OnInit } from '@angular/core';
import { SicodisApiService, ResumenGeneral } from '../services/sicodis-api.service';

@Component({
  selector: 'app-mi-componente',
  template: `<div>Datos cargados</div>`
})
export class MiComponente implements OnInit {
  
  constructor(private sicodisApiService: SicodisApiService) {}

  ngOnInit() {
    // Cargar múltiples datos
    this.cargarDatos();
  }

  async cargarDatos() {
    try {
      // Siglas y diccionario
      const siglasDiccionario = await this.sicodisApiService.funcionamientoSiglasDiccionario().toPromise();
      
      // Resumen SGP
      const resumenSgp = await this.sicodisApiService.getSgpResumenGeneral(2025).toPromise();
      
      // Vigencias
      const vigencias = await this.sicodisApiService.getSgrVigencias().toPromise();

      console.log('Todos los datos cargados');
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  }
}
```

## Manejo de Errores

El servicio utiliza HttpClient de Angular, por lo que maneja automáticamente:
- Timeout de requests
- Errores de red
- Respuestas HTTP de error
- Serialización/deserialización JSON

Es recomendable usar try/catch con async/await o catchError con observables para manejar errores específicos.

### Restricciones CORS en Desarrollo

**Nota importante**: Algunos endpoints pueden tener restricciones CORS durante el desarrollo local (localhost:4200):

- ✅ **Funcionan correctamente**: `siglas`, `diccionario`, y la mayoría de endpoints SGP
- ⚠️ **Posibles restricciones CORS**: `vigencias` y algunos endpoints SGR

**Soluciones**:
1. **Desarrollo**: Implementar fallbacks como se hace en el componente reporte-funcionamiento
2. **Producción**: Los endpoints funcionarán correctamente desde el dominio de producción
3. **Proxy**: Configurar un proxy en Angular para desarrollo (opcional)

```typescript
// Ejemplo de manejo con fallback
async cargarDatos() {
  try {
    const vigencias = await this.sicodisApiService.getSgrVigencias().toPromise();
    this.vigencias = vigencias;
  } catch (error) {
    console.warn('CORS error, usando datos por defecto:', error);
    this.vigencias = [{ id: 1, label: "2025 - 2026" }]; // Fallback
  }
}
```