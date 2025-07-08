import { Component, OnInit, OnDestroy, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { SidebarModule } from 'primeng/sidebar';

// Importar OpenLayers
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Circle, Fill, Stroke } from 'ol/style';

@Component({
  selector: 'app-reports-map',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    ButtonModule,
    CardModule,
    DividerModule,
    PanelModule,
    SidebarModule
  ],
  templateUrl: './reports-map.component.html',
  styleUrl: './reports-map.component.scss'
})
export class ReportsMapComponent implements OnInit, OnDestroy {
  
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  
  // Propiedades del mapa
  private map!: Map;
  private vectorLayer!: VectorLayer<VectorSource>;
  private isBrowser: boolean = false;
  
  // Estado del panel izquierdo
  leftPanelVisible: boolean = true;
  leftPanelCollapsed: boolean = false;
  
  // Estado del panel derecho
  rightPanelVisible: boolean = false;
  
  // Filtros activos
  activeFilters: string[] = [];
  selectedQuery: string = '';
  
  // Opciones de consulta con sus colores (basados en el componente reporte-funcionamiento)
  queryOptions = [
    {
      id: 'regiones',
      label: 'Regiones',
      color: '#3B82F6', // Azul
      active: false
    },
    {
      id: 'municipios',
      label: 'Municipios',
      color: '#10B981', // Verde
      active: false
    },
    {
      id: 'gobernaciones',
      label: 'Gobernaciones',
      color: '#F59E0B', // Amarillo/Naranja
      active: false
    }
  ];
  
  // Estado SGR-SGP
  sgrSgpActive: boolean = false;
  sgrSgpColor: string = '#86EFAC'; // Verde claro
  
  // Resultados simulados
  filterResults: any[] = [];
  
  // Información descriptiva
  descriptiveInfo: string = `
    Utilice los filtros disponibles para consultar información específica sobre la distribución 
    de recursos del Sistema General de Regalías (SGR) y Sistema General de Participaciones (SGP). 
    Seleccione el tipo de consulta que desea realizar y aplique los filtros correspondientes 
    para visualizar los datos en el mapa y en el panel de resultados.
  `;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private el: ElementRef) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Inicialización del componente
    if (this.isBrowser) {
      // Inicializar el mapa después de que la vista se haya renderizado
      setTimeout(() => {
        this.initializeMap();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.setTarget(undefined);
    }
  }

  // Inicializar el mapa de OpenLayers
  private initializeMap(): void {
    // Crear capa de mapa base
    const tileLayer = new TileLayer({
      source: new OSM()
    });

    // Crear capa vectorial para los marcadores
    this.vectorLayer = new VectorLayer({
      source: new VectorSource()
    });

    // Crear el mapa centrado en Colombia
    this.map = new Map({
      target: 'map',
      layers: [tileLayer, this.vectorLayer],
      view: new View({
        center: fromLonLat([-74.0721, 4.7110]), // Coordenadas de Bogotá
        zoom: 6
      })
    });

    // Agregar algunos marcadores de ejemplo
    this.addSampleMarkers();
  }

  // Agregar marcadores de ejemplo
  private addSampleMarkers(): void {
    const sampleLocations = [
      { name: 'Bogotá', coords: [-74.0721, 4.7110], value: 2100000000 },
      { name: 'Medellín', coords: [-75.5636, 6.2442], value: 890000000 },
      { name: 'Cali', coords: [-76.5225, 3.3890], value: 720000000 },
      { name: 'Barranquilla', coords: [-74.7813, 10.9685], value: 650000000 },
      { name: 'Cartagena', coords: [-75.5144, 10.3932], value: 540000000 }
    ];

    sampleLocations.forEach(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(location.coords)),
        name: location.name,
        value: location.value
      });

      // Estilo del marcador basado en el valor
      const style = new Style({
        image: new Circle({
          radius: Math.log(location.value / 1000000) * 2,
          fill: new Fill({ color: 'rgba(59, 130, 246, 0.7)' }),
          stroke: new Stroke({ color: '#3B82F6', width: 2 })
        })
      });

      feature.setStyle(style);
      this.vectorLayer.getSource()?.addFeature(feature);
    });
  }

  // Actualizar marcadores según filtros
  private updateMapMarkers(): void {
    if (!this.vectorLayer) return;

    // Limpiar marcadores existentes
    this.vectorLayer.getSource()?.clear();

    // Agregar nuevos marcadores según la consulta seleccionada
    let locations: any[] = [];

    switch(this.selectedQuery) {
      case 'regiones':
        locations = [
          { name: 'Región Caribe', coords: [-74.7813, 10.9685], value: 1250000000 },
          { name: 'Región Pacífica', coords: [-76.5225, 3.3890], value: 980000000 },
          { name: 'Región Andina', coords: [-74.0721, 4.7110], value: 1450000000 },
          { name: 'Región Orinoquía', coords: [-70.2366, 5.3350], value: 750000000 },
          { name: 'Región Amazonía', coords: [-70.2366, -1.2136], value: 320000000 }
        ];
        break;
      case 'municipios':
        locations = [
          { name: 'Bogotá D.C.', coords: [-74.0721, 4.7110], value: 2100000000 },
          { name: 'Medellín', coords: [-75.5636, 6.2442], value: 890000000 },
          { name: 'Cali', coords: [-76.5225, 3.3890], value: 720000000 },
          { name: 'Barranquilla', coords: [-74.7813, 10.9685], value: 650000000 },
          { name: 'Cartagena', coords: [-75.5144, 10.3932], value: 540000000 }
        ];
        break;
      case 'gobernaciones':
        locations = [
          { name: 'Antioquia', coords: [-75.5636, 6.2442], value: 1800000000 },
          { name: 'Cundinamarca', coords: [-74.0721, 4.7110], value: 1200000000 },
          { name: 'Valle del Cauca', coords: [-76.5225, 3.3890], value: 980000000 },
          { name: 'Santander', coords: [-73.1198, 7.1193], value: 870000000 },
          { name: 'Atlántico', coords: [-74.7813, 10.9685], value: 650000000 }
        ];
        break;
      default:
        // Mostrar marcadores por defecto
        this.addSampleMarkers();
        return;
    }

    // Obtener el color activo para los marcadores
    const activeColor = this.getActiveQueryColor();

    locations.forEach(location => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(location.coords)),
        name: location.name,
        value: location.value
      });

      const style = new Style({
        image: new Circle({
          radius: Math.log(location.value / 1000000) * 2,
          fill: new Fill({ color: activeColor + '70' }), // Agregar transparencia
          stroke: new Stroke({ color: activeColor, width: 2 })
        })
      });

      feature.setStyle(style);
      this.vectorLayer.getSource()?.addFeature(feature);
    });
  }

  // Métodos para manejo del panel izquierdo
  toggleLeftPanel(): void {
    this.leftPanelVisible = !this.leftPanelVisible;
  }

  toggleLeftPanelCollapse(): void {
    this.leftPanelCollapsed = !this.leftPanelCollapsed;
    const elements = this.el.nativeElement.querySelectorAll('.ol-zoom');
    elements[0].style.left = '.5rem';
    if (this.leftPanelCollapsed){      
      elements[0].style.left = '4.9rem';
    }
  }

  // Métodos para manejo de consultas
  selectQuery(queryId: string): void {
    // Resetear todas las opciones
    this.queryOptions.forEach(option => option.active = false);
    
    // Activar la opción seleccionada
    const selectedOption = this.queryOptions.find(option => option.id === queryId);
    if (selectedOption) {
      selectedOption.active = true;
      this.selectedQuery = queryId;
      
      // Simular carga de datos específicos para la consulta
      this.loadQueryData(queryId);
    }
  }

  // Método para activar/desactivar SGR-SGP
  toggleSgrSgp(): void {
    this.sgrSgpActive = !this.sgrSgpActive;
    
    if (this.sgrSgpActive) {
      this.activeFilters.push('SGR-SGP');
    } else {
      this.activeFilters = this.activeFilters.filter(filter => filter !== 'SGR-SGP');
    }
    
    this.updateResults();
  }

  // Método para borrar filtros
  clearFilters(): void {
    this.queryOptions.forEach(option => option.active = false);
    this.sgrSgpActive = false;
    this.selectedQuery = '';
    this.activeFilters = [];
    this.filterResults = [];
    this.rightPanelVisible = false;
    
    // Restaurar marcadores por defecto en el mapa
    if (this.isBrowser && this.map) {
      this.addSampleMarkers();
    }
  }

  // Método para cargar datos de consulta
  loadQueryData(queryType: string): void {
    // Simular datos según el tipo de consulta
    switch(queryType) {
      case 'regiones':
        this.filterResults = [
          { name: 'Región Caribe', value: 1250000000, type: 'región' },
          { name: 'Región Pacífica', value: 980000000, type: 'región' },
          { name: 'Región Andina', value: 1450000000, type: 'región' },
          { name: 'Región Orinoquía', value: 750000000, type: 'región' },
          { name: 'Región Amazonía', value: 320000000, type: 'región' }
        ];
        break;
      case 'municipios':
        this.filterResults = [
          { name: 'Bogotá D.C.', value: 2100000000, type: 'municipio' },
          { name: 'Medellín', value: 890000000, type: 'municipio' },
          { name: 'Cali', value: 720000000, type: 'municipio' },
          { name: 'Barranquilla', value: 650000000, type: 'municipio' },
          { name: 'Cartagena', value: 540000000, type: 'municipio' }
        ];
        break;
      case 'gobernaciones':
        this.filterResults = [
          { name: 'Antioquia', value: 1800000000, type: 'gobernación' },
          { name: 'Cundinamarca', value: 1200000000, type: 'gobernación' },
          { name: 'Valle del Cauca', value: 980000000, type: 'gobernación' },
          { name: 'Santander', value: 870000000, type: 'gobernación' },
          { name: 'Atlántico', value: 650000000, type: 'gobernación' }
        ];
        break;
    }
    
    this.rightPanelVisible = true;
    this.updateResults();
    
    // Actualizar marcadores en el mapa
    if (this.isBrowser && this.map) {
      this.updateMapMarkers();
    }
  }

  // Método para actualizar resultados
  updateResults(): void {
    // Aquí se aplicarían los filtros adicionales como SGR-SGP
    // Por ahora solo mostramos los resultados cargados
    console.log('Filtros activos:', this.activeFilters);
    console.log('Resultados:', this.filterResults);
  }

  // Método para mostrar/ocultar panel derecho
  toggleRightPanel(): void {
    this.rightPanelVisible = !this.rightPanelVisible;
  }

  // Método para obtener el color de la opción activa
  getActiveQueryColor(): string {
    const activeOption = this.queryOptions.find(option => option.active);
    return activeOption ? activeOption.color : '#6B7280';
  }

  // Método para formatear números
  formatNumber(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}