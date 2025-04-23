/**
 * Organiza datos en una estructura jerárquica basada en categorías
 * Las categorías tipo "1.2.3" se anidan bajo sus categorías padre "1.2"
 * Cada objeto se encapsula dentro de una propiedad 'data'
 * @param {Array} data - Array de objetos con propiedad "categoria"
 * @returns {Array} - Estructura jerárquica de datos con el formato:
 * [
 *   {
 *     data: { categoría, concepto, valores... },
 *     children: [
 *       {
 *         data: { categoría hijo, concepto, valores... },
 *         children: [],
 *         expanded: false,
 *         avance: '33.00%'
 *       },
 *       ...
 *     ],
 *     expanded: false
 *   },
 *   ...
 * ]
 */
function organizeCategoryData(data: any) {
  // Ordenamos los datos por categoría para asegurar que los padres se procesen antes que los hijos
  const sortedData = [...data].sort((a, b) => {
    const aSegments = a.categoria.split('.');
    const bSegments = b.categoria.split('.');

    // Primero comparamos por la profundidad (número de segmentos)
    if (aSegments.length !== bSegments.length) {
      return aSegments.length - bSegments.length;
    }

    // Si tienen la misma profundidad, comparamos alfabéticamente
    return a.categoria.localeCompare(b.categoria);
  });

  // Creamos un mapa para acceder fácilmente a los nodos
  const nodeMap = new Map();

  // Primera pasada: creamos todos los nodos con sus propiedades
  sortedData.forEach(item => {
    // Creamos la estructura del nodo con 'data', 'children' y 'expanded'
    item['avance'] = '33.00%'; // Asignamos un valor de avance por defecto
    const node = {
      data: { ...item },  // Encapsulamos todas las propiedades en 'data'
      children: [],  // Inicializamos el array de hijos
      expanded: false,  // Estado de expansión inicial del nodo
    };
    nodeMap.set(item.categoria, node);
  });

  // Segunda pasada: establecemos las relaciones padre-hijo
  const rootNodes: any = [];

  sortedData.forEach(item => {
    const node = nodeMap.get(item.categoria);

    // Si la categoría tiene un punto, buscamos a su padre
    if (item.categoria.includes('.')) {
      const segments = item.categoria.split('.');

      // Construimos la categoría del padre eliminando el último segmento
      const parentCategory = segments.slice(0, -1).join('.');

      const parent = nodeMap.get(parentCategory);
      if (parent) {
        // Añadimos este nodo como hijo del padre
        parent.children.push(node);
      } else {
        // Si no encontramos el padre, lo agregamos como nodo raíz
        rootNodes.push(node);
      }
    } else {
      // Las categorías sin punto son nodos raíz (1, 2, 3, total, etc.)
      rootNodes.push(node);
    }
  });

  // Limpieza final: eliminamos los nodos que ya están como hijos de algún padre
  // para evitar duplicados en el resultado final
  const childNodeCategories = new Set();
  nodeMap.forEach(node => {
    node.children.forEach((child: any) => {
      childNodeCategories.add(child.data.categoria);
    });
  });

  return rootNodes.filter((node: any) => !childNodeCategories.has(node.data.categoria));
}

/**
 * Función para procesar directamente un array de datos en memoria
 * @param {Array} inputData - Array de datos a organizar
 * @returns {Array} - Estructura jerárquica organizada
 */
function processArrayData(inputData: any) {
  if (!Array.isArray(inputData)) {
    console.error("Los datos de entrada deben ser un array");
    return [];
  }

  try {
    const hierarchicalData = organizeCategoryData(inputData);
    return hierarchicalData;
  } catch (error) {
    console.error("Error procesando los datos:", error);
    return [];
  }
}

// Ejemplo de uso directo con datos:
/*
const result = processArrayData([
  { categoria: "1", concepto: "INVERSION", "2025": 11731118462647, ... },
  { categoria: "1.1", concepto: "Asignación para la Paz", ... },
  ...
]);
console.log(result);
*/

// Exportar las funciones para uso en otros módulos
export { organizeCategoryData, processArrayData };
