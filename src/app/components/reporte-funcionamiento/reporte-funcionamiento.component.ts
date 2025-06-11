import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

// Importar los datos y funciones
import { funcionamientoBaseData } from '../../data/funcionamiento-base.data';
import { 
  getFuentes,
  getConceptosByFuente,
  getBeneficiariosByFuenteAndConcepto,
  getRegistroByFuenteConceptoBeneficiario,
  formatearValorMonetario,
  getResumenEjecucion
} from '../../utils/sgr-functions';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-reporte-funcionamiento',
  standalone: true,
  imports: [
    CommonModule,
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
    Select
  ],
  templateUrl: './reporte-funcionamiento.component.html',
  styleUrl: './reporte-funcionamiento.component.scss'
})
export class ReporteFuncionamientoComponent implements OnInit {
  platformId = inject(PLATFORM_ID);

  // Datos originales cargados desde el JSON
  private funcionamientoData: any[] = [];

  // Opciones para los selects
  fuentes: SelectOption[] = [];
  conceptos: SelectOption[] = [];
  beneficiarios: SelectOption[] = [];

  // Valores seleccionados - iniciar sin selección
  selectedVigencia: any = { id: 1, label: 'Vigencia Bienio 2025 - 2026' };
  selectedFuente: any;
  selectedConcepto: any;
  selectedBeneficiario: any;

  // Datos para las tarjetas (se actualizarán según la selección)
  presupuestoData = {
    presupuestoAsignado: 0,
    disponibilidadInicial: 0,
    recursosBloquedos: 0,
    presupuestoVigenteDisponible: 0
  };

  ejecucionData = {
    cdp: 0,
    compromiso: 0,
    pagos: 0,
    recursoComprometer: 0
  };

  situacionCajaData = {
    presupuestoCorriente: 0,
    recaudoCorriente: 0,
    cajaTotal: 0,
    cajaDisponible: 0
  };

  // Datos para los gráficos
  barChartData: any;
  barChartOptions: any;
  horizontalBarData: any;
  horizontalBarOptions: any;
  donutData: any;
  donutOptions: any;

  // Registro actualmente seleccionado
  registroActual: any = null;

   vigencia = [
      {
          "id": 1,
          "label": "Vigencia Bienio 2025 - 2026"
      },
      {
          "id": 2,
          "label": "Vigencia Bienio 2023 - 2024"
      },
      {
          "id": 3,
          "label": "Vigencia Bienio 2021 - 2022"
      },
      {
          "id": 4,
          "label": "Vigencia Bienio 2019 - 2020"
      },
      {
          "id": 5,
          "label": "Vigencia Bienio 2017 - 2018"
      },
      {
          "id": 6,
          "label": "Vigencia Bienio 2015 - 2016"
      },
      {
          "id": 7,
          "label": "Vigencia Bienio 2013 - 2014"
      },
      {
          "id": 8,
          "label": "Vigencia 2012"
      }
  ];

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarFuentes();
    
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCharts();
    }
  }

  /**
   * Cargar los datos desde el archivo JSON
   */
  private cargarDatos(): void {
    try {
      // Cargar datos desde el archivo de datos TypeScript
      this.funcionamientoData = funcionamientoBaseData || [];
      console.log('Datos de funcionamiento cargados:', this.funcionamientoData.length, 'registros');
    } catch (error) {
      console.error('Error cargando datos de funcionamiento:', error);
      this.funcionamientoData = [];
    }
  }

  /**
   * Inicializar las opciones de fuentes sin seleccionar ninguna
   */
  private inicializarFuentes(): void {
    try {
      const fuentesUnicas = getFuentes(this.funcionamientoData);
      this.fuentes = fuentesUnicas.map((fuente: any) => ({
        value: fuente,
        label: fuente
      }));
      
      console.log('Fuentes disponibles:', this.fuentes);
      
      // Inicializar los otros selects como vacíos y deshabilitados
      this.conceptos = [];
      this.beneficiarios = [];
      this.selectedFuente = '';
      this.selectedConcepto = '';
      this.selectedBeneficiario = '';
      this.registroActual = null;
      
      // Limpiar datos iniciales
      this.limpiarDatos();
      
    } catch (error) {
      console.error('Error inicializando fuentes:', error);
      this.fuentes = [];
      this.limpiarTodosDatos();
    }
  }

  /**
   * Evento cuando cambia la fuente seleccionada
   */
  onFuenteChange(): void {
    console.log('Fuente seleccionada:', this.selectedFuente.label);
    
    try {
      // Limpiar selecciones dependientes
      this.selectedConcepto = '';
      this.selectedBeneficiario = '';
      this.beneficiarios = [];
      this.registroActual = null;
      this.limpiarDatos();

      if (!this.selectedFuente) {
        this.conceptos = [];
        return;
      }

      // Actualizar conceptos según la fuente seleccionada
      const conceptosUnicos = getConceptosByFuente(this.funcionamientoData, this.selectedFuente.label);
      this.conceptos = conceptosUnicos.map((concepto: any) => ({
        value: concepto,
        label: concepto
      }));
      
      console.log('Conceptos disponibles para', this.selectedFuente.label + ':', this.conceptos);
      
      // No seleccionar automáticamente ningún concepto
      // El usuario debe seleccionar manualmente
      
    } catch (error) {
      console.error('Error al cambiar fuente:', error);
      this.conceptos = [];
      this.limpiarDatos();
    }
  }

  /**
   * Evento cuando cambia el concepto seleccionado
   */
  onConceptoChange(): void {
    console.log('Concepto seleccionado:', this.selectedConcepto.label);
    
    try {
      // Limpiar selección de beneficiario
      this.selectedBeneficiario = '';
      this.registroActual = null;
      this.limpiarDatos();

      if (!this.selectedFuente || !this.selectedConcepto.label) {
        this.beneficiarios = [];
        return;
      }

      // Actualizar beneficiarios según fuente y concepto seleccionados
      const beneficiariosUnicos = getBeneficiariosByFuenteAndConcepto(
        this.funcionamientoData, 
        this.selectedFuente.label, 
        this.selectedConcepto.label
      );
      
      this.beneficiarios = beneficiariosUnicos.map((beneficiario: any) => ({
        value: beneficiario,
        label: beneficiario
      }));
      
      console.log('Beneficiarios disponibles para', this.selectedFuente.label, '-', this.selectedConcepto.label + ':', this.beneficiarios);
      
      // No seleccionar automáticamente ningún beneficiario
      // El usuario debe seleccionar manualmente
      
    } catch (error) {
      console.error('Error al cambiar concepto:', error);
      this.beneficiarios = [];
      this.limpiarDatos();
    }
  }

  /**
   * Evento cuando cambia el beneficiario seleccionado
   */
  onBeneficiarioChange(): void {
    console.log('Beneficiario seleccionado:', this.selectedBeneficiario.label);
    
    try {
      if (!this.selectedFuente || !this.selectedConcepto || !this.selectedBeneficiario.label) {
        this.registroActual = null;
        this.limpiarDatos();
        return;
      }

      // Obtener el registro completo
      this.registroActual = getRegistroByFuenteConceptoBeneficiario(
        this.funcionamientoData,
        this.selectedFuente.label,
        this.selectedConcepto.label,
        this.selectedBeneficiario.label
      );

      console.log('Registro encontrado:', this.registroActual);

      if (this.registroActual) {
        this.actualizarDatosDelRegistro();
      } else {
        console.warn('No se encontró registro para la combinación seleccionada');
        this.limpiarDatos();
      }
    } catch (error) {
      console.error('Error al cambiar beneficiario:', error);
      this.limpiarDatos();
    }
  }

  clearFilters(): void {
    console.log('Limpiando filtros');
    // Limpiar todas las selecciones
    this.selectedFuente = '';
    this.selectedConcepto = '';
    this.selectedBeneficiario = '';
    this.registroActual = null;
  }

  /**
   * Actualizar los datos de las tarjetas con el registro seleccionado
   */
  private actualizarDatosDelRegistro(): void {
    if (!this.registroActual) return;

    try {
      // Convertir strings a números eliminando puntos y comas
      const convertirANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
          return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
        }
        return 0;
      };

      // Actualizar datos de presupuesto
      this.presupuestoData = {
        presupuestoAsignado: convertirANumero(this.registroActual['total-asignado-bienio']) / 1000000, // En millones
        disponibilidadInicial: convertirANumero(this.registroActual['disponibilidad-inicial']) / 1000000,
        recursosBloquedos: convertirANumero(this.registroActual['recursos-bloqueados']) / 1000000,
        presupuestoVigenteDisponible: convertirANumero(this.registroActual['apropiacion-vigente-disponible']) / 1000000000 // En billones
      };

      // Actualizar datos de ejecución
      this.ejecucionData = {
        cdp: convertirANumero(this.registroActual['cdp']) / 1000000,
        compromiso: convertirANumero(this.registroActual['compromisos']) / 1000000,
        pagos: convertirANumero(this.registroActual['pagos']) / 1000000,
        recursoComprometer: convertirANumero(this.registroActual['saldo-por-comprometer']) / 1000000000 // En billones
      };

      // Actualizar datos de situación de caja
      this.situacionCajaData = {
        presupuestoCorriente: convertirANumero(this.registroActual['apropiacion-vigente']) / 1000000,
        recaudoCorriente: convertirANumero(this.registroActual['iac-corriente']) / 1000000,
        cajaTotal: convertirANumero(this.registroActual['caja-total']) / 1000000,
        cajaDisponible: convertirANumero(this.registroActual['caja-disponible']) / 1000000000 // En billones
      };

      console.log('Datos actualizados:', {
        presupuesto: this.presupuestoData,
        ejecucion: this.ejecucionData,
        caja: this.situacionCajaData
      });

      // Actualizar gráficos con datos reales
      if (isPlatformBrowser(this.platformId)) {
        this.actualizarGraficos();
      }

    } catch (error) {
      console.error('Error actualizando datos del registro:', error);
      this.limpiarDatos();
    }
  }

  /**
   * Limpiar los datos cuando no hay selección válida
   */
  private limpiarDatos(): void {
    this.presupuestoData = {
      presupuestoAsignado: 0,
      disponibilidadInicial: 0,
      recursosBloquedos: 0,
      presupuestoVigenteDisponible: 0
    };

    this.ejecucionData = {
      cdp: 0,
      compromiso: 0,
      pagos: 0,
      recursoComprometer: 0
    };

    this.situacionCajaData = {
      presupuestoCorriente: 0,
      recaudoCorriente: 0,
      cajaTotal: 0,
      cajaDisponible: 0
    };
  }

  /**
   * Limpiar todos los datos y selecciones (para casos de error)
   */
  private limpiarTodosDatos(): void {
    this.fuentes = [];
    this.conceptos = [];
    this.beneficiarios = [];
    this.selectedFuente = '';
    this.selectedConcepto = '';
    this.selectedBeneficiario = '';
    this.registroActual = null;
    this.limpiarDatos();
  }

  /**
   * Actualizar gráficos con datos del registro actual
   */
  private actualizarGraficos(): void {
    if (!this.registroActual) {
      this.initializeCharts(); // Usar datos por defecto
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    // Calcular porcentajes de ejecución
    const totalApropiacion = this.situacionCajaData.presupuestoCorriente || 1;
    const porcentajeCDP = (this.ejecucionData.cdp / totalApropiacion) * 100;
    const porcentajeCompromisos = (this.ejecucionData.compromiso / totalApropiacion) * 100;
    const porcentajePagos = (this.ejecucionData.pagos / totalApropiacion) * 100;

    // Actualizar barra horizontal con datos reales
    this.horizontalBarData = {
      labels: ['Ejecución Presupuestal'],
      datasets: [
        {
          label: 'CDP',
          backgroundColor: '#dc3545',
          data: [porcentajeCDP]
        },
        {
          label: 'Compromisos',
          backgroundColor: '#fd7e14',
          data: [porcentajeCompromisos]
        },
        {
          label: 'Pagos',
          backgroundColor: '#28a745',
          data: [porcentajePagos]
        }
      ]
    };

    // Calcular avance de recaudo
    const recaudoTotal = this.situacionCajaData.presupuestoCorriente || 1;
    const recaudoEjecutado = this.situacionCajaData.recaudoCorriente || 0;
    const porcentajeRecaudo = (recaudoEjecutado / recaudoTotal) * 100;

    // Actualizar gráfico de dona con datos reales
    this.donutData = {
      labels: ['Recaudo', 'Pendiente'],
      datasets: [
        {
          data: [porcentajeRecaudo, 100 - porcentajeRecaudo],
          backgroundColor: ['#3366CC', '#e9ecef'],
          hoverBackgroundColor: ['#2851a3', '#dee2e6']
        }
      ]
    };
  }

  initializeCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    // Gráfico de barras verticales con línea (datos de ejemplo)
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

    // Barra horizontal - se actualizará con datos reales
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

    // Gráfico de dona - se actualizará con datos reales
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
    return `${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)} mil M`;
  }

  formatBillions(value: number): string {
    return `${new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)} mil M`;
  }

  /**
   * Método para obtener el resumen de ejecución utilizando las funciones SGR
   */
  getResumenEjecucionActual(): any {
    if (!this.registroActual) return null;
    return getResumenEjecucion(this.registroActual);
  }

  /**
   * Método para formatear valores monetarios
   */
  formatearMoneda(valor: any): string {
    return formatearValorMonetario(valor);
  }

  // Métodos de eventos de botones (sin cambios)
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