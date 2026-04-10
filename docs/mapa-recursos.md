# Componente Mapa de Recursos

## Descripción General

El componente **Mapa de Recursos** (`MapaRecursosComponent`) es una visualización interactiva que muestra la distribución geográfica de los recursos de los tres principales sistemas de transferencias fiscales de Colombia: SGR (Sistema General de Regalías), SGP (Sistema General de Participaciones) y PGN (Presupuesto General de la Nación).

## Ruta de Acceso

```
/mapa-recursos
```

## Estructura del Componente

### Panel Lateral Izquierdo

El panel lateral contiene las siguientes secciones:

#### 1. Consulta de Recursos
Permite seleccionar qué sistemas incluir en la visualización:
- **Inversión** - Checkbox para filtrar por tipo de inversión
- **SGR** - Sistema General de Regalías
- **SGP** - Sistema General de Participaciones
- **PGN** - Presupuesto General de la Nación

#### 2. Selector de Vigencia
Dropdown que permite seleccionar el año de consulta:
- Rango: Últimos 10 años (2016-2025)
- Valor predeterminado: 2025

#### 3. Visualización
Controles para la capa de datos:
- **Toggle de activación** - Activa/desactiva la visualización
- **Tipo de inversión** - Dropdown con opciones:
  - Inversión
  - Funcionamiento
  - Deuda

#### 4. Capas por Sistema
Controles individuales para cada sistema:
- **Checkbox de visibilidad** - Muestra/oculta la capa
- **Indicador de color** - Identifica el color del sistema en el mapa
- **Slider de opacidad** - Controla la transparencia (0-100%)

Colores por defecto:
- SGR: Azul (`#3b82f6`)
- SGP: Verde (`#10b981`)
- PGN: Naranja (`#f59e0b`)

#### 5. Botones de Acción
- **Aplicar filtros** - Ejecuta la consulta con los parámetros seleccionados
- **Limpiar filtros** - Restaura todos los valores a sus estados predeterminados

#### 6. Consulta Especial
Sección expandible con opciones adicionales:
- **Resguardos Indígenas** - Acceso a consulta especializada (prototipo)

#### 7. Notas
Información adicional sobre los datos:
- "Cifras en pesos corrientes"

### Área Central

#### Tarjetas de Resumen
Tres tarjetas horizontales que muestran:

**SGR:**
- Total: $13,7 billones
- Presupuesto: Barra de progreso
- Recaudo: Barra de progreso
- Cobertura: 1001 municipios (95% del país)

**SGP:**
- Total: $90,3 billones
- Presupuesto: Barra de progreso
- Recaudo: Barra de progreso
- Cobertura: 908 municipios (87% del país)

**PGN:**
- Total: $3,2 billones
- Presupuesto: Barra de progreso
- Recaudo: Barra de progreso
- Cobertura: 32 Departamentos (100% del país)

#### Mapa Interactivo

**Características:**
- Mapa base: OpenStreetMap
- Librería: Leaflet 1.9.4
- Centro inicial: Colombia (4.570868, -74.297333)
- Zoom inicial: 6

**Controles:**
- **Inicio** - Centra el mapa en Colombia
- **Mi ubicación** - Centra el mapa en la ubicación del usuario (requiere permisos)
- **Zoom +/-** - Controles estándar de Leaflet

**Marcadores:**
Los marcadores representan municipios con datos de recursos. Al hacer clic en un marcador, se muestra un popup con:
- Nombre del municipio y departamento
- Valores de SGP, SGR y PGN con formato abreviado (B=billones, M=millones)
- Etiquetas con códigos de color por sistema

## Tecnologías Utilizadas

### Dependencias Principales
- **Angular 18.1** - Framework principal
- **PrimeNG 18.0** - Componentes UI
  - Checkbox
  - Dropdown
  - Slider
  - Button
  - ProgressBar
  - InputSwitch
- **Leaflet 1.9.4** - Mapa interactivo
- **NumberFormatPipe** - Formato de números en español

### Interfaces TypeScript

```typescript
interface RecursosSistema {
  sigla: string;
  nombre: string;
  total: number;
  presupuesto: number;
  recaudo: number;
  cobertura: string;
  icono: string;
  color: string;
}

interface VisualizacionCapa {
  sistema: string;
  visible: boolean;
  opacidad: number;
  color: string;
}
```

## Métodos Principales

### `ngOnInit()`
Inicializa el componente y genera la lista de vigencias.

### `ngAfterViewInit()`
Inicializa el mapa de Leaflet después de que la vista se haya renderizado.

### `initMap()`
Configura el mapa con:
- Capa base de OpenStreetMap
- Controles de zoom
- Marcadores de ejemplo

### `aplicarFiltros()`
Aplica los filtros seleccionados en el panel lateral. **Actualmente en desarrollo.**

Parámetros capturados:
- Sistemas seleccionados (SGR, SGP, PGN)
- Vigencia
- Tipo de inversión
- Visibilidad y opacidad de capas

### `limpiarFiltros()`
Restaura todos los filtros a sus valores predeterminados.

### `formatearValor(valor: number): string`
Formatea valores numéricos a notación abreviada:
- Billones: `13700000000` → `"13.7B"`
- Millones: `1500000` → `"1.5M"`
- Miles: `5000` → `"5.0K"`

### `calcularPorcentaje(valor: number, total: number): number`
Calcula el porcentaje para las barras de progreso.

### `navegarResguardos()`
Acción para la consulta especial de Resguardos Indígenas. **Actualmente en desarrollo.**

### `centrarMapa()`
Centra el mapa en la vista inicial de Colombia.

### `miUbicacion()`
Solicita permisos de geolocalización y centra el mapa en la ubicación del usuario.

## Estilos CSS

### Diseño Responsivo
- **Desktop:** Panel lateral (280px) + Área central (flex)
- **Tablet/Mobile:** Diseño en columna, panel lateral con altura máxima de 400px

### Variables de Color
- Fondo principal: `#f8fafc`
- Tarjetas: `white`
- Textos principales: `#1e293b`, `#334155`
- Textos secundarios: `#475569`, `#64748b`
- Bordes: `#e2e8f0`, `#cbd5e1`

### Sombras
```scss
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
```

## Integración con API

### Estado Actual
El componente utiliza datos de ejemplo estáticos.

### Futura Integración
Para conectar con `SicodisApiService`, se deben implementar endpoints para:

1. **Obtener recursos por vigencia:**
```typescript
getSistemasRecursos(vigencia: number): Observable<RecursosSistema[]>
```

2. **Obtener datos geográficos:**
```typescript
getMunicipiosRecursos(vigencia: number, sistemas: string[]): Observable<MunicipioRecursos[]>
```

3. **Filtrar por parámetros:**
```typescript
getRecursosFiltrados(params: FiltrosMapaParams): Observable<DatosMapaRecursos>
```

## Extensiones Futuras

### 1. Visualización 3D
Agregar barras 3D en el mapa proporcionales a los montos de recursos usando plugins de Leaflet como `Leaflet.glify` o `deck.gl`.

### 2. Capas de Calor
Implementar heatmaps para mostrar densidad de recursos por región.

### 3. Comparación Temporal
Slider de tiempo para visualizar evolución de recursos año a año.

### 4. Exportación de Datos
Botón para descargar los datos visualizados en formato Excel/CSV.

### 5. Filtros Avanzados
- Filtrar por rango de montos
- Filtrar por tipo de entidad territorial (municipio, departamento)
- Filtrar por región geográfica (Andina, Caribe, etc.)

### 6. Consulta de Resguardos Indígenas
Capa especializada que muestre:
- Ubicación de resguardos
- Recursos asignados por sistema
- Población beneficiaria
- Proyectos ejecutados

## Uso del Componente

### Navegación Programática
```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

verMapaRecursos() {
  this.router.navigate(['/mapa-recursos']);
}
```

### Link Directo
```html
<a routerLink="/mapa-recursos">Ver Mapa de Recursos</a>
```

## Notas de Desarrollo

### Leaflet en Angular
- Los estilos de Leaflet deben importarse en `angular.json` o `styles.scss`
- Asegurarse de incluir las imágenes de marcadores de Leaflet en `assets/`

### Performance
- Para grandes volúmenes de datos (>1000 marcadores), considerar:
  - Clustering de marcadores con `Leaflet.markercluster`
  - Carga diferida de datos por región visible
  - Canvas rendering en lugar de SVG

### Accesibilidad
- Agregar etiquetas ARIA a controles interactivos
- Asegurar navegación por teclado
- Proveer alternativas textuales para datos visuales

## Troubleshooting

### El mapa no se muestra
1. Verificar que Leaflet esté instalado: `npm list leaflet`
2. Comprobar que los estilos de Leaflet estén importados
3. Revisar la consola para errores de carga de tiles

### Los marcadores no tienen íconos
Copiar las imágenes de marcadores de Leaflet a `src/assets/`:
```bash
cp node_modules/leaflet/dist/images/* src/assets/leaflet/
```

Y configurar la ruta de íconos:
```typescript
L.Icon.Default.imagePath = 'assets/leaflet/';
```

### El mapa se ve cortado o desalineado
Agregar en `ngAfterViewInit`:
```typescript
setTimeout(() => {
  this.map.invalidateSize();
}, 100);
```

## Contacto y Soporte

Para reportar bugs o solicitar funcionalidades, contactar al equipo de desarrollo de SICODIS.
