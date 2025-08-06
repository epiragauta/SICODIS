import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpDetallePresupuestalComponent } from './sgp-detalle-presupuestal.component';

describe('SgpDetallePresupuestalComponent', () => {
  let component: SgpDetallePresupuestalComponent;
  let fixture: ComponentFixture<SgpDetallePresupuestalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpDetallePresupuestalComponent]
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
