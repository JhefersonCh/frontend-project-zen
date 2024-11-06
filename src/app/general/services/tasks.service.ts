import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import {
  CreateTaskInterface,
  TasksInterface,
  TasksRelatedData
} from '../interfaces/tasks.interface';
import { environment } from '../../../environments/environment';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { PaginationInterface } from '../../shared/interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _httpUtilities: HttpUtilitiesService = inject(HttpUtilitiesService);

  getRelatedData(): Observable<ApiResponseInterface<TasksRelatedData>> {
    return this._httpClient.get<ApiResponseInterface<TasksRelatedData>>(
      `${environment.apiUrl}tasks/related-data`
    );
  }

  createTask(
    task: CreateTaskInterface
  ): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}tasks/create`,
      task
    );
  }

  getByProjectId(
    projectId: number
  ): Observable<ApiResponseInterface<TasksInterface[]>> {
    return this._httpClient.get<ApiResponseInterface<TasksInterface[]>>(
      `${environment.apiUrl}tasks/find-by-project/${projectId}`
    );
  }

  getByMemberId(
    memberId: number,
    projectId: number
  ): Observable<ApiResponseInterface<TasksInterface[]>> {
    const params = this._httpUtilities.httpParamsFromObject({
      memberId,
      projectId
    });
    return this._httpClient.get<ApiResponseInterface<TasksInterface[]>>(
      `${environment.apiUrl}tasks/find-by-member`,
      { params }
    );
  }

  updateManyStatuses(
    tasks: { statusId: number; id: number }[]
  ): Observable<unknown> {
    return this._httpClient.post<unknown>(
      `${environment.apiUrl}tasks/update-statuses`,
      { tasks }
    );
  }

  updateTask(task: object): Observable<unknown> {
    return this._httpClient.patch<unknown>(
      `${environment.apiUrl}tasks/update`,
      task
    );
  }

  deleteTask(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${environment.apiUrl}tasks/${id}`);
  }

  tasksWithPagination(query: object): Observable<{
    pagination: PaginationInterface;
    data: TasksInterface[];
  }> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<{
      pagination: PaginationInterface;
      data: TasksInterface[];
    }>(`${environment.apiUrl}tasks/paginated-list`, { params });
  }
}
