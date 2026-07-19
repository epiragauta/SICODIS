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
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { CalendarModule } from 'primeng/calendar';

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
    MultiSelectModule,
    ChipModule,
    CalendarModule,
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

  // Filtros de periodicidad (nuevo diseño en cascada)
  periodicidadActiva: {
    bienio: boolean;
    anio: boolean;
    mes: boolean;
  } = {
    bienio: true,  // Siempre activo por defecto
    anio: false,
    mes: false
  };

  // Valores seleccionados para cada nivel
  bieniosSeleccionados: string[] = ['2025-2026']; // Pre-seleccionado y bloqueado
  aniosSeleccionados: number[] = [];
  mesDesde: Date | null = null;  // Rango de meses: inicio
  mesHasta: Date | null = null;  // Rango de meses: fin

  // Propiedades calculadas (para evitar recalcular en cada change detection)
  aniosDisponibles: Array<{label: string, value: number}> = [];
  minDateMes: Date | undefined = undefined;
  maxDateMes: Date | undefined = undefined;

  // Caracterizaciones activas (ahora múltiples, no excluyentes)
  caracterizacionesActivas: {
    conceptoGasto: boolean;
    regional: boolean;
    asignacion: boolean;
    grupoInteres: boolean;
  } = {
    conceptoGasto: false,
    regional: false,
    asignacion: false,
    grupoInteres: false
  };

  // Valores seleccionados para cada caracterización
  valoresConceptoGasto: string[] = [];
  valoresRegional: string[] = [];
  valoresAsignacion: string[] = [];
  valoresGrupoInteres: string[] = [];

  entidadSeleccionada: string = 'beneficiario';
  presupuestoSeleccionado: string = 'total';
  recaudoSeleccionado: string = 'total';
  porcentajeDisponibilidad: number = 50;

  // Opciones para cada tipo de caracterización
  conceptoGastoOpciones = [
    { label: 'Todos', value: 'Todos' },
    { label: 'Inversión', value: 'Inversión' },
    { label: 'Ahorro', value: 'Ahorro' },
    { label: 'Administración', value: 'Administración ' }  // Nota: incluye espacio al final para coincidir con los datos
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

  // Opciones para periodicidad (nuevo diseño)
  bieniosOpciones = [
    { label: '2025-2026', value: '2025-2026', disabled: false },  // Tiene datos, no se puede desseleccionar
    { label: '2023-2024', value: '2023-2024', disabled: true },   // Placeholder futuro
    { label: '2021-2022', value: '2021-2022', disabled: true },
    { label: '2019-2020', value: '2019-2020', disabled: true },
    { label: '2017-2018', value: '2017-2018', disabled: true },
    { label: '2015-2016', value: '2015-2016', disabled: true },
    { label: '2013-2014', value: '2013-2014', disabled: true }
  ];

  // Métodos para actualizar propiedades calculadas
  private actualizarAniosDisponibles(): void {
    const anios: number[] = [];

    this.bieniosSeleccionados.forEach(bienio => {
      const [inicio, fin] = bienio.split('-').map(y => parseInt(y));
      if (!anios.includes(inicio)) anios.push(inicio);
      if (!anios.includes(fin)) anios.push(fin);
    });

    this.aniosDisponibles = anios
      .sort((a, b) => b - a)  // Ordenar descendente
      .map(anio => ({ label: anio.toString(), value: anio }));
  }

  private actualizarRangoFechasMes(): void {
    if (this.aniosSeleccionados.length === 0) {
      this.minDateMes = undefined;
      this.maxDateMes = undefined;
    } else {
      const minAnio = Math.min(...this.aniosSeleccionados);
      const maxAnio = Math.max(...this.aniosSeleccionados);
      this.minDateMes = new Date(minAnio, 0, 1);  // 1 de enero del año mínimo
      this.maxDateMes = new Date(maxAnio, 11, 31);  // 31 de diciembre del año máximo
    }
  }

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
    // Inicializar propiedades calculadas
    this.actualizarAniosDisponibles();
    this.actualizarRangoFechasMes();

    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Construir filtros combinando todas las caracterizaciones activas
    const filtros: FiltrosSGR = {};

    // 1. Filtros de Concepto de Gasto (si está activo)
    if (this.caracterizacionesActivas.conceptoGasto && this.valoresConceptoGasto.length > 0) {
      const conceptosGasto = this.valoresConceptoGasto.filter(v => v !== 'Todos');
      if (conceptosGasto.length > 0) {
        // Enviar todos los valores seleccionados
        filtros.conceptoGasto = conceptosGasto.length === 1 ? conceptosGasto[0] : conceptosGasto;
      }
    }

    // 2. Filtros de Regional (si está activo)
    if (this.caracterizacionesActivas.regional && this.valoresRegional.length > 0) {
      const regiones = this.valoresRegional.filter(v => v !== 'Todos');
      if (regiones.length > 0) {
        filtros.region = regiones.length === 1 ? regiones[0] : regiones;
      }
    }

    // 3. Filtros de Asignación (si está activo)
    if (this.caracterizacionesActivas.asignacion && this.valoresAsignacion.length > 0) {
      // Asignación usa el campo conceptoGasto
      // Si ya hay un filtro de conceptoGasto, dar prioridad a asignación
      if (this.valoresAsignacion.length > 0) {
        filtros.conceptoGasto = this.valoresAsignacion.length === 1 ? this.valoresAsignacion[0] : this.valoresAsignacion;
      }
    }

    // 4. Filtros de Grupo de Interés (si está activo)
    if (this.caracterizacionesActivas.grupoInteres && this.valoresGrupoInteres.length > 0) {
      const tiposEntidad = this.valoresGrupoInteres.filter(v =>
        ['Gobernación', 'Municipio', 'Corporación', 'Étnicos', 'Región'].includes(v)
      );
      if (tiposEntidad.length > 0) {
        filtros.tipoEntidad = tiposEntidad.length === 1 ? tiposEntidad[0] : tiposEntidad;
      }
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
    alert('Funcionalidad de exportación en desarrollo');
  }

  // Métodos para manejar cambios en filtros de periodicidad
  onPeriodicidadActivaChange(tipo: 'bienio' | 'anio' | 'mes', activo: boolean): void {
    this.periodicidadActiva[tipo] = activo;

    // Si se desactiva un nivel, limpiar sus valores y niveles dependientes
    if (!activo) {
      switch (tipo) {
        case 'bienio':
          // No permitir desactivar bienio si 2025-2026 está seleccionado
          if (this.bieniosSeleccionados.includes('2025-2026')) {
            this.periodicidadActiva.bienio = true;
            return;
          }
          this.bieniosSeleccionados = [];
          this.periodicidadActiva.anio = false;
          this.aniosSeleccionados = [];
          this.periodicidadActiva.mes = false;
          this.mesDesde = null;
          this.mesHasta = null;
          break;
        case 'anio':
          this.aniosSeleccionados = [];
          this.periodicidadActiva.mes = false;
          this.mesDesde = null;
          this.mesHasta = null;
          break;
        case 'mes':
          this.mesDesde = null;
          this.mesHasta = null;
          break;
      }
      this.loadData();
    }
  }

  onBieniosChange(): void {
    // Asegurar que 2025-2026 siempre esté seleccionado
    if (!this.bieniosSeleccionados.includes('2025-2026')) {
      this.bieniosSeleccionados.push('2025-2026');
    }

    // Actualizar años disponibles
    this.actualizarAniosDisponibles();

    // Limpiar años seleccionados que ya no están en los bienios
    const aniosValidos = this.aniosDisponibles.map(a => a.value);
    this.aniosSeleccionados = this.aniosSeleccionados.filter(a => aniosValidos.includes(a));

    // Actualizar rango de fechas para mes
    this.actualizarRangoFechasMes();

    this.loadData();
  }

  onAniosChange(): void {
    // Actualizar rango de fechas para el selector de mes
    this.actualizarRangoFechasMes();

    // Validar que los meses seleccionados estén en el rango de años
    if (this.mesDesde) {
      const anioDesde = this.mesDesde.getFullYear();
      if (!this.aniosSeleccionados.includes(anioDesde)) {
        this.mesDesde = null;
      }
    }

    if (this.mesHasta) {
      const anioHasta = this.mesHasta.getFullYear();
      if (!this.aniosSeleccionados.includes(anioHasta)) {
        this.mesHasta = null;
      }
    }

    this.loadData();
  }

  onMesDesdeChange(): void {
    // Validar que mesHasta sea posterior a mesDesde
    if (this.mesDesde && this.mesHasta && this.mesDesde > this.mesHasta) {
      this.mesHasta = null;
    }
    this.loadData();
  }

  onMesHastaChange(): void {
    // Validar que mesHasta sea posterior a mesDesde
    if (this.mesDesde && this.mesHasta && this.mesHasta < this.mesDesde) {
      this.mesDesde = null;
    }
    this.loadData();
  }

  // Métodos para manejar cambios en caracterizaciones
  onCaracterizacionChange(tipo: string, activo: boolean): void {
    // Actualizar estado de caracterización
    switch (tipo) {
      case 'conceptoGasto':
        this.caracterizacionesActivas.conceptoGasto = activo;
        if (!activo) this.valoresConceptoGasto = [];
        break;
      case 'regional':
        this.caracterizacionesActivas.regional = activo;
        if (!activo) this.valoresRegional = [];
        break;
      case 'asignacion':
        this.caracterizacionesActivas.asignacion = activo;
        if (!activo) this.valoresAsignacion = [];
        break;
      case 'grupoInteres':
        this.caracterizacionesActivas.grupoInteres = activo;
        if (!activo) this.valoresGrupoInteres = [];
        break;
    }

    // Recargar datos si se desactivó una caracterización
    if (!activo) {
      this.loadData();
    }
  }

  // Métodos para manejar cambios en valores de multiselect
  onValoresConceptoGastoChange(): void {
    this.loadData();
  }

  onValoresRegionalChange(): void {
    this.loadData();
  }

  onValoresAsignacionChange(): void {
    this.loadData();
  }

  onValoresGrupoInteresChange(): void {
    this.loadData();
  }

  // Método para manejar cambio en filtros de entidad (columna derecha)
  onEntidadChange(nuevaEntidad: string): void {
    this.entidadSeleccionada = nuevaEntidad;
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
    this.presupuestoSeleccionado = nuevoValor;
    // Los KPIs se actualizan automáticamente mediante los getters
  }

  onRecaudoSeleccionChange(nuevoValor: string): void {
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

  // Métodos para trazabilidad de filtros
  get filtrosActivos(): Array<{tipo: string, valor: string, icono: string}> {
    const filtros: Array<{tipo: string, valor: string, icono: string}> = [];

    // Bienios
    if (this.periodicidadActiva.bienio && this.bieniosSeleccionados.length > 0) {
      this.bieniosSeleccionados.forEach(bienio => {
        filtros.push({
          tipo: 'Bienio',
          valor: bienio,
          icono: 'pi-calendar'
        });
      });
    }

    // Años
    if (this.periodicidadActiva.anio && this.aniosSeleccionados.length > 0) {
      this.aniosSeleccionados.forEach(anio => {
        filtros.push({
          tipo: 'Año',
          valor: anio.toString(),
          icono: 'pi-calendar'
        });
      });
    }

    // Rango de meses
    if (this.periodicidadActiva.mes && (this.mesDesde || this.mesHasta)) {
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                     'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

      let rangoTexto = '';
      if (this.mesDesde && this.mesHasta) {
        const mesDesdeLabel = `${meses[this.mesDesde.getMonth()]} ${this.mesDesde.getFullYear()}`;
        const mesHastaLabel = `${meses[this.mesHasta.getMonth()]} ${this.mesHasta.getFullYear()}`;
        rangoTexto = `${mesDesdeLabel} - ${mesHastaLabel}`;
      } else if (this.mesDesde) {
        rangoTexto = `Desde ${meses[this.mesDesde.getMonth()]} ${this.mesDesde.getFullYear()}`;
      } else if (this.mesHasta) {
        rangoTexto = `Hasta ${meses[this.mesHasta.getMonth()]} ${this.mesHasta.getFullYear()}`;
      }

      if (rangoTexto) {
        filtros.push({
          tipo: 'Período',
          valor: rangoTexto,
          icono: 'pi-calendar'
        });
      }
    }

    // Concepto de Gasto
    if (this.caracterizacionesActivas.conceptoGasto && this.valoresConceptoGasto.length > 0) {
      this.valoresConceptoGasto.forEach(valor => {
        if (valor !== 'Todos') {
          filtros.push({
            tipo: 'Concepto de Gasto',
            valor: valor,
            icono: 'pi-tag'
          });
        }
      });
    }

    // Regional
    if (this.caracterizacionesActivas.regional && this.valoresRegional.length > 0) {
      this.valoresRegional.forEach(valor => {
        if (valor !== 'Todos') {
          filtros.push({
            tipo: 'Regional',
            valor: valor,
            icono: 'pi-map'
          });
        }
      });
    }

    // Asignación
    if (this.caracterizacionesActivas.asignacion && this.valoresAsignacion.length > 0) {
      this.valoresAsignacion.forEach(valor => {
        filtros.push({
          tipo: 'Asignación',
          valor: valor,
          icono: 'pi-briefcase'
        });
      });
    }

    // Grupo de Interés
    if (this.caracterizacionesActivas.grupoInteres && this.valoresGrupoInteres.length > 0) {
      this.valoresGrupoInteres.forEach(valor => {
        filtros.push({
          tipo: 'Grupo de Interés',
          valor: valor,
          icono: 'pi-sitemap'
        });
      });
    }

    // Entidad
    if (this.entidadSeleccionada && this.entidadSeleccionada !== 'beneficiario') {
      const entidadLabel = this.obtenerLabelEntidad(this.entidadSeleccionada);
      filtros.push({
        tipo: 'Entidad',
        valor: entidadLabel,
        icono: 'pi-users'
      });
    }

    // Presupuesto (solo si no es total)
    if (this.presupuestoSeleccionado !== 'total') {
      filtros.push({
        tipo: 'Presupuesto',
        valor: this.presupuestoSeleccionado === 'corriente' ? 'Corriente' : 'Otros',
        icono: 'pi-dollar'
      });
    }

    // Recaudo (solo si no es total)
    if (this.recaudoSeleccionado !== 'total') {
      filtros.push({
        tipo: 'Recaudo',
        valor: this.recaudoSeleccionado === 'corriente' ? 'Corriente' : 'Otros',
        icono: 'pi-money-bill'
      });
    }

    return filtros;
  }

  private obtenerLabelCaracterizacion(tipo: string): string {
    switch (tipo) {
      case 'conceptoGasto': return 'Concepto de Gasto';
      case 'regional': return 'Regional';
      case 'asignacion': return 'Asignación';
      case 'grupoInteres': return 'Grupo de Interés';
      default: return tipo;
    }
  }

  private obtenerLabelEntidad(tipo: string): string {
    switch (tipo) {
      case 'productoras': return 'Productoras';
      case 'pdet': return 'PDET';
      case 'zomac': return 'ZOMAC';
      case 'etnica': return 'Étnica';
      case 'capital': return 'Capital';
      case 'beneficiario': return 'Beneficiario';
      default: return tipo;
    }
  }

  removerFiltro(filtro: {tipo: string, valor: string}): void {
    // Remover filtro específico

    // Filtros de periodicidad
    if (filtro.tipo === 'Bienio') {
      // No permitir remover 2025-2026
      if (filtro.valor === '2025-2026') return;

      this.bieniosSeleccionados = this.bieniosSeleccionados.filter(b => b !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Año') {
      this.aniosSeleccionados = this.aniosSeleccionados.filter(a => a.toString() !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Período') {
      this.mesDesde = null;
      this.mesHasta = null;
      this.loadData();
      return;
    }

    // Remover de caracterizaciones
    if (filtro.tipo === 'Concepto de Gasto') {
      this.valoresConceptoGasto = this.valoresConceptoGasto.filter(v => v !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Regional') {
      this.valoresRegional = this.valoresRegional.filter(v => v !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Asignación') {
      this.valoresAsignacion = this.valoresAsignacion.filter(v => v !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Grupo de Interés') {
      this.valoresGrupoInteres = this.valoresGrupoInteres.filter(v => v !== filtro.valor);
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Entidad') {
      this.entidadSeleccionada = 'beneficiario';
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Presupuesto') {
      this.presupuestoSeleccionado = 'total';
      return;
    }

    if (filtro.tipo === 'Recaudo') {
      this.recaudoSeleccionado = 'total';
      return;
    }
  }

  limpiarTodosFiltros(): void {
    // Resetear filtros de periodicidad (mantener solo 2025-2026)
    this.bieniosSeleccionados = ['2025-2026'];
    this.aniosSeleccionados = [];
    this.mesDesde = null;
    this.mesHasta = null;
    this.periodicidadActiva.anio = false;
    this.periodicidadActiva.mes = false;

    // Resetear todos los filtros de caracterización
    this.valoresConceptoGasto = [];
    this.valoresRegional = [];
    this.valoresAsignacion = [];
    this.valoresGrupoInteres = [];

    // Resetear otros filtros
    this.entidadSeleccionada = 'beneficiario';
    this.presupuestoSeleccionado = 'total';
    this.recaudoSeleccionado = 'total';

    this.loadData();
  }
}
