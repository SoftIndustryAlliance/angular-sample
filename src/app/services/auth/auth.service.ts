import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = environment.url;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  login(email, password) {
    email = email.trim();
    const loginUrl = `${this.url}login`;
    return this.http.post(loginUrl, { email, password }, httpOptions);
  }

  refreshToken() {
    const refreshUrl = `${this.url}refresh`;
    const refresh_token = localStorage.getItem('refreshToken');
    return this.http.post(refreshUrl, { grant_type: 'refresh_token', refresh_token }, httpOptions);
  }

  signOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}

