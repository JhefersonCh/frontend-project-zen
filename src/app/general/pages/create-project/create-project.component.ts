import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgIf } from '@angular/common';
import { FormFieldSuccessDirective } from '../../../shared/directives/form-field-success.directive';
import { ProjectsService } from '../../services/projects.service';
import { ProjectInterface } from '../../interfaces/projects.interface';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    BasePageComponent,
    MatFormFieldModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInput,
    MatDatepickerModule,
    NgIf,
    FormFieldSuccessDirective,
    MatSelectModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent implements OnInit {
  projectForm!: FormGroup;
  categories: ProjectInterface[] = [];
  isCreating: boolean = false;
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  private readonly _router: Router = inject(Router);

  constructor() {
    this.projectForm = this._fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      finishDate: ['', [Validators.required]],
      categoryIds: [[], [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._getRelatedData();
  }

  private _getRelatedData(): void {
    this._projectsService.getRelatedData().subscribe({
      next: (res) => {
        this.categories = res?.data?.categories || [];
      },
      error: (error) => console.error(error)
    });
  }

  create(): void {
    if (this.projectForm.invalid) return;
    this.isCreating = true;
    this._projectsService.createProject(this.projectForm.value).subscribe({
      next: () => {
        this.isCreating = false;
        this._router.navigate(['/general/projects']);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
