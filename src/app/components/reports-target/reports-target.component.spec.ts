import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTargetComponent } from './reports-target.component';

describe('ReportsTargetComponent', () => {
  let component: ReportsTargetComponent;
  let fixture: ComponentFixture<ReportsTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsTargetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
