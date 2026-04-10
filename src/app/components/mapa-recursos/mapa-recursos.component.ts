import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import * as L from 'leaflet';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

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

@Component({
  selector: 'app-mapa-recursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    DropdownModule,
    SliderModule,
    ButtonModule,
    ProgressBarModule,
    InputSwitchModule,
    NumberFormatPipe
  ],
  templateUrl: './mapa-recursos.component.html',
  styleUrl: './mapa-recursos.component.scss'
})
export class MapaRecursosComponent implements OnInit, AfterViewInit {
  // Panel de consulta
  consultaRecursos = {
    inversion: true,
    sgr: true,
    sgp: true,
    pgn: true
  };

  // Vigencias
  vigenciaSeleccionada = 2025;
  vigencias: number[] = [];

  // Visualización
  visualizacionActiva = true;
  tipoInversionSeleccionado = 'inversion';
  tiposInversion = [
    { label: 'Inversión', value: 'inversion' },
    { label: 'Funcionamiento', value: 'funcionamiento' },
    { label: 'Deuda', value: 'deuda' }
  ];

  // Capas de visualización
  capas: VisualizacionCapa[] = [
    { sistema: 'SGR', visible: true, opacidad: 80, color: '#3b82f6' },
    { sistema: 'SGP', visible: true, opacidad: 80, color: '#10b981' },
    { sistema: 'PGN', visible: true, opacidad: 80, color: '#f59e0b' }
  ];

  // Datos de recursos por sistema
  recursos: RecursosSistema[] = [
    {
      sigla: 'SGR',
      nombre: 'Sistema General de Regalías',
      total: 13700000000,
      presupuesto: 13700000000,
      recaudo: 13015000000,
      cobertura: '1001 municipios (95% del país)',
      icono: 'pi pi-wallet',
      color: '#e0f2fe'
    },
    {
      sigla: 'SGP',
      nombre: 'Sistema General de Participaciones',
      total: 90300000000,
      presupuesto: 90300000000,
      recaudo: 78561000000,
      cobertura: '908 municipios (87% del país)',
      icono: 'pi pi-chart-bar',
      color: '#dcfce7'
    },
    {
      sigla: 'PGN',
      nombre: 'Presupuesto General de la Nación',
      total: 3200000000,
      presupuesto: 3200000000,
      recaudo: 3200000000,
      cobertura: '32 Departamentos (100% del país)',
      icono: 'pi pi-briefcase',
      color: '#fef3c7'
    }
  ];

  // Mapa
  private map!: L.Map;
  private markers: L.Marker[] = [];

  // Loading state
  isLoading = signal(false);

  ngOnInit(): void {
    this.generarVigencias();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  generarVigencias(): void {
    const anioActual = 2025;
    for (let i = 0; i < 10; i++) {
      this.vigencias.push(anioActual - i);
    }
  }

  initMap(): void {
    // Configurar ruta de íconos de Leaflet
    L.Icon.Default.imagePath = 'assets/leaflet/';

    // Inicializar mapa centrado en Colombia
    this.map = L.map('mapaRecursos', {
      center: [4.570868, -74.297333],
      zoom: 6,
      zoomControl: false
    });

    // Agregar capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    // Controles personalizados
    L.control.zoom({
      position: 'topleft'
    }).addTo(this.map);

    // Agregar marcadores de ejemplo
    this.agregarMarcadoresEjemplo();
  }

  agregarMarcadoresEjemplo(): void {
    // Datos de ejemplo para algunos municipios
    const municipiosEjemplo = [
      { nombre: 'Arauca', depto: 'Arauca', lat: 7.0902, lng: -70.7619, sgp: 45454251397.208, sgr: 30471282378.748, pgn: 92259244545.800 },
      { nombre: 'Bogotá', depto: 'Cundinamarca', lat: 4.711, lng: -74.072, sgp: 5500000000000, sgr: 450000000000, pgn: 1200000000000 },
      { nombre: 'Medellín', depto: 'Antioquia', lat: 6.244, lng: -75.581, sgp: 3200000000000, sgr: 280000000000, pgn: 850000000000 },
      { nombre: 'Cali', depto: 'Valle del Cauca', lat: 3.437, lng: -76.522, sgp: 2800000000000, sgr: 195000000000, pgn: 720000000000 },
      { nombre: 'Barranquilla', depto: 'Atlántico', lat: 10.984, lng: -74.797, sgp: 2100000000000, sgr: 175000000000, pgn: 540000000000 }
    ];

    municipiosEjemplo.forEach(municipio => {
      const marker = L.marker([municipio.lat, municipio.lng]).addTo(this.map);

      const popupContent = `
        <div class="popup-mapa">
          <h4>${municipio.nombre} (${municipio.depto})</h4>
          <div class="popup-datos">
            <div class="popup-item">
              <span class="popup-label">Inversión</span>
            </div>
            <div class="popup-item">
              <span class="popup-sistema sgp">SGP</span>
              <span class="popup-valor">$${this.formatearValor(municipio.sgp)}</span>
            </div>
            <div class="popup-item">
              <span class="popup-sistema sgr">SGR</span>
              <span class="popup-valor">$${this.formatearValor(municipio.sgr)}</span>
            </div>
            <div class="popup-item">
              <span class="popup-sistema pgn">PGN</span>
              <span class="popup-valor">$${this.formatearValor(municipio.pgn)}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      this.markers.push(marker);
    });
  }

  formatearValor(valor: number): string {
    if (valor >= 1e9) {
      return `${(valor / 1e9).toFixed(1)}B`;
    } else if (valor >= 1e6) {
      return `${(valor / 1e6).toFixed(1)}M`;
    } else if (valor >= 1e3) {
      return `${(valor / 1e3).toFixed(1)}K`;
    }
    return valor.toString();
  }

  calcularPorcentaje(valor: number, total: number): number {
    return (valor / total) * 100;
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros', {
      consulta: this.consultaRecursos,
      vigencia: this.vigenciaSeleccionada,
      visualizacion: this.visualizacionActiva,
      capas: this.capas
    });

    // Aquí se implementaría la lógica para filtrar los datos del mapa
    // según los parámetros seleccionados
  }

  limpiarFiltros(): void {
    this.consultaRecursos = {
      inversion: true,
      sgr: true,
      sgp: true,
      pgn: true
    };
    this.vigenciaSeleccionada = 2025;
    this.visualizacionActiva = true;
    this.capas.forEach(capa => {
      capa.visible = true;
      capa.opacidad = 80;
    });
  }

  onCapaVisibleChange(capa: VisualizacionCapa): void {
    console.log(`Capa ${capa.sistema} visible:`, capa.visible);
    // Aquí se implementaría la lógica para mostrar/ocultar capas en el mapa
  }

  onCapaOpacidadChange(capa: VisualizacionCapa): void {
    console.log(`Capa ${capa.sistema} opacidad:`, capa.opacidad);
    // Aquí se implementaría la lógica para cambiar la opacidad de las capas
  }

  navegarResguardos(): void {
    console.log('Navegando a consulta de Resguardos Indígenas');
    // Aquí se implementaría la navegación o acción para Resguardos Indígenas
  }

  centrarMapa(): void {
    this.map.setView([4.570868, -74.297333], 6);
  }

  miUbicacion(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.map.setView([lat, lng], 12);
        L.marker([lat, lng]).addTo(this.map)
          .bindPopup('Tu ubicación')
          .openPopup();
      });
    }
  }
}
