import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SgrInformacionGeneralComponent } from './sgr-informacion-general.component';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SgrInformacionGeneralComponent', () => {
  let component: SgrInformacionGeneralComponent;
  let fixture: ComponentFixture<SgrInformacionGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrInformacionGeneralComponent],
      providers: [
        SicodisApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrInformacionGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with every periodicity filter switched off', () => {
    // El filtro de periodicidad quedó desacoplado de los KPIs: arranca vacío y
    // es el usuario quien activa bienio, año o mes.
    expect(component.periodicidadActiva).toEqual({ bienio: false, anio: false, mes: false });
    expect(component.bieniosSeleccionados).toEqual([]);
    expect(component.aniosSeleccionados).toEqual([]);
  });

  it('should start with every characterization switched off', () => {
    expect(component.caracterizacionesActivas).toEqual({
      conceptoGasto: false,
      regional: false,
      asignacion: false,
      grupoInteres: false
    });
  });

  it('should initialize selection defaults', () => {
    // Cadena vacía = sin filtro por atributo de entidad.
    expect(component.entidadSeleccionada).toBe('');
    expect(component.presupuestoSeleccionado).toBe('total');
    expect(component.recaudoSeleccionado).toBe('total');
    expect(component.porcentajeDisponibilidad).toBe(50);
  });

  it('should expose the entity counters', () => {
    expect(component.entidadesCount.beneficiarias).toBeGreaterThanOrEqual(0);
    expect(component.entidadesCount.productoras).toBeGreaterThanOrEqual(0);
    expect(component.entidadesCount.zomac).toBeGreaterThanOrEqual(0);
    expect(component.entidadesCount.pdet).toBeGreaterThanOrEqual(0);
  });

  it('should update porcentajeDisponibilidad', () => {
    component.porcentajeDisponibilidad = 75;
    expect(component.porcentajeDisponibilidad).toBe(75);

    component.porcentajeDisponibilidad = 0;
    expect(component.porcentajeDisponibilidad).toBe(0);

    component.porcentajeDisponibilidad = 100;
    expect(component.porcentajeDisponibilidad).toBe(100);
  });

  it('should calculate porcentajeCorriente over the budget total', () => {
    component.presupuestoMetricas = {
      presupuestoTotal: 1000,
      presupuestoCorriente: 250,
      presupuestoOtros: 750,
      porcentajeDisponibilidad: 0
    };

    expect(component.porcentajeCorriente).toBeCloseTo(25, 2);
  });

  it('should calculate porcentajeOtros over the budget total', () => {
    component.presupuestoMetricas = {
      presupuestoTotal: 1000,
      presupuestoCorriente: 250,
      presupuestoOtros: 750,
      porcentajeDisponibilidad: 0
    };

    expect(component.porcentajeOtros).toBeCloseTo(75, 2);
  });

  it('should not divide by zero when there is no budget loaded', () => {
    component.presupuestoMetricas = {
      presupuestoTotal: 0,
      presupuestoCorriente: 0,
      presupuestoOtros: 0,
      porcentajeDisponibilidad: 0
    };

    expect(component.porcentajeCorriente).toBe(0);
    expect(component.porcentajeOtros).toBe(0);
  });
});
