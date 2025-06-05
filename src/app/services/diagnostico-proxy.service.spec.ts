import { TestBed } from '@angular/core/testing';

import { DiagnosticoProxyService } from './diagnostico-proxy.service';

describe('DiagnosticoProxyService', () => {
  let service: DiagnosticoProxyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiagnosticoProxyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
