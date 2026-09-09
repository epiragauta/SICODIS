import { TestBed } from '@angular/core/testing';
import { ConfigService, BannerConfig, BannerTrackingState, ConfiguracionBase } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let localStorageSpy: jasmine.SpyObj<Storage>;
  /** `localStorage` real, para devolverlo al terminar y no contaminar otras suites. */
  let localStorageOriginal: PropertyDescriptor | undefined;

  beforeEach(() => {
    localStorageOriginal = Object.getOwnPropertyDescriptor(window, 'localStorage');
    // Mock localStorage
    const localStorageStore: { [key: string]: string } = {};
    localStorageSpy = jasmine.createSpyObj('localStorage', ['getItem', 'setItem', 'removeItem', 'clear']);

    localStorageSpy.getItem.and.callFake((key: string) => {
      return localStorageStore[key] || null;
    });

    localStorageSpy.setItem.and.callFake((key: string, value: string) => {
      localStorageStore[key] = value;
    });

    localStorageSpy.removeItem.and.callFake((key: string) => {
      delete localStorageStore[key];
    });

    localStorageSpy.clear.and.callFake(() => {
      Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
    });

    // Replace global localStorage with spy
    Object.defineProperty(window, 'localStorage', {
      value: localStorageSpy,
      writable: true
    });

    TestBed.configureTestingModule({
      providers: [ConfigService]
    });

    service = TestBed.inject(ConfigService);
  });

  afterEach(() => {
    localStorageSpy.clear();

    // Sin esto, el doble de `localStorage` sobrevive a esta suite y hace
    // fallar a las que se ejecuten después (p. ej. el tracking del banner).
    if (localStorageOriginal) {
      Object.defineProperty(window, 'localStorage', localStorageOriginal);
    }
  });

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  describe('Inicialización', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with default configurations', (done) => {
      service.getAllConfigs().subscribe(configs => {
        expect(configs.length).toBeGreaterThan(0);
        expect(configs.some(c => c.categoria === 'banner')).toBe(true);
        expect(configs.some(c => c.categoria === 'fechas')).toBe(true);
        expect(configs.some(c => c.categoria === 'colores')).toBe(true);
        expect(configs.some(c => c.categoria === 'urls')).toBe(true);
        done();
      });
    });

    it('should save default configs to localStorage on init', () => {
      expect(localStorageSpy.setItem).toHaveBeenCalledWith(
        'sicodis_all_configs',
        jasmine.any(String)
      );
    });
  });

  // ============================================================================
  // MÉTODOS CRUD - GETCONFIG
  // ============================================================================

  describe('getConfig', () => {
    it('should get configuration by category and key', (done) => {
      service.getConfig<string>('fechas', 'sgr_vigencia_defecto').subscribe(value => {
        expect(value).toBe('2025-2026');
        done();
      });
    });

    it('should return null for non-existent config', (done) => {
      service.getConfig<string>('categoria_inexistente', 'clave_inexistente').subscribe(value => {
        expect(value).toBeNull();
        done();
      });
    });

    it('should return null for inactive config', (done) => {
      // Primero crear una config inactiva
      service.setConfig({
        categoria: 'general',
        clave: 'inactive',
        valor: 'test',
        tipo_dato: 'string',
        activo: false
      }).subscribe(() => {
        service.getConfig<string>('general', 'inactive').subscribe(value => {
          expect(value).toBeNull();
          done();
        });
      });
    });

    it('should parse JSON values correctly', (done) => {
      service.getConfig<string[]>('fechas', 'sgr_vigencias_bienales').subscribe(value => {
        expect(Array.isArray(value)).toBe(true);
        expect(value).toContain('2025-2026');
        expect(value).toContain('2023-2024');
        done();
      });
    });

    it('should parse number values correctly', (done) => {
      service.getConfig<number>('fechas', 'sgp_anio_defecto').subscribe(value => {
        expect(typeof value).toBe('number');
        expect(value).toBe(2026);
        done();
      });
    });
  });

  describe('getConfigSync', () => {
    it('should get configuration synchronously', () => {
      const value = service.getConfigSync<string>('fechas', 'sgr_vigencia_defecto', '');
      expect(value).toBe('2025-2026');
    });

    it('should return default value for non-existent config', () => {
      const defaultValue = 'default';
      const value = service.getConfigSync<string>('inexistente', 'inexistente', defaultValue);
      expect(value).toBe(defaultValue);
    });

    it('should return default value for inactive config', () => {
      service.setConfig({
        categoria: 'general',
        clave: 'inactive',
        valor: 'test',
        tipo_dato: 'string',
        activo: false
      }).subscribe();

      const value = service.getConfigSync<string>('general', 'inactive', 'default');
      expect(value).toBe('default');
    });
  });

  // ============================================================================
  // MÉTODOS CRUD - SETCONFIG
  // ============================================================================

  describe('setConfig', () => {
    it('should create new configuration', (done) => {
      // `as const` evita que TypeScript ensanche los literales a `string` y
      // deje de encajar con la firma de `setConfig`.
      const newConfig = {
        categoria: 'general',
        clave: 'new_key',
        valor: 'new_value',
        tipo_dato: 'string',
        descripcion: 'Test config'
      } as const;

      service.setConfig(newConfig).subscribe(result => {
        expect(result).toBe(true);

        // Verificar que se guardó
        service.getConfig<string>('general', 'new_key').subscribe(value => {
          expect(value).toBe('new_value');
          done();
        });
      });
    });

    it('should update existing configuration', (done) => {
      // Primero crear
      service.setConfig({
        categoria: 'general',
        clave: 'update_test',
        valor: 'original',
        tipo_dato: 'string'
      }).subscribe(() => {
        // Luego actualizar
        service.setConfig({
          categoria: 'general',
          clave: 'update_test',
          valor: 'updated',
          tipo_dato: 'string'
        }).subscribe(result => {
          expect(result).toBe(true);

          // Verificar actualización
          service.getConfig<string>('general', 'update_test').subscribe(value => {
            expect(value).toBe('updated');
            done();
          });
        });
      });
    });

    it('should increment version on update', (done) => {
      service.setConfig({
        categoria: 'general',
        clave: 'version_test',
        valor: 'v1',
        tipo_dato: 'string'
      }).subscribe(() => {
        service.getAllConfigs().subscribe(configs => {
          const config1 = configs.find(c => c.categoria === 'general' && c.clave === 'version_test');
          expect(config1?.version).toBe(1);

          // Actualizar
          service.setConfig({
            categoria: 'general',
            clave: 'version_test',
            valor: 'v2',
            tipo_dato: 'string'
          }).subscribe(() => {
            service.getAllConfigs().subscribe(configs => {
              const config2 = configs.find(c => c.categoria === 'general' && c.clave === 'version_test');
              expect(config2?.version).toBe(2);
              done();
            });
          });
        });
      });
    });

    it('should invalidate cache after setConfig', (done) => {
      // `getAllConfigs()` no lee de localStorage —solo del mapa en memoria—,
      // así que la invalidación se comprueba por su efecto observable: la
      // siguiente lectura ve la configuración recién escrita.
      service.getAllConfigs().subscribe(antes => {
        expect(antes.some(c => c.clave === 'cache_test')).toBe(false);

        service.setConfig({
          categoria: 'general',
          clave: 'cache_test',
          valor: 'test',
          tipo_dato: 'string'
        }).subscribe(() => {
          service.getAllConfigs().subscribe(despues => {
            expect(despues.some(c => c.clave === 'cache_test')).toBe(true);
            done();
          });
        });
      });
    });
  });

  // ============================================================================
  // MÉTODOS CRUD - DELETECONFIG
  // ============================================================================

  describe('deleteConfig', () => {
    it('should delete configuration', (done) => {
      // Crear config
      service.setConfig({
        categoria: 'general',
        clave: 'to_delete',
        valor: 'test',
        tipo_dato: 'string'
      }).subscribe(() => {
        // Eliminar
        service.deleteConfig('general', 'to_delete').subscribe(result => {
          expect(result).toBe(true);

          // Verificar que no existe
          service.getConfig<string>('general', 'to_delete').subscribe(value => {
            expect(value).toBeNull();
            done();
          });
        });
      });
    });

    it('should return false when deleting non-existent config', (done) => {
      service.deleteConfig('inexistente', 'inexistente').subscribe(result => {
        expect(result).toBe(false);
        done();
      });
    });
  });

  // ============================================================================
  // BANNER - GETBANNERCONFIG
  // ============================================================================

  describe('getBannerConfig', () => {
    it('should get banner configuration', (done) => {
      service.getBannerConfig().subscribe(config => {
        expect(config).toBeTruthy();
        expect(config?.activo).toBeDefined();
        expect(config?.titulo).toBeDefined();
        expect(config?.mensaje).toBeDefined();
        expect(config?.tipo).toBeDefined();
        done();
      });
    });

    it('should parse banner config as JSON', (done) => {
      service.getBannerConfig().subscribe(config => {
        expect(config?.frecuencia_diaria).toBeDefined();
        expect(config?.max_dias_consecutivos).toBeDefined();
        expect(config?.fecha_inicio).toBeDefined();
        expect(config?.fecha_fin).toBeDefined();
        done();
      });
    });
  });

  describe('getBannerConfigSync', () => {
    it('should get banner configuration synchronously', () => {
      const config = service.getBannerConfigSync();
      expect(config).toBeTruthy();
      expect(config?.titulo).toBeDefined();
    });
  });

  // ============================================================================
  // BANNER - SHOULDSHOWBANNER
  // ============================================================================

  describe('shouldShowBanner', () => {
    beforeEach((done) => {
      // Resetear tracking antes de cada test
      localStorageSpy.removeItem('sicodis_banner_tracking');
      done();
    });

    it('should return false if banner is not active', (done) => {
      // Desactivar banner
      service.getBannerConfig().subscribe(currentConfig => {
        const updatedConfig = { ...currentConfig!, activo: false };
        service.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(updatedConfig),
          tipo_dato: 'json'
        }).subscribe(() => {
          const shouldShow = service.shouldShowBanner();
          expect(shouldShow).toBe(false);
          done();
        });
      });
    });

    it('should return false if current date is before fecha_inicio', (done) => {
      service.getBannerConfig().subscribe(currentConfig => {
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + 1);

        const updatedConfig = {
          ...currentConfig!,
          activo: true,
          fecha_inicio: futureDate.toISOString().split('T')[0],
          fecha_fin: new Date(futureDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        };

        service.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(updatedConfig),
          tipo_dato: 'json'
        }).subscribe(() => {
          const shouldShow = service.shouldShowBanner();
          expect(shouldShow).toBe(false);
          done();
        });
      });
    });

    it('should return false if current date is after fecha_fin', (done) => {
      service.getBannerConfig().subscribe(currentConfig => {
        const pastDate = new Date();
        pastDate.setFullYear(pastDate.getFullYear() - 1);

        const updatedConfig = {
          ...currentConfig!,
          activo: true,
          fecha_inicio: new Date(pastDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          fecha_fin: pastDate.toISOString().split('T')[0]
        };

        service.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(updatedConfig),
          tipo_dato: 'json'
        }).subscribe(() => {
          const shouldShow = service.shouldShowBanner();
          expect(shouldShow).toBe(false);
          done();
        });
      });
    });

    it('should return true if banner is active and within date range', (done) => {
      service.getBannerConfig().subscribe(currentConfig => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const updatedConfig = {
          ...currentConfig!,
          activo: true,
          fecha_inicio: yesterday.toISOString().split('T')[0],
          fecha_fin: tomorrow.toISOString().split('T')[0],
          frecuencia_diaria: 1,
          max_dias_consecutivos: 5,
          version: 999
        };

        service.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(updatedConfig),
          tipo_dato: 'json'
        }).subscribe(() => {
          const shouldShow = service.shouldShowBanner();
          expect(shouldShow).toBe(true);
          done();
        });
      });
    });

    it('should reset tracking if config version changed', (done) => {
      // Configurar tracking con versión antigua
      const oldTracking: BannerTrackingState = {
        configVersion: 1,
        lastShownDate: '2026-06-10',
        countToday: 5,
        consecutiveDays: 3,
        shouldShow: false
      };
      localStorageSpy.setItem('sicodis_banner_tracking', JSON.stringify(oldTracking));

      service.getBannerConfig().subscribe(currentConfig => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const updatedConfig = {
          ...currentConfig!,
          activo: true,
          fecha_inicio: yesterday.toISOString().split('T')[0],
          fecha_fin: tomorrow.toISOString().split('T')[0],
          version: 999 // Versión diferente
        };

        service.setConfig({
          categoria: 'banner',
          clave: 'config',
          valor: JSON.stringify(updatedConfig),
          tipo_dato: 'json'
        }).subscribe(() => {
          const shouldShow = service.shouldShowBanner();
          expect(shouldShow).toBe(true); // Debe mostrarse porque se reseteó
          done();
        });
      });
    });

    it('should return false if max consecutive days reached', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      // Simular que ya se alcanzó el máximo de días consecutivos
      const tracking: BannerTrackingState = {
        configVersion: bannerConfig.version,
        lastShownDate: new Date().toISOString().split('T')[0],
        countToday: 1,
        consecutiveDays: bannerConfig.max_dias_consecutivos, // Alcanzó el máximo
        shouldShow: false
      };
      localStorageSpy.setItem('sicodis_banner_tracking', JSON.stringify(tracking));

      const shouldShow = service.shouldShowBanner();
      expect(shouldShow).toBe(false);
    });

    it('should return false if daily frequency exceeded', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      const today = new Date().toISOString().split('T')[0];

      // Simular que ya se mostró el número máximo de veces hoy
      const tracking: BannerTrackingState = {
        configVersion: bannerConfig.version,
        lastShownDate: today,
        countToday: bannerConfig.frecuencia_diaria, // Alcanzó frecuencia máxima
        consecutiveDays: 1,
        shouldShow: false
      };
      localStorageSpy.setItem('sicodis_banner_tracking', JSON.stringify(tracking));

      const shouldShow = service.shouldShowBanner();
      expect(shouldShow).toBe(false);
    });
  });

  // ============================================================================
  // BANNER - RECORDBANNERSHOWN
  // ============================================================================

  describe('recordBannerShown', () => {
    beforeEach(() => {
      localStorageSpy.removeItem('sicodis_banner_tracking');
    });

    it('should create tracking state on first show', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      service.recordBannerShown();

      const trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      expect(trackingStr).toBeTruthy();

      const tracking = JSON.parse(trackingStr!) as BannerTrackingState;
      expect(tracking.configVersion).toBe(bannerConfig.version);
      expect(tracking.countToday).toBe(1);
      expect(tracking.consecutiveDays).toBe(1);
    });

    it('should increment countToday on same day', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      const today = new Date().toISOString().split('T')[0];

      // Primera vez
      service.recordBannerShown();

      // Segunda vez mismo día
      service.recordBannerShown();

      const trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      const tracking = JSON.parse(trackingStr!) as BannerTrackingState;

      expect(tracking.lastShownDate).toBe(today);
      expect(tracking.countToday).toBe(2);
      expect(tracking.consecutiveDays).toBe(1); // Mismo día, no incrementa
    });

    it('should increment consecutiveDays on consecutive day', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Simular que se mostró ayer
      const oldTracking: BannerTrackingState = {
        configVersion: bannerConfig.version,
        lastShownDate: yesterdayStr,
        countToday: 1,
        consecutiveDays: 2,
        shouldShow: true
      };
      localStorageSpy.setItem('sicodis_banner_tracking', JSON.stringify(oldTracking));

      // Mostrar hoy
      service.recordBannerShown();

      const trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      const tracking = JSON.parse(trackingStr!) as BannerTrackingState;

      expect(tracking.consecutiveDays).toBe(3); // Incrementó
      expect(tracking.countToday).toBe(1); // Nuevo día, resetea count
    });

    it('should reset consecutiveDays on non-consecutive day', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

      // Simular que se mostró hace 3 días
      const oldTracking: BannerTrackingState = {
        configVersion: bannerConfig.version,
        lastShownDate: threeDaysAgoStr,
        countToday: 1,
        consecutiveDays: 2,
        shouldShow: true
      };
      localStorageSpy.setItem('sicodis_banner_tracking', JSON.stringify(oldTracking));

      // Mostrar hoy (salto de días)
      service.recordBannerShown();

      const trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      const tracking = JSON.parse(trackingStr!) as BannerTrackingState;

      expect(tracking.consecutiveDays).toBe(1); // Reseteó
      expect(tracking.countToday).toBe(1);
    });

    it('should update shouldShow based on frequency', () => {
      const bannerConfig = service.getBannerConfigSync();
      if (!bannerConfig) return;

      // Configurar frecuencia de 2 veces por día
      const updatedConfig = { ...bannerConfig, frecuencia_diaria: 2 };
      service.setConfig({
        categoria: 'banner',
        clave: 'config',
        valor: JSON.stringify(updatedConfig),
        tipo_dato: 'json'
      }).subscribe();

      // Primera vez
      service.recordBannerShown();
      let trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      let tracking = JSON.parse(trackingStr!) as BannerTrackingState;
      expect(tracking.shouldShow).toBe(true); // Puede mostrar 1 vez más

      // Segunda vez
      service.recordBannerShown();
      trackingStr = localStorageSpy.getItem('sicodis_banner_tracking');
      tracking = JSON.parse(trackingStr!) as BannerTrackingState;
      expect(tracking.shouldShow).toBe(false); // Ya alcanzó el límite
    });
  });

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - VIGENCIAS
  // ============================================================================

  describe('Métodos de Vigencias', () => {
    it('should get SGR vigencias bienales', (done) => {
      service.getSgrVigenciasBienales().subscribe(vigencias => {
        expect(Array.isArray(vigencias)).toBe(true);
        expect(vigencias.length).toBeGreaterThan(0);
        expect(vigencias).toContain('2025-2026');
        done();
      });
    });

    it('should get SGR vigencia por defecto', (done) => {
      service.getSgrVigenciaDefecto().subscribe(vigencia => {
        expect(typeof vigencia).toBe('string');
        expect(vigencia).toBe('2025-2026');
        done();
      });
    });

    it('should get SGP vigencias anuales', (done) => {
      service.getSgpVigenciasAnuales().subscribe(vigencias => {
        expect(Array.isArray(vigencias)).toBe(true);
        expect(vigencias.some(v => v === 2026)).toBe(true);
        done();
      });
    });

    it('should get SGP año por defecto', (done) => {
      service.getSgpAnioDefecto().subscribe(anio => {
        expect(typeof anio).toBe('number');
        expect(anio).toBe(2026);
        done();
      });
    });

    it('should get SGP rango histórico', (done) => {
      service.getSgpRangoHistorico().subscribe(rango => {
        expect(rango).toBeTruthy();
        expect(rango.inicio).toBeDefined();
        expect(rango.fin).toBeDefined();
        expect(rango.inicio).toBeLessThan(rango.fin);
        done();
      });
    });
  });

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - COLORES
  // ============================================================================

  describe('Métodos de Colores', () => {
    it('should get color palette', (done) => {
      service.getColorPalette('historico_sgp').subscribe(colores => {
        expect(Array.isArray(colores)).toBe(true);
        expect(colores.length).toBeGreaterThan(0);
        expect(colores[0]).toMatch(/^#[0-9a-fA-F]{6}$/); // Formato hex
        done();
      });
    });

    it('should get color palette synchronously', () => {
      const defaultColors = ['#000000', '#ffffff'];
      const colores = service.getColorPaletteSync('historico_sgp', defaultColors);
      expect(Array.isArray(colores)).toBe(true);
      expect(colores.length).toBeGreaterThan(0);
    });

    it('should return default colors for non-existent palette', () => {
      const defaultColors = ['#000000', '#ffffff'];
      const colores = service.getColorPaletteSync('palette_inexistente', defaultColors);
      expect(colores).toEqual(defaultColors);
    });
  });

  // ============================================================================
  // MÉTODOS ESPECÍFICOS - URLS
  // ============================================================================

  describe('Métodos de URLs', () => {
    it('should get URL', (done) => {
      service.getUrl('sgr_sistema').subscribe(url => {
        expect(url).toBeTruthy();
        expect(typeof url).toBe('string');
        expect(url).toContain('http');
        done();
      });
    });

    it('should get URL synchronously', () => {
      const url = service.getUrlSync('sgr_sistema', '');
      expect(url).toBeTruthy();
      expect(typeof url).toBe('string');
    });

    it('should return default URL for non-existent key', () => {
      const defaultUrl = 'https://default.com';
      const url = service.getUrlSync('url_inexistente', defaultUrl);
      expect(url).toBe(defaultUrl);
    });
  });

  // ============================================================================
  // CACHE
  // ============================================================================

  describe('Sistema de Cache', () => {
    it('should cache configs for 5 minutes', (done) => {
      // Primera llamada - carga desde localStorage
      service.getAllConfigs().subscribe(() => {
        const firstCallCount = localStorageSpy.getItem.calls.count();

        // Segunda llamada inmediata - debe usar cache
        service.getAllConfigs().subscribe(() => {
          const secondCallCount = localStorageSpy.getItem.calls.count();

          // No debería haber llamadas adicionales a localStorage (usa cache)
          expect(secondCallCount).toBe(firstCallCount);
          done();
        });
      });
    });

    it('should invalidate cache after setConfig', (done) => {
      service.getAllConfigs().subscribe(antes => {
        const totalAntes = antes.length;

        service.setConfig({
          categoria: 'general',
          clave: 'cache_invalidation',
          valor: 'test',
          tipo_dato: 'string'
        }).subscribe(() => {
          // Sin invalidar, la segunda lectura devolvería la lista anterior.
          service.getAllConfigs().subscribe(despues => {
            expect(despues.length).toBe(totalAntes + 1);
            expect(despues.some(c => c.clave === 'cache_invalidation')).toBe(true);
            done();
          });
        });
      });
    });
  });

  // ============================================================================
  // EDGE CASES Y ERROR HANDLING
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle corrupted localStorage data gracefully', () => {
      // Corromper datos
      localStorageSpy.setItem('sicodis_all_configs', 'invalid json {{{');

      // No debería romper, debería inicializar defaults
      const service2 = new ConfigService();
      expect(service2).toBeTruthy();
    });

    it('should handle missing localStorage gracefully', () => {
      // Simular localStorage no disponible
      localStorageSpy.getItem.and.throwError('localStorage not available');

      const service2 = new ConfigService();
      expect(service2).toBeTruthy();
    });

    it('should handle empty banner config', () => {
      service.deleteConfig('banner', 'config').subscribe(() => {
        const config = service.getBannerConfigSync();
        expect(config).toBeNull();
      });
    });

    it('should parse boolean values correctly', (done) => {
      service.setConfig({
        categoria: 'general',
        clave: 'bool_test',
        valor: 'true',
        tipo_dato: 'boolean'
      }).subscribe(() => {
        service.getConfig<boolean>('general', 'bool_test').subscribe(value => {
          expect(typeof value).toBe('boolean');
          expect(value).toBe(true);
          done();
        });
      });
    });

    it('should parse date values correctly', (done) => {
      const dateStr = '2026-06-10';
      service.setConfig({
        categoria: 'general',
        clave: 'date_test',
        valor: dateStr,
        tipo_dato: 'date'
      }).subscribe(() => {
        service.getConfig<Date>('general', 'date_test').subscribe(value => {
          expect(value instanceof Date).toBe(true);
          done();
        });
      });
    });
  });
});
