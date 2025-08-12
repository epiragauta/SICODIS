import { CommonModule } from '@angular/common';
import { Component, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FloatLabel } from 'primeng/floatlabel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Select, SelectChangeEvent } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { TreeNode } from 'primeng/api';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-sgp-comparativa',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    TableModule,
    TreeTableModule,
    ButtonModule,
    Select,
    FloatLabel,
    ChartModule,
    CardModule,
    ProgressSpinnerModule,
    NumberFormatPipe
  ],
  templateUrl: './sgp-comparativa.component.html',
  styleUrl: './sgp-comparativa.component.scss'
})
export class SgpComparativaComponent {

  selected: string = '2025';
  selectedYears: string[] = [];
  departmentSelected: string = '';
  townSelected: string = '';
  townSelected2: string = '';
  tableClass = "p-datatable-sm";
  
  // Lista de años disponibles
  availableYears: any[] = [];
  territorialEntities: any[] = [];

  // Propiedades para TreeTable
  treeTableData: TreeNode[] = [];
  treeTableData2: TreeNode[] = [];
  historicoApiData: any[] = [];

  barChartInstance: any;
  barChart2Instance: any;
  infoToResume: any = {};

  infoResume: any = [
    {
      year: '2025',
      budget: '75540879911189',
      budgetDistributed: '70540879911189',
      pending: 5000000000000,
      percent: .93,
    },
    {
      year: '2024',
      budget: '70540879911189',
      budgetDistributed: '70540879911189',
      pending: 0,
      percent: .75,
    },
    {
      year: '2023',
      budget: '54936407931948',
      budgetDistributed: '54936407931948',
      pending: 0,
      percent: .68,
    },
    {
      year: '2022',
      budget: '49564897462512',
      budgetDistributed: '49564897462512',
      pending: 0,
      percent: .99,
    },
    {
      year: '2021',
      budget: '47675273699939',
      budgetDistributed: '47675273699939',
      pending: 0,
      percent: .98,
    },
    {
      year: '2020',
      budget: '43847390906182',
      budgetDistributed: '43847390906182',
      pending: 0,
      percent: 1,
    },
  ];

  departments = departamentos;
  towns: any = [
    { name: 'Municipio1', value: '1' },
    { name: 'Municipio2', value: '2' },
    { name: 'Municipio3', value: '3' },
    { name: 'Municipio4', value: '4' },
    { name: 'Municipio5', value: '5' },
    { name: 'Municipio6', value: '6' },
    { name: 'Municipio7', value: '7' },
    { name: 'Municipio8', value: '8' },
    { name: 'Municipio9', value: '9' },
    { name: 'Municipio10', value: '10' },
    { name: 'Municipio11', value: '11' },
    { name: 'Municipio12', value: '12' },
  ];

  towns2: any = [
    { name: 'Municipio2-1', value: '21' },
    { name: 'Municipio2-2', value: '22' },
    { name: 'Municipio2-3', value: '23' },
    { name: 'Municipio2-4', value: '24' },
    { name: 'Municipio2-5', value: '25' },
    { name: 'Municipio2-6', value: '26' },
    { name: 'Municipio2-7', value: '27' },
    { name: 'Municipio2-8', value: '28' },
    { name: 'Municipio2-9', value: '29' },
    { name: 'Municipio2-10', value: '30' },
    { name: 'Municipio2-11', value: '31' },
    { name: 'Municipio2-12', value: '32' },
  ];

  distributionData: any = [];

  constructor(private renderer: Renderer2, private sicodisApiService: SicodisApiService) {}
  
  ngOnInit(): void {
    this.generateAvailableYears();
    this.initializeDefaultSelection();
    
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === this.selected
    )[0];
    
    // Crear los gráficos después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 500);

    // Cargar datos de la tabla
    this.loadSgpData();
    this.loadDistributionData();
    this.loadSgpData2(); 

    console.log('Component initialized');
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
   * Inicializa la selección predeterminada
   */
  initializeDefaultSelection(): void {
    if (this.availableYears.length === 0) return;
    
    this.selectedYears = [this.selected];
    this.infoResume = this.availableYears;
    console.log('Años seleccionados por defecto:', this.selectedYears);
  }

  /**
   * Crea el gráfico de barras verticales para conceptos principales
   */
  createBarChart(): void {
    try {
      const ctx = this.renderer.selectRootElement('#barChart') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element not found');
        return;
      }

      const mainConcepts = this.getMainConcepts();
      if (mainConcepts.length === 0) {
        console.log('No hay conceptos principales para mostrar');
        return;
      }

      // Preparar datos para la gráfica
      const labels = mainConcepts.map(concept => concept.concepto);
      const data = mainConcepts.map(concept => concept.valor); // Valores en pesos
      const percentages = mainConcepts.map(concept => concept.porcentaje);

      // Destruir la instancia anterior si existe
      if (this.barChartInstance) {
        this.barChartInstance.destroy();
      }

      // Generar tonos de verde para cada barra
      const greenColors = this.generateGreenColors(data.length);

      this.barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Valor (Pesos)',
              data: data,
              backgroundColor: greenColors,
              /*borderColor: greenColors.map(color => this.darkenColor(color, 20)),*/
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: .5,          
          scales: {
            x: {
                              title: {
                  display: true,
                  text: 'Conceptos Principales',
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 0,
                  font: {
                    size: 14
                  }
                }
            },
            y: {
                title: {
                  display: true,
                  text: 'Pesos',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                },
                beginAtZero: true,
                ticks: {
                  callback: function(value: any) {
                    return new Intl.NumberFormat('es-CO', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1
                    }).format(value);
                  }
                }
            }
          },
          plugins: {
            legend: {
              display: false
            },
                          tooltip: {
                callbacks: {
                  label: function(context: any) {
                    const index = context.dataIndex;
                    const value = new Intl.NumberFormat('es-CO', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1
                    }).format(context.parsed.y);
                    const percentage = parseFloat(percentages[index]).toFixed(1);
                    return [
                      `Valor: ${value} pesos`,
                      `Porcentaje: ${percentage}% del total`
                    ];
                  }
                }
              }
          }
        }
      });
    } catch (error) {
      console.error('Error creating bar chart:', error);
    }
  }

  /**
   * Crea el segundo gráfico de barras verticales para el segundo municipio
   */
  createBarChart2(): void {
    try {
      const ctx = this.renderer.selectRootElement('#barChart2') as HTMLCanvasElement;
      if (!ctx) {
        console.error('Canvas element barChart2 not found');
        return;
      }

      const mainConcepts = this.getMainConcepts2();
      if (mainConcepts.length === 0) {
        console.log('No hay conceptos principales para mostrar en el segundo gráfico');
        return;
      }

      // Preparar datos para la gráfica
      const labels = mainConcepts.map(concept => concept.concepto);
      const data = mainConcepts.map(concept => concept.valor); // Valores en pesos
      const percentages = mainConcepts.map(concept => concept.porcentaje);

      // Destruir la instancia anterior si existe
      if (this.barChart2Instance) {
        this.barChart2Instance.destroy();
      }

      // Generar tonos de azul para cada barra (diferente del primer gráfico)
      const blueColors = this.generateBlueColors(data.length);

      this.barChart2Instance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Valor (Pesos)',
              data: data,
              backgroundColor: blueColors,
              borderWidth: 1,
              borderRadius: 4,
              borderSkipped: false,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: .5,          
          scales: {
            x: {
              title: {
                display: true,
                text: 'Conceptos Principales',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 14
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Pesos',
                font: {
                  size: 12,
                  weight: 'bold'
                }
              },
              beginAtZero: true,
              ticks: {
                callback: function(value: any) {
                  return new Intl.NumberFormat('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                  }).format(value);
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context: any) {
                  const index = context.dataIndex;
                  const value = new Intl.NumberFormat('es-CO', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 1
                  }).format(context.parsed.y);
                  const percentage = parseFloat(percentages[index]).toFixed(1);
                  return [
                    `Valor: ${value} pesos`,
                    `Porcentaje: ${percentage}% del total`
                  ];
                }
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating second bar chart:', error);
    }
  }

  /**
   * Genera una paleta de colores verdes
   */
  generateGreenColors(count: number): string[] {
    const baseColors = [
      '#447721ff', // Verde muy oscuro
      '#529767ff', // Verde oscuro
      '#6dba6dff', // Verde medio
      '#95dc43ff', // Verde claro
      '#aff04eff', // Verde muy claro
      '#d6fad7ff'  // Verde pastel
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Si necesitamos más colores, generar variaciones
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const baseIndex = i % baseColors.length;
      colors.push(this.adjustColorBrightness(baseColors[baseIndex], 10 + (i * 5)));
    }

    return colors.slice(0, count);
  }

  /**
   * Genera una paleta de colores azules para el segundo gráfico
   */
  generateBlueColors(count: number): string[] {
    const baseColors = [
      '#0f4987ff', // Azul muy oscuro
      '#1e5ca8ff', // Azul oscuro
      '#2d6fcaff', // Azul medio
      '#4285d6ff', // Azul medio claro
      '#6ba3e6ff', // Azul claro
      '#a4c7f0ff'  // Azul muy claro
    ];

    if (count <= baseColors.length) {
      return baseColors.slice(0, count);
    }

    // Si necesitamos más colores, generar variaciones
    const colors = [...baseColors];
    for (let i = baseColors.length; i < count; i++) {
      const baseIndex = i % baseColors.length;
      colors.push(this.adjustColorBrightness(baseColors[baseIndex], 10 + (i * 5)));
    }

    return colors.slice(0, count);
  }

  /**
   * Oscurece un color en un porcentaje dado
   */
  darkenColor(color: string, percent: number): string {
    return this.adjustColorBrightness(color, -percent);
  }

  /**
   * Ajusta el brillo de un color
   */
  adjustColorBrightness(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  /**
   * Obtiene los conceptos principales (>2% del total y que no sean hijos)
   */
  getMainConcepts(): any[] {
    if (!this.treeTableData || this.treeTableData.length === 0) {
      return [];
    }

    const totalGeneral = this.getTreeTableYearTotal();
    const threshold = totalGeneral * 0.02; // 2% del total

    // Filtrar solo conceptos padre (no hijos) que superen el 2%
    const mainConcepts = this.treeTableData
      .filter((node: TreeNode) => {
        const value = node.data.vigencia || 0;
        return value >= threshold; // Solo conceptos que superen el 2%
      })
      .map((node: TreeNode) => ({
        concepto: node.data.concepto,
        valor: node.data.vigencia || 0,
        porcentaje: ((node.data.vigencia || 0) / totalGeneral * 100).toFixed(1)
      }))
      .sort((a, b) => b.valor - a.valor); // Ordenar de mayor a menor

    console.log('Conceptos principales (>2%):', mainConcepts);
    return mainConcepts;
  }

  /**
   * Obtiene los conceptos principales para el segundo municipio (>2% del total y que no sean hijos)
   */
  getMainConcepts2(): any[] {
    // Por ahora usamos datos de ejemplo para el segundo municipio
    // En implementación real, aquí se filtrarían los datos específicos del segundo municipio
    
    if (!this.treeTableData || this.treeTableData.length === 0) {
      // Datos de ejemplo para el segundo gráfico con valores diferentes
      return [
        {
          concepto: 'Educación',
          valor: 28000000000000,
          porcentaje: '45.2'
        },
        {
          concepto: 'Salud',
          valor: 22000000000000,
          porcentaje: '35.5'
        },
        {
          concepto: 'Agua Potable',
          valor: 8000000000000,
          porcentaje: '12.9'
        },
        {
          concepto: 'Propósito General',
          valor: 4000000000000,
          porcentaje: '6.4'
        }
      ];
    }

    const totalGeneral = this.getTreeTableYearTotal();
    const threshold = totalGeneral * 0.02; // 2% del total

    // Por ahora usar los mismos datos pero con valores modificados
    // En implementación real, aquí se usarían datos específicos del segundo municipio
    const mainConcepts = this.treeTableData
      .filter((node: TreeNode) => {
        const value = (node.data.vigencia || 0) * 0.8; // Simular datos diferentes
        return value >= threshold;
      })
      .map((node: TreeNode) => ({
        concepto: node.data.concepto,
        valor: (node.data.vigencia || 0) * 0.8,
        porcentaje: (((node.data.vigencia || 0) * 0.8) / (totalGeneral * 0.8) * 100).toFixed(1)
      }))
      .sort((a, b) => b.valor - a.valor);

    console.log('Conceptos principales municipio 2 (>2%):', mainConcepts);
    return mainConcepts;
  }

  /**
   * Obtiene el total para la vigencia seleccionada
   */
  getTreeTableYearTotal(): number {
    let total = 0;
    this.treeTableData.forEach((node: TreeNode) => {
      total += node.data.vigencia || 0;
    });
    return total;
  }

  /**
   * Obtiene el total para la vigencia seleccionada del segundo municipio
   */
  getTreeTableYearTotal2(): number {
    let total = 0;
    this.treeTableData2.forEach((node: TreeNode) => {
      total += node.data.vigencia || 0;
    });
    return total;
  }

  /**
   * Exporta los datos a Excel
   */
  exportToExcel(): void {
    console.log('Exportando a Excel...');
    // Aquí iría la lógica para exportar a Excel
  }

  /**
   * Exporta los datos del segundo municipio a Excel
   */
  exportToExcel2(): void {
    console.log('Exportando datos del segundo municipio a Excel...');
    // Aquí iría la lógica para exportar a Excel del segundo municipio
  }

  /**
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selected = event.value;
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === event.value
    )[0];
    
    // Recrear los gráficos con los nuevos datos
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 500);
    
    // Recargar datos de la tabla
    this.loadSgpData();
    this.loadSgpData2();
    this.loadDistributionData();
    this.loadDataForYear();
  }

  /**
   * Carga los datos SGP para la tabla
   */
  loadSgpData(): void {
    const aniosString = this.selected;
    
    this.sicodisApiService.getSgpResumenHistorico({ anios: aniosString }).subscribe({
      next: (result: any[]) => {
        console.log('Datos SGP del API:', result);
        this.historicoApiData = result;
        if (result && result.length > 0) {
          this.buildTreeTableData();
        } else {
          console.log('No hay datos del API, creando datos de ejemplo');
          this.createSampleTreeData();
        }
      },
      error: (error) => {
        console.error('Error loading SGP data from API:', error);
        // Fallback con datos de ejemplo
        console.log('Error en API, creando datos de ejemplo');
        this.createSampleTreeData();
      }
    });
  }

  /**
   * Crea datos de ejemplo para probar la tabla
   */
  createSampleTreeData(): void {
    console.log('Creando datos de ejemplo para TreeTable');
    
    this.treeTableData = [
      {
        key: '0101',
        data: {
          concepto: 'Educación',
          id_concepto: '0101',
          vigencia: 35000000000000
        },
        children: [
          {
            key: '010101',
            data: {
              concepto: 'Prestación de Servicios',
              id_concepto: '010101',
              vigencia: 20000000000000
            },
            leaf: true
          },
          {
            key: '010102',
            data: {
              concepto: 'Calidad',
              id_concepto: '010102',
              vigencia: 15000000000000
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
          vigencia: 24000000000000
        },
        children: [
          {
            key: '010201',
            data: {
              concepto: 'Régimen Subsidiado',
              id_concepto: '010201',
              vigencia: 15000000000000
            },
            leaf: true
          }
        ],
        expanded: false
      }
    ];
    
    // Actualizar gráficos con datos de ejemplo
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 200);
  }

  /**
   * Carga los datos de distribuciones del SGP usando el API
   */
  loadDistributionData(): void {
    const selectedYear = parseInt(this.selected);
    
    this.sicodisApiService.getSgpResumenDistribuciones(selectedYear).subscribe({
      next: (result: any[]) => {
        console.log('Datos de distribuciones del API:', result);
        this.distributionData = result.map(item => ({
          id_distribucion: item.id_distribucion,
          fecha_distribucion: item.fecha_distribucion,
          nombre: item.nombre,
          tipo_distribucion: item.tipo_distribucion,
          anio: item.anio,
          descripcion: item.descripcion,
          total_distribucion: item.total_distribucion
        }));
      },
      error: (error) => {
        console.error('Error loading distribution data from API:', error);
        this.distributionData = [];
      }
    });
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
    this.filterDataByLocation();
  }

  /**
   * Evento cuando cambia el segundo municipio seleccionado
   */
  onTown2Change(event: SelectChangeEvent): void {
    console.log('Municipio 2 seleccionado:', event.value);
    this.townSelected2 = event.value;
    this.filterDataByLocation();
  }

  /**
   * Actualiza los datos cuando se presiona el botón Actualizar
   */
  updateData(): void {
    console.log('Actualizando datos...');
    console.log('Vigencia:', this.selected);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    console.log('Municipio 2:', this.townSelected2);
    
    // Aquí iría la lógica para actualizar los datos según los filtros seleccionados
    this.loadFilteredData();
  }

  /**
   * Aplica los filtros seleccionados
   */
  applyFilters(): void {
    console.log('Aplicando filtros...');
    console.log('Vigencia:', this.selected);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    console.log('Municipio 2:', this.townSelected2);
    
    this.loadFilteredData();
  }

  /**
   * Limpia los filtros seleccionados y recarga los datos
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.selected = '2025';
    this.departmentSelected = '';
    this.townSelected = '';
    this.townSelected2 = '';
    this.towns = [];
    
    // Reinicializar lista de municipios 2
    this.towns2 = [
      { name: 'Municipio2-1', value: '21' },
      { name: 'Municipio2-2', value: '22' },
      { name: 'Municipio2-3', value: '23' },
      { name: 'Municipio2-4', value: '24' },
      { name: 'Municipio2-5', value: '25' },
      { name: 'Municipio2-6', value: '26' },
      { name: 'Municipio2-7', value: '27' },
      { name: 'Municipio2-8', value: '28' },
      { name: 'Municipio2-9', value: '29' },
      { name: 'Municipio2-10', value: '30' },
      { name: 'Municipio2-11', value: '31' },
      { name: 'Municipio2-12', value: '32' },
    ];
    
    this.loadSgpData();
    this.loadSgpData2();
  }


  /**
   * Carga los datos para el año seleccionado
   */
  private loadDataForYear(): void {
    console.log('Cargando datos para el año:', this.selected);
    // Lógica para cargar datos específicos del año
  }

  /**
   * Carga los municipios para el departamento seleccionado
   */
  private loadTownsForDepartment(): void {
    if (!this.departmentSelected) {
      this.towns = [];
      this.townSelected = '';
      return;
    }

    console.log('Cargando municipios para departamento:', this.departmentSelected);
    // Aquí iría la lógica para cargar municipios del departamento seleccionado
    // Por ahora mantenemos la lista de ejemplo
  }

  /**
   * Filtra los datos por ubicación (departamento/municipios)
   */
  private filterDataByLocation(): void {
    console.log('Filtrando datos por ubicación');
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio 1:', this.townSelected);
    console.log('Municipio 2:', this.townSelected2);
    // Lógica para filtrar datos según departamento y municipios
  }

  /**
   * Carga los datos filtrados según todos los criterios seleccionados
   */
  private loadFilteredData(): void {
    console.log('Cargando datos filtrados');
    console.log('Criterios de filtrado:');
    console.log('- Vigencia:', this.selected);
    console.log('- Departamento:', this.departmentSelected);
    console.log('- Municipio 1:', this.townSelected);
    console.log('- Municipio 2:', this.townSelected2);
    
    // Aquí iría la lógica principal para cargar y filtrar todos los datos
    // según vigencia, departamento y ambos municipios seleccionados
    // Esto permitiría hacer comparaciones entre los dos municipios
  }

  /**
   * Carga los datos SGP para el segundo municipio
   */
  loadSgpData2(): void {
    const aniosString = this.selected;
    
    // Por ahora usar los mismos datos pero crear una copia para el segundo municipio
    this.sicodisApiService.getSgpResumenHistorico({ anios: aniosString }).subscribe({
      next: (result: any[]) => {
        console.log('Datos SGP del segundo municipio del API:', result);
        if (result && result.length > 0) {
          this.buildTreeTableData2(result);
        } else {
          console.log('No hay datos del API para el segundo municipio, creando datos de ejemplo');
          this.createSampleTreeData2();
        }
      },
      error: (error) => {
        console.error('Error loading SGP data for second municipality from API:', error);
        // Fallback con datos de ejemplo
        console.log('Error en API del segundo municipio, creando datos de ejemplo');
        this.createSampleTreeData2();
      }
    });
  }

  /**
   * Crea datos de ejemplo para la segunda tabla
   */
  createSampleTreeData2(): void {
    console.log('Creando datos de ejemplo para TreeTable del segundo municipio');
    
    this.treeTableData2 = [
      {
        key: '0201',
        data: {
          concepto: 'Educación',
          id_concepto: '0201',
          vigencia: 28000000000000
        },
        children: [
          {
            key: '020101',
            data: {
              concepto: 'Prestación de Servicios',
              id_concepto: '020101',
              vigencia: 16000000000000
            },
            leaf: true
          },
          {
            key: '020102',
            data: {
              concepto: 'Calidad',
              id_concepto: '020102',
              vigencia: 12000000000000
            },
            leaf: true
          }
        ],
        expanded: false
      },
      {
        key: '0202',
        data: {
          concepto: 'Salud',
          id_concepto: '0202',
          vigencia: 22000000000000
        },
        children: [
          {
            key: '020201',
            data: {
              concepto: 'Régimen Subsidiado',
              id_concepto: '020201',
              vigencia: 14000000000000
            },
            leaf: true
          }
        ],
        expanded: false
      },
      {
        key: '0203',
        data: {
          concepto: 'Agua Potable',
          id_concepto: '0203',
          vigencia: 8000000000000
        },
        children: [],
        expanded: false
      }
    ];
  }

  /**
   * Construye la estructura de datos para el TreeTable del segundo municipio
   */
  buildTreeTableData2(apiData: any[]): void {
    if (!apiData || apiData.length === 0) {
      this.treeTableData2 = [];
      return;
    }

    // Filtrar registros excluyendo id_concepto = 99
    const filteredData = apiData.filter(item => item.id_concepto !== '99');

    // Obtener conceptos únicos
    const uniqueConceptos = new Map<string, any>();
    filteredData.forEach(item => {
      if (!uniqueConceptos.has(item.id_concepto)) {
        uniqueConceptos.set(item.id_concepto, {
          id_concepto: item.id_concepto,
          concepto: item.concepto
        });
      }
    });

    // Agrupar datos por concepto padre
    const conceptosMap = new Map<string, TreeNode>();
    
    uniqueConceptos.forEach((conceptoInfo, conceptoId) => {
      const conceptoPadreId = conceptoId.substring(0, 4);
      const isConceptoPadre = conceptoId.length === 4;
      
      if (isConceptoPadre) {
        // Es un concepto padre
        if (!conceptosMap.has(conceptoPadreId)) {
          const nodeData: any = {
            concepto: conceptoInfo.concepto,
            id_concepto: conceptoId,
            // Simular datos diferentes multiplicando por 0.8
            vigencia: Math.round(this.getValueForYear(filteredData, conceptoId, this.selected) * 0.8)
          };

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
            id_concepto: conceptoPadreId,
            vigencia: 0
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
            id_concepto: conceptoId,
            // Simular datos diferentes multiplicando por 0.8
            vigencia: Math.round(this.getValueForYear(filteredData, conceptoId, this.selected) * 0.8)
          };
          
          const childNode: TreeNode = {
            key: conceptoId,
            data: childData,
            leaf: true
          };
          
          parentNode.children!.push(childNode);
        }
      }
    });

    this.treeTableData2 = Array.from(conceptosMap.values());
    console.log('Tree table data for second municipality:', this.treeTableData2);
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

    // Obtener conceptos únicos
    const uniqueConceptos = new Map<string, any>();
    filteredData.forEach(item => {
      if (!uniqueConceptos.has(item.id_concepto)) {
        uniqueConceptos.set(item.id_concepto, {
          id_concepto: item.id_concepto,
          concepto: item.concepto
        });
      }
    });

    // Agrupar datos por concepto padre
    const conceptosMap = new Map<string, TreeNode>();
    
    uniqueConceptos.forEach((conceptoInfo, conceptoId) => {
      const conceptoPadreId = conceptoId.substring(0, 4);
      const isConceptoPadre = conceptoId.length === 4;
      
      if (isConceptoPadre) {
        // Es un concepto padre
        if (!conceptosMap.has(conceptoPadreId)) {
          const nodeData: any = {
            concepto: conceptoInfo.concepto,
            id_concepto: conceptoId,
            vigencia: this.getValueForYear(filteredData, conceptoId, this.selected)
          };

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
            id_concepto: conceptoPadreId,
            vigencia: 0
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
            id_concepto: conceptoId,
            vigencia: this.getValueForYear(filteredData, conceptoId, this.selected)
          };
          
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
    
    // Actualizar gráficos después de construir los datos
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 200);
  }

  /**
   * Obtiene el valor para un concepto y año específico
   */
  getValueForYear(data: any[], conceptoId: string, year: string): number {
    const item = data.find(d => d.id_concepto === conceptoId && d.annio?.toString() === year);
    return item?.total_corrientes || 0;
  }

  /**
   * Método legacy para compatibilidad (puede ser removido)
   */
  optionChange(evt: any): void {
    console.log('Option change (legacy):', evt);
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === evt.value
    )[0];
    this.selected = evt.value;
    
    // Recrear los gráficos con los nuevos datos
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 500);
  }

}
