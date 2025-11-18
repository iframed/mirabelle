import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {



  activeTab = 'messages';

  enfants: any[] = [];
personnels: any[] = [];
paiements: any[] = [];

  messages: any[] = [];
  inscriptions: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.chargerMessages();
    this.chargerInscriptions();
  }

  // 🔹 Changer d’onglet
  selectTab(tab: string) {
    this.activeTab = tab;
  }

  // 🔹 Charger les messages depuis le backend
  chargerMessages() {
    this.http.get<any[]>('http://localhost:8080/api/contact').subscribe({
      next: (data) => (this.messages = data),
      error: (err) => console.error('Erreur chargement messages :', err)
    });
  }

  // 🔹 Charger les préinscriptions depuis le backend
  chargerInscriptions() {
    this.http.get<any[]>('http://localhost:8080/api/inscriptions').subscribe({
      next: (data) => (this.inscriptions = data),
      error: (err) => console.error('Erreur chargement inscriptions :', err)
    });
  }
}
