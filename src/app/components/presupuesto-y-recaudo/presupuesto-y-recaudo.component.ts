import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TreeNode, MenuItem } from 'primeng/api';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { departamentos } from '../../data/departamentos';
import { territorialEntities } from '../../data/territorial-entities';
import { map } from 'rxjs/operators';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { TooltipModule } from 'primeng/tooltip';
import { DiccionarioItem, FuncionamientoSiglasDiccionario, SGRFechaActualizacionCorte, SicodisApiService, SiglasItem } from '../../services/sicodis-api.service';
import { MultiSelectModule } from 'primeng/multiselect';
import Chart from 'chart.js/auto';
import { ProgressSpinner } from "primeng/progressspinner";


interface FinancialData {
  presupuesto_total_vigente: number;
  caja_total: number;
  presupuesto_corriente: number;
  caja_corriente_informada: number;
  presupuesto_otros: number;
  caja_otros: number;
}

@Component({
  selector: 'app-presupuesto-y-recaudo',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    CardModule,
    ChartModule,
    TreeTableModule,
    ButtonModule,
    SplitButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    Select,
    FloatLabel,
    InfoPopupComponent,
    TooltipModule,
    NumberFormatPipe,
    MultiSelectModule,
    ProgressSpinner
],
  templateUrl: './presupuesto-y-recaudo.component.html',
  styleUrl: './presupuesto-y-recaudo.component.scss'
})
export class PresupuestoYRecaudoComponent implements OnInit {
  
  // Configuración de columnas responsivas
  //cols: number = 2;
  cardCols: number = 2;
  recaudo_otros: number = 38493545665718.3;

  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';
  
  // Datos financieros
  financialData: FinancialData = {
    presupuesto_total_vigente: 0,
    caja_total: 0,
    presupuesto_corriente: 0,
    caja_corriente_informada: 0,
    presupuesto_otros: 0,
    caja_otros: 0
  };

  // Configuración del gráfico
  chartData: any;
  chartOptions: any;

  // Configuración de gráficos de dona
  donutRecaudoCorrienteData: any;
  donutRecaudoCorrienteOptions: any;
  donutRecaudoOtrosData: any;
  donutRecaudoOtrosOptions: any;

  // Configuración de la tabla
  // treeTableData: TreeNode[] = [];  
  data: TreeNode[] = [];
  treeTableCols: any[] = [];
  selectedNode: TreeNode | null = null;

  // Configuración para split button histórico
  historicMenuItems: MenuItem[] = [];

  // Filtros
  //selectedVigencia: any = { id: 8, label: '2025 - 2026' };
  selectedVigencia: any; // Seleccionar el primer elemento por defecto  
  selectedTipoIngreso: any = { id: 1, label: 'Total' };
  tiposIngreso = [
    { id: 1, label: 'Total' },
    { id: 2, label: 'Corrientes' },
    { id: 3, label: 'Presupuesto Otros' }
  ];
  selectedAsignaciones: any[] = [];
  asignaciones: any[] = [];
  private fuentesAsignacionesAPI: any[] = [];
  vigencia = [
      {
          "id": 1,
          "label": "2025 - 2026"
      }
      // ,
      // {
      //     "id": 2,
      //     "label": "2023 - 2024"
      // },
      // {
      //     "id": 3,
      //     "label": "2021 - 2022"
      // },
      // {
      //     "id": 4,
      //     "label": "2019 - 2020"
      // },
      // {
      //     "id": 5,
      //     "label": "2017 - 2018"
      // },
      // {
      //     "id": 6,
      //     "label": "2015 - 2016"
      // },
      // {
      //     "id": 7,
      //     "label": "2013 - 2014"
      // },
      // {
      //     "id": 8,
      //     "label": "Vigencia 2012"
      // }
  ];
  dptos = departamentos;
  entities = territorialEntities;
  infoPopupContent: string = '';
  
  cols: any[] = [];
  colsA: any[] = [];
  colsB: any[] = [];
  expandedCols: any[] = [];
  hiddenCols: string[] = [
      'rendimientos_financieros',
      'reintegros',
      'excedentes_faep_fonpet',
      'multas',
      'mineral_sin_identificacion_de_origen',
      'mr'
    ];
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [];
  selectedSearchType: any = { id: 1, label: 'General' };
  searchTypes: any[] = [
    { id: 1, label: 'General' },
    { id: 2, label: 'Por departamento' },
    { id: 3, label: 'Por entidad' }
  ];
  detailedData: any[] = [];
  territorialEntitiesDetailUrl = '/assets/data/territorial-entities-detail.json';
  detailedDataUrl = '/assets/data/propuesta-resumen-sgr3.json';
  detailEntitiesFiltered: any[] = [];
  detailEntities: any[] = [];
  selectedDpto: any = { codigo: '-1', nombre: 'Por departamento' };
  selectedEntity: any;
  selectedDetailEntity: any;

  departments: any[] = [];
  departmentSelected: string = '';  
  towns: any[] = [];
  townSelected: string = '';  
  vigencias: any[] = [];
  resumen: any[] = [];

  isLoading = false;

  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  urlSgrInformesRecaudo: string = "https://www.dnp.gov.co/LaEntidad_/subdireccion-general-inversiones-seguimiento-evaluacion/direccion-programacion-inversiones-publicas/Paginas/sistema-general-de-regalias.aspx#veinticincoseis"

  constructor(private breakpointObserver: BreakpointObserver,
              private sicodisApiService: SicodisApiService,
  ) {
    
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(
      map(result => {
        if (result.breakpoints[Breakpoints.XSmall]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Small]) {
          return 1;
        } else if (result.breakpoints[Breakpoints.Medium]) {
          return 2;
        }
        return 2;
      })
    ).subscribe(cols => this.cardCols = cols);

    // Configuración fija para las tarjetas: siempre 2 columnas
    this.cardCols = 2;
    
  }

  ngOnInit():void {
    
  
    this.cargarVigencias();
    this.cargarDepartamentos();
    //this.selectedVigencia = '0'
    this.departmentSelected = '0';



    /// Inicializa en TODOS los municipios
    const municipios = [
                          { codigo: '0', nombre: 'Todos' },
                       ];    

    this.towns = municipios.map(m => ({
      id: m.codigo,
      label: m.nombre
    }));

    this.townSelected = '0';

    this.sicodisApiService.getSGRFechasActualizacionCorteRecaudoIAC().subscribe({
      next: (data: SGRFechaActualizacionCorte []) => {
        if (data && data.length > 0) {
          const registro = data[0];
          this.fechaActualizacion = registro.fecha_actualizacion;
          this.fechaCorteRecaudo = registro.fecha_corte_recaudo;
        }

      },
      error: (err) => console.error('Error cargando fechas', err)
    });    
    
    this.initializeMenuItems();
    this.initializeHistoricMenu();
    this.initializeCharts();
    //this.initializeTreeTableColumns();
    //this.loadFinancialData();
    //this.initializeChart();
//    this.initializeDonutCharts();
    //this.loadTreeTableData();
    this.colsA = [
        { field: 'concepto', header: 'Concepto', width: '32%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Descripción de la categoría presupuestal' },
        { field: 'presupuesto_total_vigente', header: 'Presupuesto Total', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Suma total del presupuesto vigente (corriente + otros)' },
        { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
        { field: 'presupuesto_otros', header: 'Presupuesto Otros', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Montos presupuestados para otras fuentes de ingreso.' },
        { field: 'caja_corriente_informada', header: 'Recaudo <br>Corriente', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de recaudo reportados para los ingresos corrientes' },
        { field: 'caja_otros', header: 'Recaudo <br>Otros', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de recaudo reportados para otros ingresos.' },
        { field: 'caja_total', header: 'Recaudo <br>Total', width: '10%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de recaudo reportados para todos los ingresos.' },
        { field: 'avance_iac_presupuesto', header: 'Avance IAC frente a Presupuesto', width: '7%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Total / Presupuesto Corriente) * 100.' },
      ]
      this.colsB = [
        { field: 'presupuesto_corriente', header: 'Presupuesto Corriente', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto presupuestado para ingresos corrientes' },
        { field: 'caja_corriente_informada', header: 'Recaudo Corriente Informado', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Valores de recaudo reportados para los ingresos corrientes' },
        { field: 'porcentaje_1', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Corriente Informado / Presupuesto Corriente) * 100' },
        { field: 'caja_total', header: 'Recaudo Total', width: '14%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Monto total de recaudo' },
        { field: 'porcentaje_2', header: '%', width: '5%', 'color': '#e4e6e8', 'class': 'col-standar', tooltip: 'Porcentaje de ejecución: (Recaudo Total / Presupuesto Total Vigente) * 100' },
      ]
      this.cols = [
        ...this.colsA
        //...this.colsB
      ];

      // Configurar columnas expandidas que serán mostradas/ocultadas
      this.expandedCols = [
        { field: 'rendimientos_financieros', header: 'Rendimientos Financieros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos generados por rendimientos de inversiones' },
        { field: 'reintegros', header: 'Reintegros', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Devoluciones o retornos de recursos' },
        { field: 'excedentes_faep_fonpet', header: 'Excedentes FAEP FONPET', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Excedentes provenientes del Fondo de Ahorro y Estabilización (FAE) y del Fondo de Pensiones Territoriales (FONPET)' },
        { field: 'multas', header: 'Multas', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de sanciones o penalidades'  },
        { field: 'mineral_sin_identificacion_de_origen', header: 'Mineral Sin Identificación', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Ingresos provenientes de minerales cuyo origen no está identificado' },
        { field: 'mr', header: 'MR', width: '14%', 'color': '#a5cef6', 'class': 'col-expanded', tooltip: 'Categoría específica de ingresos MR (Mayor Recaudo)' }
      ];
      // Initialize selectedVigencia, but loadData and queryData will handle initial table population
      //this.selectedVigencia = this.vigencia.find(v => v.id === 1) || this.vigencia[0];
      this.selectedSearchType = this.searchTypes.find(st => st.id === 1) || this.searchTypes[0];


      // this.loadData().then(() => {
      //   // this.queryData(); // Load initial data with default filters
      //   console.log('Data loaded and ready for querying.');
      // });
        // Cargar datos de diccionario y siglas
      this.cargarSiglasDiccionario();



  }


    // Función para formatear números con separadores de miles
  formatNumber(value: number): string {
    return value.toLocaleString('es-CO');
  }


  /**
   * Cargar los datos de diccionario y siglas usando el servicio
   */
  async cargarSiglasDiccionario(): Promise<void> {
    try {
      const data = await this.sicodisApiService.getSgrSiglasDiccionario().toPromise();
      this.siglasDiccionarioData = data || null;
      //console.log('Datos de diccionario y siglas cargados desde servicio:', this.siglasDiccionarioData);
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
      const vigencias = await this.sicodisApiService.getSgrVigenciasQa().toPromise();
      this.vigencias = vigencias?.map((vigencia: any) => ({
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
   * Cargar datos departamentos desde la API 
   */
  private async cargarDepartamentos(): Promise<void> {
    try {
      const departamentosLista = await this.sicodisApiService.getSgrDepartamentos().toPromise();
      this.departments = departamentosLista?.map((dept: any) => ({
        id: dept.codigo,
        label: dept.nombre
      })) || [];
      
      // Seleccionar la primera vigencia por defecto
      if (this.departments.length > 0) {
        //this.departmentSelected = this.departments[0];
        console.log('Departamento seleccionada por defecto:', this.departmentSelected);
      }
      
      console.log('Departamento cargadas desde API:', this.departments);
      this.loadSgrData();
    } catch (error) {
      console.warn('Error cargando departamentos desde API, se usarán datos locales como fallback:', error);
      this.departments = [];
    }
  }


  onDepartmentChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.departmentSelected = event.value;
    this.loadTownsForDepartment();
  }

    /**
   * Carga los municipios para el departamento seleccionado
   */
  private async loadTownsForDepartment(): Promise<void> {
    if (!this.departmentSelected) {
      //this.towns = [];
      this.townSelected = '0';
      return;
    }
    console.log('Cargando municipios para departamento:', this.departmentSelected);
    const municipiosLista = await this.sicodisApiService.getMunicipiosDepartamentosSgr(this.departmentSelected).toPromise();
    this.towns = municipiosLista?.map((town: any) => ({
       id: town.codigo,
       label: town.nombre
    })) || [];


      // Seleccionar la primera vigencia por defecto
      if (this.towns.length > 0) {
        this.townSelected = this.towns[0].id;
        console.log('Municipio seleccionada por defecto:', this.townSelected);
      }

  }



  private initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Exportar Excel',
        icon: 'pi pi-file-excel',
        command: () => this.exportData('excel')
      },
      {
        label: 'Exportar PDF',
        icon: 'pi pi-file-pdf',
        command: () => this.exportData('pdf')
      }
    ];
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
      //Chart.register(centerTextPlugin);
    }
  }


  loadSgrData(): void {
    this.isLoading = true;
    const selectedYear = parseInt(this.selectedVigencia);
    const idVigencia = this.selectedVigencia.id;
    const idDepto = this.departmentSelected;
    const idMunicipio = this.townSelected;
    let tipoConsulta: string;
    let codigoEntidad: string;
    const municipio = this.towns.find(d => d.id === this.townSelected);

    // Regla para cambiar el tipo consulta
    if (idDepto === '0' && idMunicipio === '0') {
      tipoConsulta = '1';
      codigoEntidad = idMunicipio;
    } else if (idDepto !== '0' && idMunicipio === '0') {
      tipoConsulta = '9';
      codigoEntidad = idDepto;
    } else {
      tipoConsulta = '7';
      codigoEntidad = idMunicipio;
    }


    // --- REGLA PARA CAMBIAR EL TÍTULO ---
    const codigoMunicipio = municipio?.id ?? '';
    const descripcionMunicipio = municipio?.label ?? '';
    



    console.log('Loading base data...');

    this.sicodisApiService
      .getSgrResumenPtoRecaudoQA(
        idVigencia,
        tipoConsulta,
        codigoEntidad
      )
      .subscribe({
        next: (response) => {
          //  AQUÍ sí llegan los datos
          this.detailedData = response;

          // si ya usabas esto con el JSON de archivo, NO lo cambies
          this.data = organizeCategoryData(this.detailedData);

          const resumen = this.detailedData[0];

          this.financialData = {
            presupuesto_total_vigente: resumen.presupuesto_total_vigente,
            caja_total: resumen.caja_total,
            presupuesto_corriente: resumen.presupuesto_corriente,
            caja_corriente_informada: resumen.caja_corriente_informada,
            presupuesto_otros: resumen.presupuesto_otros,
            caja_otros: resumen.caja_otros
          };
          this.initializeChart();
          this.initializeDonutCharts();
          this.isLoading = false;
          console.log('Base data loaded successfully.');
        },
        error: (error) => {
          console.error('Error fetching base data:', error);
          this.detailedData = [];
          this.data = [];
        }
      });

      console.log('Datos cargados...');
  }


  async loadData(): Promise<void> {
    console.log('Loading base data...');
    try {
      const response = await fetch(this.detailedDataUrl);
      this.detailedData = await response.json();
      this.data = organizeCategoryData(this.detailedData);
      console.log('Base data loaded successfully.');      
    } catch (error) {
      console.error('Error fetching base data:', error);
      this.detailedData = []; // Ensure detailedData is an array in case of error      
    }
  }

  private loadFinancialData() {
    // Simulando datos - en un caso real estos vendrían de un servicio
    this.financialData = {
      presupuesto_total_vigente: 64029708093658.3,
      caja_total: 48180173128862.1,
      presupuesto_corriente: 25536162427940,
      caja_corriente_informada: 9686627463144,
      presupuesto_otros: 38493545665718.3,
      caja_otros: 38493545665718
    };
  }

  private initializeChart() {
    this.chartData = {
      labels: ['Total', 'Corriente', 'Otros'],
      datasets: [
        {
          label: 'Presupuesto',
          data: [
            this.financialData.presupuesto_total_vigente,
            this.financialData.presupuesto_corriente,
            this.financialData.presupuesto_otros
          ],
          backgroundColor: '#1e40af', // Azul oscuro para presupuesto
          borderColor: '#1e40af',
          borderWidth: 1,
          order: 2
        },
        {
          label: 'Recaudo',
          data: [
            this.financialData.caja_total,
            this.financialData.caja_corriente_informada,
            this.financialData.caja_otros
          ],
          backgroundColor: '#60a5fa', // Azul claro para caja/recaudo
          borderColor: '#60a5fa',
          borderWidth: 1,
          order: 1
        }
      ]
    };

    // Calcular el valor máximo de los datos para ajustar el eje X
    const allValues = [
      this.financialData.presupuesto_total_vigente,
      this.financialData.caja_total,
      this.financialData.presupuesto_corriente,
      this.financialData.caja_corriente_informada,
      this.financialData.presupuesto_otros,
      this.financialData.caja_otros
    ];
    const maxValue = Math.max(...allValues);
    // Agregar un margen del 10% y redondear hacia arriba para tener un valor limpio
    const maxWithMargin = maxValue * 1.10;
    // Redondear hacia arriba al siguiente múltiplo apropiado
    const orderOfMagnitude = Math.pow(10, Math.floor(Math.log10(maxWithMargin)));
    const roundedMax = Math.ceil(maxWithMargin / orderOfMagnitude) * orderOfMagnitude;

    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          },
        },
        datalabels: {
          display: false
        },
        tooltip: {
          mode: 'index',
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 }).format(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false, // No apiladas
          beginAtZero: true,
          max: roundedMax,
          title: {
            display: false,
            text: 'Cifras en miles de millones de pesos corrientes',
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
              //weight: 'bold'
            }
          },
          ticks: {
            maxTicksLimit: 4,
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            },
            callback: (value: any) => {
              return this.formatCurrency(value);
            }
          }
        },
        y: {
          stacked: true, // No apiladas
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        }
      }
    };
  }


  /**
   * Formatear moneda como en presupuesto-y-recaudo
   */
  // private formatCurrency(value: number): string {
  //   if (value === 0) return '0';
      
  //   const millions = value / 1000000000;
  //   if (millions >= 1) {
  //     return millions.toFixed(1).replace('.', ',') + '';
  //   }
    
  //   return new Intl.NumberFormat('es-CO').format(value);
  // }

private formatCurrency(value: number): string {
  if (!value) return '0';

  const billions = value / 1_000_000_000;

  if (billions >= 1) {
    return new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0
    }).format(billions);
  }

  return new Intl.NumberFormat('es-CO', {
    maximumFractionDigits: 0
  }).format(value);
}  

  private initializeDonutCharts(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    
    // Configuración común para ambos gráficos de dona
    const commonDonutOptions = {
      cutout: '60%',    
      rotation: -90,
      circumference: 180,
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            },
            color: '#374151'
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              const formatted = this.formatMillions2(value);
              return `${label}: ${formatted}`;
            }
          },
          xAlign: 'left',
          yAlign: 'bottom'
        },
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: '#BBBBBB',
          hoverBorderWidth: 3
        }
      }      
    };

    // Gráfico 1: Avance recaudo corriente
    this.donutRecaudoCorrienteData = {
      labels: ['Recaudo', 'Presupuesto'],
      datasets: [{
        data: [
          this.financialData.caja_corriente_informada,
          this.financialData.presupuesto_corriente - this.financialData.caja_corriente_informada
        ],
        backgroundColor: ['#3b82f6', '#e2e8f0'],
        borderColor: ['#1e40af', '#cbd5e1'],
        borderWidth: 2
      }]
    };

    this.donutRecaudoCorrienteOptions = {
      ...commonDonutOptions,
      plugins: {
        ...commonDonutOptions.plugins,
        centerText: {
          display: true,
          text: () => {
            console.log('Calculating center text for Recaudo Corriente');
            const recaudo = this.financialData.caja_corriente_informada;
            const presupuesto = this.financialData.presupuesto_corriente;
            if (presupuesto === 0) return '0.00%';
            const percentage = (recaudo / presupuesto * 100);
            return percentage.toFixed(2).replace('.', ',') + '%';
          }
        },
        datalabels: {
        display: false
      },      
      }
    };

    // Gráfico 2: Avance recaudo otros
    const recaudoOtros = this.financialData.caja_total - this.financialData.caja_corriente_informada;
    
    this.donutRecaudoOtrosData = {
      labels: ['Recaudo', 'Presupuesto'],
      datasets: [{
        data: [
          recaudoOtros,
          this.financialData.presupuesto_otros - recaudoOtros
        ],
        backgroundColor: ['#10b981', '#e2e8f0'],
        borderColor: ['#059669', '#cbd5e1'],
        borderWidth: 2
      }]
    };

    this.donutRecaudoOtrosOptions = {
      ...commonDonutOptions,
      plugins: {
        ...commonDonutOptions.plugins,
        centerText: {
          display: true,
          text: () => {
            const recaudo = this.financialData.caja_total - this.financialData.caja_corriente_informada;
            const presupuesto = this.financialData.presupuesto_otros;
            if (presupuesto === 0) return '0.00%';
            const percentage = Math.min((recaudo / presupuesto) * 100, 100);
            return percentage.toFixed(2).replace('.', ',') + '%';
          }
        },
        datalabels: {
        display: false
      },      
      }
    };
  }


  updateSelectedSearchType(event: any) {
    console.log('Selected search type:', event.value);
    this.selectedSearchType = event.value; // event.value already contains the selected object {id, label}

    // Reset dependent filters
    this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' };
    this.selectedEntity = undefined; // Or a default object like { codigo: '-1', dpto: 'Por entidad' } if your HTML expects it
    this.selectedDetailEntity = undefined;
    this.detailEntitiesFiltered = [];

    // Do not automatically query data here, user will click "Consultar"
    // this.queryData();
  }

  updateSelectedDpto(event: any) {
    console.log('Selected department:', event.value);
    this.selectedDpto = event.value;
    // Do not automatically query data here
    // this.queryData();
  }

  updateSelectedEntity(event: any) {
    console.log('Selected entity:', event.value);
    this.selectedEntity = event.value;
    this.selectedDetailEntity = undefined; // Reset detail entity when main entity changes
    this.detailEntitiesFiltered = [];

    if (this.selectedEntity && this.selectedEntity.codigo !== '-1') {
      // Fetch detail entities if a valid entity is selected
      if (this.detailEntities.length === 0) { // Assuming detailEntities holds all possible detail entities
        fetch(this.territorialEntitiesDetailUrl)
          .then(response => response.json())
          .then(data => {
            this.detailEntities = data;
            this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);

            console.log('Detail entities filtered:', this.detailEntitiesFiltered);
          })
          .catch(error => console.error('Error fetching detail entities:', error));
      } else {
        this.detailEntitiesFiltered = this.detailEntities.filter((entity: any) => entity.codPadre === this.selectedEntity.codigo);
        
      }
    }
    // Do not automatically query data here
    // this.queryData();
  }

  updateSelectedDetailEntity(event: any) {
    console.log('Selected detail entity:', event.value);
    this.selectedDetailEntity = event.value;
    // Do not automatically query data here
    // this.queryData();
  }

  applyFilters() {
    console.log('Applying filters...');
    console.log('Selected filters:', {
      vigencia: this.selectedVigencia,
      tipoIngreso: this.selectedTipoIngreso,
      asignaciones: this.selectedAsignaciones,
      searchType: this.selectedSearchType,
      dpto: this.selectedDpto,
      entity: this.selectedEntity,
      detailEntity: this.selectedDetailEntity
    });
    
    // Call the query data method with current filters
    //this.queryData();
    this.loadSgrData();
  }

  clearFilters() {
    console.log('Clearing filters...');
    this.selectedVigencia = this.vigencia[0]; // Reset to first vigencia
    this.selectedTipoIngreso = this.tiposIngreso[0]; // Reset to first tipo ingreso
    this.selectedAsignaciones = []; // Reset asignaciones selection
    this.selectedSearchType = this.searchTypes[0]; // Reset to first search type
    this.selectedDpto = { codigo: '-1', nombre: 'Por departamento' }; // Reset to default department
    this.selectedEntity = undefined; // Reset entity selection
    this.selectedDetailEntity = undefined; // Reset detail entity selection
    this.detailEntitiesFiltered = []; // Clear filtered detail entities 
    this.data = organizeCategoryData(this.detailedData)
  }

  /**
   * Formats a number to a localized format with proper Spanish thousands separators.
   * 
   * @param {number} num - The number to format
   * @param {Object} [options] - Formatting options
   * @param {boolean} [options.includeSymbol=true] - Include currency symbol
   * @param {number} [options.decimalPlaces=1] - Decimal places to display
   * @returns {string} Formatted number string
   */
  formatMillions2(
    num: number,
    options: {
      includeSymbol?: boolean;
      decimalPlaces?: number;      
    } = {}
  ) {
    // Default options
    const {
      includeSymbol = false,
      decimalPlaces = 0,      
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
    
    return result;
  }

  toggleColumns() {
      this.isExpanded = !this.isExpanded;

      if (this.isExpanded) {
        // Mostrar todas las columnas
        this.cols = [
          ...this.colsA,
          ...this.expandedCols,
          ...this.colsB
        ];
        const listWidths = [16,8,8,8,6,6,6,6,6,6,9,3,8,4];
        this.cols.forEach((col, index) => {
          col.width = listWidths[index] + '%';
        });
        
      } else {
        // Ocultar las columnas expandidas
        this.cols = this.cols.filter(col => !this.hiddenCols.includes(col.field));
      }
    }

  isHiddenColumn(field: string): boolean {
    return this.hiddenCols.includes(field);
  }

  exportData(format: 'excel' | 'pdf') {
    console.log(`Exportando datos en formato: ${format}`);
    // Implementar lógica de exportación
  }

  async queryData() {
    console.log('Consultando datos...');
    this.queryDataFake(); // Usar datos falsos para pruebas
    //await this.testImproved();
    // Implementar lógica de consulta
    
    
  }

  generateRandomPercentage(min: number, max: number): number   {
      const randomValue = Math.random() * (max - min) + min;
      return randomValue;
  }

  queryDataFake() {
    console.log('Consultando datos (falso)...');
    const randomNumber = this.generateRandomPercentage(2.5, 4.5) / 100;    
    let filteredData = this.detailedData.map((row: any) => {
      const newRow = { ...row };
      newRow.caja_corriente_informada = Number(newRow.caja_corriente_informada) * randomNumber;
      newRow.caja_total = Number(newRow.caja_total) * randomNumber;
      newRow.disponibilidad_inicial = Number(newRow.disponibilidad_inicial) * randomNumber;
      newRow.excedentes_faep_fonpet = Number(newRow.excedentes_faep_fonpet) * randomNumber;
      newRow.mr = Number(newRow.mr) * randomNumber;
      newRow.multas = Number(newRow.multas) * randomNumber;
      newRow.presupuesto_corriente = Number(newRow.presupuesto_corriente) * randomNumber;
      newRow.presupuesto_otros = Number(newRow.presupuesto_otros) * randomNumber;
      newRow.presupuesto_total_vigente = Number(newRow.presupuesto_total_vigente) * randomNumber;
      newRow.reintegros = Number(newRow.reintegros) * randomNumber;
      newRow.rendimientos_financieros = Number(newRow.rendimientos_financieros) * randomNumber;      
      if (row.concepto === 'TOTAL') {
        this.financialData = {
          presupuesto_total_vigente: newRow.presupuesto_total_vigente,
          caja_total: newRow.caja_total,
          presupuesto_corriente: newRow.presupuesto_corriente,
          caja_corriente_informada: newRow.caja_corriente_informada,
          presupuesto_otros: newRow.presupuesto_otros,
          caja_otros: newRow.caja_otros
        };
      }
      return newRow;
    });
    this.data = organizeCategoryData(filteredData);
    this.initializeChart();
    this.initializeDonutCharts();

  }
  

  formatPercentage(value: any): string {
      if (value === null || value === undefined) return '';

      // Convertir a número si es string
      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      // Formatear como porcentaje
      return (numValue * 100).toFixed(2) + '%';
    }

  /**
   * Inicializar menú para split button histórico
   */
  initializeHistoricMenu(): void {
    this.historicMenuItems = [
      {
        label: 'Histórico',
        icon: 'pi pi-calendar',
        command: () => {
          this.showHistoric();
        }
      }
    ];
  }

  /**
   * Manejar click principal del split button histórico
   */
  handleHistoricClick(): void {
    console.log('Histórico button clicked');
    this.showHistoric();
  }

  /**
   * Mostrar histórico
   */
  private showHistoric(): void {
    console.log('Mostrando histórico...');
    // Aquí se implementaría la lógica para mostrar datos históricos
    //alert('Funcionalidad de histórico pendiente de implementación');
    window.open(this.urlSgrInformesRecaudo, '_blank');
  }

    /**
   * Descargar datos en Excel
   */
  downloadExcel(): void {
    console.log('Descargando Excel con datos de recaudo directas:');
    // Aquí se implementaría la lógica de descarga del Excel
    this.descargarDatosPtoRecaudo();
  }

    /**
   * Descarga del archivo excel de acuerdo con los datos del filtro
   */
  private async descargarDatosPtoRecaudo(): Promise<void> {
    try {
     
        this.isLoading = true;
        const selectedYear = parseInt(this.selectedVigencia);
        const codigoSelectedDepartamento = this.departments.find(d => d.id === this.departmentSelected);
        const codigoSelectedMunicipio = this.towns.find(d => d.id === this.townSelected);

        const codigoSelectedNombreDepartamento = codigoSelectedDepartamento.label;
        const codigoSelectedNombreMunicipio = codigoSelectedMunicipio.label;

        const idVigencia = this.selectedVigencia.id;
        const idDepto = this.departmentSelected;
        const idMunicipio = this.townSelected;
        let tipoConsulta: string;
        let codigoEntidad: string;
        const departamento = this.departmentSelected;
        const municipio = this.towns.find(d => d.id === this.townSelected);
              

        // Regla para cambiar el tipo consulta
        if (idDepto === '0' && idMunicipio === '0') {
          tipoConsulta = '1';
          codigoEntidad = idMunicipio;
        } else if (idDepto !== '0' && idMunicipio === '0') {
          tipoConsulta = '9';
          codigoEntidad = idDepto;
        } else {
          tipoConsulta = '7';
          codigoEntidad = idMunicipio;
        }


        // --- REGLA PARA CAMBIAR EL TÍTULO ---
        const codigoMunicipio = municipio?.id ?? '';
        const descripcionMunicipio = municipio?.label ?? '';


      const archivo: Blob | undefined = await this.sicodisApiService.getSgrDescargaResumenPtoRecaudoQA( idVigencia
                                                                                                      , tipoConsulta
                                                                                                      , codigoEntidad
                                                                                                      , this.selectedVigencia.label
                                                                                                      , codigoSelectedNombreDepartamento
                                                                                                      , codigoSelectedNombreMunicipio
                                                                                                      , this.fechaActualizacion
                                                                                                      , this.fechaCorteRecaudo).toPromise();

      // Verificamos que sí tengamos archivo
      if (!archivo) {
        console.warn('No se recibió ningún archivo desde el servicio');
        return;
      }


      // Forzar tipo MIME correcto para Excel
      const excelBlob = new Blob([archivo], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const arrayBuffer = await excelBlob.arrayBuffer();
      console.log('Tamaño de archivo:', arrayBuffer.byteLength);

      // Crear enlace temporal para descargar
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;

      const nombreArchivo = `ResumenPresupuestovsRecaudo.xlsx`;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('Archivo descargado exitosamente');
      this.isLoading = false;



    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
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
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Id </th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Concepto</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripción</th></tr></thead>';
    contenido += '<tbody>';

    this.siglasDiccionarioData.diccionario.data.forEach((item: DiccionarioItem) => {
      contenido += `<tr>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 100;"><strong>${item.id_concepto}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.concepto}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
  }


  private generarContenidoSiglas(): string {
    if (!this.siglasDiccionarioData?.siglas?.data) {
      return '<p>No se pudieron cargar los datos de las siglas.</p>';
    }

    let contenido = '<div style="font-size: 11px;"><table style="width: 100%; border-collapse: collapse;">';
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Sigla</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripción</th></tr></thead>';
    contenido += '<tbody>';

    this.siglasDiccionarioData.siglas.data.forEach((item: SiglasItem) => {
      contenido += `<tr>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.sigla}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
  }  


  /**
   * Cargar asignaciones desde API
   */
  private async cargarAsignaciones(): Promise<void> {
    try {
      const idVigencia = parseInt(this.selectedVigencia.value);
      
      this.fuentesAsignacionesAPI = await this.sicodisApiService.getFuentesAsignaciones(idVigencia).toPromise() || [];
      console.log('Fuentes API cargadas:', this.fuentesAsignacionesAPI);
      this.inicializarAsignaciones();
    } catch (error) {
      console.warn('Error cargando fuentes desde API:', error);
      this.fuentesAsignacionesAPI = [];
      this.asignaciones = [];
    }
  }

  /**
   * Inicializar las opciones de asignaciones
   */
  private inicializarAsignaciones(): void {
    try {
      if (this.fuentesAsignacionesAPI && this.fuentesAsignacionesAPI.length > 0) {
        // Usar las fuentes de asignaciones del API ya cargadas
        const fuentesOrdenadas = this.fuentesAsignacionesAPI.sort((a, b) => a.fuente.localeCompare(b.fuente));
        this.asignaciones = [
          ...fuentesOrdenadas.map((fuente: any) => ({
            value: fuente.id_fuente,
            label: fuente.fuente
          }))
        ];
        
        console.log('Asignaciones inicializadas desde API (ordenadas):', this.asignaciones);
      } else {
        console.warn('No hay fuentes disponibles desde la API');
        this.asignaciones = [];
      }
    } catch (error) {
      console.error('Error inicializando asignaciones:', error);
      this.asignaciones = [];
    }
  }

  /**
   * Evento cuando cambian las asignaciones seleccionadas
   */
  onAsignacionesChange(event: any): void {
    console.log('Asignaciones seleccionadas:', event.value);
    this.selectedAsignaciones = event.value || [];
    
    // Aquí podrías agregar lógica adicional si es necesaria
    // como filtrar otros datos basados en las asignaciones seleccionadas
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
}