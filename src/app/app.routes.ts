import { Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AproposComponent } from './apropos/apropos.component';
import { PouponniereComponent } from './pouponniere/pouponniere.component';
import { CrComponent } from './cr/cr.component';

export const routes: Routes = [



    { path: '', component: AcceuilComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'acceuil', component: AcceuilComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'apropos', component: AproposComponent},
    { path: 'cr', component: CrComponent},
    { path: 'Pouponniere', component: PouponniereComponent}
];
