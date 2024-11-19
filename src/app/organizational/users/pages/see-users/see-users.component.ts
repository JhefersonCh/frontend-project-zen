/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  inject,
  OnInit,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UsersService } from '../../services/users.service';
import { UsersInterface } from '../../interfaces/users.interface';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { BasePageComponent } from '../../../../shared/components/base-page/base-page.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import {
  SearchField,
  SearchResult
} from '../../../../shared/interfaces/search.interface';
import { SearchFieldsComponent } from '../../../../shared/components/search-fields/search-fields.component';
import { ApiResponseInterface } from '../../../../shared/interfaces/api-response.interface';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { SearchResultsComponent } from '../../../../shared/components/search-results/search-results.component';
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
    RouterLink,
    SearchFieldsComponent,
    LoaderComponent,
    MatTab,
    MatTabGroup,
    SearchResultsComponent
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent implements OnInit, AfterViewInit {
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;
  dataSource = new MatTableDataSource<UsersInterface>([]);
  displayedColumns: string[] = [
    'identificationType',
    'fullName',
    'role',
    'actions'
  ];

  form!: FormGroup;
  totalItems: number = 0;
  pageSize: number = 5;
  currentPage: number = 0;
  projectId: string = '';
  showClearButton: boolean = false;
  selectedTabIndex = 0;
  loading: boolean = false;
  isMobile: boolean = false;
  results: SearchResult[] = [];
  paginationParams = { order: 'ASC', page: 1, perPage: 5 };
  params: any = {};
  paginationResults = {
    page: 1,
    perPage: 5,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  subtitle: string = 'Gestiona los miembros registrados en la aplicación.';
  searchFields: SearchField[] = [
    {
      name: 'roleId',
      label: 'Rol',
      type: 'select',
      options: [],
      placeholder: 'Buscar por rol'
    },
    {
      name: 'identification',
      label: 'Identificación',
      type: 'text',
      placeholder: 'Buscar por identificación'
    },
    {
      name: 'identificationTypeId',
      label: 'Tipo de identificación',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo de identificación'
    },
    {
      name: 'fullName',
      label: 'Nombre completo',
      type: 'text',
      placeholder: 'Buscar por nombre'
    },
    {
      name: 'username',
      label: 'Nombre de usuario',
      type: 'text',
      placeholder: 'Buscar por nombre de usuario'
    },
    {
      name: 'phone',
      label: 'Teléfono',
      type: 'text',
      placeholder: 'Buscar por teléfono'
    },
    {
      name: 'email',
      label: 'Correo electrónico',
      type: 'text',
      placeholder: 'Buscar por correo electrónico'
    }
  ];

  ngOnInit(): void {
    this.loadUsers();
    this._getDataForFields();
    this.projectId = this._activatedRoute.snapshot.params?.['email'];
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationResults.perPage = 5;
  }

  private _getDataForFields(): void {
    this._usersService.createUsersRelatedData().subscribe({
      next: (res) => {
        // Roles
        const roles = res.data?.roles || [];
        const identificationTypes = res.data?.identificationTypes || [];
        const roleOption = this.searchFields.find(
          (field) => field.name === 'roleId'
        );
        const identificationTypeOption = this.searchFields.find(
          (field) => field.name === 'identificationTypeId'
        );

        if (roleOption) {
          roleOption.options = roles.map((role) => ({
            value: role.id,
            label: role.name || ''
          }));
        }
        if (identificationTypeOption) {
          identificationTypeOption.options = identificationTypes.map(
            (type) => ({
              value: type.id,
              label: type.type || ''
            })
          );
        }
      }
    });
  }

  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadUsers();
  }

  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadUsers();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(values: any): void {
    this.showClearButton = !!values.length;
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

  loadUsers(filter: string = ''): void {
    this.loading = true; // Inicia el estado de carga
    const query = {
      page: this.currentPage + 1,
      perPage: this.pageSize,
      search: filter,
      ...this.params
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res: ApiResponseInterface<UsersInterface[]>) => {
        this.dataSource.data = res.data || [];
        this.totalItems = res.pagination?.total || 0;
        this.paginator.length = this.totalItems;
        this.loading = false; // Detén la carga al terminar
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false; // Detén la carga en caso de error
      }
    });
  }

  private _deleteUser(id: string): void {
    this.loading = true; // Establecer loading a true para mostrar indicador de carga
    this._usersService.deleteUser(id).subscribe({
      next: () => {
        // Recargar usuarios después de la eliminación
        this.loadUsers();
        this.loading = false; // Desactivar el indicador de carga
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false; // Asegurarse de desactivar el loading en caso de error
      }
    });
  }

  openDeleteUserDialog(id: string): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this._deleteUser(id);
      }
    });
  }
}
