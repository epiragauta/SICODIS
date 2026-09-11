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
    // Los filtros arrancan en «todos» ('0'); el departamento y el municipio
    // concretos los elige el usuario y la vigencia la fija `cargarVigencias()`
    // con la más reciente que devuelva la API.
    expect(component.selectedVigencia).toBe(2026);
    expect(component.selectedDepartamento).toBe('0');
    expect(component.selectedMunicipio).toBe('0');
  });

  it('should start without historical data until the API answers', () => {
    // `datosHistoricos` se llena con la consulta por municipio; sin municipio
    // seleccionado no hay serie que comparar.
    expect(component.datosHistoricos).toEqual([]);
  });
});
