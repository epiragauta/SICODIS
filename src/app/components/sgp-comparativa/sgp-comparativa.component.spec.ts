import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpComparativaComponent } from './sgp-comparativa.component';

describe('SgpComparativaComponent', () => {
  let component: SgpComparativaComponent;
  let fixture: ComponentFixture<SgpComparativaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpComparativaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpComparativaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
