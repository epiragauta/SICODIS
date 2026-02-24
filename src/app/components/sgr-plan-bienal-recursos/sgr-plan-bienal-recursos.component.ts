import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService, FuncionamientoSiglasDiccionario, DiccionarioItem, SiglasItem } from '../../services/sicodis-api.service';
import { Select } from 'primeng/select';

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
    InfoPopupComponent,
    NumberFormatPipe,
    Select
  ],
  templateUrl: './sgr-plan-bienal-recursos.component.html',
  styleUrl: './sgr-plan-bienal-recursos.component.scss'
})
export class SgrPlanBienalRecursosComponent implements OnInit {

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
  tableData: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) {}

  ngOnInit(): void {
    this.selectedPlan = this.planes[1];
    this.selectedVigencia = this.vigencias[0];
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
      }
    };
  }

  /**
   * Inicializar datos de la tabla
   */
  private initializeTable(): void {
    const getRow = (cat: string) => {
      const item = resumenPlanRecursos.find((r: any) => r.categoria === cat);
      return item ? { ...item } : null;
    };

    this.tableData = [
      { ...getRow('1'), isHeader: true, section: 'inversion' },
      { ...getRow('1.1'), isHeader: false },
      { ...getRow('1.2'), isHeader: false },
      { ...getRow('1.3'), isHeader: false },
      { ...getRow('1.4'), isHeader: false },
      { ...getRow('1.15'), isHeader: false },
      { ...getRow('1.16'), isHeader: false },
      { ...getRow('1.17'), isHeader: false },
      { ...getRow('2'), isHeader: true, section: 'ahorro' },
      { ...getRow('2.1'), isHeader: false },
      { ...getRow('2.2'), isHeader: false },
      { ...getRow('3'), isHeader: true, section: 'otros' },
      { ...getRow('3.1'), isHeader: false },
      { ...getRow('3.2'), isHeader: false },
      { ...getRow('total'), isHeader: true, section: 'total' }
    ].filter(r => r !== null);
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
}
