import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

@Component({
  selector: 'app-sgr-recaudo-mensual',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DatePicker,
    FloatLabel,
    FormsModule,
    ChartModule,
    TableModule,
    InfoPopupComponent,
    NumberFormatPipe
  ],
  templateUrl: './sgr-recaudo-mensual.component.html',
  styleUrl: './sgr-recaudo-mensual.component.scss'
})
export class SgrRecaudoMensualComponent implements OnInit {
  
  // Propiedades para popups de Diccionario y Siglas
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Estados de visualización
  showRecaudoView: boolean = true;
  showTipoRecursoView: boolean = false;

  // Filtros de período usando DatePicker
  selectedPeriodoDesde: Date | null = null;
  selectedPeriodoHasta: Date | null = null;

  // Configuración de gráficos - Vista Recaudo
  miningChartData: any;
  miningChartOptions: any;
  hydrocarbonChartData: any;
  hydrocarbonChartOptions: any;

  // Configuración de gráficos - Vista Tipo de Recurso
  conceptChartData: any;
  conceptChartOptions: any;
  trendChartData: any;
  trendChartOptions: any;

  // Configuración de tabla (vista Recaudo)
  tableData: any[] = [];
  tableColumns: any[] = [];

  // Configuración de tabla comportamiento (vista Tipo de Recurso)
  behaviorTableData: any[] = [];
  behaviorTableColumns: any[] = [];

  // Configuración de tabla detallada (vista Tipo de Recurso)
  detailedTableData: any[] = [];
  detailedTableColumns: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.setDefaultPeriods();
    this.initializeCharts();
    this.initializeTable();
    this.initializeBehaviorTable();
    this.initializeDetailedTable();
  }

  /**
   * Establecer períodos por defecto para Month Picker
   */
  private setDefaultPeriods(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth(); // getMonth() returns 0-11
    
    // Período desde: enero del año actual
    this.selectedPeriodoDesde = new Date(currentYear, 0); // Enero = mes 0
    
    // Período hasta: mes actual del año actual
    this.selectedPeriodoHasta = new Date(currentYear, currentMonth);
  }

  /**
   * Mostrar vista de Recaudo
   */
  showRecaudo(): void {
    this.showRecaudoView = true;
    this.showTipoRecursoView = false;
  }

  /**
   * Mostrar vista de Tipo de recurso
   */
  showTipoRecurso(): void {
    this.showRecaudoView = false;
    this.showTipoRecursoView = true;
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    console.log('Aplicando filtros...', {
      desde: this.selectedPeriodoDesde,
      hasta: this.selectedPeriodoHasta,
      vista: this.showRecaudoView ? 'Recaudo' : 'Tipo de Recurso'
    });
    
    // Aquí se puede agregar lógica para actualizar los gráficos basado en el rango de fechas
    this.updateChartsData();
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    console.log('Limpiando filtros...');
    this.setDefaultPeriods();
    this.updateChartsData();
  }

  /**
   * Actualizar datos de gráficos basado en el rango de fechas seleccionado
   */
  private updateChartsData(): void {
    // Por ahora mantiene los datos mock, pero aquí se implementaría la lógica
    // para filtrar datos basado en selectedPeriodoDesde y selectedPeriodoHasta
    console.log('Actualizando gráficos para el período:', {
      desde: this.selectedPeriodoDesde,
      hasta: this.selectedPeriodoHasta
    });
    this.updateTableData();
    this.updateDetailedTableData();
  }

  /**
   * Inicializar tabla con columnas agrupadas
   */
  private initializeTable(): void {
    this.tableColumns = [
      { field: 'mes', header: 'Mes', width: '12%', group: null },
      // Grupo PBC
      { field: 'pbc_mineria', header: 'Minería', width: '10%', group: 'PBC' },
      { field: 'pbc_hidrocarburos', header: 'Hidrocarburos', width: '10%', group: 'PBC' },
      { field: 'pbc_total', header: 'Total', width: '10%', group: 'PBC' },
      // Grupo Recaudo
      { field: 'recaudo_mineria', header: 'Minería', width: '10%', group: 'Recaudo' },
      { field: 'recaudo_hidrocarburos', header: 'Hidrocarburos', width: '10%', group: 'Recaudo' },
      { field: 'recaudo_total', header: 'Total', width: '10%', group: 'Recaudo' },
      // Grupo Variación
      { field: 'variacion_mineria', header: 'Minería', width: '9%', group: 'Variación' },
      { field: 'variacion_hidrocarburos', header: 'Hidrocarburos', width: '9%', group: 'Variación' },
      { field: 'variacion_total', header: 'Total', width: '10%', group: 'Variación' }
    ];

    this.updateTableData();
  }

  /**
   * Actualizar datos de la tabla basado en el rango de fechas
   */
  private updateTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.tableData = [];
      return;
    }

    const months = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);
    
    this.tableData = months.map((monthDate, index) => {
      const monthName = monthDate.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });

      // Datos mock - en implementación real vendrían del backend
      const pbcMineria = 980000000000 + (Math.random() * 400000000000);
      const pbcHidrocarburos = 2200000000000 + (Math.random() * 800000000000);
      const pbcTotal = pbcMineria + pbcHidrocarburos;

      const recaudoMineria = 1250000000000 + (Math.random() * 300000000000);
      const recaudoHidrocarburos = 2850000000000 + (Math.random() * 500000000000);
      const recaudoTotal = recaudoMineria + recaudoHidrocarburos;

      // Calcular variaciones (porcentajes)
      const variacionMineria = ((recaudoMineria - pbcMineria) / pbcMineria) * 100;
      const variacionHidrocarburos = ((recaudoHidrocarburos - pbcHidrocarburos) / pbcHidrocarburos) * 100;
      const variacionTotal = ((recaudoTotal - pbcTotal) / pbcTotal) * 100;

      return {
        mes: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        pbc_mineria: pbcMineria,
        pbc_hidrocarburos: pbcHidrocarburos,
        pbc_total: pbcTotal,
        recaudo_mineria: recaudoMineria,
        recaudo_hidrocarburos: recaudoHidrocarburos,
        recaudo_total: recaudoTotal,
        variacion_mineria: variacionMineria,
        variacion_hidrocarburos: variacionHidrocarburos,
        variacion_total: variacionTotal
      };
    });
  }

  /**
   * Obtener lista de meses en un rango de fechas
   */
  private getMonthsInRange(startDate: Date, endDate: Date): Date[] {
    const months: Date[] = [];
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    while (current <= end) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }

  /**
   * Formatear porcentaje para variaciones
   */
  formatPercentage(value: number): string {
    if (value === null || value === undefined || isNaN(value)) return '-';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2).replace('.', ',')}%`;
  }

  /**
   * Descargar datos de la tabla en formato Excel
   */
  downloadExcel(): void {
    console.log('Descargando Excel con datos de la tabla...');
    
    if (this.tableData.length === 0) {
      console.warn('No hay datos para descargar');
      return;
    }

    // Preparar datos para Excel
    const excelData = this.tableData.map(row => ({
      'Mes': row.mes,
      'PBC Minería': row.pbc_mineria,
      'PBC Hidrocarburos': row.pbc_hidrocarburos,
      'PBC Total': row.pbc_total,
      'Recaudo Minería': row.recaudo_mineria,
      'Recaudo Hidrocarburos': row.recaudo_hidrocarburos,
      'Recaudo Total': row.recaudo_total,
      'Variación Minería (%)': this.formatPercentage(row.variacion_mineria),
      'Variación Hidrocarburos (%)': this.formatPercentage(row.variacion_hidrocarburos),
      'Variación Total (%)': this.formatPercentage(row.variacion_total)
    }));

    console.log('Datos preparados para Excel:', excelData);
    
    // Aquí se implementaría la lógica real de descarga Excel
    // Por ejemplo, usando una librería como SheetJS o similar
    // Por ahora solo logueamos los datos
    alert('Función de descarga Excel pendiente de implementación. Ver consola para datos.');
  }

  /**
   * Descargar datos de la tabla detallada en formato Excel
   */
  downloadDetailedExcel(): void {
    console.log('Descargando Excel con datos de la tabla detallada...');
    
    if (this.detailedTableData.length === 0) {
      console.warn('No hay datos para descargar');
      return;
    }

    // Preparar datos para Excel
    const excelData = this.detailedTableData.map(row => ({
      'Periodo de recaudo': row.periodo,
      // Recaudo Corriente
      'RC Inversión aforada': row.rc_inversion_aforada,
      'RC Ahorro': row.rc_ahorro,
      'RC Administración y SSEC': row.rc_administracion,
      'RC No aforado': row.rc_no_aforado,
      'RC Total Recaudo': row.rc_total,
      // Individuales
      'Total PBC': row.total_pbc,
      'Avance (%)': this.formatPercentage(row.avance),
      // Recaudo Otros
      'RO Inversión': row.ro_inversion,
      'RO Ahorro': row.ro_ahorro,
      'RO Administración y SSEC': row.ro_administracion,
      'RO Total recaudo otros': row.ro_total,
      // Total final
      'Total distribuido': row.total_distribuido
    }));

    console.log('Datos preparados para Excel detallado:', excelData);
    
    // Aquí se implementaría la lógica real de descarga Excel
    // Por ejemplo, usando una librería como SheetJS o similar
    // Por ahora solo logueamos los datos
    alert('Función de descarga Excel detallado pendiente de implementación. Ver consola para datos.');
  }

  /**
   * Inicializar gráficos
   */
  private initializeCharts(): void {
    // Gráficos para vista Recaudo
    this.initializeMiningChart();
    this.initializeHydrocarbonChart();
    
    // Gráficos para vista Tipo de Recurso
    this.initializeConceptChart();
    this.initializeTrendChart();
  }

  /**
   * Inicializar gráfico de minería
   */
  private initializeMiningChart(): void {
    // Datos mock para 5 períodos (Enero 2025 - Mayo 2025)
    const periods = ['Enero 2025', 'Febrero 2025', 'Marzo 2025', 'Abril 2025', 'Mayo 2025'];
    
    // Datos simulados en pesos colombianos
    const recaudoMineria = [1250000000000, 1100000000000, 1350000000000, 1180000000000, 1420000000000];
    const pbcMineria = [980000000000, 850000000000, 1200000000000, 920000000000, 1300000000000];

    this.miningChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Recaudo Minería',
          data: recaudoMineria,
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'PBC Minería',
          data: pbcMineria,
          backgroundColor: '#60a5fa',
          borderColor: '#3b82f6',
          borderWidth: 1
        }
      ]
    };

    this.miningChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
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
        },
        y: {
          stacked: false,
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        }
      }
    };
  }

  /**
   * Inicializar gráfico de hidrocarburos
   */
  private initializeHydrocarbonChart(): void {
    // Datos mock para 5 períodos (Enero 2025 - Mayo 2025)
    const periods = ['Enero 2025', 'Febrero 2025', 'Marzo 2025', 'Abril 2025', 'Mayo 2025'];
    
    // Datos simulados en pesos colombianos
    const recaudoHidrocarburos = [2850000000000, 2650000000000, 3100000000000, 2920000000000, 3350000000000];
    const pbcHidrocarburos = [2200000000000, 2050000000000, 2800000000000, 2400000000000, 2950000000000];

    this.hydrocarbonChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Recaudo Hidrocarburos',
          data: recaudoHidrocarburos,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        },
        {
          label: 'PBC Hidrocarburos',
          data: pbcHidrocarburos,
          backgroundColor: '#34d399',
          borderColor: '#10b981',
          borderWidth: 1
        }
      ]
    };

    this.hydrocarbonChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
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
        },
        y: {
          stacked: false,
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        }
      }
    };
  }

  /**
   * Formatear moneda como en presupuesto-y-recaudo
   */
  private formatCurrency(value: number): string {
    if (value === 0) return '0';
    
    const billions = value / 1000000000000;
    if (billions >= 1) {
      return billions.toFixed(1).replace('.', ',') + ' B';
    }
    
    const millions = value / 1000000000;
    if (millions >= 1) {
      return millions.toFixed(1).replace('.', ',') + ' MM';
    }
    
    return new Intl.NumberFormat('es-CO').format(value);
  }

  /**
   * Inicializar gráfico de conceptos de gasto (PBC vs Recaudo)
   */
  private initializeConceptChart(): void {
    // Datos mock para conceptos: Inversión, Ahorro, Administración
    const presupuestoBienal = [15500000000000, 3200000000000, 850000000000]; // En pesos
    const recaudoAcumulado = [12800000000000, 2950000000000, 780000000000]; // En pesos

    this.conceptChartData = {
      labels: ['Inversión', 'Ahorro', 'Administración'],
      datasets: [
        {
          label: 'Presupuesto Bienal',
          data: presupuestoBienal,
          backgroundColor: '#3b82f6',
          borderColor: '#1e40af',
          borderWidth: 1
        },
        {
          label: 'Recaudo Acumulado',
          data: recaudoAcumulado,
          backgroundColor: '#10b981',
          borderColor: '#059669',
          borderWidth: 1
        }
      ]
    };

    this.conceptChartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: ${this.formatCurrency(context.parsed.x)}`;
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,            
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
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
        },
        y: {
          stacked: false,
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        }
      }
    };
  }

  /**
   * Inicializar gráfico de tendencia mensual
   */
  private initializeTrendChart(): void {
    // Datos mock para 5 meses (Enero 2025 - Mayo 2025)
    const periods = ['Enero 2025', 'Febrero 2025', 'Marzo 2025', 'Abril 2025', 'Mayo 2025'];
    
    // Datos simulados de Inversión (PBC vs Recaudo)
    const inversionPBC = [4200000000000, 4150000000000, 4300000000000, 4250000000000, 4400000000000];
    const inversionRecaudo = [3800000000000, 3900000000000, 4100000000000, 3950000000000, 4200000000000];

    this.trendChartData = {
      labels: periods,
      datasets: [
        {
          label: 'Inversión PBC',
          data: inversionPBC,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#1e40af',
          pointBorderWidth: 2
        },
        {
          label: 'Inversión Recaudo',
          data: inversionRecaudo,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#059669',
          pointBorderWidth: 2
        }
      ]
    };

    this.trendChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      aspectRatio: 2,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12
            }
          }
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
          title: {
            display: true,
            text: 'Período',
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
            }
          },
          ticks: {
            font: {
              family: '"Work Sans", sans-serif',
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            font: {
              family: '"Work Sans", sans-serif',
              size: 12,
              weight: 'bold'
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
   * Mostrar popup del diccionario
   */
  showPopupDiccionario(): void {
    console.log('Mostrando diccionario de datos');
    this.diccionarioContent = this.generarContenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  /**
   * Mostrar popup de siglas
   */
  showPopupSiglas(): void {
    console.log('Mostrando siglas');
    this.siglasContent = this.generarContenidoSiglas();
    this.showSiglasPopup = true;
  }

  /**
   * Cerrar popup del diccionario
   */
  closeDiccionarioPopup(): void {
    this.showDiccionarioPopup = false;
  }

  /**
   * Cerrar popup de siglas
   */
  closeSiglasPopup(): void {
    this.showSiglasPopup = false;
  }

  /**
   * Generar contenido del diccionario
   */
  private generarContenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - Recaudo Mensual SGR</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>Recaudo Mensual:</strong> Monto total de regalías recaudadas mensualmente</li>
          <li style="margin-bottom: 0.5rem;"><strong>Ingresos Corrientes:</strong> Recaudos provenientes de la explotación de recursos naturales no renovables</li>
          <li style="margin-bottom: 0.5rem;"><strong>Otros Ingresos:</strong> Recaudos provenientes de otras fuentes (rendimientos, reintegros, multas, etc.)</li>
          <li style="margin-bottom: 0.5rem;"><strong>Inversión:</strong> Recursos destinados a proyectos de inversión territorial</li>
          <li style="margin-bottom: 0.5rem;"><strong>Ahorro:</strong> Recursos destinados al Fondo de Ahorro y Estabilización</li>
          <li style="margin-bottom: 0.5rem;"><strong>Administración:</strong> Recursos para gastos administrativos del sistema</li>
          <li style="margin-bottom: 0.5rem;"><strong>Tipo de Recurso:</strong> Clasificación según el mineral o hidrocarburo de origen</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generar contenido de siglas
   */
  private generarContenidoSiglas(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>DNP:</strong> Departamento Nacional de Planeación</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAEP:</strong> Fondo de Ahorro y Estabilización Petrolera</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>SICODIS:</strong> Sistema de Consulta y Distribución</li>
        </ul>
      </div>
    `;
  }

  /**
   * Inicializar tabla de comportamiento
   */
  private initializeBehaviorTable(): void {
    // Configuración de columnas
    this.behaviorTableColumns = [
      { field: 'concepto', header: 'Concepto', width: '25%' },
      { field: 'inversion_aforada', header: 'Inversión aforada', width: '15%' },
      { field: 'ahorro', header: 'Ahorro', width: '15%' },
      { field: 'administracion', header: 'Administración y SSEC', width: '15%' },
      { field: 'no_aforado', header: 'No aforado', width: '15%' },
      { field: 'total', header: 'Total', width: '15%' }
    ];

    // Datos mock para la única fila
    const inversionAforada = 12800000000000; // 12.8 billones
    const ahorro = 2950000000000; // 2.95 billones
    const administracion = 780000000000; // 780 mil millones
    const noAforado = 1850000000000; // 1.85 billones
    const total = inversionAforada + ahorro + administracion + noAforado;

    this.behaviorTableData = [
      {
        concepto: 'Total recaudo corrientes y otros',
        inversion_aforada: inversionAforada,
        ahorro: ahorro,
        administracion: administracion,
        no_aforado: noAforado,
        total: total
      }
    ];
  }

  /**
   * Inicializar tabla detallada con columnas agrupadas
   */
  private initializeDetailedTable(): void {
    // Configuración de columnas con agrupación
    this.detailedTableColumns = [
      { field: 'periodo', header: 'Periodo de recaudo', width: '10%', group: null },
      // Grupo Recaudo Corriente
      { field: 'rc_inversion_aforada', header: 'Inversión aforada', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_ahorro', header: 'Ahorro', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_administracion', header: 'Administración y SSEC', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_no_aforado', header: 'No aforado', width: '8%', group: 'Recaudo Corriente' },
      { field: 'rc_total', header: 'Total Recaudo', width: '8%', group: 'Recaudo Corriente' },
      // Columnas individuales
      { field: 'total_pbc', header: 'Total PBC', width: '8%', group: null },
      { field: 'avance', header: 'Avance', width: '7%', group: null },
      // Grupo Recaudo Otros
      { field: 'ro_inversion', header: 'Inversión', width: '8%', group: 'Recaudo Otros' },
      { field: 'ro_ahorro', header: 'Ahorro', width: '7%', group: 'Recaudo Otros' },
      { field: 'ro_administracion', header: 'Administración y SSEC', width: '8%', group: 'Recaudo Otros' },
      { field: 'ro_total', header: 'Total recaudo otros', width: '8%', group: 'Recaudo Otros' },
      // Columna individual final
      { field: 'total_distribuido', header: 'Total distribuido', width: '8%', group: null }
    ];

    this.updateDetailedTableData();
  }

  /**
   * Actualizar datos de la tabla detallada basado en el rango de fechas
   */
  private updateDetailedTableData(): void {
    if (!this.selectedPeriodoDesde || !this.selectedPeriodoHasta) {
      this.detailedTableData = [];
      return;
    }

    const months = this.getMonthsInRange(this.selectedPeriodoDesde, this.selectedPeriodoHasta);
    
    this.detailedTableData = months.map((monthDate, index) => {
      const monthName = monthDate.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });

      // Datos mock para Recaudo Corriente
      const rcInversionAforada = 8200000000000 + (Math.random() * 2000000000000);
      const rcAhorro = 1950000000000 + (Math.random() * 500000000000);
      const rcAdministracion = 520000000000 + (Math.random() * 200000000000);
      const rcNoAforado = 1250000000000 + (Math.random() * 400000000000);
      const rcTotal = rcInversionAforada + rcAhorro + rcAdministracion + rcNoAforado;

      // Datos mock adicionales
      const totalPBC = rcTotal + (Math.random() * 1000000000000);
      const avance = ((rcTotal / totalPBC) * 100);

      // Datos mock para Recaudo Otros
      const roInversion = 2800000000000 + (Math.random() * 800000000000);
      const roAhorro = 650000000000 + (Math.random() * 200000000000);
      const roAdministracion = 180000000000 + (Math.random() * 80000000000);
      const roTotal = roInversion + roAhorro + roAdministracion;

      // Total distribuido
      const totalDistribuido = rcTotal + roTotal;

      return {
        periodo: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        // Recaudo Corriente
        rc_inversion_aforada: rcInversionAforada,
        rc_ahorro: rcAhorro,
        rc_administracion: rcAdministracion,
        rc_no_aforado: rcNoAforado,
        rc_total: rcTotal,
        // Individuales
        total_pbc: totalPBC,
        avance: avance,
        // Recaudo Otros
        ro_inversion: roInversion,
        ro_ahorro: roAhorro,
        ro_administracion: roAdministracion,
        ro_total: roTotal,
        // Total final
        total_distribuido: totalDistribuido
      };
    });
  }
}
