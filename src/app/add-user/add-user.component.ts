import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, NgFor],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'] // ⚡ corrigé de styleUrl -> styleUrls
})
export class AddUserComponent implements OnInit {

  userForm!: FormGroup;

  parents: any[] = [];
  personnels: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
      role: ['', Validators.required],   // ADMIN, PARENT ou PERSONNEL
      parentId: [null],                 // Optionnel
      personnelId: [null]               // Optionnel
    });

    // ⚡ Charger les parents et personnels depuis le backend
    this.http.get<any[]>('http://localhost:8080/api/parents/all').subscribe({
      next: data => this.parents = data,
      error: err => console.error('Erreur chargement parents', err)
    });

    this.http.get<any[]>('http://localhost:8080/api/personnel/all').subscribe({
      next: data => this.personnels = data,
      error: err => console.error('Erreur chargement personnels', err)
    });
  }

  submit() {
    if (this.userForm.valid) {
      this.http.post('http://localhost:8080/auth/register', this.userForm.value)
        .subscribe({
          next: res => console.log('Utilisateur créé', res),
          error: err => console.error('Erreur création utilisateur', err)
        });
    }
  }
}
