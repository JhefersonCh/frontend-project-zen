import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(
    private _iconRegistry: MatIconRegistry,
    private _router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._setMaterialOutlinedIconsDefault();
    this._listenRouterChanges();
  }

  /**
   * Para definir el uso de iconos tipo outlined en la App de manera global
   * @private
   */
  private _setMaterialOutlinedIconsDefault(): void {
    const defaultFontSetClasses = this._iconRegistry.getDefaultFontSetClass();
    const outlinedFontSetClasses = defaultFontSetClasses
      .filter(
        (fontSetClass: string): boolean => fontSetClass !== 'material-icons'
      )
      .concat(['material-icons-outlined']);
    this._iconRegistry.setDefaultFontSetClass(...outlinedFontSetClasses);
  }

  /**
   * Para escuchar los cambios de rutas
   * @private
   */
  private _listenRouterChanges(): void {
    this._router.events.subscribe((event): void => {
      if (event instanceof NavigationEnd) {
        this._setScrollOnTop();
      }
    });
  }

  /**
   * Para mover el scroll al inicio de la pagina
   * @private
   */
  private _setScrollOnTop(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
