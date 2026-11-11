import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleSelectionComponent } from './components/role-selection/role-selection.component';
import { HomeComponent } from './components/home/home.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { AddCourseComponent } from './components/add-course/add-course.component'; // <-- Ajoute cette ligne
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';

const routes: Routes = [
  { path: '', component: RoleSelectionComponent },
  { path: 'home', component: HomeComponent },
  { path: 'add-course', component: AddCourseComponent },
  { path: 'doctutor/add', component: AddCourseComponent }, // <-- AJOUTE CETTE LIGNE
  { path: 'course/:courseId/tutorials', component: TutorialsListComponent },
  { path: 'course/:courseId/add-tutorial', component: AddTutorialComponent },
  { path: 'doctutor/:id', component: TutorialDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

