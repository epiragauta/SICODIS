import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { PgnInversionPorSectorComponent } from './pgn-inversion-por-sector.component';

describe('PgnInversionPorSectorComponent', () => {
  let component: PgnInversionPorSectorComponent;
  let fixture: ComponentFixture<PgnInversionPorSectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnInversionPorSectorComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
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
