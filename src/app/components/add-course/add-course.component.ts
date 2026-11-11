import { Component } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {
  courseTitle: string = '';
  teacherName: string = ''; // Champ optionnel pour le nom du prof

  constructor(private tutorialService: TutorialService, private router: Router) {}

  saveCourse(): void {
    if (!this.courseTitle) return;

    const data = {
      title: this.courseTitle,
      description: this.teacherName ? `Enseignant: ${this.teacherName}` : '', // Stocke le nom du prof dans la description si renseigné
      published: false
    };

    this.tutorialService.create(data).subscribe({
      next: (res) => {
        console.log('Cours créé avec succès', res);
        this.router.navigate(['/home']);
      },
      error: (e) => console.error(e)
    });
  }
}

