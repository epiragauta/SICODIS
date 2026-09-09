import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgpDetallePresupuestalComponent } from './sgp-detalle-presupuestal.component';

describe('SgpDetallePresupuestalComponent', () => {
  let component: SgpDetallePresupuestalComponent;
  let fixture: ComponentFixture<SgpDetallePresupuestalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpDetallePresupuestalComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpDetallePresupuestalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
