import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpResguardosComponent } from './sgp-resguardos.component';

describe('SgpResguardosComponent', () => {
  let component: SgpResguardosComponent;
  let fixture: ComponentFixture<SgpResguardosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpResguardosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpResguardosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
