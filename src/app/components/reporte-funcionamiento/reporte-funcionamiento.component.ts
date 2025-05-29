import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-reporte-funcionamiento',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatGridListModule,
    MatCardModule,
    ButtonModule,
    ChartModule
  ],
  templateUrl: './reporte-funcionamiento.component.html',
  styleUrl: './reporte-funcionamiento.component.scss'
})
export class ReporteFuncionamientoComponent implements OnInit {
  platformId = inject(PLATFORM_ID);

  // Datos para los selects
  bienios = [
    { value: '2023-2024', label: 'Bienio 2023-2024' },
    { value: '2025-2026', label: 'Bienio 2025-2026' },
    { value: '2027-2028', label: 'Bienio 2027-2028' }
  ];

  fuentes = [
    { value: 'sgr', label: 'Sistema General de Regalías' },
    { value: 'fonpet', label: 'FONPET' },
    { value: 'otros', label: 'Otros recursos' }
  ];

  conceptos = [
    { value: 'funcionamiento', label: 'Funcionamiento' },
    { value: 'inversion', label: 'Inversión' },
    { value: 'gastos-operacion', label: 'Gastos de operación' }
  ];

  beneficiarios = [
    { value: 'todos', label: 'Todos los beneficiarios' },
    { value: 'departamentos', label: 'Departamentos' },
    { value: 'municipios', label: 'Municipios' }
  ];

  // Valores seleccionados
  selectedBienio = '2025-2026';
  selectedFuente = 'sgr';
  selectedConcepto = 'funcionamiento';
  selectedBeneficiario = 'todos';

  // Datos para las tarjetas
  presupuestoData = {
    presupuestoAsignado: 1250.5,
    disponibilidadInicial: 980.3,
    recursosBloquedos: 85.2,
    presupuestoVigenteDisponible: 1.2 // en billones
  };

  ejecucionData = {
    cdp: 756.8,
    compromiso: 645.2,
    pagos: 523.4,
    recursoComprometer: 0.8 // en billones
  };

  situacionCajaData = {
    presupuestoCorriente: 892.1,
    recaudoCorriente: 734.6,
    cajaTotal: 445.3,
    cajaDisponible: 0.6 // en billones
  };

  // Datos para los gráficos
  barChartData: any;
  barChartOptions: any;
  horizontalBarData: any;
  horizontalBarOptions: any;
  donutData: any;
  donutOptions: any;

  constructor() {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCharts();
    }
  }

  initializeCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    // Gráfico de barras verticales con línea
    this.barChartData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          type: 'line',
          label: 'Variación',
          borderColor: '#3366CC',
          backgroundColor: '#3366CC',
          fill: false,
          tension: 0.4,
          data: [800, 950, 750, 1150, 980, 840]
        },
        {
          type: 'bar',
          label: 'Presupuesto',
          backgroundColor: '#6c757d',
          data: [850, 920, 780, 1100, 950, 860]
        }        
      ]
    };

    this.barChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 1.25,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 9 }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor,
            font: { size: 8 }
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColor,
            font: { size: 8 }
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    // Barra horizontal con tres valores
    this.horizontalBarData = {
      labels: ['Ejecución'],
      datasets: [
        {
          label: 'CDP',
          backgroundColor: '#dc3545',
          data: [35]
        },
        {
          label: 'Compromisos',
          backgroundColor: '#fd7e14',
          data: [25]
        },
        {
          label: 'Pagos',
          backgroundColor: '#28a745',
          data: [40]
        }
      ]
    };

    this.horizontalBarOptions = {
      indexAxis: 'y',
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      barPercentage: 0.4,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 9 }
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColor,
            font: { size: 8 }
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColor,
            font: { size: 8 }
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    // Gráfico de dona 180 grados
    this.donutData = {
      labels: ['Recaudo', 'Pendiente'],
      datasets: [
        {
          data: [60, 40],
          backgroundColor: ['#3366CC', '#e9ecef'],
          hoverBackgroundColor: ['#2851a3', '#dee2e6']
        }
      ]
    };

    this.donutOptions = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: textColor,
            font: { size: 9 }
          }
        },
        title: {
          display: true,
          text: 'Recaudo vs Presupuesto',
          color: textColor,
          font: { size: 10, weight: 'bold' }
        }
      }
    };
  }

  formatMillions(value: number): string {
    return `$ ${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)} mil M`;
  }

  formatBillions(value: number): string {
    return `$ ${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)} mil M`;
  }

  onAdministracionClick(): void {
    console.log('Administración - SSEC clicked');
  }

  onComisionRectoraClick(): void {
    console.log('Comisión Rectora clicked');
  }

  onDetalleGestionClick(): void {
    console.log('Detalle Gestión Financiera clicked');
  }

  onDetalleRecaudoClick(): void {
    console.log('Detalle de Recaudo clicked');
  }

  onInformeTrimestraClick(): void {
    console.log('Informe Trimestral clicked');
  }
}