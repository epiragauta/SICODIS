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

  // Resumen general de la consulta (desglose por concepto de gasto)
  resumenPorConcepto: ResumenConcepto[] = [];

  // Estados
  isLoading = signal(false);
  isExporting = signal(false);
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

    // Cargar opciones de beneficiarios (todas las entidades)
    this.cargarOpcionesBeneficiarios();

    // Datos fijos de la tarjeta "Información general" (solo bienio, no cambian con filtros)
    this.cargarDatosFijos();

    // Resumen inicial de la consulta
    this.loadData();
  }

  // Bienio(s) seleccionado(s) para el título de la tarjeta de información general
  get bienioActual(): string {
    return this.bieniosSeleccionados.join(', ');
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

    // Filtro de beneficiario (entidades específicas seleccionadas en su tarjeta)
    if (this.beneficiarioActivo && this.beneficiariosSeleccionados.length > 0) {
      const seleccion = this.beneficiariosSeleccionados.filter(v => v !== 'TODAS');
      if (seleccion.length > 0) {
        filtros.codigosEntidad = seleccion;
      }
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
  //  1) "Información general": KPIs del bienio, conteo de entidades y filtros aplicados.
  //  2) "Detalle": desglose por concepto de gasto de la consulta (con la fila Total).
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
      const MONEY_FMT = '"$"#,##0';
      const PCT_FMT = '0.00%';
      const NUM_FMT = '#,##0';

      // ===================== HOJA 1: Información general =====================
      const wsGen = workbook.addWorksheet('Información general');
      wsGen.columns = [{ width: 42 }, { width: 26 }];

      let r = 1;
      const setMerged = (texto: string, font: Partial<import('exceljs').Font>) => {
        const cell = wsGen.getCell(`A${r}`);
        cell.value = texto;
        cell.font = font;
        wsGen.mergeCells(`A${r}:B${r}`);
        r++;
      };
      setMerged('SICODIS · SGR — Información General', { bold: true, size: 14, color: { argb: NAVY } });
      setMerged(`Bienio: ${this.bienioActual}`, { bold: true, size: 11 });
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
      const addRow = (label: string, value: string | number, fmt?: string, bold = false) => {
        const cellL = wsGen.getCell(`A${r}`);
        const cellV = wsGen.getCell(`B${r}`);
        cellL.value = label;
        cellV.value = value;
        if (fmt) cellV.numFmt = fmt;
        cellV.alignment = { horizontal: 'right' };
        if (bold) { cellL.font = { bold: true }; cellV.font = { bold: true }; }
        r++;
      };

      addSection('Indicadores generales (bienio)');
      addRow('Presupuesto Total', this.presupuestoMetricas.presupuestoTotal, MONEY_FMT, true);
      addRow('   Presupuesto Corriente', this.presupuestoMetricas.presupuestoCorriente, MONEY_FMT);
      addRow('   Presupuesto Otros', this.presupuestoMetricas.presupuestoOtros, MONEY_FMT);
      addRow('Recaudo Total', this.recaudoMetricas.recaudoTotal, MONEY_FMT, true);
      addRow('   Recaudo Corriente', this.recaudoMetricas.recaudoCorriente, MONEY_FMT);
      addRow('   Recaudo Otros', this.recaudoMetricas.recaudoOtros, MONEY_FMT);
      const avanceFrac = this.presupuestoMetricas.presupuestoTotal > 0
        ? this.recaudoMetricas.recaudoTotal / this.presupuestoMetricas.presupuestoTotal
        : 0;
      addRow('Avance de Recaudo', avanceFrac, PCT_FMT, true);
      r++;

      addSection('Entidades');
      addRow('Beneficiarias', this.entidadesCount.beneficiarias, NUM_FMT);
      addRow('Entidades Productoras', this.entidadesCount.productoras, NUM_FMT);
      addRow('Entidades ZOMAC', this.entidadesCount.zomac, NUM_FMT);
      addRow('Entidades PDET', this.entidadesCount.pdet, NUM_FMT);
      addRow('Entidades con destinación Étnica', this.entidadesCount.etnicas, NUM_FMT);
      r++;

      addSection('Filtros aplicados a la consulta');
      ['A', 'B'].forEach((col, i) => {
        const cell = wsGen.getCell(`${col}${r}`);
        cell.value = i === 0 ? 'Tipo' : 'Valor';
        cell.font = { bold: true };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CLOUD } };
      });
      r++;
      const filtros = this.filtrosActivos;
      if (filtros.length === 0) {
        wsGen.getCell(`A${r}`).value = 'Sin filtros adicionales';
        wsGen.mergeCells(`A${r}:B${r}`);
        r++;
      } else {
        filtros.forEach(f => {
          wsGen.getCell(`A${r}`).value = f.tipo;
          const cellV = wsGen.getCell(`B${r}`);
          cellV.value = f.valor;
          cellV.alignment = { horizontal: 'left', wrapText: true };
          r++;
        });
      }

      // ===================== HOJA 2: Detalle =====================
      const wsDet = workbook.addWorksheet('Detalle');
      wsDet.columns = [
        { header: 'Concepto de gasto', key: 'concepto', width: 34 },
        { header: 'Presupuesto', key: 'presupuesto', width: 24 },
        { header: 'Recaudo', key: 'recaudo', width: 24 },
        { header: '% Avance', key: 'avance', width: 14 },
        { header: 'Registros', key: 'registros', width: 14 }
      ];
      const headerRow = wsDet.getRow(1);
      headerRow.eachCell(cell => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
      headerRow.height = 20;

      this.resumenPorConcepto.forEach(fila => {
        const row = wsDet.addRow({
          concepto: fila.concepto,
          presupuesto: fila.presupuesto,
          recaudo: fila.recaudo,
          avance: fila.avance,
          registros: fila.registros
        });
        row.getCell('presupuesto').numFmt = MONEY_FMT;
        row.getCell('recaudo').numFmt = MONEY_FMT;
        row.getCell('avance').numFmt = PCT_FMT;
        row.getCell('registros').numFmt = NUM_FMT;
      });

      if (this.resumenPorConcepto.length > 0) {
        const totalRow = wsDet.addRow({
          concepto: 'Total',
          presupuesto: this.resumenTotalPresupuesto,
          recaudo: this.resumenTotalRecaudo,
          avance: this.resumenTotalAvance,
          registros: this.resumenTotalRegistros
        });
        totalRow.eachCell(cell => {
          cell.font = { bold: true };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: CLOUD } };
        });
        totalRow.getCell('presupuesto').numFmt = MONEY_FMT;
        totalRow.getCell('recaudo').numFmt = MONEY_FMT;
        totalRow.getCell('avance').numFmt = PCT_FMT;
        totalRow.getCell('registros').numFmt = NUM_FMT;
      }

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
      // La recarga se realiza al pulsar "Aplicar filtros"
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
    this.entidadSeleccionada = '';
    this.beneficiarioActivo = false;
    this.beneficiariosSeleccionados = [];
    this.presupuestoSeleccionado = 'total';
    this.recaudoSeleccionado = 'total';

    this.loadData();
  }
}
