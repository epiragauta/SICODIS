import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficosSgpComponent } from './graficos-sgp.component';

describe('GraficosSgpComponent', () => {
  let component: GraficosSgpComponent;
  let fixture: ComponentFixture<GraficosSgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficosSgpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficosSgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
