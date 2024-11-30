/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
import { SearchField } from '../../../../shared/interfaces/search.interface';
import { SearchFieldsComponent } from '../../../../shared/components/search-fields/search-fields.component';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { PaginationInterface } from '../../../../shared/interfaces/pagination.interface';
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
    MatTabGroup
  ],
  templateUrl: './see-users.component.html',
  styleUrls: ['./see-users.component.scss']
})
export class SeeUsersComponent implements OnInit {
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
  projectId: string = '';
  showClearButton: boolean = false;
  loading: boolean = false;
  isMobile: boolean = false;
  params: any = {};
  selectedTabIndex: number = 0;
  paginationParams: PaginationInterface = {
    page: 1,
    perPage: 5,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  subtitle: string = 'Gestiona los miembros registrados en la aplicación';

  /**
   * @param searchFields - Creación del buscador.
   */
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

  /**
   * @param ngOnInit - Inicialización de las funciones.
   */
  ngOnInit(): void {
    this.loadUsers();
    this._getDataForFields();
    this.projectId = this._activatedRoute.snapshot.params?.['email'];
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
  }

  /**
   * @param _getDataForFields - Obtiene los select de roles y tipos de identificación.
   */
  private _getDataForFields(): void {
    this._usersService.createUsersRelatedData().subscribe({
      next: (res) => {
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

  /**
   * @param onSearchSubmit - Botón de búsqueda.
   */
  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadUsers();
  }

  /**
   * @param onChangePagination - Cambio de paginación.
   */
  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadUsers();
  }

  /**
   * @param onTabChange - Cambio de tabla.
   */
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(values: any): void {
    this.showClearButton = !!values.length;
  }

  /**
   * @param goToCreateUser - Ir a crear usuarios
   */
  goToCreateUser(): void {
    this._router.navigate(['/users/create']);
  }

  /**
   * @param loadUsers - Carga de usuarios.
   * @param getUserWithPagination - Obtiene los usuarios con paginación.
   */
  loadUsers(filter: string = ''): void {
    this.loading = true;
    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...this.params
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res) => {
        this.dataSource.data = res.data || [];
        this.paginationParams = res?.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param _deleteUser - Ellimina un usuario.
   */
  private _deleteUser(id: string): void {
    this.loading = true;
    this._usersService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param openDeleteUserDialog - Abre un modal para eliminar un usuario.
   */
  openDeleteUserDialog(id: string): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent);

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this._deleteUser(id);
      }
    });
  }
}
