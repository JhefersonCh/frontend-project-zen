import { MatButtonModule } from '@angular/material/button';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import {
  CreateProjectInterface,
  ProjectInterface,
  ProjectRoles
} from '../../interfaces/projects.interface';
import { ProjectsService } from './../../services/projects.service';
import { Component, inject, OnInit } from '@angular/core';
import { BaseCardComponent } from '../../../shared/components/base-card/base-card.component';
import { MatIconModule } from '@angular/material/icon';
import { ArrayInlineFormaterPipe } from '../../../shared/pipes/array-inline-formater.pipe';
import { RouterLink } from '@angular/router';
import { BaseDialogComponent } from '../../../shared/components/base-dialog/base-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditProjectDialogComponent } from '../../components/edit-project-dialog/edit-project-dialog.component';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { EmptyPanelComponent } from '../../../shared/components/empty-panel/empty-panel.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AuthService } from '../../../auth/services/auth.service';
import { UserInterface } from '../../../shared/interfaces/user.interface';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    BasePageComponent,
    MatButtonModule,
    BaseCardComponent,
    MatIconModule,
    ArrayInlineFormaterPipe,
    RouterLink,
    BaseDialogComponent,
    EmptyPanelComponent,
    LoaderComponent
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  pageLoading: boolean = true;
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  private readonly _authService: AuthService = inject(AuthService);
  userLogged!: UserInterface;
  projects?: ProjectInterface[];
  categories: ProjectInterface[] = [];
  roles: ProjectRoles[] = [];
  ngOnInit(): void {
    this._getProjects();
    this._getRelatedData();
    this._getUserLoggedin();
  }

  constructor(public dialog: MatDialog) {}

  private _getProjects(
    dialogRef?: MatDialogRef<EditProjectDialogComponent>
  ): void {
    this._projectsService.getProjects().subscribe({
      next: (res) => {
        this.pageLoading = false;
        this.projects = res?.data || [];
        if (dialogRef) {
          dialogRef.close();
        }
      },
      error: (error) => console.error(error)
    });
  }

  openEditProjectDialog(project: ProjectInterface, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (project) {
      const dialogRef = this.dialog.open(EditProjectDialogComponent, {
        data: {
          project,
          categories: this.categories
        }
      });
      dialogRef.componentInstance.emitter.subscribe((project) => {
        this._updateProject(project, dialogRef);
      });
      dialogRef.afterClosed().subscribe();
    }
  }

  private _getRelatedData(): void {
    this._projectsService.getRelatedData().subscribe({
      next: (res) => {
        this.categories = res?.data?.categories || [];
        this.roles = res?.data?.roles || [];
      },
      error: (error) => console.error(error)
    });
  }

  private _updateProject(
    project: CreateProjectInterface,
    dialogRef: MatDialogRef<EditProjectDialogComponent>
  ): void {
    this._projectsService.updateProject(project).subscribe({
      next: () => {
        this._getProjects(dialogRef);
        dialogRef.componentInstance.isLoading = false;
      },
      error: (error) => console.error(error)
    });
  }

  openDeleteProjectDialog(project: ProjectInterface, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (project) {
      const dialogRef = this.dialog.open(YesNoDialogComponent, {});
      dialogRef.afterClosed().subscribe((confirm) => {
        if (confirm) {
          this._deleteProject(project?.id);
        }
      });
    }
  }

  private _deleteProject(id?: number): void {
    if (id) {
      this._projectsService.deleteProject(id).subscribe({
        next: () => {
          this._getProjects();
        },
        error: (error) => console.error(error)
      });
    }
  }

  private _getUserLoggedin(): void {
    this.userLogged = this._authService.getUserLoggedIn();
  }

  userLoggedIsLeader(project: ProjectInterface): boolean {
    const members = project?.members;
    return (
      members?.find((mem) => mem.userId === this.userLogged?.id)?.projectRole
        .roleName === 'Líder'
    );
  }
}
