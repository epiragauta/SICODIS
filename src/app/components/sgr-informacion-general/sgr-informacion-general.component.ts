import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, firstValueFrom } from 'rxjs';

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
import { SicodisApiService, SGRFechaActualizacionCorte, Vigencia } from '../../services/sicodis-api.service';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';

// Models
import { FiltrosSGR, DatosAgregados, EntidadCount, ResumenConcepto, Entidad } from '../../models/sgr-presupuesto.models';

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
    bienio: false,  // Filtro independiente y opcional (desacoplado de los KPIs)
    anio: false,
    mes: false
  };

  // Valores seleccionados para cada nivel
  bieniosSeleccionados: string[] = []; // Filtro de vigencias independiente (sin preselección)
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

  entidadSeleccionada: string = '';  // Tipo de entidad: '' = sin filtro de atributo

  // Beneficiario (tarjeta independiente): checkbox + multiselect de entidades
  beneficiarioActivo: boolean = false;
  beneficiariosSeleccionados: string[] = [];
  beneficiariosOpciones: Array<{ label: string; value: string }> = [];

  presupuestoSeleccionado: string = 'total';
  recaudoSeleccionado: string = 'total';
  porcentajeDisponibilidad: number = 50;

  // Opciones para cada tipo de caracterización
  // Nota: se elimina la opción "Todos" para evitar redundancia con el
  // "seleccionar todo" nativo del encabezado del p-multiselect (obs. mockup).
  conceptoGastoOpciones = [
    { label: 'Inversión', value: 'Inversión' },
    { label: 'Ahorro', value: 'Ahorro' },
    { label: 'Administración', value: 'Administración ' }  // Nota: incluye espacio al final para coincidir con los datos
  ];

  regionalOpciones = [
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

    // Si no hay bienios en el filtro, los años disponibles se derivan del último
    // bienio (para que el filtro de Año siga siendo utilizable de forma independiente).
    const bienios = this.bieniosSeleccionados.length > 0
      ? this.bieniosSeleccionados
      : [this.ultimoBienio];

    bienios.forEach(bienio => {
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

  // Resumen general de la consulta (desglose por concepto de gasto)
  resumenPorConcepto: ResumenConcepto[] = [];

  // Estados
  isLoading = signal(false);
  isExporting = signal(false);
  fechaReporte: string = '';

  // Fechas de actualización y corte de recaudo del SGR (dinámicas, mismo origen
  // que el componente presupuesto-y-recaudo). Se usan en el bloque de notas del Excel.
  fechaActualizacion: string = '';
  fechaCorteRecaudo: string = '';

  constructor(
    private sgrPresupuestoService: SgrPresupuestoService,
    private sicodisApiService: SicodisApiService
  ) {
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

    // Cargar opciones de beneficiarios (todas las entidades)
    this.cargarOpcionesBeneficiarios();

    // Datos fijos de la tarjeta "Información general" (solo bienio, no cambian con filtros)
    this.cargarDatosFijos();

    // Fechas de actualización / corte de recaudo (para el bloque de notas del Excel)
    this.cargarFechasActualizacionCorte();

    // Resumen inicial de la consulta
    this.loadData();
  }

  // Carga las fechas de actualización y corte de recaudo desde el API del SGR,
  // resolviendo primero el id de vigencia del último bienio (igual que
  // presupuesto-y-recaudo). Ante error (p. ej. CORS en desarrollo) se dejan vacías.
  private cargarFechasActualizacionCorte(): void {
    this.sicodisApiService.getSgrVigenciasQa()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vigencias: Vigencia[]) => {
          if (!vigencias || vigencias.length === 0) { return; }
          // Buscar la vigencia que corresponde al último bienio; si no, la primera (más reciente)
          const normalizar = (s: string) => (s || '').replace(/\s/g, '');
          const objetivo = normalizar(this.ultimoBienio);
          const vigencia = vigencias.find(v => normalizar(v.vigencia) === objetivo) ?? vigencias[0];

          this.sicodisApiService.getSGRFechasActualizacionCorteRecaudoIACVigencia(vigencia.id_vigencia)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (data: SGRFechaActualizacionCorte[]) => {
                if (data && data.length > 0) {
                  this.fechaActualizacion = data[0].fecha_actualizacion;
                  this.fechaCorteRecaudo = data[0].fecha_corte_recaudo;
                }
              },
              error: (err) => console.error('Error al cargar fechas de actualización/corte:', err)
            });
        },
        error: (err) => console.error('Error al cargar vigencias del SGR:', err)
      });
  }

  // Último bienio disponible (con datos). Los KPIs de la sección "Información
  // general del SGR" SIEMPRE corresponden a este bienio, de forma independiente
  // al filtro de vigencias de la consulta.
  get ultimoBienio(): string {
    const disponible = this.bieniosOpciones.find(b => !b.disabled);
    return disponible?.value ?? this.bieniosOpciones[0]?.value ?? '';
  }

  // Bienio de referencia para los KPIs / encabezado de la tarjeta de información general
  get bienioActual(): string {
    return this.ultimoBienio;
  }

  private cargarOpcionesBeneficiarios(): void {
    this.sgrPresupuestoService.getEntidades()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (entidades: Entidad[]) => {
          this.beneficiariosOpciones = entidades
            .map(e => ({ label: (e.nombre || '').trim(), value: e.codigo }))
            .sort((a, b) => a.label.localeCompare(b.label));
        },
        error: (error) => console.error('Error al cargar beneficiarios:', error)
      });
  }

  // Carga los totales del bienio para la tarjeta de información general (KPIs y entidades).
  // No se ven afectados por los filtros de la consulta específica.
  private cargarDatosFijos(): void {
    this.sgrPresupuestoService.getDatosAgregados({})
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (datos: DatosAgregados) => {
          this.entidadesCount = datos.entidadesCount;
          this.presupuestoMetricas = {
            presupuestoTotal: datos.presupuestoTotal,
            presupuestoCorriente: datos.presupuestoCorriente,
            presupuestoOtros: datos.presupuestoOtros,
            porcentajeDisponibilidad: datos.presupuestoTotal > 0
              ? (datos.presupuestoOtros / datos.presupuestoTotal) * 100
              : 0
          };
          this.recaudoMetricas = {
            recaudoTotal: datos.recaudoTotal,
            recaudoCorriente: datos.recaudoCorriente,
            recaudoOtros: datos.recaudoOtros
          };
        },
        error: (error) => console.error('Error al cargar datos fijos:', error)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Construye el objeto de filtros de la consulta a partir de la selección actual.
  private construirFiltros(): FiltrosSGR {
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

    // Aplicar filtros de entidad (columna derecha con radio buttons)
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

    // Filtro de beneficiario (entidades específicas seleccionadas en su tarjeta)
    if (this.beneficiarioActivo && this.beneficiariosSeleccionados.length > 0) {
      const seleccion = this.beneficiariosSeleccionados.filter(v => v !== 'TODAS');
      if (seleccion.length > 0) {
        filtros.codigosEntidad = seleccion;
      }
    }

    return filtros;
  }

  loadData(): void {
    this.isLoading.set(true);

    const filtros = this.construirFiltros();

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
    // Solo se actualiza el resumen de la consulta. Los KPIs y las tarjetas de
    // entidades (tarjeta "Información general") permanecen fijos al bienio y se
    // cargan en cargarDatosFijos().
    this.resumenPorConcepto = datos.resumenPorConcepto ?? [];
  }

  // Totales del resumen general (fila Total de la tabla)
  get resumenTotalPresupuesto(): number {
    return this.resumenPorConcepto.reduce((s, r) => s + r.presupuesto, 0);
  }

  get resumenTotalRecaudo(): number {
    return this.resumenPorConcepto.reduce((s, r) => s + r.recaudo, 0);
  }

  get resumenTotalRegistros(): number {
    return this.resumenPorConcepto.reduce((s, r) => s + r.registros, 0);
  }

  get resumenTotalAvance(): number {
    return this.resumenTotalPresupuesto > 0
      ? this.resumenTotalRecaudo / this.resumenTotalPresupuesto
      : 0;
  }



  // Aplica los filtros seleccionados (carga manual mediante el botón "Aplicar filtros")
  aplicarFiltros(): void {
    this.loadData();
  }

  // Genera un archivo Excel (.xlsx) con dos hojas:
  //  1) "Filtros aplicados": detalle de los filtros aplicados a la consulta.
  //  2) "Detalle": una fila por registro (entidad + concepto) con el desglose
  //     completo de presupuesto y recaudo, respetando los filtros.
  async exportarReporte(): Promise<void> {
    this.isExporting.set(true);
    try {
      // ExcelJS es CommonJS: en el build de producción (esbuild) el named import
      // no resuelve bien, por lo que se accede a través del default del módulo.
      const ExcelJSModule: any = await import('exceljs');
      const ExcelJS = ExcelJSModule.default ?? ExcelJSModule;
      const workbook: import('exceljs').Workbook = new ExcelJS.Workbook();
      workbook.creator = 'SICODIS';
      workbook.created = new Date();

      // Estilos/format reutilizables
      const NAVY = 'FF1E3A5F';
      const CLOUD = 'FFF1F5F9';

      // ===================== HOJA: Filtros aplicados =====================
      // Por ahora el reporte solo incluye el detalle de los filtros aplicados a
      // la consulta (sin indicadores generales ni conteo de entidades).
      const wsGen = workbook.addWorksheet('Filtros aplicados');
      wsGen.columns = [{ width: 28 }, { width: 70 }];

      let r = 1;
      const setMerged = (texto: string, font: Partial<import('exceljs').Font>) => {
        const cell = wsGen.getCell(`A${r}`);
        cell.value = texto;
        cell.font = font;
        wsGen.mergeCells(`A${r}:B${r}`);
        r++;
      };
      setMerged('SICODIS · SGR — Información General', { bold: true, size: 14, color: { argb: NAVY } });
      setMerged(`Reporte generado el ${this.fechaReporte}`, { italic: true, size: 10, color: { argb: 'FF6B7280' } });
      r++;

      const addSection = (titulo: string) => {
        ['A', 'B'].forEach((col, i) => {
          const cell = wsGen.getCell(`${col}${r}`);
          if (i === 0) {
            cell.value = titulo;
            cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
          }
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
        });
        wsGen.getRow(r).height = 18;
        r++;
      };

      addSection('Filtros aplicados a la consulta');
      ['A', 'B'].forEach((col, i) => {
        const cell = wsGen.getCell(`${col}${r}`);
        cell.value = i === 0 ? 'Filtro' : 'Valor(es) seleccionado(s)';
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CLOUD } };
      });
      r++;
      const filtros = this.filtrosDetallados;
      if (filtros.length === 0) {
        const cell = wsGen.getCell(`A${r}`);
        cell.value = 'Sin filtros aplicados';
        cell.font = { italic: true, color: { argb: 'FF6B7280' } };
        wsGen.mergeCells(`A${r}:B${r}`);
        r++;
      } else {
        filtros.forEach(f => {
          const cellL = wsGen.getCell(`A${r}`);
          cellL.value = f.tipo;
          cellL.font = { bold: true };
          cellL.alignment = { vertical: 'top' };
          const cellV = wsGen.getCell(`B${r}`);
          cellV.value = f.valor;
          cellV.alignment = { horizontal: 'left', vertical: 'top', wrapText: true };
          r++;
        });
      }

      // ===================== HOJA: Detalle =====================
      // Una fila por registro (entidad + concepto) con todo el desglose de
      // presupuesto y recaudo, respetando los filtros aplicados a la consulta.
      // Presentación tipo "Consolidado Nacional": bloque de notas + tabla.
      const MONEY_FMT = '"$" #,##0.00';
      const PCT_FMT = '0.00%';
      const HEADER_FILL = 'FFB8CCE4';          // Azul claro para encabezados
      const HEADER_FILL_CORRIENTE = 'FFDCE6F1'; // Azul más claro (Presupuesto Corriente)
      const SI_NO = (v: boolean) => (v ? 'Sí' : 'No');

      const registros = await firstValueFrom(
        this.sgrPresupuestoService.getRegistrosDetallados(this.construirFiltros())
      );

      const wsDet = workbook.addWorksheet('Detalle');

      // Definición de columnas (clave + ancho); los encabezados se escriben manualmente
      // más abajo para poder anteponer el bloque de notas.
      const detCols: Array<{ key: string; header: string; width: number; corriente?: boolean }> = [
        { key: 'vigencia', header: 'Vigencia', width: 12 },
        { key: 'region', header: 'Región', width: 22 },
        { key: 'codDepto', header: 'Cod Depto', width: 11 },
        { key: 'departamento', header: 'Departamento', width: 22 },
        { key: 'codigoEntidad', header: 'Código Entidad', width: 14 },
        { key: 'entidad', header: 'Entidad', width: 40 },
        { key: 'tipo', header: 'Tipo', width: 16 },
        { key: 'productor', header: 'Productor', width: 13 },
        { key: 'pdet', header: 'PDET', width: 10 },
        { key: 'capital', header: 'Capital', width: 9 },
        { key: 'concepto', header: 'Concepto', width: 42 },
        { key: 'presupuestoTotal', header: 'Presupuesto Total', width: 20 },
        { key: 'presupuestoCorriente', header: 'Presupuesto Corriente', width: 20, corriente: true },
        { key: 'disponibilidadInicial', header: 'Disponibilidad Inicial', width: 20 },
        { key: 'rendimientosFinancieros', header: 'Rendimientos Financieros', width: 22 },
        { key: 'desahorro', header: 'Desahorro', width: 16 },
        { key: 'reintegros', header: 'Reintegros', width: 16 },
        { key: 'mayorRecaudo', header: 'Mayor Recaudo', width: 18 },
        { key: 'mineralSinIdentificacion', header: 'Mineral sin identificación de origen', width: 30 },
        { key: 'multasSancionesIntereses', header: 'Multas, Sanciones e Intereses', width: 26 },
        { key: 'saldosVigenciasAnteriores', header: 'Saldos Vigencias Anteriores', width: 24 },
        { key: 'adicionModificacion', header: 'Adición y/o Modificación', width: 22 },
        { key: 'controversiasJudiciales', header: 'Controversias Judiciales', width: 22 },
        { key: 'recaudoCorriente', header: 'Recaudo Corriente', width: 20 },
        { key: 'avanceRecaudoCorriente', header: 'Avance Recaudo Corriente', width: 22 },
        { key: 'recaudoOtros', header: 'Recaudo Otros', width: 18 },
        { key: 'recaudoTotal', header: 'Recaudo Total', width: 20 },
        { key: 'avanceTotal', header: 'Avance Total', width: 14 }
      ];
      wsDet.columns = detCols.map(c => ({ key: c.key, width: c.width }));
      const totalCols = detCols.length;

      // ---- Bloque de notas (título, fuente, fechas y aclaraciones de columnas) ----
      // Nota: las referencias normativas y las fechas de actualización/corte
      // provienen del reporte oficial y se mantienen como texto fijo.
      const notas: Array<{ texto: string; font: Partial<import('exceljs').Font> }> = [
        { texto: 'Consolidado Nacional', font: { bold: true, size: 14, color: { argb: NAVY } } },
        { texto: 'Fuente: Subdirección de Distribución de Recursos Territoriales SDRT - DPIP', font: { size: 10 } },
        { texto: `Reporte generado el ${this.fechaReporte}`, font: { size: 10 } },
        ...(this.fechaActualizacion
          ? [{ texto: `Fecha de actualización: ${this.fechaActualizacion}`, font: { size: 10 } }]
          : []),
        ...(this.fechaCorteRecaudo
          ? [{ texto: `Fecha de corte de recaudo: ${this.fechaCorteRecaudo}`, font: { size: 10 } }]
          : []),
        { texto: '* Disponibilidad inicial: contiene lo establecido en los Decretos 379 y 0043 de 2025 y las Resoluciones 3158 y 1163 de 2025.', font: { size: 9, italic: true } },
        { texto: '* Rendimientos financieros: Contiene lo establecido en el numeral 2 del artículo 6 de la Ley 2441 de 2024, y los Decretos 0070 y 0854 de 2025, y 110 de 2026.', font: { size: 9, italic: true } },
        { texto: '* Reintegros: Contiene lo establecido en el numeral 2 del artículo 8 de la Ley 2441 de 2024, los Decretos 379 y 854 de 2025, la Resolución 1163 de 2025, y los Decretos 0110 y 0329 de 2026.', font: { size: 9, italic: true } },
        { texto: '* Saldos de vigencias anteriores: Contiene lo establecido en el numeral 4 del artículo 6 del Decreto 379 de 2025 (Excedentes de ahorro FAEP y FONPET) y el artículo 3 de la Ley 2441 de 2024.', font: { size: 9, italic: true } },
        { texto: '* Adición y/o modificación: Contiene lo establecido en el artículo 7 del Decreto 379 de 2025 y el Decreto 1336 de 2025.', font: { size: 9, italic: true } },
        { texto: '* Controversias judiciales: Conforme con lo establecido en el Decreto 1336 de 2025.', font: { size: 9, italic: true } }
      ];

      let dr = 1;
      notas.forEach(n => {
        const cell = wsDet.getCell(dr, 1);
        cell.value = n.texto;
        cell.font = n.font;
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
        dr++;
      });
      dr++; // fila en blanco antes de la tabla

      // ---- Encabezado de la tabla ----
      const headerRowNum = dr;
      const headerRow = wsDet.getRow(headerRowNum);
      detCols.forEach((c, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = c.header;
        cell.font = { bold: true, size: 10, color: { argb: 'FF1F2937' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: c.corriente ? HEADER_FILL_CORRIENTE : HEADER_FILL }
        };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFB0B7C3' } },
          bottom: { style: 'thin', color: { argb: 'FFB0B7C3' } },
          left: { style: 'thin', color: { argb: 'FFB0B7C3' } },
          right: { style: 'thin', color: { argb: 'FFB0B7C3' } }
        };
      });
      headerRow.height = 32;

      const MONEY_KEYS = [
        'presupuestoTotal', 'presupuestoCorriente', 'disponibilidadInicial', 'rendimientosFinancieros',
        'desahorro', 'reintegros', 'mayorRecaudo', 'mineralSinIdentificacion', 'multasSancionesIntereses',
        'saldosVigenciasAnteriores', 'adicionModificacion', 'controversiasJudiciales',
        'recaudoCorriente', 'recaudoOtros', 'recaudoTotal'
      ];

      const vigenciaLabel = this.ultimoBienio.replace('-', ' - ');

      // ---- Filas de datos ----
      registros.forEach(d => {
        const row = wsDet.addRow({
          vigencia: vigenciaLabel,
          region: d.region,
          codDepto: d.codDepto,
          departamento: d.departamento,
          codigoEntidad: d.codigoEntidad,
          entidad: d.entidad,
          tipo: d.tipo,
          productor: SI_NO(d.productor),
          pdet: SI_NO(d.pdet),
          capital: SI_NO(d.capital),
          concepto: d.concepto,
          presupuestoTotal: d.presupuestoTotal,
          presupuestoCorriente: d.presupuestoCorriente,
          disponibilidadInicial: d.disponibilidadInicial,
          rendimientosFinancieros: d.rendimientosFinancieros,
          desahorro: d.desahorro,
          reintegros: d.reintegros,
          mayorRecaudo: d.mayorRecaudo,
          mineralSinIdentificacion: d.mineralSinIdentificacion,
          multasSancionesIntereses: d.multasSancionesIntereses,
          saldosVigenciasAnteriores: d.saldosVigenciasAnteriores ?? '',
          adicionModificacion: d.adicionModificacion,
          controversiasJudiciales: d.controversiasJudiciales,
          recaudoCorriente: d.recaudoCorriente,
          avanceRecaudoCorriente: d.avanceRecaudoCorriente,
          recaudoOtros: d.recaudoOtros,
          recaudoTotal: d.recaudoTotal,
          avanceTotal: d.avanceTotal
        });
        MONEY_KEYS.forEach(k => { row.getCell(k).numFmt = MONEY_FMT; });
        row.getCell('avanceRecaudoCorriente').numFmt = PCT_FMT;
        row.getCell('avanceTotal').numFmt = PCT_FMT;
        ['productor', 'pdet', 'capital', 'codDepto'].forEach(k => {
          row.getCell(k).alignment = { horizontal: 'center' };
        });
      });

      // Congelar el encabezado de la tabla y habilitar autofiltro
      wsDet.views = [{ state: 'frozen', ySplit: headerRowNum }];
      wsDet.autoFilter = {
        from: { row: headerRowNum, column: 1 },
        to: { row: headerRowNum, column: totalCols }
      };

      // ===================== Descarga =====================
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fechaArchivo = new Date().toISOString().slice(0, 10);
      link.download = `SGR_Informacion_General_${this.bienioActual}_${fechaArchivo}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al exportar el reporte:', error);
    } finally {
      this.isExporting.set(false);
    }
  }

  // Métodos para manejar cambios en filtros de periodicidad
  onPeriodicidadActivaChange(tipo: 'bienio' | 'anio' | 'mes', activo: boolean): void {
    this.periodicidadActiva[tipo] = activo;

    // Si se desactiva un nivel, limpiar sus valores y niveles dependientes
    if (!activo) {
      switch (tipo) {
        case 'bienio':
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
      // La recarga se realiza al pulsar "Aplicar filtros"
    }
  }

  onBieniosChange(): void {
    // El filtro de bienios es independiente; no se fuerza ninguna selección.
    // Actualizar años disponibles
    this.actualizarAniosDisponibles();

    // Limpiar años seleccionados que ya no están en los bienios
    const aniosValidos = this.aniosDisponibles.map(a => a.value);
    this.aniosSeleccionados = this.aniosSeleccionados.filter(a => aniosValidos.includes(a));

    // Actualizar rango de fechas para mes
    this.actualizarRangoFechasMes();
    // La recarga se realiza al pulsar "Aplicar filtros"
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
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onMesDesdeChange(): void {
    // Validar que mesHasta sea posterior a mesDesde
    if (this.mesDesde && this.mesHasta && this.mesDesde > this.mesHasta) {
      this.mesHasta = null;
    }
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onMesHastaChange(): void {
    // Validar que mesHasta sea posterior a mesDesde
    if (this.mesDesde && this.mesHasta && this.mesHasta < this.mesDesde) {
      this.mesDesde = null;
    }
    // La recarga se realiza al pulsar "Aplicar filtros"
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

    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  // Métodos para manejar cambios en valores de multiselect
  onValoresConceptoGastoChange(): void {
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onValoresRegionalChange(): void {
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onValoresAsignacionChange(): void {
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onValoresGrupoInteresChange(): void {
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  // Método para manejar cambio en filtros de entidad (columna derecha)
  onEntidadChange(nuevaEntidad: string): void {
    this.entidadSeleccionada = nuevaEntidad;
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  // Beneficiario: al desactivar el checkbox se limpian las entidades seleccionadas
  onBeneficiarioChange(activo: boolean): void {
    this.beneficiarioActivo = activo;
    if (!activo) {
      this.beneficiariosSeleccionados = [];
    }
    // La recarga se realiza al pulsar "Aplicar filtros"
  }

  onBeneficiariosChange(): void {
    // La recarga se realiza al pulsar "Aplicar filtros"
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

    // Caracterización de la consulta: se referencia el título del elemento,
    // no los ítems detallados seleccionados (un chip por caracterización activa).
    if (this.caracterizacionesActivas.conceptoGasto && this.valoresConceptoGasto.length > 0) {
      filtros.push({ tipo: 'Caracterización', valor: 'Concepto de gasto', icono: 'pi-tag' });
    }
    if (this.caracterizacionesActivas.regional && this.valoresRegional.length > 0) {
      filtros.push({ tipo: 'Caracterización', valor: 'Regional', icono: 'pi-map' });
    }
    if (this.caracterizacionesActivas.asignacion && this.valoresAsignacion.length > 0) {
      filtros.push({ tipo: 'Caracterización', valor: 'Asignación', icono: 'pi-briefcase' });
    }
    if (this.caracterizacionesActivas.grupoInteres && this.valoresGrupoInteres.length > 0) {
      filtros.push({ tipo: 'Caracterización', valor: 'Grupo de interés', icono: 'pi-sitemap' });
    }

    // Entidad (Tipo de entidad)
    if (this.entidadSeleccionada) {
      const entidadLabel = this.obtenerLabelEntidad(this.entidadSeleccionada);
      filtros.push({
        tipo: 'Tipo de entidad',
        valor: entidadLabel,
        icono: 'pi-sitemap'
      });
    }

    // Beneficiario
    if (this.beneficiarioActivo) {
      const cantidad = this.beneficiariosSeleccionados.filter(v => v !== 'TODAS').length;
      filtros.push({
        tipo: 'Beneficiarios',
        valor: cantidad > 0 ? `${cantidad} seleccionado(s)` : 'Todas',
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

  // Filtros aplicados con el detalle de los valores seleccionados (para el Excel).
  // A diferencia de `filtrosActivos` (chips por categoría), aquí se listan los
  // valores concretos elegidos en cada filtro.
  get filtrosDetallados(): Array<{ tipo: string; valor: string }> {
    const filtros: Array<{ tipo: string; valor: string }> = [];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Periodicidad
    if (this.periodicidadActiva.bienio && this.bieniosSeleccionados.length > 0) {
      filtros.push({ tipo: 'Bienio', valor: this.bieniosSeleccionados.join(', ') });
    }
    if (this.periodicidadActiva.anio && this.aniosSeleccionados.length > 0) {
      const anios = [...this.aniosSeleccionados].sort((a, b) => b - a).join(', ');
      filtros.push({ tipo: 'Año', valor: anios });
    }
    if (this.periodicidadActiva.mes && (this.mesDesde || this.mesHasta)) {
      let rango = '';
      if (this.mesDesde && this.mesHasta) {
        rango = `${meses[this.mesDesde.getMonth()]} ${this.mesDesde.getFullYear()} - ${meses[this.mesHasta.getMonth()]} ${this.mesHasta.getFullYear()}`;
      } else if (this.mesDesde) {
        rango = `Desde ${meses[this.mesDesde.getMonth()]} ${this.mesDesde.getFullYear()}`;
      } else if (this.mesHasta) {
        rango = `Hasta ${meses[this.mesHasta.getMonth()]} ${this.mesHasta.getFullYear()}`;
      }
      if (rango) filtros.push({ tipo: 'Período mensual', valor: rango });
    }

    // Caracterización de la consulta (valores concretos)
    if (this.caracterizacionesActivas.conceptoGasto && this.valoresConceptoGasto.length > 0) {
      filtros.push({ tipo: 'Concepto de gasto', valor: this.valoresConceptoGasto.map(v => v.trim()).join(', ') });
    }
    if (this.caracterizacionesActivas.regional && this.valoresRegional.length > 0) {
      filtros.push({ tipo: 'Regional', valor: this.valoresRegional.join(', ') });
    }
    if (this.caracterizacionesActivas.asignacion && this.valoresAsignacion.length > 0) {
      filtros.push({ tipo: 'Asignación', valor: this.valoresAsignacion.map(v => v.trim()).join(', ') });
    }
    if (this.caracterizacionesActivas.grupoInteres && this.valoresGrupoInteres.length > 0) {
      filtros.push({ tipo: 'Grupo de interés', valor: this.valoresGrupoInteres.join(', ') });
    }

    // Tipo de entidad
    if (this.entidadSeleccionada) {
      filtros.push({ tipo: 'Tipo de entidad', valor: this.obtenerLabelEntidad(this.entidadSeleccionada) });
    }

    // Beneficiarios (nombres de las entidades seleccionadas)
    if (this.beneficiarioActivo) {
      const seleccion = this.beneficiariosSeleccionados.filter(v => v !== 'TODAS');
      if (seleccion.length > 0) {
        const nombres = seleccion
          .map(cod => this.beneficiariosOpciones.find(o => o.value === cod)?.label ?? cod)
          .join(', ');
        filtros.push({ tipo: 'Beneficiarios', valor: nombres });
      } else {
        filtros.push({ tipo: 'Beneficiarios', valor: 'Todas' });
      }
    }

    // Presupuesto / Recaudo (solo si no es total)
    if (this.presupuestoSeleccionado !== 'total') {
      filtros.push({ tipo: 'Presupuesto', valor: this.presupuestoSeleccionado === 'corriente' ? 'Corriente' : 'Otros' });
    }
    if (this.recaudoSeleccionado !== 'total') {
      filtros.push({ tipo: 'Recaudo', valor: this.recaudoSeleccionado === 'corriente' ? 'Corriente' : 'Otros' });
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
      this.bieniosSeleccionados = this.bieniosSeleccionados.filter(b => b !== filtro.valor);
      if (this.bieniosSeleccionados.length === 0) {
        this.periodicidadActiva.bienio = false;
      }
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
    // Caracterización: se limpia la caracterización referida por su título
    if (filtro.tipo === 'Caracterización') {
      switch (filtro.valor) {
        case 'Concepto de gasto':
          this.caracterizacionesActivas.conceptoGasto = false;
          this.valoresConceptoGasto = [];
          break;
        case 'Regional':
          this.caracterizacionesActivas.regional = false;
          this.valoresRegional = [];
          break;
        case 'Asignación':
          this.caracterizacionesActivas.asignacion = false;
          this.valoresAsignacion = [];
          break;
        case 'Grupo de interés':
          this.caracterizacionesActivas.grupoInteres = false;
          this.valoresGrupoInteres = [];
          break;
      }
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Tipo de entidad') {
      this.entidadSeleccionada = '';
      this.loadData();
      return;
    }

    if (filtro.tipo === 'Beneficiarios') {
      this.beneficiarioActivo = false;
      this.beneficiariosSeleccionados = [];
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
    // Resetear filtros de periodicidad (el bienio es opcional, sin preselección)
    this.bieniosSeleccionados = [];
    this.aniosSeleccionados = [];
    this.mesDesde = null;
    this.mesHasta = null;
    this.periodicidadActiva.bienio = false;
    this.periodicidadActiva.anio = false;
    this.periodicidadActiva.mes = false;

    // Resetear todos los filtros de caracterización
    this.valoresConceptoGasto = [];
    this.valoresRegional = [];
    this.valoresAsignacion = [];
    this.valoresGrupoInteres = [];

    // Resetear otros filtros
    this.entidadSeleccionada = '';
    this.beneficiarioActivo = false;
    this.beneficiariosSeleccionados = [];
    this.presupuestoSeleccionado = 'total';
    this.recaudoSeleccionado = 'total';

    this.loadData();
  }
}
