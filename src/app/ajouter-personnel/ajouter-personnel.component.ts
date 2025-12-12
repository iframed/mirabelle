import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajouter-personnel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ajouter-personnel.component.html',
  styleUrls: ['./ajouter-personnel.component.css']
})
export class AjouterPersonnelComponent {

  sections: any[] = [];

  formPersonnel = {
    nom: '',
    prenom: '',
    poste: '',
    dateEmbauche: '',
    salaire: null as number | null,
    sectionsIds: [] as number[]
  };

  constructor(private http: HttpClient, private router: Router) {
    this.chargerSections();
  }

  // 🔹 Charger les sections depuis l'API
  chargerSections() {
    this.http.get<any[]>('http://localhost:8080/api/sections/all').subscribe({
      next: (data) => this.sections = data,
      error: (err) => console.error("Erreur chargement sections :", err)
    });
  }

  // 🔹 Soumission du formulaire
  ajouterPersonnel() {
    if (!this.formPersonnel.nom || !this.formPersonnel.prenom || !this.formPersonnel.poste) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.http.post('http://localhost:8080/api/personnel/add', this.formPersonnel)
      .subscribe({
        next: () => {
          alert("Personnel ajouté avec succès !");
          this.router.navigate(['/admin']); // retour au dashboard admin
        },
        error: (err) => {
          console.error("Erreur ajout personnel :", err);
          alert("Impossible d'ajouter le personnel.");
        }
      });
  }

  // 🔹 Retour en arrière
  retour() {
    this.router.navigate(['/admin']);
  }
}
