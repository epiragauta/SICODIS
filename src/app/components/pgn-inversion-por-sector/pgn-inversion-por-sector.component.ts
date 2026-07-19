import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { SkeletonPaginaComponent } from '../shared/skeleton-pagina/skeleton-pagina.component';
import { TableModule } from 'primeng/table';

import { departamentos } from '../../data/departamentos';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import { ChartData, ChartOptions } from 'chart.js';
//Chart.register(ChartDataLabels);

@Component({
  selector: 'app-pgn-regionalizacion-presupuesto-programacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    ButtonModule,
    Select,
    FloatLabel,
    SkeletonPaginaComponent,
    TableModule,
    Breadcrumb,
    ChartModule        
  ],
  templateUrl: './pgn-inversion-por-sector.component.html',
  styleUrl: './pgn-inversion-por-sector.component.scss'
})
export class PgnInversionPorSectorComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Filter properties
  selectedVigencia: any;
  selectedPeriodo: any;
  selectedSector: any;
  selectedEntidad: any;
  selectedProyecto: any;
  selectedFuente: any;

  // Loading state
  isLoading = false;

  // Data arrays
  vigencias: any[] = [];
  periodos: any[] = [];
  sectores: any[] = [];
  entidades: any[] = [];
  proyectos: any[] = [];
  fuentes: any[] = [];
  
  // Arreglos para el resultado
  resumen: any[] = [];
  detalle: any[] = [];

 

  // Table data
  departamentosData: any[] = [];

  // Loading states
  isLoadingData: boolean = false;
  
  gaugeData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  gaugeOptions: ChartOptions<'doughnut'> = {};    
  // porcentajes que usaremos para mostrar dentro del gauge
  compromisosPct: number = 0;
  obligacionesPct: number = 0;
  pagosPct: number = 0;  

  sgpItems: any[] = [];



  constructor(
    private sicodisApiService: SicodisApiService
  ) {}

  get resumenDataInversion() : any {
    return this.resumen.length > 0 ? this.resumen[0] : null;
  }


  async ngOnInit(): Promise<void> {
    this.items = [
        { label: 'PGN', routerLink: '/pgn-inicio' },
        { label: 'Inversión por Sector, entidad y proyecto' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    // opcional: valores por defecto para que el chart no quede vacío
    this.gaugeData = {
      labels: ['Regionalizado', 'Nacional', 'Por Regionalizar'],
      datasets: [{ data: [100,90,100,100], backgroundColor: ['#0c9bd3','#e97132','#196b24'], borderWidth: 0 }]
    };
    
    this.gaugeOptions = {
      cutout: '60%',
      rotation: -90,
      circumference: 180,
      maintainAspectRatio: false,
      aspectRatio: 1.5,
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => {
              const value = context.parsed;
              const formattedValue = new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(value);
              return `${formattedValue}`;
            }
          }
        },

        datalabels: {
              color: 'white',
              font: {
                weight: 'bold',
                size: 14
              },
              formatter: (value: any, ctx: any) => {
                const idx = ctx.dataIndex;
                // según index devolvemos el porcentaje correspondiente
                const pct = idx === 0 ? this.compromisosPct
                          : idx === 1 ? this.obligacionesPct
                          : this.pagosPct;

                // formateo
                return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(pct) + '%';
              },
              anchor: 'center',
              align: 'center'
            }


      }
    };



      // Cargar datos necesarios desde API para los filtros del formularios
    await this.cargarVigencias();
    await this.cargarPeriodos();
    await this.cargarSectores();
    await this.cargarEntidades();
    await this.cargarProyectos();
    await this.cargarFuentes();
    await this.cargarDatosInversion();

  }



  /**
   * Cargar datos desde la API para inicializar el formulario
   */
  private async cargarVigencias(): Promise<void> {
    try {
      const vigencias = await this.sicodisApiService.getPgnVigencias().toPromise();
      this.vigencias = vigencias?.map((vigencia: any) => ({
        id: vigencia.id_vigencia,
        label: vigencia.vigencia
      })) || [];
      
      // Seleccionar la primera vigencia por defecto
      if (this.vigencias.length > 0) {
        this.selectedVigencia = this.vigencias[0];
      }
      
    } catch (error) {
      console.warn('Error cargando vigencias desde API, se usarán datos locales como fallback:', error);
      this.vigencias = [];
    }
  }

  /**
   * Cargar datos desde la API para inicializar el formulario
   */
  private async cargarPeriodos(): Promise<void> {
    try {
      const periodos = await this.sicodisApiService.getPgnPeriodoPorVigencia(this.selectedVigencia.id).toPromise();
      this.periodos = periodos?.map((periodo: any) => ({
        id: periodo.id_periodo,
        label: periodo.periodo
      })) || [];
      
      // Seleccionar el primer periodo por defecto
      if (this.periodos.length > 0) {
        this.selectedPeriodo = this.periodos[0];
      }
      
    } catch (error) {
      console.warn('Error cargando periodos desde API, se usarán datos locales como fallback:', error);
      this.periodos = [];
    }
  }


  /**
   * Cargar datos de los sectores desde la API para inicializar el formulario
   */
  private async cargarSectores(): Promise<void> {
    try {

      const sectores = await this.sicodisApiService.getPgnSectoresPorVigenciaPeriodo(this.selectedVigencia.id, this.selectedPeriodo.id).toPromise();

      // Mapeamos los resultados
      this.sectores = sectores?.map((sector: any) => ({
        id: sector.id_sector,
        label: sector.sector
      })) || [];

      // Se agrega la opción "0 - Todos" al inicio
      this.sectores.unshift({ id: '0', label: 'Todos' });

      // Seleccionamos "Todos" por defecto
      this.selectedSector = this.sectores[0];


    } catch (error) {
      console.warn('Error sectores  desde API, se usarán datos locales como fallback:', error);
      this.sectores = [{ id: '0', label: 'Todos' }];
      this.selectedSector= this.fuentes[0];
    }
  }

  

  /**
   * Cargar datos de los entidades desde la API para inicializar el formulario
   */
  private async cargarEntidades(): Promise<void> {
    try {

      const entidades = await this.sicodisApiService.getPgnEntidadesPorVigenciaPeriodoSector(this.selectedVigencia.id
                                                                                             , this.selectedPeriodo.id
                                                                                             , this.selectedSector.id).toPromise();

      // Mapeamos los resultados
      this.entidades = entidades?.map((entidad: any) => ({
        id: entidad.codigo_entidad,
        label: entidad.entidad
      })) || [];

      // Se agrega la opción "0 - Todos" al inicio
      this.entidades.unshift({ id: '0', label: 'Todas' });

      // Seleccionamos "Todos" por defecto
      this.selectedEntidad = this.entidades[0];


    } catch (error) {
      console.warn('Error cargando entidades desde API, se usarán datos locales como fallback:', error);
      this.entidades = [{ id: '0', label: 'Todos' }];
      this.selectedEntidad = this.entidades[0];
    }
  }


  /**
   * Cargar datos de los proyectos desde la API para inicializar el formulario
   */
  private async cargarProyectos(): Promise<void> {
    try {

      const proyectos = await this.sicodisApiService.getPgnProyectosEntidadPorVigenciaPeriodoSector(this.selectedVigencia.id
                                                                                                    , this.selectedPeriodo.id
                                                                                                    , this.selectedSector.id
                                                                                                    , this.selectedEntidad.id).toPromise();

      // Mapeamos los resultados
      this.proyectos = proyectos?.map((proyecto: any) => ({
        id: proyecto.bpin,
        label: proyecto.proyecto
      })) || [];

      // Se agrega la opción "0 - Todos" al inicio
      this.proyectos.unshift({ id: '0', label: 'Todos' });

      // Seleccionamos "Todos" por defecto
      this.selectedProyecto = this.proyectos[0];


    } catch (error) {
      console.warn('Error cargando proyectos desde API, se usarán datos locales como fallback:', error);
      this.proyectos = [{ id: '0', label: 'Todos' }];
      this.selectedProyecto = this.proyectos[0];
    }
  }




  /**
   * Cargar datos de las fuentes desde la API para inicializar el formulario
   */
  private async cargarFuentes(): Promise<void> {
    try {

      const fuentes = await this.sicodisApiService.getPgnFuentesPorVigenciaPeriodo(this.selectedVigencia.id, this.selectedPeriodo.id).toPromise();

      // Mapeamos los resultados
      this.fuentes = fuentes?.map((fuente: any) => ({
        id: fuente.id_fuente,
        label: fuente.fuente
      })) || [];

      // Se agrega la opción "0 - Todos" al inicio
      this.fuentes.unshift({ id: '0', label: 'Todas' });

      // Seleccionamos "Todos" por defecto
      this.selectedFuente = this.fuentes[0];


    } catch (error) {
      console.warn('Error cargando fuentes desde API, se usarán datos locales como fallback:', error);
      this.fuentes = [{ id: '0', label: 'Todos' }];
      this.selectedFuente = this.fuentes[0];
    }
  }



  /**
   * Cargar datos de resumen y detalle de los departamentos de regionalización PGN a partir de los filtros seleccionados
   */
  private async cargarDatosInversion(): Promise<void> {
    try {


    const response = await this.sicodisApiService.getPgnDatosInversionFuenteProyectosEntidadPorVigenciaPeriodoSector( this.selectedVigencia.id,
                                                                                                                      this.selectedPeriodo.id,
                                                                                                                      this.selectedSector.id,
                                                                                                                      this.selectedEntidad.id,
                                                                                                                      this.selectedProyecto.id,
                                                                                                                      this.selectedFuente.id
                                                                                                                    )
                                                                                                                    .toPromise();

      // Mapeamos los resultados
    this.resumen = response?.resumen || [];
    this.detalle = response?.detalle || [];

    // AQUÍ es se arma los items de la tabla
    const r = this.resumen[0]; // para abreviar

    // ------------- Aquí se actualiza el gauge -------------
    this.buildGaugeDataFromResumen(this.resumen);
    // ----------------------------------------------------

    this.sgpItems = [

      {
        concept: 'Compromisos',
        amount: r.total_compromisos,
        progress: r.porcentaje_regionalizado,
        isTotal: false
      },
      {
        concept: 'Obligaciones',
        amount: r.total_obligaciones,
        progress: r.porcentaje_nacional,
        isTotal: false
      },
      {
        concept: 'Pagos',
        amount: r.total_pagos,
        progress: r.porcentaje_por_regionalizar,
        isTotal: false
      },
      {
        concept: 'Total Apropiación Vigente',
        amount: r.total_apropiacion_vigente,
        progress: null,
        isTotal: true
      }
    ];

    



    } catch (error) {
      console.warn('Error cargando datos desde API, se usarán datos locales como fallback:', error);
    }
  }


    private buildGaugeDataFromResumen(r: any) {

      const summary = Array.isArray(r) ? r[0] : r;

      // LOS PORCENTAJES que quieres mostrar dentro del gauge
      this.compromisosPct = summary?.porcentaje_total_compromisos ?? 0;
      this.obligacionesPct= summary?.porcentaje_total_obligaciones ?? 0;
      this.pagosPct = summary?.porcentaje_total_pagos ?? 0;

      // los valores (si los necesitas en tooltip u otra parte)
      const compromisosValue = summary?.total_compromisos ?? 0;
      const obligacionesValue = summary?.total_obligaciones ?? 0;
      const pagosValue = summary?.total_pagos ?? 0;

      // Si tu gauge usa los VALORES para tamaño, mantenlos; si usa porcentajes, pon los porcentajes.
      // Aquí respetamos lo que tenías: en tu código anterior estabas poniendo los valores en data.
      this.gaugeData = {
        labels: ['Compromisos', 'Obligaciones', 'Pagos'],
        datasets: [
          {
            data: [compromisosValue, obligacionesValue, pagosValue],
            backgroundColor: ['#0c9bd3','#e97132','#196b24'],
            borderWidth: 0
          }
        ]
      };
  }


  /**
   * Descarga los datos de resumen y detalle de los departamentos de regionalización PGN a partir de los filtros seleccionados en un archivo
   */
  private async descargarDatosInversion(): Promise<void> {
    try {


          // Puede ser Blob o undefined
      const archivo: Blob | undefined = await this.sicodisApiService.getPgnDescargaDatosInversionFuenteProyectosEntidadPorVigenciaPeriodoSector( this.selectedVigencia.id,
                                                                                                                      this.selectedPeriodo.id,
                                                                                                                      this.selectedSector.id,
                                                                                                                      this.selectedEntidad.id,
                                                                                                                      this.selectedProyecto.id,
                                                                                                                      this.selectedFuente.id
                                                                                                                    )
                                                                                                                    .toPromise();

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

      // Crear enlace temporal para descargar
      const url = window.URL.createObjectURL(excelBlob);
      const a = document.createElement('a');
      a.href = url;

      const nombreArchivo = `inversion_${this.selectedVigencia.id}_${this.selectedPeriodo.id}.xlsx`;
      a.download = nombreArchivo;
      a.click();

      window.URL.revokeObjectURL(url);


    } catch (error) {
      console.warn('Error descargando el archivo:', error);
    }
  }

  onVigenciaChange(event: SelectChangeEvent): void {
    this.selectedVigencia = event.value;

    this.cargarPeriodos();
    this.cargarEntidades();
    this.cargarFuentes();

  }

  onPeriodoChange(event: SelectChangeEvent): void {
    this.selectedPeriodo = event.value;
    this.cargarEntidades();
    this.cargarFuentes();    
  }

  onEntidadChange(event: SelectChangeEvent): void {
    this.selectedEntidad = event.value;   
    this.cargarProyectos();
  }

  onProyectoChange(event: SelectChangeEvent): void {
    this.selectedProyecto = event.value;   
  }
  

  onFuenteChange(event: SelectChangeEvent): void {
    this.selectedFuente = event.value;
  }

  onSectorChange(event: SelectChangeEvent): void {
    this.selectedSector = event.value;
    this.cargarEntidades();
  }

  onActualizar(): void {
    this.cargarDatosInversion();

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  clearFilters(): void {
    this.selectedVigencia = this.vigencias[0];
    this.selectedPeriodo = this.periodos[0];
    this.selectedSector = this.sectores[0];
    this.selectedEntidad = this.entidades[0];
    this.selectedProyecto = this.proyectos[0];
    this.selectedFuente = this.fuentes[0];
    //this.cargarDatosInversion();    

  }


  getTotalApropiacionVigente(): number {
    return this.detalle.reduce((sum, item) => sum + item.total_apropiacion_vigente, 0);
  }


  getTotalCompromisos(): number {
    return this.detalle.reduce((sum, item) => sum + item.total_compromisos, 0);
  }


  getTotalObligaciones(): number {
    return this.detalle.reduce((sum, item) => sum + item.total_obligaciones, 0);
  }

  getTotalPagos(): number {
    return this.detalle.reduce((sum, item) => sum + item.total_pagos, 0);
  }

    getTotalVigencia(): number {
    return this.detalle.reduce((sum, item) => sum + item.total_presupuesto_pgn_inversion, 0);
  }


  getAveragePerCapita(): number {
    const total = this.detalle.reduce((sum, item) => sum + item.per_capita, 0);
    return Math.round((total / this.detalle.length) * 10) / 10;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  exportToExcel(): void {
    this.descargarDatosInversion();
  }
}