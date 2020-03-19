import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, ReplaySubject, throwError, timer } from 'rxjs';
import {
  catchError,
  mergeMap,
  retryWhen,
  switchMap,
  tap,
  flatMap
} from 'rxjs/operators';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private principalCache$: ReplaySubject<User> = new ReplaySubject(1);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User | undefined> {
    const loginRequest = `username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
    return this.http.post('api/authentication', loginRequest, { headers }).pipe(
      retryWhen(this.retryOnceOnCsrfFailure()),
      switchMap(() => this.fetchUserInfo())
    );
  }

  retryOnceOnCsrfFailure = () => (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const attempt = i + 1;
        if (attempt > 1 || error.status !== 403) {
          return throwError(error);
        }
        return timer(1);
      })
    );
  };

  logout(): Observable<any> {
    return this.http.post('api/logout', {}).pipe(
      tap(() => {
        this.principalCache$.next(undefined);
      })
    );
  }

  get user$(): Observable<User> {
    return this.principalCache$.asObservable();
  }

  fetchUserInfoWhenAuthenticated(): Observable<User | undefined> {
    return this.http
      .get<string>('api/authenticate', {
        headers: { 'Content-Type': 'text/plain' },
        responseType: 'text' as 'json'
      })
      .pipe(
        flatMap(username =>
          username ? this.fetchUserInfo() : this.handleUnauthenticatedUser()
        ),
        catchError(() => this.handleUnauthenticatedUser())
      );
  }

  private handleUnauthenticatedUser(): Observable<undefined> {
    this.principalCache$.next(undefined);
    return of(undefined);
  }

  private fetchUserInfo(): Observable<User | undefined> {
    return this.http.get<User>('api/account').pipe(
      tap(user => this.principalCache$.next(user)),
      catchError(() => this.handleUnauthenticatedUser())
    );
  }
}
