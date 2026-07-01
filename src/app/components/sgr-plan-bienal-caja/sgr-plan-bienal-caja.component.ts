import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TreeTableModule } from 'primeng/treetable';
import { Select } from 'primeng/select';
import { MenuItem, TreeNode } from 'primeng/api';

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
  DetallePlanBienal
} from '../../services/sicodis-api.service';
import { organizeCategoryData } from '../../utils/hierarchicalDataStructureV2';

@Component({
  selector: 'app-sgr-plan-bienal-caja',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SplitButtonModule,
    FloatLabel,
    FormsModule,
    ChartModule,
    TableModule,
    TreeTableModule,
    Select,
    InfoPopupComponent,
    NumberFormatPipe,
  ],
  templateUrl: './sgr-plan-bienal-caja.component.html',
  styleUrl: './sgr-plan-bienal-caja.component.scss',
})
export class SgrPlanBienalCajaComponent implements OnInit {

  @ViewChild('planBienalCajaTable') planBienalCajaTable: any;

  // Estado de resaltado sincronizado con el hover del gráfico
  highlightedPeriod: string | null = null;

  // Popups Diccionario y Siglas
  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';
  private siglasDiccionarioData: FuncionamientoSiglasDiccionario | null = null;

  // Estado de carga
  isLoading = false;
  isLoadingMunicipios = false;

  // Opciones de filtros
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

  // Periodos para columnas de la tabla (24 meses)
  periods: string[] = [];

  // Datos de tabla
  tableData: TreeNode[] = [];
  tableCols: any[] = [];

  // Datos del grafico
  barChartData: any;
  barChartOptions: any;

  // Menu del split button "Informes de recaudo"
  menuItems: MenuItem[] = [];

  constructor(
    private sicodisApiService: SicodisApiService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.buildPeriods();
    this.initializeTableColumns();
    this.initializeChart();
    this.initializeMenuItems();
    this.cargarSiglasDiccionario();
    this.cargarVigencias();
    this.cargarDepartamentos();
  }

  private buildPeriods(): void {
    const years = [2025, 2026];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    years.forEach(y => months.forEach(m => this.periods.push(`${y}-${m}`)));
  }

  get vigenciaLabel(): string {
    return this.selectedVigencia ? this.selectedVigencia.vigencia.replace(' - ', '-') : '';
  }

  private getYearsFromVigencia(vigencia: VigenciaPlanBienal): [number, number] {
    const parts = vigencia.vigencia.split(' - ');
    return [parseInt(parts[0].trim()), parseInt(parts[1].trim())];
  }

  private rebuildPeriodsAndColumns(year1: number, year2: number): void {
    this.periods = [];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    [year1, year2].forEach(y => months.forEach(m => this.periods.push(`${y}-${m}`)));
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '350px' },
      ...this.periods.map(period => ({ field: period, header: period, width: '170px' }))
    ];
  }

  private initializeTableColumns(): void {
    this.tableCols = [
      { field: 'concepto', header: 'Concepto', width: '350px' },
      ...this.periods.map(period => ({ field: period, header: period, width: '170px' }))
    ];
  }

  private initializeChart(): void {
    const monthNames = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
    ];
    const labels = [...monthNames, ...monthNames];

    const orange  = '#f97316';
    const navyBlue = '#1e3a5f';

    // Inicializar con datos vacíos
    this.barChartData = {
      labels,
      datasets: [
        {
          label: '2025',
          data: Array(24).fill(0),
          backgroundColor: orange,
          borderColor: orange,
          borderWidth: 1,
          barPercentage: 0.85,
        },
        {
          label: '2026',
          data: Array(24).fill(0),
          backgroundColor: navyBlue,
          borderColor: navyBlue,
          borderWidth: 1,
          barPercentage: 0.85,
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: { family: '"Work Sans", sans-serif', size: 11 },
          },
        },
        datalabels: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) =>
              `${ctx.dataset.label}: ${this.formatCurrency(ctx.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: { family: '"Work Sans", sans-serif', size: 10 },
            maxRotation: 45,
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Cifras en pesos corrientes',
            font: { family: '"Work Sans", sans-serif', size: 12 },
          },
          ticks: {
            font: { family: '"Work Sans", sans-serif', size: 11 },
            callback: (value: any) => this.formatCurrency(value),
          },
        },
      },
      onHover: (event: any, activeElements: any[], chart: any) => {
        if (activeElements.length > 0) {
          const datasetIndex = activeElements[0].datasetIndex;
          const monthIndex = activeElements[0].index;
          const year = chart.data.datasets[datasetIndex].label;
          const month = String((monthIndex % 12) + 1).padStart(2, '0');
          const period = `${year}-${month}`;
          this.ngZone.run(() => this.onChartHover(period));
        } else {
          this.ngZone.run(() => this.clearChartHighlight());
        }
      }
    };
  }

  private initializeMenuItems(): void {
    this.menuItems = [
      { label: 'Recaudo mensual', icon: 'pi pi-calendar' },
      { label: 'Recaudo por vigencia', icon: 'pi pi-chart-bar' },
      { label: 'Comparativo vs presupuesto', icon: 'pi pi-chart-line' },
    ];
  }

  private formatCurrency(value: number): string {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Carga las vigencias desde el servicio
   */
  private cargarVigencias(): void {
    this.sicodisApiService.getSgrPlanBienalVigencias().subscribe({
      next: (data) => {
        this.vigencias = data;
        // Seleccionar la primera vigencia por defecto (la más reciente)
        if (this.vigencias.length > 0) {
          this.selectedVigencia = this.vigencias[0];
        }
      },
      error: (error) => {
        console.error('Error cargando vigencias:', error);
      }
    });
  }

  /**
   * Carga los departamentos desde el servicio
   */
  private cargarDepartamentos(): void {
    this.sicodisApiService.getSgrPlanBienalDepartamentos().subscribe({
      next: (data) => {
        this.departamentosList = data;
      },
      error: (error) => {
        console.error('Error cargando departamentos:', error);
      }
    });
  }

  onBeneficiarioChange(): void {
    if (this.selectedBeneficiario?.value !== 2) {
      this.selectedMunicipio = null;
      this.municipiosList = [];
    }
  }

  /**
   * Carga los municipios cuando se selecciona un departamento
   */
  private sortMunicipios(data: MunicipioPlanBienal[]): MunicipioPlanBienal[] {
    const todos       = data.filter(m => m.codigo === '0');
    const gobernacion = data.filter(m => m.nombre.startsWith('Gobernación de'));
    const rest        = data.filter(m => m.codigo !== '0' && !m.nombre.startsWith('Gobernación de'));
    return [...todos, ...gobernacion, ...rest];
  }

  onDepartamentoChange(): void {
    if (this.selectedDepartamento && this.selectedDepartamento.codigo !== '0') {
      this.isLoadingMunicipios = true;
      this.sicodisApiService.getSgrPlanBienalMunicipiosDepartamento(this.selectedDepartamento.codigo).subscribe({
        next: (data) => {
          this.municipiosList = this.sortMunicipios(data);
          this.selectedMunicipio = null;
          this.isLoadingMunicipios = false;
        },
        error: (error) => {
          console.error('Error cargando municipios:', error);
          this.municipiosList = [];
          this.isLoadingMunicipios = false;
        }
      });
    } else {
      // Si selecciona "Todos", limpiar municipios
      this.municipiosList = [];
      this.selectedMunicipio = null;
    }
  }

  /**
   * Carga los datos del plan bienal con los filtros aplicados
   */
  private cargarDatosPlanBienal(): void {
    if (!this.selectedVigencia || !this.selectedDepartamento) {
      console.warn('Debe seleccionar vigencia y departamento');
      return;
    }

    const [year1, year2] = this.getYearsFromVigencia(this.selectedVigencia);
    this.rebuildPeriodsAndColumns(year1, year2);

    const codigoEntidad = this.selectedDepartamento.codigo;
    const codigoMunicipio = this.selectedMunicipio?.codigo || '0';

    this.isLoading = true;
    this.sicodisApiService.getSgrPlanBienalDetalle(
      this.selectedVigencia.id_vigencia,
      codigoEntidad,
      codigoMunicipio
    ).subscribe({
      next: (data) => {
        this.procesarDatosTabla(data);
        this.actualizarGrafico(data, year1, year2);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando datos del plan bienal:', error);
        this.tableData = [];
        this.isLoading = false;
      }
    });
  }

  /**
   * Procesa los datos para la tabla usando estructura jerárquica
   */
  private procesarDatosTabla(data: DetallePlanBienal[]): void {
    // Mapear datos agregando el campo "categoria" que usa el valor de "Orden"
    const mappedData = data.map(item => {
      const row: any = {
        concepto: item.Concepto,
        orden: item.Orden,
        categoria: String(item.Orden), // Convertir Orden a string para usar con organizeCategoryData
        idConcepto: item.IdConcepto,
      };

      // Determinar la sección para estilos
      if (item.IdConcepto === '1000') {
        row.section = 'inversion';
      } else if (item.IdConcepto === '2000') {
        row.section = 'ahorro';
      } else if (item.IdConcepto === '3000') {
        row.section = 'otros';
      } else if (item.IdConcepto === '99') {
        row.section = 'total';
      }

      // Copiar todos los períodos
      this.periods.forEach(period => {
        row[period] = item[period] || 0;
      });

      return row;
    });

    // Usar organizeCategoryData para crear la estructura jerárquica
    this.tableData = organizeCategoryData(mappedData);
  }

  /**
   * Actualiza el gráfico con los nuevos datos
   */
  private actualizarGrafico(data: DetallePlanBienal[], year1: number, year2: number): void {
    const inversionRow = data.find(r => r.IdConcepto === '1000');

    if (!inversionRow) {
      console.warn('No se encontró registro de INVERSIÓN para el gráfico');
      return;
    }

    const monthNames = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
    ];

    const data1 = monthNames.map((_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return inversionRow[`${year1}-${m}`] ?? 0;
    });

    const data2 = monthNames.map((_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return inversionRow[`${year2}-${m}`] ?? 0;
    });

    this.barChartData.datasets[0].label = String(year1);
    this.barChartData.datasets[1].label = String(year2);
    this.barChartData.datasets[0].data = [...data1, ...Array(12).fill(null)];
    this.barChartData.datasets[1].data = [...Array(12).fill(null), ...data2];
    this.barChartData = { ...this.barChartData };
  }

  /**
   * Verificar si una celda debe estar resaltada
   */
  isColumnHighlighted(period: string): boolean {
    return period === this.highlightedPeriod;
  }

  applyFilters(): void {
    console.log('Aplicando filtros...', {
      vigencia: this.selectedVigencia,
      beneficiario: this.selectedBeneficiario,
      departamento: this.selectedDepartamento,
      municipio: this.selectedMunicipio,
    });

    this.cargarDatosPlanBienal();
  }

  clearFilters(): void {
    this.selectedVigencia = this.vigencias.length > 0 ? this.vigencias[0] : null;
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
    this.selectedMunicipio = null;
    this.municipiosList = [];
    this.tableData = [];

    // Reiniciar gráfico
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
    console.log('Exportar Excel...');
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

  /**
   * Manejar hover sobre el gráfico
   */
  onChartHover(period: string): void {
    this.highlightedPeriod = period;
    setTimeout(() => this.scrollToHighlightedColumn(), 100);
  }

  /**
   * Limpiar el resaltado
   */
  clearChartHighlight(): void {
    this.highlightedPeriod = null;
  }

  /**
   * Hacer scroll a la columna resaltada
   */
  private scrollToHighlightedColumn(): void {
    if (!this.highlightedPeriod || !this.planBienalCajaTable) return;

    const tableNative: HTMLElement = this.planBienalCajaTable.el.nativeElement;
    const scrollWrapper = (
      tableNative.querySelector('.p-treetable-scrollable-body') ||
      tableNative.querySelector('.p-treetable-wrapper') ||
      tableNative.querySelector('[data-pc-section="wrapper"]')
    ) as HTMLElement;

    const highlightedCell = tableNative.querySelector('td.highlighted-column') as HTMLElement;

    if (!scrollWrapper || !highlightedCell) return;

    // Calcular posición de la celda relativa al scroll container
    const cellLeft = highlightedCell.offsetLeft;
    const containerScrollLeft = scrollWrapper.scrollLeft;
    const containerWidth = scrollWrapper.clientWidth;
    const cellWidth = highlightedCell.offsetWidth;

    if (cellLeft < containerScrollLeft || cellLeft + cellWidth > containerScrollLeft + containerWidth) {
      scrollWrapper.scrollTo({
        left: cellLeft - containerWidth / 2 + cellWidth / 2,
        behavior: 'smooth'
      });
    }
  }
}
