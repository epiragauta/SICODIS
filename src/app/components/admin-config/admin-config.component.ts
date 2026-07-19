import { Component, OnInit, signal, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG imports
import { TabViewModule } from 'primeng/tabview';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { ConfigService, ConfiguracionBase } from '../../services/config.service';
import { ConfigBannerComponent } from './components/config-banner/config-banner.component';
import { ConfigFechasFormComponent } from './components/config-fechas-form/config-fechas-form.component';

@Component({
  selector: 'app-admin-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabViewModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    TableModule,
    ToastModule,
    DividerModule,
    TagModule,
    ConfigBannerComponent,
    ConfigFechasFormComponent
  ],
  providers: [MessageService],
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  // Signals para reactividad
  isLoading = signal(false);
  allConfigs = signal<ConfiguracionBase[]>([]);

  // Tab activo
  activeTabIndex = 0;

  constructor(
    private configService: ConfigService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadAllConfigs();
  }

  loadAllConfigs(): void {
    this.isLoading.set(true);
    this.configService.getAllConfigs().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (configs) => {
        this.allConfigs.set(configs);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading configs:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las configuraciones'
        });
        this.isLoading.set(false);
      }
    });
  }

  getConfigsByCategory(categoria: string): ConfiguracionBase[] {
    return this.allConfigs().filter(c => c.categoria === categoria);
  }

  getConfigsByCategoryAndPrefix(categoria: string, prefix: string): ConfiguracionBase[] {
    return this.allConfigs().filter(c => c.categoria === categoria && c.clave.startsWith(prefix));
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: message
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message
    });
  }

  getCategorySeverity(categoria: string): 'success' | 'info' | 'warn' | 'danger' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger'> = {
      'fechas': 'info',
      'banner': 'warn',
      'colores': 'success',
      'urls': 'info',
      'general': 'info'
    };
    return severityMap[categoria] || 'info';
  }
}
