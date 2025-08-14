import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnRegionalizacionPresupuestoProgramacionComponent } from './pgn-regionalizacion-presupuesto-programacion.component';

describe('PgnRegionalizacionPresupuestoProgramacionComponent', () => {
  let component: PgnRegionalizacionPresupuestoProgramacionComponent;
  let fixture: ComponentFixture<PgnRegionalizacionPresupuestoProgramacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnRegionalizacionPresupuestoProgramacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnRegionalizacionPresupuestoProgramacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});