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

@Injectable({ providedIn: 'root' })
export class TasksService {
  private _httpClient: HttpClient = inject(HttpClient);

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
}
