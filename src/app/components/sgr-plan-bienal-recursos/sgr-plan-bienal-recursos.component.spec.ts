import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgrPlanBienalRecursosComponent } from './sgr-plan-bienal-recursos.component';

describe('SgrPlanBienalRecursosComponent', () => {
  let component: SgrPlanBienalRecursosComponent;
  let fixture: ComponentFixture<SgrPlanBienalRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrPlanBienalRecursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrPlanBienalRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
