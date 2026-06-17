import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { AccordionModule } from 'primeng/accordion';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';

// Services
import { ConfigService, FechaActualizacion, FechasReporteFuncionamiento } from '../../../../services/config.service';

interface FechaFormData {
  clave: string;
  titulo: string;
  descripcion: string;
  fecha_actualizacion: string;
  fecha_corte_recaudo?: string;
  fecha_iso_actualizacion: Date | null;
  fecha_iso_corte?: Date | null;
}

@Component({
  selector: 'app-config-fechas-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    MessageModule,
    MessagesModule,
    AccordionModule,
    DividerModule,
    TooltipModule,
    TableModule
  ],
  templateUrl: './config-fechas-form.component.html',
  styleUrl: './config-fechas-form.component.scss'
})
export class ConfigFechasFormComponent implements OnInit {
  // Forms para cada sección
  sgrVigenciaForm!: FormGroup;
  sgrPlanBienalForm!: FormGroup;
  sgpEficienciasForm!: FormGroup;
  sgpResguardosForm!: FormGroup;

  // Estado de guardado
  isSaving = signal(false);
  saveSuccess = signal(false);
  saveError = signal<string | null>(null);

  // Datos para tabla de reporte funcionamiento
  fechasReporteFuncionamiento: FechasReporteFuncionamiento[] = [];
  editingVigencia: string | null = null;

  // Meses en español para validación
  private readonly MESES_ES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.loadCurrentData();
  }

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  private initializeForms(): void {
    // Formulario SGR Vigencia Actual
    this.sgrVigenciaForm = this.fb.group({
      fecha_actualizacion: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_actualizacion: [null, Validators.required],
      fecha_corte_recaudo: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_corte: [null, Validators.required]
    });

    // Formulario SGR Plan Bienal
    this.sgrPlanBienalForm = this.fb.group({
      fecha_actualizacion: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_actualizacion: [null, Validators.required],
      fecha_corte_recaudo: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_corte: [null, Validators.required]
    });

    // Formulario SGP Eficiencias
    this.sgpEficienciasForm = this.fb.group({
      fecha_actualizacion: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_actualizacion: [null, Validators.required],
      fecha_corte_recaudo: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_corte: [null, Validators.required]
    });

    // Formulario SGP Resguardos
    this.sgpResguardosForm = this.fb.group({
      fecha_actualizacion: ['', [Validators.required, this.validarFormatoFechaTexto.bind(this)]],
      fecha_iso_actualizacion: [null, Validators.required]
    });
  }

  private loadCurrentData(): void {
    // Cargar SGR Vigencia Actual
    const sgrVigencia = this.configService.getSgrFechasActualizacionSync();
    if (sgrVigencia) {
      this.sgrVigenciaForm.patchValue({
        fecha_actualizacion: sgrVigencia.fecha_actualizacion,
        fecha_iso_actualizacion: sgrVigencia.fecha_iso_actualizacion ? new Date(sgrVigencia.fecha_iso_actualizacion) : null,
        fecha_corte_recaudo: sgrVigencia.fecha_corte_recaudo,
        fecha_iso_corte: sgrVigencia.fecha_iso_corte ? new Date(sgrVigencia.fecha_iso_corte) : null
      });
    }

    // Cargar SGR Plan Bienal
    const sgrPlanBienal = this.configService.getSgrFechasPlanBienalSync();
    if (sgrPlanBienal) {
      this.sgrPlanBienalForm.patchValue({
        fecha_actualizacion: sgrPlanBienal.fecha_actualizacion,
        fecha_iso_actualizacion: sgrPlanBienal.fecha_iso_actualizacion ? new Date(sgrPlanBienal.fecha_iso_actualizacion) : null,
        fecha_corte_recaudo: sgrPlanBienal.fecha_corte_recaudo,
        fecha_iso_corte: sgrPlanBienal.fecha_iso_corte ? new Date(sgrPlanBienal.fecha_iso_corte) : null
      });
    }

    // Cargar SGP Eficiencias
    const sgpEficiencias = this.configService.getSgpFechasEficienciasSync();
    if (sgpEficiencias) {
      this.sgpEficienciasForm.patchValue({
        fecha_actualizacion: sgpEficiencias.fecha_actualizacion,
        fecha_iso_actualizacion: sgpEficiencias.fecha_iso_actualizacion ? new Date(sgpEficiencias.fecha_iso_actualizacion) : null,
        fecha_corte_recaudo: sgpEficiencias.fecha_corte_recaudo,
        fecha_iso_corte: sgpEficiencias.fecha_iso_corte ? new Date(sgpEficiencias.fecha_iso_corte) : null
      });
    }

    // Cargar SGP Resguardos
    const sgpResguardos = this.configService.getSgpFechaResguardosSync();
    if (sgpResguardos) {
      this.sgpResguardosForm.patchValue({
        fecha_actualizacion: sgpResguardos.fecha_actualizacion,
        fecha_iso_actualizacion: sgpResguardos.fecha_iso_actualizacion ? new Date(sgpResguardos.fecha_iso_actualizacion) : null
      });
    }

    // Cargar Reporte Funcionamiento
    this.fechasReporteFuncionamiento = this.configService.getSgrFechasReporteFuncionamientoSync();
  }

  // ============================================================================
  // VALIDACIONES
  // ============================================================================

  private validarFormatoFechaTexto(control: any): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    // Formato esperado: "mes día de año" (ej: "mayo 30 de 2025")
    const regex = /^([a-z]+)\s+(\d{1,2})\s+de\s+(\d{4})$/i;
    const match = value.match(regex);

    if (!match) {
      return { formatoInvalido: true };
    }

    const [, mes, dia, anio] = match;

    // Validar que el mes esté en español
    if (!this.MESES_ES.includes(mes.toLowerCase())) {
      return { mesInvalido: true };
    }

    // Validar día (1-31)
    const diaNum = parseInt(dia, 10);
    if (diaNum < 1 || diaNum > 31) {
      return { diaInvalido: true };
    }

    // Validar año (2000-2100)
    const anioNum = parseInt(anio, 10);
    if (anioNum < 2000 || anioNum > 2100) {
      return { anioInvalido: true };
    }

    return null;
  }

  // ============================================================================
  // HELPERS PARA SINCRONIZACIÓN DE FECHAS
  // ============================================================================

  onFechaISOChange(form: FormGroup, isoField: string, textoField: string): void {
    const isoDate: Date | null = form.get(isoField)?.value;
    if (isoDate) {
      const textoFecha = this.convertirDateATextoEspanol(isoDate);
      form.patchValue({ [textoField]: textoFecha }, { emitEvent: false });
    }
  }

  onFechaTextoChange(form: FormGroup, textoField: string, isoField: string): void {
    const textoFecha: string = form.get(textoField)?.value;
    if (textoFecha) {
      const isoDate = this.convertirTextoEspanolADate(textoFecha);
      if (isoDate) {
        form.patchValue({ [isoField]: isoDate }, { emitEvent: false });
      }
    }
  }

  private convertirDateATextoEspanol(date: Date): string {
    const dia = date.getDate();
    const mes = this.MESES_ES[date.getMonth()];
    const anio = date.getFullYear();
    return `${mes} ${dia} de ${anio}`;
  }

  private convertirTextoEspanolADate(texto: string): Date | null {
    const regex = /^([a-z]+)\s+(\d{1,2})\s+de\s+(\d{4})$/i;
    const match = texto.match(regex);

    if (!match) return null;

    const [, mes, dia, anio] = match;
    const mesIndex = this.MESES_ES.indexOf(mes.toLowerCase());
    if (mesIndex === -1) return null;

    return new Date(parseInt(anio, 10), mesIndex, parseInt(dia, 10));
  }

  // ============================================================================
  // GUARDAR CONFIGURACIONES
  // ============================================================================

  guardarSgrVigencia(): void {
    if (this.sgrVigenciaForm.invalid) {
      this.markFormGroupTouched(this.sgrVigenciaForm);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const formValue = this.sgrVigenciaForm.value;
    const fechaData: FechaActualizacion = {
      fecha_actualizacion: formValue.fecha_actualizacion,
      fecha_corte_recaudo: formValue.fecha_corte_recaudo,
      fecha_iso_actualizacion: this.formatDateToISO(formValue.fecha_iso_actualizacion),
      fecha_iso_corte: this.formatDateToISO(formValue.fecha_iso_corte)
    };

    this.configService.setConfig({
      categoria: 'fechas',
      clave: 'sgr_fecha_actualizacion_vigencia_2025_2026',
      valor: JSON.stringify(fechaData),
      tipo_dato: 'json',
      descripcion: 'Fechas de actualización y corte de recaudo SGR vigencia 2025-2026'
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set('Error al guardar: ' + error.message);
      }
    });
  }

  guardarSgrPlanBienal(): void {
    if (this.sgrPlanBienalForm.invalid) {
      this.markFormGroupTouched(this.sgrPlanBienalForm);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const formValue = this.sgrPlanBienalForm.value;
    const fechaData: FechaActualizacion = {
      fecha_actualizacion: formValue.fecha_actualizacion,
      fecha_corte_recaudo: formValue.fecha_corte_recaudo,
      fecha_iso_actualizacion: this.formatDateToISO(formValue.fecha_iso_actualizacion),
      fecha_iso_corte: this.formatDateToISO(formValue.fecha_iso_corte)
    };

    this.configService.setConfig({
      categoria: 'fechas',
      clave: 'sgr_fecha_plan_bienal_2025_2026',
      valor: JSON.stringify(fechaData),
      tipo_dato: 'json',
      descripcion: 'Fechas de plan bienal SGR 2025-2026'
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set('Error al guardar: ' + error.message);
      }
    });
  }

  guardarSgpEficiencias(): void {
    if (this.sgpEficienciasForm.invalid) {
      this.markFormGroupTouched(this.sgpEficienciasForm);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const formValue = this.sgpEficienciasForm.value;
    const fechaData: FechaActualizacion = {
      fecha_actualizacion: formValue.fecha_actualizacion,
      fecha_corte_recaudo: formValue.fecha_corte_recaudo,
      fecha_iso_actualizacion: this.formatDateToISO(formValue.fecha_iso_actualizacion),
      fecha_iso_corte: this.formatDateToISO(formValue.fecha_iso_corte)
    };

    this.configService.setConfig({
      categoria: 'fechas',
      clave: 'sgp_fecha_eficiencias',
      valor: JSON.stringify(fechaData),
      tipo_dato: 'json',
      descripcion: 'Fechas para reporte de eficiencias SGP'
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set('Error al guardar: ' + error.message);
      }
    });
  }

  guardarSgpResguardos(): void {
    if (this.sgpResguardosForm.invalid) {
      this.markFormGroupTouched(this.sgpResguardosForm);
      return;
    }

    this.isSaving.set(true);
    this.saveError.set(null);

    const formValue = this.sgpResguardosForm.value;
    const fechaData: FechaActualizacion = {
      fecha_actualizacion: formValue.fecha_actualizacion,
      fecha_iso_actualizacion: this.formatDateToISO(formValue.fecha_iso_actualizacion)
    };

    this.configService.setConfig({
      categoria: 'fechas',
      clave: 'sgp_fecha_resguardos',
      valor: JSON.stringify(fechaData),
      tipo_dato: 'json',
      descripcion: 'Fecha de actualización para resguardos SGP'
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set('Error al guardar: ' + error.message);
      }
    });
  }

  guardarReporteFuncionamiento(): void {
    this.isSaving.set(true);
    this.saveError.set(null);

    this.configService.setConfig({
      categoria: 'fechas',
      clave: 'sgr_fechas_reporte_funcionamiento',
      valor: JSON.stringify(this.fechasReporteFuncionamiento),
      tipo_dato: 'json',
      descripcion: 'Diccionario completo de fechas para Reporte de Funcionamiento SGR por vigencia'
    }).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccess.set(true);
        this.editingVigencia = null;
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.saveError.set('Error al guardar: ' + error.message);
      }
    });
  }

  // ============================================================================
  // TABLA EDITABLE - REPORTE FUNCIONAMIENTO
  // ============================================================================

  onRowEditInit(vigencia: string): void {
    this.editingVigencia = vigencia;
  }

  onRowEditSave(vigencia: FechasReporteFuncionamiento): void {
    // Actualizar fecha ISO basándose en fecha texto
    const dateActualizacion = this.convertirTextoEspanolADate(vigencia.fecha_actualizacion);
    const dateCorte = this.convertirTextoEspanolADate(vigencia.fecha_corte_recaudo);

    if (dateActualizacion) {
      vigencia.fecha_iso_actualizacion = this.formatDateToISO(dateActualizacion) || '';
    }

    if (dateCorte) {
      vigencia.fecha_iso_corte = this.formatDateToISO(dateCorte) || '';
    }

    this.editingVigencia = null;
  }

  onRowEditCancel(vigencia: FechasReporteFuncionamiento, index: number): void {
    // Recargar datos originales
    this.fechasReporteFuncionamiento = this.configService.getSgrFechasReporteFuncionamientoSync();
    this.editingVigencia = null;
  }

  // ============================================================================
  // UTILIDADES
  // ============================================================================

  private formatDateToISO(date: Date | null): string | undefined {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters para acceso en template
  get sgrVigencia() {
    return this.sgrVigenciaForm.controls;
  }

  get sgrPlanBienal() {
    return this.sgrPlanBienalForm.controls;
  }

  get sgpEficiencias() {
    return this.sgpEficienciasForm.controls;
  }

  get sgpResguardos() {
    return this.sgpResguardosForm.controls;
  }
}
