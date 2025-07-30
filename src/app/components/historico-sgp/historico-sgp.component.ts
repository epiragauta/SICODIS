import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { TreeNode, MenuItem } from 'primeng/api';

import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';
import { HttpClient } from '@angular/common/http';
import { SicodisApiService } from '../../services/sicodis-api.service';

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
    NumberFormatPipe
  ],
  templateUrl: './historico-sgp.component.html',
  styleUrl: './historico-sgp.component.scss'
})
export class HistoricoSgpComponent implements OnInit {
  
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

  // Variables para gráficos
  chartData5Left: any; // Evolución Educación SGP - Precios Corrientes
  chartData5Right: any; // Evolución Educación SGP - Precios Constantes
  chartData6Left: any; // Evolución Salud SGP - Precios Corrientes
  chartData6Right: any; // Evolución Salud SGP - Precios Constantes
  chartData7Left: any; // Evolución Agua Potable SGP - Precios Corrientes
  chartData7Right: any; // Evolución Agua Potable SGP - Precios Constantes
  chartData8Left: any; // Evolución Propósito General SGP - Precios Corrientes
  chartData8Right: any; // Evolución Propósito General SGP - Precios Constantes
  chartData9Left: any; // Evolución Asignaciones Especiales SGP - Precios Corrientes
  chartData9Right: any; // Evolución Asignaciones Especiales SGP - Precios Constantes

  // Opciones para los gráficos
  smallMixedChartOptions: any;

  constructor(private breakpointObserver: BreakpointObserver, private http: HttpClient, private sicodisApiService: SicodisApiService) {
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
    this.generateAvailableYears();
    this.initializeDefaultSelection();
    this.loadSgpData();
    this.loadTerritorialEntities();
    this.initializeChartOptions();
    this.initializeAllCharts();
    console.log('Historico SGP Component initialized');
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
      },
      error: (error) => {
        console.error('Error loading SGP historico from API:', error);
        // Fallback con datos de ejemplo
        console.log('Error en API, creando datos de ejemplo');
        this.createSampleTreeData();
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
    
    // Tomar los primeros 4 años (ya están ordenados descendente)
    const defaultYears = this.availableYears
      .slice(0, 4)
      .map((item: any) => item.year);
    
    this.selectedYears = defaultYears;
    this.infoResume = this.availableYears;
    console.log('Años seleccionados por defecto:', this.selectedYears);
  }

  /**
   * Inicializa las opciones de los gráficos
   */
  initializeChartOptions(): void {
    this.smallMixedChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Años'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Miles de millones COP'
          },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          position: 'bottom' as const,
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: '#004583',
          borderWidth: 1
        }
      }
    };
  }

  /**
   * Inicializa todos los gráficos con datos de ejemplo
   */
  initializeAllCharts(): void {
    const years = ['2020', '2021', '2022', '2023', '2024'];
    
    // Datos de ejemplo para Educación
    this.chartData5Left = {
      labels: years,
      datasets: [
        {
          label: 'Educación SGP (Corrientes)',
          data: [25000, 27000, 28500, 30000, 32000],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData5Right = {
      labels: years,
      datasets: [
        {
          label: 'Educación SGP (Constantes)',
          data: [23000, 24500, 25200, 26000, 27500],
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Salud
    this.chartData6Left = {
      labels: years,
      datasets: [
        {
          label: 'Salud SGP (Corrientes)',
          data: [24000, 26000, 27500, 29000, 31000],
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData6Right = {
      labels: years,
      datasets: [
        {
          label: 'Salud SGP (Constantes)',
          data: [22000, 23500, 24200, 25000, 26500],
          borderColor: '#9966FF',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Agua Potable
    this.chartData7Left = {
      labels: years,
      datasets: [
        {
          label: 'Agua Potable SGP (Corrientes)',
          data: [6000, 6500, 6800, 7000, 7200],
          borderColor: '#FF9F40',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData7Right = {
      labels: years,
      datasets: [
        {
          label: 'Agua Potable SGP (Constantes)',
          data: [5500, 5900, 6000, 6100, 6300],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Propósito General
    this.chartData8Left = {
      labels: years,
      datasets: [
        {
          label: 'Propósito General SGP (Corrientes)',
          data: [7000, 7500, 7800, 8000, 8300],
          borderColor: '#4BC0C0',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData8Right = {
      labels: years,
      datasets: [
        {
          label: 'Propósito General SGP (Constantes)',
          data: [6500, 6800, 6900, 7000, 7200],
          borderColor: '#36A2EB',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.4
        }
      ]
    };

    // Datos de ejemplo para Asignaciones Especiales
    this.chartData9Left = {
      labels: years,
      datasets: [
        {
          label: 'Asignaciones Especiales SGP (Corrientes)',
          data: [2000, 2200, 2400, 2500, 2600],
          borderColor: '#9966FF',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4
        }
      ]
    };

    this.chartData9Right = {
      labels: years,
      datasets: [
        {
          label: 'Asignaciones Especiales SGP (Constantes)',
          data: [1800, 2000, 2100, 2200, 2300],
          borderColor: '#FF9F40',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4
        }
      ]
    };
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
    this.loadSgpHistoricoFromApi();
  }

  /**
   * Evento cuando cambia el departamento seleccionado
   */
  onDepartmentChange(event: SelectChangeEvent): void {
    console.log('Departamento seleccionado:', event.value);
    this.departmentSelected = event.value;
    this.loadTownsForDepartment();
  }

  /**
   * Evento cuando cambia el municipio seleccionado
   */
  onTownChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.townSelected = event.value;
  }

  /**
   * Aplica los filtros seleccionados
   */
  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencias:', this.selectedYears);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
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
    this.initializeTableData();
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

    // Agrupar datos por concepto padre (primeros 4 dígitos del id_concepto)
    const conceptosMap = new Map<string, TreeNode>();
    
    this.historicoApiData.forEach(item => {
      const conceptoPadreId = item.id_concepto.substring(0, 4);
      const isConceptoPadre = item.id_concepto.length === 4;
      
      if (isConceptoPadre) {
        // Es un concepto padre
        if (!conceptosMap.has(conceptoPadreId)) {
          const nodeData: any = {
            concepto: item.concepto,
            id_concepto: item.id_concepto
          };
          
          // Agregar columnas dinámicas por vigencia
          this.selectedYears.forEach(year => {
            const yearData = this.historicoApiData.find(d => 
              d.id_concepto === item.id_concepto && d.annio?.toString() === year
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
        
        // Crear concepto hijo
        const childData: any = {
          concepto: item.concepto,
          id_concepto: item.id_concepto
        };
        
        // Agregar columnas dinámicas por vigencia para el hijo
        this.selectedYears.forEach(year => {
          const yearData = this.historicoApiData.find(d => 
            d.id_concepto === item.id_concepto && d.annio?.toString() === year
          );
          childData[`vigencia_${year}`] = yearData?.total_corrientes || 0;
        });
        
        const childNode: TreeNode = {
          key: item.id_concepto,
          data: childData,
          leaf: true
        };
        
        conceptosMap.get(conceptoPadreId)!.children!.push(childNode);
      }
    });

    this.treeTableData = Array.from(conceptosMap.values());
    console.log('Tree table data:', this.treeTableData);
    this.calculateTreeTableTotal();
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
    if (this.selectedYears.length === 0) {
      this.initializeAllCharts();
      return;
    }

    // Actualizar gráficos con datos filtrados
    console.log('Actualizando gráficos para años:', this.selectedYears);
    // Aquí iría la lógica para actualizar los gráficos según los filtros
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
}