import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ApiResponseInterface } from '../../shared/interfaces/api-response.interface';
import { ProjectInterface } from '../interfaces/projects.interface';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private _httpClient: HttpClient = inject(HttpClient);

  getProjects(): Observable<ApiResponseInterface<ProjectInterface[]>> {
    return this._httpClient.get<ApiResponseInterface<ProjectInterface[]>>(
      `${environment.apiUrl}projects/byUser`
    );
  }
}
