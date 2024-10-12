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

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private _httpClient: HttpClient = inject(HttpClient);

  getProjects(): Observable<ApiResponseInterface<ProjectInterface[]>> {
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
}
