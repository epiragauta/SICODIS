import { TestBed } from '@angular/core/testing';

import { SicodisApiFixedService } from './sicodis-api-fixed.service';

describe('SicodisApiFixedService', () => {
  let service: SicodisApiFixedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicodisApiFixedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
