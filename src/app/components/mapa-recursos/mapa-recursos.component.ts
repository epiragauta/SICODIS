import { Component, OnInit, AfterViewInit, signal, computed, inject, DestroyRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ChartModule } from 'primeng/chart';
import { ChartData, ChartOptions } from 'chart.js';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { RadioButtonModule } from 'primeng/radiobutton';
import {
  SicodisApiService,
  ResumenGeovisor
} from '../../services/sicodis-api.service';

const COBERTURA_FALLBACK: Record<string, string[]> = {
  SGR: [
    '32 departamentos - asignaciones directas (100%)',
    '32 departamentos - regional (100% del país)',
    '1001 municipios - asignaciones directas (96% del país)',
    '1001 municipios - local (96% del país)'
  ],
  SGP: ['32 departamentos beneficiarios (100% del país)', '908 municipios (87% del país)'],
  PGN: ['32 Departamentos (100% del país)', '32 departamentos beneficiarios (100% del país)']
};

interface RecursosSistema {
  sigla: string;
  nombre: string;
  total: number;
  presupuesto: number;
  recaudo: number;
  cobertura: string;
  icono: string;
  color: string;
}

interface CoberturaSistema {
  sigla: string;
  lineas: string[];
  color: string;
}

interface VisualizacionCapa {
  sistema: string;
  visible: boolean;
  opacidad: number;
  color: string;
}

interface DeptResult {
  codigoDepto: string;
  nombre: string;
  centroid: L.LatLngExpression;
  data: ResumenGeovisor | null;
}

const SISTEMA_COLORES: Record<string, string> = {
  SGR: '#3b82f6',
  SGP: '#10b981',
  PGN: '#f59e0b'
};

// Paleta cálida tomada del componente reporte-funcionamiento, usada en las tortas
const COLORES_REPORTE = {
  naranja: '#E07800',
  naranjaOscuro: '#D9520A',
  ambar: '#F0A500',
  rojo: '#D74641',
  rojoOscuro: '#8F2B2B',
  restante: '#eae1e1'
};

// Paleta oficial SICODIS por participación SGP (tomada de reports-sgp.component.ts)
// Se asigna por coincidencia del nombre del concepto de nivel superior.
const COLORES_SGP_PARTICIPACION: Array<{ match: string; color: string }> = [
  { match: 'educaci', color: '#156082' },
  { match: 'salud', color: '#e97132' },
  { match: 'agua', color: '#0c9bd3' },
  { match: 'prop', color: '#196b24' },
  { match: 'especial', color: '#a02b93' }
];

// Nodo del árbol desplegable de asignaciones (SGR) / participaciones (SGP)
interface NodoArbol {
  key: string;        // categoria (SGR) o id_concepto (SGP)
  concepto: string;
  nivel: number;      // 0 = raíz
  color: string;      // color SICODIS heredado del nodo raíz
  hijos: NodoArbol[];
  raw: any;           // registro original del API
}

@Component({
  selector: 'app-mapa-recursos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    DropdownModule,
    SliderModule,
    ButtonModule,
    ProgressBarModule,
    InputSwitchModule,
    RadioButtonModule,
    ChartModule
  ],
  templateUrl: './mapa-recursos.component.html',
  styleUrl: './mapa-recursos.component.scss'
})
export class MapaRecursosComponent implements OnInit, AfterViewInit {
  private readonly sicodisApi = inject(SicodisApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);
  private readonly ngZone = inject(NgZone);

  vigenciaSeleccionada = 2026;
  vigencias: number[] = [];

  visualizacionActiva = true;

  // TODO: reemplazar con la URL real del manual de usuario cuando esté disponible
  private readonly MANUAL_USUARIO_URL = '';

  capas: VisualizacionCapa[] = [
    { sistema: 'SGR', visible: true, opacidad: 80, color: SISTEMA_COLORES['SGR'] },
    { sistema: 'SGP', visible: true, opacidad: 80, color: SISTEMA_COLORES['SGP'] },
    { sistema: 'PGN', visible: true, opacidad: 80, color: SISTEMA_COLORES['PGN'] }
  ];

  recursos: RecursosSistema[] = this.buildFallbackRecursos();
  coberturas: CoberturaSistema[] = this.buildCoberturas();

  isLoading = signal(false);
  isLoadingMapa = signal(false);
  isLoadingDetalle = signal(false);
  sinMunicipiosGeoJSON = signal(false);
  hasGeoData = false;

  // ── Modo detalle ──────────────────────────────────────────────────────────────
  readonly sistemaColores = SISTEMA_COLORES;
  readonly sistemasDetalle: Array<'SGR' | 'SGP' | 'PGN'> = ['SGR', 'SGP', 'PGN'];

  modoDetalle = false;
  detalleDepto: { nombre: string; codigoDepto: string } | null = null;
  sistemaDetalle: 'SGR' | 'SGP' | 'PGN' = 'SGR';

  // Norma (Ley o Decreto) que rige cada bienio del SGR, indexada por el año inicial
  // del bienio. Reutiliza el mapeo de sgr-plan-bienal-recursos para que la nota (2)
  // corresponda a la vigencia consultada.
  private static readonly NORMA_POR_ANIO_INICIAL: Record<string, string> = {
    '2025': 'Ley 2441 de 2024',
    '2023': 'Ley 2279 de 2022',
    '2021': 'Ley 2072 de 2020',
    '2019': 'Ley 1942 de 2018',
    '2017': 'Decreto 2190 de 2016',
    '2015': 'Ley 1744 de 2014',
    '2013': 'Ley 1606 de 2012'
  };

  // Norma del bienio al que pertenece la vigencia consultada (el año inicial del
  // bienio es el año impar: p. ej. 2024 y 2023 pertenecen al bienio que inicia en 2023).
  private get normaVigenciaSGR(): string {
    const anioInicial = this.vigenciaSeleccionada % 2 === 1
      ? this.vigenciaSeleccionada
      : this.vigenciaSeleccionada - 1;
    return MapaRecursosComponent.NORMA_POR_ANIO_INICIAL[String(anioInicial)] ?? '';
  }

  // Notas del panel de detalle, tomadas de los componentes sgr-inicio y sgp-inicio.
  // Se muestran según el sistema seleccionado y corresponden a la vigencia consultada.
  get notasDetalle(): string[] {
    if (this.sistemaDetalle === 'SGR') {
      const norma = this.normaVigenciaSGR;
      return [
        '(1) Cifras en miles de millones de pesos corrientes.',
        norma
          ? `(2) Fuente: ${norma}, Sistema General de Regalías.`
          : '(2) Sistema General de Regalías.'
      ];
    }
    if (this.sistemaDetalle === 'SGP') {
      return [
        '(1) Cifras en miles de millones de pesos corrientes.',
        `(2) Distribución de la vigencia ${this.vigenciaSeleccionada}. Los recursos pendientes por distribuir corresponden a una parte de las doce doceavas de la participación para educación y a las once doceavas de la asignación especial para el FONPET.`
      ];
    }
    return [
      '(1) Cifras en pesos corrientes.',
      `(2) Fuente: DNP - DPIP - SDRT a partir del Presupuesto General de la Nación ${this.vigenciaSeleccionada} y reportes de regionalización presupuestal.`
    ];
  }

  detalleData: ResumenGeovisor | null = null;
  municipioSeleccionado: { nombre: string; codigoMunicipio: string } | null = null;
  municipioData: ResumenGeovisor | null = null;
  isLoadingMunicipio = signal(false);
  readonly isLoadingPanel = computed(() => this.isLoadingDetalle() || this.isLoadingMunicipio());
  private municipioLayerActivo: any = null;
  private municipioPopup: L.Popup | null = null;

  // Selección múltiple funcional: los checks del árbol filtran qué asignaciones
  // se muestran en el pop-up del municipio y en el panel derecho.
  seleccionSGR = new Set<string>();
  seleccionSGP = new Set<string>();
  // Nodos expandidos del árbol desplegable (por key)
  expandidos = new Set<string>();

  // ── Gráfica de torta (panel derecho) ───────────────────────────────────────────
  pieData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  pieOptions: ChartOptions<'doughnut'> = {};
  tienePieData = false;
  private readonly paletaSectores = [
    COLORES_REPORTE.naranjaOscuro, COLORES_REPORTE.naranja, COLORES_REPORTE.ambar,
    COLORES_REPORTE.rojo, COLORES_REPORTE.rojoOscuro,
    '#B45309', '#7C2D12', '#C2410C', '#A16207', '#9A3412'
  ];

  get activeData(): ResumenGeovisor | null {
    return this.municipioSeleccionado ? this.municipioData : this.detalleData;
  }

  opacidadMunicipios = 70;
  private municipiosGeoJSON: any = null;
  private municipiosLayer: L.GeoJSON | null = null;

  private map!: L.Map;
  private geoJsonLayer: L.GeoJSON | null = null;
  private circleMarkers: L.Layer[] = [];
  private deptResults: DeptResult[] = [];
  private maxValue = 0;
  private capitalesMap = new Map<string, L.LatLngExpression>();

  ngOnInit(): void {
    this.sicodisApi.limpiarCacheGeovisor();
    this.generarVigencias();
    this.cargarResumenNacional();
    this.configurarPieOptions();
  }

  private configurarPieOptions(): void {
    this.pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      // Margen interno para que las etiquetas de porcentaje de los bordes no se recorten
      layout: { padding: 10 },
      plugins: {
        // La leyenda se oculta para no solaparse con el texto/tarjetas debajo del
        // donut; el color→concepto se identifica por los % sobre el donut, el árbol
        // de la izquierda y las tarjetas de detalle de la selección.
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => {
              const val = Number(ctx.parsed) || 0;
              const ds = (ctx.dataset?.data ?? []) as number[];
              const total = ds.reduce((s, v) => s + (Number(v) || 0), 0);
              const pct = total > 0 ? (val / total) * 100 : 0;
              return `${ctx.label}: $${this.formatearMilesMillones(val)} mm (${pct.toFixed(1)}%)`;
            }
          }
        },
        // El plugin datalabels está registrado globalmente (main.ts) y por defecto
        // pinta el valor crudo sobre cada porción; mostramos el porcentaje en su lugar.
        datalabels: {
          // Texto oscuro sobre la porción gris clara "restante"; blanco en el resto
          color: (ctx: any) => {
            const bg = ctx.dataset?.backgroundColor?.[ctx.dataIndex];
            return bg === COLORES_REPORTE.restante ? '#6b5e5e' : '#ffffff';
          },
          font: { weight: 'bold', size: 11 },
          formatter: (value: number, ctx: any) => {
            const ds = (ctx.dataset?.data ?? []) as number[];
            const total = ds.reduce((s, v) => s + (Number(v) || 0), 0);
            const pct = total > 0 ? (Number(value) / total) * 100 : 0;
            return pct >= 5 ? `${pct.toFixed(0)}%` : '';
          }
        }
      } as any
    };
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  generarVigencias(): void {
    const base = 2026;
    for (let i = 0; i < 4; i++) this.vigencias.push(base - i);
  }

  // ── Summary cards ────────────────────────────────────────────────────────────

  cargarResumenNacional(): void {
    this.isLoading.set(true);
    this.sicodisApi.getGeovisorResumen(this.vigenciaSeleccionada, 0, 0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.recursos = this.mapearRecursosNacionales(data);
          this.coberturas = this.mapearCoberturas(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.recursos = this.buildFallbackRecursos();
          this.coberturas = this.buildCoberturas();
          this.isLoading.set(false);
        }
      });
  }

  private mapearRecursosNacionales(data: ResumenGeovisor): RecursosSistema[] {
    const sgrTotal = data.sgr.find(d => d.categoria === '-2');
    const sgpTotal = data.sgp.find(d => d.id_concepto === '99');
    const pgn = data.pgn?.[0];

    return [
      {
        sigla: 'SGR',
        nombre: 'Sistema General de Regalías',
        total: sgrTotal?.presupuesto_total_vigente ?? 0,
        presupuesto: sgrTotal?.presupuesto_total_vigente ?? 0,
        recaudo: sgrTotal?.caja_total ?? 0,
        cobertura: `Avance: ${((sgrTotal?.avance_iac_presupuesto ?? 0) * 100).toFixed(1)}%`,
        icono: 'pi pi-wallet',
        color: SISTEMA_COLORES['SGR']
      },
      {
        sigla: 'SGP',
        nombre: 'Sistema General de Participaciones',
        total: sgpTotal?.total ?? 0,
        presupuesto: sgpTotal?.total ?? 0,
        recaudo: sgpTotal?.total ?? 0,
        cobertura: `Vigencia ${data.sgp[0]?.annio ?? this.vigenciaSeleccionada}`,
        icono: 'pi pi-chart-bar',
        color: SISTEMA_COLORES['SGP']
      },
      {
        sigla: 'PGN',
        nombre: 'Presupuesto General de la Nación',
        total: pgn?.total_apropiacion_vigente ?? 0,
        presupuesto: pgn?.total_compromisos ?? 0,
        recaudo: pgn?.total_pagos ?? 0,
        cobertura: `Compromisos: ${(pgn?.porcentaje_total_compromisos ?? 0).toFixed(1)}%`,
        icono: 'pi pi-briefcase',
        color: SISTEMA_COLORES['PGN']
      }
    ];
  }

  calcularPorcentaje(valor: number, total: number): number {
    if (!total) return 0;
    return Math.min(100, (valor / total) * 100);
  }

  etiquetaSegundaBarra(sigla: string): string {
    switch (sigla) {
      case 'SGR': return 'Recaudo';
      case 'SGP': return 'Distribución';
      case 'PGN': return 'Comprometido';
      default: return 'Caja';
    }
  }

  private buildCoberturas(): CoberturaSistema[] {
    return [
      { sigla: 'SGR', lineas: COBERTURA_FALLBACK['SGR'], color: SISTEMA_COLORES['SGR'] },
      { sigla: 'SGP', lineas: COBERTURA_FALLBACK['SGP'], color: SISTEMA_COLORES['SGP'] },
      { sigla: 'PGN', lineas: COBERTURA_FALLBACK['PGN'], color: SISTEMA_COLORES['PGN'] }
    ];
  }

  // Obs. 6: las asignaciones directas del SGR corresponden al 20%; se anota en la
  // línea de cobertura ("A. Directas" → "A. Directas 20%") sin duplicar si ya lo trae.
  private agregar20ADirectas(linea: string): string {
    if (!linea || /A\.\s*Directas\s*20\s*%/i.test(linea)) return linea;
    return linea.replace(/(A\.\s*Directas)/i, '$1 20%');
  }

  private mapearCoberturas(data: ResumenGeovisor): CoberturaSistema[] {
    const sgr = data.sgr_beneficiados?.[0];
    const sgp = data.sgp_beneficiados?.[0];
    const pgn = data.pgn_beneficiados?.[0];

    return [
      {
        sigla: 'SGR',
        lineas: [
          sgr?.dato_general_adirectas_depto     || COBERTURA_FALLBACK['SGR'][0],
          sgr?.dato_general_regional_depto      || COBERTURA_FALLBACK['SGR'][1],
          sgr?.dato_general_adirectas_municipio || COBERTURA_FALLBACK['SGR'][2],
          sgr?.dato_general_local_municipio     || COBERTURA_FALLBACK['SGR'][3],
        ].map(l => this.agregar20ADirectas(l)),
        color: SISTEMA_COLORES['SGR']
      },
      {
        sigla: 'SGP',
        lineas: [
          sgp?.dato_general_depto     || COBERTURA_FALLBACK['SGP'][0],
          sgp?.dato_general_municipio || COBERTURA_FALLBACK['SGP'][1],
        ],
        color: SISTEMA_COLORES['SGP']
      },
      {
        sigla: 'PGN',
        lineas: [
          pgn?.dato_general_depto     || COBERTURA_FALLBACK['PGN'][0],
          pgn?.dato_general_municipio || COBERTURA_FALLBACK['PGN'][1],
        ],
        color: SISTEMA_COLORES['PGN']
      }
    ];
  }

  // ── Map initialization ────────────────────────────────────────────────────────

  initMap(): void {
    L.Icon.Default.imagePath = 'assets/leaflet/';
    this.map = L.map('mapaRecursos', {
      center: [4.570868, -74.297333],
      zoom: 6,
      zoomControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(this.map);

    L.control.zoom({ position: 'topleft' }).addTo(this.map);

    this.cargarGeoJsonYDepartamentos();

    this.destroyRef.onDestroy(() => this.map?.remove());
  }

  // ── GeoJSON + department data ─────────────────────────────────────────────────

  private cargarGeoJsonYDepartamentos(): void {
    this.isLoadingMapa.set(true);

    forkJoin({
      deptos: this.http.get<any>('/assets/data/departamentos.geojson'),
      capitales: this.http.get<any>('/assets/data/capitales.geojson')
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ deptos, capitales }) => {
          capitales.features.forEach((f: any) => {
            const [lon, lat] = f.geometry.coordinates;
            this.capitalesMap.set(f.properties.codigoDepto, [lat, lon]);
          });
          this.hasGeoData = true;
          this.agregarCapaCoropleta(deptos);
          this.cargarDatosDepartamentos(deptos.features);
        },
        error: () => this.isLoadingMapa.set(false)
      });
  }

  private agregarCapaCoropleta(geojson: any): void {
    this.geoJsonLayer = L.geoJSON(geojson, {
      style: (feature) => this.getDeptStyle(feature),
      onEachFeature: (feature, layer) => {
        layer.on({
          mouseover: (e: any) => {
            if (this.modoDetalle) return;
            e.target.setStyle({ weight: 2, color: '#475569', fillOpacity: Math.min(0.75, (this.getDeptFillOpacity(feature) + 0.15)) });
          },
          mouseout: () => {
            if (this.modoDetalle) return;
            this.geoJsonLayer?.resetStyle(layer);
          }
        });
      }
    }).addTo(this.map);
  }

  private cargarDatosDepartamentos(features: any[]): void {
    const requests = features.map((feature: any) => {
      const cod: string = feature.properties.cod ?? '0';
      const codigoDepto = cod.padStart(2, '0') + '000';
      const nombre: string = this.acortarNombreDepto(feature.properties.nombre ?? '');
      const centroid = this.capitalesMap.get(codigoDepto) ?? this.computeCentroid(feature);

      return this.sicodisApi.getGeovisorResumen(this.vigenciaSeleccionada, codigoDepto, 0).pipe(
        map(data => ({ codigoDepto, nombre, centroid, data } as DeptResult)),
        catchError(() => of({ codigoDepto, nombre, centroid, data: null } as DeptResult))
      );
    });

    forkJoin(requests)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (results) => {
          this.deptResults = results;
          this.actualizarVisualizacion();
          this.isLoadingMapa.set(false);
        },
        error: () => this.isLoadingMapa.set(false)
      });
  }

  // ── Visualization ─────────────────────────────────────────────────────────────

  private actualizarVisualizacion(): void {
    // Compute max value for normalization
    this.maxValue = this.deptResults.reduce((max, r) => {
      const v = r.data ? this.extractTotalValue(r.data) : 0;
      return v > max ? v : max;
    }, 0);

    // Update choropleth
    this.geoJsonLayer?.setStyle((f) => this.getDeptStyle(f));

    // Rebuild proportional circles
    this.circleMarkers.forEach(m => m.remove());
    this.circleMarkers = [];

    if (!this.visualizacionActiva) return;

    this.deptResults.forEach(result => {
      if (!result.data) return;

      const value = this.extractTotalValue(result.data);
      if (!value || !Number.isFinite(value)) return;

      const radius = this.getCircleRadius(value);
      const segmentos = this.extraerSegmentosPie(result.data);
      const pad = 2;
      const iconSize = radius * 2 + pad * 2;

      const marker = L.marker(result.centroid, {
        icon: L.divIcon({
          html: this.crearSvgPie(segmentos, radius),
          className: 'marcador-pie',
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconSize / 2, iconSize / 2]
        })
      });

      marker.on('click', () => {
        this.mostrarPopupDepartamento(marker.getLatLng(), result.nombre, result.codigoDepto, result.data!);
      });

      marker.addTo(this.map);
      this.circleMarkers.push(marker);
    });
  }

  private extractTotalValue(data: ResumenGeovisor): number {
    let total = 0;
    const sgrCapa = this.capas.find(c => c.sistema === 'SGR');
    const sgpCapa = this.capas.find(c => c.sistema === 'SGP');
    const pgnCapa = this.capas.find(c => c.sistema === 'PGN');

    if (sgrCapa?.visible && Array.isArray(data.sgr)) {
      const v = data.sgr.find(d => d.categoria === '-2')?.caja_total ?? 0;
      if (Number.isFinite(v)) total += v;
    }
    if (sgpCapa?.visible && Array.isArray(data.sgp)) {
      const v = data.sgp.find(d => d.id_concepto === '99')?.total ?? 0;
      if (Number.isFinite(v)) total += v;
    }
    if (pgnCapa?.visible && Array.isArray(data.pgn)) {
      const v = data.pgn[0]?.total_apropiacion_vigente ?? 0;
      if (Number.isFinite(v)) total += v;
    }
    return total;
  }

  private getDeptStyle(feature: any): L.PathOptions {
    return {
      fillColor: this.getDominantColor(),
      fillOpacity: this.getDeptFillOpacity(feature),
      color: '#94a3b8',
      weight: 0.8,
      dashArray: '3'
    };
  }

  private getDeptFillOpacity(feature: any): number {
    const cod: string = feature?.properties?.cod ?? '0';
    const codigoDepto = cod.padStart(2, '0') + '000';
    const result = this.deptResults.find(r => r.codigoDepto === codigoDepto);
    const value = result?.data ? this.extractTotalValue(result.data) : 0;
    const ratio = this.maxValue > 0 ? value / this.maxValue : 0;
    return 0.06 + ratio * 0.54;
  }

  private getDominantColor(): string {
    const visible = this.capas.filter(c => c.visible);
    if (visible.length === 1) return SISTEMA_COLORES[visible[0].sistema] ?? '#7c3aed';
    return '#7c3aed';
  }

  private getCircleRadius(value: number): number {
    const ratio = this.maxValue > 0 ? value / this.maxValue : 0;
    return 4 + ratio * 32;
  }

  private extraerSegmentosPie(data: ResumenGeovisor): Array<{valor: number, color: string, opacidad: number}> {
    const segmentos: Array<{valor: number, color: string, opacidad: number}> = [];
    const sgrCapa = this.capas.find(c => c.sistema === 'SGR');
    const sgpCapa = this.capas.find(c => c.sistema === 'SGP');
    const pgnCapa = this.capas.find(c => c.sistema === 'PGN');
    if (sgrCapa?.visible && Array.isArray(data.sgr)) {
      const val = data.sgr.find(d => d.categoria === '-2')?.caja_total ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['SGR'], opacidad: sgrCapa.opacidad / 100 });
    }
    if (sgpCapa?.visible && Array.isArray(data.sgp)) {
      const val = data.sgp.find(d => d.id_concepto === '99')?.total ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['SGP'], opacidad: sgpCapa.opacidad / 100 });
    }
    if (pgnCapa?.visible && Array.isArray(data.pgn)) {
      const val = data.pgn[0]?.total_apropiacion_vigente ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['PGN'], opacidad: pgnCapa.opacidad / 100 });
    }
    return segmentos;
  }

  private crearSvgPie(segmentos: Array<{valor: number, color: string, opacidad: number}>, r: number): string {
    const total = segmentos.reduce((s, d) => s + d.valor, 0);
    if (!total || !Number.isFinite(total) || !Number.isFinite(r) || r <= 0) return '';
    const pad = 2;
    const size = r * 2 + pad * 2;
    const cx = size / 2;
    const cy = size / 2;
    let paths = '';
    let startAngle = -90;
    for (const seg of segmentos) {
      const fraction = seg.valor / total;
      const sweep = fraction * 360;
      const endAngle = startAngle + sweep;
      const segOpacity = (seg.opacidad * 0.72).toFixed(2);
      if (fraction >= 0.9999) {
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${seg.color}" opacity="${segOpacity}"/>`;
      } else {
        const r1x = (cx + r * Math.cos(startAngle * Math.PI / 180)).toFixed(2);
        const r1y = (cy + r * Math.sin(startAngle * Math.PI / 180)).toFixed(2);
        const r2x = (cx + r * Math.cos(endAngle * Math.PI / 180)).toFixed(2);
        const r2y = (cy + r * Math.sin(endAngle * Math.PI / 180)).toFixed(2);
        const large = sweep > 180 ? 1 : 0;
        paths += `<path d="M${cx},${cy}L${r1x},${r1y}A${r},${r} 0 ${large},1 ${r2x},${r2y}Z" fill="${seg.color}" opacity="${segOpacity}"/>`;
      }
      startAngle = endAngle;
    }
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${paths}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="white" stroke-width="1.5"/></svg>`;
  }

  // Obs. 10: acorta nombres largos con especificación de subdivisiones; p. ej.
  // "Archipiélago de San Andrés, Providencia y Santa Catalina" → "Archipiélago de San Andrés".
  private acortarNombreDepto(nombre: string): string {
    return (nombre ?? '').split(',')[0].trim();
  }

  private computeCentroid(feature: any): L.LatLngExpression {
    const coords: Array<[number, number]> = [];
    const geom = feature.geometry;

    if (geom.type === 'MultiPolygon') {
      (geom.coordinates as number[][][][]).forEach(polygon =>
        polygon[0].forEach((c: number[]) => coords.push([c[0], c[1]]))
      );
    } else if (geom.type === 'Polygon') {
      (geom.coordinates as number[][][])[0].forEach((c: number[]) => coords.push([c[0], c[1]]));
    }

    if (!coords.length) return [4.5709, -74.2973];
    const lng = coords.reduce((s, c) => s + c[0], 0) / coords.length;
    const lat = coords.reduce((s, c) => s + c[1], 0) / coords.length;
    return [lat, lng];
  }

  // ── Popup ────────────────────────────────────────────────────────────────────

  private mostrarPopupDepartamento(latLng: L.LatLng, nombre: string, codigoDepto: string, data: ResumenGeovisor): void {
    const container = document.createElement('div');
    container.innerHTML = this.crearPopupHtml(nombre, data);

    container.querySelectorAll<HTMLButtonElement>('.btn-ver-detalle').forEach(btn => {
      const sistema = (btn.dataset['sistema'] ?? 'SGR') as 'SGR' | 'SGP' | 'PGN';
      btn.addEventListener('click', () => {
        this.map.closePopup();
        this.ngZone.run(() => this.abrirDetalle(nombre, codigoDepto, data, sistema));
      });
    });

    L.popup({ maxWidth: 320, className: 'popup-geovisor', keepInView: true, autoPanPadding: L.point(10, 100) })
      .setLatLng(latLng)
      .setContent(container)
      .openOn(this.map);
  }

  private crearPopupHtml(nombre: string, data: ResumenGeovisor): string {
    const sgr = Array.isArray(data.sgr) ? data.sgr.find(d => d.categoria === '-2') : undefined;
    const sgp = Array.isArray(data.sgp) ? data.sgp.find(d => d.id_concepto === '99') : undefined;
    const pgn = Array.isArray(data.pgn) ? data.pgn[0] : undefined;

    const fmt = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? '$' + this.formatearMilesMillones(n) + ' mm' : 'N/D'; };
    const pct = (v: unknown) => `${(Number(v) * 100).toFixed(1)}%`;
    const btnStyle = 'float:right;padding:2px 8px;border:none;border-radius:4px;font-size:10px;font-weight:600;cursor:pointer;color:white;white-space:nowrap;';

    const sgrHtml = this.capas.find(c => c.sistema === 'SGR')?.visible ? `
      <div class="popup-sistema-bloque popup-sgr">
        <div class="popup-sistema-titulo" style="display:flex;justify-content:space-between;align-items:center;">
          <span class="popup-badge sgr">SGR</span>
          <button class="btn-ver-detalle" data-sistema="SGR" style="${btnStyle}background:#3b82f6;">Ver detalle →</button>
        </div>
        <div class="popup-fila"><span>Presupuesto</span><strong>${fmt(sgr?.presupuesto_total_vigente)}</strong></div>
        <div class="popup-fila"><span>Caja</span><strong>${fmt(sgr?.caja_total)}</strong></div>
        <div class="popup-fila"><span>Avance IAC</span><strong>${pct(sgr?.avance_iac_presupuesto ?? 0)}</strong></div>
      </div>` : '';

    const sgpHtml = this.capas.find(c => c.sistema === 'SGP')?.visible ? `
      <div class="popup-sistema-bloque popup-sgp">
        <div class="popup-sistema-titulo" style="display:flex;justify-content:space-between;align-items:center;">
          <span class="popup-badge sgp">SGP</span>
          <button class="btn-ver-detalle" data-sistema="SGP" style="${btnStyle}background:#10b981;">Ver detalle →</button>
        </div>
        <div class="popup-fila"><span>Total distribución</span><strong>${fmt(sgp?.total)}</strong></div>
      </div>` : '';

    const pgnHtml = this.capas.find(c => c.sistema === 'PGN')?.visible ? `
      <div class="popup-sistema-bloque popup-pgn">
        <div class="popup-sistema-titulo" style="display:flex;justify-content:space-between;align-items:center;">
          <span class="popup-badge pgn">PGN</span>
          <button class="btn-ver-detalle" data-sistema="PGN" style="${btnStyle}background:#f59e0b;">Ver detalle →</button>
        </div>
        <div class="popup-fila"><span>Apropiación</span><strong>${fmt(pgn?.total_apropiacion_vigente)}</strong></div>
        <div class="popup-fila"><span>Compromisos</span><strong>${Number(pgn?.porcentaje_total_compromisos ?? 0).toFixed(1)}%</strong></div>
        <div class="popup-fila"><span>Pagos</span><strong>${Number(pgn?.porcentaje_total_pagos ?? 0).toFixed(1)}%</strong></div>
      </div>` : '';

    return `
      <div class="popup-geovisor-content">
        <h4 class="popup-titulo">${nombre}</h4>
        <div class="popup-vigencia">Vigencia ${this.vigenciaSeleccionada}</div>
        ${sgrHtml}${sgpHtml}${pgnHtml}
      </div>`;
  }

  // Popup del municipio seleccionado (sin botones; PGN sin datos a nivel municipal)
  private mostrarPopupMunicipio(latLng: L.LatLng, nombre: string, data: ResumenGeovisor): void {
    const container = document.createElement('div');
    container.innerHTML = this.crearPopupMunicipioHtml(nombre, data);

    this.municipioPopup = L.popup({ maxWidth: 300, className: 'popup-geovisor', keepInView: true, autoPanPadding: L.point(10, 100) })
      .setLatLng(latLng)
      .setContent(container)
      .openOn(this.map);
  }

  private crearPopupMunicipioHtml(nombre: string, data: ResumenGeovisor): string {
    const sgr = Array.isArray(data.sgr) ? data.sgr.find(d => d.categoria === '-2') : undefined;
    const sgp = Array.isArray(data.sgp) ? data.sgp.find(d => d.id_concepto === '99') : undefined;

    const fmt = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? '$' + this.formatearMilesMillones(n) + ' mm' : 'N/D'; };
    const pct = (v: unknown) => `${(Number(v) * 100).toFixed(1)}%`;

    // Obs. 6: el popup del municipio muestra el detalle de las asignaciones /
    // participaciones seleccionadas en el árbol (o el total del sistema si no hay
    // selección), para no duplicar información en los paneles laterales.
    let bloqueHtml = '';
    if (this.sistemaDetalle === 'SGR') {
      const sel = this.detalleSeleccion;
      if (sel.length > 0) {
        bloqueHtml = sel.map(n => `
      <div class="popup-sistema-bloque popup-asignacion" style="border-left:4px solid ${n.color};">
        <div class="popup-asignacion-titulo">${n.concepto}</div>
        <div class="popup-fila"><span>Presupuesto total</span><strong>${fmt(n.raw?.presupuesto_total_vigente)}</strong></div>
        <div class="popup-fila"><span>Recaudo total</span><strong>${fmt(n.raw?.caja_total)}</strong></div>
      </div>`).join('');
      } else {
        bloqueHtml = `
      <div class="popup-sistema-bloque popup-sgr">
        <div class="popup-sistema-titulo"><span class="popup-badge sgr">SGR</span></div>
        <div class="popup-fila"><span>Presupuesto</span><strong>${fmt(sgr?.presupuesto_total_vigente)}</strong></div>
        <div class="popup-fila"><span>Caja</span><strong>${fmt(sgr?.caja_total)}</strong></div>
        <div class="popup-fila"><span>Avance IAC</span><strong>${pct(sgr?.avance_iac_presupuesto ?? 0)}</strong></div>
      </div>`;
      }
    } else if (this.sistemaDetalle === 'SGP') {
      const sel = this.detalleSeleccion;
      if (sel.length > 0) {
        bloqueHtml = sel.map(n => `
      <div class="popup-sistema-bloque popup-asignacion" style="border-left:4px solid ${n.color};">
        <div class="popup-asignacion-titulo">${n.concepto}</div>
        <div class="popup-fila"><span>Distribución</span><strong>${fmt(n.raw?.total)}</strong></div>
      </div>`).join('');
      } else {
        bloqueHtml = `
      <div class="popup-sistema-bloque popup-sgp">
        <div class="popup-sistema-titulo"><span class="popup-badge sgp">SGP</span></div>
        <div class="popup-fila"><span>Total distribución</span><strong>${fmt(sgp?.total)}</strong></div>
      </div>`;
      }
    } else {
      // PGN no dispone de detalle a nivel de municipio: bloque en gris con N/A
      bloqueHtml = `
      <div class="popup-sistema-bloque popup-pgn popup-sin-datos">
        <div class="popup-sistema-titulo" style="display:flex;justify-content:space-between;align-items:center;">
          <span class="popup-badge pgn">PGN</span>
          <strong class="popup-na">N/A</strong>
        </div>
        <div class="popup-nota-sindatos">Sin información a nivel de municipio</div>
      </div>`;
    }

    return `
      <div class="popup-geovisor-content">
        <h4 class="popup-titulo">${nombre}</h4>
        <div class="popup-vigencia">Vigencia ${this.vigenciaSeleccionada}</div>
        ${bloqueHtml}
      </div>`;
  }

  // ── Modo detalle ─────────────────────────────────────────────────────────────

  // Totales del territorio (alimentan los KPIs superiores)
  get sgrTotal(): any {
    return (this.activeData?.sgr ?? []).find((d: any) => d.categoria === '-2') ?? null;
  }
  get sgpTotal(): any {
    return (this.activeData?.sgp ?? []).find((d: any) => d.id_concepto === '99') ?? null;
  }
  get pgnDetalle(): any { return this.activeData?.pgn?.[0] ?? null; }

  // PGN no tiene desagregación a nivel de municipio: mostrar N/A cuando hay municipio seleccionado
  get pgnSinDatosMunicipio(): boolean {
    return this.sistemaDetalle === 'PGN' && !!this.municipioSeleccionado;
  }

  // ── Árbol desplegable de asignaciones / participaciones ────────────────────────

  private get seleccionActual(): Set<string> {
    return this.sistemaDetalle === 'SGP' ? this.seleccionSGP : this.seleccionSGR;
  }

  // Color SICODIS por concepto de participación SGP; paleta cálida por índice para SGR
  private colorRaizSGP(concepto: string, idx: number): string {
    const c = (concepto ?? '').toLowerCase();
    const m = COLORES_SGP_PARTICIPACION.find(p => c.includes(p.match));
    return m ? m.color : this.paletaSectores[idx % this.paletaSectores.length];
  }

  // Construye el árbol SGR anidando por el código `categoria` ("1", "1.1", …)
  private construirArbolSGR(): NodoArbol[] {
    const items = (this.activeData?.sgr ?? []).filter((d: any) => !String(d.categoria).startsWith('-'));
    const map = new Map<string, NodoArbol>();
    const roots: NodoArbol[] = [];
    const sorted = [...items].sort((a: any, b: any) => String(a.categoria).localeCompare(String(b.categoria), undefined, { numeric: true }));
    for (const it of sorted) {
      const key = String(it.categoria);
      const nivel = key.split('.').length - 1;
      const node: NodoArbol = { key, concepto: this.normalizarConceptoSGR(it.concepto), nivel, color: '', hijos: [], raw: it };
      map.set(key, node);
      const parentKey = key.includes('.') ? key.substring(0, key.lastIndexOf('.')) : null;
      if (parentKey && map.has(parentKey)) map.get(parentKey)!.hijos.push(node);
      else roots.push(node);
    }
    roots.forEach((r, i) => this.pintarNodo(r, this.paletaSectores[i % this.paletaSectores.length]));
    return roots;
  }

  // Construye el árbol SGP: id_concepto de 4 dígitos = raíz, más largos = hijos
  private construirArbolSGP(): NodoArbol[] {
    const all = (this.activeData?.sgp ?? []).filter((d: any) => d.id_concepto !== '99');
    const tops = all.filter((d: any) => d.id_concepto.length === 4);
    return tops.map((t: any, i: number) => {
      const color = this.colorRaizSGP(t.concepto, i);
      const hijos: NodoArbol[] = all
        .filter((d: any) => d.id_concepto !== t.id_concepto && d.id_concepto.startsWith(t.id_concepto))
        .map((h: any) => ({ key: h.id_concepto, concepto: h.concepto, nivel: 1, color, hijos: [], raw: h } as NodoArbol));
      return { key: t.id_concepto, concepto: t.concepto, nivel: 0, color, hijos, raw: t } as NodoArbol;
    });
  }

  // Obs. 2: en el SGR el concepto "Administración" se muestra como "Funcionamiento".
  private normalizarConceptoSGR(concepto: string): string {
    return (concepto ?? '').replace(/administraci[oó]n/gi, 'FUNCIONAMIENTO');
  }

  private pintarNodo(node: NodoArbol, color: string): void {
    node.color = color;
    node.hijos.forEach(h => this.pintarNodo(h, color));
  }

  // El árbol se memoiza: se reconstruye solo cuando cambian los datos o el sistema,
  // no en cada ciclo de detección de cambios (evita trabajo redundante y referencias nuevas).
  private arbolCache: NodoArbol[] = [];

  // Vistas derivadas del árbol, memoizadas en campos (no getters) para no reconstruirlas
  // en cada ciclo de detección de cambios ni generar referencias nuevas por CD.
  arbolVisible: Array<{ node: NodoArbol; tieneHijos: boolean; expandido: boolean }> = [];
  detalleSeleccion: NodoArbol[] = [];

  private reconstruirArbol(): void {
    this.arbolCache = this.sistemaDetalle === 'SGR' ? this.construirArbolSGR()
      : this.sistemaDetalle === 'SGP' ? this.construirArbolSGP()
      : [];
    this.actualizarVistaArbol();
  }

  get arbolRaiz(): NodoArbol[] {
    return this.arbolCache;
  }

  // Recalcula la lista visible (según expansión) y la selección actual
  private actualizarVistaArbol(): void {
    const visible: Array<{ node: NodoArbol; tieneHijos: boolean; expandido: boolean }> = [];
    const sel = this.seleccionActual;
    const seleccionados: NodoArbol[] = [];
    const walk = (nodos: NodoArbol[]) => {
      for (const n of nodos) {
        if (sel.has(n.key)) seleccionados.push(n);
        const tieneHijos = n.hijos.length > 0;
        const expandido = this.expandidos.has(n.key);
        visible.push({ node: n, tieneHijos, expandido });
        if (tieneHijos && expandido) walk(n.hijos);
      }
    };
    walk(this.arbolCache);
    this.arbolVisible = visible;
    this.detalleSeleccion = seleccionados;
  }

  toggleExpandido(node: NodoArbol): void {
    if (this.expandidos.has(node.key)) this.expandidos.delete(node.key);
    else this.expandidos.add(node.key);
    this.actualizarVistaArbol();
  }

  estaSeleccionado(node: NodoArbol): boolean {
    return this.seleccionActual.has(node.key);
  }

  toggleSeleccion(node: NodoArbol): void {
    const sel = this.seleccionActual;
    if (sel.has(node.key)) sel.delete(node.key);
    else sel.add(node.key);
    this.actualizarVistaArbol();
    this.refrescarGrafica();
    this.refrescarPopupMunicipio();
  }

  // Valor monetario de un nodo según el sistema (presupuesto para SGR, distribución para SGP)
  valorNodo(node: NodoArbol): number {
    if (this.sistemaDetalle === 'SGR') return Number(node.raw?.presupuesto_total_vigente) || 0;
    return Number(node.raw?.total) || 0;
  }

  abrirDetalle(nombre: string, codigoDepto: string, _data: ResumenGeovisor, sistema: 'SGR' | 'SGP' | 'PGN' = 'SGR'): void {
    this.modoDetalle = true;
    this.detalleDepto = { nombre, codigoDepto };
    this.sistemaDetalle = sistema;
    this.detalleData = null;
    this.municipioSeleccionado = null;
    this.municipioData = null;
    this.municipioLayerActivo = null;
    this.seleccionSGR.clear();
    this.seleccionSGP.clear();
    this.expandidos.clear();
    this.arbolCache = [];
    this.arbolVisible = [];
    this.detalleSeleccion = [];

    this.circleMarkers.forEach(m => (m as L.Marker).remove());
    this.circleMarkers = [];
    this.geoJsonLayer?.setStyle(() => ({ fillOpacity: 0, color: 'transparent', weight: 0 }));

    // Diferir un tick para que Angular renderice el layout de detalle antes de
    // que Leaflet recalcule bounds y agregue la capa de municipios
    setTimeout(() => {
      this.map.invalidateSize();
      this.cargarMunicipiosDetalle();
    }, 0);
    this.cargarDatosSistemaDetalle();
  }

  cerrarDetalle(): void {
    this.modoDetalle = false;
    this.detalleDepto = null;
    this.municipioSeleccionado = null;
    this.municipioData = null;
    this.municipioLayerActivo = null;
    this.sinMunicipiosGeoJSON.set(false);
    this.tienePieData = false;
    this.municipioPopup = null;
    this.map?.closePopup();

    if (this.municipiosLayer) { this.municipiosLayer.remove(); this.municipiosLayer = null; }

    this.geoJsonLayer?.setStyle((f) => this.getDeptStyle(f));
    this.actualizarVisualizacion();
    this.centrarMapa();
  }

  cambiarSistemaDetalle(sistema: 'SGR' | 'SGP' | 'PGN'): void {
    // Obs. 10: PGN no tiene datos a nivel de municipio. Si el usuario está en la
    // vista municipal y elige PGN, se regresa a la vista departamental.
    if (sistema === 'PGN' && this.municipioSeleccionado) {
      this.deseleccionarMunicipio();
    }
    this.sistemaDetalle = sistema;
    this.seleccionSGR.clear();
    this.seleccionSGP.clear();
    // Actualiza el color de todos los municipios al nuevo sistema; el municipio
    // seleccionado adopta el color pero conserva su resaltado (contorno y énfasis).
    this.municipiosLayer?.eachLayer((layer: any) => {
      if (layer === this.municipioLayerActivo) {
        layer.setStyle({
          fillColor: SISTEMA_COLORES[sistema] ?? '#7c3aed',
          fillOpacity: 0.85,
          color: '#1e3a5f',
          weight: 2.5
        });
        return;
      }
      layer.setStyle({
        fillColor: SISTEMA_COLORES[sistema] ?? '#7c3aed',
        fillOpacity: this.opacidadMunicipios / 100 * 0.6,
        color: '#64748b',
        weight: 0.7
      });
    });
    this.reconstruirArbol();
    this.refrescarPopupMunicipio();
    this.refrescarGrafica();
  }

  // Si hay un municipio seleccionado con popup abierto, refresca su contenido con
  // la selección/sistema vigente (mantiene la continuidad de la información).
  private refrescarPopupMunicipio(): void {
    if (this.municipioSeleccionado && this.municipioData && this.municipioPopup?.isOpen()) {
      const container = document.createElement('div');
      container.innerHTML = this.crearPopupMunicipioHtml(this.municipioSeleccionado.nombre, this.municipioData);
      this.municipioPopup.setContent(container);
    }
  }

  cargarDatosSistemaDetalle(): void {
    if (!this.detalleDepto) return;
    this.isLoadingDetalle.set(true);
    const deptCode = this.detalleDepto.codigoDepto.substring(0, 2).padStart(2, '0') + '000';
    this.sicodisApi.getGeovisorResumen(this.vigenciaSeleccionada, deptCode, 0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => { this.detalleData = data; this.reconstruirArbol(); this.refrescarGrafica(); this.isLoadingDetalle.set(false); },
        error: () => this.isLoadingDetalle.set(false)
      });
  }

  cargarDatosMunicipio(nombre: string, codigoMunicipio: string, latLng?: L.LatLng): void {
    if (!this.detalleDepto) return;
    // El resaltado del polígono lo gestiona el handler de clic; aquí solo cargamos datos.
    this.municipioSeleccionado = { nombre, codigoMunicipio };
    this.municipioData = null;
    this.seleccionSGR.clear();
    this.seleccionSGP.clear();
    this.isLoadingMunicipio.set(true);

    const deptCode = this.detalleDepto.codigoDepto.substring(0, 2).padStart(2, '0') + '000';
    this.sicodisApi.getGeovisorResumen(this.vigenciaSeleccionada, deptCode, codigoMunicipio)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.municipioData = data;
          this.reconstruirArbol();
          this.refrescarGrafica();
          this.isLoadingMunicipio.set(false);
          if (latLng) this.mostrarPopupMunicipio(latLng, nombre, data);
        },
        error: () => this.isLoadingMunicipio.set(false)
      });
  }

  deseleccionarMunicipio(): void {
    if (this.municipioLayerActivo) {
      this.municipiosLayer?.resetStyle(this.municipioLayerActivo);
      this.municipioLayerActivo = null;
    }
    this.map?.closePopup();
    this.municipioPopup = null;
    this.municipioSeleccionado = null;
    this.municipioData = null;
    this.seleccionSGR.clear();
    this.seleccionSGP.clear();
    this.reconstruirArbol();
    this.refrescarGrafica();
  }

  onOpacidadMunicipiosChange(): void {
    // La opacidad se aplica a todos los municipios excepto al seleccionado,
    // que conserva su resaltado (contorno y color de énfasis) para no perderlo.
    this.municipiosLayer?.eachLayer((layer: any) => {
      if (layer === this.municipioLayerActivo) return;
      layer.setStyle({
        fillColor: SISTEMA_COLORES[this.sistemaDetalle] ?? '#7c3aed',
        fillOpacity: this.opacidadMunicipios / 100 * 0.6,
        color: '#64748b',
        weight: 0.7
      });
    });
  }

  // Los KPIs superiores muestran el total del territorio (departamento o municipio)
  totalPresupuestoDetalle(): number {
    if (this.sistemaDetalle === 'SGR') return this.sgrTotal?.presupuesto_total_vigente ?? 0;
    if (this.sistemaDetalle === 'SGP') return this.sgpTotal?.total ?? 0;
    return this.pgnDetalle?.total_apropiacion_vigente ?? 0;
  }

  totalRecaudoDetalle(): number {
    if (this.sistemaDetalle === 'SGR') return this.sgrTotal?.caja_total ?? 0;
    // Obs. 9: el geovisor solo entrega `total` para SGP → es lo distribuido.
    if (this.sistemaDetalle === 'SGP') return this.sgpTotal?.total ?? 0;
    return this.pgnDetalle?.total_pagos ?? 0;
  }

  avanceDetalle(): number {
    if (this.sistemaDetalle === 'SGR') return (this.sgrTotal?.avance_iac_presupuesto ?? 0) * 100;
    // PGN: porcentaje_total_pagos ya viene en escala 0-100
    if (this.sistemaDetalle === 'PGN') return this.pgnDetalle?.porcentaje_total_pagos ?? 0;
    // SGP se distribuye al 100% (no hay ejecución/recaudo por territorio)
    return this.sgpTotal?.total ? 100 : 0;
  }

  etiquetaRecaudoDetalle(): string {
    if (this.sistemaDetalle === 'SGR') return 'Caja total';
    if (this.sistemaDetalle === 'SGP') return 'Distribución';
    return 'Pagos';
  }

  etiquetaAvanceDetalle(): string {
    if (this.sistemaDetalle === 'SGR') return 'Porcentaje de recaudo vs presupuesto';
    if (this.sistemaDetalle === 'PGN') return 'Porcentaje de pagos vs apropiación';
    return 'Avance';
  }

  // Título del panel derecho (donut de distribución) según el sistema y la selección
  get tituloDistribucion(): string {
    if (this.sistemaDetalle === 'PGN') return 'Ejecución presupuestal';
    if (this.sistemaDetalle === 'SGP') return 'Distribución porcentual de las participaciones';
    // SGR sin selección: recaudo frente a presupuesto; con selección: por asignación
    if (this.detalleSeleccion.length === 0) return 'Recaudo frente a presupuesto';
    return 'Distribución porcentual de las asignaciones';
  }

  // Reconstruye el donut del panel derecho a partir de la selección del árbol
  // (o de las asignaciones/participaciones de nivel superior si no hay selección).
  private refrescarGrafica(): void {
    if (!this.activeData) { this.tienePieData = false; return; }

    if (this.sistemaDetalle === 'SGR' || this.sistemaDetalle === 'SGP') {
      const seleccion = this.detalleSeleccion;

      if (seleccion.length > 0) {
        const labels = seleccion.map(n => n.concepto);
        const data = seleccion.map(n => this.valorNodo(n));
        const colores = seleccion.map(n => n.color);
        this.pieData = { labels, datasets: [{ data, backgroundColor: colores, borderWidth: 0 }] };
        this.tienePieData = data.some(v => v > 0);
        return;
      }

      // SGR sin selección: presupuesto total vs recaudo total (en vez de quedar
      // dominado por "Inversión"); muestra recaudado vs pendiente por recaudar.
      if (this.sistemaDetalle === 'SGR') {
        const t = this.sgrTotal;
        const presupuesto = Number(t?.presupuesto_total_vigente) || 0;
        const recaudo = Number(t?.caja_total) || 0;
        const pendiente = Math.max(0, presupuesto - recaudo);
        this.pieData = {
          labels: ['Recaudo total', 'Pendiente por recaudar'],
          datasets: [{ data: [recaudo, pendiente], backgroundColor: [COLORES_REPORTE.naranja, COLORES_REPORTE.restante], borderWidth: 0 }]
        };
        this.tienePieData = (recaudo + pendiente) > 0;
        return;
      }

      // SGP sin selección: distribución por participación de nivel superior
      const nodos = this.arbolRaiz;
      const labels = nodos.map(n => n.concepto);
      const data = nodos.map(n => this.valorNodo(n));
      const colores = nodos.map(n => n.color);
      this.pieData = { labels, datasets: [{ data, backgroundColor: colores, borderWidth: 0 }] };
      this.tienePieData = data.some(v => v > 0);
      return;
    }

    // PGN: donut de ejecución (solo a nivel departamental)
    if (this.pgnSinDatosMunicipio) { this.tienePieData = false; return; }
    const p = this.pgnDetalle;
    const pagos = Number(p?.total_pagos) || 0;
    const obligaciones = Number(p?.total_obligaciones) || 0;
    const apropiacion = Number(p?.total_apropiacion_vigente) || 0;
    const obligSinPagar = Math.max(0, obligaciones - pagos);
    const sinEjecutar = Math.max(0, apropiacion - obligaciones);
    this.pieData = {
      labels: ['Pagos', 'Obligaciones sin pagar', 'Sin ejecutar'],
      datasets: [{ data: [pagos, obligSinPagar, sinEjecutar], backgroundColor: [COLORES_REPORTE.naranjaOscuro, COLORES_REPORTE.ambar, COLORES_REPORTE.restante], borderWidth: 0 }]
    };
    this.tienePieData = (pagos + obligSinPagar + sinEjecutar) > 0;
  }

  formatearMilesMillones(valor: number | string | null | undefined): string {
    const n = Number(valor);
    if (!Number.isFinite(n)) return 'N/D';
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(n / 1e9);
  }

  descargarArchivo(): void {
    if (this.sistemaDetalle !== 'SGP' || !this.detalleDepto) return;
    const deptCode = this.detalleDepto.codigoDepto.substring(0, 2).padStart(2, '0');
    this.sicodisApi.getSgpDescargaDatosSgpResumenParticipaciones(
      this.vigenciaSeleccionada, deptCode, '0', this.detalleDepto.nombre, ''
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sgp_${this.detalleDepto!.nombre}_${this.vigenciaSeleccionada}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  private cargarMunicipiosDetalle(): void {
    // Obtener código de 2 dígitos con cero a la izquierda ("05", "11", "76"…)
    // codigoDepto tiene formato "05000" → tomar primeros 2 chars y asegurar zero-padding
    const dept2 = this.detalleDepto!.codigoDepto.substring(0, 2).padStart(2, '0');
    this.sinMunicipiosGeoJSON.set(false);

    const renderizar = () => {
      if (this.municipiosLayer) { this.municipiosLayer.remove(); this.municipiosLayer = null; }

      const features = this.municipiosGeoJSON.features.filter((f: any) => {
        // d puede ser "05", "5", 5 — normalizar a 2 dígitos string
        const fDept = String(f.properties.d ?? '').padStart(2, '0');
        return fDept === dept2;
      });

      if (features.length === 0) {
        this.sinMunicipiosGeoJSON.set(true);
        return;
      }
      const fc = { type: 'FeatureCollection', features };

      this.municipiosLayer = L.geoJSON(fc as any, {
        style: () => ({
          fillColor: SISTEMA_COLORES[this.sistemaDetalle] ?? '#7c3aed',
          fillOpacity: this.opacidadMunicipios / 100 * 0.6,
          color: '#64748b',
          weight: 0.7
        }),
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e: any) => {
              if (this.municipioLayerActivo === layer) return;
              e.target.setStyle({ weight: 2, fillOpacity: 0.75 });
            },
            mouseout: () => {
              if (this.municipioLayerActivo === layer) return;
              this.municipiosLayer?.resetStyle(layer);
            },
            click: (e: any) => {
              // Quitar highlight anterior
              if (this.municipioLayerActivo && this.municipioLayerActivo !== layer) {
                this.municipiosLayer?.resetStyle(this.municipioLayerActivo);
              }
              // Highlight del municipio seleccionado
              this.municipioLayerActivo = layer;
              (layer as any).setStyle({ weight: 2.5, color: '#1e3a5f', fillOpacity: 0.85 });
              // Ubicación del clic para posicionar el popup del municipio
              const latLng = e?.latlng ?? (layer as any).getBounds?.().getCenter?.();
              // Cargar datos en Angular zone
              this.ngZone.run(() => this.cargarDatosMunicipio(feature.properties.n, feature.properties.m, latLng));
            }
          });
        }
      }).addTo(this.map);

      const bounds = this.municipiosLayer.getBounds();
      if (bounds.isValid()) this.map.fitBounds(bounds, { padding: [30, 30] });
    };

    if (this.municipiosGeoJSON) {
      renderizar();
    } else {
      this.http.get('/assets/data/municipios.geojson')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({ next: (g) => { this.municipiosGeoJSON = g; renderizar(); } });
    }
  }

  // ── Filters ──────────────────────────────────────────────────────────────────

  aplicarFiltros(): void {
    this.cargarResumenNacional();
    this.deptResults = [];
    this.cargarGeoJsonYDepartamentos();
  }

  limpiarFiltros(): void {
    this.vigenciaSeleccionada = 2026;
    this.visualizacionActiva = true;
    this.capas.forEach(c => { c.visible = true; c.opacidad = 80; });
    this.aplicarFiltros();
  }

  onCapaVisibleChange(_capa: VisualizacionCapa): void {
    this.actualizarVisualizacion();
  }

  onCapaOpacidadChange(_capa: VisualizacionCapa): void {
    this.geoJsonLayer?.setStyle((f) => this.getDeptStyle(f));
    this.actualizarVisualizacion();
  }

  // ── Map controls ─────────────────────────────────────────────────────────────

  centrarMapa(): void {
    this.map.setView([4.570868, -74.297333], 6);
  }

  miUbicacion(): void {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      this.map.setView([pos.coords.latitude, pos.coords.longitude], 12);
      L.marker([pos.coords.latitude, pos.coords.longitude])
        .addTo(this.map).bindPopup('Tu ubicación').openPopup();
    });
  }

  navegarResguardos(): void {
    console.log('Navegando a Resguardos Indígenas');
  }

  abrirAyuda(): void {
    if (this.MANUAL_USUARIO_URL) {
      window.open(this.MANUAL_USUARIO_URL, '_blank');
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────────

  formatearValor(valor: number): string {
    if (valor >= 1e12) return `${(valor / 1e12).toFixed(1)}B`;
    if (valor >= 1e9) return `${(valor / 1e9).toFixed(1)}MM`;
    if (valor >= 1e6) return `${(valor / 1e6).toFixed(1)}M`;
    if (valor >= 1e3) return `${(valor / 1e3).toFixed(1)}K`;
    return valor.toString();
  }

  private buildFallbackRecursos(): RecursosSistema[] {
    return [
      { sigla: 'SGR', nombre: 'Sistema General de Regalías', total: 67292719995246, presupuesto: 67292719995246, recaudo: 56955874217250, cobertura: 'Avance: 59.2%', icono: 'pi pi-wallet', color: SISTEMA_COLORES['SGR'] },
      { sigla: 'SGP', nombre: 'Sistema General de Participaciones', total: 83214787513067, presupuesto: 83214787513067, recaudo: 83214787513067, cobertura: 'Vigencia 2026', icono: 'pi pi-chart-bar', color: SISTEMA_COLORES['SGP'] },
      { sigla: 'PGN', nombre: 'Presupuesto General de la Nación', total: 88290458856734, presupuesto: 48991450709774, recaudo: 20264846471707, cobertura: 'Compromisos: 55.5%', icono: 'pi pi-briefcase', color: SISTEMA_COLORES['PGN'] }
    ];
  }
}
