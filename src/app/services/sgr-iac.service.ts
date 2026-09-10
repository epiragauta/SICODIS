import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';

import {
  ArchivoIacCalculada,
  AvanceIac,
  CargueDeterminaciones,
  DefinicionPlantilla,
  EstadoFunFis,
  EstadoInsumosIac,
  EstadoPaso,
  IacResumen,
  InsumoMhcp,
  NuevaIacRequest,
  OpcionCatalogo,
  ParticipanteIac,
  PARTICIPANTES,
  RespuestaIac,
  ResultadoCalculoIac,
  ResumenEntidadIac,
  ResumenValidacionDeterminaciones,
  ReporteVariaciones,
} from '../models/sgr-iac.models';
import { generarReporteVariaciones } from '../utils/variaciones-iac';

/**
 * Servicio de la Instrucción de Abono a Cuenta (IAC) del SGR.
 *
 * Mientras el backend no exponga `/sgr/iac/*` (ver §3.5 de
 * `docs/planes/PLAN_SGR_IAC_TRANSACCIONAL.md`), todo el estado vive en memoria
 * con `simularIac = true`. Las rutas reales ya están declaradas en `RUTAS` para
 * que la integración sea sustitución y no reescritura; cuando el contrato se
 * cierre, las llamadas HTTP se trasladan a `sicodis-api.service.ts`, que es el
 * servicio único de API del proyecto.
 */
@Injectable({ providedIn: 'root' })
export class SgrIacService {

  private http = inject(HttpClient);

  /** Poner en `false` cuando exista el backend. */
  private readonly simularIac = true;

  private readonly base = '/api/sgr/iac';

  /** Rutas del contrato acordado en el plan. */
  private readonly RUTAS = {
    listado: () => `${this.base}/listado`,
    vigencias: () => `${this.base}/vigencias`,
    periodos: (idVigencia: number) => `${this.base}/periodos/${idVigencia}`,
    tipos: () => `${this.base}/tipos`,
    crear: () => `${this.base}`,
    detalle: (id: number) => `${this.base}/${id}`,
    estadoInsumos: (id: number) => `${this.base}/${id}/estado-insumos`,
    mhcp: (id: number) => `${this.base}/${id}/mhcp`,
    determinaciones: (id: number, p: ParticipanteIac) => `${this.base}/${id}/determinaciones/${p}`,
    activarDeterminaciones: (id: number, p: ParticipanteIac) => `${this.base}/${id}/determinaciones/${p}/activar`,
    historico: (id: number, p: ParticipanteIac) => `${this.base}/${id}/determinaciones/${p}/historico`,
    funFisAplica: (id: number) => `${this.base}/${id}/funfis/aplica`,
    funFisEstado: (id: number) => `${this.base}/${id}/funfis`,
    calcular: (id: number) => `${this.base}/${id}/calcular`,
    resultado: (id: number) => `${this.base}/${id}/resultado`,
    variaciones: (id: number) => `${this.base}/${id}/variaciones`,
    enviarValidacion: (id: number) => `${this.base}/${id}/enviar-validacion`,
    archivo: (idArchivo: number) => `${this.base}/archivo/${idArchivo}`,
    archivoLog: (idArchivo: number) => `${this.base}/archivo/${idArchivo}/log`,
    plantilla: (idPlantilla: number) => `${this.base}/plantilla/${idPlantilla}`,
  };

  /** Latencia simulada, para que los estados de carga se vean como en producción. */
  private readonly latencia = 350;

  // ===================== Estado simulado =====================

  private iacs: IacResumen[] = [];
  private insumosMhcp = new Map<number, InsumoMhcp>();
  private cargues = new Map<string, CargueDeterminaciones[]>();   // clave `${idIac}|${participante}`
  private funFisAplica = new Map<number, boolean>();
  private resultados = new Map<number, ResultadoCalculoIac>();
  private logs = new Map<number, string>();                        // idArchivo → log de validación
  private secuenciaIac = 0;
  private secuenciaArchivo = 0;

  constructor() {
    if (this.simularIac) {
      this.sembrarDatos();
    }
  }

  // ===================== Catálogos =====================

  getVigencias(): Observable<OpcionCatalogo[]> {
    if (!this.simularIac) { return this.http.get<OpcionCatalogo[]>(this.RUTAS.vigencias()); }
    return this.simular([
      { id: 3, label: '2025 - 2026' },
      { id: 2, label: '2023 - 2024' },
      { id: 1, label: '2021 - 2022' },
    ]);
  }

  getPeriodos(idVigencia: number): Observable<OpcionCatalogo[]> {
    if (!this.simularIac) { return this.http.get<OpcionCatalogo[]>(this.RUTAS.periodos(idVigencia)); }

    const anios = idVigencia === 3 ? [2025, 2026] : idVigencia === 2 ? [2023, 2024] : [2021, 2022];
    const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const periodos: OpcionCatalogo[] = [];
    anios.forEach((anio, i) => meses.forEach((mes, j) => {
      periodos.push({ id: idVigencia * 100 + i * 12 + j + 1, label: `${anio}-${mes}` });
    }));
    return this.simular(periodos.reverse());
  }

  getTiposIac(): Observable<OpcionCatalogo[]> {
    if (!this.simularIac) { return this.http.get<OpcionCatalogo[]>(this.RUTAS.tipos()); }
    return this.simular([
      { id: 1, label: 'IAC Corriente' },
      { id: 2, label: 'IAC Mayor Recaudo' },
      { id: 3, label: 'IAC Saldos y Reintegros' },
      { id: 4, label: 'IAC Rendimientos Financieros' },
    ]);
  }

  // ===================== Listado y creación =====================

  getListado(): Observable<IacResumen[]> {
    if (!this.simularIac) { return this.http.get<IacResumen[]>(this.RUTAS.listado()); }
    return this.simular(this.iacs.map(i => ({ ...i })));
  }

  getIac(id: number): Observable<IacResumen | null> {
    if (!this.simularIac) { return this.http.get<IacResumen>(this.RUTAS.detalle(id)); }
    const iac = this.iacs.find(i => i.id === id);
    return this.simular(iac ? { ...iac } : null);
  }

  crearIac(peticion: NuevaIacRequest, vigencia: string, periodo: string, tipo: string, usuario: string): Observable<RespuestaIac<IacResumen>> {
    if (!this.simularIac) { return this.http.post<RespuestaIac<IacResumen>>(this.RUTAS.crear(), peticion); }

    const duplicada = this.iacs.some(
      i => i.idVigencia === peticion.idVigencia && i.idPeriodo === peticion.idPeriodo && i.idTipoIac === peticion.idTipoIac && i.estado !== 'anulada',
    );
    if (duplicada) {
      return this.simular({
        ok: false,
        mensaje: `Ya existe una IAC de tipo "${tipo}" para el periodo ${periodo}. Verifique el listado antes de crear una nueva.`,
      });
    }

    const nueva: IacResumen = {
      id: ++this.secuenciaIac,
      descripcion: peticion.nombre,
      idVigencia: peticion.idVigencia,
      bienio: vigencia,
      idPeriodo: peticion.idPeriodo,
      periodo,
      idTipoIac: peticion.idTipoIac,
      tipoIac: tipo,
      ingresosHidrocarburos: 0,
      ingresosMineria: 0,
      totalIngresos: 0,
      estado: 'borrador',
      fechaCreacion: new Date().toISOString(),
      usuarioCreacion: usuario,
    };
    this.iacs = [nueva, ...this.iacs];
    return this.simular({ ok: true, mensaje: 'La Instrucción de Abono a Cuenta se creó correctamente.', datos: { ...nueva } });
  }

  // ===================== Estado de insumos =====================

  getEstadoInsumos(idIac: number): Observable<EstadoInsumosIac> {
    if (!this.simularIac) { return this.http.get<EstadoInsumosIac>(this.RUTAS.estadoInsumos(idIac)); }
    return this.simular(this.calcularEstadoInsumos(idIac));
  }

  private calcularEstadoInsumos(idIac: number): EstadoInsumosIac {
    const pasos = PARTICIPANTES.map(p => {
      let estado: EstadoPaso = 'pendiente';
      let fechaActualizacion: string | undefined;
      let idValidacionMaestro: number | undefined;

      if (p.codigo === 'MHCP') {
        const mhcp = this.insumosMhcp.get(idIac);
        if (mhcp) { estado = 'completo'; }
      } else {
        const activo = this.cargueActivo(idIac, p.codigo);
        if (activo) {
          estado = activo.resumen.validacion === 'Sin Errores' ? 'completo' : 'error';
          fechaActualizacion = activo.fechaCargue;
          idValidacionMaestro = activo.idValidacionMaestro;
        } else if (p.codigo === 'FUNFIS' && this.funFisAplica.get(idIac) === false) {
          estado = 'completo';   // declarado "no aplica"
        }
      }

      return { participante: p.codigo, estado, obligatorio: p.obligatorio, fechaActualizacion, idValidacionMaestro };
    });

    const completo = pasos.filter(p => p.obligatorio).every(p => p.estado === 'completo');
    return { idIac, pasos, completo };
  }

  // ===================== Paso MHCP =====================

  getInsumoMhcp(idIac: number): Observable<InsumoMhcp | null> {
    if (!this.simularIac) { return this.http.get<InsumoMhcp>(this.RUTAS.mhcp(idIac)); }
    const dato = this.insumosMhcp.get(idIac);
    return this.simular(dato ? { ...dato } : null);
  }

  guardarInsumoMhcp(idIac: number, insumo: InsumoMhcp, soporte: File | null): Observable<RespuestaIac<InsumoMhcp>> {
    if (!this.simularIac) {
      const formulario = new FormData();
      Object.entries(insumo).forEach(([clave, valor]) => formulario.append(clave, String(valor ?? '')));
      if (soporte) { formulario.append('soporte', soporte, soporte.name); }
      return this.http.post<RespuestaIac<InsumoMhcp>>(this.RUTAS.mhcp(idIac), formulario);
    }

    const previo = this.insumosMhcp.get(idIac);
    const guardado: InsumoMhcp = {
      ...insumo,
      totalIngresos: insumo.ingresosAnh + insumo.ingresosAnm,
      idArchivoSoporte: soporte ? ++this.secuenciaArchivo : previo?.idArchivoSoporte,
      nombreArchivoSoporte: soporte ? soporte.name : previo?.nombreArchivoSoporte,
    };
    this.insumosMhcp.set(idIac, guardado);

    // El MHCP fija los ingresos de la cabecera de la IAC.
    const iac = this.iacs.find(i => i.id === idIac);
    if (iac) {
      iac.ingresosHidrocarburos = guardado.ingresosAnh;
      iac.ingresosMineria = guardado.ingresosAnm;
      iac.totalIngresos = guardado.totalIngresos;
    }

    return this.simular({ ok: true, mensaje: 'La información del MHCP se guardó correctamente.', datos: { ...guardado } });
  }

  // ===================== Determinaciones =====================

  getDefinicionPlantilla(participante: ParticipanteIac): Observable<DefinicionPlantilla> {
    const definicion = DEFINICIONES_PLANTILLA[participante];
    if (!definicion) {
      return throwError(() => new Error(`El participante ${participante} no carga plantilla de determinaciones.`));
    }
    if (!this.simularIac) { return this.http.get<DefinicionPlantilla>(this.RUTAS.plantilla(definicion.idPlantilla)); }
    return this.simular({ ...definicion, campos: definicion.campos.map(c => ({ ...c })) });
  }

  getCargueActivo(idIac: number, participante: ParticipanteIac): Observable<CargueDeterminaciones | null> {
    if (!this.simularIac) { return this.http.get<CargueDeterminaciones>(this.RUTAS.determinaciones(idIac, participante)); }
    const activo = this.cargueActivo(idIac, participante);
    return this.simular(activo ? { ...activo } : null);
  }

  getHistorico(idIac: number, participante: ParticipanteIac): Observable<CargueDeterminaciones[]> {
    if (!this.simularIac) { return this.http.get<CargueDeterminaciones[]>(this.RUTAS.historico(idIac, participante)); }
    return this.simular([...(this.cargues.get(this.clave(idIac, participante)) ?? [])].reverse());
  }

  /**
   * Registra el intento de cargue.
   *
   * Reproduce el comportamiento del legado: el intento **siempre** se persiste
   * (archivo + log), pero solo se activa si la validación no encontró errores y
   * el usuario confirmó el reemplazo de un cargue activo previo.
   */
  registrarCargueDeterminaciones(
    idIac: number,
    participante: ParticipanteIac,
    archivo: File,
    resumen: ResumenValidacionDeterminaciones,
    log: string,
    usuario: string,
    activar: boolean,
  ): Observable<RespuestaIac<CargueDeterminaciones>> {

    if (!this.simularIac) {
      const formulario = new FormData();
      formulario.append('archivo', archivo, archivo.name);
      formulario.append('activar', String(activar));
      return this.http.post<RespuestaIac<CargueDeterminaciones>>(this.RUTAS.determinaciones(idIac, participante), formulario);
    }

    const idArchivo = ++this.secuenciaArchivo;
    this.logs.set(idArchivo, log);

    const cargue: CargueDeterminaciones = {
      idArchivo,
      idValidacionMaestro: idArchivo,
      participante,
      nombreArchivo: archivo.name,
      fechaCargue: new Date().toISOString(),
      usuarioCargue: usuario,
      activo: false,
      resumen,
    };

    const clave = this.clave(idIac, participante);
    const lista = this.cargues.get(clave) ?? [];
    lista.push(cargue);
    this.cargues.set(clave, lista);

    if (resumen.validacion === 'Con Errores') {
      return this.simular({
        ok: false,
        mensaje: 'Se encontraron errores en la validación de los datos de la plantilla de cargue. Por favor verifique.',
        datos: { ...cargue },
      });
    }

    if (activar) {
      this.activar(idIac, participante, idArchivo);
      if (participante === 'FUNFIS') { this.funFisAplica.set(idIac, true); }
    }

    return this.simular({
      ok: true,
      mensaje: activar
        ? 'Las determinaciones se validaron y cargaron correctamente.'
        : 'Las determinaciones se validaron correctamente. Confirme el reemplazo para activarlas.',
      datos: { ...cargue },
    });
  }

  /** Activa un cargue ya validado, desactivando el anterior. */
  activarCargue(idIac: number, participante: ParticipanteIac, idArchivo: number): Observable<RespuestaIac> {
    if (!this.simularIac) {
      return this.http.post<RespuestaIac>(this.RUTAS.activarDeterminaciones(idIac, participante), { idArchivo });
    }
    this.activar(idIac, participante, idArchivo);
    if (participante === 'FUNFIS') { this.funFisAplica.set(idIac, true); }
    return this.simular({ ok: true, mensaje: 'El cargue anterior quedó inactivo y se activaron las nuevas determinaciones.' });
  }

  /** Desactiva las determinaciones activas del participante. */
  eliminarDeterminaciones(idIac: number, participante: ParticipanteIac): Observable<RespuestaIac> {
    if (!this.simularIac) { return this.http.delete<RespuestaIac>(this.RUTAS.determinaciones(idIac, participante)); }

    const lista = this.cargues.get(this.clave(idIac, participante)) ?? [];
    lista.forEach(c => (c.activo = false));
    this.invalidarCalculo(idIac);
    return this.simular({ ok: true, mensaje: 'Las determinaciones activas se eliminaron. El histórico de cargues se conserva.' });
  }

  // ===================== Fun&Fis =====================

  getEstadoFunFis(idIac: number): Observable<EstadoFunFis> {
    if (!this.simularIac) { return this.http.get<EstadoFunFis>(this.RUTAS.funFisEstado(idIac)); }

    const activo = this.cargueActivo(idIac, 'FUNFIS');
    return this.simular({
      aplica: this.funFisAplica.get(idIac) ?? !!activo,
      cargueActivo: activo ? { ...activo } : undefined,
      historico: [...(this.cargues.get(this.clave(idIac, 'FUNFIS')) ?? [])].reverse(),
    });
  }

  /** "No aplica" borra las determinaciones activas, como en el legado. */
  setFunFisAplica(idIac: number, aplica: boolean): Observable<RespuestaIac> {
    if (!this.simularIac) { return this.http.put<RespuestaIac>(this.RUTAS.funFisAplica(idIac), { aplica }); }

    this.funFisAplica.set(idIac, aplica);
    if (!aplica) {
      const lista = this.cargues.get(this.clave(idIac, 'FUNFIS')) ?? [];
      lista.forEach(c => (c.activo = false));
    }
    this.invalidarCalculo(idIac);
    return this.simular({
      ok: true,
      mensaje: aplica
        ? 'Se habilitó el cargue de determinaciones de Funcionamiento y Fiscalización.'
        : 'Se registró que no aplican determinaciones de Funcionamiento y Fiscalización para esta IAC.',
    });
  }

  // ===================== Cálculo =====================

  calcularIac(idIac: number): Observable<RespuestaIac<ResultadoCalculoIac>> {
    if (!this.simularIac) { return this.http.post<RespuestaIac<ResultadoCalculoIac>>(this.RUTAS.calcular(idIac), {}); }

    const estado = this.calcularEstadoInsumos(idIac);
    if (!estado.completo) {
      return this.simular({
        ok: false,
        mensaje: 'Operación no permitida. Aún no se encuentran los insumos completos para calcular la IAC.',
      });
    }

    const resultado = this.construirResultado(idIac);
    this.resultados.set(idIac, resultado);

    const iac = this.iacs.find(i => i.id === idIac);
    if (iac && iac.estado === 'borrador') {
      iac.estado = 'calculada';
      iac.fechaCalculo = resultado.fechaCalculo;
    }

    return this.simular({ ok: true, mensaje: 'La IAC se calculó correctamente.', datos: resultado }, 1400);
  }

  getResultado(idIac: number): Observable<ResultadoCalculoIac | null> {
    if (!this.simularIac) { return this.http.get<ResultadoCalculoIac>(this.RUTAS.resultado(idIac)); }
    const resultado = this.resultados.get(idIac);
    return this.simular(resultado ? { ...resultado } : null);
  }

  enviarAValidacion(idIac: number, usuario: string): Observable<RespuestaIac> {
    if (!this.simularIac) { return this.http.post<RespuestaIac>(this.RUTAS.enviarValidacion(idIac), { usuario }); }

    const resultado = this.resultados.get(idIac);
    if (!resultado) {
      return this.simular({ ok: false, mensaje: 'La IAC debe calcularse antes de enviarse a validación.' });
    }
    if (resultado.enviadaAValidacion) {
      return this.simular({ ok: false, mensaje: 'Esta IAC ya fue enviada a validación.' });
    }

    resultado.enviadaAValidacion = true;
    resultado.fechaEnvioValidacion = new Date().toISOString();
    const iac = this.iacs.find(i => i.id === idIac);
    if (iac) { iac.estado = 'enviada'; }

    return this.simular({ ok: true, mensaje: 'La IAC se envió a validación correctamente.' });
  }

  // ===================== Reporte de variaciones =====================

  /**
   * IAC anterior del mismo tipo con la que se compara.
   *
   * Es la del periodo inmediatamente previo que además esté calculada: una IAC
   * en borrador no tiene cifras contra las que medir.
   */
  private iacAnteriorComparable(iac: IacResumen): IacResumen | null {
    const candidatas = this.iacs
      .filter(i => i.idTipoIac === iac.idTipoIac
                && i.idPeriodo < iac.idPeriodo
                && i.estado !== 'anulada'
                && this.resultados.has(i.id))
      .sort((a, b) => b.idPeriodo - a.idPeriodo);

    return candidatas[0] ?? null;
  }

  /**
   * Reporte de variaciones frente al periodo anterior.
   *
   * Devuelve `null` si la IAC aún no se ha calculado: no hay nada que comparar.
   */
  getReporteVariaciones(idIac: number): Observable<ReporteVariaciones | null> {
    if (!this.simularIac) {
      return this.http.get<ReporteVariaciones>(this.RUTAS.variaciones(idIac));
    }

    const iac = this.iacs.find(i => i.id === idIac);
    const resultado = this.resultados.get(idIac);
    if (!iac || !resultado) {
      return this.simular(null);
    }

    const iacAnterior = this.iacAnteriorComparable(iac);
    const resultadoAnterior = iacAnterior ? this.resultados.get(iacAnterior.id) ?? null : null;

    return this.simular(
      generarReporteVariaciones(iac, resultado, iacAnterior, resultadoAnterior),
      600,
    );
  }

  // ===================== Archivos =====================

  /** Log de validación de un cargue, para descargarlo como `.txt`. */
  getLogValidacion(idArchivo: number): Observable<string> {
    if (!this.simularIac) {
      return this.http.get(this.RUTAS.archivoLog(idArchivo), { responseType: 'text' });
    }
    return this.simular(this.logs.get(idArchivo) ?? 'No hay log de validación disponible para este cargue.');
  }

  descargarArchivo(idArchivo: number): Observable<HttpResponse<Blob>> {
    return this.http.get(this.RUTAS.archivo(idArchivo), { observe: 'response', responseType: 'blob' });
  }

  descargarPlantilla(participante: ParticipanteIac): Observable<HttpResponse<Blob>> {
    const idPlantilla = DEFINICIONES_PLANTILLA[participante]?.idPlantilla;
    return this.http.get(`${this.RUTAS.plantilla(idPlantilla ?? 0)}/archivo`, { observe: 'response', responseType: 'blob' });
  }

  /** Indica si la descarga de archivos está disponible (requiere backend). */
  get descargasDisponibles(): boolean {
    return !this.simularIac;
  }

  // ===================== Utilidades internas =====================

  private clave(idIac: number, participante: ParticipanteIac): string {
    return `${idIac}|${participante}`;
  }

  private cargueActivo(idIac: number, participante: ParticipanteIac): CargueDeterminaciones | undefined {
    return (this.cargues.get(this.clave(idIac, participante)) ?? []).find(c => c.activo);
  }

  private activar(idIac: number, participante: ParticipanteIac, idArchivo: number): void {
    const lista = this.cargues.get(this.clave(idIac, participante)) ?? [];
    lista.forEach(c => (c.activo = c.idArchivo === idArchivo));
    this.invalidarCalculo(idIac);
  }

  /** Un cambio de insumos invalida el cálculo previo, salvo que ya se haya enviado. */
  private invalidarCalculo(idIac: number): void {
    const resultado = this.resultados.get(idIac);
    if (resultado && !resultado.enviadaAValidacion) {
      this.resultados.delete(idIac);
      const iac = this.iacs.find(i => i.id === idIac);
      if (iac && iac.estado === 'calculada') {
        iac.estado = 'borrador';
        iac.fechaCalculo = undefined;
      }
    }
  }

  private simular<T>(valor: T, ms = this.latencia): Observable<T> {
    return of(valor).pipe(delay(ms));
  }

  // ===================== Semilla de datos simulados =====================

  private construirResultado(idIac: number): ResultadoCalculoIac {
    const mhcp = this.insumosMhcp.get(idIac);
    const anh = this.cargueActivo(idIac, 'ANH')?.resumen;
    const anm = this.cargueActivo(idIac, 'ANM')?.resumen;

    const ingresosAnh = mhcp?.ingresosAnh ?? 0;
    const ingresosAnm = mhcp?.ingresosAnm ?? 0;
    const totalAnh = (anh?.totalADistribuir ?? 0) || ingresosAnh * 0.25;
    const totalAnm = (anm?.totalADistribuir ?? 0) || ingresosAnm * 0.25;

    const resumenPorEntidad = ENTIDADES_MUESTRA.map((e, i) => {
      const peso = e.peso;
      const ad20Anh = totalAnh * peso * 0.8;
      const ad5Anh = totalAnh * peso * 0.2;
      const ad20Anm = totalAnm * peso * 0.8;
      const ad5Anm = totalAnm * peso * 0.2;
      const oxr20 = i % 3 === 0 ? ad20Anh * 0.05 : 0;
      const oxr5 = i % 4 === 0 ? ad5Anh * 0.05 : 0;
      const descuentos = i % 5 === 0 ? (ad20Anh + ad20Anm) * 0.01 : 0;

      const fila: ResumenEntidadIac = {
        codigoDane: e.codigoDane,
        entidad: e.entidad,
        valorDistribuir: r2(ad20Anh + ad5Anh + ad20Anm + ad5Anm - descuentos),
        ingresosAnh: r2(ingresosAnh * peso),
        ingresosAnm: r2(ingresosAnm * peso),
        determinacionAd20: r2(ad20Anh + ad20Anm),
        determinacionAd5: r2(ad5Anh + ad5Anm),
        determinacionAd20NoAforados: r2((ad20Anh + ad20Anm) * 0.03),
        determinacionAd5NoAforados: r2((ad5Anh + ad5Anm) * 0.03),
        determinacionAd20OxrSff: r2(oxr20),
        determinacionAd5OxrSff: r2(oxr5),
        descuentos: r2(descuentos),
      };
      return fila;
    });

    const totalDistribuido = resumenPorEntidad.reduce((acc, f) => acc + f.valorDistribuir, 0);
    const fecha = new Date().toISOString();

    const avance: AvanceIac[] = [
      { concepto: 'Asignaciones Directas', presupuesto: totalDistribuido * 3.2, iac: totalDistribuido * 0.9, avance: 0.281, iacNuevoAcumulado: totalDistribuido * 1.2, avanceNuevoAcumulado: 0.375 },
      { concepto: 'Asignación para la Inversión Local', presupuesto: totalDistribuido * 1.9, iac: totalDistribuido * 0.5, avance: 0.263, iacNuevoAcumulado: totalDistribuido * 0.7, avanceNuevoAcumulado: 0.368 },
      { concepto: 'Asignación para la Inversión Regional', presupuesto: totalDistribuido * 4.1, iac: totalDistribuido * 1.1, avance: 0.268, iacNuevoAcumulado: totalDistribuido * 1.5, avanceNuevoAcumulado: 0.366 },
      { concepto: 'Ciencia, Tecnología e Innovación', presupuesto: totalDistribuido * 1.2, iac: totalDistribuido * 0.3, avance: 0.25, iacNuevoAcumulado: totalDistribuido * 0.42, avanceNuevoAcumulado: 0.35 },
      { concepto: 'Funcionamiento y Fiscalización', presupuesto: totalDistribuido * 0.24, iac: totalDistribuido * 0.06, avance: 0.25, iacNuevoAcumulado: totalDistribuido * 0.085, avanceNuevoAcumulado: 0.354 },
    ].map(a => ({ ...a, presupuesto: r2(a.presupuesto), iac: r2(a.iac), iacNuevoAcumulado: r2(a.iacNuevoAcumulado) }));

    const archivos: ArchivoIacCalculada[] = [
      { idArchivo: ++this.secuenciaArchivo, tipo: 'excel', nombre: `IAC_${idIac}_detalle.xlsx`, fechaCalculo: fecha },
      { idArchivo: ++this.secuenciaArchivo, tipo: 'xml', nombre: `IAC_${idIac}_SPGR.xml`, fechaCalculo: fecha },
    ];

    return {
      idIac,
      fechaCalculo: fecha,
      resumenPorEntidad,
      archivos,
      avance,
      enviadaAValidacion: false,
      versionParametros: 'P-v2',
    };
  }

  /** Datos de arranque para poder recorrer la pantalla sin backend. */
  private sembrarDatos(): void {
    const ahora = Date.now();
    const dias = (n: number) => new Date(ahora - n * 86_400_000).toISOString();

    this.iacs = [
      {
        id: ++this.secuenciaIac, descripcion: 'IAC corriente agosto 2026',
        idVigencia: 3, bienio: '2025 - 2026', idPeriodo: 320, periodo: '2026-08',
        idTipoIac: 1, tipoIac: 'IAC Corriente',
        ingresosHidrocarburos: 0, ingresosMineria: 0, totalIngresos: 0,
        estado: 'borrador', fechaCreacion: dias(2), usuarioCreacion: 'jperez',
      },
      {
        id: ++this.secuenciaIac, descripcion: 'IAC corriente julio 2026',
        idVigencia: 3, bienio: '2025 - 2026', idPeriodo: 319, periodo: '2026-07',
        idTipoIac: 1, tipoIac: 'IAC Corriente',
        ingresosHidrocarburos: 516_581_168_859.3, ingresosMineria: 128_940_552_311.5,
        totalIngresos: 645_521_721_170.8,
        estado: 'enviada', fechaCreacion: dias(34), usuarioCreacion: 'mruiz', fechaCalculo: dias(28),
      },
      {
        id: ++this.secuenciaIac, descripcion: 'IAC mayor recaudo junio 2026',
        idVigencia: 3, bienio: '2025 - 2026', idPeriodo: 318, periodo: '2026-06',
        idTipoIac: 2, tipoIac: 'IAC Mayor Recaudo',
        ingresosHidrocarburos: 82_140_009_444.1, ingresosMineria: 19_552_310_002.4,
        totalIngresos: 101_692_319_446.5,
        estado: 'calculada', fechaCreacion: dias(66), usuarioCreacion: 'jperez', fechaCalculo: dias(60),
      },
    ];

    // La IAC de julio (id 2) llega con todos los insumos cargados y enviada a validación.
    const idCompleta = 2;
    this.insumosMhcp.set(idCompleta, {
      noRadicado: '1-2026-000318',
      fechaRadicado: dias(33),
      ingresosAnh: 516_581_168_859.3,
      ingresosAnm: 128_940_552_311.5,
      totalIngresos: 645_521_721_170.8,
      idArchivoSoporte: ++this.secuenciaArchivo,
      nombreArchivoSoporte: 'MHCP-DNP_Radicado_1-2026-000318.pdf',
    });

    (['ANH', 'ANM', 'MME'] as ParticipanteIac[]).forEach((participante, i) => {
      const base = [129_145_292_214.9, 32_235_138_077.8, 0][i];
      const idArchivo = ++this.secuenciaArchivo;
      this.logs.set(idArchivo, `Validación simulada de ${participante} sin hallazgos.`);
      this.cargues.set(this.clave(idCompleta, participante), [{
        idArchivo,
        idValidacionMaestro: idArchivo,
        participante,
        nombreArchivo: `${participante}-DNP_Determinaciones_2026-07.xlsx`,
        fechaCargue: dias(30 - i),
        usuarioCargue: 'mruiz',
        activo: true,
        resumen: {
          descripcionDatos: participante === 'ANH' ? 'AD_ANH' : participante === 'ANM' ? 'AD_ANM' : 'AD_MME',
          validacion: 'Sin Errores',
          totalAd20: r2(base * 0.8), totalAd20NoAforado: r2(base * 0.02),
          totalAd5: r2(base * 0.2), totalAd5NoAforado: r2(base * 0.005),
          totalAd20OxrSff: r2(base * 0.03), totalAd5OxrSff: r2(base * 0.008),
          totalDescuentos: r2(base * 0.01),
          totalADistribuir: r2(base), totalADistribuirNoAforado: r2(base * 0.025),
          totalRegistros: 1163,
          fechaValidacion: dias(30 - i),
          errores: [],
        },
      }]);
    });
    this.funFisAplica.set(idCompleta, false);
    this.resultados.set(idCompleta, { ...this.construirResultado(idCompleta), enviadaAValidacion: true, fechaEnvioValidacion: dias(27) });

    // La IAC de junio (id 3) está calculada pero no enviada.
    const idCalculada = 3;
    this.insumosMhcp.set(idCalculada, {
      noRadicado: '1-2026-000274',
      fechaRadicado: dias(65),
      ingresosAnh: 82_140_009_444.1,
      ingresosAnm: 19_552_310_002.4,
      totalIngresos: 101_692_319_446.5,
      idArchivoSoporte: ++this.secuenciaArchivo,
      nombreArchivoSoporte: 'MHCP-DNP_Radicado_1-2026-000274.pdf',
    });
    (['ANH', 'ANM', 'MME'] as ParticipanteIac[]).forEach((participante, i) => {
      const base = [20_535_002_361.0, 4_888_077_500.6, 0][i];
      const idArchivo = ++this.secuenciaArchivo;
      this.logs.set(idArchivo, `Validación simulada de ${participante} sin hallazgos.`);
      this.cargues.set(this.clave(idCalculada, participante), [{
        idArchivo, idValidacionMaestro: idArchivo, participante,
        nombreArchivo: `${participante}-DNP_Determinaciones_2026-06.xlsx`,
        fechaCargue: dias(62 - i), usuarioCargue: 'jperez', activo: true,
        resumen: {
          descripcionDatos: participante === 'ANH' ? 'AD_ANH' : participante === 'ANM' ? 'AD_ANM' : 'AD_MME',
          validacion: 'Sin Errores',
          totalAd20: r2(base * 0.8), totalAd20NoAforado: r2(base * 0.02),
          totalAd5: r2(base * 0.2), totalAd5NoAforado: r2(base * 0.005),
          totalAd20OxrSff: r2(base * 0.03), totalAd5OxrSff: r2(base * 0.008),
          totalDescuentos: r2(base * 0.01),
          totalADistribuir: r2(base), totalADistribuirNoAforado: r2(base * 0.025),
          totalRegistros: 1163, fechaValidacion: dias(62 - i), errores: [],
        },
      }]);
    });
    this.funFisAplica.set(idCalculada, false);
    this.resultados.set(idCalculada, this.construirResultado(idCalculada));

    this.sembrarPeriodoAnterior(dias);
  }

  /**
   * IAC del periodo previo al de julio, para que haya contra qué comparar.
   *
   * Sin ella, ninguna IAC sembrada tendría una anterior del mismo tipo ya
   * calculada y el reporte de variaciones saldría siempre «sin referencia».
   * Se le da forma a propósito —una entidad menos y otra con caída fuerte—
   * para que el reporte muestre los tres casos: aumento, disminución y entrada
   * nueva.
   */
  private sembrarPeriodoAnterior(dias: (n: number) => string): void {
    const id = ++this.secuenciaIac;

    this.iacs.push({
      id,
      descripcion: 'IAC corriente junio 2026',
      idVigencia: 3, bienio: '2025 - 2026',
      idPeriodo: 318, periodo: '2026-06',
      idTipoIac: 1, tipoIac: 'IAC Corriente',
      ingresosHidrocarburos: 470_233_119_004.7,
      ingresosMineria: 121_004_882_115.3,
      totalIngresos: 591_238_001_120.0,
      estado: 'enviada',
      fechaCreacion: dias(66), usuarioCreacion: 'mruiz', fechaCalculo: dias(60),
    });

    this.insumosMhcp.set(id, {
      noRadicado: '1-2026-000255',
      fechaRadicado: dias(65),
      ingresosAnh: 470_233_119_004.7,
      ingresosAnm: 121_004_882_115.3,
      totalIngresos: 591_238_001_120.0,
      idArchivoSoporte: ++this.secuenciaArchivo,
      nombreArchivoSoporte: 'MHCP-DNP_Radicado_1-2026-000255.pdf',
    });

    const resultado = this.construirResultado(id);

    // Cauca no recibió en junio: en julio aparecerá como entidad nueva.
    resultado.resumenPorEntidad = resultado.resumenPorEntidad.filter(f => f.codigoDane !== '19000');

    // A Casanare se le infla el periodo anterior para que julio muestre caída.
    const casanare = resultado.resumenPorEntidad.find(f => f.codigoDane === '85000');
    if (casanare) {
      casanare.valorDistribuir = r2(casanare.valorDistribuir * 1.6);
      casanare.determinacionAd20 = r2(casanare.determinacionAd20 * 1.6);
    }

    resultado.enviadaAValidacion = true;
    resultado.fechaEnvioValidacion = dias(58);
    this.resultados.set(id, resultado);
  }
}

// ===================== Constantes de apoyo =====================

function r2(valor: number): number {
  return Math.round(valor * 100) / 100;
}

/**
 * Definición de las plantillas de determinaciones.
 *
 * Las columnas de ANH corresponden al archivo real
 * `Plantilla_Determinacion_AD_ANH_Bienio 2025_2026`. ANM y MME replican la misma
 * estructura (en el legado se leen con la misma rutina); Fun&Fis añade las
 * columnas de funcionamiento y fiscalización.
 *
 * ⚠️ Estos valores deben confirmarse contra `SGR_DIST_DetallePlantillaCargue`
 * cuando exista el backend; el endpoint `/sgr/iac/plantilla/{id}` los reemplaza.
 */
export const DEFINICIONES_PLANTILLA: Partial<Record<ParticipanteIac, DefinicionPlantilla>> = {
  ANH: {
    idPlantilla: 3, participante: 'ANH', hoja: 'AD_ANH', filaInicial: 15,
    campos: [
      { codCampo: 'CodigoHomologacionMHCP', nombreCampo: 'Código Homologación MHCP', columna: 1, tipoDatos: 'texto' },
      { codCampo: 'CodigoDepartamento', nombreCampo: 'Código Departamento', columna: 2, tipoDatos: 'texto' },
      { codCampo: 'Departamento', nombreCampo: 'Departamento', columna: 3, tipoDatos: 'texto' },
      { codCampo: 'CodigoDane', nombreCampo: 'Código DANE', columna: 4, tipoDatos: 'codigoDane' },
      { codCampo: 'Entidad', nombreCampo: 'Beneficiario', columna: 5, tipoDatos: 'texto' },
      { codCampo: 'AD20', nombreCampo: 'AD 20 %', columna: 6, tipoDatos: 'numero' },
      { codCampo: 'AD5', nombreCampo: 'AD 5 % anticipado', columna: 7, tipoDatos: 'numero' },
      { codCampo: 'AD20OxRSSF', nombreCampo: 'AD 20 % Obras por Regalías (SSF)', columna: 8, tipoDatos: 'numero' },
      { codCampo: 'AD5OxRSSF', nombreCampo: 'AD 5 % Obras por Regalías (SSF)', columna: 9, tipoDatos: 'numero' },
    ],
  },
  ANM: {
    idPlantilla: 4, participante: 'ANM', hoja: 'AD_ANM', filaInicial: 15,
    campos: [
      { codCampo: 'CodigoHomologacionMHCP', nombreCampo: 'Código Homologación MHCP', columna: 1, tipoDatos: 'texto' },
      { codCampo: 'CodigoDepartamento', nombreCampo: 'Código Departamento', columna: 2, tipoDatos: 'texto' },
      { codCampo: 'Departamento', nombreCampo: 'Departamento', columna: 3, tipoDatos: 'texto' },
      { codCampo: 'CodigoDane', nombreCampo: 'Código DANE', columna: 4, tipoDatos: 'codigoDane' },
      { codCampo: 'Entidad', nombreCampo: 'Beneficiario', columna: 5, tipoDatos: 'texto' },
      { codCampo: 'AD20', nombreCampo: 'AD 20 %', columna: 6, tipoDatos: 'numero' },
      { codCampo: 'AD5', nombreCampo: 'AD 5 % anticipado', columna: 7, tipoDatos: 'numero' },
      { codCampo: 'AD20OxRSSF', nombreCampo: 'AD 20 % Obras por Regalías (SSF)', columna: 8, tipoDatos: 'numero' },
      { codCampo: 'AD5OxRSSF', nombreCampo: 'AD 5 % Obras por Regalías (SSF)', columna: 9, tipoDatos: 'numero' },
    ],
  },
  MME: {
    idPlantilla: 5, participante: 'MME', hoja: 'AD_MME', filaInicial: 15,
    campos: [
      { codCampo: 'CodigoDane', nombreCampo: 'Código DANE', columna: 4, tipoDatos: 'codigoDane' },
      { codCampo: 'Entidad', nombreCampo: 'Beneficiario', columna: 5, tipoDatos: 'texto' },
      { codCampo: 'AD20', nombreCampo: 'AD 20 %', columna: 6, tipoDatos: 'numero' },
      { codCampo: 'AD5', nombreCampo: 'AD 5 % anticipado', columna: 7, tipoDatos: 'numero' },
      { codCampo: 'Descuentos', nombreCampo: 'Descuentos', columna: 8, tipoDatos: 'numero' },
    ],
  },
  FUNFIS: {
    idPlantilla: 6, participante: 'FUNFIS', hoja: 'FUN_FIS_Determinaciones', filaInicial: 15,
    campos: [
      { codCampo: 'CodigoDane', nombreCampo: 'Código DANE', columna: 4, tipoDatos: 'codigoDane' },
      { codCampo: 'Entidad', nombreCampo: 'Entidad', columna: 5, tipoDatos: 'texto' },
      { codCampo: 'Funcionamiento', nombreCampo: 'Funcionamiento', columna: 6, tipoDatos: 'numero' },
      { codCampo: 'Fiscalizacion', nombreCampo: 'Fiscalización', columna: 7, tipoDatos: 'numero' },
    ],
  },
};

/** Entidades de muestra para el resumen del cálculo simulado. */
const ENTIDADES_MUESTRA: Array<{ codigoDane: string; entidad: string; peso: number }> = [
  { codigoDane: '44000', entidad: 'La Guajira', peso: 0.181 },
  { codigoDane: '54000', entidad: 'Norte de Santander', peso: 0.052 },
  { codigoDane: '68000', entidad: 'Santander', peso: 0.128 },
  { codigoDane: '50000', entidad: 'Meta', peso: 0.214 },
  { codigoDane: '85000', entidad: 'Casanare', peso: 0.147 },
  { codigoDane: '81000', entidad: 'Arauca', peso: 0.063 },
  { codigoDane: '20000', entidad: 'Cesar', peso: 0.091 },
  { codigoDane: '15000', entidad: 'Boyacá', peso: 0.038 },
  { codigoDane: '76000', entidad: 'Valle del Cauca', peso: 0.021 },
  { codigoDane: '05000', entidad: 'Antioquia', peso: 0.034 },
  { codigoDane: '08000', entidad: 'Atlántico', peso: 0.017 },
  { codigoDane: '19000', entidad: 'Cauca', peso: 0.014 },
];
