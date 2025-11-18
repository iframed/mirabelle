import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  private apiUrl = 'http://localhost:8080/api/inscriptions'; // ✅ URL du backend

  constructor(private http: HttpClient) {}

  // Envoi des données d'inscription au backend
  inscrire(data: any): Observable<any> {
    console.log('🚀 POST envoyé vers backend :', this.apiUrl, data);
    return this.http.post(this.apiUrl, data);
  }
}
