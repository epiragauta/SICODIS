# Componente Mapa de Recursos

## Descripción

Componente de visualización geográfica que muestra la distribución de recursos de SGR, SGP y PGN en Colombia mediante un mapa interactivo con controles de filtrado avanzados.

## Acceso Rápido

**URL:** `http://localhost:4200/mapa-recursos`

**Ruta:** `/mapa-recursos`

## Características Principales

### Panel de Consulta (Lateral Izquierdo)

1. **Filtros de Sistemas**
   - Checkboxes para SGR, SGP, PGN (sin checkbox de Inversión, eliminado por confuso)
   - Todos activos por defecto

2. **Selector de Vigencia**
   - Últimos 10 años disponibles
   - Predeterminado: 2026

3. **Controles de Visualización**
   - Toggle para activar/desactivar capas
   - Controles individuales por sistema:
     - Checkbox de visibilidad
     - Slider de opacidad (0-100%) — afecta la opacidad de ese sistema en los marcadores circulares, no el mapa base
     - Indicador de color

4. **Acciones**
   - Botón "Aplicar filtros"
   - Botón "Limpiar filtros"

5. **Consultas Especiales**
   - Acceso a Resguardos Indígenas (ícono `assets/img/sgp/resguardos/indigenous.png`, preparado para implementación futura)

### Tarjetas de Resumen (Superior)

Tres tarjetas con información agregada. La segunda barra de progreso usa una etiqueta distinta por sistema:
- **SGR:** Presupuesto / Recaudo
- **SGP:** Presupuesto / Distribución
- **PGN:** Presupuesto / Comprometido

Cada tarjeta muestra:
- Icono representativo
- Total en formato abreviado
- Barras de progreso (Presupuesto / etiqueta específica del sistema)
- Texto de cobertura

### Tarjetas de Cobertura (beneficiarios por sistema)

Debajo de las tarjetas de resumen, tres tarjetas con datos de cobertura (municipios/departamentos beneficiarios) tomados del endpoint `resumen_geovisor`, campos `sgr_beneficiados`, `sgp_beneficiados` y `pgn_beneficiados`:
- **SGR:** `dato_general_adirectas_municipio` / `dato_general_regional_depto`
- **SGP:** `dato_general_municipio` / `dato_general_depto`
- **PGN:** `dato_general_municipio` / `dato_general_depto`

Mapeo en `mapearCoberturas()` en el componente. Si el API falla o no retorna estos campos, se usa el fallback estático definido en `COBERTURA_FALLBACK` / `buildCoberturas()`.

### Mapa Interactivo (Central)

- Mapa base: OpenStreetMap
- Librería: Leaflet 1.9.4
- Marcadores en principales ciudades
- Popups con información detallada por municipio
- Controles (mismo tamaño, agrupados visualmente):
  - Zoom +/- (control nativo de Leaflet)
  - Inicio (centrar en Colombia)
  - Mi ubicación (geolocalización)
  - Ayuda (abre el manual de usuario — pendiente definir URL en `MANUAL_USUARIO_URL`)

## Uso del Componente

### Navegación desde Código

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToMap() {
  this.router.navigate(['/mapa-recursos']);
}
```

### Link en Template

```html
<a routerLink="/mapa-recursos">Mapa de Recursos</a>
```

### Link en Menú

```html
<p-menuitem
  label="Mapa de Recursos"
  icon="pi pi-map"
  routerLink="/mapa-recursos">
</p-menuitem>
```

## Estructura de Archivos

```
src/app/components/mapa-recursos/
├── mapa-recursos.component.ts        # Lógica del componente
├── mapa-recursos.component.html      # Template
├── mapa-recursos.component.scss      # Estilos
└── README.md                         # Este archivo
```

## Datos de Ejemplo

El componente actualmente utiliza datos estáticos de ejemplo para 5 ciudades principales:
- Arauca
- Bogotá
- Medellín
- Cali
- Barranquilla

Cada marcador muestra valores de SGP, SGR y PGN al hacer clic.

## Próximas Implementaciones

### Alta Prioridad
- [ ] Integrar con SicodisApiService para datos reales
- [ ] Implementar lógica de aplicación de filtros
- [ ] Agregar efecto visual de opacidad en capas
- [ ] Estados de carga durante consultas

### Media Prioridad
- [ ] Visualización 3D de datos (barras verticales)
- [ ] Clustering de marcadores para muchos datos
- [ ] Capas de calor (heatmaps)
- [ ] Exportación de datos a Excel

### Baja Prioridad
- [ ] Módulo de Resguardos Indígenas
- [ ] Comparación temporal (slider de años)
- [ ] Guardar/compartir vistas
- [ ] Modo de impresión

## Integración con API

### Endpoints Sugeridos

```typescript
// En sicodis-api.service.ts

interface MunicipioRecursos {
  codigo_dane: string;
  nombre: string;
  departamento: string;
  lat: number;
  lng: number;
  sgr?: number;
  sgp?: number;
  pgn?: number;
}

interface FiltrosMapaParams {
  vigencia: number;
  sistemas: string[];  // ['sgr', 'sgp', 'pgn']
  tipoInversion?: string;
}

// Obtener datos geográficos
getMunicipiosRecursos(params: FiltrosMapaParams): Observable<MunicipioRecursos[]> {
  return this.http.get<MunicipioRecursos[]>('/api/mapa/recursos', { params });
}

// Obtener resumen por sistema
getResumenSistemas(vigencia: number): Observable<RecursosSistema[]> {
  return this.http.get<RecursosSistema[]>(`/api/mapa/resumen/${vigencia}`);
}
```

### Implementar en el Componente

```typescript
aplicarFiltros(): void {
  this.isLoading.set(true);

  const params: FiltrosMapaParams = {
    vigencia: this.vigenciaSeleccionada,
    sistemas: this.getSistemasSeleccionados(),
    tipoInversion: this.tipoInversionSeleccionado
  };

  this.sicodisApiService.getMunicipiosRecursos(params).subscribe({
    next: (datos) => {
      this.actualizarMarcadores(datos);
      this.isLoading.set(false);
    },
    error: (error) => {
      console.error('Error al cargar datos:', error);
      this.isLoading.set(false);
    }
  });
}

private getSistemasSeleccionados(): string[] {
  const sistemas: string[] = [];
  if (this.consultaRecursos.sgr) sistemas.push('sgr');
  if (this.consultaRecursos.sgp) sistemas.push('sgp');
  if (this.consultaRecursos.pgn) sistemas.push('pgn');
  return sistemas;
}

private actualizarMarcadores(datos: MunicipioRecursos[]): void {
  // Limpiar marcadores existentes
  this.markers.forEach(marker => marker.remove());
  this.markers = [];

  // Agregar nuevos marcadores
  datos.forEach(municipio => {
    const marker = L.marker([municipio.lat, municipio.lng]).addTo(this.map);
    const popupContent = this.crearPopupContent(municipio);
    marker.bindPopup(popupContent);
    this.markers.push(marker);
  });
}
```

## Personalización de Estilos

### Cambiar Colores de Sistemas

En `mapa-recursos.component.ts`:

```typescript
capas: VisualizacionCapa[] = [
  { sistema: 'SGR', visible: true, opacidad: 80, color: '#TU_COLOR_SGR' },
  { sistema: 'SGP', visible: true, opacidad: 80, color: '#TU_COLOR_SGP' },
  { sistema: 'PGN', visible: true, opacidad: 80, color: '#TU_COLOR_PGN' }
];
```

### Cambiar Fondo de Tarjetas

En `mapa-recursos.component.ts`:

```typescript
recursos: RecursosSistema[] = [
  {
    // ...
    color: '#TU_COLOR_FONDO'
  }
];
```

### Ajustar Tamaño del Panel Lateral

En `mapa-recursos.component.scss`:

```scss
.panel-lateral {
  width: 300px; // Cambiar de 280px a tu preferencia
  // ...
}
```

## Solución de Problemas Comunes

### El mapa no se muestra

**Causa:** Estilos de Leaflet no cargados

**Solución:**
1. Verificar que `@import 'leaflet/dist/leaflet.css';` esté en `styles.scss`
2. Limpiar caché del navegador
3. Ejecutar `npm install` para asegurar dependencias

### Marcadores sin íconos

**Causa:** Imágenes de Leaflet no encontradas

**Solución:**
1. Verificar que existan archivos en `src/assets/leaflet/`
2. Si no existen, ejecutar:
```bash
cp node_modules/leaflet/dist/images/* src/assets/leaflet/
```

### Mapa cortado o desalineado

**Causa:** Contenedor de mapa renderizado antes de estar visible

**Solución:**
```typescript
setTimeout(() => {
  this.map.invalidateSize();
}, 100);
```

### Filtros no funcionan

**Estado:** Los filtros capturan valores pero aún no están conectados a la API

**Próximo paso:** Implementar integración con SicodisApiService

## Performance

### Para Grandes Datasets

Si trabajas con más de 500 marcadores:

1. **Usar Clustering:**
```bash
npm install leaflet.markercluster
```

```typescript
import 'leaflet.markercluster';

const markers = L.markerClusterGroup();
// Agregar marcadores al grupo
this.map.addLayer(markers);
```

2. **Carga Lazy por Viewport:**
```typescript
this.map.on('moveend', () => {
  this.cargarMarcadoresEnVista();
});
```

3. **Canvas en lugar de SVG:**
```typescript
const canvas = L.canvas({ padding: 0.5 });
L.marker([lat, lng], { renderer: canvas }).addTo(this.map);
```

## Testing

### Verificar Manualmente

1. Iniciar servidor: `npm start`
2. Navegar a: `http://localhost:4200/mapa-recursos`
3. Verificar que:
   - Panel lateral se muestra correctamente
   - Tarjetas superiores tienen datos
   - Mapa carga y es interactivo
   - Marcadores tienen popups funcionales
   - Controles responden a clicks

### Test de Responsividad

- Desktop: > 1024px
- Tablet: 768px - 1024px
- Mobile: < 768px

Usar Chrome DevTools para probar diferentes tamaños.

## Contribuir

Para agregar funcionalidades:

1. Leer `docs/mapa-recursos.md` para contexto completo
2. Seguir convenciones de `CLAUDE.md`
3. Mantener tipado estricto de TypeScript
4. Actualizar esta documentación con cambios

## Documentación Adicional

- **Documentación completa:** `docs/mapa-recursos.md`
- **Resumen de implementación:** `docs/mapa-recursos-resumen.md`
- **Guía del proyecto:** `CLAUDE.md`
- **Leaflet Docs:** https://leafletjs.com/reference.html
- **PrimeNG Docs:** https://primeng.org

## Contacto

Para dudas sobre este componente, consultar la documentación del proyecto o revisar el código fuente comentado.

---

**Versión:** 1.0.0
**Estado:** ✅ Funcional con datos de ejemplo
**Última actualización:** 2026-04-10
