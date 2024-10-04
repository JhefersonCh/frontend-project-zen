/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  inject,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { LocalStorageService } from '../../../shared/services/localStorage.service';
import { LogOutInterface } from '../../../auth/interfaces/logout.interface';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, NgClass, NgIf],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnChanges, OnDestroy {
  isLoggedUser: boolean = false;
  router: Router = inject(Router);
  private _authService: AuthService = inject(AuthService);
  private _localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private _subscription: Subscription = new Subscription();
  isMenuOpen = false;
  optionSelected: string = '';
  module: string[] = [];
  isLoading: boolean = true;

  ngOnInit(): void {
    this._subscription.add(
      this._authService._isLoggedSubject.subscribe((isLogged) => {
        this.isLoggedUser = isLogged;
        this.isLoading = false;
      })
    );
    this.isLoggedUser = this._authService.isAuthenticated();
    this.isLoading = false;
    this.module = this.router.url.split('/');
    this.optionSelected = this.module[1];

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.module = this.router.url.split('/');
        this.optionSelected = this.module[1];
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['isLoggedUser']) {
      this.router.navigate(['auth/login']);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe(); // Limpiar la suscripción
  }

  /**
   * Alterna el estado del menú de navegación entre abierto y cerrado.
   * Cambia el valor de isMenuOpen.
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Cierra el menú de navegación.
   * Establece isMenuOpen en false.
   */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Gestiona la acción del usuario en función de su estado de logueo.
   * Si el usuario no está logueado, lo redirige a la página de inicio de sesión.
   * Si el usuario está logueado, emite un evento de cierre de sesión y lo redirige a la página de inicio.
   */
  manageUser(): void {
    if (!this.isLoggedUser) {
      this.router.navigateByUrl('/auth/login');
    } else {
      const allSessionData = this._localStorageService.getAllSessionData();
      const sessionDataToLogout: LogOutInterface = {
        userId: allSessionData?.user.id || '',
        accessToken: allSessionData?.tokens.accessToken || '',
        accessSessionId: allSessionData?.session.accessSessionId || ''
      };
      this._authService.logout(sessionDataToLogout).subscribe();
    }
  }
}
