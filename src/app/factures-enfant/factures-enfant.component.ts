import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-factures-enfant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factures-enfant.component.html',
  styleUrls: ['./factures-enfant.component.css']
})
export class FacturesEnfantComponent implements OnInit {
  @ViewChild('invoice', { static: false }) invoiceElement?: ElementRef;

  enfantId!: number;
  enfant: any;
  facturesMois: { [key: number]: any } = {};

  moisListe = [
    { num: 9, nom: 'Septembre' },
    { num: 10, nom: 'Octobre' },
    { num: 11, nom: 'Novembre' },
    { num: 12, nom: 'Décembre' },
    { num: 1, nom: 'Janvier' },
    { num: 2, nom: 'Février' },
    { num: 3, nom: 'Mars' },
    { num: 4, nom: 'Avril' },
    { num: 5, nom: 'Mai' },
    { num: 6, nom: 'Juin' },
  ];
  

  // Calcul automatique de l'année scolaire
  anneeDebut!: number;
  anneeFin!: number;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.enfantId = Number(this.route.snapshot.paramMap.get('id'));
    this.calcAnneeScolaire();
    this.chargerEnfant();
    this.chargerFactures();
  }

  private calcAnneeScolaire() {
    const today = new Date();
    if (today.getMonth() + 1 < 9) {
      // Janvier à Août
      this.anneeDebut = today.getFullYear() - 1;
      this.anneeFin = today.getFullYear();
    } else {
      // Septembre à Décembre
      this.anneeDebut = today.getFullYear();
      this.anneeFin = today.getFullYear() + 1;
    }
  }

  chargerEnfant() {
    this.http.get<any>(`http://localhost:8080/api/enfants/${this.enfantId}`)
      .subscribe({
        next: data => this.enfant = data,
        error: err => console.error('Erreur chargement enfant', err)
      });
  }

  chargerFactures() {
    this.http.get<any[]>(`http://localhost:8080/api/paiement/enfants/${this.enfantId}/factures`)
      .subscribe({
        next: data => {
          const moisMap: { [key: string]: number } = {
            'janvier': 1, 'février': 2, 'fevrier': 2, 'mars': 3, 'avril': 4,
            'mai': 5, 'juin': 6, 'juillet': 7, 'août': 8, 'aout': 8,
            'septembre': 9, 'octobre': 10, 'novembre': 11, 'décembre': 12, 'decembre': 12
          };

          data.forEach(f => {
            if (!f.moisConcerne) return;
            const moisTxt = f.moisConcerne.trim().toLowerCase();
            const moisNum = moisMap[moisTxt];
            if (!moisNum) {
              console.warn("Mois inconnu :", f.moisConcerne);
              return;
            }
            this.facturesMois[moisNum] = f;
          });
        },
        error: err => console.error('Erreur chargement factures', err)
      });
  }

  voirFacture(facture: any) {
    this.router.navigate(['/facture-details'], { state: { facture, enfant: this.enfant } });
  }

  downloadPDF(moisNum: number) {
    const facture = this.facturesMois[moisNum];
    if (!facture) return;

    const DATA = document.getElementById(`facture-${moisNum}`);
    if (!DATA) return;

    html2canvas(DATA, { scale: 2 }).then(canvas => {
      const fileWidth = 210; // A4 width en mm
      const fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      const PDF = new jsPDF('p', 'mm', 'a4');
      PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight);
      PDF.save(`Facture_${facture.id}.pdf`);
    });
  }
}
