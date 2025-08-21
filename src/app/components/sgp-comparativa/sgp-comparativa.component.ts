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
import { SicodisApiService, FichaComparativaEntidad } from '../../services/sicodis-api.service';
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

  selected: number = 0; // Changed to number for id_vigencia
  selectedYears: string[] = [];
  departmentSelected: string = '';
  departmentSelected2: string = '';
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
  fichaComparativaData: FichaComparativaEntidad[] = [];
  
  // Estado de carga
  isLoadingComparativeData: boolean = false;

  barChartInstance: any;
  barChart2Instance: any;
  infoToResume: any = {};

  infoResume: any[] = [];

  departments = departamentos;
  towns: any[] = [];
  towns2: any[] = [];

  distributionData: any = [];

  constructor(private renderer: Renderer2, private sicodisApiService: SicodisApiService) {}
  
  ngOnInit(): void {
    this.loadVigencias();
    // Don't load any charts or data initially
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
   * Carga las vigencias disponibles desde la API
   */
  loadVigencias(): void {
    this.sicodisApiService.getSgpVigenciasPresupuestoUltimaOnce().subscribe({
      next: (vigencias) => {
        console.log('Vigencias cargadas:', vigencias);
        this.infoResume = vigencias;
        if (vigencias.length > 0) {
          this.selected = vigencias[0].id_vigencia;
          this.infoToResume = vigencias.find(v => v.id_vigencia === this.selected);
        }
      },
      error: (error) => {
        console.error('Error cargando vigencias:', error);
        this.infoResume = [];
      }
    });
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
      const labels = mainConcepts.map(concept => concept.concepto.split(' - ')[1]);
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
      const labels = mainConcepts.map(concept => concept.concepto.split(' - ')[1]);
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
   * Obtiene los conceptos principales (1.1 Educación, 1.2 Salud, 1.3 Agua Potable, 1.4 Propósito General)
   */
  getMainConcepts(): any[] {
    if (!this.fichaComparativaData || this.fichaComparativaData.length === 0) {
      return [];
    }

    // Definir los conceptos principales exactos
    const mainConcepts = [
      { id: '1.1', name: 'Educación' },
      { id: '1.2', name: 'Salud' },
      { id: '1.3', name: 'Agua Potable' },
      { id: '1.4', name: 'Propósito General' }
    ];
    
    const result = mainConcepts.map(concept => {
      // Buscar el concepto en los datos de la ficha comparativa
      // Extraer la parte antes del guión y comparar exactamente
      const foundItem = this.fichaComparativaData.find(item => {
        const conceptoText = item.Concepto.trim();
        const dashIndex = conceptoText.indexOf(' - ');
        
        if (dashIndex === -1) {
          return false;
        }
        
        const conceptCode = conceptoText.substring(0, dashIndex).trim();
        return conceptCode === concept.id;
      });
      
      return {
        concepto: `${concept.id} - ${concept.name}`,
        valor: foundItem ? foundItem.PeriodoVigencia_Entidad1 : 0,
        porcentaje: foundItem ? (foundItem.Porcentual_Entidad1 * 100).toFixed(1) : '0.0'
      };
    }).filter(item => item.valor > 0); // Solo incluir conceptos con valores

    console.log('Conceptos principales (1.1-1.4) Municipio 1:', result);
    return result;
  }

  /**
   * Obtiene los conceptos principales para el segundo municipio (1.1 Educación, 1.2 Salud, 1.3 Agua Potable, 1.4 Propósito General)
   */
  getMainConcepts2(): any[] {
    if (!this.fichaComparativaData || this.fichaComparativaData.length === 0) {
      return [];
    }

    // Definir los conceptos principales exactos
    const mainConcepts = [
      { id: '1.1', name: 'Educación' },
      { id: '1.2', name: 'Salud' },
      { id: '1.3', name: 'Agua Potable' },
      { id: '1.4', name: 'Propósito General' }
    ];
    
    const result = mainConcepts.map(concept => {
      // Buscar el concepto en los datos de la ficha comparativa
      // Extraer la parte antes del guión y comparar exactamente
      const foundItem = this.fichaComparativaData.find(item => {
        const conceptoText = item.Concepto.trim();
        const dashIndex = conceptoText.indexOf(' - ');
        
        if (dashIndex === -1) {
          return false;
        }
        
        const conceptCode = conceptoText.substring(0, dashIndex).trim();
        return conceptCode === concept.id;
      });
      
      return {
        concepto: `${concept.id} - ${concept.name}`,
        valor: foundItem ? foundItem.PeriodoVigencia_Entidad2 : 0,
        porcentaje: foundItem ? (foundItem.Porcentual_Entidad2 * 100).toFixed(1) : '0.0'
      };
    }).filter(item => item.valor > 0); // Solo incluir conceptos con valores

    console.log('Conceptos principales (1.1-1.4) Municipio 2:', result);
    return result;
  }

  /**
   * Obtiene el total para la vigencia seleccionada usando el registro con IdConcepto = '99' de los datos originales
   */
  getTreeTableYearTotal(): number {
    // Buscar el registro total en los datos originales (IdConcepto = '99')
    const totalRecord = this.fichaComparativaData.find(item => item.IdConcepto.trim() === '99');
    if (totalRecord) {
      return totalRecord.PeriodoVigencia_Entidad1 || 0;
    }
    
    // Fallback: sumar todos los nodos del árbol si no existe el total
    let total = 0;
    this.treeTableData.forEach((node: TreeNode) => {
      total += node.data.vigencia || 0;
    });
    return total;
  }

  /**
   * Obtiene el total para la vigencia seleccionada del segundo municipio usando el registro con IdConcepto = '99' de los datos originales
   */
  getTreeTableYearTotal2(): number {
    // Buscar el registro total en los datos originales (IdConcepto = '99')
    const totalRecord = this.fichaComparativaData.find(item => item.IdConcepto.trim() === '99');
    if (totalRecord) {
      return totalRecord.PeriodoVigencia_Entidad2 || 0;
    }
    
    // Fallback: sumar todos los nodos del árbol si no existe el total
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
    this.infoToResume = this.infoResume.find(
      (item: any) => item.id_vigencia === event.value
    );
    
    // Only load charts and data if both municipalities are selected
    if (this.townSelected && this.townSelected2) {
      // Crear los gráficos después de un pequeño delay para asegurar que el DOM esté listo
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
    
    // Si ambos municipios están seleccionados, cargar datos comparativos
    this.loadComparativeDataIfReady();
  }

  /**
   * Carga los datos SGP para la tabla
   */
  loadSgpData(): void {
    const aniosString = this.selected.toString();
    
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
    if (!this.infoToResume?.vigencia) return;
    
    const selectedYear = parseInt(this.infoToResume.vigencia);
    
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
    this.townSelected = '';
    this.loadTownsForDepartment();
    
    // Si no hay departamento 2 seleccionado, copiarlo del departamento 1
    if (!this.departmentSelected2) {
      this.departmentSelected2 = event.value;
      this.loadTownsForDepartment2();
    }
  }

  /**
   * Evento cuando cambia el segundo departamento seleccionado
   */
  onDepartment2Change(event: SelectChangeEvent): void {
    console.log('Departamento 2 seleccionado:', event.value);
    this.departmentSelected2 = event.value;
    this.townSelected2 = '';
    this.loadTownsForDepartment2();
  }

  /**
   * Evento cuando cambia el municipio seleccionado
   */
  onTownChange(event: SelectChangeEvent): void {
    console.log('Municipio seleccionado:', event.value);
    this.townSelected = event.value;
    this.filterDataByLocation();
    
    // Actualizar la lista del municipio 2 para evitar duplicados
    this.updateTowns2List();
    
    // Cargar datos comparativos si está listo
    this.loadComparativeDataIfReady();
  }

  /**
   * Evento cuando cambia el segundo municipio seleccionado
   */
  onTown2Change(event: SelectChangeEvent): void {
    console.log('Municipio 2 seleccionado:', event.value);
    this.townSelected2 = event.value;
    this.filterDataByLocation();
    
    // Cargar datos comparativos si está listo
    this.loadComparativeDataIfReady();
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
    this.selected = this.infoResume.length > 0 ? this.infoResume[0].id_vigencia : 0;
    this.departmentSelected = '';
    this.departmentSelected2 = '';
    this.townSelected = '';
    this.townSelected2 = '';
    this.towns = [];
    this.towns2 = [];
    this.fichaComparativaData = [];
    this.isLoadingComparativeData = false;
    
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
    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.departmentSelected).subscribe({
      next: (municipios) => {
        console.log('Municipios cargados:', municipios);
        this.towns = municipios;
        this.updateTowns2List();
      },
      error: (error) => {
        console.error('Error cargando municipios:', error);
        this.towns = [];
      }
    });
  }

  /**
   * Carga los municipios para el segundo departamento seleccionado
   */
  private loadTownsForDepartment2(): void {
    if (!this.departmentSelected2) {
      this.towns2 = [];
      this.townSelected2 = '';
      return;
    }

    console.log('Cargando municipios para departamento 2:', this.departmentSelected2);
    
    this.sicodisApiService.getMunicipiosPorDepartamento(this.departmentSelected2).subscribe({
      next: (municipios) => {
        console.log('Municipios 2 cargados:', municipios);
        this.towns2 = municipios;
        this.updateTowns2List();
      },
      error: (error) => {
        console.error('Error cargando municipios 2:', error);
        this.towns2 = [];
      }
    });
  }

  /**
   * Actualiza la lista de municipios 2 para evitar duplicados
   */
  private updateTowns2List(): void {
    if (this.townSelected && this.departmentSelected === this.departmentSelected2) {
      // Si ambos departamentos son iguales, filtrar el municipio seleccionado en la lista 1
      this.towns2 = this.towns2.filter(town => town.codigo_municipio !== this.townSelected);
    }
  }

  /**
   * Filtra los datos por ubicación (departamento/municipios)
   */
  private filterDataByLocation(): void {
    console.log('Filtrando datos por ubicación');
    console.log('Departamento 1:', this.departmentSelected);
    console.log('Departamento 2:', this.departmentSelected2);
    console.log('Municipio 1:', this.townSelected);
    console.log('Municipio 2:', this.townSelected2);
    
    // Aquí se cargarían los datos específicos para cada municipio usando la API
    if (this.townSelected && this.departmentSelected) {
      this.loadSgpDataForMunicipality1();
    }
    
    if (this.townSelected2 && this.departmentSelected2) {
      this.loadSgpDataForMunicipality2();
    }
  }

  /**
   * Carga datos SGP específicos para el primer municipio
   */
  private loadSgpDataForMunicipality1(): void {
    console.log('Cargando datos SGP para municipio 1:', this.townSelected);
    // Aquí se implementaría la llamada específica al API para obtener
    // datos del municipio seleccionado cuando esté disponible
    this.loadSgpData();
  }

  /**
   * Carga datos SGP específicos para el segundo municipio
   */
  private loadSgpDataForMunicipality2(): void {
    console.log('Cargando datos SGP para municipio 2:', this.townSelected2);
    // Aquí se implementaría la llamada específica al API para obtener
    // datos del segundo municipio seleccionado cuando esté disponible
    this.loadSgpData2();
  }

  /**
   * Carga datos comparativos si ambos municipios están seleccionados
   */
  private loadComparativeDataIfReady(): void {
    if (this.selected && this.townSelected && this.townSelected2) {
      console.log('Cargando datos comparativos:', {
        vigencia: this.selected,
        municipio1: this.townSelected,
        municipio2: this.townSelected2
      });
      
      // Mostrar indicador de carga
      this.isLoadingComparativeData = true;
      
      this.sicodisApiService.getSgpFichaComparativaEntidad(
        this.selected,
        this.townSelected,
        this.townSelected2
      ).subscribe({
        next: (data) => {
          console.log('Datos comparativos cargados:', data);
          this.fichaComparativaData = data;
          this.buildComparativeTreeData();
          
          // Ocultar indicador de carga
          this.isLoadingComparativeData = false;
        },
        error: (error) => {
          console.error('Error cargando datos comparativos:', error);
          this.fichaComparativaData = [];
          
          // Ocultar indicador de carga incluso en caso de error
          this.isLoadingComparativeData = false;
        }
      });
    } else {
      // Si no están todos los datos, asegurar que no esté en estado de carga
      this.isLoadingComparativeData = false;
    }
  }

  /**
   * Construye los datos de la tabla comparativa usando la ficha comparativa organizados jerárquicamente
   */
  private buildComparativeTreeData(): void {
    if (!this.fichaComparativaData || this.fichaComparativaData.length === 0) {
      return;
    }

    // Construir datos jerárquicos para el primer municipio
    this.treeTableData = this.buildHierarchicalData(this.fichaComparativaData, 1);

    // Construir datos jerárquicos para el segundo municipio
    this.treeTableData2 = this.buildHierarchicalData(this.fichaComparativaData, 2);

    console.log('Datos comparativos jerárquicos construidos para TreeTable');
    console.log('TreeTable 1:', this.treeTableData);
    console.log('TreeTable 2:', this.treeTableData2);
    
    // Actualizar gráficos
    setTimeout(() => {
      this.createBarChart();
      this.createBarChart2();
    }, 200);
  }

  /**
   * Construye la estructura jerárquica basada en el texto antes del guión en el campo Concepto
   */
  private buildHierarchicalData(data: FichaComparativaEntidad[], entityNumber: 1 | 2): TreeNode[] {
    const conceptsMap = new Map<string, TreeNode>();
    let totalRecord: TreeNode | null = null;
    
    data.forEach((item, index) => {
      // Verificar si es el registro total (IdConcepto = '99')
      if (item.IdConcepto.trim() === '99') {
        const entityData = entityNumber === 1 ? {
          vigencia: item.PeriodoVigencia_Entidad1,
          periodo_anterior: item.PeriodoAnterior_Entidad1,
          diferencia: item.Diferencias_Entidad1,
          porcentual: item.Porcentual_Entidad1
        } : {
          vigencia: item.PeriodoVigencia_Entidad2,
          periodo_anterior: item.PeriodoAnterior_Entidad2,
          diferencia: item.Diferencias_Entidad2,
          porcentual: item.Porcentual_Entidad2
        };

        totalRecord = {
          key: `${entityNumber}_total`,
          data: {
            concepto: item.Concepto.trim() || 'TOTAL GENERAL',
            id_concepto: '99',
            ...entityData
          },
          leaf: true
        };
        return; // Continuar con el siguiente item
      }

      // Extraer el código del concepto (texto antes del guión)
      const conceptoText = item.Concepto.trim();
      const dashIndex = conceptoText.indexOf(' - ');
      
      if (dashIndex === -1) {
        // Si no hay guión, usar el concepto completo
        console.warn(`Concepto sin formato estándar: ${conceptoText}`);
        return;
      }
      
      const conceptCode = conceptoText.substring(0, dashIndex).trim();
      const conceptName = conceptoText.substring(dashIndex + 3).trim();
      
      // Dividir el código en partes (ej: "1.1.01" -> ["1", "1", "01"])
      const codeParts = conceptCode.split('.');
      
      // Determinar si es concepto padre (ej: 1.1) o hijo (ej: 1.1.01)
      const isParentConcept = codeParts.length === 2;
      const parentKey = codeParts.length >= 2 ? `${codeParts[0]}.${codeParts[1]}` : conceptCode;
      
      // Datos según la entidad
      const entityData = entityNumber === 1 ? {
        vigencia: item.PeriodoVigencia_Entidad1,
        periodo_anterior: item.PeriodoAnterior_Entidad1,
        diferencia: item.Diferencias_Entidad1,
        porcentual: item.Porcentual_Entidad1
      } : {
        vigencia: item.PeriodoVigencia_Entidad2,
        periodo_anterior: item.PeriodoAnterior_Entidad2,
        diferencia: item.Diferencias_Entidad2,
        porcentual: item.Porcentual_Entidad2
      };

      if (isParentConcept) {
        // Es un concepto padre (ej: "1.1 - Educación")
        if (!conceptsMap.has(parentKey)) {
          conceptsMap.set(parentKey, {
            key: `${entityNumber}_${parentKey}`,
            data: {
              concepto: conceptoText,
              id_concepto: conceptCode,
              ...entityData
            },
            children: [],
            expanded: false
          });
        } else {
          // Actualizar datos del concepto padre si ya existe
          const existingNode = conceptsMap.get(parentKey)!;
          existingNode.data = {
            concepto: conceptoText,
            id_concepto: conceptCode,
            ...entityData
          };
        }
      } else {
        // Es un concepto hijo (ej: "1.1.01 - Prestación de Servicios")
        // Asegurar que existe el concepto padre
        if (!conceptsMap.has(parentKey)) {
          // Crear concepto padre genérico basado en los primeros dos niveles
          const parentName = this.getParentConceptName(parentKey);
          conceptsMap.set(parentKey, {
            key: `${entityNumber}_${parentKey}`,
            data: {
              concepto: `${parentKey} - ${parentName}`,
              id_concepto: parentKey,
              vigencia: 0,
              periodo_anterior: 0,
              diferencia: 0,
              porcentual: 0
            },
            children: [],
            expanded: false
          });
        }

        // Agregar como hijo
        const parentNode = conceptsMap.get(parentKey)!;
        parentNode.children!.push({
          key: `${entityNumber}_${conceptCode}`,
          data: {
            concepto: conceptoText,
            id_concepto: conceptCode,
            ...entityData
          },
          leaf: true
        });
      }
    });

    // Calcular totales para conceptos padre que tienen hijos
    conceptsMap.forEach(parentNode => {
      if (parentNode.children && parentNode.children.length > 0) {
        // Sumar valores de los hijos para obtener el total del padre
        const totals = parentNode.children.reduce((acc, child) => ({
          vigencia: acc.vigencia + (child.data.vigencia || 0),
          periodo_anterior: acc.periodo_anterior + (child.data.periodo_anterior || 0),
          diferencia: acc.diferencia + (child.data.diferencia || 0)
        }), { vigencia: 0, periodo_anterior: 0, diferencia: 0 });

        // Solo actualizar si el padre no tenía valores propios
        if (parentNode.data.vigencia === 0) {
          parentNode.data.vigencia = totals.vigencia;
          parentNode.data.periodo_anterior = totals.periodo_anterior;
          parentNode.data.diferencia = totals.diferencia;
          parentNode.data.porcentual = totals.periodo_anterior > 0 ? 
            totals.diferencia / totals.periodo_anterior : 0;
        }
      }
    });

    // Ordenar por código de concepto y devolver solo los conceptos regulares
    // El registro total (IdConcepto = '99') se excluye de la estructura jerárquica
    return Array.from(conceptsMap.values()).sort((a, b) => {
      const aId = a.data.id_concepto;
      const bId = b.data.id_concepto;
      return aId.localeCompare(bId, undefined, { numeric: true });
    });
  }

  /**
   * Obtiene el nombre del concepto padre basado en el código
   */
  private getParentConceptName(parentCode: string): string {
    const conceptNames: { [key: string]: string } = {
      '1.1': 'Educación',
      '1.2': 'Salud', 
      '1.3': 'Agua Potable',
      '1.4': 'Propósito General',
      '2.1': 'Deporte y Recreación',
      '2.2': 'Cultura',
      '2.3': 'Otros Sectores'
    };
    
    return conceptNames[parentCode] || 'Concepto Principal';
  }

  /**
   * Obtiene el nombre del municipio seleccionado
   */
  getSelectedMunicipalityName(municipalityNumber: number): string {
    if (municipalityNumber === 1) {
      if (!this.townSelected) return 'Sin seleccionar';
      const municipality = this.towns.find(town => town.codigo_municipio === this.townSelected);
      return municipality ? municipality.nombre_municipio : 'Municipio 1';
    } else {
      if (!this.townSelected2) return 'Sin seleccionar';
      const municipality = this.towns2.find(town => town.codigo_municipio === this.townSelected2);
      return municipality ? municipality.nombre_municipio : 'Municipio 2';
    }
  }

  /**
   * Obtiene el nombre de la vigencia seleccionada
   */
  getSelectedVigenciaName(): string {
    if (!this.selected || !this.infoToResume) return '';
    return this.infoToResume.vigencia || this.selected.toString();
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
    const aniosString = this.selected.toString();
    
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
            vigencia: Math.round(this.getValueForYear(filteredData, conceptoId, this.selected.toString()) * 0.8)
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
            vigencia: Math.round(this.getValueForYear(filteredData, conceptoId, this.selected.toString()) * 0.8)
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
            vigencia: this.getValueForYear(filteredData, conceptoId, this.selected.toString())
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
            vigencia: this.getValueForYear(filteredData, conceptoId, this.selected.toString())
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
