import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaiementService } from '../services/paiement.service';
import { EnfantService } from '../services/enfant.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ajouter-paiement',
  standalone: true,
  templateUrl: './ajouter-paiement.component.html',
  imports: [CommonModule, HttpClientModule,FormsModule ],
  styleUrls: ['./ajouter-paiement.component.css']
})
export class AjouterPaiementComponent implements OnInit {

  enfant: any = null;

  nouvelleFacture = {
    enfantId: null,
    parentId: null,
    moisConcerne: '',
    montantTotal: null,
    payee: false
  };

  constructor(
    private route: ActivatedRoute,
    private paiementService: PaiementService,
    private enfantService: EnfantService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const enfantId = Number(this.route.snapshot.paramMap.get('id'));
    console.log("📌 ID enfant récupéré depuis l'URL =", enfantId);

    this.enfantService.getEnfantById(enfantId).subscribe((enf: any) => {

      console.log("📥 Données enfant reçues du backend :", enf);

      this.enfant = enf;

      // Extraction des IDs
      this.nouvelleFacture.enfantId = enf.id;
this.nouvelleFacture.parentId = enf.parentId;

console.log("📌 enfantId extrait =", this.nouvelleFacture.enfantId);
console.log("📌 parentId extrait =", this.nouvelleFacture.parentId);


      console.log("📦 Facture après remplissage automatique :", this.nouvelleFacture);
    });
  }

  creerFacture() {

    console.log("🚀 Données envoyées au backend (POST /cash) :", this.nouvelleFacture);

    this.paiementService.creerFactureCash(this.nouvelleFacture).subscribe({
      next: (res) => {
        console.log("✅ Réponse backend :", res);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.error("❌ Erreur backend :", err);
      }
    });
  }
}
