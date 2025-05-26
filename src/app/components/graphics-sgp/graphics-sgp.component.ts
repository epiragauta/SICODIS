import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-graphics-sgp',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    ChartModule,
    CardModule
  ],
  templateUrl: './graphics-sgp.component.html',
  styleUrl: './graphics-sgp.component.scss'
})
export class GraphicsSgpComponent implements OnInit {
  
  // Configuración responsiva
  cols: number = 2;
  
  // Variables para todos los gráficos
  chartData1: any; // Evolución SGP – Precios Corrientes
  chartData2: any; // Evolución SGP Por Participaciones– Precios Corrientes
  chartData3: any; // Evolución SGP – Precios Constantes
  chartData4: any; // Evolución SGP por Participaciones – Precios Constantes
  chartData5Left: any; // Evolución Educación SGP - Precios Corrientes
  chartData5Right: any; // Evolución Educación SGP - Precios Constantes
  chartData6Left: any; // Evolución Salud SGP - Precios Corrientes
  chartData6Right: any; // Evolución Salud SGP - Precios Constantes
  chartData7Left: any; // Evolución Agua Potable SGP - Precios Corrientes
  chartData7Right: any; // Evolución Agua Potable SGP - Precios Constantes
  chartData8Left: any; // Evolución Propósito General SGP - Precios Corrientes
  chartData8Right: any; // Evolución Propósito General SGP - Precios Constantes
  chartData9Left: any; // Evolución Asignaciones Especiales SGP - Precios Corrientes
  chartData9Right: any; // Evolución Asignaciones Especiales SGP - Precios Constantes

  // Opciones para los gráficos
  mixedChartOptions: any;
  stackedBarOptions: any;
  barChartOptions: any;
  smallMixedChartOptions: any;

  // Datos base
  years2005to2025 = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  years2015to2024 = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];

  constructor(private breakpointObserver: BreakpointObserver) {
    // Configuración responsiva
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
  }

  ngOnInit() {
    this.initializeChartOptions();
    this.initializeAllCharts();
  }

  initializeChartOptions() {
    // Opciones para gráficos mixtos (barras + línea)
    this.mixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
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
        }
      }
    };

    // Opciones para gráficos de barras apiladas
    this.stackedBarOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Años'
          }
        },
        y: {
          stacked: true,
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
        }
      }
    };

    // Opciones para gráficos simples de barras
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
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
        }
      }
    };

    // Opciones para gráficos pequeños (filas 5-9)
    this.smallMixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años',
            font: {
              size: 10
            }
          },
          ticks: {
            font: {
              size: 9
            }
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Miles de millones COP',
            font: {
              size: 10
            }
          },
          ticks: {
            font: {
              size: 9
            },
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
            text: 'Variación (%)',
            font: {
              size: 10
            }
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            font: {
              size: 9
            },
            callback: function(value: any) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 10
            }
          }
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
        }
      }
    };
  }

  initializeAllCharts() {
    this.initChart1();
    this.initChart2();
    this.initChart3();
    this.initChart4();
    this.initChart5();
    this.initChart6();
    this.initChart7();
    this.initChart8();
    this.initChart9();
  }

  // Función auxiliar para generar datos crecientes
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

  // Función auxiliar para generar variaciones porcentuales
  generateVariationData(baseData: number[]): number[] {
    const variations = [5]; // Primera variación
    for (let i = 1; i < baseData.length; i++) {
      const variation = ((baseData[i] - baseData[i-1]) / baseData[i-1]) * 100;
      variations.push(Math.round(variation));
    }
    return variations;
  }

  // 1. Evolución SGP – Precios Corrientes
  initChart1() {
    const sgpData = this.generateGrowingData(15000, 82000, this.years2005to2025.length);
    const variationData = this.generateVariationData(sgpData);

    this.chartData1 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#0f4987',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpData,
          backgroundColor: '#FF8C00',
          borderColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };
  }

  // 2. Evolución SGP Por Participaciones– Precios Corrientes
  initChart2() {
    const totalData = this.generateGrowingData(15000, 82000, this.years2005to2025.length);
    const variationData = this.generateVariationData(totalData);
    
    // Distribuir proporcionalmente entre las participaciones
    const educacionData = totalData.map(val => Math.round(val * 0.45));
    const saludData = totalData.map(val => Math.round(val * 0.25));
    const aguaData = totalData.map(val => Math.round(val * 0.15));
    const propositoData = totalData.map(val => Math.round(val * 0.12));
    const asignacionesData = totalData.map(val => Math.round(val * 0.03));

    this.chartData2 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#ce6010',
          backgroundColor: 'rgba(255, 140, 0, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Educación',
          data: educacionData,
          backgroundColor: '#28A745',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Salud',
          data: saludData,
          backgroundColor: '#35ce58',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Agua Potable',
          data: aguaData,
          backgroundColor: '#61d97d',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Propósito General',
          data: propositoData,
          backgroundColor: '#87e99e',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Asignaciones Especiales',
          data: asignacionesData,
          backgroundColor: '#8ef2a6',
          stack: 'stack1'
        }        
      ]
    };
  }

  // 3. Evolución SGP – Precios Constantes
  initChart3() {
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

  // 4. Evolución SGP por Participaciones – Precios Constantes
  initChart4() {
    const totalData = this.generateGrowingData(15000, 78000, this.years2005to2025.length);
    const variationData = this.generateVariationData(totalData);
    
    const educacionData = totalData.map(val => Math.round(val * 0.45));
    const saludData = totalData.map(val => Math.round(val * 0.25));
    const aguaData = totalData.map(val => Math.round(val * 0.15));
    const propositoData = totalData.map(val => Math.round(val * 0.12));
    const asignacionesData = totalData.map(val => Math.round(val * 0.03));

    this.chartData4 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#ce6010',
          backgroundColor: 'rgba(255, 140, 0, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Educación',
          data: educacionData,
          backgroundColor: '#28A745',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Salud',
          data: saludData,
          backgroundColor: '#35ce58',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Agua Potable',
          data: aguaData,
          backgroundColor: '#61d97d',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Propósito General',
          data: propositoData,
          backgroundColor: '#87e99e',
          stack: 'stack1'
        },
        {
          type: 'bar',
          label: 'Asignaciones Especiales',
          data: asignacionesData,
          backgroundColor: '#8ef2a6',
          stack: 'stack1'
        }        
      ]
    };
  }

  // 5. Evolución Educación SGP
  initChart5() {
    // Precios Corrientes
    const educacionCorrienteData = this.generateGrowingData(25000, 42000, this.years2015to2024.length);
    const variacionCorrienteData = this.generateVariationData(educacionCorrienteData);

    this.chartData5Left = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionCorrienteData,
          borderColor: '#0a2e55',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Educación',
          data: educacionCorrienteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }        
      ]
    };

    // Precios Constantes
    const educacionConstanteData = this.generateGrowingData(24000, 38000, this.years2015to2024.length);
    const variacionConstanteData = this.generateVariationData(educacionConstanteData);

    this.chartData5Right = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionConstanteData,
          borderColor: '#28A745',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Educación',
          data: educacionConstanteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }        
      ]
    };
  }

  // 6. Evolución Salud SGP
  initChart6() {
    // Precios Corrientes
    const saludCorrienteData = this.generateGrowingData(12000, 17000, this.years2015to2024.length);
    const variacionCorrienteData = this.generateVariationData(saludCorrienteData);

    this.chartData6Left = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionCorrienteData,
          borderColor: '#0a2e55',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Salud',
          data: saludCorrienteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }        
      ]
    };

    // Precios Constantes
    const saludConstanteData = this.generateGrowingData(11500, 15500, this.years2015to2024.length);
    const variacionConstanteData = this.generateVariationData(saludConstanteData);

    this.chartData6Right = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionConstanteData,
          borderColor: '#28A745',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Salud',
          data: saludConstanteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }        
      ]
    };
  }

  // 7. Evolución Agua Potable SGP
  initChart7() {
    // Precios Corrientes
    const aguaCorrienteData = this.generateGrowingData(2200, 3800, this.years2015to2024.length);
    const variacionCorrienteData = this.generateVariationData(aguaCorrienteData);

    this.chartData7Left = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionCorrienteData,
          borderColor: '#0a2e55',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Agua Potable',
          data: aguaCorrienteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    // Precios Constantes
    const aguaConstanteData = this.generateGrowingData(2100, 3400, this.years2015to2024.length);
    const variacionConstanteData = this.generateVariationData(aguaConstanteData);

    this.chartData7Right = {
      labels: this.years2015to2024,
      datasets: [        
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionConstanteData,
          borderColor: '#28A745',
          fill: false,
          yAxisID: 'y1'
        },{
          type: 'bar',
          label: 'Agua Potable',
          data: aguaConstanteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };
  }

  // 8. Evolución Propósito General SGP
  initChart8() {
    // Precios Corrientes
    const propositoCorrienteData = this.generateGrowingData(4500, 8200, this.years2015to2024.length);
    const variacionCorrienteData = this.generateVariationData(propositoCorrienteData);

    this.chartData8Left = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionCorrienteData,
          borderColor: '#0a2e55',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Propósito General',
          data: propositoCorrienteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    // Precios Constantes
    const propositoConstanteData = this.generateGrowingData(4200, 7500, this.years2015to2024.length);
    const variacionConstanteData = this.generateVariationData(propositoConstanteData);

    this.chartData8Right = {
      labels: this.years2015to2024,
      datasets: [        
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionConstanteData,
          borderColor: '#28A745',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Propósito General',
          data: propositoConstanteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };
  }

  // 9. Evolución Asignaciones Especiales SGP
  initChart9() {
    // Datos más variables para asignaciones especiales
    const asignacionesCorrienteData = [800, 850, 740, 237, 265, 455, 1111, 1155, 1421, 1776];
    const variacionCorrienteData = this.generateVariationData(asignacionesCorrienteData);

    this.chartData9Left = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionCorrienteData,
          borderColor: '#0a2e55',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Asignaciones Especiales',
          data: asignacionesCorrienteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    // Precios Constantes
    const asignacionesConstanteData = [760, 810, 700, 225, 252, 432, 1055, 1098, 1350, 1688];
    const variacionConstanteData = this.generateVariationData(asignacionesConstanteData);

    this.chartData9Right = {
      labels: this.years2015to2024,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variacionConstanteData,
          borderColor: '#28A745',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'Asignaciones Especiales',
          data: asignacionesConstanteData,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };
  }
}