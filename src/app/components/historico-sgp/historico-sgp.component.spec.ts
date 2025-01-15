import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoSgpComponent } from './historico-sgp.component';

describe('HistoricoSgpComponent', () => {
  let component: HistoricoSgpComponent;
  let fixture: ComponentFixture<HistoricoSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoricoSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
