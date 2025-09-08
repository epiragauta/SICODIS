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

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    // Inicialización del componente
    this.initializeBarCharts();
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

    // Configuración para gráfico de Valores Corrientes
    this.valoresCorrientesChartData = {
      labels: periodLabels,
      datasets: [
        {
          label: 'Presupuesto',
          data: corrientesPresupuestoData,
          backgroundColor: '#f38135ff',
          borderColor: '#be480eff',
          borderWidth: 1
        },
        {
          label: 'Recaudo',
          data: corrientesRecaudoData,
          backgroundColor: '#7991e8ff',
          borderColor: '#3d4d7a',
          borderWidth: 1
        }
      ]
    };

    // Configuración para gráfico de Valores Constantes
    this.valoresConstantesChartData = {
      labels: periodLabels,
      datasets: [
        {
          label: 'Presupuesto',
          data: constantesPresupuestoData,
          backgroundColor: '#f38135ff',
          borderColor: '#be480eff',
          borderWidth: 1
        },
        {
          label: 'Recaudo',
          data: constantesRecaudoData,
          backgroundColor: '#7991e8ff',
          borderColor: '#3d4d7a',
          borderWidth: 1
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