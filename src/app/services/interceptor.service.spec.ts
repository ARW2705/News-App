import { TestBed, inject } from '@angular/core/testing';

import { AuthInterceptorService, UnauthInterceptorService } from './interceptor.service';

describe('InterceptorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptorService, UnauthInterceptorService]
    });
  });

  it('should be created', inject([AuthInterceptorService, UnauthInterceptorService],
    (authService: AuthInterceptorService, unAuthService: UnauthInterceptorService) => {
      expect(authService).toBeTruthy();
      expect(unAuthService).toBeTruthy();
    })
  );
});
