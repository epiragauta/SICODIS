import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { HttpClient } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TreeNode, MenuItem } from 'primeng/api';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { departamentos } from '../../data/departamentos';
import { territorialEntities } from '../../data/territorial-entities';
import { map } from 'rxjs/operators';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
// import { SicodisService, FetchBasedService, ProxyAwareSicodisService } from '../../services/sicodis.service';
// import { SicodisImprovedService } from '../../services/sicodis-improved.service';
// import { SicodisApiFixedService } from '../../services/sicodis-api-fixed.service';
// import { SicodisFinalService } from '../../services/sicodis-final.service';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { TooltipModule } from 'primeng/tooltip';


interface FinancialData {
  presupuesto_total_vigente: number;
  caja_total: number;
  presupuesto_corriente: number;
  caja_corriente_informada: number;
  presupuesto_otros: number;
}

@Component({
  selector: 'app-presupuesto-y-recaudo',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    CardModule,
    ChartModule,
    TreeTableModule,
    ButtonModule,
    SplitButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    Select,
    FloatLabel,
    InfoPopupComponent,
    TooltipModule,
    NumberFormatPipe,
  ],
  templateUrl: './presupuesto-y-recaudo.component.html',
  styleUrl: './presupuesto-y-recaudo.component.scss'
})
export class PresupuestoYRecaudoComponent implements OnInit {
  
  // Configuración de columnas responsivas
  //cols: number = 2;
  cardCols: number = 2;
  
  // Datos financieros
  financialData: FinancialData = {
    presupuesto_total_vigente: 0,
    caja_total: 0,
    presupuesto_corriente: 0,
    caja_corriente_informada: 0,
    presupuesto_otros: 0
  };

  // Configuración del gráfico
  chartData: any;
  chartOptions: any;

  // Configuración de la tabla
  // treeTableData: TreeNode[] = [];  
  data: TreeNode[] = [];
  treeTableCols: any[] = [];
  selectedNode: TreeNode | null = null;

  // Filtros
  selectedVigencia: any = { id: 1, label: 'Vigencia Bienio 2025 - 2026' };
  vigencia = [
      {
          "id": 1,
          "label": "Vigencia Bienio 2025 - 2026"
      },
      {
          "id": 2,
          "label": "Vigencia Bienio 2023 - 2024"
      },
      {
          "id": 3,
          "label": "Vigencia Bienio 2021 - 2022"
      },
      {
          "id": 4,
          "label": "Vigencia Bienio 2019 - 2020"
      },
      {
          "id": 5,
          "label": "Vigencia Bienio 2017 - 2018"
      },
      {
          "id": 6,
          "label": "Vigencia Bienio 2015 - 2016"
      },
      {
          "id": 7,
          "label": "Vigencia Bienio 2013 - 2014"
      },
      {
          "id": 8,
          "label": "Vigencia 2012"
      }
  ];
  dptos = departamentos;
  entities = territorialEntities;
  infoPopupContent: string = '';
  
  cols: any[] = [];
  colsA: any[] = [];
  colsB: any[] = [];
  expandedCols: any[] = [];
  hiddenCols: string[] = [
      'rendimientos_financieros',
      'reintegros',
      'excedentes_faep_fonpet',
      'multas',
      'mineral_sin_identificacion_de_origen',
      'mr'
    ];
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [];
  selectedSearchType: any = { id: 1, label: 'General' };
  searchTypes: any[] = [
    { id: 1, label: 'General' },
    { id: 2, label: 'Por departamento' },
    { id: 3, label: 'Por entidad' }
  ];
  detailedData: any[] = [];
  territorialEntitiesDetailUrl = '/assets/data/territorial-entities-detail.json';
  detailedDataUrl = '/assets/data/propuesta-resumen-sgr.json';
  detailEntitiesFiltered: any[] = [];
  detailEntities: any[] = [];
  selectedDpto: any = { codigo: '-1', nombre: 'Por departamento' };
  selectedEntity: any;
  selectedDetailEntity: any;

  constructor(private breakpointObserver: BreakpointObserver,
              // private sicodisFinalService: SicodisFinalService,
              // private sicodisApiFixedService: SicodisApiFixedService,
              // private sicodisImprovedService: SicodisImprovedService,
              // private sicodisService: SicodisService,
              // private fetchBasedService: FetchBasedService,
              // private http: HttpClient
  ) {
    
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 2;
        }
        return 2;
      })
    ).subscribe(cols => this.cardCols = cols);

    // Configuración fija para las tarjetas: siempre 2 columnas
    this.cardCols = 2;
    
  }

  ngOnInit() {
    this.initializeMenuItems();
    //this.initializeTreeTableColumns();
    this.loadFinancialData();
    this.initializeChart();
    //this.loadTreeTableData();
    this.colsA = [
        { field: 'concepto', header: 'Concepto', width: '20%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Descripción de la categoría presupuestal' },
        { field: 'presupuesto_total_vigente', header: 'Presupuesto Total Vigente', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Suma total del presupuesto vigente (corriente + otros)' },
        { field: 'presupuesto_otros', header: 'Presupuesto Otros', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Montos presupuestados para otras fuentes de ingreso. Haga clic en este encabezado para ver/ocultar el detalle de las fuentes.' },
      ]
      this.colsB = [
        { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
        { field: 'caja_corriente_informada', header: 'Recaudo Corriente Informado', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de recaudo reportados para los ingresos corrientes' },
        { field: 'porcentaje_1', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Corriente Informado / Presupuesto Corriente) * 100' },
        { field: 'caja_total', header: 'Recaudo Total', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto total de recaudo' },
        { field: 'porcentaje_2', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Total / Presupuesto Total Vigente) * 100' },
      ]
      this.cols = [
        ...this.colsA,
        ...this.colsB
      ];

      // Configurar columnas expandidas que serán mostradas/ocultadas
      this.expandedCols = [
        { field: 'rendimientos_financieros', header: 'Rendimientos Financieros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos generados por rendimientos de inversiones' },
        { field: 'reintegros', header: 'Reintegros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Devoluciones o retornos de recursos' },
        { field: 'excedentes_faep_fonpet', header: 'Excedentes FAEP FONPET', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)' },
        { field: 'multas', header: 'Multas', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de sanciones o penalidades'  },
        { field: 'mineral_sin_identificacion_de_origen', header: 'Mineral Sin Identificación', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de minerales cuyo origen no está identificado' },
        { field: 'mr', header: 'MR', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Categoría específica de ingresos MR (Mayor Recaudo)' }
      ];
      // Initialize selectedVigencia, but loadData and queryData will handle initial table population
      this.selectedVigencia = this.vigencia.find(v => v.id === 1) || this.vigencia[0];
      this.selectedSearchType = this.searchTypes.find(st => st.id === 1) || this.searchTypes[0];


      this.loadData().then(() => {
        // this.queryData(); // Load initial data with default filters
        console.log('Data loaded and ready for querying.');
      });

      this.infoPopupContent = `
      <div style="font-size: 11px;">
        <p>Información detallada sobre presupuestos, recaudos y distribución de recursos del Sistema General de Regalías de Colombia, organizada jerárquicamente por diferentes conceptos presupuestales.</p>
        <br>
        <ul>
          <li><strong>Concepto</strong>: Descripción de la categoría presupuestal</li>
          <li><strong>Presupuesto corriente</strong>: Monto presupuestado para ingresos corrientes</li>
          <li><strong>Presupuesto otros</strong>: Montos presupuestados para otras fuentes de ingreso</li>
          <li><strong>Presupuesto total vigente</strong>: Suma total del presupuesto vigente (corriente + otros)</li>
          <li><strong>Recaudo corriente informada</strong>: Valores de recaudo reportados para los ingresos corrientes</li>
          <li><strong>Recaudo total</strong>: Monto total de recaudo</li>
          <li><strong>Disponibilidad inicial</strong>: Recursos disponibles al inicio del periodo</li>
          <li><strong>Excedentes faep fonpet</strong>: Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)</li>
          <li><strong>Mineral sin identificacion de origen</strong>: Ingresos provenientes de minerales cuyo origen no está identificado</li>
          <li><strong>MR</strong>: Categoría específica de ingresos</li>
          <li><strong>Multas</strong>: Ingresos provenientes de sanciones o penalidades</li>
          <li><strong>Reintegros</strong>: Devoluciones o retornos de recursos</li>
          <li><strong>Rendimientos financieros</strong>: Ingresos generados por rendimientos de inversiones</li>
          <li><strong>Porcentaje 1</strong> y <strong>Porcentaje 2</strong>: Indicadores porcentuales que miden proporciones entre valores</li>
        </ul>          
      </div>
      `;
  }

  private initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Exportar Excel',
        icon: 'pi pi-file-excel',
        command: () => this.exportData('excel')
      },
      {
        label: 'Exportar PDF',
        icon: 'pi pi-file-pdf',
        command: () => this.exportData('pdf')
      }
    ];
  }

  async loadData(): Promise<void> {
    console.log('Loading base data...');
    try {
      const response = await fetch(this.detailedDataUrl);
      this.detailedData = await response.json();
      this.data = organizeCategoryData(this.detailedData);
      console.log('Base data loaded successfully.');      
    } catch (error) {
      console.error('Error fetching base data:', error);
      this.detailedData = []; // Ensure detailedData is an array in case of error      
    }
  }

  // private initializeTreeTableColumns() {
  //   this.treeTableCols = [
  //     { field: 'concepto', header: 'Concepto' },
  //     { field: 'presupuesto_total_vigente', header: 'Presupuesto Total Vigente' },
  //     { field: 'caja_total', header: 'Recaudo Total' },
  //     { field: 'presupuesto_corriente', header: 'Presupuesto Corriente' },
  //     { field: 'caja_corriente_informada', header: 'Recaudo Corriente Informada' }
  //   ];
  // }

  private loadFinancialData() {
    // Simulando datos - en un caso real estos vendrían de un servicio
    this.financialData = {
      presupuesto_total_vigente: 63697733611855.4,
      caja_total: 41832989623504.40,
      presupuesto_corriente: 25536162427940.00,
      caja_corriente_informada: 2995629703785.00,
      presupuesto_otros: 38161571183915.4
    };
  }

  private initializeChart() {
    this.chartData = {
      labels: ['Total', 'Corriente', 'Otros'],
      datasets: [
        {
          label: 'Presupuesto',
          data: [
            this.financialData.presupuesto_total_vigente,
            this.financialData.presupuesto_corriente,
            this.financialData.presupuesto_otros
          ],
          backgroundColor: '#1e40af', // Azul oscuro para presupuesto
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'Recaudo',
          data: [
            this.financialData.caja_total,
            this.financialData.caja_corriente_informada,
            this.financialData.caja_total // Usando caja_total para "Otros"
          ],
          backgroundColor: '#60a5fa', // Azul claro para caja/recaudo
          borderColor: '#60a5fa',
          borderWidth: 1
        }
      ]
    };

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${new Intl.NumberFormat('es-CO').format(context.parsed.x)} Pesos`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: true, // No apiladas
          beginAtZero: true,
          title: {
            display: true,
            text: 'Pesos Colombianos',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        },
        y: {
          stacked: true, // No apiladas
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        }
      }
    };
  }

  // async loadTreeTableData(): Promise<void> {
    
  //   try{
  //     const response = await fetch(this.detailedDataUrl);
  //     let detailedData = await response.json();
  //     this.treeTableData = organizeCategoryData(detailedData);
  //   }catch (error) {
  //     console.error('Error loading tree table data:', error);
  //     const sampleData = [
  //     {
  //       categoria: "1",
  //       concepto: "TOTAL SGR",
  //       presupuesto_total_vigente: 63697733611855.4,
  //       caja_total: 41832989623504.40,
  //       presupuesto_corriente: 25536162427940.00,
  //       caja_corriente_informada: 2995629703785.00,
  //       presupuesto_otros: 38161571183915.4
  //     },
  //     {
  //       categoria: "1.1",
  //       concepto: "INVERSIÓN",
  //       presupuesto_total_vigente: 58529252929140.4,
  //       caja_total: 37675313076056.40,
  //       presupuesto_corriente: 23620950245846.00,
  //       caja_corriente_informada: 2767010392762.00,
  //       presupuesto_otros: 34908302683294.4
  //     }
  //   ];

  //   this.treeTableData = organizeCategoryData(sampleData);
  //   } 
  // }

  updateSelectedSearchType(event: any) {
    console.log('Selected search type:', event.value);
    this.selectedSearchType = event.value; // event.value already contains the selected object {id, label}

    // Reset dependent filters
    this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' };
    this.selectedEntity = undefined; // Or a default object like { codigo: '-1', dpto: 'Por entidad' } if your HTML expects it
    this.selectedDetailEntity = undefined;
    this.detailEntitiesFiltered = [];

    // Do not automatically query data here, user will click "Consultar"
    // this.queryData();
  }

  updateSelectedDpto(event: any) {
    console.log('Selected department:', event.value);
    this.selectedDpto = event.value;
    // Do not automatically query data here
    // this.queryData();
  }

  updateSelectedEntity(event: any) {
    console.log('Selected entity:', event.value);
    this.selectedEntity = event.value;
    this.selectedDetailEntity = undefined; // Reset detail entity when main entity changes
    this.detailEntitiesFiltered = [];

    if (this.selectedEntity && this.selectedEntity.codigo !== '-1') {
      // Fetch detail entities if a valid entity is selected
      if (this.detailEntities.length === 0) { // Assuming detailEntities holds all possible detail entities
        fetch(this.territorialEntitiesDetailUrl)
          .then(response => response.json())
          .then(data => {
            this.detailEntities = data;
            this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);

            console.log('Detail entities filtered:', this.detailEntitiesFiltered);
          })
          .catch(error => console.error('Error fetching detail entities:', error));
      } else {
        this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);
        
      }
    }
    // Do not automatically query data here
    // this.queryData();
  }

  updateSelectedDetailEntity(event: any) {
    console.log('Selected detail entity:', event.value);
    this.selectedDetailEntity = event.value;
    // Do not automatically query data here
    // this.queryData();
  }

  clearFilters() {
    console.log('Clearing filters...');
    this.selectedVigencia = this.vigencia[0]; // Reset to first vigencia
    this.selectedSearchType = this.searchTypes[0]; // Reset to first search type
    this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' }; // Reset to default department
    this.selectedEntity = undefined; // Reset entity selection
    this.selectedDetailEntity = undefined; // Reset detail entity selection
    this.detailEntitiesFiltered = []; // Clear filtered detail entities 
    this.data = organizeCategoryData(this.detailedData)
  }

  formatToBillions(value: number): number {
    return value; // Return full peso values
  }

  formatCurrency(value: number): string {
    const billions = this.formatToBillions(value);
    return `${billions.toFixed(2).replace(",",".")}`;
  }

  toggleColumns() {
      this.isExpanded = !this.isExpanded;

      if (this.isExpanded) {
        // Mostrar todas las columnas
        this.cols = [
          ...this.colsA,
          ...this.expandedCols,
          ...this.colsB
        ];
        const listWidths = [16,8,8,8,6,6,6,6,6,6,9,3,8,4];
        this.cols.forEach((col, index) => {
          col.width = listWidths[index] + '%';
        });
        
      } else {
        // Ocultar las columnas expandidas
        this.cols = this.cols.filter(col => !this.hiddenCols.includes(col.field));
      }
    }

  isHiddenColumn(field: string): boolean {
    return this.hiddenCols.includes(field);
  }

  exportData(format: 'excel' | 'pdf') {
    console.log(`Exportando datos en formato: ${format}`);
    // Implementar lógica de exportación
  }

  async queryData() {
    console.log('Consultando datos...');
    this.queryDataFake(); // Usar datos falsos para pruebas
    //await this.testImproved();
    // Implementar lógica de consulta
    
    
  }

  generateRandomPercentage(min: number, max: number): number   {
      const randomValue = Math.random() * (max - min) + min;
      return randomValue;
  }

  queryDataFake() {
    console.log('Consultando datos (falso)...');
    const randomNumber = this.generateRandomPercentage(2.5, 4.5) / 100;    
    let filteredData = this.detailedData.map((row: any) => {
      const newRow = { ...row };
      newRow.caja_corriente_informada = Number(newRow.caja_corriente_informada) * randomNumber;
      newRow.caja_total = Number(newRow.caja_total) * randomNumber;
      newRow.disponibilidad_inicial = Number(newRow.disponibilidad_inicial) * randomNumber;
      newRow.excedentes_faep_fonpet = Number(newRow.excedentes_faep_fonpet) * randomNumber;
      newRow.mr = Number(newRow.mr) * randomNumber;
      newRow.multas = Number(newRow.multas) * randomNumber;
      newRow.presupuesto_corriente = Number(newRow.presupuesto_corriente) * randomNumber;
      newRow.presupuesto_otros = Number(newRow.presupuesto_otros) * randomNumber;
      newRow.presupuesto_total_vigente = Number(newRow.presupuesto_total_vigente) * randomNumber;
      newRow.reintegros = Number(newRow.reintegros) * randomNumber;
      newRow.rendimientos_financieros = Number(newRow.rendimientos_financieros) * randomNumber;      
      if (row.concepto === 'TOTAL') {
        this.financialData = {
          presupuesto_total_vigente: newRow.presupuesto_total_vigente,
          caja_total: newRow.caja_total,
          presupuesto_corriente: newRow.presupuesto_corriente,
          caja_corriente_informada: newRow.caja_corriente_informada,
          presupuesto_otros: newRow.presupuesto_otros
        };
      }
      return newRow;
    });
    this.data = organizeCategoryData(filteredData);
    this.initializeChart();

  }
  

  formatPercentage(value: any): string {
      if (value === null || value === undefined) return '';

      // Convertir a número si es string
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      // Formatear como porcentaje
      return (numValue * 100).toFixed(2) + '%';
    }

  // async testDiagnostic() {
  //   const service = new ProxyAwareSicodisService(this.http);
  //   await service.diagnosticProxy();
  // }

  // async testImproved() {
  //   const service = new SicodisFinalService(this.http);
  //   const result = await service.getVigenciasComplete();
  //   console.log('Resultado final:', result);
  // }
}