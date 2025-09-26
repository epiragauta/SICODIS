import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnInversionPorSectorComponent } from './pgn-inversion-por-sector.component';

describe('PgnInversionPorSectorComponent', () => {
  let component: PgnInversionPorSectorComponent;
  let fixture: ComponentFixture<PgnInversionPorSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnInversionPorSectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnInversionPorSectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
