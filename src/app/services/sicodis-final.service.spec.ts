import { TestBed } from '@angular/core/testing';

import { SicodisFinalService } from './sicodis-final.service';

describe('SicodisFinalService', () => {
  let service: SicodisFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SicodisFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
