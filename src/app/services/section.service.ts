import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // Angular injecte le service partout
})
export class SectionService {
  private apiUrl = 'http://localhost:8080/api/sections'; // URL de ton API

  constructor(private http: HttpClient) {}

  getAllSections(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
