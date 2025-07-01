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
  
  // Datos con el registro de totales incluido
  private funcionamientoDataConTotales: any[] = [];

  // Opciones para los selects
  fuentes: SelectOption[] = [];
  conceptos: SelectOption[] = [];
  beneficiarios: SelectOption[] = [];

  // Valores seleccionados - iniciar sin selección
  selectedVigencia: any; // Seleccionar el primer elemento por defecto
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
    disponibilidadInicial: 0,
    recaudo: 0,
    cajaTotal: 0,
    cajaDisponible: 0
  };

  avanceRecaudoData = {
    presupuestoCorriente: 0,
    avance: 0
  }

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

  urlTrimestralReport: string = "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx#funveinticincoseis"
  detailXlsFile = "detalle-recaudo-funcionamiento-2025.xlsx"

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos();
    this.generarRegistroTotales();
    this.inicializarComponenteConDatosId1();
    this.cargarDatosTotalesInicial();
    
    if (isPlatformBrowser(this.platformId)) {
      this.initializeCharts();
    }

    this.selectedVigencia = this.vigencia[0];
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
   * Cargar datos totales al inicializar la página
   */
  private cargarDatosTotalesInicial(): void {
    try {
      // Buscar el registro de totales
      const registroTotales = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
      
      if (registroTotales) {
        console.log('Cargando datos totales iniciales:', registroTotales);
        
        // Establecer el registro de totales como registro actual
        this.registroActual = registroTotales;
        
        // Asegurar que las opciones TOTAL estén disponibles en todas las listas
        this.fuentes = [{ value: "TOTAL", label: "TOTAL" }, ...this.fuentes.filter(f => f.value !== "TOTAL")];
        this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        
        // Pre-seleccionar "TOTAL" en todos los filtros
        this.selectedFuente = [{
          value: "TOTAL",
          label: "TOTAL"
        }];

        this.selectedConcepto = [{
          value: "TOTAL",
          label: "TOTAL"
        }];

        this.selectedBeneficiario = [{
          value: "TOTAL",
          label: "TOTAL"
        }];

        // Actualizar los datos de las tarjetas con los totales
        this.actualizarDatosDelRegistro();
        
        // Actualizar gráficos después de un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          this.actualizarGraficos();
        }, 100);
        
        console.log('Datos totales cargados correctamente');
        console.log('Filtros seleccionados:', {
          fuente: this.selectedFuente,
          concepto: this.selectedConcepto,
          beneficiario: this.selectedBeneficiario
        });
      } else {
        console.warn('No se encontró registro de totales');
      }
      
    } catch (error) {
      console.error('Error cargando datos totales iniciales:', error);
    }
  }
  private generarRegistroTotales(): void {
    if (!this.funcionamientoData || this.funcionamientoData.length === 0) {
      console.warn('No hay datos para generar totales');
      this.funcionamientoDataConTotales = [];
      return;
    }

    try {
      // Campos que se deben sumar
      const camposSuma = [
        'distribucion-presupuesto-corriente',
        'distribucion-otros',
        'total-asignado-bienio',
        'disponibilidad-inicial',
        'apropiacion-vigente',
        'recursos-bloqueados',
        'apropiacion-vigente-disponible',
        'iac-mayor-recaudo-saldos-y-reintegros',
        'iac-corriente',
        'iac-informadas',
        'caja-total',
        'cdp',
        'compromisos',
        'pagos',
        'saldo-por-comprometer',
        'caja-disponible',
        'saldo-disponible-a-pagos',
        'saldo-sin-afectacion'
      ];

      // Campos que se deben promediar (porcentajes)
      const camposPromedio = [
        'avance-iac-corriente',
        'ejecucion-a-compromisos'
      ];

      // Función para convertir string a número
      const convertirANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
          // Eliminar puntos como separadores de miles y reemplazar comas por puntos para decimales
          const numeroLimpio = valor.replace(/\./g, '').replace(',', '.');
          const numero = parseFloat(numeroLimpio);
          return isNaN(numero) ? 0 : numero;
        }
        return 0;
      };

      // Función para convertir porcentaje string a número
      const convertirPorcentajeANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
          // Remover el símbolo % y convertir
          const numeroLimpio = valor.replace('%', '').replace(',', '.');
          const numero = parseFloat(numeroLimpio);
          return isNaN(numero) ? 0 : numero;
        }
        return 0;
      };

      // Inicializar objeto de totales
      const registroTotales: any = {
        "cod-sgpr": "TOTAL",
        "cod-sicodis": "TOTAL",
        "id": "TOTAL",
        "fuente": "TOTAL",
        "concepto": "TOTAL",
        "beneficiario": "TOTAL",
        "acto-administrativo": "Consolidado Total"
      };

      // Calcular sumas
      camposSuma.forEach(campo => {
        const suma = this.funcionamientoData.reduce((total, registro) => {
          return total + convertirANumero(registro[campo]);
        }, 0);
        registroTotales[campo] = suma;
      });

      // Calcular promedios para porcentajes
      camposPromedio.forEach(campo => {
        const valoresValidos = this.funcionamientoData
          .map(registro => convertirPorcentajeANumero(registro[campo]))
          .filter(valor => !isNaN(valor) && valor !== 0);
        
        const promedio = valoresValidos.length > 0 
          ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
          : 0;
        
        registroTotales[campo] = promedio;
      });

      // Agregar el registro de totales a los datos
      this.funcionamientoDataConTotales = [...this.funcionamientoData, registroTotales];
      
      console.log('Registro de totales generado:', registroTotales);
      console.log('Datos con totales:', this.funcionamientoDataConTotales.length, 'registros');
      
    } catch (error) {
      console.error('Error generando registro de totales:', error);
      this.funcionamientoDataConTotales = [...this.funcionamientoData];
    }
  }

  /**
   * Actualizar las funciones que usan funcionamientoData para usar funcionamientoDataConTotales
   */
  private inicializarComponenteConDatosId1(): void {
    try {
      // Buscar el registro con id = 1
      const registroId1 = this.funcionamientoDataConTotales.find(item => item.id === 1);
      
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
      // 1. Inicializar fuentes (incluyendo TOTAL)
      const fuentesUnicas = getFuentes(this.funcionamientoDataConTotales);
      // Agregar TOTAL como primera opción
      const fuentesConTotal = ["TOTAL", ...fuentesUnicas];
      this.fuentes = fuentesConTotal.map((fuente: any) => ({
        value: fuente,
        label: fuente
      }));

      // 2. Inicializar conceptos (incluyendo TOTAL)
      const conceptosParaFuente = getConceptosByFuente(this.funcionamientoDataConTotales, registroId1.fuente);
      const conceptosConTotal = ["TOTAL", ...conceptosParaFuente];
      this.conceptos = conceptosConTotal.map((concepto: any) => ({
        value: concepto,
        label: concepto
      }));

      // 3. Inicializar beneficiarios (incluyendo TOTAL)
      const beneficiariosParaFuenteYConcepto = getBeneficiariosByFuenteAndConcepto(
        this.funcionamientoDataConTotales, 
        registroId1.fuente, 
        registroId1.concepto
      );
      const beneficiariosConTotal = ["TOTAL", ...beneficiariosParaFuenteYConcepto];
      this.beneficiarios = beneficiariosConTotal.map((beneficiario: any) => ({
        value: beneficiario,
        label: beneficiario
      }));

      // NOTA: No pre-seleccionamos valores aquí porque cargarDatosTotalesInicial() 
      // ya se encarga de establecer los valores por defecto en "TOTAL"

      // 5. Inicializar vigencia con el primer valor "2025 - 2026"
      this.selectedVigencia = this.vigencia[0]; // Seleccionar el primer elemento que es "2025 - 2026"

      console.log('Listas inicializadas:');
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
      const fuentesUnicas = getFuentes(this.funcionamientoDataConTotales);
      // Agregar TOTAL como primera opción
      const fuentesConTotal = ["TOTAL", ...fuentesUnicas];
      this.fuentes = fuentesConTotal.map((fuente: any) => ({
        value: fuente,
        label: fuente
      }));
      
      console.log('Fuentes disponibles:', this.fuentes);
      
      // Inicializar los otros selects como vacíos
      this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
      this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
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

  // Resto de métodos actualizados para usar funcionamientoDataConTotales...

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

      // Si se selecciona TOTAL, mostrar solo TOTAL en las siguientes opciones
      if (event.value.some((fuente: any) => fuente.label === "TOTAL")) {
        this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        return;
      }

      // Obtener conceptos para todas las fuentes seleccionadas
      let allConceptos: any[] = [];
      event.value.forEach((fuente: any) => {
        const conceptosUnicos = getConceptosByFuente(this.funcionamientoDataConTotales, fuente.label);
        allConceptos = [...allConceptos, ...conceptosUnicos];
      });

      // Eliminar duplicados y agregar TOTAL
      const conceptosUnicos = [...new Set(allConceptos)];
      const conceptosConTotal = ["TOTAL", ...conceptosUnicos];
      this.conceptos = conceptosConTotal.map((concepto: any) => ({
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

      // Si se selecciona TOTAL, mostrar solo TOTAL en beneficiarios
      if (event.value.some((concepto: any) => concepto.label === "TOTAL")) {
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        return;
      }

      // Obtener beneficiarios para todas las combinaciones de fuentes y conceptos seleccionados
      let allBeneficiarios: any[] = [];
      this.selectedFuente.forEach((fuente: any) => {
        event.value.forEach((concepto: any) => {
          if (fuente.label !== "TOTAL" && concepto.label !== "TOTAL") {
            const beneficiariosUnicos = getBeneficiariosByFuenteAndConcepto(
              this.funcionamientoDataConTotales, 
              fuente.label, 
              concepto.label
            );
            allBeneficiarios = [...allBeneficiarios, ...beneficiariosUnicos];
          }
        });
      });

      // Eliminar duplicados y agregar TOTAL
      const beneficiariosUnicos = [...new Set(allBeneficiarios)];
      const beneficiariosConTotal = ["TOTAL", ...beneficiariosUnicos];
      this.beneficiarios = beneficiariosConTotal.map((beneficiario: any) => ({
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

      // Si se selecciona TOTAL, usar el registro de totales
      if (event.value.some((beneficiario: any) => beneficiario.label === "TOTAL")) {
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        console.log('Registro de totales seleccionado:', this.registroActual);
      } else {
        // Para múltiples selecciones, usar el primer registro encontrado
        this.registroActual = getRegistroByFuenteConceptoBeneficiario(
          this.funcionamientoDataConTotales,
          this.selectedFuente[0].label,
          this.selectedConcepto[0].label,
          event.value[0].label
        );
        console.log('Registro específico encontrado:', this.registroActual);
      }

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
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: MultiSelectChangeEvent): void {
    console.log('Vigencias seleccionadas:', event.value);
    // Aquí puedes agregar lógica específica si necesitas filtrar datos por vigencia
    // Por ahora solo registramos el cambio
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros y cargando datos totales');
    
    // Limpiar todas las selecciones
    this.selectedVigencia = this.vigencia[0]; // Primer bienio como predeterminado
    this.selectedFuente = [];
    this.selectedConcepto = [];
    this.selectedBeneficiario = [];
    this.registroActual = null;
    
    // Limpiar datos iniciales
    this.limpiarDatos();

    // Reinicializar las listas con TOTAL como opción
    this.inicializarFuentesVacio();
    
    // Cargar datos totales por defecto
    this.cargarDatosTotalesInicial();
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
        presupuestoVigenteDisponible: convertirANumero(this.registroActual['apropiacion-vigente-disponible']) / 1000000 // En billones
      };

      // Actualizar datos de ejecución
      this.ejecucionData = {
        cdp: convertirANumero(this.registroActual['cdp']) / 1000000,
        compromiso: convertirANumero(this.registroActual['compromisos']) / 1000000,
        pagos: convertirANumero(this.registroActual['pagos']) / 1000000,
        recursoComprometer: convertirANumero(this.registroActual['saldo-sin-afectacion']) / 1000000 // En billones
      };

      // Actualizar datos de situación de caja
      this.situacionCajaData = {
        disponibilidadInicial: convertirANumero(this.registroActual['disponibilidad-inicial']) / 1000000,
        recaudo: convertirANumero(this.registroActual['iac-corriente']) / 1000000,
        cajaTotal: convertirANumero(this.registroActual['caja-total']) / 1000000,
        cajaDisponible: convertirANumero(this.registroActual['caja-disponible']) / 1000000
      };

      // Actualizar datos de avance de recaudo
      this.avanceRecaudoData = {
        presupuestoCorriente: convertirANumero(this.registroActual['distribucion-presupuesto-corriente']) / 1000000,
        avance: convertirANumero(this.registroActual['avance-iac-corriente'])
      };

      // Actualizar gráficos con datos reales
      this.actualizarGraficos();

      console.log('Datos actualizados:', {
        presupuesto: this.presupuestoData,
        ejecucion: this.ejecucionData,
        caja: this.situacionCajaData,
        recaudo: this.avanceRecaudoData
      });

    } catch (error) {
      console.error('Error actualizando datos del registro:', error);
    }
  }

  // Resto de métodos (limpiarDatos, limpiarTodosDatos, formatMillions, etc.) permanecen igual...
  
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
      disponibilidadInicial: 0,
      recaudo: 0,
      cajaTotal: 0,
      cajaDisponible: 0
    };

    this.avanceRecaudoData = {
      presupuestoCorriente: 0,
      avance: 0
    };
  }

  private limpiarTodosDatos(): void {
    this.limpiarDatos();
    this.fuentes = [];
    this.conceptos = [];
    this.beneficiarios = [];
  }

  // Método para formatear números en millones
  formatMillions(value: number): string {
    if (value === 0) return '$0';
    
    return `$ ${value.toFixed(0)} m`;
  }

  /**
 * Formats a large number in billions (thousands of millions) with Colombian notation
 * @param {number|string} number - The number to be formatted
 * @param {Object} [options] - Formatting options
 * @param {boolean} [options.includeSymbol=true] - Include COP currency symbol
 * @param {number} [options.decimalPlaces=1] - Decimal places to display
 * @param {boolean} [options.includeBillionSuffix=true] - Add "bn" suffix
 * @returns {string} Formatted number string
 */
  formatMillions2(num: number, options = {}) {
    // Default options
    
    let includeSymbol: boolean = true;
    let decimalPlaces: number = 0;
    let includeBillionSuffix: boolean = true;
    
    
    // Convert to miles of millons 
    const valueInMilesOfMillions = num / 1000000;
    
    // Format the number
    const formattedValue = valueInMilesOfMillions.toLocaleString('en-US', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    }).replaceAll(',', 'temp').replaceAll('.', ',').replaceAll('temp', '.');
    
    // Build the result string
    let result = '';
    if (includeSymbol) result += '$ ';
    result += formattedValue;
    if (includeBillionSuffix) result += ' m';
    
    return result;
}

  // Resto de métodos para gráficos y eventos de botones...
  private actualizarGraficos(): void {
    if (!this.registroActual) return;

    try {
      // Convertir valores a números
      const convertirANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
          return parseFloat(valor.replace(/\./g, '').replace(',', '.')) || 0;
        }
        return 0;
      };

      // Datos para gráfico de barras (Ejecución vs Presupuesto)
      const presupuestoTotal = convertirANumero(this.registroActual['apropiacion-vigente']);
      const cdpEjecutado = convertirANumero(this.registroActual['cdp']);
      const compromisosEjecutados = convertirANumero(this.registroActual['compromisos']);
      const pagosEjecutados = convertirANumero(this.registroActual['pagos']);

      // Calcular porcentajes para el gráfico
      const porcentajeCDP = presupuestoTotal > 0 ? (cdpEjecutado / presupuestoTotal) * 100 : 0;
      const porcentajeCompromisos = presupuestoTotal > 0 ? (compromisosEjecutados / presupuestoTotal) * 100 : 0;
      const porcentajePagos = presupuestoTotal > 0 ? (pagosEjecutados / presupuestoTotal) * 100 : 0;

      // Actualizar gráfico de barras verticales
      this.barChartData = {
        labels: ['Ejecución Presupuestal'],
        datasets: [
          {
            label: 'CDP',
            backgroundColor: '#3366CC',
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

      // Actualizar gráfico de barras horizontales (Disponibilidad vs Ejecutado)
      const disponibilidadInicial = convertirANumero(this.registroActual['cdp']);
      const compromisos = convertirANumero(this.registroActual['compromisos']);
      const cajaDisponible = convertirANumero(this.registroActual['pagos']);
      const saldoSinAfectacion = convertirANumero(this.registroActual['saldo-sin-afectacion']);

      this.horizontalBarData = {
        labels: ['Situación de Caja'],
        datasets: [
          {
            label: 'CDP',
            backgroundColor: '#36A2EB',
            data: [disponibilidadInicial / 1000000]
          },
          {
            label: 'Compromiso',
            backgroundColor: '#FFCE56',
            data: [compromisos / 1000000]
          },
          {
            label: 'Pagos',
            backgroundColor: '#4BC0C0',
            data: [cajaDisponible / 1000000]
          },
          {
            label: 'Saldo sin Afectación',
            backgroundColor: '#218838',
            data: [saldoSinAfectacion / 1000000]
          }
          
        ]
      };

      // Actualizar gráfico de dona (Avance de Recaudo)
      const presupuestoCorriente = convertirANumero(this.registroActual['distribucion-presupuesto-corriente']);
      const iacCorriente = convertirANumero(this.registroActual['iac-corriente']);
      const porcentajeRecaudo = presupuestoCorriente > 0 ? (iacCorriente / presupuestoCorriente) * 100 : 0;
      const porcentajePendiente = Math.max(0, 100 - porcentajeRecaudo);

      console.log("Compromiso: ", this.registroActual['compromisos']);
      console.log("Presupuesto disponible: ", this.registroActual['apropiacion-vigente-disponible']);
      this.donutData = {
        labels: ['Compromiso', 'Presupuesto disponible'],
        datasets: [
          {
            data: [this.registroActual['compromisos'], this.registroActual['apropiacion-vigente-disponible']],
            backgroundColor: ['#3366CC', '#e9ecef'],
            hoverBackgroundColor: ['#2851a3', '#dee2e6']
          }
        ]
      };

      // Segundo gráfico de dona (Ejecución de Compromisos vs Pagos)
      const porcentajePagosVsCompromisos = compromisosEjecutados > 0 ? (pagosEjecutados / compromisosEjecutados) * 100 : 0;
      const porcentajePendientePagos = Math.max(0, 100 - porcentajePagosVsCompromisos);

      this.donutData2 = {
        labels: ['Pagos Ejecutados', 'Caja Total'],
        datasets: [
          {
            data: [this.registroActual['pagos'], this.registroActual['caja-total']],
            backgroundColor: ['#28a745', '#ffc107'],
            hoverBackgroundColor: ['#218838', '#e0a800']
          }
        ]
      };

      console.log('Gráficos actualizados con datos:', {
        barChart: this.barChartData,
        horizontalBar: this.horizontalBarData,
        donut1: this.donutData,
        donut2: this.donutData2
      });

    } catch (error) {
      console.error('Error actualizando gráficos:', error);
    }
  }

  private initializeCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    // Opciones para gráfico de barras verticales
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor
          }
        },
        title: {
          display: true,
          text: 'Ejecución Presupuestal (%)',
          color: textColor
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColor
          },
          grid: {
            color: surfaceBorder
          },
          stacked: true
        },
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            color: textColor,
            callback: function(value: any) {
              return value + '%';
            }
          },
          grid: {
            color: surfaceBorder
          },
          stacked: true
        }
      }
    };

    // Opciones para gráfico de barras horizontales
    this.horizontalBarOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2.5,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { size: 11 }
          }
        },
        title: {
          display: true,
          text: 'Ejecución por Tipo',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        }
      },
      scales: {
        x: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder },
          stacked: true
        },
        y: {
          ticks: { color: textColor, font: { size: 8 } },
          grid: { color: surfaceBorder },
          stacked: true
        }
      }
    };

    // Opciones para gráficos de dona
    this.donutOptions = {
      cutout: '50%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.75,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: { size: 10 }
          }
        },
        title: {
          display: true,
          text: 'Avance de Ejecución',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        }
      }
    };

    this.donutOptions2 = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.75,
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: textColor,
            font: { size: 10 }
          }
        },
        title: {
          display: true,
          text: 'Situación de Caja',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        }
      }
    };

    // Inicializar gráficos con datos por defecto si hay registro actual
    if (this.registroActual) {
      this.actualizarGraficos();
    }
  }

  /**
 * Opens a URL in a new browser tab/window
 * @param url The URL to open (must include http/https protocol)
 * @param options Configuration options for the new window
 */
  openInNewTab(
    url: string,
    options: {
      /** Window target name */
      name?: string;
      /** Window features (like size, position, etc.) */
      features?: string;
      /** Whether to noopener for security (recommended true for external links) */
      noopener?: boolean;
      /** Whether to noreferrer for security */
      noreferrer?: boolean;
    } = {}
  ): Window | null {
    // Validate URL format
    if (!/^https?:\/\//i.test(url)) {
      console.error('Invalid URL format. Must include http:// or https:// protocol.');
      return null;
    }

    // Set default options
    const {
      name = '_blank',
      features = '',
      noopener = true,
      noreferrer = true
    } = options;

    // Build rel attribute for security
    const relParts = [];
    if (noopener) relParts.push('noopener');
    if (noreferrer) relParts.push('noreferrer');
    const rel = relParts.join(' ');

    // Create temporary anchor element for best practices
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = name;
    anchor.rel = rel;

    if (features) {
      anchor.setAttribute('data-features', features);
    }

    // Open the window
    const newWindow = window.open(url, name, features);

    // Security: Blank the original link
    anchor.href = 'about:blank';
    document.body.appendChild(anchor);
    document.body.removeChild(anchor);

    return newWindow;
  }

  /**
 * Downloads a file from the /assets/data/ directory
 * @param filename - Name of the file to download (including extension)
 * @param downloadName - Optional custom name for the downloaded file
 * @returns Promise that resolves when download is complete
 */
  async downloadAssetFile(
    filename: string,
    downloadName?: string
  ): Promise<void> {
    try {
      // Validate filename
      if (!filename || !filename.trim()) {
        throw new Error('Filename is required');
      }

      // Clean filename to prevent directory traversal
      const cleanFilename = filename.replace(/\.\.\//g, '').replace(/^\//, '');
      
      // Construct the full path (adjust if your assets are served differently)
      const filePath = `/assets/data/${cleanFilename}`;
      
      // Fetch the file
      const response = await fetch(filePath);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }
      
      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set download attribute with custom name or original filename
      link.setAttribute('download', downloadName || cleanFilename);
      
      // Append to DOM, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up by revoking the blob URL
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error; // Re-throw to allow error handling by caller
    }
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
    this.downloadAssetFile(this.detailXlsFile);
  }

  onInformeTrimestraClick(): void {
    console.log('Informe Trimestral clicked');
    this.openInNewTab(this.urlTrimestralReport);
  }
}