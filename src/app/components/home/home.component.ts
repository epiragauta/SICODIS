import { Component, OnInit, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReportsTargetComponent } from '../reports-target/reports-target.component';
import { CommonModule  } from '@angular/common';
import { Router } from '@angular/router';
import { Card, CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
// Material Modules

import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService } from '../../services/sicodis-api.service';
import Chart from 'chart.js/auto';
import { DialogModule } from 'primeng/dialog';
import { ConfigService, BannerConfig } from '../../services/config.service';
import { BannerAlertasCajaComponent } from './banner-alertas-caja.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    //ReportsTargetComponent,
    CardModule,
    ButtonModule,
    DividerModule,
    CarouselModule,
    TagModule,
    NumberFormatPipe,
    TableModule,
    ChartModule,
    RouterModule,
    DialogModule,
    BannerAlertasCajaComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  cards: MyCard[] = [
    {
      imageUrl: '/assets/img/target2.jpg',
      date: 'Junio 3 de 2024',
      description: '',
      title: 'Informes y documentos del Sistema General de Regalías',
      buttonLabel: 'Ver Reportes',
      link: 'https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx'
    },
    {
      imageUrl: '/assets/img/carrousel1.jpg',
      date: 'Junio 3 de 2024',
      description: '',
      title: 'Documentos del Sistema General de Participaciones',
      buttonLabel: 'Ver Reportes',
      link: 'https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-participaciones.aspx'
    },
    {
      imageUrl: '/assets/img/carrousel2.jpg',
      date: 'Junio 3 de 2024',
      description: '',
      title: 'Subdirección de Distribución de Recursos Territoriales​​',
      buttonLabel: 'Ver Reportes',
      link: 'https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/distribucion-de-recursos-territoriales.aspx'
    },
    {
      imageUrl: '/assets/img/carrousel3.jpg',
      date: 'Junio 3 de 2024',
      description: '',
      title: 'Dirección de Programación de Inversiones Públicas​',
      buttonLabel: 'Ver Reportes',
      link: 'https://dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/default.aspx'
    }

  ];

  titleSGR = 'Sistema General de Regalías - SGR';
  titleSGP = 'Sistema General de Participaciones - SGP';
  titlePGN = 'Presupuesto General de la Nación - PGN';
  titleGeovisor = 'Geovisor';

  descriptionSGP =
    'Son los recursos que la Nación transfiere a las entidades territoriales y resguardos indígenas, para la financiación de los servicios a su cargo, conforme con las competencias establecidas en la ley.';

  descriptionSGR =
    'Es el conjunto de ingresos, asignaciones, órganos, procedimientos y regulaciones, para el uso eficiente y la destinación de los ingresos provenientes de la explotación de los recursos naturales no renovables.';

  descriptionPGN =
    'En esta sección podrá consultar información relacionada con la regionalización del Presupuesto General de la Nación (PGN).';

  descriptionGeovisor =
    'Comparativo y valores vigentes de los recursos distribuidos del SGP, SGR y PGN por regiones y departamentos.';

  responsiveOptions: any[] | undefined;


  // Banner inteligente con ConfigService
  showBanner: boolean = true;  // Mostrar por defecto
  bannerConfig: BannerConfig | null = null;  

  // Datos para el gráfico donut SGP
  donutSgpData: any;
  donutSgpOptions: any;
  sgpPorcentajeEjecucion: string = '0,0';

  // Datos para los gráficos donut SGR
  donutSgrCorrientesData: any;
  donutSgrCorrientesOptions: any;
  sgrPorcentajeCorrientes: string = '0,0';
  
  donutSgrOtrosData: any;
  donutSgrOtrosOptions: any;
  sgrPorcentajeOtros: string = '0,0';

  sgrItems = [
    { concept: 'Inversión', amount: 23620950245846, progress: 45.94, isFirst: false, isTotal: false },
    { concept: 'Ahorro', amount: 1149127309256, progress: 46.71, isFirst: false, isTotal: false },
    { concept: 'Administración y SSEC', amount: 766084872838, progress: 46.71,isFirst: false, isTotal: false },    
    { concept: 'Total Corrientes', amount: 25536162427940, progress: 46.49, isFirst: false, isTotal: true }
  ];

sgpItems = [
    { concept: 'Educación', amount:  29377413250777, progress: 59.21, isFirst: false, isTotal: false },
    { concept: 'Salud', amount: 20622281544600, progress: 100, isFirst: false, isTotal: false },
    { concept: 'Agua Potable', amount: 4556339605748, progress: 100,isFirst: false, isTotal: false },    
    { concept: 'Propósito General', amount: 9787692486422, progress: 100, isFirst: false, isTotal: false },
    { concept: 'Asignaciones Especiales', amount: 3769581570516, progress: 27.57, isFirst: false, isTotal: false },
    { concept: 'Total SGP', amount: 88352506170320, progress: 74, isFirst: false, isTotal: true }
  ];

  isBrowser: boolean = false;
  showGauges: boolean = false;

  gaugeSize: number = 180;
  gaugeTick: number = 10;
  gaugeValue: number = 37.32;

  showVideo = false;
  showPlayer = false;

  constructor(private route: Router,
    private sicodisApiService: SicodisApiService,
    private configService: ConfigService
  ) {


  }

  ngOnInit() {

    // Verificar si se debe mostrar el banner usando el nuevo ConfigService
    this.initializeBanner();

    this.initializeDonutChart();
    this.initializeSgrDonutCharts();
    this.responsiveOptions = [
        {
            breakpoint: '1400px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '575px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    this.loadSgpData();
    this.initializeSgrData();

    window.addEventListener('unload', () => {});
    setTimeout(() => {
      this.showVideo = false;
    }, 300);


  }

  createVideo(): void {
    // crea un VIDEO NUEVO
    this.showPlayer = false;
    setTimeout(() => {
      this.showPlayer = false;
    });
  }

  destroyVideo(): void {
    // elimina el video del DOM
    this.showPlayer = false;
  }

  // ============================================================================
  // BANNER INTELIGENTE
  // ============================================================================

  private initializeBanner(): void {
    // Obtener configuración del banner
    this.bannerConfig = this.configService.getBannerConfigSync();

    // Verificar si debe mostrarse según las reglas de negocio
    this.showBanner = this.configService.shouldShowBanner();

    if (this.showBanner && this.bannerConfig) {
    }
  }

  closeBanner(): void {
    this.showBanner = false;

    // Registrar que el banner fue mostrado
    this.configService.recordBannerShown();

  }

  onBannerButtonClick(): void {
    if (this.bannerConfig?.boton_url) {
      window.open(this.bannerConfig.boton_url, '_blank');
    }
    this.closeBanner();
  }


  private initializeDonutChart() {
    // Register custom plugin for center text in donut charts
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart: any) => {
        if (chart.config.options.plugins?.centerText?.display) {
          const ctx = chart.ctx;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 1.42;
          
          ctx.save();
          ctx.font = 'bold 22px Arial';
          ctx.fillStyle = '#aaa4a2ff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          const text = chart.config.options.plugins.centerText.text();
          ctx.fillText(text, centerX, centerY);
          ctx.restore();
        }
      }
    };

    // Register the plugin globally
    if (typeof Chart !== 'undefined') {
      Chart.register(centerTextPlugin);
    }

    this.donutSgpOptions = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: "#333",
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: 'Avance de Ejecución',
          color: "#333",
          font: { size: 18, weight: 'bold' }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')}`;
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
        },
        centerText: {
          display: true,
          text: () => {
            const value = this.sgpPorcentajeEjecucion;
            if (!value || value === 'Infinity' || value === 'NaN' || isNaN(parseFloat(value.replace(',', '.')))) {
              return '0,00%';
            }
            return value + '%';
          }
        }
      }
    };
  }

  private initializeSgrDonutCharts() {
    //const documentStyle = getComputedStyle(document.documentElement);
    //const textColor = documentStyle.getPropertyValue('--text-color') || '#333';
    
    // Opciones para gráfico corrientes (naranja)
    this.donutSgrCorrientesOptions = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: "#333",
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: 'Avance de distribución corrientes',
          color: "#333",
          font: { size: 18, weight: 'bold' }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')}`;
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
        },
        centerText: {
          display: true,
          text: () => {
            const value = this.sgrPorcentajeCorrientes;
            if (!value || value === 'Infinity' || value === 'NaN' || isNaN(parseFloat(value.replace(',', '.')))) {
              return '0,00%';
            }
            return value + '%';
          }
        }
      }
    };

    // Opciones para gráfico otros (verde agua)
    this.donutSgrOtrosOptions = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: "#333",
            font: { size: 14 }
          }
        },
        title: {
          display: true,
          text: 'Avance de distribución no corrientes',
          color: "#333",
          font: { size: 18, weight: 'bold' }
        },
        datalabels: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')}`;
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
        },
        centerText: {
          display: true,
          text: () => {
            const value = this.sgrPorcentajeOtros;
            if (!value || value === 'Infinity' || value === 'NaN' || isNaN(parseFloat(value.replace(',', '.')))) {
              return '0,0%';
            }
            return value + '%';
          }
        }
      }
    };
  }


  private initializeSgrData() {
    // Datos de ejemplo para corrientes (naranja)
    const corrientesDistribuido = 11872466385749;
    const corrientesTotal = 25536162427940;
    const corrientesRestante = corrientesTotal - corrientesDistribuido;
    const corrientesPorcentaje = (corrientesDistribuido / corrientesTotal) * 100;
    
    this.sgrPorcentajeCorrientes = corrientesPorcentaje.toFixed(2).replace('.', ',');
    
    this.donutSgrCorrientesData = {
      labels: ['Distribución', 'Presupuesto'],
      datasets: [
        {
          data: [corrientesDistribuido, corrientesTotal],
          backgroundColor: ['#ee825a', '#eceae9'],
          hoverBackgroundColor: ['#e85c16', '#dee2e6'],
          borderColor: '#CCCCCC',
          borderWidth: 1,
        }
      ]
    };

    // Datos de ejemplo para otros (verde agua)
    const otrosDistribuido = 285000000;
    const otrosTotal = 500000000;
    const otrosRestante = otrosTotal - otrosDistribuido;
    const otrosPorcentaje = (otrosDistribuido / otrosTotal) * 100;
    
    this.sgrPorcentajeOtros = otrosPorcentaje.toFixed(1).replace('.', ',');
    
    this.donutSgrOtrosData = {
      labels: ['Distribución', 'Presupuesto'],
      datasets: [
        {
          data: [otrosDistribuido, otrosRestante],
          backgroundColor: ['#52af66', '#eceae9'],
          hoverBackgroundColor: ['#1f7a36', '#dee2e6'],
          borderColor: '#CCCCCC',
          borderWidth: 1,
        }
      ]
    };
  }

  loadSgpData() {
    this.sicodisApiService.getSgpResumenParticipaciones(2026, '0', '0').pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.processSgpData(response);
        } else {
          console.error('La respuesta no es un array:', response);
        }
      },
      error: (error) => {
        console.error('Error al obtener datos SGP:', error);
      }
    });
  }

  private processSgpData(data: any[]) {
    // Buscar el registro con id_concepto = 99 (total)
    const totalRecord = data.find(item => item.id_concepto == 99);
    const totalAmount = totalRecord ? totalRecord.total : 1;

    
    // Filtrar solo conceptos principales (4 dígitos) excluyendo el total
    const principalRecords = data.filter(item => 
      item.id_concepto != 99 && 
      item.id_concepto.toString().length === 4
    );
    
    // Calcular sumatoria de conceptos principales
    const sumaConcepts = principalRecords.reduce((sum, item) => sum + (item.total || 0), 0);
      
    // Calcular datos para el gráfico donut
    this.updateDonutChart(sumaConcepts, 88352506170320);
  }

  private updateDonutChart(sumaConceptos: number, totalAmount: number) {
    const restante = totalAmount - sumaConceptos;
    const porcentaje = totalAmount > 0 ? (sumaConceptos / totalAmount) * 100 : 0;
    
    this.sgpPorcentajeEjecucion = porcentaje.toFixed(1).replace('.', ',');
    
    this.donutSgpData = {
      labels: ['Distribución', 'Presupuesto'],
      datasets: [
        {
          data: [sumaConceptos, restante],
          backgroundColor: ['#259ae7ff', '#eceae9'],
          hoverBackgroundColor: ['#45ca33ff', '#05720eff'],
          borderColor: '#CCCCCC',
          borderWidth: 1,
        }
      ]
    };
  }

  redirectSGR() {
    this.route.navigate(['/sgr-recaudo-mensual']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  redirectSGP() {
    this.route.navigate(['/sgp-inicio']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  redirectSGRInversion() {
    this.route.navigate(['/sgr-presupuesto-y-recaudo']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  redirectSGRFuncionamiento() {
    this.route.navigate(['/reporte-funcionamiento']).then(() => {
      window.scrollTo(0, 0);
    });
  }
  redirectTo(page: string){
    this.route.navigate([`/${page}`]).then(() => {
      window.scrollTo(0, 0);
    });
  }

  redirectToFAQ(){
    this.route.navigate(['/faq']).then(() => {
      window.scrollTo(0, 0);
    });
  }

  openBoletinWindow() {
    const url = 'https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx';
    const newWindow = window.open(url, '_blank');

    if (newWindow) {
      // Intentar ejecutar la función una vez cargada la ventana
      // NOTA: Esto podría fallar debido a restricciones CORS si el sitio destino está en otro dominio
      newWindow.addEventListener('load', () => {
        try {
          // Ejecutar la función DNPopen en el contexto de la nueva ventana
          (newWindow as any).DNPopen('DNPDropdown6061', 'DNPDropdown-element606');
        } catch (error) {
          console.warn('No se pudo ejecutar DNPopen debido a restricciones de seguridad del navegador:', error);
        }
      });
    }
  }
}

export interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

export interface MyCard {
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel: string;
  date: string;
  link: string;
}
