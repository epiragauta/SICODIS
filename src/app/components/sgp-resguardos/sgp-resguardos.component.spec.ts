import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SgpResguardosComponent } from './sgp-resguardos.component';
import { SicodisApiService } from '../../services/sicodis-api.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('SgpResguardosComponent', () => {
  let component: SgpResguardosComponent;
  let fixture: ComponentFixture<SgpResguardosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpResguardosComponent],
      providers: [
        SicodisApiService,
        provideHttpClient(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpResguardosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedVigencia).toBe(2026);
    expect(component.selectedDepartamento).toBe('91');
    expect(component.selectedMunicipio).toBe('001');
  });

  it('should have historical data for three years', () => {
    expect(component.datosHistoricos.length).toBe(3);
  });

  it('should calculate budget difference correctly', () => {
    const expectedDifference = component.datosHistoricos[0].presupuesto - component.datosHistoricos[1].presupuesto;
    expect(component.diferenciaPresupuesto).toBe(expectedDifference);
  });

  it('should calculate population difference correctly', () => {
    const expectedDifference = component.datosHistoricos[0].poblacion - component.datosHistoricos[1].poblacion;
    expect(component.diferenciaPoblacion).toBe(expectedDifference);
  });
});
