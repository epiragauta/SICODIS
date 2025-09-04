import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InfoPopupComponent } from '../info-popup/info-popup.component';

@Component({
  selector: 'app-sgr-comparativo',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    Select,
    FloatLabel,
    FormsModule,
    InfoPopupComponent
  ],
  templateUrl: './sgr-comparativo.component.html',
  styleUrl: './sgr-comparativo.component.scss'
})
export class SgrComparativoComponent implements OnInit {
  
  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Estados de visualización
  showPresupuestoRecaudoView: boolean = true;
  showPlanBienalView: boolean = false;

  // Filtros
  selectedBienio: any = { id: 1, label: '2025 - 2026' };
  selectedDepartamento: any = null;
  selectedMunicipio: any = null;
  selectedDepartamento2: any = null;
  selectedMunicipio2: any = null;

  // Opciones de filtros
  bienios: any[] = [
    { id: 1, label: '2025 - 2026' },
    { id: 2, label: '2023 - 2024' },
    { id: 3, label: '2021 - 2022' }
  ];

  departamentos: any[] = [
    { id: 1, label: 'Antioquia' },
    { id: 2, label: 'Bogotá D.C.' },
    { id: 3, label: 'Valle del Cauca' },
    { id: 4, label: 'Cundinamarca' },
    { id: 5, label: 'Atlántico' },
    { id: 6, label: 'Santander' }
  ];

  municipios: any[] = [
    { id: 1, label: 'Medellín' },
    { id: 2, label: 'Cali' },
    { id: 3, label: 'Barranquilla' },
    { id: 4, label: 'Cartagena' },
    { id: 5, label: 'Bucaramanga' },
    { id: 6, label: 'Pereira' }
  ];

  departamentos2: any[] = [
    { id: 1, label: 'Antioquia' },
    { id: 2, label: 'Bogotá D.C.' },
    { id: 3, label: 'Valle del Cauca' },
    { id: 4, label: 'Cundinamarca' },
    { id: 5, label: 'Atlántico' },
    { id: 6, label: 'Santander' }
  ];

  municipios2: any[] = [
    { id: 1, label: 'Medellín' },
    { id: 2, label: 'Cali' },
    { id: 3, label: 'Barranquilla' },
    { id: 4, label: 'Cartagena' },
    { id: 5, label: 'Bucaramanga' },
    { id: 6, label: 'Pereira' }
  ];

  // Chart data
  municipio1ChartData: any = {};
  municipio1ChartOptions: any = {};
  municipio2ChartData: any = {};
  municipio2ChartOptions: any = {};

  constructor() { }

  ngOnInit(): void {
    // Inicialización del componente
    this.initializeCharts();
  }

  /**
   * Inicializar datos y opciones de gráficos
   */
  private initializeCharts(): void {
    // Datos unificados para ambos municipios (incluye Asignación Local y Directas 25%)
    const chartData = {
      labels: ['Asignación Local', 'Directas (25%)'],
      datasets: [
        {
          label: 'Plan Bienal de Caja',
          data: [125000000000, 87500000000], // Valores simulados en pesos
          backgroundColor: ['#447721', '#0f4987'], // Verde oscuro y azul oscuro para mejor contraste
          borderColor: ['#2d5015', '#0a2f5a'], // Bordes más oscuros
          borderWidth: 2
        },
        {
          label: 'Recaudo',
          data: [98750000000, 72100000000], // Valores simulados en pesos
          backgroundColor: ['#bf751f', '#5e71b8'], // Naranja oscuro y azul medio
          borderColor: ['#8c5516', '#3d4d7a'], // Bordes complementarios
          borderWidth: 2
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        title: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value: any) => {
              return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
            }
          }
        }
      }
    };

    // Duplicar los mismos datos para ambos municipios
    this.municipio1ChartData = { ...chartData };
    this.municipio1ChartOptions = { ...chartOptions };
    
    this.municipio2ChartData = { ...chartData };
    this.municipio2ChartOptions = { ...chartOptions };
  }

  /**
   * Obtener nombre del municipio seleccionado
   */
  getSelectedMunicipalityName(municipioNumber: number): string {
    if (municipioNumber === 1 && this.selectedMunicipio) {
      return this.selectedMunicipio.label;
    } else if (municipioNumber === 2 && this.selectedMunicipio2) {
      return this.selectedMunicipio2.label;
    }
    return `Municipio ${municipioNumber}`;
  }

  /**
   * Mostrar vista de Presupuesto y Recaudo
   */
  showPresupuestoRecaudo(): void {
    this.showPresupuestoRecaudoView = true;
    this.showPlanBienalView = false;
  }

  /**
   * Mostrar vista de Plan Bienal de Caja y Recaudo
   */
  showPlanBienal(): void {
    this.showPresupuestoRecaudoView = false;
    this.showPlanBienalView = true;
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedBienio = { id: 1, label: '2025 - 2026' };
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.selectedDepartamento2 = null;
    this.selectedMunicipio2 = null;
    console.log('Filtros limpiados');
  }

  /**
   * Mostrar popup del diccionario
   */
  showPopupDiccionario(): void {
    console.log('Mostrando diccionario de datos');
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  /**
   * Mostrar popup de siglas
   */
  showPopupSiglas(): void {
    console.log('Mostrando siglas');
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
  }

  /**
   * Cerrar popup del diccionario
   */
  closeDiccionarioPopup(): void {
    this.showDiccionarioPopup = false;
  }

  /**
   * Cerrar popup de siglas
   */
  closeSiglasPopup(): void {
    this.showSiglasPopup = false;
  }

  /**
   * Generar contenido del diccionario
   */
  private generarContenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Comparativo</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>Comparativo SGR:</strong> Análisis comparativo entre diferentes entidades territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>Presupuesto y Recaudo:</strong> Comparación entre presupuestado y ejecutado</li>
          <li style="margin-bottom: 0.5rem;"><strong>Plan Bienal de Caja:</strong> Planificación financiera para el bienio</li>
          <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis</li>
          <li style="margin-bottom: 0.5rem;"><strong>Entidad Territorial:</strong> Departamento, distrito o municipio beneficiario</li>
          <li style="margin-bottom: 0.5rem;"><strong>Recaudo:</strong> Monto efectivamente recaudado de regalías</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generar contenido de siglas
   */
  private generarContenidoSiglas(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>DNP:</strong> Departamento Nacional de Planeación</li>
          <li style="margin-bottom: 0.5rem;"><strong>PBC:</strong> Plan Bienal de Caja</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAEP:</strong> Fondo de Ahorro y Estabilización Petrolera</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>SICODIS:</strong> Sistema de Consulta y Distribución</li>
        </ul>
      </div>
    `;
  }
}