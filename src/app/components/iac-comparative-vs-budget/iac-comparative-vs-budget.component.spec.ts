import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IacComparativeVsBudgetComponent } from './iac-comparative-vs-budget.component';

describe('IacComparativeVsBudgetComponent', () => {
  let component: IacComparativeVsBudgetComponent;
  let fixture: ComponentFixture<IacComparativeVsBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IacComparativeVsBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IacComparativeVsBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
