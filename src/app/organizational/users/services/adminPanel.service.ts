import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { HttpUtilitiesService } from '../../../shared/utilities/http-utilities.service';
import { Observable, of } from 'rxjs';
import { ApiResponseInterface } from '../../../shared/interfaces/api-response.interface';
import { environment } from '../../../../environments/environment';
import { AdminPanelElementInterface } from '../../interfaces/admin-panel.interface';
import { elements } from '../../constants/admin-panel.constant';

@Injectable({ providedIn: 'root' })
export class AdminPanelService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _elements = elements;

  //   private readonly _httpUtilities: HttpUtilitiesService =
  //     inject(HttpUtilitiesService);

  getAdminPanelInfo(): Observable<
    ApiResponseInterface<AdminPanelElementInterface>
  > {
    return this._httpClient.get<
      ApiResponseInterface<AdminPanelElementInterface>
    >(`${environment.apiUrl}panel`);
  }

  createElement(
    body: object,
    element: string
  ): Observable<ApiResponseInterface<unknown>> {
    if (!this._elements[element]) return of();
    return this._httpClient.post<ApiResponseInterface<unknown>>(
      `${environment.apiUrl}panel/${this._elements[element]}`,
      body
    );
  }
}
