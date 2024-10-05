import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpUtilitiesService } from '../utilities/http-utilities.service';
import { Observable } from 'rxjs';
import { ApiResponseCreateInterface } from '../interfaces/api-response.interface';
import { RegisterUserInterface } from '../../auth/interfaces/register.interface';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService = inject(HttpUtilitiesService);
  
  registrer(user: RegisterUserInterface): Observable<ApiResponseCreateInterface> {
    const params = this._httpUtilities.httpParamsFromObject(user);    
    return this._httpClient.post<ApiResponseCreateInterface>(`${environment.apiUrl}user/register`, params);
  }
}
