import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { MenuItem } from 'primeng/api';

import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService, FuncionamientoSiglasDiccionario, DiccionarioItem, SiglasItem } from '../../services/sicodis-api.service';

import { planBienalCaja } from '../../data/plan-bienal-caja';
import { departamentos } from '../../data/departamentos';

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

  // Opciones de filtros
  planes = [
    { label: 'Plan Bienal de Caja' },
    { label: 'Plan de Recursos' },
  ];
  selectedPlan: any = null;

  vigencias = [
    { label: '2025-2026' },
  ];
  selectedVigencia: any = null;

  beneficiarios = [
    { label: 'Departamentos' },
    { label: 'Entidad' },
    { label: 'Gobernación' },
    { label: 'Regiones' },
  ];
  selectedBeneficiario: any = null;

  departamentosList = departamentos;
  selectedDepartamento: any = null;

  // Periodos para columnas de la tabla (24 meses)
  periods: string[] = [];

  // Datos de tabla
  tableData: any[] = [];

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
    this.selectedPlan = this.planes[0];
    this.selectedVigencia = this.vigencias[0];
    this.buildPeriods();
    this.initializeTable();
    this.initializeChart();
    this.initializeMenuItems();
    this.cargarSiglasDiccionario();
  }

  private buildPeriods(): void {
    const years = [2025, 2026];
    const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    years.forEach(y => months.forEach(m => this.periods.push(`${y}-${m}`)));
  }

  private initializeTable(): void {
    this.tableData = planBienalCaja;
  }

  private initializeChart(): void {
    const monthNames = [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
    ];
    const labels = [...monthNames, ...monthNames];

    const inversionRow = planBienalCaja.find(r => r.concepto === 'Inversión');
    const data2025 = monthNames.map((_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return inversionRow?.[`2025-${m}`] ?? 0;
    });
    const data2026 = monthNames.map((_, i) => {
      const m = String(i + 1).padStart(2, '0');
      return inversionRow?.[`2026-${m}`] ?? 0;
    });

    const orange  = '#f97316';
    const navyBlue = '#1e3a5f';

    this.barChartData = {
      labels,
      datasets: [
        {
          label: '2025',
          data: [...data2025, ...Array(12).fill(null)],
          backgroundColor: orange,
          borderColor: orange,
          borderWidth: 1,
          barPercentage: 0.85,
        },
        {
          label: '2026',
          data: [...Array(12).fill(null), ...data2026],
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
          const year = datasetIndex === 0 ? '2025' : '2026';
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

  applyFilters(): void {
    console.log('Aplicando filtros...', {
      plan: this.selectedPlan,
      vigencia: this.selectedVigencia,
      beneficiario: this.selectedBeneficiario,
      departamento: this.selectedDepartamento,
    });
  }

  clearFilters(): void {
    this.selectedPlan = this.planes[0];
    this.selectedVigencia = this.vigencias[0];
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
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
      tableNative.querySelector('.p-datatable-wrapper') ||
      tableNative.querySelector('[data-pc-section="wrapper"]')
    ) as HTMLElement;

    const highlightedCell = tableNative.querySelector('td.highlighted-column') as HTMLElement;

    if (!scrollWrapper || !highlightedCell) return;

    // Calcular posición de la celda relativa al scroll container
    const cellRect = highlightedCell.getBoundingClientRect();
    const containerRect = scrollWrapper.getBoundingClientRect();

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

  /**
   * Verificar si una columna debe estar resaltada
   */
  isColumnHighlighted(period: string): boolean {
    return period === this.highlightedPeriod;
  }
}
