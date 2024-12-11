/* eslint-disable @typescript-eslint/no-explicit-any */
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { TasksInterface } from '../../interfaces/tasks.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { TasksDetailsDialogComponent } from '../tasks-details-dialog/tasks-details-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Members } from '../../interfaces/projects.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { MatMenuModule } from '@angular/material/menu';
import { AssignTasksDialogComponent } from '../assign-tasks-dialog/assign-tasks-dialog.component';

@Component({
  selector: 'app-tasks-panel',
  standalone: true,
  imports: [
    DragDropModule,
    BaseCardComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TruncatePipe,
    MatMenuModule
  ],
  templateUrl: './tasks-panel.component.html',
  styleUrl: './tasks-panel.component.scss'
})
export class TasksPanelComponent implements OnInit {
  @Input() taskId?: number;
  @Input() status!: string;
  @Input() tasksList!: TasksInterface[];
  @Input() dropListConnectedTo!: string[];
  @Input() isMobile: boolean = false;
  @Input() listTag: string = '';
  @Input() isLeader: boolean = false;
  @Input() isMod: boolean = false;
  @Input() members: Members[] = [];
  @Output() dropEvent = new EventEmitter<CdkDragDrop<any>>();
  @Output() updated = new EventEmitter<boolean>();
  @Output() deleteTask = new EventEmitter<number>();
  private _matDialog: MatDialog = inject(MatDialog);
  @Input() isDropping: boolean = false;

  ngOnInit(): void {
    if (this.taskId) {
      const taskToShow = this.tasksList.find(
        (task) => task.id === Number(this.taskId)
      );

      if (taskToShow) {
        this.openShowTaskInfoDialog(taskToShow);
      }
    }
  }

  onDrop(event: CdkDragDrop<any>) {
    this.dropEvent.emit(event);
  }

  openShowTaskInfoDialog(task: TasksInterface, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
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

  openEditTaskDialog(task: TasksInterface, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const dialogRef = this._matDialog.open(AssignTasksDialogComponent, {
      data: {
        members: this.members,
        projectId: task.projectId,
        task
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

  public getMemberAssigned(memberId: number): string {
    const member = this.members.find((m) => m.id === memberId);
    return member ? member.user.fullName : '';
  }

  public getTitleIcon(task: TasksInterface): string {
    const currentDate = new Date();
    const taskDate = new Date(task.deadline);
    const twoDaysFromNow = new Date(currentDate);
    twoDaysFromNow.setDate(currentDate.getDate() + 2);

    if (taskDate < currentDate) {
      return 'dangerous';
    }
    if (taskDate > twoDaysFromNow) {
      return 'schedule_send';
    }
    if (taskDate > currentDate && taskDate <= twoDaysFromNow) {
      return 'report_problem';
    }
    if (taskDate.toDateString() === currentDate.toDateString()) {
      return 'danger';
    }

    return 'pending';
  }

  public getIconColor(icon: string): string {
    switch (icon) {
      case 'dangerous':
        return 'red';
      case 'schedule_send':
        return 'blue';
      case 'report_problem':
        return 'orange';
      case 'danger':
        return 'red';
      default:
        return 'black';
    }
  }
}
