import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
/**
 * Para guardar el historial de las urls visitadas
 * Para desplazar hacia atras
 */
export class PreviousUrlService {
  private _history: string[] = [];

  constructor(private _router: Router, private _location: Location) {
    this._router.events.subscribe((event): void => {
      if (event instanceof NavigationEnd) {
        this._history.push(event.urlAfterRedirects);
      }
    });
  }

  back(): void {
    this._history.pop();
    if (this._history.length > 0) {
      this._location.back();
      return;
    }
    this._router.navigateByUrl('/');
  }
}
