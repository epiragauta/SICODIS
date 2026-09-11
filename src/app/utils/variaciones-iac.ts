/**
 * Cálculo del reporte de variaciones de la IAC.
 *
 * Compara el resultado de una IAC con el de la IAC anterior del mismo tipo,
 * entidad por entidad y concepto por concepto. Es una función pura sobre los
 * dos resultados: no consulta nada, para poder probarla y para que el día que
 * el backend entregue la comparación ya calculada baste con sustituirla.
 */

import {
  ConceptoVariacion,
  ETIQUETA_CONCEPTO,
  IacResumen,
  PresenciaEntidad,
  ReporteVariaciones,
  ResultadoCalculoIac,
  ResumenEntidadIac,
  VariacionConcepto,
  VariacionEntidad,
  VariacionValor,
} from '../models/sgr-iac.models';

/** Conceptos comparados, en el orden en que se muestran. */
export const CONCEPTOS_VARIACION: readonly ConceptoVariacion[] = [
  'determinacionAd20',
  'determinacionAd5',
  'determinacionAd20NoAforados',
  'determinacionAd5NoAforados',
  'determinacionAd20OxrSff',
  'determinacionAd5OxrSff',
  'descuentos',
];

/** Redondeo a centavos, para no arrastrar error de punto flotante en las restas. */
function r2(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/**
 * Construye la variación de un par de valores.
 *
 * El porcentaje queda en `null` cuando el valor anterior es cero: la variación
 * existe en pesos, pero dividir por cero daría infinito y un «100 %» sería
 * engañoso. Quien consuma el reporte debe mostrar un guion, no un número.
 */
export function calcularVariacion(actual: number, anterior: number): VariacionValor {
  const a = r2(actual);
  const b = r2(anterior);
  return {
    actual: a,
    anterior: b,
    variacionPesos: r2(a - b),
    variacionPorcentaje: b === 0 ? null : (a - b) / b,
  };
}

function indexarPorCodigo(filas: ResumenEntidadIac[]): Map<string, ResumenEntidadIac> {
  const mapa = new Map<string, ResumenEntidadIac>();
  for (const fila of filas) {
    mapa.set(fila.codigoDane, fila);
  }
  return mapa;
}

function sumar(filas: ResumenEntidadIac[], concepto: ConceptoVariacion): number {
  return filas.reduce((acc, fila) => acc + (fila[concepto] ?? 0), 0);
}

/**
 * Genera el reporte de variaciones entre dos cálculos de IAC.
 *
 * `anterior` puede ser `null`: en la primera IAC de un tipo no hay contra qué
 * comparar, y el reporte se emite con todas las entidades marcadas como nuevas.
 * Es un caso real, no un error.
 */
export function generarReporteVariaciones(
  iac: IacResumen,
  actual: ResultadoCalculoIac,
  iacAnterior: IacResumen | null,
  anterior: ResultadoCalculoIac | null,
): ReporteVariaciones {

  const filasActuales = actual.resumenPorEntidad;
  const filasAnteriores = anterior?.resumenPorEntidad ?? [];

  const mapaActual = indexarPorCodigo(filasActuales);
  const mapaAnterior = indexarPorCodigo(filasAnteriores);

  // Unión de códigos: una entidad puede aparecer solo en uno de los dos periodos.
  const codigos = new Set<string>([...mapaActual.keys(), ...mapaAnterior.keys()]);

  const porEntidad: VariacionEntidad[] = [];
  let nuevas = 0;
  let retiradas = 0;
  let suben = 0;
  let bajan = 0;
  let igual = 0;

  for (const codigo of codigos) {
    const filaActual = mapaActual.get(codigo);
    const filaAnterior = mapaAnterior.get(codigo);

    const presencia: PresenciaEntidad =
      filaActual && filaAnterior ? 'ambas' : filaActual ? 'nueva' : 'retirada';

    if (presencia === 'nueva') { nuevas++; }
    if (presencia === 'retirada') { retiradas++; }

    const total = calcularVariacion(
      filaActual?.valorDistribuir ?? 0,
      filaAnterior?.valorDistribuir ?? 0,
    );

    if (total.variacionPesos > 0) { suben++; }
    else if (total.variacionPesos < 0) { bajan++; }
    else { igual++; }

    const conceptos: VariacionEntidad['conceptos'] = {};
    for (const concepto of CONCEPTOS_VARIACION) {
      conceptos[concepto] = calcularVariacion(
        filaActual?.[concepto] ?? 0,
        filaAnterior?.[concepto] ?? 0,
      );
    }

    porEntidad.push({
      codigoDane: codigo,
      // La entidad retirada solo tiene nombre en el periodo anterior.
      entidad: filaActual?.entidad ?? filaAnterior?.entidad ?? '',
      presencia,
      total,
      conceptos,
    });
  }

  // Mayor caída primero: es lo que se revisa antes en una mesa de trabajo.
  porEntidad.sort((a, b) => a.total.variacionPesos - b.total.variacionPesos);

  const porConcepto: VariacionConcepto[] = CONCEPTOS_VARIACION.map(concepto => ({
    concepto,
    etiqueta: ETIQUETA_CONCEPTO[concepto],
    valor: calcularVariacion(sumar(filasActuales, concepto), sumar(filasAnteriores, concepto)),
  }));

  const totalGeneral = calcularVariacion(
    sumar(filasActuales, 'valorDistribuir'),
    sumar(filasAnteriores, 'valorDistribuir'),
  );

  return {
    idIac: iac.id,
    descripcionIac: iac.descripcion,
    periodoActual: iac.periodo,
    idIacAnterior: iacAnterior?.id ?? null,
    descripcionIacAnterior: iacAnterior?.descripcion ?? null,
    periodoAnterior: iacAnterior?.periodo ?? null,
    tipoIac: iac.tipoIac,
    fechaGeneracion: new Date().toISOString(),
    totalGeneral,
    porConcepto,
    porEntidad,
    resumen: {
      entidades: porEntidad.length,
      nuevas,
      retiradas,
      suben,
      bajan,
      igual,
    },
  };
}
