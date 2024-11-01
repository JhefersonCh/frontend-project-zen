import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { UsersInterface } from '../../interfaces/users.interface';
import { ApiResponseInterface } from '../../../../shared/interfaces/api-response.interface';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../../../shared/components/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatPaginatorModule,
    BasePageComponent,
    MatTableModule,
    RouterLink
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent implements OnInit, AfterViewInit {
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  searchControl: FormControl = new FormControl('');
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<UsersInterface>([]);
  displayedColumns: string[] = [
    'identification',
    'fullName',
    'role',
    'actions'
  ];
  totalItems: number = 0;
  pageSize: number = 5; // Tamaño de página inicial
  currentPage: number = 0;
  projectId: string = '';
  subtitle: string = 'Gestiona los miembros registrados en la aplicación.';

  ngOnInit(): void {
    this.loadUsers();
    this.projectId = this._activatedRoute.snapshot.params?.['email'];
    this._listenControls();
  }

  private _listenControls(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe((value) => {
        this.currentPage = 0;
        this.loadUsers(value);
      });
  }

  goToCreateUser(): void {
    this._router.navigate(['/users/create']);
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      this.currentPage = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.loadUsers();
    });
  }

  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value
  //     .trim()
  //     .toLowerCase();

  //   this.currentPage = 0;
  //   this.loadUsers(filterValue);
  // }

  loadUsers(filter: string = ''): void {
    const query = {
      page: this.currentPage + 1,
      perPage: this.pageSize,
      search: filter
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res: ApiResponseInterface<UsersInterface[]>) => {
        this.dataSource.data = res.data || [];
        this.totalItems = res.pagination?.total || 0;
        this.paginator.length = this.totalItems;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
      }
    });
  }

  private _deleteUser(id: string): void {
    this._usersService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
      }
    });
  }

  openDeleteUserDialog(id: string) {
    const dialogRef = this._matDialog.open(YesNoDialogComponent);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this._deleteUser(id);
      }
    });
  }
}
