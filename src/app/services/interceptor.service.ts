import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(public inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userService = this.inj.get(UserService);
    const authToken = userService.getToken();
    const authReq = req.clone({headers: req.headers.set('Authorization', `bearer ${authToken}`)});
    return next.handle(authReq);
  }
}

@Injectable()
export class UnauthInterceptorService implements HttpInterceptor {
  constructor(public inj: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userService = this.inj.get(UserService);
    const authToken = userService.getToken();

    return next
      .handle(req)
      .pipe(tap((event: HttpEvent<any>) => {
        // do nothing
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status == 401 && authToken) {
            console.log('Unauthorized', err);
            userService.checkJWTtoken();
          }
        }
      }));
  }
}
