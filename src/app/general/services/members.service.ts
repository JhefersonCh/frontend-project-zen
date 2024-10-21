import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import { MembersRelatedDataInterface } from '../interfaces/members.interface';
import { Members } from '../interfaces/projects.interface';

@Injectable({ providedIn: 'root' })
export class MembersService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  getRelatedData(): Observable<
    ApiResponseInterface<MembersRelatedDataInterface>
  > {
    return this._httpClient.get<
      ApiResponseInterface<MembersRelatedDataInterface>
    >(`${environment.apiUrl}members/related-data`);
  }

  createMember(body: {
    projectId: number;
    userId: string;
    projectRoleId: number;
  }): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}members/add-member`,
      body
    );
  }

  getMembersByProjectId(
    projectId: number
  ): Observable<ApiResponseInterface<Members[]>> {
    return this._httpClient.get<ApiResponseInterface<Members[]>>(
      `${environment.apiUrl}members/by-project/${projectId}`
    );
  }

  updateMember(body: {
    projectId: number;
    userId: string;
    projectRoleId: number;
    id: number;
  }): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}members/update-member`,
      body
    );
  }

  deleteMember(id: number, projectId: number): Observable<void> {
    return this._httpClient.delete<void>(
      `${environment.apiUrl}members/remove-member/${id}/${projectId}`
    );
  }
}
