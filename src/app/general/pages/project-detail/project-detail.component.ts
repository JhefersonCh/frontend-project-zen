/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectsService } from '../../services/projects.service';
import { ProjectInterface } from '../../interfaces/projects.interface';
import { ProgressTimeBarComponent } from '../../components/progress-time-bar/progress-time-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../auth/services/auth.service';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { MatDialog } from '@angular/material/dialog';
import { AssignTasksDialogComponent } from '../../components/assign-tasks-dialog/assign-tasks-dialog.component';
import { TasksService } from '../../services/tasks.service';
import { TasksInterface } from '../../interfaces/tasks.interface';
import { taskStatuses } from '../../constants/tasks.constant';
import { finalize } from 'rxjs';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    BasePageComponent,
    ProgressTimeBarComponent,
    MatButtonModule,
    LoaderComponent,
    DragDropModule,
    BaseCardComponent,
    RouterLink,
    ArrayInlineFormaterPipe
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  loadingPage: boolean = true;
  currentDate = new Date();
  projectId: string = '';
  project?: ProjectInterface;
  userLogged!: UserInterface;
  notStarted: TasksInterface[] = [];
  inProgress: TasksInterface[] = [];
  completed: TasksInterface[] = [];
  revised: TasksInterface[] = [];
  taskStatuses = taskStatuses;
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _dialog: MatDialog = inject(MatDialog);
  private readonly _tasksService: TasksService = inject(TasksService);

  isMobile: boolean = false;

  ngOnInit(): void {
    this.projectId = this._activatedRoute.snapshot.params['id'];
    this._getProject();
    this._getTasks();
    this._getUserLoggedin();
    this.isMobile = window.innerWidth <= 768;
  }

  private _getProject(): void {
    if (this.projectId) {
      this.loadingPage = true;
      this._projectsService.getProjectById(Number(this.projectId)).subscribe({
        next: (response) => {
          this.project = response?.data;
          this.loadingPage = false;

          this.userLoggedIsLeader();
        },
        error: (error) => console.error(error)
      });
    }
  }

  private _reloadArrays(): void {
    this.notStarted = [];
    this.inProgress = [];
    this.completed = [];
    this.revised = [];
  }

  private _getTasks(): void {
    if (!this.projectId) return;

    this.loadingPage = true;
    this._reloadArrays();

    this._tasksService
      .getByProjectId(Number(this.projectId))
      .pipe(finalize(() => (this.loadingPage = false)))
      .subscribe({
        next: (response) => {
          const statusMap = {
            [taskStatuses.pending]: this.notStarted,
            [taskStatuses.inProgress]: this.inProgress,
            [taskStatuses.completed]: this.completed,
            [taskStatuses.revised]: this.revised
          };

          response?.data.forEach((task) => {
            const targetArray = statusMap[task.statusId];
            if (targetArray) {
              targetArray.push(task);
            }
          });
        },
        error: (error) => console.error(error)
      });
  }

  private _getUserLoggedin(): void {
    this.userLogged = this._authService.getUserLoggedIn();
  }

  userLoggedIsLeader(): boolean {
    const members = this.project?.members;
    const member = members?.find((mem) => mem.userId === this.userLogged.id);
    return member
      ? ['Líder', 'Moderador'].includes(member.projectRole.roleName)
      : false;
  }

  openAssignTaskDialog(): void {
    const dialogRef = this._dialog.open(AssignTasksDialogComponent, {
      data: {
        members: this.project?.members,
        projectId: Number(this.projectId)
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._getTasks();
      }
    });
  }

  drop(event: CdkDragDrop<TasksInterface[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
