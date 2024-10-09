// profile.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../../shared/interfaces/api-response.interface';
import { UserInterface } from '../interfaces/test.interface';
import { environment } from '../../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class TestService {

  private readonly _httpClient: HttpClient = inject(HttpClient);

  getUserProfile(userId: string): Observable<ApiResponseInterface<UserInterface>> {
    return this._httpClient.get<ApiResponseInterface<UserInterface>>(`${environment.apiUrl}user/${userId}`);
  }
  
}
