import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorage } from '@ngx-pwa/local-storage';

import { baseURL } from '../shared/baseurl';
import { apiVersion } from '../shared/api-version';
import { User } from '../shared/user';

import { ProcessHttpErrorService } from './process-http-error.service';

interface AuthResponse {
  status: string,
  success: string,
  token: string
};

interface JWTResponse {
  status: string,
  success: string,
  user: any
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private loggedIn: boolean = false;
  private alertsActive: boolean = false;
  private tokenKey: string = 'JWT';
  private username: Subject<string> = new Subject<string>();
  private publicUsername: string = '';
  private authToken: string = undefined;
  @Output() refreshLogin: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient,
    private processHttpError: ProcessHttpErrorService,
    protected localStorage: LocalStorage) { }

  isLoggedIn() {
    return this.loggedIn;
  }

  refreshOnLoginLogout() {
    this.refreshLogin.emit(this.loggedIn);
  }

  areAlertsActive() {
    return this.alertsActive;
  }

  setAlertsActive(on: boolean) {
    this.alertsActive = on;
  }

  signup(user: User): Observable<any> {
    return this.http.post(baseURL + apiVersion + 'users/signup', user)
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  login(user: User): Observable<any> {
    return this.http.post<AuthResponse>(baseURL + apiVersion + 'users/login', user)
      .pipe(map(res => {
        const credentials = {
          username: user.username,
          token: res.token
        };
        if (user.remember) this.storeUserCredentials(credentials);
        else this.useCredentials(credentials);
        return {'success': true, 'username': user.username};
      }))
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  logout() {
    this.destroyUserCredentials();
  }

  checkJWTtoken() {
    this.http.get<JWTResponse>(baseURL + apiVersion + 'users/checkJWTtoken')
      .subscribe(
        res => {
          this.sendUsername(res.user.username);
        },
        () => {
          this.destroyUserCredentials();
      });
  }

  sendUsername(name: string) {
    this.username.next(name);
  }

  clearUsername() {
    this.username.next(undefined);
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getPublicUsername(): string {
    return this.publicUsername;
  }

  getToken(): string {
    return this.authToken;
  }

  loadUserCredentials() {
    this.localStorage.getItem(this.tokenKey)
      .subscribe(key => {
        if (key) {
          const credentials = JSON.parse(key);
          if (credentials && credentials.username != undefined) {
            this.useCredentials(credentials);
            if (this.authToken) this.checkJWTtoken();
          }
        } else {
          console.log('Token key not defined');
        }
      });
  }

  storeUserCredentials(credentials: any) {
    this.localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  useCredentials(credentials: any) {
    this.loggedIn = true;
    this.publicUsername = credentials.username;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

  destroyUserCredentials() {
    this.authToken = undefined;
    this.clearUsername();
    this.loggedIn = false;
    this.localStorage.removeItem(this.tokenKey)
      .subscribe(() => {
        this.refreshOnLoginLogout();
      });
  }

  resetPassword(): Observable<any> {
    return this.http.post(baseURL + apiVersion + 'users/reset-password', {})
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  getUserProfile(): Observable<any> {
    return this.http.get(baseURL + apiVersion + 'users/profile')
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  updateUserProfile(user: User): Observable<any> {
    return this.http.patch(baseURL + apiVersion + 'users/profile', user)
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }
}
