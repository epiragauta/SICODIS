// sgp-budget-converter.ts
import { TreeNode } from 'primeng/api';

/**
 * Interfaz para los datos de entrada (formato plano/tabular)
 */
export interface SGPBudgetItem {
  id?: string;
  concepto: string;
  presupuesto: string;
  iac: string;
  avance: string;
  nivel: number;  // 1 = Encabezado principal, 2 = Subgrupo, 3 = Ítem detalle
  padreId?: string; // ID del concepto padre
  expandido?: boolean; // Si el nodo debe estar expandido inicialmente
}

/**
 * Interfaz para los datos procesados (formato TreeNode de PrimeNG)
 */
export interface SGPBudgetNodeData {
  category: string;
  presupuesto: string;
  iac: string;
  avance: string;
}

/**
 * Convierte los datos planos del presupuesto SGP a la estructura jerárquica
 * requerida por el TreeTable de PrimeNG
 *
 * @param flatData Datos en formato plano/tabular
 * @returns Datos en formato TreeNode para PrimeNG TreeTable
 */
export function convertToTreeTableData(flatData: SGPBudgetItem[]): TreeNode[] {
  // Crear un mapa para guardar referencias a nodos por su ID
  const nodeMap = new Map<string, TreeNode>();
  const treeData: TreeNode[] = [];

  // Generar IDs si no existen
  flatData.forEach((item, index) => {
    if (!item.id) {
      item.id = `node_${index}`;
    }
  });

  // Primer paso: crear nodos para cada elemento
  flatData.forEach(item => {
    const node: TreeNode = {
      data: {
        category: item.concepto,
        presupuesto: item.presupuesto,
        iac: item.iac,
        avance: item.avance
      },
      children: [],
      expanded: item.expandido !== undefined ? item.expandido : (item.nivel === 1) // Expandir por defecto nivel 1
    };

    nodeMap.set(item.id!, node);

    // Los nodos de nivel 1 van directamente al árbol principal
    if (item.nivel === 1 || !item.padreId) {
      treeData.push(node);
    }
  });

  // Segundo paso: establecer las relaciones padre-hijo
  flatData.forEach(item => {
    if (item.padreId) {
      const parentNode = nodeMap.get(item.padreId);
      const currentNode = nodeMap.get(item.id!);

      if (parentNode && currentNode && item.nivel > 1) {
        if (!parentNode.children) {
          parentNode.children = [];
        }
        parentNode.children.push(currentNode);
      }
    }
  });

  return treeData;
}

/**
 * Ejemplo de uso con los datos del SGP:
 */
export function createSGPTreeTableData(): TreeNode[] {
  // Ejemplo de datos de entrada en formato plano
  const flatData: SGPBudgetItem[] = [
    {
      id: 'total_sgp',
      concepto: 'TOTAL SGP (incluye ingresos corrientes y medidas)',
      presupuesto: '$ 42.548.255.632.992',
      iac: '$ 43.250.441.734.328',
      avance: '102.00%',
      nivel: 1,
      expandido: true
    },
    {
      id: 'ingresos_corrientes',
      concepto: 'TOTAL INGRESOS CORRIENTES',
      presupuesto: '$ 30.122.324.187.910',
      iac: '$ 30.824.510.289.246',
      avance: '102.00%',
      nivel: 1,
      expandido: true
    },
    {
      id: 'ingresos_inversion',
      concepto: 'INGRESOS CORRIENTES INVERSIÓN',
      presupuesto: '$ 27.879.268.359.160',
      iac: '$ 28.581.455.460.496',
      avance: '103.00%',
      nivel: 1,
      expandido: true
    },
    {
      id: 'asignaciones_directas',
      concepto: 'Asignaciones Directas',
      presupuesto: '$ 7.476.849.429.112',
      iac: '$ 6.329.785.803.922',
      avance: '85.00%',
      nivel: 2,
      padreId: 'ingresos_inversion',
      expandido: false
    },
    {
      id: 'asig_dir_corrientes',
      concepto: 'Corrientes',
      presupuesto: '5961475543294.98',
      iac: '5096683777141',
      avance: '0.85',
      nivel: 3,
      padreId: 'asignaciones_directas',
      expandido: false
    },
    {
      id: 'asig_dir_20',
      concepto: '- 20% Asignaciones Directas',
      presupuesto: '$ 5.981.479.543.292',
      iac: '$ 5.094.276.718.655',
      avance: '85.00%',
      nivel: 4,
      padreId: 'asig_dir_corrientes'
    },
    {
      id: 'asig_dir_20_regalias',
      concepto: '- 20% Asignaciones Directas - Obras por regalías',
      presupuesto: '$ 0',
      iac: '$ 2.407.058.486',
      avance: '0.00%',
      nivel: 4,
      padreId: 'asig_dir_corrientes'
    },
    {
      id: 'asig_dir_corrientes_adicion',
      concepto: 'Corrientes Adición',
      presupuesto: '$ 171.941.177.130',
      iac: '$ 171.941.177.130',
      avance: '100.00%',
      nivel: 3,
      padreId: 'asignaciones_directas',
      expandido: false
    },
    {
      id: 'asig_dir_20_decreto_1065',
      concepto: '- 20% Asignaciones Directas - Decreto 1065 de 2023',
      presupuesto: '$ 116.645.391.392',
      iac: '$ 116.645.391.392',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_corrientes_adicion'
    },
    {
      id: 'asig_dir_20_decreto_1399',
      concepto: '- 20% Asignaciones Directas - Decreto 1399 de 2023',
      presupuesto: '$ 55.295.785.738',
      iac: '$ 55.295.785.738',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_corrientes_adicion'
    },
    {
      id: 'asig_dir_otros_ingresos',
      concepto: 'Otros Ingresos',
      presupuesto: '$ 3.329.686.670.287',
      iac: '$ 3.329.686.670.287',
      avance: '100.00%',
      nivel: 3,
      padreId: 'asignaciones_directas',
      expandido: false
    },
    {
      id: 'rend_fin_0124',
      concepto: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 0124 de 2023',
      presupuesto: '$ 222.748.129.837',
      iac: '$ 222.748.129.837',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'rend_fin_1279',
      concepto: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 1279 de 2023',
      presupuesto: '$ 326.421.191.326',
      iac: '$ 326.421.191.326',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'rend_fin_0053',
      concepto: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 0053 de 2024',
      presupuesto: '$ 451.750.272.602',
      iac: '$ 451.750.272.602',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'rend_fin_956',
      concepto: '- Rendimientos Financieros Asignaciones Directas (20%) - Decreto 956 de 2024',
      presupuesto: '$ 350.384.789.265',
      iac: '$ 350.384.789.265',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'mayor_recaudo',
      concepto: '- Mayor recaudo Asignaciones Directas 20%',
      presupuesto: '$ 1.934.315.575.222',
      iac: '$ 1.934.315.575.222',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'dif_cambiario',
      concepto: '- Diferencial cambiario art. 17 Ley 2279 2022',
      presupuesto: '$ 5.115.388.900',
      iac: '$ 5.115.388.900',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'reintegros_203',
      concepto: '- Reintegros art 203 Ley 2056',
      presupuesto: '$ 214.297.106',
      iac: '$ 214.297.106',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'reintegros_204',
      concepto: '- Reintegros art 204 Ley 2056',
      presupuesto: '$ 38.737.026.029',
      iac: '$ 38.737.026.029',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros_ingresos'
    },
    {
      id: 'asig_dir_otros',
      concepto: 'Otros',
      presupuesto: '$ 42.985.294.281',
      iac: '$ 42.985.294.281',
      avance: '100.00%',
      nivel: 3,
      padreId: 'asignaciones_directas',
      expandido: false
    },
    {
      id: 'asig_dir_5_1065',
      concepto: '- 5% Asignaciones Directas Anticipadas - Decreto 1065 de 2023',
      presupuesto: '$ 29.161.347.846',
      iac: '$ 29.161.347.846',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros'
    },
    {
      id: 'asig_dir_5_1399',
      concepto: '- 5% Asignaciones Directas Anticipadas - Decreto 1399 de 2024',
      presupuesto: '$ 13.823.946.435',
      iac: '$ 13.823.946.435',
      avance: '100.00%',
      nivel: 4,
      padreId: 'asig_dir_otros'
    },
    {
      id: 'inversion_regional',
      concepto: 'Asignación para la Inversión Regional',
      presupuesto: '$ 10.168.515.223.616',
      iac: '$ 10.168.515.223.616',
      avance: '100.00%',
      nivel: 2,
      padreId: 'ingresos_inversion',
      expandido: false
    },
    {
      id: 'inv_reg_deptos',
      concepto: '- Departamentos',
      presupuesto: '$ 6.101.109.134.170',
      iac: '$ 6.101.109.134.170',
      avance: '100.00%',
      nivel: 3,
      padreId: 'inversion_regional'
    },
    {
      id: 'inv_reg_regiones',
      concepto: '- Regiones',
      presupuesto: '$ 4.067.406.089.446',
      iac: '$ 4.067.406.089.446',
      avance: '100.00%',
      nivel: 3,
      padreId: 'inversion_regional'
    },
    {
      id: 'inversion_local',
      concepto: 'Asignación para la Inversión Local',
      presupuesto: '$ 4.486.109.657.464',
      iac: '$ 4.486.109.657.464',
      avance: '100.00%',
      nivel: 2,
      padreId: 'ingresos_inversion',
      expandido: false
    },
    {
      id: 'inv_local_municipios',
      concepto: '- Municipios más pobres',
      presupuesto: '$ 3.792.258.030.440',
      iac: '$ 3.792.258.030.440',
      avance: '100.00%',
      nivel: 3,
      padreId: 'inversion_local'
    },
    {
      id: 'inv_local_ambiente',
      concepto: '- Asignación para la Inversión Local - Ambiente y Desarrollo Sostenible',
      presupuesto: '$ 505.634.404.048',
      iac: '$ 505.634.404.048',
      avance: '100.00%',
      nivel: 3,
      padreId: 'inversion_local'
    },
    {
      id: 'inv_local_nbi',
      concepto: '- Asignación para la Inversión Local según NBI y cuarta, quinta, y sexta categoría',
      presupuesto: '$ 3.286.623.626.392',
      iac: '$ 3.286.623.626.392',
      avance: '100.00%',
      nivel: 3,
      padreId: 'inversion_local'
    },
    {
      id: 'ciencia_tecnologia',
      concepto: 'Asignación para Ciencia, Tecnología e Innovación',
      presupuesto: '$ 2.990.739.771.652',
      iac: '$ 2.990.739.771.652',
      avance: '100.00%',
      nivel: 2,
      padreId: 'ingresos_inversion',
      expandido: false
    },
    {
      id: 'cti_ambiente',
      concepto: '- Asignación para Ciencia, Tecnología e Innovación - Ambiente y desarrollo Sostenible - Convocatorias',
      presupuesto: '$ 598.147.954.330',
      iac: '$ 598.147.954.330',
      avance: '100.00%',
      nivel: 3,
      padreId: 'ciencia_tecnologia'
    },
    {
      id: 'cti_convocatorias',
      concepto: '- Asignación para Ciencia, Tecnología e Innovación - Convocatorias',
      presupuesto: '$ 2.392.591.817.322',
      iac: '$ 2.392.591.817.322',
      avance: '100.00%',
      nivel: 3,
      padreId: 'ciencia_tecnologia'
    }
  ];

  return convertToTreeTableData(flatData);
}

/**
 * Función auxiliar para formatear valores monetarios
 * @param value Valor numérico o string que representa un valor monetario
 * @returns String formateado con el formato de moneda colombiana
 */
export function formatCurrency(value: number | string): string {
  if (typeof value === 'string') {
    // Si ya incluye el símbolo de peso, devolvemos como está
    if (value.trim().startsWith('$')) {
      return value;
    }
    // Intentamos convertir a número
    value = Number(value.replace(/[^\d.-]/g, ''));
  }

  // Si no es un número válido, devolvemos un string vacío
  if (isNaN(value)) {
    return '';
  }

  // Formateamos como moneda colombiana
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Función para calcular el porcentaje de avance
 * @param presupuesto Valor del presupuesto
 * @param iac Valor de la instrucción de abono a cuenta
 * @returns Porcentaje formateado con dos decimales
 */
export function calcularAvance(presupuesto: string | number, iac: string | number): string {
  // Convertir a números si son strings
  const presupuestoNum = typeof presupuesto === 'string'
    ? Number(presupuesto.replace(/[^\d.-]/g, ''))
    : presupuesto;

  const iacNum = typeof iac === 'string'
    ? Number(iac.replace(/[^\d.-]/g, ''))
    : iac;

  // Verificar que ambos sean números válidos
  if (isNaN(presupuestoNum) || isNaN(iacNum) || presupuestoNum === 0) {
    return '0.00%';
  }

  // Calcular el porcentaje
  const porcentaje = (iacNum / presupuestoNum) * 100;

  // Formatear a dos decimales
  return `${porcentaje.toFixed(2)}%`;
}

/**
 * Función para determinar la clase CSS según el valor de avance
 * @param avance Valor del avance en formato string (por ejemplo, "85.00%")
 * @returns Nombre de la clase CSS a aplicar
 */
export function getAvanceClass(avance: string): string {
  const value = parseFloat(avance.replace('%', ''));
  if (value >= 100) {
    return 'avance-completo';
  } else if (value >= 80) {
    return 'avance-parcial';
  } else {
    return 'avance-bajo';
  }
}