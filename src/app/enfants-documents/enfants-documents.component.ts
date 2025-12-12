import { Component, OnInit } from '@angular/core';
import { EnfantService } from '../services/enfant.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  Enfant } from '../models/types';

import { DocumentDTO, DocumentType } from '../models/document.model';

@Component({
  selector: 'app-enfants-documents',
  standalone: true,
  templateUrl: './enfants-documents.component.html',
  styleUrls: ['./enfants-documents.component.css'],
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class EnfantsDocumentsComponent implements OnInit {

  /** Liste de tous les enfants */
  enfants: Enfant[] = [];

  /** Enfant actuellement sélectionné */
  selectedEnfant: Enfant | null = null;

  /** Nom formaté de l'enfant (évite répéter) */
  selectedEnfantName = '';

  /** Documents du parent */
  selectedEnfantDocuments: DocumentDTO[] = [];

  /** Fichiers sélectionnés */
  selectedFiles: File[] = [];

  /** Type de document choisi */
  selectedType: DocumentType = DocumentType.PHOTO_IDENTITE;
documentTypes = Object.values(DocumentType);

  
  

  /** Liste des types utilisables dans le select */
 

  constructor(
    private enfantService: EnfantService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.loadSingleEnfant(id);
    } else {
      this.loadEnfants();
    }
  }

  /** Charge un seul enfant depuis l’URL */
  private loadSingleEnfant(id: number) {
    this.enfantService.getEnfantById(id).subscribe({
      next: enfant => {
        this.selectedEnfant = enfant;
        this.selectedEnfantName = `${enfant.nom} ${enfant.prenom}`;
        this.loadDocuments(enfant);
      },
      error: () => console.error('Impossible de charger cet enfant.')
    });
  }

  /** Charge la liste de tous les enfants */
  loadEnfants() {
    this.enfantService.getEnfants().subscribe({
      next: data => this.enfants = data,
      error: () => console.error('Erreur lors du chargement des enfants')
    });
  }

  /** Lors de la sélection de fichiers */
  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  /** Sélectionne un enfant & charge ses documents */
  loadDocuments(enfant: Enfant) {
    this.selectedEnfant = enfant;
    this.selectedEnfantName = `${enfant.nom} ${enfant.prenom}`;

    this.enfantService.getDocumentsByEnfant(enfant.id).subscribe({
      next: docs => this.selectedEnfantDocuments = docs,
      error: () => console.error('Erreur récupération documents')
    });
  }

  /** Upload des documents */
  uploadDocuments() {
    if (!this.selectedEnfant) {
      alert('Sélectionnez un enfant !');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Sélectionnez au moins un fichier !');
      return;
    }

    this.enfantService.uploadDocuments(
      this.selectedEnfant.id,
      this.selectedFiles,
      this.selectedType
    )
    .subscribe({
      next: () => {
        console.log('Documents uploadés.');
        this.loadDocuments(this.selectedEnfant!);
        this.selectedFiles = []; // reset
      },
      error: err => console.error('Erreur upload', err)
    });
  }
}
