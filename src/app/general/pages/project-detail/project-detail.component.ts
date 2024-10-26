/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

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
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AssignTasksDialogComponent } from '../../components/assign-tasks-dialog/assign-tasks-dialog.component';
import { TasksService } from '../../services/tasks.service';
import { TasksInterface } from '../../interfaces/tasks.interface';
import { taskStatuses } from '../../constants/tasks.constant';
import { finalize } from 'rxjs';
import { TasksPanelComponent } from '../../components/tasks-panel/tasks-panel.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    BasePageComponent,
    ProgressTimeBarComponent,
    MatButtonModule,
    LoaderComponent,
    RouterLink,
    TasksPanelComponent,
    MatIconModule,
    MatTooltipModule
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
  statusMap: {
    [x: number]: {
      label: string;
      list: TasksInterface[];
      connectedTo: string[];
      listTag: string;
    };
  } = {};
  private originalTasksState: {
    [x: number]: {
      label: string;
      list: TasksInterface[];
      connectedTo: string[];
      listTag: string;
    };
  } = {};
  showDoneButton: boolean = false;
  newStatuses: { id: number; statusId: number }[] = [];
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
          this.statusMap = {
            [taskStatuses.pending]: {
              label: 'No iniciado',
              list: this.notStarted,
              connectedTo: ['inProgress', 'completed', 'revised'],
              listTag: 'notStarted'
            },
            [taskStatuses.inProgress]: {
              label: 'En progreso',
              list: this.inProgress,
              connectedTo: ['notStarted', 'completed', 'revised'],
              listTag: 'inProgress'
            },
            [taskStatuses.completed]: {
              label: 'Completado',
              list: this.completed,
              connectedTo: ['notStarted', 'inProgress', 'revised'],
              listTag: 'completed'
            },
            [taskStatuses.revised]: {
              label: 'Revisado',
              list: this.revised,
              connectedTo: ['notStarted', 'inProgress', 'completed'],
              listTag: 'revised'
            }
          };

          response?.data.forEach((task) => {
            const targetArray = this.statusMap[task.statusId];
            if (targetArray) {
              targetArray.list.push(task);
            }
          });
          this._storeOriginalTasksState(this.statusMap, true);
        },
        error: (error) => console.error(error)
      });
  }

  private _storeOriginalTasksState(
    statusMap: {
      [key: number]: {
        label: string;
        list: TasksInterface[];
        connectedTo: string[];
        listTag: string;
      };
    },
    firstTime: boolean
  ): void {
    if (firstTime) {
      this.originalTasksState = Object.entries(statusMap).reduce(
        (acc, [key, value]) => {
          acc[Number(key)] = {
            ...value,
            list: [...value.list].map((task) => ({ ...task }))
          };
          return acc;
        },
        {} as typeof this.originalTasksState
      );
    }
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
    const task = event.previousContainer.data[event.previousIndex];
    const newStatusId = Object.entries(this.statusMap).find(
      ([_, value]) => value.listTag === event.container.id
    )?.[0];

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const originalStatus = this._findOriginalTaskStatus(task.id);
      if (newStatusId) {
        if (originalStatus === Number(newStatusId)) {
          const indexToRemove = this.newStatuses.findIndex(
            (ns) => ns.id === task.id
          );
          if (indexToRemove !== -1) {
            this.newStatuses.splice(indexToRemove, 1);
          }
        } else {
          const existingIndex = this.newStatuses.findIndex(
            (ns) => ns.id === task.id
          );
          const newStatus = { id: task.id, statusId: Number(newStatusId) };

          if (existingIndex !== -1) {
            this.newStatuses[existingIndex] = newStatus;
          } else {
            this.newStatuses.push(newStatus);
          }
        }
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.showDoneButton = this._hasTasksChanged();
  }

  private _findOriginalTaskStatus(taskId: number): number | null {
    for (const [status, data] of Object.entries(this.originalTasksState)) {
      if (data.list.some((task) => task.id === taskId)) {
        return Number(status);
      }
    }
    return null;
  }

  private _hasTasksChanged(): boolean {
    const originalTasksByStatus = Object.entries(
      this.originalTasksState
    ).reduce(
      (acc, [status, data]) => {
        acc[Number(status)] = new Set(data.list.map((task) => task.id));
        return acc;
      },
      {} as { [key: number]: Set<number> }
    );

    return Object.entries(this.statusMap).some(([status, data]) => {
      const currentTaskIds = new Set(data.list.map((task) => task.id));
      const originalTaskIds = originalTasksByStatus[Number(status)];

      if (currentTaskIds.size !== originalTaskIds.size) return true;

      for (const taskId of currentTaskIds) {
        if (!originalTaskIds.has(taskId)) return true;
      }

      return false;
    });
  }

  get statusMapEntries() {
    return Object.entries(this.statusMap);
  }

  public saveNewStatuses(): void {
    const tasks = this.newStatuses;
    this._tasksService.updateManyStatuses(tasks).subscribe({
      next: () => {
        this._getTasks();
        this.showDoneButton = false;
      },
      error: (error) => console.error(error)
    });
  }

  isBlinking = false;
  startBlinking() {
    this.isBlinking = true;

    setTimeout(() => {
      this.isBlinking = false;
    }, 3000);
  }
}
