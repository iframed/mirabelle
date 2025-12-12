import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InscriptionService } from '../services/inscription.service';
import { SectionService } from '../services/section.service';


@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css'] 
})
export class InscriptionComponent implements OnInit {
  globalForm: FormGroup;
  enfantForm: FormGroup;
  contactForm: FormGroup;
  sections: any[] = []; // ← tableau des sections

  constructor(
    private fb: FormBuilder, 
    private inscriptionService: InscriptionService,
    private sectionService: SectionService
  ) {
    this.enfantForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      dateNaissance: ['', Validators.required],
      periodeInscription: ['', Validators.required],
      sectionId: [null, Validators.required] // <-- nouveau champ
    });

    this.contactForm = this.fb.group({
      nomPrenom: ['', Validators.required],
      telephoneParent: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      emailParent: ['', [Validators.required, Validators.email]],
      lienFamilial: ['', Validators.required]
    });

    this.globalForm = this.fb.group({
      enfant: this.enfantForm,
      contact: this.contactForm
    });
  }

  ngOnInit(): void {
    this.loadSections();
  }

  loadSections(): void {
    this.sectionService.getAllSections().subscribe({
      next: (data) => this.sections = data,
      error: (err) => console.error('Erreur chargement sections :', err)
    });
  }

  onSubmit(): void {
    if (this.enfantForm.valid && this.contactForm.valid) {
      const data = {
        nomEnfant: this.enfantForm.value.nom,
        prenomEnfant: this.enfantForm.value.prenom,
        dateNaissance: this.enfantForm.value.dateNaissance,
        periodeInscription: this.enfantForm.value.periodeInscription,
        sectionId: this.enfantForm.value.sectionId, // ← ajouter ici
        nomPrenomParent: this.contactForm.value.nomPrenom,
        telephoneParent: this.contactForm.value.telephoneParent,
        emailParent: this.contactForm.value.emailParent,
        lienFamilial: this.contactForm.value.lienFamilial
      };

      this.inscriptionService.inscrire(data).subscribe({
        next: (response) => {
          alert(response.message || 'Préinscription envoyée avec succès !');
          this.enfantForm.reset();
          this.contactForm.reset();
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Erreur lors de l’envoi de la préinscription.');
        }
      });
    } else {
      this.markFormGroupTouched(this.enfantForm);
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}
