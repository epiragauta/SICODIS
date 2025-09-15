import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { FloatLabel } from 'primeng/floatlabel';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TreeNode, MenuItem } from 'primeng/api';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';
import { HttpClient } from '@angular/common/http';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { forkJoin } from 'rxjs';
import { Breadcrumb } from 'primeng/breadcrumb';

@Component({
  selector: 'app-historico-sgp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    HttpClientModule,
    TableModule,
    TreeTableModule,
    ButtonModule,
    Select,
    MultiSelect,
    FloatLabel,
    ChartModule,
    CardModule,
    ProgressSpinnerModule,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './historico-sgp.component.html',
  styleUrl: './historico-sgp.component.scss'
})
export class HistoricoSgpComponent implements OnInit, AfterViewInit {
  
  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Configuración responsiva para gráficos
  cols: number = 2;
  
  // Variables para filtros
  selectedYears: string[] = [];
  departmentSelected: string = '';
  townSelected: string = '';

  // Datos de años disponibles
  infoResume: any[] = [];
  sgpData: any = null;
  territorialEntities: any[] = [];
  
  // Lista de años desde actual hasta 2002 en orden descendente
  availableYears: any[] = [];

  departments = departamentos;

  towns: any = [
    { name: 'Municipio1' },
    { name: 'Municipio2' },
    { name: 'Municipio3' },
    { name: 'Municipio4' },
    { name: 'Municipio5' },
    { name: 'Municipio6' },
    { name: 'Municipio7' },
    { name: 'Municipio8' },
    { name: 'Municipio9' },
    { name: 'Municipio10' },
    { name: 'Municipio11' },
    { name: 'Municipio12' },
  ];

  // Datos de la tabla
  tableData: any = [];
  treeTableData: TreeNode[] = [];
  totalValue: number = 0;
  historicoApiData: any[] = [];

  // Variables para el gráfico de barras apiladas
  stackedBarChartData: any;
  stackedBarChartOptions: any;
  
  // Variables para gráficas de barras evolutivas
  chartData1: any;
  chartData3: any;
  mixedChartOptions: any;
  barChartOptions: any;

  // Estados de carga
  isLoadingChart: boolean = false;
  isLoadingTable: boolean = false;

  @ViewChild('treeTable', { static: false }) treeTable: any;
  
  years2005to2025 = ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];
  yearsRange = ['2002', '2003', '2004','2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025'];

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, private sicodisApiService: SicodisApiService) {
    Chart.register(...registerables, ChartDataLabels);
    // Configuración responsiva
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
    ).subscribe(cols => this.cols = cols);
  }

  ngOnInit(): void {
    this.items = [
        { label: 'SGP', routerLink: '/sgp-inicio' },
        { label: 'Histórico SGP' }        
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    
    this.generateAvailableYears();
    this.initializeDefaultSelection();
    this.loadSgpData();
    this.loadTerritorialEntities();
    this.initializeStackedBarChart();
    this.initializeBarChartsOptions();
    this.loadSgpHistoricoDataForEvolution();
    console.log('Historico SGP Component initialized');
  }

  ngAfterViewInit(): void {
    // Inicializar el ancho de la tabla después de que la vista esté lista
    setTimeout(() => {
      this.updateTableWidth();
    }, 100);
  }

  /**
   * Genera la lista de años desde el actual hasta 2002 en orden descendente
   */
  generateAvailableYears(): void {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    
    for (let year = currentYear; year >= 2002; year--) {
      this.availableYears.push({ year: year.toString() });
    }
    
    console.log('Available years generated:', this.availableYears);
  }

  /**
   * Carga los datos del SGP desde el archivo JSON
   */
  loadSgpData(): void {
    // Cargar datos desde API usando los años seleccionados
    this.loadSgpHistoricoFromApi();
  }

  /**
   * Carga los datos históricos del SGP desde la API
   */
  loadSgpHistoricoFromApi(): void {
    if (this.selectedYears.length === 0) {
      console.log('No hay años seleccionados para cargar datos');
      // Crear datos de ejemplo para pruebas
      this.createSampleTreeData();
      return;
    }

    // Si hay municipio seleccionado, usar getSgpResumenParticipaciones con municipio específico
    if (this.townSelected && this.townSelected !== '') {
      this.loadSgpParticipacionesByMunicipality();
    } else if (this.departmentSelected && this.departmentSelected !== '-1') {
      // Si hay departamento seleccionado, usar getSgpResumenParticipaciones
      this.loadSgpParticipacionesByDepartment();
    } else {
      // Usar método histórico original
      const aniosString = this.selectedYears.join(',');
      console.log('Cargando datos históricos para años:', aniosString);
      
      this.sicodisApiService.getSgpResumenHistorico({ anios: aniosString }).subscribe({
        next: (result: any[]) => {
          console.log('Datos históricos del API:', result);
          this.historicoApiData = result;
          if (result && result.length > 0) {
            this.buildTreeTableData();
          } else {
            console.log('No hay datos del API, creando datos de ejemplo');
            this.createSampleTreeData();
          }
          // Desactivar indicadores de carga
          this.isLoadingChart = false;
          this.isLoadingTable = false;
        },
        error: (error) => {
          console.error('Error loading SGP historico from API:', error);
          // Fallback con datos de ejemplo
          console.log('Error en API, creando datos de ejemplo');
          this.createSampleTreeData();
          // Desactivar indicadores de carga
          this.isLoadingChart = false;
          this.isLoadingTable = false;
        }
      });
    }
  }

  /**
   * Carga datos del SGP por departamento usando getSgpResumenParticipaciones
   */
  loadSgpParticipacionesByDepartment(): void {
    console.log('Cargando participaciones por departamento:', this.departmentSelected);
    
    // Crear array de observables para cada año seleccionado
    const participacionesObservables = this.selectedYears.map(year => 
      this.sicodisApiService.getSgpResumenParticipaciones(
        parseInt(year), 
        this.departmentSelected + "000", 
        'TODOS'
      )
    );

    // Ejecutar todas las llamadas en paralelo
    forkJoin(participacionesObservables).subscribe({
      next: (results: any[]) => {
        console.log('Datos de participaciones por departamento:', results);
        this.processParticipacionesData(results);
        // Desactivar indicadores de carga
        this.isLoadingChart = false;
        this.isLoadingTable = false;
      },
      error: (error) => {
        console.error('Error loading SGP participaciones by department:', error);
        // Fallback con datos de ejemplo
        console.log('Error en API participaciones, creando datos de ejemplo');
        this.createSampleTreeData();
        // Desactivar indicadores de carga
        this.isLoadingChart = false;
        this.isLoadingTable = false;
      }
    });
  }

  /**
   * Carga datos del SGP por municipio usando getSgpResumenParticipaciones
   */
  loadSgpParticipacionesByMunicipality(): void {
    console.log('Cargando participaciones por municipio:', this.townSelected);
    console.log('Departamento padre:', this.departmentSelected);
    
    // Crear array de observables para cada año seleccionado
    const participacionesObservables = this.selectedYears.map(year => 
      this.sicodisApiService.getSgpResumenParticipaciones(
        parseInt(year), 
        this.departmentSelected + "000", // Código del departamento 
        this.townSelected // Código del municipio específico
      )
    );

    // Ejecutar todas las llamadas en paralelo
    forkJoin(participacionesObservables).subscribe({
      next: (results: any[]) => {
        console.log('Datos de participaciones por municipio:', results);
        this.processParticipacionesData(results);
        // Desactivar indicadores de carga
        this.isLoadingChart = false;
        this.isLoadingTable = false;
      },
      error: (error) => {
        console.error('Error loading SGP participaciones by municipality:', error);
        // Fallback con datos de ejemplo
        console.log('Error en API participaciones municipio, creando datos de ejemplo');
        this.createSampleTreeData();
        // Desactivar indicadores de carga
        this.isLoadingChart = false;
        this.isLoadingTable = false;
      }
    });
  }

  /**
   * Crea datos de ejemplo para probar la tabla mientras no hay conexión al API
   */
  createSampleTreeData(): void {
    console.log('Creando datos de ejemplo para TreeTable');
    
    this.treeTableData = [];
    
    // Datos de ejemplo con estructura jerárquica
    const sampleData = [
      {
        key: '0101',
        data: {
          concepto: 'Educación',
          id_concepto: '0101',
          vigencia_2025: 35000000000000,
          vigencia_2024: 32000000000000,
          vigencia_2023: 30000000000000,
          vigencia_2022: 28000000000000
        },
        children: [
          {
            key: '010101',
            data: {
              concepto: 'Prestación de Servicios',
              id_concepto: '010101',
              vigencia_2025: 20000000000000,
              vigencia_2024: 18000000000000,
              vigencia_2023: 17000000000000,
              vigencia_2022: 16000000000000
            },
            leaf: true
          },
          {
            key: '010102',
            data: {
              concepto: 'Calidad',
              id_concepto: '010102',
              vigencia_2025: 15000000000000,
              vigencia_2024: 14000000000000,
              vigencia_2023: 13000000000000,
              vigencia_2022: 12000000000000
            },
            leaf: true
          }
        ],
        expanded: false
      },
      {
        key: '0102',
        data: {
          concepto: 'Salud',
          id_concepto: '0102',
          vigencia_2025: 24000000000000,
          vigencia_2024: 22000000000000,
          vigencia_2023: 21000000000000,
          vigencia_2022: 20000000000000
        },
        children: [
          {
            key: '010201',
            data: {
              concepto: 'Régimen Subsidiado',
              id_concepto: '010201',
              vigencia_2025: 15000000000000,
              vigencia_2024: 14000000000000,
              vigencia_2023: 13000000000000,
              vigencia_2022: 12000000000000
            },
            leaf: true
          },
          {
            key: '010202',
            data: {
              concepto: 'Salud Pública',
              id_concepto: '010202',
              vigencia_2025: 9000000000000,
              vigencia_2024: 8000000000000,
              vigencia_2023: 8000000000000,
              vigencia_2022: 8000000000000
            },
            leaf: true
          }
        ],
        expanded: false
      }
    ];

    this.treeTableData = sampleData;
    console.log('Datos de ejemplo creados:', this.treeTableData);
    this.calculateTreeTableTotal();
    
    // Actualizar gráfico con datos de ejemplo
    this.updateStackedBarChart();
    
    // Desactivar indicadores de carga
    this.isLoadingChart = false;
    this.isLoadingTable = false;
  }

  /**
   * Procesa los datos de participaciones del departamento y los organiza en estructura de árbol
   */
  processParticipacionesData(results: any[]): void {
    console.log('Procesando datos de participaciones:', results);
    
    // Crear un array plano con todos los conceptos de todas las vigencias
    this.historicoApiData = [];
    
    results.forEach((yearResult, index) => {
      const year = this.selectedYears[index];
      
      if (yearResult && Array.isArray(yearResult)) {
        yearResult.forEach((item: any) => {
          // Convertir estructura de participaciones a formato histórico
          this.historicoApiData.push({
            id_concepto: item.id_concepto,
            concepto: item.concepto,
            annio: parseInt(year),
            total_corrientes: item.total || 0,
            total_constantes: item.total || 0 // Por ahora usar el mismo valor
          });
        });
      } else if (yearResult) {
        // Si es un objeto único, convertirlo a array
        this.historicoApiData.push({
          id_concepto: yearResult.id_concepto || '99',
          concepto: yearResult.concepto || 'Total SGP',
          annio: parseInt(year),
          total_corrientes: yearResult.total || 0,
          total_constantes: yearResult.total || 0
        });
      }
    });
    
    console.log('Datos históricos procesados:', this.historicoApiData);
    
    if (this.historicoApiData.length > 0) {
      this.buildTreeTableData();
    } else {
      console.log('No se pudieron procesar los datos, usando datos de ejemplo');
      this.createSampleTreeData();
    }
    
    // Actualizar gráfico después de procesar los datos
    this.updateStackedBarChart();
  }

  /**
   * Carga las entidades territoriales desde el archivo JSON
   */
  loadTerritorialEntities(): void {
    this.http.get('assets/data/territorial-entities-detail.json').subscribe({
      next: (data: any) => {
        this.territorialEntities = data;
      },
      error: (error) => {
        console.error('Error loading territorial entities:', error);
      }
    });
  }

  /**
   * Inicializa la selección predeterminada con los últimos 4 años
   */
  initializeDefaultSelection(): void {
    if (this.availableYears.length === 0) return;
    
    // Tomar los primeros 6 años (ya están ordenados descendente)
    const defaultYears = this.availableYears
      .slice(0, 6)
      .map((item: any) => item.year);
    
    this.selectedYears = defaultYears;
    this.infoResume = this.availableYears;
    console.log('Años seleccionados por defecto:', this.selectedYears);
  }

  /**
   * Inicializa el gráfico de barras apiladas
   */
  initializeStackedBarChart(): void {
    // Configurar opciones del gráfico
    this.stackedBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 1.2,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {          
          stacked: true
        },
        y: {
          type: 'linear',
          display: true,          
          beginAtZero: true,
          stacked: true,
          ticks: {
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
                useGrouping: true
              }).format(value).replace(/,/g, '.');
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            usePointStyle: true,
            font: {
              size: 11
            },
            padding: 15
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#2d5016',
          borderWidth: 1,
          callbacks: {
            label: function(context: any) {
              const label = context.dataset.label || '';
              const value = new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                useGrouping: true
              }).format(context.parsed.y);
              return `${label}: ${value}`;
              //.replace(/,/g, '.')
            }
          }
        },
        datalabels: {
          display: false
        }
      }
    };

    // Inicializar con datos de ejemplo
    this.updateStackedBarChart();
  }

  /**
   * Actualiza el gráfico de barras apiladas con datos reales o de ejemplo
   */
  updateStackedBarChart(): void {
    // Colores verdes degradados para cada concepto
    const greenColors = [
      '#1e5f1e', // Verde oscuro - Educación
      '#2d7a2d', // Verde medio oscuro - Salud
      '#3b9b3b', // Verde medio - Agua Potable
      '#4abb4a', // Verde medio claro - Propósito General
      '#66cc66'  // Verde claro - Fonpet Asignaciones Especiales
    ];

    // Conceptos principales
    const conceptos = [
      { id: '0101', label: 'Educación' },
      { id: '0102', label: 'Salud' },
      { id: '0103', label: 'Agua Potable' },
      { id: '0104', label: 'Propósito General' },
      { id: '0204', label: 'Fonpet Asignaciones Especiales' }
    ];

    // Crear datasets para cada concepto
    const datasets = conceptos.map((concepto, index) => {
      const data = this.selectedYears.map(year => {
        // Buscar datos reales del concepto para este año
        const conceptoData = this.historicoApiData.find(item => 
          item.id_concepto === concepto.id && item.annio?.toString() === year
        );
        
        if (conceptoData) {
          return conceptoData.total_corrientes; // Valores en pesos
        } else {
          // Datos de ejemplo si no hay datos reales
          const baseValue = (index + 1) * 15000000;
          const yearIndex = this.selectedYears.indexOf(year);
          return baseValue + (yearIndex * 2000000) + (Math.random() * 5000000);
        }
      });

      return {
        label: concepto.label,
        data: data,
        backgroundColor: greenColors[index],
        borderColor: greenColors[index],
        borderWidth: 1
      };
    });

    this.stackedBarChartData = {
      labels: this.selectedYears,
      datasets: datasets
    };

    console.log('Gráfico de barras apiladas actualizado:', this.stackedBarChartData);
  }

  /**
   * Inicializa los datos de la tabla
   */
  initializeTableData(): void {
    // Usar los años seleccionados por defecto para inicializar la tabla
    this.updateTableData();
  }

  /**
   * Calcula el total de los valores en la tabla
   */
  calculateTotal(): void {
    // Calcular totales por vigencia
    this.totalValue = 0;
    this.selectedYears.forEach(year => {
      const yearTotal = this.tableData.reduce((sum: number, item: any) => {
        return sum + (item[`vigencia_${year}`] || 0);
      }, 0);
      this.totalValue += yearTotal;
    });
  }

  /**
   * Obtiene el total para un año específico
   */
  getYearTotal(year: string): number {
    return this.tableData.reduce((sum: number, item: any) => {
      return sum + (item[`vigencia_${year}`] || 0);
    }, 0);
  }

  /**
   * Evento cuando cambian las vigencias seleccionadas
   */
  onVigenciaChange(event: MultiSelectChangeEvent): void {
    console.log('Vigencias seleccionadas:', event.value);
    this.selectedYears = event.value;
    
    // Activar indicadores de carga
    this.isLoadingChart = true;
    this.isLoadingTable = true;
    
    this.loadSgpHistoricoFromApi();
    
    // Actualizar ancho de tabla después de un breve delay para asegurar que se renderice
    setTimeout(() => {
      this.updateTableWidth();
    }, 200);
  }

  /**
   * Evento cuando cambia el departamento seleccionado
   */
  onDepartmentChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.departmentSelected = event.value;
    
    // Activar indicadores de carga
    this.isLoadingChart = true;
    this.isLoadingTable = true;
    
    this.loadSgpData();
    this.loadTownsForDepartment();
  }

  /**
   * Evento cuando cambia el municipio seleccionado
   */
  onTownChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.townSelected = event.value;
    
    // Activar indicadores de carga
    this.isLoadingChart = true;
    this.isLoadingTable = true;
    
    // Recargar datos con el nuevo municipio seleccionado
    this.loadSgpData();
  }

  /**
   * Aplica los filtros seleccionados
   */
  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencias:', this.selectedYears);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    
    // Activar indicadores de carga
    this.isLoadingChart = true;
    this.isLoadingTable = true;
    
    this.loadSgpHistoricoFromApi();
    this.updateCharts();
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.selectedYears = [];
    this.departmentSelected = '';
    this.townSelected = '';
    this.towns = []; // Limpiar municipios
    
    // Regenerar años disponibles y selección por defecto
    this.generateAvailableYears();
    this.initializeDefaultSelection();
    this.loadSgpHistoricoFromApi();
  }

  /**
   * Exporta los datos a Excel
   */
  exportToExcel(): void {
    console.log('Exportando a Excel...');
    // Aquí iría la lógica para exportar a Excel
  }

  /**
   * Exporta los datos a PDF
   */
  exportToPDF(): void {
    console.log('Exportando a PDF...');
    // Aquí iría la lógica para exportar a PDF
  }

  /**
   * Actualiza los datos de la tabla según los filtros
   */
  private updateTableData(): void {
    if (this.selectedYears.length === 0) {
      this.tableData = [];
      this.totalValue = 0;
      return;
    }

    // Crear estructura de datos por concepto con columnas dinámicas por vigencia
    const conceptos = ['Educación', 'Salud', 'Agua Potable', 'Propósito General', 'Asignaciones Especiales'];
    
    this.tableData = conceptos.map(concepto => {
      const rowData: any = { concepto: concepto };
      
      // Agregar columna para cada vigencia seleccionada
      this.selectedYears.forEach(year => {
        // Obtener datos reales del año si están disponibles, sino usar valores de ejemplo
        const yearData = this.infoResume.find((item: any) => item.year === year);
        const baseValue = yearData ? parseInt(yearData.budget) : 50000000000;
        
        // Calcular valores diferentes por concepto (distribución aproximada del SGP)
        let value = 0;
        switch (concepto) {
          case 'Educación':
            value = Math.round(baseValue * 0.58); // 58% del SGP
            break;
          case 'Salud':
            value = Math.round(baseValue * 0.24); // 24% del SGP
            break;
          case 'Agua Potable':
            value = Math.round(baseValue * 0.05); // 5% del SGP
            break;
          case 'Propósito General':
            value = Math.round(baseValue * 0.11); // 11% del SGP
            break;
          case 'Asignaciones Especiales':
            value = Math.round(baseValue * 0.02); // 2% del SGP
            break;
        }
        
        rowData[`vigencia_${year}`] = value;
      });
      
      return rowData;
    });

    this.calculateTotal();
  }

  /**
   * Construye la estructura de datos para el TreeTable basada en los datos del API
   */
  buildTreeTableData(): void {
    if (!this.historicoApiData || this.historicoApiData.length === 0) {
      this.treeTableData = [];
      return;
    }

    // Filtrar registros excluyendo id_concepto = 99
    const filteredData = this.historicoApiData.filter(item => item.id_concepto !== '99');

    // Obtener conceptos únicos (sin duplicar por años)
    const uniqueConceptos = new Map<string, any>();
    filteredData.forEach(item => {
      if (!uniqueConceptos.has(item.id_concepto)) {
        uniqueConceptos.set(item.id_concepto, {
          id_concepto: item.id_concepto,
          concepto: item.concepto
        });
      }
    });

    // Agrupar datos por concepto padre (primeros 4 dígitos del id_concepto)
    const conceptosMap = new Map<string, TreeNode>();
    
    // Procesar conceptos únicos
    uniqueConceptos.forEach((conceptoInfo, conceptoId) => {
      const conceptoPadreId = conceptoId.substring(0, 4);
      const isConceptoPadre = conceptoId.length === 4;
      
      if (isConceptoPadre) {
        // Es un concepto padre
        if (!conceptosMap.has(conceptoPadreId)) {
          const nodeData: any = {
            concepto: conceptoInfo.concepto,
            id_concepto: conceptoId
          };
          
          // Agregar columnas dinámicas por vigencia
          this.selectedYears.forEach(year => {
            const yearData = filteredData.find(d => 
              d.id_concepto === conceptoId && d.annio?.toString() === year
            );
            nodeData[`vigencia_${year}`] = yearData?.total_corrientes || 0;
          });

          conceptosMap.set(conceptoPadreId, {
            key: conceptoPadreId,
            data: nodeData,
            children: [],
            expanded: false
          });
        }
      } else {
        // Es un concepto hijo
        if (!conceptosMap.has(conceptoPadreId)) {
          // Crear concepto padre si no existe
          const parentNodeData: any = {
            concepto: `Concepto ${conceptoPadreId}`,
            id_concepto: conceptoPadreId
          };
          
          conceptosMap.set(conceptoPadreId, {
            key: conceptoPadreId,
            data: parentNodeData,
            children: [],
            expanded: false
          });
        }
        
        // Verificar si el hijo ya existe
        const parentNode = conceptosMap.get(conceptoPadreId)!;
        const existingChild = parentNode.children!.find(child => child.key === conceptoId);
        
        if (!existingChild) {
          // Crear concepto hijo solo si no existe
          const childData: any = {
            concepto: conceptoInfo.concepto,
            id_concepto: conceptoId
          };
          
          // Agregar columnas dinámicas por vigencia para el hijo
          this.selectedYears.forEach(year => {
            const yearData = filteredData.find(d => 
              d.id_concepto === conceptoId && d.annio?.toString() === year
            );
            childData[`vigencia_${year}`] = yearData?.total_corrientes || 0;
          });
          
          const childNode: TreeNode = {
            key: conceptoId,
            data: childData,
            leaf: true
          };
          
          parentNode.children!.push(childNode);
        }
      }
    });

    this.treeTableData = Array.from(conceptosMap.values());
    console.log('Tree table data:', this.treeTableData);
    this.calculateTreeTableTotal();
    
    // Actualizar gráfico con los nuevos datos
    this.updateStackedBarChart();
    
    // Actualizar ancho de tabla
    setTimeout(() => {
      this.updateTableWidth();
    }, 100);
  }

  /**
   * Calcula el total para el TreeTable
   */
  calculateTreeTableTotal(): void {
    this.totalValue = 0;
    this.selectedYears.forEach(year => {
      const yearTotal = this.getTreeTableYearTotal(year);
      this.totalValue += yearTotal;
    });
  }

  /**
   * Obtiene el total para un año específico en el TreeTable
   */
  getTreeTableYearTotal(year: string): number {
    let total = 0;
    this.treeTableData.forEach((node: TreeNode) => {
      // Solo sumar conceptos padre para evitar duplicar
      total += node.data[`vigencia_${year}`] || 0;
    });
    return total;
  }

  /**
   * Actualiza los gráficos según los filtros
   */
  private updateCharts(): void {
    console.log('Actualizando gráfico para años:', this.selectedYears);
    this.updateStackedBarChart();
  }

  /**
   * Carga los municipios para el departamento seleccionado
   */
  private loadTownsForDepartment(): void {
    if (!this.departmentSelected || this.territorialEntities.length === 0) {
      this.towns = [];
      this.townSelected = '';
      return;
    }

    console.log('Cargando municipios para departamento:', this.departmentSelected);
    
    // Transformar código del departamento: remover cero a la izquierda y agregar tres ceros
    const departmentCode = this.departmentSelected.replace(/^0+/, '') + '000';
    const departmentCodeNumber = parseInt(departmentCode);
    
    console.log('Código transformado:', departmentCodeNumber);
    
    // Filtrar municipios por codPadre y excluir el departamento mismo
    this.towns = this.territorialEntities
      .filter(entity => 
        entity.codPadre === departmentCodeNumber && 
        entity.codigo !== departmentCodeNumber
      )
      .map(entity => ({
        name: entity.entidad,
        value: entity.codigo2 || entity.codigo
      }));
    
    console.log('Municipios encontrados:', this.towns);
    this.townSelected = '';
  }

  /**
   * Actualiza el ancho dinámico de la tabla basado en el número de vigencias
   */
  updateTableWidth(): void {
    if (!this.treeTable || !this.treeTable.el) return;

    const scrollableView = this.treeTable.el.nativeElement.querySelector('.p-treetable-scrollable-view');
    if (!scrollableView) return;

    // Ancho base de 1199px para hasta 6 vigencias
    const baseWidth = 1199;
    
    if (this.selectedYears.length <= 6) {
      scrollableView.style.width = `${baseWidth}px`;
    } else {
      // Cada vigencia adicional suma 225px
      const additionalColumns = this.selectedYears.length - 6;
      const additionalWidth = additionalColumns * 225;
      const totalWidth = baseWidth + additionalWidth;
      scrollableView.style.width = `${totalWidth}px`;
    }

    console.log(`Table width updated: ${scrollableView.style.width} for ${this.selectedYears.length} vigencias`);
  }

  /**
   * Inicializa las opciones para las gráficas de barras evolutivas
   */
  initializeBarChartsOptions(): void {
    this.mixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: .95,
      scales: {
        y: {
          beginAtZero: true,
          position: 'left',
          ticks: {
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
                useGrouping: true
              }).format(value).replace(/,/g, '.');
            }
          }
        },
        y1: {
          beginAtZero: true,
          position: 'right',
          grid: { drawOnChartArea: false },
          title: { display: true, text: 'Variación anual (%)' }
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (context.dataset.yAxisID === 'y1') {
                return label + ': ' + context.parsed.y + '%';
              } else {
                return label + ': ' + new Intl.NumberFormat('es-CO').format(context.parsed.y);
              }
            }
          }
        },
        datalabels: { display: false }
      }
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: .95,
      scales: {
        x: {          
        },
        y: {          
          ticks: {
            callback: function(value: any) {
              return new Intl.NumberFormat('es-CO', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
                useGrouping: true
              }).format(value).replace(/,/g, '.');
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Variación anual (%)'
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value: any) {
              return value + '%';
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context: any) {
              let label = context.dataset.label || '';
              if (context.dataset.yAxisID === 'y1') {
                return label + ': ' + context.parsed.y + '%';
              } else {
                return label + ': ' + new Intl.NumberFormat('es-CO').format(context.parsed.y);
              }
            }
          }
        },
        datalabels: { display: false }
      }
    };
  }

  /**
   * Carga datos históricos para las gráficas evolutivas
   */
  loadSgpHistoricoDataForEvolution(): void {
    console.log("loadSgpHistoricoDataForEvolution...");
    const aniosString = this.yearsRange.join(',');
    
    this.sicodisApiService.getSgpResumenHistorico({ anios: aniosString }).subscribe({
      next: (result: any) => {
        console.log('Historico data for evolution:', result);
        this.initializeChartsWithHistoricoData(result);
      },
      error: (error) => {
        console.error('Error loading SGP historico for evolution:', error);
        // Usar datos generados en caso de error
        this.initializeChartsWithGeneratedData();
      }
    });
  }

  generateGrowingData(startValue: number, endValue: number, length: number): number[] {
    const data = [];
    const increment = (endValue - startValue) / (length - 1);
    for (let i = 0; i < length; i++) {
      const randomFactor = 0.9 + Math.random() * 0.2; // Variación aleatoria ±10%
      data.push(Math.round((startValue + increment * i) * randomFactor));
    }
    data[data.length - 1] = endValue; // Asegurar valor final
    return data;
  }

  generateVariationData(baseData: number[]): number[] {
    const variations = [5]; // Primera variación
    for (let i = 1; i < baseData.length; i++) {
      const variation = ((baseData[i] - baseData[i-1]) / baseData[i-1]) * 100;
      variations.push(Math.round(variation));
    }
    return variations;
  }

  /**
   * Calcula la variación anual porcentual entre años consecutivos
   * @param baseData Array de datos base para calcular variaciones
   * @returns Array de variaciones porcentuales
   */
  calculateVariationData(baseData: number[]): number[] {
    const variations: number[] = [0]; // Primer valor nulo (no hay año anterior)
    
    for (let i = 1; i < baseData.length; i++) {
      const prevValue = baseData[i-1];
      const currentValue = baseData[i];
      
      if (prevValue === 0 || currentValue === 0) {
        // Si algún valor es 0, no se puede calcular variación válida
        variations.push(0);
      } else {
        const variation = ((currentValue - prevValue) / prevValue) * 100;
        // Redondear a 2 decimales
        variations.push(Math.round(variation * 100) / 100);
      }
    }
    
    return variations;
  }

  initializeChartsWithHistoricoData(historicoData: any[]): void {
    // Filtrar solo los registros con id_concepto = '99' que corresponden al total
    let totalData: any = {};
    historicoData.forEach((item: any) => {
      if (item.id_concepto === '99'){        
        totalData[item.annio] = {corrientes: item.total_corrientes, constantes: item.total_constantes};        
      }
    });

    const sgpDataCorrientes = this.yearsRange.map(year => 
      (totalData[parseInt(year)]?.corrientes || 0) // Valores en pesos
    );
    
    // Calcular la variación anual basada en los datos reales
    const variationDataCorrientes = this.calculateVariationData(sgpDataCorrientes);

    console.log('SGP Data Corrientes:', sgpDataCorrientes);
    console.log('Variation Data Corrientes:', variationDataCorrientes);

    this.chartData1 = {
      labels: this.yearsRange,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationDataCorrientes,
          borderColor: '#0f4987',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpDataCorrientes,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    this.initChart3WithHistoricoData(totalData);
  }

  initializeChartsWithGeneratedData(): void {
    const sgpDataCorrientes = this.generateGrowingData(20000000000, 85000000000, this.yearsRange.length); // Valores en pesos
    const variationDataCorrientes = this.generateVariationData(sgpDataCorrientes);

    this.chartData1 = {
      labels: this.yearsRange,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationDataCorrientes,
          borderColor: '#0f4987',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpDataCorrientes,
          backgroundColor: '#FF8C00',
          yAxisID: 'y'
        }
      ]
    };

    this.initChart3();
  }

  initChart3WithHistoricoData(dataByYear: any): void {
    const sgpData = this.yearsRange.map(year => 
      (dataByYear[parseInt(year)]?.constantes || 0) // Valores en pesos
    );
    
    // Calcular la variación anual basada en los datos reales de precios constantes
    const variationData = this.calculateVariationData(sgpData);

    console.log('SGP Data Constantes:', sgpData);
    console.log('Variation Data Constantes:', variationData);

    this.chartData3 = {
      labels: this.yearsRange,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#FF1493',
          backgroundColor: 'rgba(255, 20, 147, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpData,
          backgroundColor: '#0f4987',
          borderColor: '#007BFF',
          yAxisID: 'y'
        }        
      ]
    };
  }

  initChart3(): void {
    const sgpData = this.generateGrowingData(15000000000, 78000000000, this.years2005to2025.length); // Valores en pesos
    const variationData = this.generateVariationData(sgpData);

    this.chartData3 = {
      labels: this.years2005to2025,
      datasets: [
        {
          type: 'line',
          label: 'Variación Anual',
          data: variationData,
          borderColor: '#FF1493',
          backgroundColor: 'rgba(255, 20, 147, 0.1)',
          fill: false,
          yAxisID: 'y1'
        },
        {
          type: 'bar',
          label: 'SGP',
          data: sgpData,
          backgroundColor: '#0f4987',
          borderColor: '#007BFF',
          yAxisID: 'y'
        }        
      ]
    };
  }
}