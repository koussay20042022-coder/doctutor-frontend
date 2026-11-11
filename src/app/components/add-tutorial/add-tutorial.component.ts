import { Component, OnInit } from '@angular/core';
import { TutorialService } from 'src/app/services/tutorial.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {
  private supabase: SupabaseClient;

  tutorial = {
    title: '',
    description: '',
    published: false,
    pdf_url: '',
    courseId: null as number | null
  };

  selectedFile: File | null = null;
  submitted = false;

  constructor(
    private tutorialService: TutorialService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  

  ngOnInit(): void {
  // Récupérer le courseId depuis l'URL
  const id = this.route.snapshot.paramMap.get('courseId');

  if (id) {
    this.tutorial.courseId = Number(id);
    console.log('Course ID détecté :', this.tutorial.courseId);
  } else {
    console.error('Aucun Course ID trouvé dans l’URL !');
  }
}

  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }



  
async saveTutorial(): Promise<void> {

  try {
    // 1. Récupérer l'ID du cours depuis l'URL
    const courseId = Number(
      this.route.snapshot.paramMap.get('courseId')
    );

    // 2. Vérifier que le cours existe
    if (!courseId || isNaN(courseId)) {
      alert('Erreur : aucun cours sélectionné !');
      console.error('Course ID introuvable dans l’URL');
      return;
    }

    // 3. Vérifier les informations obligatoires
    if (!this.tutorial.title.trim()) {
      alert('Veuillez saisir le titre du tutoriel !');
      return;
    }

    if (!this.tutorial.description.trim()) {
      alert('Veuillez saisir la description du tutoriel !');
      return;
    }

    // 4. Initialiser l'URL du PDF
    let pdfUrl = '';

    // 5. Télécharger le PDF sur Supabase si un fichier est sélectionné
    if (this.selectedFile) {

      const fileName = `${Date.now()}_${this.selectedFile.name}`;

      const { data, error } = await this.supabase.storage
        .from('tutorials-pdf')
        .upload(fileName, this.selectedFile);

      if (error) {
        throw error;
      }

      // Récupérer l'URL publique du PDF
      const { data: publicData } = this.supabase.storage
        .from('tutorials-pdf')
        .getPublicUrl(fileName);

      pdfUrl = publicData.publicUrl;
    }

    // 6. Préparer les données du tutoriel
    const data = {
      title: this.tutorial.title.trim(),
      description: this.tutorial.description.trim(),
      published: false,
      pdf_url: pdfUrl,
      courseId: courseId
    };

    console.log('Données envoyées au backend :', data);

    // 7. Enregistrer le tutoriel dans la base de données
    const response = await firstValueFrom(
      this.tutorialService.create(data)
    );

    console.log('Tutoriel ajouté avec succès :', response);

    // 8. Indiquer que l'enregistrement est terminé
    this.submitted = true;

    // 9. Rediriger vers le cours sélectionné
    await this.router.navigate([
      '/course',
      courseId,
      'tutorials'
    ]);

  } catch (error) {

    console.error(
      'Erreur lors de la sauvegarde du tutoriel :',
      error
    );

    alert(
      'Une erreur est survenue lors de l’ajout du tutoriel. Consultez la console.'
    );
  }
}


  newTutorial(): void {
    this.submitted = false;
    this.selectedFile = null;
    this.tutorial = {
      title: '',
      description: '',
      published: false,
      pdf_url: '',
      courseId: this.tutorial.courseId
    };
  }
}

