import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';

import { 
  getFuentes,
  getConceptosByFuente,
  getBeneficiariosByFuenteAndConcepto
} from '../../utils/sgr-functions';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { MatIconModule } from '@angular/material/icon';
import { FloatLabel } from 'primeng/floatlabel';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { MultiSelect, MultiSelectChangeEvent  } from 'primeng/multiselect';

import { departamentos } from '../../data/departamentos';

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
  private funcionamientoDataEntities: any[] = [];
  
  // Datos con el registro de totales incluido
  private funcionamientoDataConTotales: any[] = [];

  // Opciones para los selects
  fuentes: SelectOption[] = [];
  conceptos: SelectOption[] = [];
  beneficiarios: SelectOption[] = [];
  departamentos: SelectOption[] = [];
  municipios: SelectOption[] = [];


  // Valores seleccionados - iniciar sin selección
  selectedVigencia: any; // Seleccionar el primer elemento por defecto
  selectedFuente: any[] = [];
  selectedConcepto: any[] = [];
  selectedBeneficiario: any[] = [];
  selectedDepartamento: any[] = [];
  selectedMunicipio: any[] = [];

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
    iacCorriente: 0,
    avance: 0
  }

  // Datos para los gráficos
  barChartData: any;
  horizontalBarAfectacionData: any;
  horizontalBarAfectacionOptions: any;
  donutSituacionCajaOpts: any;
  donutAvanceEjecucionData: any;
  donutAvanceEjecucionOptions: any;
  donutSituacionCajaData: any;
  donutOptions2: any;
  donutAvanceRecaudoData: any;
  donutAvanceRecaudoOptions: any;

  compromisoPorcentaje: string = '0.0';
  pagosEjecucionPorcentaje: string = '0.0';
  

  // Registro actualmente seleccionado
  registroActual: any = null;

  vigencia = [
    {
        "id": 1,
        "label": "2025 - 2026"
    }
  ];

  showDptos: boolean = false;
  showMpios: boolean = false;

  urlTrimestralReport: string = "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx#funveinticincoseis"
  detailReportXlsFile = "reporte-detalle-recaudo-2025.xlsx"
  managementReportXlsFile = "reporte-gestion-financiera-2025.xlsx"
  funcionamientoDataUrl = "/assets/data/funcionamiento-base.json";
  funcionamientoDataEntitiesUrl = "/assets/data/funcionamiento-base-entities.json"

  constructor() {}

  ngOnInit(): void {
    this.cargarDatos().then(() => {
      this.generarRegistroTotales();    
      this.cargarDatosTotalesInicial();
      
      if (isPlatformBrowser(this.platformId)) {
        this.initializeCharts();
      }

      this.selectedVigencia = this.vigencia[0];
      
      // Reinicializar las listas con TOTAL como opción
      this.inicializarFuentesVacio();
      
      // Cargar datos totales por defecto
      this.cargarDatosTotalesInicial();

      this.departamentos = departamentos.map(dpto => ({
        value: dpto.codigo,
        label: dpto.nombre
      }));
    }).catch(error => {
      console.error('Error al cargar los datos iniciales:', error);
      // Inicializar con datos vacíos si falla la carga
      this.funcionamientoDataConTotales = [];
      this.inicializarFuentesVacio();
    });
    
    
  }

  /**
   * Cargar los datos desde el archivo JSON
   */
  async cargarDatos(): Promise<void> {
    try {
      const response = await fetch(this.funcionamientoDataUrl);
      this.funcionamientoData = await response.json();
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

      // NUEVA LÓGICA: Manejar la exclusión mutua con TOTAL
      const totalSeleccionado = event.value.some((fuente: any) => fuente.label === "TOTAL");
      const otrasOpcionesSeleccionadas = event.value.some((fuente: any) => fuente.label !== "TOTAL");

      if (totalSeleccionado && otrasOpcionesSeleccionadas) {
        // Si TOTAL está seleccionado junto con otras opciones, remover TOTAL
        this.selectedFuente = event.value.filter((fuente: any) => fuente.label !== "TOTAL");
        console.log('TOTAL removido automáticamente. Fuentes finales:', this.selectedFuente);
      } else if (totalSeleccionado && !otrasOpcionesSeleccionadas) {
        // Si solo TOTAL está seleccionado, mantenerlo y configurar opciones dependientes
        this.selectedFuente = [{ value: "TOTAL", label: "TOTAL" }];
        this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        
        // Usar el registro de totales general y actualizar componentes visuales
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        if (this.registroActual) {
          this.actualizarDatosDelRegistro();
        }
        return;
      } else {
        // Si no hay TOTAL seleccionado, usar la selección tal como viene
        this.selectedFuente = event.value;
      }

      // Obtener conceptos para todas las fuentes seleccionadas (excluyendo TOTAL)
      let allConceptos: any[] = [];
      this.selectedFuente.forEach((fuente: any) => {
        if (fuente.label !== "TOTAL") {
          const conceptosUnicos = getConceptosByFuente(this.funcionamientoDataConTotales, fuente.label);
          allConceptos = [...allConceptos, ...conceptosUnicos];
        }
      });

      // Eliminar duplicados y agregar TOTAL
      const conceptosUnicos = [...new Set(allConceptos)];
      const conceptosConTotal = ["TOTAL", ...conceptosUnicos];
      this.conceptos = conceptosConTotal.map((concepto: any) => ({
        value: concepto,
        label: concepto
      }));
      
      // CORREGIDO: Calcular totales para múltiples fuentes seleccionadas
      if (this.selectedFuente.length > 0) {
        this.calcularYActualizarTotales();
      }
      
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

      // NUEVA LÓGICA: Manejar la exclusión mutua con TOTAL
      const totalSeleccionado = event.value.some((concepto: any) => concepto.label === "TOTAL");
      const otrasOpcionesSeleccionadas = event.value.some((concepto: any) => concepto.label !== "TOTAL");

      if (totalSeleccionado && otrasOpcionesSeleccionadas) {
        // Si TOTAL está seleccionado junto con otras opciones, remover TOTAL
        this.selectedConcepto = event.value.filter((concepto: any) => concepto.label !== "TOTAL");
        console.log('TOTAL removido automáticamente. Conceptos finales:', this.selectedConcepto);
      } else if (totalSeleccionado && !otrasOpcionesSeleccionadas) {
        // Si solo TOTAL está seleccionado, mantenerlo y configurar opciones dependientes
        this.selectedConcepto = [{ value: "TOTAL", label: "TOTAL" }];
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        
        // Usar el registro de totales general y actualizar componentes visuales
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        if (this.registroActual) {
          this.actualizarDatosDelRegistro();
        }
        return;
      } else {
        // Si no hay TOTAL seleccionado, usar la selección tal como viene
        this.selectedConcepto = event.value;
      }

      // Obtener beneficiarios para todas las combinaciones de fuentes y conceptos seleccionados
      let allBeneficiarios: any[] = [];
      this.selectedFuente.forEach((fuente: any) => {
        this.selectedConcepto.forEach((concepto: any) => {
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
      
      // NUEVO: Calcular y actualizar totales automáticamente cuando cambian conceptos
      if (this.selectedFuente.length > 0 && this.selectedConcepto.length > 0) {
        this.calcularYActualizarTotales();
      }
      
      console.log('Beneficiarios disponibles:', this.beneficiarios);
      
    } catch (error) {
      console.error('Error al cambiar concepto:', error);
      this.beneficiarios = [];
      this.limpiarDatos();
    }
  }
  
  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value, this.selectedDepartamento);
    let codDpto = event.value.value + "000";
    // filtrar departamento seleccionado en funcionamientoDataEntities
    let selectedDptoEntity = this.funcionamientoDataEntities.filter((entity: any) => entity["cod-sicodis"] === codDpto);
    console.log('Departamento seleccionado:', selectedDptoEntity);
    this.calcularTotalesConEntidad(selectedDptoEntity);

    this.municipios = this.funcionamientoDataEntities
      .filter((entity: any) => entity["cod-sicodis"].startsWith(event.value.value) && entity["cod-sicodis"] !== codDpto)
    
    if (this.municipios.length > 0) {
      this.showMpios = true;      
    } 

  }

  onMunicipioChange(event: MultiSelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);

    let selectedMpioEntity = this.funcionamientoDataEntities.filter((entity: any) => entity["cod-sicodis"] === event.value["cod-sicodis"]);
    console.log('Municipio seleccionado:', selectedMpioEntity);
    this.calcularTotalesConEntidad(selectedMpioEntity);
  }

  /**
   * Evento cuando cambia el beneficiario seleccionado
   */
  onBeneficiarioChange(event: MultiSelectChangeEvent): void {
    console.log('Beneficiarios seleccionados:', event.value);
    
    try {
      // Si no hay asignaciones o conceptos seleccionados, no hacer nada
      if (!this.selectedFuente || this.selectedFuente.length === 0 || 
          !this.selectedConcepto || this.selectedConcepto.length === 0) {
        this.registroActual = null;
        this.limpiarDatos();
        return;
      }

      // CASO 1: No hay beneficiarios seleccionados
      // Calcular totales basado solo en asignaciones y conceptos
      if (!event.value || event.value.length === 0) {
        console.log('Sin beneficiarios seleccionados, calculando totales por asignaciones y conceptos');
        this.selectedBeneficiario = [];
        this.calcularYActualizarTotales();
        return;
      }

      // CASO 2: Manejo de exclusión mutua con TOTAL
      const totalSeleccionado = event.value.some((beneficiario: any) => beneficiario.label === "TOTAL");
      const otrosBeneficiariosSeleccionados = event.value.some((beneficiario: any) => beneficiario.label !== "TOTAL");

      if (totalSeleccionado && otrosBeneficiariosSeleccionados) {
        // Si TOTAL está seleccionado junto con otros beneficiarios, remover TOTAL
        this.selectedBeneficiario = event.value.filter((beneficiario: any) => beneficiario.label !== "TOTAL");
        console.log('TOTAL removido automáticamente. Beneficiarios finales:', this.selectedBeneficiario);
      } else if (totalSeleccionado && !otrosBeneficiariosSeleccionados) {
        // Si solo TOTAL está seleccionado
        this.selectedBeneficiario = [{ value: "TOTAL", label: "TOTAL" }];
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        if (this.registroActual) {
          this.actualizarDatosDelRegistro();
        }
        return;
      } else {
        // Si no hay TOTAL seleccionado, usar la selección tal como viene
        this.selectedBeneficiario = event.value;
        if (this.selectedBeneficiario.length === 1 && this.selectedBeneficiario[0].label.trim() === "Departamentos") {
          this.showDptos = true;
          this.showMpios = false;
          if (this.funcionamientoDataEntities.length == 0){
            // Cargar entidades si aún no se han cargado
            fetch(this.funcionamientoDataEntitiesUrl)
              .then(response => response.json())
              .then(data => {
                this.funcionamientoDataEntities = data;                
              })
              .catch(error => {
                console.error('Error cargando entidades:', error);
                this.municipios = [];
              });
          }
        }else{
          this.showDptos = false;
          this.showMpios = false;
        }
      }

      // CASO 3: Múltiples beneficiarios seleccionados (sin TOTAL)
      // Calcular totales para los registros que coincidan con todas las selecciones
      this.calcularTotalesConBeneficiarios();

    } catch (error) {
      console.error('Error al cambiar beneficiario:', error);
      this.limpiarDatos();
    }
  }

 /** 
 * Filtra por asignaciones, conceptos Y beneficiarios seleccionados
 */
  private calcularTotalesConBeneficiarios(): void {
    try {
      console.log('Calculando totales con beneficiarios específicos...');
      
      // Si no hay selecciones válidas, no hacer nada
      if (!this.selectedFuente || this.selectedFuente.length === 0 ||
          !this.selectedConcepto || this.selectedConcepto.length === 0 ||
          !this.selectedBeneficiario || this.selectedBeneficiario.length === 0) {
        return;
      }

      // Filtrar registros que coincidan con todas las selecciones
      const registrosFiltrados = this.funcionamientoData.filter(registro => {
        const coincideFuente = this.selectedFuente.some(f => f.label === registro.fuente);
        const coincideConcepto = this.selectedConcepto.some(c => c.label === registro.concepto);
        const coincideBeneficiario = this.selectedBeneficiario.some(b => b.label === registro.beneficiario);
        
        return coincideFuente && coincideConcepto && coincideBeneficiario;
      });

      if (registrosFiltrados.length === 0) {
        console.warn('No se encontraron registros para las selecciones específicas de beneficiarios');
        // Si no hay registros específicos, calcular solo por asignaciones y conceptos
        this.calcularYActualizarTotales();
        return;
      }

      console.log(`Calculando totales para ${registrosFiltrados.length} registros con beneficiarios específicos`);

      // Función para convertir string a número
      const convertirANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
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
          const numeroLimpio = valor.replace('%', '').replace(',', '.');
          const numero = parseFloat(numeroLimpio);
          return isNaN(numero) ? 0 : numero;
        }
        return 0;
      };

      // Crear un registro de totales calculado para beneficiarios
      const registroTotalesCalculado: any = {
        id: "TOTAL_BENEFICIARIOS",
        fuente: this.selectedFuente.map(f => f.label).join(', '),
        concepto: this.selectedConcepto.map(c => c.label).join(', '),
        beneficiario: this.selectedBeneficiario.map(b => b.label).join(', ')
      };

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

      // Calcular la suma para cada campo numérico
      camposSuma.forEach(campo => {
        const valores = registrosFiltrados
          .map(registro => convertirANumero(registro[campo]))
          .filter(valor => !isNaN(valor));
        
        const suma = valores.reduce((total, valor) => total + valor, 0);
        registroTotalesCalculado[campo] = suma;
      });

      // Calcular el promedio para campos de porcentaje
      camposPromedio.forEach(campo => {
        const valoresValidos = registrosFiltrados
          .map(registro => convertirPorcentajeANumero(registro[campo]))
          .filter(valor => !isNaN(valor) && valor > 0);
        
        const promedio = valoresValidos.length > 0 
          ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
          : 0;
        
        registroTotalesCalculado[campo] = promedio;
      });

      // Establecer el registro calculado como registro actual
      this.registroActual = registroTotalesCalculado;
      
      // Actualizar todos los componentes visuales con los nuevos datos
      this.actualizarDatosDelRegistro();
      
      console.log('Totales calculados con beneficiarios específicos:', this.registroActual);

    } catch (error) {
      console.error('Error calculando totales con beneficiarios:', error);
    }
  }
  

  private calcularTotalesConEntidad(registrosFiltrados: any): void {
    try {
      console.log('Calculando totales con departamento específico...');
      
      if (registrosFiltrados.length === 0) {
        console.warn('No se encontraron registros para las selecciones específicas de departamento');
        // Si no hay registros específicos, calcular solo por asignaciones y conceptos
        this.calcularYActualizarTotales();
        return;
      }

      console.log(`Calculando totales para ${registrosFiltrados.length} registros con departamento específico`);
      
      // Establecer el registro calculado como registro actual
      this.registroActual = registrosFiltrados[0];
      
      // Actualizar todos los componentes visuales con los nuevos datos
      this.actualizarDatosDelRegistro();
      
      console.log('Totales calculados con beneficiarios específicos:', this.registroActual);

    } catch (error) {
      console.error('Error calculando totales con beneficiarios:', error);
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

  private calcularYActualizarTotales(): void {
    try {
      console.log('Calculando totales para selecciones actuales...');
      
      // Si no hay asignaciones seleccionadas, no hacer nada
      if (!this.selectedFuente || this.selectedFuente.length === 0) {
        return;
      }

      // Filtrar registros que coincidan con las selecciones actuales
      let registrosFiltrados = this.funcionamientoData.filter(registro => {
        const coincideFuente = this.selectedFuente.some(f => f.label === registro.fuente);
        
        // Si hay conceptos seleccionados, también filtrar por concepto
        if (this.selectedConcepto && this.selectedConcepto.length > 0) {
          const coincideConcepto = this.selectedConcepto.some(c => c.label === registro.concepto);
          return coincideFuente && coincideConcepto;
        }
        
        return coincideFuente;
      });

      if (registrosFiltrados.length === 0) {
        console.warn('No se encontraron registros para las selecciones actuales');
        return;
      }

      console.log(`Calculando totales para ${registrosFiltrados.length} registros filtrados`);

      // Función para convertir string a número
      const convertirANumero = (valor: any): number => {
        if (typeof valor === 'number') return valor;
        if (typeof valor === 'string') {
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
          const numeroLimpio = valor.replace('%', '').replace(',', '.');
          const numero = parseFloat(numeroLimpio);
          return isNaN(numero) ? 0 : numero;
        }
        return 0;
      };

      // Crear un registro de totales calculado
      const registroTotalesCalculado: any = {
        id: "TOTAL_CALCULADO",
        fuente: "TOTAL",
        concepto: "TOTAL", 
        beneficiario: "TOTAL"
      };

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

      // Calcular la suma para cada campo numérico
      camposSuma.forEach(campo => {
        const valores = registrosFiltrados
          .map(registro => convertirANumero(registro[campo]))
          .filter(valor => !isNaN(valor));
        
        const suma = valores.reduce((total, valor) => total + valor, 0);
        registroTotalesCalculado[campo] = suma;
      });

      // Calcular el promedio para campos de porcentaje
      camposPromedio.forEach(campo => {
        const valoresValidos = registrosFiltrados
          .map(registro => convertirPorcentajeANumero(registro[campo]))
          .filter(valor => !isNaN(valor) && valor > 0);
        
        const promedio = valoresValidos.length > 0 
          ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
          : 0;
        
        registroTotalesCalculado[campo] = promedio;
      });

      // Establecer el registro calculado como registro actual
      this.registroActual = registroTotalesCalculado;
      
      // Actualizar todos los componentes visuales con los nuevos datos
      this.actualizarDatosDelRegistro();
      
      console.log('Totales calculados y componentes actualizados:', this.registroActual);

    } catch (error) {
      console.error('Error calculando y actualizando totales:', error);
    }
  }

  /**
   * 
   * Calcula la sumatoria de todos los registros con las asignaciones seleccionadas
   */
  private recalcularTotalesParaSeleccionesMultiples(): void {
    try {
      console.log('Recalculando totales para selecciones múltiples...');
      
      // Si no hay asignaciones seleccionadas, no hacer nada
      if (!this.selectedFuente || this.selectedFuente.length === 0) {
        return;
      }

      // Si TOTAL está seleccionado en asignaciones, usar el registro de totales general
      const totalEnAsignaciones = this.selectedFuente.some(f => f.label === "TOTAL");
      
      if (totalEnAsignaciones) {
        console.log('TOTAL está seleccionado en asignaciones, usando registro de totales general');
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        if (this.registroActual) {
          this.actualizarDatosDelRegistro();
        }
        return;
      }

      // Calcular totales para las asignaciones seleccionadas
      const asignacionesSeleccionadas = this.selectedFuente.map(f => f.label);
      console.log('Calculando totales para asignaciones:', asignacionesSeleccionadas);

      // Filtrar registros que coincidan con las asignaciones seleccionadas
      const registrosFiltrados = this.funcionamientoDataConTotales.filter(registro => 
        registro.id !== "TOTAL" && asignacionesSeleccionadas.includes(registro.fuente)
      );

      console.log('Registros filtrados para cálculo:', registrosFiltrados.length);

      if (registrosFiltrados.length === 0) {
        console.warn('No se encontraron registros para las asignaciones seleccionadas');
        return;
      }

      // Crear un registro de totales calculado
      let  registroTotalesCalculado: any = {
        id: "TOTAL_CALCULADO",
        fuente: "TOTAL",
        concepto: "TOTAL", 
        beneficiario: "TOTAL"
      };

      // Campos numéricos a sumar
      const camposNumericos = [
        'apropiacion-inicial',
        'apropiacion-vigente',
        'apropiacion-vigente-disponible',
        'compromisos',
        'obligaciones',
        'pagos',
        'saldo-sin-afectacion',
        'saldo-por-programar',
        'avance-compromisos',
        'avance-obligaciones',
        'avance-pagos'
      ];

      // Calcular la suma para cada campo numérico
      camposNumericos.forEach(campo => {
        const valores = registrosFiltrados
          .map(registro => {
            const valor = registro[campo];
            return (typeof valor === 'number' && !isNaN(valor)) ? valor : 0;
          });
        
        const suma = valores.reduce((total, valor) => total + valor, 0);
        registroTotalesCalculado[campo] = suma;
      });

      // Campos de porcentaje (calcular promedio ponderado o promedio simple)
      const camposPorcentaje = ['avance-compromisos', 'avance-obligaciones', 'avance-pagos'];
      camposPorcentaje.forEach(campo => {
        const valoresValidos = registrosFiltrados
          .map(registro => registro[campo])
          .filter(valor => typeof valor === 'number' && !isNaN(valor));
        
        const promedio = valoresValidos.length > 0 
          ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
          : 0;
        
        registroTotalesCalculado[campo] = promedio;
      });

      // Actualizar el registro TOTAL en los datos con los valores calculados
      const indiceTotal = this.funcionamientoDataConTotales.findIndex(item => item.id === "TOTAL");
      if (indiceTotal !== -1) {
        // Mantener la estructura original pero actualizar los valores calculados
        this.funcionamientoDataConTotales[indiceTotal] = {
          ...this.funcionamientoDataConTotales[indiceTotal],
          ...registroTotalesCalculado
        };
        
        this.registroActual = this.funcionamientoDataConTotales[indiceTotal];
        this.actualizarDatosDelRegistro();
        
        console.log('Registro TOTAL actualizado con cálculos:', this.registroActual);
      }

    } catch (error) {
      console.error('Error recalculando totales para selecciones múltiples:', error);
    }
  }

  private recalcularTotales(): void {
    try {
      console.log('Recalculando totales...');
      
      // Si TOTAL está seleccionado en asignaciones o conceptos, usar el registro de totales general
      const totalEnAsignaciones = this.selectedFuente.some(f => f.label === "TOTAL");
      const totalEnConceptos = this.selectedConcepto.some(c => c.label === "TOTAL");
      
      if (totalEnAsignaciones || totalEnConceptos) {
        console.log('TOTAL está seleccionado, usando registro de totales general');
        this.registroActual = this.funcionamientoDataConTotales.find(item => item.id === "TOTAL");
        if (this.registroActual) {
          this.actualizarDatosDelRegistro();
        }
        return;
      }

      // Si no hay TOTAL seleccionado, calcular totales para las selecciones específicas
      this.calcularYActualizarTotales();
      
    } catch (error) {
      console.error('Error recalculando totales:', error);
    }
  }

  /**
   * NUEVO MÉTODO: Calcular totales basado en las selecciones actuales de asignaciones y conceptos
   */
  private calcularTotalesPorSeleccion(): any {
    try {
      // Filtrar registros que coincidan con las selecciones actuales
      const registrosFiltrados = this.funcionamientoData.filter(registro => {
        const coincideFuente = this.selectedFuente.some(f => f.label === registro.fuente);
        const coincideConcepto = this.selectedConcepto.some(c => c.label === registro.concepto);
        return coincideFuente && coincideConcepto;
      });

      if (registrosFiltrados.length === 0) {
        console.warn('No se encontraron registros para las selecciones actuales');
        return null;
      }

      console.log(`Calculando totales para ${registrosFiltrados.length} registros filtrados`);

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
          const numeroLimpio = valor.replace('%', '').replace(',', '.');
          const numero = parseFloat(numeroLimpio);
          return isNaN(numero) ? 0 : numero;
        }
        return 0;
      };

      // Crear registro de totales calculado
      const registroCalculado: any = {
        "cod-sgpr": "CALC",
        "cod-sicodis": "CALC",
        "id": "CALCULADO",
        "fuente": `${this.selectedFuente.map(f => f.label).join(', ')}`,
        "concepto": `${this.selectedConcepto.map(c => c.label).join(', ')}`,
        "beneficiario": "CALCULADO",
        "acto-administrativo": "Totales Calculados"
      };

      // Calcular sumas
      camposSuma.forEach(campo => {
        const suma = registrosFiltrados.reduce((total, registro) => {
          return total + convertirANumero(registro[campo]);
        }, 0);
        registroCalculado[campo] = suma;
      });

      // Calcular promedios para porcentajes
      camposPromedio.forEach(campo => {
        const valoresValidos = registrosFiltrados
          .map(registro => convertirPorcentajeANumero(registro[campo]))
          .filter(valor => !isNaN(valor) && valor !== 0);
        
        const promedio = valoresValidos.length > 0 
          ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
          : 0;
        
        registroCalculado[campo] = promedio;
      });

      console.log('Registro calculado generado:', registroCalculado);
      return registroCalculado;

    } catch (error) {
      console.error('Error calculando totales por selección:', error);
      return null;
    }
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
    this.selectedDepartamento = [];
    this.selectedMunicipio = [];
    this.showDptos = false;
    this.showMpios = false;
    this.municipios = [];
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
        presupuestoAsignado: this.registroActual['total-asignado-bienio'] / 1000000, // En millones
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
        iacCorriente: convertirANumero(this.registroActual['iac-corriente']) / 1000000,
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
      iacCorriente: 0,
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
formatMillions2(
  num: number,
  options: {
    includeSymbol?: boolean;
    decimalPlaces?: number;
    includeMillionSuffix?: boolean;
  } = {}
) {
  // Default options
  const {
    includeSymbol = false,
    decimalPlaces = 0,
    includeMillionSuffix = true
  } = options;

  // Convert to miles of millions
  const valueInMilesOfMillions = num;

  // Format the number
  const formattedValue = valueInMilesOfMillions.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).replaceAll(',', 'temp').replaceAll('.', ',').replaceAll('temp', '.');

  // Build the result string
  let result = '';
  if (includeSymbol) result += '$ ';
  result += formattedValue;
  if (includeMillionSuffix) result += ' m';

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
      const cdp = convertirANumero(this.registroActual['cdp']) / 1000000; // En millones
      let pagos = convertirANumero(this.registroActual['pagos']) / 1000000; // En millones
      const compromisoSinAfectacion = (convertirANumero(this.registroActual['compromisos']) / 1000000) - pagos;
      const saldoSinAfectacion = convertirANumero(this.registroActual['saldo-sin-afectacion']) / 1000000; // En millones
      const cdpSinAfectacion = (cdp-compromisoSinAfectacion-pagos) < 0 ? cdp - compromisoSinAfectacion : cdp - compromisoSinAfectacion - pagos;
      this.horizontalBarAfectacionData = {
        labels: [''],
        datasets: [
          {
            label: 'Pagos',
            backgroundColor: '#e8a58c',
            data: [pagos]
          },
          {
            label: 'Compromisos por pagar',
            backgroundColor: '#ee825a',
            data: [compromisoSinAfectacion]
          },
          {
            label: 'CDP por comprometer',
            backgroundColor: '#F74E11',
            data: [cdpSinAfectacion]
          },
          {
            label: 'Saldo sin afect.',
            backgroundColor: '#eceae9',
            data: [saldoSinAfectacion]
          }
          
        ]
      };

      // Actualizar gráfico de dona (Avance de ejecución)
      let compromiso = convertirANumero(this.registroActual['compromisos']) / 1000000; // En millones
      let presupuestoDisponible = convertirANumero(this.registroActual['apropiacion-vigente-disponible']) / 1000000; // En millones
            
      let compromisoPorcentaje = compromiso > 0 ? (compromiso / (presupuestoDisponible)) * 100 : 0;
      this.compromisoPorcentaje = compromisoPorcentaje.toFixed(1);
      console.log("Compromiso: ", compromiso);
      console.log("Presupuesto disponible: ", presupuestoDisponible);
      this.donutAvanceEjecucionData = {
        labels: ['Compromiso', 'Presupuesto disponible'],
        datasets: [
          {
            data: [compromiso, presupuestoDisponible],
            backgroundColor: ['#ee825a', '#eceae9'],
            hoverBackgroundColor: ['#e85c16', '#dee2e6']
          }
        ]
      };

      let cajaDisponible = convertirANumero(this.registroActual['caja-disponible']) / 1000000; // En millones
      let pagosPorcentaje = pagos > 0 ? ((pagos) / cajaDisponible) * 100 : 0;
      this.pagosEjecucionPorcentaje = pagosPorcentaje.toFixed(1);
      this.donutSituacionCajaData = {
        labels: [''],
        datasets: [
          {
            label: 'Pagos',
            data: [pagos],
            backgroundColor: '#e8a58c',
          },
          {
            label: 'Caja Disponible',
            data: [cajaDisponible],
            backgroundColor: '#eceae9'            
          }
        ]
      };

      this.donutAvanceRecaudoData = {
        labels: ['Recaudo corriente', 'Presupuesto corriente'],
        datasets: [
          {
            data: [
              this.avanceRecaudoData.iacCorriente, this.avanceRecaudoData.presupuestoCorriente
            ],
            backgroundColor: ['#FF8D00', '#eceae9'],
            hoverBackgroundColor: ['#2851a3', '#dee2e6']
          }
        ]
      };

      console.log('Gráficos actualizados con datos:', {
        barChart: this.barChartData,
        horizontalBar: this.horizontalBarAfectacionData,
        donut1: this.donutAvanceEjecucionData,
        donut2: this.donutSituacionCajaData
      });

    } catch (error) {
      console.error('Error actualizando gráficos:', error);
    }
  }

  private initializeCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color') || '#dee2e6';

    // Opciones para gráfico de barras horizontales
    this.horizontalBarAfectacionOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { size: 10 },
            boxWidth: 20,
          },
          maxWidth: 100,
          
        },
        title: {
          display: true,
          text: 'Afectación presupuestal',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')} m`;
            }
          }
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

    this.donutSituacionCajaOpts = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: { size: 10 },
            boxWidth: 20,
          },
          maxWidth: 100,
          
        },
        title: {
          display: true,
          text: 'Situación de Caja',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')} m`;
            }
          }
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
    this.donutAvanceEjecucionOptions = {  
      cutout: '60%',    
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
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
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')} m`;
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
        }
      }
    };

    this.donutAvanceRecaudoOptions = {  
      cutout: '60%',    
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
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
          text: 'Avance de Recaudo',
          color: textColor,
          font: { size: 12, weight: 'bold' }
        },
        tooltip: {
          callbacks: {
            label: function(tooltipItem: any) {
              return `${Math.ceil(tooltipItem.raw).toLocaleString('es-CO')} m`;            
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
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
    this.downloadAssetFile(this.managementReportXlsFile);
  }

  onDetalleRecaudoClick(): void {
    console.log('Detalle de Recaudo clicked');
    this.downloadAssetFile(this.detailReportXlsFile);
  }

  onInformeTrimestraClick(): void {
    console.log('Informe Trimestral clicked');
    this.openInNewTab(this.urlTrimestralReport);
  }
}