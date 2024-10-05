import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../../shared/interfaces/api-response.interface';
import { ProfileInterface } from '../../interfaces/profile.interfaces';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {} // Inyección de HttpClient

  getUserProfile(userId: string): Observable<ApiResponseInterface<ProfileInterface>> {
    return this.httpClient.get<ApiResponseInterface<ProfileInterface>>(`${environment.apiUrl}user/${userId}`);
  }

  updateUserProfile(updatedUser: ProfileInterface): Observable<ApiResponseInterface<ProfileInterface>> {
    return this.httpClient.put<ApiResponseInterface<ProfileInterface>>(`${environment.apiUrl}user/update`, updatedUser);
  }
}
