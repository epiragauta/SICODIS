import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { MatIconModule } from '@angular/material/icon';
import { FloatLabel } from 'primeng/floatlabel';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-sgp-inicio',
  standalone: true,
  imports: [CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatSelectModule,
      MatGridListModule,
      MatCardModule,
      ButtonModule,
      ChartModule,
      NumberFormatPipe,
      MatIconModule,
      FloatLabel,      
      InfoPopupComponent,
      SplitButtonModule,
      CardModule],
  templateUrl: './sgp-inicio.component.html',
  styleUrl: './sgp-inicio.component.scss'
})
export class SgpInicioComponent implements AfterViewInit {

  constructor() {
    Chart.register(...registerables, TreemapController, TreemapElement, ChartDataLabels);
  }

  fechaActualizacion = '10 de julio de 2025';

  cifras = {
    presupuesto: 70540879911189,
    distribuido: 65200000000000,
    pendiente: 5330879911189,
    avance: 92.5
  };

  treemapData: any;
  treemapOptions: any;
  treemapType: any = 'treemap';

  chartData1: any;
  chartData3: any;
  mixedChartOptions: any;
  barChartOptions: any;
  
  years2005to2025 = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  recursos = [
    {
      titulo: 'Histórico SGP',
      descripcion: 'Compara la evolución del SGP entre distintas vigencias.',
      boton: 'Ir al comparador',
      link: '/comparador',
      icon: 'assessment'
    },
    {
      titulo: 'SGP Documentos y anexos',
      descripcion: 'Consulta los valores distribuidos por departamento y municipio.',
      boton: 'Ver detalle',
      link: '/detalle-entidad',
      icon: 'receipt_long'
    },
    {
      titulo: 'Presupuesto',
      descripcion: 'Accede a resoluciones y anexos por vigencia.',
      boton: 'Ver documentos',
      link: '/documentos',
      icon: 'style'
    },
    {
      titulo: 'Comparativa',
      descripcion: 'Visualiza reportes descargables del SGP.',
      boton: 'Ir a reportes',
      link: '/reportes',
      icon: 'business_center'
    }
  ];

  ngOnInit(): void {
    this.initializeTreemapData();

    const sgpDataCorrientes = this.generateGrowingData(20000, 85000, this.years2005to2025.length);
    const variationDataCorrientes = this.generateVariationData(sgpDataCorrientes);

    this.chartData1 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationDataCorrientes,
          borderColor: '#0f4987',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpDataCorrientes,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    this.initChart3();

    this.mixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.25,
      scales: {
        y: {
          beginAtZero: true,
          position: 'left',
          title: { display: true, text: 'Miles de millones COP' }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Variación (%)' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        datalabels: { display: false }
      }
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.25,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Miles de millones COP'
          },
          ticks: {
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO').format(value);
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Variación Anual (%)'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (context.dataset.yAxisID === 'y1') {
                return label + ': ' + context.parsed.y + '%';
              } else {
                return label + ': ' + new Intl.NumberFormat('es-CO').format(context.parsed.y) + ' COP';
              }
            }
          }
        },
        datalabels: { display: false }
      }
    };
  }

  ngAfterViewInit(): void {
    // Reinitialize treemap after view is initialized
    setTimeout(() => {
      this.initializeTreemapData();
    }, 100);
  }

  generateGrowingData(startValue: number, endValue: number, length: number): number[] {
    const data = [];
    const increment = (endValue - startValue) / (length - 1);
    for (let i = 0; i < length; i++) {
      const randomFactor = 0.9 + Math.random() * 0.2; // Variación aleatoria ±10%
      data.push(Math.round((startValue + increment * i) * randomFactor));
    }
    data[data.length - 1] = endValue; // Asegurar valor final
    return data;
  }

  generateVariationData(baseData: number[]): number[] {
    const variations = [5]; // Primera variación
    for (let i = 1; i < baseData.length; i++) {
      const variation = ((baseData[i] - baseData[i-1]) / baseData[i-1]) * 100;
      variations.push(Math.round(variation));
    }
    return variations;
  }

  initChart3(): void {
    const sgpData = this.generateGrowingData(15000, 78000, this.years2005to2025.length);
    const variationData = this.generateVariationData(sgpData);

    this.chartData3 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#FF1493',
          backgroundColor: 'rgba(255, 20, 147, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpData,
          backgroundColor: '#0f4987',
          borderColor: '#007BFF',
          yAxisID: 'y'
        }        
      ]
    };
  }

  initializeTreemapData(): void {
    this.treemapData = {
      datasets: [
        {
          label: 'Distribución SGP (%)',
          data: [
            { v: 40, label: 'Educación' },
            { v: 23, label: 'Salud' },
            { v: 12, label: 'Agua Potable' },
            { v: 7, label: 'Propósito General' },
            { v: 18, label: 'Asignaciones Especiales' }
          ],
          key: 'v',
          groups: ['label'],
          spacing: 0.5,
          borderWidth: 0.1,
          borderColor: '#ffffff',
          backgroundColor: (context: any) => {
            const colors = [ '#66BB6A', '#42A5F5', '#AB47BC', '#ee106cff', '#FFA726'  ];
            return colors[context.dataIndex] || '#42A5F5';
          }
        }
      ]
    };

    this.treemapOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.72,
      interaction: {
        intersect: false
      },
      plugins: {
        legend: { 
          display: false
        },
        tooltip: {
          callbacks: {
            title: (context: any) => {
              return context[0].raw._data.label || 'SGP';
            },
            label: (context: any) => {
              return `${context.raw.v}%`;
            }
          }
        },
        datalabels: {
          display: true,
          anchor: 'center',
          align: 'center',
          color: '#ffffff',
          font: {
            size: 11,            
          },
          textAlign: 'center',
          formatter: (value: any, context: any) => {
            const data = context.chart.data.datasets[context.datasetIndex].data[context.dataIndex];
            const label = data._data.label.replace(/ /g, '\n');
            return `${label}\n${data.v}%`;
          }
        }
      }
    };
  }
}
