import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SicodisApiService, DiccionarioItem, SiglasItem, FuncionamientoSiglasDiccionario } from '../../services/sicodis-api.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import Chart from 'chart.js/auto';

// Funciones de utilidad solo para fallback en caso de que la API no responda
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
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { departamentos } from '../../data/departamentos';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

interface SelectOption {
  value: string;
  label: string;
}

/**
 * Reporte de Funcionamiento Component - Optimized Version
 * 
 * Este componente ha sido refactorizado para usar exclusivamente la API de SICODIS
 * en lugar de cálculos locales. Los cambios principales incluyen:
 * 
 * - Removidos métodos obsoletos de cálculo local (calcularTotalesConBeneficiarios, etc.)
 * - Consolidados los manejadores de filtros para usar cargarDistribucionTotalDesdeAPI()
 * - Optimizada la carga inicial de datos API en paralelo
 * - Implementada lógica reutilizable para manejo de selección TOTAL
 * - Simplificados los imports eliminando dependencias no utilizadas
 * 
 * Los datos locales JSON ahora solo se usan como fallback en caso de error de API.
 */

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
    MultiSelect,
    InfoPopupComponent,
    SplitButtonModule
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

  // Datos para diccionario y siglas
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  // Datos API cargados una vez al inicializar
  private fuentesAsignacionesAPI: any[] = [];
  private departamentosAPI: any[] = [];

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
  selectedDepartamento: any;
  selectedMunicipio: any;

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
  avanceRecaudoPorcentaje: string = '0.0';
  


  // Registro actualmente seleccionado
  registroActual: any = null;

  vigencias: any[] = [];

  showDptos: boolean = false;
  showMpios: boolean = false;

  urlTrimestralReport: string = "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx#funveinticincoseis"
  urlCurrentReport: string = "https://colaboracion.dnp.gov.co/CDT/Inversiones%20y%20finanzas%20pblicas/Documentos%20GFT/Informe%20Trimestral%20de%20funcionamiento%20del%20SGR%20Primer%20trimestre%20bienio%202025-2026.pdf";
  detailReportXlsFile = "reporte-detalle-recaudo-2025.xlsx"
  managementReportXlsFile = "reporte-gestion-financiera-2025.xlsx"
  // URLs de datos locales para fallback (solo se usan si la API falla)
  private readonly funcionamientoDataUrl = "/assets/data/funcionamiento-base.json";
  private readonly funcionamientoDataEntitiesUrl = "/assets/data/funcionamiento-base-entities.json"

  infoPopupContent: string = '';

  // Variables para controlar los popups de diccionario y siglas
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  /**
   * Utility method to handle TOTAL selection exclusion logic
   */
  private manejarSeleccionTOTAL(selecciones: any[], tipo: string): any[] {
    if (!selecciones || selecciones.length === 0) return [];
    
    const totalSeleccionado = selecciones.some((item: any) => item.label === "TOTAL");
    const otrasOpcionesSeleccionadas = selecciones.some((item: any) => item.label !== "TOTAL");

    if (totalSeleccionado && otrasOpcionesSeleccionadas) {
      // Si TOTAL está seleccionado junto con otras opciones, remover TOTAL
      const resultado = selecciones.filter((item: any) => item.label !== "TOTAL");
      console.log(`TOTAL removido automáticamente de ${tipo}. Selecciones finales:`, resultado);
      return resultado;
    } else if (totalSeleccionado && !otrasOpcionesSeleccionadas) {
      // Si solo TOTAL está seleccionado, mantenerlo
      return [{ value: "TOTAL", label: "TOTAL" }];
    } else {
      // Si no hay TOTAL seleccionado, usar la selección tal como viene
      return selecciones;
    }
  }

  /**
   * Configurar visibilidad de controles de departamentos y municipios
   */
  private configurarVisibilidadDepartamentosMunicipios(): void {
    if (this.selectedBeneficiario.length === 1 && this.selectedBeneficiario[0].label.trim() === "Departamentos") {
      this.showDptos = true;
      this.showMpios = false;
      this.cargarEntidadesSiNecesario();
    } else if (this.selectedBeneficiario.length === 1 && this.selectedBeneficiario[0].label.trim() === "Municipios") {
      this.showDptos = true;
      this.showMpios = true;
      this.cargarEntidadesSiNecesario();
    } else {
      this.showDptos = false;
      this.showMpios = false;
    }
  }

  /**
   * Cargar entidades desde archivo local si no están cargadas (fallback)
   */
  private cargarEntidadesSiNecesario(): void {
    if (this.funcionamientoDataEntities.length === 0) {
      fetch(this.funcionamientoDataEntitiesUrl)
        .then(response => response.json())
        .then(data => {
          this.funcionamientoDataEntities = data;
        })
        .catch(error => {
          console.error('Error cargando entidades:', error);
        });
    }
  }

  constructor(
    private sicodisApiService: SicodisApiService
  ) {}

  ngOnInit(): void {
    this.cargarDatos().then(async () => {
      this.generarRegistroTotales();    
      this.cargarDatosTotalesInicial();
      
      if (isPlatformBrowser(this.platformId)) {
        this.initializeCharts();
      }

      // Cargar datos API en paralelo para optimizar rendimiento
      await this.cargarDatosAPIIniciales();
      await this.cargarVigencias();
      
      // Inicializar componentes de UI
      this.inicializarFuentesVacio();
      this.inicializarDepartamentos();
      
      // Cargar datos iniciales desde API
      if (this.selectedVigencia) {
        await this.cargarDistribucionTotalDesdeAPI();
      } else {
        // Fallback a datos locales si no hay vigencia seleccionada
        this.cargarDatosTotalesInicial();
      }
    }).catch(error => {
      console.error('Error al cargar los datos iniciales:', error);
      // Inicializar con datos vacíos si falla la carga
      this.funcionamientoDataConTotales = [];
      this.inicializarFuentesVacio();
    });

    // Cargar datos de diccionario y siglas
    this.cargarSiglasDiccionario();
    
    this.infoPopupContent = `
      <div style="font-size: 10px;">
        <p>Información detallada sobre presupuestos, recaudos y distribución de recursos del Sistema General de Regalías de Colombia, organizada jerárquicamente por diferentes conceptos presupuestales.</p>
        <br>
        <ul>
          <li><strong>Concepto</strong>: Descripción de la categoría presupuestal</li>
          <li><strong>Presupuesto corriente</strong>: Monto presupuestado para ingresos corrientes</li>
          <li><strong>Presupuesto otros</strong>: Montos presupuestados para otras fuentes de ingreso</li>
          <li><strong>Presupuesto total vigente</strong>: Suma total del presupuesto vigente (corriente + otros)</li>
          <li><strong>Recaudo corriente informada</strong>: Valores de recaudo reportados para los ingresos corrientes</li>
          <li><strong>Recaudo total</strong>: Monto total de recaudo</li>
          <li><strong>Disponibilidad inicial</strong>: Recursos disponibles al inicio del periodo</li>
          <li><strong>Excedentes faep fonpet</strong>: Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)</li>
          <li><strong>Mineral sin identificacion de origen</strong>: Ingresos provenientes de minerales cuyo origen no está identificado</li>
          <li><strong>MR</strong>: Categoría específica de ingresos</li>
          <li><strong>Multas</strong>: Ingresos provenientes de sanciones o penalidades</li>
          <li><strong>Reintegros</strong>: Devoluciones o retornos de recursos</li>
          <li><strong>Rendimientos financieros</strong>: Ingresos generados por rendimientos de inversiones</li>
          <li><strong>Porcentaje 1</strong> y <strong>Porcentaje 2</strong>: Indicadores porcentuales que miden proporciones entre valores</li>
        </ul>          
      </div>
      `;

    this.initializeMenuItems();
  }

  menuItems: MenuItem[] = [];

  private initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Históricos',
        command: () => this.clickMenuItem('historico')
      },
      {
        label: 'Últmo Informe',
        
        command: () => this.clickMenuItem('ultimoInforme')
      }
    ];
  }

  clickMenuItem(option: string): void {
    console.log('Opción del menú seleccionada:', option);
    if (option === 'historico') {
      window.open(this.urlTrimestralReport, '_blank');
    }else{
      window.open(this.urlCurrentReport, '_blank');
    }
  }

  /**
   * Cargar los datos de diccionario y siglas usando el servicio
   */
  async cargarSiglasDiccionario(): Promise<void> {
    try {
      const data = await this.sicodisApiService.funcionamientoSiglasDiccionario().toPromise();
      this.siglasDiccionarioData = data || null;
      console.log('Datos de diccionario y siglas cargados desde servicio:', this.siglasDiccionarioData);
    } catch (error) {
      console.error('Error cargando datos de diccionario y siglas desde API:', error);
      this.siglasDiccionarioData = null;
    }
  }

  /**
   * Cargar las vigencias desde el servicio
   */
  async cargarVigencias(): Promise<void> {
    try {
      const vigencias = await this.sicodisApiService.getVigencias().toPromise();
      this.vigencias = vigencias?.map(vigencia => ({
        id: vigencia.id_vigencia,
        label: vigencia.vigencia
      })) || [];
      
      // Seleccionar la primera vigencia por defecto
      if (this.vigencias.length > 0) {
        this.selectedVigencia = this.vigencias[0];
        console.log('Vigencia seleccionada por defecto:', this.selectedVigencia);
      }
      
      console.log('Vigencias cargadas desde API:', this.vigencias);
    } catch (error) {
      console.warn('No se pudieron cargar las vigencias desde la API debido a restricciones CORS en desarrollo:', error);
      console.info('Usando vigencias por defecto. En producción, este endpoint debería funcionar correctamente.');
      
      // Fallback a vigencias por defecto en caso de error CORS
      this.vigencias = [
        { id: 1, label: "2023 - 2024" },
        { id: 2, label: "2024 - 2025" },
        { id: 3, label: "2025 - 2026" }
      ];
      this.selectedVigencia = this.vigencias[2]; // Seleccionar la más reciente por defecto
      console.log('Vigencia seleccionada por defecto (fallback):', this.selectedVigencia);
      
      console.log('Vigencias por defecto configuradas:', this.vigencias);
    }
  }

  /**
   * Generar contenido HTML para el diccionario
   */
  private generarContenidoDiccionario(): string {
    if (!this.siglasDiccionarioData?.diccionario?.data) {
      return '<p>No se pudieron cargar los datos del diccionario.</p>';
    }

    let contenido = '<div style="font-size: 11px;"><table style="width: 100%; border-collapse: collapse;">';
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Concepto</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripción</th></tr></thead>';
    contenido += '<tbody>';

    this.siglasDiccionarioData.diccionario.data.forEach((item: DiccionarioItem) => {
      contenido += `<tr>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.concepto}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
  }

  /**
   * Generar contenido HTML para las siglas
   */
  private generarContenidoSiglas(): string {
    if (!this.siglasDiccionarioData?.siglas?.data) {
      return '<p>No se pudieron cargar los datos de las siglas.</p>';
    }

    let contenido = '<div style="font-size: 11px;"><table style="width: 100%; border-collapse: collapse;">';
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Sigla</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripción</th></tr></thead>';
    contenido += '<tbody>';

    this.siglasDiccionarioData.siglas.data.forEach((item: SiglasItem) => {
      contenido += `<tr>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.siglas}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
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
   * Cargar datos API una sola vez al inicializar (método optimizado)
   */
  private async cargarDatosAPIIniciales(): Promise<void> {
    try {
      // Cargar fuentes desde el endpoint fuentes_asignaciones una sola vez
      this.fuentesAsignacionesAPI = await this.sicodisApiService.getFuentesAsignaciones().toPromise() || [];
      console.log('Fuentes API cargadas:', this.fuentesAsignacionesAPI);
    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
      this.fuentesAsignacionesAPI = [];
    }

    try {
      // Cargar departamentos desde el endpoint departamentos una sola vez
      this.departamentosAPI = await this.sicodisApiService.getDepartamentosFuncionamiento().toPromise() || [];
      console.log('Departamentos API cargados:', this.departamentosAPI);
    } catch (error) {
      console.warn('Error cargando departamentos desde API, se usarán datos locales como fallback:', error);
      this.departamentosAPI = [];
    }
  }

  /**
   * Inicializar las opciones de fuentes sin seleccionar ninguna (método optimizado)
   */
  private inicializarFuentesVacio(): void {
    try {
      if (this.fuentesAsignacionesAPI && this.fuentesAsignacionesAPI.length > 0) {
        // Usar las fuentes de asignaciones del API ya cargadas
        const fuentesOrdenadas = this.fuentesAsignacionesAPI.sort((a, b) => a.fuente.localeCompare(b.fuente));
        this.fuentes = [
          { value: "TOTAL", label: "TOTAL" },
          ...fuentesOrdenadas.map((fuente: any) => ({
            value: fuente.id_fuente,
            label: fuente.fuente
          }))
        ];
        
        console.log('Fuentes inicializadas desde API ya cargada (ordenadas):', this.fuentes);
      } else {
        // Fallback a datos locales si el API no tiene datos
        const fuentesUnicas = getFuentes(this.funcionamientoDataConTotales);
        this.fuentes = [
          { value: "TOTAL", label: "TOTAL" },
          ...fuentesUnicas.sort().map((fuente: any) => ({
            value: fuente, // En datos locales no tenemos ID, usar nombre
            label: fuente
          }))
        ];
        
        console.log('Fuentes inicializadas desde datos locales (fallback, ordenadas):', this.fuentes);
      }
      
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

      // Manejar la exclusión mutua con TOTAL
      this.selectedFuente = this.manejarSeleccionTOTAL(event.value, 'fuente');
      if (this.selectedFuente.length === 1 && this.selectedFuente[0].label === "TOTAL") {
        // Si solo TOTAL está seleccionado, configurar opciones dependientes
        this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        this.cargarDatosTotalesInicial();
        return;
      }

      // Obtener conceptos para todas las fuentes seleccionadas usando API
      this.cargarConceptosDesdeFuentes();
      
      // Llamar a la API para actualizar los datos con los nuevos filtros
      this.cargarDistribucionTotalDesdeAPI();
      
    } catch (error) {
      console.error('Error al cambiar fuente:', error);
      this.conceptos = [];
      this.limpiarDatos();
    }
  }

  /**
   * Cargar conceptos desde las fuentes seleccionadas usando API (optimizado)
   */
  private async cargarConceptosDesdeFuentes(): Promise<void> {
    try {
      // Usar los datos API ya cargados en lugar de hacer nueva llamada
      if (!this.fuentesAsignacionesAPI || this.fuentesAsignacionesAPI.length === 0) {
        this.usarConceptosLocales();
        return;
      }

      // Filtrar las fuentes seleccionadas para obtener sus IDs
      const idsFuentesSeleccionadas: number[] = [];
      this.selectedFuente.forEach((fuenteSeleccionada: any) => {
        if (fuenteSeleccionada.value !== "TOTAL") {
          // Si value es un número, usarlo directamente; si no, buscar por label
          if (typeof fuenteSeleccionada.value === 'number') {
            idsFuentesSeleccionadas.push(fuenteSeleccionada.value);
          } else {
            const fuenteEncontrada = this.fuentesAsignacionesAPI.find(f => f.fuente === fuenteSeleccionada.label);
            if (fuenteEncontrada) {
              idsFuentesSeleccionadas.push(fuenteEncontrada.id_fuente);
            }
          }
        }
      });

      if (idsFuentesSeleccionadas.length === 0) {
        this.conceptos = [{ value: "TOTAL", label: "TOTAL" }];
        return;
      }

      // Llamar al API con los IDs de fuentes separados por comas
      const idsFuentesString = idsFuentesSeleccionadas.join(',');
      const conceptosFuentes = await this.sicodisApiService.getConceptosFuentes(idsFuentesString).toPromise();
      
      if (conceptosFuentes && conceptosFuentes.length > 0) {
        // Usar conceptos del API ordenados alfabéticamente
        const conceptosOrdenados = conceptosFuentes.sort((a, b) => a.concepto.localeCompare(b.concepto));
        
        this.conceptos = [
          { value: "TOTAL", label: "TOTAL" },
          ...conceptosOrdenados.map((concepto: any) => ({
            value: concepto.id_concepto,
            label: concepto.concepto
          }))
        ];
        
        console.log('Conceptos cargados desde API getConceptosFuentes (ordenados)...:', this.conceptos);
      } else {
        // Fallback a datos locales
        this.usarConceptosLocales();
        return;
      }
      
      // Los totales se calculan automáticamente via API cuando se cambian filtros
      
    } catch (error) {
      console.warn('Error cargando conceptos desde API, usando datos locales:', error);
      this.usarConceptosLocales();
    }
  }

  /**
   * Usar conceptos locales como fallback
   */
  private usarConceptosLocales(): void {
    let allConceptos: any[] = [];
    this.selectedFuente.forEach((fuente: any) => {
      if (fuente.label !== "TOTAL") {
        const conceptosUnicos = getConceptosByFuente(this.funcionamientoDataConTotales, fuente.label);
        allConceptos = [...allConceptos, ...conceptosUnicos];
      }
    });

    // Eliminar duplicados y agregar TOTAL
    const conceptosUnicos = [...new Set(allConceptos)];
    this.conceptos = [
      { value: "TOTAL", label: "TOTAL" },
      ...conceptosUnicos.sort().map((concepto: any) => ({
        value: concepto, // En datos locales no tenemos ID, usar nombre
        label: concepto
      }))
    ];
    
    console.log('Conceptos cargados desde datos locales (fallback, ordenados):', this.conceptos);
    
    // Los totales se calculan automáticamente via API cuando se cambian filtros
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

      // Manejar la exclusión mutua con TOTAL
      this.selectedConcepto = this.manejarSeleccionTOTAL(event.value, 'concepto');
      if (this.selectedConcepto.length === 1 && this.selectedConcepto[0].label === "TOTAL") {
        // Si solo TOTAL está seleccionado, configurar opciones dependientes
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        this.cargarDatosTotalesInicial();
        return;
      }

      // Cargar beneficiarios (entidades) desde API usando conceptos seleccionados
      this.cargarBeneficiariosDesdeConcetos();
      
      // Llamar a la API para actualizar los datos con los nuevos filtros
      this.cargarDistribucionTotalDesdeAPI();
      
    } catch (error) {
      console.error('Error al cambiar concepto:', error);
      this.beneficiarios = [];
      this.limpiarDatos();
    }
  }

  /**
   * Cargar beneficiarios (entidades) desde conceptos seleccionados usando API (optimizado)
   */
  private async cargarBeneficiariosDesdeConcetos(): Promise<void> {
    try {
      // Usar los datos API ya cargados en lugar de hacer nueva llamada
      if (!this.fuentesAsignacionesAPI || this.fuentesAsignacionesAPI.length === 0) {
        this.usarBeneficiariosLocales();
        return;
      }

      // Obtener los IDs de las fuentes para poder obtener los conceptos con sus IDs
      const idsFuentesSeleccionadas: number[] = [];
      this.selectedFuente.forEach((fuenteSeleccionada: any) => {
        if (fuenteSeleccionada.label !== "TOTAL") {
          const fuenteEncontrada = this.fuentesAsignacionesAPI.find(f => f.fuente === fuenteSeleccionada.label);
          if (fuenteEncontrada) {
            idsFuentesSeleccionadas.push(fuenteEncontrada.id_fuente);
          }
        }
      });

      if (idsFuentesSeleccionadas.length === 0) {
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        return;
      }

      // Obtener los conceptos con sus IDs
      const idsFuentesString = idsFuentesSeleccionadas.join(',');
      const conceptosFuentes = await this.sicodisApiService.getConceptosFuentes(idsFuentesString).toPromise();
      
      if (!conceptosFuentes || conceptosFuentes.length === 0) {
        this.usarBeneficiariosLocales();
        return;
      }

      // Filtrar los conceptos seleccionados para obtener sus IDs
      const idsConceptosSeleccionados: number[] = [];
      this.selectedConcepto.forEach((conceptoSeleccionado: any) => {
        if (conceptoSeleccionado.value !== "TOTAL") {
          // Si value es un número, usarlo directamente; si no, buscar por label
          if (typeof conceptoSeleccionado.value === 'number') {
            idsConceptosSeleccionados.push(conceptoSeleccionado.value);
          } else {
            const conceptoEncontrado = conceptosFuentes.find((c: any) => c.concepto === conceptoSeleccionado.label);
            if (conceptoEncontrado) {
              idsConceptosSeleccionados.push(conceptoEncontrado.id_concepto);
            }
          }
        }
      });

      if (idsConceptosSeleccionados.length === 0) {
        this.beneficiarios = [{ value: "TOTAL", label: "TOTAL" }];
        return;
      }

      // Cargar entidades para cada concepto seleccionado
      const todasLasEntidades: any[] = [];
      for (const idConcepto of idsConceptosSeleccionados) {
        try {
          const entidadesConcepto = await this.sicodisApiService.getEntidadesConceptos(idConcepto).toPromise();
          if (entidadesConcepto && entidadesConcepto.length > 0) {
            todasLasEntidades.push(...entidadesConcepto);
          }
        } catch (error) {
          console.warn(`Error cargando entidades para concepto ${idConcepto}:`, error);
        }
      }

      if (todasLasEntidades.length > 0) {
        // Usar entidades del API como beneficiarios
        const beneficiariosMap = new Map();
        todasLasEntidades.forEach(e => {
          if (!beneficiariosMap.has(e.beneficiario)) {
            beneficiariosMap.set(e.beneficiario, e.codigo_entidad);
          }
        });
        
        const beneficiariosOrdenados = Array.from(beneficiariosMap.entries())
          .sort((a, b) => a[0].localeCompare(b[0])); // Ordenar por nombre
        
        this.beneficiarios = [
          { value: "TOTAL", label: "TOTAL" },
          ...beneficiariosOrdenados.map(([nombre, codigo]) => ({
            value: codigo,
            label: nombre
          }))
        ];
        
        console.log('Beneficiarios cargados desde API getEntidadesConceptos:', this.beneficiarios);
      } else {
        // Fallback a datos locales
        this.usarBeneficiariosLocales();
        return;
      }
      
      // Los totales se calculan automáticamente via API cuando se cambian filtros
      
    } catch (error) {
      console.warn('Error cargando beneficiarios desde API, usando datos locales:', error);
      this.usarBeneficiariosLocales();
    }
  }

  /**
   * Usar beneficiarios locales como fallback
   */
  private usarBeneficiariosLocales(): void {
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
    this.beneficiarios = [
      { value: "TOTAL", label: "TOTAL" },
      ...beneficiariosUnicos.sort().map((beneficiario: any) => ({
        value: beneficiario, // En datos locales no tenemos ID, usar nombre
        label: beneficiario
      }))
    ];
    
    console.log('Beneficiarios cargados desde datos locales (fallback):', this.beneficiarios);
    
    // Los totales se calculan automáticamente via API cuando se cambian filtros
  }

  /**
   * Inicializar departamentos usando API o fallback local
   */
  private inicializarDepartamentos(): void {
    try {
      if (this.departamentosAPI && this.departamentosAPI.length > 0) {
        // Usar departamentos del API ya cargados
        this.departamentos = this.departamentosAPI
          .map(dpto => ({
            value: dpto.codigo_departamento,
            label: dpto.nombre_departamento
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        
        console.log('Departamentos inicializados desde API (ordenados):', this.departamentos);
      } else {
        // Fallback a datos locales si el API no tiene datos
        this.departamentos = departamentos.map(dpto => ({
          value: dpto.codigo,
          label: dpto.nombre
        })).sort((a, b) => a.label.localeCompare(b.label));
        
        console.log('Departamentos inicializados desde datos locales (fallback, ordenados):', this.departamentos);
      }
    } catch (error) {
      console.error('Error inicializando departamentos:', error);
      // Fallback final a datos locales
      this.departamentos = departamentos.map(dpto => ({
        value: dpto.codigo,
        label: dpto.nombre
      })).sort((a, b) => a.label.localeCompare(b.label));
    }
  }
  
  onDepartamentoChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value, this.selectedDepartamento);
    let codDpto = event.value.value;
    if (event.value.value.length == 2)
     codDpto += "000";

    if (this.selectedBeneficiario.length === 1 && this.selectedBeneficiario[0].label.trim() === "Municipios") {
      // Cargar municipios usando API
      this.cargarMunicipiosPorDepartamento(event.value.value);
    }else{
      // Llamar a la API para actualizar los datos con los nuevos filtros
      this.cargarDistribucionTotalDesdeAPI();
    }

  }

  /**
   * Cargar municipios por departamento usando API con fallback local
   */
  private async cargarMunicipiosPorDepartamento(codigoDepartamento: string): Promise<void> {
    try {
      // Intentar cargar municipios desde API
      const municipiosAPI = await this.sicodisApiService.getMunicipiosPorDepartamento(codigoDepartamento).toPromise();
      
      if (municipiosAPI && municipiosAPI.length > 0) {
        // Usar municipios del API
        this.municipios = municipiosAPI
          .map((mpio: any) => ({
            value: mpio.codigo_municipio,
            label: mpio.nombre_municipio,
            'cod-sicodis': mpio.codigo_municipio
          }))
          .sort((a: any, b: any) => a.label.localeCompare(b.label));
        
        console.log('Municipios cargados desde API (ordenados):', this.municipios);
      } else {
        // Fallback a datos locales
        this.usarMunicipiosLocales(codigoDepartamento);
      }
    } catch (error) {
      console.warn('Error cargando municipios desde API, usando datos locales:', error);
      this.usarMunicipiosLocales(codigoDepartamento);
    }
  }

  /**
   * Usar municipios locales como fallback
   */
  private usarMunicipiosLocales(codigoDepartamento: string): void {
    const codDpto = codigoDepartamento + "000";
    this.municipios = this.funcionamientoDataEntities
      .filter((entity: any) => entity["cod-sicodis"].startsWith(codigoDepartamento) && entity["cod-sicodis"] !== codDpto)
      .map((entity: any) => ({
        value: entity["cod-sicodis"],
        label: entity.nombre || entity["nombre-entidad"] || `Municipio ${entity["cod-sicodis"]}`,
        'cod-sicodis': entity["cod-sicodis"]
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    
    console.log('Municipios cargados desde datos locales (fallback, ordenados):', this.municipios);
  }

  onMunicipioChange(event: MultiSelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);

    // Llamar a la API para actualizar los datos con los nuevos filtros
    this.cargarDistribucionTotalDesdeAPI();
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
        console.log('Sin beneficiarios seleccionados, llamando API con filtros actuales');
        this.selectedBeneficiario = [];
        this.cargarDistribucionTotalDesdeAPI();
        return;
      }

      // CASO 2: Manejo de exclusión mutua con TOTAL
      this.selectedBeneficiario = this.manejarSeleccionTOTAL(event.value, 'beneficiario');
      
      if (this.selectedBeneficiario.length === 1 && this.selectedBeneficiario[0].label === "TOTAL") {
        // Si solo TOTAL está seleccionado, usar datos totales
        this.cargarDatosTotalesInicial();
        return;
      } else {
        // Configurar visibilidad de departamentos y municipios
        this.configurarVisibilidadDepartamentosMunicipios();
      }

      // CASO 3: Múltiples beneficiarios seleccionados (sin TOTAL)
      // Llamar a la API para actualizar los datos con los nuevos filtros
      this.cargarDistribucionTotalDesdeAPI();

    } catch (error) {
      console.error('Error al cambiar beneficiario:', error);
      this.limpiarDatos();
    }
  }

  


  /**
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selectedVigencia = event.value;
    
    // Cargar datos de distribución total desde API basado en la vigencia seleccionada
    this.cargarDistribucionTotalDesdeAPI();
  }

  /**
   * Cargar distribución total desde API basado en los filtros seleccionados
   */
  private async cargarDistribucionTotalDesdeAPI(): Promise<void> {
    try {
      // Construir parámetros para la API
      const params = this.construirParametrosAPI();
      
      console.log('Llamando API getDistribucionTotal con parámetros:', params);
      
      // Llamar al API
      const distribucionTotal = await this.sicodisApiService.getDistribucionTotal(params).toPromise();
      
      if (distribucionTotal && distribucionTotal.length > 0) {
        // Usar datos del API para actualizar la interfaz
        console.log('Datos de distribución total recibidos del API:', distribucionTotal);
        this.actualizarInterfazConDatosAPI(distribucionTotal);
      } else {
        console.warn('No se recibieron datos del API getDistribucionTotal');
        // Limpiar datos si no hay resultados
        this.limpiarDatos();
      }
      
    } catch (error) {
      console.error('Error cargando distribución total desde API:', error);
      // En caso de error, limpiar datos
      this.limpiarDatos();
    }
  }

  /**
   * Construir parámetros para la API getDistribucionTotal basado en filtros seleccionados
   */
  private construirParametrosAPI(): any {
    const params: any = {};
    
    // 1. Vigencia (requerida)
    if (this.selectedVigencia && this.selectedVigencia.id) {
      params.idVigencia = this.selectedVigencia.id;
    } else {
      // Si no hay vigencia seleccionada, usar 0 como se especifica
      params.idVigencia = 0;
    }
    
    // 2. Fuentes (idsFuente separadas por comas)
    if (this.selectedFuente && this.selectedFuente.length > 0 && !this.selectedFuente.some(f => f.value === "TOTAL")) {
      // Obtener IDs de fuentes seleccionadas usando los values
      const idsFuentes: (string | number)[] = [];
      this.selectedFuente.forEach((fuenteSeleccionada: any) => {
        if (fuenteSeleccionada.value !== "TOTAL") {
          idsFuentes.push(fuenteSeleccionada.value);
        }
      });
      
      if (idsFuentes.length > 0) {
        params.idsFuente = idsFuentes.join(',');
      } else {
        params.idsFuente = "0";
      }
    } else {
      params.idsFuente = "0";
    }
    
    // 3. Conceptos (idsConcepto separados por comas)
    if (this.selectedConcepto && this.selectedConcepto.length > 0 && !this.selectedConcepto.some(c => c.value === "TOTAL")) {
      // Obtener IDs de conceptos seleccionados usando los values
      const idsConceptos: (string | number)[] = [];
      this.selectedConcepto.forEach((conceptoSeleccionado: any) => {
        if (conceptoSeleccionado.value !== "TOTAL") {
          idsConceptos.push(conceptoSeleccionado.value);
        }
      });
      
      if (idsConceptos.length > 0) {
        params.idsConcepto = idsConceptos.join(',');
      } else {
        params.idsConcepto = "0";
      }
    } else {
      params.idsConcepto = "0";
    }
    
    // 4. Beneficiarios (idsBeneficiario)
    // Lógica especial para Municipios y Departamentos
    if (this.selectedBeneficiario && this.selectedBeneficiario.length === 1 && 
        this.selectedBeneficiario[0].label.trim() === "Municipios" &&
        this.selectedMunicipio) {
      // Si beneficiario es "Municipios" y hay municipio seleccionado, usar ID del municipio
      params.idsBeneficiario = this.selectedMunicipio.value;
      
    } else if (this.selectedBeneficiario && this.selectedBeneficiario.length === 1 && 
               this.selectedBeneficiario[0].label.trim() === "Departamentos" &&
               this.selectedDepartamento) {
      // Si beneficiario es "Departamentos" y hay departamento seleccionado, usar ID del departamento
      params.idsBeneficiario = this.selectedDepartamento.value;
      
    } else if (this.selectedBeneficiario && this.selectedBeneficiario.length > 0 && !this.selectedBeneficiario.some(b => b.value === "TOTAL")) {
      // Para otros beneficiarios, usar los IDs de beneficiarios seleccionados
      const idsBeneficiarios: (string | number)[] = [];
      this.selectedBeneficiario.forEach((beneficiarioSeleccionado: any) => {
        if (beneficiarioSeleccionado.value !== "TOTAL") {
          idsBeneficiarios.push(beneficiarioSeleccionado.value);
        }
      });
      
      if (idsBeneficiarios.length > 0) {
        params.idsBeneficiario = idsBeneficiarios.join(',');
      } else {
        params.idsBeneficiario = "0";
      }
    } else {
      params.idsBeneficiario = "0";
    }
    
    // 5. Tipo de entidad
    params.tipoEntidad = this.determinarTipoEntidad();
    
    console.log('Parámetros construidos para API:', params);
    return params;
  }

  /**
   * Determinar el tipo de entidad basado en las selecciones actuales
   */
  private determinarTipoEntidad(): string {
    // Si beneficiario es "Departamentos" y se seleccionó un departamento
    if (this.selectedBeneficiario && this.selectedBeneficiario.length === 1 && 
        this.selectedBeneficiario[0].label.trim() === "Departamentos" &&
        this.selectedDepartamento) {
      return "DEPARTAMENTO";
    }
    
    // Si beneficiario es "Municipios" y se seleccionó un municipio
    if (this.selectedBeneficiario && this.selectedBeneficiario.length === 1 && 
        this.selectedBeneficiario[0].label.trim() === "Municipios" &&
        this.selectedMunicipio) {
      return "MUNICIPIO";
    }
    
    // En cualquier otro caso, vacío
    return "";
  }

  /**
   * Actualizar la interfaz con los datos recibidos del API
   */
  private actualizarInterfazConDatosAPI(datosAPI: any[]): void {
    try {
      // Si hay múltiples registros, calcular totales
      let datosConsolidados: any = {};
      
      if (datosAPI.length === 1) {
        // Un solo registro
        datosConsolidados = datosAPI[0];
      } else {
        // Múltiples registros, consolidar
        datosConsolidados = this.consolidarDatosAPI(datosAPI);
      }
      
      // Establecer como registro actual
      this.registroActual = datosConsolidados;
      
      // Actualizar todos los componentes de la interfaz
      this.actualizarDatosDelRegistro();
      
      console.log('Interfaz actualizada con datos del API:', this.registroActual);
      
    } catch (error) {
      console.error('Error actualizando interfaz con datos del API:', error);
    }
  }

  /**
   * Consolidar múltiples registros del API en un solo objeto de totales
   */
  private consolidarDatosAPI(registros: any[]): any {
    const consolidado: any = {
      id: "API_CONSOLIDADO",
      vigencia: this.selectedVigencia?.label || "Vigencia Seleccionada"
    };
    
    // Campos numéricos que se suman
    const camposNumericos = [
      'distribucion_presupuesto_corriente',
      'distribucion_otros', 
      'total_asignado_bienio',
      'disponibilidad_inicial',
      'apropiacion_vigente',
      'recursos_bloqueados',
      'apropiacion_vigente_disponible',
      'iac_mr_saldos_reintegros',
      'iac_corriente',
      'iac_iInformadas',
      'caja_total',
      'cpd',
      'compromisos',
      'pagos',
      'saldo_por_comprometer',
      'caja_disponible',
      'saldo_disponible_a_pagos',
      'saldo_sin_afectacion'
    ];
    
    // Campos porcentuales que se promedian
    const camposPorcentuales = [
      'avance_iac_corriente',
      'pct_ejecucion_a_compromisos'
    ];
    
    // Sumar campos numéricos
    camposNumericos.forEach(campo => {
      consolidado[campo] = registros.reduce((total, registro) => {
        return total + (registro[campo] || 0);
      }, 0);
    });
    
    // Promediar campos porcentuales
    camposPorcentuales.forEach(campo => {
      const valoresValidos = registros
        .map(registro => registro[campo] || 0)
        .filter(valor => valor > 0);
      
      consolidado[campo] = valoresValidos.length > 0 
        ? valoresValidos.reduce((sum, val) => sum + val, 0) / valoresValidos.length 
        : 0;
    });
    
    return consolidado;
  }


  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros y cargando datos totales');
    
    // Limpiar todas las selecciones
    this.selectedVigencia = this.vigencias.length > 0 ? this.vigencias[0] : null;
    this.selectedFuente = [];
    this.selectedConcepto = [];
    this.selectedBeneficiario = [];
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.showDptos = false;
    this.showMpios = false;
    this.municipios = [];
    this.registroActual = null;
    
    // Limpiar datos iniciales
    this.limpiarDatos();

    // Reinicializar las listas con TOTAL como opción
    this.inicializarFuentesVacio();
    
    // Cargar datos desde API con filtros limpios
    this.cargarDistribucionTotalDesdeAPI();
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
        presupuestoAsignado: this.registroActual['total_asignado_bienio'] / 1000000, // En millones
        disponibilidadInicial: convertirANumero(this.registroActual['disponibilidad_inicial']) / 1000000,
        recursosBloquedos: convertirANumero(this.registroActual['recursos_bloqueados']) / 1000000,
        presupuestoVigenteDisponible: convertirANumero(this.registroActual['apropiacion_vigente_disponible']) / 1000000 // En billones
      };

      // Actualizar datos de ejecución
      this.ejecucionData = {
        cdp: convertirANumero(this.registroActual['cdp']) / 1000000,
        compromiso: convertirANumero(this.registroActual['compromisos']) / 1000000,
        pagos: convertirANumero(this.registroActual['pagos']) / 1000000,
        recursoComprometer: convertirANumero(this.registroActual['saldo_sin_afectacion']) / 1000000
      };

      // Actualizar datos de situación de caja
      this.situacionCajaData = {
        disponibilidadInicial: convertirANumero(this.registroActual['disponibilidad_inicial']) / 1000000,
        recaudo: convertirANumero(this.registroActual['iac_corriente']) / 1000000,
        cajaTotal: convertirANumero(this.registroActual['caja_total']) / 1000000,
        cajaDisponible: convertirANumero(this.registroActual['caja_disponible']) / 1000000
      };

      // Actualizar datos de avance de recaudo
      this.avanceRecaudoData = {
        presupuestoCorriente: convertirANumero(this.registroActual['distribucion_presupuesto_corriente']) / 1000000,
        iacCorriente: convertirANumero(this.registroActual['iac_corriente']) / 1000000,
        avance: convertirANumero(this.registroActual['avance_iac_corriente'])
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
      const presupuestoTotal = convertirANumero(this.registroActual['apropiacion_vigente']);
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
      const saldoSinAfectacion = convertirANumero(this.registroActual['saldo_sin_afectacion']) / 1000000; // En millones
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
      let presupuestoDisponible = convertirANumero(this.registroActual['apropiacion_vigente_disponible']) / 1000000; // En millones
            
      let compromisoPorcentaje = compromiso > 0 ? (compromiso / (presupuestoDisponible)) * 100 : 0;
      this.compromisoPorcentaje = compromisoPorcentaje.toFixed(1).replace('.', ',');
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

      let cajaDisponible = convertirANumero(this.registroActual['caja_disponible']) / 1000000; // En millones
      let pagosPorcentaje = pagos > 0 ? ((pagos) / cajaDisponible) * 100 : 0;
      this.avanceRecaudoPorcentaje = pagosPorcentaje.toFixed(1).replace(".", ",");
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
          ctx.fillStyle = '#47454';
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
          position: 'right',
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
        },
        centerText: {
          display: true,
          text: () => this.compromisoPorcentaje + '%'
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
          position: 'right',
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
        },
        centerText: {
          display: true,
          text: () => this.avanceRecaudoPorcentaje + '%'
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