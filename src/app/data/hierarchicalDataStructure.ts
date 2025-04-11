/**
 * Organiza datos en una estructura jerárquica basada en categorías
 * Las categorías tipo "1.2.3" se anidan bajo sus categorías padre "1.2"
 * Cada objeto se encapsula dentro de una propiedad 'data'
 * @param {Array} data - Array de objetos con propiedad "Categoria"
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
    const aSegments = a.Categoria.split('.');
    const bSegments = b.Categoria.split('.');

    // Primero comparamos por la profundidad (número de segmentos)
    if (aSegments.length !== bSegments.length) {
      return aSegments.length - bSegments.length;
    }

    // Si tienen la misma profundidad, comparamos alfabéticamente
    return a.Categoria.localeCompare(b.Categoria);
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
    nodeMap.set(item.Categoria, node);
  });

  // Segunda pasada: establecemos las relaciones padre-hijo
  const rootNodes: any = [];

  sortedData.forEach(item => {
    const node = nodeMap.get(item.Categoria);

    // Si la categoría tiene un punto, buscamos a su padre
    if (item.Categoria.includes('.')) {
      const segments = item.Categoria.split('.');

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
      childNodeCategories.add(child.data.Categoria);
    });
  });

  return rootNodes.filter((node: any) => !childNodeCategories.has(node.data.Categoria));
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
  { Categoria: "1", Concepto: "INVERSION", "2025": 11731118462647, ... },
  { Categoria: "1.1", Concepto: "Asignación para la Paz", ... },
  ...
]);
console.log(result);
*/

// Exportar las funciones para uso en otros módulos
export { organizeCategoryData, processArrayData };
