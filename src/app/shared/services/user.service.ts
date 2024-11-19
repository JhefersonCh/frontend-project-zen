import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
//import { HttpUtilitiesService } from '../utilities/http-utilities.service';
import { Observable } from 'rxjs';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../interfaces/api-response.interface';
import { RegisterUserInterface } from '../../auth/interfaces/register.interface';
import { environment } from '../../../environments/environment.development';
import { ChangePassword, UserInterface } from '../interfaces/user.interface';
import { IdentificationType } from '../../organizational/users/interfaces/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  //private readonly _httpUtilities: HttpUtilitiesService = inject(HttpUtilitiesService);

  register(
    user: RegisterUserInterface
  ): Observable<ApiResponseCreateInterface> {
    // const params = this._httpUtilities.httpParamsFromObject(user);
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}user/register`,
      user
    );
  }

  registerRelatedData(): Observable<
    ApiResponseInterface<{ identificationTypes: IdentificationType[] }>
  > {
    return this._httpClient.get<
      ApiResponseInterface<{ identificationTypes: IdentificationType[] }>
    >(`${environment.apiUrl}user/register/related-data`);
  }

  getUserProfile(
    userId: string
  ): Observable<ApiResponseInterface<UserInterface>> {
    return this._httpClient.get<ApiResponseInterface<UserInterface>>(
      `${environment.apiUrl}user/${userId}`
    );
  }

  updateUserProfile(userId: string, body: unknown): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}user/${userId}`,
      body
    );
  }

  updateUserPassword(
    changePasswordPayload: ChangePassword
  ): Observable<ApiResponseInterface<ChangePassword>> {
    return this._httpClient.post<ApiResponseInterface<ChangePassword>>(
      `${environment.apiUrl}/api/user/change-password`,
      changePasswordPayload
    );
  }
}
