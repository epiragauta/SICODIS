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

@Component({
  selector: 'app-sgr-montos-corrientes-constantes',
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
    NumberFormatPipe
  ],
  templateUrl: './sgr-montos-corrientes-constantes.component.html',
  styleUrl: './sgr-montos-corrientes-constantes.component.scss'
})
export class SgrMontosCorrientesConstantesComponent implements OnInit {
  
  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Chart data for vertical bar charts
  valoresCorrientesChartData: any = {};
  valoresCorrientesChartOptions: any = {};
  valoresConstantesChartData: any = {};
  valoresConstantesChartOptions: any = {};

  // Table data
  presupuestoRecaudoTableData: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    // Inicialización del componente
    this.initializeBarCharts();
    this.initializeTableData();
  }

  /**
   * Inicializar datos y opciones de los gráficos de barras
   */
  private initializeBarCharts(): void {
    // Labels para los períodos desde 2012 hasta 2025-2026
    const periodLabels = [
      '2012', '2013-2014', '2015-2016', '2017-2018', '2019-2020', 
      '2021-2022', '2023-2024', '2025-2026'
    ];

    // Datos simulados para Valores Corrientes (en billones de pesos)
    const corrientesPresupuestoData = [25, 32, 45, 58, 67, 78, 92, 125];
    const corrientesRecaudoData = [20, 28, 38, 49, 58, 68, 82, 105];

    // Datos simulados para Valores Constantes (en billones de pesos base 2018)
    const constantesPresupuestoData = [35, 38, 47, 58, 61, 65, 74, 85];
    const constantesRecaudoData = [28, 33, 40, 49, 53, 57, 66, 72];

    // Datos de variación porcentual corrientes-constantes
    const variacionData = [5.2, 28.0, 40.6, 28.9, 15.5, 16.4, 17.9, 35.9];

    // Configuración para gráfico de Valores Corrientes
    this.valoresCorrientesChartData = {
      labels: periodLabels,
      datasets: [
        {
          label: '% Variación corrientes-constantes',
          data: variacionData,
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 3,
          type: 'line',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
          pointBackgroundColor: '#ff6b35',
          pointBorderColor: '#ff6b35',
          pointRadius: 5,
          order: 0
        },
        {
          label: 'Presupuesto',
          data: corrientesPresupuestoData,
          backgroundColor: '#f38135ff',
          borderColor: '#be480eff',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          order: 1
        },
        {
          label: 'Recaudo',
          data: corrientesRecaudoData,
          backgroundColor: '#7991e8ff',
          borderColor: '#3d4d7a',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          order: 2
        }
      ]
    };

    // Configuración para gráfico de Valores Constantes
    this.valoresConstantesChartData = {
      labels: periodLabels,
      datasets: [
        {
          label: '% Variación corrientes-constantes',
          data: variacionData,
          borderColor: '#ff6b35',
          backgroundColor: 'rgba(255, 107, 53, 0.1)',
          borderWidth: 3,
          type: 'line',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
          pointBackgroundColor: '#ff6b35',
          pointBorderColor: '#ff6b35',
          pointRadius: 5,
          order: 0
        },
        {
          label: 'Presupuesto',
          data: constantesPresupuestoData,
          backgroundColor: '#f38135ff',
          borderColor: '#be480eff',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          order: 1
        },
        {
          label: 'Recaudo',
          data: constantesRecaudoData,
          backgroundColor: '#7991e8ff',
          borderColor: '#3d4d7a',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
          order: 2
        }
      ]
    };

    // Opciones comunes para ambos gráficos
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Work Sans'
            },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Billones de pesos',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#374151',
            callback: (value: any) => {
              return '$' + value + 'B';
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: '% Variación',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#ff6b35'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#ff6b35',
            callback: (value: any) => {
              return value + '%';
            }
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          title: {
            display: true,
            text: 'Período',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#374151',
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    };

    this.valoresCorrientesChartOptions = { ...commonOptions };
    this.valoresConstantesChartOptions = { ...commonOptions };
  }

  /**
   * Inicializar datos de la tabla de presupuesto y recaudo
   */
  private initializeTableData(): void {
    this.presupuestoRecaudoTableData = [
      {
        vigencia: '2012',
        presupuesto_corrientes: 25000000000000, // 25 billones
        presupuesto_constantes: 35000000000000, // 35 billones
        presupuesto_variacion: 5.2,
        recaudo_corrientes: 20000000000000, // 20 billones
        recaudo_constantes: 28000000000000, // 28 billones
        recaudo_variacion: 4.8
      },
      {
        vigencia: '2013-2014',
        presupuesto_corrientes: 32000000000000, // 32 billones
        presupuesto_constantes: 38000000000000, // 38 billones
        presupuesto_variacion: 28.0,
        recaudo_corrientes: 28000000000000, // 28 billones
        recaudo_constantes: 33000000000000, // 33 billones
        recaudo_variacion: 40.0
      },
      {
        vigencia: '2015-2016',
        presupuesto_corrientes: 45000000000000, // 45 billones
        presupuesto_constantes: 47000000000000, // 47 billones
        presupuesto_variacion: 40.6,
        recaudo_corrientes: 38000000000000, // 38 billones
        recaudo_constantes: 40000000000000, // 40 billones
        recaudo_variacion: 35.7
      },
      {
        vigencia: '2017-2018',
        presupuesto_corrientes: 58000000000000, // 58 billones
        presupuesto_constantes: 58000000000000, // 58 billones (año base)
        presupuesto_variacion: 28.9,
        recaudo_corrientes: 49000000000000, // 49 billones
        recaudo_constantes: 49000000000000, // 49 billones (año base)
        recaudo_variacion: 28.9
      },
      {
        vigencia: '2019-2020',
        presupuesto_corrientes: 67000000000000, // 67 billones
        presupuesto_constantes: 61000000000000, // 61 billones
        presupuesto_variacion: 15.5,
        recaudo_corrientes: 58000000000000, // 58 billones
        recaudo_constantes: 53000000000000, // 53 billones
        recaudo_variacion: 18.4
      },
      {
        vigencia: '2021-2022',
        presupuesto_corrientes: 78000000000000, // 78 billones
        presupuesto_constantes: 65000000000000, // 65 billones
        presupuesto_variacion: 16.4,
        recaudo_corrientes: 68000000000000, // 68 billones
        recaudo_constantes: 57000000000000, // 57 billones
        recaudo_variacion: 17.2
      },
      {
        vigencia: '2023-2024',
        presupuesto_corrientes: 92000000000000, // 92 billones
        presupuesto_constantes: 74000000000000, // 74 billones
        presupuesto_variacion: 17.9,
        recaudo_corrientes: 82000000000000, // 82 billones
        recaudo_constantes: 66000000000000, // 66 billones
        recaudo_variacion: 20.6
      },
      {
        vigencia: '2025-2026',
        presupuesto_corrientes: 125000000000000, // 125 billones
        presupuesto_constantes: 85000000000000, // 85 billones
        presupuesto_variacion: 35.9,
        recaudo_corrientes: 105000000000000, // 105 billones
        recaudo_constantes: 72000000000000, // 72 billones
        recaudo_variacion: 28.0
      }
    ];
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
   * Descargar reporte Excel
   */
  downloadExcel(): void {
    console.log('Descargando reporte Excel de montos corrientes y constantes');
    // Aquí se implementaría la lógica de descarga del Excel
  }

  /**
   * Generar contenido del diccionario
   */
  private generarContenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Montos Corrientes y Constantes</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>Valores Corrientes:</strong> Montos expresados en pesos del año correspondiente</li>
          <li style="margin-bottom: 0.5rem;"><strong>Valores Constantes:</strong> Montos ajustados por inflación a pesos de un año base</li>
          <li style="margin-bottom: 0.5rem;"><strong>Presupuesto:</strong> Monto total asignado para el período correspondiente</li>
          <li style="margin-bottom: 0.5rem;"><strong>Recaudo:</strong> Monto efectivamente recaudado durante el período</li>
          <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis comparativo</li>
          <li style="margin-bottom: 0.5rem;"><strong>Evolución Histórica:</strong> Seguimiento temporal de los montos del SGR</li>
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