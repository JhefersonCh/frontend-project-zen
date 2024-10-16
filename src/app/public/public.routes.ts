import { Routes } from '@angular/router';
import { authGuard } from '../shared/guards/auth.guard';

export const publicRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent)
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./pages/about-us/about-us.component').then(
            (m) => m.AboutUsComponent
          )
      },
      {
        path: 'test',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./pages/test/test.component').then((m) => m.TestComponent)
      },
      {
        path: 'access-denied',
        loadComponent: () =>
          import('./pages/access-denied/access-denied.component').then(
            (m) => m.AccessDeniedComponent
          )
      }
    ]
  }
];
