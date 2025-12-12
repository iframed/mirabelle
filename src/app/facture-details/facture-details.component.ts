import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-facture-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule,FormsModule ],
  templateUrl: './facture-details.component.html',
  styleUrls: ['./facture-details.component.css'] 
})
export class FactureDetailsComponent implements OnInit {
  @ViewChild('invoiceContainer', { static: false }) invoiceContainer!: ElementRef;

  facture: any;
  enfant: any;
  parent: any = null;
  facturesMois: { [key: number]: any } = {};
  moisListe = [
    { num: 1, nom: 'Janvier' },
    { num: 2, nom: 'Février' },
    { num: 3, nom: 'Mars' },
    { num: 4, nom: 'Avril' },
    { num: 5, nom: 'Mai' },
    { num: 6, nom: 'Juin' },
    { num: 7, nom: 'Juillet' },
    { num: 8, nom: 'Août' },
    { num: 9, nom: 'Septembre' },
    { num: 10, nom: 'Octobre' },
    { num: 11, nom: 'Novembre' },
    { num: 12, nom: 'Décembre' },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras.state) {
      // Premier cas : navigation directe
      this.facture = nav.extras.state['facture'];
      this.enfant = nav.extras.state['enfant'];
    } else {
      // Deuxième cas : page rafraîchie, navigation enfant → history.state
      const state = history.state;
      this.facture = state['facture'];
      this.enfant = state['enfant'];
    }}






    downloadPDF() {
      if (!this.invoiceContainer) return;
    
      html2canvas(this.invoiceContainer.nativeElement, { scale: 2 }).then(canvas => {
        const fileWidth = 210; // largeur A4 en mm
        const fileHeight = (canvas.height * fileWidth) / canvas.width;
    
        const FILEURI = canvas.toDataURL('image/png');
        const PDF = new jsPDF('p', 'mm', 'a4');
        PDF.addImage(FILEURI, 'PNG', 0, 0, fileWidth, fileHeight);
        PDF.save(`Facture_${this.facture.id}.pdf`);
      });
    }
    
    
}
