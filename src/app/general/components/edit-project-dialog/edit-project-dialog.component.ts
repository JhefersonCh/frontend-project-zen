import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject
} from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {
  CreateProjectInterface,
  ProjectInterface
} from '../../interfaces/projects.interface';

@Component({
  selector: 'app-edit-project-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatDatepickerModule
  ],
  templateUrl: './edit-project-dialog.component.html',
  styleUrl: './edit-project-dialog.component.scss'
})
export class EditProjectDialogComponent implements AfterViewInit {
  projectForm!: FormGroup;
  isLoading: boolean = false;
  private readonly dialogRef = inject(MatDialogRef<EditProjectDialogComponent>);
  public readonly data = inject<{
    project: ProjectInterface;
    categories: ProjectInterface[];
  }>(MAT_DIALOG_DATA);
  private readonly _fb: FormBuilder = inject(FormBuilder);

  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  emitter: EventEmitter<CreateProjectInterface> = new EventEmitter();

  constructor() {
    this.projectForm = this._fb.group({
      id: [this.data?.project.id],
      title: [this.data?.project.title],
      description: [this.data?.project?.description],
      finishDate: [this.data?.project?.finishDate],
      categoryIds: []
    });
  }

  ngAfterViewInit(): void {
    this.projectForm.get('categoryIds')?.setValue(this._mapCategories());
    this.cdr.detectChanges();
  }

  private _mapCategories() {
    const categories = this.data.project.projectCategories?.map(
      (pc) => pc?.category?.id
    );
    return categories;
  }

  closeDialog(): void {
    this.dialogRef.close(this.projectForm.value);
    this.isLoading = false;
  }

  saveProject(): void {
    if (this.projectForm.invalid) return;
    this.isLoading = true;
    this.emitter.emit(this.projectForm.value);
  }
}
