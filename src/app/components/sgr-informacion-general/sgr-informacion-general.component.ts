import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart } from 'chart.js/auto';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';

// Services
import { SicodisApiService } from '../../services/sicodis-api.service';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

interface KPIData {
  presupuestoTotal: number;
  recaudoCorriente: number;
  avanceRecaudo: number;
}

interface EntidadCount {
  beneficiarias: number;
  productoras: number;
  zomac: number;
  pdet: number;
  etnicas: number;
}

interface FiltroCaracterizacion {
  conceptoGasto: boolean;
  regional: boolean;
  asignacion: boolean;
  grupoInteres: boolean;
}

interface FiltroEntidad {
  beneficiario: boolean;
  productoras: boolean;
  pdet: boolean;
  zomac: boolean;
  etnica: boolean;
  capital: boolean;
}

interface PresupuestoMetricas {
  presupuestoTotal: number;
  presupuestoCorriente: number;
  presupuestoOtros: number;
  porcentajeDisponibilidad: number;
}

interface RecaudoMetricas {
  recaudoTotal: number;
  recaudoCorriente: number;
  recaudoOtros: number;
}

@Component({
  selector: 'app-sgr-informacion-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    CheckboxModule,
    NumberFormatPipe
  ],
  templateUrl: './sgr-informacion-general.component.html',
  styleUrl: './sgr-informacion-general.component.scss'
})
export class SgrInformacionGeneralComponent implements OnInit {

  // KPIs principales
  kpiData: KPIData = {
    presupuestoTotal: 54627842000000,
    recaudoCorriente: 48234567000000,
    avanceRecaudo: 88.3
  };

  // Conteo de entidades
  entidadesCount: EntidadCount = {
    beneficiarias: 1124,
    productoras: 32,
    zomac: 344,
    pdet: 170,
    etnicas: 913
  };

  // Filtros
  periodicidad: string = 'Bienal';

  filtroCaracterizacion: FiltroCaracterizacion = {
    conceptoGasto: false,
    regional: false,
    asignacion: false,
    grupoInteres: true
  };

  filtroEntidad: FiltroEntidad = {
    beneficiario: false,
    productoras: false,
    pdet: false,
    zomac: true,
    etnica: false,
    capital: false
  };

  // Métricas de presupuesto
  presupuestoMetricas: PresupuestoMetricas = {
    presupuestoTotal: 54627842000000,
    presupuestoCorriente: 48234567000000,
    presupuestoOtros: 6393275000000,
    porcentajeDisponibilidad: 11.7
  };

  // Métricas de recaudo
  recaudoMetricas: RecaudoMetricas = {
    recaudoTotal: 48234567000000,
    recaudoCorriente: 42567234000000,
    recaudoOtros: 5667333000000
  };

  // Datos para gráficas
  private chartLinea: Chart | null = null;
  private chartGauge: Chart | null = null;

  // Estados
  isLoading = signal(false);
  currentPresupuestoIndex = 0;
  fechaReporte: string = '';

  constructor(private sicodisApiService: SicodisApiService) {
    const fecha = new Date();
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    this.fechaReporte = `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  ngOnInit(): void {
    this.loadData();
    setTimeout(() => {
      this.createChartLinea();
      this.createChartGauge();
    }, 100);
  }

  loadData(): void {
    this.isLoading.set(true);

    // Aquí se conectaría con los endpoints reales cuando estén disponibles
    // this.sicodisApiService.getSgrResumenPtoRecaudo(...).subscribe(...)

    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros:', {
      periodicidad: this.periodicidad,
      caracterizacion: this.filtroCaracterizacion,
      entidad: this.filtroEntidad
    });
    this.loadData();
  }

  prevPresupuesto(): void {
    if (this.currentPresupuestoIndex > 0) {
      this.currentPresupuestoIndex--;
    }
  }

  nextPresupuesto(): void {
    if (this.currentPresupuestoIndex < 3) {
      this.currentPresupuestoIndex++;
    }
  }

  get presupuestoActual(): string {
    const metricas = [
      'Presupuesto Total',
      'Presupuesto Corriente',
      'Presupuesto Otros',
      '% participación de la Disponibilidad Inicial por vigencia'
    ];
    return metricas[this.currentPresupuestoIndex];
  }

  exportarReporte(): void {
    console.log('Exportando reporte...');
    alert('Funcionalidad de exportación en desarrollo');
  }

  createChartLinea(): void {
    const ctx = document.getElementById('chartLinea') as HTMLCanvasElement;
    if (!ctx) return;

    // Datos de ejemplo: avance de recaudo mensual
    const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const data = [15, 22, 28, 35, 42, 48, 55, 62, 68, 75, 82, 88.3];

    this.chartLinea = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Avance Recaudo (%)',
          data: data,
          borderColor: 'rgba(255, 255, 255, 0.9)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: 'white',
          pointBorderColor: 'white',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}%`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)',
              callback: (value) => `${value}%`
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.8)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }

  createChartGauge(): void {
    const ctx = document.getElementById('chartGauge') as HTMLCanvasElement;
    if (!ctx) return;

    const porcentaje = this.presupuestoMetricas.porcentajeDisponibilidad;
    const restante = 100 - porcentaje;

    this.chartGauge = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [porcentaje, restante],
          backgroundColor: [
            '#ec4899', // Magenta
            '#e5e7eb'  // Gris claro
          ],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: false
          }
        }
      }
    });
  }

  // Métodos auxiliares para calcular porcentajes
  get porcentajeCorriente(): number {
    return (this.presupuestoMetricas.presupuestoCorriente / this.presupuestoMetricas.presupuestoTotal) * 100;
  }

  get porcentajeOtros(): number {
    return (this.presupuestoMetricas.presupuestoOtros / this.presupuestoMetricas.presupuestoTotal) * 100;
  }
}
