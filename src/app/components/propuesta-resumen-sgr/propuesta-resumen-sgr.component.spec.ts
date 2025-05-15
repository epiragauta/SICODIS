import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestaResumenSgrComponent } from './propuesta-resumen-sgr.component';

describe('PropuestaResumenSgrComponent', () => {
  let component: PropuestaResumenSgrComponent;
  let fixture: ComponentFixture<PropuestaResumenSgrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropuestaResumenSgrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropuestaResumenSgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
