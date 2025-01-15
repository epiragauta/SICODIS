import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisorRecursosComponent } from './visor-recursos.component';

describe('VisorRecursosComponent', () => {
  let component: VisorRecursosComponent;
  let fixture: ComponentFixture<VisorRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisorRecursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisorRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
