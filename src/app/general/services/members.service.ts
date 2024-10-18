import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import { MembersRelatedDataInterface } from '../interfaces/members.interface';

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
}
