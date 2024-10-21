// profile.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../shared/interfaces/api-response.interface';
import { environment } from '../../../environments/environment.development';
import { InterfaceUserRole } from '../interfaces/test.interface';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

    rolUser(
      user: InterfaceUserRole
    ): Observable<ApiResponseInterface<InterfaceUserRole>> {
      // const params = this._httpUtilities.httpParamsFromObject(user);
      return this._httpClient.post<ApiResponseInterface<InterfaceUserRole>>(
        `${environment.apiUrl}user/create`,
        user
      );
    }
}
