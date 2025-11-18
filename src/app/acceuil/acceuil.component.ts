import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-acceuil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acceuil.component.html',
  styleUrl: './acceuil.component.css'
})
export class AcceuilComponent {


  images = [
    '/mirabelle.png',
    '/m5.png',
    '/m4.png',
    '/m3.png',
    '/m2.png',
    '/m1.png',
    '/a1.png',
    '/a2.png',
    '/a3.png',
    '/a1.png',
    '/a2.png',
    '/a3.png',
    '/a2.png',
    '/a3.png',
    '/a1.png',
    '/a2.png',
    '/a3.png',
    '/a1.png',
    '/a2.png',
    '/a3.png',
    '/a3.png',
    '/a1.png',
    '/a2.png',
    '/a3.png',
  ];
}
