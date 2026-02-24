import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgrPlanBienalCajaComponent } from './sgr-plan-bienal-caja.component';

describe('SgrPlanBienalCajaComponent', () => {
  let component: SgrPlanBienalCajaComponent;
  let fixture: ComponentFixture<SgrPlanBienalCajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrPlanBienalCajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrPlanBienalCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
