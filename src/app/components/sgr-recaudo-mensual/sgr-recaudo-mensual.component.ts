import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { DiccionarioItem, FuncionamientoSiglasDiccionario, SGRFechaActualizacionCorte, SgrRecaudoItem, SicodisApiService, SiglasItem } from '../../services/sicodis-api.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sgr-recaudo-mensual',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DatePicker,
    FloatLabel,
    FormsModule,
    ChartModule,
    TableModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './sgr-recaudo-mensual.component.html',
  styleUrl: './sgr-recaudo-mensual.component.scss'
})
export class SgrRecaudoMensualComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Propiedades para popups de Diccionario y Siglas
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  // Estados de visualización
  showRecaudoView: boolean = true;
  showTipoRecursoView: boolean = false;

  // Filtros de período usando DatePicker
  selectedPeriodoDesde: Date | null = null;
  selectedPeriodoHasta: Date | null = null;

  // Configuración de gráficos - Vista Recaudo
  miningChartData: any;
  miningChartOptions: any;
  hydrocarbonChartData: any;
  hydrocarbonChartOptions: any;

  // Configuración de gráficos - Vista Tipo de Recurso
  conceptChartData: any;
  conceptChartOptions: any;
  trendChartData: any;
  trendChartOptions: any;
  
  minDate: Date = new Date(2025, 0, 1); // Enero 2025
  maxDate: Date = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1); // Mes anterior al actual


  // Configuración de tabla (vista Recaudo)
tableData: any[] = [];
tableDataBase: any[] =
[
  {
    mes: "Enero de 2025",
    pbc_mineria: 507182857652.2,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 1225343882351.01,
    recaudo_mineria: 664831650395.21,
    recaudo_hidrocarburos: 543822025382.50,
    recaudo_total: 1225902838995.78,
    variacion_mineria: 34.4842009784597,
    variacion_hidrocarburos: -24.2757533924131,
    variacion_total: 0.0456163084356022,
  },
  {
    mes: "Febrero de 2025",
    pbc_mineria: 253591429312.2,
    pbc_hidrocarburos: 648661358247.37,
    pbc_total: 902252787559.57,
    recaudo_mineria: 186885011253.2,
    recaudo_hidrocarburos: 575748522787.45,
    recaudo_total: 781563763949.04,
    variacion_mineria: -18.8398276235874,
    variacion_hidrocarburos: -11.2405085539432,
    variacion_total: -13.3764090590367,
  },
  {
    mes: "Marzo de 2025",
    pbc_mineria: 211326191168.2,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 929487215867.01,
    recaudo_mineria: 175163497960.92,
    recaudo_hidrocarburos: 861254012523.80,
    recaudo_total: 1040790877380.12,
    variacion_mineria: -15.0427763525904,
    variacion_hidrocarburos: 19.9249169620423,
    variacion_total: 11.9747382872058,
  },
  {
    mes: "Abril de 2025",
    pbc_mineria: 422652382500.2,
    pbc_hidrocarburos: 694994469215,
    pbc_total: 1117646851715.2,
    recaudo_mineria: 434384392675.03,
    recaudo_hidrocarburos: 512559858421.90,
    recaudo_total: 953372566476.46,
    variacion_mineria: 4.2967522025861,
    variacion_hidrocarburos: -26.2497931816869,
    variacion_total: -14.6982282450522,
  },
  {
    mes: "Mayo de 2025",
    pbc_mineria: 253591429312.2,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 971752454011.01,
    recaudo_mineria: 512564751554.5,
    recaudo_hidrocarburos: 569432496349.85,
    recaudo_total: 1091531197225.13,
    variacion_mineria: 105.881840049301,
    variacion_hidrocarburos: -20.7096351979468,
    variacion_total: 12.3260551305758,
  },
  {
    mes: "Junio de 2025",
    pbc_mineria: 169060952916,
    pbc_hidrocarburos: 694994469215,
    pbc_total: 864055422131,
    recaudo_mineria: 160940102487.33,
    recaudo_hidrocarburos: 675696129037.60,
    recaudo_total: 838074185436.90,
    variacion_mineria: -3.9529509336319,
    variacion_hidrocarburos: -2.77676169124016,
    variacion_total: -3.00689470011345,
  },
  {
    mes: "Julio de 2025",
    pbc_mineria: 464917620452,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 1183078645150.81,
    recaudo_mineria: 425752002588.97,
    recaudo_hidrocarburos: 487125727411.30,
    recaudo_total: 915319620739.12,
    variacion_mineria: -7.89897511057478,
    variacion_hidrocarburos: -32.1704032023186,
    variacion_total: -22.6323943475083,
  },
  {
    mes: "Agosto de 2025",
    pbc_mineria: 422652382500,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 1140813407198.81,
    recaudo_mineria: 236193100047.13,
    recaudo_hidrocarburos: 516581168859.30,
    recaudo_total: 753187527583.98,
    variacion_mineria: -44.018685680855,
    variacion_hidrocarburos: -28.0688938701527,
    variacion_total: -33.9780263072661,
  },
  {
    mes: "Septiembre de 2025",
    pbc_mineria: 169060952916,
    pbc_hidrocarburos: 694994469215,
    pbc_total: 864055422131,
    recaudo_mineria: 171455897654.19,
    recaudo_hidrocarburos: 694193464544.95,
    recaudo_total: 870938158245.43,
    variacion_mineria: 4.54495296042592,
    variacion_hidrocarburos: -0.115253387693112,
    variacion_total: 0.796561879960815,
  },
  {
    mes: "Octubre de 2025",
    pbc_mineria: 507182858648,
    pbc_hidrocarburos: 718161024698.81,
    pbc_total: 1225343883346.81,
    recaudo_mineria: 619827900327.6,
    recaudo_hidrocarburos: 527252664807.15,
    recaudo_total: 1215946727111.77,
    variacion_mineria: 35.788118735021,
    variacion_hidrocarburos: -26.5829463485191,
    variacion_total: -0.766899509823591,
  },
  {
    mes: "Noviembre de 2025",
    pbc_mineria: 464917620452,
    pbc_hidrocarburos: 694994469215,
    pbc_total: 1159912089667,
    recaudo_mineria: 172406309231.12,
    recaudo_hidrocarburos: 475749145202,
    recaudo_total: 650508555962,
    variacion_mineria: -62.41,
    variacion_hidrocarburos: -31.55,
    variacion_total: -43.92,
  },  
  {
    mes: "Diciembre de 2025",
    pbc_mineria: 380387144060,
    pbc_hidrocarburos: 718161024699,
    pbc_total: 1098548168759,
    recaudo_mineria: 237282886640.16,
    recaudo_hidrocarburos: 588626745061,
    recaudo_total: 827582672939,
    variacion_mineria: -37.18,
    variacion_hidrocarburos: -18.04,
    variacion_total: -24.67,
  },    
];

  tableColumns: any[] = [];

  // Configuración de tabla comportamiento (vista Tipo de Recurso)
  behaviorTableData: any[] = [];
  behaviorTableColumns: any[] = [];

  // Configuración de tabla detallada (vista Tipo de Recurso)
  detailedTableData: any[] = [];


detailedTableDataBase: any[] = [

 {
  periodo: "Enero de 2025",
  rc_inversion_aforada: 1114553413835.74,
  rc_ahorro: 55165627754.18,
  rc_administracion: 36777085169.88,
  rc_no_aforado: 19406712235.98,
  rc_total: 1225902838995.7798,
  total_pbc: 1225343882351.01,
  avance: 1.0004561630843558,
  ro_inversion: 293997375070,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 293997375070,
  total_distribuido: 1519900214065.7798
 },
 {
  periodo: "Febrero de 2025",
  rc_inversion_aforada: 703007556076.26,
  rc_ahorro: 35170369377.64,
  rc_administracion: 23446912918.47,
  rc_no_aforado: 19938925576.67,
  rc_total: 781563763949.04,
  total_pbc: 902252787559.5701,
  avance: 0.8662359094096324,
  ro_inversion: 0,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 0,
  total_distribuido: 781563763949.04
 },
 {
  periodo: "Marzo de 2025",
  rc_inversion_aforada: 955233680976.37,
  rc_ahorro: 46835589482.08,
  rc_administracion: 31223726321.4,
  rc_no_aforado: 7497880600.27,
  rc_total: 1040790877380.12,
  total_pbc: 929487215867.01,
  avance: 1.1197473828720579,
  ro_inversion: 3618312830497,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 3618312830497,
  total_distribuido: 4659103707877.12
 },
 {
  periodo: "Abril de 2025",
  rc_inversion_aforada: 873398583357.77,
  rc_ahorro: 42901765491.4,
  rc_administracion: 28601176994.28,
  rc_no_aforado: 8471040633.01,
  rc_total: 953372566476.4601,
  total_pbc: 1117646851715.2,
  avance: 0.8530177175494783,
  ro_inversion: 394804644941.59,
  ro_ahorro: 315990852796,
  ro_administracion: 4738134,
  ro_total: 710800235871.5901,
  total_distribuido: 1664172802348.0503
 },
 {
  periodo: "Mayo de 2025",
  rc_inversion_aforada: 997690963296.71,
  rc_ahorro: 49118903875.1,
  rc_administracion: 32745935916.75,
  rc_no_aforado: 11975394136.57,
  rc_total: 1091531197225.1299,
  total_pbc: 971752454011.01,
  avance: 1.1232605513057574,
  ro_inversion: 70471254694,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 70471254694,
  total_distribuido: 1162002451919.13
 },
 {
  periodo: "Junio de 2025",
  rc_inversion_aforada: 771863851558.67,
  rc_ahorro: 37713338344.58,
  rc_administracion: 25142225563.11,
  rc_no_aforado: 3354769970.54,
  rc_total: 838074185436.9,
  total_pbc: 864055422131,
  avance: 0.9699310529988655,
  ro_inversion: 0,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 0,
  total_distribuido: 838074185436.9
 },
 {
  periodo: "Julio de 2025",
  rc_inversion_aforada: 841997430050.15,
  rc_ahorro: 41189382933.28,
  rc_administracion: 27459588622.17,
  rc_no_aforado: 4673219133.52,
  rc_total: 915319620739.1201,
  total_pbc: 1183078645150.81,
  avance: 0.7736760565249168,
  ro_inversion: 1311167428,
  ro_ahorro: 0,
  ro_administracion: -1311167428,
  ro_total: 0,
  total_distribuido: 915319620739.1201
 },
 {
  periodo: "Agosto de 2025",
  rc_inversion_aforada: 694076570134.94,
  rc_ahorro: 33893438741.18,
  rc_administracion: 22595625827.55,
  rc_no_aforado: 2621892880.31,
  rc_total: 753187527583.9801,
  total_pbc: 1140813407198.81,
  avance: 0.6602197369273394,
  ro_inversion: 1081295637107,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 1081295637107,
  total_distribuido: 1834483164690.98
 },
 {
  periodo: "Septiembre de 2025",
  rc_inversion_aforada: 798582058348.1,
  rc_ahorro: 39192217121.06,
  rc_administracion: 26128144747.38,
  rc_no_aforado: 7035738028.89,
  rc_total: 870938158245.4299,
  total_pbc: 864055422131,
  avance: 1.007965618799608,
  ro_inversion: 0,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 0,
  total_distribuido: 870938158245.4299
 },
 {
  periodo: "Octubre de 2025",
  rc_inversion_aforada: 1053500369754.46,
  rc_ahorro: 54717602719.84,
  rc_administracion: 36478401813.36,
  rc_no_aforado: 71250352824.11,
  rc_total: 1215946727111.7703,
  total_pbc: 1225343883346.81,
  avance: 0.9923310049017643,
  ro_inversion: 0,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 0,
  total_distribuido: 1215946727111.7703
 }
 ,
 {
  periodo: "Noviembre de 2025",
  rc_inversion_aforada: 595396758614.94,
  rc_ahorro: 29272885018.34,
  rc_administracion: 19515256678.89,
  rc_no_aforado: 6323655650.47,
  rc_total: 650508555962.64,
  total_pbc: 1159912089667,
  avance: 0.9923310049017643,
  ro_inversion: 0,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 0,
  total_distribuido: 650508555962.64
 }
 ,
 {
  periodo: "Diciembre de 2025",
  rc_inversion_aforada: 755547599732.32,
  rc_ahorro: 37241220281.82,
  rc_administracion: 24827480188.17,
  rc_no_aforado: -47986605897.76,
  rc_total: 769629694304.55,
  total_pbc: 1098548168758.76,
  avance: 0,
  ro_inversion: 57952978634,
  ro_ahorro: 0,
  ro_administracion: 0,
  ro_total: 57952978634,
  total_distribuido: 827582672938.55
 }, 

 {
  periodo: "Total",
  rc_inversion_aforada: 10154848835736.3,
  rc_ahorro: 502412341140.16,
  rc_administracion: 334941560760.06,
  rc_no_aforado: 114562975773.71,
  rc_total: 10337136019105.60,
  total_pbc: 11583742061130,
  avance: 9.366841194373777,
  ro_inversion: 5460192909737.59,
  ro_ahorro: 315990852796,
  ro_administracion: -1306429294,
  ro_total: 5832830311874,
  total_distribuido: 16112013352345.6
 }
]  
;
  


detailedTableColumns: any[] = [];


  

constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Recaudo Mensual' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.tableData = [...this.tableDataBase];
    this.detailedTableData = [...this.detailedTableDataBase];


    this.setDefaultPeriods();
    this.initializeCharts();
    this.initializeTable();
    this.initializeBehaviorTable();
    this.initializeDetailedTable();
        // Cargar datos de diccionario y siglas
    this.cargarSiglasDiccionario();    
  }

  /**
   * Establecer períodos por defecto para Month Picker
   */
  private setDefaultPeriods(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // getMonth() returns 0-11
    
    // Período desde: enero del año actual
    this.selectedPeriodoDesde = new Date(currentYear-1, 0); // Enero = mes 0
    
    // Período hasta: mes actual del año actual
    this.selectedPeriodoHasta = new Date(currentYear, currentMonth-1);
  }

  /**
   * Mostrar vista de Recaudo
   */
  showRecaudo(): void {
    this.showRecaudoView = true;
    this.showTipoRecursoView = false;
  }

  /**
   * Mostrar vista de Tipo de recurso
   */
  showTipoRecurso(): void {
    this.showRecaudoView = false;
    this.showTipoRecursoView = true;
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    console.log('Aplicando filtros...', {
      desde: this.selectedPeriodoDesde,
      hasta: this.selectedPeriodoHasta,
      vista: this.showRecaudoView ? 'Recaudo' : 'Tipo de Recurso'
    });
    
    // Aquí se puede agregar lógica para actualizar los gráficos basado en el rango de fechas
    this.updateChartsData();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.setDefaultPeriods();
    this.updateChartsData();
  }

  /**
   * Actualizar datos de gráficos basado en el rango de fechas seleccionado
   */
  private updateChartsData(): void {
    // Por ahora mantiene los datos mock, pero aquí se implementaría la lógica
    // para filtrar datos basado en selectedPeriodoDesde y selectedPeriodoHasta
    console.log('Actualizando gráficos para el período:', {
      desde: this.selectedPeriodoDesde,
      hasta: this.selectedPeriodoHasta
    });
    this.updateTableData();
    this.updateDetailedTableData();
  }

  /**
   * Inicializar tabla con columnas agrupadas
   */
  private initializeTable(): void {
    this.tableColumns = [
      { field: 'mes', header: 'Mes', width: '12%', group: null },
      // Grupo PBC
      { field: 'pbc_mineria', header: 'Minería', width: '10%', group: 'PBC' },
      { field: 'pbc_hidrocarburos', header: 'Hidrocarburos', width: '10%', group: 'PBC' },
      { field: 'pbc_total', header: 'Total', width: '10%', group: 'PBC' },
      // Grupo Recaudo
      { field: 'recaudo_mineria', header: 'Minería', width: '10%', group: 'Recaudo' },
      { field: 'recaudo_hidrocarburos', header: 'Hidrocarburos', width: '10%', group: 'Recaudo' },
      { field: 'recaudo_total', header: 'Total', width: '10%', group: 'Recaudo' },
      // Grupo Variación
      { field: 'variacion_mineria', header: 'Minería', width: '9%', group: 'Variación' },
      { field: 'variacion_hidrocarburos', header: 'Hidrocarburos', width: '9%', group: 'Variación' },
      { field: 'variacion_total', header: 'Total', width: '10%', group: 'Variación' }
    ];

    this.updateTableData();
  }

  /**
   * Actualizar datos de la tabla basado en el rango de fechas
   */
  private updateTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.tableData = [];
      return;
    }

    const months = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);
    
      // Obtiene todos los meses en el rango seleccionado
    const monthsInRange = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);

    // Filtra los datos de tableDataBase según los meses seleccionados
    this.tableData = this.tableDataBase.filter(row => {
      // Extrae mes y año del registro
      const [nombreMes, anioStr] = row.mes.split(' de ');
      const year = parseInt(anioStr, 10);

      // Convierte el nombre del mes a índice (0 = Enero, 1 = Febrero, ...)
      const monthIndex = this.getMonthIndexByName(nombreMes);

      // Retorna true si el mes y año del registro están en monthsInRange
      return monthsInRange.some(d => d.getFullYear() === year && d.getMonth() === monthIndex);
    });
    

  }



  private getMonthIndexByName(monthName: string): number {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months.indexOf(monthName);
}


  /**
   * Obtener lista de meses en un rango de fechas
   */
  private getMonthsInRange(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  /**
   * Formatear porcentaje para variaciones
   */
  formatPercentage(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return '-';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2).replace('.', ',')}%`;
  }

  /**
   * Descargar datos de la tabla en formato Excel
   */
  downloadExcel(): void {
    console.log('Descargando Excel con datos de la tabla...');
    
  
    this.descargarDatosPBCRecaudoMensual();
  }


    /**
   * Descarga del archivo excel de acuerdo con los datos del filtro
   */
  private async descargarDatosPBCRecaudoMensual(): Promise<void> {
    try {
     
	    // Usar método histórico original
      console.log('Descargando  datos SGr recaudo mensual');

      const archivo: Blob | undefined = await this.sicodisApiService.getSgrDescargaDetallePBCRecaudoMensual().toPromise();

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

      const nombreArchivo = `ResumenPBCvsRecaudoMensual.xlsx`;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('Archivo descargado exitosamente');



    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
    }
  }




  /**
   * Inicializar gráficos
   */
  private initializeCharts(): void {
    // Gráficos para vista Recaudo
    this.initializeMiningChart();
    this.initializeHydrocarbonChart();
    
    // Gráficos para vista Tipo de Recurso
    this.initializeConceptChart();
    this.initializeTrendChart();
  }

  /**
   * Inicializar gráfico de minería
   */
  private initializeMiningChart(): void {
    // Datos mock para 5 períodos (Enero 2025 - Mayo 2025)
    const periods = [ 'Agosto 2025', 'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025', 'Diciembre 2025'];
    
    // Datos simulados en pesos colombianos
    const recaudoMineria = [ 236606358724, 176744693700, 688694062304, 174759410760,238955927877.65];
    const pbcMineria = [ 422652382500, 169060952916, 507182858648, 464917620452,380387144060];

    this.miningChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Recaudo Minería',
          data: recaudoMineria,
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'PBC Minería',
          data: pbcMineria,
          backgroundColor: '#f7d0b6ff',
          borderColor: '#f38135ff',          
          // backgroundColor: '#60a5fa',
          // borderColor: '#3b82f6',
          borderWidth: 1
        }
      ]
    };

    this.miningChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cifras en miles de millones de pesos corrientes',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
              //weight: 'bold'
            }
          },
          ticks: {
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
          stacked: false,
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
   * Inicializar gráfico de hidrocarburos
   */
  private initializeHydrocarbonChart(): void {
    // Datos mock para 5 períodos (Enero 2025 - Mayo 2025)
    const periods = [ 'Agosto 2025', 'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025','Diciembre 2025'];
    
    // Datos simulados en pesos colombianos
    const recaudoHidrocarburos = [ 516581168859, 694193464544, 527252664807, 475749145202,588626745060,90];
    const pbcHidrocarburos = [ 718161024698, 694994469215, 718161024698, 694994469215,718161024698.81];

    this.hydrocarbonChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Recaudo Hidrocarburos',
          data: recaudoHidrocarburos,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'PBC Hidrocarburos',
          data: pbcHidrocarburos,
          // backgroundColor: '#34d399',
          // borderColor: '#10b981',
          backgroundColor: '#f7d0b6ff',
          borderColor: '#f38135ff',          
          borderWidth: 1
        }
      ]
    };

    this.hydrocarbonChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cifras en miles de millones de pesos corrientes',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
              //weight: 'bold'
            }
          },
          ticks: {
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
          stacked: false,
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
  private formatCurrency(value: number): string {
    if (value === 0) return '0';
    
    // const billions = value / 1000000000000;
    // if (billions >= 1) {
    //   return billions.toFixed(1).replace('.', ',') + ' B';
    // }
    
    const millions = value / 1000000000;
    if (millions >= 1) {
      return millions.toFixed(1).replace('.', ',') + '';
    }
    
    return new Intl.NumberFormat('es-CO').format(value);
  }

  /**
   * Inicializar gráfico de conceptos de gasto (PBC vs Recaudo)
   */
  private initializeConceptChart(): void {
    // Datos mock para conceptos: Inversión, Ahorro, Administración
    const presupuestoBienal = [ 23620950245846, 1149127309256 , 766084872838 ]; // En pesos
    const recaudoAcumulado = [10154848835736.3, 502412341140.16, 334941560760.06]; // En pesos
  
    this.conceptChartData = {
      labels: ['Inversión', 'Ahorro', 'Administración'],
      datasets: [
        {
          label: 'Presupuesto Bienal',
          data: presupuestoBienal,
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'Recaudo Acumulado',
          data: recaudoAcumulado,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    };

    this.conceptChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,           
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
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
          stacked: false,
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
   * Inicializar gráfico de tendencia mensual
   */
  private initializeTrendChart(): void {
    // Datos ultimos 5 mees
        const periods = [ 'Agosto 2025', 'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025', 'Diciembre 2025'];
    
    // Datos simulados de Inversión (PBC vs Recaudo)
    const inversionPBC = [ 1140813407198.81, 864055422131, 1225343883346.81, 1159912089667,1098548168758.76];
    const inversionRecaudo = [ 753187527583.98, 870938158245.43, 1215946727111.77, 650508555962.64, 769629694304.55];

    this.trendChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Total PBC',
          data: inversionPBC,
          borderColor: '#f38135ff',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#f38135ff',
          pointBorderColor: '#f38135ff',
          pointBorderWidth: 2
        },
        {
          label: 'Total Recaudo',
          data: inversionRecaudo,
          borderColor: '#1008ebff',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#502adbff',
          pointBorderColor: '#3342e9ff',
          pointBorderWidth: 2
        }
      ]
    };

    this.trendChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        datalabels: {
          display: false
        },        
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Cifras en miles de millones de pesos corrientes',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
              //weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
              //weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            },
            callback: (value: any) => {
              return this.formatCurrency(value);
            }
          }
        }
      }
    };
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




  /**
   * Generar contenido de siglas
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
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.sigla}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
  }

  /**
   * Inicializar tabla de comportamiento
   */
  private initializeBehaviorTable(): void {
    // Configuración de columnas
    this.behaviorTableColumns = [
      { field: 'concepto', header: 'Concepto', width: '15%' },
      { field: 'inversion_aforada', header: 'Inversión aforada', width: '15%' },
      { field: 'ahorro', header: 'Ahorro', width: '15%' },
      { field: 'administracion', header: 'Administración y SSEC', width: '13%' },
      { field: 'no_aforado', header: 'No aforado', width: '13%' },
      { field: 'otros', header: 'Otros', width: '14%' },
      { field: 'total', header: 'Total', width: '15%' }
    ];

    // Datos mock para la única fila
    const inversionAforada = 10154848835736.3; 
    const ahorro = 502412341140.16; 
    const administracion = 334941560760.06; 
    const noAforado = 114562975773.71; 
    const otros = 5832830311874; 
    const total = inversionAforada + ahorro + administracion + noAforado + otros;

    this.behaviorTableData = [
      {
        concepto: 'Total recaudo corrientes y otros',
        inversion_aforada: inversionAforada,
        ahorro: ahorro,
        administracion: administracion,
        no_aforado: noAforado,
        otros: otros,
        total: total
      }
    ];
  }

  /**
   * Inicializar tabla detallada con columnas agrupadas
   */
  private initializeDetailedTable(): void {
    // Configuración de columnas con agrupación
    this.detailedTableColumns = [
      { field: 'periodo', header: 'Periodo de recaudo', width: '10%', group: null },
      // Grupo Recaudo Corriente
      { field: 'rc_inversion_aforada', header: 'Inversión aforada', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_ahorro', header: 'Ahorro', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_administracion', header: 'Administración y SSEC', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_no_aforado', header: 'No aforado', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_total', header: 'Total Recaudo', width: '8%', group: 'Recaudo Corriente' },
      // Columnas individuales
      { field: 'total_pbc', header: 'Total PBC', width: '8%', group: null },
      { field: 'avance', header: 'Avance', width: '7%', group: null },
      // Grupo Recaudo Otros
      { field: 'ro_inversion', header: 'Inversión', width: '8%', group: 'Recaudo Otros' },
      { field: 'ro_ahorro', header: 'Ahorro', width: '7%', group: 'Recaudo Otros' },
      { field: 'ro_administracion', header: 'Administración y SSEC', width: '8%', group: 'Recaudo Otros' },
      { field: 'ro_total', header: 'Total recaudo otros', width: '8%', group: 'Recaudo Otros' },
      // Columna individual final
      { field: 'total_distribuido', header: 'Total distribuido', width: '8%', group: null }
    ];

    this.updateDetailedTableData();
  }

  /**
   * Actualizar datos de la tabla detallada basado en el rango de fechas
   */
  private updateDetailedTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.detailedTableData = [];
      return;
    }

    const months = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);
    // Obtiene todos los meses en el rango seleccionado
    const monthsInRange = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);

    // Filtra los datos de tableDataBase según los meses seleccionados
    this.detailedTableData = this.detailedTableDataBase.filter(row => {
      // Extrae mes y año del registro
      const [nombreMes, anioStr] = row.periodo.split(' de ');
      const year = parseInt(anioStr, 10);

      // Convierte el nombre del mes a índice (0 = Enero, 1 = Febrero, ...)
      const monthIndex = this.getMonthIndexByName(nombreMes);

      // Retorna true si el mes y año del registro están en monthsInRange
      return monthsInRange.some(d => d.getFullYear() === year && d.getMonth() === monthIndex);
    });    

    // this.detailedTableData = months.map((monthDate, index) => {
    //   const monthName = monthDate.toLocaleDateString('es-ES', { 
    //     month: 'long', 
    //     year: 'numeric' 
    //   });

    //   // Datos mock para Recaudo Corriente
    //   const rcInversionAforada = 8200000000000 + (Math.random() * 2000000000000);
    //   const rcAhorro = 1950000000000 + (Math.random() * 500000000000);
    //   const rcAdministracion = 520000000000 + (Math.random() * 200000000000);
    //   const rcNoAforado = 1250000000000 + (Math.random() * 400000000000);
    //   const rcTotal = rcInversionAforada + rcAhorro + rcAdministracion + rcNoAforado;

    //   // Datos mock adicionales
    //   const totalPBC = rcTotal + (Math.random() * 1000000000000);
    //   const avance = ((rcTotal / totalPBC) * 100);

    //   // Datos mock para Recaudo Otros
    //   const roInversion = 2800000000000 + (Math.random() * 800000000000);
    //   const roAhorro = 650000000000 + (Math.random() * 200000000000);
    //   const roAdministracion = 180000000000 + (Math.random() * 80000000000);
    //   const roTotal = roInversion + roAhorro + roAdministracion;

    //   // Total distribuido
    //   const totalDistribuido = rcTotal + roTotal;

    //   return {
    //     periodo: monthName.charAt(0).toUpperCase() + monthName.slice(1),
    //     // Recaudo Corriente
    //     rc_inversion_aforada: rcInversionAforada,
    //     rc_ahorro: rcAhorro,
    //     rc_administracion: rcAdministracion,
    //     rc_no_aforado: rcNoAforado,
    //     rc_total: rcTotal,
    //     // Individuales
    //     total_pbc: totalPBC,
    //     avance: avance,
    //     // Recaudo Otros
    //     ro_inversion: roInversion,
    //     ro_ahorro: roAhorro,
    //     ro_administracion: roAdministracion,
    //     ro_total: roTotal,
    //     // Total final
    //     total_distribuido: totalDistribuido
    //   };
    // });
  }
}
