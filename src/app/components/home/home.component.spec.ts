import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';

import { HomeComponent } from './home.component';
import { ConfigService, BannerConfig } from '../../services/config.service';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { Router } from '@angular/router';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let configServiceSpy: jasmine.SpyObj<ConfigService>;
  let sicodisApiServiceSpy: jasmine.SpyObj<SicodisApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  const mockBannerConfig: BannerConfig = {
    id: 1,
    activo: true,
    titulo: 'Test Banner',
    mensaje: 'Test Message',
    tipo: 'info',
    imagen_url: '/assets/img/test.jpg',
    boton_texto: 'Ver más',
    boton_url: 'https://test.com',
    fecha_inicio: '2026-01-01',
    fecha_fin: '2026-12-31',
    frecuencia_diaria: 1,
    max_dias_consecutivos: 5,
    version: 1
  };

  beforeEach(async () => {
    const configSpy = jasmine.createSpyObj('ConfigService', [
      'getBannerConfigSync',
      'shouldShowBanner',
      'recordBannerShown'
    ]);

    const sicodisSpy = jasmine.createSpyObj('SicodisApiService', [
      'getSgpResumenParticipaciones'
    ]);

    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    const breakpointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointSpy.observe.and.returnValue(of({ matches: true, breakpoints: {} }));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: ConfigService, useValue: configSpy },
        { provide: SicodisApiService, useValue: sicodisSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: BreakpointObserver, useValue: breakpointSpy }
      ]
    }).compileComponents();

    configServiceSpy = TestBed.inject(ConfigService) as jasmine.SpyObj<ConfigService>;
    sicodisApiServiceSpy = TestBed.inject(SicodisApiService) as jasmine.SpyObj<SicodisApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    breakpointObserverSpy = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;

    // Defaults
    configServiceSpy.getBannerConfigSync.and.returnValue(mockBannerConfig);
    configServiceSpy.shouldShowBanner.and.returnValue(false);
    sicodisApiServiceSpy.getSgpResumenParticipaciones.and.returnValue(of([]));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  // ============================================================================
  // INICIALIZACIÓN
  // ============================================================================

  describe('Inicialización', () => {
    it('should create', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should initialize banner on ngOnInit', () => {
      fixture.detectChanges();

      expect(configServiceSpy.getBannerConfigSync).toHaveBeenCalled();
      expect(configServiceSpy.shouldShowBanner).toHaveBeenCalled();
    });

    it('should initialize charts on ngOnInit', () => {
      spyOn<any>(component, 'initializeDonutChart');
      spyOn<any>(component, 'initializeSgrDonutCharts');

      fixture.detectChanges();

      expect(component['initializeDonutChart']).toHaveBeenCalled();
      expect(component['initializeSgrDonutCharts']).toHaveBeenCalled();
    });

    it('should load SGP data on ngOnInit', () => {
      fixture.detectChanges();

      expect(sicodisApiServiceSpy.getSgpResumenParticipaciones).toHaveBeenCalledWith(2026, '0', '0');
    });
  });

  // ============================================================================
  // BANNER - VISUALIZACIÓN
  // ============================================================================

  describe('Banner - Visualización', () => {
    it('should show banner if shouldShowBanner returns true', () => {
      configServiceSpy.shouldShowBanner.and.returnValue(true);

      fixture.detectChanges();

      expect(component.showBanner).toBe(true);
      expect(component.bannerConfig).toEqual(mockBannerConfig);
    });

    it('should not show banner if shouldShowBanner returns false', () => {
      configServiceSpy.shouldShowBanner.and.returnValue(false);

      fixture.detectChanges();

      expect(component.showBanner).toBe(false);
    });

    it('should not show banner if config is null', () => {
      configServiceSpy.getBannerConfigSync.and.returnValue(null);
      configServiceSpy.shouldShowBanner.and.returnValue(true);

      fixture.detectChanges();

      expect(component.showBanner).toBe(false);
      expect(component.bannerConfig).toBeNull();
    });

    it('should not show banner if banner is inactive', () => {
      const inactiveBanner = { ...mockBannerConfig, activo: false };
      configServiceSpy.getBannerConfigSync.and.returnValue(inactiveBanner);
      configServiceSpy.shouldShowBanner.and.returnValue(false);

      fixture.detectChanges();

      expect(component.showBanner).toBe(false);
    });

    it('should log when banner is activated', () => {
      spyOn(console, 'log');
      configServiceSpy.shouldShowBanner.and.returnValue(true);

      fixture.detectChanges();

      expect(console.log).toHaveBeenCalledWith('Banner activado:', mockBannerConfig.titulo);
    });
  });

  // ============================================================================
  // BANNER - INTERACCIONES
  // ============================================================================

  describe('Banner - Interacciones', () => {
    beforeEach(() => {
      configServiceSpy.shouldShowBanner.and.returnValue(true);
      fixture.detectChanges();
    });

    it('should close banner when closeBanner is called', () => {
      expect(component.showBanner).toBe(true);

      component.closeBanner();

      expect(component.showBanner).toBe(false);
      expect(configServiceSpy.recordBannerShown).toHaveBeenCalled();
    });

    it('should log when banner is closed', () => {
      spyOn(console, 'log');

      component.closeBanner();

      expect(console.log).toHaveBeenCalledWith('Banner cerrado y tracking actualizado');
    });

    it('should record banner shown when closed', () => {
      component.closeBanner();

      expect(configServiceSpy.recordBannerShown).toHaveBeenCalledTimes(1);
    });

    it('should close banner and navigate when button is clicked', () => {
      const bannerWithButton = {
        ...mockBannerConfig,
        boton_url: 'https://example.com'
      };
      component.bannerConfig = bannerWithButton;

      spyOn(window, 'open');

      component.onBannerButtonClick();

      expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
      expect(component.showBanner).toBe(false);
      expect(configServiceSpy.recordBannerShown).toHaveBeenCalled();
    });

    it('should close banner even if no button URL', () => {
      const bannerWithoutButton = {
        ...mockBannerConfig,
        boton_url: undefined
      };
      component.bannerConfig = bannerWithoutButton;

      component.onBannerButtonClick();

      expect(component.showBanner).toBe(false);
      expect(configServiceSpy.recordBannerShown).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // NAVEGACIÓN
  // ============================================================================

  describe('Navegación', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to SGR recaudo mensual', () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.redirectSGR();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/sgr-recaudo-mensual']);
    });

    it('should navigate to SGP inicio', () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.redirectSGP();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/sgp-inicio']);
    });

    it('should navigate to generic page', () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.redirectTo('test-page');

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/test-page']);
    });

    it('should scroll to top after navigation', async () => {
      routerSpy.navigate.and.returnValue(Promise.resolve(true));
      spyOn(window, 'scrollTo');

      await component.redirectSGR();

      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });
  });

  // ============================================================================
  // SGP DATA LOADING
  // ============================================================================

  describe('SGP Data Loading', () => {
    it('should process SGP data when loaded successfully', () => {
      const mockData = [
        { id_concepto: 99, total: 100000 },
        { id_concepto: 1000, total: 50000 },
        { id_concepto: 2000, total: 30000 }
      ];

      sicodisApiServiceSpy.getSgpResumenParticipaciones.and.returnValue(of(mockData));
      spyOn<any>(component, 'processSgpData');

      fixture.detectChanges();

      expect(component['processSgpData']).toHaveBeenCalledWith(mockData);
    });

    it('should handle error when loading SGP data', () => {
      spyOn(console, 'error');
      sicodisApiServiceSpy.getSgpResumenParticipaciones.and.returnValue(
        of({ error: 'test error' } as any)
      );

      fixture.detectChanges();

      expect(console.error).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // CHARTS
  // ============================================================================

  describe('Charts', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should have SGP items', () => {
      expect(component.sgpItems).toBeDefined();
      expect(component.sgpItems.length).toBeGreaterThan(0);
    });

    it('should have SGR items', () => {
      expect(component.sgrItems).toBeDefined();
      expect(component.sgrItems.length).toBeGreaterThan(0);
    });

    it('should initialize donut chart options', () => {
      expect(component.donutSgpOptions).toBeDefined();
      expect(component.donutSgpOptions.cutout).toBe('60%');
      expect(component.donutSgpOptions.rotation).toBe(-90);
      expect(component.donutSgpOptions.circumference).toBe(180);
    });

    it('should initialize SGR donut chart options', () => {
      expect(component.donutSgrCorrientesOptions).toBeDefined();
      expect(component.donutSgrOtrosOptions).toBeDefined();
    });
  });

  // ============================================================================
  // CARDS DATA
  // ============================================================================

  describe('Cards Data', () => {
    it('should have cards defined', () => {
      expect(component.cards).toBeDefined();
      expect(component.cards.length).toBeGreaterThan(0);
    });

    it('should have card with SGR link', () => {
      const sgrCard = component.cards.find(c => c.title.includes('Regalías'));
      expect(sgrCard).toBeDefined();
      expect(sgrCard?.link).toContain('dnp.gov.co');
    });

    it('should have card with SGP link', () => {
      const sgpCard = component.cards.find(c => c.title.includes('Participaciones'));
      expect(sgpCard).toBeDefined();
      expect(sgpCard?.link).toContain('dnp.gov.co');
    });
  });

  // ============================================================================
  // RESPONSIVE
  // ============================================================================

  describe('Responsive Behavior', () => {
    it('should have initial column count', () => {
      fixture.detectChanges();
      expect(component.cols).toBeDefined();
    });

    it('should observe breakpoints', () => {
      fixture.detectChanges();
      expect(breakpointObserverSpy.observe).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle null banner config gracefully', () => {
      configServiceSpy.getBannerConfigSync.and.returnValue(null);
      configServiceSpy.shouldShowBanner.and.returnValue(false);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.showBanner).toBe(false);
    });

    it('should handle banner config without optional fields', () => {
      const minimalBanner: BannerConfig = {
        id: 1,
        activo: true,
        titulo: 'Minimal',
        mensaje: 'Message',
        tipo: 'info',
        fecha_inicio: '2026-01-01',
        fecha_fin: '2026-12-31',
        frecuencia_diaria: 1,
        max_dias_consecutivos: 5,
        version: 1
      };

      configServiceSpy.getBannerConfigSync.and.returnValue(minimalBanner);
      configServiceSpy.shouldShowBanner.and.returnValue(true);

      expect(() => fixture.detectChanges()).not.toThrow();
      expect(component.bannerConfig).toEqual(minimalBanner);
    });

    it('should handle empty SGP data', () => {
      sicodisApiServiceSpy.getSgpResumenParticipaciones.and.returnValue(of([]));

      expect(() => fixture.detectChanges()).not.toThrow();
    });
  });
});
