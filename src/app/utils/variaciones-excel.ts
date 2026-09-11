/**
 * Exportación del reporte de variaciones a Excel.
 *
 * Se genera en el navegador con ExcelJS (importación diferida) para que la
 * descarga funcione sin depender del backend. Cuando exista el endpoint, este
 * archivo puede quedarse como respaldo o retirarse.
 */

import { dispararDescarga } from './descarga-archivo';
import {
  ReporteVariaciones,
  VariacionValor,
} from '../models/sgr-iac.models';

const AZUL_DNP = 'FF004583';
const GRIS_CABECERA = 'FFF1F5F9';

/** Formato de moneda colombiana sin decimales para las columnas de valores. */
const FORMATO_PESOS = '#,##0.00';
const FORMATO_PORCENTAJE = '0.00%';

function etiquetaPresencia(presencia: ReporteVariaciones['porEntidad'][number]['presencia']): string {
  switch (presencia) {
    case 'nueva': return 'Nueva';
    case 'retirada': return 'Retirada';
    default: return '';
  }
}

/**
 * Genera y descarga el `.xlsx` del reporte.
 *
 * Dos hojas: un resumen con los agregados por concepto y el detalle por
 * entidad, que es el que se lleva a la mesa de trabajo.
 */
export async function descargarVariacionesExcel(reporte: ReporteVariaciones): Promise<void> {
  const { Workbook } = await import('exceljs');
  const libro = new Workbook();
  libro.creator = 'SICODIS';
  libro.created = new Date();

  construirHojaResumen(libro.addWorksheet('Resumen'), reporte);
  construirHojaDetalle(libro.addWorksheet('Detalle por entidad'), reporte);

  const buffer = await libro.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const periodo = reporte.periodoActual.replace(/[^\w-]/g, '');
  dispararDescarga(blob, `Variaciones_IAC_${reporte.idIac}_${periodo}.xlsx`);
}

function aplicarTitulo(hoja: any, fila: number, texto: string, columnas: number): void {
  hoja.mergeCells(fila, 1, fila, columnas);
  const celda = hoja.getCell(fila, 1);
  celda.value = texto;
  celda.font = { bold: true, size: 13, color: { argb: 'FFFFFFFF' } };
  celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AZUL_DNP } };
  celda.alignment = { vertical: 'middle', horizontal: 'left' };
  hoja.getRow(fila).height = 22;
}

function aplicarCabecera(hoja: any, fila: number, encabezados: string[]): void {
  encabezados.forEach((texto, i) => {
    const celda = hoja.getCell(fila, i + 1);
    celda.value = texto;
    celda.font = { bold: true, size: 10 };
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: GRIS_CABECERA } };
    celda.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    celda.border = { bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } } };
  });
  hoja.getRow(fila).height = 28;
}

/** Escribe actual, anterior, variación en pesos y variación porcentual. */
function escribirVariacion(hoja: any, fila: number, columna: number, valor: VariacionValor): void {
  hoja.getCell(fila, columna).value = valor.actual;
  hoja.getCell(fila, columna).numFmt = FORMATO_PESOS;

  hoja.getCell(fila, columna + 1).value = valor.anterior;
  hoja.getCell(fila, columna + 1).numFmt = FORMATO_PESOS;

  const celdaPesos = hoja.getCell(fila, columna + 2);
  celdaPesos.value = valor.variacionPesos;
  celdaPesos.numFmt = FORMATO_PESOS;
  if (valor.variacionPesos < 0) {
    celdaPesos.font = { color: { argb: 'FFB91C1C' } };
  } else if (valor.variacionPesos > 0) {
    celdaPesos.font = { color: { argb: 'FF15803D' } };
  }

  const celdaPct = hoja.getCell(fila, columna + 3);
  // Sin base anterior el porcentaje no es interpretable: se deja un guion.
  celdaPct.value = valor.variacionPorcentaje === null ? '—' : valor.variacionPorcentaje;
  if (valor.variacionPorcentaje !== null) {
    celdaPct.numFmt = FORMATO_PORCENTAJE;
  }
  celdaPct.alignment = { horizontal: 'right' };
}

function construirHojaResumen(hoja: any, reporte: ReporteVariaciones): void {
  hoja.columns = [
    { width: 42 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 14 },
  ];

  aplicarTitulo(hoja, 1, `Variaciones de la IAC — ${reporte.descripcionIac}`, 5);

  const meta: Array<[string, string]> = [
    ['Tipo de IAC', reporte.tipoIac],
    ['Periodo actual', reporte.periodoActual],
    ['Periodo de comparación', reporte.periodoAnterior ?? 'Sin IAC anterior del mismo tipo'],
    ['Generado', new Date(reporte.fechaGeneracion).toLocaleString('es-CO')],
  ];
  meta.forEach(([etiqueta, valor], i) => {
    hoja.getCell(3 + i, 1).value = etiqueta;
    hoja.getCell(3 + i, 1).font = { bold: true, size: 10 };
    hoja.getCell(3 + i, 2).value = valor;
    hoja.getCell(3 + i, 2).font = { size: 10 };
  });

  let fila = 8;
  hoja.getCell(fila, 1).value = 'Beneficiarios';
  hoja.getCell(fila, 1).font = { bold: true, size: 11, color: { argb: AZUL_DNP } };
  fila++;

  const conteos: Array<[string, number]> = [
    ['Total de entidades', reporte.resumen.entidades],
    ['Con aumento', reporte.resumen.suben],
    ['Con disminución', reporte.resumen.bajan],
    ['Sin cambio', reporte.resumen.igual],
    ['Nuevas en este periodo', reporte.resumen.nuevas],
    ['Retiradas frente al anterior', reporte.resumen.retiradas],
  ];
  conteos.forEach(([etiqueta, valor]) => {
    hoja.getCell(fila, 1).value = etiqueta;
    hoja.getCell(fila, 1).font = { size: 10 };
    hoja.getCell(fila, 2).value = valor;
    hoja.getCell(fila, 2).font = { size: 10, bold: true };
    fila++;
  });

  fila += 1;
  hoja.getCell(fila, 1).value = 'Variación por concepto';
  hoja.getCell(fila, 1).font = { bold: true, size: 11, color: { argb: AZUL_DNP } };
  fila++;

  aplicarCabecera(hoja, fila, ['Concepto', 'Actual', 'Anterior', 'Variación ($)', 'Variación (%)']);
  fila++;

  hoja.getCell(fila, 1).value = 'Valor a distribuir (total)';
  hoja.getCell(fila, 1).font = { bold: true, size: 10 };
  escribirVariacion(hoja, fila, 2, reporte.totalGeneral);
  fila++;

  for (const item of reporte.porConcepto) {
    hoja.getCell(fila, 1).value = item.etiqueta;
    hoja.getCell(fila, 1).font = { size: 10 };
    escribirVariacion(hoja, fila, 2, item.valor);
    fila++;
  }
}

function construirHojaDetalle(hoja: any, reporte: ReporteVariaciones): void {
  hoja.columns = [
    { width: 12 }, { width: 38 }, { width: 12 },
    { width: 20 }, { width: 20 }, { width: 20 }, { width: 14 },
  ];

  aplicarTitulo(hoja, 1, `Detalle por entidad — ${reporte.periodoActual} frente a ${reporte.periodoAnterior ?? 'sin referencia'}`, 7);

  aplicarCabecera(hoja, 3, [
    'Código DANE', 'Entidad', 'Situación',
    'Valor actual', 'Valor anterior', 'Variación ($)', 'Variación (%)',
  ]);

  let fila = 4;
  for (const entidad of reporte.porEntidad) {
    // El código va como texto para no perder el cero inicial de Antioquia.
    hoja.getCell(fila, 1).value = entidad.codigoDane;
    hoja.getCell(fila, 1).alignment = { horizontal: 'left' };
    hoja.getCell(fila, 2).value = entidad.entidad;
    hoja.getCell(fila, 3).value = etiquetaPresencia(entidad.presencia);
    escribirVariacion(hoja, fila, 4, entidad.total);
    fila++;
  }

  hoja.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: 7 } };
  hoja.views = [{ state: 'frozen', ySplit: 3 }];
}
