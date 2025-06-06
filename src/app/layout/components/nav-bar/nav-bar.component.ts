/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  inject,
  Input,
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
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../shared/services/user.service';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    NgIf,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    LoaderComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnChanges, OnDestroy {
  @Input() userName?: string;
  userImage: string | null;
  isLoggedUser: boolean = false;
  router: Router = inject(Router);
  pageLoading: boolean = true;
  user?: UserInterface;
  isLoading = true;
  userId: string = '';

  private readonly _profileService: UserService = inject(UserService);
  private _authService: AuthService = inject(AuthService);
  private _localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private _subscription: Subscription = new Subscription();
  isMenuOpen: boolean = false;
  optionSelected: string = '';
  module: string[] = [];
  isMobile: boolean = false;

  constructor() {
    this.userImage = null;
  }

  ngOnInit(): void {
    this._subscription.add(
      this._authService._isLoggedSubject.subscribe((isLogged) => {
        this.isLoggedUser = isLogged;
        if (this.isLoggedUser) {
          this.loadUserProfile();
        }
      })
    );
    this.isLoggedUser = this._authService.isAuthenticated();
    this.module = this.router.url.split('/');
    this.optionSelected = this.module[1];

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.module = this.router.url.split('/');
        this.optionSelected = this.module[1];
        this.isLoggedUser = this._authService.isAuthenticated();
        if (this.isLoggedUser) {
          this.loadUserProfile();
        }
      });
    if (this.isLoggedUser) {
      this.loadUserProfile();
    }
  }

  loadUserProfile(): void {
    this.userId = this._localStorageService.getAllSessionData()?.user?.id;

    if (!this.user) {
      this.userId &&
        this._profileService.getUserProfile(this.userId).subscribe({
          next: (response) => {
            this.user = response?.data;
            this.pageLoading = false;
          },
          error: (error) => {
            console.error('Error al cargar el usuario', error);
            this.pageLoading = false;
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.['isLoggedUser']) {
      this.router.navigate(['auth/login']);
    }
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
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
  manageAuthButton(): void {
    if (!this.isLoggedUser) {
      this.router.navigateByUrl('/auth/login');
    } else {
      const allSessionData = this._localStorageService.getAllSessionData();
      const sessionDataToLogout: LogOutInterface = {
        userId: allSessionData?.user.id || '',
        accessToken: allSessionData?.tokens.accessToken || '',
        accessSessionId: allSessionData?.session.accessSessionId || ''
      };
      this._authService.logout(sessionDataToLogout).subscribe({
        next: () => {
          this._authService.cleanStorageAndRedirectToLogin();
          this.user = undefined;
        },
        error: () => {
          this._authService.cleanStorageAndRedirectToLogin();
        }
      });
    }
  }
}
