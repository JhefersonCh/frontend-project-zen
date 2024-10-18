import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../shared/interfaces/api-response.interface';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { environment } from '../../../environments/environment';
import { UsersInterface } from '../interfaces/users.interface';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getUserWithPagination(
    query: object
  ): Observable<ApiResponseInterface<UsersInterface[]>> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<ApiResponseInterface<UsersInterface[]>>(
      `${environment.apiUrl}user/paginated-list`,
      { params }
    );
  }
}
