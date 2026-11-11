import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-tutorial-details',
  templateUrl: './tutorial-details.component.html',
  styleUrls: ['./tutorial-details.component.css']
})
export class TutorialDetailsComponent implements OnInit {
  isAdmin: boolean = false;

  @Output() refreshList: EventEmitter<void> = new EventEmitter();

  @Input() viewMode = false;

  @Input() currentTutorial = {
    id: '',
    title: '',
    description: '',
    published: false,
    pdf_url: '' 
  };
  
  message = '';

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 1. Récupérer le rôle de l'utilisateur connecté
    this.isAdmin = localStorage.getItem('userRole') === 'admin';

    // 2. Si c'est un étudiant, lui interdire l'accès et le rediriger vers l'accueil
    if (!this.isAdmin) {
      alert("Accès refusé : Réservé aux administrateurs.");
      this.router.navigate(['/home']);
      return;
    }

    // 3. Charger le tutoriel si on n'est pas en mode vue simple
    if (!this.viewMode) {
      this.message = '';
      this.getTutorial(this.route.snapshot.params['id']);
    }
  }

  getTutorial(id: string): void {
  this.tutorialService.get(id).subscribe({
    next: (data) => {
      this.currentTutorial = data;
    },
    error: (error) => {
      console.error(error);
    }
  });
}

  updatePublished(status: boolean): void {
  const data = {
    title: this.currentTutorial.title,
    description: this.currentTutorial.description,
    published: status
  };

  this.message = '';

  this.tutorialService.update(this.currentTutorial.id, data).subscribe({
    next: (res) => {
      console.log(res);
      this.currentTutorial.published = status;
      this.message = 'Le statut a été mis à jour avec succès !';
    },
    error: (e) => {
      console.error(e);
    }
  });
}


updateTutorial(): void {
  this.message = '';
  this.tutorialService.update(this.currentTutorial.id, this.currentTutorial)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.message = 'Le tutoriel a été mis à jour avec succès !';
      },
      error: (e) => console.error(e)
    });
}

deleteTutorial(): void {
  this.tutorialService.delete(this.currentTutorial.id)
    .subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/tutorials']);
      },
      error: (e) => console.error(e)
    });
}



}