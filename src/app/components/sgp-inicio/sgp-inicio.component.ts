import { Component, AfterViewInit, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { PercentFormatPipe } from '../../utils/percentFormatPipe';
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
import { Router } from '@angular/router';

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
      PercentFormatPipe,
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

  constructor(private sicodisApiService: SicodisApiService, private router: Router) {
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
      descripcion: 'Consulta el histórico de distribuciones por vigencia y entidad territorial',
      boton: 'Consultar',
      link: 'sgp-historico',
      icon: 'timeline'
    },
    {
      titulo: 'Documentos y Anexos',
      descripcion: 'Accede a documentos oficiales y anexos',
      boton: 'Consultar',
      link: 'sgp-documentos-anexos',
      icon: 'description'
    },
    {
      titulo: 'Detalle Presupuestal',
      descripcion: 'Consulta el detalle de la información presupuestal por municipio',
      boton: 'Consultar',
      link: 'sgp-detalle-presupuestal',
      icon: 'account_balance_wallet'
    },
    {
      titulo: 'Ficha Comparativa',
      descripcion: 'Compara la información financiera entre diferentes entidades territoriales',
      boton: 'Consultar',
      link: 'sgp-comparativa',
      icon: 'compare_arrows'
    },
    {
      titulo: 'Resguardos Indígenas',
      descripcion: 'Información específica de las transferencias a resguardos indígenas',
      boton: 'Consultar',
      link: 'sgp-resguardos',
      icon: 'groups'
    },
    {
      titulo: 'Distribuciones SGP',
      descripcion: 'Consulta las distribuciones realizadas',
      boton: 'Consultar',
      link: 'reports-sgp-dist',
      icon: 'account_tree'
    },
    {
      titulo: 'Presupuesto SGP',
      descripcion: 'Información detallada del presupuesto',
      boton: 'Consultar',
      link: 'reports-sgp-budget',
      icon: 'pie_chart'
    },
    {
      titulo: 'Gráficos SGP',
      descripcion: 'Visualizaciones gráficas de los datos',
      boton: 'Consultar',
      link: 'graphics-sgp',
      icon: 'bar_chart'
    }
  ];

  ngOnInit(): void {
    this.loadSgpData();

  }

  ngAfterViewInit(): void {
    // Reinitialize donut chart after view is initialized
    setTimeout(() => {
      this.initializeDonutData();
    }, 100);
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


  initializeDonutData(): void {
    // Usar datos de resumenParticipaciones en lugar de datos hardcodeados
    const rawData = this.resumenParticipaciones.filter((item: any) => item.v > 0);

    const labels = rawData.map((item: any) => item.label);
    const data = rawData.map((item: any) => item.v);
    
    // Colores originales especificados
    const colors = ['#156082', '#e97132', '#0c9bd3', '#196b24', '#a02b93'];

    this.donutData = {
      labels: labels,
      datasets: [
        {
          label: 'Distribución SGP',
          data: data,
          backgroundColor: colors,
          borderColor: '#CCCCCC',
          borderWidth: 2,
          hoverBorderWidth: 4,
          hoverOffset: 15,
          hoverBackgroundColor: colors.map(color => {
            // Hacer los colores más brillantes en hover
            const hex = color.replace('#', '');
            const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + 30);
            const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + 30);
            const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + 30);
            return `rgb(${r}, ${g}, ${b})`;
          })
        }
      ]
    };

    this.donutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 0.725,
      cutout: '60%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            font: {
              size: 12
            },
            color: '#333333'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#156082',
          borderWidth: 2,
          cornerRadius: 8,
          displayColors: true,
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
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
          formatter: (value: any, context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100 * 100) / 100;
            return `${percentage}%`;
          }
        }
      },
      elements: {
         arc: {
           borderWidth: 3,
           borderColor: '#BBBBBB',
           hoverBorderWidth: 3,
           hoverBorderColor: '#BBBBBB'
         }
       },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 2000,
        easing: 'easeOutQuart'
      },
      interaction: {
        mode: 'nearest',
        intersect: false,
        axis: 'r'
      }
    };
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia changed:', event.value);
    this.selectedVigencia = event.value;
    // Reload data for the selected year
    this.loadSgpData();
  }

  navigateToResource(link: string): void {
    console.log('Navigating to:', link);
    this.router.navigate([link]).then(() => {
      // Scroll to top after successful navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    });
  }
}
