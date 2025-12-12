export interface DocumentDTO {
    id: number;
    nom: string;
    type: string;
    cheminFichier: string;
  }
  
  export enum DocumentType {
    PHOTO_IDENTITE = 'PHOTO_IDENTITE',
    FICHE_MEDICALE = 'FICHE_MEDICALE',
    CERTIFICAT_SCOLAIRE = 'CERTIFICAT_SCOLAIRE',
    AUTRE = 'AUTRE'
  }
  