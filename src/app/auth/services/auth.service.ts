import { LocalStorageService } from './../../shared/services/localStorage.service';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, ReplaySubject, tap } from 'rxjs';
import {
  LoginCredentials,
  LoginSuccessInterface
} from '../interfaces/login.interface';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { ApiResponseInterface } from '../../shared/interfaces/api-response.interface';
import { LogOutInterface } from '../interfaces/logout.interface';
import { Router } from '@angular/router';
import {
  ChangePassword,
  UserInterface
} from '../../shared/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _tokensStorageKey: string = '_sessionData';
  private readonly _localStorageService: LocalStorageService =
    inject(LocalStorageService);
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);
  private _refreshingToken: boolean = false;
  _isLoggedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private readonly _router: Router = inject(Router);

  /**
   * Enviar solicitud de recuperación de contraseña
   * @param email - Correo electrónico del usuario
   * @returns Observable con la respuesta del servidor
   */
  sendPasswordResetEmail(email: string): Observable<ChangePassword> {
    const endpoint = `${environment.apiUrl}auth/recovery-password`; // Endpoint para recuperar contraseña

    // Validación básica del email antes de enviar la solicitud
    if (!email || !this.isValidEmail(email)) {
      throw new Error('El correo electrónico proporcionado no es válido.');
    }

    return this._httpClient.post<ChangePassword>(endpoint, { email });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login(
    credentials: LoginCredentials
  ): Observable<ApiResponseInterface<LoginSuccessInterface>> {
    const params = this._httpUtilities.httpParamsFromObject(credentials);
    return this._httpClient
      .post<
        ApiResponseInterface<LoginSuccessInterface>
      >(`${environment.apiUrl}auth/sign-in`, params)
      .pipe(
        tap((res: ApiResponseInterface<LoginSuccessInterface>): void => {
          this.saveLocalUserData(res.data);
        })
      );
  }

  saveLocalUserData(userData: LoginSuccessInterface): void {
    localStorage.setItem(this._tokensStorageKey, JSON.stringify(userData));
  }

  logout(data: LogOutInterface): Observable<unknown> {
    const params = this._httpUtilities.httpParamsFromObject(data);
    return this._httpClient
      .post<unknown>(`${environment.apiUrl}auth/sign-out`, params)
      .pipe(
        tap(() => {
          this._localStorageService.cleanLocalStorage();
          this._isLoggedSubject.next(false);
          this._router.navigateByUrl('/auth/login');
        })
      );
  }

  isAuthenticated(): boolean {
    const userData = this._localStorageService.getAllSessionData();
    return !!userData && !!userData.tokens.accessToken;
  }

  isAuthenticatedToGuard() {
    const token = this.isAuthenticated();
    return of(!!token);
  }

  getAuthToken(): string | undefined {
    return this._localStorageService.getAllSessionData()?.tokens?.accessToken;
  }

  getRefreshToken(): string | undefined {
    return this._localStorageService.getAllSessionData()?.tokens?.refreshToken;
  }

  set setRefreshingToken(status: boolean) {
    this._refreshingToken = status;
  }

  get getRefreshingToken(): boolean {
    return this._refreshingToken;
  }

  get isLogged(): boolean {
    return !!this.getAuthToken();
  }

  refreshToken(
    refreshToken: string
  ): Observable<ApiResponseInterface<LoginSuccessInterface>> {
    this.setRefreshingToken = true;

    return this._httpClient
      .post<
        ApiResponseInterface<LoginSuccessInterface>
      >(`${environment.apiUrl}auth/refresh-token`, { refreshToken: refreshToken })
      .pipe(
        tap((response: ApiResponseInterface<LoginSuccessInterface>): void => {
          this._updateAccessToken(response?.data?.tokens?.accessToken);
          this._isLoggedEmit();
        })
      );
  }

  private _isLoggedEmit(): void {
    this._isLoggedSubject.next(this.isLogged);
  }

  private _updateAccessToken(accessToken: string): void {
    const user: LoginSuccessInterface | null =
      this._localStorageService.getAllSessionData();

    if (user) {
      user.tokens.accessToken = accessToken;
      localStorage.setItem(this._tokensStorageKey, JSON.stringify(user));
    }
  }

  cleanStorageAndRedirectToLogin(): void {
    this._localStorageService.cleanLocalStorage();
    this._isLoggedEmit();

    this._router.navigate([`auth/login`]);
  }

  getUserLoggedIn(): UserInterface {
    return this._localStorageService.getUserData();
  }
}
