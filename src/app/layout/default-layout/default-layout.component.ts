/* eslint-disable @typescript-eslint/no-unused-expressions */
import { FooterComponent } from './../components/footer/footer.component';
import { Component, inject, OnInit } from '@angular/core';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SideBarComponent } from '../components/side-bar/side-bar.component';
import { NgClass } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { UserInterface } from '../../shared/interfaces/user.interface';
import { LocalStorageService } from '../../shared/services/localStorage.service';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  imports: [
    NavBarComponent,
    RouterOutlet,
    FooterComponent,
    SideBarComponent,
    NgClass
  ],
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss'
})
export class DefaultLayoutComponent implements OnInit {
  isLoggedUser: boolean = false;
  userInfo?: UserInterface;
  private readonly _router: Router = inject(Router);
  private readonly _authService: AuthService = inject(AuthService);
  private readonly _localStorage: LocalStorageService =
    inject(LocalStorageService);
  private _subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this._subscription.add(
      this._authService._isLoggedSubject.subscribe((isLogged) => {
        this.isLoggedUser = isLogged;
        this.userInfo = this._localStorage.getUserData();
      })
    );
    this.isLoggedUser = this._authService.isAuthenticated();
    this._router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isLoggedUser = this._authService.isAuthenticated();
        this.userInfo = this._localStorage.getUserData();
      });

    this.userInfo = this._localStorage.getUserData();
  }
}
