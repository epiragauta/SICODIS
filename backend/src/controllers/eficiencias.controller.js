/**
 * Controlador de endpoints para datos de eficiencias fiscales y administrativas
 */

const db = require('../services/database.service');

/**
 * Obtener todos los municipios
 */
exports.getMunicipios = (req, res) => {
  try {
    const municipios = db.all('SELECT * FROM municipios ORDER BY departamento, municipio');
    res.json(municipios);
  } catch (error) {
    console.error('Error en getMunicipios:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener municipio específico por código DANE
 */
exports.getMunicipioByCodigo = (req, res) => {
  try {
    const { codigo_dane } = req.params;
    const municipio = db.get('SELECT * FROM municipios WHERE codigo_dane = ?', [codigo_dane]);

    if (!municipio) {
      return res.status(404).json({ error: 'Municipio no encontrado' });
    }

    res.json(municipio);
  } catch (error) {
    console.error('Error en getMunicipioByCodigo:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener ingresos tributarios
 */
exports.getIngresosTributarios = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM ingresos_tributarios WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getIngresosTributarios:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener población
 */
exports.getPoblacion = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM poblacion WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getPoblacion:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener recursos de propósito general
 */
exports.getRecursosPropositoGeneral = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    let query = 'SELECT * FROM recursos_proposito_general WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getRecursosPropositoGeneral:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener ICLD de Ley 617
 */
exports.getLey617Icld = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM ley_617_icld WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getLey617Icld:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener Gastos de Funcionamiento de Ley 617
 */
exports.getLey617GastosFuncionamiento = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM ley_617_gastos_funcionamiento WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getLey617GastosFuncionamiento:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener Razón de Ley 617
 */
exports.getLey617Razon = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM ley_617_razon WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getLey617Razon:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener Holgura de Ley 617
 */
exports.getLey617Holgura = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM ley_617_holgura WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getLey617Holgura:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener Límite de Gasto de Ley 617 (vigencia 2025)
 */
exports.getLey617LimiteGasto = (req, res) => {
  try {
    const { codigo_dane } = req.params;

    let query = 'SELECT * FROM ley_617_limite_gasto';
    const params = [];

    if (codigo_dane) {
      query += ' WHERE codigo_dane = ?';
      params.push(codigo_dane);
    }

    const results = codigo_dane ? db.get(query, params) : db.all(query, params);

    if (codigo_dane && !results) {
      return res.status(404).json({ error: 'Límite de gasto no encontrado' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error en getLey617LimiteGasto:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener Vigencia 2026 de Ley 617
 */
exports.getLey617Vigencia2026 = (req, res) => {
  try {
    const { codigo_dane } = req.params;

    let query = 'SELECT * FROM ley_617_vigencia_2026';
    const params = [];

    if (codigo_dane) {
      query += ' WHERE codigo_dane = ?';
      params.push(codigo_dane);
    }

    const results = codigo_dane ? db.get(query, params) : db.all(query, params);

    if (codigo_dane && !results) {
      return res.status(404).json({ error: 'Datos de vigencia 2026 no encontrados' });
    }

    res.json(results);
  } catch (error) {
    console.error('Error en getLey617Vigencia2026:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener indicadores de eficiencia fiscal
 */
exports.getIndicadoresEficienciaFiscal = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM indicadores_eficiencia_fiscal WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getIndicadoresEficienciaFiscal:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener indicadores de eficiencia administrativa
 */
exports.getIndicadoresEficienciaAdministrativa = (req, res) => {
  try {
    const { codigo_dane, anio } = req.params;

    let query = 'SELECT * FROM indicadores_eficiencia_administrativa WHERE 1=1';
    const params = [];

    if (codigo_dane) {
      query += ' AND codigo_dane = ?';
      params.push(codigo_dane);
    }

    if (anio) {
      query += ' AND anio = ?';
      params.push(anio);
    }

    query += ' ORDER BY anio DESC';

    const results = db.all(query, params);
    res.json(results);
  } catch (error) {
    console.error('Error en getIndicadoresEficienciaAdministrativa:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener resumen completo de un municipio
 */
exports.getResumenMunicipio = (req, res) => {
  try {
    const { codigo_dane } = req.params;

    // Obtener información del municipio
    const municipio = db.get('SELECT * FROM municipios WHERE codigo_dane = ?', [codigo_dane]);

    if (!municipio) {
      return res.status(404).json({ error: 'Municipio no encontrado' });
    }

    // Obtener datos históricos (últimos 10 años para cubrir todas las vigencias)
    const ingresos = db.all(
      'SELECT * FROM ingresos_tributarios WHERE codigo_dane = ? ORDER BY anio DESC LIMIT 10',
      [codigo_dane]
    );

    const poblacion = db.all(
      'SELECT * FROM poblacion WHERE codigo_dane = ? ORDER BY anio DESC LIMIT 10',
      [codigo_dane]
    );

    const recursos = db.all(
      'SELECT * FROM recursos_proposito_general WHERE codigo_dane = ? ORDER BY anio DESC LIMIT 10',
      [codigo_dane]
    );

    const eficienciaFiscal = db.all(
      'SELECT * FROM indicadores_eficiencia_fiscal WHERE codigo_dane = ? ORDER BY anio DESC',
      [codigo_dane]
    );

    const eficienciaAdmin = db.all(
      'SELECT * FROM indicadores_eficiencia_administrativa WHERE codigo_dane = ? ORDER BY anio DESC',
      [codigo_dane]
    );

    const vigencia2026 = db.get(
      'SELECT * FROM ley_617_vigencia_2026 WHERE codigo_dane = ?',
      [codigo_dane]
    );

    res.json({
      municipio,
      ingresos_tributarios: ingresos,
      poblacion,
      recursos_proposito_general: recursos,
      eficiencia_fiscal: eficienciaFiscal,
      eficiencia_administrativa: eficienciaAdmin,
      vigencia_2026: vigencia2026
    });
  } catch (error) {
    console.error('Error en getResumenMunicipio:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Comparar múltiples municipios en un año específico
 */
exports.compararMunicipios = (req, res) => {
  try {
    const { codigos, anio } = req.query;

    if (!codigos || !anio) {
      return res.status(400).json({ error: 'Parámetros codigos y anio son requeridos' });
    }

    // Convertir codigos a array
    const codigosArray = codigos.split(',').map(c => c.trim());

    // Obtener datos de cada municipio
    const placeholders = codigosArray.map(() => '?').join(',');

    const municipios = db.all(
      `SELECT * FROM municipios WHERE codigo_dane IN (${placeholders})`,
      codigosArray
    );

    const ingresos = db.all(
      `SELECT * FROM ingresos_tributarios WHERE codigo_dane IN (${placeholders}) AND anio = ?`,
      [...codigosArray, anio]
    );

    const poblacion = db.all(
      `SELECT * FROM poblacion WHERE codigo_dane IN (${placeholders}) AND anio = ?`,
      [...codigosArray, anio]
    );

    const eficienciaFiscal = db.all(
      `SELECT * FROM indicadores_eficiencia_fiscal WHERE codigo_dane IN (${placeholders}) AND anio = ?`,
      [...codigosArray, anio]
    );

    res.json({
      municipios,
      anio,
      ingresos_tributarios: ingresos,
      poblacion,
      eficiencia_fiscal: eficienciaFiscal
    });
  } catch (error) {
    console.error('Error en compararMunicipios:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Obtener ranking de municipios por eficiencia fiscal
 */
exports.getRankingEficienciaFiscal = (req, res) => {
  try {
    const { anio } = req.params;
    const { limit = 50 } = req.query;

    const ranking = db.all(
      `SELECT m.codigo_dane, m.departamento, m.municipio, e.anio, e.valor
       FROM indicadores_eficiencia_fiscal e
       JOIN municipios m ON e.codigo_dane = m.codigo_dane
       WHERE e.anio = ? AND e.valor IS NOT NULL
       ORDER BY e.valor DESC
       LIMIT ?`,
      [anio, parseInt(limit)]
    );

    res.json(ranking);
  } catch (error) {
    console.error('Error en getRankingEficienciaFiscal:', error);
    res.status(500).json({ error: error.message });
  }
};
