import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../../shared/interfaces/api-response.interface';
import { StatisticsInterface } from '../interfaces/profile.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  getStatistics(): Observable<ApiResponseInterface<StatisticsInterface>> {
    return this._httpClient.get<ApiResponseInterface<StatisticsInterface>>(
      `${environment.apiUrl}profile/statistics`
    );
  }
}
