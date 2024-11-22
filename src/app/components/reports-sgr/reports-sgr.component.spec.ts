import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsSgrComponent } from './reports-sgr.component';

describe('ReportsSgrComponent', () => {
  let component: ReportsSgrComponent;
  let fixture: ComponentFixture<ReportsSgrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsSgrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsSgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
