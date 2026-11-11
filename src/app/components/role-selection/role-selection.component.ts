import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.component.html',
  styleUrls: ['./role-selection.component.css']
})
export class RoleSelectionComponent {
  adminCode: string = '';
  errorMessage: string = '';
  // Définissez votre code secret d'administrateur
  private SECRET_CODE: string = 'admindoc'; 

  constructor(private router: Router) {}

  // Entrer en tant qu'étudiant (lecture seule)
  selectStudentRole(): void {
    localStorage.setItem('userRole', 'student');
    this.router.navigate(['/home']);
  }

  // Entrer en tant qu'administrateur (gestion complète)
  verifyAdminCode(): void {
    if (this.adminCode === this.SECRET_CODE) {
      localStorage.setItem('userRole', 'admin');
      this.errorMessage = '';
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Code administrateur incorrect !';
    }
  }
}

