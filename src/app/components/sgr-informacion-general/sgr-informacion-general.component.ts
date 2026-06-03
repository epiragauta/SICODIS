import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { SliderModule } from 'primeng/slider';

// Services
import { SgrPresupuestoService } from '../../services/sgr-presupuesto.service';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

// Models
import { FiltrosSGR, DatosAgregados, EntidadCount } from '../../models/sgr-presupuesto.models';

interface PresupuestoMetricas {
  presupuestoTotal: number;
  presupuestoCorriente: number;
  presupuestoOtros: number;
  porcentajeDisponibilidad: number;
}

interface RecaudoMetricas {
  recaudoTotal: number;
  recaudoCorriente: number;
  recaudoOtros: number;
}

@Component({
  selector: 'app-sgr-informacion-general',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    RadioButtonModule,
    CheckboxModule,
    SliderModule,
    NumberFormatPipe
  ],
  templateUrl: './sgr-informacion-general.component.html',
  styleUrl: './sgr-informacion-general.component.scss'
})
export class SgrInformacionGeneralComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Conteo de entidades
  entidadesCount: EntidadCount = {
    beneficiarias: 0,
    productoras: 0,
    zomac: 0,
    pdet: 0,
    etnicas: 0
  };

  // Filtros
  periodicidad: string = 'Bienal';
  caracterizacionSeleccionada: string = 'grupoInteres';
  entidadSeleccionada: string = 'beneficiario';
  presupuestoSeleccionado: string = 'total';
  recaudoSeleccionado: string = 'total';
  porcentajeDisponibilidad: number = 50;

  // Métricas de presupuesto
  presupuestoMetricas: PresupuestoMetricas = {
    presupuestoTotal: 0,
    presupuestoCorriente: 0,
    presupuestoOtros: 0,
    porcentajeDisponibilidad: 0
  };

  // Métricas de recaudo
  recaudoMetricas: RecaudoMetricas = {
    recaudoTotal: 0,
    recaudoCorriente: 0,
    recaudoOtros: 0
  };

  // Estados
  isLoading = signal(false);
  fechaReporte: string = '';

  constructor(private sgrPresupuestoService: SgrPresupuestoService) {
    const fecha = new Date();
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    this.fechaReporte = `${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Construir filtros basados en la entidad seleccionada
    const filtros: FiltrosSGR = {};

    switch (this.entidadSeleccionada) {
      case 'productoras':
        filtros.productor = true;
        break;
      case 'zomac':
        filtros.zomac = true;
        break;
      case 'pdet':
        filtros.pdet = true;
        break;
      case 'etnica':
        filtros.destinacionEtnica = true;
        break;
      case 'capital':
        // Nota: esCapital no está soportado directamente en FiltrosSGR
        // Se podría agregar en el futuro al modelo
        break;
      case 'beneficiario':
        // Mostrar todas las entidades sin filtro específico
        break;
    }

    // Cargar datos agregados con filtros
    this.sgrPresupuestoService.getDatosAgregados(filtros)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos: DatosAgregados) => {
          this.actualizarDatosComponente(datos);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error al cargar datos:', error);
          this.isLoading.set(false);
        }
      });
  }

  private actualizarDatosComponente(datos: DatosAgregados): void {
    // Actualizar conteo de entidades
    this.entidadesCount = datos.entidadesCount;

    // Actualizar métricas de presupuesto
    this.presupuestoMetricas = {
      presupuestoTotal: datos.presupuestoTotal,
      presupuestoCorriente: datos.presupuestoCorriente,
      presupuestoOtros: datos.presupuestoOtros,
      porcentajeDisponibilidad: datos.presupuestoTotal > 0
        ? (datos.presupuestoOtros / datos.presupuestoTotal) * 100
        : 0
    };

    // Actualizar métricas de recaudo
    this.recaudoMetricas = {
      recaudoTotal: datos.recaudoTotal,
      recaudoCorriente: datos.recaudoCorriente,
      recaudoOtros: datos.recaudoOtros
    };
  }


  onEntidadChange(nuevaEntidad: string): void {
    console.log('Cambio de entidad detectado:', nuevaEntidad);
    this.entidadSeleccionada = nuevaEntidad;
    this.loadData();
  }

  aplicarFiltros(): void {
    console.log('Aplicando filtros de entidad:', {
      entidadSeleccionada: this.entidadSeleccionada
    });
    this.loadData();
  }

  exportarReporte(): void {
    console.log('Exportando reporte...');
    alert('Funcionalidad de exportación en desarrollo');
  }

  // Getters dinámicos para KPIs según filtros de Presupuesto y Recaudo
  get presupuestoKPI(): number {
    switch (this.presupuestoSeleccionado) {
      case 'corriente':
        return this.presupuestoMetricas.presupuestoCorriente;
      case 'otros':
        return this.presupuestoMetricas.presupuestoOtros;
      default:
        return this.presupuestoMetricas.presupuestoTotal;
    }
  }

  get tituloPresupuestoKPI(): string {
    switch (this.presupuestoSeleccionado) {
      case 'corriente':
        return 'Presupuesto Corriente';
      case 'otros':
        return 'Presupuesto Otros';
      default:
        return 'Presupuesto Total';
    }
  }

  get recaudoKPI(): number {
    switch (this.recaudoSeleccionado) {
      case 'corriente':
        return this.recaudoMetricas.recaudoCorriente;
      case 'otros':
        return this.recaudoMetricas.recaudoOtros;
      default:
        return this.recaudoMetricas.recaudoTotal;
    }
  }

  get tituloRecaudoKPI(): string {
    switch (this.recaudoSeleccionado) {
      case 'corriente':
        return 'Recaudo Corriente';
      case 'otros':
        return 'Recaudo Otros';
      default:
        return 'Recaudo Total';
    }
  }

  get avanceRecaudoKPI(): number {
    return this.presupuestoKPI > 0
      ? (this.recaudoKPI / this.presupuestoKPI) * 100
      : 0;
  }

  // Métodos para manejar cambios en filtros de Presupuesto y Recaudo
  onPresupuestoSeleccionChange(nuevoValor: string): void {
    console.log('Presupuesto seleccionado:', nuevoValor);
    this.presupuestoSeleccionado = nuevoValor;
    // Los KPIs se actualizan automáticamente mediante los getters
  }

  onRecaudoSeleccionChange(nuevoValor: string): void {
    console.log('Recaudo seleccionado:', nuevoValor);
    this.recaudoSeleccionado = nuevoValor;
    // Los KPIs se actualizan automáticamente mediante los getters
  }

  // Getters para la sección "Vista General" (aunque esté oculta, evitan errores de compilación)
  get porcentajeCorriente(): number {
    return this.presupuestoMetricas.presupuestoTotal > 0
      ? (this.presupuestoMetricas.presupuestoCorriente / this.presupuestoMetricas.presupuestoTotal) * 100
      : 0;
  }

  get porcentajeOtros(): number {
    return this.presupuestoMetricas.presupuestoTotal > 0
      ? (this.presupuestoMetricas.presupuestoOtros / this.presupuestoMetricas.presupuestoTotal) * 100
      : 0;
  }

  get presupuestoVisualizacion(): number {
    return this.presupuestoMetricas.presupuestoTotal;
  }

  get tituloPresupuesto(): string {
    return 'Presupuesto Total';
  }
}
