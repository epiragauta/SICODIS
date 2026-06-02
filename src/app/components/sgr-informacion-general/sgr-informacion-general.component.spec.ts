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

  it('should initialize with default periodicidad', () => {
    expect(component.periodicidad).toBe('Bienal');
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

  it('should navigate presupuesto correctly', () => {
    expect(component.currentPresupuestoIndex).toBe(0);
    component.nextPresupuesto();
    expect(component.currentPresupuestoIndex).toBe(1);
    component.prevPresupuesto();
    expect(component.currentPresupuestoIndex).toBe(0);
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
