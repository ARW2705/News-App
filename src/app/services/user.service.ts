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
  loggedIn: boolean = false;
  alertsActive: boolean = false;
  tokenKey: string = 'JWT';
  username: Subject<string> = new Subject<string>();
  publicUsername: string = '';
  authToken: string = undefined;
  @Output() refreshLogin: EventEmitter<boolean> = new EventEmitter();

  constructor(public http: HttpClient,
    public processHttpError: ProcessHttpErrorService,
    public localStorage: LocalStorage) { }

  areAlertsActive(): boolean {
    return this.alertsActive;
  }

  // Set username Subject to undefined
  clearUsername(): void {
    this.username.next(undefined);
  }

  // Check server for JWT validity
  checkJWTtoken(): void {
    this.http.get<JWTResponse>(baseURL + apiVersion + 'users/checkJWTtoken')
      .subscribe(
        res => {
          this.sendUsername(res.user.username);
        },
        () => {
          this.destroyUserCredentials();
      });
  }

  destroyUserCredentials(): void {
    this.authToken = undefined;
    this.clearUsername();
    this.loggedIn = false;
    this.localStorage.removeItem(this.tokenKey)
      .subscribe(() => {
        this.refreshOnLoginLogout();
      });
  }

  getPublicUsername(): string {
    return this.publicUsername;
  }

  // Get JWT
  getToken(): string {
    return this.authToken;
  }

  // getUsername(): Observable<string> {
  //   return this.username.asObservable();
  // }

  /**
   * Get user profile from server
   *
   * @return: Observable of user profile
  **/
  getUserProfile(): Observable<any> {
    return this.http.get(baseURL + apiVersion + 'users/profile')
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Get username and token from storage
  loadUserCredentials(): void {
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

  logout(): void {
    this.destroyUserCredentials();
  }

  // Emit event when login status changes
  refreshOnLoginLogout(): void {
    this.refreshLogin.emit(this.loggedIn);
  }

  /**
   * Start password reset process
   *
   * @return: Observable with message for user about reset process
  **/
  resetPassword(): Observable<any> {
    return this.http.post(baseURL + apiVersion + 'users/reset-password', {})
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  /**
   * Toggle alerts activation
   *
   * @params: on - true if alerts should be active
  **/
  setAlertsActive(on: boolean): void {
    this.alertsActive = on;
  }

  /**
   * Apply name to username Subject
   *
   * @params: name - name to apply to Subject
  **/
  sendUsername(name: string): void {
    this.username.next(name);
  }

  /**
   * Submit user signup
   *
   * @params: user - new user to create an account
   *
   * @return: Observable of newly created user
  **/
  signup(user: User): Observable<any> {
    return this.http.post(baseURL + apiVersion + 'users/signup', user)
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  /**
   * Store user credentials in idb
   *
   * @params: credentials - username and JWT
  **/
  storeUserCredentials(credentials: any): void {
    this.localStorage.setItem(this.tokenKey, JSON.stringify(credentials));
    this.useCredentials(credentials);
  }

  /**
   * Patch user profile
   *
   * @params: user - user object with updates
   *
   * @return: Observable of updated user
  **/
  updateUserProfile(user: User): Observable<any> {
    return this.http.patch(baseURL + apiVersion + 'users/profile', user)
      .pipe(catchError(err => this.processHttpError.handleError(err)));
  }

  /**
   * Apply user credentials
   *
   * @params: credentials - username and JWT
  **/
  useCredentials(credentials: any): void {
    this.loggedIn = true;
    this.publicUsername = credentials.username;
    this.sendUsername(credentials.username);
    this.authToken = credentials.token;
  }

}
