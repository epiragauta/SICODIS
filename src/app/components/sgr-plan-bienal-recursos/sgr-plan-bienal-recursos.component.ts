import { Component, OnInit, ViewChild, NgZone, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import {
  SicodisApiService,
  FuncionamientoSiglasDiccionario,
  DiccionarioItem,
  SiglasItem,
  VigenciaPlanBienal,
  DepartamentoPlanBienal,
  MunicipioPlanBienal,
  DetallePlanRecursos,
} from '../../services/sicodis-api.service';
import { Select } from 'primeng/select';
import { TreeNode } from 'primeng/api';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';

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
  ],
  templateUrl: './sgr-plan-bienal-recursos.component.html',
  styleUrl: './sgr-plan-bienal-recursos.component.scss'
})
export class SgrPlanBienalRecursosComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  @ViewChild('planRecursosTable') planRecursosTable: any;

  highlightedYear: string | null = null;
  highlightedCategoria: string | null = null;
  private categoryMap: { [key: string]: string } = {};

  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  isLoading = false;
  isLoadingMunicipios = false;

  vigencias: VigenciaPlanBienal[] = [];
  selectedVigencia: VigenciaPlanBienal | null = null;

  beneficiarios = [
    { label: 'Departamentos', value: 1 },
    { label: 'Municipios', value: 2 },
  ];
  selectedBeneficiario: any = null;

  departamentosList: DepartamentoPlanBienal[] = [];
  selectedDepartamento: DepartamentoPlanBienal | null = null;

  municipiosList: MunicipioPlanBienal[] = [];
  selectedMunicipio: MunicipioPlanBienal | null = null;

  years: string[] = [];

  barChartData: any;
  barChartOptions: any;

  tableData: TreeNode[] = [];
  tableCols: any[] = [];

  private readonly chartColors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#64748b'
  ];

  constructor(
    private sicodisApiService: SicodisApiService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initializeChart();
    this.initializeChartOptions();
    this.cargarSiglasDiccionario();
    this.cargarVigencias();
    this.cargarDepartamentos();
  }

  get vigenciaLabel(): string {
    return this.selectedVigencia ? this.selectedVigencia.vigencia.replace(' - ', '-') : '';
  }

  private getYearsRange(vigencia: string): string[] {
    const parts = vigencia.split(' - ');
    const start = parseInt(parts[0].trim());
    const end = parseInt(parts[1].trim());
    const result: string[] = [];
    for (let y = start; y <= end; y++) result.push(String(y));
    return result;
  }

  private rebuildYearsAndColumns(years: string[]): void {
    this.years = years;
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '25%' },
      ...years.map(y => ({ field: y, header: y, width: `${75 / years.length}%` }))
    ];
  }

  private initializeChart(): void {
    this.barChartData = {
      labels: [],
      datasets: []
    };
  }

  private initializeChartOptions(): void {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: { family: '"Work Sans", sans-serif', size: 11 }
          }
        },
        datalabels: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => `${ctx.dataset.label}: ${this.formatCurrency(ctx.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          ticks: { font: { family: '"Work Sans", sans-serif', size: 11 } }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cifras en pesos corrientes',
            font: { family: '"Work Sans", sans-serif', size: 12 }
          },
          ticks: {
            font: { family: '"Work Sans", sans-serif', size: 11 },
            callback: (value: any) => this.formatCurrency(value)
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

  private cargarVigencias(): void {
    this.sicodisApiService.getSgrPlanRecursosVigencias().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.vigencias = data;
        if (data.length > 0) this.selectedVigencia = data[0];
      },
      error: (err) => console.error('Error cargando vigencias:', err)
    });
  }

  private cargarDepartamentos(): void {
    this.sicodisApiService.getSgrPlanRecursosDepartamentos().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.departamentosList = data; },
      error: (err) => console.error('Error cargando departamentos:', err)
    });
  }

  onBeneficiarioChange(): void {
    if (this.selectedBeneficiario?.value !== 2) {
      this.selectedMunicipio = null;
      this.municipiosList = [];
    }
  }

  private sortMunicipios(data: MunicipioPlanBienal[]): MunicipioPlanBienal[] {
    const todos       = data.filter(m => m.codigo === '0');
    const gobernacion = data.filter(m => m.nombre.startsWith('Gobernación de'));
    const rest        = data.filter(m => m.codigo !== '0' && !m.nombre.startsWith('Gobernación de'));
    return [...todos, ...gobernacion, ...rest];
  }

  onDepartamentoChange(): void {
    this.selectedMunicipio = null;
    this.municipiosList = [];
    if (this.selectedBeneficiario?.value === 2 &&
        this.selectedDepartamento &&
        this.selectedDepartamento.codigo !== '0') {
      this.isLoadingMunicipios = true;
      this.sicodisApiService
        .getSgrPlanRecursosMunicipiosDepartamento(this.selectedDepartamento.codigo)
        .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: (data) => { this.municipiosList = this.sortMunicipios(data); this.isLoadingMunicipios = false; },
          error: (err) => {
            console.error('Error cargando municipios:', err);
            this.isLoadingMunicipios = false;
          }
        });
    }
  }

  applyFilters(): void {
    if (!this.selectedVigencia || !this.selectedDepartamento) return;

    const years = this.getYearsRange(this.selectedVigencia.vigencia);
    this.rebuildYearsAndColumns(years);

    const codigoEntidad = this.selectedDepartamento.codigo;
    const codigoMunicipio = this.selectedMunicipio?.codigo || '0';

    this.isLoading = true;
    this.sicodisApiService
      .getSgrPlanRecursosDetalle(this.selectedVigencia.id_vigencia, codigoEntidad, codigoMunicipio)
      .pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.procesarDatosTabla(data);
          this.actualizarGrafico(data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error cargando datos del plan de recursos:', err);
          this.tableData = [];
          this.isLoading = false;
        }
      });
  }

  private procesarDatosTabla(data: DetallePlanRecursos[]): void {
    const mappedData = data.map(item => {
      const row: any = {
        concepto: item.Concepto,
        orden: item.Orden,
        categoria: String(item.Orden),
        idConcepto: item.IdConcepto,
      };

      if (item.IdConcepto === '1000') row.section = 'inversion';
      else if (item.IdConcepto === '2000') row.section = 'ahorro';
      else if (item.IdConcepto === '3000') row.section = 'otros';
      else if (item.IdConcepto === '99') row.section = 'total';

      this.years.forEach(year => { row[year] = item[year] || 0; });
      return row;
    });

    // Cuando se consulta un municipio específico, eliminar filas sin datos en ningún año
    const municipioEspecifico = this.selectedMunicipio?.codigo && this.selectedMunicipio.codigo !== '0';
    const dataFinal = municipioEspecifico
      ? mappedData.filter(row =>
          row.idConcepto === '99' ||
          this.years.some(y => row[y] !== 0)
        )
      : mappedData;

    this.tableData = organizeCategoryData(dataFinal);
  }

  private actualizarGrafico(data: DetallePlanRecursos[]): void {
    // Los sub-ítems del gráfico son los que tienen Orden entero entre INVERSIÓN y AHORRO
    const inversionOrd = data.find(d => d.IdConcepto === '1000')?.Orden ?? 1;
    const ahorroOrd    = data.find(d => d.IdConcepto === '2000')?.Orden ?? Infinity;

    const subItems = data.filter(item =>
      Number.isInteger(item.Orden) &&
      item.Orden > inversionOrd &&
      item.Orden < ahorroOrd
    );

    this.categoryMap = {};
    subItems.forEach(item => { this.categoryMap[item.Concepto] = String(item.Orden); });

    const datasets = subItems.map((item, i) => ({
      label: item.Concepto,
      data: this.years.map(y => item[y] || 0),
      backgroundColor: this.chartColors[i % this.chartColors.length],
      borderColor: this.chartColors[i % this.chartColors.length],
      borderWidth: 1
    }));

    this.barChartData = { labels: this.years, datasets };
  }

  clearFilters(): void {
    this.selectedVigencia = this.vigencias.length > 0 ? this.vigencias[0] : null;
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipiosList = [];
    this.tableData = [];
    this.initializeChart();
  }

  showPopupDiccionario(): void {
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  showPopupSiglas(): void {
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
  }

  closeDiccionarioPopup(): void { this.showDiccionarioPopup = false; }
  closeSiglasPopup(): void      { this.showSiglasPopup = false; }

  exportarExcel(): void {
  }

  verInformesRecaudo(): void {
  }

  async cargarSiglasDiccionario(): Promise<void> {
    try {
      const data = await this.sicodisApiService.getSgrSiglasDiccionario().toPromise();
      this.siglasDiccionarioData = data || null;
    } catch (error) {
      console.error('Error cargando diccionario y siglas:', error);
      this.siglasDiccionarioData = null;
    }
  }

  private generarContenidoDiccionario(): string {
    if (!this.siglasDiccionarioData?.diccionario?.data) {
      return '<p>No se pudieron cargar los datos del diccionario.</p>';
    }
    let html = '<div style="font-size:11px"><table style="width:100%;border-collapse:collapse">';
    html += '<thead><tr style="background:#f8f9fa">'
      + '<th style="border:1px solid #dee2e6;padding:8px;text-align:left">Id</th>'
      + '<th style="border:1px solid #dee2e6;padding:8px;text-align:left">Concepto</th>'
      + '<th style="border:1px solid #dee2e6;padding:8px;text-align:left">Descripción</th>'
      + '</tr></thead><tbody>';
    this.siglasDiccionarioData.diccionario.data.forEach((item: DiccionarioItem) => {
      html += `<tr>
        <td style="border:1px solid #dee2e6;padding:8px;vertical-align:top"><strong>${item.id_concepto}</strong></td>
        <td style="border:1px solid #dee2e6;padding:8px;vertical-align:top"><strong>${item.concepto}</strong></td>
        <td style="border:1px solid #dee2e6;padding:8px;vertical-align:top">${item.descripcion}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    return html;
  }

  private generarContenidoSiglas(): string {
    if (!this.siglasDiccionarioData?.siglas?.data) {
      return '<p>No se pudieron cargar los datos de las siglas.</p>';
    }
    let html = '<div style="font-size:11px"><table style="width:100%;border-collapse:collapse">';
    html += '<thead><tr style="background:#f8f9fa">'
      + '<th style="border:1px solid #dee2e6;padding:8px;text-align:left">Sigla</th>'
      + '<th style="border:1px solid #dee2e6;padding:8px;text-align:left">Descripción</th>'
      + '</tr></thead><tbody>';
    this.siglasDiccionarioData.siglas.data.forEach((item: SiglasItem) => {
      html += `<tr>
        <td style="border:1px solid #dee2e6;padding:8px;vertical-align:top"><strong>${item.sigla}</strong></td>
        <td style="border:1px solid #dee2e6;padding:8px;vertical-align:top">${item.descripcion}</td>
      </tr>`;
    });
    html += '</tbody></table></div>';
    return html;
  }

  onChartHover(categoryLabel: string, year: string): void {
    const categoria = this.categoryMap[categoryLabel];
    if (!categoria) return;
    this.highlightedYear = year;
    this.highlightedCategoria = categoria;
    this.expandNodeByCategoria(categoria);
    setTimeout(() => this.scrollToHighlightedCell(), 100);
  }

  clearChartHighlight(): void {
    this.highlightedYear = null;
    this.highlightedCategoria = null;
  }

  private expandNodeByCategoria(categoria: string): void {
    const parts = categoria.split('.');
    for (let i = 1; i <= parts.length; i++) {
      this.expandNodeRecursive(this.tableData, parts.slice(0, i).join('.'));
    }
  }

  private expandNodeRecursive(nodes: TreeNode[], targetCategory: string): boolean {
    for (const node of nodes) {
      if (node.data.categoria === targetCategory) { node.expanded = true; return true; }
      if (node.children?.length && this.expandNodeRecursive(node.children, targetCategory)) {
        node.expanded = true;
        return true;
      }
    }
    return false;
  }

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

  isCellHighlighted(rowData: any, year: string): boolean {
    return rowData.categoria === this.highlightedCategoria && year === this.highlightedYear;
  }

  private formatCurrency(value: number): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('es-CO').format(value);
  }
}
