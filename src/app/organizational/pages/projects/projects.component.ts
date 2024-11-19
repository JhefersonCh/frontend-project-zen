/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import {
  ActionInterface,
  SearchField,
  SearchResult
} from '../../../shared/interfaces/search.interface';
import { ProjectsService } from '../../../general/services/projects.service';
import { UsersService } from '../../users/services/users.service';
import { UsersInterface } from '../../users/interfaces/users.interface';
import { MatButtonModule } from '@angular/material/button';
import {
  PaginationInterface,
  ParamsPaginationInterface
} from '../../../shared/interfaces/pagination.interface';
import { finalize } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProjectInterface } from '../../../general/interfaces/projects.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsDialogComponent } from '../../components/item-details-dialog/item-details-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    BasePageComponent,
    SearchFieldsComponent,
    SearchResultsComponent,
    MatButtonModule,
    MatPaginatorModule,
    LoaderComponent,
    MatTabsModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;
  private _projectsService: ProjectsService = inject(ProjectsService);
  private _usersService: UsersService = inject(UsersService);
  private _dialog: MatDialog = inject(MatDialog);

  showClearButton: boolean = false;
  results: ProjectInterface[] = [];
  loading: boolean = false;
  paginationParams: ParamsPaginationInterface = {
    order: 'ASC',
    page: 1,
    perPage: 10
  };
  isMobile: boolean = false;
  paginationResults: PaginationInterface = {
    page: 1,
    perPage: 10,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };
  params: object = {};

  searchFields: SearchField[] = [
    {
      name: 'title',
      label: 'Título',
      type: 'text'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text'
    },
    {
      name: 'createdAt',
      label: 'Fecha de creación',
      type: 'dateRange'
    },
    {
      name: 'user',
      label: 'Usuario asignado',
      type: 'autocomplete',
      autocompleteOptions: [],
      displayWith: (user: UsersInterface) => user.fullName,
      onAutocompleteChange: (value: any) => {
        this._getUsers(value);
      }
    }
  ];

  searchActions: ActionInterface[] = [
    {
      label: 'Eliminar',
      icon: 'delete',
      action: (item?: SearchResult) => {
        this._openDeleteDialog(item || {});
      }
    },
    {
      label: 'Ver',
      icon: 'visibility',
      action: (item?: SearchResult) => {
        this._openDetailsDialog(item || {});
      }
    }
  ];

  constructor() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this._getPaginatedList();
    this._getUsers();
  }

  public onSearchChange(values: any): void {
    if (values.length) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }

  private _openDeleteDialog(project: SearchResult): void {
    const dialogRef = this._dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Eliminar proyecto',
        message: '¿Estás seguro de querer eliminar este proyecto?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._deleteProject(project.id as number);
      }
    });
  }

  private _openDetailsDialog(project: SearchResult): void {
    this._dialog.open(ItemDetailsDialogComponent, {
      data: { item: project }
    });
  }

  private _deleteProject(projectId: number): void {
    this._projectsService.deleteProject(projectId).subscribe({
      next: () => this._getPaginatedList(),
      error: (error) => console.error(error)
    });
  }

  public onSearchSubmit(values: any): void {
    const { user, ...remainingValues } = values;

    const queryParams = {
      ...remainingValues,
      createdAtEnd: values.createdAtEnd.toString(),
      createdAtInit: values.createdAtInit.toString(),
      userId: user?.id || null
    };

    this.params = queryParams;
    this._getPaginatedList();
  }

  private _getPaginatedList(): void {
    this.loading = true;
    this._projectsService
      .getProjectsWithPagination({
        ...this.params,
        ...this.paginationParams
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.results = res?.data || [];
          this.paginationResults = res.pagination;
        },
        error: (error) => console.error(error)
      });
  }

  private _getUsers(search: string = ''): void {
    this._usersService.getUserWithPagination({ search }).subscribe({
      next: (res) => {
        const users: UsersInterface[] = res?.data || [];
        const option = this.searchFields.find((field) => field.name === 'user');
        option!.autocompleteOptions = users;
      }
    });
  }

  onChangePagination(pageEvent: PageEvent): void {
    this.paginationParams.perPage = pageEvent.pageSize;
    this.paginationParams.page = pageEvent.pageIndex + 1;
    this._getPaginatedList();
  }

  selectedTabIndex = 0;
  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
}
