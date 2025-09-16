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
  selector: 'app-sgr-comparativo',
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
  templateUrl: './sgr-comparativo.component.html',
  styleUrl: './sgr-comparativo.component.scss'
})
export class SgrComparativoComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

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

  departamentos = departamentos;
  municipios: any[] = [];
  municipios2: any[] = [];

  // Chart data
  municipio1ChartData: any = {};
  municipio1ChartOptions: any = {};
  municipio2ChartData: any = {};
  municipio2ChartOptions: any = {};

  // Chart data for Plan Bienal view
  planBienalMunicipio1ChartData: any = {};
  planBienalMunicipio1ChartOptions: any = {};
  planBienalMunicipio2ChartData: any = {};
  planBienalMunicipio2ChartOptions: any = {};

  // Donut chart data for Plan Bienal view
  planBienalMunicipio1DirectasDonutData: any = {};
  planBienalMunicipio1LocalDonutData: any = {};
  planBienalMunicipio2DirectasDonutData: any = {};
  planBienalMunicipio2LocalDonutData: any = {};
  donutChartOptions: any = {};

  // Table data
  comparativeTableData: any[] = [];
  municipality1TableData: any[] = [];
  municipality2TableData: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Comparativo' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Inicialización del componente
    this.initializeCharts();
    this.initializePlanBienalCharts();
    this.initializeDonutCharts();
    this.initializeTableData();
    this.initializeMunicipalityTables();
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
          backgroundColor: ['#f38135ff', '#f33aafff'], // Verde oscuro y azul oscuro para mejor contraste
          borderColor: ['#be480eff', '#b11049ff'], // Bordes más oscuros
          borderWidth: 1
        },
        {
          label: 'Recaudo',
          data: [98750000000, 72100000000], // Valores simulados en pesos
          backgroundColor: ['#edb87cff', '#7991e8ff'], // Naranja oscuro y azul medio
          borderColor: ['#8c5516', '#3d4d7a'], // Bordes complementarios
          borderWidth: 1
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
            maxTicksLimit: 4,
            callback: (value: any) => {
              return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value).replace('$', ''); // Formato en miles de millones sin decimales
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
   * Inicializar datos y opciones de gráficos para Plan Bienal view
   */
  private initializePlanBienalCharts(): void {
    // Datos unificados para ambos municipios con labels modificados
    const planBienalChartData = {
      labels: ['Asignación Local', 'Directas (25%)'],
      datasets: [
        {
          label: 'Presupuesto Total',
          data: [125000000000, 87500000000], // Valores simulados en pesos
          backgroundColor: ['#f38135ff', '#f33aafff'], 
          borderColor: ['#be480eff', '#b11049ff'], 
          borderWidth: 1
        },
        {
          label: 'Recaudo Total',
          data: [98750000000, 72100000000], // Valores simulados en pesos
          backgroundColor: ['#edb87cff', '#7991e8ff'], 
          borderColor: ['#8c5516', '#3d4d7a'], 
          borderWidth: 1
        }
      ]
    };

    const planBienalChartOptions = {
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
            maxTicksLimit: 4,
            callback: (value: any) => {
              return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value).replace('$', ''); // Formato en miles de millones sin decimales
            }
          }
        }
      }
    };

    // Duplicar los mismos datos para ambos municipios
    this.planBienalMunicipio1ChartData = { ...planBienalChartData };
    this.planBienalMunicipio1ChartOptions = { ...planBienalChartOptions };
    
    this.planBienalMunicipio2ChartData = { ...planBienalChartData };
    this.planBienalMunicipio2ChartOptions = { ...planBienalChartOptions };
  }

  /**
   * Inicializar datos y opciones de gráficos donut
   */
  private initializeDonutCharts(): void {
    // Datos para gráficos donut de Asignaciones Directas (25%)
    const directasDonutData = {
      labels: ['Presupuesto', 'Recaudo'],
      datasets: [{
        data: [87500000000, 72100000000], // Valores simulados
        backgroundColor: ['#f33aafff', '#7991e8ff'],
        borderColor: ['#b11049ff', '#3d4d7a'],
        borderWidth: 1
      }]
    };

    // Datos para gráficos donut de Asignación para la Inversión Local
    const localDonutData = {
      labels: ['Presupuesto', 'Recaudo'],
      datasets: [{
        data: [125000000000, 98750000000], // Valores simulados
        backgroundColor: ['#f38135ff', '#edb87cff'],
        borderColor: ['#be480eff', '#8c5516'],
        borderWidth: 1
      }]
    };

    // Opciones para gráficos donut horizontales
    this.donutChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            usePointStyle: true,
            padding: 20,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed;
              const formatted = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
              return `${label}: ${formatted}`;
            }
          }
        }
      }
    };

    // Asignar los mismos datos a todos los municipios
    this.planBienalMunicipio1DirectasDonutData = { ...directasDonutData };
    this.planBienalMunicipio1LocalDonutData = { ...localDonutData };
    this.planBienalMunicipio2DirectasDonutData = { ...directasDonutData };
    this.planBienalMunicipio2LocalDonutData = { ...localDonutData };
  }

  /**
   * Inicializar datos de la tabla comparativa
   */
  private initializeTableData(): void {
    this.comparativeTableData = [
      {
        entidad: 'Medellín',
        directas_pbc: 45000000000,
        directas_recaudo: 38500000000,
        local_pbc: 125000000000,
        local_recaudo: 98750000000
      },
      {
        entidad: 'Cali',
        directas_pbc: 32000000000,
        directas_recaudo: 28900000000,
        local_pbc: 87500000000,
        local_recaudo: 72100000000
      }
    ];
  }

  /**
   * Inicializar datos de las tablas de municipios
   */
  private initializeMunicipalityTables(): void {
    // Datos base para las tablas de municipios
    const baseTableData = [
      {
        asignacion: 'Asignaciones Directas 25%',
        presupuesto_total: 87500000000,
        presupuesto_corriente: 72100000000,
        presupuesto_otros: 15400000000,
        recaudo_corriente: 65800000000,
        recaudo_otros: 12300000000,
        recaudo_total: 78100000000,
        avance_iac: 89.2
      },
      {
        asignacion: 'Asignación para la Inversión Local Municipios más pobres',
        presupuesto_total: 125000000000,
        presupuesto_corriente: 98750000000,
        presupuesto_otros: 26250000000,
        recaudo_corriente: 92600000000,
        recaudo_otros: 18750000000,
        recaudo_total: 111350000000,
        avance_iac: 89.1
      },
      {
        asignacion: 'Incentivo producción Acto Legislativo 04 de 2017 (30% RF)',
        presupuesto_total: 42500000000,
        presupuesto_corriente: 35000000000,
        presupuesto_otros: 7500000000,
        recaudo_corriente: 31800000000,
        recaudo_otros: 5900000000,
        recaudo_total: 37700000000,
        avance_iac: 88.7
      }
    ];

    // Asignar los mismos datos a ambos municipios (se pueden personalizar después)
    this.municipality1TableData = [...baseTableData];
    this.municipality2TableData = [...baseTableData];
  }

  /**
   * Obtener nombre del municipio seleccionado
   */
  getSelectedMunicipalityName(municipioNumber: number): string {
    if (municipioNumber === 1 && this.selectedMunicipio) {
      return this.selectedMunicipio.nombre_municipio;
    } else if (municipioNumber === 2 && this.selectedMunicipio2) {
      return this.selectedMunicipio2.nombre_municipio;
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
   * Descargar reporte consolidado
   */
  downloadConsolidated(): void {
    console.log('Descargando reporte consolidado para:', {
      municipio1: this.getSelectedMunicipalityName(1),
      municipio2: this.getSelectedMunicipalityName(2),
      bienio: this.selectedBienio?.label
    });
    // Aquí se implementaría la lógica de descarga del Excel consolidado
  }

  /**
   * Descargar detalle mensual
   */
  downloadMonthlyDetail(): void {
    console.log('Descargando detalle mensual para:', {
      municipio1: this.getSelectedMunicipalityName(1),
      municipio2: this.getSelectedMunicipalityName(2),
      bienio: this.selectedBienio?.label
    });
    // Aquí se implementaría la lógica de descarga del Excel con detalle mensual
  }

  /**
   * Manejar cambio de departamento 1
   */
  onDepartmentChange(event: any): void {
    this.selectedMunicipio = null; // Limpiar municipio seleccionado
    this.loadTownsForDepartment(); // Cargar municipios del departamento seleccionado
    console.log('Departamento 1 seleccionado:', event.value);
  }

  /**
   * Manejar cambio de municipio 1
   */
  onMunicipioChange(event: any): void {
    console.log('Municipio 1 seleccionado:', event.value);
    this.updateMunicipios2List(); // Actualizar lista de municipios 2
  }

  /**
   * Manejar cambio de departamento 2
   */
  onDepartment2Change(event: any): void {
    this.selectedMunicipio2 = null; // Limpiar municipio seleccionado
    this.loadTownsForDepartment2(); // Cargar municipios del departamento seleccionado
    console.log('Departamento 2 seleccionado:', event.value);
  }

  /**
   * Manejar cambio de municipio 2
   */
  onMunicipio2Change(event: any): void {
    console.log('Municipio 2 seleccionado:', event.value);
  }

  /**
   * Carga los municipios para el departamento seleccionado
   */
  private loadTownsForDepartment(): void {
    if (!this.selectedDepartamento) {
      this.municipios = [];
      this.selectedMunicipio = null;
      return;
    }

    console.log('Cargando municipios para departamento:', this.selectedDepartamento.codigo);
    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.selectedDepartamento.codigo).subscribe({
      next: (municipios) => {
        console.log('Municipios cargados:', municipios);
        this.municipios = municipios;
        this.updateMunicipios2List();
      },
      error: (error) => {
        console.error('Error cargando municipios:', error);
        this.municipios = [];
      }
    });
  }

  /**
   * Carga los municipios para el segundo departamento seleccionado
   */
  private loadTownsForDepartment2(): void {
    if (!this.selectedDepartamento2) {
      this.municipios2 = [];
      this.selectedMunicipio2 = null;
      return;
    }

    console.log('Cargando municipios para departamento 2:', this.selectedDepartamento2.codigo);
    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.selectedDepartamento2.codigo).subscribe({
      next: (municipios) => {
        console.log('Municipios 2 cargados:', municipios);
        this.municipios2 = municipios;
        this.updateMunicipios2List();
      },
      error: (error) => {
        console.error('Error cargando municipios 2:', error);
        this.municipios2 = [];
      }
    });
  }

  /**
   * Actualiza la lista de municipios 2 para evitar duplicados
   */
  private updateMunicipios2List(): void {
    if (this.selectedMunicipio && this.selectedDepartamento?.codigo === this.selectedDepartamento2?.codigo) {
      // Si ambos departamentos son iguales, filtrar el municipio seleccionado en la lista 1
      this.municipios2 = this.municipios2.filter(municipio => municipio.codigo_municipio !== this.selectedMunicipio.codigo_municipio);
    }
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