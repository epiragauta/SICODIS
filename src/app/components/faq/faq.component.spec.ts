import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FagComponent } from './faq.component';

describe('FagComponent', () => {
  let component: FagComponent;
  let fixture: ComponentFixture<FagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
