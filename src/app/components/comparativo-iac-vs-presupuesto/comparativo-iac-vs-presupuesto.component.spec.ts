import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativoIacVsPresupuestoComponent } from './comparativo-iac-vs-presupuesto.component';

describe('ComparativoIacVsPresupuestoComponent', () => {
  let component: ComparativoIacVsPresupuestoComponent;
  let fixture: ComponentFixture<ComparativoIacVsPresupuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComparativoIacVsPresupuestoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparativoIacVsPresupuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
