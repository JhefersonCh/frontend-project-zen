import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { LocalStorageService } from '../services/localStorage.service';
import { ROLE_PERMISSIONS, ROUTE_MAP } from '../constants/menu.constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const localStorageService: LocalStorageService = inject(LocalStorageService);
  const router: Router = inject(Router);

  return authService.isAuthenticatedToGuard().pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigate(['/auth/login']);
        return false;
      }

      const userRole = localStorageService
        .getUserData()
        ?.role?.code?.toLowerCase();
      const allowedRoutes = ROLE_PERMISSIONS[userRole];
      const currentRoute = state.url;

      if (userRole === 'admin' || userRole === 'superadmin') {
        return true;
      }

      if (
        allowedRoutes &&
        allowedRoutes.some((allowedRoute) =>
          currentRoute.includes(ROUTE_MAP[allowedRoute] || allowedRoute)
        )
      ) {
        return true;
      } else {
        router.navigate(['/access-denied']);
        return false;
      }
    })
  );
};
