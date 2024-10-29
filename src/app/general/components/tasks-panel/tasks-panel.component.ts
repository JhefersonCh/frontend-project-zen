/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { TasksInterface } from '../../interfaces/tasks.interface';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TasksDetailsDialogComponent } from '../tasks-details-dialog/tasks-details-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Members } from '../../interfaces/projects.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-tasks-panel',
  standalone: true,
  imports: [
    ArrayInlineFormaterPipe,
    DragDropModule,
    BaseCardComponent,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TruncatePipe
  ],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent {
  @Input() status!: string;
  @Input() tasksList!: TasksInterface[];
  @Input() dropListConnectedTo!: string[];
  @Input() isMobile: boolean = false;
  @Input() listTag: string = '';
  @Input() members: Members[] = [];
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() deleteTask = new EventEmitter<number>();
  private _matDialog: MatDialog = inject(MatDialog);
  @Input() isDropping: boolean = false;

  onDrop(event: CdkDragDrop<any>) {
    this.isDropping = true;
    this.dropEvent.emit(event);
  }

  openShowTaskInfoDialog(task: TasksInterface, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this._matDialog.open(TasksDetailsDialogComponent, {
      data: {
        task,
        members: this.members
      }
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.updated.emit(true);
      }
    });
  }

  openDeleteTaskDialog(taskId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: 'Eliminar tarea'
      }
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteTask.emit(taskId);
      }
    });
  }
}
