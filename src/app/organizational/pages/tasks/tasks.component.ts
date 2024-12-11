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
import { TasksService } from '../../../general/services/tasks.service';
import { UsersService } from '../../users/services/users.service';
import { UsersInterface } from '../../users/interfaces/users.interface';
import { ProjectInterface } from '../../../general/interfaces/projects.interface';
import { MatButtonModule } from '@angular/material/button';
import {
  PaginationInterface,
  ParamsPaginationInterface
} from '../../../shared/interfaces/pagination.interface';
import { finalize } from 'rxjs';
import { TasksInterface } from '../../../general/interfaces/tasks.interface';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { ItemDetailsDialogComponent } from '../../components/item-details-dialog/item-details-dialog.component';

@Component({
  selector: 'app-tasks',
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
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;
  private _projectsService: ProjectsService = inject(ProjectsService);
  private _tasksService: TasksService = inject(TasksService);
  private _usersService: UsersService = inject(UsersService);
  private _dialog: MatDialog = inject(MatDialog);

  showClearButton: boolean = false;
  results: TasksInterface[] = [];
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
      name: 'statusId',
      label: 'Estado',
      type: 'select',
      options: []
    },
    {
      name: 'priorityId',
      label: 'Prioridad',
      type: 'select',
      options: []
    },
    {
      name: 'date',
      label: 'Fecha de creación',
      type: 'dateRange'
    },
    {
      name: 'user',
      label: 'Usuario asignado',
      type: 'autocomplete',
      autocompleteOptions: [],
      displayWith: (user?: UsersInterface) => user?.fullName || '',
      onAutocompleteChange: (value: any) => {
        this._getUsers(value);
      }
    },
    {
      name: 'project',
      label: 'Proyecto',
      type: 'autocomplete',
      autocompleteOptions: [],
      displayWith: (project?: ProjectInterface) => project?.title || '',
      onAutocompleteChange: (value: any) => {
        this._getProjects(value);
      }
    }
  ];
  searchActions: ActionInterface[] = [
    {
      label: 'Eliminar',
      icon: 'delete',
      action: (item?: SearchResult) => this._openDeleteDialog(item || {})
    },
    {
      label: 'Ver',
      icon: 'visibility',
      action: (item?: SearchResult) => this._openDetailsDialog(item || {})
    }
  ];

  constructor() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngOnInit(): void {
    this._getPaginatedList();
    this._getSelectOptions();
    this._getUsers();
    this._getProjects();
  }

  private _openDeleteDialog(item: SearchResult): void {
    const dialogRef = this._dialog.open(YesNoDialogComponent, {
      data: {
        title: 'Eliminar tarea',
        message: '¿Estás seguro de querer eliminar esta tarea?'
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this._deleteTask(item.id as number);
    });
  }

  private _openDetailsDialog(item: SearchResult): void {
    this._dialog.open(ItemDetailsDialogComponent, {
      data: { item }
    });
  }

  private _deleteTask(taskId: number): void {
    this._tasksService.deleteTask(taskId).subscribe({
      next: () => this._getPaginatedList(),
      error: (error) => console.error(error)
    });
  }

  public onSearchChange(values: any): void {
    if (values.length) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }

  public onSearchSubmit(values: any): void {
    const { user, project, ...remainingValues } = values;

    const queryParams = {
      ...remainingValues,
      dateEnd: values.dateEnd?.toString(),
      dateInit: values.dateInit?.toString(),
      userId: user?.id || null,
      projectId: project?.id || null
    };

    this.params = queryParams;
    this._getPaginatedList();
  }

  private _getPaginatedList(): void {
    this.loading = true;
    this._tasksService
      .tasksWithPagination({
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

  private _getSelectOptions(): void {
    this._projectsService.getProjectsByUser().subscribe({
      next: (res) => {
        const projects = res?.data || [];
        const option = this.searchFields.find(
          (field) => field.name === 'project'
        );
        projects.map((project) => {
          option?.options?.push({ value: project.id, label: project.title });
        });
      },
      error: (error) => console.error(error)
    });
    this._tasksService.getRelatedData().subscribe({
      next: (res) => {
        const priorities = res?.data.priorities || [];
        const statuses = res?.data.statuses || [];
        const priorityOption = this.searchFields.find(
          (field) => field.name === 'priorityId'
        );
        const statusOption = this.searchFields.find(
          (field) => field.name === 'statusId'
        );
        priorities.map((priority) => {
          priorityOption?.options?.push({
            value: priority.id,
            label: priority.title
          });
        });
        statuses.map((status) => {
          statusOption?.options?.push({
            value: status.id,
            label: status.title
          });
        });
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

  private _getProjects(search: string = ''): void {
    this._projectsService
      .getProjectsWithPagination({ title: search })
      .subscribe({
        next: (res) => {
          const projects: ProjectInterface[] = res?.data || [];
          const option = this.searchFields.find(
            (field) => field.name === 'project'
          );
          option!.autocompleteOptions = projects;
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
