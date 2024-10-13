/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { ActivatedRoute } from '@angular/router';
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
import { NgFor, NgIf } from '@angular/common';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    BasePageComponent,
    ProgressTimeBarComponent,
    MatButtonModule,
    LoaderComponent,
    DragDropModule,
    NgFor,
    BaseCardComponent,
    NgIf
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
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  private readonly _authService: AuthService = inject(AuthService);

  isMobile: boolean = false;

  ngOnInit(): void {
    this.projectId = this._activatedRoute.snapshot.params['id'];
    this._getProject();
    this._getUserLoggedin();
    this.isMobile = window.innerWidth <= 768;
  }

  private _getProject(): void {
    if (this.projectId) {
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

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  revision = ['Siu', 'Nou'];
  revised = ['Revisado', 'Cómo va'];

  drop(event: CdkDragDrop<string[]>) {
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
