import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnComparativaRegionalizacionComponent } from './pgn-comparativa-regionalizacion.component';

describe('PgnComparativaRegionalizacionComponent', () => {
  let component: PgnComparativaRegionalizacionComponent;
  let fixture: ComponentFixture<PgnComparativaRegionalizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnComparativaRegionalizacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnComparativaRegionalizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});