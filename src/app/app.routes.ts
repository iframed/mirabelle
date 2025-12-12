import { Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AproposComponent } from './apropos/apropos.component';
import { PouponniereComponent } from './pouponniere/pouponniere.component';
import { CrComponent } from './cr/cr.component';
import { FacturesEnfantComponent } from './factures-enfant/factures-enfant.component';
import { FactureDetailsComponent } from './facture-details/facture-details.component';
import { EnfantsDocumentsComponent } from './enfants-documents/enfants-documents.component';
import { AddUserComponent } from './add-user/add-user.component';

export const routes: Routes = [



    { path: '', component: AcceuilComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'acceuil', component: AcceuilComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'apropos', component: AproposComponent},
    { path: 'cr', component: CrComponent},
    { path: 'factures/:id', component: FacturesEnfantComponent },
  // route pour voir une facture spécifique
  { path: 'facture-details', component: FactureDetailsComponent },
  { path: 'enfants/:id/documents', component: EnfantsDocumentsComponent },
  { path: '', redirectTo: 'paiements', pathMatch: 'full' },
  { path: 'add-user', component: AddUserComponent },
    { path: 'Pouponniere', component: PouponniereComponent},

    {
        path: 'ajouter-paiement/:id',
        loadComponent: () =>
          import('./ajouter-paiement/ajouter-paiement.component')
            .then(m => m.AjouterPaiementComponent)
      }
      ,
      { path: '', redirectTo: '/enfants-documents', pathMatch: 'full' },
  { path: 'enfants-documents', component: EnfantsDocumentsComponent },
  {
    path: 'ajouter-personnel',
    loadComponent: () =>
      import('./ajouter-personnel/ajouter-personnel.component')
        .then(c => c.AjouterPersonnelComponent)
  }
  

];
