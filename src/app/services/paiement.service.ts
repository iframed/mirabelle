import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaiementService {

  private baseUrl = 'http://localhost:8080/api/paiement';

  constructor(private http: HttpClient) {}

  creerFactureCash(dto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cash`, dto);
  }
}
