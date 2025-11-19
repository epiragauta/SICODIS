import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { departamentos } from '../../data/departamentos';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sgr-recaudo-directas',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    ChartModule,
    Select,
    FloatLabel,
    TableModule,
    FormsModule,
    InfoPopupComponent,
    NumberFormatPipe,
    Breadcrumb
  ],
  templateUrl: './sgr-recaudo-directas.component.html',
  styleUrl: './sgr-recaudo-directas.component.scss'
})
export class SgrRecaudoDirectasComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Popups
  showDiccionarioPopup: boolean = false;
  showSiglasPopup: boolean = false;
  diccionarioContent: string = '';
  siglasContent: string = '';

  // Filtros
  selectedBienio: any = { id: 1, label: '2025 - 2026' };
  selectedBeneficiario: any = null;
  selectedDepartamento: any = null;
  filtersApplied: boolean = false;

  // Opciones de filtros
  bienios: any[] = [
    { id: 1, label: '2025 - 2026' }
    // ,
    // { id: 2, label: '2023 - 2024' },
    // { id: 3, label: '2021 - 2022' }
  ];

  beneficiarios: any[] = [
    { id: 1, nombre: 'Todos' },
    { id: 2, nombre: 'Departamentos' },
    { id: 3, nombre: 'Entidades' },
    { id: 4, nombre: 'Regiones' }
  ];

  departamentos: any[] = [
    { id: 1, nombre: 'Todos' }
  ];

  //departamentos = departamentos;

  // Chart data for line charts
  mineriaChartData: any = {};
  mineriaChartOptions: any = {};
  hidrocarburosChartData: any = {};
  hidrocarburosChartOptions: any = {};

  // Table data for monthly comparison
  monthlyComparisonData: any[] = [];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
        { label: 'SGR', routerLink: '/sgr-inicio' },
        { label: 'Recaudo Directas' }
    ];

    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.selectedBeneficiario = this.beneficiarios[0]; // aquí sí funciona
    this.selectedDepartamento = this.beneficiarios[0];

    // Inicialización del componente
    this.initializeLineCharts();
    this.initializeMonthlyComparisonData();
  }

  /**
   * Inicializar datos y opciones de los gráficos de líneas
   */
  private initializeLineCharts(): void {
    // Labels para los meses de enero 2025 a diciembre 2026 (24 meses)

    const monthLabels = [
      'Ene 2025', 'Feb 2025', 'Mar 2025', 'Abr 2025', 'May 2025', 'Jun 2025',
      'Jul 2025', 'Ago 2025', 'Sep 2025', 'Oct 2025'
    ];    

    // // Datos simulados para Minería (en billones de pesos)
    // const mineriaPBCData = [12, 12.5, 13, 12.8, 13.2, 13.5, 14, 14.2, 14.5, 14.8, 15, 15.2, 
    //                        15.5, 15.8, 16, 16.2, 16.5, 16.8, 17, 17.2, 17.5, 17.8, 18, 18.2];
    // const mineriaRecaudoData = [10, 10.8, 11.2, 11.5, 11.8, 12.1, 12.5, 12.8, 13.1, 13.4, 13.7, 14,
    //                            14.3, 14.6, 14.9, 15.2, 15.5, 15.8, 16.1, 16.4, 16.7, 17, 17.3, 17.6];

    // // Datos simulados para Hidrocarburos (en billones de pesos)
    // const hidrocarburosPBCData = [35, 35.5, 36, 35.8, 36.2, 36.5, 37, 37.2, 37.5, 37.8, 38, 38.2,
    //                              38.5, 38.8, 39, 39.2, 39.5, 39.8, 40, 40.2, 40.5, 40.8, 41, 41.2];
    // const hidrocarburosRecaudoData = [28, 29.2, 30.1, 30.8, 31.5, 32.2, 32.8, 33.4, 34, 34.6, 35.2, 35.8,
    //                                  36.4, 37, 37.6, 38.2, 38.8, 39.4, 40, 40.6, 41.2, 41.8, 42.4, 43];

    // Datos para Minería  mapeada a 25%
    const mineriaPBCData = [
                          	126795714413.05
                          ,	63397857328.05
                          ,	52831547792.05
                          ,	105663095625.05
                          ,	63397857328.05
                          ,	42265238229.00
                          ,	116229405113.00
                          ,	105663095625.00
                          ,	42265238229.00
                          ,	126795714662.00
                          ];
    const mineriaRecaudoData = [
                            	170520203403.32
                            ,	51453810290.40
                            ,	44884216214.08
                            ,	110203177013.64
                            ,	130524675218.82
                            ,	40594514099.83
                            ,	107048473331.95
                            ,	59151589681.17
                            ,	44186173425.12
                            ,	172173515576.15
                              ];

    // Datos para Hidrocarburos (en billones de pesos)
    const hidrocarburosPBCData = [
                              	179540256174.70
                              ,	162165339561.84
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                                ];
    const hidrocarburosRecaudoData = [
                                  	135955506345.63
                                  ,	143937130696.86
                                  ,	258376203757.14
                                  ,	128139964605.48
                                  ,	142358124087.46
                                  ,	168924032259.40
                                  ,	121781431852.83
                                  ,	129145292214.83
                                  ,	173548366136.24
                                  ,	131813166201.79
                                    ];

    // Configuración para gráfico de Minería
    this.mineriaChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'PBC',
          data: mineriaPBCData,
          borderColor: '#f38135ff',
          backgroundColor: 'rgba(243, 129, 53, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        },
        {
          label: 'Recaudo',
          data: mineriaRecaudoData,
          borderColor: '#7991e8ff',
          backgroundColor: 'rgba(121, 145, 232, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    };

    // Configuración para gráfico de Hidrocarburos
    this.hidrocarburosChartData = {
      labels: monthLabels,
      datasets: [
        {
          label: 'PBC',
          data: hidrocarburosPBCData,
          borderColor: '#f38135ff',
          backgroundColor: 'rgba(243, 129, 53, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        },
        {
          label: 'Recaudo',
          data: hidrocarburosRecaudoData,
          borderColor: '#7991e8ff',
          backgroundColor: 'rgba(121, 145, 232, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }
      ]
    };

    // Opciones comunes para ambos gráficos
    const commonOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 12,
              family: 'Work Sans'
            },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'MM',
            font: {
              size: 11,
              family: 'Work Sans'
            },
            color: '#374151'
          },
          ticks: {
            font: {
              family: 'Work Sans',
              size: 10
            },
            color: '#374151',
            callback: (value: any) => {
              return '$' + this.formatNumber(value) + 'M';
            }
          }
        },
        x: {
          ticks: {
            font: {
              family: 'Work Sans',
              size: 9
            },
            color: '#374151',
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    };

    this.mineriaChartOptions = { ...commonOptions };
    this.hidrocarburosChartOptions = { ...commonOptions };
  }


formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


  /**
   * Inicializar datos de la tabla de comparación mensual
   */
  private initializeMonthlyComparisonData(): void {
    // Usar los mismos datos de los gráficos
    const monthLabels = [
      'Ene 2025', 'Feb 2025', 'Mar 2025', 'Abr 2025', 'May 2025', 'Jun 2025',
      'Jul 2025', 'Ago 2025', 'Sep 2025', 'Oct 2025'
    ];

    // Datos para Minería  mapeada a 25%
    const mineriaPBCData = [
                          	126795714413.05
                          ,	63397857328.05
                          ,	52831547792.05
                          ,	105663095625.05
                          ,	63397857328.05
                          ,	42265238229.00
                          ,	116229405113.00
                          ,	105663095625.00
                          ,	42265238229.00
                          ,	126795714662.00
                          ];
    const mineriaRecaudoData = [
                            	170520203403.32
                            ,	51453810290.40
                            ,	44884216214.08
                            ,	110203177013.64
                            ,	130524675218.82
                            ,	40594514099.83
                            ,	107048473331.95
                            ,	59151589681.17
                            ,	44186173425.12
                            ,	172173515576.15
                              ];

    // Datos para Hidrocarburos (en billones de pesos)
    const hidrocarburosPBCData = [
                              	179540256174.70
                              ,	162165339561.84
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                              ,	179540256174.70
                              ,	173748617303.75
                              ,	179540256174.70
                                ];
    const hidrocarburosRecaudoData = [
                                  	135955506345.63
                                  ,	143937130696.86
                                  ,	258376203757.14
                                  ,	128139964605.48
                                  ,	142358124087.46
                                  ,	168924032259.40
                                  ,	121781431852.83
                                  ,	129145292214.83
                                  ,	173548366136.24
                                  ,	131813166201.79
                                    ];

    // Construir datos de la tabla
    this.monthlyComparisonData = monthLabels.map((month, index) => ({
      mes: month,
      mineria_pbc: mineriaPBCData[index] * 1, // Convertir a pesos
      mineria_recaudo: mineriaRecaudoData[index] * 1,
      hidrocarburos_pbc: hidrocarburosPBCData[index] * 1,
      hidrocarburos_recaudo: hidrocarburosRecaudoData[index] * 1
    }));
  }

  /**
   * Aplicar filtros
   */
  applyFilters(): void {
    if (this.selectedBienio && this.selectedBeneficiario && this.selectedDepartamento) {
      this.filtersApplied = true;
      console.log('Filtros aplicados:', {
        bienio: this.selectedBienio.label,
        beneficiario: this.selectedBeneficiario.nombre,
        departamento: this.selectedDepartamento.nombre
      });
      // Aquí se implementaría la lógica de carga de datos para recaudo directas
    } else {
      console.log('Debe seleccionar todos los filtros requeridos');
    }
  }

  /**
   * Limpiar filtros
   */
  clearFilters(): void {
    this.selectedBienio = { id: 1, label: '2025 - 2026' };
    this.selectedBeneficiario = null;
    this.selectedDepartamento = null;
    this.filtersApplied = false;
    console.log('Filtros limpiados');
  }

  /**
   * Descargar datos en Excel
   */
  downloadExcel(): void {
    console.log('Descargando Excel con datos de recaudo directas:', {
      bienio: this.selectedBienio?.label,
      beneficiario: this.selectedBeneficiario?.nombre,
      departamento: this.selectedDepartamento?.nombre,
      totalRows: this.monthlyComparisonData.length
    });
    // Aquí se implementaría la lógica de descarga del Excel
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
        <h4 style="margin-bottom: 1rem; color: #333;">Diccionario de Conceptos - SGR Recaudo Directas</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR Recaudo Directas:</strong> Sistema de seguimiento del recaudo de asignaciones directas</li>
          <li style="margin-bottom: 0.5rem;"><strong>Asignaciones Directas:</strong> Recursos asignados directamente a entidades territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>Recaudo:</strong> Monto efectivamente recaudado de las asignaciones</li>
          <li style="margin-bottom: 0.5rem;"><strong>Beneficiarios:</strong> Entidades habilitadas para recibir recursos directos del SGR</li>
          <li style="margin-bottom: 0.5rem;"><strong>Bienio:</strong> Período de dos años consecutivos para análisis de recaudo</li>
          <li style="margin-bottom: 0.5rem;"><strong>Entidad Territorial:</strong> Departamento, distrito o municipio beneficiario</li>
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
          <li style="margin-bottom: 0.5rem;"><strong>PBC:</strong> Plan Bienal de Caja</li>
          <li style="margin-bottom: 0.5rem;"><strong>FAEP:</strong> Fondo de Ahorro y Estabilización Petrolera</li>
          <li style="margin-bottom: 0.5rem;"><strong>FONPET:</strong> Fondo Nacional de Pensiones de las Entidades Territoriales</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>SICODIS:</strong> Sistema de Consulta y Distribución</li>
        </ul>
      </div>
    `;
  }
}