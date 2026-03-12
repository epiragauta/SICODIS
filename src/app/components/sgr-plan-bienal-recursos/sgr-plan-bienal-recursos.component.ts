import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService, FuncionamientoSiglasDiccionario, DiccionarioItem, SiglasItem } from '../../services/sicodis-api.service';
import { Select } from 'primeng/select';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem, TreeNode } from 'primeng/api';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';

import { resumenPlanRecursos } from '../../data/resumen-plan-recursos';
import { departamentos } from '../../data/departamentos';

@Component({
  selector: 'app-sgr-plan-bienal-recursos',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FloatLabel,
    FormsModule,
    ChartModule,
    TableModule,
    TreeTableModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Select,
    Breadcrumb
  ],
  templateUrl: './sgr-plan-bienal-recursos.component.html',
  styleUrl: './sgr-plan-bienal-recursos.component.scss'
})
export class SgrPlanBienalRecursosComponent implements OnInit {

  @ViewChild('planRecursosTable') planRecursosTable: any;

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Estado de resaltado sincronizado con el hover del gráfico
  highlightedYear: string | null = null;
  highlightedCategoria: string | null = null;

  // Mapeo de labels del gráfico a categorías (sin tildes para coincidir con los labels del gráfico)
  private categoryMap: { [key: string]: string } = {
    'Asignacion para la Paz': '1.1',
    'Asignaciones Directas': '1.2',
    'Asignacion para la Inversion Local': '1.4',
    'Asignacion para Ciencia, Tecnologia e Innovacion': '1.15',
    'Asignacion Ambiental': '1.16',
    'Municipios Rio Magdalena y Canal Dique': '1.17'
  };

  // Popups Diccionario y Siglas
  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  // Opciones de filtros
  planes = [
    { label: 'Plan Bienal de Caja' },
    { label: 'Plan de Recursos' }
  ];
  selectedPlan: any = null;

  vigencias = [
    { label: '2025-2034' }
  ];
  selectedVigencia: any = null;

  beneficiarios = [
    { label: 'Departamentos' },
    { label: 'Gobernacion' },
    { label: 'Regiones' }
  ];
  selectedBeneficiario: any = null;

  departamentosList = departamentos;
  selectedDepartamento: any = null;

  // Anios para columnas de tabla
  years = ['2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034'];

  // Chart
  barChartData: any;
  barChartOptions: any;

  // Tabla
  tableData: TreeNode[] = [];
  tableCols: any[] = [];

  constructor(
    private sicodisApiService: SicodisApiService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Programación Plan de Recursos' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };

    this.selectedPlan = this.planes[1];
    this.selectedVigencia = this.vigencias[0];

    // Inicializar columnas de la tabla
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '25%' },
      ...this.years.map(year => ({ field: year, header: year, width: `${75 / this.years.length}%` }))
    ];

    this.initializeChart();
    this.initializeTable();
    this.cargarSiglasDiccionario();
  }

  /**
   * Inicializar grafico de barras agrupadas
   */
  private initializeChart(): void {
    const chartCategories = [
      { key: '1.1', label: 'Asignacion para la Paz', color: '#3b82f6' },
      { key: '1.2', label: 'Asignaciones Directas', color: '#10b981' },
      { key: '1.4', label: 'Asignacion para la Inversion Local', color: '#f59e0b' },
      { key: '1.15', label: 'Asignacion para Ciencia, Tecnologia e Innovacion', color: '#8b5cf6' },
      { key: '1.16', label: 'Asignacion Ambiental', color: '#ef4444' },
      { key: '1.17', label: 'Municipios Rio Magdalena y Canal Dique', color: '#06b6d4' }
    ];

    const datasets = chartCategories.map(cat => {
      const item = resumenPlanRecursos.find((r: any) => r.categoria === cat.key);
      return {
        label: cat.label,
        data: this.years.map(y => item?.[y] || 0),
        backgroundColor: cat.color,
        borderColor: cat.color,
        borderWidth: 1
      };
    });

    this.barChartData = {
      labels: this.years,
      datasets
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
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
          stacked: false,
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cifras en pesos corrientes',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
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
      },
      onHover: (event: any, activeElements: any[], chart: any) => {
        if (activeElements.length > 0) {
          const datasetIndex = activeElements[0].datasetIndex;
          const yearIndex = activeElements[0].index;
          const year = chart.data.labels[yearIndex];
          const categoryLabel = chart.data.datasets[datasetIndex].label;
          this.ngZone.run(() => this.onChartHover(categoryLabel, year));
        } else {
          this.ngZone.run(() => this.clearChartHighlight());
        }
      }
    };
  }

  /**
   * Inicializar datos de la tabla usando estructura jerárquica
   */
  private initializeTable(): void {
    // Usar organizeCategoryData para convertir los datos planos en TreeNodes
    this.tableData = organizeCategoryData(resumenPlanRecursos);
  }

  /**
   * Formatear moneda
   */
  private formatCurrency(value: number): string {
    if (value === 0) return '0';
    return new Intl.NumberFormat('es-CO').format(value);
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    console.log('Aplicando filtros...', {
      plan: this.selectedPlan,
      vigencia: this.selectedVigencia,
      beneficiario: this.selectedBeneficiario,
      departamento: this.selectedDepartamento
    });
  }

  /**
   * Exportar tabla a Excel
   */
  exportarExcel(): void {
    console.log('Exportar excel...');
  }

  /**
   * Navegar a informes de recaudo
   */
  verInformesRecaudo(): void {
    console.log('Ver informes de recaudo...');
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedPlan = this.planes[1];
    this.selectedVigencia = this.vigencias[0];
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
  }

  /**
   * Mostrar popup del diccionario
   */
  showPopupDiccionario(): void {
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  /**
   * Mostrar popup de siglas
   */
  showPopupSiglas(): void {
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
  }

  closeDiccionarioPopup(): void {
    this.showDiccionarioPopup = false;
  }

  closeSiglasPopup(): void {
    this.showSiglasPopup = false;
  }

  /**
   * Cargar datos de diccionario y siglas desde API
   */
  async cargarSiglasDiccionario(): Promise<void> {
    try {
      const data = await this.sicodisApiService.getSgrSiglasDiccionario().toPromise();
      this.siglasDiccionarioData = data || null;
    } catch (error) {
      console.error('Error cargando datos de diccionario y siglas:', error);
      this.siglasDiccionarioData = null;
    }
  }

  private generarContenidoDiccionario(): string {
    if (!this.siglasDiccionarioData?.diccionario?.data) {
      return '<p>No se pudieron cargar los datos del diccionario.</p>';
    }

    let contenido = '<div style="font-size: 11px;"><table style="width: 100%; border-collapse: collapse;">';
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Id</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Concepto</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripcion</th></tr></thead>';
    contenido += '<tbody>';

    this.siglasDiccionarioData.diccionario.data.forEach((item: DiccionarioItem) => {
      contenido += `<tr>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;"><strong>${item.id_concepto}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top; font-weight: 500;"><strong>${item.concepto}</strong></td>
        <td style="border: 1px solid #dee2e6; padding: 8px; vertical-align: top;">${item.descripcion}</td>
      </tr>`;
    });

    contenido += '</tbody></table></div>';
    return contenido;
  }

  private generarContenidoSiglas(): string {
    if (!this.siglasDiccionarioData?.siglas?.data) {
      return '<p>No se pudieron cargar los datos de las siglas.</p>';
    }

    let contenido = '<div style="font-size: 11px;"><table style="width: 100%; border-collapse: collapse;">';
    contenido += '<thead><tr style="background-color: #f8f9fa;"><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Sigla</th><th style="border: 1px solid #dee2e6; padding: 8px; text-align: left; font-weight: bold;">Descripcion</th></tr></thead>';
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
   * Manejar hover sobre el gráfico
   */
  onChartHover(categoryLabel: string, year: string): void {
    const categoria = this.categoryMap[categoryLabel];
    if (!categoria) {
      console.warn('Categoría no encontrada en el mapa:', categoryLabel);
      return;
    }

    this.highlightedYear = year;
    this.highlightedCategoria = categoria;

    // Expandir el nodo si está colapsado
    this.expandNodeByCategoria(categoria);

    // Hacer scroll a la celda resaltada
    setTimeout(() => this.scrollToHighlightedCell(), 100);
  }

  /**
   * Limpiar el resaltado
   */
  clearChartHighlight(): void {
    this.highlightedYear = null;
    this.highlightedCategoria = null;
  }

  /**
   * Expandir el nodo y sus padres si están colapsados
   */
  private expandNodeByCategoria(categoria: string): void {
    // Expandir todos los nodos padres necesarios
    const parts = categoria.split('.');
    for (let i = 1; i <= parts.length; i++) {
      const parentCategory = parts.slice(0, i).join('.');
      this.expandNodeRecursive(this.tableData, parentCategory);
    }
  }

  /**
   * Expandir nodo recursivamente
   */
  private expandNodeRecursive(nodes: TreeNode[], targetCategory: string): boolean {
    for (const node of nodes) {
      if (node.data.categoria === targetCategory) {
        node.expanded = true;
        return true;
      }
      if (node.children && node.children.length > 0) {
        if (this.expandNodeRecursive(node.children, targetCategory)) {
          node.expanded = true;
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Hacer scroll a la celda resaltada
   */
  private scrollToHighlightedCell(): void {
    if (!this.highlightedCategoria || !this.highlightedYear || !this.planRecursosTable) return;

    const tableNative: HTMLElement = this.planRecursosTable.el.nativeElement;
    const scrollWrapper = (
      tableNative.querySelector('.p-treetable-scrollable-body') ||
      tableNative.querySelector('.p-treetable-wrapper') ||
      tableNative.querySelector('[data-pc-section="wrapper"]')
    ) as HTMLElement;

    const highlightedCell = tableNative.querySelector('td.highlighted-cell') as HTMLElement;

    if (!scrollWrapper || !highlightedCell) return;

    // Calcular posición de la celda relativa al scroll container
    let offsetTop = 0;
    let el: HTMLElement | null = highlightedCell;
    while (el && el !== scrollWrapper && el.offsetParent) {
      offsetTop += el.offsetTop;
      el = el.offsetParent as HTMLElement;
    }

    const cellHeight = highlightedCell.offsetHeight;
    const containerScrollTop = scrollWrapper.scrollTop;
    const containerHeight = scrollWrapper.clientHeight;

    if (offsetTop < containerScrollTop || offsetTop + cellHeight > containerScrollTop + containerHeight) {
      scrollWrapper.scrollTo({
        top: offsetTop - containerHeight / 2 + cellHeight / 2,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Verificar si una celda debe estar resaltada
   */
  isCellHighlighted(rowData: any, year: string): boolean {
    return rowData.categoria === this.highlightedCategoria && year === this.highlightedYear;
  }
}
