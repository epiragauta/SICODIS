import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpEficienciasComponent } from './sgp-eficiencias.component';

describe('SgpEficienciasComponent', () => {
  let component: SgpEficienciasComponent;
  let fixture: ComponentFixture<SgpEficienciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpEficienciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgpEficienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});