import { Component, OnInit } from '@angular/core';
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
import { SGRFechaActualizacionCorte, SgrRecaudoItem, SicodisApiService } from '../../services/sicodis-api.service';
import { departamentos } from '../../data/departamentos';
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

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Filtros
  selectedBienio: any = { id: 1, label: '2025 - 2026' };
  selectedBeneficiario: any = null;
  selectedDepartamento: any = null;
  filtersApplied: boolean = false;

  // Opciones de filtros
  bienios: any[] = [
    { id: 1, label: '2025 - 2026' }
    // ,
    // { id: 2, label: '2023 - 2024' },
    // { id: 3, label: '2021 - 2022' }
  ];

  vigencias: any[] = [];
  selectedVigencia: any; // Seleccionar el primer elemento por defecto

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

  dataRecaudo: SgrRecaudoItem[] = [
  {
    mes: "Ene 2025",
    mineria_pbc: 126795714413.05,
    mineria_recaudo: 170520203403.32,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 135955506345.63
  },
  {
    mes: "Feb 2025",
    mineria_pbc: 63397857328.05,
    mineria_recaudo: 51453810290.40,
    hidrocarburos_pbc: 162165339561.84,
    hidrocarburos_recaudo: 143937130696.86
  },
  {
    mes: "Mar 2025",
    mineria_pbc: 52831547792.05,
    mineria_recaudo: 44884216214.08,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 258376203757.14
  },
  {
    mes: "Abr 2025",
    mineria_pbc: 105663095625.05,
    mineria_recaudo: 110203177013.64,
    hidrocarburos_pbc: 173748617303.75,
    hidrocarburos_recaudo: 128139964605.48
  },
  {
    mes: "May 2025",
    mineria_pbc: 63397857328.05,
    mineria_recaudo: 130524675218.82,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 142358124087.46
  },
  {
    mes: "Jun 2025",
    mineria_pbc: 42265238229.00,
    mineria_recaudo: 40594514099.83,
    hidrocarburos_pbc: 173748617303.75,
    hidrocarburos_recaudo: 168924032259.40
  },
  {
    mes: "Jul 2025",
    mineria_pbc: 116229405113.00,
    mineria_recaudo: 107048473331.95,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 121781431852.83
  },
  {
    mes: "Ago 2025",
    mineria_pbc: 105663095625.00,
    mineria_recaudo: 59151589681.17,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 129145292214.83
  },
  {
    mes: "Sep 2025",
    mineria_pbc: 42265238229.00,
    mineria_recaudo: 44186173425.12,
    hidrocarburos_pbc: 173748617303.75,
    hidrocarburos_recaudo: 173548366136.24
  },
  {
    mes: "Oct 2025",
    mineria_pbc: 126795714662.00,
    mineria_recaudo: 172173515576.15,
    hidrocarburos_pbc: 179540256174.70,
    hidrocarburos_recaudo: 131813166201.79
  }
];




  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Recaudo Directas' }
    ];

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

    this.cargarVigencias();
    this.cargarDepartamentos();
    //this.loadSgrData();

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    //this.selectedBeneficiario = this.beneficiarios[0]; // aquí sí funciona
    //this.selectedDepartamento = this.beneficiarios[0];

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

    

    // Inicialización del componente
    // this.initializeLineCharts();
    // this.initializeMonthlyComparisonData();
  }


  /**
   * Cargar las vigencias desde el servicio
   */
  async cargarVigencias(): Promise<void> {
    try {
      const vigencias = await this.sicodisApiService.getSgrVigencias().toPromise();
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




  /**
   * Carga los datos sgr para la tabla
   */
  loadSgrData() {

    const selectedYear = parseInt(this.selectedVigencia );
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

    
    this.sicodisApiService.getSgrDetallePBCRecaudo( idVigencia, this.departmentSelected, this.townSelected).subscribe({   
        next: (data: SgrRecaudoItem[]) => {
          this.dataRecaudo = data;
          
          this.initializeLineCharts();
          this.initializeMonthlyComparisonData();
        },
        error: err => console.error('Error cargando datos', err)
      });
  }

private parseMesData(mesTexto: string): Date {
  // Ejemplos aceptados: "Ene 2025", "ene 2025", "Enero 2025", "enero 2025", "Ene. 2025"
  if (!mesTexto) {
    console.warn('parseMesData: mesTexto vacío');
    return new Date(0);
  }

  const meses: Record<string, number> = {
    // abreviaturas
    ene: 0, feb: 1, mar: 2, abr: 3, may: 4, jun: 5,
    jul: 6, ago: 7, sep: 8, oct: 9, nov: 10, dic: 11,
    // nombres completos
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  };

  const parts = mesTexto.trim().split(/\s+/);
  if (parts.length < 2) {
    console.warn('parseMesData: formato inesperado:', mesTexto);
    return new Date(0);
  }

  let mesPart = parts[0].replace('.', '').toLowerCase();
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
  // 2. Labels
  // ===============================
  const monthLabels = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mes);

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
  //const mineriaPBCData = mapPBC(this.dataRecaudo.map(d => d.mineria_pbc));
  const mineriaPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_pbc);
  const mineriaRecaudoData = mapRecaudo(this.dataRecaudo.map(d => d.mineria_recaudo));

  

  // ===============================
  // 5. Datos HIDROCARBUROS
  // ===============================
  //const hidrocarburosPBCData = mapPBC(this.dataRecaudo.map(d => d.hidrocarburos_pbc));
  const hidrocarburosPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc);
  const hidrocarburosRecaudoData = mapRecaudo(this.dataRecaudo.map(d => d.hidrocarburos_recaudo));

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
        data: mineriaPBCData,
        borderColor: '#f38135ff',
        backgroundColor: 'rgba(48, 30, 19, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Recaudo',
        data: mineriaRecaudoData,
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
        data: hidrocarburosPBCData,
        borderColor: '#f38135ff',
        backgroundColor: 'rgba(243, 129, 53, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4
      },
      {
        label: 'Recaudo',
        data: hidrocarburosRecaudoData,
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
        labels: {
          font: {
            size: 12,
            family: 'Work Sans'
          },
          padding: 15,
          usePointStyle: true
        }
      }
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
        title: {
          display: true,
          text: 'Cifras en miles de millones de pesos corrientes',
          font: {
            size: 11,
            family: 'Work Sans'
          },
          color: '#374151'
        },                
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
  this.hidrocarburosChartOptions = commonOptions(hasHidroData, hasHidroData ? undefined as any : 1);
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



formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


  /**
   * Inicializar datos de la tabla de comparación mensual
   */
  private initializeMonthlyComparisonData(): void {
    // Usar los mismos datos de los gráficos
    const monthLabels = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mes);
    const mineriaPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_pbc);
    const mineriaRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_recaudo);
    const hidrocarburosPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc);
    const hidrocarburosRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_recaudo);    


    // Construir datos de la tabla
    this.monthlyComparisonData = monthLabels.map((month, index) => ({
      mes: month,
      mineria_pbc: mineriaPBCData[index] * 1, // Convertir a pesos
      mineria_recaudo: mineriaRecaudoData[index] * 1,
      hidrocarburos_pbc: hidrocarburosPBCData[index] * 1,
      hidrocarburos_recaudo: hidrocarburosRecaudoData[index] * 1
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
  	  const idvigencia = parseInt(this.selectedVigencia.id );

	    
      const selectedDepartamento = this.departments.find(d => d.id === this.departmentSelected);
      const selectedMunicipio = this.towns.find(d => d.id === this.townSelected);
      console.log('Vigencia seleccionada:', idvigencia);
      console.log('Código Departamento  seleccionado:',  selectedDepartamento);
      console.log('Código Municipio seleccionado por defecto:', selectedMunicipio);



      const archivo: Blob | undefined = await this.sicodisApiService.getSgrDescargaDetallePBCRecaudo( idvigencia
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
  private generarContenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Recaudo Directas</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR Recaudo Directas:</strong> Sistema de seguimiento del recaudo de asignaciones directas</li>
          <li style="margin-bottom: 0.5rem;"><strong>Asignaciones Directas:</strong> Recursos asignados directamente a entidades territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>Recaudo:</strong> Monto efectivamente recaudado de las asignaciones</li>
          <li style="margin-bottom: 0.5rem;"><strong>Beneficiarios:</strong> Entidades habilitadas para recibir recursos directos del SGR</li>
          <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis de recaudo</li>
          <li style="margin-bottom: 0.5rem;"><strong>Entidad Territorial:</strong> Departamento, distrito o municipio beneficiario</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generar contenido de siglas
   */
  private generarContenidoSiglas(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>DNP:</strong> Departamento Nacional de Planeación</li>
          <li style="margin-bottom: 0.5rem;"><strong>PBC:</strong> Plan Bienal de Caja</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAEP:</strong> Fondo de Ahorro y Estabilización Petrolera</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>SICODIS:</strong> Sistema de Consulta y Distribución</li>
        </ul>
      </div>
    `;
  }
}