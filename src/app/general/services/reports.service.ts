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
      `${environment.apiUrl}reports/projects/time`,
      { params }
    );
  }
  getProjectVsReport(): Observable<{ vs: Partial<ChartOptions> }> {
    return this._httpClient.get<{ vs: Partial<ChartOptions> }>(
      `${environment.apiUrl}reports/projects/vs`
    );
  }
  getTasksTimeReport(query: {
    startDate: string;
    endDate: string;
  }): Observable<{ time: Partial<ChartOptions> }> {
    const params = this._httpUtulities.httpParamsFromObject(query);
    return this._httpClient.get<{ time: Partial<ChartOptions> }>(
      `${environment.apiUrl}reports/tasks/time`,
      { params }
    );
  }

  getTasksByStatusReport(): Observable<{ status: Partial<ChartOptions> }> {
    return this._httpClient.get<{ status: Partial<ChartOptions> }>(
      `${environment.apiUrl}reports/tasks/by-status`
    );
  }

  getMembersByProjectReport(): Observable<{
    byProject: Partial<ChartOptions>;
  }> {
    return this._httpClient.get<{ byProject: Partial<ChartOptions> }>(
      `${environment.apiUrl}reports/members/project`
    );
  }

  getMembersProgressReport(projectId: number): Observable<{
    percentAdvance: {
      series: string[];
      labels: string[];
      title: {
        text: string;
        align: string;
        margin: number;
        style: { fontSize: string };
      };
    };
  }> {
    const params = this._httpUtulities.httpParamsFromObject({ projectId });
    return this._httpClient.get<{
      percentAdvance: {
        series: string[];
        labels: string[];
        title: {
          text: string;
          align: string;
          margin: number;
          style: { fontSize: string };
        };
      };
    }>(`${environment.apiUrl}reports/members/progress`, { params });
  }
}
