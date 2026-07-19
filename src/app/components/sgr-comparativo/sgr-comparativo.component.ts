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


  // Filtros
  selectedBienio: any = { id: 8, label: '2025 - 2026' };
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
  planBienalMunicipio1ChartData: any = {};
  planBienalMunicipio1ChartOptions: any = {};
  planBienalMunicipio2ChartData: any = {};
  planBienalMunicipio2ChartOptions: any = {};

  // Donut chart data for Plan Bienal view
  planBienalMunicipio1DirectasDonutData: any = {};
  planBienalMunicipio1LocalDonutData: any = {};
  planBienalMunicipio2DirectasDonutData: any = {};
  planBienalMunicipio2LocalDonutData: any = {};
  donutChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          usePointStyle: true,
          font: { size: 10 }
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
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${formatted} (${percentage}%)`;
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  };

  // Table data
  municipality1TableData: TreeNode[] = [];
  municipality2TableData: TreeNode[] = [];
  consolidatedTableData: TreeNode[] = [];

  // Table columns
  tableCols: any[] = [];
  consolidatedTableCols: any[] = [];

  // Table view toggle
  showConsolidatedTable: boolean = false;

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Comparativo' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // Inicializar columnas de la tabla
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '30%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Descripción de la categoría presupuestal' },
      { field: 'presupuesto_total_vigente', header: 'Presupuesto Total', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Suma total del presupuesto vigente (corriente + otros)' },
      { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
      { field: 'presupuesto_otros', header: 'Presupuesto Otros', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Montos presupuestados para otras fuentes de ingreso' },
      { field: 'caja_corriente_informada', header: 'Recaudo<br>Corriente', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para los ingresos corrientes' },
      { field: 'caja_otros', header: 'Recaudo<br>Otros', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para otros ingresos' },
      { field: 'caja_total', header: 'Recaudo<br>Total', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Valores de recaudo reportados para todos los ingresos' },
      { field: 'avance_iac_presupuesto', header: 'Avance IAC frente a Presupuesto', width: '10%', color: '#e4e6e8', class: 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Total / Presupuesto Corriente) * 100' }
    ];

    // Inicializar columnas de la tabla consolidada (se actualizarán con nombres de municipios)
    this.initializeConsolidatedTableColumns();
  }

  /**
   * Inicializar columnas para la tabla consolidada
   */
  private initializeConsolidatedTableColumns(): void {
    this.consolidatedTableCols = [
      {
        field: 'concepto',
        header: 'Concepto',
        colspan: 1,
        rowspan: 2,
        width: '20%',
        color: '#e4e6e8',
        class: 'col-concepto',
        tooltip: 'Descripción de la categoría presupuestal',
        isGroup: false
      },
      // Grupo: Presupuesto Total
      {
        field: 'presupuesto_total_group',
        header: 'Presupuesto Total',
        colspan: 2,
        rowspan: 1,
        color: '#d1e7dd',
        isGroup: true,
        subCols: [
          { field: 'presupuesto_total_vigente_m1', header: 'Municipio 1', width: '8%', color: '#e8f5e8', municipio: 1 },
          { field: 'presupuesto_total_vigente_m2', header: 'Municipio 2', width: '8%', color: '#e8f5e8', municipio: 2 }
        ]
      },
      // Grupo: Presupuesto Corriente
      {
        field: 'presupuesto_corriente_group',
        header: 'Presupuesto Corriente',
        colspan: 2,
        rowspan: 1,
        color: '#d1e7dd',
        isGroup: true,
        subCols: [
          { field: 'presupuesto_corriente_m1', header: 'Municipio 1', width: '8%', color: '#e8f5e8', municipio: 1 },
          { field: 'presupuesto_corriente_m2', header: 'Municipio 2', width: '8%', color: '#e8f5e8', municipio: 2 }
        ]
      },
      // Grupo: Presupuesto Otros
      {
        field: 'presupuesto_otros_group',
        header: 'Presupuesto Otros',
        colspan: 2,
        rowspan: 1,
        color: '#d1e7dd',
        isGroup: true,
        subCols: [
          { field: 'presupuesto_otros_m1', header: 'Municipio 1', width: '8%', color: '#e8f5e8', municipio: 1 },
          { field: 'presupuesto_otros_m2', header: 'Municipio 2', width: '8%', color: '#e8f5e8', municipio: 2 }
        ]
      },
      // Grupo: Recaudo Corriente
      {
        field: 'caja_corriente_group',
        header: 'Recaudo Corriente',
        colspan: 2,
        rowspan: 1,
        color: '#cfe2ff',
        isGroup: true,
        subCols: [
          { field: 'caja_corriente_informada_m1', header: 'Municipio 1', width: '8%', color: '#e3f2fd', municipio: 1 },
          { field: 'caja_corriente_informada_m2', header: 'Municipio 2', width: '8%', color: '#e3f2fd', municipio: 2 }
        ]
      },
      // Grupo: Recaudo Otros
      {
        field: 'caja_otros_group',
        header: 'Recaudo Otros',
        colspan: 2,
        rowspan: 1,
        color: '#cfe2ff',
        isGroup: true,
        subCols: [
          { field: 'caja_otros_m1', header: 'Municipio 1', width: '8%', color: '#e3f2fd', municipio: 1 },
          { field: 'caja_otros_m2', header: 'Municipio 2', width: '8%', color: '#e3f2fd', municipio: 2 }
        ]
      },
      // Grupo: Recaudo Total
      {
        field: 'caja_total_group',
        header: 'Recaudo Total',
        colspan: 2,
        rowspan: 1,
        color: '#cfe2ff',
        isGroup: true,
        subCols: [
          { field: 'caja_total_m1', header: 'Municipio 1', width: '8%', color: '#e3f2fd', municipio: 1 },
          { field: 'caja_total_m2', header: 'Municipio 2', width: '8%', color: '#e3f2fd', municipio: 2 }
        ]
      },
      // Grupo: Avance IAC
      {
        field: 'avance_iac_group',
        header: 'Avance IAC frente a Presupuesto',
        colspan: 2,
        rowspan: 1,
        color: '#fff3cd',
        isGroup: true,
        subCols: [
          { field: 'avance_iac_presupuesto_m1', header: 'Municipio 1', width: '8%', color: '#fff9e6', municipio: 1 },
          { field: 'avance_iac_presupuesto_m2', header: 'Municipio 2', width: '8%', color: '#fff9e6', municipio: 2 }
        ]
      }
    ];
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
   * Alternar entre vista individual y consolidada
   */
  toggleTableView(): void {
    this.showConsolidatedTable = !this.showConsolidatedTable;

    if (this.showConsolidatedTable) {
      this.buildConsolidatedTable();
      this.updateConsolidatedHeaders();
    }
  }

  /**
   * Actualizar headers de la tabla consolidada con nombres reales de municipios
   */
  private updateConsolidatedHeaders(): void {
    const municipio1Name = this.getSelectedMunicipalityName(1);
    const municipio2Name = this.getSelectedMunicipalityName(2);

    this.consolidatedTableCols.forEach(col => {
      if (col.isGroup && col.subCols) {
        col.subCols.forEach((subCol: any) => {
          if (subCol.municipio === 1) {
            subCol.header = municipio1Name;
          } else if (subCol.municipio === 2) {
            subCol.header = municipio2Name;
          }
        });
      }
    });
  }

  /**
   * Construir tabla consolidada combinando datos de ambos municipios
   */
  private buildConsolidatedTable(): void {
    if (!this.municipality1TableData.length || !this.municipality2TableData.length) {
      console.warn('No hay datos para consolidar');
      return;
    }

    this.consolidatedTableData = this.mergeTableData(
      this.municipality1TableData,
      this.municipality2TableData
    );
  }

  /**
   * Combinar datos de dos tablas en una estructura consolidada
   */
  private mergeTableData(data1: TreeNode[], data2: TreeNode[]): TreeNode[] {
    const consolidated: TreeNode[] = [];

    // Iterar sobre los datos del municipio 1 (asumiendo que ambas tienen la misma estructura)
    data1.forEach((node1, index) => {
      const node2 = data2[index];

      if (!node2) return;

      const mergedNode: TreeNode = {
        data: {
          concepto: node1.data['concepto'],
          // Presupuesto Total
          presupuesto_total_vigente_m1: node1.data['presupuesto_total_vigente'],
          presupuesto_total_vigente_m2: node2.data['presupuesto_total_vigente'],
          // Presupuesto Corriente
          presupuesto_corriente_m1: node1.data['presupuesto_corriente'],
          presupuesto_corriente_m2: node2.data['presupuesto_corriente'],
          // Presupuesto Otros
          presupuesto_otros_m1: node1.data['presupuesto_otros'],
          presupuesto_otros_m2: node2.data['presupuesto_otros'],
          // Recaudo Corriente
          caja_corriente_informada_m1: node1.data['caja_corriente_informada'],
          caja_corriente_informada_m2: node2.data['caja_corriente_informada'],
          // Recaudo Otros
          caja_otros_m1: node1.data['caja_otros'],
          caja_otros_m2: node2.data['caja_otros'],
          // Recaudo Total
          caja_total_m1: node1.data['caja_total'],
          caja_total_m2: node2.data['caja_total'],
          // Avance IAC
          avance_iac_presupuesto_m1: node1.data['avance_iac_presupuesto'],
          avance_iac_presupuesto_m2: node2.data['avance_iac_presupuesto']
        },
        children: [],
        expanded: node1.expanded,
        leaf: node1.leaf
      };

      // Recursivamente procesar hijos si existen
      if (node1.children && node1.children.length > 0 && node2.children && node2.children.length > 0) {
        mergedNode.children = this.mergeTableData(node1.children, node2.children);
      }

      consolidated.push(mergedNode);
    });

    return consolidated;
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
  }

  /**
   * Manejar cambio de departamento 1
   */
  onDepartmentChange(event: any): void {
    this.selectedMunicipio = null; // Limpiar municipio seleccionado
    this.loadTownsForDepartment(); // Cargar municipios del departamento seleccionado
  }

  /**
   * Manejar cambio de municipio 1
   */
  onMunicipioChange(event: any): void {
    this.updateMunicipios2List(); // Actualizar lista de municipios 2
    this.loadComparativeData();
  }

  /**
   * Manejar cambio de departamento 2
   */
  onDepartment2Change(event: any): void {
    this.selectedMunicipio2 = null; // Limpiar municipio seleccionado
    this.loadTownsForDepartment2(); // Cargar municipios del departamento seleccionado
  }

  /**
   * Manejar cambio de municipio 2
   */
  onMunicipio2Change(event: any): void {
    this.loadComparativeData();
  }

  /**
   * Cargar datos comparativos desde el API
   */
  private loadComparativeData(): void {
    if (!this.selectedBienio || !this.selectedMunicipio || !this.selectedMunicipio2) {
      return;
    }

    const idVigencia = this.selectedBienio.id;
    const tipoConsulta1 = 7;
    const codigoEntidad1 = this.selectedMunicipio.codigo_municipio;
    const tipoConsulta2 = 7;
    const codigoEntidad2 = this.selectedMunicipio2.codigo_municipio;


    this.sicodisApiService.getSgrResumenPtoRecaudoComparador(
      idVigencia,
      tipoConsulta1,
      codigoEntidad1,
      tipoConsulta2,
      codigoEntidad2
    ).subscribe({
      next: (data) => {
        this.processComparativeData(data);
      },
      error: (error) => {
        console.error('Error cargando datos comparativos:', error);
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
          label: 'Presupuesto - Asignaciones Directas',
          data: [asignacionesDirectas.presupuesto_total_vigente, null],
          backgroundColor: '#f38135ff',
          borderColor: '#be480eff',
          borderWidth: 1
        },
        {
          label: 'Recaudo - Asignaciones Directas',
          data: [asignacionesDirectas.caja_total, null],
          backgroundColor: '#edb87cff',
          borderColor: '#8c5516',
          borderWidth: 1
        },
        {
          label: 'Presupuesto - Ahorro (FONPET)',
          data: [null, ahorro.presupuesto_total_vigente],
          backgroundColor: '#f33aafff',
          borderColor: '#b11049ff',
          borderWidth: 1
        },
        {
          label: 'Recaudo - Ahorro (FONPET)',
          data: [null, ahorro.caja_total],
          backgroundColor: '#7991e8ff',
          borderColor: '#3d4d7a',
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
          position: 'bottom',
          labels: {
            padding: 15,
            usePointStyle: true,
            font: {
              size: 11
            }
          }
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

    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.selectedDepartamento.codigo).subscribe({
      next: (municipios) => {
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

    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.selectedDepartamento2.codigo).subscribe({
      next: (municipios) => {
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
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  /**
   * Mostrar popup de siglas
   */
  showPopupSiglas(): void {
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