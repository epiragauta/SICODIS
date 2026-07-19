import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

import { ConfigService, BannerConfig, BannerTrackingState } from '../../../../services/config.service';

interface BannerTipo {
  label: string;
  value: 'info' | 'warning' | 'success' | 'error';
  icon: string;
  color: string;
}

@Component({
  selector: 'app-config-banner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    ButtonModule,
    DividerModule,
    MessageModule,
    DialogModule
  ],
  templateUrl: './config-banner.component.html',
  styleUrls: ['./config-banner.component.scss']
})
export class ConfigBannerComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  bannerForm!: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);

  // Preview
  showPreview = signal(false);
  previewConfig = signal<BannerConfig | null>(null);

  // Tracking state
  trackingState = signal<BannerTrackingState | null>(null);

  // Opciones de tipo de banner
  tipoOptions: BannerTipo[] = [
    { label: 'Información', value: 'info', icon: 'pi-info-circle', color: '#3b82f6' },
    { label: 'Advertencia', value: 'warning', icon: 'pi-exclamation-triangle', color: '#fbbf24' },
    { label: 'Éxito', value: 'success', icon: 'pi-check-circle', color: '#10b981' },
    { label: 'Error', value: 'error', icon: 'pi-times-circle', color: '#ef4444' }
  ];

  // Opciones de template
  templateOptions = [
    { label: 'Banner tradicional (imagen + texto)', value: 'default' },
    { label: 'Alertas de Caja SGR (infografía)', value: 'alertas-caja' }
  ];

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBannerConfig();
    this.loadTrackingState();
  }

  private initializeForm(): void {
    this.bannerForm = this.fb.group({
      activo: [false],
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      mensaje: ['', [Validators.required, Validators.maxLength(1000)]],
      tipo: ['info', Validators.required],
      template: ['default'],
      imagen_url: ['', [Validators.maxLength(500)]],
      boton_texto: ['', [Validators.maxLength(50)]],
      boton_url: ['', [Validators.maxLength(500)]],
      fecha_inicio: [new Date(), Validators.required],
      fecha_fin: [new Date(), Validators.required],
      frecuencia_diaria: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      max_dias_consecutivos: [5, [Validators.required, Validators.min(1), Validators.max(30)]]
    }, {
      validators: this.dateRangeValidator
    });

    // Actualizar preview cuando cambian los valores
    this.bannerForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.showPreview()) {
        this.updatePreview();
      }
    });
  }

  private dateRangeValidator(form: FormGroup): { [key: string]: boolean } | null {
    const fechaInicio = form.get('fecha_inicio')?.value;
    const fechaFin = form.get('fecha_fin')?.value;

    if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
      return { dateRangeInvalid: true };
    }

    return null;
  }

  private loadBannerConfig(): void {
    this.isLoading.set(true);

    this.configService.getBannerConfig().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (config) => {
        if (config) {
          this.bannerForm.patchValue({
            activo: config.activo,
            titulo: config.titulo,
            mensaje: config.mensaje,
            tipo: config.tipo,
            template: config.template || 'default',
            imagen_url: config.imagen_url || '',
            boton_texto: config.boton_texto || '',
            boton_url: config.boton_url || '',
            fecha_inicio: new Date(config.fecha_inicio),
            fecha_fin: new Date(config.fecha_fin),
            frecuencia_diaria: config.frecuencia_diaria,
            max_dias_consecutivos: config.max_dias_consecutivos
          });
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading banner config:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar la configuración del banner'
        });
        this.isLoading.set(false);
      }
    });
  }

  private loadTrackingState(): void {
    // Obtener el estado actual de tracking desde localStorage
    try {
      const stored = localStorage.getItem('sicodis_banner_tracking');
      if (stored) {
        const tracking = JSON.parse(stored) as BannerTrackingState;
        this.trackingState.set(tracking);
      }
    } catch (e) {
      console.error('Error loading tracking state:', e);
    }
  }

  onSubmit(): void {
    if (this.bannerForm.invalid) {
      this.markFormGroupTouched(this.bannerForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor corrige los errores antes de guardar'
      });
      return;
    }

    this.isSaving.set(true);

    const formValue = this.bannerForm.value;

    // Obtener la configuración actual para incrementar la versión
    this.configService.getBannerConfig().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (currentConfig) => {
        const newVersion = (currentConfig?.version || 0) + 1;

        const bannerConfig: BannerConfig = {
          id: currentConfig?.id || 1,
          activo: formValue.activo,
          titulo: formValue.titulo,
          mensaje: formValue.mensaje,
          tipo: formValue.tipo,
          template: formValue.template || 'default',
          imagen_url: formValue.imagen_url,
          boton_texto: formValue.boton_texto,
          boton_url: formValue.boton_url,
          fecha_inicio: this.formatDate(formValue.fecha_inicio),
          fecha_fin: this.formatDate(formValue.fecha_fin),
          frecuencia_diaria: formValue.frecuencia_diaria,
          max_dias_consecutivos: formValue.max_dias_consecutivos,
          version: newVersion
        };

        // Guardar en ConfigService
        this.configService.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(bannerConfig),
          tipo_dato: 'json',
          descripcion: 'Configuración del banner principal',
          activo: true,
          usuario_modificacion: 'admin'
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
          next: () => {
            this.isSaving.set(false);
            this.messageService.add({
              severity: 'success',
              summary: 'Guardado exitoso',
              detail: `Banner actualizado (versión ${newVersion}). El tracking se ha reseteado automáticamente.`
            });

            // Recargar tracking state
            this.loadTrackingState();
          },
          error: (error) => {
            console.error('Error saving banner config:', error);
            this.isSaving.set(false);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo guardar la configuración'
            });
          }
        });
      }
    });
  }

  togglePreview(): void {
    this.showPreview.update(v => !v);
    if (this.showPreview()) {
      this.updatePreview();
    }
  }

  private updatePreview(): void {
    const formValue = this.bannerForm.value;

    this.previewConfig.set({
      id: 1,
      activo: formValue.activo,
      titulo: formValue.titulo || 'Título del banner',
      mensaje: formValue.mensaje || 'Mensaje del banner',
      tipo: formValue.tipo,
      template: formValue.template || 'default',
      imagen_url: formValue.imagen_url,
      boton_texto: formValue.boton_texto,
      boton_url: formValue.boton_url,
      fecha_inicio: this.formatDate(formValue.fecha_inicio),
      fecha_fin: this.formatDate(formValue.fecha_fin),
      frecuencia_diaria: formValue.frecuencia_diaria,
      max_dias_consecutivos: formValue.max_dias_consecutivos,
      version: 1
    });
  }

  closePreview(): void {
    this.showPreview.set(false);
  }

  resetForm(): void {
    this.loadBannerConfig();
    this.messageService.add({
      severity: 'info',
      summary: 'Formulario restablecido',
      detail: 'Se han restaurado los valores guardados'
    });
  }

  resetTracking(): void {
    if (confirm('¿Estás seguro de que deseas resetear el tracking del banner? Esto hará que el banner vuelva a mostrarse a todos los usuarios.')) {
      localStorage.removeItem('sicodis_banner_tracking');
      this.trackingState.set(null);
      this.messageService.add({
        severity: 'success',
        summary: 'Tracking reseteado',
        detail: 'El tracking del banner ha sido eliminado'
      });
    }
  }

  private formatDate(date: Date): string {
    if (!date) return new Date().toISOString().split('T')[0];
    const d = new Date(date);
    return d.toISOString().split('T')[0];
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

  // Getters para validación en template
  get titulo() { return this.bannerForm.get('titulo'); }
  get mensaje() { return this.bannerForm.get('mensaje'); }
  get fecha_inicio() { return this.bannerForm.get('fecha_inicio'); }
  get fecha_fin() { return this.bannerForm.get('fecha_fin'); }
  get frecuencia_diaria() { return this.bannerForm.get('frecuencia_diaria'); }
  get max_dias_consecutivos() { return this.bannerForm.get('max_dias_consecutivos'); }

  get isDateRangeInvalid(): boolean {
    return !!(this.bannerForm.hasError('dateRangeInvalid') &&
           (this.fecha_inicio?.touched || this.fecha_fin?.touched));
  }
}
