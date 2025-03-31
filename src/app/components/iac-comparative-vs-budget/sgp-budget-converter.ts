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
      presupuesto: '$