import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  ConfigRedondeo,
  ConjuntoParametros,
  ParametroValor,
  SicodisApiService,
} from './sicodis-api.service';

/**
 * Acceso a los parámetros de cálculo de la distribución del SGR.
 *
 * Los consumen tres pantallas: `sgr-parametros-distribucion` (edición),
 * `sgr-ejecucion-distribucion` (solo lectura) y `sgr-iac-detalle` (parámetros
 * aplicados a una IAC). El conjunto simulado vive aquí y no en cada componente,
 * para que las tres vean exactamente los mismos valores mientras no exista el
 * backend `sgrdistribucion/parametros/*`.
 */
@Injectable({ providedIn: 'root' })
export class SgrParametrosService {

  private api = inject(SicodisApiService);

  /** Poner en `false` cuando exista el backend de parámetros. */
  private readonly simularParametros = true;

  /** Versión vigente para un bienio. */
  getVigentes(idBienio: number | undefined, etiquetaVigencia = ''): Observable<ConjuntoParametros> {
    if (this.simularParametros) {
      return of(this.conjuntoMock(etiquetaVigencia));
    }
    return this.api.getParametrosVigentesSgr(idBienio ?? 0);
  }

  getHistorico(idBienio: number | undefined): Observable<ConjuntoParametros[]> {
    if (this.simularParametros) {
      return of([this.conjuntoMock('')]);
    }
    return this.api.getHistoricoParametrosSgr(idBienio ?? 0);
  }

  guardar(conjunto: ConjuntoParametros): Observable<ConjuntoParametros> {
    if (this.simularParametros) {
      return of(JSON.parse(JSON.stringify(conjunto)) as ConjuntoParametros);
    }
    return this.api.guardarParametrosSgr(conjunto);
  }

  /** Conjunto de referencia (tabla 2 · Ley 2056 de 2020). */
  private conjuntoMock(etiquetaVigencia: string): ConjuntoParametros {
    const pct = (clave: string, etiqueta: string, valor: number, ref?: string): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: '%', referenciaNormativa: ref });
    const fac = (clave: string, etiqueta: string, valor: number): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: 'factor' });
    const red = (tipoSalida: ConfigRedondeo['tipoSalida'], etiqueta: string, decimales: 0 | 2): ConfigRedondeo =>
      ({ tipoSalida, etiqueta, decimales, modo: 'redondeo' });

    return {
      idVersion: 2,
      etiquetaVersion: 'P-v2',
      vigencia: etiquetaVigencia,
      fecha: '2026-08-12T00:00:00',
      autor: 'admin',
      motivo: 'Parámetros de referencia tabla 2 · Ley 2056 de 2020',
      porcentajes: [
        pct('inversion', 'Inversión', 92.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('inversion.ad', '— Asignaciones Directas (20% + 5%)', 25, 'Arts. 22 y 23 L2056'),
        pct('inversion.ail', '— Asignación Inversión Local (12,68% + 2,32%)', 15, 'Art. 48 L2056'),
        pct('inversion.air', '— Asignación Inversión Regional (20,4% dptos / 13,6% reg.)', 34, 'Arts. 44 y 45 L2056'),
        pct('inversion.acti', '— Ciencia, Tecnología e Innovación', 10, 'Art. 52 L2056'),
        pct('inversion.paz', '— Asignación para la Paz', 7, 'Parág. 7.º trans. art. 361 C.P.'),
        pct('inversion.ambiental', '— Asignación Ambiental', 1, 'Art. 50 L2056'),
        pct('inversion.cormagdalena', '— Cormagdalena', 0.5, 'Art. 331 C.P.'),
        pct('ahorro', 'Ahorro', 4.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('ahorro.fae', '— FAE (referencia)', 2.25, 'Art. 113 L2056'),
        pct('ahorro.fonpet', '— FONPET (referencia)', 2.25, 'Art. 122 L2056'),
        pct('administracion', 'Administración', 3, 'Art. 361 C.P. · art. 22 L2056'),
        pct('administracion.funcionamiento', '— Funcionamiento y fiscalización', 2, 'Art. 12 L2056'),
        pct('administracion.ssec', '— SSEC (CGR · PGN · DNP)', 1, 'Art. 167 L2056'),
      ],
      ponderadores: [
        fac('ail.nbi', 'AIL · NBI', 0.6),
        fac('ail.poblacion', 'AIL · Población', 0.4),
        fac('air.nbi', 'AIR · NBI', 0.5),
        fac('air.poblacion', 'AIR · Población', 0.4),
        fac('air.desempleo', 'AIR · Desempleo', 0.1),
        fac('air.particion.dptos', 'AIR · Partición departamentos', 0.6),
        fac('air.particion.regiones', 'AIR · Partición regiones', 0.4),
        fac('fonpet.ppnc', 'FONPET · PPNC', 0.8),
        fac('fonpet.nbi', 'FONPET · NBI', 0.1),
        fac('fonpet.poblacion', 'FONPET · Población', 0.1),
        fac('etnico.urbano', 'Étnico · Ponderador urbano', 0.4),
        fac('etnico.rural', 'Étnico · Ponderador rural', 0.6),
      ],
      umbrales: [
        { clave: 'ail.compensacion.umbral', etiqueta: 'Compensación AIL · garantía', valor: 75, unidad: '%', referenciaNormativa: 'num. 3.1.1.2.2' },
        { clave: 'ail.compensacion.parcial', etiqueta: 'Permitir compensación parcial', valor: true, unidad: 'flag' },
        { clave: 'fae.piso', etiqueta: 'Piso FAE (del ahorro)', valor: 50, unidad: '%', referenciaNormativa: 'num. 3.2.1.1' },
        { clave: 'etnico.bloqueo', etiqueta: 'Bloqueo étnico', valor: 20, unidad: '%', referenciaNormativa: 'Sección III' },
        { clave: 'ambiental.minimo', etiqueta: 'Mínimo ambiental del SGR', valor: 2, unidad: 'pp' },
        { clave: 'noaforados.corriente', etiqueta: 'No aforados · bolsa corriente', valor: 75, unidad: '%', referenciaNormativa: 'num. 5.1.1.f' },
        { clave: 'noaforados.restante', etiqueta: 'No aforados · bolsa restante', valor: 25, unidad: '%', referenciaNormativa: 'num. 5.1.1.f' },
        { clave: 'etnico.excluir.car', etiqueta: 'Excluir CAR de la base étnica', valor: true, unidad: 'flag' },
        { clave: 'etnico.excluir.indeterminados', etiqueta: 'Excluir indeterminados de la base étnica', valor: true, unidad: 'flag' },
      ],
      redondeo: [
        red('PR', 'Plan de Recursos (decenal)', 0),
        red('desahorroFAE', 'Desahorro FAE', 0),
        red('mayorRecaudo', 'Mayor recaudo', 0),
        red('multas', 'Multas', 0),
        red('etnicas', 'Destinaciones étnicas', 0),
        red('PBC', 'Plan Bienal de Caja', 2),
        red('IAC', 'IAC (límite SPGR)', 2),
      ],
    };
  }
}

// ===================== Presentación =====================

function formatNumero(n: number, decimales: number): string {
  return n.toLocaleString('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales });
}

/** Formatea el valor de un parámetro según su unidad. */
export function formatValorParametro(p: ParametroValor): string {
  if (typeof p.valor === 'boolean') {
    return p.valor ? 'Sí' : 'No';
  }
  switch (p.unidad) {
    case '%': return formatNumero(p.valor, 2) + '%';
    case 'factor': return formatNumero(p.valor, 2);
    case 'pp': return formatNumero(p.valor, 0) + ' p.p.';
    default: return String(p.valor);
  }
}

export function modoRedondeoLabel(modo: 'redondeo' | 'truncamiento'): string {
  return modo === 'redondeo' ? 'Redondeo' : 'Truncamiento';
}
