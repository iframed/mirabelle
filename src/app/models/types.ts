export interface Enfant {
    id: number;
    nom: string;
    prenom: string;
  
    parentId?: number;
    factures?: Facture[];
  }
  
  export interface Facture {
    id?: number;
    moisConcerne: string;
    montantTotal?: number;
    payee?: boolean;
  
    parentId?: number;
    enfantId?: number;
  }
  

  export enum DocumentType {
    PHOTO_IDENTITE = 'PHOTO_IDENTITE',
    FICHE_MEDICALE = 'FICHE_MEDICALE',
    CERTIFICAT_SCOLAIRE = 'CERTIFICAT_SCOLAIRE',
    AUTRE = 'AUTRE'
  }
  