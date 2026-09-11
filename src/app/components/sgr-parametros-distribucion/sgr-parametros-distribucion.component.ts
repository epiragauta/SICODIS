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
  ConjuntoParametros,
  ParametroValor
} from '../../services/sicodis-api.service';
import { SgrParametrosService } from '../../services/sgr-parametros.service';

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

  constructor(private sgrParametrosService: SgrParametrosService) { }

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
    this.sgrParametrosService.getVigentes(this.selectedBienio?.id, this.selectedBienio?.label).subscribe({
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
    this.sgrParametrosService.guardar(nueva).subscribe({
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

}
