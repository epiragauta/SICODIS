import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { FormsModule } from '@angular/forms';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService, SgrResumenPtoRecaudoComparador, SgrPtoRecaudoItem } from '../../services/sicodis-api.service';
import { departamentos } from '../../data/departamentos';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem, TreeNode } from 'primeng/api';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { TooltipModule } from 'primeng/tooltip';

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
    TreeTableModule,
    FormsModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Breadcrumb,
    TooltipModule
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
    { id: 8, label: '2025 - 2026' } /*,
    { id: 7, label: '2023 - 2024' },
    { id: 6, label: '2021 - 2022' } */
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
  municipality1TableData: TreeNode[] = [];
  municipality2TableData: TreeNode[] = [];

  // Table columns
  tableCols: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Comparativo' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Inicializar columnas de la tabla
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '32%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Descripción de la categoría presupuestal' },
      { field: 'presupuesto_total_vigente', header: 'Presupuesto Total', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Suma total del presupuesto vigente (corriente + otros)' },
      { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
      { field: 'presupuesto_otros', header: 'Presupuesto Otros', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Montos presupuestados para otras fuentes de ingreso' },
      { field: 'caja_corriente_informada', header: 'Recaudo<br>Corriente', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para los ingresos corrientes' },
      { field: 'caja_otros', header: 'Recaudo<br>Otros', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para otros ingresos' },
      { field: 'caja_total', header: 'Recaudo<br>Total', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para todos los ingresos' },
      { field: 'avance_iac_presupuesto', header: 'Avance IAC frente a Presupuesto', width: '8%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Total / Presupuesto Corriente) * 100' }
    ];

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
        datalabels: {
          display: false
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
    // Datos de ejemplo con estructura compatible con la API
    const sampleData: SgrPtoRecaudoItem[] = [
      {
        categoria: '-2',
        concepto: 'TOTAL SGR (incluye aforado y no aforado)',
        presupuesto_total_vigente: 22106623922,
        presupuesto_corriente: 21287850929,
        presupuesto_otros: 818772993,
        caja_corriente_informada: 9885709704,
        caja_otros: 818772993,
        caja_total: 10704482696.71,
        avance_iac_presupuesto: 0.4643
      },
      {
        categoria: '1',
        concepto: 'INVERSIÓN',
        presupuesto_total_vigente: 1020469421,
        presupuesto_corriente: 202691261,
        presupuesto_otros: 817778160,
        caja_corriente_informada: 34785630,
        caja_otros: 817778160,
        caja_total: 852563790.27,
        avance_iac_presupuesto: 0.1716
      },
      {
        categoria: '1.1',
        concepto: 'Asignaciones Directas',
        presupuesto_total_vigente: 1020469421,
        presupuesto_corriente: 202691261,
        presupuesto_otros: 817778160,
        caja_corriente_informada: 34785630,
        caja_otros: 817778160,
        caja_total: 852563790.27,
        avance_iac_presupuesto: 0.1716
      },
      {
        categoria: '1.1.1',
        concepto: '20% Asignaciones Directas',
        presupuesto_total_vigente: 892593557,
        presupuesto_corriente: 161955630,
        presupuesto_otros: 730637927,
        caja_corriente_informada: 27812984,
        caja_otros: 730637927,
        caja_total: 758450910.5,
        avance_iac_presupuesto: 0.1717
      },
      {
        categoria: '2',
        concepto: 'AHORRO',
        presupuesto_total_vigente: 21086154501,
        presupuesto_corriente: 21085159668,
        presupuesto_otros: 994833,
        caja_corriente_informada: 9850924073,
        caja_otros: 994833,
        caja_total: 9851918906.44,
        avance_iac_presupuesto: 0.4671
      }
    ];

    // Convertir a TreeNode usando organizeCategoryData
    this.municipality1TableData = organizeCategoryData(sampleData);
    this.municipality2TableData = organizeCategoryData(sampleData);
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
    this.loadComparativeData();
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
    this.loadComparativeData();
  }

  /**
   * Cargar datos comparativos desde el API
   */
  private loadComparativeData(): void {
    if (!this.selectedBienio || !this.selectedMunicipio || !this.selectedMunicipio2) {
      console.log('Filtros incompletos, no se puede cargar datos comparativos');
      return;
    }

    const idVigencia = this.selectedBienio.id;
    const tipoConsulta1 = 7;
    const codigoEntidad1 = this.selectedMunicipio.codigo_municipio;
    const tipoConsulta2 = 7;
    const codigoEntidad2 = this.selectedMunicipio2.codigo_municipio;

    console.log('Cargando datos comparativos:', {
      idVigencia,
      tipoConsulta1,
      codigoEntidad1,
      tipoConsulta2,
      codigoEntidad2
    });

    this.sicodisApiService.getSgrResumenPtoRecaudoComparador(
      idVigencia,
      tipoConsulta1,
      codigoEntidad1,
      tipoConsulta2,
      codigoEntidad2
    ).subscribe({
      next: (data) => {
        console.log('Datos comparativos recibidos:', data);
        this.processComparativeData(data);
      },
      error: (error) => {
        console.error('Error cargando datos comparativos:', error);
        this.initializeCharts();
        this.initializePlanBienalCharts();
        this.initializeDonutCharts();
        this.initializeMunicipalityTables();
      }
    });
  }

  /**
   * Procesar datos comparativos del API
   */
  private processComparativeData(data: SgrResumenPtoRecaudoComparador): void {
    this.processEntityData(data.entidad1, 1);
    this.processEntityData(data.entidad2, 2);
  }

  /**
   * Procesar datos de una entidad
   */
  private processEntityData(entityData: SgrPtoRecaudoItem[], entityNumber: number): void {
    const asignacionesDirectas = entityData.find(item =>
      item.categoria === '1.1'
    );

    const directas20 = entityData.find(item =>
      item.categoria === '1.1.1'
    );

    const ahorro = entityData.find(item =>
      item.categoria === '2.2'
    );

    if (!asignacionesDirectas || !directas20 || !ahorro) {
      console.warn(`Datos incompletos para entidad ${entityNumber}`, {
        asignacionesDirectas: !!asignacionesDirectas,
        directas20: !!directas20,
        ahorro: !!ahorro
      });
      return;
    }

    const chartData = {
      labels: ['Asignaciones Directas', 'Ahorro (FONPET)'],
      datasets: [
        {
          label: 'Presupuesto Total',
          data: [
            asignacionesDirectas.presupuesto_total_vigente,
            ahorro.presupuesto_total_vigente
          ],
          backgroundColor: ['#f38135ff', '#f33aafff'],
          borderColor: ['#be480eff', '#b11049ff'],
          borderWidth: 1
        },
        {
          label: 'Recaudo Total',
          data: [
            asignacionesDirectas.caja_total,
            ahorro.caja_total
          ],
          backgroundColor: ['#edb87cff', '#7991e8ff'],
          borderColor: ['#8c5516', '#3d4d7a'],
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
        },
        datalabels: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.dataset.label || '';
              const value = context.parsed.x;
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
              }).format(value).replace('$', '');
            }
          }
        }
      }
    };

    if (entityNumber === 1) {
      this.planBienalMunicipio1ChartData = chartData;
      this.planBienalMunicipio1ChartOptions = chartOptions;

      this.planBienalMunicipio1DirectasDonutData = {
        labels: ['Presupuesto', 'Recaudo'],
        datasets: [{
          data: [directas20.presupuesto_corriente, directas20.caja_corriente_informada],
          backgroundColor: ['#f33aafff', '#7991e8ff'],
          borderColor: ['#b11049ff', '#3d4d7a'],
          borderWidth: 1
        }]
      };

      this.planBienalMunicipio1LocalDonutData = {
        labels: ['Presupuesto', 'Recaudo'],
        datasets: [{
          data: [asignacionesDirectas.presupuesto_corriente, asignacionesDirectas.caja_corriente_informada],
          backgroundColor: ['#f38135ff', '#edb87cff'],
          borderColor: ['#be480eff', '#8c5516'],
          borderWidth: 1
        }]
      };

      this.municipality1TableData = this.buildTableData(entityData);
    } else {
      this.planBienalMunicipio2ChartData = chartData;
      this.planBienalMunicipio2ChartOptions = chartOptions;

      this.planBienalMunicipio2DirectasDonutData = {
        labels: ['Presupuesto', 'Recaudo'],
        datasets: [{
          data: [directas20.presupuesto_corriente, directas20.caja_corriente_informada],
          backgroundColor: ['#f33aafff', '#7991e8ff'],
          borderColor: ['#b11049ff', '#3d4d7a'],
          borderWidth: 1
        }]
      };

      this.planBienalMunicipio2LocalDonutData = {
        labels: ['Presupuesto', 'Recaudo'],
        datasets: [{
          data: [asignacionesDirectas.presupuesto_corriente, asignacionesDirectas.caja_corriente_informada],
          backgroundColor: ['#f38135ff', '#edb87cff'],
          borderColor: ['#be480eff', '#8c5516'],
          borderWidth: 1
        }]
      };

      this.municipality2TableData = this.buildTableData(entityData);
    }
  }

  /**
   * Construir datos de tabla a partir de los datos de la entidad
   */
  private buildTableData(entityData: SgrPtoRecaudoItem[]): TreeNode[] {
    return organizeCategoryData(entityData);
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