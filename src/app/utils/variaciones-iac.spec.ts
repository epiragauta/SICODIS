import {
  IacResumen,
  ResultadoCalculoIac,
  ResumenEntidadIac,
} from '../models/sgr-iac.models';
import { calcularVariacion, generarReporteVariaciones } from './variaciones-iac';

function iac(id: number, periodo: string, idPeriodo: number): IacResumen {
  return {
    id,
    descripcion: `IAC ${periodo}`,
    idVigencia: 3,
    bienio: '2025 - 2026',
    idPeriodo,
    periodo,
    idTipoIac: 1,
    tipoIac: 'IAC Corriente',
    ingresosHidrocarburos: 0,
    ingresosMineria: 0,
    totalIngresos: 0,
    estado: 'calculada',
    fechaCreacion: '2026-08-01T00:00:00.000Z',
    usuarioCreacion: 'jperez',
  };
}

/** Fila del resumen por entidad; los conceptos no indicados quedan en cero. */
function fila(
  codigoDane: string,
  entidad: string,
  valorDistribuir: number,
  extra: Partial<ResumenEntidadIac> = {},
): ResumenEntidadIac {
  return {
    codigoDane,
    entidad,
    valorDistribuir,
    ingresosAnh: 0,
    ingresosAnm: 0,
    determinacionAd20: 0,
    determinacionAd5: 0,
    determinacionAd20NoAforados: 0,
    determinacionAd5NoAforados: 0,
    determinacionAd20OxrSff: 0,
    determinacionAd5OxrSff: 0,
    descuentos: 0,
    ...extra,
  };
}

function resultado(idIac: number, filas: ResumenEntidadIac[]): ResultadoCalculoIac {
  return {
    idIac,
    fechaCalculo: '2026-08-15T10:00:00.000Z',
    resumenPorEntidad: filas,
    archivos: [],
    avance: [],
    enviadaAValidacion: false,
  };
}

describe('calcularVariacion', () => {

  it('calcula la diferencia en pesos y en porcentaje', () => {
    const v = calcularVariacion(1200, 1000);

    expect(v.actual).toBe(1200);
    expect(v.anterior).toBe(1000);
    expect(v.variacionPesos).toBe(200);
    expect(v.variacionPorcentaje).toBeCloseTo(0.2, 10);
  });

  it('deja el porcentaje en null cuando no hay base anterior', () => {
    // Dividir por cero daría infinito, y un «100 %» sería engañoso: la entidad
    // no creció un 100 %, es que antes no recibía nada.
    const v = calcularVariacion(5000, 0);

    expect(v.variacionPesos).toBe(5000);
    expect(v.variacionPorcentaje).toBeNull();
  });

  it('representa las caídas con signo negativo', () => {
    const v = calcularVariacion(800, 1000);

    expect(v.variacionPesos).toBe(-200);
    expect(v.variacionPorcentaje).toBeCloseTo(-0.2, 10);
  });

  it('no arrastra error de punto flotante en la resta', () => {
    const v = calcularVariacion(1114598868.55, 1114598868.35);

    expect(v.variacionPesos).toBe(0.2);
  });

  it('marca como sin cambio los valores iguales', () => {
    const v = calcularVariacion(1000, 1000);

    expect(v.variacionPesos).toBe(0);
    expect(v.variacionPorcentaje).toBe(0);
  });
});

describe('generarReporteVariaciones', () => {

  const actual = iac(2, '2026-08', 320);
  const anterior = iac(1, '2026-07', 319);

  it('compara entidad por entidad frente al periodo anterior', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1200), fila('50000', 'Meta', 900)]),
      anterior,
      resultado(1, [fila('44000', 'La Guajira', 1000), fila('50000', 'Meta', 1000)]),
    );

    expect(r.idIacAnterior).toBe(1);
    expect(r.periodoAnterior).toBe('2026-07');
    expect(r.resumen.entidades).toBe(2);
    expect(r.resumen.suben).toBe(1);
    expect(r.resumen.bajan).toBe(1);
    expect(r.totalGeneral.actual).toBe(2100);
    expect(r.totalGeneral.anterior).toBe(2000);
    expect(r.totalGeneral.variacionPesos).toBe(100);
  });

  it('ordena de mayor caída a mayor aumento', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [
        fila('44000', 'La Guajira', 1500),
        fila('50000', 'Meta', 500),
        fila('85000', 'Casanare', 1000),
      ]),
      anterior,
      resultado(1, [
        fila('44000', 'La Guajira', 1000),
        fila('50000', 'Meta', 1000),
        fila('85000', 'Casanare', 1000),
      ]),
    );

    expect(r.porEntidad.map(e => e.codigoDane)).toEqual(['50000', '85000', '44000']);
  });

  it('marca como nueva la entidad que no estaba en el periodo anterior', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1000), fila('19000', 'Cauca', 300)]),
      anterior,
      resultado(1, [fila('44000', 'La Guajira', 1000)]),
    );

    const cauca = r.porEntidad.find(e => e.codigoDane === '19000')!;

    expect(cauca.presencia).toBe('nueva');
    expect(cauca.total.anterior).toBe(0);
    expect(cauca.total.variacionPorcentaje).toBeNull();
    expect(r.resumen.nuevas).toBe(1);
  });

  it('conserva la entidad retirada, con su nombre del periodo anterior', () => {
    // Si desaparece del cálculo, su abono cayó a cero: es justo lo que hay que ver.
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1000)]),
      anterior,
      resultado(1, [fila('44000', 'La Guajira', 1000), fila('81000', 'Arauca', 700)]),
    );

    const arauca = r.porEntidad.find(e => e.codigoDane === '81000')!;

    expect(arauca.presencia).toBe('retirada');
    expect(arauca.entidad).toBe('Arauca');
    expect(arauca.total.actual).toBe(0);
    expect(arauca.total.variacionPesos).toBe(-700);
    expect(r.resumen.retiradas).toBe(1);
  });

  it('agrega la variación por concepto sobre todas las entidades', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [
        fila('44000', 'La Guajira', 1000, { determinacionAd20: 800, determinacionAd5: 200 }),
        fila('50000', 'Meta', 1000, { determinacionAd20: 700, determinacionAd5: 300 }),
      ]),
      anterior,
      resultado(1, [
        fila('44000', 'La Guajira', 900, { determinacionAd20: 700, determinacionAd5: 200 }),
        fila('50000', 'Meta', 900, { determinacionAd20: 600, determinacionAd5: 300 }),
      ]),
    );

    const ad20 = r.porConcepto.find(c => c.concepto === 'determinacionAd20')!;
    expect(ad20.valor.actual).toBe(1500);
    expect(ad20.valor.anterior).toBe(1300);
    expect(ad20.valor.variacionPesos).toBe(200);

    const ad5 = r.porConcepto.find(c => c.concepto === 'determinacionAd5')!;
    expect(ad5.valor.variacionPesos).toBe(0);
  });

  it('emite el reporte aunque no exista IAC anterior', () => {
    // Es el caso de la primera IAC de un tipo: no es un error, pero el reporte
    // debe decir que no hay referencia en vez de inventar una.
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1000)]),
      null,
      null,
    );

    expect(r.idIacAnterior).toBeNull();
    expect(r.periodoAnterior).toBeNull();
    expect(r.resumen.nuevas).toBe(1);
    expect(r.porEntidad[0].total.variacionPorcentaje).toBeNull();
    expect(r.totalGeneral.anterior).toBe(0);
  });

  it('cuenta como sin cambio a quien recibe lo mismo', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1000)]),
      anterior,
      resultado(1, [fila('44000', 'La Guajira', 1000)]),
    );

    expect(r.resumen.igual).toBe(1);
    expect(r.resumen.suben).toBe(0);
    expect(r.resumen.bajan).toBe(0);
  });

  it('desglosa cada entidad por concepto', () => {
    const r = generarReporteVariaciones(
      actual,
      resultado(2, [fila('44000', 'La Guajira', 1000, { descuentos: 50 })]),
      anterior,
      resultado(1, [fila('44000', 'La Guajira', 900, { descuentos: 30 })]),
    );

    expect(r.porEntidad[0].conceptos.descuentos!.variacionPesos).toBe(20);
  });
});
