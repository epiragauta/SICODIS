/**
 * Modelo de dominio de la Instrucción de Abono a Cuenta (IAC) del SGR.
 *
 * Equivale al proceso transaccional de `IAC/IACAutomatica4.aspx` del sistema
 * legado: creación de la IAC, cargue de los insumos de los cinco participantes,
 * validación de las plantillas de determinaciones, cálculo y envío a validación.
 *
 * Ver `docs/planes/PLAN_SGR_IAC_TRANSACCIONAL.md`.
 */

// ===================== Identificadores del legado =====================

/** Participantes del proceso IAC. */
export type ParticipanteIac = 'MHCP' | 'ANH' | 'ANM' | 'MME' | 'FUNFIS';

/**
 * Identificador de participante que espera la base de datos.
 *
 * ⚠️ El `enum EntidadesInsumoProcesoIAC` de `ClasesNegocio/ValidacionIAC.cs`
 * declara otros valores, pero **no se usa**: el code-behind del legado pasa
 * estos literales. Estos son los correctos.
 */
export const ID_PARTICIPANTE: Readonly<Record<ParticipanteIac, number>> = {
  FUNFIS: 1,
  MHCP: 2,
  ANH: 3,
  ANM: 4,
  MME: 5,
};

/** Plantilla de cargue (`SGR_DIST_DetallePlantillaCargue.IdPlantilla`). MHCP no carga plantilla. */
export const ID_PLANTILLA: Readonly<Partial<Record<ParticipanteIac, number>>> = {
  ANH: 3,
  ANM: 4,
  MME: 5,
  FUNFIS: 6,
};

/** Metadatos de presentación de cada participante. */
export interface DefinicionParticipante {
  codigo: ParticipanteIac;
  sigla: string;
  nombre: string;
  icono: string;
  /** Fun&Fis no cuenta para la completitud que habilita el cálculo. */
  obligatorio: boolean;
  /** MHCP se diligencia por formulario; el resto por cargue de plantilla. */
  tipo: 'formulario' | 'determinaciones';
}

/** Orden y metadatos de los cinco pasos del proceso. */
export const PARTICIPANTES: readonly DefinicionParticipante[] = [
  { codigo: 'MHCP', sigla: 'MHCP', nombre: 'Ministerio de Hacienda y Crédito Público', icono: 'pi pi-wallet', obligatorio: true, tipo: 'formulario' },
  { codigo: 'ANH', sigla: 'ANH', nombre: 'Agencia Nacional de Hidrocarburos', icono: 'pi pi-bolt', obligatorio: true, tipo: 'determinaciones' },
  { codigo: 'ANM', sigla: 'ANM', nombre: 'Agencia Nacional de Minería', icono: 'pi pi-cog', obligatorio: true, tipo: 'determinaciones' },
  { codigo: 'MME', sigla: 'MME', nombre: 'Ministerio de Minas y Energía', icono: 'pi pi-sun', obligatorio: true, tipo: 'determinaciones' },
  { codigo: 'FUNFIS', sigla: 'Fun&Fis', nombre: 'Funcionamiento y Fiscalización', icono: 'pi pi-briefcase', obligatorio: false, tipo: 'determinaciones' },
];

// ===================== Cabecera de la IAC =====================

export type EstadoIac = 'borrador' | 'calculada' | 'enviada' | 'anulada';

/** Fila del listado de IAC. */
export interface IacResumen {
  id: number;
  descripcion: string;
  idVigencia: number;
  bienio: string;
  idPeriodo: number;
  periodo: string;
  idTipoIac: number;
  tipoIac: string;
  ingresosHidrocarburos: number;
  ingresosMineria: number;
  totalIngresos: number;
  estado: EstadoIac;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaCalculo?: string;
}

export interface NuevaIacRequest {
  nombre: string;
  idVigencia: number;
  idPeriodo: number;
  idTipoIac: number;
}

/** Opción genérica de los desplegables de vigencia, periodo y tipo. */
export interface OpcionCatalogo {
  id: number;
  label: string;
}

// ===================== Estado de los insumos =====================

export type EstadoPaso = 'pendiente' | 'cargando' | 'completo' | 'error';

export interface PasoInsumo {
  participante: ParticipanteIac;
  estado: EstadoPaso;
  obligatorio: boolean;
  fechaActualizacion?: string;
  idValidacionMaestro?: number;
}

export interface EstadoInsumosIac {
  idIac: number;
  pasos: PasoInsumo[];
  /** Verdadero cuando MHCP, ANH, ANM y MME están completos. */
  completo: boolean;
}

// ===================== Paso MHCP =====================

export interface InsumoMhcp {
  noRadicado: string;
  /** ISO 8601. */
  fechaRadicado: string;
  ingresosAnh: number;
  ingresosAnm: number;
  /** Calculado: `ingresosAnh + ingresosAnm`. */
  totalIngresos: number;
  idArchivoSoporte?: number;
  nombreArchivoSoporte?: string;
}

/** Patrón del número de radicado del MHCP: `1-2026-000123`. */
export const PATRON_RADICADO_MHCP = /^[0-9]{1}-[0-9]{4}-[0-9]{6}$/;

// ===================== Determinaciones (ANH / ANM / MME / Fun&Fis) =====================

/**
 * Resumen de la validación de una plantilla de determinaciones.
 *
 * Reproduce las columnas de `InicializarTablaResumenDeterminacionesFunFis()`
 * del legado; `totalFuncionamiento` y `totalFiscalizacion` solo aplican a Fun&Fis.
 */
export interface ResumenValidacionDeterminaciones {
  descripcionDatos: string;
  validacion: 'Sin Errores' | 'Con Errores';
  totalAd20: number;
  totalAd20NoAforado: number;
  totalAd5: number;
  totalAd5NoAforado: number;
  totalAd20OxrSff: number;
  totalAd5OxrSff: number;
  totalDescuentos: number;
  totalADistribuir: number;
  totalADistribuirNoAforado: number;
  totalFuncionamiento?: number;
  totalFiscalizacion?: number;
  totalRegistros: number;
  /** ISO 8601. */
  fechaValidacion: string;
  /** Hallazgos legibles; el log completo se descarga aparte. */
  errores: string[];
}

/** Cargue activo (o intento histórico) de determinaciones de un participante. */
export interface CargueDeterminaciones {
  idArchivo: number;
  idValidacionMaestro: number;
  participante: ParticipanteIac;
  nombreArchivo: string;
  fechaCargue: string;
  usuarioCargue: string;
  activo: boolean;
  resumen: ResumenValidacionDeterminaciones;
}

/** Estado del paso de Fun&Fis, que puede declararse "no aplica". */
export interface EstadoFunFis {
  aplica: boolean;
  cargueActivo?: CargueDeterminaciones;
  historico: CargueDeterminaciones[];
}

// ===================== Parametrización de plantillas =====================

export interface CampoPlantilla {
  codCampo: string;
  nombreCampo: string;
  /** Columna de Excel en base 1 (A = 1). */
  columna: number;
  tipoDatos: 'texto' | 'numero' | 'codigoDane';
}

/**
 * Definición de una plantilla de cargue.
 *
 * En el legado vive en `SGR_DIST_DetallePlantillaCargue`; aquí llega del backend
 * (o del mock) para que la prevalidación del navegador use exactamente la misma
 * estructura que la validación autoritativa del servidor.
 */
export interface DefinicionPlantilla {
  idPlantilla: number;
  participante: ParticipanteIac;
  /** Nombre de la hoja **sin** el sufijo `$` de OleDb que usa el legado. */
  hoja: string;
  /** Primera fila con datos, en base 1. */
  filaInicial: number;
  campos: CampoPlantilla[];
}

// ===================== Resultado del cálculo =====================

export interface ResumenEntidadIac {
  codigoDane: string;
  entidad: string;
  valorDistribuir: number;
  ingresosAnh: number;
  ingresosAnm: number;
  determinacionAd20: number;
  determinacionAd5: number;
  determinacionAd20NoAforados: number;
  determinacionAd5NoAforados: number;
  determinacionAd20OxrSff: number;
  determinacionAd5OxrSff: number;
  descuentos: number;
}

export interface AvanceIac {
  concepto: string;
  presupuesto: number;
  iac: number;
  /** Fracción 0–1; se muestra con `percentFormat`. */
  avance: number;
  iacNuevoAcumulado: number;
  avanceNuevoAcumulado: number;
}

export interface ArchivoIacCalculada {
  idArchivo: number;
  tipo: 'excel' | 'xml';
  nombre: string;
  fechaCalculo: string;
}

export interface ResultadoCalculoIac {
  idIac: number;
  fechaCalculo: string;
  resumenPorEntidad: ResumenEntidadIac[];
  archivos: ArchivoIacCalculada[];
  avance: AvanceIac[];
  enviadaAValidacion: boolean;
  fechaEnvioValidacion?: string;
  versionParametros?: string;
}

// ===================== Reporte de variaciones =====================

/**
 * Conceptos sobre los que se mide la variación entre dos IAC.
 *
 * Coinciden con las columnas del resumen por entidad del cálculo, para que el
 * reporte se pueda leer al lado de la pestaña de cálculo sin traducir nombres.
 */
export type ConceptoVariacion =
  | 'valorDistribuir'
  | 'determinacionAd20'
  | 'determinacionAd5'
  | 'determinacionAd20NoAforados'
  | 'determinacionAd5NoAforados'
  | 'determinacionAd20OxrSff'
  | 'determinacionAd5OxrSff'
  | 'descuentos';

export const ETIQUETA_CONCEPTO: Readonly<Record<ConceptoVariacion, string>> = {
  valorDistribuir: 'Valor a distribuir',
  determinacionAd20: 'AD 20 %',
  determinacionAd5: 'AD 5 %',
  determinacionAd20NoAforados: 'AD 20 % no aforados',
  determinacionAd5NoAforados: 'AD 5 % no aforados',
  determinacionAd20OxrSff: 'AD 20 % OxR SFF',
  determinacionAd5OxrSff: 'AD 5 % OxR SFF',
  descuentos: 'Descuentos',
};

/**
 * Cómo entró una entidad en la comparación.
 *
 * `nueva` y `retirada` importan: una entidad que no estaba en el periodo
 * anterior no tiene una variación porcentual interpretable, y conviene que el
 * reporte lo diga en vez de mostrar un 100 % o un infinito.
 */
export type PresenciaEntidad = 'ambas' | 'nueva' | 'retirada';

export interface VariacionValor {
  actual: number;
  anterior: number;
  /** `actual − anterior`. */
  variacionPesos: number;
  /**
   * Fracción 0–1 sobre el valor anterior. `null` cuando el anterior es cero:
   * la variación existe en pesos pero no es expresable en porcentaje.
   */
  variacionPorcentaje: number | null;
}

export interface VariacionEntidad {
  codigoDane: string;
  entidad: string;
  presencia: PresenciaEntidad;
  /** Variación del valor a distribuir, que es la cifra que encabeza la fila. */
  total: VariacionValor;
  /** Desglose por concepto, en el orden de `ETIQUETA_CONCEPTO`. */
  conceptos: Partial<Record<ConceptoVariacion, VariacionValor>>;
}

export interface VariacionConcepto {
  concepto: ConceptoVariacion;
  etiqueta: string;
  valor: VariacionValor;
}

export interface ReporteVariaciones {
  idIac: number;
  descripcionIac: string;
  periodoActual: string;
  /** Referencia de comparación; `null` si no hay IAC previa del mismo tipo. */
  idIacAnterior: number | null;
  descripcionIacAnterior: string | null;
  periodoAnterior: string | null;
  tipoIac: string;
  fechaGeneracion: string;
  /** Variación agregada de todos los beneficiarios. */
  totalGeneral: VariacionValor;
  porConcepto: VariacionConcepto[];
  porEntidad: VariacionEntidad[];
  /** Conteos que encabezan el reporte. */
  resumen: {
    entidades: number;
    nuevas: number;
    retiradas: number;
    suben: number;
    bajan: number;
    igual: number;
  };
}

// ===================== Notificaciones a entidades =====================

/**
 * Contacto del directorio de entidades territoriales.
 *
 * Equivale a `Adm_DirectorioEntidadesTerritoriales` del sistema anterior, que
 * es de donde `EnviarNotificacionesMail.aspx` sacaba sus destinatarios.
 */
export interface ContactoEntidad {
  codigoDane: string;
  entidad: string;
  departamento: string;
  nombreContacto: string;
  cargo: string;
  email: string;
}

export type EstadoDestinatario = 'pendiente' | 'enviando' | 'enviado' | 'fallido' | 'sin_correo';

export interface DestinatarioLote {
  codigoDane: string;
  entidad: string;
  nombreContacto: string;
  cargo: string;
  email: string;
  /** Valor que se comunica a esta entidad, tomado del cálculo de la IAC. */
  valorDistribuir: number;
  /** Variación frente al periodo anterior, si hay reporte de variaciones. */
  variacionPesos?: number;
  variacionPorcentaje?: number | null;
  estado: EstadoDestinatario;
  fechaEnvio?: string;
  intentos: number;
  /** Motivo del fallo, para poder reintentar con criterio. */
  error?: string;
}

export type EstadoLote = 'borrador' | 'enviando' | 'completado' | 'completado_con_errores' | 'cancelado';

export interface LoteNotificacion {
  id: number;
  idIac: number;
  asunto: string;
  /** Cuerpo HTML con marcadores `{{...}}` sin resolver. */
  plantillaCuerpo: string;
  adjuntarDetalle: boolean;
  estado: EstadoLote;
  fechaCreacion: string;
  usuarioCreacion: string;
  fechaEnvio?: string;
  destinatarios: DestinatarioLote[];
  totales: {
    destinatarios: number;
    enviados: number;
    fallidos: number;
    sinCorreo: number;
  };
}

/**
 * Marcadores admitidos en el asunto y el cuerpo de la plantilla.
 *
 * Se resuelven por destinatario: es lo que convierte un envío masivo en un
 * correo con la información de cada entidad.
 */
export const MARCADORES_PLANTILLA: ReadonlyArray<{ clave: string; descripcion: string }> = [
  { clave: '{{entidad}}', descripcion: 'Nombre de la entidad territorial' },
  { clave: '{{codigoDane}}', descripcion: 'Código DANE de la entidad' },
  { clave: '{{contacto}}', descripcion: 'Nombre del contacto en el directorio' },
  { clave: '{{cargo}}', descripcion: 'Cargo del contacto' },
  { clave: '{{valorDistribuir}}', descripcion: 'Valor a distribuir de la entidad, formateado' },
  { clave: '{{variacionPesos}}', descripcion: 'Variación en pesos frente al periodo anterior' },
  { clave: '{{variacionPorcentaje}}', descripcion: 'Variación porcentual frente al periodo anterior' },
  { clave: '{{periodo}}', descripcion: 'Periodo de recaudo de la IAC' },
  { clave: '{{tipoIac}}', descripcion: 'Tipo de la IAC' },
  { clave: '{{descripcionIac}}', descripcion: 'Nombre de la IAC' },
];

// ===================== Respuesta del backend =====================

/**
 * Envoltura normalizada de las operaciones de escritura.
 *
 * El legado devuelve un `DataSet` cuyo `Tables[0]` es `"OK"`/`"NOK"` y cuyo
 * `Tables[1]` es el mensaje; el backend nuevo debe normalizarlo a esta forma.
 */
export interface RespuestaIac<T = unknown> {
  ok: boolean;
  mensaje: string;
  datos?: T;
}
