import { CommonModule } from '@angular/common';
import { Component, Renderer2, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';

// PrimeNG imports
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { Dialog } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { TreeNode } from 'primeng/api';

import Chart from 'chart.js/auto';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { departamentos } from '../../data/departamentos';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reports-sgp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    TableModule,
    TreeTableModule,
    ButtonModule,
    Select,
    FloatLabel,
    Dialog,
    TooltipModule,
    NumberFormatPipe
  ],
  templateUrl: './reports-sgp.component.html',
  styleUrl: './reports-sgp.component.scss',
})
export class ReportsSgpComponent implements OnInit {
  color1 = 'lightblue';
  color2 = 'lightgreen';
  color3 = 'lightpink';
  selected: string = '2025'; // Seleccionar la última vigencia por defecto
  departmentSelected: string = '';
  townSelected: string = '';
  tableClass = "p-datatable-sm";

  visibleDlgDetail: boolean = false;
  visibleDlgFiles: boolean = false;

  expandedRows = {};
  infoToResume: any = {};

  // Propiedades para TreeTable
  treeTableData: TreeNode[] = [];
  historicoApiData: any[] = [];

  // Propiedades para gráfica de barras
  barChartData: any;
  barChartOptions: any;
  barChartInstance: any;

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

  dataSource2: any = [
    {
      desc: '1.1 - Educación',
      value: '28216351964476',
      detail: [
        { desc: 'Alimentación Escolar', value: '2500000000000' },
        { desc: 'Infraestructura Educativa', value: '1800000000000' },
        { desc: 'Calidad Educativa', value: '23916351964476' },
      ]
    },
    {
      desc: '1.2 - Salud',
      value: '28216351964476',
      detail: [
        { desc: 'Régimen Subsidiado', value: '20000000000000' },
        { desc: 'Salud Pública', value: '5216351964476' },
        { desc: 'Prestación de Servicios', value: '3000000000000' },
      ]
    },
    {
      desc: '2.1 - Agua Potable y Saneamiento Básico',
      value: '7054087991119',
      detail: [
        { desc: 'Acueducto', value: '3527043995559' },
        { desc: 'Alcantarillado', value: '2116226397336' },
        { desc: 'Aseo', value: '1410739598224' },
      ]
    },
    {
      desc: '2.2 - Propósito General',
      value: '7054087991118',
      detail: [
        { desc: 'Libre Inversión', value: '4932461593783' },
        { desc: 'Funcionamiento', value: '2121626397335' },
      ]
    },
    {
      desc: '99 - Total SGP',
      value: '70540879911189',
      detail: []
    }
  ];

  distributionData: any = [
    {
      b: "2024-01-15",
      c: "DD SGP-01-2024",
      g: "12345678901234"
    },
    {
      b: "2024-02-15", 
      c: "DD SGP-02-2024",
      g: "23456789012345"
    },
    {
      b: "2024-03-15",
      c: "DD SGP-03-2024", 
      g: "34567890123456"
    }
  ];

  distributionName = "";
  distributionDate = "";
  distributionFiles: any = [];

  entidadTerritorialUrl = '/assets/data/entidad_territorial.json';
  entidadTerritorialData: any[] = [];

  constructor(private renderer: Renderer2, private sicodisApiService: SicodisApiService, private http: HttpClient) {}

  ngOnInit(): void {
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === this.selected
    )[0];
    
    // Crear el gráfico después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
      this.createBarChart();
    }, 500);

    // Cargar datos de la tabla
    this.loadSgpData();

    fetch(this.entidadTerritorialUrl)
      .then((response: any) => response.json())
      .then((data: any) => {
        this.entidadTerritorialData = data;        
        console.log('Entidad Territorial Data:', this.entidadTerritorialData);
      })
      .catch((error: any) => console.error('Error loading data:', error)); 

    console.log('Component initialized');
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
      const data = mainConcepts.map(concept => concept.valor / 1000000); // Convertir a millones
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
              label: 'Valor (Millones COP)',
              data: data,
              backgroundColor: greenColors,
              borderColor: greenColors.map(color => this.darkenColor(color, 20)),
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
                  size: 12,
                  weight: 'bold'
                }
              },
              ticks: {
                maxRotation: 45,
                minRotation: 0,
                font: {
                  size: 10
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Millones de COP',
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
                    `Valor: ${value} millones COP`,
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
   * Evento cuando cambia la vigencia seleccionada
   */
  onVigenciaChange(event: SelectChangeEvent): void {
    console.log('Vigencia seleccionada:', event.value);
    this.selected = event.value;
    this.infoToResume = this.infoResume.filter(
      (item: any) => item.year === event.value
    )[0];
    
    // Recrear el gráfico con los nuevos datos
    setTimeout(() => {
      this.createBarChart();
    }, 500);
    
    // Recargar datos de la tabla
    this.loadSgpData();
    this.loadDataForYear();
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
   * Actualiza los datos cuando se presiona el botón Actualizar
   */
  updateData(): void {
    console.log('Actualizando datos...');
    console.log('Vigencia:', this.selected);
    console.log('Departamento:', this.departmentSelected);
    console.log('Municipio:', this.townSelected);
    
    // Aquí iría la lógica para actualizar los datos según los filtros seleccionados
    this.loadFilteredData();
  }

  /**
   * Limpia los filtros seleccionados y recarga los datos
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
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
   * Filtra los datos por ubicación (departamento/municipio)
   */
  private filterDataByLocation(): void {
    console.log('Filtrando datos por ubicación');
    // Lógica para filtrar datos según departamento y municipio
  }

  /**
   * Carga los datos filtrados según todos los criterios seleccionados
   */
  private loadFilteredData(): void {
    console.log('Cargando datos filtrados');
    // Aquí iría la lógica principal para cargar y filtrar todos los datos
    // según vigencia, departamento y municipio seleccionados
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
    
    // Recrear el gráfico con los nuevos datos
    setTimeout(() => {
      this.createBarChart();
    }, 500);
  }

  /**
   * Muestra el diálogo de detalles
   */
  showDetails(data: any): void {
    console.log("show Details", data);
    this.showDialogDetail();
  }

  /**
   * Muestra el diálogo de archivos
   */
  showFiles(data: any): void {
    console.log("show Files", data);
    this.showDialogFiles(data);
  }

  /**
   * Abre el diálogo de detalles
   */
  showDialogDetail(): void {
    this.visibleDlgDetail = true;
  }

  /**
   * Abre el diálogo de archivos
   */
  showDialogFiles(data: any): void {
    this.visibleDlgFiles = true;
    this.distributionFiles = [];
    this.distributionName = data.c;
    this.distributionDate = data.b;
    this.distributionFiles.push({
      desc: data.d || data.c,
      value: data.c
    });
    this.distributionFiles.push({
      desc: "Anexos 1 al 3 DD SGP-94-2024",
      value: "Anexos"
    });
  }

  /**
   * Descarga archivos
   */
  downloadFiles(data: any): void {
    console.log("downloadFiles", data);
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
    
    // Actualizar gráfico después de construir los datos
    setTimeout(() => {
      this.createBarChart();
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
    
    // Actualizar gráfico con datos de ejemplo
    setTimeout(() => {
      this.createBarChart();
    }, 200);
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
   * Abre el diálogo de detalles (método anterior)
   */
  showDetailDialog(): void {
    this.visibleDlgDetail = true;
  }

  /**
   * Abre el diálogo de archivos (método anterior)
   */
  showFilesDialog(): void {
    this.visibleDlgFiles = true;
  }
}