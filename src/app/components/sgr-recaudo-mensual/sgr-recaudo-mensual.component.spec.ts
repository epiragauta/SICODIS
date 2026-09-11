import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgrRecaudoMensualComponent } from './sgr-recaudo-mensual.component';

describe('SgrRecaudoMensualComponent', () => {
  let component: SgrRecaudoMensualComponent;
  let fixture: ComponentFixture<SgrRecaudoMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrRecaudoMensualComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrRecaudoMensualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
