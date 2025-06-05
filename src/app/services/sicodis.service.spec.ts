import { TestBed } from '@angular/core/testing';

import { SicodisService } from './sicodis.service';

describe('SicodisService', () => {
  let service: SicodisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicodisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
