import { Component, OnInit, AfterViewInit, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { NumberFormatPipe } from '../../utils/numberFormatPipe';
import {
  SicodisApiService,
  ResumenGeovisor,
  GeovisorPgnItem
} from '../../services/sicodis-api.service';

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

interface VisualizacionCapa {
  sistema: string;
  visible: boolean;
  opacidad: number;
  color: string;
}

interface DeptResult {
  codigoDepto: number;
  nombre: string;
  centroid: L.LatLngExpression;
  data: ResumenGeovisor | null;
}

const SISTEMA_COLORES: Record<string, string> = {
  SGR: '#3b82f6',
  SGP: '#10b981',
  PGN: '#f59e0b'
};

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
    NumberFormatPipe
  ],
  templateUrl: './mapa-recursos.component.html',
  styleUrl: './mapa-recursos.component.scss'
})
export class MapaRecursosComponent implements OnInit, AfterViewInit {
  private readonly sicodisApi = inject(SicodisApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly http = inject(HttpClient);

  consultaRecursos = { inversion: true, sgr: true, sgp: true, pgn: true };
  vigenciaSeleccionada = 2026;
  vigencias: number[] = [];

  visualizacionActiva = true;
  tipoInversionSeleccionado = 'inversion';
  tiposInversion = [
    { label: 'Inversión', value: 'inversion' },
    { label: 'Funcionamiento', value: 'funcionamiento' },
    { label: 'Deuda', value: 'deuda' }
  ];

  capas: VisualizacionCapa[] = [
    { sistema: 'SGR', visible: true, opacidad: 80, color: SISTEMA_COLORES['SGR'] },
    { sistema: 'SGP', visible: true, opacidad: 80, color: SISTEMA_COLORES['SGP'] },
    { sistema: 'PGN', visible: true, opacidad: 80, color: SISTEMA_COLORES['PGN'] }
  ];

  recursos: RecursosSistema[] = this.buildFallbackRecursos();

  isLoading = signal(false);
  isLoadingMapa = signal(false);
  hasGeoData = false;

  private map!: L.Map;
  private geoJsonLayer: L.GeoJSON | null = null;
  private circleMarkers: L.Layer[] = [];
  private deptResults: DeptResult[] = [];
  private maxValue = 0;

  ngOnInit(): void {
    this.generarVigencias();
    this.cargarResumenNacional();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 100);
  }

  generarVigencias(): void {
    const base = 2026;
    for (let i = 0; i < 10; i++) this.vigencias.push(base - i);
  }

  // ── Summary cards ────────────────────────────────────────────────────────────

  cargarResumenNacional(): void {
    this.isLoading.set(true);
    this.sicodisApi.getGeovisorResumen(this.vigenciaSeleccionada, 0, 0)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.recursos = this.mapearRecursosNacionales(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.recursos = this.buildFallbackRecursos();
          this.isLoading.set(false);
        }
      });
  }

  private mapearRecursosNacionales(data: ResumenGeovisor): RecursosSistema[] {
    const sgrTotal = data.sgr.find(d => d.categoria === '-2');
    const sgpTotal = data.sgp.find(d => d.id_concepto === '99');
    const pgn: GeovisorPgnItem | undefined = data.pgn[0];

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

    this.http.get<any>('/assets/data/departamentos.geojson')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (geojson) => {
          this.hasGeoData = true;
          this.agregarCapaCoropleta(geojson);
          this.cargarDatosDepartamentos(geojson.features);
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
            e.target.setStyle({ weight: 2, color: '#475569', fillOpacity: Math.min(0.75, (this.getDeptFillOpacity(feature) + 0.15)) });
          },
          mouseout: () => {
            this.geoJsonLayer?.resetStyle(layer);
          }
        });
      }
    }).addTo(this.map);
  }

  private cargarDatosDepartamentos(features: any[]): void {
    const requests = features.map((feature: any) => {
      const cod: string = feature.properties.cod ?? '0';
      const codigoDepto = parseInt(cod, 10) * 1000;
      const nombre: string = feature.properties.nombre ?? '';
      const centroid = this.computeCentroid(feature);

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
      const opacity = this.getCapasOpacidade() / 100;
      const segmentos = this.extraerSegmentosPie(result.data);
      const pad = 2;
      const iconSize = radius * 2 + pad * 2;

      const marker = L.marker(result.centroid, {
        icon: L.divIcon({
          html: this.crearSvgPie(segmentos, radius, opacity),
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
    const codigoDepto = parseInt(cod, 10) * 1000;
    const result = this.deptResults.find(r => r.codigoDepto === codigoDepto);
    const value = result?.data ? this.extractTotalValue(result.data) : 0;
    const ratio = this.maxValue > 0 ? value / this.maxValue : 0;
    const opacidad = this.getCapasOpacidade() / 100;
    return (0.06 + ratio * 0.54) * opacidad;
  }

  private getDominantColor(): string {
    const visible = this.capas.filter(c => c.visible);
    if (visible.length === 1) return SISTEMA_COLORES[visible[0].sistema] ?? '#7c3aed';
    return '#7c3aed';
  }

  private getCapasOpacidade(): number {
    const visible = this.capas.filter(c => c.visible);
    if (!visible.length) return 0;
    return visible.reduce((s, c) => s + c.opacidad, 0) / visible.length;
  }

  private getCircleRadius(value: number): number {
    const ratio = this.maxValue > 0 ? value / this.maxValue : 0;
    return 4 + ratio * 32;
  }

  private extraerSegmentosPie(data: ResumenGeovisor): Array<{valor: number, color: string}> {
    const segmentos: Array<{valor: number, color: string}> = [];
    const sgrCapa = this.capas.find(c => c.sistema === 'SGR');
    const sgpCapa = this.capas.find(c => c.sistema === 'SGP');
    const pgnCapa = this.capas.find(c => c.sistema === 'PGN');
    if (sgrCapa?.visible && Array.isArray(data.sgr)) {
      const val = data.sgr.find(d => d.categoria === '-2')?.caja_total ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['SGR'] });
    }
    if (sgpCapa?.visible && Array.isArray(data.sgp)) {
      const val = data.sgp.find(d => d.id_concepto === '99')?.total ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['SGP'] });
    }
    if (pgnCapa?.visible && Array.isArray(data.pgn)) {
      const val = data.pgn[0]?.total_apropiacion_vigente ?? 0;
      if (Number.isFinite(val) && val > 0) segmentos.push({ valor: val, color: SISTEMA_COLORES['PGN'] });
    }
    return segmentos;
  }

  private crearSvgPie(segmentos: Array<{valor: number, color: string}>, r: number, opacity: number): string {
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
      if (fraction >= 0.9999) {
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${seg.color}" opacity="${(opacity * 0.72).toFixed(2)}"/>`;
      } else {
        const r1x = (cx + r * Math.cos(startAngle * Math.PI / 180)).toFixed(2);
        const r1y = (cy + r * Math.sin(startAngle * Math.PI / 180)).toFixed(2);
        const r2x = (cx + r * Math.cos(endAngle * Math.PI / 180)).toFixed(2);
        const r2y = (cy + r * Math.sin(endAngle * Math.PI / 180)).toFixed(2);
        const large = sweep > 180 ? 1 : 0;
        paths += `<path d="M${cx},${cy}L${r1x},${r1y}A${r},${r} 0 ${large},1 ${r2x},${r2y}Z" fill="${seg.color}" opacity="${(opacity * 0.72).toFixed(2)}"/>`;
      }
      startAngle = endAngle;
    }
    return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${paths}<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="white" stroke-width="1.5"/></svg>`;
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

  private mostrarPopupDepartamento(latLng: L.LatLng, nombre: string, codigoDepto: number, data: ResumenGeovisor): void {
    L.popup({ maxWidth: 320, className: 'popup-geovisor' })
      .setLatLng(latLng)
      .setContent(this.crearPopupHtml(nombre, data))
      .openOn(this.map);
  }

  private crearPopupHtml(nombre: string, data: ResumenGeovisor): string {
    const sgr = data.sgr.find(d => d.categoria === '-2');
    const sgp = data.sgp.find(d => d.id_concepto === '99');
    const pgn = data.pgn[0];

    const fmt = (v: number) => v ? '$' + this.formatearValor(v) : 'N/D';
    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

    const sgrHtml = this.capas.find(c => c.sistema === 'SGR')?.visible ? `
      <div class="popup-sistema-bloque popup-sgr">
        <div class="popup-sistema-titulo"><span class="popup-badge sgr">SGR</span></div>
        <div class="popup-fila"><span>Presupuesto</span><strong>${fmt(sgr?.presupuesto_total_vigente ?? 0)}</strong></div>
        <div class="popup-fila"><span>Caja</span><strong>${fmt(sgr?.caja_total ?? 0)}</strong></div>
        <div class="popup-fila"><span>Avance IAC</span><strong>${pct(sgr?.avance_iac_presupuesto ?? 0)}</strong></div>
      </div>` : '';

    const sgpHtml = this.capas.find(c => c.sistema === 'SGP')?.visible ? `
      <div class="popup-sistema-bloque popup-sgp">
        <div class="popup-sistema-titulo"><span class="popup-badge sgp">SGP</span></div>
        <div class="popup-fila"><span>Total distribución</span><strong>${fmt(sgp?.total ?? 0)}</strong></div>
      </div>` : '';

    const pgnHtml = this.capas.find(c => c.sistema === 'PGN')?.visible ? `
      <div class="popup-sistema-bloque popup-pgn">
        <div class="popup-sistema-titulo"><span class="popup-badge pgn">PGN</span></div>
        <div class="popup-fila"><span>Apropiación</span><strong>${fmt(pgn?.total_apropiacion_vigente ?? 0)}</strong></div>
        <div class="popup-fila"><span>Compromisos</span><strong>${(pgn?.porcentaje_total_compromisos ?? 0).toFixed(1)}%</strong></div>
        <div class="popup-fila"><span>Pagos</span><strong>${(pgn?.porcentaje_total_pagos ?? 0).toFixed(1)}%</strong></div>
      </div>` : '';

    return `
      <div class="popup-geovisor-content">
        <h4 class="popup-titulo">${nombre}</h4>
        <div class="popup-vigencia">Vigencia ${this.vigenciaSeleccionada}</div>
        ${sgrHtml}${sgpHtml}${pgnHtml}
      </div>`;
  }

  // ── Filters ──────────────────────────────────────────────────────────────────

  aplicarFiltros(): void {
    this.cargarResumenNacional();
    this.deptResults = [];
    this.cargarGeoJsonYDepartamentos();
  }

  limpiarFiltros(): void {
    this.consultaRecursos = { inversion: true, sgr: true, sgp: true, pgn: true };
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
