import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import {
  CreateProjectInterface,
  ProjectInterface,
  ProjectRelatedData
} from '../interfaces/projects.interface';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { PaginationInterface } from '../../shared/interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private _httpClient: HttpClient = inject(HttpClient);
  private _httpUtilities: HttpUtilitiesService = inject(HttpUtilitiesService);

  getProjectsByUser(): Observable<ApiResponseInterface<ProjectInterface[]>> {
    return this._httpClient.get<ApiResponseInterface<ProjectInterface[]>>(
      `${environment.apiUrl}projects/byUser`
    );
  }

  getRelatedData(): Observable<ApiResponseInterface<ProjectRelatedData>> {
    return this._httpClient.get<ApiResponseInterface<ProjectRelatedData>>(
      `${environment.apiUrl}projects/related-data`
    );
  }

  createProject(
    body: CreateProjectInterface
  ): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}projects`,
      body
    );
  }

  updateProject(body: CreateProjectInterface): Observable<void> {
    return this._httpClient.patch<void>(`${environment.apiUrl}projects`, body);
  }

  deleteProject(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${environment.apiUrl}projects/${id}`);
  }

  getProjectById(
    id: number
  ): Observable<ApiResponseInterface<ProjectInterface>> {
    return this._httpClient.get<ApiResponseInterface<ProjectInterface>>(
      `${environment.apiUrl}projects/${id}`
    );
  }

  getProjectsWithPagination(
    query: object
  ): Observable<{ data: ProjectInterface[]; pagination: PaginationInterface }> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<{
      data: ProjectInterface[];
      pagination: PaginationInterface;
    }>(`${environment.apiUrl}projects/paginated-list`, { params });
  }
}
