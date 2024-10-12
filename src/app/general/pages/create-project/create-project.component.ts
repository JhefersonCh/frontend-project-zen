import { Component, inject } from '@angular/core';
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
    FormFieldSuccessDirective
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
  projectForm!: FormGroup;
  private readonly _fb: FormBuilder = inject(FormBuilder);

  constructor() {
    this.projectForm = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }
}
