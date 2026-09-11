import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { SgrInicioComponent } from './sgr-inicio.component';

describe('SgrInicioComponent', () => {
  let component: SgrInicioComponent;
  let fixture: ComponentFixture<SgrInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrInicioComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SgrInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
