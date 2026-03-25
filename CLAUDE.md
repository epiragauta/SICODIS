# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SICODIS (Sistema de Consultas y Distribuciones) is an Angular 18 application for visualizing data from Colombia's fiscal transfer systems: SGR (Sistema General de Regalías), SGP (Sistema General de Participaciones), and PGN (Presupuesto General de la Nación).

## Build & Development Commands

### Development
```bash
npm install              # Install dependencies
npm start                # Start dev server at http://localhost:4200/
ng serve                 # Alternative dev server command
npm run watch            # Build with watch mode
```

### Testing & Building
```bash
npm test                 # Run unit tests via Karma
npm run build            # Production build to dist/sicodis/
npm run serve:ssr:SICODIS  # Run SSR server from dist/
```

### Code Generation
```bash
ng generate component components/component-name  # New component
ng generate service services/service-name        # New service
ng generate pipe utils/pipe-name                 # New pipe
```

## Architecture

### Technology Stack
- **Framework:** Angular 18.1 with standalone components (no NgModules)
- **UI Libraries:** PrimeNG 18.0 (primary), Angular Material 17.0, Tailwind CSS 3.4.17
- **Charts:** Chart.js 4.4.6 (primary), Highcharts 12.2.0, ngx-gauge
- **Maps:** Leaflet 1.9.4, OpenLayers 10.6.1
- **State:** No centralized store - component-level BehaviorSubjects
- **Auth:** Bearer token with auto-renewal via HTTP interceptor

### Project Structure
```
src/app/
├── components/           # 52 standalone components organized by system
│   ├── sgr-*/           # SGR (Regalías) components
│   ├── sgp-*/           # SGP (Participaciones) components
│   ├── pgn-*/           # PGN (Presupuesto) components
│   └── home/, dashboard/, reports-*
├── services/
│   └── sicodis-api.service.ts  # Single API service (1,252 lines)
├── utils/               # Custom pipes and data utilities
│   ├── numberFormatPipe.ts
│   ├── sgr-functions.ts
│   └── hierarchicalDataStructure.ts
├── data/                # Static reference data
├── app.routes.ts        # 71 route definitions
├── app.config.ts        # DI providers, theme config
├── auth.service.ts      # Token management with auto-renewal
├── auth.interceptor.ts  # Adds Bearer token to requests
└── app.initializer.ts   # Pre-bootstrap token acquisition
```

### Component Categories

**SGR (Sistema General de Regalías):**
- Budget distribution tracking, royalty collection monitoring
- Key components: `reports-sgr/`, `sgr-recaudo-mensual/`, `sgr-plan-bienal-*/`, `sgr-comparativo/`

**SGP (Sistema General de Participaciones):**
- Participations management, distribution by department/municipality
- Key components: `reports-sgp/`, `sgp-inicio/`, `sgp-detalle-presupuestal/`, `sgp-comparativa/`

**PGN (Presupuesto General de la Nación):**
- National budget allocation, regional distribution
- Key components: `pgn-inversion-por-sector/`, `pgn-regionalizacion-*/`, `pgn-seguimiento/`

## Authentication Flow

1. **Bootstrap:** `app.initializer.ts` runs before app start
2. **Token Check:** Validates existing token in localStorage (checks expiry)
3. **Auto-Login:** If invalid/expired → `AuthService.autoLogin()` calls `/apiws/auth/login`
4. **Token Storage:** Bearer token stored with expiry timestamp
5. **Auto-Renewal:** Scheduled at 28 mins (token expires at 30 mins)
6. **Interceptor:** `auth.interceptor.ts` adds `Authorization: Bearer <token>` to all requests except `/auth/login`

**Important:** Public credentials are hardcoded in `auth.service.ts` for development. Not suitable for production without modification.

## API Service Architecture

### File: `src/app/services/sicodis-api.service.ts`

**Organization:**
- 250+ TypeScript interfaces (SGR, SGP, PGN data models)
- 100+ API methods organized by system
- All endpoints proxied through `/api` in development (see `proxy.conf.js`)

**Common Method Patterns:**
```typescript
// Simple GET
getSgpVigencias(): Observable<VigenciaSgp[]>

// GET with path params
getSgpResumenParticipaciones(anio: number, codigoDepto: string, codigoMunicipio: string): Observable<ResumenParticipaciones>

// GET with query params
getSgpResumenHistorico(params?: ResumenHistoricoParams): Observable<ResumenHistorico[]>

// File download
getSgpDescargarArchivo(idArchivo: number): Observable<HttpResponse<Blob>>
```

**Endpoint Structure:**
- SGR: `/api/sgr/*` - Royalties data, vigencias, distribuciones
- SGR Funcionamiento: `/api/sgrfun/*` - Operational reports, siglas, diccionario
- SGP: `/api/sgp/*` - Participations, distribuciones, historical data
- PGN: `/api/pgn/*` - National budget, regionalización, seguimiento

### Development Proxy

`proxy.conf.js` rewrites `/api/*` → `https://sicodis.dnp.gov.co/*`:
- Handles CORS by changing origin
- Modifies cookies for localhost
- Logs all proxy requests/responses for debugging

## Data Handling Patterns

### 1. Hierarchical Data (TreeTables)
```typescript
import { hierarchicalDataStructure } from '../../utils/hierarchicalDataStructure';

// Organize data into expandable tree (1, 1.1, 1.2, etc.)
const treeData = hierarchicalDataStructure.organize(rawData);
```

Pattern: TreeNode format with `data`, `children`, `leaf` properties for PrimeNG TreeTable.

### 2. SGR Functions
```typescript
import * as SgrFunctions from '../../utils/sgr-functions';

// Calculate totals
const totales = SgrFunctions.generarRegistroTotales(dataset);

// Format currency
const formatted = SgrFunctions.formatearValorMonetario(123456789); // "$123.456.789"

// Get execution summary
const resumen = SgrFunctions.getResumenEjecucion(data);
```

### 3. Number Formatting
```typescript
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

@Component({
  imports: [NumberFormatPipe],  // Add to component imports
})

// In template
{{ value | numberFormat }}  // Formats with Spanish locale (dots for thousands)
{{ value | percentFormat }} // Converts 0.1234 → "12.34%"
```

### 4. Typical Component Data Flow
```typescript
// 1. Fetch from API
this.sicodisApiService.getSgpResumenParticipaciones(year, dept, muni).subscribe({
  next: (data) => {
    // 2. Transform data
    this.processedData = this.transformData(data);

    // 3. Build chart/table
    this.createChart();
  },
  error: (error) => {
    console.error('API Error:', error);
    // 4. Fallback to sample data
    this.loadFallbackData();
  }
});
```

**Best Practice:** Always provide fallback data so UI doesn't break if API is unavailable.

## Chart Implementation Patterns

### Chart.js (Most Common)

```typescript
import { Chart } from 'chart.js/auto';

// 1. Destroy existing chart if present
if (this.myChart) {
  this.myChart.destroy();
}

// 2. Create new chart
const ctx = document.getElementById('myChartId') as HTMLCanvasElement;
this.myChart = new Chart(ctx, {
  type: 'bar',
  data: { /* data */ },
  options: { /* options */ }
});
```

**Common Issues:**
- Charts don't auto-resize on container changes
- Use `setTimeout(() => this.createChart(), 500)` after tab switches
- Explicitly set canvas width/height if responsive issues occur

### Gauge Charts
```typescript
// Semicircle gauge using doughnut chart
{
  type: 'doughnut',
  options: {
    rotation: -90,      // Start at bottom
    circumference: 180, // Half circle
    cutout: '75%',      // Inner hole size
  }
}
```

### PrimeNG Charts
```html
<p-chart type="bar" [data]="chartData" [options]="chartOptions"></p-chart>
```
Advantage: Styled consistently with PrimeNG theme, responsive by default.

### Highcharts
```typescript
import * as Highcharts from 'highcharts';

Highcharts.chart('container', {
  chart: { type: 'column' },
  series: [{ data: [1, 2, 3] }]
});
```

## Common Component Patterns

### Filter Cascades (Year → Department → Municipality)
```typescript
onYearChange(year: number) {
  this.selectedYear = year;
  this.loadDepartments();
  this.loadData();
}

onDepartmentChange(deptCode: string) {
  this.selectedDept = deptCode;
  this.loadMunicipalities(deptCode);  // Dependent dropdown
  this.loadData();
}

// Special handling for "All" selection
if (deptCode === '0' || deptCode === '-1') {
  // Load aggregated data
}
```

### Excel File Downloads
```typescript
this.sicodisApiService.getSgpDescargarArchivo(fileId).subscribe({
  next: (response: HttpResponse<Blob>) => {
    const blob = response.body;
    const filename = this.extractFilename(response.headers);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename || 'archivo.xlsx';
    link.click();
  },
  error: (error) => console.error('Download error:', error)
});
```

### Loading States
```typescript
isLoading = signal(false);

loadData() {
  this.isLoading.set(true);
  this.apiService.getData().subscribe({
    next: (data) => {
      this.processData(data);
      this.isLoading.set(false);
    },
    error: () => this.isLoading.set(false)
  });
}
```

## TypeScript Configuration

- **Strict Mode:** Enabled (`strict: true`)
- **Target:** ES2022
- **Module:** ES2022 with bundler resolution
- **Angular Strict Templates:** Enabled

When adding new code, respect strict typing. Avoid `any` - use proper interfaces from `sicodis-api.service.ts`.

## Styling Guidelines

### CSS Architecture
- **PrimeNG Theme:** `src/theme/sicodis-theme.scss` (customized PrimeNG theme)
- **Global Styles:** `src/styles.scss`, `src/assets/styles/global.scss`
- **Tailwind Config:** `tailwind.config.js` with PrimeUI plugin
- **Component Styles:** SCSS files, Angular Material prebuilt theme included

### Responsive Breakpoints (Tailwind)
```
sm: 576px
md: 768px
lg: 992px
xl: 1200px
2xl: 1920px
```

### Color Scheme
Colors are defined in CSS variables within PrimeNG theme. Reference via `var(--primary-color)`, `var(--surface-card)`, etc.

## Important Coding Conventions

### 1. Standalone Components
All components must use `standalone: true` and explicitly declare imports:
```typescript
@Component({
  standalone: true,
  imports: [CommonModule, PrimeNGModule, NumberFormatPipe],
  // ...
})
```

### 2. API Response Interfaces
Always use TypeScript interfaces from `sicodis-api.service.ts`. If adding new endpoints, add interfaces at the top of the file.

### 3. Error Handling
Components should gracefully handle API errors with fallback data:
```typescript
.subscribe({
  error: (error) => {
    console.error('Error:', error);
    this.useFallbackData();
  }
});
```

### 4. Observable Cleanup
Use `takeUntilDestroyed()` or `AsyncPipe` to prevent memory leaks:
```typescript
this.apiService.getData()
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(/* ... */);
```

### 5. Route Parameter Handling
```typescript
import { ActivatedRoute } from '@angular/router';

this.route.params.subscribe(params => {
  const id = params['id'];
  this.loadData(id);
});
```

## Testing

- **Framework:** Jasmine + Karma
- **Run Tests:** `npm test` (opens Chrome browser)
- **Test Files:** `*.spec.ts` files colocated with components

Most components have generated spec files but may need updates after implementation.

## Known Issues & Workarounds

### 1. Chart Resize Issues
**Problem:** Charts don't resize when parent container changes (e.g., tab switch).

**Solution:**
```typescript
setTimeout(() => {
  if (this.myChart) {
    this.myChart.resize();
  }
}, 500);
```

### 2. CORS in Development
**Problem:** Some SGR endpoints have CORS restrictions on localhost.

**Solution:**
- Proxy handles most cases via `proxy.conf.js`
- Use fallback data for restricted endpoints in development
- All endpoints work correctly in production

### 3. TreeTable Performance
**Problem:** Large datasets in TreeTable cause lag.

**Solution:**
- Filter data before building tree
- Use virtual scrolling (`scrollable="true"` with `scrollHeight`)
- Paginate if possible

### 4. Mixed UI Frameworks
**Problem:** PrimeNG, Material, and Tailwind can have style conflicts.

**Solution:**
- Prefer PrimeNG components for consistency
- Use Material only for specific components (grid, tooltip)
- Scope Tailwind classes carefully

## Adding New Features

### New Report Component
1. Generate: `ng generate component components/new-report`
2. Add standalone imports (CommonModule, PrimeNG modules, custom pipes)
3. Inject `SicodisApiService` in constructor
4. Add route in `app.routes.ts`
5. Implement filter dropdowns (Year/Department/Municipality pattern)
6. Add API call with fallback data
7. Create chart/table visualization
8. Add download functionality if needed

### New API Endpoint
1. Add interfaces to top of `sicodis-api.service.ts`
2. Add method to appropriate section (SGR/SGP/PGN)
3. Return typed Observable
4. Test via component or directly in browser console

### New Utility Function
1. Add to `src/app/utils/`
2. Make standalone if pipe: `standalone: true`
3. Export for use in components
4. Document parameters and return types

## Deployment

- **Build Output:** `dist/sicodis/`
- **SSR Server:** `dist/sicodis/server/server.mjs`
- **Production Build:** Optimized, hashed filenames
- **Budget Limits:** 900kB initial warning, 4MB max error

Run `npm run build` before deployment. SSR server requires Node.js runtime.

## Additional Resources

- API Documentation: `src/app/services/README.md` (if exists)
- Angular CLI: `ng help`
- PrimeNG Docs: https://primeng.org
- Chart.js Docs: https://www.chartjs.org

---

**Remember:** This is a public-facing data visualization application. Always consider performance, accessibility, and responsive design when making changes.
