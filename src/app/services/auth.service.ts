import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/auth'; // Base URL de votre API

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    // Construction des paramètres de requête
    const params = new HttpParams()
      .set('email', credentials.email)
      .set('password', credentials.password);

    // Envoi de la requête GET avec les paramètres
    return this.http.post(`${this.baseUrl}/login`, {}, { params });
  }
}
