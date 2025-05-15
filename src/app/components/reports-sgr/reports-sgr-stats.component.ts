import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ChartModule } from 'primeng/chart';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';

import { ReportsMapComponent } from '../reports-map/reports-map.component';

@Component({
  selector: 'app-reports-sgr-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatGridListModule,
    ButtonModule,
    TableModule,
    TabsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ChartModule,
    DividerModule,
    CardModule,
    ReportsMapComponent
  ],
  templateUrl: './reports-sgr-stats.component.html',
  styleUrls: ['./reports-sgr-stats.component.scss']
})
export class ReportsSgrStatsComponent implements OnInit {
  // Datos para los gráficos
  @Input() dataTable: any[] = [];

  basicData: any;
  basicOptions: any;
  pieData: any;
  pieChartOptions: any;
  horizontalData: any;
  horizontalChartoptions: any;

  ngOnInit() {
    console.log('ngOnInit', 'reports-sgr-stats');
    this.initBarChart();
    this.initPieChart();
    this.initHorizontalChart();
  }

  initBarChart() {
    console.log('initBarChart');
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#333';
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    this.basicData = {
      labels: ['2022-2023', '2024-2025', '2026-2027', '2028-2029', '2030-2031'],
      datasets: [
        {
          label: 'Asignación Presupuestal',
          data: [12540, 15325, 17022, 18620, 19800],
          backgroundColor: 'rgba(98, 171, 239, 0.7)',
          borderColor: 'rgb(61, 84, 235)',
          borderWidth: 1
        },
        {
          label: 'Ejecución Efectiva',
          data: [11200, 14500, 16300, 17900, 0], // El último periodo sin datos aún
          backgroundColor: 'rgba(107, 114, 128, 0.7)',
          borderColor: 'rgb(107, 114, 128)',
          borderWidth: 1
        }
      ]
    };

    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: {
              size: 10
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              let value = context.raw || 0;
              return label + ': ' + new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 1
              }).format(value * 1000000);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              size: 9
            }
          },
          grid: {
            color: surfaceBorder,
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
            font: {
              size: 9
            },
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value);
            }
          },
          grid: {
            color: surfaceBorder,
          }
        }
      }
    };
  }

  initPieChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#333';

    this.pieData = {
      labels: ['Inversión', 'FONPET', 'Asignaciones Directas', 'Ciencia y Tecnología', 'Otros'],
      datasets: [
        {
          data: [35, 25, 20, 15, 5],
          backgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-500') || '#00bcd4',
            documentStyle.getPropertyValue('--p-blue-500') || '#2196f3',
            documentStyle.getPropertyValue('--p-indigo-500') || '#3f51b5',
            documentStyle.getPropertyValue('--p-purple-500') || '#9c27b0',
            documentStyle.getPropertyValue('--p-gray-500') || '#9e9e9e'
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-cyan-400') || '#26c6da',
            documentStyle.getPropertyValue('--p-blue-400') || '#42a5f5',
            documentStyle.getPropertyValue('--p-indigo-400') || '#5c6bc0',
            documentStyle.getPropertyValue('--p-purple-400') || '#ab47bc',
            documentStyle.getPropertyValue('--p-gray-400') || '#bdbdbd'
          ]
        }
      ]
    };

    this.pieChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: textColor,
            font: {
              size: 9
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              return context.label + ': ' + context.formattedValue + '%';
            }
          }
        }
      }
    };
  }

  initHorizontalChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#333';
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color') || '#6c757d';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    this.horizontalData = {
      labels: ['Asignaciones Directas', 'Inversión Regional', 'Inversión Local', 'CTeI', 'FONPET', 'Funcionamiento'],
      datasets: [
        {
          label: 'Presupuesto Bienal',
          backgroundColor: documentStyle.getPropertyValue('--p-blue-500') || '#2196f3',
          borderColor: documentStyle.getPropertyValue('--p-blue-500') || '#2196f3',
          data: [6500, 9800, 4400, 2900, 2200, 1100]
        },
        {
          label: 'Ejecución',
          backgroundColor: documentStyle.getPropertyValue('--p-green-500') || '#4caf50',
          borderColor: documentStyle.getPropertyValue('--p-green-500') || '#4caf50',
          data: [5800, 9200, 4100, 2700, 2200, 1000]
        }
      ]
    };

    this.horizontalChartoptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: {
              size: 9
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              let value = context.raw || 0;
              return label + ': ' + new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 1
              }).format(value * 1000000);
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
              size: 9
            },
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              size: 9
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }
}
