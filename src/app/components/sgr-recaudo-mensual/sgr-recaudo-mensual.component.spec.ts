import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgrRecaudoMensualComponent } from './sgr-recaudo-mensual.component';

describe('SgrRecaudoMensualComponent', () => {
  let component: SgrRecaudoMensualComponent;
  let fixture: ComponentFixture<SgrRecaudoMensualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgrRecaudoMensualComponent]
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
