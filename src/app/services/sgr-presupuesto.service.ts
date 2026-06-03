import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, tap, shareReplay, catchError } from 'rxjs/operators';
import {
  EntidadesResponse,
  Entidad,
  PresupuestoResponse,
  RegistroPresupuesto,
  JerarquiasResponse,
  ResumenAgregadoResponse,
  PresupuestoUtils,
  FiltrosSGR,
  DatosAgregados,
  EntidadCount
} from '../models/sgr-presupuesto.models';

@Injectable({
  providedIn: 'root'
})
export class SgrPresupuestoService {
  private baseUrl = 'assets/data/sgr';

  // Cache observables
  private entidades$: Observable<Entidad[]> | null = null;
  private presupuesto$: Observable<RegistroPresupuesto[]> | null = null;
  private resumen$: Observable<ResumenAgregadoResponse> | null = null;

  // Subject para filtros
  private filtrosSubject = new BehaviorSubject<FiltrosSGR>({});
  public filtros$ = this.filtrosSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el catálogo de entidades
   */
  getEntidades(): Observable<Entidad[]> {
    if (!this.entidades$) {
      this.entidades$ = this.http
        .get<EntidadesResponse>(`${this.baseUrl}/entidades.json`)
        .pipe(
          map(response => response.entidades),
          shareReplay(1),
          catchError(error => {
            console.error('Error al cargar entidades:', error);
            return of([]);
          })
        );
    }
    return this.entidades$;
  }

  /**
   * Obtiene datos de presupuesto
   */
  getPresupuesto(): Observable<RegistroPresupuesto[]> {
    if (!this.presupuesto$) {
      this.presupuesto$ = this.http
        .get<PresupuestoResponse>(`${this.baseUrl}/presupuesto_detalle.json`)
        .pipe(
          map(response => response.registros),
          shareReplay(1),
          catchError(error => {
            console.error('Error al cargar presupuesto:', error);
            return of([]);
          })
        );
    }
    return this.presupuesto$;
  }

  /**
   * Obtiene jerarquías
   */
  getJerarquias(): Observable<any> {
    return this.http
      .get<JerarquiasResponse>(`${this.baseUrl}/jerarquias.json`)
      .pipe(
        map(response => response.jerarquias),
        catchError(error => {
          console.error('Error al cargar jerarquías:', error);
          return of({});
        })
      );
  }

  /**
   * Obtiene resumen agregado pre-calculado
   */
  getResumen(): Observable<ResumenAgregadoResponse> {
    if (!this.resumen$) {
      this.resumen$ = this.http
        .get<ResumenAgregadoResponse>(`${this.baseUrl}/resumen_agregado.json`)
        .pipe(
          shareReplay(1),
          catchError(error => {
            console.error('Error al cargar resumen:', error);
            return of({
              metadata: { vigencia: '', fechaGeneracion: '', version: '' },
              totalesNacionales: { presupuestoTotal: 0, cajaTotal: 0, avanceTotal: 0, totalEntidades: 0 },
              porTipo: [],
              porRegion: [],
              topMunicipios: [],
              topEjecucion: []
            });
          })
        );
    }
    return this.resumen$;
  }

  /**
   * Aplica filtros a los datos
   */
  aplicarFiltros(filtros: FiltrosSGR): void {
    this.filtrosSubject.next(filtros);
  }

  /**
   * Obtiene datos agregados con filtros aplicados
   */
  getDatosAgregados(filtros?: FiltrosSGR): Observable<DatosAgregados> {
    return combineLatest([
      this.getEntidades(),
      this.getPresupuesto()
    ]).pipe(
      map(([entidades, registros]) => {
        // Aplicar filtros a entidades
        let entidadesFiltradas = entidades;

        if (filtros) {
          if (filtros.tipoEntidad) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.tipo === filtros.tipoEntidad);
          }

          if (filtros.region) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.region === filtros.region);
          }

          if (filtros.productor !== null && filtros.productor !== undefined) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.atributos.esProductor === filtros.productor);
          }

          if (filtros.pdet !== null && filtros.pdet !== undefined) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.atributos.esPdet === filtros.pdet);
          }

          if (filtros.zomac !== null && filtros.zomac !== undefined) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.atributos.esZomac === filtros.zomac);
          }
        }

        // Obtener códigos de entidades filtradas
        const codigosEntidades = new Set(entidadesFiltradas.map(e => e.codigo));

        // Filtrar registros de presupuesto
        let registrosFiltrados = registros.filter(r => codigosEntidades.has(r.codigoEntidad));

        if (filtros?.conceptoGasto) {
          registrosFiltrados = registrosFiltrados.filter(r => r.conceptoGasto === filtros.conceptoGasto);
        }

        // Filtro por destinación étnica
        if (filtros?.destinacionEtnica !== null && filtros?.destinacionEtnica !== undefined) {
          registrosFiltrados = registrosFiltrados.filter(r => r.destinacionEtnica === filtros.destinacionEtnica);
        }

        // Calcular agregados
        let presupuestoTotal = 0;
        let presupuestoCorrienteTotal = 0;
        let presupuestoOtrosTotal = 0;
        let recaudoTotal = 0;
        let recaudoCorrienteTotal = 0;
        let recaudoOtrosTotal = 0;
        let sumaAvances = 0;

        registrosFiltrados.forEach(r => {
          const ppto = PresupuestoUtils.calcularPresupuestoTotal(r.presupuesto);
          const caja = PresupuestoUtils.calcularCajaTotal(r.recaudo);
          const avance = PresupuestoUtils.calcularAvanceTotal(r.presupuesto, r.recaudo);

          presupuestoTotal += ppto;
          presupuestoCorrienteTotal += r.presupuesto.corriente;

          // Calcular "otros" como todo excepto corriente
          presupuestoOtrosTotal += (ppto - r.presupuesto.corriente);

          recaudoTotal += caja;
          recaudoCorrienteTotal += r.recaudo.corriente;
          recaudoOtrosTotal += r.recaudo.otros;

          sumaAvances += avance;
        });

        const avancePromedio = registrosFiltrados.length > 0
          ? sumaAvances / registrosFiltrados.length
          : 0;

        // Contar entidades por categoría
        const entidadesCount: EntidadCount = {
          beneficiarias: entidadesFiltradas.length,
          productoras: entidadesFiltradas.filter(e => e.atributos.esProductor).length,
          zomac: entidadesFiltradas.filter(e => e.atributos.esZomac).length,
          pdet: entidadesFiltradas.filter(e => e.atributos.esPdet).length,
          etnicas: entidadesFiltradas.filter(e => e.tipo === 'Étnicos').length
        };

        // Contar registros con destinación étnica
        const registrosDestinacionEtnica = registrosFiltrados.filter(r => r.destinacionEtnica).length;

        return {
          entidadesCount,
          presupuestoTotal,
          recaudoTotal,
          avancePromedio,
          presupuestoCorriente: presupuestoCorrienteTotal,
          presupuestoOtros: presupuestoOtrosTotal,
          recaudoCorriente: recaudoCorrienteTotal,
          recaudoOtros: recaudoOtrosTotal,
          registrosDestinacionEtnica
        };
      })
    );
  }

  /**
   * Obtiene entidades por tipo
   */
  getEntidadesPorTipo(tipo: string): Observable<Entidad[]> {
    return this.getEntidades().pipe(
      map(entidades => entidades.filter(e => e.tipo === tipo))
    );
  }

  /**
   * Obtiene municipios de un departamento
   */
  getMunicipiosPorDepartamento(codigoDepartamento: string): Observable<Entidad[]> {
    return combineLatest([
      this.getEntidades(),
      this.getJerarquias()
    ]).pipe(
      map(([entidades, jerarquias]) => {
        const jerarquiasMunicipales = jerarquias['Municipal'] || {};
        const codigosMunicipios = jerarquiasMunicipales[codigoDepartamento] || [];
        return entidades.filter(e => codigosMunicipios.includes(e.codigo));
      })
    );
  }

  /**
   * Obtiene presupuesto agregado por entidad
   */
  getPresupuestoAgregadoPorEntidad(filtros?: FiltrosSGR): Observable<any[]> {
    return combineLatest([
      this.getEntidades(),
      this.getPresupuesto()
    ]).pipe(
      map(([entidades, registros]) => {
        // Aplicar filtros
        let entidadesFiltradas = entidades;

        if (filtros) {
          if (filtros.tipoEntidad) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.tipo === filtros.tipoEntidad);
          }
          if (filtros.region) {
            entidadesFiltradas = entidadesFiltradas.filter(e => e.region === filtros.region);
          }
        }

        const codigosEntidades = new Set(entidadesFiltradas.map(e => e.codigo));
        const agregado = new Map<string, any>();

        registros
          .filter(r => codigosEntidades.has(r.codigoEntidad))
          .forEach(r => {
            const key = r.codigoEntidad;
            const presupuestoTotal = PresupuestoUtils.calcularPresupuestoTotal(r.presupuesto);
            const cajaTotal = PresupuestoUtils.calcularCajaTotal(r.recaudo);

            if (!agregado.has(key)) {
              agregado.set(key, {
                codigoEntidad: r.codigoEntidad,
                nombreEntidad: r.nombreEntidad,
                tipoEntidad: r.tipoEntidad,
                presupuestoTotal: 0,
                cajaTotal: 0,
                registros: 0
              });
            }

            const item = agregado.get(key)!;
            item.presupuestoTotal += presupuestoTotal;
            item.cajaTotal += cajaTotal;
            item.registros += 1;
          });

        return Array.from(agregado.values()).map(item => ({
          ...item,
          avanceTotal: item.presupuestoTotal > 0 ? item.cajaTotal / item.presupuestoTotal : 0
        }));
      })
    );
  }

  /**
   * Busca entidades por nombre (para autocomplete)
   */
  buscarEntidades(termino: string): Observable<Entidad[]> {
    return this.getEntidades().pipe(
      map(entidades =>
        entidades.filter(e =>
          e.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          e.codigo.includes(termino)
        ).slice(0, 20) // Limitar a 20 resultados
      )
    );
  }

  /**
   * Obtiene serie temporal de avance (para gráfico de líneas)
   * Por ahora retorna datos simulados basados en el avance total
   */
  getSerieTemporalAvance(filtros?: FiltrosSGR): Observable<any> {
    return this.getDatosAgregados(filtros).pipe(
      map(datos => {
        const avanceFinal = datos.avancePromedio * 100;
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        // Generar progresión lineal simulada hasta el avance actual
        const datosSimulados = meses.map((mes, index) => {
          const porcentaje = (avanceFinal / 12) * (index + 1);
          return Math.min(porcentaje, avanceFinal);
        });

        return {
          labels: meses,
          data: datosSimulados,
          avanceFinal
        };
      })
    );
  }
}
