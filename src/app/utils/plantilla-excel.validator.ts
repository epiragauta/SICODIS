/**
 * Prevalidación en el navegador de las plantillas de determinaciones de la IAC.
 *
 * Es el espejo cliente de `ClasesNegocio/ValidacionIAC.cs → LeerHojasExcel*` del
 * sistema legado: mismas reglas, mismo redondeo, mismo formato de log. Sirve
 * para dar retroalimentación inmediata **antes** de subir el archivo.
 *
 * No es autoritativa: la validación que decide si un cargue es válido la hace
 * siempre el servidor, que además puede comprobar la existencia real de los
 * códigos de entidad contra la base de datos.
 */

import {
  CampoPlantilla,
  DefinicionPlantilla,
  ResumenValidacionDeterminaciones,
} from '../models/sgr-iac.models';

/** Máximo de hallazgos que se acumulan; el resto se resume en una línea final. */
const MAX_ERRORES = 200;

/**
 * Escala a centavos evitando el error binario de `valor * 100`.
 *
 * `1114598868.55 * 100` da `111459886854.99998` en punto flotante; sin este
 * ajuste, truncar o redondear hacia abajo pierde un centavo por registro.
 */
function aCentavos(valor: number): number {
  return Number((valor * 100).toPrecision(15));
}

/**
 * Valor en centavos, con el criterio de redondeo de .NET
 * (`MidpointRounding.ToEven`, el predeterminado de `Math.Round(decimal, int)`),
 * que difiere del `Math.round` de JavaScript en los empates: 0,125 → 0,12.
 */
export function centavosLegado(valor: number): number {
  if (!Number.isFinite(valor)) { return 0; }

  const escalado = aCentavos(valor);
  const piso = Math.floor(escalado);
  const resto = escalado - piso;

  if (Math.abs(resto - 0.5) < 1e-9) {
    return piso % 2 === 0 ? piso : piso + 1;   // empate → al par
  }
  return Math.round(escalado);
}

/**
 * Normalización de valores monetarios equivalente a la del sistema anterior.
 *
 * El legado encadena `Math.Round(x,2)` → `Math.Truncate(x*100)/100` →
 * `Math.Round(x,2)` sobre un `decimal`. Como `decimal` es aritmética exacta en
 * base 10, el truncamiento intermedio nunca cambia un valor que ya tiene dos
 * decimales: la secuencia completa equivale a un único redondeo bancario a dos
 * decimales. Transcribirla literalmente con `number` sí altera el resultado
 * —el truncamiento sobre punto flotante pierde centavos—, así que la
 * equivalencia se implementa, no la transcripción.
 */
export function normalizarValorLegado(valor: number): number {
  return centavosLegado(valor) / 100;
}

/** Códigos de campo reconocidos en las plantillas de determinaciones. */
export const COD_CAMPO = {
  ad20: 'AD20',
  ad5: 'AD5',
  ad20NoAforado: 'AD20NoAforado',
  ad5NoAforado: 'AD5NoAforado',
  ad20OxrSff: 'AD20OxRSSF',
  ad5OxrSff: 'AD5OxRSSF',
  descuentos: 'Descuentos',
  funcionamiento: 'Funcionamiento',
  fiscalizacion: 'Fiscalizacion',
  codigoDane: 'CodigoDane',
  entidad: 'Entidad',
} as const;

/** Resultado de la prevalidación: resumen + log completo descargable. */
export interface ResultadoPrevalidacion {
  resumen: ResumenValidacionDeterminaciones;
  /** Log íntegro con marca de tiempo por línea, como el `.txt` del legado. */
  log: string;
}

/**
 * Desenvuelve el valor de una celda de ExcelJS.
 *
 * Las celdas pueden traer fórmulas (`{ formula, result }`), texto enriquecido
 * (`{ richText }`) o hipervínculos (`{ text }`).
 */
function valorCelda(bruto: unknown): unknown {
  if (bruto === null || bruto === undefined) {
    return null;
  }
  if (typeof bruto === 'object') {
    const obj = bruto as Record<string, unknown>;
    if ('result' in obj) { return obj['result']; }
    if ('richText' in obj) {
      return (obj['richText'] as Array<{ text: string }>).map(t => t.text).join('');
    }
    if ('text' in obj) { return obj['text']; }
    if ('error' in obj) { return null; }
  }
  return bruto;
}

/**
 * Convierte a número admitiendo el separador decimal de coma que Excel entrega
 * cuando la celda es texto en configuración regional `es-CO`.
 */
function aNumero(bruto: unknown): number | null {
  const valor = valorCelda(bruto);
  if (valor === null || valor === '') { return 0; }
  if (typeof valor === 'number') { return Number.isFinite(valor) ? valor : null; }

  const texto = String(valor).trim();
  if (texto === '') { return 0; }

  // Quita separadores de miles y normaliza la coma decimal.
  const normalizado = texto.replace(/\s/g, '').replace(/\.(?=\d{3}\b)/g, '').replace(',', '.');
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : null;
}

/**
 * Formas válidas del código de beneficiario en las plantillas del SGR.
 *
 * No todos los beneficiarios son entidades territoriales: las plantillas reales
 * de la ANH incluyen las Corporaciones Autónomas Regionales con códigos `C0000`
 * a `C0009` y la bolsa «Otros por Distribuir» con código `F0000`. Por eso no se
 * puede exigir el formato DANE de cinco dígitos.
 *
 * La existencia real del código la verifica el servidor contra la base de datos
 * (`Entidades.ValidarCodigoEntidad` en el sistema anterior).
 */
const PATRON_CODIGO_ENTIDAD = /^(\d{5}|[A-Za-z]\d{4})$/;

/** Normaliza el código conservando el cero inicial (Antioquia, Atlántico). */
function aCodigoEntidad(bruto: unknown): string {
  const valor = valorCelda(bruto);
  if (valor === null) { return ''; }
  const texto = String(valor).trim();
  return /^\d+$/.test(texto) ? texto.padStart(5, '0') : texto;
}

function marca(): string {
  return new Date().toLocaleString('es-CO');
}

/**
 * Valida un archivo Excel de determinaciones contra la definición de plantilla.
 *
 * ExcelJS se importa de forma diferida para no cargarlo en el bundle inicial.
 */
export async function validarPlantillaDeterminaciones(
  archivo: File,
  definicion: DefinicionPlantilla,
): Promise<ResultadoPrevalidacion> {

  const { Workbook } = await import('exceljs');
  const libro = new Workbook();
  await libro.xlsx.load(await archivo.arrayBuffer());

  const bitacora: string[] = [`${marca()} - Inicio validación de determinaciones (${definicion.participante}).`];
  const errores: string[] = [];
  let erroresOmitidos = 0;

  const registrarError = (mensaje: string) => {
    bitacora.push(`${marca()} - ${mensaje}`);
    if (errores.length < MAX_ERRORES) {
      errores.push(mensaje);
    } else {
      erroresOmitidos++;
    }
  };

  const totales: Record<string, number> = {};
  let totalRegistros = 0;

  const hoja = libro.getWorksheet(definicion.hoja);
  if (!hoja) {
    const disponibles = libro.worksheets.map(h => h.name).join(', ');
    registrarError(`El archivo no contiene la hoja "${definicion.hoja}". Hojas encontradas: ${disponibles || 'ninguna'}.`);
    return { resumen: construirResumen(definicion, totales, 0, errores, erroresOmitidos), log: bitacora.join('\n') };
  }

  const campoCodigo = definicion.campos.find(c => c.codCampo === COD_CAMPO.codigoDane);
  const campoEntidad = definicion.campos.find(c => c.codCampo === COD_CAMPO.entidad);
  if (!campoCodigo) {
    registrarError('La definición de la plantilla no declara la columna del código DANE. Contacte al administrador.');
    return { resumen: construirResumen(definicion, totales, 0, errores, erroresOmitidos), log: bitacora.join('\n') };
  }

  const camposValor: CampoPlantilla[] = definicion.campos.filter(
    c => c.tipoDatos === 'numero' && c.codCampo !== COD_CAMPO.codigoDane && c.codCampo !== COD_CAMPO.entidad,
  );

  bitacora.push(`${marca()} - Hoja "${definicion.hoja}" localizada. Fila inicial: ${definicion.filaInicial}. Columna del código: ${campoCodigo.columna}.`);

  const clavesVistas = new Set<string>();

  for (let fila = definicion.filaInicial; fila <= hoja.rowCount; fila++) {
    const registro = hoja.getRow(fila);
    const codigoDane = aCodigoEntidad(registro.getCell(campoCodigo.columna).value);

    // Fila vacía: fin de datos útiles, no se reporta como error (el legado la ignora).
    if (codigoDane === '') {
      continue;
    }

    totalRegistros++;

    if (!PATRON_CODIGO_ENTIDAD.test(codigoDane)) {
      registrarError(`Línea ${fila}: el código de beneficiario "${codigoDane}" no tiene una forma válida (cinco dígitos DANE, o una letra y cuatro dígitos para CAR y bolsas).`);
      continue;
    }

    const entidad = campoEntidad
      ? String(valorCelda(registro.getCell(campoEntidad.columna).value) ?? '').trim()
      : '';

    for (const campo of camposValor) {
      const clave = `${codigoDane}-${campo.codCampo}`;
      if (clavesVistas.has(clave)) {
        registrarError(`Línea ${fila}: el beneficiario ${codigoDane}${entidad ? ` (${entidad})` : ''} está repetido para "${campo.nombreCampo}".`);
        continue;
      }
      clavesVistas.add(clave);

      const numero = aNumero(registro.getCell(campo.columna).value);
      if (numero === null) {
        registrarError(`Línea ${fila}: el valor de "${campo.nombreCampo}" del beneficiario ${codigoDane} no es numérico.`);
        continue;
      }

      // Se acumula en centavos enteros para que la suma de más de mil registros
      // no arrastre error de punto flotante.
      const centavos = centavosLegado(numero);
      if (centavos < 0) {
        registrarError(`Línea ${fila}: el valor de "${campo.nombreCampo}" del beneficiario ${codigoDane} es negativo y no está permitido.`);
        continue;
      }

      totales[campo.codCampo] = (totales[campo.codCampo] ?? 0) + centavos;
    }
  }

  if (erroresOmitidos > 0) {
    bitacora.push(`${marca()} - Se omitieron ${erroresOmitidos} hallazgos adicionales en el resumen; el log los conserva.`);
  }
  bitacora.push(`${marca()} - Fin de la validación. Registros leídos: ${totalRegistros}. Hallazgos: ${errores.length + erroresOmitidos}.`);

  return {
    resumen: construirResumen(definicion, totales, totalRegistros, errores, erroresOmitidos),
    log: bitacora.join('\n'),
  };
}

function construirResumen(
  definicion: DefinicionPlantilla,
  /** Totales acumulados en centavos enteros. */
  totales: Record<string, number>,
  totalRegistros: number,
  errores: string[],
  erroresOmitidos: number,
): ResumenValidacionDeterminaciones {

  const centavos = (cod: string) => totales[cod] ?? 0;
  const t = (cod: string) => centavos(cod) / 100;

  const ad20 = t(COD_CAMPO.ad20);
  const ad5 = t(COD_CAMPO.ad5);
  const ad20NoAforado = t(COD_CAMPO.ad20NoAforado);
  const ad5NoAforado = t(COD_CAMPO.ad5NoAforado);
  const ad20OxrSff = t(COD_CAMPO.ad20OxrSff);
  const ad5OxrSff = t(COD_CAMPO.ad5OxrSff);
  const descuentos = t(COD_CAMPO.descuentos);

  const esFunFis = definicion.participante === 'FUNFIS';
  const listado = erroresOmitidos > 0
    ? [...errores, `… y ${erroresOmitidos} hallazgos más. Descargue el log para verlos todos.`]
    : errores;

  return {
    descripcionDatos: definicion.hoja,
    validacion: listado.length === 0 ? 'Sin Errores' : 'Con Errores',
    totalAd20: ad20,
    totalAd20NoAforado: ad20NoAforado,
    totalAd5: ad5,
    totalAd5NoAforado: ad5NoAforado,
    totalAd20OxrSff: ad20OxrSff,
    totalAd5OxrSff: ad5OxrSff,
    totalDescuentos: descuentos,
    totalADistribuir: (centavos(COD_CAMPO.ad20) + centavos(COD_CAMPO.ad5)
                       + centavos(COD_CAMPO.ad20OxrSff) + centavos(COD_CAMPO.ad5OxrSff)) / 100,
    totalADistribuirNoAforado: (centavos(COD_CAMPO.ad20NoAforado) + centavos(COD_CAMPO.ad5NoAforado)) / 100,
    totalFuncionamiento: esFunFis ? t(COD_CAMPO.funcionamiento) : undefined,
    totalFiscalizacion: esFunFis ? t(COD_CAMPO.fiscalizacion) : undefined,
    totalRegistros,
    fechaValidacion: new Date().toISOString(),
    errores: listado,
  };
}
