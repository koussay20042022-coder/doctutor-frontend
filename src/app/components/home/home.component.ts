import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courses: any[] = [];
  isAdmin: boolean = false;  // Variable pour gérer l'affichage conditionnel

  constructor(private tutorialService: TutorialService, private router: Router) {}

  ngOnInit(): void {
    // Vérifier si le rôle stocké est 'admin'
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    this.loadCourses();
  }

  loadCourses(): void {
  this.tutorialService.getAll().subscribe({
    next: (data: any) => {

      // Afficher uniquement les cours principaux
      this.courses = data.filter((item: any) =>
        item.courseId === null || item.courseId === undefined
      );

    },
    error: (error: any) => {
      console.error(error);
    }
  });
}

  // Ouvre exclusivement le cours sur lequel l'utilisateur a cliqué
  openCourse(courseId: any): void {
    this.router.navigate([`/course/${courseId}/tutorials`]);
  }

  deleteCourse(id: any): void {
  this.tutorialService.delete(id).subscribe({
    next: () => {
      this.loadCourses();
    },
    error: (error: any) => {
      console.error(error);
    }
  });
  }


  createCourse(title: string): void {
    if (!title) return;

    const data = {
      title: title,
      description: '',
      published: false
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log('Cours créé :', res);
        this.loadCourses(); // Recharge la liste des cours immédiatement
      },
      error: (e) => console.error(e)
    });
  }



}
