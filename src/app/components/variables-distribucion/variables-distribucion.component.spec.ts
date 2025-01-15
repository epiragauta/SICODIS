import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesDistribucionComponent } from './variables-distribucion.component';

describe('VariablesDistribucionComponent', () => {
  let component: VariablesDistribucionComponent;
  let fixture: ComponentFixture<VariablesDistribucionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VariablesDistribucionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VariablesDistribucionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
