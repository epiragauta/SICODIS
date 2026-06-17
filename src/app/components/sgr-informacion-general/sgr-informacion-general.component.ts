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
import { DropdownModule } from 'primeng/dropdown';

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
    DropdownModule,
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
  valorPeriodicidadSeleccionado: string = '2025-2026';
  anoMensualSeleccionado: number = 2025; // Para periodicidad mensual
  caracterizacionSeleccionada: string = 'grupoInteres';
  valorCaracterizacionSeleccionado: string = 'Otros';
  entidadSeleccionada: string = 'beneficiario';
  presupuestoSeleccionado: string = 'total';
  recaudoSeleccionado: string = 'total';
  porcentajeDisponibilidad: number = 50;

  // Opciones para cada tipo de caracterización
  conceptoGastoOpciones = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Inversión', value: 'Inversión' },
    { label: 'Ahorro', value: 'Ahorro' },
    { label: 'Administración', value: 'Administración' }
  ];

  regionalOpciones = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Región Eje Cafetero', value: 'Región Eje Cafetero' },
    { label: 'Región Caribe', value: 'Región Caribe' },
    { label: 'Región Centro - Oriente', value: 'Región Centro - Oriente' },
    { label: 'Región Centro - Sur', value: 'Región Centro - Sur' },
    { label: 'Región Pacífico', value: 'Región Pacífico' },
    { label: 'Región del LLano', value: 'Región del LLano' }
  ];

  asignacionOpciones = [
    { label: 'Asignación Paz', value: 'Asignación Paz' },
    { label: 'Asignaciones Directas (20% del SGR)', value: 'Asignaciones Directas (20% del SGR)' },
    { label: 'Asignación para la Inversión Regional - Departamentos', value: 'Asignación para la Inversión Regional - Departamentos' },
    { label: 'Asignación para la Ciencia, Tecnología e Innovación - Convocatorias 2021 - Ambiente y Desarrollo Sostenible', value: 'Asignación para la Ciencia, Tecnología e Innovación - Convocatorias 2021 - Ambiente y Desarrollo Sostenible' },
    { label: 'Asignación para la Ciencia, Tecnología e Innovación - Convocatorias 2021', value: 'Asignación para la Ciencia, Tecnología e Innovación - Convocatorias 2021' },
    { label: 'Fondo de Ahorro y Estabilización (FAE)', value: 'Fondo de Ahorro y Estabilización (FAE)' },
    { label: 'Fondo Nacional de Pensiones de las Entidades Territoriales (FONPET)', value: 'Fondo Nacional de Pensiones de las Entidades Territoriales (FONPET)' },
    { label: 'Funcionamiento, operatividad y administración del sistema y evaluación y monitoreo del licenciamiento ambiental a los proyectos de exploración y explotación', value: 'Funcionamiento, operatividad y administración del sistema y evaluación y monitoreo del licenciamiento ambiental a los proyectos de exploración y explotación' },
    { label: 'Asignación para la Inversión Regional - Departamentos Art. 209 de la Ley 2056 de 2020', value: 'Asignación para la Inversión Regional - Departamentos  Art. 209 de la Ley 2056 de 2020' },
    { label: 'Asignación para la Inversión Regional - Gestión del Riesgo y Adaptación del Cambio Climático', value: 'Asignación para la Inversión Regional - Gestión del Riesgo y Adaptación del Cambio Climático' },
    { label: 'Asignación para la Inversión Regional - Parágrafo 8o Transitorio del Art. 361 de la C.P', value: 'Asignación para la Inversión Regional - Parágrafo 8o Transitorio del Art. 361 de la C.P' },
    { label: 'Proyectos de Infraestructura de Transporte para la Implementación del Acuerdo Final, Parágrafo 8o Transitorio del Art . 361 de la  C.P', value: 'Proyectos de Infraestructura de Transporte para la Implementación del Acuerdo Final, Parágrafo 8o Transitorio del Art . 361 de la  C.P' },
    { label: 'Asignaciones directas anticipadas (5% del SGR)', value: 'Asignaciones directas anticipadas (5% del SGR)' },
    { label: 'Asignación para la Inversión Local - Ambiente y Desarrollo Sostenible', value: 'Asignación para la Inversión Local - Ambiente y Desarrollo Sostenible' },
    { label: 'A. Local municipios', value: 'A. Local municipios' },
    { label: 'Rendimientos Financieros 30% Incentivo a la Producción', value: 'Rendimientos Financieros 30% Incentivo a la Producción' },
    { label: 'Asignaciones Directas (20% del SGR) - No Aforados', value: 'Asignaciones Directas (20% del SGR) - No Aforados' },
    { label: 'Asignaciones Directas Anticipadas (5% del SGR) - No Aforados', value: 'Asignaciones Directas Anticipadas (5% del SGR) - No Aforados' },
    { label: 'Emprendimiento y Generación de Empleo', value: 'Emprendimiento y Generación de Empleo' },
    { label: 'Cormagdalena', value: 'Cormagdalena' },
    { label: 'Conservación de las áreas ambientales estratégicas y la lucha nacional contra la deforestación', value: 'Conservación de las áreas ambientales estratégicas y la lucha nacional contra la deforestación' },
    { label: 'Pueblos y Comunidades Indígenas - Ambiente y Desarrollo Sostenible', value: 'Pueblos y Comunidades Indígenas - Ambiente y Desarrollo Sostenible' },
    { label: 'Pueblos y Comunidades Indígenas', value: 'Pueblos y Comunidades Indígenas' },
    { label: 'Comunidades NARP - Ambiente y Desarrollo Sostenible', value: 'Comunidades NARP - Ambiente y Desarrollo Sostenible' },
    { label: 'Comunidades NARP', value: 'Comunidades NARP' },
    { label: 'Pueblo Rrom o Gitano - Ambiente y Desarrollo Sostenible', value: 'Pueblo Rrom o Gitano - Ambiente y Desarrollo Sostenible' },
    { label: 'Pueblo Rrom o Gitano', value: 'Pueblo Rrom o Gitano' },
    { label: 'Gestión del Riesgo y Adaptación del Cambio Climático', value: 'Gestión del Riesgo y Adaptación del Cambio Climático' },
    { label: 'Decretos Legislativos 574 y 798 de 2020', value: 'Decretos Legislativos 574 y 798 de 2020' },
    { label: 'Asignación para la Paz - Adelanto Art. 361 de la C.P.', value: 'Asignación para la Paz  - Adelanto Art. 361 de la C.P.' },
    { label: 'Incentivo a la Producción, Exploración y Formalización', value: 'Incentivo a la Producción, Exploración y Formalización' },
    { label: 'Fiscalización', value: 'Fiscalización' },
    { label: 'Sistema de Seguimiento, Evaluación y Control (SSEC)', value: 'Sistema de Seguimiento,  Evaluación y Control (SSEC)' },
    { label: 'Asignación para la Inversión Regional - Regiones', value: 'Asignación para la Inversión Regional - Regiones' },
    { label: 'A. Ambiental', value: 'A. Ambiental' },
    { label: 'A. Ciencia', value: 'A. Ciencia' },
    { label: 'A. Ciencia ambiente', value: 'A. Ciencia ambiente' }
  ];

  grupoInteresOpciones = [
    { label: 'Otros', value: 'Otros' },
    { label: 'Gobernación', value: 'Gobernación' },
    { label: 'Municipio', value: 'Municipio' },
    { label: 'Corporación', value: 'Corporación' },
    { label: 'Étnicos', value: 'Étnicos' },
    { label: 'Región', value: 'Región' }
  ];

  // Opciones para periodicidad
  bieniosOpciones = [
    { label: '2025-2026', value: '2025-2026' },
    { label: '2023-2024', value: '2023-2024' },
    { label: '2021-2022', value: '2021-2022' },
    { label: '2019-2020', value: '2019-2020' },
    { label: '2017-2018', value: '2017-2018' },
    { label: '2015-2016', value: '2015-2016' },
    { label: '2013-2014', value: '2013-2014' }
  ];

  anosOpciones = [
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2019', value: '2019' },
    { label: '2018', value: '2018' },
    { label: '2017', value: '2017' },
    { label: '2016', value: '2016' },
    { label: '2015', value: '2015' },
    { label: '2014', value: '2014' }
  ];

  mesesOpciones = [
    { label: 'Enero', value: '01' },
    { label: 'Febrero', value: '02' },
    { label: 'Marzo', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Mayo', value: '05' },
    { label: 'Junio', value: '06' },
    { label: 'Julio', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Septiembre', value: '09' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' }
  ];

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

    // Construir filtros combinando caracterización y entidad
    const filtros: FiltrosSGR = {};

    // 1. Aplicar filtros de caracterización (columna izquierda con dropdown)
    switch (this.caracterizacionSeleccionada) {
      case 'conceptoGasto':
        if (this.valorCaracterizacionSeleccionado !== 'Todos') {
          filtros.conceptoGasto = this.valorCaracterizacionSeleccionado;
        }
        break;

      case 'regional':
        if (this.valorCaracterizacionSeleccionado !== 'Todos') {
          filtros.region = this.valorCaracterizacionSeleccionado;
        }
        break;

      case 'asignacion':
        filtros.conceptoGasto = this.valorCaracterizacionSeleccionado;
        break;

      case 'grupoInteres':
        switch (this.valorCaracterizacionSeleccionado) {
          case 'Gobernación':
          case 'Municipio':
          case 'Corporación':
          case 'Étnicos':
          case 'Región':
            filtros.tipoEntidad = this.valorCaracterizacionSeleccionado;
            break;
        }
        break;
    }

    // 2. Aplicar filtros de entidad (columna derecha con radio buttons)
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
        // Capital no está soportado en FiltrosSGR actualmente
        break;
      case 'beneficiario':
        // No aplicar filtro específico
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



  exportarReporte(): void {
    console.log('Exportando reporte...');
    alert('Funcionalidad de exportación en desarrollo');
  }

  // Getter para opciones dinámicas del dropdown de periodicidad
  get opcionesPeriodicidad(): any[] {
    switch (this.periodicidad) {
      case 'Bienal':
        return this.bieniosOpciones;
      case 'Anual':
        return this.anosOpciones;
      case 'Mensual':
        return this.mesesOpciones;
      default:
        return [];
    }
  }

  // Getter para opciones dinámicas del dropdown de caracterización
  get opcionesCaracterizacion(): any[] {
    switch (this.caracterizacionSeleccionada) {
      case 'conceptoGasto':
        return this.conceptoGastoOpciones;
      case 'regional':
        return this.regionalOpciones;
      case 'asignacion':
        return this.asignacionOpciones;
      case 'grupoInteres':
        return this.grupoInteresOpciones;
      default:
        return [];
    }
  }

  // Método para manejar cambio de caracterización
  onCaracterizacionChange(nuevaCaracterizacion: string): void {
    this.caracterizacionSeleccionada = nuevaCaracterizacion;

    // Resetear el valor seleccionado a la primera opción de la nueva lista
    const opciones = this.opcionesCaracterizacion;
    if (opciones.length > 0) {
      this.valorCaracterizacionSeleccionado = opciones[0].value;
    }

    // Recargar datos con el nuevo filtro
    this.loadData();
  }

  // Método para manejar cambio en el dropdown de valor
  onValorCaracterizacionChange(): void {
    console.log('Valor de caracterización cambiado:', this.valorCaracterizacionSeleccionado);
    this.loadData();
  }

  // Método para manejar cambio en filtros de entidad (columna derecha)
  onEntidadChange(nuevaEntidad: string): void {
    console.log('Cambio de entidad detectado:', nuevaEntidad);
    this.entidadSeleccionada = nuevaEntidad;
    this.loadData();
  }

  // Método para manejar cambio de periodicidad
  onPeriodicidadChange(nuevaPeriodicidad: string): void {
    this.periodicidad = nuevaPeriodicidad;

    // Resetear el valor seleccionado a la primera opción de la nueva lista
    const opciones = this.opcionesPeriodicidad;
    if (opciones.length > 0) {
      this.valorPeriodicidadSeleccionado = opciones[0].value;
    }

    // Si es mensual, también resetear el año
    if (nuevaPeriodicidad === 'Mensual') {
      this.anoMensualSeleccionado = 2025;
    }

    this.loadData();
  }

  // Método para manejar cambio en el dropdown de periodicidad
  onValorPeriodicidadChange(): void {
    console.log('Valor de periodicidad cambiado:', this.valorPeriodicidadSeleccionado);
    this.loadData();
  }

  // Método para manejar cambio en el año mensual
  onAnoMensualChange(): void {
    console.log('Año mensual cambiado:', this.anoMensualSeleccionado);
    this.loadData();
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
