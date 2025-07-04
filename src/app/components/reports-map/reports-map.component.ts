import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FloatLabel } from 'primeng/floatlabel';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-reports-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    CardModule,
    ButtonModule,
    DividerModule,
    FloatLabel,
  ],
  templateUrl: './reports-map.component.html',
  styleUrls: ['./reports-map.component.scss']
})
export class ReportsMapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  private map!: Map;
  private vectorSource!: VectorSource;
  private vectorLayer!: VectorLayer<VectorSource>;

  // Opciones para los selectores
  regions: SelectOption[] = [
    { label: 'Región Andina', value: 'andina' },
    { label: 'Región Caribe', value: 'caribe' },
    { label: 'Región Pacífica', value: 'pacifica' },
    { label: 'Región Orinoquía', value: 'orinoquia' },
    { label: 'Región Amazonía', value: 'amazonia' },
    { label: 'Región Insular', value: 'insular' }
  ];

  departments: SelectOption[] = [
    { label: 'Antioquia', value: 'antioquia' },
    { label: 'Bogotá D.C.', value: 'bogota' },
    { label: 'Cundinamarca', value: 'cundinamarca' },
    { label: 'Valle del Cauca', value: 'valle' },
    { label: 'Santander', value: 'santander' },
    { label: 'Atlántico', value: 'atlantico' },
    { label: 'Bolívar', value: 'bolivar' },
    { label: 'Córdoba', value: 'cordoba' },
    { label: 'Magdalena', value: 'magdalena' },
    { label: 'Meta', value: 'meta' },
    { label: 'Norte de Santander', value: 'norte_santander' },
    { label: 'Nariño', value: 'narino' },
    { label: 'Cesar', value: 'cesar' },
    { label: 'Tolima', value: 'tolima' },
    { label: 'Huila', value: 'huila' },
    { label: 'Boyacá', value: 'boyaca' },
    { label: 'Caldas', value: 'caldas' },
    { label: 'Risaralda', value: 'risaralda' },
    { label: 'Quindío', value: 'quindio' },
    { label: 'Sucre', value: 'sucre' },
    { label: 'La Guajira', value: 'la_guajira' },
    { label: 'Cauca', value: 'cauca' },
    { label: 'Caquetá', value: 'caqueta' },
    { label: 'Casanare', value: 'casanare' },
    { label: 'Putumayo', value: 'putumayo' },
    { label: 'Arauca', value: 'arauca' },
    { label: 'Chocó', value: 'choco' },
    { label: 'Amazonas', value: 'amazonas' },
    { label: 'Guainía', value: 'guainia' },
    { label: 'Guaviare', value: 'guaviare' },
    { label: 'Vaupés', value: 'vaupes' },
    { label: 'Vichada', value: 'vichada' },
    { label: 'San Andrés y Providencia', value: 'san_andres' }
  ];

  systems: SelectOption[] = [
    { label: 'Sistema General de Participaciones (SGP)', value: 'sgp' },
    { label: 'Sistema General de Regalías (SGR)', value: 'sgr' }
  ];

  municipalities: SelectOption[] = [
    { label: 'Medellín', value: 'medellin' },
    { label: 'Bogotá', value: 'bogota' },
    { label: 'Cali', value: 'cali' },
    { label: 'Barranquilla', value: 'barranquilla' },
    { label: 'Cartagena', value: 'cartagena' },
    { label: 'Cúcuta', value: 'cucuta' },
    { label: 'Bucaramanga', value: 'bucaramanga' },
    { label: 'Pereira', value: 'pereira' },
    { label: 'Santa Marta', value: 'santa_marta' },
    { label: 'Ibagué', value: 'ibague' },
    { label: 'Manizales', value: 'manizales' },
    { label: 'Villavicencio', value: 'villavicencio' },
    { label: 'Valledupar', value: 'valledupar' },
    { label: 'Montería', value: 'monteria' },
    { label: 'Pasto', value: 'pasto' },
    { label: 'Neiva', value: 'neiva' },
    { label: 'Soledad', value: 'soledad' },
    { label: 'Armenia', value: 'armenia' },
    { label: 'Sincelejo', value: 'sincelejo' },
    { label: 'Floridablanca', value: 'floridablanca' }
  ];

  // Valores seleccionados
  selectedRegion: string = '';
  selectedDepartment: string = '';
  selectedSystem: string = '';
  selectedMunicipality: string = '';

  // Texto descriptivo
  descriptiveText: string = 'Seleccione los filtros para visualizar la distribución de recursos del SGP y SGR en el territorio colombiano. El mapa mostrará información detallada según su selección.';

  // Coordenadas de muestra para departamentos principales
  private departmentCoordinates: { [key: string]: [number, number] } = {
    'antioquia': [-75.5636, 6.2518],
    'bogota': [-74.0721, 4.7110],
    'cundinamarca': [-74.2973, 5.0269],
    'valle': [-76.5225, 3.4516],
    'santander': [-73.1198, 7.1193],
    'atlantico': [-74.7813, 10.7964],
    'bolivar': [-75.5812, 10.3910],
    'cordoba': [-75.8819, 8.7480],
    'magdalena': [-74.2973, 10.4314],
    'meta': [-73.6350, 4.1420]
  };

  ngOnInit(): void {
    // Inicialización del componente
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.dispose();
    }
  }

  private initializeMap(): void {
    // Crear la fuente de vectores
    this.vectorSource = new VectorSource();

    // Crear la capa de vectores
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.createPointStyle()
    });

    // Crear el mapa
    this.map = new Map({
      target: this.mapContainer.nativeElement,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        this.vectorLayer
      ],
      view: new View({
        center: fromLonLat([-74.0721, 4.7110]), // Coordenadas de Colombia (Bogotá)
        zoom: 6
      })
    });

    // Agregar puntos de muestra
    this.addSamplePoints();
  }

  private createPointStyle(): Style {
    return new Style({
      image: new Circle({
        radius: 8,
        fill: new Fill({
          color: '#004583'
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2
        })
      }),
      text: new Text({
        font: '12px Arial',
        fill: new Fill({
          color: '#000000'
        }),
        stroke: new Stroke({
          color: '#ffffff',
          width: 2
        }),
        offsetY: -20
      })
    });
  }

  private addSamplePoints(): void {
    // Agregar puntos de muestra para algunos departamentos
    Object.entries(this.departmentCoordinates).forEach(([dept, coords]) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(coords)),
        name: dept,
        type: 'department'
      });

      feature.setStyle(this.createPointStyle());
      this.vectorSource.addFeature(feature);
    });
  }

  onRegionChange(): void {
    this.updateDescriptiveText();
    this.filterMapData();
  }

  onDepartmentChange(): void {
    this.updateDescriptiveText();
    this.filterMapData();
    this.centerMapOnDepartment();
  }

  onSystemChange(): void {
    this.updateDescriptiveText();
    this.filterMapData();
  }

  onMunicipalityChange(): void {
    this.updateDescriptiveText();
    this.filterMapData();
  }

  private updateDescriptiveText(): void {
    const parts = [];
    
    if (this.selectedRegion) {
      const region = this.regions.find(r => r.value === this.selectedRegion);
      parts.push(`Región: ${region?.label}`);
    }
    
    if (this.selectedDepartment) {
      const dept = this.departments.find(d => d.value === this.selectedDepartment);
      parts.push(`Departamento: ${dept?.label}`);
    }
    
    if (this.selectedSystem) {
      const system = this.systems.find(s => s.value === this.selectedSystem);
      parts.push(`Sistema: ${system?.label}`);
    }
    
    if (this.selectedMunicipality) {
      const mun = this.municipalities.find(m => m.value === this.selectedMunicipality);
      parts.push(`Municipio: ${mun?.label}`);
    }

    if (parts.length > 0) {
      this.descriptiveText = `Visualizando datos para: ${parts.join(', ')}. La información mostrada corresponde a la distribución de recursos territoriales.`;
    } else {
      this.descriptiveText = 'Seleccione los filtros para visualizar la distribución de recursos del SGP y SGR en el territorio colombiano. El mapa mostrará información detallada según su selección.';
    }
  }

  private filterMapData(): void {
    // Limpiar los puntos existentes
    this.vectorSource.clear();

    // Agregar puntos filtrados según la selección
    if (this.selectedDepartment) {
      const coords = this.departmentCoordinates[this.selectedDepartment];
      if (coords) {
        const feature = new Feature({
          geometry: new Point(fromLonLat(coords)),
          name: this.selectedDepartment,
          type: 'department'
        });

        feature.setStyle(this.createPointStyle());
        this.vectorSource.addFeature(feature);
      }
    } else {
      // Si no hay departamento seleccionado, mostrar todos
      this.addSamplePoints();
    }
  }

  private centerMapOnDepartment(): void {
    if (this.selectedDepartment && this.departmentCoordinates[this.selectedDepartment]) {
      const coords = this.departmentCoordinates[this.selectedDepartment];
      this.map.getView().setCenter(fromLonLat(coords));
      this.map.getView().setZoom(8);
    }
  }

  clearFilters(): void {
    this.selectedRegion = '';
    this.selectedDepartment = '';
    this.selectedSystem = '';
    this.selectedMunicipality = '';
    this.updateDescriptiveText();
    this.filterMapData();
    
    // Regresar a la vista inicial
    this.map.getView().setCenter(fromLonLat([-74.0721, 4.7110]));
    this.map.getView().setZoom(6);
  }

  applyFilters(): void {
    this.filterMapData();
    this.centerMapOnDepartment();
  }
}
