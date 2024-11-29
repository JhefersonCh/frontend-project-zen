import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChartOptions } from '../../shared/interfaces/charts.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtulities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getProjectsTimeReport(query: {
    startDate: string;
    endDate: string;
  }): Observable<{ time: Partial<ChartOptions> }> {
    const params = this._httpUtulities.httpParamsFromObject(query);
    return this._httpClient.get<{ time: Partial<ChartOptions> }>(
      `${environment.apiUrl}reports/projects-time`,
      { params }
    );
  }
}
