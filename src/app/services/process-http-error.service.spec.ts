import { TestBed, inject } from '@angular/core/testing';

import { ProcessHttpErrorService } from './process-http-error.service';

describe('ProcessHttpErrorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcessHttpErrorService]
    });
  });

  it('should be created', inject([ProcessHttpErrorService], (service: ProcessHttpErrorService) => {
    expect(service).toBeTruthy();
  }));
});
