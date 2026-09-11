import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { FaqItemComponent } from './faq-item.component';

describe('FaqItemComponent', () => {
  let component: FaqItemComponent;
  let fixture: ComponentFixture<FaqItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqItemComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqItemComponent);
    component = fixture.componentInstance;
    // `item` es una entrada obligatoria: sin ella la plantilla revienta.
    component.item = {
      title: 'Pregunta de prueba',
      content: 'Respuesta de prueba',
      value: 'pregunta-prueba'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
