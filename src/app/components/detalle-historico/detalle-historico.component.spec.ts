import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHistoricoComponent } from './detalle-historico.component';

describe('DetalleHistoricoComponent', () => {
  let component: DetalleHistoricoComponent;
  let fixture: ComponentFixture<DetalleHistoricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHistoricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
