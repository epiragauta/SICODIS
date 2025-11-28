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
import { SgrRecaudoItem, SicodisApiService } from '../../services/sicodis-api.service';
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
    //this.townSelected = '';
    this.loadTownsForDepartment();
    //this.loadSgpData();
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
    const municipio = this.townSelected;    
    this.sicodisApiService.getSgrDetallePBCRecaudo( idVigencia, this.departmentSelected, this.townSelected).subscribe({   
        next: (data: SgrRecaudoItem[]) => {
          this.dataRecaudo = data;
          
          this.initializeLineCharts();
          this.initializeMonthlyComparisonData();
        },
        error: err => console.error('Error cargando datos', err)
      });
  }


  /**
   * Inicializar datos y opciones de los gráficos de líneas
   */
  private initializeLineCharts(): void {
    // Labels para los meses de enero 2025 a diciembre 2026 (24 meses)  

    const monthLabels = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mes);
    const mineriaPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_pbc === 0 ? null : d.mineria_pbc);
    const mineriaRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.mineria_recaudo === 0 ? null : d.mineria_recaudo);
    const hidrocarburosPBCData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_pbc === 0 ? null : d.hidrocarburos_pbc);
    const hidrocarburosRecaudoData = this.dataRecaudo.map((d: SgrRecaudoItem) => d.hidrocarburos_recaudo === 0 ? null : d.hidrocarburos_recaudo);

    // Configuración para gráfico de Minería
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

    // Configuración para gráfico de Hidrocarburos
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

    // Opciones comunes para ambos gráficos
    const commonOptions = {
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
          title: {
            display: true,
            text: '',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#374151',
            callback: (value: any) => {
              return this.formatNumber(value/1000000) ;
            }
          }
        },
        x: {
          title: {
            display: true,
            text: 'Miles de millones',
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 9
            },
            color: '#374151',
            maxRotation: 90,
            minRotation: 90
          }
        }
      }
    };

    this.mineriaChartOptions = { ...commonOptions };
    this.hidrocarburosChartOptions = { ...commonOptions };
  }


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
                                                                                                      , this.selectedVigencia.id
                                                                                                      , selectedDepartamento.label
                                                                                                      , selectedMunicipio.label).toPromise();

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