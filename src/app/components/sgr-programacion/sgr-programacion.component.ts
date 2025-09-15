import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { departamentos } from '../../data/departamentos';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sgr-programacion',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    Select,
    FloatLabel,
    TableModule,
    FormsModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './sgr-programacion.component.html',
  styleUrl: './sgr-programacion.component.scss'
})
export class SgrProgramacionComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Estados de visualización
  showPlanRecursosView: boolean = true;
  showPlanBienalView: boolean = false;

  // Filtros
  selectedBienio: any = { id: 1, label: '2025 - 2026' };
  selectedBeneficiario: any = null;
  selectedDepartamento: any = null;
  filtersApplied: boolean = false;

  // Opciones de filtros
  bienios: any[] = [
    { id: 1, label: '2025 - 2026' },
    { id: 2, label: '2023 - 2024' },
    { id: 3, label: '2021 - 2022' }
  ];

  beneficiarios: any[] = [
    { id: 1, nombre: 'Departamentos' },
    { id: 2, nombre: 'Municipios' },
    { id: 3, nombre: 'Entidades Nacionales' },
    { id: 4, nombre: 'Universidades' },
    { id: 5, nombre: 'Comunidades Étnicas' }
  ];

  departamentos = departamentos;

  // Chart data for 10-year projection
  tenYearChartData: any = {};
  tenYearChartOptions: any = {};

  // Chart data for Plan Bienal de Caja
  planBienalChartData: any = {};
  planBienalChartOptions: any = {};

  // Table data for concepts by year
  conceptTableData: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Programación' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Inicialización del componente
    this.initializeTenYearChart();
    this.initializePlanBienalChart();
    this.initializeConceptTable();
  }

  /**
   * Inicializar datos y opciones del gráfico de 10 años
   */
  private initializeTenYearChart(): void {
    // Labels para los años 2025-2034
    const years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034'];
    
    // Datos simulados para cada categoría (en billones de pesos)
    const totalData = [125, 130, 135, 142, 148, 155, 162, 170, 178, 185];
    const hidrocarburosData = [85, 88, 92, 96, 100, 105, 110, 115, 120, 125];
    const mineriaData = [40, 42, 43, 46, 48, 50, 52, 55, 58, 60];

    this.tenYearChartData = {
      labels: years,
      datasets: [
        {
          label: 'Total',
          data: totalData,
          backgroundColor: '#3dcd42ff',
          borderColor: '#208e24ff',
          borderWidth: 1
        },
        {
          label: 'Hidrocarburos',
          data: hidrocarburosData,
          backgroundColor: '#369ae1ff',
          borderColor: '#295093ff',
          borderWidth: 1
        },
        {
          label: 'Minería',
          data: mineriaData,
          backgroundColor: '#2f5e8fff',
          borderColor: '#0a3666',
          borderWidth: 1
        }
      ]
    };

    this.tenYearChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Work Sans'
            },
            padding: 20,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Totales de proyección del Plan de Recursos a 10 años',
          font: {
            size: 20,
            family: 'Work Sans',
            weight: 'bold'
          },
          color: '#004583',
          padding: {
            bottom: 30
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Billones de pesos',
            font: {
              size: 12,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans'
            },
            color: '#374151',
            callback: (value: any) => {
              return '$' + value + 'B';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Año',
            font: {
              size: 12,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans'
            },
            color: '#374151'
          }
        }
      }
    };
  }

  /**
   * Inicializar datos y opciones del gráfico Plan Bienal de Caja
   */
  private initializePlanBienalChart(): void {
    // Labels para los 4 bloques, cada uno con PBC y Recaudo
    const labels = [
      'CTI - PBC', 'CTI - Recaudo',
      'Ambiental - PBC', 'Ambiental - Recaudo',
      'Paz - PBC', 'Paz - Recaudo',
      'Río Magdalena - PBC', 'Río Magdalena - Recaudo'
    ];
    
    // Datos simulados (en billones de pesos)
    const pbcData = [45, 0, 32, 0, 28, 0, 18, 0]; // PBC values, 0 for Recaudo positions
    const recaudoData = [0, 38, 0, 27, 0, 22, 0, 15]; // Recaudo values, 0 for PBC positions

    this.planBienalChartData = {
      labels: labels,
      datasets: [
        {
          label: 'PBC',
          data: pbcData,
          backgroundColor: '#4b8dc7ff',
          borderColor: '#5279a2ff',
          borderWidth: 1,
          barThickness: 40
        },
        {
          label: 'Recaudo',
          data: recaudoData,
          backgroundColor: '#7ec1f1ff',
          borderColor: '#528a9bff',
          borderWidth: 1,
          barThickness: 40
        }
      ]
    };

    this.planBienalChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 14,
              family: 'Work Sans'
            },
            padding: 25,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Plan bienal de caja (PBC) 2025 - 2026 bolsas concursables',
          font: {
            size: 18,
            family: 'Work Sans',
            weight: 'bold'
          },
          color: '#004583',
          padding: {
            bottom: 35
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Billones de pesos',
            font: {
              size: 12,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans'
            },
            color: '#374151',
            callback: (value: any) => {
              return '$' + value + 'B';
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Asignaciones',
            font: {
              size: 12,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#374151',
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      barPercentage: 0.8,
      categoryPercentage: 0.9
    };
  }

  /**
   * Inicializar datos de la tabla de conceptos
   */
  private initializeConceptTable(): void {
    this.conceptTableData = [
      {
        concepto: 'Inversión',
        '2025': 95000000000000,
        '2026': 98500000000000,
        '2027': 102250000000000,
        '2028': 107350000000000,
        '2029': 112680000000000,
        '2030': 118250000000000,
        '2031': 124070000000000,
        '2032': 130150000000000,
        '2033': 136500000000000,
        '2034': 143125000000000,
        isTotal: false
      },
      {
        concepto: 'Ahorro',
        '2025': 18750000000000,
        '2026': 19500000000000,
        '2027': 20280000000000,
        '2028': 21090000000000,
        '2029': 21935000000000,
        '2030': 22815000000000,
        '2031': 23730000000000,
        '2032': 24685000000000,
        '2033': 25680000000000,
        '2034': 26715000000000,
        isTotal: false
      },
      {
        concepto: 'Administración',
        '2025': 11250000000000,
        '2026': 11700000000000,
        '2027': 12165000000000,
        '2028': 12650000000000,
        '2029': 13155000000000,
        '2030': 13680000000000,
        '2031': 14225000000000,
        '2032': 14795000000000,
        '2033': 15390000000000,
        '2034': 16010000000000,
        isTotal: false
      },
      {
        concepto: 'Total',
        '2025': 125000000000000,
        '2026': 130000000000000,
        '2027': 135000000000000,
        '2028': 142000000000000,
        '2029': 148000000000000,
        '2030': 155000000000000,
        '2031': 162000000000000,
        '2032': 170000000000000,
        '2033': 178000000000000,
        '2034': 185000000000000,
        isTotal: true
      },
      {
        concepto: 'Minería',
        '2025': 40000000000000,
        '2026': 42000000000000,
        '2027': 43000000000000,
        '2028': 46000000000000,
        '2029': 48000000000000,
        '2030': 50000000000000,
        '2031': 52000000000000,
        '2032': 55000000000000,
        '2033': 58000000000000,
        '2034': 60000000000000,
        isTotal: false
      },
      {
        concepto: 'Hidrocarburos',
        '2025': 85000000000000,
        '2026': 88000000000000,
        '2027': 92000000000000,
        '2028': 96000000000000,
        '2029': 100000000000000,
        '2030': 105000000000000,
        '2031': 110000000000000,
        '2032': 115000000000000,
        '2033': 120000000000000,
        '2034': 125000000000000,
        isTotal: false
      }
    ];
  }

  /**
   * Mostrar vista de Plan de recursos
   */
  showPlanRecursos(): void {
    this.showPlanRecursosView = true;
    this.showPlanBienalView = false;
  }

  /**
   * Mostrar vista de Plan Bienal de Caja y Recaudo
   */
  showPlanBienal(): void {
    this.showPlanRecursosView = false;
    this.showPlanBienalView = true;
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    if (this.selectedBienio && this.selectedBeneficiario && this.selectedDepartamento) {
      this.filtersApplied = true;
      console.log('Filtros aplicados:', {
        bienio: this.selectedBienio.label,
        beneficiario: this.selectedBeneficiario.nombre,
        departamento: this.selectedDepartamento.nombre
      });
      // Aquí se implementaría la lógica de carga de datos
    } else {
      console.log('Debe seleccionar todos los filtros requeridos');
    }
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedBienio = { id: 1, label: '2025 - 2026' };
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
    this.filtersApplied = false;
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
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Programación</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR Programación:</strong> Sistema de planificación y asignación de recursos de regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>Plan de recursos:</strong> Programación anual de recursos disponibles para inversión</li>
          <li style="margin-bottom: 0.5rem;"><strong>Plan Bienal de Caja:</strong> Planificación financiera para el período de dos años</li>
          <li style="margin-bottom: 0.5rem;"><strong>Beneficiarios:</strong> Entidades habilitadas para recibir recursos del SGR</li>
          <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis</li>
          <li style="margin-bottom: 0.5rem;"><strong>Programación:</strong> Asignación planificada de recursos por período</li>
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