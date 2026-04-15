import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { PercentFormatPipe } from '../../utils/percentFormatPipe';
import { Router } from '@angular/router';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-sgr-inicio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    ButtonModule,
    ChartModule,
    FloatLabel,
    Select,
    NumberFormatPipe,
    PercentFormatPipe
  ],
  templateUrl: './sgr-inicio.component.html',
  styleUrl: './sgr-inicio.component.scss'
})
export class SgrInicioComponent implements OnInit {
  platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  // Vigencias disponibles
  vigencias: SelectOption[] = [
    { value: '2025-2026', label: '2025 - 2026' },
    { value: '2023-2024', label: '2023 - 2024' },
    { value: '2021-2022', label: '2021 - 2022' }
  ];

  selectedVigencia: SelectOption = this.vigencias[0];

  // Datos de ejemplo para las tarjetas
  presupuestoTotal: number = 64087661072292;
  recaudoTotal: number = 49658264357763;
  avanceTotal: number = 0.7748; // 77.48%

  // Datos para el gráfico de dona
  donutDistribucionData: any;
  donutDistribucionOptions: any;

  // Recursos y herramientas
  recursos = [
    {
      titulo: 'Programación',
      descripcion: 'Plan de Recursos y Plan Bienal de Caja',
      link: 'sgr-plan-bienal-de-caja',
      icon: 'assets/img/sgr/icono-sgr-programacion.png'
    },
    {
      titulo: 'Recaudo Mensual',
      descripcion: 'Recaudo mes a mes por asignación y beneficiarios',
      link: 'sgr-recaudo-mensual',
      icon: 'assets/img/sgr/icono-sgr-recaudo-mensual.png'
    },
    {
      titulo: 'Recaudo Directas',
      descripcion: 'Recaudo mes a mes por sector para las Asignaciones Directas',
      link: 'sgr-recaudo-directas',
      icon: 'assets/img/sgr/icono-sgr-recaudo-directas.png'
    },
    {
      titulo: 'Recaudo-Presupuesto',
      descripcion: 'Avance del recaudo frente al presupuesto por asignación y beneficiarios',
      link: 'sgr-presupuesto-y-recaudo',
      icon: 'assets/img/sgr/icono-sgr-comparativo.png'
    },
    {
      titulo: 'Comparativo',
      descripcion: 'Avance del recaudo y el presupuesto entre entidades.',
      link: 'sgr-comparativo',
      icon: 'assets/img/sgr/icono-sgr-comparativo.png'
    },
    {
      titulo: 'Administración y SSEC',
      descripcion: 'Funcionamiento, fiscalización y Sistema de Seguimiento Evaluación y Control',
      link: 'reporte-funcionamiento',
      icon: 'assets/img/sgr/icono-sgr-administracion-y-ssec.png'
    },
    {
      titulo: 'Geovisor',
      descripcion: 'Avance del recaudo y el presupuesto entre entidades.',
      link: 'mapa-recursos',
      icon: 'assets/img/sgr/icono-sgr-geovisorpng.png'
    }
  ];

  ngOnInit(): void {
    this.loadData();
    this.initializeChart();
  }

  loadData(): void {
    // Aquí se cargarían los datos desde la API
    // Por ahora usamos datos estáticos
    this.updateDonutChart();
  }

  onVigenciaChange(event: any): void {
    // Simular cambio de datos al cambiar vigencia
    this.loadData();
  }

  private updateDonutChart(): void {
    this.donutDistribucionData = {
      labels: [
        'Inversión corriente',
        'Administración y SSEC del SGR corriente',
        'Inversión otros',
        'Administración y SSEC del SGR otros',
        'Ahorro corriente',
        'No Aforado',
        'Ahorro otros'
      ],
      datasets: [
        {
          data: [71.1, 20.4, 5, 1.2, 1.0, 0.7, 0.2],
          backgroundColor: [
            '#9B3D9F', // Púrpura - Inversión corriente (71.1%)
            '#1E5A8E', // Azul oscuro - Administración y SSEC corriente (20.4%)
            '#8B4789', // Púrpura medio - Inversión otros (5%)
            '#4A8FC7', // Azul medio - Ahorro corriente (1.2%)
            '#D4A5D6', // Rosa claro - No Aforado (1.0%)
            '#B8B8B8', // Gris - Ahorro otros (0.7%)
            '#E8C1E9'  // Rosa muy claro - Administración y SSEC otros (0.2%)
          ],
          hoverBackgroundColor: [
            '#8B2D8F',
            '#144A7E',
            '#7B3779',
            '#3A7FB7',
            '#C495C6',
            '#A8A8A8',
            '#D8B1D9'
          ],
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };
  }

  private initializeChart(): void {
    const textColor = '#303135';

    this.donutDistribucionOptions = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      devicePixelRatio: window.devicePixelRatio || 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { size: 11 },
            padding: 8,
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: false
          }
        },
        title: {
          display: false
        },
        tooltip: {
          mode: 'index',
          callbacks: {
            label: function(tooltipItem: any) {
              return `${tooltipItem.label}: ${tooltipItem.parsed}%`;
            }
          }
        },
        datalabels: {
          display: true,
          color: '#fff',
          font: {
            weight: 'bold',
            size: 11
          },
          formatter: (value: number) => {
            return value >= 1 ? `${value}%` : '';
          }
        }
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      }
    };
  }

  formatMillions(value: number): string {
    return value.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }

  onResourceClick(recurso: any): void {
    if (recurso.link) {
      this.router.navigate([recurso.link]).then(() => {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      });
    }
  }
}
