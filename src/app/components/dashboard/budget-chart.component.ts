import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

interface BudgetItem {
  desc: string;
  value: number;
  detail: Array<{desc: string, value: number}>;
}

@Component({
  selector: 'app-budget-chart',
  templateUrl: './budget-chart.component.html',
  styleUrls: ['./budget-chart.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    CardModule,
    ButtonModule,
    SelectButtonModule,
    FormsModule
  ]
})
export class BudgetChartComponent implements OnInit, OnChanges {
  @Input() budgetData: BudgetItem[] = [];

  // Opciones de gráfico
  chartType: string = 'bar';
  chartOptions: any = {};
  chartData: any = {};
  viewOptions: any[] = [];
  selectedView: string = 'bar';

  // Colores para los segmentos
  chartColors = [
    '#3366CC', // Azul real (el original)
    '#6699FF', // Azul cielo
    '#1A3366', // Azul marino
    '#4F81BD', // Azul acero
    '#0047AB', // Azul cobalto
    '#0F52BA', // Azul zafiro
    '#7CB9E8', // Azul celeste
    '#4B0082', // Azul índigo
    '#40E0D0', // Azul turquesa
    '#ADDFFF'  // Azul pálido
];

  constructor() {
    this.viewOptions = [
      { label: 'Gráfico Circular', value: 'pie' },
      { label: 'Gráfico de Barras', value: 'bar' }
    ];
  }

  ngOnInit(): void {
    this.initializeChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['budgetData'] && this.budgetData) {
      this.prepareChartData();
    }
  }

  initializeChartOptions(): void {
    // Configuración común para ambos tipos de gráfico
    const commonOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              size: 9,
              family: 'Roboto, Helvetica',
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              // Función para formatear los tooltips con formato de moneda
              const label = context.label || '';
              const value = context.raw || 0;
              return `${label}: ${this.formatCurrency(value)}`;
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    // Opciones específicas para cada tipo de gráfico
    this.chartOptions = {
      pie: {
        ...commonOptions,
        cutout: '50%',  // 0% hace un gráfico de pie, >0% crea un donut
        maintainAspectRatio: false,
        aspectRatio: 0.87,
      },
      bar: {
        ...commonOptions,
        indexAxis: 'y',  // Para barras horizontales
        maintainAspectRatio: false,
        aspectRatio: 0.87,
        categoryPercentage: 0.5,
        barThickness: 10,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              callback: (value: any) => {
                // Formatear los valores del eje X en el gráfico de barras
                return this.formatCompactNumber(value);
              }
            }
          }
        }
      }
    };

    // Preparar los datos iniciales
    this.prepareChartData();
  }

  prepareChartData(): void {
    // Filtrar los elementos relevantes (excluir Total SGP)
    const filteredData = this.budgetData
      .filter(item => item.desc !== 'Total SGP');

    // Preparar datos para ambos gráficos
    if (filteredData.length > 0) {
      const labels = filteredData.map(item => item.desc);
      const values = filteredData.map(item => item.value / 1000000000); // Convertir a miles de millones

      this.chartData = {
        pie: {
          labels: labels,
          datasets: [
            {
              data: values,
              backgroundColor: this.chartColors.slice(0, filteredData.length),
              hoverBackgroundColor: this.chartColors.map(color => this.adjustBrightness(color, 20))
            }
          ]
        },
        bar: {
          labels: labels,
          datasets: [
            {
              label: 'Presupuesto (Miles de Millones COP)',
              data: values,
              backgroundColor: this.chartColors.slice(0, filteredData.length),
              borderColor: this.chartColors.map(color => this.adjustBrightness(color, -20)),
              borderWidth: 1,
              barThickness: 30,
              maxBarThickness: 50
            }
          ]
        }
      };
    }
  }

  onChartTypeChange(event: any): void {
    this.selectedView = event.value;
  }

  // Función para formatear valores grandes en formato de moneda
  formatCurrency(value: number): string {
    return (value * 1000000000).toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true
    })
  }

  // Función para formatear números grandes de forma compacta (para ejes)
  formatCompactNumber(value: number): string {
    if (value === 0) return '0';

    const numberFormat = new Intl.NumberFormat('es-CO', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    });

    return numberFormat.format(value);
  }

  // Función para ajustar el brillo de un color
  adjustBrightness(col: string, amt: number): string {
    let usePound = false;

    if (col[0] === '#') {
      col = col.slice(1);
      usePound = true;
    }

    const num = parseInt(col, 16);

    let r = (num >> 16) + amt;
    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }
}
