import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TreeNode, MenuItem } from 'primeng/api';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

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
    NumberFormatPipe
  ],
  templateUrl: './presupuesto-y-recaudo.component.html',
  styleUrl: './presupuesto-y-recaudo.component.scss'
})
export class PresupuestoYRecaudoComponent implements OnInit {
  
  // Configuración de columnas responsivas
  cols: number = 2;
  cardCols: number = 3;
  
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
  treeTableData: TreeNode[] = [];
  treeTableCols: any[] = [];
  selectedNode: TreeNode | null = null;

  // Filtros
  selectedVigencia: any = { id: 1, label: 'Vigencia Bienio 2025 - 2026' };
  vigencia = [
    { id: 1, label: 'Vigencia Bienio 2025 - 2026' },
    { id: 2, label: 'Vigencia Bienio 2023 - 2024' },
    { id: 3, label: 'Vigencia Bienio 2021 - 2022' }
  ];

  menuItems: MenuItem[] = [];

  detailedDataUrl = '/assets/data/propuesta-resumen-sgr.json';

  constructor(private breakpointObserver: BreakpointObserver) {
    // Configuración responsiva para el grid principal
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
    ).subscribe(cols => this.cols = cols);

    // Configuración fija para las tarjetas: siempre 2 columnas
    this.cardCols = 2;
  }

  ngOnInit() {
    this.initializeMenuItems();
    this.initializeTreeTableColumns();
    this.loadFinancialData();
    this.initializeChart();
    this.loadTreeTableData();
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

  private initializeTreeTableColumns() {
    this.treeTableCols = [
      { field: 'concepto', header: 'Concepto' },
      { field: 'presupuesto_total_vigente', header: 'Presupuesto Total Vigente' },
      { field: 'caja_total', header: 'Caja Total' },
      { field: 'presupuesto_corriente', header: 'Presupuesto Corriente' },
      { field: 'caja_corriente_informada', header: 'Caja Corriente Informada' }
    ];
  }

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
            this.formatToBillions(this.financialData.presupuesto_total_vigente),
            this.formatToBillions(this.financialData.presupuesto_corriente),
            this.formatToBillions(this.financialData.presupuesto_otros)
          ],
          backgroundColor: '#1e40af', // Azul oscuro para presupuesto
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'Caja/Recaudo',
          data: [
            this.formatToBillions(this.financialData.caja_total),
            this.formatToBillions(this.financialData.caja_corriente_informada),
            this.formatToBillions(this.financialData.caja_total) // Usando caja_total para "Otros"
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
              return `${context.dataset.label}: ${context.parsed.x.toFixed(2)} billones COP`;
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
            text: 'Billones de Pesos Colombianos (COP)',
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

  async loadTreeTableData(): Promise<void> {
    
    try{
      const response = await fetch(this.detailedDataUrl);
      let detailedData = await response.json();
      this.treeTableData = organizeCategoryData(detailedData);
    }catch (error) {
      console.error('Error loading tree table data:', error);
      const sampleData = [
      {
        categoria: "1",
        concepto: "TOTAL SGR",
        presupuesto_total_vigente: 63697733611855.4,
        caja_total: 41832989623504.40,
        presupuesto_corriente: 25536162427940.00,
        caja_corriente_informada: 2995629703785.00,
        presupuesto_otros: 38161571183915.4
      },
      {
        categoria: "1.1",
        concepto: "INVERSIÓN",
        presupuesto_total_vigente: 58529252929140.4,
        caja_total: 37675313076056.40,
        presupuesto_corriente: 23620950245846.00,
        caja_corriente_informada: 2767010392762.00,
        presupuesto_otros: 34908302683294.4
      }
    ];

    this.treeTableData = organizeCategoryData(sampleData);
    } 
  }

  formatToBillions(value: number): number {
    return value / 1000000000000; // Convertir a billones
  }

  formatCurrency(value: number): string {
    const billions = this.formatToBillions(value);
    return `${billions.toFixed(2).replace(",",".")}`;
  }

  exportData(format: string) {
    console.log(`Exportando datos en formato: ${format}`);
    // Implementar lógica de exportación
  }

  queryData() {
    console.log('Consultando datos...');
    // Implementar lógica de consulta
  }
}