/**
 * Interfaces TypeScript para Sistema de Presupuesto vs Recaudo
 * Bienio 2025-2026
 * Generado automáticamente - Adaptado para SICODIS
 */

export interface Metadata {
  vigencia: string;
  fechaGeneracion: string;
  version: string;
  [key: string]: any;
}

export interface AtributosEntidad {
  esProductor: boolean;
  esPdet: boolean;
  esZomac: boolean;
  esCapital: boolean;
}

export interface Entidad {
  codigo: string;
  nombre: string;
  tipo: 'Municipio' | 'Gobernación' | 'Otros' | 'Corporación' | 'Étnicos' | 'Región';
  codDepto: string;
  departamento: string;
  region: string;
  atributos: AtributosEntidad;
}

export interface EntidadesResponse {
  metadata: Metadata;
  entidades: Entidad[];
}

export interface ComponentesPresupuesto {
  corriente: number;
  disponibilidadInicial: number;
  rendimientosFinancieros: number;
  mineralSinIdentificacion: number;
  reintegros: number;
  recursosSinDistribuir2011: number;
  multasSancionesIntereses: number;
  excedentesAhorroFaepFonpet: number;
  ajusteLiquidaciones: number;
  mayorRecaudo: number;
  adicionAsignacionesDirectas: number;
  controversiasJudiciales: number;
  desahorroFae: number;
}

export interface ComponentesRecaudo {
  corriente: number;
  otros: number;
}

export interface RegistroPresupuesto {
  codigoEntidad: string;
  nombreEntidad: string;
  tipoEntidad: string;
  conceptoGasto: string;
  concepto: string;
  destinacionEtnica: boolean;
  presupuesto: ComponentesPresupuesto;
  recaudo: ComponentesRecaudo;
  mesActualizacion: string;
}

export interface PresupuestoResponse {
  metadata: Metadata;
  registros: RegistroPresupuesto[];
}

export interface JerarquiasResponse {
  metadata: Metadata;
  jerarquias: {
    [tipo: string]: {
      [codigoPadre: string]: string[];
    };
  };
}

export interface TotalesNacionales {
  presupuestoTotal: number;
  cajaTotal: number;
  avanceTotal: number;
  totalEntidades: number;
}

export interface AgregadoPorTipo {
  tipo: string;
  cantidad: number;
  presupuestoTotal: number;
  cajaTotal: number;
  avancePromedio: number;
}

export interface AgregadoPorRegion {
  region: string;
  cantidad: number;
  presupuestoTotal: number;
  cajaTotal: number;
  avancePromedio: number;
}

export interface TopEntidad {
  codigo: string;
  nombre: string;
  tipo?: string;
  departamento?: string;
  presupuestoTotal: number;
  cajaTotal: number;
  avanceTotal: number;
}

export interface ResumenAgregadoResponse {
  metadata: Metadata;
  totalesNacionales: TotalesNacionales;
  porTipo: AgregadoPorTipo[];
  porRegion: AgregadoPorRegion[];
  topMunicipios: TopEntidad[];
  topEjecucion: TopEntidad[];
}

/**
 * Funciones de utilidad para calcular datos derivados
 */
export class PresupuestoUtils {

  static calcularPresupuestoTotal(componentes: ComponentesPresupuesto): number {
    return (
      componentes.corriente +
      componentes.disponibilidadInicial +
      componentes.rendimientosFinancieros +
      componentes.mineralSinIdentificacion +
      componentes.reintegros +
      componentes.recursosSinDistribuir2011 +
      componentes.multasSancionesIntereses +
      componentes.excedentesAhorroFaepFonpet +
      componentes.ajusteLiquidaciones +
      componentes.mayorRecaudo +
      componentes.adicionAsignacionesDirectas +
      componentes.controversiasJudiciales +
      componentes.desahorroFae
    );
  }

  static calcularCajaTotal(recaudo: ComponentesRecaudo): number {
    return recaudo.corriente + recaudo.otros;
  }

  static calcularAvanceTotal(
    presupuesto: ComponentesPresupuesto,
    recaudo: ComponentesRecaudo
  ): number {
    const presupuestoTotal = this.calcularPresupuestoTotal(presupuesto);
    const cajaTotal = this.calcularCajaTotal(recaudo);
    return presupuestoTotal > 0 ? cajaTotal / presupuestoTotal : 0;
  }

  static calcularAvanceRecaudoCorriente(
    presupuestoCorriente: number,
    recaudoCorriente: number
  ): number {
    return presupuestoCorriente > 0 ? recaudoCorriente / presupuestoCorriente : 0;
  }

  static formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  }

  static formatearPorcentaje(decimal: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(decimal);
  }

  static formatearNumero(valor: number): string {
    return new Intl.NumberFormat('es-CO').format(valor);
  }
}

/**
 * Interfaces para el componente de información general
 */
export interface FiltrosSGR {
  periodicidad?: string;
  tipoEntidad?: string;
  region?: string;
  productor?: boolean | null;
  pdet?: boolean | null;
  zomac?: boolean | null;
  destinacionEtnica?: boolean | null;
  conceptoGasto?: string;
}

export interface EntidadCount {
  beneficiarias: number;
  productoras: number;
  zomac: number;
  pdet: number;
  etnicas: number;
}

export interface DatosAgregados {
  entidadesCount: EntidadCount;
  presupuestoTotal: number;
  recaudoTotal: number;
  avancePromedio: number;
  presupuestoCorriente: number;
  presupuestoOtros: number;
  recaudoCorriente: number;
  recaudoOtros: number;
  registrosDestinacionEtnica: number;  // Conteo de registros con destinación étnica
}
