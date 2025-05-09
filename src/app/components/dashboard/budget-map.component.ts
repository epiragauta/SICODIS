import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

// Declaramos la variable L para Leaflet
declare let L: any;

@Component({
  selector: 'app-budget-map',
  templateUrl: './budget-map.component.html',
  styleUrls: ['./budget-map.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CardModule
  ]
})
export class BudgetMapComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() budgetData: any[] = [];

  private map: any;
  private isMapInitialized = false;
  private markers: any[] = [];

  // Colores para el mapa, coinciden con los del gráfico
  mapColors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E'
  ];

  // Departamentos de Colombia con coordenadas geográficas aproximadas
  departamentos = [
    { nombre: 'Amazonas', lat: -1.0, lng: -71.3, presupuesto: 0 },
    { nombre: 'Antioquia', lat: 7.0, lng: -75.5, presupuesto: 0 },
    { nombre: 'Arauca', lat: 6.5, lng: -70.7, presupuesto: 0 },
    { nombre: 'Atlántico', lat: 10.9, lng: -74.8, presupuesto: 0 },
    { nombre: 'Bolívar', lat: 8.6, lng: -74.0, presupuesto: 0 },
    { nombre: 'Boyacá', lat: 5.4, lng: -73.4, presupuesto: 0 },
    { nombre: 'Caldas', lat: 5.1, lng: -75.5, presupuesto: 0 },
    { nombre: 'Caquetá', lat: 1.6, lng: -75.3, presupuesto: 0 },
    { nombre: 'Casanare', lat: 5.3, lng: -72.4, presupuesto: 0 },
    { nombre: 'Cauca', lat: 2.5, lng: -76.6, presupuesto: 0 },
    { nombre: 'Cesar', lat: 9.3, lng: -73.6, presupuesto: 0 },
    { nombre: 'Chocó', lat: 5.7, lng: -76.6, presupuesto: 0 },
    { nombre: 'Córdoba', lat: 8.3, lng: -75.6, presupuesto: 0 },
    { nombre: 'Cundinamarca', lat: 5.0, lng: -74.0, presupuesto: 0 },
    { nombre: 'Guainía', lat: 2.6, lng: -68.5, presupuesto: 0 },
    { nombre: 'Guaviare', lat: 2.5, lng: -72.7, presupuesto: 0 },
    { nombre: 'Huila', lat: 2.5, lng: -75.5, presupuesto: 0 },
    { nombre: 'La Guajira', lat: 11.5, lng: -72.9, presupuesto: 0 },
    { nombre: 'Magdalena', lat: 10.4, lng: -74.4, presupuesto: 0 },
    { nombre: 'Meta', lat: 3.9, lng: -73.0, presupuesto: 0 },
    { nombre: 'Nariño', lat: 1.2, lng: -77.3, presupuesto: 0 },
    { nombre: 'Norte de Santander', lat: 8.3, lng: -73.3, presupuesto: 0 },
    { nombre: 'Putumayo', lat: 0.4, lng: -76.6, presupuesto: 0 },
    { nombre: 'Quindío', lat: 4.5, lng: -75.7, presupuesto: 0 },
    { nombre: 'Risaralda', lat: 5.3, lng: -76.0, presupuesto: 0 },
    { nombre: 'San Andrés y Providencia', lat: 12.5, lng: -81.7, presupuesto: 0 },
    { nombre: 'Santander', lat: 7.1, lng: -73.1, presupuesto: 0 },
    { nombre: 'Sucre', lat: 9.3, lng: -75.4, presupuesto: 0 },
    { nombre: 'Tolima', lat: 4.4, lng: -75.2, presupuesto: 0 },
    { nombre: 'Valle del Cauca', lat: 3.8, lng: -76.5, presupuesto: 0 },
    { nombre: 'Vaupés', lat: 0.8, lng: -70.2, presupuesto: 0 },
    { nombre: 'Vichada', lat: 4.4, lng: -69.8, presupuesto: 0 },
    { nombre: 'Bogotá D.C.', lat: 4.6, lng: -74.1, presupuesto: 0 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Asignamos presupuestos aleatorios para simular la distribución
    this.assignRandomBudget();
  }

  ngAfterViewInit(): void {
    // Inicializamos el mapa después de que la vista esté disponible
    setTimeout(() => {
      this.initializeMap();
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['budgetData'] && this.budgetData && this.budgetData.length > 0) {
      // Cuando los datos cambien, actualizamos el mapa
      this.assignRandomBudget();
      if (this.isMapInitialized) {
        this.updateMapMarkers();
      }
    }
  }

  initializeMap(): void {
    console.log('Inicializando el mapa...');
    // Verificamos si estamos en un navegador y si Leaflet está disponible
    if (typeof window !== 'undefined' && typeof L !== 'undefined') {
      try {
        // Creamos el mapa centrado en Colombia
        this.map = L.map('budget-map').setView([4.5, -74.3], 5);

        // Añadimos el layer de OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Marcamos que el mapa ya está inicializado
        this.isMapInitialized = true;

        // Añadimos los marcadores de los departamentos
        this.updateMapMarkers();

      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        // Mostramos un mensaje de error en el contenedor del mapa
        const mapElement = document.getElementById('budget-map');
        if (mapElement) {
          mapElement.innerHTML = '<div class="map-error">Error al cargar el mapa. Por favor, recargue la página.</div>';
        }
      }
    } else {
      // Si Leaflet no está disponible, mostrar un placeholder
      console.log('Leaflet no está disponible. Asegúrese de incluir la biblioteca en su proyecto.');
      const mapElement = document.getElementById('budget-map');
      if (mapElement) {
        mapElement.innerHTML = '<div class="map-placeholder">Mapa de Colombia con distribución del SGP</div>';
      }
    }
  }

  updateMapMarkers(): void {
    // Si el mapa no está inicializado, no hacemos nada
    if (!this.isMapInitialized || !this.map) {
      return;
    }

    // Limpiamos los marcadores existentes
    this.clearMarkers();

    // Calculamos el presupuesto máximo para escalar los tamaños de los círculos
    const maxPresupuesto = Math.max(...this.departamentos.map(dep => dep.presupuesto));

    // Añadimos los nuevos marcadores
    this.departamentos.forEach((departamento, index) => {
      // Tamaño del círculo proporcional al presupuesto (entre 10 y 40 píxeles)
      const radius = 10 + (departamento.presupuesto / maxPresupuesto) * 30;

      // Color del círculo basado en el índice (cíclico)
      const colorIndex = index % this.mapColors.length;
      const color = this.mapColors[colorIndex];

      // Creamos el círculo
      const circle = L.circleMarker([departamento.lat, departamento.lng], {
        radius: radius,
        fillColor: color,
        color: '#fff',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      }).addTo(this.map);

      // Añadimos popup con información
      circle.bindPopup(`
        <strong>${departamento.nombre}</strong><br>
        Presupuesto SGP: ${this.formatCurrency(departamento.presupuesto)}
      `);

      // Guardamos el marcador para poder eliminarlo después
      this.markers.push(circle);
    });
  }

  clearMarkers(): void {
    // Eliminamos todos los marcadores existentes
    this.markers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });

    // Reiniciamos el array de marcadores
    this.markers = [];
  }

  assignRandomBudget(): void {
    // Para simular datos, asignamos presupuestos aleatorios a los departamentos
    const totalSGP = this.budgetData.find(item => item.desc === 'Total SGP')?.value || 0;

    // Distribuimos el presupuesto total entre los departamentos de forma aleatoria
    let remainingBudget = totalSGP;

    // Asignamos un porcentaje aleatorio a cada departamento
    this.departamentos.forEach((dep, index) => {
      if (index === this.departamentos.length - 1) {
        // El último departamento recibe el resto del presupuesto
        dep.presupuesto = remainingBudget;
      } else {
        // Calculamos un porcentaje aleatorio entre 1% y 10% del presupuesto restante
        const percentage = 0.01 + Math.random() * 0.09;
        dep.presupuesto = Math.floor(remainingBudget * percentage);
        remainingBudget -= dep.presupuesto;
      }
    });
  }

  // Función para formatear moneda
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  // Función para obtener los elementos de la leyenda (top 5 departamentos por presupuesto)
  getLegendItems(): any[] {
    // Ordenamos los departamentos por presupuesto de mayor a menor
    const sortedDepts = [...this.departamentos].sort((a, b) => b.presupuesto - a.presupuesto);

    // Devolvemos los 5 departamentos con mayor presupuesto
    return sortedDepts.slice(0, 5);
  }
}
