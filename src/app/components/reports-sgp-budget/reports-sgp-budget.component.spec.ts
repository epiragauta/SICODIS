import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSgpComponent } from './reports-sgp-budget.component';

describe('ReportsSgpComponent', () => {
  let component: ReportsSgpComponent;
  let fixture: ComponentFixture<ReportsSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});