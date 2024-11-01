import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { HttpUtilitiesService } from '../utilities/http-utilities.service';
import { ApiResponseInterface } from '../interfaces/api-response.interface';
import { Observable } from 'rxjs';
import { CommentsInterface } from '../interfaces/comments.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getComments(
    rowId: string,
    rowTable: string
  ): Observable<ApiResponseInterface<CommentsInterface[]>> {
    const params = this._httpUtilities.httpParamsFromObject({
      rowId,
      rowTable
    });
    return this._httpClient.get<ApiResponseInterface<CommentsInterface[]>>(
      `${environment.apiUrl}comments`,
      { params }
    );
  }

  addComment(body: {
    rowId: number;
    rowTable: string;
    content: string;
  }): Observable<unknown> {
    return this._httpClient.post<unknown>(`${environment.apiUrl}comments`, {
      content: body.content,
      rowId: body.rowId,
      rowTable: body.rowTable
    });
  }

  deleteComment(id: number): Observable<unknown> {
    return this._httpClient.delete<unknown>(
      `${environment.apiUrl}comments/${id}`
    );
  }
}
