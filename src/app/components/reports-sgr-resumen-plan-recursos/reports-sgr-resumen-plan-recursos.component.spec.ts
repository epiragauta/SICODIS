import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSgrResumenPlanRecursosComponent } from './reports-sgr-resumen-plan-recursos.component';

describe('ReportsSgrResumenPlanRecursosComponent', () => {
  let component: ReportsSgrResumenPlanRecursosComponent;
  let fixture: ComponentFixture<ReportsSgrResumenPlanRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSgrResumenPlanRecursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSgrResumenPlanRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
