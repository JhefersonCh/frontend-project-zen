import { Component, inject, OnInit } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditMembersComponent } from '../../components/add-or-edit-members/add-or-edit-members.component';

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [BasePageComponent, MatButtonModule],
  templateUrl: './project-members.component.html',
  styleUrl: './project-members.component.scss'
})
export class ProjectMembersComponent implements OnInit {
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  projectId: string = '';
  subtitle: string = '';

  ngOnInit(): void {
    this.projectId = this._activatedRoute.snapshot.params?.['id'];
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subtitle = `Gestiona los miembros activos del proyecto: ${params['title']}.`;
    });
  }

  openAddOrEditMemberDialog(): void {
    this._matDialog.open(AddOrEditMembersComponent, {
      data: {
        projectId: this.projectId
      }
    });
  }
}
