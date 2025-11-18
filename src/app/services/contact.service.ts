import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface pour le DTO envoyé au backend
export interface ContactFormDTO {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

// Interface pour la réponse du backend
export interface MessageContact {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  lu: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) { }

  /**
   * Envoie un message de contact
   * @param data Les données du formulaire de contact
   * @param utilisateurId (Optionnel) ID de l'utilisateur connecté
   * @returns Observable avec le message créé
   */
  envoyerMessage(data: ContactFormDTO, utilisateurId?: number): Observable<MessageContact> {
    const url = utilisateurId 
      ? `${this.apiUrl}?utilisateurId=${utilisateurId}`
      : this.apiUrl;
    
    return this.http.post<MessageContact>(url, data);
  }

  /**
   * Récupère tous les messages de contact (pour l'admin)
   * @returns Observable avec la liste des messages
   */
  getTousMessages(): Observable<MessageContact[]> {
    return this.http.get<MessageContact[]>(this.apiUrl);
  }

  /**
   * Récupère un message spécifique par son ID
   * @param id L'identifiant du message
   * @returns Observable avec le message
   */
  getMessageParId(id: number): Observable<MessageContact> {
    return this.http.get<MessageContact>(`${this.apiUrl}/${id}`);
  }
}