import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

// ========== SGR Funcionamiento Interfaces ==========
export interface DiccionarioItem {
  concepto: string;
  descripcion: string;
}

export interface SiglasItem {
  sigla: string;
  descripcion: string;
}

export interface FuenteAsignacion {
  id_fuente: number;
  fuente: string  
}

export interface ConceptoFuente {
  id_concepto: number;
  concepto: string;
  id_fuente: number;
  fuente: string;
}

export interface EntidadConcepto {
  codigo_entidad: string;
  beneficiario: string;  
}

export interface DepartamentoFuncionamiento {
  codigo_departamento: string;
  nombre_departamento: string;
}

export interface MunicipioFuncionamiento {
  codigo_municipio: string;
  nombre_municipio: string;
  nombre_departamento: string;
}

export interface DistribucionTotal {
  id_vigencia: number;
  vigencia: string,
  distribucion_presupuesto_corriente: number;
  distribucion_otros: number;
  total_asignado_bienio: number;
  disponibilidad_inicial: number;
  apropiacion_vigente: number;
  recursos_bloqueados: number;
  apropiacion_vigente_disponible: number;
  iac_mr_saldos_reintegros: number;
  iac_corriente: number;
  iac_iInformadas: number;
  avance_iac_corriente: number;
  caja_total: number;
  cpd: number;
  compromisos: number;
  pagos: number;
  saldo_por_comprometer: number;
  pct_ejecucion_a_compromisos: number;
  caja_disponible: number;
  saldo_disponible_a_pagos: number;
  saldo_sin_afectacion: number;
}

export interface FuncionamientoSiglasDiccionario {
  diccionario: {
    data: DiccionarioItem[];
  };
  siglas: {
    data: SiglasItem[];
  };
}

// ========== SGR General Interfaces ==========
export interface Vigencia {
  id_vigencia: number;
  vigencia: string;  
}

// ========== SGP Interfaces ==========
export interface ResumenGeneral {
  anio: number;
  total_distribuido: number;
  total_presupuesto: number;
  porcentaje_ejecucion: number;
  porcentaje_avance: number;
  porcentaje_avance_str: string;
  fecha_ultima_actualizacion: Date;
}

export interface ResumenParticipaciones {
  anio: number;
  id_concepto: string;
  concepto: string;  
  total: number;
}

export interface ResumenDistribuciones {
  anio: number;
  distribucion_id: number;
  nombre_distribucion: string;
  fecha_distribucion: string;
  total_distribuido: number;
  entidades_beneficiadas: number;
}

export interface ResumenHistorico {
  anio: number;
  id_concepto: string,
  concepto: string,
  precios_corrientes: number;
  precios_constantes: number;
  variacion_anual: number;
}

// ========== SGP Request Parameters Interfaces ==========
export interface ResumenHistoricoParams {
  anios?: string;
}

// ========== Request Parameters Interfaces ==========
export interface DistribucionTotalParams {
  idVigencia?: number;
  idsFuente?: string;
  idsConcepto?: string;
  idsBeneficiario?: string;
  tipoEntidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SicodisApiService {
  private readonly baseUrl = 'https://sicodis.dnp.gov.co/apiws/ApiSicodisNew';

  constructor(private http: HttpClient) {}

  // ========== SGR Funcionamiento Methods ==========

  /**
   * Obtiene las siglas y diccionario de funcionamiento
   * @returns Observable con los datos de siglas y diccionario estructurados
   */
  funcionamientoSiglasDiccionario(): Observable<FuncionamientoSiglasDiccionario> {
    const siglasUrl = `${this.baseUrl}/sgrfun/siglas`;
    const diccionarioUrl = `${this.baseUrl}/sgrfun/diccionario`;

    return forkJoin({
      siglas: this.http.get<SiglasItem[]>(siglasUrl),
      diccionario: this.http.get<DiccionarioItem[]>(diccionarioUrl)
    }).pipe(
      map(({ siglas, diccionario }) => ({
        diccionario: {
          data: diccionario || []
        },
        siglas: {
          data: siglas || []
        }
      }))
    );
  }

  /**
   * Obtiene solo las siglas de funcionamiento
   * @returns Observable con el array de siglas
   */
  getSiglasFuncionamiento(): Observable<SiglasItem[]> {
    const url = `${this.baseUrl}/sgrfun/siglas`;
    return this.http.get<SiglasItem[]>(url);
  }

  /**
   * Obtiene solo el diccionario de funcionamiento
   * @returns Observable con el array de diccionario
   */
  getDiccionarioFuncionamiento(): Observable<DiccionarioItem[]> {
    const url = `${this.baseUrl}/sgrfun/diccionario`;
    return this.http.get<DiccionarioItem[]>(url);
  }

  /**
   * Obtiene las fuentes de asignaciones del SGR Funcionamiento
   * @returns Observable con el array de fuentes de asignación
   */
  getFuentesAsignaciones(): Observable<FuenteAsignacion[]> {
    const url = `${this.baseUrl}/sgrfun/fuentes_asignaciones`;
    return this.http.get<FuenteAsignacion[]>(url);
  }

  /**
   * Obtiene conceptos de funcionamiento para fuentes específicas
   * @param idsFuentes - IDs de fuentes separados por comas
   * @returns Observable con el array de conceptos
   */
  getConceptosFuentes(idsFuentes: string): Observable<ConceptoFuente[]> {
    const url = `${this.baseUrl}/sgrfun/conceptos_fuentes/${idsFuentes}`;
    return this.http.get<ConceptoFuente[]>(url);
  }

  /**
   * Obtiene las entidades asociadas a un concepto específico
   * @param idConcepto - ID del concepto
   * @returns Observable con el array de entidades
   */
  getEntidadesConceptos(idConcepto: number): Observable<EntidadConcepto[]> {
    const url = `${this.baseUrl}/sgrfun/entidades_conceptos/${idConcepto}`;
    return this.http.get<EntidadConcepto[]>(url);
  }

  /**
   * Obtiene los departamentos para fortalecimiento de funcionamiento
   * @returns Observable con el array de departamentos
   */
  getDepartamentosFuncionamiento(): Observable<DepartamentoFuncionamiento[]> {
    const url = `${this.baseUrl}/sgrfun/departamentos`;
    return this.http.get<DepartamentoFuncionamiento[]>(url);
  }

  /**
   * Obtiene los municipios por código de departamento
   * @param codigoDepto - Código del departamento
   * @returns Observable con el array de municipios
   */
  getMunicipiosPorDepartamento(codigoDepto: string): Observable<MunicipioFuncionamiento[]> {
    const url = `${this.baseUrl}/sgrfun/municipios_por_departamento/${codigoDepto}`;
    return this.http.get<MunicipioFuncionamiento[]>(url);
  }

  /**
   * Obtiene la distribución total del SGR Funcionamiento
   * @param params - Parámetros de filtrado opcionales
   * @returns Observable con el array de distribuciones
   */
  getDistribucionTotal(params?: DistribucionTotalParams): Observable<DistribucionTotal[]> {
    const url = `${this.baseUrl}/sgrfun/distribuciones/total`;
    let httpParams = new HttpParams();

    if (params) {
      if (params.idVigencia) httpParams = httpParams.set('idVigencia', params.idVigencia.toString());
      if (params.idsFuente) httpParams = httpParams.set('idsFuente', params.idsFuente);
      if (params.idsConcepto) httpParams = httpParams.set('idsConcepto', params.idsConcepto);
      if (params.idsBeneficiario) httpParams = httpParams.set('idsBeneficiario', params.idsBeneficiario);
      if (params.tipoEntidad) httpParams = httpParams.set('tipoEntidad', params.tipoEntidad);
    }

    return this.http.get<DistribucionTotal[]>(url, { params: httpParams });
  }

  // ========== SGR General Methods ==========

  /**
   * Obtiene las vigencias registradas del SGR
   * @returns Observable con el array de vigencias
   * @note Este endpoint puede tener restricciones CORS en desarrollo local
   */
  getVigencias(): Observable<Vigencia[]> {
    const url = `${this.baseUrl}/sgr/vigencias`;
    return this.http.get<Vigencia[]>(url);
  }

  // ========== SGP Methods ==========

  /**
   * Obtiene el resumen general del SGP para un año específico
   * @param anio - Año de consulta
   * @returns Observable con el resumen general
   */
  getSgpResumenGeneral(anio: number): Observable<ResumenGeneral> {
    const url = `${this.baseUrl}/sgp/resumen_general/${anio}`;
    return this.http.get<ResumenGeneral>(url);
  }

  /**
   * Obtiene el resumen de participaciones del SGP
   * @param anio - Año de consulta
   * @param codigoDepto - Código del departamento
   * @param codigoMunicipio - Código del municipio
   * @returns Observable con el resumen de participaciones
   */
  getSgpResumenParticipaciones(anio: number, codigoDepto: string, codigoMunicipio: string): Observable<ResumenParticipaciones> {
    const url = `${this.baseUrl}/sgp/resumen_participaciones/${anio}/${codigoDepto}/${codigoMunicipio}`;
    return this.http.get<ResumenParticipaciones>(url);
  }

  /**
   * Obtiene el resumen de distribuciones del SGP para un año específico
   * @param anio - Año de consulta
   * @returns Observable con el resumen de distribuciones
   */
  getSgpResumenDistribuciones(anio: number): Observable<ResumenDistribuciones[]> {
    const url = `${this.baseUrl}/sgp/resumen_distribuciones/${anio}`;
    return this.http.get<ResumenDistribuciones[]>(url);
  }

  /**
   * Obtiene el resumen de participaciones de distribución específica
   * @param idDistribucion - ID de la distribución
   * @param codigoDepto - Código del departamento
   * @param codigoMunicipio - Código del municipio
   * @returns Observable con el resumen de participaciones de distribución
   */
  getSgpResumenParticipacionesDistribucion(idDistribucion: number, codigoDepto: string, codigoMunicipio: string): Observable<ResumenParticipaciones> {
    const url = `${this.baseUrl}/sgp/resumen_participaciones_distribucion/${idDistribucion}/${codigoDepto}/${codigoMunicipio}`;
    return this.http.get<ResumenParticipaciones>(url);
  }

  /**
   * Obtiene el resumen histórico de precios corrientes y constantes del SGP
   * @param params - Parámetros opcionales incluyendo años específicos
   * @returns Observable con el array de datos históricos
   */
  getSgpResumenHistorico(params?: ResumenHistoricoParams): Observable<ResumenHistorico[]> {
    const url = `${this.baseUrl}/sgp/resumen_historico_corrientes_constantes`;
    let httpParams = new HttpParams();

    if (params?.anios) {
      httpParams = httpParams.set('anios', params.anios);
    }

    return this.http.get<ResumenHistorico[]>(url, { params: httpParams });
  }
}