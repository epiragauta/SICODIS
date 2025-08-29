import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PgnVariablesComponent } from './pgn-variables.component';

describe('PgnVariablesComponent', () => {
  let component: PgnVariablesComponent;
  let fixture: ComponentFixture<PgnVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PgnVariablesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PgnVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});