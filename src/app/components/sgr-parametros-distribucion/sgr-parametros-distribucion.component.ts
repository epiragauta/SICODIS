import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { Breadcrumb } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import {
  SicodisApiService,
  ConjuntoParametros,
  ParametroValor,
  ConfigRedondeo
} from '../../services/sicodis-api.service';

/**
 * Resultado de una regla de validación dura sobre el conjunto de parámetros.
 */
interface Validacion {
  clave: string;
  etiqueta: string;
  esperado: string;
  actual: string;
  ok: boolean;
}

@Component({
  selector: 'app-sgr-parametros-distribucion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ButtonModule,
    CardModule,
    TableModule,
    TooltipModule,
    Select,
    FloatLabel,
    Breadcrumb
  ],
  templateUrl: './sgr-parametros-distribucion.component.html',
  styleUrl: './sgr-parametros-distribucion.component.scss'
})
export class SgrParametrosDistribucionComponent implements OnInit {

  items: MenuItem[] | undefined;
  home: MenuItem | undefined;

  // Filtros
  selectedBienio: any = { id: 1, label: '2027 - 2028' };
  bienios: any[] = [
    { id: 1, label: '2027 - 2028' },
    { id: 2, label: '2025 - 2026' },
    { id: 3, label: '2023 - 2024' }
  ];

  /** Perfil administrador (simulado). */
  esAdministrador = true;

  /** Mock mientras no exista el backend `sgrdistribucion/parametros/*`. */
  private readonly simularParametros = true;

  // Conjunto editable (clon de la versión vigente) y su base para restaurar
  conjunto: ConjuntoParametros | null = null;
  baseVigente: ConjuntoParametros | null = null;

  // Nueva versión
  nuevoMotivo = '';

  // Validaciones duras
  validaciones: Validacion[] = [];

  // Estado
  guardando = false;
  guardadoOk = false;
  versionGuardada = '';

  // Opciones de redondeo
  readonly decimalesOpts = [0, 2];
  readonly modoOpts: Array<'redondeo' | 'truncamiento'> = ['redondeo', 'truncamiento'];

  constructor(private sicodisApiService: SicodisApiService) { }

  ngOnInit(): void {
    this.items = [
      { label: 'SGR', routerLink: '/sgr-inicio' },
      { label: 'Distribución' },
      { label: 'Parámetros de cálculo' }
    ];
    this.home = { icon: 'pi pi-home', routerLink: '/' };
    this.cargar();
  }

  onBienioChange(): void {
    this.cargar();
  }

  private cargar(): void {
    this.guardadoOk = false;
    if (this.simularParametros) {
      this.baseVigente = this.parametrosMock(this.selectedBienio);
      this.conjunto = this.clonar(this.baseVigente);
      this.nuevoMotivo = '';
      this.recalcular();
      return;
    }
    this.sicodisApiService.getParametrosVigentesSgr(this.selectedBienio?.id).subscribe({
      next: (c) => {
        this.baseVigente = c;
        this.conjunto = this.clonar(c);
        this.nuevoMotivo = '';
        this.recalcular();
      },
      error: (error) => {
        console.error('Error al cargar parámetros:', error);
        this.conjunto = null;
      }
    });
  }

  restaurar(): void {
    if (this.baseVigente) {
      this.conjunto = this.clonar(this.baseVigente);
      this.nuevoMotivo = '';
      this.guardadoOk = false;
      this.recalcular();
    }
  }

  // ===================== Helpers de acceso =====================

  private valor(grupo: ParametroValor[], clave: string): number {
    const p = grupo.find(x => x.clave === clave);
    return p && typeof p.valor === 'number' ? p.valor : 0;
  }

  private suma(grupo: ParametroValor[], claves: string[]): number {
    return claves.reduce((acc, c) => acc + this.valor(grupo, c), 0);
  }

  /** Redondeo a 4 decimales para comparaciones tolerantes de punto flotante. */
  private r4(n: number): number {
    return Math.round(n * 10000) / 10000;
  }

  private aprox(a: number, b: number): boolean {
    return Math.abs(this.r4(a) - this.r4(b)) < 0.001;
  }

  private fmt(n: number): string {
    return this.r4(n).toLocaleString('es-CO', { maximumFractionDigits: 4 });
  }

  // ===================== Validaciones duras =====================

  recalcular(): void {
    if (!this.conjunto) { this.validaciones = []; return; }
    const P = this.conjunto.porcentajes;
    const B = this.conjunto.ponderadores;
    const U = this.conjunto.umbrales;

    const v: Validacion[] = [];

    // 1. Total principal = 100
    const totalPrincipal = this.suma(P, ['inversion', 'ahorro', 'administracion']);
    v.push(this.regla('total', 'Inversión + Ahorro + Administración = 100%', 100, totalPrincipal, '%'));

    // 2-4. Sub-repartos cuadran con su nivel
    const subInv = this.suma(P, ['inversion.ad', 'inversion.ail', 'inversion.air', 'inversion.acti', 'inversion.paz', 'inversion.ambiental', 'inversion.cormagdalena']);
    v.push(this.regla('sub.inv', 'Componentes de Inversión = Inversión', this.valor(P, 'inversion'), subInv, '%'));
    const subAho = this.suma(P, ['ahorro.fae', 'ahorro.fonpet']);
    v.push(this.regla('sub.aho', 'Componentes de Ahorro (FAE + FONPET) = Ahorro', this.valor(P, 'ahorro'), subAho, '%'));
    const subAdm = this.suma(P, ['administracion.funcionamiento', 'administracion.ssec']);
    v.push(this.regla('sub.adm', 'Componentes de Administración = Administración', this.valor(P, 'administracion'), subAdm, '%'));

    // 5-9. Ponderadores suman 1
    v.push(this.regla('pond.ail', 'Ponderadores AIL (NBI + Población) = 1', 1, this.suma(B, ['ail.nbi', 'ail.poblacion']), 'factor'));
    v.push(this.regla('pond.air', 'Ponderadores AIR (NBI + Población + Desempleo) = 1', 1, this.suma(B, ['air.nbi', 'air.poblacion', 'air.desempleo']), 'factor'));
    v.push(this.regla('pond.airpart', 'Partición AIR (departamentos + regiones) = 1', 1, this.suma(B, ['air.particion.dptos', 'air.particion.regiones']), 'factor'));
    v.push(this.regla('pond.fonpet', 'Ponderadores FONPET (PPNC + NBI + Población) = 1', 1, this.suma(B, ['fonpet.ppnc', 'fonpet.nbi', 'fonpet.poblacion']), 'factor'));
    v.push(this.regla('pond.etnico', 'Ponderadores étnicos (urbano + rural) = 1', 1, this.suma(B, ['etnico.urbano', 'etnico.rural']), 'factor'));

    // 10. No aforados 100
    v.push(this.regla('noaforados', 'No aforados (corriente + restante) = 100%', 100, this.suma(U, ['noaforados.corriente', 'noaforados.restante']), '%'));

    // 11. Rangos válidos
    const rangoOk = this.rangosValidos();
    v.push({ clave: 'rangos', etiqueta: 'Rangos válidos (% en 0–100, factores en 0–1)', esperado: 'todos', actual: rangoOk ? 'ok' : 'fuera de rango', ok: rangoOk });

    // 12. Redondeo decimales ∈ {0,2}
    const redOk = this.conjunto.redondeo.every(r => r.decimales === 0 || r.decimales === 2);
    v.push({ clave: 'redondeo', etiqueta: 'Decimales de redondeo ∈ {0, 2}', esperado: '{0, 2}', actual: redOk ? 'ok' : 'inválido', ok: redOk });

    this.validaciones = v;
  }

  private regla(clave: string, etiqueta: string, esperado: number, actual: number, unidad: '%' | 'factor'): Validacion {
    const suf = unidad === '%' ? '%' : '';
    return {
      clave, etiqueta,
      esperado: this.fmt(esperado) + suf,
      actual: this.fmt(actual) + suf,
      ok: this.aprox(esperado, actual)
    };
  }

  private rangosValidos(): boolean {
    if (!this.conjunto) { return false; }
    const pctOk = [...this.conjunto.porcentajes, ...this.conjunto.umbrales]
      .filter(p => p.unidad === '%' || p.unidad === 'pp')
      .every(p => typeof p.valor === 'number' && p.valor >= 0 && p.valor <= 100);
    const facOk = this.conjunto.ponderadores
      .every(p => typeof p.valor === 'number' && p.valor >= 0 && p.valor <= 1);
    return pctOk && facOk;
  }

  get todoValido(): boolean {
    return this.validaciones.length > 0 && this.validaciones.every(v => v.ok);
  }

  get motivoValido(): boolean {
    return this.nuevoMotivo.trim().length >= 5;
  }

  get puedeGuardar(): boolean {
    return this.esAdministrador && this.todoValido && this.motivoValido && !this.guardando;
  }

  get validacionesOk(): number {
    return this.validaciones.filter(v => v.ok).length;
  }

  // ===================== Guardar nueva versión =====================

  guardar(): void {
    if (!this.puedeGuardar || !this.conjunto) { return; }

    const proximaVersion = (this.baseVigente?.idVersion ?? 0) + 1;
    const nueva: ConjuntoParametros = {
      ...this.clonar(this.conjunto),
      idVersion: proximaVersion,
      etiquetaVersion: `P-v${proximaVersion}`,
      vigencia: this.selectedBienio?.label,
      fecha: new Date().toISOString(),
      autor: 'admin',
      motivo: this.nuevoMotivo.trim()
    };

    this.guardando = true;
    if (this.simularParametros) {
      this.baseVigente = this.clonar(nueva);
      this.conjunto = this.clonar(nueva);
      this.versionGuardada = nueva.etiquetaVersion;
      this.guardadoOk = true;
      this.guardando = false;
      this.nuevoMotivo = '';
      return;
    }
    this.sicodisApiService.guardarParametrosSgr(nueva).subscribe({
      next: (persistida) => {
        this.baseVigente = this.clonar(persistida);
        this.conjunto = this.clonar(persistida);
        this.versionGuardada = persistida.etiquetaVersion;
        this.guardadoOk = true;
        this.guardando = false;
        this.nuevoMotivo = '';
      },
      error: (error) => {
        console.error('Error al guardar parámetros:', error);
        this.guardando = false;
      }
    });
  }

  // ===================== Utilidades =====================

  onValorCambio(): void {
    this.guardadoOk = false;
    this.recalcular();
  }

  private clonar(c: ConjuntoParametros): ConjuntoParametros {
    return JSON.parse(JSON.stringify(c));
  }

  modoLabel(modo: 'redondeo' | 'truncamiento'): string {
    return modo === 'redondeo' ? 'Redondeo' : 'Truncamiento';
  }

  esFlag(p: ParametroValor): boolean {
    return p.unidad === 'flag';
  }

  // ===================== Mock =====================

  private parametrosMock(bienio: any): ConjuntoParametros {
    const pct = (clave: string, etiqueta: string, valor: number, ref?: string): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: '%', referenciaNormativa: ref });
    const fac = (clave: string, etiqueta: string, valor: number): ParametroValor =>
      ({ clave, etiqueta, valor, unidad: 'factor' });
    const red = (tipoSalida: ConfigRedondeo['tipoSalida'], etiqueta: string, decimales: 0 | 2): ConfigRedondeo =>
      ({ tipoSalida, etiqueta, decimales, modo: 'redondeo' });

    return {
      idVersion: 2,
      etiquetaVersion: 'P-v2',
      vigencia: bienio?.label ?? '',
      fecha: '2026-08-12T00:00:00',
      autor: 'admin',
      motivo: 'Parámetros de referencia tabla 2 · Ley 2056 de 2020',
      porcentajes: [
        pct('inversion', 'Inversión', 92.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('inversion.ad', '— Asignaciones Directas (20% + 5%)', 25, 'Arts. 22 y 23 L2056'),
        pct('inversion.ail', '— Asignación Inversión Local', 15, 'Art. 48 L2056'),
        pct('inversion.air', '— Asignación Inversión Regional', 34, 'Arts. 44 y 45 L2056'),
        pct('inversion.acti', '— Ciencia, Tecnología e Innovación', 10, 'Art. 52 L2056'),
        pct('inversion.paz', '— Asignación para la Paz', 7, 'Parág. 7.º trans. art. 361 C.P.'),
        pct('inversion.ambiental', '— Asignación Ambiental', 1, 'Art. 50 L2056'),
        pct('inversion.cormagdalena', '— Cormagdalena', 0.5, 'Art. 331 C.P.'),
        pct('ahorro', 'Ahorro', 4.5, 'Art. 361 C.P. · art. 22 L2056'),
        pct('ahorro.fae', '— FAE (referencia)', 2.25, 'Art. 113 L2056'),
        pct('ahorro.fonpet', '— FONPET (referencia)', 2.25, 'Art. 122 L2056'),
        pct('administracion', 'Administración', 3, 'Art. 361 C.P. · art. 22 L2056'),
        pct('administracion.funcionamiento', '— Funcionamiento y fiscalización', 2, 'Art. 12 L2056'),
        pct('administracion.ssec', '— SSEC (CGR · PGN · DNP)', 1, 'Art. 167 L2056')
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
        fac('etnico.rural', 'Étnico · Ponderador rural', 0.6)
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
        { clave: 'etnico.excluir.indeterminados', etiqueta: 'Excluir indeterminados de la base étnica', valor: true, unidad: 'flag' }
      ],
      redondeo: [
        red('PR', 'Plan de Recursos (decenal)', 0),
        red('desahorroFAE', 'Desahorro FAE', 0),
        red('mayorRecaudo', 'Mayor recaudo', 0),
        red('multas', 'Multas', 0),
        red('etnicas', 'Destinaciones étnicas', 0),
        red('PBC', 'Plan Bienal de Caja', 2),
        red('IAC', 'IAC (límite SPGR)', 2)
      ]
    };
  }
}
