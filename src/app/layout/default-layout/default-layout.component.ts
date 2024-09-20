import { FooterComponent } from './../components/footer/footer.component';
import { Component } from '@angular/core';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [NavBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.css'
})
export class DefaultLayoutComponent {
  /**
   * Verifica si el usuario está logueado comprobando la existencia del token en localStorage.
   *
   * - Retorna true si el usuario está logueado, de lo contrario false.
   */
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('_appUser');
    }
    return false;
  }

  /**
   * Cierra la sesión del usuario eliminando el token de localStorage.
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('_appUser');
    }
  }

  /**
   * Obtiene la información del usuario almacenada en localStorage.
   *
   * - Retorna la información del usuario como objeto si existe, de lo contrario null.
   */
  getUserInfo() {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('_appUser')!);
    }
    return null;
  }
}
