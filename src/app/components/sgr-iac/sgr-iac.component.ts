import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';

import { InfoPopupComponent } from '../info-popup/info-popup.component';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import { SgrIacService } from '../../services/sgr-iac.service';
import { UserAuthService } from '../../auth/user-auth.service';
import { EstadoIac, IacResumen, OpcionCatalogo } from '../../models/sgr-iac.models';

type SeveridadTag = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

@Component({
  selector: 'app-sgr-iac',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    TagModule,
    TooltipModule,
    DialogModule,
    InputTextModule,
    Select,
    FloatLabel,
    InfoPopupComponent,
    NumberFormatPipe,
  ],
  templateUrl: './sgr-iac.component.html',
  styleUrl: './sgr-iac.component.scss',
})
export class SgrIacComponent implements OnInit {

  private iacService = inject(SgrIacService);
  private mensajes = inject(MessageService);
  private router = inject(Router);
  private auth = inject(UserAuthService);

  // Popups (Diccionario / Siglas)
  showDiccionarioPopup = false;
  showSiglasPopup = false;
  diccionarioContent = '';
  siglasContent = '';

  // Catálogos
  vigencias: OpcionCatalogo[] = [];
  periodos: OpcionCatalogo[] = [];
  tiposIac: OpcionCatalogo[] = [];

  // Filtros del listado
  filtroVigencia: OpcionCatalogo | null = null;
  filtroPeriodo: OpcionCatalogo | null = null;
  filtroEstado: { id: EstadoIac | 'todos'; label: string } | null = null;

  readonly estados: Array<{ id: EstadoIac | 'todos'; label: string }> = [
    { id: 'todos', label: 'Todos' },
    { id: 'borrador', label: 'En borrador' },
    { id: 'calculada', label: 'Calculada' },
    { id: 'enviada', label: 'Enviada a validación' },
    { id: 'anulada', label: 'Anulada' },
  ];

  // Estado de la vista
  cargando = signal(false);
  private listado = signal<IacResumen[]>([]);

  /** Listado ya filtrado; los filtros son de cliente porque el conjunto es pequeño. */
  get iacs(): IacResumen[] {
    const vigencia = this.filtroVigencia?.id ?? null;
    const periodo = this.filtroPeriodo?.id ?? null;
    const estado = this.filtroEstado && this.filtroEstado.id !== 'todos' ? this.filtroEstado.id : null;
    return this.listado().filter(i =>
      (vigencia === null || i.idVigencia === vigencia) &&
      (periodo === null || i.idPeriodo === periodo) &&
      (estado === null || i.estado === estado),
    );
  }

  // Diálogo de creación
  mostrarDialogoNueva = false;
  guardando = false;
  nuevaVigencia: OpcionCatalogo | null = null;
  nuevoPeriodo: OpcionCatalogo | null = null;
  nuevoTipo: OpcionCatalogo | null = null;
  nuevoNombre = '';
  periodosNueva: OpcionCatalogo[] = [];
  intentoGuardar = false;

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarListado();
  }

  // ===================== Carga de datos =====================

  private cargarCatalogos(): void {
    this.iacService.getVigencias().subscribe({
      next: v => { this.vigencias = v; },
      error: () => this.error('No fue posible cargar las vigencias.'),
    });
    this.iacService.getTiposIac().subscribe({
      next: t => { this.tiposIac = t; },
      error: () => this.error('No fue posible cargar los tipos de IAC.'),
    });
  }

  cargarListado(): void {
    this.cargando.set(true);
    this.iacService.getListado().subscribe({
      next: lista => {
        this.listado.set(lista);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.error('No fue posible consultar el listado de instrucciones de abono a cuenta.');
      },
    });
  }

  // ===================== Filtros =====================

  onFiltroVigenciaChange(): void {
    this.filtroPeriodo = null;
    this.periodos = [];
    if (!this.filtroVigencia) { return; }
    this.iacService.getPeriodos(this.filtroVigencia.id).subscribe({
      next: p => { this.periodos = p; },
      error: () => this.error('No fue posible cargar los periodos.'),
    });
  }

  limpiarFiltros(): void {
    this.filtroVigencia = null;
    this.filtroPeriodo = null;
    this.filtroEstado = null;
    this.periodos = [];
  }

  get hayFiltros(): boolean {
    return !!(this.filtroVigencia || this.filtroPeriodo || this.filtroEstado);
  }

  // ===================== Navegación =====================

  /**
   * Las tres acciones del legado (Ver / Cargar insumos / Calcular) llevan al
   * mismo detalle; el fragmento posiciona la pestaña correspondiente.
   */
  abrir(iac: IacResumen, seccion: 'resumen' | 'insumos' | 'calculo'): void {
    this.router.navigate(['/sgr-iac', iac.id], { queryParams: { seccion } });
  }

  // ===================== Creación =====================

  abrirDialogoNueva(): void {
    this.nuevaVigencia = this.vigencias[0] ?? null;
    this.nuevoPeriodo = null;
    this.nuevoTipo = this.tiposIac[0] ?? null;
    this.nuevoNombre = '';
    this.periodosNueva = [];
    this.intentoGuardar = false;
    this.mostrarDialogoNueva = true;
    if (this.nuevaVigencia) { this.onNuevaVigenciaChange(); }
  }

  onNuevaVigenciaChange(): void {
    this.nuevoPeriodo = null;
    this.periodosNueva = [];
    if (!this.nuevaVigencia) { return; }
    this.iacService.getPeriodos(this.nuevaVigencia.id).subscribe({
      next: p => {
        this.periodosNueva = p;
        this.sugerirNombre();
      },
      error: () => this.error('No fue posible cargar los periodos de la vigencia.'),
    });
  }

  /** Nombre sugerido, como el campo "Nombre Sugerido" del legado. */
  sugerirNombre(): void {
    if (this.nuevoNombre.trim() !== '' && this.nombreFueEditado) { return; }
    const tipo = this.nuevoTipo?.label ?? 'IAC';
    const periodo = this.nuevoPeriodo?.label ?? '';
    this.nuevoNombre = periodo ? `${tipo} ${periodo}` : tipo;
  }

  private nombreFueEditado = false;

  onNombreEditado(): void {
    this.nombreFueEditado = true;
  }

  get nombreValido(): boolean {
    return this.nuevoNombre.trim().length >= 5;
  }

  get puedeCrear(): boolean {
    return !!this.nuevaVigencia && !!this.nuevoPeriodo && !!this.nuevoTipo && this.nombreValido && !this.guardando;
  }

  crearIac(): void {
    this.intentoGuardar = true;
    if (!this.puedeCrear || !this.nuevaVigencia || !this.nuevoPeriodo || !this.nuevoTipo) { return; }

    this.guardando = true;
    this.iacService.crearIac(
      {
        nombre: this.nuevoNombre.trim(),
        idVigencia: this.nuevaVigencia.id,
        idPeriodo: this.nuevoPeriodo.id,
        idTipoIac: this.nuevoTipo.id,
      },
      this.nuevaVigencia.label,
      this.nuevoPeriodo.label,
      this.nuevoTipo.label,
      this.auth.usuario() || 'anonimo',
    ).subscribe({
      next: respuesta => {
        this.guardando = false;
        if (!respuesta.ok) {
          this.error(respuesta.mensaje);
          return;
        }
        this.mostrarDialogoNueva = false;
        this.exito(respuesta.mensaje);
        this.cargarListado();
        if (respuesta.datos) {
          this.router.navigate(['/sgr-iac', respuesta.datos.id], { queryParams: { seccion: 'insumos' } });
        }
      },
      error: () => {
        this.guardando = false;
        this.error('No fue posible crear la Instrucción de Abono a Cuenta.');
      },
    });
  }

  // ===================== Presentación =====================

  estadoLabel(estado: EstadoIac): string {
    switch (estado) {
      case 'calculada': return 'Calculada';
      case 'enviada': return 'Enviada a validación';
      case 'anulada': return 'Anulada';
      default: return 'En borrador';
    }
  }

  estadoSeverity(estado: EstadoIac): SeveridadTag {
    switch (estado) {
      case 'calculada': return 'info';
      case 'enviada': return 'success';
      case 'anulada': return 'danger';
      default: return 'warn';
    }
  }

  /** Solo las IAC en borrador admiten cargue de insumos. */
  puedeCargarInsumos(iac: IacResumen): boolean {
    return iac.estado === 'borrador' || iac.estado === 'calculada';
  }

  private exito(mensaje: string): void {
    this.mensajes.add({ severity: 'success', summary: 'Operación exitosa', detail: mensaje });
  }

  private error(mensaje: string): void {
    this.mensajes.add({ severity: 'error', summary: 'Operación no realizada', detail: mensaje });
  }

  // ===================== Popups =====================

  showPopupDiccionario(): void {
    this.diccionarioContent = this.contenidoDiccionario();
    this.showDiccionarioPopup = true;
  }

  showPopupSiglas(): void {
    this.siglasContent = this.contenidoSiglas();
    this.showSiglasPopup = true;
  }

  closeDiccionarioPopup(): void { this.showDiccionarioPopup = false; }
  closeSiglasPopup(): void { this.showSiglasPopup = false; }

  private contenidoDiccionario(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Instrucción de Abono a Cuenta</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>IAC:</strong> acto por el cual el DNP instruye el abono de los recursos del SGR a las cuentas de los beneficiarios para un periodo de recaudo.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Determinaciones:</strong> valores de asignaciones directas por beneficiario que determinan la ANH y la ANM a partir del recaudo del periodo.</li>
          <li style="margin-bottom: 0.5rem;"><strong>AD 20 % / AD 5 %:</strong> componentes de la asignación directa: 20 % del recaudo y 5 % anticipado.</li>
          <li style="margin-bottom: 0.5rem;"><strong>OxR SFF:</strong> Obras por Regalías sin situación de fondos; recursos que no se giran a la entidad sino que se ejecutan por el mecanismo de obras.</li>
          <li style="margin-bottom: 0.5rem;"><strong>No aforados:</strong> recursos que no quedaron incorporados en el presupuesto bienal y se distribuyen en bolsas.</li>
          <li style="margin-bottom: 0.5rem;"><strong>Fun&amp;Fis:</strong> funcionamiento y fiscalización; componente opcional de la IAC.</li>
        </ul>
      </div>
    `;
  }

  private contenidoSiglas(): string {
    return `
      <div style="font-size: 11px; line-height: 1.6;">
        <h4 style="margin-bottom: 1rem; color: #333;">Siglas y Abreviaciones</h4>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5rem;"><strong>SGR:</strong> Sistema General de Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>IAC:</strong> Instrucción de Abono a Cuenta</li>
          <li style="margin-bottom: 0.5rem;"><strong>MHCP:</strong> Ministerio de Hacienda y Crédito Público</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANH:</strong> Agencia Nacional de Hidrocarburos</li>
          <li style="margin-bottom: 0.5rem;"><strong>ANM:</strong> Agencia Nacional de Minería</li>
          <li style="margin-bottom: 0.5rem;"><strong>MME:</strong> Ministerio de Minas y Energía</li>
          <li style="margin-bottom: 0.5rem;"><strong>AD:</strong> Asignaciones Directas</li>
          <li style="margin-bottom: 0.5rem;"><strong>OxR:</strong> Obras por Regalías</li>
          <li style="margin-bottom: 0.5rem;"><strong>SFF / SSF:</strong> Sin Situación de Fondos</li>
          <li style="margin-bottom: 0.5rem;"><strong>SPGR:</strong> Sistema de Presupuesto y Giro de Regalías</li>
        </ul>
      </div>
    `;
  }
}
