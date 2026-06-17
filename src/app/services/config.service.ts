import { Injectable, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, shareReplay, catchError } from 'rxjs/operators';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ConfiguracionBase {
  id: number;
  categoria: 'fechas' | 'banner' | 'colores' | 'urls' | 'general';
  clave: string;
  valor: string; // JSON stringified
  tipo_dato: 'string' | 'number' | 'boolean' | 'json' | 'date';
  descripcion?: string;
  activo: boolean;
  fecha_modificacion: string;
  usuario_modificacion?: string;
  version: number;
}

export interface BannerConfig {
  id: number;
  activo: boolean;
  titulo: string;
  mensaje: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
  template?: 'default' | 'alertas-caja'; // Template personalizado para el banner
  imagen_url?: string;
  boton_texto?: string;
  boton_url?: string;
  fecha_inicio: string; // ISO date
  fecha_fin: string; // ISO date
  frecuencia_diaria: number; // Cuántas veces mostrar por día
  max_dias_consecutivos: number; // Máximo de días consecutivos
  version: number;
}

export interface BannerTrackingState {
  configVersion: number;
  lastShownDate: string; // YYYY-MM-DD
  countToday: number;
  consecutiveDays: number;
  shouldShow: boolean;
}

export interface VigenciaGlobal {
  id: number;
  sistema: 'SGR' | 'SGP' | 'PGN';
  tipo: 'bienal' | 'anual' | 'historico';
  vigencia: string; // '2025-2026', '2026', etc.
  fecha_inicio?: string;
  fecha_fin?: string;
  activo: boolean;
  por_defecto: boolean;
  orden: number;
}

export interface ColorPalette {
  id: string;
  nombre: string;
  colores: string[]; // Array de hex colors
  descripcion?: string;
}

export interface UrlExterna {
  id: string;
  nombre: string;
  url: string;
  descripcion?: string;
  activo: boolean;
}

export interface FechaActualizacion {
  fecha_actualizacion: string; // Formato: "mes día de año" (ej: "mayo 30 de 2025")
  fecha_corte_recaudo?: string; // Opcional - solo para componentes de recaudo
  fecha_iso_actualizacion?: string; // Formato ISO para facilitar comparaciones
  fecha_iso_corte?: string; // Formato ISO para facilitar comparaciones
}

export interface FechasReporteFuncionamiento {
  vigencia: string;
  fecha_actualizacion: string;
  fecha_corte_recaudo: string;
  fecha_iso_actualizacion: string;
  fecha_iso_corte: string;
}

export interface HistorialCambio {
  id: number;
  config_id: number;
  categoria: string;
  clave: string;
  valor_anterior: string;
  valor_nuevo: string;
  usuario: string;
  fecha_cambio: string;
  tipo_cambio: 'INSERT' | 'UPDATE' | 'DELETE';
}

// ============================================================================
// SERVICIO
// ============================================================================

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Signals para reactividad
  private configsSignal = signal<Map<string, ConfiguracionBase>>(new Map());

  // Cache observable con replay
  private cache$: Observable<Map<string, ConfiguracionBase>> | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutos

  // LocalStorage keys
  private readonly STORAGE_PREFIX = 'sicodis_config_';
  private readonly BANNER_TRACKING_KEY = 'sicodis_banner_tracking';
  private readonly CONFIGS_KEY = 'sicodis_all_configs';

  constructor() {
    this.initializeDefaultConfigs();
  }

  // ============================================================================
  // INICIALIZACIÓN CON DATOS POR DEFECTO
  // ============================================================================

  private initializeDefaultConfigs(): void {
    const stored = localStorage.getItem(this.CONFIGS_KEY);

    if (stored) {
      try {
        const configs = JSON.parse(stored) as ConfiguracionBase[];
        const map = new Map(configs.map(c => [`${c.categoria}:${c.clave}`, c]));
        this.configsSignal.set(map);
        return;
      } catch (e) {
        console.error('Error loading stored configs:', e);
      }
    }

    // Configuraciones por defecto si no hay nada en localStorage
    const defaultConfigs: ConfiguracionBase[] = [
      // BANNER CONFIG
      {
        id: 1,
        categoria: 'banner',
        clave: 'config',
        valor: JSON.stringify({
          id: 1,
          activo: false, // Desactivado por defecto
          titulo: 'Bienvenido a SICODIS',
          mensaje: 'Sistema de Consultas y Distribuciones - DNP',
          tipo: 'info',
          imagen_url: '/assets/img/alertasboletin.jpg',
          fecha_inicio: '2026-01-01',
          fecha_fin: '2026-12-31',
          frecuencia_diaria: 1,
          max_dias_consecutivos: 5,
          version: 1
        } as BannerConfig),
        tipo_dato: 'json',
        descripcion: 'Configuración del banner principal',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // VIGENCIAS SGR
      {
        id: 2,
        categoria: 'fechas',
        clave: 'sgr_vigencias_bienales',
        valor: JSON.stringify(['2025-2026', '2023-2024', '2021-2022', '2019-2020']),
        tipo_dato: 'json',
        descripcion: 'Vigencias bienales disponibles para SGR',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 3,
        categoria: 'fechas',
        clave: 'sgr_vigencia_defecto',
        valor: '2025-2026',
        tipo_dato: 'string',
        descripcion: 'Vigencia bienal por defecto para SGR',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 4,
        categoria: 'fechas',
        clave: 'sgr_rango_proyeccion',
        valor: '2025-2034',
        tipo_dato: 'string',
        descripcion: 'Rango de proyección a 10 años para SGR',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // VIGENCIAS SGP
      {
        id: 5,
        categoria: 'fechas',
        clave: 'sgp_vigencias_anuales',
        valor: JSON.stringify([2026, 2025, 2024, 2023, 2022, 2021, 2020]),
        tipo_dato: 'json',
        descripcion: 'Años disponibles para SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 6,
        categoria: 'fechas',
        clave: 'sgp_anio_defecto',
        valor: '2026',
        tipo_dato: 'number',
        descripcion: 'Año por defecto para SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 7,
        categoria: 'fechas',
        clave: 'sgp_rango_historico',
        valor: JSON.stringify({ inicio: 2002, fin: 2026 }),
        tipo_dato: 'json',
        descripcion: 'Rango histórico para SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // VIGENCIAS PGN
      {
        id: 8,
        categoria: 'fechas',
        clave: 'pgn_vigencias_anuales',
        valor: JSON.stringify([2025, 2024, 2023, 2022, 2021, 2020]),
        tipo_dato: 'json',
        descripcion: 'Años disponibles para PGN',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 9,
        categoria: 'fechas',
        clave: 'pgn_rango_historico',
        valor: JSON.stringify({ inicio: 2002, fin: 2025 }),
        tipo_dato: 'json',
        descripcion: 'Rango histórico para PGN',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // PALETAS DE COLORES
      {
        id: 10,
        categoria: 'colores',
        clave: 'historico_sgp',
        valor: JSON.stringify(['#156082', '#e97132', '#0c9bd3', '#196b24', '#a02b93']),
        tipo_dato: 'json',
        descripcion: 'Paleta de colores para gráficos históricos SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 11,
        categoria: 'colores',
        clave: 'sgp_comparativa_azules',
        valor: JSON.stringify(['#1e3a5f', '#2c5282', '#3b6ba5', '#4a83c8', '#599beb', '#68b4ff']),
        tipo_dato: 'json',
        descripcion: 'Paleta de azules para comparativas SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 12,
        categoria: 'colores',
        clave: 'sgp_comparativa_verdes',
        valor: JSON.stringify(['#196b24', '#2a8335', '#3b9b46', '#4cb357', '#5dcb68', '#6ee379']),
        tipo_dato: 'json',
        descripcion: 'Paleta de verdes para comparativas SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 13,
        categoria: 'colores',
        clave: 'sgr_plan_bienal',
        valor: JSON.stringify({ naranja: '#f97316', azul: '#1e3a5f' }),
        tipo_dato: 'json',
        descripcion: 'Colores para plan bienal SGR',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // URLS EXTERNAS
      {
        id: 14,
        categoria: 'urls',
        clave: 'sgr_sistema',
        valor: 'https://www.sgr.gov.co',
        tipo_dato: 'string',
        descripcion: 'URL del Sistema General de Regalías',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 15,
        categoria: 'urls',
        clave: 'sgp_minhacienda',
        valor: 'https://www.minhacienda.gov.co/webcenter/portal/SGP',
        tipo_dato: 'string',
        descripcion: 'URL SGP MinHacienda',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 16,
        categoria: 'urls',
        clave: 'dane',
        valor: 'https://www.dane.gov.co',
        tipo_dato: 'string',
        descripcion: 'URL DANE',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 17,
        categoria: 'urls',
        clave: 'openstreetmap_tiles',
        valor: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tipo_dato: 'string',
        descripcion: 'URL tiles OpenStreetMap',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // FECHAS DE ACTUALIZACIÓN Y CORTE - SGR
      {
        id: 18,
        categoria: 'fechas',
        clave: 'sgr_fecha_actualizacion_vigencia_2025_2026',
        valor: JSON.stringify({
          fecha_actualizacion: 'mayo 30 de 2025',
          fecha_corte_recaudo: 'junio 30 de 2025',
          fecha_iso_actualizacion: '2025-05-30',
          fecha_iso_corte: '2025-06-30'
        } as FechaActualizacion),
        tipo_dato: 'json',
        descripcion: 'Fechas de actualización y corte de recaudo SGR vigencia 2025-2026',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 19,
        categoria: 'fechas',
        clave: 'sgr_fecha_plan_bienal_2025_2026',
        valor: JSON.stringify({
          fecha_actualizacion: 'febrero 12 de 2026',
          fecha_corte_recaudo: 'enero 31 de 2026',
          fecha_iso_actualizacion: '2026-02-12',
          fecha_iso_corte: '2026-01-31'
        } as FechaActualizacion),
        tipo_dato: 'json',
        descripcion: 'Fechas de plan bienal SGR 2025-2026',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // FECHAS DE ACTUALIZACIÓN Y CORTE - SGP
      {
        id: 20,
        categoria: 'fechas',
        clave: 'sgp_fecha_eficiencias',
        valor: JSON.stringify({
          fecha_actualizacion: 'octubre 01 de 2025',
          fecha_corte_recaudo: '31 de agosto de 2024',
          fecha_iso_actualizacion: '2025-10-01',
          fecha_iso_corte: '2024-08-31'
        } as FechaActualizacion),
        tipo_dato: 'json',
        descripcion: 'Fechas para reporte de eficiencias SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },
      {
        id: 21,
        categoria: 'fechas',
        clave: 'sgp_fecha_resguardos',
        valor: JSON.stringify({
          fecha_actualizacion: 'mayo 28 de 2026',
          fecha_iso_actualizacion: '2026-05-28'
        } as FechaActualizacion),
        tipo_dato: 'json',
        descripcion: 'Fecha de actualización para resguardos SGP',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      },

      // FECHAS REPORTE FUNCIONAMIENTO (Diccionario completo para todas las vigencias)
      {
        id: 22,
        categoria: 'fechas',
        clave: 'sgr_fechas_reporte_funcionamiento',
        valor: JSON.stringify([
          {
            vigencia: '2012-2013',
            fecha_actualizacion: 'diciembre 31 de 2013',
            fecha_corte_recaudo: 'diciembre 31 de 2013',
            fecha_iso_actualizacion: '2013-12-31',
            fecha_iso_corte: '2013-12-31'
          },
          {
            vigencia: '2014-2015',
            fecha_actualizacion: 'diciembre 31 de 2015',
            fecha_corte_recaudo: 'diciembre 31 de 2015',
            fecha_iso_actualizacion: '2015-12-31',
            fecha_iso_corte: '2015-12-31'
          },
          {
            vigencia: '2016-2017',
            fecha_actualizacion: 'diciembre 31 de 2017',
            fecha_corte_recaudo: 'diciembre 31 de 2017',
            fecha_iso_actualizacion: '2017-12-31',
            fecha_iso_corte: '2017-12-31'
          },
          {
            vigencia: '2018-2019',
            fecha_actualizacion: 'diciembre 31 de 2019',
            fecha_corte_recaudo: 'diciembre 31 de 2019',
            fecha_iso_actualizacion: '2019-12-31',
            fecha_iso_corte: '2019-12-31'
          },
          {
            vigencia: '2020-2021',
            fecha_actualizacion: 'diciembre 31 de 2021',
            fecha_corte_recaudo: 'diciembre 31 de 2021',
            fecha_iso_actualizacion: '2021-12-31',
            fecha_iso_corte: '2021-12-31'
          },
          {
            vigencia: '2022-2023',
            fecha_actualizacion: 'abril 30 de 2024',
            fecha_corte_recaudo: 'abril 30 de 2024',
            fecha_iso_actualizacion: '2024-04-30',
            fecha_iso_corte: '2024-04-30'
          },
          {
            vigencia: '2024-2025',
            fecha_actualizacion: 'marzo 31 de 2025',
            fecha_corte_recaudo: 'marzo 31 de 2025',
            fecha_iso_actualizacion: '2025-03-31',
            fecha_iso_corte: '2025-03-31'
          },
          {
            vigencia: '2026-2027',
            fecha_actualizacion: 'marzo 31 de 2027',
            fecha_corte_recaudo: 'marzo 31 de 2027',
            fecha_iso_actualizacion: '2027-03-31',
            fecha_iso_corte: '2027-03-31'
          }
        ] as FechasReporteFuncionamiento[]),
        tipo_dato: 'json',
        descripcion: 'Diccionario completo de fechas para Reporte de Funcionamiento SGR por vigencia',
        activo: true,
        fecha_modificacion: new Date().toISOString(),
        version: 1
      }
    ];

    const map = new Map(defaultConfigs.map(c => [`${c.categoria}:${c.clave}`, c]));
    this.configsSignal.set(map);
    this.saveToLocalStorage(defaultConfigs);
  }

  // ============================================================================
  // PERSISTENCIA EN LOCALSTORAGE
  // ============================================================================

  private saveToLocalStorage(configs: ConfiguracionBase[]): void {
    try {
      localStorage.setItem(this.CONFIGS_KEY, JSON.stringify(configs));
    } catch (e) {
      console.error('Error saving configs to localStorage:', e);
    }
  }

  private getConfigFromCache(categoria: string, clave: string): ConfiguracionBase | undefined {
    return this.configsSignal().get(`${categoria}:${clave}`);
  }

  // ============================================================================
  // MÉTODOS PÚBLICOS - CONFIGURACIONES GENÉRICAS
  // ============================================================================

  /**
   * Obtiene todas las configuraciones (simula llamada API con Observable)
   */
  getAllConfigs(): Observable<ConfiguracionBase[]> {
    const now = Date.now();

    // Retornar cache si es válido
    if (this.cache$ && (now - this.cacheTimestamp) < this.CACHE_DURATION_MS) {
      return this.cache$.pipe(map(configMap => Array.from(configMap.values())));
    }

    // Crear nuevo cache
    this.cacheTimestamp = now;
    const configs = Array.from(this.configsSignal().values());

    this.cache$ = of(this.configsSignal()).pipe(
      shareReplay(1)
    );

    return of(configs);
  }

  /**
   * Obtiene una configuración específica (asíncrono)
   */
  getConfig<T>(categoria: string, clave: string): Observable<T | null> {
    return this.getAllConfigs().pipe(
      map(() => {
        const config = this.getConfigFromCache(categoria, clave);
        if (!config || !config.activo) return null;

        return this.parseConfigValue<T>(config);
      }),
      catchError(() => of(null))
    );
  }

  /**
   * Obtiene una configuración específica (síncrono)
   */
  getConfigSync<T>(categoria: string, clave: string, defaultValue: T): T {
    const config = this.getConfigFromCache(categoria, clave);
    if (!config || !config.activo) return defaultValue;

    return this.parseConfigValue<T>(config) ?? defaultValue;
  }

  private parseConfigValue<T>(config: ConfiguracionBase): T | null {
    try {
      switch (config.tipo_dato) {
        case 'json':
          return JSON.parse(config.valor) as T;
        case 'number':
          return Number(config.valor) as T;
        case 'boolean':
          return (config.valor === 'true') as T;
        case 'date':
          return new Date(config.valor) as T;
        default:
          return config.valor as T;
      }
    } catch (e) {
      console.error(`Error parsing config ${config.categoria}:${config.clave}`, e);
      return null;
    }
  }

  /**
   * Actualiza o crea una configuración
   */
  setConfig(config: Partial<ConfiguracionBase> & { categoria: string; clave: string; valor: string; tipo_dato: string }): Observable<boolean> {
    const existing = this.getConfigFromCache(config.categoria, config.clave);

    const newConfig: ConfiguracionBase = {
      id: existing?.id ?? Date.now(),
      categoria: config.categoria as any,
      clave: config.clave,
      valor: config.valor,
      tipo_dato: config.tipo_dato as any,
      descripcion: config.descripcion,
      activo: config.activo ?? true,
      fecha_modificacion: new Date().toISOString(),
      usuario_modificacion: config.usuario_modificacion,
      version: (existing?.version ?? 0) + 1
    };

    const currentMap = new Map(this.configsSignal());
    currentMap.set(`${config.categoria}:${config.clave}`, newConfig);
    this.configsSignal.set(currentMap);

    // Guardar en localStorage
    const allConfigs = Array.from(currentMap.values());
    this.saveToLocalStorage(allConfigs);

    // Invalidar cache
    this.cache$ = null;

    return of(true);
  }

  /**
   * Elimina una configuración
   */
  deleteConfig(categoria: string, clave: string): Observable<boolean> {
    const currentMap = new Map(this.configsSignal());
    const deleted = currentMap.delete(`${categoria}:${clave}`);

    if (deleted) {
      this.configsSignal.set(currentMap);
      const allConfigs = Array.from(currentMap.values());
      this.saveToLocalStorage(allConfigs);
      this.cache$ = null;
    }

    return of(deleted);
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - BANNER
  // ============================================================================

  getBannerConfig(): Observable<BannerConfig | null> {
    return this.getConfig<BannerConfig>('banner', 'config');
  }

  getBannerConfigSync(): BannerConfig | null {
    const config = this.getConfigFromCache('banner', 'config');
    if (!config) return null;
    return this.parseConfigValue<BannerConfig>(config);
  }

  /**
   * Determina si el banner debe mostrarse según las reglas de negocio
   */
  shouldShowBanner(): boolean {
    const bannerConfig = this.getBannerConfigSync();

    // 1. Verificar si está activo
    if (!bannerConfig || !bannerConfig.activo) {
      return false;
    }

    // 2. Verificar si estamos en el rango de fechas
    const now = new Date();
    const startDate = new Date(bannerConfig.fecha_inicio);
    const endDate = new Date(bannerConfig.fecha_fin);

    if (now < startDate || now > endDate) {
      return false;
    }

    // 3. Obtener estado de tracking
    const tracking = this.getBannerTracking();

    // 4. Si cambió la versión de config, resetear tracking
    if (tracking.configVersion !== bannerConfig.version) {
      this.resetBannerTracking(bannerConfig.version);
      return true;
    }

    const today = this.getTodayString();

    // 5. Verificar días consecutivos
    if (tracking.consecutiveDays >= bannerConfig.max_dias_consecutivos) {
      return false;
    }

    // 6. Verificar frecuencia diaria
    if (tracking.lastShownDate === today) {
      // Ya se mostró hoy
      if (tracking.countToday >= bannerConfig.frecuencia_diaria) {
        return false;
      }
    }

    return tracking.shouldShow;
  }

  /**
   * Registra que el banner fue mostrado
   */
  recordBannerShown(): void {
    const bannerConfig = this.getBannerConfigSync();
    if (!bannerConfig) return;

    const tracking = this.getBannerTracking();
    const today = this.getTodayString();

    let newTracking: BannerTrackingState;

    if (tracking.lastShownDate === today) {
      // Mismo día - incrementar contador
      newTracking = {
        ...tracking,
        countToday: tracking.countToday + 1,
        shouldShow: (tracking.countToday + 1) < bannerConfig.frecuencia_diaria
      };
    } else {
      // Nuevo día
      const yesterday = this.getYesterdayString();
      const isConsecutive = tracking.lastShownDate === yesterday;

      newTracking = {
        configVersion: bannerConfig.version,
        lastShownDate: today,
        countToday: 1,
        consecutiveDays: isConsecutive ? tracking.consecutiveDays + 1 : 1,
        shouldShow: 1 < bannerConfig.frecuencia_diaria
      };
    }

    this.saveBannerTracking(newTracking);
  }

  private getBannerTracking(): BannerTrackingState {
    try {
      const stored = localStorage.getItem(this.BANNER_TRACKING_KEY);
      if (stored) {
        return JSON.parse(stored) as BannerTrackingState;
      }
    } catch (e) {
      console.error('Error loading banner tracking:', e);
    }

    // Estado inicial
    return {
      configVersion: 0,
      lastShownDate: '',
      countToday: 0,
      consecutiveDays: 0,
      shouldShow: true
    };
  }

  private saveBannerTracking(tracking: BannerTrackingState): void {
    try {
      localStorage.setItem(this.BANNER_TRACKING_KEY, JSON.stringify(tracking));
    } catch (e) {
      console.error('Error saving banner tracking:', e);
    }
  }

  private resetBannerTracking(configVersion: number): void {
    const newTracking: BannerTrackingState = {
      configVersion,
      lastShownDate: '',
      countToday: 0,
      consecutiveDays: 0,
      shouldShow: true
    };
    this.saveBannerTracking(newTracking);
  }

  private getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getYesterdayString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - VIGENCIAS
  // ============================================================================

  getSgrVigenciasBienales(): Observable<string[]> {
    return this.getConfig<string[]>('fechas', 'sgr_vigencias_bienales').pipe(
      map(vigencias => vigencias ?? ['2025-2026', '2023-2024'])
    );
  }

  getSgrVigenciaDefecto(): Observable<string> {
    return this.getConfig<string>('fechas', 'sgr_vigencia_defecto').pipe(
      map(vigencia => vigencia ?? '2025-2026')
    );
  }

  getSgrRangoProyeccion(): Observable<string> {
    return this.getConfig<string>('fechas', 'sgr_rango_proyeccion').pipe(
      map(rango => rango ?? '2025-2034')
    );
  }

  getSgpVigenciasAnuales(): Observable<number[]> {
    return this.getConfig<number[]>('fechas', 'sgp_vigencias_anuales').pipe(
      map(vigencias => vigencias ?? [2026, 2025, 2024, 2023, 2022])
    );
  }

  getSgpAnioDefecto(): Observable<number> {
    return this.getConfig<number>('fechas', 'sgp_anio_defecto').pipe(
      map(anio => anio ?? 2026)
    );
  }

  getSgpRangoHistorico(): Observable<{ inicio: number; fin: number }> {
    return this.getConfig<{ inicio: number; fin: number }>('fechas', 'sgp_rango_historico').pipe(
      map(rango => rango ?? { inicio: 2002, fin: 2026 })
    );
  }

  getPgnVigenciasAnuales(): Observable<number[]> {
    return this.getConfig<number[]>('fechas', 'pgn_vigencias_anuales').pipe(
      map(vigencias => vigencias ?? [2025, 2024, 2023, 2022])
    );
  }

  getPgnRangoHistorico(): Observable<{ inicio: number; fin: number }> {
    return this.getConfig<{ inicio: number; fin: number }>('fechas', 'pgn_rango_historico').pipe(
      map(rango => rango ?? { inicio: 2002, fin: 2025 })
    );
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - COLORES
  // ============================================================================

  getColorPalette(nombre: string): Observable<string[]> {
    return this.getConfig<string[]>('colores', nombre).pipe(
      map(colores => colores ?? ['#156082', '#e97132', '#0c9bd3'])
    );
  }

  getColorPaletteSync(nombre: string, defaultColors: string[]): string[] {
    return this.getConfigSync<string[]>('colores', nombre, defaultColors);
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - URLS
  // ============================================================================

  getUrl(clave: string): Observable<string | null> {
    return this.getConfig<string>('urls', clave);
  }

  getUrlSync(clave: string, defaultUrl: string = ''): string {
    return this.getConfigSync<string>('urls', clave, defaultUrl);
  }

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - FECHAS DE ACTUALIZACIÓN Y CORTE
  // ============================================================================

  /**
   * Obtiene las fechas de actualización y corte para SGR vigencia actual
   */
  getSgrFechasActualizacion(vigencia: string = '2025-2026'): Observable<FechaActualizacion | null> {
    const clave = `sgr_fecha_actualizacion_vigencia_${vigencia.replace('-', '_')}`;
    return this.getConfig<FechaActualizacion>('fechas', clave);
  }

  /**
   * Obtiene las fechas de actualización y corte para SGR vigencia actual (síncrono)
   */
  getSgrFechasActualizacionSync(vigencia: string = '2025-2026'): FechaActualizacion | null {
    const clave = `sgr_fecha_actualizacion_vigencia_${vigencia.replace('-', '_')}`;
    const defaultValue: FechaActualizacion = {
      fecha_actualizacion: 'mayo 30 de 2025',
      fecha_corte_recaudo: 'junio 30 de 2025',
      fecha_iso_actualizacion: '2025-05-30',
      fecha_iso_corte: '2025-06-30'
    };
    return this.getConfigSync<FechaActualizacion>('fechas', clave, defaultValue);
  }

  /**
   * Obtiene las fechas del plan bienal SGR
   */
  getSgrFechasPlanBienal(vigencia: string = '2025-2026'): Observable<FechaActualizacion | null> {
    const clave = `sgr_fecha_plan_bienal_${vigencia.replace('-', '_')}`;
    return this.getConfig<FechaActualizacion>('fechas', clave);
  }

  /**
   * Obtiene las fechas del plan bienal SGR (síncrono)
   */
  getSgrFechasPlanBienalSync(vigencia: string = '2025-2026'): FechaActualizacion | null {
    const clave = `sgr_fecha_plan_bienal_${vigencia.replace('-', '_')}`;
    const defaultValue: FechaActualizacion = {
      fecha_actualizacion: 'febrero 12 de 2026',
      fecha_corte_recaudo: 'enero 31 de 2026',
      fecha_iso_actualizacion: '2026-02-12',
      fecha_iso_corte: '2026-01-31'
    };
    return this.getConfigSync<FechaActualizacion>('fechas', clave, defaultValue);
  }

  /**
   * Obtiene las fechas para reporte de eficiencias SGP
   */
  getSgpFechasEficiencias(): Observable<FechaActualizacion | null> {
    return this.getConfig<FechaActualizacion>('fechas', 'sgp_fecha_eficiencias');
  }

  /**
   * Obtiene las fechas para reporte de eficiencias SGP (síncrono)
   */
  getSgpFechasEficienciasSync(): FechaActualizacion | null {
    const defaultValue: FechaActualizacion = {
      fecha_actualizacion: 'octubre 01 de 2025',
      fecha_corte_recaudo: '31 de agosto de 2024',
      fecha_iso_actualizacion: '2025-10-01',
      fecha_iso_corte: '2024-08-31'
    };
    return this.getConfigSync<FechaActualizacion>('fechas', 'sgp_fecha_eficiencias', defaultValue);
  }

  /**
   * Obtiene la fecha de actualización para resguardos SGP
   */
  getSgpFechaResguardos(): Observable<FechaActualizacion | null> {
    return this.getConfig<FechaActualizacion>('fechas', 'sgp_fecha_resguardos');
  }

  /**
   * Obtiene la fecha de actualización para resguardos SGP (síncrono)
   */
  getSgpFechaResguardosSync(): FechaActualizacion | null {
    const defaultValue: FechaActualizacion = {
      fecha_actualizacion: 'mayo 28 de 2026',
      fecha_iso_actualizacion: '2026-05-28'
    };
    return this.getConfigSync<FechaActualizacion>('fechas', 'sgp_fecha_resguardos', defaultValue);
  }

  /**
   * Obtiene el diccionario completo de fechas para reporte de funcionamiento SGR
   */
  getSgrFechasReporteFuncionamiento(): Observable<FechasReporteFuncionamiento[] | null> {
    return this.getConfig<FechasReporteFuncionamiento[]>('fechas', 'sgr_fechas_reporte_funcionamiento');
  }

  /**
   * Obtiene el diccionario completo de fechas para reporte de funcionamiento SGR (síncrono)
   */
  getSgrFechasReporteFuncionamientoSync(): FechasReporteFuncionamiento[] {
    const defaultValue: FechasReporteFuncionamiento[] = [
      {
        vigencia: '2012-2013',
        fecha_actualizacion: 'diciembre 31 de 2013',
        fecha_corte_recaudo: 'diciembre 31 de 2013',
        fecha_iso_actualizacion: '2013-12-31',
        fecha_iso_corte: '2013-12-31'
      },
      {
        vigencia: '2025-2026',
        fecha_actualizacion: 'mayo 30 de 2025',
        fecha_corte_recaudo: 'junio 30 de 2025',
        fecha_iso_actualizacion: '2025-05-30',
        fecha_iso_corte: '2025-06-30'
      }
    ];
    return this.getConfigSync<FechasReporteFuncionamiento[]>('fechas', 'sgr_fechas_reporte_funcionamiento', defaultValue);
  }

  /**
   * Obtiene las fechas de una vigencia específica del reporte de funcionamiento
   */
  getSgrFechasReporteFuncionamientoPorVigencia(vigencia: string): FechasReporteFuncionamiento | null {
    const todasLasFechas = this.getSgrFechasReporteFuncionamientoSync();
    return todasLasFechas.find(f => f.vigencia === vigencia) || null;
  }
}
