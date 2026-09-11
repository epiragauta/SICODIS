import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { PgnRegionalizacionPresupuestoSeguimientoComponent } from './pgn-regionalizacion-presupuesto-seguimiento.component';

describe('PgnRegionalizacionPresupuestoSeguimientoComponent', () => {
  let component: PgnRegionalizacionPresupuestoSeguimientoComponent;
  let fixture: ComponentFixture<PgnRegionalizacionPresupuestoSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnRegionalizacionPresupuestoSeguimientoComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnRegionalizacionPresupuestoSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});