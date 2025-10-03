# SICODIS

Sistema de Consultas y Distribuciones - Aplicación Angular para visualización de datos del SGP y SGR.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.4.

## Development server

npm install -g @angular/cli

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## SICODIS API Service Integration

### API Service (`SicodisApiService`)

El proyecto incluye un servicio transversal para acceder a la API de SICODIS ubicada en `https://sicodis.dnp.gov.co/apiws/ApiSicodisNew`.

#### Ubicación del Servicio
```
src/app/services/sicodis-api.service.ts
src/app/services/README.md (Documentación detallada)
```

#### Endpoints Disponibles

**SGR Funcionamiento:**
- `funcionamientoSiglasDiccionario()` - Siglas y diccionario combinados
- `getFuentesAsignaciones()` - Fuentes de asignaciones
- `getConceptosFuentes(ids)` - Conceptos por fuentes
- `getDistribucionTotal(params?)` - Distribución total con filtros

**SGR General:**
- `getSgrVigencias()` - Vigencias registradas

**SGP (Sistema General de Participaciones):**
- `getSgpResumenGeneral(anio)` - Resumen general por año
- `getSgpResumenParticipaciones(...)` - Participaciones por entidad
- `getSgpResumenDistribuciones(anio)` - Distribuciones por año
- `getSgpResumenHistorico()` - Datos históricos

#### Uso del Servicio

```typescript
import { SicodisApiService } from '../services/sicodis-api.service';

constructor(private sicodisApiService: SicodisApiService) {}

// Ejemplo de uso
async cargarDatos() {
  try {
    const siglasDiccionario = await this.sicodisApiService.funcionamientoSiglasDiccionario().toPromise();
    const resumenSgp = await this.sicodisApiService.getSgpResumenGeneral(2025).toPromise();
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}
```

### Consideraciones CORS en Desarrollo

**Endpoints que funcionan correctamente:**
- ✅ `/sgrfun/siglas`
- ✅ `/sgrfun/diccionario`
- ✅ Mayoría de endpoints SGP

**Endpoints con restricciones CORS en localhost:**
- ⚠️ `/sgr/vigencias`
- ⚠️ Algunos endpoints SGR adicionales

**Soluciones implementadas:**
1. **Fallback automático**: Los componentes incluyen datos por defecto cuando hay errores CORS
2. **Logging informativo**: Mensajes claros sobre limitaciones de desarrollo
3. **Producción lista**: Los endpoints funcionarán correctamente en producción

### Componentes con Integración API

**reporte-funcionamiento:**
- ✅ Siglas y diccionario desde API
- ✅ Vigencias con fallback automático por CORS
- ✅ Manejo robusto de errores

**Próximas integraciones:**
- Otros componentes pueden usar el mismo servicio para datos dinámicos

### Estructura del Proyecto

```
src/app/
├── services/
│   ├── sicodis-api.service.ts    # Servicio principal de API
│   └── README.md                 # Documentación detallada del servicio
├── components/
│   ├── reporte-funcionamiento/   # Integrado con API
│   ├── sgp-inicio/              # Interfaz principal SGP
│   └── ...                      # Otros componentes
└── ...
```

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Para más información sobre el servicio de API, consulta: `src/app/services/README.md`

--------------

PATH=c:\ws\software\node-v20.18.0-win-x64;%PATH%
