import { TestBed } from '@angular/core/testing';

import { SicodisImprovedService } from './sicodis-improved.service';

describe('SicodisImprovedService', () => {
  let service: SicodisImprovedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicodisImprovedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
