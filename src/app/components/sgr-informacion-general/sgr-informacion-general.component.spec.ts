import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SgrInformacionGeneralComponent } from './sgr-informacion-general.component';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { provideHttpClient } from '@angular/common/http';

describe('SgrInformacionGeneralComponent', () => {
  let component: SgrInformacionGeneralComponent;
  let fixture: ComponentFixture<SgrInformacionGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrInformacionGeneralComponent],
      providers: [
        SicodisApiService,
        provideHttpClient()
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

  it('should initialize with default values', () => {
    expect(component.periodicidad).toBe('Bienal');
    expect(component.caracterizacionSeleccionada).toBe('grupoInteres');
    expect(component.entidadSeleccionada).toBe('zomac');
    expect(component.presupuestoSeleccionado).toBe('total');
    expect(component.recaudoSeleccionado).toBe('total');
    expect(component.porcentajeDisponibilidad).toBe(50);
  });

  it('should have KPI data', () => {
    expect(component.kpiData.presupuestoTotal).toBeGreaterThan(0);
    expect(component.kpiData.recaudoCorriente).toBeGreaterThan(0);
    expect(component.kpiData.avanceRecaudo).toBeGreaterThan(0);
  });

  it('should have entidades count', () => {
    expect(component.entidadesCount.beneficiarias).toBeGreaterThan(0);
    expect(component.entidadesCount.productoras).toBeGreaterThan(0);
  });

  it('should update porcentajeDisponibilidad', () => {
    component.porcentajeDisponibilidad = 75;
    expect(component.porcentajeDisponibilidad).toBe(75);

    component.porcentajeDisponibilidad = 0;
    expect(component.porcentajeDisponibilidad).toBe(0);

    component.porcentajeDisponibilidad = 100;
    expect(component.porcentajeDisponibilidad).toBe(100);
  });

  it('should calculate porcentajeCorriente correctly', () => {
    const expected = (component.presupuestoMetricas.presupuestoCorriente / component.presupuestoMetricas.presupuestoTotal) * 100;
    expect(component.porcentajeCorriente).toBeCloseTo(expected, 2);
  });

  it('should calculate porcentajeOtros correctly', () => {
    const expected = (component.presupuestoMetricas.presupuestoOtros / component.presupuestoMetricas.presupuestoTotal) * 100;
    expect(component.porcentajeOtros).toBeCloseTo(expected, 2);
  });
});
