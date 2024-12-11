import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddOrEditMembersComponent } from '../../components/add-or-edit-members/add-or-edit-members.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MembersService } from '../../services/members.service';
import { Members } from '../../interfaces/projects.interface';
import { MatIconModule } from '@angular/material/icon';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-members',
  standalone: true,
  imports: [
    BasePageComponent,
    MatButtonModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatTableModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    DatePipe
  ],
  templateUrl: './project-members.component.html',
  styleUrl: './project-members.component.scss'
})
export class ProjectMembersComponent implements OnInit {
  private readonly _membersService: MembersService = inject(MembersService);
  private readonly _notificationService: NotificationsService =
    inject(NotificationsService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _authService: AuthService = inject(AuthService);
  projectId: string = '';
  subtitle: string = '';
  members: Members[] = [];
  displayedColumns: string[] = ['createdAt', 'name', 'role', 'actions'];
  dataSource!: MatTableDataSource<Members>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.projectId = this._activatedRoute.snapshot.params?.['id'];
    this._activatedRoute.queryParams.subscribe((params) => {
      this.subtitle = `Gestiona los miembros activos del proyecto: ${params['title']}.`;
    });

    this._getAllMembers(Number(this.projectId));
  }

  private _getAllMembers(projectId: number) {
    this._membersService.getMembersByProjectId(projectId).subscribe({
      next: (res) => {
        this.members = res?.data || [];
        this.dataSource = new MatTableDataSource(this.members);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (this.dataSource) {
          this.dataSource.filterPredicate = (data: Members, filter: string) => {
            return data.user.fullName.trim().toLowerCase().includes(filter);
          };
          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'createdAt':
                return new Date(item.createdAt).getTime();
              case 'name':
                return item.user.fullName;
              case 'role':
                return item.projectRole?.roleName;
              default:
                return '';
            }
          };
        }
      }
    });
  }

  openAddOrEditMemberDialog(row?: Members, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    const matRef = this._matDialog.open(AddOrEditMembersComponent, {
      data: {
        projectId: this.projectId,
        member: row,
        leader: this.members.find(
          (member) => member.projectRole?.roleName === 'Líder'
        )
      }
    });

    matRef.afterClosed().subscribe((res) => {
      if (res) {
        this._getAllMembers(Number(this.projectId));
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDeleteMemberDialog(member: Members, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (member) {
      const dialogRef = this._matDialog.open(YesNoDialogComponent, {});
      dialogRef.afterClosed().subscribe((confirm) => {
        if (confirm) {
          this._deleteMember(member, Number(this.projectId));
        }
      });
    }
  }

  private _deleteMember(member: Members, projectId: number): void {
    const userLoggedIn = this._authService.getUserLoggedIn();
    if (userLoggedIn.id === member.userId) {
      return this._notificationService.showNotification(
        'error',
        '¡No puedes eliminarte a ti mismo!',
        'Error al eliminar'
      );
    }
    if (member?.id && projectId) {
      this._membersService.deleteMember(member?.id, projectId).subscribe({
        next: () => {
          this._getAllMembers(projectId);
        }
      });
    }
  }
}
