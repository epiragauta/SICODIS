/**
 * Funciones para analizar datos del Sistema General de Regalías (SGR)
 * 
 * Este conjunto de funciones permite:
 * 1. Obtener una lista de valores únicos por el atributo "fuente"
 * 2. Obtener una lista de valores únicos por el atributo "concepto" dada una fuente
 * 3. Obtener una lista de valores únicos por el atributo "beneficiario" dada una fuente y concepto
 * 4. Obtener un registro completo dada una fuente, concepto y beneficiario
 */

/**
 * Obtiene la lista de valores únicos por el atributo "fuente"
 * @param {Array} data - El conjunto de datos del SGR
 * @returns {Array} - Lista de fuentes únicas
 */
function getFuentes(data) {
  // Usando Set para eliminar duplicados
  const fuentesSet = new Set();
  
  data.forEach(item => {
    if (item.fuente) {
      fuentesSet.add(item.fuente);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(fuentesSet).sort();
}

/**
 * Obtiene la lista de valores únicos por el atributo "concepto" dada una fuente
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @returns {Array} - Lista de conceptos únicos para la fuente dada
 */
function getConceptosByFuente(data, fuente) {
  // Filtrar los registros por la fuente seleccionada
  const registrosFiltrados = data.filter(item => item.fuente === fuente);
  
  // Extraer conceptos únicos usando Set
  const conceptosSet = new Set();
  
  registrosFiltrados.forEach(item => {
    if (item.concepto) {
      conceptosSet.add(item.concepto);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(conceptosSet).sort();
}

/**
 * Obtiene la lista de valores únicos por el atributo "beneficiario" dada una fuente y concepto
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @param {String} concepto - El concepto seleccionado
 * @returns {Array} - Lista de beneficiarios únicos para la fuente y concepto dados
 */
function getBeneficiariosByFuenteAndConcepto(data, fuente, concepto) {
  // Filtrar los registros por la fuente y concepto seleccionados
  const registrosFiltrados = data.filter(item => 
    item.fuente === fuente && item.concepto === concepto
  );
  
  // Extraer beneficiarios únicos usando Set
  const beneficiariosSet = new Set();
  
  registrosFiltrados.forEach(item => {
    if (item.beneficiario) {
      beneficiariosSet.add(item.beneficiario);
    }
  });
  
  // Convertir el Set a un Array y ordenarlo alfabéticamente
  return Array.from(beneficiariosSet).sort();
}

/**
 * Obtiene un registro completo dada una fuente, concepto y beneficiario
 * @param {Array} data - El conjunto de datos del SGR
 * @param {String} fuente - La fuente seleccionada
 * @param {String} concepto - El concepto seleccionado
 * @param {String} beneficiario - El beneficiario seleccionado
 * @returns {Object|null} - El registro completo o null si no se encuentra
 */
function getRegistroByFuenteConceptoBeneficiario(data, fuente, concepto, beneficiario) {
  // Buscar el registro que coincide con los criterios
  return data.find(item => 
    item.fuente === fuente && 
    item.concepto === concepto && 
    item.beneficiario === beneficiario
  ) || null;
}

// Función auxiliar para formatear los valores monetarios
function formatearValorMonetario(valor) {
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
function getResumenEjecucion(registro) {
  if (!registro) return null;
  
  // Extraer valores numéricos (eliminando puntos de miles y reemplazando comas por puntos en decimales)
  const apropiacionVigente = parseFloat(registro["apropiacion-vigente"].replace(/\./g, '').replace(',', '.'));
  const compromisos = parseFloat(registro["compromisos"].replace(/\./g, '').replace(',', '.'));
  const pagos = parseFloat(registro["pagos"].replace(/\./g, '').replace(',', '.'));
  
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
  getFuentes,
  getConceptosByFuente,
  getBeneficiariosByFuenteAndConcepto,
  getRegistroByFuenteConceptoBeneficiario,
  formatearValorMonetario,
  getResumenEjecucion
};