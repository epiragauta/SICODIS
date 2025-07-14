import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSgpResguardosComponent } from './reports-sgp-resguardos.component';

describe('ReportsSgpResguardosComponent', () => {
  let component: ReportsSgpResguardosComponent;
  let fixture: ComponentFixture<ReportsSgpResguardosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSgpResguardosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSgpResguardosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
