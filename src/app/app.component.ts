import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router) {}

  get isAdmin(): boolean {
    return localStorage.getItem('userRole') === 'admin';
  }

  // Méthode de déconnexion / retour au choix du rôle
  logout(): void {
    localStorage.removeItem('userRole');
    this.router.navigate(['/']);
  }
}

