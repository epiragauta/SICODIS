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

/**
 * Fila del plan de recursos ya normalizada: `Orden` siempre string y
 * `OrdenUnico` como clave de árbol libre de duplicados (ver asignarOrdenUnico).
 */
interface FilaPlanRecursos extends DetallePlanRecursos {
  Orden: string;
  OrdenUnico: string;
}

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

  /**
   * Detalle del SSEC. El backend llegó a devolver estas tres filas con la cifra
   * NACIONAL al consultar un departamento o municipio: no corresponden a la
   * entidad, su padre (SSEC) llegaba en cero y no sumaban al Total. Hoy ya no
   * se envían en consultas territoriales; el filtro se conserva por seguridad.
   */
  private readonly ID_DETALLE_SSEC = ['701', '702', '703'];

  /** Filas que encabezan sección o consolidan; nunca son series del gráfico. */
  private readonly ID_CABECERAS = ['1000', '2000', '3000', '99'];

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
    this.sicodisApiService.getSgrPlanRecursosVigencias().subscribe({
      next: (data) => {
        this.vigencias = data;
        if (data.length > 0) this.selectedVigencia = data[0];
      },
      error: (err) => console.error('Error cargando vigencias:', err)
    });
  }

  private cargarDepartamentos(): void {
    this.sicodisApiService.getSgrPlanRecursosDepartamentos().subscribe({
      next: (data) => {
        this.departamentosList = data;
        // Obs. 2: seleccionar "Todos" por defecto para estandarizar con los demás
        // reportes y evitar que el selector quede en blanco (placeholder vacío).
        this.selectedDepartamento = data.find(d => d.codigo === '0') ?? null;
      },
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
    // Obs. 5: excluir las Áreas No Municipalizadas (ANM) de Amazonas, Guainía y
    // Vaupés (código *ANM, nombre "… Areas No Municipalizadas"). No son entidades
    // beneficiarias de los recursos del SGR, así que no deben aparecer en el filtro.
    const municipios  = data.filter(m => !/ANM/i.test(m.codigo));
    const todos       = municipios.filter(m => m.codigo === '0');
    const gobernacion = municipios.filter(m => m.nombre.startsWith('Gobernación de'));
    const rest        = municipios.filter(m => m.codigo !== '0' && !m.nombre.startsWith('Gobernación de'));
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
        .subscribe({
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
      .subscribe({
        next: (data) => {
          const filas = this.normalizarDatos(data);
          this.procesarDatosTabla(filas);
          this.actualizarGrafico(filas);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error cargando datos del plan de recursos:', err);
          this.tableData = [];
          this.isLoading = false;
        }
      });
  }

  /** True cuando se consulta un departamento (o municipio) y no el total nacional. */
  private get esConsultaTerritorial(): boolean {
    return !!this.selectedDepartamento && this.selectedDepartamento.codigo !== '0';
  }

  /**
   * El esquema jerárquico se reconoce porque INVERSIÓN anida a sus componentes
   * bajo "1.x". Hoy todas las vigencias lo usan; en el esquema plano anterior
   * ningún `Orden` empezaba por "1.": los componentes iban al mismo nivel raíz
   * que INVERSIÓN. Se mantiene la distinción por si el backend revierte.
   */
  private esEsquemaJerarquico(data: DetallePlanRecursos[]): boolean {
    return data.some(item => String(item.Orden).startsWith('1.'));
  }

  /**
   * Deja las filas listas para el árbol y el gráfico. `Orden` llega hoy como
   * string ("1", "1.2.1", "1.4.2.1.1" ...) y antes como número, así que se
   * normaliza a string; luego se descarta el detalle del SSEC en consultas
   * territoriales, se garantizan claves de árbol únicas y se recompone el total
   * de INVERSIÓN. La jerarquía se toma tal como la envía el backend.
   */
  private normalizarDatos(data: DetallePlanRecursos[]): FilaPlanRecursos[] {
    let filas: FilaPlanRecursos[] = data.map(item => {
      const orden = String(item.Orden);
      return { ...item, Orden: orden, OrdenUnico: orden };
    });

    if (this.esConsultaTerritorial) {
      filas = filas.filter(fila => !this.ID_DETALLE_SSEC.includes(fila.IdConcepto));
    }

    return this.recalcularInversion(this.asignarOrdenUnico(filas));
  }

  /**
   * El backend llegó a repetir el mismo `Orden` en varias filas (p. ej. cinco
   * conceptos con Orden 10 en el esquema plano de 2013-2022). Como
   * organizeCategoryData indexa por categoría, esos duplicados colapsaban en un
   * único nodo y la tabla mostraba la misma fila repetida. Se desambigua con un
   * sufijo que no altera el orden ni crea niveles nuevos.
   */
  private asignarOrdenUnico(filas: FilaPlanRecursos[]): FilaPlanRecursos[] {
    const repeticiones = new Map<string, number>();
    return filas.map(fila => {
      const veces = (repeticiones.get(fila.Orden) ?? 0) + 1;
      repeticiones.set(fila.Orden, veces);
      return veces === 1 ? fila : { ...fila, OrdenUnico: `${fila.Orden}#${veces}` };
    });
  }

  /**
   * INVERSIÓN se recompone como la suma de sus componentes directos. El backend
   * llegó a enviarla mal sumada en la vigencia 2025-2034 (en cero a nivel
   * departamental pese a que sus componentes traían recursos); hoy ya cuadra y
   * el recálculo devuelve el mismo valor, así que solo actúa como salvaguarda.
   * Si INVERSIÓN no tiene componentes en la respuesta, no se toca.
   */
  private recalcularInversion(filas: FilaPlanRecursos[]): FilaPlanRecursos[] {
    const inversion = filas.find(fila => fila.IdConcepto === '1000');
    if (!inversion) return filas;

    const nivelHijo = inversion.Orden.split('.').length + 1;
    const componentes = filas.filter(fila =>
      fila.Orden.startsWith(`${inversion.Orden}.`) &&
      fila.Orden.split('.').length === nivelHijo
    );
    if (componentes.length === 0) return filas;

    const totales = Object.fromEntries(
      this.years.map(year => [
        year,
        componentes.reduce((suma, fila) => suma + (Number(fila[year]) || 0), 0)
      ])
    );

    return filas.map(fila => fila === inversion ? { ...fila, ...totales } : fila);
  }

  private procesarDatosTabla(data: FilaPlanRecursos[]): void {
    const mappedData = data.map(item => {
      const row: any = {
        concepto: item.Concepto,
        orden: item.Orden,
        categoria: item.OrdenUnico,
        idConcepto: item.IdConcepto,
      };

      if (item.IdConcepto === '1000') row.section = 'inversion';
      else if (item.IdConcepto === '2000') row.section = 'ahorro';
      else if (item.IdConcepto === '3000') row.section = 'otros';
      else if (item.IdConcepto === '99') row.section = 'total';

      this.years.forEach(year => { row[year] = item[year] || 0; });
      return row;
    });

    // En consultas territoriales se ocultan las filas sin recursos en ningún año.
    // Las otras asignaciones (Paz, Ambiental, CTeI, étnicos, funcionamiento,
    // fiscalización) no se distribuyen en cabeza de las entidades territoriales,
    // así que a nivel de departamento o municipio llegaban en cero y solo
    // agregaban ruido. El backend ya las omite, pero el filtro se conserva para
    // cubrir cualquier fila en cero que siga llegando. A nivel nacional se
    // conservan todas las filas.
    const dataFinal = this.esConsultaTerritorial
      ? mappedData.filter(row =>
          row.idConcepto === '99' ||
          this.years.some(y => row[y] !== 0)
        )
      : mappedData;

    this.tableData = organizeCategoryData(dataFinal);
  }

  private actualizarGrafico(data: FilaPlanRecursos[]): void {
    const subItems = this.esEsquemaJerarquico(data)
      ? this.componentesInversionJerarquico(data)
      : this.componentesInversionPlano(data);

    // Obs. 3: solo graficar las asignaciones/fondos que traen recursos en algún año.
    // Así se ocultan de la leyenda las que no aplican al beneficiario consultado
    // (p. ej. los municipios no reciben FAE ni CTeI) ni a la vigencia
    // (p. ej. la Asignación para la Paz no existía en el PR 2013-2022).
    const itemsConDatos = subItems.filter(item =>
      this.years.some(y => (item[y] || 0) !== 0)
    );

    this.categoryMap = {};
    itemsConDatos.forEach(item => { this.categoryMap[item.Concepto] = item.OrdenUnico; });

    const datasets = itemsConDatos.map((item, i) => ({
      label: item.Concepto,
      data: this.years.map(y => item[y] || 0),
      backgroundColor: this.chartColors[i % this.chartColors.length],
      borderColor: this.chartColors[i % this.chartColors.length],
      borderWidth: 1
    }));

    this.barChartData = { labels: this.years, datasets };
  }

  /**
   * Esquema jerárquico: las series son los componentes directos de INVERSIÓN
   * (Directas, Regional, Local, CTeI, Paz, Ambiental y Cormagdalena). Sus
   * desagregaciones cuelgan un nivel más abajo y se omiten para no duplicar
   * montos ya contenidos en el concepto padre.
   */
  private componentesInversionJerarquico(data: FilaPlanRecursos[]): FilaPlanRecursos[] {
    const inversion = data.find(fila => fila.IdConcepto === '1000');
    if (!inversion) return [];

    const nivelHijo = inversion.Orden.split('.').length + 1;
    return data.filter(fila =>
      fila.Orden.startsWith(`${inversion.Orden}.`) &&
      fila.Orden.split('.').length === nivelHijo
    );
  }

  /**
   * Esquema plano: las series son las filas con Orden entero dentro del tramo
   * de inversión, excluidas las cabeceras de sección y el Total. Las
   * desagregaciones internas llevan Orden decimal (3.1, 4.2 ...) y se omiten
   * para no duplicar montos ya contenidos en su concepto padre.
   */
  private componentesInversionPlano(data: FilaPlanRecursos[]): FilaPlanRecursos[] {
    const ordenInversion = Number(data.find(fila => fila.IdConcepto === '1000')?.Orden ?? 1);
    const ordenAhorro    = Number(data.find(fila => fila.IdConcepto === '2000')?.Orden ?? Infinity);

    return data.filter(fila => {
      const orden = Number(fila.Orden);
      return Number.isInteger(orden) &&
             orden >= ordenInversion &&
             orden < ordenAhorro &&
             !this.ID_CABECERAS.includes(fila.IdConcepto);
    });
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
    console.log('Exportar excel...');
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
