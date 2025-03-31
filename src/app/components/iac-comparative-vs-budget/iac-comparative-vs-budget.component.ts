import { Component, OnInit, Input  } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { TreeTableModule } from 'primeng/treetable';

@Component({
  selector: 'app-iac-comparative-vs-budget',
  standalone: true,
  imports: [CommonModule, TreeTableModule],
  templateUrl: './iac-comparative-vs-budget.component.html',
  styleUrl: './iac-comparative-vs-budget.component.scss'
})
export class IacComparativeVsBudgetComponent implements OnInit {
  @Input() selectedYear: string = '2024';
  @Input() selectedDepartment: string = 'Todos';

  budgetData: TreeNode[] = [];
  cols: any[] = [];
  selectedNode: TreeNode | null = null;

  constructor() { }

  ngOnInit() {
    this.cols = [
      { field: 'category', header: 'Concepto' },
      { field: 'presupuesto', header: 'Presupuesto' },
      { field: 'iac', header: 'Instrucción de Abono a Cuenta' },
      { field: 'avance', header: 'Avance IAC frente a Presupuesto' }
    ];

    this.loadBudgetData();
  }

  loadBudgetData() {
    // Construimos la estructura de TreeNodes para PrimeNG
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

  getAvanceClass(avance: string): string {
    const value = parseFloat(avance.replace('%', ''));
    if (value >= 100) {
      return 'avance-completo';
    } else if (value >= 80) {
      return 'avance-parcial';
    } else {
      return 'avance-bajo';
    }
  }

  // Método para exportar los datos (puedes modificarlo según tus necesidades)
  exportData() {
    console.log('Exportando datos...');
    // Aquí irá la lógica para exportar los datos a Excel o CSV
  }
}