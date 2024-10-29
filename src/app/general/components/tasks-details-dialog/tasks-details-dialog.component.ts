import { Priority, TasksInterface } from './../../interfaces/tasks.interface';
import { Component, inject, OnInit } from '@angular/core';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago.pipe';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TasksService } from '../../services/tasks.service';
import { finalize } from 'rxjs';
import { Members } from '../../interfaces/projects.interface';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tasks-details-dialog',
  standalone: true,
  imports: [
    BaseDialogComponent,
    DatePipe,
    ArrayInlineFormaterPipe,
    TimeAgoPipe,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    NgIf,
    MatIconModule,
    NgClass
  ],
  templateUrl: './tasks-details-dialog.component.html',
  styleUrl: './tasks-details-dialog.component.scss'
})
export class TasksDetailsDialogComponent implements OnInit {
  private _dialogRef: MatDialogRef<TasksDetailsDialogComponent> = inject(
    MatDialogRef<TasksDetailsDialogComponent>
  );
  public data = inject<{ task: TasksInterface; members: Members[] }>(
    MAT_DIALOG_DATA
  );
  private _fb: FormBuilder = inject(FormBuilder);
  private _taskService: TasksService = inject(TasksService);
  isEditing: boolean = false;
  form: FormGroup;
  statuses!: Priority[];
  tags!: Priority[];
  isUpdating: boolean = false;

  constructor() {
    this.form = this._fb.group({
      title: [this.data?.task.title, [Validators.required]],
      description: [this.data?.task.description, [Validators.required]],
      priority: [this.data?.task.priority],
      statusId: [this.data?.task.statusId, [Validators.required]],
      deadline: [this.data?.task.deadline],
      memberId: [this.data?.task.memberId, [Validators.required]],
      tagIds: [
        this.data?.task.taskTags?.map((tag) => tag.tagId),
        [Validators.required]
      ]
    });
  }

  ngOnInit(): void {
    this._getRelatedData();
  }

  private _getRelatedData(): void {
    this._taskService.getRelatedData().subscribe({
      next: (res) => {
        this.statuses = res?.data?.statuses || [];
        this.tags = res?.data?.tags || [];
      }
    });
  }

  close(): void {
    this._dialogRef.close();
  }

  save(): void {
    if (this.form.invalid) {
      return this.form.markAllAsTouched();
    }
    const taskToUpdate = {
      id: this.data?.task.id,
      title: this.form.value.title,
      description: this.form.value.description,
      priorityId: this.form.value.priority.id,
      statusId: this.form.value.statusId,
      memberId: this.form.value.memberId,
      tagIds: this.form.value.tagIds
    };
    this.isUpdating = true;
    this._taskService
      .updateTask(taskToUpdate)
      .pipe(finalize(() => (this.isEditing = false)))
      .subscribe({
        next: () => {
          this._dialogRef.close(true);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  getPriorityInfo(priorityId: number, requirement: string): string {
    switch (priorityId) {
      case 4:
        return requirement === 'icon' ? 'keyboard_double_arrow_down' : 'low';
      case 3:
        return requirement === 'icon' ? 'keyboard_arrow_down' : 'medium';
      case 2:
        return requirement === 'icon' ? 'expand_less' : 'high';
      case 1:
        return requirement === 'icon' ? 'keyboard_double_arrow_up' : 'urgent';
      default:
        return 'info';
    }
  }
}
