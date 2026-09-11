import { Workbook } from 'exceljs';

import {
  centavosLegado,
  normalizarValorLegado,
  validarPlantillaDeterminaciones,
} from './plantilla-excel.validator';
import { DEFINICIONES_PLANTILLA } from '../services/sgr-iac.service';
import { DefinicionPlantilla } from '../models/sgr-iac.models';

/** Definición equivalente a la de la ANH, para los casos que necesitan control fino. */
const PLANTILLA_ANH: DefinicionPlantilla = DEFINICIONES_PLANTILLA['ANH']!;

/** Definición de Fun&Fis, que añade funcionamiento y fiscalización. */
const PLANTILLA_FUNFIS: DefinicionPlantilla = DEFINICIONES_PLANTILLA['FUNFIS']!;

/** Columnas de la plantilla de la ANH, en base 1. */
const COL = { dane: 4, entidad: 5, ad20: 6, ad5: 7, oxr20: 8, oxr5: 9 };

interface FilaPrueba {
  fila: number;
  valores: Record<number, unknown>;
}

/**
 * Construye un `.xlsx` en memoria y lo envuelve en un `File`, para ejercitar el
 * validador con la misma ruta que sigue un archivo elegido por el usuario.
 */
async function construirArchivo(hoja: string, filas: FilaPrueba[]): Promise<File> {
  const libro = new Workbook();
  const ws = libro.addWorksheet(hoja);

  for (const { fila, valores } of filas) {
    for (const [columna, valor] of Object.entries(valores)) {
      ws.getCell(fila, Number(columna)).value = valor as never;
    }
  }

  const buffer = await libro.xlsx.writeBuffer();
  return new File([buffer], 'determinaciones.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/** Fila válida de la plantilla de la ANH. */
function filaAnh(
  fila: number,
  codigo: unknown,
  entidad: string,
  ad20: unknown,
  ad5: unknown = 0,
  oxr20: unknown = 0,
  oxr5: unknown = 0,
): FilaPrueba {
  return {
    fila,
    valores: {
      [COL.dane]: codigo,
      [COL.entidad]: entidad,
      [COL.ad20]: ad20,
      [COL.ad5]: ad5,
      [COL.oxr20]: oxr20,
      [COL.oxr5]: oxr5,
    },
  };
}

describe('normalizarValorLegado', () => {

  it('conserva los centavos que la transcripción literal del legado perdía', () => {
    // `1114598868.55 * 100` da 111459886854.99998 en punto flotante: truncar ahí
    // devolvía 1114598868.54 y descuadraba el total frente al propio Excel.
    expect(normalizarValorLegado(1114598868.55)).toBe(1114598868.55);
    expect(centavosLegado(1114598868.55)).toBe(111459886855);
  });

  it('aplica redondeo bancario (al par) en los empates, como Math.Round de .NET', () => {
    expect(normalizarValorLegado(0.125)).toBe(0.12);   // baja al par
    expect(normalizarValorLegado(0.135)).toBe(0.14);   // sube al par
    expect(normalizarValorLegado(2.345)).toBe(2.34);
    expect(normalizarValorLegado(2.355)).toBe(2.36);
  });

  it('redondea normalmente cuando no hay empate', () => {
    expect(normalizarValorLegado(1.234)).toBe(1.23);
    expect(normalizarValorLegado(1.236)).toBe(1.24);
    expect(normalizarValorLegado(100)).toBe(100);
  });

  it('devuelve 0 para valores no finitos', () => {
    expect(centavosLegado(NaN)).toBe(0);
    expect(centavosLegado(Infinity)).toBe(0);
  });
});

describe('validarPlantillaDeterminaciones', () => {

  it('acepta una plantilla correcta y suma los totales al centavo', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1114598868.55, 100.01, 50.02, 25.03),
      filaAnh(16, '44001', 'Riohacha', 2000000000.45, 200.99, 0, 0),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.errores).toEqual([]);
    expect(resumen.totalRegistros).toBe(2);
    expect(resumen.totalAd20).toBe(3114598869);
    expect(resumen.totalAd5).toBe(301);
    expect(resumen.totalAd20OxrSff).toBe(50.02);
    expect(resumen.totalAd5OxrSff).toBe(25.03);
    expect(resumen.totalADistribuir).toBe(3114599245.05);
    expect(resumen.descripcionDatos).toBe(PLANTILLA_ANH.hoja);
  });

  it('acepta los códigos de CAR y de bolsas, que no son códigos DANE', async () => {
    // La plantilla real de la ANH trae C0000–C0009 (Corporaciones Autónomas) y
    // F0000 (Otros por Distribuir). Exigir cinco dígitos los marcaba como error.
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, 'C0000', 'Corporaciones Autónomas', 1000),
      filaAnh(16, 'C0009', 'CVC', 2000),
      filaAnh(17, 'F0000', 'Otros por Distribuir', 3000),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.totalRegistros).toBe(3);
    expect(resumen.totalAd20).toBe(6000);
  });

  it('conserva el cero inicial de los códigos numéricos', async () => {
    // Excel entrega 5001 como número; el beneficiario es 05001 (Medellín).
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, 5001, 'Medellín', 500),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.totalRegistros).toBe(1);
  });

  it('rechaza un código de beneficiario con forma inválida', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1000),
      filaAnh(16, 'XX', 'Entidad rara', 2000),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Con Errores');
    expect(resumen.errores.length).toBe(1);
    expect(resumen.errores[0]).toContain('Línea 16');
    expect(resumen.errores[0]).toContain('XX');
    // La fila con código inválido no aporta a los totales, pero sí se cuenta.
    expect(resumen.totalRegistros).toBe(2);
    expect(resumen.totalAd20).toBe(1000);
  });

  it('rechaza un valor no numérico', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 'no aplica'),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Con Errores');
    expect(resumen.errores[0]).toContain('no es numérico');
    expect(resumen.totalAd20).toBe(0);
  });

  it('rechaza valores negativos', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', -1000),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Con Errores');
    expect(resumen.errores[0]).toContain('negativo');
    expect(resumen.totalAd20).toBe(0);
  });

  it('detecta beneficiarios repetidos por clave código + campo', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1000),
      filaAnh(16, '05000', 'Antioquia', 2000),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Con Errores');
    // Un hallazgo por cada campo numérico repetido de la fila duplicada.
    expect(resumen.errores.length).toBe(4);
    expect(resumen.errores[0]).toContain('repetido');
    // La fila repetida no vuelve a sumar.
    expect(resumen.totalAd20).toBe(1000);
  });

  it('interpreta valores de texto con separador decimal de coma', async () => {
    // Una celda con formato de texto en configuración es-CO llega como '1.234,56'.
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', '1.234,56'),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.totalAd20).toBe(1234.56);
  });

  it('ignora las filas sin código, sin contarlas como registros', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1000),
      // Fila intermedia y fila final sin código: la plantilla real trae filas de
      // notas y de totales debajo del detalle.
      { fila: 16, valores: { [COL.entidad]: 'Suma Beneficiarios', [COL.ad20]: 1000 } },
      { fila: 30, valores: { [COL.entidad]: 'Nota al pie' } },
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.totalRegistros).toBe(1);
    expect(resumen.totalAd20).toBe(1000);
  });

  it('informa cuando el archivo no tiene la hoja esperada', async () => {
    const archivo = await construirArchivo('OtraHoja', [
      filaAnh(15, '05000', 'Antioquia', 1000),
    ]);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Con Errores');
    expect(resumen.errores[0]).toContain(PLANTILLA_ANH.hoja);
    expect(resumen.errores[0]).toContain('OtraHoja');
    expect(resumen.totalRegistros).toBe(0);
  });

  it('devuelve un log con marca de tiempo por línea', async () => {
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1000),
    ]);

    const { log } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    const lineas = log.split('\n');
    expect(lineas.length).toBeGreaterThan(2);
    expect(lineas[0]).toContain('Inicio validación de determinaciones (ANH)');
    expect(lineas[lineas.length - 1]).toContain('Registros leídos: 1');
    lineas.forEach(linea => expect(linea).toContain(' - '));
  });

  it('solo reporta funcionamiento y fiscalización en la plantilla de Fun&Fis', async () => {
    const anh = await construirArchivo(PLANTILLA_ANH.hoja, [
      filaAnh(15, '05000', 'Antioquia', 1000),
    ]);
    const resumenAnh = (await validarPlantillaDeterminaciones(anh, PLANTILLA_ANH)).resumen;

    expect(resumenAnh.totalFuncionamiento).toBeUndefined();
    expect(resumenAnh.totalFiscalizacion).toBeUndefined();

    const funfis = await construirArchivo(PLANTILLA_FUNFIS.hoja, [
      { fila: 15, valores: { 4: '05000', 5: 'Antioquia', 6: 700, 7: 300 } },
    ]);
    const resumenFunfis = (await validarPlantillaDeterminaciones(funfis, PLANTILLA_FUNFIS)).resumen;

    expect(resumenFunfis.validacion).toBe('Sin Errores');
    expect(resumenFunfis.totalFuncionamiento).toBe(700);
    expect(resumenFunfis.totalFiscalizacion).toBe(300);
  });

  it('no arrastra error de punto flotante al sumar muchos registros', async () => {
    // Mil beneficiarios con dos decimales: acumular en `number` desviaba el total.
    const filas: FilaPrueba[] = [];
    for (let i = 0; i < 1000; i++) {
      filas.push(filaAnh(15 + i, String(10000 + i), `Entidad ${i}`, 1114598868.55));
    }
    const archivo = await construirArchivo(PLANTILLA_ANH.hoja, filas);

    const { resumen } = await validarPlantillaDeterminaciones(archivo, PLANTILLA_ANH);

    expect(resumen.validacion).toBe('Sin Errores');
    expect(resumen.totalRegistros).toBe(1000);
    expect(resumen.totalAd20).toBe(1114598868550);
  });
});
