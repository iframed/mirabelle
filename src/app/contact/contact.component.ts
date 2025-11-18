import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContactService, ContactFormDTO } from '../services/contact.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  providers: [ContactService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements AfterViewInit{
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  ngAfterViewInit(): void {
    this.initMap();
  }


  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) {
    this.contactForm = this.fb.group({
      nomPrenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }


  private initMap(): void {
    const coordinates: L.LatLngTuple = [33.500317, -7.643222];
  
    const map = L.map('map', {
      center: coordinates,
      zoom: 14
    });
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
  
    L.marker(coordinates)
      .addTo(map)
      .bindPopup(`
        <strong>Crèche La Mirabelle</strong><br>
        60, Résidence Orée de Bouskoura<br>
        Casablanca, Maroc
      `)
      .openPopup();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;
      this.errorMessage = '';

      // Préparer le DTO selon le format backend
      const contactDTO: ContactFormDTO = {
        nom: this.contactForm.value.nomPrenom,
        email: this.contactForm.value.email,
        sujet: 'Demande de contact via le site web',
        message: this.contactForm.value.message
      };

      // Appel du service
      this.contactService.envoyerMessage(contactDTO).subscribe({
        next: (response) => {
          console.log('Message envoyé avec succès:', response);
          this.submitSuccess = true;
          this.isSubmitting = false;
          this.contactForm.reset();
          
          // Masquer le message après 5 secondes
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'envoi:', error);
          this.submitError = true;
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
          
          // Masquer le message d'erreur après 5 secondes
          setTimeout(() => {
            this.submitError = false;
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }
}