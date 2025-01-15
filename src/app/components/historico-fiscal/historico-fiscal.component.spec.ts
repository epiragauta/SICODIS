import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoFiscalComponent } from './historico-fiscal.component';

describe('HistoricoFiscalComponent', () => {
  let component: HistoricoFiscalComponent;
  let fixture: ComponentFixture<HistoricoFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoFiscalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
