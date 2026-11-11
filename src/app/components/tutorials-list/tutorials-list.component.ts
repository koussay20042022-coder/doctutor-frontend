import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-tutorials-list',
  templateUrl: './tutorials-list.component.html',
  styleUrls: ['./tutorials-list.component.css']
})
export class TutorialsListComponent implements OnInit {
  tutorials: any[] = [];
  courseId: any;
  isAdmin: boolean = false;

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('userRole') === 'admin';
    // Récupérer l'ID unique du cours choisi depuis l'URL
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    this.retrieveTutorials();
  }


  retrieveTutorials(): void {
  // Récupérer le courseId depuis l'URL
  this.courseId = this.route.snapshot.paramMap.get('courseId');

  if (this.courseId) {
    this.tutorialService.findByCourse(this.courseId).subscribe({
      next: (data: any) => {
        // Appliquer le filtre admin/public si nécessaire
        this.tutorials = data.filter((t: any) => {
          if (!this.isAdmin) {
            return t.published === true;
          }
          return true;
        });
      },
      error: (error) => console.error(error)
    });
  }
}

  //retrieveTutorials(): void {
  //this.tutorialService.getAll().subscribe({
    //next: (data: any) => {
      //this.tutorials = data.filter((t: any) => {
        //const isSameCourse = String(t.courseId) === String(this.courseId);

        //if (!this.isAdmin) {
          //return isSameCourse && t.published === true;
        //}
        //return isSameCourse;
      //});
    //},
    //error: (error) => console.error(error)
  //});
//}

  //addTutorial(): void {
    // Transmettre le courseId pour que le nouveau tutoriel soit lié à CE cours
    //this.router.navigate(['/doctutor/add'], { queryParams: { courseId: this.courseId } });
  //}

  addTutorial(): void {
  this.router.navigate([`/course/${this.courseId}/add-tutorial`]);
}

  deleteTutorial(id: any): void {
  if (this.isAdmin) {
    this.tutorialService.delete(id).subscribe({
      next: () => this.retrieveTutorials(),
      error: (e) => console.error(e)
    });
  }
}
}


