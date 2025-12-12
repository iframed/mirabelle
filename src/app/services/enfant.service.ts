import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { DocumentDTO, DocumentType } from '../models/document.model';
import { Enfant } from '../models/types';


@Injectable({
  providedIn: 'root'
})
export class EnfantService {



    private baseUrl = 'http://localhost:8080/api/enfants';

    constructor(private http: HttpClient) {}
  
    getEnfants(): Observable<Enfant[]> {
      return this.http.get<Enfant[]>(`${this.baseUrl}/all`).pipe(
        tap(enfants => {
          console.log('Enfants reçus du backend :', enfants);
        })
      );
    }


    getEnfantById(id: number): Observable<any> {
      return this.http.get(`${this.baseUrl}/${id}`);
    }
  
    getDocumentsByEnfant(id: number): Observable<DocumentDTO[]> {
      return this.http.get<DocumentDTO[]>(`${this.baseUrl}/${id}/documents`);
    }
    uploadDocuments(enfantId: number, files: File[], type: 'PHOTO_IDENTITE' | 'FICHE_MEDICALE' | 'CERTIFICAT_SCOLAIRE' | 'AUTRE') {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file, file.name));
      formData.append('type', type); // <- valeur correspond à l'enum côté backend
    
      return this.http.post(`${this.baseUrl}/${enfantId}/documents`, formData);
    }
    
    
  }
