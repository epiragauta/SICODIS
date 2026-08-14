import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

import { ConfigBannerComponent } from './config-banner.component';
import { ConfigService, BannerConfig } from '../../../../services/config.service';
import { MessageService } from 'primeng/api';

// PrimeNG imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ConfigBannerComponent', () => {
  let component: ConfigBannerComponent;
  let fixture: ComponentFixture<ConfigBannerComponent>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  const mockBannerConfig: BannerConfig = {
    id: 1,
    activo: true,
    titulo: 'Test Banner',
    mensaje: 'Test Message',
    tipo: 'info',
    imagen_url: '/assets/img/test.jpg',
    boton_texto: 'Ver más',
    boton_url: 'https://test.com',
    fecha_inicio: '2026-06-01',
    fecha_fin: '2026-06-30',
    frecuencia_diaria: 2,
    max_dias_consecutivos: 5,
    version: 1
  };

  beforeEach(async () => {
    const configSpy = jasmine.createSpyObj('ConfigService', [
      'getBannerConfig',
      'setConfig'
    ]);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [
        ConfigBannerComponent,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        CalendarModule,
        InputNumberModule,
        CheckboxModule,
        ButtonModule,
        DividerModule,
        MessageModule,
        DialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: ConfigService, useValue: configSpy },
        { provide: MessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });

  beforeEach(() => {
    configServiceSpy.getBannerConfig.and.returnValue(of(mockBannerConfig));
    fixture = TestBed.createComponent(ConfigBannerComponent);
    component = fixture.componentInstance;
  });

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  describe('Inicialización', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with all controls', () => {
      fixture.detectChanges();

      expect(component.bannerForm).toBeTruthy();
      expect(component.bannerForm.get('activo')).toBeTruthy();
      expect(component.bannerForm.get('titulo')).toBeTruthy();
      expect(component.bannerForm.get('mensaje')).toBeTruthy();
      expect(component.bannerForm.get('tipo')).toBeTruthy();
      expect(component.bannerForm.get('imagen_url')).toBeTruthy();
      expect(component.bannerForm.get('boton_texto')).toBeTruthy();
      expect(component.bannerForm.get('boton_url')).toBeTruthy();
      expect(component.bannerForm.get('fecha_inicio')).toBeTruthy();
      expect(component.bannerForm.get('fecha_fin')).toBeTruthy();
      expect(component.bannerForm.get('frecuencia_diaria')).toBeTruthy();
      expect(component.bannerForm.get('max_dias_consecutivos')).toBeTruthy();
    });

    it('should load banner config on init', () => {
      fixture.detectChanges();

      expect(configServiceSpy.getBannerConfig).toHaveBeenCalled();
      expect(component.bannerForm.get('titulo')?.value).toBe('Test Banner');
      expect(component.bannerForm.get('mensaje')?.value).toBe('Test Message');
      expect(component.bannerForm.get('activo')?.value).toBe(true);
    });

    it('should set loading state while loading config', () => {
      expect(component.isLoading()).toBe(false);

      // No llamar detectChanges todavía para capturar el estado de loading
      const delayedConfig = new Promise<BannerConfig>((resolve) => {
        setTimeout(() => resolve(mockBannerConfig), 100);
      });
      configServiceSpy.getBannerConfig.and.returnValue(of(mockBannerConfig));

      component.ngOnInit();
      expect(component.isLoading()).toBe(true);
    });

    it('should handle error when loading config', () => {
      configServiceSpy.getBannerConfig.and.returnValue(
        throwError(() => new Error('Load error'))
      );

      fixture.detectChanges();

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'error',
          summary: 'Error'
        })
      );
      expect(component.isLoading()).toBe(false);
    });
  });

  // ============================================================================
  // VALIDACIÓN DEL FORMULARIO
  // ============================================================================

  describe('Validación del Formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require titulo', () => {
      const titulo = component.bannerForm.get('titulo');
      titulo?.setValue('');

      expect(titulo?.hasError('required')).toBe(true);
      expect(titulo?.valid).toBe(false);
    });

    it('should enforce maxLength on titulo', () => {
      const titulo = component.bannerForm.get('titulo');
      const longTitle = 'a'.repeat(101);
      titulo?.setValue(longTitle);

      expect(titulo?.hasError('maxlength')).toBe(true);
      expect(titulo?.valid).toBe(false);
    });

    it('should require mensaje', () => {
      const mensaje = component.bannerForm.get('mensaje');
      mensaje?.setValue('');

      expect(mensaje?.hasError('required')).toBe(true);
      expect(mensaje?.valid).toBe(false);
    });

    it('should enforce maxLength on mensaje', () => {
      const mensaje = component.bannerForm.get('mensaje');
      const longMessage = 'a'.repeat(1001);
      mensaje?.setValue(longMessage);

      expect(mensaje?.hasError('maxlength')).toBe(true);
      expect(mensaje?.valid).toBe(false);
    });

    it('should require fecha_inicio', () => {
      const fecha = component.bannerForm.get('fecha_inicio');
      fecha?.setValue(null);

      expect(fecha?.hasError('required')).toBe(true);
      expect(fecha?.valid).toBe(false);
    });

    it('should require fecha_fin', () => {
      const fecha = component.bannerForm.get('fecha_fin');
      fecha?.setValue(null);

      expect(fecha?.hasError('required')).toBe(true);
      expect(fecha?.valid).toBe(false);
    });

    it('should validate date range (fecha_inicio < fecha_fin)', () => {
      const inicio = new Date('2026-06-15');
      const fin = new Date('2026-06-10'); // Anterior a inicio

      component.bannerForm.patchValue({
        fecha_inicio: inicio,
        fecha_fin: fin
      });

      expect(component.bannerForm.hasError('dateRangeInvalid')).toBe(true);
      expect(component.isDateRangeInvalid).toBe(false); // Campos no touched aún
    });

    it('should show date range error when fields are touched', () => {
      const inicio = new Date('2026-06-15');
      const fin = new Date('2026-06-10');

      component.bannerForm.patchValue({
        fecha_inicio: inicio,
        fecha_fin: fin
      });

      component.bannerForm.get('fecha_inicio')?.markAsTouched();
      component.bannerForm.get('fecha_fin')?.markAsTouched();

      expect(component.isDateRangeInvalid).toBe(true);
    });

    it('should validate frecuencia_diaria min/max', () => {
      const frecuencia = component.bannerForm.get('frecuencia_diaria');

      frecuencia?.setValue(0);
      expect(frecuencia?.hasError('min')).toBe(true);

      frecuencia?.setValue(11);
      expect(frecuencia?.hasError('max')).toBe(true);

      frecuencia?.setValue(5);
      expect(frecuencia?.valid).toBe(true);
    });

    it('should validate max_dias_consecutivos min/max', () => {
      const dias = component.bannerForm.get('max_dias_consecutivos');

      dias?.setValue(0);
      expect(dias?.hasError('min')).toBe(true);

      dias?.setValue(31);
      expect(dias?.hasError('max')).toBe(true);

      dias?.setValue(15);
      expect(dias?.valid).toBe(true);
    });

    it('should have valid form with correct data', () => {
      component.bannerForm.patchValue({
        activo: true,
        titulo: 'Valid Title',
        mensaje: 'Valid Message',
        tipo: 'info',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 2,
        max_dias_consecutivos: 5
      });

      expect(component.bannerForm.valid).toBe(true);
    });
  });

  // ============================================================================
  // GUARDADO
  // ============================================================================

  describe('Guardar Configuración', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should not submit if form is invalid', () => {
      component.bannerForm.patchValue({ titulo: '' }); // Inválido
      component.onSubmit();

      expect(configServiceSpy.setConfig).not.toHaveBeenCalled();
      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'warn',
          summary: 'Formulario inválido'
        })
      );
    });

    it('should submit valid form', () => {
      configServiceSpy.setConfig.and.returnValue(of(true));

      component.bannerForm.patchValue({
        activo: true,
        titulo: 'New Title',
        mensaje: 'New Message',
        tipo: 'warning',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 3,
        max_dias_consecutivos: 7
      });

      component.onSubmit();

      expect(configServiceSpy.setConfig).toHaveBeenCalled();
    });

    it('should increment version on save', (done) => {
      configServiceSpy.setConfig.and.returnValue(of(true));

      component.bannerForm.patchValue({
        activo: true,
        titulo: 'Updated Title',
        mensaje: 'Updated Message',
        tipo: 'success',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 1,
        max_dias_consecutivos: 5
      });

      component.onSubmit();

      setTimeout(() => {
        const calls = configServiceSpy.setConfig.calls.mostRecent();
        const savedConfig = calls.args[0];
        const parsedValue = JSON.parse(savedConfig.valor);

        expect(parsedValue.version).toBe(mockBannerConfig.version + 1);
        done();
      }, 100);
    });

    it('should set saving state during save', () => {
      configServiceSpy.setConfig.and.returnValue(of(true));

      component.bannerForm.patchValue({
        activo: true,
        titulo: 'Title',
        mensaje: 'Message',
        tipo: 'info',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 1,
        max_dias_consecutivos: 5
      });

      expect(component.isSaving()).toBe(false);

      component.onSubmit();

      // Durante el guardado
      expect(component.isSaving()).toBe(true);
    });

    it('should show success message after save', (done) => {
      configServiceSpy.setConfig.and.returnValue(of(true));

      component.bannerForm.patchValue({
        activo: true,
        titulo: 'Title',
        mensaje: 'Message',
        tipo: 'info',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 1,
        max_dias_consecutivos: 5
      });

      component.onSubmit();

      setTimeout(() => {
        expect(messageServiceSpy.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'success',
            summary: 'Guardado exitoso'
          })
        );
        expect(component.isSaving()).toBe(false);
        done();
      }, 100);
    });

    it('should handle save error', (done) => {
      configServiceSpy.setConfig.and.returnValue(
        throwError(() => new Error('Save error'))
      );

      component.bannerForm.patchValue({
        activo: true,
        titulo: 'Title',
        mensaje: 'Message',
        tipo: 'info',
        fecha_inicio: new Date('2026-06-01'),
        fecha_fin: new Date('2026-06-30'),
        frecuencia_diaria: 1,
        max_dias_consecutivos: 5
      });

      component.onSubmit();

      setTimeout(() => {
        expect(messageServiceSpy.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'error',
            summary: 'Error'
          })
        );
        expect(component.isSaving()).toBe(false);
        done();
      }, 100);
    });
  });

  // ============================================================================
  // VISTA PREVIA
  // ============================================================================

  describe('Vista Previa', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle preview visibility', () => {
      expect(component.showPreview()).toBe(false);

      component.togglePreview();
      expect(component.showPreview()).toBe(true);

      component.togglePreview();
      expect(component.showPreview()).toBe(false);
    });

    it('should update preview config when toggling on', () => {
      component.bannerForm.patchValue({
        titulo: 'Preview Title',
        mensaje: 'Preview Message',
        tipo: 'warning'
      });

      component.togglePreview();

      const preview = component.previewConfig();
      expect(preview).toBeTruthy();
      expect(preview?.titulo).toBe('Preview Title');
      expect(preview?.mensaje).toBe('Preview Message');
      expect(preview?.tipo).toBe('warning');
    });

    it('should use default values in preview if fields are empty', () => {
      component.bannerForm.patchValue({
        titulo: '',
        mensaje: ''
      });

      component.togglePreview();

      const preview = component.previewConfig();
      expect(preview?.titulo).toBe('Título del banner');
      expect(preview?.mensaje).toBe('Mensaje del banner');
    });

    it('should close preview', () => {
      component.showPreview.set(true);
      component.closePreview();

      expect(component.showPreview()).toBe(false);
    });

    it('should not open preview if form is invalid', () => {
      component.bannerForm.patchValue({ titulo: '' }); // Inválido

      component.togglePreview();

      expect(component.showPreview()).toBe(false);
    });
  });

  // ============================================================================
  // TRACKING
  // ============================================================================

  describe('Tracking State', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should load tracking state from localStorage', () => {
      const mockTracking = {
        configVersion: 1,
        lastShownDate: '2026-06-10',
        countToday: 2,
        consecutiveDays: 3,
        shouldShow: false
      };

      spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockTracking));

      component['loadTrackingState']();

      expect(component.trackingState()).toEqual(mockTracking);
    });

    it('should handle missing tracking state', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      component['loadTrackingState']();

      expect(component.trackingState()).toBeNull();
    });

    it('should reset tracking with confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(localStorage, 'removeItem');

      component.trackingState.set({
        configVersion: 1,
        lastShownDate: '2026-06-10',
        countToday: 2,
        consecutiveDays: 3,
        shouldShow: false
      });

      component.resetTracking();

      expect(localStorage.removeItem).toHaveBeenCalledWith('sicodis_banner_tracking');
      expect(component.trackingState()).toBeNull();
      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'success',
          summary: 'Tracking reseteado'
        })
      );
    });

    it('should not reset tracking if user cancels', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(localStorage, 'removeItem');

      component.trackingState.set({
        configVersion: 1,
        lastShownDate: '2026-06-10',
        countToday: 2,
        consecutiveDays: 3,
        shouldShow: false
      });

      component.resetTracking();

      expect(localStorage.removeItem).not.toHaveBeenCalled();
      expect(component.trackingState()).toBeTruthy();
    });
  });

  // ============================================================================
  // RESTABLECER FORMULARIO
  // ============================================================================

  describe('Restablecer Formulario', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should reset form to loaded values', () => {
      // Cambiar valores
      component.bannerForm.patchValue({
        titulo: 'Changed Title',
        mensaje: 'Changed Message'
      });

      expect(component.bannerForm.get('titulo')?.value).toBe('Changed Title');

      // Restablecer
      component.resetForm();

      // Debería volver a los valores del mockBannerConfig
      expect(component.bannerForm.get('titulo')?.value).toBe(mockBannerConfig.titulo);
      expect(component.bannerForm.get('mensaje')?.value).toBe(mockBannerConfig.mensaje);
    });

    it('should show message when form is reset', () => {
      component.resetForm();

      expect(messageServiceSpy.add).toHaveBeenCalledWith(
        jasmine.objectContaining({
          severity: 'info',
          summary: 'Formulario restablecido'
        })
      );
    });
  });

  // ============================================================================
  // GETTERS
  // ============================================================================

  describe('Form Getters', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have getter for titulo', () => {
      expect(component.titulo).toBe(component.bannerForm.get('titulo'));
    });

    it('should have getter for mensaje', () => {
      expect(component.mensaje).toBe(component.bannerForm.get('mensaje'));
    });

    it('should have getter for fecha_inicio', () => {
      expect(component.fecha_inicio).toBe(component.bannerForm.get('fecha_inicio'));
    });

    it('should have getter for fecha_fin', () => {
      expect(component.fecha_fin).toBe(component.bannerForm.get('fecha_fin'));
    });

    it('should have getter for frecuencia_diaria', () => {
      expect(component.frecuencia_diaria).toBe(component.bannerForm.get('frecuencia_diaria'));
    });

    it('should have getter for max_dias_consecutivos', () => {
      expect(component.max_dias_consecutivos).toBe(component.bannerForm.get('max_dias_consecutivos'));
    });
  });

  // ============================================================================
  // TIPO OPTIONS
  // ============================================================================

  describe('Tipo Options', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have 4 tipo options', () => {
      expect(component.tipoOptions.length).toBe(4);
    });

    it('should have info tipo', () => {
      const info = component.tipoOptions.find(t => t.value === 'info');
      expect(info).toBeTruthy();
      expect(info?.label).toBe('Información');
      expect(info?.color).toBe('#3b82f6');
    });

    it('should have warning tipo', () => {
      const warning = component.tipoOptions.find(t => t.value === 'warning');
      expect(warning).toBeTruthy();
      expect(warning?.label).toBe('Advertencia');
      expect(warning?.color).toBe('#fbbf24');
    });

    it('should have success tipo', () => {
      const success = component.tipoOptions.find(t => t.value === 'success');
      expect(success).toBeTruthy();
      expect(success?.label).toBe('Éxito');
      expect(success?.color).toBe('#10b981');
    });

    it('should have error tipo', () => {
      const error = component.tipoOptions.find(t => t.value === 'error');
      expect(error).toBeTruthy();
      expect(error?.label).toBe('Error');
      expect(error?.color).toBe('#ef4444');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should handle very long titulo gracefully', () => {
      const longTitle = 'a'.repeat(200);
      component.bannerForm.patchValue({ titulo: longTitle });

      expect(component.bannerForm.get('titulo')?.invalid).toBe(true);
    });

    it('should handle HTML in mensaje', () => {
      const htmlMessage = '<strong>Bold</strong> and <em>italic</em> text';
      component.bannerForm.patchValue({ mensaje: htmlMessage });

      expect(component.bannerForm.get('mensaje')?.value).toBe(htmlMessage);
    });

    it('should handle same fecha_inicio and fecha_fin', () => {
      const sameDate = new Date('2026-06-15');
      component.bannerForm.patchValue({
        fecha_inicio: sameDate,
        fecha_fin: sameDate
      });

      expect(component.bannerForm.hasError('dateRangeInvalid')).toBe(false);
    });

    it('should handle frecuencia_diaria of 1', () => {
      component.bannerForm.patchValue({ frecuencia_diaria: 1 });
      expect(component.bannerForm.get('frecuencia_diaria')?.valid).toBe(true);
    });

    it('should handle max_dias_consecutivos of 1', () => {
      component.bannerForm.patchValue({ max_dias_consecutivos: 1 });
      expect(component.bannerForm.get('max_dias_consecutivos')?.valid).toBe(true);
    });
  });
});
