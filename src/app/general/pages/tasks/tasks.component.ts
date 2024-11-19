/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import {
  ActionInterface,
  SearchField,
  SearchResult
} from '../../../shared/interfaces/search.interface';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsService } from '../../services/projects.service';
import { TasksService } from '../../services/tasks.service';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { AuthService } from '../../../auth/services/auth.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { finalize } from 'rxjs';
import {
  PaginationInterface,
  ParamsPaginationInterface
} from '../../../shared/interfaces/pagination.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    BasePageComponent,
    SearchFieldsComponent,
    MatButtonModule,
    SearchResultsComponent,
    LoaderComponent,
    MatTabsModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent implements OnInit {
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;
  private readonly _projectsService: ProjectsService = inject(ProjectsService);
  private readonly _tasksService: TasksService = inject(TasksService);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _router: Router = inject(Router);
  searchFields: SearchField[] = [
    {
      name: 'title',
      label: 'Título',
      type: 'text',
      placeholder: 'Buscar por título'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      placeholder: 'Buscar por descripción'
    },
    {
      name: 'projectId',
      label: 'Proyecto',
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
      name: 'statusId',
      label: 'Estado',
      type: 'select',
      options: []
    },
    {
      name: 'date',
      label: 'Fecha de creación',
      type: 'dateRange'
    }
  ];
  searchActions: ActionInterface[] = [
    {
      label: 'Ir a la tarea',
      icon: 'link',
      action: (item?: SearchResult) => {
        this._router.navigate(['/general/projects', item?.projectId], {
          queryParams: { taskId: item?.id, previusUrl: '../../tasks' }
        });
      }
    }
  ];
  results: SearchResult[] = [];
  showClearButton: boolean = false;
  searchForm!: FormGroup;
  userId: string = '';
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

  selectedTabIndex = 0;

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationResults.perPage = 5;
  }

  ngOnInit(): void {
    this.userId = this._authService.getUserLoggedIn()?.id || '';
    this._getDataForFields();
    this._getPaginatedList();
  }

  private _getDataForFields(): void {
    this._projectsService.getProjectsByUser().subscribe({
      next: (res) => {
        const projects = res?.data || [];
        const option = this.searchFields.find(
          (field) => field.name === 'projectId'
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

  onSearchSubmit(values: any): void {
    this.params = values;
    this._getPaginatedList();
  }

  onSearchChange(values: any): void {
    if (values.length) {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }

  private _getPaginatedList(): void {
    this.loading = true;
    this._tasksService
      .tasksWithPagination({
        ...this.params,
        userId: this.userId,
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

  onChangePagination(pageEvent: PageEvent): void {
    this.paginationParams.perPage = pageEvent.pageSize;
    this.paginationParams.page = pageEvent.pageIndex + 1;
    this._getPaginatedList();
  }

  onTabChange(index: number) {
    this.selectedTabIndex = index;
  }
}
