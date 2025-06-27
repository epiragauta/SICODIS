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
import { MultiSelect, MultiSelectChangeEvent  } from 'primeng/multiselect';

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
    Select,
    MultiSelect
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
  selectedVigencia: any[] = [];
  selectedFuente: any[] = [];
  selectedConcepto: any[] = [];
  selectedBeneficiario: any[] = [];

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
  donutData2: any;
  donutOptions2: any;

  // Registro actualmente seleccionado
  registroActual: any = null;

  vigencia = [
    {
        "id": 1,
        "label": "2025 - 2026"
    },
    {
        "id": 2,
        "label": "2023 - 2024"
    },
    {
        "id": 3,
        "label": "2021 - 2022"
    },
    {
        "id": 4,
        "label": "2019 - 2020"
    },
    {
        "id": 5,
        "label": "2017 - 2018"
    },
    {
        "id": 6,
        "label": "2015 - 2016"
    },
    {
        "id": 7,
        "label": "2013 - 2014"
    },
    {
        "id": 8,
        "label": "Vigencia 2012"
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarComponenteConDatosId1();
    
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
   * Inicializar el componente con los datos del registro con id = 1
   */
  private inicializarComponenteConDatosId1(): void {
    try {
      // Buscar el registro con id = 1
      const registroId1 = this.funcionamientoData.find(item => item.id === 1);
      
      if (!registroId1) {
        console.warn('No se encontró registro con id = 1, inicializando con datos vacíos');
        this.inicializarFuentesVacio();
        return;
      }

      console.log('Registro con id = 1 encontrado:', registroId1);

      // Inicializar todas las listas basándose en el registro con id = 1
      this.inicializarListasConRegistroId1(registroId1);
      
    } catch (error) {
      console.error('Error inicializando componente con datos id = 1:', error);
      this.inicializarFuentesVacio();
    }
  }

  /**
   * Inicializar todas las listas de multiselect basándose en el registro con id = 1
   */
  private inicializarListasConRegistroId1(registroId1: any): void {
    try {
      // 1. Inicializar fuentes
      const fuentesUnicas = getFuentes(this.funcionamientoData);
      this.fuentes = fuentesUnicas.map((fuente: any) => ({
        value: fuente,
        label: fuente
      }));

      // 2. Inicializar conceptos basándose en la fuente del registro id = 1
      const conceptosParaFuente = getConceptosByFuente(this.funcionamientoData, registroId1.fuente);
      this.conceptos = conceptosParaFuente.map((concepto: any) => ({
        value: concepto,
        label: concepto
      }));

      // 3. Inicializar beneficiarios basándose en fuente y concepto del registro id = 1
      const beneficiariosParaFuenteYConcepto = getBeneficiariosByFuenteAndConcepto(
        this.funcionamientoData, 
        registroId1.fuente, 
        registroId1.concepto
      );
      this.beneficiarios = beneficiariosParaFuenteYConcepto.map((beneficiario: any) => ({
        value: beneficiario,
        label: beneficiario
      }));

      // 4. Pre-seleccionar los valores del registro id = 1
      this.selectedFuente = [{
        value: registroId1.fuente,
        label: registroId1.fuente
      }];

      this.selectedConcepto = [{
        value: registroId1.concepto,
        label: registroId1.concepto
      }];

      this.selectedBeneficiario = [{
        value: registroId1.beneficiario,
        label: registroId1.beneficiario
      }];

      // 5. Inicializar vigencia con el primer valor "2025 - 2026"
      this.selectedVigencia = [this.vigencia[0]]; // Seleccionar el primer elemento que es "2025 - 2026"

      // 6. Establecer el registro actual y actualizar los datos
      this.registroActual = registroId1;
      this.actualizarDatosDelRegistro();

      console.log('Componente inicializado con datos del registro id = 1:');
      console.log('- Vigencia seleccionada:', this.selectedVigencia);
      console.log('- Fuente seleccionada:', this.selectedFuente);
      console.log('- Concepto seleccionado:', this.selectedConcepto);
      console.log('- Beneficiario seleccionado:', this.selectedBeneficiario);
      console.log('- Total fuentes disponibles:', this.fuentes.length);
      console.log('- Total conceptos disponibles:', this.conceptos.length);
      console.log('- Total beneficiarios disponibles:', this.beneficiarios.length);

    } catch (error) {
      console.error('Error inicializando listas con registro id = 1:', error);
      this.inicializarFuentesVacio();
    }
  }

  /**
   * Inicializar las opciones de fuentes sin seleccionar ninguna (método de respaldo)
   */
  private inicializarFuentesVacio(): void {
    try {
      const fuentesUnicas = getFuentes(this.funcionamientoData);
      this.fuentes = fuentesUnicas.map((fuente: any) => ({
        value: fuente,
        label: fuente
      }));
      
      console.log('Fuentes disponibles:', this.fuentes);
      
      // Inicializar los otros selects como vacíos
      this.conceptos = [];
      this.beneficiarios = [];
      this.selectedFuente = [];
      this.selectedConcepto = [];
      this.selectedBeneficiario = [];
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
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: MultiSelectChangeEvent): void {
    console.log('Vigencias seleccionadas:', event.value);
    // Aquí puedes agregar lógica específica si necesitas filtrar datos por vigencia
    // Por ahora solo registramos el cambio
  }

  /**
   * Evento cuando cambia la fuente seleccionada
   */
  onFuenteChange(event: MultiSelectChangeEvent): void {
    console.log('Fuentes seleccionadas:', event.value);
    
    try {
      // Limpiar selecciones dependientes
      this.selectedConcepto = [];
      this.selectedBeneficiario = [];
      this.beneficiarios = [];
      this.registroActual = null;
      this.limpiarDatos();

      if (!event.value || event.value.length === 0) {
        this.conceptos = [];
        return;
      }

      // Obtener conceptos para todas las fuentes seleccionadas
      let allConceptos: any[] = [];
      event.value.forEach((fuente: any) => {
        const conceptosUnicos = getConceptosByFuente(this.funcionamientoData, fuente.label);
        allConceptos = [...allConceptos, ...conceptosUnicos];
      });

      // Eliminar duplicados
      const conceptosUnicos = [...new Set(allConceptos)];
      this.conceptos = conceptosUnicos.map((concepto: any) => ({
        value: concepto,
        label: concepto
      }));
      
      console.log('Conceptos disponibles:', this.conceptos);
      
    } catch (error) {
      console.error('Error al cambiar fuente:', error);
      this.conceptos = [];
      this.limpiarDatos();
    }
  }

  /**
   * Evento cuando cambia el concepto seleccionado
   */
  onConceptoChange(event: MultiSelectChangeEvent): void {
    console.log('Conceptos seleccionados:', event.value);
    
    try {
      // Limpiar selección de beneficiario
      this.selectedBeneficiario = [];
      this.registroActual = null;
      this.limpiarDatos();

      if (!this.selectedFuente || this.selectedFuente.length === 0 || 
          !event.value || event.value.length === 0) {
        this.beneficiarios = [];
        return;
      }

      // Obtener beneficiarios para todas las combinaciones de fuentes y conceptos seleccionados
      let allBeneficiarios: any[] = [];
      this.selectedFuente.forEach((fuente: any) => {
        event.value.forEach((concepto: any) => {
          const beneficiariosUnicos = getBeneficiariosByFuenteAndConcepto(
            this.funcionamientoData, 
            fuente.label, 
            concepto.label
          );
          allBeneficiarios = [...allBeneficiarios, ...beneficiariosUnicos];
        });
      });

      // Eliminar duplicados
      const beneficiariosUnicos = [...new Set(allBeneficiarios)];
      this.beneficiarios = beneficiariosUnicos.map((beneficiario: any) => ({
        value: beneficiario,
        label: beneficiario
      }));
      
      console.log('Beneficiarios disponibles:', this.beneficiarios);
      
    } catch (error) {
      console.error('Error al cambiar concepto:', error);
      this.beneficiarios = [];
      this.limpiarDatos();
    }
  }

  /**
   * Evento cuando cambia el beneficiario seleccionado
   */
  onBeneficiarioChange(event: MultiSelectChangeEvent): void {
    console.log('Beneficiarios seleccionados:', event.value);
    
    try {
      if (!this.selectedFuente || this.selectedFuente.length === 0 || 
          !this.selectedConcepto || this.selectedConcepto.length === 0 || 
          !event.value || event.value.length === 0) {
        this.registroActual = null;
        this.limpiarDatos();
        return;
      }

      // Para múltiples selecciones, usar el primer registro encontrado
      this.registroActual = getRegistroByFuenteConceptoBeneficiario(
        this.funcionamientoData,
        this.selectedFuente[0].label,
        this.selectedConcepto[0].label,
        event.value[0].label
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

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros');
    // Limpiar todas las selecciones como arrays vacíos
    this.selectedVigencia = [];
    this.selectedFuente = [];
    this.selectedConcepto = [];
    this.selectedBeneficiario = [];
    this.registroActual = null;
    
    // Reinicializar las listas
    this.inicializarFuentesVacio();
    
    // Limpiar datos iniciales
    this.limpiarDatos();

    this.inicializarComponenteConDatosId1();
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
    }
  }

  /**
   * Limpiar datos de las tarjetas
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
   * Limpiar todos los datos y reinicializar
   */
  private limpiarTodosDatos(): void {
    this.fuentes = [];
    this.conceptos = [];
    this.beneficiarios = [];
    this.selectedVigencia = [];
    this.selectedFuente = [];
    this.selectedConcepto = [];
    this.selectedBeneficiario = [];
    this.registroActual = null;
    this.limpiarDatos();
  }

  // Métodos de formato (mantener los existentes)
  formatMillions(value: number): string {
    if (value === 0) return '$0';
    return `${new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)} m`;
  }

  formatPercentage(value: string): string {
    return value || '0%';
  }

  /**
   * Formatear valores monetarios
   */
  formatearMoneda(valor: any): string {
    if (!valor) return '$0';
    
    const numero = typeof valor === 'string' ? 
      parseFloat(valor.replace(/\./g, '').replace(',', '.')) : 
      valor;
    
    if (isNaN(numero)) return '$0';
    
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numero);
  }

  /**
   * Formatear porcentajes
   */
  formatearPorcentaje(valor: any): string {
    if (!valor) return '0%';
    return valor.toString();
  }

  /**
   * Formatear billones
   */
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

  // Métodos de eventos de botones
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

  // Método para inicializar gráficos (mantener el existente)
  private initializeCharts(): void {
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
        },
        title: {
          display: true,
          text: 'Tendencia Mensual',
          color: textColor,
          font: { size: 10, weight: 'bold' }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder }
        }
      }
    };
    
    // Barra horizontal
    this.horizontalBarData = {
      labels: ['Ejecución Presupuestal'],
      datasets: [
        {
          label: 'CDP',
          backgroundColor: '#dc3545',
          data: [65]
        },
        {
          label: 'Compromisos',
          backgroundColor: '#fd7e14',
          data: [45]
        },
        {
          label: 'Pagos',
          backgroundColor: '#28a745',
          data: [25]
        },
        {
          label: 'Saldo sin afectacion',
          backgroundColor: '#a569bd',
          data: [12]
        }
      ]
    };

    this.horizontalBarOptions = {
      indexAxis: 'y',
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
          text: 'Ejecución por Tipo',
          color: textColor,
          font: { size: 10, weight: 'bold' }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder }
        },
        y: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder }
        }
      }
    };

    // Gráfico de dona
    this.donutData = {
      labels: ['Compromisos ($ 21.493 m)', 'Presupuesto Disponible($ 77.345)'],
      datasets: [
        {
          data: [21, 56],
          backgroundColor: ['#28a745', '#e9ecef'],
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
          text: 'Avance de ejecución',
          color: textColor,
          font: { size: 10, weight: 'bold' }
        }
      }
    };

    this.donutData2 = {
      labels: ['Presupuesto Corriente($ 84.241 m)', 'Recaudo Corriente ($ 12.345 m)'],
      datasets: [
        {
          data: [70, 30],
          backgroundColor: ['#3366cc', '#e9ecef'],
          hoverBackgroundColor: ['#2851a3', '#dee2e6']
        }
      ]
    };

    this.donutOptions2 = {
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
          text: 'Avance de recaudo',
          color: textColor,
          font: { size: 10, weight: 'bold' }
        }
      }
    };
  }
}