import { Component, AfterViewInit, OnInit } from '@angular/core';
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
import { Select, SelectChangeEvent } from 'primeng/select';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { SicodisApiService } from '../../services/sicodis-api.service';

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
      CardModule,
      Select],
  templateUrl: './sgp-inicio.component.html',
  styleUrl: './sgp-inicio.component.scss'
})
export class SgpInicioComponent implements OnInit, AfterViewInit {

  constructor(private sicodisApiService: SicodisApiService) {
    Chart.register(...registerables, ChartDataLabels);
  }

  fechaActualizacion = '10 de julio de 2025';

  cifras: any = {
    presupuesto: 0,
    distribuido: 0,
    pendiente: 0,
    avance: 0
  };

  resumenParticipaciones: any = [
    { v: 0, label: 'Educación', idConcepto: '0101' },
    { v: 0, label: 'Salud', idConcepto: '0102' },
    { v: 0, label: 'Agua Potable', idConcepto: '0103' },
    { v: 0, label: 'Propósito General', idConcepto: '0104' },
    { v: 0, label: 'Asignaciones Especiales', idConcepto: '0204' }
  ]

  donutData: any;
  donutOptions: any;

  chartData1: any;
  chartData3: any;
  mixedChartOptions: any;
  barChartOptions: any;
  
  years2005to2025 = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  yearsRange = ['2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  
  historicoData: any[] = [];

  // Select options and selected value
  vigencias: any[] = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' }
  ];
  selectedVigencia: any = { value: '2025', label: '2025' };

  recursos = [
    {
      titulo: 'Histórico SGP',
      descripcion: 'Consulta y explora el detalle histórico del sistema',
      boton: 'Consultar',
      link: '/comparador',
      icon: 'timeline'
    },
    {
      titulo: 'SGP Documentos y anexos',
      descripcion: 'Consulta los documentos y anexos publicados',
      boton: 'Consultar',
      link: '/detalle-entidad',
      icon: 'description'
    },
    {
      titulo: 'Presupuesto',
      descripcion: 'Consulta el detalle de la información presupuestal',
      boton: 'Consultar',
      link: '/documentos',
      icon: 'account_balance_wallet'
    },
    {
      titulo: 'Comparativa',
      descripcion: 'Compara vigencias y entidades.',
      boton: 'Consultar',
      link: '/reportes',
      icon: 'compare_arrows'
    },{
      titulo: 'Consulta de eficiencia',
      descripcion: 'Consulta de eficiencia',
      boton: 'Consultar',
      link: '/reportes',
      icon: 'trending_up'
    },
    {
      titulo: 'Resguardos indígenas',
      descripcion: 'Consulta los resguardos indígenas',
      boton: 'Consultar',
      link: '/reportes',
      icon: 'groups'
    },
    {
      titulo: 'Proyecciones SGP',
      descripcion: 'Consulta las proyecciones del sistema',
      boton: 'Consultar',
      link: '/reportes',
      icon: 'insights'
    },
    {
      titulo: 'Proyecciones SGP',
      descripcion: 'Consulta variables del sistema',
      boton: 'Consultar',
      link: '/reportes',
      icon: 'insights'
    }
  ];

  ngOnInit(): void {
    this.loadSgpData();

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
    // Reinitialize donut chart after view is initialized
    setTimeout(() => {
      this.initializeDonutData();
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

  formatFecha(fecha: Date): string {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();
    
    return `${dia} de ${mes} de ${anio}`;
  }

  loadSgpData(): void {
    console.log("loadSgpData...");
    const year = this.selectedVigencia?.value || 2025;
    this.sicodisApiService.getSgpResumenGeneral(year).subscribe({
      next: (result: any) => {
        let resumen = result[0];
        this.fechaActualizacion = this.formatFecha(new Date(resumen.fecha_ultima_actualizacion));
        this.cifras = {
          presupuesto: resumen.total_presupuesto,
          distribuido: resumen.total_distribuido,
          pendiente: resumen.total_presupuesto - resumen.total_distribuido,
          avance: resumen.porcentaje_avance / 100
        };
        this.loadSgpParticipaciones();
        // this.loadSgpHistoricoData();
      },
      error: (error) => {
        console.error('Error loading SGP data:', error);
        // Mantener datos por defecto en caso de error
        this.cifras = {
          presupuesto: 70540879911189,
          distribuido: 65200000000000,
          pendiente: 5330879911189,
          avance: 92.5
        };
        this.loadSgpParticipaciones();
        // this.loadSgpHistoricoData();
      }
    });
  }

  loadSgpParticipaciones(): void {
    console.log("loadSgpParticipaciones...");
    const year = this.selectedVigencia?.value || 2025;
    this.sicodisApiService.getSgpResumenParticipaciones(year, 'TODOS', 'TODOS').subscribe({
      next: (result: any) => {
        //console.log('Participaciones data:', result);
        // Actualizar resumenParticipaciones con los datos del API
        this.updateResumenParticipaciones(result);
        this.initializeDonutData();
      },
      error: (error) => {
        console.error('Error loading SGP participaciones:', error);
        // Usar datos por defecto en caso de error
        this.initializeDonutData();
      }
    });
  }

  updateResumenParticipaciones(apiData: any): void {
    const dataArray = Array.isArray(apiData) ? apiData : [apiData];
    
    // Actualizar cada concepto con los datos del API
    this.resumenParticipaciones.forEach((item: any) => {
      const apiItem = dataArray.find((data: any) => data.id_concepto === item.idConcepto);
      if (apiItem) {
        item.v = apiItem.total;
        item.label = apiItem.concepto;
      }
    });
    
    console.log('Updated resumenParticipaciones:', this.resumenParticipaciones);
  }

  loadSgpHistoricoData(): void {
    console.log("loadSgpHistoricoData...");
    const aniosString = this.yearsRange.join(',');
    
    this.sicodisApiService.getSgpResumenHistorico({ anios: aniosString }).subscribe({
      next: (result: any) => {
        console.log('Historico data:', result);
        this.historicoData = result;
        this.initializeChartsWithHistoricoData();
      },
      error: (error) => {
        console.error('Error loading SGP historico:', error);
        // Usar datos generados en caso de error
        this.initializeChartsWithGeneratedData();
      }
    });
  }

  initializeChartsWithHistoricoData(): void {
    // Filtrar solo los registros con id_concepto = '99' que corresponden al total
    let totalData: any = {};
    this.historicoData.forEach((item: any) => {
      if (item.id_concepto === '99'){        
        totalData[item.annio] = {corrientes: item.total_corrientes, constantes: item.total_constantes};        
      }
    });
    
    /* const dataByYear = totalData.reduce((acc: any, item: any) => {
      acc[item.anio] = {
        total_corrientes: item.total_corrientes,
        variacion_anual: item.variacion_anual
      };
      return acc;
    }, {}); */

    const sgpDataCorrientes = this.yearsRange.map(year => 
      totalData[parseInt(year)]?.corrientes || 0
    );
    
    const variationDataCorrientes = this.yearsRange.map(year => 
      totalData[parseInt(year)]?.variacion_anual || 0
    );

    this.chartData1 = {
      labels: this.yearsRange,
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

    this.initChart3WithHistoricoData(totalData);
  }

  initializeChartsWithGeneratedData(): void {
    const sgpDataCorrientes = this.generateGrowingData(20000, 85000, this.yearsRange.length);
    const variationDataCorrientes = this.generateVariationData(sgpDataCorrientes);

    this.chartData1 = {
      labels: this.yearsRange,
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
  }

  initChart3WithHistoricoData(dataByYear: any): void {
    const sgpData = this.yearsRange.map(year => 
      dataByYear[parseInt(year)]?.constantes || 0
    );
    
    const variationData = this.yearsRange.map(year => 
      dataByYear[parseInt(year)]?.variacion_anual || 0
    );

    this.chartData3 = {
      labels: this.yearsRange,
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

  initializeDonutData(): void {
    // Usar datos de resumenParticipaciones en lugar de datos hardcodeados
    const rawData = this.resumenParticipaciones.filter((item: any) => item.v > 0);

    const labels = rawData.map((item: any) => item.label);
    const data = rawData.map((item: any) => item.v);
    
    // Colores especificados: #156082, #e97132, #196b24, #196b24, #a02b93
    const colors = ['#156082', '#e97132', '#196b24', '#0c9bd3', '#a02b93'];

    this.donutData = {
      labels: labels,
      datasets: [
        {
          label: 'Distribución SGP',
          data: data,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };

    this.donutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed;
              const formattedValue = new Intl.NumberFormat('es-CO', { 
                minimumFractionDigits: 0, 
                maximumFractionDigits: 0 
              }).format(value);
              return `${context.label}: ${formattedValue}`;
            }
          }
        },
        datalabels: {
          display: true,
          color: '#ffffff',
          font: {
            size: 14,
            weight: 'bold'
          },
          formatter: (value: any, context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100 * 100) / 100;
            return `${percentage}%`;
          }
        }
      }
    };
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia changed:', event.value);
    this.selectedVigencia = event.value;
    // Reload data for the selected year
    this.loadSgpData();
  }
}
