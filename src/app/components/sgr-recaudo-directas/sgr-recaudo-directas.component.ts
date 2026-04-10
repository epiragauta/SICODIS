import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { DiccionarioItem, FuncionamientoSiglasDiccionario, SGRFechaActualizacionCorte, SgrRecaudoItem, SicodisApiService, SiglasItem } from '../../services/sicodis-api.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sgr-recaudo-directas',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    Select,
    FloatLabel,
    TableModule,
    FormsModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './sgr-recaudo-directas.component.html',
  styleUrl: './sgr-recaudo-directas.component.scss'
})
export class SgrRecaudoDirectasComponent implements OnInit {

  @ViewChild('comparativeTable') comparativeTable: any;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  // Filtros
  selectedBienio: any = { id: 1, label: '2025 - 2026' };
  selectedBeneficiario: any = null;
  selectedDepartamento: any = null;
  filtersApplied: boolean = false;

  // Estado de resaltado sincronizado con el tooltip de las gráficas
  highlightedMes: string | null = null;
  // Valores posibles: 'mineria_pbc' | 'mineria_recaudo' | 'hidro_pbc' | 'hidro_recaudo'
  highlightedDatasetKey: string | null = null;

  // Toggle para mostrar solo meses transcurridos o todos los meses del bienio
  showOnlyElapsedMonths: boolean = false;

  // Opciones de filtros
  bienios: any[] = [
    { id: 1, label: '2025 - 2026' }
    // ,
    // { id: 2, label: '2023 - 2024' },
    // { id: 3, label: '2021 - 2022' }
  ];

  vigencias: any[] = [];
  selectedVigencia: any; // Seleccionar el primer elemento por defecto
  showAnticipadas: boolean = true;

  titleTablaPBCRecaudo: string = 'Asignaciones Directas (25%)';


  beneficiarios: any[] = [
    { id: 1, nombre: 'Todos' },
    { id: 2, nombre: 'Departamentos' },
    { id: 3, nombre: 'Entidades' },
    { id: 4, nombre: 'Regiones' }
  ];

  departamentos: any[] = [
    { id: 1, nombre: 'Todos' }
  ];

  departments: any[] = [];
  departmentSelected: string = '';

  towns: any[] = [];
  townSelected: string = '';
  //departamentos = departamentos;

  // Chart data for line charts
  mineriaChartData: any = {};
  mineriaChartOptions: any = {};
  hidrocarburosChartData: any = {};
  hidrocarburosChartOptions: any = {};

  // Table data for monthly comparison
  monthlyComparisonData: any[] = [];

  lblAsignacionesDirectas: string = '25% Asignaciones Directas';
  chartTitle: string = 'Recaudo Directas (20% y 5% anticipadas)';

  dataRecaudo: SgrRecaudoItem[] = [
    {
      mes: "Ene 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Feb 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Mar 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Abr 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "May 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Jun 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Jul 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Ago 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Sep 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    },
    {
      mes: "Oct 2025",
      mineria_pbc: 0,
      mineria_recaudo: 0,
      mineria_pbc20: 0,
      mineria_recaudo_ad20: 0,
      mineria_pbc5: 0,
      mineria_recaudo_ad5: 0,
      hidrocarburos_pbc: 0,
      hidrocarburos_recaudo: 0,
      hidrocarburos_pbc20: 0,
      hidrocarburos_recaudo_ad20: 0,
      hidrocarburos_pbc5: 0,
      hidrocarburos_recaudo_ad5: 0
    }
  ];

  constructor(private sicodisApiService: SicodisApiService, private ngZone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.items = [
      { label: 'SGR', routerLink: '/sgr-inicio' },
      { label: 'Recaudo Directas' }
    ];

    this.sicodisApiService.getSGRFechasActualizacionCorteRecaudoIAC().subscribe({
      next: (data: SGRFechaActualizacionCorte[]) => {
        if (data && data.length > 0) {
          const registro = data[0];
          this.fechaActualizacion = registro.fecha_actualizacion;
          this.fechaCorteRecaudo = registro.fecha_corte_recaudo;
        }

      },
      error: (err) => console.error('Error cargando fechas', err)
    });
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
    // Cargar datos de diccionario y siglas
    await this.cargarVigencias();
    await this.cargarDepartamentos();

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    //this.selectedBeneficiario = this.beneficiarios[0]; // aquí sí funciona
    //this.selectedDepartamento = this.beneficiarios[0];


    this.cargarSiglasDiccionario();

    await this.applyFilters(); // Cargar datos con filtros por defecto (todos) al iniciar el componente
    // Inicialización del componente
    // this.initializeLineCharts();
    // this.initializeMonthlyComparisonData();
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
      const vigencias = await this.sicodisApiService.getVigenciasSgrPbc().toPromise();
      this.vigencias = vigencias?.map((vigencia: any) => ({
        id: vigencia.id_vigencia,
        label: vigencia.vigencia
      })) || [];

      // Seleccionar la primera vigencia por defecto
      if (this.vigencias.length > 0) {
        this.selectedVigencia = this.vigencias[0];
        console.log('Vigencia seleccionada por defecto:', this.selectedVigencia);
        this.updateShowAnticipadas();
        this.loadSgrData();
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
      this.updateShowAnticipadas();
      this.loadSgrData();

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

  onVigenciaChange(event: any): void {
    this.updateShowAnticipadas();
  }

  private updateShowAnticipadas(): void {
    const currentYear = new Date().getFullYear().toString();
    //const label: string = this.selectedVigencia?.label || '';
    //this.showAnticipadas = label.includes(currentYear);
    this.showAnticipadas = this.selectedVigencia.id >= 6; // Asumiendo que las vigencias tienen IDs correlativos y los más recientes son menores o iguales a 6
    this.lblAsignacionesDirectas = this.showAnticipadas ? '25% Asignaciones Directas' : 'Asignaciones Directas';
    this.chartTitle = this.showAnticipadas ? 'Recaudo Directas (20% y 5% anticipadas)' : 'Recaudo Directas';
    this.applyFilters();
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




  /**
   * Carga los datos sgr para la tabla
   */
  loadSgrData() {

    const selectedYear = parseInt(this.selectedVigencia);
    const idVigencia = this.selectedVigencia.id;
    const depto = this.departmentSelected;
    //const municipio = this.townSelected;
    const municipio = this.towns.find(d => d.id === this.townSelected);

    // --- REGLA PARA CAMBIAR EL TÍTULO ---
    const codigoMunicipio = municipio?.id ?? '';
    const descripcionMunicipio = municipio?.label ?? '';

    const esGobernacion =
      codigoMunicipio.endsWith('000') &&
      descripcionMunicipio.startsWith('Gobernación de ');

    if (esGobernacion) {
      this.titleTablaPBCRecaudo = 'Asignaciones Directas (20%)';
    } else {
      this.titleTablaPBCRecaudo = 'Asignaciones Directas (25%)'; // tu título por defecto
    }
    // -----------------------------------


    this.sicodisApiService.getSgrDetallePBCRecaudo(idVigencia, this.departmentSelected, this.townSelected).subscribe({
      next: (data: SgrRecaudoItem[]) => {
        //this.dataRecaudo = data;


        this.dataRecaudo = data.map(item => ({
          ...item,

          // minería
          mineria_pbc:
            (item.mineria_pbc20 ?? 0) + (item.mineria_pbc5 ?? 0),

          mineria_recaudo:
            (item.mineria_recaudo_ad20 ?? 0) + (item.mineria_recaudo_ad5 ?? 0),

          // hidrocarburos
          hidrocarburos_pbc:
            (item.hidrocarburos_pbc20 ?? 0) + (item.hidrocarburos_pbc5 ?? 0),

          hidrocarburos_recaudo:
            (item.hidrocarburos_recaudo_ad20 ?? 0) + (item.hidrocarburos_recaudo_ad5 ?? 0),
        }));

        this.initializeLineCharts();
        this.initializeMonthlyComparisonData();
      },
      error: err => console.error('Error cargando datos', err)
    });
  }

  private parseMesData(mesTexto: string): Date {

    if (!mesTexto) {
      console.warn('parseMesData: mesTexto vacío');
      return new Date(0);
    }

    const meses: Record<string, number> = {
      ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
      jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    mesTexto = mesTexto.trim().toLowerCase();

    // NUEVO FORMATO: ene-25
    if (mesTexto.includes('-')) {
      const [mesPart, anioPart] = mesTexto.split('-');

      const mesNum = meses[mesPart];
      const anio = Number('20' + anioPart);

      if (typeof mesNum === 'undefined' || isNaN(anio)) {
        console.warn('parseMesData: no se pudo parsear:', mesTexto);
        return new Date(0);
      }

      return new Date(anio, mesNum, 1);
    }

    // FORMATO ANTIGUO: "Enero 2025"
    const parts = mesTexto.split(/\s+/);

    if (parts.length < 2) {
      console.warn('parseMesData: formato inesperado:', mesTexto);
      return new Date(0);
    }

    let mesPart = parts[0].replace('.', '');
    const anioPart = parts[1];

    const mesNum = meses[mesPart];
    const anio = Number(anioPart);

    if (typeof mesNum === 'undefined' || isNaN(anio)) {
      console.warn('parseMesData: no se pudo parsear:', { mesTexto, mesPart, anioPart });
      return new Date(0);
    }

    return new Date(anio, mesNum, 1);
  }

  private parseFechaCorte(texto: string): Date {
    // Acepta formatos como: "octubre 31 de 2025", "31 octubre 2025", "Octubre 31 de 2025"
    if (!texto) {
      console.warn('parseFechaCorte: texto vacío');
      return new Date(0);
    }

    // Normalizar: quitar mayúsculas, " de ", múltiples espacios
    const t = texto.trim().toLowerCase().replace(/\s+de\s+/g, ' ').replace(/\s+/g, ' ');
    const parts = t.split(' ');

    // parts puede ser ['octubre','31','2025'] o ['31','octubre','2025']
    let day: number | null = null;
    let monthStr: string | null = null;
    let year: number | null = null;

    if (parts.length === 3) {
      if (!isNaN(Number(parts[0]))) {
        // '31 octubre 2025'
        day = Number(parts[0]);
        monthStr = parts[1];
        year = Number(parts[2]);
      } else {
        // 'octubre 31 2025'
        monthStr = parts[0];
        day = Number(parts[1]);
        year = Number(parts[2]);
      }
    } else {
      console.warn('parseFechaCorte: formato inesperado:', texto);
      return new Date(0);
    }

    if (!monthStr || isNaN(day) || isNaN(year)) {
      console.warn('parseFechaCorte: datos inválidos', { texto, day, monthStr, year });
      return new Date(0);
    }

    // mapa de meses (soporta nombre completo y abreviatura)
    const meses: Record<string, number> = {
      ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
      jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
    };

    const monthKey = monthStr.replace('.', '').slice(0, 3); // intentar abreviatura (ej: 'oct' de 'octubre')
    let monthNum: number | undefined = meses[monthStr] as any;

    // si no encuentra por el nombre completo, prueba con la abreviatura
    if (typeof monthNum === 'undefined') {
      monthNum = meses[monthKey];
    }

    if (typeof monthNum === 'undefined') {
      console.warn('parseFechaCorte: mes no reconocido:', monthStr);
      return new Date(0);
    }

    return new Date(year, monthNum, day);
  }



  private initializeLineCharts(): void {

    // ===============================
    // 1. FECHA DE CORTE
    // ===============================
    const fechaCorte = this.parseFechaCorte(this.fechaCorteRecaudo);

    // ===============================
    // 2. Filtro de datos según vista (todos / meses transcurridos)
    // ===============================
    const hoy = new Date();
    const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const workingData = this.dataRecaudo.filter((d: SgrRecaudoItem) =>
      d.mes !== 'TOTAL' &&
      (!this.showOnlyElapsedMonths || this.parseMesData(d.mes) < primerDiaMesActual)
    );
    const monthLabels = workingData.map(d => d.mes);

    // ===============================
    // 3. FUNCIONES DE MAPEADO
    // ===============================

    // PBC → siempre 0 = null
    const mapPBC = (arr: number[]) =>
      arr.map(v => (v === 0 ? null : v));

    // RECAUDO → lógica especial
    const mapRecaudo = (arr: number[]) =>
      arr.map((v, i) => {
        const fechaMes = this.parseMesData(monthLabels[i]);

        if (fechaMes <= fechaCorte) {
          // Antes del corte → mostrar el 0 como 0
          return v;
        }

        // Después del corte → 0 = null (cortar)
        return v === 0 ? null : v;
      });

    // ===============================
    // 4. Datos MINERÍA
    // ===============================
    const mineriaPBCChartData = workingData.map((d: SgrRecaudoItem) => d.mineria_pbc);
    const mineriaRecaudoChartData = mapRecaudo(workingData.map(d => d.mineria_recaudo));

    // Para detección de datos > 0
    const mineriaPBCData = mineriaPBCChartData;
    const mineriaRecaudoData = mineriaRecaudoChartData;

    // ===============================
    // 5. Datos HIDROCARBUROS
    // ===============================
    const hidrocarburosPBCChartData = workingData.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc);
    const hidrocarburosRecaudoChartData = mapRecaudo(workingData.map(d => d.hidrocarburos_recaudo));

    // Para detección de datos > 0
    const hidrocarburosPBCData = hidrocarburosPBCChartData;
    const hidrocarburosRecaudoData = hidrocarburosRecaudoChartData;


    // ===============================
    // 6. Detectar si hay datos > 0
    // ===============================
    const hasMineriaData =
      mineriaPBCData.some(v => v !== null && (v as number) > 0) ||
      mineriaRecaudoData.some(v => v !== null && (v as number) > 0);

    const hasHidroData =
      hidrocarburosPBCData.some(v => v !== null && (v as number) > 0) ||
      hidrocarburosRecaudoData.some(v => v !== null && (v as number) > 0);

    // ===============================
    // 7. Configurar gráficos
    // ===============================
    this.mineriaChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'PBC',
          data: mineriaPBCChartData,
          borderColor: '#f38135ff',
          backgroundColor: 'rgba(48, 30, 19, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        },
        {
          label: 'Recaudo',
          data: mineriaRecaudoChartData,
          borderColor: '#7991e8ff',
          backgroundColor: 'rgba(121, 145, 232, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    };

    this.hidrocarburosChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'PBC',
          data: hidrocarburosPBCChartData,
          borderColor: '#f38135ff',
          backgroundColor: 'rgba(243, 129, 53, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        },
        {
          label: 'Recaudo',
          data: hidrocarburosRecaudoChartData,
          borderColor: '#7991e8ff',
          backgroundColor: 'rgba(121, 145, 232, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    };

    // ===============================
    // 8. Opciones
    // ===============================
    const commonOptions = (hasData: boolean, suggestedMax = 0) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          align: 'center',
          fullSize: false,
          labels: {
            font: {
              size: 12,
              family: 'Work Sans'
            },
            padding: 20,
            usePointStyle: true,
            boxWidth: 10
          }
        },
        subtitle: {
          display: false,
          text: 'Cifras en pesos corrientes',
          align: 'center',
          font: {
            size: 11,
            family: 'Work Sans'
          },
          color: '#374151',
          padding: {
            bottom: 10
          }
        },



        datalabels: {
          display: false
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: suggestedMax,
          title: {
            display: true,
            //text: 'MM',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: { family: 'Work Sans', size: 10 },
            color: '#374151',
            callback: (value: any) => {
              if (!hasData) return Number(value) === 0 ? "0" : "";
              if (value < 1) return "0";
              return this.formatNumber(Number(value) / 1000000);
            }
          }
        },
        x: {
          // title: {
          //   display: true,
          //   text: 'Cifras en pesos corrientes',
          //   font: {
          //     size: 11,
          //     family: 'Work Sans'
          //   },
          //   color: '#374151'
          // },                
          ticks: {
            font: { family: 'Work Sans', size: 9 },
            color: '#374151',
            maxRotation: 90,
            minRotation: 90
          }
        }
      }
    });

    this.mineriaChartOptions = commonOptions(hasMineriaData, hasMineriaData ? undefined as any : 1);
    this.mineriaChartOptions.onHover = (event: any, activeElements: any[], chart: any) => {
      if (activeElements.length > 0) {
        const label = chart.data.labels[activeElements[0].index] as string;
        this.ngZone.run(() => this.onChartHover('mineria', activeElements[0].datasetIndex, label));
      } else {
        this.ngZone.run(() => this.clearChartHighlight());
      }
    };

    this.hidrocarburosChartOptions = commonOptions(hasHidroData, hasHidroData ? undefined as any : 1);
    this.hidrocarburosChartOptions.onHover = (event: any, activeElements: any[], chart: any) => {
      if (activeElements.length > 0) {
        const label = chart.data.labels[activeElements[0].index] as string;
        this.ngZone.run(() => this.onChartHover('hidro', activeElements[0].datasetIndex, label));
      } else {
        this.ngZone.run(() => this.clearChartHighlight());
      }
    };
  }




  // /**
  //  * Inicializar datos y opciones de los gráficos de líneas
  //  */
  // private initializeLineCharts(): void {
  //   // Labels para los meses de enero 2025 a diciembre 2026 (24 meses)  
  //   const monthLabels = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mes);
  //   const mineriaPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_pbc === 0 ? null : d.mineria_pbc);
  //   const mineriaRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_recaudo === 0 ? null : d.mineria_recaudo);
  //   const hidrocarburosPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc === 0 ? null : d.hidrocarburos_pbc);
  //   const hidrocarburosRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_recaudo === 0 ? null : d.hidrocarburos_recaudo);

  //   // ===============================
  //   // MÍNIMO: detectar si HAY datos (>0)
  //   // ===============================
  //   const hasMineriaData = mineriaPBCData.some(v => v !== null && (v as number) > 0)
  //     || mineriaRecaudoData.some(v => v !== null && (v as number) > 0);

  //   const hasHidroData = hidrocarburosPBCData.some(v => v !== null && (v as number) > 0)
  //     || hidrocarburosRecaudoData.some(v => v !== null && (v as number) > 0);

  //   // Configuración para gráfico de Minería
  //   this.mineriaChartData = {
  //     labels: monthLabels,
  //     datasets: [
  //       {
  //         label: 'PBC',
  //         data: mineriaPBCData,
  //         borderColor: '#f38135ff',
  //         backgroundColor: 'rgba(48, 30, 19, 0.1)',
  //         borderWidth: 2,
  //         fill: false,
  //         tension: 0.4
  //       },
  //       {
  //         label: 'Recaudo',
  //         data: mineriaRecaudoData,
  //         borderColor: '#7991e8ff',
  //         backgroundColor: 'rgba(121, 145, 232, 0.1)',
  //         borderWidth: 2,
  //         fill: false,
  //         tension: 0.4
  //       }
  //     ]
  //   };

  //   // Configuración para gráfico de Hidrocarburos
  //   this.hidrocarburosChartData = {
  //     labels: monthLabels,
  //     datasets: [
  //       {
  //         label: 'PBC',
  //         data: hidrocarburosPBCData,
  //         borderColor: '#f38135ff',
  //         backgroundColor: 'rgba(243, 129, 53, 0.1)',
  //         borderWidth: 2,
  //         fill: false,
  //         tension: 0.4
  //       },
  //       {
  //         label: 'Recaudo',
  //         data: hidrocarburosRecaudoData,
  //         borderColor: '#7991e8ff',
  //         backgroundColor: 'rgba(121, 145, 232, 0.1)',
  //         borderWidth: 2,
  //         fill: false,
  //         tension: 0.4
  //       }
  //     ]
  //   };

  //   // Opciones comunes para ambos gráficos (ahora reciben un flag hasData)
  //   const commonOptions = (hasData: boolean, suggestedMax = 0) => ({
  //     responsive: true,
  //     maintainAspectRatio: false,
  //     plugins: {
  //       legend: {
  //         display: true,
  //         position: 'bottom',
  //         labels: {
  //           font: {
  //             size: 12,
  //             family: 'Work Sans'
  //           },
  //           padding: 15,
  //           usePointStyle: true
  //         }
  //       }
  //     },
  //     scales: {
  //       y: {
  //         beginAtZero: true,
  //         suggestedMin: 0,
  //         suggestedMax: suggestedMax,
  //         title: {
  //           display: true,
  //           text: '',
  //           font: {
  //             size: 11,
  //             family: 'Work Sans'
  //           },
  //           color: '#374151'
  //         },
  //         ticks: {
  //           font: {
  //             family: 'Work Sans',
  //             size: 10
  //           },
  //           color: '#374151',
  //           callback: (value: any) => {
  //             // --------- AQUI: comportamiento mínimo seguro ----------
  //             // Si NO hay datos reales, SOLO mostramos el tick 0 y nada más
  //             if (!hasData) {
  //               return Number(value) === 0 ? '0' : '';
  //             }
  //             // Si hay datos, usamos el formato habitual (en millones)
  //             if (Number(value) < 1) return "0";
  //             return this.formatNumber(Number(value) / 1000000);
  //           }
  //         }
  //       },
  //       x: {
  //         title: {
  //           display: true,
  //           text: 'Miles de millones',
  //           font: {
  //             family: '"Work Sans", sans-serif',
  //             size: 11
  //           }
  //         },
  //         ticks: {
  //           font: {
  //             family: 'Work Sans',
  //             size: 9
  //           },
  //           color: '#374151',
  //           maxRotation: 90,
  //           minRotation: 90
  //         }
  //       }
  //     }
  //   });

  //   // =================================================================================
  //   // Asignar opciones: sugerimos max = 1 cuando no hay datos (mismo comportamiento que antes)
  //   // =================================================================================
  //   this.mineriaChartOptions = commonOptions(hasMineriaData, hasMineriaData ? undefined as any : 1);
  //   this.hidrocarburosChartOptions = commonOptions(hasHidroData, hasHidroData ? undefined as any : 1);
  // }



  toggleMesesView(): void {
    this.showOnlyElapsedMonths = !this.showOnlyElapsedMonths;
    this.initializeLineCharts();
    this.initializeMonthlyComparisonData();
  }

  onChartHover(chartType: 'mineria' | 'hidro', datasetIndex: number, mes: string): void {
    this.highlightedMes = mes;
    this.highlightedDatasetKey = chartType === 'mineria'
      ? (datasetIndex === 0 ? 'mineria_pbc' : 'mineria_recaudo')
      : (datasetIndex === 0 ? 'hidro_pbc' : 'hidro_recaudo');
    setTimeout(() => this.scrollToHighlightedRow(), 0);
  }

  private scrollToHighlightedRow(): void {
    if (!this.highlightedMes || !this.comparativeTable) return;

    const tableNative: HTMLElement = this.comparativeTable.el.nativeElement;
    const scrollWrapper = (
      tableNative.querySelector('.p-datatable-table-container') ||
      tableNative.querySelector('.p-datatable-wrapper') ||
      tableNative.querySelector('[data-pc-section="wrapper"]')
    ) as HTMLElement;
    const highlightedRow = tableNative.querySelector('tr.highlighted-row') as HTMLElement;

    if (!scrollWrapper || !highlightedRow) return;

    // Calcular posición del row relativa al scroll container
    let offsetTop = 0;
    let el: HTMLElement | null = highlightedRow;
    while (el && el !== scrollWrapper) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }

    const rowHeight = highlightedRow.offsetHeight;
    const containerScrollTop = scrollWrapper.scrollTop;
    const containerHeight = scrollWrapper.clientHeight;

    if (offsetTop < containerScrollTop || offsetTop + rowHeight > containerScrollTop + containerHeight) {
      scrollWrapper.scrollTo({
        top: offsetTop - containerHeight / 2 + rowHeight / 2,
        behavior: 'smooth'
      });
    }
  }

  clearChartHighlight(): void {
    this.highlightedMes = null;
    this.highlightedDatasetKey = null;
  }

  formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }


  /**
   * Inicializar datos de la tabla de comparación mensual
   */
  private initializeMonthlyComparisonData(): void {
    // Filtrar según la vista activa (todos los meses / solo transcurridos)
    const hoy = new Date();
    const primerDiaMesActual = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const filteredData = this.dataRecaudo.filter((d: SgrRecaudoItem) =>
      d.mes === 'TOTAL' ||
      !this.showOnlyElapsedMonths ||
      this.parseMesData(d.mes) < primerDiaMesActual
    );

    const monthLabels = filteredData.map((d: SgrRecaudoItem) => d.mes);
    const mineriaPBCData20 = filteredData.map((d: SgrRecaudoItem) => d.mineria_pbc20);
    const mineriaPBCData5 = filteredData.map((d: SgrRecaudoItem) => d.mineria_pbc5);

    const mineriaRecaudoDataAD20 = filteredData.map((d: SgrRecaudoItem) => d.mineria_recaudo_ad20);
    const mineriaRecaudoDataAD5 = filteredData.map((d: SgrRecaudoItem) => d.mineria_recaudo_ad5);

    const hidrocarburosPBCData20 = filteredData.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc20);
    const hidrocarburosPBCData5 = filteredData.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc5);

    const hidrocarburosRecaudoDataAD20 = filteredData.map((d: SgrRecaudoItem) => d.hidrocarburos_recaudo_ad20);
    const hidrocarburosRecaudoDataAD5 = filteredData.map((d: SgrRecaudoItem) => d.hidrocarburos_recaudo_ad5);


    // Construir datos de la tabla
    this.monthlyComparisonData = monthLabels.map((month, index) => ({
      mes: month,
      mineria_pbc20: mineriaPBCData20[index] * 1,
      mineria_pbc5: mineriaPBCData5[index] * 1,

      mineria_recaudo_ad20: mineriaRecaudoDataAD20[index] * 1,
      mineria_recaudo_ad5: mineriaRecaudoDataAD5[index] * 1,

      hidrocarburos_pbc20: hidrocarburosPBCData20[index] * 1,
      hidrocarburos_pbc5: hidrocarburosPBCData5[index] * 1,

      hidrocarburos_recaudo_ad20: hidrocarburosRecaudoDataAD20[index] * 1,
      hidrocarburos_recaudo_ad5: hidrocarburosRecaudoDataAD5[index] * 1
    }));
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    if (this.selectedVigencia && this.departmentSelected && this.townSelected) {
      this.filtersApplied = true;
      console.log('Filtros aplicados:', {
        bienio: this.selectedVigencia.id,
        beneficiario: this.departmentSelected,
        departamento: this.townSelected
      });

      // Aquí se implementaría la lógica de carga de datos para recaudo directas
      this.loadSgrData();
    } else {
      console.log('Debe seleccionar todos los filtros requeridos');
    }
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedBienio = { id: 1, label: '2025 - 2026' };
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
    this.filtersApplied = false;
    console.log('Filtros limpiados');
  }

  /**
   * Descargar datos en Excel
   */
  downloadExcel(): void {
    console.log('Descargando Excel con datos de recaudo directas:');
    // Aquí se implementaría la lógica de descarga del Excel
    this.descargarDatosPBCRecaudo();
  }


  /**
 * Descarga del archivo excel de acuerdo con los datos del filtro
 */
  private async descargarDatosPBCRecaudo(): Promise<void> {
    try {

      // Usar método histórico original
      console.log('Descargando  datos ultima y once');
      const idvigencia = parseInt(this.selectedVigencia.id);


      const selectedDepartamento = this.departments.find(d => d.id === this.departmentSelected);
      const selectedMunicipio = this.towns.find(d => d.id === this.townSelected);
      console.log('Vigencia seleccionada:', idvigencia);
      console.log('Código Departamento  seleccionado:', selectedDepartamento);
      console.log('Código Municipio seleccionado por defecto:', selectedMunicipio);



      const archivo: Blob | undefined = await this.sicodisApiService.getSgrDescargaDetallePBCRecaudo(idvigencia
        , selectedDepartamento.id
        , selectedMunicipio.id
        , this.selectedVigencia.label
        , selectedDepartamento.label
        , selectedMunicipio.label
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

      const nombreArchivo = `ResumenPBCvsRecaudo.xlsx`;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);

      console.log('Archivo descargado exitosamente');



    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
    }
  }


  /**
   * Mostrar popup del diccionario
   */
  showPopupDiccionario1(): void {
    console.log('Mostrando diccionario de datos');
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  /**
   * Mostrar popup de siglas
   */
  showPopupSiglas1(): void {
    console.log('Mostrando siglas');
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
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
   * Generar contenido del diccionario
   */
  // private generarContenidoDiccionario(): string {
  //   return `
  //     <div style="font-size: 11px; line-height: 1.6;">
  //       <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Recaudo Directas</h4>
  //       <ul style="list-style-type: none; padding: 0;">
  //         <li style="margin-bottom: 0.5rem;"><strong>SGR Recaudo Directas:</strong> Sistema de seguimiento del recaudo de asignaciones directas</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>Asignaciones Directas:</strong> Recursos asignados directamente a entidades territoriales</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>Recaudo:</strong> Monto efectivamente recaudado de las asignaciones</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>Beneficiarios:</strong> Entidades habilitadas para recibir recursos directos del SGR</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis de recaudo</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>Entidad Territorial:</strong> Departamento, distrito o municipio beneficiario</li>
  //       </ul>
  //     </div>
  //   `;
  // }




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
  // private generarContenidoSiglas(): string {
  //   return `
  //     <div style="font-size: 11px; line-height: 1.6;">
  //       <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
  //       <ul style="list-style-type: none; padding: 0;">
  //         <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>DNP:</strong> Departamento Nacional de Planeación</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>PBC:</strong> Plan Bienal de Caja</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>FAEP:</strong> Fondo de Ahorro y Estabilización Petrolera</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
  //         <li style="margin-bottom: 0.5rem;"><strong>SICODIS:</strong> Sistema de Consulta y Distribución</li>
  //       </ul>
  //     </div>
  //   `;
  // }

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

}