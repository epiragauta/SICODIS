import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteFuncionamientoComponent } from './reporte-funcionamiento.component';

describe('ReporteFuncionamientoComponent', () => {
  let component: ReporteFuncionamientoComponent;
  let fixture: ComponentFixture<ReporteFuncionamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteFuncionamientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteFuncionamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
