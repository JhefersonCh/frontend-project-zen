import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../../shared/interfaces/api-response.interface';
import { HttpUtilitiesService } from '../../../shared/utilities/http-utilities.service';
import { environment } from '../../../../environments/environment';
import {
  RelatedDataResponse,
  UsersInterface
} from '../interfaces/users.interface';
import { RegisterUserInterface } from '../../../auth/interfaces/register.interface';
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getUserWithPagination(query: object): Observable<{
    pagination: PaginationInterface;
    data: UsersInterface[];
  }> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<{
      pagination: PaginationInterface;
      data: UsersInterface[];
    }>(`${environment.apiUrl}user/paginated-list`, { params });
  }

  createUsersRelatedData(): Observable<
    ApiResponseInterface<RelatedDataResponse>
  > {
    return this._httpClient.get<ApiResponseInterface<RelatedDataResponse>>(
      `${environment.apiUrl}user/create/related-data`
    );
  }

  createUser(
    user: RegisterUserInterface
  ): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}user/create`,
      user
    );
  }

  deleteUser(userId: string): Observable<unknown> {
    return this._httpClient.delete(`${environment.apiUrl}user/${userId}`);
  }

  updateUser(userId: string, body: unknown): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}user/${userId}`,
      body
    );
  }
}
