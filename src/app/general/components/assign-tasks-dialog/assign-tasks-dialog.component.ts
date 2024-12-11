import { Priority, TasksInterface } from './../../interfaces/tasks.interface';
import { Component, inject, OnInit } from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Members } from '../../interfaces/projects.interface';
import { TasksService } from '../../services/tasks.service';
import { CustomValidationsService } from '../../../shared/validators/customValidations.service';
import { EditorModule } from '@tinymce/tinymce-angular';
import { configEditor } from '../../constants/editor.constants';

@Component({
  selector: 'app-assign-tasks-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    EditorModule
  ],
  templateUrl: './assign-tasks-dialog.component.html',
  styleUrl: './assign-tasks-dialog.component.scss'
})
export class AssignTasksDialogComponent implements OnInit {
  private readonly _customValidations: CustomValidationsService = inject(
    CustomValidationsService
  );
  private readonly _fb: FormBuilder = inject(FormBuilder);
  private readonly _tasksService: TasksService = inject(TasksService);
  private readonly _dialogRef = inject(
    MatDialogRef<AssignTasksDialogComponent>
  );
  public readonly data = inject<{
    members: Members[];
    projectId: number;
    task: TasksInterface;
  }>(MAT_DIALOG_DATA);
  form!: FormGroup;
  priorities: Priority[] = [];
  statuses: Priority[] = [];
  tags: Priority[] = [];
  creating: boolean = false;
  editorConfig = configEditor;

  constructor() {
    this.form = this._fb.group({
      memberId: ['', [Validators.required]],
      projectId: [this.data?.projectId],
      deadline: [
        '',
        [Validators.required, this._customValidations.isLessThanToday()]
      ],
      description: ['', [Validators.required]],
      title: ['', [Validators.required]],
      tagIds: [[], [Validators.required]],
      priorityId: ['', [Validators.required]],
      statusId: ['', [Validators.required]]
    });
  }

  closeDialog(): void {
    this._dialogRef.close();
  }

  ngOnInit(): void {
    this._getRelatedData();
    this.form.patchValue({
      ...this.data?.task,
      tagIds: this.data.task?.taskTags?.map((tag) => tag.tagId)
    });
  }

  private _getRelatedData(): void {
    this._tasksService.getRelatedData().subscribe({
      next: (res) => {
        this.priorities = res?.data?.priorities || [];
        this.statuses = res?.data?.statuses || [];
        this.tags = res?.data?.tags || [];
      }
    });
  }

  save(): void {
    if (!this.form.valid) return this.form.markAllAsTouched();
    console.log(this.form.value);

    this.creating = true;
    if (!this.data?.task?.id) {
      this._tasksService.createTask(this.form.value).subscribe({
        next: () => {
          this.creating = false;
          this._dialogRef.close(true);
        },
        error: () => {
          this.creating = false;
        }
      });
    } else {
      const taskToUpdate = {
        ...this.form.value,
        id: this.data.task.id,
        projectId: undefined
      };
      this._tasksService.updateTask(taskToUpdate).subscribe({
        next: () => {
          this.creating = false;
          this._dialogRef.close(true);
        },
        error: () => {
          this.creating = false;
        }
      });
    }
  }
}
