import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  baseUrl: string = environment.identityProviderUrl;

  constructor(private http: HttpClient, private router: Router) {}

  parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  public get token(): string | null {
    return localStorage.getItem('hotels-booking-system_auth_token');
  }

  public get user(): any {
    const token = this.token;
    if (token) {
      const user = this.parseJwt(token);
      return user;
    }
    return null;
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/oauth/token`, {
        client_id: 'iswgrQFox3rTEcGIDlSQewT5iWx0ODer',
        client_secret:
          '7GmlF0ZSD8CxnoXCRqv3bQ-H3KiZgki7tepf1kp98AY0sKFyCW8akGAf6GSrVavw',
        username,
        password,
        audience: 'http://127.0.0.1:8080/login',
        grant_type: 'password',
        scope: 'openid',
      })
      .pipe(
        tap((res) => {
          console.log(res);
          if (res.token) {
            localStorage.setItem('hotels-booking-system_auth_token', res.token);
            this.router.navigate(['hotels']);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('hotels-booking-system_auth_token');
    this.router.navigate(['auth']);
  }
}
