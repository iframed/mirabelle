// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

interface Facture {
  id?: number;
  moisConcerne: string;
  montantTotal?: number;
  payee?: boolean;
  parentId?: number;
  enfantId?: number;
}
interface Enfant {
  id: number;
  nom: string;
  prenom: string;
  parentId?: number;
  factures?: Facture[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NgChartsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // ---------- Global UI state ----------
  activeTab = 'messages';

  // ---------- Data lists ----------
  enfants: any[] = [];
  enfantsFiltres: any[] = [];
  personnels: any[] = [];
  paiements: any[] = [];

  messages: any[] = [];
  inscriptionsFiltreSection: number | null = null;
  inscriptionsFiltreNom: string = '';
  
  // Inscriptions + filtres
  inscriptions: any[] = [];

  inscriptionsFiltres: any[] = [];
  // filtrage contrôles
  filtreSectionInscription: number | null = null;
  filtreNomInscription: string = '';

  sections: any[] = [];


  // ---------- Form / local state ----------
  nouveauPersonnel = {
    nom: '',
    prenom: '',
    poste: '',
    dateEmbauche: '',
    salaire: null,
    sectionsIds: [] as number[]
  };

  nouvelleFacture = {
    enfantId: null as number | null,
    parentId: null as number | null,
    moisConcerne: '',
    montantTotal: null as number | null,
    payee: false
  };

  // Nombre de messages non lus
get countMessagesNonLus(): number {
  return this.messages.filter(m => !m.lu).length;
}

// Nombre de préinscriptions non validées
get countInscriptionsNonValidees(): number {
  return this.inscriptions.filter(i => !i.valide).length;
}

// Nombre d'enfants qui n'ont pas payé ce mois
get countEnfantsNonPayes(): number {
  return this.enfants.filter(e => !this.isPaidThisMonth(e)).length;
}


  // For payments UI
  paiementsFiltreSection: string | number = "";
  paiementsFiltreNom: string = "";
  enfantsFiltresPaiements: any[] = [];

  // Charts
  paiementsLabels: string[] = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  paiementsChart: ChartData<'bar'> = {
    labels: this.paiementsLabels,
    datasets: [
      { 
        data: Array(12).fill(0), 
        label: 'Paiements reçus', 
        backgroundColor: 'rgba(54, 162, 235, 0.7)' // bleu
      },
      { 
        data: Array(12).fill(0), 
        label: 'Dépenses (Salaires)', 
        backgroundColor: 'rgba(255, 99, 132, 0.7)' // rouge
      }
    ]
  };
  
  paiementsOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Paiements mensuels' }
    }
  };

  // Filters used for children list (existing)
  filtreSection: string | number = "";
  filtreNom: string = "";

  // search inputs used in code
  selectedSectionId: number | null = null;
  searchTerm: string = "";

  currentMonth: string = new Date().toLocaleString('fr-FR', { month: 'long' });

  // Modal state
  modalMessage: any = null;
  modalInscription: any = null;

  // constructor
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadSections();
    this.chargerMessages();
    this.chargerInscriptions();
    this.chargerPersonnel();
    this.chargerEnfants();
    this.chargerPaiementsMensuels();
    this.chargerUtilisateurs();
  }

  // -------------------- Sections --------------------
  loadSections() {
    this.http.get<any[]>('http://localhost:8080/api/sections/all').subscribe({
      next: data => { this.sections = data || []; },
      error: err => console.error('Erreur chargement sections :', err)
    });
  }

  // -------------------- Messages --------------------
  chargerMessages() {
    this.http.get<any[]>('http://localhost:8080/api/contact').subscribe({
      next: (data) => {
        this.messages = (data || []).map(msg => ({ ...msg, lu: msg.lu ?? false }));
        console.log('Messages reçus :', this.messages);
      },
      error: (err) => console.error('Erreur chargement messages :', err)
    });
  }

  ouvrirMessage(msg: any) {
    this.modalMessage = msg;
    if (!msg.lu) {
      msg.lu = true;
      this.http.put(`http://localhost:8080/api/contact/${msg.id}/lu`, {}).subscribe({
        next: () => console.log('Message marqué comme lu'),
        error: err => console.error('Erreur marquer lu', err)
      });
    }
  }
  fermerModal() {
    this.modalMessage = null;
  }
  supprimerMessage(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer ce message ?')) return;
    this.http.delete(`http://localhost:8080/api/contact/${id}`).subscribe({
      next: () => this.messages = this.messages.filter(m => m.id !== id),
      error: err => console.error('Erreur suppression message :', err)
    });
  }

  // -------------------- Inscriptions --------------------
  chargerInscriptions() {
    this.http.get<any[]>('http://localhost:8080/api/inscriptions').subscribe({
      next: (data) => {
        // map and preserve important fields (sectionId exists in DTO)
        this.inscriptions = (data || []).map(ins => ({
          id: ins.id,
          enfantId: ins.enfantId ?? null,
          sectionId: ins.sectionId ?? null,
          nomEnfant: ins.nomEnfant ?? '',
          prenomEnfant: ins.prenomEnfant ?? '',
          nomPrenomParent: ins.nomPrenomParent ?? '',
          telephoneParent: ins.telephoneParent ?? '',
          periodeInscription: ins.periodeInscription ?? '',
          lienFamilial: ins.lienFamilial ?? null,
          dateInscription: ins.dateInscription ?? null,
          valide: ins.valide ?? false
        }));
        // initialize filtered list
        this.inscriptionsFiltres = [...this.inscriptions];
        console.log('Inscriptions chargées :', this.inscriptions);
      },
      error: (err) => console.error('Erreur chargement inscriptions :', err)
    });
  }

  // Open inscription modal + validate on backend if not already valid
  ouvrirInscription(inscription: any) {
    this.modalInscription = inscription;
    if (!inscription.valide) {
      this.http.put(`http://localhost:8080/api/inscriptions/${inscription.id}/valider`, {}).subscribe({
        next: () => {
          inscription.valide = true;
          // Also update filtered list copy (if needed)
          const idx = this.inscriptions.findIndex(i => i.id === inscription.id);
          if (idx >= 0) this.inscriptions[idx].valide = true;
          const idx2 = this.inscriptionsFiltres.findIndex(i => i.id === inscription.id);
          if (idx2 >= 0) this.inscriptionsFiltres[idx2].valide = true;
          console.log('Préinscription validée');
        },
        error: (err) => console.error('Erreur validation préinscription :', err)
      });
    }
  }
  fermerModalInscription() {
    this.modalInscription = null;
  }

  supprimerInscription(id: number) {
    if (!confirm('Voulez-vous vraiment supprimer cette préinscription ?')) return;
    this.http.delete(`http://localhost:8080/api/inscriptions/${id}`).subscribe({
      next: () => {
        this.inscriptions = this.inscriptions.filter(ins => ins.id !== id);
        this.inscriptionsFiltres = this.inscriptionsFiltres.filter(ins => ins.id !== id);
        console.log('Préinscription supprimée');
      },
      error: err => console.error('Erreur suppression préinscription :', err)
    });
  }

  // Apply filters for inscriptions (section + name search)
  supprimerEnfant(id: number) {
    if (!confirm("Supprimer cet enfant ?")) return;
  
    this.http.delete(`http://localhost:8080/api/enfants/${id}`).subscribe({
      next: () => {
        this.enfants = this.enfants.filter(e => e.id !== id);
        this.enfantsFiltres = this.enfantsFiltres.filter(e => e.id !== id);
      },
      error: err => console.error("Erreur suppression enfant :", err)
    });
  }
  isPaidThisMonth(enfant: any): boolean {

    if (!enfant.factures) return false;
  
    const moisActuel = new Date().toLocaleString('fr-FR', { month: 'long' }).toLowerCase();
  
    return enfant.factures.some((f: any) =>
      f.moisConcerne?.toLowerCase() === moisActuel &&
      f.payee === true
    );
    
  }
    

  // Optional: reset inscription filters
  resetFiltresInscriptions() {
    this.filtreSectionInscription = null;
    this.filtreNomInscription = '';
    this.inscriptionsFiltres = [...this.inscriptions];
  }

  // -------------------- Personnel --------------------
  chargerPersonnel() {
    this.http.get<any[]>('http://localhost:8080/api/personnel/all').subscribe({
      next: data => this.personnels = data || [],
      error: err => console.error('Erreur chargement personnel :', err)
    });
  }
  ajouterPersonnel() {
    this.http.post('http://localhost:8080/api/personnel/add', this.nouveauPersonnel).subscribe({
      next: () => {
        alert('Personnel ajouté avec succès !');
        this.chargerPersonnel();
        this.nouveauPersonnel = { nom: '', prenom: '', poste: '', dateEmbauche: '', salaire: null, sectionsIds: [] };
      },
      error: err => console.error('Erreur ajout personnel :', err)
    });
  }
  supprimerPersonnel(id: number) {
    if (!confirm('Supprimer ce membre du personnel ?')) return;
    this.http.delete(`http://localhost:8080/api/personnel/${id}`).subscribe({
      next: () => this.personnels = this.personnels.filter(p => p.id !== id),
      error: err => console.error('Erreur suppression personnel :', err)
    });
  }

  // -------------------- Enfants --------------------
  chargerEnfants() {
    this.http.get<any[]>('http://localhost:8080/api/enfants/all').subscribe({
      next: (data) => {
        this.enfants = data || [];
        // init enfantsFiltres to show all by default
        this.enfantsFiltres = [...this.enfants];
        console.log('Enfants chargés :', this.enfants);
      },
      error: (err) => console.error('Erreur chargement enfants :', err)
    });
  }

  appliquerFiltres() {
    const sectionId = Number(this.filtreSection) || null;
    const search = (this.filtreNom || '').trim().toLowerCase();

    this.enfantsFiltres = this.enfants.filter(e => {
      const matchSection = !sectionId || e.sectionId === sectionId;
      const nomComplet = `${e.nom || ''} ${e.prenom || ''}`.toLowerCase();
      const matchNom = !search || nomComplet.includes(search);
      return matchSection && matchNom;
    });
  }

  // -------------------- Paiements --------------------
  chargerPaiementsMensuels() {
    this.http.get<any[]>('http://localhost:8080/api/paiement/mensuel').subscribe({
      next: (data) => {
        const arr = data || [];
  
        // Paiements reçus
        this.paiementsChart.datasets[0].data = this.paiementsLabels.map(moisLabel => {
          const entry = arr.find(d => d.mois && d.mois.toLowerCase() === moisLabel.toLowerCase());
          return entry ? entry.total : 0;
        });
  
        // Dépenses : nombre de personnels × 2000 Dhs
        this.paiementsChart.datasets[1].data = this.paiementsLabels.map(_ => {
          return this.personnels.length * 2000;
        });
  
        // Force refresh
        this.paiementsChart.datasets = [...this.paiementsChart.datasets];
      },
      error: (err) => console.error('Erreur chargement paiements mensuels :', err)
    });
  }
  

  appliquerFiltresPaiements() {
    const sectionId = Number(this.paiementsFiltreSection) || null;
    const search = (this.paiementsFiltreNom || '').trim().toLowerCase();

    this.enfantsFiltresPaiements = this.enfants.filter(e => {
      const matchSection = !sectionId || e.sectionId === sectionId;
      const nomComplet = `${e.nom || ''} ${e.prenom || ''}`.toLowerCase();
      const matchNom = !search || nomComplet.includes(search);
      return matchSection && matchNom;
    });
  }

  ajouterPaiement(id: number) {
    this.router.navigate(['/ajouter-paiement', id]);
  }
  voirFacturesEnfant(enfantId: number) {
    this.router.navigate(['/factures', enfantId]);
  }

  // -------------------- Facture creation --------------------
  onSelectEnfant(event: Event) {
    const select = event.target as HTMLSelectElement;
    const enfantId = Number(select.value);
    const enfant = this.enfants.find(e => e.id === enfantId);
    if (enfant?.parentsIds?.length) {
      this.nouvelleFacture.enfantId = enfant.id;
      this.nouvelleFacture.parentId = enfant.parentsIds[0];
    } else {
      this.nouvelleFacture.enfantId = enfantId;
      this.nouvelleFacture.parentId = null;
    }
  }

  creerFacture() {
    if (!this.nouvelleFacture.enfantId || !this.nouvelleFacture.parentId) {
      alert('Veuillez sélectionner un enfant et un parent !');
      return;
    }
    this.http.post('http://localhost:8080/api/paiement/cash', this.nouvelleFacture).subscribe({
      next: (facture: any) => {
        alert('Facture créée avec succès !');
        this.chargerPaiementsMensuels();
        this.paiements.push(facture);
        this.resetFormFacture();
      },
      error: err => {
        console.error('Erreur création facture :', err);
        alert('Impossible de créer la facture.');
      }
    });
  }
  resetFormFacture() {
    this.nouvelleFacture = { enfantId: null, parentId: null, moisConcerne: '', montantTotal: null, payee: false };
  }

  // -------------------- Nav / helpers --------------------
  selectTab(tab: string) { this.activeTab = tab; }
  allerAuFormulairePersonnel() { this.router.navigate(['/ajouter-personnel']); }
  voirDocumentsEnfant(enfantId: number) { this.router.navigate(['/enfants', enfantId, 'documents']); }


  appliquerFiltresInscriptions() {
    const sectionId = this.inscriptionsFiltreSection;
    const search = this.inscriptionsFiltreNom.trim().toLowerCase();
  
    this.inscriptionsFiltres = this.inscriptions.filter(ins => {
  
      const matchSection =
        !sectionId || ins.sectionId === sectionId;
  
      const nomComplet = `${ins.nomEnfant} ${ins.prenomEnfant}`.toLowerCase();
      const matchNom =
        !search || nomComplet.includes(search);
  
      return matchSection && matchNom;
    });
  }







  // ---------- Utilisateurs ----------
utilisateurs: any[] = [];
modalUser = false;

nouvelUtilisateur = {
  nom: '',
  prenom: '',
  email: '',
  motDePasse: '',
  role: 'RESPONSABLE'
};

// Charger tous les utilisateurs
chargerUtilisateurs() {
  this.http.get<any[]>('http://localhost:8080/auth/users').subscribe({
    next: data => this.utilisateurs = data || [],
    error: err => console.error('Erreur chargement utilisateurs :', err)
  });
}

// Ouvrir modal
ouvrirFormulaireUser() {
  this.modalUser = true;
  this.nouvelUtilisateur = { nom: '', prenom: '', email: '', motDePasse: '', role: 'RESPONSABLE' };
}

// Fermer modal
fermerModalUser() {
  this.modalUser = false;
}

// Ajouter un utilisateur
ajouterUtilisateur() {
  this.http.post('http://localhost:8080/auth/register', this.nouvelUtilisateur).subscribe({
    next: () => {
      alert('Utilisateur créé !');
      this.chargerUtilisateurs();
      this.fermerModalUser();
    },
    error: err => {
      console.error('Erreur création utilisateur :', err);
      alert('Impossible de créer l’utilisateur');
    }
  });
}

// Supprimer utilisateur (optionnel)
supprimerUtilisateur(id: number) {
  if (!confirm('Supprimer cet utilisateur ?')) return;
  this.http.delete(`http://localhost:8080/auth/users/${id}`).subscribe({
    next: () => this.utilisateurs = this.utilisateurs.filter(u => u.id !== id),
    error: err => console.error('Erreur suppression utilisateur :', err)
  });
}

// Appelle la fonction de chargement dans ngOnInit

allerAuFormulaireUser() {
  this.router.navigate(['/add-user']); // Redirige vers le composant AddUserComponent
}
  
}
