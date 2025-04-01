import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { Popover } from 'primeng/popover';
import { SGPBudgetItem, convertToTreeTableData, getAvanceClass } from './sgp-budget-converter';

// Interfaces para la información adicional
interface DocumentInfo {
  name: string;
  url: string;
  type: 'pdf' | 'excel' | 'word' | 'generic';
}

interface NodeInfo {
  title: string;
  description: string;
  documents?: DocumentInfo[];
  moreDetailsUrl?: string;
}

@Component({
  selector: 'app-iac-comparative-vs-budget',
  standalone: true,
  imports: [CommonModule, TreeTableModule, ButtonModule, PopoverModule],
  templateUrl: './iac-comparative-vs-budget.component.html',
  styleUrl: './iac-comparative-vs-budget.component.scss'
})
export class IacComparativeVsBudgetComponent implements OnInit {
  @Input() selectedYear: string = '2024';
  @Input() selectedDepartment: string = 'Todos';
  @Input() budgetItems: SGPBudgetItem[] = [];

  @ViewChild('infoPanel') infoPanel!: Popover;

  budgetData: TreeNode[] = [];
  cols: any[] = [];
  selectedNode: TreeNode | null = null;

  // Variables para el panel de información
  selectedInfoTitle: string = '';
  selectedInfoDescription: string = '';
  selectedInfoDocuments: DocumentInfo[] = [];
  selectedInfoMoreDetailsUrl: string | undefined = undefined;

  // Mapa de información adicional para los nodos
  infoMap: Map<string, Map<string, NodeInfo>> = new Map();

  constructor() {
    // Inicializar datos de información para algunos nodos
    this.initializeInfoData();
  }

  ngOnInit() {
    this.cols = [
      { field: 'category', header: 'Concepto' },
      { field: 'presupuesto', header: 'Presupuesto' },
      { field: 'iac', header: 'Instrucción de Abono a Cuenta' },
      { field: 'avance', header: 'Avance IAC frente a Presupuesto' }
    ];

    this.loadBudgetData();
  }

  // Inicializa datos de información de muestra
  private initializeInfoData() {
    // Información para "TOTAL SGP"
    const totalSgpInfo = new Map<string, NodeInfo>();
    totalSgpInfo.set('presupuesto', {
      title: 'Presupuesto Total SGP',
      description: 'Este valor corresponde al presupuesto total asignado al Sistema General de Participaciones para el año fiscal actual, según lo aprobado por el Congreso de la República.',
      documents: [
        { name: 'Ley de Presupuesto 2024', url: 'https://example.com/presupuesto-2024.pdf', type: 'pdf' },
        { name: 'Informe Detallado SGP', url: 'https://example.com/informe-sgp.xlsx', type: 'excel' }
      ],
      moreDetailsUrl: 'https://example.com/detalles-presupuesto'
    });
    totalSgpInfo.set('iac', {
      title: 'Instrucción de Abono a Cuenta SGP',
      description: 'Este valor representa el total de recursos efectivamente distribuidos a las entidades territoriales mediante Instrucciones de Abono a Cuenta (IAC).',
      documents: [
        { name: 'Distribución SGP 2024', url: 'https://example.com/distribucion-sgp.pdf', type: 'pdf' }
      ]
    });
    this.infoMap.set('TOTAL SGP (incluye ingresos corrientes y medidas)', totalSgpInfo);

    // Información para "Asignaciones Directas"
    const asignacionesDirectasInfo = new Map<string, NodeInfo>();
    asignacionesDirectasInfo.set('presupuesto', {
      title: 'Presupuesto Asignaciones Directas',
      description: 'Recursos destinados a las entidades territoriales en cuyo territorio se adelantan explotaciones de recursos naturales no renovables o por donde se transportan dichos recursos.',
      documents: [
        { name: 'Detalle Asignaciones Directas', url: 'https://example.com/asignaciones-directas.pdf', type: 'pdf' },
        { name: 'Normatividad Vigente', url: 'https://example.com/normatividad.docx', type: 'word' }
      ],
      moreDetailsUrl: 'https://example.com/detalles-asignaciones'
    });
    asignacionesDirectasInfo.set('iac', {
      title: 'IAC Asignaciones Directas',
      description: 'Recursos efectivamente girados a entidades territoriales por concepto de asignaciones directas durante el periodo.',
      documents: [
        { name: 'Distribución Territorial', url: 'https://example.com/distribucion-territorial.xlsx', type: 'excel' }
      ]
    });
    this.infoMap.set('Asignaciones Directas', asignacionesDirectasInfo);
  }

  loadBudgetData() {

    // Construimos la estructura de TreeNodes para PrimeNG
    if (this.budgetItems && this.budgetItems.length > 0) {
      // Si se proporcionaron datos externos, úsalos
      this.budgetData = convertToTreeTableData(this.budgetItems);
    } else {
      this.budgetData = [
        {
          data: {
            category: 'TOTAL SGP (incluye ingresos corrientes y medidas)',
            presupuesto: '$ 42.548.255.632.992',
            iac: '$ 43.250.441.734.328',
            avance: '102.00%'
          },
          expanded: true
        },
        {
          data: {
            category: 'TOTAL INGRESOS CORRIENTES',
            presupuesto: '$ 30.122.324.187.910',
            iac: '$ 30.824.510.289.246',
            avance: '102.00%'
          },
          expanded: true
        },
        {
          data: {
            category: 'INGRESOS CORRIENTES INVERSIÓN',
            presupuesto: '$ 27.879.268.359.160',
            iac: '$ 28.581.455.460.496',
            avance: '103.00%'
          },
          expanded: true,
          children: [
            {
              data: {
                category: 'Asignaciones Directas',
                presupuesto: '$ 7.476.849.429.112',
                iac: '$ 6.329.785.803.922',
                avance: '85.00%'
              },
              expanded: false,
              // Tercer nivel - Agrupaciones bajo Asignaciones Directas
              children: [
                {
                  data: {
                    category: 'Corrientes',
                    presupuesto: '5961475543294.98',
                    iac: '5096683777141',
                    avance: '0.85'
                  },
                  children: [
                    {
                      data: {
                        category: '- 20% Asignaciones Directas',
                        presupuesto: '$ 5.981.479.543.292',
                        iac: '$ 5.094.276.718.655',
                        avance: '85.00%'
                      }
                    },
                    {
                      data: {
                        category: '- 20% Asignaciones Directas - Obras por regalías',
                        presupuesto: '$ 0',
                        iac: '$ 2.407.058.486',
                        avance: '0.00%'
                      }
                    }
                  ]
                },
                {
                  data: {
                    category: 'Corrientes Adición',
                    presupuesto: '$ 171.941.177.130',
                    iac: '$ 171.941.177.130',
                    avance: '100.00%'
                  },
                  children: [
                    {
                      data: {
                        category: '- 20% Asignaciones Directas - Decreto 1065 de 2023',
                        presupuesto: '$ 116.645.391.392',
                        iac: '$ 116.645.391.392',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- 20% Asignaciones Directas - Decreto 1399 de 2023',
                        presupuesto: '$ 55.295.785.738',
                        iac: '$ 55.295.785.738',
                        avance: '100.00%'
                      }
                    }
                  ]
                },
                {
                  data: {
                    category: 'Otros Ingresos',
                    presupuesto: '$ 3.329.686.670.287',
                    iac: '$ 3.329.686.670.287',
                    avance: '100.00%'
                  },
                  children: [
                    {
                      data: {
                        category: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 0124 de 2023',
                        presupuesto: '$ 222.748.129.837',
                        iac: '$ 222.748.129.837',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 1279 de 2023',
                        presupuesto: '$ 326.421.191.326',
                        iac: '$ 326.421.191.326',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 0053 de 2024',
                        presupuesto: '$ 451.750.272.602',
                        iac: '$ 451.750.272.602',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 956 de 2024',
                        presupuesto: '$ 350.384.789.265',
                        iac: '$ 350.384.789.265',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Mayor recaudo Asignaciones Directas 20%',
                        presupuesto: '$ 1.934.315.575.222',
                        iac: '$ 1.934.315.575.222',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Diferencial cambiario art. 17 Ley 2279 2022',
                        presupuesto: '$ 5.115.388.900',
                        iac: '$ 5.115.388.900',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Reintegros art 203 Ley 2056',
                        presupuesto: '$ 214.297.106',
                        iac: '$ 214.297.106',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- Reintegros art 204 Ley 2056',
                        presupuesto: '$ 38.737.026.029',
                        iac: '$ 38.737.026.029',
                        avance: '100.00%'
                      }
                    }
                  ]
                },
                {
                  data: {
                    category: 'Otros',
                    presupuesto: '$ 42.985.294.281',
                    iac: '$ 42.985.294.281',
                    avance: '100.00%'
                  },
                  children: [
                    {
                      data: {
                        category: '- 5% Asignaciones Directas Anticipadas - Decreto 1065 de 2023',
                        presupuesto: '$ 29.161.347.846',
                        iac: '$ 29.161.347.846',
                        avance: '100.00%'
                      }
                    },
                    {
                      data: {
                        category: '- 5% Asignaciones Directas Anticipadas - Decreto 1399 de 2024',
                        presupuesto: '$ 13.823.946.435',
                        iac: '$ 13.823.946.435',
                        avance: '100.00%'
                      }
                    }
                  ]
                }
              ]
            },
            {
              data: {
                category: 'Asignación para la Inversión Regional',
                presupuesto: '$ 10.168.515.223.616',
                iac: '$ 10.168.515.223.616',
                avance: '100.00%'
              },
              expanded: false,
              children: [
                {
                  data: {
                    category: '- Departamentos',
                    presupuesto: '$ 6.101.109.134.170',
                    iac: '$ 6.101.109.134.170',
                    avance: '100.00%'
                  }
                },
                {
                  data: {
                    category: '- Regiones',
                    presupuesto: '$ 4.067.406.089.446',
                    iac: '$ 4.067.406.089.446',
                    avance: '100.00%'
                  }
                }
              ]
            },
            {
              data: {
                category: 'Asignación para la Inversión Local',
                presupuesto: '$ 4.486.109.657.464',
                iac: '$ 4.486.109.657.464',
                avance: '100.00%'
              },
              expanded: false,
              children: [
                {
                  data: {
                    category: '- Municipios más pobres',
                    presupuesto: '$ 3.792.258.030.440',
                    iac: '$ 3.792.258.030.440',
                    avance: '100.00%'
                  }
                },
                {
                  data: {
                    category: '- Asignación para la Inversión Local - Ambiente y Desarrollo Sostenible',
                    presupuesto: '$ 505.634.404.048',
                    iac: '$ 505.634.404.048',
                    avance: '100.00%'
                  }
                },
                {
                  data: {
                    category: '- Asignación para la Inversión Local según NBI y cuarta, quinta, y sexta categoría',
                    presupuesto: '$ 3.286.623.626.392',
                    iac: '$ 3.286.623.626.392',
                    avance: '100.00%'
                  }
                }
              ]
            },
            {
              data: {
                category: 'Asignación para Ciencia, Tecnología e Innovación',
                presupuesto: '$ 2.990.739.771.652',
                iac: '$ 2.990.739.771.652',
                avance: '100.00%'
              },
              expanded: false,
              children: [
                {
                  data: {
                    category: '- Asignación para Ciencia, Tecnología e Innovación - Ambiente y desarrollo Sostenible - Convocatorias',
                    presupuesto: '$ 598.147.954.330',
                    iac: '$ 598.147.954.330',
                    avance: '100.00%'
                  }
                },
                {
                  data: {
                    category: '- Asignación para Ciencia, Tecnología e Innovación - Convocatorias',
                    presupuesto: '$ 2.392.591.817.322',
                    iac: '$ 2.392.591.817.322',
                    avance: '100.00%'
                  }
                }
              ]
            }
          ]
        }
      ];
    }
  }

  getAvanceClass(avance: string): string {
    return getAvanceClass(avance);
  }

  // Método para exportar los datos (puedes modificarlo según tus necesidades)
  exportData() {
    console.log('Exportando datos...');
    // Aquí irá la lógica para exportar los datos a Excel o CSV
  }

  // Verifica si hay información disponible para el presupuesto de un nodo
  hasPresupuestoInfo(rowData: any): boolean {
    return this.hasInfo(rowData.category, 'presupuesto');
  }

  // Verifica si hay información disponible para el IAC de un nodo
  hasIacInfo(rowData: any): boolean {
    return this.hasInfo(rowData.category, 'iac');
  }

  // Método genérico para verificar si hay información
  private hasInfo(category: string, field: string): boolean {
    if (!this.infoMap.has(category)) {
      return false;
    }

    const categoryInfo = this.infoMap.get(category);
    return categoryInfo?.has(field) || false;
  }

  // Muestra el panel de información
  showInfo(event: Event, field: string, rowData: any) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.infoMap.has(rowData.category)) {
      return;
    }

    const categoryInfo = this.infoMap.get(rowData.category);
    const info = categoryInfo?.get(field);

    if (info) {
      this.selectedInfoTitle = info.title;
      this.selectedInfoDescription = info.description;
      this.selectedInfoDocuments = info.documents || [];
      this.selectedInfoMoreDetailsUrl = info.moreDetailsUrl;

      this.infoPanel.show(event);
    }
  }

  // Obtiene el icono según el tipo de documento
  getDocumentIcon(type: string): string {
    switch (type) {
      case 'pdf':
        return 'pi-file-pdf';
      case 'excel':
        return 'pi-file-excel';
      case 'word':
        return 'pi-file-word';
      default:
        return 'pi-file';
    }
  }

  // Abre la URL de más detalles
  openMoreDetails() {
    if (this.selectedInfoMoreDetailsUrl) {
      window.open(this.selectedInfoMoreDetailsUrl, '_blank');
    }
    this.infoPanel.hide();
  }

}
