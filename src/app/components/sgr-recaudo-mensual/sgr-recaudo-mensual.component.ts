import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePicker, DatePickerYearChangeEvent } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { DiccionarioItem, FuncionamientoSiglasDiccionario, SGRFechaActualizacionCorte, SgrRecaudoItem, SgrRecaudoMensualResponse, SicodisApiService, SiglasItem } from '../../services/sicodis-api.service';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { Select, SelectChangeEvent } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ViewChild, ElementRef } from '@angular/core';


@Component({
  selector: 'app-sgr-recaudo-mensual',
  standalone: true,
  providers: [MessageService],
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
    Breadcrumb,
    Select,
    ToastModule
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

  vigencias: any[] = [];
  selectedVigencia: any; // Seleccionar el primer elemento por defecto


  // Estados de visualización
  showRecaudoView: boolean = true;
  showTipoRecursoView: boolean = false;

  // Filtros de período usando DatePicker
  selectedPeriodoDesde: Date | null = null;
  selectedPeriodoHasta: Date | null = null;
  @ViewChild('miningScroll') miningScroll!: ElementRef;
  @ViewChild('hydroScroll') hydroScroll!: ElementRef;
  @ViewChild('trendScroll') trendScroll!: ElementRef;

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
tableDataBase: any[] = [];

  tableColumns: any[] = [];

  // Configuración de tabla comportamiento (vista Tipo de Recurso)
  behaviorTableData: any[] = [];
  behaviorTableColumns: any[] = [];

  // Configuración de tabla detallada (vista Tipo de Recurso)
  detailedTableData: any[] = [];


  detailedTableDataBase: any[] = [];

  


  detailedTableColumns: any[] = [];
  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';


  

constructor(private sicodisApiService: SicodisApiService,
              private messageService: MessageService
) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Recaudo Mensual' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    //this.tableData = [...this.tableDataBase];
    //this.detailedTableData = [...this.detailedTableDataBase];

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
    this.setDefaultPeriods();
    //this.initializeCharts();
    this.initializeTable();
    this.initializeBehaviorTable();
    //this.initializeDetailedTable();
    this.cargarSiglasDiccionario();    
    
  }



  private loadSgrData() {
  const idVigencia = this.selectedVigencia.id;
    console.log('1. idVigencia:', idVigencia);

  this.sicodisApiService
    .getSgrDetallePBCRecaudoMensual(idVigencia)
    .subscribe({
      next: (response: SgrRecaudoMensualResponse) => {

      console.log('2. response completo:', response);
      console.log('3. detalle:', response.detalle);
      console.log('4. resumen:', response.resumen);

      
      this.behaviorTableData = response.resumen;
      this.detailedTableDataBase = response.detalle;
      this.tableDataBase = response.detallesector;

      console.log('5. detailedTableDataBase:', this.detailedTableDataBase);
      console.log('6. selectedPeriodoDesde:', this.selectedPeriodoDesde);
      console.log('7. selectedPeriodoHasta:', this.selectedPeriodoHasta);

      this.updateTableData()
      this.updateDetailedTableData();
      this.initializeMiningChart();
      this.initializeHydrocarbonChart()
      this.initializeTrendChart();
      this.initializeConceptChart();

      console.log('8. detailedTableData después de filtrar:', this.detailedTableData)
      },
      error: err => console.error('Error cargando datos', err)
    });
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
      vigencia: this.selectedVigencia.id,
      desde: this.selectedPeriodoDesde,
      hasta: this.selectedPeriodoHasta,
      vista: this.showRecaudoView ? 'Recaudo' : 'Tipo de Recurso'
    });
    
    // Aquí se puede agregar lógica para actualizar los gráficos basado en el rango de fechas
    //--this.updateChartsData();
    this.loadSgrData(); // 👈 aquí, ya tiene selectedVigencia
    this.setPeriodsFromVigencia(this.selectedVigencia); // 👈 agrega esto
    //this.initializeCharts();
    this.initializeTable();
    this.initializeBehaviorTable();
    //this.initializeDetailedTable();
    this.cargarSiglasDiccionario();      
  }

  /**
   * Limpiar filtros
   */
  async clearFilters(): Promise<void> {
    console.log('Limpiando filtros...');
    this.cargarVigencias();
    //this.setDefaultPeriods();
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
      { field: 'periodo', header: 'Periodo', width: '12%', group: null },
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

    //this.updateTableData();
  }

  /**
   * Actualizar datos de la tabla basado en el rango de fechas
   */
  // private updateTableData1(): void {
  //   if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
  //     this.tableData = [];
  //     return;
  //   }

  //   const months = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);
    
  //     // Obtiene todos los meses en el rango seleccionado
  //   const monthsInRange = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);

  //   // Filtra los datos de tableDataBase según los meses seleccionados
  //   this.tableData = this.tableDataBase.filter(row => {
  //     // Extrae mes y año del registro
  //     const [nombreMes, anioStr] = row.mes.split(' de ');
  //     const year = parseInt(anioStr, 10);

  //     // Convierte el nombre del mes a índice (0 = Enero, 1 = Febrero, ...)
  //     const monthIndex = this.getMonthIndexByName(nombreMes);

  //     // Retorna true si el mes y año del registro están en monthsInRange
  //     return monthsInRange.some(d => d.getFullYear() === year && d.getMonth() === monthIndex);
  //   });
    

  // }

  private updateTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.tableData = [];
      return;
    }

    const monthsInRange = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);

    this.tableData = this.tableDataBase.filter(row => {
      // El servicio retorna "Enero 2025" (sin "de")
      const partes = row.periodo.split(' ');
      const nombreMes = partes[0];
      const year = parseInt(partes[partes.length - 1], 10);
      const monthIndex = this.getMonthIndexByName(nombreMes);

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
      console.log('Descargando  ');
  	  const idvigencia = parseInt(this.selectedVigencia.id );    
      console.log('Vigencia seleccionada:', idvigencia);

      const archivo: Blob | undefined = await this.sicodisApiService.getSgrDescargaResumenPbcRecaudoMensual( idvigencia
                                                                                                             , this.selectedVigencia.label
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
   * Descarga del archivo excel de acuerdo con los datos del filtro
   */
  private async descargarDatosPBCRecaudoMensualOld(): Promise<void> {
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
    //  const periods = [ 'Enero de 2025','Febrero de 2025','Marzo de 2025','Abril de 2025','Mayo de 2025','Junio de 2025','Julio de 2025' ,'Agosto de 2025' , 'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025', 'Diciembre 2025', 'Enero 2026'];
    
    // // Datos simulados en pesos colombianos
    // const recaudoMineria = [682080813613, 205815241162, 179536864856, 440812708055,522098700875, 162378056399 ,428193893328, 236606358725, 176744693700, 688694062304, 174759410760,238955927877.65, 357648355355];
    // const pbcMineria = [ 507182857652, 253591429312,211326191168,422652382500,253591429312,169060952916, 464917620452, 422652382500 ,169060952916, 507182858648, 464917620452,380387144060, 406554681320];


    console.log('tableDataBase length:', this.tableDataBase.length);
    console.log('tableDataBase:', this.tableDataBase);
    const periods = this.tableDataBase.map(row => row.periodo);
    const recaudoMineria = this.tableDataBase.map(row => row.recaudo_mineria);
    const pbcMineria = this.tableDataBase.map(row => row.pbc_mineria);
    console.log('periods:', periods);
    console.log('recaudoMineria:', recaudoMineria);
    console.log('pbcMineria:', pbcMineria);

    this.miningChartData = null; // 👈 destruye el chart del DOM

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
            display: false,
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

    // Al final del método, scroll al fondo
    setTimeout(() => {
      if (this.miningScroll?.nativeElement) {
        this.miningScroll.nativeElement.scrollTop = this.miningScroll.nativeElement.scrollHeight;
      }
    }, 100);    
  }

  /**
   * Inicializar gráfico de hidrocarburos
   */
  private initializeHydrocarbonChart(): void {
    // Datos mock para 5 períodos (Enero 2025 - Mayo 2025)
    // const periods = [ 'Enero de 2025','Febrero de 2025','Marzo de 2025','Abril de 2025','Mayo de 2025','Junio de 2025','Julio de 2025' ,'Agosto de 2025' ,'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025','Diciembre 2025', 'Enero 2026'];
    
    // // Datos simulados en pesos colombianos
    // const recaudoHidrocarburos = [ 543822025383,575748522787,861254012524,512559858422,569432496350,675696129038,487125727411,516581168859,694193464544, 527252664807, 475749145202,588626745060.90, 408052316983];
    // const pbcHidrocarburos = [ 507182857652,253591429312,211326191168,422652382500,253591429312,169060952916,464917620452,422652382500,694994469215, 718161024698, 694994469215,718161024698.81, 746405760774.72];


    const periods = this.tableDataBase.map(row => row.periodo);
    const recaudoHidrocarburos = this.tableDataBase.map(row => row.recaudo_hidrocarburos);
    const pbcHidrocarburos = this.tableDataBase.map(row => row.pbc_hidrocarburos);

    this.hydrocarbonChartData = null; // 👈 destruye el chart del DOM

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
            display: false,
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
    // Al final del método, scroll al fondo
    setTimeout(() => {
      if (this.hydroScroll?.nativeElement) {
        this.hydroScroll.nativeElement.scrollTop = this.hydroScroll.nativeElement.scrollHeight;
      }
    }, 100);      
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
    // const presupuestoBienal = [ 23620950245846, 1149127309256 , 766084872838 ]; // En pesos
    // const recaudoAcumulado = [10852967872255.9, 536868871395.5, 357912580930.2]; // En pesos

    const presupuestoBienal = [
      this.behaviorTableData[0]?.presupuesto_inversion ?? 0,
      this.behaviorTableData[0]?.presupuesto_ahorro ?? 0,
      this.behaviorTableData[0]?.presupuesto_otros ?? 0
    ];

    const recaudoAcumulado = [
      this.behaviorTableData[0]?.inversion_aforada ?? 0,
      this.behaviorTableData[0]?.ahorro ?? 0,
      this.behaviorTableData[0]?.administracion ?? 0
    ];

  
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
            display: false,          
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
   * Inicializar gráfico de tendencia mensual
   */
  private initializeTrendChart(): void {
    // Datos ultimos 5 mees
    // const periods = [ 'Enero de 2025','Febrero de 2025','Marzo de 2025','Abril de 2025','Mayo de 2025','Junio de 2025','Julio de 2025' ,'Agosto de 2025' ,'Septiembre 2025', 'Octubre 2025', 'Noviembre 2025','Diciembre 2025', 'Enero 2026'];
    
    // // Datos simulados de Inversión (PBC vs Recaudo)
    // const inversionPBC = [  1225343882351,902252787560,929487215867,1117646851715,971752454011,864055422131,1183078645151,1140813407199,864055422131, 1225343883346.81, 1159912089667,1098548168758.76, 1152960442094.72];
    // const inversionRecaudo = [  1225902838996, 781563763949,1040790877380,953372566476,1091531197225,838074185437,915319620739,753187527584,870938158245.43, 1215946727111.77, 650508555962.64, 769629694304.55, 765700672338];

    const periods = this.detailedTableData.map(row => row.periodo);
    const inversionPBC = this.detailedTableData.map(row => row.total_pbc);
    const inversionRecaudo = this.detailedTableData.map(row => row.rc_total);


    this.trendChartData = null;
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
      responsive: false,
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
            display: false,
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
setTimeout(() => {
  if (this.trendScroll?.nativeElement) {
    this.trendScroll.nativeElement.scrollLeft = this.trendScroll.nativeElement.scrollWidth;
  }
}, 3500);
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

    // // Datos mock para la única fila
    // const inversionAforada = 10852967872255.9; 
    // const ahorro = 536868871395.5; 
    // const administracion = 357912580930.2; 
    // const noAforado = 124717061166.54; 
    // const otros = 5832830311874; 
    // const total = inversionAforada + ahorro + administracion + noAforado + otros;

    // this.behaviorTableData = [
    //   {
    //     concepto: 'Total recaudo corrientes y otros',
    //     inversion_aforada: inversionAforada,
    //     ahorro: ahorro,
    //     administracion: administracion,
    //     no_aforado: noAforado,
    //     otros: otros,
    //     total: total
    //   }
    // ];
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

    //this.updateDetailedTableData();
  }

  /**
   * Actualizar datos de la tabla detallada basado en el rango de fechas
   */
  private updateDetailedTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.detailedTableData = [];
      return;
    }

    const monthsInRange = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);

    this.detailedTableData = this.detailedTableDataBase.filter(row => {
      // El servicio retorna "Enero 2025" (sin "de")
      const partes = row.periodo.split(' ');
      const nombreMes = partes[0];
      const year = parseInt(partes[partes.length - 1], 10);
      const monthIndex = this.getMonthIndexByName(nombreMes);

      return monthsInRange.some(d => d.getFullYear() === year && d.getMonth() === monthIndex);
    });
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
      
      if (this.vigencias.length > 0) {
        this.selectedVigencia = this.vigencias[0];
        this.setPeriodsFromVigencia(this.selectedVigencia); // 👈 agrega esto
        this.loadSgrData(); // 👈 aquí, ya tiene selectedVigencia
      }
      
    } catch (error) {
      this.vigencias = [
        { id: 1, label: "2023 - 2024" },
        { id: 2, label: "2024 - 2025" },
        { id: 3, label: "2025 - 2026" }
      ];
      this.selectedVigencia = this.vigencias[2];
      this.setPeriodsFromVigencia(this.selectedVigencia); // 👈 y aquí también
    }
  }


  /**
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    //this.clearFilters();
    this.selectedVigencia = event.value;  
    this.setPeriodsFromVigencia(event.value); // 👈 aquí estaba el error
  }



  private setPeriodsFromVigencia(vigencia: { id: number; label: string }): void {
    const years = vigencia.label.split('-').map(y => parseInt(y.trim(), 10));
    const [startYear, endYear] = years;

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // 👇 Normaliza a medianoche para evitar conflictos de hora
    this.minDate = new Date(startYear, 0, 1, 0, 0, 0, 0);

    if (endYear >= currentYear) {
      this.selectedPeriodoDesde = new Date(startYear, 0, 1, 0, 0, 0, 0);
      this.selectedPeriodoHasta = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
      this.maxDate = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);
    } else {
      this.selectedPeriodoDesde = new Date(startYear, 0, 1, 0, 0, 0, 0);
      this.selectedPeriodoHasta = new Date(endYear, 11, 1, 0, 0, 0, 0);
      this.maxDate = new Date(endYear, 11, 1, 0, 0, 0, 0);
    }
  }

  
currentYearDesde: number = 0;
currentYearHasta: number = 0;

  onYearChange(event: DatePickerYearChangeEvent, control: 'desde' | 'hasta'): void {
    if (control === 'desde') {
      this.currentYearDesde = event.year ?? 0;
    } else {
      this.currentYearHasta = event.year ?? 0;
    }
  }

  get startYear(): number {
    if (!this.selectedVigencia?.label) return new Date().getFullYear();
    return parseInt(this.selectedVigencia.label.split('-')[0].trim(), 10);
  }

  get endYear(): number {
    if (!this.selectedVigencia?.label) return new Date().getFullYear();
    return parseInt(this.selectedVigencia.label.split('-')[1].trim(), 10);
  }

  onPeriodoDesdeChange(date: Date): void {
    if (!date || !this.selectedPeriodoHasta) return;

    const desde = new Date(date.getFullYear(), date.getMonth(), 1);
    const hasta = new Date(this.selectedPeriodoHasta.getFullYear(), this.selectedPeriodoHasta.getMonth(), 1);

    if (desde > hasta) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Período inválido',
        detail: 'El período desde no puede ser mayor al período hasta.',
        life: 3000
      });
      setTimeout(() => this.selectedPeriodoDesde = this.selectedPeriodoHasta, 0);
    }
  }

  onPeriodoHastaChange(date: Date): void {
    if (!date || !this.selectedPeriodoDesde) return;

    const hasta = new Date(date.getFullYear(), date.getMonth(), 1);
    const desde = new Date(this.selectedPeriodoDesde.getFullYear(), this.selectedPeriodoDesde.getMonth(), 1);

    if (hasta < desde) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Período inválido',
        detail: 'El período hasta no puede ser menor al período desde.',
        life: 3000
      });
      setTimeout(() => this.selectedPeriodoHasta = this.selectedPeriodoDesde, 0);
    }
  }

  get miningChartHeight(): string {
    const items = this.miningChartData?.labels?.length ?? 0;
    const rowHeight = 50; // px por cada fila de barras
    const padding = 60;   // espacio para leyenda y ejes
    return `${(items * rowHeight) + padding}px`;
  }  

  get hydroChartHeight(): string {
    const items = this.hydrocarbonChartData?.labels?.length ?? 0;
    const rowHeight = 50; // px por cada fila de barras
    const padding = 60;   // espacio para leyenda y ejes
    return `${(items * rowHeight) + padding}px`;
  }    

  get trendChartWidth(): string {
    const items = this.trendChartData?.labels?.length ?? 0;
    const colWidth = 100; // 👈 más espacio entre puntos
    return `${items * colWidth}px`;
  }
  
}
