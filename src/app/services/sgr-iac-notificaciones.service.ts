import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of } from 'rxjs';

import {
  ContactoEntidad,
  DestinatarioLote,
  IacResumen,
  LoteNotificacion,
  ReporteVariaciones,
  RespuestaIac,
  ResumenEntidadIac,
} from '../models/sgr-iac.models';

/**
 * Notificación masiva a las entidades territoriales beneficiarias de una IAC.
 *
 * Sustituye a `Aspx/EnviarNotificacionesMail.aspx` del sistema anterior, que
 * recorría la lista y enviaba uno por uno desde el hilo de la petición, sin
 * registrar el resultado: si un correo fallaba, rompía el bucle y no quedaba
 * rastro de a quién le había llegado.
 *
 * Aquí el envío es un **lote** con estado por destinatario, reintento de los
 * fallidos e histórico. Mientras no exista el backend, `simularEnvio = true`
 * mantiene todo en memoria.
 *
 * ⚠️ El envío real **debe** ejecutarse en el servidor, como trabajo en segundo
 * plano: son del orden de mil correos con adjunto por entidad. El front solo
 * prepara el lote, lo dispara y consulta su avance.
 */
@Injectable({ providedIn: 'root' })
export class SgrIacNotificacionesService {

  private http = inject(HttpClient);

  /** Poner en `false` cuando exista el backend de notificaciones. */
  private readonly simularEnvio = true;

  private readonly base = '/api/sgr/iac';

  private readonly RUTAS = {
    directorio: () => `${this.base}/directorio-entidades`,
    lotes: (idIac: number) => `${this.base}/${idIac}/notificaciones`,
    crearLote: (idIac: number) => `${this.base}/${idIac}/notificaciones`,
    enviarLote: (idIac: number, idLote: number) => `${this.base}/${idIac}/notificaciones/${idLote}/enviar`,
    estadoLote: (idIac: number, idLote: number) => `${this.base}/${idIac}/notificaciones/${idLote}`,
    reintentar: (idIac: number, idLote: number) => `${this.base}/${idIac}/notificaciones/${idLote}/reintentar`,
    cancelar: (idIac: number, idLote: number) => `${this.base}/${idIac}/notificaciones/${idLote}/cancelar`,
    previsualizar: (idIac: number) => `${this.base}/${idIac}/notificaciones/previsualizar`,
  };

  private readonly latencia = 300;

  // ===================== Estado simulado =====================

  private lotes = new Map<number, LoteNotificacion[]>();   // idIac → lotes
  private secuenciaLote = 0;

  /**
   * Borrador del mensaje por IAC.
   *
   * La pestaña de notificaciones se desmonta al cambiar de sección, así que el
   * texto redactado tiene que sobrevivir fuera del componente: perder un correo
   * a medio escribir por pulsar «Cálculo» sería inaceptable.
   */
  private borradores = new Map<number, BorradorMensaje>();

  /** Plantilla de arranque, editable por el usuario antes de enviar. */
  readonly asuntoPorDefecto = 'IAC {{periodo}} — {{tipoIac}} — {{entidad}}';

  readonly cuerpoPorDefecto = `<p>Señor(a) <strong>{{contacto}}</strong><br />{{cargo}}<br />{{entidad}}</p>

<p>El Departamento Nacional de Planeación informa que se calculó la
<strong>{{descripcionIac}}</strong> correspondiente al periodo de recaudo
<strong>{{periodo}}</strong>.</p>

<p>El valor a abonar a la cuenta de su entidad es de
<strong>{{valorDistribuir}}</strong>, con una variación de
<strong>{{variacionPesos}}</strong> ({{variacionPorcentaje}}) frente al periodo
anterior.</p>

<p>En el archivo adjunto encontrará el detalle de los conceptos que componen
ese valor.</p>

<p>Cordialmente,<br />
Grupo de Financiamiento Territorial<br />
Dirección de Descentralización y Desarrollo Regional — DNP</p>`;

  // ===================== Borrador del mensaje =====================

  getBorrador(idIac: number): BorradorMensaje {
    const guardado = this.borradores.get(idIac);
    return guardado
      ? { ...guardado }
      : { asunto: this.asuntoPorDefecto, cuerpo: this.cuerpoPorDefecto, adjuntarDetalle: true };
  }

  guardarBorrador(idIac: number, borrador: BorradorMensaje): void {
    this.borradores.set(idIac, { ...borrador });
  }

  // ===================== Directorio =====================

  /**
   * Directorio de contactos de entidades territoriales.
   *
   * En el sistema anterior es `Adm_DirectorioEntidadesTerritoriales`.
   */
  getDirectorio(): Observable<ContactoEntidad[]> {
    if (!this.simularEnvio) { return this.http.get<ContactoEntidad[]>(this.RUTAS.directorio()); }
    return this.simular(DIRECTORIO_MUESTRA.map(c => ({ ...c })));
  }

  // ===================== Preparación del lote =====================

  /**
   * Cruza los beneficiarios de la IAC con el directorio.
   *
   * Solo entran las entidades con valor a distribuir; las que no tienen
   * contacto registrado se incluyen marcadas como `sin_correo` para que el
   * problema sea visible y no un silencio.
   */
  prepararDestinatarios(
    resumenPorEntidad: ResumenEntidadIac[],
    directorio: ContactoEntidad[],
    variaciones: ReporteVariaciones | null,
  ): DestinatarioLote[] {

    const contactos = new Map(directorio.map(c => [c.codigoDane, c]));
    const varsPorCodigo = new Map(
      (variaciones?.porEntidad ?? []).map(v => [v.codigoDane, v]),
    );

    return resumenPorEntidad
      .filter(fila => fila.valorDistribuir > 0)
      .map(fila => {
        const contacto = contactos.get(fila.codigoDane);
        const variacion = varsPorCodigo.get(fila.codigoDane);

        return {
          codigoDane: fila.codigoDane,
          entidad: fila.entidad,
          nombreContacto: contacto?.nombreContacto ?? '',
          cargo: contacto?.cargo ?? '',
          email: contacto?.email ?? '',
          valorDistribuir: fila.valorDistribuir,
          variacionPesos: variacion?.total.variacionPesos,
          variacionPorcentaje: variacion?.total.variacionPorcentaje ?? null,
          estado: contacto?.email ? 'pendiente' : 'sin_correo',
          intentos: 0,
        } as DestinatarioLote;
      })
      .sort((a, b) => a.entidad.localeCompare(b.entidad, 'es'));
  }

  crearLote(
    iac: IacResumen,
    asunto: string,
    plantillaCuerpo: string,
    adjuntarDetalle: boolean,
    destinatarios: DestinatarioLote[],
    usuario: string,
  ): Observable<RespuestaIac<LoteNotificacion>> {

    if (!this.simularEnvio) {
      return this.http.post<RespuestaIac<LoteNotificacion>>(
        this.RUTAS.crearLote(iac.id),
        { asunto, plantillaCuerpo, adjuntarDetalle, destinatarios },
      );
    }

    const conCorreo = destinatarios.filter(d => d.estado !== 'sin_correo');
    if (conCorreo.length === 0) {
      return this.simular({
        ok: false,
        mensaje: 'Ninguno de los beneficiarios tiene correo registrado en el directorio de entidades territoriales.',
      });
    }

    const lote: LoteNotificacion = {
      id: ++this.secuenciaLote,
      idIac: iac.id,
      asunto,
      plantillaCuerpo,
      adjuntarDetalle,
      estado: 'borrador',
      fechaCreacion: new Date().toISOString(),
      usuarioCreacion: usuario,
      destinatarios: destinatarios.map(d => ({ ...d })),
      totales: {
        destinatarios: destinatarios.length,
        enviados: 0,
        fallidos: 0,
        sinCorreo: destinatarios.length - conCorreo.length,
      },
    };

    const lista = this.lotes.get(iac.id) ?? [];
    lista.push(lote);
    this.lotes.set(iac.id, lista);

    return this.simular({
      ok: true,
      mensaje: `Lote preparado con ${conCorreo.length} destinatarios.`,
      datos: this.clonar(lote),
    });
  }

  // ===================== Envío =====================

  /**
   * Dispara el envío del lote.
   *
   * En simulación resuelve destinatario a destinatario con una tasa de fallo
   * pequeña, para que la pantalla de seguimiento y el reintento se puedan
   * probar de verdad. Contra el backend, esta llamada solo encola el trabajo y
   * el avance se consulta con `getLote()`.
   */
  enviarLote(idIac: number, idLote: number): Observable<RespuestaIac<LoteNotificacion>> {
    if (!this.simularEnvio) {
      return this.http.post<RespuestaIac<LoteNotificacion>>(this.RUTAS.enviarLote(idIac, idLote), {});
    }

    const lote = this.buscarLote(idIac, idLote);
    if (!lote) {
      return this.simular({ ok: false, mensaje: 'No se encontró el lote de notificaciones.' });
    }
    if (lote.estado === 'enviando') {
      return this.simular({ ok: false, mensaje: 'El lote ya se está enviando.' });
    }

    lote.estado = 'enviando';
    lote.fechaEnvio = new Date().toISOString();
    this.resolverEnvios(lote);

    return this.simular({
      ok: true,
      mensaje: this.mensajeCierre(lote),
      datos: this.clonar(lote),
    }, 1200);
  }

  /** Reintenta únicamente los destinatarios fallidos. */
  reintentarFallidos(idIac: number, idLote: number): Observable<RespuestaIac<LoteNotificacion>> {
    if (!this.simularEnvio) {
      return this.http.post<RespuestaIac<LoteNotificacion>>(this.RUTAS.reintentar(idIac, idLote), {});
    }

    const lote = this.buscarLote(idIac, idLote);
    if (!lote) {
      return this.simular({ ok: false, mensaje: 'No se encontró el lote de notificaciones.' });
    }

    const fallidos = lote.destinatarios.filter(d => d.estado === 'fallido');
    if (fallidos.length === 0) {
      return this.simular({ ok: false, mensaje: 'El lote no tiene destinatarios fallidos por reintentar.' });
    }

    fallidos.forEach(d => { d.estado = 'pendiente'; d.error = undefined; });
    lote.estado = 'enviando';
    this.resolverEnvios(lote);

    return this.simular({
      ok: true,
      mensaje: this.mensajeCierre(lote),
      datos: this.clonar(lote),
    }, 900);
  }

  getLotes(idIac: number): Observable<LoteNotificacion[]> {
    if (!this.simularEnvio) { return this.http.get<LoteNotificacion[]>(this.RUTAS.lotes(idIac)); }
    return this.simular([...(this.lotes.get(idIac) ?? [])].map(l => this.clonar(l)).reverse());
  }

  getLote(idIac: number, idLote: number): Observable<LoteNotificacion | null> {
    if (!this.simularEnvio) { return this.http.get<LoteNotificacion>(this.RUTAS.estadoLote(idIac, idLote)); }
    const lote = this.buscarLote(idIac, idLote);
    return this.simular(lote ? this.clonar(lote) : null);
  }

  // ===================== Plantilla =====================

  /**
   * Resuelve los marcadores `{{...}}` de la plantilla para un destinatario.
   *
   * Es lo que convierte un envío masivo en un correo con la información de cada
   * entidad, y lo que alimenta la vista previa.
   */
  resolverPlantilla(texto: string, destinatario: DestinatarioLote, iac: IacResumen): string {
    const pesos = (valor: number | undefined): string =>
      valor === undefined
        ? 'no disponible'
        : valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

    const porcentaje = (valor: number | null | undefined): string =>
      valor === null || valor === undefined
        ? 'sin referencia anterior'
        : (valor * 100).toFixed(2).replace('.', ',') + ' %';

    const valores: Record<string, string> = {
      '{{entidad}}': destinatario.entidad,
      '{{codigoDane}}': destinatario.codigoDane,
      '{{contacto}}': destinatario.nombreContacto || 'responsable',
      '{{cargo}}': destinatario.cargo,
      '{{valorDistribuir}}': pesos(destinatario.valorDistribuir),
      '{{variacionPesos}}': pesos(destinatario.variacionPesos),
      '{{variacionPorcentaje}}': porcentaje(destinatario.variacionPorcentaje),
      '{{periodo}}': iac.periodo,
      '{{tipoIac}}': iac.tipoIac,
      '{{descripcionIac}}': iac.descripcion,
    };

    return Object.entries(valores).reduce(
      (acc, [marcador, valor]) => acc.split(marcador).join(valor),
      texto,
    );
  }

  /** Marcadores usados en un texto que no están soportados. */
  marcadoresDesconocidos(texto: string, admitidos: readonly string[]): string[] {
    const encontrados = texto.match(/\{\{[^}]*\}\}/g) ?? [];
    return [...new Set(encontrados.filter(m => !admitidos.includes(m)))];
  }

  // ===================== Utilidades internas =====================

  private buscarLote(idIac: number, idLote: number): LoteNotificacion | undefined {
    return (this.lotes.get(idIac) ?? []).find(l => l.id === idLote);
  }

  /**
   * Resuelve el estado final de cada destinatario pendiente.
   *
   * La tasa de fallo simulada (~6 %) existe para que el seguimiento y el
   * reintento sean visibles; con todo en verde no se podría comprobar nada.
   */
  private resolverEnvios(lote: LoteNotificacion): void {
    const ahora = new Date().toISOString();

    for (const destinatario of lote.destinatarios) {
      if (destinatario.estado !== 'pendiente') { continue; }

      destinatario.intentos++;
      const falla = this.fallaSimulada(destinatario);

      if (falla) {
        destinatario.estado = 'fallido';
        destinatario.error = falla;
      } else {
        destinatario.estado = 'enviado';
        destinatario.fechaEnvio = ahora;
        destinatario.error = undefined;
      }
    }

    lote.totales.enviados = lote.destinatarios.filter(d => d.estado === 'enviado').length;
    lote.totales.fallidos = lote.destinatarios.filter(d => d.estado === 'fallido').length;
    lote.estado = lote.totales.fallidos > 0 ? 'completado_con_errores' : 'completado';
  }

  /** Determinista por código y número de intento: el reintento puede prosperar. */
  private fallaSimulada(destinatario: DestinatarioLote): string | null {
    const semilla = [...destinatario.codigoDane].reduce((a, c) => a + c.charCodeAt(0), 0);
    const falla = (semilla + destinatario.intentos * 7) % 17 === 0;
    if (!falla) { return null; }

    return semilla % 2 === 0
      ? 'El servidor de correo rechazó el destinatario (buzón inexistente).'
      : 'Tiempo de espera agotado al conectar con el servidor de correo.';
  }

  private mensajeCierre(lote: LoteNotificacion): string {
    const { enviados, fallidos, sinCorreo } = lote.totales;
    const partes = [`${enviados} correos enviados`];
    if (fallidos > 0) { partes.push(`${fallidos} fallidos`); }
    if (sinCorreo > 0) { partes.push(`${sinCorreo} sin correo registrado`); }
    return partes.join(' · ') + '.';
  }

  private clonar(lote: LoteNotificacion): LoteNotificacion {
    return JSON.parse(JSON.stringify(lote)) as LoteNotificacion;
  }

  private simular<T>(valor: T, ms = this.latencia): Observable<T> {
    return of(valor).pipe(delay(ms));
  }
}

/** Mensaje en preparación, antes de convertirse en lote. */
export interface BorradorMensaje {
  asunto: string;
  cuerpo: string;
  adjuntarDetalle: boolean;
}

/**
 * Directorio de muestra.
 *
 * Cubre los departamentos del resumen simulado del cálculo, y deja dos
 * entidades sin contacto a propósito para poder ver cómo se comporta la
 * pantalla cuando el directorio está incompleto.
 */
const DIRECTORIO_MUESTRA: ContactoEntidad[] = [
  { codigoDane: '44000', entidad: 'La Guajira', departamento: 'La Guajira', nombreContacto: 'María Fernanda Ospina', cargo: 'Secretaria de Hacienda', email: 'hacienda@laguajira.gov.co' },
  { codigoDane: '54000', entidad: 'Norte de Santander', departamento: 'Norte de Santander', nombreContacto: 'Jorge Enrique Mora', cargo: 'Secretario de Hacienda', email: 'hacienda@nortedesantander.gov.co' },
  { codigoDane: '68000', entidad: 'Santander', departamento: 'Santander', nombreContacto: 'Claudia Patricia Rueda', cargo: 'Secretaria de Hacienda', email: 'hacienda@santander.gov.co' },
  { codigoDane: '50000', entidad: 'Meta', departamento: 'Meta', nombreContacto: 'Andrés Felipe Gutiérrez', cargo: 'Secretario de Hacienda', email: 'hacienda@meta.gov.co' },
  { codigoDane: '85000', entidad: 'Casanare', departamento: 'Casanare', nombreContacto: 'Diana Marcela Ruiz', cargo: 'Secretaria de Hacienda', email: 'hacienda@casanare.gov.co' },
  { codigoDane: '81000', entidad: 'Arauca', departamento: 'Arauca', nombreContacto: 'Óscar Iván Delgado', cargo: 'Secretario de Hacienda', email: 'hacienda@arauca.gov.co' },
  { codigoDane: '20000', entidad: 'Cesar', departamento: 'Cesar', nombreContacto: 'Luz Adriana Peña', cargo: 'Secretaria de Hacienda', email: 'hacienda@cesar.gov.co' },
  { codigoDane: '15000', entidad: 'Boyacá', departamento: 'Boyacá', nombreContacto: 'Carlos Alberto Niño', cargo: 'Secretario de Hacienda', email: 'hacienda@boyaca.gov.co' },
  { codigoDane: '76000', entidad: 'Valle del Cauca', departamento: 'Valle del Cauca', nombreContacto: 'Sandra Milena Caicedo', cargo: 'Secretaria de Hacienda', email: 'hacienda@valledelcauca.gov.co' },
  { codigoDane: '05000', entidad: 'Antioquia', departamento: 'Antioquia', nombreContacto: 'Juan Pablo Restrepo', cargo: 'Secretario de Hacienda', email: 'hacienda@antioquia.gov.co' },
  // 08000 (Atlántico) y 19000 (Cauca) quedan deliberadamente fuera del
  // directorio: aparecerán como «sin correo registrado».
];
