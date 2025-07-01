/**
 * Funciones para analizar datos del Sistema General de Regalías (SGR)
 * Versión actualizada que maneja registros de totales
 * 
 * Este conjunto de funciones permite:
 * 1. Obtener una lista de valores únicos por el atributo "fuente"
 * 2. Obtener una lista de valores únicos por el atributo "concepto" dada una fuente
 * 3. Obtener una lista de valores únicos por el atributo "beneficiario" dada una fuente y concepto
 * 4. Obtener un registro completo dada una fuente, concepto y beneficiario
 * 5. Generar registros de totales automáticamente
 */

/**
 * Genera un registro de totales consolidado a partir de un array de datos
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Object} - Registro con totales calculados
 */
function generarRegistroTotales(data: any) {
  if (!data || data.length === 0) {
    console.warn('No hay datos para generar totales');
    return null;
  }

  try {
    // Campos que se deben sumar (valores monetarios)
    const camposSuma = [
      'distribucion-presupuesto-corriente',
      'distribucion-otros',
      'total-asignado-bienio',
      'disponibilidad-inicial',
      'apropiacion-vigente',
      'recursos-bloqueados',
      'apropiacion-vigente-disponible',
      'iac-mayor-recaudo-saldos-y-reintegros',
      'iac-corriente',
      'iac-informadas',
      'caja-total',
      'cdp',
      'compromisos',
      'pagos',
      'saldo-por-comprometer',
      'caja-disponible',
      'saldo-disponible-a-pagos',
      'saldo-sin-afectacion'
    ];

    // Campos que se deben promediar (porcentajes)
    const camposPromedio = [
      'avance-iac-corriente',
      'ejecucion-a-compromisos'
    ];

    // Función para convertir string a número
    const convertirANumero = (valor: any): number => {
      if (typeof valor === 'number') return valor;
      if (typeof valor === 'string') {
        // Eliminar puntos como separadores de miles y reemplazar comas por puntos para decimales
        const numeroLimpio = valor.replace(/\./g, '').replace(',', '.');
        const numero = parseFloat(numeroLimpio);
        return isNaN(numero) ? 0 : numero;
      }
      return 0;
    };

    // Función para convertir porcentaje string a número
    const convertirPorcentajeANumero = (valor: any): number => {
      if (typeof valor === 'number') return valor;
      if (typeof valor === 'string') {
        // Remover el símbolo % y convertir
        const numeroLimpio = valor.replace('%', '').replace(',', '.');
        const numero = parseFloat(numeroLimpio);
        return isNaN(numero) ? 0 : numero;
      }
      return 0;
    };

    // Inicializar objeto de totales
    const registroTotales: any = {
      "cod-sgpr": "TOTAL",
      "cod-sicodis": "TOTAL",
      "id": "TOTAL",
      "fuente": "TOTAL",
      "concepto": "TOTAL",
      "beneficiario": "TOTAL",
      "acto-administrativo": "Consolidado Total"
    };

    // Calcular sumas
    camposSuma.forEach(campo => {
      const suma = data.reduce((total: number, registro: any) => {
        return total + convertirANumero(registro[campo]);
      }, 0);
      registroTotales[campo] = suma;
    });

    // Calcular promedios para porcentajes
    camposPromedio.forEach(campo => {
      const valoresValidos = data
        .map((registro: any) => convertirPorcentajeANumero(registro[campo]))
        .filter((valor: number) => !isNaN(valor) && valor !== 0);
      
      const promedio = valoresValidos.length > 0 
        ? valoresValidos.reduce((sum: number, val: number) => sum + val, 0) / valoresValidos.length 
        : 0;
      
      registroTotales[campo] = promedio;
    });

    return registroTotales;

  } catch (error) {
    console.error('Error generando registro de totales:', error);
    return null;
  }
}

/**
 * Obtiene la lista de valores únicos por el atributo "fuente"
 * Excluye el registro de totales del listado
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Array} - Lista de fuentes únicas
 */
function getFuentes(data: any) {
  // Usando Set para eliminar duplicados
  const fuentesSet = new Set();
  
  data.forEach((item: any) => {
    // Excluir el registro de totales
    if (item.fuente && item.id !== "TOTAL") {
      fuentesSet.add(item.fuente);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(fuentesSet).sort();
}

/**
 * Obtiene la lista de valores únicos por el atributo "concepto" dada una fuente
 * Excluye el registro de totales del listado
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @returns {Array} - Lista de conceptos únicos para la fuente dada
 */
function getConceptosByFuente(data: any, fuente: string) {
  // Filtrar los registros por la fuente seleccionada, excluyendo totales
  const registrosFiltrados = data.filter((item: any) => 
    item.fuente === fuente && item.id !== "TOTAL"
  );
  
  // Extraer conceptos únicos usando Set
  const conceptosSet = new Set();
  
  registrosFiltrados.forEach((item: any) => {
    if (item.concepto) {
      conceptosSet.add(item.concepto);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(conceptosSet).sort();
}

/**
 * Obtiene la lista de valores únicos por el atributo "beneficiario" dada una fuente y concepto
 * Excluye el registro de totales del listado
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @param {String} concepto - El concepto seleccionado
 * @returns {Array} - Lista de beneficiarios únicos para la fuente y concepto dados
 */
function getBeneficiariosByFuenteAndConcepto(data : any, fuente: string, concepto: string) {
  // Filtrar los registros por la fuente y concepto seleccionados, excluyendo totales
  const registrosFiltrados = data.filter((item: any) => 
    item.fuente === fuente && 
    item.concepto === concepto && 
    item.id !== "TOTAL"
  );
  
  // Extraer beneficiarios únicos usando Set
  const beneficiariosSet = new Set();
  
  registrosFiltrados.forEach((item: any) => {
    if (item.beneficiario) {
      beneficiariosSet.add(item.beneficiario);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(beneficiariosSet).sort();
}

/**
 * Obtiene un registro completo dada una fuente, concepto y beneficiario
 * Puede incluir el registro de totales si se especifica
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @param {String} concepto - El concepto seleccionado
 * @param {String} beneficiario - El beneficiario seleccionado
 * @returns {Object|null} - El registro completo o null si no se encuentra
 */
function getRegistroByFuenteConceptoBeneficiario(data: any, fuente: string, concepto: string, beneficiario: string) {
  // Si se busca el registro de totales
  if (fuente === "TOTAL" || concepto === "TOTAL" || beneficiario === "TOTAL") {
    return data.find((item: any) => item.id === "TOTAL") || null;
  }
  
  // Buscar el registro que coincide con los criterios
  return data.find((item: any) => 
    item.fuente === fuente && 
    item.concepto === concepto && 
    item.beneficiario === beneficiario
  ) || null;
}

/**
 * Obtiene el registro de totales del dataset
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Object|null} - El registro de totales o null si no se encuentra
 */
function getRegistroTotales(data: any) {
  return data.find((item: any) => item.id === "TOTAL") || null;
}

/**
 * Verifica si existe un registro de totales en el dataset
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Boolean} - True si existe registro de totales
 */
function existeRegistroTotales(data: any) {
  return data.some((item: any) => item.id === "TOTAL");
}

/**
 * Agrega el registro de totales al dataset si no existe
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Array} - Dataset con registro de totales incluido
 */
function asegurarRegistroTotales(data: any) {
  if (!existeRegistroTotales(data)) {
    const registroTotales = generarRegistroTotales(data);
    if (registroTotales) {
      return [...data, registroTotales];
    }
  }
  return data;
}

// Función auxiliar para formatear los valores monetarios
function formatearValorMonetario(valor: any) {
  // Verificar si el valor es numérico o una cadena
  let numero;
  if (typeof valor === 'string') {
    // Reemplazar comas por puntos para manejar formato colombiano
    numero = parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  } else {
    numero = valor;
  }
  
  // Verificar si es un número válido
  if (isNaN(numero)) {
    return valor; // Devolver el valor original si no es numérico
  }
  
  // Formatear con separadores de miles y dos decimales
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numero);
}

// Función para generar un resumen de ejecución presupuestal
function getResumenEjecucion(registro: any) {
  if (!registro) return null;
  
  // Extraer valores numéricos (eliminando puntos de miles y reemplazando comas por puntos en decimales)
  const apropiacionVigente = parseFloat(registro["apropiacion-vigente"].toString().replace(/\./g, '').replace(',', '.'));
  const compromisos = parseFloat(registro["compromisos"].toString().replace(/\./g, '').replace(',', '.'));
  const pagos = parseFloat(registro["pagos"].toString().replace(/\./g, '').replace(',', '.'));
  
  // Calcular porcentajes
  const porcentajeCompromisos = (compromisos / apropiacionVigente) * 100;
  const porcentajePagos = (pagos / apropiacionVigente) * 100;
  const porcentajePagosVsCompromisos = compromisos ? (pagos / compromisos) * 100 : 0;
  
  return {
    apropiacionVigente: formatearValorMonetario(apropiacionVigente),
    compromisos: formatearValorMonetario(compromisos),
    pagos: formatearValorMonetario(pagos),
    porcentajeCompromisos: porcentajeCompromisos.toFixed(2) + '%',
    porcentajePagos: porcentajePagos.toFixed(2) + '%',
    porcentajePagosVsCompromisos: porcentajePagosVsCompromisos.toFixed(2) + '%',
    saldoPorComprometer: formatearValorMonetario(registro["saldo-por-comprometer"])
  };
}

// Exportar todas las funciones
export {
  generarRegistroTotales,
  getFuentes,
  getConceptosByFuente,
  getBeneficiariosByFuenteAndConcepto,
  getRegistroByFuenteConceptoBeneficiario,
  getRegistroTotales,
  existeRegistroTotales,
  asegurarRegistroTotales,
  formatearValorMonetario,
  getResumenEjecucion
};