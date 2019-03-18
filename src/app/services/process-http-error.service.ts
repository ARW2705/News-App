import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessHttpErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      const errStatus = (error.status) ? error.status: 503;
      const errStatusText = (error.status) ? error.statusText: 'Service Unavailable';
      errMsg = `${errStatus} - ${errStatusText || ''}`;
    } else {
      errMsg = error.message ? error.message: error.toString();
    }
    return throwError(errMsg);
  }
}
