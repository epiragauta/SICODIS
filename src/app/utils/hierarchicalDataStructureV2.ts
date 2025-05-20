/**
 * Organiza datos en una estructura jerárquica basada en categorías
 * Las categorías tipo "1.2.3" se anidan bajo sus categorías padre "1.2"
 * Ordena las categorías numéricamente en lugar de alfabéticamente
 *
 * @param {Array} data - Array de objetos con propiedad "categoria"
 * @returns {Array} - Estructura jerárquica de datos ordenada numéricamente
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

    // Si tienen la misma profundidad, comparamos numéricamente segmento por segmento
    for (let i = 0; i < aSegments.length; i++) {
      const aVal = parseInt(aSegments[i], 10);
      const bVal = parseInt(bSegments[i], 10);

      if (aVal !== bVal) {
        return aVal - bVal;
      }
    }

    return 0; // Si son idénticos
  });

  // Creamos un mapa para acceder fácilmente a los nodos
  const nodeMap = new Map();

  // Primera pasada: creamos todos los nodos con sus propiedades
  sortedData.forEach(item => {
    // Creamos la estructura del nodo con 'data', 'children', 'expanded' y 'avance'
    const node = {
      data: { ...item },  // Encapsulamos todas las propiedades en 'data'
      children: [],       // Inicializamos el array de hijos
      expanded: false,    // Estado de expansión inicial del nodo
      avance: "33.00%"    // Valor predeterminado de avance
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
        if (segments.length < 4)
          node.expanded = false;
      } else {
        // Si no encontramos el padre, lo agregamos como nodo raíz
        node.expanded = false; // Expandimos los nodos raíz por defecto
        rootNodes.push(node);
      }
    } else {
      // Las categorías sin punto son nodos raíz (1, 2, 3, total, etc.)
      node.expanded = true; // Expandimos los nodos raíz por defecto
      rootNodes.push(node);
    }
  });

  // Ordenamos los nodos raíz numéricamente (excepto "total" que siempre va al final)
  rootNodes.sort((a: any, b: any) => {
    if (a.data.categoria === "total") return 1;
    if (b.data.categoria === "total") return -1;

    const aVal = parseInt(a.data.categoria, 10) || 0;
    const bVal = parseInt(b.data.categoria, 10) || 0;

    return aVal - bVal;
  });

  // Ordenamos recursivamente los hijos en cada nivel
  function sortChildrenRecursively(nodes: any) {
    for (const node of nodes) {
      if (node.children.length > 0) {
        node.children.sort((a: any, b: any) => {
          const aSegments = a.data.categoria.split('.');
          const bSegments = b.data.categoria.split('.');

          const aLastSegment = parseInt(aSegments[aSegments.length - 1], 10);
          const bLastSegment = parseInt(bSegments[bSegments.length - 1], 10);

          return aLastSegment - bLastSegment;
        });

        // Ordenamos recursivamente los hijos de este nodo
        sortChildrenRecursively(node.children);
      }
    }
  }

  // Aplicamos la ordenación recursiva a todos los hijos
  sortChildrenRecursively(rootNodes);

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
 * Calcula el avance para cada nodo en la estructura jerárquica
 * basado en su valor para un año específico comparado con el valor total
 *
 * @param {Array} hierarchicalData - La estructura jerárquica resultado de organizeCategoryData
 * @param {string} year - El año para el cual calcular el avance (ej: "2025", "2026", etc.)
 * @param {number} [decimals=2] - Número de decimales para el porcentaje
 * @returns {Array} - La misma estructura con la propiedad avance actualizada
 */
function calculateAdvanceByYear(hierarchicalData: any, year: any, decimals = 2) {
  // Primero, buscamos el nodo con categoria = "total"
  const totalNode = hierarchicalData.find((node: any) => node.data.categoria === "total");

  if (!totalNode || !totalNode.data[year]) {
    console.warn(`No se encontró nodo total o el año ${year} no existe en el nodo total`);
    return hierarchicalData;
  }

  const totalValue = totalNode.data[year];

  /**
   * Función recursiva para actualizar el avance en cada nodo y sus hijos
   */
  function updateAdvance(nodes: any) {
    nodes.forEach((node: any) => {
      // Actualizamos el avance solo si no es el nodo total
      if (node.data.categoria !== "total" && node.data[year] !== undefined) {
        const percentage = (node.data[year] / totalValue) * 100;
        node.avance = `${percentage.toFixed(decimals)}%`;
      }

      // Procesamos recursivamente los hijos
      if (node.children && node.children.length > 0) {
        updateAdvance(node.children);
      }
    });
  }

  // Hacemos una copia profunda para no modificar el original
  const result = JSON.parse(JSON.stringify(hierarchicalData));

  // Actualizamos el avance en toda la estructura
  updateAdvance(result);

  return result;
}

/**
 * Procesa un array de datos y luego calcula el avance basado en un año específico
 * @param {Array} inputData - Array de datos a organizar
 * @param {string} year - El año para el cual calcular el avance
 * @param {number} [decimals=2] - Número de decimales para el porcentaje
 * @returns {Array} - Estructura jerárquica organizada con avances calculados
 */
function processArrayDataWithAdvance(inputData: any, year: any, decimals = 2) {
  if (!Array.isArray(inputData)) {
    console.error("Los datos de entrada deben ser un array");
    return [];
  }

  try {
    // Primero organizamos los datos en estructura jerárquica
    const hierarchicalData = organizeCategoryData(inputData);

    // Luego calculamos el avance basado en el año especificado
    return calculateAdvanceByYear(hierarchicalData, year, decimals);
  } catch (error) {
    console.error("Error procesando los datos:", error);
    return [];
  }
}

// Exportar las funciones para uso en otros módulos
export {
  organizeCategoryData,
  calculateAdvanceByYear,
  processArrayDataWithAdvance
};
