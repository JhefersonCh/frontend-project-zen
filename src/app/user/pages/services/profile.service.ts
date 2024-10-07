import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../../shared/interfaces/api-response.interface';
import { ProfileInterface } from '../../interfaces/profile.interfaces';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}
  private readonly _httpClient: HttpClient = inject(HttpClient);

    getUserProfile(credentials: ProfileInterface): Observable<ApiResponseInterface<ProfileInterface>> {
      
        const params = new HttpParams()
          .set('id', credentials.id)
          .set('email', credentials.email)
    
        return this._httpClient.post<ApiResponseInterface<ProfileInterface>>(
          `${environment.apiUrl}user/profile`,
          params
        );
      }

  updateUserProfile(
    updatedUser: ProfileInterface
  ): Observable<ApiResponseInterface<ProfileInterface>> {
    return this.httpClient.put<ApiResponseInterface<ProfileInterface>>(
      `${environment.apiUrl}user/update`,
      updatedUser
    );
  }
}
