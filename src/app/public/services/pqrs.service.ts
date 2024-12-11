import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PqrsService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  sendPqr(data: {
    email: string;
    name: string;
    description: string;
  }): Observable<{ httpStatus: number; message: string }> {
    return this._httpClient.post<{ httpStatus: number; message: string }>(
      `${environment.apiUrl}pqrs/send-pqr`,
      data
    );
  }
}
